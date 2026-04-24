import { useState } from "react";
import { Star, Trophy, BookOpen, Plus, Minus, Search, Check, Zap, Droplets } from "lucide-react";
import { PatientSVG } from "./PatientSVG.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { TOOLS, MEDS } from "../../lib/scenarios/builtIn.js";
import { usePlayerStore } from "../../stores/playerStore.js";

var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";

export function Debrief(props){
  var sc=props.sc;var score=props.score;var ageG=props.ageG;var sexG=props.sexG;var onDone=props.onDone;var onExit=props.onExit;
  var skippedActions=usePlayerStore(function(s){return s.skippedActions;});
  var assessHistory=usePlayerStore(function(s){return s.assessHistory;});
  var actionHistory=usePlayerStore(function(s){return s.actionHistory;});
  var _expI=useState(null);var expI=_expI[0];var setExpI=_expI[1];
  var _tldrOpen=useState({});var tldrOpen=_tldrOpen[0];var setTldrOpen=_tldrOpen[1];
  var toggleTldr=function(key){setTldrOpen(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;});};
  var pct=score.t>0?Math.round(score.c/score.t*100):0;var emIcon=pct>=80?<Star size={24} color="#FECA57"/>:pct>=50?<Trophy size={24} color="#FECA57"/>:<BookOpen size={24} color="#74b9ff"/>;var sBg=pct>=80?"#00b894":pct>=50?"#fdcb6e":"#e17055";
  // Build caught / missed / intervention lists from history (phase-2.5 issue 8)
  var caught=[];var missed=[];
  assessHistory.forEach(function(snap){
    snap.items.forEach(function(it){
      var entry={phase:snap.phaseName,label:it.label,why:it.why,cat:it.cat,bad:it.bad,userFlagged:it.userFlagged};
      var correct=it.userFlagged===it.bad;
      if(correct&&(it.userFlagged||it.bad))caught.push(entry);
      else if(!correct)missed.push(entry);
    });
  });
  var interventions=[];
  actionHistory.forEach(function(snap){
    var tools=snap.tools||[];var meds=snap.meds||[];var actions=snap.actions||{};var sel=snap.sel||{};
    tools.forEach(function(id){
      var info=actions.tools?actions.tools[id]:null;if(!info)return;
      var t=TOOLS[id];
      interventions.push({phase:snap.phaseName,label:t?t.label:id,type:"tool",id:id,info:info,selected:!!sel[id],pri:info.pri,ok:!!info.ok});
    });
    meds.forEach(function(id){
      var info=actions.meds?actions.meds[id]:null;if(!info)return;
      var m=MEDS[id];
      interventions.push({phase:snap.phaseName,label:m?m.label:id,type:"med",id:id,info:info,selected:!!sel[id],pri:info.pri,ok:!!info.ok});
    });
  });
  var correctInt=interventions.filter(function(x){return x.ok;}).sort(function(a,b){return(a.pri||99)-(b.pri||99);});
  var wrongPicks=interventions.filter(function(x){return x.selected&&!x.ok;});
  return(<div style={{minHeight:"100vh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
    <div style={{textAlign:"center",marginBottom:16}}>
      <div style={{width:100,margin:"0 auto"}}><PatientSVG status="stable" rr={20} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
    </div>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44,display:"flex",justifyContent:"center"}}>{emIcon}</div><h2 style={{fontSize:24,fontWeight:900}}>Scenario Complete</h2>
      <div className="si" style={{marginTop:8,display:"inline-block",padding:"8px 20px",borderRadius:20,fontSize:18,fontWeight:700,background:sBg}}>{score.c+"/"+score.t+" - "+pct+"%"}</div></div>
    <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:16}}><TextBlock text={sc.debrief.summary} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/></div>
    {/* Review — four collapsible subsections (phase-2.5 issue 8) */}
    {caught.length>0&&<div style={{marginBottom:8,borderRadius:12,overflow:"hidden",background:"rgba(0,184,148,0.06)",border:"1px solid rgba(0,184,148,0.25)"}}>
      <button onClick={function(){setExpI(expI==="caught"?null:"caught");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
        <span style={{fontWeight:700,fontSize:14,color:"#00b894",display:"flex",alignItems:"center",gap:6}}><Check size={14}/>Findings You Caught ({caught.length})</span>
        <span style={{color:"#00b894"}}>{expI==="caught"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
      {expI==="caught"&&<div style={{padding:"0 12px 12px"}}>
        {caught.map(function(it,i){return(<div key={i} style={{padding:"8px 10px",marginBottom:6,borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(0,184,148,0.25)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
            <span style={{fontSize:12,fontWeight:700,color:"#ddd"}}>{it.label}</span>
            <span style={{fontSize:9,color:"#666"}}>{it.phase}</span>
          </div>
          {it.why&&<TextBlock text={it.why} style={{fontSize:11,color:"#aaa",lineHeight:1.5,marginTop:4}}/>}
        </div>);})}
      </div>}
    </div>}
    {missed.length>0&&<div style={{marginBottom:8,borderRadius:12,overflow:"hidden",background:"rgba(255,71,87,0.06)",border:"1px solid rgba(255,71,87,0.25)"}}>
      <button onClick={function(){setExpI(expI==="missed"?null:"missed");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
        <span style={{fontWeight:700,fontSize:14,color:"#FF6B81",display:"flex",alignItems:"center",gap:6}}><Search size={14}/>Findings You Missed ({missed.length})</span>
        <span style={{color:"#FF6B81"}}>{expI==="missed"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
      {expI==="missed"&&<div style={{padding:"0 12px 12px"}}>
        {missed.map(function(it,i){var note=it.bad?"You did not flag this abnormal finding.":"You flagged this, but it was within normal limits.";return(<div key={i} style={{padding:"8px 10px",marginBottom:6,borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,71,87,0.25)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
            <span style={{fontSize:12,fontWeight:700,color:"#ddd"}}>{it.label}</span>
            <span style={{fontSize:9,color:"#666"}}>{it.phase}</span>
          </div>
          <p style={{fontSize:11,color:"#ff9a9f",lineHeight:1.5,marginTop:4,marginBottom:0}}>{note}</p>
          {it.why&&<TextBlock text={it.why} style={{fontSize:11,color:"#aaa",lineHeight:1.5,marginTop:4}}/>}
        </div>);})}
      </div>}
    </div>}
    {interventions.length>0&&<div style={{marginBottom:8,borderRadius:12,overflow:"hidden",background:"rgba(78,205,196,0.06)",border:"1px solid rgba(78,205,196,0.25)"}}>
      <button onClick={function(){setExpI(expI==="int"?null:"int");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
        <span style={{fontWeight:700,fontSize:14,color:"#4ECDC4",display:"flex",alignItems:"center",gap:6}}><Zap size={14}/>Interventions ({correctInt.length} correct)</span>
        <span style={{color:"#4ECDC4"}}>{expI==="int"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
      {expI==="int"&&<div style={{padding:"0 12px 12px"}}>
        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:"#888",fontWeight:700,marginTop:4,marginBottom:6}}>Required actions</div>
        {correctInt.length===0?<p style={{fontSize:11,color:"#888"}}>No correct interventions in this scenario.</p>:correctInt.map(function(x,i){var chosen=x.selected;return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:8,background:chosen?"rgba(0,184,148,0.1)":"rgba(255,71,87,0.08)",border:"1px solid "+(chosen?"rgba(0,184,148,0.3)":"rgba(255,71,87,0.3)")}}>
          {chosen?<Check size={14} color="#00b894"/>:<Minus size={14} color="#FF6B81"/>}
          <span style={{fontSize:12,fontWeight:700,color:"#ddd",flex:1}}>{x.label}</span>
          {x.pri&&<span style={{fontSize:9,color:"#888"}}>{"Priority #"+x.pri}</span>}
          <span style={{fontSize:9,color:"#666"}}>{x.phase}</span>
        </div>);})}
        {wrongPicks.length>0&&<div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:"#888",fontWeight:700,marginTop:10,marginBottom:6}}>Picks that were not indicated</div>
          {wrongPicks.map(function(x,i){return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:8,background:"rgba(255,165,2,0.08)",border:"1px solid rgba(255,165,2,0.3)"}}>
            <Minus size={14} color="#ffa502"/>
            <span style={{fontSize:12,fontWeight:700,color:"#ddd",flex:1}}>{x.label}</span>
            <span style={{fontSize:9,color:"#666"}}>{x.phase}</span>
          </div>);})}
        </div>}
      </div>}
    </div>}
    {(sc.stabilizationSummary||sc.debrief.summary)&&<div style={{marginBottom:16,borderRadius:12,overflow:"hidden",background:"rgba(254,202,87,0.06)",border:"1px solid rgba(254,202,87,0.25)"}}>
      <button onClick={function(){setExpI(expI==="outcome"?null:"outcome");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
        <span style={{fontWeight:700,fontSize:14,color:"#FECA57",display:"flex",alignItems:"center",gap:6}}><Trophy size={14}/>Outcome</span>
        <span style={{color:"#FECA57"}}>{expI==="outcome"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
      {expI==="outcome"&&<div style={{padding:"0 12px 12px"}}>
        <TextBlock text={sc.stabilizationSummary||sc.debrief.summary} style={{fontSize:12,color:"#ddd",lineHeight:1.6}}/>
      </div>}
    </div>}
    {/* Lab Review */}
    {(function(){
      var allLabs=[];
      sc.phases.forEach(function(p,pi){if(p.labs){p.labs.forEach(function(l){if(l.critical&&l.why)allLabs.push({lab:l,phase:p.name});});}});
      if(sc.curveball&&sc.curveball.labs){sc.curveball.labs.forEach(function(l){if(l.critical&&l.why)allLabs.push({lab:l,phase:"Curveball: "+sc.curveball.name});});}
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
                <TextBlock text={entry.lab.why} style={{fontSize:12,color:"#ccc",lineHeight:1.5}}/>
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
    {skippedActions&&skippedActions.length>0&&<div style={{marginBottom:16,borderRadius:12,padding:12,background:"rgba(254,202,87,0.08)",border:"1px solid rgba(254,202,87,0.25)"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#FECA57",marginBottom:6}}>You skipped these interventions:</div>
      <ul style={{margin:0,paddingLeft:18,fontSize:12,color:"#ddd",lineHeight:1.5}}>
        {skippedActions.map(function(a,i){return <li key={i}>{a.label}{a.phase?" ("+a.phase+")":""}</li>;})}
      </ul>
    </div>}
    <button onClick={function(){onDone(score);onExit();}} style={Object.assign({},BS,{background:GR})}>Back to Dashboard</button></div></div>);
}
