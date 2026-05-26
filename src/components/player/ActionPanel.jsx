import { useState, useEffect } from "react";
import { Check, X, Minus } from "lucide-react";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../../lib/scenarios/packs/index.js";
import { medColor, medType as lookupMedType } from "../../lib/scenarios/visualMeta.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";
import { fetchSingleSlot } from "../../lib/ai/dispatcher.js";
import { resolveSlotText, SYNTHESIZED_FB_FALLBACK } from "../../lib/scenarios/slotResolve.js";
import { useScenariosStore } from "../../stores/scenariosStore.js";

// Phase-4b: tool/med entries come from the pack registry rather than the
// pre-Phase-4b builtIn.js TOOLS / MEDS maps. Custom entries (id starts
// with "customTool" or "customMed") read label and description from the
// per-scenario action entry instead of the registry. lookupTool /
// lookupMed wrap that branching so the renderer stays uncluttered.
function lookupTool(id, actionEntry) {
  if (isCustomTool(id)) return { id: id, label: (actionEntry && actionEntry.label) || id, description: actionEntry && actionEntry.description, custom: true };
  return ALL_TOOLS[id] || null;
}
function lookupMed(id, actionEntry) {
  if (isCustomMed(id)) return { id: id, label: (actionEntry && actionEntry.label) || id, description: actionEntry && actionEntry.description, custom: true };
  return ALL_MEDS[id] || null;
}
import { ToolIcon, MedIcon } from "./icons.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { usePlayerStore } from "../../stores/playerStore.js";

