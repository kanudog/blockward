// Shared body-system grouping for findings (signs). One source of truth used by
// both BodySystemsView (the read-only systems list) and FocusedExam (the
// examine loop) so a finding always lands under the same real body system.
//
// ---------------------------------------------------------------------------
// Rewritten 2026-07-29 after play-testing. The old version substring-matched a
// keyword list against label + finding text, unbounded and finding-first. That
// produced routings a clinician would call nonsense:
//
//   "Motor / Posturing"  -> Renal          ("urin" inside post·urin·g)
//   "Scalp & Head"       -> GI/Hydration   ("tender" in "boggy and tender")
//   "Neck Veins" (JVD)   -> Respiratory    ("trachea midline" in the finding)
//   "IV Access"          -> Integumentary  ("flush" in "flushing well")
//   "Motor Response"     -> Musculoskeletal (GCS-M split from the GCS)
//
// Three changes fix the whole class of bug:
//
//   1. An explicit `sign.sys` from the generator always wins.
//      CAUTION (audit 2026-08-05): the prompt marks `sys` REQUIRED, but the
//      5.4.1 orchestrator emits it on ZERO signs — every legacy-schema case
//      carries it (44/44) and every 5.4.1 case does not (0/91). So the
//      heuristic below is NOT a legacy fallback, it is the primary path for
//      current output. Treat it as load-bearing and keep check:systems green.
//   2. The LABEL is matched before the finding prose. The label is the subject
//      of the finding; the prose is commentary that happens to mention other
//      organs ("trachea midline", "not tender", "flushing well").
//   3. Keywords match at a word boundary, so "\burin" cannot match "posturing"
//      and "\bvoid" cannot match "avoid".
//
// Lines and devices (IV access, ETT, collars, catheters) are NOT body systems —
// they get their own bucket so they stop polluting the exam.
import { Brain, Heart, Wind, Droplets, Shield, Gauge, Eye, Search, Cable } from "lucide-react";

export var LINES = "Lines & devices";

// Stable head-to-toe-ish ordering for however many systems a case surfaces.
// Lines & devices sits near the end: real exam first, hardware after.
export var SYSTEM_ORDER = [
  "Neuro", "HEENT", "Respiratory", "Cardiovascular", "GI/Hydration",
  "Renal", "Musculoskeletal", "Integumentary", LINES, "Other"
];

export var SYS_ICON = {
  "Neuro": Brain, "Cardiovascular": Heart, "Respiratory": Wind,
  "GI": Droplets, "GI/Hydration": Droplets, "Integumentary": Shield,
  "Renal": Droplets, "Musculoskeletal": Gauge, "HEENT": Eye,
  "Lines & devices": Cable, "Other": Search
};

// Accept the spellings a generator might plausibly emit and fold them onto our
// canonical labels. Anything unrecognised falls through to the heuristic.
var SYS_ALIAS = {
  "neuro": "Neuro", "neurologic": "Neuro", "neurological": "Neuro", "cns": "Neuro",
  "heent": "HEENT", "head": "HEENT", "head and neck": "HEENT", "eent": "HEENT",
  "resp": "Respiratory", "respiratory": "Respiratory", "pulmonary": "Respiratory",
  "cardiac": "Cardiovascular", "cardio": "Cardiovascular", "cardiovascular": "Cardiovascular",
  "circulation": "Cardiovascular",
  "gi": "GI/Hydration", "gi/hydration": "GI/Hydration", "gastrointestinal": "GI/Hydration",
  "abdomen": "GI/Hydration", "abdominal": "GI/Hydration", "hydration": "GI/Hydration",
  "renal": "Renal", "gu": "Renal", "genitourinary": "Renal", "kidney": "Renal",
  // Spellings seen in real generated output that used to fall through to the
  // heuristic (audit 2026-08-05). "vascular" appeared on IV/line findings in
  // four cases and was silently discarded.
  "vascular": LINES, "iv": LINES, "line": LINES,
  "endocrine": "Other", "endocrinology": "Other", "metabolic": "Other",
  "heme": "Other", "hematologic": "Other", "haematologic": "Other",
  "id": "Other", "infectious": "Other", "psych": "Other", "psychiatric": "Other",
  "msk": "Musculoskeletal", "musculoskeletal": "Musculoskeletal", "ortho": "Musculoskeletal",
  "extremities": "Musculoskeletal",
  "skin": "Integumentary", "integumentary": "Integumentary", "derm": "Integumentary",
  "lines": LINES, "lines & devices": LINES, "lines and devices": LINES,
  "devices": LINES, "access": LINES, "tubes": LINES, "monitoring": LINES,
  "other": "Other", "general": "Other"
};

function normalizeSys(raw) {
  if (!raw || typeof raw !== "string") return null;
  var k = raw.trim().toLowerCase();
  if (SYS_ALIAS[k]) return SYS_ALIAS[k];
  for (var i = 0; i < SYSTEM_ORDER.length; i++) {
    if (SYSTEM_ORDER[i].toLowerCase() === k) return SYSTEM_ORDER[i];
  }
  return null;
}

