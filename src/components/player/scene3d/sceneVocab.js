// [SCENE VOCAB] The single source of truth that maps each structural 3D
// accessory id to (1) its REAL device / finding name and (2) the real-world
// phrases the generation/narration actually emits. THREE-free.
//
// WHY THIS EXISTS (read before adding assets):
//   The 3D accessory ids stay deliberately generic/structural ("line-two-prong")
//   so new models authored in the sanitized Fable sandbox drop in unchanged.
//   Real cases never say "two-prong" — they say "nasal cannula" / "HFNC". This
//   table is the translation layer: the resolver (resolver.js) builds its match
//   REGISTRY from `phrases` here, and any UI shows `realName`. Keep it the ONE
//   place the two vocabularies meet.
//
//   TO WIRE A NEW SANITIZED ASSET:
//     1. add its render fn in accessories.js (keyed by the structural id),
//     2. add its {id, family, label, note} row in config.js (ACCESSORY_CATALOG),
//     3. add ONE row here: { id, realName, phrases:[...real phrases the case
//        text will use], limbed? }. Order is not significant (all rows are
//        scanned); put the more specific phrase-set of an overlapping pair in
//        SUPPRESSES (resolver.js) so the richer match wins.
//
// Phrases are lowercase, case-insensitive substrings, matched inside real
// narrative / findings / the case `visuals[]` prose / intervention labels.

