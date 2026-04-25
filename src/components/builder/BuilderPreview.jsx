import { useState, useEffect, useRef } from "react";

// Phase-2.6.1 part 2E + 2F:
// - props.message is the current phase-keyed status (set by client.js as
//   new top-level JSON keys arrive from the streaming response).
// - props.bytes is the running byte count of streamed body.
// - props.cbMode toggles the byte estimate (cbMode pulls more content).
// The progress bar is hybrid (part 2F): bytes/estimate is the primary
// signal; for the very first second before any bytes have arrived, a
// time-based 0-30% sweep keeps it from looking frozen.
export function BuilderPreview(props){
  var cbMode=props.cbMode;
  var bytes=props.bytes||0; // accumulated text chars (set by BuilderForm)
  var message=props.message||"Researching clinical guidelines...";
  // Phase-2.6.1 part 2F: estimates calibrated to actual JSON char counts
  // observed in built-ins (~22-27 KB no curveball, ~32-42 KB curveball).
  var estimateBytes=cbMode?38000:24000;
  var estimateSec=cbMode?60:30;
  var _elapsed=useState(0);var elapsed=_elapsed[0];var setElapsed=_elapsed[1];
  var _displayMsg=useState(message);var displayMsg=_displayMsg[0];var setDisplayMsg=_displayMsg[1];
  var lastMsgRef=useRef(message);
  // Phase-2.6.2 change 2: no-progress detector. Each web_search round
  // produces a 10-30s SSE pause server-side; without feedback the user
  // assumes the app froze. Track the last chunk timestamp via useRef so
  // chunk arrivals don't re-render; the displayed stall message uses
  // useState. This is purely UX — the only abort condition remains the
  // 10-min AbortController fuse from change 1.
  var lastChunkAtRef=useRef(Date.now());
  var prevBytesRef=useRef(0);
  var _stall=useState(null);var stall=_stall[0];var setStall=_stall[1];
  useEffect(function(){
    var startedAt=Date.now();
    var iv=setInterval(function(){setElapsed((Date.now()-startedAt)/1000);},250);
    return function(){clearInterval(iv);};
  },[]);
  // Crossfade messages when they change
  useEffect(function(){
    if(message===lastMsgRef.current)return;
    lastMsgRef.current=message;
    setDisplayMsg(message);
  },[message]);
  // Update lastChunkAt when bytes increase (a new chunk arrived).
  useEffect(function(){
    if(bytes!==prevBytesRef.current){
      prevBytesRef.current=bytes;
      lastChunkAtRef.current=Date.now();
      if(stall)setStall(null);
    }
  },[bytes]);
  // Stall checker — every 2s, see how long since the last chunk.
  // Cleanup on unmount (which fires on stream completion or abort
  // because BuilderForm unmounts BuilderPreview when busy=false).
  useEffect(function(){
    var iv=setInterval(function(){
      var since=Date.now()-lastChunkAtRef.current;
      if(since>90000)setStall("Still working — complex scenarios can take a few minutes.");
      else if(since>10000)setStall("Searching clinical references...");
      else setStall(null);
    },2000);
    return function(){clearInterval(iv);};
  },[]);
  // Phase-2.6.1 part 2F hybrid progress:
  // - bytes/estimate is the primary signal once content is arriving.
  // - timeFrac sweeps 0 → 30% over the estimate window as a fallback so
  //   the bar moves during the pre-stream warm-up (server cold start +
  //   first-token latency).
  // - Take the MAX of the two so the bar never moves backward when
  //   streaming kicks in late (a 200ms 30% time fill won't get
  //   overwritten by a 4% byte fill on the first chunk).
  var byteFrac=bytes/estimateBytes;
  var timeFrac=Math.min(elapsed/estimateSec*0.3,0.3);
  var raw=Math.max(byteFrac,timeFrac);
  var progress=Math.min(raw,0.97);
  var pct=Math.round(progress*100);
  return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)"}}>
    <style>{"@keyframes bbl{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}100%{transform:translateY(0) scale(1)}}.bbx>div:nth-child(1){animation:bbl 1.5s ease infinite}.bbx>div:nth-child(2){animation:bbl 1.5s ease .2s infinite}.bbx>div:nth-child(3){animation:bbl 1.5s ease .4s infinite}.bbx>div:nth-child(4){animation:bbl 1.5s ease .6s infinite}@keyframes msgIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.bw-msg{animation:msgIn .25s ease-out}"}</style>
    <div className="bbx" style={{display:"flex",gap:12,marginBottom:24}}><div style={{width:40,height:40,borderRadius:8,background:"#4ECDC4"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FF6B81"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FECA57"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#a55eea"}}></div></div>
    <p style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Building Your Scenario</p>
    <p key={stall||displayMsg} className="bw-msg" style={{fontSize:14,color:stall?"#FECA57":"#4ECDC4",marginBottom:24,minHeight:20,textAlign:"center",maxWidth:320}}>{stall||displayMsg}</p>
    <div style={{width:"100%",maxWidth:320}}>
      <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#a55eea,#4ECDC4)",transition:"width 0.25s linear"}}></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:"#888"}}>
        <span>{bytes>0?(Math.round(bytes/1000)+" KB · "+Math.floor(elapsed)+"s"):(Math.floor(elapsed)+"s elapsed · waiting for first chunk")}</span>
        <span>{cbMode?"Curveball mode":"Standard mode"}</span>
      </div>
    </div>
  </div>);
}
