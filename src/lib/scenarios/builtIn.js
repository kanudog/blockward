// Phase-4b: TOOLS and MEDS objects removed. The pack registry in
// src/lib/scenarios/packs/ + visualMeta.js now hold display metadata.
// Renderers look up labels via ALL_TOOLS / ALL_MEDS, icons via ToolIcon
// (id-keyed), and color/medType via medColor/medType helpers.
//
// Phase-5.4.3a: assessItems removed. vitals are keyed rich objects per
// schema 5.4.1; signs and labs gained .id and ._slotRef fields. bad/why
// metadata was migrated from the legacy assessItems into the typed
// collections during the one-shot Phase 5.4.3a built-in rewrite.

export var SC1 = {
  id: "fussy-infant",
  source: "builtin",
  title: "The Fussy Infant",
  tier: 1,
  icon: "👶",
  tagline: "6-month-old - Fussiness and Fever",
  description: "A 6-month-old male brought in for increasing fussiness and fever.",
  patient: {
    ageLabel: "6 months",
    weightKg: 7.5,
    sex: "Male",
    cc: "Fussiness and fever x 12 hours",
    history: "Previously healthy. Decreased oral intake, fewer wet diapers today. No sick contacts. Immunizations up to date. Born full-term, no NICU stay."
  },
  emsReport: "EMS brought in a 6-month-old male for a 12-hour history of fever and fussiness. Mother reports two episodes of non-bloody emesis and decreased wet diapers. Acetaminophen was given approximately one hour ago. Field vitals showed HR 175 and rectal temp 39.1C. EMS established a 22g IV in the left hand with NS KVO.",
  learnMore: "Fever in infants under 3 months is treated urgently because of the risk of occult bacteremia and serious bacterial illness. Between 3-6 months, fever workup is guided by clinical appearance, immunization status, and focal findings. At 6 months, a well-appearing infant with a clear viral source may not need a full septic workup, but fussiness, feeding changes, and dehydration are red flags for deeper investigation.",
  norms: {
    hr: [
      100,
      160
    ],
    rr: [
      25,
      40
    ],
    sbp: [
      70,
      90
    ],
    dbp: [
      40,
      60
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "EMS delivers a six-month-old male with a 12-hour history of fever and fussiness. He is previously healthy with no significant past medical history and immunizations are up to date. His mother reports two episodes of non-bloody emesis and decreased wet diapers since this morning. She administered acetaminophen approximately one hour ago. EMS established a 22-gauge IV in the left hand with a normal saline keep-open drip. Field vitals showed a heart rate of 175 and a rectal temperature of 39.1 degrees Celsius. On your initial assessment, the infant appears flushed and warm but is alert and consolable with a pacifier.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "178",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Elevated (normal 100-160) but proportional to fever. ~10 bpm per 1C above normal. Infants are rate-dependent for cardiac output."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "42",
          unit: "/min",
          bad: true,
          _slotRef: "phase[0].vitals.rr.why",
          why: "Mildly elevated (normal 25-40). Fever increases CO2 production driving ventilatory rate up."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "72",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "Normal for age. Maintained BP does NOT rule out early shock - children vasoconstrict aggressively."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "45",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "98",
          unit: "%",
          bad: false,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "Normal. Fetal hemoglobin shifts curve LEFT so sats stay high."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "39.2",
          unit: "C",
          bad: true,
          _slotRef: "phase[0].vitals.temp.why",
          why: "Febrile. Needs workup for UTI, bacteremia, meningitis at 6 months."
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "2.5",
          unit: "sec",
          bad: false,
          _slotRef: "phase[0].vitals.cap.why",
          why: "Borderline (normal < 3s). Worth trending - earliest shock marker."
        }
      },
      signs: [
        {
          id: "skin",
          label: "Skin",
          finding: "Flushed, warm, generalized erythema",
          pos: "body",
          sys: "Integumentary",
          bad: false,
          why: "Fever-induced cutaneous vasodilation carries heat to the skin surface for radiative cooling. Pyrogens reset the hypothalamic set point; the body compensates with peripheral dilation and sweating. Warm, pink, dry skin with fever suggests early warm septic shock - distinct from the cold, mottled skin of late decompensated shock.",
          _slotRef: "phase[0].signs.skin.why"
        },
        {
          id: "fontanelle",
          label: "Fontanelle",
          finding: "Flat and soft",
          pos: "head",
          sys: "Neuro",
          bad: false,
          why: "A flat, soft anterior fontanelle in a febrile infant is a quick negative check for two dangerous possibilities: a bulging fontanelle would suggest meningitis or raised ICP, while a sunken fontanelle would suggest significant dehydration. Flat and soft means neither is currently present, but does not rule them out on re-assessment.",
          _slotRef: "phase[0].signs.fontanelle.why"
        },
        {
          id: "mucous-membranes",
          label: "Mucous membranes",
          finding: "Moist",
          pos: "face",
          sys: "GI/Hydration",
          bad: false,
          _slotRef: "phase[0].signs.mucous-membranes.why"
        },
        {
          id: "behavior",
          label: "Behavior",
          finding: "Irritable but consolable with pacifier",
          pos: "head",
          sys: "Neuro",
          bad: false,
          _slotRef: "phase[0].signs.behavior.why"
        },
        {
          id: "heart-sounds",
          label: "Heart sounds",
          finding: "Tachycardic, regular rhythm, no murmur, no gallop",
          pos: "body",
          sys: "Cardiovascular",
          bad: false,
          _slotRef: "phase[0].signs.heart-sounds.why"
        },
        {
          id: "lungs",
          label: "Lungs",
          finding: "Clear bilaterally, equal air entry, no crackles or wheeze",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          _slotRef: "phase[0].signs.lungs.why"
        }
      ],
      labs: [
        {
          id: "wbc",
          name: "WBC",
          value: "18.2",
          unit: "K/uL",
          ref: "6.0-17.5",
          critical: true,
          bad: true,
          why: "Leukocytosis with elevated WBC indicates the bone marrow is releasing white cells in response to infection. The body is mounting an immune response, producing and deploying neutrophils to fight the invading pathogen.",
          _slotRef: "phase[0].labs.wbc.why"
        },
        {
          id: "hgb",
          name: "Hgb",
          value: "11.8",
          unit: "g/dL",
          ref: "10.0-14.0",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.hgb.why"
        },
        {
          id: "platelets",
          name: "Platelets",
          value: "245",
          unit: "K/uL",
          ref: "150-400",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.platelets.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "72",
          unit: "mg/dL",
          ref: ">45",
          critical: false,
          bad: false,
          why: "Normal (>45 mg/dL). Adequate for now, but must be trended in a febrile infant with poor intake. Glycogen stores can deplete rapidly.",
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "na",
          name: "Na+",
          value: "138",
          unit: "mEq/L",
          ref: "135-145",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.na.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "2.8",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: true,
          bad: false,
          why: "Mildly elevated. Lactate rises when tissues switch to anaerobic metabolism due to inadequate oxygen delivery. At 2.8, this suggests early tissue hypoperfusion. Trending this value is critical - a rising lactate confirms worsening shock.",
          _slotRef: "phase[0].labs.lactate.why"
        },
        {
          id: "crp",
          name: "CRP",
          value: "8.4",
          unit: "mg/dL",
          ref: "<0.5",
          critical: true,
          bad: false,
          why: "Markedly elevated C-reactive protein. CRP is an acute-phase reactant produced by the liver in response to IL-6 from macrophages during infection. A value this high in a 6-month-old strongly suggests significant bacterial infection rather than a simple viral illness.",
          _slotRef: "phase[0].labs.crp.why"
        },
        {
          id: "bands",
          name: "Bands",
          value: "14%",
          unit: "",
          ref: "<5%",
          critical: true,
          bad: false,
          why: "Bandemia (elevated band neutrophils) indicates a left shift - the bone marrow is releasing immature neutrophils into circulation because mature neutrophil demand exceeds supply. This is a hallmark of acute bacterial infection and suggests the immune system is under significant stress.",
          _slotRef: "phase[0].labs.bands.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Twenty minutes after antipyretic administration, the infant's temperature has decreased to 39.0 degrees Celsius. However, his clinical appearance has deteriorated noticeably. He is no longer tracking faces or reaching for objects and responds only sluggishly to tactile stimulation. His extremities are cool to the touch despite persistent core fever, and you observe a new reticular mottling pattern across both lower extremities that was not present on initial assessment. The charge nurse passes the bedside, pauses, and states that the infant does not look right. Your reassessment confirms a significant change from baseline.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "192",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[1].vitals.hr.why",
          why: "Temp DOWN but HR UP. Dissociation = compensatory tachycardia for septic shock, not fever."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "52",
          unit: "/min",
          bad: true,
          _slotRef: "phase[1].vitals.rr.why",
          why: "Compensatory tachypnea for metabolic acidosis from anaerobic metabolism."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "68",
          unit: "mmHg",
          bad: true,
          _slotRef: "phase[1].vitals.sbp.why",
          why: "Below normal. Hypotension is LATE. 25-30% volume lost. Decompensated shock."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "40",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "97",
          unit: "%",
          bad: false,
          _slotRef: "phase[1].vitals.spo2.why",
          why: "Deceptive. Saturation not delivery. Poor CO means inadequate O2 delivery."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "39",
          unit: "C",
          bad: false,
          _slotRef: "phase[1].vitals.temp.why",
          why: null
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "4",
          unit: "sec",
          bad: true,
          _slotRef: "phase[1].vitals.cap.why",
          why: "Prolonged. Intense vasoconstriction and tissue ischemia."
        }
      },
      signs: [
        {
          id: "mottling",
          label: "Mottling",
          finding: "Reticular purplish pattern, bilateral lower extremities",
          pos: "body",
          sys: "Integumentary",
          bad: false,
          why: "Mottling reflects severe peripheral vasoconstriction as the body shunts blood from skin and muscle to preserve perfusion of vital organs. The reticular pattern appears when capillaries alternate between constriction and dilation under sympathetic overdrive. In a septic infant this is a late and ominous sign of decompensated shock.",
          _slotRef: "phase[1].signs.mottling.why"
        },
        {
          id: "pulses",
          label: "Pulses",
          finding: "Weak and thready peripherally, central palpable",
          pos: "body",
          sys: "Cardiovascular",
          bad: false,
          why: "Preserved central pulses with weak peripheral pulses is the hallmark of compensated-to-decompensated shock transition. Stroke volume is dropping; the body prioritizes brain and heart at the expense of extremities. Loss of central pulses is imminent arrest.",
          _slotRef: "phase[1].signs.pulses.why"
        },
        {
          id: "mental-status",
          label: "Mental status",
          finding: "Sluggish to voice, not tracking faces",
          pos: "head",
          sys: "Neuro",
          bad: false,
          _slotRef: "phase[1].signs.mental-status.why"
        },
        {
          id: "extremities",
          label: "Extremities",
          finding: "Cool and clammy hands and feet",
          pos: "body",
          sys: "Cardiovascular",
          bad: false,
          why: "Cool clammy extremities with a febrile core signals cold septic shock. The sympathetic nervous system clamps down peripheral vessels to redirect flow centrally. Capillary refill lengthens, skin feels cold distal to warm proximal - this gradient marks the perfusion boundary.",
          _slotRef: "phase[1].signs.extremities.why"
        },
        {
          id: "abdomen",
          label: "Abdomen",
          finding: "Soft, hypoactive bowel sounds",
          pos: "body",
          sys: "GI",
          bad: false,
          _slotRef: "phase[1].signs.abdomen.why"
        },
        {
          id: "urine-output",
          label: "Urine output",
          finding: "One concentrated diaper in six hours",
          pos: "body",
          sys: "Renal",
          bad: false,
          _slotRef: "phase[1].signs.urine-output.why"
        }
      ],
      labs: [
        {
          id: "wbc",
          name: "WBC",
          value: "22.4",
          unit: "K/uL",
          ref: "6.0-17.5",
          critical: true,
          bad: false,
          why: "Rising from 18.2 - the infection is progressing and the bone marrow is working harder. Worsening leukocytosis in sepsis correlates with increasing bacterial burden and inflammatory response.",
          _slotRef: "phase[1].labs.wbc.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "5.8",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: true,
          bad: true,
          why: "Doubled from 2.8 to 5.8. Cells are starving for oxygen and generating lactate through anaerobic glycolysis. Above 4 mmol/L in pediatric sepsis is associated with significantly increased mortality and indicates severe tissue hypoperfusion requiring aggressive fluid resuscitation.",
          _slotRef: "phase[1].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "48",
          unit: "mg/dL",
          ref: ">45",
          critical: true,
          bad: true,
          why: "Borderline low and dropping from 72. Glycogen stores are depleting rapidly under the metabolic stress of sepsis. If this falls below 45, neuronal function fails and seizure risk skyrockets. Must be monitored closely and treated immediately if it drops further.",
          _slotRef: "phase[1].labs.glucose.why"
        },
        {
          id: "na",
          name: "Na+",
          value: "136",
          unit: "mEq/L",
          ref: "135-145",
          critical: false,
          bad: false,
          _slotRef: "phase[1].labs.na.why"
        },
        {
          id: "k",
          name: "K+",
          value: "4.2",
          unit: "mEq/L",
          ref: "3.5-5.5",
          critical: false,
          bad: false,
          _slotRef: "phase[1].labs.k.why"
        },
        {
          id: "ph",
          name: "pH",
          value: "7.24",
          unit: "",
          ref: "7.35-7.45",
          critical: true,
          bad: false,
          why: "Acidotic. The accumulating lactate from anaerobic metabolism is driving the pH down. A pH below 7.25 indicates severe metabolic acidosis. The body attempts to compensate by increasing respiratory rate (blowing off CO2), which is why this infant is tachypneic at 52/min.",
          _slotRef: "phase[1].labs.ph.why"
        },
        {
          id: "hco3",
          name: "HCO3-",
          value: "14",
          unit: "mEq/L",
          ref: "22-26",
          critical: true,
          bad: false,
          why: "Low bicarbonate confirms metabolic acidosis. Bicarb is being consumed as it buffers the excess hydrogen ions from lactic acid production. The base deficit of -12 tells you how much bicarb has been used up.",
          _slotRef: "phase[1].labs.hco3.why"
        },
        {
          id: "base-deficit",
          name: "Base deficit",
          value: "-12",
          unit: "",
          ref: "-2 to +2",
          critical: true,
          bad: false,
          why: "Severely negative. Base deficit quantifies the total acid load the body is carrying. A value of -12 means the body has consumed 12 mEq/L of buffer capacity trying to neutralize the acid produced by poor perfusion. This correlates directly with the severity and duration of tissue oxygen debt.",
          _slotRef: "phase[1].labs.base-deficit.why"
        }
      ],
      tools: [
        "ivKit",
        "stethoscope",
        "capRefill",
        "glucometer",
        "thermometer",
        "defib"
      ],
      meds: [
        "nsBolus",
        "ceftriaxone",
        "acetaminophen",
        "epiIV",
        "albuterol",
        "dextroseBolus"
      ],
      actions: {
        tools: {
          ivKit: {
            ok: true,
            pri: 1,
            fb: "Essential. You need IV access for fluids and antibiotics. In a vasoconstricted infant, target saphenous or antecubital veins. Two attempts at peripheral access, then go IO at the proximal tibia (1-2 cm below tibial tuberosity, flat medial surface). IO provides equivalent flow rates to central access."
          },
          stethoscope: {
            ok: true,
            pri: null,
            fb: "Auscultate before pushing fluid. Establish baseline: clear lungs (crackles suggest pneumonia or edema), regular rhythm (irregular rhythm changes approach), no murmur (new murmur raises endocarditis concern), no S3 gallop (volume overload marker). Re-auscultate lungs after each bolus for developing crackles."
          },
          capRefill: {
            ok: true,
            pri: null,
            fb: "Best real-time perfusion tracker in pediatrics. Press nail bed 5 seconds, release, count. Currently 4 seconds (normal <2). After each 20 mL/kg bolus, recheck. Improvement toward 2-3 seconds = effective resuscitation. No improvement after 40-60 mL/kg = consider vasopressors or alternative etiology."
          },
          glucometer: {
            ok: true,
            pri: 2,
            fb: "Check immediately. A 6-month-old has only 3-4g hepatic glycogen (vs 70-100g adults). After 12 hours of illness with poor intake, stores may be depleted. Sepsis accelerates glucose consumption due to activated immune cell demand. Hypoglycemia <45 mg/dL causes seizures and brain injury. If low: D10W 2-4 mL/kg IV."
          },
          thermometer: {
            ok: false,
            pri: null,
            fb: "Temp is 39.0C and trending down from 39.2C. Rechecking provides no new information. The problem is cardiovascular collapse, not fever. Temperature management comes after ABCs are stabilized and resuscitation is underway."
          },
          defib: {
            ok: false,
            pri: null,
            fb: "You just shocked a baby in sinus tachycardia. The baby did not appreciate that. The rhythm is sinus tach - a normal compensatory response to sepsis. There is no shockable rhythm here. Defibrillation is for ventricular fibrillation or pulseless ventricular tachycardia only. Please put the paddles down and go give this child some fluid."
          }
        },
        meds: {
          nsBolus: {
            ok: true,
            pri: 1,
            fb: "First-line intervention. Push 20 mL/kg (150 mL) of 0.9% NS via push-pull technique over 5 minutes. Sepsis causes vasodilation and capillary leak, depleting effective circulating volume. Crystalloid restores preload, increasing stroke volume via Frank-Starling mechanism. Reassess after each bolus. Repeat up to 60 mL/kg total. No improvement = fluid-refractory shock, start vasopressors."
          },
          ceftriaxone: {
            ok: true,
            pri: 2,
            fb: "Broad-spectrum antibiotics must begin within 60 minutes of recognizing sepsis. Ceftriaxone 50 mg/kg IV covers S. pneumoniae, N. meningitidis, E. coli, and H. influenzae. Binds penicillin-binding proteins, inhibiting peptidoglycan crosslinking, leading to bacterial cell wall rupture. Draw cultures first if quick (<5 min), but never delay antibiotics for cultures. Each hour of delay increases mortality 4-8%."
          },
          acetaminophen: {
            ok: false,
            pri: null,
            fb: "Already given 20 minutes ago and within therapeutic window. The tachycardia is NOT fever-driven anymore - HR-temp dissociation proves compensatory shock physiology. Fever itself is a beneficial immune response up to 39.5C (enhances neutrophil chemotaxis and antibody production). The cardiovascular collapse is the emergency, not the temperature."
          },
          epiIV: {
            ok: false,
            pri: null,
            fb: "Wrong timing. Epinephrine stimulates alpha-1, beta-1, and beta-2 receptors and IS appropriate for fluid-refractory septic shock. But no fluid has been given yet. Vasopressors on an empty vascular tree produces high SVR with dangerously low CO - BP number may transiently improve while tissue perfusion worsens. Algorithm: volume first (up to 60 mL/kg), then epi 0.05-0.3 mcg/kg/min if still hypotensive."
          },
          albuterol: {
            ok: false,
            pri: null,
            fb: "No airway pathology present. Albuterol is a beta-2 agonist for bronchospasm. The tachypnea here is metabolic acidosis compensation - poor perfusion causes lactic acid buildup, stimulating central chemoreceptors to increase RR. Adding albuterol causes unnecessary tachycardia without addressing the perfusion deficit. Fix the volume and the tachypnea resolves."
          },
          dextroseBolus: {
            ok: false,
            pri: null,
            fb: "Check glucose FIRST, do not give empirically. If glucose is normal, empiric dextrose causes iatrogenic hyperglycemia. In sepsis, hyperglycemia worsens outcomes through osmotic diuresis, impaired neutrophil bactericidal function, and pro-inflammatory AGE production. Measure, then treat if <45 mg/dL."
          }
        }
      }
    }
  ],
  curveball: {
    name: "Seizure During Resuscitation",
    narrative: "During active fluid resuscitation at approximately 90 mL into the first normal saline bolus, the infant abruptly develops generalized tonic-clonic seizure activity. Both upper and lower extremities exhibit rhythmic, synchronized flexion-extension movements with truncal rigidity. The SpO2 begins to fall rapidly on the monitor as the heart rate climbs. You observe perioral cyanosis developing and note that the infant is not generating effective respiratory effort between the tonic-clonic phases. The eyes are deviated upward and to the right. The respiratory therapist arrives with the crash cart and multiple team members converge at the bedside.",
    vitals: {
      hr: {
        id: "hr",
        label: "HR",
        value: "210",
        unit: "bpm",
        bad: false,
        _slotRef: "phase[curveball].vitals.hr.why",
        why: null
      },
      rr: {
        id: "rr",
        label: "RR",
        value: "8",
        unit: "/min",
        bad: false,
        _slotRef: "phase[curveball].vitals.rr.why",
        why: null
      },
      sbp: {
        id: "sbp",
        label: "BP",
        value: "62",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.sbp.why",
        why: null
      },
      dbp: {
        id: "dbp",
        label: "BP",
        value: "35",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.dbp.why",
        why: null
      },
      spo2: {
        id: "spo2",
        label: "SpO2",
        value: "83",
        unit: "%",
        bad: false,
        _slotRef: "phase[curveball].vitals.spo2.why",
        why: null
      },
      temp: {
        id: "temp",
        label: "Temp",
        value: "39",
        unit: "C",
        bad: false,
        _slotRef: "phase[curveball].vitals.temp.why",
        why: null
      },
      cap: {
        id: "cap",
        label: "Cap Refill",
        value: "5",
        unit: "sec",
        bad: false,
        _slotRef: "phase[curveball].vitals.cap.why",
        why: null
      }
    },
    signs: [
      {
        id: "motor",
        label: "Motor",
        finding: "Generalized tonic-clonic activity, all extremities",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.motor.why"
      },
      {
        id: "cyanosis",
        label: "Cyanosis",
        finding: "Perioral and circumoral, dusky blue",
        pos: "face",
        bad: false,
        _slotRef: "phase[curveball].signs.cyanosis.why"
      },
      {
        id: "breathing",
        label: "Breathing",
        finding: "Apneic pauses between tonic-clonic phases",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.breathing.why"
      },
      {
        id: "eyes",
        label: "Eyes",
        finding: "Deviated upward and to the right, pupils dilated",
        pos: "head",
        bad: false,
        _slotRef: "phase[curveball].signs.eyes.why"
      }
    ],
    labs: [
      {
        id: "glucose",
        name: "Glucose",
        value: "32",
        unit: "mg/dL",
        ref: ">45",
        critical: true,
        bad: false,
        why: "Critically low. This is the most likely cause of the seizure. Glycogen stores are exhausted and the brain has lost its primary fuel source. Neurons cannot generate ATP, the Na/K pump fails, membranes depolarize, and seizure results. D10W 2-4 mL/kg is potentially curative.",
        _slotRef: "phase[curveball].labs.glucose.why"
      },
      {
        id: "lactate",
        name: "Lactate",
        value: "8.1",
        unit: "mmol/L",
        ref: "0.5-2.0",
        critical: true,
        bad: false,
        why: "Severely elevated from 5.8 - the seizure itself is generating massive lactate. Sustained muscle contraction during tonic-clonic activity is entirely anaerobic. Combined with the ongoing septic shock, tissue oxygen debt is now critical.",
        _slotRef: "phase[curveball].labs.lactate.why"
      },
      {
        id: "ph",
        name: "pH",
        value: "7.18",
        unit: "",
        ref: "7.35-7.45",
        critical: true,
        bad: false,
        why: "Worsening acidosis. Both the seizure (lactic acid from muscle) and the shock (lactic acid from tissue hypoperfusion) are driving the pH down. Below 7.20, cardiac contractility begins to decline and catecholamines become less effective.",
        _slotRef: "phase[curveball].labs.ph.why"
      },
      {
        id: "po2",
        name: "pO2",
        value: "48",
        unit: "mmHg",
        ref: "80-100",
        critical: true,
        bad: false,
        why: "Severely hypoxic. Corresponds to the SpO2 of 83%. The infant is not ventilating effectively during the seizure because the respiratory muscles are contracting with everything else. The brain is seizing AND hypoxic simultaneously - a double insult.",
        _slotRef: "phase[curveball].labs.po2.why"
      }
    ],
    tools: [
      "suction",
      "o2Mask",
      "bvmReady",
      "glucometer",
      "stethoscope",
      "defib"
    ],
    meds: [
      "lorazepam",
      "fosphenytoin",
      "dextroseBolus",
      "epiIV",
      "nsBolus",
      "atropine"
    ],
    actions: {
      tools: {
        suction: {
          ok: true,
          pri: 1,
          fb: "Protect the airway first. Seizing infant has lost gag, cough, and swallow reflexes. High aspiration risk from salivation and vomiting. Use Yankauer catheter for oropharyngeal suction. Avoid deep flexible catheter suctioning - stimulates vagus nerve, can trigger bradycardia."
        },
        o2Mask: {
          ok: true,
          pri: 2,
          fb: "SpO2 83% = PaO2 approximately 48 mmHg, severely hypoxic. Apply non-rebreather at 10-15 L/min (delivers 60-80% FiO2). The seizing brain has massively increased O2 demand while ventilation is impaired. Hypoxic brain injury begins within 4-6 minutes."
        },
        bvmReady: {
          ok: true,
          pri: null,
          fb: "Have BVM staged at the bedside. Do NOT ventilate during the tonic phase when the glottis is contracted - bagging then drives air into the stomach. Be ready to deliver gentle breaths during clonic relaxation phases only if SpO2 falls further. Avoid over-bagging - causes gastric distension and increased aspiration risk."
        },
        glucometer: {
          ok: true,
          pri: 3,
          fb: "Check POC glucose immediately. Infant hepatic glycogen: 3-4g (adults: 70-100g). After 12 hours of illness, stores may be exhausted. Infant gluconeogenesis pathways are immature. If glucose <45 mg/dL, push D10W 2-4 mL/kg. Glucose correction alone may terminate the seizure."
        },
        stethoscope: {
          ok: false,
          pri: null,
          fb: "Cannot auscultate meaningfully during active tonic-clonic seizure. Muscle contraction artifact drowns out heart and lung sounds. Useful AFTER seizure control to assess for aspiration or arrhythmia. Not a priority right now."
        },
        defib: {
          ok: false,
          pri: null,
          fb: "HR 210 with narrow QRS = sinus tachycardia. Appropriate physiologic response to seizure, hypoxia, and catecholamine surge. Defibrillation is for VF or pulseless VT only. Shocking sinus tachycardia could induce an actual arrhythmia. Monitor pads are fine but do not charge."
        }
      },
      meds: {
        lorazepam: {
          ok: true,
          pri: 1,
          fb: "First-line antiepileptic. 0.1 mg/kg IV (0.75 mg for this infant). Binds GABA-A receptor benzodiazepine site, increasing chloride channel opening frequency. Chloride influx hyperpolarizes the neuron from -70mV toward -90mV, suppressing the electrical storm. Onset 1-3 min IV. Alternative: midazolam 0.2 mg/kg IN or IM. Two failed doses = status epilepticus."
        },
        fosphenytoin: {
          ok: false,
          pri: null,
          fb: "Second-line only after two benzodiazepine doses fail. Fosphenytoin blocks voltage-gated sodium channels. Requires 20-minute infusion (rapid push causes hypotension and arrhythmia via His-Purkinje depression). Too slow for first-line use. Also: always check glucose before escalating antiepileptics - hypoglycemia-driven seizures will not respond to antiepileptics."
        },
        dextroseBolus: {
          ok: true,
          pri: 2,
          fb: "Give after checking glucose. If <45 mg/dL, push D10W 2-4 mL/kg (15-30 mL). Use D10W in infants, not D25 or D50 (hyperosmolar, causes venous endothelial damage and rebound hyperinsulinemia). Without glucose, neuronal ATP production stops, Na/K ATPase fails, membrane depolarizes uncontrollably. May terminate seizure within 1-2 minutes."
        },
        epiIV: {
          ok: false,
          pri: null,
          fb: "Harmful in this context. Beta-1 stimulation increases myocardial O2 demand (HR already 210). Alpha-1 increases afterload. CNS catecholamine stimulation lowers seizure threshold. Epinephrine also raises ICP. Indicated for pulseless arrest or fluid-refractory shock only. Neither applies here."
        },
        nsBolus: {
          ok: true,
          pri: null,
          fb: "Do NOT stop the bolus. The seizure was caused by sepsis (hypoglycemia, meningitis, or fever), not by normal saline. Septic shock is still present and requires ongoing volume resuscitation. Continue fluid while managing seizure simultaneously. Delegate tasks across the team."
        },
        atropine: {
          ok: false,
          pri: null,
          fb: "Blocks M2 muscarinic receptors, increasing heart rate by removing vagal tone. Patient is already at 210 bpm. Pushing atropine could drive rate above 220, reducing diastolic filling time so severely that stroke volume drops and CO paradoxically falls. Indicated for symptomatic bradycardia only."
        }
      }
    },
    teaches: [
      {
        title: "Why Infants Seize in Sepsis",
        content: "Seizures in septic infants arise from three converging mechanisms. First, hypoglycemia: infants store only 3-4 grams of hepatic glycogen compared to 70-100 grams in adults, and their glucose utilization rate is 4-6 mg/kg/min at baseline. Sepsis can double or triple this rate because activated neutrophils and macrophages are obligate glucose consumers, and the catecholamine surge of shock accelerates glycogenolysis. Once stores are exhausted, gluconeogenesis in infants is too immature to compensate (the key enzymes PEPCK and glucose-6-phosphatase are not yet fully expressed). The result is neuronal energy failure: without glucose, ATP production via glycolysis and the Krebs cycle halts, the Na/K ATPase pump fails, the membrane depolarizes uncontrollably, and a seizure initiates. Second, direct CNS infection: bacteria can cross the blood-brain barrier more easily in infants because the tight junctions between cerebral endothelial cells are less mature. Once bacteria enter the CSF, the inflammatory response (complement activation, cytokine release, neutrophil infiltration) causes cerebral edema, increased intracranial pressure, and cortical irritability leading to seizure. Third, fever itself: febrile seizures occur in 2-5% of neurologically normal children between 6 months and 5 years. The mechanism is not fully understood but likely involves temperature-sensitive ion channels (TRPV1 and TRPV4) that alter neuronal excitability when core temperature rises rapidly. In sepsis, never assume a seizure is a simple febrile seizure without ruling out hypoglycemia and meningitis first.",
        tldr: "Infants seize in sepsis because of low glucose (tiny glycogen stores), bacteria crossing an immature blood-brain barrier, or fever. Always check glucose first."
      },
      {
        title: "Glucose: The Forgotten Critical Value",
        content: "The infant brain consumes approximately 60% of total body glucose production, compared to 25% in adults. This disproportionate demand exists because the infant brain is relatively larger (10-12% of body weight vs 2% in adults) and has a higher metabolic rate per gram of tissue due to active synaptogenesis and myelination. Unlike adult neurons, which can partially switch to ketone body oxidation during prolonged fasting, infant neurons have limited capacity to utilize alternative fuels in the acute setting because the enzymes for ketolysis (beta-hydroxybutyrate dehydrogenase and succinyl-CoA:3-oxoacid CoA transferase) are not yet fully upregulated. When serum glucose falls below 45 mg/dL, the immediate consequence is failure of the Na/K ATPase, which requires approximately 50% of neuronal ATP output to maintain the -70mV resting membrane potential. As the pump fails, sodium leaks in, the membrane depolarizes, voltage-gated calcium channels open, and intracellular calcium rises to toxic levels triggering both seizure activity and excitotoxic cell death through calpain and caspase activation. Treatment is D10W at 2-4 mL/kg IV push. D10 is used in infants rather than D25 or D50 because the higher-concentration solutions are hyperosmolar (D50 has an osmolality of approximately 2,525 mOsm/L) and cause direct endothelial injury, phlebitis, and tissue necrosis if extravasated. Always recheck glucose 15 minutes after correction to ensure adequacy, and consider starting a continuous dextrose infusion (glucose infusion rate of 6-8 mg/kg/min) if the underlying cause of hypoglycemia persists.",
        tldr: "Infant brains use 60% of all glucose and cannot switch to backup fuels. Below 45 mg/dL, neurons lose power and seize. Treat with D10W (not D50 - too concentrated for small veins)."
      },
      {
        title: "Parallel Crisis Management",
        content: "The PICU frequently presents overlapping emergencies that require simultaneous management. The key principle is ABC prioritization with parallel task execution through team delegation. In this scenario, the infant has two concurrent life-threatening problems: septic shock requiring fluid resuscitation and antibiotics, and a generalized seizure requiring airway protection and antiepileptic therapy. Stopping the fluid bolus to manage the seizure would worsen the shock. Ignoring the seizure to continue the bolus would allow ongoing hypoxia and potential brain injury. The solution is parallel processing: one team member manages the airway (positioning, suction, oxygen delivery), another draws up and administers lorazepam, a third continues the fluid bolus and monitors the infusion pump, and the physician directs the overall resuscitation and makes prioritization decisions. Time-based protocols run simultaneously: the seizure protocol (benzodiazepine at time zero, repeat at 5 minutes, second-line agent at 10 minutes if refractory) and the sepsis bundle (blood cultures, antibiotics within 60 minutes, fluid resuscitation to perfusion targets). Effective communication tools include closed-loop communication (repeat-back of orders), time calls (announcing elapsed time since seizure onset), and designated role assignments at the start of the resuscitation.",
        tldr: "When two emergencies happen at once, do not stop treating one to treat the other. Delegate tasks across the team and run both protocols in parallel."
      }
    ]
  },
  reassessment: {
    narrative: "Forty minutes after the first fluid bolus and the initiation of antibiotics, the infant's clinical trajectory has reversed. Heart rate has come down from 192 to 150, capillary refill is now less than 2 seconds, and the mottling on the lower extremities has resolved. He is tracking faces again and reaching for his pacifier. The mother, who was holding his hand during the resuscitation, notices him squeeze back.",
    vitals: {
      hr: 150,
      rr: 36,
      sbp: 84,
      dbp: 52,
      spo2: 99,
      temp: 38.1,
      cap: 2
    },
    signs: [
      {
        label: "Perfusion",
        finding: "Warm pink extremities, cap refill <2s",
        pos: "body",
        sys: "Cardiovascular"
      },
      {
        label: "Mental status",
        finding: "Tracking faces, reaching for pacifier",
        pos: "head",
        sys: "Neuro"
      },
      {
        label: "Skin",
        finding: "Mottling resolved, no new rash",
        pos: "body",
        sys: "Integumentary"
      }
    ]
  },
  stabilizationSummary: "Aggressive isotonic fluid resuscitation restored circulating volume and tissue perfusion. Broad-spectrum antibiotics targeted the underlying bacterial source before cultures returned. Dextrose corrected hypoglycemia and protected cortical function while the metabolic acidosis resolved.",
  debrief: {
    summary: "You identified septic shock by recognizing HR-temperature dissociation, initiated resuscitation, and managed an unexpected seizure.",
    explainers: [
      {
        title: "HR-Temperature Dissociation",
        content: "In infants, cardiac output is calculated as heart rate multiplied by stroke volume. Unlike older children and adults who can increase stroke volume by augmenting contractility and preload utilization, infants have a relatively fixed stroke volume because their immature myocardium contains fewer contractile elements (sarcomeres), has lower ventricular compliance, and operates near the top of its Frank-Starling curve at baseline. This means infants are fundamentally rate-dependent for cardiac output. During fever, the expected heart rate increase is approximately 10 beats per minute for each 1 degree Celsius above 37. This thermoregulatory tachycardia is driven by increased metabolic oxygen demand: fever raises the basal metabolic rate by roughly 10-13% per degree Celsius via accelerated enzymatic reactions, requiring proportionally more oxygen delivery. When an antipyretic is administered and the temperature decreases, you would expect the heart rate to decrease proportionally. If instead the temperature falls but the heart rate rises or remains disproportionately elevated, the tachycardia is no longer thermoregulatory. It is now driven by the sympathetic nervous system compensating for a different problem, most commonly hypovolemia or vasodilation from sepsis. The adrenal medulla releases epinephrine and norepinephrine in response to baroreceptor sensing of decreased arterial stretch (reduced circulating volume), which directly stimulates beta-1 adrenergic receptors on the sinoatrial node to increase firing rate. This HR-temperature dissociation is one of the earliest and most reliable clinical indicators of septic shock in febrile infants.",
        tldr: "Infant hearts depend on rate, not squeeze strength, for output. Fever raises HR predictably (~10 bpm per degree). If temp goes down but HR goes up, the tachycardia is from shock, not fever."
      },
      {
        title: "Why Children Maintain BP Until Collapse",
        content: "Pediatric patients have proportionally larger adrenal glands relative to body size compared to adults, and their sympathetic nervous system is highly reactive. When cardiac output falls from any cause (hypovolemia, sepsis, cardiogenic), baroreceptors in the carotid sinus and aortic arch detect reduced arterial wall stretch and trigger a massive sympathetic discharge. This produces intense peripheral vasoconstriction through alpha-1 adrenergic receptor activation on arteriolar smooth muscle, which increases systemic vascular resistance (SVR) and maintains mean arterial pressure (MAP = CO x SVR). Because MAP is maintained, the blood pressure reading on the monitor appears reassuringly normal even as tissue perfusion is deteriorating. The clinical signs that betray this compensated state are the perfusion markers: capillary refill time prolongs because arteriolar constriction throttles inflow to the capillary beds; skin becomes mottled as dermal blood flow becomes patchy; extremities cool as blood is shunted away from the periphery; mental status declines as cerebral autoregulation approaches its lower limit; and urine output falls as renal perfusion drops below the threshold for adequate glomerular filtration. These signs change well before blood pressure drops. When BP finally does fall, it indicates that the compensatory mechanisms have been exhausted. Catecholamine stores in the adrenal medulla are depleted, SVR can no longer be maintained, and the patient transitions abruptly from compensated to decompensated shock. In children this transition is often described as falling off a cliff because it is sudden rather than gradual. Hypotension in a child is a pre-arrest sign representing loss of approximately 25-30% of circulating blood volume.",
        tldr: "Kids vasoconstrict aggressively to maintain BP. Cap refill, skin color, and mental status change way before BP drops. When BP finally falls, they have lost 25-30% of their blood volume and are about to arrest."
      },
      {
        title: "Infant Glucose Vulnerability",
        content: "The metabolic vulnerability of infants to hypoglycemia stems from a fundamental mismatch between glucose demand and storage capacity. Hepatic glycogen in a full-term neonate is approximately 5% of liver weight, yielding roughly 3-4 grams of total glycogen storage. Adults store 70-100 grams. Meanwhile, the infant brain, which constitutes 10-12% of total body weight (versus 2% in adults), consumes approximately 60% of total glucose production through obligate aerobic glycolysis. Under normal fasting conditions, these glycogen stores provide approximately 4-8 hours of glucose supply at the basal utilization rate of 4-6 mg/kg/min. Any condition that increases metabolic demand (fever, sepsis, seizures, cold stress) or impairs intake (vomiting, NPO status) accelerates depletion. Sepsis is particularly dangerous because it simultaneously increases demand (activated immune cells consume glucose at high rates, and catecholamine-driven glycogenolysis rapidly exhausts stores) and impairs the compensatory gluconeogenic response (sepsis-associated hepatic dysfunction reduces the liver's ability to synthesize new glucose from lactate, amino acids, and glycerol). The immature expression of gluconeogenic enzymes (phosphoenolpyruvate carboxykinase, fructose-1,6-bisphosphatase, and glucose-6-phosphatase) further limits this backup pathway. When serum glucose falls below the critical threshold of 45 mg/dL, neuronal mitochondrial ATP production collapses. The Na/K ATPase pump, which consumes roughly half of all neuronal ATP, fails first. Sodium leaks into the cell, the membrane depolarizes, voltage-gated calcium channels open, and the resulting calcium influx triggers both seizure activity and excitotoxic cascades (calpain activation, mitochondrial membrane permeabilization, and caspase-mediated apoptosis). Treatment is D10W at 2-4 mL/kg IV push. D10 (100 mg/mL) is preferred over D25 or D50 in infants because higher-concentration dextrose solutions are hyperosmolar and cause endothelial damage, phlebitis, and tissue necrosis. The goal is a glucose delivery of 200-400 mg/kg, which typically raises serum glucose by 60-120 mg/dL.",
        tldr: "Babies have almost no glucose reserves (3-4g vs 70-100g in adults) and their brains consume most of it. Sepsis burns through it fast. Below 45 mg/dL = seizures. Check glucose on every sick infant."
      }
    ]
  }
};

