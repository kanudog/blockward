import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Activity, Wind, Droplets, Zap, Thermometer, Timer, Eye, Syringe, Stethoscope, Shield, Gauge, Pin, Brain, ChevronRight, ChevronDown, ChevronLeft, X, Check, AlertTriangle, Flag, Star, Trophy, FlaskConical, Pill, Beaker, Clock, Search, Plus, Minus, ArrowRight, CircleCheck, CircleX, Sparkles, BookOpen, Users, Play, Settings, Share2, Trash2, RotateCcw, Info, Volume2 } from "lucide-react";
function loadS(k, fb) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch(e) { return fb; } }
function saveS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.error(e); } }
function TextBlock(props){
  var text=props.text||"";var style=props.style||{};
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<=1)return(<p style={style}>{text}</p>);
  return(<div style={style}>{lines.map(function(line,i){
    var trimmed=line.trim();
    var isBullet=trimmed.charAt(0)==="\u2022"||trimmed.charAt(0)==="-"||trimmed.charAt(0)==="\u2013"||trimmed.match(/^\d+[\.\)]/);
    if(isBullet){
      var content=trimmed.replace(/^[\u2022\-\u2013]\s*/,"").replace(/^\d+[\.\)]\s*/,"");
      return(<div key={i} style={{display:"flex",gap:6,marginTop:i>0?3:0}}><span style={{color:"#4ECDC4",flexShrink:0}}>{"\u2022"}</span><span>{content}</span></div>);
    }
    return(<p key={i} style={{marginTop:i>0?6:0}}>{trimmed}</p>);
  })}</div>);
}
function ToolIcon({name, size=24, color="#4ECDC4"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(name) {
    case "glucometer": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="10" y1="8" x2="14" y2="8"/><circle cx="12" cy="14" r="2"/><line x1="12" y1="22" x2="12" y2="20"/></svg>;
    case "stethoscope": return <Stethoscope size={size} color={color} strokeWidth={2}/>;
    case "bvm": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/></svg>;
    case "suction": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M8 8h8l-1 10H9L8 8z"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>;
    case "o2mask": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s-2 2-2 4a4 4 0 008 0c0-2-2-4-2-4"/><ellipse cx="12" cy="10" rx="5" ry="6"/><line x1="12" y1="4" x2="12" y2="2"/><path d="M7 10H3"/><path d="M21 10h-4"/></svg>;
    case "ivKit": return <Syringe size={size} color={color} strokeWidth={2}/>;
    case "defib": return <Zap size={size} color={color} strokeWidth={2}/>;
    case "thermometer": return <Thermometer size={size} color={color} strokeWidth={2}/>;
    case "capRefill": return <Timer size={size} color={color} strokeWidth={2}/>;
    case "needleDecomp": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="16"/><path d="M8 12l4 4 4-4"/><circle cx="12" cy="20" r="2"/></svg>;
    case "pupilCheck": return <Eye size={size} color={color} strokeWidth={2}/>;
    case "epiPen": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="16" rx="2"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="9" y1="6" x2="15" y2="6"/><circle cx="12" cy="10" r="1" fill={color}/></svg>;
    case "peakFlow": return <Wind size={size} color={color} strokeWidth={2}/>;
    default: return <Activity size={size} color={color} strokeWidth={2}/>;
  }
}
function MedIcon({type, size=22, color="#74b9ff"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(type) {
    case "neb": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18v-2a4 4 0 018 0v2"/><rect x="6" y="18" width="12" height="4" rx="1"/><path d="M12 8v4"/><circle cx="12" cy="6" r="2"/><path d="M9 3l3 3 3-3"/></svg>;
    case "oral": return <Pill size={size} color={color} strokeWidth={2}/>;
    case "push": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="14" rx="2"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="10" y1="6" x2="14" y2="6"/><path d="M10 2v-0"/><circle cx="12" cy="10" r="1.5" fill={color}/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5"/><path d="M5 12h14"/><rect x="5" y="7" width="14" height="14" rx="2"/><circle cx="12" cy="15" r="2"/></svg>;
  }
}
var TOOLS = {
  glucometer:{id:"glucometer",label:"Check Glucose",icon:"glucometer",desc:"Heel stick / fingerstick POC glucose"},
  stethoscope:{id:"stethoscope",label:"Auscultate",icon:"stethoscope",desc:"Listen to heart and lung sounds"},
  bvm:{id:"bvm",label:"Bag-Mask Ventilate",icon:"bvm",desc:"Manual ventilation via BVM"},
  suction:{id:"suction",label:"Suction Airway",icon:"suction",desc:"Yankauer oropharyngeal suction"},
  o2mask:{id:"o2mask",label:"Apply O2 15L NRB",icon:"o2mask",desc:"Non-rebreather mask at 15 L/min"},
  ivKit:{id:"ivKit",label:"Establish IV/IO",icon:"ivKit",desc:"Peripheral IV or intraosseous access"},
  defib:{id:"defib",label:"Apply Defib Pads",icon:"defib",desc:"Defibrillator pads for monitoring or shock"},
  thermometer:{id:"thermometer",label:"Recheck Temp",icon:"thermometer",desc:"Recheck core temperature"},
  capRefill:{id:"capRefill",label:"Check Cap Refill",icon:"capRefill",desc:"Press nail bed 5 sec, count refill time"},
  needleDecomp:{id:"needleDecomp",label:"Needle Decompress",icon:"needleDecomp",desc:"14-16g angiocath at 2nd ICS midclavicular"},
  pupilCheck:{id:"pupilCheck",label:"Check Pupils",icon:"pupilCheck",desc:"Assess size, reactivity, symmetry"},
  epiPen:{id:"epiPen",label:"Give IM EpiPen",icon:"epiPen",desc:"IM epinephrine auto-injector to lateral thigh"},
  peakFlow:{id:"peakFlow",label:"Peak Flow Test",icon:"peakFlow",desc:"Measure peak expiratory flow rate"},
};
var MEDS = {
  lorazepam:{id:"lorazepam",label:"Give Lorazepam IV",color:"#6c5ce7",medType:"push",desc:"0.1 mg/kg IV push over 2 min"},
  phenytoin:{id:"phenytoin",label:"Load Fosphenytoin IV",color:"#e17055",medType:"iv",desc:"20 PE/kg IV over 20 min"},
  epinephrine:{id:"epinephrine",label:"Give Epinephrine",color:"#d63031",medType:"push",desc:"0.01 mg/kg IV or 0.01 mg/kg IM"},
  dextrose:{id:"dextrose",label:"Push D10W IV",color:"#fdcb6e",medType:"push",desc:"2-4 mL/kg IV push"},
  nsBolus:{id:"nsBolus",label:"Bolus NS 20mL/kg IV",color:"#74b9ff",medType:"iv",desc:"0.9% NaCl, push-pull technique"},
  ceftriaxone:{id:"ceftriaxone",label:"Give Ceftriaxone IV",color:"#00b894",medType:"iv",desc:"50 mg/kg IV over 30 min"},
  acetaminophen:{id:"acetaminophen",label:"Give Tylenol PO/PR",color:"#ffeaa7",medType:"oral",desc:"15 mg/kg PO or PR"},
  albuterol:{id:"albuterol",label:"Neb Albuterol",color:"#55efc4",medType:"neb",desc:"2.5-5 mg via continuous neb"},
  atropine:{id:"atropine",label:"Give Atropine IV",color:"#fab1a0",medType:"push",desc:"0.02 mg/kg IV push (min 0.1mg)"},
  adenosine:{id:"adenosine",label:"Push Adenosine IV",color:"#ff7675",medType:"push",desc:"0.1 mg/kg rapid IV push with flush"},
  hypertonic:{id:"hypertonic",label:"Give 3% Saline IV",color:"#0984e3",medType:"iv",desc:"5 mL/kg IV over 10-20 min"},
  mannitolMed:{id:"mannitolMed",label:"Give Mannitol IV",color:"#636e72",medType:"iv",desc:"0.5-1 g/kg IV over 15-20 min"},
  levetiracetam:{id:"levetiracetam",label:"Load Keppra IV",color:"#b2bec3",medType:"iv",desc:"20 mg/kg IV over 15 min"},
  diphenhydramine:{id:"diphenhydramine",label:"Give Benadryl IV/IM",color:"#fd79a8",medType:"push",desc:"1 mg/kg IV or IM"},
  methylpred:{id:"methylpred",label:"Give Solumedrol IV",color:"#a29bfe",medType:"push",desc:"2 mg/kg IV push"},
  famotidine:{id:"famotidine",label:"Give Famotidine IV",color:"#81ecec",medType:"push",desc:"0.25 mg/kg IV over 2 min"},
  racemicEpi:{id:"racemicEpi",label:"Neb Racemic Epi",color:"#e17055",medType:"neb",desc:"0.5 mL of 2.25% via neb"},
};
function guessAge(sc) {
  var label = "";
  if (sc && sc.patient && sc.patient.ageLabel) label = sc.patient.ageLabel.toLowerCase();
  else if (sc && sc.tagline) label = sc.tagline.toLowerCase();
  if (!label) return "child";
  if (label.indexOf("newborn") >= 0 || label.indexOf("neonate") >= 0) return "infant";
  var m = label.match(/(\d+)/);
  if (!m) {
    if (label.indexOf("infant") >= 0 || label.indexOf("baby") >= 0) return "infant";
    if (label.indexOf("toddler") >= 0) return "toddler";
    return "child";
  }
  var n = parseInt(m[1]);
  if (label.indexOf("month") >= 0 || label.indexOf("mo") >= 0) {
    if (n <= 12) return "infant";
    if (n <= 36) return "toddler";
    return "child";
  }
  if (label.indexOf("year") >= 0 || label.indexOf("yr") >= 0 || label.indexOf("yo") >= 0) {
    if (n <= 1) return "infant";
    if (n <= 3) return "toddler";
    if (n <= 10) return "child";
    return "teen";
  }
  if (n <= 2) return "infant";
  if (n <= 4) return "toddler";
  if (n <= 10) return "child";
  return "teen";
}
function guessSex(sc) {
  if (!sc || !sc.patient) return "neutral";
  var s = (sc.patient.sex || "").toLowerCase();
  if (s === "male" || s === "m" || s === "boy") return "male";
  if (s === "female" || s === "f" || s === "girl") return "female";
  return "neutral";
}
var SC1 = {
  id:"fussy-infant",title:"The Fussy Infant",tier:1,icon:"\u{1F476}",
  tagline:"6-month-old - Fussiness and Fever",
  description:"A 6-month-old male brought in for increasing fussiness and fever.",
  patient:{ageLabel:"6 months",weightKg:7.5,sex:"Male",cc:"Fussiness and fever x 12 hours",
    history:"Previously healthy. Decreased oral intake, fewer wet diapers today. No sick contacts. Immunizations up to date. Born full-term, no NICU stay."},
  norms:{hr:[100,160],rr:[25,40],sbp:[70,90],dbp:[40,60],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"EMS delivers a six-month-old male with a 12-hour history of fever and fussiness. He is previously healthy with no significant past medical history and immunizations are up to date. His mother reports two episodes of non-bloody emesis and decreased wet diapers since this morning. She administered acetaminophen approximately one hour ago. EMS established a 22-gauge IV in the left hand with a normal saline keep-open drip. Field vitals showed a heart rate of 175 and a rectal temperature of 39.1 degrees Celsius. On your initial assessment, the infant appears flushed and warm but is alert and consolable with a pacifier.",
      vitals:{hr:178,rr:42,sbp:72,dbp:45,spo2:98,temp:39.2,cap:2.5},
      signs:[
        {label:"Skin",detail:"Flushed, warm, generalized erythema",pos:"body",sys:"Integumentary"},
        {label:"Fontanelle",detail:"Flat and soft",pos:"head",sys:"Neuro"},
        {label:"Mucous membranes",detail:"Moist",pos:"face",sys:"GI/Hydration"},
        {label:"Behavior",detail:"Irritable but consolable with pacifier",pos:"head",sys:"Neuro"},
        {label:"Heart sounds",detail:"Tachycardic, regular rhythm, no murmur, no gallop",pos:"body",sys:"Cardiovascular"},
        {label:"Lungs",detail:"Clear bilaterally, equal air entry, no crackles or wheeze",pos:"body",sys:"Respiratory"},
      ],
      assessItems:[
        {id:"hr1",label:"HR 178",cat:"vital",bad:true,why:"Elevated (normal 100-160) but proportional to fever. ~10 bpm per 1C above normal. Infants are rate-dependent for cardiac output."},
        {id:"rr1",label:"RR 42",cat:"vital",bad:true,why:"Mildly elevated (normal 25-40). Fever increases CO2 production driving ventilatory rate up."},
        {id:"bp1",label:"BP 72/45",cat:"vital",bad:false,why:"Normal for age. Maintained BP does NOT rule out early shock - children vasoconstrict aggressively."},
        {id:"spo1",label:"SpO2 98%",cat:"vital",bad:false,why:"Normal. Fetal hemoglobin shifts curve LEFT so sats stay high."},
        {id:"temp1",label:"Temp 39.2C",cat:"vital",bad:true,why:"Febrile. Needs workup for UTI, bacteremia, meningitis at 6 months."},
        {id:"cap1",label:"Cap Refill 2.5s",cat:"vital",bad:false,why:"Borderline (normal < 3s). Worth trending - earliest shock marker."},
        {id:"wbc1",label:"WBC 18.2",cat:"lab",bad:true,why:"Elevated (normal 6-17.5 for age). Leukocytosis with left shift indicates acute bacterial infection. The bone marrow is releasing immature neutrophils (bands) into circulation in response to bacterial cytokine signaling."},
        {id:"glu1",label:"Glucose 72 mg/dL",cat:"lab",bad:false,why:"Normal (>45 mg/dL). Adequate for now, but must be trended in a febrile infant with poor intake. Glycogen stores can deplete rapidly."},
      ],
      labs:[
        {name:"WBC",value:"18.2",unit:"K/uL",ref:"6.0-17.5",critical:true,explain:"Leukocytosis with elevated WBC indicates the bone marrow is releasing white cells in response to infection. The body is mounting an immune response, producing and deploying neutrophils to fight the invading pathogen."},
        {name:"Hgb",value:"11.8",unit:"g/dL",ref:"10.0-14.0",critical:false},
        {name:"Platelets",value:"245",unit:"K/uL",ref:"150-400",critical:false},
        {name:"Glucose",value:"72",unit:"mg/dL",ref:">45",critical:false},
        {name:"Na+",value:"138",unit:"mEq/L",ref:"135-145",critical:false},
        {name:"Lactate",value:"2.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Mildly elevated. Lactate rises when tissues switch to anaerobic metabolism due to inadequate oxygen delivery. At 2.8, this suggests early tissue hypoperfusion. Trending this value is critical - a rising lactate confirms worsening shock."},
        {name:"CRP",value:"8.4",unit:"mg/dL",ref:"<0.5",critical:true,explain:"Markedly elevated C-reactive protein. CRP is an acute-phase reactant produced by the liver in response to IL-6 from macrophages during infection. A value this high in a 6-month-old strongly suggests significant bacterial infection rather than a simple viral illness."},
        {name:"Bands",value:"14%",unit:"",ref:"<5%",critical:true,explain:"Bandemia (elevated band neutrophils) indicates a left shift - the bone marrow is releasing immature neutrophils into circulation because mature neutrophil demand exceeds supply. This is a hallmark of acute bacterial infection and suggests the immune system is under significant stress."},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Twenty minutes after antipyretic administration, the infant's temperature has decreased to 39.0 degrees Celsius. However, his clinical appearance has deteriorated noticeably. He is no longer tracking faces or reaching for objects and responds only sluggishly to tactile stimulation. His extremities are cool to the touch despite persistent core fever, and you observe a new reticular mottling pattern across both lower extremities that was not present on initial assessment. The charge nurse passes the bedside, pauses, and states that the infant does not look right. Your reassessment confirms a significant change from baseline.",
      vitals:{hr:192,rr:52,sbp:68,dbp:40,spo2:97,temp:39.0,cap:4},
      signs:[
        {label:"Mottling",detail:"Reticular purplish pattern, bilateral lower extremities",pos:"body",sys:"Integumentary"},
        {label:"Pulses",detail:"Weak and thready peripherally, central palpable",pos:"body",sys:"Cardiovascular"},
        {label:"Mental status",detail:"Sluggish to voice, not tracking faces",pos:"head",sys:"Neuro"},
        {label:"Extremities",detail:"Cool and clammy hands and feet",pos:"body",sys:"Cardiovascular"},
        {label:"Abdomen",detail:"Soft, hypoactive bowel sounds",pos:"body",sys:"GI"},
        {label:"Urine output",detail:"One concentrated diaper in six hours",pos:"body",sys:"Renal"},
      ],
      assessItems:[
        {id:"hr2",label:"HR 192",cat:"vital",bad:true,why:"Temp DOWN but HR UP. Dissociation = compensatory tachycardia for septic shock, not fever."},
        {id:"rr2",label:"RR 52",cat:"vital",bad:true,why:"Compensatory tachypnea for metabolic acidosis from anaerobic metabolism."},
        {id:"bp2",label:"BP 68/40",cat:"vital",bad:true,why:"Below normal. Hypotension is LATE. 25-30% volume lost. Decompensated shock."},
        {id:"spo2a",label:"SpO2 97%",cat:"vital",bad:false,why:"Deceptive. Saturation not delivery. Poor CO means inadequate O2 delivery."},
        {id:"cap2",label:"Cap Refill 4s",cat:"vital",bad:true,why:"Prolonged. Intense vasoconstriction and tissue ischemia."},
        {id:"lac2",label:"Lactate 5.8 mmol/L",cat:"lab",bad:true,why:"Critically elevated (normal 0.5-2.0). Lactate is produced when cells switch to anaerobic metabolism due to inadequate oxygen delivery. A lactate above 4 in a child indicates severe tissue hypoperfusion and is associated with increased mortality."},
        {id:"glu2",label:"Glucose 48 mg/dL",cat:"lab",bad:true,why:"Borderline low (critical <45). This infant's glycogen stores are depleting. If glucose continues to drop, seizure risk increases significantly. Recheck frequently and be ready to push D10W."},
      ],
      labs:[
        {name:"WBC",value:"22.4",unit:"K/uL",ref:"6.0-17.5",critical:true,explain:"Rising from 18.2 - the infection is progressing and the bone marrow is working harder. Worsening leukocytosis in sepsis correlates with increasing bacterial burden and inflammatory response."},
        {name:"Lactate",value:"5.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Doubled from 2.8 to 5.8. Cells are starving for oxygen and generating lactate through anaerobic glycolysis. Above 4 mmol/L in pediatric sepsis is associated with significantly increased mortality and indicates severe tissue hypoperfusion requiring aggressive fluid resuscitation."},
        {name:"Glucose",value:"48",unit:"mg/dL",ref:">45",critical:true,explain:"Borderline low and dropping from 72. Glycogen stores are depleting rapidly under the metabolic stress of sepsis. If this falls below 45, neuronal function fails and seizure risk skyrockets. Must be monitored closely and treated immediately if it drops further."},
        {name:"Na+",value:"136",unit:"mEq/L",ref:"135-145",critical:false},
        {name:"K+",value:"4.2",unit:"mEq/L",ref:"3.5-5.5",critical:false},
        {name:"pH",value:"7.24",unit:"",ref:"7.35-7.45",critical:true,explain:"Acidotic. The accumulating lactate from anaerobic metabolism is driving the pH down. A pH below 7.25 indicates severe metabolic acidosis. The body attempts to compensate by increasing respiratory rate (blowing off CO2), which is why this infant is tachypneic at 52/min."},
        {name:"HCO3-",value:"14",unit:"mEq/L",ref:"22-26",critical:true,explain:"Low bicarbonate confirms metabolic acidosis. Bicarb is being consumed as it buffers the excess hydrogen ions from lactic acid production. The base deficit of -12 tells you how much bicarb has been used up."},
        {name:"Base deficit",value:"-12",unit:"",ref:"-2 to +2",critical:true,explain:"Severely negative. Base deficit quantifies the total acid load the body is carrying. A value of -12 means the body has consumed 12 mEq/L of buffer capacity trying to neutralize the acid produced by poor perfusion. This correlates directly with the severity and duration of tissue oxygen debt."},
      ],
      tools:["ivKit","stethoscope","capRefill","glucometer","thermometer","defib"],
      meds:["nsBolus","ceftriaxone","acetaminophen","epinephrine","albuterol","dextrose"],
      actions:{tools:{
        ivKit:{ok:true,pri:1,fb:"Essential. You need IV access for fluids and antibiotics. In a vasoconstricted infant, target saphenous or antecubital veins. Two attempts at peripheral access, then go IO at the proximal tibia (1-2 cm below tibial tuberosity, flat medial surface). IO provides equivalent flow rates to central access."},
        stethoscope:{ok:true,pri:null,fb:"Auscultate before pushing fluid. Establish baseline: clear lungs (crackles suggest pneumonia or edema), regular rhythm (irregular rhythm changes approach), no murmur (new murmur raises endocarditis concern), no S3 gallop (volume overload marker). Re-auscultate lungs after each bolus for developing crackles."},
        capRefill:{ok:true,pri:null,fb:"Best real-time perfusion tracker in pediatrics. Press nail bed 5 seconds, release, count. Currently 4 seconds (normal <2). After each 20 mL/kg bolus, recheck. Improvement toward 2-3 seconds = effective resuscitation. No improvement after 40-60 mL/kg = consider vasopressors or alternative etiology."},
        glucometer:{ok:true,pri:2,fb:"Check immediately. A 6-month-old has only 3-4g hepatic glycogen (vs 70-100g adults). After 12 hours of illness with poor intake, stores may be depleted. Sepsis accelerates glucose consumption due to activated immune cell demand. Hypoglycemia <45 mg/dL causes seizures and brain injury. If low: D10W 2-4 mL/kg IV."},
        thermometer:{ok:false,pri:null,fb:"Temp is 39.0C and trending down from 39.2C. Rechecking provides no new information. The problem is cardiovascular collapse, not fever. Temperature management comes after ABCs are stabilized and resuscitation is underway."},
        defib:{ok:false,pri:null,fb:"You just shocked a baby in sinus tachycardia. The baby did not appreciate that. The rhythm is sinus tach - a normal compensatory response to sepsis. There is no shockable rhythm here. Defibrillation is for ventricular fibrillation or pulseless ventricular tachycardia only. Please put the paddles down and go give this child some fluid."},
      },meds:{
        nsBolus:{ok:true,pri:1,fb:"First-line intervention. Push 20 mL/kg (150 mL) of 0.9% NS via push-pull technique over 5 minutes. Sepsis causes vasodilation and capillary leak, depleting effective circulating volume. Crystalloid restores preload, increasing stroke volume via Frank-Starling mechanism. Reassess after each bolus. Repeat up to 60 mL/kg total. No improvement = fluid-refractory shock, start vasopressors."},
        ceftriaxone:{ok:true,pri:2,fb:"Broad-spectrum antibiotics must begin within 60 minutes of recognizing sepsis. Ceftriaxone 50 mg/kg IV covers S. pneumoniae, N. meningitidis, E. coli, and H. influenzae. Binds penicillin-binding proteins, inhibiting peptidoglycan crosslinking, leading to bacterial cell wall rupture. Draw cultures first if quick (<5 min), but never delay antibiotics for cultures. Each hour of delay increases mortality 4-8%."},
        acetaminophen:{ok:false,pri:null,fb:"Already given 20 minutes ago and within therapeutic window. The tachycardia is NOT fever-driven anymore - HR-temp dissociation proves compensatory shock physiology. Fever itself is a beneficial immune response up to 39.5C (enhances neutrophil chemotaxis and antibody production). The cardiovascular collapse is the emergency, not the temperature."},
        epinephrine:{ok:false,pri:null,fb:"Wrong timing. Epinephrine stimulates alpha-1, beta-1, and beta-2 receptors and IS appropriate for fluid-refractory septic shock. But no fluid has been given yet. Vasopressors on an empty vascular tree produces high SVR with dangerously low CO - BP number may transiently improve while tissue perfusion worsens. Algorithm: volume first (up to 60 mL/kg), then epi 0.05-0.3 mcg/kg/min if still hypotensive."},
        albuterol:{ok:false,pri:null,fb:"No airway pathology present. Albuterol is a beta-2 agonist for bronchospasm. The tachypnea here is metabolic acidosis compensation - poor perfusion causes lactic acid buildup, stimulating central chemoreceptors to increase RR. Adding albuterol causes unnecessary tachycardia without addressing the perfusion deficit. Fix the volume and the tachypnea resolves."},
        dextrose:{ok:false,pri:null,fb:"Check glucose FIRST, do not give empirically. If glucose is normal, empiric dextrose causes iatrogenic hyperglycemia. In sepsis, hyperglycemia worsens outcomes through osmotic diuresis, impaired neutrophil bactericidal function, and pro-inflammatory AGE production. Measure, then treat if <45 mg/dL."},
      }},
    },
  ],
  curveball:{
    name:"Seizure During Resuscitation",
    narrative:"During active fluid resuscitation at approximately 90 mL into the first normal saline bolus, the infant abruptly develops generalized tonic-clonic seizure activity. Both upper and lower extremities exhibit rhythmic, synchronized flexion-extension movements with truncal rigidity. The SpO2 begins to fall rapidly on the monitor as the heart rate climbs. You observe perioral cyanosis developing and note that the infant is not generating effective respiratory effort between the tonic-clonic phases. The eyes are deviated upward and to the right. The respiratory therapist arrives with the crash cart and multiple team members converge at the bedside.",
    vitals:{hr:210,rr:8,sbp:62,dbp:35,spo2:83,temp:39.0,cap:5},
    signs:[
      {label:"Motor",detail:"Generalized tonic-clonic activity, all extremities",pos:"body"},
      {label:"Cyanosis",detail:"Perioral and circumoral, dusky blue",pos:"face"},
      {label:"Breathing",detail:"Apneic pauses between tonic-clonic phases",pos:"body"},
      {label:"Eyes",detail:"Deviated upward and to the right, pupils dilated",pos:"head"},
    ],
    labs:[
      {name:"Glucose",value:"32",unit:"mg/dL",ref:">45",critical:true,explain:"Critically low. This is the most likely cause of the seizure. Glycogen stores are exhausted and the brain has lost its primary fuel source. Neurons cannot generate ATP, the Na/K pump fails, membranes depolarize, and seizure results. D10W 2-4 mL/kg is potentially curative."},
      {name:"Lactate",value:"8.1",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Severely elevated from 5.8 - the seizure itself is generating massive lactate. Sustained muscle contraction during tonic-clonic activity is entirely anaerobic. Combined with the ongoing septic shock, tissue oxygen debt is now critical."},
      {name:"pH",value:"7.18",unit:"",ref:"7.35-7.45",critical:true,explain:"Worsening acidosis. Both the seizure (lactic acid from muscle) and the shock (lactic acid from tissue hypoperfusion) are driving the pH down. Below 7.20, cardiac contractility begins to decline and catecholamines become less effective."},
      {name:"pO2",value:"48",unit:"mmHg",ref:"80-100",critical:true,explain:"Severely hypoxic. Corresponds to the SpO2 of 83%. The infant is not ventilating effectively during the seizure because the respiratory muscles are contracting with everything else. The brain is seizing AND hypoxic simultaneously - a double insult."},
    ],
    tools:["suction","o2mask","bvm","glucometer","stethoscope","defib"],
    meds:["lorazepam","phenytoin","dextrose","epinephrine","nsBolus","atropine"],
    actions:{tools:{
      suction:{ok:true,pri:1,fb:"Protect the airway first. Seizing infant has lost gag, cough, and swallow reflexes. High aspiration risk from salivation and vomiting. Use Yankauer catheter for oropharyngeal suction. Avoid deep flexible catheter suctioning - stimulates vagus nerve, can trigger bradycardia."},
      o2mask:{ok:true,pri:2,fb:"SpO2 83% = PaO2 approximately 48 mmHg, severely hypoxic. Apply non-rebreather at 10-15 L/min (delivers 60-80% FiO2). The seizing brain has massively increased O2 demand while ventilation is impaired. Hypoxic brain injury begins within 4-6 minutes."},
      bvm:{ok:true,pri:null,fb:"Have at bedside. Do NOT ventilate during tonic phase when glottis is contracted. Deliver gentle breaths during clonic relaxation phases only. Avoid over-bagging - causes gastric distension and increased aspiration risk."},
      glucometer:{ok:true,pri:3,fb:"Check POC glucose immediately. Infant hepatic glycogen: 3-4g (adults: 70-100g). After 12 hours of illness, stores may be exhausted. Infant gluconeogenesis pathways are immature. If glucose <45 mg/dL, push D10W 2-4 mL/kg. Glucose correction alone may terminate the seizure."},
      stethoscope:{ok:false,pri:null,fb:"Cannot auscultate meaningfully during active tonic-clonic seizure. Muscle contraction artifact drowns out heart and lung sounds. Useful AFTER seizure control to assess for aspiration or arrhythmia. Not a priority right now."},
      defib:{ok:false,pri:null,fb:"HR 210 with narrow QRS = sinus tachycardia. Appropriate physiologic response to seizure, hypoxia, and catecholamine surge. Defibrillation is for VF or pulseless VT only. Shocking sinus tachycardia could induce an actual arrhythmia. Monitor pads are fine but do not charge."},
    },meds:{
      lorazepam:{ok:true,pri:1,fb:"First-line antiepileptic. 0.1 mg/kg IV (0.75 mg for this infant). Binds GABA-A receptor benzodiazepine site, increasing chloride channel opening frequency. Chloride influx hyperpolarizes the neuron from -70mV toward -90mV, suppressing the electrical storm. Onset 1-3 min IV. Alternative: midazolam 0.2 mg/kg IN or IM. Two failed doses = status epilepticus."},
      phenytoin:{ok:false,pri:null,fb:"Second-line only after two benzodiazepine doses fail. Fosphenytoin blocks voltage-gated sodium channels. Requires 20-minute infusion (rapid push causes hypotension and arrhythmia via His-Purkinje depression). Too slow for first-line use. Also: always check glucose before escalating antiepileptics - hypoglycemia-driven seizures will not respond to antiepileptics."},
      dextrose:{ok:true,pri:2,fb:"Give after checking glucose. If <45 mg/dL, push D10W 2-4 mL/kg (15-30 mL). Use D10W in infants, not D25 or D50 (hyperosmolar, causes venous endothelial damage and rebound hyperinsulinemia). Without glucose, neuronal ATP production stops, Na/K ATPase fails, membrane depolarizes uncontrollably. May terminate seizure within 1-2 minutes."},
      epinephrine:{ok:false,pri:null,fb:"Harmful in this context. Beta-1 stimulation increases myocardial O2 demand (HR already 210). Alpha-1 increases afterload. CNS catecholamine stimulation lowers seizure threshold. Epinephrine also raises ICP. Indicated for pulseless arrest or fluid-refractory shock only. Neither applies here."},
      nsBolus:{ok:true,pri:null,fb:"Do NOT stop the bolus. The seizure was caused by sepsis (hypoglycemia, meningitis, or fever), not by normal saline. Septic shock is still present and requires ongoing volume resuscitation. Continue fluid while managing seizure simultaneously. Delegate tasks across the team."},
      atropine:{ok:false,pri:null,fb:"Blocks M2 muscarinic receptors, increasing heart rate by removing vagal tone. Patient is already at 210 bpm. Pushing atropine could drive rate above 220, reducing diastolic filling time so severely that stroke volume drops and CO paradoxically falls. Indicated for symptomatic bradycardia only."},
    }},
    teaches:[
      {title:"Why Infants Seize in Sepsis",content:"Seizures in septic infants arise from three converging mechanisms. First, hypoglycemia: infants store only 3-4 grams of hepatic glycogen compared to 70-100 grams in adults, and their glucose utilization rate is 4-6 mg/kg/min at baseline. Sepsis can double or triple this rate because activated neutrophils and macrophages are obligate glucose consumers, and the catecholamine surge of shock accelerates glycogenolysis. Once stores are exhausted, gluconeogenesis in infants is too immature to compensate (the key enzymes PEPCK and glucose-6-phosphatase are not yet fully expressed). The result is neuronal energy failure: without glucose, ATP production via glycolysis and the Krebs cycle halts, the Na/K ATPase pump fails, the membrane depolarizes uncontrollably, and a seizure initiates. Second, direct CNS infection: bacteria can cross the blood-brain barrier more easily in infants because the tight junctions between cerebral endothelial cells are less mature. Once bacteria enter the CSF, the inflammatory response (complement activation, cytokine release, neutrophil infiltration) causes cerebral edema, increased intracranial pressure, and cortical irritability leading to seizure. Third, fever itself: febrile seizures occur in 2-5% of neurologically normal children between 6 months and 5 years. The mechanism is not fully understood but likely involves temperature-sensitive ion channels (TRPV1 and TRPV4) that alter neuronal excitability when core temperature rises rapidly. In sepsis, never assume a seizure is a simple febrile seizure without ruling out hypoglycemia and meningitis first.",tldr:"Infants seize in sepsis because of low glucose (tiny glycogen stores), bacteria crossing an immature blood-brain barrier, or fever. Always check glucose first."},
      {title:"Glucose: The Forgotten Critical Value",content:"The infant brain consumes approximately 60% of total body glucose production, compared to 25% in adults. This disproportionate demand exists because the infant brain is relatively larger (10-12% of body weight vs 2% in adults) and has a higher metabolic rate per gram of tissue due to active synaptogenesis and myelination. Unlike adult neurons, which can partially switch to ketone body oxidation during prolonged fasting, infant neurons have limited capacity to utilize alternative fuels in the acute setting because the enzymes for ketolysis (beta-hydroxybutyrate dehydrogenase and succinyl-CoA:3-oxoacid CoA transferase) are not yet fully upregulated. When serum glucose falls below 45 mg/dL, the immediate consequence is failure of the Na/K ATPase, which requires approximately 50% of neuronal ATP output to maintain the -70mV resting membrane potential. As the pump fails, sodium leaks in, the membrane depolarizes, voltage-gated calcium channels open, and intracellular calcium rises to toxic levels triggering both seizure activity and excitotoxic cell death through calpain and caspase activation. Treatment is D10W at 2-4 mL/kg IV push. D10 is used in infants rather than D25 or D50 because the higher-concentration solutions are hyperosmolar (D50 has an osmolality of approximately 2,525 mOsm/L) and cause direct endothelial injury, phlebitis, and tissue necrosis if extravasated. Always recheck glucose 15 minutes after correction to ensure adequacy, and consider starting a continuous dextrose infusion (glucose infusion rate of 6-8 mg/kg/min) if the underlying cause of hypoglycemia persists.",tldr:"Infant brains use 60% of all glucose and cannot switch to backup fuels. Below 45 mg/dL, neurons lose power and seize. Treat with D10W (not D50 - too concentrated for small veins)."},
      {title:"Parallel Crisis Management",content:"The PICU frequently presents overlapping emergencies that require simultaneous management. The key principle is ABC prioritization with parallel task execution through team delegation. In this scenario, the infant has two concurrent life-threatening problems: septic shock requiring fluid resuscitation and antibiotics, and a generalized seizure requiring airway protection and antiepileptic therapy. Stopping the fluid bolus to manage the seizure would worsen the shock. Ignoring the seizure to continue the bolus would allow ongoing hypoxia and potential brain injury. The solution is parallel processing: one team member manages the airway (positioning, suction, oxygen delivery), another draws up and administers lorazepam, a third continues the fluid bolus and monitors the infusion pump, and the physician directs the overall resuscitation and makes prioritization decisions. Time-based protocols run simultaneously: the seizure protocol (benzodiazepine at time zero, repeat at 5 minutes, second-line agent at 10 minutes if refractory) and the sepsis bundle (blood cultures, antibiotics within 60 minutes, fluid resuscitation to perfusion targets). Effective communication tools include closed-loop communication (repeat-back of orders), time calls (announcing elapsed time since seizure onset), and designated role assignments at the start of the resuscitation.",tldr:"When two emergencies happen at once, do not stop treating one to treat the other. Delegate tasks across the team and run both protocols in parallel."},
    ],
  },
  debrief:{
    summary:"You identified septic shock by recognizing HR-temperature dissociation, initiated resuscitation, and managed an unexpected seizure.",
    explainers:[
      {title:"HR-Temperature Dissociation",content:"In infants, cardiac output is calculated as heart rate multiplied by stroke volume. Unlike older children and adults who can increase stroke volume by augmenting contractility and preload utilization, infants have a relatively fixed stroke volume because their immature myocardium contains fewer contractile elements (sarcomeres), has lower ventricular compliance, and operates near the top of its Frank-Starling curve at baseline. This means infants are fundamentally rate-dependent for cardiac output. During fever, the expected heart rate increase is approximately 10 beats per minute for each 1 degree Celsius above 37. This thermoregulatory tachycardia is driven by increased metabolic oxygen demand: fever raises the basal metabolic rate by roughly 10-13% per degree Celsius via accelerated enzymatic reactions, requiring proportionally more oxygen delivery. When an antipyretic is administered and the temperature decreases, you would expect the heart rate to decrease proportionally. If instead the temperature falls but the heart rate rises or remains disproportionately elevated, the tachycardia is no longer thermoregulatory. It is now driven by the sympathetic nervous system compensating for a different problem, most commonly hypovolemia or vasodilation from sepsis. The adrenal medulla releases epinephrine and norepinephrine in response to baroreceptor sensing of decreased arterial stretch (reduced circulating volume), which directly stimulates beta-1 adrenergic receptors on the sinoatrial node to increase firing rate. This HR-temperature dissociation is one of the earliest and most reliable clinical indicators of septic shock in febrile infants.",tldr:"Infant hearts depend on rate, not squeeze strength, for output. Fever raises HR predictably (~10 bpm per degree). If temp goes down but HR goes up, the tachycardia is from shock, not fever."},
      {title:"Why Children Maintain BP Until Collapse",content:"Pediatric patients have proportionally larger adrenal glands relative to body size compared to adults, and their sympathetic nervous system is highly reactive. When cardiac output falls from any cause (hypovolemia, sepsis, cardiogenic), baroreceptors in the carotid sinus and aortic arch detect reduced arterial wall stretch and trigger a massive sympathetic discharge. This produces intense peripheral vasoconstriction through alpha-1 adrenergic receptor activation on arteriolar smooth muscle, which increases systemic vascular resistance (SVR) and maintains mean arterial pressure (MAP = CO x SVR). Because MAP is maintained, the blood pressure reading on the monitor appears reassuringly normal even as tissue perfusion is deteriorating. The clinical signs that betray this compensated state are the perfusion markers: capillary refill time prolongs because arteriolar constriction throttles inflow to the capillary beds; skin becomes mottled as dermal blood flow becomes patchy; extremities cool as blood is shunted away from the periphery; mental status declines as cerebral autoregulation approaches its lower limit; and urine output falls as renal perfusion drops below the threshold for adequate glomerular filtration. These signs change well before blood pressure drops. When BP finally does fall, it indicates that the compensatory mechanisms have been exhausted. Catecholamine stores in the adrenal medulla are depleted, SVR can no longer be maintained, and the patient transitions abruptly from compensated to decompensated shock. In children this transition is often described as falling off a cliff because it is sudden rather than gradual. Hypotension in a child is a pre-arrest sign representing loss of approximately 25-30% of circulating blood volume.",tldr:"Kids vasoconstrict aggressively to maintain BP. Cap refill, skin color, and mental status change way before BP drops. When BP finally falls, they have lost 25-30% of their blood volume and are about to arrest."},
      {title:"Infant Glucose Vulnerability",content:"The metabolic vulnerability of infants to hypoglycemia stems from a fundamental mismatch between glucose demand and storage capacity. Hepatic glycogen in a full-term neonate is approximately 5% of liver weight, yielding roughly 3-4 grams of total glycogen storage. Adults store 70-100 grams. Meanwhile, the infant brain, which constitutes 10-12% of total body weight (versus 2% in adults), consumes approximately 60% of total glucose production through obligate aerobic glycolysis. Under normal fasting conditions, these glycogen stores provide approximately 4-8 hours of glucose supply at the basal utilization rate of 4-6 mg/kg/min. Any condition that increases metabolic demand (fever, sepsis, seizures, cold stress) or impairs intake (vomiting, NPO status) accelerates depletion. Sepsis is particularly dangerous because it simultaneously increases demand (activated immune cells consume glucose at high rates, and catecholamine-driven glycogenolysis rapidly exhausts stores) and impairs the compensatory gluconeogenic response (sepsis-associated hepatic dysfunction reduces the liver's ability to synthesize new glucose from lactate, amino acids, and glycerol). The immature expression of gluconeogenic enzymes (phosphoenolpyruvate carboxykinase, fructose-1,6-bisphosphatase, and glucose-6-phosphatase) further limits this backup pathway. When serum glucose falls below the critical threshold of 45 mg/dL, neuronal mitochondrial ATP production collapses. The Na/K ATPase pump, which consumes roughly half of all neuronal ATP, fails first. Sodium leaks into the cell, the membrane depolarizes, voltage-gated calcium channels open, and the resulting calcium influx triggers both seizure activity and excitotoxic cascades (calpain activation, mitochondrial membrane permeabilization, and caspase-mediated apoptosis). Treatment is D10W at 2-4 mL/kg IV push. D10 (100 mg/mL) is preferred over D25 or D50 in infants because higher-concentration dextrose solutions are hyperosmolar and cause endothelial damage, phlebitis, and tissue necrosis. The goal is a glucose delivery of 200-400 mg/kg, which typically raises serum glucose by 60-120 mg/dL.",tldr:"Babies have almost no glucose reserves (3-4g vs 70-100g in adults) and their brains consume most of it. Sepsis burns through it fast. Below 45 mg/dL = seizures. Check glucose on every sick infant."},
    ],
  },
};
var SC2 = {
  id:"vomiting-toddler",title:"Won't Stop Vomiting",tier:2,icon:"\u{1F922}",
  tagline:"2-year-old - Vomiting and Lethargy",
  description:"A 2-year-old with 3 days of vomiting and diarrhea, increasingly lethargic.",
  patient:{ageLabel:"2 years",weightKg:12,sex:"Male",cc:"Vomiting/diarrhea x 3 days, lethargy",
    history:"Marcus has been sick for three days. Started with watery diarrhea, then vomiting everything including Pedialyte. His mom says he had one wet diaper in the last 12 hours and is sleeping way more than usual. No fever. Previously healthy, no medications."},
  norms:{hr:[80,130],rr:[20,30],sbp:[80,100],dbp:[50,65],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"You receive report on a two-year-old male named Marcus presenting with a three-day history of vomiting and watery diarrhea. His mother has attempted oral rehydration with Pedialyte but he has been unable to tolerate any oral intake. She reports only one wet diaper in the past 24 hours compared to his usual six to seven per day. He has no fever, no blood in the stool, and no known sick contacts. His weight on arrival is 12 kilograms. On initial assessment, the child is limp and lethargic in his mother's arms, opening his eyes briefly to voice but not reaching or engaging. His lips are dry and cracked, and the anterior fontanelle is visibly sunken.",
      vitals:{hr:155,rr:30,sbp:88,dbp:58,spo2:99,temp:36.8,cap:3},
      signs:[
        {label:"Skin turgor",detail:"Tenting on abdomen, >2 seconds recoil",pos:"body"},
        {label:"Fontanelle",detail:"Anterior fontanelle sunken",pos:"head"},
        {label:"Mucous membranes",detail:"Dry, tacky lips and tongue",pos:"face"},
        {label:"Behavior",detail:"Lethargic, arousable to voice briefly",pos:"head"},
      ],
      assessItems:[
        {id:"hr2_1",label:"HR 155",cat:"vital",bad:true,why:"Elevated for a 2-year-old (normal 80-130). Tachycardia is the earliest compensatory response to hypovolemia. Baroreceptors in the carotid sinus detect reduced stretch from low circulating volume and trigger sympathetic activation."},
        {id:"rr2_1",label:"RR 30",cat:"vital",bad:false,why:"Normal for age (20-30). No respiratory compensation yet, which means metabolic acidosis is not yet severe enough to trigger Kussmaul breathing."},
        {id:"bp2_1",label:"BP 88/58",cat:"vital",bad:false,why:"Normal for a 2-year-old (SBP 80-100). BP is being MAINTAINED despite volume loss. This is compensated shock - the child is vasoconstricting hard to keep perfusion pressure. The cap refill and mental status tell the real story."},
        {id:"spo2_1",label:"SpO2 99%",cat:"vital",bad:false,why:"Normal. No respiratory compromise. Dehydration alone doesn't typically affect oxygenation unless severe enough to cause shock-related pulmonary changes."},
        {id:"cap2_1",label:"Cap Refill 3s",cat:"vital",bad:true,why:"At the upper limit of normal. In a child with clear dehydration, this is the first sign of impaired perfusion. Sympathetic vasoconstriction is already redirecting blood from the skin to vital organs."},
        {id:"temp2_1",label:"Temp 36.8C",cat:"vital",bad:false,why:"Normal. Afebrile gastroenteritis is common in viral etiologies (rotavirus, norovirus). The absence of fever does NOT make this less serious - the dehydration is the threat."},
        {id:"bun2_1",label:"BUN 32 mg/dL",cat:"lab",bad:true,why:"Elevated (normal 5-18). BUN rises in dehydration because reduced renal blood flow increases urea reabsorption in the proximal tubule. A BUN/Cr ratio >20 suggests pre-renal azotemia from volume depletion."},
        {id:"co2_1",label:"CO2 30 mEq/L",cat:"lab",bad:true,why:"Elevated (normal 20-28). In the context of vomiting, elevated bicarb indicates metabolic alkalosis from loss of gastric HCl. The body is retaining bicarbonate to compensate for hydrogen ion losses."},
      ],
      labs:[
        {name:"Na+",value:"134",unit:"mEq/L",ref:"135-145",critical:false},
        {name:"K+",value:"2.9",unit:"mEq/L",ref:"3.5-5.5",critical:true,explain:"Low from GI losses. Gastric fluid contains potassium, and the kidneys worsen it by excreting K+ to retain H+ during alkalosis. Below 3.0, ECG changes begin (flattened T waves, U waves). Below 2.5, arrhythmia risk is high."},
        {name:"Cl-",value:"88",unit:"mEq/L",ref:"98-106",critical:true,explain:"Low from loss of gastric HCl. Hypochloremia triggers the kidneys to retain bicarbonate (because Cl- and HCO3- are exchanged in the renal tubule), worsening the metabolic alkalosis."},
        {name:"CO2",value:"30",unit:"mEq/L",ref:"20-28",critical:true,explain:"Elevated total CO2 (bicarbonate) confirms metabolic alkalosis. The body is retaining bicarb to compensate for the massive H+ losses from vomiting. This alkalosis drives further potassium wasting through the kidney."},
        {name:"BUN",value:"32",unit:"mg/dL",ref:"5-18",critical:true,explain:"Elevated BUN with BUN/Cr ratio >20 indicates pre-renal azotemia. Reduced kidney perfusion from dehydration causes increased urea reabsorption in the proximal tubule. The kidneys are not damaged - they are underperfused."},
        {name:"Cr",value:"0.5",unit:"mg/dL",ref:"0.2-0.4",critical:true,explain:"Mildly elevated for a 2-year-old. GFR is declining from reduced renal blood flow. This is still pre-renal but approaching the threshold where acute kidney injury may develop if perfusion is not restored."},
        {name:"Glucose",value:"68",unit:"mg/dL",ref:"60-100",critical:false},
        {name:"Lactate",value:"3.2",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Mildly elevated. Tissue perfusion is compromised enough that some cells are switching to anaerobic metabolism. This confirms the cap refill and mental status findings - this child is in compensated shock."},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Peripheral IV access was obtained on the second attempt due to poor venous filling from dehydration. Twenty minutes into admission, your reassessment reveals clinical deterioration. The child's hands and feet are now cold to the touch with a capillary refill time exceeding five seconds. You observe mottling extending from the knees distally in a reticular pattern. He responds only to painful stimulation with a weak grimace and withdrawal. His eyes are open but unfocused with no purposeful gaze. This represents a significant decline from his arrival status and suggests progression from compensated to decompensated hypovolemic shock.",
      vitals:{hr:172,rr:38,sbp:82,dbp:56,spo2:98,temp:36.6,cap:5},
      signs:[
        {label:"Mottling",detail:"Reticular pattern, knees and elbows bilaterally",pos:"body"},
        {label:"Urine output",detail:"No urine output in 14 hours",pos:"body"},
        {label:"Mental status",detail:"Responds to pain only, weak grimace",pos:"head"},
        {label:"Extremities",detail:"Cool, clammy, pale",pos:"body"},
      ],
      assessItems:[
        {id:"hr2_2",label:"HR 172",cat:"vital",bad:true,why:"Worsening tachycardia. Heart rate is climbing as the sympathetic system works harder. The child is losing the ability to compensate. Stroke volume is falling, so rate must increase further to maintain CO."},
        {id:"rr2_2",label:"RR 38",cat:"vital",bad:true,why:"Now elevated (normal 20-30). Tachypnea is compensating for developing metabolic acidosis. Poor tissue perfusion causes lactic acid accumulation. The respiratory center increases rate to blow off CO2 and buffer the acidosis."},
        {id:"bp2_2",label:"BP 82/56",cat:"vital",bad:true,why:"Dropping. Still technically borderline normal, but trending DOWN. In a child who was 88 systolic, a drop to 82 is significant. Pediatric compensatory mechanisms are starting to fail. This is the transition from compensated to decompensated shock."},
        {id:"spo2_2a",label:"SpO2 98%",cat:"vital",bad:false,why:"Still maintained. But remember: SpO2 tells you about lung function, not tissue perfusion. This child's tissues are starving despite adequate oxygenation."},
        {id:"cap2_2",label:"Cap Refill 5s",cat:"vital",bad:true,why:"Significantly prolonged. Severe peripheral vasoconstriction. The microcirculation is shutting down. Lactate is building. Without fluid resuscitation, this child will hit the cliff - sudden cardiovascular collapse."},
        {id:"k2_2",label:"K+ 2.1 mEq/L",cat:"lab",bad:true,why:"Critically low (normal 3.5-5.5). Three days of vomiting has depleted potassium through direct gastric losses and renal wasting (kidneys excrete K+ to retain H+ in alkalosis). Below 2.5, the cardiac myocyte resting membrane potential destabilizes, predisposing to life-threatening arrhythmias."},
        {id:"lac2_2",label:"Lactate 6.4 mmol/L",cat:"lab",bad:true,why:"Severely elevated (normal 0.5-2.0). Tissue hypoperfusion is forcing anaerobic glycolysis, producing lactate as a metabolic byproduct. Lactate above 4 correlates with significantly increased mortality in pediatric shock."},
      ],
      labs:[
        {name:"K+",value:"2.1",unit:"mEq/L",ref:"3.5-5.5",critical:true,explain:"Critically low and worsening. At this level, the cardiac myocyte resting membrane potential is destabilized. The cell becomes hyperexcitable and prone to spontaneous depolarization, creating the substrate for ventricular tachycardia and torsades de pointes."},
        {name:"Cl-",value:"82",unit:"mEq/L",ref:"98-106",critical:true,explain:"Worsening hypochloremia. Ongoing gastric losses continue to deplete chloride. The kidney cannot correct the alkalosis without adequate chloride for exchange in the collecting duct."},
        {name:"CO2",value:"34",unit:"mEq/L",ref:"20-28",critical:true,explain:"Worsening alkalosis. Bicarb continues to climb as H+ losses continue. The alkalosis itself drives further K+ wasting - a vicious cycle that will continue until volume and chloride are replaced."},
        {name:"BUN",value:"38",unit:"mg/dL",ref:"5-18",critical:true,explain:"Rising from 32. Renal perfusion is declining further as the child progresses from compensated to decompensated shock. Without fluid resuscitation, acute kidney injury will follow."},
        {name:"Cr",value:"0.7",unit:"mg/dL",ref:"0.2-0.4",critical:true,explain:"Now clearly elevated. The kidneys are being injured by sustained hypoperfusion. Oliguria (no urine in 14 hours) confirms inadequate renal blood flow."},
        {name:"Lactate",value:"6.4",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Doubled from 3.2. The child is transitioning from compensated to decompensated shock. Tissue oxygen debt is accumulating rapidly. Above 4 in pediatric shock correlates with significantly increased mortality."},
        {name:"Glucose",value:"54",unit:"mg/dL",ref:"60-100",critical:true,explain:"Dropping. Glycogen stores are depleting from prolonged fasting and metabolic stress. Approaching the threshold where neuronal function may be impaired. Needs monitoring and likely dextrose supplementation."},
        {name:"Mg2+",value:"1.4",unit:"mg/dL",ref:"1.7-2.2",critical:true,explain:"Low magnesium accompanies prolonged vomiting. Magnesium depletion makes it harder to correct potassium because Mg2+ is required for the Na/K ATPase pump to retain potassium intracellularly. Must replace Mg2+ to effectively correct K+."},
      ],
      tools:["ivKit","stethoscope","capRefill","glucometer","thermometer","defib"],
      meds:["nsBolus","dextrose","acetaminophen","epinephrine","albuterol","ceftriaxone"],
      actions:{tools:{
        ivKit:{ok:true,pri:1,fb:"Confirm and secure IV access. May need a second line. If this child decompensates, you need reliable access for fluids and emergency meds. Consider IO if peripheral access is failing - dehydrated toddlers have collapsed veins."},
        stethoscope:{ok:true,pri:null,fb:"Auscultate before and after each bolus. Listen for gallop (S3 = volume overload), crackles (pulmonary edema from over-resuscitation). Also establishes if bowel sounds are present - ileus from hypokalemia is possible with prolonged vomiting."},
        capRefill:{ok:true,pri:null,fb:"Your best real-time perfusion marker. Check after each 20 mL/kg bolus. Improvement from 5s toward 2-3s indicates effective volume resuscitation. No improvement after 40-60 mL/kg suggests either ongoing losses or a different etiology."},
        glucometer:{ok:true,pri:2,fb:"Check immediately. Toddlers with 3 days of vomiting and poor intake are at HIGH risk for hypoglycemia. Hepatic glycogen stores in a 2-year-old deplete within 12-16 hours of fasting. Hypoglycemia causes altered mental status and can mimic septic shock."},
        thermometer:{ok:false,pri:null,fb:"Temperature is normal and stable. This child's problem is volume depletion, not infection. Rechecking temp doesn't change your immediate management - you need fluid resuscitation."},
        defib:{ok:false,pri:null,fb:"Whoa there. This toddler is in sinus tachycardia from dehydration. You just defibrillated a child who needed a glass of water. The rhythm is a normal compensatory response to hypovolemia. Defibrillation is for VF or pulseless VT. This child has a pulse and an organized rhythm. Step away from the defibrillator and go hang a bag of saline."},
      },meds:{
        nsBolus:{ok:true,pri:1,fb:"First-line. Push 20 mL/kg (240 mL for 12 kg) normal saline over 5-10 minutes. Reassess perfusion markers after each bolus. May need 40-60 mL/kg total. Isotonic crystalloid replaces intravascular volume and improves preload, stroke volume, and cardiac output."},
        dextrose:{ok:false,pri:null,fb:"Check glucose first, then give only if < 60 mg/dL. Prolonged vomiting with poor intake puts this child at risk, but empiric dextrose without checking can cause rebound hyperglycemia and osmotic complications. Always measure first."},
        acetaminophen:{ok:false,pri:null,fb:"Not indicated. Temperature is 36.6C - normal. There is no fever to treat. Giving acetaminophen to a dehydrated child with no fever adds no benefit and creates a false sense of action. Focus on volume."},
        epinephrine:{ok:false,pri:null,fb:"Premature. This is hypovolemic shock, not distributive. The treatment is volume replacement, not vasopressors. Epinephrine in an empty vascular system just squeezes harder on nothing. Fill the tank first."},
        albuterol:{ok:false,pri:null,fb:"No respiratory pathology here. The tachypnea is metabolic compensation for lactic acidosis, not bronchospasm. Albuterol would add tachycardia without addressing the underlying volume deficit."},
        ceftriaxone:{ok:false,pri:null,fb:"No evidence of infection. Afebrile, no localizing signs, clear history of viral gastroenteritis. Antibiotics are for septic shock, not hypovolemic shock from GI losses. Unnecessary antibiotics add risk without benefit."},
      }},
    },
  ],
  curveball:{
    name:"Wide-Complex Tachycardia",
    narrative:"Near the completion of the first 20 mL/kg normal saline bolus, the cardiac monitor alarm activates with a rhythm change. The previously narrow-complex sinus tachycardia has been replaced by a wide-complex tachycardia at a rate of 220 beats per minute. The QRS morphology is broad and bizarre with no discernible P waves. The child's skin color rapidly transitions from pale to ashen gray and he becomes unresponsive. The clinical picture is consistent with ventricular tachycardia, and given the three-day history of persistent vomiting, the most likely etiology is a hypokalemia-driven arrhythmia secondary to ongoing gastrointestinal electrolyte losses.",
    vitals:{hr:220,rr:42,sbp:64,dbp:38,spo2:94,temp:36.6,cap:6},
    signs:[
      {label:"Rhythm",detail:"Wide-complex tachycardia at 220 bpm, QRS >0.09s, no P waves",pos:"body"},
      {label:"Perfusion",detail:"Pale, diaphoretic, thready pulses",pos:"body"},
      {label:"Mental status",detail:"Eyes rolling back, barely responsive",pos:"head"},
      {label:"Color",detail:"Ashen gray",pos:"face"},
    ],
    labs:[
      {name:"K+",value:"1.8",unit:"mEq/L",ref:"3.5-5.5",critical:true,explain:"Critically low - this is the cause of the arrhythmia. At K+ 1.8, the myocyte resting membrane potential has shifted from -90mV toward -70mV. The cell is partially depolarized and hyperexcitable, generating the wide-complex tachycardia you see on the monitor."},
      {name:"Mg2+",value:"1.2",unit:"mg/dL",ref:"1.7-2.2",critical:true,explain:"Low magnesium makes the arrhythmia harder to treat. Mg2+ stabilizes the cardiac membrane independent of K+ levels. IV magnesium 25-50 mg/kg should be given alongside potassium replacement."},
      {name:"iCa2+",value:"0.98",unit:"mmol/L",ref:"1.12-1.32",critical:true,explain:"Low ionized calcium from the alkalosis. Alkalemia increases protein binding of calcium, reducing the free (ionized) fraction. Low iCa2+ further destabilizes cardiac conduction and can prolong the QT interval."},
      {name:"pH",value:"7.52",unit:"",ref:"7.35-7.45",critical:true,explain:"Significantly alkalotic from ongoing gastric H+ losses. The alkalosis is driving the hypokalemia (kidneys waste K+ to retain H+) and the hypocalcemia (alkalemia increases Ca2+ protein binding). Fixing the pH helps fix the electrolytes."},
    ],
    tools:["stethoscope","defib","glucometer","ivKit","capRefill","thermometer"],
    meds:["adenosine","epinephrine","nsBolus","lorazepam","atropine","albuterol"],
    actions:{tools:{
      stethoscope:{ok:true,pri:null,fb:"Auscultate quickly to confirm rate and rhythm. In wide-complex tachycardia, you're listening for whether beats are regular (VT, SVT with aberrancy) or irregular (polymorphic VT/torsades). Also check for cannon A waves in the neck veins - present in VT due to AV dissociation."},
      defib:{ok:true,pri:1,fb:"CRITICAL. Get the defibrillator pads ON immediately. If this child becomes pulseless or hemodynamically unstable (which they are), synchronized cardioversion at 0.5-1 J/kg is first-line for unstable wide-complex tachycardia. You must be ready. In peds, the sequence is: unstable + wide complex = synchronized cardioversion first."},
      glucometer:{ok:true,pri:null,fb:"Quick check. Hypoglycemia can worsen any cardiac arrhythmia and this child has been vomiting for 3 days. Low glucose exacerbates myocardial dysfunction."},
      ivKit:{ok:true,pri:null,fb:"Confirm IV access is patent. You may need to push medications or give volume. If IV was positional or infiltrated, you need working access NOW before cardioversion or drug administration."},
      capRefill:{ok:false,pri:null,fb:"You already know perfusion is terrible - the child is gray and unresponsive. Cap refill confirms what you can see. Don't delay treatment to do an assessment you don't need right now. Act."},
      thermometer:{ok:false,pri:null,fb:"Temperature is irrelevant in an acute arrhythmia emergency. This child needs rhythm correction, not temperature monitoring. Every second counts."},
    },meds:{
      adenosine:{ok:false,pri:null,fb:"DANGEROUS in this context. Adenosine is for NARROW-complex SVT, not wide-complex tachycardia. If this is ventricular tachycardia (which it likely is in a hypokalemic child), adenosine will not convert it and may worsen hemodynamic collapse. Additionally, if this is torsades de pointes from hypokalemia, adenosine is contraindicated. The correct treatment is to FIX THE POTASSIUM and cardiovert if unstable."},
      epinephrine:{ok:false,pri:null,fb:"Not first-line for wide-complex tachycardia with a pulse. Epinephrine increases myocardial oxygen demand, raises heart rate further, and can trigger VF in an already irritable myocardium. It's indicated for pulseless arrest, not organized tachyarrhythmia. If this child goes pulseless, then epi enters the algorithm."},
      nsBolus:{ok:true,pri:null,fb:"Appropriate as a temporizing measure. This child is hypovolemic AND arrhythmic. Volume helps maintain preload during the arrhythmia. But the DEFINITIVE treatment is correcting the rhythm and the underlying electrolyte abnormality. Fluid alone won't fix a potassium of 2.0."},
      lorazepam:{ok:false,pri:null,fb:"Not indicated for arrhythmia. Benzodiazepines are for seizures or procedural sedation. If you need to cardiovert, you WILL need sedation (etomidate or ketamine preferred), but lorazepam alone does nothing for the rhythm."},
      atropine:{ok:false,pri:null,fb:"Atropine increases heart rate by blocking vagal tone. This child's rate is ALREADY 220. Pushing atropine would be like adding fuel to a fire. Atropine is for symptomatic bradycardia, the opposite of this situation."},
      albuterol:{ok:false,pri:null,fb:"No respiratory indication. The tachypnea is from poor cardiac output and acidosis. Albuterol is a beta-agonist that would further stimulate the already irritable myocardium and potentially worsen the arrhythmia."},
    }},
    teaches:[
      {title:"Vomiting and Electrolyte Derangement",content:"Prolonged vomiting causes loss of H+ and Cl- from gastric secretions, producing hypochloremic, hypokalemic metabolic alkalosis. The kidneys compensate by excreting K+ and retaining H+, worsening hypokalemia. When serum K+ drops below 2.5-3.0 mEq/L, the cardiac myocyte resting membrane potential becomes less negative (partially depolarized), making the cell hyperexcitable. This predisposes to ventricular arrhythmias including VT and torsades de pointes.",tldr:"Vomiting loses stomach acid (H+ and Cl-), which drags potassium down with it. Low potassium makes heart cells electrically unstable and prone to dangerous arrhythmias."},
      {title:"SVT vs VT in Pediatrics",content:"Differentiating SVT from VT: SVT typically shows narrow QRS (< 0.09s), regular rate, and may have P waves buried in T waves. VT shows wide QRS (> 0.09s), may be slightly irregular, often has AV dissociation. In pediatrics, VT is less common than SVT but more dangerous. KEY RULE: any wide-complex tachycardia in a sick, hemodynamically unstable child should be treated as VT until proven otherwise. History matters - vomiting + dehydration + wide complex screams electrolyte-driven VT.",tldr:"Narrow QRS = probably SVT. Wide QRS = treat as VT until proven otherwise. In a sick kid with vomiting, wide complex almost certainly means electrolyte-driven VT."},
      {title:"Root Cause Thinking",content:"Don't just chase the rhythm on the monitor. Ask WHY the rhythm changed. This child had 3 days of vomiting causing hypokalemia. The arrhythmia is a SYMPTOM of the electrolyte problem, not the primary disease. Cardioversion may convert the rhythm temporarily, but it will recur unless you fix the potassium. Always look for and treat the root cause: check a BMP/electrolytes, replace K+ aggressively (0.5-1 mEq/kg IV over 1 hour with cardiac monitoring), and give magnesium (which stabilizes the cardiac membrane).",tldr:"The arrhythmia is a symptom, not the disease. Fix the potassium that caused it or the rhythm will keep coming back no matter how many times you shock."},
    ],
  },
  debrief:{
    summary:"You recognized compensated hypovolemic shock in a dehydrated toddler, initiated fluid resuscitation, and identified a wide-complex tachycardia caused by electrolyte derangement from prolonged vomiting. Root cause thinking - connecting the vomiting to hypokalemia to arrhythmia - was the critical skill tested.",
    explainers:[
      {title:"The Pediatric Shock Cliff",content:"Unlike adults who gradually decompensate, children have a binary-like transition. Their massive sympathetic reserve maintains perfusion until suddenly it doesn't. When catecholamine stores deplete and SVR collapses, BP crashes precipitously. Cap refill going from 3s to 5s is the warning. The next step is cardiovascular collapse with bradycardia - a pre-arrest rhythm in a child who was tachycardic.",tldr:"Kids compensate hard then crash suddenly. Worsening cap refill is the warning sign. Bradycardia in a previously tachycardic child means arrest is imminent."},
      {title:"Vomiting-Induced Metabolic Cascade",content:"Gastric fluid contains H+, Cl-, K+, and Na+. Losing it creates: (1) Metabolic alkalosis from H+ loss, (2) Hypochloremia triggering renal Cl- retention and HCO3- retention, (3) Hypokalemia from both direct loss and renal K+ wasting as kidneys try to retain H+. The kidneys exchange K+ for H+ in the collecting duct, worsening K+ depletion. Below K+ 3.0, ECG changes appear (flattened T waves, U waves). Below 2.5, arrhythmia risk skyrockets.",tldr:"Vomiting loses H+, Cl-, and K+. The kidneys make it worse by dumping more K+ to save H+. Below K+ 2.5, the heart becomes electrically unstable."},
      {title:"Electrolyte-Driven Arrhythmias in Children",content:"Hypokalemia shifts the myocyte resting potential from -90mV toward -70mV. This partial depolarization makes the cell easier to excite but harder to repolarize normally. The result: prolonged QT interval, increased automaticity, and re-entry circuits that generate VT. Torsades de pointes (polymorphic VT with twisting axis) is the classic hypokalemia arrhythmia. Treatment: IV potassium replacement AND IV magnesium (which stabilizes the cardiac membrane independent of K+ levels). Monitor on telemetry during replacement.",tldr:"Low potassium partially depolarizes heart cells, making them fire when they should not. Replace potassium AND magnesium, and keep the patient on a monitor while you do it."},
    ],
  },
};
var SC3 = {
  id:"asthma-crisis",title:"Can't Catch My Breath",tier:2,icon:"\u{1FAC1}",
  tagline:"8-year-old - Severe Asthma Exacerbation",
  description:"An 8-year-old known asthmatic with worsening wheeze unresponsive to home treatment.",
  patient:{ageLabel:"8 years",weightKg:25,sex:"Female",cc:"Worsening wheeze x 2 days, albuterol not helping",
    history:"Sophia is a known asthmatic who uses an albuterol inhaler PRN. Her mom says she has been wheezing for two days after a cold. She has used her inhaler 8 times today with no improvement. No prior ICU admissions but two ED visits in the past year. Takes no controller medications. Family history of asthma. Allergic to dust mites."},
  norms:{hr:[70,110],rr:[18,25],sbp:[90,115],dbp:[55,70],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"An eight-year-old female named Sophia presents with a two-day history of worsening wheezing in the setting of a known asthma diagnosis. She has no controller medications and has visited the emergency department twice in the past year for exacerbations. Her mother reports that Sophia left soccer practice early two days ago due to persistent coughing, and today has used her albuterol metered-dose inhaler approximately eight times without meaningful relief. On arrival, Sophia is sitting upright in a tripod position with audible expiratory wheezing heard from the doorway. She is only able to speak in two- to three-word phrases between labored breaths, and you observe significant intercostal and subcostal retractions with each respiratory cycle.",
      vitals:{hr:132,rr:36,sbp:108,dbp:68,spo2:93,temp:37.4,cap:2},
      signs:[
        {label:"Breathing pattern",detail:"Tripoding, intercostal and subcostal retractions, accessory muscle use",pos:"body"},
        {label:"Wheeze",detail:"Audible expiratory wheeze from doorway",pos:"body"},
        {label:"Speech",detail:"2-3 word phrases only",pos:"face"},
        {label:"Skin",detail:"Mildly diaphoretic",pos:"body"},
      ],
      assessItems:[
        {id:"hr3_1",label:"HR 132",cat:"vital",bad:true,why:"Elevated for 8-year-old (normal 70-110). Tachycardia from three sources: hypoxia-driven sympathetic activation, increased work of breathing (respiratory muscles consuming massive O2), and likely beta-agonist effect from 8 doses of albuterol today."},
        {id:"rr3_1",label:"RR 36",cat:"vital",bad:true,why:"Significantly elevated (normal 18-25). The body increases respiratory rate to maintain minute ventilation despite reduced tidal volume from air trapping. Each breath moves less air, so more breaths are needed. This level of tachypnea is unsustainable."},
        {id:"bp3_1",label:"BP 108/68",cat:"vital",bad:false,why:"Normal for age. Cardiovascular system is not yet compromised. In severe asthma, pulsus paradoxus (> 10 mmHg drop in SBP during inspiration) indicates severe air trapping - worth checking but requires manual BP."},
        {id:"spo3_1",label:"SpO2 93%",cat:"vital",bad:true,why:"Below target (normal > 95%). This is concerning because the oxyhemoglobin dissociation curve is sigmoid - at 93%, PaO2 is approximately 65 mmHg. There is very little reserve before the steep part of the curve where small PaO2 drops cause large SpO2 crashes."},
        {id:"temp3_1",label:"Temp 37.4C",cat:"vital",bad:false,why:"Low-grade, likely from the viral URI triggering the exacerbation. Not high enough to warrant treatment. The infection triggered airway inflammation which worsened the underlying asthma."},
        {id:"cap3_1",label:"Cap Refill 2s",cat:"vital",bad:false,why:"Normal. Perfusion is maintained. This is a primary respiratory problem, not a circulatory one - yet. If respiratory failure progresses to cardiovascular collapse, this will change."},
        {id:"vbg3_1",label:"pCO2 48 mmHg",cat:"lab",bad:true,why:"Elevated (normal 35-45). In asthma, pCO2 should be LOW because the patient is hyperventilating to compensate for air trapping. A normal or rising pCO2 in acute asthma is ominous - it means ventilation is failing to keep up with CO2 production. This patient is losing the ability to compensate."},
      ],
      labs:[
        {name:"pH",value:"7.38",unit:"",ref:"7.35-7.45",critical:false},
        {name:"pCO2",value:"48",unit:"mmHg",ref:"35-45",critical:true,explain:"This is the most important lab in this scenario. In acute asthma, pCO2 should be LOW because the patient is hyperventilating. A normal or rising pCO2 means ventilation is failing to keep up with CO2 production - the respiratory muscles are tiring. This is an ominous sign that respiratory failure is approaching."},
        {name:"pO2",value:"65",unit:"mmHg",ref:"80-100",critical:true,explain:"Moderately low. Corresponds to the SpO2 of 93%. Air trapping is creating V/Q mismatch - some alveoli are hyperinflated and poorly perfused while others are underventilated. The result is impaired gas exchange."},
        {name:"HCO3-",value:"26",unit:"mEq/L",ref:"22-26",critical:false},
        {name:"K+",value:"3.8",unit:"mEq/L",ref:"3.5-5.5",critical:false},
        {name:"Glucose",value:"142",unit:"mg/dL",ref:"60-100",critical:true,explain:"Stress hyperglycemia. The catecholamine surge from severe respiratory distress drives glycogenolysis and gluconeogenesis. Cortisol release from the stress response further raises blood sugar. This is expected and does not require insulin - it will resolve when the respiratory crisis resolves."},
        {name:"WBC",value:"12.4",unit:"K/uL",ref:"5.0-14.5",critical:false},
        {name:"Lactate",value:"1.8",unit:"mmol/L",ref:"0.5-2.0",critical:false},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Thirty minutes into aggressive treatment including continuous nebulized albuterol, ipratropium bromide, and intravenous methylprednisolone, Sophia's clinical status has not improved. She has stopped actively tripoding and is slumping forward with her arms at her sides, indicating respiratory muscle fatigue. The audible wheeze has become quieter, which in this context represents decreased air movement rather than clinical improvement. You observe worsening suprasternal, intercostal, and subcostal retractions with visible nasal flaring. The respiratory therapist notes that she appears to be tiring. Her oxygen saturation has drifted downward from 93 percent to 90 percent despite supplemental oxygen at four liters per minute via nasal cannula.",
      vitals:{hr:145,rr:42,sbp:112,dbp:70,spo2:90,temp:37.4,cap:2},
      labs:[
        {name:"pH",value:"7.32",unit:"",ref:"7.35-7.45",critical:true,explain:"Now acidotic. The rising pCO2 is overwhelming the bicarb buffer. This is respiratory acidosis from ventilatory failure - the respiratory muscles can no longer blow off CO2 fast enough. Acidosis further impairs muscle function, creating a downward spiral."},
        {name:"pCO2",value:"56",unit:"mmHg",ref:"35-45",critical:true,explain:"Rising from 48 to 56 despite treatment. This confirms respiratory failure is progressing. The diaphragm and intercostal muscles are fatiguing. If pCO2 continues to climb, the patient will need mechanical ventilation. Intubation in severe asthma is high-risk due to hyperinflation."},
        {name:"pO2",value:"58",unit:"mmHg",ref:"80-100",critical:true,explain:"Worsening. At PaO2 58, we are at the steep part of the oxyhemoglobin dissociation curve. The SpO2 of 90% is right at the cliff edge. Small further drops in PaO2 will cause the saturation to plummet."},
        {name:"Lactate",value:"2.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Rising from 1.8. The respiratory muscles are consuming enormous amounts of oxygen - up to 40% of total cardiac output in severe asthma. They are beginning to generate lactate from the extreme workload, even though systemic perfusion is still maintained."},
        {name:"Glucose",value:"168",unit:"mg/dL",ref:"60-100",critical:true,explain:"Persistent stress hyperglycemia. The ongoing catecholamine and cortisol release keeps driving glucose production. This is a marker of physiologic stress severity, not diabetes."},
        {name:"K+",value:"3.4",unit:"mEq/L",ref:"3.5-5.5",critical:true,explain:"Dropping from 3.8. Repeated albuterol doses drive potassium intracellularly through beta-2 receptor stimulation of the Na/K ATPase. Combined with catecholamine-driven shifts, hypokalemia can develop and needs monitoring."},
      ],
      signs:[
        {label:"Work of breathing",detail:"Severe suprasternal, intercostal, subcostal retractions with nasal flaring",pos:"body"},
        {label:"Wheeze quality",detail:"Diminished, quieter than initial presentation",pos:"body"},
        {label:"Mental status",detail:"Exhausted, less combative, slumping forward",pos:"head"},
        {label:"Posture",detail:"No longer tripoding, arms hanging at sides",pos:"body"},
      ],
      assessItems:[
        {id:"hr3_2",label:"HR 145",cat:"vital",bad:true,why:"Worsening tachycardia despite treatment. Heart is working harder because (1) hypoxia is worsening, (2) respiratory muscle O2 consumption is enormous - up to 40% of total cardiac output in severe asthma, (3) beta-agonist effect continues."},
        {id:"rr3_2",label:"RR 42",cat:"vital",bad:true,why:"CRITICAL: Rate increased further despite treatment. The respiratory muscles are fatiguing. In asthma, a rising RR that then DROPS is the danger sign - it means the muscles are failing, not that the patient is improving."},
        {id:"bp3_2",label:"BP 112/70",cat:"vital",bad:false,why:"Maintained. Blood pressure is actually slightly elevated from the massive catecholamine response. This will remain normal until very late - cardiovascular collapse in respiratory failure is sudden."},
        {id:"spo3_2",label:"SpO2 90%",cat:"vital",bad:true,why:"Falling despite 4L NC. At SpO2 90%, PaO2 is approximately 60 mmHg - the inflection point of the oxyhemoglobin curve. Below this, saturation drops rapidly with small PaO2 changes. This child is on the cliff edge."},
        {id:"cap3_2",label:"Cap Refill 2s",cat:"vital",bad:false,why:"Still normal - primary respiratory failure has not yet progressed to cardiovascular compromise. But this can change in minutes if respiratory arrest occurs."},
      ],
      tools:["stethoscope","o2mask","bvm","peakFlow","ivKit","capRefill","defib"],
      meds:["albuterol","epinephrine","methylpred","nsBolus","acetaminophen","lorazepam"],
      actions:{tools:{
        stethoscope:{ok:true,pri:1,fb:"CRITICAL assessment. Auscultate all lung fields bilaterally. You need to hear air entry. A quiet chest means critical air trapping with minimal ventilation. Compare left vs right - unequal air entry could indicate mucus plugging, atelectasis, or developing pneumothorax."},
        o2mask:{ok:true,pri:2,fb:"Escalate oxygen delivery. Move from nasal cannula to non-rebreather mask at 15 L/min. SpO2 90% on NC means she needs higher FiO2. NRB provides 60-80% FiO2 vs 28-44% from NC."},
        bvm:{ok:true,pri:null,fb:"Have at bedside. If SpO2 continues to fall or she becomes apneic, bag immediately. In severe asthma, use slow rate (8-10/min) with long expiratory time to allow trapped air to escape. Aggressive bagging worsens hyperinflation."},
        peakFlow:{ok:false,pri:null,fb:"She can barely say her own name and you want her to blow into a peak flow meter? Peak flow requires maximal effort from a cooperative patient. In critical status asthmaticus, this wastes time and energy she does not have. Save it for when she can actually breathe."},
        ivKit:{ok:true,pri:null,fb:"Ensure IV access is secure. If she deteriorates to intubation, you need IV for RSI meds (ketamine preferred in asthma for bronchodilatory properties). May also need IV magnesium sulfate, which is next-line for refractory status asthmaticus."},
        capRefill:{ok:false,pri:null,fb:"Perfusion is maintained - normotensive, good color, cap refill 2 seconds. This is a respiratory problem, not a circulatory one. Checking cap refill adds nothing to your management right now. Focus on airway and breathing."},
        defib:{ok:false,pri:null,fb:"She is wheezing, not fibrillating. This child has sinus tachycardia from hypoxia and beta-agonist use. There is no shockable rhythm. Defibrillation is for VF or pulseless VT only. The defibrillator cannot fix bronchospasm. Please redirect your energy toward the nebulizer."},
      },meds:{
        albuterol:{ok:true,pri:1,fb:"Continue continuous nebulized albuterol. In status asthmaticus, continuous nebulization (10-20 mg/hr) is more effective than intermittent dosing. Beta-2 receptors on bronchial smooth muscle relax when stimulated, increasing airway diameter. Monitor for tachycardia and tremor but do not stop - the tachycardia from hypoxia is more dangerous than from albuterol."},
        epinephrine:{ok:true,pri:2,fb:"IM epinephrine 0.01 mg/kg is appropriate for life-threatening asthma refractory to inhaled beta-agonists. Systemic epinephrine provides bronchodilation through beta-2 AND reduces mucosal edema through alpha-1 vasoconstriction. It reaches airways that nebulized albuterol can't penetrate due to severe bronchospasm and mucus plugging."},
        methylpred:{ok:false,pri:null,fb:"Already given. Steroids take 4-6 hours for full effect. They work by reducing airway inflammation, decreasing mucus production, and upregulating beta-2 receptor sensitivity. Giving another dose this soon adds no benefit - the first dose is still working its way into action."},
        nsBolus:{ok:false,pri:null,fb:"Not indicated. BP is 112/70 and cap refill is normal. This child is not in shock - she is in respiratory failure. Volume loading a child who doesn't need it risks pulmonary edema, which would worsen her already compromised gas exchange."},
        acetaminophen:{ok:false,pri:null,fb:"Temp is 37.4C - not clinically significant. Treating a low-grade temp does not improve asthma outcomes and distracts from the real problem: worsening airway obstruction."},
        lorazepam:{ok:false,pri:null,fb:"Absolutely not. You want to sedate a child who is using every ounce of energy to keep breathing? Benzodiazepines cause respiratory depression by enhancing GABAergic inhibition in the brainstem respiratory centers. In a child barely maintaining ventilation, this could trigger immediate respiratory arrest. Anxiolytics in status asthmaticus are contraindicated unless you are actively intubating."},
      }},
    },
  ],
  curveball:{
    name:"Tension Pneumothorax",
    narrative:"Sophia suddenly clutches the right side of her chest and cries out in acute distress. The oxygen saturation alarm activates as the SpO2 rapidly falls from 90 percent to 78 percent over approximately 15 seconds. Her heart rate rises acutely to 170 beats per minute. On immediate auscultation, you appreciate diminished but present breath sounds on the left with continued wheezing, but the right hemithorax is completely silent with no air movement at the apex, base, or axilla. You observe jugular venous distension bilaterally, and the trachea appears deviated toward the left. The blood pressure drops to 82 over 50 millimeters of mercury. This constellation of findings is consistent with a right-sided tension pneumothorax.",
    vitals:{hr:170,rr:44,sbp:82,dbp:50,spo2:78,temp:37.4,cap:5},
    labs:[
      {name:"pH",value:"7.18",unit:"",ref:"7.35-7.45",critical:true,explain:"Severe mixed acidosis. Both respiratory (pCO2 72 from inability to ventilate the collapsed lung) and metabolic (lactate 5.6 from tissue hypoperfusion). The right lung is not exchanging gas and the cardiovascular system is in obstructive shock."},
      {name:"pCO2",value:"72",unit:"mmHg",ref:"35-45",critical:true,explain:"Severely elevated. The right lung has collapsed from the pneumothorax and the left lung is still obstructed from asthma. Effective ventilation has been cut in half or worse. CO2 is accumulating rapidly."},
      {name:"pO2",value:"42",unit:"mmHg",ref:"80-100",critical:true,explain:"Critically low, corresponding to SpO2 78%. Only the left lung is participating in gas exchange, and it is still bronchospastic. The patient is in imminent danger of hypoxic cardiac arrest."},
      {name:"Lactate",value:"5.6",unit:"mmol/L",ref:"0.5-2.0",critical:true,explain:"Sharply elevated from 2.8. The tension pneumothorax is compressing the great vessels, reducing cardiac output. Tissues are hypoperfused and generating lactate. This will correct rapidly once the tension is relieved by needle decompression."},
    ],
    signs:[
      {label:"Breath sounds",detail:"Absent on right, present with wheeze on left",pos:"body"},
      {label:"Neck veins",detail:"Jugular venous distension bilaterally",pos:"head"},
      {label:"Trachea",detail:"Deviated toward the left",pos:"face"},
      {label:"Hypotension",detail:"BP 82/50, down from 112/70",pos:"body"},
    ],
    tools:["stethoscope","needleDecomp","o2mask","bvm","defib","ivKit"],
    meds:["nsBolus","epinephrine","albuterol","lorazepam","atropine","acetaminophen"],
    actions:{tools:{
      needleDecomp:{ok:true,pri:1,fb:"IMMEDIATE needle decompression. This is a tension pneumothorax - a clinical diagnosis that does NOT wait for chest X-ray. In a pediatric patient: insert a 14-16 gauge angiocatheter at the 2nd intercostal space, midclavicular line (or 4th-5th ICS, anterior axillary line in larger children). Go over the top of the rib to avoid the neurovascular bundle running along the inferior border. You should hear a rush of air. This converts tension pneumo to simple pneumo and buys time for chest tube placement. DECOMPRESS BEFORE INTUBATING - positive pressure ventilation will worsen tension physiology."},
      stethoscope:{ok:true,pri:null,fb:"Confirms unilateral absent breath sounds on the right. This clinical finding + sudden desat + hypotension + JVD = tension pneumothorax. You've already done this - now ACT on the finding. In tension pneumo, auscultation gives you the diagnosis. Don't wait for imaging."},
      o2mask:{ok:true,pri:2,fb:"Maximize FiO2 with non-rebreather at 15 L/min. The collapsed right lung isn't participating in gas exchange. You're relying entirely on the left lung. Give it the highest oxygen concentration possible. This child's SpO2 of 78% means PaO2 is approximately 40 mmHg - severely hypoxic."},
      bvm:{ok:false,pri:null,fb:"DANGEROUS right now. Positive pressure ventilation (bagging) will push MORE air into the pleural space through the ruptured bleb, worsening the tension. You must decompress FIRST. After needle decompression converts tension to simple pneumothorax, THEN you can assist ventilation if needed. Sequence matters: decompress, then ventilate."},
      defib:{ok:false,pri:null,fb:"Not indicated. The rhythm is sinus tachycardia - an appropriate response to hypoxia and low cardiac output. The heart is doing what it should given the catastrophic lung problem. Fix the pneumothorax and the tachycardia will improve. Defibrillation is for VF/pulseless VT."},
      ivKit:{ok:true,pri:null,fb:"Ensure IV access for post-decompression management. May need fluid bolus (preload was acutely reduced by tension physiology), sedation for chest tube placement, and continued asthma management once the pneumothorax is addressed."},
    },meds:{
      nsBolus:{ok:true,pri:null,fb:"Reasonable after decompression. Tension pneumothorax acutely reduces preload by compressing the IVC/SVC. Even after relieving the tension, the child may need a 20 mL/kg bolus to restore circulating volume and improve cardiac output during recovery."},
      epinephrine:{ok:false,pri:null,fb:"Not the right drug for this problem. The hemodynamic collapse is MECHANICAL - compressed great vessels from tension pneumothorax. Epinephrine can't fix plumbing that is physically kinked. Decompress first - if hypotension persists after decompression, then consider vasopressors. But usually BP recovers immediately once tension is relieved."},
      albuterol:{ok:false,pri:null,fb:"Albuterol treats bronchospasm, not pneumothorax. While this child does have asthma, the acute crisis is a mechanical problem - air in the pleural space. Bronchodilators cannot fix a collapsed lung. Stabilize the pneumothorax first, then resume asthma management."},
      lorazepam:{ok:false,pri:null,fb:"Respiratory depressant in a child with SpO2 of 78%. Sedation without securing the airway and fixing the pneumothorax could cause respiratory arrest. May be appropriate LATER for procedural sedation during chest tube insertion, but not now."},
      atropine:{ok:false,pri:null,fb:"Heart rate is 170. Atropine increases HR by blocking vagal tone. This patient needs the opposite - fix the mechanical problem (pneumothorax) so the compensatory tachycardia can resolve."},
      acetaminophen:{ok:false,pri:null,fb:"Completely irrelevant in this emergency. Temperature is normal. Focus on the life-threatening problem: tension pneumothorax requiring immediate decompression."},
    }},
    teaches:[
      {title:"Asthma to Pneumothorax Pathway",content:"Severe asthma causes air trapping through ball-valve bronchospasm - air enters on inspiration but can't fully exit on expiration. Progressive hyperinflation raises intraalveolar pressure. Forceful coughing or high-pressure mechanical ventilation can rupture weakened alveolar blebs. Air dissects along perivascular sheaths into the pleural space. If the rupture acts as a one-way valve, air accumulates with each breath creating TENSION - compressing the lung, shifting the mediastinum, and kinking the great vessels.",tldr:"Severe asthma traps air, pressure builds, a bleb ruptures, air leaks into the chest, and if it can only go in and not out, you get tension pneumothorax."},
      {title:"Tension Pneumothorax Physiology",content:"Tension pneumothorax is a cascade of mechanical compression: (1) Air accumulates in pleural space under pressure. (2) Ipsilateral lung collapses - V/Q mismatch causes hypoxia. (3) Mediastinum shifts toward contralateral side - compresses the opposite lung reducing ventilation further. (4) IVC and SVC compress - venous return to the heart drops. (5) Cardiac output falls - preload-dependent CO crashes. (6) Obstructive shock develops - the heart physically cannot fill. This is why it kills fast and why decompression is immediately lifesaving.",tldr:"Air pressure in the chest collapses the lung, pushes the heart over, kinks the big veins, and cardiac output tanks. Needle decompression takes 30 seconds and reverses it."},
      {title:"Decompress Before Intubation",content:"Critical sequencing: ALWAYS decompress a tension pneumothorax BEFORE positive pressure ventilation. Intubating and bagging a patient with unrelieved tension pushes more air through the ruptured bleb into the pleural space with each breath. The positive pressure accelerates the tension cascade and can cause PEA arrest within minutes. Needle decompression takes 30 seconds and converts tension to simple pneumothorax. Then you can safely intubate if needed. Sequence: recognize, decompress, oxygenate, then manage the airway.",tldr:"Bagging a tension pneumo forces more air into the chest and kills faster. Decompress first (30 seconds), then intubate."},
    ],
  },
  debrief:{
    summary:"You managed escalating status asthmaticus, recognized the transition from compensating to failing respiratory mechanics, and identified a tension pneumothorax when the clinical picture suddenly changed. The critical skill was pattern interruption - recognizing that unilateral absent breath sounds + sudden desat + hypotension represented a NEW diagnosis superimposed on asthma.",
    explainers:[
      {title:"Respiratory Compensation and Failure",content:"In asthma, tachypnea initially compensates for reduced tidal volume from air trapping. But respiratory muscles have finite endurance. The diaphragm and intercostals can only sustain high work of breathing for hours before glycogen depletes and fatigue sets in. When RR drops in a patient who was tachypneic, it is NOT improvement - it is failure. The quiet chest (diminished wheeze) means airflow has dropped so low that there isn't enough velocity to generate turbulent sound. Quiet + tired = intubation imminent.",tldr:"Fast breathing compensates for trapped air until the muscles run out of gas. A dropping respiratory rate in an asthmatic is not improvement - it is respiratory failure."},
      {title:"The Oxyhemoglobin Cliff",content:"The sigmoid shape of the oxyhemoglobin dissociation curve means SpO2 stays relatively stable between PaO2 60-100 mmHg (SpO2 90-99%). Below PaO2 60 (SpO2 ~90%), the curve steepens dramatically. A patient at SpO2 93% has a PaO2 of ~65 with some reserve. At SpO2 90%, PaO2 is ~60 with almost no reserve. At 85%, PaO2 is ~50 and falling fast. This is why a drop from 93% to 90% should trigger escalation - you're entering the danger zone of the curve.",tldr:"SpO2 90-99% looks stable but hides a lot of variation in actual oxygen levels. Below 90%, small changes in oxygen cause the saturation to plummet. Treat 93% to 90% as a red flag, not a small dip."},
      {title:"Pattern Interruption in Critical Care",content:"The most dangerous cognitive trap in critical care is anchoring to your initial diagnosis. This patient had asthma. Everyone was treating asthma. When the pneumothorax developed, the temptation is to think 'the asthma is just getting worse' and double down on bronchodilators. The unilateral finding (absent breath sounds on ONE side) is the key that breaks the pattern. Asthma is bilateral. Unilateral absent sounds means something else is happening. Training your brain to notice when the pattern changes is what prevents deaths from missed diagnoses.",tldr:"Asthma is bilateral. If breath sounds disappear on only ONE side, the diagnosis has changed. Do not keep treating asthma when a pneumothorax is killing your patient."},
    ],
  },
};
function ecgPt(t,hr){var p=60/hr,x=(t%p)/p;if(x<.06)return 0;if(x<.08)return Math.sin((x-.06)/.02*Math.PI)*0.05;if(x<.10)return(x-.08)/.02*1.0;if(x<.12)return 1.0-(x-.10)/.02*1.0;if(x<.14)return 0;if(x<.30)return Math.sin((x-.14)/.16*Math.PI)*0.08;return 0;}
function plPt(t,hr){var p=60/hr,x=(t%p)/p;return(Math.sin(x*Math.PI*2-Math.PI/2)+1)/2*0.8;}
function Monitor(props){
  var vitals=props.vitals;var flash=props.flash;
  var cR=useRef(null);var tR=useRef(0);var aR=useRef(null);
  useEffect(function(){var c=cR.current;if(!c)return;var ctx=c.getContext("2d");var W=c.width;var H=c.height;
    var draw=function(){tR.current+=.016;var t=tR.current;ctx.fillStyle="#0a0e1a";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(78,205,196,0.05)";ctx.lineWidth=.5;
      for(var i=0;i<W;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
      for(var j=0;j<H;j+=20){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
      ctx.strokeStyle="#4ECDC4";ctx.lineWidth=2;ctx.shadowColor="#4ECDC4";ctx.shadowBlur=6;ctx.beginPath();
      for(var k=0;k<W;k++){var y=H*.25-ecgPt(t-(W-k)*.008,vitals.hr)*H*.2;k===0?ctx.moveTo(k,y):ctx.lineTo(k,y);}ctx.stroke();ctx.shadowBlur=0;
      ctx.strokeStyle="#FECA57";ctx.lineWidth=2;ctx.shadowColor="#FECA57";ctx.shadowBlur=6;ctx.beginPath();
      for(var m=0;m<W;m++){var yy=H*.7-plPt(t-(W-m)*.008,vitals.hr)*H*.15;m===0?ctx.moveTo(m,yy):ctx.lineTo(m,yy);}ctx.stroke();ctx.shadowBlur=0;
      ctx.font="bold 10px sans-serif";ctx.fillStyle="#4ECDC4";ctx.fillText("ECG II",8,16);ctx.fillStyle="#FECA57";ctx.fillText("SpO2",8,H*.57);
      aR.current=requestAnimationFrame(draw);};draw();return function(){cancelAnimationFrame(aR.current);};},[vitals.hr]);
  var bColor=flash?"#FF4757":"#555";
  var vs=[{l:"HR",v:vitals.hr,u:"bpm"},{l:"SpO2",v:vitals.spo2,u:"%"},{l:"RR",v:vitals.rr,u:"/min"},{l:"BP",v:vitals.sbp+"/"+vitals.dbp,u:"mmHg"},{l:"Temp",v:typeof vitals.temp==="number"?vitals.temp.toFixed(1):vitals.temp,u:"C"},{l:"Cap Refill",v:vitals.cap,u:"sec"}];
  return(
    <div style={{borderRadius:16,overflow:"hidden",border:"4px solid "+bColor,background:"#0a0e1a"}}>
      <canvas ref={cR} width={400} height={180} style={{width:"100%",height:150,display:"block"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,padding:8,background:"#0d1117"}}>
        {vs.map(function(v){var vColor="#c8d6e5";if(v.l==="HR")vColor="#55efc4";else if(v.l==="SpO2")vColor="#fdcb6e";else if(v.l==="Temp"&&(v.v<36.5||v.v>37.5))vColor="#ff7675";return(
          <div key={v.l} style={{borderRadius:8,padding:4,textAlign:"center",background:"rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{v.l}</div>
            <div style={{fontSize:20,fontWeight:900,color:vColor}}>{v.v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{v.u}</div>
          </div>);})}
      </div>
    </div>);
}
function SignCard(props){
  var s=props.s;var delay=props.delay||0;
  return(<div style={{marginBottom:6,opacity:0,animation:"fadeCard 0.4s ease-out "+delay+"s forwards"}}>
    <div style={{borderRadius:8,padding:10,background:"rgba(10,14,26,0.92)",border:"1.5px solid rgba(78,205,196,0.4)"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",lineHeight:1.2}}>{s.label}</div>
      <div style={{fontSize:11,color:"#bbc",lineHeight:1.4,marginTop:2}}>{s.detail}</div>
    </div>
  </div>);
}
function BodySystemsView(props) {
  var signs = props.signs || [];
  var allSystems = ["Neuro","Cardiovascular","Respiratory","GI","GI/Hydration","Integumentary","Renal","Musculoskeletal","HEENT"];
  function guessSys(s) {
    if (s.sys) return s.sys;
    var l = (s.label + " " + s.detail).toLowerCase();
    if (l.indexOf("neuro") >= 0 || l.indexOf("mental") >= 0 || l.indexOf("gcs") >= 0 || l.indexOf("pupil") >= 0 || l.indexOf("fontanelle") >= 0 || l.indexOf("conscious") >= 0 || l.indexOf("alert") >= 0 || l.indexOf("letharg") >= 0 || l.indexOf("responsive") >= 0 || l.indexOf("behavior") >= 0 || l.indexOf("irritable") >= 0 || l.indexOf("eye") >= 0 || l.indexOf("seiz") >= 0) return "Neuro";
    if (l.indexOf("heart") >= 0 || l.indexOf("cardio") >= 0 || l.indexOf("pulse") >= 0 || l.indexOf("rhythm") >= 0 || l.indexOf("jvd") >= 0 || l.indexOf("jugular") >= 0 || l.indexOf("perfus") >= 0 || l.indexOf("cool ext") >= 0 || l.indexOf("mottl") >= 0) return "Cardiovascular";
    if (l.indexOf("lung") >= 0 || l.indexOf("breath") >= 0 || l.indexOf("wheez") >= 0 || l.indexOf("retract") >= 0 || l.indexOf("stridor") >= 0 || l.indexOf("airway") >= 0 || l.indexOf("respir") >= 0 || l.indexOf("tripod") >= 0 || l.indexOf("trachea") >= 0 || l.indexOf("apne") >= 0) return "Respiratory";
    if (l.indexOf("abdomen") >= 0 || l.indexOf("bowel") >= 0 || l.indexOf("vomit") >= 0 || l.indexOf("mucous") >= 0 || l.indexOf("oral") >= 0 || l.indexOf("hydrat") >= 0) return "GI/Hydration";
    if (l.indexOf("skin") >= 0 || l.indexOf("rash") >= 0 || l.indexOf("hive") >= 0 || l.indexOf("flush") >= 0 || l.indexOf("cyan") >= 0 || l.indexOf("color") >= 0 || l.indexOf("pale") >= 0 || l.indexOf("diaphor") >= 0 || l.indexOf("integument") >= 0) return "Integumentary";
    if (l.indexOf("urin") >= 0 || l.indexOf("renal") >= 0 || l.indexOf("kidney") >= 0 || l.indexOf("diaper") >= 0 || l.indexOf("oligur") >= 0) return "Renal";
    if (l.indexOf("speech") >= 0 || l.indexOf("motor") >= 0 || l.indexOf("posture") >= 0 || l.indexOf("work of") >= 0) return "Musculoskeletal";
    if (s.pos === "head" || s.pos === "face") return "HEENT";
    return "Other";
  }
  var grouped = {};
  signs.forEach(function(s) {
    var sys = guessSys(s);
    if (!grouped[sys]) grouped[sys] = [];
    grouped[sys].push(s);
  });
  var sysIconMap = {"Neuro":Brain,"Cardiovascular":Heart,"Respiratory":Wind,"GI":Droplets,"GI/Hydration":Droplets,"Integumentary":Shield,"Renal":Droplets,"Musculoskeletal":Gauge,"HEENT":Eye,"Other":Search};
  var sysIcons = {};
  var presentSystems = Object.keys(grouped);
  var absentSystems = allSystems.filter(function(s) { return !grouped[s]; });
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Systems Assessment:</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {presentSystems.map(function(sys,i) {
          var IconComp = sysIconMap[sys] || Search;
          return (
            <div key={sys} style={{borderRadius:8,padding:"6px 10px",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.15)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4ECDC4",marginBottom:3,display:"flex",alignItems:"center",gap:4}}><IconComp size={14}/>  {sys}</div>
              {grouped[sys].map(function(s,j) {
                return <div key={j} style={{fontSize:11,color:"#ccd",lineHeight:1.4,marginBottom:2}}><span style={{fontWeight:600,color:"#ddd"}}>{s.label}:</span> {s.detail}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function LabPanel(props) {
  var labs = props.labs || [];
  var _openLab = useState(null);var openLab=_openLab[0];var setOpenLab=_openLab[1];
  if (labs.length === 0) return null;
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <svg viewBox="0 0 24 40" style={{width:18,height:30,flexShrink:0}}>
          <rect x="6" y="0" width="12" height="6" rx="2" fill="#a0a0a0"/>
          <rect x="4" y="5" width="16" height="32" rx="4" fill="#e8e8ee" stroke="#bbb" strokeWidth="0.5"/>
          <rect x="5" y="18" width="14" height="18" rx="3" fill="#d63031" opacity="0.8">
            <animate attributeName="height" values="18;16;18" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="y" values="18;20;18" dur="2s" repeatCount="indefinite"/>
          </rect>
        </svg>
        <div style={{fontSize:12,fontWeight:700,color:"#ff7675"}}>Lab Results</div>
        {labs.some(function(l){return l.explain;})&&<div style={{fontSize:9,color:"#666"}}>Tap critical values for details</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {labs.map(function(lab,i) {
          var isCrit = lab.critical === true;
          var bg = isCrit ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.04)";
          var brd = isCrit ? "1px solid rgba(255,71,87,0.25)" : "1px solid rgba(255,255,255,0.06)";
          var isOpen = openLab === i;
          var tappable = isCrit && lab.explain;
          return (
            <div key={i} onClick={tappable?function(){setOpenLab(isOpen?null:i);}:undefined} style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd,cursor:tappable?"pointer":"default",gridColumn:isOpen?"1 / -1":"auto"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:600}}>{lab.name}{tappable&&!isOpen?" \u24D8":""}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:16,fontWeight:800,color:isCrit?"#ff7675":"#c8d6e5"}}>{lab.value}</span>
                <span style={{fontSize:9,color:"#666"}}>{lab.unit}</span>
              </div>
              <div style={{fontSize:9,color:"#555"}}>{"Ref: "+lab.ref}</div>
              {isOpen&&lab.explain&&<div style={{marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:11,color:"#ccc",lineHeight:1.5}}>{lab.explain}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function PatientSVG(props){
  var status=props.status||"stable";
  var rr=props.rr||30;
  var ageGroup=props.ageGroup||"infant";
  var sex=props.sex||"neutral";
  var visuals=props.visuals||[];
  var emotion=props.emotion||"neutral";
  var sk=status==="critical"?"#dbb8b8":status==="declining"?"#f0ccb0":"#ffcc99";
  var ch=status==="critical"?"#b09090":status==="declining"?"#e8a080":"#ff9999";
  var mo=status==="critical"?0.55:status==="declining"?0.25:0;
  var eyesClosed=status==="critical";
  var isHappy=emotion==="happy";
  var isSad=emotion==="sad";
  var cyanotic=status==="critical";
  var dur=(60/rr)+"s";
  var isInfant=ageGroup==="infant";
  var isToddler=ageGroup==="toddler";
  var isChild=ageGroup==="child";
  var isTeen=ageGroup==="teen";
  var headW=isInfant?60:isTeen?50:isChild?52:56;
  var headH=isInfant?55:isTeen?50:isChild?48:52;
  var headRx=isInfant?18:isTeen?14:isChild?15:16;
  var headX=isInfant?30:isTeen?35:isChild?34:32;
  var headY=isInfant?112:isTeen?92:isChild?98:105;
  var bodyW=isInfant?50:isTeen?65:isChild?58:54;
  var bodyH=isInfant?30:isTeen?45:isChild?38:34;
  var bodyX=isInfant?35:isTeen?28:isChild?31:33;
  var bodyY=isInfant?165:isTeen?140:isChild?144:158;
  var eyeY=headY+headH*0.45;
  var eyeLX=headX+headW*0.28;
  var eyeRX=headX+headW*0.72;
  var eyeR=isInfant?5:isTeen?4.5:isChild?4.5:5;
  var mouthY=headY+headH*0.72;
  var mouthCX=headX+headW*0.5;
  var cheekR=isInfant?7:5;
  var cheekLX=headX+headW*0.2;
  var cheekRX=headX+headW*0.8;
  var cheekY=headY+headH*0.65;
  var hairColor=sex==="female"?"#8B4513":"#b8860b";
  var hasLongHair=sex==="female";
  // Parse visuals for equipment/features
  var hasV=function(keyword){return visuals.some(function(v){return v.toLowerCase().indexOf(keyword)>=0;});};
  var castLeft=hasV("cast left arm")||hasV("left arm cast")||hasV("broken left arm")||hasV("fractured left arm");
  var castRight=hasV("cast right arm")||hasV("right arm cast")||hasV("broken right arm")||hasV("fractured right arm");
  var castLeg=hasV("cast leg")||hasV("leg cast")||hasV("broken leg")||hasV("fractured leg");
  var headBandage=hasV("head bandage")||hasV("head wrap")||hasV("head injury")||hasV("head trauma");
  var wheelchair=hasV("wheelchair");
  var oxygenCannula=hasV("nasal cannula")||hasV("oxygen cannula")||hasV("o2 cannula");
  var oxygenMask=hasV("oxygen mask")||hasV("o2 mask")||hasV("non-rebreather");
  var hives=hasV("hives")||hasV("urticaria")||hasV("rash")||hasV("allergic");
  var neckBrace=hasV("c-collar")||hasV("neck brace")||hasV("cervical collar");
  var armSling=hasV("sling")||hasV("arm sling");
  var eyePatch=hasV("eye patch")||hasV("eye bandage");
  var armLX=bodyX-8;
  var armRX=bodyX+bodyW+2;
  var armY=bodyY+4;
  return(
    <svg viewBox="0 0 200 260" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))"}}>
      <style>{"@keyframes fadeCard{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}"}</style>
      {/* Wheelchair (behind bed) */}
      {wheelchair&&(
        <g>
          <circle cx="50" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="140" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="50" cy="240" r="3" fill="#666"/>
          <circle cx="140" cy="240" r="3" fill="#666"/>
          <rect x="30" y="170" width="130" height="6" rx="3" fill="#888"/>
          <line x1="40" y1="176" x2="50" y2="222" stroke="#666" strokeWidth="2"/>
          <line x1="150" y1="176" x2="140" y2="222" stroke="#666" strokeWidth="2"/>
          <rect x="25" y="165" width="8" height="50" rx="3" fill="#888"/>
          <rect x="157" y="165" width="8" height="50" rx="3" fill="#888"/>
        </g>
      )}
      {/* Bed (skip if wheelchair) */}
      {!wheelchair&&(
        <g>
          <rect x="10" y="188" width="180" height="58" rx="14" fill="#5B86E5"/>
          <rect x="15" y="192" width="170" height="50" rx="10" fill="#E8F0FE"/>
          <rect x="20" y="196" width="55" height="38" rx="8" fill="white"/>
          <rect x="60" y="201" width="120" height="32" rx="8" fill="#FF6B81" opacity="0.75"/>
        </g>
      )}
      {/* Body */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0" dur={dur} repeatCount="indefinite" additive="sum"/>
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={10} fill={sk}/>
        <rect x={bodyX+2} y={bodyY+2} width={bodyW-4} height={bodyH-4} rx={8} fill="#E8F0FE" opacity="0.4"/>
      </g>
      {/* Arms (simple blocky stubs) */}
      <rect x={armLX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      <rect x={armRX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      {/* Hives/rash overlay */}
      {hives&&(
        <g opacity="0.7">
          <circle cx={bodyX+8} cy={bodyY+8} r="3" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW-12} cy={bodyY+12} r="2.5" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW/2} cy={bodyY+5} r="2" fill="#ff6b6b"/>
          <circle cx={armLX+5} cy={armY+6} r="2" fill="#ff6b6b"/>
          <circle cx={armRX+5} cy={armY+8} r="2.5" fill="#ff6b6b"/>
          <circle cx={headX+12} cy={headY+headH*0.4} r="2" fill="#ff6b6b"/>
          <circle cx={headX+headW-12} cy={headY+headH*0.35} r="1.8" fill="#ff6b6b"/>
          <circle cx={bodyX+15} cy={bodyY+bodyH-8} r="2.5" fill="#ff6b6b"/>
        </g>
      )}
      {/* Cast left arm */}
      {castLeft&&(
        <rect x={armLX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Cast right arm */}
      {castRight&&(
        <rect x={armRX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Arm sling */}
      {armSling&&(
        <g>
          <path d={"M"+(headX+headW*0.3)+" "+(headY+headH+2)+" L"+(bodyX+bodyW*0.3)+" "+(bodyY+bodyH*0.8)+" L"+(bodyX+bodyW*0.7)+" "+(bodyY+bodyH*0.8)+" L"+(headX+headW*0.7)+" "+(headY+headH+2)} fill="#4a90d9" opacity="0.6"/>
        </g>
      )}
      {/* Cast leg */}
      {castLeg&&(
        <rect x={bodyX+bodyW*0.1} y={bodyY+bodyH-2} width={bodyW*0.35} height={18} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Mottling */}
      {mo>0&&(
        <g opacity={mo}>
          <circle cx={bodyX+8} cy={bodyY+bodyH*0.5} r="4" fill="#8070a0"/>
          <circle cx={bodyX+18} cy={bodyY+bodyH*0.7} r="3" fill="#8070a0"/>
          <circle cx={bodyX+bodyW-10} cy={bodyY+bodyH*0.4} r="3.5" fill="#8070a0"/>
        </g>
      )}
      {/* Head */}
      <rect x={headX} y={headY} width={headW} height={headH} rx={headRx} fill={sk} stroke="#e0b878" strokeWidth="0.8"/>
      {/* Head bandage */}
      {headBandage&&(
        <g>
          <rect x={headX-2} y={headY+2} width={headW+4} height={10} rx={4} fill="white" stroke="#ddd" strokeWidth="0.5" opacity="0.9"/>
          <circle cx={headX+headW*0.75} cy={headY+7} r="3" fill="#ff6b6b" opacity="0.5"/>
        </g>
      )}
      {/* Neck brace / C-collar */}
      {neckBrace&&(
        <rect x={headX+2} y={headY+headH-4} width={headW-4} height={10} rx={3} fill="#f0e6d2" stroke="#d4c4a8" strokeWidth="0.8"/>
      )}
      {/* Cheeks */}
      <circle cx={cheekLX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      <circle cx={cheekRX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      {/* Eyes */}
      {eyesClosed?(
        <g>
          <line x1={eyeLX-eyeR} y1={eyeY} x2={eyeLX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
          <line x1={eyeRX-eyeR} y1={eyeY} x2={eyeRX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
        </g>
      ):(
        <g>
          <circle cx={eyeLX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeRX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeLX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeRX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeLX+1.5} cy={eyeY-1} r={1} fill="white"/>
          <circle cx={eyeRX+1.5} cy={eyeY-1} r={1} fill="white"/>
        </g>
      )}
      {/* Eye patch */}
      {eyePatch&&(
        <g>
          <ellipse cx={eyeLX} cy={eyeY} rx={eyeR+2} ry={eyeR+1} fill="#444" opacity="0.85"/>
          <line x1={eyeLX} y1={eyeY-eyeR-1} x2={headX+headW*0.7} y2={headY+4} stroke="#444" strokeWidth="1.5"/>
        </g>
      )}
      {/* Nasal cannula */}
      {oxygenCannula&&(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-8)+" Q"+mouthCX+" "+(mouthY-12)+" "+(mouthCX+8)+" "+(mouthY-8)} fill="none" stroke="#70a0d0" strokeWidth="1.5"/>
          <circle cx={mouthCX-6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <circle cx={mouthCX+6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <line x1={mouthCX-8} y1={mouthY-8} x2={headX-4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+8} y1={mouthY-8} x2={headX+headW+4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Oxygen mask / NRB */}
      {oxygenMask&&(
        <g>
          <ellipse cx={mouthCX} cy={mouthY-3} rx={10} ry={8} fill="rgba(112,160,208,0.3)" stroke="#70a0d0" strokeWidth="1.5"/>
          <line x1={mouthCX-10} y1={mouthY-3} x2={headX-4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+10} y1={mouthY-3} x2={headX+headW+4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Mouth */}
      {!oxygenMask&&(cyanotic?(
        <ellipse cx={mouthCX} cy={mouthY} rx="6" ry="3.5" fill="#8888bb"/>
      ):isHappy?(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-2)+" Q"+mouthCX+" "+(mouthY+10)+" "+(mouthCX+8)+" "+(mouthY-2)} fill="#c08060" opacity="0.3" stroke="#c08060" strokeWidth="1.5"/>
        </g>
      ):isSad?(
        <g>
          <path d={"M"+(mouthCX-6)+" "+(mouthY+3)+" Q"+mouthCX+" "+(mouthY-4)+" "+(mouthCX+6)+" "+(mouthY+3)} fill="none" stroke="#c09878" strokeWidth="1.5"/>
          <circle cx={eyeLX+2} cy={eyeY+eyeR+4} r="1.5" fill="#70a0d0" opacity="0.7"/>
          <circle cx={eyeRX-1} cy={eyeY+eyeR+5} r="1.2" fill="#70a0d0" opacity="0.6"/>
        </g>
      ):(
        <path d={"M"+(mouthCX-7)+" "+mouthY+" Q"+mouthCX+" "+(mouthY+(status==="declining"?4:6))+" "+(mouthCX+7)+" "+mouthY} fill="none" stroke={status==="declining"?"#c09878":"#c08060"} strokeWidth="1.5"/>
      ))}
      {/* Happy bounce animation */}
      {isHappy&&(
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0;0,-5;0,0" dur="0.8s" repeatCount="indefinite" additive="sum"/>
      )}
      {/* Hair */}
      {isInfant&&(
        <g>
          <path d={"M"+(headX+5)+" "+(headY+10)+" Q"+(headX+15)+" "+(headY-5)+" "+(headX+25)+" "+(headY+3)} fill="none" stroke={hairColor} strokeWidth="2"/>
          <path d={"M"+(headX+20)+" "+(headY+5)+" Q"+(headX+30)+" "+(headY-8)+" "+(headX+40)+" "+(headY)} fill="none" stroke={hairColor} strokeWidth="2"/>
        </g>
      )}
      {isToddler&&(
        <g>
          <path d={"M"+(headX+2)+" "+(headY+12)+" Q"+(headX+10)+" "+(headY-6)+" "+(headX+headW/2)+" "+(headY-2)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          <path d={"M"+(headX+headW/2)+" "+(headY-2)+" Q"+(headX+headW-10)+" "+(headY-6)+" "+(headX+headW-2)+" "+(headY+12)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          {hasLongHair&&<path d={"M"+(headX+headW-2)+" "+(headY+12)+" Q"+(headX+headW+5)+" "+(headY+30)+" "+(headX+headW-2)+" "+(headY+headH-5)} fill="none" stroke={hairColor} strokeWidth="2.5"/>}
        </g>
      )}
      {(isChild||isTeen)&&!headBandage&&(
        <g>
          <rect x={headX+2} y={headY-2} width={headW-4} height={headH*0.3} rx={headRx-2} fill={hairColor} opacity="0.85"/>
          {hasLongHair&&(
            <g>
              <path d={"M"+(headX+2)+" "+(headY+headH*0.2)+" Q"+(headX-5)+" "+(headY+headH*0.6)+" "+(headX)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
              <path d={"M"+(headX+headW-2)+" "+(headY+headH*0.2)+" Q"+(headX+headW+5)+" "+(headY+headH*0.6)+" "+(headX+headW)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
            </g>
          )}
        </g>
      )}
      {/* IV line */}
      <line x1={bodyX+bodyW} y1={bodyY+5} x2="145" y2={headY-10} stroke="#70a0d0" strokeWidth="1.5" strokeDasharray="4,3"/>
      <rect x="140" y={headY-30} width="14" height="28" rx="3" fill="#70a0d0" opacity="0.5"/>
      {/* Stuffed animal */}
      <g transform="translate(130,208) scale(0.4)">
        <circle cx="20" cy="20" r="15" fill="#FFD93D"/>
        <circle cx="12" cy="15" r="3" fill="#2d3436"/>
        <circle cx="28" cy="15" r="3" fill="#2d3436"/>
        <ellipse cx="20" cy="24" rx="4" ry="2.5" fill="#FF9F43"/>
        <circle cx="8" cy="6" r="7" fill="#FFD93D"/>
        <circle cx="32" cy="6" r="7" fill="#FFD93D"/>
      </g>
    </svg>
  );
}
function PatientView(props){
  var status=props.status;var rr=props.rr;var signs=props.signs||[];
  var ageGroup=props.ageGroup||"infant";var sex=props.sex||"neutral";
  var visuals=props.visuals||[];var emotion=props.emotion||"neutral";
  var leftSigns=signs.filter(function(_,i){return i%2===0;});
  var rightSigns=signs.filter(function(_,i){return i%2===1;});
  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",gap:4}}>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {leftSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15}/>;})}</div>
        <div style={{width:180,flexShrink:0}}>
          <PatientSVG status={status} rr={rr} ageGroup={ageGroup} sex={sex} visuals={visuals} emotion={emotion}/></div>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {rightSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15+0.1}/>;})}</div>
      </div>
    </div>);
}
function ActionPanel(props){
  var tools=props.tools;var meds=props.meds;var actions=props.actions;var onDone=props.onDone;
  var _sel=useState({});var sel=_sel[0];var setSel=_sel[1];
  var _pop=useState(null);var pop=_pop[0];var setPop=_pop[1];
  var rT=Object.entries(actions&&actions.tools?actions.tools:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var rM=Object.entries(actions&&actions.meds?actions.meds:{}).filter(function(e){return e[1].ok;}).map(function(e){return e[0];});
  var totalCorrect=rT.length+rM.length;
  var allF=totalCorrect>0&&rT.concat(rM).every(function(id){return sel[id];});
  var explored=Object.keys(sel).length;
  var total=(tools?tools.length:0)+(meds?meds.length:0);
  var pick=function(id,ty){var src=ty==="t"?(actions&&actions.tools):(actions&&actions.meds);var info=src?src[id]:null;if(!info)return;
    setSel(function(p){var n=Object.assign({},p);n[id]=info;return n;});setPop({id:id,ty:ty,info:info});};
  function tbg(u,o){if(!u)return"rgba(255,255,255,0.05)";return o?"rgba(0,184,148,0.12)":"rgba(255,165,0,0.1)";}
  function tbd(u,o){if(!u)return"2px solid rgba(255,255,255,0.08)";return o?"2px solid rgba(0,184,148,0.35)":"2px solid rgba(255,165,0,0.25)";}
  return(
    <div style={{marginTop:16}}>
      <style>{"@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}"}</style>
      {tools&&tools.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Tool Belt</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{tools.map(function(id){var t=TOOLS[id];if(!t)return null;var u=!!sel[id];var o=actions&&actions.tools&&actions.tools[id]?actions.tools[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"t");}} className="bw-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:12,borderRadius:12,minWidth:76,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <ToolIcon name={id} size={28} color={u?(o?"#55efc4":"#FECA57"):"#4ECDC4"}/><span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{t.label}</span>
            {u&&<span style={{fontSize:9}}>{o?<Check size={12}/>:<Minus size={12}/>}</span>}</button>);})}</div></div>)}
      {meds&&meds.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#999",fontWeight:700,marginBottom:8}}>Med Cart</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{meds.map(function(id){var m=MEDS[id];if(!m)return null;var u=!!sel[id];var o=actions&&actions.meds&&actions.meds[id]?actions.meds[id].ok:false;
          return(<button key={id} onClick={function(){pick(id,"m");}} className="bw-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:12,borderRadius:12,minWidth:76,background:tbg(u,o),border:tbd(u,o),cursor:"pointer",color:"white"}}>
            <div style={{width:28,height:34,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:m.color||"#636e72",fontSize:16,color:"white"}}><MedIcon type={m.medType||"iv"} size={20} color="white"/></div>
            <span style={{fontSize:11,color:"#ccc",fontWeight:600,textAlign:"center",lineHeight:1.2}}>{m.label}</span>
            {u&&<span style={{fontSize:9}}>{o?<Check size={12}/>:<Minus size={12}/>}</span>}</button>);})}</div></div>)}
      {pop&&(<div onClick={function(){setPop(null);}} style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.6)"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:"min(420px, 90vw)",borderRadius:16,padding:20,background:"#1a1a3e",border:"2px solid "+(pop.info.ok?"#00b894":"#ffa502"),animation:"popIn .25s ease-out"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:900,background:pop.info.ok?"rgba(0,184,148,0.2)":"rgba(255,165,2,0.2)",color:pop.info.ok?"#00b894":"#ffa502",display:"flex",alignItems:"center",gap:4}}>{pop.info.ok?<><Check size={14}/> APPROPRIATE</>:<><X size={14}/> NOT INDICATED NOW</>}</div>
            {pop.info.pri&&<div style={{padding:"4px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Priority #"+pop.info.pri}</div>}
          </div>
          <h4 style={{color:"white",fontWeight:700,marginBottom:4}}>{pop.ty==="t"?(TOOLS[pop.id]?TOOLS[pop.id].label:pop.id):(MEDS[pop.id]?MEDS[pop.id].label:pop.id)}</h4>
          <p style={{fontSize:11,color:"#999",marginBottom:8}}>{pop.ty==="t"?(TOOLS[pop.id]?TOOLS[pop.id].desc:""):(MEDS[pop.id]?MEDS[pop.id].desc:"")}</p>
          <TextBlock text={pop.info.fb} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/>
          <button onClick={function(){setPop(null);}} style={{width:"100%",marginTop:16,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:pop.info.ok?"rgba(0,184,148,0.3)":"rgba(255,165,2,0.2)",border:"none",cursor:"pointer"}}>Got It</button>
        </div></div>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}>
        <div style={{fontSize:11,color:"#666"}}>{explored+"/"+total+" explored"}</div>
        {allF&&<button onClick={onDone} style={{padding:"8px 20px",borderRadius:12,fontWeight:700,color:"white",fontSize:13,background:"linear-gradient(135deg,#4ECDC4,#44B09E)",border:"none",cursor:"pointer"}}>Continue</button>}</div>
      {!allF&&explored>0&&<p style={{fontSize:11,color:"#4ECDC4",marginTop:8,opacity:0.7}}>Find all appropriate actions to continue.</p>}
    </div>);
}
function ScenarioPlayer(props){
  var sc=props.sc;var onExit=props.onExit;var onDone=props.onDone;
  var ageG=guessAge(sc);var sexG=guessSex(sc);var scVisuals=sc.visuals||[];
  var _stage=useState("intro");var stage=_stage[0];var setStage=_stage[1];
  var _pi=useState(0);var pi=_pi[0];var setPi=_pi[1];
  var _flags=useState({});var flags=_flags[0];var setFlags=_flags[1];
  var _showFb=useState(false);var showFb=_showFb[0];var setShowFb=_showFb[1];
  var _cbDone=useState(false);var cbDone=_cbDone[0];var setCbDone=_cbDone[1];
  var _score=useState({c:0,t:0});var score=_score[0];var setScore=_score[1];
  var _expI=useState(null);var expI=_expI[0];var setExpI=_expI[1];
  var _tldrOpen=useState({});var tldrOpen=_tldrOpen[0];var setTldrOpen=_tldrOpen[1];
  var toggleTldr=function(key){setTldrOpen(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;});};
  var _shake=useState(false);var shake=_shake[0];var setShake=_shake[1];
  var _vit=useState(sc.phases[0].vitals);var vit=_vit[0];var setVit=_vit[1];
  var _recStep=useState(0);var recStep=_recStep[0];var setRecStep=_recStep[1];
  var ph=sc.phases[pi];
  /* Build correct actions list for recovery screen (must be at top level for hook rules) */
  var correctActions=[];
  sc.phases.forEach(function(p){
    if(!p.actions)return;
    if(p.actions.tools){Object.entries(p.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(p.actions.meds){Object.entries(p.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  });
  if(sc.curveball&&sc.curveball.actions){
    if(sc.curveball.actions.tools){Object.entries(sc.curveball.actions.tools).forEach(function(e){if(e[1].ok&&e[1].pri){var t=TOOLS[e[0]];correctActions.push({name:t?t.label:e[0],toolId:e[0],medType:null,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});}});}
    if(sc.curveball.actions.meds){Object.entries(sc.curveball.actions.meds).forEach(function(e){if(e[1].ok&&e[1].pri){var m=MEDS[e[0]];correctActions.push({name:m?m.label:e[0],toolId:null,medType:m?m.medType:"iv",fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"med"});}});}
  }
  correctActions.sort(function(a,b){return(a.pri||99)-(b.pri||99);});
  useEffect(function(){if(stage!=="recovery")return;setRecStep(0);var iv=setInterval(function(){setRecStep(function(p){if(p>=correctActions.length)return p;return p+1;});},1200);return function(){clearInterval(iv);};},[stage]);
  var pSt=function(){if(stage.startsWith("cb"))return"critical";if(pi>=1||stage==="act")return"declining";return"stable";};
  var trigCb=useCallback(function(){setShake(true);setTimeout(function(){setShake(false);},800);setVit(sc.curveball.vitals);setStage("cb-alert");setCbDone(true);},[sc]);
  var flag=function(id){if(!showFb)setFlags(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});};
  var submit=function(){var c=0;ph.assessItems.forEach(function(it){if(!!flags[it.id]===it.bad)c++;});setScore(function(p){return{c:p.c+c,t:p.t+ph.assessItems.length};});setShowFb(true);};
  var afterA=function(){setFlags({});setShowFb(false);if(pi<sc.phases.length-1){var n=pi+1;setPi(n);setVit(sc.phases[n].vitals);setStage("phase");}else setStage("debrief");};
  var afterAct=function(){if(!cbDone&&sc.curveball)trigCb();else setStage("recovery");};
  var phaseHasIntervention=ph&&(ph.tools||ph.meds);;
  var BS={width:"100%",marginTop:12,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,border:"none",cursor:"pointer"};
  var GR="linear-gradient(135deg,#4ECDC4,#44B09E)";var RD="linear-gradient(135deg,#FF4757,#c0392b)";var PP="linear-gradient(135deg,#a55eea,#8854d0)";
  var isCb=stage.startsWith("cb");
  var curSigns=isCb?(sc.curveball?sc.curveball.signs:[]):(ph?ph.signs:[]);
  var curLabs=isCb?(sc.curveball?sc.curveball.labs||[]:[]):(ph?ph.labs||[]:[]);
  if(stage==="debrief"){var pct=score.t>0?Math.round(score.c/score.t*100):0;var emIcon=pct>=80?<Star size={24} color="#FECA57"/>:pct>=50?<Trophy size={24} color="#FECA57"/>:<BookOpen size={24} color="#74b9ff"/>;var sBg=pct>=80?"#00b894":pct>=50?"#fdcb6e":"#e17055";
    var reviewSteps=[];
    sc.phases.forEach(function(p){
      if(p.signs)p.signs.forEach(function(s){reviewSteps.push({type:"finding",text:s.label});});
      if(p.tools||p.meds){
        var correctT=Object.entries(p.actions&&p.actions.tools?p.actions.tools:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return TOOLS[e[0]]?TOOLS[e[0]].label:e[0];});
        var correctM=Object.entries(p.actions&&p.actions.meds?p.actions.meds:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return MEDS[e[0]]?MEDS[e[0]].label:e[0];});
        correctT.concat(correctM).forEach(function(name){reviewSteps.push({type:"action",text:name});});
      }
    });
    if(sc.curveball){
      reviewSteps.push({type:"event",text:sc.curveball.name});
      var cT=Object.entries(sc.curveball.actions&&sc.curveball.actions.tools?sc.curveball.actions.tools:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return TOOLS[e[0]]?TOOLS[e[0]].label:e[0];});
      var cM=Object.entries(sc.curveball.actions&&sc.curveball.actions.meds?sc.curveball.actions.meds:{}).filter(function(e){return e[1].ok&&e[1].pri;}).sort(function(a,b){return(a[1].pri||99)-(b[1].pri||99);}).map(function(e){return MEDS[e[0]]?MEDS[e[0]].label:e[0];});
      cT.concat(cM).forEach(function(name){reviewSteps.push({type:"action",text:name});});
    }
    reviewSteps.push({type:"outcome",text:"Patient stabilized"});
    return(<div style={{minHeight:"100vh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{width:100,margin:"0 auto"}}><PatientSVG status="stable" rr={20} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
      </div>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44,display:"flex",justifyContent:"center"}}>{emIcon}</div><h2 style={{fontSize:24,fontWeight:900}}>Scenario Complete</h2>
        <div className="si" style={{marginTop:8,display:"inline-block",padding:"8px 20px",borderRadius:20,fontSize:18,fontWeight:700,background:sBg}}>{score.c+"/"+score.t+" - "+pct+"%"}</div></div>
      <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:16}}><TextBlock text={sc.debrief.summary} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/></div>
      {/* Review Flowchart */}
      <div className="bw-glass" style={{marginBottom:16,borderRadius:12,overflow:"hidden"}}>
        <button onClick={function(){setExpI(expI==="review"?null:"review");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
          <span style={{fontWeight:700,fontSize:14,color:"#FECA57"}}>Review: Findings - Interventions - Outcome</span><span style={{color:"#FECA57"}}>{expI==="review"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI==="review"&&<div style={{padding:"0 12px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
            {reviewSteps.map(function(step,i){
              var bg=step.type==="finding"?"rgba(78,205,196,0.15)":step.type==="action"?"rgba(0,184,148,0.15)":step.type==="event"?"rgba(255,71,87,0.2)":"rgba(254,202,87,0.2)";
              var bc=step.type==="finding"?"#4ECDC4":step.type==="action"?"#00b894":step.type==="event"?"#FF6B81":"#FECA57";
              var icon=step.type==="finding"?<Search size={14}/>:step.type==="action"?<Check size={14}/>:step.type==="event"?<Zap size={14}/>:<Star size={14}/>;
              return(<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
                <div style={{padding:"6px 14px",borderRadius:10,background:bg,border:"1px solid "+bc+"40",textAlign:"center",maxWidth:"90%",display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,color:bc,display:"flex",alignItems:"center",gap:3}}>{icon}{step.text}</span>
                </div>
                {i<reviewSteps.length-1&&<div style={{width:2,height:16,background:"rgba(255,255,255,0.15)"}}></div>}
              </div>);
            })}
          </div>
        </div>}
      </div>
      {/* Lab Review */}
      {(function(){
        var allLabs=[];
        sc.phases.forEach(function(p,pi){if(p.labs){p.labs.forEach(function(l){if(l.critical&&l.explain)allLabs.push({lab:l,phase:p.name});});}});
        if(sc.curveball&&sc.curveball.labs){sc.curveball.labs.forEach(function(l){if(l.critical&&l.explain)allLabs.push({lab:l,phase:"Curveball: "+sc.curveball.name});});}
        if(allLabs.length===0)return null;
        return(<div style={{marginBottom:12}}>
          <div style={{marginBottom:12,borderRadius:12,overflow:"hidden",background:"rgba(255,71,87,0.06)",border:"1px solid rgba(255,71,87,0.12)"}}>
            <button onClick={function(){setExpI(expI==="labrev"?null:"labrev");}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#ff7675",display:"flex",alignItems:"center",gap:6}}><Droplets size={14}/>Lab Review - Critical Values Explained</span><span style={{color:"#ff7675"}}>{expI==="labrev"?<Minus size={16}/>:<Plus size={16}/>}</span></button>
            {expI==="labrev"&&<div style={{padding:"0 12px 12px"}}>
              {allLabs.map(function(entry,i){return(
                <div key={i} style={{marginBottom:12,borderRadius:8,padding:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#ff7675"}}>{entry.lab.name+": "+entry.lab.value+" "+entry.lab.unit}</span>
                    <span style={{fontSize:9,color:"#666"}}>{"Ref: "+entry.lab.ref+" | "+entry.phase}</span>
                  </div>
                  <TextBlock text={entry.lab.explain} style={{fontSize:12,color:"#ccc",lineHeight:1.5}}/>
                </div>
              );})}
            </div>}
          </div>
        </div>);
      })()}
      <h3 style={{fontSize:17,fontWeight:700,color:"#4ECDC4",marginBottom:12}}>Physiology Deep Dive</h3>
      {sc.debrief.explainers.map(function(e,i){return(<div key={i} className="bw-glass" style={{marginBottom:12,borderRadius:12,overflow:"hidden"}}>
        <button onClick={function(){setExpI(expI===i?null:i);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
          <span style={{fontWeight:700,fontSize:13}}>{e.title}</span><span style={{color:"#4ECDC4"}}>{expI===i?<Minus size={16}/>:<Plus size={16}/>}</span></button>
        {expI===i&&<div style={{padding:"0 12px 12px"}}>
          <TextBlock text={e.content} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/>
          {e.tldr&&<div style={{marginTop:8}}>
            <button onClick={function(){toggleTldr("e"+i);}} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(78,205,196,0.1)",border:"1px solid rgba(78,205,196,0.2)",borderRadius:8,padding:"4px 10px",cursor:"pointer",color:"#4ECDC4",fontSize:11,fontWeight:700}}>
              <span>TLDR</span><span>{tldrOpen["e"+i]?"\u2212":"+"}</span></button>
            {tldrOpen["e"+i]&&<p style={{fontSize:12,color:"#FECA57",marginTop:6,lineHeight:1.5,fontWeight:600}}>{e.tldr}</p>}
          </div>}
        </div>}</div>);})}
      {sc.curveball&&sc.curveball.teaches&&(<div><h3 style={{fontSize:17,fontWeight:700,color:"#FF6B81",marginTop:16,marginBottom:12}}>Curveball Deep Dive</h3>
        {sc.curveball.teaches.map(function(t,i){var k="c"+i;return(<div key={k} style={{marginBottom:12,borderRadius:12,overflow:"hidden",background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.15)"}}>
          <button onClick={function(){setExpI(expI===k?null:k);}} style={{width:"100%",textAlign:"left",padding:12,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",color:"white"}}>
            <span style={{fontWeight:700,fontSize:13}}>{t.title}</span><span style={{color:"#FF6B81"}}>{expI===k?<Minus size={16}/>:<Plus size={16}/>}</span></button>
          {expI===k&&<div style={{padding:"0 12px 12px"}}>
            <TextBlock text={t.content} style={{fontSize:13,color:"#ccc",lineHeight:1.6}}/>
            {t.tldr&&<div style={{marginTop:8}}>
              <button onClick={function(){toggleTldr(k);}} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,71,87,0.1)",border:"1px solid rgba(255,71,87,0.2)",borderRadius:8,padding:"4px 10px",cursor:"pointer",color:"#FF6B81",fontSize:11,fontWeight:700}}>
                <span>TLDR</span><span>{tldrOpen[k]?"\u2212":"+"}</span></button>
              {tldrOpen[k]&&<p style={{fontSize:12,color:"#FECA57",marginTop:6,lineHeight:1.5,fontWeight:600}}>{t.tldr}</p>}
            </div>}
          </div>}</div>);})}</div>)}
      <button onClick={function(){onDone(score);onExit();}} style={Object.assign({},BS,{background:GR})}>Back to Dashboard</button></div></div>);}
  return(<div className={shake?"bw-shake":""} style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}>
    <style>{"@keyframes bwShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px)}20%{transform:translateX(8px)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}}.bw-shake{animation:bwShake .6s ease-in-out}@keyframes slideU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.slu{animation:slideU .4s ease-out}@keyframes alertP{0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,.4)}50%{box-shadow:0 0 0 12px rgba(255,71,87,0)}}.alp{animation:alertP 1.5s infinite}@keyframes fadeCard{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.bw-split{display:flex;flex-direction:column;gap:12px}.bw-split-left,.bw-split-right{width:100%}@media(min-width:768px){.bw-container{max-width:900px!important}.bw-split{flex-direction:row;gap:20px;align-items:flex-start}.bw-split-left{width:42%;position:sticky;top:16px;max-height:calc(100dvh - 80px);overflow-y:auto}.bw-split-right{width:58%;min-height:0}}"}</style>
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <button onClick={onExit} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer"}}>X Exit</button>
        <div style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:isCb?"rgba(255,71,87,0.2)":"rgba(78,205,196,0.15)",color:isCb?"#FF6B81":"#4ECDC4"}}>{isCb?"CURVEBALL":"Phase "+(pi+1)+"/"+sc.phases.length}</div>
        <div style={{fontSize:11,color:"#888"}}>{score.c+"/"+score.t}</div></div>
      {stage==="intro"&&(<div className="slu" style={{textAlign:"center"}}>
        <PatientView status="stable" rr={30} signs={[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
        <h2 style={{fontSize:24,fontWeight:900,marginTop:12,marginBottom:8}}>{sc.title}</h2>
        <div className="bw-glass" style={{borderRadius:16,padding:16,marginBottom:16,textAlign:"left"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}>
            <div><span style={{color:"#999"}}>Age: </span><strong>{sc.patient.ageLabel}</strong></div>
            <div><span style={{color:"#999"}}>Weight: </span><strong>{sc.patient.weightKg+" kg"}</strong></div>
            <div><span style={{color:"#999"}}>Sex: </span><strong>{sc.patient.sex}</strong></div></div>
          <div style={{fontSize:13,marginBottom:8}}><span style={{color:"#999"}}>CC: </span><strong>{sc.patient.cc}</strong></div>
          <TextBlock text={sc.patient.history} style={{fontSize:13,color:"#ccc",lineHeight:1.5}}/></div>
        <button onClick={function(){setStage("phase");}} style={Object.assign({},BS,{background:GR})}>Begin Assessment</button></div>)}
      {stage==="phase"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status={pSt()} rr={vit.rr} signs={ph?ph.signs:[]} ageGroup={ageG} sex={sexG} visuals={scVisuals} emotion="sad"/>
            <div style={{marginTop:12}}><Monitor vitals={vit}/></div>
            <BodySystemsView signs={ph?ph.signs:[]}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12}}>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/></div>
            {phaseHasIntervention?(
              <button onClick={function(){setStage("act");}} style={Object.assign({},BS,{background:GR})}>Begin Intervention</button>
            ):(
              <button onClick={function(){setStage("assess");}} style={Object.assign({},BS,{background:GR})}>Assess Vitals</button>
            )}
          </div>
        </div></div>)}
      {/* ASSESSMENT - Monitor visible above questions */}
      {stage==="assess"&&(function(){
        var vitItems=ph.assessItems.filter(function(it){return !it.cat||it.cat==="vital";});
        var labItems=ph.assessItems.filter(function(it){return it.cat==="lab";});
        var clinItems=ph.assessItems.filter(function(it){return it.cat==="clinical";});
        function renderItem(it){var f=!!flags[it.id];var ok=showFb&&(f===it.bad);
          var bg=showFb?(ok?"rgba(0,184,148,0.1)":"rgba(255,71,87,0.1)"):(f?"rgba(254,202,87,0.12)":"rgba(255,255,255,0.04)");
          var brd=showFb?(ok?"2px solid rgba(0,184,148,0.25)":"2px solid rgba(255,71,87,0.25)"):(f?"2px solid rgba(254,202,87,0.25)":"2px solid rgba(255,255,255,0.07)");
          var ilabel=it.label.toLowerCase();
          var miniSVG=null;
          if(ilabel.indexOf("mottl")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="10" cy="15" r="4" fill="#9080a0" opacity="0.6"/><circle cx="25" cy="12" r="3" fill="#9080a0" opacity="0.5"/><circle cx="18" cy="28" r="3.5" fill="#9080a0" opacity="0.6"/><circle cx="32" cy="25" r="2.5" fill="#9080a0" opacity="0.5"/><circle cx="8" cy="32" r="3" fill="#9080a0" opacity="0.4"/></svg>);};
          if(ilabel.indexOf("eye")>=0||ilabel.indexOf("deviat")>=0||ilabel.indexOf("pupil")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="14" cy="20" r="7" fill="white"/><circle cx="26" cy="20" r="7" fill="white"/><circle cx="14" cy="16" r="3.5" fill="#2d3436"/><circle cx="26" cy="16" r="3.5" fill="#2d3436"/></svg>);};
          if(ilabel.indexOf("cyan")>=0||ilabel.indexOf("blue")>=0||ilabel.indexOf("lip")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="14" cy="16" r="3" fill="#2d3436"/><circle cx="26" cy="16" r="3" fill="#2d3436"/><ellipse cx="20" cy="28" rx="8" ry="4" fill="#8888bb"/></svg>);};
          if(ilabel.indexOf("flush")>=0||ilabel.indexOf("hive")>=0||ilabel.indexOf("rash")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><circle cx="10" cy="12" r="3" fill="#ff6b6b" opacity="0.7"/><circle cx="25" cy="10" r="2.5" fill="#ff6b6b" opacity="0.6"/><circle cx="15" cy="28" r="3.5" fill="#ff6b6b" opacity="0.7"/><circle cx="30" cy="22" r="2" fill="#ff6b6b" opacity="0.5"/><circle cx="8" cy="22" r="2.5" fill="#ff6b6b" opacity="0.6"/></svg>);};
          if(ilabel.indexOf("cool")>=0||ilabel.indexOf("pale")>=0||ilabel.indexOf("ashen")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#ddd"/><rect x="5" y="20" width="12" height="16" rx="4" fill="#c8c8d8"/><rect x="23" y="20" width="12" height="16" rx="4" fill="#c8c8d8"/></svg>);};
          if(ilabel.indexOf("retract")>=0||ilabel.indexOf("accessory")>=0||ilabel.indexOf("tripod")>=0||ilabel.indexOf("work of breath")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><rect x="10" y="12" width="20" height="18" rx="6" fill="#E8F0FE" opacity="0.4"/><line x1="15" y1="16" x2="15" y2="26" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/><line x1="25" y1="16" x2="25" y2="26" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/><line x1="20" y1="14" x2="20" y2="28" stroke="#cc8866" strokeWidth="1" strokeDasharray="2,1"/></svg>);};
          if(ilabel.indexOf("jvd")>=0||ilabel.indexOf("neck vein")>=0||ilabel.indexOf("jugular")>=0)miniSVG=function(){return(<svg viewBox="0 0 40 40" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(78,205,196,0.3)"}}><rect width="40" height="40" rx="20" fill="#f0ccb0"/><rect x="14" y="5" width="12" height="30" rx="6" fill="#e8c8a8"/><line x1="17" y1="10" x2="17" y2="30" stroke="#70a0d0" strokeWidth="2"/><line x1="23" y1="10" x2="23" y2="30" stroke="#70a0d0" strokeWidth="2"/></svg>);};
          return(<button key={it.id} onClick={function(){flag(it.id);}} className="bw-tap" style={{width:"100%",textAlign:"left",borderRadius:12,padding:14,background:bg,border:brd,cursor:"pointer",color:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {miniSVG&&<div style={{flexShrink:0}}>{miniSVG()}</div>}
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:6}}>{f&&!showFb&&<Flag size={14} color="#FECA57"/>}{it.label}</span>
                  {showFb&&<span style={{fontSize:15,fontWeight:700}}>{ok?<Check size={16}/>:<X size={16}/>}</span>}</div>
                {showFb&&<TextBlock text={it.why} style={{fontSize:12,color:"#ccc",marginTop:6,lineHeight:1.6}}/>}
              </div>
            </div></button>);}
        return(<div className="slu">
          <div className="bw-split">
            <div className="bw-split-left">
              <Monitor vitals={vit}/>
              <BodySystemsView signs={curSigns}/>
              <LabPanel labs={curLabs}/>
              <div style={{borderRadius:12,padding:10,marginTop:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <TextBlock text={ph?ph.narrative:""} style={{fontSize:12,color:"#999",lineHeight:1.5}}/>
              </div>
            </div>
            <div className="bw-split-right">
              {vitItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Flag Abnormal Vital Signs:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{vitItems.map(renderItem)}</div>
              </div>}
              {labItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#ff7675",marginBottom:8}}>Flag Abnormal Lab Values:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{labItems.map(renderItem)}</div>
              </div>}
              {clinItems.length>0&&<div style={{marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#FECA57",marginBottom:8}}>Flag Concerning Clinical Findings:</h3>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{clinItems.map(renderItem)}</div>
              </div>}
              {!showFb?<button onClick={submit} style={Object.assign({},BS,{background:PP})}>Submit Assessment</button>
                :<button onClick={afterA} style={Object.assign({},BS,{background:GR})}>{ph.tools?"Open Tool Belt":"Continue"}</button>}
            </div>
          </div></div>);
      })()}
      {stage==="act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <Monitor vitals={vit}/>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div className="bw-glass" style={{borderRadius:16,padding:12,marginBottom:8}}>
              <TextBlock text={ph?ph.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:4}}>Intervention Time</p>
                <p style={{fontSize:11,color:"#bbb"}}>Tap each tool and med. Find all correct actions to continue.</p></div></div>
            <ActionPanel tools={ph.tools} meds={ph.meds} actions={ph.actions} onDone={afterAct}/>
          </div>
        </div></div>)}
      {stage==="cb-alert"&&(<div className="slu">
        <div className="alp" style={{textAlign:"center",marginBottom:12}}><div style={{display:"inline-block",padding:"8px 16px",borderRadius:20,fontWeight:900,color:"white",fontSize:13,background:"#FF4757"}}>UNEXPECTED EVENT</div></div>
        <div className="bw-split">
          <div className="bw-split-left">
            <PatientView status="critical" rr={vit.rr} signs={sc.curveball?sc.curveball.signs:[]} ageGroup={ageG} sex={sexG} visuals={scVisuals}/>
            <div style={{marginTop:12}}><Monitor vitals={vit} flash={true}/></div>
            <LabPanel labs={curLabs}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.5}}/></div>
            <button onClick={function(){setStage("cb-act");}} style={Object.assign({},BS,{background:RD})}>What Do You Do?</button>
          </div>
        </div></div>)}
      {stage==="cb-act"&&(<div className="slu">
        <div className="bw-split">
          <div className="bw-split-left">
            <Monitor vitals={vit} flash={true}/>
            <LabPanel labs={curLabs}/>
            <BodySystemsView signs={sc.curveball?sc.curveball.signs:[]}/>
          </div>
          <div className="bw-split-right">
            <div style={{borderRadius:16,padding:12,background:"rgba(255,71,87,0.08)",border:"1px solid rgba(255,71,87,0.2)"}}>
              <TextBlock text={sc.curveball?sc.curveball.narrative:""} style={{fontSize:13,color:"#ddd",lineHeight:1.6,marginBottom:8}}/>
              <div style={{borderTop:"1px solid rgba(255,71,87,0.15)",paddingTop:8,marginTop:8}}>
                <p style={{fontSize:14,fontWeight:700,color:"#FF6B81",marginBottom:4}}>Critical Intervention</p>
                <p style={{fontSize:11,color:"#bbb"}}>Find all correct actions.</p></div></div>
            <ActionPanel tools={sc.curveball.tools} meds={sc.curveball.meds} actions={sc.curveball.actions} onDone={function(){setStage("recovery");}}/>
          </div>
        </div></div>)}
      {stage==="recovery"&&(function(){
        var allRevealed=recStep>=correctActions.length;
        return(<div className="slu" style={{textAlign:"center"}}>
          <style>{"@keyframes bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-18px)}50%{transform:translateY(-10px)}70%{transform:translateY(-14px)}}.bw-bounce{animation:bounce 1s ease-in-out infinite}@keyframes confetti{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(360deg)}}.bw-confetti{animation:confetti 2s ease-out both}@keyframes vitalsNorm{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}.bw-vn{animation:vitalsNorm .5s ease-out both}"}</style>
          <div style={{marginBottom:20}}>
            <div className="bw-bounce" style={{width:120,margin:"0 auto"}}><PatientSVG status="stable" rr={22} ageGroup={ageG} sex={sexG} emotion="happy"/></div>
            {/* Celebration sparkles */}
            <div style={{position:"relative",height:40,overflow:"hidden",marginTop:-10}}>
              {[<Sparkles/>,<Star/>,<Heart/>,<Trophy/>,<Zap/>,<Shield/>,<Sparkles/>].map(function(e,i){return(<span key={i} className="bw-confetti" style={{position:"absolute",left:(10+i*13)+"%",color:"#FECA57",animationDelay:(i*0.15)+"s"}}>{e}</span>);})}
            </div>
          </div>
          <h2 style={{fontSize:26,fontWeight:900,color:"#55efc4",marginBottom:4}}>Patient Stabilized!</h2>
          <p style={{fontSize:14,color:"#ccc",marginBottom:20}}>Your interventions worked. Here's how the patient responded:</p>
          {/* Normalized vitals */}
          <div className="bw-vn" style={{display:"inline-flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {[{l:"HR",v:sc.norms?Math.round((sc.norms.hr[0]+sc.norms.hr[1])/2):"--",c:"#55efc4"},{l:"SpO\u2082",v:sc.norms?"99%":"--",c:"#fdcb6e"},{l:"BP",v:sc.norms?Math.round((sc.norms.sbp[0]+sc.norms.sbp[1])/2)+"/"+Math.round((sc.norms.dbp[0]+sc.norms.dbp[1])/2):"--",c:"#74b9ff"},{l:"Temp",v:"37.0\u00B0C",c:"#fab1a0"}].map(function(vi,i){return(<div key={i} className="bw-vn" style={{animationDelay:(0.2+i*0.15)+"s",padding:"8px 14px",borderRadius:12,background:"rgba(85,239,196,0.08)",border:"1px solid rgba(85,239,196,0.15)"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:700,textTransform:"uppercase"}}>{vi.l}</div>
              <div style={{fontSize:18,fontWeight:900,color:vi.c}}>{vi.v}</div>
            </div>);})}
          </div>
          {/* Intervention timeline - reveals one at a time */}
          <div style={{textAlign:"left",maxWidth:400,margin:"0 auto",marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>What Saved This Patient:</p>
            {correctActions.map(function(act,i){
              var visible=i<recStep;
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,opacity:visible?1:0.15,transform:visible?"translateX(0)":"translateX(-10px)",transition:"all 0.4s ease-out"}}>
                <div style={{flexShrink:0,width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:act.type==="tool"?"rgba(78,205,196,0.15)":"rgba(116,185,255,0.15)",border:"1px solid "+(act.type==="tool"?"rgba(78,205,196,0.3)":"rgba(116,185,255,0.3)")}}>{act.type==="tool"?ToolIcon({name:act.toolId,size:20,color:"#4ECDC4"}):MedIcon({type:act.medType||"iv",size:20,color:"#74b9ff"})}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"white"}}>{act.name}</div>
                  {visible&&act.fb&&<p style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4}}>{act.fb}</p>}
                </div>
                {visible&&<div style={{flexShrink:0,marginTop:2}}><Check size={18} color="#55efc4"/></div>}
              </div>);
            })}
          </div>
          {allRevealed&&<div className="bw-vn" style={{marginBottom:16}}>
            <p style={{fontSize:13,color:"#55efc4",fontWeight:700,marginBottom:12}}>All interventions complete. Patient is resting comfortably.</p>
            <button onClick={function(){setStage("debrief");}} style={Object.assign({},BS,{background:GR,maxWidth:300,margin:"0 auto"})}>Continue to Debrief</button>
          </div>}
        </div>);
      })()}
    </div></div>);
}
function Builder(props){
  var onDone=props.onDone;var onBack=props.onBack;
  var _txt=useState("");var txt=_txt[0];var setTxt=_txt[1];
  var _busy=useState(false);var busy=_busy[0];var setBusy=_busy[1];
  var _mi=useState(0);var mi=_mi[0];var setMi=_mi[1];
  var _err=useState(null);var err=_err[0];var setErr=_err[1];
  var _cbMode=useState(true);var cbMode=_cbMode[0];var setCbMode=_cbMode[1];
  var msgs=["Assembling blocks...","Calibrating monitor...","Reviewing the chart...","Stocking med cart...","Writing the debrief..."];
  useEffect(function(){if(!busy)return;var iv=setInterval(function(){setMi(function(p){return(p+1)%msgs.length;});},2500);return function(){clearInterval(iv);};},[busy]);
  var cbPromptSection=cbMode?",\"curveball\":{\"name\":\"\",\"narrative\":\"\",\"vitals\":{},\"signs\":[],\"labs\":[],\"tools\":[\"must include defib\"],\"meds\":[],\"actions\":{\"tools\":{},\"meds\":{}},\"teaches\":[{\"title\":\"\",\"content\":\"6-10 sentences detailed physiology\",\"tldr\":\"1-2 sentence plain summary\"}]}":"";
  var cbInstructions=cbMode?" Include a curveball section: an unexpected clinical event mid-scenario that tests a different critical thinking axis (e.g. new diagnosis, arrhythmia, equipment failure). The curveball must include its own vitals, signs, labs, tools, meds, actions, and teaches with tldr fields.":" Do NOT include a curveball. Set curveball to null in the JSON. The scenario should flow: Triage (assessment) -> Escalation (intervention) -> Debrief.";
  var go=async function(){if(!txt.trim())return;setBusy(true);setErr(null);
    try{var controller=new AbortController();var tid=setTimeout(function(){controller.abort();},300000);
      var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:controller.signal,
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:16000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        system:"You are a pediatric critical care educator for Block Ward. Create a COMPLETE medically accurate CREATIVE scenario for any pediatric emergency, trauma, or critical care case. Use web search for clinical details."+cbInstructions+" MANDATORY CLINICAL ACCURACY RULES: 1. All vital signs must fall within physiologically possible ranges for the stated age/weight. 2. All medication doses must use weight-based pediatric dosing from current PALS/NRP guidelines. 3. Lab values must be internally consistent (e.g., if pH is low, bicarb must also be low). 4. Disease progressions must follow real pathophysiology - no invented mechanisms. 5. Every explanation must cite the actual biochemical/physiologic mechanism. 6. Drug mechanisms must reference real receptor pharmacology. 7. Never invent drug names, lab tests, or clinical signs that do not exist. 8. Vital sign trends must be physiologically consistent across phases. 9. Normal ranges must be age-appropriate (infant vs child vs teen norms differ). 10. If unsure about a clinical detail, use conservative/standard textbook values. CRITICAL STYLE RULES: (1) NARRATIVES must be written in complete, informative sentences as in a clinical textbook. Use proper medical terminology. Keep to 4-6 sentences per narrative. (2) CLINICAL SIGNS must contain ONLY objective findings. Include a sys field. (3) TOOL/MED FEEDBACK must use bullet points. Format as: first sentence states whether appropriate or not and why, then \\n- for each key point. Example: 'Appropriate. Epinephrine provides systemic bronchodilation when inhaled meds cannot penetrate.\\n- Dose: 0.01 mg/kg IM to lateral thigh\\n- Beta-2 relaxes bronchial smooth muscle\\n- Alpha-1 reduces mucosal edema\\n- Reaches airways past severe bronchospasm'. (4) VITAL SIGNS must be consistent with clinical signs. (5) Give patients NAMES and backstories. (6) ALWAYS include defib in tools. For wrong choices use funny callouts. (7) EVERY teaches and explainers MUST include tldr AND use bullet points in content: opening sentence then \\n- for each mechanism. (8) Content should have 6-10 bullet points. (9) assessItem why fields: summary sentence then \\n- for key details. (10) Every assessItem MUST include cat field: vital, lab, or clinical. Available tool IDs: glucometer,stethoscope,bvm,suction,o2mask,ivKit,defib,thermometer,capRefill,needleDecomp,pupilCheck,epiPen,peakFlow. Available med IDs: lorazepam,phenytoin,epinephrine,dextrose,nsBolus,ceftriaxone,acetaminophen,albuterol,atropine,hypertonic,mannitolMed,levetiracetam,diphenhydramine,methylpred,famotidine,racemicEpi,adenosine. Return ONLY valid JSON. Structure: {\"id\":\"slug\",\"title\":\"\",\"tier\":1,\"icon\":\"emoji\",\"tagline\":\"\",\"description\":\"\",\"visuals\":[],\"patient\":{\"ageLabel\":\"\",\"weightKg\":0,\"sex\":\"Male or Female\",\"cc\":\"\",\"history\":\"\"},\"norms\":{\"hr\":[min,max],\"rr\":[min,max],\"sbp\":[min,max],\"dbp\":[min,max],\"spo2\":[95,100],\"temp\":[36.5,37.5]},\"phases\":[{\"id\":\"triage\",\"name\":\"Triage\",\"narrative\":\"\",\"vitals\":{\"hr\":0,\"rr\":0,\"sbp\":0,\"dbp\":0,\"spo2\":0,\"temp\":0,\"cap\":0},\"signs\":[{\"label\":\"\",\"detail\":\"\",\"pos\":\"\",\"sys\":\"\"}],\"assessItems\":[{\"id\":\"\",\"label\":\"\",\"bad\":true,\"why\":\"summary\\n- detail\\n- detail\",\"cat\":\"vital|lab|clinical\"}],\"labs\":[{\"name\":\"\",\"value\":\"\",\"unit\":\"\",\"ref\":\"\",\"critical\":true,\"explain\":\"\"}],\"tools\":null,\"meds\":null,\"actions\":null},{\"id\":\"escalation\",\"name\":\"Escalation\",\"narrative\":\"\",\"vitals\":{},\"signs\":[],\"assessItems\":[],\"labs\":[],\"tools\":[\"defib\"],\"meds\":[],\"actions\":{\"tools\":{},\"meds\":{}}}]"+cbPromptSection+",\"debrief\":{\"summary\":\"\",\"explainers\":[{\"title\":\"\",\"content\":\"summary\\n- point\\n- point\",\"tldr\":\"\"}]}}. Phase 1: assessment only (tools/meds/actions null). Phase 2: tools/meds/actions. CRITICAL ASSESSMENT RULES: Phase 1 assessItems must include 6-8 items with a MIX of abnormal (bad:true) and normal (bad:false). Include at least 3 normal and 3 abnormal. Include vitals (cat:vital), labs (cat:lab), and clinical findings (cat:clinical). CRITICAL INTERVENTION RULES: Phase 2 and curveball MUST have 3-4 tools ok:true with priority numbers and 2-3 meds ok:true with priority numbers. Remaining should be ok:false. There MUST always be correct actions. Include 5-6 tools and 5-6 meds total. Defib always included. 4-6 signs per phase with sys. 2-3 teaches with tldr. 2-3 explainers with tldr. LABS: Every phase MUST include 4-8 labs. critical:true for abnormal. Every critical lab needs explain field (2-3 sentences). ALL text fields (fb, why, content, explain, summary) should use \\n- bullet formatting for readability.",
        messages:[{role:"user",content:"Create pediatric scenario:\n\n"+txt}]})});
      clearTimeout(tid);
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
      if(!scenario.debrief)scenario.debrief={summary:"Complete.",explainers:[]};onDone(scenario);
    }catch(e){console.error("Build error:",e);var em=e.name==="AbortError"?"Request timed out. Try a simpler description or turn off Curveball Mode.":e.message||"Build failed. Try again with more detail.";setErr(em);}finally{setBusy(false);}};
  if(busy)return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)"}}>
    <style>{"@keyframes bbl{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}100%{transform:translateY(0) scale(1)}}.bbx>div:nth-child(1){animation:bbl 1.5s ease infinite}.bbx>div:nth-child(2){animation:bbl 1.5s ease .2s infinite}.bbx>div:nth-child(3){animation:bbl 1.5s ease .4s infinite}.bbx>div:nth-child(4){animation:bbl 1.5s ease .6s infinite}"}</style>
    <div className="bbx" style={{display:"flex",gap:12,marginBottom:32}}><div style={{width:40,height:40,borderRadius:8,background:"#4ECDC4"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FF6B81"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FECA57"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#a55eea"}}></div></div>
    <p style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Building Your Scenario</p>
    <p style={{fontSize:14,color:"#4ECDC4"}}>{msgs[mi]}</p></div>);
  return(<div style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff"}}><div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
    <button onClick={onBack} style={{color:"#888",fontSize:13,background:"none",border:"none",cursor:"pointer",marginBottom:16}}>Back</button>
    <h2 style={{fontSize:24,fontWeight:900,marginBottom:8}}>Build a Scenario</h2>
    <p style={{fontSize:13,color:"#999",marginBottom:6}}>Describe any pediatric emergency, trauma, or critical care case. Even a few words will work. The AI will research clinical details and build a fully playable scenario with vitals, labs, and interventions.</p>
    <p style={{fontSize:11,color:"#666",marginBottom:16}}>Once built, you can share your scenario with others via a link.</p>
    <textarea value={txt} onChange={function(e){setTxt(e.target.value);}} placeholder={"Examples:\n- 12 year old bike crash head injury\n- 9 year old peanut allergy anaphylaxis\n- Newborn with cyanotic heart disease\n- Toddler who drank grandma's pills\n- 4 year old near drowning"} style={{width:"100%",height:200,borderRadius:12,padding:16,color:"white",fontSize:13,resize:"none",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}/>
    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
      <button onClick={function(){setCbMode(!cbMode);}} style={{width:56,height:32,borderRadius:16,border:"none",cursor:"pointer",position:"relative",background:cbMode?"#4ECDC4":"rgba(255,255,255,0.15)",transition:"background 0.2s"}}>
        <div style={{width:24,height:24,borderRadius:12,background:"white",position:"absolute",top:4,left:cbMode?28:4,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
      </button>
      <div><span style={{fontSize:13,fontWeight:700,color:cbMode?"#4ECDC4":"#666"}}>Curveball Mode</span>
        <p style={{fontSize:10,color:"#666",marginTop:1}}>{cbMode?"A surprise clinical event will be thrown in mid-scenario":"Straight scenario: triage, escalation, debrief"}</p></div>
    </div>
    <div style={{marginTop:14,padding:12,borderRadius:10,background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.2)",fontSize:11,color:"#aaa",lineHeight:1.5}}>
      <span style={{color:"#4ECDC4",fontWeight:700}}>Clinical Disclaimer:</span> AI-generated scenarios are for educational practice only. Always verify clinical details against current guidelines before using for instruction.
    </div>
    {err&&<div style={{marginTop:12,padding:12,borderRadius:12,fontSize:12,background:"rgba(255,71,87,0.15)",color:"#FF6B81",lineHeight:1.4}}>{err}</div>}
    <button onClick={go} disabled={!txt.trim()} style={{width:"100%",marginTop:16,padding:"12px 0",borderRadius:12,fontWeight:700,color:"white",fontSize:16,background:txt.trim()?"linear-gradient(135deg,#a55eea,#8854d0)":"rgba(255,255,255,0.1)",opacity:txt.trim()?1:0.5,border:"none",cursor:txt.trim()?"pointer":"default"}}>Build Scenario</button>
  </div></div>);
}
export default function App(){
  var _view=useState("dash");var view=_view[0];var setView=_view[1];
  var _act=useState(null);var act=_act[0];var setAct=_act[1];
  var _cust=useState([]);var cust=_cust[0];var setCust=_cust[1];
  var _prog=useState({});var prog=_prog[0];var setProg=_prog[1];
  var _ok=useState(false);var ok=_ok[0];var setOk=_ok[1];
  var _shareMsg=useState(null);var shareMsg=_shareMsg[0];var setShareMsg=_shareMsg[1];
  var _sidebar=useState(false);var sidebar=_sidebar[0];var setSidebar=_sidebar[1];
  var _sideTab=useState("ref");var sideTab=_sideTab[0];var setSideTab=_sideTab[1];
  var _delConfirm=useState(null);var delConfirm=_delConfirm[0];var setDelConfirm=_delConfirm[1];
  function minifyScenario(sc){
    function trimFb(obj){if(!obj)return obj;var o={};Object.keys(obj).forEach(function(k){if(typeof obj[k]==="object"&&obj[k]&&obj[k].fb){o[k]={ok:obj[k].ok,pri:obj[k].pri,fb:obj[k].fb.substring(0,120)};}else{o[k]=obj[k];}});return o;}
    function trimPhase(p){return{id:p.id,name:p.name,narrative:p.narrative?p.narrative.substring(0,300):p.narrative,vitals:p.vitals,signs:p.signs?p.signs.map(function(s){return{label:s.label,detail:s.detail,pos:s.pos,sys:s.sys};}):p.signs,assessItems:p.assessItems,labs:p.labs?p.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):p.labs,tools:p.tools,meds:p.meds,actions:p.actions?{tools:trimFb(p.actions.tools),meds:trimFb(p.actions.meds)}:p.actions};}
    var m={id:sc.id,title:sc.title,tier:sc.tier,icon:sc.icon,tagline:sc.tagline,description:sc.description,patient:sc.patient,norms:sc.norms,visuals:sc.visuals,phases:sc.phases?sc.phases.map(trimPhase):[],debrief:sc.debrief?{summary:sc.debrief.summary,explainers:sc.debrief.explainers?sc.debrief.explainers.map(function(e){return{title:e.title,content:e.content?e.content.substring(0,200):"",tldr:e.tldr};}):[]}: sc.debrief};
    if(sc.curveball){m.curveball={name:sc.curveball.name,narrative:sc.curveball.narrative?sc.curveball.narrative.substring(0,300):"",vitals:sc.curveball.vitals,signs:sc.curveball.signs,labs:sc.curveball.labs?sc.curveball.labs.map(function(l){return{name:l.name,value:l.value,unit:l.unit,ref:l.ref,critical:l.critical};}):sc.curveball.labs,tools:sc.curveball.tools,meds:sc.curveball.meds,actions:sc.curveball.actions?{tools:trimFb(sc.curveball.actions.tools),meds:trimFb(sc.curveball.actions.meds)}:sc.curveball.actions,teaches:sc.curveball.teaches?sc.curveball.teaches.map(function(t){return{title:t.title,content:t.content?t.content.substring(0,200):"",tldr:t.tldr};}):[]};} else{m.curveball=null;}
    return m;
  }
  function encodeScenario(sc){try{return btoa(unescape(encodeURIComponent(JSON.stringify(sc))));}catch(e){return null;}}
  function decodeScenario(str){try{return JSON.parse(decodeURIComponent(escape(atob(str))));}catch(e){return null;}}
  function shareScenario(sc){
    var mini=minifyScenario(sc);
    var encoded=encodeScenario(mini);
    if(!encoded){setShareMsg("Failed to encode scenario");return;}
    var url=window.location.origin+"/?shared="+encodeURIComponent(encoded);
    if(url.length>4000){
      setShareMsg("Scenario too large to share via link. Try a simpler scenario.");
      setTimeout(function(){setShareMsg(null);},3000);
      return;
    }
    if(navigator.share){
      navigator.share({title:"Block Ward: "+sc.title,url:url}).catch(function(){});
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(url).then(function(){setShareMsg("Link copied!");setTimeout(function(){setShareMsg(null);},2500);});
    }else{
      prompt("Copy this link to share:",url);
    }
  }
  useEffect(function(){
    var existing=loadS("bw-custom",[]);
    setCust(existing);
    setProg(loadS("bw-prog",{}));
    var params=new URLSearchParams(window.location.search);
    var shared=params.get("shared");
    if(shared){
      var sc=decodeScenario(decodeURIComponent(shared));
      if(!sc)sc=decodeScenario(shared);
      if(sc&&sc.id&&sc.phases){
        var already=existing.some(function(c){return c.id===sc.id;});
        if(!already){
          var updated=existing.concat([sc]);
          setCust(updated);
          saveS("bw-custom",updated);
        }
        window.history.replaceState({},"",window.location.pathname);
        setShareMsg("Imported: "+sc.title);
        setTimeout(function(){setShareMsg(null);},3000);
      }
    }
    setOk(true);
  },[]);
  var built=[SC1,SC2,SC3];
  var play=function(s){setAct(s);setView("play");};
  var done=function(score){if(!act)return;var b=score.c/(score.t||1);var prev=prog[act.id];var p=Object.assign({},prog);p[act.id]={done:true,best:Math.max(b,prev?prev.best||0:0),n:(prev?prev.n||0:0)+1};setProg(p);saveS("bw-prog",p);};
  var addC=function(s){var u=cust.concat([s]);setCust(u);saveS("bw-custom",u);setView("dash");};
  var delC=function(id){var u=cust.filter(function(s){return s.id!==id;});setCust(u);saveS("bw-custom",u);var p=Object.assign({},prog);delete p[id];setProg(p);saveS("bw-prog",p);setDelConfirm(null);};
  var clearAll=function(){setCust([]);setProg({});saveS("bw-custom",[]);saveS("bw-prog",{});setShareMsg("All data cleared");setTimeout(function(){setShareMsg(null);},2000);};
  // Stats
  var allScenarios=built.concat(cust);
  var totalAttempts=0;var totalCorrect=0;var totalQ=0;
  Object.values(prog).forEach(function(p){if(p.n)totalAttempts+=p.n;});
  var nd=Object.values(prog).filter(function(p){return p.done;}).length;
  var avgScore=0;var scoreCount=0;
  Object.values(prog).forEach(function(p){if(p.best>0){avgScore+=p.best;scoreCount++;}});
  if(scoreCount>0)avgScore=Math.round(avgScore/scoreCount*100);
  // Peds vital sign reference data
  var vitalRef=[
    {age:"Neonate (0-28d)",hr:"120-160",rr:"30-60",sbp:"60-80",dbp:"30-50"},
    {age:"Infant (1-12m)",hr:"100-160",rr:"25-40",sbp:"70-90",dbp:"40-60"},
    {age:"Toddler (1-3y)",hr:"80-130",rr:"20-30",sbp:"80-100",dbp:"50-65"},
    {age:"Child (4-8y)",hr:"70-110",rr:"18-25",sbp:"85-110",dbp:"50-70"},
    {age:"School Age (9-12y)",hr:"65-110",rr:"16-22",sbp:"90-120",dbp:"55-75"},
    {age:"Teen (13-17y)",hr:"55-100",rr:"12-20",sbp:"100-130",dbp:"60-80"},
  ];
  if(!ok)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0e1a"}}><div style={{color:"#4ECDC4",fontSize:20}}>Loading Block Ward...</div></div>);
  if(view==="play"&&act)return <ScenarioPlayer sc={act} onExit={function(){setView("dash");setAct(null);}} onDone={done}/>;
  if(view==="build")return <Builder onDone={addC} onBack={function(){setView("dash");}}/>;
  return(<div style={{minHeight:"100dvh",padding:16,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)",color:"#fff",fontFamily:"'Nunito',sans-serif"}}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}.flt{animation:float 3s ease-in-out infinite}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fadeIn .5s ease-out both}button{transition:all .15s ease;min-height:44px;min-width:44px}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#1a1a3e}::-webkit-scrollbar-thumb{background:#4ECDC4;border-radius:3px}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}.si{animation:scaleIn .4s ease-out both}.bw-glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 24px rgba(0,0,0,0.12)}.bw-tap{transition:transform .12s ease,box-shadow .12s ease}.bw-tap:active{transform:scale(0.96)}"}</style>
    {/* Toast */}
    {shareMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"10px 20px",borderRadius:12,background:"rgba(78,205,196,0.95)",color:"#0a0e1a",fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{shareMsg}</div>}
    {/* Delete confirmation modal */}
    {delConfirm&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={function(){setDelConfirm(null);}}>
      <div style={{background:"#1a1a3e",borderRadius:16,padding:24,maxWidth:340,width:"100%",border:"2px solid rgba(255,71,87,0.3)"}} onClick={function(e){e.stopPropagation();}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Delete Scenario?</h3>
        <p style={{fontSize:13,color:"#999",marginBottom:4}}>{delConfirm.title}</p>
        <p style={{fontSize:12,color:"#FF6B81",marginBottom:20}}>This cannot be undone.</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={function(){setDelConfirm(null);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,255,255,0.1)",color:"#999",border:"none",cursor:"pointer"}}>Cancel</button>
          <button onClick={function(){delC(delConfirm.id);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,71,87,0.3)",color:"#FF6B81",border:"none",cursor:"pointer"}}>Delete</button>
        </div>
      </div>
    </div>}
    {/* Sidebar overlay */}
    {sidebar&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:997,display:"flex"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)"}} onClick={function(){setSidebar(false);}}></div>
      <div style={{position:"relative",width:320,maxWidth:"85vw",height:"100%",background:"#12152a",borderRight:"1px solid rgba(78,205,196,0.15)",overflowY:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:20,fontWeight:900,fontFamily:"'Fredoka',sans-serif"}}>Menu</h2>
          <button onClick={function(){setSidebar(false);}} style={{background:"none",border:"none",color:"#888",fontSize:20,cursor:"pointer"}}>X</button>
        </div>
        {/* Sidebar tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {[{k:"ref",l:"Reference"},{k:"stats",l:"My Stats"},{k:"settings",l:"Settings"}].map(function(t){return(
            <button key={t.k} onClick={function(){setSideTab(t.k);}} style={{flex:1,padding:"6px 0",borderRadius:8,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",background:sideTab===t.k?"rgba(78,205,196,0.2)":"rgba(255,255,255,0.05)",color:sideTab===t.k?"#4ECDC4":"#888"}}>{t.l}</button>
          );})}
        </div>
        {/* Quick Reference */}
        {sideTab==="ref"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Peds Vital Sign Ranges</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {vitalRef.map(function(r,i){return(
              <div key={i} style={{borderRadius:10,padding:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:4}}>{r.age}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,fontSize:10,color:"#999"}}>
                  <span>{"HR: "+r.hr}</span><span>{"RR: "+r.rr}</span>
                  <span>{"SBP: "+r.sbp}</span><span>{"DBP: "+r.dbp}</span>
                </div>
              </div>
            );})}
          </div>
          <div style={{marginTop:16,borderRadius:10,padding:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:6}}>Key Thresholds</div>
            <div style={{fontSize:10,color:"#999",lineHeight:1.6}}>
              <div>Cap Refill: normal &lt; 2-3 sec</div>
              <div>Hypoglycemia: &lt; 45 mg/dL (infant), &lt; 60 mg/dL (child)</div>
              <div>Lactate: normal 0.5-2.0 mmol/L, critical &gt; 4.0</div>
              <div>Hypotension (SBP): &lt; 70 + (age in years x 2)</div>
            </div>
          </div>
        </div>}
        {/* My Stats */}
        {sideTab==="stats"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Your Progress</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(78,205,196,0.1)"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#4ECDC4"}}>{nd}</div>
              <div style={{fontSize:10,color:"#999"}}>Completed</div>
            </div>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(165,94,234,0.1)"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#c4b5fd"}}>{totalAttempts}</div>
              <div style={{fontSize:10,color:"#999"}}>Total Attempts</div>
            </div>
            <div style={{borderRadius:10,padding:12,textAlign:"center",background:"rgba(0,184,148,0.1)",gridColumn:"1 / -1"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#00b894"}}>{avgScore>0?avgScore+"%":"--"}</div>
              <div style={{fontSize:10,color:"#999"}}>Average Best Score</div>
            </div>
          </div>
          <h4 style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:8}}>Per Scenario</h4>
          {allScenarios.map(function(s){var p=prog[s.id];if(!p)return null;return(
            <div key={s.id} style={{borderRadius:8,padding:8,marginBottom:4,background:"rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#ccc"}}>{s.icon+" "+s.title}</span>
              <span style={{fontSize:11,fontWeight:700,color:p.best>=0.8?"#00b894":p.best>=0.5?"#FECA57":"#FF6B81"}}>{Math.round(p.best*100)+"%"}</span>
            </div>
          );})}
        </div>}
        {/* Settings */}
        {sideTab==="settings"&&<div>
          <h3 style={{fontSize:14,fontWeight:700,color:"#4ECDC4",marginBottom:10}}>Settings</h3>
          <button onClick={function(){if(confirm("Clear all progress and custom scenarios? This cannot be undone.")){clearAll();setSidebar(false);}}} style={{width:"100%",padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:"#FF6B81",border:"none",cursor:"pointer",marginBottom:12}}>Clear All Data</button>
          <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>
            <p>Block Ward v1.6</p>
            <p style={{marginTop:4}}>Created by Sebastian J. Heredia</p>
            <p style={{marginTop:4}}>Powered by Claude (Anthropic)</p>
          </div>
        </div>}
      </div>
    </div>}
    <div className="bw-container" style={{maxWidth:480,margin:"0 auto"}}>
      {/* Header with hamburger */}
      <div className="fi" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,marginBottom:20}}>
        <button onClick={function(){setSidebar(true);}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
          <svg viewBox="0 0 24 24" style={{width:24,height:24}}><rect y="3" width="24" height="2.5" rx="1" fill="#888"/><rect y="10.5" width="24" height="2.5" rx="1" fill="#888"/><rect y="18" width="24" height="2.5" rx="1" fill="#888"/></svg>
        </button>
        <div style={{textAlign:"center"}}>
          <div className="flt" style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6}}><div style={{width:24,height:24,borderRadius:6,background:"#4ECDC4"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FF6B81"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#FECA57"}}></div><div style={{width:24,height:24,borderRadius:6,background:"#a55eea"}}></div></div>
          <h1 style={{fontSize:32,fontWeight:900,fontFamily:"'Fredoka',sans-serif",letterSpacing:-1}}>Block <span style={{color:"#4ECDC4"}}>Ward</span></h1>
          <p style={{fontSize:12,color:"#999",marginTop:2}}>Peds Emergency and Critical Medicine Clinical Simulator</p>
        </div>
        <div style={{width:24}}></div>
      </div>
      <div className="fi" style={{display:"flex",gap:12,marginBottom:24,animationDelay:".1s"}}>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(78,205,196,0.15),rgba(78,205,196,0.05))",border:"1px solid rgba(78,205,196,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#4ECDC4"}}>{nd}</div><div style={{fontSize:11,color:"#999"}}>Completed</div></div>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(165,94,234,0.15),rgba(165,94,234,0.05))",border:"1px solid rgba(165,94,234,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#c4b5fd"}}>{built.length+cust.length}</div><div style={{fontSize:11,color:"#999"}}>Scenarios</div></div>
        <div style={{flex:1,borderRadius:12,padding:12,textAlign:"center",background:"linear-gradient(135deg,rgba(255,107,129,0.15),rgba(255,107,129,0.05))",border:"1px solid rgba(255,107,129,0.3)"}}><div style={{fontSize:28,fontWeight:900,color:"#fda4af"}}>{cust.length}</div><div style={{fontSize:11,color:"#999"}}>Custom</div></div></div>
      <h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginBottom:12,animationDelay:".2s"}}>Core Scenarios</h2>
      {built.map(function(s,i){var p=prog[s.id];var isBuiltIn=["fussy-infant","vomiting-toddler","asthma-crisis"].indexOf(s.id)>=0;return(
        <button key={s.id} onClick={function(){play(s);}} className="fi bw-tap bw-glass" style={{width:"100%",textAlign:"left",borderRadius:16,padding:20,marginBottom:12,border:"2px solid rgba(78,205,196,0.2)",cursor:"pointer",color:"white",animationDelay:(0.25+i*0.05)+"s"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:32,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Tier "+s.tier}</span>{isBuiltIn&&<span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(0,200,100,0.15)",color:"#00c864"}}>Clinically Reviewed</span>}{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
            <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div></button>);})}
      {cust.length>0&&(<div><h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginTop:24,marginBottom:12}}>Custom Scenarios</h2>
        {cust.map(function(s,i){var p=prog[s.id];return(
          <div key={s.id||i} className="fi bw-glass bw-tap" style={{borderRadius:16,padding:16,marginBottom:12,border:"2px solid rgba(165,94,234,0.2)",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:28,flexShrink:0}}>{s.icon||"\u{1F3E5}"}</div><div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(165,94,234,0.3)",color:"#c4b5fd"}}>AI Generated</span>{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
              <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline||s.description}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={function(){play(s);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,color:"white",fontSize:13,background:"rgba(165,94,234,0.3)",border:"none",cursor:"pointer"}}>Play</button>
              <button onClick={function(){setDelConfirm(s);}} style={{padding:"10px 16px",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:"#FF6B81",border:"none",cursor:"pointer"}}>X</button></div></div>);})}</div>)}
      <button onClick={function(){setView("build");}} className="fi" style={{width:"100%",marginTop:24,padding:"16px 0",borderRadius:16,fontWeight:700,color:"white",fontSize:18,background:"linear-gradient(135deg,#a55eea,#8854d0)",boxShadow:"0 4px 20px rgba(165,94,234,0.3)",fontFamily:"'Fredoka',sans-serif",border:"none",cursor:"pointer",animationDelay:".3s"}}>Build Custom Scenario</button>
      <p style={{textAlign:"center",marginTop:24,paddingBottom:8,fontSize:11,color:"#444"}}>Block Ward v1.6</p>
      <p style={{textAlign:"center",paddingBottom:16,fontSize:10,color:"#555",letterSpacing:0.5}}>Experience created by: Sebastian J. Heredia</p>
    </div></div>);
}