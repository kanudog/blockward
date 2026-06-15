import { useState, useEffect } from "react";
import { usePlayerStore } from "./stores/playerStore.js";
import { useScenarios, decodeScenario } from "./hooks/useScenarios.js";
import { useProgress } from "./hooks/useProgress.js";
import { ScenarioPlayer } from "./components/player/ScenarioPlayer.jsx";
import { ScenarioList } from "./components/scenarios/ScenarioList.jsx";
import { BuilderForm } from "./components/builder/BuilderForm.jsx";
import { Toast } from "./components/shared/Toast.jsx";
import { ConfirmModal } from "./components/shared/ConfirmModal.jsx";
import { Sidebar } from "./components/shell/Sidebar.jsx";
import { BG_APP, GLASS_CSS, COLOR, FONT, cta } from "./lib/design/tokens.js";
export default function App(){
  var _view=useState("dash");var view=_view[0];var setView=_view[1];
  var act=usePlayerStore(function(s){return s.activeScenario;});
  var startPlayer=usePlayerStore(function(s){return s.start;});
  var resetPlayer=usePlayerStore(function(s){return s.reset;});
  var scn=useScenarios();
  var built=scn.built;var cust=scn.custom;var ok=scn.hydrated;
  var hydrate=scn.hydrate;var addCustom=scn.addCustom;var addCustomIfNew=scn.addCustomIfNew;var deleteCustom=scn.deleteCustom;var clearAllScenarios=scn.clearAll;
  var pr=useProgress();var prog=pr.prog;var recordCompletion=pr.recordCompletion;var nd=pr.completed;
  var _shareMsg=useState(null);var shareMsg=_shareMsg[0];var setShareMsg=_shareMsg[1];
  var _sidebar=useState(false);var sidebar=_sidebar[0];var setSidebar=_sidebar[1];
  var _delConfirm=useState(null);var delConfirm=_delConfirm[0];var setDelConfirm=_delConfirm[1];
  var _clearConfirm=useState(false);var clearConfirm=_clearConfirm[0];var setClearConfirm=_clearConfirm[1];
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
  var play=function(s){startPlayer(s);setView("play");};
  var done=function(){if(!act)return;recordCompletion(act.id);};
  var addC=function(s,opts){
    addCustom(s);
    if(opts&&opts.play){play(s);}else{setView("dash");}
    if(s&&s._validatorWarnings&&s._validatorWarnings.length>0){var n=s._validatorWarnings.length;setShareMsg(n+" content warning"+(n===1?"":"s")+" - see console");setTimeout(function(){setShareMsg(null);},5000);}
  };
  var delC=function(id){deleteCustom(id);setDelConfirm(null);};
  var clearAll=function(){clearAllScenarios();setShareMsg("All data cleared");setTimeout(function(){setShareMsg(null);},2000);};
  if(!ok)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:COLOR.bg0}}><div style={{color:COLOR.accent,fontSize:20}}>Loading Block Ward...</div></div>);
  if(view==="play"&&act)return <ScenarioPlayer sc={act} onExit={function(){setView("dash");resetPlayer();}} onDone={done}/>;
  if(view==="build")return <BuilderForm onDone={addC} onBack={function(){setView("dash");}}/>;
  return(<div style={{minHeight:"100dvh",padding:16,background:BG_APP,color:"#fff",fontFamily:FONT.body}}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}.flt{animation:float 3s ease-in-out infinite}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fadeIn .5s ease-out both}button{transition:all .15s ease;min-height:44px;min-width:44px}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0c1230}::-webkit-scrollbar-thumb{background:#34d3ee;border-radius:3px}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}.si{animation:scaleIn .4s ease-out both}.bw-glass{"+GLASS_CSS+"}.bw-tap{transition:transform .12s ease,box-shadow .12s ease}.bw-tap:active{transform:scale(0.96)}"}</style>
    <Toast message={shareMsg}/>
    <ConfirmModal open={!!delConfirm} title="Delete Scenario?" subtitle={delConfirm?delConfirm.title:null} confirmLabel="Delete" onConfirm={function(){delC(delConfirm.id);}} onCancel={function(){setDelConfirm(null);}}/>
    <ConfirmModal open={clearConfirm} title="Clear All Data?" subtitle="All progress and custom scenarios will be removed." confirmLabel="Clear" onConfirm={function(){clearAll();setClearConfirm(false);setSidebar(false);}} onCancel={function(){setClearConfirm(false);}}/>
    <Sidebar open={sidebar} onClose={function(){setSidebar(false);}} onRequestClearAll={function(){setClearConfirm(true);}}/>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      {/* Header with hamburger */}
      <div className="fi" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,marginBottom:20}}>
        <button onClick={function(){setSidebar(true);}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
          <svg viewBox="0 0 24 24" style={{width:24,height:24}}><rect y="3" width="24" height="2.5" rx="1" fill="#888"/><rect y="10.5" width="24" height="2.5" rx="1" fill="#888"/><rect y="18" width="24" height="2.5" rx="1" fill="#888"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div className="flt" style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6}}><div style={{width:24,height:24,borderRadius:6,background:"#34d3ee",boxShadow:"0 0 12px rgba(34,211,238,0.5)"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#818cf8",boxShadow:"0 0 12px rgba(129,140,248,0.5)"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FECA57"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FF6B81"}}></div></div>
          <h1 style={{fontSize:32,fontWeight:900,fontFamily:"'Fredoka',sans-serif",letterSpacing:-1}}>Block <span style={{color:COLOR.accent}}>Ward</span></h1>
          <p style={{fontSize:12,color:"#999",marginTop:2}}>Peds Emergency and Critical Medicine Clinical Simulator</p>
        </div>
        <div style={{width:24}}></div>
      </div>
      <div className="fi" style={{display:"flex",gap:12,marginBottom:24,animationDelay:".1s"}}>
        <div style={{flex:1,borderRadius:14,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(34,211,238,0.16),rgba(34,211,238,0.04))",border:"1px solid rgba(34,211,238,0.30)"}}><div style={{fontSize:28,fontWeight:900,color:COLOR.accent}}>{nd}</div><div style={{fontSize:11,color:COLOR.ink3}}>Completed</div></div>
        <div style={{flex:1,borderRadius:14,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(129,140,248,0.16),rgba(129,140,248,0.04))",border:"1px solid rgba(129,140,248,0.30)"}}><div style={{fontSize:28,fontWeight:900,color:"#aab4ff"}}>{built.length+cust.length}</div><div style={{fontSize:11,color:COLOR.ink3}}>Scenarios</div></div>
        <div style={{flex:1,borderRadius:14,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(255,107,129,0.16),rgba(255,107,129,0.04))",border:"1px solid rgba(255,107,129,0.30)"}}><div style={{fontSize:28,fontWeight:900,color:"#fda4af"}}>{cust.length}</div><div style={{fontSize:11,color:COLOR.ink3}}>Custom</div></div></div>
      <ScenarioList built={built} cust={cust} prog={prog} onPlay={play} onDelete={setDelConfirm}/>
      <button onClick={function(){setView("build");}} className="fi" style={Object.assign({},cta("indigo"),{marginTop:24,padding:"16px 0",fontSize:18,animationDelay:".3s"})}>Build Custom Scenario</button>
      <p style={{textAlign:"center",marginTop:24,paddingBottom:8,fontSize:11,color:COLOR.ink4}}>Block Ward v1.6</p>
      <p style={{textAlign:"center",paddingBottom:16,fontSize:10,color:COLOR.ink4,letterSpacing:0.5}}>Experience created by: Sebastian J. Heredia</p>
    </div></div>);
}
