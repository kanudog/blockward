// scripts/cache-test.mjs
//
// Empirical Anthropic prompt-cache behavior test for parallel/serial fan-out.
// Drives the cost projections in docs/phase-5-lazy-generation/01-investigation.md
// (see §1.4 — "Prompt cache strategy on parallel calls" open question).
//
// Three scenarios, 12 calls each, all using an identical ~2.8K-token system
// prompt with cache_control: ephemeral. Each scenario uses a fresh
// scenario-prefix line so its cache state is independent — that lets us run
// the suite end-to-end without waiting for the 5-minute cache TTL between
// scenarios. The 30-second sleep is still honored for clean separation of
// connection state.
//
// Run: node scripts/cache-test.mjs
// Reads ANTHROPIC_API_KEY from process.env or .env.local at the repo root.
// Not committed; safe to delete.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, "..", ".env.local");

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

// --- knobs ---
const MODEL = "claude-haiku-4-5-20251001";
const N = 12;
const MAX_TOKENS = 200;
const INTER_SCENARIO_SLEEP_MS = 35_000;

// --- pricing (Haiku 4.5, standard tier, USD per million tokens, May 2026) ---
const PRICE = {
  input: 1.0,
  output: 5.0,
  cache_create_5m: 1.25,
  cache_read: 0.1,
};
function costFor(usage) {
  return (
    (usage.input_tokens * PRICE.input) / 1e6 +
    (usage.cache_creation_input_tokens * PRICE.cache_create_5m) / 1e6 +
    (usage.cache_read_input_tokens * PRICE.cache_read) / 1e6 +
    (usage.output_tokens * PRICE.output) / 1e6
  );
}

