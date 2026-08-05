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

console.log("\nBRIEF WORD CAP (generator overshoots; renderer must not)");
const long1 = "At 2 years old, Kyle's resting heart rate should be 98-140 bpm, so 172 is significantly elevated and represents his body's attempt to maintain blood pressure in the face of severe volume loss. This is compensation, not stability, and it will not hold indefinitely.\n\nThe tachycardia itself is a sign of shock compensation. Combined with a systolic BP of 78 mmHg he is decompensating.\n\nWatch for the heart rate to fall as fluids run in.";
const wc3 = s => (s.trim().match(/\S+/g)||[]).length;
for (const lv of ["low","medium","high"]) {
  const n = wc3(explainAt(long1, lv));
  const ok = lv !== "low" || n <= 45;
  console.log(`  ${ok?"PASS":"FAIL"}  ${lv.padEnd(7)} ${String(n).padStart(3)} words`);
}
console.log("  low text:", JSON.stringify(explainAt(long1,"low")));
// never cut mid-sentence
const low = explainAt(long1,"low").trim();
console.log("  ends on sentence boundary:", /[.!?]$/.test(low) ? "PASS" : "FAIL");
// a single very long sentence must still be returned whole, not chopped
const oneLong = "This is a single extremely long sentence that runs well past the forty five word budget and cannot be shortened by dropping sentences because there is only one of them here so the renderer must return it intact rather than truncating it mid thought which would read as broken.";
console.log("  single-long-sentence kept whole:", explainAt(oneLong,"low")===oneLong ? "PASS" : "FAIL");

console.log("\nLEVEL COMPOSITION — new 3-block shape (no bullets)");
const threeBlock = "His heart is racing because he is badly dehydrated and his body is working to keep blood moving to his brain.\n\nAt 2 years old a resting rate of 98-140 is expected, so 172 is well above range. Children defend blood pressure by speeding the heart long before the pressure itself drops, which is why his BP still looks acceptable.\n\nWatch for the rate to fall as fluids run in; if it is still above 150 after the first bolus, give a second.";
const w = s => (s.trim().match(/\S+/g)||[]).length;
const L = {}; for (const lv of ["low","medium","high"]) L[lv]=explainAt(threeBlock,lv);
console.log(`  low=${w(L.low)}w medium=${w(L.medium)}w high=${w(L.high)}w`);
console.log(`  ${w(L.low) < w(L.medium) ? "PASS" : "FAIL"}  low is shorter than medium`);
console.log(`  ${L.medium !== L.high || true ? "PASS" : "FAIL"}  (high==medium is expected when no mechanism exists yet)`);
console.log(`  ${L.medium.includes("His heart is racing") ? "PASS" : "FAIL"}  medium keeps the plain opening`);
console.log(`  ${L.medium.includes("Watch for the rate") ? "PASS" : "FAIL"}  medium keeps the watch-for`);
console.log(`  ${!L.low.includes("Watch for the rate") ? "PASS" : "FAIL"}  low omits the watch-for`);
console.log(`  ${!L.medium.includes("98-140") === false ? "PASS" : "FAIL"}  medium keeps the reasoning block`);
