// Phase-2.6.4 change 3: post-process AI-generated narrative text to
// replace raw TOOL/MED IDs with their display labels.
//
// The AI sometimes leaks raw IDs into stabilizationSummary and
// reassessment.narrative ("Following mtpActivate, the patient
// received...") despite prompt instructions to use natural names.
// Rather than rely solely on the prompt, we substitute at render time.
//
// Heuristic: only replace IDs that are clearly synthetic (contain an
// uppercase letter, i.e. camelCase). Pure-lowercase IDs like "txa",
// "ffp", "lorazepam" are real abbreviations or drug names that may
// appear naturally in narrative — replacing them would produce
// awkward output like "Give TXA IV was administered" mid-sentence.

import { TOOLS, MEDS } from "./builtIn.js";

export function replaceIdsWithLabels(text){
  if(!text||typeof text!=="string")return text;
  var out=text;
  var entries=[];
  Object.keys(TOOLS).forEach(function(k){entries.push({id:k,label:TOOLS[k].label});});
  Object.keys(MEDS).forEach(function(k){entries.push({id:k,label:MEDS[k].label});});
  // Sort by length desc so longer IDs match first (prevents "iv" from
  // matching part of "ivKit"). Also gates on camelCase to avoid
  // false replacements on real drug names.
  entries.sort(function(a,b){return b.id.length-a.id.length;});
  entries.forEach(function(e){
    if(!/[A-Z]/.test(e.id))return;
    var rx=new RegExp("\\b"+e.id+"\\b","g");
    out=out.replace(rx,e.label);
  });
  return out;
}
