// Phase 6.0 — wave-based Haiku dispatcher.
//
// Consumes a Sonnet-generated scenario skeleton with null why/fb/content
// slots and fires Haiku calls in five priority waves to fill them. Waves
// are sequential (wave N awaits wave N-1's completion via .then() chain)
// but calls within a wave fan out in parallel after the first call warms
// the Anthropic prompt cache. Mirrors _explanationSingleCall in client.js
// for per-call mechanics; generalized to per-item AND deep-dive prompts.
//
// Wave 5 amendment (Phase 6.0, 2026-05-26): originally specified to fire
// on debrief screen mount. Amended to fire in the same .then() chain as
// waves 2-4 — eliminates cache-TTL exposure (all waves complete in a
// tight cluster inside the 5-minute default) and matches user intent
// that filling continues automatically without screen-navigation gating.
//
// Architecture: docs/phase-5-lazy-generation/08-dispatcher-architecture.md

import { HAIKU_MODEL_ID, buildPerItemExplanationPrompt, buildDeepDivePrompt } from "./prompt.js";
import { buildPerItemUserMessage, buildDeepDiveUserMessage } from "./userMessages.js";
import { parseDelimitedDeepDives } from "./client.js";
import { collectAllNullSlots } from "../scenarios/explanationSlots.js";
import { parseSlotRefString, writeExplanationToSlot } from "../scenarios/slotResolve.js";

function _sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// Public wrapper around fireSingleCall for ad-hoc on-demand fills
// (e.g., ActionPanel's "Why?" popup against a synthesized-fallback chip).
// Mutates `scenario` in place via writeExplanationToSlot. Throws on
// AbortError; resolves with no return value on success or non-abort
// failure (the slot stays null and the caller can render a retry).
export async function fetchSingleSlot(scenario, slotRefString, kind, signal) {
  if (!scenario || !slotRefString) return;
  var k = (kind === "deep-dive") ? "deep-dive" : "per-item";
  await fireSingleCall({ slotRefString: slotRefString, kind: k }, k, scenario, signal);
}

// Decide whether the dispatcher should run at all for this scenario.
// Built-ins gate out (their slots are pre-populated by author). AI
// scenarios with all slots already filled (replay) gate out too —
// nothing to do, no API calls, no loading state.
export function dispatcherShouldRun(scenario) {
  if (!scenario) return false;
  if (scenario.source !== "ai") return false;
  var slots = collectAllNullSlots(scenario);
  return slots.length > 0;
}

// Group an array of slot descriptors by .wave. Returns an object whose
// keys are wave numbers (1..5) and whose values are arrays of slots.
function _groupByWave(slots) {
  var by = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  slots.forEach(function (s) {
    if (by[s.wave]) by[s.wave].push(s);
  });
  return by;
}

// Single Haiku call for one slot. Retries once after 1s on non-abort
// failure. On second failure, logs a warning and resolves (slot stays
// null — UI shows empty content per the architecture's failure policy).
// On abort, throws AbortError so the caller can propagate.
async function fireSingleCall(slot, kind, scenario, signal) {
  var systemPrompt = (kind === "deep-dive")
    ? buildDeepDivePrompt()
    : buildPerItemExplanationPrompt();
  var userMessage = (kind === "deep-dive")
    ? buildDeepDiveUserMessage(scenario, slot.slotRefString)
    : buildPerItemUserMessage(scenario, slot.slotRefString);

  var body = JSON.stringify({
    model: HAIKU_MODEL_ID,
    max_tokens: 8000,
    mode: "explanation",
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMessage }]
  });

  var resp;
  var lastErr = null;
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: signal,
        body: body
      });
    } catch (e) {
      if (e && e.name === "AbortError") throw e;
      lastErr = e;
      if (attempt === 0) { await _sleep(1000); continue; }
      console.warn("[dispatcher] " + slot.slotRefString + " — network error, leaving slot null: " + (e.message || e));
      return { usage: {} };
    }
    if (resp.ok) break;
    var transient = resp.status >= 500 || resp.status === 429;
    if (transient && attempt === 0) { await _sleep(1000); continue; }
    console.warn("[dispatcher] " + slot.slotRefString + " — HTTP " + resp.status + ", leaving slot null");
    return { usage: {} };
  }

  var raw;
  try { raw = await resp.text(); }
  catch (e) {
    if (e && e.name === "AbortError") throw e;
    console.warn("[dispatcher] " + slot.slotRefString + " — failed to read body: " + (e.message || e));
    return { usage: {} };
  }

  var data;
  try { data = JSON.parse(raw); }
  catch (je) {
    console.warn("[dispatcher] " + slot.slotRefString + " — non-JSON response, leaving slot null");
    return { usage: {} };
  }
  if (data.error) {
    console.warn("[dispatcher] " + slot.slotRefString + " — API error: " + (data.error.message || "(no message)"));
    return { usage: data.usage || {} };
  }

  var text = "";
  (data.content || []).forEach(function (b) {
    if (b && b.type === "text" && b.text) text += b.text;
  });
  var parsed = parseDelimitedDeepDives(text);
  var keys = Object.keys(parsed);
  var parsedBody = keys.length > 0 ? parsed[keys[0]] : null;
  if (!parsedBody) {
    console.warn("[dispatcher] " + slot.slotRefString + " — no ###ITEM block in response, leaving slot null");
    return { usage: data.usage || {} };
  }

  var ref = parseSlotRefString(slot.slotRefString);
  if (!ref) {
    console.warn("[dispatcher] " + slot.slotRefString + " — slot ref did not parse, dropping result");
    return { usage: data.usage || {} };
  }
  var hit = writeExplanationToSlot(scenario, ref, parsedBody);
  if (!hit) {
    console.warn("[dispatcher] " + slot.slotRefString + " — slot not found in scenario, dropping result");
  }
  return { usage: data.usage || {} };
}

