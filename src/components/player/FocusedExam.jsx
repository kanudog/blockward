// Phase 3 (W2/W3, revised at Gate 3): the assessment centerpiece — the
// character center-stage with tappable EXAMINE actions arranged around it.
//
// Tapping an action opens a focused popup built around a GENERIC VIGNETTE
// ILLUSTRATION (owner direction, 2026-07-02): the popup does NOT zoom into
// the hero figure — it shows a dedicated close-up drawing on a dark
// illustration panel, lightly animated and parameterized by live data.
// No reticles/crosshairs anywhere.
//
// Vignette library (small by design — a COMPREHENSIVE bank of finding-keyed
// vignettes is planned; owner note 2026-07-02, carried into the Phase 5
// proposal menu):
//   mound     — side-profile rise/fall at the ACTUAL cycle period
//               (60 / cycleRate s); caption states the rate.
//   pan-mark  — a viewfinder pans across healthy surface (same tone as the
//               figure) and settles over a concentric mark.
//   paired    — two round markers; a soft light passes across, the
//               responsive one contracts, the other doesn't.
//   ripple    — expanding rings on a surface patch, interval from the
//               response value (seconds).
//   inspect   — magnifier drifting over a surface patch: the generic
//               FALLBACK, so novel findings never render nothing.
//
// Exploratory only — findings are NEVER graded; checking a clean region is
// good practice ("you looked — that's the point").
import { useState } from "react";
import { Eye, RefreshCw, Layers, Zap, Search, Check, X } from "lucide-react";
import { SceneStage } from "./SceneStage.jsx";
import { VignetteView } from "./VignetteView.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { WhyModal } from "../shared/WhyModal.jsx";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";
import { vignetteSpec, vignetteIdForDescriptor, REGION_DEFAULT_VIGNETTES } from "../../lib/scenarios/vignettes.js";

// Authoritative region list (tags beyond it fall back to "core" + inspect).
// Vignettes are resolved through the vignette ENGINE (lib/scenarios/
// vignettes.js + VignetteView): a finding's sys/label picks a spec from the
// bank; unresolved regions use their default; anything else renders the
// inspect fallback. Specs are data — see docs/VIGNETTE-COOKBOOK.md.
var REGIONS = [
  { id: "upper",    label: "Upper region",   icon: Eye },
  { id: "motion",   label: "Cycle motion",   icon: RefreshCw },
  { id: "surface",  label: "Surface tone",   icon: Layers },
  { id: "response", label: "Response check", icon: Zap },
  { id: "core",     label: "Core & limbs",   icon: Search }
];

// Generic descriptor → region mapping. Order matters: "surface" must match
// before the "face" check ("surFACE"). Unknowns land in "core" (inspect
// fallback).
function regionFor(sign) {
  var text = ((sign.sys || "") + " " + (sign.label || "") + " " + (sign.pos || "")).toLowerCase();
  if (text.indexOf("surface") >= 0 || text.indexOf("tone") >= 0 || text.indexOf("warmth") >= 0) return "surface";
  if (text.indexOf("motion") >= 0 || text.indexOf("cycle") >= 0) return "motion";
  if (text.indexOf("response") >= 0) return "response";
  if (text.indexOf("upper") >= 0 || text.indexOf("head") >= 0 || text.indexOf("face") >= 0) return "upper";
  return "core";
}

var EXAM_CSS = "@keyframes bwExamFind{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";

