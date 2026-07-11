// [SCENE3D COMPANIONS] The stuffed companion pool (DIRECTION-3D §7, phase D):
// one small blocky plush per case, seeded in config.js (cfg.companion),
// sitting on the station near the figure. Deliberately cute, ~0.45 tall,
// origin at the seat point so placement is just position + a small yaw.
//
// LAZY CHAIN ONLY (imports `three`).
import * as THREE from "three";
import { mat, box } from "./kit.js";

var INK = 0x1f1f1f;

function beye(g, x, y, z, s) {
  box(g, s || 0.03, s || 0.03, 0.02, mat(INK, 0.4), x, y, z);
}

// The standard sitting plush: body, head, side arms, front feet, eyes.
// Makers add kind-specific features on top (or skip this for custom shapes).
function plush(g, bodyC, headC, opts) {
  var body = mat(bodyC, 0.85);
  var headM = mat(headC || bodyC, 0.85);
  box(g, 0.26, 0.24, 0.2, body, 0, 0.12, 0);
  box(g, 0.24, 0.2, 0.2, headM, 0, 0.33, 0.01);
  box(g, 0.07, 0.12, 0.08, body, -0.15, 0.1, 0.02);
  box(g, 0.07, 0.12, 0.08, body, 0.15, 0.1, 0.02);
  box(g, 0.08, 0.06, 0.12, body, -0.08, 0.04, 0.1);
  box(g, 0.08, 0.06, 0.12, body, 0.08, 0.04, 0.1);
  if (!opts || !opts.noEyes) {
    beye(g, -0.06, 0.35, 0.112);
    beye(g, 0.06, 0.35, 0.112);
  }
}

function roundEars(g, color, y, spread) {
  box(g, 0.07, 0.07, 0.05, mat(color, 0.85), -(spread || 0.09), y || 0.45, 0.01);
  box(g, 0.07, 0.07, 0.05, mat(color, 0.85), (spread || 0.09), y || 0.45, 0.01);
}

function pointEars(g, color) {
  box(g, 0.06, 0.09, 0.04, mat(color, 0.85), -0.09, 0.46, 0);
  box(g, 0.06, 0.09, 0.04, mat(color, 0.85), 0.09, 0.46, 0);
}

