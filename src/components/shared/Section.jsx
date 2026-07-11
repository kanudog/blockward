// Collapsible framed section with an UPPERCASE title and a one-line task
// label — the building block of the mobile-first IA: every major block
// (monitor, character, results, action grid) is one of these, so each phase
// screen reads as labeled sections instead of one undifferentiated scroll.
import { ChevronDown } from "lucide-react";
import { useTokens } from "../theme/themeStore.js";

export function Section(props) {
  var t = useTokens();
  var open = props.open;
  var frame = Object.assign({}, t.surface("base"), { marginBottom: 12, overflow: "hidden" });
  return (<div style={frame}>
    <div onClick={props.onToggle} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px " + t.SPACE.pad + "px", cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={t.label()}>{props.title}</div>
        {props.task && <div style={{ fontSize: 12.5, color: t.COLOR.ink2, marginTop: 3, lineHeight: 1.35, fontFamily: t.FONT.body }}>{props.task}</div>}
      </div>
      {props.right}
      <ChevronDown size={16} color={t.COLOR.ink3} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0 }}/>
    </div>
    {open && <div style={{ padding: "0 " + t.SPACE.pad + "px " + t.SPACE.pad + "px" }}>{props.children}</div>}
  </div>);
}
