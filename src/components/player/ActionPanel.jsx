import { useState } from "react";
import { Check, X, Minus } from "lucide-react";
import { TOOLS, MEDS } from "../../lib/scenarios/builtIn.js";
import { computeActionScore } from "../../lib/scenarios/scoring.js";
import { ToolIcon, MedIcon } from "./icons.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
export function ActionPanel(props){
  var tools=props.tools;var meds=props.meds;var actions=props.actions;var onDone=props.onDone;var onSkip=props.onSkip;
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
  var finish=function(){onDone(computeActionScore(tools,meds,actions,sel),sel);};
  var skip=function(){
    var missed=[];
    rT.forEach(function(id){if(!sel[id]){var t=TOOLS[id];missed.push({id:id,label:t?t.label:id,type:"tool"});}});
    rM.forEach(function(id){if(!sel[id]){var m=MEDS[id];missed.push({id:id,label:m?m.label:id,type:"med"});}});
    var score=computeActionScore(tools,meds,actions,sel);
    if(onSkip)onSkip(score,missed,sel);else onDone(score,sel);
  };
  function tbg(u,o){if(!u)return"rgba(255,255,255,0.05)";return o?"rgba(0,184,148,0.12)":"rgba(255,165,0,0.1)";}
  function tbd(u,o){if(!u)return"2px solid rgba(255,255,255,0.08)";return o?"2px solid rgba(0,184,148,0.35)":"2px solid rgba(255,165,0,0.25)";}
  return(
    <div style={{marginTop:16}}>
      {/* Phase-2.6.3 change 7: action-tile grid mirrors the assess-tile
          grid (2 cols mobile, 3 at 768px, 4 at 1024px) so Phase 1 and
          Phase 2 share visual rhythm. Same gap (6), same padding (10),
          same borderRadius (12), same minHeight (78). */}
      <style>{"@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}@media(min-width:768px){.bw-action-grid{grid-template-columns:repeat(3,1fr) !important}}@media(min-width:1024px){.bw-action-grid{grid-template-columns:repeat(4,1fr) !important}}"}</style>
      {tools&&tools.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Tool Belt</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{tools.map(function(id){var t=TOOLS[id];if(!t)return null;var u=!!sel[id];var o=actions&&actions.tools&&actions.tools[id]?actions.tools[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"t");}} className="bw-tap" style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:10,borderRadius:12,minHeight:78,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <ToolIcon name={id} size={26} color={u?(o?"#55efc4":"#FECA57"):"#4ECDC4"}/><span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{t.label}</span>
            {u&&<span style={{position:"absolute",top:6,right:6}}>{o?<Check size={12} color="#55efc4"/>:<Minus size={12} color="#FECA57"/>}</span>}</button>);})}</div></div>)}
      {meds&&meds.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Med Cart</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{meds.map(function(id){var m=MEDS[id];if(!m)return null;var u=!!sel[id];var o=actions&&actions.meds&&actions.meds[id]?actions.meds[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"m");}} className="bw-tap" style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:10,borderRadius:12,minHeight:78,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <div style={{width:26,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:m.color||"#636e72",fontSize:16,color:"white"}}><MedIcon type={m.medType||"iv"} size={18} color="white"/></div>
            <span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{m.label}</span>
            {u&&<span style={{position:"absolute",top:6,right:6}}>{o?<Check size={12} color="#55efc4"/>:<Minus size={12} color="#FECA57"/>}</span>}</button>);})}</div></div>)}
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
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:"#666"}}>{explored+"/"+total+" explored"}</div>
        <div style={{display:"flex",gap:8}}>
          {!allF&&<button onClick={skip} style={{padding:"8px 16px",borderRadius:12,fontWeight:700,color:"#ccc",fontSize:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer"}}>Skip to Next</button>}
          {allF&&<button onClick={finish} style={{padding:"8px 20px",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:"linear-gradient(135deg,#4ECDC4,#44B09E)",border:"none",cursor:"pointer"}}>Continue</button>}
        </div>
      </div>
      {!allF&&explored>0&&<p style={{fontSize:11,color:"#4ECDC4",marginTop:8,opacity:0.7}}>Find all appropriate actions to continue, or Skip to move on.</p>}
    </div>);
}
