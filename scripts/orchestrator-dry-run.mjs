// scripts/orchestrator-dry-run.mjs
//
// Phase 6.2a — diagnostic dry run of the dormant orchestrator prompt.
//
// What this script does:
//   1. Calls buildOrchestratorPrompt() (no modifications to prompt.js).
//   2. POSTs it to Anthropic Messages API with a fixed user prompt.
//   3. Saves raw text + parsed JSON.
//   4. Runs the result through migrateLegacyScenario + validateSchema +
//      collectAllNullSlots — the same chokepoint the player uses.
//   5. Produces a structured shape-reconciliation report.
//
// What this script does NOT do:
//   - It does NOT call /api/generate. The script runs in Node; it talks
//     to api.anthropic.com directly. The dispatcher and ScenarioPlayer
//     use /api/generate via the Vercel proxy in production.
//   - It does NOT stream. Production generateScenario uses stream:true
//     so the UI can show a progress pill. A diagnostic dry run is
//     simpler with a single non-streaming POST.
//   - It does NOT enable the web_search tool. Production opts in. Shape
//     reconciliation doesn't care about citations.
//   - It does NOT call validateConsistency or validateCounts. Those are
//     clinical-content and per-category-minimum checks; this dry run is
//     about field-shape compatibility only.
//   - It does NOT propose code fixes. Section F recommends a direction;
//     Sebastian makes the call.
//
// Run: ANTHROPIC_API_KEY=... node scripts/orchestrator-dry-run.mjs
// Outputs (gitignored): scripts/orchestrator-dry-run-raw.txt,
//                       scripts/orchestrator-dry-run-output.json,
//                       scripts/orchestrator-dry-run-report.md.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

var __dirname = dirname(fileURLToPath(import.meta.url));
var PROJECT_ROOT = resolve(__dirname, "..");
var ENV_PATH = resolve(PROJECT_ROOT, ".env.local");
var RAW_PATH = resolve(PROJECT_ROOT, "scripts/orchestrator-dry-run-raw.txt");
var JSON_PATH = resolve(PROJECT_ROOT, "scripts/orchestrator-dry-run-output.json");
var REPORT_PATH = resolve(PROJECT_ROOT, "scripts/orchestrator-dry-run-report.md");

async function loadEnv() {
  try {
    var txt = await readFile(ENV_PATH, "utf8");
    var lines = txt.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      // Fill from .env.local when the var is unset OR set-but-empty. Some
      // shells export ANTHROPIC_API_KEY="" (empty string), which would
      // otherwise shadow the real key in .env.local and fail the run.
      if (m && (process.env[m[1]] === undefined || process.env[m[1]] === "")) {
        process.env[m[1]] = m[2].replace(/^["'](.*)["']$/, "$1");
      }
    }
  } catch (e) { /* no .env.local is fine */ }
}
await loadEnv();

var API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY not set (looked in env and .env.local). Cannot run dry-run.");
  process.exit(1);
}

// Dynamic imports of production modules — pure functions, safe to call
// from Node without touching the runtime browser globals.
var promptMod = await import(resolve(PROJECT_ROOT, "src/lib/ai/prompt.js"));
var migrateMod = await import(resolve(PROJECT_ROOT, "src/lib/scenarios/migrateLegacyScenario.js"));
var validateMod = await import(resolve(PROJECT_ROOT, "src/lib/ai/validate.js"));
var slotsMod = await import(resolve(PROJECT_ROOT, "src/lib/scenarios/explanationSlots.js"));

var buildOrchestratorPrompt = promptMod.buildOrchestratorPrompt;
var MODEL_ID = promptMod.MODEL_ID;
var MAX_TOKENS = promptMod.MAX_TOKENS;
var migrateLegacyScenario = migrateMod.migrateLegacyScenario;
var validateSchema = validateMod.validateSchema;
var collectAllNullSlots = slotsMod.collectAllNullSlots;
var buildPerItemExplanationPrompt = promptMod.buildPerItemExplanationPrompt;

// Fixed user prompt — keeps the dry run reproducible across runs.
// No random name hint; we want the same scenario seed every time so
// shape diffs across runs are real diffs, not name-driven noise.
var USER_PROMPT_CONTENT =
  "6 year old, suspected septic shock from community-acquired pneumonia. " +
  "Capillary refill 5 seconds, mottled extremities, lethargic but rousable. " +
  "No known PMH, no allergies.";
var USER_MESSAGE = "Create pediatric scenario:\n\n" + USER_PROMPT_CONTENT;

