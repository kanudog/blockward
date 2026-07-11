// [SCENE3D ACCESSORIES] The keyword-resolved accessory catalog renders
// (DIRECTION-3D §4) — the FULL catalog: family A (face & airflow, 8),
// L (lines & pouches, 7), S (surface & limbs, 22), M (mobility, 6),
// B (bedside & staging, 11), E (monitoring & everyday, 8 — owner
// extension). Catalog metadata (ids, labels, forced poses) lives
// three-free in config.js; this module is placement functions only.
//
// Placement rules:
// - face/head items attach to fig.parts.headG in RAW figure units (the root
//   scale carries them), so they ride every pose;
// - freestanding items (units, the support machine) land in WORLD units in
//   the returned group;
// - soft tubing runs from an anchor on the figure (world position resolved
//   after the pose) to its unit — sagging, never straight.
//
// LAZY CHAIN ONLY (imports `three`).
import * as THREE from "three";
import { mat, box, cyl, tube } from "./kit.js";

var TUBING = 0xaac6e8;      // soft tubing + connector blue
var SOFT = 0xe8f0f6;        // pale device surface
var TAPE = 0xf3e9dc;        // securing tape
var UNIT = 0xd9dee4;        // bedside unit shell
var SCREEN = 0x223041;      // machine screen panel

// A small world-space anchor at a local point of a parent, resolved after
// the whole world matrix is up to date.
function worldPoint(worldRoot, parent, x, y, z) {
  var a = new THREE.Object3D();
  a.position.set(x, y, z);
  parent.add(a);
  worldRoot.updateMatrixWorld(true);
  var v = new THREE.Vector3();
  a.getWorldPosition(v);
  parent.remove(a);
  return v;
}

// The support machine (a B-family item delivered early: A6/A7 tubing needs
// somewhere to run). Screen box on a cart at the head end, opposite the
// stand, angled toward the station.
function supportMachine(g, refs) {
  var cart = new THREE.Group();
  // clearly clear of the station's head panel — beside it, angled in
  cart.position.set(refs.standXZ.x - 0.05, 0, -0.85);
  cart.rotation.y = -0.45;
  box(cart, 0.44, 0.05, 0.36, mat(UNIT, 0.6), 0, 0.05, 0);
  box(cart, 0.1, 0.85, 0.1, mat(0xaab2bc, 0.6), 0, 0.5, 0);
  box(cart, 0.14, 0.42, 0.52, mat(UNIT, 0.6), 0.02, 1.08, 0);
  box(cart, 0.02, 0.32, 0.42, mat(SCREEN, 0.4), 0.09, 1.08, 0);
  box(cart, 0.015, 0.03, 0.3, mat(0x9fd8c6, 0.4), 0.1, 1.16, 0);
  g.add(cart);
  return worldPoint(g, cart, 0.05, 1.28, 0);
}

// A small unit sitting on the side table (mist source, pump).
function tableUnit(g, refs, w, h2, d) {
  var u = new THREE.Group();
  u.position.set(refs.tableTop.x, refs.tableTop.y, refs.tableTop.z);
  box(u, w, h2, d, mat(UNIT, 0.6), 0, h2 / 2, 0);
  box(u, w * 0.7, 0.05, d * 0.7, mat(0xaab2bc, 0.6), 0, h2 + 0.025, 0);
  g.add(u);
  return worldPoint(g, u, 0, h2 + 0.05, 0);
}

function lineTwoProng(fig, heavy) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  var t = (heavy ? 0.09 : 0.05) * h;
  var m = mat(TUBING, 0.4);
  box(headG, 0.52 * h, t, 0.05, m, 0, -0.1 * h, 0.45 * h);
  box(headG, 0.05, t, 0.5 * h, m, -0.45 * h, -0.09 * h, 0.16 * h);
  box(headG, 0.05, t, 0.5 * h, m, 0.45 * h, -0.09 * h, 0.16 * h);
}

function faceCover(fig, color) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  box(headG, 0.5 * h, 0.36 * h, 0.16, mat(color, 0.7), 0, -0.22 * h, 0.42 * h);
  var strap = mat(0xcfd8e0, 0.6);
  box(headG, 0.04, 0.05 * h, 0.55 * h, strap, -0.46 * h, -0.12 * h, 0.1 * h);
  box(headG, 0.04, 0.05 * h, 0.55 * h, strap, 0.46 * h, -0.12 * h, 0.1 * h);
}

// ---- family L helpers -------------------------------------------------

var POUCH_TONES = [0xbcd8f5, 0xcfe3f7, 0xb0cfec, 0xc6def5];

// One hanging pouch on the stand; four non-overlapping slots — hook end,
// two on a crossbar behind (added with the second pouch), one forward.
var POUCH_SLOTS = [[0.36, 0], [0.36, -0.24], [0.14, -0.24], [0.14, 0.14]];
function standPouch(g, refs, idx) {
  var slot = POUCH_SLOTS[idx];
  var px = refs.standXZ.x + slot[0];
  var pz = refs.standXZ.z + slot[1];
  if (idx === 1) {
    box(g, 0.05, 0.04, 0.34, mat(0x9aa5b1, 0.55), refs.standXZ.x + 0.25, 1.85, refs.standXZ.z - 0.12);
  }
  if (idx === 3) {
    box(g, 0.05, 0.04, 0.2, mat(0x9aa5b1, 0.55), refs.standXZ.x + 0.14, 1.85, refs.standXZ.z + 0.07);
  }
  box(g, 0.05, 0.09, 0.03, mat(0x9bb8de, 0.5), px, 1.83, pz);
  box(g, 0.24, 0.38, 0.09, mat(POUCH_TONES[idx % 4], 0.5), px, 1.58, pz);
  box(g, 0.05, 0.1, 0.04, mat(0xd8e6f5, 0.5), px, 1.33, pz);
}

