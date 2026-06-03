// scripts/lazy-flow-smoke-test.mjs
//
// End-to-end smoke test for the Phase 5.3 lazy-fetch wiring without
// the UI. Builds a synthetic AI scenario with stripped why/fb in
// phase 2, calls collectMissingExplanationSlots + fetchExplanations
// directly, and verifies the slots populate correctly via
// writeExplanationToSlot.
//
// Useful to confirm the data flow works without spinning up the
// browser / dev server. Not committed.
//
// Run: node scripts/lazy-flow-smoke-test.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, "..", ".env.local");

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
if (!API_KEY) { console.error("ANTHROPIC_API_KEY not set"); process.exit(1); }

// Same /api/generate -> Anthropic redirect as explanation-smoke-test.mjs.
const REAL_FETCH = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (typeof url === "string" && url === "/api/generate") {
    const body = JSON.parse(opts.body);
    delete body.mode;
    delete body.stream;
    return REAL_FETCH("https://api.anthropic.com/v1/messages", {
      method: opts.method || "POST",
      signal: opts.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
  }
  return REAL_FETCH(url, opts);
};

const PROJECT_ROOT = resolve(__dirname, "..");
const { fetchExplanations } = await import(resolve(PROJECT_ROOT, "src/lib/ai/client.js"));
const { collectMissingExplanationSlots } = await import(resolve(PROJECT_ROOT, "src/lib/scenarios/explanationSlots.js"));
const { resolveSlotText, writeExplanationToSlot, SYNTHESIZED_FB_FALLBACK } = await import(resolve(PROJECT_ROOT, "src/lib/scenarios/slotResolve.js"));

// Synthetic AI scenario. Phase 1 keeps full why/fb (Phase 1 stays in
// main generation). Phase 2 has stripped why/fb plus a synthesized
// fb on one tool to exercise the SYNTHESIZED_FB_FALLBACK path.
const scenario = {
  id: "smoke-lazy-flow",
  source: "ai",
  title: "Septic Shock in a Six-Month-Old (smoke test)",
  patient: { ageLabel: "6 months", weightKg: 7.5, sex: "Male", cc: "Fever and lethargy x 24 hours" },
  norms: { hr: [100, 160], rr: [25, 40], sbp: [70, 90], dbp: [40, 60], spo2: [95, 100], temp: [36.5, 37.5] },
  phases: [
    { id: "triage", name: "Triage", narrative: "...", vitals: { hr: 178, rr: 42, sbp: 72, dbp: 45, spo2: 98, temp: 39.2, cap: 2.5 },
      signs: [{ label: "Mottling", finding: "Reticular purplish pattern", pos: "body", sys: "Integumentary", why: "(phase 1 explanation populated by main generation)" }],
      assessItems: [{ id: "hr1", label: "HR 178", cat: "vital", bad: true, why: "(phase 1 explanation populated)" }],
      labs: [{ name: "Lactate", value: "2.8", unit: "mmol/L", ref: "0.5-2.0", critical: true, why: "(phase 1 explanation populated)" }],
      tools: null, meds: null, actions: null },
    { id: "escalation", name: "Escalation",
      narrative: "...",
      vitals: { hr: 192, rr: 52, sbp: 68, dbp: 40, spo2: 97, temp: 39.0, cap: 4 },
      signs: [
        { label: "Mottling", finding: "Worsening reticular pattern", pos: "body", sys: "Integumentary" /* why MISSING */ },
        { label: "Pulses", finding: "Weak peripheral, central palpable", pos: "body", sys: "Cardiovascular" /* why MISSING */ }
      ],
      assessItems: [
        { id: "hr2", label: "HR 192", cat: "vital", bad: true /* why MISSING */ },
        { id: "lac2", label: "Lactate 5.8 mmol/L", cat: "lab", bad: true /* why MISSING */ },
        { id: "mott2", label: "Mottling", cat: "clinical", bad: true /* why MISSING */ }
      ],
      labs: [{ name: "Lactate", value: "5.8", unit: "mmol/L", ref: "0.5-2.0", critical: true /* why MISSING */ }],
      tools: ["ivKit", "defib"], meds: ["nsBolus"],
      actions: { tools: {
        ivKit: { ok: true, pri: 1 /* fb MISSING */ },
        defib: { ok: false, pri: null, fb: SYNTHESIZED_FB_FALLBACK }   // synthesized fallback path
      }, meds: {
        nsBolus: { ok: true, pri: 2 /* fb MISSING */ }
      } }
    }
  ],
  curveball: null,
  debrief: { summary: "complete", explainers: [] }
};

console.log("=== Lazy-flow smoke test ===\n");

// Step 1: walk phase 2 and collect missing slots.
const slots = collectMissingExplanationSlots(scenario, 1);
console.log("collectMissingExplanationSlots(scenario, 1):");
for (const s of slots) {
  console.log("  - " + s.id.padEnd(22) + "  type=" + s.type.padEnd(12) + "  slotRef.kind=" + s._slotRef.kind);
}
console.log("Total missing slots:", slots.length, "(expected 7+ based on test scenario)");
console.log("");

// Step 2: fetch explanations for all missing slots.
const callLog = [];
function onCallComplete(info) {
  callLog.push(info);
  const u = info.usage || {};
  const wc = info.body ? info.body.split(/\s+/).filter(Boolean).length : 0;
  console.log(
    `  call#${info.idx}  ${info.item.id.padEnd(22)}  ${String(info.durationMs).padStart(5)}ms  ` +
    `cc=${String(u.cache_creation_input_tokens || 0).padStart(5)}  ` +
    `cr=${String(u.cache_read_input_tokens || 0).padStart(5)}  ` +
    `body=${info.body ? wc + "w" : "MISSING"}`
  );
}
console.log("Per-call usage:");
const t0 = Date.now();
const result = await fetchExplanations(scenario, slots, undefined, onCallComplete);
const totalMs = Date.now() - t0;
console.log("");
console.log("Total wall-clock:", totalMs, "ms");
console.log("Returned:", Object.keys(result).length, "explanations");
console.log("");

// Step 3: verify writeExplanationToSlot puts the text in the right place.
console.log("=== Validation ===");
let ok = true;
for (const s of slots) {
  const text = result[s.id];
  if (!text) { console.log("FAIL: no text returned for " + s.id); ok = false; continue; }
  // Apply write-back (this is what the production onCallComplete also does).
  const hit = writeExplanationToSlot(scenario, s._slotRef, text);
  if (!hit) { console.log("FAIL: writeExplanationToSlot found no slot for " + s.id); ok = false; continue; }
  // Verify resolveSlotText now returns it.
  const resolved = resolveSlotText(scenario, s._slotRef);
  if (resolved !== text) {
    console.log("FAIL: resolveSlotText mismatch for " + s.id + " (resolved=" + (resolved ? resolved.slice(0, 50) : "null") + ")");
    ok = false;
  } else {
    console.log("PASS: " + s.id + "  (write+read round-trip)");
  }
}

// Re-walk after writes — should now be empty.
const slotsAfter = collectMissingExplanationSlots(scenario, 1);
console.log("");
console.log("After write-back, collectMissingExplanationSlots returns:", slotsAfter.length, "slots (expected 0)");
if (slotsAfter.length !== 0) {
  console.log("FAIL: residual missing slots:", slotsAfter.map(s => s.id));
  ok = false;
}

// Cache behavior sanity check (matches explanation-smoke-test.mjs).
const first = callLog[0];
const rest = callLog.slice(1);
const firstHadCacheCreate = first && (first.usage.cache_creation_input_tokens || 0) > 0;
const anyRestHadCacheRead = rest.some(c => (c.usage.cache_read_input_tokens || 0) > 0);
console.log("");
console.log("Cache: warmup wrote=" + (firstHadCacheCreate ? "YES" : "NO") + ", parallel read=" + (anyRestHadCacheRead ? "YES" : "NO"));
if (!firstHadCacheCreate || !anyRestHadCacheRead) {
  console.log("WARN: cache behavior unexpected — re-check buildExplanationPrompt token count");
}

console.log("");
console.log(ok ? "OVERALL: PASS" : "OVERALL: FAIL");
process.exit(ok ? 0 : 1);
