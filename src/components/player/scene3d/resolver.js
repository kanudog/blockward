// [SCENE3D RESOLVER] The load-bearing rule (DIRECTION-3D §5): AvatarSceneState
// is derived ONLY from generated content via a keyword registry. The renderer
// never invents.
//
//   - Not mentioned  -> default (calm, happy, settled, unadorned)
//   - Mentioned      -> resolved item(s) + any forced pose
//   - Unknown/vague  -> skipped, silently and safely
//   - Interventions APPEND: each give/start adds a stand pouch; each
//     "bring X to the bedside" stages X; fixes REPLACE (a cast or splint
//     placed on a limb clears that limb's deformity marker)
//
// THREE-free on purpose (imports config + sceneVocab only) — callable from the
// run shell / stores outside the lazy 3D chunk. The match REGISTRY is built
// from sceneVocab.js (real device names + real phrases) — de-sanitized so it
// fires on what the REAL generation emits ("nasal cannula", "HFNC", "cast on
// the left arm", "continuous monitoring", …). To extend, edit sceneVocab.js.
import { ACCESSORY_CATALOG, seededConfig } from "./config.js";
import { SCENE_VOCAB } from "./sceneVocab.js";

var CATALOG_BY_ID = {};
ACCESSORY_CATALOG.forEach(function (it) { CATALOG_BY_ID[it.id] = it; });

// The match registry is the vocab table (real phrases). `limbed` items look
// for a limb name near the match (same sentence) and default to the right arm
// when unstated.
var REGISTRY = SCENE_VOCAB.map(function (v) {
  return { id: v.id, phrases: v.phrases, limbed: !!v.limbed };
});

// When the key id matches, the listed ids are dropped from the same scan —
// their phrases are substrings/subsets of the richer match.
var SUPPRESSES = {
  "line-two-prong-heavy": ["line-two-prong"],
  "cover-reservoir": ["cover-loose"],
  "patch-scalp-access": ["patch-limb-access"],
  "rim-swollen": ["limb-swollen"]
};

// Fixes replace their precursor ON THE SAME LIMB.
var REPLACES = {
  "shell-limb": "limb-out-of-line",
  "splint-limb": "limb-out-of-line"
};

// rails states are mutually exclusive
var RAIL_IDS = { "rails-up": "rails-down", "rails-down": "rails-up" };

// Limb names the resolver understands; hand/foot alias onto arm/leg.
var LIMBS = [
  ["left arm", "left-arm"], ["left leg", "left-leg"],
  ["right arm", "right-arm"], ["right leg", "right-leg"],
  ["left hand", "left-arm"], ["right hand", "right-arm"],
  ["left foot", "left-leg"], ["right foot", "left-leg"]
];

// Text-driven pose, in priority order (first match wins). An accessory
// carrying a catalog `pose` (e.g. the endotracheal tube) overrides these.
// Phrases are chosen to avoid loose collisions (e.g. no bare "lying" -> would
// match "underlying").
var POSE_RULES = [
  { phrases: ["eyes closed", "won't wake", "wont wake", "unresponsive", "not responding", "unconscious", "obtunded", "comatose", "does not respond", "unarousable"], pose: "lying-eyes-closed" },
  { phrases: ["curled on", "fetal position", "curled up"], pose: "curled-side" },
  { phrases: ["sitting on the edge", "sits on the edge", "sitting up on the edge"], pose: "sitting-edge" },
  { phrases: ["standing", "ambulating", "walking in"], pose: "standing-supported" },
  { phrases: ["lying quietly", "lying still", "lying supine", "supine on", "recumbent", "lying on the", "reclined"], pose: "lying-eyes-open" }
];

var FACE_RULES = [
  { phrases: ["drowsy", "lethargic", "somnolent", "heavy-lidded", "hard to arouse", "sleepy", "listless"], eyes: "heavy", mouth: "neutral" },
  { phrases: ["crying", "inconsolable", "irritable", "fussy", "distressed", "agitated", "upset", "screaming"], eyes: "open", mouth: "unsettled" }
];

// Any of these verbs in an intervention hangs one more stand pouch.
var GIVE_VERBS = ["give", "gives", "given", "start", "starts", "started", "hang", "hangs", "push", "pushed", "bolus", "administer", "administered", "infuse", "infusing", "transfuse", "load", "loading"];
var POUCH_CAP = 4;

function clone(state) {
  return {
    ageBand: state.ageBand,
    station: state.station,
    pose: state.pose,
    face: state.face,
    accessories: state.accessories.slice(),
    stagedItems: state.stagedItems.slice(),
    pouchCount: state.pouchCount,
    config: state.config,
    companion: state.companion
  };
}

function findLimb(low, idx) {
  var windowText = low.slice(Math.max(0, idx - 48), idx + 72);
  var i;
  for (i = 0; i < LIMBS.length; i++) {
    if (windowText.indexOf(LIMBS[i][0]) >= 0) return LIMBS[i][1];
  }
  return "";
}

// entries are "id" (default placement) or "id@limb"
function entryFor(id, limb) {
  return limb && limb !== "right-arm" ? id + "@" + limb : id;
}

function hasWord(low, word) {
  var idx = low.indexOf(word);
  while (idx >= 0) {
    var before = idx === 0 ? " " : low.charAt(idx - 1);
    var after = idx + word.length >= low.length ? " " : low.charAt(idx + word.length);
    if (!/[a-z]/.test(before) && !/[a-z]/.test(after)) return true;
    idx = low.indexOf(word, idx + 1);
  }
  return false;
}

