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
import { Check, X, Search, AlertTriangle, Cable } from "lucide-react";
import { SceneStage } from "./SceneStage.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { WhyModal } from "../shared/WhyModal.jsx";
import { useModalGuard } from "../shared/useModalGuard.js";
import { guessSys, SYS_ICON, orderSystems, LINES } from "./bodySystems.js";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";
import { GCS_SCALE, parseGCS, isGcsText, gcsProseConflicts } from "../../lib/scenarios/gcs.js";

// ---- scoring tools ----------------------------------------------------------
// GCS_SCALE + parseGCS live in lib/scenarios/gcs.js (plain .js) so the coverage
// checks can import and exercise the REAL parser rather than a copy of it.
// Other named scores (FAST, Aldrete, PEWS, Westley, Wong-Baker, FLACC, Apgar)
// have no scale table yet; scoreKind returns null for them and the finding
// renders as ordinary prose, which degrades cleanly.

function scoreKind(sign) {
  var t = ((sign.label || "") + " " + (sign.finding || "")).toLowerCase();
  if (isGcsText(t)) return "gcs";
  return null;
}

export function FocusedExam(props) {
  var t = useTokens();
  var signs = props.signs || [];
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var _open = useState(null); var openSys = _open[0]; var setOpenSys = _open[1];
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  // "list" = one head-to-toe pass (default), "systems" = drill by body system.
  var _vm = useState("list"); var viewMode = _vm[0]; var setViewMode = _vm[1];
  var examined = usePlayerStore(function (s) { return s.examined; });
  var markExamined = usePlayerStore(function (s) { return s.markExamined; });
  var markedForReview = usePlayerStore(function (s) { return s.markedForReview; });
  var toggleMark = usePlayerStore(function (s) { return s.toggleMarkForReview; });
  useModalGuard(!!openSys);

  // Group findings by real body system. Lines & devices are handled separately
  // (their own strip below) so they never occupy a body-system card.
  var grouped = {};
  signs.forEach(function (s) {
    var sys = guessSys(s);
    if (sys === LINES) return;
    (grouped[sys] = grouped[sys] || []).push(s);
  });
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
      {p.mismatch && <div style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "7px 9px", marginBottom: 8, borderRadius: 8, background: "rgba(" + t.ATTN_RGB + ",0.12)", border: "1px solid rgba(" + t.ATTN_RGB + ",0.4)" }}>
        <AlertTriangle size={13} color={t.COLOR.attention} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span style={{ fontSize: 11, color: t.COLOR.attentionText, lineHeight: 1.45, fontFamily: t.FONT.body }}>
          {"This case states GCS " + p.statedTotal + ", but E" + p.e + " + V" + p.v + " + M" + p.m + " adds to " + (p.e + p.v + p.m) + ". The components are shown below — trust them over the stated total."}
        </span>
      </div>}
      {/* The other half of the same problem: components whose NUMBERS agree with
          the stated total but disagree with the WORDS beside them (a case scored
          "withdraws purposelessly to pain" as M3, which is abnormal flexion —
          withdrawal is M4). The arithmetic check above cannot see this. */}
      {gcsProseConflicts((sign.finding || "") + " " + (sign.label || ""), p).map(function (c, ci) {
        return (<div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "7px 9px", marginBottom: 8, borderRadius: 8, background: "rgba(" + t.ATTN_RGB + ",0.12)", border: "1px solid rgba(" + t.ATTN_RGB + ",0.4)" }}>
          <AlertTriangle size={13} color={t.COLOR.attention} style={{ flexShrink: 0, marginTop: 1 }}/>
          <span style={{ fontSize: 11, color: t.COLOR.attentionText, lineHeight: 1.45, fontFamily: t.FONT.body }}>
            {"This case scores " + c.category + " as " + c.emitted + " (" + GCS_SCALE[c.category].levels.filter(function (lv) { return lv[0] === c.emitted; }).map(function (lv) { return lv[1]; })[0] + "), but describes “" + c.phrase + "”, which is " + c.category + " " + c.implied + ". Go by the description, not the number."}
          </span>
        </div>);
      })}
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

  // ---- flat head-to-toe row (the default view) ------------------------------
  // Owner direction 2026-07-29: grouping by system is useful but it FRAGMENTED
  // the diagnosis — in a heart-failure case the JVD, the hepatomegaly and the
  // S3 gallop each lived behind a different card, so the triad that makes the
  // diagnosis could never be seen at once. One scannable list is the default;
  // grouping is a toggle for learners who want to drill system by system.
  function flatRow(sign, i) {
    var marked = isMarked(sign);
    var sys = guessSys(sign);
    var Icon = SYS_ICON[sys] || Search;
    return (<div key={i} style={Object.assign({}, t.tile("idle"), { padding: "8px 10px", marginBottom: 5 })}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <Icon size={12} color={t.COLOR.accent} style={{ flexShrink: 0, alignSelf: "center" }}/>
        <span style={{ fontSize: 9.5, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 700, color: t.COLOR.ink3, fontFamily: t.FONT.body }}>{sys}</span>
      </div>
      <div style={{ marginTop: 3 }}>
        {scoreKind(sign) === "gcs"
          ? GcsBreakdown(sign)
          : <TextBlock text={"**" + sign.label + ":** " + (sign.finding || "")} style={{ fontSize: 12.5, color: t.COLOR.ink2, lineHeight: 1.5 }}/>}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
        {sign.why && <button className="bw-tap" onClick={function () { setWhyTarget(sign); }}
          style={{ padding: "5px 11px", borderRadius: 999, fontWeight: 700, fontSize: 11, fontFamily: t.FONT.body, background: "rgba(" + t.ACCENT_RGB + ",0.12)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.45)", color: t.COLOR.boldTerm, cursor: "pointer" }}>
          Why this matters
        </button>}
        <button className="bw-tap" onClick={function () { handleMark(sign); }}
          style={{ padding: "5px 11px", borderRadius: 999, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: t.FONT.body,
            background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : t.COLOR.btnNeutralBg,
            border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
            color: marked ? t.COLOR.attentionText : t.COLOR.btnNeutralInk }}>
          {marked ? "✓ Saved for debrief" : "Explain in debrief"}
        </button>
      </div>
    </div>);
  }

  var examSigns = signs.filter(function (s) { return guessSys(s) !== LINES; });
  var deviceSigns = signs.filter(function (s) { return guessSys(s) === LINES; });

  return (<div style={Object.assign({}, t.stage(), { position: "relative" })}>
    <div style={{ maxWidth: 190, margin: "0 auto 8px" }}>
      <SceneStage sc={props.sc} height={190} framing="figure" bare={true}/>
    </div>

    {/* Keeps the one affordance a learner cannot guess at — that a finding can
        be saved for the debrief. The "nothing here is graded" disclaimer that
        used to sit here (and again on the section header) was removed on owner
        direction 2026-08-05: said twice on one screen it read as hedging. */}
    <div style={{ textAlign: "center", fontSize: 11, color: t.COLOR.ink3, fontFamily: t.FONT.body, marginBottom: 8, lineHeight: 1.5 }}>
      Save anything you want explained in the debrief.
    </div>

    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 9 }}>
      {[["list", "Head to toe"], ["systems", "By system"]].map(function (m) {
        var on = viewMode === m[0];
        return (<button key={m[0]} className="bw-tap" onClick={function () { setViewMode(m[0]); }}
          style={{ padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: t.FONT.body, cursor: "pointer",
            background: on ? "rgba(" + t.ACCENT_RGB + ",0.12)" : "transparent",
            border: "1px solid " + (on ? "rgba(" + t.ACCENT_RGB + ",0.45)" : t.COLOR.hairline),
            color: on ? t.COLOR.boldTerm : t.COLOR.ink3 }}>{m[1]}</button>);
      })}
    </div>

    {viewMode === "list"
      ? <div>{examSigns.map(flatRow)}</div>
      : (<div>
          <div style={{ display: "grid", gridTemplateColumns: systems.length > 1 ? "1fr 1fr" : "1fr", gap: 6 }}>
            {systems.map(function (sys) { return systemChip(sys); })}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, color: t.COLOR.ink3, fontFamily: t.FONT.body }}>
            {examinedCount + " of " + systems.length + " system" + (systems.length === 1 ? "" : "s") + " examined"}
          </div>
        </div>)}

    {/* Hardware is not a body system. It gets a quiet strip of its own so it
        stops being filed under an organ (IV access used to land in
        Integumentary, then in a bucket called "Other"). */}
    {deviceSigns.length > 0 && <div style={{ marginTop: 10, paddingTop: 9, borderTop: "1px solid " + t.COLOR.hairline }}>
      <div style={Object.assign({}, t.label(), { display: "flex", alignItems: "center", gap: 5, marginBottom: 5 })}>
        <Cable size={12} color={t.COLOR.ink3}/> {LINES}
      </div>
      {deviceSigns.map(function (s, i) {
        var marked = isMarked(s);
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11.5, color: t.COLOR.ink3, lineHeight: 1.45, padding: "3px 0", fontFamily: t.FONT.body }}>
          <span style={{ flex: 1, minWidth: 0 }}><span style={{ fontWeight: 700, color: t.COLOR.ink2 }}>{s.label}:</span> {s.finding}</span>
          <button className="bw-tap" onClick={function () { handleMark(s); }}
            style={{ flexShrink: 0, padding: "2px 8px", borderRadius: 999, fontSize: 9.5, fontWeight: 700, fontFamily: t.FONT.body, cursor: "pointer",
              background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : "transparent",
              border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
              color: marked ? t.COLOR.attentionText : t.COLOR.ink3 }}>
            {marked ? "Saved" : "Explain"}
          </button>
        </div>);
      })}
    </div>}

    {overlay()}
    <WhyModal open={!!whyTarget} onClose={function () { setWhyTarget(null); }} title={whyTarget ? whyTarget.label : ""} body={whyTarget ? whyTarget.why : ""}
      item={whyTarget ? markItemFor(whyTarget) : null}/>
  </div>);
}
