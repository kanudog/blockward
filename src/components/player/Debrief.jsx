import { useState, useEffect } from "react";
import { Trophy, Plus, Minus, Search, Check, Zap, Droplets, Bookmark, Lightbulb } from "lucide-react";
import { SceneStage } from "./SceneStage.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { ExplainBody } from "../shared/ExplainBody.jsx";
import { ChapterBar } from "../shared/ChapterBar.jsx";
import { ALL_TOOLS, ALL_MEDS, isCustomTool, isCustomMed } from "../../lib/scenarios/packs/index.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandMarkedItems } from "../../lib/ai/client.js";
import { replaceIdsWithLabels } from "../../lib/scenarios/labels.js";
import { resolveSlotText, kindToPromptType } from "../../lib/scenarios/slotResolve.js";
import { useTokens } from "../theme/themeStore.js";
import { GOOGLE_FONTS_CSS } from "../theme/tokens.js";

// Phase 6.0: parse a deep-dive content string into summary/body + TL;DR.
function parseDeepDiveContent(text){
  if(typeof text!=="string"||text.trim()==="")return null;
  var lines=text.split("\n");
  var tldrIdx=-1;
  for(var i=0;i<lines.length;i++){
    var trimmed=lines[i].trim();
    if(trimmed.indexOf("**TL;DR:**")===0||trimmed.indexOf("TL;DR:")===0){tldrIdx=i;break;}
  }
  var bodyLines=tldrIdx>=0?lines.slice(0,tldrIdx):lines.slice();
  var bodyText=bodyLines.join("\n").trim();
  var tldrText="";
  if(tldrIdx>=0){
    var tldrLines=lines.slice(tldrIdx).join("\n").trim();
    tldrText=tldrLines.replace(/^\*\*TL;DR:\*\*\s*/,"").replace(/^TL;DR:\s*/,"").trim();
  }
  return{body:bodyText,tldr:tldrText};
}

