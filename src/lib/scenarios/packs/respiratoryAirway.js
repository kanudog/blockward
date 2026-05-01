// Phase-4b pack: respiratoryAirway — airway management, ventilation,
// bronchodilators, anti-inflammatories used across reactive airway,
// upper airway obstruction, and respiratory failure scenarios.

export const TOOLS = [
  { id: "hfnc",           label: "Start High-Flow Nasal Cannula",      pack: "respiratoryAirway" },
  { id: "nebSetup",       label: "Set Up Nebulizer",                   pack: "respiratoryAirway" },
  { id: "cpap",           label: "Apply CPAP",                         pack: "respiratoryAirway" },
  { id: "bipap",          label: "Apply BiPAP",                        pack: "respiratoryAirway" },
  { id: "intubationKit",  label: "Prepare Intubation Kit",             pack: "respiratoryAirway" },
  { id: "etco2",          label: "Apply End-Tidal CO2 Monitor",        pack: "respiratoryAirway" },
  { id: "npa",            label: "Place NPA",                          pack: "respiratoryAirway" },
  { id: "opa",            label: "Place OPA",                          pack: "respiratoryAirway" },
  { id: "lma",            label: "Insert LMA",                         pack: "respiratoryAirway" },
  { id: "needleDecomp",   label: "Needle Decompress",                  pack: "respiratoryAirway" },
  { id: "peakFlow",       label: "Peak Flow Test",                     pack: "respiratoryAirway" }
];

export const MEDS = [
  { id: "albuterol",          label: "Neb Albuterol",                  pack: "respiratoryAirway" },
  { id: "racemicEpi",         label: "Neb Racemic Epinephrine",        pack: "respiratoryAirway" },
  { id: "ipratropium",        label: "Neb Ipratropium",                pack: "respiratoryAirway" },
  { id: "magnesiumSulfate",   label: "Give Magnesium Sulfate IV",      pack: "respiratoryAirway" },
  { id: "methylprednisolone", label: "Give Methylprednisolone IV",     pack: "respiratoryAirway" },
  { id: "dexamethasone",      label: "Give Dexamethasone IV/PO",       pack: "respiratoryAirway" },
  { id: "epiIM",              label: "Give IM Epinephrine",            pack: "respiratoryAirway" },
  { id: "diphenhydramine",    label: "Give Diphenhydramine IV",        pack: "respiratoryAirway" },
  { id: "famotidine",         label: "Give Famotidine IV",             pack: "respiratoryAirway" }
];
