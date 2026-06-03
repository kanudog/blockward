// scripts/orchestrator-smoke-test.mjs
//
// Phase 5.4.2 smoke test. Calls buildOrchestratorPrompt() against the
// live Anthropic API with a hardcoded test scenario and saves three
// artifacts for human review:
//   smoke-test-orchestrator-call.json   — parsed scenario JSON
//   smoke-test-orchestrator-usage.json  — response.usage block
//   smoke-test-orchestrator-raw.txt     — unmodified streamed text
//
// All three files are gitignored test outputs, not source. No commits.
//
// Run: node scripts/orchestrator-smoke-test.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(PROJECT_ROOT, ".env.local");

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

const promptModulePath = resolve(PROJECT_ROOT, "src/lib/ai/prompt.js");
const { buildOrchestratorPrompt, MODEL_ID } = await import(promptModulePath);

const SCENARIO_ID = "smoke-test-6yo-septic-shock";
const USER_MESSAGE =
  "6-year-old, 22 kg, presenting to ED with 3 days of fever and worsening lethargy. " +
  "Tachycardic, hypotensive, capillary refill 4 seconds, mottled extremities. " +
  "Decreased urine output per parents. No known PMH or allergies.";

const systemPrompt = buildOrchestratorPrompt();

const requestBody = {
  model: MODEL_ID,
  max_tokens: 16000,
  system: systemPrompt,
  messages: [{ role: "user", content: USER_MESSAGE }],
  stream: true,
};

console.log("=== orchestrator smoke test ===");
console.log("scenario id:        " + SCENARIO_ID);
console.log("model:              " + MODEL_ID);
console.log("system prompt size: " + systemPrompt.length + " chars");
console.log("max_tokens:         " + requestBody.max_tokens);
console.log("");
console.log("calling Anthropic API ...");

const t0 = Date.now();
const resp = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify(requestBody),
});

if (!resp.ok) {
  const errBody = await resp.text();
  console.error("HTTP " + resp.status + " from Anthropic API");
  console.error(errBody);
  process.exit(1);
}

if (!resp.body || !resp.body.getReader) {
  console.error("Response has no readable body — streaming not available.");
  process.exit(1);
}

const reader = resp.body.getReader();
const decoder = new TextDecoder();
let sseBuffer = "";
let accumulated = "";
let usage = {};
let stopReason = null;
let lastTokenAt = t0;

while (true) {
  const chunk = await reader.read();
  if (chunk.done) break;
  sseBuffer += decoder.decode(chunk.value, { stream: true });
  const events = sseBuffer.split("\n\n");
  sseBuffer = events.pop();
  for (const evt of events) {
    if (!evt) continue;
    let dataLine = "";
    for (const line of evt.split("\n")) {
      if (line.indexOf("data: ") === 0) dataLine = line.substring(6);
    }
    if (!dataLine || dataLine === "[DONE]") continue;
    let parsed;
    try { parsed = JSON.parse(dataLine); } catch { continue; }
    if (parsed.type === "content_block_delta" && parsed.delta && parsed.delta.type === "text_delta") {
      accumulated += parsed.delta.text;
      lastTokenAt = Date.now();
    } else if (parsed.type === "message_start" && parsed.message && parsed.message.usage) {
      usage = { ...usage, ...parsed.message.usage };
    } else if (parsed.type === "message_delta") {
      if (parsed.delta && parsed.delta.stop_reason) stopReason = parsed.delta.stop_reason;
      if (parsed.usage) usage = { ...usage, ...parsed.usage };
    } else if (parsed.type === "error") {
      const emsg = (parsed.error && parsed.error.message) || "API error";
      console.error("Stream error: " + emsg);
      process.exit(1);
    }
  }
}

const elapsedMs = lastTokenAt - t0;
const totalMs = Date.now() - t0;

const RAW_PATH = resolve(PROJECT_ROOT, "smoke-test-orchestrator-raw.txt");
const USAGE_PATH = resolve(PROJECT_ROOT, "smoke-test-orchestrator-usage.json");
const PARSED_PATH = resolve(PROJECT_ROOT, "smoke-test-orchestrator-call.json");

await writeFile(RAW_PATH, accumulated, "utf8");
await writeFile(USAGE_PATH, JSON.stringify(usage, null, 2) + "\n", "utf8");

// Production parser path: strip code fences, then balanced-brace
// extraction of the longest top-level JSON object.
function extractJson(tb) {
  const cl = tb.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const candidates = [];
  let depth = 0, cStart = -1;
  for (let i = 0; i < cl.length; i++) {
    if (cl[i] === "{") { if (depth === 0) cStart = i; depth++; }
    else if (cl[i] === "}") {
      depth--;
      if (depth === 0 && cStart >= 0) { candidates.push({ s: cStart, e: i, len: i - cStart }); cStart = -1; }
    }
  }
  if (candidates.length === 0) throw new Error("No balanced JSON object found in response.");
  candidates.sort((a, b) => b.len - a.len);
  const slice = cl.substring(candidates[0].s, candidates[0].e + 1);
  try { return JSON.parse(slice); }
  catch (pe) {
    const fixed = slice
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1f]/g, c => c === "\n" ? "\\n" : c === "\r" ? "\\r" : c === "\t" ? "\\t" : "");
    try { return JSON.parse(fixed); }
    catch (pe2) {
      const e = new Error("JSON parse failed (strict): " + pe.message + " | (loose): " + pe2.message);
      e.slicePreview = slice.slice(0, 500);
      throw e;
    }
  }
}

let parsed;
try {
  parsed = extractJson(accumulated);
} catch (err) {
  console.error("Failed to parse JSON from streamed response.");
  console.error(err.message);
  if (err.slicePreview) {
    console.error("--- slice preview (first 500 chars) ---");
    console.error(err.slicePreview);
  }
  console.error("");
  console.error("Raw response saved to: " + RAW_PATH);
  console.error("Usage saved to:        " + USAGE_PATH);
  process.exit(1);
}

await writeFile(PARSED_PATH, JSON.stringify(parsed, null, 2) + "\n", "utf8");

const parsedJsonStr = JSON.stringify(parsed, null, 2);
const first500 = parsedJsonStr.slice(0, 500);

console.log("");
console.log("SMOKE TEST COMPLETE");
console.log("");
console.log("artifacts:");
console.log("  parsed JSON:  " + PARSED_PATH);
console.log("  usage block:  " + USAGE_PATH);
console.log("  raw stream:   " + RAW_PATH);
console.log("");
console.log("=== diagnostic summary ===");
console.log("scenario id:           " + SCENARIO_ID);
console.log("stop_reason:           " + stopReason);
console.log("elapsed (request → last token):  " + elapsedMs + " ms");
console.log("elapsed (request → stream done): " + totalMs + " ms");
console.log("input_tokens:          " + (usage.input_tokens ?? "n/a"));
console.log("output_tokens:         " + (usage.output_tokens ?? "n/a"));
console.log("cache_creation_input_tokens: " + (usage.cache_creation_input_tokens ?? "n/a"));
console.log("cache_read_input_tokens:     " + (usage.cache_read_input_tokens ?? "n/a"));
console.log("raw response length:   " + accumulated.length + " chars");
console.log("");
console.log("=== first 500 chars of parsed JSON ===");
console.log(first500);
console.log("");
console.log("=== raw response.usage ===");
console.log(JSON.stringify(usage, null, 2));
