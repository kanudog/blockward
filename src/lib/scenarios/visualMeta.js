// Phase-4b: visual metadata for the pack registry. Extracted from the
// pre-Phase-4b TOOLS / MEDS objects in builtIn.js so the registry itself
// can stay display-pure (id + label + pack only).
//
// TOOLS: there is no indirection. ActionPanel passes the raw tool id straight
// to <ToolIcon name={id}>, which switches on the id itself. A TOOL_VISUAL_META
// map with an `iconName` field used to sit here; the audit of 2026-08-05 found
// that nothing ever called it, so it and its toolIconName() lookup have been
// removed rather than left to rot into a second source of truth. To give a new
// tool an icon, add a `case "<id>"` to ToolIcon.
//
// MEDS still need this table: MedIcon switches on the ROUTE (iv/neb/oral/push/
// protocol), not the med id, and the tile background uses the colour.

export const MED_VISUAL_META = {
  // universal pack
  acetaminophen:        { color: "#ffeaa7", medType: "oral" },
  ibuprofen:            { color: "#ffeaa7", medType: "oral" },
  ondansetron:          { color: "#a29bfe", medType: "iv"   },
  dextroseBolus:        { color: "#fdcb6e", medType: "push" },
  nsBolus:              { color: "#74b9ff", medType: "iv"   },
  // respiratoryAirway
  albuterol:            { color: "#55efc4", medType: "neb"  },
  racemicEpi:           { color: "#fab1a0", medType: "neb"  },
  ipratropium:          { color: "#55efc4", medType: "neb"  },
  magnesiumSulfate:     { color: "#74b9ff", medType: "iv"   },
  methylprednisolone:   { color: "#a29bfe", medType: "iv"   },
  dexamethasone:        { color: "#a29bfe", medType: "iv"   },
  epiIM:                { color: "#d63031", medType: "push" },
  diphenhydramine:      { color: "#fd79a8", medType: "iv"   },
  famotidine:           { color: "#fd79a8", medType: "iv"   },
  // cardiac
  epiIV:                { color: "#d63031", medType: "push" },
  amiodarone:           { color: "#d63031", medType: "iv"   },
  adenosine:            { color: "#ff7675", medType: "push" },
  atropine:             { color: "#fab1a0", medType: "push" },
  lidocaine:            { color: "#d63031", medType: "iv"   },
  calciumGluconate:     { color: "#dfe6e9", medType: "iv"   },
  sodiumBicarb:         { color: "#dfe6e9", medType: "iv"   },
  calciumChloride:      { color: "#dfe6e9", medType: "push" },
  // cardiac — added 2026-07-29 after play-testing found no diuretic and no
  // named inotrope in the registry (heart-failure cases had to fall back to
  // a generic `customMed`, which also lost its distinct icon).
  furosemide:           { color: "#f6e58d", medType: "push" },
  milrinone:            { color: "#74b9ff", medType: "iv"   },
  dobutamine:           { color: "#0984e3", medType: "iv"   },
  norepinephrine:       { color: "#b71540", medType: "iv"   },
  // neurological
  lorazepam:            { color: "#6c5ce7", medType: "push" },
  midazolamIM:          { color: "#6c5ce7", medType: "push" },
  midazolamIN:          { color: "#6c5ce7", medType: "push" },
  levetiracetam:        { color: "#a29bfe", medType: "iv"   },
  fosphenytoin:         { color: "#e17055", medType: "iv"   },
  mannitol:             { color: "#0984e3", medType: "iv"   },
  // trauma — blood products + antifibrinolytic
  prbc:                 { color: "#d63031", medType: "iv"   },
  ffp:                  { color: "#fdcb6e", medType: "iv"   },
  platelets:            { color: "#fab1a0", medType: "iv"   },
  tranexamicAcid:       { color: "#e17055", medType: "iv"   },
  cryoprecipitate:      { color: "#fdcb6e", medType: "iv"   },
  // sedationRsiPain
  ketamine:             { color: "#a55eea", medType: "push" },
  etomidate:            { color: "#a55eea", medType: "push" },
  propofol:             { color: "#dfe6e9", medType: "push" },
  rocuronium:           { color: "#6c5ce7", medType: "push" },
  succinylcholine:      { color: "#6c5ce7", medType: "push" },
  fentanyl:             { color: "#a55eea", medType: "push" },
  morphine:             { color: "#a55eea", medType: "push" },
  // endocrineMetabolic
  regularInsulin:       { color: "#74b9ff", medType: "iv"   },
  hypertonicSaline:     { color: "#0984e3", medType: "iv"   },
  glucagon:             { color: "#fdcb6e", medType: "push" },
  hydrocortisone:       { color: "#a29bfe", medType: "iv"   },
  potassiumReplacement: { color: "#ffeaa7", medType: "iv"   },
  // infectiousDisease
  ceftriaxone:          { color: "#00b894", medType: "iv"   },
  vancomycin:           { color: "#00b894", medType: "iv"   },
  ampicillin:           { color: "#00b894", medType: "iv"   },
  gentamicin:           { color: "#00b894", medType: "iv"   },
  acyclovir:            { color: "#00b894", medType: "iv"   },
  oseltamivir:          { color: "#55efc4", medType: "oral" },
  // Meta-action. mtpActivation is registered as a TOOL, but generators
  // regularly file it under meds (ActionPanel cross-looks-up ids that land in
  // the wrong list). When that happens this entry gives it the protocol
  // clipboard instead of a generic IV bag — previously the "protocol" MedIcon
  // case was unreachable art because no med produced that route.
  mtpActivation:        { color: "#b2bec3", medType: "protocol" },
  // toxicologyAntidotes
  naloxone:             { color: "#fdcb6e", medType: "push" },
  flumazenil:           { color: "#fdcb6e", medType: "push" },
  nAcetylcysteine:      { color: "#fdcb6e", medType: "iv"   },
  activatedCharcoal:    { color: "#2d3436", medType: "oral" },
  sodiumThiosulfate:    { color: "#fdcb6e", medType: "iv"   }
};

// Lookup helpers — the renderer doesn't need to know about lookup misses.
// For meds, fall back to a neutral color and the MedIcon "default" type.
export function medColor(id) {
  return (MED_VISUAL_META[id] && MED_VISUAL_META[id].color) || "#636e72";
}
export function medType(id) {
  return (MED_VISUAL_META[id] && MED_VISUAL_META[id].medType) || "iv";
}
