// [SCENE3D CONFIG] Seeded per-case look randomization (DIRECTION-3D §2):
// garment color (per-variant palette), hair style + color, face set, base
// surface tone, and the stuffed companion pick. Deterministic from
// paletteSeed — assigned at generation, then FIXED for the case.
//
// Plain data + a tiny PRNG, no `three` import — safe to import from anywhere
// (the resolver in phase E will use it outside the lazy chunk).

// Pose ids + review labels (DIRECTION-3D §3). Lives here (not poses.js) so
// UI can list poses without touching the lazy three.js chunk.
export var POSES = [
  { id: "settled", label: "Settled" },
  { id: "lying-eyes-open", label: "Lying · eyes open" },
  { id: "lying-eyes-closed", label: "Lying · eyes closed" },
  { id: "sitting-edge", label: "Edge sit" },
  { id: "standing-supported", label: "Standing" },
  { id: "curled-side", label: "Curled" },
  { id: "celebrate", label: "Celebrate" }
];

// Accessory catalog metadata (DIRECTION-3D §4) — ids, review labels, and the
// pose an item forces, three-free so UI and the future resolver can list
// items without loading the 3D chunk. Render functions live in
// accessories.js (lazy). Built out slice by slice; family A first.
export var ACCESSORY_CATALOG = [
  { id: "line-two-prong", family: "A", label: "Two-prong line", note: "Thin line across the upper lip, looped toward the ears." },
  { id: "line-two-prong-heavy", family: "A", label: "Two-prong line · heavy", note: "The same run with visibly heavier tubing." },
  { id: "cover-loose", family: "A", label: "Loose cover", note: "Loose lower-face cover on a thin strap." },
  { id: "cover-reservoir", family: "A", label: "Cover + reservoir", note: "Lower-face cover with a small pouch hanging beneath." },
  { id: "mist-cover", family: "A", label: "Mist cover", note: "Mouthpiece cover with soft mist and a small bedside unit on the table." },
  { id: "tube-mouth-central", family: "A", label: "Central mouth tube", note: "Cheek-taped central tube running to the support machine at the head end.", pose: "lying-eyes-closed" },
  { id: "port-neck", family: "A", label: "Neck port", note: "Front-of-neck connector." },
  { id: "tube-nose-cheek", family: "A", label: "Nose-cheek tube", note: "Thin nose tube taped to the cheek, running to a small pump on the table." },
  { id: "patch-limb-access", family: "L", label: "Limb access patch", note: "Small taped patch on a limb with a thin line up to the stand." },
  { id: "pouch-on-stand", family: "L", label: "Pouch on stand", note: "A hanging pouch on the stand — each give/start adds another (up to four) and a pump box clamps onto the pole.", demo: ["pouch-on-stand", "pouch-on-stand", "pouch-on-stand"] },
  { id: "patch-scalp-access", family: "L", label: "Scalp access patch", note: "Small-band alternative access patch on the side of the head, line to the stand." },
  { id: "port-belly", family: "L", label: "Torso button port", note: "Small button disc on the torso." },
  { id: "tube-side-torso", family: "L", label: "Side torso tube", note: "Side tube running down to a collection box on the floor." },
  { id: "pouch-rail-low", family: "L", label: "Low rail pouch", note: "Low collection pouch hung on the station rail." },
  { id: "pouch-drain-side", family: "L", label: "Side drain pouch", note: "Small drainage pouch taped at the side." },
  { id: "wrap-limb", family: "S", label: "Limb wrap", note: "Soft wrap around a limb." },
  { id: "shell-limb", family: "S", label: "Limb shell", note: "Rigid full white shell on a limb." },
  { id: "splint-limb", family: "S", label: "Limb splint", note: "Half-shell behind the limb with strap ties." },
  { id: "limb-out-of-line", family: "S", label: "Limb out of line", note: "One limb visibly out of line — pairs with a shell or splint once fixed." },
  { id: "band-tight-limb", family: "S", label: "Tight limb band", note: "Bright tight band high on an extremity." },
  { id: "limb-swollen", family: "S", label: "Swollen limb", note: "One limb visibly enlarged." },
  { id: "wrap-head", family: "S", label: "Head wrap", note: "Band around the crown." },
  { id: "cover-eye", family: "S", label: "Eye cover", note: "One-eye cover on a strap." },
  { id: "ring-eye-shaded", family: "S", label: "Shaded eye ring", note: "Blue-purple ring around one eye." },
  { id: "marks-scattered", family: "S", label: "Scattered marks", note: "Small red marks spread wide." },
  { id: "marks-cluster", family: "S", label: "Clustered marks", note: "A tight group of small marks." },
  { id: "patches-deep-tone", family: "S", label: "Deep-tone patches", note: "Blue-purple patches on the surface." },
  { id: "line-closed-ticks", family: "S", label: "Closed line + ticks", note: "A closed surface line with closure ticks — always gentle." },
  { id: "patches-mottled", family: "S", label: "Mottled patches", note: "Red-white mottled patches." },
  { id: "tone-pale", family: "S", label: "Pale tone shift", note: "Whole-figure pale shift, face included." },
  { id: "tint-cool-rims", family: "S", label: "Cool rims tint", note: "Blue-cool tint at the lips, hands, and feet." },
  { id: "sheen-droplets", family: "S", label: "Brow droplets", note: "Sweat droplets at the brow." },
  { id: "rim-swollen", family: "S", label: "Swollen rim", note: "Puffy rim at the mouth." },
  { id: "collar-neck-support", family: "S", label: "Neck support collar", note: "Rigid support collar." },
  { id: "wrap-thermal-torso", family: "S", label: "Thermal torso wrap", note: "Warming/cooling wrap around the torso." },
  { id: "pack-cold", family: "S", label: "Cold pack", note: "Small cold pack resting on the upper torso." },
  { id: "wrap-torso-wide", family: "S", label: "Wide torso band", note: "Wide band around the middle." },
  { id: "seat-wheeled", family: "M", label: "Wheeled seat", note: "Wheeled seat parked beside the station.", pose: "standing-supported" },
  { id: "frame-support", family: "M", label: "Support frame", note: "Waist-high four-leg support frame in front of the figure.", pose: "standing-supported" },
  { id: "stick-single", family: "M", label: "Support stick", note: "Single support stick at the hand.", pose: "standing-supported" },
  { id: "poles-underarm", family: "M", label: "Underarm poles", note: "Paired underarm support poles.", pose: "standing-supported" },
  { id: "platform-transport", family: "M", label: "Transport platform", note: "Flat wheeled platform — replaces the station for arrival scenes (resolver, phase F); parked bedside here." },
  { id: "pouch-arm-sling", family: "M", label: "Arm sling", note: "Bent-arm support pouch across the chest." },
  { id: "table-side", family: "B", label: "Staging table", note: "The staging surface — brought-to-bedside items land here (shown with a staged item)." },
  { id: "machine-support", family: "B", label: "Support machine", note: "Screen box on a cart at the head end (used by the central tube and neck port)." },
  { id: "pump-box", family: "B", label: "Pump box", note: "Small box clamped to the stand pole." },
  { id: "canister-rail", family: "B", label: "Rail canister", note: "Canister mounted at the station rail." },
  { id: "meter-head-wall", family: "B", label: "Head-end meter", note: "Flow/mix box on the head-end column." },
  { id: "basin-table", family: "B", label: "Table basin", note: "Small basin on the side table." },
  { id: "light-panel-crib", family: "B", label: "Crib light panel", note: "Soft overhead light panel above the crib (small bands)." },
  { id: "mitts-soft", family: "B", label: "Soft mitts", note: "Soft protective mitts over both hands (small bands)." },
  { id: "soother", family: "B", label: "Soother", note: "Small comfort item (small bands)." },
  { id: "rails-up", family: "B", label: "Rails up", note: "Near-side rail raised — the default state." },
  { id: "rails-down", family: "B", label: "Rails down", note: "Near-side rail lowered." },
  { id: "leads-torso", family: "E", label: "Torso leads", note: "Three small sticker patches on the chest, thin lines bundling off to the rail." },
  { id: "clip-hand", family: "E", label: "Hand clip", note: "Small glowing clip over the hand with a thin line to the rail." },
  { id: "cuff-limb", family: "E", label: "Limb cuff", note: "Soft measuring cuff high on a limb with a small gauge." },
  { id: "band-id-wrist", family: "E", label: "Wrist band", note: "Small identity band at the wrist." },
  { id: "blanket-lap", family: "E", label: "Lap blanket", note: "Soft blanket over the lap and legs." },
  { id: "strip-small", family: "E", label: "Small strip", note: "Tiny adhesive strip on a limb." },
  { id: "cap-knit", family: "E", label: "Knit cap", note: "Soft knit cap with a pom (small bands)." },
  { id: "shade-eyes-band", family: "E", label: "Eye shade band", note: "Soft band shading both eyes — pairs with the crib light panel." }
];

