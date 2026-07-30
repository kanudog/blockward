import { explainAt, parseExplanation, hasMoreAt } from "../src/lib/explain/verbosity.js";

// Verbatim `why` text from the myocarditis play-test (legacy blob shape).
const legacy = `Nadia's alert and oriented state is deceptive — she is perfusing her brain right now, but her lactate of 4.2, weak distal pulses, cap refill of 5 seconds, and troponin leak all signal that her heart is failing to pump enough blood forward, and metabolic debt is accumulating fast. Mental status is the last thing to fail in a child; by the time she becomes confused or lethargic, shock is deep.

- **Cerebral autoregulation** preserves cognition across a wide range of blood pressures in children, which is why an alert 8-year-old with a BP of 82/60 does not feel shock yet — her brain is still getting oxygen, even though her extremities are mottled.
- **Metabolic acidosis with rising lactate** means tissues are switching to anaerobic metabolism because oxygen delivery has fallen below their demand.

Watch the trend: if mental status begins to slip toward lethargy or agitation, decompensation is imminent and you are past the window for gentle escalation.`;

const wc = s => (s.trim().match(/\S+/g)||[]).length;
console.log("LEGACY BLOB (parsed structurally)");
for (const lv of ["low","medium","high"]) {
  const out = explainAt(legacy, lv);
  console.log(`  ${lv.padEnd(7)} ${String(wc(out)).padStart(3)} words   hasMore=${hasMoreAt(legacy,lv)}`);
}
console.log("  low text:", JSON.stringify(explainAt(legacy,"low")));
const p=parseExplanation(legacy);
console.log(`  bullets recovered: ${p.mechanism.length ? "yes" : "NO"} | watchFor recovered: ${p.watchFor?"yes":"NO"}`);

// New structured shape
const structured = { plain:"Her heart is too weak to push blood forward, so her body is running out of oxygen even though she still looks awake.",
  detail:"The clinical framing paragraph goes here and is a bit longer than the plain version.",
  mechanism:["- **Cerebral autoregulation** keeps the brain perfused last."],
  watchFor:"If she gets sleepy, escalate now." };
console.log("\nSTRUCTURED");
for (const lv of ["low","medium","high"]) console.log(`  ${lv.padEnd(7)} ${String(wc(explainAt(structured,lv))).padStart(3)} words`);

// Edge cases
console.log("\nEDGE CASES");
console.log("  empty:", JSON.stringify(explainAt("", "low")), "| null:", JSON.stringify(explainAt(null,"medium")));
const noBullets="Just one paragraph of prose with no structure at all and nothing else to speak of.";
console.log("  no-bullets low:", JSON.stringify(explainAt(noBullets,"low")).slice(0,70));
console.log("  no-bullets high==input:", explainAt(noBullets,"high")===noBullets);
const boldFirst="This has **a bold term** in sentence one. Second sentence here. Third one.";
console.log("  bold not split mid-pair:", (explainAt(boldFirst,"low").match(/\*\*/g)||[]).length%2===0);

console.log("\nDECIMAL / ABBREVIATION SAFETY");
const cases=[
 "Her lactate of 4.2 and pH of 7.28 tell you she is decompensating. Second sentence here. Third.",
 "Give 0.05 mcg/kg/min of epinephrine. Titrate to effect. Then reassess.",
 "Use e.g. albuterol first. Then escalate. Finally intubate.",
 "Temp 37.8 vs. 37.5 matters. Next sentence. Last one.",
];
for (const c of cases) {
  const low = explainAt(c, "low");
  const startsMidNumber = /^[\d,]/.test(low.trim());
  console.log(`  ${startsMidNumber?"FAIL":"PASS"}  ${JSON.stringify(low.slice(0,72))}`);
}
console.log("\nMONOTONIC LEVELS (medium must be >= low)");
const wc2 = s => (s.trim().match(/\S+/g)||[]).length;
const odd = { plain:"A very long plain summary that runs on and on and on for many words indeed.", detail:"Short.", watchFor:"Do this.", mechanism:[] };
console.log(`  low=${wc2(explainAt(odd,"low"))} medium=${wc2(explainAt(odd,"medium"))} -> ${wc2(explainAt(odd,"medium"))>=wc2(explainAt(odd,"low"))?"PASS":"FAIL"}`);
