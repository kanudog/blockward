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
    var brd=showFb?(ok?"2px solid rgba(0,184,148,0.25)":"2px solid rgba(255,71,87,0.25)"):(f?"2px solid rgba(254,202,87,0.25)":"2px solid rgba(255,255,255,0.07)");
    var ilabel=it.label.toLowerCase();
    var miniSVG=null;
    if(ilabel.indexOf("mottl")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="10" cy="15" r="4" fill="#9080a0" opacity="0.6"/><circle cx="25" cy="12" r="3" fill="#9080a0" opacity="0.5"/><circle cx="18" cy="28" r="3.5" fill="#9080a0" opacity="0.6"/><circle cx="32" cy="25" r="2.5" fill="#9080a0" opacity="0.5"/><circle cx="8" cy="32" r="3" fill="#9080a0" opacity="0.4"/></svg>);};
    if(ilabel.indexOf("eye")>=0||ilabel.indexOf("deviat")>=0||ilabel.indexOf("pupil")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="14" cy="20" r="7" fill="white"/><circle cx="26" cy="20" r="7" fill="white"/><circle cx="14" cy="16" r="3.5" fill="#2d3436"/><circle cx="26" cy="16" r="3.5" fill="#2d3436"/></svg>);};
    if(ilabel.indexOf("cyan")>=0||ilabel.indexOf("blue")>=0||ilabel.indexOf("lip")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="14" cy="16" r="3" fill="#2d3436"/><circle cx="26" cy="16" r="3" fill="#2d3436"/><ellipse cx="20" cy="28" rx="8" ry="4" fill="#8888bb"/></svg>);};
    if(ilabel.indexOf("flush")>=0||ilabel.indexOf("hive")>=0||ilabel.indexOf("rash")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="10" cy="12" r="3" fill="#ff6b6b" opacity="0.7"/><circle cx="25" cy="10" r="2.5" fill="#ff6b6b" opacity="0.6"/><circle cx="15" cy="28" r="3.5" fill="#ff6b6b" opacity="0.7"/><circle cx="30" cy="22" r="2" fill="#ff6b6b" opacity="0.5"/><circle cx="8" cy="22" r="2.5" fill="#ff6b6b" opacity="0.6"/></svg>);};
    if(ilabel.indexOf("cool")>=0||ilabel.indexOf("pale")>=0||ilabel.indexOf("ashen")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#ddd"/><rect x="5" y="20" width="12" height="16" rx="4" fill="#c8c8d8"/><rect x="23" y="20" width="12" height="16" rx="4" fill="#c8c8d8"/></svg>);};
    if(ilabel.indexOf("retract")>=0||ilabel.indexOf("accessory")>=0||ilabel.indexOf("tripod")>=0||ilabel.indexOf("work of breath")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><rect x="10" y="12" width="20" height="18" rx="6" fill="#E8F0FE" opacity="0.4"/><line x1="15" y1="16" x2="15" y2="26" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/><line x1="25" y1="16" x2="25" y2="26" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/><line x1="20" y1="14" x2="20" y2="28" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/></svg>);};
    if(ilabel.indexOf("jvd")>=0||ilabel.indexOf("neck vein")>=0||ilabel.indexOf("jugular")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><rect x="14" y="5" width="12" height="30" rx="6" fill="#e8c8a8"/><line x1="17" y1="10" x2="17" y2="30" stroke="#70a0d0" strokeWidth="2"/><line x1="23" y1="10" x2="23" y2="30" stroke="#70a0d0" strokeWidth="2"/></svg>);};
    var accent=showFb?(ok?"#00b894":"#FF6B81"):"#4ECDC4";
    return(<div key={it.id} style={{borderRadius:12,padding:14,background:bg,border:brd,color:"white"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {miniSVG&&<div style={{flexShrink:0}}>{miniSVG()}</div>}
        <button onClick={function(){flag(it.id);}} className="bw-tap" style={{flex:1,minWidth:0,background:"none",border:"none",cursor:showFb?"default":"pointer",color:"white",textAlign:"left",padding:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <span style={{fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:6}}>{f&&!showFb&&<Flag size={14} color="#FECA57"/>}{it.label}</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {showFb&&<span style={{fontSize:15,fontWeight:700}}>{ok?<Check size={16}/>:<X size={16}/>}</span>}
            </div>
          </div>
        </button>
      </div>
      {showFb&&it.why&&<div style={{marginTop:8,display:"flex",justifyContent:"flex-end"}}><WhyButton onClick={function(){setWhyTarget(it);}} accent={accent}/></div>}
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
        {vitItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Vital Signs" bg="rgba(78,205,196,0.12)" fg="#4ECDC4"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{vitItems.map(renderItem)}</div>
        </div>}
        {labItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Lab Values" bg="rgba(255,118,117,0.12)" fg="#ff7675"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{labItems.map(renderItem)}</div>
        </div>}
        {clinItems.length>0&&<div style={{marginBottom:12}}>
          <SectionHeader label="Clinical Findings" bg="rgba(254,202,87,0.12)" fg="#FECA57"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{clinItems.map(renderItem)}</div>
        </div>}
        {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
          :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
      </div>
    </div>
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} accent={whyTarget?(whyTarget.bad===!!flags[whyTarget.id]?"#00b894":"#FF6B81"):"#4ECDC4"} item={whyTarget?{id:"assess:"+whyTarget.id,label:whyTarget.label,type:whyTarget.cat==="clinical"?"finding":(whyTarget.cat||"vital"),originalWhy:whyTarget.why}:null}/>
  </div>);
}
