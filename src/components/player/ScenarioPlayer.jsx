import { useState, useEffect, useCallback } from "react";
import { Sparkles, Star, Trophy, Shield, Zap, Check, Circle } from "lucide-react";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../../lib/scenarios/packs/index.js";
import { medType as lookupMedType } from "../../lib/scenarios/visualMeta.js";
import { vitalCanonicalId, labCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { guessAge, guessSex } from "../../lib/scenarios/age.js";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { SceneStage } from "./SceneStage.jsx";
import { ScenePopup } from "./ScenePopup.jsx";
import { BodySystemsView } from "./BodySystemsView.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { AssessPanel } from "./AssessPanel.jsx";
import { ConsequenceBeat } from "./ConsequenceBeat.jsx";
import { PatientHeader } from "./PatientHeader.jsx";
import { Debrief } from "./Debrief.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { Modal } from "../shared/Modal.jsx";
import { Section } from "../shared/Section.jsx";
import { ChapterBar } from "../shared/ChapterBar.jsx";
import { ReviewTray } from "../shared/ReviewTray.jsx";
import { CoachBubble } from "../shared/CoachBubble.jsx";
import { ToolIcon, MedIcon } from "./icons.jsx";
import { replaceIdsWithLabels } from "../../lib/scenarios/labels.js";
import { expectedRangesFor } from "../../lib/scenarios/ranges.js";
import { useTokens } from "../theme/themeStore.js";
import { GOOGLE_FONTS_CSS } from "../theme/tokens.js";

// A phase has assessable items if any typed collection is non-empty.
function phaseHasAssessables(ph){
  if(!ph)return false;
  var vCount=0;
  if(ph.vitals){
    if(Array.isArray(ph.vitals))vCount=ph.vitals.length;
    else if(typeof ph.vitals==="object")vCount=Object.keys(ph.vitals).length;
  }
  var sCount=Array.isArray(ph.signs)?ph.signs.length:0;
  var lCount=Array.isArray(ph.labs)?ph.labs.length:0;
  return(vCount+sCount+lCount)>0;
}

function actionIds(actions){
  return{
    tools:actions&&actions.tools?Object.keys(actions.tools):[],
    meds:actions&&actions.meds?Object.keys(actions.meds):[]
  };
}

// Insight cards auto-fill from the case's own teaching (owner decision
// 2026-07-10): one keeper per intervene phase, built from that phase's top
// tied-correct action + its rationale (fb). No new content is generated.
function phaseInsight(ph){
  if(!ph||!ph.actions)return null;
  var found=null;
  ["tools","meds"].forEach(function(kind){
    if(found)return;
    var coll=ph.actions[kind]||{};
    Object.keys(coll).forEach(function(id){
      if(found)return;
      var e=coll[id];
      if(e&&e.priority==="tied-correct"){
        var label=kind==="tools"?(isCustomTool(id)?(e.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(e.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
        var body=e.fb?e.fb.split(".").slice(0,2).join(".").trim()+".":"A key step that made the difference in this case.";
        found={id:"insight:"+(ph.id||ph.phaseIndex||"p")+":"+id,title:label,body:body};
      }
    });
  });
  return found;
}

export function ScenarioPlayer(props){
  var t=useTokens();
  var sc=props.sc;var onExit=props.onExit;var onDone=props.onDone;
  var ageG=guessAge(sc);var sexG=guessSex(sc);
  var stage=usePlayerStore(function(s){return s.stage;});var pi=usePlayerStore(function(s){return s.phaseIndex;});var flags=usePlayerStore(function(s){return s.flags;});var showFb=usePlayerStore(function(s){return s.showFb;});var cbDone=usePlayerStore(function(s){return s.cbDone;});var shake=usePlayerStore(function(s){return s.shake;});var vit=usePlayerStore(function(s){return s.vitals;})||{};
  var _ps=usePlayerStore.getState();var setStage=_ps.setStage;var setPi=_ps.setPhaseIndex;var setFlags=_ps.setFlags;var toggleFlag=_ps.toggleFlag;var setShowFb=_ps.setShowFb;var setCbDone=_ps.setCbDone;var setShake=_ps.setShake;var setVit=_ps.setVitals;var addSkipped=_ps.addSkipped;var recordAssess=_ps.recordAssess;var recordAction=_ps.recordAction;
  var addInsightCard=usePlayerStore(function(s){return s.addInsightCard;});
  var coachSeen=usePlayerStore(function(s){return s.coachSeen;});
  var dismissCoach=usePlayerStore(function(s){return s.dismissCoach;});
  var round2ErrorClass=usePlayerStore(function(s){return s.round2ErrorClass;});
  function prevStageFor(s){if(s==="phase")return"intro";if(s==="assess")return"intro";if(s==="act")return"phase";if(s==="cb-alert")return"act";if(s==="cb-act")return"cb-alert";if(s==="reassess")return null;return null;}
  var prev=prevStageFor(stage);
  if(stage==="interlude"||pi>=2)prev=null;
  var goBack=function(){if(prev)setStage(prev);};
  var _recStep=useState(0);var recStep=_recStep[0];var setRecStep=_recStep[1];
  var _learnOpen=useState(false);var learnOpen=_learnOpen[0];var setLearnOpen=_learnOpen[1];
  // Consequence interstitial state — shown within the act stage after commit,
  // before the run moves on. Optional: only fires when a case authors
  // ph.consequence (fable enhancement; real cases skip straight to afterAct).
  var _conseq=useState(null);var conseq=_conseq[0];var setConseq=_conseq[1];
  // First-time plan coach, reopenable via the "?" next to the act heading.
  var _planHelp=useState(false);var planHelp=_planHelp[0];var setPlanHelp=_planHelp[1];
  var showPlanCoach=planHelp||!coachSeen.plan;
  var dispatcherState=usePlayerStore(function(s){return s.dispatcherState;});
  var waveOneComplete=usePlayerStore(function(s){return s.waveOneComplete;});
  var round2State=usePlayerStore(function(s){return s.round2State;});
  var curveballState=usePlayerStore(function(s){return s.curveballState;});
  useEffect(function(){
    if(!sc)return;
    usePlayerStore.getState().startDispatcher();
    usePlayerStore.getState().startRound2Generation();
    usePlayerStore.getState().startCurveballGeneration();
  },[sc&&sc.id]);
  var ph=sc.phases[pi];
  var isFullCase=!!(sc._pendingRound2||(sc.phases&&sc.phases.length>=4));
  var chRanges=expectedRangesFor(sc);
  /* "What Saved This Patient" — tied-correct actions across every intervene
     phase (+ curveball), marked with whether the user selected them. */
  var actionHistoryForRecovery=usePlayerStore(function(s){return s.actionHistory;});
  function _findP1Selections(history,phase1){
    if(!Array.isArray(history))return{};
    var p1Id=phase1&&(phase1.id||phase1.stageType);
    for(var hi=0;hi<history.length;hi++){
      var snap=history[hi];
      if(!snap)continue;
      if(snap.phaseId===p1Id||snap.phaseId==="intervene"||snap.phaseId==="escalation"){
        return snap.sel||{};
      }
    }
    return{};
  }
  var phase1=sc.phases&&sc.phases[1]?sc.phases[1]:null;
  var p1Sel=_findP1Selections(actionHistoryForRecovery,phase1);
  function _selForPhase(history,phase){
    if(!Array.isArray(history)||!phase)return{};
    var pid=phase.id||phase.stageType;
    for(var hi=0;hi<history.length;hi++){var snap=history[hi];if(snap&&snap.phaseId===pid)return snap.sel||{};}
    return{};
  }
  var correctActions=[];var _seenMustHave={};
  (sc.phases||[]).forEach(function(phx){
    if(!phx||phx.stageType!=="intervene"||!phx.actions)return;
    var sel=_selForPhase(actionHistoryForRecovery,phx);
    ["tools","meds"].forEach(function(kind){
      var coll=phx.actions[kind]||{};
      Object.keys(coll).forEach(function(id){
        var e=coll[id];
        if(e&&e.priority==="tied-correct"){
          if(_seenMustHave[id])return;_seenMustHave[id]=true;
          var label=kind==="tools"?(isCustomTool(id)?(e.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(e.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
          correctActions.push({name:label,toolId:kind==="tools"?id:null,medType:kind==="meds"?lookupMedType(id):null,fb:e.fb?e.fb.split(".")[0]+".":"",pri:e.pri,type:kind==="tools"?"tool":"med",userSelected:!!sel[id],round:phx.round||1});
        }
      });
    });
  });
  if(sc.curveball&&sc.curveball.actions){
    var cbSel=_selForPhase(actionHistoryForRecovery,{id:"curveball"});
    ["tools","meds"].forEach(function(kind){
      var cbColl=sc.curveball.actions[kind]||{};
      Object.keys(cbColl).forEach(function(id){
        var ce=cbColl[id];
        if(ce&&ce.priority==="tied-correct"){
          var clabel=kind==="tools"?(isCustomTool(id)?(ce.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(ce.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
          correctActions.push({name:clabel,toolId:kind==="tools"?id:null,medType:kind==="meds"?lookupMedType(id):null,fb:ce.fb?ce.fb.split(".")[0]+".":"",pri:ce.pri,type:kind==="tools"?"tool":"med",userSelected:!!cbSel[id],round:3,isCurveball:true});
        }
      });
    });
  }
  correctActions.sort(function(a,b){return((a.round||1)-(b.round||1))||((a.pri||99)-(b.pri||99));});
  useEffect(function(){if(stage!=="recovery")return;setRecStep(0);var iv=setInterval(function(){setRecStep(function(p){if(p>=correctActions.length)return p;return p+1;});},1200*t.revealMult);return function(){clearInterval(iv);};},[stage]);
  var trigCb=useCallback(function(){setShake(true);setTimeout(function(){setShake(false);},800);setVit(sc.curveball.vitals,sc.curveball&&sc.curveball.signs);setStage("cb-alert");setCbDone(true);},[sc]);
  useEffect(function(){
    if(stage!=="cb-wait")return;
    if(curveballState==="error"){setStage("reassess");return;}
    if(!cbDone&&sc.curveball){trigCb();return;}
    if(curveballState==="idle")usePlayerStore.getState().startCurveballGeneration();
    var to=setTimeout(function(){
      var st=usePlayerStore.getState();var live=st.activeScenario;
      if(live&&live.curveball){st.setShake(true);setTimeout(function(){st.setShake(false);},800);st.setVitals(live.curveball.vitals,live.curveball.signs);st.setCbDone(true);st.setStage("cb-alert");}
      else st.setStage("reassess");
    },30000);
    return function(){clearTimeout(to);};
  },[stage,curveballState,sc,cbDone]);
  var flag=function(id){if(!showFb)toggleFlag(id);};
  var submit=function(){
    // Per-item breakdown captured for debrief (no scoring). Vitals + labs are
    // the flag targets; signs are examine-only. Capillary refill is a
    // findings-only vital (hidden from the monitor per owner direction) — it is
    // NOT a flag target, so it is excluded here too: an unseeable value must
    // never count as "missed".
    var snapshotItems=[];
    if(ph.vitals){
      if(Array.isArray(ph.vitals)){
        for(var pvi=0;pvi<ph.vitals.length;pvi++){
          var pva=ph.vitals[pvi];if(!pva||typeof pva!=="object")continue;
          if(pva.id==="cap")continue;
          var pvCid=vitalCanonicalId(pva.id||"");
          snapshotItems.push({id:pvCid,label:pva.label||pva.id,bad:!!pva.bad,why:pva.why||"",userFlagged:!!flags[pvCid]});
        }
      }else if(typeof ph.vitals==="object"){
        Object.keys(ph.vitals).forEach(function(vk){
          if(vk==="cap")return;
          var v=ph.vitals[vk];if(!v||typeof v!=="object")return;
          var cid=vitalCanonicalId(vk);
          snapshotItems.push({id:cid,label:v.label||vk,bad:!!v.bad,why:v.why||"",userFlagged:!!flags[cid]});
        });
      }
    }
    if(Array.isArray(ph.labs)){
      ph.labs.forEach(function(l){
        if(!l)return;
        var cid=labCanonicalId(l);
        var lbl=(l.name||l.id||"")+(l.value?" "+l.value:"")+(l.unit?" "+l.unit:"");
        snapshotItems.push({id:cid,label:lbl,bad:!!l.bad,why:l.why||"",userFlagged:!!flags[cid]});
      });
    }
    recordAssess({phaseId:ph.id,phaseName:ph.name||ph.id,items:snapshotItems});
    setShowFb(true);};
  var afterA=function(){setFlags({});setShowFb(false);if(pi<sc.phases.length-1){var n=pi+1;setPi(n);setVit(sc.phases[n].vitals,sc.phases[n].signs);setStage("phase");}else setStage("debrief");};
  var afterAct=function(){
    if(ph&&ph.round===1&&isFullCase){setStage("interlude");return;}
    if(!cbDone&&sc.curveball){trigCb();return;}
    if(!cbDone&&sc._cbMode&&(curveballState==="generating"||curveballState==="idle")){setStage("cb-wait");return;}
    setStage("reassess");
  };
  var phActionIds=actionIds(ph&&ph.actions);
  var phaseHasIntervention=ph&&ph.actions&&(phActionIds.tools.length>0||phActionIds.meds.length>0);
  var isCb=stage.startsWith("cb");
  var curSigns=isCb?(sc.curveball?sc.curveball.signs:[]):(ph?ph.signs:[]);
  var curLabs=isCb?(sc.curveball?sc.curveball.labs||[]:[]):(ph?ph.labs||[]:[]);
  if(stage==="debrief")return <Debrief sc={sc} ageG={ageG} sexG={sexG} onDone={onDone} onExit={onExit}/>;
  var CSS=GOOGLE_FONTS_CSS+t.KEYFRAMES
    +"@keyframes bwShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px)}20%{transform:translateX(8px)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}}.bw-shake{animation:bwShake .6s ease-in-out}"
    +"@keyframes slideU{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.slu{animation:slideU .3s ease-out}"
    +"@keyframes bwCritPill{0%,100%{box-shadow:0 0 0 0 rgba("+t.CRIT_RGB+",0.35)}50%{box-shadow:0 0 0 10px rgba("+t.CRIT_RGB+",0)}}.alp{animation:bwCritPill 1.6s ease-in-out infinite}"
    +"@keyframes lazyPulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes lazyFade{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}.bw-lazy-pill{animation:lazyFade .35s ease-out}@keyframes bwspin{to{transform:rotate(360deg)}}"
    +".bw-tap{transition:transform .12s ease}.bw-tap:active{transform:scale(0.97)}"
    +".bw-split{display:flex;flex-direction:column;gap:12px}.bw-split-left,.bw-split-right{width:100%}"
    +"@media(min-width:768px){.bw-container{max-width:900px!important}.bw-split{flex-direction:row;gap:20px;align-items:flex-start}.bw-split-left{width:42%;position:sticky;top:16px;max-height:calc(100dvh - 80px);overflow-y:auto}.bw-split-right{width:58%;min-height:0}}";
  return(<div className={shake?"bw-shake":""} style={{minHeight:"100dvh",padding:16,background:t.BG_APP,color:t.COLOR.ink,fontFamily:t.FONT.body}}>
    <style>{CSS}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onExit} className="bw-tap" style={{color:t.COLOR.ink3,fontSize:12,background:"none",border:"none",cursor:"pointer",fontFamily:t.FONT.body,padding:"4px 2px"}}>Exit</button>
          {prev&&<button onClick={goBack} className="bw-tap" style={{color:t.COLOR.ink3,fontSize:12,background:t.COLOR.btnNeutralBg,border:"1px solid "+t.COLOR.hairline,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontFamily:t.FONT.body}}>&lt; Back</button>}
        </div>
        {isCb
          ?<span className="alp" style={t.chip("critical")}>Event</span>
          :<ChapterBar stage={stage} phaseIndex={pi}/>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",minWidth:1}}>
          {(dispatcherState==="warming-up"||dispatcherState==="background")&&<div className="bw-lazy-pill" style={Object.assign({},t.chip("accent"),{display:"inline-flex",alignItems:"center",gap:6})}>
            <span style={{width:6,height:6,borderRadius:"50%",background:t.COLOR.accent,animation:"lazyPulse 1.4s ease-in-out infinite",flexShrink:0}}></span>
            <span>Loading details</span>
          </div>}
        </div></div>
      {stage==="intro"&&(<div className="slu" style={{textAlign:"center"}}>
        <SceneStage sc={sc} height={300} style={{marginBottom:12}}/>
        <h2 style={{fontSize:24,fontWeight:600,fontFamily:t.FONT.display,marginTop:0,marginBottom:10,color:t.COLOR.ink}}>{sc.title}</h2>
        <div style={Object.assign({},t.surface("base"),{padding:t.SPACE.pad,marginBottom:12,textAlign:"left"})}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}>
            <div><span style={{color:t.COLOR.ink3}}>Age: </span><strong>{sc.patient.ageLabel}</strong></div>
            <div><span style={{color:t.COLOR.ink3}}>Wt: </span><strong>{sc.patient.weightKg+" kg"}</strong></div>
            <div><span style={{color:t.COLOR.ink3}}>Sex: </span><strong>{sc.patient.sex}</strong></div></div>
          <div style={{fontSize:13,marginBottom:8}}><span style={{color:t.COLOR.ink3}}>CC: </span><strong>{sc.patient.cc}</strong></div>
          <div style={Object.assign({},t.label(),{color:t.COLOR.boldTerm,marginTop:10,marginBottom:6})}>Report</div>
          <TextBlock text={sc.emsReport||(sc.presentation&&sc.presentation.report)||sc.patient.history} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
        </div>
        {sc.learnMore&&<button onClick={function(){setLearnOpen(true);}} className="bw-tap" style={{marginBottom:12,padding:"8px 16px",borderRadius:10,fontWeight:700,color:t.COLOR.boldTerm,fontSize:12,background:"rgba("+t.ACCENT_RGB+",0.10)",border:"1px solid rgba("+t.ACCENT_RGB+",0.35)",cursor:"pointer",fontFamily:t.FONT.body}}>Learn more</button>}
        {(function(){
          var aiGate=sc.source==="ai"&&dispatcherState!=="idle"&&dispatcherState!=="complete"&&!waveOneComplete;
          var hasAssess=phaseHasAssessables(ph);
          var label=aiGate?"Preparing this one…":(hasAssess?"Begin assessment":"Begin");
          var style=t.cta("primary");
          if(aiGate)style=Object.assign({},style,{opacity:0.6,cursor:"default"});
          return(<button disabled={aiGate} onClick={function(){if(aiGate)return;setStage(hasAssess?"assess":(phaseHasIntervention?"act":"phase"));}} style={style}>{label}</button>);
        })()}
        <Modal open={learnOpen} onClose={function(){setLearnOpen(false);}} title="Background" kicker="Learn more">
          <TextBlock text={sc.learnMore||""} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
        </Modal>
      </div>)}
      {stage==="phase"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <SceneStage sc={sc} height={260} style={{marginBottom:12}}/>
            <VitalsDisplay vitals={vit} ranges={chRanges} showRanges={true}/>
          </div>
          <div className="bw-split-right">
            <div style={Object.assign({},t.surface("base"),{padding:t.SPACE.pad,marginBottom:4})}>
              <div style={Object.assign({},t.label(),{color:t.COLOR.boldTerm,marginBottom:6})}>Update</div>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/></div>
            {phaseHasIntervention?(
              <button onClick={function(){setStage("act");}} style={Object.assign({},t.cta("primary"),{marginTop:12})}>Act on this</button>
            ):(
              <button onClick={function(){setStage("assess");}} style={Object.assign({},t.cta("primary"),{marginTop:12})}>Begin assessment</button>
            )}
          </div>
        </div></div>)}
      {stage==="assess"&&<AssessPanel ph={ph} vit={vit} curSigns={curSigns} curLabs={curLabs} flags={flags} showFb={showFb} submit={submit} afterA={afterA} flag={flag} patient={sc.patient} sc={sc} phaseIdx={pi} prevAssess={pi>=2&&sc.phases&&sc.phases[0]?sc.phases[0]:null}/>}
      {stage==="act"&&conseq&&(<ConsequenceBeat data={conseq.data} variant={conseq.variant} ranges={chRanges}
        onContinue={function(){if(conseq.insight)addInsightCard(conseq.insight);setConseq(null);afterAct();}}/>)}
      {stage==="act"&&!conseq&&(<div className="slu">
        <div style={{marginBottom:12}}>
          <PatientHeader patient={sc.patient}/>
          {ph&&ph.narrative&&<div style={Object.assign({},t.surface("base"),{marginTop:8,padding:"10px 12px"})}>
            <TextBlock text={ph.narrative} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.55}}/>
          </div>}
        </div>
        <div style={{margin:"0 2px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontFamily:t.FONT.display,fontSize:16,fontWeight:600,color:t.COLOR.ink,lineHeight:1.35}}>Build your plan.</div>
            <button className="bw-tap" onClick={function(){setPlanHelp(true);}} aria-label="How plans work"
              style={{width:22,height:22,borderRadius:11,display:"inline-flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid "+t.COLOR.hairline,color:t.COLOR.ink3,fontSize:12,fontWeight:700,cursor:"pointer",padding:0,flexShrink:0,fontFamily:t.FONT.body}}>?</button>
          </div>
          <div style={{fontSize:12,color:t.COLOR.ink3,marginTop:3}}>Tap an option to read it, add what fits, then commit — the readings will answer.</div>
        </div>
        {showPlanCoach&&<div style={{marginBottom:14}}>
          <CoachBubble tail="bottom-left" title="How plans work"
            body={"Exploring is free — tap any option to read what it does. Nothing is graded while you look.\n\n- **Add to plan** collects the steps you'd actually take.\n- **Commit plan** locks it in — then the readings answer your plan on the monitor.\n- You need at least one step to commit, and you can remove steps any time before that."}
            onDismiss={function(){dismissCoach("plan");setPlanHelp(false);}}/>
        </div>}
        <div className="bw-split">
          <div className="bw-split-left">
            <VitalsDisplay vitals={vit} ranges={chRanges} showRanges={true}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <ActionPanel tools={phActionIds.tools} meds={phActionIds.meds} actions={ph.actions} phaseIdx={pi} onDone={function(sel){
              recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:phActionIds.tools,meds:phActionIds.meds,actions:ph.actions||{},sel:sel||{}});
              var ins=phaseInsight(ph);if(ins)addInsightCard(ins);
              if(ph.consequence){
                var mistake=Object.keys(sel||{}).some(function(id){return sel[id]&&sel[id].ok===false;});
                var variant=mistake?"mistake":"good";
                var data=ph.consequence[variant]||ph.consequence.good;
                if(data&&data.vitals)setVit(data.vitals);
                setConseq({data:data,variant:variant,insight:ph.consequence.insight});
                return;
              }
              afterAct();
            }} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:ph.name||ph.id});}));recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:phActionIds.tools,meds:phActionIds.meds,actions:ph.actions||{},sel:sel||{}});var ins2=phaseInsight(ph);if(ins2)addInsightCard(ins2);afterAct();}}/>
          </div>
        </div></div>)}
      {stage==="interlude"&&(function(){
        var r2ready=round2State==="ready"&&sc.phases&&sc.phases.length>=4;
        var r2narr=r2ready&&sc.phases[2]?sc.phases[2].narrative:"";
        var choices=[];
        if(phase1&&phase1.actions){
          ["tools","meds"].forEach(function(kind){
            var coll=phase1.actions[kind]||{};
            Object.keys(coll).forEach(function(id){
              if(p1Sel[id]){
                var lbl=kind==="tools"?(isCustomTool(id)?(coll[id].label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(coll[id].label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
                choices.push(lbl);
              }
            });
          });
        }
        return(<div className="slu" style={{textAlign:"center"}}>
          <div style={{marginBottom:14}}><span style={t.chip("accent")}>Round 1 complete · time passes</span></div>
          <SceneStage sc={sc} height={240} style={{marginBottom:14}}/>
          {choices.length>0&&<div style={Object.assign({},t.surface("base"),{padding:t.SPACE.pad,marginBottom:12,textAlign:"left"})}>
            <div style={Object.assign({},t.label(),{marginBottom:6})}>What you did</div>
            <p style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.5,margin:0}}>{"In round 1 you chose: "+choices.join(", ")+"."}</p>
          </div>}
          {r2ready?
            <div style={Object.assign({},t.surface("base"),{padding:t.SPACE.pad,marginBottom:14,textAlign:"left"})}>
              <div style={Object.assign({},t.label(),{marginBottom:6})}>What's changed</div>
              <TextBlock text={r2narr} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
            </div>
            :round2State==="error"?
              (round2ErrorClass==="service"
                ?<div style={{borderRadius:14,padding:14,marginBottom:14,background:"rgba("+t.ATTN_RGB+",0.10)",border:"1px solid rgba("+t.ATTN_RGB+",0.35)",color:t.COLOR.attentionText,fontSize:13,lineHeight:1.5,textAlign:"left"}}>
                  The service that prepares the next round is busy right now — not your fault, and retrying immediately won't speed it up. It usually passes on its own.
                  <button onClick={function(){usePlayerStore.getState().startRound2Generation();}} style={{display:"block",marginTop:10,background:"none",border:"1px solid rgba("+t.ATTN_RGB+",0.5)",borderRadius:8,color:t.COLOR.attentionText,padding:"6px 12px",cursor:"pointer",fontFamily:t.FONT.body,fontSize:12}}>Check again in a bit</button>
                </div>
                :<div style={{borderRadius:14,padding:14,marginBottom:14,background:"rgba("+t.ATTN_RGB+",0.10)",border:"1px solid rgba("+t.ATTN_RGB+",0.35)",color:t.COLOR.attentionText,fontSize:13,lineHeight:1.5,textAlign:"left"}}>
                  The next round came back malformed — that's on the build, not on you. A fresh attempt usually fixes it.
                  <button onClick={function(){usePlayerStore.getState().startRound2Generation();}} style={{display:"block",marginTop:10,background:"none",border:"1px solid rgba("+t.ATTN_RGB+",0.5)",borderRadius:8,color:t.COLOR.attentionText,padding:"6px 12px",cursor:"pointer",fontFamily:t.FONT.body,fontSize:12}}>Try again</button>
                </div>)
              :<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 0",marginBottom:14,color:t.COLOR.ink3,fontSize:13}}>
                <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba("+t.ACCENT_RGB+",0.3)",borderTopColor:t.COLOR.accent,display:"inline-block",animation:"bwspin 0.8s linear infinite"}}></span>
                Watching how things evolve…
              </div>}
          <button disabled={!r2ready} onClick={function(){if(!r2ready)return;setFlags({});setShowFb(false);setPi(2);setVit(sc.phases[2].vitals,sc.phases[2].signs);setStage("assess");}} style={r2ready?t.cta("primary"):Object.assign({},t.cta("primary"),{opacity:0.55,cursor:"default"})}>{r2ready?"Continue to round 2":"Still evolving…"}</button>
        </div>);
      })()}
      {stage==="cb-wait"&&(<div className="slu" style={{textAlign:"center"}}>
        <div className="alp" style={{display:"inline-block",marginBottom:16}}><span style={t.chip("critical")}>Something is changing</span></div>
        <SceneStage sc={sc} height={240} style={{marginBottom:16}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,color:t.COLOR.ink2,fontSize:13}}>
          <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba("+t.CRIT_RGB+",0.3)",borderTopColor:t.COLOR.critical,display:"inline-block",animation:"bwspin 0.8s linear infinite"}}></span>
          Stay with it — watching the readings…
        </div>
      </div>)}
      {stage==="cb-alert"&&(<div className="slu">
        <div style={{textAlign:"center",marginBottom:12}}><span className="alp" style={t.chip("critical")}>Unexpected event</span></div>
        <div className="bw-split">
          <div className="bw-split-left">
            <SceneStage sc={sc} height={260} style={{marginBottom:12}}/>
            <VitalsDisplay vitals={vit} flash={true} ranges={chRanges} showRanges={true}/>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:t.RADIUS.lg,padding:t.SPACE.pad,background:"rgba("+t.CRIT_RGB+",0.08)",border:"1px solid rgba("+t.CRIT_RGB+",0.25)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.5}}/></div>
            <button onClick={function(){setStage("cb-act");}} style={Object.assign({},t.cta("critical"),{marginTop:12})}>What do you do?</button>
          </div>
        </div></div>)}
      {stage==="cb-act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <VitalsDisplay vitals={vit} flash={true} ranges={chRanges} showRanges={true}/>
            <LabPanel labs={curLabs}/>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:t.RADIUS.lg,padding:t.SPACE.pad,background:"rgba("+t.CRIT_RGB+",0.08)",border:"1px solid rgba("+t.CRIT_RGB+",0.25)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba("+t.CRIT_RGB+",0.2)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:t.COLOR.critical,marginTop:0,marginBottom:4,fontFamily:t.FONT.display}}>Focused response</p>
                <p style={{fontSize:11,color:t.COLOR.ink3,margin:0}}>One clear action resolves this. Find it.</p></div></div>
            {(function(){
              var cbIds=actionIds(sc.curveball&&sc.curveball.actions);
              return(<ActionPanel tools={cbIds.tools} meds={cbIds.meds} actions={sc.curveball.actions} phaseIdx="curveball" onDone={function(sel){recordAction({phaseId:"curveball",phaseName:"Event: "+(sc.curveball.name||""),tools:cbIds.tools,meds:cbIds.meds,actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:"Event: "+(sc.curveball.name||"")});}));recordAction({phaseId:"curveball",phaseName:"Event: "+(sc.curveball.name||""),tools:cbIds.tools,meds:cbIds.meds,actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}}/>);
            })()}
          </div>
        </div></div>)}
      {stage==="reassess"&&(function(){
        var re=sc.reassessment;
        var reVitals=re&&re.vitals?re.vitals:vit;
        var reSigns=re&&re.signs?re.signs:[];
        var reNarrative=re&&re.narrative?re.narrative:"Things have settled following your plan. The readings are trending home.";
        return(<div className="slu">
          <div style={{textAlign:"center",marginBottom:12}}>
            <span style={t.chip("positive")}>Re-check</span>
          </div>
          <SceneStage sc={sc} height={260} style={{marginBottom:16}}/>
          <div style={Object.assign({},t.surface("base"),{padding:t.SPACE.pad,marginBottom:12})}>
            <TextBlock text={replaceIdsWithLabels(reNarrative)} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
          </div>
          <div style={{maxWidth:400,margin:"0 auto 12px"}}>
            <VitalsDisplay vitals={reVitals} ranges={chRanges} showRanges={true}/>
          </div>
          {reSigns.length>0&&<div style={{maxWidth:400,margin:"0 auto"}}><BodySystemsView signs={reSigns}/></div>}
          <button onClick={function(){setStage("recovery");}} style={Object.assign({},t.cta("positive"),{marginTop:12})}>Continue</button>
        </div>);
      })()}
      {stage==="recovery"&&(function(){
        var allRevealed=recStep>=correctActions.length;
        return(<div className="slu" style={{textAlign:"center"}}>
          <style>{"@keyframes bwConfetti{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(360deg)}}.bw-confetti{animation:bwConfetti 2s ease-out both}@keyframes valuesNorm{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}.bw-vn{animation:valuesNorm .5s ease-out both}"}</style>
          <div style={{marginBottom:20}}>
            <SceneStage sc={sc} height={280}/>
            <div style={{position:"relative",height:40,overflow:"hidden",marginTop:-6}}>
              {[<Sparkles/>,<Star/>,<Trophy/>,<Zap/>,<Shield/>,<Sparkles/>].map(function(e,i){return(<span key={i} className="bw-confetti" style={{position:"absolute",left:(10+i*15)+"%",color:i%2===0?t.COLOR.attention:t.COLOR.accent,animationDelay:(i*0.15)+"s"}}>{e}</span>);})}
            </div>
          </div>
          <h2 style={{fontSize:26,fontWeight:600,fontFamily:t.FONT.display,color:t.COLOR.positive,marginTop:0,marginBottom:4}}>Steady again.</h2>
          <p style={{fontSize:14,color:t.COLOR.ink2,marginBottom:20}}>Your plan worked. Here's how things responded:</p>
          <div className="bw-vn" style={{display:"inline-flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {(function(){
              var re=sc.reassessment&&sc.reassessment.vitals;
              var hrV=re?re.hr:(sc.norms?Math.round((sc.norms.hr[0]+sc.norms.hr[1])/2):"--");
              var spV=re?re.spo2+"%":(sc.norms?"99%":"--");
              var bpV;
              if(re&&re.bp!==undefined&&re.bp!==null&&re.bp!==""){bpV=re.bp;}
              else if(re&&re.sbp!==undefined&&re.dbp!==undefined){bpV=re.sbp+"/"+re.dbp;}
              else if(sc.norms&&Array.isArray(sc.norms.sbp)&&Array.isArray(sc.norms.dbp)){bpV=Math.round((sc.norms.sbp[0]+sc.norms.sbp[1])/2)+"/"+Math.round((sc.norms.dbp[0]+sc.norms.dbp[1])/2);}
              else{bpV="--";}
              var tempV=re?(typeof re.temp==="number"?re.temp.toFixed(1)+"°C":re.temp+"°C"):"37.0°C";
              return [{l:"HR",v:hrV},{l:"SpO₂",v:spV},{l:"BP",v:bpV},{l:"Temp",v:tempV}].map(function(vi,i){return(<div key={i} className="bw-vn" style={{animationDelay:(0.2+i*0.15*t.revealMult)+"s",padding:"8px 14px",borderRadius:t.RADIUS.md,background:"rgba("+t.POS_RGB+",0.10)",border:"1px solid rgba("+t.POS_RGB+",0.30)"}}>
                <div style={t.label()}>{vi.l}</div>
                <div style={{fontSize:18,fontWeight:700,color:t.COLOR.ink,fontFamily:t.FONT.mono}}>{vi.v}</div>
              </div>);});
            })()}
          </div>
          <div style={{textAlign:"left",maxWidth:400,margin:"0 auto",marginBottom:20}}>
            <p style={Object.assign({},t.label(),{color:t.COLOR.boldTerm,marginBottom:10})}>What made the difference</p>
            {correctActions.map(function(act,i){
              var visible=i<recStep;
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,opacity:visible?1:0.15,transform:visible?"translateX(0)":"translateX(-10px)",transition:"all 0.4s ease-out"}}>
                <div style={{flexShrink:0,width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba("+t.ACCENT_RGB+",0.12)",border:"1px solid rgba("+t.ACCENT_RGB+",0.30)"}}>{act.type==="tool"?ToolIcon({name:act.toolId,size:20,color:t.COLOR.accent}):MedIcon({type:act.medType||"iv",size:20,color:t.COLOR.accent})}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.COLOR.ink}}>{act.name}{act.isCurveball&&<span style={Object.assign({},t.chip("critical"),{marginLeft:6,fontSize:9,padding:"1px 6px",verticalAlign:"middle"})}>Event</span>}</div>
                  {visible&&act.fb&&<p style={{fontSize:11,color:t.COLOR.ink3,marginTop:2,marginBottom:0,lineHeight:1.4}}>{act.fb}</p>}
                </div>
                {visible&&<div style={{flexShrink:0,marginTop:2}}>{act.userSelected?<Check size={18} color={t.COLOR.positive} style={{opacity:0.9}}/>:<Circle size={18} color={t.COLOR.ink3} style={{opacity:0.5}}/>}</div>}
              </div>);
            })}
          </div>
          {allRevealed&&<div className="bw-vn" style={{marginBottom:16}}>
            {sc.stabilizationSummary?<div style={Object.assign({},t.surface("base"),{maxWidth:440,margin:"0 auto 12px",padding:t.SPACE.pad,textAlign:"left"})}>
              <TextBlock text={replaceIdsWithLabels(sc.stabilizationSummary)} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
            </div>:<p style={{fontSize:13,color:t.COLOR.positiveText,fontWeight:700,marginBottom:12}}>All steps complete. Resting easy.</p>}
            <button onClick={function(){setStage("debrief");}} style={Object.assign({},t.cta("positive"),{maxWidth:300,margin:"0 auto"})}>Continue to debrief</button>
          </div>}
        </div>);
      })()}
      <ReviewTray/>
      <ScenePopup sc={sc}/>
    </div></div>);
}