// Gallery grouping labels for the catalog families built so far.
export var ACCESSORY_FAMILIES = [
  { key: "A", label: "Family A — face & airflow" },
  { key: "L", label: "Family L — lines & pouches" },
  { key: "S", label: "Family S — surface & limbs" },
  { key: "M", label: "Family M — mobility & supports" },
  { key: "B", label: "Family B — bedside & staging" },
  { key: "E", label: "Family E — monitoring & everyday" }
];

// Whole-figure tone shift for `tone-pale`: mix the seeded tone toward a pale
// neutral BEFORE the figure builds, so body and face texture shift together.
export function paleShift(tone) {
  var r = (tone >> 16) & 255, g = (tone >> 8) & 255, b = tone & 255;
  function mix(c, target) { return Math.round(c + (target - c) * 0.55); }
  return (mix(r, 242) << 16) | (mix(g, 233) << 8) | mix(b, 228);
}

export var HAIR_STYLES = [
  "cap", "buzz", "fringe", "waves", "tall",
  "side", "buns", "tails", "curls", "swoop"
];

export var HAIR_COLORS = [
  0x2b2b2b, 0x5b3a22, 0x8a5a33, 0xd9a441,
  0xe8d28a, 0xa8431f, 0xb4553a, 0xbfc3c9
];

