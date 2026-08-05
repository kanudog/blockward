// Glasgow Coma Scale: the scale table and the parser that pulls E / V / M out
// of a case's free-text finding.
//
// Extracted from FocusedExam.jsx on 2026-08-05 so the coverage checks can
// exercise the REAL parser instead of a copy. Duplicated parsing logic in a
// test is worse than no test — it passes while the shipped code fails, which
// is exactly the drift this repo's audit tooling exists to catch. Plain .js,
// no React, so scripts/*.mjs can import it directly.

export var GCS_SCALE = {
  Eye: { key: "E", max: 4, levels: [[4, "Spontaneous"], [3, "To speech"], [2, "To pain"], [1, "None"]] },
  Verbal: { key: "V", max: 5, levels: [[5, "Oriented / coos & babbles"], [4, "Confused / irritable cry"], [3, "Inappropriate words / cries to pain"], [2, "Incomprehensible / moans"], [1, "None"]] },
  Motor: { key: "M", max: 6, levels: [[6, "Obeys / normal movement"], [5, "Localizes pain"], [4, "Withdraws to pain"], [3, "Abnormal flexion"], [2, "Extension"], [1, "None"]] }
};

// True when this finding is a GCS at all.
export function isGcsText(text) {
  return /gcs|glasgow/i.test(String(text || ""));
}

// Pull E / V / M (and total) out of free text.
//
// Play-test fix 2026-07-29: the original used \bE / \bV / \bM, which requires a
// word boundary before each letter. That holds for the spaced form "E4 V4 M6"
// but NOT for the compact form "(E3V2M4)" — between "3" and "V" both sides are
// word characters, so there is no boundary, V and M never matched, hasParts was
// false, and the whole scoring breakdown silently collapsed to a bare total.
// A TBI case shipped exactly that form and lost its breakdown. Try the compact
// triple first, then fall back to the spaced/labelled forms.
//
// Audit 2026-08-05: a third form was found in BOTH shipped generated cases —
// the components spelled out in words with the score in brackets, and no E/V/M
// letters anywhere: "GCS 14: eyes open spontaneously (4), confused verbal
// response (4), obeys commands (6)". Every real GCS was collapsing to a bare
// number. Three bracketed digits are now read as E, V, M in order, but only
// when each is in range AND they sum to the total the case itself states —
// that agreement check is what makes reading them safe.
export function parseGCS(text) {
  var s = String(text || "");
  var stated = s.match(/gcs[^\d]{0,12}(\d{1,2})/i);
  var statedTotal = stated ? parseInt(stated[1], 10) : null;
  var e = null, v = null, m = null;
  var triple = s.match(/E\s*[:=]?\s*(\d)\s*[,/·]?\s*V\s*[:=]?\s*(\d)\s*[,/·]?\s*M\s*[:=]?\s*(\d)/i);
  if (triple) {
    e = parseInt(triple[1], 10); v = parseInt(triple[2], 10); m = parseInt(triple[3], 10);
  } else {
    e = _one(s, /(?:^|[^A-Za-z])E\s*[:=]?\s*(\d)/i);
    v = _one(s, /(?:^|[^A-Za-z])V\s*[:=]?\s*(\d)/i);
    m = _one(s, /(?:^|[^A-Za-z])M\s*[:=]?\s*(\d)/i);
  }
  if ((e == null || v == null || m == null) && statedTotal != null) {
    var brackets = s.match(/\((\d)\)/g);
    if (brackets && brackets.length === 3) {
      var n = brackets.map(function (b) { return parseInt(b.slice(1, -1), 10); });
      if (_inRange(n[0], n[1], n[2]) && n[0] + n[1] + n[2] === statedTotal) {
        e = n[0]; v = n[1]; m = n[2];
      }
    }
  }
  // Two totals decompose uniquely: 15 can only be E4 V5 M6 (every category at
  // its ceiling) and 3 can only be E1 V1 M1 (every category at its floor). A
  // case that states either without spelling out components still gets a real
  // breakdown, because there is nothing to guess. No other total is unique.
  if ((e == null || v == null || m == null) && statedTotal === 15) { e = 4; v = 5; m = 6; }
  if ((e == null || v == null || m == null) && statedTotal === 3) { e = 1; v = 1; m = 1; }
  var hasParts = e != null && v != null && m != null;
  var sum = hasParts ? e + v + m : null;
  // Only trust component sums that are actually in range (3–15).
  if (hasParts && !_inRange(e, v, m)) hasParts = false;
  return {
    e: e, v: v, m: m,
    total: hasParts ? sum : statedTotal,
    statedTotal: statedTotal,
    // Surfaces a generator error rather than hiding it: when the case states a
    // total that disagrees with its own E/V/M, the learner should see both.
    mismatch: !!(hasParts && statedTotal != null && statedTotal !== sum),
    hasParts: hasParts
  };
}

