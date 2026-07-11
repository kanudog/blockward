// [SCENE3D ROOM] The room around the figure (phase B): warm floor, the two
// stations — slatted crib (bands A/B) or narrow raised bed (bands C/D, owner
// refinement 2026-07-04) — the stand at the head end (always), and the side
// table (the staging surface). Colors come from the SCENE token palette so
// the room follows the theme.
//
// LAZY CHAIN ONLY (imports `three`).
import * as THREE from "three";
import { mat, box, cyl } from "./kit.js";

// buildRoom(band, sc) -> { root, refs }
//   sc   — tokens SCENE palette (hex strings)
//   refs — placement landmarks for the pose system + camera:
//     kind        "crib" | "bed"
//     matTopY     mattress top (world y)
//     inclineTilt head-section angle for lying (0 on the flat crib)
//     lyingX      hip x for the lying carrier
//     sitX/sitZ   hip anchor for edge sitting (near long side)
//     jumpX       x for the celebrate spot on the mattress
//     standFloor  {x,z} floor spot beside the station
//     stationG    the station group (camera framing)
//     setNearRail(up) near-side rail/panel state
export function buildRoom(band, sc) {
  var root = new THREE.Group();
  var frame = mat(sc.frame);
  var frameLight = mat(sc.frameLight);
  var slat = mat(sc.slat);
  var mattress = mat(sc.mattress, 0.9);
  var metal = mat(sc.standPole, 0.55);
  var kind = (band === "A" || band === "B") ? "crib" : "bed";

  box(root, 6.4, 0.12, 6.4, mat(sc.floor, 0.95), 0, -0.06, 0);

  var stationG = new THREE.Group();
  root.add(stationG);
  var refs = { kind: kind, stationG: stationG };
  var L;

  if (kind === "bed") {
    // Narrow single-figure raised bed: long axis head(-x)→foot(+x), tall head
    // panel, shorter foot panel, metal side rails, inclined head section,
    // corner casters.
    L = 2.1;
    var W = 1.02;
    var MAT_TOP = 0.76;
    var INCLINE = 0.3;
    box(stationG, L, 0.22, W, frame, 0, 0.51, 0);
    box(stationG, 1.1, 0.18, W - 0.34, frame, 0, 0.3, 0);
    [[-0.9, -0.38], [0.9, -0.38], [-0.9, 0.38], [0.9, 0.38]].forEach(function (p) {
      cyl(stationG, 0.075, 0.15, mat(0x4a4642), p[0], 0.075, p[1]);
    });
    box(stationG, 0.09, 0.78, W + 0.12, frameLight, -(L / 2 + 0.045), 0.67, 0);
    box(stationG, 0.09, 0.52, W + 0.12, frameLight, (L / 2 + 0.045), 0.54, 0);
    var MW = W - 0.1;
    box(stationG, 1.46, 0.14, MW, mattress, 0.33, MAT_TOP - 0.07, 0);
    // Head section hinges at the junction with the flat section and rises
    // toward the head panel — the head-panel edge is the HIGHEST point
    // (owner correction: this is how a head-of-station moves).
    var matHead = box(stationG, 0.74, 0.14, MW, mattress, 0, 0, 0);
    matHead.rotation.z = -INCLINE;
    matHead.position.set(-0.4 - 0.37 * Math.cos(INCLINE), MAT_TOP - 0.07 + 0.37 * Math.sin(INCLINE), 0);
    var pillow = box(stationG, 0.4, 0.09, 0.5, mat(0xfdfaf6, 0.9), 0, 0, 0);
    pillow.rotation.z = -INCLINE;
    pillow.position.set(-0.82, 0.93, 0);
    function bedRail(zSide) {
      var g = new THREE.Group();
      stationG.add(g);
      var z = zSide * (W / 2 + 0.05);
      var b1 = cyl(g, 0.024, 0.92, metal, -0.28, 1.04, z); b1.rotation.z = Math.PI / 2;
      var b2 = cyl(g, 0.024, 0.92, metal, -0.28, 0.89, z); b2.rotation.z = Math.PI / 2;
      [-0.68, -0.28, 0.12].forEach(function (px) {
        cyl(g, 0.02, 0.44, metal, px, 0.82, z);
      });
      return g;
    }
    bedRail(-1);
    var nearRail = bedRail(1);
    refs.setNearRail = function (up) { nearRail.visible = !!up; };
    refs.matTopY = MAT_TOP;
    refs.inclineTilt = 0.26;
    // hips far enough toward the foot end that the raised head lands ON the
    // pillow instead of hovering at the head panel
    refs.lyingX = 0.15;
    refs.curlX = 0.42;
    refs.sitX = 0.35; refs.sitZ = W / 2 + 0.04;
    refs.jumpX = 0.55;
    refs.standFloor = { x: 0.3, z: W / 2 + 0.62 };
    refs.railHang = { x: 0.5, y: 0.82, z: W / 2 + 0.08 };
    // front side of the mattress toward the foot end — visible from the
    // camera's front quadrant, clear of every pose (lying feet end < 0.7)
    refs.companionSpot = { x: 0.82, z: 0.24 };
  } else {
    // Slatted crib, mockup proportions: solid storage base, HIGH mattress so
    // the figure stays visible, short slat rows above the mattress line; the
    // near long side drops for edge sitting.
    L = 1.7;
    var CW = 1.0;
    var CMAT = 0.74;
    box(stationG, 1.45, 0.5, CW - 0.24, frame, 0, 0.3, 0);              // storage base
    box(stationG, L, 0.12, CW, frame, 0, 0.56, 0);                      // deck
    box(stationG, L - 0.1, 0.12, CW - 0.08, mattress, 0, 0.68, 0);      // mattress (top 0.74)
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {
      box(stationG, 0.09, 1.3, 0.09, frameLight, c[0] * (L / 2 - 0.05), 0.65, c[1] * (CW / 2 - 0.05));
    });
    function slatRow(g, top, z) {
      box(g, L - 0.26, 0.07, 0.07, frameLight, 0, top, z);
      var i;
      for (i = 0; i < 6; i++) {
        var px = -0.6 + i * 0.24;
        box(g, 0.05, top - 0.62, 0.05, slat, px, (0.62 + top) / 2, z);
      }
    }
    var farSide = new THREE.Group(); stationG.add(farSide);
    slatRow(farSide, 1.18, -CW / 2);
    function endPanel(x, top) {
      box(stationG, 0.07, top - 0.62, CW + 0.06, frameLight, x, (0.62 + top) / 2, 0);
    }
    endPanel(-(L / 2 + 0.035), 1.26);
    endPanel((L / 2 + 0.035), 1.14);
    var nearUp = new THREE.Group(); stationG.add(nearUp);
    slatRow(nearUp, 1.18, CW / 2);
    var nearDown = new THREE.Group(); stationG.add(nearDown);
    slatRow(nearDown, 0.9, CW / 2);
    nearDown.visible = false;
    refs.setNearRail = function (up) { nearUp.visible = !!up; nearDown.visible = !up; };
    refs.matTopY = CMAT;
    refs.inclineTilt = 0;
    // shifted toward the foot end so the head clears the end panel
    refs.lyingX = 0.15;
    refs.curlX = 0.2;
    refs.sitX = 0.2; refs.sitZ = CW / 2 + 0.02;
    refs.jumpX = 0.15;
    refs.standFloor = { x: 0.25, z: CW / 2 + 0.6 };
    refs.railHang = { x: 0.5, y: 0.72, z: CW / 2 + 0.06 };
    refs.companionSpot = { x: 0.55, z: 0.26 };
  }

  // The stand — a bare floor pole at the head end, ALWAYS present. Pouches
  // accumulate on it per intervention (phase C/E).
  var standX = -(L / 2 + 0.42), standZ = 0.5;
  cyl(root, 0.035, 1.95, metal, standX, 0.975, standZ);
  cyl(root, 0.26, 0.06, mat(sc.standBase, 0.6), standX, 0.03, standZ);
  box(root, 0.4, 0.05, 0.05, metal, standX + 0.17, 1.86, standZ);
  refs.standXZ = { x: standX, z: standZ };

  // The side table — the staging surface for brought-to-bedside items
  // (phase C/E), empty in the core.
  var tX = L / 2 + 0.55, tZ = 0.9;
  box(root, 0.72, 0.07, 0.52, frame, tX, 0.72, tZ);
  [[-0.3, -0.19], [0.3, -0.19], [-0.3, 0.19], [0.3, 0.19]].forEach(function (p) {
    box(root, 0.06, 0.72, 0.06, frameLight, tX + p[0], 0.36, tZ + p[1]);
  });
  refs.tableTop = { x: tX, y: 0.755, z: tZ };

  return { root: root, refs: refs };
}
