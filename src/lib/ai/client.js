import { buildSystemPrompt, buildOrchestratorPrompt, buildRound2Prompt, buildCurveballPrompt, buildVerifierPrompt, buildMarkForReviewDeepDivePrompt, MODEL_ID, MAX_TOKENS } from "./prompt.js";
import { resolveSlotText, kindToPromptType } from "../scenarios/slotResolve.js";
import { validateSchema, validateConsistency, validateCounts, applyAutocorrections } from "./validate.js";
import { migrateLegacyScenario } from "../scenarios/migrateLegacyScenario.js";

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

// Phase 6.3 (Stage 2): stamp a round index on every phase, derived from
// phaseIndex (0,1 -> round 1; 2,3 -> round 2). Belt-and-suspenders — the
// prompts ask Sonnet to emit `round`, but the player relies on it for the
// interlude transition, so we guarantee it here.
function _stampRounds(scenario){
  if(scenario&&Array.isArray(scenario.phases)){
    scenario.phases.forEach(function(p,i){
      if(p&&typeof p==="object"){
        if(typeof p.phaseIndex!=="number")p.phaseIndex=i;
        p.round=(p.phaseIndex<2)?1:2;
      }
    });
  }
}

function applyPostParseFixups(scenario,opts){
  // Phase 6.3: opts = { mode:"full"|"quick", cbMode, sourcePrompt }.
  opts=opts||{};
  var cbMode=opts.cbMode;
  var pendingR2=opts.mode==="full";
  // Phase-5.4.3a: legacy buildSystemPrompt() still instructs Sonnet to
  // emit flat assessItems[]. Upgrade the shape to schema 5.4.1 before
  // anything else touches the scenario. Idempotent — no-op for 5.4.1
  // output once Phase 5.4.4 wires in the orchestrator prompt.
  scenario=migrateLegacyScenario(scenario);
  _stampRounds(scenario);
  if(!cbMode)scenario.curveball=null;
  // Full-case Round 1 defers reassessment + debrief to the Round 2 call
  // (which resolves the full arc). Stash the original brief + cbMode so the
  // background Round 2 generation can honor loyalty and gate the curveball.
  if(pendingR2){
    scenario._pendingRound2=true;
    scenario._sourcePrompt=opts.sourcePrompt||"";
    scenario._cbMode=!!cbMode;
  }else if(!scenario.debrief){
    scenario.debrief={summary:"Complete.",keyTeaching:[],physiologyDeepDive:[]};
  }
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
  // Phase-5.1: tag every AI-generated scenario with a source marker so
  // downstream code can branch on origin without hardcoded ID lists.
  scenario.source="ai";
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
export async function generateScenario(txt, opts, signal, onProgress){
  // Phase 6.3: opts = { mode:"full"|"quick", cbMode }. "full" generates only
  // Round 1 (the background Round 2 follows during play); "quick"/default is
  // the single-round scenario. Backward compat: a boolean opts is legacy cbMode.
  if(typeof opts==="boolean")opts={mode:"quick",cbMode:opts};
  opts=opts||{mode:"quick"};
  var mode=opts.mode==="full"?"full":"quick";
  var userContent="Create pediatric scenario:\n\n"+txt+randomNameHint();
  // Phase-4-prep: prompt caching on the system prompt (stable across every
  // scenario generation). Adaptive thinking + output_config{effort:"medium"}
  // were dropped after the opioid OD test surfaced unacceptable latency
  // and quality regression — the self-review checklist in the system
  // prompt drives accuracy without runtime reasoning overhead.
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      // Phase 6.2b.3: live wiring. buildOrchestratorPrompt replaces
      // buildSystemPrompt as the system prompt. The orchestrator
      // emits skeleton-only output (every why/fb/content slot is null);
      // the dispatcher fans out Haiku calls to fill those slots after
      // the scenario lands in the player. cbMode no longer branches
      // here — curveball machinery was deleted from the orchestrator
      // prompt at the 6.2 design lock. buildSystemPrompt stays
      // imported for Phase 6.4 cleanup (deletes the function + the
      // import together). web_search tool stays available; the
      // prompt's Section 24 governs when Sonnet uses it.
      system:[{type:"text",text:buildOrchestratorPrompt(mode),cache_control:{type:"ephemeral"}}],
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
  return applyPostParseFixups(scenario,{mode:mode,cbMode:opts.cbMode,sourcePrompt:txt});
}

// Phase 6.3 (Stage 2): background Round-2 continuation. Given a Round-1
// scenario (carrying _sourcePrompt), generate the evolved Round 2 (phases 2
// & 3) + the final reassessment + debrief, honoring the user's ORIGINAL brief
// (loyalty safeguard — the brief is threaded into the user message). Non-
// streaming; runs in the background while the user plays Round 1. Returns the
// raw { phases, reassessment, debrief } object for mergeRound2().
export async function generateRound2(scenario, signal){
  var brief=(scenario&&scenario._sourcePrompt)||"";
  var pc=scenario.patientCard||scenario.patient||{};
  var r1ctx={patientCard:pc,norms:scenario.norms,phases:[scenario.phases[0],scenario.phases[1]]};
  var userContent="ORIGINAL USER BRIEF (honor every fact, including any pinned to Round 2):\n"+brief+"\n\nROUND 1 SCENARIO (continue this same patient):\n"+JSON.stringify(r1ctx);
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,mode:"round2",
      tools:[{type:"web_search_20250305",name:"web_search"}],
      system:[{type:"text",text:buildRound2Prompt(),cache_control:{type:"ephemeral"}}],
      messages:[{role:"user",content:userContent}]})});
  if(!r.ok){
    var eb="";try{eb=await r.text();}catch(e){}
    var em="Round 2 generation failed — please check your connection.";
    try{var ej=JSON.parse(eb);if(ej&&ej.error&&ej.error.message)em=ej.error.message;}catch(e){}
    throw new Error(em);
  }
  var data=await r.json();
  if(data.error)throw new Error(data.error.message||"Round 2 API error");
  var tb="";(data.content||[]).forEach(function(b){if(b&&b.type==="text"&&b.text)tb+=b.text;});
  if(!tb.trim())throw new Error("No text in Round 2 response.");
  var r2=_parseLooseJson(tb);
  if(!r2||!Array.isArray(r2.phases)||r2.phases.length<2)throw new Error("Round 2 response was malformed — missing phases.");
  return r2;
}

