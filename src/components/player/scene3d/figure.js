// [SCENE3D FIGURE] The rigged blocky figure (phase B): band-driven
// proportions (A–D), pivoted limbs so the pose system can swing them, a
// swappable face texture, and the 10 hair styles from the seeded config.
//
// Rig layout — root origin at FOOT level (y=0), so placing the figure means
// setting root.position.y to the surface it stands on:
//   root
//   ├─ legL / legR   (pivot at the hip — rotation.x swings the leg forward)
//   ├─ torso
//   ├─ armL / armR   (pivot at the shoulder — rotation.z raises, .x bends)
//   └─ headG         (head + hair; face is the +z material slot)
//
// LAZY CHAIN ONLY (imports `three`).
import * as THREE from "three";
import { mat, box, faceTexture, toneCss } from "./kit.js";

// Band proportions: [headSize, torsoW, torsoH, armLen, legLen] — same map as
// the approved Avatar3D concept.
export var BANDS = {
  A: [1.15, 1.05, 0.72, 0.52, 0.42],
  B: [1.05, 1.00, 0.82, 0.62, 0.55],
  C: [0.95, 1.00, 0.95, 0.75, 0.75],
  D: [0.88, 1.10, 1.15, 0.92, 1.00]
};

function buildHair(headG, style, hairM, h) {
  // hair meshes are tagged so cap-style accessories can hide them
  function hbox(wx, hy, dz, x, y, z) {
    var m = box(headG, wx, hy, dz, hairM, x, y, z);
    m.userData.hair = true;
    return m;
  }
  if (style === "buzz") { hbox(0.97 * h, 0.18 * h, 0.87 * h, 0, 0.45 * h, -0.02); return; }
  // every other style sits on the classic cap + back
  hbox(0.99 * h, 0.3 * h, 0.89 * h, 0, 0.42 * h, -0.03);
  hbox(0.99 * h, 0.55 * h, 0.2, 0, 0.1 * h, -0.36 * h);
  if (style === "fringe") { hbox(0.72 * h, 0.16 * h, 0.12, 0, 0.34 * h, 0.4 * h); }
  else if (style === "waves") {
    hbox(0.3 * h, 0.26 * h, 0.5 * h, -0.26 * h, 0.6 * h, -0.05);
    hbox(0.3 * h, 0.3 * h, 0.5 * h, 0.05 * h, 0.62 * h, -0.05);
    hbox(0.26 * h, 0.24 * h, 0.5 * h, 0.33 * h, 0.58 * h, -0.05);
  }
  else if (style === "tall") { hbox(0.6 * h, 0.38 * h, 0.6 * h, 0, 0.7 * h, -0.05); }
  else if (style === "side") { hbox(0.55 * h, 0.2 * h, 0.85 * h, -0.26 * h, 0.6 * h, -0.03); }
  else if (style === "buns") {
    hbox(0.26 * h, 0.26 * h, 0.26 * h, -0.42 * h, 0.62 * h, -0.06);
    hbox(0.26 * h, 0.26 * h, 0.26 * h, 0.42 * h, 0.62 * h, -0.06);
  }
  else if (style === "tails") {
    hbox(0.18 * h, 0.5 * h, 0.18 * h, -0.56 * h, -0.08 * h, -0.14 * h);
    hbox(0.18 * h, 0.5 * h, 0.18 * h, 0.56 * h, -0.08 * h, -0.14 * h);
  }
  else if (style === "curls") {
    hbox(0.24 * h, 0.22 * h, 0.24 * h, -0.36 * h, 0.58 * h, 0.22 * h);
    hbox(0.24 * h, 0.22 * h, 0.24 * h, 0.36 * h, 0.58 * h, 0.22 * h);
    hbox(0.24 * h, 0.22 * h, 0.24 * h, -0.36 * h, 0.58 * h, -0.26 * h);
    hbox(0.24 * h, 0.22 * h, 0.24 * h, 0.36 * h, 0.58 * h, -0.26 * h);
  }
  else if (style === "swoop") {
    // at the HAIRLINE, merging into the cap — never down at eye level where
    // it reads as a giant eyebrow
    var sw = hbox(0.8 * h, 0.2 * h, 0.16, 0.05 * h, 0.42 * h, 0.36 * h);
    sw.rotation.z = 0.12;
  }
}

