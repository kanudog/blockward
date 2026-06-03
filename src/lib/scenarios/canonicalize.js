// Phase-3.0-hotfix: canonical-ID helpers that bridge the user-facing
// click targets (lab tiles, vital tiles, body-system sub-finding rows)
// to the items that drive scoring + the Why? content.
//
// Phase-5.4.3a: schema 5.4.1 stores items in typed collections
// (phase.vitals object keyed by id, phase.signs[] and phase.labs[]
// arrays of id-keyed items). buildBadMap iterates the typed collections
// directly; the assessItems demux/cat-discriminator has been deleted.

// Phase 6.1: normalize a vitals collection into an id-keyed lookup
// regardless of whether the source is the new array shape (schema
// 5.4.1 phase.vitals) or the legacy/snapshot object shape (built-in
// vitals, curveball.vitals, reassessment.vitals). VitalsDisplay and
// AssessPanel both read by id (.hr, .spo2, etc.) so storing the
// player-store `vit` state in lookup form lets them stay agnostic.
//
// Phase 6.2b.4-fixup: optional second argument `signs` lets us
// backfill capillary refill into the vitals lookup when Sonnet
// emits it as a sign (with prose `finding`) rather than as a vital.
// The orchestrator prompt is being tightened to emit cap as a vital
// going forward, but in-flight scenarios generated under earlier
// prompt iterations still have cap in signs[] — VitalsDisplay's
// monitor reads from the vitals lookup only, so we synthesize a
// `cap` entry here when missing.
//
// Defensive: returns null/undefined inputs as-is so call sites that
// guard on truthiness keep working. Anything other than array/object
// passes through unchanged. Signs argument is fully optional — call
// sites that don't have signs available (e.g., reassessment vitals
// snapshot) simply omit it.
export function vitalsLookup(vitals, signs) {
  if (vitals == null) return vitals;
  var lookup;
  if (Array.isArray(vitals)) {
    lookup = {};
    for (var i = 0; i < vitals.length; i++) {
      var v = vitals[i];
      if (v && v.id) lookup[v.id] = v;
    }
  } else {
    lookup = vitals;
  }
  // Cap refill backfill from signs. Only fires when the vitals
  // lookup lacks a cap entry AND signs is a non-empty array.
  if (Array.isArray(signs) && !lookup.cap) {
    for (var si = 0; si < signs.length; si++) {
      var s = signs[si];
      if (!s) continue;
      if (s.id === "cap" || s.id === "capRefill") {
        // Synthesize a vital-shaped entry. The sign's finding is
        // prose; VitalsDisplay's vStr() extracts .value, so we use
        // .finding as .value here. Unit empty because cap refill
        // text typically includes the unit inline ("4 sec").
        lookup.cap = {
          id: "cap",
          label: s.label || "Cap Refill",
          value: s.finding || s.value || "",
          unit: "",
          bad: !!s.bad
        };
        break;
      }
    }
  }
  return lookup;
}

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
  if (phase.vitals) {
    if (Array.isArray(phase.vitals)) {
      // Phase 6.1: array shape from the migration helper / orchestrator.
      for (var vi = 0; vi < phase.vitals.length; vi++) {
        var va = phase.vitals[vi];
        if (va && typeof va === "object" && va.id) map[vitalCanonicalId(va.id)] = va;
      }
    } else if (typeof phase.vitals === "object") {
      // Legacy object shape — kept defensive for any non-migrated
      // path that reaches this helper (e.g., raw curveball snapshots).
      Object.keys(phase.vitals).forEach(function (k) {
        var v = phase.vitals[k];
        if (v && typeof v === "object") map[vitalCanonicalId(k)] = v;
      });
    }
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
