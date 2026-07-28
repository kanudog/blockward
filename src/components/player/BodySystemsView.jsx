import { useState } from "react";
import { Search, Flag, Check } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { signCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { guessSys, SYS_ICON } from "./bodySystems.js";
import { useTokens } from "../theme/themeStore.js";

// Phase-3.0-hotfix + Gate-1 token restyle: every sub-finding row is clickable.
// Selection state is keyed by canonical ID (sign:<label>) so clicks no longer
// depend on whether the AI's assessItems labels match the sign labels. badMap
// (built from assessItems by the parent) drives the post-submit reveal. Signs
// are grouped into body systems by guessSys() (a keyword heuristic on the
// label + finding text) with a per-system icon. Category labels render
// UPPERCASE + bold via t.label(); post-submit states use the supportive
// grammar — caught = calm positive, missed = amber "take a look", flagged-in-
// band = neutral "in range" (no-blame). Red appears nowhere here.
//
// Read-only callers (phase / act / cb-* / reassess) omit the interactive props
// and get display-only rendering with Why? on signs that carry a why field.

export function BodySystemsView(props) {
  var t = useTokens();
  var signs = props.signs || [];
  var badMap = props.badMap || null;
  var flags = props.flags || null;
  var onFlag = props.onFlag || null;
  var showFb = !!props.showFb;
  // Phase-5.2.5: optional phaseIdx for slot-ref construction.
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var clickable = !!(badMap && flags && onFlag);
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  var grouped = {};
  signs.forEach(function(s) {
    var sys = guessSys(s);
    if (!grouped[sys]) grouped[sys] = [];
    grouped[sys].push(s);
  });
  var presentSystems = Object.keys(grouped);
  if (presentSystems.length === 0) return null;
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {presentSystems.map(function(sys) {
          var IconComp = SYS_ICON[sys] || Search;
          return (
            <div key={sys} style={Object.assign({},t.tile("idle"),{padding:"8px 10px"})}>
              <div style={Object.assign({},t.label(),{marginBottom:4,display:"flex",alignItems:"center",gap:5})}><IconComp size={13} color={t.COLOR.accent}/> {sys}</div>
              {grouped[sys].map(function(s, j) {
                var cid = signCanonicalId(s);
                var match = badMap ? badMap[cid] : null;
                var isFlagged = !!(flags && flags[cid]);
                // Phase-3.0-hotfix-2: parallel to LabPanel — abnormality from
                // assessItems contract in interactive mode, legacy why-based
                // fallback in read-only.
                var isAnomalous;
                if (clickable) isAnomalous = match && !!match.bad;
                else isAnomalous = !!s.why;
                var revealState = null;
                if (clickable && showFb) {
                  var revealBad = match && !!match.bad;
                  if (revealBad && isFlagged) revealState = "caught";
                  else if (revealBad && !isFlagged) revealState = "missed";
                  else if (!revealBad && isFlagged) revealState = "inband";
                }
                var rowBg = "transparent", rowBrd = "1px solid transparent";
                if (clickable && !showFb && isFlagged) { rowBg = "rgba("+t.ACCENT_RGB+",0.12)"; rowBrd = "1px solid rgba("+t.ACCENT_RGB+",0.55)"; }
                else if (revealState === "caught") { rowBg = "rgba("+t.POS_RGB+",0.12)"; rowBrd = "1px solid rgba("+t.POS_RGB+",0.5)"; }
                else if (revealState === "missed") { rowBg = "rgba("+t.ATTN_RGB+",0.12)"; rowBrd = "1px solid rgba("+t.ATTN_RGB+",0.55)"; }
                else if (revealState === "inband") { rowBg = "transparent"; rowBrd = "1px dashed "+t.COLOR.hairline; }
                var showWhyBtn;
                if (clickable) showWhyBtn = showFb && isAnomalous;
                else showWhyBtn = showFb && !!s.why;
                function openWhy(e) {
                  if (e && e.stopPropagation) e.stopPropagation();
                  var why = (match && match.why) || s.why || "No additional explanation available for this finding.";
                  setWhyTarget(Object.assign({}, s, {why: why, _anomalous: isAnomalous}));
                }
                var inner = (<div style={{position:"relative",fontSize:11.5,color:t.COLOR.ink2,lineHeight:1.45,padding:"5px 8px",borderRadius:8,background:rowBg,border:rowBrd,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",fontFamily:t.FONT.body,transition:"all 0.16s ease"}}>
                  {clickable&&!showFb&&isFlagged&&<Flag size={11} color={t.COLOR.accent} style={{flexShrink:0}}/>}
                  {revealState==="caught"&&<Check size={12} color={t.COLOR.positive} style={{flexShrink:0}}/>}
                  {revealState==="missed"&&<span style={{fontSize:9,color:t.COLOR.attention,fontWeight:700,flexShrink:0}}>take a look</span>}
                  {revealState==="inband"&&<span style={{fontSize:9,color:t.COLOR.ink3,fontWeight:600,flexShrink:0}}>in range</span>}
                  <span style={{flex:1,minWidth:0,textAlign:"left"}}><span style={{fontWeight:700,color:t.COLOR.ink}}>{s.label}:</span> {s.finding}</span>
                  {showWhyBtn&&<WhyButton onClick={openWhy} compact={true}/>}
                </div>);
                if (clickable && !showFb) {
                  return (<button key={j} onClick={function(){onFlag(cid);}} className="bw-tap" style={{background:"none",border:"none",padding:0,marginBottom:2,display:"block",width:"100%",cursor:"pointer",color:"inherit",textAlign:"left"}}>{inner}</button>);
                }
                return (<div key={j} style={{marginBottom:2}}>{inner}</div>);
              })}
            </div>
          );
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} item={whyTarget?{id:signCanonicalId(whyTarget),kind:"sign",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"sign",phaseIdx:phaseIdx,indexOrId:whyTarget.label}}:null}/>
    </div>
  );
}
