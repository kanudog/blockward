// Phase-4b pack: trauma — hemorrhage control, splinting / immobilization,
// blood products, antifibrinolytics. Pairs commonly with vascularResus
// and sedationRsiPain in penetrating / blunt trauma scenarios.

export const TOOLS = [
  { id: "tourniquet",       label: "Apply Tourniquet",                 pack: "trauma" },
  { id: "pelvicBinder",     label: "Apply Pelvic Binder",              pack: "trauma" },
  { id: "pressureDressing", label: "Apply Pressure Dressing",          pack: "trauma" },
  { id: "woundPacking",     label: "Pack Wound",                       pack: "trauma" },
  { id: "extremityElevation", label: "Elevate Extremity",              pack: "trauma" },
  { id: "chestTube",        label: "Place Chest Tube",                 pack: "trauma" },
  { id: "fastExam",         label: "Perform FAST Exam",                pack: "trauma" },
  { id: "eFastExam",        label: "Perform E-FAST Exam",              pack: "trauma" },
  { id: "splint",           label: "Splint Extremity",                 pack: "trauma" },
  { id: "cCollar",          label: "Apply Cervical Collar",            pack: "trauma" }
];

export const MEDS = [
  { id: "prbc",           label: "Transfuse Warmed pRBCs",             pack: "trauma" },
  { id: "ffp",            label: "Transfuse FFP",                      pack: "trauma" },
  { id: "platelets",      label: "Transfuse Platelets",                pack: "trauma" },
  { id: "tranexamicAcid", label: "Give TXA IV",                        pack: "trauma" },
  { id: "cryoprecipitate",label: "Transfuse Cryoprecipitate",          pack: "trauma" }
];