export function FocusedExam(props) {
  var t = useTokens();
  var signs = props.signs || [];
  var cycleRate = props.cycleRate || 22;
  var responseSec = props.responseSec || 1.5;
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var _open = useState(null); var openId = _open[0]; var setOpenId = _open[1];
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  var examined = usePlayerStore(function (s) { return s.examined; });
  var markExamined = usePlayerStore(function (s) { return s.markExamined; });
  var markedForReview = usePlayerStore(function (s) { return s.markedForReview; });
  var toggleMark = usePlayerStore(function (s) { return s.toggleMarkForReview; });

  function regionKey(id) { return "examine:" + id + "@p" + phaseIdx; }
  function findingsFor(regionId) {
    return signs.filter(function (s) { return regionFor(s) === regionId; });
  }
  function openRegion(id) { markExamined(regionKey(id)); setOpenId(id); }
  var examinedCount = REGIONS.filter(function (r) { return !!examined[regionKey(r.id)]; }).length;

  // Mark-for-review straight from the popup (same list, same slot-ref shape,
  // same eager deep-dive kick the WhyModal uses).
  function markItemFor(sign) {
    return {
      id: "sign:" + sign.label + "@p" + phaseIdx,
      kind: "sign",
      phaseIdx: phaseIdx,
      label: sign.label,
      _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: (sign.id || sign.label) }
    };
  }
  function isMarked(sign) {
    var id = markItemFor(sign).id;
    return markedForReview.some(function (x) { return x.id === id; });
  }
  function handleMark(sign) {
    var item = markItemFor(sign);
    var transition = toggleMark(item);
    if (transition !== "added") return;
    var store = usePlayerStore.getState();
    var sc = store.activeScenario;
    if (!sc) return;
    if (store.deepDiveCache[item.id]) return;
    if (!store.beginDeepDive(item.id)) return;
    expandSingleMarkedItem(sc, item).then(function (text) {
      if (text) usePlayerStore.getState().setDeepDive(item.id, text);
    }).catch(function (err) {
      console.warn("[eager deep-dive] " + item.id + " — " + (err && err.message || err));
    }).finally(function () {
      usePlayerStore.getState().endDeepDive(item.id);
    });
  }

  // Two chip variants: the four SIDE chips are compact icon-over-label tiles
  // (centered, two-line wrap, fixed height — sized for a ~70px column on a
  // 393px phone so no label ever hangs off the tile); the bottom chip is a
  // full-width horizontal row.
  function regionChip(r, wide) {
    var seen = !!examined[regionKey(r.id)];
    var Icon = r.icon;
    var st;
    if (wide) {
      st = Object.assign({}, t.tile("idle"), {
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
        padding: "8px 9px", fontSize: 11, fontWeight: 700, color: t.COLOR.ink2,
        fontFamily: t.FONT.body, cursor: "pointer", textAlign: "center"
      });
    } else {
      st = Object.assign({}, t.tile("idle"), {
        position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 4, width: "100%", minHeight: 58, padding: "7px 3px", marginBottom: 6,
        fontSize: 9.5, fontWeight: 700, lineHeight: 1.15, textAlign: "center",
        color: t.COLOR.ink2, fontFamily: t.FONT.body, cursor: "pointer", overflow: "hidden"
      });
    }
    if (seen) st = Object.assign({}, st, { background: "rgba(" + t.ACCENT_RGB + ",0.07)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.35)" });
    return (<button key={r.id} className="bw-tap" onClick={function () { openRegion(r.id); }} style={st}>
      <Icon size={wide ? 13 : 14} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>
      <span style={{ minWidth: 0 }}>{r.label}</span>
      {seen && (wide
        ? <Check size={12} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>
        : <Check size={10} color={t.COLOR.accent} style={{ position: "absolute", top: 4, right: 4 }}/>)}
    </button>);
  }

  // ---- the focused-examine popup (reference layout, our tokens) ------------
  function overlay() {
    if (!openId) return null;
    var region = null;
    REGIONS.forEach(function (r) { if (r.id === openId) region = r; });
    if (!region) return null;
    var found = findingsFor(openId);
    var whyFinding = null;
    found.forEach(function (s) { if (!whyFinding && s.why) whyFinding = s; });
    var single = found.length === 1;
    var markBtn = function (sign, fullWidth) {
      var marked = isMarked(sign);
      var st = {
        padding: fullWidth ? "10px 12px" : "5px 11px", borderRadius: fullWidth ? 10 : 999,
        width: fullWidth ? "100%" : undefined, marginTop: 6,
        fontSize: fullWidth ? 12.5 : 11, fontWeight: 700, cursor: "pointer", fontFamily: t.FONT.body,
        background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : t.COLOR.btnNeutralBg,
        border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
        color: marked ? t.COLOR.attentionText : t.COLOR.btnNeutralInk
      };
      return (<button className="bw-tap" onClick={function () { handleMark(sign); }} style={st}>
        {marked ? "✓ Marked for review" : "Mark for review"}
      </button>);
    };
    return (<div onClick={function () { setOpenId(null); }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,18,21,0.5)" }}>
      <style>{EXAM_CSS}</style>
      <div onClick={function (e) { e.stopPropagation(); }} style={Object.assign({}, t.surface("pop"), { width: "100%", maxWidth: 380, maxHeight: "90vh", overflowY: "auto", fontFamily: t.FONT.body })}>
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={t.label()}>Examine</div>
            <div style={{ fontFamily: t.FONT.display, fontWeight: 600, fontSize: 17, color: t.COLOR.ink, marginTop: 2 }}>{region.label}</div>
          </div>
          <button className="bw-tap" onClick={function () { setOpenId(null); }} aria-label="Close"
            style={{ width: 30, height: 30, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.COLOR.btnNeutralBg, border: "1px solid " + t.COLOR.hairline, color: t.COLOR.ink3, cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <X size={14}/>
          </button>
        </div>
        {/* Illustration panel: spec-driven generic vignette, never the
            figure. The first finding whose sys/label resolves in the bank
            picks the spec; otherwise the region default; otherwise the
            inspect fallback (guaranteed by vignetteSpec). */}
        <div style={{ margin: "0 16px" }}>
          {(function () {
            var vid = null;
            found.forEach(function (s) {
              if (!vid) vid = vignetteIdForDescriptor((s.sys || "") + " " + (s.label || ""));
            });
            if (!vid) vid = REGION_DEFAULT_VIGNETTES[openId] || "inspect-fallback";
            return (<VignetteView spec={vignetteSpec(vid)} cycleRate={cycleRate} responseSec={responseSec} height={200}/>);
          })()}
        </div>
        <div style={{ padding: "12px 16px 4px", animation: "bwExamFind 0.4s ease-out 0.9s both" }}>
          <div style={Object.assign({}, t.label(), { color: t.COLOR.boldTerm, marginBottom: 6 })}>Finding</div>
          {found.length > 0
            ? found.map(function (s, i) {
                return (<div key={i} style={{ marginBottom: 10 }}>
                  <TextBlock text={"**" + s.label + ":** " + (s.finding || "")} style={{ fontSize: 13.5, color: t.COLOR.ink2, lineHeight: 1.55 }}/>
                  {!single && markBtn(s, false)}
                </div>);
              })
            : (<div style={{ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.55 }}>
                Nothing unusual here. You looked — that's the point; not every check finds something.
              </div>)}
          {single && markBtn(found[0], true)}
        </div>
        <div style={{ padding: "10px 16px 16px", display: "flex", gap: 8 }}>
          {whyFinding && <button className="bw-tap" onClick={function () { setWhyTarget(whyFinding); }}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: t.FONT.body, background: "rgba(" + t.ACCENT_RGB + ",0.12)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.45)", color: t.COLOR.boldTerm, cursor: "pointer" }}>
            Why does this matter?
          </button>}
          <button className="bw-tap" onClick={function () { setOpenId(null); }} style={Object.assign({}, t.cta("positive"), { flex: 1, padding: "11px 0", fontSize: 13 })}>Done</button>
        </div>
      </div>
    </div>);
  }

  // ---- the stage: hero figure center, examine actions arranged around it ---
  return (<div style={Object.assign({}, t.stage(), { position: "relative" })}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {REGIONS.slice(0, 2).map(function (r) { return regionChip(r, false); })}
      </div>
      <div style={{ width: 160, flexShrink: 0 }}>
        {/* 2D→3D replacement (2026-07-07): the centerpiece is the live 3D
            figure (tight portrait crop); the popups below stay 2D vignettes. */}
        <SceneStage sc={props.sc} height={190} framing="figure" bare={true}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {REGIONS.slice(2, 4).map(function (r) { return regionChip(r, false); })}
      </div>
    </div>
    <div style={{ maxWidth: 200, margin: "6px auto 0" }}>
      {regionChip(REGIONS[4], true)}
    </div>
    <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, color: t.COLOR.ink3, fontFamily: t.FONT.body }}>
      {examinedCount + " of " + REGIONS.length + " areas examined"}
    </div>
    {overlay()}
    <WhyModal open={!!whyTarget} onClose={function () { setWhyTarget(null); }} title={whyTarget ? whyTarget.label : ""} body={whyTarget ? whyTarget.why : ""}
      item={whyTarget ? markItemFor(whyTarget) : null}/>
  </div>);
}
