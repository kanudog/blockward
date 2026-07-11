// Expected vital-sign ranges for the monitor's reference-band pills and the
// assessment's band-relative judgment (EvaluationPanel / TelemetryDisplay).
//
// De-sanitized from the fable stub (which keyed generic ch1..ch6 by A/B/C/D):
// ranges are keyed by the REAL monitor tile keys (hr, spo2, rr, sbp, temp, cap)
// and resolved per age GROUP (infant/toddler/child/teen). A case's own authored
// `norms` win when present (the generation tailors them to the patient); the
// age-band table below is the generic fallback for built-ins / missing norms.
//
// The BP tile is judged by its first number (systolic), so its band is `sbp`.
// Cap refill is a findings-only vital (hidden from the monitor per owner
// direction 2026-07-10) — a band is kept here only for the examine context.
import { guessAge } from "./age.js";

// PALS-consistent awake normal bands (the learner judges "in range" against
// these). Deliberately age-relative so a value can sit inside the all-comers
// range yet outside the band for this profile.
var BAND_RANGES = {
  infant:  { hr: [100, 160], rr: [30, 55], spo2: [94, 100], sbp: [70, 100],  temp: [36.5, 37.5], cap: [0, 2] },
  toddler: { hr: [90, 150],  rr: [24, 40], spo2: [94, 100], sbp: [80, 110],  temp: [36.5, 37.5], cap: [0, 2] },
  child:   { hr: [70, 120],  rr: [18, 30], spo2: [94, 100], sbp: [90, 115],  temp: [36.5, 37.5], cap: [0, 2] },
  teen:    { hr: [60, 100],  rr: [12, 20], spo2: [94, 100], sbp: [100, 120], temp: [36.5, 37.5], cap: [0, 2] }
};

var LETTER_TO_GROUP = { A: "infant", B: "toddler", C: "child", D: "teen" };

function normalizeGroup(arg) {
  if (arg && typeof arg === "object") return guessAge(arg);        // a case object
  var s = String(arg || "").trim();
  if (LETTER_TO_GROUP[s]) return LETTER_TO_GROUP[s];               // "A".."D"
  if (BAND_RANGES[s.toLowerCase()]) return s.toLowerCase();        // "infant".."teen"
  return "child";
}

// Copy a case's authored norms (keyed hr/rr/sbp/dbp/spo2/temp as [lo,hi]) onto
// the monitor tile keys, falling back to the age band for any missing key.
function fromNorms(norms, base) {
  var out = Object.assign({}, base);
  ["hr", "rr", "spo2", "temp", "sbp"].forEach(function (k) {
    if (Array.isArray(norms[k]) && norms[k].length === 2) out[k] = norms[k];
  });
  return out;
}

// expectedRangesFor(arg) -> { hr, spo2, rr, sbp, temp, cap } of [lo,hi] pairs.
// arg may be a case object (uses sc.norms when present, else its ageLabel), an
// age-group string, or a legacy A/B/C/D band letter.
export function expectedRangesFor(arg) {
  var base = BAND_RANGES[normalizeGroup(arg)] || BAND_RANGES.child;
  if (arg && typeof arg === "object" && arg.norms && typeof arg.norms === "object") {
    return fromNorms(arg.norms, base);
  }
  return base;
}

export { BAND_RANGES };
