// Built-in tools, meds, and scenarios. Extracted verbatim from App.jsx in phase-2 checkpoint 1.

export var TOOLS = {
  glucometer:{id:"glucometer",label:"Check Glucose",icon:"glucometer",desc:"Heel stick / fingerstick POC glucose"},
  stethoscope:{id:"stethoscope",label:"Auscultate",icon:"stethoscope",desc:"Listen to heart and lung sounds"},
  bvm:{id:"bvm",label:"Begin Bag-Mask Ventilation",icon:"bvm",desc:"Active manual ventilation via BVM at age-appropriate rate"},
  bvmReady:{id:"bvmReady",label:"Bring Bag-Mask to Bedside",icon:"bvm",desc:"Preparatory: have BVM ready, do not yet ventilate"},
  suction:{id:"suction",label:"Suction Airway",icon:"suction",desc:"Yankauer oropharyngeal suction"},
  o2mask:{id:"o2mask",label:"Apply O2 15L NRB",icon:"o2mask",desc:"Non-rebreather mask at 15 L/min"},
  ivKit:{id:"ivKit",label:"Establish or Confirm IV/IO Placement",icon:"ivKit",desc:"Peripheral IV or intraosseous access; confirm patency if already placed"},
  defib:{id:"defib",label:"Apply Defib Pads",icon:"defib",desc:"Defibrillator pads for monitoring or shock"},
  thermometer:{id:"thermometer",label:"Recheck Temp",icon:"thermometer",desc:"Recheck core temperature"},
  capRefill:{id:"capRefill",label:"Check Cap Refill",icon:"capRefill",desc:"Press nail bed 5 sec, count refill time"},
  needleDecomp:{id:"needleDecomp",label:"Needle Decompress",icon:"needleDecomp",desc:"14-16g angiocath at 2nd ICS midclavicular"},
  pupilCheck:{id:"pupilCheck",label:"Check Pupils",icon:"pupilCheck",desc:"Assess size, reactivity, symmetry"},
  epiPen:{id:"epiPen",label:"Give IM EpiPen",icon:"epiPen",desc:"IM epinephrine auto-injector to lateral thigh"},
  peakFlow:{id:"peakFlow",label:"Peak Flow Test",icon:"peakFlow",desc:"Measure peak expiratory flow rate"},
};
export var MEDS = {
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
  // Phase-2.6.3 change 2: trauma / massive transfusion meds.
  prbcWarmed:{id:"prbcWarmed",label:"Give Warmed pRBCs",color:"#c0392b",medType:"iv",desc:"10-15 mL/kg warmed packed red blood cells per MTP protocol"},
  ffp:{id:"ffp",label:"Give FFP",color:"#e67e22",medType:"iv",desc:"10-15 mL/kg fresh frozen plasma per MTP ratio (1:1:1 with pRBC and platelets)"},
  platelets:{id:"platelets",label:"Give Platelets",color:"#d35400",medType:"iv",desc:"10 mL/kg platelets per MTP ratio"},
  calciumChloride:{id:"calciumChloride",label:"Push Calcium Chloride IV",color:"#00cec9",medType:"push",desc:"10-20 mg/kg IV slow push for citrate toxicity in massive transfusion or symptomatic hypocalcemia"},
  txa:{id:"txa",label:"Give TXA IV",color:"#9b59b6",medType:"iv",desc:"15 mg/kg IV over 10 min within 3 hours of injury"},
  mtpActivate:{id:"mtpActivate",label:"Activate Pediatric MTP",color:"#e74c3c",medType:"protocol",desc:"Page blood bank, request pediatric massive transfusion protocol pack"},
};

