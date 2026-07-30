// Phase-4b pack: teamCommunication — escalation and consult requests.
// No meds.

export const TOOLS = [
  { id: "callRapidResponse", label: "Call Rapid Response",             pack: "teamCommunication" },
  { id: "callAnesthesia",    label: "Call Anesthesia",                 pack: "teamCommunication" },
  { id: "callSurgery",       label: "Call Surgery",                    pack: "teamCommunication" },
  { id: "callBloodBank",     label: "Call Blood Bank",                 pack: "teamCommunication" },
  { id: "callPoisonControl", label: "Call Poison Control",             pack: "teamCommunication" },
  // Play-test 2026-07-29: the generator reached for callNeurosurgery in a
  // herniating TBI case and it was silently dropped — in that case it was
  // the single most important action. Cardiology added for the same reason
  // (myocarditis / ECMO evaluation).
  { id: "callNeurosurgery",  label: "Activate Neurosurgery",           pack: "teamCommunication" },
  { id: "callCardiology",    label: "Activate Cardiology",             pack: "teamCommunication" },
  { id: "callPICU",          label: "Activate PICU Team",              pack: "teamCommunication" }
];

export const MEDS = [];
