import { useState } from "react";
import { Search, Bookmark } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { guessSys, SYS_ICON, orderSystems } from "./bodySystems.js";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";

// The compact findings list used on the stages that are NOT the assessment:
// the curveball beats and the re-check. Grouped by real body system via the
// shared bodySystems router.
//
// Reworked 2026-07-29 on owner direction. Two things were wrong:
//
//  1. Findings here were inert — no "why", no "mark for review" — so the
//     curveball and re-check showed text a learner could not interrogate,
//     inconsistent with the assessment screen where every finding has both.
//  2. The component still carried an interactive flag-the-abnormal branch
//     (badMap/flags/onFlag) that no caller had used for some time. Findings are
//     exploratory everywhere now: you read them to understand the patient and
//     bookmark whatever you want explained in the debrief. Nothing here is
//     graded, so that whole branch is gone.
export function BodySystemsView(props) {
  var t = useTokens();
  var signs = props.signs || [];
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  var markedForReview = usePlayerStore(function (s) { return s.markedForReview; });
  var toggleMark = usePlayerStore(function (s) { return s.toggleMarkForReview; });

  function markItemFor(sign) {
    return {
      id: "sign:" + sign.label + "@p" + phaseIdx,
      kind: "sign", phaseIdx: phaseIdx, label: sign.label,
      _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: (sign.id || sign.label) }
    };
  }
  function isMarked(sign) {
    var id = markItemFor(sign).id;
    return markedForReview.some(function (x) { return x.id === id; });
  }
  function handleMark(sign) {
    var item = markItemFor(sign);
    if (toggleMark(item) !== "added") return;
    var store = usePlayerStore.getState(); var sc = store.activeScenario;
    if (!sc || store.deepDiveCache[item.id] || !store.beginDeepDive(item.id)) return;
    expandSingleMarkedItem(sc, item).then(function (text) {
      if (text) usePlayerStore.getState().setDeepDive(item.id, text);
    }).catch(function (err) {
      console.warn("[eager deep-dive] " + item.id + " — " + (err && err.message || err));
    }).finally(function () {
      usePlayerStore.getState().endDeepDive(item.id);
    });
  }

  var grouped = {};
  signs.forEach(function (s) {
    var sys = guessSys(s);
    if (!grouped[sys]) grouped[sys] = [];
    grouped[sys].push(s);
  });
  var presentSystems = orderSystems(Object.keys(grouped));
  if (presentSystems.length === 0) return null;

  return (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {presentSystems.map(function (sys) {
          var IconComp = SYS_ICON[sys] || Search;
          return (
            <div key={sys} style={Object.assign({}, t.tile("idle"), { padding: "8px 10px" })}>
              <div style={Object.assign({}, t.label(), { marginBottom: 4, display: "flex", alignItems: "center", gap: 5 })}>
                <IconComp size={13} color={t.COLOR.accent}/> {sys}
              </div>
              {grouped[sys].map(function (s, j) {
                var marked = isMarked(s);
                return (<div key={j} style={{ marginBottom: 2 }}>
                  <div style={{ position: "relative", fontSize: 11.5, color: t.COLOR.ink2, lineHeight: 1.45, padding: "5px 8px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontFamily: t.FONT.body }}>
                    <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <span style={{ fontWeight: 700, color: t.COLOR.ink }}>{s.label}:</span> {s.finding}
                    </span>
                    {s.why && <WhyButton compact={true} onClick={function (e) {
                      if (e && e.stopPropagation) e.stopPropagation();
                      setWhyTarget(s);
                    }}/>}
                    <button className="bw-tap" onClick={function () { handleMark(s); }}
                      aria-label={marked ? "Marked for review" : "Mark for review"}
                      style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, cursor: "pointer", fontSize: 9.5, fontWeight: 700, fontFamily: t.FONT.body,
                        background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : "transparent",
                        border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
                        color: marked ? t.COLOR.attentionText : t.COLOR.ink3 }}>
                      <Bookmark size={10}/>{marked ? "Marked" : "Review"}
                    </button>
                  </div>
                </div>);
              })}
            </div>
          );
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function () { setWhyTarget(null); }}
        title={whyTarget ? whyTarget.label : ""} body={whyTarget ? whyTarget.why : ""}
        item={whyTarget ? markItemFor(whyTarget) : null}/>
    </div>
  );
}
