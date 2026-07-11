// [SCENE3D POSES] The pose system (DIRECTION-3D §3) over the rigged figure
// and the room's placement refs. applyPose() positions and articulates the
// figure, sets the default face for the pose, and returns what the view loop
// needs: the node to add to the world plus animation hints.
//
// Default state — always, unless generated content says otherwise — is
// "settled": sitting up on the station, eyes open, soft smile, gentle
// idle bob.
//
// LAZY CHAIN ONLY (imports `three`).
import * as THREE from "three";

// Pose ids live in config.js (POSES) so UI never touches this lazy chunk.
//
// applyPose(fig, refs, poseId) -> { node, face, anim }
//   node — add THIS to the world (the figure root, or a carrier around it)
//   face — the pose's default face (a faceState override can replace it)
//   anim — { kind: "bob" | "jump" | "still", target, baseY }
export function applyPose(fig, refs, poseId) {
  var d = fig.dims;
  var root = fig.root;

  function lyingCarrier(eyes) {
    // Face-up along the station, head toward the head end (-x); on the bed
    // the upper body rides the inclined section. Same carrier math as the
    // approved mockup: fig lies face-up (hip at the tilt origin) → tilt →
    // yaw onto the long axis.
    root.rotation.x = -Math.PI / 2;
    root.position.set(0, 0, d.hipY);
    var tilt = new THREE.Group(); tilt.add(root);
    tilt.rotation.x = refs.inclineTilt;
    var carrier = new THREE.Group(); carrier.add(tilt);
    carrier.rotation.y = Math.PI / 2;
    carrier.position.set(refs.lyingX, refs.matTopY + d.depthHalf + 0.01, 0);
    return {
      node: carrier,
      face: { eyes: eyes, mouth: "neutral" },
      anim: { kind: "still", target: carrier, baseY: carrier.position.y }
    };
  }

  if (poseId === "lying-eyes-open") { refs.setNearRail(true); return lyingCarrier("open"); }
  if (poseId === "lying-eyes-closed") { refs.setNearRail(true); return lyingCarrier("closed"); }

  if (poseId === "sitting-edge") {
    // On the near LONG side with that side's rail down — never at the
    // head/foot panels. Hips on the mattress edge, legs hanging.
    refs.setNearRail(false);
    root.position.set(refs.sitX, refs.matTopY - (d.hipY - d.legHalf), refs.sitZ);
    return {
      node: root,
      face: { eyes: "open", mouth: "smile" },
      anim: { kind: "bob", target: root, baseY: root.position.y }
    };
  }

  if (poseId === "standing-supported") {
    // Beside the station on the floor; the mobility support itself is a
    // phase C accessory (M family) — the pose leaves room for it.
    refs.setNearRail(true);
    root.position.set(refs.standFloor.x, 0, refs.standFloor.z);
    root.rotation.y = 0.15;
    fig.parts.armL.rotation.z = -0.3;
    return {
      node: root,
      face: { eyes: "open", mouth: "smile" },
      anim: { kind: "bob", target: root, baseY: root.position.y }
    };
  }

  if (poseId === "curled-side") {
    // Resting on one side along the FLAT section (clear of the bed's
    // incline): body onto its side, head toward the head end, knees and
    // arms drawn toward the front, face tipped a little toward the viewer.
    refs.setNearRail(true);
    var ROLL = Math.PI / 2; // fully on the side — reads unambiguously as lying
    root.rotation.set(-0.1, -0.15, ROLL);
    fig.parts.legL.rotation.x = -1.05;
    fig.parts.legR.rotation.x = -0.9;
    fig.parts.armL.rotation.x = -0.65;
    fig.parts.armR.rotation.x = -0.5;
    fig.parts.headG.rotation.y = 0.3;
    root.position.set(
      refs.curlX + d.hipY * Math.sin(ROLL),
      refs.matTopY + d.torsoHalfW - d.hipY * Math.cos(ROLL),
      -0.05
    );
    return {
      node: root,
      face: { eyes: "closed", mouth: "neutral" },
      anim: { kind: "still", target: root, baseY: root.position.y }
    };
  }

  if (poseId === "celebrate") {
    // The FINAL beat: jumping for joy on the mattress, arms up, big grin.
    refs.setNearRail(true);
    root.position.set(refs.jumpX, refs.matTopY, 0);
    fig.parts.armL.rotation.z = -2.4;
    fig.parts.armR.rotation.z = 2.4;
    return {
      node: root,
      face: { eyes: "open", mouth: "grin" },
      anim: { kind: "jump", target: root, baseY: refs.matTopY }
    };
  }

  // "settled" — the default: sitting up on the mattress facing the front,
  // legs forward, calm and happy.
  refs.setNearRail(true);
  fig.parts.legL.rotation.x = -Math.PI / 2;
  fig.parts.legR.rotation.x = -Math.PI / 2;
  root.position.set(refs.lyingX, refs.matTopY - (d.hipY - d.legHalf), -0.14);
  return {
    node: root,
    face: { eyes: "open", mouth: "smile" },
    anim: { kind: "bob", target: root, baseY: root.position.y }
  };
}
