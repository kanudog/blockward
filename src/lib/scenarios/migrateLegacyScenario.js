// Phase-5.4.3a runtime migration: upgrades scenarios authored against
// the legacy flat-assessItems schema into schema 5.4.1 shape.
//
// Invoked from two chokepoints:
//   - client.js applyPostParseFixups()  — fresh AI generations from the
//     legacy buildSystemPrompt() (until Phase 5.4.4 wires in the
//     orchestrator prompt that emits 5.4.1-shaped output directly)
//   - scenariosStore hydrate()          — saved customs in localStorage
//     that were generated before this migration shipped
//
// The transformation logic mirrors scripts/migrate-builtins.mjs, which
// was used as a one-shot during the Phase 5.4.3a built-in cleanup. Both
// must stay in lockstep — the same legacy scenario must produce the
// same output through either path.
//
// Idempotent: if no phase carries an assessItems[] array, the scenario
// is already 5.4.1-shaped and is returned unchanged.
//
// Pure: the input scenario is not mutated. Returns a structurally fresh
// scenario object (deep clone of unchanged subtrees, new objects for
// migrated subtrees).

var VITAL_LABELS = {
  hr: "HR", rr: "RR", sbp: "BP", dbp: "BP",
  spo2: "SpO2", temp: "Temp", cap: "Cap Refill"
};
var VITAL_UNITS = {
  hr: "bpm", rr: "/min", sbp: "mmHg", dbp: "mmHg",
  spo2: "%", temp: "C", cap: "sec"
};

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

  var newVitals = {};
  if (phase.vitals && typeof phase.vitals === "object") {
    Object.keys(phase.vitals).forEach(function (vk) {
      var raw = phase.vitals[vk];
      // Already-rich entries pass through unchanged. Detection: object
      // shape with a .value field (the canonical 5.4.1 marker).
      if (raw && typeof raw === "object" && Object.prototype.hasOwnProperty.call(raw, "value")) {
        newVitals[vk] = raw;
        return;
      }
      var ai = byVitalKey[vk];
      var label = VITAL_LABELS[vk] || vk.toUpperCase();
      var unit = VITAL_UNITS[vk] || "";
      var value = String(raw);
      newVitals[vk] = {
        id: vk,
        label: label,
        value: value,
        unit: unit,
        bad: ai ? !!ai.bad : false,
        _slotRef: "phase[" + phaseIdxLabel + "].vitals." + vk + ".why",
        why: ai ? (ai.why || null) : null
      };
    });
  } else {
    newVitals = phase.vitals;
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
    out._slotRef = "phase[" + phaseIdxLabel + "].signs." + id + ".why";
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
    out._slotRef = "phase[" + phaseIdxLabel + "].labs." + id + ".why";
    return out;
  }) : phase.labs;

  var out = {};
  Object.keys(phase).forEach(function (k) {
    if (k === "assessItems") return;
    if (k === "vitals") out.vitals = newVitals;
    else if (k === "signs") out.signs = newSigns;
    else if (k === "labs") out.labs = newLabs;
    else out[k] = phase[k];
  });
  return out;
}

export function migrateLegacyScenario(sc) {
  if (!sc || typeof sc !== "object") return sc;
  // Idempotency check: a 5.4.1-shaped scenario has no assessItems[]
  // arrays anywhere. Walk phases + curveball before deciding to clone.
  var legacy = false;
  if (Array.isArray(sc.phases)) {
    for (var i = 0; i < sc.phases.length; i++) {
      if (Array.isArray(sc.phases[i] && sc.phases[i].assessItems)) { legacy = true; break; }
    }
  }
  if (!legacy && sc.curveball && Array.isArray(sc.curveball.assessItems)) legacy = true;
  if (!legacy) return sc;

  var out = Object.assign({}, sc);
  if (Array.isArray(sc.phases)) {
    out.phases = sc.phases.map(function (p, i) { return migratePhase(p, String(i)); });
  }
  if (sc.curveball) {
    out.curveball = migratePhase(sc.curveball, "curveball");
  }
  return out;
}
