// scripts/dispatcher-smoke-test.mjs
//
// Phase 6.0 end-to-end smoke test for the wave dispatcher.
//
// Builds a hand-crafted schema-5.4.1 fixture (no Sonnet generation —
// keeps the test deterministic and fast), runs startDispatcher against
// it, and asserts the wave timing, slot completeness, persistence
// debouncing, prompt-cache pattern, built-in gating, and replay
// behavior described in docs/phase-5-lazy-generation/08-dispatcher-
// architecture.md.
//
// Output written to smoke-test-dispatcher-output.txt (gitignored).
// Run: node scripts/dispatcher-smoke-test.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(PROJECT_ROOT, ".env.local");
const OUT_PATH = resolve(PROJECT_ROOT, "smoke-test-dispatcher-output.txt");

async function loadEnv() {
  try {
    const txt = await readFile(ENV_PATH, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["'](.*)["']$/, "$1");
      }
    }
  } catch {}
}
await loadEnv();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY not set (looked in env and .env.local)");
  process.exit(1);
}

// The dispatcher fires POST /api/generate. Node has no dev server here,
// so redirect those calls to api.anthropic.com directly and capture the
// per-call usage block so the test can assert cache_creation /
// cache_read patterns.
const REAL_FETCH = globalThis.fetch;
const callLog = []; // { kind, durationMs, cacheCreate, cacheRead, inputTokens, outputTokens, ok }
let nextCallKind = null; // set transiently by patching the dispatcher's call site below