// Hardcoded list of top-level fields the player consumes. Sources:
//   - ScenarioPlayer.jsx: sc.id, sc.title, sc.patient.*, sc.emsReport,
//     sc.learnMore, sc.phases, sc.curveball, sc.reassessment,
//     sc.stabilizationSummary, sc.norms, sc.visuals
//   - Debrief.jsx:        sc.debrief.summary, sc.debrief.explainers OR
//                         sc.debrief.physiologyDeepDive,
//                         sc.debrief.keyTeaching, sc.stabilizationSummary
//   - dispatcher.js:      sc.source ("ai" gates the dispatcher)
// Anything outside this list passes through to localStorage but isn't
// surfaced in the UI.
var PLAYER_TOP_LEVEL_FIELDS = [
  "debrief",
  "emsReport",
  "id",
  "learnMore",
  "norms",
  "patient",
  "phases",
  "reassessment",
  "source",
  "stabilizationSummary",
  "title",
  "visuals"
];

var systemPrompt = buildOrchestratorPrompt();

console.log("=== Phase 6.2a orchestrator dry run ===");
console.log("System prompt size:  " + systemPrompt.length + " chars");
console.log("User message size:   " + USER_MESSAGE.length + " chars");
console.log("Model:               " + MODEL_ID);
console.log("Max tokens:          " + MAX_TOKENS);
console.log("");
console.log("POSTing to api.anthropic.com (non-streaming, no web_search) ...");

var requestBody = {
  model: MODEL_ID,
  max_tokens: MAX_TOKENS,
  system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: USER_MESSAGE }]
};

var t0 = Date.now();
// Heartbeat so the long-running call's status is visible.
var heartbeat = setInterval(function () {
  console.log("  ... still waiting (" + Math.round((Date.now() - t0) / 1000) + "s)");
}, 30000);
var resp;
try {
  resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(requestBody)
  });
} catch (e) {
  clearInterval(heartbeat);
  console.error("FETCH FAILED: " + e.message);
  process.exit(1);
}
clearInterval(heartbeat);
var elapsedMs = Date.now() - t0;

if (!resp.ok) {
  var errBody = await resp.text();
  console.error("HTTP " + resp.status + " — " + errBody.slice(0, 800));
  process.exit(1);
}

var data = await resp.json();
var rawText = "";
(data.content || []).forEach(function (b) {
  if (b && b.type === "text" && b.text) rawText += b.text;
});

await writeFile(RAW_PATH, rawText, "utf8");

var usage = data.usage || {};
var inputTokens = usage.input_tokens || 0;
var outputTokens = usage.output_tokens || 0;
var cacheCreate = usage.cache_creation_input_tokens || 0;
var cacheRead = usage.cache_read_input_tokens || 0;

// Parse — straight first, then balanced-brace recovery.
var parsed = null;
var parseRoute = "direct";
var parseError = null;
try {
  parsed = JSON.parse(rawText.trim());
} catch (e1) {
  parseError = e1.message;
  // Balanced-brace recovery: scan for the longest top-level {...}
  // candidate. Mirrors the strategy in client.js parseAccumulated().
  var cl = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  var depth = 0;
  var cStart = -1;
  var candidates = [];
  for (var ci = 0; ci < cl.length; ci++) {
    if (cl[ci] === "{") {
      if (depth === 0) cStart = ci;
      depth++;
    } else if (cl[ci] === "}") {
      depth--;
      if (depth === 0 && cStart >= 0) {
        candidates.push({ s: cStart, e: ci, len: ci - cStart });
        cStart = -1;
      }
    }
  }
  if (candidates.length > 0) {
    candidates.sort(function (a, b) { return b.len - a.len; });
    var best = cl.substring(candidates[0].s, candidates[0].e + 1);
    try {
      parsed = JSON.parse(best);
      parseRoute = "brace-recovery";
    } catch (e2) {
      parseRoute = "failed";
      parseError = e1.message + " (recovery: " + e2.message + ")";
    }
  } else {
    parseRoute = "failed";
  }
}

if (parsed) {
  await writeFile(JSON_PATH, JSON.stringify(parsed, null, 2), "utf8");
}

// Run the player's load pipeline. Skip consistency/counts validators
// (clinical content, not shape).
var migrated = parsed ? migrateLegacyScenario(parsed) : null;
var schemaErrs = migrated ? validateSchema(migrated) : ["(no parsed scenario)"];
var nullSlots = migrated ? collectAllNullSlots(migrated) : [];

// ---------- Report builders ----------

function _sortedKeys(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.keys(obj).sort();
}

function _setDiff(a, b) {
  var bSet = {};
  for (var i = 0; i < b.length; i++) bSet[b[i]] = true;
  var out = [];
  for (var j = 0; j < a.length; j++) {
    if (!bSet[a[j]]) out.push(a[j]);
  }
  return out;
}

function _slotsByWave(slots) {
  var by = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, other: 0 };
  for (var i = 0; i < slots.length; i++) {
    var w = slots[i].wave;
    if (by[w] !== undefined) by[w]++;
    else by.other++;
  }
  return by;
}

