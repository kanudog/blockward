// Coverage audit: every id the generator can emit, against every id the app can
// actually render. Answers "is this thing represented and working when called
// upon?" in both directions — unreachable content AND unreachable art.
//
// This is a REPORT, not a gate: it always exits 0. The loud gates live in
// scripts/check-*.mjs (npm run check:contracts, check:corpus, and friends),
// which fail non-zero when a contract that used to hold stops holding.
//
// Reading the output: every line is one direction of one dimension.
//   "X with no Y"          -> the generator can emit X and nothing renders it
//   "Y never reachable"    -> Y is renderable art/UI no generator output reaches
// "none" on both lines means that dimension is closed in both directions.
//
// METHOD NOTE (learned the hard way — see docs/AUDIT-BRIEF.md): an earlier
// version of this script reported all 21 companions and one hairstyle as
// broken. Both were regex bugs in the script, not bugs in the app. Every
// source-scraping parser below therefore declares the minimum number of items
// it expects to find and calls parsed(); if a parser under-yields it reports
// PARSER BROKE instead of reporting the whole registry as a gap. Prefer
// importing and CALLING real code over scraping it wherever that is possible —
// most dimensions below do exactly that.
import fs from "fs";
import { SCENE_VOCAB, realNameFor } from "../src/components/player/scene3d/sceneVocab.js";
import {
  ACCESSORY_CATALOG, COMPANIONS, HAIR_BY_VARIANT, POSES, HAIR_STYLES,
  GOWN_PALETTE, TONES, seededConfig
} from "../src/components/player/scene3d/config.js";
import { createSceneState, scanText, sceneProps } from "../src/components/player/scene3d/resolver.js";
import { ALL_TOOLS, ALL_MEDS } from "../src/lib/scenarios/packs/index.js";
import { MED_VISUAL_META, TOOL_VISUAL_META, medType } from "../src/lib/scenarios/visualMeta.js";
import { SYSTEM_ORDER, SYS_ICON, guessSys } from "../src/components/player/bodySystems.js";
import { tubeForLab, groupLabsByTube } from "../src/lib/scenarios/labTubes.js";
import { buildOrchestratorPrompt } from "../src/lib/ai/prompt.js";

const read = p => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const rule = t => console.log("\n" + t + "\n" + "-".repeat(t.length));
const list = (label, arr) => console.log(`  ${label.padEnd(42)} ${arr.length ? arr.join(", ") : "none"}`);
const note = s => console.log(`  · ${s}`);

// A parser that under-yields is a bug in THIS script, not a gap in the app.
let parserBroke = 0;
function parsed(what, arr, minExpected) {
  if (arr.length < minExpected) {
    parserBroke++;
    console.log(`  !! PARSER BROKE reading ${what}: found ${arr.length}, expected >= ${minExpected}.`);
    console.log(`     Treat every "gap" in this section as unverified until the parser is fixed.`);
  }
  return arr;
}