export var SC2 = {
  id: "vomiting-toddler",
  source: "builtin",
  title: "Won't Stop Vomiting",
  tier: 2,
  icon: "🤢",
  tagline: "2-year-old - Vomiting and Lethargy",
  description: "A 2-year-old with 3 days of vomiting and diarrhea, increasingly lethargic.",
  patient: {
    ageLabel: "2 years",
    weightKg: 12,
    sex: "Male",
    cc: "Vomiting/diarrhea x 3 days, lethargy",
    history: "Marcus has been sick for three days. Started with watery diarrhea, then vomiting everything including Pedialyte. His mom says he had one wet diaper in the last 12 hours and is sleeping way more than usual. No fever. Previously healthy, no medications."
  },
  emsReport: "Private vehicle arrival. 2-year-old male with 3 days of vomiting and watery diarrhea, unable to tolerate oral rehydration. Mother reports one wet diaper in the past 24 hours (normally 6-7). No fever, no blood in stool, no sick contacts. Arrived limp and lethargic in mother's arms. No prehospital interventions.",
  learnMore: "Pediatric dehydration severity is classified by percent volume loss: mild (3-5%), moderate (6-9%), and severe (>10%). Each category corresponds to a cluster of clinical findings - tachycardia and dry mucous membranes appear early, sunken fontanelle and skin tenting indicate moderate loss, and delayed cap refill with altered mental status signals severe depletion. Treatment is guided by this severity classification: oral rehydration for mild, IV bolus for moderate, and aggressive resuscitation for severe.",
  norms: {
    hr: [
      80,
      130
    ],
    rr: [
      20,
      30
    ],
    sbp: [
      80,
      100
    ],
    dbp: [
      50,
      65
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "You receive report on a two-year-old male named Marcus presenting with a three-day history of vomiting and watery diarrhea. His mother has attempted oral rehydration with Pedialyte but he has been unable to tolerate any oral intake. She reports only one wet diaper in the past 24 hours compared to his usual six to seven per day. He has no fever, no blood in the stool, and no known sick contacts. His weight on arrival is 12 kilograms. On initial assessment, the child is limp and lethargic in his mother's arms, opening his eyes briefly to voice but not reaching or engaging. His lips are dry and cracked, and the anterior fontanelle is visibly sunken.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "155",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Elevated for a 2-year-old (normal 80-130). Tachycardia is the earliest compensatory response to hypovolemia. Baroreceptors in the carotid sinus detect reduced stretch from low circulating volume and trigger sympathetic activation."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "30",
          unit: "/min",
          bad: false,
          _slotRef: "phase[0].vitals.rr.why",
          why: "Normal for age (20-30). No respiratory compensation yet, which means metabolic acidosis is not yet severe enough to trigger Kussmaul breathing."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "88",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "Normal for a 2-year-old (SBP 80-100). BP is being MAINTAINED despite volume loss. This is compensated shock - the child is vasoconstricting hard to keep perfusion pressure. The cap refill and mental status tell the real story."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "58",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "99",
          unit: "%",
          bad: false,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "Normal. No respiratory compromise. Dehydration alone doesn't typically affect oxygenation unless severe enough to cause shock-related pulmonary changes."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "36.8",
          unit: "C",
          bad: false,
          _slotRef: "phase[0].vitals.temp.why",
          why: "Normal. Afebrile gastroenteritis is common in viral etiologies (rotavirus, norovirus). The absence of fever does NOT make this less serious - the dehydration is the threat."
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "3",
          unit: "sec",
          bad: true,
          _slotRef: "phase[0].vitals.cap.why",
          why: "At the upper limit of normal. In a child with clear dehydration, this is the first sign of impaired perfusion. Sympathetic vasoconstriction is already redirecting blood from the skin to vital organs."
        }
      },
      signs: [
        {
          id: "skin-turgor",
          label: "Skin turgor",
          finding: "Tenting on abdomen, >2 seconds recoil",
          pos: "body",
          sys: "Integumentary",
          bad: false,
          why: "Skin turgor reflects interstitial fluid volume. When you pinch well-hydrated skin it snaps back immediately because the dermis is plump with water. A tent that persists more than 2 seconds indicates at least 5-10% total body water loss. This is a late sign - meaningful tenting in a toddler usually means moderate to severe dehydration.",
          _slotRef: "phase[0].signs.skin-turgor.why"
        },
        {
          id: "fontanelle",
          label: "Fontanelle",
          finding: "Anterior fontanelle sunken",
          pos: "head",
          sys: "Neuro",
          bad: false,
          why: "A sunken anterior fontanelle indicates reduced intracranial CSF volume, which tracks with systemic dehydration. At this age the fontanelle is a direct window into volume status that you lose access to once it closes (typically 12-18 months). A sunken fontanelle suggests at least 5% dehydration, often more.",
          _slotRef: "phase[0].signs.fontanelle.why"
        },
        {
          id: "mucous-membranes",
          label: "Mucous membranes",
          finding: "Dry, tacky lips and tongue",
          pos: "face",
          sys: "GI/Hydration",
          bad: false,
          _slotRef: "phase[0].signs.mucous-membranes.why"
        },
        {
          id: "behavior",
          label: "Behavior",
          finding: "Lethargic, arousable to voice briefly",
          pos: "head",
          sys: "Neuro",
          bad: false,
          _slotRef: "phase[0].signs.behavior.why"
        }
      ],
      labs: [
        {
          id: "na",
          name: "Na+",
          value: "134",
          unit: "mEq/L",
          ref: "135-145",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.na.why"
        },
        {
          id: "k",
          name: "K+",
          value: "2.9",
          unit: "mEq/L",
          ref: "3.5-5.5",
          critical: true,
          bad: false,
          why: "Low from GI losses. Gastric fluid contains potassium, and the kidneys worsen it by excreting K+ to retain H+ during alkalosis. Below 3.0, ECG changes begin (flattened T waves, U waves). Below 2.5, arrhythmia risk is high.",
          _slotRef: "phase[0].labs.k.why"
        },
        {
          id: "cl",
          name: "Cl-",
          value: "88",
          unit: "mEq/L",
          ref: "98-106",
          critical: true,
          bad: false,
          why: "Low from loss of gastric HCl. Hypochloremia triggers the kidneys to retain bicarbonate (because Cl- and HCO3- are exchanged in the renal tubule), worsening the metabolic alkalosis.",
          _slotRef: "phase[0].labs.cl.why"
        },
        {
          id: "co2",
          name: "CO2",
          value: "30",
          unit: "mEq/L",
          ref: "20-28",
          critical: true,
          bad: true,
          why: "Elevated total CO2 (bicarbonate) confirms metabolic alkalosis. The body is retaining bicarb to compensate for the massive H+ losses from vomiting. This alkalosis drives further potassium wasting through the kidney.",
          _slotRef: "phase[0].labs.co2.why"
        },
        {
          id: "bun",
          name: "BUN",
          value: "32",
          unit: "mg/dL",
          ref: "5-18",
          critical: true,
          bad: true,
          why: "Elevated BUN with BUN/Cr ratio >20 indicates pre-renal azotemia. Reduced kidney perfusion from dehydration causes increased urea reabsorption in the proximal tubule. The kidneys are not damaged - they are underperfused.",
          _slotRef: "phase[0].labs.bun.why"
        },
        {
          id: "cr",
          name: "Cr",
          value: "0.5",
          unit: "mg/dL",
          ref: "0.2-0.4",
          critical: true,
          bad: false,
          why: "Mildly elevated for a 2-year-old. GFR is declining from reduced renal blood flow. This is still pre-renal but approaching the threshold where acute kidney injury may develop if perfusion is not restored.",
          _slotRef: "phase[0].labs.cr.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "68",
          unit: "mg/dL",
          ref: "60-100",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "3.2",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: true,
          bad: false,
          why: "Mildly elevated. Tissue perfusion is compromised enough that some cells are switching to anaerobic metabolism. This confirms the cap refill and mental status findings - this child is in compensated shock.",
          _slotRef: "phase[0].labs.lactate.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Peripheral IV access was obtained on the second attempt due to poor venous filling from dehydration. Twenty minutes into admission, your reassessment reveals clinical deterioration. The child's hands and feet are now cold to the touch with a capillary refill time exceeding five seconds. You observe mottling extending from the knees distally in a reticular pattern. He responds only to painful stimulation with a weak grimace and withdrawal. His eyes are open but unfocused with no purposeful gaze. This represents a significant decline from his arrival status and suggests progression from compensated to decompensated hypovolemic shock.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "172",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[1].vitals.hr.why",
          why: "Worsening tachycardia. Heart rate is climbing as the sympathetic system works harder. The child is losing the ability to compensate. Stroke volume is falling, so rate must increase further to maintain CO."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "38",
          unit: "/min",
          bad: true,
          _slotRef: "phase[1].vitals.rr.why",
          why: "Now elevated (normal 20-30). Tachypnea is compensating for developing metabolic acidosis. Poor tissue perfusion causes lactic acid accumulation. The respiratory center increases rate to blow off CO2 and buffer the acidosis."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "82",
          unit: "mmHg",
          bad: true,
          _slotRef: "phase[1].vitals.sbp.why",
          why: "Dropping. Still technically borderline normal, but trending DOWN. In a child who was 88 systolic, a drop to 82 is significant. Pediatric compensatory mechanisms are starting to fail. This is the transition from compensated to decompensated shock."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "56",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "98",
          unit: "%",
          bad: false,
          _slotRef: "phase[1].vitals.spo2.why",
          why: "Still maintained. But remember: SpO2 tells you about lung function, not tissue perfusion. This child's tissues are starving despite adequate oxygenation."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "36.6",
          unit: "C",
          bad: false,
          _slotRef: "phase[1].vitals.temp.why",
          why: null
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "5",
          unit: "sec",
          bad: true,
          _slotRef: "phase[1].vitals.cap.why",
          why: "Significantly prolonged. Severe peripheral vasoconstriction. The microcirculation is shutting down. Lactate is building. Without fluid resuscitation, this child will hit the cliff - sudden cardiovascular collapse."
        }
      },
      signs: [
        {
          id: "mottling",
          label: "Mottling",
          finding: "Reticular pattern, knees and elbows bilaterally",
          pos: "body",
          sys: "Integumentary",
          bad: false,
          why: "Reticular mottling at the knees and elbows marks the perfusion boundary - proximal skin is still being perfused while distal skin is not. As shock progresses this boundary migrates centrally. When mottling reaches mid-thigh, cardiac arrest is often minutes away.",
          _slotRef: "phase[1].signs.mottling.why"
        },
        {
          id: "urine-output",
          label: "Urine output",
          finding: "No urine output in 14 hours",
          pos: "body",
          sys: "Renal",
          bad: false,
          why: "Anuria in a child with a fluid deficit reflects renin-angiotensin activation preserving plasma volume at the cost of renal output. GFR drops as renal arterioles constrict. Prolonged hypoperfusion converts pre-renal azotemia into acute tubular necrosis - reversible now, but not indefinitely.",
          _slotRef: "phase[1].signs.urine-output.why"
        },
        {
          id: "mental-status",
          label: "Mental status",
          finding: "Responds to pain only, weak grimace",
          pos: "head",
          sys: "Neuro",
          bad: false,
          why: "AVPU status of P (pain) in a previously alert child signals inadequate cerebral perfusion. The brain autoregulates until MAP drops below about 50 mmHg in a toddler. Once that threshold fails, consciousness deteriorates rapidly. This is a trajectory marker for imminent decompensation.",
          _slotRef: "phase[1].signs.mental-status.why"
        },
        {
          id: "extremities",
          label: "Extremities",
          finding: "Cool, clammy, pale",
          pos: "body",
          sys: "Cardiovascular",
          bad: false,
          _slotRef: "phase[1].signs.extremities.why"
        }
      ],
      labs: [
        {
          id: "k",
          name: "K+",
          value: "2.1",
          unit: "mEq/L",
          ref: "3.5-5.5",
          critical: true,
          bad: true,
          why: "Critically low and worsening. At this level, the cardiac myocyte resting membrane potential is destabilized. The cell becomes hyperexcitable and prone to spontaneous depolarization, creating the substrate for ventricular tachycardia and torsades de pointes.",
          _slotRef: "phase[1].labs.k.why"
        },
        {
          id: "cl",
          name: "Cl-",
          value: "82",
          unit: "mEq/L",
          ref: "98-106",
          critical: true,
          bad: false,
          why: "Worsening hypochloremia. Ongoing gastric losses continue to deplete chloride. The kidney cannot correct the alkalosis without adequate chloride for exchange in the collecting duct.",
          _slotRef: "phase[1].labs.cl.why"
        },
        {
          id: "co2",
          name: "CO2",
          value: "34",
          unit: "mEq/L",
          ref: "20-28",
          critical: true,
          bad: false,
          why: "Worsening alkalosis. Bicarb continues to climb as H+ losses continue. The alkalosis itself drives further K+ wasting - a vicious cycle that will continue until volume and chloride are replaced.",
          _slotRef: "phase[1].labs.co2.why"
        },
        {
          id: "bun",
          name: "BUN",
          value: "38",
          unit: "mg/dL",
          ref: "5-18",
          critical: true,
          bad: false,
          why: "Rising from 32. Renal perfusion is declining further as the child progresses from compensated to decompensated shock. Without fluid resuscitation, acute kidney injury will follow.",
          _slotRef: "phase[1].labs.bun.why"
        },
        {
          id: "cr",
          name: "Cr",
          value: "0.7",
          unit: "mg/dL",
          ref: "0.2-0.4",
          critical: true,
          bad: false,
          why: "Now clearly elevated. The kidneys are being injured by sustained hypoperfusion. Oliguria (no urine in 14 hours) confirms inadequate renal blood flow.",
          _slotRef: "phase[1].labs.cr.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "6.4",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: true,
          bad: true,
          why: "Doubled from 3.2. The child is transitioning from compensated to decompensated shock. Tissue oxygen debt is accumulating rapidly. Above 4 in pediatric shock correlates with significantly increased mortality.",
          _slotRef: "phase[1].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "54",
          unit: "mg/dL",
          ref: "60-100",
          critical: true,
          bad: false,
          why: "Dropping. Glycogen stores are depleting from prolonged fasting and metabolic stress. Approaching the threshold where neuronal function may be impaired. Needs monitoring and likely dextrose supplementation.",
          _slotRef: "phase[1].labs.glucose.why"
        },
        {
          id: "mg2",
          name: "Mg2+",
          value: "1.4",
          unit: "mg/dL",
          ref: "1.7-2.2",
          critical: true,
          bad: false,
          why: "Low magnesium accompanies prolonged vomiting. Magnesium depletion makes it harder to correct potassium because Mg2+ is required for the Na/K ATPase pump to retain potassium intracellularly. Must replace Mg2+ to effectively correct K+.",
          _slotRef: "phase[1].labs.mg2.why"
        }
      ],
      tools: [
        "ivKit",
        "stethoscope",
        "capRefill",
        "glucometer",
        "thermometer",
        "defib"
      ],
      meds: [
        "nsBolus",
        "dextroseBolus",
        "acetaminophen",
        "epiIV",
        "albuterol",
        "ceftriaxone"
      ],
      actions: {
        tools: {
          ivKit: {
            ok: true,
            pri: 1,
            fb: "Confirm and secure IV access. May need a second line. If this child decompensates, you need reliable access for fluids and emergency meds. Consider IO if peripheral access is failing - dehydrated toddlers have collapsed veins."
          },
          stethoscope: {
            ok: true,
            pri: null,
            fb: "Auscultate before and after each bolus. Listen for gallop (S3 = volume overload), crackles (pulmonary edema from over-resuscitation). Also establishes if bowel sounds are present - ileus from hypokalemia is possible with prolonged vomiting."
          },
          capRefill: {
            ok: true,
            pri: null,
            fb: "Your best real-time perfusion marker. Check after each 20 mL/kg bolus. Improvement from 5s toward 2-3s indicates effective volume resuscitation. No improvement after 40-60 mL/kg suggests either ongoing losses or a different etiology."
          },
          glucometer: {
            ok: true,
            pri: 2,
            fb: "Check immediately. Toddlers with 3 days of vomiting and poor intake are at HIGH risk for hypoglycemia. Hepatic glycogen stores in a 2-year-old deplete within 12-16 hours of fasting. Hypoglycemia causes altered mental status and can mimic septic shock."
          },
          thermometer: {
            ok: false,
            pri: null,
            fb: "Temperature is normal and stable. This child's problem is volume depletion, not infection. Rechecking temp doesn't change your immediate management - you need fluid resuscitation."
          },
          defib: {
            ok: false,
            pri: null,
            fb: "Whoa there. This toddler is in sinus tachycardia from dehydration. You just defibrillated a child who needed a glass of water. The rhythm is a normal compensatory response to hypovolemia. Defibrillation is for VF or pulseless VT. This child has a pulse and an organized rhythm. Step away from the defibrillator and go hang a bag of saline."
          }
        },
        meds: {
          nsBolus: {
            ok: true,
            pri: 1,
            fb: "First-line. Push 20 mL/kg (240 mL for 12 kg) normal saline over 5-10 minutes. Reassess perfusion markers after each bolus. May need 40-60 mL/kg total. Isotonic crystalloid replaces intravascular volume and improves preload, stroke volume, and cardiac output."
          },
          dextroseBolus: {
            ok: false,
            pri: null,
            fb: "Check glucose first, then give only if < 60 mg/dL. Prolonged vomiting with poor intake puts this child at risk, but empiric dextrose without checking can cause rebound hyperglycemia and osmotic complications. Always measure first."
          },
          acetaminophen: {
            ok: false,
            pri: null,
            fb: "Not indicated. Temperature is 36.6C - normal. There is no fever to treat. Giving acetaminophen to a dehydrated child with no fever adds no benefit and creates a false sense of action. Focus on volume."
          },
          epiIV: {
            ok: false,
            pri: null,
            fb: "Premature. This is hypovolemic shock, not distributive. The treatment is volume replacement, not vasopressors. Epinephrine in an empty vascular system just squeezes harder on nothing. Fill the tank first."
          },
          albuterol: {
            ok: false,
            pri: null,
            fb: "No respiratory pathology here. The tachypnea is metabolic compensation for lactic acidosis, not bronchospasm. Albuterol would add tachycardia without addressing the underlying volume deficit."
          },
          ceftriaxone: {
            ok: false,
            pri: null,
            fb: "No evidence of infection. Afebrile, no localizing signs, clear history of viral gastroenteritis. Antibiotics are for septic shock, not hypovolemic shock from GI losses. Unnecessary antibiotics add risk without benefit."
          }
        }
      }
    }
  ],
  curveball: {
    name: "Wide-Complex Tachycardia",
    narrative: "Near the completion of the first 20 mL/kg normal saline bolus, the cardiac monitor alarm activates with a rhythm change. The previously narrow-complex sinus tachycardia has been replaced by a wide-complex tachycardia at a rate of 220 beats per minute. The QRS morphology is broad and bizarre with no discernible P waves. The child's skin color rapidly transitions from pale to ashen gray and he becomes unresponsive. The clinical picture is consistent with ventricular tachycardia, and given the three-day history of persistent vomiting, the most likely etiology is a hypokalemia-driven arrhythmia secondary to ongoing gastrointestinal electrolyte losses.",
    vitals: {
      hr: {
        id: "hr",
        label: "HR",
        value: "220",
        unit: "bpm",
        bad: false,
        _slotRef: "phase[curveball].vitals.hr.why",
        why: null
      },
      rr: {
        id: "rr",
        label: "RR",
        value: "42",
        unit: "/min",
        bad: false,
        _slotRef: "phase[curveball].vitals.rr.why",
        why: null
      },
      sbp: {
        id: "sbp",
        label: "BP",
        value: "64",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.sbp.why",
        why: null
      },
      dbp: {
        id: "dbp",
        label: "BP",
        value: "38",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.dbp.why",
        why: null
      },
      spo2: {
        id: "spo2",
        label: "SpO2",
        value: "94",
        unit: "%",
        bad: false,
        _slotRef: "phase[curveball].vitals.spo2.why",
        why: null
      },
      temp: {
        id: "temp",
        label: "Temp",
        value: "36.6",
        unit: "C",
        bad: false,
        _slotRef: "phase[curveball].vitals.temp.why",
        why: null
      },
      cap: {
        id: "cap",
        label: "Cap Refill",
        value: "6",
        unit: "sec",
        bad: false,
        _slotRef: "phase[curveball].vitals.cap.why",
        why: null
      }
    },
    signs: [
      {
        id: "rhythm",
        label: "Rhythm",
        finding: "Wide-complex tachycardia at 220 bpm, QRS >0.09s, no P waves",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.rhythm.why"
      },
      {
        id: "perfusion",
        label: "Perfusion",
        finding: "Pale, diaphoretic, thready pulses",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.perfusion.why"
      },
      {
        id: "mental-status",
        label: "Mental status",
        finding: "Eyes rolling back, barely responsive",
        pos: "head",
        bad: false,
        _slotRef: "phase[curveball].signs.mental-status.why"
      },
      {
        id: "color",
        label: "Color",
        finding: "Ashen gray",
        pos: "face",
        bad: false,
        _slotRef: "phase[curveball].signs.color.why"
      }
    ],
    labs: [
      {
        id: "k",
        name: "K+",
        value: "1.8",
        unit: "mEq/L",
        ref: "3.5-5.5",
        critical: true,
        bad: false,
        why: "Critically low - this is the cause of the arrhythmia. At K+ 1.8, the myocyte resting membrane potential has shifted from -90mV toward -70mV. The cell is partially depolarized and hyperexcitable, generating the wide-complex tachycardia you see on the monitor.",
        _slotRef: "phase[curveball].labs.k.why"
      },
      {
        id: "mg2",
        name: "Mg2+",
        value: "1.2",
        unit: "mg/dL",
        ref: "1.7-2.2",
        critical: true,
        bad: false,
        why: "Low magnesium makes the arrhythmia harder to treat. Mg2+ stabilizes the cardiac membrane independent of K+ levels. IV magnesium 25-50 mg/kg should be given alongside potassium replacement.",
        _slotRef: "phase[curveball].labs.mg2.why"
      },
      {
        id: "ica2",
        name: "iCa2+",
        value: "0.98",
        unit: "mmol/L",
        ref: "1.12-1.32",
        critical: true,
        bad: false,
        why: "Low ionized calcium from the alkalosis. Alkalemia increases protein binding of calcium, reducing the free (ionized) fraction. Low iCa2+ further destabilizes cardiac conduction and can prolong the QT interval.",
        _slotRef: "phase[curveball].labs.ica2.why"
      },
      {
        id: "ph",
        name: "pH",
        value: "7.52",
        unit: "",
        ref: "7.35-7.45",
        critical: true,
        bad: false,
        why: "Significantly alkalotic from ongoing gastric H+ losses. The alkalosis is driving the hypokalemia (kidneys waste K+ to retain H+) and the hypocalcemia (alkalemia increases Ca2+ protein binding). Fixing the pH helps fix the electrolytes.",
        _slotRef: "phase[curveball].labs.ph.why"
      }
    ],
    tools: [
      "stethoscope",
      "defib",
      "glucometer",
      "ivKit",
      "capRefill",
      "thermometer"
    ],
    meds: [
      "adenosine",
      "epiIV",
      "nsBolus",
      "lorazepam",
      "atropine",
      "albuterol"
    ],
    actions: {
      tools: {
        stethoscope: {
          ok: true,
          pri: null,
          fb: "Auscultate quickly to confirm rate and rhythm. In wide-complex tachycardia, you're listening for whether beats are regular (VT, SVT with aberrancy) or irregular (polymorphic VT/torsades). Also check for cannon A waves in the neck veins - present in VT due to AV dissociation."
        },
        defib: {
          ok: true,
          pri: 1,
          fb: "CRITICAL. Get the defibrillator pads ON immediately. If this child becomes pulseless or hemodynamically unstable (which they are), synchronized cardioversion at 0.5-1 J/kg is first-line for unstable wide-complex tachycardia. You must be ready. In peds, the sequence is: unstable + wide complex = synchronized cardioversion first."
        },
        glucometer: {
          ok: true,
          pri: null,
          fb: "Quick check. Hypoglycemia can worsen any cardiac arrhythmia and this child has been vomiting for 3 days. Low glucose exacerbates myocardial dysfunction."
        },
        ivKit: {
          ok: true,
          pri: null,
          fb: "Confirm IV access is patent. You may need to push medications or give volume. If IV was positional or infiltrated, you need working access NOW before cardioversion or drug administration."
        },
        capRefill: {
          ok: false,
          pri: null,
          fb: "You already know perfusion is terrible - the child is gray and unresponsive. Cap refill confirms what you can see. Don't delay treatment to do an assessment you don't need right now. Act."
        },
        thermometer: {
          ok: false,
          pri: null,
          fb: "Temperature is irrelevant in an acute arrhythmia emergency. This child needs rhythm correction, not temperature monitoring. Every second counts."
        }
      },
      meds: {
        adenosine: {
          ok: false,
          pri: null,
          fb: "DANGEROUS in this context. Adenosine is for NARROW-complex SVT, not wide-complex tachycardia. If this is ventricular tachycardia (which it likely is in a hypokalemic child), adenosine will not convert it and may worsen hemodynamic collapse. Additionally, if this is torsades de pointes from hypokalemia, adenosine is contraindicated. The correct treatment is to FIX THE POTASSIUM and cardiovert if unstable."
        },
        epiIV: {
          ok: false,
          pri: null,
          fb: "Not first-line for wide-complex tachycardia with a pulse. Epinephrine increases myocardial oxygen demand, raises heart rate further, and can trigger VF in an already irritable myocardium. It's indicated for pulseless arrest, not organized tachyarrhythmia. If this child goes pulseless, then epi enters the algorithm."
        },
        nsBolus: {
          ok: true,
          pri: null,
          fb: "Appropriate as a temporizing measure. This child is hypovolemic AND arrhythmic. Volume helps maintain preload during the arrhythmia. But the DEFINITIVE treatment is correcting the rhythm and the underlying electrolyte abnormality. Fluid alone won't fix a potassium of 2.0."
        },
        lorazepam: {
          ok: false,
          pri: null,
          fb: "Not indicated for arrhythmia. Benzodiazepines are for seizures or procedural sedation. If you need to cardiovert, you WILL need sedation (etomidate or ketamine preferred), but lorazepam alone does nothing for the rhythm."
        },
        atropine: {
          ok: false,
          pri: null,
          fb: "Atropine increases heart rate by blocking vagal tone. This child's rate is ALREADY 220. Pushing atropine would be like adding fuel to a fire. Atropine is for symptomatic bradycardia, the opposite of this situation."
        },
        albuterol: {
          ok: false,
          pri: null,
          fb: "No respiratory indication. The tachypnea is from poor cardiac output and acidosis. Albuterol is a beta-agonist that would further stimulate the already irritable myocardium and potentially worsen the arrhythmia."
        }
      }
    },
    teaches: [
      {
        title: "Vomiting and Electrolyte Derangement",
        content: "Prolonged vomiting causes loss of H+ and Cl- from gastric secretions, producing hypochloremic, hypokalemic metabolic alkalosis. The kidneys compensate by excreting K+ and retaining H+, worsening hypokalemia. When serum K+ drops below 2.5-3.0 mEq/L, the cardiac myocyte resting membrane potential becomes less negative (partially depolarized), making the cell hyperexcitable. This predisposes to ventricular arrhythmias including VT and torsades de pointes.",
        tldr: "Vomiting loses stomach acid (H+ and Cl-), which drags potassium down with it. Low potassium makes heart cells electrically unstable and prone to dangerous arrhythmias."
      },
      {
        title: "SVT vs VT in Pediatrics",
        content: "Differentiating SVT from VT: SVT typically shows narrow QRS (< 0.09s), regular rate, and may have P waves buried in T waves. VT shows wide QRS (> 0.09s), may be slightly irregular, often has AV dissociation. In pediatrics, VT is less common than SVT but more dangerous. KEY RULE: any wide-complex tachycardia in a sick, hemodynamically unstable child should be treated as VT until proven otherwise. History matters - vomiting + dehydration + wide complex screams electrolyte-driven VT.",
        tldr: "Narrow QRS = probably SVT. Wide QRS = treat as VT until proven otherwise. In a sick kid with vomiting, wide complex almost certainly means electrolyte-driven VT."
      },
      {
        title: "Root Cause Thinking",
        content: "Don't just chase the rhythm on the monitor. Ask WHY the rhythm changed. This child had 3 days of vomiting causing hypokalemia. The arrhythmia is a SYMPTOM of the electrolyte problem, not the primary disease. Cardioversion may convert the rhythm temporarily, but it will recur unless you fix the potassium. Always look for and treat the root cause: check a BMP/electrolytes, replace K+ aggressively (0.5-1 mEq/kg IV over 1 hour with cardiac monitoring), and give magnesium (which stabilizes the cardiac membrane).",
        tldr: "The arrhythmia is a symptom, not the disease. Fix the potassium that caused it or the rhythm will keep coming back no matter how many times you shock."
      }
    ]
  },
  reassessment: {
    narrative: "After two 20 mL/kg boluses and potassium replacement, the child's perfusion and mental status have returned. Heart rate is down to 130, cap refill is 2 seconds, and his hands are warm to the touch. He has produced a small amount of concentrated urine, signaling that renal blood flow is recovering. He opens his eyes to voice and reaches for his mother's necklace.",
    vitals: {
      hr: 130,
      rr: 26,
      sbp: 94,
      dbp: 60,
      spo2: 99,
      temp: 36.9,
      cap: 2
    },
    signs: [
      {
        label: "Perfusion",
        finding: "Warm extremities, cap refill 2s",
        pos: "body",
        sys: "Cardiovascular"
      },
      {
        label: "Urine",
        finding: "Small concentrated void noted",
        pos: "body",
        sys: "Renal"
      },
      {
        label: "Mental status",
        finding: "Alert, reaching for mother",
        pos: "head",
        sys: "Neuro"
      }
    ]
  },
  stabilizationSummary: "Repeated normal saline boluses restored circulating volume and reversed compensated hypovolemic shock. Potassium and magnesium replacement corrected the electrolyte derangement that triggered the arrhythmia, eliminating recurrence risk. Early recognition of the vomiting-hypokalemia-VT chain prevented the scenario from becoming a cardiac arrest.",
  debrief: {
    summary: "You recognized compensated hypovolemic shock in a dehydrated toddler, initiated fluid resuscitation, and identified a wide-complex tachycardia caused by electrolyte derangement from prolonged vomiting. Root cause thinking - connecting the vomiting to hypokalemia to arrhythmia - was the critical skill tested.",
    explainers: [
      {
        title: "The Pediatric Shock Cliff",
        content: "Unlike adults who gradually decompensate, children have a binary-like transition. Their massive sympathetic reserve maintains perfusion until suddenly it doesn't. When catecholamine stores deplete and SVR collapses, BP crashes precipitously. Cap refill going from 3s to 5s is the warning. The next step is cardiovascular collapse with bradycardia - a pre-arrest rhythm in a child who was tachycardic.",
        tldr: "Kids compensate hard then crash suddenly. Worsening cap refill is the warning sign. Bradycardia in a previously tachycardic child means arrest is imminent."
      },
      {
        title: "Vomiting-Induced Metabolic Cascade",
        content: "Gastric fluid contains H+, Cl-, K+, and Na+. Losing it creates: (1) Metabolic alkalosis from H+ loss, (2) Hypochloremia triggering renal Cl- retention and HCO3- retention, (3) Hypokalemia from both direct loss and renal K+ wasting as kidneys try to retain H+. The kidneys exchange K+ for H+ in the collecting duct, worsening K+ depletion. Below K+ 3.0, ECG changes appear (flattened T waves, U waves). Below 2.5, arrhythmia risk skyrockets.",
        tldr: "Vomiting loses H+, Cl-, and K+. The kidneys make it worse by dumping more K+ to save H+. Below K+ 2.5, the heart becomes electrically unstable."
      },
      {
        title: "Electrolyte-Driven Arrhythmias in Children",
        content: "Hypokalemia shifts the myocyte resting potential from -90mV toward -70mV. This partial depolarization makes the cell easier to excite but harder to repolarize normally. The result: prolonged QT interval, increased automaticity, and re-entry circuits that generate VT. Torsades de pointes (polymorphic VT with twisting axis) is the classic hypokalemia arrhythmia. Treatment: IV potassium replacement AND IV magnesium (which stabilizes the cardiac membrane independent of K+ levels). Monitor on telemetry during replacement.",
        tldr: "Low potassium partially depolarizes heart cells, making them fire when they should not. Replace potassium AND magnesium, and keep the patient on a monitor while you do it."
      }
    ]
  }
};

