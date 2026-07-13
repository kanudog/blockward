import { useState } from "react";
import { useScenarios } from "../../hooks/useScenarios.js";
import { useProgress } from "../../hooks/useProgress.js";
import { useTokens } from "../theme/themeStore.js";

var VITAL_REF=[
  {age:"Neonate (0-28d)",hr:"120-160",rr:"30-60",sbp:"60-80",dbp:"30-50"},
  {age:"Infant (1-12m)",hr:"100-160",rr:"25-40",sbp:"70-90",dbp:"40-60"},
  {age:"Toddler (1-3y)",hr:"80-130",rr:"20-30",sbp:"80-100",dbp:"50-65"},
  {age:"Child (4-8y)",hr:"70-110",rr:"18-25",sbp:"85-110",dbp:"50-70"},
  {age:"School Age (9-12y)",hr:"65-110",rr:"16-22",sbp:"90-120",dbp:"55-75"},
  {age:"Teen (13-17y)",hr:"55-100",rr:"12-20",sbp:"100-130",dbp:"60-80"}
];

export function Sidebar(props){
  var t=useTokens();
  var open=props.open;var onClose=props.onClose;var onRequestClearAll=props.onRequestClearAll;
  var _tab=useState("ref");var tab=_tab[0];var setTab=_tab[1];
  var scn=useScenarios();var allScenarios=scn.allScenarios;
  var pr=useProgress();var prog=pr.prog;var completed=pr.completed;var totalAttempts=pr.totalAttempts;
  if(!open)return null;
  var panel=Object.assign({},t.surface("base"),{position:"relative",width:320,maxWidth:"85vw",height:"100%",borderRadius:0,borderRight:"1px solid "+t.COLOR.hairline,overflowY:"auto",padding:20,fontFamily:t.FONT.body});
  var refCard={borderRadius:t.RADIUS.md,padding:10,background:t.surface("card").background,boxShadow:t.surface("card").boxShadow,border:t.surface("card").border||("1px solid "+t.COLOR.hairline)};
  var sA=t.statTile("accent");var sI=t.statTile("indigo");
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:997,display:"flex"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15,18,21,0.5)"}} onClick={onClose}></div>
    <div style={panel}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:700,fontFamily:t.FONT.display,color:t.COLOR.ink}}>Menu</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:t.COLOR.ink3,fontSize:20,cursor:"pointer"}}>X</button>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:16}}>
        {[{k:"ref",l:"Reference"},{k:"stats",l:"My Stats"},{k:"settings",l:"Settings"}].map(function(item){var on=tab===item.k;return(
          <button key={item.k} onClick={function(){setTab(item.k);}} style={{flex:1,padding:"6px 0",borderRadius:8,fontSize:11,fontWeight:700,border:"1px solid "+(on?"rgba("+t.ACCENT_RGB+",0.35)":"transparent"),cursor:"pointer",background:on?"rgba("+t.ACCENT_RGB+",0.14)":t.COLOR.btnNeutralBg,color:on?t.COLOR.accent:t.COLOR.ink3}}>{item.l}</button>
        );})}
      </div>
      {tab==="ref"&&<div>
        <h3 style={{fontSize:14,fontWeight:700,color:t.COLOR.accent,marginBottom:10}}>Peds Vital Sign Ranges</h3>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {VITAL_REF.map(function(r,i){return(
            <div key={i} style={refCard}>
              <div style={{fontSize:12,fontWeight:700,color:t.COLOR.ink2,marginBottom:4}}>{r.age}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,fontSize:10,color:t.COLOR.ink3}}>
                <span>{"HR: "+r.hr}</span><span>{"RR: "+r.rr}</span>
                <span>{"SBP: "+r.sbp}</span><span>{"DBP: "+r.dbp}</span>
              </div>
            </div>
          );})}
        </div>
        <div style={Object.assign({},refCard,{marginTop:16})}>
          <div style={{fontSize:12,fontWeight:700,color:t.COLOR.ink2,marginBottom:6}}>Key Thresholds</div>
          <div style={{fontSize:10,color:t.COLOR.ink3,lineHeight:1.6}}>
            <div>Cap Refill: normal &lt; 2-3 sec</div>
            <div>Hypoglycemia: &lt; 45 mg/dL (infant), &lt; 60 mg/dL (child)</div>
            <div>Lactate: normal 0.5-2.0 mmol/L, critical &gt; 4.0</div>
            <div>Hypotension (SBP): &lt; 70 + (age in years x 2)</div>
          </div>
        </div>
      </div>}
      {tab==="stats"&&<div>
        <h3 style={{fontSize:14,fontWeight:700,color:t.COLOR.accent,marginBottom:10}}>Your Progress</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          <div style={Object.assign({},sA,{flex:"initial"})}>
            <div style={{fontSize:28,fontWeight:900,color:sA._color}}>{completed}</div>
            <div style={{fontSize:10,color:t.COLOR.ink3}}>Completed</div>
          </div>
          <div style={Object.assign({},sI,{flex:"initial"})}>
            <div style={{fontSize:28,fontWeight:900,color:sI._color}}>{totalAttempts}</div>
            <div style={{fontSize:10,color:t.COLOR.ink3}}>Total Attempts</div>
          </div>
        </div>
        <h4 style={{fontSize:12,fontWeight:700,color:t.COLOR.ink2,marginBottom:8}}>Per Scenario</h4>
        {allScenarios.map(function(s){var p=prog[s.id];if(!p)return null;return(
          <div key={s.id} style={{borderRadius:8,padding:8,marginBottom:4,background:t.COLOR.btnNeutralBg}}>
            <span style={{fontSize:11,color:t.COLOR.ink2}}>{s.icon+" "+s.title}</span>
          </div>
        );})}
      </div>}
      {tab==="settings"&&<div>
        <h3 style={{fontSize:14,fontWeight:700,color:t.COLOR.accent,marginBottom:10}}>Settings</h3>
        <button onClick={onRequestClearAll} style={{width:"100%",padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba("+t.CRIT_RGB+",0.14)",color:t.COLOR.critical,border:"1px solid rgba("+t.CRIT_RGB+",0.30)",cursor:"pointer",marginBottom:12}}>Clear All Data</button>
        <div style={{fontSize:11,color:t.COLOR.ink3,lineHeight:1.6}}>
          <p>Block Ward v1.6</p>
          <p style={{marginTop:4}}>Created by Sebastian J. Heredia</p>
          <p style={{marginTop:4}}>Powered by Claude (Anthropic)</p>
        </div>
      </div>}
    </div>
  </div>);
}
