// Project BW design tokens — dual theme, picked at Gate 1 (2026-07-02):
//   light — "Warm Studio":     cream/sand room, clay accent, espresso hero device.
//   dark  — "Graphite Atelier": warm graphite room, jade accent, matte metal depth.
//
// Single source of truth for the look: palettes, type, spacing, radii, motion,
// and surface/elevation builders. Same module role as before; the superseded
// "Midnight Neon" glass recipe is REPLACED by surface() — there is no frosted
// glass anywhere in either theme (GLASS_CSS/glass() removed; see SURFACE_CSS).
//
// Both themes share ONE structural system (type stack, spacing, radii, motion,
// builder API, state semantics: amber attention on frames, calm green positive,
// uniform ink telemetry values, critical reserved for genuine hard-stops) and
// differ only in palette. Theme switching lives in themeStore.js (useTokens);
// this module stays pure data + pure functions.
//
// Per project style: plain objects + plain function declarations, merged with
// Object.assign — no Tailwind, no template literals.

// ---- shared structure --------------------------------------------------------
export var FONT = {
  display: "'Bricolage Grotesque',sans-serif",
  body: "'Nunito Sans',sans-serif",
  mono: "'Space Mono',monospace"
};

export var GOOGLE_FONTS_CSS = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');";

export var SPACE = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, pad: 16 };
export var RADIUS = { sm: 10, md: 12, lg: 16, xl: 20, pill: 999 };
export var MOTION = { fast: "0.16s ease", base: "0.24s ease" };

// ---- palettes ----------------------------------------------------------------
var LIGHT = {
  mode: "light",
  name: "Warm Studio",
  attnAnim: "attn-light",
  critAnim: "crit-light",
  revealMult: 1.15,
  COLOR: {
    ink: "#2E2A24", ink2: "#5C544A", ink3: "#8A8072",
    hairline: "#E7DECF",
    accent: "#C56A3E", accentDeep: "#A6522E", boldTerm: "#A6522E",
    attention: "#E0983B", attentionText: "#8F5E1D",
    positive: "#5E8C6A", positiveText: "#3D6B4B",
    critical: "#C24C3D",
    btnNeutralBg: "#F1E7D6", btnNeutralInk: "#5C544A"
  },
  ACCENT_RGB: "197,106,62", ATTN_RGB: "224,152,59", POS_RGB: "94,140,106", CRIT_RGB: "194,76,61",
  BG_APP: "linear-gradient(180deg,#FCF9F3 0%,#FAF4EA 100%)",
  MONITOR: {
    body: "#262119", grid: "rgba(224,152,59,0.07)",
    trace: "#E0983B", trace2: "#8A8072", leadDot: false,
    chipBg: "rgba(251,247,240,0.05)", chipBorder: "1px solid rgba(251,247,240,0.07)",
    label: "#B9AE9C", value: "#FBF7F0", unit: "#8A8072",
    valueFont: "'Space Mono',monospace", valueFeature: "normal",
    bandTrack: "rgba(251,247,240,0.14)", bandText: "#A79C89",
    frameIdle: "#3A342C",
    // Physical device housing: wide warm-white shell around the dark screen,
    // with corner controls and a status light rendered by TelemetryDisplay.
    housing: "linear-gradient(180deg,#FDFBF6 0%,#F2EDE2 100%)",
    housingBorder: "1px solid #E0D8C7",
    housingDetail: "#EDE7DA",
    housingDetailBorder: "#D6CDBA",
    housingInk: "#8A8072",
    bezelShadow: "0 14px 30px rgba(93,64,35,0.18), inset 0 1px 0 rgba(255,255,255,0.85)"
  },
  SURFACES: {
    inset: { background: "#ECE0CB", border: "none", boxShadow: "inset 0 2px 5px rgba(93,64,35,0.10)" },
    base: { background: "#F1E7D6", border: "none", boxShadow: "0 2px 6px rgba(93,64,35,0.06)" },
    card: { background: "#FFFFFF", border: "none", boxShadow: "0 2px 6px rgba(93,64,35,0.08), 0 10px 24px rgba(93,64,35,0.08)" },
    pop: { background: "#FFFFFF", border: "1px solid #EFE6D6", boxShadow: "0 24px 56px rgba(93,64,35,0.22)" }
  },
  TILE: {
    idle: { background: "#FFFFFF", border: "1px solid #F3ECDE", boxShadow: "0 1px 3px rgba(93,64,35,0.05)" },
    flagged: { background: "#F7E4D8", border: "1.5px solid #C56A3E" },
    caught: { background: "#DFF0E4", border: "1.5px solid #5E8C6A" },
    missed: { background: "#F9ECD4", border: "1.5px solid #E0983B" },
    inband: { background: "#FDFBF7", border: "1px dashed #D9CDB8" }
  },
  CHIP: {
    accent: { background: "#F7E4D8", color: "#8F4520", border: "1px solid #EFCFBB" },
    attention: { background: "#F9ECD4", color: "#8F5E1D", border: "1px solid #F0DAB2" },
    positive: { background: "#DFF0E4", color: "#3D6B4B", border: "1px solid #C4E0CD" },
    critical: { background: "#F6DED9", color: "#8C3327", border: "1px solid #EDC4BC" },
    neutral: { background: "#F1E7D6", color: "#5C544A", border: "1px solid #E7DECF" }
  },
  CTA: {
    primary: { color: "#FFF8F0", background: "#C56A3E", boxShadow: "0 6px 16px rgba(197,106,62,0.30)" },
    positive: { color: "#F6FBF7", background: "#5E8C6A", boxShadow: "0 6px 16px rgba(94,140,106,0.28)" },
    critical: { color: "#FFF6F4", background: "#C24C3D", boxShadow: "0 6px 16px rgba(194,76,61,0.28)" },
    ghost: { color: "#5C544A", background: "#FFFFFF", border: "1px solid #E7DECF", boxShadow: "0 2px 6px rgba(93,64,35,0.06)" }
  },
  stageBg: "#ECE0CB",
  stageShadow: "inset 0 2px 5px rgba(93,64,35,0.10)",
  // Scene furniture around the figure (station, cover, stand, plush) — warm
  // wood in the daylight studio.
  SCENE: {
    frame: "#C08A5A", frameLight: "#D9A876", slat: "#CE9A66",
    mattress: "#F7F1E4",
    floor: "#D9CBB2",
    blanket: "#DCE7F4", blanketTrim: "#EFF4FA",
    standPole: "#B8C2CF", standBase: "#9AA5B1",
    bagFill: "#E8F2FD", bagLiquid: "#BCD8F5", bagEdge: "#9BB8DE",
    plush: "#D9A45B", plushDark: "#CF9850", plushFace: "#F0D2A0"
  }
};

