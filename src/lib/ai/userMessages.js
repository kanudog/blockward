// Phase-5.4.3b: user-message builders for the Haiku dispatcher.
//
// buildPerItemUserMessage(scenario, slotRef) produces the per-call
// user message for wave 1-4 Haiku calls (vital/sign/lab why fields
// and tool/med fb fields).
//
// buildDeepDiveUserMessage(scenario, slotRef) produces the per-call
// user message for wave 5 Haiku calls (debrief.physiologyDeepDive
// content fields).
//
// Both consume a scenario object in schema 5.4.1 shape and a slotRef
// string ("phase[0].vitals.hr.why" / "debrief.physiologyDeepDive.<id>.content").
// parseSlotRefString from slotResolve.js does the string→object
// conversion. Pure functions, no side effects.
//
// Per-call user message shapes match the locked design docs at
// docs/phase-5-lazy-generation/06-haiku-per-item-prompt-design.md
// (Section 5 + the planned-shape reference at the bottom of the doc)
// and 07-haiku-deep-dive-prompt-design.md (Section 4 + the
// planned-shape reference at the bottom).

import { parseSlotRefString } from "../scenarios/slotResolve.js";

var FALLBACK = "(unspecified)";

function _safe(s) {
  if (s == null || s === "") return FALLBACK;
  return String(s);
}

function _flagFor(kind, bad) {
  if (kind === "sign") return bad ? "[abnormal]" : "[reassuring]";
  return bad ? "[abnormal]" : "[normal-for-age]";
}

function _vitalEntryLines(phase) {
  if (!phase || !phase.vitals) return [];
  var out = [];
  // Phase 6.1: vitals is an array of rich items under schema 5.4.1.
  // The object branch stays as defensive fallback for not-yet-migrated
  // input.
  function _emit(v, fallbackKey) {
    if (!v) return;
    if (typeof v === "object") {
      var val = v.value == null ? "" : String(v.value);
      var unit = v.unit ? " " + v.unit : "";
      var label = (v.label || v.id || fallbackKey) + (val ? " " + val : "") + unit;
      out.push("- " + label + " " + _flagFor("vital", !!v.bad));
    } else {
      out.push("- " + fallbackKey + " " + String(v));
    }
  }
  if (Array.isArray(phase.vitals)) {
    for (var i = 0; i < phase.vitals.length; i++) {
      var va = phase.vitals[i];
      _emit(va, va && va.id ? va.id : String(i));
    }
  } else if (typeof phase.vitals === "object") {
    Object.keys(phase.vitals).forEach(function (vk) {
      _emit(phase.vitals[vk], vk);
    });
  }
  return out;
}

function _signEntryLines(phase) {
  if (!phase || !Array.isArray(phase.signs)) return [];
  return phase.signs.map(function (s) {
    if (!s) return "";
    var label = s.label || s.id || FALLBACK;
    return "- " + label + " " + _flagFor("sign", !!s.bad);
  }).filter(function (line) { return line !== ""; });
}

function _labEntryLines(phase) {
  if (!phase || !Array.isArray(phase.labs)) return [];
  return phase.labs.map(function (l) {
    if (!l) return "";
    var name = l.name || l.id || FALLBACK;
    var val = l.value == null ? "" : String(l.value);
    var unit = l.unit ? " " + l.unit : "";
    var label = name + (val ? " " + val : "") + unit;
    return "- " + label + " " + _flagFor("lab", !!l.bad);
  }).filter(function (line) { return line !== ""; });
}

function _clinicalPictureBlock(phase) {
  var lines = ["CLINICAL PICTURE"];
  var v = _vitalEntryLines(phase);
  lines.push("Vitals:");
  if (v.length === 0) lines.push("- " + FALLBACK);
  else v.forEach(function (line) { lines.push(line); });
  var s = _signEntryLines(phase);
  lines.push("Signs:");
  if (s.length === 0) lines.push("- " + FALLBACK);
  else s.forEach(function (line) { lines.push(line); });
  var l = _labEntryLines(phase);
  lines.push("Labs:");
  if (l.length === 0) lines.push("- " + FALLBACK);
  else l.forEach(function (line) { lines.push(line); });
  return lines.join("\n");
}

function _patientBlock(scenario) {
  var pc = scenario && scenario.patientCard ? scenario.patientCard : null;
  // Schema 5.4.1 uses patientCard. Legacy AI scenarios use scenario.patient.
  var legacy = scenario && scenario.patient ? scenario.patient : null;
  var name = (pc && pc.name) || (legacy && legacy.name) || FALLBACK;
  var age = (pc && pc.age) || (legacy && legacy.ageLabel) || FALLBACK;
  var weight = (pc && pc.weight) || (legacy && legacy.weightKg != null ? legacy.weightKg + " kg" : null) || FALLBACK;
  var sex = (pc && pc.sex) || (legacy && legacy.sex) || FALLBACK;
  return "PATIENT\nName: " + name + "\nAge: " + age + "\nWeight: " + weight + "\nSex: " + sex;
}

