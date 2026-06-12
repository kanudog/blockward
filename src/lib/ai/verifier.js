// Phase 6.3 (Stage 3.5): cross-check verifier orchestration. After the dispatcher
// fills a unit's why/fb slots (Haiku, in isolation), this runs ONE Sonnet pass
// over that whole unit and applies the verdicts in place: repair -> write the
// corrected text; drop -> "" (the existing "no explanation" state — non-null so
// it isn't re-collected / re-filled); ok -> leave. Persistence + re-render are
// the caller's callbacks. Idempotency is handled upstream by dispatcherShouldRun
// (a fully-filled scenario short-circuits the dispatcher, so verify never runs on
// replay). Design: docs/superpowers/specs/2026-06-11-cross-check-verifier-design.md
import { verifyExplanations } from "./client.js";
import { parseSlotRefString, writeExplanationToSlot } from "../scenarios/slotResolve.js";

function _safe(s) { return (typeof s === "string" && s) ? s : ""; }
function _filled(t) { return typeof t === "string" && t.length > 0; }

// The phase-like object(s) a unit covers. unitKey: phase0 | phase1 | round2 | curveball.
function _unitPhases(scenario, unitKey) {
  if (!scenario) return [];
  if (unitKey === "curveball") return scenario.curveball ? [scenario.curveball] : [];
  var phases = Array.isArray(scenario.phases) ? scenario.phases : [];
  function pidx(p, i) { return (typeof p.phaseIndex === "number") ? p.phaseIndex : i; }
  if (unitKey === "phase0") return phases.filter(function (p, i) { return p && pidx(p, i) === 0; });
  if (unitKey === "phase1") return phases.filter(function (p, i) { return p && pidx(p, i) === 1; });
  if (unitKey === "round2") return phases.filter(function (p, i) { return p && pidx(p, i) >= 2; });
  return [];
}

// Walk a unit's FILLED why (vitals/signs/labs) + fb (actions tools/meds) slots.
export function collectUnitFilledItems(scenario, unitKey) {
  var out = [];
  _unitPhases(scenario, unitKey).forEach(function (ph) {
    if (!ph) return;
    if (Array.isArray(ph.vitals)) ph.vitals.forEach(function (v) {
      if (v && typeof v === "object" && typeof v._slotRef === "string" && _filled(v.why)) out.push({ slotRef: v._slotRef, kind: "vital why", label: v.label || v.id, text: v.why });
    });
    if (Array.isArray(ph.signs)) ph.signs.forEach(function (s) {
      if (s && typeof s._slotRef === "string" && _filled(s.why)) out.push({ slotRef: s._slotRef, kind: "sign why", label: s.label || s.id, text: s.why });
    });
    if (Array.isArray(ph.labs)) ph.labs.forEach(function (l) {
      if (l && typeof l._slotRef === "string" && _filled(l.why)) out.push({ slotRef: l._slotRef, kind: "lab why", label: (l.name || l.id), text: l.why });
    });
    if (ph.actions && typeof ph.actions === "object") {
      ["tools", "meds"].forEach(function (kind) {
        var coll = ph.actions[kind];
        if (coll && typeof coll === "object") Object.keys(coll).forEach(function (id) {
          var e = coll[id];
          if (e && typeof e === "object" && typeof e._slotRef === "string" && _filled(e.fb)) out.push({ slotRef: e._slotRef, kind: (kind === "tools" ? "tool" : "med") + " feedback", label: e.label || id, text: e.fb });
        });
      });
    }
  });
  return out;
}

// Pull correct + tied-correct action labels across every intervene phase + the
// curveball — these imply the diagnosis the verifier checks against.
function _correctActionLabels(scenario) {
  var labels = [];
  function fromPhase(ph) {
    if (!ph || !ph.actions) return;
    ["tools", "meds"].forEach(function (kind) {
      var coll = ph.actions[kind] || {};
      Object.keys(coll).forEach(function (id) {
        var e = coll[id];
        if (e && (e.priority === "tied-correct" || e.priority === "correct")) labels.push((e.priority === "tied-correct" ? "[must-have] " : "[supporting] ") + (e.label || id));
      });
    });
  }
  (scenario.phases || []).forEach(function (ph) { if (ph && ph.stageType === "intervene") fromPhase(ph); });
  if (scenario.curveball) fromPhase(scenario.curveball);
  return labels;
}

