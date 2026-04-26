import { useState } from "react";
import { Flag, Check, X, AlertTriangle } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";

// Phase-3.0 change 4: lab tiles are directly clickable. No pre-submit
// abnormal highlighting (the previous red text on `critical:true` is
// gone). Each lab attempts to match an assessItem (cat:"lab", label
// containing lab.name) so clicking toggles that assessItem's flag in
// the parent's state. Why? button hidden pre-submit (revealed by
// change 7's post-submit state machine).
//
// Backward compat: if assessItems / onFlag aren't passed, LabPanel
// falls back to the previous read-only rendering (used on phase / act
// / cb-* / reassess where labs are display-only).
function findAssessForLab(lab,assessItems){
  if(!lab||!lab.name||!Array.isArray(assessItems))return null;
  var key=lab.name.toLowerCase();
  for(var i=0;i<assessItems.length;i++){
    var it=assessItems[i];
    if(it.cat!=="lab")continue;
    if((it.label||"").toLowerCase().indexOf(key)>=0)return it;
  }
  return null;
}

export function LabPanel(props) {
  var labs = props.labs || [];
  var assessItems = props.assessItems || null;
  var flags = props.flags || null;
  var onFlag = props.onFlag || null;
  var showFb = !!props.showFb;
  var clickable = !!(assessItems && flags && onFlag);
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
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
        {labs.map(function(lab,i) {
          var match=clickable?findAssessForLab(lab,assessItems):null;
          var isFlagged=match&&!!flags[match.id];
          var hasWhy = !!lab.why;
          // Phase-3.0 change 7: post-submit reveal drives off the matched
          // assessItem.bad (interactive mode) or lab.critical (read-only
          // fallback). Three reveal states: caught (bad+selected, green),
          // missed (bad+not selected, red), wrong (not bad+selected, amber).
          var revealBad = match ? !!match.bad : !!lab.critical;
          var revealState = null;
          if(clickable&&showFb){
            if(revealBad&&isFlagged)revealState="caught";
            else if(revealBad&&!isFlagged)revealState="missed";
            else if(!revealBad&&isFlagged)revealState="wrong";
          }
          var bg, brd;
          if(clickable&&!showFb){
            // Pre-submit: neutral OR teal-selected. No red regardless of
            // lab.critical — pedagogy fix per brief.
            bg=isFlagged?"rgba(78,205,196,0.12)":"rgba(255,255,255,0.04)";
            brd=isFlagged?"2px solid rgba(78,205,196,0.55)":"1px solid rgba(255,255,255,0.08)";
          }else if(clickable&&showFb){
            if(revealState==="caught"){bg="rgba(0,184,148,0.12)";brd="2px solid rgba(0,184,148,0.5)";}
            else if(revealState==="missed"){bg="rgba(255,71,87,0.12)";brd="2px solid rgba(255,71,87,0.5)";}
            else if(revealState==="wrong"){bg="rgba(254,202,87,0.12)";brd="2px solid rgba(254,202,87,0.5)";}
            else{bg="rgba(255,255,255,0.04)";brd="1px solid rgba(255,255,255,0.06)";}
          }else{
            // Read-only callers (phase / act / cb-* / reassess): keep
            // the legacy critical-red treatment so display screens
            // remain informative when the user isn't deciding.
            bg=lab.critical?"rgba(255,71,87,0.12)":"rgba(255,255,255,0.04)";
            brd=lab.critical?"1px solid rgba(255,71,87,0.25)":"1px solid rgba(255,255,255,0.06)";
          }
          var valueColor=showFb&&revealBad?"#ff7675":"#fff";
          // Why? button: post-submit, on every truly-abnormal item (bad)
          // in interactive mode, regardless of whether the user caught it.
          // Read-only mode keeps the legacy lab.why trigger.
          var showWhyBtn = clickable ? (showFb && match && match.bad) : (showFb && hasWhy);
          var whyAccent = revealBad?"#ff7675":"#4ECDC4";
          function openWhy(e){
            if(e&&e.stopPropagation)e.stopPropagation();
            var why = lab.why || (match && match.why) || "";
            setWhyTarget(Object.assign({}, lab, {why: why, _matchBad: revealBad}));
          }
          var inner=(<div style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd,position:"relative",cursor:clickable&&!showFb?"pointer":"default",color:"white",textAlign:"left",width:"100%"}}>
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
          if(clickable&&!showFb){
            return(<button key={i} onClick={function(){if(match)onFlag(match.id);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:match?"pointer":"default",opacity:match?1:0.6}}>{inner}</button>);
          }
          return(<div key={i}>{inner}</div>);
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.name+": "+whyTarget.value+" "+(whyTarget.unit||""):""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&(whyTarget._matchBad||whyTarget.critical)?"#ff7675":"#4ECDC4"} item={whyTarget?{id:"lab:"+whyTarget.name,label:whyTarget.name+" "+whyTarget.value+(whyTarget.unit?" "+whyTarget.unit:""),type:"lab",originalWhy:whyTarget.why}:null}/>
    </div>
  );
}