export var SC3 = {
  id: "asthma-crisis",
  source: "builtin",
  title: "Can't Catch My Breath",
  tier: 2,
  icon: "🫁",
  tagline: "8-year-old - Severe Asthma Exacerbation",
  description: "An 8-year-old known asthmatic with worsening wheeze unresponsive to home treatment.",
  patient: {
    ageLabel: "8 years",
    weightKg: 25,
    sex: "Female",
    cc: "Worsening wheeze x 2 days, albuterol not helping",
    history: "Sophia is a known asthmatic who uses an albuterol inhaler PRN. Her mom says she has been wheezing for two days after a cold. She has used her inhaler 8 times today with no improvement. No prior ICU admissions but two ED visits in the past year. Takes no controller medications. Family history of asthma. Allergic to dust mites."
  },
  emsReport: "Walk-in triage. 8-year-old female with known asthma, wheezing progressively for 2 days after a cold. Mother reports 8 doses of home albuterol MDI today without relief. Arrived tripoding at the doorway with audible expiratory wheeze and speaking in 2-3 word phrases. No controller medications. Prior ED visits twice in the past year, no ICU history.",
  learnMore: "Pediatric status asthmaticus is acute severe asthma that does not respond adequately to standard bronchodilator therapy. Clinical severity correlates with air movement rather than wheeze loudness: a quiet chest in severe asthma is more concerning than loud wheeze. Key decision points are whether to continue inhaled therapy alone, add IV magnesium or terbutaline, initiate non-invasive ventilation, or proceed to intubation. Rising pCO2 in the face of treatment is the most reliable indicator that respiratory failure is imminent.",
  norms: {
    hr: [
      70,
      110
    ],
    rr: [
      18,
      25
    ],
    sbp: [
      90,
      115
    ],
    dbp: [
      55,
      70
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "An eight-year-old female named Sophia presents with a two-day history of worsening wheezing in the setting of a known asthma diagnosis. She has no controller medications and has visited the emergency department twice in the past year for exacerbations. Her mother reports that Sophia left soccer practice early two days ago due to persistent coughing, and today has used her albuterol metered-dose inhaler approximately eight times without meaningful relief. On arrival, Sophia is sitting upright in a tripod position with audible expiratory wheezing heard from the doorway. She is only able to speak in two- to three-word phrases between labored breaths, and you observe significant intercostal and subcostal retractions with each respiratory cycle.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "132",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Elevated for 8-year-old (normal 70-110). Tachycardia from three sources: hypoxia-driven sympathetic activation, increased work of breathing (respiratory muscles consuming massive O2), and likely beta-agonist effect from 8 doses of albuterol today."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "36",
          unit: "/min",
          bad: true,
          _slotRef: "phase[0].vitals.rr.why",
          why: "Significantly elevated (normal 18-25). The body increases respiratory rate to maintain minute ventilation despite reduced tidal volume from air trapping. Each breath moves less air, so more breaths are needed. This level of tachypnea is unsustainable."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "108",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "Normal for age. Cardiovascular system is not yet compromised. In severe asthma, pulsus paradoxus (> 10 mmHg drop in SBP during inspiration) indicates severe air trapping - worth checking but requires manual BP."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "68",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "93",
          unit: "%",
          bad: true,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "Below target (normal > 95%). This is concerning because the oxyhemoglobin dissociation curve is sigmoid - at 93%, PaO2 is approximately 65 mmHg. There is very little reserve before the steep part of the curve where small PaO2 drops cause large SpO2 crashes."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "37.4",
          unit: "C",
          bad: false,
          _slotRef: "phase[0].vitals.temp.why",
          why: "Low-grade, likely from the viral URI triggering the exacerbation. Not high enough to warrant treatment. The infection triggered airway inflammation which worsened the underlying asthma."
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "2",
          unit: "sec",
          bad: false,
          _slotRef: "phase[0].vitals.cap.why",
          why: "Normal. Perfusion is maintained. This is a primary respiratory problem, not a circulatory one - yet. If respiratory failure progresses to cardiovascular collapse, this will change."
        }
      },
      signs: [
        {
          id: "breathing-pattern",
          label: "Breathing pattern",
          finding: "Tripoding, intercostal and subcostal retractions, accessory muscle use",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          why: "Tripoding fixes the shoulder girdle so accessory muscles (scalenes, sternocleidomastoids, pecs) can assist with inspiration. Retractions appear because high negative intrathoracic pressure sucks in compliant chest wall soft tissues when airway resistance is high. These two findings together tell you the diaphragm alone cannot move enough air - this is severe obstructive distress.",
          _slotRef: "phase[0].signs.breathing-pattern.why"
        },
        {
          id: "wheeze",
          label: "Wheeze",
          finding: "Audible expiratory wheeze from doorway",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          why: "Audible wheeze (no stethoscope needed) indicates high-velocity turbulent airflow through narrowed bronchi. Wheeze volume correlates loosely with airflow, not severity - a 'quiet' chest in severe asthma is worse than loud wheeze, because it means air is not moving at all. Expiratory-only wheeze means obstruction is intrathoracic.",
          _slotRef: "phase[0].signs.wheeze.why"
        },
        {
          id: "speech",
          label: "Speech",
          finding: "2-3 word phrases only",
          pos: "face",
          sys: "Respiratory",
          bad: false,
          why: "Speech length is a bedside functional measure of tidal volume reserve. A healthy child speaks a full sentence per breath. 2-3 word phrases means tidal volume is so compromised that the child cannot spare air for more than a short burst of speech. Progression to single words or silence is impending respiratory failure.",
          _slotRef: "phase[0].signs.speech.why"
        },
        {
          id: "skin",
          label: "Skin",
          finding: "Mildly diaphoretic",
          pos: "body",
          sys: "Integumentary",
          bad: false,
          _slotRef: "phase[0].signs.skin.why"
        }
      ],
      labs: [
        {
          id: "ph",
          name: "pH",
          value: "7.38",
          unit: "",
          ref: "7.35-7.45",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.ph.why"
        },
        {
          id: "pco2",
          name: "pCO2",
          value: "48",
          unit: "mmHg",
          ref: "35-45",
          critical: true,
          bad: true,
          why: "This is the most important lab in this scenario. In acute asthma, pCO2 should be LOW because the patient is hyperventilating. A normal or rising pCO2 means ventilation is failing to keep up with CO2 production - the respiratory muscles are tiring. This is an ominous sign that respiratory failure is approaching.",
          _slotRef: "phase[0].labs.pco2.why"
        },
        {
          id: "po2",
          name: "pO2",
          value: "65",
          unit: "mmHg",
          ref: "80-100",
          critical: true,
          bad: false,
          why: "Moderately low. Corresponds to the SpO2 of 93%. Air trapping is creating V/Q mismatch - some alveoli are hyperinflated and poorly perfused while others are underventilated. The result is impaired gas exchange.",
          _slotRef: "phase[0].labs.po2.why"
        },
        {
          id: "hco3",
          name: "HCO3-",
          value: "26",
          unit: "mEq/L",
          ref: "22-26",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.hco3.why"
        },
        {
          id: "k",
          name: "K+",
          value: "3.8",
          unit: "mEq/L",
          ref: "3.5-5.5",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.k.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "142",
          unit: "mg/dL",
          ref: "60-100",
          critical: true,
          bad: false,
          why: "Stress hyperglycemia. The catecholamine surge from severe respiratory distress drives glycogenolysis and gluconeogenesis. Cortisol release from the stress response further raises blood sugar. This is expected and does not require insulin - it will resolve when the respiratory crisis resolves.",
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "wbc",
          name: "WBC",
          value: "12.4",
          unit: "K/uL",
          ref: "5.0-14.5",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.wbc.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "1.8",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: false,
          bad: false,
          _slotRef: "phase[0].labs.lactate.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Thirty minutes into aggressive treatment including continuous nebulized albuterol, ipratropium bromide, and intravenous methylprednisolone, Sophia's clinical status has not improved. She has stopped actively tripoding and is slumping forward with her arms at her sides, indicating respiratory muscle fatigue. The audible wheeze has become quieter, which in this context represents decreased air movement rather than clinical improvement. You observe worsening suprasternal, intercostal, and subcostal retractions with visible nasal flaring. The respiratory therapist notes that she appears to be tiring. Her oxygen saturation has drifted downward from 93 percent to 90 percent despite supplemental oxygen at four liters per minute via nasal cannula.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "145",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[1].vitals.hr.why",
          why: "Worsening tachycardia despite treatment. Heart is working harder because (1) hypoxia is worsening, (2) respiratory muscle O2 consumption is enormous - up to 40% of total cardiac output in severe asthma, (3) beta-agonist effect continues."
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "42",
          unit: "/min",
          bad: true,
          _slotRef: "phase[1].vitals.rr.why",
          why: "CRITICAL: Rate increased further despite treatment. The respiratory muscles are fatiguing. In asthma, a rising RR that then DROPS is the danger sign - it means the muscles are failing, not that the patient is improving."
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "112",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.sbp.why",
          why: "Maintained. Blood pressure is actually slightly elevated from the massive catecholamine response. This will remain normal until very late - cardiovascular collapse in respiratory failure is sudden."
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "70",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "90",
          unit: "%",
          bad: true,
          _slotRef: "phase[1].vitals.spo2.why",
          why: "Falling despite 4L NC. At SpO2 90%, PaO2 is approximately 60 mmHg - the inflection point of the oxyhemoglobin curve. Below this, saturation drops rapidly with small PaO2 changes. This child is on the cliff edge."
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "37.4",
          unit: "C",
          bad: false,
          _slotRef: "phase[1].vitals.temp.why",
          why: null
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "2",
          unit: "sec",
          bad: false,
          _slotRef: "phase[1].vitals.cap.why",
          why: "Still normal - primary respiratory failure has not yet progressed to cardiovascular compromise. But this can change in minutes if respiratory arrest occurs."
        }
      },
      labs: [
        {
          id: "ph",
          name: "pH",
          value: "7.32",
          unit: "",
          ref: "7.35-7.45",
          critical: true,
          bad: false,
          why: "Now acidotic. The rising pCO2 is overwhelming the bicarb buffer. This is respiratory acidosis from ventilatory failure - the respiratory muscles can no longer blow off CO2 fast enough. Acidosis further impairs muscle function, creating a downward spiral.",
          _slotRef: "phase[1].labs.ph.why"
        },
        {
          id: "pco2",
          name: "pCO2",
          value: "56",
          unit: "mmHg",
          ref: "35-45",
          critical: true,
          bad: false,
          why: "Rising from 48 to 56 despite treatment. This confirms respiratory failure is progressing. The diaphragm and intercostal muscles are fatiguing. If pCO2 continues to climb, the patient will need mechanical ventilation. Intubation in severe asthma is high-risk due to hyperinflation.",
          _slotRef: "phase[1].labs.pco2.why"
        },
        {
          id: "po2",
          name: "pO2",
          value: "58",
          unit: "mmHg",
          ref: "80-100",
          critical: true,
          bad: false,
          why: "Worsening. At PaO2 58, we are at the steep part of the oxyhemoglobin dissociation curve. The SpO2 of 90% is right at the cliff edge. Small further drops in PaO2 will cause the saturation to plummet.",
          _slotRef: "phase[1].labs.po2.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "2.8",
          unit: "mmol/L",
          ref: "0.5-2.0",
          critical: true,
          bad: false,
          why: "Rising from 1.8. The respiratory muscles are consuming enormous amounts of oxygen - up to 40% of total cardiac output in severe asthma. They are beginning to generate lactate from the extreme workload, even though systemic perfusion is still maintained.",
          _slotRef: "phase[1].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "168",
          unit: "mg/dL",
          ref: "60-100",
          critical: true,
          bad: false,
          why: "Persistent stress hyperglycemia. The ongoing catecholamine and cortisol release keeps driving glucose production. This is a marker of physiologic stress severity, not diabetes.",
          _slotRef: "phase[1].labs.glucose.why"
        },
        {
          id: "k",
          name: "K+",
          value: "3.4",
          unit: "mEq/L",
          ref: "3.5-5.5",
          critical: true,
          bad: false,
          why: "Dropping from 3.8. Repeated albuterol doses drive potassium intracellularly through beta-2 receptor stimulation of the Na/K ATPase. Combined with catecholamine-driven shifts, hypokalemia can develop and needs monitoring.",
          _slotRef: "phase[1].labs.k.why"
        }
      ],
      signs: [
        {
          id: "work-of-breathing",
          label: "Work of breathing",
          finding: "Severe suprasternal, intercostal, subcostal retractions with nasal flaring",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          why: "Suprasternal retractions mean the patient is generating huge negative intrathoracic pressures to overcome airway resistance. Nasal flaring is an infantile reflex that persists in severe pediatric distress - it reduces nasal airway resistance marginally. When all accessory muscles fire simultaneously, catastrophic fatigue is imminent.",
          _slotRef: "phase[1].signs.work-of-breathing.why"
        },
        {
          id: "wheeze-quality",
          label: "Wheeze quality",
          finding: "Diminished, quieter than initial presentation",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          why: "A quieting chest in severe asthma is a pre-arrest finding. Louder wheeze means air is still moving. When wheeze decreases WITHOUT clinical improvement, airways are closing down or the patient lacks enough airflow to generate turbulent sound. This is 'silent chest' territory - the pre-terminal phase of status asthmaticus.",
          _slotRef: "phase[1].signs.wheeze-quality.why"
        },
        {
          id: "mental-status",
          label: "Mental status",
          finding: "Exhausted, less combative, slumping forward",
          pos: "head",
          sys: "Neuro",
          bad: false,
          why: "A previously agitated, combative asthmatic becoming calm and drowsy is NOT improvement - it is CO2 narcosis. Rising pCO2 depresses CNS function. Decreased struggle means decreased ability to maintain minute ventilation. This clinical softening is the most reliable bedside indicator that intubation preparation should be active, not contemplated.",
          _slotRef: "phase[1].signs.mental-status.why"
        },
        {
          id: "posture",
          label: "Posture",
          finding: "No longer tripoding, arms hanging at sides",
          pos: "body",
          sys: "Respiratory",
          bad: false,
          why: "Loss of tripoding means the patient has given up recruiting accessory muscles - they are too exhausted. Respiratory muscle fatigue is the immediate precursor to respiratory arrest. The work the child was doing to stay alive is no longer sustainable.",
          _slotRef: "phase[1].signs.posture.why"
        }
      ],
      tools: [
        "stethoscope",
        "o2Mask",
        "bvmReady",
        "peakFlow",
        "ivKit",
        "capRefill",
        "defib"
      ],
      meds: [
        "albuterol",
        "epiIM",
        "methylprednisolone",
        "nsBolus",
        "acetaminophen",
        "lorazepam"
      ],
      actions: {
        tools: {
          stethoscope: {
            ok: true,
            pri: 1,
            fb: "CRITICAL assessment. Auscultate all lung fields bilaterally. You need to hear air entry. A quiet chest means critical air trapping with minimal ventilation. Compare left vs right - unequal air entry could indicate mucus plugging, atelectasis, or developing pneumothorax."
          },
          o2Mask: {
            ok: true,
            pri: 2,
            fb: "Escalate oxygen delivery. Move from nasal cannula to non-rebreather mask at 15 L/min. SpO2 90% on NC means she needs higher FiO2. NRB provides 60-80% FiO2 vs 28-44% from NC."
          },
          bvmReady: {
            ok: true,
            pri: null,
            fb: "Stage the BVM at the bedside. If SpO2 continues to fall or she becomes apneic, transition to active bagging immediately. In severe asthma, use slow rate (8-10/min) with long expiratory time to allow trapped air to escape. Aggressive bagging worsens hyperinflation."
          },
          peakFlow: {
            ok: false,
            pri: null,
            fb: "She can barely say her own name and you want her to blow into a peak flow meter? Peak flow requires maximal effort from a cooperative patient. In critical status asthmaticus, this wastes time and energy she does not have. Save it for when she can actually breathe."
          },
          ivKit: {
            ok: true,
            pri: null,
            fb: "Ensure IV access is secure. If she deteriorates to intubation, you need IV for RSI meds (ketamine preferred in asthma for bronchodilatory properties). May also need IV magnesium sulfate, which is next-line for refractory status asthmaticus."
          },
          capRefill: {
            ok: false,
            pri: null,
            fb: "Perfusion is maintained - normotensive, good color, cap refill 2 seconds. This is a respiratory problem, not a circulatory one. Checking cap refill adds nothing to your management right now. Focus on airway and breathing."
          },
          defib: {
            ok: false,
            pri: null,
            fb: "She is wheezing, not fibrillating. This child has sinus tachycardia from hypoxia and beta-agonist use. There is no shockable rhythm. Defibrillation is for VF or pulseless VT only. The defibrillator cannot fix bronchospasm. Please redirect your energy toward the nebulizer."
          }
        },
        meds: {
          albuterol: {
            ok: true,
            pri: 1,
            fb: "Continue continuous nebulized albuterol. In status asthmaticus, continuous nebulization (10-20 mg/hr) is more effective than intermittent dosing. Beta-2 receptors on bronchial smooth muscle relax when stimulated, increasing airway diameter. Monitor for tachycardia and tremor but do not stop - the tachycardia from hypoxia is more dangerous than from albuterol."
          },
          epiIM: {
            ok: true,
            pri: 2,
            fb: "IM epinephrine 0.01 mg/kg is appropriate for life-threatening asthma refractory to inhaled beta-agonists. Systemic epinephrine provides bronchodilation through beta-2 AND reduces mucosal edema through alpha-1 vasoconstriction. It reaches airways that nebulized albuterol can't penetrate due to severe bronchospasm and mucus plugging."
          },
          methylprednisolone: {
            ok: false,
            pri: null,
            fb: "Already given. Steroids take 4-6 hours for full effect. They work by reducing airway inflammation, decreasing mucus production, and upregulating beta-2 receptor sensitivity. Giving another dose this soon adds no benefit - the first dose is still working its way into action."
          },
          nsBolus: {
            ok: false,
            pri: null,
            fb: "Not indicated. BP is 112/70 and cap refill is normal. This child is not in shock - she is in respiratory failure. Volume loading a child who doesn't need it risks pulmonary edema, which would worsen her already compromised gas exchange."
          },
          acetaminophen: {
            ok: false,
            pri: null,
            fb: "Temp is 37.4C - not clinically significant. Treating a low-grade temp does not improve asthma outcomes and distracts from the real problem: worsening airway obstruction."
          },
          lorazepam: {
            ok: false,
            pri: null,
            fb: "Absolutely not. You want to sedate a child who is using every ounce of energy to keep breathing? Benzodiazepines cause respiratory depression by enhancing GABAergic inhibition in the brainstem respiratory centers. In a child barely maintaining ventilation, this could trigger immediate respiratory arrest. Anxiolytics in status asthmaticus are contraindicated unless you are actively intubating."
          }
        }
      }
    }
  ],
  curveball: {
    name: "Tension Pneumothorax",
    narrative: "Sophia suddenly clutches the right side of her chest and cries out in acute distress. The oxygen saturation alarm activates as the SpO2 rapidly falls from 90 percent to 78 percent over approximately 15 seconds. Her heart rate rises acutely to 170 beats per minute. On immediate auscultation, you appreciate diminished but present breath sounds on the left with continued wheezing, but the right hemithorax is completely silent with no air movement at the apex, base, or axilla. You observe jugular venous distension bilaterally, and the trachea appears deviated toward the left. The blood pressure drops to 82 over 50 millimeters of mercury. This constellation of findings is consistent with a right-sided tension pneumothorax.",
    vitals: {
      hr: {
        id: "hr",
        label: "HR",
        value: "170",
        unit: "bpm",
        bad: false,
        _slotRef: "phase[curveball].vitals.hr.why",
        why: null
      },
      rr: {
        id: "rr",
        label: "RR",
        value: "44",
        unit: "/min",
        bad: false,
        _slotRef: "phase[curveball].vitals.rr.why",
        why: null
      },
      sbp: {
        id: "sbp",
        label: "BP",
        value: "82",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.sbp.why",
        why: null
      },
      dbp: {
        id: "dbp",
        label: "BP",
        value: "50",
        unit: "mmHg",
        bad: false,
        _slotRef: "phase[curveball].vitals.dbp.why",
        why: null
      },
      spo2: {
        id: "spo2",
        label: "SpO2",
        value: "78",
        unit: "%",
        bad: false,
        _slotRef: "phase[curveball].vitals.spo2.why",
        why: null
      },
      temp: {
        id: "temp",
        label: "Temp",
        value: "37.4",
        unit: "C",
        bad: false,
        _slotRef: "phase[curveball].vitals.temp.why",
        why: null
      },
      cap: {
        id: "cap",
        label: "Cap Refill",
        value: "5",
        unit: "sec",
        bad: false,
        _slotRef: "phase[curveball].vitals.cap.why",
        why: null
      }
    },
    labs: [
      {
        id: "ph",
        name: "pH",
        value: "7.18",
        unit: "",
        ref: "7.35-7.45",
        critical: true,
        bad: false,
        why: "Severe mixed acidosis. Both respiratory (pCO2 72 from inability to ventilate the collapsed lung) and metabolic (lactate 5.6 from tissue hypoperfusion). The right lung is not exchanging gas and the cardiovascular system is in obstructive shock.",
        _slotRef: "phase[curveball].labs.ph.why"
      },
      {
        id: "pco2",
        name: "pCO2",
        value: "72",
        unit: "mmHg",
        ref: "35-45",
        critical: true,
        bad: false,
        why: "Severely elevated. The right lung has collapsed from the pneumothorax and the left lung is still obstructed from asthma. Effective ventilation has been cut in half or worse. CO2 is accumulating rapidly.",
        _slotRef: "phase[curveball].labs.pco2.why"
      },
      {
        id: "po2",
        name: "pO2",
        value: "42",
        unit: "mmHg",
        ref: "80-100",
        critical: true,
        bad: false,
        why: "Critically low, corresponding to SpO2 78%. Only the left lung is participating in gas exchange, and it is still bronchospastic. The patient is in imminent danger of hypoxic cardiac arrest.",
        _slotRef: "phase[curveball].labs.po2.why"
      },
      {
        id: "lactate",
        name: "Lactate",
        value: "5.6",
        unit: "mmol/L",
        ref: "0.5-2.0",
        critical: true,
        bad: false,
        why: "Sharply elevated from 2.8. The tension pneumothorax is compressing the great vessels, reducing cardiac output. Tissues are hypoperfused and generating lactate. This will correct rapidly once the tension is relieved by needle decompression.",
        _slotRef: "phase[curveball].labs.lactate.why"
      }
    ],
    signs: [
      {
        id: "breath-sounds",
        label: "Breath sounds",
        finding: "Absent on right, present with wheeze on left",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.breath-sounds.why"
      },
      {
        id: "neck-veins",
        label: "Neck veins",
        finding: "Jugular venous distension bilaterally",
        pos: "head",
        bad: false,
        _slotRef: "phase[curveball].signs.neck-veins.why"
      },
      {
        id: "trachea",
        label: "Trachea",
        finding: "Deviated toward the left",
        pos: "face",
        bad: false,
        _slotRef: "phase[curveball].signs.trachea.why"
      },
      {
        id: "hypotension",
        label: "Hypotension",
        finding: "BP 82/50, down from 112/70",
        pos: "body",
        bad: false,
        _slotRef: "phase[curveball].signs.hypotension.why"
      }
    ],
    tools: [
      "stethoscope",
      "needleDecomp",
      "o2Mask",
      "bvm",
      "defib",
      "ivKit"
    ],
    meds: [
      "nsBolus",
      "epiIV",
      "albuterol",
      "lorazepam",
      "atropine",
      "acetaminophen"
    ],
    actions: {
      tools: {
        needleDecomp: {
          ok: true,
          pri: 1,
          fb: "IMMEDIATE needle decompression. This is a tension pneumothorax - a clinical diagnosis that does NOT wait for chest X-ray. In a pediatric patient: insert a 14-16 gauge angiocatheter at the 2nd intercostal space, midclavicular line (or 4th-5th ICS, anterior axillary line in larger children). Go over the top of the rib to avoid the neurovascular bundle running along the inferior border. You should hear a rush of air. This converts tension pneumo to simple pneumo and buys time for chest tube placement. DECOMPRESS BEFORE INTUBATING - positive pressure ventilation will worsen tension physiology."
        },
        stethoscope: {
          ok: true,
          pri: null,
          fb: "Confirms unilateral absent breath sounds on the right. This clinical finding + sudden desat + hypotension + JVD = tension pneumothorax. You've already done this - now ACT on the finding. In tension pneumo, auscultation gives you the diagnosis. Don't wait for imaging."
        },
        o2Mask: {
          ok: true,
          pri: 2,
          fb: "Maximize FiO2 with non-rebreather at 15 L/min. The collapsed right lung isn't participating in gas exchange. You're relying entirely on the left lung. Give it the highest oxygen concentration possible. This child's SpO2 of 78% means PaO2 is approximately 40 mmHg - severely hypoxic."
        },
        bvm: {
          ok: false,
          pri: null,
          fb: "DANGEROUS right now. Positive pressure ventilation (bagging) will push MORE air into the pleural space through the ruptured bleb, worsening the tension. You must decompress FIRST. After needle decompression converts tension to simple pneumothorax, THEN you can assist ventilation if needed. Sequence matters: decompress, then ventilate."
        },
        defib: {
          ok: false,
          pri: null,
          fb: "Not indicated. The rhythm is sinus tachycardia - an appropriate response to hypoxia and low cardiac output. The heart is doing what it should given the catastrophic lung problem. Fix the pneumothorax and the tachycardia will improve. Defibrillation is for VF/pulseless VT."
        },
        ivKit: {
          ok: true,
          pri: null,
          fb: "Ensure IV access for post-decompression management. May need fluid bolus (preload was acutely reduced by tension physiology), sedation for chest tube placement, and continued asthma management once the pneumothorax is addressed."
        }
      },
      meds: {
        nsBolus: {
          ok: true,
          pri: null,
          fb: "Reasonable after decompression. Tension pneumothorax acutely reduces preload by compressing the IVC/SVC. Even after relieving the tension, the child may need a 20 mL/kg bolus to restore circulating volume and improve cardiac output during recovery."
        },
        epiIV: {
          ok: false,
          pri: null,
          fb: "Not the right drug for this problem. The hemodynamic collapse is MECHANICAL - compressed great vessels from tension pneumothorax. Epinephrine can't fix plumbing that is physically kinked. Decompress first - if hypotension persists after decompression, then consider vasopressors. But usually BP recovers immediately once tension is relieved."
        },
        albuterol: {
          ok: false,
          pri: null,
          fb: "Albuterol treats bronchospasm, not pneumothorax. While this child does have asthma, the acute crisis is a mechanical problem - air in the pleural space. Bronchodilators cannot fix a collapsed lung. Stabilize the pneumothorax first, then resume asthma management."
        },
        lorazepam: {
          ok: false,
          pri: null,
          fb: "Respiratory depressant in a child with SpO2 of 78%. Sedation without securing the airway and fixing the pneumothorax could cause respiratory arrest. May be appropriate LATER for procedural sedation during chest tube insertion, but not now."
        },
        atropine: {
          ok: false,
          pri: null,
          fb: "Heart rate is 170. Atropine increases HR by blocking vagal tone. This patient needs the opposite - fix the mechanical problem (pneumothorax) so the compensatory tachycardia can resolve."
        },
        acetaminophen: {
          ok: false,
          pri: null,
          fb: "Completely irrelevant in this emergency. Temperature is normal. Focus on the life-threatening problem: tension pneumothorax requiring immediate decompression."
        }
      }
    },
    teaches: [
      {
        title: "Asthma to Pneumothorax Pathway",
        content: "Severe asthma causes air trapping through ball-valve bronchospasm - air enters on inspiration but can't fully exit on expiration. Progressive hyperinflation raises intraalveolar pressure. Forceful coughing or high-pressure mechanical ventilation can rupture weakened alveolar blebs. Air dissects along perivascular sheaths into the pleural space. If the rupture acts as a one-way valve, air accumulates with each breath creating TENSION - compressing the lung, shifting the mediastinum, and kinking the great vessels.",
        tldr: "Severe asthma traps air, pressure builds, a bleb ruptures, air leaks into the chest, and if it can only go in and not out, you get tension pneumothorax."
      },
      {
        title: "Tension Pneumothorax Physiology",
        content: "Tension pneumothorax is a cascade of mechanical compression: (1) Air accumulates in pleural space under pressure. (2) Ipsilateral lung collapses - V/Q mismatch causes hypoxia. (3) Mediastinum shifts toward contralateral side - compresses the opposite lung reducing ventilation further. (4) IVC and SVC compress - venous return to the heart drops. (5) Cardiac output falls - preload-dependent CO crashes. (6) Obstructive shock develops - the heart physically cannot fill. This is why it kills fast and why decompression is immediately lifesaving.",
        tldr: "Air pressure in the chest collapses the lung, pushes the heart over, kinks the big veins, and cardiac output tanks. Needle decompression takes 30 seconds and reverses it."
      },
      {
        title: "Decompress Before Intubation",
        content: "Critical sequencing: ALWAYS decompress a tension pneumothorax BEFORE positive pressure ventilation. Intubating and bagging a patient with unrelieved tension pushes more air through the ruptured bleb into the pleural space with each breath. The positive pressure accelerates the tension cascade and can cause PEA arrest within minutes. Needle decompression takes 30 seconds and converts tension to simple pneumothorax. Then you can safely intubate if needed. Sequence: recognize, decompress, oxygenate, then manage the airway.",
        tldr: "Bagging a tension pneumo forces more air into the chest and kills faster. Decompress first (30 seconds), then intubate."
      }
    ]
  },
  reassessment: {
    narrative: "Following needle decompression and continued bronchodilator therapy, Sophia's respiratory mechanics have improved. She is speaking in full sentences again, work of breathing has decreased, and the tracheal shift has resolved. Breath sounds are audible bilaterally with residual scattered wheeze. She asks if she can have her inhaler back.",
    vitals: {
      hr: 118,
      rr: 26,
      sbp: 106,
      dbp: 68,
      spo2: 96,
      temp: 37.4,
      cap: 2
    },
    signs: [
      {
        label: "Work of breathing",
        finding: "Mild retractions only, no accessory muscle use",
        pos: "body",
        sys: "Respiratory"
      },
      {
        label: "Breath sounds",
        finding: "Bilateral, scattered expiratory wheeze",
        pos: "body",
        sys: "Respiratory"
      },
      {
        label: "Mental status",
        finding: "Alert, speaking in full sentences",
        pos: "head",
        sys: "Neuro"
      }
    ]
  },
  stabilizationSummary: "Needle decompression immediately reversed the tension pneumothorax, restoring venous return and cardiac output. Continuous albuterol plus IV methylprednisolone broke the underlying bronchospasm and inflammation. Early recognition of the unilateral breath sounds prevented progression to PEA arrest from obstructive shock.",
  debrief: {
    summary: "You managed escalating status asthmaticus, recognized the transition from compensating to failing respiratory mechanics, and identified a tension pneumothorax when the clinical picture suddenly changed. The critical skill was pattern interruption - recognizing that unilateral absent breath sounds + sudden desat + hypotension represented a NEW diagnosis superimposed on asthma.",
    explainers: [
      {
        title: "Respiratory Compensation and Failure",
        content: "In asthma, tachypnea initially compensates for reduced tidal volume from air trapping. But respiratory muscles have finite endurance. The diaphragm and intercostals can only sustain high work of breathing for hours before glycogen depletes and fatigue sets in. When RR drops in a patient who was tachypneic, it is NOT improvement - it is failure. The quiet chest (diminished wheeze) means airflow has dropped so low that there isn't enough velocity to generate turbulent sound. Quiet + tired = intubation imminent.",
        tldr: "Fast breathing compensates for trapped air until the muscles run out of gas. A dropping respiratory rate in an asthmatic is not improvement - it is respiratory failure."
      },
      {
        title: "The Oxyhemoglobin Cliff",
        content: "The sigmoid shape of the oxyhemoglobin dissociation curve means SpO2 stays relatively stable between PaO2 60-100 mmHg (SpO2 90-99%). Below PaO2 60 (SpO2 ~90%), the curve steepens dramatically. A patient at SpO2 93% has a PaO2 of ~65 with some reserve. At SpO2 90%, PaO2 is ~60 with almost no reserve. At 85%, PaO2 is ~50 and falling fast. This is why a drop from 93% to 90% should trigger escalation - you're entering the danger zone of the curve.",
        tldr: "SpO2 90-99% looks stable but hides a lot of variation in actual oxygen levels. Below 90%, small changes in oxygen cause the saturation to plummet. Treat 93% to 90% as a red flag, not a small dip."
      },
      {
        title: "Pattern Interruption in Critical Care",
        content: "The most dangerous cognitive trap in critical care is anchoring to your initial diagnosis. This patient had asthma. Everyone was treating asthma. When the pneumothorax developed, the temptation is to think 'the asthma is just getting worse' and double down on bronchodilators. The unilateral finding (absent breath sounds on ONE side) is the key that breaks the pattern. Asthma is bilateral. Unilateral absent sounds means something else is happening. Training your brain to notice when the pattern changes is what prevents deaths from missed diagnoses.",
        tldr: "Asthma is bilateral. If breath sounds disappear on only ONE side, the diagnosis has changed. Do not keep treating asthma when a pneumothorax is killing your patient."
      }
    ]
  }
};