// A flat disc facing front (+z): cylinder with its axis rotated onto z.
function cylOnFront(parent, r, depth, color, x, y, z) {
  var m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, depth, 20),
    mat(color, 0.55)
  );
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

function rawBody(fig) {
  var s = fig.dims.scale;
  return {
    ll: fig.dims.hipY / s,
    topRaw: fig.dims.torsoTopY / s,
    th: (fig.dims.torsoTopY - fig.dims.hipY) / s,
    sideX: fig.dims.torsoHalfW / s
  };
}

// Resolve a limb code ("left-arm" | "right-arm" | "left-leg" | "right-leg";
// "" defaults to the right arm — DIRECTION-3D §4) to its pivot group plus
// overlay dimensions, so every limb item renders on whichever limb the
// resolver picked.
function limbPart(fig, limb) {
  var leg = limb === "left-leg" || limb === "right-leg";
  var left = limb === "left-arm" || limb === "left-leg";
  var seg = leg
    ? (left ? fig.parts.legL : fig.parts.legR)
    : (left ? fig.parts.armL : fig.parts.armR);
  return {
    seg: seg,
    len: leg ? fig.dims.hipY / fig.dims.scale : fig.dims.armLen,
    w: leg ? 0.4 : 0.26,
    d: leg ? 0.4 : 0.34,
    left: left,
    leg: leg
  };
}

var APPLY = {
  "line-two-prong": function (fig) { lineTwoProng(fig, false); },
  "line-two-prong-heavy": function (fig) { lineTwoProng(fig, true); },
  "cover-loose": function (fig) { faceCover(fig, SOFT); },
  "cover-reservoir": function (fig) {
    faceCover(fig, SOFT);
    var h = fig.dims.headS;
    box(fig.parts.headG, 0.2 * h, 0.3 * h, 0.13 * h, mat(0xf2f6fa, 0.5), 0, -0.55 * h, 0.42 * h);
  },
  "mist-cover": function (fig, refs, g, worldRoot) {
    faceCover(fig, 0xe4eef8);
    var h = fig.dims.headS;
    var mist = new THREE.Mesh(
      new THREE.BoxGeometry(0.62 * h, 0.44 * h, 0.24 * h),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.32 })
    );
    mist.position.set(0, -0.26 * h, 0.52 * h);
    fig.parts.headG.add(mist);
    var top = tableUnit(g, refs, 0.26, 0.22, 0.2);
    var chin = worldPoint(worldRoot, fig.parts.headG, 0, -0.4 * h, 0.45 * h);
    // drape out around the station's near front — never through the panels
    tube(g, [
      chin,
      new THREE.Vector3((chin.x + top.x) / 2, Math.min(chin.y, top.y) - 0.1, (chin.z + top.z) / 2 + 0.42),
      top
    ], 0.014, TUBING);
  },
  "tube-mouth-central": function (fig, refs, g, worldRoot) {
    var h = fig.dims.headS;
    var headG = fig.parts.headG;
    box(headG, 0.09 * h, 0.06 * h, 0.14, mat(TUBING, 0.4), 0, -0.19 * h, 0.47 * h);
    box(headG, 0.2 * h, 0.1 * h, 0.03, mat(TAPE, 0.8), -0.22 * h, -0.17 * h, 0.44 * h);
    box(headG, 0.2 * h, 0.1 * h, 0.03, mat(TAPE, 0.8), 0.22 * h, -0.17 * h, 0.44 * h);
    var screenTop = supportMachine(g, refs);
    var mouth = worldPoint(worldRoot, headG, 0, -0.19 * h, 0.5 * h);
    tube(g, [
      mouth,
      new THREE.Vector3(
        (mouth.x + screenTop.x) / 2,
        Math.max(mouth.y, screenTop.y) + 0.12,
        (mouth.z + screenTop.z) / 2
      ),
      screenTop
    ], 0.016, TUBING);
  },
  "port-neck": function (fig) {
    // anchored to the BODY at the neckline (raw units on the root), proud of
    // the chest so it reads at every band
    var h = fig.dims.headS;
    var topRaw = fig.dims.torsoTopY / fig.dims.scale;
    box(fig.root, 0.22 * h, 0.16 * h, 0.1, mat(0xdfe7ee, 0.6), 0, topRaw - 0.07, 0.29);
    box(fig.root, 0.12 * h, 0.09 * h, 0.07, mat(TUBING, 0.4), 0, topRaw - 0.07, 0.36);
  },
  "tube-nose-cheek": function (fig, refs, g, worldRoot) {
    var h = fig.dims.headS;
    var headG = fig.parts.headG;
    var m = mat(TUBING, 0.4);
    box(headG, 0.06 * h, 0.05 * h, 0.08, m, 0.03 * h, -0.03 * h, 0.46 * h);
    box(headG, 0.3 * h, 0.045 * h, 0.03, m, 0.22 * h, -0.06 * h, 0.45 * h);
    box(headG, 0.16 * h, 0.1 * h, 0.025, mat(TAPE, 0.8), 0.4 * h, -0.1 * h, 0.42 * h);
    var top = tableUnit(g, refs, 0.2, 0.15, 0.16);
    var cheek = worldPoint(worldRoot, headG, 0.44 * h, -0.12 * h, 0.4 * h);
    // same around-the-front drape as the mist line
    tube(g, [
      cheek,
      new THREE.Vector3((cheek.x + top.x) / 2, Math.min(cheek.y, top.y) - 0.1, (cheek.z + top.z) / 2 + 0.42),
      top
    ], 0.012, TUBING);
  }
};