// Phase-2.6.4 change 5: canonical MTP teaching content. Lives on the
// frontend so it stays consistent across scenarios — the AI gets the
// scenario-specific *why MTP is indicated for THIS patient* in the
// fb field, but the WHAT IS MTP body is fixed and well-edited here.
// Format follows the markdown-lite spec TextBlock parses (overview
// paragraph, then dash-bullets with **bold** key terms).
var MTP_CANONICAL=
"Activates the pediatric massive transfusion protocol — page blood bank now and the team will deliver pRBCs, FFP, and platelets in coordinated rounds.\n\n"+
"- **When to activate:** sustained hemorrhagic shock not responding to crystalloid, ongoing visible or suspected uncontrolled bleeding, or expected need for >40 mL/kg of products in 24 hours.\n"+
"- **1:1:1 ratio:** transfuse pRBCs, FFP, and platelets in a 1:1:1 ratio (by unit or by mL/kg) to mimic whole blood and prevent dilutional coagulopathy from imbalanced resuscitation.\n"+
"- **Pediatric dosing:** **10-15 mL/kg** per round of warmed pRBCs in children under 30 kg; FFP and platelets dosed proportionally. Reassess after each round.\n"+
"- **Warmed products are mandatory:** cold blood drives the **lethal triad** of hypothermia → coagulopathy → acidosis. Use a fluid warmer; document core temperature.\n"+
"- **Calcium replacement:** citrate in stored products chelates ionized calcium. Push **calcium chloride 10-20 mg/kg IV** after every 1-2 units of pRBCs; trend ionized Ca with each gas.\n"+
"- **TXA window:** if within **3 hours of injury**, give tranexamic acid **15 mg/kg IV over 10 min** (max 1 g) — reduces mortality in pediatric trauma.\n"+
"- **The lethal triad:** hypothermia, acidosis, and coagulopathy reinforce each other. MTP combats all three: warmed products preserve temperature, FFP and platelets restore clotting, pRBCs restore oxygen delivery, calcium maintains contractility.";
export function ActionPanel(props){
  var tools=props.tools;var meds=props.meds;var actions=props.actions;var onDone=props.onDone;var onSkip=props.onSkip;
  // Phase-5.2.5: phaseIdx for slot-ref construction. Pass "curveball"
  // for cb-act stage; pass the regular phase index otherwise. Default
  // to 0 keeps existing tests green.
  var phaseIdx=props.phaseIdx!==undefined?props.phaseIdx:0;
  var _sel=useState({});var sel=_sel[0];var setSel=_sel[1];
  var _pop=useState(null);var pop=_pop[0];var setPop=_pop[1];
  // Phase-5.3 sub-step E: popup-local lazy-fetch state for synthesized
  // fb fallback. popLoading suppresses Mark for Review and shows a
  // shimmer in the popup body; popError shows a polite retry option.
  var _popLoading=useState(false);var popLoading=_popLoading[0];var setPopLoading=_popLoading[1];
  var _popError=useState(null);var popError=_popError[0];var setPopError=_popError[1];
  // Phase-2.6.3 change 8: Mark for Review on intervention popup.
  // Reads/writes the same playerStore.markedForReview list that
  // WhyModal uses for assess items, so marked interventions show
  // up alongside marked findings in the debrief deep-dive section.
  var markedForReview=usePlayerStore(function(s){return s.markedForReview;});
  var toggleMark=usePlayerStore(function(s){return s.toggleMarkForReview;});
  var setDeepDive=usePlayerStore(function(s){return s.setDeepDive;});
  var forceRefreshScenario=usePlayerStore(function(s){return s.forceRefreshScenario;});
  var updateCustom=useScenariosStore(function(s){return s.updateCustom;});
  function popMarkItem(){
    if(!pop)return null;
    var popActionEntry=pop.ty==="t"?(actions&&actions.tools?actions.tools[pop.id]:null):(actions&&actions.meds?actions.meds[pop.id]:null);
    var meta=pop.ty==="t"?lookupTool(pop.id,popActionEntry):lookupMed(pop.id,popActionEntry);
    var label=meta?meta.label:pop.id;
    // Phase-5.2.5: slot-ref payload — debrief resolves text fresh via
    // resolveSlotText, including any post-mark lazy-fetch updates. The
    // mtpActivate canonical-content special case lives in the popup
    // render (see MTP_CANONICAL block below); the deep-dive prompt
    // receives the resolved fb directly via expandSingleMarkedItem.
    var kind=pop.ty==="t"?"tool":"med";
    return{
      id:(pop.ty==="t"?"tool:":"med:")+pop.id,
      kind:kind,
      phaseIdx:phaseIdx,
      label:label,
      _slotRef:{kind:kind,phaseIdx:phaseIdx,indexOrId:pop.id}
    };
  }
  // Phase-5.3 sub-step E (Phase 6.0 rewire): when popup opens with a
  // synthesized-fallback fb, kick off a single-slot Haiku call via the
  // dispatcher and read the populated fb back from the scenario.
  // Mark for Review stays disabled while loading so the user doesn't
  // pin a placeholder. On error, show a Retry button.
  //
  // Curveball phases don't yet have schema-5.4.1 slot-ref strings, so
  // the single-slot fetch is skipped for them — the synthesized
  // fallback remains visible. This narrow gap will close when curveball
  // joins the typed-collection migration.
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
      // Update local pop state so the popup body re-renders with the
      // freshly fetched text without waiting for a parent re-render.
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
    // Re-trigger the effect by toggling pop reference. Simplest: reset
    // info.fb back to the synthesized string so the effect predicate
    // matches again on next mount.
    if(!pop)return;
    setPopError(null);
    setPop(function(p){if(!p)return p;return Object.assign({},p,{info:Object.assign({},p.info,{fb:SYNTHESIZED_FB_FALLBACK})});});
  }
  var popMarked=(function(){var it=popMarkItem();return it?markedForReview.some(function(x){return x.id===it.id;}):false;})();
  var rT=Object.entries(actions&&actions.tools?actions.tools:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var rM=Object.entries(actions&&actions.meds?actions.meds:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var totalCorrect=rT.length+rM.length;
  var allF=totalCorrect>0&&rT.concat(rM).every(function(id){return sel[id];});
  var explored=Object.keys(sel).length;
  var total=(tools?tools.length:0)+(meds?meds.length:0);
  var pick=function(id,ty){
    var src=ty==="t"?(actions&&actions.tools):(actions&&actions.meds);
    var info=src?src[id]:null;
    // Phase-2.6.4 change 2: if the AI generated a tool/med ID but
    // omitted its corresponding actions.tools[id] / actions.meds[id]
    // entry, the original handler silently returned — the tile rendered
    // normally but every click was a no-op, blocking phase completion.
    // Sebastian saw this on o2mask and the new mtpActivate. Synthesize
    // a minimal info so the tile is at least clickable; warn for dev
    // visibility.
    if(!info||typeof info!=="object"){
      console.warn("ActionPanel: no actions entry for "+id+" ("+ty+"); synthesizing fallback");
      info={ok:false,pri:null,fb:"This action's feedback was not generated for this scenario. Selection still counts."};
    }
    setSel(function(p){var n=Object.assign({},p);n[id]=info;return n;});
    setPop({id:id,ty:ty,info:info});
  };
  // Phase-4a: scoring removed. onDone/onSkip just hand back the selection
  // map (and missed list for skip) so ScenarioPlayer can record what the
  // user picked. The per-action ok/correct color logic stays in this file.
  var finish=function(){onDone(sel);};
  var skip=function(){
    var missed=[];
    rT.forEach(function(id){if(!sel[id]){var t=lookupTool(id,actions&&actions.tools?actions.tools[id]:null);missed.push({id:id,label:t?t.label:id,type:"tool"});}});
    rM.forEach(function(id){if(!sel[id]){var m=lookupMed(id,actions&&actions.meds?actions.meds[id]:null);missed.push({id:id,label:m?m.label:id,type:"med"});}});
    if(onSkip)onSkip(missed,sel);else onDone(sel);
  };
  function tbg(u,o){if(!u)return"rgba(255,255,255,0.05)";return o?"rgba(0,184,148,0.12)":"rgba(255,165,0,0.1)";}
  function tbd(u,o){if(!u)return"2px solid rgba(255,255,255,0.08)";return o?"2px solid rgba(0,184,148,0.35)":"2px solid rgba(255,165,0,0.25)";}
  // Phase-4b-hotfix: registry lookup for the open popup, hoisted to
  // component scope so the popup's JSX header (label + optional custom
  // description) can reference it. Was previously trapped inside
  // popMarkItem's scope; the JSX referenced `meta` undeclared and
  // threw ReferenceError on every Phase 2 tile click.
  var popActionEntry=pop?(pop.ty==="t"?(actions&&actions.tools?actions.tools[pop.id]:null):(actions&&actions.meds?actions.meds[pop.id]:null)):null;
  var meta=pop?(pop.ty==="t"?lookupTool(pop.id,popActionEntry):lookupMed(pop.id,popActionEntry)):null;
  return(
    <div style={{marginTop:16}}>
      {/* Phase-2.6.3 change 7: action-tile grid mirrors the assess-tile
          grid (2 cols mobile, 3 at 768px, 4 at 1024px) so Phase 1 and
          Phase 2 share visual rhythm. Same gap (6), same padding (10),
          same borderRadius (12), same minHeight (78). */}
      <style>{"@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes lazyPulse{0%,100%{opacity:.4}50%{opacity:1}}@media(min-width:768px){.bw-action-grid{grid-template-columns:repeat(3,1fr) !important}}@media(min-width:1024px){.bw-action-grid{grid-template-columns:repeat(4,1fr) !important}}"}</style>
      {tools&&tools.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Tool Belt</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{tools.map(function(id){var t=lookupTool(id,actions&&actions.tools?actions.tools[id]:null);if(!t)return null;var u=!!sel[id];var o=actions&&actions.tools&&actions.tools[id]?actions.tools[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"t");}} className="bw-tap" style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:10,borderRadius:12,minHeight:78,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <ToolIcon name={id} size={26} color={u?(o?"#55efc4":"#FECA57"):"#4ECDC4"}/><span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{t.label}</span>
            {u&&<span style={{position:"absolute",top:6,right:6}}>{o?<Check size={12} color="#55efc4"/>:<Minus size={12} color="#FECA57"/>}</span>}</button>);})}</div></div>)}
      {meds&&meds.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Med Cart</div>
        <div className="bw-action-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>{meds.map(function(id){var m=lookupMed(id,actions&&actions.meds?actions.meds[id]:null);if(!m)return null;var u=!!sel[id];var o=actions&&actions.meds&&actions.meds[id]?actions.meds[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"m");}} className="bw-tap" style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:10,borderRadius:12,minHeight:78,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <div style={{width:26,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:medColor(id),fontSize:16,color:"white"}}><MedIcon type={lookupMedType(id)} size={18} color="white"/></div>
            <span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{m.label}</span>
            {u&&<span style={{position:"absolute",top:6,right:6}}>{o?<Check size={12} color="#55efc4"/>:<Minus size={12} color="#FECA57"/>}</span>}</button>);})}</div></div>)}
      {/* Phase-2.6.5 change 1: popup restructured into sticky header +
          scrolling body + sticky footer. Container uses display:flex
          column with maxHeight:85vh; only the body region scrolls so
          the badge row, label, and the Mark for Review / Got It buttons
          stay reachable regardless of body length (canonical MTP content
          can run 8+ bullets and previously pushed the buttons off screen).
          z-index bumped 50 → 1000 so the modal sits above all Phase 2
          content on every device. */}
      {pop&&(<div onClick={function(){setPop(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.7)"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{display:"flex",flexDirection:"column",width:"100%",maxWidth:"min(440px, 92vw)",maxHeight:"85vh",borderRadius:16,background:"#1a1a3e",border:"2px solid "+(pop.info.ok?"#00b894":"#ffa502"),animation:"popIn .25s ease-out",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
          {/* Header — sticky */}
          <div style={{padding:"16px 20px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:900,background:pop.info.ok?"rgba(0,184,148,0.2)":"rgba(255,165,2,0.2)",color:pop.info.ok?"#00b894":"#ffa502",display:"flex",alignItems:"center",gap:4}}>{pop.info.ok?<><Check size={14}/> APPROPRIATE</>:<><X size={14}/> NOT INDICATED NOW</>}</div>
              {pop.info.pri&&<div style={{padding:"4px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Priority #"+pop.info.pri}</div>}
            </div>
            <h4 style={{color:"white",fontWeight:700,marginTop:0,marginBottom:4}}>{meta?meta.label:pop.id}</h4>
            {meta&&meta.custom&&meta.description&&<p style={{fontSize:11,color:"#999",margin:0}}>{meta.description}</p>}
          </div>
          {/* Body — scrolls */}
          <div style={{padding:"14px 20px",overflowY:"auto",flex:1,minHeight:0}}>
            {/* Phase-5.3 sub-step E: synthesized-fallback popup shows
                a small loading state while the lazy fetch lands, then
                the freshly fetched fb. Error path offers a retry. */}
            {popLoading?(<div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",color:"#4ECDC4",fontSize:13}}>
              <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#4ECDC4",animation:"lazyPulse 1.4s ease-in-out infinite",flexShrink:0}}></span>
              <span style={{color:"#bbb"}}>Loading clinical context for this action...</span>
            </div>):popError?(<div style={{padding:"4px 0",color:"#ff9a9f",fontSize:12,lineHeight:1.5}}>
              {popError} <button onClick={retryPopFetch} style={{marginLeft:6,background:"none",border:"none",color:"#74b9ff",textDecoration:"underline",cursor:"pointer",fontSize:12}}>Retry</button>
            </div>):
            (pop.ty==="m"&&pop.id==="mtpActivate"?(<div>
              <TextBlock text={MTP_CANONICAL} style={{fontSize:13,color:"#ddd",lineHeight:1.55}}/>
              {pop.info.fb&&<div style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:"#888",fontWeight:700,marginBottom:6}}>Why for this patient</p>
                <TextBlock text={pop.info.fb} style={{fontSize:12,color:"#bbb",lineHeight:1.5}}/>
              </div>}
            </div>):(<TextBlock text={pop.info.fb} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/>))}
          </div>
          {/* Footer — sticky. Mark for Review (phase-2.6.3 change 8) +
              Got It dismiss. Always visible regardless of body scroll. */}
          <div style={{padding:"12px 20px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            {/* Phase-5.3 sub-step E: Mark for Review disabled while
                lazy fetch is in flight (the fb is still the synthesized
                placeholder; pinning it would store useless context for
                the deep-dive prompt). Re-enables once content lands. */}
            <button disabled={popLoading} onClick={function(){
              if(popLoading)return;
              var it=popMarkItem();
              if(!it)return;
              var transition=toggleMark(it);
              if(transition!=="added")return;
              var sc=usePlayerStore.getState().activeScenario;
              if(!sc)return;
              expandSingleMarkedItem(sc,it).then(function(text){
                if(text)usePlayerStore.getState().setDeepDive(it.id,text);
              }).catch(function(err){
                console.warn("[eager deep-dive] "+it.id+" — "+(err&&err.message||err));
              });
            }} style={{width:"100%",padding:"8px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:popLoading?"not-allowed":"pointer",background:popMarked?"rgba(254,202,87,0.2)":"rgba(255,255,255,0.06)",border:"1px solid "+(popMarked?"rgba(254,202,87,0.55)":"rgba(255,255,255,0.18)"),color:popMarked?"#FECA57":"#ddd",opacity:popLoading?0.45:1}}>{popMarked?"✓ Marked for Review":"Mark for Review"}</button>
            <p style={{fontSize:10,color:"#888",marginTop:6,marginBottom:10,textAlign:"center",lineHeight:1.4}}>{popLoading?"Available once details finish loading.":popMarked?"Will appear in the debrief with an expanded deep dive.":"Save this intervention for a deeper review at the end."}</p>
            <button onClick={function(){setPop(null);}} style={{width:"100%",padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:pop.info.ok?"rgba(0,184,148,0.3)":"rgba(255,165,2,0.2)",border:"none",cursor:"pointer"}}>Got It</button>
          </div>
        </div></div>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:"#666"}}>{explored+"/"+total+" explored"}</div>
        <div style={{display:"flex",gap:8}}>
          {!allF&&<button onClick={skip} style={{padding:"8px 16px",borderRadius:12,fontWeight:700,color:"#ccc",fontSize:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer"}}>Skip to Next</button>}
          {allF&&<button onClick={finish} style={{padding:"8px 20px",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:"linear-gradient(135deg,#4ECDC4,#44B09E)",border:"none",cursor:"pointer"}}>Continue</button>}
        </div>
      </div>
      {!allF&&explored>0&&<p style={{fontSize:11,color:"#4ECDC4",marginTop:8,opacity:0.7}}>Find all appropriate actions to continue, or Skip to move on.</p>}
    </div>);
}