function _inventoryPhase(phase, idx) {
  if (!phase) return "phase[" + idx + "]: (missing)\n";
  var lines = [];
  lines.push("phase[" + idx + "] keys: " + _sortedKeys(phase).join(", "));
  // vitals
  if (Array.isArray(phase.vitals)) {
    var vWithId = 0, vWithLabel = 0, vWithRef = 0, vWithWhyKey = 0;
    for (var i = 0; i < phase.vitals.length; i++) {
      var v = phase.vitals[i];
      if (v && v.id) vWithId++;
      if (v && v.label) vWithLabel++;
      if (v && typeof v._slotRef === "string") vWithRef++;
      if (v && Object.prototype.hasOwnProperty.call(v, "why")) vWithWhyKey++;
    }
    lines.push("  vitals: array, " + phase.vitals.length + " items — " +
      vWithId + " with id, " + vWithLabel + " with label, " +
      vWithRef + " with _slotRef, " + vWithWhyKey + " with why key");
  } else if (phase.vitals && typeof phase.vitals === "object") {
    lines.push("  vitals: OBJECT (legacy shape), " + Object.keys(phase.vitals).length + " keys");
  } else {
    lines.push("  vitals: (missing or non-object)");
  }
  // signs
  if (Array.isArray(phase.signs)) {
    var sWithId = 0, sWithLabel = 0, sWithRef = 0, sWithWhyKey = 0;
    for (var si = 0; si < phase.signs.length; si++) {
      var s = phase.signs[si];
      if (s && s.id) sWithId++;
      if (s && s.label) sWithLabel++;
      if (s && typeof s._slotRef === "string") sWithRef++;
      if (s && Object.prototype.hasOwnProperty.call(s, "why")) sWithWhyKey++;
    }
    lines.push("  signs: array, " + phase.signs.length + " items — " +
      sWithId + " with id, " + sWithLabel + " with label, " +
      sWithRef + " with _slotRef, " + sWithWhyKey + " with why key");
  } else {
    lines.push("  signs: " + (phase.signs ? "non-array" : "(missing)"));
  }
  // labs
  if (Array.isArray(phase.labs)) {
    var lWithId = 0, lWithName = 0, lWithRef = 0, lWithWhyKey = 0;
    for (var li = 0; li < phase.labs.length; li++) {
      var lab = phase.labs[li];
      if (lab && lab.id) lWithId++;
      if (lab && lab.name) lWithName++;
      if (lab && typeof lab._slotRef === "string") lWithRef++;
      if (lab && Object.prototype.hasOwnProperty.call(lab, "why")) lWithWhyKey++;
    }
    lines.push("  labs: array, " + phase.labs.length + " items — " +
      lWithId + " with id, " + lWithName + " with name, " +
      lWithRef + " with _slotRef, " + lWithWhyKey + " with why key");
  } else {
    lines.push("  labs: " + (phase.labs ? "non-array" : "(missing)"));
  }
  // actions
  if (phase.actions && typeof phase.actions === "object") {
    var tools = phase.actions.tools || {};
    var meds = phase.actions.meds || {};
    function _scanActionMap(m) {
      var keys = Object.keys(m);
      var stringPri = 0, withRef = 0, withFbKey = 0;
      for (var i = 0; i < keys.length; i++) {
        var entry = m[keys[i]];
        if (entry && typeof entry.priority === "string") stringPri++;
        if (entry && typeof entry._slotRef === "string") withRef++;
        if (entry && Object.prototype.hasOwnProperty.call(entry, "fb")) withFbKey++;
      }
      return { count: keys.length, stringPri: stringPri, withRef: withRef, withFbKey: withFbKey };
    }
    var t = _scanActionMap(tools);
    var m = _scanActionMap(meds);
    lines.push("  actions.tools: " + t.count + " entries — " +
      t.stringPri + " with string priority, " + t.withRef + " with _slotRef, " + t.withFbKey + " with fb key");
    lines.push("  actions.meds:  " + m.count + " entries — " +
      m.stringPri + " with string priority, " + m.withRef + " with _slotRef, " + m.withFbKey + " with fb key");
  } else {
    lines.push("  actions: " + (phase.actions ? "non-object" : "(missing)"));
  }
  return lines.join("\n") + "\n";
}

// ---------- Idempotency check: migrate twice, byte-compare ----------
//
// Phase 6.2b.2 added top-level translations and a why-key backfill to
// migrateLegacyScenario. Confirm a second pass through the migrator
// produces a structurally identical scenario (no unbounded growth, no
// missed gates). JSON.stringify equality is the strictest practical
// check — same keys, same values, same key order.

var idempotencyLine = "(skipped — no parsed scenario)";
if (parsed) {
  var firstPass = migrateLegacyScenario(parsed);
  var secondPass = migrateLegacyScenario(firstPass);
  var firstStr = JSON.stringify(firstPass);
  var secondStr = JSON.stringify(secondPass);
  if (firstStr === secondStr) {
    idempotencyLine = "PASS — second pass produced byte-identical output (" + firstStr.length + " bytes)";
  } else {
    var byteDelta = Math.abs(firstStr.length - secondStr.length);
    idempotencyLine = "FAIL — second pass differs from first (byte length delta: " + byteDelta + "). Investigate before wiring.";
  }
}

