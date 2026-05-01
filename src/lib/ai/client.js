import { buildSystemPrompt, buildDeepDivePrompt, MODEL_ID, MAX_TOKENS } from "./prompt.js";
import { validateSchema, validateConsistency, validateCounts, applyAutocorrections } from "./validate.js";

var NAME_HINT_LETTERS="ABCDEFGHIJKLMNOPRSTUVWYZ"; // skip Q and X — rare initial sounds
function randomNameHint(){
  var letter=NAME_HINT_LETTERS.charAt(Math.floor(Math.random()*NAME_HINT_LETTERS.length));
  return "\n\nName hint: choose a patient name starting with the letter "+letter+". Vary across cultures and genders. Do NOT use Marcus, Sarah, or John.";
}

// Phase-2.6.1 part 2E: when the streaming response surfaces a new
// top-level JSON key the parser hasn't seen, the matching message
// fires once. Order matters — earlier entries take precedence when
// multiple keys arrive in the same chunk. Keys with first-occurrence
// matching only (e.g. "vitals" appears in every phase; we only fire
// the message the first time).
var PHASE_KEYS=[
  {key:"\"patient\":",message:"Building patient profile..."},
  {key:"\"emsReport\":",message:"Drafting EMS handoff..."},
  {key:"\"learnMore\":",message:"Pulling background context..."},
  {key:"\"norms\":",message:"Setting age-appropriate norms..."},
  {key:"\"vitals\":",message:"Calibrating vital signs to age..."},
  {key:"\"signs\":",message:"Documenting bedside findings..."},
  {key:"\"assessItems\":",message:"Selecting normal-vs-abnormal options..."},
  {key:"\"labs\":",message:"Generating consistent lab values..."},
  {key:"\"escalation\"",message:"Building intervention pool..."},
  {key:"\"curveball\":",message:"Plotting a curveball..."},
  {key:"\"reassessment\":",message:"Modeling post-intervention recovery..."},
  {key:"\"stabilizationSummary\":",message:"Finalizing clinical recap..."},
  {key:"\"debrief\":",message:"Writing teaching takeaways..."}
];

function applyPostParseFixups(scenario,cbMode){
  if(!cbMode)scenario.curveball=null;
  if(!scenario.debrief)scenario.debrief={summary:"Complete.",explainers:[]};
  var schemaErrs=validateSchema(scenario);
  if(schemaErrs.length>0)throw new Error("Generated scenario was incomplete — missing: "+schemaErrs.slice(0,3).join("; ")+(schemaErrs.length>3?" (and "+(schemaErrs.length-3)+" more)":""));
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

function parseAccumulated(tb){
  var cl=tb.replace(/```json\s*/gi,"").replace(/```\s*/g,"").replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<html[^>]*>[\s\S]*?<\/html>/gi,"").replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi,"").trim();
  cl=cl.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#39;/g,"'").replace(/&nbsp;/g," ");
  var candidates=[];var depth=0;var cStart=-1;
  for(var ci=0;ci<cl.length;ci++){if(cl[ci]==="{"){if(depth===0)cStart=ci;depth++;}else if(cl[ci]==="}"){depth--;if(depth===0&&cStart>=0){candidates.push({s:cStart,e:ci,len:ci-cStart});cStart=-1;}}}
  if(candidates.length===0)throw new Error("Generated scenario was malformed — please try again.");
  candidates.sort(function(a,b){return b.len-a.len;});
  cl=cl.substring(candidates[0].s,candidates[0].e+1);
  function stripTags(s){if(typeof s!=="string")return s;return s.replace(/<[^>]+>/g,"").trim();}
  function deepClean(obj){if(typeof obj==="string")return stripTags(obj);if(Array.isArray(obj))return obj.map(deepClean);if(obj&&typeof obj==="object"){var out={};Object.keys(obj).forEach(function(k){out[k]=deepClean(obj[k]);});return out;}return obj;}
  var scenario;
  try{scenario=deepClean(JSON.parse(cl));}catch(pe){
    try{var fixed=cl.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]").replace(/[\x00-\x1f]/g,function(c){return c==="\n"?"\\n":c==="\r"?"\\r":c==="\t"?"\\t":"";});
      scenario=deepClean(JSON.parse(fixed));
    }catch(pe2){throw new Error("Generated scenario was malformed — please try again.");}
  }
  if(!scenario.id||!scenario.phases)throw new Error("Generated scenario was incomplete — please try again.");
  return scenario;
}