// buildFigure(cfg, band, opts) -> { root, parts, dims, setFace }
//   cfg  — from seededConfig(): gownColor, hairStyle, hairColor, tone, faceSet
//   dims — world-unit landmarks (scale already applied) for placement:
//          hipY (pivot height), legHalf (leg thickness/2), standH (top of
//          head), torsoTopY, halfW (widest half-extent)
export function buildFigure(cfg, band, opts) {
  var p = BANDS[band] || BANDS.B;
  var headS = p[0], tw = p[1], th = p[2], al = p[3], ll = p[4];
  var s = (opts && opts.scale) || 0.5;
  var gown = mat(cfg.gownColor, 0.8);
  var skin = mat(cfg.tone, 0.75);
  var hairM = mat(cfg.hairColor, 0.85);
  var shoe = mat(0xffffff, 0.9);
  var root = new THREE.Group();
  root.scale.setScalar(s);

  function legPivot(sideX) {
    var g = new THREE.Group();
    g.position.set(sideX, ll, 0);
    // leg runs 0.04 up INTO the torso and the sole sits 0.01 BELOW the leg
    // end — no coplanar faces, no z-fighting shimmer
    box(g, 0.34 * tw, ll + 0.04, 0.34, skin, 0, -ll / 2 + 0.02, 0);
    box(g, 0.4 * tw, 0.14, 0.42, shoe, 0, -ll + 0.06, 0.05);
    root.add(g);
    return g;
  }
  var legL = legPivot(-0.24 * tw);
  var legR = legPivot(0.24 * tw);

  var torso = box(root, 1.05 * tw, th, 0.55, gown, 0, ll + th / 2, 0);

  function armPivot(sideX) {
    var g = new THREE.Group();
    g.position.set(sideX, ll + th, 0);
    box(g, 0.26, al, 0.34, skin, 0, -al / 2, 0);
    // sleeve cap tops out 0.02 ABOVE the shoulder plane so its top face is
    // never coplanar with the arm's (z-fighting)
    box(g, 0.3, 0.22, 0.38, gown, 0, -0.09, 0);
    root.add(g);
    return g;
  }
  var armL = armPivot(-(0.53 * tw + 0.16));
  var armR = armPivot(0.53 * tw + 0.16);

  var headY = ll + th + 0.5 * headS + 0.06;
  var headG = new THREE.Group();
  headG.position.set(0, headY, 0);
  var faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture({ eyes: "open", mouth: "smile", set: cfg.faceSet, tone: toneCss(cfg.tone) }),
    roughness: 0.75
  });
  var head = new THREE.Mesh(
    new THREE.BoxGeometry(0.95 * headS, headS, 0.85 * headS),
    [skin, skin, skin, skin, faceMat, skin]
  );
  headG.add(head);
  buildHair(headG, cfg.hairStyle, hairM, headS);
  root.add(headG);

  function setFace(spec) {
    var old = faceMat.map;
    faceMat.map = faceTexture({
      eyes: spec.eyes, mouth: spec.mouth,
      set: cfg.faceSet, tone: toneCss(cfg.tone)
    });
    faceMat.needsUpdate = true;
    if (old) old.dispose();
  }

  return {
    root: root,
    parts: { legL: legL, legR: legR, armL: armL, armR: armR, torso: torso, headG: headG },
    dims: {
      scale: s,
      headS: headS,
      armLen: al,
      hipY: ll * s,
      legHalf: 0.17 * s,
      torsoTopY: (ll + th) * s,
      standH: (ll + th + headS + 0.06 + 0.42 * headS) * s,
      halfW: (0.53 * tw + 0.31) * s,
      torsoHalfW: 0.525 * tw * s,
      depthHalf: 0.275 * s
    },
    setFace: setFace
  };
}
