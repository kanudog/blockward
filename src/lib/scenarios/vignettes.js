// Vignette engine — spec schema, seed bank, resolver, validator.
//
// A vignette is DATA, not code: a spec object combining a small library of
// hand-crafted primitives (rendered by components/player/VignetteView.jsx).
// Anything that can fill this schema — a person, the generation engine, or a
// small model following docs/VIGNETTE-COOKBOOK.md — can author high-detail
// vignettes without touching rendering code. Invalid or unknown specs never
// break the UI: validation failures and unmatched descriptors fall back to
// the generic inspect vignette.
//
// SPEC SHAPE
//   {
//     id: "kebab-case-id",
//     caption: "small text under the drawing"   // tokens: {rate} {sec}
//     field: "surface" | "none",                // figure-tone backdrop
//     layers: [ { kind: ..., ...params }, ... ] // drawn in order
//   }
//
// LAYER KINDS (params documented in the cookbook):
//   mound        { period:"cycleRate"|number, hitch:0..1|false }
//   mark         { variant:"concentric"|"cluster"|"spread"|"raised", x,y (%) }
//   frame        { settleX, settleY (%), dur }
//   markerPair   { left:{reacts,scale}, right:{reacts,scale}, sweep:bool }
//   ripple       { x,y (%), dur:"responseSec"|number, extraDelay:number }
//   segment      { variant:"straight"|"bent", bend:degrees, marker:bool }
//   sweepBand    { dur }
//   gradientShift{ area:"edges"|"center", tone:"dim"|"warm"|"cool" }
//   splitTone    { left:"warm"|"cool"|"base", right:"warm"|"cool"|"base" }
//   magnifier    { }

var LAYER_KINDS = ["mound", "mark", "frame", "markerPair", "ripple", "limb", "segment", "seam", "rim", "rhythmPoint", "refill", "press", "sweepBand", "gradientShift", "splitTone", "magnifier"];

export function validateVignetteSpec(spec) {
  var errors = [];
  if (!spec || typeof spec !== "object") return { ok: false, errors: ["spec is not an object"] };
  if (typeof spec.id !== "string" || !spec.id) errors.push("missing id");
  if (!Array.isArray(spec.layers) || spec.layers.length === 0) errors.push("layers must be a non-empty array");
  (spec.layers || []).forEach(function (l, i) {
    if (!l || LAYER_KINDS.indexOf(l.kind) < 0) errors.push("layer " + i + ": unknown kind " + (l && l.kind));
  });
  return { ok: errors.length === 0, errors: errors };
}

// ---- the seed bank -----------------------------------------------------------
export var VIGNETTE_BANK = {
  "cycle-rise": {
    id: "cycle-rise", caption: "cycle · ≈ {rate} per minute", field: "none",
    layers: [{ kind: "mound", period: "cycleRate" }]
  },
  "cycle-hitch": {
    id: "cycle-hitch", caption: "cycle · ≈ {rate} per minute · with a catch", field: "none",
    layers: [{ kind: "mound", period: "cycleRate", hitch: 0.45 }]
  },
  "surface-mark-single": {
    id: "surface-mark-single", caption: "surface · settled on the mark", field: "surface",
    layers: [{ kind: "mark", variant: "concentric", x: 60, y: 44 }, { kind: "frame", settleX: 60, settleY: 44, dur: 4.6 }]
  },
  "surface-mark-cluster": {
    id: "surface-mark-cluster", caption: "surface · a close group of marks", field: "surface",
    layers: [{ kind: "mark", variant: "cluster", x: 58, y: 46 }, { kind: "frame", settleX: 58, settleY: 46, dur: 4.6 }]
  },
  "surface-mark-spread": {
    id: "surface-mark-spread", caption: "surface · scattered widely", field: "surface",
    layers: [{ kind: "mark", variant: "spread", x: 50, y: 46 }, { kind: "sweepBand", dur: 3.2 }]
  },
  "surface-mark-raised": {
    id: "surface-mark-raised", caption: "surface · raised to the touch", field: "surface",
    layers: [{ kind: "mark", variant: "raised", x: 58, y: 46 }, { kind: "frame", settleX: 58, settleY: 46, dur: 4.6 }]
  },
  "tone-dim-edges": {
    id: "tone-dim-edges", caption: "surface tone · dimmer toward the edges", field: "surface",
    layers: [{ kind: "gradientShift", area: "edges", tone: "dim" }, { kind: "sweepBand", dur: 2.6 }]
  },
  "tone-split-warm": {
    id: "tone-split-warm", caption: "warmth · warm at the core, cool at the edges", field: "surface",
    layers: [{ kind: "gradientShift", area: "center", tone: "warm" }, { kind: "gradientShift", area: "edges", tone: "cool" }]
  },
  "tone-split-sides": {
    id: "tone-split-sides", caption: "warmth · one side warm, the other cool", field: "surface",
    layers: [{ kind: "splitTone", left: "warm", right: "cool" }]
  },
  "paired-response": {
    id: "paired-response", caption: "paired check · one responds", field: "surface",
    layers: [{ kind: "markerPair", left: { reacts: true, scale: 1 }, right: { reacts: false, scale: 1.35 }, sweep: true }]
  },
  "paired-response-none": {
    id: "paired-response-none", caption: "paired check · neither responds", field: "surface",
    layers: [{ kind: "markerPair", left: { reacts: false, scale: 1.2 }, right: { reacts: false, scale: 1.2 }, sweep: true }]
  },
  "paired-asymmetric": {
    id: "paired-asymmetric", caption: "paired check · both respond, unevenly", field: "surface",
    layers: [{ kind: "markerPair", left: { reacts: true, scale: 0.9 }, right: { reacts: true, scale: 1.3 }, sweep: true }]
  },
  "response-ripple": {
    id: "response-ripple", caption: "response ≈ {sec} s", field: "surface",
    layers: [{ kind: "ripple", x: 50, y: 44, dur: "responseSec" }]
  },
  "response-delayed": {
    id: "response-delayed", caption: "response · notably delayed", field: "surface",
    layers: [{ kind: "ripple", x: 50, y: 44, dur: "responseSec", extraDelay: 1.2 }]
  },
  // Isolated-object vignettes (no surface rectangle — the finding itself,
  // centered on the panel).
  "limb-align": {
    id: "limb-align", caption: "limb · sits straight", field: "none",
    layers: [{ kind: "limb", variant: "straight" }]
  },
  "limb-bent": {
    id: "limb-bent", caption: "limb · out of line", field: "none",
    layers: [{ kind: "limb", variant: "bent", marker: true }]
  },
  "rim-swell": {
    id: "rim-swell", caption: "rim · swollen and soft", field: "none",
    layers: [{ kind: "rim" }]
  },
  "surface-seam": {
    id: "surface-seam", caption: "surface · a closed seam, edges settled", field: "surface",
    layers: [{ kind: "seam", x: 50, y: 44 }, { kind: "frame", settleX: 50, settleY: 44, dur: 4.6 }]
  },
  "rhythm-point": {
    id: "rhythm-point", caption: "rhythm at the point · ≈ {rate} per minute", field: "none",
    layers: [{ kind: "rhythmPoint", period: "cycleRate" }]
  },
  "refill-check": {
    id: "refill-check", caption: "press · color returns in ≈ {sec} s", field: "none",
    layers: [{ kind: "refill", sec: "responseSec" }]
  },
  "core-exam": {
    id: "core-exam", caption: "core · soft and settled", field: "none",
    layers: [{ kind: "mound", period: "cycleRate" }, { kind: "press" }]
  },
  "inspect-fallback": {
    id: "inspect-fallback", caption: "closer look", field: "surface",
    layers: [{ kind: "magnifier" }]
  }
};

