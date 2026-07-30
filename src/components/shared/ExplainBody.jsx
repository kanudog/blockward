// ExplainBody — the one place generated teaching text gets rendered.
//
// Reads the global verbosity preference (Brief / Balanced / In depth) and shows
// that much of the explanation. A per-card control sits underneath so a learner
// on Brief can open up the one thing they're curious about without going to
// Settings, and someone on In depth can collapse a wall of text they don't want
// right now. The local choice lasts as long as the card is open; it never
// changes the global preference.
//
// Owner direction 2026-07-30. Applies to explanations only — never to the
// narrator, the phase narratives, the interlude updates or the finding text.
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextBlock } from "./TextBlock.jsx";
import { useTokens } from "../theme/themeStore.js";
import { useVerbosity, explainAt, hasMoreAt, LEVELS } from "../../lib/explain/verbosity.js";

export function ExplainBody(props) {
  var t = useTokens();
  var globalLevel = useVerbosity();
  var _o = useState(null); var override = _o[0]; var setOverride = _o[1];
  var level = override || globalLevel;
  var raw = props.raw;
  if (!raw) return null;

  var text = explainAt(raw, level);
  var canExpand = hasMoreAt(raw, level);
  var canCollapse = LEVELS.indexOf(level) > 0;

  function step(dir) {
    var i = LEVELS.indexOf(level);
    var next = LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i + dir))];
    setOverride(next);
  }

  var linkStyle = {
    display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px",
    borderRadius: 999, fontSize: 10.5, fontWeight: 700, fontFamily: t.FONT.body,
    background: "transparent", border: "1px solid " + t.COLOR.hairline,
    color: t.COLOR.ink3, cursor: "pointer", lineHeight: 1.2
  };

  return (<div>
    <TextBlock text={text} style={Object.assign({ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.6 }, props.style || {})}/>
    {(canExpand || canCollapse) && <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      {canExpand && <button className="bw-tap" onClick={function () { step(1); }} style={linkStyle}>
        <ChevronDown size={11}/>Explain more
      </button>}
      {canCollapse && <button className="bw-tap" onClick={function () { step(-1); }} style={linkStyle}>
        <ChevronUp size={11}/>Simpler
      </button>}
    </div>}
  </div>);
}
