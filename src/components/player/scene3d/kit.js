// [SCENE3D KIT] Low-level shared helpers for the 3D scene system (phase B of
// docs/DIRECTION-3D.md §9): materials, block/cylinder builders, the face
// canvas texture, and a full dispose walker.
//
// LAZY CHAIN ONLY: this module imports `three`, so anything importing it must
// be reached via React.lazy(() => import(...)) — never statically from app
// code (stack contract, docs/HANDOFF.md).
import * as THREE from "three";

// "#C08A5A" (SCENE token strings) -> 0xC08A5A for three materials.
export function hexNum(hex) {
  if (typeof hex === "number") return hex;
  return parseInt(String(hex).replace("#", ""), 16);
}

export function toneCss(tone) {
  var s = tone.toString(16);
  while (s.length < 6) s = "0" + s;
  return "#" + s;
}

export function mat(color, roughness) {
  return new THREE.MeshStandardMaterial({
    color: hexNum(color),
    roughness: typeof roughness === "number" ? roughness : 0.85
  });
}

export function box(parent, wx, hy, dz, material, x, y, z) {
  var m = new THREE.Mesh(
    new THREE.BoxGeometry(wx, hy, dz),
    material && material.isMaterial ? material : mat(material)
  );
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export function cyl(parent, r, h, material, x, y, z, seg) {
  var m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, h, seg || 20),
    material && material.isMaterial ? material : mat(material)
  );
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

// Face states (DIRECTION-3D §3): eyes open/closed/heavy, mouth
// smile/grin/neutral/unsettled. `set` (0|1) is the per-variant face set —
// same grammar, different eye shape + cheek detail. `tone` matches the
// figure's surface tone so the head reads as one piece.
export function faceTexture(spec) {
  var eyes = spec.eyes || "open";
  var mouth = spec.mouth || "smile";
  var set = spec.set || 0;
  var c = document.createElement("canvas"); c.width = 128; c.height = 128;
  var ctx = c.getContext("2d");
  ctx.fillStyle = spec.tone || "#ffcc99"; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#1a1a1a"; ctx.fillStyle = "#1a1a1a"; ctx.lineCap = "round";
  if (eyes === "closed") {
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(44, 58, 9, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(84, 58, 9, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  } else {
    var ry = set === 1 ? 7.5 : 9;
    var rx = set === 1 ? 8 : 7;
    ctx.beginPath(); ctx.ellipse(44, 58, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(84, 58, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(42, 55, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(82, 55, 2, 0, Math.PI * 2); ctx.fill();
    if (eyes === "heavy") {
      // heavy lids for the slowed state — flat caps over the upper half
      ctx.fillStyle = spec.tone || "#ffcc99";
      ctx.fillRect(30, 44, 30, 12); ctx.fillRect(70, 44, 30, 12);
      ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(34, 56); ctx.lineTo(54, 56); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(74, 56); ctx.lineTo(94, 56); ctx.stroke();
    }
  }
  if (set === 1) {
    // face set 1: soft cheek dots
    ctx.fillStyle = "rgba(224,120,90,0.35)";
    ctx.beginPath(); ctx.arc(30, 76, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(98, 76, 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = "#2d3436"; ctx.fillStyle = "#2d3436"; ctx.lineWidth = 4;
  ctx.beginPath();
  if (mouth === "grin") { ctx.arc(64, 80, 16, 0.1 * Math.PI, 0.9 * Math.PI); }
  else if (mouth === "smile") { ctx.arc(64, 84, 10, 0.15 * Math.PI, 0.85 * Math.PI); }
  else if (mouth === "unsettled") { ctx.arc(64, 100, 10, 1.15 * Math.PI, 1.85 * Math.PI); }
  else { ctx.moveTo(56, 92); ctx.lineTo(72, 92); }
  ctx.stroke();
  var tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Soft flexible tubing through the given world points — low sag, slight
// sheen, never a straight rigid run (DIRECTION-3D §1).
export function tube(parent, pts, r, color) {
  var curve = new THREE.CatmullRomCurve3(pts);
  var m = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 40, r, 8),
    new THREE.MeshStandardMaterial({ color: hexNum(color), roughness: 0.35 })
  );
  parent.add(m);
  return m;
}

// Dispose everything under a root: geometries, materials (arrays too), and
// any textures hanging off material maps. Renderer disposal stays with the
// caller.
export function disposeTree(root) {
  root.traverse(function (node) {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      var mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(function (m) {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}