// Garment palettes per figure variant — the variant comes from the case
// (sexVariant), the color pick within its palette comes from the seed.
export var GOWN_PALETTE = {
  v1: [0xbcd9f2, 0xa8d8c8, 0xcfd8ef],
  v2: [0xf4b8d0, 0xf5d3a8, 0xd9c2ef],
  neutral: [0xd9e3d3, 0xe8e0c8, 0xcfe0e8]
};

// Base surface tones — a small natural range (DIRECTION-3D §2).
export var TONES = [0xffcc99, 0xf2b98a, 0xe0a878, 0xc98d5f, 0xa9713f, 0x8a5a30];

// The stuffed companion pool (DIRECTION-3D §7) — picked per case here so the
// choice is stable; the tiny blocky renders land in phase D.
export var COMPANIONS = [
  "bear", "dog", "cat", "rhino", "lizard", "tiger", "whale",
  "toucan", "snake", "gorilla", "penguin", "kangaroo", "narwhal",
  "panda", "platypus", "armadillo", "octopus", "fox", "sloth",
  "hedgehog", "axolotl"
];

function hashStr(s) {
  var h = 0, i;
  s = String(s || "x");
  for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return h;
}

// mulberry32 — small, deterministic, good-enough spread for look picks.
function prng(seedInt) {
  var a = seedInt >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rnd, list) { return list[Math.floor(rnd() * list.length)]; }

// seededConfig(paletteSeed, sexVariant) -> the fixed per-case look.
export function seededConfig(seed, variant) {
  var v = GOWN_PALETTE[variant] ? variant : "neutral";
  var rnd = prng(hashStr(seed));
  return {
    variant: v,
    gownColor: pick(rnd, GOWN_PALETTE[v]),
    hairStyle: pick(rnd, HAIR_STYLES),
    hairColor: pick(rnd, HAIR_COLORS),
    tone: pick(rnd, TONES),
    faceSet: rnd() < 0.5 ? 0 : 1,
    companion: pick(rnd, COMPANIONS)
  };
}