// generateScenario — phase-2.6.1 part 2D streaming version.
// onProgress({bytes, accumulated, message?}) fires as new SSE chunks
// arrive. message is set only when a new phase key is detected.
export async function generateScenario(txt, cbMode, signal, onProgress){
  var userContent="Create pediatric scenario:\n\n"+txt+randomNameHint();
  // Phase-4-prep: prompt caching on the system prompt (stable across every
  // scenario generation). Adaptive thinking + output_config{effort:"medium"}
  // were dropped after the opioid OD test surfaced unacceptable latency
  // and quality regression — the self-review checklist in the system
  // prompt drives accuracy without runtime reasoning overhead.
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      system:[{type:"text",text:buildSystemPrompt(cbMode),cache_control:{type:"ephemeral"}}],
      messages:[{role:"user",content:userContent}],
      stream:true})});
  if(!r.ok){
    var errBody="";try{errBody=await r.text();}catch(e){}
    var errMsg="Connection issue — please check your network and retry.";
    try{var ej=JSON.parse(errBody);if(ej&&ej.error&&ej.error.message)errMsg=ej.error.message;}catch(e){}
    throw new Error(errMsg);
  }
  if(!r.body||!r.body.getReader)throw new Error("Connection issue — streaming not supported by this browser.");
  var reader=r.body.getReader();
  var decoder=new TextDecoder();
  var sseBuffer="";
  var accumulated="";
  var bytes=0;
  var stopReason=null;
  var keysSeen={};
  function checkPhase(text){
    for(var i=0;i<PHASE_KEYS.length;i++){
      var p=PHASE_KEYS[i];
      if(!keysSeen[p.key]&&text.indexOf(p.key)>=0){keysSeen[p.key]=true;return p.message;}
    }
    return null;
  }
  while(true){
    var chunk=await reader.read();
    if(chunk.done)break;
    bytes+=chunk.value.byteLength;
    sseBuffer+=decoder.decode(chunk.value,{stream:true});
    var events=sseBuffer.split("\n\n");
    sseBuffer=events.pop();
    for(var ei=0;ei<events.length;ei++){
      var evt=events[ei];if(!evt)continue;
      var lines=evt.split("\n");var dataLine="";
      for(var li=0;li<lines.length;li++){if(lines[li].indexOf("data: ")===0)dataLine=lines[li].substring(6);}
      if(!dataLine||dataLine==="[DONE]")continue;
      var parsed;try{parsed=JSON.parse(dataLine);}catch(e){continue;}
      if(parsed.type==="content_block_delta"&&parsed.delta&&parsed.delta.type==="text_delta"){
        accumulated+=parsed.delta.text;
        var msg=checkPhase(accumulated);
        if(onProgress)onProgress({bytes:bytes,accumulated:accumulated,message:msg});
      }else if(parsed.type==="message_delta"&&parsed.delta&&parsed.delta.stop_reason){
        stopReason=parsed.delta.stop_reason;
      }else if(parsed.type==="error"){
        var emsg=(parsed.error&&parsed.error.message)||"API error";
        throw new Error(emsg);
      }
    }
  }
  if(stopReason==="max_tokens")throw new Error("Response was cut off — please try a simpler description.");
  if(!accumulated.trim()){
    if(stopReason==="tool_use")throw new Error("AI got stuck in a research loop. Try again with a more specific description.");
    throw new Error("No text in AI response. Try again.");
  }
  var scenario=parseAccumulated(accumulated);
  return applyPostParseFixups(scenario,cbMode);
}

