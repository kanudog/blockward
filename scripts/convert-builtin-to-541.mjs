// scripts/convert-builtin-to-541.mjs
//
// Stage 1 one-shot: convert a legacy built-in scenario (SC1-SC6) to the
// schema 5.4.1 / orchestrator shape, IN PLACE in src/lib/scenarios/builtIn.js.
//
// Mechanical reshape (done programmatically, prose copied verbatim):
//   - vitals object -> array, sbp+dbp MERGED into one bp entry, canonical
//     order hr, rr, bp, spo2, temp, cap
//   - phase id "triage"/"escalation" -> "assess"/"intervene" + stageType + phaseIndex
//   - signs/labs gain cat; every why/finding string preserved verbatim
//   - actions: numeric pri -> string priority (from overrides), ok derived
//     from priority, top-level tools[]/meds[] id arrays dropped
//   - debrief.explainers[] -> physiologyDeepDive[] (tldr folded into content
//     as a **TL;DR:** line) + keyTeaching[] (from overrides)
//   - reassessment.vitals sbp/dbp -> bp; curveball reshaped like a phase
//   - schemaVersion + visuals (from overrides) added
//
// Clinical judgment (supplied per-scenario via OVERRIDES):
//   - priority: must-have-therapeutic ("tied-correct") vs supporting
//     ("correct") vs distractor-* — fixes the inverted legacy pri heuristic
//   - why: authored text for reassuring labs/signs that had none
//   - labBad: explicit bad override (default: value-vs-ref coherence)
//   - visuals, keyTeaching
//
// Run: node scripts/convert-builtin-to-541.mjs SC1
// Idempotency is NOT a goal here — this rewrites legacy source once.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

var __dirname = dirname(fileURLToPath(import.meta.url));
var ROOT = resolve(__dirname, "..");
var BUILTIN_PATH = resolve(ROOT, "src/lib/scenarios/builtIn.js");

var TARGET = process.argv[2];
if (!TARGET || !/^SC[1-6]$/.test(TARGET)) {
  console.error("Usage: node scripts/convert-builtin-to-541.mjs SC1");
  process.exit(1);
}

var mod = await import(resolve(ROOT, "src/lib/scenarios/builtIn.js"));
var SC = mod[TARGET];
if (!SC) { console.error("No export named " + TARGET); process.exit(1); }

