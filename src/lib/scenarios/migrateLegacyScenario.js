// Runtime migration: upgrades scenarios authored against the legacy
// flat-assessItems schema (Phase 5.4.3a) or the typed-collection
// schema with vitals-as-object (Phase 5.4.3a output, still legacy
// relative to Phase 6.1) into the schema 5.4.1 shape the player now
// consumes natively.
//
// Invoked from two chokepoints:
//   - client.js applyPostParseFixups()  — fresh AI generations from the
//     legacy buildSystemPrompt() (until Phase 6.2 wires the orchestrator
//     prompt that emits 5.4.1-shaped output directly)
//   - scenariosStore hydrate()          — saved customs in localStorage
//     that were generated before the latest migration shipped
//
// The transformation logic mirrors scripts/migrate-builtins.mjs, which
// was used as a one-shot during the Phase 5.4.3a built-in cleanup.
// Anything beyond the one-shot's coverage (vitals-as-array, string
// priority enum, debrief.keyTeaching) is layered on top here.
//
// Idempotent: every transformation step checks for the new-shape
// marker before running, so a fully-migrated scenario passes through
// unchanged. This matters because three caller categories pass
// scenarios through:
//   - Fresh legacy AI output (assessItems present, vitals object,
//     numeric pri).
//   - SC1-SC6 built-ins (no assessItems, vitals object, numeric pri,
//     legacy explainers[]).
//   - Orchestrator-shaped scenarios (Phase 6.2 onward — already
//     vitals-array, string priority, keyTeaching populated).
//   All three must yield consistent new-shape output.
//
// Pure for the legacy → new transitions: returns a structurally fresh
// scenario object for changed subtrees. Already-new subtrees pass
// through by reference (no copy).

var VITAL_LABELS = {
  hr: "HR", rr: "RR", sbp: "BP", dbp: "BP",
  spo2: "SpO2", temp: "Temp", cap: "Cap Refill"
};
var VITAL_UNITS = {
  hr: "bpm", rr: "/min", sbp: "mmHg", dbp: "mmHg",
  spo2: "%", temp: "C", cap: "sec"
};
// Stable order in which array-shaped vitals are emitted. Mirrors the
// keys the orchestrator prompt design lists as canonical. Any vital
// key outside this list is appended after, in insertion order.
var VITAL_ORDER = ["hr", "rr", "sbp", "dbp", "spo2", "temp", "cap"];

function vitalKeyForLabel(label) {
  var l = (label || "").toLowerCase();
  if (l.indexOf("hr") === 0 || l.indexOf("heart rate") >= 0) return "hr";
  if (l.indexOf("spo2") === 0 || l.indexOf("sat") >= 0 || l.indexOf("o2") === 0) return "spo2";
  if (l.indexOf("rr") === 0 || l.indexOf("resp") >= 0) return "rr";
  if (l.indexOf("sbp") === 0) return "sbp";
  if (l.indexOf("dbp") === 0) return "dbp";
  if (l.indexOf("bp") === 0 || l.indexOf("blood pressure") >= 0) return "sbp";
  if (l.indexOf("temp") >= 0) return "temp";
  if (l.indexOf("cap") >= 0) return "cap";
  return null;
}

function kebab(s) {
  return String(s || "").trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Phase 6.1: translate the legacy numeric pri / boolean ok shape into
// the schema 5.4.1 string priority enum. Heuristic for distractors
// defaults to "distractor-clinical" — a precise pack-membership check
// would require importing the pack registry; the spec explicitly
// permits the simpler default here because the priority enum is only
// consumed downstream for sort order, and Phase 6.2's orchestrator
// will emit the enum natively, retiring this translation.
function _priorityFromLegacy(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.ok === true) {
    var n = entry.pri;
    if (n === 1 || n === 2) return "correct";
    if (typeof n === "number" && n >= 3) return "tied-correct";
    // pri:null on a correct action means "supplementary correct" in
    // the built-ins (e.g., stethoscope alongside ivKit). Treat as
    // correct — the user picked something that helps the case.
    return "correct";
  }
  return "distractor-clinical";
}