export var SC4 = {
  id: "infant-septic-shock",
  source: "builtin",
  title: "Limp and Lethargic: Infant in Septic Shock",
  tier: 2,
  icon: "🌡️",
  tagline: "Smallest patient. Biggest danger. Fastest clock.",
  description: "Six-month-old Mateo Reyes arrives via EMS limp, barely responsive, and pale after two days of vomiting and progressive lethargy. Despite a prehospital saline bolus, he remains profoundly ill — and the most dangerous finding may not be the one anyone thought to check.",
  visuals: [],
  patient: {
    ageLabel: "6-Month-Old",
    weightKg: 8,
    sex: "Male",
    cc: "Vomiting and lethargy x 2 days",
    history: "Mateo is a previously healthy 6-month-old male with no prior medical history, no known allergies, and no home medications. His mother reports two days of persistent vomiting — initially non-bilious, now with decreased frequency as oral intake has nearly ceased — and progressive decrease in activity and responsiveness, with a notable sharp decline since this morning. He has had no wet diapers in approximately 8 hours. He is exclusively formula-fed and has not yet started solid foods. No fever was measured at home. An older sibling had a mild upper respiratory illness two weeks prior, but no other sick contacts are identified."
  },
  emsReport: "EMS transported a 6-month-old male from home at the request of his mother following two days of vomiting and decreased activity. Paramedics established a 24-gauge peripheral IV in the left antecubital fossa and administered 200 mL of normal saline en route. The infant remained lethargic with eyes intermittently open and no purposeful movement observed throughout transport. Mother reports he has had no wet diapers in approximately 8 hours.",
  learnMore: "Sepsis in infants under 12 months presents differently from older children due to immature immune response, limited hepatic glycogen reserves, and diminished cardiovascular reserve. Age-adjusted SIRS criteria define tachycardia as HR >180 bpm in infants — bradycardia (<100 bpm) is an equally dangerous late finding. Urinary tract infections are the most common identifiable bacterial source in this age group, particularly in uncircumcised male infants, with E. coli as the predominant pathogen. Early recognition of compensated shock (normal BP, altered perfusion markers) versus decompensated shock (hypotension present) determines the urgency of vasopressor initiation alongside fluid and antibiotic therapy.",
  norms: {
    hr: [
      80,
      160
    ],
    rr: [
      30,
      60
    ],
    sbp: [
      70,
      100
    ],
    dbp: [
      40,
      65
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "Mateo arrives on the EMS gurney, limp and minimally responsive. He opens his eyes briefly to painful stimulation but does not localize or produce a cry. His color is pale and mottled, with extremities cold to the touch below the elbows and knees. Paramedics placed him on supplemental oxygen via nasal cannula en route. A 24-gauge peripheral IV in the left antecubital fossa is patent on arrival, and 200 mL of normal saline was infused pre-hospital. Trachea is midline. No petechiae or purpuric rash are identified on full skin examination.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "188",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Heart rate of 188 bpm significantly exceeds the upper normal limit of 160 bpm for a 6-month-old, representing pathologic tachycardia.\n\n- **Compensatory sinus tachycardia** is the primary mechanism by which infants maintain cardiac output in shock — because stroke volume is relatively fixed, rate is the dominant cardiac output variable\n- Inflammatory cytokines (**IL-6, TNF-α**) directly stimulate the sinoatrial node, driving rate elevation beyond what sympathetic tone alone produces\n- HR >**180 bpm** defines tachycardia by age-adjusted SIRS criteria for infants under 12 months\n- Tachycardia is one of the **earliest and most sensitive** vital sign abnormalities in pediatric shock — it must be taken seriously in any ill-appearing infant"
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "62",
          unit: "/min",
          bad: true,
          _slotRef: "phase[0].vitals.rr.why",
          why: "Respiratory rate of 62 breaths per minute exceeds the normal maximum of 60/min for a 6-month-old, representing clinically significant tachypnea.\n\n- In the setting of severe metabolic acidosis (HCO3 12 mEq/L), tachypnea represents **Kussmaul-type compensatory hyperventilation** — the respiratory system blowing off CO2 to buffer the acidosis\n- **Winter's formula** predicts expected compensatory pCO2: 1.5 × 12 + 8 = 26 mmHg — consistent with the degree of tachypnea observed\n- Tachypnea in a febrile, lethargic infant also raises concern for **primary respiratory infection** — excluded here by clear bilateral breath sounds\n- Increasing respiratory rate over time signals **deepening acidosis** and approaching respiratory fatigue"
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "66",
          unit: "mmHg",
          bad: true,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "Systolic BP of 66 mmHg falls below the minimum acceptable threshold of 70 mmHg for a 6-month-old infant, defining decompensated (hypotensive) septic shock.\n\n- **Hypotension in pediatric sepsis is a late finding** — it represents failure of all compensatory mechanisms (tachycardia, peripheral vasoconstriction, increased contractility)\n- At SBP 66 mmHg, **cerebral and coronary perfusion pressures** are critically compromised, directly explaining the altered consciousness and decreased tone\n- PALS defines **decompensated shock** as shock with hypotension — this distinguishes from compensated shock and escalates the urgency of vasopressor readiness\n- This infant received **25 mL/kg** NS pre-arrival without normalizing BP — a key signal of developing fluid-refractory shock"
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "46",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "96",
          unit: "%",
          bad: false,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "SpO2 of 96% on supplemental nasal cannula oxygen falls within the normal acceptable range (≥95%) and should not be flagged as a critical abnormality.\n\n- **96% SpO2** on supplemental O2 does not indicate hypoxemia requiring emergent airway intervention at this moment\n- However, in severe **peripheral vasoconstriction**, pulse oximetry accuracy is reduced — the probe may fail to detect adequate pulsatile flow distally, making readings less reliable\n- The infant's critical illness is driven by **circulatory failure**, not primary hypoxia — SpO2 alone does not capture the severity of impaired oxygen delivery\n- Correct management is to upgrade O2 delivery (NRB mask) and treat the underlying shock — not to be falsely reassured by a borderline-normal SpO2 number"
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "38.9",
          unit: "C",
          bad: true,
          _slotRef: "phase[0].vitals.temp.why",
          why: "Temperature of 38.9°C exceeds the normal threshold of 37.5°C, indicating fever consistent with an active infectious or inflammatory process.\n\n- **Fever** in the context of altered perfusion, tachycardia, and hypotension in an infant constitutes a sepsis presentation until proven otherwise\n- Fever is mediated by **prostaglandin E2** acting on the hypothalamic thermoregulatory center in response to circulating pyrogens (IL-1β, TNF-α, IL-6) from the infectious source\n- Critically, some infants — especially those under 3 months — may be **afebrile or hypothermic** in sepsis due to immature thermoregulation; the absence of fever never excludes sepsis\n- Fever at 38.9°C in a 6-month-old with hemodynamic instability mandates **immediate blood cultures and empiric antibiotic therapy**"
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "4",
          unit: "sec",
          bad: true,
          _slotRef: "phase[0].vitals.cap.why",
          why: "Capillary refill time of 4 seconds is markedly prolonged beyond the normal maximum of 2 seconds, indicating severely impaired peripheral microcirculation.\n\n- **Normal cap refill** is ≤2 seconds in children; 3 seconds is borderline; ≥4 seconds indicates impaired microvascular flow consistent with shock\n- Prolonged cap refill reflects **arteriolar vasoconstriction** and reduced skin perfusion pressure from sympathetic activation and low cardiac output\n- In pediatric sepsis, cap refill >3 seconds correlates with elevated lactate and is an independent predictor of **organ dysfunction**\n- Serial cap refill measurement trends treatment response — improvement to <2 seconds following resuscitation confirms improved cardiac output"
        }
      },
      signs: [
        {
          id: "skin",
          label: "Skin",
          finding: "Mottled and pale from elbows and knees distally; trunk pale but less mottled; extremities cold and clammy below mid-forearm and mid-calf",
          pos: "body",
          sys: "cardiovascular",
          bad: true,
          why: "Mottling and pallor with cold extremities represent the clinical signature of cold septic shock in an infant.\n\n- **Vasoconstriction** from sympathetic activation redistributes blood away from skin to vital organs — producing pallor and cold peripheries\n- **Mottling** results from heterogeneous microcirculatory flow with alternating zones of vasodilation and vasoconstriction, producing a marbled appearance\n- The **distal-to-proximal gradient** (elbows and knees first) reflects the anatomical hierarchy of sympathetically mediated vasoconstriction\n- **Cold shock phenotype** — high systemic vascular resistance, low cardiac output — distinguishes this from warm septic shock (vasodilated, bounding pulses)\n- Mottling score ≥3 in pediatric sepsis correlates with elevated lactate and worse clinical outcomes",
          _slotRef: "phase[0].signs.skin.why"
        },
        {
          id: "anterior-fontanelle",
          label: "Anterior Fontanelle",
          finding: "Sunken approximately 1 cm below the cranial surface; soft; no bulging or tenseness",
          pos: "head",
          sys: "neurological",
          bad: true,
          why: "A sunken anterior fontanelle reflects significant total body fluid depletion in this infant.\n\n- The **anterior fontanelle** closes between 9 and 18 months; while patent, it provides a direct window into intracranial volume and pressure status\n- **Sunken fontanelle** indicates decreased CSF and intravascular volume — a reliable bedside marker of moderate-to-severe dehydration in infants\n- Two days of vomiting with near-zero oral intake has produced both **intravascular and interstitial volume loss**, confirmed by the absent wet diapers\n- **Absence of bulging** argues against acutely elevated ICP from bacterial meningitis — though meningitis cannot be excluded without lumbar puncture once stable",
          _slotRef: "phase[0].signs.anterior-fontanelle.why"
        },
        {
          id: "muscle-tone",
          label: "Muscle Tone",
          finding: "Markedly hypotonic in all four extremities and trunk; minimal resistance to passive movement; floppy posture when lifted",
          pos: "body",
          sys: "neurological",
          bad: true,
          why: "Global hypotonia in a previously healthy 6-month-old signals severe systemic illness impairing CNS function.\n\n- **Hypoglycemia** (glucose 34 mg/dL) is the most immediately reversible cause of cortical depression and loss of muscle tone in infants\n- **Metabolic acidosis** (HCO3 12 mEq/L) and systemic inflammatory mediators directly impair neuronal membrane function\n- **Cerebral hypoperfusion** from systolic hypotension (66 mmHg) reduces substrate delivery to motor cortex and corticospinal pathways\n- **Global hypotonia** versus focal weakness helps distinguish systemic illness from a focal neurological lesion — global involvement here points firmly toward septic/metabolic etiology",
          _slotRef: "phase[0].signs.muscle-tone.why"
        },
        {
          id: "peripheral-pulses",
          label: "Peripheral Pulses",
          finding: "Brachial pulses weak and thready bilaterally; radial pulses absent bilaterally; femoral pulses faintly palpable",
          pos: "body",
          sys: "cardiovascular",
          bad: true,
          why: "Absent radial pulses with weak brachial pulses indicates advanced shock with critically reduced distal perfusion pressure.\n\n- **Pulse amplitude** reflects the product of stroke volume and vascular resistance — in cold shock, high SVR narrows pulse pressure and dampens peripheral waveform\n- **Absent radial pulses** indicate distal perfusion pressure has fallen below the threshold for palpable pulse generation — a critical threshold in shock staging\n- The hierarchy of pulse loss (radial → brachial → femoral) follows the anatomical gradient of peripheral vasoconstriction\n- **Absent femoral pulses** would signal imminent cardiovascular collapse — their faint presence here confirms the patient is critically ill but not yet in arrest\n- This finding places vasopressor readiness as the next clinical contingency if fluids fail",
          _slotRef: "phase[0].signs.peripheral-pulses.why"
        },
        {
          id: "breath-sounds",
          label: "Breath Sounds",
          finding: "Equal and clear bilaterally; no crackles, no wheeze, no stridor; mild tachypnea noted on auscultation",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "Clear, equal bilateral breath sounds are a reassuring finding that excludes several dangerous contributors to this infant's shock state.\n\n- **Equal breath sounds** exclude pneumothorax and significant pleural effusion as contributors to hemodynamic compromise\n- **Absence of crackles** confirms no pulmonary edema from the prehospital fluid bolus — providing clinical safety to continue IV fluid resuscitation\n- **No wheeze** argues against bronchiolitis or reactive airway disease as a primary diagnosis\n- The observed **tachypnea** is the respiratory system's compensatory response to metabolic acidosis — not a primary airway or parenchymal process",
          _slotRef: "phase[0].signs.breath-sounds.why"
        },
        {
          id: "abdomen",
          label: "Abdomen",
          finding: "Soft, non-distended, non-tender; no guarding or rigidity; bowel sounds present in all quadrants; no palpable masses or organomegaly",
          pos: "body",
          sys: "gastrointestinal",
          bad: false,
          why: "A soft, non-tender abdomen without peritoneal signs is reassuring against a primary surgical cause of shock in this infant.\n\n- **Absence of guarding or rigidity** argues against intestinal perforation, which would produce a board-like abdomen with peritoneal signs\n- **No palpable mass** reduces concern for intussusception (lead-point mass in RUQ) — an important differential in a 6-month-old with vomiting and lethargy\n- **Present bowel sounds** confirm ongoing intestinal motility without complete ileus\n- This finding supports a **medical (infectious/septic) rather than surgical** etiology, directing management toward sepsis resuscitation",
          _slotRef: "phase[0].signs.abdomen.why"
        }
      ],
      labs: [
        {
          id: "wbc",
          name: "WBC",
          value: "26,800",
          unit: "/µL",
          ref: "6,000–17,500",
          critical: true,
          bad: true,
          why: "Leukocytosis above 17,500/µL in a febrile, hemodynamically unstable infant supports bacterial sepsis as the underlying diagnosis.\n\n- **WBC elevation** reflects bone marrow mobilization of mature and immature neutrophils via G-CSF, IL-1, and IL-6\n- Combined with elevated **CRP and lactate**, leukocytosis creates a convergent inflammatory picture strongly favoring bacterial over viral etiology\n- **Bandemia** (>10% band forms) would further increase specificity for acute bacterial infection\n- This value supports proceeding with empiric **broad-spectrum antibiotic therapy** without awaiting culture results",
          _slotRef: "phase[0].labs.wbc.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "5.8",
          unit: "mmol/L",
          ref: "0.5–2.0",
          critical: true,
          bad: true,
          why: "Lactate 5.8 mmol/L defines severe anaerobic metabolism and identifies the degree of tissue oxygen debt in this infant.\n\n- **Lactic acidosis** in septic shock results from reduced cardiac output, microvascular dysfunction, and direct mitochondrial impairment from bacterial endotoxins\n- Lactate >**4 mmol/L** in pediatric sepsis correlates with significantly increased organ dysfunction and mortality\n- **Lactate clearance** ≥10% per hour during resuscitation is a validated marker of effective improvement in tissue oxygen delivery\n- This value should trigger immediate hemodynamic resuscitation with close reassessment of perfusion markers",
          _slotRef: "phase[0].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "34",
          unit: "mg/dL",
          ref: "60–100",
          critical: true,
          bad: true,
          why: "Glucose of 34 mg/dL is a neurological emergency in an infant — as urgent as the hemodynamic resuscitation.\n\n- Infants lack adequate **hepatic glycogen reserves** and gluconeogenic capacity to sustain normoglycemia under physiologic stress\n- Sepsis drives glucose consumption by activated immune cells while simultaneously impairing hepatic glucose production via cytokine inhibition\n- Neuronal dysfunction begins rapidly at glucose values below **40 mg/dL**; irreversible injury follows if untreated\n- Treatment: **D10W 5 mL/kg IV** (40 mL for this infant) provides 0.5 g/kg — preferred concentration to minimize hyperosmolar risk",
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "bicarbonate",
          name: "Bicarbonate",
          value: "12",
          unit: "mEq/L",
          ref: "18–28",
          critical: true,
          bad: true,
          why: "Bicarbonate of 12 mEq/L represents severe metabolic acidosis from lactic acid accumulation in decompensated septic shock.\n\n- Bicarbonate is consumed buffering excess **H⁺** generated during anaerobic glycolysis\n- At HCO3 12 mEq/L, estimated blood pH is approximately **7.22-7.25** — significantly impairing myocardial contractility and catecholamine receptor sensitivity\n- Acidosis at this level also reduces the threshold for **cardiac arrhythmia**\n- Treatment must address the **underlying shock** — bicarbonate supplementation is deferred unless pH falls below 7.10 after root-cause intervention",
          _slotRef: "phase[0].labs.bicarbonate.why"
        },
        {
          id: "sodium",
          name: "Sodium",
          value: "130",
          unit: "mEq/L",
          ref: "135–145",
          critical: true,
          bad: true,
          why: "Hyponatremia at 130 mEq/L reflects combined GI sodium loss, inadequate intake, and stress-induced SIADH.\n\n- Prolonged vomiting depletes **sodium-containing gastric secretions**; zero intake removes replacement\n- **SIADH** triggered by stress and volume depletion causes renal free-water retention, diluting serum sodium\n- Sodium below **130 mEq/L** increases the risk of symptomatic **cerebral edema** — critically dangerous in infants with limited intracranial compliance\n- Resuscitation with **normal saline** (Na 154 mEq/L) will partially correct hyponatremia while restoring intravascular volume",
          _slotRef: "phase[0].labs.sodium.why"
        },
        {
          id: "crp",
          name: "CRP",
          value: "86",
          unit: "mg/L",
          ref: "0–10",
          critical: true,
          bad: true,
          why: "CRP of 86 mg/L confirms a sustained, robust acute-phase inflammatory response consistent with bacterial sepsis at 48 hours of illness.\n\n- **CRP** rises 12-24 hours after infection onset in response to IL-6 from activated macrophages\n- Values >**40-80 mg/L** in febrile pediatric patients strongly associate with bacterial over viral etiology\n- Elevation at 2 days confirms this is a **sustained response** rather than a transient early peak\n- Combined with leukocytosis, lactate elevation, and clinical shock, CRP >80 supports empiric antibiotic administration without delay",
          _slotRef: "phase[0].labs.crp.why"
        },
        {
          id: "hemoglobin",
          name: "Hemoglobin",
          value: "11.0",
          unit: "g/dL",
          ref: "9.5–13.5",
          critical: false,
          bad: false,
          why: "Hemoglobin of 11.0 g/dL falls within the normal reference range of 9.5-13.5 g/dL for a 6-month-old infant and is not a flagworthy finding.\n\n- At 6 months, hemoglobin is recovering from the **physiologic nadir** of infancy (approximately 9.5-11 g/dL at 2-3 months) as erythropoiesis responds to increasing oxygen demands — 11.0 g/dL is age-appropriate\n- The shock state here is **distributive/septic**, not anemic — oxygen-carrying capacity is not the limiting factor; perfusion pressure and cardiac output are\n- **Transfusion is not indicated** in the absence of active hemorrhage, anemia-related hemodynamic compromise, or Hgb below threshold for the clinical context\n- Flagging this value would represent an error in age-adjusted pediatric laboratory interpretation",
          _slotRef: "phase[0].labs.hemoglobin.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Despite the 200 mL normal saline bolus administered by EMS, Mateo remains critically ill. He lies limp on the gurney with eyes half-open, responding only to sternal rub with a weak grimace — no cry, no purposeful movement. Skin is diffusely mottled from the trunk to the digits; extremities are cold and clammy below the elbows and knees. Brachial pulses are weak and thready; radial pulses remain absent bilaterally. The 24-gauge peripheral IV in the left antecubital fossa is confirmed patent with good blood return. Breath sounds are clear and equal bilaterally; trachea is midline. The abdomen remains soft and non-distended without guarding. The cardiac monitor confirms sinus tachycardia without ectopy. No petechiae or purpuric rash has been identified on full skin examination.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "194",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[1].vitals.hr.why",
          why: "Heart rate of 194 bpm reflects worsening compensatory tachycardia in an infant whose cardiac output is failing to keep pace with increasing metabolic demand.\n\n- Progressive tachycardia despite 25 mL/kg of prehospital fluid indicates the infant's compensatory reserve is being **overwhelmed**\n- At rates approaching 200 bpm, diastolic filling time becomes critically shortened — **cardiac output may paradoxically fall** despite the high rate\n- Worsening tachycardia in a resuscitated infant is a trigger for **immediate escalation** of therapy"
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "64",
          unit: "/min",
          bad: true,
          _slotRef: "phase[1].vitals.rr.why",
          why: "Respiratory rate of 64/min exceeds normal maximum and signals deepening metabolic acidosis with escalating respiratory compensatory drive.\n\n- Rising RR indicates the **metabolic acidosis is worsening** — the respiratory system is working harder to compensate for increasing lactic acid production\n- An infant who fatigues this compensatory drive risks **apnea** and respiratory arrest — a critical escalation point\n- BVM must be staged at the bedside as an immediate rescue device"
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "62",
          unit: "mmHg",
          bad: true,
          _slotRef: "phase[1].vitals.sbp.why",
          why: "SBP of 62 mmHg represents further deterioration below the minimum threshold of 70 mmHg despite prehospital fluid resuscitation.\n\n- Drop from 66 to 62 mmHg despite 25 mL/kg confirms **fluid-refractory or rapidly progressive septic shock**\n- At SBP 62 mmHg, cerebral perfusion pressure is critically reduced — the observed altered consciousness is a direct consequence\n- **Vasopressor readiness** (epinephrine) is the next escalation step if another fluid bolus fails to restore adequate BP"
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "44",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "94",
          unit: "%",
          bad: true,
          _slotRef: "phase[1].vitals.spo2.why",
          why: "SpO2 of 94% has fallen from triage value of 96% and now falls below the acceptable minimum of 95%, indicating progressive peripheral hypoxemia.\n\n- Declining SpO2 in the setting of **low cardiac output** reflects worsening oxygen delivery to peripheral tissues and reduced pulse oximetry signal strength\n- **Upgrading from nasal cannula to non-rebreather mask** is indicated immediately to maximize FiO2 and oxygen reserve\n- If SpO2 continues to fall despite high-flow O2, **assisted ventilation** (BVM or intubation) must be prepared"
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "38.9",
          unit: "C",
          bad: true,
          _slotRef: "phase[1].vitals.temp.why",
          why: "Persistent fever at 38.9°C confirms ongoing bacteremia or its inflammatory sequelae are driving the septic shock state.\n\n- Sustained fever signals the **pyrogenic stimulus** (bacteremia, endotoxin, circulating cytokines) remains active\n- Fever increases **metabolic oxygen demand**, worsening the supply-demand imbalance in already hypoperfused tissues\n- Definitive treatment is **antibiotic therapy** targeting the infectious source — antipyretics are not the priority in decompensated shock"
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "5",
          unit: "sec",
          bad: true,
          _slotRef: "phase[1].vitals.cap.why",
          why: "Capillary refill time of 5 seconds represents severe peripheral hypoperfusion and confirms that shock is advancing rather than compensating.\n\n- Progression from 4 to 5 seconds despite 25 mL/kg prehospital fluid confirms that microcirculatory compromise is **worsening**\n- Cap refill ≥4 seconds in a child correlates with elevated lactate and end-organ dysfunction\n- Improvement to <2 seconds following resuscitation is the **target endpoint** for perfusion restoration"
        }
      },
      signs: [
        {
          id: "mental-status",
          label: "Mental Status",
          finding: "Eyes half-open; responds only to sternal rub with weak grimace; no cry, no purposeful movement; AVPU: P (responds to Pain only)",
          pos: "head",
          sys: "neurological",
          bad: true,
          why: "AVPU = P in a 6-month-old who should be socially alert and interactive represents critical CNS dysfunction from combined hypoglycemia, metabolic acidosis, and cerebral hypoperfusion.\n\n- A normal 6-month-old tracks faces, smiles socially, and vocalizes (AVPU = A) — responding only to pain reflects profound **cortical suppression**\n- **Hypoglycemia** (glucose 34 mg/dL) is the most immediately reversible cause of this altered consciousness\n- **Cerebral hypoperfusion** at SBP 62 mmHg reduces oxygen and glucose delivery to cortical neurons simultaneously\n- Failure to improve neurologically after glucose correction and volume restoration should prompt consideration of **bacterial meningitis** (LP deferred until stable)",
          _slotRef: "phase[1].signs.mental-status.why"
        },
        {
          id: "skin-and-perfusion",
          label: "Skin and Perfusion",
          finding: "Diffuse mottling from trunk to digits; extremities cold and clammy below elbows and knees; generalized pallor",
          pos: "body",
          sys: "cardiovascular",
          bad: true,
          why: "Proximal progression of mottling to involve the trunk signals worsening compensatory failure and advancing decompensated shock.\n\n- Mottling extending to the **trunk** (rather than limited to extremities) represents exhaustion of the body's capacity to maintain selective vasoconstriction — shock is advancing\n- **Cold, clammy** extremities reflect the combination of intense sympathetic vasoconstriction and increased insensible losses from fever\n- This escalating mottling pattern is a bedside marker of **decompensating cold septic shock** requiring immediate hemodynamic intervention\n- Further delay risks progression to cardiovascular collapse and cardiac arrest",
          _slotRef: "phase[1].signs.skin-and-perfusion.why"
        },
        {
          id: "breath-sounds",
          label: "Breath Sounds",
          finding: "Clear and equal bilaterally; no crackles or wheeze; trachea midline; tachypnea present without accessory muscle use",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "Clear bilateral breath sounds with midline trachea confirm absence of tension pneumothorax and pulmonary edema at this stage of resuscitation.\n\n- **Midline trachea** excludes tension pneumothorax, which would deviate the trachea contralaterally and cause asymmetric breath sounds\n- **No crackles** confirm the prehospital NS bolus has not caused pulmonary edema — safe to continue volume resuscitation\n- **No retractions or grunting** indicate the infant is not yet in primary respiratory failure despite tachypnea from metabolic acidosis\n- Continued clear lungs provide clinical confidence to proceed with **fluid resuscitation** as part of the sepsis bundle",
          _slotRef: "phase[1].signs.breath-sounds.why"
        },
        {
          id: "iv-access",
          label: "IV Access",
          finding: "24-gauge peripheral IV in left antecubital fossa; good blood return on aspiration; flushes without resistance or swelling",
          pos: "body",
          sys: "vascular",
          bad: false,
          why: "A patent 24-gauge PIV provides a functional route for medication delivery but is a marginal bore for rapid large-volume resuscitation in this infant.\n\n- **Blood return confirmed**: validates intravenous (not subcutaneous) placement — critical before administering osmotically active medications like dextrose\n- **24-gauge bore** has limited maximum flow rate; adequate for push-dose medications but may restrict rapid fluid delivery under gravity or manual pressure\n- If this IV fails at any point, immediate **IO placement** (proximal tibia, EZ-IO 15mm needle) is the rescue access of choice — do not delay critical medications to attempt another peripheral IV\n- This is a reassuring but fragile single point of access in a critically ill infant",
          _slotRef: "phase[1].signs.iv-access.why"
        }
      ],
      labs: [
        {
          id: "lactate",
          name: "Lactate",
          value: "5.8",
          unit: "mmol/L",
          ref: "0.5–2.0",
          critical: true,
          bad: false,
          why: "Critically elevated lactate confirms ongoing anaerobic metabolism — the primary resuscitation endpoint to monitor.\n\n- **Lactate 5.8 mmol/L** defines the severity of septic shock and quantifies the depth of the tissue oxygen debt\n- Every intervention should be gauged against **lactate clearance** — a fall of ≥10% per hour indicates effective improvement in tissue oxygen delivery\n- Failure to clear lactate after appropriate resuscitation suggests worsening shock or uncontrolled infection source",
          _slotRef: "phase[1].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "34",
          unit: "mg/dL",
          ref: "60–100",
          critical: true,
          bad: false,
          why: "Critical hypoglycemia at 34 mg/dL is the most immediately time-sensitive metabolic emergency in this infant — neuronal injury can occur within minutes.\n\n- **D10W at 5 mL/kg** (40 mL for 8 kg) delivers 0.5 g/kg of glucose — the standard neonatal/infant correction dose\n- Hypoglycemia must be corrected **simultaneously with** the fluid bolus and antibiotic administration, not after\n- Recheck glucose in **15-30 minutes** to confirm correction and monitor for rebound hypoglycemia",
          _slotRef: "phase[1].labs.glucose.why"
        },
        {
          id: "bicarbonate",
          name: "Bicarbonate",
          value: "12",
          unit: "mEq/L",
          ref: "18–28",
          critical: true,
          bad: false,
          why: "Severe metabolic acidosis (HCO3 12) reflects the depth of lactic acid accumulation driving the shock state — and the urgency of restoring perfusion.\n\n- At HCO3 12, estimated pH is approximately **7.22-7.25**, impairing myocardial contractility and catecholamine receptor sensitivity\n- **Bicarbonate supplementation** is not indicated — treatment is directed at reversing shock and restoring aerobic metabolism\n- Improvement in HCO3 following resuscitation confirms effective restoration of **tissue oxygen delivery**",
          _slotRef: "phase[1].labs.bicarbonate.why"
        },
        {
          id: "procalcitonin",
          name: "Procalcitonin",
          value: "18.4",
          unit: "ng/mL",
          ref: "< 0.5",
          critical: true,
          bad: false,
          why: "Procalcitonin of 18.4 ng/mL is markedly elevated, providing strong diagnostic support for bacterial sepsis as the primary etiology.\n\n- **PCT** is released by parenchymal cells in response to bacterial endotoxin and cytokines (IL-6, TNF-α) — rising within 4-6 hours of bacterial infection onset and peaking at 24-48 hours\n- PCT >**2 ng/mL** correlates with bacteremia; values >10 ng/mL are associated with septic shock from bacterial sources\n- PCT rises much less in **viral infections** — making it a valuable discriminator in febrile infants where the clinical picture is unclear\n- **Serial PCT** can guide antibiotic de-escalation as values normalize with effective treatment",
          _slotRef: "phase[1].labs.procalcitonin.why"
        },
        {
          id: "wbc",
          name: "WBC",
          value: "26,800",
          unit: "/µL",
          ref: "6,000–17,500",
          critical: true,
          bad: false,
          why: "Persistent leukocytosis confirms an ongoing bacterial inflammatory response and supports continuing empiric antibiotic therapy.\n\n- WBC 26,800/µL in a 6-month-old combined with elevated **PCT, CRP, and lactate** provides a convergent picture of bacterial sepsis\n- **Leukocytosis with bandemia** would further increase specificity for acute bacterial infection over viral illness\n- This value combined with the clinical picture mandates **antibiotic administration** without waiting for culture results",
          _slotRef: "phase[1].labs.wbc.why"
        },
        {
          id: "crp",
          name: "CRP",
          value: "86",
          unit: "mg/L",
          ref: "0–10",
          critical: true,
          bad: false,
          why: "CRP of 86 mg/L remains markedly elevated, confirming active bacterial inflammatory process and supporting ongoing empiric antibiotic therapy.\n\n- At 86 mg/L, the **inflammatory burden** from the infecting organism is substantial and ongoing\n- CRP values this high in febrile children are strongly associated with **bacterial etiology** requiring antibiotic therapy\n- While CRP does not guide real-time hemodynamic management, it confirms the appropriateness of the empiric antibiotic decision and the overall sepsis diagnosis",
          _slotRef: "phase[1].labs.crp.why"
        },
        {
          id: "hemoglobin",
          name: "Hemoglobin",
          value: "11.0",
          unit: "g/dL",
          ref: "9.5–13.5",
          critical: false,
          bad: false,
          _slotRef: "phase[1].labs.hemoglobin.why"
        }
      ],
      tools: [
        "ivKit",
        "o2Mask",
        "stethoscope",
        "defib",
        "bvm",
        "pupilCheck"
      ],
      meds: [
        "dextroseBolus",
        "ceftriaxone",
        "nsBolus",
        "epiIV",
        "acetaminophen",
        "lorazepam"
      ],
      actions: {
        tools: {
          ivKit: {
            label: "Confirm IV Access / Consider IO Placement",
            ok: true,
            priority: 1,
            fb: "The 24-gauge peripheral IV in the left antecubital fossa is confirmed patent with excellent blood return and flushes without resistance or subcutaneous swelling. For an 8 kg infant in decompensated septic shock, this access is functional but marginal — adequate for push-dose medications but limited for rapid large-volume resuscitation.\n\n- **Blood return confirmed**: validates intravenous placement before administering dextrose or any hyperosmolar medication — extravasation would cause tissue injury\n- **24g bore**: flow rate is limited; manual pressure or pressure bags may be needed for rapid fluid delivery\n- If this IV fails, **IO access in the proximal tibia** (EZ-IO 15mm needle for pediatric patients) is the immediate rescue — do not attempt multiple peripheral IVs; go straight to IO\n- All critical medications — dextrose, antibiotics, and fluids — can be delivered through this line now; do not delay"
          },
          o2Mask: {
            label: "Apply Non-Rebreather Mask (High-Flow O2)",
            ok: true,
            priority: 2,
            fb: "Non-rebreather mask applied at 12-15 L/min. SpO2 improves from 94% to 98% within minutes of mask placement. Upgrading from nasal cannula to NRB increases FiO2 from approximately 28% to 60-90%, substantially improving the oxygen content available to hypoperfused tissues.\n\n- **NRB mask** delivers FiO2 of 60-90% depending on flow rate and mask seal — a marked improvement over nasal cannula\n- In shock states, oxygen delivery (DO2) = cardiac output × oxygen content (CaO2) — maximizing FiO2 improves the CaO2 component when cardiac output is compromised\n- SpO2 improvement to 98% is encouraging, but **SpO2 does not reflect tissue oxygen delivery** in the setting of low cardiac output and poor perfusion\n- Monitor closely for increasing work of breathing — if retractions, grunting, or apnea develop, transition immediately to **bag-mask ventilation**"
          },
          stethoscope: {
            label: "Reassess Heart and Lung Sounds",
            ok: true,
            priority: 3,
            fb: "Lung sounds remain clear and equal bilaterally without crackles, wheeze, or decreased air entry. Heart sounds reveal tachycardia at 194 bpm with regular rhythm; no murmur, rub, or gallop is detected. These findings confirm no fluid overload and exclude primary cardiac structural disease as a contributor to shock.\n\n- **No crackles**: safe to continue IV fluid resuscitation — no pulmonary edema accumulating from prior NS bolus\n- **No murmur or gallop**: reduces concern for congenital cardiac disease (e.g., AVSD, outflow obstruction) contributing to the shock state\n- **Regular rhythm at 194 bpm**: confirms sinus tachycardia — no SVT, ventricular tachycardia, or heart block requiring separate management\n- This reassessment confirms the diagnosis remains **distributive/septic shock** and supports continuing the sepsis resuscitation bundle"
          },
          defib: {
            label: "Defibrillate / Cardiovert",
            ok: false,
            fb: "The cardiac monitor confirms sinus tachycardia — not a shockable rhythm, and not a hemodynamically unstable arrhythmia requiring synchronized cardioversion. Delivering a defibrillation shock to an 8 kg infant in sinus tachycardia would cause direct myocardial injury with zero therapeutic benefit.\n\n- **Defibrillation** is indicated only for **ventricular fibrillation or pulseless ventricular tachycardia** — neither is present here\n- **Synchronized cardioversion** is indicated for hemodynamically unstable SVT or pulsed VT — not sinus tachycardia\n- Sinus tachycardia at 194 bpm is a **physiologic compensatory response** to fever, hypovolemia, and poor cardiac output — treating the underlying sepsis will resolve it\n- Please put the paddles down and give the baby some dextrose 🔌"
          },
          bvm: {
            label: "Begin Bag-Mask Ventilation",
            ok: false,
            fb: "Mateo is breathing spontaneously with adequate tidal volumes — no apnea, no agonal respirations, no significant retractions. Initiating bag-mask ventilation in a spontaneously breathing patient risks gastric inflation, aspiration, increased intrathoracic pressure, and respiratory dyssynchrony.\n\n- **BVM ventilation** is indicated when the patient is apneic, has agonal breathing, or has inadequate respiratory effort — none of which are present now\n- Tachypnea at 64/min is the **compensatory response** to metabolic acidosis — not an indication for assisted ventilation\n- **Stage the BVM at the bedside** as an immediate rescue device; this infant's respiratory status could deteriorate with worsening metabolic acidosis or exhaustion\n- Correct management now: **high-flow O2 via NRB mask** and close monitoring — intervene only if breathing quality deteriorates 🫁"
          },
          pupilCheck: {
            label: "Check Pupillary Response",
            ok: false,
            fb: "Pupillary assessment is an appropriate secondary neurological exam in an altered infant, but it is not a priority action when the patient is in decompensated septic shock with hypoglycemia, hypotension, and absent radial pulses. [Finding if performed: pupils 3 mm bilaterally, equal, and briskly reactive to light — no signs of herniation or opioid toxicity.]\n\n- **Equal, reactive pupils** exclude transtentorial herniation and rule out opioid or anticholinergic toxidrome\n- This is a reassuring secondary-survey finding — but the primary-survey emergency (hypoglycemia, hemodynamic collapse) must be addressed first\n- The brain cannot be meaningfully neurologically examined until **perfusion and glucose are restored** — altered consciousness from hypoglycemia looks identical to that from herniation\n- Delaying dextrose and antibiotics to perform a pupil check increases the risk of irreversible neurological injury 👁️"
          }
        },
        meds: {
          dextroseBolus: {
            label: "D10W 5 mL/kg IV — 40 mL (Dextrose for Hypoglycemia)",
            ok: true,
            priority: 1,
            fb: "D10W 40 mL administered IV push over 5 minutes. Bedside glucose rechecked at 15 minutes: 72 mg/dL — hypoglycemia corrected. Notably, the infant begins to show improved responsiveness within minutes of glucose delivery — eyes open more fully, and a weak but audible cry is noted for the first time since arrival.\n\n- **D10W** (dextrose 10% in water) provides 100 mg/mL; 5 mL/kg = 40 mL delivers 4 g (0.5 g/kg) — the standard correction dose for infants\n- **D10W is preferred** over D25W or D50W in infants — concentrated dextrose solutions risk hyperosmolar cerebral injury and peripheral vein damage in small vessels\n- The rapid improvement in responsiveness confirms that **hypoglycemia was a major driver** of the altered consciousness, not solely cerebral hypoperfusion\n- Recheck glucose in **15-30 minutes** to confirm sustained correction; start a **dextrose-containing maintenance fluid** (D5 ½NS) to prevent rebound hypoglycemia"
          },
          ceftriaxone: {
            label: "Ceftriaxone 400 mg IV (50 mg/kg) — Empiric Antibiotics",
            ok: true,
            priority: 2,
            fb: "Blood cultures drawn first through the existing IV. Ceftriaxone 400 mg (50 mg/kg for 8 kg) infused IV over 30 minutes. Antibiotic administration achieved within the target window of 60 minutes from sepsis recognition.\n\n- **Ceftriaxone** is a third-generation cephalosporin with excellent gram-negative coverage (E. coli, Klebsiella, Proteus) — the most common pathogens in urinary-source infant bacteremia\n- Gram-positive coverage is adequate for Streptococcus but limited against **MRSA** or **Listeria** — if either is suspected, add vancomycin or ampicillin respectively\n- **Blood cultures must precede the first antibiotic dose** to maximize culture yield — do not delay antibiotics if cultures cannot be obtained within 15-20 minutes\n- If meningitis is clinically suspected, dose should be increased to **100 mg/kg (800 mg)** to achieve therapeutic CSF penetration\n- Each hour of delay in antibiotic administration in pediatric septic shock is independently associated with increased organ dysfunction and mortality"
          },
          nsBolus: {
            label: "Normal Saline 10 mL/kg IV Bolus — 80 mL",
            ok: true,
            priority: 3,
            fb: "Normal saline 80 mL (10 mL/kg) administered as a rapid IV bolus over 5-10 minutes. This brings total crystalloid administered to 280 mL (35 mL/kg) including the prehospital bolus. Reassess perfusion markers — HR, cap refill, BP, mental status — immediately after completion.\n\n- **PALS recommends** 20 mL/kg isotonic crystalloid (NS or LR) IV pushes with reassessment between each bolus, up to **40-60 mL/kg total** before escalating to vasopressors\n- Total of **35 mL/kg** is within the safe resuscitation window; reassess before giving further volume\n- Monitor actively for signs of **fluid overload**: new crackles on auscultation, worsening respiratory effort, hepatomegaly — none currently present\n- If perfusion does not improve after 40-60 mL/kg total crystalloid, **epinephrine infusion** is the vasopressor of choice for cold septic shock\n- Reassess cap refill, BP, HR, and urine output after each bolus — septic shock resuscitation is iterative"
          },
          epiIV: {
            label: "Epinephrine Infusion 0.1 mcg/kg/min IV (Vasopressor)",
            ok: false,
            fb: "Epinephrine is the correct vasopressor choice for pediatric cold septic shock — but the PALS algorithm recommends maximizing fluid resuscitation to 40-60 mL/kg before initiating vasopressors in a patient without immediate cardiovascular collapse. This infant has received 35 mL/kg total; an additional fluid bolus and reassessment should precede vasopressor initiation.\n\n- **Epinephrine** (0.1-1 mcg/kg/min) is first-line for **cold septic shock** — its combined α1 (vasoconstriction, increased SVR) and β1 (inotropy, chronotropy) effects address the low-cardiac-output, high-SVR physiology\n- **Norepinephrine** is preferred for warm septic shock (vasodilated phenotype with bounding pulses) — the wrong choice here\n- Vasopressors are indicated when shock persists despite **40-60 mL/kg** total fluid — this infant is at 35 mL/kg; one more bolus and reassessment first\n- If initiated, epinephrine must be delivered via **IO or central access** — peripheral extravasation causes severe tissue necrosis 💉"
          },
          acetaminophen: {
            label: "Acetaminophen 120 mg PR (Antipyretic for Fever)",
            ok: false,
            fb: "Fever management is not the immediate priority in decompensated septic shock. Acetaminophen addresses the symptom of fever — it does not treat the underlying bacteremia, improve cardiac output, or restore perfusion.\n\n- **Antipyretics** reduce fever by inhibiting prostaglandin E2 synthesis at the hypothalamic thermostat — effective for symptom relief but not hemodynamic stabilization\n- The fever will resolve most effectively when the **infection is treated** with antibiotics and the bacterial source is controlled\n- Priorities in decompensated shock are: **glucose, antibiotics, oxygenation, fluid resuscitation** — antipyretics are deferred to after hemodynamic stabilization\n- Acetaminophen is safe and appropriate once the patient is stable — it should not be withheld permanently, only correctly deprioritized now 🌡️"
          },
          lorazepam: {
            label: "Lorazepam 0.4 mg IV (Benzodiazepine)",
            ok: false,
            fb: "There is no seizure activity in this infant. Administering lorazepam to a non-seizing patient in decompensated septic shock would cause significant respiratory depression and could precipitate apnea, requiring emergent bag-mask ventilation in an already critically compromised infant.\n\n- **Lorazepam** (0.1 mg/kg IV) acts on **GABA-A receptors** to enhance inhibitory neurotransmission — indicated only for confirmed active seizure activity\n- The altered consciousness in this infant is caused by **hypoglycemia, metabolic acidosis, and cerebral hypoperfusion** — all reversible without benzodiazepines, and all worsened by respiratory depression\n- Administering a CNS and respiratory depressant to a patient with compromised airway protective reflexes and borderline respiratory drive increases the risk of **aspiration and apnea**\n- No seizure = no lorazepam. Correct the glucose and the perfusion — that is the treatment for this altered mental status 💤"
          }
        }
      }
    }
  ],
  curveball: null,
  reassessment: {
    narrative: "Following dextrose administration, ceftriaxone infusion, high-flow oxygen via non-rebreather mask, and an additional 10 mL/kg normal saline bolus, Mateo shows early but clear signs of clinical improvement. Heart rate has decreased from 194 to 162 bpm and blood pressure has recovered to 78/54 mmHg — a wider pulse pressure reflecting improved stroke volume. Most strikingly, the infant now opens his eyes spontaneously to voice, briefly tracks faces, and produces a weak but audible cry — a dramatic improvement from AVPU-P on arrival, confirming that hypoglycemia was a primary driver of his altered consciousness. Capillary refill has shortened from 5 seconds to 3 seconds, and skin mottling has retreated from the trunk back to the distal extremities. Brachial pulses are now moderate in quality, and faint radial pulses have returned bilaterally.",
    vitals: {
      hr: 162,
      rr: 48,
      sbp: 78,
      dbp: 54,
      spo2: 98,
      temp: 38.9,
      cap: 3
    },
    signs: [
      {
        label: "Mental Status",
        finding: "Eyes open spontaneously to voice; tracks faces briefly; produces weak cry; AVPU: V (responds to Voice)",
        pos: "head",
        sys: "neurological"
      },
      {
        label: "Skin and Perfusion",
        finding: "Mottling retreated to distal extremities below wrists and ankles; trunk now pink and less mottled; extremities beginning to warm",
        pos: "body",
        sys: "cardiovascular"
      },
      {
        label: "Peripheral Pulses",
        finding: "Brachial pulses moderate quality bilaterally; faint but palpable radial pulses returned bilaterally",
        pos: "body",
        sys: "cardiovascular"
      },
      {
        label: "Breath Sounds",
        finding: "Clear and equal bilaterally; no new crackles; respiratory rate improving; no increased work of breathing",
        pos: "body",
        sys: "respiratory"
      }
    ]
  },
  stabilizationSummary: "Dextrose (D10W 5 mL/kg) corrected critical hypoglycemia — directly reversing the cortical depression driving AVPU-P responsiveness and global hypotonia, producing the rapid improvement in alertness that no amount of fluid alone would have achieved. Ceftriaxone 400 mg IV initiated time-sensitive empiric gram-negative coverage targeting the most likely urinary-source bacteremia, addressing the infectious driver of the entire shock cascade. An additional 10 mL/kg normal saline bolus combined with non-rebreather oxygen delivery expanded intravascular volume, improved cardiac preload, and maximized oxygen content — reflected in the recovery of blood pressure to 78/54 mmHg, retreat of mottling, and return of radial pulses.",
  debrief: {
    summary: "Mateo presented in decompensated septic shock — the lethal convergence of hypotension, critical hypoglycemia, severe metabolic acidosis, and impaired consciousness in a previously healthy 6-month-old. The most dangerous element was the one most likely to be overlooked: glucose of 34 mg/dL, independently driving irreversible neurological injury while the team focused on hemodynamics. The case reinforced three parallel priorities — immediate glucose correction, time-sensitive empiric antibiotics, and continuation of volume resuscitation beyond the prehospital bolus — and demonstrated the cold shock phenotype characterized by mottling, absent peripheral pulses, and narrow pulse pressure that guides vasopressor selection if fluids fail.",
    explainers: [
      {
        title: "Infant Septic Shock: Recognition and Phenotype",
        content: "Septic shock in infants under 12 months carries disproportionate mortality risk because physiologic reserve is limited and early warning signs are easily mistaken for benign viral illness.\n\n- **Age-adjusted SIRS criteria**: HR >180 bpm defines tachycardia in infants; paradoxically, **bradycardia (<100 bpm)** is a late and equally dangerous finding indicating cardiovascular collapse\n- **Cold septic shock** (high SVR, low cardiac output): mottling, cold extremities, absent peripheral pulses, narrow pulse pressure — the predominant pediatric phenotype and what this case demonstrates\n- **Warm septic shock** (low SVR, distributive): bounding pulses, flushed warm skin, wide pulse pressure, flash capillary refill — less common in infants, more common in adolescents and adults\n- **Vasopressor selection** is guided by phenotype: **epinephrine** for cold shock (α + β effects); **norepinephrine** for warm shock (predominantly α effects)\n- **Common sources** in this age group: UTI/urosepsis (most common, especially uncircumcised male infants), occult bacteremia, meningitis, and pneumonia\n- **LP timing**: lumbar puncture is deferred until hemodynamic stability is achieved — never risk respiratory or cardiovascular decompensation for a diagnostic procedure in a decompensating infant",
        tldr: "Cold shock = mottling, absent radial pulses, narrow pulse pressure. Recognize the phenotype — it determines your vasopressor."
      },
      {
        title: "Hypoglycemia in Septic Infants: The Overlooked Emergency",
        content: "Hypoglycemia in septic shock is an independent cause of irreversible neurological injury that must be treated with the same urgency as the hemodynamic emergency — it will not resolve with fluids alone.\n\n- **Limited glycogen stores**: a 6-month-old's hepatic glycogen reserves support only a few hours of fasting before hypoglycemia develops — far less than an adult or older child\n- **Sepsis consumes glucose**: activated neutrophils and macrophages rely heavily on anaerobic glycolysis for their high energy demands, depleting circulating glucose at an accelerated rate\n- **Gluconeogenesis is impaired**: cytokines (TNF-α, IL-1β) directly inhibit hepatic gluconeogenic enzymes, removing the backup glucose production mechanism\n- **Neuronal injury threshold**: cortical dysfunction begins rapidly at glucose below **40 mg/dL**; irreversible injury follows if hypoglycemia is prolonged\n- **Treatment**: D10W 5 mL/kg IV (0.5 g/kg) is the correct concentration for infants — avoid D25W or D50W due to hyperosmolar risk to immature vessels and brain\n- **Follow-up**: recheck glucose in 15-30 minutes; start **dextrose-containing maintenance fluids** to prevent rebound hypoglycemia",
        tldr: "Every critically ill infant needs a glucose check. Hypoglycemia in sepsis is a neurological emergency as urgent as the hemodynamics — and fluids alone will not fix it."
      },
      {
        title: "PALS Septic Shock Bundle: Sequence and Escalation",
        content: "Pediatric septic shock management follows a time-sensitive resuscitation bundle where components run in parallel — not as a sequential checklist — and each step has a defined escalation trigger.\n\n- **Blood cultures first**: draw before antibiotics to maximize yield; do not delay antibiotics more than 15-20 minutes waiting for cultures\n- **Antibiotics within 60 minutes**: each hour of delay in antibiotic administration in pediatric septic shock is independently associated with increased organ dysfunction and mortality\n- **Fluid resuscitation**: 20 mL/kg isotonic crystalloid (NS or LR) IV push, repeated with reassessment after each bolus up to **40-60 mL/kg total** before initiating vasopressors\n- **Vasopressor escalation**: persistent shock after 40-60 mL/kg → initiate **epinephrine** (cold shock) or **norepinephrine** (warm shock) via IO or central access\n- **Metabolic corrections**: treat hypoglycemia, hypocalcemia, and significant electrolyte disturbances as part of the initial resuscitation — not as afterthoughts\n- **Reassess frequently**: cap refill, HR, BP, mental status, and urine output after each intervention — septic shock resuscitation is iterative, not a one-time event",
        tldr: "Culture → Fluids → Antibiotics → Metabolic corrections → Reassess → Vasopressors if fluids fail. Run in parallel, not sequence."
      }
    ]
  }
};