globalThis.fetch = async (url, opts) => {
  if (typeof url === "string" && url === "/api/generate") {
    const body = JSON.parse(opts.body);
    delete body.mode;
    delete body.stream;
    const t0 = Date.now();
    const resp = await REAL_FETCH("https://api.anthropic.com/v1/messages", {
      method: opts.method || "POST",
      signal: opts.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    // Clone-read so the caller can still read the body downstream.
    const cloned = resp.clone();
    let data = null;
    try { data = await cloned.json(); } catch (e) {}
    const usage = (data && data.usage) || {};
    callLog.push({
      kind: nextCallKind || "unknown",
      durationMs: Date.now() - t0,
      cacheCreate: usage.cache_creation_input_tokens || 0,
      cacheRead: usage.cache_read_input_tokens || 0,
      inputTokens: usage.input_tokens || 0,
      outputTokens: usage.output_tokens || 0,
      ok: resp.ok,
    });
    return resp;
  }
  return REAL_FETCH(url, opts);
};

const { startDispatcher, dispatcherShouldRun } = await import(
  resolve(PROJECT_ROOT, "src/lib/ai/dispatcher.js")
);
const { collectAllNullSlots } = await import(
  resolve(PROJECT_ROOT, "src/lib/scenarios/explanationSlots.js")
);

// --- Fixture: hand-crafted schema-5.4.1 scenario ---
//
// 2 phases × (2 vitals + 1 sign + 1 lab + 1 tool + 1 med) + 2 deep dives
// = 4 (wave 1) + 2 (wave 2) + 4 (wave 3) + 2 (wave 4) + 2 (wave 5) = 14 slots.
function buildFixture() {
  return {
    schemaVersion: "5.4.1",
    id: "dispatcher-smoke-fixture",
    source: "ai",
    title: "Dispatcher Smoke Test",
    subtitle: "Pediatric septic shock — hand-crafted, no AI authoring",
    patientCard: {
      name: "Test Patient",
      age: "6 months",
      weight: "7.5 kg",
      sex: "Male"
    },
    phases: [
      {
        phaseIndex: 0,
        stageType: "assess",
        title: "Initial Assessment",
        narrative: "Six-month-old presenting with fever, lethargy, and poor perfusion after 24 hours of decreased intake. EMS established peripheral IV en route. Mother reports no urine output in 12 hours.",
        // Phase 6.1: vitals is an array under schema 5.4.1.
        vitals: [
          { id: "hr", label: "HR", value: "192", unit: "bpm", bad: true, cat: "vital", _slotRef: "phase[0].vitals.hr.why", why: null },
          { id: "spo2", label: "SpO2", value: "92", unit: "%", bad: true, cat: "vital", _slotRef: "phase[0].vitals.spo2.why", why: null }
        ],
        signs: [
          { id: "mottling", label: "Mottling", finding: "Reticular purplish pattern across torso", pos: "body", sys: "Integumentary", bad: true, cat: "clinical", _slotRef: "phase[0].signs.mottling.why", why: null }
        ],
        labs: [
          { id: "lactate", name: "Lactate", value: "5.2", unit: "mmol/L", ref: "0.5-2.0", critical: true, bad: true, cat: "lab", _slotRef: "phase[0].labs.lactate.why", why: null }
        ],
        actions: {
          tools: {
            ioAccess: { id: "ioAccess", label: "Establish IO Access", priority: "correct", ok: true, _slotRef: "phase[0].actions.tools.ioAccess.fb", fb: null }
          },
          meds: {
            nsBolus: { id: "nsBolus", label: "NS 20 mL/kg bolus", priority: "correct", ok: true, _slotRef: "phase[0].actions.meds.nsBolus.fb", fb: null }
          }
        }
      },
      {
        phaseIndex: 1,
        stageType: "intervene",
        title: "Escalation",
        narrative: "After initial fluid bolus, the patient remains tachycardic with persistent cool extremities. Lactate is rising; cap refill 4 seconds.",
        vitals: [
          { id: "hr", label: "HR", value: "198", unit: "bpm", bad: true, cat: "vital", _slotRef: "phase[1].vitals.hr.why", why: null },
          { id: "sbp", label: "SBP", value: "62", unit: "mmHg", bad: true, cat: "vital", _slotRef: "phase[1].vitals.sbp.why", why: null }
        ],
        signs: [
          { id: "capRefill", label: "Cap refill 4s", finding: "Capillary refill prolonged to 4 seconds", pos: "body", sys: "Cardiovascular", bad: true, cat: "clinical", _slotRef: "phase[1].signs.capRefill.why", why: null }
        ],
        labs: [
          { id: "ph", name: "Arterial pH", value: "7.18", unit: "", ref: "7.35-7.45", critical: true, bad: true, cat: "lab", _slotRef: "phase[1].labs.ph.why", why: null }
        ],
        actions: {
          tools: {
            cardiacMonitor: { id: "cardiacMonitor", label: "Continuous cardiac monitor", priority: "correct", ok: true, _slotRef: "phase[1].actions.tools.cardiacMonitor.fb", fb: null }
          },
          meds: {
            epiIV: { id: "epiIV", label: "Epinephrine IV infusion", priority: "correct", ok: true, _slotRef: "phase[1].actions.meds.epiIV.fb", fb: null }
          }
        }
      }
    ],
    debrief: {
      summary: "Pediatric septic shock with progression to vasopressor requirement.",
      physiologyDeepDive: [
        { id: "septic-shock-mechanism", title: "Septic Shock Mechanism in Infants", _slotRef: "debrief.physiologyDeepDive.septic-shock-mechanism.content", content: null },
        { id: "fluid-vs-pressor-sequencing", title: "Fluid Before Pressors in Pediatric Septic Shock", _slotRef: "debrief.physiologyDeepDive.fluid-vs-pressor-sequencing.content", content: null }
      ]
    }
  };
}

const lines = [];
function log(s) { lines.push(s); console.log(s); }

log("=== Phase 6.0 dispatcher smoke test ===");

// --- Pre-flight: collectAllNullSlots returns expected grouping ---
const fixture = buildFixture();
const slots = collectAllNullSlots(fixture);
const byWave = slots.reduce((acc, s) => { (acc[s.wave] = acc[s.wave] || []).push(s); return acc; }, {});
log("Slot inventory by wave:");
for (let w = 1; w <= 5; w++) {
  const n = (byWave[w] || []).length;
  log("  wave " + w + ": " + n + " slot(s)");
}
const expectedCounts = { 1: 4, 2: 2, 3: 4, 4: 2, 5: 2 };
const inventoryProblems = [];
for (let w = 1; w <= 5; w++) {
  if ((byWave[w] || []).length !== expectedCounts[w]) {
    inventoryProblems.push("wave " + w + ": expected " + expectedCounts[w] + ", got " + (byWave[w] || []).length);
  }
}

// --- Wave-timing capture ---
const waveStartedAt = {};
const waveCompletedAt = {};
let persistCount = 0;
let refreshCount = 0;
let waveCounter = 0;

// Wrap persist callback to record per-wave timing. We don't know the
// wave index inside the callback, but waves persist sequentially, so a
// counter is sufficient.
function persistCallback(sc) {
  waveCounter += 1;
  waveCompletedAt[waveCounter] = Date.now();
  persistCount += 1;
  log("  [persist] wave " + waveCounter + " completed at +" + (Date.now() - t0) + " ms; total persists: " + persistCount);
}

function refreshCallback() {
  refreshCount += 1;
}

// Tag each fetch call with the wave's kind via the dispatcher's natural
// flow: per-item for waves 1-4, deep-dive for wave 5. We don't have a
// hook for "wave is starting," so we track via call-log ordering and
// the cache_creation field (per-item first call vs deep-dive first call).
// nextCallKind exists only to label log lines for human readability;
// assertions read from callLog directly.

const t0 = Date.now();
log("");
log("--- Run 1: full populate ---");

let allWavesDoneResolve;
const allWavesDone = new Promise((res) => { allWavesDoneResolve = res; });

const controller = new AbortController();
const hooks = {
  onWaveOneComplete: function () { log("  [hook] onWaveOneComplete at +" + (Date.now() - t0) + " ms"); },
  onAllWavesComplete: function () { log("  [hook] onAllWavesComplete at +" + (Date.now() - t0) + " ms"); allWavesDoneResolve(); },
  onAbort: function () { log("  [hook] onAbort fired"); allWavesDoneResolve(); }
};

waveStartedAt[1] = Date.now();
try {
  await startDispatcher(fixture, controller, persistCallback, refreshCallback, hooks);
} catch (err) {
  log("startDispatcher threw on wave 1: " + (err && err.message || err));
  await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
  process.exit(1);
}
await allWavesDone;

log("");
log("=== Run 1 complete ===");
log("Total elapsed:        " + (Date.now() - t0) + " ms");
log("Total API calls:      " + callLog.length);
log("Persist callback hits: " + persistCount);
log("Refresh callback hits: " + refreshCount);

// --- Assertions ---
const problems = [];
if (inventoryProblems.length) problems.push.apply(problems, inventoryProblems);

// 1. persistCount === 5
if (persistCount !== 5) problems.push("expected 5 persistCallback fires, got " + persistCount);

// 2. All slots populated (no null why/fb/content remain).
const leftover = collectAllNullSlots(fixture);
if (leftover.length > 0) {
  problems.push("expected zero null slots after dispatcher; got " + leftover.length + ": " + leftover.map(s => s.slotRefString).join(", "));
}

// 3. Cache pattern: first per-item call has cache_create > 0; later
//    per-item calls show cache_read > 0. First deep-dive call has
//    cache_create > 0 (separate prefix).
const perItemCalls = callLog.slice(0, callLog.length - expectedCounts[5]);
const deepDiveCalls = callLog.slice(callLog.length - expectedCounts[5]);
const firstPerItem = perItemCalls[0];
const firstDeepDive = deepDiveCalls[0];

if (!firstPerItem || firstPerItem.cacheCreate <= 0) {
  problems.push("first per-item call should have cache_creation > 0; got " + (firstPerItem && firstPerItem.cacheCreate));
}
const subsequentPerItemReads = perItemCalls.slice(1).filter(c => c.cacheRead > 0).length;
const subsequentPerItemCount = Math.max(0, perItemCalls.length - 1);
if (subsequentPerItemCount > 0 && subsequentPerItemReads === 0) {
  problems.push("at least one subsequent per-item call should show cache_read > 0; saw 0 of " + subsequentPerItemCount);
}
if (!firstDeepDive || firstDeepDive.cacheCreate <= 0) {
  problems.push("first deep-dive call should have cache_creation > 0; got " + (firstDeepDive && firstDeepDive.cacheCreate));
}

log("");
log("Cache pattern:");
log("  first per-item:        cache_create=" + (firstPerItem ? firstPerItem.cacheCreate : "n/a") + " cache_read=" + (firstPerItem ? firstPerItem.cacheRead : "n/a"));
log("  later per-item reads:  " + subsequentPerItemReads + " of " + subsequentPerItemCount);
log("  first deep-dive:       cache_create=" + (firstDeepDive ? firstDeepDive.cacheCreate : "n/a") + " cache_read=" + (firstDeepDive ? firstDeepDive.cacheRead : "n/a"));

// 4. Wave timing: persist N-1 must have completed before persist N began.
//    The proxy is monotonic timestamps in waveCompletedAt.
let timingOK = true;
for (let w = 2; w <= 5; w++) {
  if (!waveCompletedAt[w - 1] || !waveCompletedAt[w]) continue;
  if (waveCompletedAt[w] < waveCompletedAt[w - 1]) {
    timingOK = false;
    problems.push("wave " + w + " persisted before wave " + (w - 1));
  }
}
log("");
log("Wave persist timestamps (ms from start):");
for (let w = 1; w <= 5; w++) {
  if (waveCompletedAt[w]) log("  wave " + w + ": +" + (waveCompletedAt[w] - t0) + " ms");
}

// --- Run 2: replay on the now-populated fixture should be a no-op ---
log("");
log("--- Run 2: replay (no-op expected) ---");
const callCountBeforeReplay = callLog.length;
const persistsBeforeReplay = persistCount;
const ctrl2 = new AbortController();
let allDoneReplay;
const replayDone = new Promise((res) => { allDoneReplay = res; });
const replayHooks = { onAllWavesComplete: function () { allDoneReplay(); }, onWaveOneComplete: function () {}, onAbort: function () { allDoneReplay(); } };
await startDispatcher(fixture, ctrl2, persistCallback, refreshCallback, replayHooks);
// Give the background chain a moment in case the hook didn't fire
// (it won't if dispatcherShouldRun returns false synchronously).
await new Promise((r) => setTimeout(r, 50));
const replayCalls = callLog.length - callCountBeforeReplay;
const replayPersists = persistCount - persistsBeforeReplay;
log("Replay API calls:     " + replayCalls + " (expected 0)");
log("Replay persists:      " + replayPersists + " (expected 0)");
if (replayCalls !== 0) problems.push("replay fired " + replayCalls + " API call(s) — expected 0");
if (replayPersists !== 0) problems.push("replay persisted " + replayPersists + " time(s) — expected 0");

// --- Run 3: built-in gating ---
log("");
log("--- Run 3: built-in gate (source=builtin) ---");
const fresh = buildFixture();
fresh.source = "builtin";
const shouldRun = dispatcherShouldRun(fresh);
log("dispatcherShouldRun for builtin: " + shouldRun + " (expected false)");
if (shouldRun !== false) problems.push("dispatcherShouldRun returned " + shouldRun + " for builtin; expected false");
const callCountBeforeBuiltin = callLog.length;
const persistsBeforeBuiltin = persistCount;
const ctrl3 = new AbortController();
await startDispatcher(fresh, ctrl3, persistCallback, refreshCallback, { onAllWavesComplete: function () {}, onWaveOneComplete: function () {}, onAbort: function () {} });
await new Promise((r) => setTimeout(r, 50));
const builtinCalls = callLog.length - callCountBeforeBuiltin;
const builtinPersists = persistCount - persistsBeforeBuiltin;
log("Built-in API calls:   " + builtinCalls + " (expected 0)");
log("Built-in persists:    " + builtinPersists + " (expected 0)");
if (builtinCalls !== 0) problems.push("built-in fired " + builtinCalls + " API call(s) — expected 0");
if (builtinPersists !== 0) problems.push("built-in persisted " + builtinPersists + " time(s) — expected 0");

log("");
log("=== ASSERTIONS ===");
if (problems.length === 0) {
  log("All assertions PASSED.");
} else {
  log("PROBLEMS:");
  problems.forEach(function (p) { log("  - " + p); });
}

// Dump per-call details for debugging.
log("");
log("=== PER-CALL LOG ===");
callLog.forEach(function (c, i) {
  log("  [" + i + "] " + c.durationMs + "ms  in=" + c.inputTokens + "  out=" + c.outputTokens +
      "  cache_create=" + c.cacheCreate + "  cache_read=" + c.cacheRead +
      "  ok=" + c.ok);
});

await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
log("");
log("Output saved to: " + OUT_PATH);
process.exit(problems.length > 0 ? 1 : 0);