var DARK = {
  mode: "dark",
  name: "Graphite Atelier",
  attnAnim: "attn-dark",
  critAnim: "crit-dark",
  revealMult: 1,
  COLOR: {
    ink: "#F2EFE9", ink2: "#AEB4BA", ink3: "#71787E",
    hairline: "#333A40",
    accent: "#4FD1B5", accentDeep: "#2FA893", boldTerm: "#8FE8D5",
    attention: "#F2B45C", attentionText: "#F6CE93",
    positive: "#7CC08A", positiveText: "#A9D8B4",
    critical: "#D9776B",
    btnNeutralBg: "#2A3036", btnNeutralInk: "#C6CCD2"
  },
  ACCENT_RGB: "79,209,181", ATTN_RGB: "242,180,92", POS_RGB: "124,192,138", CRIT_RGB: "217,119,107",
  BG_APP: "linear-gradient(180deg,#1A1E22 0%,#16191C 45%,#131619 100%)",
  MONITOR: {
    body: "#0F1215", grid: "rgba(79,209,181,0.055)",
    trace: "#4FD1B5", trace2: "#6E7A82", leadDot: true,
    chipBg: "rgba(255,255,255,0.035)", chipBorder: "1px solid rgba(255,255,255,0.06)",
    label: "#71787E", value: "#F2EFE9", unit: "#71787E",
    valueFont: "'Space Mono',monospace", valueFeature: "normal",
    bandTrack: "rgba(255,255,255,0.10)", bandText: "#8B939A",
    frameIdle: "#2A3036",
    // Same physical object at night: light shell, dimmed by the dark room.
    housing: "linear-gradient(180deg,#D3D7DA 0%,#BEC3C8 100%)",
    housingBorder: "1px solid #A6ACB3",
    housingDetail: "#B3B9BF",
    housingDetailBorder: "#979EA5",
    housingInk: "#5B6167",
    bezelShadow: "0 14px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.5)"
  },
  SURFACES: {
    inset: { background: "linear-gradient(180deg,#0F1215,#111417)", border: "1px solid #0C0F11", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,255,255,0.03)" },
    base: { background: "linear-gradient(180deg,#20252A 0%,#1E2226 100%)", border: "1px solid #333A40", boxShadow: "0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" },
    card: { background: "linear-gradient(180deg,#282E33 0%,#262B30 100%)", border: "1px solid #3A4149", boxShadow: "0 10px 28px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.07)" },
    pop: { background: "linear-gradient(180deg,#282E33 0%,#262B30 100%)", border: "1px solid #414952", boxShadow: "0 18px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)" }
  },
  TILE: {
    idle: { background: "rgba(255,255,255,0.03)", border: "1px solid #2A3036" },
    flagged: { background: "rgba(79,209,181,0.10)", border: "1.5px solid rgba(79,209,181,0.55)" },
    caught: { background: "rgba(124,192,138,0.10)", border: "1.5px solid rgba(124,192,138,0.55)" },
    missed: { background: "rgba(242,180,92,0.10)", border: "1.5px solid rgba(242,180,92,0.55)" },
    inband: { background: "rgba(255,255,255,0.02)", border: "1px dashed #3A4149" }
  },
  CHIP: {
    accent: { background: "rgba(79,209,181,0.14)", color: "#9FEBD9", border: "1px solid rgba(79,209,181,0.30)" },
    attention: { background: "rgba(242,180,92,0.14)", color: "#F6CE93", border: "1px solid rgba(242,180,92,0.35)" },
    positive: { background: "rgba(124,192,138,0.14)", color: "#A9D8B4", border: "1px solid rgba(124,192,138,0.32)" },
    critical: { background: "rgba(217,119,107,0.14)", color: "#EDAFA5", border: "1px solid rgba(217,119,107,0.38)" },
    neutral: { background: "rgba(255,255,255,0.06)", color: "#AEB4BA", border: "1px solid rgba(255,255,255,0.10)" }
  },
  CTA: {
    primary: { color: "#0B1512", background: "linear-gradient(180deg,#59DCC0,#2FA893)", boxShadow: "0 6px 18px rgba(47,168,147,0.26), inset 0 1px 0 rgba(255,255,255,0.30)" },
    positive: { color: "#0D150E", background: "linear-gradient(180deg,#8BCB97,#6CB27B)", boxShadow: "0 6px 18px rgba(124,192,138,0.22), inset 0 1px 0 rgba(255,255,255,0.28)" },
    critical: { color: "#1A0D0B", background: "linear-gradient(180deg,#E29387,#C96A5D)", boxShadow: "0 6px 18px rgba(217,119,107,0.24), inset 0 1px 0 rgba(255,255,255,0.24)" },
    ghost: { color: "#AEB4BA", background: "rgba(255,255,255,0.04)", border: "1px solid #333A40" }
  },
  stageBg: "radial-gradient(62% 46% at 50% 36%, rgba(79,209,181,0.10), rgba(79,209,181,0) 70%), linear-gradient(180deg,#0F1215,#111417)",
  stageShadow: "inset 0 2px 6px rgba(0,0,0,0.45)",
  // Same furniture at night — deep slate, muted, still friendly.
  SCENE: {
    frame: "#46536E", frameLight: "#5A6A8C", slat: "#516080",
    mattress: "#E6E2D8",
    floor: "#3A4150",
    blanket: "#3E4A66", blanketTrim: "#56658A",
    standPole: "#8E99A8", standBase: "#767F8C",
    bagFill: "#D8E6F5", bagLiquid: "#A9C4E4", bagEdge: "#8FA9C9",
    plush: "#C7924E", plushDark: "#B58343", plushFace: "#E8CA96"
  }
};