export var SC5 = {
  id: "rsv-bronchiolitis-hfnc-failure",
  source: "builtin",
  title: "Mira's Breathing Emergency",
  tier: 2,
  icon: "🫁",
  tagline: "HFNC is maxed — and she's still not breathing.",
  description: "An 8-month-old presents with worsening RSV bronchiolitis. She arrived on high-flow nasal cannula but continues to deteriorate with retractions, grunting, and dropping saturations. The team must recognize impending respiratory failure and escalate support before she fatigues.",
  visuals: [
    "Infant in a hospital crib, nasal cannula tubing in place, chest visibly heaving with each breath",
    "Cardiac monitor showing tachycardia and SpO2 waveform trending downward",
    "Suction bulb and nasal saline on the bedside table"
  ],
  patient: {
    ageLabel: "8-month-old",
    weightKg: 8,
    sex: "Female",
    cc: "Worsening breathing difficulty on HFNC",
    history: "Mira Okonkwo is an 8-month-old previously healthy female born full-term with no significant medical history. She presented to the ED 18 hours ago with 3 days of rhinorrhea, cough, and progressive respiratory distress. RSV antigen test was positive. She was placed on high-flow nasal cannula (HFNC) at 8 L/min (1 L/kg/min) at 40% FiO2 and admitted to the pediatric ward. Over the past 2 hours her work of breathing has significantly increased despite maximum HFNC settings of 16 L/min (2 L/kg/min) at 60% FiO2. She is on continuous cardiorespiratory monitoring. She has had no oral intake for 10 hours and is currently NPO with an IV in place in her right hand (24-gauge). She has received no bronchodilators or steroids."
  },
  emsReport: "Mira is an 8-month-old female transferred from the pediatric ward to the PICU on high-flow nasal cannula at maximum settings of 16 L/min at 60% FiO2. RSV-positive bronchiolitis diagnosed on admission 18 hours ago. Peripheral IV access established in right hand. No medications given during transport.",
  learnMore: "Severe RSV bronchiolitis causes small-airway obstruction via bronchial inflammation, mucus plugging, and smooth-muscle constriction, leading to increased airway resistance, air trapping, and dynamic hyperinflation. HFNC provides modest positive distending pressure and reduces the inspiratory resistance imposed by nasal airways, but does not generate sufficient continuous positive airway pressure to reliably stent open obstructed airways. When HFNC fails — defined as persistent or worsening tachypnea, rising PCO2, or increasing FiO2 requirement — escalation to CPAP or BiPAP is the evidence-supported next step before invasive mechanical ventilation.",
  norms: {
    hr: [
      80,
      160
    ],
    rr: [
      25,
      50
    ],
    sbp: [
      70,
      100
    ],
    dbp: [
      40,
      65
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "Mira is brought to the PICU bed on HFNC at maximum settings. She is awake but visibly exhausted, unable to maintain her normal level of alertness. Her chest heaves with every breath — subcostal and intercostal retractions are prominent. Audible grunting can be heard without a stethoscope at the bedside. Her nasal cannula prongs are in place and the circuit is intact. A 24-gauge peripheral IV is confirmed patent in the right dorsal hand. Continuous SpO2 and cardiac monitoring are active. Breath sounds are present bilaterally on auscultation with diffuse expiratory wheeze and transmitted upper-airway noise; there is no focal consolidation and no pneumothorax sign. Trachea is midline. Abdomen is soft and non-distended with normal bowel sounds.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "188",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Sinus tachycardia at 188 bpm markedly exceeds the normal 8-month-old range of 80–160 bpm.\n\n- **Tachycardia** in this setting reflects combined physiologic stressors: hypoxemia, hypercarbia, fever, and elevated sympathetic tone from increased work of breathing\n- In the HFNC failure literature, **failure to improve tachycardia** after initiating HFNC is one of the strongest predictors of subsequent intubation\n- A **rate of 188 bpm** sustained under maximum support indicates the infant's cardiovascular system is compensating maximally\n- **Persistent or worsening tachycardia** on HFNC is a direct trigger criterion for escalating to CPAP or BiPAP"
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "72",
          unit: "/min",
          bad: true,
          _slotRef: "phase[0].vitals.rr.why",
          why: "A respiratory rate of 72 breaths/min is severely elevated above the normal 8-month-old range of 25–50 breaths/min.\n\n- **Tachypnea** at this extreme reduces expiratory time so that each breath ends before full exhalation — this generates **dynamic hyperinflation and auto-PEEP**\n- The infant must then overcome this intrinsic PEEP on every subsequent inspiration, dramatically increasing the work of breathing\n- A **RR >60 breaths/min** in an infant on maximum HFNC is a direct criterion for evaluation of respiratory support escalation\n- **Worsening tachypnea** despite HFNC indicates the flow is not adequately offsetting airway resistance or inspiratory load"
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "82",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "BP 82/52 mmHg falls within the acceptable range for an 8-month-old infant (normal SBP 70–100 mmHg, DBP 40–65 mmHg).\n\n- The **minimum acceptable SBP** for an 8-month-old can be estimated as 70 + (2 × age in years) ≈ 71 mmHg; 82 mmHg exceeds this threshold\n- While this value sits in the lower half of the normal range, it is **not hypotensive** and does not indicate cardiovascular decompensation at this point\n- In the context of severe RSV bronchiolitis, the primary concern is **respiratory failure**, not hemodynamic shock\n- This vital sign should **not be flagged** — clinical energy should be directed at the respiratory compromise"
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "52",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "88",
          unit: "%",
          bad: true,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "SpO2 of 88% is critically low and represents significant hypoxemia despite HFNC at 60% FiO2.\n\n- Normal SpO2 in infants is **95–100%**; values below **90%** define hypoxemic respiratory failure\n- An SpO2 of 88% on **60% FiO2 via HFNC** demonstrates refractory hypoxemia — the HFNC is no longer able to maintain adequate oxygenation\n- The **V/Q mismatch** caused by mucus plugging, air trapping, and atelectasis is too severe for open-interface, flow-based oxygen delivery to overcome\n- This is a primary criterion for **HFNC failure** and mandates immediate escalation to a pressure-generating modality (CPAP/BiPAP or intubation)"
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "38.6",
          unit: "C",
          bad: true,
          _slotRef: "phase[0].vitals.temp.why",
          why: "A temperature of 38.6°C represents a low-grade fever exceeding the normal upper limit of 37.5°C.\n\n- **Fever** in RSV bronchiolitis reflects the innate immune response to viral replication in respiratory epithelium — it is an expected but flagworthy finding\n- Fever increases **metabolic oxygen demand** and CO2 production, worsening the respiratory burden in an already-compromised infant\n- Temperature elevation also contributes to **tachycardia** and should be considered as a modifiable driver of physiologic stress\n- **Acetaminophen** is appropriate to reduce fever-related metabolic demand; antipyretics do not treat the underlying bronchiolitis but reduce physiologic stress"
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "3",
          unit: "sec",
          bad: true,
          _slotRef: "phase[0].vitals.cap.why",
          why: "A central capillary refill time of 3 seconds exceeds the normal threshold of less than 2 seconds.\n\n- **Capillary refill >2 seconds** centrally indicates reduced cutaneous perfusion, driven by sympathetic vasoconstriction from hypoxemia and physiologic stress\n- In the context of severe respiratory failure, prolonged cap refill reflects the **cardiovascular cost of sustained high work of breathing** and impending circulatory compromise\n- Combined with pallor and mottling on exam, this finding suggests the infant is on the verge of **decompensated cardiorespiratory failure**\n- Restoration of normal cap refill is an important endpoint of successful respiratory support escalation and hemodynamic stabilization"
        }
      },
      signs: [
        {
          id: "retractions",
          label: "Retractions",
          finding: "Moderate subcostal and intercostal retractions present bilaterally with each breath; suprasternal notch tug visible",
          pos: "body",
          sys: "respiratory",
          bad: true,
          why: "Retractions reflect markedly increased work of breathing against elevated airway resistance.\n\n- **Subcostal** and **intercostal** retractions occur when the diaphragm and accessory muscles generate large negative intrathoracic pressures to force air through obstructed small airways\n- **Suprasternal tug** indicates upper-airway involvement and severe respiratory effort\n- In RSV bronchiolitis, **bronchial and peribronchial inflammation**, mucus plugging, and smooth-muscle constriction drive airway resistance to multiple times normal\n- Persistent retractions on **maximum HFNC** signal that the current support level is insufficient to offset the imposed work of breathing",
          _slotRef: "phase[0].signs.retractions.why"
        },
        {
          id: "grunting",
          label: "Grunting",
          finding: "Audible expiratory grunt with each breath, heard without stethoscope at the bedside",
          pos: "face",
          sys: "respiratory",
          bad: true,
          why: "Grunting is a physiologic auto-PEEP maneuver in infants with severe respiratory distress.\n\n- The infant partially closes the **glottis** during expiration to generate back-pressure, functionally mimicking external PEEP\n- This prevents **end-expiratory alveolar collapse** in the setting of diffuse small-airway obstruction and air trapping\n- Audible grunting without a stethoscope indicates the degree of glottic braking is maximal — a sign of **impending respiratory failure**\n- It is a critical clinical indicator that the infant's intrinsic compensatory mechanisms are near their limit",
          _slotRef: "phase[0].signs.grunting.why"
        },
        {
          id: "skin-perfusion",
          label: "Skin & Perfusion",
          finding: "Skin pale and mildly mottled over the trunk; capillary refill 3 seconds centrally; mucous membranes moist",
          pos: "body",
          sys: "cardiovascular",
          bad: true,
          why: "Pallor and delayed capillary refill reflect impaired peripheral perfusion from sympathetic-mediated vasoconstriction in the setting of hypoxemia and physiologic stress.\n\n- **Hypoxemia** triggers sympathetic discharge, causing peripheral vasoconstriction to preferentially redirect cardiac output to vital organs\n- **Capillary refill >2 seconds** centrally indicates reduced cutaneous perfusion and is a flagworthy sign of circulatory compromise\n- **Moist mucous membranes** are reassuring that the child is not severely dehydrated, but do not negate the peripheral perfusion concern\n- Mottling in an infant is an ominous sign reflecting vasomotor instability — it should prompt urgent reassessment of cardiac output",
          _slotRef: "phase[0].signs.skin-perfusion.why"
        },
        {
          id: "mental-status",
          label: "Mental Status",
          finding: "Eyes open, but decreased baseline alertness; does not track faces or reach for objects; responds only to painful stimuli with weak cry",
          pos: "head",
          sys: "neurological",
          bad: true,
          why: "Decreased alertness in an infant with respiratory distress is a critical HFNC failure sign.\n\n- **Cerebral hypoxia** from hypoxemia (SpO2 88%) impairs cortical activity, manifesting as loss of age-appropriate engagement and weak cry\n- Failure to track faces or reach for objects is developmentally abnormal for an 8-month-old and indicates **altered sensorium**\n- In the context of escalating respiratory failure, **decreased responsiveness** signals that the infant cannot sustain the work of breathing and cardiorespiratory collapse may be imminent\n- This finding alone is an indication for **immediate respiratory support escalation** regardless of other parameters",
          _slotRef: "phase[0].signs.mental-status.why"
        },
        {
          id: "lung-sounds",
          label: "Lung Sounds",
          finding: "Diffuse expiratory wheeze bilaterally; transmitted upper-airway noise; breath sounds equal bilaterally; no focal crackles; trachea midline",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "Diffuse bilateral wheeze and equal breath sounds are consistent with RSV bronchiolitis, not a unilateral process.\n\n- **Diffuse expiratory wheeze** reflects widespread small-airway narrowing due to RSV-mediated inflammation and mucus plugging — this is the expected auscultatory finding in bronchiolitis\n- **Equal breath sounds bilaterally** with **midline trachea** rule out pneumothorax, pleural effusion, or right mainstem intubation — these are the reassuring elements of this compound finding\n- The absence of **focal crackles or consolidation** makes secondary bacterial pneumonia less likely at this time\n- The transmitted upper-airway noise reflects nasal secretions passing through the HFNC circuit and does not represent a new pulmonary finding",
          _slotRef: "phase[0].signs.lung-sounds.why"
        },
        {
          id: "abdominal-exam",
          label: "Abdominal Exam",
          finding: "Abdomen soft, non-distended, non-tender with normal bowel sounds; no hepatosplenomegaly",
          pos: "body",
          sys: "gastrointestinal",
          bad: false,
          why: "A soft, non-distended abdomen is a reassuring finding that rules out air-swallowing gastric distension as a complication of HFNC.\n\n- Infants on **HFNC** can develop gastric distension from swallowed high-flow air, which can splint the diaphragm and worsen respiratory mechanics\n- A **soft, non-distended abdomen** confirms this has not occurred and that abdominal compartment physiology is not contributing to respiratory compromise\n- The absence of **hepatomegaly** makes congestive heart failure from structural heart disease less likely as the primary etiology\n- This is a genuinely reassuring finding that should NOT be flagged as a concern in this scenario",
          _slotRef: "phase[0].signs.abdominal-exam.why"
        }
      ],
      labs: [
        {
          id: "ph",
          name: "pH",
          value: "7.22",
          unit: "",
          ref: "7.35–7.45",
          critical: true,
          bad: true,
          why: "pH 7.22 represents significant acidemia from combined respiratory and metabolic acidosis.\n\n- **Respiratory component**: CO2 retention from alveolar hypoventilation drives pH down\n- **Metabolic component**: tissue hypoxia generates lactic acid, consuming bicarbonate buffer\n- pH <7.25 in an infant on maximum HFNC is a **direct escalation criterion**\n- Internal consistency: pH 7.22 is consistent with pCO2 68 and HCO3 17 by **Henderson-Hasselbalch**",
          _slotRef: "phase[0].labs.ph.why"
        },
        {
          id: "pco2",
          name: "pCO2",
          value: "68",
          unit: "mmHg",
          ref: "41–51 mmHg",
          critical: true,
          bad: true,
          why: "pCO2 68 mmHg confirms ventilatory failure with CO2 retention despite tachypnea.\n\n- **Dynamic hyperinflation** from rapid breathing shortens expiration, trapping gas and increasing dead-space fraction\n- Net **alveolar minute ventilation** falls despite elevated respiratory rate — the shallow, rapid breaths are not efficiently clearing CO2\n- **Rising pCO2** on maximum HFNC is the strongest single predictor of HFNC failure\n- Escalation to CPAP/BiPAP or intubation is required to restore adequate alveolar ventilation",
          _slotRef: "phase[0].labs.pco2.why"
        },
        {
          id: "hco3",
          name: "HCO3",
          value: "17",
          unit: "mEq/L",
          ref: "22–26 mEq/L",
          critical: true,
          bad: true,
          why: "Bicarbonate of 17 mEq/L indicates concurrent metabolic acidosis, not compensatory.\n\n- Normal metabolic **compensation** for a primary respiratory acidosis would produce an elevated bicarbonate — here bicarbonate is LOW, confirming a **second independent acidosis**\n- Metabolic acidosis arises from **lactic acid** generated by anaerobic metabolism in hypoxic tissues (lactate 3.8 mmol/L)\n- HCO3 17 is consistent with pH 7.22 and pCO2 68 — the lab values are internally coherent\n- Bicarbonate will not normalize until both **CO2 retention** and **tissue hypoxia** are corrected",
          _slotRef: "phase[0].labs.hco3.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "3.8",
          unit: "mmol/L",
          ref: "0.5–2.0 mmol/L",
          critical: true,
          bad: true,
          why: "Lactate 3.8 mmol/L confirms tissue oxygen debt and anaerobic metabolism.\n\n- **Lactate >2.0 mmol/L** indicates cells have shifted to anaerobic glycolysis because oxygen delivery is insufficient\n- The primary driver here is **hypoxemia** (SpO2 88%) combined with possible low cardiac output from the physiologic stress of severe respiratory distress\n- Elevated lactate explains **bicarbonate consumption** (HCO3 17): lactic acid is being buffered by the bicarbonate system\n- A **falling lactate** during treatment is a key marker that oxygen delivery is being restored",
          _slotRef: "phase[0].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "88",
          unit: "mg/dL",
          ref: "70–110 mg/dL",
          critical: false,
          bad: false,
          why: "A blood glucose of 88 mg/dL is within the normal range for an infant.\n\n- Normal glucose in infants is **70–110 mg/dL**; 88 mg/dL is reassuringly normal\n- Hypoglycemia is a risk in acutely ill infants who have had decreased oral intake, but is not present here\n- This finding does **not require intervention** and should not distract from the primary respiratory emergency\n- Continued monitoring is prudent given NPO status, but this is not an actionable concern at the present time",
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "wbc",
          name: "WBC",
          value: "11.8",
          unit: "K/µL",
          ref: "6–15 K/µL",
          critical: false,
          bad: false,
          why: "A WBC of 11.8 K/µL is within normal limits and does not suggest bacterial superinfection.\n\n- Normal WBC in an 8-month-old is **6–15 K/µL**; 11.8 is well within range\n- RSV bronchiolitis is a **viral illness** — leukocytosis with a left shift would raise concern for bacterial superinfection, but this count is reassuringly normal\n- UCSF and AAP guidelines note that **routine CBC is not indicated** for uncomplicated bronchiolitis; when obtained, a normal WBC supports viral-only etiology\n- This value should **not be flagged** — it is a reassuring distractor for learners who might over-interpret any lab in a sick infant",
          _slotRef: "phase[0].labs.wbc.why"
        },
        {
          id: "rsv-antigen",
          name: "RSV Antigen",
          value: "Positive",
          unit: "",
          ref: "Negative",
          critical: true,
          bad: true,
          why: "Positive RSV antigen confirms the viral etiology and directs supportive management.\n\n- **RSV** is responsible for 60–80% of bronchiolitis cases in infants under 12 months\n- A positive antigen confirms **viral bronchiolitis** as the diagnosis, making antibiotics unnecessary\n- RSV causes **bronchiolar epithelial necrosis**, triggering inflammation, mucus plugging, and smooth-muscle bronchoconstriction\n- Treatment is entirely **supportive**: airway clearance, respiratory support escalation, hydration — no specific antiviral therapy available for routine use",
          _slotRef: "phase[0].labs.rsv-antigen.why"
        },
        {
          id: "hemoglobin",
          name: "Hemoglobin",
          value: "10.8",
          unit: "g/dL",
          ref: "9.5–13.5 g/dL",
          critical: false,
          bad: false,
          why: "A hemoglobin of 10.8 g/dL is within the normal range for an 8-month-old.\n\n- Infants 6–12 months old have a **physiologic nadir of hemoglobin** around 9.5–12 g/dL; 10.8 g/dL is within acceptable range\n- While lower hemoglobin reduces oxygen-carrying capacity, a value of **10.8 g/dL** does not independently require transfusion\n- The primary oxygen-delivery problem in this patient is **ventilatory failure and hypoxemia**, not anemia — correcting the respiratory failure will restore oxygen delivery more effectively than transfusion\n- This finding is **not actionable** and should not distract from the respiratory emergency",
          _slotRef: "phase[0].labs.hemoglobin.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Despite being on HFNC at maximum settings (16 L/min, 60% FiO2), Mira continues to deteriorate. She is exhausted, grunting with every breath, and her SpO2 has fallen to 88%. Venous blood gas shows pH 7.22, pCO2 68 mmHg, and HCO3 17 mEq/L — she is in combined respiratory and metabolic acidosis. Her tachycardia of 188 bpm and RR of 72 breaths/min have not responded to HFNC. She is moving toward respiratory arrest. The PICU attending has been notified. The pediatric anesthesia team is en route for airway backup. The bedside nurse has confirmed patent IV access in the right dorsal hand. The patient is currently on continuous cardiorespiratory monitoring with waveform capnography available. A bulb syringe and nasal saline are at the bedside. Your escalation decisions must be made now.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "188",
          unit: "bpm",
          bad: false,
          _slotRef: "phase[1].vitals.hr.why",
          why: null
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "72",
          unit: "/min",
          bad: false,
          _slotRef: "phase[1].vitals.rr.why",
          why: null
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "82",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.sbp.why",
          why: null
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "52",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "88",
          unit: "%",
          bad: false,
          _slotRef: "phase[1].vitals.spo2.why",
          why: null
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "38.6",
          unit: "C",
          bad: false,
          _slotRef: "phase[1].vitals.temp.why",
          why: null
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "3",
          unit: "sec",
          bad: false,
          _slotRef: "phase[1].vitals.cap.why",
          why: null
        }
      },
      signs: [
        {
          id: "respiratory-effort",
          label: "Respiratory Effort",
          finding: "Increasing subcostal, intercostal, and suprasternal retractions; paradoxical abdominal breathing (seesaw pattern) developing; grunting with every breath",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "The seesaw pattern indicates diaphragmatic-thoracic dyscoordination from near-exhaustion of respiratory muscles.\n\n- **Paradoxical breathing** (chest moves in while abdomen moves out during inspiration) occurs when accessory muscles are overwhelmed and thoracic chest wall is being pulled inward by severe negative intrathoracic pressure\n- This pattern signals **imminent respiratory muscle fatigue** — the infant can no longer sustain coordinated respiratory effort\n- Seesaw breathing is a **pre-arrest pattern** in infants and should be treated with the same urgency as apnea\n- Immediate **non-invasive or invasive ventilatory support** is required to rest the respiratory muscles",
          _slotRef: "phase[1].signs.respiratory-effort.why"
        },
        {
          id: "nasal-secretions",
          label: "Nasal Secretions",
          finding: "Thick, copious clear nasal secretions visible around HFNC prongs; audible snoring quality to inspiratory breath sounds",
          pos: "face",
          sys: "respiratory",
          bad: false,
          why: "Nasal secretions in infants are a primary cause of increased upper-airway resistance and HFNC failure.\n\n- Infants are **obligate nasal breathers** — nasal secretion obstruction dramatically increases inspiratory resistance\n- Thick secretions impair HFNC efficacy by **occluding prong-to-airway interface**, reducing delivered flow and FiO2 at the level of the nasopharynx\n- **Gentle nasopharyngeal suction** prior to CPAP or intubation reduces airway resistance and can produce brief but meaningful improvement in SpO2 and work of breathing\n- Suction should be performed **before mask or CPAP application** to prevent pushing secretions deeper into the airway",
          _slotRef: "phase[1].signs.nasal-secretions.why"
        },
        {
          id: "neurological-state",
          label: "Neurological State",
          finding: "Eyes half-open, no eye contact or response to voice; responds to sternal rub with weak grimace only; tone decreased",
          pos: "head",
          sys: "neurological",
          bad: false,
          why: "Deteriorating neurological state indicates progressive cerebral hypoxia and hypercapnia.\n\n- **Hypercapnia** (pCO2 68 mmHg) causes cerebral vasodilation and CO2 narcosis, further depressing the level of consciousness\n- **Hypoxemia** (SpO2 88%) impairs neuronal ATP production, reducing cortical activity\n- Decreased tone in infants is a late pre-arrest sign reflecting global **CNS depression** from combined respiratory and metabolic acidosis\n- At this stage the infant **cannot protect her airway** and loss of airway reflexes followed by apnea is imminent",
          _slotRef: "phase[1].signs.neurological-state.why"
        },
        {
          id: "chest-wall-motion",
          label: "Chest Wall Motion",
          finding: "Visually reduced bilateral chest rise with each breath compared to admission; hyperinflated anteroposterior chest diameter noted",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "Reduced chest rise despite maximal effort indicates worsening gas trapping and dynamic hyperinflation.\n\n- **Dynamic hyperinflation** from incomplete exhalation causes progressive air trapping, increasing functional residual capacity beyond normal\n- The lungs are already **near total lung capacity** at end-expiration, leaving less room for tidal volume on each inspiration despite extreme respiratory effort\n- **Hyperinflated AP diameter** (barrel chest) is a visual correlate of air trapping — ribs and sternum are pushed outward by chronically elevated intrathoracic volume\n- Reduced chest excursion despite massive effort predicts that **tidal volume is critically low**, driving the hypercapnia and V/Q mismatch",
          _slotRef: "phase[1].signs.chest-wall-motion.why"
        },
        {
          id: "heart-sounds",
          label: "Heart Sounds",
          finding: "Tachycardic at 188 bpm; regular rhythm; no murmur; no gallop",
          pos: "body",
          sys: "cardiovascular",
          bad: false,
          why: "Tachycardia is the clinically significant element; rhythm and absence of murmur are reassuring.\n\n- **Heart rate 188 bpm** remains above normal range (80–160 bpm) for this age, driven by hypoxemia, sympathetic activation, and fever\n- **Regular rhythm** without murmur or gallop rules out arrhythmia and structural heart disease as contributors\n- The absence of a **new murmur** is important — severe pulmonary hypertension from hypoxemia could cause a tricuspid regurgitation murmur; its absence is reassuring\n- The tachycardia alone is flagworthy; the absence of rhythm abnormality narrows the differential and guides management toward **respiratory cause**",
          _slotRef: "phase[1].signs.heart-sounds.why"
        },
        {
          id: "iv-access",
          label: "IV Access",
          finding: "24-gauge peripheral IV in right dorsal hand; flushes without resistance; no swelling or infiltration at site",
          pos: "body",
          sys: "vascular",
          bad: false,
          why: "Patent IV access is critically important for medication delivery during respiratory escalation.\n\n- A **24-gauge IV** is the smallest acceptable gauge for emergent medication administration in an infant; it is adequate for bolus medications but has high resistance for rapid fluid administration\n- A **patent, non-infiltrated IV** confirms that emergency medications (sedatives, paralytics, vasopressors if needed) can be administered without delay\n- **Confirmation of IV patency** before escalation prevents the worst-case scenario: attempting intubation induction without working access\n- If IV access were lost, **IO placement** (tibial intraosseous) should be established immediately; the ivKit tool covers this contingency",
          _slotRef: "phase[1].signs.iv-access.why"
        }
      ],
      labs: [
        {
          id: "ph",
          name: "pH",
          value: "7.22",
          unit: "",
          ref: "7.35–7.45",
          critical: true,
          bad: false,
          why: "pH 7.22 confirms ongoing combined acidosis requiring immediate respiratory support escalation.",
          _slotRef: "phase[1].labs.ph.why"
        },
        {
          id: "pco2",
          name: "pCO2",
          value: "68",
          unit: "mmHg",
          ref: "41–51 mmHg",
          critical: true,
          bad: false,
          why: "pCO2 68 mmHg demonstrates ventilatory failure — CO2 retention is worsening on maximum HFNC.",
          _slotRef: "phase[1].labs.pco2.why"
        },
        {
          id: "hco3",
          name: "HCO3",
          value: "17",
          unit: "mEq/L",
          ref: "22–26 mEq/L",
          critical: true,
          bad: false,
          why: "Bicarbonate 17 mEq/L confirms concurrent metabolic acidosis from tissue hypoxia.",
          _slotRef: "phase[1].labs.hco3.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "3.8",
          unit: "mmol/L",
          ref: "0.5–2.0 mmol/L",
          critical: true,
          bad: false,
          why: "Lactate 3.8 mmol/L confirms tissue oxygen debt; trending this value guides resuscitation adequacy.",
          _slotRef: "phase[1].labs.lactate.why"
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "88",
          unit: "mg/dL",
          ref: "70–110 mg/dL",
          critical: false,
          bad: false,
          _slotRef: "phase[1].labs.glucose.why"
        }
      ],
      tools: [
        "suction",
        "bvm",
        "bvmReady",
        "ivKit",
        "defib",
        "stethoscope"
      ],
      meds: [
        "racemicEpi",
        "albuterol",
        "acetaminophen",
        "dextroseBolus",
        "epiIV",
        "nsBolus"
      ],
      actions: {
        tools: {
          suction: {
            label: "Perform Nasopharyngeal Suction",
            ok: true,
            priority: 1,
            fb: "You gently suction Mira's nares with a bulb syringe, clearing thick mucopurulent secretions. Her SpO2 briefly improves to 91% and the snoring quality to her breath sounds resolves. Secretion clearance reduces upper-airway resistance and temporarily improves HFNC efficacy, but her work of breathing and blood gas remain critical — this buys a minute, not a solution."
          },
          bvmReady: {
            label: "Bring Bag-Mask to Bedside",
            ok: true,
            priority: 2,
            fb: "Correct preparatory action. A properly sized BVM (size 1 infant mask) is staged at the bedside and connected to wall oxygen at 10 L/min. If CPAP fails or the patient apneas, the team can immediately transition to positive-pressure ventilation. Preparation before deterioration prevents the deadly 30-second scramble for equipment during a code."
          },
          ivKit: {
            label: "Confirm IV/IO Access",
            ok: true,
            priority: 3,
            fb: "You confirm the 24-gauge peripheral IV in the right dorsal hand is patent and flushes freely. Wristband is confirmed. Access is adequate for emergency medications. If IV access were lost, tibial intraosseous placement would be immediately required before any procedural sedation or intubation could proceed safely."
          },
          stethoscope: {
            label: "Auscultate Lung Fields",
            ok: true,
            priority: 4,
            fb: "Repeat auscultation confirms diffuse bilateral expiratory wheeze with globally reduced air entry. Breath sounds remain equal bilaterally — no new unilateral silence, no tension pneumothorax pattern. The trachea is midline. This assessment confirms the clinical picture is consistent with progressive RSV bronchiolitis without a mechanical airway complication requiring needle decompression."
          },
          bvm: {
            label: "Begin Bag-Mask Ventilation",
            ok: false,
            fb: "Not the right first move. Mira still has a respiratory drive — she is breathing 72 times per minute. Jumping directly to BVM ventilation before attempting CPAP/BiPAP escalation bypasses a critical intermediate step. BVM is reserved for apnea or agonal breathing. Initiating mask ventilation in a conscious, fighting infant also risks vomiting, gastric distension, and aspiration. Stage the BVM at the bedside; escalate to CPAP/BiPAP first."
          },
          defib: {
            label: "Apply Defibrillator Pads",
            ok: false,
            fb: "The cardiac monitor shows sinus tachycardia at 188 bpm — no shockable rhythm is present. Placing defibrillator pads is not indicated and wastes precious time that should be spent escalating respiratory support. Please put down the paddles and pick up the suction catheter."
          },
          needleDecomp: {
            label: "Needle Decompression",
            ok: false,
            fb: "Needle decompression is not indicated here. Breath sounds are equal bilaterally with a midline trachea — there is no clinical evidence of tension pneumothorax. The diffuse bilateral wheeze and hyperinflated chest are consistent with RSV air trapping, not unilateral pleural air. Performing needle decompression without a tension pneumothorax will cause a iatrogenic pneumothorax and significantly worsen the patient's respiratory status."
          }
        },
        meds: {
          racemicEpi: {
            label: "Racemic Epinephrine 0.05 mL/kg nebulized",
            ok: false,
            fb: "Racemic epinephrine is not indicated for RSV bronchiolitis. Its primary mechanism — alpha-1-mediated mucosal vasoconstriction — reduces subglottic edema in croup, not the lower-airway inflammation and mucus plugging of bronchiolitis. It provides no benefit in bronchiolitis and risks tachycardia, hypertension, and a rebound effect. Current AAP and UCSF bronchiolitis guidelines explicitly recommend against its use."
          },
          albuterol: {
            label: "Albuterol 0.15 mg/kg (min 2.5 mg) nebulized",
            ok: false,
            fb: "Albuterol is not effective in RSV bronchiolitis and is not recommended. Bronchiolitis causes airway obstruction via viral inflammation, mucus plugging, and cell debris — not smooth-muscle bronchospasm that responds to beta-2 agonism. Multiple RCTs and the AAP Clinical Practice Guideline demonstrate no reduction in hospitalization duration, ICU admission, or intubation rate with albuterol in bronchiolitis. It should not be given."
          },
          acetaminophen: {
            label: "Acetaminophen 15 mg/kg IV (120 mg)",
            ok: true,
            priority: 2,
            fb: "Correct. Acetaminophen 15 mg/kg IV (120 mg for 8 kg) is administered for Mira's fever of 38.6°C. Reducing fever decreases metabolic oxygen demand and CO2 production, lowering the respiratory load. While this will not resolve the HFNC failure, it is a clinically sound supportive measure. IV route is preferred given NPO status and the risk of aspiration with oral medications."
          },
          dextroseBolus: {
            label: "D10W 2 mL/kg (16 mL) IV push",
            ok: false,
            fb: "Dextrose is not indicated here. Mira's blood glucose is 88 mg/dL — firmly within normal range. Administering unnecessary glucose risks hyperglycemia, which worsens outcomes in critically ill pediatric patients by impairing neutrophil function and increasing cerebral injury risk. Reserve dextrose for documented or symptomatic hypoglycemia (glucose <50 mg/dL in infants)."
          },
          epiIV: {
            label: "Epinephrine 0.01 mg/kg (0.08 mg) IV/IO for arrest",
            ok: false,
            fb: "Epinephrine is a cardiac arrest and anaphylaxis medication. Mira currently has a pulse and a blood pressure — she is NOT in cardiac arrest. Administering epinephrine IV in a non-arrest infant with HR 188 bpm risks inducing ventricular fibrillation or dangerous supraventricular tachycardia. Focus on escalating her respiratory support to prevent arrest rather than treating a condition she does not yet have."
          },
          nsBolus: {
            label: "Normal Saline 20 mL/kg (160 mL) IV bolus",
            ok: false,
            fb: "A full 20 mL/kg NS bolus is not indicated and potentially harmful. Mira's SBP is 82 mmHg — within normal range for age. She does not have hemodynamic shock requiring fluid resuscitation. In severe bronchiolitis, excess IV fluid can worsen pulmonary edema and increase airway secretions. Current guidelines support maintenance IV fluids (given NPO status) at approximately 100 mL/kg/day for the first 10 kg — not an emergency bolus."
          }
        }
      }
    }
  ],
  curveball: null,
  reassessment: {
    narrative: "Following nasopharyngeal suction, fever management with IV acetaminophen, and immediate escalation to CPAP at 6 cmH2O with 60% FiO2 (initiated by the PICU team after your preparatory actions), Mira shows meaningful clinical improvement. Her SpO2 rises from 88% to 94% within 10 minutes of CPAP initiation. The audible grunting diminishes as CPAP provides the positive end-expiratory pressure she was generating manually with her glottis. Retractions decrease from severe to mild. Her tachycardia improves from 188 to 158 bpm and her respiratory rate slows from 72 to 52 breaths/min as respiratory muscle fatigue is relieved. She begins to open her eyes and track faces again — a reassuring return of cortical function as hypoxemia and hypercapnia begin to correct.",
    vitals: {
      hr: 158,
      rr: 52,
      sbp: 86,
      dbp: 54,
      spo2: 94,
      temp: 37.9,
      cap: 2
    },
    signs: [
      {
        label: "Retractions",
        finding: "Mild subcostal retractions only; suprasternal tug and intercostal retractions resolved",
        pos: "body",
        sys: "respiratory"
      },
      {
        label: "Grunting",
        finding: "Grunting resolved; expiratory sounds quiet on auscultation",
        pos: "face",
        sys: "respiratory"
      },
      {
        label: "Mental Status",
        finding: "Eyes open, tracks faces; responds to voice; tone improved; consolable with voice",
        pos: "head",
        sys: "neurological"
      },
      {
        label: "Skin & Perfusion",
        finding: "Pallor improved; mottling resolved; capillary refill 2 seconds centrally",
        pos: "body",
        sys: "cardiovascular"
      }
    ]
  },
  stabilizationSummary: "Nasopharyngeal suction cleared thick secretions that were occluding the HFNC interface, reducing upper-airway resistance and temporarily improving SpO2 — a necessary preparatory step before CPAP mask application. BVM staged at the bedside ensured the team was ready for immediate positive-pressure ventilation if the patient apnead during the transition. Acetaminophen reduced fever-driven metabolic oxygen demand and CO2 production, lowering the respiratory burden and contributing to the modest improvement in tachycardia.",
  debrief: {
    summary: "Mira presented with RSV bronchiolitis progressing to HFNC failure, evidenced by combined respiratory and metabolic acidosis (pH 7.22, pCO2 68 mmHg), refractory hypoxemia (SpO2 88% on 60% FiO2), and pre-arrest neurological signs. The correct clinical sequence was: (1) recognize HFNC failure using the failure triad of persistent tachypnea, rising pCO2, and declining mental status; (2) clear secretions to optimize the airway before applying a face mask; (3) stage BVM at bedside as immediate backup; (4) confirm IV access before any procedural escalation; and (5) manage fever as a modifiable contributor to respiratory load. Escalation to CPAP — not bronchodilators, not albuterol, not epinephrine — is the evidence-supported next step in HFNC-failing bronchiolitis.",
    explainers: [
      {
        title: "Why HFNC Fails in RSV Bronchiolitis",
        content: "HFNC provides flow-based oxygen delivery and modest nasopharyngeal washout but cannot generate reliable continuous positive airway pressure sufficient to stent open severely obstructed small airways.\n\n- **RSV bronchiolitis** causes bronchial inflammation, mucus plugging, and smooth-muscle bronchoconstriction that dramatically increase small-airway resistance\n- **Air trapping and dynamic hyperinflation** develop when tachypnea shortens expiratory time — incomplete exhalation generates auto-PEEP and progressively reduces tidal volume\n- **HFNC failure criteria** include: FiO2 requirement >50%, worsening tachypnea, rising pCO2, declining mental status, or SpO2 persistently <90%\n- **CPAP** applies a fixed positive end-expiratory pressure that counteracts auto-PEEP, stents collapsed distal airways open, and reduces the work of breathing — mechanisms HFNC cannot replicate\n- **Intubation** is reserved for CPAP/BiPAP failure, apnea, or inability to protect the airway",
        tldr: "HFNC cannot generate sufficient PEEP to overcome severe bronchiolitis-related airway obstruction; CPAP is the evidence-based next step when HFNC fails."
      },
      {
        title: "Why Albuterol and Racemic Epinephrine Are Contraindicated",
        content: "RSV bronchiolitis is not bronchospasm — it is airway obstruction from inflammation and mucus, making bronchodilators ineffective and potentially harmful.\n\n- **Albuterol** (beta-2 agonist) relaxes bronchial smooth muscle — effective in asthma where bronchoconstriction is the primary mechanism, ineffective when obstruction is from **mucus, debris, and edema**\n- Multiple **RCTs and meta-analyses** show albuterol does not reduce hospitalization, ICU admission, or intubation rates in bronchiolitis\n- **Racemic epinephrine** reduces subglottic mucosal edema via alpha-1 vasoconstriction — its indication is **croup** (laryngotracheobronchitis), not bronchiolitis\n- Both medications add **tachycardia** in an already tachycardic infant, increasing myocardial oxygen demand\n- **AAP Clinical Practice Guideline** explicitly recommends against routine bronchodilator use in bronchiolitis",
        tldr: "Albuterol and racemic epinephrine treat bronchoconstriction and croup respectively — neither addresses the mucus-plugging and inflammation mechanism of RSV bronchiolitis."
      },
      {
        title: "Reading the Blood Gas: Combined Acidosis Pattern",
        content: "The venous blood gas in this scenario shows a combined (mixed) respiratory and metabolic acidosis — a pattern that changes management compared to either acidosis alone.\n\n- **pH 7.22**: significantly acidemic (normal 7.35–7.45); the magnitude exceeds what either acidosis alone would cause\n- **pCO2 68 mmHg**: primary respiratory acidosis from alveolar hypoventilation — CO2 cannot be cleared despite tachypnea because dynamic hyperinflation reduces effective alveolar ventilation\n- **HCO3 17 mEq/L**: below normal (22–26) — confirms this is NOT metabolic compensation (which would raise HCO3); instead it is a **second independent acidosis**\n- **Metabolic component** arises from **lactic acidosis** (lactate 3.8 mmol/L) driven by tissue hypoxia — lactic acid consumes bicarbonate buffer\n- **Clinical implication**: the metabolic acidosis will not resolve with bicarbonate infusion alone — it resolves only when **oxygen delivery is restored** by fixing the respiratory failure\n- **Henderson-Hasselbalch consistency check**: pH 7.22 with pCO2 68 and HCO3 17 is internally coherent — do this check mentally for every blood gas",
        tldr: "pH 7.22, pCO2 68, HCO3 17 = combined respiratory + metabolic acidosis from CO2 retention AND tissue hypoxia — both resolve only when respiratory failure is corrected."
      }
    ]
  }
};