// Phase-2.6 group D: request deep-dive expansions for items the user
// flagged with Mark for Review. Returns a Map of itemId → deepDive
// string. Throws on any error so the caller can render a fallback.
// Stays non-streaming — small response, has its own loading UI.
//
// Phase-2.6.3-hotfix: balanced-brace JSON extraction + loose-fix
// fallback (kept in this file as a secondary parse path).
//
// Phase-2.6.6-hotfix: PRIMARY parse path is now delimited plain-text
// (###ITEM:<id>...###END) per the new buildDeepDivePrompt contract.
// JSON's quote-escaping was repeatedly failing on multi-paragraph
// medical prose (asterisks, em-dashes, embedded quotes — canonical
// MTP scenarios reliably reproduced "Expected ',' or '}' after
// property value at position N"). The AI is much more reliable at
// emitting plain text between explicit markers than at emitting valid
// JSON containing the same content.
//
// Fallback: if the new-format markers aren't found in the response
// (older cached scenarios in flight, model regression), falls back
// to the legacy JSON parser path. On JSON failure we now log a
// 200-char window AROUND the parse error position so future failures
// pinpoint the exact character class breaking syntax.
function parseDelimitedDeepDives(text){
  // Match ###ITEM:<id>\n<body>\n###END for each item.
  // Tolerates extra whitespace around markers. id captured up to first newline.
  var rx=/###ITEM:\s*([^\r\n]+)[\r\n]+([\s\S]*?)[\r\n]+###END/g;
  var out={};
  var m;
  while((m=rx.exec(text))!==null){
    var id=m[1].trim();
    var body=m[2].trim();
    if(id&&body)out[id]=body;
  }
  return out;
}
function parseLegacyJsonDeepDives(tb){
  var cl=tb.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  var candidates=[];var depth=0;var cStart=-1;
  for(var ci=0;ci<cl.length;ci++){if(cl[ci]==="{"){if(depth===0)cStart=ci;depth++;}else if(cl[ci]==="}"){depth--;if(depth===0&&cStart>=0){candidates.push({s:cStart,e:ci,len:ci-cStart});cStart=-1;}}}
  if(candidates.length===0)throw new Error("Deep-dive response did not contain a balanced JSON object.");
  candidates.sort(function(a,b){return b.len-a.len;});
  var bestSlice=cl.substring(candidates[0].s,candidates[0].e+1);
  var parsed;
  try{parsed=JSON.parse(bestSlice);}catch(pe){
    try{var fixed=bestSlice.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]").replace(/[\x00-\x1f]/g,function(c){return c==="\n"?"\\n":c==="\r"?"\\r":c==="\t"?"\\t":"";});
      parsed=JSON.parse(fixed);
    }catch(pe2){
      // Phase-2.6.6-hotfix: extract position from the strict-error
      // message and dump the surrounding 200 chars so future failures
      // pinpoint the exact character class breaking syntax.
      var posMatch=pe.message.match(/position (\d+)/);
      var pos=posMatch?Number(posMatch[1]):-1;
      var around=pos>=0?bestSlice.slice(Math.max(0,pos-100),pos+100):"(no position in error message)";
      console.error("[deepDive] both strict and loose JSON parse failed",{
        rawTextLen:tb.length,sliceLen:bestSlice.length,
        sliceHead:bestSlice.slice(0,200),sliceTail:bestSlice.slice(-200),
        strictErr:pe.message,looseErr:pe2.message,
        errorPosition:pos,
        charsAroundError:around
      });
      throw new Error("Deep-dive response had invalid JSON.");
    }
  }
  if(!parsed||!Array.isArray(parsed.items)){
    console.error("[deepDive] response missing items array",{parsedKeys:parsed?Object.keys(parsed):null});
    throw new Error("Deep-dive response missing items array.");
  }
  var out={};
  parsed.items.forEach(function(it){if(it&&it.id&&it.deepDive)out[it.id]=it.deepDive;});
  return out;
}

export async function expandMarkedItems(scenario, items, signal){
  if(!Array.isArray(items)||items.length===0)return {};
  var ctx={
    title:scenario.title,
    age:scenario.patient&&scenario.patient.ageLabel,
    cc:scenario.patient&&scenario.patient.cc,
    description:scenario.description
  };
  var requestedIds=items.map(function(i){return i.id;});
  var userContent="Patient context: "+JSON.stringify(ctx)+"\n\nItems to expand:\n"+JSON.stringify(items.map(function(i){return{id:i.id,label:i.label,type:i.type,originalWhy:i.originalWhy};}));
  // Phase-4-prep: prompt caching on the deep-dive system prompt — same
  // prompt every call, ideal cache target. No thinking block on this
  // path (cost/latency outweighs benefit for shorter content). max_tokens
  // 6000 → 8000 to give a small headroom margin without overshooting.
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:8000,mode:"expand_marked_items",
      system:[{type:"text",text:buildDeepDivePrompt(),cache_control:{type:"ephemeral"}}],
      messages:[{role:"user",content:userContent}]})});
  var raw=await r.text();var d;
  try{d=JSON.parse(raw);}catch(je){throw new Error("Server returned invalid response (status "+r.status+").");}
  if(d.error)throw new Error(d.error.message||"API error");
  var tb="";(d.content||[]).forEach(function(b){if(b.type==="text"&&b.text)tb+=b.text;});
  if(!tb.trim())throw new Error("No text in deep-dive response.");
  // Try delimited format first (current prompt). Fall back to JSON
  // (legacy prompt or model drift) if no markers found.
  var out=parseDelimitedDeepDives(tb);
  var parseSource="delimited";
  if(Object.keys(out).length===0){
    parseSource="json-fallback";
    try{out=parseLegacyJsonDeepDives(tb);}
    catch(legacyErr){
      console.error("[deepDive] no delimited markers and JSON fallback failed",{textHead:tb.slice(0,300),textTail:tb.slice(-200),legacyErr:legacyErr.message});
      throw legacyErr;
    }
  }
  // Id-normalization safety net (kept from 2.6.3-hotfix): if any
  // requested id has no exact key in `out`, try matching any returned
  // id whose suffix after the last ":" equals our suffix.
  var returnedIds=Object.keys(out);
  requestedIds.forEach(function(reqId){
    if(out[reqId])return;
    var reqSuffix=reqId.indexOf(":")>=0?reqId.split(":").pop():reqId;
    for(var i=0;i<returnedIds.length;i++){
      var got=returnedIds[i];
      var gotSuffix=got.indexOf(":")>=0?got.split(":").pop():got;
      if(gotSuffix===reqSuffix){out[reqId]=out[got];break;}
    }
  });
  console.info("[deepDive] parseSource:"+parseSource,"requested:",requestedIds,"returned:",returnedIds,"resolved:",Object.keys(out).filter(function(k){return requestedIds.indexOf(k)>=0;}));
  return out;
}