// ---- family L — lines & pouches -----------------------------------------

APPLY["patch-limb-access"] = function (fig, refs, g, worldRoot, limb) {
  // taped patch on the resolved limb + a thin sagging line up to the stand
  var p = limbPart(fig, limb);
  var zf = p.d / 2 + 0.02;
  box(p.seg, 0.3, 0.18, 0.06, mat(0xf2f6fa, 0.7), 0, -p.len * 0.6, zf);
  box(p.seg, 0.34, 0.07, 0.045, mat(TAPE, 0.8), 0, -p.len * 0.48, zf + 0.01);
  var anchor = worldPoint(worldRoot, p.seg, 0, -p.len * 0.62, zf + 0.04);
  var hook = new THREE.Vector3(refs.standXZ.x + 0.34, 1.3, refs.standXZ.z);
  tube(g, [
    hook,
    new THREE.Vector3((hook.x + anchor.x) / 2, Math.min(hook.y, anchor.y) - 0.1, (hook.z + anchor.z) / 2 + 0.3),
    anchor
  ], 0.013, TUBING);
};

APPLY["pouch-on-stand"] = function (fig, refs, g) {
  // ACCUMULATES: one pouch per occurrence, cap 4; a pump box clamps onto
  // the pole as soon as any pouch is present
  var n = g.userData.pouchCount || 0;
  if (n >= 4) return;
  g.userData.pouchCount = n + 1;
  standPouch(g, refs, n);
  if (!g.userData.pumpAdded) {
    g.userData.pumpAdded = true;
    box(g, 0.22, 0.3, 0.16, mat(UNIT, 0.6), refs.standXZ.x + 0.11, 1.12, refs.standXZ.z);
    box(g, 0.16, 0.05, 0.02, mat(0x9fd8c6, 0.4), refs.standXZ.x + 0.11, 1.2, refs.standXZ.z + 0.09);
  }
};

APPLY["patch-scalp-access"] = function (fig, refs, g, worldRoot) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  box(headG, 0.08, 0.16 * h, 0.24 * h, mat(0xf2f6fa, 0.7), 0.5 * h, 0.12 * h, 0.08 * h);
  box(headG, 0.06, 0.22 * h, 0.1 * h, mat(TAPE, 0.8), 0.51 * h, 0.12 * h, 0.08 * h);
  var anchor = worldPoint(worldRoot, headG, 0.54 * h, 0.16 * h, 0.08 * h);
  var hook = new THREE.Vector3(refs.standXZ.x + 0.34, 1.3, refs.standXZ.z);
  tube(g, [
    hook,
    new THREE.Vector3((hook.x + anchor.x) / 2, Math.max(hook.y, anchor.y) + 0.08, (hook.z + anchor.z) / 2 + 0.15),
    anchor
  ], 0.012, TUBING);
};

APPLY["port-belly"] = function (fig) {
  var b = rawBody(fig);
  cylOnFront(fig.root, 0.09, 0.05, 0xe8eef4, 0, b.ll + b.th * 0.32, 0.29);
  cylOnFront(fig.root, 0.045, 0.03, TUBING, 0, b.ll + b.th * 0.32, 0.315);
};

APPLY["tube-side-torso"] = function (fig, refs, g, worldRoot) {
  var b = rawBody(fig);
  box(fig.root, 0.07, 0.09, 0.09, mat(TUBING, 0.4), b.sideX + 0.02, b.ll + b.th * 0.35, 0.08);
  var bx = 0.9, bz = refs.standFloor.z - 0.02;
  box(g, 0.3, 0.24, 0.2, mat(UNIT, 0.6), bx, 0.12, bz);
  box(g, 0.24, 0.04, 0.14, mat(0x9aa5b1, 0.55), bx, 0.26, bz);
  var anchor = worldPoint(worldRoot, fig.root, b.sideX + 0.05, b.ll + b.th * 0.35, 0.08);
  tube(g, [
    anchor,
    new THREE.Vector3((anchor.x + bx) / 2, Math.min(anchor.y, 0.28) - 0.02, (anchor.z + bz) / 2 + 0.25),
    new THREE.Vector3(bx, 0.28, bz)
  ], 0.013, TUBING);
};

APPLY["pouch-rail-low"] = function (fig, refs, g) {
  var rh = refs.railHang;
  box(g, 0.05, 0.12, 0.05, mat(0x8fa3b8, 0.55), rh.x, rh.y + 0.04, rh.z);
  box(g, 0.22, 0.28, 0.08, mat(0xf2e3b8, 0.6), rh.x, rh.y - 0.16, rh.z + 0.02);
  box(g, 0.06, 0.06, 0.05, mat(0xe0cf9e, 0.6), rh.x, rh.y - 0.33, rh.z + 0.02);
};

APPLY["pouch-drain-side"] = function (fig) {
  var b = rawBody(fig);
  box(fig.root, 0.07, 0.26, 0.2, mat(0xf0dcc0, 0.6), b.sideX + 0.04, b.ll + b.th * 0.18, 0.03);
  box(fig.root, 0.1, 0.06, 0.24, mat(TAPE, 0.8), b.sideX + 0.03, b.ll + b.th * 0.38, 0.03);
};

// ---- family S — surface & limbs ------------------------------------------
// Limb items default to the RIGHT ARM (the resolver will pick the limb the
// content names in phase E). Marks and patches use fixed deterministic
// spots — never Math.random (resume/render stability).

var MARK_RED = 0xc4574d;
var DEEP_TONE = 0x6b5a9e;
var COOL_TINT = 0x92aac9;

