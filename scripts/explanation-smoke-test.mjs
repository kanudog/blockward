// scripts/explanation-smoke-test.mjs
//
// End-to-end smoke test for fetchExplanations (Phase 5.2).
//
// Loads the project's ANTHROPIC_API_KEY from .env.local, monkey-patches
// global fetch to redirect /api/generate calls straight to Anthropic
// (since the Vercel proxy isn't running locally for a Node script),
// then imports the production fetchExplanations and exercises it against
// a synthetic scenario + 4-item mixed-type test set.
//
// Verifies:
//   - All 4 items resolve to a populated explanation paragraph
//   - First (warmup) call shows cache_creation_input_tokens > 0
//   - Subsequent parallel calls show cache_read_input_tokens > 0
//   - Each explanation body is roughly 60-120 words and clinically
//     reasonable on visual inspection
//
// Not committed; safe to delete. Run: node scripts/explanation-smoke-test.mjs

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
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY not set (looked in env and .env.local)");
  process.exit(1);
}

// Monkey-patch global fetch so fetchExplanations' "/api/generate" call
// reaches Anthropic directly. Production code path uses the Vercel
// serverless proxy; this test exercises the same client function but
// short-circuits the proxy hop.
const REAL_FETCH = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (typeof url === "string" && url === "/api/generate") {
    const body = JSON.parse(opts.body);
    delete body.mode;    // proxy-only field; Anthropic doesn't accept it
    delete body.stream;  // explanation path is non-streaming anyway
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

// Import the production module AFTER patching fetch.
const PROJECT_ROOT = resolve(__dirname, "..");
const clientPath = resolve(PROJECT_ROOT, "src/lib/ai/client.js");
const { fetchExplanations } = await import(clientPath);

// Synthetic scenario context. Picks plausible pediatric patient details
// that sit inside Block Ward's normal range of cases.
const scenario = {
  id: "smoke-test-scenario",
  source: "ai",
  title: "Septic Shock in a Six-Month-Old",
  patient: {
    ageLabel: "6 months",
    weightKg: 7.5,
    sex: "Male",
    cc: "Fever and lethargy x 24 hours",
    history: "Previously healthy, decreased oral intake, no wet diapers x 8 hours.",
  },
};

// Four items mixing types. IDs follow the canonical-ID scheme
// (canonicalize.js) so the smoke test mirrors what Phase 5.3 will
// actually call with.
const items = [
  {
    id: "vital:hr",
    type: "vital",
    label: "HR 192 bpm",
    context: { value: 192, unit: "bpm", normalRange: [100, 160] },
  },
  {
    id: "lab:Lactate",
    type: "lab",
    label: "Lactate 5.8 mmol/L",
    context: { value: 5.8, unit: "mmol/L", ref: "0.5-2.0", critical: true, prior: 2.8 },
  },
  {
    id: "sign:Mottling",
    type: "sign",
    label: "Mottling",
    context: { finding: "Reticular purplish pattern, bilateral lower extremities", system: "Integumentary" },
  },
  {
    id: "med:defib",
    type: "med",
    label: "Defibrillation",
    context: { indicated: false, scenarioRhythm: "sinus tachycardia", rationale: "wrong-but-tempting distractor" },
  },
];

const callLog = [];
function onCallComplete(info) {
  callLog.push(info);
  const u = info.usage || {};
  const sz = info.body ? info.body.split(/\s+/).filter(Boolean).length : 0;
  console.log(
    `  call#${info.idx}  ${info.item.id.padEnd(18)}  ${String(info.durationMs).padStart(5)}ms  ` +
    `in=${String(u.input_tokens || 0).padStart(4)}  ` +
    `cc=${String(u.cache_creation_input_tokens || 0).padStart(5)}  ` +
    `cr=${String(u.cache_read_input_tokens || 0).padStart(5)}  ` +
    `out=${String(u.output_tokens || 0).padStart(4)}  ` +
    `body=${info.body ? sz + "w" : "MISSING"}`
  );
}

console.log("=== fetchExplanations smoke test ===");
console.log("Items:", items.map(i => i.id).join(", "));
console.log("");
console.log("Per-call usage:");

const t0 = Date.now();
const result = await fetchExplanations(scenario, items, undefined, onCallComplete);
const totalMs = Date.now() - t0;

console.log("");
console.log("Total wall-clock:", totalMs, "ms");

// Validation
console.log("");
console.log("=== Validation ===");
let ok = true;
const requested = items.map(i => i.id);
const returned = Object.keys(result);
console.log("Requested:", requested.length, "items");
console.log("Returned: ", returned.length, "items");
if (returned.length !== requested.length) {
  console.log("FAIL: not all items resolved");
  console.log("  missing:", requested.filter(id => !result[id]));
  ok = false;
} else {
  console.log("PASS: all items resolved");
}

// Word-count check (60-120 per spec)
let wordCountIssues = 0;
for (const id of returned) {
  const wc = result[id].split(/\s+/).filter(Boolean).length;
  if (wc < 50 || wc > 140) {  // small tolerance around the 60-120 target
    console.log(`  word count out of range for ${id}: ${wc}w`);
    wordCountIssues++;
  }
}
if (wordCountIssues === 0) console.log("PASS: all explanations within ~60-120 word target");
else console.log(`WARN: ${wordCountIssues} explanation(s) outside 60-120 word range`);

// Cache behavior
const first = callLog[0];
const rest = callLog.slice(1);
const firstHadCacheCreate = first && (first.usage.cache_creation_input_tokens || 0) > 0;
const anyRestHadCacheRead = rest.some(c => (c.usage.cache_read_input_tokens || 0) > 0);
console.log("");
console.log("Cache behavior:");
console.log("  Warmup call had cache_create > 0:", firstHadCacheCreate ? "YES" : "NO");
console.log("  Subsequent calls had cache_read > 0:", anyRestHadCacheRead ? "YES" : "NO");
if (!firstHadCacheCreate) {
  console.log("  WARN: warmup call did not write cache — system prompt may be below 4096-token minimum");
  ok = false;
}
if (!anyRestHadCacheRead) {
  console.log("  WARN: no parallel call read from cache — race rate is 100%, investigate");
}

// Print bodies
console.log("");
console.log("=== Returned explanations ===");
for (const id of returned) {
  console.log("");
  console.log("--- " + id + " ---");
  console.log(result[id]);
}

console.log("");
console.log(ok ? "OVERALL: PASS" : "OVERALL: FAIL");
process.exit(ok ? 0 : 1);
