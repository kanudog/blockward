import { useState, useEffect, useCallback } from "react";
import { Heart, Zap, Sparkles, Star, Trophy, Shield, Check, Circle } from "lucide-react";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../../lib/scenarios/packs/index.js";
import { medType as lookupMedType } from "../../lib/scenarios/visualMeta.js";
import { vitalCanonicalId, signCanonicalId, labCanonicalId } from "../../lib/scenarios/canonicalize.js";

// Phase-5.4.3a: a phase has assessable items if any typed collection
// is non-empty. Replaces the legacy ph.assessItems.length check.
// Phase 6.1: vitals is now an array under schema 5.4.1, but the
// helper stays defensive about object shape for any non-migrated
// caller (the count produced is the same either way).
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

// Phase 6.1: derive the tool/med id arrays from the actions map.
// Schema 5.4.1 no longer carries top-level phase.tools[]/phase.meds[]
// — they're computed from Object.keys(actions.tools/meds) where the
// player needs them (currently: rendering ActionPanel tiles).
function actionIds(actions){
  return{
    tools:actions&&actions.tools?Object.keys(actions.tools):[],
    meds:actions&&actions.meds?Object.keys(actions.meds):[]
  };
}

// Phase 6.1: lookup helper for code paths that need a single vital by
// id (e.g., submit snapshotting). Tolerates the legacy object shape
// defensively — should not be reached post-migration but keeps the
// player robust against an unexpected raw input.
function findVital(phase,id){
  if(!phase||!phase.vitals)return null;
  if(Array.isArray(phase.vitals)){
    for(var i=0;i<phase.vitals.length;i++){
      if(phase.vitals[i]&&phase.vitals[i].id===id)return phase.vitals[i];
    }
    return null;
  }
  return phase.vitals[id]||null;
}
import { usePlayerStore } from "../../stores/playerStore.js";
import { guessAge, guessSex } from "../../lib/scenarios/age.js";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { PatientSVG } from "./PatientSVG.jsx";
import { PatientView } from "./PatientView.jsx";
import { BodySystemsView } from "./BodySystemsView.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { AssessPanel } from "./AssessPanel.jsx";
import { PatientHeader } from "./PatientHeader.jsx";
import { Debrief } from "./Debrief.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { Modal } from "../shared/Modal.jsx";
import { ToolIcon, MedIcon } from "./icons.jsx";
import { replaceIdsWithLabels } from "../../lib/scenarios/labels.js";

