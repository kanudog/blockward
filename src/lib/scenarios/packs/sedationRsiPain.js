// Phase-4b pack: sedationRsiPain — induction agents, paralytics,
// analgesia. Tools-free pack — pulls intubationKit etc. from
// respiratoryAirway.

export const TOOLS = [];

export const MEDS = [
  { id: "ketamine",       label: "Give Ketamine IV",                   pack: "sedationRsiPain" },
  { id: "etomidate",      label: "Give Etomidate IV",                  pack: "sedationRsiPain" },
  { id: "propofol",       label: "Give Propofol IV",                   pack: "sedationRsiPain" },
  { id: "rocuronium",     label: "Give Rocuronium IV",                 pack: "sedationRsiPain" },
  { id: "succinylcholine",label: "Give Succinylcholine IV",            pack: "sedationRsiPain" },
  { id: "fentanyl",       label: "Give Fentanyl IV",                   pack: "sedationRsiPain" },
  { id: "morphine",       label: "Give Morphine IV",                   pack: "sedationRsiPain" }
];