const PROMPT = buildOrchestratorPrompt();
function between(s, a, b) {
  const i = s.indexOf(a);
  if (i < 0) return "";
  const j = b ? s.indexOf(b, i + a.length) : s.length;
  return j < 0 ? "" : s.slice(i + a.length, j);
}
const quoted = s => [...new Set([...s.matchAll(/"([^"]+)"/g)].map(m => m[1]))];

// ---- 1. 3D accessories: vocab <-> renderer ---------------------------------
const accSrc = read("../src/components/player/scene3d/accessories.js");
const renderable = new Set();
for (const m of accSrc.matchAll(/"([a-z]+(?:-[a-z]+)+)"\s*:\s*function/g)) renderable.add(m[1]);
for (const m of accSrc.matchAll(/APPLY\["([a-z-]+)"\]/g)) renderable.add(m[1]);
parsed("accessories.js APPLY ids", [...renderable], 50);
const vocabIds = [...new Set(SCENE_VOCAB.map(v => v.id))];
const catalogIds = new Set(ACCESSORY_CATALOG.map(a => a.id));

rule("1. 3D ACCESSORIES  (sceneVocab phrases <-> accessories.js APPLY)");
console.log(`  vocab entries: ${SCENE_VOCAB.length} (${vocabIds.length} unique ids) | renderable: ${renderable.size} | catalog: ${catalogIds.size}`);
list("vocab id with NO 3D model", vocabIds.filter(i => !renderable.has(i)));
list("3D model NEVER reachable by text", [...renderable].filter(i => !vocabIds.includes(i)).sort());
list("vocab id missing from catalog", vocabIds.filter(i => !catalogIds.has(i)));
list("catalog id with no renderer", [...catalogIds].filter(i => !renderable.has(i)));
const dupes = SCENE_VOCAB.map(v => v.id).filter((x, i, a) => a.indexOf(x) !== i);
list("duplicate vocab ids", [...new Set(dupes)]);

// ---- 2. visuals[] keyword contract -----------------------------------------
// The prompt hands the generator an explicit list of keywords and promises
// "The renderer matches these EXACT keywords". Each one must survive the real
// resolver. This is the highest-value direction in the whole audit: the
// generator is being told these work.
rule("2. VISUALS KEYWORD CONTRACT  (prompt's promised keywords <-> resolver)");
const kwBlock = between(PROMPT, "Recognized keywords (use these exact strings):", "Match visuals to the presentation");
const promisedKw = parsed("prompt visuals keywords", quoted(kwBlock), 12);
const base = () => createSceneState({ ageBand: "C", sexVariant: "v1", paletteSeed: "audit" });
const resolveKw = k => sceneProps(scanText(base(), k)).accessories.map(a => realNameFor(a.split("@")[0]));
const deadKw = promisedKw.filter(k => resolveKw(k).length === 0);
console.log(`  keywords the prompt promises: ${promisedKw.length}`);
list("promised keyword that renders NOTHING", deadKw);
promisedKw.forEach(k => {
  const got = resolveKw(k);
  console.log(`      ${got.length ? "ok  " : "MISS"}  ${k.padEnd(18)} -> ${got.join(", ") || "(nothing)"}`);
});

// ---- 3. interventions: prompt registry <-> packs <-> icons ------------------
// Three surfaces, not two. The PACKS are what exists; the PROMPT's registry
// listing is what the generator is allowed to reach for; icons.jsx is what
// draws it. An id present in the packs but absent from the prompt listing is a
// registry entry no case can ever contain.
rule("3. INTERVENTIONS  (prompt registry <-> packs/*.js <-> icons.jsx)");
const toolBlock = between(PROMPT, "Use only the IDs below unless you need customTool", "Use only the IDs below unless you need customMed");
const medBlock = between(PROMPT, "Use only the IDs below unless you need customMed", "The registries above cover");
function promptIds(block) {
  const out = [];
  block.split("\n").forEach(line => {
    let L = line.trim();
    if (!L || /^[A-Za-z]+:$/.test(L)) return;      // pack header line
    L = L.replace(/^-\s*/, "").split(" — ")[0];     // drop em-dash prose
    L.split(",").forEach(tok => {
      const t = tok.trim();
      if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(t)) out.push(t);
    });
  });
  return [...new Set(out)];
}
const promptTools = parsed("prompt tool registry", promptIds(toolBlock), 60);
const promptMeds = parsed("prompt med registry", promptIds(medBlock), 45);

const iconSrc = read("../src/components/player/icons.jsx");
// ToolIcon and MedIcon are separate switches — MedIcon keys are ROUTES
// (iv/neb/oral/push/protocol), not tool ids, so split them or every route
// looks like a dead icon case.
const toolIconBody = iconSrc.slice(iconSrc.indexOf("function ToolIcon"), iconSrc.indexOf("function MedIcon"));
const iconCases = new Set(parsed("ToolIcon switch cases", [...toolIconBody.matchAll(/case\s+"([A-Za-z0-9]+)"/g)].map(m => m[1]), 50));
const toolIds = Object.keys(ALL_TOOLS), medIds = Object.keys(ALL_MEDS);

console.log(`  packs: ${toolIds.length} tools / ${medIds.length} meds | prompt lists: ${promptTools.length} tools / ${promptMeds.length} meds | ToolIcon cases: ${iconCases.size}`);
list("TOOL in packs the PROMPT never lists", toolIds.filter(i => !promptTools.includes(i)));
list("MED in packs the PROMPT never lists", medIds.filter(i => !promptMeds.includes(i)));
list("TOOL id the prompt lists but packs lack", promptTools.filter(i => !ALL_TOOLS[i]));
list("MED id the prompt lists but packs lack", promptMeds.filter(i => !ALL_MEDS[i]));
list("tool with NO distinct icon", toolIds.filter(i => !iconCases.has(i)));
list("icon case matching no real id", [...iconCases].filter(i => !ALL_TOOLS[i] && !ALL_MEDS[i]).sort());
list("med with NO colour/route meta", medIds.filter(i => !MED_VISUAL_META[i]));
list("colour/route meta for no real med", Object.keys(MED_VISUAL_META).filter(i => !ALL_MEDS[i]));
list("id in BOTH tools and meds", toolIds.filter(i => medIds.includes(i)));
// TOOL_VISUAL_META is an indirection layer; if nothing calls it, it is dead.
const callsToolIconName = fs.readdirSync(new URL("../src/components/player/", import.meta.url))
  .some(f => /\.jsx?$/.test(f) && read("../src/components/player/" + f).includes("toolIconName"));
note(`TOOL_VISUAL_META (${Object.keys(TOOL_VISUAL_META).length} entries) consumed by a renderer: ${callsToolIconName ? "yes" : "NO — ActionPanel passes the raw id to ToolIcon"}`);

// ---- 4. med routes & colours ------------------------------------------------
rule("4. MED ROUTES  (visualMeta medType <-> MedIcon cases)");
const medIconBody = iconSrc.slice(iconSrc.indexOf("function MedIcon"));
const routeCases = parsed("MedIcon switch cases", [...medIconBody.matchAll(/case\s+"([A-Za-z0-9]+)"/g)].map(m => m[1]), 4);
const routesProduced = [...new Set(medIds.map(medType))].sort();
console.log(`  routes any registry med can produce: ${routesProduced.join(", ")}`);
list("route produced with no MedIcon case", routesProduced.filter(r => !routeCases.includes(r)));
list("MedIcon case no med can produce", routeCases.filter(r => !routesProduced.includes(r)));

// ---- 5. findings / body systems --------------------------------------------
rule("5. BODY SYSTEMS  (prompt sys list <-> bodySystems.js)");
const sysBlock = between(PROMPT, "Use EXACTLY one of these strings:\n", "\n");
const promptSys = parsed("prompt sys values", quoted(sysBlock), 8);
console.log(`  prompt offers ${promptSys.length} sys values | SYSTEM_ORDER has ${SYSTEM_ORDER.length}`);
list("prompt sys value not in SYSTEM_ORDER", promptSys.filter(s => !SYSTEM_ORDER.includes(s)));
list("prompt sys value with no icon", promptSys.filter(s => !SYS_ICON[s]));
list("SYSTEM_ORDER entry the prompt never offers", SYSTEM_ORDER.filter(s => !promptSys.includes(s) && s !== "Other"));
list("SYSTEM_ORDER entry with no icon", SYSTEM_ORDER.filter(s => !SYS_ICON[s]));
// Reverse: which sys spellings does normalizeSys silently discard? Probe with
// a sign whose label/finding cannot match any rule, so a fallthrough is visible.
const probe = sys => guessSys({ sys, label: "Zzz", finding: "zzz" });
const spellings = ["Neuro", "neuro", "cardio", "cardiovascular", "resp", "gi", "skin",
  "vascular", "gu", "endocrine", "heme", "psych", "lines", "Lines & devices"];
const discarded = spellings.filter(s => probe(s) === "Other");
list("sys spelling silently discarded -> Other", discarded);

// ---- 6. scoring tools -------------------------------------------------------
// Rewritten: the old version regexed the source for the words "gcs"/"fast" and
// reported the comment header as evidence of implementation. What matters is
// (a) which scores scoreKind() can DETECT and (b) which have a scale table.
rule("6. SCORING TOOLS  (case text -> scoreKind -> scale table)");
const feSrc = read("../src/components/player/FocusedExam.jsx");
const scoreKindBody = feSrc.slice(feSrc.indexOf("function scoreKind"), feSrc.indexOf("function parseGCS"));
const detected = parsed("scoreKind detections", [...scoreKindBody.matchAll(/return\s+"([a-z]+)"/g)].map(m => m[1]), 1);
const scaleTables = parsed("scale tables", [...feSrc.matchAll(/var\s+([A-Z]+)_SCALE\s*=/g)].map(m => m[1].toLowerCase()), 1);
const namedInComments = ["gcs", "fast", "aldrete", "pews", "westley", "wong", "flacc", "apgar"];
console.log(`  scoreKind() can detect: ${detected.join(", ")} | scale tables present: ${scaleTables.map(s => s.toUpperCase() + "_SCALE").join(", ")}`);
list("detected but NO scale table", detected.filter(d => !scaleTables.includes(d)));
list("scale table nothing can detect", scaleTables.filter(s => !detected.includes(s)));
list("named in FocusedExam prose, not detectable", namedInComments.filter(s => new RegExp(s, "i").test(feSrc) && !detected.includes(s)));

// ---- 7. figure look ---------------------------------------------------------
const figSrc = read("../src/components/player/scene3d/figure.js");
const hairBuilt = new Set(parsed("buildHair style branches", [...figSrc.matchAll(/style\s*===\s*"([a-z]+)"/g)].map(m => m[1]), 5));
const allHair = [...new Set(Object.values(HAIR_BY_VARIANT).flat())];
// "cap" has no branch because it IS the fallback shape buildHair draws first.
hairBuilt.add("cap");
const compSrc = read("../src/components/player/scene3d/companions.js");
// MAKERS uses bare identifier keys (bear: function (g) {...}), not quoted ones.
const compMakers = new Set(parsed("companion MAKERS", [...compSrc.matchAll(/^\s{2}([a-z]+):\s*function/gm)].map(m => m[1]), 15));

rule("7. FIGURE  (config.js seeded look <-> figure.js / companions.js)");
list("hair style with no builder branch", allHair.filter(h => !hairBuilt.has(h)));
list("hair builder branch no variant can pick", [...hairBuilt].filter(h => !allHair.includes(h)));
list("HAIR_STYLES entry unreachable per-variant", HAIR_STYLES.filter(h => !allHair.includes(h)));
list("companion with no mesh branch", COMPANIONS.filter(c => !compMakers.has(c)));
list("mesh branch no case can pick", [...compMakers].filter(c => !COMPANIONS.includes(c)));
console.log(`  ${COMPANIONS.length} companions · ${allHair.length} reachable hair styles · ${Object.keys(GOWN_PALETTE).length} gown palettes · ${TONES.length} tones`);
// Every seeded look must be buildable: sample the seed space and confirm each
// pick lands on something real.
const badSeeds = [];
for (let i = 0; i < 400; i++) {
  const v = ["v1", "v2", "neutral"][i % 3];
  const c = seededConfig("seed" + i, v);
  if (!hairBuilt.has(c.hairStyle)) badSeeds.push(`${v}/${c.hairStyle}`);
  if (!compMakers.has(c.companion)) badSeeds.push(`${v}/${c.companion}`);
}
list("seeded look that cannot build (400 seeds)", [...new Set(badSeeds)]);

// ---- 8. poses & faces -------------------------------------------------------
rule("8. POSES & FACES  (resolver rules <-> poses.js / kit.js face texture)");
const resSrc = read("../src/components/player/scene3d/resolver.js");
const poseSrc = read("../src/components/player/scene3d/poses.js");
const kitSrc = read("../src/components/player/scene3d/kit.js");
const poseRuleBlock = between(resSrc, "var POSE_RULES", "var FACE_RULES");
const posesFromText = parsed("POSE_RULES poses", [...new Set([...poseRuleBlock.matchAll(/pose:\s*"([a-z-]+)"/g)].map(m => m[1]))], 4);
const posesFromAcc = [...new Set(ACCESSORY_CATALOG.filter(a => a.pose).map(a => a.pose))];
const posesBuilt = new Set(parsed("applyPose branches", [...poseSrc.matchAll(/poseId\s*===\s*"([a-z-]+)"/g)].map(m => m[1]), 5));
posesBuilt.add("settled");   // the fallback branch at the end of applyPose
const catalogPoses = POSES.map(p => p.id);
const reachablePoses = [...new Set(posesFromText.concat(posesFromAcc, ["settled", "celebrate"]))];
console.log(`  POSES catalog: ${catalogPoses.length} | reachable: ${reachablePoses.length} | applyPose branches: ${posesBuilt.size}`);
console.log(`    from text rules: ${posesFromText.join(", ")}`);
console.log(`    forced by accessory: ${posesFromAcc.join(", ")}`);
list("pose reachable with NO applyPose branch", reachablePoses.filter(p => !posesBuilt.has(p)));
list("applyPose branch nothing can reach", [...posesBuilt].filter(p => !reachablePoses.includes(p)));
list("POSES catalog entry nothing can reach", catalogPoses.filter(p => !reachablePoses.includes(p)));
list("reachable pose missing from POSES catalog", reachablePoses.filter(p => !catalogPoses.includes(p)));

const faceRuleBlock = between(resSrc, "var FACE_RULES", "// Any of these verbs");
const eyesFromRules = [...new Set([...faceRuleBlock.matchAll(/eyes:\s*"([a-z]+)"/g)].map(m => m[1]))];
const mouthFromRules = [...new Set([...faceRuleBlock.matchAll(/mouth:\s*"([a-z]+)"/g)].map(m => m[1]))];
const eyesFromPoses = [...new Set([...poseSrc.matchAll(/eyes:\s*"([a-z]+)"/g)].map(m => m[1]))];
const mouthFromPoses = [...new Set([...poseSrc.matchAll(/mouth:\s*"([a-z]+)"/g)].map(m => m[1]))];
// stabilize() sets the celebrate face directly in the resolver.
const eyesAll = [...new Set(eyesFromRules.concat(eyesFromPoses, ["open"]))];
const mouthAll = [...new Set(mouthFromRules.concat(mouthFromPoses, ["grin"]))];
const eyesDrawn = parsed("faceTexture eyes states", [...new Set([...kitSrc.matchAll(/eyes\s*===\s*"([a-z]+)"/g)].map(m => m[1]))].concat(["open"]), 2);
const mouthDrawn = parsed("faceTexture mouth states", [...new Set([...kitSrc.matchAll(/mouth\s*===\s*"([a-z]+)"/g)].map(m => m[1]))].concat(["neutral"]), 3);
console.log(`  eyes reachable: ${eyesAll.join(", ")} | drawn: ${eyesDrawn.join(", ")}`);
console.log(`  mouth reachable: ${mouthAll.join(", ")} | drawn: ${mouthDrawn.join(", ")}`);
list("eye state reachable but not drawn", eyesAll.filter(e => !eyesDrawn.includes(e)));
list("eye state drawn but unreachable", eyesDrawn.filter(e => !eyesAll.includes(e)));
list("mouth state reachable but not drawn", mouthAll.filter(m => !mouthDrawn.includes(m)));
list("mouth state drawn but unreachable", mouthDrawn.filter(m => !mouthAll.includes(m)));
// A FACE_RULES hit overrides the pose's own face (SceneView: faceEyes || posed.face.eyes).
const conflict = sceneProps(scanText(base(), "The child is unresponsive and lethargic, lying supine."));
note(`face-vs-pose precedence: "unresponsive and lethargic" -> pose ${conflict.pose}, eyes render "${conflict.faceEyes}" (the pose's own "closed" is overridden)`);
note(`the prompt documents ${promisedKw.length} accessory keywords and 0 pose/face phrases — poses are undiscoverable to the generator`);

// ---- 9. stations ------------------------------------------------------------
rule("9. STATIONS  (age band -> crib/bed)");
const roomSrc = read("../src/components/player/scene3d/room.js");
const roomKinds = parsed("buildRoom station kinds", [...new Set([...roomSrc.matchAll(/kind\s*=\s*\(band[^;]*\?\s*"([a-z]+)"\s*:\s*"([a-z]+)"/g)].flatMap(m => [m[1], m[2]]))], 2);
const stateStations = ["A", "B", "C", "D"].map(b => createSceneState({ ageBand: b }).station);
console.log(`  buildRoom builds: ${roomKinds.join(", ")}`);
["A", "B", "C", "D"].forEach((b, i) => {
  const built = (b === "A" || b === "B") ? "crib" : "bed";
  console.log(`    band ${b}: resolver says "${stateStations[i]}" · buildRoom builds "${built}" ${stateStations[i] === built ? "" : "  <-- MISMATCH"}`);
});
list("station kind resolver names but room can't build", [...new Set(stateStations)].filter(s => !roomKinds.includes(s)));
// Every ref an accessory reads must exist on BOTH stations, or that accessory
// silently misplaces on one of them.
const refsUsed = [...new Set([...accSrc.matchAll(/refs\.([a-zA-Z]+)/g)].map(m => m[1]))].sort();
const bedBlock = between(roomSrc, 'if (kind === "bed") {', "} else {");
const cribBlock = between(roomSrc, "} else {", "// The stand");
const sharedBlock = roomSrc.slice(roomSrc.indexOf("// The stand"));
const refDefined = r => new RegExp("refs\\." + r + "\\s*=|" + r + ":").test(bedBlock + sharedBlock) && new RegExp("refs\\." + r + "\\s*=|" + r + ":").test(cribBlock + sharedBlock);
list("accessory-consumed ref missing on a station", refsUsed.filter(r => r !== "setNearRail" && !refDefined(r)));
note(`state.station is computed in createSceneState but sceneProps() never emits it — buildRoom re-derives the same rule from ageBand`);

// ---- 10. labs ---------------------------------------------------------------
rule("10. LABS  (lab name -> collection tube)");
const tubeSrc = read("../src/lib/scenarios/labTubes.js");
const tubeKeys = parsed("TUBES", [...new Set([...tubeSrc.matchAll(/^\s{2}([a-z]+):\s*\{ key:/gm)].map(m => m[1]))], 8);
const tubeOrder = parsed("TUBE_ORDER", quoted(between(tubeSrc, "var TUBE_ORDER = [", "]")), 8);
const ruledTubes = parsed("tube rules", [...new Set([...tubeSrc.matchAll(/\{\s*tube:\s*"([a-z]+)"/g)].map(m => m[1]))], 8);
console.log(`  tubes defined: ${tubeKeys.length} | in display order: ${tubeOrder.length} | reachable by rule: ${ruledTubes.length}`);
list("tube defined but in no display order", tubeKeys.filter(t => !tubeOrder.includes(t)));
list("tube ordered but not defined", tubeOrder.filter(t => !tubeKeys.includes(t)));
list("tube no keyword rule can reach", tubeKeys.filter(t => !ruledTubes.includes(t) && t !== "gold"));
// Reverse direction that actually bites: matchKw demands a non-alphanumeric
// character on BOTH sides of the keyword, so a plural ("Platelets") or a
// unicode subscript ("HCO₃") misses its rule and silently lands in the gold
// catch-all. Probe with lab names real generations actually emit, not with
// mechanical pluralisations of every keyword — the point is which SPELLINGS
// a case will really contain.
const LAB_PROBE = {
  // CBC — belong in lavender
  "Hemoglobin": "lavender", "Hematocrit": "lavender", "WBC": "lavender",
  "Platelet": "lavender", "Platelets": "lavender", "Platelet Count": "lavender",
  // blood gas — belong in bloodgas
  "pH": "bloodgas", "pCO2": "bloodgas", "pO2": "bloodgas", "HCO3": "bloodgas",
  "pH (VBG)": "bloodgas", "pCO2 (VBG)": "bloodgas", "HCO3 (VBG)": "bloodgas",
  "HCO₃": "bloodgas", "HCO₃⁻": "bloodgas", "pCO₂": "bloodgas", "pO₂": "bloodgas",
  "Base Excess": "bloodgas",
  // coag — lightblue
  "INR": "lightblue", "D-Dimer": "lightblue", "Fibrinogen": "lightblue",
  // glucose / lactate — gray
  "Glucose": "gray", "Glucose (POC)": "gray", "Lactate": "gray",
  // cultures — yellow
  "Blood Culture": "yellow", "Blood Cultures": "yellow",
  // tox — royal
  "Acetaminophen Level": "royal", "Ethanol Level": "royal",
  // chemistry — gold
  "Sodium": "gold", "Potassium": "gold", "Creatinine": "gold", "BUN": "gold",
  "ALT": "gold", "AST": "gold", "CRP": "gold", "Procalcitonin": "gold", "Lipase": "gold"
};
const tubeMiss = Object.keys(LAB_PROBE).filter(n => tubeForLab({ name: n }).key !== LAB_PROBE[n])
  .map(n => `${n} -> ${tubeForLab({ name: n }).panel} (expected ${tubeForLab({ name: "x" }) && LAB_PROBE[n]})`);
list("real lab spelling routed to the wrong tube", tubeMiss);

// ---- 11. outcomes & stage flow ----------------------------------------------
rule("11. OUTCOMES & STAGE FLOW");
const outBlock = between(PROMPT, '"outcome": ', "\n");
const promptOutcomes = parsed("prompt outcomes", quoted(outBlock).filter(s => /^[a-z-]+$/.test(s)), 4);
const playerSrc = read("../src/components/player/ScenarioPlayer.jsx");
const debriefSrc = read("../src/components/player/Debrief.jsx");
const outcomeRead = /reassessment\s*(&&\s*[a-z.]*)?\.outcome|\.outcome\b/.test(playerSrc + debriefSrc);
console.log(`  prompt requires one of ${promptOutcomes.length}: ${promptOutcomes.join(", ")}`);
list("outcome value with distinct rendering", outcomeRead ? ["(see source)"] : []);
if (!outcomeRead) note("NOTHING reads reassessment.outcome — all five render the same 'Steady again.' recovery screen");
const stagesSet = parsed("setStage targets", [...new Set([...playerSrc.matchAll(/setStage\("([a-z-]+)"\)/g)].map(m => m[1]))], 8);
const stagesRendered = new Set([...playerSrc.matchAll(/stage\s*===\s*"([a-z-]+)"/g)].map(m => m[1]));
list("stage set but never rendered", stagesSet.filter(s => !stagesRendered.has(s) && s !== "debrief"));
list("stage rendered but never set", [...stagesRendered].filter(s => !stagesSet.includes(s) && s !== "intro"));

// ---- 12. insight cards & consequence beat -----------------------------------
rule("12. INSIGHT CARDS & CONSEQUENCE BEAT  (producers <-> consumers)");
const CASE_FILES = [
  "../src/lib/scenarios/generated/breathing-harder.json",
  "../src/lib/scenarios/generated/ten-feet-down.json"
];
const builtInSrc = read("../src/lib/scenarios/builtIn.js");
const caseJson = CASE_FILES.map(f => read(f)).join("\n") + builtInSrc;
const producesInsight = /"insight"\s*:/.test(caseJson);
const producesConsequence = /"consequence"\s*:/.test(caseJson);
const promptKnowsInsight = /"insight"|insight card/i.test(PROMPT);
console.log(`  phaseInsight() derived from tied-correct actions: always available`);
console.log(`  ph.insight  authored field — emitted by any shipped case: ${producesInsight ? "yes" : "NO"} | named in prompt: ${promptKnowsInsight ? "yes" : "NO"}`);
console.log(`  ph.consequence authored field — emitted by any shipped case: ${producesConsequence ? "yes" : "NO"} | named in prompt: ${/"consequence"\s*:/.test(PROMPT) ? "yes" : "NO"}`);
if (!producesConsequence) note("ConsequenceBeat.jsx renders only when ph.consequence exists — no case has the field, so the component is unreachable");
if (!producesInsight) note("AssessPanel's ph.insight branch is unreachable — only the derived phaseInsight() path fires");

// ---- 13. real-corpus fold ---------------------------------------------------
// The load-bearing check: real generated content through the real code paths.
// Invented labels prove nothing (see docs/AUDIT-BRIEF.md — "Prepare intubation
// kit" vs "Perform RSI and secure definitive airway").
rule("13. REAL CORPUS  (shipped generated cases through the real code)");
const cases = CASE_FILES.map(f => ({ name: f.split("/").pop(), sc: JSON.parse(read(f)) }));
let signTotal = 0, signWithSys = 0, gcsTotal = 0, gcsBreakdown = 0;
const unregTools = new Set(), unregMeds = new Set(), deadLabels = [], labTubeRows = [];
for (const { sc } of cases) {
  const phases = [].concat(sc.phases || [], sc.curveball ? [sc.curveball] : []);
  for (const ph of phases) {
    (ph.signs || []).forEach(s => {
      signTotal++;
      if (s.sys) signWithSys++;
      const txt = (s.finding || "") + " " + (s.label || "");
      if (/gcs|glasgow/i.test(txt)) {
        gcsTotal++;
        // Mirrors parseGCS: a breakdown needs E, V and M to be extractable.
        const triple = txt.match(/E\s*[:=]?\s*(\d)\s*[,/·]?\s*V\s*[:=]?\s*(\d)\s*[,/·]?\s*M\s*[:=]?\s*(\d)/i);
        const g = re => { const x = txt.match(re); return x ? +x[1] : null; };
        const e = triple ? +triple[1] : g(/(?:^|[^A-Za-z])E\s*[:=]?\s*(\d)/i);
        const v = triple ? +triple[2] : g(/(?:^|[^A-Za-z])V\s*[:=]?\s*(\d)/i);
        const m = triple ? +triple[3] : g(/(?:^|[^A-Za-z])M\s*[:=]?\s*(\d)/i);
        if (e != null && v != null && m != null && e >= 1 && e <= 4 && v >= 1 && v <= 5 && m >= 1 && m <= 6) gcsBreakdown++;
      }
    });
    (ph.labs || []).forEach(l => labTubeRows.push([l.name, tubeForLab(l).panel]));
    const acts = ph.actions || {};
    Object.keys(acts.tools || {}).forEach(id => { if (!ALL_TOOLS[id] && !/^customTool/.test(id)) unregTools.add(id); });
    Object.keys(acts.meds || {}).forEach(id => { if (!ALL_MEDS[id] && !/^customMed/.test(id)) unregMeds.add(id); });
    ["tools", "meds"].forEach(kind => {
      Object.keys(acts[kind] || {}).forEach(id => {
        const label = (acts[kind][id] || {}).label;
        if (!label) return;
        if (sceneProps(scanText(base(), label)).accessories.length === 0) deadLabels.push(label);
      });
    });
  }
  (sc.visuals || []).forEach(v => {
    if (resolveKw(v).length === 0) deadLabels.push("visuals[]: " + v);
  });
}
console.log(`  cases: ${cases.map(c => c.name).join(", ")}`);
console.log(`  signs carrying the REQUIRED sys field: ${signWithSys}/${signTotal}` + (signWithSys === 0 ? "   <-- every finding falls back to the label heuristic" : ""));
console.log(`  GCS findings that yield a scoring breakdown: ${gcsBreakdown}/${gcsTotal}` + (gcsBreakdown === 0 ? "   <-- all collapse to a bare total" : ""));
list("tool id emitted that no pack registers", [...unregTools]);
list("med id emitted that no pack registers", [...unregMeds]);
const cbcInChem = labTubeRows.filter(r => /platelet|haemoglob|hemoglob|wbc|hct|hematocrit/i.test(r[0]) && r[1] !== "Complete blood count");
list("CBC analyte filed outside the CBC tube", cbcInChem.map(r => `${r[0]} -> ${r[1]}`));
console.log(`  action labels + visuals that resolve to no accessory: ${deadLabels.length} (expected — most interventions have no visual)`);

// ---- summary ----------------------------------------------------------------
rule("SUMMARY");
if (parserBroke) {
  console.log(`  ${parserBroke} parser(s) under-yielded — sections above are UNVERIFIED. Fix the script before trusting them.`);
} else {
  console.log("  all source parsers yielded above their expected minimums");
}
console.log("  This report always exits 0. Run the loud gates for pass/fail:");
console.log("    npm run check:contracts   generator<->render contracts (visuals, registry, sys, outcomes)");
console.log("    npm run check:corpus      shipped generated cases through the real code paths");
console.log("    npm run check:accessories · check:systems · check:verbosity");
console.log("");
