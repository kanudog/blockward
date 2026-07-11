// WhyModal — teaching popup with optional Mark for Review toggle.
//
// Logic preserved exactly (phase-2.6 group D marks + phase-5.2.5 slot refs +
// the eager deep-dive kick with the in-flight guard); restyled onto tokens.
// Mark for Review sits on a solid amber-tinted surface in the sticky footer.
import { Modal } from "./Modal.jsx";
import { TextBlock } from "./TextBlock.jsx";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";

export function WhyModal(props) {
  var t = useTokens();
  var open = props.open; var onClose = props.onClose; var title = props.title || "Why?"; var body = props.body;
  var item = props.item;
  var marked = usePlayerStore(function (s) {
    if (!item) return false;
    return s.markedForReview.some(function (x) { return x.id === item.id; });
  });
  var toggle = usePlayerStore(function (s) { return s.toggleMarkForReview; });
  function handleMark() {
    if (!item) return;
    var transition = toggle(item);
    if (transition !== "added") return;
    // Eager deep-dive — unawaited; result lands in playerStore.deepDiveCache.
    var store = usePlayerStore.getState();
    var sc = store.activeScenario;
    if (!sc || !item._slotRef) return;
    if (store.deepDiveCache[item.id]) return;
    if (!store.beginDeepDive(item.id)) return;
    expandSingleMarkedItem(sc, item).then(function (text) {
      if (text) usePlayerStore.getState().setDeepDive(item.id, text);
    }).catch(function (err) {
      console.warn("[eager deep-dive] " + item.id + " — " + (err && err.message || err));
    }).finally(function () {
      usePlayerStore.getState().endDeepDive(item.id);
    });
  }
  var markStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: t.FONT.body,
    background: marked ? "rgba(" + t.ATTN_RGB + ",0.16)" : t.COLOR.btnNeutralBg,
    border: "1px solid " + (marked ? "rgba(" + t.ATTN_RGB + ",0.55)" : t.COLOR.hairline),
    color: marked ? t.COLOR.attentionText : t.COLOR.btnNeutralInk
  };
  var footer = item ? (<div>
    <button onClick={handleMark} style={markStyle}>{marked ? "✓ Marked for review" : "Mark for review"}</button>
    <p style={{ fontSize: 10, color: t.COLOR.ink3, marginTop: 6, marginBottom: 0, textAlign: "center", lineHeight: 1.4 }}>{marked ? "Waiting in your review tray — it deepens by the debrief." : "Save this to revisit at the end. Never graded."}</p>
  </div>) : null;
  return (<Modal open={open} onClose={onClose} title={title} kicker="Your mentor · why it matters" footer={footer}>
    <TextBlock text={body || ""} style={{ fontSize: 13, color: t.COLOR.ink2, lineHeight: 1.6 }}/>
  </Modal>);
}

export function WhyButton(props) {
  var t = useTokens();
  var onClick = props.onClick; var label = props.label || "Why?"; var compact = props.compact;
  var padding = compact ? "2px 9px" : "4px 11px"; var fontSize = compact ? 10 : 11;
  return (<button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: padding, borderRadius: 999, fontSize: fontSize, fontWeight: 700, fontFamily: t.FONT.body, background: "rgba(" + t.ACCENT_RGB + ",0.12)", border: "1px solid rgba(" + t.ACCENT_RGB + ",0.40)", color: t.COLOR.boldTerm, cursor: "pointer", lineHeight: 1 }}>{label}</button>);
}