// ---- theme builder -----------------------------------------------------------
function buildTheme(P) {
  // Attention is LIT, not flashed: resting shadow holds, amber glow swells.
  // Critical (genuine hard-stops only) uses the same calm grammar, never a strobe.
  var restShadow = P.MONITOR.bezelShadow;
  var keyframes = "@keyframes " + P.attnAnim + "{0%,100%{box-shadow:" + restShadow + "}50%{box-shadow:" + restShadow + ",0 0 28px rgba(" + P.ATTN_RGB + ",0.32)}}"
    + "@keyframes " + P.critAnim + "{0%,100%{box-shadow:" + restShadow + "}50%{box-shadow:" + restShadow + ",0 0 28px rgba(" + P.CRIT_RGB + ",0.36)}}";

  function surface(tier) {
    var s = P.SURFACES[tier] || P.SURFACES.base;
    var radius = tier === "pop" ? RADIUS.lg : tier === "inset" ? RADIUS.md : RADIUS.lg;
    if (tier === "card") radius = P.mode === "dark" ? RADIUS.xl : RADIUS.md;
    return Object.assign({ borderRadius: radius }, s);
  }

  // The monitor as a physical device: a wide light housing (the same object
  // in both themes — the room changes, the device doesn't) around a dark
  // screen, with a control strip along the bottom edge (buttons + status
  // light rendered by TelemetryDisplay). level: false | "attention"
  // (everyday amber) | "critical" (rare hard-stop).
  function monitorDevice(level) {
    var outer = {
      position: "relative",
      padding: "12px 12px 32px",
      borderRadius: 22,
      background: P.MONITOR.housing,
      border: P.MONITOR.housingBorder,
      boxShadow: P.MONITOR.bezelShadow
    };
    var frameColor = P.MONITOR.frameIdle;
    if (level === "attention") {
      frameColor = P.COLOR.attention;
      outer = Object.assign({}, outer, { animation: P.attnAnim + " 1.6s ease-in-out infinite" });
    } else if (level === "critical") {
      frameColor = P.COLOR.critical;
      outer = Object.assign({}, outer, { animation: P.critAnim + " 1.6s ease-in-out infinite" });
    }
    var inner = {
      borderRadius: 10, overflow: "hidden", background: P.MONITOR.body,
      border: "2px solid " + frameColor, transition: "border-color 0.3s ease",
      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35)"
    };
    return { outer: outer, inner: inner };
  }

  function stage() {
    return {
      background: P.stageBg, border: "none", borderRadius: RADIUS.md,
      boxShadow: P.stageShadow, padding: 12
    };
  }

  function chip(kind) {
    var base = { fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: RADIUS.pill, letterSpacing: 0.4, display: "inline-block", fontFamily: FONT.body };
    return Object.assign(base, P.CHIP[kind] || P.CHIP.neutral);
  }

  function cta(kind) {
    var base = { width: "100%", padding: "13px 0", borderRadius: RADIUS.md, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15, fontFamily: FONT.display, letterSpacing: 0.2 };
    return Object.assign(base, P.CTA[kind] || P.CTA.primary);
  }

  // Shared tile recipe: flaggable values, results, options, action tiles.
  // States: idle | flagged | caught | missed | inband. Missed is supportive
  // amber ("take a look"), never red; inband is a neutral dashed no-blame state.
  function tile(state) {
    var base = { borderRadius: RADIUS.md, padding: "10px 12px", transition: "all 0.16s ease" };
    return Object.assign(base, P.TILE[state] || P.TILE.idle);
  }

  // Small ALL-CAPS category label (uppercase + bold everywhere labels appear).
  function label() {
    return { fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: P.COLOR.ink3, fontFamily: FONT.body };
  }

  // Dashboard stat tile (kept for the dashboard's migration off statTile's old
  // look; accepts the legacy tone keys). tone: "accent" | "indigo" | "danger".
  function statTile(tone) {
    var map = {
      accent: { c: P.COLOR.accent, rgb: P.ACCENT_RGB },
      indigo: { c: P.COLOR.positive, rgb: P.POS_RGB },
      danger: { c: P.COLOR.attention, rgb: P.ATTN_RGB }
    };
    var m = map[tone] || map.accent;
    return {
      flex: 1, borderRadius: RADIUS.md, padding: 12, textAlign: "center",
      background: "rgba(" + m.rgb + ",0.12)",
      border: "1px solid rgba(" + m.rgb + ",0.30)",
      _color: m.c
    };
  }

  return {
    mode: P.mode, name: P.name, attnAnim: P.attnAnim, critAnim: P.critAnim, revealMult: P.revealMult,
    COLOR: P.COLOR, ACCENT_RGB: P.ACCENT_RGB, ATTN_RGB: P.ATTN_RGB, POS_RGB: P.POS_RGB, CRIT_RGB: P.CRIT_RGB,
    BG_APP: P.BG_APP, FONT: FONT, SPACE: SPACE, RADIUS: RADIUS, MOTION: MOTION,
    MONITOR: P.MONITOR, SCENE: P.SCENE, KEYFRAMES: keyframes,
    surface: surface, monitorDevice: monitorDevice, stage: stage,
    chip: chip, cta: cta, tile: tile, label: label, statTile: statTile
  };
}

export var THEME_LIGHT = buildTheme(LIGHT);
export var THEME_DARK = buildTheme(DARK);

export function getTokens(mode) {
  return mode === "dark" ? THEME_DARK : THEME_LIGHT;
}

// ---- back-compat named exports (bound to the light default) -----------------
// Consumers being migrated read the theme via themeStore.useTokens(); these
// statics keep any not-yet-migrated import compiling. glass()/GLASS_CSS are
// intentionally GONE — surface()/SURFACE_CSS replace them.
export var COLOR = THEME_LIGHT.COLOR;
export var BG_APP = THEME_LIGHT.BG_APP;
export function surface(tier) { return THEME_LIGHT.surface(tier); }
export function chip(kind) { return THEME_LIGHT.chip(kind); }
export function cta(kind) { return THEME_LIGHT.cta(kind); }
export function statTile(tone) { return THEME_LIGHT.statTile(tone); }
export var SURFACE_CSS = "background:#FFFFFF;border-radius:12px;box-shadow:0 2px 6px rgba(93,64,35,0.08), 0 10px 24px rgba(93,64,35,0.08)";