// Merge a Round-2 result into its Round-1 scenario: append phases 2 & 3,
// install reassessment + debrief, stamp round/phaseIndex, normalize via the
// migrator, clear the pending flag. Returns the merged 4-phase scenario.
export function mergeRound2(scenario, r2){
  var merged=Object.assign({},scenario);
  var r2phases=(r2.phases||[]).slice(0,2).map(function(p,i){
    var copy=Object.assign({},p);
    copy.phaseIndex=2+i;
    copy.round=2;
    // Force unique ids/stageType so round-1 "intervene" and round-2
    // "intervene2" never collide in snapshot/recovery keying.
    copy.stageType=(i===0?"assess":"intervene");
    copy.id=(i===0?"assess2":"intervene2");
    return copy;
  });
  merged.phases=[scenario.phases[0],scenario.phases[1]].concat(r2phases);
  if(r2.reassessment)merged.reassessment=r2.reassessment;
  if(r2.debrief)merged.debrief=r2.debrief;
  delete merged._pendingRound2;
  // Normalize the merged scenario (array vitals, _slotRef/why backfill on the
  // new Round 2 phases, keyTeaching synth if needed). Idempotent on R1.
  merged=migrateLegacyScenario(merged);
  _stampRounds(merged);
  merged.source="ai";
  return merged;
}

