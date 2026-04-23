import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Activity, Wind, Droplets, Zap, Thermometer, Timer, Eye, Syringe, Stethoscope, Shield, Gauge, Pin, Brain, ChevronRight, ChevronDown, ChevronLeft, X, Check, AlertTriangle, Flag, Star, Trophy, FlaskConical, Pill, Beaker, Clock, Search, Plus, Minus, ArrowRight, CircleCheck, CircleX, Sparkles, BookOpen, Users, Play, Settings, Share2, Trash2, RotateCcw, Info, Volume2 } from "lucide-react";
import { TOOLS, MEDS, SC1, SC2, SC3 } from "./lib/scenarios/builtIn.js";
import { computeAssessScore, computeActionScore } from "./lib/scenarios/scoring.js";
import { useScenariosStore } from "./stores/scenariosStore.js";
import { usePlayerStore } from "./stores/playerStore.js";
function TextBlock(props){
  var text=props.text||"";var style=props.style||{};
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<=1)return(<p style={style}>{text}</p>);
  return(<div style={style}>{lines.map(function(line,i){
    var trimmed=line.trim();
    var isBullet=trimmed.charAt(0)==="\u2022"||trimmed.charAt(0)==="-"||trimmed.charAt(0)==="\u2013"||trimmed.match(/^\d+[\.\)]/);
    if(isBullet){
      var content=trimmed.replace(/^[\u2022\-\u2013]\s*/,"").replace(/^\d+[\.\)]\s*/,"");
      return(<div key={i} style={{display:"flex",gap:6,marginTop:i>0?3:0}}><span style={{color:"#4ECDC4",flexShrink:0}}>{"\u2022"}</span><span>{content}</span></div>);
    }
    return(<p key={i} style={{marginTop:i>0?6:0}}>{trimmed}</p>);
  })}</div>);
}
function ToolIcon({name, size=24, color="#4ECDC4"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(name) {
    case "glucometer": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="10" y1="8" x2="14" y2="8"/><circle cx="12" cy="14" r="2"/><line x1="12" y1="22" x2="12" y2="20"/></svg>;
    case "stethoscope": return <Stethoscope size={size} color={color} strokeWidth={2}/>;
    case "bvm": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/></svg>;
    case "suction": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M8 8h8l-1 10H9L8 8z"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>;
    case "o2mask": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s-2 2-2 4a4 4 0 008 0c0-2-2-4-2-4"/><ellipse cx="12" cy="10" rx="5" ry="6"/><line x1="12" y1="4" x2="12" y2="2"/><path d="M7 10H3"/><path d="M21 10h-4"/></svg>;
    case "ivKit": return <Syringe size={size} color={color} strokeWidth={2}/>;
    case "defib": return <Zap size={size} color={color} strokeWidth={2}/>;
    case "thermometer": return <Thermometer size={size} color={color} strokeWidth={2}/>;
    case "capRefill": return <Timer size={size} color={color} strokeWidth={2}/>;
    case "needleDecomp": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="16"/><path d="M8 12l4 4 4-4"/><circle cx="12" cy="20" r="2"/></svg>;
    case "pupilCheck": return <Eye size={size} color={color} strokeWidth={2}/>;
    case "epiPen": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="16" rx="2"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="9" y1="6" x2="15" y2="6"/><circle cx="12" cy="10" r="1" fill={color}/></svg>;
    case "peakFlow": return <Wind size={size} color={color} strokeWidth={2}/>;
    default: return <Activity size={size} color={color} strokeWidth={2}/>;
  }
}
function MedIcon({type, size=22, color="#74b9ff"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(type) {
    case "neb": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18v-2a4 4 0 018 0v2"/><rect x="6" y="18" width="12" height="4" rx="1"/><path d="M12 8v4"/><circle cx="12" cy="6" r="2"/><path d="M9 3l3 3 3-3"/></svg>;
    case "oral": return <Pill size={size} color={color} strokeWidth={2}/>;
    case "push": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="14" rx="2"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="10" y1="6" x2="14" y2="6"/><path d="M10 2v-0"/><circle cx="12" cy="10" r="1.5" fill={color}/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5"/><path d="M5 12h14"/><rect x="5" y="7" width="14" height="14" rx="2"/><circle cx="12" cy="15" r="2"/></svg>;
  }
}
function guessAge(sc) {
  var label = "";
  if (sc && sc.patient && sc.patient.ageLabel) label = sc.patient.ageLabel.toLowerCase();
  else if (sc && sc.tagline) label = sc.tagline.toLowerCase();
  if (!label) return "child";
  if (label.indexOf("newborn") >= 0 || label.indexOf("neonate") >= 0) return "infant";
  var m = label.match(/(\d+)/);
  if (!m) {
    if (label.indexOf("infant") >= 0 || label.indexOf("baby") >= 0) return "infant";
    if (label.indexOf("toddler") >= 0) return "toddler";
    return "child";
  }
  var n = parseInt(m[1]);
  if (label.indexOf("month") >= 0 || label.indexOf("mo") >= 0) {
    if (n <= 12) return "infant";
    if (n <= 36) return "toddler";
    return "child";
  }
  if (label.indexOf("year") >= 0 || label.indexOf("yr") >= 0 || label.indexOf("yo") >= 0) {
    if (n <= 1) return "infant";
    if (n <= 3) return "toddler";
    if (n <= 10) return "child";
    return "teen";
  }
  if (n <= 2) return "infant";
  if (n <= 4) return "toddler";
  if (n <= 10) return "child";
  return "teen";
}
function guessSex(sc) {
  if (!sc || !sc.patient) return "neutral";
  var s = (sc.patient.sex || "").toLowerCase();
  if (s === "male" || s === "m" || s === "boy") return "male";
  if (s === "female" || s === "f" || s === "girl") return "female";
  return "neutral";
}
function ecgPt(t,hr){var p=60/hr,x=(t%p)/p;if(x<.06)return 0;if(x<.08)return Math.sin((x-.06)/.02*Math.PI)*0.05;if(x<.10)return(x-.08)/.02*1.0;if(x<.12)return 1.0-(x-.10)/.02*1.0;if(x<.14)return 0;if(x<.30)return Math.sin((x-.14)/.16*Math.PI)*0.08;return 0;}
function plPt(t,hr){var p=60/hr,x=(t%p)/p;return(Math.sin(x*Math.PI*2-Math.PI/2)+1)/2*0.8;}
function Monitor(props){
  var vitals=props.vitals;var flash=props.flash;
  var cR=useRef(null);var tR=useRef(0);var aR=useRef(null);
  useEffect(function(){var c=cR.current;if(!c)return;var ctx=c.getContext("2d");var W=c.width;var H=c.height;
    var draw=function(){tR.current+=.016;var t=tR.current;ctx.fillStyle="#0a0e1a";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(78,205,196,0.05)";ctx.lineWidth=.5;
      for(var i=0;i<W;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
      for(var j=0;j<H;j+=20){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
      ctx.strokeStyle="#4ECDC4";ctx.lineWidth=2;ctx.shadowColor="#4ECDC4";ctx.shadowBlur=6;ctx.beginPath();
      for(var k=0;k<W;k++){var y=H*.25-ecgPt(t-(W-k)*.008,vitals.hr)*H*.2;k===0?ctx.moveTo(k,y):ctx.lineTo(k,y);}ctx.stroke();ctx.shadowBlur=0;
      ctx.strokeStyle="#FECA57";ctx.lineWidth=2;ctx.shadowColor="#FECA57";ctx.shadowBlur=6;ctx.beginPath();
      for(var m=0;m<W;m++){var yy=H*.7-plPt(t-(W-m)*.008,vitals.hr)*H*.15;m===0?ctx.moveTo(m,yy):ctx.lineTo(m,yy);}ctx.stroke();ctx.shadowBlur=0;
      ctx.font="bold 10px sans-serif";ctx.fillStyle="#4ECDC4";ctx.fillText("ECG II",8,16);ctx.fillStyle="#FECA57";ctx.fillText("SpO2",8,H*.57);
      aR.current=requestAnimationFrame(draw);};draw();return function(){cancelAnimationFrame(aR.current);};},[vitals.hr]);
  var bColor=flash?"#FF4757":"#555";
  var vs=[{l:"HR",v:vitals.hr,u:"bpm"},{l:"SpO2",v:vitals.spo2,u:"%"},{l:"RR",v:vitals.rr,u:"/min"},{l:"BP",v:vitals.sbp+"/"+vitals.dbp,u:"mmHg"},{l:"Temp",v:typeof vitals.temp==="number"?vitals.temp.toFixed(1):vitals.temp,u:"C"},{l:"Cap Refill",v:vitals.cap,u:"sec"}];
  return(
    <div style={{borderRadius:16,overflow:"hidden",border:"4px solid "+bColor,background:"#0a0e1a"}}>
      <canvas ref={cR} width={400} height={180} style={{width:"100%",height:150,display:"block"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,padding:8,background:"#0d1117"}}>
        {vs.map(function(v){var vColor="#c8d6e5";if(v.l==="HR")vColor="#55efc4";else if(v.l==="SpO2")vColor="#fdcb6e";else if(v.l==="Temp"&&(v.v<36.5||v.v>37.5))vColor="#ff7675";return(
          <div key={v.l} style={{borderRadius:8,padding:4,textAlign:"center",background:"rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{v.l}</div>
            <div style={{fontSize:20,fontWeight:900,color:vColor}}>{v.v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{v.u}</div>
          </div>);})}
      </div>
    </div>);
}
function SignCard(props){
  var s=props.s;var delay=props.delay||0;
  return(<div style={{marginBottom:6,opacity:0,animation:"fadeCard 0.4s ease-out "+delay+"s forwards"}}>
    <div style={{borderRadius:8,padding:10,background:"rgba(10,14,26,0.92)",border:"1.5px solid rgba(78,205,196,0.4)"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",lineHeight:1.2}}>{s.label}</div>
      <div style={{fontSize:11,color:"#bbc",lineHeight:1.4,marginTop:2}}>{s.detail}</div>
    </div>
  </div>);
}
function BodySystemsView(props) {
  var signs = props.signs || [];
  var allSystems = ["Neuro","Cardiovascular","Respiratory","GI","GI/Hydration","Integumentary","Renal","Musculoskeletal","HEENT"];
  function guessSys(s) {
    if (s.sys) return s.sys;
    var l = (s.label + " " + s.detail).toLowerCase();
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
  var sysIcons = {};
  var presentSystems = Object.keys(grouped);
  var absentSystems = allSystems.filter(function(s) { return !grouped[s]; });
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Systems Assessment:</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {presentSystems.map(function(sys,i) {
          var IconComp = sysIconMap[sys] || Search;
          return (
            <div key={sys} style={{borderRadius:8,padding:"6px 10px",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.15)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4ECDC4",marginBottom:3,display:"flex",alignItems:"center",gap:4}}><IconComp size={14}/>  {sys}</div>
              {grouped[sys].map(function(s,j) {
                return <div key={j} style={{fontSize:11,color:"#ccd",lineHeight:1.4,marginBottom:2}}><span style={{fontWeight:600,color:"#ddd"}}>{s.label}:</span> {s.detail}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function LabPanel(props) {
  var labs = props.labs || [];
  var _openLab = useState(null);var openLab=_openLab[0];var setOpenLab=_openLab[1];
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
        {labs.some(function(l){return l.explain;})&&<div style={{fontSize:9,color:"#666"}}>Tap critical values for details</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {labs.map(function(lab,i) {
          var isCrit = lab.critical === true;
          var bg = isCrit ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.04)";
          var brd = isCrit ? "1px solid rgba(255,71,87,0.25)" : "1px solid rgba(255,255,255,0.06)";
          var isOpen = openLab === i;
          var tappable = isCrit && lab.explain;
          return (
            <div key={i} onClick={tappable?function(){setOpenLab(isOpen?null:i);}:undefined} style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd,cursor:tappable?"pointer":"default",gridColumn:isOpen?"1 / -1":"auto"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:600}}>{lab.name}{tappable&&!isOpen?" \u24D8":""}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:16,fontWeight:800,color:isCrit?"#ff7675":"#c8d6e5"}}>{lab.value}</span>
                <span style={{fontSize:9,color:"#666"}}>{lab.unit}</span>
              </div>
              <div style={{fontSize:9,color:"#555"}}>{"Ref: "+lab.ref}</div>
              {isOpen&&lab.explain&&<div style={{marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:11,color:"#ccc",lineHeight:1.5}}>{lab.explain}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function PatientSVG(props){
  var status=props.status||"stable";
  var rr=props.rr||30;
  var ageGroup=props.ageGroup||"infant";
  var sex=props.sex||"neutral";
  var visuals=props.visuals||[];
  var emotion=props.emotion||"neutral";
  var sk=status==="critical"?"#dbb8b8":status==="declining"?"#f0ccb0":"#ffcc99";
  var ch=status==="critical"?"#b09090":status==="declining"?"#e8a080":"#ff9999";
  var mo=status==="critical"?0.55:status==="declining"?0.25:0;
  var eyesClosed=status==="critical";
  var isHappy=emotion==="happy";
  var isSad=emotion==="sad";
  var cyanotic=status==="critical";
  var dur=(60/rr)+"s";
  var isInfant=ageGroup==="infant";
  var isToddler=ageGroup==="toddler";
  var isChild=ageGroup==="child";
  var isTeen=ageGroup==="teen";
  var headW=isInfant?60:isTeen?50:isChild?52:56;
  var headH=isInfant?55:isTeen?50:isChild?48:52;
  var headRx=isInfant?18:isTeen?14:isChild?15:16;
  var headX=isInfant?30:isTeen?35:isChild?34:32;
  var headY=isInfant?112:isTeen?92:isChild?98:105;
  var bodyW=isInfant?50:isTeen?65:isChild?58:54;
  var bodyH=isInfant?30:isTeen?45:isChild?38:34;
  var bodyX=isInfant?35:isTeen?28:isChild?31:33;
  var bodyY=isInfant?165:isTeen?140:isChild?144:158;
  var eyeY=headY+headH*0.45;
  var eyeLX=headX+headW*0.28;
  var eyeRX=headX+headW*0.72;
  var eyeR=isInfant?5:isTeen?4.5:isChild?4.5:5;
  var mouthY=headY+headH*0.72;
  var mouthCX=headX+headW*0.5;
  var cheekR=isInfant?7:5;
  var cheekLX=headX+headW*0.2;
  var cheekRX=headX+headW*0.8;
  var cheekY=headY+headH*0.65;
  var hairColor=sex==="female"?"#8B4513":"#b8860b";
  var hasLongHair=sex==="female";
  // Parse visuals for equipment/features
  var hasV=function(keyword){return visuals.some(function(v){return v.toLowerCase().indexOf(keyword)>=0;});};
  var castLeft=hasV("cast left arm")||hasV("left arm cast")||hasV("broken left arm")||hasV("fractured left arm");
  var castRight=hasV("cast right arm")||hasV("right arm cast")||hasV("broken right arm")||hasV("fractured right arm");
  var castLeg=hasV("cast leg")||hasV("leg cast")||hasV("broken leg")||hasV("fractured leg");
  var headBandage=hasV("head bandage")||hasV("head wrap")||hasV("head injury")||hasV("head trauma");
  var wheelchair=hasV("wheelchair");
  var oxygenCannula=hasV("nasal cannula")||hasV("oxygen cannula")||hasV("o2 cannula");
  var oxygenMask=hasV("oxygen mask")||hasV("o2 mask")||hasV("non-rebreather");
  var hives=hasV("hives")||hasV("urticaria")||hasV("rash")||hasV("allergic");
  var neckBrace=hasV("c-collar")||hasV("neck brace")||hasV("cervical collar");
  var armSling=hasV("sling")||hasV("arm sling");
  var eyePatch=hasV("eye patch")||hasV("eye bandage");
  var armLX=bodyX-8;
  var armRX=bodyX+bodyW+2;
  var armY=bodyY+4;
  return(
    <svg viewBox="0 0 200 260" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))"}}>
      <style>{"@keyframes fadeCard{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}"}</style>
      {/* Wheelchair (behind bed) */}
      {wheelchair&&(
        <g>
          <circle cx="50" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="140" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="50" cy="240" r="3" fill="#666"/>
          <circle cx="140" cy="240" r="3" fill="#666"/>
          <rect x="30" y="170" width="130" height="6" rx="3" fill="#888"/>
          <line x1="40" y1="176" x2="50" y2="222" stroke="#666" strokeWidth="2"/>
          <line x1="150" y1="176" x2="140" y2="222" stroke="#666" strokeWidth="2"/>
          <rect x="25" y="165" width="8" height="50" rx="3" fill="#888"/>
          <rect x="157" y="165" width="8" height="50" rx="3" fill="#888"/>
        </g>
      )}
      {/* Bed (skip if wheelchair) */}
      {!wheelchair&&(
        <g>
          <rect x="10" y="188" width="180" height="58" rx="14" fill="#5B86E5"/>
          <rect x="15" y="192" width="170" height="50" rx="10" fill="#E8F0FE"/>
          <rect x="20" y="196" width="55" height="38" rx="8" fill="white"/>
          <rect x="60" y="201" width="120" height="32" rx="8" fill="#FF6B81" opacity="0.75"/>
        </g>
      )}
      {/* Body */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0" dur={dur} repeatCount="indefinite" additive="sum"/>
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={10} fill={sk}/>
        <rect x={bodyX+2} y={bodyY+2} width={bodyW-4} height={bodyH-4} rx={8} fill="#E8F0FE" opacity="0.4"/>
      </g>
      {/* Arms (simple blocky stubs) */}
      <rect x={armLX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      <rect x={armRX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      {/* Hives/rash overlay */}
      {hives&&(
        <g opacity="0.7">
          <circle cx={bodyX+8} cy={bodyY+8} r="3" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW-12} cy={bodyY+12} r="2.5" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW/2} cy={bodyY+5} r="2" fill="#ff6b6b"/>
          <circle cx={armLX+5} cy={armY+6} r="2" fill="#ff6b6b"/>
          <circle cx={armRX+5} cy={armY+8} r="2.5" fill="#ff6b6b"/>
          <circle cx={headX+12} cy={headY+headH*0.4} r="2" fill="#ff6b6b"/>
          <circle cx={headX+headW-12} cy={headY+headH*0.35} r="1.8" fill="#ff6b6b"/>
          <circle cx={bodyX+15} cy={bodyY+bodyH-8} r="2.5" fill="#ff6b6b"/>
        </g>
      )}
      {/* Cast left arm */}
      {castLeft&&(
        <rect x={armLX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Cast right arm */}
      {castRight&&(
        <rect x={armRX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Arm sling */}
      {armSling&&(
        <g>
          <path d={"M"+(headX+headW*0.3)+" "+(headY+headH+2)+" L"+(bodyX+bodyW*0.3)+" "+(bodyY+bodyH*0.8)+" L"+(bodyX+bodyW*0.7)+" "+(bodyY+bodyH*0.8)+" L"+(headX+headW*0.7)+" "+(headY+headH+2)} fill="#4a90d9" opacity="0.6"/>
        </g>
      )}
      {/* Cast leg */}
      {castLeg&&(
        <rect x={bodyX+bodyW*0.1} y={bodyY+bodyH-2} width={bodyW*0.35} height={18} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Mottling */}
      {mo>0&&(
        <g opacity={mo}>
          <circle cx={bodyX+8} cy={bodyY+bodyH*0.5} r="4" fill="#8070a0"/>
          <circle cx={bodyX+18} cy={bodyY+bodyH*0.7} r="3" fill="#8070a0"/>
          <circle cx={bodyX+bodyW-10} cy={bodyY+bodyH*0.4} r="3.5" fill="#8070a0"/>
        </g>
      )}
      {/* Head */}
      <rect x={headX} y={headY} width={headW} height={headH} rx={headRx} fill={sk} stroke="#e0b878" strokeWidth="0.8"/>
      {/* Head bandage */}
      {headBandage&&(
        <g>
          <rect x={headX-2} y={headY+2} width={headW+4} height={10} rx={4} fill="white" stroke="#ddd" strokeWidth="0.5" opacity="0.9"/>
          <circle cx={headX+headW*0.75} cy={headY+7} r="3" fill="#ff6b6b" opacity="0.5"/>
        </g>
      )}
      {/* Neck brace / C-collar */}
      {neckBrace&&(
        <rect x={headX+2} y={headY+headH-4} width={headW-4} height={10} rx={3} fill="#f0e6d2" stroke="#d4c4a8" strokeWidth="0.8"/>
      )}
      {/* Cheeks */}
      <circle cx={cheekLX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      <circle cx={cheekRX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      {/* Eyes */}
      {eyesClosed?(
        <g>
          <line x1={eyeLX-eyeR} y1={eyeY} x2={eyeLX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
          <line x1={eyeRX-eyeR} y1={eyeY} x2={eyeRX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
        </g>
      ):(
        <g>
          <circle cx={eyeLX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeRX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeLX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeRX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeLX+1.5} cy={eyeY-1} r={1} fill="white"/>
          <circle cx={eyeRX+1.5} cy={eyeY-1} r={1} fill="white"/>
        </g>
      )}
      {/* Eye patch */}
      {eyePatch&&(
        <g>
          <ellipse cx={eyeLX} cy={eyeY} rx={eyeR+2} ry={eyeR+1} fill="#444" opacity="0.85"/>
          <line x1={eyeLX} y1={eyeY-eyeR-1} x2={headX+headW*0.7} y2={headY+4} stroke="#444" strokeWidth="1.5"/>
        </g>
      )}
      {/* Nasal cannula */}
      {oxygenCannula&&(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-8)+" Q"+mouthCX+" "+(mouthY-12)+" "+(mouthCX+8)+" "+(mouthY-8)} fill="none" stroke="#70a0d0" strokeWidth="1.5"/>
          <circle cx={mouthCX-6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <circle cx={mouthCX+6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <line x1={mouthCX-8} y1={mouthY-8} x2={headX-4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+8} y1={mouthY-8} x2={headX+headW+4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Oxygen mask / NRB */}
      {oxygenMask&&(
        <g>
          <ellipse cx={mouthCX} cy={mouthY-3} rx={10} ry={8} fill="rgba(112,160,208,0.3)" stroke="#70a0d0" strokeWidth="1.5"/>
          <line x1={mouthCX-10} y1={mouthY-3} x2={headX-4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+10} y1={mouthY-3} x2={headX+headW+4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Mouth */}
      {!oxygenMask&&(cyanotic?(
        <ellipse cx={mouthCX} cy={mouthY} rx="6" ry="3.5" fill="#8888bb"/>
      ):isHappy?(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-2)+" Q"+mouthCX+" "+(mouthY+10)+" "+(mouthCX+8)+" "+(mouthY-2)} fill="#c08060" opacity="0.3" stroke="#c08060" strokeWidth="1.5"/>
        </g>
      ):isSad?(
        <g>
          <path d={"M"+(mouthCX-6)+" "+(mouthY+3)+" Q"+mouthCX+" "+(mouthY-4)+" "+(mouthCX+6)+" "+(mouthY+3)} fill="none" stroke="#c09878" strokeWidth="1.5"/>
          <circle cx={eyeLX+2} cy={eyeY+eyeR+4} r="1.5" fill="#70a0d0" opacity="0.7"/>
          <circle cx={eyeRX-1} cy={eyeY+eyeR+5} r="1.2" fill="#70a0d0" opacity="0.6"/>
        </g>
      ):(
        <path d={"M"+(mouthCX-7)+" "+mouthY+" Q"+mouthCX+" "+(mouthY+(status==="declining"?4:6))+" "+(mouthCX+7)+" "+mouthY} fill="none" stroke={status==="declining"?"#c09878":"#c08060"} strokeWidth="1.5"/>
      ))}
      {/* Happy bounce animation */}
      {isHappy&&(
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0;0,-5;0,0" dur="0.8s" repeatCount="indefinite" additive="sum"/>
      )}
      {/* Hair */}
      {isInfant&&(
        <g>
          <path d={"M"+(headX+5)+" "+(headY+10)+" Q"+(headX+15)+" "+(headY-5)+" "+(headX+25)+" "+(headY+3)} fill="none" stroke={hairColor} strokeWidth="2"/>
          <path d={"M"+(headX+20)+" "+(headY+5)+" Q"+(headX+30)+" "+(headY-8)+" "+(headX+40)+" "+(headY)} fill="none" stroke={hairColor} strokeWidth="2"/>
        </g>
      )}
      {isToddler&&(
        <g>
          <path d={"M"+(headX+2)+" "+(headY+12)+" Q"+(headX+10)+" "+(headY-6)+" "+(headX+headW/2)+" "+(headY-2)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          <path d={"M"+(headX+headW/2)+" "+(headY-2)+" Q"+(headX+headW-10)+" "+(headY-6)+" "+(headX+headW-2)+" "+(headY+12)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          {hasLongHair&&<path d={"M"+(headX+headW-2)+" "+(headY+12)+" Q"+(headX+headW+5)+" "+(headY+30)+" "+(headX+headW-2)+" "+(headY+headH-5)} fill="none" stroke={hairColor} strokeWidth="2.5"/>}
        </g>
      )}
      {(isChild||isTeen)&&!headBandage&&(
        <g>
          <rect x={headX+2} y={headY-2} width={headW-4} height={headH*0.3} rx={headRx-2} fill={hairColor} opacity="0.85"/>
          {hasLongHair&&(
            <g>
              <path d={"M"+(headX+2)+" "+(headY+headH*0.2)+" Q"+(headX-5)+" "+(headY+headH*0.6)+" "+(headX)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
              <path d={"M"+(headX+headW-2)+" "+(headY+headH*0.2)+" Q"+(headX+headW+5)+" "+(headY+headH*0.6)+" "+(headX+headW)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
            </g>
          )}
        </g>
      )}
      {/* IV line */}
      <line x1={bodyX+bodyW} y1={bodyY+5} x2="145" y2={headY-10} stroke="#70a0d0" strokeWidth="1.5" strokeDasharray="4,3"/>
      <rect x="140" y={headY-30} width="14" height="28" rx="3" fill="#70a0d0" opacity="0.5"/>
      {/* Stuffed animal */}
      <g transform="translate(130,208) scale(0.4)">
        <circle cx="20" cy="20" r="15" fill="#FFD93D"/>
        <circle cx="12" cy="15" r="3" fill="#2d3436"/>
        <circle cx="28" cy="15" r="3" fill="#2d3436"/>
        <ellipse cx="20" cy="24" rx="4" ry="2.5" fill="#FF9F43"/>
        <circle cx="8" cy="6" r="7" fill="#FFD93D"/>
        <circle cx="32" cy="6" r="7" fill="#FFD93D"/>
      </g>
    </svg>
  );
}
function PatientView(props){
  var status=props.status;var rr=props.rr;var signs=props.signs||[];
  var ageGroup=props.ageGroup||"infant";var sex=props.sex||"neutral";
  var visuals=props.visuals||[];var emotion=props.emotion||"neutral";
  var leftSigns=signs.filter(function(_,i){return i%2===0;});
  var rightSigns=signs.filter(function(_,i){return i%2===1;});
  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",gap:4}}>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {leftSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15}/>;})}</div>
        <div style={{width:180,flexShrink:0}}>
          <PatientSVG status={status} rr={rr} ageGroup={ageGroup} sex={sex} visuals={visuals} emotion={emotion}/></div>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {rightSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15+0.1}/>;})}</div>
      </div>
    </div>);
}
function ActionPanel(props){
  var tools=props.tools;var meds=props.meds;var actions=props.actions;var onDone=props.onDone;
  var _sel=useState({});var sel=_sel[0];var setSel=_sel[1];
  var _pop=useState(null);var pop=_pop[0];var setPop=_pop[1];
  var rT=Object.entries(actions&&actions.tools?actions.tools:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var rM=Object.entries(actions&&actions.meds?actions.meds:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var totalCorrect=rT.length+rM.length;
  var allF=totalCorrect>0&&rT.concat(rM).every(function(id){return sel[id];});
  var explored=Object.keys(sel).length;
  var total=(tools?tools.length:0)+(meds?meds.length:0);
  var pick=function(id,ty){var src=ty==="t"?(actions&&actions.tools):(actions&&actions.meds);var info=src?src[id]:null;if(!info)return;
    setSel(function(p){var n=Object.assign({},p);n[id]=info;return n;});setPop({id:id,ty:ty,info:info});};
  var finish=function(){onDone(computeActionScore(tools,meds,actions,sel));};
  function tbg(u,o){if(!u)return"rgba(255,255,255,0.05)";return o?"rgba(0,184,148,0.12)":"rgba(255,165,0,0.1)";}
  function tbd(u,o){if(!u)return"2px solid rgba(255,255,255,0.08)";return o?"2px solid rgba(0,184,148,0.35)":"2px solid rgba(255,165,0,0.25)";}
  return(
    <div style={{marginTop:16}}>
      <style>{"@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}"}</style>
      {tools&&tools.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Tool Belt</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{tools.map(function(id){var t=TOOLS[id];if(!t)return null;var u=!!sel[id];var o=actions&&actions.tools&&actions.tools[id]?actions.tools[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"t");}} className="bw-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:12,borderRadius:12,minWidth:76,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <ToolIcon name={id} size={28} color={u?(o?"#55efc4":"#FECA57"):"#4ECDC4"}/><span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{t.label}</span>
            {u&&<span style={{fontSize:9}}>{o?<Check size={12}/>:<Minus size={12}/>}</span>}</button>);})}</div></div>)}
      {meds&&meds.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Med Cart</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{meds.map(function(id){var m=MEDS[id];if(!m)return null;var u=!!sel[id];var o=actions&&actions.meds&&actions.meds[id]?actions.meds[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"m");}} className="bw-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:12,borderRadius:12,minWidth:76,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <div style={{width:28,height:34,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:m.color||"#636e72",fontSize:16,color:"white"}}><MedIcon type={m.medType||"iv"} size={20} color="white"/></div>
            <span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{m.label}</span>
            {u&&<span style={{fontSize:9}}>{o?<Check size={12}/>:<Minus size={12}/>}</span>}</button>);})}</div></div>)}
      {pop&&(<div onClick={function(){setPop(null);}} style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.6)"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:"min(420px, 90vw)",borderRadius:16,padding:20,background:"#1a1a3e",border:"2px solid "+(pop.info.ok?"#00b894":"#ffa502"),animation:"popIn .25s ease-out"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:900,background:pop.info.ok?"rgba(0,184,148,0.2)":"rgba(255,165,2,0.2)",color:pop.info.ok?"#00b894":"#ffa502",display:"flex",alignItems:"center",gap:4}}>{pop.info.ok?<><Check size={14}/> APPROPRIATE</>:<><X size={14}/> NOT INDICATED NOW</>}</div>
            {pop.info.pri&&<div style={{padding:"4px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Priority #"+pop.info.pri}</div>}
          </div>
          <h4 style={{color:"white",fontWeight:700,marginBottom:4}}>{pop.ty==="t"?(TOOLS[pop.id]?TOOLS[pop.id].label:pop.id):(MEDS[pop.id]?MEDS[pop.id].label:pop.id)}</h4>
          <p style={{fontSize:11,color:"#999",marginBottom:8}}>{pop.ty==="t"?(TOOLS[pop.id]?TOOLS[pop.id].desc:""):(MEDS[pop.id]?MEDS[pop.id].desc:"")}</p>
          <TextBlock text={pop.info.fb} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/>
          <button onClick={function(){setPop(null);}} style={{width:"100%",marginTop:16,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:pop.info.ok?"rgba(0,184,148,0.3)":"rgba(255,165,2,0.2)",border:"none",cursor:"pointer"}}>Got It</button>
        </div></div>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}>
        <div style={{fontSize:11,color:"#666"}}>{explored+"/"+total+" explored"}</div>
        {allF&&<button onClick={finish} style={{padding:"8px 20px",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:"linear-gradient(135deg,#4ECDC4,#44B09E)",border:"none",cursor:"pointer"}}>Continue</button>}</div>
      {!allF&&explored>0&&<p style={{fontSize:11,color:"#4ECDC4",marginTop:8,opacity:0.7}}>Find all appropriate actions to continue.</p>}
    </div>);
}
function ScenarioPlayer(props){
  var sc=props.sc;var onExit=props.onExit;var onDone=props.onDone;
  var ageG=guessAge(sc);var sexG=guessSex(sc);var scVisuals=sc.visuals||[];
  var stage=usePlayerStore(function(s){return s.stage;});var pi=usePlayerStore(function(s){return s.phaseIndex;});var flags=usePlayerStore(function(s){return s.flags;});var showFb=usePlayerStore(function(s){return s.showFb;});var cbDone=usePlayerStore(function(s){return s.cbDone;});var score=usePlayerStore(function(s){return s.score;});var shake=usePlayerStore(function(s){return s.shake;});var vit=usePlayerStore(function(s){return s.vitals;});
  var _ps=usePlayerStore.getState();var setStage=_ps.setStage;var setPi=_ps.setPhaseIndex;var setFlags=_ps.setFlags;var toggleFlag=_ps.toggleFlag;var setShowFb=_ps.setShowFb;var setCbDone=_ps.setCbDone;var setShake=_ps.setShake;var setVit=_ps.setVitals;var addScore=_ps.addScore;
  var _expI=useState(null);var expI=_expI[0];var setExpI=_expI[1];
  var _tldrOpen=useState({});var tldrOpen=_tldrOpen[0];var setTldrOpen=_tldrOpen[1];
  var toggleTldr=function(key){setTldrOpen(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;});};
  var _recStep=useState(0);var recStep=_recStep[0];var setRecStep=_recStep[1];
  var ph=sc.phases[pi];
  /* Build correct actions list for recovery screen (must be at top level for hook rules) */
  var correctActions=[];
  sc.phases.forEach(function(p){
    if(!p.actions)return;
    if(p.actions.tools){Object.entries(p.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(p.actions.meds){Object.entries(p.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  });
  if(sc.curveball&&sc.curveball.actions){
    if(sc.curveball.actions.tools){Object.entries(sc.curveball.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(sc.curveball.actions.meds){Object.entries(sc.curveball.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  }
  correctActions.sort(function(a,b){return(a.pri||99)-(b.pri||99);});
  useEffect(function(){if(stage!=="recovery")return;setRecStep(0);var iv=setInterval(function(){setRecStep(function(p){if(p>=correctActions.length)return p;return p+1;});},1200);return function(){clearInterval(iv);};},[stage]);
  var pSt=function(){if(stage.startsWith("cb"))return"critical";if(pi>=1||stage==="act")return"declining";return"stable";};
  var trigCb=useCallback(function(){setShake(true);setTimeout(function(){setShake(false);},800);setVit(sc.curveball.vitals);setStage("cb-alert");setCbDone(true);},[sc]);
  var flag=function(id){if(!showFb)toggleFlag(id);};
  var submit=function(){var r=computeAssessScore(ph.assessItems,flags);addScore({c:r.c,t:r.t});setShowFb(true);};
  var afterA=function(){setFlags({});setShowFb(false);if(pi<sc.phases.length-1){var n=pi+1;setPi(n);setVit(sc.phases[n].vitals);setStage("phase");}else setStage("debrief");};
  var afterAct=function(s){if(s&&s.t)addScore({c:s.c,t:s.t});if(!cbDone&&sc.curveball)trigCb();else setStage("recovery");};
  var phaseHasIntervention=ph&&(ph.tools||ph.meds);;
  var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
  var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";var RD="linear-gradient(135deg,#FF4757,#c0392b)";var PP="linear-gradient(135deg,#a55eea,#8854d0)";
  var isCb=stage.startsWith("cb");
  var curSigns=isCb?(sc.curveball?sc.curveball.signs:[]):(ph?ph.signs:[]);
  var curLabs=isCb?(sc.curveball?sc.curveball.labs||[]:[]):(ph?ph.labs||[]:[]);
  if(stage==="debrief"){var pct=score.t>0?Math.round(score.c/score.t*100):0;var emIcon=pct>=80?<Star size={24} color="#FECA57"/>:pct>=50?<Trophy size={24} color="#FECA57"/>:<BookOpen size={24} color="#74b9ff"/>;var sBg=pct>=80?"#00b894":pct>=50?"#fdcb6e":"#e17055";
    var reviewSteps=[];
    sc.phases.forEach(function(p){
      if(p.signs)p.signs.forEach(function(s){reviewSteps.push({type:"finding",text:s.label});});
      if(p.tools||p.meds){
        var correctT=Object.entries(p.actions&&p.actions.tools?p.actions.tools:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return TOOLS[e[0]]?TOOLS[e[0]].label:e[0];});
        var correctM=Object.entries(p.actions&&p.actions.meds?p.actions.meds:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return MEDS[e[0]]?MEDS[e[0]].label:e[0];});
        correctT.concat(correctM).forEach(function(name){reviewSteps.push({type:"action",text:name});});
      }
    });
    if(sc.curveball){
      reviewSteps.push({type:"event",text:sc.curveball.name});
      var cT=Object.entries(sc.curveball.actions&&sc.curveball.actions.tools?sc.curveball.actions.tools:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return TOOLS[e[0]]?TOOLS[e[0]].label:e[0];});
      var cM=Object.entries(sc.curveball.actions&&sc.curveball.actions.meds?sc.curveball.actions.meds:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return MEDS[e[0]]?MEDS[e[0]].label:e[0];});
      cT.concat(cM).forEach(function(name){reviewSteps.push({type:"action",text:name});});
    }
    reviewSteps.push({type:"outcome",text:"Patient stabilized"});
    return(<div style={{minHeight:"100vh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{width:100,margin:"0 auto"}}><PatientSVG status="stable" rr={20} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
      </div>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44,display:"flex",justifyContent:"center"}}>{emIcon}</div><h2 style={{fontSize:24,fontWeight:900}}>Scenario Complete</h2>
        <div className="si" style={{marginTop:8,display:"inline-block",padding:"8px 20px",borderRadius:20,fontSize:18,fontWeight:700,background:sBg}}>{score.c+"/"+score.t+" - "+pct+"%"}</div></div>
      <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:16}}><TextBlock text={sc.debrief.summary} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/></div>
      {/* Review Flowchart */}
      <div className="bw-glass" style={{marginBottom:16,borderRadius:12,overflow:"hidden"}}>
        <button onClick={function(){setExpI(expI==="review"?null:"review");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
          <span style={{fontWeight:700,fontSize:14,color:"#FECA57"}}>Review: Findings - Interventions - Outcome</span><span style={{color:"#FECA57"}}>{expI==="review"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI==="review"&&<div style={{padding:"0 12px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
            {reviewSteps.map(function(step,i){
              var bg=step.type==="finding"?"rgba(78,205,196,0.15)":step.type==="action"?"rgba(0,184,148,0.15)":step.type==="event"?"rgba(255,71,87,0.2)":"rgba(254,202,87,0.2)";
              var bc=step.type==="finding"?"#4ECDC4":step.type==="action"?"#00b894":step.type==="event"?"#FF6B81":"#FECA57";
              var icon=step.type==="finding"?<Search size={14}/>:step.type==="action"?<Check size={14}/>:step.type==="event"?<Zap size={14}/>:<Star size={14}/>;
              return(<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
                <div style={{padding:"6px 14px",borderRadius:10,background:bg,border:"1px solid "+bc+"40",textAlign:"center",maxWidth:"90%",display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,color:bc,display:"flex",alignItems:"center",gap:3}}>{icon}{step.text}</span>
                </div>
                {i<reviewSteps.length-1&&<div style={{width:2,height:16,background:"rgba(255,255,255,0.15)"}}></div>}
              </div>);
            })}
          </div>
        </div>}
      </div>
      {/* Lab Review */}
      {(function(){
        var allLabs=[];
        sc.phases.forEach(function(p,pi){if(p.labs){p.labs.forEach(function(l){if(l.critical&&l.explain)allLabs.push({lab:l,phase:p.name});});}});
        if(sc.curveball&&sc.curveball.labs){sc.curveball.labs.forEach(function(l){if(l.critical&&l.explain)allLabs.push({lab:l,phase:"Curveball: "+sc.curveball.name});});}
        if(allLabs.length===0)return null;
        return(<div style={{marginBottom:12}}>
          <div style={{marginBottom:12,borderRadius:12,overflow:"hidden",background:"rgba(255,71,87,0.06)",border:"1px solid rgba(255,71,87,0.12)"}}>
            <button onClick={function(){setExpI(expI==="labrev"?null:"labrev");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#ff7675",display:"flex",alignItems:"center",gap:6}}><Droplets size={14}/>Lab Review - Critical Values Explained</span><span style={{color:"#ff7675"}}>{expI==="labrev"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
            {expI==="labrev"&&<div style={{padding:"0 12px 12px"}}>
              {allLabs.map(function(entry,i){return(
                <div key={i} style={{marginBottom:12,borderRadius:8,padding:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#ff7675"}}>{entry.lab.name+": "+entry.lab.value+" "+entry.lab.unit}</span>
                    <span style={{fontSize:9,color:"#666"}}>{"Ref: "+entry.lab.ref+" | "+entry.phase}</span>
                  </div>
                  <TextBlock text={entry.lab.explain} style={{fontSize:12,color:"#ccc",lineHeight:1.5}}/>
                </div>
              );})}
            </div>}
          </div>
        </div>);
      })()}
      <h3 style={{fontSize:17,fontWeight:700,color:"#4ECDC4",marginBottom:12}}>Physiology Deep Dive</h3>
      {sc.debrief.explainers.map(function(e,i){return(<div key={i} className="bw-glass" style={{marginBottom:12,borderRadius:12,overflow:"hidden"}}>
        <button onClick={function(){setExpI(expI===i?null:i);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
          <span style={{fontWeight:700,fontSize:13}}>{e.title}</span><span style={{color:"#4ECDC4"}}>{expI===i?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI===i&&<div style={{padding:"0 12px 12px"}}>
          <TextBlock text={e.content} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/>
          {e.tldr&&<div style={{marginTop:8}}>
            <button onClick={function(){toggleTldr("e"+i);}} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(78,205,196,0.1)",border:"1px solid rgba(78,205,196,0.2)",borderRadius:8,padding:"4px 10px",cursor:"pointer",color:"#4ECDC4",fontSize:11,fontWeight:700}}>
              <span>TLDR</span><span>{tldrOpen["e"+i]?"\u2212":"+"}</span></button>
            {tldrOpen["e"+i]&&<p style={{fontSize:12,color:"#FECA57",marginTop:6,lineHeight:1.5,fontWeight:600}}>{e.tldr}</p>}
          </div>}
        </div>}</div>);})}
      {sc.curveball&&sc.curveball.teaches&&(<div><h3 style={{fontSize:17,fontWeight:700,color:"#FF6B81",marginTop:16,marginBottom:12}}>Curveball Deep Dive</h3>
        {sc.curveball.teaches.map(function(t,i){var k="c"+i;return(<div key={k} style={{marginBottom:12,borderRadius:12,overflow:"hidden",background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.15)"}}>
          <button onClick={function(){setExpI(expI===k?null:k);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
            <span style={{fontWeight:700,fontSize:13}}>{t.title}</span><span style={{color:"#FF6B81"}}>{expI===k?<Minus size={16}/>:<Plus size={16}/>}</span></button>
          {expI===k&&<div style={{padding:"0 12px 12px"}}>
            <TextBlock text={t.content} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/>
            {t.tldr&&<div style={{marginTop:8}}>
              <button onClick={function(){toggleTldr(k);}} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,71,87,0.1)",border:"1px solid rgba(255,71,87,0.2)",borderRadius:8,padding:"4px 10px",cursor:"pointer",color:"#FF6B81",fontSize:11,fontWeight:700}}>
                <span>TLDR</span><span>{tldrOpen[k]?"\u2212":"+"}</span></button>
              {tldrOpen[k]&&<p style={{fontSize:12,color:"#FECA57",marginTop:6,lineHeight:1.5,fontWeight:600}}>{t.tldr}</p>}
            </div>}
          </div>}</div>);})}</div>)}
      <button onClick={function(){onDone(score);onExit();}} style={Object.assign({},BS,{background:GR})}>Back to Dashboard</button></div></div>);}
  return(<div className={shake?"bw-shake":""} style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}>
    <style>{"@keyframes bwShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px)}20%{transform:translateX(8px)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}}.bw-shake{animation:bwShake .6s ease-in-out}@keyframes slideU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.slu{animation:slideU .4s ease-out}@keyframes alertP{0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,.4)}50%{box-shadow:0 0 0 12px rgba(255,71,87,0)}}.alp{animation:alertP 1.5s infinite}@keyframes fadeCard{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.bw-split{display:flex;flex-direction:column;gap:12px}.bw-split-left,.bw-split-right{width:100%}@media(min-width:768px){.bw-container{max-width:900px!important}.bw-split{flex-direction:row;gap:20px;align-items:flex-start}.bw-split-left{width:42%;position:sticky;top:16px;max-height:calc(100dvh - 80px);overflow-y:auto}.bw-split-right{width:58%;min-height:0}}"}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <button onClick={onExit} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer"}}>X Exit</button>
        <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:isCb?"rgba(255,71,87,0.2)":"rgba(78,205,196,0.15)",color:isCb?"#FF6B81":"#4ECDC4"}}>{isCb?"CURVEBALL":"Phase "+(pi+1)+"/"+sc.phases.length}</div>
        <div style={{fontSize:11,color:"#888"}}>{score.c+"/"+score.t}</div></div>
      {stage==="intro"&&(<div className="slu" style={{textAlign:"center"}}>
        <PatientView status="stable" rr={30} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
        <h2 style={{fontSize:24,fontWeight:900,marginTop:12,marginBottom:8}}>{sc.title}</h2>
        <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:16,textAlign:"left"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}>
            <div><span style={{color:"#999"}}>Age: </span><strong>{sc.patient.ageLabel}</strong></div>
            <div><span style={{color:"#999"}}>Weight: </span><strong>{sc.patient.weightKg+" kg"}</strong></div>
            <div><span style={{color:"#999"}}>Sex: </span><strong>{sc.patient.sex}</strong></div></div>
          <div style={{fontSize:13,marginBottom:8}}><span style={{color:"#999"}}>CC: </span><strong>{sc.patient.cc}</strong></div>
          <TextBlock text={sc.patient.history} style={{fontSize:13,color:"#ccc",lineHeight:1.5}}/></div>
        <button onClick={function(){setStage("phase");}} style={Object.assign({},BS,{background:GR})}>Begin Assessment</button></div>)}
      {stage==="phase"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status={pSt()} rr={vit.rr} signs={ph?ph.signs:[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
            <div style={{marginTop:12}}><Monitor vitals={vit}/></div>
            <BodySystemsView signs={ph?ph.signs:[]}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12}}>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/></div>
            {phaseHasIntervention?(
              <button onClick={function(){setStage("act");}} style={Object.assign({},BS,{background:GR})}>Begin Intervention</button>
            ):(
              <button onClick={function(){setStage("assess");}} style={Object.assign({},BS,{background:GR})}>Assess Vitals</button>
            )}
          </div>
        </div></div>)}
      {/* ASSESSMENT - Monitor visible above questions */}
      {stage==="assess"&&(function(){
        var vitItems=ph.assessItems.filter(function(it){return !it.cat||it.cat==="vital";});
        var labItems=ph.assessItems.filter(function(it){return it.cat==="lab";});
        var clinItems=ph.assessItems.filter(function(it){return it.cat==="clinical";});
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
          return(<button key={it.id} onClick={function(){flag(it.id);}} className="bw-tap" style={{width:"100%",textAlign:"left",borderRadius:12,padding:14,background:bg,border:brd,cursor:"pointer",color:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {miniSVG&&<div style={{flexShrink:0}}>{miniSVG()}</div>}
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:6}}>{f&&!showFb&&<Flag size={14} color="#FECA57"/>}{it.label}</span>
                  {showFb&&<span style={{fontSize:15,fontWeight:700}}>{ok?<Check size={16}/>:<X size={16}/>}</span>}</div>
                {showFb&&<TextBlock text={it.why} style={{fontSize:12,color:"#ccc",marginTop:6,lineHeight:1.6}}/>}
              </div>
            </div></button>);}
        return(<div className="slu">
          <div className="bw-split">
            <div className="bw-split-left">
              <Monitor vitals={vit}/>
              <BodySystemsView signs={curSigns}/>
              <LabPanel labs={curLabs}/>
              <div style={{borderRadius:12,padding:10,marginTop:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <TextBlock text={ph?ph.narrative:""} style={{fontSize:12,color:"#999",lineHeight:1.5}}/>
              </div>
            </div>
            <div className="bw-split-right">
              {vitItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Flag Abnormal Vital Signs:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{vitItems.map(renderItem)}</div>
              </div>}
              {labItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#ff7675",marginBottom:8}}>Flag Abnormal Lab Values:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{labItems.map(renderItem)}</div>
              </div>}
              {clinItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#FECA57",marginBottom:8}}>Flag Concerning Clinical Findings:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{clinItems.map(renderItem)}</div>
              </div>}
              {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
                :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
            </div>
          </div></div>);
      })()}
      {stage==="act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <Monitor vitals={vit}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12,marginBottom:8}}>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:4}}>Intervention Time</p>
                <p style={{fontSize:11,color:"#bbb"}}>Tap each tool and med. Find all correct actions to continue.</p></div></div>
            <ActionPanel tools={ph.tools} meds={ph.meds} actions={ph.actions} onDone={afterAct}/>
          </div>
        </div></div>)}
      {stage==="cb-alert"&&(<div className="slu">
        <div className="alp" style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-block",padding:"8px 16px",borderRadius:20,fontWeight:900,color:"white",fontSize:13,background:"#FF4757"}}>UNEXPECTED EVENT</div></div>
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status="critical" rr={vit.rr} signs={sc.curveball?sc.curveball.signs:[]} ageGroup={ageG} sex={sexG} visuals={scVisuals}/>
            <div style={{marginTop:12}}><Monitor vitals={vit} flash={true}/></div>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/></div>
            <button onClick={function(){setStage("cb-act");}} style={Object.assign({},BS,{background:RD})}>What Do You Do?</button>
          </div>
        </div></div>)}
      {stage==="cb-act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <Monitor vitals={vit} flash={true}/>
            <LabPanel labs={curLabs}/>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba(255,71,87,0.15)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:"#FF6B81",marginBottom:4}}>Critical Intervention</p>
                <p style={{fontSize:11,color:"#bbb"}}>Find all correct actions.</p></div></div>
            <ActionPanel tools={sc.curveball.tools} meds={sc.curveball.meds} actions={sc.curveball.actions} onDone={function(s){if(s&&s.t)addScore({c:s.c,t:s.t});setStage("recovery");}}/>
          </div>
        </div></div>)}
      {stage==="recovery"&&(function(){
        var allRevealed=recStep>=correctActions.length;
        return(<div className="slu" style={{textAlign:"center"}}>
          <style>{"@keyframes bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-18px)}50%{transform:translateY(-10px)}70%{transform:translateY(-14px)}}.bw-bounce{animation:bounce 1s ease-in-out infinite}@keyframes confetti{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(360deg)}}.bw-confetti{animation:confetti 2s ease-out both}@keyframes vitalsNorm{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}.bw-vn{animation:vitalsNorm .5s ease-out both}"}</style>
          <div style={{marginBottom:20}}>
            <div className="bw-bounce" style={{width:120,margin:"0 auto"}}><PatientSVG status="stable" rr={22} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
            {/* Celebration sparkles */}
            <div style={{position:"relative",height:40,overflow:"hidden",marginTop:-10}}>
              {[<Sparkles/>,<Star/>,<Heart/>,<Trophy/>,<Zap/>,<Shield/>,<Sparkles/>].map(function(e,i){return(<span key={i} className="bw-confetti" style={{position:"absolute",left:(10+i*13)+"%",color:"#FECA57",animationDelay:(i*0.15)+"s"}}>{e}</span>);})}
            </div>
          </div>
          <h2 style={{fontSize:26,fontWeight:900,color:"#55efc4",marginBottom:4}}>Patient Stabilized!</h2>
          <p style={{fontSize:14,color:"#ccc",marginBottom:20}}>Your interventions worked. Here's how the patient responded:</p>
          {/* Normalized vitals */}
          <div className="bw-vn" style={{display:"inline-flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {[{l:"HR",v:sc.norms?Math.round((sc.norms.hr[0]+sc.norms.hr[1])/2):"--",c:"#55efc4"},{l:"SpO\u2082",v:sc.norms?"99%":"--",c:"#fdcb6e"},{l:"BP",v:sc.norms?Math.round((sc.norms.sbp[0]+sc.norms.sbp[1])/2)+"/"+Math.round((sc.norms.dbp[0]+sc.norms.dbp[1])/2):"--",c:"#74b9ff"},{l:"Temp",v:"37.0\u00B0C",c:"#fab1a0"}].map(function(vi,i){return(<div key={i} className="bw-vn" style={{animationDelay:(0.2+i*0.15)+"s",padding:"8px 14px",borderRadius:12,background:"rgba(85,239,196,0.08)",border:"1px solid rgba(85,239,196,0.15)"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase"}}>{vi.l}</div>
              <div style={{fontSize:18,fontWeight:900,color:vi.c}}>{vi.v}</div>
            </div>);})}
          </div>
          {/* Intervention timeline - reveals one at a time */}
          <div style={{textAlign:"left",maxWidth:400,margin:"0 auto",marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>What Saved This Patient:</p>
            {correctActions.map(function(act,i){
              var visible=i<recStep;
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,opacity:visible?1:0.15,transform:visible?"translateX(0)":"translateX(-10px)",transition:"all 0.4s ease-out"}}>
                <div style={{flexShrink:0,width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:act.type==="tool"?"rgba(78,205,196,0.15)":"rgba(116,185,255,0.15)",border:"1px solid "+(act.type==="tool"?"rgba(78,205,196,0.3)":"rgba(116,185,255,0.3)")}}>{act.type==="tool"?ToolIcon({name:act.toolId,size:20,color:"#4ECDC4"}):MedIcon({type:act.medType||"iv",size:20,color:"#74b9ff"})}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"white"}}>{act.name}</div>
                  {visible&&act.fb&&<p style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4}}>{act.fb}</p>}
                </div>
                {visible&&<div style={{flexShrink:0,marginTop:2}}><Check size={18} color="#55efc4"/></div>}
              </div>);
            })}
          </div>
          {allRevealed&&<div className="bw-vn" style={{marginBottom:16}}>
            <p style={{fontSize:13,color:"#55efc4",fontWeight:700,marginBottom:12}}>All interventions complete. Patient is resting comfortably.</p>
            <button onClick={function(){setStage("debrief");}} style={Object.assign({},BS,{background:GR,maxWidth:300,margin:"0 auto"})}>Continue to Debrief</button>
          </div>}
        </div>);
      })()}
    </div></div>);
}
function Builder(props){
  var onDone=props.onDone;var onBack=props.onBack;
  var _txt=useState("");var txt=_txt[0];var setTxt=_txt[1];
  var _busy=useState(false);var busy=_busy[0];var setBusy=_busy[1];
  var _mi=useState(0);var mi=_mi[0];var setMi=_mi[1];
  var _err=useState(null);var err=_err[0];var setErr=_err[1];
  var _cbMode=useState(true);var cbMode=_cbMode[0];var setCbMode=_cbMode[1];
  var msgs=["Assembling blocks...","Calibrating monitor...","Reviewing the chart...","Stocking med cart...","Writing the debrief..."];
  useEffect(function(){if(!busy)return;var iv=setInterval(function(){setMi(function(p){return(p+1)%msgs.length;});},2500);return function(){clearInterval(iv);};},[busy]);
  var cbPromptSection=cbMode?",\"curveball\":{\"name\":\"\",\"narrative\":\"\",\"vitals\":{},\"signs\":[],\"labs\":[],\"tools\":[\"must include defib\"],\"meds\":[],\"actions\":{\"tools\":{},\"meds\":{}},\"teaches\":[{\"title\":\"\",\"content\":\"6-10 sentences detailed physiology\",\"tldr\":\"1-2 sentence plain summary\"}]}":"";
  var cbInstructions=cbMode?" Include a curveball section: an unexpected clinical event mid-scenario that tests a different critical thinking axis (e.g. new diagnosis, arrhythmia, equipment failure). The curveball must include its own vitals, signs, labs, tools, meds, actions, and teaches with tldr fields.":" Do NOT include a curveball. Set curveball to null in the JSON. The scenario should flow: Triage (assessment) -> Escalation (intervention) -> Debrief.";
  var go=async function(){if(!txt.trim())return;setBusy(true);setErr(null);
    try{var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},300000);
      var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:controller.signal,
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:16000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        system:"You are a pediatric critical care educator for Block Ward. Create a COMPLETE medically accurate CREATIVE scenario for any pediatric emergency, trauma, or critical care case. Use web search for clinical details."+cbInstructions+" MANDATORY CLINICAL ACCURACY RULES: 1. All vital signs must fall within physiologically possible ranges for the stated age/weight. 2. All medication doses must use weight-based pediatric dosing from current PALS/NRP guidelines. 3. Lab values must be internally consistent (e.g., if pH is low, bicarb must also be low). 4. Disease progressions must follow real pathophysiology - no invented mechanisms. 5. Every explanation must cite the actual biochemical/physiologic mechanism. 6. Drug mechanisms must reference real receptor pharmacology. 7. Never invent drug names, lab tests, or clinical signs that do not exist. 8. Vital sign trends must be physiologically consistent across phases. 9. Normal ranges must be age-appropriate (infant vs child vs teen norms differ). 10. If unsure about a clinical detail, use conservative/standard textbook values. CRITICAL STYLE RULES: (1) NARRATIVES must be written in complete, informative sentences as in a clinical textbook. Use proper medical terminology. Keep to 4-6 sentences per narrative. (2) CLINICAL SIGNS must contain ONLY objective findings. Include a sys field. (3) TOOL/MED FEEDBACK must use bullet points. Format as: first sentence states whether appropriate or not and why, then \\n- for each key point. Example: 'Appropriate. Epinephrine provides systemic bronchodilation when inhaled meds cannot penetrate.\\n- Dose: 0.01 mg/kg IM to lateral thigh\\n- Beta-2 relaxes bronchial smooth muscle\\n- Alpha-1 reduces mucosal edema\\n- Reaches airways past severe bronchospasm'. (4) VITAL SIGNS must be consistent with clinical signs. (5) Give patients NAMES and backstories. (6) ALWAYS include defib in tools. For wrong choices use funny callouts. (7) EVERY teaches and explainers MUST include tldr AND use bullet points in content: opening sentence then \\n- for each mechanism. (8) Content should have 6-10 bullet points. (9) assessItem why fields: summary sentence then \\n- for key details. (10) Every assessItem MUST include cat field: vital, lab, or clinical. Available tool IDs: glucometer,stethoscope,bvm,suction,o2mask,ivKit,defib,thermometer,capRefill,needleDecomp,pupilCheck,epiPen,peakFlow. Available med IDs: lorazepam,phenytoin,epinephrine,dextrose,nsBolus,ceftriaxone,acetaminophen,albuterol,atropine,hypertonic,mannitolMed,levetiracetam,diphenhydramine,methylpred,famotidine,racemicEpi,adenosine. Return ONLY valid JSON. Structure: {\"id\":\"slug\",\"title\":\"\",\"tier\":1,\"icon\":\"emoji\",\"tagline\":\"\",\"description\":\"\",\"visuals\":[],\"patient\":{\"ageLabel\":\"\",\"weightKg\":0,\"sex\":\"Male or Female\",\"cc\":\"\",\"history\":\"\"},\"norms\":{\"hr\":[min,max],\"rr\":[min,max],\"sbp\":[min,max],\"dbp\":[min,max],\"spo2\":[95,100],\"temp\":[36.5,37.5]},\"phases\":[{\"id\":\"triage\",\"name\":\"Triage\",\"narrative\":\"\",\"vitals\":{\"hr\":0,\"rr\":0,\"sbp\":0,\"dbp\":0,\"spo2\":0,\"temp\":0,\"cap\":0},\"signs\":[{\"label\":\"\",\"detail\":\"\",\"pos\":\"\",\"sys\":\"\"}],\"assessItems\":[{\"id\":\"\",\"label\":\"\",\"bad\":true,\"why\":\"summary\\n- detail\\n- detail\",\"cat\":\"vital|lab|clinical\"}],\"labs\":[{\"name\":\"\",\"value\":\"\",\"unit\":\"\",\"ref\":\"\",\"critical\":true,\"explain\":\"\"}],\"tools\":null,\"meds\":null,\"actions\":null},{\"id\":\"escalation\",\"name\":\"Escalation\",\"narrative\":\"\",\"vitals\":{},\"signs\":[],\"assessItems\":[],\"labs\":[],\"tools\":[\"defib\"],\"meds\":[],\"actions\":{\"tools\":{},\"meds\":{}}}]"+cbPromptSection+",\"debrief\":{\"summary\":\"\",\"explainers\":[{\"title\":\"\",\"content\":\"summary\\n- point\\n- point\",\"tldr\":\"\"}]}}. Phase 1: assessment only (tools/meds/actions null). Phase 2: tools/meds/actions. CRITICAL ASSESSMENT RULES: Phase 1 assessItems must include 6-8 items with a MIX of abnormal (bad:true) and normal (bad:false). Include at least 3 normal and 3 abnormal. Include vitals (cat:vital), labs (cat:lab), and clinical findings (cat:clinical). CRITICAL INTERVENTION RULES: Phase 2 and curveball MUST have 3-4 tools ok:true with priority numbers and 2-3 meds ok:true with priority numbers. Remaining should be ok:false. There MUST always be correct actions. Include 5-6 tools and 5-6 meds total. Defib always included. 4-6 signs per phase with sys. 2-3 teaches with tldr. 2-3 explainers with tldr. LABS: Every phase MUST include 4-8 labs. critical:true for abnormal. Every critical lab needs explain field (2-3 sentences). ALL text fields (fb, why, content, explain, summary) should use \\n- bullet formatting for readability.",
        messages:[{role:"user",content:"Create pediatric scenario:\n\n"+txt}]})});
      clearTimeout(tid);
      var raw=await r.text();var d;
      try{d=JSON.parse(raw);}catch(je){throw new Error("Server returned invalid response (status "+r.status+"). The request may have timed out — try again.");}
      if(d.error)throw new Error(d.error.message||"API error");
      if(d.stop_reason==="max_tokens")throw new Error("Scenario was too complex and got cut off. Try a simpler description or turn off Curveball Mode.");
      var tb="";
      (d.content||[]).forEach(function(b){if(b.type==="text"&&b.text)tb+=b.text;});
      if(!tb.trim()){
        if(d.stop_reason==="tool_use")throw new Error("AI got stuck in a research loop. Try again with a more specific description.");
        throw new Error("No text in AI response. Try again.");
      }
      var cl=tb.replace(/```json\s*/gi,"").replace(/```\s*/g,"").replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<html[^>]*>[\s\S]*?<\/html>/gi,"").replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi,"").trim();
      cl=cl.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#39;/g,"'").replace(/&nbsp;/g," ");
      var candidates=[];var depth=0;var cStart=-1;
      for(var ci=0;ci<cl.length;ci++){if(cl[ci]==="{"){if(depth===0)cStart=ci;depth++;}else if(cl[ci]==="}"){depth--;if(depth===0&&cStart>=0){candidates.push({s:cStart,e:ci,len:ci-cStart});cStart=-1;}}}
      if(candidates.length===0)throw new Error("AI did not return valid JSON. Try rephrasing or simplifying your description.");
      candidates.sort(function(a,b){return b.len-a.len;});
      cl=cl.substring(candidates[0].s,candidates[0].e+1);
      function stripTags(s){if(typeof s!=="string")return s;return s.replace(/<[^>]+>/g,"").trim();}
      function deepClean(obj){if(typeof obj==="string")return stripTags(obj);if(Array.isArray(obj))return obj.map(deepClean);if(obj&&typeof obj==="object"){var out={};Object.keys(obj).forEach(function(k){out[k]=deepClean(obj[k]);});return out;}return obj;}
      var scenario;
      try{scenario=deepClean(JSON.parse(cl));}catch(pe){
        try{var fixed=cl.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]").replace(/[\x00-\x1f]/g,function(c){return c==="\n"?"\\n":c==="\r"?"\\r":c==="\t"?"\\t":"";});
          scenario=deepClean(JSON.parse(fixed));
        }catch(pe2){throw new Error("AI response had invalid JSON. Try again — simpler prompts work more reliably.");}
      }
      if(!scenario.id||!scenario.phases)throw new Error("AI generated an incomplete scenario. Try being more specific about the patient age, condition, and setting.");
      if(!cbMode)scenario.curveball=null;
      if(!scenario.debrief)scenario.debrief={summary:"Complete.",explainers:[]};onDone(scenario);
    }catch(e){console.error("Build error:",e);var em=e.name==="AbortError"?"Request timed out. Try a simpler description or turn off Curveball Mode.":e.message||"Build failed. Try again with more detail.";setErr(em);}finally{setBusy(false);}};
  if(busy)return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)"}}>
    <style>{"@keyframes bbl{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}100%{transform:translateY(0) scale(1)}}.bbx>div:nth-child(1){animation:bbl 1.5s ease infinite}.bbx>div:nth-child(2){animation:bbl 1.5s ease .2s infinite}.bbx>div:nth-child(3){animation:bbl 1.5s ease .4s infinite}.bbx>div:nth-child(4){animation:bbl 1.5s ease .6s infinite}"}</style>
    <div className="bbx" style={{display:"flex",gap:12,marginBottom:32}}><div style={{width:40,height:40,borderRadius:8,background:"#4ECDC4"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FF6B81"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FECA57"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#a55eea"}}></div></div>
    <p style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Building Your Scenario</p>
    <p style={{fontSize:14,color:"#4ECDC4"}}>{msgs[mi]}</p></div>);
  return(<div style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
    <button onClick={onBack} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer",marginBottom:16}}>Back</button>
    <h2 style={{fontSize:24,fontWeight:900,marginBottom:8}}>Build a Scenario</h2>
    <p style={{fontSize:13,color:"#999",marginBottom:6}}>Describe any pediatric emergency, trauma, or critical care case. Even a few words will work. The AI will research clinical details and build a fully playable scenario with vitals, labs, and interventions.</p>
    <p style={{fontSize:11,color:"#666",marginBottom:16}}>Once built, you can share your scenario with others via a link.</p>
    <textarea value={txt} onChange={function(e){setTxt(e.target.value);}} placeholder={"Examples:\n- 12 year old bike crash head injury\n- 9 year old peanut allergy anaphylaxis\n- Newborn with cyanotic heart disease\n- Toddler who drank grandma's pills\n- 4 year old near drowning"} style={{width:"100%",height:200,borderRadius:12,padding:16,color:"white",fontSize:13,resize:"none",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}/>
    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
      <button onClick={function(){setCbMode(!cbMode);}} style={{width:56,height:32,borderRadius:16,border:"none",cursor:"pointer",position:"relative",background:cbMode?"#4ECDC4":"rgba(255,255,255,0.15)",transition:"background 0.2s"}}>
        <div style={{width:24,height:24,borderRadius:12,background:"white",position:"absolute",top:4,left:cbMode?28:4,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
      </button>
      <div><span style={{fontSize:13,fontWeight:700,color:cbMode?"#4ECDC4":"#666"}}>Curveball Mode</span>
        <p style={{fontSize:10,color:"#666",marginTop:1}}>{cbMode?"A surprise clinical event will be thrown in mid-scenario":"Straight scenario: triage, escalation, debrief"}</p></div>
    </div>
    <div style={{marginTop:14,padding:12,borderRadius:10,background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.2)",fontSize:11,color:"#aaa",lineHeight:1.5}}>
      <span style={{color:"#4ECDC4",fontWeight:700}}>Clinical Disclaimer:</span> AI-generated scenarios are for educational practice only. Always verify clinical details against current guidelines before using for instruction.
    </div>
    {err&&<div style={{marginTop:12,padding:12,borderRadius:12,fontSize:12,background:"rgba(255,71,87,0.15)",color:"#FF6B81",lineHeight:1.4}}>{err}</div>}
    <button onClick={go} disabled={!txt.trim()} style={{width:"100%",marginTop:16,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,background:txt.trim()?"linear-gradient(135deg,#a55eea,#8854d0)":"rgba(255,255,255,0.1)",opacity:txt.trim()?1:0.5,border:"none",cursor:txt.trim()?"pointer":"default"}}>Build Scenario</button>
  </div></div>);
}
export default function App(){
  var _view=useState("dash");var view=_view[0];var setView=_view[1];
  var act=usePlayerStore(function(s){return s.activeScenario;});
  var startPlayer=usePlayerStore(function(s){return s.start;});
  var resetPlayer=usePlayerStore(function(s){return s.reset;});
  var cust=useScenariosStore(function(s){return s.custom;});
  var prog=useScenariosStore(function(s){return s.progress;});
  var ok=useScenariosStore(function(s){return s.hydrated;});
  var hydrate=useScenariosStore(function(s){return s.hydrate;});
  var addCustom=useScenariosStore(function(s){return s.addCustom;});
  var addCustomIfNew=useScenariosStore(function(s){return s.addCustomIfNew;});
  var deleteCustom=useScenariosStore(function(s){return s.deleteCustom;});
  var recordCompletion=useScenariosStore(function(s){return s.recordCompletion;});
  var clearAllScenarios=useScenariosStore(function(s){return s.clearAll;});
  var _shareMsg=useState(null);var shareMsg=_shareMsg[0];var setShareMsg=_shareMsg[1];
  var _sidebar=useState(false);var sidebar=_sidebar[0];var setSidebar=_sidebar[1];
  var _sideTab=useState("ref");var sideTab=_sideTab[0];var setSideTab=_sideTab[1];
  var _delConfirm=useState(null);var delConfirm=_delConfirm[0];var setDelConfirm=_delConfirm[1];
  var _clearConfirm=useState(false);var clearConfirm=_clearConfirm[0];var setClearConfirm=_clearConfirm[1];
  function minifyScenario(sc){
    function trimFb(obj){if(!obj)return obj;var o={};Object.keys(obj).forEach(function(k){if(typeof obj[k]==="object"&&obj[k]&&obj[k].fb){o[k]={ok:obj[k].ok,pri:obj[k].pri,fb:obj[k].fb.substring(0,120)};}else{o[k]=obj[k];}});return o;}
    function trimPhase(p){return{id:p.id,name:p.name,narrative:p.narrative?p.narrative.substring(0,300):p.narrative,vitals:p.vitals,signs:p.signs?p.signs.map(function(s){return{label:s.label,detail:s.detail,pos:s.pos,sys:s.sys};}):p.signs,assessItems:p.assessItems,labs:p.labs?p.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):p.labs,tools:p.tools,meds:p.meds,actions:p.actions?{tools:trimFb(p.actions.tools),meds:trimFb(p.actions.meds)}:p.actions};}
    var m={id:sc.id,title:sc.title,tier:sc.tier,icon:sc.icon,tagline:sc.tagline,description:sc.description,patient:sc.patient,norms:sc.norms,visuals:sc.visuals,phases:sc.phases?sc.phases.map(trimPhase):[],debrief:sc.debrief?{summary:sc.debrief.summary,explainers:sc.debrief.explainers?sc.debrief.explainers.map(function(e){return{title:e.title,content:e.content?e.content.substring(0,200):"",tldr:e.tldr};}):[]}: sc.debrief};
    if(sc.curveball){m.curveball={name:sc.curveball.name,narrative:sc.curveball.narrative?sc.curveball.narrative.substring(0,300):"",vitals:sc.curveball.vitals,signs:sc.curveball.signs,labs:sc.curveball.labs?sc.curveball.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):sc.curveball.labs,tools:sc.curveball.tools,meds:sc.curveball.meds,actions:sc.curveball.actions?{tools:trimFb(sc.curveball.actions.tools),meds:trimFb(sc.curveball.actions.meds)}:sc.curveball.actions,teaches:sc.curveball.teaches?sc.curveball.teaches.map(function(t){return{title:t.title,content:t.content?t.content.substring(0,200):"",tldr:t.tldr};}):[]};} else{m.curveball=null;}
    return m;
  }
  function encodeScenario(sc){try{return btoa(unescape(encodeURIComponent(JSON.stringify(sc))));}catch(e){return null;}}
  function decodeScenario(str){try{return JSON.parse(decodeURIComponent(escape(atob(str))));}catch(e){return null;}}
  function shareScenario(sc){
    var mini=minifyScenario(sc);
    var encoded=encodeScenario(mini);
    if(!encoded){setShareMsg("Failed to encode scenario");return;}
    var url=window.location.origin+"/?shared="+encodeURIComponent(encoded);
    if(url.length>4000){
      setShareMsg("Scenario too large to share via link. Try a simpler scenario.");
      setTimeout(function(){setShareMsg(null);},3000);
      return;
    }
    if(navigator.share){
      navigator.share({title:"Block Ward: "+sc.title,url:url}).catch(function(){});
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(url).then(function(){setShareMsg("Link copied!");setTimeout(function(){setShareMsg(null);},2500);});
    }else{
      prompt("Copy this link to share:",url);
    }
  }
  useEffect(function(){
    hydrate();
    var params=new URLSearchParams(window.location.search);
    var shared=params.get("shared");
    if(shared){
      var sc=decodeScenario(decodeURIComponent(shared));
      if(!sc)sc=decodeScenario(shared);
      if(sc&&sc.id&&sc.phases){
        addCustomIfNew(sc);
        window.history.replaceState({},"",window.location.pathname);
        setShareMsg("Imported: "+sc.title);
        setTimeout(function(){setShareMsg(null);},3000);
      }
    }
  },[]);
  var built=[SC1,SC2,SC3];
  var play=function(s){startPlayer(s);setView("play");};
  var done=function(score){if(!act)return;recordCompletion(act.id,score);};
  var addC=function(s){addCustom(s);setView("dash");};
  var delC=function(id){deleteCustom(id);setDelConfirm(null);};
  var clearAll=function(){clearAllScenarios();setShareMsg("All data cleared");setTimeout(function(){setShareMsg(null);},2000);};
  // Stats
  var allScenarios=built.concat(cust);
  var totalAttempts=0;var totalCorrect=0;var totalQ=0;
  Object.values(prog).forEach(function(p){if(p.n)totalAttempts+=p.n;});
  var nd=Object.values(prog).filter(function(p){return p.done;}).length;
  var avgScore=0;var scoreCount=0;
  Object.values(prog).forEach(function(p){if(p.best>0){avgScore+=p.best;scoreCount++;}});
  if(scoreCount>0)avgScore=Math.round(avgScore/scoreCount*100);
  // Peds vital sign reference data
  var vitalRef=[
    {age:"Neonate (0-28d)",hr:"120-160",rr:"30-60",sbp:"60-80",dbp:"30-50"},
    {age:"Infant (1-12m)",hr:"100-160",rr:"25-40",sbp:"70-90",dbp:"40-60"},
    {age:"Toddler (1-3y)",hr:"80-130",rr:"20-30",sbp:"80-100",dbp:"50-65"},
    {age:"Child (4-8y)",hr:"70-110",rr:"18-25",sbp:"85-110",dbp:"50-70"},
    {age:"School Age (9-12y)",hr:"65-110",rr:"16-22",sbp:"90-120",dbp:"55-75"},
    {age:"Teen (13-17y)",hr:"55-100",rr:"12-20",sbp:"100-130",dbp:"60-80"},
  ];
  if(!ok)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0e1a"}}><div style={{color:"#4ECDC4",fontSize:20}}>Loading Block Ward...</div></div>);
  if(view==="play"&&act)return <ScenarioPlayer sc={act} onExit={function(){setView("dash");resetPlayer();}} onDone={done}/>;
  if(view==="build")return <Builder onDone={addC} onBack={function(){setView("dash");}}/>;
  return(<div style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff",fontFamily:"'Nunito',sans-serif"}}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}.flt{animation:float 3s ease-in-out infinite}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fadeIn .5s ease-out both}button{transition:all .15s ease;min-height:44px;min-width:44px}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#1a1a3e}::-webkit-scrollbar-thumb{background:#4ECDC4;border-radius:3px}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}.si{animation:scaleIn .4s ease-out both}.bw-glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 24px rgba(0,0,0,0.12)}.bw-tap{transition:transform .12s ease,box-shadow .12s ease}.bw-tap:active{transform:scale(0.96)}"}</style>
    {/* Toast */}
    {shareMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"10px 20px",borderRadius:12,background:"rgba(78,205,196,0.95)",color:"#0a0e1a",fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{shareMsg}</div>}
    {/* Delete confirmation modal */}
    {delConfirm&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={function(){setDelConfirm(null);}}>
      <div style={{background:"#1a1a3e",borderRadius:16,padding:24,maxWidth:340,width:"100%",border:"2px solid rgba(255,71,87,0.3)"}} onClick={function(e){e.stopPropagation();}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Delete Scenario?</h3>
        <p style={{fontSize:13,color:"#999",marginBottom:4}}>{delConfirm.title}</p>
        <p style={{fontSize:12,color:"#FF6B81",marginBottom:20}}>This cannot be undone.</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={function(){setDelConfirm(null);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,255,255,0.1)",color:"#999",border:"none",cursor:"pointer"}}>Cancel</button>
          <button onClick={function(){delC(delConfirm.id);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,71,87,0.3)",color:"#FF6B81",border:"none",cursor:"pointer"}}>Delete</button>
        </div>
      </div>
    </div>}
    {/* Clear all data confirmation modal */}
    {clearConfirm&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={function(){setClearConfirm(false);}}>
      <div style={{background:"#1a1a3e",borderRadius:16,padding:24,maxWidth:340,width:"100%",border:"2px solid rgba(255,71,87,0.3)"}} onClick={function(e){e.stopPropagation();}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Clear All Data?</h3>
        <p style={{fontSize:13,color:"#999",marginBottom:4}}>All progress and custom scenarios will be removed.</p>
        <p style={{fontSize:12,color:"#FF6B81",marginBottom:20}}>This cannot be undone.</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={function(){setClearConfirm(false);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,255,255,0.1)",color:"#999",border:"none",cursor:"pointer"}}>Cancel</button>
          <button onClick={function(){clearAll();setClearConfirm(false);setSidebar(false);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,71,87,0.3)",color:"#FF6B81",border:"none",cursor:"pointer"}}>Clear</button>
        </div>
      </div>
    </div>}
    {/* Sidebar overlay */}
    {sidebar&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:997,display:"flex"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)"}} onClick={function(){setSidebar(false);}}></div>
      <div style={{position:"relative",width:320,maxWidth:"85vw",height:"100%",background:"#12152a",borderRight:"1px solid rgba(78,205,196,0.15)",overflowY:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:20,fontWeight:900,fontFamily:"'Fredoka',sans-serif"}}>Menu</h2>
          <button onClick={function(){setSidebar(false);}} style={{background:"none",border:"none",color:"#888",fontSize:20,cursor:"pointer"}}>X</button>
        </div>
        {/* Sidebar tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {[{k:"ref",l:"Reference"},{k:"stats",l:"My Stats"},{k:"settings",l:"Settings"}].map(function(t){return(
            <button key={t.k} onClick={function(){setSideTab(t.k);}} style={{flex:1,padding:"6px 0",borderRadius:8,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",background:sideTab===t.k?"rgba(78,205,196,0.2)":"rgba(255,255,255,0.05)",color:sideTab===t.k?"#4ECDC4":"#888"}}>{t.l}</button>
          );})}
        </div>
        {/* Quick Reference */}
        {sideTab==="ref"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Peds Vital Sign Ranges</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {vitalRef.map(function(r,i){return(
              <div key={i} style={{borderRadius:10,padding:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:4}}>{r.age}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,fontSize:10,color:"#999"}}>
                  <span>{"HR: "+r.hr}</span><span>{"RR: "+r.rr}</span>
                  <span>{"SBP: "+r.sbp}</span><span>{"DBP: "+r.dbp}</span>
                </div>
              </div>
            );})}
          </div>
          <div style={{marginTop:16,borderRadius:10,padding:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:6}}>Key Thresholds</div>
            <div style={{fontSize:10,color:"#999",lineHeight:1.6}}>
              <div>Cap Refill: normal &lt; 2-3 sec</div>
              <div>Hypoglycemia: &lt; 45 mg/dL (infant), &lt; 60 mg/dL (child)</div>
              <div>Lactate: normal 0.5-2.0 mmol/L, critical &gt; 4.0</div>
              <div>Hypotension (SBP): &lt; 70 + (age in years x 2)</div>
            </div>
          </div>
        </div>}
        {/* My Stats */}
        {sideTab==="stats"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Your Progress</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(78,205,196,0.1)"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#4ECDC4"}}>{nd}</div>
              <div style={{fontSize:10,color:"#999"}}>Completed</div>
            </div>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(165,94,234,0.1)"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#c4b5fd"}}>{totalAttempts}</div>
              <div style={{fontSize:10,color:"#999"}}>Total Attempts</div>
            </div>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(0,184,148,0.1)",gridColumn:"1 / -1"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#00b894"}}>{avgScore>0?avgScore+"%":"--"}</div>
              <div style={{fontSize:10,color:"#999"}}>Average Best Score</div>
            </div>
          </div>
          <h4 style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:8}}>Per Scenario</h4>
          {allScenarios.map(function(s){var p=prog[s.id];if(!p)return null;return(
            <div key={s.id} style={{borderRadius:8,padding:8,marginBottom:4,background:"rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#ccc"}}>{s.icon+" "+s.title}</span>
              <span style={{fontSize:11,fontWeight:700,color:p.best>=0.8?"#00b894":p.best>=0.5?"#FECA57":"#FF6B81"}}>{Math.round(p.best*100)+"%"}</span>
            </div>
          );})}
        </div>}
        {/* Settings */}
        {sideTab==="settings"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Settings</h3>
          <button onClick={function(){setClearConfirm(true);}} style={{width:"100%",padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:"#FF6B81",border:"none",cursor:"pointer",marginBottom:12}}>Clear All Data</button>
          <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>
            <p>Block Ward v1.6</p>
            <p style={{marginTop:4}}>Created by Sebastian J. Heredia</p>
            <p style={{marginTop:4}}>Powered by Claude (Anthropic)</p>
          </div>
        </div>}
      </div>
    </div>}
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      {/* Header with hamburger */}
      <div className="fi" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,marginBottom:20}}>
        <button onClick={function(){setSidebar(true);}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
          <svg viewBox="0 0 24 24" style={{width:24,height:24}}><rect y="3" width="24" height="2.5" rx="1" fill="#888"/><rect y="10.5" width="24" height="2.5" rx="1" fill="#888"/><rect y="18" width="24" height="2.5" rx="1" fill="#888"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div className="flt" style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6}}><div style={{width:24,height:24,borderRadius:6,background:"#4ECDC4"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FF6B81"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FECA57"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#a55eea"}}></div></div>
          <h1 style={{fontSize:32,fontWeight:900,fontFamily:"'Fredoka',sans-serif",letterSpacing:-1}}>Block <span style={{color:"#4ECDC4"}}>Ward</span></h1>
          <p style={{fontSize:12,color:"#999",marginTop:2}}>Peds Emergency and Critical Medicine Clinical Simulator</p>
        </div>
        <div style={{width:24}}></div>
      </div>
      <div className="fi" style={{display:"flex",gap:12,marginBottom:24,animationDelay:".1s"}}>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(78,205,196,0.15),rgba(78,205,196,0.05))",border:"1px solid rgba(78,205,196,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#4ECDC4"}}>{nd}</div><div style={{fontSize:11,color:"#999"}}>Completed</div></div>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(165,94,234,0.15),rgba(165,94,234,0.05))",border:"1px solid rgba(165,94,234,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#c4b5fd"}}>{built.length+cust.length}</div><div style={{fontSize:11,color:"#999"}}>Scenarios</div></div>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(255,107,129,0.15),rgba(255,107,129,0.05))",border:"1px solid rgba(255,107,129,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#fda4af"}}>{cust.length}</div><div style={{fontSize:11,color:"#999"}}>Custom</div></div></div>
      <h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginBottom:12,animationDelay:".2s"}}>Core Scenarios</h2>
      {built.map(function(s,i){var p=prog[s.id];var isBuiltIn=["fussy-infant","vomiting-toddler","asthma-crisis"].indexOf(s.id)>=0;return(
        <button key={s.id} onClick={function(){play(s);}} className="fi bw-tap bw-glass" style={{width:"100%",textAlign:"left",borderRadius:16,padding:20,marginBottom:12,border:"2px solid rgba(78,205,196,0.2)",cursor:"pointer",color:"white",animationDelay:(0.25+i*0.05)+"s"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:32,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Tier "+s.tier}</span>{isBuiltIn&&<span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(0,200,100,0.15)",color:"#00c864"}}>Clinically Reviewed</span>}{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
            <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div></button>);})}
      {cust.length>0&&(<div><h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginTop:24,marginBottom:12}}>Custom Scenarios</h2>
        {cust.map(function(s,i){var p=prog[s.id];return(
          <div key={s.id||i} className="fi bw-glass bw-tap" style={{borderRadius:16,padding:16,marginBottom:12,border:"2px solid rgba(165,94,234,0.2)",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:28,flexShrink:0}}>{s.icon||"\u{1F3E5}"}</div><div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(165,94,234,0.3)",color:"#c4b5fd"}}>AI Generated</span>{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
              <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline||s.description}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={function(){play(s);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,color:"white",fontSize:13,background:"rgba(165,94,234,0.3)",border:"none",cursor:"pointer"}}>Play</button>
              <button onClick={function(){setDelConfirm(s);}} style={{padding:"10px 16px",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:"#FF6B81",border:"none",cursor:"pointer"}}>X</button></div></div>);})}</div>)}
      <button onClick={function(){setView("build");}} className="fi" style={{width:"100%",marginTop:24,padding:"16px 0",borderRadius:16,fontWeight:700,color:"white",fontSize:18,background:"linear-gradient(135deg,#a55eea,#8854d0)",boxShadow:"0 4px 20px rgba(165,94,234,0.3)",fontFamily:"'Fredoka',sans-serif",border:"none",cursor:"pointer",animationDelay:".3s"}}>Build Custom Scenario</button>
      <p style={{textAlign:"center",marginTop:24,paddingBottom:8,fontSize:11,color:"#444"}}>Block Ward v1.6</p>
      <p style={{textAlign:"center",paddingBottom:16,fontSize:10,color:"#555",letterSpacing:0.5}}>Experience created by: Sebastian J. Heredia</p>
    </div></div>);
}