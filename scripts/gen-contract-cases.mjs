// Generate fresh scenarios with the CURRENT orchestrator prompt and grade them
// against the generator<->render contracts the 2026-08-05 audit fixed.
//
// The audit found that a prompt rule can be stated plainly and still be ignored
// (sys was marked REQUIRED and emitted on 0 of 91 signs). A prompt edit is
// therefore not evidence of anything on its own — this script is how you find
// out whether the edit actually changed the output.
//
//   node scripts/gen-contract-cases.mjs [count]     (default 3, max 5)
//
// Reads ANTHROPIC_API_KEY from the environment or .env.local. Writes each case
// to scripts/gen-contract-<n>.json and prints a per-contract scorecard.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

async function loadEnv() {
  try {
    const txt = await readFile(resolve(ROOT, ".env.local"), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && (process.env[m[1]] === undefined || process.env[m[1]] === "")) {
        process.env[m[1]] = m[2].replace(/^["'](.*)["']$/, "$1");
      }
    }
  } catch (e) { /* no .env.local is fine */ }
}
await loadEnv();
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error("ANTHROPIC_API_KEY not set."); process.exit(1); }

const { buildOrchestratorPrompt, MODEL_ID, MAX_TOKENS } = await import(resolve(ROOT, "src/lib/ai/prompt.js"));
const { guessSys, SYS_ICON } = await import(resolve(ROOT, "src/components/player/bodySystems.js"));
const { parseGCS, isGcsText } = await import(resolve(ROOT, "src/lib/scenarios/gcs.js"));
const { tubeForLab } = await import(resolve(ROOT, "src/lib/scenarios/labTubes.js"));
const { ALL_TOOLS, ALL_MEDS } = await import(resolve(ROOT, "src/lib/scenarios/packs/index.js"));
const { createSceneState, scanText, sceneProps } = await import(resolve(ROOT, "src/components/player/scene3d/resolver.js"));

// Deliberately spread across the dimensions the audit touched: a GCS case, a
// posture case, a CBC/coag lab case, a case that should reach for one of the
// nine ids the prompt used to hide, and a febrile "flushed" case.
const BRIEFS = [
  "8 year old struck by a car, closed head injury with a GCS of 9 and an open forearm fracture. Unresponsive to voice on arrival.",
  "3 year old with meningococcemia, curled on her side under the lights, petechial rash spreading. Febrile and flushed.",
  "14 year old in decompensated heart failure from viral myocarditis — needs a diuretic and an inotrope, cardiology at the bedside.",
  "6 month old with severe bronchiolitis, sitting propped and working hard to breathe. Already on low-flow oxygen from EMS.",
  "10 year old in pulseless arrest from hyperkalemia during dialysis. Team is running the code."
];

const count = Math.min(5, Math.max(1, parseInt(process.argv[2] || "3", 10)));
// Optional second arg: skip the first N briefs, so a follow-up run covers the
// dimensions the first run did not without paying to regenerate it.
const offset = Math.max(0, parseInt(process.argv[3] || "0", 10));
const systemPrompt = buildOrchestratorPrompt();
console.log("Generating " + count + " case(s) with the current orchestrator prompt (" + systemPrompt.length + " chars)\n");

async function generate(brief) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: "Create pediatric scenario:\n\n" + brief }]
    })
  });
  if (!res.ok) throw new Error("HTTP " + res.status + " " + (await res.text()).slice(0, 300));
  const body = await res.json();
  const text = (body.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("no JSON in response");
  return { sc: JSON.parse(text.slice(start, end + 1)), usage: body.usage };
}

const base = () => createSceneState({ ageBand: "C", sexVariant: "v1", paletteSeed: "gen" });
const totals = { signs: 0, sysOk: 0, gcs: 0, gcsOk: 0, labs: 0, badIds: [], deadVisuals: [], badSysVals: [], newIds: [] };
const NEW_IDS = ["cprCompressions", "pulseCheck", "callNeurosurgery", "callCardiology", "callPICU", "furosemide", "milrinone", "dobutamine", "norepinephrine"];

for (let i = 0; i < count; i++) {
  const brief = BRIEFS[(i + offset) % BRIEFS.length];
  process.stdout.write("  [" + (i + 1) + "/" + count + "] " + brief.slice(0, 58) + "… ");
  let out;
  try { out = await generate(brief); }
  catch (e) { console.log("FAILED: " + e.message); continue; }
  const sc = out.sc;
  await writeFile(resolve(ROOT, "scripts/gen-contract-" + (i + 1) + ".json"), JSON.stringify(sc, null, 2));

  let signs = 0, sysOk = 0, gcs = 0, gcsOk = 0;
  const phases = [].concat(sc.phases || [], sc.curveball ? [sc.curveball] : []);
  for (const ph of phases) {
    for (const s of (ph.signs || [])) {
      signs++;
      if (s.sys) { sysOk++; if (guessSys({ sys: s.sys, label: "Zzz", finding: "zzz" }) === "Other") totals.badSysVals.push(s.sys); }
      const txt = (s.finding || "") + " " + (s.label || "");
      if (isGcsText(txt)) { gcs++; if (parseGCS(txt).hasParts) gcsOk++; }
    }
    totals.labs += (ph.labs || []).length;
    for (const kind of ["tools", "meds"]) {
      for (const id of Object.keys((ph.actions || {})[kind] || {})) {
        const reg = kind === "tools" ? ALL_TOOLS : ALL_MEDS;
        if (!reg[id] && !/^custom(Tool|Med)/.test(id)) totals.badIds.push(id);
        if (NEW_IDS.indexOf(id) >= 0) totals.newIds.push(id);
      }
    }
  }
  for (const v of (sc.visuals || [])) {
    if (String(v).split(/\s+/).length <= 4 && sceneProps(scanText(base(), v)).accessories.length === 0) totals.deadVisuals.push(v);
  }
  totals.signs += signs; totals.sysOk += sysOk; totals.gcs += gcs; totals.gcsOk += gcsOk;
  console.log("ok — " + sysOk + "/" + signs + " signs carry sys, " + gcsOk + "/" + gcs + " GCS parse"
    + " (out " + (out.usage ? out.usage.output_tokens : "?") + " tok)");
}

const pct = (a, b) => b ? Math.round((a / b) * 100) + "%" : "n/a";
console.log("\n" + "=".repeat(60));
console.log("  sys emitted on signs      " + totals.sysOk + "/" + totals.signs + "  (" + pct(totals.sysOk, totals.signs) + ")   was 0/91 pre-fix");
console.log("  GCS yielding a breakdown  " + totals.gcsOk + "/" + totals.gcs + "  (" + pct(totals.gcsOk, totals.gcs) + ")   was 0/5 pre-fix");
console.log("  unregistered action ids   " + (totals.badIds.length ? [...new Set(totals.badIds)].join(", ") : "none"));
console.log("  sys values that fall to Other " + (totals.badSysVals.length ? [...new Set(totals.badSysVals)].join(", ") : "none"));
console.log("  visuals rendering nothing " + (totals.deadVisuals.length ? [...new Set(totals.deadVisuals)].join(", ") : "none"));
console.log("  previously-hidden ids used " + (totals.newIds.length ? [...new Set(totals.newIds)].join(", ") : "none"));
console.log("");