// small flat marks on the torso front; spots are [x, fraction of torso
// height]; z rides just proud of the gown
function torsoMarks(fig, spots, size, color) {
  var b = rawBody(fig);
  spots.forEach(function (sp) {
    box(fig.root, size, size, 0.03, mat(color, 0.65), sp[0], b.ll + sp[1] * b.th, 0.285);
  });
}

APPLY["wrap-limb"] = function (fig, refs, g, worldRoot, limb) {
  var p = limbPart(fig, limb);
  box(p.seg, p.w + 0.06, p.len * 0.45, p.d + 0.06, mat(0xf2f6fa, 0.75), 0, -p.len * 0.55, 0);
  box(p.seg, p.w + 0.08, 0.06, p.d + 0.08, mat(TAPE, 0.8), 0, -p.len * 0.4, 0);
};

APPLY["shell-limb"] = function (fig, refs, g, worldRoot, limb) {
  var p = limbPart(fig, limb);
  box(p.seg, p.w + 0.12, p.len * 0.78, p.d + 0.12, mat(0xfafcff, 0.5), 0, -p.len * 0.52, 0);
};

APPLY["splint-limb"] = function (fig, refs, g, worldRoot, limb) {
  var p = limbPart(fig, limb);
  box(p.seg, p.w + 0.08, p.len * 0.7, 0.18, mat(0xe8ddca, 0.7), 0, -p.len * 0.5, -(p.d / 2) + 0.01);
  box(p.seg, p.w + 0.1, 0.055, p.d + 0.1, mat(0xcfd8e0, 0.6), 0, -p.len * 0.28, 0);
  box(p.seg, p.w + 0.1, 0.055, p.d + 0.1, mat(0xcfd8e0, 0.6), 0, -p.len * 0.72, 0);
};

APPLY["limb-out-of-line"] = function (fig, refs, g, worldRoot, limb) {
  // the limb itself sits at an odd angle + a soft amber marker at the bend;
  // the resolver pairs this with shell/splint after the fix step
  var p = limbPart(fig, limb);
  var sign = p.left ? -1 : 1;
  p.seg.rotation.z = (p.leg ? 0.35 : 0.5) * sign;
  if (!p.leg) p.seg.rotation.x = 0.18;
  box(p.seg, p.w + 0.04, 0.08, p.d + 0.04, mat(0xd98c3f, 0.6), 0, -p.len * 0.55, 0);
};

APPLY["band-tight-limb"] = function (fig, refs, g, worldRoot, limb) {
  var p = limbPart(fig, limb);
  box(p.seg, p.w + 0.04, 0.1, p.d + 0.04, mat(0xe0632f, 0.5), 0, -p.len * 0.16, 0);
};

APPLY["limb-swollen"] = function (fig, refs, g, worldRoot, limb) {
  limbPart(fig, limb).seg.scale.set(1.42, 1.04, 1.42);
};

APPLY["wrap-head"] = function (fig) {
  var h = fig.dims.headS;
  box(fig.parts.headG, 1.06 * h, 0.22 * h, 0.96 * h, mat(0xf2f6fa, 0.75), 0, 0.28 * h, 0);
};

APPLY["cover-eye"] = function (fig) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  box(headG, 0.26 * h, 0.22 * h, 0.05, mat(0xf6f8fa, 0.7), 0.15 * h, 0.05 * h, 0.44 * h);
  var strap = mat(0xcfd8e0, 0.6);
  box(headG, 0.03, 0.05 * h, 0.9 * h, strap, -0.49 * h, 0.12 * h, 0);
  box(headG, 0.03, 0.05 * h, 0.9 * h, strap, 0.49 * h, 0.12 * h, 0);
  box(headG, 0.99 * h, 0.05 * h, 0.03, strap, 0, 0.12 * h, -0.44 * h);
  box(headG, 0.62 * h, 0.05 * h, 0.03, strap, -0.18 * h, 0.12 * h, 0.44 * h);
};

APPLY["ring-eye-shaded"] = function (fig) {
  // four thin strips framing one eye — the eye itself stays visible
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  var m = mat(0x7a6aa0, 0.7);
  var ex = 0.15 * h, ey = 0.05 * h, hw = 0.1 * h, hh = 0.08 * h;
  box(headG, 2 * hw, 0.03 * h, 0.02, m, ex, ey + hh, 0.435 * h);
  box(headG, 2 * hw, 0.03 * h, 0.02, m, ex, ey - hh, 0.435 * h);
  box(headG, 0.03 * h, 2 * hh, 0.02, m, ex - hw, ey, 0.435 * h);
  box(headG, 0.03 * h, 2 * hh, 0.02, m, ex + hw, ey, 0.435 * h);
};

APPLY["marks-scattered"] = function (fig) {
  torsoMarks(fig, [
    [-0.28, 0.75], [0.1, 0.82], [0.3, 0.6], [-0.12, 0.55],
    [0.22, 0.35], [-0.3, 0.3], [0.02, 0.18], [0.18, 0.7]
  ], 0.055, MARK_RED);
  var al = fig.dims.armLen;
  box(fig.parts.armL, 0.05, 0.05, 0.03, mat(MARK_RED, 0.65), 0.04, -al * 0.3, 0.17);
  box(fig.parts.armR, 0.05, 0.05, 0.03, mat(MARK_RED, 0.65), -0.04, -al * 0.4, 0.17);
};

APPLY["marks-cluster"] = function (fig) {
  torsoMarks(fig, [
    [0.08, 0.42], [0.2, 0.48], [0.14, 0.53], [0.1, 0.5], [0.22, 0.4], [0.16, 0.45]
  ], 0.05, MARK_RED);
};

