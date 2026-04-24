import { useState } from "react";
import { Star, Trophy, BookOpen, Plus, Minus, Search, Check, Zap, Droplets } from "lucide-react";
import { PatientSVG } from "./PatientSVG.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { TOOLS, MEDS } from "../../lib/scenarios/builtIn.js";

var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";

export function Debrief(props){
  var sc=props.sc;var score=props.score;var ageG=props.ageG;var sexG=props.sexG;var onDone=props.onDone;var onExit=props.onExit;
  var _expI=useState(null);var expI=_expI[0];var setExpI=_expI[1];
  var _tldrOpen=useState({});var tldrOpen=_tldrOpen[0];var setTldrOpen=_tldrOpen[1];
  var toggleTldr=function(key){setTldrOpen(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;});};
  var pct=score.t>0?Math.round(score.c/score.t*100):0;var emIcon=pct>=80?<Star size={24} color="#FECA57"/>:pct>=50?<Trophy size={24} color="#FECA57"/>:<BookOpen size={24} color="#74b9ff"/>;var sBg=pct>=80?"#00b894":pct>=50?"#fdcb6e":"#e17055";
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
            <span>TLDR</span><span>{tldrOpen["e"+i]?"−":"+"}</span></button>
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
              <span>TLDR</span><span>{tldrOpen[k]?"−":"+"}</span></button>
            {tldrOpen[k]&&<p style={{fontSize:12,color:"#FECA57",marginTop:6,lineHeight:1.5,fontWeight:600}}>{t.tldr}</p>}
          </div>}
        </div>}</div>);})}</div>)}
    <button onClick={function(){onDone(score);onExit();}} style={Object.assign({},BS,{background:GR})}>Back to Dashboard</button></div></div>);
}
