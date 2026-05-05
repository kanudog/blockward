import { useState } from "react";
import { Brain, Heart, Wind, Droplets, Shield, Gauge, Eye, Search, Flag, Check, X, AlertTriangle } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { signCanonicalId } from "../../lib/scenarios/canonicalize.js";

// Phase-3.0-hotfix change 1: every sub-finding row is clickable.
// Selection state is keyed by canonical ID (sign:<label>) so clicks
// no longer depend on whether the AI's assessItems labels match the
// sign labels. badMap (built from assessItems by the parent) drives
// the post-submit caught/missed/wrong reveal.
//
// Read-only callers (phase / act / cb-* / reassess) omit the
// interactive props and get the original rendering with Why? on
// signs that carry a why field.

export function BodySystemsView(props) {
  var signs = props.signs || [];
  var badMap = props.badMap || null;
  var flags = props.flags || null;
  var onFlag = props.onFlag || null;
  var showFb = !!props.showFb;
  // Phase-5.2.5: optional phaseIdx for slot-ref construction.
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var clickable = !!(badMap && flags && onFlag);
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  function guessSys(s) {
    if (s.sys) return s.sys;
    var l = (s.label + " " + (s.finding || "")).toLowerCase();
    if (l.indexOf("neuro") >= 0 || l.indexOf("mental") >= 0 || l.indexOf("gcs") >= 0 || l.indexOf("pupil") >= 0 || l.indexOf("fontanelle") >= 0 || l.indexOf("conscious") >= 0 || l.indexOf("alert") >= 0 || l.indexOf("letharg") >= 0 || l.indexOf("responsive") >= 0 || l.indexOf("behavior") >= 0 || l.indexOf("irritable") >= 0 || l.indexOf("eye") >= 0 || l.indexOf("seiz") >= 0) return "Neuro";
    if (l.indexOf("heart") >= 0 || l.indexOf("cardio") >= 0 || l.indexOf("pulse") >= 0 || l.indexOf("rhythm") >= 0 || l.indexOf("jvd") >= 0 || l.indexOf("jugular") >= 0 || l.indexOf("perfus") >= 0 || l.indexOf("cool ext") >= 0 || l.indexOf("mottl") >= 0) return "Cardiovascular";
    if (l.indexOf("lung") >= 0 || l.indexOf("breath") >= 0 || l.indexOf("wheez") >= 0 || l.indexOf("retract") >= 0 || l.indexOf("stridor") >= 0 || l.indexOf("airway") >= 0 || l.indexOf("respir") >= 0 || l.indexOf("tripod") >= 0 || l.indexOf("trachea") >= 0 || l.indexOf("apne") >= 0) return "Respiratory";
    if (l.indexOf("abdomen") >= 0 || l.indexOf("bowel") >= 0 || l.indexOf("vomit") >= 0 || l.indexOf("mucous") >= 0 || l.indexOf("oral") >= 0 || l.indexOf("hydrat") >= 0) return "GI/Hydration";
    if (l.indexOf("skin") >= 0 || l.indexOf("rash") >= 0 || l.indexOf("hive") >= 0 || l.indexOf("flush") >= 0 || l.indexOf("cyan") >= 0 || l.indexOf("color") >= 0 || l.indexOf("pale") >= 0 || l.indexOf("diaphor") >= 0 || l.indexOf("integument") >= 0) return "Integumentary";
    if (l.indexOf("urin") >= 0 || l.indexOf("renal") >= 0 || l.indexOf("kidney") >= 0 || l.indexOf("diaper") >= 0 || l.indexOf("oligur") >= 0) return "Renal";
    if (l.indexOf("speech") >= 0 || l.indexOf("motor") >= 0 || l.indexOf("posture") >= 0 || l.indexOf("work of") >= 0) return "Musculoskeletal";
    if (s.pos === "head" || s.pos === "face") return "HEENT";
    return "Other";
  }
  var grouped = {};
  signs.forEach(function(s) {
    var sys = guessSys(s);
    if (!grouped[sys]) grouped[sys] = [];
    grouped[sys].push(s);
  });
  var sysIconMap = {"Neuro":Brain,"Cardiovascular":Heart,"Respiratory":Wind,"GI":Droplets,"GI/Hydration":Droplets,"Integumentary":Shield,"Renal":Droplets,"Musculoskeletal":Gauge,"HEENT":Eye,"Other":Search};
  var presentSystems = Object.keys(grouped);
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Systems Assessment:</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {presentSystems.map(function(sys) {
          var IconComp = sysIconMap[sys] || Search;
          return (
            <div key={sys} style={{borderRadius:8,padding:"6px 10px",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.15)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4ECDC4",marginBottom:3,display:"flex",alignItems:"center",gap:4}}><IconComp size={14}/>  {sys}</div>
              {grouped[sys].map(function(s, j) {
                var cid = signCanonicalId(s);
                var match = badMap ? badMap[cid] : null;
                var isFlagged = !!(flags && flags[cid]);
                // Phase-3.0-hotfix-2: parallel to LabPanel — abnormality from assessItems
                // contract in interactive mode, legacy why-based fallback in read-only.
                var isAbnormal;
                if (clickable) {
                  isAbnormal = match && !!match.bad;
                } else {
                  isAbnormal = !!s.why;
                }
                var revealState = null;
                if (clickable && showFb) {
                  var revealBad = match && !!match.bad;
                  if (revealBad && isFlagged) revealState = "caught";
                  else if (revealBad && !isFlagged) revealState = "missed";
                  else if (!revealBad && isFlagged) revealState = "wrong";
                  else if (!revealBad && !isFlagged) revealState = "correct-skip";
                }
                var rowBg, rowBrd;
                if (clickable && !showFb) {
                  rowBg = isFlagged ? "rgba(78,205,196,0.18)" : "transparent";
                  rowBrd = isFlagged ? "1px solid rgba(78,205,196,0.55)" : "1px solid transparent";
                } else if (clickable && showFb) {
                  if (revealState === "caught") { rowBg = "rgba(0,184,148,0.14)"; rowBrd = "1px solid rgba(0,184,148,0.5)"; }
                  else if (revealState === "missed") { rowBg = "rgba(255,71,87,0.14)"; rowBrd = "1px solid rgba(255,71,87,0.5)"; }
                  else if (revealState === "wrong") { rowBg = "rgba(254,202,87,0.14)"; rowBrd = "1px solid rgba(254,202,87,0.5)"; }
                  else if (revealState === "correct-skip") { rowBg = "rgba(78,205,196,0.06)"; rowBrd = "1px solid rgba(78,205,196,0.25)"; }
                  else { rowBg = "transparent"; rowBrd = "1px solid transparent"; }
                } else {
                  rowBg = "transparent"; rowBrd = "1px solid transparent";
                }
                // Phase-3.0-hotfix change 2: Why? on every truly-abnormal
                // row post-submit. Content priority: assessItem.why > sign.why
                // > placeholder safety net.
                var showWhyBtn;
                if (clickable) showWhyBtn = showFb && isAbnormal;
                else showWhyBtn = showFb && !!s.why;
                var whyAccent = isAbnormal ? "#FF6B81" : "#4ECDC4";
                function openWhy(e) {
                  if (e && e.stopPropagation) e.stopPropagation();
                  var why = (match && match.why) || s.why || "No additional explanation available for this finding.";
                  setWhyTarget(Object.assign({}, s, {why: why, _abnormal: isAbnormal}));
                }
                var inner = (<div style={{position:"relative",fontSize:11,color:"#ccd",lineHeight:1.4,padding:"4px 8px",borderRadius:6,background:rowBg,border:rowBrd,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  {clickable&&!showFb&&isFlagged&&<Flag size={11} color="#4ECDC4" style={{flexShrink:0}}/>}
                  {revealState==="caught"&&<Check size={12} color="#00b894" style={{flexShrink:0}}/>}
                  {revealState==="missed"&&<X size={12} color="#FF6B81" style={{flexShrink:0}}/>}
                  {revealState==="wrong"&&<AlertTriangle size={11} color="#FECA57" style={{flexShrink:0}}/>}
                  <span style={{flex:1,minWidth:0,textAlign:"left"}}><span style={{fontWeight:600,color:"#ddd"}}>{s.label}:</span> {s.finding}</span>
                  {showWhyBtn&&<WhyButton onClick={openWhy} compact={true} accent={whyAccent}/>}
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
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&whyTarget._abnormal?"#FF6B81":"#4ECDC4"} item={whyTarget?{id:signCanonicalId(whyTarget),kind:"sign",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"sign",phaseIdx:phaseIdx,indexOrId:whyTarget.label}}:null}/>
    </div>
  );
}