export function ScenarioPlayer(props){
  var sc=props.sc;var onExit=props.onExit;var onDone=props.onDone;
  var ageG=guessAge(sc);var sexG=guessSex(sc);var scVisuals=sc.visuals||[];var pSeed=sc.patient?sc.patient.name:"";
  var stage=usePlayerStore(function(s){return s.stage;});var pi=usePlayerStore(function(s){return s.phaseIndex;});var flags=usePlayerStore(function(s){return s.flags;});var showFb=usePlayerStore(function(s){return s.showFb;});var cbDone=usePlayerStore(function(s){return s.cbDone;});var shake=usePlayerStore(function(s){return s.shake;});var vit=usePlayerStore(function(s){return s.vitals;});
  var _ps=usePlayerStore.getState();var setStage=_ps.setStage;var setPi=_ps.setPhaseIndex;var setFlags=_ps.setFlags;var toggleFlag=_ps.toggleFlag;var setShowFb=_ps.setShowFb;var setCbDone=_ps.setCbDone;var setShake=_ps.setShake;var setVit=_ps.setVitals;var addSkipped=_ps.addSkipped;var recordAssess=_ps.recordAssess;var recordAction=_ps.recordAction;
  function prevStageFor(s){if(s==="phase")return"intro";if(s==="assess")return"intro";if(s==="act")return"phase";if(s==="cb-alert")return"act";if(s==="cb-act")return"cb-alert";if(s==="reassess")return null;return null;}
  var prev=prevStageFor(stage);
  // Phase 6.3: the interlude and Round 2 are forward-only — no back-navigation
  // across the Round 1 -> Round 2 boundary.
  if(stage==="interlude"||pi>=2)prev=null;
  var goBack=function(){if(prev)setStage(prev);};
  var _recStep=useState(0);var recStep=_recStep[0];var setRecStep=_recStep[1];
  var _learnOpen=useState(false);var learnOpen=_learnOpen[0];var setLearnOpen=_learnOpen[1];
  // Phase 6.0: wave dispatcher state, read for the header loading pill
  // and the Assess-button gate. The dispatcher itself is started from
  // the mount-time useEffect below — it owns the controller, persistence,
  // and re-render plumbing internally via playerStore.
  var dispatcherState=usePlayerStore(function(s){return s.dispatcherState;});
  var waveOneComplete=usePlayerStore(function(s){return s.waveOneComplete;});
  // Phase 6.3 (Stage 2): background Round-2 generation state; the interlude
  // gates the Round-2 entry on "ready".
  var round2State=usePlayerStore(function(s){return s.round2State;});
  // Phase 6.3 (Stage 3): background curveball generation state; afterAct uses
  // it to decide between firing the curveball, holding on the alarm bridge, or
  // skipping to reassess.
  var curveballState=usePlayerStore(function(s){return s.curveballState;});
  // Phase 6.0: fire the wave dispatcher once per scenario mount. Replay
  // of an already-populated scenario short-circuits inside startDispatcher
  // via dispatcherShouldRun. Abort happens via playerStore.start when the
  // user navigates to a different scenario.
  useEffect(function(){
    if(!sc)return;
    usePlayerStore.getState().startDispatcher();
    // Phase 6.3: a full case generates Round 2 in the background during
    // Round 1 play; quick cases / replays short-circuit inside the action.
    usePlayerStore.getState().startRound2Generation();
    // Phase 6.3 (Stage 3): re-entrant curveball kick. On a fresh mount Round 2
    // isn't merged yet so this no-ops (startRound2Generation chains it once R2
    // lands); on a reload where Round 2 is already merged but the curveball
    // didn't finish, this resumes it.
    usePlayerStore.getState().startCurveballGeneration();
  },[sc&&sc.id]);
  var ph=sc.phases[pi];
  // Phase 6.3: a full case has (or will have) a Round 2. Drives the interlude
  // transition after the Round 1 intervene phase.
  var isFullCase=!!(sc._pendingRound2||(sc.phases&&sc.phases.length>=4));
  /* Phase 6.2b.5: "What Saved This Patient" list. Pull only Phase 1
     (intervene) actions with priority "tied-correct" — the must-haves.
     Curveball is excluded (curveball machinery is dormant in the
     orchestrator pipeline). For each must-have, mark whether the user
     selected it during Phase 1 by looking up the action-history snapshot
     for that phase. Must be at top level for hook rules. */
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
  // Phase 6.3: must-haves span every intervene phase (Round 1 + Round 2).
  function _selForPhase(history,phase){
    if(!Array.isArray(history)||!phase)return{};
    var pid=phase.id||phase.stageType;
    for(var hi=0;hi<history.length;hi++){var snap=history[hi];if(snap&&snap.phaseId===pid)return snap.sel||{};}
    return{};
  }
  var correctActions=[];
  (sc.phases||[]).forEach(function(phx){
    if(!phx||phx.stageType!=="intervene"||!phx.actions)return;
    var sel=_selForPhase(actionHistoryForRecovery,phx);
    ["tools","meds"].forEach(function(kind){
      var coll=phx.actions[kind]||{};
      Object.keys(coll).forEach(function(id){
        var e=coll[id];
        if(e&&e.priority==="tied-correct"){
          var label=kind==="tools"?(isCustomTool(id)?(e.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(e.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
          correctActions.push({
            name:label,
            toolId:kind==="tools"?id:null,
            medType:kind==="meds"?lookupMedType(id):null,
            fb:e.fb?e.fb.split(".")[0]+".":"",
            pri:e.pri,
            type:kind==="tools"?"tool":"med",
            userSelected:!!sel[id],
            round:phx.round||1
          });
        }
      });
    });
  });
  // Phase 6.3 (Stage 3): the curveball's must-haves also "saved this patient".
  // It lives on sc.curveball (not phases[]); tag round 3 so it sorts after both
  // intervene rounds and flag isCurveball for the recovery-list badge.
  if(sc.curveball&&sc.curveball.actions){
    var cbSel=_selForPhase(actionHistoryForRecovery,{id:"curveball"});
    ["tools","meds"].forEach(function(kind){
      var cbColl=sc.curveball.actions[kind]||{};
      Object.keys(cbColl).forEach(function(id){
        var ce=cbColl[id];
        if(ce&&ce.priority==="tied-correct"){
          var clabel=kind==="tools"?(isCustomTool(id)?(ce.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id)):(isCustomMed(id)?(ce.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id));
          correctActions.push({
            name:clabel,
            toolId:kind==="tools"?id:null,
            medType:kind==="meds"?lookupMedType(id):null,
            fb:ce.fb?ce.fb.split(".")[0]+".":"",
            pri:ce.pri,
            type:kind==="tools"?"tool":"med",
            userSelected:!!cbSel[id],
            round:3,
            isCurveball:true
          });
        }
      });
    });
  }
  correctActions.sort(function(a,b){return((a.round||1)-(b.round||1))||((a.pri||99)-(b.pri||99));});
  useEffect(function(){if(stage!=="recovery")return;setRecStep(0);var iv=setInterval(function(){setRecStep(function(p){if(p>=correctActions.length)return p;return p+1;});},1200);return function(){clearInterval(iv);};},[stage]);
  var pSt=function(){if(stage.startsWith("cb"))return"critical";if(pi>=1||stage==="act")return"declining";return"stable";};
  var trigCb=useCallback(function(){setShake(true);setTimeout(function(){setShake(false);},800);setVit(sc.curveball.vitals,sc.curveball&&sc.curveball.signs);setStage("cb-alert");setCbDone(true);},[sc]);
  // Phase 6.3 (Stage 3): advance the "monitor alarming" bridge. While on
  // cb-wait, fire the curveball the instant it lands (sc updates with
  // activeScenario), skip to reassess if generation errored, and never strand
  // the learner — a safety timeout moves on if it can't land in time.
  useEffect(function(){
    if(stage!=="cb-wait")return;
    if(curveballState==="error"){setStage("reassess");return;}
    if(!cbDone&&sc.curveball){trigCb();return;}
    // If generation hasn't even kicked yet (idle — the post-R2 chain hasn't
    // fired because the learner outran the R2 slot-fill), start it now.
    if(curveballState==="idle")usePlayerStore.getState().startCurveballGeneration();
    var t=setTimeout(function(){
      var st=usePlayerStore.getState();var live=st.activeScenario;
      if(live&&live.curveball){st.setShake(true);setTimeout(function(){st.setShake(false);},800);st.setVitals(live.curveball.vitals,live.curveball.signs);st.setCbDone(true);st.setStage("cb-alert");}
      else st.setStage("reassess");
    },30000);
    return function(){clearTimeout(t);};
  },[stage,curveballState,sc,cbDone]);
  var flag=function(id){if(!showFb)toggleFlag(id);};
  var submit=function(){
    // Phase-4a: scoring removed. Per-item breakdown still captured for debrief.
    // Phase-5.4.3a: snapshot items come from typed collections directly.
    var snapshotItems=[];
    if(ph.vitals){
      // Phase 6.1: vitals is an array under schema 5.4.1; object shape
      // kept as a defensive fallback (should not occur post-migration).
      if(Array.isArray(ph.vitals)){
        for(var pvi=0;pvi<ph.vitals.length;pvi++){
          var pva=ph.vitals[pvi];if(!pva||typeof pva!=="object")continue;
          var pvCid=vitalCanonicalId(pva.id||"");
          snapshotItems.push({id:pvCid,label:pva.label||pva.id,bad:!!pva.bad,why:pva.why||"",userFlagged:!!flags[pvCid]});
        }
      }else if(typeof ph.vitals==="object"){
        Object.keys(ph.vitals).forEach(function(vk){
          var v=ph.vitals[vk];if(!v||typeof v!=="object")return;
          var cid=vitalCanonicalId(vk);
          snapshotItems.push({id:cid,label:v.label||vk,bad:!!v.bad,why:v.why||"",userFlagged:!!flags[cid]});
        });
      }
    }
    if(Array.isArray(ph.signs)){
      ph.signs.forEach(function(s){
        if(!s)return;
        var cid=signCanonicalId(s);
        snapshotItems.push({id:cid,label:s.label||s.id||"",bad:!!s.bad,why:s.why||"",userFlagged:!!flags[cid]});
      });
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
    // Phase 6.3: after Round 1's intervene in a full case, go to the interlude
    // (then Round 2). After the final intervene, fire the curveball if present.
    if(ph&&ph.round===1&&isFullCase){setStage("interlude");return;}
    if(!cbDone&&sc.curveball){trigCb();return;}
    // Phase 6.3 (Stage 3): curveball mode is ON but the background curveball
    // hasn't landed yet — hold on a brief "monitor alarming" bridge that
    // advances the instant it's ready (or skips to reassess if it errored).
    if(!cbDone&&sc._cbMode&&(curveballState==="generating"||curveballState==="idle")){setStage("cb-wait");return;}
    setStage("reassess");
  };
  // Phase 6.1: derive tool/med id arrays from actions for ActionPanel
  // and intervention gating; phase.tools[]/phase.meds[] are no longer
  // present after migration.
  var phActionIds=actionIds(ph&&ph.actions);
  var phaseHasIntervention=ph&&ph.actions&&(phActionIds.tools.length>0||phActionIds.meds.length>0);
  var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
  var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";var RD="linear-gradient(135deg,#FF4757,#c0392b)";var PP="linear-gradient(135deg,#a55eea,#8854d0)";
  var isCb=stage.startsWith("cb");
  var curSigns=isCb?(sc.curveball?sc.curveball.signs:[]):(ph?ph.signs:[]);
  var curLabs=isCb?(sc.curveball?sc.curveball.labs||[]:[]):(ph?ph.labs||[]:[]);
  if(stage==="debrief")return <Debrief sc={sc} ageG={ageG} sexG={sexG} onDone={onDone} onExit={onExit}/>;
  return(<div className={shake?"bw-shake":""} style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}>
    <style>{"@keyframes bwShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px)}20%{transform:translateX(8px)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}}.bw-shake{animation:bwShake .6s ease-in-out}@keyframes slideU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.slu{animation:slideU .4s ease-out}@keyframes alertP{0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,.4)}50%{box-shadow:0 0 0 12px rgba(255,71,87,0)}}.alp{animation:alertP 1.5s infinite}@keyframes fadeCard{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes lazyPulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes lazyFade{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}.bw-lazy-pill{animation:lazyFade .35s ease-out}.bw-split{display:flex;flex-direction:column;gap:12px}.bw-split-left,.bw-split-right{width:100%}@media(min-width:768px){.bw-container{max-width:900px!important}.bw-split{flex-direction:row;gap:20px;align-items:flex-start}.bw-split-left{width:42%;position:sticky;top:16px;max-height:calc(100dvh - 80px);overflow-y:auto}.bw-split-right{width:58%;min-height:0}}"}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onExit} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer"}}>X Exit</button>
          {prev&&<button onClick={goBack} style={{color:"#888",fontSize:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>&lt; Back</button>}
        </div>
        <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:isCb?"rgba(255,71,87,0.2)":"rgba(78,205,196,0.15)",color:isCb?"#FF6B81":"#4ECDC4"}}>{isCb?"CURVEBALL":"Phase "+(pi+1)+"/"+sc.phases.length}</div>
        {/* Phase-5.3 sub-step D: subtle loading pill that appears while
            lazy explanation fetch is in flight on Phase 2+ entry. Sits
            in the right slot of the header row without expanding height
            or shifting the phase badge. Fades in/out smoothly. */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",minWidth:1}}>
          {(dispatcherState==="warming-up"||dispatcherState==="background")&&<div className="bw-lazy-pill" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(78,205,196,0.10)",color:"#4ECDC4",border:"1px solid rgba(78,205,196,0.28)"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#4ECDC4",animation:"lazyPulse 1.4s ease-in-out infinite",flexShrink:0}}></span>
            <span>Loading details</span>
          </div>}
        </div></div>
      {stage==="intro"&&(<div className="slu" style={{textAlign:"center"}}>
        <PatientView status="stable" rr={30} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad" seed={pSeed}/>
        <h2 style={{fontSize:24,fontWeight:900,marginTop:12,marginBottom:8}}>{sc.title}</h2>
        <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:12,textAlign:"left"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}>
            <div><span style={{color:"#999"}}>Age: </span><strong>{sc.patient.ageLabel}</strong></div>
            <div><span style={{color:"#999"}}>Weight: </span><strong>{sc.patient.weightKg+" kg"}</strong></div>
            <div><span style={{color:"#999"}}>Sex: </span><strong>{sc.patient.sex}</strong></div></div>
          <div style={{fontSize:13,marginBottom:8}}><span style={{color:"#999"}}>CC: </span><strong>{sc.patient.cc}</strong></div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:"#4ECDC4",fontWeight:700,marginTop:10,marginBottom:6}}>Report</div>
          <TextBlock text={sc.emsReport||sc.patient.history} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
        </div>
        {sc.learnMore&&<button onClick={function(){setLearnOpen(true);}} style={{marginBottom:12,padding:"8px 16px",borderRadius:10,fontWeight:700,color:"#74b9ff",fontSize:12,background:"rgba(116,185,255,0.1)",border:"1px solid rgba(116,185,255,0.3)",cursor:"pointer"}}>Learn More</button>}
        {(function(){
          // Phase 6.0: gate the entry-point button on wave 1 of the
          // dispatcher for AI scenarios. Built-ins skip the gate
          // (their slots are pre-populated). The gate is active while
          // the dispatcher is warming up or in early background and
          // wave 1 hasn't yet flipped the flag.
          var aiGate=sc.source==="ai"&&dispatcherState!=="idle"&&dispatcherState!=="complete"&&!waveOneComplete;
          var hasAssess=phaseHasAssessables(ph);
          var label=aiGate?"Loading details...":(hasAssess?"Assess":"Begin Intervention");
          var style=Object.assign({},BS,{background:GR});
          if(aiGate)style=Object.assign({},style,{opacity:0.6,cursor:"default"});
          return(<button disabled={aiGate} onClick={function(){if(aiGate)return;setStage(hasAssess?"assess":(phaseHasIntervention?"act":"phase"));}} style={style}>{label}</button>);
        })()}
        <Modal open={learnOpen} onClose={function(){setLearnOpen(false);}} title="Background" accent="#74b9ff">
          <TextBlock text={sc.learnMore||""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
        </Modal>
      </div>)}
      {stage==="phase"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status={pSt()} rr={vit.rr&&typeof vit.rr==="object"?parseFloat(vit.rr.value)||0:vit.rr} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad" seed={pSeed}/>
            <div style={{marginTop:12}}><VitalsDisplay vitals={vit}/></div>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:"#4ECDC4",fontWeight:700,marginBottom:6}}>Update</div>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/></div>
            {phaseHasIntervention?(
              <button onClick={function(){setStage("act");}} style={Object.assign({},BS,{background:GR})}>Begin Intervention</button>
            ):(
              <button onClick={function(){setStage("assess");}} style={Object.assign({},BS,{background:GR})}>Assess</button>
            )}
          </div>
        </div></div>)}
      {stage==="assess"&&<AssessPanel ph={ph} vit={vit} curSigns={curSigns} curLabs={curLabs} flags={flags} showFb={showFb} submit={submit} afterA={afterA} flag={flag} patient={sc.patient} ageGroup={ageG} sex={sexG} visuals={scVisuals} seed={pSeed} status={pSt()} phaseIdx={pi}/>}
      {stage==="act"&&(<div className="slu">
        {/* Phase-3.0 change 2: patient header + narrative anchored at
            top of Phase 2, mirroring change 1 on Phase 1. The right-
            column glass card now holds only the "Intervention Time"
            sub-header above the action panel. */}
        <div style={{marginBottom:12}}>
          <PatientHeader patient={sc.patient}/>
          {ph&&ph.narrative&&<div style={{marginTop:8,padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <TextBlock text={ph.narrative} style={{fontSize:13,color:"#ddd",lineHeight:1.55}}/>
          </div>}
        </div>
        <div className="bw-split">
          <div className="bw-split-left">
            <VitalsDisplay vitals={vit}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12,marginBottom:8}}>
              <p style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginTop:0,marginBottom:4}}>Intervention Time</p>
              <p style={{fontSize:11,color:"#bbb",margin:0}}>Tap each tool and med. Find all correct actions to continue.</p>
            </div>
            <ActionPanel tools={phActionIds.tools} meds={phActionIds.meds} actions={ph.actions} phaseIdx={pi} onDone={function(sel){recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:phActionIds.tools,meds:phActionIds.meds,actions:ph.actions||{},sel:sel||{}});afterAct();}} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:ph.name||ph.id});}));recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:phActionIds.tools,meds:phActionIds.meds,actions:ph.actions||{},sel:sel||{}});afterAct();}}/>
          </div>
        </div></div>)}
      {stage==="interlude"&&(function(){
        var r2ready=round2State==="ready"&&sc.phases&&sc.phases.length>=4;
        var r2narr=r2ready&&sc.phases[2]?sc.phases[2].narrative:"";
        // What the user actually did in Round 1 (client-side, no regeneration).
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
          <style>{"@keyframes bwspin{to{transform:rotate(360deg)}}"}</style>
          <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",background:"rgba(165,94,234,0.15)",color:"#a55eea",border:"1px solid rgba(165,94,234,0.35)",marginBottom:14}}>Round 1 Complete · Time Passes</div>
          <div style={{maxWidth:180,margin:"0 auto 14px"}}>
            <PatientSVG status="declining" rr={vit.rr&&typeof vit.rr==="object"?parseFloat(vit.rr.value)||20:(vit.rr||20)} ageGroup={ageG} sex={sexG} emotion="sad" seed={pSeed} visuals={scVisuals}/>
          </div>
          {choices.length>0&&<div className="bw-glass" style={{borderRadius:14,padding:12,marginBottom:12,textAlign:"left"}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:"#a55eea",fontWeight:700,marginBottom:6}}>What you did</div>
            <p style={{fontSize:13,color:"#ddd",lineHeight:1.5,margin:0}}>{"In Round 1 you chose: "+choices.join(", ")+"."}</p>
          </div>}
          {r2ready?
            <div className="bw-glass" style={{borderRadius:16,padding:14,marginBottom:14,textAlign:"left"}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:"#a55eea",fontWeight:700,marginBottom:6}}>How the patient has changed</div>
              <TextBlock text={r2narr} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
            </div>
            :round2State==="error"?
              <div style={{borderRadius:14,padding:14,marginBottom:14,background:"rgba(255,71,87,0.1)",border:"1px solid rgba(255,71,87,0.3)",color:"#FF6B81",fontSize:13}}>Round 2 couldn't be generated. <button onClick={function(){usePlayerStore.getState().startRound2Generation();}} style={{marginLeft:6,background:"none",border:"1px solid rgba(255,107,129,0.5)",borderRadius:8,color:"#FF6B81",padding:"3px 10px",cursor:"pointer"}}>Retry</button></div>
              :<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 0",marginBottom:14,color:"#a55eea",fontSize:13}}>
                <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(165,94,234,0.3)",borderTopColor:"#a55eea",display:"inline-block",animation:"bwspin 0.8s linear infinite"}}></span>
                Re-evaluating the patient as the case evolves…
              </div>}
          <button disabled={!r2ready} onClick={function(){if(!r2ready)return;setFlags({});setShowFb(false);setPi(2);setVit(sc.phases[2].vitals,sc.phases[2].signs);setStage("assess");}} style={Object.assign({},BS,{background:r2ready?PP:"rgba(255,255,255,0.12)",opacity:r2ready?1:0.55,cursor:r2ready?"pointer":"default"})}>{r2ready?"Continue to Round 2":"Patient evolving…"}</button>
        </div>);
      })()}
      {stage==="cb-wait"&&(<div className="slu" style={{textAlign:"center"}}>
        <style>{"@keyframes bwspin{to{transform:rotate(360deg)}}"}</style>
        <div className="alp" style={{display:"inline-block",padding:"8px 16px",borderRadius:20,fontWeight:900,color:"white",fontSize:13,background:"#FF4757",marginBottom:16}}>MONITOR ALARMING</div>
        <div style={{maxWidth:180,margin:"0 auto 16px"}}>
          <PatientSVG status="critical" rr={vit&&vit.rr&&typeof vit.rr==="object"?parseFloat(vit.rr.value)||24:(vit&&vit.rr)||24} ageGroup={ageG} sex={sexG} emotion="sad" seed={pSeed} visuals={scVisuals}/>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,color:"#FF6B81",fontSize:13}}>
          <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,107,129,0.3)",borderTopColor:"#FF6B81",display:"inline-block",animation:"bwspin 0.8s linear infinite"}}></span>
          Something&apos;s changing — hold on…
        </div>
      </div>)}
      {stage==="cb-alert"&&(<div className="slu">
        <div className="alp" style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-block",padding:"8px 16px",borderRadius:20,fontWeight:900,color:"white",fontSize:13,background:"#FF4757"}}>UNEXPECTED EVENT</div></div>
        <div className="bw-split">
          <div className="bw-split-left">
            {/* Phase-2.6.3 change 6: pass signs={[]} to avoid the narrow
                flanking-column layout PatientView uses (~99px each on desktop
                inside bw-split-left). Surface curveball signs through
                BodySystemsView below — same pattern cb-act uses, full-width
                systems list reads cleanly at any column width. */}
            <PatientView status="critical" rr={vit.rr&&typeof vit.rr==="object"?parseFloat(vit.rr.value)||0:vit.rr} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} seed={pSeed}/>
            <div style={{marginTop:12}}><VitalsDisplay vitals={vit} flash={true}/></div>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/></div>
            <button onClick={function(){setStage("cb-act");}} style={Object.assign({},BS,{background:RD})}>What Do You Do?</button>
          </div>
        </div></div>)}
      {stage==="cb-act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <VitalsDisplay vitals={vit} flash={true}/>
            <LabPanel labs={curLabs}/>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba(255,71,87,0.15)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:"#FF6B81",marginBottom:4}}>Critical Intervention</p>
                <p style={{fontSize:11,color:"#bbb"}}>Find all correct actions.</p></div></div>
            {(function(){
              var cbIds=actionIds(sc.curveball&&sc.curveball.actions);
              return(<ActionPanel tools={cbIds.tools} meds={cbIds.meds} actions={sc.curveball.actions} phaseIdx="curveball" onDone={function(sel){recordAction({phaseId:"curveball",phaseName:"Curveball: "+(sc.curveball.name||""),tools:cbIds.tools,meds:cbIds.meds,actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:"Curveball: "+(sc.curveball.name||"")});}));recordAction({phaseId:"curveball",phaseName:"Curveball: "+(sc.curveball.name||""),tools:cbIds.tools,meds:cbIds.meds,actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}}/>);
            })()}
          </div>
        </div></div>)}
      {stage==="reassess"&&(function(){
        var re=sc.reassessment;
        var reVitals=re&&re.vitals?re.vitals:vit;
        var reSigns=re&&re.signs?re.signs:[];
        var reNarrative=re&&re.narrative?re.narrative:"The patient has stabilized following your interventions. Vital signs are trending toward age-appropriate ranges and end-organ perfusion has been restored.";
        return(<div className="slu">
          {/* phase-2.6 group H: stack vertically — reassess pill, recovered
              avatar, narrative on top, then vitals, then systems list. */}
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",background:"rgba(85,239,196,0.12)",color:"#55efc4",border:"1px solid rgba(85,239,196,0.3)"}}>Reassessment</div>
          </div>
          <div style={{maxWidth:200,margin:"0 auto 16px"}}>
            <PatientSVG status="stable" rr={reVitals.rr||20} ageGroup={ageG} sex={sexG} emotion="happy" seed={pSeed}/>
          </div>
          <div className="bw-glass" style={{borderRadius:16,padding:12,marginBottom:12}}>
            <TextBlock text={replaceIdsWithLabels(reNarrative)} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
          </div>
          {/* Phase-2.6.3 change 5: cap monitor width to match phase/act
              rendering. Reassess stacks vertically (no bw-split column),
              so without a max-width the monitor stretches across the
              full 900px desktop container. ~400px matches the effective
              width of bw-split-left (42% of 900px ≈ 378px) used elsewhere. */}
          <div style={{maxWidth:400,margin:"0 auto 12px"}}>
            <VitalsDisplay vitals={reVitals}/>
          </div>
          {reSigns.length>0&&<div style={{maxWidth:400,margin:"0 auto"}}><BodySystemsView signs={reSigns}/></div>}
          <button onClick={function(){setStage("recovery");}} style={Object.assign({},BS,{background:GR})}>Continue</button>
        </div>);
      })()}
      {stage==="recovery"&&(function(){
        var allRevealed=recStep>=correctActions.length;
        return(<div className="slu" style={{textAlign:"center"}}>
          <style>{"@keyframes bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-18px)}50%{transform:translateY(-10px)}70%{transform:translateY(-14px)}}.bw-bounce{animation:bounce 1s ease-in-out infinite}@keyframes confetti{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(360deg)}}.bw-confetti{animation:confetti 2s ease-out both}@keyframes vitalsNorm{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}.bw-vn{animation:vitalsNorm .5s ease-out both}"}</style>
          <div style={{marginBottom:20}}>
            <div style={{width:120,margin:"0 auto"}}><PatientSVG status="stable" rr={22} ageGroup={ageG} sex={sexG} emotion="happy" seed={pSeed} pose="jump"/></div>
            {/* Celebration sparkles */}
            <div style={{position:"relative",height:40,overflow:"hidden",marginTop:-10}}>
              {[<Sparkles/>,<Star/>,<Heart/>,<Trophy/>,<Zap/>,<Shield/>,<Sparkles/>].map(function(e,i){return(<span key={i} className="bw-confetti" style={{position:"absolute",left:(10+i*13)+"%",color:"#FECA57",animationDelay:(i*0.15)+"s"}}>{e}</span>);})}
            </div>
          </div>
          <h2 style={{fontSize:26,fontWeight:900,color:"#55efc4",marginBottom:4}}>Patient Stabilized!</h2>
          <p style={{fontSize:14,color:"#ccc",marginBottom:20}}>Your interventions worked. Here's how the patient responded:</p>
          {/* Post-intervention vitals: use reassessment.vitals when available, fallback to norm midpoints */}
          <div className="bw-vn" style={{display:"inline-flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {(function(){
              var re=sc.reassessment&&sc.reassessment.vitals;
              var hrV=re?re.hr:(sc.norms?Math.round((sc.norms.hr[0]+sc.norms.hr[1])/2):"--");
              var spV=re?re.spo2+"%":(sc.norms?"99%":"--");
              // Phase 6.2b.4-fixup: orchestrator emits reassessment
              // BP as a single combined `bp` field; built-ins still
              // emit split sbp/dbp. Try unified first, fall back to
              // combining the split keys, then norms midpoint.
              var bpV;
              if(re&&re.bp!==undefined&&re.bp!==null&&re.bp!==""){
                bpV=re.bp;
              }else if(re&&re.sbp!==undefined&&re.dbp!==undefined){
                bpV=re.sbp+"/"+re.dbp;
              }else if(sc.norms&&Array.isArray(sc.norms.sbp)&&Array.isArray(sc.norms.dbp)){
                bpV=Math.round((sc.norms.sbp[0]+sc.norms.sbp[1])/2)+"/"+Math.round((sc.norms.dbp[0]+sc.norms.dbp[1])/2);
              }else{
                bpV="--";
              }
              var tempV=re?(typeof re.temp==="number"?re.temp.toFixed(1)+"°C":re.temp+"°C"):"37.0°C";
              return [{l:"HR",v:hrV,c:"#55efc4"},{l:"SpO₂",v:spV,c:"#fdcb6e"},{l:"BP",v:bpV,c:"#74b9ff"},{l:"Temp",v:tempV,c:"#fab1a0"}].map(function(vi,i){return(<div key={i} className="bw-vn" style={{animationDelay:(0.2+i*0.15)+"s",padding:"8px 14px",borderRadius:12,background:"rgba(85,239,196,0.08)",border:"1px solid rgba(85,239,196,0.15)"}}>
                <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase"}}>{vi.l}</div>
                <div style={{fontSize:18,fontWeight:900,color:vi.c}}>{vi.v}</div>
              </div>);});
            })()}
          </div>
          {/* Intervention timeline - reveals one at a time */}
          <div style={{textAlign:"left",maxWidth:400,margin:"0 auto",marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>What Saved This Patient:</p>
            {correctActions.map(function(act,i){
              var visible=i<recStep;
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,opacity:visible?1:0.15,transform:visible?"translateX(0)":"translateX(-10px)",transition:"all 0.4s ease-out"}}>
                <div style={{flexShrink:0,width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:act.type==="tool"?"rgba(78,205,196,0.15)":"rgba(116,185,255,0.15)",border:"1px solid "+(act.type==="tool"?"rgba(78,205,196,0.3)":"rgba(116,185,255,0.3)")}}>{act.type==="tool"?ToolIcon({name:act.toolId,size:20,color:"#4ECDC4"}):MedIcon({type:act.medType||"iv",size:20,color:"#74b9ff"})}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"white"}}>{act.name}{act.isCurveball&&<span style={{marginLeft:6,fontSize:9,fontWeight:800,letterSpacing:0.5,textTransform:"uppercase",color:"#FF6B81",background:"rgba(255,71,87,0.12)",border:"1px solid rgba(255,71,87,0.3)",borderRadius:6,padding:"1px 5px",verticalAlign:"middle"}}>Curveball</span>}</div>
                  {visible&&act.fb&&<p style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4}}>{act.fb}</p>}
                </div>
                {/* Phase 6.2b.5: selection marker. Filled check = user
                    picked it; empty circle = must-have user missed.
                    Subtle distinction — same size, no warning colors.
                    Only renders on revealed rows so the timeline reveal
                    animation continues to work. */}
                {visible&&<div style={{flexShrink:0,marginTop:2}}>{act.userSelected?<Check size={18} color="#55efc4" style={{opacity:0.9}}/>:<Circle size={18} color="#9ca3af" style={{opacity:0.5}}/>}</div>}
              </div>);
            })}
          </div>
          {allRevealed&&<div className="bw-vn" style={{marginBottom:16}}>
            {sc.stabilizationSummary?<div style={{maxWidth:440,margin:"0 auto 12px",padding:12,borderRadius:12,background:"rgba(85,239,196,0.06)",border:"1px solid rgba(85,239,196,0.2)",textAlign:"left"}}>
              <TextBlock text={replaceIdsWithLabels(sc.stabilizationSummary)} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
            </div>:<p style={{fontSize:13,color:"#55efc4",fontWeight:700,marginBottom:12}}>All interventions complete. Patient is resting comfortably.</p>}
            <button onClick={function(){setStage("debrief");}} style={Object.assign({},BS,{background:GR,maxWidth:300,margin:"0 auto"})}>Continue to Debrief</button>
          </div>}
        </div>);
      })()}
    </div></div>);
}
