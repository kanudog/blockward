// Map a generated lab (by name / id) to the collection tube it's drawn in —
// colour + panel grouping — straight from the BD Vacutainer order-of-draw
// guide. LabPanel groups results under their tube so the layout mirrors a
// real draw (one specimen -> many results). Keyword match on the lab's
// name+id; anything unrecognised falls to the serum (gold) chemistry tube,
// which is where most undifferentiated chemistries belong anyway.
//
// Tube colours are real specimen-tube colours, not app theme colours, so
// they read the same against any background and are intentionally left out
// of the design-token system.

var TUBES = {
  lavender: { key: "lavender", name: "Lavender", additive: "EDTA", color: "#b9a7e0", panel: "Complete blood count" },
  lightblue:{ key: "lightblue", name: "Light blue", additive: "Citrate", color: "#74b3e6", panel: "Coagulation" },
  gold:     { key: "gold", name: "Gold (SST)", additive: "Serum", color: "#e0b84e", panel: "Chemistry" },
  gray:     { key: "gray", name: "Gray", additive: "Fluoride", color: "#aeb3bd", panel: "Glucose / lactate" },
  green:    { key: "green", name: "Green", additive: "Heparin", color: "#6fbf73", panel: "Plasma chemistry" },
  pink:     { key: "pink", name: "Pink", additive: "EDTA", color: "#e89ab5", panel: "Type & screen" },
  yellow:   { key: "yellow", name: "Yellow (SPS)", additive: "SPS", color: "#e6cf4b", panel: "Blood cultures" },
  royal:    { key: "royal", name: "Royal blue", additive: "Trace", color: "#4f74d6", panel: "Toxicology" },
  bloodgas: { key: "bloodgas", name: "Blood gas", additive: "Hep syringe", color: "#7fa8c9", panel: "Blood gas" },
  tan:      { key: "tan", name: "Tan", additive: "EDTA", color: "#cbb08a", panel: "Lead level" }
};

// Fixed display order for the grouped panels (clinically familiar top-down).
var TUBE_ORDER = ["lavender", "gold", "gray", "lightblue", "green", "bloodgas", "royal", "yellow", "pink", "tan"];

// Ordered keyword -> tube rules; first hit wins, so put the specific tubes
// (gases, coags, CBC, glucose/lactate) before the gold catch-all.
var RULES = [
  { tube: "bloodgas", kw: ["blood gas", "abg", "vbg", "cbg", "ph", "pco2", "po2", "paco2", "pao2", "hco3", "bicarb", "base excess", "base deficit"] },
  { tube: "lightblue", kw: ["inr", "pt/inr", "aptt", "ptt", "prothrombin", "fibrinogen", "d-dimer", "ddimer", "coag"] },
  { tube: "lavender", kw: ["cbc", "hemoglobin", "haemoglobin", "hgb", "hb", "hct", "hematocrit", "haematocrit", "platelet", "plt", "wbc", "white cell", "white blood", "rbc", "mcv", "esr", "retic", "blood film", "smear", "hba1c"] },
  { tube: "gray", kw: ["lactate", "lactic", "glucose", "bsl", "blood sugar"] },
  { tube: "yellow", kw: ["culture", "blood culture"] },
  { tube: "pink", kw: ["type and screen", "type & screen", "crossmatch", "cross-match", "cross match", "group and screen", "group and save", "blood bank", "antibody screen"] },
  { tube: "royal", kw: ["tox", "toxicology", "acetaminophen", "paracetamol", "salicylate", "aspirin level", "ethanol", "alcohol level", "drug screen", "drug level"] },
  { tube: "tan", kw: ["lead"] },
  { tube: "green", kw: ["ammonia", "nh3"] },
  { tube: "gold", kw: ["sodium", "na", "potassium", "k", "chloride", "cl", "co2", "bun", "urea", "creatinine", "creat", "cr", "egfr", "calcium", "ca", "magnesium", "mg", "phosph", "phos", "alt", "ast", "alp", "alk phos", "ggt", "bilirubin", "bili", "albumin", "protein", "crp", "procalcitonin", "troponin", "ck", "ckmb", "bnp", "lipase", "amylase", "osmol", "ketone", "bhb", "cortisol", "tsh", "lipase", "panel", "chem", "cmp", "bmp", "lft", "electrolyte", "metabolic"] }
];

// Generators write the same analyte several ways. Fold the spellings that
// differ only in glyph onto the ascii the rules are written in, or the lab
// lands in the gold catch-all: real cases ship "HCO₃", "HCO₃⁻" and "pCO₂"
// alongside "HCO3" and "pCO2", which used to split one VBG across two panels.
var SUBSCRIPTS = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
function normalize(text) {
  return text.toLowerCase()
    .replace(/[₀-₉]/g, function (c) { return SUBSCRIPTS[c] || c; })
    .replace(/[⁻⁺]/g, "");
}

function matchKw(text, kw) {
  // Word-ish boundary so short keys ("na", "k", "cr") don't match inside
  // longer words ("name", "alkaline", "creatinine"). Escape regex specials.
  //
  // The trailing boundary allows an optional plural "s": the rules are written
  // singular ("platelet", "culture") but cases write "Platelets" and "Blood
  // Cultures", and demanding a non-alphanumeric character straight after the
  // keyword sent both to the gold catch-all — a CBC result under Chemistry.
  var esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re = new RegExp("(^|[^a-z0-9])" + esc + "s?([^a-z0-9]|$)");
  return re.test(text);
}

// Resolve one lab to its tube descriptor. Always returns a tube (gold default).
export function tubeForLab(lab) {
  var text = normalize(((lab && lab.name) || "") + " " + ((lab && lab.id) || ""));
  for (var i = 0; i < RULES.length; i++) {
    var rule = RULES[i];
    for (var j = 0; j < rule.kw.length; j++) {
      if (matchKw(text, rule.kw[j])) return TUBES[rule.tube];
    }
  }
  return TUBES.gold;
}

// Group an array of labs by tube and return groups in the fixed display
// order. Each group: { tube: <descriptor>, labs: [...] }. Empty tubes are
// omitted. Preserves the original lab order within a group.
export function groupLabsByTube(labs) {
  if (!Array.isArray(labs)) return [];
  var byKey = {};
  for (var i = 0; i < labs.length; i++) {
    var t = tubeForLab(labs[i]);
    if (!byKey[t.key]) byKey[t.key] = { tube: t, labs: [] };
    byKey[t.key].labs.push(labs[i]);
  }
  var out = [];
  for (var k = 0; k < TUBE_ORDER.length; k++) {
    var key = TUBE_ORDER[k];
    if (byKey[key]) out.push(byKey[key]);
  }
  return out;
}
