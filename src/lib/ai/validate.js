// Post-generation validators for AI scenario responses.
//
// Phase-2.5 issue 4: catch contradictions (flagged-abnormal items whose
// stated value does not actually violate the stated threshold) and
// hard-enforce required schema fields.
//
// Phase-2.6 group C: validator now classifies each contradiction as one
// of three kinds and the caller can apply auto-corrections:
//   - autocorrect: value verifiably within stated normal range → set
//     bad:false on the item.
//   - warning: threshold parse is single-sided AND value magnitude
//     strongly suggests the threshold direction was misinterpreted.
//     Keep the flag, surface a warning.
//   - ambiguous: contradiction exists but neither side is confidently
//     correct. Surface to the UI banner, do not mutate.
//
// Also added validateCounts() which warns when an AI scenario falls
// short of the per-category counts the prompt asked for.

export function validateSchema(sc){
  var errs=[];
  if(!sc||typeof sc!=="object")return["Scenario is not an object"];
  if(!sc.id)errs.push("Missing scenario.id");
  if(!sc.title)errs.push("Missing scenario.title");
  if(!sc.patient)errs.push("Missing scenario.patient");
  else{
    if(!sc.patient.ageLabel)errs.push("Missing patient.ageLabel");
    if(!sc.patient.sex)errs.push("Missing patient.sex");
    if(!sc.patient.cc)errs.push("Missing patient.cc");
  }
  if(!sc.norms)errs.push("Missing scenario.norms");
  else{
    ["hr","rr","sbp","dbp"].forEach(function(k){
      var n=sc.norms[k];
      if(!Array.isArray(n)||n.length!==2||typeof n[0]!=="number"||typeof n[1]!=="number")errs.push("norms."+k+" must be a [min, max] number pair");
    });
  }
  if(!Array.isArray(sc.phases)||sc.phases.length===0)errs.push("Missing or empty scenario.phases");
  else{
    sc.phases.forEach(function(p,i){
      if(!p||typeof p!=="object"){errs.push("phases["+i+"] is not an object");return;}
      if(!p.id)errs.push("phases["+i+"].id missing");
      if(!p.vitals)errs.push("phases["+i+"].vitals missing");
      if(!Array.isArray(p.signs))errs.push("phases["+i+"].signs must be an array");
      if(p.assessItems&&!Array.isArray(p.assessItems))errs.push("phases["+i+"].assessItems must be an array when present");
      if(p.labs&&!Array.isArray(p.labs))errs.push("phases["+i+"].labs must be an array when present");
    });
  }
  return errs;
}

function parseValue(label){
  if(!label||typeof label!=="string")return null;
  var l=label.trim();
  var bpMatch=l.match(/^(?:BP\s+)?(\d{2,3})\/(\d{2,3})/i);
  if(bpMatch)return{primary:Number(bpMatch[1]),secondary:Number(bpMatch[2]),kind:"bp"};
  var m=l.match(/([-+]?\d+(?:\.\d+)?)/);
  if(!m)return null;
  return{primary:Number(m[1]),kind:"number"};
}

