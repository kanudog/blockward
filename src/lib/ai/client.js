import { buildSystemPrompt, MODEL_ID, MAX_TOKENS } from "./prompt.js";
import { validateSchema, validateConsistency, validateCounts, applyAutocorrections } from "./validate.js";

var NAME_HINT_LETTERS="ABCDEFGHIJKLMNOPRSTUVWYZ"; // skip Q and X — rare initial sounds
function randomNameHint(){
  var letter=NAME_HINT_LETTERS.charAt(Math.floor(Math.random()*NAME_HINT_LETTERS.length));
  return "\n\nName hint: choose a patient name starting with the letter "+letter+". Vary across cultures and genders. Do NOT use Marcus, Sarah, or John.";
}

export async function generateScenario(txt, cbMode, signal){
  var userContent="Create pediatric scenario:\n\n"+txt+randomNameHint();
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      system:buildSystemPrompt(cbMode),
      messages:[{role:"user",content:userContent}]})});
  var raw=await r.text();var d;
  try{d=JSON.parse(raw);}catch(je){throw new Error("Server returned invalid response (status "+r.status+"). The request may have timed out — try again.");}
  if(d.error)throw new Error(d.error.message||"API error");
  if(d.stop_reason==="max_tokens")throw new Error("Scenario was too complex and got cut off. Try a simpler description or turn off Curveball Mode.");
  var tb="";
  (d.content||[]).forEach(function(b){if(b.type==="text"&&b.text)tb+=b.text;});
  if(!tb.trim()){
    if(d.stop_reason==="tool_use")throw new Error("AI got stuck in a research loop. Try again with a more specific description.");
    throw new Error("No text in AI response. Try again.");
  }
  var cl=tb.replace(/```json\s*/gi,"").replace(/```\s*/g,"").replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<html[^>]*>[\s\S]*?<\/html>/gi,"").replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi,"").trim();
  cl=cl.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#39;/g,"'").replace(/&nbsp;/g," ");
  var candidates=[];var depth=0;var cStart=-1;
  for(var ci=0;ci<cl.length;ci++){if(cl[ci]==="{"){if(depth===0)cStart=ci;depth++;}else if(cl[ci]==="}"){depth--;if(depth===0&&cStart>=0){candidates.push({s:cStart,e:ci,len:ci-cStart});cStart=-1;}}}
  if(candidates.length===0)throw new Error("AI did not return valid JSON. Try rephrasing or simplifying your description.");
  candidates.sort(function(a,b){return b.len-a.len;});
  cl=cl.substring(candidates[0].s,candidates[0].e+1);
  function stripTags(s){if(typeof s!=="string")return s;return s.replace(/<[^>]+>/g,"").trim();}
  function deepClean(obj){if(typeof obj==="string")return stripTags(obj);if(Array.isArray(obj))return obj.map(deepClean);if(obj&&typeof obj==="object"){var out={};Object.keys(obj).forEach(function(k){out[k]=deepClean(obj[k]);});return out;}return obj;}
  var scenario;
  try{scenario=deepClean(JSON.parse(cl));}catch(pe){
    try{var fixed=cl.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]").replace(/[\x00-\x1f]/g,function(c){return c==="\n"?"\\n":c==="\r"?"\\r":c==="\t"?"\\t":"";});
      scenario=deepClean(JSON.parse(fixed));
    }catch(pe2){throw new Error("AI response had invalid JSON. Try again — simpler prompts work more reliably.");}
  }
  if(!scenario.id||!scenario.phases)throw new Error("AI generated an incomplete scenario. Try being more specific about the patient age, condition, and setting.");
  if(!cbMode)scenario.curveball=null;
  if(!scenario.debrief)scenario.debrief={summary:"Complete.",explainers:[]};
  var schemaErrs=validateSchema(scenario);
  if(schemaErrs.length>0)throw new Error("AI generated scenario is missing required fields: "+schemaErrs.slice(0,3).join("; ")+(schemaErrs.length>3?" (and "+(schemaErrs.length-3)+" more)":""));
  var decisions=validateConsistency(scenario);
  var corrected=applyAutocorrections(scenario,decisions);
  var countWarnings=validateCounts(scenario);
  var surfaceable=decisions.filter(function(d){return d.kind!=="autocorrect";}).concat(countWarnings.map(function(w){return{kind:"count",phase:w.phase,message:w.message};}));
  if(corrected>0)console.info("Validator auto-corrected "+corrected+" assessItem flag(s) where value was within stated normal range.");
  if(surfaceable.length>0){
    scenario._validatorWarnings=surfaceable;
    surfaceable.forEach(function(w){console.warn("Validator ["+(w.phase||"?")+", "+w.kind+"]:",w.message,w.label?"— item: "+w.label:"");});
  }
  return scenario;
}
