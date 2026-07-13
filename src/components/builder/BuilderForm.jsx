import { useState } from "react";
import { generateScenario } from "../../lib/ai/client.js";
import { GENERATE_TIMEOUT_MS } from "../../lib/ai/prompt.js";
import { BuilderPreview } from "./BuilderPreview.jsx";
import { Modal } from "../shared/Modal.jsx";
import { useTokens } from "../theme/themeStore.js";

export function BuilderForm(props){
  var t=useTokens();
  var onDone=props.onDone;var onBack=props.onBack;
  var _txt=useState("");var txt=_txt[0];var setTxt=_txt[1];
  var _busy=useState(false);var busy=_busy[0];var setBusy=_busy[1];
  var _err=useState(null);var err=_err[0];var setErr=_err[1];
  var _cbMode=useState(true);var cbMode=_cbMode[0];var setCbMode=_cbMode[1];
  // Phase 6.3 (Stage 2): case length. "full" = two assess/intervene rounds
  // (the patient deteriorating over time); "quick" = a single round. Default
  // full per the two-round design.
  var _caseMode=useState("full");var caseMode=_caseMode[0];var setCaseMode=_caseMode[1];
  var _built=useState(null);var built=_built[0];var setBuilt=_built[1];
  // Phase-2.6.1 part 2D/E/F: streaming progress state, fed by client.js
  var _progress=useState({bytes:0,message:"Researching clinical guidelines..."});var progress=_progress[0];var setProgress=_progress[1];
  var go=async function(){if(!txt.trim())return;setBusy(true);setErr(null);setProgress({bytes:0,message:"Researching clinical guidelines..."});
    try{var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},GENERATE_TIMEOUT_MS);
      var scenario=await generateScenario(txt,{mode:caseMode,cbMode:cbMode},controller.signal,function(p){
        // Phase-2.6.1 part 2F: use accumulated text chars (useful content)
        // rather than raw SSE chunk bytes (which include event-stream
        // framing overhead). Falls back to chunk bytes if accumulated
        // somehow isn't reported.
        var contentChars=p.accumulated?p.accumulated.length:p.bytes;
        setProgress(function(prev){
          return{bytes:Math.max(prev.bytes||0,contentChars),message:p.message||prev.message};
        });
      });
      clearTimeout(tid);
      setBuilt(scenario);
    }catch(e){console.error("Build error:",e);var em=e.name==="AbortError"?"Connection issue — please check your network and retry.":e.message||"Build failed. Try again with more detail.";setErr(em);}finally{setBusy(false);}};
  if(busy)return <BuilderPreview cbMode={cbMode} bytes={progress.bytes} message={progress.message}/>;
  var canBuild=!!txt.trim();
  var toggleKnob={width:24,height:24,borderRadius:12,background:"#fff",position:"absolute",top:4,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"};
  var buildBtn=canBuild?Object.assign({},t.cta("primary"),{marginTop:16,fontSize:16}):Object.assign({},t.cta("ghost"),{marginTop:16,fontSize:16,opacity:0.55,cursor:"default"});
  return(<div style={{minHeight:"100dvh",padding:16,background:t.BG_APP,color:t.COLOR.ink,fontFamily:t.FONT.body}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
    <button onClick={onBack} style={{color:t.COLOR.ink3,fontSize:13,background:"none",border:"none",cursor:"pointer",marginBottom:16,fontFamily:t.FONT.body}}>Back</button>
    <h2 style={{fontSize:24,fontWeight:700,marginBottom:8,fontFamily:t.FONT.display,color:t.COLOR.ink}}>Build a Scenario</h2>
    <p style={{fontSize:13,color:t.COLOR.ink2,marginBottom:6}}>Describe any pediatric emergency, trauma, or critical care case. Even a few words will work. The AI will research clinical details and build a fully playable scenario with vitals, labs, and interventions.</p>
    <p style={{fontSize:11,color:t.COLOR.ink3,marginBottom:16}}>Once built, you can share your scenario with others via a link.</p>
    <textarea value={txt} onChange={function(e){setTxt(e.target.value);}} placeholder={"Examples:\n- 12 year old bike crash head injury\n- 9 year old peanut allergy anaphylaxis\n- Newborn with cyanotic heart disease\n- Toddler who drank grandma's pills\n- 4 year old near drowning"} style={Object.assign({},t.surface("inset"),{width:"100%",height:200,padding:16,color:t.COLOR.ink,fontSize:13,resize:"none",outline:"none",lineHeight:1.6,boxSizing:"border-box",fontFamily:t.FONT.body})}/>
    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
      <button onClick={function(){setCaseMode(caseMode==="full"?"quick":"full");}} style={{width:56,height:32,borderRadius:16,border:"none",cursor:"pointer",position:"relative",background:caseMode==="full"?t.COLOR.positive:t.COLOR.btnNeutralBg,transition:"background 0.2s"}}>
        <div style={Object.assign({},toggleKnob,{left:caseMode==="full"?28:4})}></div>
      </button>
      <div><span style={{fontSize:13,fontWeight:700,color:caseMode==="full"?t.COLOR.positive:t.COLOR.ink3}}>{caseMode==="full"?"Full Case (two rounds)":"Quick Case (one round)"}</span>
        <p style={{fontSize:10,color:t.COLOR.ink3,marginTop:1}}>{caseMode==="full"?"The same patient deteriorates over a second assess + intervene round":"A single assess + intervene round, then debrief"}</p></div>
    </div>
    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
      <button onClick={function(){setCbMode(!cbMode);}} style={{width:56,height:32,borderRadius:16,border:"none",cursor:"pointer",position:"relative",background:cbMode?t.COLOR.accent:t.COLOR.btnNeutralBg,transition:"background 0.2s"}}>
        <div style={Object.assign({},toggleKnob,{left:cbMode?28:4})}></div>
      </button>
      <div><span style={{fontSize:13,fontWeight:700,color:cbMode?t.COLOR.accent:t.COLOR.ink3}}>Curveball Mode</span>
        <p style={{fontSize:10,color:t.COLOR.ink3,marginTop:1}}>{cbMode?"A surprise clinical event will be thrown in mid-scenario":"Straight scenario: triage, escalation, debrief"}</p></div>
    </div>
    <div style={{marginTop:14,padding:12,borderRadius:t.RADIUS.md,background:"rgba("+t.ACCENT_RGB+",0.08)",border:"1px solid rgba("+t.ACCENT_RGB+",0.25)",fontSize:11,color:t.COLOR.ink2,lineHeight:1.5}}>
      <span style={{color:t.COLOR.boldTerm,fontWeight:700}}>Clinical Disclaimer:</span> AI-generated scenarios are for educational practice only. Always verify clinical details against current guidelines before using for instruction.
    </div>
    {err&&<div style={{marginTop:12,padding:12,borderRadius:t.RADIUS.md,fontSize:12,background:"rgba("+t.CRIT_RGB+",0.12)",color:t.COLOR.critical,lineHeight:1.4}}>{err}</div>}
    <button onClick={go} disabled={!txt.trim()} style={buildBtn}>Build Scenario</button>
    {/* phase-2.6 group J2: post-build modal */}
    <Modal open={!!built} onClose={function(){if(built){onDone(built,{play:false});setBuilt(null);}}} title="Scenario Built" accent={t.COLOR.accent}>
      <p style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6,marginBottom:6}}>{built?built.title:""}</p>
      <p style={{fontSize:11,color:t.COLOR.ink3,lineHeight:1.5,marginBottom:14}}>{built?built.tagline||built.description||"":""}</p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={function(){var b=built;setBuilt(null);onDone(b,{play:false});}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:t.COLOR.btnNeutralBg,color:t.COLOR.btnNeutralInk,border:"1px solid "+t.COLOR.hairline,cursor:"pointer"}}>Return to Dashboard</button>
        <button onClick={function(){var b=built;setBuilt(null);onDone(b,{play:true});}} style={Object.assign({},t.cta("primary"),{flex:1,width:"auto",padding:"10px 0",fontSize:13})}>Play Now</button>
      </div>
    </Modal>
  </div></div>);
}
