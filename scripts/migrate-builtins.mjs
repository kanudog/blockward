// One-shot migration script: rewrites src/lib/scenarios/builtIn.js to
// schema 5.4.1 shape (rich vitals object, id-keyed signs/labs,
// assessItems removed). Run once and discard.
//
// Usage: node scripts/migrate-builtins.mjs
//
// Imports the current builtIn.js module, applies the migration to each
// scenario in-memory, then writes back. The output uses a custom
// serializer that mirrors the existing unquoted-key JS-object style.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BUILTIN_PATH = resolve(ROOT, "src/lib/scenarios/builtIn.js");

const SCENARIO_NAMES = ["SC1", "SC2", "SC3", "SC4", "SC5", "SC6"];

const mod = await import(BUILTIN_PATH);

const VITAL_LABELS = {
  hr: "HR", rr: "RR", sbp: "BP", dbp: "BP",
  spo2: "SpO2", temp: "Temp", cap: "Cap Refill"
};
const VITAL_UNITS = {
  hr: "bpm", rr: "/min", sbp: "mmHg", dbp: "mmHg",
  spo2: "%", temp: "C", cap: "sec"
};

function vitalKeyForLabel(label) {
  const l = (label || "").toLowerCase();
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

// The raw numeric value from phase.vitals[vk] is the source-of-truth.
// The assessItem label (e.g. "SpO2 98%", "BP 72/45") is for display
// pedagogy only — the canonical value lives on the vitals object.

function migratePhase(phase, phaseIdxLabel) {
  if (!phase) return phase;
  const aiArr = Array.isArray(phase.assessItems) ? phase.assessItems : [];
  const byVitalKey = {};
  const byLabName = {};
  const bySignLabel = {};

  aiArr.forEach(it => {
    if (!it) return;
    if (it.cat === "vital") {
      const vk = vitalKeyForLabel(it.label);
      if (vk) byVitalKey[vk] = it;
    } else if (it.cat === "lab" && Array.isArray(phase.labs)) {
      const lblLower = (it.label || "").toLowerCase();
      const lab = phase.labs.find(l => l && l.name && lblLower.indexOf(l.name.toLowerCase()) >= 0);
      if (lab) byLabName[lab.name.toLowerCase()] = it;
    } else if (it.cat === "clinical" && Array.isArray(phase.signs)) {
      const key = (it.label || "").toLowerCase().trim();
      let matched = phase.signs.find(s => s && s.label && s.label.toLowerCase().trim() === key);
      if (!matched) {
        matched = phase.signs.find(s => {
          if (!s || !s.label) return false;
          const sl = s.label.toLowerCase().trim();
          return sl.indexOf(key) >= 0 || key.indexOf(sl) >= 0;
        });
      }
      if (matched) bySignLabel[matched.label.toLowerCase()] = it;
    }
  });

  const newVitals = {};
  if (phase.vitals && typeof phase.vitals === "object") {
    Object.keys(phase.vitals).forEach(vk => {
      const raw = phase.vitals[vk];
      if (raw && typeof raw === "object" && "value" in raw) {
        newVitals[vk] = raw;
        return;
      }
      const ai = byVitalKey[vk];
      const label = VITAL_LABELS[vk] || vk.toUpperCase();
      const unit = VITAL_UNITS[vk] || "";
      const value = String(raw);
      const slotRef = `phase[${phaseIdxLabel}].vitals.${vk}.why`;
      const entry = {
        id: vk,
        label: label,
        value: value,
        unit: unit,
        bad: ai ? !!ai.bad : false,
        _slotRef: slotRef,
        why: ai ? (ai.why || null) : null
      };
      newVitals[vk] = entry;
    });
  }

  const newSigns = Array.isArray(phase.signs) ? phase.signs.map(s => {
    if (!s) return s;
    const ai = bySignLabel[(s.label || "").toLowerCase()];
    const id = s.id || kebab(s.label);
    const out = {
      id,
      label: s.label,
      finding: s.finding,
      pos: s.pos
    };
    if (s.sys) out.sys = s.sys;
    out.bad = ai ? !!ai.bad : !!s.bad;
    const why = s.why || (ai && ai.why);
    if (why) out.why = why;
    out._slotRef = `phase[${phaseIdxLabel}].signs.${id}.why`;
    return out;
  }) : phase.signs;

  const newLabs = Array.isArray(phase.labs) ? phase.labs.map(l => {
    if (!l) return l;
    const ai = byLabName[(l.name || "").toLowerCase()];
    const id = l.id || kebab(l.name);
    const out = {
      id,
      name: l.name,
      value: l.value,
      unit: l.unit,
      ref: l.ref,
      critical: !!l.critical,
      bad: ai ? !!ai.bad : !!l.bad
    };
    const why = l.why || (ai && ai.why);
    if (why) out.why = why;
    out._slotRef = `phase[${phaseIdxLabel}].labs.${id}.why`;
    return out;
  }) : phase.labs;

  const out = {};
  Object.keys(phase).forEach(k => {
    if (k === "assessItems") return;
    if (k === "vitals") out.vitals = newVitals;
    else if (k === "signs") out.signs = newSigns;
    else if (k === "labs") out.labs = newLabs;
    else out[k] = phase[k];
  });
  return out;
}

// Custom serializer producing JS-friendly source with unquoted
// identifier keys.
function isIdent(s) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s);
}

