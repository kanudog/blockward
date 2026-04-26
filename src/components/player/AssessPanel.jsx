import { useState } from "react";
import { Flag, Check, X, AlertTriangle } from "lucide-react";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { BodySystemsView } from "./BodySystemsView.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { PatientHeader } from "./PatientHeader.jsx";

var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";
var PP="linear-gradient(135deg,#a55eea,#8854d0)";

export function AssessPanel(props){
  var ph=props.ph;var vit=props.vit;var curSigns=props.curSigns;var curLabs=props.curLabs;
  var flags=props.flags;var showFb=props.showFb;var submit=props.submit;var afterA=props.afterA;var flag=props.flag;
  var patient=props.patient||{};
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  // Phase-2.6 group E: reveal vital colors only after the user has
  // either submitted (showFb) or tapped that specific vital's
  // assess item. Map vital-label keywords → vital store key.
  function vitalKeyForLabel(label){
    var l=(label||"").toLowerCase();
    if(l.indexOf("hr")===0||l.indexOf("heart rate")>=0)return "hr";
    if(l.indexOf("spo2")===0||l.indexOf("sat")>=0||l.indexOf("o2")===0)return "spo2";
    if(l.indexOf("rr")===0||l.indexOf("resp")>=0)return "rr";
    if(l.indexOf("bp")===0||l.indexOf("sbp")===0||l.indexOf("blood pressure")>=0)return "sbp";
    if(l.indexOf("temp")>=0)return "temp";
    if(l.indexOf("cap")>=0)return "cap";
    return null;
  }
  // Phase-3.0 change 6: build clickable tile data for each vital field
  // present in `vit`. Tiles render in a row below the monitor; each
  // matches to an assessItem (cat:"vital") via vitalKeyForLabel so
  // clicks toggle the same flags state used by the Submit scoring.
  function vitalTiles(vitObj){
    if(!vitObj)return [];
    var t=[];
    if(vitObj.hr!==undefined)t.push({key:"hr",label:"HR",value:vitObj.hr,unit:"bpm"});
    if(vitObj.spo2!==undefined)t.push({key:"spo2",label:"SpO₂",value:vitObj.spo2,unit:"%"});
    if(vitObj.rr!==undefined)t.push({key:"rr",label:"RR",value:vitObj.rr,unit:"/min"});
    if(vitObj.sbp!==undefined&&vitObj.dbp!==undefined)t.push({key:"sbp",label:"BP",value:vitObj.sbp+"/"+vitObj.dbp,unit:"mmHg"});
    if(vitObj.temp!==undefined)t.push({key:"temp",label:"Temp",value:typeof vitObj.temp==="number"?vitObj.temp.toFixed(1):vitObj.temp,unit:"°C"});
    if(vitObj.cap!==undefined)t.push({key:"cap",label:"Cap Refill",value:vitObj.cap,unit:"sec"});
    return t;
  }
  var vitAssessByKey={};
  ph.assessItems.forEach(function(it){
    if(it.cat!=="vital")return;
    var k=vitalKeyForLabel(it.label);
    if(k&&!vitAssessByKey[k])vitAssessByKey[k]=it;
  });
  var revealMap={};
  if(showFb){revealMap={hr:true,spo2:true,rr:true,sbp:true,dbp:true,temp:true,cap:true};}
  else{
    ph.assessItems.forEach(function(it){
      if(it.cat!=="vital")return;
      if(!flags[it.id])return;
      var k=vitalKeyForLabel(it.label);
      if(k){revealMap[k]=true;if(k==="sbp")revealMap.dbp=true;}
    });
  }
  return(<div className="slu">
    {/* Phase-3.0 change 1: patient header + narrative anchored at top
        of Phase 1, replacing the previous bottom-of-left-column position.
        Header is compact (Age · Sex · Wt · CC); narrative reads as a
        clinical paragraph below it. */}
    <div style={{marginBottom:12}}>
      <PatientHeader patient={patient}/>
      {ph&&ph.narrative&&<div style={{marginTop:8,padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
        <TextBlock text={ph.narrative} style={{fontSize:13,color:"#ddd",lineHeight:1.55}}/>
      </div>}
    </div>
    {/* Phase-3.0: single-column layout. The display surfaces (monitor,
        body systems, labs) are the click targets — the previous
        right-side "Tap abnormal findings" panel was removed in change 3.
        Submit / Continue button is at the bottom, full-width. */}
    <div>
      <VitalsDisplay vitals={vit} reveal={revealMap}/>
      {/* Phase-3.0 change 6: clickable tile row for each vital below the
          monitor. Each tile matches to an assessItem with cat:"vital"
          via vitalKeyForLabel; clicking toggles that assessItem's flag.
          Grid matches LabPanel (2 cols by default, 1 col below 400px). */}
      <style>{"@media(max-width:400px){.bw-vital-grid{grid-template-columns:1fr !important}}"}</style>
      <div className="bw-vital-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
        {vitalTiles(vit).map(function(t){
          var match=vitAssessByKey[t.key];
          var isFlagged=match&&!!flags[match.id];
          // Phase-3.0 change 7: post-submit reveal — caught/missed/wrong
          // driven by matched assessItem.bad. Same semantics as labs +
          // body system rows.
          var revealBad = match ? !!match.bad : false;
          var revealState = null;
          if(showFb){
            if(revealBad&&isFlagged)revealState="caught";
            else if(revealBad&&!isFlagged)revealState="missed";
            else if(!revealBad&&isFlagged)revealState="wrong";
          }
          var bg, brd;
          if(!showFb){
            bg=isFlagged?"rgba(78,205,196,0.12)":"rgba(255,255,255,0.04)";
            brd=isFlagged?"2px solid rgba(78,205,196,0.55)":"1px solid rgba(255,255,255,0.08)";
          }else if(revealState==="caught"){bg="rgba(0,184,148,0.12)";brd="2px solid rgba(0,184,148,0.5)";}
          else if(revealState==="missed"){bg="rgba(255,71,87,0.12)";brd="2px solid rgba(255,71,87,0.5)";}
          else if(revealState==="wrong"){bg="rgba(254,202,87,0.12)";brd="2px solid rgba(254,202,87,0.5)";}
          else{bg="rgba(255,255,255,0.04)";brd="1px solid rgba(255,255,255,0.06)";}
          var valueColor = showFb && revealBad ? "#ff7675" : "#fff";
          var showWhyBtn = showFb && match && match.bad && match.why;
          var whyAccent = revealBad?"#ff7675":"#4ECDC4";
          function openWhy(e){
            if(e&&e.stopPropagation)e.stopPropagation();
            setWhyTarget(match);
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
          </div>);
          if(!showFb){
            return(<button key={t.key} onClick={function(){if(match)flag(match.id);}} className="bw-tap" style={{padding:0,background:"none",border:"none",display:"block",width:"100%",cursor:match?"pointer":"default",opacity:match?1:0.6}}>{inner}</button>);
          }
          return(<div key={t.key}>{inner}</div>);
        })}
      </div>
      {/* Phase-3.0 change 5: signs inside body-system cards are now
          individually clickable. Same interactive props as LabPanel. */}
      <BodySystemsView signs={curSigns} assessItems={ph.assessItems} flags={flags} onFlag={flag} showFb={showFb}/>
      {/* Phase-3.0 change 4: labs are now click targets — pass assessItems
          + flags + onFlag so LabPanel can match each lab to an assessItem
          and toggle its flag. showFb gates pre-submit vs post-submit
          treatment (post-submit reveal lands in change 7). */}
      <LabPanel labs={curLabs} assessItems={ph.assessItems} flags={flags} onFlag={flag} showFb={showFb}/>
      {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
        :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
    </div>
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget?(whyTarget.bad===!!flags[whyTarget.id]?"#00b894":"#FF6B81"):"#4ECDC4"} item={whyTarget?{id:"assess:"+whyTarget.id,label:whyTarget.label,type:whyTarget.cat==="clinical"?"finding":(whyTarget.cat||"vital"),originalWhy:whyTarget.why}:null}/>
  </div>);
}
