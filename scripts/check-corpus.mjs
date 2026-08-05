// Real-corpus gate. Folds the SHIPPED generated cases through the REAL code
// paths and fails when content the generator actually produces stops being
// renderable. Exits non-zero.
//
// Why this exists (docs/AUDIT-BRIEF.md): invented labels prove nothing.
// "Prepare intubation kit at bedside" drew an endotracheal tube while "Perform
// RSI and secure definitive airway" — how the generator really phrases
// intubation — matched nothing at all. Both only surfaced when real labels went
// through the real resolver. Everything below reads content off disk.
//
// Adding a case: drop the .json in src/lib/scenarios/generated/ and add it to
// CASES. The thresholds are per-corpus, not per-case, so a new case that is
// better than the current floor raises the floor for everyone.
import fs from "fs";
import { createSceneState, scanText, sceneProps } from "../src/components/player/scene3d/resolver.js";
import { realNameFor } from "../src/components/player/scene3d/sceneVocab.js";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../src/lib/scenarios/packs/index.js";
import { guessSys, SYS_ICON, SYSTEM_ORDER } from "../src/components/player/bodySystems.js";
import { tubeForLab } from "../src/lib/scenarios/labTubes.js";
import { medType } from "../src/lib/scenarios/visualMeta.js";
import { parseGCS, isGcsText, gcsProseConflicts } from "../src/lib/scenarios/gcs.js";

// Two corpora, both real generator output:
//   shipped   — the playable built-ins under src/lib/scenarios/generated/
//   fixtures  — cases generated with the CURRENT prompt by
//               scripts/gen-contract-cases.mjs, kept as a regression record of
//               what the prompt produced on the day its contracts were fixed
const CASES = [
  { dir: "../src/lib/scenarios/generated/", files: ["breathing-harder.json", "ten-feet-down.json", "rash-that-wont-blanch.json"] },
  { dir: "./fixtures/", files: ["gen-trauma-tbi.json", "gen-meningococcemia.json", "gen-myocarditis.json", "gen-bronchiolitis.json", "gen-arrest-hyperk.json"] }
];

// Measured floors. Both were 0 before the 2026-08-05 audit fixes; they are now
// at 100% and pinned there, so any regression fails rather than quietly sliding.
const FLOOR = {
  signsWithSys: 1,   // ratio, not a count — 1 means "every sign carries sys"
  gcsBreakdown: 1    // ratio — every GCS finding yields an E/V/M breakdown
};

let failed = 0, passed = 0;
function ok(msg) { passed++; console.log("  PASS  " + msg); }
function bad(msg) { failed++; console.log("  FAIL  " + msg); }
function check(cond, msg) { cond ? ok(msg) : bad(msg); }
const rule = t => console.log("\n" + t + "\n" + "-".repeat(t.length));

const base = () => createSceneState({ ageBand: "C", sexVariant: "v1", paletteSeed: "corpus" });
const resolve = txt => sceneProps(scanText(base(), txt)).accessories.map(a => realNameFor(a.split("@")[0]));

const loaded = [];
CASES.forEach(function (group) {
  group.files.forEach(function (f) {
    const p = new URL(group.dir + f, import.meta.url);
    if (!fs.existsSync(p)) {
      console.error("check-corpus: missing case file " + group.dir + f + " — update CASES in this script.");
      process.exit(2);
    }
    loaded.push({ name: f, shipped: group.dir.indexOf("generated") >= 0, sc: JSON.parse(fs.readFileSync(p, "utf8")) });
  });
});

let signTotal = 0, signWithSys = 0, gcsTotal = 0, gcsParsed = 0, labTotal = 0, actionTotal = 0;
const unregTools = new Set(), unregMeds = new Set(), noIconRoute = new Set(), crossListed = new Set();
const gcsConflicts = [], gcsConflictsFixture = [];
const badSys = [], deadVisuals = [], cbcOutsideCbc = [];

