// The assessment centerpiece — the 3D character with tappable EXAMINE actions,
// one per BODY SYSTEM present in the case's findings (owner direction
// 2026-07-13). Tapping a system opens a popup listing that system's finding(s):
// the stated finding + Why + Mark-for-review. No 2D vignette. Scoring tools
// (GCS / FAST / Aldrete …) instead render a scoring BREAKDOWN — every category,
// each level, the child's level highlighted, and the total.
//
// Exploratory only — findings are NEVER graded; a system with only normal
// findings still shows those findings (no false "nothing unusual" message).
import { useState } from "react";
import { Check, X, Search } from "lucide-react";
import { SceneStage } from "./SceneStage.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { WhyModal } from "../shared/WhyModal.jsx";
import { guessSys, SYS_ICON, orderSystems } from "./bodySystems.js";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";

// ---- scoring tools ----------------------------------------------------------
// Standard scales. The child's level in each category is highlighted; total is
// the sum. GCS is fully broken down; other named scores fall back to their
// stated value until their scale is added.
var GCS_SCALE = {
  Eye: { key: "E", max: 4, levels: [[4, "Spontaneous"], [3, "To speech"], [2, "To pain"], [1, "None"]] },
  Verbal: { key: "V", max: 5, levels: [[5, "Oriented / coos & babbles"], [4, "Confused / irritable cry"], [3, "Inappropriate words / cries to pain"], [2, "Incomprehensible / moans"], [1, "None"]] },
  Motor: { key: "M", max: 6, levels: [[6, "Obeys / normal movement"], [5, "Localizes pain"], [4, "Withdraws to pain"], [3, "Abnormal flexion"], [2, "Extension"], [1, "None"]] }
};

function scoreKind(sign) {
  var t = ((sign.label || "") + " " + (sign.finding || "")).toLowerCase();
  if (t.indexOf("gcs") >= 0 || t.indexOf("glasgow") >= 0) return "gcs";
  return null;
}

// Pull E / V / M (and total) out of free text like "GCS 14 (E4 V4 M6)".
function parseGCS(text) {
  var s = String(text || "");
  function g(re) { var m = s.match(re); return m ? parseInt(m[1], 10) : null; }
  var e = g(/\bE\s*[:=]?\s*(\d)/i);
  var v = g(/\bV\s*[:=]?\s*(\d)/i);
  var m = g(/\bM\s*[:=]?\s*(\d)/i);
  var totalM = s.match(/gcs[^\d]*(\d{1,2})/i);
  var total = (e != null && v != null && m != null) ? e + v + m : (totalM ? parseInt(totalM[1], 10) : null);
  return { e: e, v: v, m: m, total: total, hasParts: e != null && v != null && m != null };
}

