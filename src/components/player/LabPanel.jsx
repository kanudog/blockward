import { useState } from "react";
import { Flag, Check } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { labCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { groupLabsByTube } from "../../lib/scenarios/labTubes.js";
import { useTokens } from "../theme/themeStore.js";

// Phase-7 (focused-exam redesign) + Gate-1 token restyle: labs are grouped
// under the collection tube they're drawn in (BD Vacutainer colour coding,
// src/lib/scenarios/labTubes.js) so the panel reads like a real draw — one
// specimen, many results. The tube-grouping layout is preserved; each result
// now renders on the shared token tile recipe with the supportive post-submit
// grammar — caught = calm positive, missed = amber "take a look", flagged-in-
// band = neutral "in range". Reference ranges are hidden while deciding and
// opt in via showRef (or the post-commit reveal). Red appears nowhere here.
// Read-only callers (phase / act / cb-* / reassess) omit badMap/flags/onFlag
// and get display-only rendering with the lab.critical / lab.why treatment.

// Small colour-coded specimen tube for a group header. Tube colours are real
// specimen-tube colours (not app theme colours), intentionally left out of the
// design-token system so they read the same against any background.
function renderTube(color) {
  return (
    <svg viewBox="0 0 20 40" style={{width:16,height:30,flexShrink:0,display:"block"}}>
      <rect x="3" y="2" width="14" height="7" rx="2" fill={color}/>
      <rect x="4" y="8" width="12" height="29" rx="4" fill={color} opacity="0.18" stroke={color} strokeOpacity="0.5" strokeWidth="1"/>
      <rect x="4" y="22" width="12" height="15" rx="4" fill={color} opacity="0.5"/>
      <rect x="6.5" y="11" width="2.2" height="16" rx="1" fill="#ffffff" opacity="0.25"/>
    </svg>
  );
}

export function LabPanel(props) {
  var t = useTokens();
  var labs = props.labs || [];
  var badMap = props.badMap || null;
  var flags = props.flags || null;
  var onFlag = props.onFlag || null;
  var showFb = !!props.showFb;
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var clickable = !!(badMap && flags && onFlag);
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];
  if (labs.length === 0) return null;
  var groups = groupLabsByTube(labs);

  function renderLab(lab, i) {
    var cid = labCanonicalId(lab);
    var match = badMap ? badMap[cid] : null;
    var isFlagged = !!(flags && flags[cid]);
    // Abnormality from the assessItems contract (match.bad) plus the AI's
    // explicit critical flag; educational `why` never makes a lab anomalous.
    var isAnomalous;
    if (clickable) isAnomalous = (match && !!match.bad) || !!lab.critical;
    else isAnomalous = !!lab.critical;
    var state = "idle";
    if (clickable && !showFb) state = isFlagged ? "flagged" : "idle";
    else if (clickable && showFb) {
      var revealBad = (match && !!match.bad) || !!lab.critical;
      if (revealBad && isFlagged) state = "caught";
      else if (revealBad && !isFlagged) state = "missed";
      else if (!revealBad && isFlagged) state = "inband";
    } else if (lab.critical) state = "missed"; // display-only critical: amber attention
    var showWhyBtn;
    if (clickable) showWhyBtn = showFb && isAnomalous;
    else showWhyBtn = showFb && !!lab.why;
    function openWhy(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var why = (match && match.why) || lab.why || "No additional explanation available for this finding.";
      setWhyTarget(Object.assign({}, lab, {why: why, _anomalous: isAnomalous}));
    }
    // Phase 2 (W2): refs are hidden while deciding; the parent's hint control
    // (or the post-commit reveal) opts them in via showRef. Read-only callers
    // keep refs visible as before.
    var showRef = props.showRef !== undefined ? !!props.showRef : (showFb || !clickable);
    var inner = (<div style={Object.assign({},t.tile(state),{position:"relative",textAlign:"left",width:"100%",fontFamily:t.FONT.body})}>
      {clickable&&!showFb&&isFlagged&&<div style={{position:"absolute",top:6,right:6}}><Flag size={11} color={t.COLOR.accent}/></div>}
      {state==="caught"&&<div style={{position:"absolute",top:6,right:6}}><Check size={13} color={t.COLOR.positive}/></div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,paddingRight:state==="caught"?16:0}}>
        <div style={t.label()}>{lab.name}</div>
        {showWhyBtn&&<WhyButton onClick={openWhy} compact={true}/>}
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:2}}>
        <span style={{fontSize:16,fontWeight:700,color:t.COLOR.ink,fontFamily:t.FONT.display}}>{lab.value}</span>
        <span style={{fontSize:9,color:t.COLOR.ink3}}>{lab.unit}</span>
      </div>
      {showRef&&<div style={{fontSize:9.5,color:t.COLOR.ink3,marginTop:2}}>{"Ref "+lab.ref}</div>}
      {state==="missed"&&<div style={{fontSize:9,color:t.COLOR.attention,fontWeight:700,marginTop:3}}>take a look</div>}
      {state==="inband"&&<div style={{fontSize:9,color:t.COLOR.ink3,fontWeight:600,marginTop:3}}>in range</div>}
    </div>);
    if (clickable && !showFb) {
      return (<button key={i} onClick={function(){onFlag(cid);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:"pointer"}}>{inner}</button>);
    }
    return (<div key={i}>{inner}</div>);
  }

  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <style>{"@media (max-width: 400px){.bw-result-grid{grid-template-columns:1fr !important}}"}</style>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {groups.map(function(g, gi) {
          return (
            <div key={"grp"+gi}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                {renderTube(g.tube.color)}
                <div style={{fontSize:11.5,fontWeight:700,color:t.COLOR.ink,fontFamily:t.FONT.body}}>{g.tube.panel}</div>
                <div style={{fontSize:9,fontWeight:700,color:t.COLOR.ink3,textTransform:"uppercase",letterSpacing:0.3,fontFamily:t.FONT.body}}>{g.tube.additive}</div>
              </div>
              <div className="bw-result-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {g.labs.map(renderLab)}
              </div>
            </div>
          );
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.name+": "+whyTarget.value+" "+(whyTarget.unit||""):""} body={whyTarget?whyTarget.why:""} item={whyTarget?{id:labCanonicalId(whyTarget)+"@p"+phaseIdx,kind:"lab",phaseIdx:phaseIdx,label:whyTarget.name+" "+whyTarget.value+(whyTarget.unit?" "+whyTarget.unit:""),_slotRef:{kind:"lab",phaseIdx:phaseIdx,indexOrId:whyTarget.name}}:null}/>
    </div>
  );
}
