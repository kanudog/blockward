// Phase 4 (W4 + #7): the live review tray. A floating pill follows the
// learner through the run showing what they've marked and collected; tapping
// it opens a bottom sheet with two labeled sections — marked-for-review
// items and insight cards. A supportive revisit list, never graded; it feeds
// the debrief, which resolves the same store lists.
import { useState } from "react";
import { Bookmark, Lightbulb, X } from "lucide-react";
import { TextBlock } from "./TextBlock.jsx";
import { CoachBubble } from "./CoachBubble.jsx";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { resolveSlotText } from "../../lib/scenarios/slotResolve.js";

export function ReviewTray() {
  var t = useTokens();
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  var _item = useState(null); var openItem = _item[0]; var setOpenItem = _item[1];
  var marked = usePlayerStore(function (s) { return s.markedForReview; });
  var insights = usePlayerStore(function (s) { return s.insightCards; });
  var sc = usePlayerStore(function (s) { return s.activeScenario; });
  var coachSeen = usePlayerStore(function (s) { return s.coachSeen; });
  var dismissCoach = usePlayerStore(function (s) { return s.dismissCoach; });
  var modalOpen = usePlayerStore(function (s) { return s.modalOpen; });
  var count = marked.length + insights.length;
  if (count === 0 && !open) return null;
  var pill = (<button className="bw-tap" onClick={function () { setOpen(!open); }}
    style={{ position: "fixed", right: 14, bottom: 14, zIndex: 900, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 999, border: "1px solid " + t.COLOR.hairline, background: t.COLOR.btnNeutralBg, color: t.COLOR.ink2, fontSize: 12, fontWeight: 700, fontFamily: t.FONT.body, cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
    <Bookmark size={13} color={t.COLOR.attention}/>
    {"Tray · " + count}
  </button>);
  // First-time introduction, anchored above the pill the moment it appears.
  // Held back while any dialog is open (modalOpen>0): it used to show through
  // the backdrop of an open examine/option card and cover the teaching text.
  var trayCoach = (!open && !coachSeen.tray && !modalOpen)
    ? (<div style={{ position: "fixed", right: 14, bottom: 64, zIndex: 900, maxWidth: 270 }}>
        <CoachBubble tail="bottom-right" title="This is your tray"
          body={"Anything you **mark for review** and every insight card you collect lands here automatically, and follows you to the debrief.\n\nA keepsake shelf — nothing in it is graded."}
          onDismiss={function () { dismissCoach("tray"); }}/>
      </div>)
    : null;
  if (!open) return (<div>{pill}{trayCoach}</div>);
  return (<div>
    {pill}
    <div onClick={function () { setOpen(false); }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 950, background: "rgba(15,18,21,0.45)" }}>
      <div onClick={function (e) { e.stopPropagation(); }}
        style={Object.assign({}, t.surface("pop"), { position: "absolute", left: 0, right: 0, bottom: 0, borderRadius: "18px 18px 0 0", maxHeight: "72vh", overflowY: "auto", padding: "14px 16px 20px", fontFamily: t.FONT.body })}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={t.label()}>Your tray</div>
            <div style={{ fontSize: 12, color: t.COLOR.ink3, marginTop: 2 }}>Everything you've marked or collected — nothing here is graded.</div>
          </div>
          <button className="bw-tap" onClick={function () { setOpen(false); }} aria-label="Close"
            style={{ width: 30, height: 30, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.COLOR.btnNeutralBg, border: "1px solid " + t.COLOR.hairline, color: t.COLOR.ink3, cursor: "pointer", padding: 0 }}>
            <X size={14}/>
          </button>
        </div>
        {marked.length > 0 && <div style={{ marginTop: 12 }}>
          <div style={Object.assign({}, t.label(), { color: t.COLOR.attentionText, marginBottom: 6 })}>{"Marked for review (" + marked.length + ")"}</div>
          {marked.map(function (m, i) {
            var k = "m" + i;
            var expanded = openItem === k;
            var body = (m._slotRef ? resolveSlotText(sc, m._slotRef) : "") || "Details arrive with the debrief.";
            return (<div key={k} style={Object.assign({}, t.tile("idle"), { marginBottom: 6 })}>
              <button onClick={function () { setOpenItem(expanded ? null : k); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: t.FONT.body }}>
                <Bookmark size={12} color={t.COLOR.attention} style={{ flexShrink: 0 }}/>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: t.COLOR.ink }}>{m.label}</span>
                <span style={{ fontSize: 9, color: t.COLOR.ink3, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.kind || ""}</span>
              </button>
              {expanded && <div style={{ marginTop: 6 }}>
                <TextBlock text={body} style={{ fontSize: 11.5, color: t.COLOR.ink2, lineHeight: 1.5 }}/>
              </div>}
            </div>);
          })}
        </div>}
        {insights.length > 0 && <div style={{ marginTop: 14 }}>
          <div style={Object.assign({}, t.label(), { color: t.COLOR.boldTerm, marginBottom: 3 })}>{"Insight cards (" + insights.length + ")"}</div>
          <div style={{ fontSize: 10.5, color: t.COLOR.ink3, marginBottom: 8, lineHeight: 1.4 }}>Small takeaways the run leaves you — collected automatically as you play, kept for the debrief, never scored.</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {insights.map(function (card) {
              return (<div key={card.id} style={Object.assign({}, t.surface("card"), { width: 185, flexShrink: 0, padding: 12 })}>
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(" + t.ACCENT_RGB + ",0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lightbulb size={14} color={t.COLOR.accent}/>
                </div>
                <div style={{ fontFamily: t.FONT.display, fontSize: 13, fontWeight: 700, color: t.COLOR.ink, marginTop: 8, lineHeight: 1.25 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: t.COLOR.ink2, lineHeight: 1.5, marginTop: 4 }}>
                  <TextBlock text={card.body} style={{ fontSize: 11, color: t.COLOR.ink2, lineHeight: 1.5 }}/>
                </div>
                <div style={{ marginTop: 9 }}><span style={t.chip("accent")}>Keeper</span></div>
              </div>);
            })}
          </div>
        </div>}
      </div>
    </div>
  </div>);
}