function _findVitalItem(phase, id) {
  if (!phase || !phase.vitals) return null;
  // Phase 6.1: array shape under schema 5.4.1; object fallback.
  if (Array.isArray(phase.vitals)) {
    for (var i = 0; i < phase.vitals.length; i++) {
      if (phase.vitals[i] && phase.vitals[i].id === id) return phase.vitals[i];
    }
    return null;
  }
  return phase.vitals[id] || null;
}

function _findSignItem(phase, id) {
  if (!phase || !Array.isArray(phase.signs)) return null;
  for (var i = 0; i < phase.signs.length; i++) {
    var s = phase.signs[i];
    if (!s) continue;
    if (s.id === id || s.label === id) return s;
  }
  return null;
}

function _findLabItem(phase, id) {
  if (!phase || !Array.isArray(phase.labs)) return null;
  for (var i = 0; i < phase.labs.length; i++) {
    var l = phase.labs[i];
    if (!l) continue;
    if (l.id === id || l.name === id) return l;
  }
  return null;
}

function _findActionItem(phase, sub, id) {
  if (!phase || !phase.actions || !phase.actions[sub]) return null;
  return phase.actions[sub][id] || null;
}

// Map an action entry's flags/priority into a single priority label
// matching the schema 5.4.1 vocabulary
// (correct | tied-correct | distractor-clinical | distractor-pack | distractor-misc).
// Schema 5.4.1 action items carry .priority directly. Legacy AI scenarios
// carry .ok + .pri instead; map those approximately so the prompt receives
// something useful.
function _priorityLabelFor(actionEntry) {
  if (!actionEntry) return FALLBACK;
  if (actionEntry.priority) return String(actionEntry.priority);
  if (actionEntry.ok === true) return actionEntry.pri ? "correct" : "tied-correct";
  if (actionEntry.ok === false) return "distractor-clinical";
  return FALLBACK;
}

// buildPerItemUserMessage(scenario, slotRef) — produces the message
// body for one wave-1..4 Haiku call. slotRef accepts either a string
// (schema 5.4.1 path form) or a parsed object as a convenience for
// callers that already hold the parsed form.
export function buildPerItemUserMessage(scenario, slotRef) {
  var parsed = typeof slotRef === "string" ? parseSlotRefString(slotRef) : slotRef;
  if (!parsed) return "(invalid slotRef)";
  if (!scenario || !Array.isArray(scenario.phases)) return "(invalid scenario)";
  var phaseIdx = parsed.phaseIdx;
  var phase = scenario.phases[phaseIdx];
  if (!phase) return "(phase " + phaseIdx + " not found)";

  var parts = [];
  parts.push(_patientBlock(scenario));

  // Phase narrative (assess-phase narrative prepended for intervene-phase items).
  if (phaseIdx > 0 && scenario.phases[0]) {
    parts.push("ASSESS-PHASE NARRATIVE\n" + _safe(scenario.phases[0].narrative));
  }
  parts.push("PHASE NARRATIVE\n" + _safe(phase.narrative));

  // Clinical picture for the item's own phase.
  parts.push(_clinicalPictureBlock(phase));

  // Item-to-explain block.
  var itemLines = ["ITEM TO EXPLAIN"];
  itemLines.push("id: " + parsed.kind + ":" + parsed.indexOrId);
  itemLines.push("type: " + parsed.kind);
  if (parsed.kind === "vital") {
    var v = _findVitalItem(phase, parsed.indexOrId);
    if (v && typeof v === "object") {
      itemLines.push("label: " + _safe(v.label));
      itemLines.push("value: " + _safe(v.value));
      itemLines.push("unit: " + _safe(v.unit));
      itemLines.push("bad: " + (v.bad ? "true" : "false"));
    } else {
      itemLines.push("label: " + parsed.indexOrId);
      itemLines.push("value: " + _safe(v));
    }
  } else if (parsed.kind === "sign") {
    var s = _findSignItem(phase, parsed.indexOrId);
    if (s) {
      itemLines.push("label: " + _safe(s.label));
      if (s.finding) itemLines.push("finding: " + s.finding);
      itemLines.push("bad: " + (s.bad ? "true" : "false"));
    } else {
      itemLines.push("label: " + parsed.indexOrId);
    }
  } else if (parsed.kind === "lab") {
    var l = _findLabItem(phase, parsed.indexOrId);
    if (l) {
      itemLines.push("label: " + _safe(l.name));
      itemLines.push("value: " + _safe(l.value));
      itemLines.push("unit: " + _safe(l.unit));
      if (l.ref) itemLines.push("ref: " + l.ref);
      itemLines.push("bad: " + (l.bad ? "true" : "false"));
    } else {
      itemLines.push("label: " + parsed.indexOrId);
    }
  } else if (parsed.kind === "tool" || parsed.kind === "med") {
    var sub = parsed.kind === "tool" ? "tools" : "meds";
    var a = _findActionItem(phase, sub, parsed.indexOrId);
    if (a) {
      itemLines.push("label: " + _safe(a.label || parsed.indexOrId));
      itemLines.push("priority: " + _priorityLabelFor(a));
    } else {
      itemLines.push("label: " + parsed.indexOrId);
      itemLines.push("priority: " + FALLBACK);
    }
  }
  parts.push(itemLines.join("\n"));

  var itemId = parsed.kind + ":" + parsed.indexOrId;
  parts.push("Emit one ###ITEM:" + itemId + " ... ###END block per the format spec.");

  return parts.join("\n\n");
}

