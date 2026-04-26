import { useState } from "react";
import { Flag, Check, X } from "lucide-react";
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
    {/* Phase-3.0 change 3: right-side "Tap abnormal findings" panel
        removed. The display surfaces (vitals monitor, body systems,
        labs) become the click targets in changes 4-6. Layout is
        single-column for now; the duplicate tile grid is gone.
        Submit/Continue button stays here for now and gets repositioned
        in change 7 once the new state machine lands. */}
    <div>
      <VitalsDisplay vitals={vit} reveal={revealMap}/>
      <BodySystemsView signs={curSigns}/>
      <LabPanel labs={curLabs}/>
      {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
        :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
    </div>
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget?(whyTarget.bad===!!flags[whyTarget.id]?"#00b894":"#FF6B81"):"#4ECDC4"} item={whyTarget?{id:"assess:"+whyTarget.id,label:whyTarget.label,type:whyTarget.cat==="clinical"?"finding":(whyTarget.cat||"vital"),originalWhy:whyTarget.why}:null}/>
  </div>);
}
