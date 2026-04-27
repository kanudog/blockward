import { useState } from "react";
import { Flag, Check, X, AlertTriangle } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { labCanonicalId } from "../../lib/scenarios/canonicalize.js";

// Phase-3.0-hotfix change 1: every lab tile is clickable, period.
// Selection state is keyed by canonical ID (lab:<name>) so click
// targets are decoupled from assessItems matching. Pre-hotfix the
// LabPanel pre-filtered tiles to only those that matched assessItems,
// which silently dropped clickability when the AI's labels did not
// align (the DKA-scenario regression). Now scoring/reveal flows use
// the canonical IDs through the badMap prop.
//
// Backward compat: read-only callers (phase / act / cb-* / reassess)
// omit badMap / flags / onFlag and get the legacy display-only
// rendering plus the lab.critical / lab.why treatment.

export function LabPanel(props) {
  var labs = props.labs || [];
  var badMap = props.badMap || null;
  var flags = props.flags || null;
  var onFlag = props.onFlag || null;
  var showFb = !!props.showFb;
  var clickable = !!(badMap && flags && onFlag);
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  if (labs.length === 0) return null;
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <svg viewBox="0 0 24 40" style={{width:18,height:30,flexShrink:0}}>
          <rect x="6" y="0" width="12" height="6" rx="2" fill="#a0a0a0"/>
          <rect x="4" y="5" width="16" height="32" rx="4" fill="#e8e8ee" stroke="#bbb" strokeWidth="0.5"/>
          <rect x="5" y="18" width="14" height="18" rx="3" fill="#d63031" opacity="0.8">
            <animate attributeName="height" values="18;16;18" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="y" values="18;20;18" dur="2s" repeatCount="indefinite"/>
          </rect>
        </svg>
        <div style={{fontSize:12,fontWeight:700,color:"#ff7675"}}>Lab Results</div>
      </div>
      <style>{"@media (max-width: 400px){.bw-lab-grid{grid-template-columns:1fr !important}}"}</style>
      <div className="bw-lab-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {labs.map(function(lab, i) {
          var cid = labCanonicalId(lab);
          var match = badMap ? badMap[cid] : null;
          var isFlagged = !!(flags && flags[cid]);
          // Phase-3.0-hotfix-2: in interactive (clickable) mode, abnormality is
          // defined strictly by the assessItems contract (match.bad) plus the AI's
          // explicit critical flag. Educational `why` content does NOT make a lab
          // abnormal — `why` is teaching scaffolding present on most labs regardless
          // of clinical status. In read-only mode (no badMap), fall back to the
          // legacy critical||why heuristic for display.
          var isAbnormal;
          if (clickable) {
            isAbnormal = (match && !!match.bad) || !!lab.critical;
          } else {
            isAbnormal = !!lab.critical || !!lab.why;
          }
          var revealState = null;
          if (clickable && showFb) {
            var revealBad = (match && !!match.bad) || !!lab.critical;
            if (revealBad && isFlagged) revealState = "caught";
            else if (revealBad && !isFlagged) revealState = "missed";
            else if (!revealBad && isFlagged) revealState = "wrong";
            else if (!revealBad && !isFlagged) revealState = "correct-skip";
          }
          var bg, brd;
          if (clickable && !showFb) {
            bg = isFlagged ? "rgba(78,205,196,0.12)" : "rgba(255,255,255,0.04)";
            brd = isFlagged ? "2px solid rgba(78,205,196,0.55)" : "1px solid rgba(255,255,255,0.08)";
          } else if (clickable && showFb) {
            if (revealState === "caught") { bg = "rgba(0,184,148,0.12)"; brd = "2px solid rgba(0,184,148,0.5)"; }
            else if (revealState === "missed") { bg = "rgba(255,71,87,0.12)"; brd = "2px solid rgba(255,71,87,0.5)"; }
            else if (revealState === "wrong") { bg = "rgba(254,202,87,0.12)"; brd = "2px solid rgba(254,202,87,0.5)"; }
            else if (revealState === "correct-skip") { bg = "rgba(78,205,196,0.06)"; brd = "1px solid rgba(78,205,196,0.25)"; }
            else { bg = "rgba(255,255,255,0.04)"; brd = "1px solid rgba(255,255,255,0.06)"; }
          } else {
            bg = lab.critical ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.04)";
            brd = lab.critical ? "1px solid rgba(255,71,87,0.25)" : "1px solid rgba(255,255,255,0.06)";
          }
          var valueColor = showFb && isAbnormal ? "#ff7675" : "#fff";
          // Phase-3.0-hotfix change 2: Why? appears post-submit on every
          // truly-abnormal item, not only on those that matched
          // assessItems. Content priority: assessItem.why > lab.why >
          // safety-net placeholder.
          var showWhyBtn;
          if (clickable) showWhyBtn = showFb && isAbnormal;
          else showWhyBtn = showFb && !!lab.why;
          var whyAccent = isAbnormal ? "#ff7675" : "#4ECDC4";
          function openWhy(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            var why = (match && match.why) || lab.why || "No additional explanation available for this finding.";
            setWhyTarget(Object.assign({}, lab, {why: why, _abnormal: isAbnormal}));
          }
          var inner = (<div style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd,position:"relative",cursor:clickable&&!showFb?"pointer":"default",color:"white",textAlign:"left",width:"100%"}}>
            {clickable&&!showFb&&isFlagged&&<div style={{position:"absolute",top:6,right:6}}><Flag size={11} color="#4ECDC4"/></div>}
            {revealState==="caught"&&<div style={{position:"absolute",top:6,right:6}}><Check size={13} color="#00b894"/></div>}
            {revealState==="missed"&&<div style={{position:"absolute",top:6,right:6}}><X size={13} color="#FF6B81"/></div>}
            {revealState==="wrong"&&<div style={{position:"absolute",top:6,right:6}}><AlertTriangle size={12} color="#FECA57"/></div>}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,paddingRight:revealState?16:0}}>
              <div style={{fontSize:10,color:"#aaa",fontWeight:600}}>{lab.name}</div>
              {showWhyBtn&&<WhyButton onClick={openWhy} compact={true} accent={whyAccent}/>}
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:16,fontWeight:800,color:valueColor}}>{lab.value}</span>
              <span style={{fontSize:9,color:"#888"}}>{lab.unit}</span>
            </div>
            <div style={{fontSize:9,color:"#888"}}>{"Ref: "+lab.ref}</div>
          </div>);
          if (clickable && !showFb) {
            return (<button key={i} onClick={function(){onFlag(cid);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:"pointer"}}>{inner}</button>);
          }
          return (<div key={i}>{inner}</div>);
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.name+": "+whyTarget.value+" "+(whyTarget.unit||""):""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&(whyTarget._abnormal||whyTarget.critical)?"#ff7675":"#4ECDC4"} item={whyTarget?{id:labCanonicalId(whyTarget),label:whyTarget.name+" "+whyTarget.value+(whyTarget.unit?" "+whyTarget.unit:""),type:"lab",originalWhy:whyTarget.why}:null}/>
    </div>
  );
}