// Canonical numeric rank for each string priority enum value.
// Used to backfill the legacy `.pri` field on every action entry so
// pre-Phase-6.1 reads of `info.pri` keep working without per-call-site
// changes (Debrief.jsx sort, ScenarioPlayer correctActions sort, etc.).
var PRIORITY_RANK = {
  "correct": 1,
  "tied-correct": 2,
  "distractor-clinical": 3,
  "distractor-pack": 4,
  "distractor-misc": 5
};

// Rebuild an actions sub-collection (tools or meds) with the
// schema 5.4.1 fields filled in: id, label, priority (string),
// _slotRef, fb, ok. Preserves any extra fields the source carries.
// Idempotent: if an entry already has a string `priority`, leave it.
function _normalizeActionMap(entries, phaseIdxLabel, subKey) {
  if (!entries || typeof entries !== "object") return entries;
  var out = {};
  Object.keys(entries).forEach(function (id) {
    var src = entries[id];
    if (!src || typeof src !== "object") { out[id] = src; return; }
    var hasStringPriority = typeof src.priority === "string";
    var priority = hasStringPriority ? src.priority : _priorityFromLegacy(src);
    var slotRef = src._slotRef || ("phase[" + phaseIdxLabel + "].actions." + subKey + "." + id + ".fb");
    // Derive ok from priority when missing; preserve when present.
    var ok = (typeof src.ok === "boolean")
      ? src.ok
      : (priority === "correct" || priority === "tied-correct");
    var copy = Object.assign({}, src);
    copy.id = src.id || id;
    if (src.label) copy.label = src.label;
    copy.priority = priority;
    // Backfill the legacy numeric `.pri` field from the string enum so
    // pre-Phase-6.1 reads (Debrief sort, ScenarioPlayer correctActions
    // sort, popup priority badge) keep working without per-call-site
    // changes. Only backfill when `pri` is missing entirely (true for
    // future orchestrator output). Built-ins carry an explicit `pri:
    // null` to mark "supplementary correct, no rank" — preserve that
    // null so the recovery-screen ranking stays unchanged.
    if (!Object.prototype.hasOwnProperty.call(src, "pri")) {
      copy.pri = PRIORITY_RANK[priority] || null;
    }
    copy._slotRef = slotRef;
    copy.fb = (typeof src.fb === "string" || src.fb === null) ? src.fb : (src.fb || null);
    copy.ok = ok;
    out[id] = copy;
  });
  return out;
}

// Convert vitals from object form to array form. Preserves the rich
// fields populated by Phase 5.4.3a's typed-collection migration and
// fills in any missing canonical fields. Idempotent: array input
// returns unchanged.
function _vitalsObjectToArray(vitalsObj, phaseIdxLabel) {
  if (!vitalsObj || typeof vitalsObj !== "object") return vitalsObj;
  if (Array.isArray(vitalsObj)) return vitalsObj;
  var keys = Object.keys(vitalsObj);
  // Emit in canonical order first, then any extras in insertion order.
  var orderedKeys = [];
  VITAL_ORDER.forEach(function (k) { if (keys.indexOf(k) >= 0) orderedKeys.push(k); });
  keys.forEach(function (k) { if (orderedKeys.indexOf(k) < 0) orderedKeys.push(k); });
  var out = [];
  orderedKeys.forEach(function (vk) {
    var src = vitalsObj[vk];
    if (src == null) return;
    if (typeof src === "object" && Object.prototype.hasOwnProperty.call(src, "value")) {
      var copy = Object.assign({}, src);
      copy.id = src.id || vk;
      copy.label = src.label || VITAL_LABELS[vk] || vk.toUpperCase();
      copy.unit = src.unit || VITAL_UNITS[vk] || "";
      copy.bad = !!src.bad;
      copy.cat = src.cat || "vital";
      copy._slotRef = src._slotRef || ("phase[" + phaseIdxLabel + "].vitals." + vk + ".why");
      copy.why = (src.why === undefined) ? null : src.why;
      out.push(copy);
    } else {
      // Scalar legacy value — wrap it as a rich object.
      out.push({
        id: vk,
        label: VITAL_LABELS[vk] || vk.toUpperCase(),
        value: String(src),
        unit: VITAL_UNITS[vk] || "",
        bad: false,
        cat: "vital",
        _slotRef: "phase[" + phaseIdxLabel + "].vitals." + vk + ".why",
        why: null
      });
    }
  });
  return out;
}

