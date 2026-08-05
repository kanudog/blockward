// Generator <-> render CONTRACT gate. Exits non-zero when a promise the AI
// prompt makes to the model stops being true in the app.
//
// `npm run audit` reports the whole matrix and never fails. This script fails,
// so it only asserts the contracts that are (a) explicitly promised in
// src/lib/ai/prompt.js and (b) cheap to keep true. Gaps we have decided to live
// with are listed in ACCEPTED with a reason — they print as "accepted" and do
// not fail the run. Delete an ACCEPTED entry the moment it is fixed, so the
// gate starts protecting it.
import { SCENE_VOCAB, realNameFor } from "../src/components/player/scene3d/sceneVocab.js";
import { createSceneState, scanText, sceneProps } from "../src/components/player/scene3d/resolver.js";
import { ALL_TOOLS, ALL_MEDS } from "../src/lib/scenarios/packs/index.js";
import { SYSTEM_ORDER, SYS_ICON, guessSys } from "../src/components/player/bodySystems.js";
import { tubeForLab } from "../src/lib/scenarios/labTubes.js";
import { buildOrchestratorPrompt } from "../src/lib/ai/prompt.js";

// id -> why we are living with it. Anything NOT in here that fails, fails loud.
// Everything the 2026-08-05 audit found here has since been fixed, so this map
// is empty and every contract below is enforced. Add an entry only for a gap
// that has been consciously accepted, and delete it the moment it is closed.
const ACCEPTED = {};

let failed = 0, accepted = 0, passed = 0;
function check(id, ok, detail) {
  if (ok) { passed++; console.log("  PASS  " + detail); return; }
  if (ACCEPTED[id]) { accepted++; console.log("  known " + detail + "\n          ^ accepted: " + ACCEPTED[id]); return; }
  failed++;
  console.log("  FAIL  " + detail);
}
const rule = t => console.log("\n" + t + "\n" + "-".repeat(t.length));