export var SCENE_VOCAB = [
  // ---- A: face & airflow ---------------------------------------------------
  { id: "line-two-prong-heavy", family: "A", realName: "High-flow nasal cannula (HFNC)", phrases: ["high-flow nasal", "high flow nasal", "hfnc", "heated humidified high"] },
  { id: "line-two-prong", family: "A", realName: "Nasal cannula", phrases: ["nasal cannula", "oxygen cannula", "o2 cannula"] },
  { id: "cover-reservoir", family: "A", realName: "Non-rebreather mask", phrases: ["non-rebreather", "non rebreather", "nonrebreather", "nrb", "reservoir mask"] },
  { id: "cover-loose", family: "A", realName: "Oxygen face mask", phrases: ["oxygen mask", "o2 mask", "simple face mask", "simple mask", "venturi"] },
  // "nebuliz" as a stem: real labels say "continuous albuterol nebulization",
  // which the longer spellings missed entirely.
  { id: "mist-cover", family: "A", realName: "Nebulizer mask", phrases: ["nebuliz", "nebulis", "neb mask", "aerosol mask", "continuous albuterol"] },
  // RSI wording added 2026-07-30: "Perform RSI and secure definitive airway"
  // is how the generator actually labels intubation, and none of the previous
  // phrases matched it — so the one action that definitely puts in a tube drew
  // nothing, while "prepare intubation kit" drew one. Exactly backwards.
  { id: "tube-mouth-central", family: "A", realName: "Endotracheal tube (intubated)", phrases: ["intubat", "endotracheal", "et tube", "ett ", "breathing tube down", "rapid sequence", "definitive airway", "secure the airway", "secured the airway"] },
  { id: "port-neck", family: "A", realName: "Tracheostomy", phrases: ["tracheostomy", "tracheotomy", "trach collar", "trach tube", "trach in place"] },
  { id: "tube-nose-cheek", family: "A", realName: "Nasogastric / orogastric tube", phrases: ["nasogastric", "ng tube", "og tube", "orogastric", "feeding tube taped"] },

  // ---- L: lines & pouches --------------------------------------------------
  { id: "patch-scalp-access", family: "L", realName: "Scalp IV", phrases: ["scalp iv", "scalp vein", "scalp line"] },
  // Arterial-line wording folded in here rather than given its own id: an
  // a-line is vascular access on a limb and the limb-patch is the right visual.
  // (A separate "port-chest" id for central lines was tried and removed — the
  // renderer has no case for it, so it drew nothing at all.)
  { id: "patch-limb-access", family: "L", realName: "Vascular access (IV / arterial line)", phrases: ["iv in place", "iv access", "peripheral iv", "iv line", "iv catheter", "saline lock", "gauge iv", "iv in her", "iv in his", "arterial line", "a-line", "art line"], limbed: true },
  { id: "pouch-on-stand", family: "L", realName: "IV fluid / infusion bag", phrases: ["infusion running", "iv fluids running", "maintenance fluids", "drip running"] },
  { id: "port-belly", family: "L", realName: "Gastrostomy button (G-tube)", phrases: ["g-tube", "g tube", "gastrostomy", "peg tube", "feeding button"] },
  { id: "tube-side-torso", family: "L", realName: "Chest tube", phrases: ["chest tube", "thoracostomy", "chest drain", "pigtail catheter"] },
  { id: "pouch-rail-low", family: "L", realName: "Urinary catheter bag (Foley)", phrases: ["foley", "urinary catheter", "urine bag", "urinary drainage"] },
  { id: "pouch-drain-side", family: "L", realName: "Surgical drain", phrases: ["surgical drain", "jp drain", "jackson-pratt", "wound drain", "penrose"] },

  // ---- S: surface & limbs --------------------------------------------------
  { id: "shell-limb", family: "S", realName: "Cast", phrases: ["cast on", "casted", "in a cast", "arm cast", "leg cast", "cast left", "cast right"], limbed: true },
  { id: "splint-limb", family: "S", realName: "Splint", phrases: ["splint", "splinted", "immobilized in a"], limbed: true },
  { id: "limb-out-of-line", family: "S", realName: "Deformity / unreduced fracture", phrases: ["obvious deformity", "angulated", "out of line", "grossly deformed", "visibly deformed"], limbed: true },
  { id: "band-tight-limb", family: "S", realName: "Tourniquet", phrases: ["tourniquet"], limbed: true },
  { id: "limb-swollen", family: "S", realName: "Swollen extremity", phrases: ["swollen arm", "swollen leg", "swollen extremity", "limb swelling", "swollen hand", "swollen foot"], limbed: true },
  { id: "wrap-limb", family: "S", realName: "Wound dressing / bandage", phrases: ["wound dressing", "bandaged", "gauze dressing", "dressing over", "pressure dressing"], limbed: true },
  { id: "wrap-head", family: "S", realName: "Head bandage", phrases: ["head bandage", "head wrap", "head dressing", "head injury", "head trauma", "scalp laceration"] },
  { id: "cover-eye", family: "S", realName: "Eye patch", phrases: ["eye patch", "eye bandage", "patch over the eye", "eye shield taped"] },
  { id: "ring-eye-shaded", family: "S", realName: "Periorbital bruising (black eye)", phrases: ["periorbital", "black eye", "raccoon eye", "eye bruising"] },
  { id: "marks-scattered", family: "S", realName: "Petechiae / purpura / rash", phrases: ["petechiae", "petechial", "purpura", "non-blanching", "nonblanching", "maculopapular", "diffuse rash"] },
  { id: "marks-cluster", family: "S", realName: "Hives (urticaria)", phrases: ["hives", "urticaria", "wheals", "urticarial"] },
  { id: "patches-deep-tone", family: "S", realName: "Bruising / ecchymosis", phrases: ["ecchymos", "bruising", "contusion", "hematoma"] },
  { id: "line-closed-ticks", family: "S", realName: "Surgical incision / sutures", phrases: ["surgical incision", "sutures", "staples", "closed incision", "surgical site"] },
  { id: "patches-mottled", family: "S", realName: "Mottling", phrases: ["mottled", "mottling"] },
  { id: "tone-pale", family: "S", realName: "Pallor", phrases: ["pale", "pallor", "pallid", "ashen"] },
  { id: "tint-cool-rims", family: "S", realName: "Cyanosis", phrases: ["cyanosis", "cyanotic", "blue lips", "dusky", "perioral cyanosis", "acrocyanosis"] },
  { id: "sheen-droplets", family: "S", realName: "Diaphoresis", phrases: ["diaphor", "sweaty", "sweating", "perspir", "clammy"] },
  { id: "rim-swollen", family: "S", realName: "Lip swelling / angioedema", phrases: ["lip swelling", "swollen lip", "angioedema", "lip swell", "facial swelling", "tongue swelling"] },
  { id: "collar-neck-support", family: "S", realName: "Cervical collar", phrases: ["c-collar", "c collar", "cervical collar", "neck brace", "cervical immobilization"] },
  { id: "wrap-thermal-torso", family: "S", realName: "Warming / cooling blanket", phrases: ["warming blanket", "cooling blanket", "forced-air warmer", "bair hugger"] },
  { id: "pack-cold", family: "S", realName: "Ice / cold pack", phrases: ["ice pack", "cold pack", "cold compress"] },
  { id: "wrap-torso-wide", family: "S", realName: "Abdominal / pelvic binder", phrases: ["abdominal binder", "pelvic binder"] },

  // ---- M: mobility & supports ----------------------------------------------
  { id: "seat-wheeled", family: "M", realName: "Wheelchair", phrases: ["wheelchair", "wheel chair"] },
  { id: "frame-support", family: "M", realName: "Walker", phrases: ["walker", "walking frame", "rollator"] },
  { id: "stick-single", family: "M", realName: "Cane", phrases: ["walking cane", "walking stick"] },
  { id: "poles-underarm", family: "M", realName: "Crutches", phrases: ["crutch", "crutches"] },
  { id: "platform-transport", family: "M", realName: "Stretcher / gurney / backboard", phrases: ["stretcher", "gurney", "backboard", "long board", "transport board"] },
  { id: "pouch-arm-sling", family: "M", realName: "Arm sling", phrases: ["arm sling", "in a sling"] },

  // ---- B: bedside & staging ------------------------------------------------
  { id: "machine-support", family: "B", realName: "Ventilator", phrases: ["ventilator", "on the vent", "mechanical ventilation", "ventilated"] },
  { id: "pump-box", family: "B", realName: "Infusion pump", phrases: ["infusion pump", "iv pump", "syringe pump"] },
  { id: "canister-rail", family: "B", realName: "Suction setup", phrases: ["suction", "wall suction", "suction canister", "yankauer"] },
  { id: "meter-head-wall", family: "B", realName: "Oxygen flowmeter", phrases: ["flowmeter", "wall oxygen", "o2 flow", "blender"] },
  { id: "basin-table", family: "B", realName: "Emesis basin", phrases: ["emesis basin", "vomit basin"] },
  { id: "light-panel-crib", family: "B", realName: "Phototherapy / overhead warmer", phrases: ["phototherapy", "bili light", "overhead warmer", "radiant warmer"] },
  { id: "mitts-soft", family: "B", realName: "Hand mitts", phrases: ["hand mitts", "soft mitts", "mittens"] },
  { id: "soother", family: "B", realName: "Pacifier", phrases: ["pacifier", "soother", "dummy in"] },
  { id: "rails-up", family: "B", realName: "Side rails up", phrases: ["rails up", "rail raised", "rails raised", "side rails up"] },
  { id: "rails-down", family: "B", realName: "Side rails down", phrases: ["rails down", "rail lowered", "rails lowered", "side rails down"] },

  // ---- E: monitoring & everyday --------------------------------------------
  { id: "leads-torso", family: "E", realName: "ECG / monitor leads", phrases: ["cardiac monitor", "cardiorespiratory monitor", "continuous monitoring", "on the monitor", "ecg leads", "ekg leads", "chest leads", "telemetry"] },
  { id: "clip-hand", family: "E", realName: "Pulse oximeter probe", phrases: ["pulse oximeter", "pulse ox", "spo2 probe", "sat probe", "pulse oximetry", "oximetry probe"] },
  { id: "cuff-limb", family: "E", realName: "Blood pressure cuff", phrases: ["blood pressure cuff", "bp cuff", "noninvasive blood pressure", "nibp"], limbed: true },
  { id: "band-id-wrist", family: "E", realName: "ID band", phrases: ["id band", "identification band", "identity band", "wristband"] },
  { id: "blanket-lap", family: "E", realName: "Blanket", phrases: ["blanket", "swaddled", "swaddle"] },
  { id: "strip-small", family: "E", realName: "Adhesive dressing / tape", phrases: ["adhesive strip", "band-aid", "bandaid", "tape over"] },
  { id: "cap-knit", family: "E", realName: "Knit cap (infant)", phrases: ["knit cap", "knitted cap", "beanie"] },
  { id: "shade-eyes-band", family: "E", realName: "Eye shields (phototherapy)", phrases: ["eye shades", "eye shields", "bili mask", "eye protection over"] }
];

// id -> real display name (for any UI that lists accessories).
export var REAL_NAME_BY_ID = {};
SCENE_VOCAB.forEach(function (v) { REAL_NAME_BY_ID[v.id] = v.realName; });

export function realNameFor(id) {
  var base = String(id || "").split("@")[0];
  return REAL_NAME_BY_ID[base] || base;
}
