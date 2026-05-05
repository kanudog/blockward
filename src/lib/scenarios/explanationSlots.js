// Phase-5.3: walk a phase and identify items whose why/fb is missing,
// empty, or carries the synthesized fallback string. Drives the lazy
// fetch fired from ScenarioPlayer on phase entry for AI scenarios.
//
// Returned items match the contract that fetchExplanations expects:
// { id, label, type, context }. Each carries an attached _slotRef so
// ScenarioPlayer can write the resolved text back into the right slot
// via writeExplanationToSlot.

import { vitalKeyForLabel, labCanonicalId, signCanonicalId, vitalCanonicalId } from "./canonicalize.js";
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

  // 1) Vitals — covered via assessItems with cat:"vital".
  // The displayed surface is the vital chip; the explanation text lives
  // on the matching assessItem.why. Slot ref keys by vital field name
  // (hr, spo2, ...) for stable lookup.
  if (phase.assessItems) {
    phase.assessItems.forEach(function (it) {
      if (!it || !it.cat) return;
      if (it.cat === "vital") {
        var vk = vitalKeyForLabel(it.label);
        if (!vk) return;
        if (!_isMissingText(it.why)) return;
        pushIfNew({
          id: vitalCanonicalId(vk),
          label: it.label,
          type: "vital",
          context: { value: it.label, normalRef: phase.vitals && phase.vitals[vk], norms: sc.norms && sc.norms[vk] },
          _slotRef: { kind: "vital", phaseIdx: phaseIdx, indexOrId: vk }
        });
      } else if (it.cat === "lab") {
        // Lab assessItem's why is the primary content surface; its lab
        // counterpart's lab.why is updated together by writeExplanationToSlot.
        if (!_isMissingText(it.why)) return;
        // Try to pin to a specific labs[] entry by name. If we can't
        // find one, fall back to assessItem.id (the slot ref kind
        // becomes "assessItem" since there's no lab to anchor to).
        var lab = (phase.labs || []).find(function (l) { return l && l.name && it.label && it.label.toLowerCase().indexOf(l.name.toLowerCase()) >= 0; });
        if (lab) {
          pushIfNew({
            id: labCanonicalId(lab),
            label: it.label,
            type: "lab",
            context: { name: lab.name, value: lab.value, unit: lab.unit, ref: lab.ref, critical: !!lab.critical },
            _slotRef: { kind: "lab", phaseIdx: phaseIdx, indexOrId: lab.name }
          });
        } else {
          pushIfNew({
            id: "assess:" + it.id,
            label: it.label,
            type: "assessItem",
            context: { id: it.id, cat: it.cat, bad: !!it.bad },
            _slotRef: { kind: "assessItem", phaseIdx: phaseIdx, indexOrId: it.id }
          });
        }
      } else if (it.cat === "clinical") {
        if (!_isMissingText(it.why)) return;
        var sign = (phase.signs || []).find(function (s) { return s && s.label === it.label; });
        if (sign) {
          pushIfNew({
            id: signCanonicalId(sign),
            label: sign.label,
            type: "sign",
            context: { finding: sign.finding, sys: sign.sys, pos: sign.pos },
            _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: sign.label }
          });
        } else {
          pushIfNew({
            id: "assess:" + it.id,
            label: it.label,
            type: "assessItem",
            context: { id: it.id, cat: it.cat, bad: !!it.bad },
            _slotRef: { kind: "assessItem", phaseIdx: phaseIdx, indexOrId: it.id }
          });
        }
      }
    });
  }

  // 2) Standalone signs that aren't covered by an assessItem (rare —
  // by schema every sign should have a clinical assessItem, but this
  // backstop catches drift).
  if (phase.signs) {
    phase.signs.forEach(function (s) {
      if (!s || !s.label) return;
      if (!_isMissingText(s.why)) return;
      var id = signCanonicalId(s);
      if (seenIds[id]) return;
      pushIfNew({
        id: id,
        label: s.label,
        type: "sign",
        context: { finding: s.finding, sys: s.sys, pos: s.pos },
        _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: s.label }
      });
    });
  }

  // 3) Standalone labs not covered by an assessItem.
  if (phase.labs) {
    phase.labs.forEach(function (l) {
      if (!l || !l.name) return;
      if (!_isMissingText(l.why)) return;
      var id = labCanonicalId(l);
      if (seenIds[id]) return;
      pushIfNew({
        id: id,
        label: l.name + " " + l.value + (l.unit ? " " + l.unit : ""),
        type: "lab",
        context: { name: l.name, value: l.value, unit: l.unit, ref: l.ref, critical: !!l.critical },
        _slotRef: { kind: "lab", phaseIdx: phaseIdx, indexOrId: l.name }
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
