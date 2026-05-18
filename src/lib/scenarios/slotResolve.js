// Phase-5.2.5: helpers that map between slot references stored in
// playerStore.markedForReview and the live scenario object's why/fb
// fields. Slot references survive lazy-fetch population — looking up
// the text at render time always reflects the latest scenario state.
//
// Phase-5.4.3a: under schema 5.4.1 every collection is typed and
// id-keyed (phase.vitals object, phase.signs[] / phase.labs[] arrays
// with .id). The assessItems demux is deleted; each slot resolves to
// exactly one storage location.
//
// SLOT REF SHAPE
// {
//   kind:       "vital" | "lab" | "sign" | "tool" | "med" | "deepDive",
//   phaseIdx:   number | null    // null for debrief-scoped (deepDive)
//   indexOrId:  string            // the id within its collection
//   field?:     "why" | "fb" | "content"   // when parsed from a 5.4.1 path string
// }
//
// MARKED ITEM SHAPE (what's stored in playerStore.markedForReview)
// {
//   id:        canonical id, e.g. "lab:wbc", "tool:ivKit"
//   kind:      mirror of _slotRef.kind for fast filtering
//   phaseIdx:  mirror of _slotRef.phaseIdx for display
//   label:     display label captured at mark time (frozen)
//   _slotRef:  the slot reference for resolveSlotText
// }

// Synthesized fallback string written to actions.<id>.fb when the AI
// generated a tool/med ID but omitted the actions entry. Exported so
// collectMissingExplanationSlots can detect it as "still unfetched".
// Must stay in lockstep with the string in ActionPanel.jsx pick().
export var SYNTHESIZED_FB_FALLBACK = "This action's feedback was not generated for this scenario. Selection still counts.";

// Phase-5.4.3a: schema 5.4.1 represents slot references as path strings
// like "phase[0].vitals.hr.why". Parse such a string into the object
// form the existing resolve/write functions consume. Returns null on
// malformed input (no throw — callers decide how to handle absence).
export function parseSlotRefString(str) {
  if (!str || typeof str !== "string") return null;
  var phaseMatch = str.match(/^phase\[(\d+)\]\.([a-zA-Z]+)(?:\.([a-zA-Z]+))?\.([^.]+)\.([a-zA-Z]+)$/);
  if (phaseMatch) {
    var phaseIdx = Number(phaseMatch[1]);
    var coll = phaseMatch[2];
    var subColl = phaseMatch[3];
    var id = phaseMatch[4];
    var field = phaseMatch[5];
    if (coll === "vitals" && !subColl) return { kind: "vital", phaseIdx: phaseIdx, indexOrId: id, field: field };
    if (coll === "signs" && !subColl) return { kind: "sign", phaseIdx: phaseIdx, indexOrId: id, field: field };
    if (coll === "labs" && !subColl) return { kind: "lab", phaseIdx: phaseIdx, indexOrId: id, field: field };
    if (coll === "actions" && subColl === "tools") return { kind: "tool", phaseIdx: phaseIdx, indexOrId: id, field: field };
    if (coll === "actions" && subColl === "meds") return { kind: "med", phaseIdx: phaseIdx, indexOrId: id, field: field };
    return null;
  }
  var debriefMatch = str.match(/^debrief\.physiologyDeepDive\.([^.]+)\.([a-zA-Z]+)$/);
  if (debriefMatch) {
    return { kind: "deepDive", phaseIdx: null, indexOrId: debriefMatch[1], field: debriefMatch[2] };
  }
  return null;
}

function _phaseFor(sc, slotRef) {
  if (!sc || !slotRef) return null;
  if (slotRef.phaseIdx === "curveball") return sc.curveball || null;
  return (sc.phases && sc.phases[slotRef.phaseIdx]) || null;
}

// Phase-5.4.3a: transitional lookup helpers. Built-in scenarios mid-
// migration may key signs[] by .label and labs[] by .name rather than
// the new .id. Match .id first and fall back so both shapes resolve.
function _findById(arr, id) {
  if (!Array.isArray(arr) || !id) return null;
  for (var i = 0; i < arr.length; i++) {
    var x = arr[i];
    if (!x) continue;
    if (x.id === id) return x;
    if (x.name === id) return x;
    if (x.label === id) return x;
  }
  return null;
}

// Resolve current why/fb text for a slot ref against a (possibly mutated)
// scenario. Returns null if the slot resolves to nothing — caller should
// fall back to a placeholder string at render time.
export function resolveSlotText(sc, slotRef) {
  if (slotRef && slotRef.kind === "deepDive") {
    var dd = (sc && sc.debrief && Array.isArray(sc.debrief.physiologyDeepDive))
      ? sc.debrief.physiologyDeepDive.find(function (d) { return d && d.id === slotRef.indexOrId; })
      : null;
    return (dd && dd.content) || null;
  }
  var phase = _phaseFor(sc, slotRef);
  if (!phase) return null;
  switch (slotRef.kind) {
    case "vital": {
      var v = phase.vitals && phase.vitals[slotRef.indexOrId];
      return (v && typeof v === "object" && v.why) || null;
    }
    case "lab": {
      var lab = _findById(phase.labs, slotRef.indexOrId);
      return (lab && lab.why) || null;
    }
    case "sign": {
      var sign = _findById(phase.signs, slotRef.indexOrId);
      return (sign && sign.why) || null;
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
export function writeExplanationToSlot(sc, slotRef, text) {
  if (slotRef && slotRef.kind === "deepDive") {
    var dd = (sc && sc.debrief && Array.isArray(sc.debrief.physiologyDeepDive))
      ? sc.debrief.physiologyDeepDive.find(function (d) { return d && d.id === slotRef.indexOrId; })
      : null;
    if (dd) { dd.content = text; return true; }
    return false;
  }
  var phase = _phaseFor(sc, slotRef);
  if (!phase) return false;
  switch (slotRef.kind) {
    case "vital": {
      var v = phase.vitals && phase.vitals[slotRef.indexOrId];
      if (v && typeof v === "object") { v.why = text; return true; }
      return false;
    }
    case "lab": {
      var lab = _findById(phase.labs, slotRef.indexOrId);
      if (lab) { lab.why = text; return true; }
      return false;
    }
    case "sign": {
      var sign = _findById(phase.signs, slotRef.indexOrId);
      if (sign) { sign.why = text; return true; }
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
// buildMarkForReviewDeepDivePrompt and buildPerItemExplanationPrompt branch on type;
// they recognize "vital", "lab", "sign", "tool", "med", "intervention",
// "finding". Tool/med map to "intervention" (the pre-existing
// convention used by ActionPanel marks); sign maps to "finding"
// (the convention used by SignCard / BodySystemsView).
export function kindToPromptType(kind) {
  if (kind === "tool" || kind === "med") return "intervention";
  if (kind === "sign") return "finding";
  return kind;
}
