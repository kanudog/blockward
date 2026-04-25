import { useState } from "react";
import { Flag, Check, X } from "lucide-react";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { BodySystemsView } from "./BodySystemsView.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";

var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";
var PP="linear-gradient(135deg,#a55eea,#8854d0)";

export function AssessPanel(props){
  var ph=props.ph;var vit=props.vit;var curSigns=props.curSigns;var curLabs=props.curLabs;
  var flags=props.flags;var showFb=props.showFb;var submit=props.submit;var afterA=props.afterA;var flag=props.flag;
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  var vitItems=ph.assessItems.filter(function(it){return !it.cat||it.cat==="vital";});
  var labItems=ph.assessItems.filter(function(it){return it.cat==="lab";});
  var clinItems=ph.assessItems.filter(function(it){return it.cat==="clinical";});
  var flaggedCount=Object.keys(flags).filter(function(k){return flags[k];}).length;
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
  function SectionHeader(p){return(<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
    <span style={{padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:800,letterSpacing:0.5,textTransform:"uppercase",background:p.bg,color:p.fg,border:"1px solid "+p.fg+"55"}}>{p.label}</span>
  </div>);}
  function renderItem(it){var f=!!flags[it.id];var ok=showFb&&(f===it.bad);
    var bg=showFb?(ok?"rgba(0,184,148,0.1)":"rgba(255,71,87,0.1)"):(f?"rgba(254,202,87,0.12)":"rgba(255,255,255,0.04)");
    var brd=showFb?(ok?"2px solid rgba(0,184,148,0.4)":"2px solid rgba(255,71,87,0.4)"):(f?"2px solid rgba(254,202,87,0.4)":"2px solid rgba(255,255,255,0.1)");
    var accent=showFb?(ok?"#00b894":"#FF6B81"):"#4ECDC4";
    return(<div key={it.id} style={{position:"relative",borderRadius:12,padding:10,background:bg,border:brd,color:"white",minHeight:78,display:"flex",flexDirection:"column"}}>
      {showFb&&<div style={{position:"absolute",top:6,right:6,fontSize:14}}>{ok?<Check size={14} color="#00b894"/>:<X size={14} color="#FF6B81"/>}</div>}
      {showFb&&it.why&&<button onClick={function(){setWhyTarget(it);}} style={{position:"absolute",bottom:6,right:6,padding:"2px 6px",borderRadius:999,fontSize:9,fontWeight:700,background:accent+"22",border:"1px solid "+accent+"66",color:accent,cursor:"pointer"}}>Why?</button>}
      {f&&!showFb&&<div style={{position:"absolute",top:6,right:6}}><Flag size={12} color="#FECA57"/></div>}
      <button onClick={function(){flag(it.id);}} className="bw-tap" style={{flex:1,minWidth:0,background:"none",border:"none",cursor:showFb?"default":"pointer",color:"white",textAlign:"left",padding:0,display:"flex",alignItems:"flex-start"}}>
        <span style={{fontWeight:700,fontSize:13,lineHeight:1.3,paddingRight:24}}>{it.label}</span>
      </button>
    </div>);}
  return(<div className="slu">
    <div className="bw-split">
      <div className="bw-split-left">
        <VitalsDisplay vitals={vit} reveal={revealMap}/>
        <BodySystemsView signs={curSigns}/>
        <LabPanel labs={curLabs}/>
        <div style={{borderRadius:12,padding:10,marginTop:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
          <TextBlock text={ph?ph.narrative:""} style={{fontSize:12,color:"#999",lineHeight:1.5}}/>
        </div>
      </div>
      <div className="bw-split-right">
        {!showFb&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:"8px 12px",borderRadius:10,background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.2)"}}>
          <span style={{fontSize:12,fontWeight:700,color:"#4ECDC4"}}>Tap abnormal findings</span>
          <span style={{fontSize:11,color:"#ccc",fontWeight:600}}>{flaggedCount+" flagged"}</span>
        </div>}
        <style>{"@media(min-width:768px){.bw-assess-grid{grid-template-columns:repeat(3,1fr) !important}}@media(min-width:1024px){.bw-assess-grid{grid-template-columns:repeat(4,1fr) !important}}"}</style>
        {vitItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Vital Signs" bg="rgba(78,205,196,0.12)" fg="#4ECDC4"/>
          <div className="bw-assess-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{vitItems.map(renderItem)}</div>
        </div>}
        {labItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Lab Values" bg="rgba(255,118,117,0.12)" fg="#ff7675"/>
          <div className="bw-assess-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{labItems.map(renderItem)}</div>
        </div>}
        {clinItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Clinical Findings" bg="rgba(254,202,87,0.12)" fg="#FECA57"/>
          <div className="bw-assess-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{clinItems.map(renderItem)}</div>
        </div>}
        {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
          :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
      </div>
    </div>
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget?(whyTarget.bad===!!flags[whyTarget.id]?"#00b894":"#FF6B81"):"#4ECDC4"} item={whyTarget?{id:"assess:"+whyTarget.id,label:whyTarget.label,type:whyTarget.cat==="clinical"?"finding":(whyTarget.cat||"vital"),originalWhy:whyTarget.why}:null}/>
  </div>);
}
