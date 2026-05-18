// scripts/deep-dive-smoke-test.mjs
//
// Phase 5.4.3b smoke test for the new deep-dive Haiku prompt.
// Fires one live Haiku call with buildDeepDivePrompt() as the system
// prompt and buildDeepDiveUserMessage(SC1, ...) as the user message,
// then verifies the three-part response structure (summary paragraph
// + bulleted body + TL;DR paragraph prefixed with **TL;DR:**), word
// count target 250-400 across all three parts.
//
// SC1 doesn't currently have a debrief.physiologyDeepDive slot
// (schema 5.4.1 lives only on AI-generated scenarios from the Phase
// 5.4.4 dispatcher). We synthesize a topic for the smoke test so we
// can exercise the prompt end-to-end without requiring the dispatcher
// to be wired.
//
// Output is written to smoke-test-deep-dive-output.txt (gitignored).
// Run: node scripts/deep-dive-smoke-test.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(PROJECT_ROOT, ".env.local");
const OUT_PATH = resolve(PROJECT_ROOT, "smoke-test-deep-dive-output.txt");

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

const { buildDeepDivePrompt, HAIKU_MODEL_ID } = await import(
  resolve(PROJECT_ROOT, "src/lib/ai/prompt.js")
);
const { buildDeepDiveUserMessage } = await import(
  resolve(PROJECT_ROOT, "src/lib/ai/userMessages.js")
);
const builtIns = await import(
  resolve(PROJECT_ROOT, "src/lib/scenarios/builtIn.js")
);

// SC1 (fussy infant / septic shock) — built-in scenarios don't carry
// a physiologyDeepDive slot today, so synthesize one for the smoke
// test. The user message builder pulls the title out of
// scenario.debrief.physiologyDeepDive by id; we mutate a clone here.
const scenario = JSON.parse(JSON.stringify(builtIns.SC1));
const deepDiveId = "compensated-vs-decompensated-shock";
const deepDiveTitle = "Compensated vs Decompensated Pediatric Shock";
scenario.debrief = scenario.debrief || {};
scenario.debrief.physiologyDeepDive = [
  { id: deepDiveId, title: deepDiveTitle, content: null }
];

const slotRef = "debrief.physiologyDeepDive." + deepDiveId + ".content";
const systemPrompt = buildDeepDivePrompt();
const userMessage = buildDeepDiveUserMessage(scenario, slotRef);

const lines = [];
function log(s) { lines.push(s); console.log(s); }

log("=== Phase 5.4.3b deep-dive Haiku smoke test ===");
log("Model:               " + HAIKU_MODEL_ID);
log("Scenario:            " + scenario.id);
log("Slot ref:            " + slotRef);
log("Deep-dive title:     " + deepDiveTitle);
log("System prompt size:  " + systemPrompt.length + " chars");
log("User message size:   " + userMessage.length + " chars");
log("");
log("=== USER MESSAGE ===");
log(userMessage);
log("");
log("Calling Haiku ...");

const requestBody = {
  model: HAIKU_MODEL_ID,
  max_tokens: 2048,
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
const expectedHeader = "###ITEM:" + deepDiveId;
const expectedFooter = "###END";
const trimmed = text.trim();
const startsRight = trimmed.startsWith(expectedHeader);
const endsRight = trimmed.endsWith(expectedFooter);

const problems = [];
if (!startsRight) problems.push("Output does not start with " + expectedHeader);
if (!endsRight) problems.push("Output does not end with " + expectedFooter);

let body = "";
if (startsRight && endsRight) {
  const after = trimmed.slice(expectedHeader.length);
  const beforeEnd = after.slice(0, after.length - expectedFooter.length);
  body = beforeEnd.trim();
}

// Three-part structure check.
// Summary = first non-bulleted paragraph.
// Bulleted body = consecutive lines starting with "- ".
// TL;DR paragraph = paragraph starting with "**TL;DR:**".
const hasTldr = body.indexOf("**TL;DR:**") >= 0;
if (body && !hasTldr) problems.push("Body missing **TL;DR:** marker");

let summary = "";
let bullets = [];
let tldr = "";
if (body) {
  const paragraphs = body.split(/\n\s*\n/);
  let phase = "summary";
  paragraphs.forEach(function (p) {
    const trimmedP = p.trim();
    if (!trimmedP) return;
    if (trimmedP.startsWith("**TL;DR:**")) { tldr = trimmedP; phase = "tldr"; return; }
    if (trimmedP.startsWith("- ")) {
      phase = "body";
      const lines = trimmedP.split("\n");
      lines.forEach(function (l) {
        if (l.trim().startsWith("- ")) bullets.push(l.trim());
      });
      return;
    }
    if (phase === "summary") summary = trimmedP;
  });
}

const wordCount = body ? body.split(/\s+/).filter(Boolean).length : 0;
// Phase 5.4.3b soft-limit spec: target 250–600 words,
// acceptable up to 800. Flag only beyond 800.
const wordCountInRange = wordCount >= 250 && wordCount <= 800;

if (body) {
  if (!wordCountInRange) problems.push("Body word count " + wordCount + " outside 250-800 acceptable band");
  if (bullets.length < 6 || bullets.length > 12) problems.push("Bullet count " + bullets.length + " outside 6-12 target");
  if (!summary) problems.push("No summary paragraph detected");
  if (!tldr) problems.push("No **TL;DR:** paragraph detected");
}

log("=== STRUCTURE CHECKS ===");
log("starts with " + expectedHeader + ":  " + (startsRight ? "PASS" : "FAIL"));
log("ends with " + expectedFooter + ":          " + (endsRight ? "PASS" : "FAIL"));
log("body total word count:           " + wordCount + (wordCountInRange ? "  (within 250-800 soft-limit band)" : "  (out of range)"));
log("bullet count:                    " + bullets.length + ((bullets.length >= 6 && bullets.length <= 12) ? "  (within 6-12)" : "  (out of range)"));
log("summary detected:                " + (summary ? "yes (" + summary.split(/\s+/).filter(Boolean).length + " words)" : "no"));
log("**TL;DR:** detected:             " + (tldr ? "yes (" + tldr.split(/\s+/).filter(Boolean).length + " words)" : "no"));
log("");

if (problems.length > 0) {
  log("PROBLEMS FOUND:");
  problems.forEach(function (p) { log("  - " + p); });
  log("");
}

log("=== BODY (first 300 chars) ===");
log(body ? body.slice(0, 300) : "(no body extracted)");
log("");

log("=== FULL RAW OUTPUT ===");
log(text);

await writeFile(OUT_PATH, lines.join("\n") + "\n", "utf8");
log("");
log("Output saved to: " + OUT_PATH);

process.exit(problems.length > 0 ? 1 : 0);
