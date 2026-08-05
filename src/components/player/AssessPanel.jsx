import { useState } from "react";
import { VitalsDisplay } from "./VitalsDisplay.jsx";
import { FocusedExam } from "./FocusedExam.jsx";
import { LabPanel } from "./LabPanel.jsx";
import { WhyModal } from "../shared/WhyModal.jsx";
import { TextBlock } from "../shared/TextBlock.jsx";
import { PatientHeader } from "./PatientHeader.jsx";
import { Section } from "../shared/Section.jsx";
import { Eye, EyeOff } from "lucide-react";
import { useTokens } from "../theme/themeStore.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { buildBadMap, vitalCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { expectedRangesFor } from "../../lib/scenarios/ranges.js";

// The assessment screen — de-sanitized from the fable EvaluationPanel. The
// enhanced UX (collapsible task sections, the character examine loop as the
// hero, the monitor ITSELF as the flag surface, hint-pill reference ranges,
// synthesis beat, insight award) rides on the REAL data plumbing (real vital
// keys, vitalCanonicalId, buildBadMap over {vitals,signs,labs}, real slot
// refs). Cap refill is findings-only (surfaced in the examine loop), so the
// flag targets are HR / SpO₂ / RR / BP / Temp. The real round-2 "what changed"
// value-diff banner is preserved.
function vVal(v){if(v==null||v==="")return v;if(typeof v==="object")return v.value;return v;}

var CH_KEYS=["hr","spo2","rr","sbp","temp"];
var CH_LABELS={hr:"HR",spo2:"SpO₂",rr:"RR",sbp:"BP",temp:"Temp"};

// Compact tile view of the monitor vitals, for the round-2 change diff.
function monitorTiles(vitObj){
  if(!vitObj)return [];
  var out=[];
  if(vitObj.hr!==undefined)out.push({key:"hr",label:"HR",value:vVal(vitObj.hr)});
  if(vitObj.spo2!==undefined)out.push({key:"spo2",label:"SpO₂",value:vVal(vitObj.spo2)});
  if(vitObj.rr!==undefined)out.push({key:"rr",label:"RR",value:vVal(vitObj.rr)});
  if(vitObj.bp!==undefined)out.push({key:"bp",label:"BP",value:vVal(vitObj.bp)});
  else if(vitObj.sbp!==undefined&&vitObj.dbp!==undefined)out.push({key:"sbp",label:"BP",value:vVal(vitObj.sbp)+"/"+vVal(vitObj.dbp)});
  if(vitObj.temp!==undefined)out.push({key:"temp",label:"Temp",value:vVal(vitObj.temp)});
  return out;
}

