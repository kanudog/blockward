import { useState, useEffect } from "react";
import { SC1, SC2, SC3 } from "./lib/scenarios/builtIn.js";
import { useScenariosStore } from "./stores/scenariosStore.js";
import { usePlayerStore } from "./stores/playerStore.js";
import { ScenarioPlayer } from "./components/player/ScenarioPlayer.jsx";
import { ScenarioList } from "./components/scenarios/ScenarioList.jsx";
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
      <ScenarioList built={built} cust={cust} prog={prog} onPlay={play} onDelete={setDelConfirm}/>
      <button onClick={function(){setView("build");}} className="fi" style={{width:"100%",marginTop:24,padding:"16px 0",borderRadius:16,fontWeight:700,color:"white",fontSize:18,background:"linear-gradient(135deg,#a55eea,#8854d0)",boxShadow:"0 4px 20px rgba(165,94,234,0.3)",fontFamily:"'Fredoka',sans-serif",border:"none",cursor:"pointer",animationDelay:".3s"}}>Build Custom Scenario</button>
      <p style={{textAlign:"center",marginTop:24,paddingBottom:8,fontSize:11,color:"#444"}}>Block Ward v1.6</p>
      <p style={{textAlign:"center",paddingBottom:16,fontSize:10,color:"#555",letterSpacing:0.5}}>Experience created by: Sebastian J. Heredia</p>
    </div></div>);
}