// --- system prompt: ~2.8K tokens of plausible pediatric educator content ---
// Padded above 2048 tokens to ensure cache eligibility on Haiku 4.5.
// Content is realistic but not load-bearing for the experiment — what matters
// is that it's identical across the 12 calls in a scenario and large enough
// to actually engage the cache.
const BASE_SYSTEM = `You are a pediatric critical care educator with extensive experience teaching nursing students, residents, and PICU fellows in a tertiary-care children's hospital. You have spent over a decade at the bedside in pediatric emergency medicine and intensive care, and you are known for explanations that ground every clinical pearl in physiology rather than rote memorization.

When a learner asks a question, answer with precision, clarity, and a strong pedagogical structure. The audience may range from a brand-new RN encountering their first septic infant to a senior fellow refining their understanding of mixed acid-base disorders, so calibrate depth to the question while keeping the explanation accessible. Lead with the underlying mechanism, then anchor it to a concrete bedside finding the learner can recognize, then close with one or two practical pitfalls or rules of thumb a competent clinician relies on.

AGE-APPROPRIATE PHYSIOLOGY. Vital signs, lab values, drug doses, fluid volumes, and equipment sizes change dramatically across the pediatric age spectrum. Always identify which age the learner is asking about, and recompute weight-based calculations rather than estimating. A 4 kg neonate, a 10 kg toddler, a 30 kg school-aged child, and a 70 kg adolescent are four entirely different patients. Heart rate norms shift from 100-160 in infancy down to 60-100 in adolescence; respiratory rate from 30-60 in newborns down to 12-20 in teens; systolic blood pressure follows a roughly 70 + 2 × age formula in children over one year; and the lower acceptable limit is approximately 70 + 2 × age. Endotracheal tube size is age/4 + 4 for an uncuffed tube, and reduce by 0.5 for a cuffed tube. Defibrillation energy is 2 J/kg for the first shock and 4 J/kg for subsequent shocks. Synchronized cardioversion starts at 0.5 to 1 J/kg. Epinephrine for cardiac arrest is 0.01 mg/kg of 1:10,000 (0.1 mL/kg). For anaphylaxis, intramuscular epinephrine is 0.01 mg/kg of 1:1,000 (max 0.5 mg) into the lateral thigh.

INTERNAL CONSISTENCY. When you reason about a clinical case, lab values, vitals, and the narrative must cohere. Henderson-Hasselbalch holds: pH must reconcile with pCO2 and HCO3, and any expected-versus-actual gap signals a mixed disorder. Lactate above 2 mmol/L in a child should match a perfusion picture — cool extremities, prolonged capillary refill, narrow pulse pressure, or clinical lethargy. A glucose of 32 mg/dL in an infant who has been fasting and febrile is a likely seizure precipitant. Hyperkalemia and acidosis often travel together because acidemia drives potassium out of cells. Hyponatremia in a vomiting infant rarely needs hypertonic correction unless overt cerebral signs are present; isotonic resuscitation usually corrects the underlying volume problem and the sodium drift simultaneously.

GUIDELINE CURRENCY. When you cite guidelines, only reference frameworks you are confident exist and whose recommendations you can stand behind. PALS, AHA, NRP, AAP, ACEP, and Surviving Sepsis Campaign Pediatric all have well-established positions on the most common pediatric resuscitation scenarios. If you are not certain about a specific year or update cycle, cite the underlying physiology rather than a fabricated guideline year. The learner is better served by a correct mechanistic explanation than by a confidently wrong attribution.

INTERVENTION REALISM. The correct action in a clinical scenario is the intervention with the strongest evidence base for that exact pathology, not just a generally reasonable choice. In hemorrhagic shock from blunt trauma, early balanced resuscitation with packed red blood cells, fresh frozen plasma, and platelets in a 1:1:1 ratio outperforms crystalloid-heavy strategies, and tranexamic acid within three hours of injury reduces mortality. In septic shock, a 20 mL/kg isotonic bolus over 5-10 minutes is the first-line intervention; reassess after every bolus and pivot to vasopressors after 40-60 mL/kg if perfusion has not improved. In status asthmaticus, continuous albuterol and ipratropium with intravenous magnesium 25-50 mg/kg is the second-line escalation before considering ketamine, terbutaline, or non-invasive ventilation. In opioid overdose, intravenous naloxone titrated to spontaneous ventilation is preferred over precipitated full reversal in a chronically using patient, and a continuous infusion at two-thirds of the effective bolus dose per hour prevents re-narcotization when the opioid duration exceeds naloxone's.

WHY-FIELD MICRO-FORMAT. Every explanation you produce uses the same four-line micro-format the learner UI expects: an opening one-to-two-sentence overview without bullets, a blank line, then dash-bulleted clinical points each starting with hyphen-space, with key terms wrapped in double-asterisks for bold rendering. Keep bullets short (one clinical idea each, max about twenty words). Do not use markdown headers, do not use numbered lists, do not use blockquotes. Bullets are the rhythm; the overview line is the hook. Avoid filler — every bullet should carry actual clinical signal, not throat-clearing or generic boilerplate.

ETIOLOGY VERSUS PRESENTATION. Be precise about cause and effect. Sepsis is caused by infection, not by hypoglycemia or fever or hypotension — those are presentations of sepsis or co-occurring findings. Hypovolemic shock is caused by volume loss (hemorrhage, GI losses, third-spacing), not by tachycardia or pale skin. Anaphylaxis is caused by IgE-mediated mast-cell degranulation in response to an allergen, not by hypotension. When you write explanations, distinguish three layers: etiology (the underlying cause), pathophysiology (the mechanism by which the cause produces the finding), and presentation (the bedside or lab signs that result). Conflating these three is the most common error in trainee explanations and undercuts the clinical reasoning you are trying to teach.

DISTRACTOR PEDAGOGY. When a learner picks an intervention that is not indicated, explain both why it is wrong here AND when it would be the correct answer. This teaches the right indication implicitly and gives the learner a memorable contrast. Example: racemic epinephrine is not indicated for bronchiolitis because its alpha-1 vasoconstriction targets subglottic edema (the mechanism in croup), which is not the lower-airway mucus plugging seen in RSV bronchiolitis; racemic epi would be the correct intervention for post-extubation stridor or laryngotracheobronchitis.

TONE AND BREVITY. Be direct, technically precise, and warm without being effusive. Treat the learner as a colleague who needs a fast, accurate explanation, not as a passive recipient of received wisdom. If the question is short, the answer can be short. If the question reveals a fundamental misconception, address the misconception explicitly rather than working around it. Never apologize for being thorough; never pad to seem comprehensive. The goal is a learner who walks away with one new clear mechanism, not one who has been buried under everything you know.

OUTPUT BOUNDARY. Stay within the bounds of the question asked. Do not append unrequested differential diagnoses, do not invent additional scenarios the learner did not ask about, and do not promote yourself ("As an educator, I find...") — the learner already knows your role. The output is the explanation; the explanation is the output.

PALS ARREST ALGORITHM. The pediatric cardiac arrest algorithm prioritizes high-quality CPR with chest compressions of approximately one-third the anteroposterior chest diameter, a rate of 100-120 per minute, and full chest recoil between compressions. Compression-to-ventilation ratio is 30:2 for a single rescuer and 15:2 for two rescuers in children, transitioning to continuous compressions with asynchronous breaths once an advanced airway is in place. Defibrillation is indicated for ventricular fibrillation or pulseless ventricular tachycardia at 2 J/kg for the first shock and 4 J/kg subsequently, escalating to 10 J/kg or the adult dose if needed. Epinephrine 0.01 mg/kg IV/IO of 1:10,000 (0.1 mL/kg) is given every 3-5 minutes during arrest. Amiodarone 5 mg/kg IV/IO bolus is the first-line antiarrhythmic for shock-refractory VF/pVT, with lidocaine 1 mg/kg as an alternative. Reversible causes follow the H's and T's: hypoxia, hypovolemia, hypothermia, hypoglycemia, hydrogen ion (acidosis), hyperkalemia/hypokalemia, tension pneumothorax, tamponade, toxins, thrombosis (pulmonary or coronary), and trauma. End-tidal CO2 is the most reliable real-time CPR-quality feedback signal — values below 10 mmHg suggest inadequate compressions or futile resuscitation; an abrupt rise often signals return of spontaneous circulation.

RAPID SEQUENCE INTUBATION. Pediatric RSI requires preparation that anticipates physiologic changes the adult clinician may not encounter. Pre-oxygenate with 100% FiO2 for 3-5 minutes when possible; children desaturate faster than adults due to higher oxygen consumption per kilogram and smaller functional residual capacity. Premedication is generally simplified compared to historical practice: atropine 0.02 mg/kg (minimum 0.1 mg, maximum 0.5 mg) is no longer routinely required but should be considered for infants under one year, in shock states, or when a second dose of succinylcholine is anticipated. Induction agents include ketamine 1-2 mg/kg IV (preferred in shock or asthma; avoid in suspected raised ICP only if hemodynamics are stable enough for an alternative), etomidate 0.3 mg/kg IV (hemodynamically stable but transient adrenal suppression limits use in septic shock), and propofol 1-2 mg/kg IV (causes hypotension; avoid in shock). Paralytics: rocuronium 1.0-1.2 mg/kg IV gives 30-60 minutes of relaxation; succinylcholine 1-2 mg/kg IV gives 5-10 minutes but is contraindicated in burns over 24 hours old, crush injury, hyperkalemia, neuromuscular disease, and known malignant hyperthermia susceptibility. Confirm tube placement with end-tidal CO2 capnography (sustained waveform over six breaths is gold standard), bilateral breath sounds, absent epigastric sounds, chest rise, and a post-intubation chest x-ray to confirm depth.

TOXICOLOGY ANTIDOTES. Common pediatric ingestions have specific antidotes worth memorizing. Acetaminophen overdose: N-acetylcysteine, IV preferred over oral, 150 mg/kg loading dose over 60 minutes, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours; check Rumack-Matthew nomogram at 4 hours post-ingestion to determine treatment threshold for single acute ingestion. Opioid overdose: naloxone IV 0.01 mg/kg (max 2 mg) titrated to ventilation, repeat every 2-3 minutes; consider continuous infusion at two-thirds of the effective bolus dose per hour for long-acting agents like methadone, fentanyl analogs, and nitazenes. Benzodiazepine overdose: flumazenil 0.01 mg/kg up to 0.2 mg IV, but use cautiously — can precipitate seizures in chronic users or in mixed ingestions with proconvulsants. Beta-blocker or calcium-channel-blocker overdose: glucagon 50-150 mcg/kg IV bolus then infusion, calcium chloride 10-20 mg/kg, high-dose insulin euglycemia therapy (1 unit/kg bolus then 0.5-1 unit/kg/hr infusion with concurrent dextrose). Tricyclic overdose with QRS widening: sodium bicarbonate 1-2 mEq/kg IV bolus, repeat to narrow QRS and target serum pH 7.45-7.55. Iron overdose: deferoxamine 15 mg/kg/hr IV for serum iron levels above 500 mcg/dL or symptomatic ingestion. Cyanide: hydroxocobalamin 70 mg/kg (max 5 g) IV, or sodium thiosulfate 250 mg/kg IV when hydroxocobalamin unavailable. Organophosphate poisoning: atropine 0.05 mg/kg IV doubled every 5 minutes until secretions dry, plus pralidoxime 25-50 mg/kg IV over 30 minutes within 24 hours of exposure.

DIABETIC KETOACIDOSIS MANAGEMENT. Pediatric DKA is defined by hyperglycemia (glucose > 200 mg/dL), venous pH < 7.3 or bicarbonate < 15 mEq/L, and ketonemia or ketonuria. Cerebral edema is the most feared complication and accounts for the majority of DKA-related deaths in children — rates approach 1 percent of episodes and mortality among those who develop cerebral edema is 20-25 percent. Risk factors include younger age, longer symptom duration, more severe acidosis, lower pCO2 at presentation, higher BUN at presentation, and treatment with bicarbonate. Initial fluid resuscitation should be more conservative than historical practice: a single 10-20 mL/kg isotonic bolus over 30-60 minutes, then deficit replacement spread over 24-48 hours rather than the 24-hour standard taught two decades ago. Insulin is started at 0.05-0.1 units/kg/hr after fluid resuscitation begins, never as a bolus, and the rate is held steady rather than chased downward as glucose falls — instead add dextrose to the maintenance fluids when glucose reaches 250-300 mg/dL. Potassium supplementation begins early because total body potassium is depleted despite a normal or high serum value at presentation; insulin and correction of acidosis will drive potassium intracellularly. Phosphate, magnesium, and sodium drift all warrant attention. Recognize cerebral edema by altered mental status not explained by hypoglycemia, severe headache, hypertension with bradycardia, posturing, cranial nerve palsies, or new seizure — treat empirically with mannitol 0.5-1 g/kg or hypertonic saline 3-5 mL/kg of 3 percent and lower the head to flat or 30 degrees while preparing for definitive imaging.

STATUS EPILEPTICUS. Define status epilepticus as a continuous seizure lasting more than 5 minutes or recurrent seizures without return to baseline between events. The traditional definition of 30 minutes is now considered too long — neuronal injury and treatment refractoriness begin much earlier. First-line benzodiazepines are lorazepam 0.1 mg/kg IV (max 4 mg per dose, repeat once after 5 minutes), midazolam 0.2 mg/kg IM or 0.3 mg/kg buccal/intranasal when IV access is delayed, or diazepam 0.2-0.3 mg/kg IV or 0.5 mg/kg PR for home rescue. Move to second-line agents at the 10-15 minute mark if seizures persist: levetiracetam 60 mg/kg IV over 5 minutes (max 4500 mg), fosphenytoin 20 mg PE/kg IV over 10 minutes, or valproate 40 mg/kg IV over 10 minutes (avoid in suspected mitochondrial disease or hepatic dysfunction). If seizures persist past 30 minutes despite first and second-line agents, this is refractory status epilepticus — consider continuous infusion of midazolam 0.1-0.5 mg/kg/hr, propofol 1-5 mg/kg/hr (with caution for propofol infusion syndrome), or pentobarbital 1-3 mg/kg loading then infusion. Identify the underlying cause: hypoglycemia, hyponatremia, hypocalcemia, hyperammonemia, intracranial hemorrhage, infection (meningitis, encephalitis), traumatic brain injury, ingestion (TCAs, isoniazid, INH metabolite-driven, requires pyridoxine), or known seizure disorder with subtherapeutic antiepileptic levels. Continuous EEG monitoring is indicated for any patient who has not returned to clinical baseline within 60 minutes of seizure cessation, given the high incidence of nonconvulsive status epilepticus in this population.

ANAPHYLAXIS RECOGNITION AND TREATMENT. Anaphylaxis is a clinical diagnosis based on acute onset (minutes to a few hours) of an illness with skin or mucosal involvement plus either respiratory compromise or hypotension/end-organ dysfunction; OR two or more body systems after exposure to a likely allergen; OR hypotension after exposure to a known allergen for that patient. Skin findings are present in approximately 90 percent of cases but their absence does NOT exclude anaphylaxis — biphasic and severe reactions can present with isolated cardiovascular collapse. Treatment priority is intramuscular epinephrine 0.01 mg/kg of 1:1000 (max 0.5 mg, or 0.3 mg in children under 25 kg) into the lateral thigh; intravenous epinephrine is reserved for refractory cases because of arrhythmia and ischemia risk. Repeat epinephrine every 5-15 minutes as needed; up to one-third of children require a second dose. Adjunct therapies — antihistamines (diphenhydramine 1 mg/kg IV/PO, famotidine 0.5 mg/kg IV), corticosteroids (methylprednisolone 1-2 mg/kg IV), bronchodilators (albuterol nebulization), and IV fluid resuscitation (20 mL/kg crystalloid) — do NOT replace epinephrine and do NOT prevent biphasic reactions; they treat persistent symptoms after epinephrine. Observation for 4-8 hours after a single uncomplicated reaction is reasonable; longer observation for severe reactions, multiple epinephrine doses, or comorbid asthma. Discharge with two epinephrine auto-injectors, written action plan, allergist referral, and counseling on trigger avoidance.`;