function _one(s, re) { var x = s.match(re); return x ? parseInt(x[1], 10) : null; }
function _inRange(e, v, m) {
  return e >= 1 && e <= 4 && v >= 1 && v <= 5 && m >= 1 && m <= 6;
}

// ---- prose vs component agreement -------------------------------------------
// parseGCS already catches a stated TOTAL that disagrees with its own E/V/M.
// It cannot catch the other half: components that disagree with the words
// around them. A real generated case wrote "withdraws purposelessly to pain"
// and scored it M3 — withdrawal to pain is M4, M3 is abnormal flexion. The
// arithmetic was self-consistent (2+1+3=6) so nothing flagged it, and the app
// then highlighted "Abnormal flexion" on the scale next to prose saying she
// withdrew. A learner is being taught the wrong pairing.
//
// Deliberately conservative. A descriptor only counts when it is unambiguous:
// if a category's prose implies two different values, or the phrase is negated
// ("no spontaneous movement" must not imply M6), nothing is reported. Silence
// is the safe answer here — a false alarm on the one scale the app renders
// would train people to ignore it.
var DESCRIPTORS = {
  Eye: [
    [4, /(?:eyes?\s+open(?:ing|s)?\s+spontaneous|spontaneous\s+eye\s+open|opens?\s+(?:her|his|their)?\s*eyes?\s+spontaneous)/],
    [3, /(?:eyes?\s+open\w*\s+to\s+(?:voice|speech|sound|command)|opens?\s+(?:her|his|their)?\s*eyes?\s+to\s+(?:voice|speech|sound))/],
    [2, /(?:eyes?\s+open\w*\s+to\s+(?:pain|pressure|sternal)|opens?\s+(?:her|his|their)?\s*eyes?\s+(?:briefly\s+)?to\s+(?:pain|pressure|sternal))/],
    [1, /(?:no\s+eye\s+open|eyes?\s+do(?:es)?\s+not\s+open|no\s+eye-open)/]
  ],
  Verbal: [
    [5, /(?:oriented|age-appropriate\s+(?:words|speech)|coos\s+and\s+babbles|appropriate\s+(?:words|speech|verbal))/],
    [4, /(?:confused|disoriented|irritable\s+cr(?:y|ies)|consolable\s+cr)/],
    [3, /(?:inappropriate\s+words|cries\s+to\s+pain|inconsolable\s+cr)/],
    [2, /(?:incomprehensible|moan|groan|grunt)/],
    [1, /(?:no\s+verbal|no\s+vocal|no\s+sounds?|silent|no\s+cry)/]
  ],
  Motor: [
    [6, /(?:obeys|follows\s+commands|normal\s+spontaneous\s+movement)/],
    [5, /localiz/],
    [4, /withdraw/],
    [3, /(?:abnormal\s+flexion|decorticate|flexor\s+postur|flexion\s+to\s+pain)/],
    [2, /(?:abnormal\s+extension|decerebrate|extensor\s+postur|extension\s+to\s+pain)/],
    [1, /(?:no\s+motor|flaccid|no\s+response\s+to\s+pain|no\s+movement\s+to\s+pain)/]
  ]
};
// A descriptor sitting behind a negation describes what the patient does NOT
// do. Same reasoning as the scene resolver's negation guard.
var NEG_BEFORE = /\b(?:no|not|without|never|denies)\b[^.;,]{0,14}$/;

export function gcsProseConflicts(text, parsed) {
  if (!parsed || !parsed.hasParts) return [];
  var s = String(text || "");
  var low = s.toLowerCase();
  var emitted = { Eye: parsed.e, Verbal: parsed.v, Motor: parsed.m };
  var out = [];
  Object.keys(DESCRIPTORS).forEach(function (cat) {
    var found = [];
    DESCRIPTORS[cat].forEach(function (row) {
      var m = low.match(row[1]);
      if (!m) return;
      if (NEG_BEFORE.test(low.slice(Math.max(0, m.index - 24), m.index))) return;
      found.push({ value: row[0], phrase: m[0].trim() });
    });
    // Ambiguous prose (two different implied values) tells us nothing reliable.
    var distinct = {};
    found.forEach(function (f) { distinct[f.value] = f; });
    var keys = Object.keys(distinct);
    if (keys.length !== 1) return;
    var only = distinct[keys[0]];
    if (only.value !== emitted[cat]) {
      out.push({ category: cat, implied: only.value, emitted: emitted[cat], phrase: only.phrase });
    }
  });
  return out;
}