// ---------- Section A: stats ----------

var sectionA = [
  "## A. Generation stats",
  "",
  "- Generation time:       " + (elapsedMs / 1000).toFixed(1) + " s",
  "- Input tokens:          " + inputTokens,
  "- Output tokens:         " + outputTokens,
  "- cache_creation tokens: " + cacheCreate,
  "- cache_read tokens:     " + cacheRead,
  "- Raw output chars:      " + rawText.length,
  "- Parse route:           " + parseRoute + (parseError ? "  (error: " + parseError + ")" : ""),
  ""
].join("\n");

// ---------- Section B: top-level field inventory ----------

var orchestratorKeys = _sortedKeys(parsed);
var orchestratorKeysAfterMigration = _sortedKeys(migrated);
var playerExpected = PLAYER_TOP_LEVEL_FIELDS.slice().sort();

var expectedNotEmitted = _setDiff(playerExpected, orchestratorKeys);
var expectedNotAfterMigration = _setDiff(playerExpected, orchestratorKeysAfterMigration);
var emittedNotExpected = _setDiff(orchestratorKeys, playerExpected);

var sectionB = [
  "## B. Top-level field inventory",
  "",
  "Orchestrator emitted (raw): " + (orchestratorKeys.length ? orchestratorKeys.join(", ") : "(none)"),
  "",
  "After migrateLegacyScenario: " + (orchestratorKeysAfterMigration.length ? orchestratorKeysAfterMigration.join(", ") : "(none)"),
  "",
  "Player-expected fields:      " + playerExpected.join(", "),
  "",
  "### Fields the player expects but the orchestrator did NOT emit",
  ""
];
if (expectedNotEmitted.length === 0) {
  sectionB.push("(none)");
} else {
  expectedNotEmitted.forEach(function (k) {
    var stillMissingAfter = expectedNotAfterMigration.indexOf(k) >= 0;
    sectionB.push("- " + k + " — " + (stillMissingAfter
      ? "still missing after migration → migration helper does not fill this"
      : "filled by migration helper"));
  });
}
sectionB.push("");
sectionB.push("### Fields the orchestrator emitted that the player does NOT consume");
sectionB.push("");
if (emittedNotExpected.length === 0) {
  sectionB.push("(none — every emitted top-level field is consumed)");
} else {
  emittedNotExpected.forEach(function (k) {
    sectionB.push("- " + k + " — passes through, not surfaced in UI");
  });
}
sectionB.push("");
var sectionBStr = sectionB.join("\n");

// ---------- Section C: phase shape inventory ----------

var sectionC = ["## C. Phase shape inventory", ""];
if (migrated && Array.isArray(migrated.phases)) {
  for (var pi = 0; pi < migrated.phases.length; pi++) {
    sectionC.push("```");
    sectionC.push(_inventoryPhase(migrated.phases[pi], pi));
    sectionC.push("```");
    sectionC.push("");
  }
} else {
  sectionC.push("(no phases array in migrated scenario)");
  sectionC.push("");
}
var sectionCStr = sectionC.join("\n");

// ---------- Section D: debrief shape ----------

var sectionD = ["## D. Debrief shape", ""];
var debrief = migrated && migrated.debrief;
if (!debrief || typeof debrief !== "object") {
  sectionD.push("(no debrief object on migrated scenario)");
} else {
  sectionD.push("- Keys: " + _sortedKeys(debrief).join(", "));
  sectionD.push("- keyTeaching: " + (Array.isArray(debrief.keyTeaching)
    ? "array, " + debrief.keyTeaching.length + " items"
    : "(not an array, present=" + (debrief.keyTeaching !== undefined) + ")"));
  if (Array.isArray(debrief.physiologyDeepDive)) {
    var ddWithId = 0, ddWithTitle = 0, ddWithRef = 0, ddWithContentKey = 0;
    for (var ddi = 0; ddi < debrief.physiologyDeepDive.length; ddi++) {
      var dd = debrief.physiologyDeepDive[ddi];
      if (dd && dd.id) ddWithId++;
      if (dd && dd.title) ddWithTitle++;
      if (dd && typeof dd._slotRef === "string") ddWithRef++;
      if (dd && Object.prototype.hasOwnProperty.call(dd, "content")) ddWithContentKey++;
    }
    sectionD.push("- physiologyDeepDive: array, " + debrief.physiologyDeepDive.length + " items — " +
      ddWithId + " with id, " + ddWithTitle + " with title, " +
      ddWithRef + " with _slotRef, " + ddWithContentKey + " with content key");
  } else {
    sectionD.push("- physiologyDeepDive: " + (debrief.physiologyDeepDive !== undefined ? "(not an array)" : "(missing)"));
  }
  if (Array.isArray(debrief.explainers)) {
    sectionD.push("- explainers (legacy fallback): array, " + debrief.explainers.length + " items");
  }
}
sectionD.push("");
var sectionDStr = sectionD.join("\n");

// ---------- Section E: validation ----------