for (const { name, shipped, sc } of loaded) {
  const phases = [].concat(sc.phases || [], sc.curveball ? [sc.curveball] : []);
  for (const ph of phases) {
    for (const s of (ph.signs || [])) {
      signTotal++;
      if (s.sys) signWithSys++;
      const sys = guessSys(s);
      if (!SYS_ICON[sys] || SYSTEM_ORDER.indexOf(sys) < 0) badSys.push(name + " / " + s.label + " -> " + sys);
      const txt = (s.finding || "") + " " + (s.label || "");
      // The REAL parser, imported — a reimplementation here would pass while
      // the shipped breakdown stayed broken.
      if (isGcsText(txt)) {
        gcsTotal++;
        const p = parseGCS(txt);
        if (p.hasParts) gcsParsed++;
        gcsProseConflicts(txt, p).forEach(function (c) {
          // Shipped cases are what a learner plays and must be clean. Fixtures
          // are a RECORD of what the generator produced on a given day — a
          // conflict there is evidence about the model, not a defect in the
          // app, so it is reported rather than failed.
          (shipped ? gcsConflicts : gcsConflictsFixture).push(name + " / " + s.label + ": "
            + c.category + " scored " + c.emitted + " but described as \"" + c.phrase + "\" (= " + c.implied + ")");
        });
      }
    }
    for (const l of (ph.labs || [])) {
      labTotal++;
      const t = tubeForLab(l);
      if (/platelet|h[ae]moglob|\bwbc\b|h[ae]matocrit/i.test(l.name || "") && t.key !== "lavender") {
        cbcOutsideCbc.push(name + " / " + l.name + " -> " + t.panel);
      }
    }
    // An id in the "wrong" collection is NOT a failure: ActionPanel looks the
    // other registry up on purpose (generators regularly file a procedure under
    // meds, or nsBolus under tools) and renders it with a console warning. What
    // must never happen is an id that resolves in NEITHER registry — that is
    // the silent case, where the tile falls back to a raw authored label with
    // no pack, no icon and no colour.
    const acts = ph.actions || {};
    for (const id of Object.keys(acts.tools || {})) {
      actionTotal++;
      if (!ALL_TOOLS[id] && !isCustomTool(id)) {
        if (ALL_MEDS[id]) crossListed.add(name + " / " + id + " (med id in tools)");
        else unregTools.add(name + " / " + id);
      }
    }
    for (const id of Object.keys(acts.meds || {})) {
      actionTotal++;
      if (!ALL_MEDS[id] && !isCustomMed(id)) {
        if (ALL_TOOLS[id]) crossListed.add(name + " / " + id + " (tool id in meds)");
        else unregMeds.add(name + " / " + id);
      }
      if (ALL_MEDS[id] && ["iv", "neb", "oral", "push", "protocol"].indexOf(medType(id)) < 0) noIconRoute.add(id);
    }
  }
  for (const v of (sc.visuals || [])) {
    // A visuals entry is either a keyword (must render) or free prose (may not).
    // Only short entries are treated as keyword claims.
    if (String(v).split(/\s+/).length <= 4 && resolve(v).length === 0) deadVisuals.push(name + " / " + JSON.stringify(v));
  }
}

rule("corpus shape");
console.log("  " + loaded.length + " cases · " + signTotal + " signs · " + labTotal + " labs · " + actionTotal + " actions");

rule("every emitted action id must resolve to a registry entry");
check(unregTools.size === 0, "tool ids all registered" + (unregTools.size ? ": " + [...unregTools].join(", ") : ""));
check(unregMeds.size === 0, "med ids all registered" + (unregMeds.size ? ": " + [...unregMeds].join(", ") : ""));
check(noIconRoute.size === 0, "every med resolves to a MedIcon route" + (noIconRoute.size ? ": " + [...noIconRoute].join(", ") : ""));
if (crossListed.size) {
  console.log("  note  " + crossListed.size + " id(s) filed under the other kind — rendered via ActionPanel's"
    + " cross-registry lookup, not a failure:\n          " + [...crossListed].join("\n          "));
}

rule("every finding must land on a real body system with an icon");
check(badSys.length === 0, "all " + signTotal + " signs route to an ordered system with an icon" + (badSys.length ? ": " + badSys.join("; ") : ""));

rule("short visuals[] entries must render an accessory");
check(deadVisuals.length === 0, "all keyword-shaped visuals resolve" + (deadVisuals.length ? ": " + deadVisuals.join(", ") : ""));

rule("CBC analytes must group under the CBC tube");
check(cbcOutsideCbc.length === 0, "no CBC analyte filed elsewhere" + (cbcOutsideCbc.length ? ": " + cbcOutsideCbc.join(", ") : ""));

rule("GCS components must agree with their own description");
if (gcsConflictsFixture.length) {
  console.log("  note  " + gcsConflictsFixture.length + " conflict(s) in pre-rule FIXTURES (recorded, not failed):\n          "
    + gcsConflictsFixture.join("\n          "));
}
check(gcsConflicts.length === 0,
  "no shipped GCS scored against a contradicting description"
  + (gcsConflicts.length ? ":\n          " + gcsConflicts.join("\n          ") : ""));
if (gcsConflicts.length) {
  console.log("          ^ the app highlights the level the NUMBER selects, right beside the prose.");
  console.log("            A mismatch teaches the wrong pairing. Fix the case text or the score.");
}

rule("contract ratios (pinned at 100% — a drop here is a regression)");
check(signTotal > 0 && signWithSys / signTotal >= FLOOR.signsWithSys,
  "signs carrying the REQUIRED sys field: " + signWithSys + "/" + signTotal);
if (signWithSys < signTotal) {
  console.log("          ^ the prompt marks sys REQUIRED. When it is absent the app falls back to a");
  console.log("            keyword guess over the finding prose, which mis-files findings (a forearm");
  console.log("            fracture whose text said 'guarding the arm' landed under GI/Hydration).");
}
check(gcsTotal > 0 && gcsParsed / gcsTotal >= FLOOR.gcsBreakdown,
  "GCS findings that yield a scoring breakdown: " + gcsParsed + "/" + gcsTotal);
if (gcsParsed < gcsTotal) {
  console.log("          ^ GCS_SCALE is the only implemented scale. A finding that states only a");
  console.log("            total, or spells the components out in words, renders a bare number.");
}

console.log("\n" + "=".repeat(64));
console.log("  " + passed + " passed · " + failed + " failed");
if (failed) {
  console.log("\n  Real generated content stopped rendering. Fix the render side, the");
  console.log("  prompt, or the FLOOR in this file — but do not delete the assertion.");
  process.exit(1);
}
console.log("  Shipped generated content still renders end to end.\n");