var MAKERS = {
  bear: function (g) {
    plush(g, 0x8a5f3f);
    roundEars(g, 0x7a5236);
    box(g, 0.1, 0.07, 0.04, mat(0xd9b895, 0.85), 0, 0.3, 0.11);
    beye(g, 0, 0.315, 0.135, 0.025);
  },
  dog: function (g) {
    plush(g, 0xc89a62, 0xcfa46e);
    box(g, 0.06, 0.13, 0.05, mat(0x9a7142, 0.85), -0.13, 0.38, 0);
    box(g, 0.06, 0.13, 0.05, mat(0x9a7142, 0.85), 0.13, 0.38, 0);
    box(g, 0.1, 0.08, 0.05, mat(0xe8d0a8, 0.85), 0, 0.29, 0.115);
    beye(g, 0, 0.31, 0.145, 0.025);
    box(g, 0.05, 0.05, 0.1, mat(0xc89a62, 0.85), 0, 0.12, -0.13);
  },
  cat: function (g) {
    plush(g, 0x9a9aa6);
    pointEars(g, 0x8c8c98);
    box(g, 0.03, 0.025, 0.02, mat(0xe08a9a, 0.7), 0, 0.31, 0.115);
    box(g, 0.05, 0.15, 0.05, mat(0x8c8c98, 0.85), 0.16, 0.1, -0.1);
  },
  rhino: function (g) {
    plush(g, 0xa8adb4);
    box(g, 0.05, 0.06, 0.03, mat(0x9aa0a8, 0.85), -0.09, 0.45, 0);
    box(g, 0.05, 0.06, 0.03, mat(0x9aa0a8, 0.85), 0.09, 0.45, 0);
    var horn = box(g, 0.05, 0.1, 0.05, mat(0xe8e4da, 0.7), 0, 0.33, 0.13);
    horn.rotation.x = -0.35;
    box(g, 0.04, 0.05, 0.04, mat(0xe8e4da, 0.7), 0, 0.39, 0.1);
  },
  lizard: function (g) {
    plush(g, 0x7fbf6a, 0x8cc977);
    var tail = box(g, 0.07, 0.05, 0.24, mat(0x6fae5c, 0.85), 0.1, 0.05, -0.18);
    tail.rotation.y = 0.4;
    box(g, 0.04, 0.05, 0.04, mat(0x5d9a4a, 0.85), 0, 0.45, -0.02);
    box(g, 0.04, 0.05, 0.04, mat(0x5d9a4a, 0.85), 0, 0.27, -0.09);
    box(g, 0.04, 0.05, 0.04, mat(0x5d9a4a, 0.85), 0, 0.18, -0.11);
  },
  tiger: function (g) {
    plush(g, 0xe08a3f);
    roundEars(g, 0xc9762f);
    box(g, 0.18, 0.035, 0.021, mat(0x3f2f22, 0.85), 0, 0.16, 0.101);
    box(g, 0.16, 0.03, 0.021, mat(0x3f2f22, 0.85), 0, 0.09, 0.101);
    box(g, 0.14, 0.03, 0.02, mat(0x3f2f22, 0.85), 0, 0.42, 0.111);
    box(g, 0.09, 0.07, 0.04, mat(0xf2e3cf, 0.85), 0, 0.295, 0.11);
    beye(g, 0, 0.31, 0.135, 0.025);
  },
  whale: function (g) {
    var body = mat(0x6a9fd8, 0.85);
    box(g, 0.34, 0.22, 0.24, body, 0, 0.13, 0);
    box(g, 0.3, 0.08, 0.25, mat(0xdfe9f2, 0.85), 0, 0.05, 0);
    box(g, 0.08, 0.06, 0.1, body, 0, 0.1, -0.16);
    var f1 = box(g, 0.1, 0.04, 0.08, body, -0.07, 0.12, -0.21); f1.rotation.y = 0.5;
    var f2 = box(g, 0.1, 0.04, 0.08, body, 0.07, 0.12, -0.21); f2.rotation.y = -0.5;
    box(g, 0.03, 0.07, 0.03, mat(0xcfe4f2, 0.7), 0, 0.28, 0);
    beye(g, -0.12, 0.16, 0.122);
    beye(g, 0.12, 0.16, 0.122);
  },
  toucan: function (g) {
    var black = mat(0x2b2b2b, 0.85);
    box(g, 0.2, 0.22, 0.18, black, 0, 0.12, 0);
    box(g, 0.16, 0.13, 0.02, mat(0xf2f2f2, 0.85), 0, 0.1, 0.09);
    box(g, 0.16, 0.15, 0.16, black, 0, 0.3, 0.01);
    box(g, 0.08, 0.07, 0.16, mat(0xe8913f, 0.7), 0, 0.3, 0.16);
    box(g, 0.082, 0.072, 0.04, mat(0x3f2f22, 0.7), 0, 0.3, 0.23);
    box(g, 0.06, 0.03, 0.08, mat(0xe8913f, 0.7), -0.06, 0.02, 0.06);
    box(g, 0.06, 0.03, 0.08, mat(0xe8913f, 0.7), 0.06, 0.02, 0.06);
    box(g, 0.06, 0.04, 0.1, black, 0, 0.1, -0.12);
    beye(g, -0.05, 0.34, 0.092);
    beye(g, 0.05, 0.34, 0.092);
  },
  snake: function (g) {
    var body = mat(0x6fae5c, 0.85);
    box(g, 0.3, 0.08, 0.3, body, 0, 0.04, 0);
    box(g, 0.24, 0.08, 0.24, body, 0.01, 0.12, -0.01);
    box(g, 0.18, 0.08, 0.18, body, 0.02, 0.2, 0);
    box(g, 0.1, 0.09, 0.14, mat(0x7cbb68, 0.85), 0.02, 0.28, 0.07);
    box(g, 0.015, 0.015, 0.05, mat(0xe05a5a, 0.6), 0.02, 0.26, 0.16);
    beye(g, -0.02, 0.31, 0.135, 0.022);
    beye(g, 0.06, 0.31, 0.135, 0.022);
  },
  gorilla: function (g) {
    plush(g, 0x3f3f45, 0x34343a, { noEyes: true });
    box(g, 0.09, 0.18, 0.1, mat(0x3f3f45, 0.85), -0.17, 0.09, 0.02);
    box(g, 0.09, 0.18, 0.1, mat(0x3f3f45, 0.85), 0.17, 0.09, 0.02);
    box(g, 0.16, 0.12, 0.02, mat(0xb59a82, 0.85), 0, 0.32, 0.105);
    box(g, 0.16, 0.03, 0.021, mat(0x2a2a2e, 0.85), 0, 0.385, 0.107);
    beye(g, -0.05, 0.345, 0.117);
    beye(g, 0.05, 0.345, 0.117);
  },
  penguin: function (g) {
    var black = mat(0x26262c, 0.85);
    box(g, 0.24, 0.32, 0.2, black, 0, 0.17, 0);
    box(g, 0.18, 0.22, 0.02, mat(0xf2f2f2, 0.85), 0, 0.13, 0.1);
    box(g, 0.05, 0.16, 0.1, black, -0.145, 0.16, 0);
    box(g, 0.05, 0.16, 0.1, black, 0.145, 0.16, 0);
    box(g, 0.05, 0.04, 0.06, mat(0xe8913f, 0.7), 0, 0.26, 0.12);
    box(g, 0.06, 0.03, 0.09, mat(0xe8913f, 0.7), -0.06, 0.015, 0.08);
    box(g, 0.06, 0.03, 0.09, mat(0xe8913f, 0.7), 0.06, 0.015, 0.08);
    beye(g, -0.05, 0.3, 0.102);
    beye(g, 0.05, 0.3, 0.102);
  },
  kangaroo: function (g) {
    plush(g, 0xc08152, 0xc98a5c);
    box(g, 0.05, 0.13, 0.04, mat(0xb37447, 0.85), -0.08, 0.48, -0.01);
    box(g, 0.05, 0.13, 0.04, mat(0xb37447, 0.85), 0.08, 0.48, -0.01);
    box(g, 0.14, 0.1, 0.03, mat(0xd0925f, 0.85), 0, 0.09, 0.105);
    box(g, 0.07, 0.05, 0.18, mat(0xb37447, 0.85), -0.09, 0.03, 0.1);
    box(g, 0.07, 0.05, 0.18, mat(0xb37447, 0.85), 0.09, 0.03, 0.1);
    var tail = box(g, 0.06, 0.06, 0.2, mat(0xb37447, 0.85), 0, 0.06, -0.17);
    tail.rotation.x = 0.35;
  },
  narwhal: function (g) {
    var body = mat(0xa9c4d9, 0.85);
    box(g, 0.32, 0.2, 0.22, body, 0, 0.12, 0);
    box(g, 0.28, 0.07, 0.23, mat(0xe4edf4, 0.85), 0, 0.045, 0);
    box(g, 0.07, 0.05, 0.09, body, 0, 0.09, -0.15);
    var f1 = box(g, 0.09, 0.04, 0.07, body, -0.06, 0.11, -0.19); f1.rotation.y = 0.5;
    var f2 = box(g, 0.09, 0.04, 0.07, body, 0.06, 0.11, -0.19); f2.rotation.y = -0.5;
    var horn = box(g, 0.03, 0.2, 0.03, mat(0xf2efe4, 0.6), 0, 0.28, 0.1);
    horn.rotation.x = -0.55;
    beye(g, -0.11, 0.15, 0.112);
    beye(g, 0.11, 0.15, 0.112);
  },
  panda: function (g) {
    plush(g, 0xf5f2ec, 0xf5f2ec, { noEyes: true });
    roundEars(g, 0x2b2b2b);
    box(g, 0.055, 0.07, 0.02, mat(0x2b2b2b, 0.85), -0.06, 0.34, 0.105);
    box(g, 0.055, 0.07, 0.02, mat(0x2b2b2b, 0.85), 0.06, 0.34, 0.105);
    box(g, 0.02, 0.02, 0.02, mat(0xf5f2ec, 0.5), -0.06, 0.35, 0.112);
    box(g, 0.02, 0.02, 0.02, mat(0xf5f2ec, 0.5), 0.06, 0.35, 0.112);
    box(g, 0.04, 0.03, 0.02, mat(0x2b2b2b, 0.85), 0, 0.3, 0.112);
    box(g, 0.08, 0.12, 0.08, mat(0x2b2b2b, 0.85), -0.15, 0.1, 0.02);
    box(g, 0.08, 0.12, 0.08, mat(0x2b2b2b, 0.85), 0.15, 0.1, 0.02);
  },
  platypus: function (g) {
    plush(g, 0x9a6b4a, 0xa3754f);
    box(g, 0.14, 0.05, 0.12, mat(0xd98f4a, 0.7), 0, 0.29, 0.15);
    box(g, 0.16, 0.04, 0.15, mat(0x7d5638, 0.85), 0, 0.05, -0.16);
    box(g, 0.08, 0.03, 0.1, mat(0xd98f4a, 0.7), -0.08, 0.02, 0.1);
    box(g, 0.08, 0.03, 0.1, mat(0xd98f4a, 0.7), 0.08, 0.02, 0.1);
    // the little green hat
    box(g, 0.24, 0.03, 0.21, mat(0x3f8f5f, 0.8), 0, 0.445, 0.01);
    box(g, 0.15, 0.1, 0.13, mat(0x357a50, 0.8), 0, 0.5, 0.01);
    box(g, 0.152, 0.025, 0.132, mat(0x2b6342, 0.8), 0, 0.465, 0.01);
  },
  armadillo: function (g) {
    plush(g, 0xb0a08a, 0xa8977e);
    box(g, 0.28, 0.09, 0.22, mat(0x8f8271, 0.85), 0, 0.19, -0.01);
    box(g, 0.26, 0.07, 0.2, mat(0x998b78, 0.85), 0, 0.255, -0.01);
    box(g, 0.05, 0.07, 0.03, mat(0x998b78, 0.85), -0.08, 0.45, 0);
    box(g, 0.05, 0.07, 0.03, mat(0x998b78, 0.85), 0.08, 0.45, 0);
    box(g, 0.06, 0.05, 0.06, mat(0x9c8d76, 0.85), 0, 0.3, 0.12);
  },
  octopus: function (g) {
    var body = mat(0xb88ac9, 0.85);
    box(g, 0.26, 0.2, 0.24, body, 0, 0.2, 0);
    box(g, 0.2, 0.08, 0.18, body, 0, 0.33, 0);
    var legs = [-0.1, -0.034, 0.034, 0.1];
    legs.forEach(function (lx) {
      box(g, 0.055, 0.1, 0.055, mat(0xa87ab8, 0.85), lx, 0.05, 0.08);
    });
    box(g, 0.055, 0.09, 0.055, mat(0xa87ab8, 0.85), -0.13, 0.05, -0.02);
    box(g, 0.055, 0.09, 0.055, mat(0xa87ab8, 0.85), 0.13, 0.05, -0.02);
    box(g, 0.045, 0.045, 0.02, mat(0xf2eef6, 0.5), -0.06, 0.23, 0.121);
    box(g, 0.045, 0.045, 0.02, mat(0xf2eef6, 0.5), 0.06, 0.23, 0.121);
    beye(g, -0.06, 0.23, 0.128, 0.026);
    beye(g, 0.06, 0.23, 0.128, 0.026);
  },
  fox: function (g) {
    plush(g, 0xe0733f, 0xe57c45);
    pointEars(g, 0xd06430);
    box(g, 0.1, 0.07, 0.03, mat(0xf5ead9, 0.85), 0, 0.3, 0.112);
    beye(g, 0, 0.315, 0.132, 0.023);
    box(g, 0.14, 0.1, 0.02, mat(0xf5ead9, 0.85), 0, 0.13, 0.101);
    box(g, 0.08, 0.07, 0.2, mat(0xd06430, 0.85), 0.13, 0.07, -0.14);
    box(g, 0.06, 0.05, 0.06, mat(0xf5ead9, 0.85), 0.13, 0.07, -0.235);
  },
  sloth: function (g) {
    plush(g, 0xa89a85, 0xb3a691, { noEyes: true });
    var s1 = box(g, 0.09, 0.035, 0.02, mat(0x5f5142, 0.85), -0.07, 0.345, 0.105);
    s1.rotation.z = -0.45;
    var s2 = box(g, 0.09, 0.035, 0.02, mat(0x5f5142, 0.85), 0.07, 0.345, 0.105);
    s2.rotation.z = 0.45;
    beye(g, -0.06, 0.345, 0.112, 0.024);
    beye(g, 0.06, 0.345, 0.112, 0.024);
    box(g, 0.05, 0.03, 0.02, mat(0x5f5142, 0.7), 0, 0.29, 0.112);
    box(g, 0.06, 0.2, 0.07, mat(0xa89a85, 0.85), -0.16, 0.05, 0.03);
    box(g, 0.06, 0.2, 0.07, mat(0xa89a85, 0.85), 0.16, 0.05, 0.03);
  },
  hedgehog: function (g) {
    plush(g, 0xd9bb90, 0xdfc59c);
    var spikeM = mat(0x6a4a30, 0.85);
    var sp = [[-0.08, 0.24, -0.06, 0.3], [0, 0.27, -0.08, 0], [0.08, 0.24, -0.06, -0.3],
      [-0.05, 0.18, -0.11, 0.5], [0.05, 0.18, -0.11, -0.5], [0, 0.42, -0.05, 0.15]];
    sp.forEach(function (p) {
      var s = box(g, 0.06, 0.11, 0.06, spikeM, p[0], p[1], p[2]);
      s.rotation.x = -0.5;
      s.rotation.z = p[3];
    });
    box(g, 0.06, 0.05, 0.07, mat(0xc9a878, 0.85), 0, 0.29, 0.125);
    beye(g, 0, 0.3, 0.165, 0.022);
  },
  axolotl: function (g) {
    plush(g, 0xf2a8c0, 0xf5b3c9);
    var gillM = mat(0xe06a8a, 0.8);
    [[-0.135, 0.42, 0.4], [-0.145, 0.34, 0], [-0.135, 0.26, -0.4]].forEach(function (p) {
      var s = box(g, 0.03, 0.08, 0.03, gillM, p[0], p[1], -0.02);
      s.rotation.z = p[2];
    });
    [[0.135, 0.42, -0.4], [0.145, 0.34, 0], [0.135, 0.26, 0.4]].forEach(function (p) {
      var s = box(g, 0.03, 0.08, 0.03, gillM, p[0], p[1], -0.02);
      s.rotation.z = p[2];
    });
    box(g, 0.06, 0.018, 0.02, mat(INK, 0.5), 0, 0.29, 0.112);
  }
};

// buildCompanion(kind) -> group. Unknown kinds fall back to the bear — the
// seeded pick always comes from config.COMPANIONS, so this is just a guard.
export function buildCompanion(kind) {
  var g = new THREE.Group();
  (MAKERS[kind] || MAKERS.bear)(g);
  return g;
}