// parseThreshold: returns {lo, hi} or null. Handles:
//   "normal 100-160", "normal range 100-160", "normal: 100-160"
//   "normal range is 100-160", "(normal 100-160)"
//   "below normal threshold of 80", "minimum acceptable threshold of 80"
//   "above 4", ">4", "exceeds 2"
//   "below 45", "<45", "under 45"
function parseThreshold(why){
  if(!why||typeof why!=="string")return null;
  var t=why.toLowerCase();
  // Range patterns first (most specific): "normal [range|:|is]? A-B"
  var rangeMatch=t.match(/normal(?:\s+(?:range|range\s+is|is))?[\s:]*\(?(\d+(?:\.\d+)?)\s*(?:-|to|–)\s*(\d+(?:\.\d+)?)/);
  if(rangeMatch)return{lo:Number(rangeMatch[1]),hi:Number(rangeMatch[2])};
  // Reverse range: "between A and B"
  var betweenMatch=t.match(/between\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/);
  if(betweenMatch)return{lo:Number(betweenMatch[1]),hi:Number(betweenMatch[2])};
  // "above N", ">N", "exceeds N", "over N"
  var above=t.match(/(?:above|>\s*=?\s*|exceeds?|over)\s*(\d+(?:\.\d+)?)/);
  if(above)return{hi:Number(above[1])};
  // "below|<|under N", or "minimum threshold of N"
  var minThreshold=t.match(/(?:below|minimum|lower|less\s+than).*?(?:threshold\s+(?:of\s+)?)?(\d+(?:\.\d+)?)/);
  if(minThreshold)return{lo:Number(minThreshold[1])};
  var below=t.match(/(?:<\s*|under)\s*(\d+(?:\.\d+)?)/);
  if(below)return{lo:Number(below[1])};
  return null;
}

// validateConsistency: walks every assessItem and classifies any
// contradiction. Returns array of decisions:
//   {itemId, label, phase, kind, message, suggestedBad}
// Kinds: "autocorrect" (caller may set bad to suggestedBad),
//        "warning" (threshold direction looks wrong, keep flag),
//        "ambiguous" (surface to UI but do not mutate).
export function validateConsistency(sc){
  var decisions=[];
  if(!sc||!Array.isArray(sc.phases))return decisions;
  function checkItem(it,phaseName){
    if(!it||!it.label||!it.why)return;
    var val=parseValue(it.label);
    if(!val)return;
    var thr=parseThreshold(it.why);
    if(!thr)return;
    var v=val.primary;
    var hasLo=thr.lo!==undefined;
    var hasHi=thr.hi!==undefined;
    var violatesLo=hasLo&&v<thr.lo;
    var violatesHi=hasHi&&v>thr.hi;
    var withinRange=hasLo&&hasHi&&v>=thr.lo&&v<=thr.hi;
    if(it.bad&&!violatesLo&&!violatesHi){
      // Contradiction: marked abnormal, no violation found.
      if(withinRange){
        // C1: auto-correct — verifiably within stated normal range.
        decisions.push({
          itemId:it.id,label:it.label,phase:phaseName,
          kind:"autocorrect",suggestedBad:false,
          message:"Value "+v+" lies within stated normal ["+thr.lo+"-"+thr.hi+"]; auto-unflagging."
        });
        return;
      }
      // Single-sided threshold. Two sub-cases:
      if(hasLo&&!hasHi){
        // Parser found "lo=N" but value is >= N. If value is far above N,
        // the AI likely meant a hi threshold ("above N is bad") and the
        // parser misread the wording. Keep the flag, log a warning.
        if(v>=thr.lo*1.5){
          decisions.push({
            itemId:it.id,label:it.label,phase:phaseName,
            kind:"warning",
            message:"Value "+v+" is well above "+thr.lo+"; threshold wording likely misparsed but flag stands."
          });
          return;
        }
      }
      if(hasHi&&!hasLo&&v<=thr.hi*0.5){
        decisions.push({
          itemId:it.id,label:it.label,phase:phaseName,
          kind:"warning",
          message:"Value "+v+" is well below "+thr.hi+"; threshold wording likely misparsed but flag stands."
        });
        return;
      }
      // Anything else: ambiguous — surface to UI but do not mutate.
      decisions.push({
        itemId:it.id,label:it.label,phase:phaseName,
        kind:"ambiguous",
        message:"Flagged abnormal but value "+v+" does not violate stated threshold"+(hasLo?" lo="+thr.lo:"")+(hasHi?" hi="+thr.hi:"")+"."
      });
    }
  }
  sc.phases.forEach(function(p){
    if(!p||!Array.isArray(p.assessItems))return;
    p.assessItems.forEach(function(it){checkItem(it,p.name||p.id);});
  });
  if(sc.curveball&&Array.isArray(sc.curveball.assessItems)){
    sc.curveball.assessItems.forEach(function(it){checkItem(it,"Curveball: "+(sc.curveball.name||""));});
  }
  return decisions;
}

// applyAutocorrections: mutates scenario in-place to apply autocorrect
// decisions. Returns count applied.
export function applyAutocorrections(sc,decisions){
  var applied=0;
  if(!sc||!Array.isArray(sc.phases))return 0;
  decisions.forEach(function(d){
    if(d.kind!=="autocorrect")return;
    var found=false;
    sc.phases.forEach(function(p){
      if(!Array.isArray(p.assessItems))return;
      p.assessItems.forEach(function(it){
        if(it.id===d.itemId){it.bad=d.suggestedBad;found=true;}
      });
    });
    if(!found&&sc.curveball&&Array.isArray(sc.curveball.assessItems)){
      sc.curveball.assessItems.forEach(function(it){
        if(it.id===d.itemId){it.bad=d.suggestedBad;found=true;}
      });
    }
    if(found)applied++;
  });
  return applied;
}

// validateCounts: warn if AI returned fewer per-category items than
// the prompt asked for. Phase-2.6 C2.
export function validateCounts(sc){
  var warnings=[];
  if(!sc||!Array.isArray(sc.phases))return warnings;
  sc.phases.forEach(function(p,idx){
    if(!Array.isArray(p.assessItems))return;
    var byCat={vital:0,lab:0,clinical:0};
    p.assessItems.forEach(function(it){if(byCat[it.cat]!==undefined)byCat[it.cat]++;});
    if(idx===0){
      if(p.assessItems.length<6)warnings.push({phase:p.name||p.id,message:"Only "+p.assessItems.length+" assess items in triage phase; prompt asked for 6-8."});
      ["vital","lab","clinical"].forEach(function(cat){
        if(byCat[cat]<3)warnings.push({phase:p.name||p.id,message:"Only "+byCat[cat]+" "+cat+" items; prompt asked for 3+ each category."});
      });
    }
  });
  return warnings;
}
