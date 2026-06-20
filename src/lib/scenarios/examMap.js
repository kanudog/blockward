// Focused-exam mapper. Turns each generated physical-exam sign into an
// "exam" descriptor the FocusedExam UI can render: which body region the
// camera zooms to, which animation plays, and the params that drive it.
//
// Design intent (no prompt changes): the orchestrator already emits signs[]
// with prose `finding` + a Haiku-filled/Sonnet-verified `why`. We keep those
// verbatim and DERIVE the animation by keyword — the same idea as the
// avatar's visuals[] accessories — pulling structured params (breathing
// rate, cap-refill seconds) straight from the phase vitals where they exist.
// Anything we don't have a bespoke animation for falls back to "inspect"
// (a plain region zoom + the finding text), so every sign always renders.

// Animation registry keys implemented in examAnimations.jsx. Keep in sync.
// pupil-reaction | breathing | cap-refill | gcs | skin-inspect | inspect

function _txt(sign) {
  if (!sign) return "";
  return ((sign.label || "") + " " + (sign.finding || "") + " " + (sign.sys || "") + " " + (sign.pos || "")).toLowerCase();
}
function _has(text, list) {
  for (var i = 0; i < list.length; i++) { if (text.indexOf(list[i]) >= 0) return true; }
  return false;
}
function _vitalNum(vitals, key) {
  if (!vitals) return null;
  var v = Array.isArray(vitals) ? null : vitals[key];
  if (Array.isArray(vitals)) { for (var i = 0; i < vitals.length; i++) { if (vitals[i] && vitals[i].id === key) { v = vitals[i]; break; } } }
  if (!v) return null;
  var raw = (typeof v === "object") ? v.value : v;
  var n = parseFloat(raw);
  return isNaN(n) ? null : n;
}
function _firstNum(text) {
  var m = text.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

// Parse the two pupil sizes + reactivity from a finding such as
// "right pupil 4 mm nonreactive, left 2 mm briskly reactive".
function _pupilParams(text) {
  var sizes = [];
  var re = /(\d+(?:\.\d+)?)\s*mm/g, m;
  while ((m = re.exec(text)) !== null) { sizes.push(parseFloat(m[1])); }
  var aniso = _has(text, ["anisocoria", "unequal", "asymmetr"]);
  var fixedSide = _has(text, ["fixed", "nonreactive", "non-reactive", "unreactive", "blown", "sluggish", "no reaction"]);
  var leftMm = sizes.length > 1 ? sizes[1] : (sizes.length ? sizes[0] : 3);
  var rightMm = sizes.length > 0 ? sizes[0] : 3;
  // If asymmetry is described but only one size parsed, widen the larger.
  if (aniso && sizes.length < 2) { rightMm = Math.max(rightMm, 4); leftMm = Math.min(leftMm, 2); }
  return {
    leftMm: leftMm, rightMm: rightMm,
    leftReact: (aniso || fixedSide) ? "brisk" : "brisk",
    rightReact: (aniso || fixedSide) ? "fixed" : "brisk",
    aniso: aniso || fixedSide
  };
}

function _skinLesion(text) {
  if (_has(text, ["petechia", "purpura", "non-blanch", "nonblanch"])) return "petechiae";
  if (_has(text, ["hive", "urticaria", "wheal"])) return "hives";
  if (_has(text, ["haematoma", "hematoma", "bruis", "ecchymos", "contusion"])) return "bruise";
  if (_has(text, ["lacerat", "wound", "abrasion", "cut"])) return "laceration";
  if (_has(text, ["cyan"])) return "cyanosis";
  if (_has(text, ["jaund", "icter"])) return "jaundice";
  if (_has(text, ["pale", "pallor"])) return "pallor";
  if (_has(text, ["mottl"])) return "mottling";
  if (_has(text, ["rash", "macul", "papul", "erythem"])) return "rash";
  return "normal";
}

// Pick the animation + region from a piece of text (no params yet). Returns
// null when nothing matches. Order matters: specific regions before skin's
// broad keyword net.
function _select(text) {
  if (_has(text, ["pupil", "anisocoria"])) return { animation: "pupil-reaction", region: "eyes" };
  if (_has(text, ["breath", "respir", "retract", "lung", "wheez", "stridor", "tripod", "grunt", "flar", "accessory muscle", "work of breath", "air entry", "apnea", "apnoea", "chest wall"])) return { animation: "breathing", region: "chest" };
  if (_has(text, ["cap refill", "capillary", "perfus", "mottl", "cool ext", "cool periph", "pulse"])) return { animation: "cap-refill", region: "perfusion" };
  if (_has(text, ["mental status", "gcs", "avpu", "conscious", "letharg", "responsive", "alert", "obtund", "stupor", "neuro", "sensorium", "orientat"])) return { animation: "inspect", region: "neuro" };
  if (_has(text, ["abdom", "bowel", "distension", "distention", "guard", "rigid", "periton"])) return { animation: "inspect", region: "abdomen" };
  if (_has(text, ["skin", "rash", "petechia", "purpura", "hive", "urticaria", "cyan", "pale", "pallor", "jaund", "bruis", "haematoma", "hematoma", "lacerat", "wound", "flush", "diaphor", "mucous", "turgor", "sunken", "hydrat", "fontanelle", "integument", "lip", "edema", "oedema", "angioedema", "facial", "swell", "sting", "bite", "blister"])) return { animation: "skin-inspect", region: "skin" };
  if (_has(text, ["eye", "sclera", "conjunctiv"])) return { animation: "inspect", region: "eyes" };
  return null;
}

// Resolve one sign -> { animation, region, params }. Selection keys off the
// sign's LABEL (+ sys) first — that's the clean exam name ("Skin", "Breath
// Sounds", "Pulse Quality") — and only falls back to the finding prose when
// the label is uninformative, since prose mentions many body parts and would
// otherwise mis-route. The finding prose is still used for param extraction.
export function examForSign(sign, vitals) {
  var labelSys = ((((sign && sign.label) || "") + " " + ((sign && sign.sys) || "")).toLowerCase());
  var full = _txt(sign);
  var sel = _select(labelSys) || _select(full) || { animation: "inspect", region: "general" };
  var params = {};
  if (sel.animation === "pupil-reaction") {
    params = _pupilParams(full);
  } else if (sel.animation === "breathing") {
    var rate = _vitalNum(vitals, "rr");
    params = { rate: rate || 24, retractions: _has(full, ["retract", "indraw", "recession", "accessory"]), irregular: _has(full, ["irregular", "agonal", "periodic", "apnea", "apnoea"]) };
  } else if (sel.animation === "cap-refill") {
    var sec = _vitalNum(vitals, "cap");
    if (sec == null) sec = _firstNum(full);
    params = { seconds: sec || 2, mottled: _has(full, ["mottl"]) };
  } else if (sel.animation === "skin-inspect") {
    params = { lesion: _skinLesion(full) };
  }
  return { animation: sel.animation, region: sel.region, params: params };
}

// Build the full exam list for an assess phase: one descriptor per sign,
// carrying the sign through for the flag/why payload. Vitals are passed so
// the breathing/cap-refill animations can read the real rate/seconds.
export function buildExams(signs, vitals) {
  if (!Array.isArray(signs)) return [];
  var out = [];
  for (var i = 0; i < signs.length; i++) {
    var s = signs[i];
    if (!s) continue;
    var m = examForSign(s, vitals);
    out.push({
      id: s.id || ("sign" + i),
      label: s.label || "Examine",
      finding: s.finding || "",
      why: s.why || null,
      sign: s,
      animation: m.animation,
      region: m.region,
      params: m.params
    });
  }
  return out;
}