// createSceneState({ ageBand, sexVariant, paletteSeed }) — the default,
// unadorned state: calm, happy, settled, seeded look + companion.
export function createSceneState(meta) {
  var cfg = seededConfig(meta.paletteSeed || "case", meta.sexVariant || "neutral");
  var band = meta.ageBand || "B";
  return {
    ageBand: band,
    station: band === "A" || band === "B" ? "crib" : "bed",
    pose: "settled",
    face: null,
    accessories: [],
    stagedItems: [],
    pouchCount: 0,
    config: cfg,
    companion: cfg.companion
  };
}

// scanText(state, text) -> new state with everything the content names.
// Unknown descriptions match nothing and are skipped — the guarantee that
// makes small-model authorship safe.
export function scanText(state, text) {
  var low = String(text || "").toLowerCase();
  var next = clone(state);
  var matched = [];
  REGISTRY.forEach(function (r) {
    var i, idx;
    for (i = 0; i < r.phrases.length; i++) {
      idx = low.indexOf(r.phrases[i]);
      if (idx >= 0) {
        matched.push({ id: r.id, limb: r.limbed ? findLimb(low, idx) : "" });
        return;
      }
    }
  });
  var suppressed = {};
  matched.forEach(function (m) {
    (SUPPRESSES[m.id] || []).forEach(function (s) { suppressed[s] = true; });
  });
  matched.forEach(function (m) {
    if (suppressed[m.id]) return;
    if (m.id === "pouch-on-stand") {
      // a narrated bag means at least one is hanging; interventions do the
      // real accumulation in applyIntervention
      next.pouchCount = Math.max(next.pouchCount, 1);
      return;
    }
    if (RAIL_IDS[m.id]) {
      var other = RAIL_IDS[m.id];
      next.accessories = next.accessories.filter(function (e) { return e !== other; });
    }
    var entry = entryFor(m.id, m.limb);
    var rep = REPLACES[m.id];
    if (rep) {
      var repEntry = entryFor(rep, m.limb);
      next.accessories = next.accessories.filter(function (e) { return e !== repEntry; });
    }
    if (next.accessories.indexOf(entry) < 0) next.accessories.push(entry);
  });
  var p, f;
  for (p = 0; p < POSE_RULES.length; p++) {
    if (POSE_RULES[p].phrases.some(function (ph) { return low.indexOf(ph) >= 0; })) {
      next.pose = POSE_RULES[p].pose;
      break;
    }
  }
  for (f = 0; f < FACE_RULES.length; f++) {
    if (FACE_RULES[f].phrases.some(function (ph) { return low.indexOf(ph) >= 0; })) {
      next.face = { eyes: FACE_RULES[f].eyes, mouth: FACE_RULES[f].mouth };
      break;
    }
  }
  // a forced pose from an active accessory wins over text poses
  next.accessories.forEach(function (e) {
    var id = e.split("@")[0];
    var item = CATALOG_BY_ID[id];
    if (item && item.pose) next.pose = item.pose;
  });
  return next;
}

// applyIntervention(state, text) — everything scanText does, PLUS the append
// rules: any give/start/hang adds one stand pouch (cap 4); a "bring … to the
// bedside" stages what it names (or a generic item).
export function applyIntervention(state, text) {
  var low = String(text || "").toLowerCase();
  var before = state.accessories.length;
  var pouchBefore = state.pouchCount;
  var next = scanText(state, text);
  if (GIVE_VERBS.some(function (v) { return hasWord(low, v); })) {
    next.pouchCount = Math.min(pouchBefore + 1, POUCH_CAP);
  }
  if (low.indexOf("bedside") >= 0) {
    var added = next.accessories.slice(before);
    if (added.length) {
      next.stagedItems = next.stagedItems.concat(added);
    } else {
      next.stagedItems = next.stagedItems.concat(["table-side"]);
    }
  }
  return next;
}

// stabilize(state) — the final beat, ALWAYS played at recovery.
export function stabilize(state) {
  var next = clone(state);
  next.pose = "celebrate";
  next.face = { eyes: "open", mouth: "grin" };
  return next;
}

// Apply SUPPRESSES across the WHOLE accumulated set (not just within one
// scanText pass): e.g. once HFNC (heavy) is established anywhere in the run, a
// plain nasal cannula matched from a different sentence is dropped, so the
// figure never wears two cannulas.
function baseId(e) { return e.split("@")[0]; }
function finalizeSuppress(list) {
  var present = {};
  list.forEach(function (e) { present[baseId(e)] = true; });
  var kill = {};
  Object.keys(present).forEach(function (id) {
    (SUPPRESSES[id] || []).forEach(function (s) { kill[s] = true; });
  });
  return list.filter(function (e) { return !kill[baseId(e)]; });
}

// sceneProps(state) -> the SceneView prop slice. Pouches repeat their id
// (the renderer accumulates per occurrence); generic staged items add a
// table-side occurrence each.
export function sceneProps(state) {
  var acc = finalizeSuppress(state.accessories.slice());
  var i;
  for (i = 0; i < state.pouchCount; i++) acc.push("pouch-on-stand");
  state.stagedItems.forEach(function (s) {
    if (s === "table-side") acc.push("table-side");
  });
  return {
    pose: state.pose,
    accessories: acc,
    faceEyes: state.face ? state.face.eyes : "",
    faceMouth: state.face ? state.face.mouth : "",
    companion: state.companion
  };
}
