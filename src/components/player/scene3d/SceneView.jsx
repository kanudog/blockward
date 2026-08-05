// [SCENE3D VIEW] Phase B scene core (DIRECTION-3D §9.B): builds the room for
// the band's station, the seeded figure, applies the pose, then AUTO-FRAMES
// the camera — bounding-sphere fit of figure + station with a figure-first
// bias (never cinematic for its own sake; always legible).
//
// Contract-first: props mirror the future AvatarSceneState slice this view
// will consume in the run —
//   ageBand A–D · sexVariant v1|v2|neutral · paletteSeed · pose ·
//   faceEyes/faceMouth (optional override) · cycleRate · scene (SCENE tokens)
//
// LAZY-LOADED ONLY (React.lazy) — this module imports `three`.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { disposeTree } from "./kit.js";
import { seededConfig, paleShift } from "./config.js";
import { buildFigure } from "./figure.js";
import { buildRoom } from "./room.js";
import { applyPose } from "./poses.js";
import { applyAccessories } from "./accessories.js";
import { buildCompanion } from "./companions.js";

var FALLBACK_SCENE = {
  frame: "#C08A5A", frameLight: "#D9A876", slat: "#CE9A66",
  mattress: "#F7F1E4", floor: "#D9CBB2",
  standPole: "#B8C2CF", standBase: "#9AA5B1"
};

// ---- viewer camera controls -------------------------------------------------
// Spin and zoom live in REFS, never in state: the scene is rebuilt by the big
// useEffect below, and putting camera values in its dependency list would tear
// down and rebuild the whole room on every slider tick. The render loop reads
// the refs each frame instead, so dragging costs nothing and the viewer's
// chosen angle survives a rebuild (a new accessory landing mid-run).
var ZOOM_NEAR = 0.42;   // multiplier on the auto-framed distance — smaller = closer
var ZOOM_FAR = 1.45;
var AZ_HOME = 1.1;      // the default front-quadrant azimuth the auto-sway centres on
function sliderToZoom(v) { return ZOOM_FAR + (ZOOM_NEAR - ZOOM_FAR) * (Number(v) / 100); }
function zoomToSlider(z) { return ((z - ZOOM_FAR) / (ZOOM_NEAR - ZOOM_FAR)) * 100; }
function sliderToAz(v) { return ((Number(v) / 100) - 0.5) * Math.PI * 2; }

