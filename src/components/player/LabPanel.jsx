import { useState } from "react";
import { Flag, Check, X, AlertTriangle } from "lucide-react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { labCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { groupLabsByTube } from "../../lib/scenarios/labTubes.js";

// Phase-7 (focused-exam redesign): labs are grouped under the collection
// tube they're drawn in (BD Vacutainer colour coding, src/lib/scenarios/
// labTubes.js) so the panel reads like a real draw — one specimen, many
// results. The tap-to-flag / reveal / Why? behaviour is unchanged from the
// Phase-3.0-hotfix tile version; only the layout regrouped. Read-only
// callers (phase / act / cb-* / reassess) still omit badMap/flags/onFlag
// and get display-only rendering with the lab.critical / lab.why treatment.

// Small colour-coded specimen tube for a group header.
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
    // explicit critical flag. `why` is teaching scaffolding, not a status.
    var isAbnormal;
    if (clickable) { isAbnormal = (match && !!match.bad) || !!lab.critical; }
    else { isAbnormal = !!lab.critical; }
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
    var showWhyBtn;
    if (clickable) showWhyBtn = showFb;
    else showWhyBtn = showFb && !!lab.why;
    var whyAccent = isAbnormal ? "#ff7675" : "#4ECDC4";
    function openWhy(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var why = (match && match.why) || lab.why || "No additional explanation available for this finding.";
      setWhyTarget(Object.assign({}, lab, {why: why, _abnormal: isAbnormal}));
    }
    var inner = (<div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:bg,border:brd,position:"relative",width:"100%",textAlign:"left"}}>
      {clickable&&!showFb&&isFlagged&&<Flag size={11} color="#4ECDC4" style={{flexShrink:0}}/>}
      {revealState==="caught"&&<Check size={12} color="#00b894" style={{flexShrink:0}}/>}
      {revealState==="missed"&&<X size={12} color="#FF6B81" style={{flexShrink:0}}/>}
      {revealState==="wrong"&&<AlertTriangle size={11} color="#FECA57" style={{flexShrink:0}}/>}
      <span style={{flex:1,minWidth:0,fontSize:12,fontWeight:600,color:"#dfe6f4"}}>{lab.name}</span>
      <span style={{display:"flex",alignItems:"baseline",gap:3,flexShrink:0}}>
        <span style={{fontSize:15,fontWeight:800,color:valueColor}}>{lab.value}</span>
        <span style={{fontSize:9,color:"#888"}}>{lab.unit}</span>
      </span>
      <span style={{fontSize:9,color:"#7f8694",flexShrink:0,minWidth:62,textAlign:"right"}}>{"Ref "+lab.ref}</span>
      {showWhyBtn&&<WhyButton onClick={openWhy} compact={true} accent={whyAccent}/>}
    </div>);
    if (clickable && !showFb) {
      return (<button key={i} onClick={function(){onFlag(cid);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:"pointer"}}>{inner}</button>);
    }
    return (<div key={i}>{inner}</div>);
  }

  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#ff7675",marginBottom:10}}>Lab Results</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {groups.map(function(g, gi) {
          return (
            <div key={"grp"+gi}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                {renderTube(g.tube.color)}
                <div style={{fontSize:11.5,fontWeight:700,color:"#dfe6f4"}}>{g.tube.panel}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#7f8694",textTransform:"uppercase",letterSpacing:0.3}}>{g.tube.additive}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {g.labs.map(renderLab)}
              </div>
            </div>
          );
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.name+": "+whyTarget.value+" "+(whyTarget.unit||""):""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&(whyTarget._abnormal||whyTarget.critical)?"#ff7675":"#4ECDC4"} item={whyTarget?{id:labCanonicalId(whyTarget)+"@p"+phaseIdx,kind:"lab",phaseIdx:phaseIdx,label:whyTarget.name+" "+whyTarget.value+(whyTarget.unit?" "+whyTarget.unit:""),_slotRef:{kind:"lab",phaseIdx:phaseIdx,indexOrId:whyTarget.name}}:null}/>
    </div>
  );
}