export function FocusedExam(props) {
  var t = useTokens();
  var signs = props.signs || [];
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var _open = useState(null); var openSys = _open[0]; var setOpenSys = _open[1];
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  var examined = usePlayerStore(function (s) { return s.examined; });
  var markExamined = usePlayerStore(function (s) { return s.markExamined; });
  var markedForReview = usePlayerStore(function (s) { return s.markedForReview; });
  var toggleMark = usePlayerStore(function (s) { return s.toggleMarkForReview; });

  // Group findings by real body system.
  var grouped = {};
  signs.forEach(function (s) { var sys = guessSys(s); (grouped[sys] = grouped[sys] || []).push(s); });
  var systems = orderSystems(Object.keys(grouped));

  function sysKey(sys) { return "examine:" + sys + "@p" + phaseIdx; }
  function openSystem(sys) { markExamined(sysKey(sys)); setOpenSys(sys); }
  var examinedCount = systems.filter(function (sys) { return !!examined[sysKey(sys)]; }).length;

  function markItemFor(sign) {
    return { id: "sign:" + sign.label + "@p" + phaseIdx, kind: "sign", phaseIdx: phaseIdx, label: sign.label, _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: (sign.id || sign.label) } };
  }
  function isMarked(sign) { var id = markItemFor(sign).id; return markedForReview.some(function (x) { return x.id === id; }); }
  function handleMark(sign) {
    var item = markItemFor(sign);
    if (toggleMark(item) !== "added") return;
    var store = usePlayerStore.getState(); var sc = store.activeScenario;
    if (!sc || store.deepDiveCache[item.id] || !store.beginDeepDive(item.id)) return;
    expandSingleMarkedItem(sc, item).then(function (text) { if (text) usePlayerStore.getState().setDeepDive(item.id, text); })
      .catch(function (err) { console.warn("[eager deep-dive] " + item.id + " — " + (err && err.message || err)); })
      .finally(function () { usePlayerStore.getState().endDeepDive(item.id); });
  }

  function systemChip(sys) {
    var seen = !!examined[sysKey(sys)];
    var Icon = SYS_ICON[sys] || Search;
    var st = Object.assign({}, t.tile("idle"), {
      position: "relative", display: "flex", alignItems: "center", gap: 7, width: "100%",
      padding: "9px 10px", fontSize: 12, fontWeight: 700, lineHeight: 1.2, textAlign: "left",
      color: t.COLOR.ink2, fontFamily: t.FONT.body, cursor: "pointer"
    });
    if (seen) st = Object.assign({}, st, { background: "rgba(" + t.ACCENT_RGB + ",0.07)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.35)" });
    return (<button key={sys} className="bw-tap" onClick={function () { openSystem(sys); }} style={st}>
      <Icon size={15} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>
      <span style={{ flex: 1, minWidth: 0 }}>{sys}</span>
      {seen && <Check size={13} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>}
    </button>);
  }

  // ---- scoring breakdown (GCS) ----------------------------------------------
  function GcsBreakdown(sign) {
    var p = parseGCS((sign.finding || "") + " " + (sign.label || ""));
    if (!p.hasParts) {
      // Can't break it into E/V/M — show the stated value clearly.
      return (<div style={Object.assign({}, t.surface("inset"), { padding: "10px 12px", marginBottom: 8 })}>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.COLOR.ink, fontFamily: t.FONT.mono }}>{p.total != null ? "GCS " + p.total : (sign.finding || "")}</div>
        <div style={{ fontSize: 11, color: t.COLOR.ink3, marginTop: 2 }}>{sign.finding || ""}</div>
      </div>);
    }
    var picked = { Eye: p.e, Verbal: p.v, Motor: p.m };
    return (<div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: t.COLOR.ink, fontFamily: t.FONT.mono }}>{p.total}</span>
        <span style={{ fontSize: 11, color: t.COLOR.ink3 }}>Glasgow Coma Scale · E{p.e} V{p.v} M{p.m}</span>
      </div>
      {Object.keys(GCS_SCALE).map(function (cat) {
        var def = GCS_SCALE[cat];
        return (<div key={cat} style={{ marginBottom: 8 }}>
          <div style={Object.assign({}, t.label(), { marginBottom: 3 })}>{cat} ({def.key}) · {picked[cat]}/{def.max}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {def.levels.map(function (lv) {
              var n = lv[0], sel = picked[cat] === n;
              return (<div key={n} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 8px", borderRadius: 7,
                background: sel ? "rgba(" + t.ACCENT_RGB + ",0.14)" : "transparent",
                border: sel ? "1px solid rgba(" + t.ACCENT_RGB + ",0.5)" : "1px solid transparent" }}>
                <span style={{ width: 18, textAlign: "center", fontSize: 12, fontWeight: 800, fontFamily: t.FONT.mono, color: sel ? t.COLOR.boldTerm : t.COLOR.ink3 }}>{n}</span>
                <span style={{ flex: 1, fontSize: 11.5, color: sel ? t.COLOR.ink : t.COLOR.ink3, fontWeight: sel ? 700 : 400, fontFamily: t.FONT.body }}>{lv[1]}</span>
                {sel && <Check size={12} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>}
              </div>);
            })}
          </div>
        </div>);
      })}
    </div>);
  }

  // ---- the popup -----------------------------------------------------------
  function overlay() {
    if (!openSys) return null;
    var found = grouped[openSys] || [];
    var Icon = SYS_ICON[openSys] || Search;
    function findingBlock(sign, i) {
      var marked = isMarked(sign);
      var kind = scoreKind(sign);
      return (<div key={i} style={Object.assign({}, t.surface("base"), { padding: "12px 14px", marginBottom: 10 })}>
        {kind === "gcs"
          ? GcsBreakdown(sign)
          : <TextBlock text={"**" + sign.label + ":** " + (sign.finding || "")} style={{ fontSize: 13.5, color: t.COLOR.ink2, lineHeight: 1.55 }}/>}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {sign.why && <button className="bw-tap" onClick={function () { setWhyTarget(sign); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontWeight: 700, fontSize: 12.5, fontFamily: t.FONT.body, background: "rgba(" + t.ACCENT_RGB + ",0.12)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.45)", color: t.COLOR.boldTerm, cursor: "pointer" }}>
            Why does this matter?
          </button>}
          <button className="bw-tap" onClick={function () { handleMark(sign); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: t.FONT.body,
              background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : t.COLOR.btnNeutralBg,
              border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
              color: marked ? t.COLOR.attentionText : t.COLOR.btnNeutralInk }}>
            {marked ? "✓ Marked" : "Mark for review"}
          </button>
        </div>
      </div>);
    }
    return (<div onClick={function () { setOpenSys(null); }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,18,21,0.5)" }}>
      <div onClick={function (e) { e.stopPropagation(); }} style={Object.assign({}, t.surface("pop"), { width: "100%", maxWidth: 400, maxHeight: "90vh", overflowY: "auto", fontFamily: t.FONT.body })}>
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 9 }}>
          <Icon size={18} color={t.COLOR.accent} style={{ flexShrink: 0 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={t.label()}>Examine</div>
            <div style={{ fontFamily: t.FONT.display, fontWeight: 600, fontSize: 17, color: t.COLOR.ink, marginTop: 1 }}>{openSys}</div>
          </div>
          <button className="bw-tap" onClick={function () { setOpenSys(null); }} aria-label="Close"
            style={{ width: 30, height: 30, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.COLOR.btnNeutralBg, border: "1px solid " + t.COLOR.hairline, color: t.COLOR.ink3, cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <X size={14}/>
          </button>
        </div>
        <div style={{ padding: "4px 16px 16px" }}>
          {found.length > 0
            ? found.map(findingBlock)
            : <div style={{ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.55, padding: "8px 0" }}>No specific finding recorded for this system.</div>}
          <button className="bw-tap" onClick={function () { setOpenSys(null); }} style={Object.assign({}, t.cta("positive"), { marginTop: 2, padding: "11px 0", fontSize: 13 })}>Done</button>
        </div>
      </div>
    </div>);
  }

  return (<div style={Object.assign({}, t.stage(), { position: "relative" })}>
    <div style={{ maxWidth: 190, margin: "0 auto 8px" }}>
      <SceneStage sc={props.sc} height={190} framing="figure" bare={true}/>
    </div>
    <div style={{ textAlign: "center", fontSize: 11, color: t.COLOR.ink3, fontFamily: t.FONT.body, marginBottom: 8 }}>Tap a system to look closer.</div>
    <div style={{ display: "grid", gridTemplateColumns: systems.length > 1 ? "1fr 1fr" : "1fr", gap: 6 }}>
      {systems.map(function (sys) { return systemChip(sys); })}
    </div>
    <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, color: t.COLOR.ink3, fontFamily: t.FONT.body }}>
      {examinedCount + " of " + systems.length + " system" + (systems.length === 1 ? "" : "s") + " examined"}
    </div>
    {overlay()}
    <WhyModal open={!!whyTarget} onClose={function () { setWhyTarget(null); }} title={whyTarget ? whyTarget.label : ""} body={whyTarget ? whyTarget.why : ""}
      item={whyTarget ? markItemFor(whyTarget) : null}/>
  </div>);
}
