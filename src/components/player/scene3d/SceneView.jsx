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

export default function SceneView(props) {
  var mountRef = useRef(null);
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

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var renderer = null; var scene = null; var raf = null; var preRaf = null;

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
    var dist = (sphere.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.06;
    var EL = 0.42; // camera elevation angle
    function placeCamera(az) {
      camera.position.set(
        target.x + Math.cos(az) * Math.cos(EL) * dist,
        target.y + Math.sin(EL) * dist,
        target.z + Math.sin(az) * Math.cos(EL) * dist
      );
      camera.lookAt(target);
    }

    // ---- animate ------------------------------------------------------------
    var t0 = null;
    var bobPeriod = 60 / cycleRate;
    var reduce = false;
    try { reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) {}
    // Gentle sway around the front quadrant — the face stays legible instead
    // of a full orbit that spends half its time behind the figure.
    function tick(ts) {
      if (t0 === null) t0 = ts;
      var t = (ts - t0) / 1000;
      placeCamera(1.1 + Math.sin(t * 0.3) * 0.55);
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
    if (reduce) { placeCamera(1.1); renderer.render(scene, camera); }
    else raf = requestAnimationFrame(tick);
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
      if (scene) disposeTree(scene);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      }
    };
  }, [band, variant, seed, pose, cycleRate, faceEyes, faceMouth, sc, accKey, companion, framing, props.height]);

  return <div ref={mountRef} style={{ width: "100%", height: props.height || 340 }}/>;
}