export var SC6 = {
  id: "opioid-overdose-adolescent-naloxone",
  source: "builtin",
  title: "Unresponsive at the Party",
  packs: [
    "respiratoryAirway",
    "toxicologyAntidotes",
    "cardiac"
  ],
  tier: 2,
  icon: "💊",
  tagline: "Pinpoint pupils, partial response — the clock is running out on his reversal.",
  description: "A 14-year-old male is brought in by EMS after being found unresponsive at a house party. Friends administered one dose of intranasal naloxone before EMS arrived with partial response. Opioid toxidrome is suspected. Airway protection, re-reversal, and vigilance for re-narcotization are the priorities.",
  visuals: [],
  patient: {
    ageLabel: "14 years",
    weightKg: 50,
    sex: "Male",
    cc: "Unresponsive, suspected opioid overdose",
    history: "Wren Okafor is a 14-year-old male with no known past medical history and no known drug allergies. He was found unresponsive at a high school party approximately 40 minutes prior to ED arrival. Witnesses state he may have taken a pill offered by another partygoer — type unknown, possibly counterfeit pressed tablet. One dose of Narcan 4 mg intranasal was administered by a peer approximately 20 minutes before EMS arrived. EMS reports a partial response: he opened his eyes briefly but remained somnolent, with GCS 8 (E2V2M4) and a respiratory rate of 8 on scene. No alcohol bottles near him. No seizure activity witnessed."
  },
  emsReport: "14-year-old male transported by BLS unit from a residential address after being found unresponsive at a party. Friends administered one dose of intranasal naloxone (4 mg) approximately 20 minutes prior to EMS arrival with partial improvement in responsiveness. EMS placed him on a non-rebreather mask at 15 L/min en route and established a peripheral IV in the right antecubital fossa. He remains minimally responsive on arrival.",
  learnMore: "Illicitly manufactured fentanyl, increasingly found in counterfeit pills distributed at social gatherings, accounts for the majority of adolescent opioid overdose deaths. Intranasal naloxone (4 mg) may be insufficient to fully reverse high-potency synthetic opioids, and re-narcotization is a serious risk because naloxone's duration of action (30–70 min) is shorter than most opioids. Adolescents with partial naloxone response should be treated as potentially opioid-naive with respect to withdrawal risk, warranting careful titration of additional naloxone to avoid precipitating acute withdrawal or agitation.",
  norms: {
    hr: [
      60,
      100
    ],
    rr: [
      12,
      20
    ],
    sbp: [
      90,
      120
    ],
    dbp: [
      60,
      80
    ],
    spo2: [
      95,
      100
    ],
    temp: [
      36.5,
      37.5
    ]
  },
  phases: [
    {
      id: "triage",
      name: "Triage",
      narrative: "Wren is brought in on the EMS stretcher, supine, and minimally responsive to painful stimuli. He is wearing jeans and a hoodie, and smells faintly of cigarette smoke but not alcohol. He has not vomited. His skin is pale and slightly clammy. His breathing is slow and shallow — audible as infrequent, inadequate inspiratory efforts. His pupils are 1–2 mm bilaterally and non-reactive to light. The right antecubital IV established by EMS is patent, with a 20-gauge catheter. The non-rebreather mask placed by EMS is in position but his tidal volumes appear diminished despite the supplemental oxygen. GCS is currently 8 (E2V2M4). There is no evidence of trauma, rash, or focal neurologic deficit on rapid survey.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "58",
          unit: "bpm",
          bad: true,
          _slotRef: "phase[0].vitals.hr.why",
          why: "Bradycardia in a 14-year-old is below the normal resting range of 60–100 bpm.\n\n- **Mu-opioid receptor** activation increases vagal tone and reduces sinoatrial node automaticity, producing bradycardia\n- HR 58 represents **opioid-mediated suppression** of the sympathetic nervous system rather than primary cardiac pathology\n- Bradycardia in this context is reversible with **naloxone** — no atropine or pacing indicated unless hemodynamically unstable\n- Should be monitored continuously; may worsen as partial naloxone reversal wanes"
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "8",
          unit: "/min",
          bad: true,
          _slotRef: "phase[0].vitals.rr.why",
          why: "A respiratory rate of 8 is critically low for a 14-year-old (normal: 12–20/min).\n\n- **Central respiratory depression** via mu-opioid receptors in the pre-Bötzinger complex reduces both rate and tidal volume\n- RR 8 with shallow effort means **minute ventilation** is severely compromised — CO2 is accumulating and hypoxia is worsening\n- This finding, combined with SpO2 89%, defines **impending respiratory failure** requiring immediate intervention\n- Naloxone re-dosing AND ventilatory support are both required — do not choose one over the other"
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "98",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.sbp.why",
          why: "A blood pressure of 98/64 mmHg is within normal limits for a 14-year-old male.\n\n- Normal **SBP** for adolescent males: 90–120 mmHg; 98 is acceptable and does not suggest hemodynamic instability\n- Opioids cause peripheral vasodilation and can lower BP, but in this case perfusion pressure remains adequate\n- This is a **reassuring distractor** — the clinical emergency is respiratory, not cardiovascular collapse\n- Do not anchor on BP as the primary concern; **airway and ventilation** take priority"
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "64",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[0].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "89",
          unit: "%",
          bad: true,
          _slotRef: "phase[0].vitals.spo2.why",
          why: "SpO2 of 89% represents clinically significant hypoxemia even on supplemental oxygen via non-rebreather mask.\n\n- Normal SpO2 ≥95%; 89% on 15 L/min non-rebreather indicates **ventilation-perfusion mismatch** driven by hypoventilation\n- Insufficient respiratory rate and tidal volume means CO2 is displacing O2 in alveoli — **alveolar hypoventilation equation**: PAO2 = FiO2 × (Patm − PH2O) − PaCO2/RQ\n- Supplemental O2 blunts the SpO2 signal — the patient's **CO2** is likely severely elevated even when SpO2 seems borderline\n- Immediate action: **bag-mask ventilation** to augment tidal volume, plus naloxone re-dosing"
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "36.2",
          unit: "C",
          bad: false,
          _slotRef: "phase[0].vitals.temp.why",
          why: "Temperature of 36.2°C is at the low-normal range and is not clinically concerning in isolation.\n\n- Normal pediatric temperature: **36.5–37.5°C**; 36.2°C is borderline but does not constitute hypothermia (< 36.0°C)\n- Slight cooling may reflect **opioid-induced vasodilation** and reduced metabolic rate, but does not require intervention\n- Absence of fever argues against an **infectious co-morbidity** (e.g., meningitis, sepsis) as the primary driver of altered mental status\n- This is a **reassuring finding** — do not anchor on temperature as the key abnormality here"
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "3",
          unit: "sec",
          bad: true,
          _slotRef: "phase[0].vitals.cap.why",
          why: "Capillary refill of 3 seconds is mildly prolonged beyond the normal upper limit of 2 seconds.\n\n- Prolonged cap refill reflects **reduced peripheral perfusion** from opioid-mediated vasodilation and bradycardia\n- In combination with pallor and cool, diaphoretic skin, this indicates **compromised microcirculatory flow**\n- The finding is mild — not the primary emergency — but it contributes to the overall **toxidrome picture**\n- Expected to normalize rapidly with **naloxone reversal** and restoration of normal heart rate and vascular tone"
        }
      },
      signs: [
        {
          id: "pupils",
          label: "Pupils",
          finding: "1–2 mm bilaterally, symmetric, non-reactive to direct light",
          pos: "face",
          sys: "neurological",
          bad: true,
          why: "Bilateral miosis is the hallmark of opioid toxidrome.\n\n- **Mu-opioid receptors** in the Edinger-Westphal nucleus of the oculomotor nerve are activated by opioids, causing unopposed parasympathetic tone to the iris sphincter\n- Result is **pinpoint pupils** (1–2 mm) that are non-reactive even in bright light\n- Unlike metabolic encephalopathy or pontine hemorrhage, which can also cause miosis, opioid miosis is **rapidly reversible** with naloxone\n- Non-reactive pupils in this context strongly suggest **opioid receptor saturation** — partial naloxone reversal was insufficient to displace all agonist binding",
          _slotRef: "phase[0].signs.pupils.why"
        },
        {
          id: "respiratory-effort",
          label: "Respiratory Effort",
          finding: "Rate 8/min, shallow tidal volumes, no use of accessory muscles, intermittent periods of apnea lasting 5–8 seconds",
          pos: "body",
          sys: "respiratory",
          bad: true,
          why: "Opioids cause dose-dependent suppression of the central respiratory drive.\n\n- **Mu-opioid receptors** in the pre-Bötzinger complex and nucleus tractus solitarius in the brainstem are the primary targets for opioid-induced respiratory depression\n- Result is decreased **respiratory rate**, diminished **tidal volume**, and impaired hypercapnic ventilatory response\n- RR of 8 with intermittent apnea in a 50 kg adolescent represents **critical hypoventilation** — CO2 is rising and O2 reserve is depleting\n- Shallow tidal volumes compound hypoxia despite supplemental O2, because **minute ventilation** (RR × TV) is insufficient to clear CO2 or sustain alveolar oxygenation",
          _slotRef: "phase[0].signs.respiratory-effort.why"
        },
        {
          id: "level-of-consciousness",
          label: "Level of Consciousness",
          finding: "GCS 8 (E2V2M4): opens eyes to pain, moaning, localizes to pain; does not follow commands or speak words",
          pos: "head",
          sys: "neurological",
          bad: true,
          why: "Opioids produce CNS depression through mu-receptor agonism across the cortex, limbic system, and brainstem.\n\n- **GCS 8** defines moderate-severe impairment and signals a patient who **cannot protect their own airway**\n- A score of 8 or below is the traditional threshold for intubation consideration in airway protection\n- The partial improvement from baseline unresponsiveness reflects the **incomplete reversal** by the prior intranasal dose\n- **Re-narcotization** is expected as intranasal naloxone (given ~20 min prior) approaches its 30–70 min duration limit",
          _slotRef: "phase[0].signs.level-of-consciousness.why"
        },
        {
          id: "skin-assessment",
          label: "Skin Assessment",
          finding: "Pale, cool, slightly diaphoretic; capillary refill 3 seconds; no cyanosis, no rash, no track marks visible",
          pos: "body",
          sys: "cardiovascular",
          bad: true,
          why: "Opioids cause peripheral vasodilation and histamine release, contributing to cool, pale, and clammy skin.\n\n- **Pallor and diaphoresis** reflect sympathoadrenal response to hypoxia combined with opioid-induced peripheral vasodilation\n- **Cap refill 3 sec** is mildly prolonged (normal < 2 sec) — consistent with reduced peripheral perfusion from opioid-mediated bradycardia and vasodilation\n- Absence of **cyanosis** is reassuring against frank tissue hypoxia at the periphery, though central oxygenation is compromised (SpO2 89%)\n- Absence of **track marks** does not exclude IV drug use; counterfeit pill ingestion is the most common exposure in this demographic",
          _slotRef: "phase[0].signs.skin-assessment.why"
        },
        {
          id: "lung-auscultation",
          label: "Lung Auscultation",
          finding: "Breath sounds equal bilaterally; no wheezes, crackles, or stridor; air entry reduced globally due to shallow tidal volumes",
          pos: "body",
          sys: "respiratory",
          bad: false,
          why: "Equal bilateral breath sounds with reduced air entry globally is reassuring against focal pathology.\n\n- **Equal bilateral sounds** rule out pneumothorax, hemothorax, or main-stem intubation — important to confirm before airway intervention\n- **No wheezing or crackles** argues against bronchospasm or aspiration pneumonitis at this time — aspiration risk remains elevated given depressed mental status\n- Globally reduced air entry is consistent with **central hypoventilation** rather than obstructive or restrictive lung disease\n- **Trachea is midline** — no mediastinal shift",
          _slotRef: "phase[0].signs.lung-auscultation.why"
        },
        {
          id: "cardiac-auscultation",
          label: "Cardiac Auscultation",
          finding: "Bradycardic, regular rhythm; S1 and S2 present; no murmurs, gallops, or rubs",
          pos: "body",
          sys: "cardiovascular",
          bad: false,
          why: "Opioid-induced bradycardia is expected; structural cardiac findings are absent.\n\n- **HR 58** is below the normal adolescent range (60–100 bpm) and reflects mu-receptor mediated reduction in sinoatrial node automaticity and enhanced vagal tone\n- **Regular rhythm** and absent murmur or gallop are reassuring against arrhythmia or structural cardiac disease\n- Bradycardia in opioid overdose is typically **responsive to naloxone** — treating the underlying toxidrome is preferred over atropine unless there is hemodynamic compromise\n- The regular rhythm argues against co-ingestion of a QT-prolonging agent as a primary driver, though an ECG is warranted",
          _slotRef: "phase[0].signs.cardiac-auscultation.why"
        }
      ],
      labs: [
        {
          id: "glucose",
          name: "Glucose",
          value: "88",
          unit: "mg/dL",
          ref: "70–99",
          critical: false,
          bad: false,
          why: "A blood glucose of 88 mg/dL is normal and rules out hypoglycemia as a contributor to altered mental status.\n\n- Normal fasting glucose: **70–99 mg/dL**; 88 mg/dL falls squarely within range\n- **Hypoglycemia** (< 60 mg/dL) must always be excluded in any altered mental status — it is rapidly reversible and potentially fatal if missed\n- Normal glucose here directs clinical attention toward the **opioid toxidrome** rather than metabolic encephalopathy\n- No dextrose bolus required",
          _slotRef: "phase[0].labs.glucose.why"
        },
        {
          id: "venous-ph",
          name: "Venous pH",
          value: "7.22",
          unit: "",
          ref: "7.32–7.40",
          critical: true,
          bad: true,
          why: "Venous pH of 7.22 reflects acute respiratory acidosis from opioid-induced hypoventilation.\n\n- CO2 accumulates as **minute ventilation** (RR × tidal volume) falls below the threshold needed to clear metabolic CO2 production\n- CO2 + H2O → H2CO3 → H+ + HCO3⁻: excess carbonic acid dissociation drives **pH down**\n- The normal bicarbonate (22 mEq/L) confirms this is an **acute, uncompensated** acidosis — no time for renal HCO3 retention\n- Superimposed **lactic acidosis** from hypoxic tissue metabolism adds to the acid burden",
          _slotRef: "phase[0].labs.venous-ph.why"
        },
        {
          id: "venous-pco2",
          name: "Venous pCO2",
          value: "72",
          unit: "mmHg",
          ref: "41–51",
          critical: true,
          bad: true,
          why: "Venous pCO2 of 72 mmHg confirms severe hypercapnia from opioid-induced central respiratory depression.\n\n- Normal CO2 clearance requires adequate **alveolar ventilation**; RR 8 with shallow effort is grossly insufficient\n- Rising pCO2 causes cerebral vasodilation, increasing **intracranial pressure** — which worsens CNS depression further\n- **CO2 narcosis** can independently suppress respiratory drive, creating a self-reinforcing cycle\n- Immediate assisted ventilation and naloxone are both required to break this cycle",
          _slotRef: "phase[0].labs.venous-pco2.why"
        },
        {
          id: "bicarbonate",
          name: "Bicarbonate",
          value: "22",
          unit: "mEq/L",
          ref: "22–26",
          critical: false,
          bad: false,
          why: "Bicarbonate of 22 mEq/L is within normal limits, confirming an acute rather than chronic respiratory acidosis.\n\n- Normal serum bicarbonate: **22–26 mEq/L**; 22 mEq/L is low-normal\n- In **acute** respiratory acidosis, renal compensation has not yet occurred — kidneys require 24–48 hours to retain bicarbonate\n- The normal bicarb with low pH and high pCO2 confirms this is an **uncompensated acute respiratory acidosis**, not a chronic process\n- This pattern is reassuring that the acidosis is **reversible** with prompt ventilatory support — no base deficit requiring bicarbonate administration",
          _slotRef: "phase[0].labs.bicarbonate.why"
        },
        {
          id: "lactate",
          name: "Lactate",
          value: "3.8",
          unit: "mmol/L",
          ref: "0.5–2.0",
          critical: true,
          bad: true,
          why: "Lactate of 3.8 mmol/L indicates anaerobic metabolism from hypoxia-driven tissue oxygen debt.\n\n- **Pyruvate** cannot enter the TCA cycle without oxygen; it is instead reduced to lactate by lactate dehydrogenase\n- Elevated lactate here is the result of **hypoventilation-induced hypoxia** rather than circulatory failure\n- Level 3.8 mmol/L indicates meaningful oxygen debt — expected to normalize rapidly with **ventilatory reversal**\n- A persistently elevated or rising lactate after intervention would prompt investigation for **aspiration, sepsis, or co-ingestion**",
          _slotRef: "phase[0].labs.lactate.why"
        },
        {
          id: "acetaminophen-level",
          name: "Acetaminophen Level",
          value: "< 10",
          unit: "mcg/mL",
          ref: "< 10 (non-toxic)",
          critical: false,
          bad: false,
          why: "Undetectable acetaminophen level in an adolescent with altered mental status after possible pill ingestion is a reassuring finding.\n\n- Counterfeit pills frequently contain **fentanyl** or other adulterants, but co-ingestion of **acetaminophen** (Tylenol) is an important co-toxin to exclude, especially in intentional overdoses\n- Undetectable level rules out **occult acetaminophen toxicity**, which can cause delayed hepatic failure even without early symptoms\n- This is a **required exclusionary test** in all adolescent overdose presentations regardless of the suspected agent\n- Negative result directs treatment focus entirely toward **opioid reversal**",
          _slotRef: "phase[0].labs.acetaminophen-level.why"
        },
        {
          id: "ethanol-level",
          name: "Ethanol Level",
          value: "< 10",
          unit: "mg/dL",
          ref: "< 10 (undetectable)",
          critical: false,
          bad: false,
          why: "Undetectable ethanol level removes alcohol as a co-intoxicant in the differential diagnosis.\n\n- **Ethanol** acts as a CNS depressant via GABA-A potentiation and NMDA inhibition and frequently co-occurs at adolescent parties\n- Undetectable level (< 10 mg/dL) argues against ethanol as a **significant contributor** to his current CNS and respiratory depression\n- This is reassuring: the clinical picture is consistent with a **pure opioid toxidrome**, simplifying treatment strategy\n- Naloxone remains the correct antidote — no change in approach needed",
          _slotRef: "phase[0].labs.ethanol-level.why"
        }
      ],
      tools: null,
      meds: null,
      actions: null
    },
    {
      id: "escalation",
      name: "Escalation",
      narrative: "Wren remains minimally responsive with GCS 8, respiratory rate of 8/min, SpO2 89% on the non-rebreather mask, and intermittent apneic episodes. His pupils remain pinpoint bilaterally. Breath sounds are equal bilaterally with the trachea midline — no focal lung pathology on auscultation. Peripheral perfusion is diminished with cap refill 3 seconds. The right antecubital 20-gauge IV established by EMS is confirmed patent. His blood gas confirms severe hypercapnia (pCO2 72) and mixed acidosis (pH 7.22), consistent with ongoing hypoventilation from incomplete opioid reversal. The intranasal naloxone given approximately 20–25 minutes ago is approaching the end of its effective duration, and re-narcotization is imminent. The toxicology team is on the phone. Your team must act now to support his airway and ventilation and administer additional naloxone before he becomes apneic.",
      vitals: {
        hr: {
          id: "hr",
          label: "HR",
          value: "58",
          unit: "bpm",
          bad: false,
          _slotRef: "phase[1].vitals.hr.why",
          why: null
        },
        rr: {
          id: "rr",
          label: "RR",
          value: "8",
          unit: "/min",
          bad: false,
          _slotRef: "phase[1].vitals.rr.why",
          why: null
        },
        sbp: {
          id: "sbp",
          label: "BP",
          value: "98",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.sbp.why",
          why: null
        },
        dbp: {
          id: "dbp",
          label: "BP",
          value: "64",
          unit: "mmHg",
          bad: false,
          _slotRef: "phase[1].vitals.dbp.why",
          why: null
        },
        spo2: {
          id: "spo2",
          label: "SpO2",
          value: "89",
          unit: "%",
          bad: false,
          _slotRef: "phase[1].vitals.spo2.why",
          why: null
        },
        temp: {
          id: "temp",
          label: "Temp",
          value: "36.2",
          unit: "C",
          bad: false,
          _slotRef: "phase[1].vitals.temp.why",
          why: null
        },
        cap: {
          id: "cap",
          label: "Cap Refill",
          value: "3",
          unit: "sec",
          bad: false,
          _slotRef: "phase[1].vitals.cap.why",
          why: null
        }
      },
      signs: [
        {
          id: "airway-patency",
          label: "Airway Patency",
          finding: "Airway patent with jaw thrust maintained; oropharynx clear; no vomitus, secretions, or foreign body visualized; mild snoring on expiration",
          pos: "head",
          sys: "respiratory",
          bad: true,
          why: "Airway patency is maintained but at risk due to loss of oropharyngeal muscle tone from CNS depression.\n\n- **Opioid CNS depression** reduces tone in genioglossus and pharyngeal muscles, producing partial upper airway obstruction\n- The **snoring sound** indicates posterior tongue displacement partially occluding the hypopharynx\n- Airway is currently maintainable with jaw thrust — **nasopharyngeal airway adjunct** would reduce ongoing obstruction without requiring intubation\n- Clear oropharynx (no vomitus) is reassuring against **aspiration** at this moment, but risk remains high with GCS 8",
          _slotRef: "phase[1].signs.airway-patency.why"
        },
        {
          id: "ventilatory-response",
          label: "Ventilatory Response",
          finding: "Spontaneous respiratory effort present but rate 8/min with tidal volumes visually estimated at < 200 mL; no response to sternal rub; SpO2 89% on non-rebreather",
          pos: "body",
          sys: "respiratory",
          bad: true,
          why: "Insufficient spontaneous ventilation demands active augmentation while antidote takes effect.\n\n- Estimated tidal volume < 200 mL is far below the normal **6–8 mL/kg** (300–400 mL for 50 kg) required for adequate alveolar gas exchange\n- **Minute ventilation** = RR × TV ≈ 8 × 200 mL = 1,600 mL/min — severely reduced from normal ~5–6 L/min\n- BVM-assisted breaths at 12–15/min would augment CO2 clearance and improve SpO2 while naloxone takes effect\n- This finding justifies **BVM ventilation** as a bridge to naloxone reversal rather than proceeding directly to RSI",
          _slotRef: "phase[1].signs.ventilatory-response.why"
        },
        {
          id: "pupillary-response",
          label: "Pupillary Response",
          finding: "Pupils 1–2 mm bilaterally, still non-reactive to penlight; unchanged from triage",
          pos: "face",
          sys: "neurological",
          bad: true,
          why: "Persistent pinpoint non-reactive pupils confirm ongoing opioid receptor saturation despite prior naloxone dose.\n\n- Prior intranasal naloxone is metabolized or redistributed; **mu-receptor occupancy** by the ingested opioid persists\n- No pupillary improvement signals **inadequate naloxone effect** — the original IN dose was insufficient for the likely high-potency synthetic opioid\n- Pupil normalization (4–5 mm, reactive) is a reliable clinical endpoint for **adequate naloxone reversal**\n- Monitor pupils closely: response within 2–3 minutes of IV naloxone confirms reversal; absence suggests **high-potency opioid** requiring repeat or infusion dosing",
          _slotRef: "phase[1].signs.pupillary-response.why"
        },
        {
          id: "etco2-waveform",
          label: "ETCO2 Waveform",
          finding: "End-tidal CO2 68 mmHg with normal square waveform morphology; no plateau abnormality or shark-fin pattern",
          pos: "body",
          sys: "respiratory",
          bad: true,
          why: "ETCO2 of 68 mmHg confirms severe alveolar hypoventilation without bronchospasm.\n\n- **Normal square waveform** morphology (no shark-fin) excludes obstructive airway disease (asthma, bronchospasm) as a contributor\n- ETCO2 68 mmHg correlates closely with the venous pCO2 of 72 mmHg — consistent internal validation\n- Serial ETCO2 monitoring provides real-time feedback on ventilatory response to **BVM assistance and naloxone**\n- A falling ETCO2 toward 35–45 mmHg confirms effective treatment; a rising ETCO2 despite BVM signals need for **definitive airway management**",
          _slotRef: "phase[1].signs.etco2-waveform.why"
        },
        {
          id: "iv-access",
          label: "IV Access",
          finding: "Right antecubital 20-gauge peripheral IV, established by EMS; confirmed patent with blood return and 10 mL saline flush; no infiltration",
          pos: "body",
          sys: "vascular",
          bad: false,
          why: "Patent peripheral IV access is essential for immediate IV naloxone delivery.\n\n- A **20-gauge IV** in the antecubital fossa is appropriate for rapid drug administration in this clinical scenario\n- IV route for naloxone provides **onset within 1–2 minutes**, compared to 3–5 minutes for intranasal and faster than IM\n- Confirmed patency and absence of infiltration means IV naloxone can be pushed **immediately without delay for new access**\n- IO access should be available as backup if this IV fails — opioid reversal cannot be delayed for difficult access",
          _slotRef: "phase[1].signs.iv-access.why"
        }
      ],
      labs: [],
      tools: [
        "bvm",
        "etco2",
        "npa",
        "pulseOx",
        "defib",
        "intubationKit",
        "o2Mask",
        "ecg12Lead",
        "gastricLavage"
      ],
      meds: [
        "naloxone",
        "ketamine",
        "dextroseBolus",
        "lorazepam",
        "flumazenil",
        "activatedCharcoal",
        "nsBolus",
        "fentanyl"
      ],
      actions: {
        tools: {
          bvm: {
            ok: true,
            priority: 1,
            fb: "Excellent first move. BVM ventilation at 12–15 breaths/min with a correctly sized mask provides assisted tidal volumes of 300–400 mL (6–8 mL/kg), augmenting minute ventilation and beginning to clear the accumulated CO2. This is the bridge intervention while IV naloxone takes effect — SpO2 and ETCO2 will both trend toward normal. In opioid overdose, BVM is preferred over immediate intubation because naloxone can restore spontaneous ventilation within minutes, avoiding the risks of RSI in a potentially difficult airway. If ETCO2 rises despite good BVM technique or GCS does not improve after repeat naloxone, then RSI is indicated."
          },
          etco2: {
            ok: true,
            priority: 2,
            fb: "Good clinical thinking. Continuous ETCO2 monitoring provides real-time capnography to assess the adequacy of assisted ventilation and guide naloxone response. The waveform's normal morphology confirms this is hypoventilation, not bronchospasm — you can target ETCO2 of 35–45 mmHg as you BVM and re-dose naloxone. A falling ETCO2 trend confirms effective treatment; a plateau or rise despite BVM signals impending need for RSI. This tool should stay connected throughout the resuscitation."
          },
          npa: {
            ok: true,
            priority: 3,
            fb: "Good adjunct choice. A nasopharyngeal airway (size 6.5–7.0 for a 50 kg adolescent, approximately nares-to-earlobe measurement) maintains hypopharyngeal patency by stenting the nasopharynx open, preventing posterior tongue obstruction without stimulating a gag reflex. This is preferred over an OPA in a patient with GCS 8 who still has some gag reflex and may become more responsive after naloxone. Apply water-soluble lubricant, insert gently through the right naris, and confirm patency by feeling airflow. This buys time for naloxone to work without requiring intubation."
          },
          ecg12Lead: {
            ok: true,
            priority: 4,
            fb: "Appropriate. A 12-lead ECG is indicated in any adolescent with suspected drug ingestion — particularly to screen for QTc prolongation from opioids themselves (methadone is well-known for this) or from adulterants and co-ingestants. It also identifies any arrhythmia contributing to his bradycardia (e.g., heart block, Brugada pattern). A normal sinus rhythm with normal QTc is reassuring; a prolonged QTc (> 460 ms in adolescents) would change management toward closer monitoring and avoidance of QT-prolonging adjuncts."
          },
          pulseOx: {
            ok: true,
            priority: 4,
            fb: "Continuous pulse oximetry is standard monitoring in any patient with respiratory compromise. In opioid overdose, SpO2 trending toward ≥ 95% confirms effective ventilatory augmentation. Keep in mind that supplemental O2 can mask worsening hypoventilation — SpO2 may stay acceptable even as CO2 rises, which is why ETCO2 is the superior real-time monitor here. Both are complementary and should run simultaneously."
          },
          defib: {
            ok: false,
            priority: null,
            fb: "Not indicated right now — Wren is bradycardic but perfusing. Opioid-induced bradycardia (HR 58) does not warrant defibrillation or pacing; it reflects vagal predominance from mu-receptor activation and will respond to naloxone reversal. The defibrillator should be at bedside and pads applied for monitoring, but keep those paddles holstered. If you shock a patient in sinus bradycardia, you may get a very different rhythm in response — and not a better one. Cardioversion and defibrillation are for shockable rhythms: VF and pulseless VT."
          },
          intubationKit: {
            ok: false,
            priority: null,
            fb: "Not the right first move, but keep it staged. Endotracheal intubation is indicated if: (1) GCS does not improve with IV naloxone, (2) ETCO2 continues rising despite BVM, (3) the patient vomits and aspirates, or (4) airway cannot be maintained with adjuncts. However, proceeding directly to RSI before attempting IV naloxone wastes the opportunity for a medication to reverse the problem entirely — plus naloxone avoidance is not a benefit of intubation. Have the kit ready; do not use it yet. RSI agents (ketamine + rocuronium) should be drawn up and ready if BVM + naloxone fails."
          },
          o2Mask: {
            ok: false,
            priority: null,
            fb: "Wren arrived on a non-rebreather mask at 15 L/min — swapping to a plain face mask would reduce his FiO2 at a moment when he needs maximum supplemental oxygen. The correct move is to take the mask OFF and replace it with a BVM connected to high-flow O2, so you can actively ventilate rather than passively deliver O2 he isn't breathing deeply enough to use. Passive O2 delivery via mask alone is not adequate when tidal volumes are critically reduced."
          },
          gastricLavage: {
            ok: false,
            priority: null,
            fb: "Gastric lavage is contraindicated in this patient. With GCS 8 and impaired airway reflexes, lavage without a cuffed endotracheal tube in place carries a high risk of aspiration — potentially causing aspiration pneumonitis or pneumonia that would compound his respiratory failure. Furthermore, opioid ingestion more than 1–2 hours prior (estimated 40+ minutes since found, plus unknown time before that) is unlikely to benefit from GI decontamination. Activated charcoal is also contraindicated for the same airway protection reason. Lavage is appropriate in alert, cooperative patients with very recent toxic ingestion of certain agents — not here."
          }
        },
        meds: {
          naloxone: {
            ok: true,
            priority: 1,
            fb: "Correct antidote — and the most time-critical decision in this case. For a 50 kg adolescent with suspected high-potency synthetic opioid exposure and prior partial IN response, administer naloxone 0.1 mg/kg IV with a maximum of 2 mg per bolus dose. Give 2 mg IV, reassess in 2–3 minutes, and repeat to a maximum of 10 mg if needed. Use a titrated IV approach rather than a full reversal bolus to avoid precipitating acute opioid withdrawal with agitation — which can be dangerous in this age group. Onset is within 1–2 minutes IV. If pupil response and respiratory rate improve, switch to a naloxone infusion (two-thirds of the effective bolus dose per hour) to prevent re-narcotization, as the opioid's duration exceeds naloxone's 30–70 minute window."
          },
          dextroseBolus: {
            ok: false,
            priority: null,
            fb: "Glucose was checked and is 88 mg/dL (normal), so a dextrose bolus is not clinically indicated here. Empiric dextrose is a reasonable consideration in altered mental status when a glucose result is not yet available — in a scenario without a glucometer, giving D10W at 2 mL/kg is appropriate. Since glucose is confirmed normal in this case, administering dextrose would cause hyperglycemia without benefit. The teaching point is that hypoglycemia must always be excluded in altered mental status, but once excluded, dextrose adds no value."
          },
          nsBolus: {
            ok: true,
            priority: 3,
            fb: "A modest normal saline bolus (10–20 mL/kg) is reasonable for mildly reduced peripheral perfusion (cap refill 3 sec, HR 58, BP 98/64). Opioids cause peripheral vasodilation and may reduce effective circulating volume. However, his BP of 98/64 is within normal limits for age — he is not in shock. Hydration support is appropriate and low-risk, but fluid resuscitation is not the primary treatment here. Naloxone and ventilatory support are the priority interventions. Do not delay antidote administration to hang fluids."
          },
          lorazepam: {
            ok: false,
            priority: null,
            fb: "Contraindicated in this setting. Lorazepam is a GABA-A potentiating benzodiazepine — administering it to a patient with opioid-induced CNS and respiratory depression would cause additive sedation and worsen his respiratory failure and GCS. Lorazepam would be appropriate for active seizure management (0.1 mg/kg IV) or procedural sedation — neither of which applies here. The ethanol level is undetectable, ruling out alcohol withdrawal seizures as an indication. This medication could be fatal in this clinical context."
          },
          ketamine: {
            ok: false,
            priority: null,
            fb: "Not indicated here. Ketamine is an NMDA receptor antagonist used for dissociative analgesia and as an RSI induction agent. In an opioid overdose with CNS and respiratory depression, adding a dissociative anesthetic would not treat the underlying mu-receptor toxidrome and would impair consciousness further — the opposite of what's needed. Ketamine would be appropriate as an induction agent if RSI becomes necessary after naloxone failure, but it is not the correct choice as an initial intervention. Reserve it for the RSI kit if needed."
          },
          flumazenil: {
            ok: false,
            priority: null,
            fb: "Flumazenil is a competitive benzodiazepine antagonist at the GABA-A receptor — it is the antidote for benzodiazepine overdose, not opioid overdose. Ethanol level is undetectable and there is no evidence of benzodiazepine ingestion in this case. Administering flumazenil without evidence of benzo toxicity provides no benefit and carries risk: in a patient with occult benzodiazepine dependence (which can occur in adolescents with substance use disorders), flumazenil can precipitate acute withdrawal seizures. This is a classic 'sounds similar, wrong mechanism' distractor — naloxone is the correct antidote here."
          },
          activatedCharcoal: {
            ok: false,
            priority: null,
            fb: "Activated charcoal is contraindicated in Wren's current state. With GCS 8 and impaired airway reflexes, he cannot safely swallow activated charcoal without risking aspiration — and pulmonary aspiration of activated charcoal causes severe chemical pneumonitis. Activated charcoal is appropriate for alert, cooperative patients who present within 1 hour of a toxic ingestion of a charcoal-adsorbable substance (opioids are charcoal-adsorbable, but the window has likely passed, and airway safety is the paramount concern). Never administer charcoal to a patient who cannot protect their own airway without a cuffed ETT in place."
          },
          fentanyl: {
            ok: false,
            priority: null,
            fb: "Absolutely contraindicated. Fentanyl is a high-potency synthetic mu-opioid agonist — administering it to a patient already in opioid-induced respiratory failure would deepen CNS depression, worsen hypoventilation, and could cause respiratory arrest. This is the wrong direction entirely. Fentanyl is appropriate for procedural analgesia or RSI co-induction in patients with intact airway reflexes and normal respiratory drive — not in an opioid-overdosed, hypoventilating patient. If you see pinpoint pupils and RR 8: give naloxone, not more opioids."
          }
        }
      }
    }
  ],
  reassessment: {
    narrative: "Three minutes after IV naloxone 2 mg (titrated bolus, repeated once) and bag-mask ventilation at 14 breaths/min, Wren begins to show meaningful improvement. His eyes open spontaneously and he attempts to pull off the BVM mask — a promising sign of returning protective reflexes. Pupils have opened to 3 mm bilaterally and are now sluggishly reactive to light. Respiratory rate has increased to 14/min with improved tidal volumes, and SpO2 has risen to 97% on supplemental oxygen. ETCO2 has fallen from 68 to 44 mmHg, confirming effective CO2 clearance. Heart rate has normalized to 76 bpm. He is now vocalizing incoherently and moving all four extremities purposefully — GCS has improved to 12 (E3V3M6). A naloxone infusion at 1.5 mg/hr has been initiated (two-thirds of the effective bolus dose) to prevent re-narcotization, as the suspected fentanyl analog will outlast any single IV bolus. Capillary refill has improved to 2 seconds bilaterally.",
    vitals: {
      hr: 76,
      rr: 14,
      sbp: 108,
      dbp: 70,
      spo2: 97,
      temp: 36.4,
      cap: 2
    },
    signs: [
      {
        label: "Pupillary Response",
        finding: "Pupils 3 mm bilaterally, sluggishly reactive to light — improved from 1–2 mm non-reactive",
        pos: "face",
        sys: "neurological"
      },
      {
        label: "Ventilatory Response",
        finding: "Spontaneous respiratory rate 14/min with improved tidal volumes; BVM assistance now supplemental rather than primary; SpO2 97%",
        pos: "body",
        sys: "respiratory"
      },
      {
        label: "Level of Consciousness",
        finding: "GCS 12 (E3V3M6): opens eyes spontaneously, vocalizing incoherently, purposeful movement; attempting to remove mask",
        pos: "head",
        sys: "neurological"
      },
      {
        label: "Skin Assessment",
        finding: "Skin warmer and less diaphoretic; capillary refill 2 seconds; mild flushing noted — consistent with naloxone-mediated vasomotor reversal",
        pos: "body",
        sys: "cardiovascular"
      }
    ]
  },
  stabilizationSummary: "IV naloxone (titrated 2 mg bolus × 2) competitively displaced opioid agonist from mu-receptors, restoring central respiratory drive and reversing CNS depression — evidenced by improved GCS from 8 to 12, respiratory rate from 8 to 14/min, and pupillary dilation from 1–2 mm to 3 mm reactive. Bag-mask ventilation at 14 breaths/min bridged the gap during naloxone onset, clearing the CO2 burden (ETCO2 68 → 44 mmHg) and correcting hypoxemia (SpO2 89% → 97%). A naloxone infusion was initiated at two-thirds the effective bolus dose per hour to prevent re-narcotization, recognizing that the suspected synthetic opioid's duration exceeds any single IV bolus of naloxone.",
  debrief: {
    summary: "Wren presented in opioid toxidrome — the clinical triad of miosis, CNS depression (GCS 8), and respiratory depression (RR 8, pCO2 72) following a suspected counterfeit pill ingestion at a party. A prior intranasal naloxone dose produced partial reversal but was insufficient to fully displace high-affinity synthetic opioid from mu-receptors. The critical management priorities were: (1) immediate ventilatory support via bag-mask ventilation to bridge the CO2 burden and hypoxemia while (2) IV naloxone was titrated to restore spontaneous ventilation, avoiding both re-narcotization and precipitated withdrawal. ETCO2 monitoring provided real-time guidance and confirmed treatment efficacy. A naloxone infusion was essential given the expected opioid duration exceeding that of naloxone.",
    explainers: [
      {
        title: "Naloxone Dosing in High-Potency Synthetic Opioid Overdose",
        content: "Naloxone is a competitive mu-opioid receptor antagonist with a duration of action of 30–70 minutes — shorter than most opioids, including fentanyl analogs commonly found in counterfeit pills.\n\n- **Standard IV dose**: 0.1 mg/kg (maximum 2 mg per bolus) — repeated every 2–3 minutes to a total of 10 mg if needed for high-potency synthetic opioids\n- **Titrated dosing** in opioid-tolerant adolescents: start with 0.04–0.1 mg IV to avoid precipitating acute withdrawal (agitation, vomiting, seizure) in opioid-dependent patients\n- **Re-narcotization risk**: single bolus lasts 30–70 min; fentanyl analogs may last 1–3+ hours — a **continuous infusion** at two-thirds of the effective bolus dose per hour prevents relapse\n- **Intranasal naloxone (4 mg)**: effective for pure fentanyl but may be insufficient for carfentanil or nitazenes due to extremely high receptor affinity\n- **Route hierarchy**: IV > IM > IN for onset speed; IV is preferred when access exists",
        tldr: "IV naloxone 0.1 mg/kg titrated bolus; repeat every 2–3 min; start infusion at 2/3 effective dose/hr to prevent re-narcotization."
      },
      {
        title: "BVM Before Intubation in Opioid Overdose",
        content: "Bag-mask ventilation is the preferred airway intervention in opioid overdose when the patient has any spontaneous respiratory effort and IV naloxone is immediately available.\n\n- **Why not RSI first?** Intubation commits the patient to mechanical ventilation, sedation, and ICU admission — all avoidable if naloxone restores spontaneous ventilation within 2–5 minutes of IV dosing\n- **BVM targets**: rate 12–15/min, tidal volume 6–8 mL/kg (300–400 mL for 50 kg), peak pressure < 20 cmH2O to minimize gastric insufflation\n- **When to escalate to RSI**: ETCO2 rising despite effective BVM, GCS not improving after repeat naloxone, aspiration event, airway that cannot be maintained with adjuncts\n- **NPA adjunct**: preferred over OPA in partially responsive patients — maintains hypopharyngeal patency without stimulating gag reflex\n- **ETCO2 is the guide**: a falling ETCO2 trend during BVM confirms CO2 clearance; a plateau or rise signals inadequate ventilation or need for definitive airway",
        tldr: "BVM bridges to naloxone reversal. Target ETCO2 35–45 mmHg. Escalate to RSI only if reversal fails or airway cannot be maintained."
      },
      {
        title: "Re-Narcotization and the Naloxone Infusion",
        content: "Re-narcotization occurs when naloxone's effect wanes while the opioid agonist remains bound to or redistributed back to mu-receptors, causing relapse of CNS and respiratory depression.\n\n- **Mechanism**: naloxone is metabolized hepatically (half-life ~60–90 min); if the opioid's half-life exceeds this, free opioid re-occupies receptors after naloxone is cleared\n- **High-risk agents**: methadone (t½ 24–48 hrs), extended-release oxycodone, fentanyl analogs (carfentanil), and nitazenes all outlast naloxone boluses\n- **Infusion protocol**: administer two-thirds of the total effective bolus dose (the dose that produced reversal) per hour as a continuous IV infusion; titrate to maintain adequate respiratory rate and level of consciousness without precipitating withdrawal\n- **Monitoring window**: patients receiving naloxone for suspected synthetic opioid overdose should be observed for a **minimum of 4–6 hours** after the last dose of naloxone, or admitted to a monitored bed\n- **Withdrawal signs during infusion**: agitation, diaphoresis, vomiting, hypertension, tachycardia — reduce infusion rate if these emerge",
        tldr: "Start naloxone infusion at 2/3 effective bolus dose/hr. Observe 4–6 hrs minimum. Watch for withdrawal signs vs. re-narcotization."
      }
    ]
  }
};
