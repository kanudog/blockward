import { useState, useEffect } from "react";
import { SC1, SC2, SC3 } from "./lib/scenarios/builtIn.js";
import { useScenariosStore } from "./stores/scenariosStore.js";
import { usePlayerStore } from "./stores/playerStore.js";
import { ScenarioPlayer } from "./components/player/ScenarioPlayer.jsx";
import { ScenarioList } from "./components/scenarios/ScenarioList.jsx";
import { BuilderForm } from "./components/builder/BuilderForm.jsx";
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
  if(view==="build")return <BuilderForm onDone={addC} onBack={function(){setView("dash");}}/>;
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
