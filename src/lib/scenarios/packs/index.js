// Phase-4b pack registry. Imports every pack file, merges into ALL_TOOLS
// and ALL_MEDS lookup maps, and exports per-pack id arrays the AI prompt
// can reference. Throws at module-load time if any tool or med id is
// duplicated across packs (catastrophic — would break canonical lookup).

import * as universal           from "./universal.js";
import * as respiratoryAirway   from "./respiratoryAirway.js";
import * as cardiac             from "./cardiac.js";
import * as neurological        from "./neurological.js";
import * as trauma              from "./trauma.js";
import * as vascularResus       from "./vascularResus.js";
import * as giGu                from "./giGu.js";
import * as samplingLabs        from "./samplingLabs.js";
import * as imagingDiagnostics  from "./imagingDiagnostics.js";
import * as teamCommunication   from "./teamCommunication.js";
import * as sedationRsiPain     from "./sedationRsiPain.js";
import * as endocrineMetabolic  from "./endocrineMetabolic.js";
import * as infectiousDisease   from "./infectiousDisease.js";
import * as toxicologyAntidotes from "./toxicologyAntidotes.js";

const PACKS = {
  universal, respiratoryAirway, cardiac, neurological, trauma,
  vascularResus, giGu, samplingLabs, imagingDiagnostics, teamCommunication,
  sedationRsiPain, endocrineMetabolic, infectiousDisease, toxicologyAntidotes
};

export const ALL_TOOLS = {};
export const ALL_MEDS = {};
export const TOOL_PACKS = {};
export const MED_PACKS = {};

Object.keys(PACKS).forEach(function(name) {
  var p = PACKS[name];
  TOOL_PACKS[name] = (p.TOOLS || []).map(function(t) { return t.id; });
  MED_PACKS[name]  = (p.MEDS  || []).map(function(m) { return m.id; });
  (p.TOOLS || []).forEach(function(t) {
    if (ALL_TOOLS[t.id]) {
      throw new Error("Phase-4b pack collision: tool id '" + t.id + "' present in both '" + ALL_TOOLS[t.id].pack + "' and '" + name + "'");
    }
    ALL_TOOLS[t.id] = t;
  });
  (p.MEDS || []).forEach(function(m) {
    if (ALL_MEDS[m.id]) {
      throw new Error("Phase-4b pack collision: med id '" + m.id + "' present in both '" + ALL_MEDS[m.id].pack + "' and '" + name + "'");
    }
    ALL_MEDS[m.id] = m;
  });
});

// Detect AI-supplied custom entries — these bypass the registry.
// Schema: an action ID starting with "customTool" or "customMed". Multiple
// custom entries per scenario are distinguished by suffix (e.g.
// "customTool_cooling", "customTool_pelvic"). The renderer reads label
// and description from the action entry itself instead of ALL_TOOLS /
// ALL_MEDS.
export function isCustomTool(id) {
  return typeof id === "string" && id.indexOf("customTool") === 0;
}
export function isCustomMed(id) {
  return typeof id === "string" && id.indexOf("customMed") === 0;
}
