// Phase-5.2.5: helpers that map between slot references stored in
// playerStore.markedForReview and the live scenario object's why/fb
// fields. Slot references survive lazy-fetch population — looking up
// the text at render time always reflects the latest scenario state.
//
// SLOT REF SHAPE
// {
//   kind:       "vital" | "lab" | "sign" | "assessItem" | "tool" | "med",
//   phaseIdx:   number | "curveball",
//   indexOrId:  string  // vital: vital key (hr/spo2/...); lab: lab.name;
//                       // sign: sign.label; assessItem: assessItem.id;
//                       // tool/med: actions[id] key
// }
//
// MARKED ITEM SHAPE (what's stored in playerStore.markedForReview)
// {
//   id:        canonical id, e.g. "lab:WBC", "tool:ivKit"
//   kind:      mirror of _slotRef.kind for fast filtering
//   phaseIdx:  mirror of _slotRef.phaseIdx for display
//   label:     display label captured at mark time (frozen)
//   _slotRef:  the slot reference for resolveSlotText
// }

import { vitalKeyForLabel } from "./canonicalize.js";

// Synthesized fallback string written to actions.<id>.fb when the AI
// generated a tool/med ID but omitted the actions entry. Exported so
// collectMissingExplanationSlots can detect it as "still unfetched".
// Must stay in lockstep with the string in ActionPanel.jsx pick().
export var SYNTHESIZED_FB_FALLBACK = "This action's feedback was not generated for this scenario. Selection still counts.";

function _phaseFor(sc, slotRef) {
  if (!sc || !slotRef) return null;
  if (slotRef.phaseIdx === "curveball") return sc.curveball || null;
  return (sc.phases && sc.phases[slotRef.phaseIdx]) || null;
}

// Looser than equality: lab assessItems carry labels like "Glucose 648 mg/dL"
// but the lab's `name` is just "Glucose". Substring on lowercase is the
// same heuristic canonicalizeAssessItem uses (canonicalize.js:46-48).
function _labLabelMentionsName(label, name) {
  if (!label || !name) return false;
  return label.toLowerCase().indexOf(name.toLowerCase()) >= 0;
}

// Resolve current why/fb text for a slot ref against a (possibly mutated)
// scenario. Returns null if the slot resolves to nothing — caller should
// fall back to a placeholder string at render time.
export function resolveSlotText(sc, slotRef) {
  var phase = _phaseFor(sc, slotRef);
  if (!phase) return null;
  switch (slotRef.kind) {
    case "vital": {
      var items = phase.assessItems || [];
      var ai = items.find(function (it) { return it && it.cat === "vital" && vitalKeyForLabel(it.label) === slotRef.indexOrId; });
      return (ai && ai.why) || null;
    }
    case "lab": {
      var aiL = (phase.assessItems || []).find(function (it) { return it && it.cat === "lab" && _labLabelMentionsName(it.label, slotRef.indexOrId); });
      if (aiL && aiL.why) return aiL.why;
      var lab = (phase.labs || []).find(function (l) { return l && l.name === slotRef.indexOrId; });
      return (lab && lab.why) || null;
    }
    case "sign": {
      var aiS = (phase.assessItems || []).find(function (it) { return it && it.cat === "clinical" && it.label === slotRef.indexOrId; });
      if (aiS && aiS.why) return aiS.why;
      var sign = (phase.signs || []).find(function (s) { return s && s.label === slotRef.indexOrId; });
      return (sign && sign.why) || null;
    }
    case "assessItem": {
      var ai2 = (phase.assessItems || []).find(function (it) { return it && it.id === slotRef.indexOrId; });
      return (ai2 && ai2.why) || null;
    }
    case "tool": {
      var tools = phase.actions && phase.actions.tools;
      var entryT = tools && tools[slotRef.indexOrId];
      return (entryT && entryT.fb) || null;
    }
    case "med": {
      var meds = phase.actions && phase.actions.meds;
      var entryM = meds && meds[slotRef.indexOrId];
      return (entryM && entryM.fb) || null;
    }
  }
  return null;
}

// Mutate sc in place to set why/fb at the slot. Returns true if a
// matching slot was found. Caller is responsible for persistence
// (addCustom write-through) and React re-render trigger.
//
// For lab and sign, both the matching assessItem.why AND the
// labs[]/signs[] entry's why are updated — the renderer's content
// priority is "match.why > lab.why > placeholder" (LabPanel.jsx:91)
// so writing both keeps every render path consistent.
export function writeExplanationToSlot(sc, slotRef, text) {
  var phase = _phaseFor(sc, slotRef);
  if (!phase) return false;
  switch (slotRef.kind) {
    case "vital": {
      var items = phase.assessItems || [];
      var ai = items.find(function (it) { return it && it.cat === "vital" && vitalKeyForLabel(it.label) === slotRef.indexOrId; });
      if (ai) { ai.why = text; return true; }
      return false;
    }
    case "lab": {
      var hit = false;
      var aiL = (phase.assessItems || []).find(function (it) { return it && it.cat === "lab" && _labLabelMentionsName(it.label, slotRef.indexOrId); });
      if (aiL) { aiL.why = text; hit = true; }
      var lab = (phase.labs || []).find(function (l) { return l && l.name === slotRef.indexOrId; });
      if (lab) { lab.why = text; hit = true; }
      return hit;
    }
    case "sign": {
      var hit2 = false;
      var aiS = (phase.assessItems || []).find(function (it) { return it && it.cat === "clinical" && it.label === slotRef.indexOrId; });
      if (aiS) { aiS.why = text; hit2 = true; }
      var sign = (phase.signs || []).find(function (s) { return s && s.label === slotRef.indexOrId; });
      if (sign) { sign.why = text; hit2 = true; }
      return hit2;
    }
    case "assessItem": {
      var ai2 = (phase.assessItems || []).find(function (it) { return it && it.id === slotRef.indexOrId; });
      if (ai2) { ai2.why = text; return true; }
      return false;
    }
    case "tool": {
      var tools = phase.actions && phase.actions.tools;
      var entryT = tools && tools[slotRef.indexOrId];
      if (entryT) { entryT.fb = text; return true; }
      return false;
    }
    case "med": {
      var meds = phase.actions && phase.actions.meds;
      var entryM = meds && meds[slotRef.indexOrId];
      if (entryM) { entryM.fb = text; return true; }
      return false;
    }
  }
  return false;
}

// Map slot kind to the "type" string the prompt builders understand.
// buildDeepDivePrompt and buildExplanationPrompt branch on type;
// they recognize "vital", "lab", "sign", "assessItem", "tool", "med",
// "intervention", "finding". Tool/med map to "intervention" (the
// pre-existing convention used by ActionPanel marks); sign maps to
// "finding" (the convention used by SignCard / BodySystemsView).
export function kindToPromptType(kind) {
  if (kind === "tool" || kind === "med") return "intervention";
  if (kind === "sign") return "finding";
  return kind;
}