// Phase 6.3 (Stage 3): background curveball generation. Given a merged two-round
// scenario (carrying _sourcePrompt + the evolved Round 2 phases), generate one
// curveball beat — an unexpected acute complication of the SAME patient just
// after the Round 2 interventions — honoring the user's ORIGINAL brief (loyalty
// safeguard, threaded into the user message) and building on the evolved Round 2
// state. Non-streaming; runs in the background after Round 2 lands, while the
// user is still playing Round 2. Returns the raw curveball object for
// mergeCurveball().
export async function generateCurveball(scenario, signal){
  var brief=(scenario&&scenario._sourcePrompt)||"";
  var pc=scenario.patientCard||scenario.patient||{};
  var phases=scenario.phases||[];
  // The evolved Round 2 state (round:2 phases — assess then intervene) is what
  // the curveball strikes from. Fall back to the last two phases by position.
  var r2phases=phases.filter(function(p){return p&&p.round===2;});
  if(r2phases.length===0)r2phases=phases.slice(2,4);
  var ctx={patientCard:pc,norms:scenario.norms,round2:r2phases};
  var userContent="ORIGINAL USER BRIEF (honor every fact, including any pinned to the curveball or a later complication):\n"+brief+"\n\nEVOLVED ROUND 2 STATE (the SAME patient after the Round 2 interventions — the curveball strikes from HERE):\n"+JSON.stringify(ctx);
  var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
    body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,mode:"curveball",
      tools:[{type:"web_search_20250305",name:"web_search"}],
      system:[{type:"text",text:buildCurveballPrompt(),cache_control:{type:"ephemeral"}}],
      messages:[{role:"user",content:userContent}]})});
  if(!r.ok){
    var eb="";try{eb=await r.text();}catch(e){}
    var em="Curveball generation failed — please check your connection.";
    try{var ej=JSON.parse(eb);if(ej&&ej.error&&ej.error.message)em=ej.error.message;}catch(e){}
    throw new Error(em);
  }
  var data=await r.json();
  if(data.error)throw new Error(data.error.message||"Curveball API error");
  var tb="";(data.content||[]).forEach(function(b){if(b&&b.type==="text"&&b.text)tb+=b.text;});
  if(!tb.trim())throw new Error("No text in curveball response.");
  var cb=_parseLooseJson(tb);
  if(!cb||!cb.actions||(!cb.actions.tools&&!cb.actions.meds))throw new Error("Curveball response was malformed — missing actions.");
  return cb;
}

// Merge a curveball into its two-round scenario: install scenario.curveball,
// normalize via the migrator (stamps phase[curveball].* slot refs + backfills
// null why/fb on its vitals/signs/labs/actions; name/narrative/teaches pass
// through inline), then defensively re-stamp the slot refs so the dispatcher can
// always find them regardless of what the model emitted. Returns the scenario
// with the curveball attached.
export function mergeCurveball(scenario, cb){
  var merged=Object.assign({},scenario);
  merged.curveball=cb;
  merged=migrateLegacyScenario(merged);
  _stampCurveballRefs(merged.curveball);
  _stampRounds(merged);
  merged.source="ai";
  return merged;
}

// Defensive: force every curveball slot ref to its canonical phase[curveball].*
// position and backfill any missing why/fb to literal null, so a slot the model
// left unfilled is always discoverable by collectAllNullSlots + resolveSlotText.
// Mirrors the ref scheme migratePhase uses; runs after it as the authoritative
// pass.
function _stampCurveballRefs(cb){
  if(!cb||typeof cb!=="object")return;
  function _ref(arr,kind){
    if(!Array.isArray(arr))return;
    arr.forEach(function(it){
      if(!it||!it.id)return;
      it._slotRef="phase[curveball]."+kind+"."+it.id+".why";
      if(!Object.prototype.hasOwnProperty.call(it,"why"))it.why=null;
    });
  }
  _ref(cb.vitals,"vitals");
  _ref(cb.signs,"signs");
  _ref(cb.labs,"labs");
  if(cb.actions&&typeof cb.actions==="object"){
    ["tools","meds"].forEach(function(kind){
      var coll=cb.actions[kind];
      if(!coll||typeof coll!=="object")return;
      Object.keys(coll).forEach(function(id){
        var e=coll[id];
        if(!e||typeof e!=="object")return;
        e._slotRef="phase[curveball].actions."+kind+"."+id+".fb";
        if(!Object.prototype.hasOwnProperty.call(e,"fb"))e.fb=null;
      });
    });
  }
}

