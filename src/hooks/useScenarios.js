import { useScenariosStore } from "../stores/scenariosStore.js";
import { SC1, SC2, SC3, SC4, SC5 } from "../lib/scenarios/builtIn.js";
import BREATHING_HARDER from "../lib/scenarios/generated/breathing-harder.json";
import TEN_FEET_DOWN from "../lib/scenarios/generated/ten-feet-down.json";

var BUILT_IN=[SC1,SC2,SC3,SC4,SC5,BREATHING_HARDER,TEN_FEET_DOWN];

// Share links are size-capped (the encoded URL must stay under ~4000 chars or
// shareScenario refuses to send it), so the minifier keeps only what a
// recipient needs to play. Explanations are now written in parts — plain,
// detail, watch-for — and only the plain part survives here: it is the one a
// recipient reads first, and it is a fifth of the bytes. Whoever opens the link
// can still tap "Explain more", which fetches depth on demand exactly as it
// does for any other case. Without this, adding tiered explanations would have
// pushed more cases over the cap, making sharing worse rather than better.
function briefOnly(text){
  if(!text||typeof text!=="string")return text;
  var blocks=text.split(/\n\s*\n/).map(function(b){return b.trim();}).filter(Boolean);
  if(!blocks.length)return text;
  // First non-bullet block is the plain part.
  for(var i=0;i<blocks.length;i++){
    if(!/^\s*[-*•]\s+/.test(blocks[i]))return blocks[i];
  }
  return blocks[0];
}
function minifyScenario(sc){
  function trimFb(obj){if(!obj)return obj;var o={};Object.keys(obj).forEach(function(k){if(typeof obj[k]==="object"&&obj[k]&&obj[k].fb){o[k]={ok:obj[k].ok,pri:obj[k].pri,label:obj[k].label,fb:briefOnly(obj[k].fb)};}else{o[k]=obj[k];}});return o;}
  function trimPhase(p){return{id:p.id,name:p.name,narrative:p.narrative?p.narrative.substring(0,300):p.narrative,vitals:p.vitals,signs:p.signs?p.signs.map(function(s){return{label:s.label,finding:s.finding,pos:s.pos,sys:s.sys,why:briefOnly(s.why)};}):p.signs,assessItems:p.assessItems,labs:p.labs?p.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):p.labs,tools:p.tools,meds:p.meds,actions:p.actions?{tools:trimFb(p.actions.tools),meds:trimFb(p.actions.meds)}:p.actions};}
  var m={id:sc.id,title:sc.title,tier:sc.tier,icon:sc.icon,tagline:sc.tagline,description:sc.description,patient:sc.patient,norms:sc.norms,visuals:sc.visuals,emsReport:sc.emsReport,learnMore:sc.learnMore,phases:sc.phases?sc.phases.map(trimPhase):[],debrief:sc.debrief?{summary:sc.debrief.summary,explainers:sc.debrief.explainers?sc.debrief.explainers.map(function(e){return{title:e.title,content:e.content?e.content.substring(0,200):"",tldr:e.tldr};}):[]}:sc.debrief};
  if(sc.curveball){m.curveball={name:sc.curveball.name,narrative:sc.curveball.narrative?sc.curveball.narrative.substring(0,300):"",vitals:sc.curveball.vitals,signs:sc.curveball.signs,labs:sc.curveball.labs?sc.curveball.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):sc.curveball.labs,tools:sc.curveball.tools,meds:sc.curveball.meds,actions:sc.curveball.actions?{tools:trimFb(sc.curveball.actions.tools),meds:trimFb(sc.curveball.actions.meds)}:sc.curveball.actions,teaches:sc.curveball.teaches?sc.curveball.teaches.map(function(t){return{title:t.title,content:t.content?t.content.substring(0,200):"",tldr:t.tldr};}):[]};}else{m.curveball=null;}
  return m;
}
function encodeScenario(sc){try{return btoa(unescape(encodeURIComponent(JSON.stringify(sc))));}catch(e){return null;}}
export function decodeScenario(str){
  // Phase-5.1: shared links predate the source marker; default to "ai"
  // when missing (every shareable scenario has been AI-generated).
  try{
    var sc=JSON.parse(decodeURIComponent(escape(atob(str))));
    if(sc&&!sc.source)sc.source="ai";
    return sc;
  }catch(e){return null;}
}

export function useScenarios(){
  var custom=useScenariosStore(function(s){return s.custom;});
  var hydrated=useScenariosStore(function(s){return s.hydrated;});
  var _store=useScenariosStore.getState();
  function shareScenario(sc,setMessage){
    var mini=minifyScenario(sc);
    var encoded=encodeScenario(mini);
    if(!encoded){setMessage("Failed to encode scenario");return;}
    var url=window.location.origin+"/?shared="+encodeURIComponent(encoded);
    if(url.length>4000){
      // Measured 2026-07-30: a real generated case encodes to ~105,000 URL
      // chars against this 4,000 cap, and even a skeleton with every
      // explanation stripped is ~27,000 — the phase structure alone is ~20 KB.
      // No case this app generates can fit in a URL, so "try a simpler
      // scenario" was advice nobody could act on. Link sharing needs a
      // different mechanism (a stored share code, or file export/import);
      // until then, say so plainly.
      setMessage("Link sharing isn't available for full cases yet — they're far too large for a URL.");
      setTimeout(function(){setMessage(null);},4000);
      return;
    }
    if(navigator.share){navigator.share({title:"Block Ward: "+sc.title,url:url}).catch(function(){});}
    else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){setMessage("Link copied!");setTimeout(function(){setMessage(null);},2500);});}
    else{prompt("Copy this link to share:",url);}
  }
  return{
    built:BUILT_IN,
    custom:custom,
    allScenarios:BUILT_IN.concat(custom),
    hydrated:hydrated,
    hydrate:_store.hydrate,
    addCustom:_store.addCustom,
    addCustomIfNew:_store.addCustomIfNew,
    deleteCustom:_store.deleteCustom,
    clearAll:_store.clearAll,
    shareScenario:shareScenario
  };
}