APPLY["patches-deep-tone"] = function (fig) {
  var b = rawBody(fig);
  box(fig.root, 0.22, 0.16, 0.03, mat(DEEP_TONE, 0.7), -0.18, b.ll + 0.6 * b.th, 0.285);
  box(fig.root, 0.16, 0.12, 0.03, mat(DEEP_TONE, 0.7), 0.2, b.ll + 0.3 * b.th, 0.285);
  box(fig.parts.armR, 0.14, 0.12, 0.03, mat(DEEP_TONE, 0.7), 0, -fig.dims.armLen * 0.35, 0.17);
};

APPLY["line-closed-ticks"] = function (fig) {
  var b = rawBody(fig);
  var y = b.ll + 0.5 * b.th;
  box(fig.root, 0.36, 0.035, 0.025, mat(0xa06a5a, 0.7), 0.05, y, 0.285);
  [-0.09, 0, 0.09, 0.18].forEach(function (dx) {
    box(fig.root, 0.028, 0.09, 0.025, mat(0xa06a5a, 0.7), 0.05 + dx - 0.045, y, 0.285);
  });
};

APPLY["patches-mottled"] = function (fig) {
  torsoMarks(fig, [[-0.22, 0.35], [-0.05, 0.28], [0.14, 0.34], [-0.14, 0.2], [0.05, 0.16]], 0.12, 0xd9958a);
  torsoMarks(fig, [[-0.13, 0.3], [0.05, 0.26], [-0.03, 0.36]], 0.08, 0xf2e9e4);
};

APPLY["tone-pale"] = function () {
  // handled at figure build (SceneView shifts cfg.tone via paleShift so the
  // face texture matches the body) — known id, nothing extra to place
};

APPLY["tint-cool-rims"] = function (fig) {
  var h = fig.dims.headS;
  var al = fig.dims.armLen;
  var m = mat(COOL_TINT, 0.6);
  box(fig.parts.headG, 0.28 * h, 0.06 * h, 0.03, m, 0, -0.24 * h, 0.44 * h);
  box(fig.parts.armL, 0.28, 0.1, 0.36, m, 0, -al + 0.04, 0);
  box(fig.parts.armR, 0.28, 0.1, 0.36, m, 0, -al + 0.04, 0);
  var ll = fig.dims.hipY / fig.dims.scale;
  box(fig.parts.legL, 0.38, 0.1, 0.38, m, 0, -ll + 0.22, 0.01);
  box(fig.parts.legR, 0.38, 0.1, 0.38, m, 0, -ll + 0.22, 0.01);
};

APPLY["sheen-droplets"] = function (fig) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  var m = mat(0xcfe4f2, 0.3);
  box(headG, 0.05 * h, 0.06 * h, 0.03, m, -0.2 * h, 0.3 * h, 0.435 * h);
  box(headG, 0.05 * h, 0.06 * h, 0.03, m, 0, 0.34 * h, 0.435 * h);
  box(headG, 0.05 * h, 0.06 * h, 0.03, m, 0.18 * h, 0.28 * h, 0.435 * h);
};

APPLY["rim-swollen"] = function (fig) {
  var h = fig.dims.headS;
  box(fig.parts.headG, 0.3 * h, 0.1 * h, 0.06, mat(0xe09a72, 0.7), 0, -0.26 * h, 0.44 * h);
};

APPLY["collar-neck-support"] = function (fig) {
  var b = rawBody(fig);
  var h = fig.dims.headS;
  box(fig.root, 0.62 * h, 0.2, 0.52, mat(0xf2f4f6, 0.6), 0, b.topRaw + 0.03, 0.02);
  box(fig.root, 0.2 * h, 0.14, 0.05, mat(0xdfe5ea, 0.6), 0, b.topRaw + 0.03, 0.29);
};

APPLY["wrap-thermal-torso"] = function (fig) {
  var b = rawBody(fig);
  var w = b.sideX * 2 + 0.14;
  box(fig.root, w, b.th * 0.6, 0.68, mat(0xd9e6f2, 0.75), 0, b.ll + b.th * 0.45, 0);
  box(fig.root, w + 0.02, 0.06, 0.7, mat(0xb8cde0, 0.6), 0, b.ll + b.th * 0.45, 0);
};

APPLY["pack-cold"] = function (fig) {
  var b = rawBody(fig);
  box(fig.root, 0.26, 0.2, 0.1, mat(0xb8d8ee, 0.5), 0.22, b.ll + b.th * 0.78, 0.27);
  box(fig.root, 0.3, 0.06, 0.12, mat(TAPE, 0.8), 0.22, b.ll + b.th * 0.7, 0.27);
};

APPLY["wrap-torso-wide"] = function (fig) {
  var b = rawBody(fig);
  box(fig.root, b.sideX * 2 + 0.1, b.th * 0.35, 0.66, mat(0xf4f6f8, 0.75), 0, b.ll + b.th * 0.35, 0);
};

// ---- family M — mobility & supports ---------------------------------------
// Freestanding supports place relative to refs.standFloor (where the
// standing-supported pose puts the figure); the resolver pairs them with
// that pose in phase E, the gallery does it via the catalog pose field.

