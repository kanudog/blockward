// Modal shell — containment structure preserved from phase-2.6.5 (sticky
// header / scrolling body / sticky footer inside maxHeight:85vh), restyled
// onto the token system: fully OPAQUE pop surface with a defined edge, and
// footer buttons on solid surfaces.
//
// Generic centered shell shared by both call-site styles:
//   - WhyModal passes `kicker` (small caps label above the title).
//   - ScenarioPlayer / BuilderForm pass `accent` (a title tint). When
//     supplied it colors the title; otherwise the title takes the neutral
//     ink so the enhanced surface reads clean.
import { useTokens } from "../theme/themeStore.js";
import { useModalGuard } from "./useModalGuard.js";

export function Modal(props) {
  var t = useTokens();
  var open = props.open;
  // Called before the early return so the hook order stays stable.
  useModalGuard(open);
  if (!open) return null;
  var title = props.title; var onClose = props.onClose;
  var kicker = props.kicker;
  var accent = props.accent;
  var maxWidth = props.maxWidth || 420;
  var footer = props.footer;
  var card = Object.assign({}, t.surface("pop"), {
    display: "flex", flexDirection: "column", maxWidth: maxWidth, width: "100%",
    maxHeight: "85vh", overflow: "hidden", fontFamily: t.FONT.body
  });
  return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,18,21,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
    <div style={card} onClick={function (e) { e.stopPropagation(); }}>
      {title && <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid " + t.COLOR.hairline, flexShrink: 0 }}>
        {kicker && <div style={t.label()}>{kicker}</div>}
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginTop: kicker ? 2 : 0, color: accent || t.COLOR.ink, fontFamily: t.FONT.display, lineHeight: 1.3 }}>{title}</h3>
      </div>}
      <div style={{ padding: "14px 18px", overflowY: "auto", flex: 1, minHeight: 0 }}>{props.children}</div>
      <div style={{ padding: "10px 18px 14px", borderTop: "1px solid " + t.COLOR.hairline, flexShrink: 0 }}>
        {footer}
        <button onClick={onClose} style={{ marginTop: footer ? 8 : 0, width: "100%", padding: "11px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: t.FONT.body, background: t.COLOR.btnNeutralBg, color: t.COLOR.btnNeutralInk, border: "1px solid " + t.COLOR.hairline, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  </div>);
}
