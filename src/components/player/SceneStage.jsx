// [SCENE STAGE] The inline 3D scene block — the run's figure surface after the
// 2D->3D replacement: intro, update, the examine overview, interlude, event
// wait/alert, re-check, stabilized, and debrief all show the room through this.
// The scene state is the SAME pure fold the bedside popup uses
// (scene3d/runSceneState.js) — narrative + findings + committed interventions
// in, AvatarSceneState out. The 2D layer survives only inside the examine
// popups' vignette illustrations.
//
// three.js stays lazy: SceneView is React.lazy, so the chunk loads the first
// time a scene is actually on screen.
//
// Props: sc (the real case) · height · framing "room"|"figure" (SceneView crop)
//        · bare (skip the stage() wrapper when the caller already sits on one,
//          e.g. the examine centerpiece) · style (wrapper overrides)
import { lazy, Suspense } from "react";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { buildRunSceneState, runSeed, caseBand, caseVariant } from "./scene3d/runSceneState.js";
import { sceneProps } from "./scene3d/resolver.js";

var SceneView = lazy(function () { return import("./scene3d/SceneView.jsx"); });

// Read the breathing rate (RR) from the live vitals snapshot; drives the idle
// cycle bob. Real vitals are keyed by id with rich {value,unit,bad} entries.
function rateFrom(vit) {
  if (!vit || vit.rr == null) return 0;
  var r = typeof vit.rr === "object" ? parseFloat(vit.rr.value) : parseFloat(vit.rr);
  return isNaN(r) ? 0 : r;
}

export function SceneStage(props) {
  var t = useTokens();
  var sc = props.sc;
  var h = props.height || 280;
  var pi = usePlayerStore(function (s) { return s.phaseIndex; });
  var stage = usePlayerStore(function (s) { return s.stage; });
  var actionHistory = usePlayerStore(function (s) { return s.actionHistory; });
  var cbDone = usePlayerStore(function (s) { return s.cbDone; });
  var vit = usePlayerStore(function (s) { return s.vitals; });
  if (!sc || !sc.patient) return null;
  var st = buildRunSceneState(sc, { pi: pi, stage: stage, actionHistory: actionHistory, cbDone: cbDone });
  var p = sceneProps(st);
  var rate = rateFrom(vit);
  var view = (<Suspense fallback={<div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: t.COLOR.ink3 }}>Setting the room…</div>}>
    <SceneView ageBand={caseBand(sc)} sexVariant={caseVariant(sc)}
      paletteSeed={runSeed(sc)}
      pose={p.pose} accessories={p.accessories} companion={p.companion}
      faceEyes={p.faceEyes} faceMouth={p.faceMouth}
      cycleRate={rate && rate > 0 ? rate : 28}
      framing={props.framing} scene={t.SCENE} height={h}
      controls={props.controls !== undefined ? props.controls : !props.bare}/>
  </Suspense>);
  if (props.bare) return view;
  return (<div style={Object.assign({}, t.stage(), { padding: 8 }, props.style)}>{view}</div>);
}