APPLY["seat-wheeled"] = function (fig, refs, g) {
  var ch = new THREE.Group();
  ch.position.set(refs.standFloor.x - 1.15, 0, refs.standFloor.z + 0.18);
  ch.rotation.y = 0.6;
  var frameM = mat(0x5b6675, 0.55);
  var cushion = mat(0x7a8aa0, 0.8);
  box(ch, 0.52, 0.07, 0.48, cushion, 0, 0.5, 0.05);
  var back = box(ch, 0.52, 0.5, 0.07, cushion, 0, 0.82, -0.22);
  back.rotation.x = -0.12;
  box(ch, 0.06, 0.05, 0.4, frameM, -0.29, 0.66, 0.06);
  box(ch, 0.06, 0.05, 0.4, frameM, 0.29, 0.66, 0.06);
  var w1 = cyl(g, 0.3, 0.05, mat(0x3d4450, 0.5), 0, 0, 0); // placed below
  w1.rotation.z = Math.PI / 2; w1.position.set(-0.31, 0.3, -0.08); ch.add(w1);
  var w2 = cyl(g, 0.3, 0.05, mat(0x3d4450, 0.5), 0, 0, 0);
  w2.rotation.z = Math.PI / 2; w2.position.set(0.31, 0.3, -0.08); ch.add(w2);
  var c1 = cyl(g, 0.08, 0.04, mat(0x3d4450, 0.5), 0, 0, 0);
  c1.rotation.z = Math.PI / 2; c1.position.set(-0.22, 0.08, 0.3); ch.add(c1);
  var c2 = cyl(g, 0.08, 0.04, mat(0x3d4450, 0.5), 0, 0, 0);
  c2.rotation.z = Math.PI / 2; c2.position.set(0.22, 0.08, 0.3); ch.add(c2);
  box(ch, 0.4, 0.04, 0.16, frameM, 0, 0.16, 0.42);
  g.add(ch);
};

APPLY["frame-support"] = function (fig, refs, g) {
  var fr = new THREE.Group();
  fr.position.set(refs.standFloor.x + 0.02, 0, refs.standFloor.z + 0.45);
  var metalM = mat(0x9aa5b1, 0.5);
  [[-0.26, -0.16], [0.26, -0.16], [-0.26, 0.16], [0.26, 0.16]].forEach(function (p) {
    cyl(fr, 0.026, 0.66, metalM, p[0], 0.33, p[1]);
  });
  box(fr, 0.06, 0.05, 0.42, metalM, -0.26, 0.68, 0);
  box(fr, 0.06, 0.05, 0.42, metalM, 0.26, 0.68, 0);
  box(fr, 0.56, 0.05, 0.06, metalM, 0, 0.68, 0.18);
  box(fr, 0.56, 0.04, 0.05, metalM, 0, 0.36, 0.18);
  g.add(fr);
};

APPLY["stick-single"] = function (fig, refs, g) {
  var st = new THREE.Group();
  st.position.set(refs.standFloor.x + 0.42, 0, refs.standFloor.z + 0.12);
  cyl(st, 0.022, 0.9, mat(0x8a94a2, 0.5), 0, 0.45, 0);
  box(st, 0.18, 0.05, 0.06, mat(0x5b6675, 0.6), -0.03, 0.92, 0);
  cyl(st, 0.04, 0.05, mat(0x3d4450, 0.7), 0, 0.025, 0);
  g.add(st);
};

APPLY["poles-underarm"] = function (fig, refs, g) {
  [-0.36, 0.36].forEach(function (dx) {
    var p = new THREE.Group();
    p.position.set(refs.standFloor.x + dx, 0, refs.standFloor.z + 0.12);
    cyl(p, 0.025, 1.0, mat(0x9aa5b1, 0.5), 0, 0.5, 0);
    box(p, 0.09, 0.07, 0.26, mat(0xc9b8a8, 0.8), 0, 1.02, 0);
    box(p, 0.05, 0.05, 0.2, mat(0x5b6675, 0.6), 0, 0.6, 0.03);
    cyl(p, 0.04, 0.04, mat(0x3d4450, 0.7), 0, 0.02, 0);
    g.add(p);
  });
};

APPLY["platform-transport"] = function (fig, refs, g) {
  // parked alongside in the catalog; the resolver swaps it in for the
  // station in arrival scenes (phase F)
  var pt = new THREE.Group();
  pt.position.set(0, 0, refs.standFloor.z + 0.85);
  box(pt, 1.7, 0.07, 0.6, mat(UNIT, 0.6), 0, 0.82, 0);
  box(pt, 1.6, 0.06, 0.54, mat(0xeef2f5, 0.85), 0, 0.885, 0);
  [[-0.7, -0.2], [0.7, -0.2], [-0.7, 0.2], [0.7, 0.2]].forEach(function (p) {
    cyl(pt, 0.035, 0.78, mat(0x9aa5b1, 0.5), p[0], 0.41, p[1]);
    cyl(pt, 0.07, 0.14, mat(0x4a4642, 0.7), p[0], 0.07, p[1]);
  });
  g.add(pt);
};

APPLY["pouch-arm-sling"] = function (fig) {
  var b = rawBody(fig);
  var al = fig.dims.armLen;
  var armR = fig.parts.armR;
  var armX = armR.position.x;
  var shY = armR.position.y;
  armR.rotation.x = -1.25; // forearm bent up across the front
  box(fig.root, 0.36, 0.24, al * 0.72, mat(0xe8e2d4, 0.8), armX - 0.03, shY - 0.32 * al - 0.12, al * 0.48);
  var strap = box(fig.root, 0.08, 1.45, 0.05, mat(0xd9d2c2, 0.8), -0.05, shY - 0.28, 0.3);
  strap.rotation.z = 1.14;
};

// ---- family B — bedside & staging -----------------------------------------