var waveCounts = _slotsByWave(nullSlots);
var sectionE = [
  "## E. Validation results",
  "",
  "### validateSchema",
  ""
];
if (schemaErrs.length === 0) {
  sectionE.push("(no schema errors)");
} else {
  schemaErrs.forEach(function (e) { sectionE.push("- " + e); });
}
sectionE.push("");
sectionE.push("### collectAllNullSlots");
sectionE.push("");
sectionE.push("- Total null slots: " + nullSlots.length);
sectionE.push("- Wave 1 (P1 vitals/signs/labs why): " + waveCounts[1]);
sectionE.push("- Wave 2 (P1 tool/med fb):           " + waveCounts[2]);
sectionE.push("- Wave 3 (P2 vitals/signs/labs why): " + waveCounts[3]);
sectionE.push("- Wave 4 (P2 tool/med fb):           " + waveCounts[4]);
sectionE.push("- Wave 5 (deep-dive content):        " + waveCounts[5]);
if (waveCounts.other > 0) {
  sectionE.push("- Other / unrecognized:              " + waveCounts.other);
}
sectionE.push("");
sectionE.push("### Migration idempotency");
sectionE.push("");
sectionE.push("- " + idempotencyLine);
sectionE.push("");
var sectionEStr = sectionE.join("\n");

// ---------- Section G: lab variety audit ----------
//
// Phase 6.2b.4 added an explicit "each phase has ≥2 normal labs"
// rule. Print the bad/normal counts per phase and flag any phase
// that falls short.

var sectionG = ["## G. Lab variety audit", ""];
if (migrated && Array.isArray(migrated.phases)) {
  var labVarietyProblems = [];
  for (var gpi = 0; gpi < migrated.phases.length; gpi++) {
    var gphase = migrated.phases[gpi];
    if (!gphase) continue;
    var labs = Array.isArray(gphase.labs) ? gphase.labs : [];
    var badCount = 0;
    var normalCount = 0;
    for (var gli = 0; gli < labs.length; gli++) {
      var lab = labs[gli];
      if (!lab) continue;
      if (lab.bad) badCount++;
      else normalCount++;
    }
    var pass = normalCount >= 2 || labs.length === 0;
    sectionG.push("- phase[" + gpi + "]: " + labs.length + " labs total, " +
      badCount + " bad / " + normalCount + " normal — " +
      (pass ? "OK (≥2 normals or no labs)" : "FAIL (needs ≥2 normals)"));
    if (!pass) labVarietyProblems.push("phase[" + gpi + "] has only " + normalCount + " normal lab(s)");
  }
  sectionG.push("");
  if (labVarietyProblems.length === 0) {
    sectionG.push("**Lab variety: PASS** — all phases meet the ≥2-normal-labs rule.");
  } else {
    sectionG.push("**Lab variety: FAIL** — " + labVarietyProblems.length + " phase(s) short of normal labs.");
  }
} else {
  sectionG.push("(no phases array in migrated scenario)");
}
sectionG.push("");
var sectionGStr = sectionG.join("\n");

// ---------- Section H: lab ref/bad coherence audit ----------
//
// Parse each lab's `ref` string as a numeric range and check whether
// the value (numeric portion) falls inside. Mismatches: value inside
// range with bad:true, or value outside range with bad:false.
// Tolerant of non-numeric refs (e.g., "negative", "see notes") — skip
// those entries with a note.

