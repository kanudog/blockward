// Shared body-system grouping for findings (signs). One source of truth used by
// both BodySystemsView (the read-only systems list) and FocusedExam (the
// examine loop) so a finding always lands under the same real body system.
//
// guessSys(sign) -> a real system label. Prefers an explicit sign.sys; otherwise
// a keyword heuristic over the label + finding text. SYS_ICON maps each label to
// a lucide icon. SYSTEM_ORDER gives a stable head-to-toe-ish display order.
import { Brain, Heart, Wind, Droplets, Shield, Gauge, Eye, Search } from "lucide-react";

export function guessSys(s) {
  if (s && s.sys) return s.sys;
  var l = ((s && s.label) + " " + ((s && s.finding) || "")).toLowerCase();
  if (l.indexOf("neuro") >= 0 || l.indexOf("mental") >= 0 || l.indexOf("gcs") >= 0 || l.indexOf("glasgow") >= 0 || l.indexOf("pupil") >= 0 || l.indexOf("fontanelle") >= 0 || l.indexOf("conscious") >= 0 || l.indexOf("alert") >= 0 || l.indexOf("letharg") >= 0 || l.indexOf("responsive") >= 0 || l.indexOf("behavior") >= 0 || l.indexOf("irritable") >= 0 || l.indexOf("seiz") >= 0 || l.indexOf("gaze") >= 0 || l.indexOf("avpu") >= 0) return "Neuro";
  if (l.indexOf("heart") >= 0 || l.indexOf("cardio") >= 0 || l.indexOf("pulse") >= 0 || l.indexOf("rhythm") >= 0 || l.indexOf("jvd") >= 0 || l.indexOf("jugular") >= 0 || l.indexOf("perfus") >= 0 || l.indexOf("cap refill") >= 0 || l.indexOf("capillary") >= 0 || l.indexOf("cool ext") >= 0 || l.indexOf("mottl") >= 0 || l.indexOf("murmur") >= 0) return "Cardiovascular";
  if (l.indexOf("lung") >= 0 || l.indexOf("breath") >= 0 || l.indexOf("wheez") >= 0 || l.indexOf("retract") >= 0 || l.indexOf("stridor") >= 0 || l.indexOf("airway") >= 0 || l.indexOf("respir") >= 0 || l.indexOf("tripod") >= 0 || l.indexOf("trachea") >= 0 || l.indexOf("apne") >= 0 || l.indexOf("crackle") >= 0 || l.indexOf("grunt") >= 0 || l.indexOf("work of breathing") >= 0) return "Respiratory";
  if (l.indexOf("abdomen") >= 0 || l.indexOf("bowel") >= 0 || l.indexOf("vomit") >= 0 || l.indexOf("mucous") >= 0 || l.indexOf("oral intake") >= 0 || l.indexOf("hydrat") >= 0 || l.indexOf("feed") >= 0 || l.indexOf("tender") >= 0) return "GI/Hydration";
  if (l.indexOf("urin") >= 0 || l.indexOf("renal") >= 0 || l.indexOf("kidney") >= 0 || l.indexOf("diaper") >= 0 || l.indexOf("oligur") >= 0 || l.indexOf("void") >= 0) return "Renal";
  if (l.indexOf("skin") >= 0 || l.indexOf("rash") >= 0 || l.indexOf("hive") >= 0 || l.indexOf("urticar") >= 0 || l.indexOf("flush") >= 0 || l.indexOf("cyan") >= 0 || l.indexOf("pale") >= 0 || l.indexOf("pallor") >= 0 || l.indexOf("diaphor") >= 0 || l.indexOf("petechia") >= 0 || l.indexOf("integument") >= 0 || l.indexOf("wound") >= 0 || l.indexOf("laceration") >= 0 || l.indexOf("dressing") >= 0 || l.indexOf("bruis") >= 0) return "Integumentary";
  if (l.indexOf("deform") >= 0 || l.indexOf("fracture") >= 0 || l.indexOf("extremity") >= 0 || l.indexOf("limb") >= 0 || l.indexOf("splint") >= 0 || l.indexOf("range of motion") >= 0 || l.indexOf("swelling") >= 0 || l.indexOf("musculoskeletal") >= 0 || l.indexOf("posture") >= 0 || l.indexOf("motor") >= 0 || l.indexOf("forearm") >= 0 || l.indexOf("bone") >= 0) return "Musculoskeletal";
  if (s && (s.pos === "head" || s.pos === "face")) return "HEENT";
  if (l.indexOf("head") >= 0 || l.indexOf("face") >= 0 || l.indexOf("ear") >= 0 || l.indexOf("nose") >= 0 || l.indexOf("throat") >= 0 || l.indexOf("neck") >= 0 || l.indexOf("collar") >= 0) return "HEENT";
  return "Other";
}

export var SYS_ICON = {
  "Neuro": Brain, "Cardiovascular": Heart, "Respiratory": Wind,
  "GI": Droplets, "GI/Hydration": Droplets, "Integumentary": Shield,
  "Renal": Droplets, "Musculoskeletal": Gauge, "HEENT": Eye, "Other": Search
};

// Stable head-to-toe-ish ordering for however many systems a case surfaces.
export var SYSTEM_ORDER = ["Neuro", "HEENT", "Respiratory", "Cardiovascular", "GI/Hydration", "Renal", "Musculoskeletal", "Integumentary", "Other"];

export function orderSystems(keys) {
  return keys.slice().sort(function (a, b) {
    var ia = SYSTEM_ORDER.indexOf(a); var ib = SYSTEM_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}