function migratePhase(phase, phaseIdxLabel) {
  if (!phase) return phase;
  // Always run the field-level enrichment even when no assessItems[]
  // array is present — some legacy phases (e.g. SC1/SC2/SC3 curveballs)
  // carried scalar vitals and id-less signs/labs without ever having an
  // assessItems sibling. The per-field idempotency checks below
  // (hasOwnProperty "value", s.id truthy) make this safe to run twice.
  var aiArr = Array.isArray(phase.assessItems) ? phase.assessItems : [];
  var byVitalKey = {};
  var byLabName = {};
  var bySignLabel = {};

  aiArr.forEach(function (it) {
    if (!it) return;
    if (it.cat === "vital") {
      var vk = vitalKeyForLabel(it.label);
      if (vk) byVitalKey[vk] = it;
    } else if (it.cat === "lab" && Array.isArray(phase.labs)) {
      var lblLower = (it.label || "").toLowerCase();
      var lab = phase.labs.find(function (l) { return l && l.name && lblLower.indexOf(l.name.toLowerCase()) >= 0; });
      if (lab) byLabName[lab.name.toLowerCase()] = it;
    } else if (it.cat === "clinical" && Array.isArray(phase.signs)) {
      var key = (it.label || "").toLowerCase().trim();
      var matched = phase.signs.find(function (s) { return s && s.label && s.label.toLowerCase().trim() === key; });
      if (!matched) {
        matched = phase.signs.find(function (s) {
          if (!s || !s.label) return false;
          var sl = s.label.toLowerCase().trim();
          return sl.indexOf(key) >= 0 || key.indexOf(sl) >= 0;
        });
      }
      if (matched) bySignLabel[matched.label.toLowerCase()] = it;
    }
  });

  // Step 1: vitals enrichment (object stays object at this stage; the
  // object → array conversion is the very last step in this function).
  var newVitals = phase.vitals;
  if (phase.vitals && typeof phase.vitals === "object" && !Array.isArray(phase.vitals)) {
    var enriched = {};
    Object.keys(phase.vitals).forEach(function (vk) {
      var raw = phase.vitals[vk];
      if (raw && typeof raw === "object" && Object.prototype.hasOwnProperty.call(raw, "value")) {
        enriched[vk] = raw;
        return;
      }
      var ai = byVitalKey[vk];
      var label = VITAL_LABELS[vk] || vk.toUpperCase();
      var unit = VITAL_UNITS[vk] || "";
      var value = String(raw);
      enriched[vk] = {
        id: vk,
        label: label,
        value: value,
        unit: unit,
        bad: ai ? !!ai.bad : false,
        cat: "vital",
        _slotRef: "phase[" + phaseIdxLabel + "].vitals." + vk + ".why",
        why: ai ? (ai.why || null) : null
      };
    });
    newVitals = enriched;
  }

  var newSigns = Array.isArray(phase.signs) ? phase.signs.map(function (s) {
    if (!s) return s;
    var ai = bySignLabel[(s.label || "").toLowerCase()];
    var id = s.id || kebab(s.label);
    var out = {
      id: id,
      label: s.label,
      finding: s.finding,
      pos: s.pos
    };
    if (s.sys) out.sys = s.sys;
    out.bad = ai ? !!ai.bad : !!s.bad;
    var why = s.why || (ai && ai.why);
    if (why) out.why = why;
    else if (!Object.prototype.hasOwnProperty.call(s, "why")) out.why = null;
    out.cat = s.cat || "clinical";
    out._slotRef = s._slotRef || ("phase[" + phaseIdxLabel + "].signs." + id + ".why");
    return out;
  }) : phase.signs;

  var newLabs = Array.isArray(phase.labs) ? phase.labs.map(function (l) {
    if (!l) return l;
    var ai = byLabName[(l.name || "").toLowerCase()];
    var id = l.id || kebab(l.name);
    var out = {
      id: id,
      name: l.name,
      value: l.value,
      unit: l.unit,
      ref: l.ref,
      critical: !!l.critical,
      bad: ai ? !!ai.bad : !!l.bad
    };
    var why = l.why || (ai && ai.why);
    if (why) out.why = why;
    else if (!Object.prototype.hasOwnProperty.call(l, "why")) out.why = null;
    out.cat = l.cat || "lab";
    out._slotRef = l._slotRef || ("phase[" + phaseIdxLabel + "].labs." + id + ".why");
    return out;
  }) : phase.labs;

  // Step 2: actions — normalize each entry to carry the string
  // priority enum, slotRef, and derived ok.
  var newActions = phase.actions;
  if (phase.actions && typeof phase.actions === "object") {
    newActions = Object.assign({}, phase.actions);
    if (phase.actions.tools) newActions.tools = _normalizeActionMap(phase.actions.tools, phaseIdxLabel, "tools");
    if (phase.actions.meds) newActions.meds = _normalizeActionMap(phase.actions.meds, phaseIdxLabel, "meds");
  }

  // Step 3: convert the vitals object → array as the final phase step.
  var newVitalsArray = _vitalsObjectToArray(newVitals, phaseIdxLabel);

  var out = {};
  Object.keys(phase).forEach(function (k) {
    if (k === "assessItems") return;
    // Phase 6.1: drop the top-level tools[]/meds[] id arrays — the
    // player now derives them from Object.keys(actions.tools/meds).
    if (k === "tools" || k === "meds") return;
    if (k === "vitals") out.vitals = newVitalsArray;
    else if (k === "signs") out.signs = newSigns;
    else if (k === "labs") out.labs = newLabs;
    else if (k === "actions") out.actions = newActions;
    else out[k] = phase[k];
  });
  return out;
}