// Tolerant JSON-object parser for the non-streaming Round 2 response: direct
// parse, then longest balanced-brace recovery (mirrors parseAccumulated minus
// the id/phases gate, since Round 2 carries neither id nor a full scenario).
function _parseLooseJson(text){
  var cl=text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try{return JSON.parse(cl);}catch(e){}
  var depth=0,start=-1,best=null;
  for(var i=0;i<cl.length;i++){
    if(cl[i]==="{"){if(depth===0)start=i;depth++;}
    else if(cl[i]==="}"){depth--;if(depth===0&&start>=0&&(!best||i-start>best.len))best={s:start,e:i,len:i-start};}
  }
  if(best){try{return JSON.parse(cl.substring(best.s,best.e+1));}catch(e){}}
  return null;
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
// (###ITEM:<id>...###END) per the new buildMarkForReviewDeepDivePrompt contract.
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
export function parseDelimitedDeepDives(text){
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
      system:[{type:"text",text:buildMarkForReviewDeepDivePrompt(),cache_control:{type:"ephemeral"}}],
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

// Phase-5.2.5: single-item wrapper for the eager deep-dive trigger.
// Fired from the Mark-for-Review handler so the deep dive is ready by
// the time the user reaches debrief. Returns the deep-dive text only,
// not a map. Empty string on no-result. Stays on Sonnet (MODEL_ID) per
// the deep-dive contract — Haiku is for the lazy why/fb path, not for
// post-game multi-paragraph deep dives.
//
// markedItem is the slot-ref-shape payload from playerStore.markedForReview:
// {id, kind, phaseIdx, label, _slotRef}. We re-resolve originalWhy
// freshly from the live scenario so any explanation text that landed
// between mark-time and now is available as anchoring context.
export async function expandSingleMarkedItem(scenario, markedItem, signal) {
  if (!markedItem || !markedItem.id || !markedItem._slotRef) return "";
  var originalWhy = resolveSlotText(scenario, markedItem._slotRef) || "";
  var internal = {
    id: markedItem.id,
    label: markedItem.label || markedItem.id,
    type: kindToPromptType(markedItem.kind),
    originalWhy: originalWhy
  };
  var map = await expandMarkedItems(scenario, [internal], signal);
  return map[markedItem.id] || "";
}

// Phase 6.3 (Stage 3.5): cross-check verifier. Given a ground-truth block for one
// unit (phase or curveball) and the filled why/fb items for that unit, run a
// single Sonnet pass that returns ok|repair|drop per item. Output is the same
// delimited ###ITEM/###END format the fill paths use. Best-effort: on any API or
// parse failure it returns {} so the caller changes nothing (no worse than the
// pre-verifier state). Returns { <slotRef>: { verdict, correctedText|null } }.
export async function verifyExplanations(scenario, groundTruth, items, signal){
  if(!Array.isArray(items)||items.length===0)return {};
  var lines=["GROUND TRUTH","",groundTruth,"","ITEMS TO CHECK",""];
  items.forEach(function(it,i){
    lines.push("--- item "+(i+1)+" ---");
    lines.push("id: "+it.slotRef);
    lines.push("kind: "+it.kind);
    lines.push("label: "+(it.label||""));
    lines.push("CURRENT TEXT:");
    lines.push(it.text||"");
    lines.push("");
  });
  var userContent=lines.join("\n");
  var r;
  try{
    r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
      body:JSON.stringify({model:MODEL_ID,max_tokens:16000,mode:"verify",
        system:[{type:"text",text:buildVerifierPrompt(),cache_control:{type:"ephemeral"}}],
        messages:[{role:"user",content:userContent}]})});
  }catch(e){
    if(e&&e.name==="AbortError")throw e;
    console.warn("[verify] request failed, leaving content unchanged: "+(e&&e.message||e));
    return {};
  }
  var raw="";try{raw=await r.text();}catch(e){if(e&&e.name==="AbortError")throw e;return {};}
  var d;try{d=JSON.parse(raw);}catch(je){console.warn("[verify] non-JSON response, leaving content unchanged");return {};}
  if(d.error){console.warn("[verify] API error: "+(d.error.message||"(no message)"));return {};}
  var tb="";(d.content||[]).forEach(function(b){if(b&&b.type==="text"&&b.text)tb+=b.text;});
  if(!tb.trim())return {};
  var blocks=parseDelimitedDeepDives(tb); // { <id>: <body> }
  var out={};
  Object.keys(blocks).forEach(function(ref){
    var body=blocks[ref];
    var nl=body.indexOf("\n");
    var first=(nl<0?body:body.slice(0,nl)).trim();
    var rest=(nl<0?"":body.slice(nl+1)).trim();
    var m=first.match(/VERDICT:\s*(ok|repair|drop)/i);
    if(!m)return; // unparseable verdict → treat as ok (no change)
    var verdict=m[1].toLowerCase();
    out[ref]={verdict:verdict,correctedText:(verdict==="repair"&&rest)?rest:null};
  });
  return out;
}

