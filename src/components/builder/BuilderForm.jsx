import { useState } from "react";
import { generateScenario } from "../../lib/ai/client.js";
import { GENERATE_TIMEOUT_MS } from "../../lib/ai/prompt.js";
import { BuilderPreview } from "./BuilderPreview.jsx";
import { Modal } from "../shared/Modal.jsx";

export function BuilderForm(props){
  var onDone=props.onDone;var onBack=props.onBack;
  var _txt=useState("");var txt=_txt[0];var setTxt=_txt[1];
  var _busy=useState(false);var busy=_busy[0];var setBusy=_busy[1];
  var _err=useState(null);var err=_err[0];var setErr=_err[1];
  var _cbMode=useState(true);var cbMode=_cbMode[0];var setCbMode=_cbMode[1];
  var _built=useState(null);var built=_built[0];var setBuilt=_built[1];
  // Phase-2.6.1 part 2D/E/F: streaming progress state, fed by client.js
  var _progress=useState({bytes:0,message:"Researching clinical guidelines..."});var progress=_progress[0];var setProgress=_progress[1];
  var go=async function(){if(!txt.trim())return;setBusy(true);setErr(null);setProgress({bytes:0,message:"Researching clinical guidelines..."});
    try{var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},GENERATE_TIMEOUT_MS);
      var scenario=await generateScenario(txt,cbMode,controller.signal,function(p){
        setProgress(function(prev){
          return{bytes:p.bytes,message:p.message||prev.message};
        });
      });
      clearTimeout(tid);
      setBuilt(scenario);
    }catch(e){console.error("Build error:",e);var em=e.name==="AbortError"?"Connection issue — please check your network and retry.":e.message||"Build failed. Try again with more detail.";setErr(em);}finally{setBusy(false);}};
  if(busy)return <BuilderPreview cbMode={cbMode} bytes={progress.bytes} message={progress.message}/>;
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
    {/* phase-2.6 group J2: post-build modal */}
    <Modal open={!!built} onClose={function(){if(built){onDone(built,{play:false});setBuilt(null);}}} title="Scenario Built" accent="#a55eea">
      <p style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:6}}>{built?built.title:""}</p>
      <p style={{fontSize:11,color:"#888",lineHeight:1.5,marginBottom:14}}>{built?built.tagline||built.description||"":""}</p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={function(){var b=built;setBuilt(null);onDone(b,{play:false});}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,255,255,0.08)",color:"#ddd",border:"1px solid rgba(255,255,255,0.18)",cursor:"pointer"}}>Return to Dashboard</button>
        <button onClick={function(){var b=built;setBuilt(null);onDone(b,{play:true});}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"linear-gradient(135deg,#a55eea,#8854d0)",color:"white",border:"none",cursor:"pointer"}}>Play Now</button>
      </div>
    </Modal>
  </div></div>);
}