function serialize(val, indent) {
  const pad = "  ".repeat(indent);
  const next = "  ".repeat(indent + 1);
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return JSON.stringify(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    return "[\n" + val.map(v => next + serialize(v, indent + 1)).join(",\n") + "\n" + pad + "]";
  }
  if (typeof val === "object") {
    const keys = Object.keys(val);
    if (keys.length === 0) return "{}";
    const parts = keys.map(k => {
      const keyStr = isIdent(k) ? k : JSON.stringify(k);
      return next + keyStr + ": " + serialize(val[k], indent + 1);
    });
    return "{\n" + parts.join(",\n") + "\n" + pad + "}";
  }
  return JSON.stringify(val);
}

const migrated = {};
const stats = { scenarios: 0, phases: 0, vitalsRich: 0, signsWithId: 0, labsWithId: 0, assessItemsDropped: 0 };

for (const name of SCENARIO_NAMES) {
  const sc = mod[name];
  if (!sc) {
    console.warn(`Missing scenario: ${name}`);
    continue;
  }
  stats.scenarios++;
  // Deep clone via JSON to fully detach from the imported module.
  const clone = JSON.parse(JSON.stringify(sc));

  if (Array.isArray(clone.phases)) {
    clone.phases.forEach((p, i) => {
      if (Array.isArray(p.assessItems)) stats.assessItemsDropped += p.assessItems.length;
      const migrated = migratePhase(p, String(i));
      stats.phases++;
      if (migrated.vitals) stats.vitalsRich += Object.keys(migrated.vitals).length;
      if (Array.isArray(migrated.signs)) stats.signsWithId += migrated.signs.length;
      if (Array.isArray(migrated.labs)) stats.labsWithId += migrated.labs.length;
      clone.phases[i] = migrated;
    });
  }
  if (clone.curveball) {
    if (Array.isArray(clone.curveball.assessItems)) stats.assessItemsDropped += clone.curveball.assessItems.length;
    clone.curveball = migratePhase(clone.curveball, "curveball");
  }
  migrated[name] = clone;
}

const header = `// Phase-4b: TOOLS and MEDS objects removed. The pack registry in
// src/lib/scenarios/packs/ + visualMeta.js now hold display metadata.
// Renderers look up labels via ALL_TOOLS / ALL_MEDS, icons via ToolIcon
// (id-keyed), and color/medType via medColor/medType helpers.
//
// Phase-5.4.3a: assessItems removed. vitals are keyed rich objects per
// schema 5.4.1; signs and labs gained .id and ._slotRef fields. bad/why
// metadata was migrated from the legacy assessItems into the typed
// collections during the one-shot Phase 5.4.3a built-in rewrite.
`;

const body = SCENARIO_NAMES
  .filter(n => migrated[n])
  .map(n => `\nexport var ${n} = ${serialize(migrated[n], 0)};\n`)
  .join("");

await writeFile(BUILTIN_PATH, header + body, "utf8");

console.log("Migration complete:", JSON.stringify(stats, null, 2));
console.log(`Wrote ${BUILTIN_PATH}`);
