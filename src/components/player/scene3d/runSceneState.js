// [SCENE3D RUN STATE] The run->scene fold shared by every inline scene surface
// (SceneStage) and the bedside popup (ScenePopup). One pure function: the
// (real) case + a snapshot of run progress in, AvatarSceneState out — nothing
// is pushed to the store, everything recomputes from what the run has shown so
// far:
//
//   case visuals (prose) -> opening report -> each phase's narrative + findings
//   -> every committed intervention (each give adds a stand pouch)
//   -> the curveball -> the re-check -> stabilize() at recovery AND debrief.
//
// De-sanitized for the real case shape: patient (not subject), emsReport /
// presentation.report (not briefReport), phase.signs[].finding (not
// indicators[].observation), reassessment (not reevaluation), real stage ids
// (assess/reassess/recovery/debrief). Age band + figure variant are DERIVED
// from the real ageLabel / sex via age.js (there is no ageBand field).
//
// THREE-free (imports the resolver + age.js only) — safe outside the lazy 3D
// chunk.
import {
  createSceneState, scanText, applyIntervention, stabilize
} from "./resolver.js";
import { guessAge, guessSex } from "../../../lib/scenarios/age.js";

var AGE_BAND = { infant: "A", toddler: "B", child: "C", teen: "D" };
var SEX_VARIANT = { male: "v1", female: "v2", neutral: "neutral" };

// Real ageLabel/sex -> the figure's generic band/variant contract.
export function caseBand(sc) { return AGE_BAND[guessAge(sc)] || "B"; }
export function caseVariant(sc) { return SEX_VARIANT[guessSex(sc)] || "neutral"; }

// One seed per case: the figure's look matches across every surface.
export function runSeed(sc) {
  var p = sc && sc.patient ? (sc.patient.name || sc.patient.ageLabel || "") : "";
  return (sc && sc.id ? sc.id : "case") + "·" + p;
}

// The opening prose the intro report is built from (real field names, with
// legacy + 5.4.1 fallbacks).
function openingText(sc) {
  var cc = sc.patient && sc.patient.cc ? sc.patient.cc : "";
  var report = sc.emsReport
    || (sc.presentation && sc.presentation.report)
    || (sc.patient && sc.patient.history)
    || "";
  return cc + ". " + report;
}

function scanFindings(st, coll) {
  (coll || []).forEach(function (s) {
    if (!s) return;
    st = scanText(st, s.finding || s.observation || s.label || "");
  });
  return st;
}

// buildRunSceneState(sc, snap) -> AvatarSceneState
//   snap: { pi, stage, actionHistory, cbDone }
export function buildRunSceneState(sc, snap) {
  var st = createSceneState({
    ageBand: caseBand(sc),
    sexVariant: caseVariant(sc),
    paletteSeed: runSeed(sc)
  });
  // The case's visuals are REAL prose sentences (e.g. "nasal cannula tubing in
  // place") — scan each through the same real-vocab resolver.
  (sc.visuals || []).forEach(function (v) { st = scanText(st, v); });
  st = scanText(st, openingText(sc));
  var i;
  for (i = 0; i <= snap.pi && sc.phases && i < sc.phases.length; i++) {
    var ph = sc.phases[i];
    if (!ph) continue;
    st = scanText(st, ph.narrative || "");
    st = scanFindings(st, ph.signs);
  }
  (snap.actionHistory || []).forEach(function (hist) {
    if (!hist) return;
    ["tools", "meds"].forEach(function (kind) {
      var coll = (hist.actions && hist.actions[kind]) || {};
      Object.keys(coll).forEach(function (id) {
        if (!hist.sel || !hist.sel[id]) return;
        var label = coll[id].label || id;
        // every committed give (meds collection) hangs one more pouch — the
        // DIRECTION §4 accumulation rule mapped onto the run's shape. Tools
        // scan for equipment (a cannula, a collar) without forcing a pouch,
        // and anything a tool brings that we cannot draw on the patient is
        // staged on the side table (the id tells the resolver which tools are
        // decisions rather than objects).
        st = kind === "meds"
          ? applyIntervention(st, "Give " + label + ".", { id: id, kind: "meds" })
          : applyIntervention(st, label, { id: id, kind: "tools" });
      });
    });
  });
  if (snap.cbDone && sc.curveball) {
    st = scanText(st, sc.curveball.narrative || "");
    st = scanFindings(st, sc.curveball.signs);
  }
  var settled = snap.stage === "reassess" || snap.stage === "recovery" || snap.stage === "debrief";
  if (settled && sc.reassessment) {
    st = scanText(st, sc.reassessment.narrative || "");
  }
  // The final beat is ALWAYS celebrate — on the stabilized screen and carried
  // into the debrief.
  if (snap.stage === "recovery" || snap.stage === "debrief") st = stabilize(st);
  return st;
}
