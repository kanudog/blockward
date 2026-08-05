// Coverage audit: every id the generator can emit, against every id the app can
// actually render. Answers "is this thing represented and working when called
// upon?" in both directions — unreachable content AND unreachable art.
import fs from "fs";
import { SCENE_VOCAB } from "../src/components/player/scene3d/sceneVocab.js";
import { ACCESSORY_CATALOG, COMPANIONS, HAIR_BY_VARIANT } from "../src/components/player/scene3d/config.js";
import { ALL_TOOLS, ALL_MEDS } from "../src/lib/scenarios/packs/index.js";
import { MED_VISUAL_META } from "../src/lib/scenarios/visualMeta.js";

const read = p => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const rule = t => console.log("\n" + t + "\n" + "-".repeat(t.length));
const list = (label, arr) => console.log(`  ${label.padEnd(38)} ${arr.length ? arr.join(", ") : "none"}`);

// ---- 3D accessories: vocab <-> renderer -----------------------------------
const accSrc = read("../src/components/player/scene3d/accessories.js");
const renderable = new Set();
for (const m of accSrc.matchAll(/"([a-z]+(?:-[a-z]+)+)"\s*:\s*function/g)) renderable.add(m[1]);
for (const m of accSrc.matchAll(/APPLY\["([a-z-]+)"\]/g)) renderable.add(m[1]);
const vocabIds = [...new Set(SCENE_VOCAB.map(v => v.id))];
const catalogIds = new Set(ACCESSORY_CATALOG.map(a => a.id));

rule("3D ACCESSORIES");
console.log(`  vocab entries: ${SCENE_VOCAB.length} (${vocabIds.length} unique ids) | renderable: ${renderable.size} | catalog: ${catalogIds.size}`);
list("vocab id with NO 3D model", vocabIds.filter(i => !renderable.has(i)));
list("3D model NEVER reachable by text", [...renderable].filter(i => !vocabIds.includes(i)).sort());
list("vocab id missing from catalog", vocabIds.filter(i => !catalogIds.has(i)));
const dupes = SCENE_VOCAB.map(v => v.id).filter((x, i, a) => a.indexOf(x) !== i);
list("duplicate vocab ids", [...new Set(dupes)]);

// ---- tools / meds: registry <-> icons --------------------------------------
const iconSrc = read("../src/components/player/icons.jsx");
// ToolIcon and MedIcon are separate switches — MedIcon keys are ROUTES
// (iv/neb/oral/push/protocol), not tool ids, so split them or every route
// looks like a dead icon case.
const toolIconBody = iconSrc.slice(iconSrc.indexOf("function ToolIcon"), iconSrc.indexOf("function MedIcon"));
const iconCases = new Set([...toolIconBody.matchAll(/case\s+"([A-Za-z0-9]+)"/g)].map(m => m[1]));
const toolIds = Object.keys(ALL_TOOLS), medIds = Object.keys(ALL_MEDS);

rule("TOOLS & MEDS");
console.log(`  tools: ${toolIds.length} | meds: ${medIds.length}`);
list("tool with NO distinct icon", toolIds.filter(i => !iconCases.has(i)));
list("med with NO colour/route meta", medIds.filter(i => !MED_VISUAL_META[i]));
list("icon case matching no real id", [...iconCases].filter(i => !ALL_TOOLS[i] && !ALL_MEDS[i]).sort());
const bothLists = toolIds.filter(i => medIds.includes(i));
list("id in BOTH tools and meds", bothLists);

// ---- figure look ------------------------------------------------------------
const figSrc = read("../src/components/player/scene3d/figure.js");
const hairBuilt = new Set([...figSrc.matchAll(/style\s*===\s*"([a-z]+)"/g)].map(m => m[1]));
const allHair = [...new Set(Object.values(HAIR_BY_VARIANT).flat())];
// "cap" has no branch because it IS the fallback shape buildHair draws first.
hairBuilt.add("cap");
const compSrc = read("../src/components/player/scene3d/companions.js");
// MAKERS uses bare identifier keys (bear: function (g) {...}), not quoted ones.
const compMakers = new Set([...compSrc.matchAll(/^\s{2}([a-z]+):\s*function/gm)].map(m => m[1]));

rule("FIGURE");
list("hair style with no builder branch", allHair.filter(h => !hairBuilt.has(h)));
list("companions declared", [`${COMPANIONS.length} total`]);
list("companion with no mesh branch", COMPANIONS.filter(c => !compMakers.has(c)));

// ---- scoring tools ----------------------------------------------------------
const feSrc = read("../src/components/player/FocusedExam.jsx");
rule("SCORING TOOLS (breakdown UI)");
const scales = ["gcs", "fast", "aldrete", "pews", "westley", "wong", "flacc", "apgar"];
list("implemented", scales.filter(s => new RegExp(s, "i").test(feSrc) && feSrc.includes("SCALE")));
list("named in code but no scale table", scales.filter(s => new RegExp(s, "i").test(feSrc)).filter(s => !feSrc.toUpperCase().includes(s.toUpperCase() + "_SCALE")));

// ---- body systems -----------------------------------------------------------
const bsSrc = read("../src/components/player/bodySystems.js");
rule("BODY SYSTEMS");
const orderMatch = bsSrc.match(/SYSTEM_ORDER\s*=\s*\[([^\]]+)\]/);
const systems = orderMatch ? orderMatch[1].match(/"[^"]+"/g).map(s => s.replace(/"/g, "")) : [];
list("systems in order", systems);
list("system with no icon", systems.filter(s => !new RegExp(`"${s.replace("/", "\\/")}"\\s*:`).test(bsSrc)));
console.log("");
