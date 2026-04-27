import { useState, useEffect, useCallback } from "react";
import { Heart, Zap, Sparkles, Star, Trophy, Shield, Check } from "lucide-react";
import { TOOLS, MEDS } from "../../lib/scenarios/builtIn.js";
import { canonicalizeAssessItem } from "../../lib/scenarios/canonicalize.js";
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
  var ageG=guessAge(sc);var sexG=guessSex(sc);var scVisuals=sc.visuals||[];
  var stage=usePlayerStore(function(s){return s.stage;});var pi=usePlayerStore(function(s){return s.phaseIndex;});var flags=usePlayerStore(function(s){return s.flags;});var showFb=usePlayerStore(function(s){return s.showFb;});var cbDone=usePlayerStore(function(s){return s.cbDone;});var shake=usePlayerStore(function(s){return s.shake;});var vit=usePlayerStore(function(s){return s.vitals;});
  var _ps=usePlayerStore.getState();var setStage=_ps.setStage;var setPi=_ps.setPhaseIndex;var setFlags=_ps.setFlags;var toggleFlag=_ps.toggleFlag;var setShowFb=_ps.setShowFb;var setCbDone=_ps.setCbDone;var setShake=_ps.setShake;var setVit=_ps.setVitals;var addSkipped=_ps.addSkipped;var recordAssess=_ps.recordAssess;var recordAction=_ps.recordAction;
  function prevStageFor(s){if(s==="phase")return"intro";if(s==="assess")return"intro";if(s==="act")return"phase";if(s==="cb-alert")return"act";if(s==="cb-act")return"cb-alert";if(s==="reassess")return null;return null;}
  var prev=prevStageFor(stage);
  var goBack=function(){if(prev)setStage(prev);};
  var _recStep=useState(0);var recStep=_recStep[0];var setRecStep=_recStep[1];
  var _learnOpen=useState(false);var learnOpen=_learnOpen[0];var setLearnOpen=_learnOpen[1];
  var ph=sc.phases[pi];
  /* Build correct actions list for recovery screen (must be at top level for hook rules) */
  var correctActions=[];
  sc.phases.forEach(function(p){
    if(!p.actions)return;
    if(p.actions.tools){Object.entries(p.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(p.actions.meds){Object.entries(p.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  });
  if(sc.curveball&&sc.curveball.actions){
    if(sc.curveball.actions.tools){Object.entries(sc.curveball.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(sc.curveball.actions.meds){Object.entries(sc.curveball.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  }
  correctActions.sort(function(a,b){return(a.pri||99)-(b.pri||99);});
  useEffect(function(){if(stage!=="recovery")return;setRecStep(0);var iv=setInterval(function(){setRecStep(function(p){if(p>=correctActions.length)return p;return p+1;});},1200);return function(){clearInterval(iv);};},[stage]);
  var pSt=function(){if(stage.startsWith("cb"))return"critical";if(pi>=1||stage==="act")return"declining";return"stable";};
  var trigCb=useCallback(function(){setShake(true);setTimeout(function(){setShake(false);},800);setVit(sc.curveball.vitals);setStage("cb-alert");setCbDone(true);},[sc]);
  var flag=function(id){if(!showFb)toggleFlag(id);};
  var submit=function(){
    // Phase-4a: scoring removed. Per-item breakdown still captured for debrief.
    recordAssess({phaseId:ph.id,phaseName:ph.name||ph.id,items:ph.assessItems.map(function(it){
      var cid=canonicalizeAssessItem(it,ph);
      return{id:it.id,label:it.label,cat:it.cat,bad:!!it.bad,why:it.why||"",userFlagged:!!(cid&&flags[cid])};
    })});
    setShowFb(true);};
  var afterA=function(){setFlags({});setShowFb(false);if(pi<sc.phases.length-1){var n=pi+1;setPi(n);setVit(sc.phases[n].vitals);setStage("phase");}else setStage("debrief");};
  var afterAct=function(){if(!cbDone&&sc.curveball)trigCb();else setStage("reassess");};
  var phaseHasIntervention=ph&&(ph.tools||ph.meds);;
  var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
  var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";var RD="linear-gradient(135deg,#FF4757,#c0392b)";var PP="linear-gradient(135deg,#a55eea,#8854d0)";
  var isCb=stage.startsWith("cb");
  var curSigns=isCb?(sc.curveball?sc.curveball.signs:[]):(ph?ph.signs:[]);
  var curLabs=isCb?(sc.curveball?sc.curveball.labs||[]:[]):(ph?ph.labs||[]:[]);
  if(stage==="debrief")return <Debrief sc={sc} ageG={ageG} sexG={sexG} onDone={onDone} onExit={onExit}/>;
  return(<div className={shake?"bw-shake":""} style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}>
    <style>{"@keyframes bwShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px)}20%{transform:translateX(8px)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}}.bw-shake{animation:bwShake .6s ease-in-out}@keyframes slideU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.slu{animation:slideU .4s ease-out}@keyframes alertP{0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,.4)}50%{box-shadow:0 0 0 12px rgba(255,71,87,0)}}.alp{animation:alertP 1.5s infinite}@keyframes fadeCard{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.bw-split{display:flex;flex-direction:column;gap:12px}.bw-split-left,.bw-split-right{width:100%}@media(min-width:768px){.bw-container{max-width:900px!important}.bw-split{flex-direction:row;gap:20px;align-items:flex-start}.bw-split-left{width:42%;position:sticky;top:16px;max-height:calc(100dvh - 80px);overflow-y:auto}.bw-split-right{width:58%;min-height:0}}"}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onExit} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer"}}>X Exit</button>
          {prev&&<button onClick={goBack} style={{color:"#888",fontSize:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>&lt; Back</button>}
        </div>
        <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:isCb?"rgba(255,71,87,0.2)":"rgba(78,205,196,0.15)",color:isCb?"#FF6B81":"#4ECDC4"}}>{isCb?"CURVEBALL":"Phase "+(pi+1)+"/"+sc.phases.length}</div>
        <div style={{width:1}}></div></div>
      {stage==="intro"&&(<div className="slu" style={{textAlign:"center"}}>
        <PatientView status="stable" rr={30} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
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
        <button onClick={function(){var hasAssess=ph&&ph.assessItems&&ph.assessItems.length>0;setStage(hasAssess?"assess":(phaseHasIntervention?"act":"phase"));}} style={Object.assign({},BS,{background:GR})}>{ph&&ph.assessItems&&ph.assessItems.length>0?"Assess":"Begin Intervention"}</button>
        <Modal open={learnOpen} onClose={function(){setLearnOpen(false);}} title="Background" accent="#74b9ff">
          <TextBlock text={sc.learnMore||""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
        </Modal>
      </div>)}
      {stage==="phase"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status={pSt()} rr={vit.rr} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
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
      {stage==="assess"&&<AssessPanel ph={ph} vit={vit} curSigns={curSigns} curLabs={curLabs} flags={flags} showFb={showFb} submit={submit} afterA={afterA} flag={flag} patient={sc.patient}/>}
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
            <ActionPanel tools={ph.tools} meds={ph.meds} actions={ph.actions} onDone={function(sel){recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:ph.tools||[],meds:ph.meds||[],actions:ph.actions||{},sel:sel||{}});afterAct();}} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:ph.name||ph.id});}));recordAction({phaseId:ph.id,phaseName:ph.name||ph.id,tools:ph.tools||[],meds:ph.meds||[],actions:ph.actions||{},sel:sel||{}});afterAct();}}/>
          </div>
        </div></div>)}
      {stage==="cb-alert"&&(<div className="slu">
        <div className="alp" style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-block",padding:"8px 16px",borderRadius:20,fontWeight:900,color:"white",fontSize:13,background:"#FF4757"}}>UNEXPECTED EVENT</div></div>
        <div className="bw-split">
          <div className="bw-split-left">
            {/* Phase-2.6.3 change 6: pass signs={[]} to avoid the narrow
                flanking-column layout PatientView uses (~99px each on desktop
                inside bw-split-left). Surface curveball signs through
                BodySystemsView below — same pattern cb-act uses, full-width
                systems list reads cleanly at any column width. */}
            <PatientView status="critical" rr={vit.rr} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals}/>
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
            <ActionPanel tools={sc.curveball.tools} meds={sc.curveball.meds} actions={sc.curveball.actions} onDone={function(sel){recordAction({phaseId:"curveball",phaseName:"Curveball: "+(sc.curveball.name||""),tools:sc.curveball.tools||[],meds:sc.curveball.meds||[],actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}} onSkip={function(m,sel){if(m&&m.length>0)addSkipped(m.map(function(x){return Object.assign({},x,{phase:"Curveball: "+(sc.curveball.name||"")});}));recordAction({phaseId:"curveball",phaseName:"Curveball: "+(sc.curveball.name||""),tools:sc.curveball.tools||[],meds:sc.curveball.meds||[],actions:sc.curveball.actions||{},sel:sel||{}});setStage("reassess");}}/>
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
            <PatientSVG status="stable" rr={reVitals.rr||20} ageGroup={ageG} sex={sexG} emotion="happy"/>
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
            <div className="bw-bounce" style={{width:120,margin:"0 auto"}}><PatientSVG status="stable" rr={22} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
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
              var bpV=re?(re.sbp+"/"+re.dbp):(sc.norms?Math.round((sc.norms.sbp[0]+sc.norms.sbp[1])/2)+"/"+Math.round((sc.norms.dbp[0]+sc.norms.dbp[1])/2):"--");
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
                  <div style={{fontSize:13,fontWeight:700,color:"white"}}>{act.name}</div>
                  {visible&&act.fb&&<p style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4}}>{act.fb}</p>}
                </div>
                {visible&&<div style={{flexShrink:0,marginTop:2}}><Check size={18} color="#55efc4"/></div>}
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
