import { useState } from "react";
import { Flag, Check, X, AlertTriangle } from "lucide-react";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { FocusedExam } from "./FocusedExam.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { PatientHeader } from "./PatientHeader.jsx";
import { buildBadMap, vitalCanonicalId } from "../../lib/scenarios/canonicalize.js";

var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";
var PP="linear-gradient(135deg,#a55eea,#8854d0)";

// Phase-5.4.3a: phase.vitals entries are rich objects per schema 5.4.1:
//   { id, label, value, unit, bad, why, _slotRef }
// Helper extracts the display value from either the rich form or a
// legacy scalar (tolerated during incremental migration of test fixtures).
function vVal(v){if(v==null||v==="")return v;if(typeof v==="object")return v.value;return v;}
function vUnit(v,fallback){if(v&&typeof v==="object"&&v.unit)return v.unit;return fallback;}

export function AssessPanel(props){
  var ph=props.ph;var vit=props.vit;var curSigns=props.curSigns;var curLabs=props.curLabs;
  var flags=props.flags;var showFb=props.showFb;var submit=props.submit;var afterA=props.afterA;var flag=props.flag;
  var patient=props.patient||{};
  var ageGroup=props.ageGroup;var sex=props.sex;var visuals=props.visuals;var seed=props.seed;var status=props.status;
  // Phase-7 R2: the round-1 assess phase, passed only for the round-2 assess
  // so the panel can lead with WHAT CHANGED instead of a same-looking re-exam.
  var prevAssess=props.prevAssess||null;
  // Phase-7 (age-anchoring): per-vital age-normal bands shown under each tile
  // value. scenario.norms[key] = [min,max], already validator-enforced.
  var norms=props.norms||null;
  // Phase-5.2.5: phaseIdx propagates into slot refs constructed for
  // marked-for-review items so the lookup at debrief time can resolve
  // current why/fb text from the live scenario.
  var phaseIdx=props.phaseIdx!==undefined?props.phaseIdx:0;
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  // Phase-3.0-hotfix change 1: build a single canonical-ID → assessItem map
  // for the whole phase. Every panel below uses the same map so click
  // targets and reveal/Why? state stay in sync. The map is built from
  // ph.assessItems; phase context (labs, signs) is needed to resolve lab
  // / clinical assessItems to their display canonical IDs.
  var badMap = buildBadMap(Object.assign({}, ph, {labs: curLabs, signs: curSigns}));
  // Phase-3.0 change 6: tile data for each vital field present in `vit`.
  // Phase-5.4.3a: vital entries are now rich objects under schema 5.4.1.
  function vitalTiles(vitObj){
    if(!vitObj)return [];
    var t=[];
    function tempStr(v){var vv=vVal(v);if(vv==null||vv==="")return vv;var n=parseFloat(vv);return isNaN(n)?vv:n.toFixed(1);}
    if(vitObj.hr!==undefined)t.push({key:"hr",label:"HR",value:vVal(vitObj.hr),unit:vUnit(vitObj.hr,"bpm")});
    if(vitObj.spo2!==undefined)t.push({key:"spo2",label:"SpO₂",value:vVal(vitObj.spo2),unit:vUnit(vitObj.spo2,"%")});
    if(vitObj.rr!==undefined)t.push({key:"rr",label:"RR",value:vVal(vitObj.rr),unit:vUnit(vitObj.rr,"/min")});
    // Phase 6.2b.4-fixup: prefer unified `bp` vital (orchestrator
    // shape); fall back to combining sbp/dbp (built-in shape).
    // Bug-sweep: the tile key must equal the vital's real id so its
    // canonical id (vitalCanonicalId(key)) matches buildBadMap and the
    // submit snapshot. The unified vital's id is "bp"; using the legacy
    // "sbp" key here meant the BP tile never found its bad flag (always
    // read as normal) and the flag was stored under a cid the snapshot
    // never checked (always read as missed). Split built-ins keep "sbp".
    if(vitObj.bp!==undefined)t.push({key:"bp",label:"BP",value:vVal(vitObj.bp),unit:vUnit(vitObj.bp,"mmHg")});
    else if(vitObj.sbp!==undefined&&vitObj.dbp!==undefined)t.push({key:"sbp",label:"BP",value:vVal(vitObj.sbp)+"/"+vVal(vitObj.dbp),unit:vUnit(vitObj.sbp,"mmHg")});
    if(vitObj.temp!==undefined)t.push({key:"temp",label:"Temp",value:tempStr(vitObj.temp),unit:vUnit(vitObj.temp,"°C")});
    if(vitObj.cap!==undefined)t.push({key:"cap",label:"Cap Refill",value:vVal(vitObj.cap),unit:vUnit(vitObj.cap,"sec")});
    return t;
  }
  // Phase-2.6 group E: reveal vital colors only after the user has tapped
  // that vital tile (or once showFb is true). Drives the VitalsDisplay
  // monitor's per-key coloring. sbp tap also reveals dbp since they're
  // shown as a single BP reading.
  var revealMap={};
  if(showFb){revealMap={hr:true,spo2:true,rr:true,sbp:true,dbp:true,bp:true,temp:true,cap:true};}
  else{
    // Bug-sweep: BP may be flagged under "bp" (unified) or "sbp" (split).
    // VitalsDisplay colors the BP row via reveal key "sbp", so map either
    // flag onto revealMap.sbp/.dbp to keep monitor coloring working.
    ["hr","spo2","rr","sbp","bp","temp","cap"].forEach(function(k){
      if(flags[vitalCanonicalId(k)]){revealMap[k]=true;if(k==="sbp"||k==="bp"){revealMap.sbp=true;revealMap.dbp=true;}}
    });
  }
  // Phase-7 R2: diff the round-2 assess findings against round-1 so the panel
  // can lead with what changed. Finding ids persist across rounds (the R2
  // prompt enforces it): vitals match by tile key, labs by id/name. Numeric
  // movers get a direction arrow; non-numeric value changes still surface.
  function _numCh(x){var n=parseFloat(x);return isNaN(n)?null:n;}
  function computeRoundChanges(prevPhase){
    if(!prevPhase)return [];
    var out=[];var pv=prevPhase.vitals||{};
    vitalTiles(vit).forEach(function(t){
      var prevRaw=pv[t.key];
      if(prevRaw===undefined&&t.key==="sbp"&&pv.bp!==undefined)prevRaw=pv.bp;
      if(prevRaw===undefined&&t.key==="bp"&&pv.sbp!==undefined&&pv.dbp!==undefined)prevRaw=vVal(pv.sbp)+"/"+vVal(pv.dbp);
      if(prevRaw===undefined||prevRaw===null)return;
      var prevVal=vVal(prevRaw);
      if(prevVal===undefined||prevVal===null||prevVal===""||String(prevVal)===String(t.value))return;
      var pn=_numCh(prevVal),cn=_numCh(t.value);
      var dir=(pn!=null&&cn!=null)?(cn>pn?"up":(cn<pn?"down":"same")):"same";
      out.push({label:t.label,from:prevVal,to:t.value,dir:dir});
    });
    var prevLabs=prevPhase.labs||[];
    (curLabs||[]).forEach(function(l){
      if(!l)return;
      var p=null;
      for(var j=0;j<prevLabs.length;j++){var q=prevLabs[j];if(q&&((l.id&&q.id===l.id)||(l.name&&q.name===l.name))){p=q;break;}}
      if(!p||p.value===undefined||p.value===null||String(p.value)===String(l.value))return;
      var pn2=_numCh(p.value),cn2=_numCh(l.value);
      var dir2=(pn2!=null&&cn2!=null)?(cn2>pn2?"up":(cn2<pn2?"down":"same")):"same";
      out.push({label:l.name,from:p.value,to:l.value,dir:dir2});
    });
    return out;
  }
  // Phase-7 (age-anchoring): format the age-normal band for a vital tile. BP
  // combines the sbp/dbp norms; a key with no norm returns null (no band).
  function normBand(key){
    if(!norms)return null;
    if(key==="bp"||key==="sbp"){
      if(Array.isArray(norms.sbp)&&Array.isArray(norms.dbp))return norms.sbp[0]+"/"+norms.dbp[0]+"–"+norms.sbp[1]+"/"+norms.dbp[1];
      return null;
    }
    var n=norms[key];
    return Array.isArray(n)?(n[0]+"–"+n[1]):null;
  }
  var roundChanges=prevAssess?computeRoundChanges(prevAssess):[];
  return(<div className="slu">
    {/* Phase-3.0 change 1: patient header + narrative anchored at top of Phase 1. */}
    <div style={{marginBottom:12}}>
      <PatientHeader patient={patient}/>
      {ph&&ph.narrative&&<div style={{marginTop:8,padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
        <TextBlock text={ph.narrative} style={{fontSize:13,color:"#ddd",lineHeight:1.55}}/>
      </div>}
    </div>
    {prevAssess&&roundChanges.length>0&&<div style={{marginBottom:12,borderRadius:12,padding:"10px 12px",background:"rgba(254,202,87,0.10)",border:"1px solid rgba(254,202,87,0.35)"}}>
      <div style={{fontSize:11,fontWeight:800,color:"#FECA57",letterSpacing:0.3,marginBottom:7}}>WHAT'S CHANGED SINCE ROUND 1</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {roundChanges.map(function(c,i){
          var arrow=c.dir==="up"?"▲":c.dir==="down"?"▼":"→";
          return(<span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,color:"#dfe6f4",background:"rgba(0,0,0,0.22)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"4px 10px"}}>
            <span style={{fontWeight:700}}>{c.label}</span>
            <span style={{color:"#8b93a7"}}>{c.from}</span>
            <span style={{color:"#FECA57",fontWeight:800}}>{arrow}</span>
            <span style={{color:"#FECA57",fontWeight:800}}>{c.to}</span>
          </span>);
        })}
      </div>
    </div>}
    {/* Phase-3.0: single-column layout. Display surfaces (monitor, body
        systems, labs) are the click targets. Submit / Continue is at
        the bottom, full-width. */}
    <div>
      <VitalsDisplay vitals={vit} reveal={revealMap}/>
      <style>{"@media(max-width:400px){.bw-vital-grid{grid-template-columns:1fr !important}}"}</style>
      <div className="bw-vital-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
        {vitalTiles(vit).map(function(t){
          // Phase-3.0-hotfix change 1+3: every vital tile is clickable
          // regardless of whether assessItems matched. No opacity-0.6
          // disabled treatment. Selection keyed by canonical ID.
          var cid = vitalCanonicalId(t.key);
          var band = normBand(t.key);
          var match = badMap[cid] || null;
          var isFlagged = !!flags[cid];
          var isAbnormal = match && !!match.bad;
          var revealState = null;
          if(showFb){
            if(isAbnormal && isFlagged) revealState="caught";
            else if(isAbnormal && !isFlagged) revealState="missed";
            else if(!isAbnormal && isFlagged) revealState="wrong";
            else if(!isAbnormal && !isFlagged) revealState="correct-skip";
          }
          var bg, brd;
          if(!showFb){
            bg=isFlagged?"rgba(78,205,196,0.12)":"rgba(255,255,255,0.04)";
            brd=isFlagged?"2px solid rgba(78,205,196,0.55)":"1px solid rgba(255,255,255,0.08)";
          }else if(revealState==="caught"){bg="rgba(0,184,148,0.12)";brd="2px solid rgba(0,184,148,0.5)";}
          else if(revealState==="missed"){bg="rgba(255,71,87,0.12)";brd="2px solid rgba(255,71,87,0.5)";}
          else if(revealState==="wrong"){bg="rgba(254,202,87,0.12)";brd="2px solid rgba(254,202,87,0.5)";}
          else if(revealState==="correct-skip"){bg="rgba(78,205,196,0.06)";brd="1px solid rgba(78,205,196,0.25)";}
          else{bg="rgba(255,255,255,0.04)";brd="1px solid rgba(255,255,255,0.06)";}
          var valueColor = showFb && isAbnormal ? "#ff7675" : "#fff";
          // Phase-3.0-hotfix change 2: Why? on every truly-abnormal vital
          // post-submit, with placeholder fallback when content is missing.
          var showWhyBtn = showFb;
          var whyAccent = isAbnormal ? "#ff7675" : "#4ECDC4";
          function openWhy(e){
            if(e&&e.stopPropagation)e.stopPropagation();
            var why = (match && match.why) || "No additional explanation available for this finding.";
            setWhyTarget({_kind:"vital",label:t.label+" "+t.value,why:why,_match:match,cid:cid,_abnormal:isAbnormal});
          }
          var inner=(<div style={{position:"relative",borderRadius:8,padding:"8px 12px",background:bg,border:brd,color:"white",textAlign:"left"}}>
            {!showFb&&isFlagged&&<div style={{position:"absolute",top:6,right:6}}><Flag size={11} color="#4ECDC4"/></div>}
            {revealState==="caught"&&<div style={{position:"absolute",top:6,right:6}}><Check size={13} color="#00b894"/></div>}
            {revealState==="missed"&&<div style={{position:"absolute",top:6,right:6}}><X size={13} color="#FF6B81"/></div>}
            {revealState==="wrong"&&<div style={{position:"absolute",top:6,right:6}}><AlertTriangle size={12} color="#FECA57"/></div>}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,paddingRight:revealState?16:0}}>
              <div style={{fontSize:10,color:"#aaa",fontWeight:600}}>{t.label}</div>
              {showWhyBtn&&<WhyButton onClick={openWhy} compact={true} accent={whyAccent}/>}
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:16,fontWeight:800,color:valueColor}}>{t.value}</span>
              <span style={{fontSize:9,color:"#888"}}>{t.unit}</span>
            </div>
            {band&&<div style={{fontSize:9.5,color:"#7f8694",marginTop:2,fontWeight:600}}>{"normal "+band}</div>}
          </div>);
          if(!showFb){
            return(<button key={t.key} onClick={function(){flag(cid);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:"pointer"}}>{inner}</button>);
          }
          return(<div key={t.key}>{inner}</div>);
        })}
      </div>
      <FocusedExam signs={curSigns} vitals={vit} ageGroup={ageGroup} sex={sex} visuals={visuals} seed={seed} status={status} phaseIdx={phaseIdx}/>
      <LabPanel labs={curLabs} badMap={badMap} flags={flags} onFlag={flag} showFb={showFb} phaseIdx={phaseIdx}/>
      {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
        :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph&&ph.actions&&ph.actions.tools&&Object.keys(ph.actions.tools).length>0?"Open Tool Belt":"Continue"}</button>}
    </div>
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&whyTarget._abnormal?"#ff7675":"#4ECDC4"} item={whyTarget?(function(){
      // Phase-5.2.5: build slot-ref payload. The vital path uses cid="vital:<key>";
      // strip prefix for indexOrId. Falls back to assessItem ref when no canonical
      // vital cid is present.
      var cid=whyTarget.cid;
      var vk=cid&&cid.indexOf(":")>=0?cid.split(":")[1]:null;
      // Bug-sweep: phase-scope the mark id (see ActionPanel popMarkItem).
      // Same vital/assess id across phases must not collide in
      // markedForReview dedup or deepDiveCache. The id is opaque downstream.
      if(vk){
        return{id:cid+"@p"+phaseIdx,kind:"vital",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"vital",phaseIdx:phaseIdx,indexOrId:vk}};
      }
      var aiId=whyTarget._match?whyTarget._match.id:whyTarget.label;
      return{id:"assess:"+aiId+"@p"+phaseIdx,kind:"assessItem",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"assessItem",phaseIdx:phaseIdx,indexOrId:aiId}};
    })():null}/>
  </div>);
}
