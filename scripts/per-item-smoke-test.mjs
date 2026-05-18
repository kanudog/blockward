// scripts/per-item-smoke-test.mjs
//
// Phase 5.4.3b smoke test for the new per-item Haiku prompt.
// Fires one live Haiku call with buildPerItemExplanationPrompt() as
// the system prompt and buildPerItemUserMessage(SC1, ...) as the user
// message, then verifies the response structure (###ITEM/###END
// markers, body word count target 60-120).
//
// Output is written to smoke-test-per-item-output.txt (gitignored).
// Run: node scripts/per-item-smoke-test.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(PROJECT_ROOT, ".env.local");
const OUT_PATH = resolve(PROJECT_ROOT, "smoke-test-per-item-output.txt");

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

const { buildPerItemExplanationPrompt, HAIKU_MODEL_ID } = await import(
  resolve(PROJECT_ROOT, "src/lib/ai/prompt.js")
);
const { buildPerItemUserMessage } = await import(
  resolve(PROJECT_ROOT, "src/lib/ai/userMessages.js")
);
const builtIns = await import(
  resolve(PROJECT_ROOT, "src/lib/scenarios/builtIn.js")
);

const scenario = builtIns.SC1;
const slotRef = "phase[0].vitals.hr.why";
const itemId = "vital:hr";

const systemPrompt = buildPerItemExplanationPrompt();
const userMessage = buildPerItemUserMessage(scenario, slotRef);

const lines = [];
function log(s) { lines.push(s); console.log(s); }

log("=== Phase 5.4.3b per-item Haiku smoke test ===");
log("Model:               " + HAIKU_MODEL_ID);
log("Scenario:            " + scenario.id);
log("Slot ref:            " + slotRef);
log("System prompt size:  " + systemPrompt.length + " chars");
log("User message size:   " + userMessage.length + " chars");
log("");
log("=== USER MESSAGE ===");
log(userMessage);
log("");
log("Calling Haiku ...");

const requestBody = {
  model: HAIKU_MODEL_ID,
  max_tokens: 1024,
  system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: userMessage }],
};

const t0 = Date.now();
let resp;
try {
  resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });
} catch (e) {
  log("FETCH FAILED: " + e.message);
  await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
  process.exit(1);
}

const elapsedMs = Date.now() - t0;

if (!resp.ok) {
  const errBody = await resp.text();
  log("HTTP " + resp.status + " — " + errBody.slice(0, 500));
  await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
  process.exit(1);
}

const data = await resp.json();
let text = "";
(data.content || []).forEach(function (b) {
  if (b && b.type === "text" && b.text) text += b.text;
});

const usage = data.usage || {};
const inputTokens = usage.input_tokens ?? 0;
const outputTokens = usage.output_tokens ?? 0;
const cacheCreate = usage.cache_creation_input_tokens ?? 0;
const cacheRead = usage.cache_read_input_tokens ?? 0;

log("");
log("=== RESPONSE METRICS ===");
log("elapsed:                       " + elapsedMs + " ms");
log("input_tokens:                  " + inputTokens);
log("output_tokens:                 " + outputTokens);
log("cache_creation_input_tokens:   " + cacheCreate);
log("cache_read_input_tokens:       " + cacheRead);
log("stop_reason:                   " + (data.stop_reason || "n/a"));
log("");

// Structural checks.
const expectedHeader = "###ITEM:" + itemId;
const expectedFooter = "###END";
const trimmed = text.trim();
const startsRight = trimmed.startsWith(expectedHeader);
const endsRight = trimmed.endsWith(expectedFooter);

const problems = [];
if (!startsRight) problems.push("Output does not start with " + expectedHeader);
if (!endsRight) problems.push("Output does not end with " + expectedFooter);

// Extract body between markers.
let body = "";
if (startsRight && endsRight) {
  const after = trimmed.slice(expectedHeader.length);
  const beforeEnd = after.slice(0, after.length - expectedFooter.length);
  body = beforeEnd.trim();
}

const wordCount = body ? body.split(/\s+/).filter(Boolean).length : 0;
// Phase 5.4.3b soft-limit spec: target 60–120 words,
// acceptable up to 160. Flag only beyond 160.
const wordCountInRange = wordCount >= 60 && wordCount <= 160;

if (body) {
  if (!wordCountInRange) problems.push("Body word count " + wordCount + " outside 60-160 acceptable band");
}

log("=== STRUCTURE CHECKS ===");
log("starts with " + expectedHeader + ":  " + (startsRight ? "PASS" : "FAIL"));
log("ends with " + expectedFooter + ":          " + (endsRight ? "PASS" : "FAIL"));
log("body word count:                 " + wordCount + (wordCountInRange ? "  (within 60-160 soft-limit band)" : "  (out of range)"));
log("");

if (problems.length > 0) {
  log("PROBLEMS FOUND:");
  problems.forEach(function (p) { log("  - " + p); });
  log("");
}

log("=== BODY (first 200 chars) ===");
log(body ? body.slice(0, 200) : "(no body extracted)");
log("");

log("=== FULL RAW OUTPUT ===");
log(text);

await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
log("");
log("Output saved to: " + OUT_PATH);

process.exit(problems.length > 0 ? 1 : 0);
