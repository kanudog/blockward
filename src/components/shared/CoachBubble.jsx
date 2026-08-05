// Mentor coach mark: a small floating speech bubble that introduces a
// mechanic the first time the learner meets it. Warm and optional — one
// "Got it" dismisses it for good (store.coachSeen), and a help affordance
// can reopen it any time. It explains; it never gates.
import { useTokens } from "../theme/themeStore.js";
import { useVerbosity } from "../../lib/explain/verbosity.js";
import { TextBlock } from "./TextBlock.jsx";

export function CoachBubble(props) {
  var t = useTokens();
  // Owner direction 2026-07-30: the onboarding copy is wordy too. At Brief the
  // caller's short variant is used when it supplied one.
  var level = useVerbosity();
  var body = (level === "low" && props.briefBody) ? props.briefBody : props.body;
  var tail = props.tail || "bottom-left"; // "bottom-left" | "bottom-right" | "top-left" | "none"
  var tailBg = t.mode === "dark" ? "#262B30" : "#FFFFFF";
  var card = Object.assign({}, t.surface("pop"), {
    position: "relative", padding: "12px 14px",
    border: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)",
    fontFamily: t.FONT.body
  }, props.style || {});
  var tailStyle = { position: "absolute", width: 12, height: 12, transform: "rotate(45deg)", background: tailBg };
  if (tail === "bottom-left") tailStyle = Object.assign({}, tailStyle, { left: 26, bottom: -7, borderRight: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)", borderBottom: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)" });
  if (tail === "bottom-right") tailStyle = Object.assign({}, tailStyle, { right: 26, bottom: -7, borderRight: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)", borderBottom: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)" });
  if (tail === "top-left") tailStyle = Object.assign({}, tailStyle, { left: 26, top: -7, borderLeft: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)", borderTop: "1.5px solid rgba(" + t.ACCENT_RGB + ",0.5)" });
  return (<div style={card} className="slu">
    {tail !== "none" && <div style={tailStyle}/>}
    <div style={Object.assign({}, t.label(), { color: t.COLOR.boldTerm })}>Your mentor</div>
    <div style={{ fontFamily: t.FONT.display, fontWeight: 600, fontSize: 14.5, color: t.COLOR.ink, marginTop: 3 }}>{props.title}</div>
    <div style={{ marginTop: 6 }}>
      <TextBlock text={body} style={{ fontSize: 12.5, color: t.COLOR.ink2, lineHeight: 1.55 }}/>
    </div>
    <button className="bw-tap" onClick={props.onDismiss}
      style={{ marginTop: 10, padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: t.FONT.body, background: "rgba(" + t.ACCENT_RGB + ",0.12)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.45)", color: t.COLOR.boldTerm, cursor: "pointer" }}>
      {/* Callers inside a dialog pass a distinct label — two controls both
          reading "Got it" in one card made the dismiss ambiguous. */}
      {props.dismissLabel || "Got it"}
    </button>
  </div>);
}
