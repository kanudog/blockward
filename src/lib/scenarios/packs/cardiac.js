// Phase-4b pack: cardiac — monitoring, vascular access, antiarrhythmics,
// vasoactives. Pulls in for shock, dysrhythmia, cardiac arrest scenarios.

export const TOOLS = [
  { id: "ecg12Lead",          label: "Obtain 12-Lead ECG",             pack: "cardiac" },
  { id: "cardiacMonitor",     label: "Apply Cardiac Monitor",          pack: "cardiac" },
  { id: "transcutaneousPace", label: "Apply Transcutaneous Pacing",    pack: "cardiac" },
  { id: "aLine",              label: "Place Arterial Line",            pack: "cardiac" },
  { id: "centralLine",        label: "Place Central Line",             pack: "cardiac" },
  { id: "usVascular",         label: "Use US for Vascular Access",     pack: "cardiac" },
  { id: "valsalva",           label: "Vagal / Valsalva Maneuver",      pack: "cardiac" }
];

export const MEDS = [
  { id: "epiIV",            label: "Give Epinephrine IV/IO",           pack: "cardiac" },
  { id: "amiodarone",       label: "Give Amiodarone IV",               pack: "cardiac" },
  { id: "adenosine",        label: "Push Adenosine IV",                pack: "cardiac" },
  { id: "atropine",         label: "Give Atropine IV",                 pack: "cardiac" },
  { id: "lidocaine",        label: "Give Lidocaine IV",                pack: "cardiac" },
  { id: "calciumGluconate", label: "Give Calcium Gluconate IV",        pack: "cardiac" },
  { id: "sodiumBicarb",     label: "Give Sodium Bicarbonate IV",       pack: "cardiac" },
  { id: "calciumChloride",  label: "Give Calcium Chloride IV",         pack: "cardiac" }
];
