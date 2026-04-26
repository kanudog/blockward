// Phase-3.0-hotfix: canonical-ID helpers that bridge the user-facing
// click targets (lab tiles, vital tiles, body-system sub-finding rows)
// to the assessItems that drive scoring + the Why? content.
//
// Pre-hotfix the LabPanel / BodySystemsView / AssessPanel each did their
// own content-substring match against assessItems. When the AI's
// assessItems labels did not exactly match the displayed labels, the
// match silently failed: the tile became unclickable and got no Why?
// button. This module replaces that fragile coupling with a single
// canonical-ID scheme, so click targets are decoupled from scoring.

// Map a vital-display label keyword to the vital field key used in
// `phase.vitals`. Mirrors the heuristic that AssessPanel previously
// kept inline. Returns null when no key matches.
export function vitalKeyForLabel(label) {
  var l = (label || "").toLowerCase();
  if (l.indexOf("hr") === 0 || l.indexOf("heart rate") >= 0) return "hr";
  if (l.indexOf("spo2") === 0 || l.indexOf("sat") >= 0 || l.indexOf("o2") === 0) return "spo2";
  if (l.indexOf("rr") === 0 || l.indexOf("resp") >= 0) return "rr";
  if (l.indexOf("bp") === 0 || l.indexOf("sbp") === 0 || l.indexOf("blood pressure") >= 0) return "sbp";
  if (l.indexOf("temp") >= 0) return "temp";
  if (l.indexOf("cap") >= 0) return "cap";
  return null;
}

// Canonical IDs for displayed items. Stable per-phase because labs and
// signs are scoped to a phase. Mark for Review and the deep-dive
// expander already use these prefixes — keep them aligned.
export function labCanonicalId(lab) { return "lab:" + (lab && lab.name ? lab.name : ""); }
export function vitalCanonicalId(key) { return "vital:" + key; }
export function signCanonicalId(sign) { return "sign:" + (sign && sign.label ? sign.label : ""); }

// Map an assessItem to its canonical display ID using the surrounding
// phase context (labs[], signs[], vitals object). Returns null when no
// display item corresponds — the assessItem still scores, but the user
// has no tile to click. Callers should treat null as "orphaned".
export function canonicalizeAssessItem(it, phase) {
  if (!it) return null;
  if (it.cat === "vital") {
    var k = vitalKeyForLabel(it.label);
    return k ? vitalCanonicalId(k) : null;
  }
  if (it.cat === "lab") {
    if (!phase || !phase.labs) return null;
    var lblKey = (it.label || "").toLowerCase();
    for (var i = 0; i < phase.labs.length; i++) {
      var lab = phase.labs[i];
      if (lab && lab.name && lblKey.indexOf(lab.name.toLowerCase()) >= 0) {
        return labCanonicalId(lab);
      }
    }
    return null;
  }
  if (it.cat === "clinical") {
    if (!phase || !phase.signs) return null;
    var key = (it.label || "").toLowerCase().trim();
    // exact match first
    for (var j = 0; j < phase.signs.length; j++) {
      var s = phase.signs[j];
      if (!s || !s.label) continue;
      if (s.label.toLowerCase().trim() === key) return signCanonicalId(s);
    }
    // substring fallback both directions
    for (var k2 = 0; k2 < phase.signs.length; k2++) {
      var s2 = phase.signs[k2];
      if (!s2 || !s2.label) continue;
      var sl = s2.label.toLowerCase().trim();
      if (sl.indexOf(key) >= 0 || key.indexOf(sl) >= 0) return signCanonicalId(s2);
    }
    return null;
  }
  return null;
}

// Build a canonical-ID → assessItem map for a phase. Used by the
// rendering panels to look up bad / why content for each displayed tile.
// Orphan assessItems (no display match) are not included in this map but
// still flow through scoring via the assessItems list itself.
export function buildBadMap(phase) {
  var map = {};
  if (!phase || !phase.assessItems) return map;
  phase.assessItems.forEach(function(it) {
    var cid = canonicalizeAssessItem(it, phase);
    if (cid && !map[cid]) map[cid] = it;
  });
  return map;
}