// ---------------------------------------------------------------------------
// Per-scenario clinical overrides. Keyed by scenario export name.
// ---------------------------------------------------------------------------
var OVERRIDES = {
  SC1: {
    visuals: ["flushed"],
    // priority by phaseTag.actionKind.id. phaseTag: 0,1,"curveball".
    priority: {
      "1.meds.nsBolus": "tied-correct",
      "1.meds.ceftriaxone": "tied-correct",
      "1.tools.ivKit": "correct",
      "1.tools.glucometer": "correct",
      "1.tools.stethoscope": "correct",
      "1.tools.capRefill": "correct",
      "1.tools.thermometer": "distractor-misc",
      "1.tools.defib": "distractor-misc",
      "1.meds.acetaminophen": "distractor-clinical",
      "1.meds.epiIV": "distractor-clinical",
      "1.meds.albuterol": "distractor-misc",
      "1.meds.dextroseBolus": "distractor-clinical",
      "curveball.meds.lorazepam": "tied-correct",
      "curveball.meds.dextroseBolus": "tied-correct",
      "curveball.meds.nsBolus": "correct",
      "curveball.tools.suction": "correct",
      "curveball.tools.o2Mask": "correct",
      "curveball.tools.bvmReady": "correct",
      "curveball.tools.glucometer": "correct",
      "curveball.tools.stethoscope": "distractor-misc",
      "curveball.tools.defib": "distractor-misc",
      "curveball.meds.fosphenytoin": "distractor-clinical",
      "curveball.meds.epiIV": "distractor-clinical",
      "curveball.meds.atropine": "distractor-misc"
    },
    // authored why for reassuring items that had none. keyed phaseTag.kind.id
    why: {
      "0.signs.mucous-membranes": "Moist mucous membranes are a reassuring hydration check in a febrile infant with reported decreased intake.\n\n- **Moist membranes** argue against significant dehydration at this moment, even with fewer wet diapers reported\n- They do **not** rule out early shock — perfusion can fail while hydration still looks adequate\n- Re-examine after any deterioration; membranes dry out as volume status worsens",
      "0.signs.behavior": "Irritable but consolable is a reassuring neurologic sign in a febrile infant — a sick-but-not-toxic appearance.\n\n- **Consolability** means cortical function and the infant–caregiver response loop are intact\n- An inconsolable or lethargic, unconsolable infant is far more concerning for sepsis or meningitis\n- This is a baseline to trend — loss of consolability is an early red flag",
      "0.signs.heart-sounds": "The tachycardia is the flagworthy element; the rhythm and absent murmur or gallop are reassuring against structural or rhythm disease.\n\n- **Tachycardia at 178** exceeds the infant range (100–160) and signals physiologic stress\n- **Regular rhythm** argues against a primary tachyarrhythmia like SVT\n- **No murmur or gallop** argues against structural disease or volume overload as the driver",
      "0.signs.lungs": "Clear, equal breath sounds are a reassuring respiratory exam that helps localize the source away from the chest.\n\n- **Clear lungs** make pneumonia a less likely source for this fever, redirecting the workup\n- Equal air entry argues against a focal process or effusion\n- Tachypnea here is more likely fever-driven or a compensatory response than primary lung disease",
      "0.labs.hgb": "A normal hemoglobin is reassuring against anemia contributing to the picture and is a useful baseline before resuscitation.\n\n- **Hgb 11.8** is within the infant range and argues against blood loss or hemolysis as a driver\n- Establishes a baseline before fluid boluses, which will hemodilute later values\n- Normal oxygen-carrying capacity means hypoxia, if it develops, is a delivery problem, not a content problem",
      "0.labs.platelets": "A normal platelet count is reassuring early, but it must be trended — sepsis can consume platelets as it progresses.\n\n- **Platelets 245** is normal and argues against DIC or marrow suppression at this moment\n- Falling platelets is one of the earliest lab signs of evolving sepsis-associated coagulopathy\n- A normal value now does not exclude later consumption; recheck if the infant deteriorates",
      "0.labs.na": "A normal sodium is reassuring against a significant electrolyte derangement as a seizure or altered-mental-status cause.\n\n- **Na 138** is mid-range and argues against hyponatremic or hypernatremic causes of irritability\n- Useful baseline before large-volume isotonic resuscitation shifts electrolytes\n- Normal sodium keeps the differential focused on infection rather than a primary metabolic derangement",
      "1.signs.mental-status": "Declining mental status is one of the most sensitive bedside markers that perfusion is failing — the brain is an early casualty of shock.\n\n- **Sluggish response and loss of face-tracking** signal cerebral hypoperfusion as autoregulation nears its limit\n- Mental-status change often precedes hypotension in children, who compensate BP until late\n- A formerly consolable infant who stops tracking is decompensating until proven otherwise",
      "1.signs.abdomen": "A soft abdomen with hypoactive bowel sounds is the expected, non-surgical finding of shunted splanchnic perfusion.\n\n- **Hypoactive bowel sounds** reflect blood diverted away from the gut to vital organs in shock\n- A **soft, non-distended** abdomen argues against a surgical abdomen or obstruction as the source\n- This is a downstream sign of hypoperfusion, not a primary GI problem",
      "1.signs.urine-output": "Oliguria is a hard endpoint of hypoperfusion — the kidney stops making urine when renal blood flow drops below the filtration threshold.\n\n- **One concentrated diaper in six hours** signals renal perfusion has fallen below the GFR threshold\n- Urine output is a real-time gauge of end-organ perfusion and a resuscitation target\n- Improving output after fluids is one of the clearest signs your resuscitation is working",
      "1.labs.na": "Sodium remains normal — reassuring that the acidosis is driven by lactate, not a mixed electrolyte derangement.\n\n- **Na 136** stays within range as the metabolic picture worsens\n- A normal sodium keeps the anion-gap acidosis attributable to lactate from hypoperfusion\n- Watch it across large-volume resuscitation, which can shift sodium either direction",
      "1.labs.k": "Potassium is normal now, but acidosis and the coming resuscitation make it a value to watch closely.\n\n- **K 4.2** is mid-range despite the acidosis that would tend to push potassium out of cells\n- A normal-to-low K in acidosis hints at a real total-body deficit that fluids and correction can unmask\n- Recheck after resuscitation — potassium can drop as acidosis resolves and cells take it back up"
    },
    // keyTeaching points (authored from the scenario's lessons)
    keyTeaching: [
      "HR–temperature dissociation — temperature falling while heart rate climbs — is an early, reliable sign of septic shock in a febrile infant.",
      "Children defend blood pressure until late; capillary refill, skin perfusion, mental status, and urine output decline well before BP drops.",
      "Give broad-spectrum antibiotics within the first hour of recognizing sepsis — every hour of delay raises mortality.",
      "Fluids before vasopressors in septic shock, reassessing perfusion after each bolus rather than pushing a fixed volume.",
      "Always check glucose in a sick infant — tiny glycogen stores deplete fast, and hypoglycemia is a treatable cause of seizure."
    ]
  },
  SC2: {
    visuals: [],
    // Clinical answer-key fix: the four cardinal dehydration signs were
    // mis-flagged bad:false (learner scored WRONG for catching them).
    // Escalation signs set true too (forward-compat for Stage 2 round 2).
    signBad: {
      "0.signs.skin-turgor": true,
      "0.signs.fontanelle": true,
      "0.signs.mucous-membranes": true,
      "0.signs.behavior": true,
      "1.signs.mottling": true,
      "1.signs.urine-output": true,
      "1.signs.mental-status": true,
      "1.signs.extremities": true
    },
    // Na 134 kept as a coherent reassuring distractor (widen 135-145 -> 133-145).
    labRef: { "0.labs.na": "133-145" },
    priority: {
      "1.meds.nsBolus": "tied-correct",
      "1.tools.ivKit": "correct",
      "1.tools.glucometer": "correct",
      "1.tools.stethoscope": "correct",
      "1.tools.capRefill": "correct",
      "1.tools.thermometer": "distractor-misc",
      "1.tools.defib": "distractor-misc",
      "1.meds.dextroseBolus": "correct",
      "1.meds.acetaminophen": "distractor-misc",
      "1.meds.epiIV": "distractor-clinical",
      "1.meds.albuterol": "distractor-misc",
      "1.meds.ceftriaxone": "distractor-clinical",
      "curveball.tools.defib": "tied-correct",
      "curveball.tools.stethoscope": "correct",
      "curveball.tools.glucometer": "correct",
      "curveball.tools.ivKit": "correct",
      "curveball.tools.capRefill": "distractor-misc",
      "curveball.tools.thermometer": "distractor-misc",
      "curveball.meds.nsBolus": "correct",
      "curveball.meds.adenosine": "distractor-clinical",
      "curveball.meds.epiIV": "distractor-clinical",
      "curveball.meds.lorazepam": "distractor-misc",
      "curveball.meds.atropine": "distractor-misc",
      "curveball.meds.albuterol": "distractor-misc"
    },
    // dextroseBolus reclassified correct (escalation glucose is 54, <60) —
    // re-author its feedback so it no longer reads as a distractor.
    fb: {
      "1.meds.dextroseBolus": "Indicated — glucose is 54 mg/dL, below the 60 mg/dL treatment threshold outside the neonatal period. Give D25W 2 mL/kg (or D10W 5 mL/kg) IV. Three days of vomiting with poor intake exhausts a toddler's hepatic glycogen within 12–16 hours, and hypoglycemia worsens both mental status and myocardial function on top of the shock. Volume resuscitation stays the first priority, but the low glucose needs correcting alongside it — don't leave it on the chart."
    },
    why: {
      "0.signs.mucous-membranes": "Dry, tacky lips and tongue are an early, reproducible bedside marker of dehydration — a finding to flag.\n\n- **Mucous membranes** dry out as total body water falls; tacky-to-dry tracks with roughly 5% or more fluid deficit\n- Combined with a sunken fontanelle and tenting skin, this places the child in at least moderate dehydration\n- It is one of the most reliable exam findings for estimating volume loss in a toddler",
      "0.signs.behavior": "Lethargy that only briefly arouses to voice is an abnormal mental status — an end-organ effect of failing perfusion, not a tired child.\n\n- **Altered mental status** in dehydration reflects reduced cerebral perfusion as circulating volume drops\n- A previously active toddler who won't engage or reach is showing decompensation, not fatigue\n- Declining responsiveness is a marker that prompt resuscitation is needed",
      "0.labs.na": "Sodium sits just below the reference but is essentially isotonic — not the priority derangement in this child.\n\n- **Na 134** reflects mild, expected change in acute gastroenteritis and needs no separate urgent correction\n- It keeps this an **isotonic** dehydration, so standard isotonic fluid resuscitation is appropriate\n- The dangerous electrolytes here are the **potassium** and **chloride**, not the sodium",
      "0.labs.glucose": "Glucose is normal now, but in a vomiting toddler it's a value to recheck rather than forget.\n\n- **Glucose 68** is within range, so hypoglycemia isn't yet contributing to the lethargy\n- A 2-year-old's glycogen stores deplete within ~12–16 hours of poor intake, so this can fall quickly\n- It is already trending down by the next draw — recheck with any change in mental status",
      "1.signs.extremities": "Cool, clammy, pale extremities mark the peripheral vasoconstriction of worsening shock — blood shunted centrally.\n\n- **Cool, clammy skin** reflects sympathetic clamp-down on peripheral vessels to defend core perfusion\n- Pallor and a cool gradient moving proximally track with falling cardiac output\n- Paired with a 5-second cap refill and mottling, this is decompensated, not compensated, shock"
    },
    keyTeaching: [
      "In a child, blood pressure stays normal until late — read perfusion (cap refill, skin, mental status, urine output) and the lab trends, not the BP, to catch compensated shock.",
      "Prolonged vomiting loses H⁺, Cl⁻, and K⁺, producing a hypochloremic, hypokalemic metabolic alkalosis — and the kidney worsens the hypokalemia trying to retain H⁺.",
      "Isotonic fluid boluses (20 mL/kg, reassess, repeat) are first-line for hypovolemic shock from GI losses.",
      "Hypokalemia partially depolarizes cardiac cells and can drive ventricular tachycardia — replace potassium AND magnesium, and keep the child on a monitor.",
      "Treat the root cause, not the monitor: an electrolyte-driven arrhythmia recurs after cardioversion unless the potassium is corrected."
    ]
  }
};