var STAGE_SLOTS = [[0, 0], [-0.2, 0.09], [0.2, -0.09], [0.02, -0.17]];
APPLY["table-side"] = function (fig, refs, g) {
  // the table itself is core scenery; each occurrence stages one generic
  // brought item in its own slot (resolver appends per "bring to bedside")
  var n = g.userData.stagedCount || 0;
  g.userData.stagedCount = n + 1;
  var slot = STAGE_SLOTS[Math.min(n, STAGE_SLOTS.length - 1)];
  var tx = refs.tableTop.x + slot[0];
  var tz = refs.tableTop.z + slot[1];
  box(g, 0.26, 0.13, 0.18, mat(0xf7f3ea, 0.7), tx, refs.tableTop.y + 0.065, tz);
  box(g, 0.3, 0.03, 0.02, mat(0x9aa5b1, 0.55), tx, refs.tableTop.y + 0.02, tz + 0.1);
};

APPLY["machine-support"] = function (fig, refs, g) {
  supportMachine(g, refs);
};

APPLY["pump-box"] = function (fig, refs, g) {
  box(g, 0.22, 0.3, 0.16, mat(UNIT, 0.6), refs.standXZ.x + 0.11, 1.12, refs.standXZ.z);
  box(g, 0.16, 0.05, 0.02, mat(0x9fd8c6, 0.4), refs.standXZ.x + 0.11, 1.2, refs.standXZ.z + 0.09);
};

APPLY["canister-rail"] = function (fig, refs, g) {
  var rh = refs.railHang;
  box(g, 0.05, 0.1, 0.06, mat(0x8fa3b8, 0.55), -0.1, rh.y, rh.z);
  cyl(g, 0.095, 0.3, mat(0xe8eef4, 0.4), -0.1, rh.y - 0.13, rh.z + 0.04);
  cyl(g, 0.05, 0.05, mat(0xaab6c4, 0.55), -0.1, rh.y + 0.04, rh.z + 0.04);
  box(g, 0.19, 0.05, 0.02, mat(0xc9d6de, 0.5), -0.1, rh.y - 0.2, rh.z + 0.14);
};

APPLY["meter-head-wall"] = function (fig, refs, g) {
  // the head-end column: a slim floor post standing in for the head wall
  var mx = refs.standXZ.x + 0.12, mz = -0.55;
  cyl(g, 0.03, 1.7, mat(0x8b95a2, 0.55), mx, 0.85, mz);
  box(g, 0.2, 0.28, 0.14, mat(UNIT, 0.6), mx, 1.5, mz);
  box(g, 0.14, 0.05, 0.02, mat(0x9fd8c6, 0.4), mx, 1.56, mz + 0.08);
  cylOnFront(g, 0.035, 0.03, 0xaab6c4, mx, 1.44, mz + 0.08);
};

APPLY["basin-table"] = function (fig, refs, g) {
  var t = refs.tableTop;
  var m = mat(0xcfd8dc, 0.6);
  box(g, 0.32, 0.03, 0.22, m, t.x, t.y + 0.015, t.z);
  box(g, 0.32, 0.09, 0.03, m, t.x, t.y + 0.06, t.z - 0.095);
  box(g, 0.32, 0.09, 0.03, m, t.x, t.y + 0.06, t.z + 0.095);
  box(g, 0.03, 0.09, 0.22, m, t.x - 0.145, t.y + 0.06, t.z);
  box(g, 0.03, 0.09, 0.22, m, t.x + 0.145, t.y + 0.06, t.z);
};

APPLY["light-panel-crib"] = function (fig, refs, g) {
  var glow = new THREE.MeshStandardMaterial({
    color: 0xfff6e0, emissive: 0xffe9b8, emissiveIntensity: 0.75, roughness: 0.6
  });
  cyl(g, 0.028, 0.5, mat(0x9aa5b1, 0.5), -0.62, 1.5, -0.15);
  cyl(g, 0.028, 0.5, mat(0x9aa5b1, 0.5), 0.62, 1.5, -0.15);
  box(g, 1.1, 0.06, 0.6, glow, 0, 1.78, -0.05);
};

APPLY["mitts-soft"] = function (fig) {
  var al = fig.dims.armLen;
  var m = mat(0xf6eef2, 0.85);
  box(fig.parts.armL, 0.34, 0.22, 0.42, m, 0, -al + 0.02, 0);
  box(fig.parts.armR, 0.34, 0.22, 0.42, m, 0, -al + 0.02, 0);
};

APPLY["soother"] = function (fig) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  cylOnFront(headG, 0.1 * h, 0.05, 0xf2b8c8, 0, -0.26 * h, 0.45 * h);
  cylOnFront(headG, 0.05 * h, 0.05, 0xe89ab2, 0, -0.26 * h, 0.48 * h);
};

APPLY["rails-up"] = function (fig, refs) { refs.setNearRail(true); };
APPLY["rails-down"] = function (fig, refs) { refs.setNearRail(false); };

// ---- family E — monitoring & everyday (owner extension 2026-07-05) --------
// Frequently-seen everyday items so common cases read right without any
// heavier support family.

// thin surface wire between two torso-front points (for the lead bundle)
function torsoWire(fig, x1, y1, x2, y2) {
  var dx = x2 - x1, dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy);
  var w = box(fig.root, 0.022, len, 0.02, mat(0xb9c4ce, 0.5), (x1 + x2) / 2, (y1 + y2) / 2, 0.287);
  w.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
}

