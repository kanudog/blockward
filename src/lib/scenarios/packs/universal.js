// Phase-4b pack: universal — always available regardless of pack selection.
// Contains foundational tools and meds that apply across most scenarios.

export const TOOLS = [
  { id: "glucometer",    label: "Check Glucose",                       pack: "universal" },
  { id: "stethoscope",   label: "Auscultate",                          pack: "universal" },
  { id: "bvm",           label: "Begin Bag-Mask Ventilation",          pack: "universal" },
  { id: "bvmReady",      label: "Bring Bag-Mask to Bedside",           pack: "universal" },
  { id: "suction",       label: "Suction Airway",                      pack: "universal" },
  { id: "o2Mask",        label: "Apply O2 15L NRB",                    pack: "universal" },
  { id: "ivKit",         label: "Establish or Confirm IV/IO Placement",pack: "universal" },
  { id: "defib",         label: "Apply Defib Pads",                    pack: "universal" },
  { id: "thermometer",   label: "Recheck Temp",                        pack: "universal" },
  { id: "pulseOx",       label: "Place Pulse Oximeter",                pack: "universal" },
  { id: "bpCuff",        label: "Place BP Cuff",                       pack: "universal" },
  { id: "vsMonitor",     label: "Connect to Vital Signs Monitor",      pack: "universal" },
  { id: "pupilCheck",    label: "Check Pupils",                        pack: "universal" },
  { id: "capRefill",     label: "Recheck Capillary Refill",            pack: "universal" }
];

export const MEDS = [
  { id: "acetaminophen", label: "Give Acetaminophen PO/PR",            pack: "universal" },
  { id: "ibuprofen",     label: "Give Ibuprofen PO",                   pack: "universal" },
  { id: "ondansetron",   label: "Give Ondansetron IV/PO",              pack: "universal" },
  { id: "dextroseBolus", label: "Push D10W IV",                        pack: "universal" },
  { id: "nsBolus",       label: "Bolus NS 20 mL/kg IV",                pack: "universal" }
];
