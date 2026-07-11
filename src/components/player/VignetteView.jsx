// Vignette interpreter — renders any valid vignette spec (see
// lib/scenarios/vignettes.js for the schema and docs/VIGNETTE-COOKBOOK.md for
// authoring). All visual quality lives HERE, in a small hand-crafted
// primitives library; specs only combine primitives and set parameters, so a
// spec author never draws anything. Tones mirror the figure's baseline so
// close-ups read as the same character. Reduced-motion: animations are
// omitted, leaving a meaningful still.
import { useTokens } from "../theme/themeStore.js";

var TONE = "#ffcc99";
var TONE_EDGE = "#d8a86a";
var SUPPORT_BLUE = "#5B86E5";
var MARK_OUTER = "rgba(255,122,122,0.35)";
var MARK_MID = "#E08A7E";
var MARK_DOT = "#A83A2C";

function reducedMotion() {
  try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
}

export function VignetteView(props) {
  var t = useTokens();
  var spec = props.spec;
  var cycleRate = props.cycleRate || 22;
  var responseSec = props.responseSec || 1.5;
  var height = props.height || 200;
  var noMotion = reducedMotion();
  var kf = []; // per-instance keyframe strings (names namespaced by spec id)
  function kfName(i) { return "bwVg-" + spec.id + "-" + i; }
  function num(v, from) {
    if (v === "cycleRate") return 60 / (cycleRate || 22);
    if (v === "responseSec") return Math.min(3, Math.max(0.8, responseSec));
    return typeof v === "number" ? v : from;
  }
  function caption() {
    if (!spec.caption) return null;
    var text = spec.caption
      .replace("{rate}", String(Math.round(cycleRate)))
      .replace("{sec}", String(responseSec));
    return (<div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, color: "#A79C89", fontFamily: t.FONT.body }}>{text}</div>);
  }
  var field = spec.field === "surface"
    ? (<div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 34, borderRadius: 14, background: TONE, border: "1px solid " + TONE_EDGE }}/>)
    : null;

  // Layer positions use percentages of the field area (marks, frames,
  // ripples) or internal layouts (mound, markerPair, segment).
  function fx(p) { return "calc(16px + (100% - 32px) * " + (p / 100) + ")"; }
  function fy(p) { return "calc(16px + (100% - 50px) * " + (p / 100) + ")"; }

  function layerNode(l, i) {
    var n = kfName(i);
    // -- mound: side-profile rise/fall, optional mid-rise catch ("hitch") --
    if (l.kind === "mound") {
      var period = num(l.period, 2.7);
      if (l.hitch) {
        kf.push("@keyframes " + n + "{0%,100%{transform:translateY(0) scaleY(1)}34%{transform:translateY(-7px) scaleY(1.05)}44%{transform:translateY(-3px) scaleY(1.02)}56%{transform:translateY(-7px) scaleY(1.05)}78%{transform:translateY(0) scaleY(1)}}");
      } else {
        kf.push("@keyframes " + n + "{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-6px) scaleY(1.05)}}");
      }
      return (<div key={i}>
        <div style={{ position: "absolute", left: "18%", right: "18%", bottom: 58, height: 74, borderRadius: "100% 100% 0 0 / 130% 130% 0 0", background: TONE, borderTop: "2px solid " + TONE_EDGE, transformOrigin: "50% 100%", animation: noMotion ? "none" : n + " " + period.toFixed(2) + "s ease-in-out infinite" }}/>
        <div style={{ position: "absolute", left: "10%", right: "10%", bottom: 34, height: 26, borderRadius: 4, background: SUPPORT_BLUE }}/>
      </div>);
    }
    // -- mark: variants of a surface finding ------------------------------
    if (l.kind === "mark") {
      var mx = fx(l.x === undefined ? 55 : l.x); var my = fy(l.y === undefined ? 45 : l.y);
      if (l.variant === "cluster") {
        var offs = [[0, 0], [16, -8], [-14, 10], [10, 14], [-18, -10]];
        return (<div key={i}>{offs.map(function (o, j) {
          return (<div key={j} style={{ position: "absolute", left: mx, top: my, width: 12 - j, height: 12 - j, margin: (o[1] - 5) + "px 0 0 " + (o[0] - 5) + "px", borderRadius: "50%", background: j % 2 ? MARK_MID : MARK_DOT, opacity: 0.85 }}/>);
        })}</div>);
      }
      if (l.variant === "spread") {
        var sp = [[-38, -14], [-16, 6], [4, -18], [24, 10], [42, -6], [-30, 16], [16, 20], [36, 18], [-4, 24], [50, 2]];
        return (<div key={i}>{sp.map(function (o, j) {
          return (<div key={j} style={{ position: "absolute", left: fx(50), top: fy(45), width: 7, height: 7, margin: o[1] + "px 0 0 " + (o[0] * 2) + "px", borderRadius: "50%", background: j % 3 ? MARK_MID : MARK_DOT, opacity: 0.8 }}/>);
        })}</div>);
      }
      if (l.variant === "raised") {
        return (<div key={i}>
          <div style={{ position: "absolute", left: mx, top: my, width: 58, height: 40, margin: "-20px 0 0 -29px", borderRadius: "50%", background: "#F2B9A4", border: "1.5px solid " + MARK_MID, boxShadow: "0 3px 6px rgba(93,64,35,0.35), inset 0 -3px 5px rgba(168,58,44,0.25), inset 0 3px 4px rgba(255,255,255,0.5)" }}/>
          <div style={{ position: "absolute", left: mx, top: my, width: 14, height: 11, margin: "-6px 0 0 -7px", borderRadius: "50%", background: MARK_MID }}/>
        </div>);
      }
      return (<div key={i}>
        <div style={{ position: "absolute", left: mx, top: my, width: 56, height: 40, margin: "-20px 0 0 -28px", borderRadius: "50%", background: MARK_OUTER }}/>
        <div style={{ position: "absolute", left: mx, top: my, width: 32, height: 23, margin: "-11px 0 0 -16px", borderRadius: "50%", background: MARK_MID }}/>
        <div style={{ position: "absolute", left: mx, top: my, width: 10, height: 10, margin: "-5px 0 0 -5px", borderRadius: "50%", background: MARK_DOT }}/>
      </div>);
    }
    // -- frame: viewfinder pans across, settles on the target -------------
    if (l.kind === "frame") {
      var dur = l.dur || 4.6;
      var sx = l.settleX === undefined ? 55 : l.settleX;
      kf.push("@keyframes " + n + "{0%{left:" + fx(10) + ";opacity:0}10%{opacity:1}50%{left:" + fx(sx) + "}72%{left:" + fx(sx) + ";opacity:1}92%,100%{left:" + fx(sx) + ";opacity:0}}");
      return (<div key={i} style={{ position: "absolute", top: fy((l.settleY === undefined ? 45 : l.settleY) - 22), left: fx(sx), width: 64, height: 64, marginLeft: -32, borderRadius: 10, border: "2.5px solid rgba(251,247,240,0.9)", boxShadow: "0 0 0 2000px rgba(0,0,0,0.18)", animation: noMotion ? "none" : n + " " + dur + "s ease-in-out infinite" }}/>);
    }
    // -- markerPair: two round markers; a light passes; reacts contract ---
    if (l.kind === "markerPair") {
      var ln = n + "l"; var rn = n + "r"; var sn = n + "s";
      kf.push("@keyframes " + sn + "{0%{left:4%}100%{left:82%}}");
      kf.push("@keyframes " + ln + "{0%,18%{transform:scale(1)}26%,40%{transform:scale(0.55)}52%,100%{transform:scale(1)}}");
      kf.push("@keyframes " + rn + "{0%,52%{transform:scale(1)}62%,76%{transform:scale(0.55)}88%,100%{transform:scale(1)}}");
      function marker(leftPct, cfg, anim) {
        var scale = (cfg && cfg.scale) || 1;
        return (<div style={{ position: "absolute", top: "38%", left: leftPct, width: 52, height: 52, marginLeft: -26, borderRadius: "50%", background: "#F6F3EC", border: "2px solid " + TONE_EDGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 22 * scale, height: 22 * scale, borderRadius: "50%", background: "#2E2A24", animation: (cfg && cfg.reacts && !noMotion) ? anim + " 4s ease-in-out infinite" : "none" }}/>
        </div>);
      }
      return (<div key={i}>
        {marker("34%", l.left, ln)}
        {marker("66%", l.right, rn)}
        {l.sweep !== false && <div style={{ position: "absolute", top: "28%", width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,240,0.4) 0%, rgba(255,255,240,0) 70%)", animation: noMotion ? "none" : sn + " 4s linear infinite", pointerEvents: "none" }}/>}
      </div>);
    }
    // -- ripple: expanding rings; interval from the response value --------
    if (l.kind === "ripple") {
      var rdur = num(l.dur, 1.5) + (l.extraDelay || 0);
      kf.push("@keyframes " + n + "{0%{transform:scale(.3);opacity:.7}100%{transform:scale(1.7);opacity:0}}");
      var base = { position: "absolute", top: fy(l.y === undefined ? 44 : l.y), left: fx(l.x === undefined ? 50 : l.x), width: 80, height: 80, margin: "-40px 0 0 -40px", borderRadius: "50%", pointerEvents: "none" };
      return (<div key={i}>
        <div style={Object.assign({}, base, { border: "2.5px solid rgba(" + t.ACCENT_RGB + ",0.85)", animation: noMotion ? "none" : n + " " + rdur.toFixed(2) + "s ease-out infinite" })}/>
        <div style={Object.assign({}, base, { border: "2.5px solid rgba(" + t.ACCENT_RGB + ",0.5)", animation: noMotion ? "none" : n + " " + rdur.toFixed(2) + "s ease-out " + (rdur / 2).toFixed(2) + "s infinite" })}/>
      </div>);
    }
    // -- limb: an isolated limb, straight or out of line ("segment" kept as
    //    an alias). Drawn as SVG so it reads as a body part, not geometry:
    //    upper piece, joint, lower piece, rounded mitt hand. --------------
    if (l.kind === "limb" || l.kind === "segment") {
      var bent = l.variant === "bent";
      // Straight: shoulder → joint → wrist near-flat. Bent: the lower piece
      // kinks visibly mid-way, with an attention ring at the kink.
      var lower = bent ? "M150 82 L182 96 L216 130" : "M150 82 L232 94";
      var handCx = bent ? 224 : 244; var handCy = bent ? 138 : 96;
      return (<div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 300, height: 170, margin: "-96px 0 0 -150px" }}>
        <svg viewBox="0 0 300 170" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="150" cy="150" rx="90" ry="10" fill="rgba(0,0,0,0.25)"/>
          {/* outline pass */}
          <path d={"M58 64 L150 82"} fill="none" stroke={TONE_EDGE} strokeWidth="34" strokeLinecap="round"/>
          <path d={lower} fill="none" stroke={TONE_EDGE} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx={handCx} cy={handCy} r="17" fill={TONE_EDGE}/>
          {/* skin pass */}
          <path d={"M58 64 L150 82"} fill="none" stroke={TONE} strokeWidth="30" strokeLinecap="round"/>
          <path d={lower} fill="none" stroke={TONE} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx={handCx} cy={handCy} r="15" fill={TONE}/>
          <ellipse cx={handCx + (bent ? 8 : 6)} cy={handCy - 8} rx="5" ry="7" fill={TONE} stroke={TONE_EDGE} strokeWidth="1"/>
          {/* soft top highlight */}
          <path d={"M62 58 L146 74"} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round"/>
          {bent && l.marker !== false && <circle cx="182" cy="96" r="24" fill="none" stroke={"rgba(" + t.ATTN_RGB + ",0.9)"} strokeWidth="3"/>}
        </svg>
      </div>);
    }
    // -- seam: a closed line on the surface with closure ticks -------------
    if (l.kind === "seam") {
      return (<div key={i} style={{ position: "absolute", top: fy(l.y === undefined ? 45 : l.y), left: fx(l.x === undefined ? 50 : l.x), width: 130, height: 44, margin: "-22px 0 0 -65px" }}>
        <svg viewBox="0 0 130 44" style={{ width: "100%", height: "100%" }}>
          <rect x="8" y="12" width="114" height="20" rx="10" fill="rgba(255,122,122,0.22)"/>
          <line x1="16" y1="22" x2="114" y2="22" stroke="#B3543F" strokeWidth="2.5" strokeLinecap="round"/>
          {[28, 46, 64, 82, 100].map(function (tx, j) {
            return (<line key={j} x1={tx} y1="14" x2={tx} y2="30" stroke="#8C3327" strokeWidth="2" strokeLinecap="round"/>);
          })}
        </svg>
      </div>);
    }
    // -- rim: an isolated soft rim close-up, swollen and shiny -------------
    if (l.kind === "rim") {
      kf.push("@keyframes " + n + "{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}");
      return (<div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 220, height: 130, margin: "-76px 0 0 -110px", animation: noMotion ? "none" : n + " 3.2s ease-in-out infinite" }}>
        <svg viewBox="0 0 220 130" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="110" cy="118" rx="80" ry="8" fill="rgba(0,0,0,0.25)"/>
          <ellipse cx="110" cy="46" rx="74" ry="24" fill="#E89A9A" stroke="#D98787" strokeWidth="2"/>
          <ellipse cx="110" cy="82" rx="82" ry="30" fill="#E4908E" stroke="#D98787" strokeWidth="2"/>
          <path d="M34 62 Q110 74 186 62" fill="none" stroke="#C97F7F" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="86" cy="38" rx="26" ry="8" fill="rgba(255,255,255,0.35)"/>
          <ellipse cx="140" cy="80" rx="30" ry="9" fill="rgba(255,255,255,0.22)"/>
        </svg>
      </div>);
    }
    // -- rhythmPoint: fingertips resting on a point; a ring pulses at the
    //    primary rate ------------------------------------------------------
    if (l.kind === "rhythmPoint") {
      var rpPeriod = num(l.period, 60 / (cycleRate || 22));
      kf.push("@keyframes " + n + "{0%{transform:scale(.4);opacity:.8}70%{transform:scale(1.5);opacity:0}100%{transform:scale(1.5);opacity:0}}");
      return (<div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 280, height: 150, margin: "-86px 0 0 -140px" }}>
        <svg viewBox="0 0 280 150" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="140" cy="136" rx="100" ry="9" fill="rgba(0,0,0,0.25)"/>
          {/* the limb under the fingers */}
          <path d="M28 96 L252 96" fill="none" stroke={TONE_EDGE} strokeWidth="42" strokeLinecap="round"/>
          <path d="M28 96 L252 96" fill="none" stroke={TONE} strokeWidth="38" strokeLinecap="round"/>
          <path d="M34 84 L246 84" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" strokeLinecap="round"/>
          {/* two fingertips pressing the point */}
          <g>
            <rect x="118" y="18" width="20" height="58" rx="10" fill="#F0B98C" stroke={TONE_EDGE} strokeWidth="1.5"/>
            <rect x="142" y="14" width="20" height="62" rx="10" fill="#F0B98C" stroke={TONE_EDGE} strokeWidth="1.5"/>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 140, top: 88, width: 56, height: 56, margin: "-28px 0 0 -28px", borderRadius: "50%", border: "3px solid rgba(" + t.ACCENT_RGB + ",0.8)", animation: noMotion ? "none" : n + " " + rpPeriod.toFixed(2) + "s linear infinite" }}/>
      </div>);
    }
    // -- refill: press, blanch, watch the color return over {sec} ----------
    if (l.kind === "refill") {
      var sec = num(l.sec, Math.min(4, Math.max(1, responseSec)));
      var total = 2.2 + sec;
      var pDown = (0.5 / total) * 100; var pHold = (1.1 / total) * 100; var pLift = (1.6 / total) * 100;
      var fadeEnd = Math.min(98, pLift + (sec / total) * 100);
      kf.push("@keyframes " + n + "f{0%," + fadeEnd.toFixed(1) + "%,100%{transform:translateY(-26px)}" + pDown.toFixed(1) + "%," + pHold.toFixed(1) + "%{transform:translateY(0)}" + pLift.toFixed(1) + "%{transform:translateY(-26px)}}");
      kf.push("@keyframes " + n + "b{0%," + pDown.toFixed(1) + "%{opacity:0}" + pHold.toFixed(1) + "%," + pLift.toFixed(1) + "%{opacity:1}" + fadeEnd.toFixed(1) + "%,100%{opacity:0}}");
      return (<div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 240, height: 150, margin: "-86px 0 0 -120px" }}>
        <svg viewBox="0 0 240 150" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="120" cy="138" rx="86" ry="8" fill="rgba(0,0,0,0.25)"/>
          <rect x="24" y="76" width="192" height="56" rx="24" fill={TONE} stroke={TONE_EDGE} strokeWidth="2"/>
          <path d="M36 86 L204 86" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
        {/* the blanched spot, returning to color over the response time */}
        <div style={{ position: "absolute", left: 120, top: 102, width: 40, height: 26, margin: "-13px 0 0 -20px", borderRadius: "50%", background: "#F8ECDC", animation: noMotion ? "none" : n + "b " + total.toFixed(2) + "s linear infinite" }}/>
        {/* the pressing fingertip */}
        <div style={{ position: "absolute", left: 120, top: 40, width: 24, height: 62, margin: "0 0 0 -12px", borderRadius: 12, background: "#F0B98C", border: "1.5px solid " + TONE_EDGE, animation: noMotion ? "none" : n + "f " + total.toFixed(2) + "s ease-in-out infinite" }}/>
      </div>);
    }
    // -- press: a soft hand pressing gently (pairs with `mound`) -----------
    if (l.kind === "press") {
      kf.push("@keyframes " + n + "{0%,100%{transform:translateY(0)}45%,60%{transform:translateY(14px)}}");
      return (<div key={i} style={{ position: "absolute", top: "8%", left: "50%", width: 110, height: 74, marginLeft: -55, animation: noMotion ? "none" : n + " 3.4s ease-in-out infinite" }}>
        <svg viewBox="0 0 110 74" style={{ width: "100%", height: "100%" }}>
          <rect x="14" y="26" width="82" height="40" rx="18" fill="#F0B98C" stroke={TONE_EDGE} strokeWidth="2"/>
          {[24, 42, 60, 78].map(function (fxp, j) {
            return (<rect key={j} x={fxp} y="12" width="15" height="26" rx="7.5" fill="#F0B98C" stroke={TONE_EDGE} strokeWidth="1.5"/>);
          })}
        </svg>
      </div>);
    }
    // -- sweepBand: a light band passes over the field ---------------------
    if (l.kind === "sweepBand") {
      kf.push("@keyframes " + n + "{0%{background-position:200% 0}100%{background-position:-100% 0}}");
      return (<div key={i} style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 34, borderRadius: 14, background: "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.20) 50%, transparent 68%)", backgroundSize: "250% 100%", animation: noMotion ? "none" : n + " " + (l.dur || 2.6) + "s linear infinite", pointerEvents: "none" }}/>);
    }
    // -- gradientShift: tonal change at the edges or center ---------------
    if (l.kind === "gradientShift") {
      var toneCol = l.tone === "warm" ? "rgba(224,120,80,0.35)" : l.tone === "cool" ? "rgba(110,140,190,0.35)" : "rgba(70,60,90,0.35)";
      var bg = l.area === "center"
        ? "radial-gradient(50% 50% at 50% 45%, " + toneCol + " 0%, transparent 75%)"
        : "radial-gradient(70% 65% at 50% 45%, transparent 45%, " + toneCol + " 100%)";
      return (<div key={i} style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 34, borderRadius: 14, background: bg, pointerEvents: "none" }}/>);
    }
    // -- splitTone: one half warm, one half cool, soft boundary ------------
    if (l.kind === "splitTone") {
      function half(side, toneName) {
        var col = toneName === "warm" ? "rgba(230,120,70,0.38)" : toneName === "cool" ? "rgba(110,140,190,0.38)" : "transparent";
        var grad = side === "left"
          ? "linear-gradient(90deg, " + col + " 0%, " + col + " 62%, transparent 100%)"
          : "linear-gradient(270deg, " + col + " 0%, " + col + " 62%, transparent 100%)";
        return (<div style={{ position: "absolute", top: 16, bottom: 34, width: "calc(50% - 16px)", left: side === "left" ? 16 : "50%", borderRadius: side === "left" ? "14px 0 0 14px" : "0 14px 14px 0", background: grad, pointerEvents: "none" }}/>);
      }
      return (<div key={i}>{half("left", l.left || "warm")}{half("right", l.right || "cool")}</div>);
    }
    // -- magnifier: the generic inspect fallback ---------------------------
    if (l.kind === "magnifier") {
      kf.push("@keyframes " + n + "{0%{transform:translate(-14px,-6px)}100%{transform:translate(14px,7px)}}");
      return (<div key={i} style={{ position: "absolute", top: "30%", left: "46%", animation: noMotion ? "none" : n + " 3.4s ease-in-out infinite alternate" }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", border: "3px solid #4A443B", background: "rgba(255,255,255,0.10)" }}/>
        <div style={{ width: 24, height: 5, borderRadius: 3, background: "#4A443B", transform: "rotate(45deg)", marginLeft: 52, marginTop: -8 }}/>
      </div>);
    }
    return null;
  }

  var layers = (spec.layers || []).map(layerNode);
  return (<div style={{ position: "relative", height: height, borderRadius: 12, background: t.MONITOR.body, overflow: "hidden", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35)" }}>
    {field}
    {layers}
    {caption()}
    <style>{kf.join("")}</style>
  </div>);
}