// Run one wave: warmup the cache (if not already warmed for this kind),
// then fire the remaining slots in parallel. After the wave settles,
// invoke onWaveComplete(scenario) so the caller can persist + refresh.
//
// cacheState is mutated by reference: setting perItemCacheWarmed /
// deepDiveCacheWarmed to true after the first call of each kind
// completes, so subsequent waves of the same kind skip warmup.
//
// The await before the parallel batch is load-bearing: Anthropic
// registers the cache prefix when the first call completes, not when
// it starts. Without the await, subsequent calls race-write the cache.
export async function runWave(slots, kind, scenario, signal, cacheState, onWaveComplete) {
  if (!Array.isArray(slots) || slots.length === 0) return;

  var warmupNeeded = (kind === "deep-dive" && !cacheState.deepDiveCacheWarmed)
                  || (kind === "per-item" && !cacheState.perItemCacheWarmed);

  var remaining = slots;
  if (warmupNeeded) {
    await fireSingleCall(slots[0], kind, scenario, signal);
    if (kind === "deep-dive") cacheState.deepDiveCacheWarmed = true;
    else cacheState.perItemCacheWarmed = true;
    remaining = slots.slice(1);
  }

  if (remaining.length > 0) {
    var calls = remaining.map(function (slot) { return fireSingleCall(slot, kind, scenario, signal); });
    await Promise.all(calls);
  }

  if (typeof onWaveComplete === "function") {
    try { onWaveComplete(scenario); } catch (e) { /* persistence is best-effort */ }
  }
}

// Orchestration entry point. Walks slots, groups by wave, runs waves
// 1 → 2 → 3 → 4 → 5 in sequence. Wave 1 is awaited (the caller awaits
// us up to that point to gate the Assess button on its completion);
// waves 2-5 run in a background .then() chain.
//
// Lifecycle hooks (all optional, all wrapped in try/catch):
//   onWaveOneComplete()       fires after wave 1 settles + persists
//   onAllWavesComplete()      fires after wave 5 settles + persists
//   onAbort(err)              fires if any wave throws AbortError
//
// Per-wave debouncing: persistCallback(scenario) is invoked once after
// each wave settles (5 writes per scenario for a full populate), not
// once per slot. refreshCallback() triggers React re-render after each
// wave so the user sees populated chips as waves land.
export async function startDispatcher(scenario, abortController, persistCallback, refreshCallback, hooks) {
  if (!dispatcherShouldRun(scenario)) return;

  var signal = abortController ? abortController.signal : undefined;
  var cacheState = { perItemCacheWarmed: false, deepDiveCacheWarmed: false };
  var h = hooks || {};

  var slotsByWave = _groupByWave(collectAllNullSlots(scenario));

  function onWaveComplete(sc) {
    if (typeof persistCallback === "function") {
      try { persistCallback(sc); } catch (e) { /* best-effort */ }
    }
    if (typeof refreshCallback === "function") {
      try { refreshCallback(); } catch (e) { /* best-effort */ }
    }
  }

  // Wave 1: awaited. Gates the Assess button via onWaveOneComplete.
  try {
    await runWave(slotsByWave[1], "per-item", scenario, signal, cacheState, onWaveComplete);
  } catch (err) {
    if (err && err.name === "AbortError") {
      if (typeof h.onAbort === "function") { try { h.onAbort(err); } catch (e) {} }
      return;
    }
    throw err;
  }
  if (typeof h.onWaveOneComplete === "function") {
    try { h.onWaveOneComplete(); } catch (e) { /* best-effort */ }
  }

  // Waves 2-5: background chain. Not awaited by caller — the dispatcher
  // returns once wave 1 is done, and the rest fire on their own.
  runWave(slotsByWave[2], "per-item", scenario, signal, cacheState, onWaveComplete)
    .then(function () { return runWave(slotsByWave[3], "per-item", scenario, signal, cacheState, onWaveComplete); })
    .then(function () { return runWave(slotsByWave[4], "per-item", scenario, signal, cacheState, onWaveComplete); })
    .then(function () { return runWave(slotsByWave[5], "deep-dive", scenario, signal, cacheState, onWaveComplete); })
    .then(function () {
      if (typeof h.onAllWavesComplete === "function") {
        try { h.onAllWavesComplete(); } catch (e) {}
      }
    })
    .catch(function (err) {
      if (err && err.name === "AbortError") {
        if (typeof h.onAbort === "function") { try { h.onAbort(err); } catch (e) {} }
        return;
      }
      console.warn("[dispatcher] background wave chain failed: " + (err && err.message || err));
    });
}
