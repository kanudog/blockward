import { useState, useEffect } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { CoachBubble } from "../shared/CoachBubble.jsx";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../../lib/scenarios/packs/index.js";
import { medColor, medType as lookupMedType } from "../../lib/scenarios/visualMeta.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";
import { fetchSingleSlot } from "../../lib/ai/dispatcher.js";
import { resolveSlotText, SYNTHESIZED_FB_FALLBACK } from "../../lib/scenarios/slotResolve.js";
import { useScenariosStore } from "../../stores/scenariosStore.js";
import { ToolIcon, MedIcon } from "./icons.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { useModalGuard } from "../shared/useModalGuard.js";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";

// Phase-4b: tool/med entries come from the pack registry; custom entries read
// label/description from the per-scenario action entry.
//
// Play-test fix 2026-07-29 — TWO bugs lived here:
//
// 1. The pack label always won, so every patient-specific dose the generator
//    authored was thrown away. A cardiogenic-shock case authored "NS bolus
//    5 mL/kg over 15 min" and the tile rendered the registry default,
//    "Bolus NS 20 mL/kg IV" — a 4x dose contradiction against the card's own
//    teaching text. Worse, a PEA-arrest case authored "Confirm non-shockable
//    rhythm — continue CPR" on the `defib` id and the tile rendered "Apply
//    Defib Pads", inverting the clinical meaning. The authored label now wins.
//
// 2. An id missing from the registry returned null and the caller FILTERED IT
//    OUT — silently. `furosemide` and `callNeurosurgery` both vanished mid-case
//    (the latter from a herniating TBI patient who needed an OR). Nothing is
//    dropped now: unknown ids are cross-checked against the other list, then
//    rendered from their authored label with a console warning.
//
// Note on validation: we can enforce SHAPE here (non-empty, sane length, no
// stray markdown) but not clinical correctness — a label can be fluent and
// still wrong. The substantive guard is in the prompt, which now requires the
// label to name the same intervention as its id and agree with its own `fb`.
var MAX_LABEL = 90;
function cleanLabel(raw) {
  if (typeof raw !== "string") return null;
  var s = raw.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  if (!s || s.length > MAX_LABEL) return null;
  return s;
}
function resolveEntry(id, actionEntry, registry, otherRegistry, isCustom, kind) {
  var authored = cleanLabel(actionEntry && actionEntry.label);
  if (isCustom(id)) {
    return { id: id, label: authored || id, description: actionEntry && actionEntry.description, custom: true };
  }
  var reg = registry[id];
  if (reg) return Object.assign({}, reg, { label: authored || reg.label });
  // Not in its own registry — try the other one (the generator has put
  // procedures like `bloodCultures` in the meds list).
  var cross = otherRegistry[id];
  if (cross) {
    console.warn("ActionPanel: " + kind + " id '" + id + "' is registered as the other kind; rendering it anyway.");
    return Object.assign({}, cross, { label: authored || cross.label, crossListed: true });
  }
  console.warn("ActionPanel: " + kind + " id '" + id + "' is not in any pack; rendering from its authored label. Consider adding it to the registry.");
  return { id: id, label: authored || id, unregistered: true };
}
function lookupTool(id, actionEntry) {
  return resolveEntry(id, actionEntry, ALL_TOOLS, ALL_MEDS, isCustomTool, "tool");
}
function lookupMed(id, actionEntry) {
  return resolveEntry(id, actionEntry, ALL_MEDS, ALL_TOOLS, isCustomMed, "med");
}