// Pull the list of correct/tied-correct action labels from a phase
// for the deep-dive call's CORRECT INTERVENTIONS block.
function _correctActionLabelsFor(phase) {
  if (!phase || !phase.actions) return [];
  var out = [];
  function pushFrom(sub) {
    var entries = phase.actions && phase.actions[sub];
    if (!entries) return;
    Object.keys(entries).forEach(function (id) {
      var entry = entries[id];
      if (!entry) return;
      var prio = _priorityLabelFor(entry);
      var ok = entry.priority
        ? (prio === "correct" || prio === "tied-correct")
        : entry.ok === true;
      if (!ok) return;
      out.push(entry.label || id);
    });
  }
  pushFrom("tools");
  pushFrom("meds");
  return out;
}

// buildDeepDiveUserMessage(scenario, slotRef) — produces the message
// body for one wave-5 Haiku call. slotRef accepts either a string
// ("debrief.physiologyDeepDive.<id>.content") or the parsed object.
export function buildDeepDiveUserMessage(scenario, slotRef) {
  var parsed = typeof slotRef === "string" ? parseSlotRefString(slotRef) : slotRef;
  if (!parsed || parsed.kind !== "deepDive") return "(invalid deep-dive slotRef)";
  if (!scenario) return "(invalid scenario)";

  var parts = [];
  parts.push(_patientBlock(scenario));

  // Scenario framing.
  var scenarioBlock = ["SCENARIO"];
  scenarioBlock.push("Title: " + _safe(scenario.title));
  scenarioBlock.push("Subtitle: " + _safe(scenario.subtitle));
  parts.push(scenarioBlock.join("\n"));

  var phases = Array.isArray(scenario.phases) ? scenario.phases : [];
  var phase1 = phases[0] || null;
  var phase2 = phases[1] || null;

  // Phase 1 narrative + clinical picture.
  parts.push("PHASE 1 NARRATIVE\n" + _safe(phase1 && phase1.narrative));
  parts.push("PHASE 1 " + _clinicalPictureBlock(phase1));

  // Phase 2 narrative + clinical picture.
  parts.push("PHASE 2 NARRATIVE\n" + _safe(phase2 && phase2.narrative));
  parts.push("PHASE 2 " + _clinicalPictureBlock(phase2));

  // Correct interventions across both phases.
  var p1 = _correctActionLabelsFor(phase1);
  var p2 = _correctActionLabelsFor(phase2);
  var interventionsBlock = ["CORRECT INTERVENTIONS"];
  interventionsBlock.push("Phase 1: " + (p1.length > 0 ? p1.join(", ") : FALLBACK));
  interventionsBlock.push("Phase 2: " + (p2.length > 0 ? p2.join(", ") : FALLBACK));
  parts.push(interventionsBlock.join("\n"));

  // Deep-dive topic. Pull the title from the scenario's debrief slot
  // when available — Sonnet authored it alongside the id.
  var topicTitle = FALLBACK;
  if (scenario.debrief && Array.isArray(scenario.debrief.physiologyDeepDive)) {
    for (var i = 0; i < scenario.debrief.physiologyDeepDive.length; i++) {
      var entry = scenario.debrief.physiologyDeepDive[i];
      if (entry && entry.id === parsed.indexOrId) {
        topicTitle = _safe(entry.title);
        break;
      }
    }
  }
  var topicLines = ["DEEP-DIVE TOPIC"];
  topicLines.push("id: " + parsed.indexOrId);
  topicLines.push("title: " + topicTitle);
  parts.push(topicLines.join("\n"));

  parts.push("Emit one ###ITEM:" + parsed.indexOrId + " ... ###END block per the format spec.");

  return parts.join("\n\n");
}