// Ordered rules. First match wins, so the most specific / most commonly
// mis-attributed categories come first. Each entry is a word-start prefix.
var RULES = [
  [LINES, ["iv access", "iv site", "peripheral iv", "central line", "central venous",
    "picc", "port-a-cath", "intraosseous", "io access", "io site", "arterial line",
    "a-line", "ett", "endotracheal tube", "tracheostomy", "trach tube",
    "c-collar", "cervical collar", "collar", "foley", "urinary catheter", "catheter",
    "ng tube", "og tube", "gastric tube", "chest tube", "thoracostomy", "drain",
    "pacer pad", "pacing pad", "defib pad", "vasoactive infusion", "infusion",
    "ventilator", "vent setting", "cannula", "tubing"]],

  // Neuro owns the whole neurological exam, INCLUDING motor and posturing.
  // Those used to leak to Musculoskeletal and Renal respectively.
  ["Neuro", ["neuro", "mental status", "mentation", "gcs", "glasgow", "avpu",
    "conscious", "consciousness", "unrespons", "responsive", "letharg", "obtund",
    "somnolen", "stupor", "coma", "alert", "orient", "confus", "agitat", "irritab",
    "seiz", "convuls", "postur", "decerebrat", "decorticat", "motor response",
    "motor exam", "motor", "sensory", "reflex", "babinski", "clonus", "tone",
    "fontanelle", "gaze", "nystagmus", "cranial nerve", "focal deficit",
    "pupil", "anisocor", "papilledema"]],

  ["HEENT", ["heent", "scalp", "skull", "head exam", "head injury", "cranium",
    "battle sign", "raccoon", "otorrhea", "rhinorrhea", "face", "facial", "ear",
    "tympan", "nose", "nasal", "throat", "pharyn", "tonsil", "oropharyn",
    "mucous membrane", "oral mucosa", "lip", "tongue", "dentition", "neck stiff",
    "nuchal", "meningism"]],

  ["Respiratory", ["resp", "lung", "breath", "wheez", "retract", "stridor",
    "airway", "tripod", "trachea", "apne", "crackle", "rale", "rhonchi", "grunt",
    "work of breathing", "accessory muscle", "nasal flar", "chest ris",
    "air entry", "etco2", "capnograph", "oxygenation", "cough", "sputum"]],

  ["Cardiovascular", ["cardi", "heart", "pulse", "rhythm", "murmur", "gallop",
    "jvd", "jugular", "neck vein", "perfus", "cap refill", "capillary refill",
    "mottl", "cool extremit", "cold extremit", "precordi", "apical", "thrill",
    "edema", "peripheral pulse", "central pulse", "blood pressure", "hypotens",
    "hypertens", "brady", "tachycard"]],

  // "guard" and "rebound" used to sit here bare, which filed a FORELIMB
  // fracture under GI: "Reports pain 8/10 at the left forearm… guarding the
  // arm" (a real shipped case). Both are now required to name the abdomen —
  // any genuinely abdominal finding is already caught by "abdom"/"peritone".
  ["GI/Hydration", ["abdom", "bowel", "peritone", "vomit",
    "emesis", "diarrhea", "stool", "hepat", "splenomeg", "liver edge", "ascites",
    "hydrat", "oral intake", "feed", "npo", "distend",
    "involuntary guarding", "rebound tender"]],

  ["Renal", ["renal", "urin", "kidney", "diaper", "oligur", "anur", "void",
    "bladder", "flank", "genital"]],

  ["Musculoskeletal", ["musculoskeletal", "deform", "fractur", "dislocat",
    "splint", "traction", "range of motion", "swelling", "joint", "bone",
    "limb", "extremity", "extremities", "forearm", "femur", "tibia", "pelvi",
    "c-spine", "cervical spine", "spine", "midline tender", "step-off"]],

  ["Integumentary", ["skin", "integument", "rash", "hive", "urticar", "flush",
    "cyan", "pale", "pallor", "diaphor", "petechia", "purpur", "ecchymos",
    "bruis", "wound", "laceration", "abrasion", "road rash", "burn", "blister",
    "turgor", "capillary bed"]]
];

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
var COMPILED = RULES.map(function (rule) {
  return [rule[0], new RegExp("\\b(?:" + rule[1].map(esc).join("|") + ")", "i")];
});

function matchRules(text) {
  if (!text) return null;
  for (var i = 0; i < COMPILED.length; i++) {
    if (COMPILED[i][1].test(text)) return COMPILED[i][0];
  }
  return null;
}

// guessSys(sign) -> a real system label.
// Priority: explicit sys > label match > position hint > finding-prose match.
export function guessSys(s) {
  if (!s) return "Other";
  var explicit = normalizeSys(s.sys);
  if (explicit) return explicit;

  // The label is the subject of the finding — match it first.
  var byLabel = matchRules(s.label);
  if (byLabel) return byLabel;

  // A structured position beats loose prose.
  var pos = (s.pos || "").toLowerCase();
  if (pos) {
    if (/\b(head|face|scalp|skull|ear|nose|throat|mouth)/.test(pos)) return "HEENT";
    if (/\b(precordi|chest wall|apical)/.test(pos)) return "Cardiovascular";
    if (/\b(abdomen|abdominal|flank)/.test(pos)) return "GI/Hydration";
    var byPos = matchRules(pos);
    if (byPos) return byPos;
  }

  // Last resort: the prose. This is where incidental words live, so it only
  // runs when the label and position told us nothing.
  var byFinding = matchRules(s.finding);
  if (byFinding) return byFinding;

  return "Other";
}

// True for hardware/access items, which are shown apart from the body-system
// exam rather than filed under an organ system.
export function isLineOrDevice(s) { return guessSys(s) === LINES; }

export function orderSystems(keys) {
  return keys.slice().sort(function (a, b) {
    var ia = SYSTEM_ORDER.indexOf(a); var ib = SYSTEM_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}