// Gate-1 rollout: token restyle + supportive grammar. The debrief opens on a
// small outcome-reveal beat (staged rise, paced by the theme), sections are
// framed and labeled, "missed" reads as amber take-another-look (never red),
// and every key takeaway is a collapsed tappable pill that expands inline.
export function Debrief(props){
  var t=useTokens();
  var sc=props.sc;var onDone=props.onDone;var onExit=props.onExit;
  var skippedActions=usePlayerStore(function(s){return s.skippedActions;});
  var assessHistory=usePlayerStore(function(s){return s.assessHistory;});
  var actionHistory=usePlayerStore(function(s){return s.actionHistory;});
  var markedForReview=usePlayerStore(function(s){return s.markedForReview;});
  var insightCards=usePlayerStore(function(s){return s.insightCards;});
  var deepDiveCache=usePlayerStore(function(s){return s.deepDiveCache;});
  var _expI=useState("marked");var expI=_expI[0];var setExpI=_expI[1];
  var _itemExp=useState({});var itemExp=_itemExp[0];var setItemExp=_itemExp[1];
  var toggleItem=function(k){setItemExp(function(p){var n=Object.assign({},p);n[k]=!n[k];return n;});};
  var _deepDives=useState({});var deepDives=_deepDives[0];var setDeepDives=_deepDives[1];
  var _deepStatus=useState("idle");var deepStatus=_deepStatus[0];var setDeepStatus=_deepStatus[1];
  var _deepError=useState(null);var deepError=_deepError[0];var setDeepError=_deepError[1];
  // Phase-2.6.5 change 3: smart progress banner (loading → success → gone).
  var _bannerPhase=useState("loading");var bannerPhase=_bannerPhase[0];var setBannerPhase=_bannerPhase[1];
  var _progress=useState(0);var progress=_progress[0];var setProgress=_progress[1];
  useEffect(function(){
    if(markedForReview.length===0)return;
    if(deepStatus!=="idle")return;
    // Phase-5.2.5 batch backstop: only fetch items the eager path missed.
    var needed=markedForReview.filter(function(item){return !deepDiveCache[item.id];});
    if(needed.length===0){setDeepStatus("done");return;}
    var internalItems=needed.map(function(item){
      return{
        id:item.id,
        label:item.label,
        type:kindToPromptType(item.kind),
        originalWhy:(item._slotRef?resolveSlotText(sc,item._slotRef):null)||""
      };
    });
    setDeepStatus("loading");
    var controller=new AbortController();
    expandMarkedItems(sc,internalItems,controller.signal).then(function(map){
      setDeepDives(map);setDeepStatus("done");
    }).catch(function(err){
      // Phase-3.0-hotfix change 5: AbortError = unmount cleanup, not failure.
      if (err && err.name === "AbortError") return;
      console.error("Deep-dive expansion failed:",err);
      setDeepError(err.message||"Could not load deep dive");
      setDeepStatus("error");
    });
    return function(){controller.abort();};
  },[markedForReview.length]);
  var retryDeepDives=function(){setDeepStatus("idle");setDeepError(null);};
  useEffect(function(){
    if(deepStatus==="loading"){setBannerPhase("loading");setProgress(0);}
    else if(deepStatus==="done"){
      setBannerPhase("success");setProgress(1);
      var timer=setTimeout(function(){setBannerPhase("gone");},1100);
      return function(){clearTimeout(timer);};
    }
    else if(deepStatus==="error"){setBannerPhase("error");}
  },[deepStatus]);
  // Smooth-fill toward 95% over ~80s while loading (never lies about done).
  useEffect(function(){
    if(bannerPhase!=="loading")return;
    var startedAt=Date.now();
    var timer=setInterval(function(){
      var elapsed=(Date.now()-startedAt)/1000;
      var p=Math.min(elapsed/80,0.95);
      setProgress(p);
    },250);
    return function(){clearInterval(timer);};
  },[bannerPhase]);
  var _tldrOpen=useState({});var tldrOpen=_tldrOpen[0];var setTldrOpen=_tldrOpen[1];
  var toggleTldr=function(key){setTldrOpen(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;});};
  // Build caught / missed / intervention lists from history (phase-2.5 issue 8).
  var caught=[];var missed=[];
  assessHistory.forEach(function(snap){
    snap.items.forEach(function(it){
      var entry={phase:snap.phaseName,label:it.label,why:it.why,bad:it.bad,userFlagged:it.userFlagged};
      var correct=it.userFlagged===it.bad;
      if(correct&&(it.userFlagged||it.bad))caught.push(entry);
      else if(!correct)missed.push(entry);
    });
  });
  var interventions=[];
  actionHistory.forEach(function(snap){
    var tools=snap.tools||[];var meds=snap.meds||[];var actions=snap.actions||{};var sel=snap.sel||{};
    tools.forEach(function(id){
      var info=actions.tools?actions.tools[id]:null;if(!info)return;
      var label=isCustomTool(id)?(info.label||id):(ALL_TOOLS[id]?ALL_TOOLS[id].label:id);
      interventions.push({phase:snap.phaseName,label:label,type:"tool",id:id,info:info,selected:!!sel[id],pri:info.pri,ok:!!info.ok});
    });
    meds.forEach(function(id){
      var info=actions.meds?actions.meds[id]:null;if(!info)return;
      var label=isCustomMed(id)?(info.label||id):(ALL_MEDS[id]?ALL_MEDS[id].label:id);
      interventions.push({phase:snap.phaseName,label:label,type:"med",id:id,info:info,selected:!!sel[id],pri:info.pri,ok:!!info.ok});
    });
  });
  var correctInt=interventions.filter(function(x){return x.ok;}).sort(function(a,b){return(a.pri||99)-(b.pri||99);});
  var wrongPicks=interventions.filter(function(x){return x.selected&&!x.ok;});
  function rise(i){return {opacity:0,animation:"bwRise .45s ease-out forwards",animationDelay:(0.12*i*t.revealMult).toFixed(2)+"s"};}
  function sectionShell(tone){
    var rgb=tone==="positive"?t.POS_RGB:tone==="attention"?t.ATTN_RGB:t.ACCENT_RGB;
    return {marginBottom:8,borderRadius:t.RADIUS.lg,overflow:"hidden",background:"rgba("+rgb+",0.07)",border:"1px solid rgba("+rgb+",0.28)"};
  }
  function sectionHead(open,toneColor,Icon,text,onClick){
    return(<button onClick={onClick} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,fontFamily:t.FONT.body}}>
      <span style={{fontWeight:700,fontSize:14,color:toneColor,display:"flex",alignItems:"center",gap:6}}><Icon size={14}/>{text}</span>
      <span style={{color:toneColor}}>{open?<Minus size={16}/>:<Plus size={16}/>}</span></button>);
  }
  function takeawayPill(key,tldr){
    if(!tldr)return null;
    var open=!!tldrOpen[key];
    return(<div style={{marginTop:8}}>
      <button onClick={function(){toggleTldr(key);}} style={Object.assign({},t.chip("attention"),{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,fontSize:10.5,padding:"4px 10px",border:"1px solid rgba("+t.ATTN_RGB+",0.5)"})}>
        <span>Key takeaway</span><span>{open?"−":"+"}</span></button>
      {open&&<div style={{marginTop:8,paddingLeft:10,borderLeft:"3px solid "+t.COLOR.attention}}>
        <TextBlock text={tldr} style={{fontSize:12.5,color:t.COLOR.ink,fontWeight:600,lineHeight:1.55}}/>
      </div>}
    </div>);
  }
  return(<div style={{minHeight:"100dvh",padding:16,background:t.BG_APP,color:t.COLOR.ink,fontFamily:t.FONT.body}}>
    <style>{GOOGLE_FONTS_CSS+"@keyframes bwRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes deepPulse{0%,100%{opacity:0.6}50%{opacity:1}}.bw-deep-loading{animation:deepPulse 1.6s ease-in-out infinite}@keyframes bwMedal{0%{opacity:0;transform:scale(0.4)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}"}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:14}}>
      <button onClick={onExit} style={{color:t.COLOR.ink3,fontSize:12,background:"none",border:"none",cursor:"pointer",fontFamily:t.FONT.body,padding:"4px 2px"}}>Exit</button>
      <ChapterBar stage="debrief" phaseIndex={0}/>
    </div>
    {/* Outcome-reveal beat: medallion → figure → heading → the rest, staged
        and paced by the theme — a moment of resolution, not a score. */}
    <div style={rise(0)}>
      <SceneStage sc={sc} height={240}/>
    </div>
    <div style={{textAlign:"center",marginTop:-24}}>
      <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:48,height:48,borderRadius:24,background:"rgba("+t.POS_RGB+",0.14)",border:"2.5px solid "+t.COLOR.positive,boxShadow:"0 6px 18px rgba("+t.POS_RGB+",0.30)",opacity:0,animation:"bwMedal 0.6s ease-out "+(0.25*t.revealMult).toFixed(2)+"s forwards"}}>
        <Check size={22} color={t.COLOR.positive}/>
      </div>
    </div>
    <div style={Object.assign({textAlign:"center",margin:"10px 0 18px"},rise(2))}>
      <h2 style={{fontSize:24,fontWeight:600,fontFamily:t.FONT.display,margin:0,color:t.COLOR.ink}}>Run complete.</h2>
      <p style={{fontSize:13,color:t.COLOR.ink2,marginTop:6,marginBottom:0}}>Here's what this one leaves you with.</p>
    </div>
    <div style={Object.assign({},t.surface("card"),{padding:t.SPACE.pad,marginBottom:14},rise(3))}>
      <div style={Object.assign({},t.label(),{marginBottom:6})}>Your mentor</div>
      <ExplainBody raw={sc.debrief.summary} style={{fontSize:13,lineHeight:1.6}}/>
    </div>
    {/* Phase 4 (#7): the run's collected insight cards — keepsakes that
        persist with the learner (durable collection is engine-side). */}
    {insightCards.length>0&&<div style={rise(4)}>
      <div style={Object.assign({},t.label(),{margin:"0 2px 3px"})}>{"Insight cards · collected this run ("+insightCards.length+")"}</div>
      <div style={{fontSize:10.5,color:t.COLOR.ink3,margin:"0 2px 8px",lineHeight:1.4}}>The small takeaways this run left you — collected automatically as you played, yours to keep. Never scored.</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6,marginBottom:12}}>
        {insightCards.map(function(card){
          return(<div key={card.id} style={Object.assign({},t.surface("card"),{width:185,flexShrink:0,padding:12})}>
            <div style={{width:26,height:26,borderRadius:13,background:"rgba("+t.ACCENT_RGB+",0.14)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Lightbulb size={14} color={t.COLOR.accent}/>
            </div>
            <div style={{fontFamily:t.FONT.display,fontSize:13,fontWeight:700,color:t.COLOR.ink,marginTop:8,lineHeight:1.25}}>{card.title}</div>
            <div style={{marginTop:4}}>
              <ExplainBody raw={card.body} style={{fontSize:11,lineHeight:1.5}}/>
            </div>
            <div style={{marginTop:9}}><span style={t.chip("accent")}>Keeper</span></div>
          </div>);
        })}
      </div>
    </div>}
    {/* Marked for review — top-most, default expanded (phase-2.6 group D). */}
    {markedForReview.length>0&&<div style={Object.assign({},sectionShell("attention"),rise(3))}>
      {sectionHead(expI==="marked",t.COLOR.attentionText,Bookmark,"Marked for review ("+markedForReview.length+")",function(){setExpI(expI==="marked"?null:"marked");})}
      {expI==="marked"&&<div style={{padding:"0 12px 12px"}}>
        <p style={{fontSize:11,color:t.COLOR.ink3,margin:"0 0 8px"}}>Your revisit list — nothing here is graded.</p>
        {bannerPhase==="loading"&&<div style={{padding:12,marginBottom:8,borderRadius:8,background:"rgba("+t.ATTN_RGB+",0.10)",border:"1px solid rgba("+t.ATTN_RGB+",0.30)",fontSize:12,color:t.COLOR.attentionText,lineHeight:1.5}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span className="bw-deep-loading" style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:t.COLOR.attention,flexShrink:0}}></span>
            <span>Original notes shown below — deeper reads are on their way for what you marked.</span>
          </div>
          <div style={{height:4,borderRadius:2,background:"rgba("+t.ATTN_RGB+",0.18)",overflow:"hidden"}}>
            <div style={{height:"100%",width:Math.round(progress*100)+"%",background:t.COLOR.attention,transition:"width 0.25s linear"}}></div>
          </div>
        </div>}
        {bannerPhase==="success"&&<div style={{padding:12,marginBottom:8,borderRadius:8,background:"rgba("+t.POS_RGB+",0.10)",border:"1px solid rgba("+t.POS_RGB+",0.30)",fontSize:12,color:t.COLOR.positiveText,lineHeight:1.5}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Check size={14}/>
            <span>Deep dives ready.</span>
          </div>
          <div style={{height:4,borderRadius:2,background:"rgba("+t.POS_RGB+",0.18)",overflow:"hidden"}}>
            <div style={{height:"100%",width:"100%",background:t.COLOR.positive,transition:"width 0.3s ease-out"}}></div>
          </div>
        </div>}
        {bannerPhase==="error"&&<div style={{padding:10,marginBottom:8,borderRadius:8,background:"rgba("+t.ATTN_RGB+",0.10)",border:"1px solid rgba("+t.ATTN_RGB+",0.35)",fontSize:11,color:t.COLOR.attentionText}}>
          Couldn't prepare the deeper reads — your original notes are below. <button onClick={retryDeepDives} style={{marginLeft:6,background:"none",border:"none",color:t.COLOR.boldTerm,textDecoration:"underline",cursor:"pointer",fontSize:11}}>Retry</button>
        </div>}
        {/* Phase-2.6.4 change 4: each marked item is its own collapsible row. */}
        {markedForReview.map(function(item,i){
          var k="marked:"+i;
          var open=!!itemExp[k];
          var deep=deepDiveCache[item.id]||deepDives[item.id];
          var typeChip=item.kind||item.type||"";
          var fallbackText=(item._slotRef?resolveSlotText(sc,item._slotRef):null)||"No additional content available.";
          return(<div key={k} style={{marginBottom:6,borderRadius:8,background:t.mode==="dark"?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.7)",border:"1px solid rgba("+t.ATTN_RGB+",0.28)",overflow:"hidden"}}>
            <button onClick={function(){toggleItem(k);}} style={{width:"100%",textAlign:"left",padding:"8px 10px",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,fontFamily:t.FONT.body}}>
              <span style={{fontSize:12,fontWeight:700,color:t.COLOR.ink,flex:1,minWidth:0}}>{item.label}<span style={{fontSize:9,color:t.COLOR.ink3,fontWeight:600,marginLeft:6,textTransform:"uppercase",letterSpacing:0.5}}>{typeChip}</span></span>
              <span style={{color:t.COLOR.attentionText,flexShrink:0}}>{open?<Minus size={12}/>:<Plus size={12}/>}</span>
            </button>
            {open&&<div style={{padding:"0 10px 10px"}}>
              {(function(){
                var parsedDeep=deep?parseDeepDiveContent(deep):null;
                if(parsedDeep)return(<div>
                  <ExplainBody raw={parsedDeep.body} style={{fontSize:12,lineHeight:1.6}}/>
                  {takeawayPill(k,parsedDeep.tldr)}
                </div>);
                return <TextBlock text={fallbackText} style={{fontSize:12,color:t.COLOR.ink3,lineHeight:1.5}}/>;
              })()}
            </div>}
          </div>);
        })}
      </div>}
    </div>}
    {/* Review — collapsible subsections (phase-2.5 issue 8). */}
    {caught.length>0&&<div style={Object.assign({},sectionShell("positive"),rise(4))}>
      {sectionHead(expI==="caught",t.COLOR.positiveText,Check,"What you caught ("+caught.length+")",function(){setExpI(expI==="caught"?null:"caught");})}
      {expI==="caught"&&<div style={{padding:"0 12px 12px"}}>
        {caught.map(function(it,i){var k="caught:"+i;var open=!!itemExp[k];return(<div key={k} style={{marginBottom:6,borderRadius:8,background:t.mode==="dark"?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.7)",border:"1px solid rgba("+t.POS_RGB+",0.28)",overflow:"hidden"}}>
          <button onClick={function(){toggleItem(k);}} style={{width:"100%",textAlign:"left",padding:"8px 10px",background:"none",border:"none",cursor:it.why?"pointer":"default",color:t.COLOR.ink,display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,fontFamily:t.FONT.body}}>
            <span style={{fontSize:12,fontWeight:700,color:t.COLOR.ink,flex:1}}>{it.label}</span>
            <span style={{fontSize:9,color:t.COLOR.ink3}}>{it.phase}</span>
            {it.why&&<span style={{color:t.COLOR.positiveText,marginLeft:4}}>{open?<Minus size={12}/>:<Plus size={12}/>}</span>}
          </button>
          {open&&it.why&&<div style={{padding:"0 10px 10px"}}><ExplainBody raw={it.why} style={{fontSize:11,lineHeight:1.5}}/></div>}
        </div>);})}
      </div>}
    </div>}
    {missed.length>0&&<div style={Object.assign({},sectionShell("attention"),rise(5))}>
      {sectionHead(expI==="missed",t.COLOR.attentionText,Search,"Worth another look ("+missed.length+")",function(){setExpI(expI==="missed"?null:"missed");})}
      {expI==="missed"&&<div style={{padding:"0 12px 12px"}}>
        {missed.map(function(it,i){var k="missed:"+i;var open=!!itemExp[k];var note=it.bad?"You didn't flag this one — the note below shows what it was signalling.":"You flagged this, but it sat within range for this profile. Flagging a hunch costs nothing.";return(<div key={k} style={{marginBottom:6,borderRadius:8,background:t.mode==="dark"?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.7)",border:"1px solid rgba("+t.ATTN_RGB+",0.28)",overflow:"hidden"}}>
          <button onClick={function(){toggleItem(k);}} style={{width:"100%",textAlign:"left",padding:"8px 10px",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,fontFamily:t.FONT.body}}>
            <span style={{fontSize:12,fontWeight:700,color:t.COLOR.ink,flex:1}}>{it.label}</span>
            <span style={{fontSize:9,color:t.COLOR.ink3}}>{it.phase}</span>
            <span style={{color:t.COLOR.attentionText,marginLeft:4}}>{open?<Minus size={12}/>:<Plus size={12}/>}</span>
          </button>
          {open&&<div style={{padding:"0 10px 10px"}}>
            <p style={{fontSize:11,color:t.COLOR.attentionText,lineHeight:1.5,marginTop:0,marginBottom:0}}>{note}</p>
            {it.why&&<ExplainBody raw={it.why} style={{fontSize:11,lineHeight:1.5,marginTop:4}}/>}
          </div>}
        </div>);})}
      </div>}
    </div>}
    {interventions.length>0&&<div style={Object.assign({},sectionShell("accent"),rise(6))}>
      {sectionHead(expI==="int",t.COLOR.boldTerm,Zap,"Your plan ("+correctInt.length+" key steps)",function(){setExpI(expI==="int"?null:"int");})}
      {expI==="int"&&<div style={{padding:"0 12px 12px"}}>
        <div style={Object.assign({},t.label(),{marginTop:4,marginBottom:6})}>Key steps</div>
        {correctInt.length===0?<p style={{fontSize:11,color:t.COLOR.ink3}}>No key steps in this run.</p>:correctInt.map(function(x,i){var chosen=x.selected;return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:8,background:chosen?"rgba("+t.POS_RGB+",0.10)":"rgba("+t.ATTN_RGB+",0.08)",border:"1px solid "+(chosen?"rgba("+t.POS_RGB+",0.30)":"rgba("+t.ATTN_RGB+",0.30)")}}>
          {chosen?<Check size={14} color={t.COLOR.positive}/>:<Minus size={14} color={t.COLOR.attention}/>}
          <span style={{fontSize:12,fontWeight:700,color:t.COLOR.ink,flex:1}}>{x.label}</span>
          {x.pri&&<span style={{fontSize:9,color:t.COLOR.ink3}}>{"Priority #"+x.pri}</span>}
          <span style={{fontSize:9,color:t.COLOR.ink3}}>{x.phase}</span>
        </div>);})}
        {wrongPicks.length>0&&<div>
          <div style={Object.assign({},t.label(),{marginTop:10,marginBottom:6})}>Picks that weren't needed</div>
          {wrongPicks.map(function(x,i){return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:8,background:"rgba("+t.ATTN_RGB+",0.08)",border:"1px solid rgba("+t.ATTN_RGB+",0.30)"}}>
            <Minus size={14} color={t.COLOR.attention}/>
            <span style={{fontSize:12,fontWeight:700,color:t.COLOR.ink,flex:1}}>{x.label}</span>
            <span style={{fontSize:9,color:t.COLOR.ink3}}>{x.phase}</span>
          </div>);})}
        </div>}
      </div>}
    </div>}
    {(sc.stabilizationSummary||sc.debrief.summary)&&<div style={Object.assign({},sectionShell("positive"),{marginBottom:16},rise(7))}>
      {sectionHead(expI==="outcome",t.COLOR.positiveText,Trophy,"Outcome",function(){setExpI(expI==="outcome"?null:"outcome");})}
      {expI==="outcome"&&<div style={{padding:"0 12px 12px"}}>
        <TextBlock text={replaceIdsWithLabels(sc.stabilizationSummary||sc.debrief.summary)} style={{fontSize:12,color:t.COLOR.ink2,lineHeight:1.6}}/>
      </div>}
    </div>}
    {/* Lab review */}
    {(function(){
      var allLabs=[];
      sc.phases.forEach(function(p){if(p.labs){p.labs.forEach(function(l){if(l.critical&&l.why)allLabs.push({lab:l,phase:p.name});});}});
      if(sc.curveball&&sc.curveball.labs){sc.curveball.labs.forEach(function(l){if(l.critical&&l.why)allLabs.push({lab:l,phase:"Event: "+sc.curveball.name});});}
      if(allLabs.length===0)return null;
      return(<div style={{marginBottom:12}}>
        <div style={sectionShell("attention")}>
          {sectionHead(expI==="labrev",t.COLOR.attentionText,Droplets,"Lab review — out-of-range values explained",function(){setExpI(expI==="labrev"?null:"labrev");})}
          {expI==="labrev"&&<div style={{padding:"0 12px 12px"}}>
            {allLabs.map(function(entry,i){var k="lab:"+i;var open=!!itemExp[k];return(
              <div key={k} style={{marginBottom:8,borderRadius:8,background:t.mode==="dark"?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.7)",border:"1px solid rgba("+t.ATTN_RGB+",0.22)",overflow:"hidden"}}>
                <button onClick={function(){toggleItem(k);}} style={{width:"100%",textAlign:"left",padding:"8px 10px",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,fontFamily:t.FONT.body}}>
                  <span style={{fontSize:13,fontWeight:700,color:t.COLOR.ink,flex:1}}>{entry.lab.name+": "+entry.lab.value+" "+entry.lab.unit}</span>
                  <span style={{fontSize:9,color:t.COLOR.ink3}}>{"Ref "+entry.lab.ref}</span>
                  <span style={{color:t.COLOR.attentionText,marginLeft:4}}>{open?<Minus size={12}/>:<Plus size={12}/>}</span>
                </button>
                {open&&<div style={{padding:"0 10px 10px"}}>
                  <div style={{fontSize:9,color:t.COLOR.ink3,marginBottom:4}}>{entry.phase}</div>
                  <ExplainBody raw={entry.lab.why} style={{fontSize:12,lineHeight:1.5}}/>
                </div>}
              </div>
            );})}
          </div>}
        </div>
      </div>);
    })()}
    {/* Phase 6.1: Key Teaching bullets. */}
    {Array.isArray(sc.debrief.keyTeaching)&&sc.debrief.keyTeaching.length>0&&(<div style={{marginBottom:16}}>
      <h3 style={{fontSize:16,fontWeight:600,fontFamily:t.FONT.display,color:t.COLOR.ink,marginBottom:8,marginTop:0}}>Key teaching</h3>
      <div style={Object.assign({},t.surface("card"),{padding:t.SPACE.pad})}>
        <TextBlock text={sc.debrief.keyTeaching.map(function(kt){return "- "+String(kt||"");}).join("\n")} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.6}}/>
      </div>
    </div>)}
    <h3 style={{fontSize:16,fontWeight:600,fontFamily:t.FONT.display,color:t.COLOR.ink,marginBottom:10,marginTop:0}}>Deep dives</h3>
    {/* Phase 6.0: prefer schema 5.4.1 physiologyDeepDive[]; fall back to legacy
        explainers[]. Key takeaways render as collapsed tappable pills. */}
    {(Array.isArray(sc.debrief.physiologyDeepDive)&&sc.debrief.physiologyDeepDive.length>0)
      ?sc.debrief.physiologyDeepDive.map(function(d,i){
        var parsed=parseDeepDiveContent(d.content);
        var hasBody=parsed&&parsed.body;
        return(<div key={"pdd"+i} style={Object.assign({},t.surface("card"),{marginBottom:10,overflow:"hidden"})}>
          <button onClick={function(){setExpI(expI==="pdd"+i?null:"pdd"+i);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,fontFamily:t.FONT.body}}>
            <span style={{fontWeight:600,fontSize:13.5,fontFamily:t.FONT.display}}>{d.title||"Deep dive"}</span><span style={{color:t.COLOR.boldTerm}}>{expI==="pdd"+i?<Minus size={16}/>:<Plus size={16}/>}</span></button>
          {expI==="pdd"+i&&<div style={{padding:"0 12px 12px"}}>
            {hasBody
              ?<ExplainBody raw={parsed.body} style={{fontSize:13,lineHeight:1.6}}/>
              :<p style={{fontSize:12,color:t.COLOR.ink3,fontStyle:"italic",lineHeight:1.5,margin:0}}>Preparing…</p>}
            {parsed&&takeawayPill("pdd"+i,parsed.tldr)}
          </div>}
        </div>);
      })
      :(Array.isArray(sc.debrief.explainers)?sc.debrief.explainers:[]).map(function(e,i){return(<div key={i} style={Object.assign({},t.surface("card"),{marginBottom:10,overflow:"hidden"})}>
        <button onClick={function(){setExpI(expI===i?null:i);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,fontFamily:t.FONT.body}}>
          <span style={{fontWeight:600,fontSize:13.5,fontFamily:t.FONT.display}}>{e.title}</span><span style={{color:t.COLOR.boldTerm}}>{expI===i?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI===i&&<div style={{padding:"0 12px 12px"}}>
          <ExplainBody raw={{plain:e.tldr,detail:e.content}} style={{fontSize:13,lineHeight:1.6}}/>
          {takeawayPill("e"+i,e.tldr)}
        </div>}</div>);})}
    {sc.curveball&&sc.curveball.teaches&&(<div><h3 style={{fontSize:16,fontWeight:600,fontFamily:t.FONT.display,color:t.COLOR.ink,marginTop:16,marginBottom:10}}>Event deep dive</h3>
      {sc.curveball.teaches.map(function(te,i){var k="c"+i;return(<div key={k} style={Object.assign({},t.surface("card"),{marginBottom:10,overflow:"hidden"})}>
        <button onClick={function(){setExpI(expI===k?null:k);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:t.COLOR.ink,fontFamily:t.FONT.body}}>
          <span style={{fontWeight:600,fontSize:13.5,fontFamily:t.FONT.display}}>{te.title}</span><span style={{color:t.COLOR.boldTerm}}>{expI===k?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI===k&&<div style={{padding:"0 12px 12px"}}>
          <ExplainBody raw={{plain:te.tldr,detail:te.content}} style={{fontSize:13,lineHeight:1.6}}/>
          {takeawayPill(k,te.tldr)}
        </div>}</div>);})}</div>)}
    {skippedActions&&skippedActions.length>0&&<div style={{marginBottom:16,marginTop:8,borderRadius:t.RADIUS.md,padding:12,background:"rgba("+t.ATTN_RGB+",0.08)",border:"1px solid rgba("+t.ATTN_RGB+",0.28)"}}>
      <div style={{fontSize:12,fontWeight:700,color:t.COLOR.attentionText,marginBottom:6}}>Steps you skipped this run:</div>
      <ul style={{margin:0,paddingLeft:18,fontSize:12,color:t.COLOR.ink2,lineHeight:1.5}}>
        {skippedActions.map(function(a,i){return <li key={i}>{a.label}{a.phase?" ("+a.phase+")":""}</li>;})}
      </ul>
    </div>}
    <button onClick={function(){onDone();onExit();}} style={Object.assign({},t.cta("primary"),{marginTop:8})}>Back to home</button></div></div>);
}