// ---- resolver ----------------------------------------------------------------
// Descriptor keywords → bank ids. Checked in order; first hit wins. Keep the
// more specific words first. Anything unmatched returns null (callers use the
// region default, then the fallback).
var KEYWORD_MAP = [
  ["hitch", "cycle-hitch"], ["catch", "cycle-hitch"],
  ["cycle", "cycle-rise"], ["motion", "cycle-rise"],
  ["cluster", "surface-mark-cluster"],
  ["spread", "surface-mark-spread"], ["scatter", "surface-mark-spread"],
  ["raised", "surface-mark-raised"], ["welt", "surface-mark-raised"],
  ["mark", "surface-mark-single"], ["sting", "surface-mark-single"],
  ["warmth", "tone-split-warm"], ["warm", "tone-split-warm"],
  ["dim", "tone-dim-edges"], ["tone", "tone-dim-edges"],
  ["neither", "paired-response-none"],
  ["uneven", "paired-asymmetric"], ["asymmetric", "paired-asymmetric"],
  ["paired", "paired-response"],
  ["refill", "refill-check"],
  ["rhythm point", "rhythm-point"], ["point check", "rhythm-point"],
  ["delay", "response-delayed"], ["slowed", "response-delayed"],
  ["response", "response-ripple"],
  ["seam", "surface-seam"], ["closed line", "surface-seam"],
  ["swollen", "rim-swell"], ["rim", "rim-swell"], ["swell", "rim-swell"],
  ["bent", "limb-bent"], ["out of line", "limb-bent"], ["misalign", "limb-bent"],
  ["limb", "limb-align"], ["segment", "limb-align"],
  ["core exam", "core-exam"], ["soft and settled", "core-exam"]
];

export function vignetteIdForDescriptor(text) {
  var s = String(text || "").toLowerCase();
  for (var i = 0; i < KEYWORD_MAP.length; i++) {
    if (s.indexOf(KEYWORD_MAP[i][0]) >= 0) return KEYWORD_MAP[i][1];
  }
  return null;
}

// Region defaults when no finding resolves to something more specific.
export var REGION_DEFAULT_VIGNETTES = {
  upper: "paired-response",
  motion: "cycle-rise",
  surface: "surface-mark-single",
  response: "response-ripple",
  core: "inspect-fallback"
};

// The safe accessor every caller should use: returns a VALID spec, always.
export function vignetteSpec(id) {
  var spec = VIGNETTE_BANK[id];
  if (spec && validateVignetteSpec(spec).ok) return spec;
  return VIGNETTE_BANK["inspect-fallback"];
}
