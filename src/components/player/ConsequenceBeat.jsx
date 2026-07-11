// Phase 4 (#1): the commit-then-consequence beat. After the learner commits
// a plan, the sim SHOWS what happened — the readings answer the plan on the
// monitor, and the mentor narrates it in plain words. When the committed
// plan included a not-indicated pick, the "mistake" variant plays: a visible
// dip the run recovers from — a PRODUCTIVE mistake to learn from, never a
// score, never a blocker. The engine computes real consequences; this
// component only renders the outcome it is given.
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { useTokens } from "../theme/themeStore.js";

export function ConsequenceBeat(props) {
  var t = useTokens();
  var data = props.data;           // { narrative, vitals }
  var variant = props.variant;     // "good" | "mistake"
  var ranges = props.ranges;
  var onContinue = props.onContinue;
  var mistake = variant === "mistake";
  return (<div className="slu">
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <span style={t.chip(mistake ? "attention" : "positive")}>{mistake ? "What happened — worth a look" : "What happened"}</span>
    </div>
    <div style={{ margin: "0 2px 12px" }}>
      <div style={{ fontFamily: t.FONT.display, fontSize: 16, fontWeight: 600, color: t.COLOR.ink, lineHeight: 1.35 }}>
        The readings answer your plan.
      </div>
      <div style={{ fontSize: 12, color: t.COLOR.ink3, marginTop: 3 }}>
        Watch the monitor — then read the story below.
      </div>
    </div>
    <div style={{ maxWidth: 560, margin: "0 auto 12px" }}>
      <VitalsDisplay vitals={data.vitals} ranges={ranges} showRanges={true} attention={mistake}/>
    </div>
    <div style={Object.assign({}, t.surface("card"), { padding: t.SPACE.pad, marginBottom: 12 })}>
      <div style={t.label()}>Your mentor</div>
      <TextBlock text={data.narrative} style={{ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.6, marginTop: 8 }}/>
    </div>
    <button onClick={onContinue} style={t.cta("positive")}>Continue</button>
  </div>);
}
