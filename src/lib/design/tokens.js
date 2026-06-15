// Block Ward design tokens — Stage 4 "Midnight Neon" (direction C).
//
// Single source of truth for the liquid-glass look: palette, glass recipe,
// type scale, spacing, radii, motion, and a few inline-style builder helpers.
// Per the project style these are plain objects + plain function declarations,
// merged into components with Object.assign — no Tailwind, no template literals.
//
// Direction locked 2026-06-11 (C · Midnight Neon): near-black indigo base,
// vivid cyan + indigo accents, glossy frosted glass with a soft edge glow.

// ---- palette ----------------------------------------------------------------
export var COLOR = {
  bg0: "#06080f",         // deepest base
  bg1: "#0c1230",         // indigo base
  ink: "#ffffff",         // primary text
  ink2: "#c4cbdb",        // secondary text
  ink3: "#8b93a7",        // muted / hint
  ink4: "#5f6781",        // faint / footer
  accent: "#34d3ee",      // cyan — primary accent
  accent2: "#818cf8",     // indigo — secondary accent
  accentText: "#c4f4fb",  // legible text on a cyan-soft fill
  accent2Text: "#cdd3ff", // legible text on an indigo-soft fill
  danger: "#ff6b81",
  warn: "#fbbf24",
  ok: "#34d399"
};

// App background: near-black with cyan + indigo aurora blooms.
export var BG_APP = "radial-gradient(115% 75% at 12% 4%, rgba(34,211,238,0.16), transparent 44%), radial-gradient(130% 95% at 96% 100%, rgba(129,140,248,0.20), transparent 50%), linear-gradient(160deg,#06080f,#0c1230)";

// ---- type -------------------------------------------------------------------
export var FONT = {
  display: "'Fredoka',sans-serif",
  body: "'Nunito',sans-serif"
};

// ---- spacing / radii / motion ----------------------------------------------
export var SPACE = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export var RADIUS = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };
export var MOTION = { fast: "0.15s ease", base: "0.25s ease" };

// ---- glass recipe -----------------------------------------------------------
// Frosted-glass panel as an inline-style object. opts.glow adds the cyan edge
// halo (use on hero/alert surfaces); opts.subtle dials the blur/opacity down
// (use on dense list rows so the stack does not over-glow).
export function glass(opts) {
  opts = opts || {};
  var blur = opts.subtle ? "blur(16px) saturate(135%)" : "blur(22px) saturate(150%)";
  var bg = opts.subtle ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.075)";
  var shadow = "0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)";
  if (opts.glow) shadow = "0 10px 34px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.16), 0 0 26px rgba(34,211,238,0.12)";
  return {
    background: bg,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    border: "1px solid rgba(140,200,255,0.18)",
    borderRadius: RADIUS.lg,
    boxShadow: shadow
  };
}

// The same recipe as a CSS string, for the App.jsx <style> .bw-glass class so
// existing className="bw-glass" consumers pick up the new look in one place.
export var GLASS_CSS = "background:rgba(255,255,255,0.075);backdrop-filter:blur(22px) saturate(150%);-webkit-backdrop-filter:blur(22px) saturate(150%);border:1px solid rgba(140,200,255,0.18);box-shadow:0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)";

// ---- builders ---------------------------------------------------------------
// Small pill. kind: "accent" | "indigo" | "ok" | "neutral".
export function chip(kind) {
  var base = { fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: RADIUS.sm, letterSpacing: 0.2, display: "inline-block" };
  if (kind === "accent") return Object.assign({}, base, { background: "rgba(34,211,238,0.16)", color: COLOR.accentText, border: "1px solid transparent" });
  if (kind === "indigo") return Object.assign({}, base, { background: "rgba(129,140,248,0.18)", color: COLOR.accent2Text, border: "1px solid transparent" });
  if (kind === "ok") return Object.assign({}, base, { background: "rgba(52,211,153,0.14)", color: "#9ff0cf", border: "1px solid transparent" });
  return Object.assign({}, base, { background: "rgba(255,255,255,0.08)", color: COLOR.ink2, border: "1px solid rgba(255,255,255,0.10)" });
}

// Primary CTA button. kind: "accent" (cyan→indigo) | "indigo" (build).
export function cta(kind) {
  var base = { width: "100%", padding: "14px 0", borderRadius: RADIUS.md, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, fontFamily: FONT.display, letterSpacing: 0.2 };
  if (kind === "indigo") return Object.assign({}, base, { color: "#fff", background: "linear-gradient(135deg,#818cf8,#6366f1)", boxShadow: "0 6px 20px rgba(129,140,248,0.30), inset 0 1px 0 rgba(255,255,255,0.18)" });
  return Object.assign({}, base, { color: "#051a26", background: "linear-gradient(135deg,#34d3ee,#6f7bf6)", boxShadow: "0 6px 20px rgba(34,211,238,0.30), inset 0 1px 0 rgba(255,255,255,0.25)" });
}

// Stat / metric tile (the dashboard counters). tone: "accent" | "indigo" | "danger".
export function statTile(tone) {
  var map = {
    accent: { c: COLOR.accent, rgb: "34,211,238" },
    indigo: { c: "#aab4ff", rgb: "129,140,248" },
    danger: { c: COLOR.danger, rgb: "255,107,129" }
  };
  var t = map[tone] || map.accent;
  return {
    flex: 1, borderRadius: RADIUS.md, padding: 12, textAlign: "center",
    background: "linear-gradient(135deg,rgba(" + t.rgb + ",0.16),rgba(" + t.rgb + ",0.04))",
    border: "1px solid rgba(" + t.rgb + ",0.30)",
    _color: t.c
  };
}