APPLY["leads-torso"] = function (fig, refs, g, worldRoot) {
  var b = rawBody(fig);
  var spots = [[-0.2, 0.72], [0.2, 0.72], [-0.12, 0.45]];
  var hubX = 0.3, hubY = b.ll + 0.4 * b.th;
  spots.forEach(function (sp) {
    var y = b.ll + sp[1] * b.th;
    cylOnFront(fig.root, 0.05, 0.03, 0xf2f6fa, sp[0], y, 0.288);
    cylOnFront(fig.root, 0.02, 0.032, 0x9fd8c6, sp[0], y, 0.29);
    torsoWire(fig, sp[0], y, hubX, hubY);
  });
  var anchor = worldPoint(worldRoot, fig.root, hubX + 0.03, hubY, 0.24);
  var rh = refs.railHang;
  tube(g, [
    anchor,
    new THREE.Vector3((anchor.x + rh.x) / 2, Math.min(anchor.y, rh.y) - 0.12, (anchor.z + rh.z) / 2 + 0.18),
    new THREE.Vector3(rh.x, rh.y + 0.02, rh.z)
  ], 0.011, 0xb9c4ce);
};

APPLY["clip-hand"] = function (fig, refs, g, worldRoot) {
  var al = fig.dims.armLen;
  var armR = fig.parts.armR;
  box(armR, 0.2, 0.12, 0.26, mat(0xe8eef4, 0.5), 0, -al + 0.02, 0.08);
  var glowM = new THREE.MeshStandardMaterial({
    color: 0xff8a7a, emissive: 0xe0432f, emissiveIntensity: 0.9, roughness: 0.4
  });
  box(armR, 0.06, 0.05, 0.06, glowM, 0, -al - 0.05, 0.12);
  var anchor = worldPoint(worldRoot, armR, 0, -al - 0.06, 0.1);
  var rh = refs.railHang;
  tube(g, [
    anchor,
    new THREE.Vector3((anchor.x + rh.x) / 2, Math.min(anchor.y, rh.y) - 0.14, (anchor.z + rh.z) / 2 + 0.15),
    new THREE.Vector3(rh.x + 0.1, rh.y, rh.z)
  ], 0.01, 0xb9c4ce);
};

APPLY["cuff-limb"] = function (fig, refs, g, worldRoot, limb) {
  var p = limbPart(fig, limb);
  box(p.seg, p.w + 0.04, p.len * 0.3, p.d + 0.04, mat(0xd9e3f0, 0.6), 0, -p.len * 0.22, 0);
  box(p.seg, 0.1, 0.12, 0.06, mat(0xaab6c4, 0.5), 0, -p.len * 0.22, p.d / 2 + 0.06);
};

APPLY["band-id-wrist"] = function (fig) {
  var al = fig.dims.armLen;
  box(fig.parts.armR, 0.29, 0.055, 0.37, mat(0xfdfdfd, 0.5), 0, -al * 0.86, 0);
  box(fig.parts.armR, 0.12, 0.045, 0.02, mat(0xdfe5ea, 0.5), 0, -al * 0.86, 0.19);
};

APPLY["blanket-lap"] = function (fig) {
  // rests ON the forward legs (settled/edge-sit): leg top is hip + half
  // leg thickness, blanket runs most of the leg length
  var b = rawBody(fig);
  var w = b.sideX * 2 + 0.34;
  box(fig.root, w, 0.12, b.ll * 0.9, mat(0xbcd4bc, 0.95), 0, b.ll + 0.24, b.ll * 0.45);
  box(fig.root, w + 0.02, 0.06, 0.2, mat(0xafc9af, 0.95), 0, b.ll + 0.29, b.ll * 0.12);
};

APPLY["strip-small"] = function (fig) {
  var al = fig.dims.armLen;
  box(fig.parts.armL, 0.16, 0.07, 0.03, mat(TAPE, 0.8), 0.02, -al * 0.5, 0.18);
  box(fig.parts.armL, 0.06, 0.05, 0.034, mat(0xe0bd9e, 0.8), 0.02, -al * 0.5, 0.181);
};

APPLY["cap-knit"] = function (fig) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  // the cap replaces the hair — hide the tagged hair meshes so no style
  // pokes through the crown
  headG.children.forEach(function (c) {
    if (c.userData && c.userData.hair) c.visible = false;
  });
  var m = mat(0x9fd4cc, 0.9);
  box(headG, 1.05 * h, 0.34 * h, 0.95 * h, m, 0, 0.42 * h, -0.01);
  box(headG, 1.08 * h, 0.1 * h, 0.98 * h, mat(0x8cc4bc, 0.9), 0, 0.26 * h, -0.01);
  box(headG, 0.16 * h, 0.14 * h, 0.16 * h, mat(0xf2f6fa, 0.9), 0, 0.65 * h, -0.01);
};

APPLY["shade-eyes-band"] = function (fig) {
  var h = fig.dims.headS;
  var headG = fig.parts.headG;
  var m = mat(0xb8a8d8, 0.8);
  box(headG, 0.97 * h, 0.2 * h, 0.05, m, 0, 0.05 * h, 0.43 * h);
  box(headG, 0.03, 0.06 * h, 0.9 * h, m, -0.49 * h, 0.05 * h, 0);
  box(headG, 0.03, 0.06 * h, 0.9 * h, m, 0.49 * h, 0.05 * h, 0);
  box(headG, 0.99 * h, 0.06 * h, 0.03, m, 0, 0.05 * h, -0.44 * h);
};

// applyAccessories(fig, refs, ids, worldRoot) -> a world-space group of the
// freestanding pieces (may be empty). Entries are "id" or "id@limb" (the
// resolver's limb pick). Unknown ids are SKIPPED silently — same contract
// as the 2D tag registry.
export function applyAccessories(fig, refs, ids, worldRoot) {
  var g = new THREE.Group();
  worldRoot.add(g);
  (ids || []).forEach(function (raw) {
    var parts = String(raw).split("@");
    var fn = APPLY[parts[0]];
    if (fn) fn(fig, refs, g, worldRoot, parts[1] || "");
  });
  return g;
}