export function AssessPanel(props){
  var t=useTokens();
  var ph=props.ph;var vit=props.vit||{};var curSigns=props.curSigns||[];var curLabs=props.curLabs||[];
  var flags=props.flags;var showFb=props.showFb;var submit=props.submit;var afterA=props.afterA;var flag=props.flag;
  var sc=props.sc;
  var patient=props.patient||(sc&&sc.patient)||{};
  var prevAssess=props.prevAssess||null;
  var phaseIdx=props.phaseIdx!==undefined?props.phaseIdx:0;
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  // Owner direction 2026-08-05: every section starts COLLAPSED. The learner
  // opens Exam, Vitals and Labs in whatever order they want to work — nothing
  // is pre-opened for them. (secOpen still force-opens everything post-submit
  // so the reveal shows all three at once.)
  var _open=useState(null);var openSec=_open[0];var setOpenSec=_open[1];
  var _hint=useState(false);var hint=_hint[0];var setHint=_hint[1];
  var hypotheses=usePlayerStore(function(s){return s.hypotheses;});
  var setHypothesis=usePlayerStore(function(s){return s.setHypothesis;});
  var addInsightCard=usePlayerStore(function(s){return s.addInsightCard;});
  function onSubmit(){
    submit();
    if(ph&&ph.insight)addInsightCard(ph.insight);
  }
  function secOpen(key){if(showFb)return true;return openSec===key;}
  function toggleSec(key){setOpenSec(openSec===key?null:key);}
  var badMap = buildBadMap(Object.assign({}, ph, {labs: curLabs, signs: curSigns}));
  // Prefer the case's authored norms (expectedRangesFor reads sc.norms), else
  // the age band. Reveal-after-commit is handled by showRanges below.
  var ranges = expectedRangesFor(sc||patient);
  var flaggedKeys={};
  CH_KEYS.forEach(function(k){ if(flags[vitalCanonicalId(k)])flaggedKeys[k]=true; });
  function onFlagKey(k){ flag(vitalCanonicalId(k)); }
  function chDisplayValue(k){
    if(k==="sbp"){
      if(vit.bp!==undefined&&vit.bp!==null&&vit.bp!=="")return vVal(vit.bp);
      var s=vVal(vit.sbp);var d=vVal(vit.dbp);
      if(s!==undefined&&d!==undefined)return String(s)+"/"+String(d);
      return "";
    }
    return vVal(vit[k]);
  }
  function onWhyKey(k){
    var cid=vitalCanonicalId(k);
    var match=badMap[cid]||null;
    var why=(match&&match.why)||"No additional explanation available for this observation.";
    setWhyTarget({_kind:"vital",label:CH_LABELS[k]+" "+chDisplayValue(k),why:why,_match:match,cid:cid,_anomalous:!!(match&&match.bad)});
  }
  // Round-2 "what changed" value diff (preserved real feature). Vitals match by
  // monitor key; labs by id/name. Numeric movers get a direction arrow.
  function _numCh(x){var n=parseFloat(x);return isNaN(n)?null:n;}
  // Play-test fix 2026-07-29: generated phases store `vitals` as an ARRAY of
  // {id,value,...}, but this function indexed it like an object (pv[m.key]), so
  // every lookup was undefined and EVERY vital was skipped — the round-2
  // "what's changed" strip showed labs only. In a TBI case that hid a widening
  // pulse pressure (158/68 -> 168/58), the single most important trend on the
  // screen. Normalize array or object into a plain key->value map first.
  function normalizeVitals(v){
    if(!v)return {};
    if(!Array.isArray(v))return v;
    var o={};
    v.forEach(function(entry){ if(entry&&entry.id!==undefined)o[entry.id]=entry.value!==undefined?entry.value:entry; });
    return o;
  }
  function computeRoundChanges(prevPhase){
    if(!prevPhase)return [];
    var out=[];var pv=normalizeVitals(prevPhase.vitals);
    monitorTiles(vit).forEach(function(m){
      var prevRaw=pv[m.key];
      if(prevRaw===undefined&&m.key==="sbp"&&pv.bp!==undefined)prevRaw=pv.bp;
      if(prevRaw===undefined&&m.key==="bp"&&pv.sbp!==undefined&&pv.dbp!==undefined)prevRaw=vVal(pv.sbp)+"/"+vVal(pv.dbp);
      if(prevRaw===undefined||prevRaw===null)return;
      var prevVal=vVal(prevRaw);
      if(prevVal===undefined||prevVal===null||prevVal===""||String(prevVal)===String(m.value))return;
      var pn=_numCh(prevVal),cn=_numCh(m.value);
      var dir=(pn!=null&&cn!=null)?(cn>pn?"up":(cn<pn?"down":"same")):"same";
      out.push({label:m.label,from:prevVal,to:m.value,dir:dir});
    });
    var prevLabs=prevPhase.labs||[];
    (curLabs||[]).forEach(function(l){
      if(!l)return;
      var p=null;
      for(var j=0;j<prevLabs.length;j++){var q=prevLabs[j];if(q&&((l.id&&q.id===l.id)||(l.name&&q.name===l.name))){p=q;break;}}
      if(!p||p.value===undefined||p.value===null||String(p.value)===String(l.value))return;
      var pn2=_numCh(p.value),cn2=_numCh(l.value);
      var dir2=(pn2!=null&&cn2!=null)?(cn2>pn2?"up":(cn2<pn2?"down":"same")):"same";
      out.push({label:l.name,from:p.value,to:l.value,dir:dir2});
    });
    return out;
  }
  var roundChanges=prevAssess?computeRoundChanges(prevAssess):[];
  function hintRow(){
    if(showFb)return null;
    var st={display:"inline-flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:t.FONT.body,transition:"all 0.15s ease",background:"transparent",border:"1px solid "+t.COLOR.hairline,color:t.COLOR.ink3,flexShrink:0};
    if(hint)st=Object.assign({},st,{background:"rgba("+t.ACCENT_RGB+",0.12)",border:"1px solid rgba("+t.ACCENT_RGB+",0.45)",color:t.COLOR.boldTerm});
    return(<div style={{display:"flex",alignItems:"center",gap:8,margin:"0 2px 12px"}}>
      <button className="bw-tap" onClick={function(){setHint(!hint);}} style={st}>
        {hint?<EyeOff size={12}/>:<Eye size={12}/>}{hint?"Hide reference ranges":"Show reference ranges"}
      </button>
      <span style={{fontSize:10.5,color:t.COLOR.ink3,fontFamily:t.FONT.body}}>covers the monitor and the results</span>
    </div>);
  }
  return(<div className="slu" style={{fontFamily:t.FONT.body}}>
    <div style={{marginBottom:12}}>
      <PatientHeader patient={patient}/>
      {ph&&ph.narrative&&<div style={Object.assign({},t.surface("base"),{marginTop:8,padding:"10px 12px"})}>
        <TextBlock text={ph.narrative} style={{fontSize:13,color:t.COLOR.ink2,lineHeight:1.55}}/>
      </div>}
    </div>
    {prevAssess&&roundChanges.length>0&&<div style={{marginBottom:12,borderRadius:t.RADIUS.lg,padding:"10px 12px",background:"rgba("+t.ATTN_RGB+",0.10)",border:"1px solid rgba("+t.ATTN_RGB+",0.35)"}}>
      <div style={Object.assign({},t.label(),{color:t.COLOR.attentionText,marginBottom:7})}>What's changed since round 1</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {roundChanges.map(function(c,i){
          var arrow=c.dir==="up"?"▲":c.dir==="down"?"▼":"→";
          return(<span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,color:t.COLOR.ink2,background:t.COLOR.btnNeutralBg,border:"1px solid "+t.COLOR.hairline,borderRadius:20,padding:"4px 10px",fontFamily:t.FONT.body}}>
            <span style={{fontWeight:700}}>{c.label}</span>
            <span style={{color:t.COLOR.ink3}}>{c.from}</span>
            <span style={{color:t.COLOR.attentionText,fontWeight:800}}>{arrow}</span>
            <span style={{color:t.COLOR.attentionText,fontWeight:800}}>{c.to}</span>
          </span>);
        })}
      </div>
    </div>}
    <div style={{margin:"0 2px 12px"}}>
      <div style={{fontFamily:t.FONT.display,fontSize:16,fontWeight:600,color:t.COLOR.ink,lineHeight:1.35}}>
        {showFb?"Here's how your read landed.":"Find what sits outside the expected range."}
      </div>
      <div style={{fontSize:12,color:t.COLOR.ink3,marginTop:3}}>
        {showFb?"Amber means take a look — nothing here is a score.":"No timer — take the time you need."}
      </div>
    </div>
    {hintRow()}
    {/* Owner direction 2026-07-29: findings are exploration, not a hunt. The
        monitor and the labs are where the learner commits to a judgement; the
        exam is where they build the picture. The copy now says so. */}
    <Section title="Exam" task="Assess the patient." open={secOpen("char")} onToggle={function(){toggleSec("char");}}>
      <FocusedExam signs={curSigns} phaseIdx={phaseIdx} sc={sc}
        cycleRate={parseFloat(vVal(vit.rr))||22} responseSec={parseFloat(vVal(vit.cap))||1.5}/>
    </Section>
    <Section title="Vitals" task="Tap each value you think sits outside its expected range." open={secOpen("tele")} onToggle={function(){toggleSec("tele");}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <VitalsDisplay vitals={vit} reveal={showFb} judged={showFb}
          flaggedKeys={flaggedKeys} onFlagKey={showFb?undefined:onFlagKey} onWhyKey={onWhyKey}
          ranges={ranges} showRanges={hint||showFb}/>
      </div>
      {showFb&&<div style={{fontSize:11,color:t.COLOR.ink3,marginTop:8,lineHeight:1.4}}>
        Tap an amber value to read why it mattered.
      </div>}
    </Section>
    <Section title="Labs" task="Tap any result that looks out of range." open={secOpen("res")} onToggle={function(){toggleSec("res");}}>
      <LabPanel labs={curLabs} badMap={badMap} flags={flags} onFlag={flag} showFb={showFb} phaseIdx={phaseIdx} showRef={hint||showFb}/>
    </Section>
    {showFb&&ph&&ph.synthesis&&(function(){
      var syn=ph.synthesis;
      var chosen=hypotheses[phaseIdx];
      var chosenOpt=null;
      syn.options.forEach(function(o){if(o.id===chosen)chosenOpt=o;});
      return(<div style={Object.assign({},t.surface("card"),{padding:t.SPACE.pad,marginBottom:12})} className="slu">
        <div style={t.label()}>Your mentor · one more step</div>
        <div style={{fontSize:13.5,fontWeight:700,color:t.COLOR.ink,fontFamily:t.FONT.body,margin:"8px 0"}}>{syn.prompt}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {syn.options.map(function(o){
            var selOpt=chosen===o.id;
            var st=Object.assign({},t.tile(selOpt?"flagged":"idle"),{padding:"8px 12px",fontSize:12,fontWeight:700,color:selOpt?t.COLOR.boldTerm:t.COLOR.ink2,cursor:"pointer",fontFamily:t.FONT.body});
            return(<button key={o.id} className="bw-tap" onClick={function(){setHypothesis(phaseIdx,o.id);}} style={st}>{o.label}</button>);
          })}
        </div>
        {chosenOpt&&<div style={{marginTop:10}}>
          <TextBlock text={chosenOpt.note} style={{fontSize:12.5,color:t.COLOR.ink2,lineHeight:1.55}}/>
        </div>}
      </div>);
    })()}
    {showFb&&ph&&ph.insight&&<div style={{margin:"0 2px 10px",fontSize:11.5,color:t.COLOR.ink3,fontFamily:t.FONT.body}}>
      {"Insight collected — “"+ph.insight.title+"” is in your tray."}
    </div>}
    {!showFb?<button onClick={onSubmit} style={Object.assign({},t.cta("primary"),{marginTop:4})}>Submit assessment</button>
      :<button onClick={afterA} style={Object.assign({},t.cta("positive"),{marginTop:4})}>{ph&&ph.actions&&ph.actions.tools&&Object.keys(ph.actions.tools).length>0?"Open the toolkit":"Continue"}</button>}
    <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?whyTarget.why:""} item={whyTarget?(function(){
      var cid=whyTarget.cid;
      var vk=cid&&cid.indexOf(":")>=0?cid.split(":")[1]:null;
      if(vk){
        return{id:cid+"@p"+phaseIdx,kind:"vital",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"vital",phaseIdx:phaseIdx,indexOrId:vk}};
      }
      var aiId=whyTarget._match?whyTarget._match.id:whyTarget.label;
      return{id:"assess:"+aiId+"@p"+phaseIdx,kind:"assessItem",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"assessItem",phaseIdx:phaseIdx,indexOrId:aiId}};
    })():null}/>
  </div>);
}
