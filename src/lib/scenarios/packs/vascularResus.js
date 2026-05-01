// Phase-4b pack: vascularResus — vascular access escalation, massive
// transfusion activation, rapid infusion. No meds in this pack — pulls
// from universal + trauma + cardiac for actual fluids / blood products.

export const TOOLS = [
  { id: "ioAccess",      label: "Place IO Access",                     pack: "vascularResus" },
  { id: "mtpActivation", label: "Activate Massive Transfusion Protocol",pack:"vascularResus" },
  { id: "bloodWarmer",   label: "Set Up Blood Warmer",                 pack: "vascularResus" },
  { id: "rapidInfuser",  label: "Set Up Rapid Infuser",                pack: "vascularResus" },
  { id: "pelvicExam",    label: "Perform Pelvic Exam",                 pack: "vascularResus" },
  { id: "usGuidedPIV",   label: "Place Ultrasound-Guided PIV",         pack: "vascularResus" }
];

export const MEDS = [];
