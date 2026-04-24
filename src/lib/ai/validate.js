// Post-generation validators for AI scenario responses.
// Phase-2.5 issue 4: catch contradictions (flagged-abnormal items whose
// stated value does not actually violate the stated threshold) without
// rewriting the scenario. Also hard-enforce required fields so a
// malformed scenario fails loud instead of crashing mid-render.

// Schema validation - returns array of error strings. Empty = valid.
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

// Extract a numeric value from an assess item label.
// Returns {value, unit, lo, hi} or null if not parseable.
// Handles: "HR 178", "SBP 82", "BP 82/45", "SpO2 97%", "Lactate 5.8 mmol/L",
// "Cap Refill 4s", "Temp 39.2C", "Glucose 48 mg/dL".
function parseValue(label){
  if(!label||typeof label!=="string")return null;
  var l=label.trim();
  // BP pattern: first number before slash is SBP
  var bpMatch=l.match(/^(?:BP\s+)?(\d{2,3})\/(\d{2,3})/i);
  if(bpMatch)return{primary:Number(bpMatch[1]),secondary:Number(bpMatch[2]),kind:"bp"};
  // Generic number — pick the first standalone number
  var m=l.match(/([-+]?\d+(?:\.\d+)?)/);
  if(!m)return null;
  return{primary:Number(m[1]),kind:"number"};
}

// Extract a threshold range from a why text.
// Returns {lo, hi} or null.
// Examples:
//   "normal 100-160" => {lo:100, hi:160}
//   "normal 0.5-2.0" => {lo:0.5, hi:2}
//   "below normal threshold of 80" => {lo:80}
//   "above 4" => {hi:4}
//   "critical <45" => {lo:45}
//   "minimum acceptable threshold of 80" => {lo:80}
function parseThreshold(why){
  if(!why||typeof why!=="string")return null;
  var t=why.toLowerCase();
  // normal A-B or normal A to B
  var rangeMatch=t.match(/normal\s+(\d+(?:\.\d+)?)\s*[-to]+\s*(\d+(?:\.\d+)?)/);
  if(rangeMatch)return{lo:Number(rangeMatch[1]),hi:Number(rangeMatch[2])};
  // threshold of N (minimum)
  var minThreshold=t.match(/(?:below|minimum|lower).*?threshold\s+(?:of\s+)?(\d+(?:\.\d+)?)/);
  if(minThreshold)return{lo:Number(minThreshold[1])};
  // above N
  var above=t.match(/(?:above|>\s*|over)\s*(\d+(?:\.\d+)?)/);
  if(above)return{hi:Number(above[1])};
  // below N / < N
  var below=t.match(/(?:below|<\s*|under)\s*(\d+(?:\.\d+)?)/);
  if(below)return{lo:Number(below[1])};
  return null;
}

// Consistency validation: for each bad:true assessItem that states a
// threshold in its why, confirm the label's value actually violates it.
// Returns array of warning objects {itemId, label, message}.
export function validateConsistency(sc){
  var warnings=[];
  if(!sc||!Array.isArray(sc.phases))return warnings;
  function checkItem(it,phaseName){
    if(!it||!it.bad||!it.label||!it.why)return;
    var val=parseValue(it.label);
    if(!val)return;
    var thr=parseThreshold(it.why);
    if(!thr)return;
    var v=val.primary;
    var violatesLo=thr.lo!==undefined&&v<thr.lo;
    var violatesHi=thr.hi!==undefined&&v>thr.hi;
    var stateBad=it.bad===true;
    if(stateBad&&!violatesLo&&!violatesHi){
      warnings.push({
        itemId:it.id,
        label:it.label,
        phase:phaseName,
        message:"Flagged abnormal but value "+v+" does not violate stated threshold "+(thr.lo!==undefined?"lo="+thr.lo:"")+(thr.hi!==undefined?" hi="+thr.hi:"")
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
  return warnings;
}