// Assemble the ground-truth block the verifier checks each item against.
export function buildGroundTruth(scenario, unitKey) {
  var pc = scenario.patient || scenario.patientCard || {};
  var lines = [];
  lines.push("PATIENT: " + _safe(pc.name) + ", " + _safe(pc.ageLabel) + (pc.weightKg ? (", " + pc.weightKg + " kg") : "") + (pc.sex ? (", " + pc.sex) : "") + (pc.cc ? (" — " + pc.cc) : ""));
  if (unitKey === "curveball" && scenario.curveball) {
    var cb = scenario.curveball;
    lines.push("");
    lines.push("CURVEBALL EVENT: " + _safe(cb.name));
    lines.push(_safe(cb.narrative));
    var r2 = (scenario.phases || []).filter(function (p) { return p && p.round === 2; });
    if (r2.length) { lines.push(""); lines.push("PRECEDING ROUND-2 STATE (the patient just before this event):"); r2.forEach(function (p) { if (p && p.narrative) lines.push(_safe(p.narrative)); }); }
    if (Array.isArray(cb.teaches) && cb.teaches.length) {
      lines.push(""); lines.push("INTENDED TEACHING (curveball):");
      cb.teaches.forEach(function (t) { if (t) lines.push("- " + _safe(t.title) + (t.tldr ? (": " + _safe(t.tldr)) : "")); });
    }
  } else {
    _unitPhases(scenario, unitKey).forEach(function (p) {
      if (p && p.narrative) { lines.push(""); lines.push((p.title || ("PHASE " + (typeof p.phaseIndex === "number" ? p.phaseIndex : ""))) + " NARRATIVE:"); lines.push(_safe(p.narrative)); }
    });
  }
  if (scenario.debrief) {
    var d = scenario.debrief;
    if (d.summary) { lines.push(""); lines.push("CASE SUMMARY: " + _safe(d.summary)); }
    if (Array.isArray(d.keyTeaching) && d.keyTeaching.length) { lines.push("KEY TEACHING:"); d.keyTeaching.forEach(function (k) { lines.push("- " + _safe(k)); }); }
  }
  var correct = _correctActionLabels(scenario);
  if (correct.length) { lines.push(""); lines.push("CORRECT INTERVENTIONS FOR THIS CASE (these imply the diagnosis):"); correct.forEach(function (c) { lines.push("- " + c); }); }
  return lines.join("\n");
}

// Run the verify pass for one unit and apply the verdicts in place. Returns a
// small summary for logging. Best-effort: any failure inside verifyExplanations
// returns no verdicts, so nothing changes.
export async function verifyUnit(scenario, unitKey, signal, persistCallback, refreshCallback) {
  if (!scenario || scenario.source !== "ai") return { checked: 0, repaired: 0, dropped: 0 };
  var items = collectUnitFilledItems(scenario, unitKey);
  if (items.length === 0) return { checked: 0, repaired: 0, dropped: 0 };
  var gt = buildGroundTruth(scenario, unitKey);
  var results = await verifyExplanations(scenario, gt, items, signal);
  var repaired = 0, dropped = 0;
  Object.keys(results).forEach(function (ref) {
    var v = results[ref];
    if (!v) return;
    var parsed = parseSlotRefString(ref);
    if (!parsed) return;
    if (v.verdict === "repair" && v.correctedText) { if (writeExplanationToSlot(scenario, parsed, v.correctedText)) repaired++; }
    else if (v.verdict === "drop") { if (writeExplanationToSlot(scenario, parsed, "")) dropped++; }
  });
  if (repaired > 0 || dropped > 0) {
    if (typeof persistCallback === "function") { try { persistCallback(scenario); } catch (e) {} }
    if (typeof refreshCallback === "function") { try { refreshCallback(); } catch (e) {} }
  }
  console.info("[verify] " + unitKey + ": checked " + items.length + ", repaired " + repaired + ", dropped " + dropped);
  return { checked: items.length, repaired: repaired, dropped: dropped };
}