var ov = OVERRIDES[TARGET] || {};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
var VITAL_LABELS = { hr: "HR", rr: "RR", bp: "BP", spo2: "SpO2", temp: "Temp", cap: "Cap Refill" };
var VITAL_UNITS = { hr: "bpm", rr: "/min", bp: "mmHg", spo2: "%", temp: "°C", cap: "sec" };

function kebab(s) {
  return String(s || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function priFor(phaseTag, kind, id, entry) {
  var key = phaseTag + "." + kind + "." + id;
  if (ov.priority && ov.priority[key]) return ov.priority[key];
  // Fallback: derive from legacy ok (corrected — pri 1/2 are must-haves).
  if (entry.ok === true) return (entry.pri === 1 || entry.pri === 2) ? "tied-correct" : "correct";
  return "distractor-clinical";
}

function whyFor(phaseTag, kind, id, existing) {
  if (existing !== null && existing !== undefined && existing !== "") return existing;
  var key = phaseTag + "." + kind + "." + id;
  if (ov.why && ov.why[key]) return ov.why[key];
  return null;
}

function parseRefRange(ref) {
  if (typeof ref !== "string") return null;
  var m = ref.match(/^\s*(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/);
  if (m) return { lo: Number(m[1]), hi: Number(m[2]) };
  var gt = ref.match(/^\s*>=?\s*(-?\d+(?:\.\d+)?)/);
  if (gt) return { lo: Number(gt[1]) };
  var lt = ref.match(/^\s*<=?\s*(-?\d+(?:\.\d+)?)/);
  if (lt) return { hi: Number(lt[1]) };
  return null;
}
function numericVal(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  var m = String(v).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}
// Coherent bad for a lab: outside ref => true. Falls back to existing bad
// when ref/value not numeric.
function labBad(lab) {
  var r = parseRefRange(lab.ref);
  var n = numericVal(lab.value);
  if (r == null || n == null) return !!lab.bad;
  var inside = true;
  if (r.lo !== undefined && n < r.lo) inside = false;
  if (r.hi !== undefined && n > r.hi) inside = false;
  return !inside;
}

function vitalsToArray(vObj, phaseTag) {
  var sbp = vObj.sbp, dbp = vObj.dbp;
  var bp = {
    id: "bp", label: "BP",
    value: (sbp ? sbp.value : "") + "/" + (dbp ? dbp.value : ""),
    unit: "mmHg", bad: sbp ? !!sbp.bad : false, cat: "vital",
    _slotRef: "phase[" + phaseTag + "].vitals.bp.why",
    why: sbp ? (sbp.why === undefined ? null : sbp.why) : null
  };
  var order = ["hr", "rr", "bp", "spo2", "temp", "cap"];
  var out = [];
  order.forEach(function (k) {
    if (k === "bp") { out.push(bp); return; }
    var v = vObj[k];
    if (!v) return;
    out.push({
      id: k, label: v.label || VITAL_LABELS[k] || k,
      value: v.value, unit: v.unit === undefined ? (VITAL_UNITS[k] || "") : v.unit,
      bad: !!v.bad, cat: "vital",
      _slotRef: "phase[" + phaseTag + "].vitals." + k + ".why",
      why: v.why === undefined ? null : v.why
    });
  });
  return out;
}

function reshapeSigns(signs, phaseTag) {
  if (!Array.isArray(signs)) return signs;
  return signs.map(function (s) {
    var id = s.id || kebab(s.label);
    var out = {
      id: id, label: s.label, finding: s.finding
    };
    if (s.pos) out.pos = s.pos;
    if (s.sys) out.sys = s.sys;
    // Clinical answer-key override (per Gate 1 "fix now + document"): a
    // sign whose abnormality was mis-flagged gets corrected here.
    var bkey = phaseTag + ".signs." + id;
    out.bad = (ov.signBad && Object.prototype.hasOwnProperty.call(ov.signBad, bkey)) ? !!ov.signBad[bkey] : !!s.bad;
    out.cat = "clinical";
    out._slotRef = "phase[" + phaseTag + "].signs." + id + ".why";
    out.why = whyFor(phaseTag, "signs", id, s.why);
    return out;
  });
}

function reshapeLabs(labs, phaseTag) {
  if (!Array.isArray(labs)) return labs;
  return labs.map(function (l) {
    var id = l.id || kebab(l.name);
    var rkey = phaseTag + ".labs." + id;
    // ref override widens a range so a borderline value stays a coherent
    // reassuring distractor (orchestrator lab-flag-consistency rule).
    var effRef = (ov.labRef && ov.labRef[rkey]) ? ov.labRef[rkey] : l.ref;
    // bad: explicit override > value-vs-ref coherence default.
    var bad = (ov.labBad && Object.prototype.hasOwnProperty.call(ov.labBad, rkey))
      ? !!ov.labBad[rkey]
      : labBad({ value: l.value, ref: effRef, bad: l.bad });
    return {
      id: id, name: l.name, value: l.value, unit: l.unit, ref: effRef,
      bad: bad, critical: !!l.critical, cat: "lab",
      _slotRef: "phase[" + phaseTag + "].labs." + id + ".why",
      why: whyFor(phaseTag, "labs", id, l.why)
    };
  });
}

function reshapeActions(actions, phaseTag) {
  if (!actions || typeof actions !== "object") return actions;
  function mapKind(coll, kind) {
    if (!coll || typeof coll !== "object") return coll;
    var out = {};
    Object.keys(coll).forEach(function (id) {
      var e = coll[id];
      var priority = priFor(phaseTag, kind, id, e);
      var ok = (priority === "correct" || priority === "tied-correct");
      var entry = { id: id, priority: priority, ok: ok };
      if (e.label) entry.label = e.label;
      if (e.customDescription) entry.customDescription = e.customDescription;
      entry._slotRef = "phase[" + phaseTag + "].actions." + kind + "." + id + ".fb";
      // fb override (per Gate 1 "fix now"): re-author feedback when a
      // distractor was reclassified correct (or vice versa).
      var fbKey = phaseTag + "." + kind + "." + id;
      entry.fb = (ov.fb && ov.fb[fbKey]) ? ov.fb[fbKey] : (e.fb === undefined ? null : e.fb);
      out[id] = entry;
    });
    return out;
  }
  return { tools: mapKind(actions.tools, "tools"), meds: mapKind(actions.meds, "meds") };
}

function reshapePhase(phase, phaseTag, phaseIndex) {
  var isAssess = phaseIndex === 0;
  var out = {
    phaseIndex: phaseIndex,
    id: isAssess ? "assess" : "intervene",
    stageType: isAssess ? "assess" : "intervene",
    title: phase.name || phase.title || (isAssess ? "Assessment" : "Intervention"),
    narrative: phase.narrative,
    vitals: vitalsToArray(phase.vitals, String(phaseTag)),
    signs: reshapeSigns(phase.signs, String(phaseTag)),
    labs: reshapeLabs(phase.labs, String(phaseTag)),
    actions: phase.actions ? reshapeActions(phase.actions, String(phaseTag)) : { tools: {}, meds: {} }
  };
  return out;
}

// Curveball keeps its name + teaches, reshaped like a phase (tag "curveball").
function reshapeCurveball(cb) {
  if (!cb) return cb;
  var out = {
    name: cb.name,
    narrative: cb.narrative,
    vitals: vitalsToArray(cb.vitals, "curveball"),
    signs: reshapeSigns(cb.signs, "curveball"),
    labs: reshapeLabs(cb.labs, "curveball"),
    actions: cb.actions ? reshapeActions(cb.actions, "curveball") : { tools: {}, meds: {} }
  };
  if (Array.isArray(cb.teaches)) out.teaches = cb.teaches;
  return out;
}

function mergeReassessVitals(re) {
  if (!re || !re.vitals) return re;
  var v = re.vitals;
  if (Array.isArray(v)) return re;
  var out = Object.assign({}, re);
  var nv = {};
  ["hr", "rr"].forEach(function (k) { if (v[k] !== undefined) nv[k] = v[k]; });
  if (v.sbp !== undefined || v.dbp !== undefined) nv.bp = (v.sbp !== undefined ? v.sbp : "") + "/" + (v.dbp !== undefined ? v.dbp : "");
  else if (v.bp !== undefined) nv.bp = v.bp;
  ["spo2", "temp", "cap"].forEach(function (k) { if (v[k] !== undefined) nv[k] = v[k]; });
  out.vitals = nv;
  return out;
}

function reshapeDebrief(debrief) {
  if (!debrief || typeof debrief !== "object") return debrief;
  var out = { summary: debrief.summary };
  out.keyTeaching = ov.keyTeaching || (Array.isArray(debrief.explainers) ? debrief.explainers.map(function (e) { return e.title; }) : []);
  var exps = Array.isArray(debrief.physiologyDeepDive) ? null : debrief.explainers;
  if (Array.isArray(debrief.physiologyDeepDive)) {
    out.physiologyDeepDive = debrief.physiologyDeepDive;
  } else if (Array.isArray(exps)) {
    out.physiologyDeepDive = exps.map(function (e) {
      var id = kebab(e.title);
      var content = e.content || "";
      if (e.tldr) content = content + "\n\n**TL;DR:** " + e.tldr;
      return {
        id: id, title: e.title,
        _slotRef: "debrief.physiologyDeepDive." + id + ".content",
        content: content
      };
    });
  } else {
    out.physiologyDeepDive = [];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Build the converted scenario (preserve unknown top-level fields verbatim).
// ---------------------------------------------------------------------------
var converted = {};
converted.id = SC.id;
converted.source = "builtin";
converted.schemaVersion = "5.4.1";
if (SC.title !== undefined) converted.title = SC.title;
if (SC.tier !== undefined) converted.tier = SC.tier;
if (SC.icon !== undefined) converted.icon = SC.icon;
if (SC.tagline !== undefined) converted.tagline = SC.tagline;
if (SC.description !== undefined) converted.description = SC.description;
converted.visuals = ov.visuals || SC.visuals || [];
if (SC.patient !== undefined) converted.patient = SC.patient;
if (SC.emsReport !== undefined) converted.emsReport = SC.emsReport;
if (SC.learnMore !== undefined) converted.learnMore = SC.learnMore;
if (SC.norms !== undefined) converted.norms = SC.norms;
converted.phases = (SC.phases || []).map(function (p, i) { return reshapePhase(p, i, i); });
converted.curveball = SC.curveball ? reshapeCurveball(SC.curveball) : null;
if (SC.reassessment !== undefined) converted.reassessment = mergeReassessVitals(SC.reassessment);
if (SC.stabilizationSummary !== undefined) converted.stabilizationSummary = SC.stabilizationSummary;
converted.debrief = reshapeDebrief(SC.debrief);

// ---------------------------------------------------------------------------
// Splice into builtIn.js: replace `export var SCN = { ... };` block.
// ---------------------------------------------------------------------------
var src = await readFile(BUILTIN_PATH, "utf8");
var startMarker = "export var " + TARGET + " = {";
var startIdx = src.indexOf(startMarker);
if (startIdx < 0) { console.error("Could not find " + startMarker); process.exit(1); }

// Find the end of this scenario's block: the next "export var SC" or EOF.
var nextIdx = src.indexOf("\nexport var SC", startIdx + startMarker.length);
var blockEnd = nextIdx < 0 ? src.length : nextIdx;
var before = src.slice(0, startIdx);
var after = src.slice(blockEnd);

var serialized = "export var " + TARGET + " = " + JSON.stringify(converted, null, 2) + ";\n";
var next = before + serialized + (after.startsWith("\n") ? after : "\n" + after);

await writeFile(BUILTIN_PATH, next, "utf8");

// ---------------------------------------------------------------------------
// Summary of judgment-field changes.
// ---------------------------------------------------------------------------
function listPriorities(tag, actions) {
  if (!actions) return [];
  var lines = [];
  ["tools", "meds"].forEach(function (kind) {
    var coll = actions[kind] || {};
    Object.keys(coll).forEach(function (id) {
      lines.push("    " + tag + "." + kind + "." + id + " -> " + coll[id].priority + " (ok=" + coll[id].ok + ")");
    });
  });
  return lines;
}
console.log("=== Converted " + TARGET + " (" + SC.id + ") ===");
console.log("visuals: " + JSON.stringify(converted.visuals));
console.log("keyTeaching: " + (converted.debrief.keyTeaching || []).length + " points");
console.log("physiologyDeepDive: " + (converted.debrief.physiologyDeepDive || []).length + " entries");
console.log("phases: " + converted.phases.length + (converted.curveball ? " + curveball" : ""));
console.log("priorities:");
converted.phases.forEach(function (p, i) { listPriorities(String(i), p.actions).forEach(function (l) { console.log(l); }); });
if (converted.curveball) listPriorities("curveball", converted.curveball.actions).forEach(function (l) { console.log(l); });
var authored = ov.why ? Object.keys(ov.why).length : 0;
console.log("authored reassuring why fields: " + authored);
console.log("");
console.log("Spliced into builtIn.js. Review with: git diff src/lib/scenarios/builtIn.js");
