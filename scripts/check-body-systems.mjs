import { guessSys, LINES } from "../src/components/player/bodySystems.js";
// Every sign from BOTH play-tests, with the system a PICU clinician expects.
const cases=[
 // --- Test 1: cardiogenic shock / myocarditis ---
 ["Mental Status","Alert, answers questions in short sentences, maintains eye contact but appears fatigued",null,"Neuro"],
 ["Work of Breathing","Subcostal and intercostal retractions present; using accessory neck muscles",null,"Respiratory"],
 ["Breath Sounds","Coarse transmitted sounds at the right base; no frank crackles bilaterally","bilateral bases","Respiratory"],
 ["Heart Sounds","Regular rhythm, rate 148; distinct S3 gallop audible at the apex","precordium","Cardiovascular"],
 ["Peripheral Pulses","Femoral and brachial pulses palpable but diminished; radial weak","all four limbs","Cardiovascular"],
 ["Skin & Perfusion","Pallor throughout; mottling from knees to feet bilaterally","extremities","Cardiovascular"],
 ["Abdominal Exam","Abdomen soft, non-tender; liver edge palpable 4 cm below the right costal margin","abdomen","GI/Hydration"],
 ["Neck Veins","Neck veins appear distended at 30 degrees of head elevation; trachea midline","neck","Cardiovascular"],
 ["IV Access","22-gauge peripheral IV in the right antecubital; patent and flushing well","right arm",LINES],
 // --- Test 2: severe TBI with raised ICP ---
 ["Pupils","Right pupil 6 mm, sluggish to light. Left pupil 3 mm, brisk.","bilateral","Neuro"],
 ["Motor Response","Localizes to pain in all four extremities. No focal deficit.","all four limbs","Neuro"],
 ["Motor / Posturing","Asymmetric posturing to nailbed pressure: left arm flexion, right arm extension.",null,"Neuro"],
 ["Scalp & Head","Right temporal-parietal scalp hematoma approximately 6 cm, boggy and tender.","right temporal-parietal","HEENT"],
 ["Skin","Pale, slightly cool peripherally. Road rash abrasions on bilateral forearms.","extremities","Integumentary"],
 ["EtCO2 Waveform","Normal capnograph tracing, ETCO2 38 mmHg",null,"Respiratory"],
 ["C-Spine","Cervical collar in place, no midline tenderness elicited",null,"Musculoskeletal"],
 // --- generator-supplied sys should always win ---
 ["Whatever","text that mentions nothing",null,"Cardiovascular","Cardiovascular"],
 ["Odd label","prose",null,"Neuro","neurologic"],
];
let pass=0,fail=0;
for(const c of cases){
  const [label,finding,pos,want,sysField]=c;
  const got=guessSys({label,finding,pos,sys:sysField});
  const ok=got===want;
  if(ok)pass++;else fail++;
  console.log(`${ok?"PASS":"FAIL"}  ${label.padEnd(20)} -> ${got.padEnd(16)}${ok?"":" WANT "+want}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
