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
  // "right foot" used to map to left-leg — a straight typo that put every
  // right-foot finding on the wrong side.
  ["left foot", "left-leg"], ["right foot", "right-leg"],
  // Bone landmarks, so "left tibial IO" and "right humeral IO" land on the
  // limb they name rather than falling back to the default right arm.
  ["left tibia", "left-leg"], ["right tibia", "right-leg"],
  ["left shin", "left-leg"], ["right shin", "right-leg"],
  ["left femur", "left-leg"], ["right femur", "right-leg"],
  ["left humer", "left-arm"], ["right humer", "right-arm"],
  ["left antecub", "left-arm"], ["right antecub", "right-arm"],
  ["left wrist", "left-arm"], ["right wrist", "right-arm"],
  ["left forearm", "left-arm"], ["right forearm", "right-arm"]
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

// Owner direction 2026-08-05: as interventions are selected, the kit they bring
// should appear at the bedside. Anything we can draw on the patient already is
// (scanText put it there); anything given IV hangs on the pole; EVERYTHING ELSE
// physical lands on the side table.
//
// These ids are the exceptions — decisions and bare-handed assessments. Calling
// a team, activating a protocol, elevating the head of the bed or counting a
// GCS puts no object down, so staging one would be scenery the case never
// earned. Imaging is ordered, not unpacked at the bedside. Everything not
// listed here is treated as a physical thing a nurse would set down.
var NO_BEDSIDE_OBJECT = {
  callRapidResponse: 1, callAnesthesia: 1, callSurgery: 1, callBloodBank: 1,
  callPoisonControl: 1, callNeurosurgery: 1, callCardiology: 1, callPICU: 1,
  mtpActivation: 1,
  gcsAssessment: 1, pupilCheck: 1, capRefill: 1, pulseCheck: 1,
  headOfBedElevation: 1, seizurePrecautions: 1, cSpine: 1, extremityElevation: 1,
  valsalva: 1, fundoscopy: 1,
  chestXray: 1, abdomenXray: 1, headCt: 1, abdomenCt: 1, mri: 1, echocardiogram: 1
};

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