// Phase 4 (#1 + play-test findings): PREVIEW is separated from SELECT.
// - Tapping a tile opens its teaching card (a preview — adds nothing).
// - "Add to plan" in the card commits the option; the tile fills with an
//   unmistakable selected state ("In plan"), not a corner tick.
// - No verdicts before commit: the card shows what the option does and when
//   it fits — no appropriate/not badge, no priority rank, no right/wrong
//   tint on tiles. The verdict arrives as CONSEQUENCE after "Commit plan"
//   (ScenarioPlayer) and in the debrief.
// - The old find-all-correct gate is gone: "Commit plan" needs only a
//   non-empty plan. Missed key steps become consequence teaching, never a
//   blocker. All lazy-fetch / mark-for-review plumbing is unchanged.
export function ActionPanel(props){
  var t=useTokens();
  var tools=props.tools;var meds=props.meds;var actions=props.actions;var onDone=props.onDone;var onSkip=props.onSkip;
  // Phase-5.2.5: phaseIdx for slot-ref construction ("curveball" on cb-act).
  var phaseIdx=props.phaseIdx!==undefined?props.phaseIdx:0;
  var _sel=useState({});var sel=_sel[0];var setSel=_sel[1];
  var _opened=useState({});var opened=_opened[0];var setOpened=_opened[1];
  var _pop=useState(null);var pop=_pop[0];var setPop=_pop[1];
  // Phase-5.3 sub-step E: popup-local lazy-fetch state for synthesized fb
  // fallback. popLoading suppresses Mark for Review; popError offers retry.
  var _popLoading=useState(false);var popLoading=_popLoading[0];var setPopLoading=_popLoading[1];
  var _popError=useState(null);var popError=_popError[0];var setPopError=_popError[1];
  var markedForReview=usePlayerStore(function(s){return s.markedForReview;});
  var toggleMark=usePlayerStore(function(s){return s.toggleMarkForReview;});
  useModalGuard(!!pop);
  // Owner fix (Gate 4): "In plan" vs "Mark for review" sound alike but do
  // different things — a first-time mentor bubble explains the difference
  // (and insight cards); the ⓘ in the card header reopens it any time.
  var coachSeen=usePlayerStore(function(s){return s.coachSeen;});
  var dismissCoach=usePlayerStore(function(s){return s.dismissCoach;});
  var _optHelp=useState(false);var optHelp=_optHelp[0];var setOptHelp=_optHelp[1];
  var showOptionsCoach=optHelp||!coachSeen.options;
  var setDeepDive=usePlayerStore(function(s){return s.setDeepDive;});
  var forceRefreshScenario=usePlayerStore(function(s){return s.forceRefreshScenario;});
  var updateCustom=useScenariosStore(function(s){return s.updateCustom;});
  function popMarkItem(){
    if(!pop)return null;
    var popActionEntry=pop.ty==="t"?(actions&&actions.tools?actions.tools[pop.id]:null):(actions&&actions.meds?actions.meds[pop.id]:null);
    var meta=pop.ty==="t"?lookupTool(pop.id,popActionEntry):lookupMed(pop.id,popActionEntry);
    var label=meta?meta.label:pop.id;
    var kind=pop.ty==="t"?"tool":"med";
    return{
      // Bug-sweep: phase-scope the mark id — same tool/med id marked in two
      // phases must not collide in markedForReview dedup or deepDiveCache.
      id:(pop.ty==="t"?"tool:":"med:")+pop.id+"@p"+phaseIdx,
      kind:kind,
      phaseIdx:phaseIdx,
      label:label,
      _slotRef:{kind:kind,phaseIdx:phaseIdx,indexOrId:pop.id}
    };
  }
  // Phase-5.3 sub-step E (Phase 6.0 rewire): synthesized-fallback fb fetch.
  useEffect(function(){
    if(!pop)return;
    if(!pop.info||pop.info.fb!==SYNTHESIZED_FB_FALLBACK)return;
    if(typeof phaseIdx!=="number")return;
    setPopLoading(true);
    setPopError(null);
    var sc=usePlayerStore.getState().activeScenario;
    if(!sc){setPopLoading(false);return;}
    var kind=pop.ty==="t"?"tool":"med";
    var sub=kind==="tool"?"tools":"meds";
    var slotRefString="phase["+phaseIdx+"].actions."+sub+"."+pop.id+".fb";
    var slotRefObj={kind:kind,phaseIdx:phaseIdx,indexOrId:pop.id};
    var popId=pop.id;
    var popTy=pop.ty;
    var ctrl=new AbortController();
    fetchSingleSlot(sc,slotRefString,"per-item",ctrl.signal).then(function(){
      var text=resolveSlotText(sc,slotRefObj);
      if(!text){setPopError("Couldn't load details — please try again.");setPopLoading(false);return;}
      try{updateCustom(sc);}catch(e){}
      forceRefreshScenario();
      setPop(function(p){if(!p||p.id!==popId||p.ty!==popTy)return p;return Object.assign({},p,{info:Object.assign({},p.info,{fb:text})});});
      setPopLoading(false);
    }).catch(function(err){
      if(err&&err.name==="AbortError")return;
      setPopError(err.message||"Couldn't load details — please try again.");
      setPopLoading(false);
    });
    return function(){ctrl.abort();};
  },[pop&&pop.id,pop&&pop.ty]);
  function retryPopFetch(){
    if(!pop)return;
    setPopError(null);
    setPop(function(p){if(!p)return p;return Object.assign({},p,{info:Object.assign({},p.info,{fb:SYNTHESIZED_FB_FALLBACK})});});
  }
  var popMarked=(function(){var it=popMarkItem();return it?markedForReview.some(function(x){return x.id===it.id;}):false;})();
  // Bug-sweep (explored counter / soft-lock): drive the grid and the counter
  // from the renderable id list only.
  var renderTools=(tools||[]).filter(function(id){return !!lookupTool(id,actions&&actions.tools?actions.tools[id]:null);});
  var renderMeds=(meds||[]).filter(function(id){return !!lookupMed(id,actions&&actions.meds?actions.meds[id]:null);});
  var renderToolSet={};renderTools.forEach(function(id){renderToolSet[id]=true;});
  var renderMedSet={};renderMeds.forEach(function(id){renderMedSet[id]=true;});
  var rT=Object.entries(actions&&actions.tools?actions.tools:{}).filter(function(e){return e[1].ok&&renderToolSet[e[0]];}).map(function(e){return e[0];});
  var rM=Object.entries(actions&&actions.meds?actions.meds:{}).filter(function(e){return e[1].ok&&renderMedSet[e[0]];}).map(function(e){return e[0];});
  var explored=Object.keys(opened).length;
  var planned=Object.keys(sel).length;
  var total=renderTools.length+renderMeds.length;
  // PREVIEW: open the teaching card; selection is a separate, deliberate act.
  var preview=function(id,ty){
    var src=ty==="t"?(actions&&actions.tools):(actions&&actions.meds);
    var info=src?src[id]:null;
    // Phase-2.6.4 change 2: synthesize a minimal info if the generator
    // omitted the actions entry, so the tile stays viewable.
    if(!info||typeof info!=="object"){
      console.warn("ActionPanel: no actions entry for "+id+" ("+ty+"); synthesizing fallback");
      info={ok:false,pri:null,fb:"This option's details were not generated for this scenario."};
    }
    setOpened(function(p){var n=Object.assign({},p);n[id]=true;return n;});
    setPop({id:id,ty:ty,info:info});
  };
  function togglePlan(id,ty){
    var src=ty==="t"?(actions&&actions.tools):(actions&&actions.meds);
    var info=(src&&src[id])||{ok:false,pri:null,fb:""};
    setSel(function(p){
      var n=Object.assign({},p);
      if(n[id])delete n[id];else n[id]=info;
      return n;
    });
  }
  // Phase-4a: scoring removed. Commit hands back the plan; Skip bails and
  // reports what a committed plan would have missed (records only).
  var commit=function(){if(planned===0)return;onDone(sel);};
  var skip=function(){
    var missed=[];
    rT.forEach(function(id){if(!sel[id]){var tl=lookupTool(id,actions&&actions.tools?actions.tools[id]:null);missed.push({id:id,label:tl?tl.label:id,type:"tool"});}});
    rM.forEach(function(id){if(!sel[id]){var m=lookupMed(id,actions&&actions.meds?actions.meds[id]:null);missed.push({id:id,label:m?m.label:id,type:"med"});}});
    if(onSkip)onSkip(missed,sel);else onDone(sel);
  };
  // Phase-4b-hotfix: registry lookup for the open popup, hoisted for the header.
  var popActionEntry=pop?(pop.ty==="t"?(actions&&actions.tools?actions.tools[pop.id]:null):(actions&&actions.meds?actions.meds[pop.id]:null)):null;
  var meta=pop?(pop.ty==="t"?lookupTool(pop.id,popActionEntry):lookupMed(pop.id,popActionEntry)):null;
  var popInPlan=pop?!!sel[pop.id]:false;
  // Owner direction 2026-07-13: the preview stays verdict-free UNTIL the player
  // actually adds a not-indicated option to their plan — then the card turns
  // red with "Not indicated right now" + the why. (Explicit override of the
  // "no verdict pre-commit" rule, but ONLY for a committed wrong pick.)
  var popNotIndicated=!!(pop&&popInPlan&&pop.info&&pop.info.ok===false);
  var popCard=pop?Object.assign({},t.surface("pop"),{display:"flex",flexDirection:"column",width:"100%",maxWidth:"min(440px, 92vw)",maxHeight:"85vh",overflow:"hidden",animation:"popIn .25s ease-out",fontFamily:t.FONT.body}):null;
  function actionTile(id,ty){
    var isTool=ty==="t";
    var entry=isTool?(actions&&actions.tools?actions.tools[id]:null):(actions&&actions.meds?actions.meds[id]:null);
    var m=isTool?lookupTool(id,entry):lookupMed(id,entry);
    if(!m)return null;
    var inPlan=!!sel[id];
    var wasOpened=!!opened[id];
    // Play-test fix: the red "not indicated" warning used to live only inside
    // the popup, so closing the card lost the signal and the grid tile looked
    // identical to a correct pick. The tile now carries it too.
    // The tile chip reads "Not indicated" while the popup's confirm button reads
    // "In plan — tap to remove". Deliberately different wording: when both said
    // "reconsider" the two controls were indistinguishable from each other.
    var notIndicated=inPlan&&!!(entry&&entry.ok===false);
    var st=Object.assign({},t.tile(inPlan?"flagged":"idle"),{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6,minHeight:78,cursor:"pointer",fontFamily:t.FONT.body});
    if(notIndicated)st=Object.assign({},st,{background:"rgba("+t.CRIT_RGB+",0.10)",border:"1.5px solid rgba("+t.CRIT_RGB+",0.55)"});
    return(<button key={id} onClick={function(){preview(id,ty);}} className="bw-tap" style={st}>
      {isTool
        ?<ToolIcon name={id} size={26} color={notIndicated?t.COLOR.critical:t.COLOR.accent}/>
        :<div style={{width:26,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:medColor(id)}}><MedIcon type={lookupMedType(id)} size={18} color="#FFFFFF"/></div>}
      <span style={{fontSize:11,color:t.COLOR.ink,fontWeight:700,textAlign:"center",lineHeight:1.2}}>{m.label}</span>
      {notIndicated
        ?<span style={{position:"absolute",top:5,right:5,display:"inline-flex",alignItems:"center",gap:3,fontSize:8.5,fontWeight:800,padding:"2px 7px",borderRadius:999,background:"rgba("+t.CRIT_RGB+",0.18)",border:"1px solid rgba("+t.CRIT_RGB+",0.5)",color:t.COLOR.critical}}><AlertTriangle size={9}/>Not indicated</span>
        :inPlan&&<span style={Object.assign({},t.chip("accent"),{position:"absolute",top:5,right:5,fontSize:8.5,padding:"2px 7px"})}>In plan</span>}
      {!inPlan&&wasOpened&&<span style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:3,background:t.COLOR.ink3,opacity:0.6}}/>}
    </button>);
  }
  return(
    <div style={{marginTop:16,fontFamily:t.FONT.body}}>
      {/* Phase-2.6.3 change 7: action-tile grid mirrors the assessment grids. */}
      <style>{"@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes lazyPulse{0%,100%{opacity:.4}50%{opacity:1}}@media(min-width:768px){.bw-action-grid{grid-template-columns:repeat(3,1fr) !important}}@media(min-width:1024px){.bw-action-grid{grid-template-columns:repeat(4,1fr) !important}}"}</style>
      {/* First-run explainer, shown ONCE per run above the grid where it has
          room, instead of on top of an open card's teaching text. */}
      {/* Sequenced behind the "How plans work" coach that ScenarioPlayer shows
          on the same screen — two mentor cards stacked at once is noise. */}
      {!coachSeen.options&&!optHelp&&coachSeen.plan&&<div style={{marginBottom:12}}>
        <CoachBubble title="Two different saves"
          body={"**Add to plan** — the steps you'd actually take now. Only these get answered by the readings when you commit. They do NOT go to your tray.\n\n**Mark for review** — a bookmark for later. It goes to your tray and returns in the debrief with a deeper read. It never affects the plan."}
          dismissLabel="Got it"
          onDismiss={function(){dismissCoach("options");}}/>
      </div>}
      {renderTools&&renderTools.length>0&&(<div style={{marginBottom:16}}><div style={Object.assign({},t.label(),{marginBottom:8})}>Tool Belt</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>{renderTools.map(function(id){return actionTile(id,"t");})}</div></div>)}
      {renderMeds&&renderMeds.length>0&&(<div style={{marginBottom:16}}><div style={Object.assign({},t.label(),{marginBottom:8})}>Med Cart</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>{renderMeds.map(function(id){return actionTile(id,"m");})}</div></div>)}
      {/* Teaching-card popup: sticky header + scrolling body + sticky footer.
          No verdict badges pre-commit — this is a PREVIEW. */}
      {pop&&(<div onClick={function(){setPop(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,18,21,0.5)"}}>
        <div onClick={function(e){e.stopPropagation();}} style={popCard}>
          <div style={{padding:"14px 18px 10px",borderBottom:"1px solid "+t.COLOR.hairline,flexShrink:0,display:"flex",alignItems:"flex-start",gap:8}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={t.label()}>Option</div>
              <h4 style={{color:t.COLOR.ink,fontWeight:600,fontSize:16,fontFamily:t.FONT.display,marginTop:2,marginBottom:2}}>{meta?meta.label:pop.id}</h4>
              {meta&&meta.custom&&meta.description&&<p style={{fontSize:11,color:t.COLOR.ink3,margin:0}}>{meta.description}</p>}
            </div>
            <button className="bw-tap" onClick={function(){setOptHelp(true);}} aria-label="What do these buttons do?"
              style={{width:26,height:26,borderRadius:13,display:"inline-flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid "+t.COLOR.hairline,color:t.COLOR.ink3,cursor:"pointer",padding:0,flexShrink:0}}>
              <Info size={13}/>
            </button>
          </div>
          <div style={{padding:"12px 18px",overflowY:"auto",flex:1,minHeight:0}}>
            {popLoading?(<div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:13}}>
              <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:t.COLOR.accent,animation:"lazyPulse 1.4s ease-in-out infinite",flexShrink:0}}></span>
              <span style={{color:t.COLOR.ink3}}>Loading details for this option…</span>
            </div>):popError?(<div style={{padding:"4px 0",color:t.COLOR.attentionText,fontSize:12,lineHeight:1.5}}>
              {popError} <button onClick={retryPopFetch} style={{marginLeft:6,background:"none",border:"none",color:t.COLOR.boldTerm,textDecoration:"underline",cursor:"pointer",fontSize:12}}>Retry</button>
            </div>):popNotIndicated?(<div style={{borderRadius:12,border:"1.5px solid rgba("+t.CRIT_RGB+",0.55)",background:"rgba("+t.CRIT_RGB+",0.10)",padding:"11px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                <AlertTriangle size={16} color={t.COLOR.critical} style={{flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:800,color:t.COLOR.critical,fontFamily:t.FONT.body}}>Not indicated right now</span>
              </div>
              <TextBlock text={pop.info.fb} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.55}}/>
            </div>):
            (<TextBlock text={pop.info.fb} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.55}}/>)}
          </div>
          <div style={{padding:"10px 18px 14px",borderTop:"1px solid "+t.COLOR.hairline,flexShrink:0}}>
            {/* Owner direction 2026-07-29: this explainer used to render HERE, in
                the card footer, where it covered the teaching text the learner
                had just opened the card to read — and its dismiss button was a
                second control also labelled "Got it", so tapping the obvious one
                closed the card and left the tip standing. It now lives above the
                action grid, outside the card, and is only shown on request via
                the ⓘ in the header. */}
            {optHelp&&<div style={{marginBottom:10}}>
              <CoachBubble tail="bottom-left" title="Two different saves"
                body={"**Add to plan** — the steps you'd actually take now. Only these get answered by the readings when you commit. They do NOT go to your tray.\n\n**Mark for review** — a bookmark for later. It goes to your tray and returns in the debrief with a deeper read. It never affects the plan.\n\nInsight cards join your tray on their own as you play — small keepers, never scored."}
                dismissLabel="Hide this tip"
                onDismiss={function(){dismissCoach("options");setOptHelp(false);}}/>
            </div>}
            {/* SELECT and BOOKMARK side by side — different verbs, same row. */}
            <div style={{display:"flex",gap:8}}>
              {(function(){
                var addStyle;
                if(popNotIndicated)addStyle={flex:1,padding:"11px 0",borderRadius:10,fontWeight:700,fontSize:12.5,cursor:"pointer",fontFamily:t.FONT.body,background:"rgba("+t.CRIT_RGB+",0.16)",border:"1.5px solid rgba("+t.CRIT_RGB+",0.6)",color:t.COLOR.critical};
                else if(popInPlan)addStyle={flex:1,padding:"11px 0",borderRadius:10,fontWeight:700,fontSize:12.5,cursor:"pointer",fontFamily:t.FONT.body,background:"rgba("+t.ACCENT_RGB+",0.14)",border:"1.5px solid rgba("+t.ACCENT_RGB+",0.6)",color:t.COLOR.boldTerm};
                else addStyle=Object.assign({},t.cta("primary"),{flex:1,width:"auto",padding:"11px 0",fontSize:12.5,borderRadius:10});
                return(<button onClick={function(){togglePlan(pop.id,pop.ty);}} style={addStyle}>{popNotIndicated?"In plan — tap to remove":popInPlan?"✓ In plan":"Add to plan"}</button>);
              })()}
              <button disabled={popLoading} onClick={function(){
                if(popLoading)return;
                var it=popMarkItem();
                if(!it)return;
                var transition=toggleMark(it);
                if(transition!=="added")return;
                var store=usePlayerStore.getState();
                var sc=store.activeScenario;
                if(!sc)return;
                if(store.deepDiveCache[it.id])return;
                if(!store.beginDeepDive(it.id))return;
                expandSingleMarkedItem(sc,it).then(function(text){
                  if(text)usePlayerStore.getState().setDeepDive(it.id,text);
                }).catch(function(err){
                  console.warn("[eager deep-dive] "+it.id+" — "+(err&&err.message||err));
                }).finally(function(){
                  usePlayerStore.getState().endDeepDive(it.id);
                });
              }} style={{flex:1,padding:"11px 0",borderRadius:10,fontSize:12.5,fontWeight:700,fontFamily:t.FONT.body,cursor:popLoading?"not-allowed":"pointer",background:popMarked?"rgba("+t.ATTN_RGB+",0.16)":t.COLOR.btnNeutralBg,border:"1px solid "+(popMarked?"rgba("+t.ATTN_RGB+",0.55)":t.COLOR.hairline),color:popMarked?t.COLOR.attentionText:t.COLOR.btnNeutralInk,opacity:popLoading?0.45:1}}>{popMarked?"✓ Marked":"Mark for review"}</button>
            </div>
            <p style={{fontSize:10,color:t.COLOR.ink3,margin:"6px 0 0",textAlign:"center",lineHeight:1.4}}>Plan — steps you'd take now · Review — saved to your tray for the debrief</p>
            {/* The proceed action: its own row, lightly accented to be found. */}
            <button onClick={function(){setPop(null);}} style={{width:"100%",marginTop:10,padding:"12px 0",borderRadius:10,fontWeight:700,fontSize:13.5,fontFamily:t.FONT.body,background:"rgba("+t.ACCENT_RGB+",0.12)",border:"1.5px solid rgba("+t.ACCENT_RGB+",0.45)",color:t.COLOR.boldTerm,cursor:"pointer"}}>Got it</button>
          </div>
        </div></div>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:t.COLOR.ink3}}>{explored+"/"+total+" explored · "+planned+" in plan"}</div>
        <button onClick={skip} style={{padding:"8px 16px",borderRadius:12,fontWeight:700,color:t.COLOR.btnNeutralInk,fontSize:12,background:t.COLOR.btnNeutralBg,border:"1px solid "+t.COLOR.hairline,cursor:"pointer",fontFamily:t.FONT.body}}>Skip this round</button>
      </div>
      <button onClick={commit} disabled={planned===0} style={Object.assign({},t.cta("primary"),{marginTop:10},planned===0?{opacity:0.55,cursor:"default"}:{})}>{planned===0?"Add at least one step to your plan":"Commit plan"}</button>
    </div>);
}
