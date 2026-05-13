// Phase-5.3: walk a phase and identify items whose why/fb is missing,
// empty, or carries the synthesized fallback string. Drives the lazy
// fetch fired from ScenarioPlayer on phase entry for AI scenarios.
//
// Phase-5.4.3a: schema 5.4.1 stores items in typed collections — three
// clean loops over phase.vitals (object), phase.signs[] and phase.labs[]
// replace the previous assessItems demux + sibling backstop walk.
//
// Returned items match the contract that fetchExplanations expects:
// { id, label, type, context }. Each carries an attached _slotRef so
// ScenarioPlayer can write the resolved text back into the right slot
// via writeExplanationToSlot.

import { vitalCanonicalId, labCanonicalId, signCanonicalId } from "./canonicalize.js";
import { SYNTHESIZED_FB_FALLBACK } from "./slotResolve.js";

function _isMissingText(s) {
  if (s == null) return true;
  if (typeof s !== "string") return false;
  if (s.trim() === "") return true;
  if (s === SYNTHESIZED_FB_FALLBACK) return true;
  return false;
}

// Inspect an AI scenario's specific phase and return slots where the
// renderer would currently fall back to a placeholder string. Each
// returned item is in fetchExplanations input shape, with _slotRef
// attached for later write-back.
//
// Built-in scenarios: caller (ScenarioPlayer) gates on sc.source ===
// "ai" before invoking this. We don't double-check here — built-ins
// could legitimately have empty `why` fields by author choice and we
// must not start fetching for them.
export function collectMissingExplanationSlots(sc, phaseIdx) {
  if (!sc || !sc.phases) return [];
  var phase = phaseIdx === "curveball" ? sc.curveball : sc.phases[phaseIdx];
  if (!phase) return [];
  var out = [];
  var seenIds = {};

  function pushIfNew(item) {
    if (!item || !item.id) return;
    if (seenIds[item.id]) return;
    seenIds[item.id] = true;
    out.push(item);
  }

  // 1) Vitals — keyed object. Each entry is a rich object with
  // .value, .bad, .why under schema 5.4.1.
  if (phase.vitals && typeof phase.vitals === "object") {
    Object.keys(phase.vitals).forEach(function (vk) {
      var v = phase.vitals[vk];
      if (!v || typeof v !== "object") return;
      if (!_isMissingText(v.why)) return;
      pushIfNew({
        id: vitalCanonicalId(vk),
        label: v.label || vk,
        type: "vital",
        context: { value: v.value, unit: v.unit, normalRef: sc.norms && sc.norms[vk] },
        _slotRef: { kind: "vital", phaseIdx: phaseIdx, indexOrId: vk }
      });
    });
  }

  // 2) Signs — array of rich objects. id-keyed under 5.4.1; label
  // fallback covers transitional fixtures.
  if (Array.isArray(phase.signs)) {
    phase.signs.forEach(function (s) {
      if (!s) return;
      if (!_isMissingText(s.why)) return;
      var sid = s.id || s.label;
      if (!sid) return;
      pushIfNew({
        id: signCanonicalId(s),
        label: s.label || s.id,
        type: "sign",
        context: { finding: s.finding, sys: s.sys, pos: s.pos },
        _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: sid }
      });
    });
  }

  // 3) Labs — array of rich objects. id-keyed under 5.4.1; name
  // fallback covers transitional fixtures.
  if (Array.isArray(phase.labs)) {
    phase.labs.forEach(function (l) {
      if (!l) return;
      if (!_isMissingText(l.why)) return;
      var lid = l.id || l.name;
      if (!lid) return;
      pushIfNew({
        id: labCanonicalId(l),
        label: (l.name || l.id) + (l.value ? " " + l.value : "") + (l.unit ? " " + l.unit : ""),
        type: "lab",
        context: { name: l.name || l.id, value: l.value, unit: l.unit, ref: l.ref, critical: !!l.critical },
        _slotRef: { kind: "lab", phaseIdx: phaseIdx, indexOrId: lid }
      });
    });
  }

  // 4) Action fb (tools + meds). Synthesized fallback string counts as missing.
  if (phase.actions) {
    if (phase.actions.tools) {
      Object.keys(phase.actions.tools).forEach(function (tid) {
        var entry = phase.actions.tools[tid];
        if (!entry) return;
        if (!_isMissingText(entry.fb)) return;
        pushIfNew({
          id: "tool:" + tid,
          label: entry.label || tid,
          type: "tool",
          context: { id: tid, ok: !!entry.ok, priority: entry.pri || null },
          _slotRef: { kind: "tool", phaseIdx: phaseIdx, indexOrId: tid }
        });
      });
    }
    if (phase.actions.meds) {
      Object.keys(phase.actions.meds).forEach(function (mid) {
        var entry = phase.actions.meds[mid];
        if (!entry) return;
        if (!_isMissingText(entry.fb)) return;
        pushIfNew({
          id: "med:" + mid,
          label: entry.label || mid,
          type: "med",
          context: { id: mid, ok: !!entry.ok, priority: entry.pri || null },
          _slotRef: { kind: "med", phaseIdx: phaseIdx, indexOrId: mid }
        });
      });
    }
  }

  return out;
}