const PROMPT = buildOrchestratorPrompt();
function between(s, a, b) {
  const i = s.indexOf(a);
  if (i < 0) throw new Error("check-contracts: anchor missing in prompt: " + a);
  const j = b ? s.indexOf(b, i + a.length) : s.length;
  if (j < 0) throw new Error("check-contracts: end anchor missing in prompt: " + b);
  return s.slice(i + a.length, j);
}
const quoted = s => [...new Set([...s.matchAll(/"([^"]+)"/g)].map(m => m[1]))];
function mustFind(what, arr, min) {
  if (arr.length < min) {
    console.error("\ncheck-contracts: parser for " + what + " found " + arr.length + ", expected >= " + min +
      ".\nThat is a bug in this script, not in the app — fix the parser before trusting a red run.");
    process.exit(2);
  }
  return arr;
}

// ---- 1. every visuals keyword the prompt promises must render something -----
rule("visuals[] keywords the prompt promises the renderer matches");
const kws = mustFind("visuals keywords",
  quoted(between(PROMPT, "Recognized keywords (use these exact strings):", "Match visuals to the presentation")), 12);
const base = () => createSceneState({ ageBand: "C", sexVariant: "v1", paletteSeed: "check" });
for (const k of kws) {
  const got = sceneProps(scanText(base(), k)).accessories.map(a => realNameFor(a.split("@")[0]));
  check("visual-keyword:" + k, got.length > 0,
    k.padEnd(18) + " -> " + (got.join(", ") || "(renders nothing)"));
}

// ---- 1b. every posture phrase the prompt teaches must move the figure ------
// These are NOT accessory keywords — they drive pose and face — so they are
// asserted against the resolved pose/face rather than against accessories.
rule("posture and face phrasings the prompt teaches");
const POSTURE = {
  "lying quietly": "lying-eyes-open", "lying supine": "lying-eyes-open", "recumbent": "lying-eyes-open",
  "unresponsive": "lying-eyes-closed", "eyes closed": "lying-eyes-closed", "obtunded": "lying-eyes-closed",
  "sitting on the edge": "sitting-edge",
  "curled on": "curled-side", "curled up": "curled-side", "fetal position": "curled-side",
  "standing": "standing-supported", "walking in": "standing-supported"
};
const postureBlock = between(PROMPT, "Patient posture and face.", "\n\n");
for (const phrase of Object.keys(POSTURE)) {
  const got = sceneProps(scanText(base(), "The child is " + phrase + " on arrival."));
  check("posture:" + phrase,
    got.pose === POSTURE[phrase] && postureBlock.indexOf(phrase) >= 0,
    "posture " + phrase.padEnd(20) + " -> " + got.pose + (postureBlock.indexOf(phrase) >= 0 ? "" : "  (NOT TAUGHT IN PROMPT)"));
}
const FACES = { "drowsy": "heavy", "lethargic": "heavy", "listless": "heavy", "crying": "open", "inconsolable": "open", "irritable": "open", "distressed": "open" };
for (const phrase of Object.keys(FACES)) {
  const got = sceneProps(scanText(base(), "The child is " + phrase + " but otherwise sitting up."));
  check("face:" + phrase,
    got.faceEyes === FACES[phrase] && postureBlock.indexOf(phrase) >= 0,
    "face     " + phrase.padEnd(20) + " -> eyes " + (got.faceEyes || "(default)") + (postureBlock.indexOf(phrase) >= 0 ? "" : "  (NOT TAUGHT IN PROMPT)"));
}
// The pose must win over a face rule that contradicts it.
const conflict = sceneProps(scanText(base(), "The child is unresponsive and lethargic, lying supine."));
check("face-pose-precedence", conflict.faceEyes === "closed",
  "an unresponsive+lethargic child renders eyes " + conflict.faceEyes + " (the pose wins over the drowsy face rule)");

// ---- 2. every registry entry must be reachable by the generator -------------
rule("pack registry entries the prompt's own id listing exposes");
function promptIds(block) {
  const out = [];
  block.split("\n").forEach(line => {
    let L = line.trim();
    if (!L || /^[A-Za-z]+:$/.test(L)) return;
    L = L.replace(/^-\s*/, "").split(" — ")[0];
    L.split(",").forEach(tok => {
      const t = tok.trim();
      if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(t)) out.push(t);
    });
  });
  return [...new Set(out)];
}
const promptTools = mustFind("prompt tool registry",
  promptIds(between(PROMPT, "Use only the IDs below unless you need customTool", "Use only the IDs below unless you need customMed")), 60);
const promptMeds = mustFind("prompt med registry",
  promptIds(between(PROMPT, "Use only the IDs below unless you need customMed", "The registries above cover")), 45);
for (const id of Object.keys(ALL_TOOLS)) {
  check("registry-unknown-tool:" + id, promptTools.includes(id), "tool " + id.padEnd(20) + " listed for the generator");
}
for (const id of Object.keys(ALL_MEDS)) {
  check("registry-unknown-med:" + id, promptMeds.includes(id), "med  " + id.padEnd(20) + " listed for the generator");
}
// The other direction is a hard failure with no accepted list: a prompt id the
// packs lack means the generator is told to emit something that cannot resolve.
for (const id of promptTools) check("prompt-ghost-tool:" + id, !!ALL_TOOLS[id], "prompt tool " + id + " exists in a pack");
for (const id of promptMeds) check("prompt-ghost-med:" + id, !!ALL_MEDS[id], "prompt med  " + id + " exists in a pack");

// ---- 3. every sys value the prompt offers must route and have an icon -------
rule("sign.sys values the prompt tells the generator to emit");
const sysVals = mustFind("prompt sys values",
  quoted(between(PROMPT, "Use EXACTLY one of these strings:\n", "\n")), 8);
for (const s of sysVals) {
  const routed = guessSys({ sys: s, label: "Zzz", finding: "zzz" });
  check("sys-route:" + s, routed === s && !!SYS_ICON[s],
    "sys " + s.padEnd(18) + " -> " + routed + (SYS_ICON[s] ? " (has icon)" : " (NO ICON)"));
}
check("sys-order", sysVals.every(s => SYSTEM_ORDER.includes(s)), "every prompt sys value appears in SYSTEM_ORDER");

// ---- 4. reassessment.outcome must reach a renderer --------------------------
rule("reassessment.outcome");
const outcomes = mustFind("prompt outcomes",
  quoted(between(PROMPT, '"outcome": ', "\n")).filter(s => /^[a-z-]+$/.test(s)), 4);
const fs = await import("fs");
const src = ["ScenarioPlayer.jsx", "Debrief.jsx"]
  .map(f => fs.readFileSync(new URL("../src/components/player/" + f, import.meta.url), "utf8")).join("\n");
const readsOutcome = /reassessment\s*\.\s*outcome|\breassessment\?\.\s*outcome/.test(src);
check("outcome-unrendered", readsOutcome,
  outcomes.length + " outcome values (" + outcomes.join(", ") + ") reach a renderer");

// ---- 5. lab names real cases emit must reach the right tube -----------------
rule("collection tube for lab spellings real generations emit");
const LAB_EXPECT = {
  "Hemoglobin": "lavender", "Hematocrit": "lavender", "WBC": "lavender",
  "Platelet": "lavender", "Platelets": "lavender",
  "pH": "bloodgas", "pCO2": "bloodgas", "HCO3": "bloodgas",
  "pH (VBG)": "bloodgas", "pCO2 (VBG)": "bloodgas", "HCO3 (VBG)": "bloodgas",
  "HCO₃": "bloodgas", "HCO₃⁻": "bloodgas", "pCO₂": "bloodgas", "pO₂": "bloodgas",
  "INR": "lightblue", "Glucose": "gray", "Lactate": "gray",
  "Blood Culture": "yellow", "Blood Cultures": "yellow",
  "Sodium": "gold", "Creatinine": "gold", "ALT": "gold"
};
for (const name of Object.keys(LAB_EXPECT)) {
  const got = tubeForLab({ name });
  check("lab-tube:" + name, got.key === LAB_EXPECT[name],
    name.padEnd(14) + " -> " + got.panel + " (" + got.key + ")");
}

// ---- 6. no vocab id may lose its 3D model ----------------------------------
rule("every sceneVocab id still resolves to a rendered accessory");
const accSrc = fs.readFileSync(new URL("../src/components/player/scene3d/accessories.js", import.meta.url), "utf8");
const renderable = new Set();
for (const m of accSrc.matchAll(/"([a-z]+(?:-[a-z]+)+)"\s*:\s*function/g)) renderable.add(m[1]);
for (const m of accSrc.matchAll(/APPLY\["([a-z-]+)"\]/g)) renderable.add(m[1]);
mustFind("accessories APPLY ids", [...renderable], 50);
for (const v of SCENE_VOCAB) {
  check("vocab-no-model:" + v.id, renderable.has(v.id), "vocab " + v.id.padEnd(22) + " has a 3D model");
}

// ---- report -----------------------------------------------------------------
console.log("\n" + "=".repeat(64));
console.log("  " + passed + " passed · " + accepted + " known-and-accepted · " + failed + " failed");
if (failed) {
  console.log("\n  A FAIL means a generator<->render contract drifted. Either fix the");
  console.log("  side that broke, or add the id to ACCEPTED in this file with a reason.");
  process.exit(1);
}
console.log("  No new contract drift.\n");
