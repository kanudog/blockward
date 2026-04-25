import { useState, useEffect } from "react";

var MSGS=["Assembling blocks...","Calibrating monitor...","Reviewing the chart...","Stocking med cart...","Writing the debrief..."];

// BuilderPreview (phase-2.6 group J1): elapsed-time progress bar.
// cbMode true → 60 second estimate; otherwise 30 seconds.
// Bar fills from 0 to 95% over the estimate; the last 5% is held until
// the parent unmounts this component (onDone fires). If the call
// finishes early the user sees the bar at whatever fill it reached;
// if late, it just stays at 95%.
export function BuilderPreview(props){
  var cbMode=props.cbMode;
  var estimateSec=cbMode?60:30;
  var _mi=useState(0);var mi=_mi[0];var setMi=_mi[1];
  var _elapsed=useState(0);var elapsed=_elapsed[0];var setElapsed=_elapsed[1];
  useEffect(function(){
    var iv=setInterval(function(){setMi(function(p){return(p+1)%MSGS.length;});},2500);
    var startedAt=Date.now();
    var tickIv=setInterval(function(){setElapsed((Date.now()-startedAt)/1000);},250);
    return function(){clearInterval(iv);clearInterval(tickIv);};
  },[]);
  var progress=Math.min(elapsed/estimateSec,0.95);
  var pct=Math.round(progress*100);
  return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)"}}>
    <style>{"@keyframes bbl{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}100%{transform:translateY(0) scale(1)}}.bbx>div:nth-child(1){animation:bbl 1.5s ease infinite}.bbx>div:nth-child(2){animation:bbl 1.5s ease .2s infinite}.bbx>div:nth-child(3){animation:bbl 1.5s ease .4s infinite}.bbx>div:nth-child(4){animation:bbl 1.5s ease .6s infinite}"}</style>
    <div className="bbx" style={{display:"flex",gap:12,marginBottom:24}}><div style={{width:40,height:40,borderRadius:8,background:"#4ECDC4"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FF6B81"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FECA57"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#a55eea"}}></div></div>
    <p style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Building Your Scenario</p>
    <p style={{fontSize:14,color:"#4ECDC4",marginBottom:24}}>{MSGS[mi]}</p>
    <div style={{width:"100%",maxWidth:320}}>
      <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#a55eea,#4ECDC4)",transition:"width 0.25s linear"}}></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:"#888"}}>
        <span>{Math.floor(elapsed)+"s elapsed"}</span>
        <span>{"~"+estimateSec+"s estimate"+(cbMode?" (Curveball)":"")}</span>
      </div>
    </div>
  </div>);
}