// Synthesize debrief.keyTeaching[] from legacy debrief.explainers[]
// when keyTeaching is missing. One bullet per explainer; the bullet
// is the explainer title (already a one-sentence-ish teaching point).
// Phase 6.2 will have the orchestrator emit keyTeaching directly,
// retiring this synthesis path.
function _migrateDebrief(debrief) {
  if (!debrief || typeof debrief !== "object") return debrief;
  if (Array.isArray(debrief.keyTeaching)) return debrief;
  if (!Array.isArray(debrief.explainers) || debrief.explainers.length === 0) return debrief;
  var copy = Object.assign({}, debrief);
  copy.keyTeaching = debrief.explainers
    .map(function (e) { return e && e.title ? String(e.title).trim() : ""; })
    .filter(function (s) { return s.length > 0; });
  return copy;
}

// Top-level entry. Always runs the per-step idempotency checks rather
// than a single up-front "is this already migrated?" gate — built-ins
// have no assessItems[] yet still need vitals → array, pri → priority,
// and keyTeaching synthesis.
export function migrateLegacyScenario(sc) {
  if (!sc || typeof sc !== "object") return sc;

  var out = Object.assign({}, sc);
  if (Array.isArray(sc.phases)) {
    out.phases = sc.phases.map(function (p, i) { return migratePhase(p, String(i)); });
  }
  if (sc.curveball) {
    out.curveball = migratePhase(sc.curveball, "curveball");
  }
  if (sc.debrief) {
    out.debrief = _migrateDebrief(sc.debrief);
  }
  return out;
}
