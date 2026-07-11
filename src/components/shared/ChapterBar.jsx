// Chapter indicator: orients the learner in the run's arc — it never counts
// down and carries no time pressure. Label reads "Round N · Step"; the dots
// show position across the whole arc (a play-test asked for a labeled
// position instead of a bare "2/4").
import { useTokens } from "../theme/themeStore.js";

var STEPS = ["Brief", "Assess", "Act", "Interlude", "Re-check", "Final", "Debrief"];

// Map the stage machine's code IDs (kept exactly) to an arc position + label.
export function chapterFor(stage, phaseIndex) {
  var round = phaseIndex >= 2 ? 2 : 1;
  if (stage === "intro") return { idx: 0, text: "Brief" };
  if (stage === "assess" || stage === "phase") return { idx: round === 2 ? 4 : 1, text: "Round " + round + " · Assess" };
  if (stage === "act") return { idx: round === 2 ? 4 : 2, text: "Round " + round + " · Act" };
  if (stage === "interlude") return { idx: 3, text: "Interlude" };
  if (stage === "cb-wait" || stage === "cb-alert" || stage === "cb-act") return { idx: 5, text: "Event" };
  if (stage === "reassess") return { idx: 5, text: "Re-check" };
  if (stage === "recovery") return { idx: 5, text: "Final" };
  return { idx: 6, text: "Debrief" };
}

export function ChapterBar(props) {
  var t = useTokens();
  var ch = chapterFor(props.stage, props.phaseIndex || 0);
  return (<div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "5px 12px", borderRadius: 999, background: t.COLOR.btnNeutralBg, border: "1px solid " + t.COLOR.hairline }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: t.COLOR.ink2, fontFamily: t.FONT.body }}>{ch.text}</span>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {STEPS.map(function (s, i) {
        var st = { width: 5, height: 5, borderRadius: 3, background: t.COLOR.hairline, transition: "all 0.2s ease" };
        if (i < ch.idx) st = Object.assign({}, st, { background: t.COLOR.ink3 });
        if (i === ch.idx) st = Object.assign({}, st, { width: 12, background: t.COLOR.accent });
        return <span key={s} style={st}/>;
      })}
    </span>
  </div>);
}