function _parseRefRange(ref) {
  if (typeof ref !== "string") return null;
  // Strip leading comparators and units; handle "70-100", "0.5-2.0",
  // "<60", ">94". The hyphen-range is the common case.
  var rangeMatch = ref.match(/^\s*(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return { lo: Number(rangeMatch[1]), hi: Number(rangeMatch[2]) };
  }
  // One-sided: ">94" → lo only; "<60" → hi only.
  var gtMatch = ref.match(/^\s*>=?\s*(\d+(?:\.\d+)?)/);
  if (gtMatch) return { lo: Number(gtMatch[1]) };
  var ltMatch = ref.match(/^\s*<=?\s*(\d+(?:\.\d+)?)/);
  if (ltMatch) return { hi: Number(ltMatch[1]) };
  return null;
}

function _parseValueNumeric(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  var m = value.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

var sectionH = ["## H. Lab ref/bad coherence audit", ""];
if (migrated && Array.isArray(migrated.phases)) {
  var coherenceMismatches = [];
  var coherenceSkipped = 0;
  for (var hpi = 0; hpi < migrated.phases.length; hpi++) {
    var hphase = migrated.phases[hpi];
    if (!hphase || !Array.isArray(hphase.labs)) continue;
    for (var hli = 0; hli < hphase.labs.length; hli++) {
      var hlab = hphase.labs[hli];
      if (!hlab) continue;
      var range = _parseRefRange(hlab.ref);
      var numeric = _parseValueNumeric(hlab.value);
      if (range == null || numeric == null) {
        coherenceSkipped++;
        continue;
      }
      var insideRange = true;
      if (range.lo !== undefined && numeric < range.lo) insideRange = false;
      if (range.hi !== undefined && numeric > range.hi) insideRange = false;
      var expectedBad = !insideRange;
      if (!!hlab.bad !== expectedBad) {
        coherenceMismatches.push(
          "phase[" + hpi + "].labs[" + hli + "] (" + (hlab.name || hlab.id || "?") + "): " +
          "value=" + JSON.stringify(hlab.value) + " ref=" + JSON.stringify(hlab.ref) +
          " → inside=" + insideRange + " but bad=" + !!hlab.bad
        );
      }
    }
  }
  if (coherenceMismatches.length === 0) {
    sectionH.push("**All coherent** — every lab's bad flag matches its value-vs-ref position.");
  } else {
    sectionH.push("**FAIL — " + coherenceMismatches.length + " mismatch(es):**");
    sectionH.push("");
    coherenceMismatches.forEach(function (m) { sectionH.push("- " + m); });
  }
  if (coherenceSkipped > 0) {
    sectionH.push("");
    sectionH.push("(" + coherenceSkipped + " lab(s) skipped — ref or value not numeric)");
  }
} else {
  sectionH.push("(no phases array in migrated scenario)");
}
sectionH.push("");
var sectionHStr = sectionH.join("\n");

// ---------- Section I: per-item prompt inspection ----------
//
// Phase 6.2b.4 restructured the per-item explanation prompt to
// require markdown structure (lead sentence + bolded bullets +
// optional closing). Confirm the new language is present in the
// shipped prompt body — print the first 1000 chars of the prompt.
// Also check for the specific phrases that signal the structure
// landed.

var sectionI = ["## I. Per-item prompt inspection", ""];
var perItemPrompt = buildPerItemExplanationPrompt();
var phrasesToCheck = [
  "Lead sentence",
  "bolded key clinical terms",
  "structured markdown explanation",
  "Worked example for a vital",
  "roughly 120 words",
  "hard cap 150",
  "Length is a hard limit, not a target"
];
var phraseResults = phrasesToCheck.map(function (p) {
  return { phrase: p, found: perItemPrompt.indexOf(p) >= 0 };
});
sectionI.push("Prompt length: " + perItemPrompt.length + " chars");
sectionI.push("");
sectionI.push("Phrase presence checks:");
phraseResults.forEach(function (r) {
  sectionI.push("- " + (r.found ? "✓" : "✗") + " " + r.phrase);
});
sectionI.push("");
var allFound = phraseResults.every(function (r) { return r.found; });
sectionI.push("**Markdown-format language present: " + (allFound ? "YES" : "NO") + "**");
sectionI.push("");
sectionI.push("### First 1000 chars of per-item prompt");
sectionI.push("");
sectionI.push("```");
sectionI.push(perItemPrompt.slice(0, 1000));
sectionI.push("```");
sectionI.push("");
var sectionIStr = sectionI.join("\n");

// ---------- Section J: cap refill placement audit ----------
//
// Phase 6.2b.4-fixup requires cap refill to be a vital (id: "cap")
// in every phase, not a sign with prose finding. The monitor only
// renders vitals; capRefill-as-sign was invisible on the monitor.
// Pass = cap present in vitals[], NOT present in signs[].

var sectionJ = ["## J. Cap refill placement audit", ""];
if (migrated && Array.isArray(migrated.phases)) {
  var capProblems = [];
  for (var jpi = 0; jpi < migrated.phases.length; jpi++) {
    var jphase = migrated.phases[jpi];
    if (!jphase) continue;
    var jvitals = Array.isArray(jphase.vitals) ? jphase.vitals : [];
    var jsigns = Array.isArray(jphase.signs) ? jphase.signs : [];
    var capInVitals = jvitals.some(function (v) { return v && (v.id === "cap" || v.id === "capRefill"); });
    var capInSigns = jsigns.some(function (s) { return s && (s.id === "cap" || s.id === "capRefill"); });
    var status;
    if (capInVitals && !capInSigns) status = "OK (cap in vitals only)";
    else if (capInVitals && capInSigns) { status = "FAIL (cap in BOTH vitals and signs)"; capProblems.push("phase[" + jpi + "] has cap in vitals AND signs"); }
    else if (!capInVitals && capInSigns) { status = "FAIL (cap in signs, missing from vitals)"; capProblems.push("phase[" + jpi + "] has cap in signs but not vitals"); }
    else { status = "FAIL (no cap entry anywhere)"; capProblems.push("phase[" + jpi + "] has no cap entry"); }
    sectionJ.push("- phase[" + jpi + "]: vitals.cap=" + capInVitals + ", signs.cap=" + capInSigns + " — " + status);
  }
  // Reassessment check.
  var reCap = migrated.reassessment && migrated.reassessment.vitals && Object.prototype.hasOwnProperty.call(migrated.reassessment.vitals, "cap");
  sectionJ.push("- reassessment.vitals.cap: " + (reCap ? "OK (present)" : "FAIL (missing)"));
  if (!reCap) capProblems.push("reassessment.vitals.cap missing");
  sectionJ.push("");
  if (capProblems.length === 0) {
    sectionJ.push("**Cap refill placement: PASS** — cap in vitals, absent from signs, present in reassessment.");
  } else {
    sectionJ.push("**Cap refill placement: FAIL** — " + capProblems.length + " issue(s).");
  }
} else {
  sectionJ.push("(no phases array in migrated scenario)");
}
sectionJ.push("");
var sectionJStr = sectionJ.join("\n");

// ---------- Section K: Phase 0 separation audit ----------
//
// Phase 6.2b.5 requires phases[0].actions.{tools,meds} to be empty
// objects. All actions live in Phase 1 (intervene). This stabilizes
// the dispatcher wave math and eliminates the "monitor in assess or
// intervene?" inconsistency.

var sectionK = ["## K. Phase 0 separation audit", ""];
if (migrated && Array.isArray(migrated.phases) && migrated.phases[0]) {
  var p0 = migrated.phases[0];
  var p0Tools = (p0.actions && p0.actions.tools) || {};
  var p0Meds = (p0.actions && p0.actions.meds) || {};
  var p0ToolCount = Object.keys(p0Tools).length;
  var p0MedCount = Object.keys(p0Meds).length;
  sectionK.push("- phases[0].actions.tools count: " + p0ToolCount);
  sectionK.push("- phases[0].actions.meds count:  " + p0MedCount);
  sectionK.push("");
  if (p0ToolCount === 0 && p0MedCount === 0) {
    sectionK.push("**Phase 0 separation: PASS** — no actions in the assess phase.");
  } else {
    sectionK.push("**Phase 0 separation: FAIL** — actions leaked into assess phase.");
    if (p0ToolCount > 0) sectionK.push("  - leaked tools: " + Object.keys(p0Tools).join(", "));
    if (p0MedCount > 0) sectionK.push("  - leaked meds: " + Object.keys(p0Meds).join(", "));
  }
} else {
  sectionK.push("(no phases[0] in migrated scenario)");
}
sectionK.push("");
var sectionKStr = sectionK.join("\n");

// ---------- Section L: Phase 1 must-have audit ----------
//
// Tied-correct items only. Print id/kind/label for each and total
// count; warn if count exceeds 4 (typical scenarios have 1-4
// tied-correct items; more usually means Sonnet over-used the label
// and routine items got mis-tagged).

var sectionL = ["## L. Phase 1 must-have audit", ""];
if (migrated && Array.isArray(migrated.phases) && migrated.phases[1]) {
  var p1 = migrated.phases[1];
  var mustHaves = [];
  var p1Tools = (p1.actions && p1.actions.tools) || {};
  var p1Meds = (p1.actions && p1.actions.meds) || {};
  Object.keys(p1Tools).forEach(function (id) {
    var t = p1Tools[id];
    if (t && t.priority === "tied-correct") {
      mustHaves.push({ id: id, kind: "tool", label: t.label || id });
    }
  });
  Object.keys(p1Meds).forEach(function (id) {
    var m = p1Meds[id];
    if (m && m.priority === "tied-correct") {
      mustHaves.push({ id: id, kind: "med", label: m.label || id });
    }
  });
  if (mustHaves.length === 0) {
    sectionL.push("(no tied-correct items in phase[1] — scenario may need at least one must-have)");
  } else {
    mustHaves.forEach(function (mh) {
      sectionL.push("- " + mh.kind + ":" + mh.id + " — " + mh.label);
    });
  }
  sectionL.push("");
  sectionL.push("Total tied-correct items: " + mustHaves.length);
  if (mustHaves.length > 4) {
    sectionL.push("");
    sectionL.push("**WARNING:** more than 4 tied-correct items — Sonnet may be over-using the label. Routine items (monitor, IV, stethoscope) should be `correct`, not `tied-correct`.");
  }
} else {
  sectionL.push("(no phases[1] in migrated scenario)");
}
sectionL.push("");
var sectionLStr = sectionL.join("\n");

// ---------- Section F: recommendation ----------

// Heuristic: weigh the size of the rename surface that would have to
// move to either the prompt or the migration helper.
var hasPatientCard = parsed && parsed.patientCard && !parsed.patient;
var hasPresentationBlock = parsed && parsed.presentation && typeof parsed.presentation === "object";
var topLevelRenames = [];
if (hasPatientCard) topLevelRenames.push("patientCard → patient");
if (hasPresentationBlock) {
  if (parsed.presentation.report) topLevelRenames.push("presentation.report → emsReport");
  if (parsed.presentation.learnMore !== undefined) topLevelRenames.push("presentation.learnMore → learnMore");
}
if (parsed && parsed.subtitle !== undefined && !PLAYER_TOP_LEVEL_FIELDS.includes("subtitle")) {
  topLevelRenames.push("subtitle → (not consumed by player; harmless drop)");
}

var sectionF = ["## F. Recommendation", ""];
sectionF.push("Top-level rename surface observed:");
if (topLevelRenames.length === 0) {
  sectionF.push("- (none — orchestrator output already uses player field names)");
} else {
  topLevelRenames.forEach(function (r) { sectionF.push("- " + r); });
}
sectionF.push("");
sectionF.push("Per-phase / debrief / slot-level shape: see Sections C and D for the after-migration counts.");
sectionF.push("");

// Reasoning hooks for the recommendation.
var optionAReasons = [];
var optionBReasons = [];
if (topLevelRenames.length > 0) {
  optionAReasons.push(
    "The orchestrator prompt design doc (locked) defines `patientCard`, " +
    "`presentation.report`, etc. as the canonical field names. Asking the " +
    "prompt to emit `patient`/`emsReport` instead breaks the design-doc " +
    "shape contract — those names exist because they're structured forms " +
    "(`patientCard` is a card; `presentation` is a section with subfields).");
  optionBReasons.push(
    "Adding " + topLevelRenames.length + " top-level rename(s) to migrateLegacyScenario " +
    "is a small, surgical change that lives in the same file already responsible for " +
    "shape translation. Migration runs at every playerStore.start() so the cost is " +
    "constant whether built-ins or orchestrator output passes through.");
}
if (schemaErrs.length > 0) {
  optionBReasons.push(
    "validateSchema failed with " + schemaErrs.length + " error(s) — the migration " +
    "layer is the natural place to coerce the orchestrator output into something " +
    "the validator accepts without changing what the validator enforces.");
}
if (waveCounts[1] === 0 && waveCounts[2] === 0 && waveCounts[3] === 0 && waveCounts[4] === 0 && waveCounts[5] === 0) {
  sectionF.push("**Wave inventory is zero across all five waves.** The dispatcher would not " +
    "have anything to fill against this scenario. Either the orchestrator filled the slots " +
    "with content (defeating the lazy-fetch design), or the slot-ref string scheme isn't " +
    "matching what `collectAllNullSlots` walks. Investigate before recommending wiring.");
  sectionF.push("");
}

sectionF.push("**Option A — amend the orchestrator prompt to emit player field names.**");
if (optionAReasons.length === 0) {
  sectionF.push("- No specific reasons surfaced this run.");
} else {
  optionAReasons.forEach(function (r) { sectionF.push("- " + r); });
}
sectionF.push("");
sectionF.push("**Option B — extend migrateLegacyScenario to translate the orchestrator's renames.**");
if (optionBReasons.length === 0) {
  sectionF.push("- No specific reasons surfaced this run.");
} else {
  optionBReasons.forEach(function (r) { sectionF.push("- " + r); });
}
sectionF.push("");

var recommendation;
if (topLevelRenames.length === 0 && schemaErrs.length === 0 && nullSlots.length > 0) {
  recommendation = "Neither — shape reconciliation is already clean. Phase 6.2 can wire " +
    "the orchestrator without touching either layer.";
} else if (topLevelRenames.length > 0 && schemaErrs.length === 0) {
  recommendation = "Option B (extend migrateLegacyScenario). The rename surface is small " +
    "(" + topLevelRenames.length + " field(s)), localized to top-level keys, and migration " +
    "already runs at every playerStore.start(). Amending the prompt would break the design-doc " +
    "shape contract; extending the migration helper preserves it. The translation cost is bounded.";
} else if (schemaErrs.length > 0) {
  recommendation = "Option B (extend migrateLegacyScenario), and also surface the schema errors " +
    "above to decide whether validateSchema needs tightening to accept the orchestrator's exact " +
    "shape. Don't amend the prompt before fixing the migration gap.";
} else {
  recommendation = "Investigate the zero-wave inventory before deciding either option. The " +
    "dispatcher won't have anything to fill until null slots are present.";
}
sectionF.push("**Recommendation:** " + recommendation);
sectionF.push("");
var sectionFStr = sectionF.join("\n");

// ---------- Assemble + write report ----------

var report = [
  "# Phase 6.2a — Orchestrator Dry Run Report",
  "",
  "_Generated " + new Date().toISOString() + "_",
  "",
  "User prompt: `" + USER_PROMPT_CONTENT + "`",
  "",
  sectionA,
  sectionBStr,
  sectionCStr,
  sectionDStr,
  sectionEStr,
  sectionFStr,
  sectionGStr,
  sectionHStr,
  sectionIStr,
  sectionJStr,
  sectionKStr,
  sectionLStr
].join("\n");

await writeFile(REPORT_PATH, report, "utf8");

console.log("");
console.log(report);
console.log("");
console.log("=== Artifacts ===");
console.log("  raw text:  " + RAW_PATH);
console.log("  parsed:    " + JSON_PATH);
console.log("  report:    " + REPORT_PATH);
console.log("");

process.exit(parseRoute === "failed" ? 1 : 0);