// Entries are "id" (limb UNSTATED — the renderer falls back to the right arm)
// or "id@limb" (a limb the content actually named).
//
// The right arm used to be folded into the bare form, which made "the case said
// right arm" and "the case said nothing" the same string. That is fine for
// drawing — both render on the right arm — but it makes them impossible to tell
// apart when de-duplicating, so an explicitly right-arm IV looked like a stray
// unplaced one and got dropped. An explicitly named limb now always carries it.
function entryFor(id, limb) {
  return limb ? id + "@" + limb : id;
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

// Words that mean "not yet" — the thing is being readied, considered, or
// ordered, not attached to the patient.
//
// Added 2026-07-30 after testing real intervention labels through this scanner.
// "Prepare intubation kit at bedside" contains "intubat", so committing it drew
// an ENDOTRACHEAL TUBE on a child who had not been intubated — the avatar
// showed the airway you were only getting ready for. The same trap sits behind
// "have suction ready", "consider a chest tube", "order a Foley".
//
// The guard is deliberately LOCAL and TIGHT — a 22-character window either
// side of the match, not the whole sentence. Both bounds were learned by test:
//   * A 40-char backward window let "The team is preparing to intubate while
//     the nasal cannula stays in place" suppress the CANNULA as well as the
//     tube, because "preparing" was still inside the window when the scanner
//     reached "nasal cannula". The hedge must govern only the phrase it sits
//     against.
//   * Backward-only missed trailing hedges: "Have suction ready at the
//     bedside" puts the qualifier AFTER the noun, so suction was placed.
var HEDGE_BEFORE = /\b(?:prepar\w*|readied|standby|stand by|consider\w*|anticipat\w*|order\w*|plan\w*|about to|set up for|draw up|drawn up|have)\b[^.;]{0,22}$/;
var HEDGE_AFTER = /^[^.;]{0,22}\b(?:ready|readied|available|on standby|standby|at (?:the )?bedside|if needed|in case|as needed|kit|tray)\b/;
var WINDOW = 22;
function hedged(low, idx, len) {
  var before = low.slice(Math.max(0, idx - WINDOW), idx);
  var after = low.slice(idx + len, idx + len + WINDOW + 12);
  return HEDGE_BEFORE.test(before) || HEDGE_AFTER.test(after);
}

// A RULED-OUT finding must not be drawn. Same shape as the hedge guard, the
// opposite failure: a real meningococcaemia case wrote "…coalescing into
// irregular purpuric patches at the flanks. No urticaria." and the figure came
// up wearing HIVES — the app drew the one differential the case had explicitly
// excluded. Negations are how clinicians write ("no rash", "without
// petechiae", "denies swelling"), so this is common, not exotic.
//
// The window is tight (18 chars) and backward-only, for the same reason the
// hedge window is: a negation governs the phrase it sits against, not the rest
// of the sentence. "No urticaria, but scattered petechiae are present" must
// suppress the hives and keep the petechiae.
//
// "non-blanching" is safe: \bno\b cannot match inside "non".
var NEGATED_BEFORE = /\b(?:no|not|without|denies|denied|negative for|free of|absent|resolved|never|there is no|there are no)\b[^.;,]{0,18}$/;
function negated(low, idx) {
  return NEGATED_BEFORE.test(low.slice(Math.max(0, idx - 30), idx));
}

// scanText(state, text) -> new state with everything the content names.
// Unknown descriptions match nothing and are skipped — the guarantee that
// makes small-model authorship safe.
export function scanText(state, text) {
  var low = String(text || "").toLowerCase();
  var next = clone(state);
  var matched = [];
  REGISTRY.forEach(function (r) {
    var i, idx, from;
    for (i = 0; i < r.phrases.length; i++) {
      // Walk every occurrence: the first mention may be hedged ("prepare the
      // intubation kit") while a later one is real ("tube is in").
      from = 0;
      while (true) {
        idx = low.indexOf(r.phrases[i], from);
        if (idx < 0) break;
        // Every vocab phrase is word-initial (stems like "intubat" and
        // "nebuliz" included), so a match must start at a word boundary.
        // Without this "Place NG Tube" matched the gastrostomy phrase "g tube"
        // inside "ng tube" and drew a G-button on a child who had an NG.
        var startsWord = idx === 0 || !/[a-z]/.test(low.charAt(idx - 1));
        if (startsWord && !hedged(low, idx, r.phrases[i].length) && !negated(low, idx)) {
          matched.push({ id: r.id, limb: r.limbed ? findLimb(low, idx) : "" });
          return;
        }
        from = idx + r.phrases[i].length;
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
      // A face rule must not contradict the pose it sits on. "Unresponsive and
      // lethargic" matched the drowsy rule and rendered HEAVY (half-open) lids
      // on a child the pose had already laid down with eyes CLOSED — the pose
      // is the stronger statement, so it keeps the eyes.
      var eyesClosedByPose = next.pose === "lying-eyes-closed" || next.pose === "curled-side";
      next.face = {
        eyes: eyesClosedByPose ? "closed" : FACE_RULES[f].eyes,
        mouth: FACE_RULES[f].mouth
      };
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

// applyIntervention(state, text, opts) — everything scanText does, PLUS the
// append rules:
//   * any give/start/hang hangs one more bag on the pole (cap 4), and the bag
//     runs the infusion line down to the access site;
//   * a selected tool that put nothing on the patient stages its kit on the
//     side table, unless it is a decision or a bare-handed assessment.
// opts: { id, kind } — the registry id and "tools"|"meds" of the selection.
// Both optional; without an id nothing is staged (the narrative scan path uses
// scanText directly and must not furnish the room).
export function applyIntervention(state, text, opts) {
  var low = String(text || "").toLowerCase();
  var before = state.accessories.length;
  var pouchBefore = state.pouchCount;
  var next = scanText(state, text);
  var id = (opts && opts.id) || "";
  var isMed = !!(opts && opts.kind === "meds");
  var gave = GIVE_VERBS.some(function (v) { return hasWord(low, v); });
  if (gave) next.pouchCount = Math.min(pouchBefore + 1, POUCH_CAP);
  var wornSomething = next.accessories.length > before;
  if (!wornSomething && !gave && !isMed && id && !NO_BEDSIDE_OBJECT[id]) {
    next.stagedItems = next.stagedItems.concat(["table-side"]);
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

// One device mentioned twice must not become two devices. A real case named the
// same intraosseous line in a finding ("Left tibial IO in place") and again in
// the next phase's narrative ("The IO line is functioning"): the first resolved
// to the left leg, the second named no limb and so landed on the default right
// arm, and the child ended up wearing two cannulas.
//
// The rule: a PLACED entry (one that names a limb) always beats the unplaced
// entry for the same id. Two entries that each name a limb are kept — a patient
// really can have access in both arms.
function dropUnplacedDuplicates(list) {
  var placed = {};
  list.forEach(function (e) { if (e.indexOf("@") > 0) placed[baseId(e)] = true; });
  return list.filter(function (e) { return e.indexOf("@") > 0 || !placed[baseId(e)]; });
}

function finalizeSuppress(list) {
  var present = {};
  list.forEach(function (e) { present[baseId(e)] = true; });
  var kill = {};
  Object.keys(present).forEach(function (id) {
    (SUPPRESSES[id] || []).forEach(function (s) { kill[s] = true; });
  });
  return dropUnplacedDuplicates(list.filter(function (e) { return !kill[baseId(e)]; }));
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
