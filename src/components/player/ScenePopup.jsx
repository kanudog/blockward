// [SCENE POPUP] The hideable, tap-to-open bedside scene, derived ENTIRELY from
// what the run has shown so far (the same pure fold SceneStage uses). Nothing
// is pushed anywhere: the scene state is a pure fold of resolver calls over
// store state + the case, recomputed on render.
//
// SCOPED after the 2D->3D replacement: the 3D scene is inline on every stage
// that has room for it, so the popup only appears on the plan-building stages
// that DON'T show an inline scene (act, cb-act) — there it's the one way to
// glance at the room. Everywhere else it would just duplicate the scene already
// on screen, so it stays hidden.
//
// three.js stays lazy: SceneView is React.lazy and only renders while the sheet
// is open, so the chunk loads on first open.
import { useState, lazy, Suspense } from "react";
import { Armchair, X } from "lucide-react";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { sceneProps } from "./scene3d/resolver.js";
import { buildRunSceneState, runSeed, caseBand, caseVariant } from "./scene3d/runSceneState.js";

var SceneView = lazy(function () { return import("./scene3d/SceneView.jsx"); });

// Stages with no inline SceneStage — the only ones where the popup adds
// something. Keep in sync with the mounts in ScenarioPlayer.
var POPUP_STAGES = { act: true, "cb-act": true };

function rateFrom(vit) {
  if (!vit || vit.rr == null) return 0;
  var r = typeof vit.rr === "object" ? parseFloat(vit.rr.value) : parseFloat(vit.rr);
  return isNaN(r) ? 0 : r;
}

export function ScenePopup(props) {
  var t = useTokens();
  var sc = props.sc;
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  var pi = usePlayerStore(function (s) { return s.phaseIndex; });
  var stage = usePlayerStore(function (s) { return s.stage; });
  var actionHistory = usePlayerStore(function (s) { return s.actionHistory; });
  var cbDone = usePlayerStore(function (s) { return s.cbDone; });
  var vit = usePlayerStore(function (s) { return s.vitals; });
  if (!sc || !sc.patient) return null;
  if (!POPUP_STAGES[stage]) return null;
  var pill = (<button className="bw-tap" onClick={function () { setOpen(!open); }} aria-label="Open the bedside scene"
    style={{ position: "fixed", left: 14, bottom: 14, zIndex: 900, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 999, border: "1px solid " + t.COLOR.hairline, background: t.COLOR.btnNeutralBg, color: t.COLOR.ink2, fontSize: 12, fontWeight: 700, fontFamily: t.FONT.body, cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
    <Armchair size={13} color={t.COLOR.accent}/>
    Bedside
  </button>);
  if (!open) return pill;
  var st = buildRunSceneState(sc, { pi: pi, stage: stage, actionHistory: actionHistory, cbDone: cbDone });
  var p = sceneProps(st);
  var rate = rateFrom(vit);
  return (<div>
    {pill}
    <div onClick={function () { setOpen(false); }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 960, background: "rgba(15,18,21,0.45)" }}>
      <div onClick={function (e) { e.stopPropagation(); }}
        style={Object.assign({}, t.surface("pop"), { position: "absolute", left: 0, right: 0, bottom: 0, borderRadius: "18px 18px 0 0", padding: "14px 16px 18px", fontFamily: t.FONT.body })}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={t.label()}>Bedside scene</div>
            <div style={{ fontSize: 12, color: t.COLOR.ink3, marginTop: 2 }}>Built from what the case has told you so far.</div>
          </div>
          <button className="bw-tap" onClick={function () { setOpen(false); }} aria-label="Close"
            style={{ width: 30, height: 30, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.COLOR.btnNeutralBg, border: "1px solid " + t.COLOR.hairline, color: t.COLOR.ink3, cursor: "pointer", padding: 0 }}>
            <X size={14}/>
          </button>
        </div>
        <div style={Object.assign({}, t.stage(), { padding: 8 })}>
          <Suspense fallback={<div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: t.COLOR.ink3 }}>Setting the room…</div>}>
            <SceneView ageBand={caseBand(sc)} sexVariant={caseVariant(sc)}
              paletteSeed={runSeed(sc)}
              pose={p.pose} accessories={p.accessories} companion={p.companion}
              faceEyes={p.faceEyes} faceMouth={p.faceMouth}
              cycleRate={rate && rate > 0 ? rate : 28}
              scene={t.SCENE} height={320}/>
          </Suspense>
        </div>
        <div style={{ fontSize: 11, color: t.COLOR.ink3, lineHeight: 1.5, marginTop: 8 }}>
          Reopen anytime — the room keeps up with the run: supports appear as they're mentioned, each give hangs another pouch, and brought items land on the table.
        </div>
      </div>
    </div>
  </div>);
}