function systemPromptFor(scenarioLabel, runId) {
  // Per-scenario unique prefix so each scenario's cache prefix is distinct.
  // Keeps the 12 calls within a scenario truly identical while letting us
  // measure cold/warm behavior independently per scenario.
  return `[Run ${runId} | Scenario ${scenarioLabel}]\n\n` + BASE_SYSTEM;
}

// --- API call ---
async function callOnce({ system, userText, idx }) {
  const t0 = Date.now();
  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userText }],
  };
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: { message: "non-JSON response", raw: text.slice(0, 200) } }; }
  const t1 = Date.now();
  if (!r.ok || data.error) {
    return { idx, t0, t1, dur_ms: t1 - t0, error: (data.error && data.error.message) || ("HTTP " + r.status), usage: null };
  }
  const u = data.usage || {};
  return {
    idx,
    t0, t1, dur_ms: t1 - t0,
    usage: {
      input_tokens: u.input_tokens || 0,
      cache_creation_input_tokens: u.cache_creation_input_tokens || 0,
      cache_read_input_tokens: u.cache_read_input_tokens || 0,
      output_tokens: u.output_tokens || 0,
    },
    error: null,
  };
}

// --- per-scenario summary helper ---
function summarize(label, results, wallMs) {
  const sum = { input: 0, cc: 0, cr: 0, out: 0, cost: 0, errors: 0 };
  for (const r of results) {
    if (r.error) { sum.errors++; continue; }
    sum.input += r.usage.input_tokens;
    sum.cc    += r.usage.cache_creation_input_tokens;
    sum.cr    += r.usage.cache_read_input_tokens;
    sum.out   += r.usage.output_tokens;
    sum.cost  += costFor(r.usage);
  }
  console.log("\n--- " + label + " ---");
  console.log("Per-call (ms / input / cache_create / cache_read / output):");
  for (const r of results) {
    if (r.error) {
      console.log(`  #${String(r.idx).padStart(2)} ERROR: ${r.error}`);
    } else {
      const u = r.usage;
      console.log(
        `  #${String(r.idx).padStart(2)}  ${String(r.dur_ms).padStart(5)}ms  ` +
        `in=${String(u.input_tokens).padStart(5)}  ` +
        `cc=${String(u.cache_creation_input_tokens).padStart(5)}  ` +
        `cr=${String(u.cache_read_input_tokens).padStart(5)}  ` +
        `out=${String(u.output_tokens).padStart(4)}`
      );
    }
  }
  console.log(`  Σ  wall=${wallMs}ms  Σin=${sum.input}  Σcc=${sum.cc}  Σcr=${sum.cr}  Σout=${sum.out}  errors=${sum.errors}  cost=$${sum.cost.toFixed(6)}`);
  return { label, wallMs, ...sum };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ----- run -----
const RUN_ID = Date.now().toString(36);

console.log("=== Anthropic prompt-cache fan-out test ===");
console.log("Model:", MODEL);
console.log("Calls per scenario:", N);
console.log("max_tokens per call:", MAX_TOKENS);
console.log("Run ID:", RUN_ID);
console.log("Pricing/MTok (Haiku 4.5, standard tier):",
  `input $${PRICE.input}, output $${PRICE.output}, cache_write_5m $${PRICE.cache_create_5m}, cache_read $${PRICE.cache_read}`);
console.log("System prompt: ~2.8K tokens of pediatric educator content + per-scenario prefix");

// --- Scenario A: parallel cold ---
{
  const sys = systemPromptFor("A", RUN_ID);
  const t0 = Date.now();
  const calls = Array.from({ length: N }, (_, i) =>
    callOnce({ system: sys, userText: `Explain finding #${i + 1}.`, idx: i + 1 })
  );
  const results = await Promise.all(calls);
  const wall = Date.now() - t0;
  var summaryA = summarize("Scenario A: parallel cold (no warmup)", results, wall);
}

console.log("\n[sleep " + (INTER_SCENARIO_SLEEP_MS / 1000) + "s ...]");
await sleep(INTER_SCENARIO_SLEEP_MS);

// --- Scenario B: serial warmup, then parallel ---
{
  const sys = systemPromptFor("B", RUN_ID);
  const t0 = Date.now();
  const first = await callOnce({ system: sys, userText: "Explain finding #1.", idx: 1 });
  const restCalls = Array.from({ length: N - 1 }, (_, i) =>
    callOnce({ system: sys, userText: `Explain finding #${i + 2}.`, idx: i + 2 })
  );
  const rest = await Promise.all(restCalls);
  const wall = Date.now() - t0;
  var summaryB = summarize("Scenario B: serial warmup + parallel (1 then 11)", [first, ...rest], wall);
}

console.log("\n[sleep " + (INTER_SCENARIO_SLEEP_MS / 1000) + "s ...]");
await sleep(INTER_SCENARIO_SLEEP_MS);

// --- Scenario C: pure serial ---
{
  const sys = systemPromptFor("C", RUN_ID);
  const t0 = Date.now();
  const results = [];
  for (let i = 1; i <= N; i++) {
    const r = await callOnce({ system: sys, userText: `Explain finding #${i}.`, idx: i });
    results.push(r);
  }
  const wall = Date.now() - t0;
  var summaryC = summarize("Scenario C: purely serial baseline", results, wall);
}

// --- cross-scenario table ---
console.log("\n=== Cross-scenario summary ===");
console.log("|  Scenario           | Wall    | Σ input | Σ cc   | Σ cr    | Σ output | Cost      |");
console.log("|---------------------|--------:|--------:|-------:|--------:|---------:|----------:|");
for (const s of [summaryA, summaryB, summaryC]) {
  const row =
    "| " + s.label.replace(/^Scenario [A-C]:\s*/, "").padEnd(19) + " | " +
    (s.wallMs + " ms").padStart(7) + " | " +
    String(s.input).padStart(7) + " | " +
    String(s.cc).padStart(6) + " | " +
    String(s.cr).padStart(7) + " | " +
    String(s.out).padStart(8) + " | $" +
    s.cost.toFixed(6).padStart(8) + " |";
  console.log(row);
}

// --- interpretation ---
console.log("\n=== Interpretation ===");
const cheapest = [summaryA, summaryB, summaryC].slice().sort((a, b) => a.cost - b.cost)[0];
const fastest = [summaryA, summaryB, summaryC].slice().sort((a, b) => a.wallMs - b.wallMs)[0];
console.log(`Cheapest: ${cheapest.label}  ($${cheapest.cost.toFixed(6)})`);
console.log(`Fastest wall-clock: ${fastest.label}  (${fastest.wallMs} ms)`);
const aVsB = summaryA.cost - summaryB.cost;
const aVsC = summaryA.cost - summaryC.cost;
console.log(`A vs B (cost): ${(aVsB > 0 ? "A is " + (aVsB).toFixed(6) + " more expensive" : "A is " + (-aVsB).toFixed(6) + " cheaper")}`);
console.log(`A vs C (wall): A is ${summaryC.wallMs - summaryA.wallMs} ms faster than serial baseline`);

// Heuristic: if A has cc roughly equal to N×prompt-size, the parallel cold
// fan-out paid the cache-creation tax N times — warmup matters.
// If A has cc ≈ prompt-size and cr ≈ (N-1)×prompt-size, the cache was shared.
const oneCachePromptSize = Math.max(summaryB.cc, summaryC.cc); // each of these creates exactly once
if (oneCachePromptSize > 0) {
  const ratio = summaryA.cc / oneCachePromptSize;
  console.log(`\nRatio of A.cache_create to single-create size: ${ratio.toFixed(2)}x`);
  if (ratio > 1.5) {
    console.log("→ Parallel cold fan-out duplicated cache writes (multiple workers raced to create).");
    console.log("  WARMUP PATTERN IS WORTH ADOPTING: the first serial call shares its cache with the parallel batch.");
  } else {
    console.log("→ Parallel cold fan-out shared a single cache write across all calls.");
    console.log("  Warmup pattern not necessary — Anthropic's routing/cache layer already serializes the first creation.");
  }
} else {
  console.log("\n(B and C had zero cache_create — likely cache hit from a prior run; re-run after 5 min for clean baseline.)");
}
