export function guessAge(sc) {
  var label = "";
  if (sc && sc.patient && sc.patient.ageLabel) label = sc.patient.ageLabel.toLowerCase();
  else if (sc && sc.tagline) label = sc.tagline.toLowerCase();
  if (!label) return "child";
  if (label.indexOf("newborn") >= 0 || label.indexOf("neonate") >= 0) return "infant";
  var m = label.match(/(\d+)/);
  if (!m) {
    if (label.indexOf("infant") >= 0 || label.indexOf("baby") >= 0) return "infant";
    if (label.indexOf("toddler") >= 0) return "toddler";
    return "child";
  }
  var n = parseInt(m[1]);
  if (label.indexOf("month") >= 0 || label.indexOf("mo") >= 0) {
    if (n <= 12) return "infant";
    if (n <= 36) return "toddler";
    return "child";
  }
  if (label.indexOf("year") >= 0 || label.indexOf("yr") >= 0 || label.indexOf("yo") >= 0) {
    if (n <= 1) return "infant";
    if (n <= 3) return "toddler";
    if (n <= 10) return "child";
    return "teen";
  }
  if (n <= 2) return "infant";
  if (n <= 4) return "toddler";
  if (n <= 10) return "child";
  return "teen";
}
export function guessSex(sc) {
  if (!sc || !sc.patient) return "neutral";
  var s = (sc.patient.sex || "").toLowerCase();
  if (s === "male" || s === "m" || s === "boy") return "male";
  if (s === "female" || s === "f" || s === "girl") return "female";
  return "neutral";
}
