// ExplainBody — the one place generated teaching text gets rendered.
//
// Reads the global verbosity preference (Brief / Balanced / In depth) and shows
// that much of the explanation. A per-card control sits underneath so a learner
// on Brief can open up the one thing they're curious about without going to
// Settings, and someone on In depth can collapse a wall of text they don't want
// right now. The local choice lasts as long as the card is open; it never
// changes the global preference.
//
// Depth is fetched, not pre-written (2026-07-30). The wave dispatcher fills
// ~100 explanations per case with plain/detail/watch-for, but a learner opens
// maybe 5-15 of them — so receptor-level mechanism is written only for the item
// someone actually asked about. Pass `slotRef` to enable that; without it the
// component still renders whatever depth the case already carries (legacy cases
// have their mechanism bullets inline).
//
// Applies to explanations only — never to the narrator, the phase narratives,
// the interlude updates or the finding text.
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextBlock } from "./TextBlock.jsx";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { fetchMechanism } from "../../lib/ai/dispatcher.js";
import { useVerbosity, explainAt, parseExplanation, hasMoreAt, LEVELS } from "../../lib/explain/verbosity.js";

export function ExplainBody(props) {
  var t = useTokens();
  var globalLevel = useVerbosity();
  var _o = useState(null); var override = _o[0]; var setOverride = _o[1];
  var level = override || globalLevel;
  var raw = props.raw;
  var slotRef = props.slotRef || null;

  var mechanismCache = usePlayerStore(function (s) { return s.mechanismCache; });
  var mechanismInFlight = usePlayerStore(function (s) { return s.mechanismInFlight; });
  var fetched = slotRef ? mechanismCache[slotRef] : null;
  var loading = slotRef ? !!mechanismInFlight[slotRef] : false;

  var parsed = parseExplanation(raw);
  var hasInlineMechanism = parsed.mechanism.length > 0;
  // At In depth, fetch the mechanism for this item once — unless the case
  // already carries it inline (every case built before this change does).
  var wantsMechanism = level === "high" && !hasInlineMechanism && !!slotRef && !fetched;

  useEffect(function () {
    if (!wantsMechanism) return;
    var store = usePlayerStore.getState();
    if (!store.beginMechanism(slotRef)) return;
    var sc = store.activeScenario;
    if (!sc) { store.endMechanism(slotRef); return; }
    var ctrl = new AbortController();
    fetchMechanism(sc, slotRef, ctrl.signal).then(function (text) {
      if (text) usePlayerStore.getState().setMechanism(slotRef, text);
    }).catch(function (err) {
      if (err && err.name === "AbortError") return;
      console.warn("[mechanism] " + slotRef + " — " + (err && err.message || err));
    }).finally(function () {
      usePlayerStore.getState().endMechanism(slotRef);
    });
    return function () { ctrl.abort(); };
  }, [wantsMechanism, slotRef]);

  if (!raw) return null;

  var text = explainAt(raw, level);
  if (level === "high" && !hasInlineMechanism && fetched) {
    text = [text, fetched].filter(Boolean).join("\n\n");
  }

  // "Explain more" must appear whenever stepping up would show more — either
  // because the case carries mechanism inline, or because we can go fetch it.
  var canExpand = hasMoreAt(raw, level) || (level !== "high" && !!slotRef);
  var canCollapse = LEVELS.indexOf(level) > 0;

  function step(dir) {
    var i = LEVELS.indexOf(level);
    setOverride(LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i + dir))]);
  }

  var linkStyle = {
    display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px",
    borderRadius: 999, fontSize: 10.5, fontWeight: 700, fontFamily: t.FONT.body,
    background: "transparent", border: "1px solid " + t.COLOR.hairline,
    color: t.COLOR.ink3, cursor: "pointer", lineHeight: 1.2
  };

  return (<div>
    <TextBlock text={text} style={Object.assign({ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.6 }, props.style || {})}/>
    {loading && <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7, fontSize: 11, color: t.COLOR.ink3, fontFamily: t.FONT.body }}>
      <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: t.COLOR.accent, animation: "lazyPulse 1.4s ease-in-out infinite", flexShrink: 0 }}></span>
      Looking up the mechanism…
    </div>}
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