export var SC1 = {
  id:"fussy-infant",title:"The Fussy Infant",tier:1,icon:"\u{1F476}",
  tagline:"6-month-old - Fussiness and Fever",
  description:"A 6-month-old male brought in for increasing fussiness and fever.",
  patient:{ageLabel:"6 months",weightKg:7.5,sex:"Male",cc:"Fussiness and fever x 12 hours",
    history:"Previously healthy. Decreased oral intake, fewer wet diapers today. No sick contacts. Immunizations up to date. Born full-term, no NICU stay."},
  emsReport:"EMS brought in a 6-month-old male for a 12-hour history of fever and fussiness. Mother reports two episodes of non-bloody emesis and decreased wet diapers. Acetaminophen was given approximately one hour ago. Field vitals showed HR 175 and rectal temp 39.1C. EMS established a 22g IV in the left hand with NS KVO.",
  learnMore:"Fever in infants under 3 months is treated urgently because of the risk of occult bacteremia and serious bacterial illness. Between 3-6 months, fever workup is guided by clinical appearance, immunization status, and focal findings. At 6 months, a well-appearing infant with a clear viral source may not need a full septic workup, but fussiness, feeding changes, and dehydration are red flags for deeper investigation.",
  norms:{hr:[100,160],rr:[25,40],sbp:[70,90],dbp:[40,60],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"EMS delivers a six-month-old male with a 12-hour history of fever and fussiness. He is previously healthy with no significant past medical history and immunizations are up to date. His mother reports two episodes of non-bloody emesis and decreased wet diapers since this morning. She administered acetaminophen approximately one hour ago. EMS established a 22-gauge IV in the left hand with a normal saline keep-open drip. Field vitals showed a heart rate of 175 and a rectal temperature of 39.1 degrees Celsius. On your initial assessment, the infant appears flushed and warm but is alert and consolable with a pacifier.",
      vitals:{hr:178,rr:42,sbp:72,dbp:45,spo2:98,temp:39.2,cap:2.5},
      signs:[
        {label:"Skin",finding:"Flushed, warm, generalized erythema",pos:"body",sys:"Integumentary",why:"Fever-induced cutaneous vasodilation carries heat to the skin surface for radiative cooling. Pyrogens reset the hypothalamic set point; the body compensates with peripheral dilation and sweating. Warm, pink, dry skin with fever suggests early warm septic shock - distinct from the cold, mottled skin of late decompensated shock."},
        {label:"Fontanelle",finding:"Flat and soft",pos:"head",sys:"Neuro",why:"A flat, soft anterior fontanelle in a febrile infant is a quick negative check for two dangerous possibilities: a bulging fontanelle would suggest meningitis or raised ICP, while a sunken fontanelle would suggest significant dehydration. Flat and soft means neither is currently present, but does not rule them out on re-assessment."},
        {label:"Mucous membranes",finding:"Moist",pos:"face",sys:"GI/Hydration"},
        {label:"Behavior",finding:"Irritable but consolable with pacifier",pos:"head",sys:"Neuro"},
        {label:"Heart sounds",finding:"Tachycardic, regular rhythm, no murmur, no gallop",pos:"body",sys:"Cardiovascular"},
        {label:"Lungs",finding:"Clear bilaterally, equal air entry, no crackles or wheeze",pos:"body",sys:"Respiratory"},
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
        {name:"WBC",value:"18.2",unit:"K/uL",ref:"6.0-17.5",critical:true,why:"Leukocytosis with elevated WBC indicates the bone marrow is releasing white cells in response to infection. The body is mounting an immune response, producing and deploying neutrophils to fight the invading pathogen."},
        {name:"Hgb",value:"11.8",unit:"g/dL",ref:"10.0-14.0",critical:false},
        {name:"Platelets",value:"245",unit:"K/uL",ref:"150-400",critical:false},
        {name:"Glucose",value:"72",unit:"mg/dL",ref:">45",critical:false},
        {name:"Na+",value:"138",unit:"mEq/L",ref:"135-145",critical:false},
        {name:"Lactate",value:"2.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Mildly elevated. Lactate rises when tissues switch to anaerobic metabolism due to inadequate oxygen delivery. At 2.8, this suggests early tissue hypoperfusion. Trending this value is critical - a rising lactate confirms worsening shock."},
        {name:"CRP",value:"8.4",unit:"mg/dL",ref:"<0.5",critical:true,why:"Markedly elevated C-reactive protein. CRP is an acute-phase reactant produced by the liver in response to IL-6 from macrophages during infection. A value this high in a 6-month-old strongly suggests significant bacterial infection rather than a simple viral illness."},
        {name:"Bands",value:"14%",unit:"",ref:"<5%",critical:true,why:"Bandemia (elevated band neutrophils) indicates a left shift - the bone marrow is releasing immature neutrophils into circulation because mature neutrophil demand exceeds supply. This is a hallmark of acute bacterial infection and suggests the immune system is under significant stress."},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Twenty minutes after antipyretic administration, the infant's temperature has decreased to 39.0 degrees Celsius. However, his clinical appearance has deteriorated noticeably. He is no longer tracking faces or reaching for objects and responds only sluggishly to tactile stimulation. His extremities are cool to the touch despite persistent core fever, and you observe a new reticular mottling pattern across both lower extremities that was not present on initial assessment. The charge nurse passes the bedside, pauses, and states that the infant does not look right. Your reassessment confirms a significant change from baseline.",
      vitals:{hr:192,rr:52,sbp:68,dbp:40,spo2:97,temp:39.0,cap:4},
      signs:[
        {label:"Mottling",finding:"Reticular purplish pattern, bilateral lower extremities",pos:"body",sys:"Integumentary",why:"Mottling reflects severe peripheral vasoconstriction as the body shunts blood from skin and muscle to preserve perfusion of vital organs. The reticular pattern appears when capillaries alternate between constriction and dilation under sympathetic overdrive. In a septic infant this is a late and ominous sign of decompensated shock."},
        {label:"Pulses",finding:"Weak and thready peripherally, central palpable",pos:"body",sys:"Cardiovascular",why:"Preserved central pulses with weak peripheral pulses is the hallmark of compensated-to-decompensated shock transition. Stroke volume is dropping; the body prioritizes brain and heart at the expense of extremities. Loss of central pulses is imminent arrest."},
        {label:"Mental status",finding:"Sluggish to voice, not tracking faces",pos:"head",sys:"Neuro"},
        {label:"Extremities",finding:"Cool and clammy hands and feet",pos:"body",sys:"Cardiovascular",why:"Cool clammy extremities with a febrile core signals cold septic shock. The sympathetic nervous system clamps down peripheral vessels to redirect flow centrally. Capillary refill lengthens, skin feels cold distal to warm proximal - this gradient marks the perfusion boundary."},
        {label:"Abdomen",finding:"Soft, hypoactive bowel sounds",pos:"body",sys:"GI"},
        {label:"Urine output",finding:"One concentrated diaper in six hours",pos:"body",sys:"Renal"},
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
        {name:"WBC",value:"22.4",unit:"K/uL",ref:"6.0-17.5",critical:true,why:"Rising from 18.2 - the infection is progressing and the bone marrow is working harder. Worsening leukocytosis in sepsis correlates with increasing bacterial burden and inflammatory response."},
        {name:"Lactate",value:"5.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Doubled from 2.8 to 5.8. Cells are starving for oxygen and generating lactate through anaerobic glycolysis. Above 4 mmol/L in pediatric sepsis is associated with significantly increased mortality and indicates severe tissue hypoperfusion requiring aggressive fluid resuscitation."},
        {name:"Glucose",value:"48",unit:"mg/dL",ref:">45",critical:true,why:"Borderline low and dropping from 72. Glycogen stores are depleting rapidly under the metabolic stress of sepsis. If this falls below 45, neuronal function fails and seizure risk skyrockets. Must be monitored closely and treated immediately if it drops further."},
        {name:"Na+",value:"136",unit:"mEq/L",ref:"135-145",critical:false},
        {name:"K+",value:"4.2",unit:"mEq/L",ref:"3.5-5.5",critical:false},
        {name:"pH",value:"7.24",unit:"",ref:"7.35-7.45",critical:true,why:"Acidotic. The accumulating lactate from anaerobic metabolism is driving the pH down. A pH below 7.25 indicates severe metabolic acidosis. The body attempts to compensate by increasing respiratory rate (blowing off CO2), which is why this infant is tachypneic at 52/min."},
        {name:"HCO3-",value:"14",unit:"mEq/L",ref:"22-26",critical:true,why:"Low bicarbonate confirms metabolic acidosis. Bicarb is being consumed as it buffers the excess hydrogen ions from lactic acid production. The base deficit of -12 tells you how much bicarb has been used up."},
        {name:"Base deficit",value:"-12",unit:"",ref:"-2 to +2",critical:true,why:"Severely negative. Base deficit quantifies the total acid load the body is carrying. A value of -12 means the body has consumed 12 mEq/L of buffer capacity trying to neutralize the acid produced by poor perfusion. This correlates directly with the severity and duration of tissue oxygen debt."},
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
      {label:"Motor",finding:"Generalized tonic-clonic activity, all extremities",pos:"body"},
      {label:"Cyanosis",finding:"Perioral and circumoral, dusky blue",pos:"face"},
      {label:"Breathing",finding:"Apneic pauses between tonic-clonic phases",pos:"body"},
      {label:"Eyes",finding:"Deviated upward and to the right, pupils dilated",pos:"head"},
    ],
    labs:[
      {name:"Glucose",value:"32",unit:"mg/dL",ref:">45",critical:true,why:"Critically low. This is the most likely cause of the seizure. Glycogen stores are exhausted and the brain has lost its primary fuel source. Neurons cannot generate ATP, the Na/K pump fails, membranes depolarize, and seizure results. D10W 2-4 mL/kg is potentially curative."},
      {name:"Lactate",value:"8.1",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Severely elevated from 5.8 - the seizure itself is generating massive lactate. Sustained muscle contraction during tonic-clonic activity is entirely anaerobic. Combined with the ongoing septic shock, tissue oxygen debt is now critical."},
      {name:"pH",value:"7.18",unit:"",ref:"7.35-7.45",critical:true,why:"Worsening acidosis. Both the seizure (lactic acid from muscle) and the shock (lactic acid from tissue hypoperfusion) are driving the pH down. Below 7.20, cardiac contractility begins to decline and catecholamines become less effective."},
      {name:"pO2",value:"48",unit:"mmHg",ref:"80-100",critical:true,why:"Severely hypoxic. Corresponds to the SpO2 of 83%. The infant is not ventilating effectively during the seizure because the respiratory muscles are contracting with everything else. The brain is seizing AND hypoxic simultaneously - a double insult."},
    ],
    tools:["suction","o2mask","bvmReady","glucometer","stethoscope","defib"],
    meds:["lorazepam","phenytoin","dextrose","epinephrine","nsBolus","atropine"],
    actions:{tools:{
      suction:{ok:true,pri:1,fb:"Protect the airway first. Seizing infant has lost gag, cough, and swallow reflexes. High aspiration risk from salivation and vomiting. Use Yankauer catheter for oropharyngeal suction. Avoid deep flexible catheter suctioning - stimulates vagus nerve, can trigger bradycardia."},
      o2mask:{ok:true,pri:2,fb:"SpO2 83% = PaO2 approximately 48 mmHg, severely hypoxic. Apply non-rebreather at 10-15 L/min (delivers 60-80% FiO2). The seizing brain has massively increased O2 demand while ventilation is impaired. Hypoxic brain injury begins within 4-6 minutes."},
      bvmReady:{ok:true,pri:null,fb:"Have BVM staged at the bedside. Do NOT ventilate during the tonic phase when the glottis is contracted - bagging then drives air into the stomach. Be ready to deliver gentle breaths during clonic relaxation phases only if SpO2 falls further. Avoid over-bagging - causes gastric distension and increased aspiration risk."},
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
  reassessment:{
    narrative:"Forty minutes after the first fluid bolus and the initiation of antibiotics, the infant's clinical trajectory has reversed. Heart rate has come down from 192 to 150, capillary refill is now less than 2 seconds, and the mottling on the lower extremities has resolved. He is tracking faces again and reaching for his pacifier. The mother, who was holding his hand during the resuscitation, notices him squeeze back.",
    vitals:{hr:150,rr:36,sbp:84,dbp:52,spo2:99,temp:38.1,cap:2},
    signs:[
      {label:"Perfusion",finding:"Warm pink extremities, cap refill <2s",pos:"body",sys:"Cardiovascular"},
      {label:"Mental status",finding:"Tracking faces, reaching for pacifier",pos:"head",sys:"Neuro"},
      {label:"Skin",finding:"Mottling resolved, no new rash",pos:"body",sys:"Integumentary"},
    ]
  },
  stabilizationSummary:"Aggressive isotonic fluid resuscitation restored circulating volume and tissue perfusion. Broad-spectrum antibiotics targeted the underlying bacterial source before cultures returned. Dextrose corrected hypoglycemia and protected cortical function while the metabolic acidosis resolved.",
  debrief:{
    summary:"You identified septic shock by recognizing HR-temperature dissociation, initiated resuscitation, and managed an unexpected seizure.",
    explainers:[
      {title:"HR-Temperature Dissociation",content:"In infants, cardiac output is calculated as heart rate multiplied by stroke volume. Unlike older children and adults who can increase stroke volume by augmenting contractility and preload utilization, infants have a relatively fixed stroke volume because their immature myocardium contains fewer contractile elements (sarcomeres), has lower ventricular compliance, and operates near the top of its Frank-Starling curve at baseline. This means infants are fundamentally rate-dependent for cardiac output. During fever, the expected heart rate increase is approximately 10 beats per minute for each 1 degree Celsius above 37. This thermoregulatory tachycardia is driven by increased metabolic oxygen demand: fever raises the basal metabolic rate by roughly 10-13% per degree Celsius via accelerated enzymatic reactions, requiring proportionally more oxygen delivery. When an antipyretic is administered and the temperature decreases, you would expect the heart rate to decrease proportionally. If instead the temperature falls but the heart rate rises or remains disproportionately elevated, the tachycardia is no longer thermoregulatory. It is now driven by the sympathetic nervous system compensating for a different problem, most commonly hypovolemia or vasodilation from sepsis. The adrenal medulla releases epinephrine and norepinephrine in response to baroreceptor sensing of decreased arterial stretch (reduced circulating volume), which directly stimulates beta-1 adrenergic receptors on the sinoatrial node to increase firing rate. This HR-temperature dissociation is one of the earliest and most reliable clinical indicators of septic shock in febrile infants.",tldr:"Infant hearts depend on rate, not squeeze strength, for output. Fever raises HR predictably (~10 bpm per degree). If temp goes down but HR goes up, the tachycardia is from shock, not fever."},
      {title:"Why Children Maintain BP Until Collapse",content:"Pediatric patients have proportionally larger adrenal glands relative to body size compared to adults, and their sympathetic nervous system is highly reactive. When cardiac output falls from any cause (hypovolemia, sepsis, cardiogenic), baroreceptors in the carotid sinus and aortic arch detect reduced arterial wall stretch and trigger a massive sympathetic discharge. This produces intense peripheral vasoconstriction through alpha-1 adrenergic receptor activation on arteriolar smooth muscle, which increases systemic vascular resistance (SVR) and maintains mean arterial pressure (MAP = CO x SVR). Because MAP is maintained, the blood pressure reading on the monitor appears reassuringly normal even as tissue perfusion is deteriorating. The clinical signs that betray this compensated state are the perfusion markers: capillary refill time prolongs because arteriolar constriction throttles inflow to the capillary beds; skin becomes mottled as dermal blood flow becomes patchy; extremities cool as blood is shunted away from the periphery; mental status declines as cerebral autoregulation approaches its lower limit; and urine output falls as renal perfusion drops below the threshold for adequate glomerular filtration. These signs change well before blood pressure drops. When BP finally does fall, it indicates that the compensatory mechanisms have been exhausted. Catecholamine stores in the adrenal medulla are depleted, SVR can no longer be maintained, and the patient transitions abruptly from compensated to decompensated shock. In children this transition is often described as falling off a cliff because it is sudden rather than gradual. Hypotension in a child is a pre-arrest sign representing loss of approximately 25-30% of circulating blood volume.",tldr:"Kids vasoconstrict aggressively to maintain BP. Cap refill, skin color, and mental status change way before BP drops. When BP finally falls, they have lost 25-30% of their blood volume and are about to arrest."},
      {title:"Infant Glucose Vulnerability",content:"The metabolic vulnerability of infants to hypoglycemia stems from a fundamental mismatch between glucose demand and storage capacity. Hepatic glycogen in a full-term neonate is approximately 5% of liver weight, yielding roughly 3-4 grams of total glycogen storage. Adults store 70-100 grams. Meanwhile, the infant brain, which constitutes 10-12% of total body weight (versus 2% in adults), consumes approximately 60% of total glucose production through obligate aerobic glycolysis. Under normal fasting conditions, these glycogen stores provide approximately 4-8 hours of glucose supply at the basal utilization rate of 4-6 mg/kg/min. Any condition that increases metabolic demand (fever, sepsis, seizures, cold stress) or impairs intake (vomiting, NPO status) accelerates depletion. Sepsis is particularly dangerous because it simultaneously increases demand (activated immune cells consume glucose at high rates, and catecholamine-driven glycogenolysis rapidly exhausts stores) and impairs the compensatory gluconeogenic response (sepsis-associated hepatic dysfunction reduces the liver's ability to synthesize new glucose from lactate, amino acids, and glycerol). The immature expression of gluconeogenic enzymes (phosphoenolpyruvate carboxykinase, fructose-1,6-bisphosphatase, and glucose-6-phosphatase) further limits this backup pathway. When serum glucose falls below the critical threshold of 45 mg/dL, neuronal mitochondrial ATP production collapses. The Na/K ATPase pump, which consumes roughly half of all neuronal ATP, fails first. Sodium leaks into the cell, the membrane depolarizes, voltage-gated calcium channels open, and the resulting calcium influx triggers both seizure activity and excitotoxic cascades (calpain activation, mitochondrial membrane permeabilization, and caspase-mediated apoptosis). Treatment is D10W at 2-4 mL/kg IV push. D10 (100 mg/mL) is preferred over D25 or D50 in infants because higher-concentration dextrose solutions are hyperosmolar and cause endothelial damage, phlebitis, and tissue necrosis. The goal is a glucose delivery of 200-400 mg/kg, which typically raises serum glucose by 60-120 mg/dL.",tldr:"Babies have almost no glucose reserves (3-4g vs 70-100g in adults) and their brains consume most of it. Sepsis burns through it fast. Below 45 mg/dL = seizures. Check glucose on every sick infant."},
    ],
  },
};
export var SC2 = {
  id:"vomiting-toddler",title:"Won't Stop Vomiting",tier:2,icon:"\u{1F922}",
  tagline:"2-year-old - Vomiting and Lethargy",
  description:"A 2-year-old with 3 days of vomiting and diarrhea, increasingly lethargic.",
  patient:{ageLabel:"2 years",weightKg:12,sex:"Male",cc:"Vomiting/diarrhea x 3 days, lethargy",
    history:"Marcus has been sick for three days. Started with watery diarrhea, then vomiting everything including Pedialyte. His mom says he had one wet diaper in the last 12 hours and is sleeping way more than usual. No fever. Previously healthy, no medications."},
  emsReport:"Private vehicle arrival. 2-year-old male with 3 days of vomiting and watery diarrhea, unable to tolerate oral rehydration. Mother reports one wet diaper in the past 24 hours (normally 6-7). No fever, no blood in stool, no sick contacts. Arrived limp and lethargic in mother's arms. No prehospital interventions.",
  learnMore:"Pediatric dehydration severity is classified by percent volume loss: mild (3-5%), moderate (6-9%), and severe (>10%). Each category corresponds to a cluster of clinical findings - tachycardia and dry mucous membranes appear early, sunken fontanelle and skin tenting indicate moderate loss, and delayed cap refill with altered mental status signals severe depletion. Treatment is guided by this severity classification: oral rehydration for mild, IV bolus for moderate, and aggressive resuscitation for severe.",
  norms:{hr:[80,130],rr:[20,30],sbp:[80,100],dbp:[50,65],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"You receive report on a two-year-old male named Marcus presenting with a three-day history of vomiting and watery diarrhea. His mother has attempted oral rehydration with Pedialyte but he has been unable to tolerate any oral intake. She reports only one wet diaper in the past 24 hours compared to his usual six to seven per day. He has no fever, no blood in the stool, and no known sick contacts. His weight on arrival is 12 kilograms. On initial assessment, the child is limp and lethargic in his mother's arms, opening his eyes briefly to voice but not reaching or engaging. His lips are dry and cracked, and the anterior fontanelle is visibly sunken.",
      vitals:{hr:155,rr:30,sbp:88,dbp:58,spo2:99,temp:36.8,cap:3},
      signs:[
        {label:"Skin turgor",finding:"Tenting on abdomen, >2 seconds recoil",pos:"body",sys:"Integumentary",why:"Skin turgor reflects interstitial fluid volume. When you pinch well-hydrated skin it snaps back immediately because the dermis is plump with water. A tent that persists more than 2 seconds indicates at least 5-10% total body water loss. This is a late sign - meaningful tenting in a toddler usually means moderate to severe dehydration."},
        {label:"Fontanelle",finding:"Anterior fontanelle sunken",pos:"head",sys:"Neuro",why:"A sunken anterior fontanelle indicates reduced intracranial CSF volume, which tracks with systemic dehydration. At this age the fontanelle is a direct window into volume status that you lose access to once it closes (typically 12-18 months). A sunken fontanelle suggests at least 5% dehydration, often more."},
        {label:"Mucous membranes",finding:"Dry, tacky lips and tongue",pos:"face",sys:"GI/Hydration"},
        {label:"Behavior",finding:"Lethargic, arousable to voice briefly",pos:"head",sys:"Neuro"},
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
        {name:"K+",value:"2.9",unit:"mEq/L",ref:"3.5-5.5",critical:true,why:"Low from GI losses. Gastric fluid contains potassium, and the kidneys worsen it by excreting K+ to retain H+ during alkalosis. Below 3.0, ECG changes begin (flattened T waves, U waves). Below 2.5, arrhythmia risk is high."},
        {name:"Cl-",value:"88",unit:"mEq/L",ref:"98-106",critical:true,why:"Low from loss of gastric HCl. Hypochloremia triggers the kidneys to retain bicarbonate (because Cl- and HCO3- are exchanged in the renal tubule), worsening the metabolic alkalosis."},
        {name:"CO2",value:"30",unit:"mEq/L",ref:"20-28",critical:true,why:"Elevated total CO2 (bicarbonate) confirms metabolic alkalosis. The body is retaining bicarb to compensate for the massive H+ losses from vomiting. This alkalosis drives further potassium wasting through the kidney."},
        {name:"BUN",value:"32",unit:"mg/dL",ref:"5-18",critical:true,why:"Elevated BUN with BUN/Cr ratio >20 indicates pre-renal azotemia. Reduced kidney perfusion from dehydration causes increased urea reabsorption in the proximal tubule. The kidneys are not damaged - they are underperfused."},
        {name:"Cr",value:"0.5",unit:"mg/dL",ref:"0.2-0.4",critical:true,why:"Mildly elevated for a 2-year-old. GFR is declining from reduced renal blood flow. This is still pre-renal but approaching the threshold where acute kidney injury may develop if perfusion is not restored."},
        {name:"Glucose",value:"68",unit:"mg/dL",ref:"60-100",critical:false},
        {name:"Lactate",value:"3.2",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Mildly elevated. Tissue perfusion is compromised enough that some cells are switching to anaerobic metabolism. This confirms the cap refill and mental status findings - this child is in compensated shock."},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Peripheral IV access was obtained on the second attempt due to poor venous filling from dehydration. Twenty minutes into admission, your reassessment reveals clinical deterioration. The child's hands and feet are now cold to the touch with a capillary refill time exceeding five seconds. You observe mottling extending from the knees distally in a reticular pattern. He responds only to painful stimulation with a weak grimace and withdrawal. His eyes are open but unfocused with no purposeful gaze. This represents a significant decline from his arrival status and suggests progression from compensated to decompensated hypovolemic shock.",
      vitals:{hr:172,rr:38,sbp:82,dbp:56,spo2:98,temp:36.6,cap:5},
      signs:[
        {label:"Mottling",finding:"Reticular pattern, knees and elbows bilaterally",pos:"body",sys:"Integumentary",why:"Reticular mottling at the knees and elbows marks the perfusion boundary - proximal skin is still being perfused while distal skin is not. As shock progresses this boundary migrates centrally. When mottling reaches mid-thigh, cardiac arrest is often minutes away."},
        {label:"Urine output",finding:"No urine output in 14 hours",pos:"body",sys:"Renal",why:"Anuria in a child with a fluid deficit reflects renin-angiotensin activation preserving plasma volume at the cost of renal output. GFR drops as renal arterioles constrict. Prolonged hypoperfusion converts pre-renal azotemia into acute tubular necrosis - reversible now, but not indefinitely."},
        {label:"Mental status",finding:"Responds to pain only, weak grimace",pos:"head",sys:"Neuro",why:"AVPU status of P (pain) in a previously alert child signals inadequate cerebral perfusion. The brain autoregulates until MAP drops below about 50 mmHg in a toddler. Once that threshold fails, consciousness deteriorates rapidly. This is a trajectory marker for imminent decompensation."},
        {label:"Extremities",finding:"Cool, clammy, pale",pos:"body",sys:"Cardiovascular"},
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
        {name:"K+",value:"2.1",unit:"mEq/L",ref:"3.5-5.5",critical:true,why:"Critically low and worsening. At this level, the cardiac myocyte resting membrane potential is destabilized. The cell becomes hyperexcitable and prone to spontaneous depolarization, creating the substrate for ventricular tachycardia and torsades de pointes."},
        {name:"Cl-",value:"82",unit:"mEq/L",ref:"98-106",critical:true,why:"Worsening hypochloremia. Ongoing gastric losses continue to deplete chloride. The kidney cannot correct the alkalosis without adequate chloride for exchange in the collecting duct."},
        {name:"CO2",value:"34",unit:"mEq/L",ref:"20-28",critical:true,why:"Worsening alkalosis. Bicarb continues to climb as H+ losses continue. The alkalosis itself drives further K+ wasting - a vicious cycle that will continue until volume and chloride are replaced."},
        {name:"BUN",value:"38",unit:"mg/dL",ref:"5-18",critical:true,why:"Rising from 32. Renal perfusion is declining further as the child progresses from compensated to decompensated shock. Without fluid resuscitation, acute kidney injury will follow."},
        {name:"Cr",value:"0.7",unit:"mg/dL",ref:"0.2-0.4",critical:true,why:"Now clearly elevated. The kidneys are being injured by sustained hypoperfusion. Oliguria (no urine in 14 hours) confirms inadequate renal blood flow."},
        {name:"Lactate",value:"6.4",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Doubled from 3.2. The child is transitioning from compensated to decompensated shock. Tissue oxygen debt is accumulating rapidly. Above 4 in pediatric shock correlates with significantly increased mortality."},
        {name:"Glucose",value:"54",unit:"mg/dL",ref:"60-100",critical:true,why:"Dropping. Glycogen stores are depleting from prolonged fasting and metabolic stress. Approaching the threshold where neuronal function may be impaired. Needs monitoring and likely dextrose supplementation."},
        {name:"Mg2+",value:"1.4",unit:"mg/dL",ref:"1.7-2.2",critical:true,why:"Low magnesium accompanies prolonged vomiting. Magnesium depletion makes it harder to correct potassium because Mg2+ is required for the Na/K ATPase pump to retain potassium intracellularly. Must replace Mg2+ to effectively correct K+."},
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
      {label:"Rhythm",finding:"Wide-complex tachycardia at 220 bpm, QRS >0.09s, no P waves",pos:"body"},
      {label:"Perfusion",finding:"Pale, diaphoretic, thready pulses",pos:"body"},
      {label:"Mental status",finding:"Eyes rolling back, barely responsive",pos:"head"},
      {label:"Color",finding:"Ashen gray",pos:"face"},
    ],
    labs:[
      {name:"K+",value:"1.8",unit:"mEq/L",ref:"3.5-5.5",critical:true,why:"Critically low - this is the cause of the arrhythmia. At K+ 1.8, the myocyte resting membrane potential has shifted from -90mV toward -70mV. The cell is partially depolarized and hyperexcitable, generating the wide-complex tachycardia you see on the monitor."},
      {name:"Mg2+",value:"1.2",unit:"mg/dL",ref:"1.7-2.2",critical:true,why:"Low magnesium makes the arrhythmia harder to treat. Mg2+ stabilizes the cardiac membrane independent of K+ levels. IV magnesium 25-50 mg/kg should be given alongside potassium replacement."},
      {name:"iCa2+",value:"0.98",unit:"mmol/L",ref:"1.12-1.32",critical:true,why:"Low ionized calcium from the alkalosis. Alkalemia increases protein binding of calcium, reducing the free (ionized) fraction. Low iCa2+ further destabilizes cardiac conduction and can prolong the QT interval."},
      {name:"pH",value:"7.52",unit:"",ref:"7.35-7.45",critical:true,why:"Significantly alkalotic from ongoing gastric H+ losses. The alkalosis is driving the hypokalemia (kidneys waste K+ to retain H+) and the hypocalcemia (alkalemia increases Ca2+ protein binding). Fixing the pH helps fix the electrolytes."},
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
  reassessment:{
    narrative:"After two 20 mL/kg boluses and potassium replacement, the child's perfusion and mental status have returned. Heart rate is down to 130, cap refill is 2 seconds, and his hands are warm to the touch. He has produced a small amount of concentrated urine, signaling that renal blood flow is recovering. He opens his eyes to voice and reaches for his mother's necklace.",
    vitals:{hr:130,rr:26,sbp:94,dbp:60,spo2:99,temp:36.9,cap:2},
    signs:[
      {label:"Perfusion",finding:"Warm extremities, cap refill 2s",pos:"body",sys:"Cardiovascular"},
      {label:"Urine",finding:"Small concentrated void noted",pos:"body",sys:"Renal"},
      {label:"Mental status",finding:"Alert, reaching for mother",pos:"head",sys:"Neuro"},
    ]
  },
  stabilizationSummary:"Repeated normal saline boluses restored circulating volume and reversed compensated hypovolemic shock. Potassium and magnesium replacement corrected the electrolyte derangement that triggered the arrhythmia, eliminating recurrence risk. Early recognition of the vomiting-hypokalemia-VT chain prevented the scenario from becoming a cardiac arrest.",
  debrief:{
    summary:"You recognized compensated hypovolemic shock in a dehydrated toddler, initiated fluid resuscitation, and identified a wide-complex tachycardia caused by electrolyte derangement from prolonged vomiting. Root cause thinking - connecting the vomiting to hypokalemia to arrhythmia - was the critical skill tested.",
    explainers:[
      {title:"The Pediatric Shock Cliff",content:"Unlike adults who gradually decompensate, children have a binary-like transition. Their massive sympathetic reserve maintains perfusion until suddenly it doesn't. When catecholamine stores deplete and SVR collapses, BP crashes precipitously. Cap refill going from 3s to 5s is the warning. The next step is cardiovascular collapse with bradycardia - a pre-arrest rhythm in a child who was tachycardic.",tldr:"Kids compensate hard then crash suddenly. Worsening cap refill is the warning sign. Bradycardia in a previously tachycardic child means arrest is imminent."},
      {title:"Vomiting-Induced Metabolic Cascade",content:"Gastric fluid contains H+, Cl-, K+, and Na+. Losing it creates: (1) Metabolic alkalosis from H+ loss, (2) Hypochloremia triggering renal Cl- retention and HCO3- retention, (3) Hypokalemia from both direct loss and renal K+ wasting as kidneys try to retain H+. The kidneys exchange K+ for H+ in the collecting duct, worsening K+ depletion. Below K+ 3.0, ECG changes appear (flattened T waves, U waves). Below 2.5, arrhythmia risk skyrockets.",tldr:"Vomiting loses H+, Cl-, and K+. The kidneys make it worse by dumping more K+ to save H+. Below K+ 2.5, the heart becomes electrically unstable."},
      {title:"Electrolyte-Driven Arrhythmias in Children",content:"Hypokalemia shifts the myocyte resting potential from -90mV toward -70mV. This partial depolarization makes the cell easier to excite but harder to repolarize normally. The result: prolonged QT interval, increased automaticity, and re-entry circuits that generate VT. Torsades de pointes (polymorphic VT with twisting axis) is the classic hypokalemia arrhythmia. Treatment: IV potassium replacement AND IV magnesium (which stabilizes the cardiac membrane independent of K+ levels). Monitor on telemetry during replacement.",tldr:"Low potassium partially depolarizes heart cells, making them fire when they should not. Replace potassium AND magnesium, and keep the patient on a monitor while you do it."},
    ],
  },
};
export var SC3 = {
  id:"asthma-crisis",title:"Can't Catch My Breath",tier:2,icon:"\u{1FAC1}",
  tagline:"8-year-old - Severe Asthma Exacerbation",
  description:"An 8-year-old known asthmatic with worsening wheeze unresponsive to home treatment.",
  patient:{ageLabel:"8 years",weightKg:25,sex:"Female",cc:"Worsening wheeze x 2 days, albuterol not helping",
    history:"Sophia is a known asthmatic who uses an albuterol inhaler PRN. Her mom says she has been wheezing for two days after a cold. She has used her inhaler 8 times today with no improvement. No prior ICU admissions but two ED visits in the past year. Takes no controller medications. Family history of asthma. Allergic to dust mites."},
  emsReport:"Walk-in triage. 8-year-old female with known asthma, wheezing progressively for 2 days after a cold. Mother reports 8 doses of home albuterol MDI today without relief. Arrived tripoding at the doorway with audible expiratory wheeze and speaking in 2-3 word phrases. No controller medications. Prior ED visits twice in the past year, no ICU history.",
  learnMore:"Pediatric status asthmaticus is acute severe asthma that does not respond adequately to standard bronchodilator therapy. Clinical severity correlates with air movement rather than wheeze loudness: a quiet chest in severe asthma is more concerning than loud wheeze. Key decision points are whether to continue inhaled therapy alone, add IV magnesium or terbutaline, initiate non-invasive ventilation, or proceed to intubation. Rising pCO2 in the face of treatment is the most reliable indicator that respiratory failure is imminent.",
  norms:{hr:[70,110],rr:[18,25],sbp:[90,115],dbp:[55,70],spo2:[95,100],temp:[36.5,37.5]},
  phases:[
    {id:"triage",name:"Triage",
      narrative:"An eight-year-old female named Sophia presents with a two-day history of worsening wheezing in the setting of a known asthma diagnosis. She has no controller medications and has visited the emergency department twice in the past year for exacerbations. Her mother reports that Sophia left soccer practice early two days ago due to persistent coughing, and today has used her albuterol metered-dose inhaler approximately eight times without meaningful relief. On arrival, Sophia is sitting upright in a tripod position with audible expiratory wheezing heard from the doorway. She is only able to speak in two- to three-word phrases between labored breaths, and you observe significant intercostal and subcostal retractions with each respiratory cycle.",
      vitals:{hr:132,rr:36,sbp:108,dbp:68,spo2:93,temp:37.4,cap:2},
      signs:[
        {label:"Breathing pattern",finding:"Tripoding, intercostal and subcostal retractions, accessory muscle use",pos:"body",sys:"Respiratory",why:"Tripoding fixes the shoulder girdle so accessory muscles (scalenes, sternocleidomastoids, pecs) can assist with inspiration. Retractions appear because high negative intrathoracic pressure sucks in compliant chest wall soft tissues when airway resistance is high. These two findings together tell you the diaphragm alone cannot move enough air - this is severe obstructive distress."},
        {label:"Wheeze",finding:"Audible expiratory wheeze from doorway",pos:"body",sys:"Respiratory",why:"Audible wheeze (no stethoscope needed) indicates high-velocity turbulent airflow through narrowed bronchi. Wheeze volume correlates loosely with airflow, not severity - a 'quiet' chest in severe asthma is worse than loud wheeze, because it means air is not moving at all. Expiratory-only wheeze means obstruction is intrathoracic."},
        {label:"Speech",finding:"2-3 word phrases only",pos:"face",sys:"Respiratory",why:"Speech length is a bedside functional measure of tidal volume reserve. A healthy child speaks a full sentence per breath. 2-3 word phrases means tidal volume is so compromised that the child cannot spare air for more than a short burst of speech. Progression to single words or silence is impending respiratory failure."},
        {label:"Skin",finding:"Mildly diaphoretic",pos:"body",sys:"Integumentary"},
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
        {name:"pCO2",value:"48",unit:"mmHg",ref:"35-45",critical:true,why:"This is the most important lab in this scenario. In acute asthma, pCO2 should be LOW because the patient is hyperventilating. A normal or rising pCO2 means ventilation is failing to keep up with CO2 production - the respiratory muscles are tiring. This is an ominous sign that respiratory failure is approaching."},
        {name:"pO2",value:"65",unit:"mmHg",ref:"80-100",critical:true,why:"Moderately low. Corresponds to the SpO2 of 93%. Air trapping is creating V/Q mismatch - some alveoli are hyperinflated and poorly perfused while others are underventilated. The result is impaired gas exchange."},
        {name:"HCO3-",value:"26",unit:"mEq/L",ref:"22-26",critical:false},
        {name:"K+",value:"3.8",unit:"mEq/L",ref:"3.5-5.5",critical:false},
        {name:"Glucose",value:"142",unit:"mg/dL",ref:"60-100",critical:true,why:"Stress hyperglycemia. The catecholamine surge from severe respiratory distress drives glycogenolysis and gluconeogenesis. Cortisol release from the stress response further raises blood sugar. This is expected and does not require insulin - it will resolve when the respiratory crisis resolves."},
        {name:"WBC",value:"12.4",unit:"K/uL",ref:"5.0-14.5",critical:false},
        {name:"Lactate",value:"1.8",unit:"mmol/L",ref:"0.5-2.0",critical:false},
      ],
      tools:null,meds:null,actions:null},
    {id:"escalation",name:"Escalation",
      narrative:"Thirty minutes into aggressive treatment including continuous nebulized albuterol, ipratropium bromide, and intravenous methylprednisolone, Sophia's clinical status has not improved. She has stopped actively tripoding and is slumping forward with her arms at her sides, indicating respiratory muscle fatigue. The audible wheeze has become quieter, which in this context represents decreased air movement rather than clinical improvement. You observe worsening suprasternal, intercostal, and subcostal retractions with visible nasal flaring. The respiratory therapist notes that she appears to be tiring. Her oxygen saturation has drifted downward from 93 percent to 90 percent despite supplemental oxygen at four liters per minute via nasal cannula.",
      vitals:{hr:145,rr:42,sbp:112,dbp:70,spo2:90,temp:37.4,cap:2},
      labs:[
        {name:"pH",value:"7.32",unit:"",ref:"7.35-7.45",critical:true,why:"Now acidotic. The rising pCO2 is overwhelming the bicarb buffer. This is respiratory acidosis from ventilatory failure - the respiratory muscles can no longer blow off CO2 fast enough. Acidosis further impairs muscle function, creating a downward spiral."},
        {name:"pCO2",value:"56",unit:"mmHg",ref:"35-45",critical:true,why:"Rising from 48 to 56 despite treatment. This confirms respiratory failure is progressing. The diaphragm and intercostal muscles are fatiguing. If pCO2 continues to climb, the patient will need mechanical ventilation. Intubation in severe asthma is high-risk due to hyperinflation."},
        {name:"pO2",value:"58",unit:"mmHg",ref:"80-100",critical:true,why:"Worsening. At PaO2 58, we are at the steep part of the oxyhemoglobin dissociation curve. The SpO2 of 90% is right at the cliff edge. Small further drops in PaO2 will cause the saturation to plummet."},
        {name:"Lactate",value:"2.8",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Rising from 1.8. The respiratory muscles are consuming enormous amounts of oxygen - up to 40% of total cardiac output in severe asthma. They are beginning to generate lactate from the extreme workload, even though systemic perfusion is still maintained."},
        {name:"Glucose",value:"168",unit:"mg/dL",ref:"60-100",critical:true,why:"Persistent stress hyperglycemia. The ongoing catecholamine and cortisol release keeps driving glucose production. This is a marker of physiologic stress severity, not diabetes."},
        {name:"K+",value:"3.4",unit:"mEq/L",ref:"3.5-5.5",critical:true,why:"Dropping from 3.8. Repeated albuterol doses drive potassium intracellularly through beta-2 receptor stimulation of the Na/K ATPase. Combined with catecholamine-driven shifts, hypokalemia can develop and needs monitoring."},
      ],
      signs:[
        {label:"Work of breathing",finding:"Severe suprasternal, intercostal, subcostal retractions with nasal flaring",pos:"body",sys:"Respiratory",why:"Suprasternal retractions mean the patient is generating huge negative intrathoracic pressures to overcome airway resistance. Nasal flaring is an infantile reflex that persists in severe pediatric distress - it reduces nasal airway resistance marginally. When all accessory muscles fire simultaneously, catastrophic fatigue is imminent."},
        {label:"Wheeze quality",finding:"Diminished, quieter than initial presentation",pos:"body",sys:"Respiratory",why:"A quieting chest in severe asthma is a pre-arrest finding. Louder wheeze means air is still moving. When wheeze decreases WITHOUT clinical improvement, airways are closing down or the patient lacks enough airflow to generate turbulent sound. This is 'silent chest' territory - the pre-terminal phase of status asthmaticus."},
        {label:"Mental status",finding:"Exhausted, less combative, slumping forward",pos:"head",sys:"Neuro",why:"A previously agitated, combative asthmatic becoming calm and drowsy is NOT improvement - it is CO2 narcosis. Rising pCO2 depresses CNS function. Decreased struggle means decreased ability to maintain minute ventilation. This clinical softening is the most reliable bedside indicator that intubation preparation should be active, not contemplated."},
        {label:"Posture",finding:"No longer tripoding, arms hanging at sides",pos:"body",sys:"Respiratory",why:"Loss of tripoding means the patient has given up recruiting accessory muscles - they are too exhausted. Respiratory muscle fatigue is the immediate precursor to respiratory arrest. The work the child was doing to stay alive is no longer sustainable."},
      ],
      assessItems:[
        {id:"hr3_2",label:"HR 145",cat:"vital",bad:true,why:"Worsening tachycardia despite treatment. Heart is working harder because (1) hypoxia is worsening, (2) respiratory muscle O2 consumption is enormous - up to 40% of total cardiac output in severe asthma, (3) beta-agonist effect continues."},
        {id:"rr3_2",label:"RR 42",cat:"vital",bad:true,why:"CRITICAL: Rate increased further despite treatment. The respiratory muscles are fatiguing. In asthma, a rising RR that then DROPS is the danger sign - it means the muscles are failing, not that the patient is improving."},
        {id:"bp3_2",label:"BP 112/70",cat:"vital",bad:false,why:"Maintained. Blood pressure is actually slightly elevated from the massive catecholamine response. This will remain normal until very late - cardiovascular collapse in respiratory failure is sudden."},
        {id:"spo3_2",label:"SpO2 90%",cat:"vital",bad:true,why:"Falling despite 4L NC. At SpO2 90%, PaO2 is approximately 60 mmHg - the inflection point of the oxyhemoglobin curve. Below this, saturation drops rapidly with small PaO2 changes. This child is on the cliff edge."},
        {id:"cap3_2",label:"Cap Refill 2s",cat:"vital",bad:false,why:"Still normal - primary respiratory failure has not yet progressed to cardiovascular compromise. But this can change in minutes if respiratory arrest occurs."},
      ],
      tools:["stethoscope","o2mask","bvmReady","peakFlow","ivKit","capRefill","defib"],
      meds:["albuterol","epinephrine","methylpred","nsBolus","acetaminophen","lorazepam"],
      actions:{tools:{
        stethoscope:{ok:true,pri:1,fb:"CRITICAL assessment. Auscultate all lung fields bilaterally. You need to hear air entry. A quiet chest means critical air trapping with minimal ventilation. Compare left vs right - unequal air entry could indicate mucus plugging, atelectasis, or developing pneumothorax."},
        o2mask:{ok:true,pri:2,fb:"Escalate oxygen delivery. Move from nasal cannula to non-rebreather mask at 15 L/min. SpO2 90% on NC means she needs higher FiO2. NRB provides 60-80% FiO2 vs 28-44% from NC."},
        bvmReady:{ok:true,pri:null,fb:"Stage the BVM at the bedside. If SpO2 continues to fall or she becomes apneic, transition to active bagging immediately. In severe asthma, use slow rate (8-10/min) with long expiratory time to allow trapped air to escape. Aggressive bagging worsens hyperinflation."},
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
      {name:"pH",value:"7.18",unit:"",ref:"7.35-7.45",critical:true,why:"Severe mixed acidosis. Both respiratory (pCO2 72 from inability to ventilate the collapsed lung) and metabolic (lactate 5.6 from tissue hypoperfusion). The right lung is not exchanging gas and the cardiovascular system is in obstructive shock."},
      {name:"pCO2",value:"72",unit:"mmHg",ref:"35-45",critical:true,why:"Severely elevated. The right lung has collapsed from the pneumothorax and the left lung is still obstructed from asthma. Effective ventilation has been cut in half or worse. CO2 is accumulating rapidly."},
      {name:"pO2",value:"42",unit:"mmHg",ref:"80-100",critical:true,why:"Critically low, corresponding to SpO2 78%. Only the left lung is participating in gas exchange, and it is still bronchospastic. The patient is in imminent danger of hypoxic cardiac arrest."},
      {name:"Lactate",value:"5.6",unit:"mmol/L",ref:"0.5-2.0",critical:true,why:"Sharply elevated from 2.8. The tension pneumothorax is compressing the great vessels, reducing cardiac output. Tissues are hypoperfused and generating lactate. This will correct rapidly once the tension is relieved by needle decompression."},
    ],
    signs:[
      {label:"Breath sounds",finding:"Absent on right, present with wheeze on left",pos:"body"},
      {label:"Neck veins",finding:"Jugular venous distension bilaterally",pos:"head"},
      {label:"Trachea",finding:"Deviated toward the left",pos:"face"},
      {label:"Hypotension",finding:"BP 82/50, down from 112/70",pos:"body"},
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
  reassessment:{
    narrative:"Following needle decompression and continued bronchodilator therapy, Sophia's respiratory mechanics have improved. She is speaking in full sentences again, work of breathing has decreased, and the tracheal shift has resolved. Breath sounds are audible bilaterally with residual scattered wheeze. She asks if she can have her inhaler back.",
    vitals:{hr:118,rr:26,sbp:106,dbp:68,spo2:96,temp:37.4,cap:2},
    signs:[
      {label:"Work of breathing",finding:"Mild retractions only, no accessory muscle use",pos:"body",sys:"Respiratory"},
      {label:"Breath sounds",finding:"Bilateral, scattered expiratory wheeze",pos:"body",sys:"Respiratory"},
      {label:"Mental status",finding:"Alert, speaking in full sentences",pos:"head",sys:"Neuro"},
    ]
  },
  stabilizationSummary:"Needle decompression immediately reversed the tension pneumothorax, restoring venous return and cardiac output. Continuous albuterol plus IV methylprednisolone broke the underlying bronchospasm and inflammation. Early recognition of the unilateral breath sounds prevented progression to PEA arrest from obstructive shock.",
  debrief:{
    summary:"You managed escalating status asthmaticus, recognized the transition from compensating to failing respiratory mechanics, and identified a tension pneumothorax when the clinical picture suddenly changed. The critical skill was pattern interruption - recognizing that unilateral absent breath sounds + sudden desat + hypotension represented a NEW diagnosis superimposed on asthma.",
    explainers:[
      {title:"Respiratory Compensation and Failure",content:"In asthma, tachypnea initially compensates for reduced tidal volume from air trapping. But respiratory muscles have finite endurance. The diaphragm and intercostals can only sustain high work of breathing for hours before glycogen depletes and fatigue sets in. When RR drops in a patient who was tachypneic, it is NOT improvement - it is failure. The quiet chest (diminished wheeze) means airflow has dropped so low that there isn't enough velocity to generate turbulent sound. Quiet + tired = intubation imminent.",tldr:"Fast breathing compensates for trapped air until the muscles run out of gas. A dropping respiratory rate in an asthmatic is not improvement - it is respiratory failure."},
      {title:"The Oxyhemoglobin Cliff",content:"The sigmoid shape of the oxyhemoglobin dissociation curve means SpO2 stays relatively stable between PaO2 60-100 mmHg (SpO2 90-99%). Below PaO2 60 (SpO2 ~90%), the curve steepens dramatically. A patient at SpO2 93% has a PaO2 of ~65 with some reserve. At SpO2 90%, PaO2 is ~60 with almost no reserve. At 85%, PaO2 is ~50 and falling fast. This is why a drop from 93% to 90% should trigger escalation - you're entering the danger zone of the curve.",tldr:"SpO2 90-99% looks stable but hides a lot of variation in actual oxygen levels. Below 90%, small changes in oxygen cause the saturation to plummet. Treat 93% to 90% as a red flag, not a small dip."},
      {title:"Pattern Interruption in Critical Care",content:"The most dangerous cognitive trap in critical care is anchoring to your initial diagnosis. This patient had asthma. Everyone was treating asthma. When the pneumothorax developed, the temptation is to think 'the asthma is just getting worse' and double down on bronchodilators. The unilateral finding (absent breath sounds on ONE side) is the key that breaks the pattern. Asthma is bilateral. Unilateral absent sounds means something else is happening. Training your brain to notice when the pattern changes is what prevents deaths from missed diagnoses.",tldr:"Asthma is bilateral. If breath sounds disappear on only ONE side, the diagnosis has changed. Do not keep treating asthma when a pneumothorax is killing your patient."},
    ],
  },
};


// Phase-4-prep: generated by Sonnet 4.6 with adaptive thinking + the
// 8-item self-review checklist on the 6-month-old infant smoke-test prompt.
// Reviewed for clinical accuracy, EMS-stated fact preservation,
// age-appropriate physiology, and vital chip ↔ assessItem alignment.
export var SC4 = {
  "id": "infant-septic-shock",
  "title": "Limp and Lethargic: Infant in Septic Shock",
  "tier": 2,
  "icon": "🌡️",
  "tagline": "Smallest patient. Biggest danger. Fastest clock.",
  "description": "Six-month-old Mateo Reyes arrives via EMS limp, barely responsive, and pale after two days of vomiting and progressive lethargy. Despite a prehospital saline bolus, he remains profoundly ill — and the most dangerous finding may not be the one anyone thought to check.",
  "visuals": [],
  "patient": {
    "ageLabel": "6-Month-Old",
    "weightKg": 8,
    "sex": "Male",
    "cc": "Vomiting and lethargy x 2 days",
    "history": "Mateo is a previously healthy 6-month-old male with no prior medical history, no known allergies, and no home medications. His mother reports two days of persistent vomiting — initially non-bilious, now with decreased frequency as oral intake has nearly ceased — and progressive decrease in activity and responsiveness, with a notable sharp decline since this morning. He has had no wet diapers in approximately 8 hours. He is exclusively formula-fed and has not yet started solid foods. No fever was measured at home. An older sibling had a mild upper respiratory illness two weeks prior, but no other sick contacts are identified."
  },
  "emsReport": "EMS transported a 6-month-old male from home at the request of his mother following two days of vomiting and decreased activity. Paramedics established a 24-gauge peripheral IV in the left antecubital fossa and administered 200 mL of normal saline en route. The infant remained lethargic with eyes intermittently open and no purposeful movement observed throughout transport. Mother reports he has had no wet diapers in approximately 8 hours.",
  "learnMore": "Sepsis in infants under 12 months presents differently from older children due to immature immune response, limited hepatic glycogen reserves, and diminished cardiovascular reserve. Age-adjusted SIRS criteria define tachycardia as HR >180 bpm in infants — bradycardia (<100 bpm) is an equally dangerous late finding. Urinary tract infections are the most common identifiable bacterial source in this age group, particularly in uncircumcised male infants, with E. coli as the predominant pathogen. Early recognition of compensated shock (normal BP, altered perfusion markers) versus decompensated shock (hypotension present) determines the urgency of vasopressor initiation alongside fluid and antibiotic therapy.",
  "norms": {
    "hr": [80, 160],
    "rr": [30, 60],
    "sbp": [70, 100],
    "dbp": [40, 65],
    "spo2": [95, 100],
    "temp": [36.5, 37.5]
  },
  "phases": [
    {
      "id": "triage",
      "name": "Triage",
      "narrative": "Mateo arrives on the EMS gurney, limp and minimally responsive. He opens his eyes briefly to painful stimulation but does not localize or produce a cry. His color is pale and mottled, with extremities cold to the touch below the elbows and knees. Paramedics placed him on supplemental oxygen via nasal cannula en route. A 24-gauge peripheral IV in the left antecubital fossa is patent on arrival, and 200 mL of normal saline was infused pre-hospital. Trachea is midline. No petechiae or purpuric rash are identified on full skin examination.",
      "vitals": {
        "hr": 188,
        "rr": 62,
        "sbp": 66,
        "dbp": 46,
        "spo2": 96,
        "temp": 38.9,
        "cap": 4
      },
      "signs": [
        {
          "label": "Skin",
          "finding": "Mottled and pale from elbows and knees distally; trunk pale but less mottled; extremities cold and clammy below mid-forearm and mid-calf",
          "pos": "body",
          "sys": "cardiovascular",
          "why": "Mottling and pallor with cold extremities represent the clinical signature of cold septic shock in an infant.\n\n- **Vasoconstriction** from sympathetic activation redistributes blood away from skin to vital organs — producing pallor and cold peripheries\n- **Mottling** results from heterogeneous microcirculatory flow with alternating zones of vasodilation and vasoconstriction, producing a marbled appearance\n- The **distal-to-proximal gradient** (elbows and knees first) reflects the anatomical hierarchy of sympathetically mediated vasoconstriction\n- **Cold shock phenotype** — high systemic vascular resistance, low cardiac output — distinguishes this from warm septic shock (vasodilated, bounding pulses)\n- Mottling score ≥3 in pediatric sepsis correlates with elevated lactate and worse clinical outcomes"
        },
        {
          "label": "Anterior Fontanelle",
          "finding": "Sunken approximately 1 cm below the cranial surface; soft; no bulging or tenseness",
          "pos": "head",
          "sys": "neurological",
          "why": "A sunken anterior fontanelle reflects significant total body fluid depletion in this infant.\n\n- The **anterior fontanelle** closes between 9 and 18 months; while patent, it provides a direct window into intracranial volume and pressure status\n- **Sunken fontanelle** indicates decreased CSF and intravascular volume — a reliable bedside marker of moderate-to-severe dehydration in infants\n- Two days of vomiting with near-zero oral intake has produced both **intravascular and interstitial volume loss**, confirmed by the absent wet diapers\n- **Absence of bulging** argues against acutely elevated ICP from bacterial meningitis — though meningitis cannot be excluded without lumbar puncture once stable"
        },
        {
          "label": "Muscle Tone",
          "finding": "Markedly hypotonic in all four extremities and trunk; minimal resistance to passive movement; floppy posture when lifted",
          "pos": "body",
          "sys": "neurological",
          "why": "Global hypotonia in a previously healthy 6-month-old signals severe systemic illness impairing CNS function.\n\n- **Hypoglycemia** (glucose 34 mg/dL) is the most immediately reversible cause of cortical depression and loss of muscle tone in infants\n- **Metabolic acidosis** (HCO3 12 mEq/L) and systemic inflammatory mediators directly impair neuronal membrane function\n- **Cerebral hypoperfusion** from systolic hypotension (66 mmHg) reduces substrate delivery to motor cortex and corticospinal pathways\n- **Global hypotonia** versus focal weakness helps distinguish systemic illness from a focal neurological lesion — global involvement here points firmly toward septic/metabolic etiology"
        },
        {
          "label": "Peripheral Pulses",
          "finding": "Brachial pulses weak and thready bilaterally; radial pulses absent bilaterally; femoral pulses faintly palpable",
          "pos": "body",
          "sys": "cardiovascular",
          "why": "Absent radial pulses with weak brachial pulses indicates advanced shock with critically reduced distal perfusion pressure.\n\n- **Pulse amplitude** reflects the product of stroke volume and vascular resistance — in cold shock, high SVR narrows pulse pressure and dampens peripheral waveform\n- **Absent radial pulses** indicate distal perfusion pressure has fallen below the threshold for palpable pulse generation — a critical threshold in shock staging\n- The hierarchy of pulse loss (radial → brachial → femoral) follows the anatomical gradient of peripheral vasoconstriction\n- **Absent femoral pulses** would signal imminent cardiovascular collapse — their faint presence here confirms the patient is critically ill but not yet in arrest\n- This finding places vasopressor readiness as the next clinical contingency if fluids fail"
        },
        {
          "label": "Breath Sounds",
          "finding": "Equal and clear bilaterally; no crackles, no wheeze, no stridor; mild tachypnea noted on auscultation",
          "pos": "body",
          "sys": "respiratory",
          "why": "Clear, equal bilateral breath sounds are a reassuring finding that excludes several dangerous contributors to this infant's shock state.\n\n- **Equal breath sounds** exclude pneumothorax and significant pleural effusion as contributors to hemodynamic compromise\n- **Absence of crackles** confirms no pulmonary edema from the prehospital fluid bolus — providing clinical safety to continue IV fluid resuscitation\n- **No wheeze** argues against bronchiolitis or reactive airway disease as a primary diagnosis\n- The observed **tachypnea** is the respiratory system's compensatory response to metabolic acidosis — not a primary airway or parenchymal process"
        },
        {
          "label": "Abdomen",
          "finding": "Soft, non-distended, non-tender; no guarding or rigidity; bowel sounds present in all quadrants; no palpable masses or organomegaly",
          "pos": "body",
          "sys": "gastrointestinal",
          "why": "A soft, non-tender abdomen without peritoneal signs is reassuring against a primary surgical cause of shock in this infant.\n\n- **Absence of guarding or rigidity** argues against intestinal perforation, which would produce a board-like abdomen with peritoneal signs\n- **No palpable mass** reduces concern for intussusception (lead-point mass in RUQ) — an important differential in a 6-month-old with vomiting and lethargy\n- **Present bowel sounds** confirm ongoing intestinal motility without complete ileus\n- This finding supports a **medical (infectious/septic) rather than surgical** etiology, directing management toward sepsis resuscitation"
        }
      ],
      "assessItems": [
        {
          "id": "hr",
          "label": "HR 188 bpm",
          "bad": true,
          "why": "Heart rate of 188 bpm significantly exceeds the upper normal limit of 160 bpm for a 6-month-old, representing pathologic tachycardia.\n\n- **Compensatory sinus tachycardia** is the primary mechanism by which infants maintain cardiac output in shock — because stroke volume is relatively fixed, rate is the dominant cardiac output variable\n- Inflammatory cytokines (**IL-6, TNF-α**) directly stimulate the sinoatrial node, driving rate elevation beyond what sympathetic tone alone produces\n- HR >**180 bpm** defines tachycardia by age-adjusted SIRS criteria for infants under 12 months\n- Tachycardia is one of the **earliest and most sensitive** vital sign abnormalities in pediatric shock — it must be taken seriously in any ill-appearing infant",
          "cat": "vital"
        },
        {
          "id": "rr",
          "label": "RR 62 /min",
          "bad": true,
          "why": "Respiratory rate of 62 breaths per minute exceeds the normal maximum of 60/min for a 6-month-old, representing clinically significant tachypnea.\n\n- In the setting of severe metabolic acidosis (HCO3 12 mEq/L), tachypnea represents **Kussmaul-type compensatory hyperventilation** — the respiratory system blowing off CO2 to buffer the acidosis\n- **Winter's formula** predicts expected compensatory pCO2: 1.5 × 12 + 8 = 26 mmHg — consistent with the degree of tachypnea observed\n- Tachypnea in a febrile, lethargic infant also raises concern for **primary respiratory infection** — excluded here by clear bilateral breath sounds\n- Increasing respiratory rate over time signals **deepening acidosis** and approaching respiratory fatigue",
          "cat": "vital"
        },
        {
          "id": "sbp",
          "label": "SBP 66 mmHg",
          "bad": true,
          "why": "Systolic BP of 66 mmHg falls below the minimum acceptable threshold of 70 mmHg for a 6-month-old infant, defining decompensated (hypotensive) septic shock.\n\n- **Hypotension in pediatric sepsis is a late finding** — it represents failure of all compensatory mechanisms (tachycardia, peripheral vasoconstriction, increased contractility)\n- At SBP 66 mmHg, **cerebral and coronary perfusion pressures** are critically compromised, directly explaining the altered consciousness and decreased tone\n- PALS defines **decompensated shock** as shock with hypotension — this distinguishes from compensated shock and escalates the urgency of vasopressor readiness\n- This infant received **25 mL/kg** NS pre-arrival without normalizing BP — a key signal of developing fluid-refractory shock",
          "cat": "vital"
        },
        {
          "id": "spo2",
          "label": "SpO2 96%",
          "bad": false,
          "why": "SpO2 of 96% on supplemental nasal cannula oxygen falls within the normal acceptable range (≥95%) and should not be flagged as a critical abnormality.\n\n- **96% SpO2** on supplemental O2 does not indicate hypoxemia requiring emergent airway intervention at this moment\n- However, in severe **peripheral vasoconstriction**, pulse oximetry accuracy is reduced — the probe may fail to detect adequate pulsatile flow distally, making readings less reliable\n- The infant's critical illness is driven by **circulatory failure**, not primary hypoxia — SpO2 alone does not capture the severity of impaired oxygen delivery\n- Correct management is to upgrade O2 delivery (NRB mask) and treat the underlying shock — not to be falsely reassured by a borderline-normal SpO2 number",
          "cat": "vital"
        },
        {
          "id": "temp",
          "label": "Temp 38.9°C",
          "bad": true,
          "why": "Temperature of 38.9°C exceeds the normal threshold of 37.5°C, indicating fever consistent with an active infectious or inflammatory process.\n\n- **Fever** in the context of altered perfusion, tachycardia, and hypotension in an infant constitutes a sepsis presentation until proven otherwise\n- Fever is mediated by **prostaglandin E2** acting on the hypothalamic thermoregulatory center in response to circulating pyrogens (IL-1β, TNF-α, IL-6) from the infectious source\n- Critically, some infants — especially those under 3 months — may be **afebrile or hypothermic** in sepsis due to immature thermoregulation; the absence of fever never excludes sepsis\n- Fever at 38.9°C in a 6-month-old with hemodynamic instability mandates **immediate blood cultures and empiric antibiotic therapy**",
          "cat": "vital"
        },
        {
          "id": "cap",
          "label": "Cap Refill 4 sec",
          "bad": true,
          "why": "Capillary refill time of 4 seconds is markedly prolonged beyond the normal maximum of 2 seconds, indicating severely impaired peripheral microcirculation.\n\n- **Normal cap refill** is ≤2 seconds in children; 3 seconds is borderline; ≥4 seconds indicates impaired microvascular flow consistent with shock\n- Prolonged cap refill reflects **arteriolar vasoconstriction** and reduced skin perfusion pressure from sympathetic activation and low cardiac output\n- In pediatric sepsis, cap refill >3 seconds correlates with elevated lactate and is an independent predictor of **organ dysfunction**\n- Serial cap refill measurement trends treatment response — improvement to <2 seconds following resuscitation confirms improved cardiac output",
          "cat": "vital"
        },
        {
          "id": "skin",
          "label": "Skin",
          "bad": true,
          "why": "Mottled, pale, cold skin from the distal extremities is a clinical hallmark of cold septic shock in a pediatric patient.\n\n- **Mottling** indicates heterogeneous microcirculatory failure — the skin reflects the systemic perfusion crisis before vital sign thresholds are fully crossed\n- **Pallor** reflects reduced cutaneous blood flow from vasoconstriction and decreased cardiac output\n- The **distal-to-proximal gradient** of cold, mottled skin confirms sympathetic redistribution of flow away from extremities toward vital organs\n- This pattern distinguishes **cold shock** (high SVR, vasoconstricted) from warm shock (vasodilated, flushed skin) and guides vasopressor selection if fluids fail",
          "cat": "clinical"
        },
        {
          "id": "fontanelle",
          "label": "Anterior Fontanelle",
          "bad": true,
          "why": "A sunken anterior fontanelle confirms significant total body volume depletion in this 6-month-old.\n\n- While patent (closes by 9-18 months), the fontanelle provides a direct bedside window into intracranial pressure and hydration status\n- **Sunken fontanelle** = reduced CSF and intravascular volume — clinically equivalent to moderate-to-severe dehydration on exam\n- Combined with absent wet diapers for 8 hours, vomiting for 2 days, and poor intake, this confirms a **substantial fluid deficit** that is compounding the hemodynamic shock\n- **Absence of bulging** reduces (but does not eliminate) concern for bacterial meningitis as the primary driver — LP is deferred until hemodynamic stability is achieved",
          "cat": "clinical"
        },
        {
          "id": "tone",
          "label": "Muscle Tone",
          "bad": true,
          "why": "Global hypotonia in a previously well 6-month-old is a high-acuity neurological finding indicating severe CNS dysfunction from metabolic and perfusion failure.\n\n- **Critical hypoglycemia** (glucose 34 mg/dL) is the most immediately reversible cause of cortical suppression and loss of axial and appendicular tone in this age group\n- **Metabolic acidosis** (HCO3 12) and circulating inflammatory mediators further impair neuronal membrane integrity and neuromuscular transmission\n- **Cerebral hypoperfusion** at SBP 66 mmHg starves cortical neurons of both oxygen and glucose, producing functional shutdown\n- A normal 6-month-old should have good head control and resist passive flexion — truncal floppiness with absent extremity tone signals **global CNS suppression**",
          "cat": "clinical"
        },
        {
          "id": "pulses",
          "label": "Peripheral Pulses",
          "bad": true,
          "why": "Absent radial pulses with weak brachial pulses indicate advanced shock with critically impaired stroke volume and distal perfusion.\n\n- **Peripheral pulse amplitude** = stroke volume × pulse pressure — in cold shock, both are reduced, obliterating palpable waveform at the wrist\n- **Absent radial pulses** mark the threshold where distal perfusion pressure has fallen below what is needed to generate a palpable pulse — this is an emergency finding\n- The femoral pulse being faintly palpable confirms the patient is not yet in cardiac arrest, but the progression from radial to brachial loss signals **decompensating shock**\n- Vasopressor readiness (**epinephrine infusion**) must be planned immediately should volume resuscitation fail to restore pulses",
          "cat": "clinical"
        },
        {
          "id": "breathsounds",
          "label": "Breath Sounds",
          "bad": false,
          "why": "Clear, equal bilateral breath sounds are a reassuring finding that excludes several immediately dangerous diagnoses in this infant.\n\n- **Equal breath sounds** rule out tension pneumothorax and significant pleural effusion as contributors to the hemodynamic compromise\n- **Absence of crackles** confirms no pulmonary edema — providing safety to continue aggressive IV fluid resuscitation without worsening pulmonary congestion\n- **No wheeze** argues against bronchiolitis or reactive airway as the primary diagnosis in this presentation\n- Confirming clear lungs should provide confidence to the team that **fluid resuscitation** can continue without causing respiratory compromise",
          "cat": "clinical"
        },
        {
          "id": "abdomen",
          "label": "Abdomen",
          "bad": false,
          "why": "A soft, non-tender abdomen without peritoneal signs excludes a primary surgical cause of shock and redirects management toward medical sepsis resuscitation.\n\n- **No guarding or rigidity** argues against intestinal perforation or ischemia, which would produce a board-like abdomen with involuntary muscle guarding\n- **No palpable mass** reduces the likelihood of intussusception — a key differential in a 6-month-old with vomiting and altered consciousness\n- **Present bowel sounds** confirm intestinal motility is intact, without the ileus expected in a surgical abdomen\n- This reassuring finding confirms the clinical priority is **medical (septic) resuscitation**, not surgical consultation",
          "cat": "clinical"
        },
        {
          "id": "wbc",
          "label": "WBC",
          "bad": true,
          "why": "WBC of 26,800/µL exceeds the age-adjusted normal upper limit of 17,500/µL for a 6-month-old, indicating pathologic leukocytosis consistent with bacterial infection.\n\n- **Leukocytosis** is driven by cytokine-mediated (G-CSF, IL-1, IL-6) release of mature neutrophils from bone marrow storage pools\n- Elevated WBC in the context of elevated **CRP, procalcitonin, and lactate** creates a convergent picture strongly supporting bacterial over viral etiology\n- **Bandemia** (>10% immature band neutrophils) if present would further increase specificity for acute bacterial infection\n- WBC alone is nonspecific — its value is in confirming the inflammatory picture, not in isolation",
          "cat": "lab"
        },
        {
          "id": "lactate",
          "label": "Lactate",
          "bad": true,
          "why": "Lactate of 5.8 mmol/L is critically elevated above the normal threshold of 2.0 mmol/L, indicating severe anaerobic metabolism from global tissue oxygen debt.\n\n- **Lactate** rises when oxygen delivery falls below cellular demand, forcing tissues from aerobic oxidative phosphorylation to anaerobic glycolysis\n- In septic shock, lactic acidosis results from reduced cardiac output, microvascular dysfunction, and direct mitochondrial impairment from bacterial endotoxins\n- Lactate >**4 mmol/L** in pediatric sepsis defines septic shock severity and correlates with significantly elevated mortality risk\n- **Lactate clearance** — a fall of ≥10% per hour during resuscitation — is a validated endpoint of effective treatment response",
          "cat": "lab"
        },
        {
          "id": "glucose",
          "label": "Glucose",
          "bad": true,
          "why": "Glucose of 34 mg/dL is critically below the normal minimum of 60 mg/dL and represents a neurological emergency requiring immediate treatment.\n\n- Infants are uniquely vulnerable to hypoglycemia due to **limited hepatic glycogen stores**, an immature gluconeogenic capacity, and a high brain-to-body glucose consumption ratio\n- In sepsis, activated immune cells (neutrophils, macrophages) are highly glycolytic — they **consume circulating glucose** at an accelerated rate while hepatic production is simultaneously impaired by cytokine inhibition\n- **Neuronal dysfunction** begins within minutes at glucose below 40 mg/dL; irreversible cortical injury follows if uncorrected\n- Treatment: **D10W at 5 mL/kg IV** (40 mL for this 8 kg infant) provides 0.5 g/kg of glucose — preferred over D25W or D50W in infants to minimize hyperosmolar risk",
          "cat": "lab"
        },
        {
          "id": "bicarb",
          "label": "Bicarbonate",
          "bad": true,
          "why": "Bicarbonate of 12 mEq/L is critically below the normal range of 18-28 mEq/L, indicating severe metabolic acidosis from lactic acid accumulation.\n\n- Bicarbonate is consumed buffering excess **hydrogen ions** generated during anaerobic glycolysis (lactic acidosis)\n- At HCO3 12 mEq/L, the estimated blood pH is approximately **7.22-7.25** by Henderson-Hasselbalch calculation — significantly acidotic\n- Severe acidosis impairs **myocardial contractility**, reduces vascular responsiveness to catecholamines, and lowers the threshold for arrhythmia\n- Treatment targets the **underlying shock state** — bicarbonate supplementation is not indicated unless pH falls below 7.10 and after the root cause is being addressed",
          "cat": "lab"
        },
        {
          "id": "sodium",
          "label": "Sodium",
          "bad": true,
          "why": "Serum sodium of 130 mEq/L falls below the normal range of 135-145 mEq/L, indicating hyponatremia from multiple concurrent mechanisms.\n\n- **GI sodium loss** from prolonged vomiting depletes extracellular sodium stores; inadequate intake removes the replacement source\n- **SIADH** (syndrome of inappropriate ADH secretion) is triggered by physiologic stress, volume depletion, and possible CNS involvement, causing renal free water retention and dilutional hyponatremia\n- Sodium below **130 mEq/L** increases risk of **cerebral edema** — particularly dangerous in young infants whose brain-to-skull ratio leaves minimal room for intracranial volume expansion\n- Isotonic resuscitation with **normal saline** (sodium 154 mEq/L) will partially correct the hyponatremia while restoring intravascular volume",
          "cat": "lab"
        },
        {
          "id": "crp",
          "label": "CRP",
          "bad": true,
          "why": "CRP of 86 mg/L is critically elevated above the normal threshold of 10 mg/L, confirming a robust acute-phase inflammatory response consistent with bacterial sepsis.\n\n- **CRP** is synthesized by the liver 12-24 hours after infection onset in response to IL-6 from activated macrophages and monocytes\n- Values above **40-80 mg/L** in febrile children are significantly associated with bacterial over viral etiology\n- CRP elevation at 2 days into illness confirms a **sustained inflammatory response** — not a transient early peak\n- Combined with leukocytosis, elevated procalcitonin, and clinical septic shock, CRP >80 mg/L strongly supports empiric **broad-spectrum antibiotic therapy** without delay",
          "cat": "lab"
        },
        {
          "id": "hgb",
          "label": "Hemoglobin",
          "bad": false,
          "why": "Hemoglobin of 11.0 g/dL falls within the normal reference range of 9.5-13.5 g/dL for a 6-month-old infant and is not a flagworthy finding.\n\n- At 6 months, hemoglobin is recovering from the **physiologic nadir** of infancy (approximately 9.5-11 g/dL at 2-3 months) as erythropoiesis responds to increasing oxygen demands — 11.0 g/dL is age-appropriate\n- The shock state here is **distributive/septic**, not anemic — oxygen-carrying capacity is not the limiting factor; perfusion pressure and cardiac output are\n- **Transfusion is not indicated** in the absence of active hemorrhage, anemia-related hemodynamic compromise, or Hgb below threshold for the clinical context\n- Flagging this value would represent an error in age-adjusted pediatric laboratory interpretation",
          "cat": "lab"
        }
      ],
      "labs": [
        {
          "name": "WBC",
          "value": "26,800",
          "unit": "/µL",
          "ref": "6,000–17,500",
          "critical": true,
          "why": "Leukocytosis above 17,500/µL in a febrile, hemodynamically unstable infant supports bacterial sepsis as the underlying diagnosis.\n\n- **WBC elevation** reflects bone marrow mobilization of mature and immature neutrophils via G-CSF, IL-1, and IL-6\n- Combined with elevated **CRP and lactate**, leukocytosis creates a convergent inflammatory picture strongly favoring bacterial over viral etiology\n- **Bandemia** (>10% band forms) would further increase specificity for acute bacterial infection\n- This value supports proceeding with empiric **broad-spectrum antibiotic therapy** without awaiting culture results"
        },
        {
          "name": "Lactate",
          "value": "5.8",
          "unit": "mmol/L",
          "ref": "0.5–2.0",
          "critical": true,
          "why": "Lactate 5.8 mmol/L defines severe anaerobic metabolism and identifies the degree of tissue oxygen debt in this infant.\n\n- **Lactic acidosis** in septic shock results from reduced cardiac output, microvascular dysfunction, and direct mitochondrial impairment from bacterial endotoxins\n- Lactate >**4 mmol/L** in pediatric sepsis correlates with significantly increased organ dysfunction and mortality\n- **Lactate clearance** ≥10% per hour during resuscitation is a validated marker of effective improvement in tissue oxygen delivery\n- This value should trigger immediate hemodynamic resuscitation with close reassessment of perfusion markers"
        },
        {
          "name": "Glucose",
          "value": "34",
          "unit": "mg/dL",
          "ref": "60–100",
          "critical": true,
          "why": "Glucose of 34 mg/dL is a neurological emergency in an infant — as urgent as the hemodynamic resuscitation.\n\n- Infants lack adequate **hepatic glycogen reserves** and gluconeogenic capacity to sustain normoglycemia under physiologic stress\n- Sepsis drives glucose consumption by activated immune cells while simultaneously impairing hepatic glucose production via cytokine inhibition\n- Neuronal dysfunction begins rapidly at glucose values below **40 mg/dL**; irreversible injury follows if untreated\n- Treatment: **D10W 5 mL/kg IV** (40 mL for this infant) provides 0.5 g/kg — preferred concentration to minimize hyperosmolar risk"
        },
        {
          "name": "Bicarbonate",
          "value": "12",
          "unit": "mEq/L",
          "ref": "18–28",
          "critical": true,
          "why": "Bicarbonate of 12 mEq/L represents severe metabolic acidosis from lactic acid accumulation in decompensated septic shock.\n\n- Bicarbonate is consumed buffering excess **H⁺** generated during anaerobic glycolysis\n- At HCO3 12 mEq/L, estimated blood pH is approximately **7.22-7.25** — significantly impairing myocardial contractility and catecholamine receptor sensitivity\n- Acidosis at this level also reduces the threshold for **cardiac arrhythmia**\n- Treatment must address the **underlying shock** — bicarbonate supplementation is deferred unless pH falls below 7.10 after root-cause intervention"
        },
        {
          "name": "Sodium",
          "value": "130",
          "unit": "mEq/L",
          "ref": "135–145",
          "critical": true,
          "why": "Hyponatremia at 130 mEq/L reflects combined GI sodium loss, inadequate intake, and stress-induced SIADH.\n\n- Prolonged vomiting depletes **sodium-containing gastric secretions**; zero intake removes replacement\n- **SIADH** triggered by stress and volume depletion causes renal free-water retention, diluting serum sodium\n- Sodium below **130 mEq/L** increases the risk of symptomatic **cerebral edema** — critically dangerous in infants with limited intracranial compliance\n- Resuscitation with **normal saline** (Na 154 mEq/L) will partially correct hyponatremia while restoring intravascular volume"
        },
        {
          "name": "CRP",
          "value": "86",
          "unit": "mg/L",
          "ref": "0–10",
          "critical": true,
          "why": "CRP of 86 mg/L confirms a sustained, robust acute-phase inflammatory response consistent with bacterial sepsis at 48 hours of illness.\n\n- **CRP** rises 12-24 hours after infection onset in response to IL-6 from activated macrophages\n- Values >**40-80 mg/L** in febrile pediatric patients strongly associate with bacterial over viral etiology\n- Elevation at 2 days confirms this is a **sustained response** rather than a transient early peak\n- Combined with leukocytosis, lactate elevation, and clinical shock, CRP >80 supports empiric antibiotic administration without delay"
        },
        {
          "name": "Hemoglobin",
          "value": "11.0",
          "unit": "g/dL",
          "ref": "9.5–13.5",
          "critical": false
        }
      ],
      "tools": null,
      "meds": null,
      "actions": null
    },
    {
      "id": "escalation",
      "name": "Escalation",
      "narrative": "Despite the 200 mL normal saline bolus administered by EMS, Mateo remains critically ill. He lies limp on the gurney with eyes half-open, responding only to sternal rub with a weak grimace — no cry, no purposeful movement. Skin is diffusely mottled from the trunk to the digits; extremities are cold and clammy below the elbows and knees. Brachial pulses are weak and thready; radial pulses remain absent bilaterally. The 24-gauge peripheral IV in the left antecubital fossa is confirmed patent with good blood return. Breath sounds are clear and equal bilaterally; trachea is midline. The abdomen remains soft and non-distended without guarding. The cardiac monitor confirms sinus tachycardia without ectopy. No petechiae or purpuric rash has been identified on full skin examination.",
      "vitals": {
        "hr": 194,
        "rr": 64,
        "sbp": 62,
        "dbp": 44,
        "spo2": 94,
        "temp": 38.9,
        "cap": 5
      },
      "signs": [
        {
          "label": "Mental Status",
          "finding": "Eyes half-open; responds only to sternal rub with weak grimace; no cry, no purposeful movement; AVPU: P (responds to Pain only)",
          "pos": "head",
          "sys": "neurological",
          "why": "AVPU = P in a 6-month-old who should be socially alert and interactive represents critical CNS dysfunction from combined hypoglycemia, metabolic acidosis, and cerebral hypoperfusion.\n\n- A normal 6-month-old tracks faces, smiles socially, and vocalizes (AVPU = A) — responding only to pain reflects profound **cortical suppression**\n- **Hypoglycemia** (glucose 34 mg/dL) is the most immediately reversible cause of this altered consciousness\n- **Cerebral hypoperfusion** at SBP 62 mmHg reduces oxygen and glucose delivery to cortical neurons simultaneously\n- Failure to improve neurologically after glucose correction and volume restoration should prompt consideration of **bacterial meningitis** (LP deferred until stable)"
        },
        {
          "label": "Skin and Perfusion",
          "finding": "Diffuse mottling from trunk to digits; extremities cold and clammy below elbows and knees; generalized pallor",
          "pos": "body",
          "sys": "cardiovascular",
          "why": "Proximal progression of mottling to involve the trunk signals worsening compensatory failure and advancing decompensated shock.\n\n- Mottling extending to the **trunk** (rather than limited to extremities) represents exhaustion of the body's capacity to maintain selective vasoconstriction — shock is advancing\n- **Cold, clammy** extremities reflect the combination of intense sympathetic vasoconstriction and increased insensible losses from fever\n- This escalating mottling pattern is a bedside marker of **decompensating cold septic shock** requiring immediate hemodynamic intervention\n- Further delay risks progression to cardiovascular collapse and cardiac arrest"
        },
        {
          "label": "Breath Sounds",
          "finding": "Clear and equal bilaterally; no crackles or wheeze; trachea midline; tachypnea present without accessory muscle use",
          "pos": "body",
          "sys": "respiratory",
          "why": "Clear bilateral breath sounds with midline trachea confirm absence of tension pneumothorax and pulmonary edema at this stage of resuscitation.\n\n- **Midline trachea** excludes tension pneumothorax, which would deviate the trachea contralaterally and cause asymmetric breath sounds\n- **No crackles** confirm the prehospital NS bolus has not caused pulmonary edema — safe to continue volume resuscitation\n- **No retractions or grunting** indicate the infant is not yet in primary respiratory failure despite tachypnea from metabolic acidosis\n- Continued clear lungs provide clinical confidence to proceed with **fluid resuscitation** as part of the sepsis bundle"
        },
        {
          "label": "IV Access",
          "finding": "24-gauge peripheral IV in left antecubital fossa; good blood return on aspiration; flushes without resistance or swelling",
          "pos": "body",
          "sys": "vascular",
          "why": "A patent 24-gauge PIV provides a functional route for medication delivery but is a marginal bore for rapid large-volume resuscitation in this infant.\n\n- **Blood return confirmed**: validates intravenous (not subcutaneous) placement — critical before administering osmotically active medications like dextrose\n- **24-gauge bore** has limited maximum flow rate; adequate for push-dose medications but may restrict rapid fluid delivery under gravity or manual pressure\n- If this IV fails at any point, immediate **IO placement** (proximal tibia, EZ-IO 15mm needle) is the rescue access of choice — do not delay critical medications to attempt another peripheral IV\n- This is a reassuring but fragile single point of access in a critically ill infant"
        }
      ],
      "assessItems": [
        {
          "id": "hr2",
          "label": "HR 194 bpm",
          "bad": true,
          "why": "Heart rate of 194 bpm reflects worsening compensatory tachycardia in an infant whose cardiac output is failing to keep pace with increasing metabolic demand.\n\n- Progressive tachycardia despite 25 mL/kg of prehospital fluid indicates the infant's compensatory reserve is being **overwhelmed**\n- At rates approaching 200 bpm, diastolic filling time becomes critically shortened — **cardiac output may paradoxically fall** despite the high rate\n- Worsening tachycardia in a resuscitated infant is a trigger for **immediate escalation** of therapy",
          "cat": "vital"
        },
        {
          "id": "rr2",
          "label": "RR 64 /min",
          "bad": true,
          "why": "Respiratory rate of 64/min exceeds normal maximum and signals deepening metabolic acidosis with escalating respiratory compensatory drive.\n\n- Rising RR indicates the **metabolic acidosis is worsening** — the respiratory system is working harder to compensate for increasing lactic acid production\n- An infant who fatigues this compensatory drive risks **apnea** and respiratory arrest — a critical escalation point\n- BVM must be staged at the bedside as an immediate rescue device",
          "cat": "vital"
        },
        {
          "id": "sbp2",
          "label": "SBP 62 mmHg",
          "bad": true,
          "why": "SBP of 62 mmHg represents further deterioration below the minimum threshold of 70 mmHg despite prehospital fluid resuscitation.\n\n- Drop from 66 to 62 mmHg despite 25 mL/kg confirms **fluid-refractory or rapidly progressive septic shock**\n- At SBP 62 mmHg, cerebral perfusion pressure is critically reduced — the observed altered consciousness is a direct consequence\n- **Vasopressor readiness** (epinephrine) is the next escalation step if another fluid bolus fails to restore adequate BP",
          "cat": "vital"
        },
        {
          "id": "spo22",
          "label": "SpO2 94%",
          "bad": true,
          "why": "SpO2 of 94% has fallen from triage value of 96% and now falls below the acceptable minimum of 95%, indicating progressive peripheral hypoxemia.\n\n- Declining SpO2 in the setting of **low cardiac output** reflects worsening oxygen delivery to peripheral tissues and reduced pulse oximetry signal strength\n- **Upgrading from nasal cannula to non-rebreather mask** is indicated immediately to maximize FiO2 and oxygen reserve\n- If SpO2 continues to fall despite high-flow O2, **assisted ventilation** (BVM or intubation) must be prepared",
          "cat": "vital"
        },
        {
          "id": "temp2",
          "label": "Temp 38.9°C",
          "bad": true,
          "why": "Persistent fever at 38.9°C confirms ongoing bacteremia or its inflammatory sequelae are driving the septic shock state.\n\n- Sustained fever signals the **pyrogenic stimulus** (bacteremia, endotoxin, circulating cytokines) remains active\n- Fever increases **metabolic oxygen demand**, worsening the supply-demand imbalance in already hypoperfused tissues\n- Definitive treatment is **antibiotic therapy** targeting the infectious source — antipyretics are not the priority in decompensated shock",
          "cat": "vital"
        },
        {
          "id": "cap2",
          "label": "Cap Refill 5 sec",
          "bad": true,
          "why": "Capillary refill time of 5 seconds represents severe peripheral hypoperfusion and confirms that shock is advancing rather than compensating.\n\n- Progression from 4 to 5 seconds despite 25 mL/kg prehospital fluid confirms that microcirculatory compromise is **worsening**\n- Cap refill ≥4 seconds in a child correlates with elevated lactate and end-organ dysfunction\n- Improvement to <2 seconds following resuscitation is the **target endpoint** for perfusion restoration",
          "cat": "vital"
        },
        {
          "id": "mentalstatus",
          "label": "Mental Status",
          "bad": true,
          "why": "AVPU = P in a 6-month-old represents critical neurological compromise from the combined effects of hypoglycemia, metabolic acidosis, and cerebral hypoperfusion.\n\n- All three reversible causes — **hypoglycemia, hypoperfusion, acidosis** — must be corrected urgently before attributing altered consciousness to primary neurological disease (meningitis, intracranial hemorrhage)\n- If mental status fails to improve after glucose correction and hemodynamic restoration, **LP for meningitis workup** is indicated once hemodynamically stable\n- Ongoing CNS depression increases the risk of **aspiration** and mandates close airway monitoring",
          "cat": "clinical"
        },
        {
          "id": "skinperfusion",
          "label": "Skin and Perfusion",
          "bad": true,
          "why": "Diffuse mottling extending to the trunk with cold clammy extremities represents the clinical signature of decompensated cold septic shock in an infant.\n\n- Proximal extension of mottling toward the **trunk** signals exhaustion of the vasoconstriction gradient — the body's compensatory reserve is depleted\n- This pattern correlates with worsening **lactate elevation** and predicts imminent cardiovascular collapse without immediate intervention\n- Hemodynamic intervention — volume, antibiotics, glucose, and vasopressor readiness — is required now",
          "cat": "clinical"
        },
        {
          "id": "breathsounds2",
          "label": "Breath Sounds",
          "bad": false,
          "why": "Clear, equal bilateral breath sounds with midline trachea confirm absence of tension pneumothorax and pulmonary edema at this stage of resuscitation.\n\n- **No crackles** confirm the prehospital NS bolus has not caused pulmonary edema — fluid resuscitation can safely continue\n- **Midline trachea** is the critical physical finding excluding tension pneumothorax\n- Continued clear lungs confirm that **ongoing volume resuscitation** is appropriate and not causing respiratory compromise",
          "cat": "clinical"
        },
        {
          "id": "ivaccess",
          "label": "IV Access",
          "bad": false,
          "why": "A patent peripheral IV with confirmed blood return is a reassuring functional finding that enables immediate medication delivery.\n\n- **Confirmed blood return** validates intravenous placement — critical before pushing dextrose or any osmotically active medication\n- This is a reassuring access finding — the team does not need to immediately pursue IO access as long as this line remains functional\n- However, a **single 24g PIV** is a fragile sole-access point in a critically ill infant; IO must be immediately available as backup",
          "cat": "clinical"
        }
      ],
      "labs": [
        {
          "name": "Lactate",
          "value": "5.8",
          "unit": "mmol/L",
          "ref": "0.5–2.0",
          "critical": true,
          "why": "Critically elevated lactate confirms ongoing anaerobic metabolism — the primary resuscitation endpoint to monitor.\n\n- **Lactate 5.8 mmol/L** defines the severity of septic shock and quantifies the depth of the tissue oxygen debt\n- Every intervention should be gauged against **lactate clearance** — a fall of ≥10% per hour indicates effective improvement in tissue oxygen delivery\n- Failure to clear lactate after appropriate resuscitation suggests worsening shock or uncontrolled infection source"
        },
        {
          "name": "Glucose",
          "value": "34",
          "unit": "mg/dL",
          "ref": "60–100",
          "critical": true,
          "why": "Critical hypoglycemia at 34 mg/dL is the most immediately time-sensitive metabolic emergency in this infant — neuronal injury can occur within minutes.\n\n- **D10W at 5 mL/kg** (40 mL for 8 kg) delivers 0.5 g/kg of glucose — the standard neonatal/infant correction dose\n- Hypoglycemia must be corrected **simultaneously with** the fluid bolus and antibiotic administration, not after\n- Recheck glucose in **15-30 minutes** to confirm correction and monitor for rebound hypoglycemia"
        },
        {
          "name": "Bicarbonate",
          "value": "12",
          "unit": "mEq/L",
          "ref": "18–28",
          "critical": true,
          "why": "Severe metabolic acidosis (HCO3 12) reflects the depth of lactic acid accumulation driving the shock state — and the urgency of restoring perfusion.\n\n- At HCO3 12, estimated pH is approximately **7.22-7.25**, impairing myocardial contractility and catecholamine receptor sensitivity\n- **Bicarbonate supplementation** is not indicated — treatment is directed at reversing shock and restoring aerobic metabolism\n- Improvement in HCO3 following resuscitation confirms effective restoration of **tissue oxygen delivery**"
        },
        {
          "name": "Procalcitonin",
          "value": "18.4",
          "unit": "ng/mL",
          "ref": "< 0.5",
          "critical": true,
          "why": "Procalcitonin of 18.4 ng/mL is markedly elevated, providing strong diagnostic support for bacterial sepsis as the primary etiology.\n\n- **PCT** is released by parenchymal cells in response to bacterial endotoxin and cytokines (IL-6, TNF-α) — rising within 4-6 hours of bacterial infection onset and peaking at 24-48 hours\n- PCT >**2 ng/mL** correlates with bacteremia; values >10 ng/mL are associated with septic shock from bacterial sources\n- PCT rises much less in **viral infections** — making it a valuable discriminator in febrile infants where the clinical picture is unclear\n- **Serial PCT** can guide antibiotic de-escalation as values normalize with effective treatment"
        },
        {
          "name": "WBC",
          "value": "26,800",
          "unit": "/µL",
          "ref": "6,000–17,500",
          "critical": true,
          "why": "Persistent leukocytosis confirms an ongoing bacterial inflammatory response and supports continuing empiric antibiotic therapy.\n\n- WBC 26,800/µL in a 6-month-old combined with elevated **PCT, CRP, and lactate** provides a convergent picture of bacterial sepsis\n- **Leukocytosis with bandemia** would further increase specificity for acute bacterial infection over viral illness\n- This value combined with the clinical picture mandates **antibiotic administration** without waiting for culture results"
        },
        {
          "name": "CRP",
          "value": "86",
          "unit": "mg/L",
          "ref": "0–10",
          "critical": true,
          "why": "CRP of 86 mg/L remains markedly elevated, confirming active bacterial inflammatory process and supporting ongoing empiric antibiotic therapy.\n\n- At 86 mg/L, the **inflammatory burden** from the infecting organism is substantial and ongoing\n- CRP values this high in febrile children are strongly associated with **bacterial etiology** requiring antibiotic therapy\n- While CRP does not guide real-time hemodynamic management, it confirms the appropriateness of the empiric antibiotic decision and the overall sepsis diagnosis"
        },
        {
          "name": "Hemoglobin",
          "value": "11.0",
          "unit": "g/dL",
          "ref": "9.5–13.5",
          "critical": false
        }
      ],
      "tools": ["ivKit", "o2mask", "stethoscope", "defib", "bvm", "pupilCheck"],
      "meds": ["dextrose", "ceftriaxone", "nsBolus", "epinephrine", "acetaminophen", "lorazepam"],
      "actions": {
        "tools": {
          "ivKit": {
            "label": "Confirm IV Access / Consider IO Placement",
            "ok": true,
            "priority": 1,
            "fb": "The 24-gauge peripheral IV in the left antecubital fossa is confirmed patent with excellent blood return and flushes without resistance or subcutaneous swelling. For an 8 kg infant in decompensated septic shock, this access is functional but marginal — adequate for push-dose medications but limited for rapid large-volume resuscitation.\n\n- **Blood return confirmed**: validates intravenous placement before administering dextrose or any hyperosmolar medication — extravasation would cause tissue injury\n- **24g bore**: flow rate is limited; manual pressure or pressure bags may be needed for rapid fluid delivery\n- If this IV fails, **IO access in the proximal tibia** (EZ-IO 15mm needle for pediatric patients) is the immediate rescue — do not attempt multiple peripheral IVs; go straight to IO\n- All critical medications — dextrose, antibiotics, and fluids — can be delivered through this line now; do not delay"
          },
          "o2mask": {
            "label": "Apply Non-Rebreather Mask (High-Flow O2)",
            "ok": true,
            "priority": 2,
            "fb": "Non-rebreather mask applied at 12-15 L/min. SpO2 improves from 94% to 98% within minutes of mask placement. Upgrading from nasal cannula to NRB increases FiO2 from approximately 28% to 60-90%, substantially improving the oxygen content available to hypoperfused tissues.\n\n- **NRB mask** delivers FiO2 of 60-90% depending on flow rate and mask seal — a marked improvement over nasal cannula\n- In shock states, oxygen delivery (DO2) = cardiac output × oxygen content (CaO2) — maximizing FiO2 improves the CaO2 component when cardiac output is compromised\n- SpO2 improvement to 98% is encouraging, but **SpO2 does not reflect tissue oxygen delivery** in the setting of low cardiac output and poor perfusion\n- Monitor closely for increasing work of breathing — if retractions, grunting, or apnea develop, transition immediately to **bag-mask ventilation**"
          },
          "stethoscope": {
            "label": "Reassess Heart and Lung Sounds",
            "ok": true,
            "priority": 3,
            "fb": "Lung sounds remain clear and equal bilaterally without crackles, wheeze, or decreased air entry. Heart sounds reveal tachycardia at 194 bpm with regular rhythm; no murmur, rub, or gallop is detected. These findings confirm no fluid overload and exclude primary cardiac structural disease as a contributor to shock.\n\n- **No crackles**: safe to continue IV fluid resuscitation — no pulmonary edema accumulating from prior NS bolus\n- **No murmur or gallop**: reduces concern for congenital cardiac disease (e.g., AVSD, outflow obstruction) contributing to the shock state\n- **Regular rhythm at 194 bpm**: confirms sinus tachycardia — no SVT, ventricular tachycardia, or heart block requiring separate management\n- This reassessment confirms the diagnosis remains **distributive/septic shock** and supports continuing the sepsis resuscitation bundle"
          },
          "defib": {
            "label": "Defibrillate / Cardiovert",
            "ok": false,
            "fb": "The cardiac monitor confirms sinus tachycardia — not a shockable rhythm, and not a hemodynamically unstable arrhythmia requiring synchronized cardioversion. Delivering a defibrillation shock to an 8 kg infant in sinus tachycardia would cause direct myocardial injury with zero therapeutic benefit.\n\n- **Defibrillation** is indicated only for **ventricular fibrillation or pulseless ventricular tachycardia** — neither is present here\n- **Synchronized cardioversion** is indicated for hemodynamically unstable SVT or pulsed VT — not sinus tachycardia\n- Sinus tachycardia at 194 bpm is a **physiologic compensatory response** to fever, hypovolemia, and poor cardiac output — treating the underlying sepsis will resolve it\n- Please put the paddles down and give the baby some dextrose 🔌"
          },
          "bvm": {
            "label": "Begin Bag-Mask Ventilation",
            "ok": false,
            "fb": "Mateo is breathing spontaneously with adequate tidal volumes — no apnea, no agonal respirations, no significant retractions. Initiating bag-mask ventilation in a spontaneously breathing patient risks gastric inflation, aspiration, increased intrathoracic pressure, and respiratory dyssynchrony.\n\n- **BVM ventilation** is indicated when the patient is apneic, has agonal breathing, or has inadequate respiratory effort — none of which are present now\n- Tachypnea at 64/min is the **compensatory response** to metabolic acidosis — not an indication for assisted ventilation\n- **Stage the BVM at the bedside** as an immediate rescue device; this infant's respiratory status could deteriorate with worsening metabolic acidosis or exhaustion\n- Correct management now: **high-flow O2 via NRB mask** and close monitoring — intervene only if breathing quality deteriorates 🫁"
          },
          "pupilCheck": {
            "label": "Check Pupillary Response",
            "ok": false,
            "fb": "Pupillary assessment is an appropriate secondary neurological exam in an altered infant, but it is not a priority action when the patient is in decompensated septic shock with hypoglycemia, hypotension, and absent radial pulses. [Finding if performed: pupils 3 mm bilaterally, equal, and briskly reactive to light — no signs of herniation or opioid toxicity.]\n\n- **Equal, reactive pupils** exclude transtentorial herniation and rule out opioid or anticholinergic toxidrome\n- This is a reassuring secondary-survey finding — but the primary-survey emergency (hypoglycemia, hemodynamic collapse) must be addressed first\n- The brain cannot be meaningfully neurologically examined until **perfusion and glucose are restored** — altered consciousness from hypoglycemia looks identical to that from herniation\n- Delaying dextrose and antibiotics to perform a pupil check increases the risk of irreversible neurological injury 👁️"
          }
        },
        "meds": {
          "dextrose": {
            "label": "D10W 5 mL/kg IV — 40 mL (Dextrose for Hypoglycemia)",
            "ok": true,
            "priority": 1,
            "fb": "D10W 40 mL administered IV push over 5 minutes. Bedside glucose rechecked at 15 minutes: 72 mg/dL — hypoglycemia corrected. Notably, the infant begins to show improved responsiveness within minutes of glucose delivery — eyes open more fully, and a weak but audible cry is noted for the first time since arrival.\n\n- **D10W** (dextrose 10% in water) provides 100 mg/mL; 5 mL/kg = 40 mL delivers 4 g (0.5 g/kg) — the standard correction dose for infants\n- **D10W is preferred** over D25W or D50W in infants — concentrated dextrose solutions risk hyperosmolar cerebral injury and peripheral vein damage in small vessels\n- The rapid improvement in responsiveness confirms that **hypoglycemia was a major driver** of the altered consciousness, not solely cerebral hypoperfusion\n- Recheck glucose in **15-30 minutes** to confirm sustained correction; start a **dextrose-containing maintenance fluid** (D5 ½NS) to prevent rebound hypoglycemia"
          },
          "ceftriaxone": {
            "label": "Ceftriaxone 400 mg IV (50 mg/kg) — Empiric Antibiotics",
            "ok": true,
            "priority": 2,
            "fb": "Blood cultures drawn first through the existing IV. Ceftriaxone 400 mg (50 mg/kg for 8 kg) infused IV over 30 minutes. Antibiotic administration achieved within the target window of 60 minutes from sepsis recognition.\n\n- **Ceftriaxone** is a third-generation cephalosporin with excellent gram-negative coverage (E. coli, Klebsiella, Proteus) — the most common pathogens in urinary-source infant bacteremia\n- Gram-positive coverage is adequate for Streptococcus but limited against **MRSA** or **Listeria** — if either is suspected, add vancomycin or ampicillin respectively\n- **Blood cultures must precede the first antibiotic dose** to maximize culture yield — do not delay antibiotics if cultures cannot be obtained within 15-20 minutes\n- If meningitis is clinically suspected, dose should be increased to **100 mg/kg (800 mg)** to achieve therapeutic CSF penetration\n- Each hour of delay in antibiotic administration in pediatric septic shock is independently associated with increased organ dysfunction and mortality"
          },
          "nsBolus": {
            "label": "Normal Saline 10 mL/kg IV Bolus — 80 mL",
            "ok": true,
            "priority": 3,
            "fb": "Normal saline 80 mL (10 mL/kg) administered as a rapid IV bolus over 5-10 minutes. This brings total crystalloid administered to 280 mL (35 mL/kg) including the prehospital bolus. Reassess perfusion markers — HR, cap refill, BP, mental status — immediately after completion.\n\n- **PALS recommends** 20 mL/kg isotonic crystalloid (NS or LR) IV pushes with reassessment between each bolus, up to **40-60 mL/kg total** before escalating to vasopressors\n- Total of **35 mL/kg** is within the safe resuscitation window; reassess before giving further volume\n- Monitor actively for signs of **fluid overload**: new crackles on auscultation, worsening respiratory effort, hepatomegaly — none currently present\n- If perfusion does not improve after 40-60 mL/kg total crystalloid, **epinephrine infusion** is the vasopressor of choice for cold septic shock\n- Reassess cap refill, BP, HR, and urine output after each bolus — septic shock resuscitation is iterative"
          },
          "epinephrine": {
            "label": "Epinephrine Infusion 0.1 mcg/kg/min IV (Vasopressor)",
            "ok": false,
            "fb": "Epinephrine is the correct vasopressor choice for pediatric cold septic shock — but the PALS algorithm recommends maximizing fluid resuscitation to 40-60 mL/kg before initiating vasopressors in a patient without immediate cardiovascular collapse. This infant has received 35 mL/kg total; an additional fluid bolus and reassessment should precede vasopressor initiation.\n\n- **Epinephrine** (0.1-1 mcg/kg/min) is first-line for **cold septic shock** — its combined α1 (vasoconstriction, increased SVR) and β1 (inotropy, chronotropy) effects address the low-cardiac-output, high-SVR physiology\n- **Norepinephrine** is preferred for warm septic shock (vasodilated phenotype with bounding pulses) — the wrong choice here\n- Vasopressors are indicated when shock persists despite **40-60 mL/kg** total fluid — this infant is at 35 mL/kg; one more bolus and reassessment first\n- If initiated, epinephrine must be delivered via **IO or central access** — peripheral extravasation causes severe tissue necrosis 💉"
          },
          "acetaminophen": {
            "label": "Acetaminophen 120 mg PR (Antipyretic for Fever)",
            "ok": false,
            "fb": "Fever management is not the immediate priority in decompensated septic shock. Acetaminophen addresses the symptom of fever — it does not treat the underlying bacteremia, improve cardiac output, or restore perfusion.\n\n- **Antipyretics** reduce fever by inhibiting prostaglandin E2 synthesis at the hypothalamic thermostat — effective for symptom relief but not hemodynamic stabilization\n- The fever will resolve most effectively when the **infection is treated** with antibiotics and the bacterial source is controlled\n- Priorities in decompensated shock are: **glucose, antibiotics, oxygenation, fluid resuscitation** — antipyretics are deferred to after hemodynamic stabilization\n- Acetaminophen is safe and appropriate once the patient is stable — it should not be withheld permanently, only correctly deprioritized now 🌡️"
          },
          "lorazepam": {
            "label": "Lorazepam 0.4 mg IV (Benzodiazepine)",
            "ok": false,
            "fb": "There is no seizure activity in this infant. Administering lorazepam to a non-seizing patient in decompensated septic shock would cause significant respiratory depression and could precipitate apnea, requiring emergent bag-mask ventilation in an already critically compromised infant.\n\n- **Lorazepam** (0.1 mg/kg IV) acts on **GABA-A receptors** to enhance inhibitory neurotransmission — indicated only for confirmed active seizure activity\n- The altered consciousness in this infant is caused by **hypoglycemia, metabolic acidosis, and cerebral hypoperfusion** — all reversible without benzodiazepines, and all worsened by respiratory depression\n- Administering a CNS and respiratory depressant to a patient with compromised airway protective reflexes and borderline respiratory drive increases the risk of **aspiration and apnea**\n- No seizure = no lorazepam. Correct the glucose and the perfusion — that is the treatment for this altered mental status 💤"
          }
        }
      }
    }
  ],
  "curveball": null,
  "reassessment": {
    "narrative": "Following dextrose administration, ceftriaxone infusion, high-flow oxygen via non-rebreather mask, and an additional 10 mL/kg normal saline bolus, Mateo shows early but clear signs of clinical improvement. Heart rate has decreased from 194 to 162 bpm and blood pressure has recovered to 78/54 mmHg — a wider pulse pressure reflecting improved stroke volume. Most strikingly, the infant now opens his eyes spontaneously to voice, briefly tracks faces, and produces a weak but audible cry — a dramatic improvement from AVPU-P on arrival, confirming that hypoglycemia was a primary driver of his altered consciousness. Capillary refill has shortened from 5 seconds to 3 seconds, and skin mottling has retreated from the trunk back to the distal extremities. Brachial pulses are now moderate in quality, and faint radial pulses have returned bilaterally.",
    "vitals": {
      "hr": 162,
      "rr": 48,
      "sbp": 78,
      "dbp": 54,
      "spo2": 98,
      "temp": 38.9,
      "cap": 3
    },
    "signs": [
      {
        "label": "Mental Status",
        "finding": "Eyes open spontaneously to voice; tracks faces briefly; produces weak cry; AVPU: V (responds to Voice)",
        "pos": "head",
        "sys": "neurological"
      },
      {
        "label": "Skin and Perfusion",
        "finding": "Mottling retreated to distal extremities below wrists and ankles; trunk now pink and less mottled; extremities beginning to warm",
        "pos": "body",
        "sys": "cardiovascular"
      },
      {
        "label": "Peripheral Pulses",
        "finding": "Brachial pulses moderate quality bilaterally; faint but palpable radial pulses returned bilaterally",
        "pos": "body",
        "sys": "cardiovascular"
      },
      {
        "label": "Breath Sounds",
        "finding": "Clear and equal bilaterally; no new crackles; respiratory rate improving; no increased work of breathing",
        "pos": "body",
        "sys": "respiratory"
      }
    ]
  },
  "stabilizationSummary": "Dextrose (D10W 5 mL/kg) corrected critical hypoglycemia — directly reversing the cortical depression driving AVPU-P responsiveness and global hypotonia, producing the rapid improvement in alertness that no amount of fluid alone would have achieved. Ceftriaxone 400 mg IV initiated time-sensitive empiric gram-negative coverage targeting the most likely urinary-source bacteremia, addressing the infectious driver of the entire shock cascade. An additional 10 mL/kg normal saline bolus combined with non-rebreather oxygen delivery expanded intravascular volume, improved cardiac preload, and maximized oxygen content — reflected in the recovery of blood pressure to 78/54 mmHg, retreat of mottling, and return of radial pulses.",
  "debrief": {
    "summary": "Mateo presented in decompensated septic shock — the lethal convergence of hypotension, critical hypoglycemia, severe metabolic acidosis, and impaired consciousness in a previously healthy 6-month-old. The most dangerous element was the one most likely to be overlooked: glucose of 34 mg/dL, independently driving irreversible neurological injury while the team focused on hemodynamics. The case reinforced three parallel priorities — immediate glucose correction, time-sensitive empiric antibiotics, and continuation of volume resuscitation beyond the prehospital bolus — and demonstrated the cold shock phenotype characterized by mottling, absent peripheral pulses, and narrow pulse pressure that guides vasopressor selection if fluids fail.",
    "explainers": [
      {
        "title": "Infant Septic Shock: Recognition and Phenotype",
        "content": "Septic shock in infants under 12 months carries disproportionate mortality risk because physiologic reserve is limited and early warning signs are easily mistaken for benign viral illness.\n\n- **Age-adjusted SIRS criteria**: HR >180 bpm defines tachycardia in infants; paradoxically, **bradycardia (<100 bpm)** is a late and equally dangerous finding indicating cardiovascular collapse\n- **Cold septic shock** (high SVR, low cardiac output): mottling, cold extremities, absent peripheral pulses, narrow pulse pressure — the predominant pediatric phenotype and what this case demonstrates\n- **Warm septic shock** (low SVR, distributive): bounding pulses, flushed warm skin, wide pulse pressure, flash capillary refill — less common in infants, more common in adolescents and adults\n- **Vasopressor selection** is guided by phenotype: **epinephrine** for cold shock (α + β effects); **norepinephrine** for warm shock (predominantly α effects)\n- **Common sources** in this age group: UTI/urosepsis (most common, especially uncircumcised male infants), occult bacteremia, meningitis, and pneumonia\n- **LP timing**: lumbar puncture is deferred until hemodynamic stability is achieved — never risk respiratory or cardiovascular decompensation for a diagnostic procedure in a decompensating infant",
        "tldr": "Cold shock = mottling, absent radial pulses, narrow pulse pressure. Recognize the phenotype — it determines your vasopressor."
      },
      {
        "title": "Hypoglycemia in Septic Infants: The Overlooked Emergency",
        "content": "Hypoglycemia in septic shock is an independent cause of irreversible neurological injury that must be treated with the same urgency as the hemodynamic emergency — it will not resolve with fluids alone.\n\n- **Limited glycogen stores**: a 6-month-old's hepatic glycogen reserves support only a few hours of fasting before hypoglycemia develops — far less than an adult or older child\n- **Sepsis consumes glucose**: activated neutrophils and macrophages rely heavily on anaerobic glycolysis for their high energy demands, depleting circulating glucose at an accelerated rate\n- **Gluconeogenesis is impaired**: cytokines (TNF-α, IL-1β) directly inhibit hepatic gluconeogenic enzymes, removing the backup glucose production mechanism\n- **Neuronal injury threshold**: cortical dysfunction begins rapidly at glucose below **40 mg/dL**; irreversible injury follows if hypoglycemia is prolonged\n- **Treatment**: D10W 5 mL/kg IV (0.5 g/kg) is the correct concentration for infants — avoid D25W or D50W due to hyperosmolar risk to immature vessels and brain\n- **Follow-up**: recheck glucose in 15-30 minutes; start **dextrose-containing maintenance fluids** to prevent rebound hypoglycemia",
        "tldr": "Every critically ill infant needs a glucose check. Hypoglycemia in sepsis is a neurological emergency as urgent as the hemodynamics — and fluids alone will not fix it."
      },
      {
        "title": "PALS Septic Shock Bundle: Sequence and Escalation",
        "content": "Pediatric septic shock management follows a time-sensitive resuscitation bundle where components run in parallel — not as a sequential checklist — and each step has a defined escalation trigger.\n\n- **Blood cultures first**: draw before antibiotics to maximize yield; do not delay antibiotics more than 15-20 minutes waiting for cultures\n- **Antibiotics within 60 minutes**: each hour of delay in antibiotic administration in pediatric septic shock is independently associated with increased organ dysfunction and mortality\n- **Fluid resuscitation**: 20 mL/kg isotonic crystalloid (NS or LR) IV push, repeated with reassessment after each bolus up to **40-60 mL/kg total** before initiating vasopressors\n- **Vasopressor escalation**: persistent shock after 40-60 mL/kg → initiate **epinephrine** (cold shock) or **norepinephrine** (warm shock) via IO or central access\n- **Metabolic corrections**: treat hypoglycemia, hypocalcemia, and significant electrolyte disturbances as part of the initial resuscitation — not as afterthoughts\n- **Reassess frequently**: cap refill, HR, BP, mental status, and urine output after each intervention — septic shock resuscitation is iterative, not a one-time event",
        "tldr": "Culture → Fluids → Antibiotics → Metabolic corrections → Reassess → Vasopressors if fluids fail. Run in parallel, not sequence."
      }
    ]
  }
};


export var SC5 = {
  "id": "rsv-bronchiolitis-hfnc-failure",
  "title": "Mira's Breathing Emergency",
  "tier": 2,
  "icon": "🫁",
  "tagline": "HFNC is maxed — and she's still not breathing.",
  "description": "An 8-month-old presents with worsening RSV bronchiolitis. She arrived on high-flow nasal cannula but continues to deteriorate with retractions, grunting, and dropping saturations. The team must recognize impending respiratory failure and escalate support before she fatigues.",
  "visuals": [
    "Infant in a hospital crib, nasal cannula tubing in place, chest visibly heaving with each breath",
    "Cardiac monitor showing tachycardia and SpO2 waveform trending downward",
    "Suction bulb and nasal saline on the bedside table"
  ],
  "patient": {
    "ageLabel": "8-month-old",
    "weightKg": 8,
    "sex": "Female",
    "cc": "Worsening breathing difficulty on HFNC",
    "history": "Mira Okonkwo is an 8-month-old previously healthy female born full-term with no significant medical history. She presented to the ED 18 hours ago with 3 days of rhinorrhea, cough, and progressive respiratory distress. RSV antigen test was positive. She was placed on high-flow nasal cannula (HFNC) at 8 L/min (1 L/kg/min) at 40% FiO2 and admitted to the pediatric ward. Over the past 2 hours her work of breathing has significantly increased despite maximum HFNC settings of 16 L/min (2 L/kg/min) at 60% FiO2. She is on continuous cardiorespiratory monitoring. She has had no oral intake for 10 hours and is currently NPO with an IV in place in her right hand (24-gauge). She has received no bronchodilators or steroids."
  },
  "emsReport": "Mira is an 8-month-old female transferred from the pediatric ward to the PICU on high-flow nasal cannula at maximum settings of 16 L/min at 60% FiO2. RSV-positive bronchiolitis diagnosed on admission 18 hours ago. Peripheral IV access established in right hand. No medications given during transport.",
  "learnMore": "Severe RSV bronchiolitis causes small-airway obstruction via bronchial inflammation, mucus plugging, and smooth-muscle constriction, leading to increased airway resistance, air trapping, and dynamic hyperinflation. HFNC provides modest positive distending pressure and reduces the inspiratory resistance imposed by nasal airways, but does not generate sufficient continuous positive airway pressure to reliably stent open obstructed airways. When HFNC fails — defined as persistent or worsening tachypnea, rising PCO2, or increasing FiO2 requirement — escalation to CPAP or BiPAP is the evidence-supported next step before invasive mechanical ventilation.",
  "norms": {
    "hr": [
      80,
      160
    ],
    "rr": [
      25,
      50
    ],
    "sbp": [
      70,
      100
    ],
    "dbp": [
      40,
      65
    ],
    "spo2": [
      95,
      100
    ],
    "temp": [
      36.5,
      37.5
    ]
  },
  "phases": [
    {
      "id": "triage",
      "name": "Triage",
      "narrative": "Mira is brought to the PICU bed on HFNC at maximum settings. She is awake but visibly exhausted, unable to maintain her normal level of alertness. Her chest heaves with every breath — subcostal and intercostal retractions are prominent. Audible grunting can be heard without a stethoscope at the bedside. Her nasal cannula prongs are in place and the circuit is intact. A 24-gauge peripheral IV is confirmed patent in the right dorsal hand. Continuous SpO2 and cardiac monitoring are active. Breath sounds are present bilaterally on auscultation with diffuse expiratory wheeze and transmitted upper-airway noise; there is no focal consolidation and no pneumothorax sign. Trachea is midline. Abdomen is soft and non-distended with normal bowel sounds.",
      "vitals": {
        "hr": 188,
        "rr": 72,
        "sbp": 82,
        "dbp": 52,
        "spo2": 88,
        "temp": 38.6,
        "cap": 3
      },
      "signs": [
        {
          "label": "Retractions",
          "finding": "Moderate subcostal and intercostal retractions present bilaterally with each breath; suprasternal notch tug visible",
          "pos": "body",
          "sys": "respiratory",
          "why": "Retractions reflect markedly increased work of breathing against elevated airway resistance.\n\n- **Subcostal** and **intercostal** retractions occur when the diaphragm and accessory muscles generate large negative intrathoracic pressures to force air through obstructed small airways\n- **Suprasternal tug** indicates upper-airway involvement and severe respiratory effort\n- In RSV bronchiolitis, **bronchial and peribronchial inflammation**, mucus plugging, and smooth-muscle constriction drive airway resistance to multiple times normal\n- Persistent retractions on **maximum HFNC** signal that the current support level is insufficient to offset the imposed work of breathing"
        },
        {
          "label": "Grunting",
          "finding": "Audible expiratory grunt with each breath, heard without stethoscope at the bedside",
          "pos": "face",
          "sys": "respiratory",
          "why": "Grunting is a physiologic auto-PEEP maneuver in infants with severe respiratory distress.\n\n- The infant partially closes the **glottis** during expiration to generate back-pressure, functionally mimicking external PEEP\n- This prevents **end-expiratory alveolar collapse** in the setting of diffuse small-airway obstruction and air trapping\n- Audible grunting without a stethoscope indicates the degree of glottic braking is maximal — a sign of **impending respiratory failure**\n- It is a critical clinical indicator that the infant's intrinsic compensatory mechanisms are near their limit"
        },
        {
          "label": "Skin & Perfusion",
          "finding": "Skin pale and mildly mottled over the trunk; capillary refill 3 seconds centrally; mucous membranes moist",
          "pos": "body",
          "sys": "cardiovascular",
          "why": "Pallor and delayed capillary refill reflect impaired peripheral perfusion from sympathetic-mediated vasoconstriction in the setting of hypoxemia and physiologic stress.\n\n- **Hypoxemia** triggers sympathetic discharge, causing peripheral vasoconstriction to preferentially redirect cardiac output to vital organs\n- **Capillary refill >2 seconds** centrally indicates reduced cutaneous perfusion and is a flagworthy sign of circulatory compromise\n- **Moist mucous membranes** are reassuring that the child is not severely dehydrated, but do not negate the peripheral perfusion concern\n- Mottling in an infant is an ominous sign reflecting vasomotor instability — it should prompt urgent reassessment of cardiac output"
        },
        {
          "label": "Mental Status",
          "finding": "Eyes open, but decreased baseline alertness; does not track faces or reach for objects; responds only to painful stimuli with weak cry",
          "pos": "head",
          "sys": "neurological",
          "why": "Decreased alertness in an infant with respiratory distress is a critical HFNC failure sign.\n\n- **Cerebral hypoxia** from hypoxemia (SpO2 88%) impairs cortical activity, manifesting as loss of age-appropriate engagement and weak cry\n- Failure to track faces or reach for objects is developmentally abnormal for an 8-month-old and indicates **altered sensorium**\n- In the context of escalating respiratory failure, **decreased responsiveness** signals that the infant cannot sustain the work of breathing and cardiorespiratory collapse may be imminent\n- This finding alone is an indication for **immediate respiratory support escalation** regardless of other parameters"
        },
        {
          "label": "Lung Sounds",
          "finding": "Diffuse expiratory wheeze bilaterally; transmitted upper-airway noise; breath sounds equal bilaterally; no focal crackles; trachea midline",
          "pos": "body",
          "sys": "respiratory",
          "why": "Diffuse bilateral wheeze and equal breath sounds are consistent with RSV bronchiolitis, not a unilateral process.\n\n- **Diffuse expiratory wheeze** reflects widespread small-airway narrowing due to RSV-mediated inflammation and mucus plugging — this is the expected auscultatory finding in bronchiolitis\n- **Equal breath sounds bilaterally** with **midline trachea** rule out pneumothorax, pleural effusion, or right mainstem intubation — these are the reassuring elements of this compound finding\n- The absence of **focal crackles or consolidation** makes secondary bacterial pneumonia less likely at this time\n- The transmitted upper-airway noise reflects nasal secretions passing through the HFNC circuit and does not represent a new pulmonary finding"
        },
        {
          "label": "Abdominal Exam",
          "finding": "Abdomen soft, non-distended, non-tender with normal bowel sounds; no hepatosplenomegaly",
          "pos": "body",
          "sys": "gastrointestinal",
          "why": "A soft, non-distended abdomen is a reassuring finding that rules out air-swallowing gastric distension as a complication of HFNC.\n\n- Infants on **HFNC** can develop gastric distension from swallowed high-flow air, which can splint the diaphragm and worsen respiratory mechanics\n- A **soft, non-distended abdomen** confirms this has not occurred and that abdominal compartment physiology is not contributing to respiratory compromise\n- The absence of **hepatomegaly** makes congestive heart failure from structural heart disease less likely as the primary etiology\n- This is a genuinely reassuring finding that should NOT be flagged as a concern in this scenario"
        }
      ],
      "assessItems": [
        {
          "id": "hr-188",
          "label": "HR 188 bpm",
          "bad": true,
          "why": "Sinus tachycardia at 188 bpm markedly exceeds the normal 8-month-old range of 80–160 bpm.\n\n- **Tachycardia** in this setting reflects combined physiologic stressors: hypoxemia, hypercarbia, fever, and elevated sympathetic tone from increased work of breathing\n- In the HFNC failure literature, **failure to improve tachycardia** after initiating HFNC is one of the strongest predictors of subsequent intubation\n- A **rate of 188 bpm** sustained under maximum support indicates the infant's cardiovascular system is compensating maximally\n- **Persistent or worsening tachycardia** on HFNC is a direct trigger criterion for escalating to CPAP or BiPAP",
          "cat": "vital"
        },
        {
          "id": "rr-72",
          "label": "RR 72 breaths/min",
          "bad": true,
          "why": "A respiratory rate of 72 breaths/min is severely elevated above the normal 8-month-old range of 25–50 breaths/min.\n\n- **Tachypnea** at this extreme reduces expiratory time so that each breath ends before full exhalation — this generates **dynamic hyperinflation and auto-PEEP**\n- The infant must then overcome this intrinsic PEEP on every subsequent inspiration, dramatically increasing the work of breathing\n- A **RR >60 breaths/min** in an infant on maximum HFNC is a direct criterion for evaluation of respiratory support escalation\n- **Worsening tachypnea** despite HFNC indicates the flow is not adequately offsetting airway resistance or inspiratory load",
          "cat": "vital"
        },
        {
          "id": "bp-82-52",
          "label": "BP 82/52 mmHg",
          "bad": false,
          "why": "BP 82/52 mmHg falls within the acceptable range for an 8-month-old infant (normal SBP 70–100 mmHg, DBP 40–65 mmHg).\n\n- The **minimum acceptable SBP** for an 8-month-old can be estimated as 70 + (2 × age in years) ≈ 71 mmHg; 82 mmHg exceeds this threshold\n- While this value sits in the lower half of the normal range, it is **not hypotensive** and does not indicate cardiovascular decompensation at this point\n- In the context of severe RSV bronchiolitis, the primary concern is **respiratory failure**, not hemodynamic shock\n- This vital sign should **not be flagged** — clinical energy should be directed at the respiratory compromise",
          "cat": "vital"
        },
        {
          "id": "spo2-88",
          "label": "SpO2 88%",
          "bad": true,
          "why": "SpO2 of 88% is critically low and represents significant hypoxemia despite HFNC at 60% FiO2.\n\n- Normal SpO2 in infants is **95–100%**; values below **90%** define hypoxemic respiratory failure\n- An SpO2 of 88% on **60% FiO2 via HFNC** demonstrates refractory hypoxemia — the HFNC is no longer able to maintain adequate oxygenation\n- The **V/Q mismatch** caused by mucus plugging, air trapping, and atelectasis is too severe for open-interface, flow-based oxygen delivery to overcome\n- This is a primary criterion for **HFNC failure** and mandates immediate escalation to a pressure-generating modality (CPAP/BiPAP or intubation)",
          "cat": "vital"
        },
        {
          "id": "temp-38.6",
          "label": "Temp 38.6°C",
          "bad": true,
          "why": "A temperature of 38.6°C represents a low-grade fever exceeding the normal upper limit of 37.5°C.\n\n- **Fever** in RSV bronchiolitis reflects the innate immune response to viral replication in respiratory epithelium — it is an expected but flagworthy finding\n- Fever increases **metabolic oxygen demand** and CO2 production, worsening the respiratory burden in an already-compromised infant\n- Temperature elevation also contributes to **tachycardia** and should be considered as a modifiable driver of physiologic stress\n- **Acetaminophen** is appropriate to reduce fever-related metabolic demand; antipyretics do not treat the underlying bronchiolitis but reduce physiologic stress",
          "cat": "vital"
        },
        {
          "id": "cap-3",
          "label": "Cap Refill 3 sec",
          "bad": true,
          "why": "A central capillary refill time of 3 seconds exceeds the normal threshold of less than 2 seconds.\n\n- **Capillary refill >2 seconds** centrally indicates reduced cutaneous perfusion, driven by sympathetic vasoconstriction from hypoxemia and physiologic stress\n- In the context of severe respiratory failure, prolonged cap refill reflects the **cardiovascular cost of sustained high work of breathing** and impending circulatory compromise\n- Combined with pallor and mottling on exam, this finding suggests the infant is on the verge of **decompensated cardiorespiratory failure**\n- Restoration of normal cap refill is an important endpoint of successful respiratory support escalation and hemodynamic stabilization",
          "cat": "vital"
        },
        {
          "id": "retractions",
          "label": "Retractions",
          "bad": true,
          "why": "Subcostal and intercostal retractions with suprasternal tug are signs of severe increased work of breathing.\n\n- **Retractions** indicate the respiratory muscles are generating extreme negative intrathoracic pressure to overcome elevated airway resistance\n- In RSV bronchiolitis, **airway resistance** is increased due to bronchial inflammation, mucus plugging, and smooth-muscle bronchoconstriction\n- Retractions persisting on **maximum HFNC** directly signal the modality has reached its therapeutic ceiling\n- This finding, especially combined with grunting and decreased alertness, constitutes an **HFNC failure triad** requiring immediate escalation",
          "cat": "clinical"
        },
        {
          "id": "grunting",
          "label": "Grunting",
          "bad": true,
          "why": "Audible expiratory grunting is a critical sign of imminent respiratory failure in infants.\n\n- **Grunting** represents voluntary glottic braking — the infant is generating intrinsic PEEP to prevent end-expiratory alveolar collapse\n- When grunting becomes **audible without a stethoscope**, the infant's auto-PEEP generation is at maximum capacity\n- This is a terminal compensatory mechanism; once the infant fatigues, alveolar collapse will occur rapidly with precipitous **oxygen desaturation and hypercapnia**\n- Audible grunting in an infant on maximum HFNC is a **code-level warning** sign: escalation must happen before, not after, the infant fatigues",
          "cat": "clinical"
        },
        {
          "id": "skin-perfusion",
          "label": "Skin & Perfusion",
          "bad": true,
          "why": "Pallor, mottling, and central capillary refill of 3 seconds confirm impaired peripheral perfusion.\n\n- **Pallor and mottling** reflect vasomotor instability from maximal sympathetic discharge in response to hypoxemia and physiologic stress\n- **Central mottling** over the trunk is particularly concerning — peripheral mottling can be seen with ambient cold, but truncal mottling indicates systemic hemodynamic compromise\n- The **moist mucous membranes** are the only reassuring element here, confirming this is not a dehydration-mediated finding\n- The overall integrated picture of pallor + mottling + 3-second refill is a **flag for impending cardiovascular decompensation** and must be acted upon",
          "cat": "clinical"
        },
        {
          "id": "mental-status",
          "label": "Mental Status",
          "bad": true,
          "why": "Decreased alertness and absent age-appropriate behavior are critical warning signs of cerebral hypoxia.\n\n- An 8-month-old should actively track faces, reach for objects, and respond to voice — **absence of these behaviors** is developmentally abnormal and indicates altered sensorium\n- **Cerebral hypoxia** from SpO2 88% impairs cortical activity; the weak cry in response to pain only indicates the infant is in a pre-arrest state of neurological depression\n- Altered mental status from hypoxemia is a **non-recoverable warning** — if left untreated, the next step is apnea and cardiorespiratory arrest\n- **AAP and PALS guidelines** both identify decreased responsiveness as a primary criterion for immediate airway intervention",
          "cat": "clinical"
        },
        {
          "id": "lung-sounds",
          "label": "Lung Sounds",
          "bad": false,
          "why": "Bilateral equal breath sounds with a midline trachea are reassuring against pneumothorax, tension pneumothorax, or unilateral consolidation.\n\n- **Equal bilateral breath sounds** confirm that air entry is symmetric — unequal sounds would raise concern for pneumothorax, mucus plug, or mainstem intubation\n- **Midline trachea** rules out mediastinal shift from a tension pneumothorax, which can mimic severe respiratory distress\n- **Diffuse expiratory wheeze** is consistent with the known RSV bronchiolitis diagnosis — it is expected, not a new or escalating concern\n- The absence of **focal consolidation or crackles** makes superimposed bacterial pneumonia less likely at this time, narrowing the differential back to the primary RSV diagnosis",
          "cat": "clinical"
        },
        {
          "id": "abdominal-exam",
          "label": "Abdominal Exam",
          "bad": false,
          "why": "A soft, non-distended abdomen rules out gastric air-distension as a HFNC complication.\n\n- Infants on **high-flow nasal cannula** can swallow significant volumes of delivered air, causing **gastric distension** that mechanically splints the diaphragm and worsens respiratory mechanics\n- A **non-distended, soft abdomen** confirms this complication has not occurred and that diaphragmatic excursion is not being mechanically compromised by abdominal contents\n- Absence of **hepatomegaly** makes congestive heart failure from structural heart disease unlikely as a primary driver\n- This is a genuinely normal and **reassuring finding** in this context — no action required based on abdominal exam alone",
          "cat": "clinical"
        },
        {
          "id": "vbg-ph",
          "label": "pH",
          "bad": true,
          "why": "A venous blood gas pH of 7.22 indicates combined respiratory acidosis with a metabolic component.\n\n- Normal blood pH is **7.35–7.45**; a pH of 7.22 represents significant acidemia\n- In RSV bronchiolitis, **CO2 retention** from hypoventilation (inadequate minute ventilation against high airway resistance) drives **respiratory acidosis** — this is the primary mechanism\n- The associated **bicarbonate depletion** reflects a degree of metabolic acidosis from tissue hypoxia and hypoperfusion\n- A **pH <7.25 on venous gas** in an infant on maximum HFNC is a strong criterion for escalation to CPAP/BiPAP or intubation",
          "cat": "lab"
        },
        {
          "id": "vbg-pco2",
          "label": "pCO2",
          "bad": true,
          "why": "A venous pCO2 of 68 mmHg demonstrates significant CO2 retention (hypercapnia) and ventilatory failure.\n\n- Normal venous pCO2 is approximately **41–51 mmHg** (venous adds ~5 mmHg to arterial values)\n- A pCO2 of 68 mmHg confirms **alveolar hypoventilation** — the infant cannot generate adequate minute ventilation to clear CO2 despite tachypnea\n- This results from **dynamic hyperinflation and auto-PEEP**: tachypnea shortens expiratory time, gas is trapped, dead-space fraction rises, and net alveolar ventilation falls despite high respiratory rate\n- **Rising pCO2 on HFNC** is the single strongest predictor of HFNC failure and need for escalation or intubation",
          "cat": "lab"
        },
        {
          "id": "vbg-hco3",
          "label": "HCO3",
          "bad": true,
          "why": "A bicarbonate of 17 mEq/L is below the normal range and indicates a concurrent metabolic acidosis.\n\n- Normal bicarbonate is **22–26 mEq/L**; 17 mEq/L represents bicarbonate depletion\n- In the setting of respiratory acidosis (pH 7.22, pCO2 68), a bicarbonate of **only 17** means there is NOT adequate metabolic compensation — instead, metabolic acidosis is adding to the pH drop\n- The metabolic component arises from **tissue hypoxia** (SpO2 88%), which drives anaerobic metabolism and lactic acid production\n- Internal consistency check: pH 7.22 with pCO2 68 and HCO3 17 is consistent — **Henderson-Hasselbalch** confirms combined respiratory + metabolic acidosis",
          "cat": "lab"
        },
        {
          "id": "lactate",
          "label": "Lactate",
          "bad": true,
          "why": "A lactate of 3.8 mmol/L confirms anaerobic metabolism from tissue hypoxia.\n\n- Normal lactate is **<2.0 mmol/L**; values above 2 indicate anaerobic metabolism\n- A lactate of **3.8 mmol/L** in this infant reflects tissue oxygen debt from SpO2 88% — cells have shifted to anaerobic glycolysis because oxygen delivery is insufficient for aerobic metabolism\n- This also explains the **bicarbonate depletion** (HCO3 17): lactic acid is consuming bicarbonate buffer reserves\n- **Trending lactate** during resuscitation is a key endpoint — a falling lactate confirms that respiratory support escalation is restoring oxygen delivery",
          "cat": "lab"
        },
        {
          "id": "glucose",
          "label": "Glucose",
          "bad": false,
          "why": "A blood glucose of 88 mg/dL is within the normal range for an infant.\n\n- Normal glucose in infants is **70–110 mg/dL**; 88 mg/dL is reassuringly normal\n- Hypoglycemia is a risk in acutely ill infants who have had decreased oral intake, but is not present here\n- This finding does **not require intervention** and should not distract from the primary respiratory emergency\n- Continued monitoring is prudent given NPO status, but this is not an actionable concern at the present time",
          "cat": "lab"
        },
        {
          "id": "wbc",
          "label": "WBC",
          "bad": false,
          "why": "A WBC of 11.8 K/µL is within normal limits and does not suggest bacterial superinfection.\n\n- Normal WBC in an 8-month-old is **6–15 K/µL**; 11.8 is well within range\n- RSV bronchiolitis is a **viral illness** — leukocytosis with a left shift would raise concern for bacterial superinfection, but this count is reassuringly normal\n- UCSF and AAP guidelines note that **routine CBC is not indicated** for uncomplicated bronchiolitis; when obtained, a normal WBC supports viral-only etiology\n- This value should **not be flagged** — it is a reassuring distractor for learners who might over-interpret any lab in a sick infant",
          "cat": "lab"
        },
        {
          "id": "rsv-antigen",
          "label": "RSV Antigen",
          "bad": true,
          "why": "A positive RSV antigen confirms RSV as the causative pathogen of this bronchiolitis episode.\n\n- **RSV (Respiratory Syncytial Virus)** is the most common cause of bronchiolitis and accounts for 60–80% of cases in infants under 12 months\n- The positive antigen result confirms that this is a **viral, not bacterial** lower respiratory tract infection — antibiotics are not indicated\n- RSV primarily infects **bronchiolar epithelium**, triggering a cascade of inflammation, mucus hypersecretion, cell sloughing, and smooth-muscle bronchoconstriction that narrows small-airway lumens\n- This result is flagworthy because it **defines the diagnosis** and guides the treatment pathway: supportive care, suction, respiratory support escalation — not antibiotics, not bronchodilators",
          "cat": "lab"
        },
        {
          "id": "hemoglobin",
          "label": "Hemoglobin",
          "bad": false,
          "why": "A hemoglobin of 10.8 g/dL is within the normal range for an 8-month-old.\n\n- Infants 6–12 months old have a **physiologic nadir of hemoglobin** around 9.5–12 g/dL; 10.8 g/dL is within acceptable range\n- While lower hemoglobin reduces oxygen-carrying capacity, a value of **10.8 g/dL** does not independently require transfusion\n- The primary oxygen-delivery problem in this patient is **ventilatory failure and hypoxemia**, not anemia — correcting the respiratory failure will restore oxygen delivery more effectively than transfusion\n- This finding is **not actionable** and should not distract from the respiratory emergency",
          "cat": "lab"
        }
      ],
      "labs": [
        {
          "name": "pH",
          "value": "7.22",
          "unit": "",
          "ref": "7.35–7.45",
          "critical": true,
          "why": "pH 7.22 represents significant acidemia from combined respiratory and metabolic acidosis.\n\n- **Respiratory component**: CO2 retention from alveolar hypoventilation drives pH down\n- **Metabolic component**: tissue hypoxia generates lactic acid, consuming bicarbonate buffer\n- pH <7.25 in an infant on maximum HFNC is a **direct escalation criterion**\n- Internal consistency: pH 7.22 is consistent with pCO2 68 and HCO3 17 by **Henderson-Hasselbalch**"
        },
        {
          "name": "pCO2",
          "value": "68",
          "unit": "mmHg",
          "ref": "41–51 mmHg",
          "critical": true,
          "why": "pCO2 68 mmHg confirms ventilatory failure with CO2 retention despite tachypnea.\n\n- **Dynamic hyperinflation** from rapid breathing shortens expiration, trapping gas and increasing dead-space fraction\n- Net **alveolar minute ventilation** falls despite elevated respiratory rate — the shallow, rapid breaths are not efficiently clearing CO2\n- **Rising pCO2** on maximum HFNC is the strongest single predictor of HFNC failure\n- Escalation to CPAP/BiPAP or intubation is required to restore adequate alveolar ventilation"
        },
        {
          "name": "HCO3",
          "value": "17",
          "unit": "mEq/L",
          "ref": "22–26 mEq/L",
          "critical": true,
          "why": "Bicarbonate of 17 mEq/L indicates concurrent metabolic acidosis, not compensatory.\n\n- Normal metabolic **compensation** for a primary respiratory acidosis would produce an elevated bicarbonate — here bicarbonate is LOW, confirming a **second independent acidosis**\n- Metabolic acidosis arises from **lactic acid** generated by anaerobic metabolism in hypoxic tissues (lactate 3.8 mmol/L)\n- HCO3 17 is consistent with pH 7.22 and pCO2 68 — the lab values are internally coherent\n- Bicarbonate will not normalize until both **CO2 retention** and **tissue hypoxia** are corrected"
        },
        {
          "name": "Lactate",
          "value": "3.8",
          "unit": "mmol/L",
          "ref": "0.5–2.0 mmol/L",
          "critical": true,
          "why": "Lactate 3.8 mmol/L confirms tissue oxygen debt and anaerobic metabolism.\n\n- **Lactate >2.0 mmol/L** indicates cells have shifted to anaerobic glycolysis because oxygen delivery is insufficient\n- The primary driver here is **hypoxemia** (SpO2 88%) combined with possible low cardiac output from the physiologic stress of severe respiratory distress\n- Elevated lactate explains **bicarbonate consumption** (HCO3 17): lactic acid is being buffered by the bicarbonate system\n- A **falling lactate** during treatment is a key marker that oxygen delivery is being restored"
        },
        {
          "name": "Glucose",
          "value": "88",
          "unit": "mg/dL",
          "ref": "70–110 mg/dL",
          "critical": false
        },
        {
          "name": "WBC",
          "value": "11.8",
          "unit": "K/µL",
          "ref": "6–15 K/µL",
          "critical": false
        },
        {
          "name": "RSV Antigen",
          "value": "Positive",
          "unit": "",
          "ref": "Negative",
          "critical": true,
          "why": "Positive RSV antigen confirms the viral etiology and directs supportive management.\n\n- **RSV** is responsible for 60–80% of bronchiolitis cases in infants under 12 months\n- A positive antigen confirms **viral bronchiolitis** as the diagnosis, making antibiotics unnecessary\n- RSV causes **bronchiolar epithelial necrosis**, triggering inflammation, mucus plugging, and smooth-muscle bronchoconstriction\n- Treatment is entirely **supportive**: airway clearance, respiratory support escalation, hydration — no specific antiviral therapy available for routine use"
        },
        {
          "name": "Hemoglobin",
          "value": "10.8",
          "unit": "g/dL",
          "ref": "9.5–13.5 g/dL",
          "critical": false
        }
      ],
      "tools": null,
      "meds": null,
      "actions": null
    },
    {
      "id": "escalation",
      "name": "Escalation",
      "narrative": "Despite being on HFNC at maximum settings (16 L/min, 60% FiO2), Mira continues to deteriorate. She is exhausted, grunting with every breath, and her SpO2 has fallen to 88%. Venous blood gas shows pH 7.22, pCO2 68 mmHg, and HCO3 17 mEq/L — she is in combined respiratory and metabolic acidosis. Her tachycardia of 188 bpm and RR of 72 breaths/min have not responded to HFNC. She is moving toward respiratory arrest. The PICU attending has been notified. The pediatric anesthesia team is en route for airway backup. The bedside nurse has confirmed patent IV access in the right dorsal hand. The patient is currently on continuous cardiorespiratory monitoring with waveform capnography available. A bulb syringe and nasal saline are at the bedside. Your escalation decisions must be made now.",
      "vitals": {
        "hr": 188,
        "rr": 72,
        "sbp": 82,
        "dbp": 52,
        "spo2": 88,
        "temp": 38.6,
        "cap": 3
      },
      "signs": [
        {
          "label": "Respiratory Effort",
          "finding": "Increasing subcostal, intercostal, and suprasternal retractions; paradoxical abdominal breathing (seesaw pattern) developing; grunting with every breath",
          "pos": "body",
          "sys": "respiratory",
          "why": "The seesaw pattern indicates diaphragmatic-thoracic dyscoordination from near-exhaustion of respiratory muscles.\n\n- **Paradoxical breathing** (chest moves in while abdomen moves out during inspiration) occurs when accessory muscles are overwhelmed and thoracic chest wall is being pulled inward by severe negative intrathoracic pressure\n- This pattern signals **imminent respiratory muscle fatigue** — the infant can no longer sustain coordinated respiratory effort\n- Seesaw breathing is a **pre-arrest pattern** in infants and should be treated with the same urgency as apnea\n- Immediate **non-invasive or invasive ventilatory support** is required to rest the respiratory muscles"
        },
        {
          "label": "Nasal Secretions",
          "finding": "Thick, copious clear nasal secretions visible around HFNC prongs; audible snoring quality to inspiratory breath sounds",
          "pos": "face",
          "sys": "respiratory",
          "why": "Nasal secretions in infants are a primary cause of increased upper-airway resistance and HFNC failure.\n\n- Infants are **obligate nasal breathers** — nasal secretion obstruction dramatically increases inspiratory resistance\n- Thick secretions impair HFNC efficacy by **occluding prong-to-airway interface**, reducing delivered flow and FiO2 at the level of the nasopharynx\n- **Gentle nasopharyngeal suction** prior to CPAP or intubation reduces airway resistance and can produce brief but meaningful improvement in SpO2 and work of breathing\n- Suction should be performed **before mask or CPAP application** to prevent pushing secretions deeper into the airway"
        },
        {
          "label": "Neurological State",
          "finding": "Eyes half-open, no eye contact or response to voice; responds to sternal rub with weak grimace only; tone decreased",
          "pos": "head",
          "sys": "neurological",
          "why": "Deteriorating neurological state indicates progressive cerebral hypoxia and hypercapnia.\n\n- **Hypercapnia** (pCO2 68 mmHg) causes cerebral vasodilation and CO2 narcosis, further depressing the level of consciousness\n- **Hypoxemia** (SpO2 88%) impairs neuronal ATP production, reducing cortical activity\n- Decreased tone in infants is a late pre-arrest sign reflecting global **CNS depression** from combined respiratory and metabolic acidosis\n- At this stage the infant **cannot protect her airway** and loss of airway reflexes followed by apnea is imminent"
        },
        {
          "label": "Chest Wall Motion",
          "finding": "Visually reduced bilateral chest rise with each breath compared to admission; hyperinflated anteroposterior chest diameter noted",
          "pos": "body",
          "sys": "respiratory",
          "why": "Reduced chest rise despite maximal effort indicates worsening gas trapping and dynamic hyperinflation.\n\n- **Dynamic hyperinflation** from incomplete exhalation causes progressive air trapping, increasing functional residual capacity beyond normal\n- The lungs are already **near total lung capacity** at end-expiration, leaving less room for tidal volume on each inspiration despite extreme respiratory effort\n- **Hyperinflated AP diameter** (barrel chest) is a visual correlate of air trapping — ribs and sternum are pushed outward by chronically elevated intrathoracic volume\n- Reduced chest excursion despite massive effort predicts that **tidal volume is critically low**, driving the hypercapnia and V/Q mismatch",
          "cat": "respiratory"
        },
        {
          "label": "Heart Sounds",
          "finding": "Tachycardic at 188 bpm; regular rhythm; no murmur; no gallop",
          "pos": "body",
          "sys": "cardiovascular",
          "why": "Tachycardia is the clinically significant element; rhythm and absence of murmur are reassuring.\n\n- **Heart rate 188 bpm** remains above normal range (80–160 bpm) for this age, driven by hypoxemia, sympathetic activation, and fever\n- **Regular rhythm** without murmur or gallop rules out arrhythmia and structural heart disease as contributors\n- The absence of a **new murmur** is important — severe pulmonary hypertension from hypoxemia could cause a tricuspid regurgitation murmur; its absence is reassuring\n- The tachycardia alone is flagworthy; the absence of rhythm abnormality narrows the differential and guides management toward **respiratory cause**"
        },
        {
          "label": "IV Access",
          "finding": "24-gauge peripheral IV in right dorsal hand; flushes without resistance; no swelling or infiltration at site",
          "pos": "body",
          "sys": "vascular",
          "why": "Patent IV access is critically important for medication delivery during respiratory escalation.\n\n- A **24-gauge IV** is the smallest acceptable gauge for emergent medication administration in an infant; it is adequate for bolus medications but has high resistance for rapid fluid administration\n- A **patent, non-infiltrated IV** confirms that emergency medications (sedatives, paralytics, vasopressors if needed) can be administered without delay\n- **Confirmation of IV patency** before escalation prevents the worst-case scenario: attempting intubation induction without working access\n- If IV access were lost, **IO placement** (tibial intraosseous) should be established immediately; the ivKit tool covers this contingency"
        }
      ],
      "assessItems": [],
      "labs": [
        {
          "name": "pH",
          "value": "7.22",
          "unit": "",
          "ref": "7.35–7.45",
          "critical": true,
          "why": "pH 7.22 confirms ongoing combined acidosis requiring immediate respiratory support escalation."
        },
        {
          "name": "pCO2",
          "value": "68",
          "unit": "mmHg",
          "ref": "41–51 mmHg",
          "critical": true,
          "why": "pCO2 68 mmHg demonstrates ventilatory failure — CO2 retention is worsening on maximum HFNC."
        },
        {
          "name": "HCO3",
          "value": "17",
          "unit": "mEq/L",
          "ref": "22–26 mEq/L",
          "critical": true,
          "why": "Bicarbonate 17 mEq/L confirms concurrent metabolic acidosis from tissue hypoxia."
        },
        {
          "name": "Lactate",
          "value": "3.8",
          "unit": "mmol/L",
          "ref": "0.5–2.0 mmol/L",
          "critical": true,
          "why": "Lactate 3.8 mmol/L confirms tissue oxygen debt; trending this value guides resuscitation adequacy."
        },
        {
          "name": "Glucose",
          "value": "88",
          "unit": "mg/dL",
          "ref": "70–110 mg/dL",
          "critical": false
        }
      ],
      "tools": [
        "suction",
        "bvm",
        "bvmReady",
        "ivKit",
        "defib",
        "stethoscope"
      ],
      "meds": [
        "racemicEpi",
        "albuterol",
        "acetaminophen",
        "dextrose",
        "epinephrine",
        "nsBolus"
      ],
      "actions": {
        "tools": {
          "suction": {
            "label": "Perform Nasopharyngeal Suction",
            "ok": true,
            "priority": 1,
            "fb": "You gently suction Mira's nares with a bulb syringe, clearing thick mucopurulent secretions. Her SpO2 briefly improves to 91% and the snoring quality to her breath sounds resolves. Secretion clearance reduces upper-airway resistance and temporarily improves HFNC efficacy, but her work of breathing and blood gas remain critical — this buys a minute, not a solution."
          },
          "bvmReady": {
            "label": "Bring Bag-Mask to Bedside",
            "ok": true,
            "priority": 2,
            "fb": "Correct preparatory action. A properly sized BVM (size 1 infant mask) is staged at the bedside and connected to wall oxygen at 10 L/min. If CPAP fails or the patient apneas, the team can immediately transition to positive-pressure ventilation. Preparation before deterioration prevents the deadly 30-second scramble for equipment during a code."
          },
          "ivKit": {
            "label": "Confirm IV/IO Access",
            "ok": true,
            "priority": 3,
            "fb": "You confirm the 24-gauge peripheral IV in the right dorsal hand is patent and flushes freely. Wristband is confirmed. Access is adequate for emergency medications. If IV access were lost, tibial intraosseous placement would be immediately required before any procedural sedation or intubation could proceed safely."
          },
          "stethoscope": {
            "label": "Auscultate Lung Fields",
            "ok": true,
            "priority": 4,
            "fb": "Repeat auscultation confirms diffuse bilateral expiratory wheeze with globally reduced air entry. Breath sounds remain equal bilaterally — no new unilateral silence, no tension pneumothorax pattern. The trachea is midline. This assessment confirms the clinical picture is consistent with progressive RSV bronchiolitis without a mechanical airway complication requiring needle decompression."
          },
          "bvm": {
            "label": "Begin Bag-Mask Ventilation",
            "ok": false,
            "fb": "Not the right first move. Mira still has a respiratory drive — she is breathing 72 times per minute. Jumping directly to BVM ventilation before attempting CPAP/BiPAP escalation bypasses a critical intermediate step. BVM is reserved for apnea or agonal breathing. Initiating mask ventilation in a conscious, fighting infant also risks vomiting, gastric distension, and aspiration. Stage the BVM at the bedside; escalate to CPAP/BiPAP first."
          },
          "defib": {
            "label": "Apply Defibrillator Pads",
            "ok": false,
            "fb": "The cardiac monitor shows sinus tachycardia at 188 bpm — no shockable rhythm is present. Placing defibrillator pads is not indicated and wastes precious time that should be spent escalating respiratory support. Please put down the paddles and pick up the suction catheter."
          },
          "needleDecomp": {
            "label": "Needle Decompression",
            "ok": false,
            "fb": "Needle decompression is not indicated here. Breath sounds are equal bilaterally with a midline trachea — there is no clinical evidence of tension pneumothorax. The diffuse bilateral wheeze and hyperinflated chest are consistent with RSV air trapping, not unilateral pleural air. Performing needle decompression without a tension pneumothorax will cause a iatrogenic pneumothorax and significantly worsen the patient's respiratory status."
          }
        },
        "meds": {
          "racemicEpi": {
            "label": "Racemic Epinephrine 0.05 mL/kg nebulized",
            "ok": false,
            "fb": "Racemic epinephrine is not indicated for RSV bronchiolitis. Its primary mechanism — alpha-1-mediated mucosal vasoconstriction — reduces subglottic edema in croup, not the lower-airway inflammation and mucus plugging of bronchiolitis. It provides no benefit in bronchiolitis and risks tachycardia, hypertension, and a rebound effect. Current AAP and UCSF bronchiolitis guidelines explicitly recommend against its use."
          },
          "albuterol": {
            "label": "Albuterol 0.15 mg/kg (min 2.5 mg) nebulized",
            "ok": false,
            "fb": "Albuterol is not effective in RSV bronchiolitis and is not recommended. Bronchiolitis causes airway obstruction via viral inflammation, mucus plugging, and cell debris — not smooth-muscle bronchospasm that responds to beta-2 agonism. Multiple RCTs and the AAP Clinical Practice Guideline demonstrate no reduction in hospitalization duration, ICU admission, or intubation rate with albuterol in bronchiolitis. It should not be given."
          },
          "acetaminophen": {
            "label": "Acetaminophen 15 mg/kg IV (120 mg)",
            "ok": true,
            "priority": 2,
            "fb": "Correct. Acetaminophen 15 mg/kg IV (120 mg for 8 kg) is administered for Mira's fever of 38.6°C. Reducing fever decreases metabolic oxygen demand and CO2 production, lowering the respiratory load. While this will not resolve the HFNC failure, it is a clinically sound supportive measure. IV route is preferred given NPO status and the risk of aspiration with oral medications."
          },
          "dextrose": {
            "label": "D10W 2 mL/kg (16 mL) IV push",
            "ok": false,
            "fb": "Dextrose is not indicated here. Mira's blood glucose is 88 mg/dL — firmly within normal range. Administering unnecessary glucose risks hyperglycemia, which worsens outcomes in critically ill pediatric patients by impairing neutrophil function and increasing cerebral injury risk. Reserve dextrose for documented or symptomatic hypoglycemia (glucose <50 mg/dL in infants)."
          },
          "epinephrine": {
            "label": "Epinephrine 0.01 mg/kg (0.08 mg) IV/IO for arrest",
            "ok": false,
            "fb": "Epinephrine is a cardiac arrest and anaphylaxis medication. Mira currently has a pulse and a blood pressure — she is NOT in cardiac arrest. Administering epinephrine IV in a non-arrest infant with HR 188 bpm risks inducing ventricular fibrillation or dangerous supraventricular tachycardia. Focus on escalating her respiratory support to prevent arrest rather than treating a condition she does not yet have."
          },
          "nsBolus": {
            "label": "Normal Saline 20 mL/kg (160 mL) IV bolus",
            "ok": false,
            "fb": "A full 20 mL/kg NS bolus is not indicated and potentially harmful. Mira's SBP is 82 mmHg — within normal range for age. She does not have hemodynamic shock requiring fluid resuscitation. In severe bronchiolitis, excess IV fluid can worsen pulmonary edema and increase airway secretions. Current guidelines support maintenance IV fluids (given NPO status) at approximately 100 mL/kg/day for the first 10 kg — not an emergency bolus."
          }
        }
      }
    }
  ],
  "curveball": null,
  "reassessment": {
    "narrative": "Following nasopharyngeal suction, fever management with IV acetaminophen, and immediate escalation to CPAP at 6 cmH2O with 60% FiO2 (initiated by the PICU team after your preparatory actions), Mira shows meaningful clinical improvement. Her SpO2 rises from 88% to 94% within 10 minutes of CPAP initiation. The audible grunting diminishes as CPAP provides the positive end-expiratory pressure she was generating manually with her glottis. Retractions decrease from severe to mild. Her tachycardia improves from 188 to 158 bpm and her respiratory rate slows from 72 to 52 breaths/min as respiratory muscle fatigue is relieved. She begins to open her eyes and track faces again — a reassuring return of cortical function as hypoxemia and hypercapnia begin to correct.",
    "vitals": {
      "hr": 158,
      "rr": 52,
      "sbp": 86,
      "dbp": 54,
      "spo2": 94,
      "temp": 37.9,
      "cap": 2
    },
    "signs": [
      {
        "label": "Retractions",
        "finding": "Mild subcostal retractions only; suprasternal tug and intercostal retractions resolved",
        "pos": "body",
        "sys": "respiratory"
      },
      {
        "label": "Grunting",
        "finding": "Grunting resolved; expiratory sounds quiet on auscultation",
        "pos": "face",
        "sys": "respiratory"
      },
      {
        "label": "Mental Status",
        "finding": "Eyes open, tracks faces; responds to voice; tone improved; consolable with voice",
        "pos": "head",
        "sys": "neurological"
      },
      {
        "label": "Skin & Perfusion",
        "finding": "Pallor improved; mottling resolved; capillary refill 2 seconds centrally",
        "pos": "body",
        "sys": "cardiovascular"
      }
    ]
  },
  "stabilizationSummary": "Nasopharyngeal suction cleared thick secretions that were occluding the HFNC interface, reducing upper-airway resistance and temporarily improving SpO2 — a necessary preparatory step before CPAP mask application. BVM staged at the bedside ensured the team was ready for immediate positive-pressure ventilation if the patient apnead during the transition. Acetaminophen reduced fever-driven metabolic oxygen demand and CO2 production, lowering the respiratory burden and contributing to the modest improvement in tachycardia.",
  "debrief": {
    "summary": "Mira presented with RSV bronchiolitis progressing to HFNC failure, evidenced by combined respiratory and metabolic acidosis (pH 7.22, pCO2 68 mmHg), refractory hypoxemia (SpO2 88% on 60% FiO2), and pre-arrest neurological signs. The correct clinical sequence was: (1) recognize HFNC failure using the failure triad of persistent tachypnea, rising pCO2, and declining mental status; (2) clear secretions to optimize the airway before applying a face mask; (3) stage BVM at bedside as immediate backup; (4) confirm IV access before any procedural escalation; and (5) manage fever as a modifiable contributor to respiratory load. Escalation to CPAP — not bronchodilators, not albuterol, not epinephrine — is the evidence-supported next step in HFNC-failing bronchiolitis.",
    "explainers": [
      {
        "title": "Why HFNC Fails in RSV Bronchiolitis",
        "content": "HFNC provides flow-based oxygen delivery and modest nasopharyngeal washout but cannot generate reliable continuous positive airway pressure sufficient to stent open severely obstructed small airways.\n\n- **RSV bronchiolitis** causes bronchial inflammation, mucus plugging, and smooth-muscle bronchoconstriction that dramatically increase small-airway resistance\n- **Air trapping and dynamic hyperinflation** develop when tachypnea shortens expiratory time — incomplete exhalation generates auto-PEEP and progressively reduces tidal volume\n- **HFNC failure criteria** include: FiO2 requirement >50%, worsening tachypnea, rising pCO2, declining mental status, or SpO2 persistently <90%\n- **CPAP** applies a fixed positive end-expiratory pressure that counteracts auto-PEEP, stents collapsed distal airways open, and reduces the work of breathing — mechanisms HFNC cannot replicate\n- **Intubation** is reserved for CPAP/BiPAP failure, apnea, or inability to protect the airway",
        "tldr": "HFNC cannot generate sufficient PEEP to overcome severe bronchiolitis-related airway obstruction; CPAP is the evidence-based next step when HFNC fails."
      },
      {
        "title": "Why Albuterol and Racemic Epinephrine Are Contraindicated",
        "content": "RSV bronchiolitis is not bronchospasm — it is airway obstruction from inflammation and mucus, making bronchodilators ineffective and potentially harmful.\n\n- **Albuterol** (beta-2 agonist) relaxes bronchial smooth muscle — effective in asthma where bronchoconstriction is the primary mechanism, ineffective when obstruction is from **mucus, debris, and edema**\n- Multiple **RCTs and meta-analyses** show albuterol does not reduce hospitalization, ICU admission, or intubation rates in bronchiolitis\n- **Racemic epinephrine** reduces subglottic mucosal edema via alpha-1 vasoconstriction — its indication is **croup** (laryngotracheobronchitis), not bronchiolitis\n- Both medications add **tachycardia** in an already tachycardic infant, increasing myocardial oxygen demand\n- **AAP Clinical Practice Guideline** explicitly recommends against routine bronchodilator use in bronchiolitis",
        "tldr": "Albuterol and racemic epinephrine treat bronchoconstriction and croup respectively — neither addresses the mucus-plugging and inflammation mechanism of RSV bronchiolitis."
      },
      {
        "title": "Reading the Blood Gas: Combined Acidosis Pattern",
        "content": "The venous blood gas in this scenario shows a combined (mixed) respiratory and metabolic acidosis — a pattern that changes management compared to either acidosis alone.\n\n- **pH 7.22**: significantly acidemic (normal 7.35–7.45); the magnitude exceeds what either acidosis alone would cause\n- **pCO2 68 mmHg**: primary respiratory acidosis from alveolar hypoventilation — CO2 cannot be cleared despite tachypnea because dynamic hyperinflation reduces effective alveolar ventilation\n- **HCO3 17 mEq/L**: below normal (22–26) — confirms this is NOT metabolic compensation (which would raise HCO3); instead it is a **second independent acidosis**\n- **Metabolic component** arises from **lactic acidosis** (lactate 3.8 mmol/L) driven by tissue hypoxia — lactic acid consumes bicarbonate buffer\n- **Clinical implication**: the metabolic acidosis will not resolve with bicarbonate infusion alone — it resolves only when **oxygen delivery is restored** by fixing the respiratory failure\n- **Henderson-Hasselbalch consistency check**: pH 7.22 with pCO2 68 and HCO3 17 is internally coherent — do this check mentally for every blood gas",
        "tldr": "pH 7.22, pCO2 68, HCO3 17 = combined respiratory + metabolic acidosis from CO2 retention AND tissue hypoxia — both resolve only when respiratory failure is corrected."
      }
    ]
  }
};
