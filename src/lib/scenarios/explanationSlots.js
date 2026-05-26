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

  // 1) Vitals — array under schema 5.4.1 (Phase 6.1). Each entry is a
  // rich object with .id, .value, .bad, .why. Object shape kept as a
  // defensive fallback for any non-migrated input.
  if (phase.vitals) {
    if (Array.isArray(phase.vitals)) {
      for (var pvi = 0; pvi < phase.vitals.length; pvi++) {
        var pva = phase.vitals[pvi];
        if (!pva || typeof pva !== "object") continue;
        if (_isMissingText(pva.why)) {
          var pvk = pva.id || String(pvi);
          pushIfNew({
            id: vitalCanonicalId(pvk),
            label: pva.label || pvk,
            type: "vital",
            context: { value: pva.value, unit: pva.unit, normalRef: sc.norms && sc.norms[pvk] },
            _slotRef: { kind: "vital", phaseIdx: phaseIdx, indexOrId: pvk }
          });
        }
      }
    } else if (typeof phase.vitals === "object") {
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

// Phase 6.0: wave dispatcher walker. Returns a flat array of
// {slotRefString, wave, kind} for every unfilled slot in the scenario.
// Unlike collectMissingExplanationSlots (per-phase, item-id keyed,
// shaped for the legacy fetchExplanations contract), this walker is
// scenario-wide, slot-ref-string keyed, and tagged with wave + kind
// so the dispatcher can group calls into priority waves.
//
// Wave mapping (per docs/phase-5-lazy-generation/08-dispatcher-architecture.md):
//   wave 1: Phase 1 vital/sign/lab `why`         (per-item, Assess gate)
//   wave 2: Phase 1 tool/med `fb`                (per-item, background)
//   wave 3: Phase 2 vital/sign/lab `why`         (per-item, background)
//   wave 4: Phase 2 tool/med `fb`                (per-item, background)
//   wave 5: debrief.physiologyDeepDive `content` (deep-dive, background)
//
// Defensive: any item whose _slotRef is missing/empty/non-string is
// skipped silently. Built-ins (sc.source !== "ai") gate out at the
// caller; this walker just returns whatever slots qualify.
//
// Phase index resolution: prefers phase.phaseIndex (schema 5.4.1
// authoritative field as emitted by the orchestrator); falls back to
// the array index when absent (covers fixtures that omit it).
export function collectAllNullSlots(scenario) {
  if (!scenario) return [];
  var out = [];

  function _hasRef(item) {
    return item && typeof item._slotRef === "string" && item._slotRef.length > 0;
  }

  if (Array.isArray(scenario.phases)) {
    scenario.phases.forEach(function (phase, idx) {
      if (!phase) return;
      var phaseIdx = (typeof phase.phaseIndex === "number") ? phase.phaseIndex : idx;
      var whyWave = phaseIdx === 0 ? 1 : 3;
      var fbWave = phaseIdx === 0 ? 2 : 4;

      // Vitals — array under schema 5.4.1 (Phase 6.1); object kept
      // as defensive fallback for any non-migrated input.
      if (phase.vitals) {
        if (Array.isArray(phase.vitals)) {
          for (var pvi2 = 0; pvi2 < phase.vitals.length; pvi2++) {
            var pva2 = phase.vitals[pvi2];
            if (!pva2 || typeof pva2 !== "object") continue;
            if (pva2.why !== null) continue;
            if (!_hasRef(pva2)) continue;
            out.push({ slotRefString: pva2._slotRef, wave: whyWave, kind: "per-item" });
          }
        } else if (typeof phase.vitals === "object") {
          Object.keys(phase.vitals).forEach(function (vk) {
            var v = phase.vitals[vk];
            if (!v || typeof v !== "object") return;
            if (v.why !== null) return;
            if (!_hasRef(v)) return;
            out.push({ slotRefString: v._slotRef, wave: whyWave, kind: "per-item" });
          });
        }
      }

      // Signs — array of rich objects.
      if (Array.isArray(phase.signs)) {
        phase.signs.forEach(function (s) {
          if (!s) return;
          if (s.why !== null) return;
          if (!_hasRef(s)) return;
          out.push({ slotRefString: s._slotRef, wave: whyWave, kind: "per-item" });
        });
      }

      // Labs — array of rich objects.
      if (Array.isArray(phase.labs)) {
        phase.labs.forEach(function (l) {
          if (!l) return;
          if (l.why !== null) return;
          if (!_hasRef(l)) return;
          out.push({ slotRefString: l._slotRef, wave: whyWave, kind: "per-item" });
        });
      }

      // Action fb — tools + meds keyed objects.
      if (phase.actions) {
        if (phase.actions.tools && typeof phase.actions.tools === "object") {
          Object.keys(phase.actions.tools).forEach(function (tid) {
            var entry = phase.actions.tools[tid];
            if (!entry) return;
            if (entry.fb !== null) return;
            if (!_hasRef(entry)) return;
            out.push({ slotRefString: entry._slotRef, wave: fbWave, kind: "per-item" });
          });
        }
        if (phase.actions.meds && typeof phase.actions.meds === "object") {
          Object.keys(phase.actions.meds).forEach(function (mid) {
            var entry = phase.actions.meds[mid];
            if (!entry) return;
            if (entry.fb !== null) return;
            if (!_hasRef(entry)) return;
            out.push({ slotRefString: entry._slotRef, wave: fbWave, kind: "per-item" });
          });
        }
      }
    });
  }

  // Debrief deep dives — array of {id, title, content, _slotRef}.
  if (scenario.debrief && Array.isArray(scenario.debrief.physiologyDeepDive)) {
    scenario.debrief.physiologyDeepDive.forEach(function (entry) {
      if (!entry) return;
      if (entry.content !== null) return;
      if (typeof entry._slotRef !== "string" || entry._slotRef.length === 0) return;
      out.push({ slotRefString: entry._slotRef, wave: 5, kind: "deep-dive" });
    });
  }

  return out;
}
