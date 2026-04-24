import { useScenariosStore } from "../stores/scenariosStore.js";
import { SC1, SC2, SC3 } from "../lib/scenarios/builtIn.js";

var BUILT_IN=[SC1,SC2,SC3];

function minifyScenario(sc){
  function trimFb(obj){if(!obj)return obj;var o={};Object.keys(obj).forEach(function(k){if(typeof obj[k]==="object"&&obj[k]&&obj[k].fb){o[k]={ok:obj[k].ok,pri:obj[k].pri,fb:obj[k].fb.substring(0,120)};}else{o[k]=obj[k];}});return o;}
  function trimPhase(p){return{id:p.id,name:p.name,narrative:p.narrative?p.narrative.substring(0,300):p.narrative,vitals:p.vitals,signs:p.signs?p.signs.map(function(s){return{label:s.label,finding:s.finding,pos:s.pos,sys:s.sys,why:s.why};}):p.signs,assessItems:p.assessItems,labs:p.labs?p.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):p.labs,tools:p.tools,meds:p.meds,actions:p.actions?{tools:trimFb(p.actions.tools),meds:trimFb(p.actions.meds)}:p.actions};}
  var m={id:sc.id,title:sc.title,tier:sc.tier,icon:sc.icon,tagline:sc.tagline,description:sc.description,patient:sc.patient,norms:sc.norms,visuals:sc.visuals,emsReport:sc.emsReport,learnMore:sc.learnMore,phases:sc.phases?sc.phases.map(trimPhase):[],debrief:sc.debrief?{summary:sc.debrief.summary,explainers:sc.debrief.explainers?sc.debrief.explainers.map(function(e){return{title:e.title,content:e.content?e.content.substring(0,200):"",tldr:e.tldr};}):[]}:sc.debrief};
  if(sc.curveball){m.curveball={name:sc.curveball.name,narrative:sc.curveball.narrative?sc.curveball.narrative.substring(0,300):"",vitals:sc.curveball.vitals,signs:sc.curveball.signs,labs:sc.curveball.labs?sc.curveball.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):sc.curveball.labs,tools:sc.curveball.tools,meds:sc.curveball.meds,actions:sc.curveball.actions?{tools:trimFb(sc.curveball.actions.tools),meds:trimFb(sc.curveball.actions.meds)}:sc.curveball.actions,teaches:sc.curveball.teaches?sc.curveball.teaches.map(function(t){return{title:t.title,content:t.content?t.content.substring(0,200):"",tldr:t.tldr};}):[]};}else{m.curveball=null;}
  return m;
}
function encodeScenario(sc){try{return btoa(unescape(encodeURIComponent(JSON.stringify(sc))));}catch(e){return null;}}
export function decodeScenario(str){try{return JSON.parse(decodeURIComponent(escape(atob(str))));}catch(e){return null;}}

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
      setMessage("Scenario too large to share via link. Try a simpler scenario.");
      setTimeout(function(){setMessage(null);},3000);
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
