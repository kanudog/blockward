import { createSceneState, applyIntervention } from "../src/components/player/scene3d/resolver.js";
import { SCENE_VOCAB } from "../src/components/player/scene3d/sceneVocab.js";

const NAME = Object.fromEntries(SCENE_VOCAB.map(v=>[v.id,v.realName]));
const base = () => createSceneState({ageBand:"C",sexVariant:"v1",paletteSeed:"t"});
function acc(st){
  const ids = (st.accessories||[]).map(a=>a.id||a);
  return ids.map(i=>NAME[i]||i);
}
function fold(label, kind){
  let st = base();
  st = applyIntervention(st, kind==="med" ? "Give "+label+"." : label);
  return acc(st);
}

console.log("REAL ACTION LABELS -> ACCESSORIES RENDERED\n");
const cases = [
  // [label, kind, what a clinician expects]
  ["Start High-Flow Nasal Cannula","tool","HFNC"],
  ["Apply O2 15L NRB","tool","non-rebreather"],
  ["Set up continuous albuterol nebulization","tool","nebulizer"],
  ["Perform RSI and secure definitive airway","tool","ETT"],
  ["Prepare intubation kit at bedside","tool","NOTHING — only preparing"],
  ["Prepare Intubation Kit","tool","NOTHING — only preparing"],
  ["Place peripheral IV access","tool","peripheral IV"],
  ["Place Arterial Line","tool","(arterial line — is it in vocab?)"],
  ["Apply end-tidal CO₂ monitor","tool","NOTHING visible"],
  ["Connect to vital signs monitor","tool","NOTHING visible"],
  ["Order portable chest X-ray","tool","NOTHING visible"],
  ["Perform lumbar puncture","tool","NOTHING visible"],
  ["Apply Defib Pads","tool","(pads — in vocab?)"],
  ["Give methylprednisolone 2 mg/kg IV (60 mg)","med","IV pouch"],
  ["Bolus NS 20 mL/kg IV","med","IV pouch"],
];
let flagged=[];
for (const [label,kind,expect] of cases){
  const got = fold(label,kind);
  const line = `  ${label.padEnd(44)} -> ${got.length?got.join(", "):"(none)"}`;
  console.log(line);
  console.log(`  ${"".padEnd(44)}    expected: ${expect}`);
  if (/NOTHING/.test(expect) && got.length) flagged.push([label,got]);
}
console.log("\nFALSE POSITIVES (accessory rendered when nothing should be):");
if(!flagged.length) console.log("  none");
for(const [l,g] of flagged) console.log(`  ${l}  ->  ${g.join(", ")}`);

console.log("\n=== REGRESSION: hedged vs real, and narrative safety ===");
const checks = [
  ["Prepare intubation kit at bedside","tool",false,"hedged — no tube"],
  ["Prepare Intubation Kit","tool",false,"hedged — no tube"],
  ["Have suction ready at the bedside","tool",false,"hedged"],
  ["Consider a chest tube if he deteriorates","tool",false,"hedged"],
  ["Perform RSI and secure definitive airway","tool",true,"REAL — tube"],
  ["Intubate now","tool",true,"REAL — tube"],
  ["The endotracheal tube is secured and taped","tool",true,"REAL — tube"],
  ["Set up continuous albuterol nebulization","tool",true,"REAL — neb mask"],
  ["Start High-Flow Nasal Cannula","tool",true,"REAL — HFNC"],
  ["Place peripheral IV access","tool",true,"REAL — IV"],
  ["Place Arterial Line","tool",true,"REAL — a-line"],
  ["Place central venous line for vasoactive drug delivery","tool",false,"no visual by design — renderer has no case"],
  ["Connect to vital signs monitor","tool",false,"nothing visible"],
  ["Order portable chest X-ray","tool",false,"nothing visible"],
];
let pass=0,fail=0;
for(const [label,kind,shouldRender,note] of checks){
  const got=fold(label,kind);
  const ok = shouldRender ? got.length>0 : got.length===0;
  ok?pass++:fail++;
  console.log(`  ${ok?"PASS":"FAIL"}  ${label.slice(0,46).padEnd(46)} -> ${got.length?got.join(", "):"(none)"}   [${note}]`);
}
// the critical narrative case: a hedge must not suppress an unrelated real item
import { createSceneState as cs2, scanText } from "../src/components/player/scene3d/resolver.js";
let st2 = cs2({ageBand:"C",sexVariant:"v1",paletteSeed:"t"});
st2 = scanText(st2, "The team is preparing to intubate while the nasal cannula stays in place.");
const ids2 = (st2.accessories||[]).map(a=>a.id||a);
const hasCannula = ids2.includes("line-two-prong");
const hasTube = ids2.includes("tube-mouth-central");
console.log(`  ${hasCannula&&!hasTube?"PASS":"FAIL"}  mixed sentence: cannula kept=${hasCannula}, tube suppressed=${!hasTube}`);
hasCannula&&!hasTube?pass++:fail++;
console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
