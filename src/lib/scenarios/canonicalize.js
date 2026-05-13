// Phase-3.0-hotfix: canonical-ID helpers that bridge the user-facing
// click targets (lab tiles, vital tiles, body-system sub-finding rows)
// to the items that drive scoring + the Why? content.
//
// Phase-5.4.3a: schema 5.4.1 stores items in typed collections
// (phase.vitals object keyed by id, phase.signs[] and phase.labs[]
// arrays of id-keyed items). buildBadMap iterates the typed collections
// directly; the assessItems demux/cat-discriminator has been deleted.

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
//
// Phase-5.4.3a: items now carry an explicit .id field (signs[].id,
// labs[].id). The helpers prefer that .id and fall back to the legacy
// .label / .name fields so transitional fixtures still work.
export function labCanonicalId(lab) {
  if (!lab) return "lab:";
  return "lab:" + (lab.id || lab.name || "");
}
export function vitalCanonicalId(key) { return "vital:" + key; }
export function signCanonicalId(sign) {
  if (!sign) return "sign:";
  return "sign:" + (sign.id || sign.label || "");
}

// Build a canonical-ID → item map for a phase. Used by the rendering
// panels to look up bad / why content for each displayed tile.
//
// Phase-5.4.3a: iterates phase.vitals (object keyed by id), phase.signs[]
// and phase.labs[] directly. Map values are the typed-collection items
// themselves — they already carry .bad and .why under the new schema.
export function buildBadMap(phase) {
  var map = {};
  if (!phase) return map;
  if (phase.vitals && typeof phase.vitals === "object") {
    Object.keys(phase.vitals).forEach(function (k) {
      var v = phase.vitals[k];
      // Skip the legacy scalar shape — only rich objects participate
      // in bad/why lookups. Display code still tolerates either.
      if (v && typeof v === "object") map[vitalCanonicalId(k)] = v;
    });
  }
  if (Array.isArray(phase.signs)) {
    phase.signs.forEach(function (s) {
      var cid = signCanonicalId(s);
      if (cid && !map[cid]) map[cid] = s;
    });
  }
  if (Array.isArray(phase.labs)) {
    phase.labs.forEach(function (l) {
      var cid = labCanonicalId(l);
      if (cid && !map[cid]) map[cid] = l;
    });
  }
  return map;
}