export default function SceneView(props) {
  var mountRef = useRef(null);
  var azRef = useRef(0);        // radians offset from AZ_HOME
  var zoomRef = useRef(1);      // 1 = the auto-framed distance
  var touchedRef = useRef(false); // has the viewer taken the camera over?
  var apiRef = useRef(null);    // { redraw } published by the effect
  var spinElRef = useRef(null);
  var zoomElRef = useRef(null);
  var band = props.ageBand || "B";
  var variant = props.sexVariant || "neutral";
  var seed = props.paletteSeed || "subject";
  var pose = props.pose || "settled";
  var cycleRate = props.cycleRate || 28;
  var faceEyes = props.faceEyes || "";
  var faceMouth = props.faceMouth || "";
  var sc = props.scene || FALLBACK_SCENE;
  // "room" fits figure + station + bedside pieces (the default); "figure"
  // is the tight portrait crop for small inline slots (examine centerpiece).
  var framing = props.framing || "room";
  var accKey = (props.accessories || []).join(",");
  // one companion per case, ALWAYS (DIRECTION-3D §7): default to the seeded
  // pick; pass "none" to opt out, or a kind to override.
  var companion = props.companion || "";
  // Camera controls are on everywhere except the tight examine centerpiece,
  // where the slot is 190px tall and a control bar would crowd the figure.
  var showControls = props.controls !== false;

  function repaintIfStill() {
    if (apiRef.current && apiRef.current.still) apiRef.current.redraw();
  }
  function nudgeZoom(z) {
    touchedRef.current = true;
    zoomRef.current = Math.min(ZOOM_FAR, Math.max(ZOOM_NEAR, z));
    if (zoomElRef.current) zoomElRef.current.value = String(zoomToSlider(zoomRef.current));
    repaintIfStill();
  }
  function onSpin(e) {
    touchedRef.current = true;
    azRef.current = sliderToAz(e.target.value);
    repaintIfStill();
  }
  function onZoom(e) {
    touchedRef.current = true;
    zoomRef.current = sliderToZoom(e.target.value);
    repaintIfStill();
  }
  function onResetView() {
    touchedRef.current = false;
    azRef.current = 0;
    zoomRef.current = 1;
    if (spinElRef.current) spinElRef.current.value = "50";
    if (zoomElRef.current) zoomElRef.current.value = String(zoomToSlider(1));
    repaintIfStill();
  }

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var renderer = null; var scene = null; var raf = null; var preRaf = null;
    var teardownInput = null;

    function setup() {
    var W = mount.clientWidth || 360; var H = props.height || 340;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 60);
    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a8072, 1.15));
    var key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(4, 6, 4); scene.add(key);

    var world = new THREE.Group(); scene.add(world);
    var room = buildRoom(band, sc);
    world.add(room.root);
    var ids = accKey ? accKey.split(",") : [];
    var cfg = seededConfig(seed, variant);
    if (ids.indexOf("tone-pale") >= 0) {
      // tone shifts happen BEFORE the build so the face texture matches
      cfg = Object.assign({}, cfg, { tone: paleShift(cfg.tone) });
    }
    var fig = buildFigure(cfg, band, { scale: 0.5 });
    var posed = applyPose(fig, room.refs, pose);
    world.add(posed.node);
    fig.setFace({
      eyes: faceEyes || posed.face.eyes,
      mouth: faceMouth || posed.face.mouth
    });
    var accG = null;
    if (ids.length) {
      accG = applyAccessories(fig, room.refs, ids, world);
    }
    var compKind = companion || cfg.companion;
    if (compKind !== "none") {
      var comp = buildCompanion(compKind);
      comp.position.set(room.refs.companionSpot.x, room.refs.matTopY, room.refs.companionSpot.z);
      comp.rotation.y = -0.45;
      world.add(comp);
    }

    // ---- camera auto-framing ---------------------------------------------
    // Sphere-fit the figure∪station box; aim at the figure's center pulled
    // partway toward the whole-scene center (figure-first bias).
    world.updateMatrixWorld(true);
    var figBox = new THREE.Box3().setFromObject(posed.node);
    var allBox = figBox.clone().union(new THREE.Box3().setFromObject(room.refs.stationG));
    allBox.expandByPoint(new THREE.Vector3(room.refs.standXZ.x, 1.6, room.refs.standXZ.z));
    allBox.expandByPoint(new THREE.Vector3(room.refs.tableTop.x + 0.3, 0.8, room.refs.tableTop.z));
    if (accG && accG.children.length) {
      allBox.union(new THREE.Box3().setFromObject(accG));
    }
    var sphere = new THREE.Sphere();
    var target;
    if (framing === "figure") {
      figBox.clone().expandByScalar(0.14).getBoundingSphere(sphere);
      target = figBox.getCenter(new THREE.Vector3());
    } else {
      allBox.getBoundingSphere(sphere);
      target = figBox.getCenter(new THREE.Vector3())
        .lerp(allBox.getCenter(new THREE.Vector3()), 0.45);
    }
    var vFov = camera.fov * Math.PI / 180;
    var hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    var baseDist = (sphere.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.06;
    var EL = 0.42; // camera elevation angle
    var figCenter = figBox.getCenter(new THREE.Vector3());
    function placeCamera(az) {
      // Zooming in re-aims from the room's centre toward the figure, so closing
      // the distance frames the CHILD rather than pushing into empty floor.
      var z = zoomRef.current;
      var d = baseDist * z;
      var aim = target.clone().lerp(figCenter, Math.min(1, Math.max(0, (1 - z) * 1.6)));
      camera.position.set(
        aim.x + Math.cos(az) * Math.cos(EL) * d,
        aim.y + Math.sin(EL) * d,
        aim.z + Math.sin(az) * Math.cos(EL) * d
      );
      camera.lookAt(aim);
    }

    // ---- animate ------------------------------------------------------------
    var t0 = null;
    var bobPeriod = 60 / cycleRate;
    var reduce = false;
    try { reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) {}
    // Gentle sway around the front quadrant — the face stays legible instead
    // of a full orbit that spends half its time behind the figure. The sway is
    // an IDLE behaviour: the moment the viewer touches a control it stops and
    // the camera holds exactly where they put it.
    function azimuthAt(t) {
      if (touchedRef.current) return AZ_HOME + azRef.current;
      return AZ_HOME + Math.sin(t * 0.3) * 0.55;
    }
    function redraw() {
      placeCamera(AZ_HOME + azRef.current);
      renderer.render(scene, camera);
    }
    function tick(ts) {
      if (t0 === null) t0 = ts;
      var t = (ts - t0) / 1000;
      placeCamera(azimuthAt(t));
      if (posed.anim.kind === "bob") {
        posed.anim.target.position.y = posed.anim.baseY
          + Math.sin(t * 2 * Math.PI / bobPeriod) * 0.012;
      } else if (posed.anim.kind === "jump") {
        posed.anim.target.position.y = posed.anim.baseY
          + Math.abs(Math.sin(t * 4)) * 0.2;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    // Under prefers-reduced-motion there is no loop to pick the change up, so
    // the controls repaint on demand through this handle.
    apiRef.current = { redraw: redraw, still: reduce };
    if (reduce) redraw();
    else raf = requestAnimationFrame(tick);

    // Wheel and pinch zoom on the canvas itself — the sliders are the discoverable
    // path, these are the ones people reach for without being told.
    function onWheel(e) {
      e.preventDefault();
      nudgeZoom(zoomRef.current * (e.deltaY > 0 ? 1.09 : 0.91));
    }
    var pinchFrom = 0;
    var pinchZoom0 = 1;
    function touchGap(e) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function onTouchStart(e) {
      if (e.touches.length !== 2) return;
      pinchFrom = touchGap(e);
      pinchZoom0 = zoomRef.current;
    }
    function onTouchMove(e) {
      if (e.touches.length !== 2 || !pinchFrom) return;
      e.preventDefault();
      nudgeZoom(pinchZoom0 * (pinchFrom / touchGap(e)));
    }
    function onTouchEnd() { pinchFrom = 0; }
    if (showControls) {
      mount.addEventListener("wheel", onWheel, { passive: false });
      mount.addEventListener("touchstart", onTouchStart, { passive: true });
      mount.addEventListener("touchmove", onTouchMove, { passive: false });
      mount.addEventListener("touchend", onTouchEnd, { passive: true });
      teardownInput = function () {
        mount.removeEventListener("wheel", onWheel);
        mount.removeEventListener("touchstart", onTouchStart);
        mount.removeEventListener("touchmove", onTouchMove);
        mount.removeEventListener("touchend", onTouchEnd);
      };
    }
    }

    // A collapsible/flex parent can report width 0 on the very first layout
    // pass — defer one frame so the renderer sizes to the real slot instead
    // of the 360px fallback (seen as an oversized first paint in the examine
    // centerpiece).
    if (mount.clientWidth) setup();
    else preRaf = requestAnimationFrame(setup);

    return function () {
      if (preRaf) cancelAnimationFrame(preRaf);
      if (raf) cancelAnimationFrame(raf);
      if (teardownInput) teardownInput();
      apiRef.current = null;
      if (scene) disposeTree(scene);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      }
    };
  }, [band, variant, seed, pose, cycleRate, faceEyes, faceMouth, sc, accKey, companion, framing, props.height, showControls]);

  var h = props.height || 340;
  if (!showControls) return <div ref={mountRef} style={{ width: "100%", height: h }}/>;

  // Portrait-phone layout (owner direction 2026-08-05): spin runs along the
  // BOTTOM EDGE, zoom stands VERTICALLY up the right side. Two axes, two edges
  // — nothing competes for the same strip of a 400pt-wide screen, and neither
  // control crosses the middle of the frame where the patient is.
  //
  // The zoom column is inset from the top and stops above the spin bar, so the
  // two never collide however short the scene slot gets. The wrapper is
  // pointer-events:none and only the pills take input, leaving the rest of the
  // canvas free for wheel and pinch.
  var pill = {
    background: "rgba(252,250,246,0.82)", border: "1px solid rgba(120,130,140,0.22)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    userSelect: "none", WebkitUserSelect: "none", touchAction: "none",
    pointerEvents: "auto"
  };
  var tick = { fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: "#7a838c", flexShrink: 0, lineHeight: 1 };
  return (<div style={{ position: "relative", width: "100%" }}>
    <style>{"input.bw-cam{-webkit-appearance:none;appearance:none;margin:0;background:transparent;outline:none;cursor:pointer}"
      + "input.bw-cam::-webkit-slider-runnable-track{background:rgba(140,150,160,0.38);border-radius:999px}"
      + "input.bw-cam::-moz-range-track{background:rgba(140,150,160,0.38);border-radius:999px}"
      + "input.bw-cam-h::-webkit-slider-runnable-track{height:4px}"
      + "input.bw-cam-h::-moz-range-track{height:4px}"
      /* 18px thumbs: below this a finger on a phone cannot reliably grab them */
      + "input.bw-cam::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:1.5px solid rgba(90,100,110,0.6);box-shadow:0 1px 3px rgba(0,0,0,0.3);cursor:pointer}"
      + "input.bw-cam-h::-webkit-slider-thumb{margin-top:-7px}"
      + "input.bw-cam::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:1.5px solid rgba(90,100,110,0.6);box-shadow:0 1px 3px rgba(0,0,0,0.3);cursor:pointer}"
      /* Vertical rail via writing-mode, NOT -webkit-appearance:slider-vertical:
         the legacy keyword hands the control back to the native widget, which
         ignores every ::-webkit-slider-thumb rule above and repaints the whole
         thing in system blue. writing-mode keeps appearance:none, so the rail
         stays styled. direction:rtl makes UP = zoomed in. */
      + "input.bw-cam-v{writing-mode:vertical-lr;direction:rtl;width:18px}"
      + "input.bw-cam-v::-webkit-slider-runnable-track{width:4px;height:100%}"
      + "input.bw-cam-v::-moz-range-track{width:4px;height:100%}"
      + "input.bw-cam-v::-webkit-slider-thumb{margin-left:-7px}"}</style>
    <div ref={mountRef} style={{ width: "100%", height: h, touchAction: "pan-y" }}/>

    {/* right edge — zoom, vertical */}
    <div style={{
      position: "absolute", right: 8, top: 10, bottom: 50, width: 34,
      display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none"
    }}>
      <div style={Object.assign({}, pill, {
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        padding: "8px 5px", borderRadius: 999
      })}>
        <span style={tick}>+</span>
        <input ref={zoomElRef} className="bw-cam bw-cam-v" type="range" min="0" max="100" step="0.5"
          defaultValue={String(zoomToSlider(1))} onChange={onZoom} onInput={onZoom}
          aria-label="Zoom in on the patient"
          style={{ height: Math.max(56, Math.min(104, h - 170)), margin: 0, padding: 0 }}/>
        <span style={tick}>&minus;</span>
        <button type="button" onClick={onResetView} aria-label="Reset the view"
          style={{
            width: 22, height: 22, borderRadius: 11, padding: 0, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "1px solid rgba(120,130,140,0.3)", color: "#7a838c"
          }}>
          <RotateCcw size={10}/>
        </button>
      </div>
    </div>

    {/* bottom edge — spin, horizontal. Right margin clears the zoom column. */}
    <div style={{
      position: "absolute", left: 8, right: 50, bottom: 8, display: "flex",
      alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 999
    }}>
      <div style={Object.assign({}, pill, {
        display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0,
        padding: "8px 12px", borderRadius: 999
      })}>
        <span style={tick}>SPIN</span>
        <input ref={spinElRef} className="bw-cam bw-cam-h" type="range" min="0" max="100" step="0.5"
          defaultValue="50" onChange={onSpin} onInput={onSpin}
          aria-label="Spin the view around the patient"
          style={{ flex: 1, minWidth: 0, height: 18, margin: 0, padding: 0 }}/>
      </div>
    </div>
  </div>);
}
