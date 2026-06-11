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
  "id": "fussy-infant",
  "source": "builtin",
  "schemaVersion": "5.4.1",
  "title": "The Fussy Infant",
  "tier": 1,
  "icon": "👶",
  "tagline": "6-month-old - Fussiness and Fever",
  "description": "A 6-month-old male brought in for increasing fussiness and fever.",
  "visuals": [
    "flushed"
  ],
  "patient": {
    "ageLabel": "6 months",
    "weightKg": 7.5,
    "sex": "Male",
    "cc": "Fussiness and fever x 12 hours",
    "history": "Previously healthy. Decreased oral intake, fewer wet diapers today. No sick contacts. Immunizations up to date. Born full-term, no NICU stay."
  },
  "emsReport": "EMS brought in a 6-month-old male for a 12-hour history of fever and fussiness. Mother reports two episodes of non-bloody emesis and decreased wet diapers. Acetaminophen was given approximately one hour ago. Field vitals showed HR 175 and rectal temp 39.1C. EMS established a 22g IV in the left hand with NS KVO.",
  "learnMore": "Fever in infants under 3 months is treated urgently because of the risk of occult bacteremia and serious bacterial illness. Between 3-6 months, fever workup is guided by clinical appearance, immunization status, and focal findings. At 6 months, a well-appearing infant with a clear viral source may not need a full septic workup, but fussiness, feeding changes, and dehydration are red flags for deeper investigation.",
  "norms": {
    "hr": [
      100,
      160
    ],
    "rr": [
      25,
      40
    ],
    "sbp": [
      70,
      90
    ],
    "dbp": [
      40,
      60
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
      "phaseIndex": 0,
      "id": "assess",
      "stageType": "assess",
      "title": "Triage",
      "narrative": "EMS delivers a six-month-old male with a 12-hour history of fever and fussiness. He is previously healthy with no significant past medical history and immunizations are up to date. His mother reports two episodes of non-bloody emesis and decreased wet diapers since this morning. She administered acetaminophen approximately one hour ago. EMS established a 22-gauge IV in the left hand with a normal saline keep-open drip. Field vitals showed a heart rate of 175 and a rectal temperature of 39.1 degrees Celsius. On your initial assessment, the infant appears flushed and warm but is alert and consolable with a pacifier.",
      "vitals": [
        {
          "id": "hr",
          "label": "HR",
          "value": "178",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.hr.why",
          "why": "Elevated (normal 100-160) but proportional to fever. ~10 bpm per 1C above normal. Infants are rate-dependent for cardiac output."
        },
        {
          "id": "rr",
          "label": "RR",
          "value": "42",
          "unit": "/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.rr.why",
          "why": "Mildly elevated (normal 25-40). Fever increases CO2 production driving ventilatory rate up."
        },
        {
          "id": "bp",
          "label": "BP",
          "value": "72/45",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.bp.why",
          "why": "Normal for age. Maintained BP does NOT rule out early shock - children vasoconstrict aggressively."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "98",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.spo2.why",
          "why": "Normal. Fetal hemoglobin shifts curve LEFT so sats stay high."
        },
        {
          "id": "temp",
          "label": "Temp",
          "value": "39.2",
          "unit": "C",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.temp.why",
          "why": "Febrile. Needs workup for UTI, bacteremia, meningitis at 6 months."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2.5",
          "unit": "sec",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.cap.why",
          "why": "Borderline (normal < 3s). Worth trending - earliest shock marker."
        }
      ],
      "signs": [
        {
          "id": "skin",
          "label": "Skin",
          "finding": "Flushed, warm, generalized erythema",
          "pos": "body",
          "sys": "Integumentary",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.skin.why",
          "why": "Fever-induced cutaneous vasodilation carries heat to the skin surface for radiative cooling. Pyrogens reset the hypothalamic set point; the body compensates with peripheral dilation and sweating. Warm, pink, dry skin with fever suggests early warm septic shock - distinct from the cold, mottled skin of late decompensated shock."
        },
        {
          "id": "fontanelle",
          "label": "Fontanelle",
          "finding": "Flat and soft",
          "pos": "head",
          "sys": "Neuro",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.fontanelle.why",
          "why": "A flat, soft anterior fontanelle in a febrile infant is a quick negative check for two dangerous possibilities: a bulging fontanelle would suggest meningitis or raised ICP, while a sunken fontanelle would suggest significant dehydration. Flat and soft means neither is currently present, but does not rule them out on re-assessment."
        },
        {
          "id": "mucous-membranes",
          "label": "Mucous membranes",
          "finding": "Moist",
          "pos": "face",
          "sys": "GI/Hydration",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.mucous-membranes.why",
          "why": "Moist mucous membranes are a reassuring hydration check in a febrile infant with reported decreased intake.\n\n- **Moist membranes** argue against significant dehydration at this moment, even with fewer wet diapers reported\n- They do **not** rule out early shock — perfusion can fail while hydration still looks adequate\n- Re-examine after any deterioration; membranes dry out as volume status worsens"
        },
        {
          "id": "behavior",
          "label": "Behavior",
          "finding": "Irritable but consolable with pacifier",
          "pos": "head",
          "sys": "Neuro",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.behavior.why",
          "why": "Irritable but consolable is a reassuring neurologic sign in a febrile infant — a sick-but-not-toxic appearance.\n\n- **Consolability** means cortical function and the infant–caregiver response loop are intact\n- An inconsolable or lethargic, unconsolable infant is far more concerning for sepsis or meningitis\n- This is a baseline to trend — loss of consolability is an early red flag"
        },
        {
          "id": "heart-sounds",
          "label": "Heart sounds",
          "finding": "Tachycardic, regular rhythm, no murmur, no gallop",
          "pos": "body",
          "sys": "Cardiovascular",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.heart-sounds.why",
          "why": "The tachycardia is the flagworthy element; the rhythm and absent murmur or gallop are reassuring against structural or rhythm disease.\n\n- **Tachycardia at 178** exceeds the infant range (100–160) and signals physiologic stress\n- **Regular rhythm** argues against a primary tachyarrhythmia like SVT\n- **No murmur or gallop** argues against structural disease or volume overload as the driver"
        },
        {
          "id": "lungs",
          "label": "Lungs",
          "finding": "Clear bilaterally, equal air entry, no crackles or wheeze",
          "pos": "body",
          "sys": "Respiratory",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.lungs.why",
          "why": "Clear, equal breath sounds are a reassuring respiratory exam that helps localize the source away from the chest.\n\n- **Clear lungs** make pneumonia a less likely source for this fever, redirecting the workup\n- Equal air entry argues against a focal process or effusion\n- Tachypnea here is more likely fever-driven or a compensatory response than primary lung disease"
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "18.2",
          "unit": "K/uL",
          "ref": "6.0-17.5",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.wbc.why",
          "why": "Leukocytosis with elevated WBC indicates the bone marrow is releasing white cells in response to infection. The body is mounting an immune response, producing and deploying neutrophils to fight the invading pathogen."
        },
        {
          "id": "hgb",
          "name": "Hgb",
          "value": "11.8",
          "unit": "g/dL",
          "ref": "10.0-14.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.hgb.why",
          "why": "A normal hemoglobin is reassuring against anemia contributing to the picture and is a useful baseline before resuscitation.\n\n- **Hgb 11.8** is within the infant range and argues against blood loss or hemolysis as a driver\n- Establishes a baseline before fluid boluses, which will hemodilute later values\n- Normal oxygen-carrying capacity means hypoxia, if it develops, is a delivery problem, not a content problem"
        },
        {
          "id": "platelets",
          "name": "Platelets",
          "value": "245",
          "unit": "K/uL",
          "ref": "150-400",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.platelets.why",
          "why": "A normal platelet count is reassuring early, but it must be trended — sepsis can consume platelets as it progresses.\n\n- **Platelets 245** is normal and argues against DIC or marrow suppression at this moment\n- Falling platelets is one of the earliest lab signs of evolving sepsis-associated coagulopathy\n- A normal value now does not exclude later consumption; recheck if the infant deteriorates"
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "72",
          "unit": "mg/dL",
          "ref": ">45",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.glucose.why",
          "why": "Normal (>45 mg/dL). Adequate for now, but must be trended in a febrile infant with poor intake. Glycogen stores can deplete rapidly."
        },
        {
          "id": "na",
          "name": "Na+",
          "value": "138",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.na.why",
          "why": "A normal sodium is reassuring against a significant electrolyte derangement as a seizure or altered-mental-status cause.\n\n- **Na 138** is mid-range and argues against hyponatremic or hypernatremic causes of irritability\n- Useful baseline before large-volume isotonic resuscitation shifts electrolytes\n- Normal sodium keeps the differential focused on infection rather than a primary metabolic derangement"
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "2.8",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.lactate.why",
          "why": "Mildly elevated. Lactate rises when tissues switch to anaerobic metabolism due to inadequate oxygen delivery. At 2.8, this suggests early tissue hypoperfusion. Trending this value is critical - a rising lactate confirms worsening shock."
        },
        {
          "id": "crp",
          "name": "CRP",
          "value": "8.4",
          "unit": "mg/dL",
          "ref": "<0.5",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.crp.why",
          "why": "Markedly elevated C-reactive protein. CRP is an acute-phase reactant produced by the liver in response to IL-6 from macrophages during infection. A value this high in a 6-month-old strongly suggests significant bacterial infection rather than a simple viral illness."
        },
        {
          "id": "bands",
          "name": "Bands",
          "value": "14%",
          "unit": "",
          "ref": "<5%",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.bands.why",
          "why": "Bandemia (elevated band neutrophils) indicates a left shift - the bone marrow is releasing immature neutrophils into circulation because mature neutrophil demand exceeds supply. This is a hallmark of acute bacterial infection and suggests the immune system is under significant stress."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 1,
      "id": "intervene",
      "stageType": "intervene",
      "title": "Escalation",
      "narrative": "Twenty minutes after antipyretic administration, the infant's temperature has decreased to 39.0 degrees Celsius. However, his clinical appearance has deteriorated noticeably. He is no longer tracking faces or reaching for objects and responds only sluggishly to tactile stimulation. His extremities are cool to the touch despite persistent core fever, and you observe a new reticular mottling pattern across both lower extremities that was not present on initial assessment. The charge nurse passes the bedside, pauses, and states that the infant does not look right. Your reassessment confirms a significant change from baseline.",
      "vitals": [
        {
          "id": "hr",
          "label": "HR",
          "value": "192",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.hr.why",
          "why": "Temp DOWN but HR UP. Dissociation = compensatory tachycardia for septic shock, not fever."
        },
        {
          "id": "rr",
          "label": "RR",
          "value": "52",
          "unit": "/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.rr.why",
          "why": "Compensatory tachypnea for metabolic acidosis from anaerobic metabolism."
        },
        {
          "id": "bp",
          "label": "BP",
          "value": "68/40",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.bp.why",
          "why": "Below normal. Hypotension is LATE. 25-30% volume lost. Decompensated shock."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "97",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.spo2.why",
          "why": "Deceptive. Saturation not delivery. Poor CO means inadequate O2 delivery."
        },
        {
          "id": "temp",
          "label": "Temp",
          "value": "39",
          "unit": "C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.temp.why",
          "why": null
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "4",
          "unit": "sec",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.cap.why",
          "why": "Prolonged. Intense vasoconstriction and tissue ischemia."
        }
      ],
      "signs": [
        {
          "id": "mottling",
          "label": "Mottling",
          "finding": "Reticular purplish pattern, bilateral lower extremities",
          "pos": "body",
          "sys": "Integumentary",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mottling.why",
          "why": "Mottling reflects severe peripheral vasoconstriction as the body shunts blood from skin and muscle to preserve perfusion of vital organs. The reticular pattern appears when capillaries alternate between constriction and dilation under sympathetic overdrive. In a septic infant this is a late and ominous sign of decompensated shock."
        },
        {
          "id": "pulses",
          "label": "Pulses",
          "finding": "Weak and thready peripherally, central palpable",
          "pos": "body",
          "sys": "Cardiovascular",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.pulses.why",
          "why": "Preserved central pulses with weak peripheral pulses is the hallmark of compensated-to-decompensated shock transition. Stroke volume is dropping; the body prioritizes brain and heart at the expense of extremities. Loss of central pulses is imminent arrest."
        },
        {
          "id": "mental-status",
          "label": "Mental status",
          "finding": "Sluggish to voice, not tracking faces",
          "pos": "head",
          "sys": "Neuro",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mental-status.why",
          "why": "Declining mental status is one of the most sensitive bedside markers that perfusion is failing — the brain is an early casualty of shock.\n\n- **Sluggish response and loss of face-tracking** signal cerebral hypoperfusion as autoregulation nears its limit\n- Mental-status change often precedes hypotension in children, who compensate BP until late\n- A formerly consolable infant who stops tracking is decompensating until proven otherwise"
        },
        {
          "id": "extremities",
          "label": "Extremities",
          "finding": "Cool and clammy hands and feet",
          "pos": "body",
          "sys": "Cardiovascular",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.extremities.why",
          "why": "Cool clammy extremities with a febrile core signals cold septic shock. The sympathetic nervous system clamps down peripheral vessels to redirect flow centrally. Capillary refill lengthens, skin feels cold distal to warm proximal - this gradient marks the perfusion boundary."
        },
        {
          "id": "abdomen",
          "label": "Abdomen",
          "finding": "Soft, hypoactive bowel sounds",
          "pos": "body",
          "sys": "GI",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.abdomen.why",
          "why": "A soft abdomen with hypoactive bowel sounds is the expected, non-surgical finding of shunted splanchnic perfusion.\n\n- **Hypoactive bowel sounds** reflect blood diverted away from the gut to vital organs in shock\n- A **soft, non-distended** abdomen argues against a surgical abdomen or obstruction as the source\n- This is a downstream sign of hypoperfusion, not a primary GI problem"
        },
        {
          "id": "urine-output",
          "label": "Urine output",
          "finding": "One concentrated diaper in six hours",
          "pos": "body",
          "sys": "Renal",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.urine-output.why",
          "why": "Oliguria is a hard endpoint of hypoperfusion — the kidney stops making urine when renal blood flow drops below the filtration threshold.\n\n- **One concentrated diaper in six hours** signals renal perfusion has fallen below the GFR threshold\n- Urine output is a real-time gauge of end-organ perfusion and a resuscitation target\n- Improving output after fluids is one of the clearest signs your resuscitation is working"
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "22.4",
          "unit": "K/uL",
          "ref": "6.0-17.5",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.wbc.why",
          "why": "Rising from 18.2 - the infection is progressing and the bone marrow is working harder. Worsening leukocytosis in sepsis correlates with increasing bacterial burden and inflammatory response."
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "5.8",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.lactate.why",
          "why": "Doubled from 2.8 to 5.8. Cells are starving for oxygen and generating lactate through anaerobic glycolysis. Above 4 mmol/L in pediatric sepsis is associated with significantly increased mortality and indicates severe tissue hypoperfusion requiring aggressive fluid resuscitation."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "48",
          "unit": "mg/dL",
          "ref": ">45",
          "bad": false,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.glucose.why",
          "why": "Borderline low and dropping from 72. Glycogen stores are depleting rapidly under the metabolic stress of sepsis. If this falls below 45, neuronal function fails and seizure risk skyrockets. Must be monitored closely and treated immediately if it drops further."
        },
        {
          "id": "na",
          "name": "Na+",
          "value": "136",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.na.why",
          "why": "Sodium remains normal — reassuring that the acidosis is driven by lactate, not a mixed electrolyte derangement.\n\n- **Na 136** stays within range as the metabolic picture worsens\n- A normal sodium keeps the anion-gap acidosis attributable to lactate from hypoperfusion\n- Watch it across large-volume resuscitation, which can shift sodium either direction"
        },
        {
          "id": "k",
          "name": "K+",
          "value": "4.2",
          "unit": "mEq/L",
          "ref": "3.5-5.5",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.k.why",
          "why": "Potassium is normal now, but acidosis and the coming resuscitation make it a value to watch closely.\n\n- **K 4.2** is mid-range despite the acidosis that would tend to push potassium out of cells\n- A normal-to-low K in acidosis hints at a real total-body deficit that fluids and correction can unmask\n- Recheck after resuscitation — potassium can drop as acidosis resolves and cells take it back up"
        },
        {
          "id": "ph",
          "name": "pH",
          "value": "7.24",
          "unit": "",
          "ref": "7.35-7.45",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.ph.why",
          "why": "Acidotic. The accumulating lactate from anaerobic metabolism is driving the pH down. A pH below 7.25 indicates severe metabolic acidosis. The body attempts to compensate by increasing respiratory rate (blowing off CO2), which is why this infant is tachypneic at 52/min."
        },
        {
          "id": "hco3",
          "name": "HCO3-",
          "value": "14",
          "unit": "mEq/L",
          "ref": "22-26",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.hco3.why",
          "why": "Low bicarbonate confirms metabolic acidosis. Bicarb is being consumed as it buffers the excess hydrogen ions from lactic acid production. The base deficit of -12 tells you how much bicarb has been used up."
        },
        {
          "id": "base-deficit",
          "name": "Base deficit",
          "value": "-12",
          "unit": "",
          "ref": "-2 to +2",
          "bad": false,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.base-deficit.why",
          "why": "Severely negative. Base deficit quantifies the total acid load the body is carrying. A value of -12 means the body has consumed 12 mEq/L of buffer capacity trying to neutralize the acid produced by poor perfusion. This correlates directly with the severity and duration of tissue oxygen debt."
        }
      ],
      "actions": {
        "tools": {
          "ivKit": {
            "id": "ivKit",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.ivKit.fb",
            "fb": "Essential. You need IV access for fluids and antibiotics. In a vasoconstricted infant, target saphenous or antecubital veins. Two attempts at peripheral access, then go IO at the proximal tibia (1-2 cm below tibial tuberosity, flat medial surface). IO provides equivalent flow rates to central access."
          },
          "stethoscope": {
            "id": "stethoscope",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.stethoscope.fb",
            "fb": "Auscultate before pushing fluid. Establish baseline: clear lungs (crackles suggest pneumonia or edema), regular rhythm (irregular rhythm changes approach), no murmur (new murmur raises endocarditis concern), no S3 gallop (volume overload marker). Re-auscultate lungs after each bolus for developing crackles."
          },
          "capRefill": {
            "id": "capRefill",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.capRefill.fb",
            "fb": "Best real-time perfusion tracker in pediatrics. Press nail bed 5 seconds, release, count. Currently 4 seconds (normal <2). After each 20 mL/kg bolus, recheck. Improvement toward 2-3 seconds = effective resuscitation. No improvement after 40-60 mL/kg = consider vasopressors or alternative etiology."
          },
          "glucometer": {
            "id": "glucometer",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.glucometer.fb",
            "fb": "Check immediately. A 6-month-old has only 3-4g hepatic glycogen (vs 70-100g adults). After 12 hours of illness with poor intake, stores may be depleted. Sepsis accelerates glucose consumption due to activated immune cell demand. Hypoglycemia <45 mg/dL causes seizures and brain injury. If low: D10W 2-4 mL/kg IV."
          },
          "thermometer": {
            "id": "thermometer",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.tools.thermometer.fb",
            "fb": "Temp is 39.0C and trending down from 39.2C. Rechecking provides no new information. The problem is cardiovascular collapse, not fever. Temperature management comes after ABCs are stabilized and resuscitation is underway."
          },
          "defib": {
            "id": "defib",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.tools.defib.fb",
            "fb": "You just shocked a baby in sinus tachycardia. The baby did not appreciate that. The rhythm is sinus tach - a normal compensatory response to sepsis. There is no shockable rhythm here. Defibrillation is for ventricular fibrillation or pulseless ventricular tachycardia only. Please put the paddles down and go give this child some fluid."
          }
        },
        "meds": {
          "nsBolus": {
            "id": "nsBolus",
            "priority": "tied-correct",
            "ok": true,
            "_slotRef": "phase[1].actions.meds.nsBolus.fb",
            "fb": "First-line intervention. Push 20 mL/kg (150 mL) of 0.9% NS via push-pull technique over 5 minutes. Sepsis causes vasodilation and capillary leak, depleting effective circulating volume. Crystalloid restores preload, increasing stroke volume via Frank-Starling mechanism. Reassess after each bolus. Repeat up to 60 mL/kg total. No improvement = fluid-refractory shock, start vasopressors."
          },
          "ceftriaxone": {
            "id": "ceftriaxone",
            "priority": "tied-correct",
            "ok": true,
            "_slotRef": "phase[1].actions.meds.ceftriaxone.fb",
            "fb": "Broad-spectrum antibiotics must begin within 60 minutes of recognizing sepsis. Ceftriaxone 50 mg/kg IV covers S. pneumoniae, N. meningitidis, E. coli, and H. influenzae. Binds penicillin-binding proteins, inhibiting peptidoglycan crosslinking, leading to bacterial cell wall rupture. Draw cultures first if quick (<5 min), but never delay antibiotics for cultures. Each hour of delay increases mortality 4-8%."
          },
          "acetaminophen": {
            "id": "acetaminophen",
            "priority": "distractor-clinical",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.acetaminophen.fb",
            "fb": "Already given 20 minutes ago and within therapeutic window. The tachycardia is NOT fever-driven anymore - HR-temp dissociation proves compensatory shock physiology. Fever itself is a beneficial immune response up to 39.5C (enhances neutrophil chemotaxis and antibody production). The cardiovascular collapse is the emergency, not the temperature."
          },
          "epiIV": {
            "id": "epiIV",
            "priority": "distractor-clinical",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.epiIV.fb",
            "fb": "Wrong timing. Epinephrine stimulates alpha-1, beta-1, and beta-2 receptors and IS appropriate for fluid-refractory septic shock. But no fluid has been given yet. Vasopressors on an empty vascular tree produces high SVR with dangerously low CO - BP number may transiently improve while tissue perfusion worsens. Algorithm: volume first (up to 60 mL/kg), then epi 0.05-0.3 mcg/kg/min if still hypotensive."
          },
          "albuterol": {
            "id": "albuterol",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.albuterol.fb",
            "fb": "No airway pathology present. Albuterol is a beta-2 agonist for bronchospasm. The tachypnea here is metabolic acidosis compensation - poor perfusion causes lactic acid buildup, stimulating central chemoreceptors to increase RR. Adding albuterol causes unnecessary tachycardia without addressing the perfusion deficit. Fix the volume and the tachypnea resolves."
          },
          "dextroseBolus": {
            "id": "dextroseBolus",
            "priority": "distractor-clinical",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.dextroseBolus.fb",
            "fb": "Check glucose FIRST, do not give empirically. If glucose is normal, empiric dextrose causes iatrogenic hyperglycemia. In sepsis, hyperglycemia worsens outcomes through osmotic diuresis, impaired neutrophil bactericidal function, and pro-inflammatory AGE production. Measure, then treat if <45 mg/dL."
          }
        }
      }
    }
  ],
  "curveball": {
    "name": "Seizure During Resuscitation",
    "narrative": "During active fluid resuscitation at approximately 90 mL into the first normal saline bolus, the infant abruptly develops generalized tonic-clonic seizure activity. Both upper and lower extremities exhibit rhythmic, synchronized flexion-extension movements with truncal rigidity. The SpO2 begins to fall rapidly on the monitor as the heart rate climbs. You observe perioral cyanosis developing and note that the infant is not generating effective respiratory effort between the tonic-clonic phases. The eyes are deviated upward and to the right. The respiratory therapist arrives with the crash cart and multiple team members converge at the bedside.",
    "vitals": [
      {
        "id": "hr",
        "label": "HR",
        "value": "210",
        "unit": "bpm",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.hr.why",
        "why": null
      },
      {
        "id": "rr",
        "label": "RR",
        "value": "8",
        "unit": "/min",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.rr.why",
        "why": null
      },
      {
        "id": "bp",
        "label": "BP",
        "value": "62/35",
        "unit": "mmHg",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.bp.why",
        "why": null
      },
      {
        "id": "spo2",
        "label": "SpO2",
        "value": "83",
        "unit": "%",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.spo2.why",
        "why": null
      },
      {
        "id": "temp",
        "label": "Temp",
        "value": "39",
        "unit": "C",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.temp.why",
        "why": null
      },
      {
        "id": "cap",
        "label": "Cap Refill",
        "value": "5",
        "unit": "sec",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.cap.why",
        "why": null
      }
    ],
    "signs": [
      {
        "id": "motor",
        "label": "Motor",
        "finding": "Generalized tonic-clonic activity, all extremities",
        "pos": "body",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.motor.why",
        "why": null
      },
      {
        "id": "cyanosis",
        "label": "Cyanosis",
        "finding": "Perioral and circumoral, dusky blue",
        "pos": "face",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.cyanosis.why",
        "why": null
      },
      {
        "id": "breathing",
        "label": "Breathing",
        "finding": "Apneic pauses between tonic-clonic phases",
        "pos": "body",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.breathing.why",
        "why": null
      },
      {
        "id": "eyes",
        "label": "Eyes",
        "finding": "Deviated upward and to the right, pupils dilated",
        "pos": "head",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.eyes.why",
        "why": null
      }
    ],
    "labs": [
      {
        "id": "glucose",
        "name": "Glucose",
        "value": "32",
        "unit": "mg/dL",
        "ref": ">45",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.glucose.why",
        "why": "Critically low. This is the most likely cause of the seizure. Glycogen stores are exhausted and the brain has lost its primary fuel source. Neurons cannot generate ATP, the Na/K pump fails, membranes depolarize, and seizure results. D10W 2-4 mL/kg is potentially curative."
      },
      {
        "id": "lactate",
        "name": "Lactate",
        "value": "8.1",
        "unit": "mmol/L",
        "ref": "0.5-2.0",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.lactate.why",
        "why": "Severely elevated from 5.8 - the seizure itself is generating massive lactate. Sustained muscle contraction during tonic-clonic activity is entirely anaerobic. Combined with the ongoing septic shock, tissue oxygen debt is now critical."
      },
      {
        "id": "ph",
        "name": "pH",
        "value": "7.18",
        "unit": "",
        "ref": "7.35-7.45",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.ph.why",
        "why": "Worsening acidosis. Both the seizure (lactic acid from muscle) and the shock (lactic acid from tissue hypoperfusion) are driving the pH down. Below 7.20, cardiac contractility begins to decline and catecholamines become less effective."
      },
      {
        "id": "po2",
        "name": "pO2",
        "value": "48",
        "unit": "mmHg",
        "ref": "80-100",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.po2.why",
        "why": "Severely hypoxic. Corresponds to the SpO2 of 83%. The infant is not ventilating effectively during the seizure because the respiratory muscles are contracting with everything else. The brain is seizing AND hypoxic simultaneously - a double insult."
      }
    ],
    "actions": {
      "tools": {
        "suction": {
          "id": "suction",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.suction.fb",
          "fb": "Protect the airway first. Seizing infant has lost gag, cough, and swallow reflexes. High aspiration risk from salivation and vomiting. Use Yankauer catheter for oropharyngeal suction. Avoid deep flexible catheter suctioning - stimulates vagus nerve, can trigger bradycardia."
        },
        "o2Mask": {
          "id": "o2Mask",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.o2Mask.fb",
          "fb": "SpO2 83% = PaO2 approximately 48 mmHg, severely hypoxic. Apply non-rebreather at 10-15 L/min (delivers 60-80% FiO2). The seizing brain has massively increased O2 demand while ventilation is impaired. Hypoxic brain injury begins within 4-6 minutes."
        },
        "bvmReady": {
          "id": "bvmReady",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.bvmReady.fb",
          "fb": "Have BVM staged at the bedside. Do NOT ventilate during the tonic phase when the glottis is contracted - bagging then drives air into the stomach. Be ready to deliver gentle breaths during clonic relaxation phases only if SpO2 falls further. Avoid over-bagging - causes gastric distension and increased aspiration risk."
        },
        "glucometer": {
          "id": "glucometer",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.glucometer.fb",
          "fb": "Check POC glucose immediately. Infant hepatic glycogen: 3-4g (adults: 70-100g). After 12 hours of illness, stores may be exhausted. Infant gluconeogenesis pathways are immature. If glucose <45 mg/dL, push D10W 2-4 mL/kg. Glucose correction alone may terminate the seizure."
        },
        "stethoscope": {
          "id": "stethoscope",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.tools.stethoscope.fb",
          "fb": "Cannot auscultate meaningfully during active tonic-clonic seizure. Muscle contraction artifact drowns out heart and lung sounds. Useful AFTER seizure control to assess for aspiration or arrhythmia. Not a priority right now."
        },
        "defib": {
          "id": "defib",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.tools.defib.fb",
          "fb": "HR 210 with narrow QRS = sinus tachycardia. Appropriate physiologic response to seizure, hypoxia, and catecholamine surge. Defibrillation is for VF or pulseless VT only. Shocking sinus tachycardia could induce an actual arrhythmia. Monitor pads are fine but do not charge."
        }
      },
      "meds": {
        "lorazepam": {
          "id": "lorazepam",
          "priority": "tied-correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.meds.lorazepam.fb",
          "fb": "First-line antiepileptic. 0.1 mg/kg IV (0.75 mg for this infant). Binds GABA-A receptor benzodiazepine site, increasing chloride channel opening frequency. Chloride influx hyperpolarizes the neuron from -70mV toward -90mV, suppressing the electrical storm. Onset 1-3 min IV. Alternative: midazolam 0.2 mg/kg IN or IM. Two failed doses = status epilepticus."
        },
        "fosphenytoin": {
          "id": "fosphenytoin",
          "priority": "distractor-clinical",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.fosphenytoin.fb",
          "fb": "Second-line only after two benzodiazepine doses fail. Fosphenytoin blocks voltage-gated sodium channels. Requires 20-minute infusion (rapid push causes hypotension and arrhythmia via His-Purkinje depression). Too slow for first-line use. Also: always check glucose before escalating antiepileptics - hypoglycemia-driven seizures will not respond to antiepileptics."
        },
        "dextroseBolus": {
          "id": "dextroseBolus",
          "priority": "tied-correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.meds.dextroseBolus.fb",
          "fb": "Give after checking glucose. If <45 mg/dL, push D10W 2-4 mL/kg (15-30 mL). Use D10W in infants, not D25 or D50 (hyperosmolar, causes venous endothelial damage and rebound hyperinsulinemia). Without glucose, neuronal ATP production stops, Na/K ATPase fails, membrane depolarizes uncontrollably. May terminate seizure within 1-2 minutes."
        },
        "epiIV": {
          "id": "epiIV",
          "priority": "distractor-clinical",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.epiIV.fb",
          "fb": "Harmful in this context. Beta-1 stimulation increases myocardial O2 demand (HR already 210). Alpha-1 increases afterload. CNS catecholamine stimulation lowers seizure threshold. Epinephrine also raises ICP. Indicated for pulseless arrest or fluid-refractory shock only. Neither applies here."
        },
        "nsBolus": {
          "id": "nsBolus",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.meds.nsBolus.fb",
          "fb": "Do NOT stop the bolus. The seizure was caused by sepsis (hypoglycemia, meningitis, or fever), not by normal saline. Septic shock is still present and requires ongoing volume resuscitation. Continue fluid while managing seizure simultaneously. Delegate tasks across the team."
        },
        "atropine": {
          "id": "atropine",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.atropine.fb",
          "fb": "Blocks M2 muscarinic receptors, increasing heart rate by removing vagal tone. Patient is already at 210 bpm. Pushing atropine could drive rate above 220, reducing diastolic filling time so severely that stroke volume drops and CO paradoxically falls. Indicated for symptomatic bradycardia only."
        }
      }
    },
    "teaches": [
      {
        "title": "Why Infants Seize in Sepsis",
        "content": "Seizures in septic infants arise from three converging mechanisms. First, hypoglycemia: infants store only 3-4 grams of hepatic glycogen compared to 70-100 grams in adults, and their glucose utilization rate is 4-6 mg/kg/min at baseline. Sepsis can double or triple this rate because activated neutrophils and macrophages are obligate glucose consumers, and the catecholamine surge of shock accelerates glycogenolysis. Once stores are exhausted, gluconeogenesis in infants is too immature to compensate (the key enzymes PEPCK and glucose-6-phosphatase are not yet fully expressed). The result is neuronal energy failure: without glucose, ATP production via glycolysis and the Krebs cycle halts, the Na/K ATPase pump fails, the membrane depolarizes uncontrollably, and a seizure initiates. Second, direct CNS infection: bacteria can cross the blood-brain barrier more easily in infants because the tight junctions between cerebral endothelial cells are less mature. Once bacteria enter the CSF, the inflammatory response (complement activation, cytokine release, neutrophil infiltration) causes cerebral edema, increased intracranial pressure, and cortical irritability leading to seizure. Third, fever itself: febrile seizures occur in 2-5% of neurologically normal children between 6 months and 5 years. The mechanism is not fully understood but likely involves temperature-sensitive ion channels (TRPV1 and TRPV4) that alter neuronal excitability when core temperature rises rapidly. In sepsis, never assume a seizure is a simple febrile seizure without ruling out hypoglycemia and meningitis first.",
        "tldr": "Infants seize in sepsis because of low glucose (tiny glycogen stores), bacteria crossing an immature blood-brain barrier, or fever. Always check glucose first."
      },
      {
        "title": "Glucose: The Forgotten Critical Value",
        "content": "The infant brain consumes approximately 60% of total body glucose production, compared to 25% in adults. This disproportionate demand exists because the infant brain is relatively larger (10-12% of body weight vs 2% in adults) and has a higher metabolic rate per gram of tissue due to active synaptogenesis and myelination. Unlike adult neurons, which can partially switch to ketone body oxidation during prolonged fasting, infant neurons have limited capacity to utilize alternative fuels in the acute setting because the enzymes for ketolysis (beta-hydroxybutyrate dehydrogenase and succinyl-CoA:3-oxoacid CoA transferase) are not yet fully upregulated. When serum glucose falls below 45 mg/dL, the immediate consequence is failure of the Na/K ATPase, which requires approximately 50% of neuronal ATP output to maintain the -70mV resting membrane potential. As the pump fails, sodium leaks in, the membrane depolarizes, voltage-gated calcium channels open, and intracellular calcium rises to toxic levels triggering both seizure activity and excitotoxic cell death through calpain and caspase activation. Treatment is D10W at 2-4 mL/kg IV push. D10 is used in infants rather than D25 or D50 because the higher-concentration solutions are hyperosmolar (D50 has an osmolality of approximately 2,525 mOsm/L) and cause direct endothelial injury, phlebitis, and tissue necrosis if extravasated. Always recheck glucose 15 minutes after correction to ensure adequacy, and consider starting a continuous dextrose infusion (glucose infusion rate of 6-8 mg/kg/min) if the underlying cause of hypoglycemia persists.",
        "tldr": "Infant brains use 60% of all glucose and cannot switch to backup fuels. Below 45 mg/dL, neurons lose power and seize. Treat with D10W (not D50 - too concentrated for small veins)."
      },
      {
        "title": "Parallel Crisis Management",
        "content": "The PICU frequently presents overlapping emergencies that require simultaneous management. The key principle is ABC prioritization with parallel task execution through team delegation. In this scenario, the infant has two concurrent life-threatening problems: septic shock requiring fluid resuscitation and antibiotics, and a generalized seizure requiring airway protection and antiepileptic therapy. Stopping the fluid bolus to manage the seizure would worsen the shock. Ignoring the seizure to continue the bolus would allow ongoing hypoxia and potential brain injury. The solution is parallel processing: one team member manages the airway (positioning, suction, oxygen delivery), another draws up and administers lorazepam, a third continues the fluid bolus and monitors the infusion pump, and the physician directs the overall resuscitation and makes prioritization decisions. Time-based protocols run simultaneously: the seizure protocol (benzodiazepine at time zero, repeat at 5 minutes, second-line agent at 10 minutes if refractory) and the sepsis bundle (blood cultures, antibiotics within 60 minutes, fluid resuscitation to perfusion targets). Effective communication tools include closed-loop communication (repeat-back of orders), time calls (announcing elapsed time since seizure onset), and designated role assignments at the start of the resuscitation.",
        "tldr": "When two emergencies happen at once, do not stop treating one to treat the other. Delegate tasks across the team and run both protocols in parallel."
      }
    ]
  },
  "reassessment": {
    "narrative": "Forty minutes after the first fluid bolus and the initiation of antibiotics, the infant's clinical trajectory has reversed. Heart rate has come down from 192 to 150, capillary refill is now less than 2 seconds, and the mottling on the lower extremities has resolved. He is tracking faces again and reaching for his pacifier. The mother, who was holding his hand during the resuscitation, notices him squeeze back.",
    "vitals": {
      "hr": 150,
      "rr": 36,
      "bp": "84/52",
      "spo2": 99,
      "temp": 38.1,
      "cap": 2
    },
    "signs": [
      {
        "label": "Perfusion",
        "finding": "Warm pink extremities, cap refill <2s",
        "pos": "body",
        "sys": "Cardiovascular"
      },
      {
        "label": "Mental status",
        "finding": "Tracking faces, reaching for pacifier",
        "pos": "head",
        "sys": "Neuro"
      },
      {
        "label": "Skin",
        "finding": "Mottling resolved, no new rash",
        "pos": "body",
        "sys": "Integumentary"
      }
    ]
  },
  "stabilizationSummary": "Aggressive isotonic fluid resuscitation restored circulating volume and tissue perfusion. Broad-spectrum antibiotics targeted the underlying bacterial source before cultures returned. Dextrose corrected hypoglycemia and protected cortical function while the metabolic acidosis resolved.",
  "debrief": {
    "summary": "You identified septic shock by recognizing HR-temperature dissociation, initiated resuscitation, and managed an unexpected seizure.",
    "keyTeaching": [
      "HR–temperature dissociation — temperature falling while heart rate climbs — is an early, reliable sign of septic shock in a febrile infant.",
      "Children defend blood pressure until late; capillary refill, skin perfusion, mental status, and urine output decline well before BP drops.",
      "Give broad-spectrum antibiotics within the first hour of recognizing sepsis — every hour of delay raises mortality.",
      "Fluids before vasopressors in septic shock, reassessing perfusion after each bolus rather than pushing a fixed volume.",
      "Always check glucose in a sick infant — tiny glycogen stores deplete fast, and hypoglycemia is a treatable cause of seizure."
    ],
    "physiologyDeepDive": [
      {
        "id": "hr-temperature-dissociation",
        "title": "HR-Temperature Dissociation",
        "_slotRef": "debrief.physiologyDeepDive.hr-temperature-dissociation.content",
        "content": "In infants, cardiac output is calculated as heart rate multiplied by stroke volume. Unlike older children and adults who can increase stroke volume by augmenting contractility and preload utilization, infants have a relatively fixed stroke volume because their immature myocardium contains fewer contractile elements (sarcomeres), has lower ventricular compliance, and operates near the top of its Frank-Starling curve at baseline. This means infants are fundamentally rate-dependent for cardiac output. During fever, the expected heart rate increase is approximately 10 beats per minute for each 1 degree Celsius above 37. This thermoregulatory tachycardia is driven by increased metabolic oxygen demand: fever raises the basal metabolic rate by roughly 10-13% per degree Celsius via accelerated enzymatic reactions, requiring proportionally more oxygen delivery. When an antipyretic is administered and the temperature decreases, you would expect the heart rate to decrease proportionally. If instead the temperature falls but the heart rate rises or remains disproportionately elevated, the tachycardia is no longer thermoregulatory. It is now driven by the sympathetic nervous system compensating for a different problem, most commonly hypovolemia or vasodilation from sepsis. The adrenal medulla releases epinephrine and norepinephrine in response to baroreceptor sensing of decreased arterial stretch (reduced circulating volume), which directly stimulates beta-1 adrenergic receptors on the sinoatrial node to increase firing rate. This HR-temperature dissociation is one of the earliest and most reliable clinical indicators of septic shock in febrile infants.\n\n**TL;DR:** Infant hearts depend on rate, not squeeze strength, for output. Fever raises HR predictably (~10 bpm per degree). If temp goes down but HR goes up, the tachycardia is from shock, not fever."
      },
      {
        "id": "why-children-maintain-bp-until-collapse",
        "title": "Why Children Maintain BP Until Collapse",
        "_slotRef": "debrief.physiologyDeepDive.why-children-maintain-bp-until-collapse.content",
        "content": "Pediatric patients have proportionally larger adrenal glands relative to body size compared to adults, and their sympathetic nervous system is highly reactive. When cardiac output falls from any cause (hypovolemia, sepsis, cardiogenic), baroreceptors in the carotid sinus and aortic arch detect reduced arterial wall stretch and trigger a massive sympathetic discharge. This produces intense peripheral vasoconstriction through alpha-1 adrenergic receptor activation on arteriolar smooth muscle, which increases systemic vascular resistance (SVR) and maintains mean arterial pressure (MAP = CO x SVR). Because MAP is maintained, the blood pressure reading on the monitor appears reassuringly normal even as tissue perfusion is deteriorating. The clinical signs that betray this compensated state are the perfusion markers: capillary refill time prolongs because arteriolar constriction throttles inflow to the capillary beds; skin becomes mottled as dermal blood flow becomes patchy; extremities cool as blood is shunted away from the periphery; mental status declines as cerebral autoregulation approaches its lower limit; and urine output falls as renal perfusion drops below the threshold for adequate glomerular filtration. These signs change well before blood pressure drops. When BP finally does fall, it indicates that the compensatory mechanisms have been exhausted. Catecholamine stores in the adrenal medulla are depleted, SVR can no longer be maintained, and the patient transitions abruptly from compensated to decompensated shock. In children this transition is often described as falling off a cliff because it is sudden rather than gradual. Hypotension in a child is a pre-arrest sign representing loss of approximately 25-30% of circulating blood volume.\n\n**TL;DR:** Kids vasoconstrict aggressively to maintain BP. Cap refill, skin color, and mental status change way before BP drops. When BP finally falls, they have lost 25-30% of their blood volume and are about to arrest."
      },
      {
        "id": "infant-glucose-vulnerability",
        "title": "Infant Glucose Vulnerability",
        "_slotRef": "debrief.physiologyDeepDive.infant-glucose-vulnerability.content",
        "content": "The metabolic vulnerability of infants to hypoglycemia stems from a fundamental mismatch between glucose demand and storage capacity. Hepatic glycogen in a full-term neonate is approximately 5% of liver weight, yielding roughly 3-4 grams of total glycogen storage. Adults store 70-100 grams. Meanwhile, the infant brain, which constitutes 10-12% of total body weight (versus 2% in adults), consumes approximately 60% of total glucose production through obligate aerobic glycolysis. Under normal fasting conditions, these glycogen stores provide approximately 4-8 hours of glucose supply at the basal utilization rate of 4-6 mg/kg/min. Any condition that increases metabolic demand (fever, sepsis, seizures, cold stress) or impairs intake (vomiting, NPO status) accelerates depletion. Sepsis is particularly dangerous because it simultaneously increases demand (activated immune cells consume glucose at high rates, and catecholamine-driven glycogenolysis rapidly exhausts stores) and impairs the compensatory gluconeogenic response (sepsis-associated hepatic dysfunction reduces the liver's ability to synthesize new glucose from lactate, amino acids, and glycerol). The immature expression of gluconeogenic enzymes (phosphoenolpyruvate carboxykinase, fructose-1,6-bisphosphatase, and glucose-6-phosphatase) further limits this backup pathway. When serum glucose falls below the critical threshold of 45 mg/dL, neuronal mitochondrial ATP production collapses. The Na/K ATPase pump, which consumes roughly half of all neuronal ATP, fails first. Sodium leaks into the cell, the membrane depolarizes, voltage-gated calcium channels open, and the resulting calcium influx triggers both seizure activity and excitotoxic cascades (calpain activation, mitochondrial membrane permeabilization, and caspase-mediated apoptosis). Treatment is D10W at 2-4 mL/kg IV push. D10 (100 mg/mL) is preferred over D25 or D50 in infants because higher-concentration dextrose solutions are hyperosmolar and cause endothelial damage, phlebitis, and tissue necrosis. The goal is a glucose delivery of 200-400 mg/kg, which typically raises serum glucose by 60-120 mg/dL.\n\n**TL;DR:** Babies have almost no glucose reserves (3-4g vs 70-100g in adults) and their brains consume most of it. Sepsis burns through it fast. Below 45 mg/dL = seizures. Check glucose on every sick infant."
      }
    ]
  }
};

export var SC2 = {
  "id": "vomiting-toddler",
  "source": "builtin",
  "schemaVersion": "5.4.1",
  "title": "Won't Stop Vomiting",
  "tier": 2,
  "icon": "🤢",
  "tagline": "2-year-old - Vomiting and Lethargy",
  "description": "A 2-year-old with 3 days of vomiting and diarrhea, increasingly lethargic.",
  "visuals": [],
  "patient": {
    "ageLabel": "2 years",
    "weightKg": 12,
    "sex": "Male",
    "cc": "Vomiting/diarrhea x 3 days, lethargy",
    "history": "Marcus has been sick for three days. Started with watery diarrhea, then vomiting everything including Pedialyte. His mom says he had one wet diaper in the last 12 hours and is sleeping way more than usual. No fever. Previously healthy, no medications."
  },
  "emsReport": "Private vehicle arrival. 2-year-old male with 3 days of vomiting and watery diarrhea, unable to tolerate oral rehydration. Mother reports one wet diaper in the past 24 hours (normally 6-7). No fever, no blood in stool, no sick contacts. Arrived limp and lethargic in mother's arms. No prehospital interventions.",
  "learnMore": "Pediatric dehydration severity is classified by percent volume loss: mild (3-5%), moderate (6-9%), and severe (>10%). Each category corresponds to a cluster of clinical findings - tachycardia and dry mucous membranes appear early, sunken fontanelle and skin tenting indicate moderate loss, and delayed cap refill with altered mental status signals severe depletion. Treatment is guided by this severity classification: oral rehydration for mild, IV bolus for moderate, and aggressive resuscitation for severe.",
  "norms": {
    "hr": [
      80,
      130
    ],
    "rr": [
      20,
      30
    ],
    "sbp": [
      80,
      100
    ],
    "dbp": [
      50,
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
      "phaseIndex": 0,
      "id": "assess",
      "stageType": "assess",
      "title": "Triage",
      "narrative": "You receive report on a two-year-old male named Marcus presenting with a three-day history of vomiting and watery diarrhea. His mother has attempted oral rehydration with Pedialyte but he has been unable to tolerate any oral intake. She reports only one wet diaper in the past 24 hours compared to his usual six to seven per day. He has no fever, no blood in the stool, and no known sick contacts. His weight on arrival is 12 kilograms. On initial assessment, the child is limp and lethargic in his mother's arms, opening his eyes briefly to voice but not reaching or engaging. His lips are dry and cracked, and the anterior fontanelle is visibly sunken.",
      "vitals": [
        {
          "id": "hr",
          "label": "HR",
          "value": "155",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.hr.why",
          "why": "Elevated for a 2-year-old (normal 80-130). Tachycardia is the earliest compensatory response to hypovolemia. Baroreceptors in the carotid sinus detect reduced stretch from low circulating volume and trigger sympathetic activation."
        },
        {
          "id": "rr",
          "label": "RR",
          "value": "30",
          "unit": "/min",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.rr.why",
          "why": "Normal for age (20-30). No respiratory compensation yet, which means metabolic acidosis is not yet severe enough to trigger Kussmaul breathing."
        },
        {
          "id": "bp",
          "label": "BP",
          "value": "88/58",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.bp.why",
          "why": "Normal for a 2-year-old (SBP 80-100). BP is being MAINTAINED despite volume loss. This is compensated shock - the child is vasoconstricting hard to keep perfusion pressure. The cap refill and mental status tell the real story."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "99",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.spo2.why",
          "why": "Normal. No respiratory compromise. Dehydration alone doesn't typically affect oxygenation unless severe enough to cause shock-related pulmonary changes."
        },
        {
          "id": "temp",
          "label": "Temp",
          "value": "36.8",
          "unit": "C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.temp.why",
          "why": "Normal. Afebrile gastroenteritis is common in viral etiologies (rotavirus, norovirus). The absence of fever does NOT make this less serious - the dehydration is the threat."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3",
          "unit": "sec",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.cap.why",
          "why": "At the upper limit of normal. In a child with clear dehydration, this is the first sign of impaired perfusion. Sympathetic vasoconstriction is already redirecting blood from the skin to vital organs."
        }
      ],
      "signs": [
        {
          "id": "skin-turgor",
          "label": "Skin turgor",
          "finding": "Tenting on abdomen, >2 seconds recoil",
          "pos": "body",
          "sys": "Integumentary",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.skin-turgor.why",
          "why": "Skin turgor reflects interstitial fluid volume. When you pinch well-hydrated skin it snaps back immediately because the dermis is plump with water. A tent that persists more than 2 seconds indicates at least 5-10% total body water loss. This is a late sign - meaningful tenting in a toddler usually means moderate to severe dehydration."
        },
        {
          "id": "fontanelle",
          "label": "Fontanelle",
          "finding": "Anterior fontanelle sunken",
          "pos": "head",
          "sys": "Neuro",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.fontanelle.why",
          "why": "A sunken anterior fontanelle indicates reduced intracranial CSF volume, which tracks with systemic dehydration. At this age the fontanelle is a direct window into volume status that you lose access to once it closes (typically 12-18 months). A sunken fontanelle suggests at least 5% dehydration, often more."
        },
        {
          "id": "mucous-membranes",
          "label": "Mucous membranes",
          "finding": "Dry, tacky lips and tongue",
          "pos": "face",
          "sys": "GI/Hydration",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.mucous-membranes.why",
          "why": "Dry, tacky lips and tongue are an early, reproducible bedside marker of dehydration — a finding to flag.\n\n- **Mucous membranes** dry out as total body water falls; tacky-to-dry tracks with roughly 5% or more fluid deficit\n- Combined with a sunken fontanelle and tenting skin, this places the child in at least moderate dehydration\n- It is one of the most reliable exam findings for estimating volume loss in a toddler"
        },
        {
          "id": "behavior",
          "label": "Behavior",
          "finding": "Lethargic, arousable to voice briefly",
          "pos": "head",
          "sys": "Neuro",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.behavior.why",
          "why": "Lethargy that only briefly arouses to voice is an abnormal mental status — an end-organ effect of failing perfusion, not a tired child.\n\n- **Altered mental status** in dehydration reflects reduced cerebral perfusion as circulating volume drops\n- A previously active toddler who won't engage or reach is showing decompensation, not fatigue\n- Declining responsiveness is a marker that prompt resuscitation is needed"
        }
      ],
      "labs": [
        {
          "id": "na",
          "name": "Na+",
          "value": "134",
          "unit": "mEq/L",
          "ref": "133-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.na.why",
          "why": "Sodium sits just below the reference but is essentially isotonic — not the priority derangement in this child.\n\n- **Na 134** reflects mild, expected change in acute gastroenteritis and needs no separate urgent correction\n- It keeps this an **isotonic** dehydration, so standard isotonic fluid resuscitation is appropriate\n- The dangerous electrolytes here are the **potassium** and **chloride**, not the sodium"
        },
        {
          "id": "k",
          "name": "K+",
          "value": "2.9",
          "unit": "mEq/L",
          "ref": "3.5-5.5",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.k.why",
          "why": "Low from GI losses. Gastric fluid contains potassium, and the kidneys worsen it by excreting K+ to retain H+ during alkalosis. Below 3.0, ECG changes begin (flattened T waves, U waves). Below 2.5, arrhythmia risk is high."
        },
        {
          "id": "cl",
          "name": "Cl-",
          "value": "88",
          "unit": "mEq/L",
          "ref": "98-106",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.cl.why",
          "why": "Low from loss of gastric HCl. Hypochloremia triggers the kidneys to retain bicarbonate (because Cl- and HCO3- are exchanged in the renal tubule), worsening the metabolic alkalosis."
        },
        {
          "id": "co2",
          "name": "CO2",
          "value": "30",
          "unit": "mEq/L",
          "ref": "20-28",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.co2.why",
          "why": "Elevated total CO2 (bicarbonate) confirms metabolic alkalosis. The body is retaining bicarb to compensate for the massive H+ losses from vomiting. This alkalosis drives further potassium wasting through the kidney."
        },
        {
          "id": "bun",
          "name": "BUN",
          "value": "32",
          "unit": "mg/dL",
          "ref": "5-18",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.bun.why",
          "why": "Elevated BUN with BUN/Cr ratio >20 indicates pre-renal azotemia. Reduced kidney perfusion from dehydration causes increased urea reabsorption in the proximal tubule. The kidneys are not damaged - they are underperfused."
        },
        {
          "id": "cr",
          "name": "Cr",
          "value": "0.5",
          "unit": "mg/dL",
          "ref": "0.2-0.4",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.cr.why",
          "why": "Mildly elevated for a 2-year-old. GFR is declining from reduced renal blood flow. This is still pre-renal but approaching the threshold where acute kidney injury may develop if perfusion is not restored."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "68",
          "unit": "mg/dL",
          "ref": "60-100",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.glucose.why",
          "why": "Glucose is normal now, but in a vomiting toddler it's a value to recheck rather than forget.\n\n- **Glucose 68** is within range, so hypoglycemia isn't yet contributing to the lethargy\n- A 2-year-old's glycogen stores deplete within ~12–16 hours of poor intake, so this can fall quickly\n- It is already trending down by the next draw — recheck with any change in mental status"
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "3.2",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.lactate.why",
          "why": "Mildly elevated. Tissue perfusion is compromised enough that some cells are switching to anaerobic metabolism. This confirms the cap refill and mental status findings - this child is in compensated shock."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 1,
      "id": "intervene",
      "stageType": "intervene",
      "title": "Escalation",
      "narrative": "Peripheral IV access was obtained on the second attempt due to poor venous filling from dehydration. Twenty minutes into admission, your reassessment reveals clinical deterioration. The child's hands and feet are now cold to the touch with a capillary refill time exceeding five seconds. You observe mottling extending from the knees distally in a reticular pattern. He responds only to painful stimulation with a weak grimace and withdrawal. His eyes are open but unfocused with no purposeful gaze. This represents a significant decline from his arrival status and suggests progression from compensated to decompensated hypovolemic shock.",
      "vitals": [
        {
          "id": "hr",
          "label": "HR",
          "value": "172",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.hr.why",
          "why": "Worsening tachycardia. Heart rate is climbing as the sympathetic system works harder. The child is losing the ability to compensate. Stroke volume is falling, so rate must increase further to maintain CO."
        },
        {
          "id": "rr",
          "label": "RR",
          "value": "38",
          "unit": "/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.rr.why",
          "why": "Now elevated (normal 20-30). Tachypnea is compensating for developing metabolic acidosis. Poor tissue perfusion causes lactic acid accumulation. The respiratory center increases rate to blow off CO2 and buffer the acidosis."
        },
        {
          "id": "bp",
          "label": "BP",
          "value": "82/56",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.bp.why",
          "why": "Dropping. Still technically borderline normal, but trending DOWN. In a child who was 88 systolic, a drop to 82 is significant. Pediatric compensatory mechanisms are starting to fail. This is the transition from compensated to decompensated shock."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "98",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.spo2.why",
          "why": "Still maintained. But remember: SpO2 tells you about lung function, not tissue perfusion. This child's tissues are starving despite adequate oxygenation."
        },
        {
          "id": "temp",
          "label": "Temp",
          "value": "36.6",
          "unit": "C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.temp.why",
          "why": null
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "5",
          "unit": "sec",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.cap.why",
          "why": "Significantly prolonged. Severe peripheral vasoconstriction. The microcirculation is shutting down. Lactate is building. Without fluid resuscitation, this child will hit the cliff - sudden cardiovascular collapse."
        }
      ],
      "signs": [
        {
          "id": "mottling",
          "label": "Mottling",
          "finding": "Reticular pattern, knees and elbows bilaterally",
          "pos": "body",
          "sys": "Integumentary",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mottling.why",
          "why": "Reticular mottling at the knees and elbows marks the perfusion boundary - proximal skin is still being perfused while distal skin is not. As shock progresses this boundary migrates centrally. When mottling reaches mid-thigh, cardiac arrest is often minutes away."
        },
        {
          "id": "urine-output",
          "label": "Urine output",
          "finding": "No urine output in 14 hours",
          "pos": "body",
          "sys": "Renal",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.urine-output.why",
          "why": "Anuria in a child with a fluid deficit reflects renin-angiotensin activation preserving plasma volume at the cost of renal output. GFR drops as renal arterioles constrict. Prolonged hypoperfusion converts pre-renal azotemia into acute tubular necrosis - reversible now, but not indefinitely."
        },
        {
          "id": "mental-status",
          "label": "Mental status",
          "finding": "Responds to pain only, weak grimace",
          "pos": "head",
          "sys": "Neuro",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mental-status.why",
          "why": "AVPU status of P (pain) in a previously alert child signals inadequate cerebral perfusion. The brain autoregulates until MAP drops below about 50 mmHg in a toddler. Once that threshold fails, consciousness deteriorates rapidly. This is a trajectory marker for imminent decompensation."
        },
        {
          "id": "extremities",
          "label": "Extremities",
          "finding": "Cool, clammy, pale",
          "pos": "body",
          "sys": "Cardiovascular",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.extremities.why",
          "why": "Cool, clammy, pale extremities mark the peripheral vasoconstriction of worsening shock — blood shunted centrally.\n\n- **Cool, clammy skin** reflects sympathetic clamp-down on peripheral vessels to defend core perfusion\n- Pallor and a cool gradient moving proximally track with falling cardiac output\n- Paired with a 5-second cap refill and mottling, this is decompensated, not compensated, shock"
        }
      ],
      "labs": [
        {
          "id": "k",
          "name": "K+",
          "value": "2.1",
          "unit": "mEq/L",
          "ref": "3.5-5.5",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.k.why",
          "why": "Critically low and worsening. At this level, the cardiac myocyte resting membrane potential is destabilized. The cell becomes hyperexcitable and prone to spontaneous depolarization, creating the substrate for ventricular tachycardia and torsades de pointes."
        },
        {
          "id": "cl",
          "name": "Cl-",
          "value": "82",
          "unit": "mEq/L",
          "ref": "98-106",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.cl.why",
          "why": "Worsening hypochloremia. Ongoing gastric losses continue to deplete chloride. The kidney cannot correct the alkalosis without adequate chloride for exchange in the collecting duct."
        },
        {
          "id": "co2",
          "name": "CO2",
          "value": "34",
          "unit": "mEq/L",
          "ref": "20-28",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.co2.why",
          "why": "Worsening alkalosis. Bicarb continues to climb as H+ losses continue. The alkalosis itself drives further K+ wasting - a vicious cycle that will continue until volume and chloride are replaced."
        },
        {
          "id": "bun",
          "name": "BUN",
          "value": "38",
          "unit": "mg/dL",
          "ref": "5-18",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.bun.why",
          "why": "Rising from 32. Renal perfusion is declining further as the child progresses from compensated to decompensated shock. Without fluid resuscitation, acute kidney injury will follow."
        },
        {
          "id": "cr",
          "name": "Cr",
          "value": "0.7",
          "unit": "mg/dL",
          "ref": "0.2-0.4",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.cr.why",
          "why": "Now clearly elevated. The kidneys are being injured by sustained hypoperfusion. Oliguria (no urine in 14 hours) confirms inadequate renal blood flow."
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "6.4",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.lactate.why",
          "why": "Doubled from 3.2. The child is transitioning from compensated to decompensated shock. Tissue oxygen debt is accumulating rapidly. Above 4 in pediatric shock correlates with significantly increased mortality."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "54",
          "unit": "mg/dL",
          "ref": "60-100",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.glucose.why",
          "why": "Dropping. Glycogen stores are depleting from prolonged fasting and metabolic stress. Approaching the threshold where neuronal function may be impaired. Needs monitoring and likely dextrose supplementation."
        },
        {
          "id": "mg2",
          "name": "Mg2+",
          "value": "1.4",
          "unit": "mg/dL",
          "ref": "1.7-2.2",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.mg2.why",
          "why": "Low magnesium accompanies prolonged vomiting. Magnesium depletion makes it harder to correct potassium because Mg2+ is required for the Na/K ATPase pump to retain potassium intracellularly. Must replace Mg2+ to effectively correct K+."
        }
      ],
      "actions": {
        "tools": {
          "ivKit": {
            "id": "ivKit",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.ivKit.fb",
            "fb": "Confirm and secure IV access. May need a second line. If this child decompensates, you need reliable access for fluids and emergency meds. Consider IO if peripheral access is failing - dehydrated toddlers have collapsed veins."
          },
          "stethoscope": {
            "id": "stethoscope",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.stethoscope.fb",
            "fb": "Auscultate before and after each bolus. Listen for gallop (S3 = volume overload), crackles (pulmonary edema from over-resuscitation). Also establishes if bowel sounds are present - ileus from hypokalemia is possible with prolonged vomiting."
          },
          "capRefill": {
            "id": "capRefill",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.capRefill.fb",
            "fb": "Your best real-time perfusion marker. Check after each 20 mL/kg bolus. Improvement from 5s toward 2-3s indicates effective volume resuscitation. No improvement after 40-60 mL/kg suggests either ongoing losses or a different etiology."
          },
          "glucometer": {
            "id": "glucometer",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.tools.glucometer.fb",
            "fb": "Check immediately. Toddlers with 3 days of vomiting and poor intake are at HIGH risk for hypoglycemia. Hepatic glycogen stores in a 2-year-old deplete within 12-16 hours of fasting. Hypoglycemia causes altered mental status and can mimic septic shock."
          },
          "thermometer": {
            "id": "thermometer",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.tools.thermometer.fb",
            "fb": "Temperature is normal and stable. This child's problem is volume depletion, not infection. Rechecking temp doesn't change your immediate management - you need fluid resuscitation."
          },
          "defib": {
            "id": "defib",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.tools.defib.fb",
            "fb": "Whoa there. This toddler is in sinus tachycardia from dehydration. You just defibrillated a child who needed a glass of water. The rhythm is a normal compensatory response to hypovolemia. Defibrillation is for VF or pulseless VT. This child has a pulse and an organized rhythm. Step away from the defibrillator and go hang a bag of saline."
          }
        },
        "meds": {
          "nsBolus": {
            "id": "nsBolus",
            "priority": "tied-correct",
            "ok": true,
            "_slotRef": "phase[1].actions.meds.nsBolus.fb",
            "fb": "First-line. Push 20 mL/kg (240 mL for 12 kg) normal saline over 5-10 minutes. Reassess perfusion markers after each bolus. May need 40-60 mL/kg total. Isotonic crystalloid replaces intravascular volume and improves preload, stroke volume, and cardiac output."
          },
          "dextroseBolus": {
            "id": "dextroseBolus",
            "priority": "correct",
            "ok": true,
            "_slotRef": "phase[1].actions.meds.dextroseBolus.fb",
            "fb": "Indicated — glucose is 54 mg/dL, below the 60 mg/dL treatment threshold outside the neonatal period. Give D25W 2 mL/kg (or D10W 5 mL/kg) IV. Three days of vomiting with poor intake exhausts a toddler's hepatic glycogen within 12–16 hours, and hypoglycemia worsens both mental status and myocardial function on top of the shock. Volume resuscitation stays the first priority, but the low glucose needs correcting alongside it — don't leave it on the chart."
          },
          "acetaminophen": {
            "id": "acetaminophen",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.acetaminophen.fb",
            "fb": "Not indicated. Temperature is 36.6C - normal. There is no fever to treat. Giving acetaminophen to a dehydrated child with no fever adds no benefit and creates a false sense of action. Focus on volume."
          },
          "epiIV": {
            "id": "epiIV",
            "priority": "distractor-clinical",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.epiIV.fb",
            "fb": "Premature. This is hypovolemic shock, not distributive. The treatment is volume replacement, not vasopressors. Epinephrine in an empty vascular system just squeezes harder on nothing. Fill the tank first."
          },
          "albuterol": {
            "id": "albuterol",
            "priority": "distractor-misc",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.albuterol.fb",
            "fb": "No respiratory pathology here. The tachypnea is metabolic compensation for lactic acidosis, not bronchospasm. Albuterol would add tachycardia without addressing the underlying volume deficit."
          },
          "ceftriaxone": {
            "id": "ceftriaxone",
            "priority": "distractor-clinical",
            "ok": false,
            "_slotRef": "phase[1].actions.meds.ceftriaxone.fb",
            "fb": "No evidence of infection. Afebrile, no localizing signs, clear history of viral gastroenteritis. Antibiotics are for septic shock, not hypovolemic shock from GI losses. Unnecessary antibiotics add risk without benefit."
          }
        }
      }
    }
  ],
  "curveball": {
    "name": "Wide-Complex Tachycardia",
    "narrative": "Near the completion of the first 20 mL/kg normal saline bolus, the cardiac monitor alarm activates with a rhythm change. The previously narrow-complex sinus tachycardia has been replaced by a wide-complex tachycardia at a rate of 220 beats per minute. The QRS morphology is broad and bizarre with no discernible P waves. The child's skin color rapidly transitions from pale to ashen gray and he becomes unresponsive. The clinical picture is consistent with ventricular tachycardia, and given the three-day history of persistent vomiting, the most likely etiology is a hypokalemia-driven arrhythmia secondary to ongoing gastrointestinal electrolyte losses.",
    "vitals": [
      {
        "id": "hr",
        "label": "HR",
        "value": "220",
        "unit": "bpm",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.hr.why",
        "why": null
      },
      {
        "id": "rr",
        "label": "RR",
        "value": "42",
        "unit": "/min",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.rr.why",
        "why": null
      },
      {
        "id": "bp",
        "label": "BP",
        "value": "64/38",
        "unit": "mmHg",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.bp.why",
        "why": null
      },
      {
        "id": "spo2",
        "label": "SpO2",
        "value": "94",
        "unit": "%",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.spo2.why",
        "why": null
      },
      {
        "id": "temp",
        "label": "Temp",
        "value": "36.6",
        "unit": "C",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.temp.why",
        "why": null
      },
      {
        "id": "cap",
        "label": "Cap Refill",
        "value": "6",
        "unit": "sec",
        "bad": false,
        "cat": "vital",
        "_slotRef": "phase[curveball].vitals.cap.why",
        "why": null
      }
    ],
    "signs": [
      {
        "id": "rhythm",
        "label": "Rhythm",
        "finding": "Wide-complex tachycardia at 220 bpm, QRS >0.09s, no P waves",
        "pos": "body",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.rhythm.why",
        "why": null
      },
      {
        "id": "perfusion",
        "label": "Perfusion",
        "finding": "Pale, diaphoretic, thready pulses",
        "pos": "body",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.perfusion.why",
        "why": null
      },
      {
        "id": "mental-status",
        "label": "Mental status",
        "finding": "Eyes rolling back, barely responsive",
        "pos": "head",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.mental-status.why",
        "why": null
      },
      {
        "id": "color",
        "label": "Color",
        "finding": "Ashen gray",
        "pos": "face",
        "bad": false,
        "cat": "clinical",
        "_slotRef": "phase[curveball].signs.color.why",
        "why": null
      }
    ],
    "labs": [
      {
        "id": "k",
        "name": "K+",
        "value": "1.8",
        "unit": "mEq/L",
        "ref": "3.5-5.5",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.k.why",
        "why": "Critically low - this is the cause of the arrhythmia. At K+ 1.8, the myocyte resting membrane potential has shifted from -90mV toward -70mV. The cell is partially depolarized and hyperexcitable, generating the wide-complex tachycardia you see on the monitor."
      },
      {
        "id": "mg2",
        "name": "Mg2+",
        "value": "1.2",
        "unit": "mg/dL",
        "ref": "1.7-2.2",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.mg2.why",
        "why": "Low magnesium makes the arrhythmia harder to treat. Mg2+ stabilizes the cardiac membrane independent of K+ levels. IV magnesium 25-50 mg/kg should be given alongside potassium replacement."
      },
      {
        "id": "ica2",
        "name": "iCa2+",
        "value": "0.98",
        "unit": "mmol/L",
        "ref": "1.12-1.32",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.ica2.why",
        "why": "Low ionized calcium from the alkalosis. Alkalemia increases protein binding of calcium, reducing the free (ionized) fraction. Low iCa2+ further destabilizes cardiac conduction and can prolong the QT interval."
      },
      {
        "id": "ph",
        "name": "pH",
        "value": "7.52",
        "unit": "",
        "ref": "7.35-7.45",
        "bad": true,
        "critical": true,
        "cat": "lab",
        "_slotRef": "phase[curveball].labs.ph.why",
        "why": "Significantly alkalotic from ongoing gastric H+ losses. The alkalosis is driving the hypokalemia (kidneys waste K+ to retain H+) and the hypocalcemia (alkalemia increases Ca2+ protein binding). Fixing the pH helps fix the electrolytes."
      }
    ],
    "actions": {
      "tools": {
        "stethoscope": {
          "id": "stethoscope",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.stethoscope.fb",
          "fb": "Auscultate quickly to confirm rate and rhythm. In wide-complex tachycardia, you're listening for whether beats are regular (VT, SVT with aberrancy) or irregular (polymorphic VT/torsades). Also check for cannon A waves in the neck veins - present in VT due to AV dissociation."
        },
        "defib": {
          "id": "defib",
          "priority": "tied-correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.defib.fb",
          "fb": "CRITICAL. Get the defibrillator pads ON immediately. If this child becomes pulseless or hemodynamically unstable (which they are), synchronized cardioversion at 0.5-1 J/kg is first-line for unstable wide-complex tachycardia. You must be ready. In peds, the sequence is: unstable + wide complex = synchronized cardioversion first."
        },
        "glucometer": {
          "id": "glucometer",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.glucometer.fb",
          "fb": "Quick check. Hypoglycemia can worsen any cardiac arrhythmia and this child has been vomiting for 3 days. Low glucose exacerbates myocardial dysfunction."
        },
        "ivKit": {
          "id": "ivKit",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.tools.ivKit.fb",
          "fb": "Confirm IV access is patent. You may need to push medications or give volume. If IV was positional or infiltrated, you need working access NOW before cardioversion or drug administration."
        },
        "capRefill": {
          "id": "capRefill",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.tools.capRefill.fb",
          "fb": "You already know perfusion is terrible - the child is gray and unresponsive. Cap refill confirms what you can see. Don't delay treatment to do an assessment you don't need right now. Act."
        },
        "thermometer": {
          "id": "thermometer",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.tools.thermometer.fb",
          "fb": "Temperature is irrelevant in an acute arrhythmia emergency. This child needs rhythm correction, not temperature monitoring. Every second counts."
        }
      },
      "meds": {
        "adenosine": {
          "id": "adenosine",
          "priority": "distractor-clinical",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.adenosine.fb",
          "fb": "DANGEROUS in this context. Adenosine is for NARROW-complex SVT, not wide-complex tachycardia. If this is ventricular tachycardia (which it likely is in a hypokalemic child), adenosine will not convert it and may worsen hemodynamic collapse. Additionally, if this is torsades de pointes from hypokalemia, adenosine is contraindicated. The correct treatment is to FIX THE POTASSIUM and cardiovert if unstable."
        },
        "epiIV": {
          "id": "epiIV",
          "priority": "distractor-clinical",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.epiIV.fb",
          "fb": "Not first-line for wide-complex tachycardia with a pulse. Epinephrine increases myocardial oxygen demand, raises heart rate further, and can trigger VF in an already irritable myocardium. It's indicated for pulseless arrest, not organized tachyarrhythmia. If this child goes pulseless, then epi enters the algorithm."
        },
        "nsBolus": {
          "id": "nsBolus",
          "priority": "correct",
          "ok": true,
          "_slotRef": "phase[curveball].actions.meds.nsBolus.fb",
          "fb": "Appropriate as a temporizing measure. This child is hypovolemic AND arrhythmic. Volume helps maintain preload during the arrhythmia. But the DEFINITIVE treatment is correcting the rhythm and the underlying electrolyte abnormality. Fluid alone won't fix a potassium of 2.0."
        },
        "lorazepam": {
          "id": "lorazepam",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.lorazepam.fb",
          "fb": "Not indicated for arrhythmia. Benzodiazepines are for seizures or procedural sedation. If you need to cardiovert, you WILL need sedation (etomidate or ketamine preferred), but lorazepam alone does nothing for the rhythm."
        },
        "atropine": {
          "id": "atropine",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.atropine.fb",
          "fb": "Atropine increases heart rate by blocking vagal tone. This child's rate is ALREADY 220. Pushing atropine would be like adding fuel to a fire. Atropine is for symptomatic bradycardia, the opposite of this situation."
        },
        "albuterol": {
          "id": "albuterol",
          "priority": "distractor-misc",
          "ok": false,
          "_slotRef": "phase[curveball].actions.meds.albuterol.fb",
          "fb": "No respiratory indication. The tachypnea is from poor cardiac output and acidosis. Albuterol is a beta-agonist that would further stimulate the already irritable myocardium and potentially worsen the arrhythmia."
        }
      }
    },
    "teaches": [
      {
        "title": "Vomiting and Electrolyte Derangement",
        "content": "Prolonged vomiting causes loss of H+ and Cl- from gastric secretions, producing hypochloremic, hypokalemic metabolic alkalosis. The kidneys compensate by excreting K+ and retaining H+, worsening hypokalemia. When serum K+ drops below 2.5-3.0 mEq/L, the cardiac myocyte resting membrane potential becomes less negative (partially depolarized), making the cell hyperexcitable. This predisposes to ventricular arrhythmias including VT and torsades de pointes.",
        "tldr": "Vomiting loses stomach acid (H+ and Cl-), which drags potassium down with it. Low potassium makes heart cells electrically unstable and prone to dangerous arrhythmias."
      },
      {
        "title": "SVT vs VT in Pediatrics",
        "content": "Differentiating SVT from VT: SVT typically shows narrow QRS (< 0.09s), regular rate, and may have P waves buried in T waves. VT shows wide QRS (> 0.09s), may be slightly irregular, often has AV dissociation. In pediatrics, VT is less common than SVT but more dangerous. KEY RULE: any wide-complex tachycardia in a sick, hemodynamically unstable child should be treated as VT until proven otherwise. History matters - vomiting + dehydration + wide complex screams electrolyte-driven VT.",
        "tldr": "Narrow QRS = probably SVT. Wide QRS = treat as VT until proven otherwise. In a sick kid with vomiting, wide complex almost certainly means electrolyte-driven VT."
      },
      {
        "title": "Root Cause Thinking",
        "content": "Don't just chase the rhythm on the monitor. Ask WHY the rhythm changed. This child had 3 days of vomiting causing hypokalemia. The arrhythmia is a SYMPTOM of the electrolyte problem, not the primary disease. Cardioversion may convert the rhythm temporarily, but it will recur unless you fix the potassium. Always look for and treat the root cause: check a BMP/electrolytes, replace K+ aggressively (0.5-1 mEq/kg IV over 1 hour with cardiac monitoring), and give magnesium (which stabilizes the cardiac membrane).",
        "tldr": "The arrhythmia is a symptom, not the disease. Fix the potassium that caused it or the rhythm will keep coming back no matter how many times you shock."
      }
    ]
  },
  "reassessment": {
    "narrative": "After two 20 mL/kg boluses and potassium replacement, the child's perfusion and mental status have returned. Heart rate is down to 130, cap refill is 2 seconds, and his hands are warm to the touch. He has produced a small amount of concentrated urine, signaling that renal blood flow is recovering. He opens his eyes to voice and reaches for his mother's necklace.",
    "vitals": {
      "hr": 130,
      "rr": 26,
      "bp": "94/60",
      "spo2": 99,
      "temp": 36.9,
      "cap": 2
    },
    "signs": [
      {
        "label": "Perfusion",
        "finding": "Warm extremities, cap refill 2s",
        "pos": "body",
        "sys": "Cardiovascular"
      },
      {
        "label": "Urine",
        "finding": "Small concentrated void noted",
        "pos": "body",
        "sys": "Renal"
      },
      {
        "label": "Mental status",
        "finding": "Alert, reaching for mother",
        "pos": "head",
        "sys": "Neuro"
      }
    ]
  },
  "stabilizationSummary": "Repeated normal saline boluses restored circulating volume and reversed compensated hypovolemic shock. Potassium and magnesium replacement corrected the electrolyte derangement that triggered the arrhythmia, eliminating recurrence risk. Early recognition of the vomiting-hypokalemia-VT chain prevented the scenario from becoming a cardiac arrest.",
  "debrief": {
    "summary": "You recognized compensated hypovolemic shock in a dehydrated toddler, initiated fluid resuscitation, and identified a wide-complex tachycardia caused by electrolyte derangement from prolonged vomiting. Root cause thinking - connecting the vomiting to hypokalemia to arrhythmia - was the critical skill tested.",
    "keyTeaching": [
      "In a child, blood pressure stays normal until late — read perfusion (cap refill, skin, mental status, urine output) and the lab trends, not the BP, to catch compensated shock.",
      "Prolonged vomiting loses H⁺, Cl⁻, and K⁺, producing a hypochloremic, hypokalemic metabolic alkalosis — and the kidney worsens the hypokalemia trying to retain H⁺.",
      "Isotonic fluid boluses (20 mL/kg, reassess, repeat) are first-line for hypovolemic shock from GI losses.",
      "Hypokalemia partially depolarizes cardiac cells and can drive ventricular tachycardia — replace potassium AND magnesium, and keep the child on a monitor.",
      "Treat the root cause, not the monitor: an electrolyte-driven arrhythmia recurs after cardioversion unless the potassium is corrected."
    ],
    "physiologyDeepDive": [
      {
        "id": "the-pediatric-shock-cliff",
        "title": "The Pediatric Shock Cliff",
        "_slotRef": "debrief.physiologyDeepDive.the-pediatric-shock-cliff.content",
        "content": "Unlike adults who gradually decompensate, children have a binary-like transition. Their massive sympathetic reserve maintains perfusion until suddenly it doesn't. When catecholamine stores deplete and SVR collapses, BP crashes precipitously. Cap refill going from 3s to 5s is the warning. The next step is cardiovascular collapse with bradycardia - a pre-arrest rhythm in a child who was tachycardic.\n\n**TL;DR:** Kids compensate hard then crash suddenly. Worsening cap refill is the warning sign. Bradycardia in a previously tachycardic child means arrest is imminent."
      },
      {
        "id": "vomiting-induced-metabolic-cascade",
        "title": "Vomiting-Induced Metabolic Cascade",
        "_slotRef": "debrief.physiologyDeepDive.vomiting-induced-metabolic-cascade.content",
        "content": "Gastric fluid contains H+, Cl-, K+, and Na+. Losing it creates: (1) Metabolic alkalosis from H+ loss, (2) Hypochloremia triggering renal Cl- retention and HCO3- retention, (3) Hypokalemia from both direct loss and renal K+ wasting as kidneys try to retain H+. The kidneys exchange K+ for H+ in the collecting duct, worsening K+ depletion. Below K+ 3.0, ECG changes appear (flattened T waves, U waves). Below 2.5, arrhythmia risk skyrockets.\n\n**TL;DR:** Vomiting loses H+, Cl-, and K+. The kidneys make it worse by dumping more K+ to save H+. Below K+ 2.5, the heart becomes electrically unstable."
      },
      {
        "id": "electrolyte-driven-arrhythmias-in-children",
        "title": "Electrolyte-Driven Arrhythmias in Children",
        "_slotRef": "debrief.physiologyDeepDive.electrolyte-driven-arrhythmias-in-children.content",
        "content": "Hypokalemia shifts the myocyte resting potential from -90mV toward -70mV. This partial depolarization makes the cell easier to excite but harder to repolarize normally. The result: prolonged QT interval, increased automaticity, and re-entry circuits that generate VT. Torsades de pointes (polymorphic VT with twisting axis) is the classic hypokalemia arrhythmia. Treatment: IV potassium replacement AND IV magnesium (which stabilizes the cardiac membrane independent of K+ levels). Monitor on telemetry during replacement.\n\n**TL;DR:** Low potassium partially depolarizes heart cells, making them fire when they should not. Replace potassium AND magnesium, and keep the patient on a monitor while you do it."
      }
    ]
  }
};

export var SC3 = {
  "schemaVersion": "5.4.1",
  "id": "croup-toddler",
  "title": "Bark in the Night",
  "subtitle": "A 3-year-old with stridor and a seal-like cough",
  "norms": {
    "hr": [
      80,
      120
    ],
    "rr": [
      22,
      34
    ],
    "sbp": [
      86,
      106
    ],
    "dbp": [
      42,
      63
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
      "phaseIndex": 0,
      "id": "assess",
      "stageType": "assess",
      "round": 1,
      "title": "Initial Assessment",
      "narrative": "Idris is sitting upright on the stretcher, leaning slightly forward into his mom's arms — he's found his own sniffing position without anyone coaching him. You can hear the stridor from the doorway: it's inspiratory, medium-pitched, and present at rest. He's not drooling, and there's no muffled or hot-potato voice. His work of breathing is clearly elevated — you see subcostal and suprasternal retractions with each breath, but he's not using accessory muscles maximally and he's not cyanotic. He's alert and tracking you with wide eyes, scared but responsive, and he quiets a bit when his mom holds him. No rash. Anterior neck is soft without masses or tenderness; trachea is midline. Lungs are clear to auscultation bilaterally below the upper airway noise, with good air entry throughout — the wheeze you hear transmits from above, not from the lower airways.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "148",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.hr.why",
          "why": "At 3 years old, Idris's heart rate of 148 bpm is elevated but expected given his work of breathing and fear — the tachycardia is compensatory, not a sign of shock or decompensation.\n\n- **Catecholamine surge from airway obstruction and distress** drives tachycardia reflexively; the sympathetic activation that increases respiratory effort also increases heart rate in parallel.\n- **Stridor with retractions requires sustained muscular work**, raising metabolic demand and oxygen consumption — the heart rate climb maintains cardiac output to support that work while he's still perfusing normally.\n\nThe tachycardia should improve as stridor resolves with dexamethasone and racemic epinephrine, not persist or worsen."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "38",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.rr.why",
          "why": "At 3 years old, Idris's respiratory rate of 38 is elevated above the normal awake range of 22–37 br/min — he's compensating for upper airway obstruction by breathing faster to move the same air through a narrowed space.\n\n- **Upper airway resistance drives tachypnea.** When the glottis and subglottic space narrow (croup's hallmark), each breath requires more muscular effort to push air through the obstruction; the child responds by increasing rate rather than depth, which is the body's less-exhausting compensation for resistance.\n- **Retractions plus tachypnea signal compensation is working but strained.** Idris's subcostal and suprasternal retractions show he's recruiting accessory muscles to generate negative pressure; sustained tachypnea + retractions together mean the work of breathing is high, and fatigue becomes a risk if obstruction worsens.\n\nWatch the trend: if stridor worsens or the rate climbs past 45–50 despite treatment, you're losing the compensation game and heading toward exhaustion."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "98/60",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.bp.why",
          "why": "At 3 years old, Idris's systolic BP of 98 mmHg sits comfortably above the hypotension threshold of 76 mmHg (70 + 2 × age), meaning his heart is still perfusing effectively despite the airway stress. His body has compensated for the work of breathing and anxiety by raising his heart rate and respiratory rate, not by dropping his blood pressure — a sign that compensation is still working.\n\n- **Compensatory tachycardia** maintains cardiac output when the child's airway narrowing and fear drive sympathetic surge; as long as BP stays normal, the body is holding its own against the respiratory load.\n- **Pediatric shock arrives late with hypotension** — children sustain normal pressures through heart rate increases for far longer than adults, so a normal BP does not mean the child is safe indefinitely if airway obstruction worsens.\n\nIf stridor worsens or retractions deepen despite dexamethasone, rising heart rate without falling BP signals he's still compensating, but it also means his reserves are being spent; that's the cue to escalate to racemic epinephrine or call for airway backup."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "94",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.spo2.why",
          "why": "An SpO2 of 94% in a 3-year-old with inspiratory stridor and retractions is still compensating, but it's lower than you'd want to see and signals that airway resistance is already taxing his oxygenation reserve. At rest in a child with patent lower airways (clear lung fields, good air entry), you should expect SpO2 ≥95%; anything lower hints that upper airway obstruction is stealing enough respiratory muscle work to limit ventilation.\n\n- **Upper airway obstruction increases work of breathing** and shunts respiratory effort away from gas exchange, dropping SpO2 even when lung parenchyma is normal.\n- **Pediatric oxygen stores deplete fast** — children have smaller functional residual capacity and higher oxygen consumption per kilogram than adults, so even brief periods of inadequate ventilation trigger desaturation quickly.\n\nTrend SpO2 q15 minutes through treatment and watch for any dip below 92% or rise in stridor intensity — both signal worsening obstruction and readiness to escalate therapy."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.8",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.temp.why",
          "why": "At 3 years old, a temperature of 37.8 °C is normal — croup is a viral syndrome and fever is expected, not alarming. What matters here is that the fever is *not* driving the stridor; the inspiratory stridor and posturing are the pathology.\n\n- **Croup is viral laryngitis,** not bacterial epiglottitis or foreign body; fever alone does not tell you which. The clinical picture — sniffing position, inspiratory stridor at rest, clear lungs, no drooling, no toxic appearance — is what distinguishes croup and guides dexamethasone and racemic epinephrine, not the thermometer.\n- **Fever in viral croup reflects inflammation of the subglottic larynx**, not systemic infection requiring antibiotics. The same parainfluenza or rhinovirus driving the temperature is causing subglottic edema, which narrows the airway and produces the barky cough and stridor you're hearing.\n\nTreat the fever symptomatically if he's uncomfortable, but the urgent decision is the corticosteroid — dexamethasone 0.6 mg/kg PO or IM now, before stridor worsens."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.cap.why",
          "why": "Cap refill of 2 seconds is reassuring — it confirms peripheral perfusion is intact despite Idris's elevated work of breathing and hypoxemia. At 3 years old, a refill time ≤2 seconds is normal; anything ≥3 seconds would signal maldistribution of blood flow to skin and suggest decompensating shock. The stridor and retractions are airway-level resistance, not circulatory failure — he's compensating with tachycardia and tachypnea to maintain oxygenation, and his tissues are still perfused. The normal cap refill paired with alert mental status, normal blood pressure, and brisk pulses means this is airway obstruction in a compensating child, not a child sliding into shock. Trend cap refill on reassessment; if it widens to 2.5–3 seconds or mottling appears, the picture shifts toward decompensation and demands escalation."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert, scared, tracking faces and responding to his mother's voice; calms with holding but does not fall asleep",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.mentalStatus.why",
          "why": "Idris's alertness and emotional responsiveness are reassuring — they tell you his brain is getting oxygen and perfusion right now, despite the noisy airway and retractions. In croup, the risk is that stridor will progress silently while mental status stays intact until suddenly it doesn't; the child who remains interactive and comforted by a parent is still compensating and buys you time to treat, not a child sliding toward intubation.\n\n- **Preserved mentation in upper airway obstruction** signals that oxygenation and cerebral perfusion are maintained; altered mental status — lethargy, confusion, irritability that doesn't settle with comfort — is the red flag for impending respiratory failure and decompensation.\n- **Fear and arousal in a sick child** are physiologic; anxiety increases work of breathing and catecholamine tone, which can paradoxically worsen stridor in the short term, so calming him in his mother's arms is your first intervention before any medication.\n\nReassess mental status every 10–15 minutes after dexamethasone and epinephrine — failure to improve or worsening drowsiness means escalate to airway management."
        },
        {
          "id": "upperAirway",
          "label": "Upper Airway",
          "finding": "Audible inspiratory stridor at rest, medium-pitched; barky cough elicited with handling; no drooling, no muffled voice, no trismus; trachea midline",
          "pos": "neck and oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.upperAirway.why",
          "why": "Inspiratory stridor at rest in a 3-year-old with fever signals croup — subglottic edema from viral inflammation narrowing the airway during the inspiratory phase when negative pressure is greatest. This is the classic presentation: barky cough, sniffing position adopted by the child, scared but not toxic. The absence of drooling, muffled voice, and trismus rules out epiglottitis, which would demand immediate airway management in the operating room rather than dexamethasone and nebulized epinephrine.\n\n- **Viral-induced subglottic edema** narrows the subglottic space during inspiration when intra-airway pressure drops and the soft tissues collapse inward; expiration is unobstructed because positive pressure splints the airway open.\n- **Dexamethasone 0.6 mg/kg** (here, 8.4 mg) reduces inflammation and edema over 4–6 hours; it works for any severity of croup, mild through severe, and prevents progression to stridor at rest becoming stridor with agitation and cyanosis.\n\nWatch for rebound stridor after treatment — some children restridor 6–8 hours post-dose, so discharge instructions must include return precautions and a backup dose plan if stridor recurs."
        },
        {
          "id": "retractions",
          "label": "Retractions",
          "finding": "Subcostal and suprasternal retractions present with each breath; no paradoxical chest wall movement; no nasal flaring",
          "pos": "chest wall",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.retractions.why",
          "why": "Retractions signal the work your patient is doing to pull air past the narrowed upper airway — they're a sign of respiratory effort, not respiratory failure, and their presence here tells you Idris is still compensating well. Subcostal and suprasternal retractions occur when negative intrathoracic pressure during inspiration pulls the compliant chest wall inward; the narrowed airway (from croup's subglottic edema) increases the pressure gradient needed to move air, so the muscles work harder. Idris is alert, maintaining his own sniffing position, keeping his SpO2 at 94% despite retractions, and using intercostal muscles without yet recruiting accessory muscles — that's compensated upper airway obstruction. Watch for progression: when retractions deepen, when he stops positioning himself upright, or when nasal flaring and head bobbing appear, he's moving toward fatigue and decompensation. Dexamethasone now will shrink the edema and reduce the work over the next 4–6 hours."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Clear and equal bilaterally with good air entry in all fields; transmitted upper airway noise present but no lower airway wheeze or crackles",
          "pos": "bilateral lung fields",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.breathSounds.why",
          "why": "Clear bilateral breath sounds with good air entry rule out lower-airway obstruction and confirm this is a laryngeal (upper-airway) problem — classic croup anatomy. The transmitted stridor you hear over the lungs comes from above the glottis, not from bronchial disease.\n\n- **Upper-airway obstruction in croup** produces subglottic edema and a barky cough, but spares the lower airways entirely; the lungs themselves are uninvolved, so air entry remains brisk throughout.\n- **Transmissibility of stridor** across the chest tells you the noise source is proximal and loud enough to conduct through the thorax rather than being generated within the lung parenchyma itself.\n\nThis finding locks in the diagnosis and justifies dexamethasone + racemic epinephrine rather than bronchodilators or other lower-airway therapies."
        },
        {
          "id": "skinColor",
          "label": "Skin Color",
          "finding": "Pink centrally and peripherally; no cyanosis, no pallor, no mottling",
          "pos": "skin",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.skinColor.why",
          "why": "Pink skin without cyanosis or mottling tells you Idris's tissues are being perfused despite the upper airway obstruction — his cardiovascular compensation is working. Croup causes airway narrowing, not shock; the elevated heart rate and respiratory rate you see are the body's response to the work of breathing and mild hypoxemia, not a sign that perfusion is failing. Watch for skin changes as a red flag: if central pallor, mottling, or cyanosis appears, that signals decompensation from rising airway resistance overwhelming his compensatory reserve, and you'd need to escalate to airway management immediately. For now, reassuring skin color paired with normal cap refill and normal blood pressure means you have time to give dexamethasone and racemic epinephrine to work, then observe closely for improvement over the next few hours."
        },
        {
          "id": "posture",
          "label": "Posture and Positioning",
          "finding": "Self-positioning in upright, forward-leaning posture; resists being laid supine",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.posture.why",
          "why": "Idris's self-adopted sniffing position — upright, leaning forward — is his body trying to optimize airway mechanics when the upper airway is partially obstructed by subglottic edema. The sniffing posture elongates the neck, aligns the airway axis, and reduces the transmural pressure gradient across the narrowed subglotis, making each breath easier to generate.\n\n- **Subglottic edema in croup narrows the airway lumen** and increases turbulent airflow resistance; upright positioning leverages gravity to keep pooled secretions away from the narrowest point and reduces the work needed to draw air through the stenosis.\n- **Supine positioning flattens the airway** and allows secretions and edematous tissue to collapse inward, worsening obstruction and triggering panic; that's why Idris resists lying flat — he's learned, through his physiology, that upright is safer.\n\nThis posture is reassuring because it shows intact respiratory drive and intact compensatory instinct; combined with his alert mental status and preserved oxygen saturation, it places him in moderate rather than severe croup."
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "10.2",
          "unit": "×10³/µL",
          "ref": "5.0-15.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.wbc.why",
          "why": "A normal WBC in croup reassures you the infection is viral, not bacterial — croup is almost always caused by parainfluenza virus, and the immune response stays well-contained. The white blood cell count reflects marrow output in response to infection; a normal count here means the viral insult isn't triggering the massive immune mobilization you'd see in bacterial epiglottitis or tracheitis. Idris's clinical picture (clear lungs, no toxic appearance, no drooling, responsive behavior) already points to croup rather than the bacterial mimics, and a normal WBC reinforces that — you don't need antibiotics. Watch for bandemia on differential if you obtain one, which would shift the likelihood toward secondary bacterial infection, but the normal WBC as a single value is reassuring that this is straightforward viral croup."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "96",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.glucose.why",
          "why": "Idris's glucose of 96 mg/dL is reassuringly normal and rules out stress hyperglycemia or early sepsis as a driver of his tachycardia and tachypnea. In croup, the elevated heart rate and respiratory rate are catecholamine-driven responses to upper airway obstruction and hypoxemic stress, not metabolic derangement. A normal glucose in the presence of tachycardia and retractions confirms the picture is airway-mechanical, not systemic infection or metabolic crisis — this distinction matters because it narrows your differential sharply away from epiglottitis, foreign body aspiration with systemic toxicity, or septic shock masquerading as stridor.\n\n- **Stress hyperglycemia** would signal either severe systemic infection or shock; normal glucose argues against both as primary drivers in this 3-year-old.\n- **Croup is self-limited viral illness** with local airway inflammation, not systemic metabolic derangement; his normal glucose, normal WBC, and clear lower lungs fit the classic presentation entirely."
        },
        {
          "id": "spo2SpotCheck",
          "name": "SpO2 (room air)",
          "value": "94",
          "unit": "%",
          "ref": "95-100",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.spo2SpotCheck.why",
          "why": "An SpO2 of 94% on room air is the lower boundary of acceptable in a 3-year-old with croup, and it reflects the work he's doing to pull air past a narrowed subglottic space — not yet a trigger for immediate oxygen, but a line item to watch closely.\n\n- **Inspiratory stridor with retractions** signals subglottic edema from croup creating real airway resistance; the 94% is the child working hard to maintain oxygenation despite that obstruction, not a sign of primary lung disease.\n- **Compensation in croup runs until it doesn't** — SpO2 stays in the low 90s through vigorous accessory muscle use, but desaturation below 90% signals either exhaustion or airway compromise, and either one demands escalation.\n\nReassess SpO2 every 15–30 minutes and watch for flattening of the retractions (sign the stridor is worsening, not improving) or rising work of breathing despite dexamethasone — those trends matter more than a single 94% reading."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 1,
      "id": "intervene",
      "stageType": "intervene",
      "round": 1,
      "title": "Initial Management",
      "narrative": "Idris is still stridorous and working hard with each breath — the subcostal and suprasternal retractions haven't let up. He's tolerating sitting upright with his mom but won't let you get close without crying, which tightens the airway further. His SpO2 is sitting at 94% on room air. The priority right now is reducing subglottic edema without agitating him further — anything that provokes a full-throated cry is going to make this worse before it gets better. Your nurse is ready to go: you can administer medications, get monitoring in place, or consider airway support, but think carefully about what this degree of croup actually warrants and what might push him over the edge.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "148",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.hr.why",
          "why": "At 3 years old, Idris's heart rate of 148 bpm is elevated above the normal awake range of 98–140 bpm, but sits in the predictable zone for a child in compensated respiratory distress from croup. The tachycardia reflects sympathetic drive — fear, hypoxemia (SpO2 94%), and the muscular work of fighting a narrowed airway all trigger catecholamine release and increase heart rate as an early compensatory response.\n\n- **Compensatory tachycardia in croup** maintains cardiac output while the child works harder to breathe; it typically resolves as subglottic edema shrinks and work of breathing falls.\n- **Fear and hypoxia amplify each other** — crying worsens airway resistance, which worsens the stridor and drops SpO2 further, perpetuating the tachycardia cycle.\n\nTrend the heart rate as you treat; a falling HR with improving SpO2 and quieter stridor signals effective dexamethasone response, whereas persistent tachycardia despite treatment flags ongoing airway narrowing or unmasked complications."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "38",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.rr.why",
          "why": "Idris's respiratory rate of 38 is elevated for a 3-year-old (normal 22–37) because he's working hard against upper-airway obstruction — his body is compensating for the narrowed subglottic space by breathing faster, trying to maintain adequate ventilation despite the resistance.\n\n- **Compensatory tachypnea** in croup increases minute ventilation to overcome the fixed obstruction above the glottis; the faster breathing rate partially offsets the resistance until edema worsens or fatigue sets in.\n- **Retractions paired with tachypnea** signal significant work of breathing — his subcostal and suprasternal indrawing show he's recruiting accessory muscle effort, a sign the subglottic narrowing is substantial but not yet causing CO2 retention (his pH and pCO2 remain normal).\n\nWatch for rising respiratory rate without improvement in stridor after dexamethasone — that's the cue that fatigue or worsening edema may be approaching and airway support might become necessary."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "98/60",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.bp.why",
          "why": "At 3 years old, Idris's BP of 98/60 mmHg is solidly normal — well above the hypotension threshold of 76 mmHg (70 + 2 × age) and near the 50th percentile for his age. His blood pressure tells you the croup has NOT yet produced circulatory compromise: he's working hard to breathe, but he's not shunting blood away from the periphery or losing perfusion to vital organs.\n\n- **Preserved perfusion** in croup indicates compensated airway obstruction; the tachycardia and tachypnea are respiratory and anxiety-driven, not shock-driven, which changes how aggressively you escalate.\n- **Normal BP reassures you not to over-treat** — aggressive airway interventions (pushing for intubation, heavily sedating him) risk converting a child with intact breathing mechanics into one who cannot maintain his own airway once sedated.\n\nKeep trending the BP, but your immediate focus is dexamethasone and calm reassurance, not escalation."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "94",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.spo2.why",
          "why": "At 3 years old, Idris's SpO2 of 94% on room air is lower than ideal and signals that his upper airway obstruction is beginning to impact oxygenation — a transition from compensated to early-stage decompensation. Normal SpO2 target in children is >94%, so he's at the threshold; any further drop would be concerning. His inspiratory stridor with retractions is doing mechanical work to push air past subglottic edema, and as that edema worsens or his fatigue increases, his ability to maintain oxygenation will slip.\n\n- **Compensatory work of breathing** is buying time: his elevated heart rate and respiratory rate, plus the retractions you see, are his body's attempt to maintain minute ventilation and oxygen delivery despite the narrowed airway.\n- **Stridor-induced hypoxemia** develops when upper airway obstruction forces the child to work harder to pull air in, depleting energy reserves faster than lower-airway obstruction would — croup can deteriorate rapidly once fatigue sets in.\n\nDexamethasone now will shrink subglottic edema and stabilize his airway before SpO2 drops further and exhaustion forces escalation."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.8",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.temp.why",
          "why": "Idris's temperature of 37.8 °C is normal-for-age and reassuring — it tells you the airway obstruction is from croup, not epiglottitis or bacterial tracheitis, where high fever (>39 °C) and toxic appearance are cardinal features. Croup is almost always viral (parainfluenza most common) and typically presents with low-grade fever or no fever at all, so a normal or near-normal temperature fits the clinical picture of moderate inspiratory stridor with clear lower airways and a child who remains alert and interacting. This temperature rules out the \"do not miss\" airway emergencies that would demand rapid intubation in a controlled setting; instead, it anchors your plan toward dexamethasone and racemic epinephrine to reduce the subglottic edema driving his stridor.\n\n- **Viral croup pathophysiology** produces subglottic inflammation without systemic toxicity; the low fever reflects the self-limited nature of upper-airway viral infection.\n- **High-grade fever with stridor** would flip the diagnosis toward bacterial epiglottitis or tracheitis, which require emergent airway management and broad-spectrum antibiotics, not outpatient steroids."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.cap.why",
          "why": "Cap refill at 2 seconds is right at the upper edge of normal for a 3-year-old — still reassuring, but worth watching closely in the context of his work of breathing. Croup itself doesn't cause shock, but respiratory distress from any cause burns calories and oxygen, and a child who is working this hard can cross into fatigue and hypoxemia quickly if the airway obstruction worsens. His perfusion is still intact: pink skin, normal blood pressure, alert mental status, and a cap refill that hasn't delayed — all signs his heart is pumping and his tissues are getting blood. The normal cap refill plus normal BP tell you this is compensated respiratory distress from croup, not decompensated shock masquerading as an airway problem. If cap refill creeps toward 2.5 or 3 seconds after treatment, or if it stays normal but his stridor worsens despite dexamethasone, you're trending toward either airway obstruction severe enough to impair gas exchange or fatigue — both reasons to escalate care."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert, scared, tracking faces and responding to his mother's voice; calms with holding but does not fall asleep",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mentalStatus.why",
          "why": "Idris's alert, engaged mental status is the most reassuring finding in his exam — it tells you his brain is getting oxygen and perfusion despite the upper airway work of burden. Children with croup who remain interactive and consolable are compensating well; altered sensorium or lethargy would signal either impending respiratory failure (CO2 retention, fatigue) or a different, more ominous diagnosis entirely. His fear and resistance to examination are developmentally appropriate and actually protective — a calm, sleeping 3-year-old with stridor should raise concern that he's not working hard enough to maintain airway patency. Watch for the flip: if he becomes drowsy, withdrawn, or stops responding to his mother's voice during treatment, that's your cue to escalate airway support immediately because compensation has begun to fail.\n\n- **Adequate cerebral perfusion in compensated croup** preserves alertness and responsiveness; the child's distress is the work of breathing, not encephalopathy.\n- **Rising pCO2 and hypoxemia depress mental status** — continued stridor + somnolence signals fatigue and failed compensation, not improvement."
        },
        {
          "id": "upperAirway",
          "label": "Upper Airway",
          "finding": "Audible inspiratory stridor at rest, medium-pitched; barky cough elicited with handling; no drooling, no muffled voice, no trismus; trachea midline",
          "pos": "neck and oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.upperAirway.why",
          "why": "Inspiratory stridor at rest in a 3-year-old with fever and a barky cough is croup — subglottic edema narrowing the subglottic airway until air turbulence produces the characteristic sound. This is the classic presentation: viral prodrome (usually parainfluenza), subglottic narrowing rather than epiglottic swelling, and airway findings that worsen with agitation and improve with calm.\n\n- **Subglottic anatomy in young children** creates a funnel at the level of the cricoid cartilage; viral inflammation of the mucosa there produces disproportionate airway obstruction because a small amount of edema takes up a large percentage of an already-narrow space.\n- **Stridor timing tells the anatomy**: inspiratory stridor (high-pitched, louder during inhalation) signals obstruction at or above the glottis; biphasic or expiratory stridor suggests lower tracheal pathology — croup stays inspiratory because the subglottic narrowing increases pressure swings above the glottis during inhalation.\n\nDexamethasone now and racemic epinephrine for the retractions are the definitive moves; resist the impulse to examine deeply or provoke crying, which recruits accessory muscles and worsens the work of breathing temporarily."
        },
        {
          "id": "retractions",
          "label": "Retractions",
          "finding": "Subcostal and suprasternal retractions present with each breath; no paradoxical chest wall movement; no nasal flaring",
          "pos": "chest wall",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.retractions.why",
          "why": "Retractions show that Idris is using his intercostal and abdominal muscles to generate negative intrathoracic pressure against the resistance of a narrowed subglottic airway — the hallmark of croup's work of breathing. Subcostal and suprasternal retractions without paradoxical chest wall movement or nasal flaring indicate moderate respiratory effort, not yet decompensation. His clear lower lung fields, normal cap refill, normal mental status, and SpO2 of 94% confirm he's still compensating — the retractions are real but he's maintaining ventilation and perfusion. Watch for progression: accessory muscle use maxing out, nasal flaring, head bobbing, or declining SpO2 would signal escalation toward obstruction; absence of those signs means dexamethasone and observation are appropriate now, not emergent airway intervention."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Clear and equal bilaterally with good air entry in all fields; transmitted upper airway noise present but no lower airway wheeze or crackles",
          "pos": "bilateral lung fields",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.breathSounds.why",
          "why": "Clear and equal breath sounds with good air entry throughout tell you the pathology is purely upper airway — subglottic edema narrowing the trachea above the carina, not bronchitis or bronchiolitis affecting the lower airways. In croup, the stridor you hear at the bedside transmits downward through a patent lower airway; the lungs themselves are uninvolved. This finding anchors the diagnosis and shapes your management: dexamethasone to shrink the subglottic swelling, and racemic epinephrine if the retractions worsen, but no antibiotics, no albuterol, and no pressure to intubate unless he truly can't sustain oxygenation. The combination of clear lungs + stridor at rest + retractions signals moderate croup — treat it pharmacologically and observe, not escalate to the ICU.\n\n- **Lower airway patency** in the setting of inspiratory stridor means the obstruction is fixed at the subglottic level, sparing the bronchial tree from the edematous process.\n- **Transmitted upper airway noise** that doesn't originate in the lower airways rules out bronchiolitis, asthma, and other small-airway disease that would show wheeze or crackles in these fields."
        },
        {
          "id": "skinColor",
          "label": "Skin Color",
          "finding": "Pink centrally and peripherally; no cyanosis, no pallor, no mottling",
          "pos": "skin",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.skinColor.why",
          "why": "Pink skin with normal cap refill and normal mental status tells you this is a croup emergency — not a sepsis emergency, not a shock emergency. Idris's airway is narrowed from subglottic inflammation, but his perfusion is intact; the tachycardia and tachypnea are from upper-airway obstruction and fear, not from tissue hypoxia or maldistribution. This distinction matters because it changes what you do next.\n\n- **Intact perfusion** means you can prioritize comfort and positioning over aggressive interventions; agitation tightens the airway further, so keeping him calm with his mom is part of the treatment, not a delay.\n- **Normal oxygenation at the tissue level** means the SpO2 of 94% is borderline acceptable for now — you're not racing to intubate, but you are preparing dexamethasone and racemic epinephrine to reduce the edema driving the stridor.\n\nReassure the family: croup is usually self-limited, and most kids improve within hours of steroid dosing."
        },
        {
          "id": "posture",
          "label": "Posture and Positioning",
          "finding": "Self-positioning in upright, forward-leaning posture; resists being laid supine",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.posture.why",
          "why": "Idris has found the sniffing position — the same posture that keeps the epiglottis clear in epiglottitis — because upright, forward-leaning stance maximizes airway patency and reduces the work of breathing when the subglottic space is swollen. In croup, the narrowing is fixed inflammation rather than dynamic airway collapse, so gravity and neck extension help by straightening the airway path and reducing the turbulence that produces stridor.\n\n- **Gravity-aided airway geometry** is the mechanic: when Idris leans forward and his mom supports him upright, the subglottic trachea straightens and the resistance to flow drops, lowering the pressure gradient needed to move air.\n- **Resistance to supine position** signals the child's instinctive defense — lying flat redirects blood pooling toward the airway and increases turbulence, immediately worsening stridor and triggering crying that tightens the throat further.\n\nThis is the posture of compensated croup, not imminent airway loss — keep him upright and calm, and avoid any maneuver that forces him horizontal or provokes a full cry."
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "10.2",
          "unit": "×10³/µL",
          "ref": "5.0-15.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.wbc.why",
          "why": "A normal WBC count in croup does not rule out viral infection — in fact, most croup is viral (parainfluenza, influenza, RSV) and children with viral croup often have WBC counts in the low-normal range. The normal count here is reassuring in a different way: it tells you this is not bacterial epiglottitis or a suppurative airway lesion masquerading as croup. Epiglottitis typically presents with a markedly elevated WBC and toxic appearance; Idris's alert mental status, clear lungs, and normal labs fit the croup picture. His work of breathing and stridor are from subglottic edema, not from systemic bacterial sepsis, so you can focus on topical and systemic corticosteroid therapy rather than worrying about empiric antibiotics.\n\n- **Viral etiologies** (parainfluenza, RSV, influenza) cause croup and typically produce normal or only mildly elevated WBC counts because the inflammation is localized to the larynx, not systemic.\n- **Absence of bandemia or marked leukocytosis** in the presence of stridor and retractions supports croup over epiglottitis or bacterial tracheitis, which would show toxic features and elevated inflammatory markers."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "96",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.glucose.why",
          "why": "Glucose of 96 mg/dL is normal for a 3-year-old and does not require intervention — this rules out hypoglycemia as a cause of Idris's distress or altered mental status. Stress-induced hyperglycemia is common in acutely ill children; a normal glucose here actually reassures that his tachycardia and tachypnea are driven by the croup airway obstruction and fear, not by metabolic derangement or inadequate stress response. The normal glucose, paired with normal pH and pCO2, confirms he's compensating well metabolically — his work of breathing is elevated but not yet causing respiratory fatigue or acidosis."
        },
        {
          "id": "vbgPh",
          "name": "VBG pH",
          "value": "7.36",
          "unit": "",
          "ref": "7.32-7.42",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.vbgPh.why",
          "why": "Idris's pH of 7.36 is reassuring because his airway is working hard but not yet failing — he's still compensating. The elevated respiratory rate (38 breaths/min, well above the normal 20–28 for a 3-year-old) is blowing off CO2 faster than it accumulates, which keeps pH from drifting into acidemia despite the subglottic obstruction trying to trap gas. His pCO2 of 44 mmHg is normal-range, not rising, which means he hasn't crossed the threshold where CO2 retention signals respiratory exhaustion.\n\n- **Compensatory hyperventilation** raises minute ventilation to blow off CO2 and keep pH stable, a sign the work of breathing is still sustainable despite the audible stridor.\n- **Rising pCO2 above 45–50 mmHg with pH <7.30** would signal the airway obstruction is outpacing his ability to ventilate and would demand escalation toward airway support; a stable pH keeps that threshold distant for now.\n\nTrend the pH every 30 minutes if he's not improving with dexamethasone and racemic epinephrine — a rising pCO2 with falling pH is your cue that the sniffing position and fear-driven breath-holding are overmatching the medical management."
        },
        {
          "id": "vbgPco2",
          "name": "VBG pCO2",
          "value": "44",
          "unit": "mmHg",
          "ref": "41-51",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.vbgPco2.why",
          "why": "Idris's pCO2 of 44 mmHg is reassuringly normal despite his stridor and work of breathing — he's compensating well and not yet in respiratory distress that's overwhelming his ability to ventilate.\n\n- **Hyperventilation in response to airway obstruction** normally drives pCO2 downward; the fact that Idris's pCO2 remains mid-range tells you his respiratory effort is still effective at gas exchange and he hasn't hit the wall where fatigue prevents him from blowing off CO2.\n- **Rising or normal pCO2 in the context of stridor and high work of breathing is a red flag** for impending respiratory failure — it means the patient's effort is no longer keeping up with his metabolic demands, signaling exhaustion is near.\n\nHis current pCO2 supports the clinical impression that dexamethasone and time are likely to work; if pCO2 starts creeping up on reassessment, escalate urgently."
        },
        {
          "id": "vbgHco3",
          "name": "VBG HCO3",
          "value": "24",
          "unit": "mEq/L",
          "ref": "20-28",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.vbgHco3.why",
          "why": "Idris's bicarbonate of 24 mEq/L is normal, which tells you his metabolic picture is intact despite the work of breathing — he's not yet in metabolic trouble from his airway obstruction.\n\n- **Respiratory compensation** in croup would drive pCO2 down as Idris works harder to clear CO2, but his pCO2 is 44 (normal), meaning his respiratory effort is matching his CO2 production and not yet tipping into hyperventilation or fatigue.\n- **Metabolic acidosis from lactate** would lower HCO3 and narrow the anion gap, a sign that anaerobic work has begun; a normal HCO3 at normal pH means he's still aerobic and tolerating the work of breathing without tissue hypoperfusion.\n\nHis retractions and tachypnea are effort, not failure — the acid-base numbers confirm he's compensating well and not yet in decompensation."
        },
        {
          "id": "spo2SpotCheck",
          "name": "SpO2 (room air)",
          "value": "94",
          "unit": "%",
          "ref": "95-100",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.spo2SpotCheck.why",
          "why": "In croup, an SpO2 of 94% on room air is borderline — it signals mild hypoxemia from upper-airway obstruction but does not yet warrant oxygen or escalation to intubation. SpO2 drifts down in croup when subglottic edema narrows the airway and increases work of breathing; the hypoxemia is usually mild and responsive to dexamethasone and racemic epinephrine within the first 1–2 hours.\n\n- **Upper-airway obstruction** reduces oxygen delivery to the alveoli by forcing Idris to work harder for each breath, increasing metabolic demand faster than he can meet it; the inspiratory stridor and retractions confirm the obstruction is at the subglottic level, not lower.\n- **Dexamethasone takes 4–6 hours to peak**, so the immediate focus is racemic epinephrine to shrink subglottic edema now while steroids begin working — this pair typically raises SpO2 back to >96% within 20–30 minutes, obviating oxygen entirely if the child stays calm.\n\nKeep him upright with his mom, avoid agitation (calm = narrower airway margins), and reassess SpO2 and work of breathing 30 minutes after medications — if SpO2 stays 94–95% with improving stridor, you can observe; if it drifts below 92% or retractions worsen, oxygen becomes necessary."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to vital signs monitor",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.vsMonitor.fb",
            "fb": "Continuous monitoring lets you track Idris's airway status without repeatedly handling him or agitating him further — every time he cries hard, airway edema tightens and SpO2 dips. Croup is self-limited (viral laryngotracheobronchitis from subglottic edema), and dexamethasone plus time do the work; your job is to keep him calm and catch decompensation early. **Remote heart rate and SpO2 monitoring** allows you to stay at arm's length, reassessing perfusion and oxygenation without the physical exam that triggers a full cry and airway compromise. **Retractions plus 94% SpO2 on room air** means he's compensating harder than he should be — monitoring gives you continuous reassurance he's not crossing into true respiratory failure (rising pCO2, altered mental status, exhaustion) while dexamethasone takes effect over the next 4–6 hours. Avoid repeated exam; let the monitor talk.",
            "pri": 1,
            "ok": true
          },
          "stethoscope": {
            "id": "stethoscope",
            "label": "Auscultate chest and neck",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.stethoscope.fb",
            "fb": "In croup, the diagnostic crux is confirming the stridor originates above the glottis and the lower airways are clear — auscultation does exactly that. Idris's inspiratory stridor transmitting from above the larynx while lungs sound clear below tells you this is laryngotracheitis, not epiglottitis (which would show muffled voice and drooling) and not lower-airway disease (which would show wheezing or crackles).\n\n- **Transmitted upper-airway noise** versus lower-airway pathology are distinguishable by listening at the mouth and comparing to lung fields; clear lungs rule out bronchiolitis or pneumonia masquerading as croup.\n- **Rule-out of epiglottitis** is critical because management diverges entirely — epiglottitis demands OR airway management and anesthesia, while croup is dexamethasone and racemic epi; the auscultation findings (muffled voice, possible drooling, toxic appearance) distinguish the two quickly at the bedside.\n\nThis exam confirms you're treating croup, not airway emergency.",
            "pri": 1,
            "ok": true
          },
          "o2Mask": {
            "id": "o2Mask",
            "label": "Apply supplemental oxygen by mask",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.o2Mask.fb",
            "fb": "Supplemental oxygen by mask preserves SpO2 and reduces the work of breathing while you prepare dexamethasone and nebulized epinephrine — the definitive treatments for croup. Idris's SpO2 of 94% on room air with moderate-severe stridor and retractions is at the threshold where supplemental oxygen becomes necessary to prevent further desaturation during agitation or swelling progression. **Hypoxemia-driven accessory muscle recruitment** worsens work of breathing and increases fatigue risk; oxygen buys time and reduces that metabolic demand. **Mask application over direct contact** avoids triggering a cry that would tighten his airway — a blow-by or mask held near the face lets you deliver oxygen without the airway provocation of nasal cannula placement or close face contact. Once he's calmer and medicated, his stridor and retractions should improve within 30–60 minutes.",
            "pri": 1,
            "ok": true
          },
          "nebSetup": {
            "id": "nebSetup",
            "label": "Set up nebulizer for inhaled treatment",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.nebSetup.fb",
            "fb": "Croup treatment hinges on delivering dexamethasone (systemic steroid) plus nebulized racemic epinephrine to shrink subglottic edema without provoking him into a full cry that defeats the whole effort. The nebulizer is your delivery vehicle for the racemic epi, which targets the inflamed subglottic tissues directly — alpha-1 vasoconstriction reduces mucosal swelling and opens the airway. At 3 years old with moderate-severe stridor and persistent retractions despite the sniffing position he's found, nebulized treatment is the right call. Set it up now, keep him calm and upright on his mom's lap, and use blow-by delivery if he won't tolerate a mask — the goal is medication in, agitation out.\n\n- **Racemic epinephrine mechanism** shrinks subglottic edema through alpha-1 receptor-mediated vasoconstriction, directly relieving the anatomic narrowing that's driving his stridor and retractions.\n- **Calm delivery route** matters as much as the drug itself; a mask forced onto a frightened 3-year-old triggers crying that transiently worsens airway obstruction and can overshoot him into respiratory distress — blow-by prevents that spiral.\n\nDexamethasone goes in now too (0.6 mg/kg = 8.4 mg PO or IV); it takes 4–6 hours to peak, so timing matters for discharge planning.",
            "pri": 1,
            "ok": true
          },
          "ivKit": {
            "id": "ivKit",
            "label": "Place peripheral IV",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.tools.ivKit.fb",
            "fb": "An IV is the wrong move first in moderate croup — you risk agitating Idris and tightening his airway further with handling and needle anxiety when his work of breathing is already elevated and his SpO2 is borderline. Peripheral IV placement is essential when a child needs IV medications (dexamethasone, magnesium for severe asthma, or medications for true epiglottitis), but croup management in the first hour hinges on dexamethasone given orally — it's equally effective, avoids the stress of needle insertion, and keeps him calm. Reserve IV access for the child with croup who deteriorates despite steroids and needs ICU admission or rapid airway intervention; this child needs dexamethasone PO now, quiet observation for stridor rebound, and the IV only if his clinical picture worsens.\n\n- **Dexamethasone oral absorption** is rapid and reliable in croup; IV and IM routes are alternatives when PO is refused, not primary choices.\n- **Agitation tightens the subglottic space** through sympathetic activation and muscle tension, which is the opposite direction you want when managing airway edema in a child already retracting and strident.",
            "pri": 3,
            "ok": false
          },
          "intubationKit": {
            "id": "intubationKit",
            "label": "Prepare intubation kit",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.tools.intubationKit.fb",
            "fb": "Intubation is the right call when croup produces stridor at rest with impending airway compromise — cyanosis, severe retractions exhausting the child, altered mental status, or inability to swallow secretions. Idris has moderate stridor and elevated work of breathing, but he's alert, maintaining SpO2 94% on room air, and his airway is still patent. An intubation kit primes you for deterioration you don't yet see. Preparing the kit risks agitating him further — the very act of laying him flat, opening his mouth, and attempting laryngoscopy can trigger laryngospasm and complete airway obstruction in a child with subglottic edema. Dexamethasone and nebulized racemic epinephrine are the cornerstones here; they take time to work, but they work. Watch closely for worsening stridor, drooling, or declining SpO2 — those are the signals to move to airway management. Right now, keep him calm and upright.",
            "pri": 3,
            "ok": false
          },
          "vbgKit": {
            "id": "vbgKit",
            "label": "Obtain venous blood gas",
            "priority": "distractor-misc",
            "_slotRef": "phase[1].actions.tools.vbgKit.fb",
            "fb": "Idris's airway is tight and he's crying with each exam — drawing blood right now will agitate him further and tighten the subglottic space exactly when you need it to relax. Venous blood gas tells you acid-base status and is useful when you're trying to sort metabolic from respiratory causes of altered mental status or to track compensation during shock resuscitation. This child has stridor, retractions, and a borderline SpO2, but he's alert, perfusing well (cap refill 2 sec, strong pulses), and his acid-base is compensating normally (pH 7.36, pCO2 44). The immediate move is dexamethasone to shrink the edema and let him breathe easier — defer labs until after he's calmer.\n\n- **Croup diagnosis is clinical,** not lab-based; you don't need a blood gas or imaging to confirm moderate-severity croup in a sniffing toddler with inspiratory stridor and clear lungs.\n- **Agitation tightens the airway** by increasing work of breathing and laryngeal tone; any procedure that provokes crying before dexamethasone takes hold risks worsening obstruction.",
            "pri": 5,
            "ok": false
          }
        },
        "meds": {
          "dexamethasone": {
            "id": "dexamethasone",
            "label": "Administer dexamethasone 0.6 mg/kg PO/IM (8.4 mg)",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.dexamethasone.fb",
            "fb": "Dexamethasone is the first-line anti-inflammatory for croup of any severity — even mild stridor warrants a single dose because it blocks the edema cascade before it spirals. At 0.6 mg/kg IV/IM/PO (8.4 mg in Idris's 14 kg frame), a single dose peaks in 4–6 hours and cuts both the duration and severity of airway obstruction. Give it orally if he'll take it without agitation; IM works just as well if he refuses. **Subglottic edema** is the pathology — viral inflammation (typically parainfluenza) swells the mucosa in the narrow subglottic space, and steroids shrink that edema by suppressing local cytokine release and reducing capillary leak. **Early dosing matters clinically** because the anti-inflammatory effect takes hours to peak; delaying the dose by even one or two hours costs Idris hours of breathing difficulty and increases the risk he'll need racemic epi or escalation. His current retractions and stridor are moderate-severe enough that dexamethasone alone may not be enough — prepare racemic epi as backup — but the steroid is the intervention that addresses the root problem.",
            "pri": 2,
            "ok": true
          },
          "racemicEpi": {
            "id": "racemicEpi",
            "label": "Administer racemic epinephrine via nebulizer",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.racemicEpi.fb",
            "fb": "Racemic epinephrine is the first-line pharmacology for moderate-to-severe croup: it shrinks the subglottic edema driving Idris's stridor and buys time for dexamethasone to take effect over the next 4–6 hours.\n\n- **Alpha-1 vasoconstriction** in the subglottic mucosa reduces tissue swelling and opens the narrowed airway within 10–15 minutes, directly addressing the anatomic obstruction producing his inspiratory stridor.\n- **Nebulized delivery** avoids agitating him further — it's tolerable with mom present and doesn't require close contact or equipment that might trigger crying and paradoxically tighten the airway.\n\nPair this with oral dexamethasone 0.6 mg/kg (8.4 mg in this 14 kg child) given now, then observe 3–4 hours post-dose for rebound stridor before safe discharge.",
            "pri": 2,
            "ok": true
          },
          "albuterol": {
            "id": "albuterol",
            "label": "Administer albuterol via nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.albuterol.fb",
            "fb": "Within the respiratory pack for croup, the cornerstone therapy is dexamethasone to shrink subglottic edema; racemic epinephrine is added for moderate-to-severe cases with stridor at rest. Albuterol is a beta-2 agonist that relaxes bronchial smooth muscle, targeting the lower airways and bronchospasm — the pathology of asthma and bronchiolitis, not croup. Idris's stridor is purely inspiratory and his lungs are clear with good air entry; the airway obstruction is fixed at the subglottic level, where mucosal swelling narrows the passage, not where bronchodilators reach. Dexamethasone now plus observation is the right call here; if his stridor worsens despite steroids, racemic epinephrine buys time while the dexamethasone takes effect over the next few hours.",
            "pri": 4,
            "ok": false
          },
          "methylprednisolone": {
            "id": "methylprednisolone",
            "label": "Administer methylprednisolone 1 mg/kg IV",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.methylprednisolone.fb",
            "fb": "Within the corticosteroid pack for croup, dexamethasone 0.6 mg/kg PO or IM is the established first-line agent — it's faster-acting than IV methylprednisolone and avoids the need for IV access in a child already stressed and resistant to handling. Methylprednisolone IV reduces subglottic edema by suppressing airway inflammation, the same mechanism dexamethasone uses. But in mild-to-moderate croup where the child is alert, breathing adequately, and sitting comfortably upright, forcing IV access to deliver a slower-acting steroid escalates agitation at precisely the moment you need him calm — crying tightens the airway and defeats the anti-inflammatory benefit you're trying to achieve. Dexamethasone PO (mixed in juice, dissolved in syrup) works just as well and lets you avoid the needle; reserve IV corticosteroids for the child too ill or unable to tolerate oral medication.",
            "pri": 4,
            "ok": false
          },
          "epiIM": {
            "id": "epiIM",
            "label": "Administer epinephrine IM (0.01 mg/kg)",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.meds.epiIM.fb",
            "fb": "IM epinephrine is the right call for anaphylaxis — rapid-onset angioedema, widespread urticaria, hypotension, or bronchospasm triggered by allergen exposure. Epinephrine's alpha-1 vasoconstriction and beta-2 smooth muscle relaxation address the mast cell mediator storm that drives anaphylactic airway collapse. Croup is laryngeal edema from viral inflammation (usually parainfluenza), not IgE-mediated degranulation — the pathology sits above the vocal cords and doesn't involve systemic vascular collapse. Dexamethasone reduces subglottic edema by suppressing the inflammatory infiltrate, and racemic epinephrine's topical alpha-1 effect shrinks the edematous tissue directly. IM epi in croup won't reach the subglottic space effectively and exposes Idris to unnecessary sympathomimetic side effects (tachycardia, tremor) when the mechanism driving his stridor is already addressed by steroids and, if needed, nebulized racemic epi.",
            "pri": 3,
            "ok": false
          },
          "ipratropium": {
            "id": "ipratropium",
            "label": "Administer ipratropium via nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.ipratropium.fb",
            "fb": "Within the respiratory pack for croup, the core intervention is dexamethasone to reduce subglottic edema; ipratropium is not part of croup management. Ipratropium is an anticholinergic that dries secretions and relaxes bronchial smooth muscle — the right choice for status asthmaticus with bronchospasm, where combined albuterol plus ipratropium reduces mucus plugging. Idris's clear bilateral breath sounds and absence of wheeze rule out bronchospasm; his airway obstruction is purely subglottic edema from viral laryngitis. Ipratropium won't reduce that edema and delays the one medication that will — dexamethasone. Start dex first, observe, and reserve epinephrine for stridor that worsens despite steroids.",
            "pri": 4,
            "ok": false
          },
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer NS 20 mL/kg IV bolus (280 mL)",
            "priority": "distractor-misc",
            "_slotRef": "phase[1].actions.meds.nsBolus.fb",
            "fb": "Croup is swelling of the subglottic airway from viral inflammation — it responds to dexamethasone and sometimes racemic epinephrine, not to IV fluids. An NS bolus is the right call when a child is in shock (septic, hypovolemic, or hemorrhagic) and perfusion is failing; Idris's cap refill is 2 seconds, his skin is pink, and his blood pressure is normal for age. IV fluid resuscitation has no role in the management of croup and delays the actual therapy — dexamethasone to reduce edema. The reflex to \"start an IV and give fluids\" is a common habit reach in pediatric resuscitation, but habit should not override the specific pathophysiology. Idris needs steroids now, not saline.",
            "pri": 5,
            "ok": false
          }
        }
      }
    },
    {
      "phaseIndex": 2,
      "id": "assess2",
      "stageType": "assess",
      "round": 2,
      "title": "Re-assessment After Initial Treatment",
      "narrative": "About 45 minutes have passed since Idris got his dexamethasone and racemic epinephrine. The good news is he's calmer — he's actually dozed off briefly against his mom's shoulder, which tells you the work of breathing has eased enough for him to stop fighting. The bad news is he's waking back up with audible stridor again. This is the classic rebound window after racemic epi, and you need to decide whether what you're seeing is acceptable post-treatment drift or a kid who's heading back toward where he started. His retractions are less dramatic than on arrival but still present — subcostal only now, no suprasternal. Stridor is still audible at rest, though quieter than before. His SpO2 has bumped up to 95% on the blow-by oxygen your nurse has been holding near his face. Trachea remains midline, breath sounds clear bilaterally with good air entry below the upper airway noise — no new lower airway findings.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "132",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.hr.why",
          "why": "At 3 years old, Idris's heart rate of 132 bpm is elevated above the normal awake range of 80–120 bpm for his age, but it reflects croup's inflammatory burden and work of breathing rather than shock or decompensation. The tachycardia drives airway blood flow and oxygen delivery to tissues working hard against upper airway resistance; as his retractions ease and stridor quiets with dexamethasone and racemic epinephrine, you'd expect the HR to drift down over the next hour or two. His BP is normal, cap refill is brisk, skin is pink, and mental status is alert — all the signs that tachycardia here is compensatory, not ominous.\n\n- **Inflammatory mediator release** in croup raises catecholamine sensitivity and increases baseline HR; the tracheal edema itself increases the work of breathing, which synergizes the tachycardia.\n- **Rebound tachycardia after racemic epi** is expected as the alpha-1 vasoconstriction wanes; the heart rate does not indicate that the medication failed, only that its duration is ending.\n\nTrend HR at 15–20 minute intervals through the rebound window; sustained decrease paired with quieter stridor signals adequate response to steroids."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "32",
          "unit": "br/min",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.rr.why",
          "why": "Idris's respiratory rate of 32 is normal for a 3-year-old despite his upper airway obstruction—the real message is what it tells you about his work of breathing and reserve. A child with croup who is maintaining a normal RR while still showing retractions is working hard to stay compensated, not yet fatiguing. The normal RR paired with lower retractions (subcostal only now, no suprasternal) and improved mental status suggests the racemic epinephrine bought him meaningful time.\n\n- **Respiratory compensation in upper airway obstruction** relies on increased effort (retractions, accessory muscle use) rather than increased rate; RR often stays normal or near-normal because the child's primary problem is airway resistance, not oxygenation failure.\n- **Rising RR into the high 30s or 40s after racemic epi effect wanes** would signal fatigue and impending decompensation—a sign to escalate rather than observe and discharge.\n\nWatch the retractions and stridor more closely than the RR number itself; if subcostal retractions return to suprasternal or accessory muscle use resumes, consider a second dose of racemic epi or PICU admission."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "100/62",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.bp.why",
          "why": "Idris's blood pressure of 100/62 mmHg is normal for a 3-year-old and reassuring given his upper airway distress — he is perfusing well despite the stridor and retractions. In croup, hypotension is a late and ominous finding that signals either severe airway compromise narrowing enough to impede venous return, or secondary shock from overwhelming infection (epiglottitis or bacterial tracheitis); the fact that his BP remains stable tells you he hasn't crossed that threshold. **Preserved systolic pressure** in the face of increased work of breathing means his cardiovascular compensation is intact — his body is meeting oxygen demand despite airway resistance. **Tachycardia (132 bpm) without hypotension** is appropriate compensation for fever and respiratory work; once BP begins to drop toward the hypotension threshold (<70 + 2 × age = <76 mmHg for a 3-year-old), the clinical picture shifts urgently from \"recovering croup\" to \"impending airway emergency.\" His normal perfusion parameters (cap refill 2 sec, clear mental status, normal BP) are what allow you to observe the post-epi rebound stridor safely rather than escalating immediately."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "95",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.spo2.why",
          "why": "At 3 years old with croup, Idris's SpO2 of 95% on blow-by oxygen is reassuring — he's maintaining adequate oxygenation despite upper-airway obstruction and active work of breathing. The stridor and retractions tell you his airway is narrowed, but his oxygen saturation says his lungs are clearing the air that gets past the swelling, and his body is compensating with faster breathing and harder effort rather than desaturating.\n\n- **Upper-airway obstruction doesn't always drop SpO2 early** because the lungs themselves remain clear — air entry below the narrowing stays good, so gas exchange proceeds normally until swelling is severe enough to block flow entirely. This child's clear lung sounds and stable saturation mean he's not at that threshold yet.\n- **Rebound stridor after racemic epi is expected around 45 minutes post-dose** because the alpha-1 vasoconstriction wears off, but it doesn't automatically mean he's deteriorating — reassess whether the stridor is quieter, the retractions are less dramatic, and the saturation holds steady, which this child's values show.\n\nWatch for stridor that worsens despite dexamethasone, retractions that creep back up to suprasternal level, or any dip in saturation below 94% — those would signal progression toward airway compromise requiring escalation."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "38.1",
          "unit": "°C",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.temp.why",
          "why": "Idris's fever of 38.1 °C is typical for croup — the viral infection triggering upper airway inflammation — but it's also a marker of how recently his symptoms began and how much systemic inflammation is still driving the swelling. Fever doesn't change your immediate airway management, but it anchors why the dexamethasone and racemic epinephrine are working and why rebound stridor is expected as the epinephrine wears off.\n\n- **Viral croup (typically parainfluenza)** produces fever alongside subglottic edema by activating the innate immune cascade; the fever peaks early and persists through the first 24–48 hours as the viral infection runs its course.\n- **Dexamethasone suppresses the inflammatory cascade** that sustains subglottic swelling, but it takes 4–6 hours to reach peak effect — during the 2–4 hour window after racemic epinephrine wears off, the underlying inflammation is still active, explaining the rebound stridor you're seeing.\n\nReassess at the 3–4 hour post-treatment mark; persistent stridor plus worsening retractions despite steroids signals consideration for transfer to a center with ICU capability."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.cap.why",
          "why": "Cap refill of 2 seconds in a 3-year-old signals intact peripheral perfusion — even though Idris is working hard to breathe and running a fever, his skin is still receiving adequate blood flow. In croup, the pathology is upper airway edema, not circulatory compromise; a normal cap refill reinforces that his cardiovascular system is compensating well and you're not seeing early shock. The normal cap refill paired with clear mental status, normal blood pressure, and pink skin means you can focus your reassessment on the airway findings alone — rebound stridor and retractions — rather than worrying about systemic decompensation.\n\n- **Capillary refill measures skin perfusion pressure**, which depends on cardiac output and peripheral vascular resistance; normal refill means those are adequate despite the work of breathing and fever.\n- **Croup causes local airway edema from viral inflammation**, not hypovolemia or sepsis, so perfusion typically stays intact unless the child tires or deteriorates into respiratory failure.\n\nWatch the cap refill trend over the next observation window; lengthening refill (toward 2.5–3 sec) would signal fatigue or decompensation and would shift the threshold for airway intervention."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Drowsy but arousable; opens eyes to voice, recognizes mother, briefly interactive then drifts back toward sleep — appropriate fatigue for a child who has been working hard to breathe for several hours",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.mentalStatus.why",
          "why": "Idris's drowsiness is reassuring — it signals that his work of breathing has genuinely eased enough for him to stop fighting and rest, not a sign of hypoxemia or altered perfusion.\n\n- **Respiratory muscle fatigue in croup** resolves as airway swelling shrinks with dexamethasone and racemic epinephrine wears off; a child who can relax enough to doze has bought back his respiratory reserve.\n- **Altered mental status from hypoxemia or shock** presents as lethargy that persists despite stimulation or worsens with time; Idris arouses appropriately to voice and recognizes his mother, which excludes hypoxic encephalopathy or decompensation.\n\nThe real worry in rebound stridor is whether he'll re-escalate when the racemic epi window closes — keep reassessing his stridor intensity and retractions every 15–30 minutes over the next 2–4 hours."
        },
        {
          "id": "upperAirway",
          "label": "Upper Airway",
          "finding": "Inspiratory stridor still audible at rest, softer than on arrival but present; barky cough elicited with position change; no drooling, no muffled voice, trachea midline",
          "pos": "neck and oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.upperAirway.why",
          "why": "Inspiratory stridor audible at rest after dexamethasone and racemic epinephrine signals the rebound phase of croup — the drug effect is wearing off before inflammation has fully resolved, and you're seeing the edema re-establish itself. This is the expected post-treatment window in moderate croup, not failure.\n\n- **Racemic epinephrine's vasoconstriction shrinks subglottic edema for 2–4 hours**, allowing swelling time to peak and start resolving, but the effect is temporary and stridor typically returns 30–60 minutes after the dose wears off.\n- **Dexamethasone takes 4–6 hours to peak effect**, so at 45 minutes post-dose the anti-inflammatory benefit is still ramping up — the edema reduction from steroids hasn't yet matched what the epi provided acutely.\n\nObserve for 3–4 hours total; discharge is safe if stridor quiets with minimal retractions and SpO2 stays >94% on room air by the end of that window."
        },
        {
          "id": "retractions",
          "label": "Retractions",
          "finding": "Subcostal retractions visible with each breath; suprasternal retractions resolved; no nasal flaring; no paradoxical chest wall movement",
          "pos": "chest wall",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.retractions.why",
          "why": "Subcostal retractions now (versus the subcostal and suprasternal retractions on arrival) show the racemic epinephrine is working — the swelling in the subglottic space has edema that shrinks briefly after the alpha-1 vasoconstriction peaks. This is expected and reassuring, not a reason to escalate.\n\n- **Retractions reflect work of breathing driven by upper airway obstruction**, not lower-airway disease; in croup the obstruction is at the subglottic level, so you see accessory muscle use above and around the chest but clear lungs below.\n- **Rebound stridor during the post-epinephrine window is normal** — the drug's effect wanes around the 2-hour mark, and mild stridor recurrence doesn't signal treatment failure if the child is calmer, retracting less, and maintaining oxygenation (he's at 95% on blow-by oxygen).\n\nWatch for return to suprasternal retractions or any upward trend in work of breathing over the next 1–2 hours; that would flag a child who needs a second dose of racemic epi or earlier discharge reassessment."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Clear and equal bilaterally with good air entry in all fields; transmitted upper airway noise present; no lower airway wheeze or crackles on careful auscultation",
          "pos": "bilateral lung fields",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.breathSounds.why",
          "why": "Clear bilateral breath sounds with good air entry tell you the lower airways are patent and not involved — croup is purely an upper airway disease. Idris's inspiratory stridor and retractions are all coming from subglottic edema narrowing his airway above the thorax, not from bronchospasm or secretions in the smaller airways. The transmitted upper airway noise you hear over the lungs is acoustic carryover from the stridor itself, not pathology below the larynx.\n\n- **Lower airway sparing** confirms the diagnosis and rules out epiglottitis (which would present with muffled voice, drooling, and tripod posture) or other life-threatening upper airway emergencies that require intubation rather than supportive care.\n- **Good air entry throughout** means he's moving adequate tidal volume despite his work of breathing — reassuring for perfusion and oxygenation, and a favorable sign for outpatient management after observation.\n\nThis finding is why dexamethasone and time, not aggressive escalation, are the right answer for straightforward croup."
        },
        {
          "id": "skinColor",
          "label": "Skin Color",
          "finding": "Pink centrally and peripherally; no cyanosis, no pallor, no mottling",
          "pos": "skin",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.skinColor.why",
          "why": "Pink, well-perfused skin tells you that despite the upper airway work, Idris is not in shock and his oxygen delivery is holding up. Croup causes airway obstruction, not tissue hypoxia — as long as he's moving air past the inflamed subglottis, his lungs are oxygenating blood normally. The absence of pallor, mottling, or cyanosis confirms that the tachycardia and retractions you see are compensatory responses to airway resistance, not desperation from tissue underperfusion. His pink color paired with clear lung sounds below the stridor means the problem is mechanical (swelling at the larynx), not a systemic or lower-airway process that would trigger vasoconstriction and shift blood away from the skin.\n\n- **Skin perfusion reflects cardiac output and oxygen delivery.** Cyanosis or mottling would signal either severe hypoxemia or shock; their absence at rest with blow-by oxygen means he's saturating adequately despite the stridor.\n- **Rebound stridor after racemic epi is expected and usually self-limited.** The fact that his skin stayed pink through the rebound window, without any new warning signs (lethargy, pallor, slowed cap refill), means you can safely observe him rather than escalate immediately."
        },
        {
          "id": "posture",
          "label": "Posture and Positioning",
          "finding": "Resting semi-upright against mother; no longer rigidly self-positioning or resisting repositioning",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.posture.why",
          "why": "Idris's relaxation into his mother's arms — no longer holding the rigid sniffing position — signals that his upper airway obstruction has improved enough that he can stop working so hard to breathe. The sniffing position is a compensatory posture: when the larynx swells inward, sitting upright and extending the neck lengthens the airway and reduces turbulent flow through the narrowed segment. Once dexamethasone and racemic epinephrine reduce subglottic edema, the work of breathing drops and he no longer needs to brace himself against gravity.\n\n- **Postural relaxation** is one of the earliest signs that stridor is improving — the child's body stops fighting; mental clarity improves because less energy goes to breathing.\n- **Persistence of retractions despite postural ease** tells you the inflammation is improving but not fully resolved; the rebound window after racemic epi is expected, and observation for 3–4 hours post-dose is standard before discharge.\n\nWatch the retractions closely over the next hour — if they deepen again or stridor worsens, you may need a repeat dose of racemic epi before considering admission."
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "11.4",
          "unit": "×10³/µL",
          "ref": "5.0-15.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.wbc.why",
          "why": "At 3 years old, Idris's WBC of 11.4 is solidly in the normal range for his age and doesn't point toward bacterial infection as the cause of his croup — this is a viral syndrome, most likely parainfluenza or RSV. In young children, viral upper airway infections trigger fever and mild leukocytosis from normal immune activation without requiring antibiotics. The lack of bandemia (immature neutrophils on the differential) strengthens the viral picture; bacterial croup is rare and would typically show a left shift alongside a higher WBC. His normal WBC reassures you the stridor is inflammatory edema from a self-limited virus, not epiglottitis or bacterial tracheitis — conditions that would demand airway visualization and antibiotics before they progress.\n\n- **Viral upper airway disease** produces fever and mild WBC elevation as the body mounts a normal T-cell and B-cell response without releasing immature neutrophils from the marrow.\n- **Bacterial superinfection risk** is low when WBC remains normal and centered; epiglottitis or bacterial tracheitis would show left shift and often higher total counts signaling acute marrow demand.\n\nWatch for stridor worsening despite dexamethasone and racemic epi, drooling, or tripod positioning — those would pivot toward bacterial epiglottitis and demand airway assessment regardless of normal labs."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "108",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.glucose.why",
          "why": "Idris's glucose of 108 mg/dL is reassuringly normal — stress and fever can both raise glucose acutely, and this value tells you his metabolic response to the acute illness is intact without swinging into hyperglycemia.\n\n- **Stress hyperglycemia** from catecholamine surge (driving his tachycardia and widened eyes) typically raises glucose by 20–50 mg/dL in children, especially in the first hour after an acute insult; a normal glucose despite fever and stridor means his pancreatic response is appropriate.\n- **Dexamethasone can elevate glucose** by blunting insulin secretion, but the effect peaks hours into therapy and this early measurement shows no iatrogenic rise, confirming the dose and timing are not creating a secondary problem.\n\nNormal glucose rules out metabolic derangement as a complicating factor — your resuscitation can focus entirely on the airway and the rebound stridor."
        },
        {
          "id": "vbgPh",
          "name": "VBG pH",
          "value": "7.34",
          "unit": "",
          "ref": "7.32-7.42",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.vbgPh.why",
          "why": "The pH of 7.34 sits squarely in the normal range for a 3-year-old and reflects a child whose airway obstruction is not yet driving significant respiratory acidosis. In croup, stridor and retractions raise the risk of CO2 retention — the work of maintaining ventilation against upper airway resistance can exhaust a child before he blows off enough CO2 to acidify the blood. A normal pH with a normal pCO2 (47 mmHg) tells you Idris is still compensating adequately; he's working hard but not yet failing to clear CO2.\n\n- **Respiratory acidosis appears when pCO2 rises above 45 mmHg in the setting of upper airway obstruction.** This child's pCO2 is borderline-normal, meaning his respiratory effort is keeping pace with CO2 production despite the stridor.\n- **pH decline in croup signals impending decompensation and is a red flag for considering intubation.** If his next VBG drifts toward 7.25–7.30 with pCO2 climbing, the work of breathing is winning and fatigue is close.\n\nTrend the pH with each reassessment during the rebound window — a falling pH despite dexamethasone and racemic epi is your cue to escalate care."
        },
        {
          "id": "vbgPco2",
          "name": "VBG pCO2",
          "value": "47",
          "unit": "mmHg",
          "ref": "41-51",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.vbgPco2.why",
          "why": "A pCO2 of 47 mmHg in croup tells you Idris's respiratory effort is holding his ventilation steady despite the upper airway obstruction — he's not yet sliding into CO2 retention that signals impending fatigue.\n\n- **Compensatory tachypnea** in croup drives CO2 off by increasing minute ventilation; a normal-range pCO2 confirms the respiratory drive is working and the retractions you see are effective, not futile.\n- **Rising pCO2 above 50–55 mmHg** would be the red flag for respiratory muscle fatigue or decompensation — the moment his work of breathing stops clearing CO2 efficiently is when escalation to airway management becomes emergent.\n\nReassess pCO2 if stridor worsens or retractions deepen after the epinephrine effect fades further; a climbing pCO2 with persistent stridor is the signal to escalate."
        },
        {
          "id": "vbgHco3",
          "name": "VBG HCO3",
          "value": "25",
          "unit": "mEq/L",
          "ref": "20-28",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.vbgHco3.why",
          "why": "The HCO3 of 25 mEq/L is normal and reassuring — it tells you Idris's kidneys are still handling acid-base balance appropriately and he hasn't slipped into metabolic acidosis from tissue hypoxia or shock.\n\n- **Metabolic compensation in croup** relies on intact renal function to buffer the respiratory stress; a normal HCO3 paired with a normal pH means no secondary acidosis is developing despite the airway inflammation.\n- **Work of breathing elevation** (his RR is 32, at the top of normal for age) should drive mild respiratory alkalosis if anything, not metabolic derangement — the normal HCO3 confirms he's compensating through increased minute ventilation, not deteriorating into shock physiology.\n\nThe real safety signal would be HCO3 dropping below 20 or pH falling below 7.3, either of which would suggest fatigue, hypoxia, or impending decompensation — none of which fit this picture."
        },
        {
          "id": "spo2SpotCheck",
          "name": "SpO2 (blow-by O2)",
          "value": "95",
          "unit": "%",
          "ref": "95-100",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.spo2SpotCheck.why",
          "why": "Idris's SpO2 of 95% on blow-by oxygen is reassuring because it shows his lungs are exchanging gas effectively despite the upper airway obstruction — the stridor is a laryngeal problem, not a sign of lower-airway collapse or parenchymal disease. The normal breath sounds and clear lung fields support this: his hypoxemia risk comes from airway mechanics (increased work fighting the narrowing), not from pneumonia or bronchiolitis. At 3 years old, 95% is an acceptable threshold; he's not yet in the zone where you'd escalate to heated high-flow or consider intubation.\n\n- **Inspiratory stridor with clear lungs** means the obstruction is above the glottis (laryngeal edema from croup), not below it — lower-airway disease would produce wheezing and crackles, and SpO2 often drops faster with lower obstruction because the entire lung field is involved.\n- **Post-epinephrine rebound** is the expected physiology here: racemic epi shrinks the edema for 60–90 minutes, then wears off and stridor returns — the SpO2 staying normal tells you he's still compensating well despite the rebound, not decompensating into it.\n\nTrend SpO2 every 15 minutes through the observation window; if it drops below 92% or stridor worsens despite remaining calm, escalate oxygen delivery."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 3,
      "id": "intervene2",
      "stageType": "intervene",
      "round": 2,
      "title": "Escalation and Disposition",
      "narrative": "Forty-five minutes out from his first racemic epi dose, Idris has partial improvement but hasn't cleared — he still has resting stridor and subcostal retractions, and his temperature has ticked up slightly to 38.1°C. The dexamethasone is on board and doing its job, but it takes hours to fully peak. The question in front of you now is: does this child go home, get watched longer, or need another dose of racemic epi to tide him over while the steroid works? He currently has no IV access. You can place a peripheral IV if you want it, or keep him calm and go IM/inhaled — your call. His SpO2 is holding at 95% on blow-by, retractions are less severe than on arrival, and he's not tiring. But resting stridor at 45 minutes post-epinephrine is a real sign — don't talk yourself out of it.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "132",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.hr.why",
          "why": "At 3 years old, Idris's heart rate of 132 bpm sits at the upper range of normal for his age (80–120 bpm awake) and reflects the combined stress of airway narrowing, fever, and fear — not shock or decompensation.\n\n- **Compensatory tachycardia** from upper airway obstruction increases work of breathing; the body raises heart rate to maintain cardiac output against the energy demand of fighting stridor.\n- **Catecholamine surge** from fever and anxiety drives the tachycardia equally, but his perfusion markers (cap refill 2 sec, normal BP, pink skin, alert mental status) confirm he's still compensating well — the fast heart rate is working for him, not against him.\n\nHis heart rate should trend downward over the next 2–4 hours as dexamethasone peaks and stridor resolves; failure to slow is your cue that epinephrine redose or escalation to observation is needed."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "32",
          "unit": "br/min",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.rr.why",
          "why": "Idris's respiratory rate of 32 br/min is at the top of normal for a 3-year-old (upper range 22–37 /min), which means his lungs are working harder than baseline but he hasn't crossed into frank tachypnea yet — a reassuring sign that croup hasn't progressed to lower-airway involvement or significant respiratory compromise.\n\n- **Subcostal retractions without tachypnea** indicate work is concentrated in the upper airway (subglottic edema from croup) rather than diffuse lung disease; if bronchiolitis or pneumonia were the primary driver, you'd expect a higher RR alongside the retractions.\n- **Normal pCO2 (47 mmHg)** paired with this RR confirms he's ventilating adequately and not accumulating CO2 despite the stridor, meaning the narrowed airway isn't yet compromising gas exchange.\n\nHe's compensating well — the stridor and retractions are real, but the relatively preserved RR and normal blood gas tell you the racemic epi plus dexamethasone are buying time, not that he's decompensating."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "100/62",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.bp.why",
          "why": "Blood pressure of 100/62 mmHg in a 3-year-old is solidly normal — Idris is perfusing well despite the airway obstruction and his elevated work of breathing. The hypotension threshold for his age is around 76 mmHg systolic; he's 24 mmHg above that and sitting comfortably, so you're not watching for shock. What matters clinically is that croup, even with moderate retractions, does not cause cardiovascular collapse — his body is managing the airway work without spilling into systemic compromise. His normal BP alongside normal cap refill and alert mental status tells you the retractions he's showing are **compensatory respiratory effort**, not decompensation. **Croup drives upper-airway edema via viral inflammation**, which raises the work of breathing but not the total metabolic demand enough to drop perfusion pressure in an otherwise-well child. Watch the BP trend only if stridor worsens dramatically or mental status changes; a stable normal pressure here means your focus stays on airway management (steroids + selective epinephrine re-dosing), not on fluid resuscitation or shock protocol."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "95",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.spo2.why",
          "why": "At 3 years old with croup and resting stridor 45 minutes after epinephrine, a SpO2 of 95% on blow-by oxygen is reassuring but does not mean Idris is out of the woods — it tells you his oxygenation is holding despite upper-airway obstruction, which buys time for dexamethasone to work. Inspiratory stridor at rest signals narrowing of the subglottic space that will worsen if inflammation rebound occurs after the epinephrine wears off (typically 2–4 hours).\n\n- **Upper-airway obstruction reduces flow but may preserve SpO2 until late** because the lungs themselves are clear and he's compensating with increased work of breathing; a normal SpO2 does not mean the stridor will not worsen.\n- **Rebound stridor after epinephrine is common** — the drug shrinks subglottic edema temporarily while dexamethasone (which takes 4–6 hours to peak) addresses inflammation at the source, leaving a vulnerable window where repeat dosing or close observation is the right call.\n\nWatch the trend: if SpO2 stays 95% or above and retractions improve further over the next 1–2 hours, you're on track for discharge with close follow-up and clear return precautions. If stridor worsens or SpO2 drifts down despite blow-by oxygen, treat the rebound with a second dose of racemic epi."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "38.1",
          "unit": "°C",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.temp.why",
          "why": "In croup, fever is the trigger—it drives airway inflammation and swelling that narrows the subglottic space. A rising or persistent temperature at 45 minutes post-epinephrine signals continued mucosal inflammation even though the adrenergic shrinkage is wearing off, and it predicts that Idris will cycle back into stridor as the epi effect plateaus and clears. The dexamethasone takes 4–6 hours to peak; the fever tells you the inflammatory load is still high and rebound is real.\n\n- **Subglottic edema** from viral croup (almost always parainfluenza) worsens with fever and improves with dexamethasone, but the time lag between steroid dosing and maximal effect leaves a gap where recurrent stridor is expected.\n- **Racemic epinephrine's duration is 2–4 hours**; a child with persistent fever and resting stridor at 45 minutes is climbing back toward the upper end of that window and needs bridging with a second dose or close observation for re-intubation risk.\n\nPlan for a second nebulized epi dose if stridor worsens or doesn't continue improving—don't wait for full clinical relapse."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.cap.why",
          "why": "Cap refill of 2 seconds in a 3-year-old with croup is reassuring perfusion — it sits right at the normal threshold and tells you this child is not in shock from his airway disease. Croup causes upper-airway obstruction and work-of-breathing elevation, but it does not typically trigger the circulatory decompensation you'd see in epiglottitis or in a child whose retractions have progressed to exhaustion. His normal cap refill, combined with alert mental status and strong peripheral pulses, means the oxygen delivery to his tissues is intact despite the stridor and retractions. This is the clinical picture of **compensated respiratory compromise** — his heart rate is elevated to maintain cardiac output in the face of increased work, but his perfusion is holding. If cap refill were prolonged (≥3 sec) alongside the resting stridor, you'd be looking at impending decompensation and a much lower threshold for airway intervention."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Drowsy but arousable; opens eyes to voice, recognizes mother, briefly interactive then drifts back toward sleep",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.mentalStatus.why",
          "why": "Idris's drowsiness in the setting of resting stridor and retractions is reassuring — it means he's not fighting the airway obstruction, which is what you want to see in croup. A fully alert, agitated 3-year-old with stridor often signals higher airway resistance and more work; the child who quiets against his mother and drifts is conserving energy while the steroid and time do the work.\n\n- **Preserved arousability** distinguishes fatigue from encephalopathy — he opens to voice and recognizes his mother, so his mental status is intact; drowsiness here reflects exhaustion from elevated work of breathing, not altered perfusion or CNS pathology.\n- **Calm behavior reduces airway resistance** because crying and agitation trigger laryngeal reactivity and worsen stridor; a child who stays settled with his mother avoids the spiral that turns partial obstruction into decompensation.\n\nA drowsy child who won't arouse, or one who is agitated and fighting despite sitting upright, would flip the reassurance — but Idris's presentation matches safe partial improvement on dexamethasone plus time."
        },
        {
          "id": "upperAirway",
          "label": "Upper Airway",
          "finding": "Inspiratory stridor still audible at rest, softer than on arrival but present; barky cough elicited with position change; no drooling, no muffled voice, trachea midline",
          "pos": "neck and oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.upperAirway.why",
          "why": "Resting inspiratory stridor 45 minutes after the first racemic epinephrine dose tells you the subglottic edema is partially but incompletely controlled — he needs a second dose or close observation with a low threshold to retreat.\n\n- **Subglottic edema in croup narrows the sublaryngeal airway** and produces the characteristic high-pitched, seal-bark stridor; racemic epinephrine causes alpha-1 vasoconstriction that temporarily shrinks the swelling, but the effect wanes over 2–4 hours as the medication clears.\n- **Persistence of resting stridor despite dexamethasone on board** signals that the anti-inflammatory steroid is still ramping to peak effect (4–6 hours out from dosing), leaving a vulnerability window where rebound stridor is common if epinephrine wears off entirely.\n\nGiven Idris's stable oxygenation, clear mental status, and no accessory muscle fatigue, a second nebulized dose now is reasonable and matches the clinical picture of partial response; observe him closely 3–4 hours post-dose before committing to discharge."
        },
        {
          "id": "retractions",
          "label": "Retractions",
          "finding": "Subcostal retractions visible with each breath; suprasternal retractions resolved; no nasal flaring; no paradoxical chest wall movement",
          "pos": "chest wall",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.retractions.why",
          "why": "Subcostal retractions at 45 minutes post-epinephrine signal that the upper airway edema is rebounding faster than expected — the medication's peak effect is already fading and the steroid hasn't yet taken over. This is the classic timing window where a second epi dose prevents progression to severe stridor and potential respiratory failure.\n\n- **Retractions reflect increased work of breathing** when the upper airway is narrowed; the intercostal muscles pull inward as negative intrathoracic pressure deepens trying to draw air past the obstruction.\n- **Inspiratory stridor plus persistent retractions 45 minutes post-dose** is the indicator for repeat nebulized or IM epinephrine; waiting for \"worse\" allows the child to tire and decompensate into a harder resuscitation.\n\nWatch the trajectory between now and the 3-hour mark post-steroid — if retractions are clearing progressively and stridor is quieting, you've bought time. If they're stable or worsening, the second dose is your safety net."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Clear and equal bilaterally with good air entry in all fields; transmitted upper airway noise present; no lower airway wheeze or crackles",
          "pos": "bilateral lung fields",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.breathSounds.why",
          "why": "Clear breath sounds with transmitted upper airway noise tell you the obstruction is above the glottis, not in the bronchi — classic croup anatomy and reassuring that lower airways are spared.\n\n- **Croup localizes stridor to the subglottic space** where mucosal edema narrows the airway; the sound transmits downward through the patent lower airways, reaching your stethoscope without originating there.\n- **Absence of wheeze or crackles rules out bronchospasm and pulmonary edema**, both of which would suggest a more complex or different diagnosis (asthma, bronchiolitis, heart failure) requiring different management.\n\nAt 45 minutes post-epi with resting stridor still present, clear lower fields mean he's not decompensating into biphasic obstruction — repeat racemic epi is the play here, not escalation to airway intervention."
        },
        {
          "id": "skinColor",
          "label": "Skin Color",
          "finding": "Pink centrally and peripherally; no cyanosis, no pallor, no mottling",
          "pos": "skin",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.skinColor.why",
          "why": "Pink skin with normal capillary refill and a brisk heart rate tells you that Idris's airway obstruction has not yet compromised his perfusion — he's still compensating well. In croup, the immediate threat is airway narrowing from subglottic edema; as long as oxygenation and perfusion are intact, you have time for steroids to work while managing stridor with rescue doses of epinephrine. Mottled or pale skin would signal shock — either from severe airway disease impairing oxygen delivery or from sepsis (a rare driver of croup). Idris is pink and perfusing, which means the obstruction is localized to his upper airway, not systemic. Watch for any graying or mottling over the next hour — that's your cue to escalate acuity and consider ICU-level monitoring or airway readiness.\n\n- **Peripheral perfusion in croup remains intact as long as the child can oxygenate** — the obstruction sits above the lungs, so gas exchange proceeds normally even when stridor is present.\n- **Compensatory tachycardia (132 bpm) combined with pink skin means his cardiac output is adequate to maintain systemic oxygen delivery** despite the increased work of breathing from upper-airway resistance."
        },
        {
          "id": "posture",
          "label": "Posture and Positioning",
          "finding": "Resting semi-upright against mother; no longer rigidly self-positioning or resisting repositioning",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.posture.why",
          "why": "Idris's relaxation into a semi-upright posture — rather than the rigid sniffing position he adopted on arrival — signals that upper-airway obstruction is improving, not worsening. The sniffing position is an active compensatory maneuver; children choose it when they need maximum airway diameter to breathe, and they abandon it once obstruction eases.\n\n- **Postural relief behavior** reflects the child's own assessment of airway mechanics: rigid positioning requires sustained muscular effort and discomfort, so relaxation into his mother's arms means he's no longer fighting for each breath.\n- **Stridor persistence despite postural relaxation** remains the red flag here — resting stridor at 45 minutes post-racemic epi warrants a second dose, not reassurance that he's \"getting better\" just because he's calmer.\n\nWatch the retractions and stridor trend over the next 15–20 minutes; if both continue to decline without another epi dose, discharge planning becomes reasonable. If either worsens or plateaus, he needs repeat nebulization."
        }
      ],
      "labs": [
        {
          "id": "wbc",
          "name": "WBC",
          "value": "11.4",
          "unit": "×10³/µL",
          "ref": "5.0-15.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.wbc.why",
          "why": "The WBC of 11.4 is reassuringly normal for a 3-year-old, and it tells you this is most likely viral croup, not bacterial epiglottitis or early bacterial tracheitis. In croup, the leukocyte response is typically mild or absent because the disease is almost always caused by viruses — parainfluenza, influenza, RSV — not bacteria. A normal WBC paired with his clear lungs, soft neck, alert mental status, and lack of drooling rules out the toxic bacterial airway emergencies that would demand immediate airway management. The WBC sitting in the middle of the normal range (not left-shifted with bands, not elevated) confirms you're managing a self-limited viral illness, not a surgical airway problem — which means steroids plus repeat epinephrine buys time and lets the dexamethasone work over the next few hours rather than escalating to the ICU or OR.\n\n- **Viral infection** typically does not trigger a leukocytosis; bacterial tracheitis or epiglottitis would show an elevated WBC or bandemia signaling acute bacterial demand on the marrow.\n- **Normal WBC at this severity** is the pattern in classic parainfluenza croup and reassures you the stridor is airway edema, not a foreign body, abscess, or invasive infection."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "108",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.glucose.why",
          "why": "Glucose is normal — one less thing to fix in a toddler working hard to breathe.\n\n- **Glucose 108** sits in the normal range; mild stress hyperglycemia would be unsurprising but isn't present\n- A normal value argues against hypoglycemia contributing to fussiness or fatigue during the illness\n- Quick to check in any sick, poorly-feeding toddler — here it's reassuring and needs no action"
        },
        {
          "id": "vbgPh",
          "name": "VBG pH",
          "value": "7.34",
          "unit": "",
          "ref": "7.32-7.42",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.vbgPh.why",
          "why": "At pH 7.34, Idris is at the lower edge of normal — not acidemic, but not reassuring either. In croup with subglottic edema and increased work of breathing, mild acidosis signals the strain is real: anaerobic metabolism from labored respiration is beginning to outpace aerobic capacity. His pCO2 of 47 is unchanged from normal, which means his respiratory effort is holding his gas exchange stable *despite* the airway obstruction — if stridor worsens and work of breathing climbs, CO2 will lag behind lactate production and pH will drop into true acidosis.\n\n- **Respiratory acidosis threshold** is pCO2 >45 with pH <7.30; Idris sits just below that line because his tachypnea and retractions are compensating hard to blow off CO2 and sustain minute ventilation against airway resistance.\n- **Borderline pH with normal pCO2** tells you the child is working at the edge of compensation — any further airway narrowing will flip him from compensated to decompensated, and that's your cue to escalate beyond observation alone.\n\nWatch the trend at reassessment in 15–20 minutes; if pH drifts lower or pCO2 climbs while stridor persists, another epinephrine dose or escalation to higher-acuity support becomes necessary."
        },
        {
          "id": "vbgPco2",
          "name": "VBG pCO2",
          "value": "47",
          "unit": "mmHg",
          "ref": "41-51",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.vbgPco2.why",
          "why": "A pCO2 of 47 mmHg in the normal range tells you Idris is not yet fatiguing from his work of breathing — he's still compensating effectively despite the resting stridor and retractions. In croup, rising pCO2 (above 50) signals that respiratory muscle fatigue is setting in and the child is losing the ability to blow off CO2 against upper airway obstruction; that's the red flag for escalation to airway management. Idris's ability to maintain a normal pCO2 while working hard through stridor means his current respiratory reserve is intact and he can tolerate close observation with repeat epinephrine dosing while dexamethasone reaches peak effect. Watch for pCO2 creep upward on reassessment — that shift, not a single normal value, tells you fatigue is winning."
        },
        {
          "id": "vbgHco3",
          "name": "VBG HCO3",
          "value": "25",
          "unit": "mEq/L",
          "ref": "20-28",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.vbgHco3.why",
          "why": "Idris's bicarbonate is reassuringly normal, which tells you his acid-base picture is stable despite the upper-airway work — he's not drifting into respiratory acidosis yet.\n\n- **Normal HCO3 with normal pH and pCO2** confirms Idris is compensating well: he's breathing hard enough (RR 32, which is upper-normal for age) to blow off CO2 and avoid CO2 retention, which would drop pH and signal impending respiratory fatigue.\n- **Early croup doesn't produce metabolic derangement** — the physiology is airway edema and stridor, not tissue hypoxia or shock, so you'd expect labs to stay normal until late decompensation; this normal HCO3 is the reassuring baseline you'd hope to see at 45 minutes into treatment.\n\nThe work of breathing is real, but the acid-base stability means his oxygenation and ventilation are still adequate — he has time for the dexamethasone to work and for repeat epi dosing to buy more margin."
        },
        {
          "id": "spo2SpotCheck",
          "name": "SpO2 (blow-by O2)",
          "value": "95",
          "unit": "%",
          "ref": "95-100",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.spo2SpotCheck.why",
          "why": "SpO2 of 95% on blow-by oxygen is reassuring because Idris is maintaining oxygenation despite moderate upper-airway obstruction and work of breathing — he's not yet sliding into the hypoxemia that signals decompensation.\n\n- **Upper-airway stridor limits inspiratory flow** but does not impair oxygen diffusion across the alveolar membrane; as long as air reaches the lungs, SpO2 stays normal even when work of breathing is elevated.\n- **Accessory muscle recruitment and retractions** are the body's way of generating higher negative pressure to overcome the stridor; SpO2 drops only when that effort fails to deliver adequate tidal volume and alveolar ventilation declines.\n\nThe combination of normal SpO2 with persistent resting stridor and retractions tells you this child is still compensating — his physiology is working hard but succeeding — which supports a second racemic epi dose rather than sending him home into the rebound window."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to vital signs monitor",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.vsMonitor.fb",
            "fb": "Continuous pulse oximetry and heart rate tracing lets you catch stridor rebound and early fatigue before they become crises — croup can flip from stable to airway emergency in minutes as edema waxes and wanes. Idris's tachycardia (132 bpm, well above the 98–140 range for a 3-year-old) and retractions reflect effort against upper-airway resistance; trending these on the monitor shows whether the second racemic epi dose is working or whether he's beginning to tire. A rising HR without improvement in stridor, or SpO2 drift below 94%, signals decompensation long before he stops compensating — your cue to escalate airway management.\n\n- **Early warning for stridor rebound.** Croup is notoriously biphasic; partial response at 45 minutes often precedes re-tightening as the first epi dose wears off, which is why a second dose or observation window is standard practice.\n- **Work of breathing trends.** Rising HR with persistent retractions despite treatment means fatigue is setting in; falling HR with clearing stridor means the steroid is winning and you can discharge with confidence.\n\nWatch the screen, not just the child's apparent comfort — kids compensate beautifully until they suddenly don't.",
            "pri": 1,
            "ok": true
          },
          "stethoscope": {
            "id": "stethoscope",
            "label": "Auscultate chest and neck",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.stethoscope.fb",
            "fb": "Listening to Idris's airway and lungs lets you confirm the stridor originates above the glottis, not from bronchospasm or lower-airway disease — a critical distinction because croup and bronchiolitis look superficially similar but need entirely different treatments. Clear lung fields with transmitted upper-airway noise rules out lower-airway involvement and keeps you anchored on the croup diagnosis.\n\n- **Inspiratory stridor with clear lungs** is the hallmark of croup (laryngeal edema), not bronchiolitis (lower-airway mucus plugging) or asthma (bronchospasm).\n- **Auscultation gates the next decision:** persistent resting stridor 45 minutes post-epinephrine with clear lungs means the edema is still significant enough to warrant another dose, not observation alone.\n\nReassess the chest every 15–20 minutes post-epinephrine — if stridor worsens or you hear new wheeze or crackles, escalate urgently.",
            "pri": 1,
            "ok": true
          },
          "nebSetup": {
            "id": "nebSetup",
            "label": "Set up nebulizer for repeat inhaled treatment",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.nebSetup.fb",
            "fb": "Repeat inhaled racemic epinephrine is the right move when stridor persists 45 minutes after the first dose — it buys time while dexamethasone climbs toward peak effect over the next few hours. Racemic epinephrine's alpha-1 vasoconstriction shrinks subglottic edema acutely; the effect lasts 2–4 hours, and a second dose is standard practice in moderate croup that hasn't fully cleared. Idris has the clinical hallmarks: resting stridor, retractions, no drooling or tripod posture (which would signal epiglottitis), and clear lower airways. His SpO2 is stable, he's not exhausted, and there's no contraindication to a second nebulized dose. IM epi carries more systemic effect and risk of tachycardia in a child already at 132 bpm; nebulized keeps the drug local to the airway. No IV access needed — inhaled delivery is faster to effect and avoids an unnecessary stick when the child is already scared and stridor-ing.",
            "pri": 1,
            "ok": true
          },
          "o2Mask": {
            "id": "o2Mask",
            "label": "Apply supplemental oxygen by mask",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.o2Mask.fb",
            "fb": "Supplemental oxygen by mask bridges the gap between now and steroid effect — it keeps SpO2 buffered while dexamethasone reduces airway edema over the next 4–6 hours. Idris's SpO2 is holding at 95% on blow-by, but resting stridor this persistent after one racemic epi dose signals ongoing upper-airway narrowing; a mask ensures he doesn't dip below safe margin if work of breathing climbs or edema temporarily worsens before the steroid peaks.\n\n- **Oxygen reserve in croup** protects against acute desaturation from dynamic airway collapse during agitation, coughing, or position changes; even well-compensated children can decompensate rapidly if hypoxemia triggers panic and increased work of breathing.\n- **Low-flow oxygen via mask** (4–6 L/min) is gentler than tight-fitting non-rebreather in a frightened toddler and maintains delivery without agitation — the goal is steady oxygenation, not maximal FiO2, so you don't force cooperation that costs him.\n\nKeep the mask loose and let him hold it or his mom assist; forced tight-fitting masks provoke the exact agitation that worsens stridor.",
            "pri": 1,
            "ok": true
          },
          "ivKit": {
            "id": "ivKit",
            "label": "Place peripheral IV",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.tools.ivKit.fb",
            "fb": "Peripheral IV access is the right move when you're committing to a second round of nebulized racemic epinephrine—it gives you a route for dexamethasone booster or any medication you need fast if stridor suddenly worsens. But Idris doesn't need an IV *to give him the epinephrine itself*; he can take the second dose nebulized without it, and he's stable enough right now that you can defer the stick. **IM or nebulized epinephrine for croup doesn't require IV access**, and placing a line on a frightened toddler with borderline airway breathing burns his calm reserve—the same calm that's keeping his work of breathing manageable. An IV is a safety margin, not a prerequisite for treatment. **Hold off on the line unless his stridor worsens or you need dexamethasone IV** (which you don't—PO or IM dexamethasone is equally effective and less likely to distress him). After the second epi dose settles in over the next 3–4 hours, if he's clearly improving, you can still send him home without ever needing puncture. If he's not improving, *then* secure the line and commit to admission with a dexamethasone booster dose.",
            "pri": 3,
            "ok": false
          },
          "intubationKit": {
            "id": "intubationKit",
            "label": "Prepare intubation kit at bedside",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.tools.intubationKit.fb",
            "fb": "Intubation is the last resort in croup, not a preparatory step at this stage — Idris is oxygenating well (SpO2 95%), maintaining his airway, and showing measurable improvement 45 minutes post-epinephrine. Prepare-at-bedside thinking commits you to a cascade mentality when croup needs patience and serial reassessment instead. Racemic epinephrine works over hours; a second dose now is the right move for persistent resting stridor. Intubation becomes indicated only if stridor worsens, work of breathing exhausts him, or SpO2 drops despite supplemental oxygen — none of which is present. Preparing the kit signals you're treating the anxiety of the clinical picture rather than the actual physiology. Keep the kit nearby and mentally ready, but don't unfold it; your job here is another nebulized epinephrine dose and close 15-minute reassessment.",
            "pri": 3,
            "ok": false
          },
          "headOfBedElevation": {
            "id": "headOfBedElevation",
            "label": "Elevate head of bed",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.tools.headOfBedElevation.fb",
            "fb": "Idris has croup with partial response to epinephrine and dexamethasone — his next move is reassessment at the bedside and a second racemic epi dose if stridor persists, not positional support. Head-of-bed elevation is a mainstay of raised intracranial pressure management, where gravity helps drain CSF and venous blood from the cranial vault. Croup is upper-airway inflammation and bronchospasm, not increased intracranial pressure — the stridor you hear comes from subglottic edema, not from cerebral swelling. Positioning helps comfort and work of breathing in many respiratory conditions, but it doesn't shrink the inflamed subglottic airway or buy time while dexamethasone peaks. Racemic epinephrine's alpha-1 vasoconstriction directly targets the edema driving the stridor; that's what this child needs now, not the bed angle.",
            "pri": 5,
            "ok": false
          }
        },
        "meds": {
          "racemicEpi": {
            "id": "racemicEpi",
            "label": "Administer repeat racemic epinephrine via nebulizer",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.meds.racemicEpi.fb",
            "fb": "Repeat racemic epinephrine at 45 minutes post-first dose is the right call when stridor persists despite dexamethasone — it buys time for the steroid to work without committing to admission or escalation. Racemic epinephrine's alpha-1 vasoconstriction shrinks the subglottic edema that narrows the airway in croup, but the effect lasts only 2–4 hours; a single dose followed by nothing guarantees return of stridor as it wears off. Dexamethasone takes 4–6 hours to peak and addresses the root inflammation, but Idris needs relief now while that's happening. The standard protocol is repeat nebulized doses q2–4h as needed — a child with persistent resting stridor and retractions at 45 minutes clearly needs another dose rather than watchful waiting. Give 0.5 mL of 2.25% solution; observe 3–4 hours post-dose for rebound before discharge, as some children rebound when the dose wears off.\n\n- **Symptom rebound in croup** happens when a single epinephrine dose wears off and edema re-expands; repeat dosing prevents this cycle and prevents unnecessary admission.\n- **Dexamethasone latency** means the first hours post-arrival are the highest-risk window; repeat epinephrine bridges the gap until steroid anti-inflammatory effect takes hold.",
            "pri": 2,
            "ok": true
          },
          "dexamethasone": {
            "id": "dexamethasone",
            "label": "Administer second dose dexamethasone 0.6 mg/kg (8.4 mg)",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.meds.dexamethasone.fb",
            "fb": "Dexamethasone dosing in croup is 0.6 mg/kg once, not repeated doses — redosing is not standard practice and doesn't improve outcomes. Dexamethasone works by reducing subglottic edema via glucocorticoid anti-inflammatory action, a process that unfolds over 4–6 hours and peaks around 12–24 hours; a second dose within the same treatment window adds no benefit and wastes a steroid exposure. Idris got his first dose 45 minutes ago, and his retractions are already less severe than on arrival — that's the dexamethasone starting to work. The persistent resting stridor calls for another racemic epi nebulization to bridge the gap while the steroid continues its course, not for a redose of steroid.\n\n- **Single-dose croup protocol** is supported by AAP guidance and major pediatric ED pathways; repeat dexamethasone within 24 hours adds no documented advantage for uncomplicated croup.\n- **Racemic epi's duration is 2–4 hours**, so a second dose every 4–6 hours is both appropriate and evidence-based for moderate-severe croup that hasn't fully resolved.",
            "pri": 3,
            "ok": false
          },
          "albuterol": {
            "id": "albuterol",
            "label": "Administer albuterol via nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[3].actions.meds.albuterol.fb",
            "fb": "Within the upper-airway pack for croup, the intervention that works is dexamethasone plus racemic epinephrine to reduce subglottic edema; albuterol targets lower-airway bronchospasm, not the fixed narrowing above the thoracic inlet. Albuterol's beta-2 agonism relaxes smooth muscle in the bronchi and bronchioles, which is the right mechanism for asthma or bronchiolitis. Idris's resting stridor and retractions come from subglottic swelling, not distal airway collapse — the sound transmits from above, and his lungs are clear throughout. A second dose of racemic epi now, 45 minutes after the first, is the bedside move to hold him over while dexamethasone peaks over the next few hours.",
            "pri": 4,
            "ok": false
          },
          "ipratropium": {
            "id": "ipratropium",
            "label": "Administer ipratropium via nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[3].actions.meds.ipratropium.fb",
            "fb": "Within the respiratory pack for croup, the effective first-line therapies are dexamethasone (which Idris has already received) and racemic epinephrine (which he got 45 minutes ago and needs reassessment for possible repeat dosing). Ipratropium is an anticholinergic that blocks vagal bronchoconstriction and is standard in asthma exacerbations where it synergizes with beta-2 agonists to relax lower-airway smooth muscle. Croup's pathology is subglottic edema and upper-airway narrowing — ipratropium doesn't reach that territory and adds no benefit to the steroid-epinephrine framework. The retractions and resting stridor at 45 minutes signal inadequate response to the first epi dose; the next move is reassess for repeat racemic epi or observation with close trending, not a drug from the asthma playbook.",
            "pri": 4,
            "ok": false
          },
          "epiIM": {
            "id": "epiIM",
            "label": "Administer epinephrine IM 0.01 mg/kg (0.14 mg)",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.meds.epiIM.fb",
            "fb": "Epinephrine IM is the first-line drug for anaphylaxis — not for croup. Anaphylaxis causes biphasic mast cell–mediated airway edema and vascular collapse; IM epi's alpha-1 vasoconstriction and beta-2 bronchodilation directly reverse the underlying mechanism. Croup is viral-induced subglottic edema, and the treatment is dexamethasone (which Idris has already received) plus nebulized racemic epinephrine if stridor persists despite steroids. Racemic epi's topical vasoconstriction shrinks the swollen subglottic mucosa from inside the airway; IM epi doesn't reach that site in croup and offers no advantage over the inhaled route. Idris has no anaphylaxis features — no urticaria, no angioedema, no wheezing, no hypotension. His persistent stridor at 45 minutes warrants a second nebulized racemic epi dose, not an IM injection meant for a different disease.",
            "pri": 3,
            "ok": false
          },
          "acetaminophen": {
            "id": "acetaminophen",
            "label": "Administer acetaminophen 15 mg/kg PO (210 mg)",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.meds.acetaminophen.fb",
            "fb": "Idris needs airway management right now — a second dose of racemic epinephrine to shrink subglottic edema while dexamethasone takes effect over the next few hours. Acetaminophen reduces fever by resetting the hypothalamic set point, which is the right move for comfort in many febrile children, but fever itself is not driving Idris's airway obstruction — viral croup is. His temperature of 38.1°C is a marker of the inflammation, not the primary problem. Treating the fever won't open his airway or reduce his work of breathing; the stridor and retractions persist because subglottic mucosa is still swollen despite the first epi dose wearing off. Save acetaminophen for after his airway is secure and his comfort is the focus — right now, the clinical priority is preventing stridor progression and exhaustion.",
            "pri": 5,
            "ok": false
          },
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer NS 20 mL/kg IV bolus (280 mL)",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.meds.nsBolus.fb",
            "fb": "Idris needs airway management and time for dexamethasone to work — not intravascular volume. An IV bolus addresses shock or severe dehydration; this child has normal perfusion (cap refill 2 sec, pink skin, strong central pulses), normal blood pressure, and no signs of shock. A 20 mL/kg bolus would dilute his serum osmolality and add no therapeutic benefit to croup, while placing an IV in an upper-airway emergency risks agitating him and worsening stridor. The right call here is a second nebulized racemic epinephrine dose (repeat at 4–6 hours if needed) while the dexamethasone continues to work, keeping him calm and observing for rebound stridor over the next 3–4 hours before deciding on discharge.\n\n- **IV access in croup** is appropriate when you're planning a second epi dose and want the safety net, but only if you can place it without distressing the child; many clinicians defer IV access entirely in stable croup and use IM or inhaled routes instead.\n- **NS boluses** are the backbone of septic and hemorrhagic shock resuscitation, not for upper-airway obstruction; giving fluid to a perfusing child with stridor wastes time and risks agitation that worsens airway compromise.",
            "pri": 5,
            "ok": false
          }
        }
      }
    }
  ],
  "visuals": [],
  "patient": {
    "name": "Idris Okonkwo",
    "ageLabel": "3 years old",
    "weightKg": 14,
    "sex": "M",
    "cc": "stridor and barky cough from croup"
  },
  "emsReport": "Paramedic report: We've got a 3-year-old male, Idris Okonkwo, 14 kilos, brought in by his parents after waking up around midnight with a barky, seal-like cough and noisy breathing. No fever at home, no drooling, no change in voice quality beyond mild hoarseness. Mom says it came on suddenly — he was fine at bedtime. No prior history of croup or airway issues. No medications given at home, no interventions from us en route. He was crying on scene but is calmer now, though the stridor is still audible at rest.",
  "learnMore": "Croup, or laryngotracheobronchitis, is the most common cause of acute upper airway obstruction in children aged 6 months to 3 years, with a peak incidence around 18-24 months. It is almost always viral — parainfluenza type 1 accounts for the majority of cases. The classic presentation is the sudden nocturnal onset of a barky cough, inspiratory stridor, and hoarseness due to subglottic edema narrowing a small airway. Because resistance scales as the fourth power of the radius (Poiseuille), even 1 mm of circumferential edema dramatically increases airway work in a toddler.",
  "curveball": null,
  "source": "builtin",
  "reassessment": {
    "narrative": "Thirty minutes after the second racemic epinephrine treatment, Idris has settled considerably. His stridor is now only faintly audible with crying and is absent at rest — you have to lean in to hear it. The subcostal retractions have resolved, his respiratory rate has come down to 26, and his SpO2 is holding at 97% on room air now that the blow-by oxygen has been removed. He's eaten a few crackers his mom brought, which is a reliable bedside sign that a croupy toddler is feeling better. Heart rate has settled to 118, consistent with his baseline for a mildly febrile 3-year-old. He's been observed for a full 2 hours from his last racemic epi dose with no rebound, and the dexamethasone is well on board.",
    "vitals": {
      "hr": "118",
      "rr": "26",
      "bp": "100/62",
      "spo2": "97",
      "temp": "38.1",
      "cap": "2 sec"
    },
    "outcome": "admitted-floor",
    "stabilizationSummary": "Idris has completed a full 2-hour post-epinephrine observation window with no rebound stridor. He's being admitted to the inpatient pediatric unit overnight for monitoring given two epinephrine doses were required; the dexamethasone is on board and will continue to work through the night. His parents have been counseled on return precautions and the expected natural course of croup over the next 48-72 hours."
  },
  "debrief": {
    "summary": "Idris presented with moderate-to-severe croup — resting stridor, subcostal and suprasternal retractions, SpO2 dipping to 94%. He responded partially to dexamethasone and racemic epinephrine but rebounded at 45 minutes, which is a textbook croup behavior and a clear signal that a second epinephrine treatment was warranted. The key teaching moment in Round 2 is recognizing that resting stridor at 45 minutes post-epi is not a borderline finding — it's an indication to treat again and to plan for admission. Any child who requires two racemic epinephrine treatments needs inpatient observation regardless of how good they look in the moment.",
    "keyTeaching": [
      "Resting stridor persisting 45 minutes after racemic epinephrine is a sign of rebound and warrants a repeat dose — do not talk yourself out of it because the child looks 'better than before.'",
      "Any child requiring two or more doses of epinephrine for croup must be admitted for at least a 2-hour post-final-dose observation window; discharge after two epi doses is not safe practice.",
      "Dexamethasone takes 2-6 hours to reach full anti-inflammatory effect — racemic epinephrine bridges the acute episode while the steroid works, not the other way around.",
      "A second dose of dexamethasone is not indicated; a single dose of 0.6 mg/kg provides 48-72 hours of effect and repeating it adds steroid exposure without clinical benefit.",
      "IM epinephrine (anaphylaxis dose) is not the right tool for croup — racemic epinephrine via nebulizer delivers topical vasoconstriction to the subglottic mucosa; systemic IM epi at anaphylaxis dosing bypasses that mechanism and introduces unnecessary cardiovascular side effects."
    ],
    "physiologyDeepDive": [
      {
        "id": "subglottic-edema-mechanism",
        "title": "Why Croup Causes Stridor: Subglottic Anatomy and the Poiseuille Effect",
        "_slotRef": "debrief.physiologyDeepDive.subglottic-edema-mechanism.content",
        "content": "Croup is a disease of subglottic narrowing, and the reason a small amount of swelling in that space causes such dramatic airway obstruction has everything to do with the physics of flow through a tube. The subglottis is the tightest part of the pediatric airway — in a 3-year-old like Idris, it's already narrower than the glottis itself, and airway resistance increases dramatically with even modest edema. The Poiseuille principle explains why: resistance to flow through a tube is inversely proportional to the fourth power of the radius, meaning a 1 mm reduction in subglottic diameter can double or triple the work of breathing needed to push air through.\n\n- **The subglottis sits just below the vocal cords, between the glottis and the thoracic trachea.** In infants and toddlers, it's the narrowest part of the larynx — narrower than the vocal cords themselves — making it the most vulnerable point for edema-induced obstruction. In adults, the narrowest point is the vocal cords; in children, it's 2–3 mm below them.\n\n- **Croup virus (usually parainfluenza type 1, RSV, or influenza A) infects the subglottic mucosa, triggering submucosal edema.** The edema is predominantly in the **lamina propria** — the loose connective tissue layer directly under the epithelium. This layer can swell considerably in children because the submucosa is more vascularized and more compliant in young kids than in adults.\n\n- **Inspiratory stridor is the acoustic signature of subglottic narrowing.** During inspiration, negative intrathoracic pressure is generated by the diaphragm and intercostal muscles; this pulls the already-narrowed subglottis inward further, turbulating the air column and producing the high-pitched, musical stridor you hear. During expiration, positive pressure inside the airway pushes outward, which is why expiratory stridor doesn't happen in simple croup.\n\n- **The Poiseuille relationship (R = 8ηL/πr⁴) is why the clinical picture changes abruptly with small changes in swelling.** If a 3-year-old's subglottic radius is 4.5 mm and edema narrows it to 3.5 mm (a 1 mm reduction), resistance increases by a factor of about 3. A 1 mm further reduction to 2.5 mm increases it another 3-fold. **The work of breathing escalates non-linearly as the tube narrows** — you see a child go from moderate stridor and retractions to severe distress in hours as swelling progresses.\n\n- **Dexamethasone reduces subglottic edema by suppressing mucosal inflammation and decreasing vascular permeability.** It doesn't work immediately — peak effect is 10–30 minutes — but it blunts further swelling and allows recovery. At 0.6 mg/kg IV or IM (8.4 mg in Idris's case), it's the most evidence-supported intervention for moderate-to-severe croup.\n\n- **Racemic epinephrine is a beta-2 agonist delivered as inhaled mist; it causes mucosal vasoconstriction and reduces subglottic edema acutely.** The onset is 15 minutes and duration is 1–2 hours. It's a **temporizing bridge** — it buys time for dexamethasone to work but doesn't prevent rebound swelling, so it must be paired with corticosteroids, never used alone.\n\n- **The stridor itself is not the primary danger — the narrowed airway is.** Stridor is audible because turbulent flow is noisy; but the real threat is that as resistance increases, the child must generate higher negative intrathoracic pressure to breathe. This eventually overwhelms the respiratory muscles, causing fatigue and hypoventilation, which is when CO₂ rises and the child decompensates.\n\n- **Agitation and crying worsen stridor acutely because they increase respiratory demand and airway resistance simultaneously.** A child who cries generates forceful expiration that then requires forceful inspiration through the narrowed subglottis. This is why keeping Idris calm and with his mother, and avoiding precipitants of fear (like aggressive examination or oxygen mask placement without warning), is part of the treatment strategy itself.\n\n- **Most children with croup don't need intubation if they receive dexamethasone and racemic epinephrine promptly.** Intubation is reserved for stridor at rest with severe retractions unresponsive to two doses of epinephrine, or for signs of fatigue (dropping respiratory rate with rising CO₂, altered mental status, exhaustion). The goal is to avoid the airway entirely through anti-inflammatory and vasoconstrictive therapy.\n\n**TL;DR:** Subglottic edema causes stridor because the subglottis is the narrowest part of the pediatric airway and Poiseuille physics means even 1 mm of swelling dramatically increases resistance to breathing. Dexamethasone reduces edema; racemic epinephrine is the immediate bridge; keeping the child calm prevents agitation-induced airway worsening."
      },
      {
        "id": "racemic-epi-rebound",
        "title": "Racemic Epinephrine Rebound: What It Is and Why It Happens",
        "_slotRef": "debrief.physiologyDeepDive.racemic-epi-rebound.content",
        "content": "Racemic epinephrine is the workhorse treatment for moderate-to-severe croup, but it has a built-in time limit: the drug wears off in 2–4 hours, and when it does, the subglottic swelling can rebound to the same level it started at or worse. This rebound is not a treatment failure; it's the pharmacology of the drug colliding with the biology of viral laryngeal inflammation. Understanding the mechanism and the timeline lets you avoid the trap of discharging a patient who looks great at 90 minutes and then crashes at home.\n\n- **Racemic epinephrine is a 50/50 mix of D and L isomers** that acts as a nonselective adrenergic agonist, hitting α1, α2, and β2 receptors in the subglottic mucosa. The α-adrenergic effect causes mucosal vasoconstriction and reduces capillary fluid leak into the subglottic tissues; the β2 effect relaxes smooth muscle. Together they drop subglottic edema within 10–15 minutes of nebulized delivery, sometimes dramatically.\n\n- **The L-isomer (levoepinephrine) is 8–12 times more potent than the D-isomer and accounts for most of the clinical effect**, but the D-isomer adds minor β2 activity. This is why levoepinephrine (available as a single-isomer nebulized solution) works but racemic epinephrine remains the standard — the minor β2 component may offer a small edge in airway smooth muscle relaxation, though the evidence is weak.\n\n- **The drug does not treat the inflammation itself — it only manages the swelling.** Viral croup is driven by submucosal edema from viral infection and the host inflammatory response. Epinephrine buys time by squeezing fluid out of the interstitium back into the vasculature, but the underlying viral inflammation is still marching on. Once the vasoconstriction wears off, that inflammation will swell the tissues again.\n\n- **Rebound occurs in roughly 10–30% of treated patients**, with higher rates in moderate-to-severe cases and in those treated only once. It happens because the drug's alpha effect fades faster than the body can clear the inflammatory mediators — the airway goes from \"squeezed\" back to \"inflamed and full of fluid\" in a matter of hours, often when you're not watching.\n\n- **This is why dexamethasone must be given alongside or before epinephrine — it is the only drug that reduces the underlying inflammation.** Dexamethasone takes 30–60 minutes to peak and works over hours, but it actually shrinks the problem at the source. The combination of epinephrine (fast, temporary relief) plus dexamethasone (slower, sustained anti-inflammatory effect) is what breaks the rebound cycle.\n\n- **The classic rebound scenario: patient looks great at 2 hours, parents are reassured, child goes home, stridor recurs at 3 a.m. when vasoconstriction has worn off but dexamethasone hasn't finished working.** Idris in this scenario got both medications, which dramatically lowers rebound risk, but a patient treated with epinephrine alone or sent home too early is at high risk.\n\n- **Observation time after epinephrine is measured in hours, not minutes.** Most institutions observe for at least 3–4 hours post-treatment. If the child improves, maintains the improvement, and remains stridor-free at rest for 2+ hours off supplemental oxygen, discharge is safer. If stridor recurs during observation, repeat nebulized epinephrine plus consideration of a second dose of dexamethasone (though repeat dexamethasone within 12 hours is typically avoided).\n\n- **Rebound is not a reason to avoid epinephrine or to give epinephrine reluctantly** — it's a reason to give it appropriately (with dexamethasone, in a monitored setting) and to plan for observation and follow-up. A child in moderate-to-severe croup without epinephrine is at risk of complete airway obstruction; a child with epinephrine plus dexamethasone has an excellent outcome, provided you don't discharge them prematurely.\n\n**TL;DR:** Racemic epinephrine wears off in 2–4 hours and subglottic swelling can rebound because epinephrine only squeezes out fluid — it doesn't stop the inflammation. Dexamethasone is your rebound prevention, and observation for at least 3–4 hours post-treatment is non-negotiable."
      },
      {
        "id": "dexamethasone-mechanism",
        "title": "How Dexamethasone Works in Croup — and Why It Takes Time",
        "_slotRef": "debrief.physiologyDeepDive.dexamethasone-mechanism.content",
        "content": "Dexamethasone in croup doesn't shrink the swollen subglottic airway in minutes — it takes 30 minutes to hours to see the real benefit. What it does is block the inflammatory cascade at the nuclear level, so the edema stops propagating and gradually resorbs. Understanding this timeline is crucial, because it explains why racemic epinephrine (which works in minutes) is the bridge therapy, and why dexamethasone is the real anchor that keeps stridor from rebounding after the epi wears off.\n\n- **Croup is viral croup is subglottic edema**, almost always parainfluenza virus, occasionally RSV or influenza. The inflammation sits below the vocal cords in the cricoid ring — the narrowest part of the pediatric airway — and any swelling there hits the resistance exponentially hard. A small amount of edema in an adult larynx is annoying; the same edema in a 3-year-old's cricoid is an airway emergency because the cross-sectional area is already so small.\n\n- **Dexamethasone is a long-acting glucocorticoid** that crosses the blood-brain barrier and the airway epithelial barrier. It binds to intracellular glucocorticoid receptors, translocates to the nucleus, and suppresses transcription of pro-inflammatory cytokines (TNF-alpha, IL-6, IL-8) and adhesion molecules. This is not a local topical effect — it's systemic anti-inflammation that happens to benefit the airway.\n\n- **The dose is 0.6 mg/kg IV/IM/PO; Idris at 14 kg gets 8.4 mg.** PO and IM are equally effective. The pediatric evidence base (Geelhoed, Stachnik, Russell trials) shows benefit at 0.15, 0.3, and 0.6 mg/kg; 0.6 is standard and produces maximal effect. Higher doses don't improve outcomes and aren't recommended.\n\n- **Onset is 30 minutes to 1 hour, peak effect 4–6 hours**, but the cytokine suppression persists for 24–48 hours. This is why a single dose covers the child for the rest of the illness — you're not giving repeat doses every 6 hours like you might with hydrocortisone in sepsis. One hit upfront, then let the biology play out.\n\n- **Racemic epinephrine works in 10–15 minutes by completely different mechanism: alpha-2 adrenergic vasoconstriction** of the capillary beds feeding the subglottic mucosa. It shrinks the edema acutely, but the effect is temporary — metabolism of the drug (or receptor desensitization) means the vasoconstriction wears off in 1–4 hours. Combined, epi buys time and dexamethasone fixes the problem.\n\n- **The rebound risk is real if you use epi alone** — stridor and work of breathing can return 2–4 hours after a single nebulized epi dose if no dexamethasone is on board. Many of the \"epi fail\" cases in the literature are actually \"epi without dexamethasone\" cases where rebound occurred.\n\n- **Oral dexamethasone in a crying, frightened child risks aspiration and struggles with compliance**, but it's equally effective as IM dexamethasone. The scenario shows a 3-year-old who won't tolerate close contact — the IM route (or IV if an IV is placed) respects the clinical reality. One 8.4 mg IM dose is standard; no redosing is needed unless the child doesn't receive the initial dose.\n\n- **The anti-inflammatory effect is not specific to croup** — dexamethasone helps in any upper airway obstruction with an inflammatory component (acute epiglottitis, allergic angioedema, post-extubation stridor). What varies is the urgency: epiglottitis needs airway protection first; croup almost never does. Dexamethasone is the anchor across all of them.\n\n- **Dexamethasone does NOT replace airway management if the child decompensates.** If stridor worsens to biphasic, intercostal retractions become maximal, SpO2 drops below 90%, or the child fatigues, you need airway support — intubation if necessary. Dexamethasone is preventive and supportive, not a substitute for emergency airway skills.\n\n- **The VBG in Phase 2 is reassuring: pH 7.36, pCO2 44, HCO3 24** — no hypercapnia, no metabolic derangement. This confirms Idris is still compensating, not tiring. The combination of normal blood gas, intact mental status, and cap refill of 2 seconds means he's a good candidate for conservative management with dexamethasone and epi nebulization rather than immediate intubation.\n\n**TL;DR:** Dexamethasone takes 30 minutes to an hour to work because it's blocking cytokine transcription, not shrinking edema instantly; racemic epinephrine bridges the gap with immediate vasoconstriction. One dexamethasone dose covers the entire illness, preventing the rebound stridor that occurs if you use epi alone."
      },
      {
        "id": "croup-severity-scoring",
        "title": "Croup Severity: Using the Westley Score at the Bedside",
        "_slotRef": "debrief.physiologyDeepDive.croup-severity-scoring.content",
        "content": "The Westley croup score puts a number on what you already see — stridor, retractions, air entry, cry strength, and mental status — to decide whether a kid needs just steroids or steroids plus epinephrine. It's tempting to think of it as academic, but it's actually a bedside triage tool that keeps you from under-treating mild croup and over-treating the truly severe cases with unnecessary intubation prep. Idris's presentation sits in the moderate zone where the score becomes a decision-maker.\n\n- The Westley score uses five components: **stridor quality (0–2 points), retractions (0–3 points), air entry (0–2 points), cry (0–2 points), and level of consciousness (0–5 points)**. Total is 0–13; scores below 3 are mild, 3–5 are moderate, 6–11 are severe, and 12–13 are impending airway emergency. Idris's upright posture, subcostal and suprasternal retractions, clear lung fields, and normal alertness put him solidly in the moderate band.\n\n- **A child with moderate croup (Westley 3–5) who responds to dexamethasone alone can often go home**; those who don't respond need to come back for nebulized epinephrine (or get it in the ED and stay for observation). Idris's score and SpO2 of 94% on room air mean he should get steroids first, then be reassessed in 30–60 minutes to see if epinephrine is needed.\n\n- **The cry is a real clinical marker, not a filler item.** A strong, vigorous cry means the vocal cords are mobile and the child has enough airway to generate high flows. A hoarse or weak cry suggests either vocal cord inflammation so severe that normal phonation is impaired, or respiratory fatigue. Idris's positioning and distress imply he's still crying robustly when he does cry, which keeps him in moderate rather than severe.\n\n- **Air entry is the single best predictor of which kids will crash.** Normal air entry bilaterally (what Idris has) means the stridor is transmitting but the lower airways aren't collapsing yet. Decreased or absent air entry means the entire larynx is swollen shut or nearly so — those kids need epinephrine urgently and may need airway support. The Westley score captures this with \"normal air entry\" = 2 points; \"decreased\" = 1; \"severely decreased or absent\" = 0.\n\n- **Retractions quantify how hard the kid is working to move air through a narrowed upper airway.** Suprasternal and intercostal retractions (what Idris shows) earn 2 points and are consistent with moderate disease. Severe retractions involve the subcostal muscles AND accessory muscles (sternocleidomastoid, scalene); if you see those AND stridor at rest, the score climbs to severe and epinephrine becomes urgent.\n\n- **The decision rule: mild croup gets only observation or dexamethasone; moderate croup gets dexamethasone and can go home OR gets dexamethasone plus one dose of nebulized epinephrine with observation; severe croup gets epinephrine, dexamethasone, and intubation planning.** This is why the score matters — it prevents you from sending home a moderately-ill kid who decompensates and also prevents you from over-medicalizing a mild case.\n\n- **Dexamethasone 0.6 mg/kg PO or IM is the cornerstone of all croup management**, regardless of severity. At 14 kg, Idris gets 8.4 mg. Single-dose IM or PO steroids reduce croup duration by about 24 hours and reduce reintubation risk. The effect takes 4–6 hours to peak, so don't expect immediate stridor relief; the improvement comes over hours, not minutes.\n\n- **Racemic epinephrine (0.05 mL/kg in 3 mL normal saline via nebulizer, max 0.5 mL) has an onset of 10–15 minutes and duration of 2–4 hours.** It shrinks subglottic edema by mucosal vasoconstriction and reduced capillary permeability. For moderate croup that isn't improving on steroids alone, or for moderate croup in the ED (where observation time is limited), one nebulized dose is standard. Idris's SpO2 of 94% and work of breathing make him a reasonable candidate for one early dose to buy time while dexamethasone takes effect.\n\n- **Rebound stridor after epinephrine wears off is real but not absolute.** About 10–20% of kids get rebound swelling 2–4 hours after a single epi neb dose. This doesn't mean \"don't give epi\" — it means observe for those hours or have a plan to re-neb if symptoms return. Many guidelines now support dexamethasone alone as adequate for moderate croup if you can ensure follow-up; epi is more for moderate croup in settings where observation isn't possible (rural ED, long transport home).\n\n- **The Westley score doesn't replace clinical judgment on whether the child can be discharged.** A Westley 5 kid with good response to steroids and epi, normal work of breathing afterward, and a reliable family might go home. A Westley 4 kid with any sign of deterioration or a unreliable social situation should stay for observation. The score is a decision support, not a mandate.\n\n**TL;DR:** The Westley score (mild <3, moderate 3–5, severe 6–11) sorts croup into treatment tiers: mild gets observation, moderate gets steroids ± one epi neb depending on setting and response, severe gets epi plus intubation prep. Idris sits in moderate, making dexamethasone mandatory and early racemic epinephrine reasonable to prevent escalation."
      }
    ]
  },
  "stabilizationSummary": "Idris has completed a full 2-hour post-epinephrine observation window with no rebound stridor. He's being admitted to the inpatient pediatric unit overnight for monitoring given two epinephrine doses were required; the dexamethasone is on board and will continue to work through the night. His parents have been counseled on return precautions and the expected natural course of croup over the next 48-72 hours.",
  "tier": 1,
  "icon": "🫁",
  "tagline": "3-year-old · Croup with stridor",
  "description": "A 3-year-old with a barky cough and stridor at rest — moderate croup, with a racemic-epi rebound in round two."
};

export var SC4 = {
  "schemaVersion": "5.4.1",
  "id": "anaphylaxis-bee-sting",
  "title": "Stung at the Picnic",
  "subtitle": "A nine-year-old collapses minutes after a bee sting — the EpiPen bought some time, but the fight isn't over.",
  "norms": {
    "hr": [
      70,
      110
    ],
    "rr": [
      16,
      24
    ],
    "sbp": [
      90,
      120
    ],
    "dbp": [
      55,
      75
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
      "phaseIndex": 0,
      "id": "assess",
      "stageType": "assess",
      "round": 1,
      "title": "First Look",
      "narrative": "Jaya rolls in on the EMS stretcher — she's sitting bolt upright, tripoding slightly, with visible hives across her chest and arms and obvious lip swelling. She answers questions in clipped sentences and looks frightened. You can hear an expiratory wheeze from across the room without a stethoscope. EMS hands off and steps out; she's on your monitor now.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "138",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.hr.why",
          "why": "At 9 years old, Jaya's heart rate of 138 bpm is well above the normal awake range of 75–118 bpm and signals compensated anaphylactic shock — her body is trying to maintain perfusion as vasodilation and capillary leak are pulling blood into the interstitium.\n\n- **Catecholamine surge** from mast cell degranulation drives both the tachycardia and the peripheral vasoconstriction you see in her narrowed pulse pressure (84/50) and delayed capillary refill, shunting blood centrally to preserve brain and heart perfusion.\n- **Impending decompensation** is visible in the rising lactate (3.1 mmol/L) and hypoxemia (SpO₂ 93%) alongside the tachycardia — she's still alert and tripoding, but the tachycardia is her last major compensatory lever before hypotension worsens.\n\nGive IM epi 0.3 mg (0.01 mg/kg of 1:1,000) into the anterolateral thigh right now; this is the single intervention that reverses mast cell mediator release and arrests progression to cardiovascular collapse."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "28",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.rr.why",
          "why": "Jaya's respiratory rate of 28 is elevated for a 9-year-old (normal is 18–25) and reflects both the direct airway narrowing from anaphylaxis and her body's attempt to maintain oxygenation as SpO₂ drops to 93% and metabolic acidosis accumulates (lactate 3.1).\n\n- **Bronchospasm from mast cell mediators** constricts airways and increases work of breathing, driving the tachypnea as a compensatory response to rising airway resistance.\n- **Metabolic acidosis feedback** from tissue hypoperfusion (cap refill 3 sec, narrowed pulse pressure) stimulates the respiratory center to hyperventilate and blow off CO₂, attempting to restore pH.\n\nThis is not yet Kussmaul breathing (deep, labored), but the combination of wheeze, tachypnea, and hypoxemia signals that airway compromise is escalating — IM epinephrine is the immediate priority before the picture shifts to respiratory failure."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "84/50",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.bp.why",
          "why": "Jaya's blood pressure of 84/50 is below the 5th percentile for a 9-year-old (threshold ~90 systolic) and signals decompensated anaphylactic shock — she has crossed from compensated to immediately life-threatening. Her tachycardia, tachypnea, prolonged cap refill, and cool narrow pulses are all compensatory responses that have failed to maintain perfusion; hypotension means the catecholamine surge from mast cell degranulation can no longer sustain cardiac output against massive vasodilation and capillary leak.\n\n- **Vasodilation and capillary leak from histamine and tryptase** reduce effective circulating volume despite normal total body fluid, dropping afterload and preload simultaneously — a dual hit that pressors alone cannot fix.\n- **Reduced cardiac output from hypovolemia** meets systemic vasodilation, collapsing the pressure gradient needed to perfuse brain and organs; late hypotension in anaphylaxis is a sign of end-organ malperfusion.\n\nIM epinephrine 0.3 mg (0.01 mg/kg of 1:1,000) is the single intervention that reverses the mast cell cascade and restores vascular tone — every minute of delay at this BP carries risk of cardiovascular collapse and cardiac arrest."
        },
        {
          "id": "spo2",
          "label": "SpO₂",
          "value": "93",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.spo2.why",
          "why": "Jaya's SpO₂ of 93% is borderline hypoxemic for a 9-year-old at sea level and signals anaphylaxis-driven airway compromise — the combination of bronchospasm, angioedema, and catecholamine surge is narrowing her airway in real time.\n\n- **Mast cell degranulation** in anaphylaxis releases histamine and tryptase, triggering bronchial smooth muscle constriction and mucosal edema that obstruct airflow and impair gas exchange.\n- **Respiratory distress with hypoxemia** (the tripoding posture, visible wheeze, and tachypnea at 28) means her work of breathing is already maxed out; any further airway narrowing will push her into respiratory failure before you finish the workup.\n\nIM epinephrine 0.3 mg IM right now — do not wait for labs or a second assessment."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.1",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.temp.why",
          "why": "Temperature is reassuring here because Jaya's shock picture is anaphylaxis, not sepsis — her tachycardia, hypotension, and elevated lactate are driven by mast cell mediators and distributive physiology, not systemic infection. A normal body temperature rules out fever as a competing diagnosis and anchors the clinical picture to acute allergic reaction rather than a mixed presentation.\n\n- **Fever in anaphylaxis is absent** because mast cell degranulation does not trigger the hypothalamic set-point shift that infection does; the shock is purely vasodilatory and mediator-driven.\n- **Normal temperature with hypotension and tachycardia points diagnosis toward anaphylaxis** rather than septic shock, which typically presents with fever or hypothermia in the early stage.\n\nJaya needs IM epinephrine now—this temperature keeps the focus on the right antidote."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.cap.why",
          "why": "Cap refill of 3 seconds signals **peripheral hypoperfusion** from anaphylaxis — Jaya's blood pressure is already dropping and her compensatory tachycardia and tachypnea are failing to maintain adequate tissue perfusion.\n\n- **Vasodilation and fluid shift** from mast cell mediators (histamine, tryptase, leukotrienes) cause distributive shock, with blood pooling in dilated vessels and fluid leaking into tissues, shrinking the circulating volume relative to the vascular space.\n- **Late compensatory failure** shows when capillary refill crosses 3 seconds; her heart rate and respiratory rate have maxed out their compensatory effect, and her narrowing pulse pressure (84/50) means central perfusion is already compromised — this is decompensated anaphylaxis.\n\nIM epinephrine is the immediate priority; delay worsens hypotension and increases biphasic reaction risk."
        }
      ],
      "signs": [
        {
          "id": "skinRash",
          "label": "Skin — Hives",
          "finding": "Confluent urticarial wheals across the anterior trunk, bilateral arms, and upper back; individual lesions raised and erythematous, blanching on pressure.",
          "pos": "trunk and upper extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.skinRash.why",
          "why": "Hives are the cutaneous hallmark of mast cell degranulation — IgE crosslinking on mast cell surfaces releases histamine, tryptase, and other mediators that dilate capillaries and increase vascular permeability. In anaphylaxis, urticaria appears within minutes of allergen exposure and signals the same systemic process driving Jaya's wheeze, angioedema, hypotension, and elevated tryptase.\n\n- **Histamine-mediated vasodilation** produces the blanching erythema and wheal formation you see; the same mediators are simultaneously constricting her airways and pooling blood in the periphery, explaining her tachycardia, hypotension, and prolonged cap refill.\n- **Tryptase elevation** (28.4 µg/L, normal <11) confirms mast cell activation occurred; urticaria plus objective mast cell marker plus respiratory and hemodynamic instability makes anaphylaxis the diagnosis — not an allergic reaction, not urticaria alone.\n\nHives alone can be benign; Jaya's hives with facial edema, wheeze, hypotension, and tachycardia are anaphylaxis until proven otherwise — IM epinephrine now, adjuncts after."
        },
        {
          "id": "lipSwelling",
          "label": "Lip / Facial Edema",
          "finding": "Bilateral lip swelling with mild perioral edema; uvula visible and midline, no stridor audible at rest.",
          "pos": "oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.lipSwelling.why",
          "why": "Bilateral lip and facial edema in anaphylaxis reflects **angioedema** — mast cell degranulation releases histamine and bradykinin, which increase vascular permeability and allow fluid to leak into subcutaneous and mucosal tissues. This is a surface marker of the systemic reaction happening simultaneously in her airways and vasculature. The midline uvula and absence of stridor at rest are reassuring — her airway is patent now — but angioedema can progress rapidly; **airway compromise in anaphylaxis is biphasic**, meaning swelling can worsen over the first 4–6 hours even after treatment. Give IM epinephrine immediately (0.01 mg/kg of 1:1,000 = 0.3 mg) — it's the only drug that halts mast cell mediator release and prevents airway deterioration. Watch her neck, lips, and voice for any hoarseness or stridor during reassessment; if either develops, prepare for airway management."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Diffuse expiratory wheeze bilaterally, mild-to-moderate in intensity; air movement present throughout all lung fields; no crackles.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.breathSounds.why",
          "why": "The expiratory wheeze signals anaphylactic airway edema plus bronchospasm — both are happening right now, and both demand immediate epinephrine IM. Anaphylaxis causes mast cell degranulation that triggers smooth-muscle constriction in the airways and mucosal swelling from histamine release; the wheeze is the bronchospasm component, the lip and facial edema is the mucosal component. Her SpO₂ of 93% and respiratory rate of 28 confirm she's working hard to move air through narrowed airways. Epinephrine's beta-2 effect relaxes airway smooth muscle, while its alpha-1 effect shrinks mucosal edema — it addresses both mechanisms at once. Albuterol alone would miss the airway edema entirely; steroids and antihistamines are adjuncts that take hours to work. The wheeze with hypoxemia and tachycardia means she's decompensating toward airway crisis — IM epi is the one intervention that reverses the cascade right now."
        },
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert and anxious; opens eyes spontaneously, speaking in short sentences, oriented to person and place, following commands.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.mentalStatus.why",
          "why": "Altered mental status in anaphylaxis signals early shock, not just fear — Jaya's low-normal BP, prolonged cap refill, and elevated lactate confirm tissue hypoperfusion is already underway. **Catecholamine surge** from mast cell degranulation causes both the anxiety and the compensatory tachycardia, but anxiety alone doesn't explain the narrow pulse pressure and delayed cap refill. **Hypoperfusion-driven encephalopathy** begins subtly as restlessness and clipped speech before progressing to lethargy and loss of airway protective reflexes. This is the moment to give IM epinephrine — before her mental status worsens and her airway becomes unmanageable."
        },
        {
          "id": "pulseQuality",
          "label": "Pulse Quality",
          "finding": "Central pulse palpable at carotid and femoral; radial pulse weak and thready bilaterally.",
          "pos": "central and peripheral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.pulseQuality.why",
          "why": "Weak and thready radial pulses with preserved central pulses signal **peripheral vasoconstriction** — Jaya's body is shunting blood away from the skin to protect her brain and heart as anaphylaxis triggers catecholamine release and mast-cell mediators cause vasodilation and capillary leak. This is compensated shock: her central perfusion is intact enough to keep her alert and talking, but her narrow pulse pressure (84/50) and prolonged cap refill (3 sec) confirm she's crossed into the danger zone where compensatory mechanisms are maxed out.\n\n- **Catecholamine surge** from anaphylaxis causes intense sympathetic activation, constricting peripheral vessels while dilating central vessels — preserving flow to the brain and heart at the expense of the skin.\n- **Capillary leak from histamine and tryptase** shrinks circulating volume, forcing the heart to work harder just to maintain central perfusion while the periphery goes cold and weak.\n\nDo not wait for hypotension to worsen or consciousness to fade — this is your window for IM epinephrine before she decompensates to shock with altered mental status and dropping BP."
        },
        {
          "id": "abdominal",
          "label": "Abdominal Exam",
          "finding": "Soft, non-distended, non-tender on palpation; no guarding or rigidity.",
          "pos": "abdomen",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.abdominal.why",
          "why": "An unremarkable abdominal exam in anaphylaxis is reassuring — it rules out surgical abdomen and confirms the shock is distributive, not hemorrhagic or obstructive. Anaphylaxis causes systemic mast-cell degranulation releasing histamine and tryptase; these mediators trigger vasodilation and capillary leak that lower effective circulating volume without actual bleeding or bowel pathology. Her soft, non-tender abdomen paired with elevated tryptase and the classic cutaneous signs (hives, angioedema) confirms the anaphylactic mechanism rather than a surgical or traumatic etiology for her hypotension and poor perfusion. Watch the abdomen during resuscitation — anaphylaxis can mask other acute processes, so if abdominal tenderness develops after epi and fluids, reassess for occult pathology."
        },
        {
          "id": "stingsite",
          "label": "Sting Site",
          "finding": "Small raised puncture wound with surrounding 2 cm flare on the left forearm; stinger no longer visible.",
          "pos": "left forearm",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.stingsite.why",
          "why": "The sting site itself — a small puncture with local flare — is reassuring and doesn't change management; what matters is Jaya's *systemic* reaction unfolding right now. A local reaction alone (swelling, erythema, itching confined to the sting area) is common and self-limited. Jaya's hives across her chest and arms, lip edema, airway wheeze, hypotension, and elevated tryptase are **anaphylaxis**, not local envenomation — the sting was the trigger, but her mast cells are degranulating throughout her body. The sting site exam tells you the exposure happened; the vital signs and cutaneous findings tell you the dose and her IgE-mediated response were severe. **Remove any residual stinger** if visible (pinch or scrape, don't squeeze the venom sac), but do not spend time on wound care — IM epinephrine into the anterolateral thigh is the one intervention that matters right now."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "108",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.glucose.why",
          "why": "Jaya's glucose of 108 mg/dL is reassuringly normal despite the stress of anaphylaxis — this tells you her pancreas is responding appropriately to the catecholamine surge, not that her metabolic state is stable overall.\n\n- **Stress hyperglycemia** from massive epinephrine and cortisol release during anaphylaxis typically raises glucose 20–50 mg/dL above baseline, so a normal value suggests either a recent baseline near 100 or intact hepatic and pancreatic glucose regulation.\n- **Lactate elevation (3.1 mmol/L) without hyperglycemia** points to tissue hypoperfusion driving anaerobic metabolism, not hepatic dysfunction — her BP of 84/50 and cap refill of 3 sec confirm maldistribution of perfusion despite preserved glucose homeostasis.\n\nThe normal glucose does not reassure you about shock severity; the elevated lactate is the metabolic warning sign here."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "9.8",
          "unit": "×10³/µL",
          "ref": "5.0-13.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.wbc.why",
          "why": "A normal WBC count in anaphylaxis doesn't rule out mast cell degranulation — it reflects the acute timing of this reaction, not the severity. WBC elevation (left shift, bandemia) typically develops over hours in bacterial infection; anaphylaxis triggers within minutes through IgE cross-linking and preformed mediator release, before the bone marrow has time to respond. What matters here is the **tryptase elevation of 28.4 µg/L**, which directly documents mast cell activation — the bedside tests (hives, angioedema, wheeze, hypotension, altered mental status) already tell you the diagnosis is confirmed. The normal WBC reassures you this is anaphylaxis, not concurrent sepsis, and frees you to focus entirely on the one intervention that matters: IM epinephrine now, then antihistamines and steroids as adjuncts."
        },
        {
          "id": "hgb",
          "name": "Hemoglobin",
          "value": "12.4",
          "unit": "g/dL",
          "ref": "11.5-14.5",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.hgb.why",
          "why": "Hemoglobin of 12.4 g/dL is reassuringly normal for a 9-year-old and tells you this is acute anaphylaxis, not hemorrhage masquerading as shock.\n\n- **Anaphylaxis causes distributive shock** through mast cell mediators (histamine, tryptase, leukotrienes) that trigger vasodilation and capillary leak, dropping perfusion pressure without blood loss — so hemoglobin stays normal even as cap refill lengthens and BP falls.\n- **A low hemoglobin in this picture would signal bleeding** as a co-morbidity or prompt suspicion of an alternate diagnosis entirely; the normal value confirms the shock is vasodilatory, not hypovolemic from blood loss.\n\nThis normal hemoglobin lets you commit fully to IM epinephrine and fluid resuscitation without worrying the hypotension is hiding an occult bleed."
        },
        {
          "id": "tryptase",
          "name": "Serum Tryptase",
          "value": "28.4",
          "unit": "µg/L",
          "ref": "< 11.4",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.tryptase.why",
          "why": "Serum tryptase at 28.4 µg/L confirms mast cell degranulation — the biochemical signature of anaphylaxis — and helps distinguish this from other causes of acute wheeze and edema in a 9-year-old.\n\n- **Mast cell tryptase release** occurs within seconds of IgE cross-linking on mast cell surfaces; tryptase peaks at 15–30 minutes post-exposure and stays elevated for several hours, making it a reliable marker even after the acute phase.\n- **Anaphylaxis diagnosis** relies on clinical presentation (urticaria, airway edema, bronchospasm, hypotension, altered mental status within minutes of exposure) plus supporting labs; elevated tryptase confirms the mechanism when presentation alone could be confused with acute asthma or allergic reaction without systemic features.\n\nStart IM epinephrine 0.01 mg/kg (0.3 mg for this 30 kg patient) into the anterolateral thigh right now — the tryptase confirms your clinical suspicion, but it does not delay the injection."
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "3.1",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.lactate.why",
          "why": "Lactate of 3.1 in anaphylaxis signals tissue hypoperfusion from mast cell mediator–driven vasodilation and distributive shock, not primary metabolic disease. **Anaphylactic distributive shock** reduces systemic vascular resistance catastrophically while cardiac output lags behind demand, forcing tissue beds into anaerobic metabolism and lactate generation even though her heart rate and consciousness are preserved. **Capillary refill of 3 seconds paired with elevated lactate** confirms perfusion failure — her compensatory tachycardia and altered mental status are masking shock that's already at the tissue level. Epinephrine IM reverses the mast cell mediator cascade and restores vascular tone; the lactate will fall as perfusion recovers, making it a useful trending marker of response over the next 2–4 hours post-dose."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 1,
      "id": "intervene",
      "stageType": "intervene",
      "round": 1,
      "title": "Initial Management",
      "narrative": "Jaya's wheeze is audible and her pressure is holding at 84/50 — the EpiPen bought her some time but she's clearly not out of the woods. Her SpO₂ is 93% on room air and she's working to breathe, though she's still protecting her airway. You have no IV access yet. The lip swelling hasn't worsened since arrival, but the stridor-free window won't last forever if the epinephrine wears off. Your team is at the bedside — it's time to act.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "138",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.hr.why",
          "why": "At 9 years old, Jaya's heart rate of 138 bpm is elevated but appropriate for anaphylaxis — her body is compensating for systemic vasodilation and impending hypovolemia by driving up cardiac output to maintain perfusion.\n\n- **Catecholamine surge** from mast cell degranulation causes both the tachycardia and the vasodilatation that's dropping her blood pressure; the heart rate is the sympathetic response trying to preserve cardiac output before BP collapses entirely.\n- **Anaphylaxis-driven shock** sits on a razor's edge between compensation and decompensation — the elevated heart rate with borderline low BP and prolonged cap refill (3 sec) signals she's using up her reserve and needs epinephrine repeated, not just observed.\n\nWatch the trend: if tachycardia worsens despite IM epinephrine and IV access, escalation to continuous epi infusion becomes the next move."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "28",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.rr.why",
          "why": "Jaya's respiratory rate of 28 at age 9 is markedly elevated above the normal 18–25 range — she is compensating for hypoxemia and shock-driven acidosis simultaneously. In anaphylaxis, two mechanisms are driving this tachypnea: airway edema is increasing work of breathing and triggering chemoreceptor response, and her tissue perfusion is failing (lactate 3.1, cap refill 3 sec, narrow pulse pressure) so her body is hyperventilating to blow off CO₂ and partially offset the metabolic acidosis building from anaerobic metabolism.\n\n- **Catecholamine surge from epinephrine** has peaked and is already waning; her respiratory drive will spike further if the IM dose doesn't sustain airway patency over the next 10–15 minutes.\n- **Rising work of breathing** with stridor risk means IV access and a second epi dose (IV push, not IM) must come before her airway edema progresses to complete obstruction.\n\nEvery minute without IV access is a minute closer to losing the airway."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "84/50",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.bp.why",
          "why": "Jaya's systolic pressure of 84 mmHg is below the hypotension threshold for a 9-year-old (70 + 2 × 9 = 88 mmHg), signaling that anaphylactic shock has progressed beyond compensated state — her body is no longer holding perfusion pressure through catecholamine surge alone. At this point, the IM epinephrine dose she received is masking deeper vasodilation and capillary leak; when it wears off in 15–20 minutes, her pressure will drop further without aggressive IV access and fluid resuscitation.\n\n- **Anaphylactic shock causes peripheral vasodilation and capillary leak** through massive mast-cell mediator release (histamine, tryptase, leukotrienes), flooding the interstitium with intravascular volume and collapsing central perfusion pressure.\n- **The combination of hypotension + lip edema + audible wheeze + tryptase elevation (28.4 µg/L)** confirms anaphylaxis with early shock — not simple allergic reaction or asthma exacerbation.\n\nSecure IV access now and give a 20 mL/kg bolus (600 mL) of normal saline over 5–10 minutes; prepare a second bolus. If pressure doesn't recover after fluids, IM epi may need repeating at 5–15 minute intervals."
        },
        {
          "id": "spo2",
          "label": "SpO₂",
          "value": "93",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.spo2.why",
          "why": "Jaya's SpO₂ of 93% is below the 94% target and signals that anaphylactic airway edema is beginning to compromise gas exchange — the clock is ticking before stridor develops and airway becomes critical.\n\n- **Bronchospasm from mast cell mediators** constricts airways and increases dead space ventilation, lowering the efficiency of each breath and dropping SpO₂ despite normal lung tissue itself.\n- **Angioedema reducing the airway caliber** means she's working harder to move the same volume of air, which will worsen as the epinephrine effect wanes over the next 5–15 minutes.\n\nGet IV access immediately and have emergency airway equipment at the bedside — a second IM epi dose may be needed within minutes if SpO₂ continues to fall or stridor develops."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.1",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.temp.why",
          "why": "Jaya's temperature of 37.1 °C is normal, which is reassuring because it tells you her shock is anaphylactic, not septic. Anaphylaxis triggers mast cell degranulation and systemic vasodilation without infection; fever would signal a different underlying process entirely and change your differential. A normal temperature in a child with hives, angioedema, bronchospasm, and hypotension confirms you're treating IgE-mediated anaphylaxis with epinephrine and fluid resuscitation, not hunting for a secondary cause like occult infection. This clarity matters because septic shock would demand antibiotics and source control alongside fluids and pressors — anaphylaxis does not. Keep trending her temperature during observation; if it rises, reassess for concurrent illness or secondary infection."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.cap.why",
          "why": "Capillary refill of 3 seconds signals peripheral vasoconstriction from catecholamine surge — Jaya is in compensated shock from anaphylaxis, and the epinephrine window is closing. At 9 years old, normal cap refill is ≤2 seconds; a 3-second delay with mottled extremities, narrow pulses, and a lactate of 3.1 means tissue perfusion is degraded despite her still-normal blood pressure. **Peripheral hypoperfusion** reflects maldistribution of blood flow away from skin toward vital organs as alpha-1 vasoconstriction kicks in. **Decompensation arrives when vasoconstriction can no longer maintain central pressures** — hypotension will follow if epinephrine effect wanes without a second IM dose or IV access to give IV epi and fluids. Reassess cap refill and pulses every 3–5 minutes; a rising trend toward 4+ seconds with dropping BP is your cue to escalate immediately to IV epinephrine and aggressive fluid resuscitation."
        }
      ],
      "signs": [
        {
          "id": "skinRash",
          "label": "Skin — Hives",
          "finding": "Persistent confluent urticarial wheals across trunk and upper extremities; slightly less erythematous than arrival but not resolving.",
          "pos": "trunk and upper extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.skinRash.why",
          "why": "Hives in anaphylaxis are mast cells degranulating and releasing histamine directly into the dermis, causing local vasodilation and plasma leak — that's the urticarial response. The fact that they're still present despite the EpiPen dose tells you the mast cell cascade is ongoing; epinephrine suppresses further release and causes vasoconstriction to buy time, but it doesn't clear the histamine already in the tissue. What matters bedside is that persistent urticaria signals the systemic mast cell activation is not fully arrested — the airway swelling, bronchospasm, and hypotension can all recur or worsen as the epi wears off (duration ~5–10 minutes in anaphylaxis). The hives themselves won't kill her; the airway edema and bronchospasm will. Watch the lips and mouth for progressive swelling and listen for stridor — those are the red flags, not the rash progression.\n\n- **Histamine-driven vasodilation** in the dermis causes the urticarial wheals; epi's alpha-1 effect constricts vessels locally but doesn't neutralize histamine already released.\n- **Mast cell degranulation is biphasic** — a second wave can occur 4–12 hours after the first, which is why anaphylaxis patients need adjunctive antihistamines and steroids after epi, not instead of it.\n\nGet IV access and push for IM epi redose now if stridor or airway compromise worsens."
        },
        {
          "id": "lipSwelling",
          "label": "Lip / Facial Edema",
          "finding": "Bilateral lip swelling stable compared to arrival; no new oropharyngeal edema; uvula midline; no stridor.",
          "pos": "oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.lipSwelling.why",
          "why": "Angioedema — the deep-tissue swelling you're seeing in her lips — is mast cell histamine release reaching the dermis and subcutaneous tissues, and it signals that epinephrine's window is finite. The IM epi dose (0.15 mg from the EpiPen at her weight) works fast but wears off in 15–20 minutes; the fact that her swelling hasn't progressed is reassuring, but recurrence is the signature risk of anaphylaxis. Her biphasic window is open — a second wave of mediator release can happen hours later, which is why she needs ICU admission and observation even if she stabilizes now. Keep IV access a priority and have a second epi dose drawn up; if the edema worsens or stridor develops, you're back to IM epi immediately, not waiting for an IV line.\n\n- **Mast cell degranulation** releases histamine, tryptase, and other mediators that increase vascular permeability and cause fluid extravasation into tissues; her serum tryptase of 28.4 µg/L confirms significant mast cell activation.\n- **Epinephrine's alpha-1 effect** causes vasoconstriction that temporarily counteracts the vasodilation and edema; the effect is transient, and edema can rebound as the drug metabolizes."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Expiratory wheeze throughout all fields, intensity unchanged from arrival; accessory muscle use mild; no inspiratory stridor.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.breathSounds.why",
          "why": "Expiratory wheeze in anaphylaxis signals bronchospasm — mast cell mediators (histamine, leukotrienes) are clamping down on airway smooth muscle — but the absence of inspiratory stridor and the stable intensity from arrival tell you the upper airway edema hasn't progressed yet. That window is real but finite; the first IM epinephrine dose is wearing off and a second dose or IV access for adjunct therapy (albuterol, IV steroids) will buy you time before the swelling threatens the larynx.\n\n- **Mast cell degranulation** releases histamine and cysteinyl leukotrienes, which bind muscarinic and leukotriene receptors on bronchial smooth muscle, causing contraction and mucus plugging.\n- **Biphasic anaphylaxis risk** means that without sustained epinephrine effect (IM redose q5–15 min or IV infusion), bronchospasm can worsen and upper airway edema can recruit stridor within minutes of the first dose wearing off.\n\nTrend the stridor closely — any coarsening or shift to biphasic breathing is your cue to escalate airway management; do not wait for full stridor to commit to intubation."
        },
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert and anxious; oriented, following commands, short-sentence speech; no deterioration from arrival.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mentalStatus.why",
          "why": "Jaya's anxiety and clipped speech reflect appropriate mental response to airway compromise and hypoxemia—she's frightened because her body is signaling real danger, not because she's decompensating. In anaphylaxis with evolving airway edema, preserved alertness and orientation are reassuring; deterioration to lethargy or confusion would signal either severe hypoxemia or decompensation toward cardiovascular collapse.\n\n- **Anxiety in anaphylaxis** is often protective rather than pathologic—the catecholamine surge from mast-cell mediators and the endogenous epinephrine response produce sympathetic activation that keeps the child upright and fighting for air, buying time for your intervention.\n- **Maintained orientation despite SpO₂ 93% and stridor risk** tells you the airway is not yet critically narrowed and cerebral perfusion remains adequate; once mental status drops in the setting of airway edema, decompensation accelerates and your window for safe intervention closes.\n\nWatch for any shift toward drowsiness or confusion during the next few minutes—that's your cue that hypoxemia or shock is worsening and you may be losing your chance to secure the airway before swelling makes it impossible."
        },
        {
          "id": "pulseQuality",
          "label": "Pulse Quality",
          "finding": "Central pulses intact; peripheral radial pulse remains weak and thready.",
          "pos": "central and peripheral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.pulseQuality.why",
          "why": "Weak peripheral pulses with preserved central pulses signal **peripheral vasoconstriction** — Jaya's body is shunting blood away from skin and limbs to protect the brain and heart as anaphylactic shock deepens. This is compensated shock: she still has a measurable radial pulse and her mental status hasn't yet collapsed, but the narrow pulse pressure (84/50, mean around 61 mmHg) and cap refill of 3 seconds confirm tissue hypoperfusion is underway.\n\n- **Catecholamine surge** from mast cell degranulation causes vasoconstriction centrally and arteriolar shutdown peripherally, preserving core perfusion at the expense of skin blood flow — the mechanism behind both the hives and the weak radial pulse.\n- **Anaphylactic shock progression** moves from compensation (strong central pulse, weak peripheral) to decompensation (weak central pulse, systemic hypotension, altered mental status) within minutes if epinephrine wears off and rescue IM dosing is not repeated.\n\nGet IV access now and have a second epinephrine dose drawn and ready; the first EpiPen's effect window is 15 minutes, and her perfusion is already at the edge."
        },
        {
          "id": "abdominal",
          "label": "Abdominal Exam",
          "finding": "Soft and non-tender; no distension or rigidity.",
          "pos": "abdomen",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.abdominal.why",
          "why": "In anaphylaxis, abdominal symptoms — cramping, vomiting, diarrhea — are common early findings driven by mast cell degranulation in gut mucosa. Jaya's soft, non-tender abdomen tells you the GI involvement hasn't progressed to edema or smooth muscle contraction severe enough to cause pain, and rules out surgical mimics (appendicitis, intussusception) that can present with hives and altered behavior in children.\n\n- **Mast cell mediator release** triggers GI smooth muscle contraction and mucosal edema; absence of tenderness or distension means these haven't reached clinical severity yet.\n- **Reassurance that the picture is isolated anaphylaxis** — not a surgical abdomen hiding under the hives, and not multi-organ involvement requiring additional imaging or intervention right now.\n\nStay focused on airway and perfusion; a benign abdominal exam doesn't change your next move (IV access, albuterol, steroids, fluids), but it does confirm anaphylaxis is the diagnosis."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "108",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.glucose.why",
          "why": "Glucose of 108 mg/dL is reassuringly normal in anaphylaxis, but it tells you something important about Jaya's catecholamine surge and perfusion status. In anaphylaxis, epinephrine release drives hepatic glycogenolysis and lipolysis; you'd expect glucose to climb into the 150–200 range, especially minutes after IM epi. A normal glucose despite maximal sympathetic drive raises concern that perfusion to the liver may be compromised — the adrenergic stimulus is there, but the organ isn't responding as briskly as expected.\n\n- **Catecholamine response in anaphylaxis** normally triggers rapid glucose release via alpha-1 and beta-2 signaling on hepatocytes; a blunted glucose rise suggests either incomplete epinephrine effect or marginal hepatic perfusion.\n- **Lactate of 3.1 mmol/L paired with normal glucose** flags tissue hypoperfusion — her muscles are working anaerobically (evident from the cap refill of 3 sec and narrow pulse pressure) while the liver's glucose output lags, a mismatch that signals deepening shock.\n\nThis glucose is not the immediate problem, but it's a red flag that her compensation is wearing thin — the epi is handling the anaphylaxis acutely, but you need IV access, fluids, and a second epi dose ready now."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "9.8",
          "unit": "×10³/µL",
          "ref": "5.0-13.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.wbc.why",
          "why": "A normal WBC count in acute anaphylaxis doesn't rule out the diagnosis — tryptase is the specific marker you're watching here. The WBC stays normal early in anaphylaxis because mast cell degranulation is an immediate IgE-mediated event, not an inflammatory cascade requiring leukocyte mobilization. **Mast cell mediator release** (histamine, tryptase, leukotrienes) happens in seconds to minutes and produces her hives, edema, and bronchospasm without requiring circulating white cell counts to shift. Her tryptase of 28.4 µg/L is the smoking gun — it confirms mast cell activation and rules out other causes of acute wheeze and shock like aspiration or foreign body. The normal WBC reassures you this isn't bacterial sepsis masquerading as anaphylaxis; focus on epinephrine dosing and IV access."
        },
        {
          "id": "tryptase",
          "name": "Serum Tryptase",
          "value": "28.4",
          "unit": "µg/L",
          "ref": "< 11.4",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.tryptase.why",
          "why": "Serum tryptase of 28.4 µg/L is markedly elevated and confirms mast cell degranulation — the biochemical hallmark of anaphylaxis. Tryptase rises within minutes of anaphylactic trigger and peaks at 15–30 minutes, so this level drawn early in her presentation captures the acute event.\n\n- **Mast cell mediator release** in IgE-mediated anaphylaxis triggers tryptase, histamine, and leukotrienes simultaneously; tryptase is the most stable marker because it stays elevated longer than histamine, which clears rapidly.\n- **Tryptase correlates with severity** — levels above 20 µg/L in acute anaphylaxis support the diagnosis and predict worse symptoms, reinforcing that Jaya's airway edema and hypotension are genuine anaphylaxis, not isolated bronchospasm.\n\nRedraw tryptase at 3 hours post-onset to document the rise-and-fall pattern and confirm the diagnosis; a single level is diagnostic but the peak solidifies it for allergy referral later."
        },
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "3.1",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.lactate.why",
          "why": "Jaya's lactate of 3.1 is elevated because her tissue perfusion has fallen behind oxygen demand — the hallmark of shock, even though her blood pressure is still holding. Anaphylaxis causes profound vasodilation and maldistribution of blood flow; the EpiPen's alpha-1 vasoconstriction bought her time, but the underlying catecholamine storm has forced tissues into anaerobic metabolism.\n\n- **Anaerobic glycolysis** kicks in when oxygen delivery drops below what tissues need, shifting metabolism from aerobic (efficient, no lactate) to anaerobic (inefficient, lactate accumulation), which is why lactate rises before blood pressure crashes.\n- **Capillary refill of 3 seconds plus the tachycardia and narrow pulse pressure** confirm that perfusion is failing at the bedside even though her systolic pressure reads 84 — lactate is the biochemical proof of that clinical picture.\n\nLactate will trend down only after her intravascular volume is restored and epinephrine reverses the vasodilation; watch the recheck after your next fluid bolus and second epi dose."
        },
        {
          "id": "cmp_na",
          "name": "Sodium",
          "value": "138",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.cmp_na.why",
          "why": "Sodium of 138 mEq/L is reassuring — it rules out dilutional hyponatremia, which can occur when anaphylaxis triggers SIADH or when large volumes of hypotonic fluid are given during resuscitation. In anaphylaxis with hypotension and tissue edema, sodium can drop if free water shifts intracellularly faster than sodium is lost; a normal value here means you're not fighting a secondary electrolyte problem on top of the primary shock. Focus your fluid strategy on isotonic crystalloid boluses (20 mL/kg NS) without worrying that you'll drive her sodium down. The potassium is also reassuring — acidosis from anaerobic metabolism (lactate 3.1) typically drives potassium out of cells, but hers hasn't risen yet, giving you room to give fluids and pressors without triggering dangerous hyperkalemia."
        },
        {
          "id": "cmp_k",
          "name": "Potassium",
          "value": "3.9",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.cmp_k.why",
          "why": "Potassium of 3.9 mEq/L is normal-range, but in anaphylaxis with catecholamine surge and acidosis risk, it's a value to watch rather than ignore. Epinephrine's beta-2 agonism drives potassium intracellularly, and the ongoing sympathetic storm from anaphylaxis can drop K+ further as the crisis evolves. A normal K+ now does not mean it will stay there — if Jaya deteriorates and acidosis develops from persistent hypoxemia or shock, serum K+ will track downward and become a liability if you need to give additional medications or manage dysrhythmias later.\n\n- **Beta-2 driven hypokalemia** occurs because epinephrine shifts K+ into cells; the more epi exposure, the greater the intracellular shift and the lower the serum level.\n- **Anaphylactic acidosis risk** compounds the problem — if tissue perfusion worsens, lactate will rise (it's already elevated at 3.1), which worsens acidosis and drives K+ out of cells once the catecholamine effect wanes, creating a rebound hyperkalemia risk if the picture swings.\n\nRecheck K+ after the acute phase stabilizes; a 9-year-old with anaphylaxis on repeated epi doses can swing from low-normal to hypokalemic or rebound hyperkalemic within hours depending on resolution trajectory."
        },
        {
          "id": "cmp_hco3",
          "name": "Bicarbonate",
          "value": "20",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.cmp_hco3.why",
          "why": "Jaya's bicarbonate of 20 mEq/L is at the lower limit of normal, but in the context of her lactate of 3.1 and her anaphylactic shock state, it signals early metabolic acidosis from tissue hypoperfusion — the cap refill of 3 seconds and narrowed pulse quality confirm inadequate oxygen delivery at the tissue level.\n\n- **Lactate-driven acidosis in shock** occurs when anaerobic metabolism outpaces aerobic clearance; the bicarbonate buffer system is already being consumed by the rising lactate, which is why the HCO3 sits at the floor despite technically being \"normal\" on the lab report.\n- **Borderline bicarbonate with elevated lactate is a red flag for decompensating perfusion** — the pH and pCO2 are not yet critically abnormal, but the trajectory is downward and the IM epinephrine's window is narrow.\n\nRepeat labs in 30 minutes after IV access and fluid resuscitation; a rising or stable lactate paired with improving cap refill means the intervention is working."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to Vital Signs Monitor",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.vsMonitor.fb",
            "fb": "Connecting Jaya to continuous monitoring is your early-warning system for biphasic anaphylaxis and epinephrine wear-off — her airway edema and bronchospasm can deteriorate fast, and you need to catch rhythm changes, desaturation drift, or blood pressure collapse in real time. Anaphylaxis is hemodynamically volatile; the IM epi dose she received (0.15 mg from the EpiPen at her weight) is already being metabolized, and a second dose or IV epinephrine infusion may be needed within minutes if stridor develops or perfusion drops further. Real-time waveforms and trends — not spot vitals — tell you whether she's stabilizing with fluids and adjuncts or decompensating and requiring escalation to the operating room for airway management.\n\n- **Biphasic reaction risk** means symptoms can recur or worsen 4–12 hours after the initial dose, but the critical window right now is the next 30 minutes while IM epi concentration peaks and then begins to fall.\n- **Capillary refill of 3 seconds with a systolic of 84 and narrowed pulse pressure** signals maldistribution of perfusion from anaphylactic shock; continuous BP and HR trending lets you titrate fluids and catch the moment pressors or a second epi dose becomes necessary.\n\nKeep the monitor on her for the full resuscitation and beyond — anaphylaxis killed by complacency is the most preventable anaphylaxis death.",
            "pri": 1,
            "ok": true
          },
          "ivKit": {
            "id": "ivKit",
            "label": "Place peripheral IV",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.tools.ivKit.fb",
            "fb": "Peripheral IV access is the gateway to adjunct medications — antihistamines, steroids, and a second epinephrine dose if needed — but it must not delay the first IM epinephrine, which has already been given. Jaya's cap refill is 3 seconds, her systolic is 84, and her SpO₂ is 93; she is compensating on that first EpiPen dose and will decompensate fast if anaphylaxis progresses. Placing the IV now (while she is still upright and cooperative) allows you to push fluids and give adjuncts without fumbling for access during a crisis. IV placement takes seconds in a perfusing child — this is the right moment, not something to defer. Once the line is in, aggressive NS bolus (20 mL/kg = 600 mL over 5–10 minutes) restores intravascular volume that anaphylaxis-driven vasodilation has stolen, buying time before a second epi dose becomes necessary.",
            "pri": 2,
            "ok": true
          },
          "o2Mask": {
            "id": "o2Mask",
            "label": "Apply high-flow oxygen mask",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.tools.o2Mask.fb",
            "fb": "High-flow oxygen is your immediate hedge against the airway swelling that's progressing behind the epi. Jaya's SpO₂ of 93% on room air with audible wheeze and lip edema means she's compensating now — but epi wears off in 15–20 minutes, and stridor can arrive suddenly.\n\n- **Oxygen reserve** buys time during airway edema progression: if her SpO₂ drops or she needs rapid sequence intubation, pre-oxygenation on high-flow mask increases her apneic time and makes induction safer.\n- **Hypoxemia potentiates catecholamine-resistant shock** in anaphylaxis; maintaining SpO₂ >94% preserves both airway reflexes and the effectiveness of epinephrine on vascular tone and bronchial smooth muscle.\n\nSecure IV access and draw labs in parallel — do not delay oxygen while hunting a line.",
            "pri": 2,
            "ok": true
          },
          "stethoscope": {
            "id": "stethoscope",
            "label": "Auscultate breath sounds",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.stethoscope.fb",
            "fb": "Auscultating breath sounds tells you whether the wheeze is diffuse bronchospasm (anaphylaxis) or localized upper-airway obstruction (epiglottitis or angioedema progressing to stridor), which changes your next move. Jaya's expiratory wheeze audible from across the room is reassuring — it signals lower-airway involvement, not imminent upper-airway compromise — but you need to confirm no stridor is present and that air movement is equal bilaterally before committing to aggressive bronchodilator therapy.\n\n- **Biphasic stridor or silent chest** would flag impending airway loss and demand immediate airway backup and intubation prep; isolated wheezing with normal upper airway sounds lets you press forward with epinephrine and albuterol.\n- **Unilateral decreased air movement** would raise concern for foreign body or aspiration rather than anaphylaxis, steering you away from beta-agonists and toward airway imaging or ENT evaluation.\n\nThis is your gate: once you've excluded upper-airway obstruction at the stethoscope, you can confidently escalate bronchodilators and fluids without second-guessing whether the next raspy breath means angioedema is closing her airway.",
            "pri": 1,
            "ok": true
          },
          "intubationKit": {
            "id": "intubationKit",
            "label": "Prepare intubation kit",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.tools.intubationKit.fb",
            "fb": "Jaya needs an airway secured, but intubation now risks catastrophic deterioration — she's protecting her airway, moving air, and perfusing despite the wheeze and hypoxemia. The right call is aggressive IM epinephrine dosing (0.01 mg/kg = 0.3 mg, repeating q5–15 min as needed) plus high-flow oxygen, IV access, and aggressive dual nebulization (albuterol 2.5 mg + ipratropium 0.5 mg) while staying at the bedside watching her work. Intubation is the final resort in anaphylaxis because the anesthetics themselves carry anaphylactogenic risk, post-intubation bronchospasm is harder to reverse than spontaneous breathing, and many anaphylaxis patients improve dramatically with repeated epi doses and supportive therapy. Save the kit as a backstop — get the IM epinephrine in now, secure IV access, and reassess airway status in 5 minutes. If stridor emerges, lip swelling occludes her mouth, or mental status drops, then you move to intubation. Right now, she's working and defending herself; that's not the moment to sedate and paralyze.",
            "pri": 3,
            "ok": false
          },
          "nebSetup": {
            "id": "nebSetup",
            "label": "Set up nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.tools.nebSetup.fb",
            "fb": "In anaphylaxis with bronchospasm, the airway intervention that matters first is securing IV access and redosing IM epinephrine — not nebulized bronchodilators. Albuterol nebulization takes 5–10 minutes to work and requires the patient to cooperate with inhalation; it's an adjunct after the primary intervention, not a substitute for it. Epinephrine's beta-2 agonism relaxes airway smooth muscle directly and systemically within seconds, whereas nebulized albuterol acts only on the distal airways it reaches. Jaya's SpO₂ is 93% and she's still protecting her airway, but her cap refill is 3 seconds and her BP is 84/50 — the shock is progressing and a second dose of IM epi (0.3 mg, repeatable at 5–15 minute intervals) takes priority over the nebulizer setup. Once IV access is established and her perfusion improves, albuterol becomes a reasonable adjunct; right now, it delays the intervention that will actually reverse the anaphylaxis.",
            "pri": 4,
            "ok": false
          },
          "ioAccess": {
            "id": "ioAccess",
            "label": "Place IO access",
            "priority": "distractor-misc",
            "_slotRef": "phase[1].actions.tools.ioAccess.fb",
            "fb": "Jaya needs immediate IV access to deliver medications that will reverse anaphylaxis — but IO access is the wrong tool right now because she still has a patent airway and perfusing rhythm. IO access is your move when a child is in cardiac arrest, unresponsive shock, or when peripheral IV attempts have burned through your window. Jaya is alert, protecting her airway, and maintaining a blood pressure of 84/50 — she's decompensating but not yet arrested. A rapid peripheral IV in an upper extremity (antecubital fossa, hand, or external jugular if needed) takes 30–60 seconds and preserves IO for true resuscitation. She needs a second dose of epinephrine IV now that the IM dose is wearing off, plus antihistamines and steroids as adjuncts — all go faster through a peripheral line you can establish while she's still conscious and cooperative.",
            "pri": 5,
            "ok": false
          }
        },
        "meds": {
          "epiIM": {
            "id": "epiIM",
            "label": "Administer epinephrine IM 0.3 mg (0.01 mg/kg) into lateral thigh",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.epiIM.fb",
            "fb": "Epinephrine IM is the first and most time-critical intervention in anaphylaxis; it's the only drug that directly reverses the mast-cell cascade driving airway swelling and shock. Give it early and repeat every 5–15 minutes if signs persist — delay costs the airway window. At 30 kg, 0.01 mg/kg = 0.3 mg of 1:1,000 (the IM formulation), which is one EpiPen standard dose; anterolateral thigh is the gold-standard site because it has the fastest and most reliable absorption.\n\n- **Alpha-1 adrenergic vasoconstriction** reverses the vasodilation and increased capillary permeability that cause the lip swelling, hives, and hypotension; beta-2 agonism relaxes airway smooth muscle to open the narrowed airway driving her audible wheeze.\n- **Mast-cell stabilization** stops continued release of histamine, tryptase, and other mediators, which is why early dosing prevents biphasic reactions far better than waiting for the first dose to wear off before giving a second.\n\nAntihistamines, steroids, fluids, and bronchodilators come after epi, never instead of it — they are adjuncts that reduce symptoms but cannot reverse anaphylaxis alone.",
            "pri": 2,
            "ok": true
          },
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer NS bolus 300 mL (10 mL/kg) IV",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.nsBolus.fb",
            "fb": "Fluid resuscitation is the foundational step in anaphylactic shock — epi stabilizes the airway and heart rate, but fluid fills the vascular tank that mast cell mediators have emptied. A 10 mL/kg bolus of normal saline is the standard opening move in pediatric anaphylaxis with hypotension, and in Jaya's case it addresses the cap refill of 3 seconds and BP of 84/50, which signal vasodilatation-driven shock despite her epi dose. At 30 kg, 10 mL/kg is 300 mL — push it over 5–10 minutes through IV access, then reassess perfusion (cap refill, pulse quality, mental clarity). Isotonic crystalloid restores intravascular volume without adding free water that could worsen any associated cerebral edema from anaphylaxis. If cap refill doesn't improve and BP remains borderline after the first bolus, a second bolus is reasonable before escalating to vasopressors — but in anaphylaxis, most children respond briskly once fluids are in. Watch her work of breathing and stridor risk as perfusion improves; if airway swelling progresses despite epi + fluid + time, you'll need ICU-level monitoring or intubation standby.",
            "pri": 2,
            "ok": true
          },
          "diphenhydramine": {
            "id": "diphenhydramine",
            "label": "Administer diphenhydramine 30 mg (1 mg/kg) IV",
            "priority": "correct",
            "_slotRef": "phase[1].actions.meds.diphenhydramine.fb",
            "fb": "Antihistamines are adjuncts in anaphylaxis — they reduce urticaria and itching but do not reverse airway edema or hypotension and should never delay epinephrine. Diphenhydramine blocks H1 receptors on mast cells, preventing histamine from triggering vasodilation and smooth muscle contraction. Jaya's hives, lip swelling, and bronchospasm are all histamine-driven; blocking further release helps prevent progression once the IM epi has bought time. At 30 mg (1 mg/kg for her 30 kg weight), this dose is appropriate for IV use and works faster than IM. Give it now because the epi will wear off in 10–20 minutes — antihistamine on board reduces the risk of biphasic reaction and keeps the urticaria from worsening while you establish IV access and prepare for possible re-dosing of epi.\n\n- **Histamine blockade** reduces further mast cell-mediated vasodilation, which is already destabilizing her perfusion (cap refill 3 sec, BP 84/50, lactate rising).\n- **Timing after IM epi** is critical; antihistamine started immediately after the first dose prevents the rapid rebound some patients experience as catecholamine levels drop in the next 15–20 minutes.",
            "pri": 1,
            "ok": true
          },
          "methylprednisolone": {
            "id": "methylprednisolone",
            "label": "Administer methylprednisolone 30 mg (1 mg/kg) IV",
            "priority": "correct",
            "_slotRef": "phase[1].actions.meds.methylprednisolone.fb",
            "fb": "Corticosteroids in anaphylaxis prevent biphasic reactions — a sudden return of symptoms hours after initial epinephrine, which occurs in 1–5% of cases and can be fatal if unrecognized. Methylprednisolone 1 mg/kg IV (30 mg in Jaya's case) given early buys time and reduces that recurrence risk, though it does not replace epinephrine and takes hours to exert effect.\n\n- **Biphasic anaphylaxis** occurs when mast cell mediators (histamine, tryptase, leukotrienes) re-release after initial degranulation subsides; steroids dampen the second wave by suppressing cytokine synthesis and reducing cellular recruitment to airway and vascular tissues.\n- **Early steroid timing** matters because the anti-inflammatory effect peaks 4–6 hours post-dose — giving it now means protection is already building while her airway edema risk window remains open over the next several hours.\n\nJaya will need IV access established and close observation for 4–6 hours minimum even if she improves; if stridor or hypotension recurs, a second IM epinephrine dose is the immediate next move, not waiting for steroid effect.",
            "pri": 1,
            "ok": true
          },
          "famotidine": {
            "id": "famotidine",
            "label": "Administer famotidine 0.5 mg/kg IV",
            "priority": "correct",
            "_slotRef": "phase[1].actions.meds.famotidine.fb",
            "fb": "Famotidine blocks histamine-2 receptors in the gastric mucosa and mast cells, reducing acid secretion and histamine release — it's an adjunct that reduces biphasic anaphylaxis risk and GI symptoms once the airway is secured by epinephrine. At 0.5 mg/kg IV, Jaya receives 15 mg over 1–2 minutes; it pairs with H1-blocking antihistamines (diphenhydramine) to suppress both arms of the histamine cascade. Famotidine doesn't replace epinephrine — the IM dose was already given and she's alive because of it — but it prevents recurrence of angioedema and bronchospasm as the epi wears off over the next 20 minutes, buying time for steroids (dexamethasone or methylprednisolone) to take effect. Without H1 and H2 blockade, mast cells continue releasing histamine even after epinephrine is metabolized, triggering biphasic reactions in 1–3% of anaphylaxis cases; the combination cuts that risk meaningfully.\n\n- **H2 blockade** reduces gastric acid and suppresses mast cell histamine release, lowering the threshold for anaphylactic relapse during the lag time before steroid effect.\n- **Diphenhydramine plus famotidine** addresses both H1 (vasodilation, bronchospasm, angioedema) and H2 (additional mast cell suppression) receptors, providing dual coverage after IM epi has bought the window.",
            "pri": 1,
            "ok": true
          },
          "albuterol": {
            "id": "albuterol",
            "label": "Administer albuterol nebulization 2.5 mg",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.albuterol.fb",
            "fb": "Within the respiratory pack for anaphylaxis, the first and only medication that matters is IM epinephrine — adjuncts like albuterol address symptoms but do not prevent biphasic reactions or airway closure. Albuterol relaxes airway smooth muscle via beta-2 agonism, which is the right mechanism for primary asthma or status asthmaticus where bronchospasm is the root problem. Jaya's wheeze is downstream from anaphylaxis-driven airway edema and mast cell mediator release, not primary smooth-muscle constriction — albuterol won't reverse the swelling or stop the cascade. She needs a second IM epinephrine dose now (0.01 mg/kg of 1:1,000, which is 0.3 mg IM) to suppress further mediator release and stabilize her airway before it closes. Albuterol is reasonable *after* epi is given and IV access is secured, but it's not the pack-mate that saves her right now.",
            "pri": 4,
            "ok": false
          },
          "racemicEpi": {
            "id": "racemicEpi",
            "label": "Administer racemic epinephrine nebulization",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.racemicEpi.fb",
            "fb": "Jaya needs continuous IV/IM epinephrine and airway support, not nebulized racemic epinephrine — the respiratory pack for anaphylaxis includes albuterol for bronchospasm and oxygen for hypoxemia, not racemic epi. Racemic epinephrine's alpha-1 vasoconstriction shrinks subglottic mucosal edema, which is the target in croup or post-extubation stridor where laryngeal narrowing is the primary pathology. Anaphylaxis is systemic mast-cell degranulation driving bronchospasm, angioedema, and distributive shock — the bronchial smooth muscle responds to beta-2 agonism (albuterol), not to topical vasoconstriction in the subglottis. Racemic epi does not reach the lower airway where her wheezing lives, and delaying IV epi dosing or IM re-dosing while nebulizing it is the exact sequencing error that transforms recoverable anaphylaxis into airway loss.",
            "pri": 4,
            "ok": false
          },
          "sodiumBicarb": {
            "id": "sodiumBicarb",
            "label": "Administer sodium bicarbonate IV",
            "priority": "distractor-misc",
            "_slotRef": "phase[1].actions.meds.sodiumBicarb.fb",
            "fb": "Jaya's immediate threat is anaphylactic airway edema and bronchospasm — she needs IV access, a second dose of epinephrine IM if symptoms progress, oxygen titration, and H1/H2 blockers plus steroids as adjuncts. Sodium bicarbonate corrects acidosis by buffering hydrogen ions, which is useful in overdoses with QRS widening (tricyclic antidepressants) or in severe metabolic acidosis causing cardiovascular collapse. Her pH is 7.38 with HCO3 of 20 — not acidemic, and her cardiovascular compromise is from anaphylactic shock and airway obstruction, not from acid-driven myocardial depression. Bicarbonate adds nothing to her resuscitation and delays the interventions that matter: getting IV access, giving fluids and repeat epi if needed, and securing her airway if stridor develops.",
            "pri": 5,
            "ok": false
          }
        }
      }
    },
    {
      "phaseIndex": 2,
      "id": "assess2",
      "stageType": "assess",
      "round": 2,
      "title": "Re-Assessment: Partial Response",
      "narrative": "It's been about 20 minutes since Jaya's EpiPen and roughly 10 minutes since you gave her a second dose of IM epinephrine and got IV access with a 10 mL/kg NS bolus running. The hives look somewhat better — they're fading at the edges — and she's no longer tripoding. But she's not where you want her to be. Her wheeze has lightened but hasn't cleared, her lips are still noticeably swollen, and she looks more fatigued than frightened now. She's maintaining her airway, but the combination of persistent bronchospasm and ongoing hemodynamic instability tells you the epinephrine effect is waning faster than the mast cell mediator storm is settling. IV is in place in the right antecubital, patent, and the monitor is on.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "124",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.hr.why",
          "why": "Jaya's heart rate of 124 bpm is high for a resting 9-year-old (normal ~75–118), but it's the trajectory that matters — it should have dropped further by now if epinephrine dosing and fluids were sustaining compensation. Her tachycardia signals that catecholamine effect is already fading while mast cell degranulation continues.\n\n- **Compensatory tachycardia in anaphylaxis** maintains cardiac output against peripheral vasodilation and myocardial depression from histamine and tryptase; the HR rise buys time for epinephrine to restore tone and suppress mediator release.\n- **Waning epinephrine effect** (dose peaks ~5–10 minutes IM, half-life ~2–3 minutes) combined with persistent mast cell activation explains why the HR hasn't trended toward normal despite two epi doses and fluid resuscitation—the underlying inflammatory storm is outpacing clearance.\n\nPlan the third epi IM dose now; waiting for frank hypotension is waiting too long."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "24",
          "unit": "br/min",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.rr.why",
          "why": "Jaya's respiratory rate of 24 breaths/min is normal for a 9-year-old in compensated shock, not yet a sign of fatigue or impending failure. At her age, the normal range tops out around 25 breaths/min at rest, so she's right at the ceiling — but she's breathing fast because her body is trying to maintain oxygenation and blow off CO2 despite ongoing bronchospasm and visceral edema. What matters clinically is that she is not tiring yet.\n\n- **Compensatory tachypnea** in anaphylaxis serves two purposes: it boosts oxygen delivery to tissues while epinephrine wanes, and it maintains the negative intrathoracic pressure needed to push air past swollen airways.\n- **Fatigue is the ominous vital sign.** Watch for RR dropping below 20 while work of breathing stays high, or a shift from rapid shallow breathing to slow labored breathing — either signals the muscles giving out and heralds decompensation.\n\nAs long as her RR stays coordinated with her effort and mental status remains alert, you have time to escalate bronchodilators and steroids before considering airway intervention."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "90/58",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.bp.why",
          "why": "At 9 years old, Jaya's BP of 90/58 sits at the borderline — technically within the 5th percentile threshold of 70 + (2 × 9) = 88 mmHg, but only barely, and in a child who's just had anaphylaxis with active bronchospasm and fatigue. The systolic is holding, but it's not where you want it after two epi doses and a fluid bolus; the combination of narrow pulse pressure (32 mmHg) and prolonged cap refill (3 sec) tells you peripheral perfusion is still compromised despite the numerical reassurance.\n\n- **Compensatory tachycardia and narrow pulse pressure** are masking relative hypotension — her heart is working hard to maintain a just-adequate systolic, which is the mechanism of compensation in anaphylaxis when catecholamine effect begins to wane.\n- **Persistent mast cell mediator release** after two epi doses means her vasodilation and capillary leak are still outpacing the catecholamine squeeze, so absolute volume deficit remains despite the bolus you've given.\n\nWatch the trend closely over the next 5–10 minutes. If BP drifts lower or cap refill worsens, a third epi dose is warranted; if it holds or improves with another bolus pending, you're on the right path."
        },
        {
          "id": "spo2",
          "label": "SpO₂",
          "value": "95",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.spo2.why",
          "why": "SpO₂ of 95% looks reassuring on paper but is misleading here — Jaya is maintaining oxygenation through aggressive work of breathing and epinephrine effect, not because the anaphylaxis is resolving.\n\n- **Compensatory tachypnea** (RR 24) and visible wheeze signal that she's working hard to move air through bronchospasm; normal SpO₂ masks the underlying airway obstruction that will worsen as epi wears off.\n- **Biphasic anaphylaxis risk** means mediator release can surge again within hours; a patient who looked \"okay\" on supplemental oxygen can decompensate rapidly if you stop escalating adjunctive therapy once the initial epi doses peak.\n\nContinue albuterol-ipratropium nebulization every 15–20 minutes, push the IV dexamethasone now (it takes 4–6 hours to peak), and prepare for a third epi dose if stridor or respiratory deterioration emerges."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.2",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.temp.why",
          "why": "Normal temperature in anaphylaxis doesn't mean the inflammatory cascade has stopped—it reflects the timing of mast cell activation relative to your assessment. Jaya's hives and edema are active, her tryptase is markedly elevated at 24.1 µg/L (peak levels occur 15–30 minutes post-onset and can stay high for hours), and her persistent bronchospasm and hemodynamic instability tell you mediator release is ongoing despite two doses of epinephrine.\n\n- **Temperature tracks systemic inflammation timing, not intensity.** Anaphylaxis does not reliably produce fever; most children present normothermic or hypothermic from peripheral vasodilation and shunting, regardless of mast cell mediator burden.\n- **Persistent signs (wheeze, swelling, tachycardia, elevated lactate) are your real markers of active anaphylaxis.** Temperature adds nothing clinically useful here; focus on whether the epinephrine is holding the bronchospasm and perfusion, not on thermometry.\n\nDo not reassure yourself that she's \"stable\" because she's afebrile—her clinical picture still demands escalation."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.cap.why",
          "why": "At 9 years old, Jaya's capillary refill of 3 seconds is clearly abnormal and reflects inadequate perfusion to her skin — the hallmark of decompensating anaphylaxis even though her blood pressure is still technically normal-for-age.\n\n- **Peripheral vasoconstriction** from catecholamine surge and mast cell mediators shunts blood away from skin to preserve core perfusion, slowing the time for capillaries to refill after blanching.\n- **Maldistribution of perfusion** in anaphylaxis means her central BP may look acceptable while her tissues are starving for oxygen — the elevated lactate and fatigued appearance signal tissue hypoperfusion despite normal systolic pressure.\n\nThe combination of prolonged cap refill, persistent wheeze, facial edema, and rising lactate means the second epinephrine dose is losing effect and a third dose plus aggressive airway management are indicated now."
        }
      ],
      "signs": [
        {
          "id": "skinRash",
          "label": "Skin — Hives",
          "finding": "Urticarial wheals fading at the margins across the trunk; central lesions still raised and erythematous; overall distribution less confluent than arrival.",
          "pos": "trunk and upper extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.skinRash.why",
          "why": "The fading hives signal mast cell degranulation responding to the epinephrine doses, but the pattern of partial resolution tells you the mediator storm hasn't fully cleared — and the persistence of airway edema and tachycardia confirms it. Urticarial lesions fade from the margins inward as histamine and tryptase clear from the skin; the fact that central wheals remain raised means ongoing local mediator release, not just the tail end of absorption. At 20 minutes post-second epi dose, you're seeing the window where epinephrine effect plateaus while mast cells continue dumping their contents — this is when adjunctive therapy matters most.\n\n- **Histamine and tryptase kinetics** drive both the skin findings and the respiratory/hemodynamic instability; the hives are the visible marker of the same process constricting her airways and destabilizing her BP.\n- **Partial resolution without complete clearance** means the first two epi doses bought time but didn't arrest the underlying cascade — adjuncts like IV antihistamines and steroids now prevent the relapse phase and address mediators epinephrine alone cannot suppress.\n\nWatch the hives' trajectory on the next 10-minute reassessment; if new lesions erupt or existing ones stop fading, consider a third epi dose."
        },
        {
          "id": "lipSwelling",
          "label": "Lip / Facial Edema",
          "finding": "Bilateral lip swelling present and unchanged from initial assessment; no progression to tongue or uvular edema; no stridor audible at rest.",
          "pos": "oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.lipSwelling.why",
          "why": "Angioedema in anaphylaxis is driven by mast cell release of histamine and bradykinin — these mediators increase vascular permeability and cause fluid weeping into the dermis and subcutaneous tissues. The fact that Jaya's lip swelling has not progressed to tongue or uvula involvement, and there's no stridor, means the airway edema is confined to the face and lips rather than the critical structures that obstruct breathing. This is reassuring from an airway standpoint, but it also tells you the mast cell degranulation storm is still active — the hives are fading but the angioedema lags behind because edema takes longer to resorb than urticaria does.\n\n- **Persistence of angioedema 20+ minutes post-epinephrine** suggests you're in a biphasic reaction window or the initial epi doses are losing efficacy faster than the mediator release is slowing.\n- **Lack of airway progression (no stridor, no tongue swelling)** keeps this anaphylaxis in the moderate-severe box rather than the life-threat box, but persistent lip edema with ongoing wheeze means she still needs continued epi dosing and close airway monitoring.\n\nWatch the lips and listen for stridor or voice changes — progression to the airway signals imminent obstruction and demands immediate re-dosing or airway preparation."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Expiratory wheeze decreased in intensity bilaterally compared to arrival; mild wheeze persists at both bases; no inspiratory component; accessory muscle use resolved.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.breathSounds.why",
          "why": "Jaya's persistent but improved wheeze shows partial response to epinephrine — the bronchospasm is settling, but the mast cell mediator storm hasn't fully cleared yet. This is the clinical correlate of waning catecholamine effect against ongoing histamine and tryptamine release.\n\n- **Beta-2 agonism from epinephrine** relaxes airway smooth muscle directly, which explains why the loud expiratory wheeze at arrival has quieted; the accessory muscle recruitment dropping out confirms reduced work of breathing.\n- **Ongoing mast cell degranulation** (reflected in the elevated tryptase) continues releasing mediators that re-constrict airways, so complete clearance lags behind the epinephrine dose and will require adjunctive therapy — albuterol and IV antihistamine/steroid — to prevent rebound.\n\nIf the wheeze worsens or stridor develops over the next 15 minutes despite adjuncts, escalate immediately; biphasic anaphylaxis with airway compromise can deteriorate rapidly."
        },
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert but fatigued-appearing; still oriented, following commands, speaking in full sentences now; no agitation.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.mentalStatus.why",
          "why": "Mental status fatigue in anaphylaxis after two epi doses signals catecholamine depletion catching up with mast cell activation — the epinephrine effect is waning while the mediator storm continues, leaving her without sympathetic support to maintain alertness and tone. \n\n- **Catecholamine surge drives both compensation and arousal:** the initial epi boluses flooded her sympathetic nervous system, keeping her fighting and frightened; as those doses metabolize over 15–20 minutes, that drive collapses faster than the underlying anaphylaxis resolves.\n- **Persistent bronchospasm and prolonged tachycardia with falling pulse quality** mean she's still in partial shock despite two epi doses — fatigue is the body's signal that energy stores are depleting and she needs a third epi dose or an adjunct (albuterol for bronchospasm, consider IV terbutaline infusion) to bridge the gap until steroid onset takes effect at 4–6 hours.\n\nWatch the mental status closely over the next 5 minutes: if fatigue deepens to lethargy or agitation returns, she's either rebounding into biphasic anaphylaxis or decompensating from persistent hemodynamic insufficiency — either way, escalate immediately."
        },
        {
          "id": "pulseQuality",
          "label": "Pulse Quality",
          "finding": "Central pulses strong; radial pulse now palpable but still mildly diminished compared to normal.",
          "pos": "central and peripheral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.pulseQuality.why",
          "why": "Narrowing pulse pressure from catecholamine-driven vasoconstriction is the hallmark of compensated anaphylactic shock — Jaya's radial pulse is weaker than her carotid because peripheral vessels are squeezed down to preserve central perfusion despite ongoing mast cell mediator release. **Peripheral vasoconstriction** maintains blood pressure by redirecting flow to the brain and heart, but it taxes the heart and signals that epinephrine's alpha-1 effect is still fighting against vasodilation; a truly resolving anaphylaxis shows both central AND radial pulses returning to normal strength together. **Persistent diminished radials despite two epi doses** tells you the mediator-driven vasodilation is outpacing the catecholamine response — her lactate of 2.2 and still-elevated heart rate confirm tissue hypoperfusion is ongoing. Another epi dose is indicated now, before fatigued mental status or dropping BP forces a transition to IV epi infusion."
        },
        {
          "id": "abdominal",
          "label": "Abdominal Exam",
          "finding": "Soft, non-distended, non-tender; no cramping or guarding reported.",
          "pos": "abdomen",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.abdominal.why",
          "why": "A reassuring abdominal exam in anaphylaxis rules out one of the two major visceral complications — GI mucosal edema and cramping — and narrows the active threat to the airway and cardiovascular compartments. Mast cell degranulation floods the peritoneal and GI tissues with histamine and other mediators; when the abdomen stays soft and non-tender, you know the anaphylaxis is sparing that bed and you can focus your resuscitation attention on the airway swelling and the perfusion deficit driving her elevated lactate and prolonged cap refill. If cramping or distension develops in the next few minutes, it signals progression to biphasic anaphylaxis and demands escalation — fluid push, consider second vasopressor, prepare for airway.\n\n- **Visceral involvement in anaphylaxis** can present as cramping, vomiting, or diarrhea when mast cell mediators cause mucosal edema and smooth-muscle contraction in the gut.\n- **Normal abdominal findings** simplify the clinical picture and allow you to concentrate epinephrine effect and fluid resuscitation on the upper airway and peripheral perfusion, the two dying systems right now."
        },
        {
          "id": "stingsite",
          "label": "Sting Site",
          "finding": "Left forearm wound site unchanged; surrounding flare stable, no expanding induration or streaking.",
          "pos": "left forearm",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.stingsite.why",
          "why": "The stable sting site tells you the local reaction isn't driving the systemic picture — this is true anaphylaxis, not a localized sting reaction that happens to have triggered symptoms. True anaphylaxis is mast cell degranulation driven by cross-linking of IgE on tissue and blood mast cells, releasing histamine, tryptase, and other mediators systemically within minutes. A sting site with expanding erythema, induration, or streaking would signal secondary cellulitis or a spreading local reaction that might explain persistent wheezing or edema through a different mechanism — but yours is unchanged, which anchors the diagnosis to the acute systemic release. Your serum tryptase of 24.1 (significantly elevated) confirms the mast cell activation occurred; the stable forearm wound means you're not treating a concurrent local infection that would complicate antibiotic coverage or monitoring."
        }
      ],
      "labs": [
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "2.2",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.lactate.why",
          "why": "Jaya's lactate of 2.2 mmol/L is mildly elevated and reflects tissue hypoxia from catecholamine-driven vasoconstriction and maldistribution of perfusion — her borderline-low BP and prolonged cap refill (3 sec) confirm a perfusion problem despite normal-range systolic pressure.\n\n- **Epinephrine's alpha-1 effect** constricts peripheral vessels to push blood centrally, which preserves vital organ perfusion but starves skin and muscle; anaerobic metabolism in those shunted beds produces lactate.\n- **Lactate trends matter more than single values** — this 2.2 should fall as you give additional fluids and repeat IM epi (or transition to IV epi if refractory), signaling restoration of tissue oxygen delivery.\n\nKeep rechecking lactate every 15–20 minutes during resuscitation; rising lactate despite fluids and epinephrine is a red flag that shock is deepening and IV epinephrine infusion may be necessary."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "118",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.glucose.why",
          "why": "Jaya's glucose of 118 mg/dL is normal, but it's reassuring precisely because her epinephrine doses have been large and repeated — in anaphylaxis, catecholamines drive hepatic glycogenolysis and suppress insulin secretion, so you'd expect a transient glucose spike. A normal glucose here tells you her metabolic state is stable and her liver is perfusing adequately, which matters as much as the number itself.\n\n- **Epinephrine-induced hyperglycemia** is the expected response to alpha and beta-2 agonism; absence of a glucose rise can signal either inadequate epi dosing or impaired hepatic perfusion in progressive shock.\n- **Normal glucose rules out concurrent hypoglycemia**, which would compound her fatigue and altered perfusion picture and would require immediate dextrose — a distraction you don't have to manage right now.\n\nKeep monitoring glucose if you escalate to pressors or add continuous epinephrine infusions, as sustained catecholamine dosing can produce significant hyperglycemia."
        },
        {
          "id": "tryptase",
          "name": "Serum Tryptase",
          "value": "24.1",
          "unit": "µg/L",
          "ref": "< 11.4",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.tryptase.why",
          "why": "Serum tryptase above 11.4 µg/L confirms mast cell degranulation — the defining event in anaphylaxis — and validates that the hives, angioedema, and bronchospasm are IgE-driven, not a separate process mimicking anaphylaxis. Tryptase peaks 15–30 minutes after symptom onset and persists for several hours, making it a window to confirm the diagnosis and exclude mimics like acute asthma or urticaria alone.\n\n- **Mast cell degranulation** releases tryptase, histamine, leukotrienes, and prostaglandins nearly simultaneously; the tryptase assay documents that the full inflammatory cascade is firing, not just isolated urticaria or wheeze.\n- **Persistent elevation at 20 minutes post-epi** tells you the mast cell reservoir is still discharging mediators faster than epinephrine can suppress them — explaining why her wheeze and angioedema haven't fully resolved despite two IM doses.\n\nThe tryptase result justifies continued observation for biphasic reaction and guides counseling about future risk and need for an epinephrine auto-injector prescription before discharge."
        },
        {
          "id": "cmp_hco3",
          "name": "Bicarbonate",
          "value": "21",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.cmp_hco3.why",
          "why": "Bicarbonate of 21 mEq/L is reassuring here because it tells you the acidosis is not yet established — Jaya's respiratory compensation is still working. In anaphylaxis with persistent bronchospasm and tissue hypoxia, you'd expect HCO3 to start falling as lactate rises and anaerobic metabolism builds. The fact that HCO3 remains at the lower end of normal rather than dropping suggests her minute ventilation (despite the wheeze) is still adequate to blow off CO2 and prevent metabolic acidosis from stacking on top of the hypoxic picture.\n\n- **Lactate-HCO3 pairing** distinguishes early tissue hypoxia from established shock; at 2.2 mmol/L lactate with normal HCO3, she's in the borderline zone where perfusion is marginal but not yet failing catastrophically.\n- **Respiratory compensation** in anaphylaxis drives HCO3 down only when minute ventilation can't keep pace with metabolic demand; her ability to maintain HCO3 means her airway is patent enough to clear CO2, even if the wheeze hasn't fully resolved.\n\nKeep trending lactate and HCO3 on the next panel — rising lactate with falling HCO3 is the signal to escalate support, not stable values with persistent wheeze alone."
        },
        {
          "id": "cmp_k",
          "name": "Potassium",
          "value": "3.7",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.cmp_k.why",
          "why": "Potassium 3.7 mEq/L is still within normal range, but it's sitting at the lower end — and that matters in anaphylaxis because epinephrine drives K+ intracellularly. Jaya has now received two rounds of IM epi plus IV epi exposure, and her K+ has drifted down without dropping into the danger zone yet. Watch this number closely over the next hour because as the acute catecholamine surge wears off and mast cell mediators continue circulating, K+ can rebound or drop further depending on how her cellular pH and perfusion stabilize.\n\n- **Beta-2 agonism shifts potassium into cells** via Na-K-ATPase activation, which is why epinephrine lowers serum K+ acutely even though total body stores are unchanged.\n- **Repeated epi dosing compounds the shift** — each dose pushes K+ lower, and in a 9-year-old with marginal reserve, hitting the floor of normal is a yellow flag that a third epi dose or prolonged epi infusion needs lab surveillance.\n\nRecheck K+ at 30–60 minutes post-resolution; if it drops below 3.5 mEq/L and she's still requiring vasopressor support, consider replacing it cautiously before arrhythmia risk rises."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "10.2",
          "unit": "×10³/µL",
          "ref": "5.0-13.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.wbc.why",
          "why": "Jaya's WBC is normal and reassuring — it tells you this is an acute allergic reaction, not a concurrent bacterial infection masquerading as anaphylaxis or complicating her course. In anaphylaxis, mast cell degranulation floods the bloodstream with histamine, tryptase, and leukotrienes within minutes; the WBC count itself doesn't spike acutely because the reaction is IgE-mediated, not infectious. A normal WBC here confirms you're treating the right problem with the right drug — epinephrine and fluids — without the added complexity of sepsis or a bacterial trigger hiding underneath.\n\n- **Acute IgE-mediated reactions** do not elevate WBC acutely; the mediator surge happens without neutrophil recruitment, so the total count stays normal even as mast cells fire.\n- **Elevated tryptase** (24.1, well above normal <11) confirms mast cell activation; normal WBC rules out concurrent infection that could delay epi response or worsen hemodynamics.\n\nWatch for a secondary rise in WBC over hours if steroids are given, but that's expected — not infection."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 3,
      "id": "intervene2",
      "stageType": "intervene",
      "round": 2,
      "title": "Escalation and Consolidation",
      "narrative": "Jaya's BP has nudged up to 90/58 and her SpO₂ has climbed to 95% on the oxygen mask, which is reassuring — but she's still tachycardic, cap refill lags at 3 seconds, and that persistent wheeze at the bases tells you mast cell mediators are still driving bronchospasm. IV access is confirmed in the right antecubital. The second epinephrine dose is working but the question now is whether you need a continuous epi infusion to stay ahead of the rebound, and whether her airway trajectory is stable enough to avoid escalation. She's fatigued but still protecting her airway. The lip swelling is holding steady — not better, not worse — so you have a window, but you need to act deliberately and have the hard tools nearby in case that changes.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "124",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.hr.why",
          "why": "Jaya's heart rate of 124 bpm is elevated for a 9-year-old (normal 75–118) and reflects catecholamine surge from mast cell degranulation, not compensation for shock — her BP is stable and she's perfusing. The tachycardia persists because histamine and tryptase continue driving sympathetic tone even after the second epinephrine dose begins working on her airway and perfusion. This is the expected lag: the mediators are still circulating, and her heart rate won't normalize until the infusion controls the cascade rather than just one-time boluses fighting rebound.\n\n- **Persistent mediator release** means tachycardia will lag behind clinical improvement — you'll see her wheeze lighten and lip swelling plateau while the heart rate stays elevated, signaling ongoing mast cell activation rather than inadequate epi dosing.\n- **Catecholamine rebound** after each bolus is why a continuous infusion becomes the next step: sustained epinephrine blocks further mediator release and prevents the biphasic reaction that classically strikes 4–12 hours after apparent recovery.\n\nWatch the trend. If the heart rate begins climbing despite oxygen and a second dose, that's your signal to start the continuous infusion now rather than waiting for another bolus to fail."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "24",
          "unit": "br/min",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.rr.why",
          "why": "Jaya's respiratory rate of 24 is within normal for her age, which might feel reassuring — but in the context of active anaphylaxis with wheeze and tachycardia, a normal RR is deceptive. She is working hard to move air through bronchospasm; her rate has not yet climbed because she's compensating with effort rather than frequency.\n\n- **Compensatory work of breathing** maintains minute ventilation despite airway obstruction; the child increases tidal volume and accessory muscle use before ramping respiratory rate, masking the severity of the underlying problem.\n- **RR as a late sign in anaphylaxis** means a normal rate does not rule out impending respiratory failure — watch for retractions, nasal flaring, paradoxical abdominal breathing, or fatigue as better barometers than the number alone.\n\nIf the wheeze worsens or she shows signs of fatigue, escalate quickly; a suddenly climbing RR signals decompensation."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "90/58",
          "unit": "mmHg",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.bp.why",
          "why": "At 9 years old, Jaya's BP of 90/58 is right at the threshold — technically normal-for-age but already narrowed. In anaphylaxis, this reading signals that her catecholamine surge from mast cell degranulation is maintaining perfusion pressure, but only just; the underlying vasodilation from histamine and tryptase is pulling hard the other way. The fact that it's stable *after* epinephrine rather than dropping further tells you the IM doses are working. What matters now is whether the BP stays here or creeps downward as the second epi dose wanes — loss of even 5–10 mmHg would put her into frank hypotension and demand escalation to a continuous epi infusion.\n\n- **Biphasic anaphylaxis risk** means the initial response to IM epinephrine can wear off within 15–30 minutes; trending BP every 5 minutes catches the drop before airway or perfusion crisis.\n- **Vasodilation from mast cell mediators** is relentless as long as degranulation continues, so a \"stable\" BP in early anaphylaxis is not reassurance — it's a temporary truce that requires vigilant reassessment.\n\nWatch the trend, not the single number."
        },
        {
          "id": "spo2",
          "label": "SpO₂",
          "value": "95",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.spo2.why",
          "why": "Jaya's SpO₂ of 95% on supplemental oxygen is reassuring but not fully comforting — her baseline was likely higher, and anaphylaxis-driven bronchospasm can decompensate fast once airway edema starts tightening the glottis.\n\n- **Mast cell mediators cause both bronchospasm and angioedema in anaphylaxis**, which narrows both the lower airway (wheezing) and the laryngeal inlet simultaneously; a stable SpO₂ right now doesn't guarantee airway patency will hold if swelling progresses.\n- **Fatigue from retractions and wheeze work consumes oxygen reserves**, and a child \"protecting her airway\" today can become unable to protect it within minutes if edema crosses the threshold — watch for voice change, stridor, or increased work of breathing as your red flags, not SpO₂ alone.\n\nHave your difficult airway kit and anesthesia nearby; epinephrine IM is still first-line, but her airway trajectory — not her oxygen saturation — is the decision point for escalation."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.2",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.temp.why",
          "why": "Jaya's temperature of 37.2 °C is reassuringly normal, which tells you this is not sepsis masquerading as anaphylaxis — a critical distinction because the management and escalation triggers diverge entirely. Anaphylaxis is IgE-mediated mast cell degranulation; sepsis is infection-driven cytokine storm. Both can present with shock, tachycardia, and altered perfusion, but anaphylaxis should not cause fever, and a febrile child in shock demands bacterial pathogen workup alongside your anaphylaxis response.\n\n- **Normal temperature anchors the diagnosis:** Anaphylaxis onset is sudden (minutes to hours) and typically afebrile; fever suggests concurrent infection or a different primary process driving the shock.\n- **Perfusion findings (cap refill 3 sec, narrow pulse pressure, lactate 2.2) fit mast cell mediators:** Vasoactive mediators (histamine, tryptase, leukotrienes) cause peripheral vasodilation and fluid redistribution, not an infectious inflammatory cascade requiring antimicrobials.\n\nKeep temperature trended — if she spikes fever during treatment, that's your cue to broaden the differential and consider dual pathology."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.cap.why",
          "why": "Cap refill of 3 seconds signals that mast cell mediators — histamine, tryptase, leukotrienes — are causing peripheral vasoconstriction despite her improved SpO₂ and stable blood pressure. This is compensated anaphylactic shock: her central perfusion is holding, but skin blood flow is shunted away.\n\n- **Peripheral vasoconstriction in anaphylaxis** stems from catecholamine surge and direct mast cell mediator effects on vascular smooth muscle, narrowing capillary beds and slowing transit time through the skin.\n- **The lag between BP stability and prolonged cap refill** tells you peripheral perfusion is compromised while central pressures remain adequate — a window where fluid resuscitation and continued epinephrine prevent progression to hypotensive shock.\n\nWatch the cap refill every 5–10 minutes as the second epi dose peaks; if it improves toward 2 seconds, you're winning. If it worsens or her BP begins to drift down, escalate to continuous epi infusion immediately."
        }
      ],
      "signs": [
        {
          "id": "skinRash",
          "label": "Skin — Hives",
          "finding": "Urticarial wheals continuing to fade; lesions thinner and less confluent; scattered residual erythema on the trunk.",
          "pos": "trunk and upper extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.skinRash.why",
          "why": "Hives are the visible footprint of mast cell degranulation — histamine and tryptase released into skin cause the characteristic wheals and surrounding erythema. In anaphylaxis, urticaria often appears first and can precede respiratory or cardiovascular symptoms by minutes, making it both a diagnostic marker and a window into disease trajectory. Fading hives signal that mast cell mediator release is slowing, which is what you want to see after epinephrine — but it does not mean the reaction is over.\n\n- **Biphasic anaphylaxis** occurs in 1–3% of cases when symptoms recur 4–72 hours after apparent recovery; early hives that fade do not exclude a rebound phase requiring prolonged observation and possible continued epinephrine dosing.\n- **Persistent lip edema alongside fading urticaria** indicates cutaneous mediators are clearing faster than deep-tissue angioedema, meaning airway swelling may lag behind skin improvement — do not assume upper-airway safety just because hives are resolving.\n\nWatch for any re-emergence of urticaria or facial swelling during observation; either signals mast cell re-activation and warrants escalation."
        },
        {
          "id": "lipSwelling",
          "label": "Lip / Facial Edema",
          "finding": "Bilateral lip swelling persists without progression; no tongue edema; uvula midline; no stridor.",
          "pos": "oropharynx",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.lipSwelling.why",
          "why": "Bilateral lip swelling in anaphylaxis reflects mast cell degranulation releasing histamine and other vasoactive mediators into the dermis and submucosa — the swelling itself is not life-threatening, but it's a marker that the systemic reaction is still active and the airway could deteriorate if edema spreads to the pharynx or larynx. The fact that it's holding steady (not worsening, not improving) tells you the second epinephrine dose is containing the reaction but hasn't fully reversed it yet.\n\n- **Angioedema mechanism** involves histamine binding H1 and H2 receptors on endothelial cells, triggering vasodilation and increased capillary permeability so fluid leaks into interstitial space.\n- **Airway progression risk** is the clinical worry — if edema creeps from lips into the tongue, soft palate, or laryngeal inlet, you lose the airway rapidly; midline uvula and absence of stridor are reassuring right now, but continuous monitoring is non-negotiable.\n\nWatch the lips and listen for any new stridor or voice change over the next 15–30 minutes as you assess whether a continuous epi infusion or additional doses are needed."
        },
        {
          "id": "breathSounds",
          "label": "Breath Sounds",
          "finding": "Mild residual expiratory wheeze at bilateral bases; upper lung fields clear; accessory muscle use absent; inspiratory phase clear.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.breathSounds.why",
          "why": "The persistent expiratory wheeze despite two IM epinephrine doses signals ongoing bronchospasm from mast cell mediators — anaphylaxis is not just a skin-and-airway disease, it's a cascade that takes time to fully reverse even with appropriate treatment.\n\n- **Beta-2 agonist effect of epinephrine** relaxes airway smooth muscle acutely, but mast cells continue releasing histamine and other mediators for 15–30 minutes after the trigger exposure, perpetuating bronchospasm that lags behind the drug's duration.\n- **Accessory muscle sparing and clear inspiratory phase** mean Jaya is still compensating well — she's not yet in respiratory distress — but the wheeze persists because the underlying inflammatory insult hasn't fully cleared, not because the epi doses have failed.\n\nWatch the wheeze trend over the next 10–15 minutes; if it's clearing, you're tracking the right course. If it worsens or she develops stridor, accessory muscle retractions, or inability to speak full sentences, prepare for airway escalation and consider continuous epi infusion to prevent biphasic reaction."
        },
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Alert and fatigued but conversational; oriented to person, place, and time; speaking in full sentences without distress.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.mentalStatus.why",
          "why": "Jaya's alert, oriented, and conversational mental status is the single most reassuring finding right now — it tells you her brain is still perfused despite the mast cell storm and the persistent wheeze. Altered mental status in anaphylaxis signals either profound hypoxemia or distributive shock from vasoactive mediators overwhelming compensation, either one a red flag for imminent airway loss or cardiovascular collapse. **Preserved cognition with normal cap refill and oxygen saturation** means her compensatory mechanisms are holding: sympathetic tone is maintaining perfusion to the brain and core despite histamine vasodilation and increased capillary permeability. **Fatigue without confusion** reflects work of breathing and fear, not cerebral hypoperfusion — an important distinction because it tells you she can still protect her airway if you need time to gather your team before escalation. Watch for this to change: any drift toward lethargy, slurred speech, or confusion is the cue to call anesthesia and have the operating room standing by."
        },
        {
          "id": "pulseQuality",
          "label": "Pulse Quality",
          "finding": "Central pulses strong bilaterally; radial pulses now palpable though mildly reduced in amplitude.",
          "pos": "central and peripheral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.pulseQuality.why",
          "why": "Central pulses strong but radial pulses mildly reduced in amplitude signal **compensated anaphylactic shock** — mast cell mediators are causing peripheral vasoconstriction even as her heart rate and BP are climbing to maintain core perfusion. This is the critical phase where she still has time before decompensation, but the narrowing pulse pressure (SBP 90, diastolic 58) and lingering 3-second cap refill confirm tissue hypoperfusion despite aggressive epinephrine dosing.\n\n- **Catecholamine-driven vasoconstriction** prioritizes blood flow to brain and heart by shutting down skin and distal extremity beds; radial pulse dampening reflects this peripheral shunting, not improvement.\n- **Persistent gap between central and radial perfusion** with elevated lactate (2.2) means tissues downstream are still working anaerobically; she needs either a second epi dose or transition to continuous infusion to prevent the radial pulses from vanishing entirely and signaling decompensated shock.\n\nWatch the radial pulse closely — if it becomes impalpable or if cap refill widens back to ≥3 seconds despite oxygen and positioning, you're crossing into hypotension-resistant anaphylaxis and need to escalate airway preparation and consider vasopressor infusion."
        },
        {
          "id": "abdominal",
          "label": "Abdominal Exam",
          "finding": "Soft and non-tender; no distension; bowel sounds present.",
          "pos": "abdomen",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.abdominal.why",
          "why": "The soft, non-tender abdomen with normal bowel sounds is reassuring because it rules out anaphylaxis-triggered GI involvement — a finding that would demand aggressive fluid resuscitation and raise concern for evolving shock. Anaphylaxis can produce abdominal cramping, vomiting, and distension from mast cell mediator effects on gut smooth muscle and mucosal permeability; an intact abdominal exam narrows the scope of her systemic involvement. Her elevated lactate (2.2) and delayed capillary refill (3 sec) already signal maldistribution of perfusion from catecholamine surge, but the absence of abdominal distension means you're not fighting compounded fluid shifts or occult bleeding — the perfusion picture is purely from anaphylaxis-driven vasodilation, not multi-organ mast cell activation. This keeps resuscitation straightforward: oxygen, IV access, and epi infusion without the added complexity of suspected visceral edema or hemorrhage."
        }
      ],
      "labs": [
        {
          "id": "lactate",
          "name": "Lactate",
          "value": "2.2",
          "unit": "mmol/L",
          "ref": "0.5-2.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.lactate.why",
          "why": "Jaya's lactate of 2.2 mmol/L is mildly elevated and signals tissue hypoxia from maldistributed perfusion — her cap refill of 3 seconds and narrow pulse quality confirm that mast cell mediators are still causing relative hypovolemia despite near-normal BP.\n\n- **Anaerobic metabolism occurs when oxygen delivery to tissues falls short of demand.** In anaphylaxis, massive vasodilation and increased capillary permeability shunt blood away from skin and muscle toward the core, forcing distal tissues into anaerobic glycolysis and lactate production.\n- **The lactate-perfusion mismatch is your key trigger.** A lactate above 2 paired with prolonged cap refill and weak pulses means the second epi dose is partially working (BP held, SpO₂ improved) but the underlying distributive shock is not fully corrected — continuous epi infusion is the right call now to sustain vasoconstriction while you observe airway trajectory.\n\nWatch for lactate trending down over the next 15 minutes as epi infusion stabilizes perfusion; rising lactate despite fluids and pressors would signal deterioration and escalated airway management."
        },
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "118",
          "unit": "mg/dL",
          "ref": "60-140",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.glucose.why",
          "why": "Glucose is reassuringly normal in anaphylaxis because the catecholamine surge driving the reaction does NOT cause hyperglycemia the way it does in septic or cardiogenic shock — epinephrine's alpha effects dominate the picture, not beta-2 mediated lipolysis and hepatic glycogenolysis. A normal glucose here tells you the metabolic stress is contained to the mast-cell cascade itself, not a broader systemic inflammatory state.\n\n- **Catecholamine stress hyperglycemia** is driven primarily by hepatic glycogenolysis and reduced insulin secretion; anaphylaxis-grade epinephrine release should theoretically trigger it, but the glucose often stays normal because the reaction resolves quickly or because the alpha-vasoconstriction takes priority in the adrenergic hierarchy.\n- **Lactate elevation to 2.2 mmol/L with normal glucose and normal pH** is the real metabolic clue here — tissue hypoperfusion from mast cell-mediated vasodilation and capillary leak, not from shock-driven anaerobic metabolism; glucose alone would miss that signal.\n\nKeep monitoring lactate and cap refill on reassessment — if lactate climbs while glucose stays flat, you're watching progression of distributive shock rather than recovery."
        },
        {
          "id": "tryptase",
          "name": "Serum Tryptase",
          "value": "24.1",
          "unit": "µg/L",
          "ref": "< 11.4",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.tryptase.why",
          "why": "Serum tryptase above 11.4 µg/L confirms mast cell degranulation — the biochemical hallmark of anaphylaxis — and validates the clinical picture of hives, lip edema, and bronchospasm you're seeing at the bedside.\n\n- **Mast cell degranulation** releases preformed mediators (histamine, tryptase, heparin) and newly synthesized ones (leukotrienes, prostaglandins) that trigger bronchospasm, vasodilation, and increased vascular permeability within seconds to minutes.\n- **Tryptase persists longer than histamine** in the serum (peak 15–30 min post-onset, detectable for hours), making it a reliable marker even after the initial insult; a single elevated level confirms anaphylaxis when the clinical picture matches.\n\nThis lab anchors your diagnosis and justifies the escalated airway precautions and second epi dose already underway — the reaction is real and ongoing, not anxiety or urticaria alone."
        },
        {
          "id": "cmp_hco3",
          "name": "Bicarbonate",
          "value": "21",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.cmp_hco3.why",
          "why": "Bicarbonate of 21 mEq/L is sitting at the lower end of normal for Jaya, which is reassuring in the context of anaphylaxis — it tells you she's compensating metabolically without slipping into acidosis despite the mast cell storm. In anaphylaxis, sustained vasodilatation can drive tissue hypoxia and lactate production; a normal bicarbonate means the metabolic load hasn't overwhelmed her buffer capacity yet. That said, her lactate is already mildly elevated at 2.2 mmol/L alongside a 3-second cap refill and tachycardia — early signs of maldistributed perfusion — so the bicarbonate is holding the line but not a promise that it will stay there. Watch for HCO3 to begin dropping as mast cell mediators worsen capillary leak and shock deepens; a falling bicarbonate on repeat labs would be your signal to escalate pressors and prepare for airway management."
        },
        {
          "id": "cmp_na",
          "name": "Sodium",
          "value": "137",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.cmp_na.why",
          "why": "Sodium of 137 mEq/L is reassuring because it tells you the anaphylaxis has not triggered massive fluid shifts or caused the kind of systemic derangement that would raise suspicion for concurrent pathology. In anaphylaxis, the acute insult is mast cell degranulation driving vasodilation, bronchospasm, and angioedema — not electrolyte imbalance. A normal sodium in the setting of hives, wheeze, and lip swelling confirms the picture is classic anaphylaxis without complicating factors like severe dehydration or inappropriate antidiuretic hormone release that might narrow the differential.\n\n- **Sodium stability in early anaphylaxis** reflects that the primary driver is catecholamine and histamine release rather than osmotic stress; fluid shifts are regional (angioedema in face and airway) not systemic.\n- **Normal electrolytes during resuscitation** free you to focus on the two interventions that matter: epinephrine IM dosing and reassessment of airway patency, without chasing lab abnormalities that aren't there.\n\nKeep sodium on your radar during ongoing resuscitation — aggressive fluid boluses can dilute serum sodium if given without reassessment — but at this moment it's not a distractor from the anaphylaxis management."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "10.2",
          "unit": "×10³/µL",
          "ref": "5.0-13.0",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.wbc.why",
          "why": "The WBC of 10.2 is reassuringly normal and argues against concurrent bacterial infection — important because anaphylaxis can look febrile and toxic, and clinicians sometimes reflexively add antibiotics when they shouldn't. Anaphylaxis is purely mast cell degranulation; bacteria are not involved, and the leukocytosis that would flag sepsis is absent here. Her elevated lactate (2.2) and prolonged cap refill reflect maldistribution of perfusion from vasodilation and distributive shock caused by histamine and tryptase, not from infection or tissue hypoxia that would demand antibiotics. Keep the focus on epinephrine dosing and airway readiness — a normal WBC in a child with hives, angioedema, and bronchospasm is a helpful negative that lets you avoid unnecessary antibiotic escalation and stay locked on the actual diagnosis."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to Vital Signs Monitor",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.vsMonitor.fb",
            "fb": "In anaphylaxis, the vitals monitor is your real-time window into whether the mast cell response is resolving or rebounding — and whether you're staying ahead of it with epinephrine dosing. Jaya's tachycardia and prolonged cap refill signal ongoing catecholamine surge and peripheral vasoconstriction despite her reassuring SpO₂; you need continuous trending to catch any drop in BP or rise in HR that would tell you a second epi dose or infusion is needed before her airway swells further.\n\n- **Biphasic anaphylaxis** occurs in 5–20% of cases when mediator release recurs after initial treatment wears off; continuous monitoring catches the early heart rate and perfusion drift that precedes decompensation.\n- **Catecholamine effect on HR and perfusion** is dose- and time-dependent; the monitor lets you distinguish improvement (HR trending down, cap refill normalizing) from plateau (vitals stuck despite epi), which dictates whether you escalate to continuous infusion or observe.\n\nWatch for any upward creep in HR or downward trend in cap refill; those are your cue to redose epi or start the infusion before the airway picture changes.",
            "pri": 1,
            "ok": true
          },
          "stethoscope": {
            "id": "stethoscope",
            "label": "Auscultate breath sounds",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.stethoscope.fb",
            "fb": "Auscultating the bases now clarifies whether bronchospasm is still active and driving her work of breathing, which tells you whether a second epi dose plus continuous infusion will be enough or whether you need to escalate airway support. You heard wheeze from across the room; stethoscope confirms the distribution and intensity — bilateral bases with persistent expiratory component signals mast cell mediators are still constricting bronchial smooth muscle despite the first IM epi. **Continued bronchospasm** in anaphylaxis reflects incomplete catecholamine receptor saturation and ongoing mediator release, so the finding gates your decision on infusion dosing and timing. **Fatigue without improvement in wheeze** after two IM doses is a red flag for impending respiratory failure; catching this early on exam lets you have airway equipment and anesthesia ready before she decompensates rather than scrambling when lip edema worsens or stridor develops.",
            "pri": 1,
            "ok": true
          },
          "intubationKit": {
            "id": "intubationKit",
            "label": "Prepare intubation kit at bedside",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.intubationKit.fb",
            "fb": "Jaya's airway is patent and she's protecting it now, but anaphylaxis is biphasic — airway edema can accelerate without warning, and you need to be ready before she decompensates. Having the intubation kit assembled and within reach is not a trigger to intubate; it's a safety margin.\n\n- **Anticipatory airway management** in anaphylaxis means positioning yourself to act within seconds if lip swelling progresses, stridor develops, or fatigue causes her to lose airway tone — mast cell mediators work fast and airway loss is irreversible without a tube.\n- **Airway edema in anaphylaxis is dynamic**: the second epi dose may hold the line for now, but a third dose, continuous infusion, or additional steroids may be needed before swelling fully resolves; if edema breaches the threshold to stridor or drooling, a pre-positioned kit avoids the fumble of finding a laryngoscope while her SpO₂ drops.\n\nKeep the kit at the bedside but the child on epinephrine and observation — intubate only if airway signs worsen, not preemptively.",
            "pri": 1,
            "ok": true
          },
          "etco2": {
            "id": "etco2",
            "label": "Attach end-tidal CO₂ monitor",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.etco2.fb",
            "fb": "End-tidal CO₂ monitoring lets you detect early airway compromise before hypoxemia appears on the pulse ox — critical in anaphylaxis where angioedema can progress rapidly from lip swelling to glottic closure.\n\n- **Rising etCO₂ with persistent wheeze** signals increasing airway resistance and work of breathing; stable or falling etCO₂ despite wheeze may indicate fatigue and impending respiratory failure.\n- **Normal etCO₂ with normal SpO₂** reassures you the airway is patent and ventilation is adequate, allowing you to defer intubation and focus on epinephrine efficacy and repeat dosing; loss of this reassurance is your trigger to prepare for airway intervention.\n\nIn Jaya's case, a stable etCO₂ trend over the next 10–15 minutes while you titrate epi dosing and observe for rebound angioedema tells you her airway is holding — the window remains open.",
            "pri": 1,
            "ok": true
          },
          "nebSetup": {
            "id": "nebSetup",
            "label": "Set up continuous nebulizer",
            "priority": "distractor-pack",
            "_slotRef": "phase[3].actions.tools.nebSetup.fb",
            "fb": "Continuous nebulized albuterol is the right respiratory pack for status asthmaticus — not anaphylaxis with bronchospasm. Albuterol relaxes bronchial smooth muscle by beta-2 agonism, which would help if Jaya's wheeze were pure reactive airway disease. But anaphylaxis is a mast cell problem: histamine, tryptamine, and leukotrienes are actively driving bronchospasm, angioedema, and vascular leak. Those mediators trump beta-2 agonism until epinephrine suppresses mast cell degranulation — no amount of albuterol addresses the root cause. Jaya's second epi dose is working (BP up, SpO₂ climbing, mental status holding); the next move if she rebounds is a continuous epinephrine infusion or IM epi repeat, not escalation within the respiratory pack. Reserve continuous neb albuterol for the asthmatic child in status — not the anaphylactic child in biphasic risk.",
            "pri": 4,
            "ok": false
          },
          "aLine": {
            "id": "aLine",
            "label": "Place arterial line",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.tools.aLine.fb",
            "fb": "An arterial line gives real-time pressure monitoring and rapid blood-gas sampling, which matters enormously in intubated patients or sustained shock — not in a child whose perfusion is improving on epinephrine and who still has a patent airway. Arterial lines require sedation or restraint in awake children, consume time you don't have, and carry infection and thrombosis risk that outweigh the benefit here. Jaya's BP is stable, her cap refill is lag but not critical, and her lactate of 2.2 is mild — she's compensating. A peripheral IV for repeat epi dosing and a noninvasive cuff to trend BP every 2–3 minutes is the right call now. Save the arterial line for the child who needs intubation, or for the one whose BP starts sliding despite escalating epi doses.",
            "pri": 3,
            "ok": false
          },
          "lumbarPuncture": {
            "id": "lumbarPuncture",
            "label": "Perform lumbar puncture",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.tools.lumbarPuncture.fb",
            "fb": "Jaya needs airway stabilization and continued epinephrine dosing — not a diagnostic procedure inside her CSF. Lumbar puncture is the right call when you're ruling out meningitis in a febrile child with altered mental status or focal neurologic signs; Jaya's mental status is reassuring, her vital signs are tracking toward stability, and her clinical picture is straightforwardly anaphylaxis with ongoing bronchospasm. A needle in her back now diverts your hands and attention from the one thing that matters: watching her airway and her response to the second epi dose, preparing for continuous epinephrine infusion if she rebound-wheezes, and having intubation equipment at the bedside if her lip swelling worsens and threatens her airway. Save the lumbar puncture for the child in septic shock with petechiae and an altered sensorium — not for the child in compensated anaphylaxis recovering toward normal vitals.",
            "pri": 5,
            "ok": false
          }
        },
        "meds": {
          "epiIV": {
            "id": "epiIV",
            "label": "Start IV epinephrine infusion 0.1 mcg/kg/min (titrate to effect)",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.meds.epiIV.fb",
            "fb": "Continuous epinephrine infusion is the right move when a second bolus dose is working but the patient remains symptomatic with ongoing bronchospasm and borderline perfusion — it prevents rebound angioedema and keeps you ahead of mast cell mediators instead of chasing them.\n\n- **Beta-2 agonism** from sustained epinephrine relaxes airway smooth muscle and counters the bronchoconstriction driving her wheeze, while **alpha-1 vasoconstriction** restores peripheral perfusion and prevents the cap refill lag from worsening as mediators continue to cause vasodilation.\n- **Mast cell degranulation in anaphylaxis is biphasic** — the first wave peaks within minutes of epi bolus, but mediator release can recur over the next 4–12 hours, and a continuous infusion buffers against that rebound by maintaining steady-state receptor occupancy rather than letting epi levels crash between boluses.\n\nStart at 0.1 mcg/kg/min (3 mcg/min for Jaya's 30 kg), titrate up by 0.1–0.2 mcg/kg/min every few minutes until the wheeze quiets and cap refill normalizes, then hold and reassess — the goal is the minimum dose that keeps her stable, not maximal dosing.",
            "pri": 2,
            "ok": true
          },
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer NS bolus 300 mL (10 mL/kg) IV — second bolus",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.meds.nsBolus.fb",
            "fb": "Fluid boluses in anaphylaxis restore intravascular volume against mast cell–driven vasodilation and improve perfusion while epinephrine takes effect — this second 10 mL/kg bolus is correct timing because cap refill remains prolonged despite the first epi dose and initial fluids.\n\n- **Mast cell mediators** (histamine, tryptase, leukotrienes) cause arteriolar and capillary vasodilation, pooling blood in the periphery and dropping central perfusion; fluid resuscitation fills the expanded vascular space so epi's vasoconstriction has a full tank to squeeze.\n- **Reassessment between boluses** is the key safeguard in anaphylaxis — Jaya's BP is now adequate (90/58 is normal-for-age) and her SpO₂ is up to 95%, but her cap refill is still 3 seconds and her lactate remains mildly elevated at 2.2 mmol/L, signaling ongoing tissue hypoperfusion despite epi.\n\nWatch for signs of fluid overload (new crackles, jugular distention) as you give the second bolus; anaphylaxis resolves rapidly once epi works, and over-resuscitation can swing the opposite direction.",
            "pri": 2,
            "ok": true
          },
          "methylprednisolone": {
            "id": "methylprednisolone",
            "label": "Administer methylprednisolone 30 mg (1 mg/kg) IV — repeat dose if not given in Round 1",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.methylprednisolone.fb",
            "fb": "Methylprednisolone now locks in the early steroid window in anaphylaxis — the first 30 minutes matter because biphasic reactions can still occur hours later, and steroids take 4–6 hours to peak effect. At 1 mg/kg (30 mg for Jaya's 30 kg), the dose targets mast cell mediator release and reduces the risk of protracted symptoms and late-phase recurrence. Glucocorticoids suppress cytokine-driven inflammation at the level of phospholipase A2 inhibition and reduce adhesion-molecule expression on endothelium, slowing mediator release even as the immediate epi effects wear off. Jaya's persistent tachycardia, delayed cap refill, and visible bronchospasm despite the second epi dose tell you the inflammatory cascade is still running — steroid saturation now prevents backsliding over the next hours of observation.",
            "pri": 1,
            "ok": true
          },
          "diphenhydramine": {
            "id": "diphenhydramine",
            "label": "Administer diphenhydramine 30 mg (1 mg/kg) IV — continue antihistamine coverage",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.diphenhydramine.fb",
            "fb": "Antihistamines after IM epinephrine reduce the duration of allergic symptoms and lower biphasic reaction risk — they're the adjunct that matters once airway and circulation are secured. Diphenhydramine blocks H1 receptors on mast cells and endothelial cells, suppressing the cascade of histamine-mediated vasodilation, bronchoconstriction, and angioedema that drives anaphylaxis. At 1 mg/kg (30 mg for Jaya's 30 kg), the IV dose works faster than IM in a patient already perfusing adequately, and the persistent wheeze and 3-second cap refill tell you mast cell mediators are still active — antihistamine coverage prevents them from rebounding once the epi effect wanes over the next 15–20 minutes.\n\n- **Sequencing after epi** ensures you don't delay the one life-saving drug for adjuncts; antihistamines come second, not first.\n- **Persistent angioedema and bronchospasm** despite rising BP and oxygen show ongoing mast cell release; antihistamine blocks that release pathway while epi infusion maintains perfusion.\n\nHave intubation equipment at the bedside and trend the lip edema closely — if swelling worsens or stridor develops, airway becomes the priority.",
            "pri": 1,
            "ok": true
          },
          "famotidine": {
            "id": "famotidine",
            "label": "Administer famotidine 15 mg (0.5 mg/kg) IV — H2 blockade",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.famotidine.fb",
            "fb": "Famotidine blocks histamine-2 receptor signaling in the stomach and mast cells, reducing gastric acid secretion and dampening the cascade of mediator release — it's a critical adjunct once IM epinephrine has stabilized airway and perfusion in anaphylaxis. At 0.5 mg/kg, Jaya receives 15 mg IV, which reaches peak effect within 15–30 minutes. The H2 blockade does not replace epinephrine or antihistamines; it's the second layer of mast cell suppression working alongside H1 antagonists (diphenhydramine), steroids, and continued epinephrine monitoring. Her persistent tachycardia, borderline cap refill, and elevated lactate tell you the anaphylaxis is partially controlled but not resolved — the biphasic risk window (recurrence 8–12 hours post-exposure) demands sustained pharmacologic coverage. Famotidine reduces the likelihood of rebound mediator release as initial epi wanes.\n\n- **H1 + H2 synergy** targets both receptor types on mast cells; H1 alone leaves H2-driven vasodilation and bronchospasm incompletely suppressed.\n- **Gastric acid suppression** prevents histamine-triggered acid secretion, which can worsen abdominal symptoms if anaphylaxis triggers GI involvement.\n\nDose this now, then reassess her stridor, cap refill, and mental status at 10–15 minutes to determine whether continuous epi infusion is needed.",
            "pri": 1,
            "ok": true
          },
          "magnesiumSulfate": {
            "id": "magnesiumSulfate",
            "label": "Administer magnesium sulfate 750 mg (25 mg/kg) IV over 20 min",
            "priority": "distractor-pack",
            "_slotRef": "phase[3].actions.meds.magnesiumSulfate.fb",
            "fb": "Within the respiratory adjunct pack for anaphylaxis, the interventions that matter are oxygen titration and albuterol for bronchospasm — not magnesium. Magnesium sulfate is a smooth-muscle relaxant that reduces bronchospasm and is genuinely helpful in status asthmaticus, where it's given early (first 60 minutes) and has evidence supporting its use in severe cases. Jaya's anaphylaxis does have bronchospasm, but the driver is mast cell mediator release — histamine, tryptase, leukotrienes — not the sustained smooth-muscle contraction of asthma status. Her wheeze should resolve as the epinephrine suppresses degranulation and the edema recedes. Magnesium won't accelerate that clearance, and it's not the standard adjunct in anaphylaxis guidelines. The right call here is a second or third epi dose if symptoms persist, antihistamines and steroids for the allergic response itself, and airway readiness if swelling worsens — not a smooth-muscle agent meant for a different airway disease.",
            "pri": 4,
            "ok": false
          },
          "epiIM": {
            "id": "epiIM",
            "label": "Administer epinephrine IM 0.3 mg — third dose",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.meds.epiIM.fb",
            "fb": "Epinephrine IM remains first-line for anaphylaxis that worsens or relapses, and Jaya's persistent bronchospasm and elevated cap refill signal incomplete response to the first two doses — a third IM bolus would be the reflex reach. But her trajectory has shifted: BP is now 90/58 (normal for her age), SpO₂ 95%, and mental status reassuring. The borderline perfusion (cap refill 3 sec, lactate 2.2) is the residual sign that epi is still needed — but by continuous IV infusion, not by repeated boluses. Repeated IM dosing every 5–15 minutes risks overdosing her and creates an unpredictable serum level; continuous infusion titrates to her actual perfusion deficit and sustains benefit without the peaks and troughs of repeated boluses. Once IV access is secured and the second dose has had time to work (at least 5 minutes post-injection), switch to continuous epi at 0.1 mcg/kg/min and titrate upward by perfusion findings — cap refill improving, pulse quality returning — rather than giving another IM shot.",
            "pri": 3,
            "ok": false
          },
          "sodiumBicarb": {
            "id": "sodiumBicarb",
            "label": "Administer sodium bicarbonate IV",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.meds.sodiumBicarb.fb",
            "fb": "Jaya needs continuous epinephrine and airway readiness right now — bicarbonate does not address anaphylaxis and delays the interventions that do. Sodium bicarbonate corrects acidosis by buffering hydrogen ions, which sounds relevant when lactate is elevated and perfusion is compromised. But Jaya's pH and bicarbonate are both normal; her mild lactate rise (2.2 mmol/L) reflects transient tissue hypoperfusion from mast cell mediators and catecholamine surge, not metabolic decompensation. As epinephrine restores perfusion and bronchospasm resolves, lactate clears without pharmacologic intervention. Bicarbonate in anaphylaxis steals time and IV access from the two things that matter: sustained epinephrine dosing and preparation for airway escalation if angioedema worsens.\n\n- **Anaphylaxis management is IM epinephrine first, adjuncts second** — antihistamines, steroids, and oxygen support the epi response but never replace it or delay its repeat dosing.\n- **Bicarbonate is reserved for documented severe acidosis (pH <7.1) with cardiovascular collapse or specific toxidromes** like TCA overdose with QRS widening, not for mild lactate elevation in compensated shock.",
            "pri": 5,
            "ok": false
          }
        }
      }
    }
  ],
  "visuals": [
    "hives",
    "lip swelling",
    "oxygen mask"
  ],
  "patient": {
    "name": "Jaya Krishnamurthy",
    "ageLabel": "9 years old",
    "weightKg": 30,
    "sex": "F",
    "cc": "anaphylaxis after bee sting, post-EpiPen"
  },
  "emsReport": "Medic 7 bringing you a 9-year-old, 30 kilos, stung by a bee at a neighborhood picnic about 20 minutes ago. Within five minutes she developed hives all over her trunk, lip swelling, and audible wheeze — mom recognized it immediately and gave her own EpiPen Jr into the outer thigh about ten minutes ago. She had a brief improvement but the wheeze is coming back and she's still hypotensive on our cuff. GCS 14 — she's anxious, opens eyes spontaneously, talking in short sentences. No prior bee sting reactions on record, no known drug allergies. IV not established en route. ETA two minutes.",
  "learnMore": "Biphasic anaphylaxis occurs in up to 20% of cases and can appear 1–72 hours after the initial reaction. A single auto-injector dose of epinephrine is often insufficient for severe or large-patient presentations; the standard EpiPen Jr delivers 0.15 mg, which is at the low end of the 0.01 mg/kg dosing weight for a 30 kg child. Airway edema and bronchospasm can re-escalate even after an initial epi response — early repeat dosing and IV access are critical.",
  "source": "builtin",
  "reassessment": {
    "narrative": "Thirty minutes after the IV epinephrine infusion was started at 0.1 mcg/kg/min and a second 10 mL/kg NS bolus was given, Jaya is looking meaningfully better. Her heart rate has come down to 102, cap refill is now 2 seconds, and her BP has climbed to 106/68. The residual wheeze at the bases has resolved on auscultation, and she's stopped asking for the oxygen mask — SpO₂ is holding at 98% on 2 L nasal cannula. The lip swelling is visibly less pronounced, and she asked for her mom to sit beside her. The epi infusion is titrating down as her hemodynamics stabilize, and the intubation kit that was staged at bedside is being stood down.",
    "vitals": {
      "hr": "102",
      "rr": "20",
      "bp": "106/68",
      "spo2": "98",
      "temp": "37.2",
      "cap": "2 sec"
    },
    "outcome": "transferred-icu",
    "stabilizationSummary": "Jaya is hemodynamically stable with epinephrine infusion titrating down and antihistamines and corticosteroids on board. Given the severity of her biphasic-risk anaphylaxis and the requirement for a continuous vasopressor, she's being admitted to the PICU for at least 24 hours of monitoring and observation. PICU team has accepted; transport is at the bedside."
  },
  "debrief": {
    "summary": "Jaya presented with severe anaphylaxis following a bee sting — hypotension, bronchospasm, urticaria, and angioedema despite a pre-hospital EpiPen. Round 1 correctly prioritized IV access, repeat IM epinephrine, supplemental oxygen, and a fluid bolus to partially restore perfusion. Round 2 recognized the incomplete response and escalated to an IV epinephrine infusion with a second fluid bolus — the moves that definitively stabilized her hemodynamics and cleared her bronchospasm. The full antihistamine and corticosteroid package supported symptom control and helped guard against biphasic recurrence.",
    "keyTeaching": [
      "Epinephrine is the only first-line treatment for anaphylaxis — antihistamines and steroids are adjuncts, not replacements, and should never delay or substitute for epi.",
      "When IM epinephrine produces only partial response, the next step is an IV epinephrine infusion, not a third IM dose — IV titration gives you real-time control over the catecholamine effect.",
      "Persistent hypotension after two epinephrine doses in anaphylaxis reflects vasodilatory distributive shock — aggressive IV fluid resuscitation (10-20 mL/kg boluses, reassessing after each) is an essential co-intervention.",
      "Biphasic anaphylaxis occurs in up to 20% of cases, sometimes hours after the initial reaction resolves — any child with severe anaphylaxis requiring IV epinephrine warrants at minimum 24 hours of monitored observation.",
      "Staging the intubation kit early is the right call when angioedema is present — airway edema can progress faster than you expect, and having the kit ready is low-cost insurance against a rapidly narrowing window."
    ],
    "physiologyDeepDive": [
      {
        "id": "anaphylaxis-mediator-cascade",
        "title": "The Mast Cell Mediator Storm",
        "_slotRef": "debrief.physiologyDeepDive.anaphylaxis-mediator-cascade.content",
        "content": "Anaphylaxis isn't a single toxin or single failing organ — it's a cascade of mast cell degranulation that triggers a mediator storm affecting the airway, vasculature, and gut all at once. Within seconds to minutes, histamine, tryptase, leukotrienes, and prostaglandins flood the bloodstream, causing the bronchospasm, angioedema, and hypotension you see at bedside. Understanding what each mediator does and what each drug blocks is the key to why the correct resuscitation uses epinephrine *and* antihistamines *and* corticosteroids — no single agent stops the whole storm.\n\n- **Mast cells are the trigger: cross-linking of IgE on the mast cell surface opens calcium channels and launches exocytosis.** Within milliseconds, granules containing preformed mediators (histamine, tryptase, heparin) and newly synthesized mediators (leukotrienes, prostaglandins) flood out. This is why anaphylaxis is so fast — the mediator release doesn't wait for new protein synthesis; it's already packaged and ready to fire.\n\n- **Histamine is the most immediate and broadest-acting mediator.** It binds H1 receptors on bronchial smooth muscle (bronchospasm), vascular endothelium (increased vascular permeability and vasodilation), and gastric mucosa (cramping). It also binds H2 receptors on vascular beds (further vasodilation) and on cardiac myocytes (increased contractility as a compensatory attempt). Antihistamines block both H1 and H2, which is why diphenhydramine (H1 + anticholinergic) paired with an H2-blocker (famotidine) is the historical standard — you need both pathways blocked.\n\n- **Tryptase is a marker, not the primary driver of symptoms.** Serum tryptase elevation (normal <11 µg/L; Jaya's 28.4 is nearly 3× normal) confirms mast cell degranulation and correlates with severity, but tryptase itself doesn't cause bronchospasm or shock — it's a biochemical receipt. The high tryptase in this scenario confirms that the cascade happened; it doesn't tell you which mediators are causing the hypotension or wheeze.\n\n- **Cysteinyl leukotrienes (LTC4, LTD4, LTE4) drive the bronchospasm and much of the angioedema.** Leukotrienes are more potent bronchoconstrictors than histamine and are not blocked by antihistamines alone. This is why a patient on diphenhydramine alone can still wheeze — the leukotriene arm of the cascade is still firing. Epinephrine suppresses further leukotriene release by inhibiting mast cell degranulation, but once released, leukotrienes can only be metabolized over minutes.\n\n- **Prostaglandin D2 (PGD2) drives vasodilation and contributes to hypotension.** Like leukotrienes, PGD2 is a newly synthesized mediator, not preformed, so it takes slightly longer to build up but then persists. Aspirin or NSAIDs can block PGD2 synthesis, but they're not first-line in acute anaphylaxis because the time to effect is too slow and the risk of worsening airway edema is real.\n\n- **Epinephrine is the only agent that stops new mediator release.** Epinephrine binds α1 and β2 receptors on mast cells, raising intracellular cAMP and slamming the brakes on exocytosis. It also counteracts the effects of released mediators: α1-mediated vasoconstriction offsets histamine and PGD2 vasodilation, β2-mediated bronchodilation offsets leukotriene and histamine bronchoconstriction, and increased cardiac contractility (β1) helps restore perfusion. IM epinephrine in the lateral thigh (0.01 mg/kg = 0.3 mg for a 30 kg child) is absorbed fastest and most reliably in anaphylaxis.\n\n- **The biphasic or protracted anaphylaxis problem: epinephrine lasts 5–20 minutes.** When the dose wears off, previously released mediators (especially leukotrienes and PGD2) can trigger a second wave of symptoms hours later. This is why corticosteroids are essential — methylprednisolone blocks further mediator synthesis and reduces the inflammatory cascade's tail, preventing or dampening the second wave.\n\n- **Antihistamines address histamine-mediated symptoms but do NOT address leukotrienes or the underlying shock.** Diphenhydramine (1 mg/kg IV, max 50 mg) works fastest IV in acute anaphylaxis but still takes 15–30 minutes to reach full effect. Pairing it with an H2-blocker (famotidine 0.5 mg/kg IV) blocks both H1 and H2 pathways and is standard, though the marginal benefit of H2-blockade in anaphylaxis is debated. Neither agent restores blood pressure or stops mast cell degranulation.\n\n- **Corticosteroids prevent relapse by suppressing both new mediator synthesis and the downstream inflammatory response.** Methylprednisolone (1 mg/kg IV, max 125 mg) or dexamethasone (0.6 mg/kg IV, max 24 mg) given early reduces the incidence of biphasic or protracted reactions from ~20% to ~5% in observational studies. The effect takes 30–60 minutes to peak, so steroids are a ceiling treatment, not a rescue — they're the reason to keep Jaya in the ICU for observation even after the first epinephrine dose works.\n\n- **Fluid resuscitation (10 mL/kg bolus) addresses the vasodilation piece but cannot replace epinephrine.** Histamine and PGD2 cause vasodilation and increased capillary permeability, so intravascular volume drops and third-spaces into the interstitium. IV crystalloid restores preload and buys time for epinephrine to work, but normal saline alone will not reverse shock or stop bronchospasm in anaphylaxis — it's a holding measure while epinephrine and the other agents take effect.\n\n- **The sting site itself is usually reassuring in true anaphylaxis.** The local reaction at the sting (mild erythema or swelling just at the site) is often small compared to the systemic reaction (generalized hives, angioedema, hemodynamic collapse). A huge local reaction without systemic signs usually means large-local reaction, not anaphylaxis; the reverse is true in true anaphylaxis — the systemic cascade dominates and the local sting site becomes almost irrelevant.\n\n**TL;DR:** Anaphylaxis is a mast cell mediator storm — epinephrine stops further release, antihistamines and steroids block or suppress the effects of released mediators, and fluids buy time while those agents work. No single drug treats anaphylaxis; you need all three layers because histamine, leukotrienes, and prostaglandins are hitting different targets simultaneously."
      },
      {
        "id": "distributive-shock-anaphylaxis",
        "title": "Distributive Shock in Anaphylaxis",
        "_slotRef": "debrief.physiologyDeepDive.distributive-shock-anaphylaxis.content",
        "content": "Anaphylaxis is a distributive shock state — the vessels dilate, fluid leaks from the intravascular space into the tissues, and the heart struggles to pump against a collapsed resistance, all happening at once. The blood pressure falls not because the heart is broken (cardiac output can initially stay high) but because systemic vascular resistance plummets and intravascular volume evaporates. Understanding this cascade explains why epinephrine works so fast and why fluids alone won't save the patient.\n\n- **Distributive shock means the resistance tank has a hole.** In sepsis, inflammation causes vasodilation. In anaphylaxis, mast cell degranulation releases histamine, tryptase, leukotrienes, and prostaglandins — all potent vasodilators and capillary-permeability agents. The SVR (systemic vascular resistance) drops, and the blood pressure follows SVR down like a sinking stone.\n\n- **Histamine and tryptase are the mast cell receipts.** In Phase 1, Jaya's serum tryptase was 28.4 µg/L (normal is <11.4) — that number is the proof that mast cells fired and dumped their cargo. Tryptase peaks 15–30 minutes after symptom onset and stays elevated for hours, making it a useful retrospective marker that anaphylaxis occurred even if the acute phase has passed.\n\n- **The capillary leak is not just histamine vasodilation — it's structural.** Histamine and bradykinin bind to endothelial H1 and B2 receptors, which pull apart the tight junctions between endothelial cells. Fluid doesn't just slow down as it crosses the capillary bed; it leaks sideways into the interstitium. A 9-year-old can lose 30–50% of her intravascular volume in minutes into tissue edema — the swollen lips and facial edema you see are the clinical manifestation of that leak.\n\n- **Epinephrine reverses the leak and restores SVR via alpha-1 and beta-2 effects.** The alpha-1 effect causes vasoconstriction, raising SVR back up. The beta-2 effect suppresses mast cell degranulation (stopping new mediator release) and causes bronchial smooth muscle relaxation. IM epinephrine (0.01 mg/kg = 0.3 mg for Jaya's 30 kg) achieves peak plasma concentration in 5–15 minutes — faster than IV — and the effect lasts 10–20 minutes. This is why she got epinephrine first; it's the only drug that addresses both shock and airway threat simultaneously.\n\n- **The lactate elevation (3.1 mmol/L, normal <2) is the tissue hypoxia receipt.** Jaya's heart rate is 138 and her cap refill is 3 seconds — her compensatory tachycardia and poor peripheral perfusion mean the shock is real, not just a number. The tissues aren't getting enough oxygen delivery despite her working hard. Lactate will stay elevated as long as perfusion is poor; it drops once fluids and vasopressors restore microcirculation.\n\n- **Fluids address the leak but can't fix the dilated vessels alone.** IV crystalloid (10 mL/kg bolus = 300 mL for Jaya) refills the intravascular space that histamine leached out. But if you don't give epinephrine first, or if you don't give it again as it wears off, fluid alone won't raise the BP enough because the vessels stay open. The IV bolus buys time; epinephrine is the definitive vasomotor fix.\n\n- **Biphasic anaphylaxis is the hidden risk.** Some patients get anaphylaxis, improve with epinephrine, then deteriorate 5–30 minutes later as the first dose wears off and sensitized mast cells release a second wave. This is why observation, repeat epinephrine dosing, and second-line agents matter. A patient who \"looks better\" 20 minutes in can crash hard if you assume one dose is enough.\n\n- **H1 and H2 blockers don't reverse shock, but they slow late progression.** Diphenhydramine (1 mg/kg IV) blocks histamine at H1 receptors, reducing urticaria and angioedema progression. Famotidine (0.5 mg/kg IV) blocks H2 receptors, which contribute to hypotension. They're not emergent life-savers like epinephrine and fluid, but they dampen the mediator cascade and reduce biphasic recurrence risk — hence they're given after airway, breathing, circulation are stabilized.\n\n- **Corticosteroids (methylprednisolone 1 mg/kg IV, or dexamethasone) prevent late inflammation and reduce biphasic recurrence.** They don't work acutely (onset 1–2 hours), so they come after epinephrine and fluids, but they're a crucial bridge to prevent relapse once the acute phase is managed. In a 9-year-old on a stretcher with stridor looming, steroids feel less urgent than they are — but they're essential to keep you from getting paged later because she crashed a second time.\n\n- **The airway threat in anaphylaxis is time-limited only if you keep dosing.** Jaya's angioedema is bad now but not yet stridor. If the epinephrine wears off before the IV drugs take effect, she can go from tripoding to airway-emergency in minutes. This is why she got a second IM epinephrine dose ready, why IV access was emergent, and why steroids went in right after. You're not just treating the present state; you're forestalling the next 30 minutes.\n\n- **Shock physiology in anaphylaxis reverses fastest with vasoconstrictors, not with inotropes.** Because the problem is low SVR, not low contractility, adding a pure inotrope (dobutamine) without vasoconstriction can worsen shock by dropping SVR further. Epinephrine's dual alpha/beta action is what makes it the first-line agent; it raises both contractility and resistance simultaneously.\n\n**TL;DR:** Anaphylactic shock is a distributive state — vessels dilate and leak fluid, collapsing SVR and intravascular volume at the same time. Epinephrine reverses both problems quickly, but fluids are essential to refill the tank, and corticosteroids plus antihistamines prevent relapse. One dose of epi buys you 10–20 minutes; plan your second dose and IV drugs for when it wears off."
      },
      {
        "id": "epi-mechanism-anaphylaxis",
        "title": "Why Epinephrine Works — and Why IV Infusion Beats Repeat IM",
        "_slotRef": "debrief.physiologyDeepDive.epi-mechanism-anaphylaxis.content",
        "content": "Epinephrine works in anaphylaxis because it hits all four legs of the collapse at once — it stops mast cell degranulation, reverses the vasodilation and capillary leak, strengthens cardiac contractility, and relaxes airway smooth muscle. The reason IM epinephrine is first-line is speed and reliability, but once it's wearing off and you've got IV access, switching to an infusion gives you titratability and sustained effect that repeat IM shots can't match. Understanding which receptor does which job explains why epinephrine is so uniquely effective and why the dosing changes between phases of management.\n\n- **Mast cells are the ignition switch in anaphylaxis.** Cross-linking of IgE receptors by allergen triggers degranulation, releasing preformed mediators (histamine, tryptase, chymase) and triggering synthesis of newly formed ones (leukotrienes, prostaglandins, platelet-activating factor). Serum tryptase rises within minutes and peaks at 15–30 minutes; the level reflects the magnitude of degranulation and helps confirm anaphylaxis, though a normal tryptase 6 hours later doesn't exclude it.\n\n- **Epinephrine's alpha-1 effect is the hemodynamic rescue.** Alpha-1 agonism causes **vasoconstriction**, which counteracts histamine-driven vasodilation and restores systemic vascular resistance and mean arterial pressure. In Jaya's case, her BP of 84/50 and cap refill of 3 seconds signaled profound loss of tone — the alpha effect brought that back within minutes of the IM dose EMS gave.\n\n- **Histamine causes the immediate visible signs.** It triggers H1-mediated smooth muscle contraction in the airways and GI tract, increases vascular permeability (leading to angioedema and lip swelling), and causes vasodilation in the skin (urticaria). H1 blockade with diphenhydramine slows symptom progression, but epinephrine's immediate reversal of the hemodynamic collapse and airway narrowing is what prevents death in the first minutes.\n\n- **Beta-2 agonism in the airway is life-saving.** Epinephrine's beta-2 effect relaxes bronchial smooth muscle, reducing wheeze and work of breathing. In anaphylaxis with airway involvement, this beta effect combined with alpha vasoconstriction is the reason epinephrine is irreplaceable — no other single agent does both. Albuterol is useful as an adjunct for ongoing wheeze, but it has no alpha effect and won't address the shock.\n\n- **IM epinephrine (0.3 mg for Jaya, 0.01 mg/kg for a 9-year-old at 30 kg) is absorbed more reliably than IV bolus in anaphylaxis.** The IM route delivers drug into a perfused muscle bed; in hypotension and shock, IV access may be unreliable and IM avoids the risk of intravascular injection triggering arrhythmia. IM onset is 5–15 minutes; peak is 20–30 minutes. A single IM dose buys time but often isn't enough.\n\n- **Repeat IM epinephrine every 5–15 minutes is the guideline approach if anaphylaxis worsens or persists.** However, logistics matter: each IM needle takes time, causes pain, and in a deteriorating child may delay airway management. Once IV access is secured and the patient is stabilized enough to allow infusion setup, switching to IV epinephrine infusion is more precise and avoids repeated injections.\n\n- **IV epinephrine infusion allows titration to effect.** Starting at 0.05–0.1 mcg/kg/min and titrating up by 50% every 5–10 minutes based on HR, BP, cap refill, and work of breathing gives you a **feedback loop** that IM dosing can't provide. In Jaya's case, an infusion would allow subtle adjustment as her BP and perfusion improve, rather than a supra-threshold IM dose that might overshoot and cause tachycardia or arrhythmia.\n\n- **The risk of repeat IM epinephrine is under-dosing.** Clinicians worry about catecholamine side effects and may space doses too far apart or use sub-recommended doses. The evidence strongly supports repeat dosing at 5–15 minute intervals if anaphylaxis is ongoing; delaying or underdosing prolongs shock and increases the risk of biphasic reaction (recurrence after apparent resolution).\n\n- **Biphasic anaphylaxis occurs in 1–20% of cases** (wide range because definitions vary), typically within 8–12 hours of onset. It's thought to reflect newly synthesized mediators or tachyphylaxis to the initial epinephrine dose. This is why corticosteroids (methylprednisolone in Jaya's case) are given not just to reduce acute symptoms but to prevent or dampen biphasic recurrence — the steroid takes hours to work and won't help the acute phase, only the tail.\n\n- **H1 blockade (diphenhydramine) is adjunctive, not alternative.** Diphenhydramine alone cannot restore blood pressure or relax airways in anaphylaxis; it only slows histamine-mediated symptoms. Older literature incorrectly portrayed antihistamines as primary therapy. Modern understanding is clear: **epinephrine first, then add antihistamines** to improve urticaria and angioedema more completely while epinephrine handles the shock and airway.\n\n- **H2 blockade (famotidine) further reduces histamine effects.** Gastric H2 receptors mediate acid secretion; H2 blockade doesn't directly treat anaphylaxis but may reduce gastric involvement and improve overall histamine antagonism. It's often used as adjunct in severe cases, particularly if GI symptoms are present, though evidence for outcomes benefit is limited.\n\n**TL;DR:** Epinephrine's alpha effect rescues blood pressure and cap refill, beta-2 relaxes the airways, and it suppresses ongoing mast cell degranulation — no other single drug does all three. IM epinephrine is first-line for speed and reliability in the prehospital or no-IV setting; IV infusion after stabilization allows titration and sustained effect, avoiding repeat needles and under-dosing."
      },
      {
        "id": "biphasic-anaphylaxis",
        "title": "Biphasic Anaphylaxis: The Hidden Second Wave",
        "_slotRef": "debrief.physiologyDeepDive.biphasic-anaphylaxis.content",
        "content": "Biphasic anaphylaxis is a second wave of symptoms that recurs hours after the first reaction has apparently resolved — sometimes even after successful epinephrine treatment and apparent clinical recovery. It happens in about 1–5% of anaphylaxis cases overall, but the incidence climbs steeply in severe reactions like Jaya's, where cardiovascular or respiratory compromise required epinephrine in the field. The mechanism isn't fully understood, but the leading theory involves mast cell degranulation continuing or reactivating after the first wave subsides, often triggered by the same allergen still circulating or by a shift in the immune milieu that unmasks a second population of activated cells.\n\n- **The first wave is classic and visible: within minutes of exposure, mast cells dump their preformed mediators** (histamine, tryptase, heparin, proteases) into circulation. These cause the urticaria, angioedema, bronchospasm, and hemodynamic collapse Jaya showed. Tryptase peaks within 15–30 minutes and then falls, but the clinical picture can persist or worsen over the next hour even as tryptase declines.\n\n- **Epinephrine interrupts the first wave by suppressing further mast cell degranulation** (via alpha-2 receptors on mast cells), increasing cardiac output, and causing bronchodilation via beta-2 receptors. It works fast — Jaya's breathing improved and her pressure stabilized after EMS gave it. But epinephrine does not prevent the second wave; it only treats the hemodynamics and bronchoconstriction of the moment.\n\n- **The second wave emerges 4–12 hours later** (sometimes as late as 24 hours, though rarely). Symptoms can range from mild (recurrent urticaria, mild dyspnea) to severe (recurrent cardiovascular collapse, intubation-requiring airway swelling). The second wave is often protracted and more refractory to treatment than the first because by then the patient's epinephrine has cleared and fresh mediators may be arriving from newly activated cells or from **newly synthesized mediators** (leukotrienes, prostaglandins) that weren't present in quantity during the first 30 minutes.\n\n- **Risk factors for biphasic reaction:** severe initial presentation (which Jaya had — respiratory compromise, hypotension, need for IM epinephrine), delayed epinephrine administration, atopy or history of severe allergic disease, and unknown allergen. Jaya meets multiple criteria: she presented with stridor, hypotension, and hypoxia severe enough that EMS gave epinephrine before arrival.\n\n- **Serum tryptase is a snapshot, not a predictor of biphasic risk.** Jaya's tryptase of 28.4 µg/L (upper limit of normal is ~11) confirms mast cell degranulation and anaphylaxis, but a high tryptase doesn't predict whether she'll have a second wave. Conversely, tryptase can be normal in the first phase in some patients (IgE-mediated reactions to foods can present with low tryptase) and is almost always normal by the time the second wave hits, so you can't use tryptase to rule in or out biphasic anaphylaxis in real time.\n\n- **The reason to give corticosteroids and H1/H2 blockers in the acute phase** is not primarily to treat the first wave — epinephrine does that — but to suppress mediator synthesis and receptor upregulation that *might* prevent or dampen the second wave. Methylprednisolone, diphenhydramine, and famotidine don't reverse acute anaphylaxis, but they raise the threshold for recurrence.\n\n- **Observation periods are evidence-based only for certain presentations.** The standard teaching is \"observe all anaphylaxis for 4–6 hours minimum,\" but the data are mixed. Low-risk cases (mild urticaria only, rapid response to epinephrine, known single allergen) may discharge early. High-risk cases — like Jaya, with cardiovascular and respiratory involvement — warrant 6–24 hours of observation, some guidelines even suggesting overnight admission and continued monitoring.\n\n- **The lactate of 3.1 in Phase 1 reflects tissue hypoperfusion from the hypotension and reduced cardiac output**, not primary cell death. Lactate doesn't predict biphasic anaphylaxis either, but it does tell you how deep the shock was and implies higher risk of complications. Jaya's lactate should trend down with fluid resuscitation and improved perfusion; if it stays high or rises during observation, that's a red flag for recurrence or worsening.\n\n- **Repeat epinephrine can be given IM if biphasic symptoms emerge**, using the same 0.01 mg/kg dose (0.3 mg for Jaya). The IM route remains preferred for anaphylaxis because it's faster and more reliable than IV in the field, though in a monitored ICU setting, IV epinephrine infusion is an option for refractory shock. Crucially, some anaphylaxis protocols now recommend a second IM dose at 5–15 minutes if the first dose doesn't improve symptoms — Jaya got one dose from EMS and improved, so she likely doesn't need a repeat in Phase 2, but the principle matters for future cases.\n\n- **Do not discharge Jaya without a clear plan for observation and a prescription for an auto-injector** (two EpiPens, one at home and one portable). Biphasic anaphylaxis is a reason to keep every anaphylaxis patient under observation long enough to catch recurrence, not to avoid giving corticosteroids or antihistamines that might miss the window.\n\n**TL;DR:** Biphasic anaphylaxis is a second wave of symptoms 4–12 hours after the first wave, driven by continued or reactivated mast cell degranulation; it's rare overall but common in severe initial presentations like Jaya's. Corticosteroids and H1/H2 blockers in the acute phase help suppress it, but the real safeguard is observation — discharge anaphylaxis patients only after adequate monitoring and never without an auto-injector prescription."
      }
    ]
  },
  "stabilizationSummary": "Jaya is hemodynamically stable with epinephrine infusion titrating down and antihistamines and corticosteroids on board. Given the severity of her biphasic-risk anaphylaxis and the requirement for a continuous vasopressor, she's being admitted to the PICU for at least 24 hours of monitoring and observation. PICU team has accepted; transport is at the bedside.",
  "tier": 2,
  "icon": "🐝",
  "tagline": "9-year-old · Anaphylaxis",
  "description": "A 9-year-old in anaphylactic shock after a bee sting despite an EpiPen — refractory in round two, needing an epinephrine infusion."
};

export var SC5 = {
  "schemaVersion": "5.4.1",
  "id": "dka-cerebral-edema",
  "title": "No Insulin for Three Days",
  "subtitle": "A known T1D in severe DKA — acid, sugar, and a nervous system in danger",
  "norms": {
    "hr": [
      70,
      110
    ],
    "rr": [
      16,
      24
    ],
    "sbp": [
      90,
      120
    ],
    "dbp": [
      55,
      80
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
      "phaseIndex": 0,
      "id": "assess",
      "stageType": "assess",
      "round": 1,
      "title": "Initial Assessment",
      "narrative": "Mia arrives by stretcher, eyes open, looking at you when you speak but not volunteering words. She's thin with sunken eyes and dry mucous membranes — clearly volume-depleted. Her breathing is deep and slow in that uncomfortable, effortful way that means her body is trying to blow off acid. Abdomen is soft but she winces when you palpate — no peritoneal signs. Peripheral pulses are present but weak compared to her central pulse. Her skin is warm and dry; no rash. The EMS IV is an 18-gauge in the right antecubital, patent and flushing well.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "128",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.hr.why",
          "why": "Mia's heart rate of 128 bpm is elevated for an 8-year-old (normal 75–118), but it's compensatory—her heart is working harder because her tissues are starving for oxygen and her blood volume is contracted from dehydration. The tachycardia buys time before her blood pressure drops further, but it's a sign she's already in compensated shock.\n\n- **Hypovolemic compensation** drives the tachycardia in DKA: severe dehydration shrinks circulating volume, so the heart must beat faster to maintain cardiac output and perfusion to the brain and heart.\n- **Anaerobic metabolism** from poor tissue perfusion (weak peripheral pulses, cap refill 3 sec, altered mental status) triggers catecholamine release, which worsens the tachycardia on top of the volume loss.\n\nMonitor heart rate every 5–10 minutes during the resuscitation bolus—a falling heart rate as fluids run in is reassuring; one that stays high or rises signals deepening shock and need for faster fluid administration or vasopressor consideration."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "32",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.rr.why",
          "why": "Mia's respiratory rate of 32 br/min is markedly elevated for an 8-year-old (normal 18–25 /min) because her body is compensating for severe metabolic acidosis by hyperventilating to blow off CO2 and raise pH. This is Kussmaul breathing — the deep, labored pattern you're observing — and it's a hallmark of DKA, not a primary respiratory problem.\n\n- **Metabolic acidosis drives respiratory compensation.** Her pH of 7.08 with HCO3 of only 5 mEq/L triggers peripheral chemoreceptors; the brainstem responds by increasing ventilatory drive to exhale CO2 and shift the Henderson-Hasselbalch equilibrium toward higher pH.\n- **Beta-hydroxybutyrate accumulation is the root cause.** Insulin deficiency blocks glucose entry into cells, triggering lipolysis and ketone overproduction; the ketoacids (beta-hydroxybutyrate and acetoacetate) overwhelm buffering capacity, forcing respiratory compensation.\n\nThe elevated respiratory rate will improve as insulin and fluids correct the underlying ketoacidosis — it's a compensatory mechanism, not something to suppress."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "96/62",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.bp.why",
          "why": "Blood pressure of 96/62 in an 8-year-old crosses into hypotension — the 5th percentile threshold for her age is roughly 90 + (2 × 8) = 106 mmHg systolic — and signals that Mia's body can no longer compensate for the volume loss and metabolic derangement of DKA. Her tachycardia, tachypnea, weak peripheral pulses, and prolonged capillary refill show she's been compensating up to this point; the hypotension means compensation is failing.\n\n- **Hypovolemia in DKA** drives both the osmotic diuresis (glucose >500 pulls free water out) and the acid-base crisis (depleted intracellular potassium worsens acidosis despite high serum K+ of 5.8). The low sodium of 132 reflects dilution from that free-water loss, not true sodium deficit.\n- **Late decompensation** appears as hypotension because children maintain BP through catecholamine-driven tachycardia far longer than adults do; by the time systolic pressure drops this low, intravascular volume is critically depleted and shock is active.\n\nThis BP demands immediate aggressive isotonic fluid resuscitation — start 20 mL/kg (500 mL) bolus now, reassess perfusion in 5–10 minutes, and prepare for a second bolus if cap refill doesn't improve and BP rises further."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "98",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.spo2.why",
          "why": "SpO2 of 98% looks reassuring on the chip but it is deceptive in DKA — the lungs are working extremely hard to compensate for metabolic acidosis, and hypoxemia is not yet the limiting problem. Mia's respiratory rate of 32 and the deep, effortful pattern (Kussmaul breathing) are her body's attempt to blow off CO2 and raise pH; as long as her lungs can sustain that work, oxygenation stays intact. The real threat is not hypoxemia but respiratory exhaustion — if work of breathing becomes unsustainable, she will decompensate rapidly from fatigue rather than from oxygen failure. Monitor for signs of respiratory muscle fatigue: decreased respiratory effort, paradoxical breathing, or declining mental status. If those appear, intubation becomes urgent regardless of what the pulse oximeter reads.\n\n- **Kussmaul breathing compensates for metabolic acidosis** by hyperventilating to lower pCO2; this mechanism works only while respiratory muscles can sustain the effort.\n- **Respiratory failure in DKA is fatigue-driven, not hypoxemia-driven** — the child tires before the lungs fail to oxygenate, making trend assessment more important than a single SpO2 value."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.1",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.temp.why",
          "why": "Mia's temperature of 37.1 °C is normal, which is clinically reassuring but also a teaching point: DKA does not require fever to be life-threatening. Her shock is driven by volume depletion and metabolic derangement, not by infection or inflammatory response — the absence of fever doesn't soften the urgency. A normal temperature in the setting of profound acidosis (pH 7.08), hyperglycemia (542 mg/dL), and weak pulses tells you this is metabolic crisis, not sepsis, and your first move is isotonic fluid resuscitation, not antibiotics.\n\n- **DKA in children is typically afebrile** — the pathology is insulin deficiency driving ketone production and acidosis, not an infectious process. Fever in DKA should prompt a search for concurrent infection (UTI, pneumonia) rather than being attributed to the ketosis itself.\n- **Shock here is hypovolemic from osmotic diuresis and fluid loss**, not distributive from sepsis, so the management is aggressive IV fluids and insulin after 1 hour of hydration, not early antibiotics and vasopressors.\n\nReassess after the first bolus — if perfusion markers (cap refill, pulse strength, mental status) improve but you uncover a fever trend or source, revisit the differential."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[0].vitals.cap.why",
          "why": "Cap refill of 3 seconds signals peripheral hypoperfusion — Mia's tissues are not getting enough blood flow despite warm skin and no fever. In an 8-year-old with DKA, this reads as hypovolemic shock from severe dehydration compounded by the vasodilation that comes with acidosis and ketosis. The weak peripheral pulses you noted clinically confirm it: central perfusion is preserved (she's alert-ish, no shock bradycardia), but the periphery is being sacrificed.\n\n- **Hypovolemic shock from DKA** strips the intravascular space through osmotic diuresis (glucose >500 pulls water into urine) plus vomiting; prolonged capillary refill reflects inadequate hydrostatic pressure at the arteriolar end.\n- **Metabolic acidosis and ketones** cause direct vasodilation and maldistribution of flow, worsening the perfusion mismatch even as her heart rate climbs to compensate.\n\nStart fluid resuscitation now — 20 mL/kg NS bolus over 5–10 minutes through that patent line, then reassess cap refill, BP, and mental clarity every 5 minutes."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Opens eyes spontaneously; answers simple questions with one or two words but does not initiate speech; follows commands slowly. GCS 13 (E4 V4 M5).",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.mentalStatus.why",
          "why": "Altered mental status in DKA reflects both the direct toxic effect of severe acidosis on the CNS and the osmotic stress from hyperglycemia — Mia's pH of 7.08 and glucose of 542 are driving her sluggish responses and withdrawn behavior. **Hydrogen ion accumulation** from ketoacid production crosses the blood-brain barrier and depresses neuronal function; at a pH this low, cerebral metabolism becomes increasingly impaired. **Hyperosmolarity** (from the hyperglycemia pulling water intracellularly) creates an osmotic gradient that shrinks the extracellular space around neurons, impairing their electrical activity. Her GCS of 13 places her at the milder end of altered mental status in DKA, but the combination of severe acidosis, severe hyperglycemia, and volume depletion means this can worsen rapidly if resuscitation is delayed — trending mental status hourly during the first 6 hours is your monitor for impending cerebral edema risk."
        },
        {
          "id": "breathing",
          "label": "Respiratory Pattern",
          "finding": "Deep, slow, labored respirations with prolonged expiratory phase. No accessory muscle use. Breath sounds clear and equal bilaterally. Fruity odor noted on breath.",
          "pos": "chest",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.breathing.why",
          "why": "Mia's deep, slow respirations with that fruity odor are Kussmaul breathing — her body's desperate attempt to blow off the ketoacids that are driving her pH down to 7.08. This is the pathognomonic respiratory sign of DKA in decompensation, not a sign of primary respiratory disease.\n\n- **Ketoacidosis lowers pH** by accumulating beta-hydroxybutyrate and acetoacetate faster than the kidneys can clear them; her pH of 7.08 with HCO3 of 5 reflects near-total loss of buffering capacity.\n- **Respiratory compensation** via the chemoreceptor reflex deepens the respiratory drive to blow off CO2 and raise pH — the pCO2 of 18 shows this is already maxed out, and the fruity odor signals the ketones themselves on her breath.\n\nThe clear lung fields and normal SpO2 rule out pneumonia or aspiration; this breathing pattern is pure metabolic acidosis, not lung disease. Watch for fatigue — if her deep breathing slows or becomes shallow despite worsening acidosis, she's losing respiratory reserve and needs airway readiness."
        },
        {
          "id": "hydration",
          "label": "Hydration Status",
          "finding": "Sunken eyes, dry cracked lips, dry oral mucosa. Skin turgor reduced — skin tents for 2 seconds on abdominal pinch.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.hydration.why",
          "why": "Mia's sunken eyes, dry mucous membranes, and slow skin recoil (2-second tent) are classic signs of severe hypovolemia — her total body water deficit is substantial enough to demand immediate aggressive fluid resuscitation. In DKA, osmotic diuresis from hyperglycemia drives water loss far beyond sodium loss, leaving the intracellular compartment relatively preserved while the extracellular space shrinks; this is why Mia can look dramatically dehydrated yet have a normal serum sodium despite the glucose at 542. Her weak peripheral pulses relative to strong central pulses and prolonged cap refill (3 seconds) confirm that she's not just dry — she's perfusion-compromised from the volume deficit. Start with 10–20 mL/kg isotonic fluid bolus over 30–60 minutes (250–500 mL in her case), then reassess perfusion and continue deficit replacement over 24–48 hours while insulin begins after the first hour. The dry presentation can mask how sick she is; don't be fooled by a calm child into underestimating her acid-base or volume crisis."
        },
        {
          "id": "abdomen",
          "label": "Abdomen",
          "finding": "Soft, mildly diffusely tender to palpation without guarding or rebound. No distension. Bowel sounds present.",
          "pos": "abdomen",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.abdomen.why",
          "why": "Abdominal tenderness in DKA is visceral pain from ketoacidosis itself, not peritonitis — the soft, non-distended abdomen with normal bowel sounds rules out surgical pathology. Her mild diffuse tenderness paired with deep Kussmaul breathing and pH 7.08 is the signature DKA picture: ketones irritate the peritoneal lining and gut mesentery, producing discomfort that resolves as insulin and fluids correct the acidosis over hours. This is not appendicitis or pancreatitis.\n\n- **Ketone-driven peritoneal irritation** produces abdominal pain in 20–30% of DKA presentations; the pain mirrors acid severity and improves with resuscitation, not with surgery.\n- **Absence of peritoneal signs** (guarding, rebound, distension) and normal bowel sounds exclude acute abdomen; reassess if tenderness worsens or localized despite treatment.\n\nKeep abdominal exam in your back pocket — if pain escalates or new guarding appears after fluids begin, consider a concurrent surgical process rather than attributing everything to DKA."
        },
        {
          "id": "pulses",
          "label": "Peripheral Pulses",
          "finding": "Radial pulses weak but palpable bilaterally; femoral pulses 2+; central pulses strong. No peripheral edema.",
          "pos": "extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.pulses.why",
          "why": "Weak peripheral pulses with strong central pulses signal compensated shock from volume depletion and acidosis — Mia's body is prioritizing perfusion to brain and heart at the expense of skin and extremities. **Selective vasoconstriction** from catecholamine surge and acidosis narrows arterioles in the skin and limbs, reducing pulse amplitude distally while preserving central perfusion pressure. **Hypovolemia from osmotic diuresis** (her glucose of 542 drives water loss) depletes circulating volume, forcing the heart to squeeze harder just to maintain central blood pressure — the weak radial pulse reflects diminished stroke volume reaching the periphery. Her warm skin and strong central pulses mean she's still compensating, but the 3-second cap refill and weak distal pulses warn that compensatory mechanisms are straining; continued DKA progression without fluid resuscitation will flip this to decompensated shock with hypotension and altered mental status."
        },
        {
          "id": "skin",
          "label": "Skin",
          "finding": "Warm and dry. No rash, petechiae, or urticaria. No diaphoresis.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[0].signs.skin.why",
          "why": "Warm, dry skin without diaphoresis is reassuring perfusion on the surface, but in Mia's setting it masks the severity of her shock. DKA causes both hypovolemia (osmotic diuresis from hyperglycemia) and insulin deficiency-driven metabolic derangement; the warm skin suggests her core circulation is still intact despite weak peripheral pulses and delayed capillary refill, placing her in **compensated shock** rather than frank decompensation.\n\n- **Peripheral vasoconstriction from catecholamine surge** narrows skin blood flow to preserve brain and heart perfusion, yet the skin remains warm because the body's overall metabolic rate is still driving heat generation — this is distinct from septic or hemorrhagic shock where skin becomes cool and mottled.\n- **Absence of diaphoresis** in a metabolically stressed 8-year-old with pH 7.08 and glucose 542 is notable because you would expect sympathetic activation to produce sweating; her dry mucous membranes and sunken eyes account for the dry skin better than absent sympathetic tone.\n\nDo not be reassured by the warm skin alone — her cap refill is 3 seconds, her BP is 96/62 (at threshold for her age), and her pulses are weak. This child needs aggressive fluid resuscitation now, not reassessment after another set of vitals."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "542",
          "unit": "mg/dL",
          "ref": "70-140",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.glucose.why",
          "why": "A glucose of 542 mg/dL in an 8-year-old with Kussmaul respirations, severe acidemia (pH 7.08), and elevated beta-hydroxybutyrate confirms diabetic ketoacidosis — not simple hyperglycemia. The glucose itself is the tip of the iceberg; what matters is that insulin deficiency is driving both the glucose rise and the ketone production that's causing the pH to plummet.\n\n- **Absolute or relative insulin deficiency** removes the brake on lipolysis, flooding the bloodstream with free fatty acids that the liver converts to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone), producing the anion gap acidosis and Kussmaul breathing you're seeing.\n- **Osmotic diuresis** from the glucose load causes the severe dehydration and hyponatremia (sodium 132) — glucose >300 pulls water into the urine, and electrolyte losses outpace water losses, shrinking the intravascular space and explaining the weak pulses and capillary refill of 3 seconds.\n\nResuscitation is 10–20 mL/kg isotonic fluid over 30–60 minutes before starting insulin; rushing insulin without filling the tank risks rapid osmolarity shifts and cerebral edema."
        },
        {
          "id": "pH",
          "name": "pH",
          "value": "7.08",
          "unit": "",
          "ref": "7.35-7.45",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.pH.why",
          "why": "Mia's pH of 7.08 is severe metabolic acidosis from diabetic ketoacidosis — her body is pouring out ketoacids faster than she can buffer or exhale them. The deep, slow breathing you're seeing (Kussmaul respirations) is her respiratory system's attempt to blow off CO2 and raise pH, but she's already at the limit of what breathing can do.\n\n- **Ketone-driven acidosis** stems from absolute insulin deficiency allowing unchecked lipolysis; free fatty acids are metabolized to beta-hydroxybutyrate and acetoacetate, which dissociate and flood the blood with hydrogen ions and anions.\n- **Respiratory compensation** via Kussmaul breathing lowers pCO2 (you see 18 mmHg, well below normal) to partially offset the metabolic component, but cannot fully correct an anion-gap acidosis of this magnitude without insulin and fluids to clear the ketones.\n\nThis degree of acidemia is life-threatening — it impairs cardiac contractility, shifts the oxygen-hemoglobin curve leftward, and worsens hyperkalemia (potassium 5.8) by keeping hydrogen and potassium competing for intracellular space. Start isotonic fluids immediately and do not delay insulin beyond the first hour of resuscitation."
        },
        {
          "id": "pCO2",
          "name": "pCO2",
          "value": "18",
          "unit": "mmHg",
          "ref": "35-45",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.pCO2.why",
          "why": "Mia's pCO2 of 18 mmHg is profoundly low because her body is hyperventilating to blow off the acid from ketones — this is compensatory respiratory effort, not primary lung disease. With a pH of 7.08 and HCO3 of only 5 mEq/L, Winter's formula predicts an expected pCO2 around 10–12 mmHg; her actual pCO2 of 18 is higher than expected, which means her respiratory compensation is actually *lagging* despite the obvious tachypnea and deep breathing. This signals DKA is outpacing her lungs' ability to clear CO2 fast enough.\n\n- **Kussmaul respiration** (the deep, effortful breathing you see) is the body's attempt to lower pCO2 and raise pH by blowing off CO2 as a volatile acid; the effort itself tells you acidosis is severe enough to override normal breathing control.\n- **Persistent pCO2 above expected** despite visible hyperventilation suggests either early respiratory muscle fatigue or that ketoacid production is accelerating faster than she can compensate — either way, a red flag that acidosis is worsening and she needs aggressive fluids and insulin soon.\n\nWatch the trend: if pCO2 starts rising toward normal while pH stays low, respiratory fatigue is setting in and you may need airway support."
        },
        {
          "id": "hco3",
          "name": "HCO3",
          "value": "5",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.hco3.why",
          "why": "An HCO3 of 5 mEq/L is severe metabolic acidosis — the bicarbonate buffer is nearly exhausted, which is why Mia's body is breathing so hard to compensate.\n\n- **Bicarbonate depletion in DKA** occurs because ketoacids (beta-hydroxybutyrate and acetoacetate) consume the bicarbonate buffer system faster than the kidneys can regenerate it; the HCO3 falls as the anion gap widens.\n- **Respiratory compensation** via Kussmaul breathing (deep, slow, effortful) attempts to blow off CO2 and raise pH, but an HCO3 this low means the lungs are already working near their maximum — if respiratory effort fails, pH will drop catastrophically.\n\nTrend HCO3 every 1–2 hours during initial resuscitation; rising HCO3 signals that insulin and fluids are closing the ketoacid production, but a persistently low or falling HCO3 despite fluids suggests inadequate insulin dosing or worsening dehydration."
        },
        {
          "id": "potassium",
          "name": "Potassium",
          "value": "5.8",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.potassium.why",
          "why": "Mia's potassium of 5.8 mEq/L is elevated because the severe acidosis is driving potassium out of cells in exchange for hydrogen ions trying to buffer the blood — a direct chemical consequence of her pH of 7.08. This hyperkalemia is dangerous in DKA not because of the number itself, but because insulin and fluids will rapidly shift potassium back *into* cells once treatment begins, risking a precipitous drop that can cause fatal arrhythmias if you're not watching.\n\n- **Acidosis-driven potassium release** occurs across all tissues; H+ ions enter cells to buffer, and K+ leaves to maintain electroneutrality, so serum potassium rises even though total body stores are depleted.\n- **Insulin and fluids reverse the shift** — as acidosis corrects and glucose falls, potassium re-enters cells, and the serum level can plummet within hours if replacement is not ongoing.\n\nDo not start insulin until you have established urine output and confirmed K+ is ≤5.5 mEq/L; once insulin runs, recheck potassium every 2–4 hours and add KCl to maintenance fluids to prevent severe hypokalemia."
        },
        {
          "id": "sodium",
          "name": "Sodium",
          "value": "132",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.sodium.why",
          "why": "Mia's sodium of 132 mEq/L reads falsely low because her glucose is massively elevated — the osmotically active glucose is pulling water into the intravascular space and diluting the sodium. Once you correct for the hyperglycemia using the formula (measured Na + 0.016 × [glucose − 100]), her true sodium is closer to normal, not dangerously hyponatremic.\n\n- **Translocation hyponatremia** occurs when osmotically active particles (glucose, mannitol, contrast) shift water from cells into plasma, lowering measured sodium despite normal total body sodium — the correction formula accounts for this artifact and guides resuscitation strategy.\n- **DKA fluid deficit replacement** targets the corrected sodium, not the measured one; giving hypotonic fluids to treat \"hyponatremia\" in the setting of hyperglycemia risks worsening the osmotic gradient and driving more fluid intracellularly, deepening cerebral edema risk.\n\nRecalculate sodium after insulin and fluids begin lowering glucose — as glucose falls, the corrected sodium will rise toward the true serum value, and you'll see whether Mia truly has a free-water excess to address."
        },
        {
          "id": "bun",
          "name": "BUN",
          "value": "22",
          "unit": "mg/dL",
          "ref": "7-20",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.bun.why",
          "why": "Mia's BUN of 22 is mildly elevated in the context of severe dehydration from DKA — it reflects both prerenal azotemia (poor renal perfusion from volume loss) and the catabolic state of uncontrolled diabetes, not primary kidney injury. Her creatinine remains normal, which keeps the BUN:Cr ratio high and confirms the elevation is from dehydration and hypercatabolism rather than kidney failure. As you resuscitate with isotonic fluid and start insulin, the BUN will trend down once renal perfusion recovers and ketone production halts — a falling BUN is your sign that the metabolic emergency is resolving.\n\n- **Prerenal azotemia** in DKA reflects the combination of osmotic diuresis from hyperglycemia (which pulls water into the urine) and absolute intravascular volume depletion, dropping glomerular filtration rate and allowing urea to concentrate.\n- **Catabolism in DKA** accelerates protein breakdown as insulin deficiency prevents anabolism, generating additional urea that compounds the renal retention picture.\n\nWatch the BUN trend every 2–4 hours during resuscitation; persistent elevation or rise despite fluids signals inadequate perfusion or AKI and warrants reassessment of fluid pace and perfusion markers."
        },
        {
          "id": "creatinine",
          "name": "Creatinine",
          "value": "0.7",
          "unit": "mg/dL",
          "ref": "0.3-0.7",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.creatinine.why",
          "why": "Creatinine is normal at 0.7 mg/dL, but that's deceptively reassuring in the context of DKA and dehydration — Mia's kidneys are actually struggling, and a \"normal\" creatinine masks significant volume loss.\n\n- **Creatinine lags behind acute renal hypoperfusion** because it depends on steady-state muscle breakdown; in acute dehydration, glomerular filtration rate drops before creatinine rises enough to flag it. Her BUN of 22 is elevated while creatinine stays in range, a pattern that signals prerenal azotemia from hypovolemia rather than primary kidney injury.\n- **BUN-to-creatinine ratio of ~31** (versus the normal ~10) confirms volume depletion is driving the lab picture; the kidneys are conserving urea while creatinine hasn't yet caught up. As you resuscitate her, watch for creatinine to rise slightly in the first 6–12 hours if she truly had more severe volume depletion than the initial value suggests.\n\nOnce fluids begin restoring perfusion, her creatinine may transiently worsen before it improves — that rebound is normal and does not signal kidney failure."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "14.2",
          "unit": "× 10³/µL",
          "ref": "5-15",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.wbc.why",
          "why": "In DKA, a WBC count in the normal-for-age range does not mean infection — the count rises from stress hormones and dehydration alone, independent of sepsis. Mia's WBC of 14.2 sits at the upper boundary of normal for her age, which is reassuring given her profound acidosis and volume depletion; she is not showing early bacterial superinfection on top of her metabolic crisis.\n\n- **Stress leukocytosis** from catecholamine surge and hemoconcentration in dehydration drives WBC elevation in DKA without any bacterial infection present, making an isolated elevated WBC a poor sepsis marker in this context.\n- **Absence of bandemia or left shift** (which you would assess from the differential) is what actually rules out bacterial infection; a normal WBC count with immature bands is more suspicious than a high count with mature neutrophils.\n\nFocus your infection workup on bandemia and clinical toxicity rather than the total count — a normal WBC does not give you permission to skip antibiotics if other features of sepsis emerge, but it does mean DKA alone explains the mild leukocytosis you're seeing."
        },
        {
          "id": "betahydroxybutyrate",
          "name": "Beta-Hydroxybutyrate",
          "value": "6.8",
          "unit": "mmol/L",
          "ref": "< 0.6",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[0].labs.betahydroxybutyrate.why",
          "why": "Beta-hydroxybutyrate of 6.8 mmol/L is the ketone that defines DKA — it's the direct product of unchecked lipolysis when insulin is absent or ineffective. Without insulin, fat cells release free fatty acids faster than the liver can use them for energy; the excess gets converted to ketone bodies, driving the anion gap acidosis you see in her pH and HCO3. Beta-hydroxybutyrate is more specific for DKA than urine ketones and correlates tightly with severity — a level this high confirms she's in deep ketosis.\n\n- **Ketogenesis from lipolysis** occurs when insulin deficiency prevents glucose utilization, forcing the body to mobilize fat stores for fuel; the liver converts fatty acids to ketones faster than peripheral tissues can clear them.\n- **Anion gap acidosis** results from accumulation of beta-hydroxybutyrate and acetoacetate; you see the low HCO3 and low pH here because these unmeasured anions displace bicarbonate.\n\nInsulin infusion will shut down lipolysis and clear ketones over hours — monitor beta-hydroxybutyrate or serum ketones to track resolution, not urine ketones alone."
        },
        {
          "id": "phosphorus",
          "name": "Phosphorus",
          "value": "2.8",
          "unit": "mg/dL",
          "ref": "3.5-6.5",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[0].labs.phosphorus.why",
          "why": "Phosphorus drops acutely in DKA because insulin shifts it intracellularly along with glucose and potassium — a predictable consequence of the metabolic derangement, not a marker of total body depletion. Mia's phosphorus of 2.8 mg/dL is low-normal to frankly hypophosphatemic, and it will drop further once you start insulin and fluids because the shift accelerates.\n\n- **Insulin-mediated cellular uptake** drives phosphate into cells as glucose enters; the serum level falls even though total body phosphate is usually normal or depleted from osmotic diuresis.\n- **Repletion timing matters** — phosphate is rarely given in the first hours of DKA resuscitation, but if Mia remains hypophosphatemic after 24–48 hours of therapy or develops respiratory muscle weakness, phosphate replacement (0.1–0.5 mmol/kg IV over 4–6 hours) prevents complications including rhabdomyolysis and impaired cardiac contractility.\n\nWatch the trend after insulin starts; expect the phosphorus to drop initially, then stabilize as total-body stores are replaced through continued IV maintenance fluids."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 1,
      "id": "intervene",
      "stageType": "intervene",
      "round": 1,
      "title": "Initial Management",
      "narrative": "You've confirmed severe DKA: pH 7.08, glucose 542, bicarb of 5, and a kid who's answering you but not looking great. The EMS IV is in and running. Potassium is 5.8 — elevated now, but you know it will drop sharply once insulin starts shifting it intracellularly, so timing matters. Her sodium is 132, but the corrected sodium is actually higher given the hyperglycemia — expect it to rise as glucose comes down. The immediate priorities are controlled volume resuscitation, potassium management, and getting insulin started at the right moment. Watch her neurological status carefully; any change in mentation or drop in heart rate is an early red flag for cerebral edema and warrants immediate escalation.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "128",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.hr.why",
          "why": "Mia's heart rate of 128 bpm is high for an 8-year-old (normal ~75–118 bpm awake) and reflects two drivers: compensation for metabolic acidosis and compensation for hypovolemia. Her pH of 7.08 and bicarbonate of 5 signal severe acidosis; her weak peripheral pulses, capillary refill of 3 seconds, and low-normal blood pressure signal volume depletion. The tachycardia is her body's attempt to maintain cardiac output and tissue perfusion while simultaneously clearing acid through increased minute ventilation — both mechanisms require a faster heart rate.\n\n- **Catecholamine surge** in DKA drives both tachycardia and the Kussmaul breathing pattern you're seeing; the acidotic state itself is a potent sympathetic stimulus independent of shock.\n- **Hypovolemia** from osmotic diuresis (the glucose load pulling water into the urine) reduces circulating volume; tachycardia preserves stroke volume when preload is low.\n\nAs insulin and fluids correct the acidosis and restore volume, expect the heart rate to drift down — failure to decline is a sign the resuscitation isn't working or a complication (worsening acidosis, new infection, cerebral edema) is emerging."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "32",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.rr.why",
          "why": "Mia's respiratory rate of 32 is not primary lung disease — it's her body's desperate attempt to blow off acid by hyperventilating. At 8 years old, the normal range is 18–25; she's well above that, and the narrative describes deep, effortful breathing characteristic of Kussmaul respirations in DKA.\n\n- **Metabolic acidosis** from ketone accumulation (pH 7.08, HCO3 5) triggers the respiratory center to increase minute ventilation and exhale CO2, driving serum pH back up chemically.\n- **Anion gap metabolic acidosis** in DKA is uncompensated by renal mechanisms alone, so respiratory compensation is the body's only immediate tool — and you can hear it: the slow, labored pattern is the hallmark of severe metabolic acidosis.\n\nAs insulin and fluids begin working over the next 1–2 hours, ketone production shuts down, lactate clears, and the respiratory rate should drift back to normal — that normalization is your bedside cue that the acidosis is resolving, not worsening."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "96/62",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.bp.why",
          "why": "Mia's blood pressure of 96/62 is below the hypotension threshold for an 8-year-old (70 + 2 × 8 = 86 mmHg systolic), signaling decompensated shock from severe dehydration and metabolic derangement — she's losing the ability to maintain perfusion pressure.\n\n- **Osmotic diuresis from hyperglycemia** drives massive free-water and electrolyte losses; glucose at 542 overwhelms the renal threshold and pulls fluid into the urine, depleting intravascular volume by 10–15% of body weight in severe DKA.\n- **Hypovolemic shock with vasodilation** from ketoacid-induced inflammation reduces both circulating volume and systemic vascular resistance, collapsing the pressure needed to perfuse vital organs despite her compensatory tachycardia and tachypnea.\n\nStart the first 10–20 mL/kg isotonic bolus now (250–500 mL over 30–60 minutes), then reassess perfusion — cap refill, pulse strength, urine output — before insulin starts."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "98",
          "unit": "%",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.spo2.why",
          "why": "SpO2 of 98% is reassuring and tells you the lungs themselves are not failing — Mia's deep, effortful breathing is metabolic compensation, not respiratory distress from hypoxemia.\n\n- **Kussmaul respiration** is the body's attempt to blow off CO2 and lower pH when metabolic acidosis outpaces the kidneys' ability to excrete acid; it's driven by central chemoreceptor sensing of low pH, not by low oxygen.\n- **Normal oxygenation despite severe acidosis** confirms the problem is metabolic, not pulmonary — her airway is clear, her lungs are ventilating effectively enough to maintain oxygen uptake, and escalation to supplemental oxygen or assisted ventilation is not indicated now.\n\nWatch mental status and heart rate closely; either change signals possible cerebral edema and demands immediate intervention."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.1",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.temp.why",
          "why": "Temperature of 37.1 °C is normal and reassuring in DKA, where you might expect fever from concurrent infection or hypothermia from severe dehydration — neither is present here. DKA itself does not cause fever; if Mia's temperature had been elevated, it would signal a precipitant infection (UTI, pneumonia, gastroenteritis) that needs to be identified and treated alongside the metabolic emergency. A normal temperature means the acidosis is pure metabolic derangement, not superimposed infection, which simplifies your immediate management hierarchy — fluids, insulin, and potassium monitoring take priority without hunting for occult sepsis.\n\n- **Fever in DKA raises suspicion for infection as the trigger** because hyperglycemia and ketoacidosis themselves do not produce fever despite causing profound physiologic stress.\n- **Hypothermia would signal severe peripheral shutdown** and would be a more ominous sign than this normal reading, suggesting end-organ hypoperfusion beyond simple hypovolemia."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "3 sec",
          "unit": "",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[1].vitals.cap.why",
          "why": "Capillary refill of 3 seconds in an 8-year-old signals peripheral hypoperfusion — Mia's tissues aren't getting enough blood flow despite warm skin, and this mismatch is the red flag that matters. In DKA, dehydration shrinks her intravascular volume and acidosis weakens myocardial contractility, forcing the heart to work harder (HR 128) just to maintain a borderline blood pressure (96/62). Her weak peripheral pulses confirm the vasoconstriction — the body is shunting what blood it has toward the core.\n\n- **Compensatory peripheral vasoconstriction** narrows capillary beds to preserve central perfusion, slowing refill even though her skin feels warm rather than mottled; this is the decompensated-but-not-yet-shocked phase where fluids still work.\n- **Intracellular acidosis depresses myocardial contractility** at pH 7.08, reducing stroke volume and forcing tachycardia to compensate; the slow refill reflects both low flow and the metabolic insult to the heart muscle itself.\n\nStart isotonic fluid resuscitation (10–20 mL/kg over 30–60 minutes) and reassess cap refill and mental status every 15 minutes — improvement in refill and stronger peripheral pulses confirm the fluid bolus is working before you add insulin."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Opens eyes spontaneously; answers simple questions with one or two words but does not initiate speech; follows commands slowly. GCS 13 (E4 V4 M5).",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.mentalStatus.why",
          "why": "Altered mental status in DKA reflects both metabolic acidosis depressing CNS function and early cerebral edema from osmotic stress — Mia's lethargy and sparse speech are red flags that demand moment-to-moment monitoring.\n\n- **Ketoacidosis depresses consciousness directly.** A pH of 7.08 with a bicarb of 5 means hydrogen ions are flooding her CSF, impairing neuronal firing and cerebral glucose metabolism, which manifests as slowed speech and delayed responsiveness rather than unresponsiveness — the hallmark of compensated encephalopathy.\n- **Rapid glucose correction risks cerebral edema.** When serum osmolarity drops too quickly during insulin infusion, free water shifts intracellularly into brain parenchyma. Any decline in mentation, drop in heart rate below baseline, or new headache signals impending herniation and demands ICU escalation and osmotic therapy immediately.\n\nReassess mental status every 15 minutes during the first hours of resuscitation — this is your earliest detection system for cerebral edema."
        },
        {
          "id": "breathing",
          "label": "Respiratory Pattern",
          "finding": "Deep, slow, labored respirations with prolonged expiratory phase. No accessory muscle use. Breath sounds clear and equal bilaterally. Fruity odor noted on breath.",
          "pos": "chest",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.breathing.why",
          "why": "Mia's deep, slow respirations with that characteristic fruity odor are Kussmaul breathing — her body's attempt to correct severe metabolic acidosis by blowing off CO2, the volatile arm of the acid-base system. This is the hallmark respiratory sign of DKA and tells you the acidosis (pH 7.08) is severe enough that her brain stem has triggered maximal compensatory hyperventilation.\n\n- **Metabolic acidosis from ketone accumulation** drives the respiratory center to hyperventilate; by increasing minute ventilation, she lowers pCO2, which raises pH mathematically even though the underlying ketoacids remain. Her pCO2 of 18 is appropriate for her HCO3 of 5 — Winter's formula predicts pCO2 ≈ 8-10, so she's compensating at the limit.\n- **Fruity breath odor** comes from acetone, a volatile ketone body eliminated through the lungs; it's a bedside marker that confirms the acidosis is ketotic, not lactic or mixed. The smell alone doesn't change management, but it clinically confirms DKA is the diagnosis.\n\nKussmaul breathing is exhausting work and a red flag for impending respiratory failure if the underlying DKA is not reversed. Monitor her respiratory effort closely during fluid and insulin therapy — any change in rate, depth, or level of consciousness is your signal to reassess for cerebral edema or worsening metabolic derangement."
        },
        {
          "id": "hydration",
          "label": "Hydration Status",
          "finding": "Sunken eyes, dry cracked lips, dry oral mucosa. Skin turgor reduced — skin tents for 2 seconds on abdominal pinch.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.hydration.why",
          "why": "Severe dehydration in DKA reflects a dual fluid loss — osmotic diuresis from uncontrolled hyperglycemia pulls water into the urine, and vomiting or poor intake compounds the volume deficit. Mia's sunken eyes, dry mucous membranes, and slow skin recoil (tenting 2 seconds) place her in the 10–15% total body water deficit range, which tracks with her weak peripheral pulses, narrow pulse pressure, and capillary refill of 3 seconds. The dehydration is driving her tachycardia and tachypnea as compensatory mechanisms to maintain perfusion in a contracted vascular space.\n\n- **Osmotic diuresis** occurs when serum glucose exceeds the renal glucose threshold (~180 mg/dL), forcing glucose into the urine and dragging water along the concentration gradient — at her glucose of 542, she's losing liters of free water hourly.\n- **Corrected sodium paradox** in severe hyperglycemia can mask the true serum sodium; as insulin lowers glucose and free water redistributes, the measured sodium will rise significantly even without sodium replacement, so aggressive hypertonic saline is not indicated and risks overcorrection.\n\nFluid resuscitation happens in two phases: the first 1 hour uses isotonic saline boluses to restore circulating volume and perfusion, then the remaining deficit is replaced over 24–48 hours to avoid osmolar shifts that precipitate cerebral edema."
        },
        {
          "id": "pulses",
          "label": "Peripheral Pulses",
          "finding": "Radial pulses weak but palpable bilaterally; femoral pulses 2+; central pulses strong. No peripheral edema.",
          "pos": "extremities",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.pulses.why",
          "why": "Weak peripheral pulses in DKA signal hypovolemia from osmotic diuresis — Mia has lost total body water, sodium, and potassium, and her circulating volume is contracted even though her glucose remains sky-high.\n\n- **Osmotic diuresis** from hyperglycemia (glucose >250 overwhelms the renal threshold) pulls free water into the urine, dragging sodium and potassium with it; the resulting hypovolemia narrows the pulse pressure and weakens distal perfusion.\n- **Compensatory tachycardia and weak central-to-peripheral gradient** tell you the body is prioritizing brain and heart at the expense of skin and extremities — a sign that circulating volume is genuinely depleted, not just maldistributed.\n\nHer cap refill of 3 seconds and weak peripheral pulses together mean the first intervention is IV isotonic fluid bolus, not insulin — fluids restore perfusion first, insulin comes after an hour once the vascular tank is refilled."
        },
        {
          "id": "skin",
          "label": "Skin",
          "finding": "Warm and dry. No rash, petechiae, or urticaria. No diaphoresis.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[1].signs.skin.why",
          "why": "Warm, dry skin without diaphoresis is reassuring in DKA because it rules out septic shock — a critical distinction when a child presents with altered mental status, tachycardia, and severe acidosis. Sepsis and DKA can look superficially similar, but the skin tells you which one you're fighting.\n\n- **Septic shock** produces vasodilation and maldistribution of perfusion, leaving skin mottled, cool, and often clammy from catecholamine surge and compensatory diaphoresis.\n- **DKA's acidosis** is metabolic in origin (ketone accumulation), not perfusion failure; vasoconstriction from dehydration keeps skin warm and dry despite profound acidemia.\n\nThis distinction matters because septic shock requires pressors after fluid; DKA requires fluids and insulin but no vasopressor therapy. Mia's warm skin confirms you're managing metabolic derangement, not infectious shock."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "542",
          "unit": "mg/dL",
          "ref": "70-140",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.glucose.why",
          "why": "Mia's glucose of 542 mg/dL signals severe insulin deficiency — her body is making ketones because it cannot access glucose for energy, even though glucose is piling up in the bloodstream. The hyperglycemia itself doesn't cause DKA; the deficit of insulin does. You'll see this glucose start to fall within the first 1–2 hours of fluid resuscitation alone, before insulin is even running, because rehydration restores renal perfusion and the kidneys can finally filter glucose again. Once insulin infusion begins, glucose drops faster — target is 100–150 mg/dL by hour 4, which feels counterintuitive when the starting point is 542, but aggressive correction risks cerebral edema from osmotic shifts.\n\n- **Osmotic diuresis** from extreme hyperglycemia forces glucose into urine and pulls free water along, explaining her sunken eyes, weak pulses, and the capillary refill of 3 seconds — she's lost liters of intracellular and extracellular fluid.\n- **Ketone production accelerates when insulin is absent** and lipolysis runs unchecked; the ketones drive the pH down to 7.08 and the respiratory system into overdrive (RR 32) trying to blow off CO2 and compensate.\n\nWatch for the glucose paradox: serum osmolarity will *rise* initially despite fluid and insulin because glucose falls slowly while free water enters cells. Once osmolarity peaks (usually 12–24 hours), then falls, mental status often worsens transiently — this is the peak risk window for cerebral edema, not the start."
        },
        {
          "id": "pH",
          "name": "pH",
          "value": "7.08",
          "unit": "",
          "ref": "7.35-7.45",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.pH.why",
          "why": "A pH of 7.08 signals severe metabolic acidosis driving Mia's deep, effortful breathing and altered mental status — this is life-threatening and requires immediate controlled resuscitation, not rapid correction.\n\n- **Ketoacidosis in DKA** stems from unopposed lipolysis releasing free fatty acids that the liver converts to beta-hydroxybutyrate and acetoacetate; these ketoacids accumulate faster than the kidneys can excrete them, lowering pH progressively.\n- **Kussmaul respirations** (her slow, deep breathing pattern) are the body's attempt to blow off CO2 and raise pH through hyperventilation; the pCO2 of 18 shows this compensation is maximal, and further respiratory drive won't help much now.\n\nFluids and insulin will stop ketone production and allow renal clearance to catch up; avoid bicarbonate, which risks cerebral edema by causing rapid osmolarity swings and generating CO2 the patient can't clear fast enough."
        },
        {
          "id": "pCO2",
          "name": "pCO2",
          "value": "18",
          "unit": "mmHg",
          "ref": "35-45",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.pCO2.why",
          "why": "Mia's pCO2 of 18 mmHg is severely low because her body is compensating for the metabolic acidosis by hyperventilating to blow off CO2 — this is Kussmaul breathing, and it's the most reliable sign that DKA is severe. Her pH of 7.08 with a bicarb of only 5 drives respiratory compensation through chemoreceptor stimulation; the expected pCO2 by Winter's formula should be around 11–13, so a measured 18 suggests her respiratory system is working hard but still lagging behind acid production. **Respiratory compensation in metabolic acidosis** is the body's attempt to lower pCO2 and thereby raise pH (lower pCO2 means less carbonic acid, which shifts the equilibrium toward less H+). **Kussmaul breathing in DKA** is deep and labored because the chemoreceptors are driving respiratory effort to its ceiling — once you see this pattern with this lab pattern, DKA severity is no longer ambiguous. Monitor her respiratory rate and pattern closely during resuscitation; if breathing becomes slower or less effortful while pH is still dropping, that's a red flag for impending respiratory failure and should prompt escalation to intensive care."
        },
        {
          "id": "hco3",
          "name": "HCO3",
          "value": "5",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.hco3.why",
          "why": "A bicarbonate of 5 mEq/L is profound metabolic acidosis — Mia's body is flooded with ketoacids (beta-hydroxybutyrate 6.8 is severely elevated) and she's blown off CO2 as hard as she can to compensate. At pH 7.08, she's already at the threshold where acidosis itself is impairing cardiac contractility and vascular tone, which explains her weak peripheral pulses despite a compensatory heart rate of 128. Her deep, effortful breathing (Kussmaul respirations) is that respiratory compensation working — she's hyperventilating to drive pCO2 down and blunt the pH drop. This extreme bicarb deficit won't correct with fluids alone; it requires insulin to stop ketone production and allow renal perfusion to clear the accumulated ketoacids. Watch her pH trend with insulin infusion — as ketones clear and HCO3 begins to rise, her respiratory drive should normalize and her mental status should improve, which are your reassurance that cerebral edema isn't looming.\n\n- **Metabolic acidosis in DKA** results from unopposed lipolysis and ketone production when insulin deficiency blocks glucose entry into cells; the bicarb buffer is consumed at a rate that exceeds respiratory compensation.\n- **Insulin timing is critical** because starting it too early (before fluids restore perfusion) or holding it too long (allowing ketones to accumulate further) both worsen outcomes; the bicarb trend is your guide to whether the infusion is working."
        },
        {
          "id": "potassium",
          "name": "Potassium",
          "value": "5.8",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.potassium.why",
          "why": "Mia's potassium of 5.8 is elevated now, but it will plummet once insulin and fluids begin working — the real threat is not this moment, it's the hours ahead. Acidosis drives potassium out of cells; as her pH normalizes, potassium shifts back in, and total body deficiency emerges.\n\n- **Acidemia-driven hyperkalemia** occurs because hydrogen ions enter cells in exchange for potassium leaving; the serum K+ looks high despite total body depletion, which is the DKA trap.\n- **Insulin timing gates safety** — hold insulin if K+ <3.5 mEq/L before starting, then recheck K+ after 2–4 hours of resuscitation and before escalating the infusion, because aggressive correction of acidosis without potassium replacement causes life-threatening hypokalemia.\n\nRecheck potassium at 2–4 hours; if it's dropped below 3.5 mEq/L, add KCl to maintenance fluids before advancing insulin dosing."
        },
        {
          "id": "sodium",
          "name": "Sodium",
          "value": "132",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.sodium.why",
          "why": "Mia's serum sodium reads 132, but in the setting of severe hyperglycemia this is a **pseudohyponatremia** — the true free-water deficit is actually larger than the number suggests. Every 100 mg/dL of glucose above 100 pulls about 1.6 mEq/L of water into the intravascular space osmotically, diluting sodium. At a glucose of 542, the corrected sodium is roughly 132 + (1.6 × 4.4) ≈ 139 mEq/L — closer to normal than the lab value appears.\n\n- **Osmotic shift from hyperglycemia** dilutes the measured sodium without reflecting true hyponatremia; correcting for glucose prevents both inappropriate fluid restriction and overtreatment.\n- **As insulin lowers glucose and osmolarity normalizes**, water shifts back intracellularly and measured sodium will rise — expect it to climb 3–5 mEq/L as glucose falls, so rechecking sodium every 2–4 hours during insulin therapy is essential to avoid chasing a moving target.\n\nDo not restrict fluids based on the uncorrected value; restrict based on corrected sodium and clinical reassessment."
        },
        {
          "id": "bun",
          "name": "BUN",
          "value": "22",
          "unit": "mg/dL",
          "ref": "7-20",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.bun.why",
          "why": "BUN of 22 mg/dL is mildly elevated and signals dehydration-driven prerenal azotemia — Mia's kidneys are seeing reduced perfusion and concentrating urea faster than they're clearing it. In DKA, the combination of osmotic diuresis (glucose spilling into urine) plus vomiting and poor intake creates profound volume loss; the BUN-to-creatinine ratio tells you this is a perfusion problem, not kidney injury. Her creatinine is normal at 0.7, so the modest BUN rise is entirely explained by prerenal mechanisms — as you resuscitate with isotonic fluids over the next 24–48 hours, renal perfusion improves and BUN trends downward. Watch the BUN-to-creatinine ratio and urine output; if either worsens despite adequate fluids, escalate concern for acute kidney injury from rhabdomyolysis or other DKA complications."
        },
        {
          "id": "creatinine",
          "name": "Creatinine",
          "value": "0.7",
          "unit": "mg/dL",
          "ref": "0.3-0.7",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.creatinine.why",
          "why": "Mia's creatinine of 0.7 is at the upper limit of normal for an 8-year-old, which tells you her kidneys are handling the acute load but she's already stressed — any higher and you'd be concerned about early acute kidney injury from the DKA itself. Creatinine lags behind true glomerular filtration rate in acute illness; a \"normal\" value doesn't mean the kidneys are fine, it means they haven't decompensated yet. Her BUN of 22 is mildly elevated, and the BUN-to-creatinine ratio of roughly 31:1 (normal is ~10:1) signals prerenal azotemia from hypovolemia — the kidneys are concentrating urine and reabsorbing urea as blood volume drops. As you resuscitate with isotonic fluid over the next 24–48 hours, watch creatinine and BUN trend downward; failure to improve suggests evolving acute kidney injury, which in DKA raises concern for rhabdomyolysis or direct ketoacid-mediated tubular injury."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "14.2",
          "unit": "× 10³/µL",
          "ref": "5-15",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.wbc.why",
          "why": "WBC of 14.2 is within the normal range for an 8-year-old, so it does not suggest infection — which matters because DKA itself triggers a leukemoid response without bacteria present. Stress hormones (catecholamines and cortisol) from the metabolic crisis cause marrow to release mature neutrophils into circulation, raising the WBC count even in sterile DKA. The absence of bandemia (immature forms) and a normal WBC together rule out concurrent bacterial infection as a driver here — you're seeing pure metabolic stress, not sepsis superimposed on DKA. Focus resuscitation on insulin, fluids, and electrolyte rebalancing without empiric antibiotics."
        },
        {
          "id": "betahydroxybutyrate",
          "name": "Beta-Hydroxybutyrate",
          "value": "6.8",
          "unit": "mmol/L",
          "ref": "< 0.6",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[1].labs.betahydroxybutyrate.why",
          "why": "Beta-hydroxybutyrate at 6.8 mmol/L is the biochemical proof that Mia's body is running on ketones instead of glucose — the core defect in DKA — and a marker of severity that guides insulin timing and monitoring.\n\n- **Ketone production in DKA** stems from unopposed lipolysis when insulin deficiency prevents glucose from entering cells; the liver oxidizes free fatty acids to acetyl-CoA faster than the body can use it, shunting the excess to ketone synthesis.\n- **Beta-hydroxybutyrate is the predominant ketone** in DKA (not acetoacetate), so it's the most specific lab marker of ketone burden; levels above 3 mmol/L signal severe ketosis, and 6.8 reflects the degree of metabolic derangement driving her pH of 7.08.\n\nInsulin shuts down lipolysis and ketone production within hours once it reaches tissue; expect beta-hydroxybutyrate to fall steeply after the first dose, often before glucose normalizes — a reassuring sign that the metabolism is correcting even if the serum glucose is still high."
        },
        {
          "id": "phosphorus",
          "name": "Phosphorus",
          "value": "2.8",
          "unit": "mg/dL",
          "ref": "3.5-6.5",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[1].labs.phosphorus.why",
          "why": "Phosphorus of 2.8 is low and will drop further once insulin begins — a critical timing issue in DKA management that directly gates when you start the infusion.\n\n- **Osmotic diuresis** from hyperglycemia drives total-body phosphate depletion; the serum level looks deceptively normal early because acidosis shifts phosphate out of cells, masking the deficit until insulin and fluids correct both.\n- **Insulin-driven shift** will push phosphate intracellularly along with potassium, dropping serum phosphorus acutely and risking rhabdomyolysis, myocardial dysfunction, and impaired diaphragmatic contractility if the deficit is severe.\n\nReassess phosphorus, magnesium, and calcium before starting insulin; if phosphorus is below 3, some protocols recommend repletion (10–20 mmol/L added to IV fluids) before insulin, though this remains contentious and institution-dependent — check your protocol now."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to vital signs monitor",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.vsMonitor.fb",
            "fb": "Vital signs monitoring in DKA is not optional — you need beat-by-beat heart rate and continuous pulse ox to catch the two most dangerous complications: cerebral edema (signaled by sudden bradycardia or altered mental status) and hypokalemic dysrhythmia (peaked T-waves shifting to flattened QRS as K+ crashes during rehydration and insulin therapy). Mia's potassium is 5.8 now, but once fluids dilute it and insulin drives it intracellularly, it can drop 2–3 mEq/L in the first hour — a plunge that destabilizes the myocardium. Continuous monitoring lets you spot a dysrhythmia before it becomes arrest; a sudden drop in heart rate from 128 to 85 in a kid who was responding to you is your early warning sign for cerebral edema and the cue to slow resuscitation and call neurology. Spot checks every 15 minutes miss the trend; the monitor never does.",
            "pri": 1,
            "ok": true
          },
          "ivKit": {
            "id": "ivKit",
            "label": "Confirm and secure IV access",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.ivKit.fb",
            "fb": "Confirming and securing the IV now protects you against a critical failure mode in DKA resuscitation: losing access mid-protocol when you need to push fluids, titrate insulin, or give calcium if potassium spikes further. Mia's EMS line is already patent and flushing, but DKA runs are long — 24–48 hours of continuous infusions, frequent labs, and potential emergencies. A dislodged peripheral IV mid-insulin infusion leaves you scrambling to re-access a dehydrated, hypotensive 8-year-old whose veins are already marginal from volume depletion. Securing the line (careful taping, arm board, documented location and gauge) and having a backup plan — second IV or IO placement upfront — means you stay focused on insulin dosing and electrolyte trends instead of access panic. The 18-gauge is ideal caliber for both fluid bolus and continuous medication; confirm it's still brisk, document the site, and consider placing a second line now while Mia is still cooperative, before the insulin window opens.",
            "pri": 1,
            "ok": true
          },
          "glucometer": {
            "id": "glucometer",
            "label": "Perform bedside glucose check",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.glucometer.fb",
            "fb": "Bedside glucose testing confirms DKA severity and gives you a rapid baseline to track response to treatment — critical because glucose drops faster than ketones clear, and you'll need to switch from high-dextrose fluids to dextrose-containing maintenance once glucose reaches 250–300 mg/dL. The fingerstick glucose of 542 mg/dL matches the profound osmotic diuresis (sunken eyes, dry mucous membranes, weak peripheral pulses) and metabolic acidosis (pH 7.08, bicarbonate 5), confirming this is severe DKA, not mild hyperglycemia. Repeated bedside checks every 1–2 hours during resuscitation let you titrate fluids and insulin timing without waiting for laboratory turnaround — a hand-held measurement is fast enough to catch dangerous swings in either direction and guide when to add dextrose to prevent hypoglycemia once insulin drives the glucose down.",
            "pri": 1,
            "ok": true
          },
          "vbgKit": {
            "id": "vbgKit",
            "label": "Send venous blood gas",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.vbgKit.fb",
            "fb": "A venous blood gas in DKA tells you pH, pCO2, and HCO3 — the real-time markers of acidosis severity and whether resuscitation is working — without waiting for a full arterial sample that takes longer and carries more risk in a dehydrated child with tenuous access.\n\n- **Serial pH and HCO3 tracking** confirms the trajectory of acidosis correction; a persistently low HCO3 or pH that isn't rising after 2–4 hours of fluids signals inadequate resuscitation or delayed insulin effect and prompts reassessment of fluid rate or diagnosis.\n- **pCO2 interpretation alongside mental status changes** is your early warning system for cerebral edema; a falling respiratory rate with rising pCO2 (loss of compensatory hyperventilation) paired with altered mentation is an ominous combination requiring immediate head-of-bed elevation and possible hypertonic saline.\n\nRecheck every 2–4 hours until pH >7.30 and bicarb is rising, then lengthen the interval as she stabilizes.",
            "pri": 1,
            "ok": true
          },
          "ecg12Lead": {
            "id": "ecg12Lead",
            "label": "Obtain 12-lead ECG",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.ecg12Lead.fb",
            "fb": "A 12-lead ECG in severe DKA with a serum potassium of 5.8 mEq/L is essential — hyperkalemia causes peaked T waves, prolonged PR interval, and widened QRS, all of which are visible on the ECG before serum potassium becomes truly life-threatening. In this acidotic state, potassium will rise further before it falls; the ECG tells you whether cardiac membrane instability is already present and gates your speed of correction.\n\n- **Potassium-induced ECG changes** (peaked T waves, widened QRS, prolonged PR) signal that hyperkalemia is affecting cardiac conduction and demand immediate, aggressive treatment, not watchful waiting for serum K+ to fall on its own.\n- **Acidosis traps potassium extracellularly**, making Mia's measured K+ of 5.8 even more concerning for total-body effects — the ECG bridges the gap between a single lab value and the patient's actual cardiac risk in real time.\n\nIf the ECG shows peaked T waves or QRS widening, calcium chloride IV becomes your first move before insulin, not after.",
            "pri": 1,
            "ok": true
          },
          "urinalysis": {
            "id": "urinalysis",
            "label": "Send urinalysis with urine ketones",
            "priority": "correct",
            "_slotRef": "phase[1].actions.tools.urinalysis.fb",
            "fb": "Urinalysis with urine ketones confirms the ketotic state driving DKA and helps exclude concurrent urinary tract infection, which can trigger DKA in a child with new-onset diabetes. Her serum beta-hydroxybutyrate of 6.8 is already diagnostic of severe ketosis, but urine ketones remain positive throughout the resuscitation and serve as a bedside marker of ketone clearance — they lag behind serum levels, so persistent urine ketones during insulin infusion don't mean failure; they track the tail end of ketone excretion. The urinalysis also screens for glucosuria (expected and normal in DKA due to hyperglycemia exceeding the renal threshold) and gives you baseline urine output and specific gravity to monitor hydration response. In a new-onset diabetic, rule out concurrent UTI before attributing all of the picture to DKA alone.\n\n- **Urine ketones persist longer than serum ketones** because the body clears serum ketones faster than they are filtered and excreted; absence of urine ketones late in resuscitation is a reassuring sign of metabolic recovery, but their presence early does not indicate inadequate insulin response.\n- **Glucosuria in DKA is physiologic** — the filtered load of glucose exceeds the tubular reabsorption capacity, so glucose spills into urine despite dehydration; this is not a sign of worsening hyperglycemia, it's a sign the kidneys are perfusing well enough to filter.",
            "pri": 1,
            "ok": true
          },
          "lumbarPuncture": {
            "id": "lumbarPuncture",
            "label": "Perform lumbar puncture",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.tools.lumbarPuncture.fb",
            "fb": "Lumbar puncture is the right call when fever, meningismus, or petechial rash raises concern for meningitis — not when a child presents with classic DKA findings and clear etiology for altered mental status. A lumbar puncture carries real risk in DKA: the procedure itself can trigger or worsen cerebral edema by shifting CSF pressure, and the needle pass adds time when Mia needs controlled fluid resuscitation and insulin to lower her osmolarity. Her altered mentation here is metabolic — driven by severe acidosis (pH 7.08), profound hyperglycemia (542 mg/dL), and osmotic shifts from ketones — not infectious. The CSF would be normal anyway; the diagnostic yield is zero. Save LP for the febrile DKA patient with neck stiffness and petechiae, not the one with sunken eyes, Kussmaul breathing, and a glucose in the 500s.",
            "pri": 3,
            "ok": false
          },
          "headCt": {
            "id": "headCt",
            "label": "Order head CT scan",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.tools.headCt.fb",
            "fb": "Head CT is the reflex reach when a child's mental status is altered, but in DKA the altered mentation usually stems from severe acidosis and hyperosmolarity — not from intracranial pathology — and CT delays the resuscitation that will reverse it. Imaging the brain is appropriate if mental status fails to improve after 1–2 hours of fluid and insulin, or if you see focal neurologic signs, pupillary changes, or sudden deterioration suggesting herniation. Right now, Mia's lethargy tracks with pH 7.08 and glucose 542; her brain will clear as you correct the metabolic derangement. Save the scanner for the child whose mentation worsens despite resuscitation — that's when you worry about cerebral edema and need to see what's happening inside the skull.\n\n- **Acidosis-driven encephalopathy** resolves with fluids and insulin before imaging can even be scheduled; the priority is resuscitation, not diagnosis of an imaging-visible lesion.\n- **Cerebral edema risk peaks during correction**, typically hours into treatment when osmolarity drops too fast; ordering CT now will not prevent it, but careful fluid pacing and slow insulin titration will.",
            "pri": 3,
            "ok": false
          },
          "ioAccess": {
            "id": "ioAccess",
            "label": "Place intraosseous access",
            "priority": "distractor-misc",
            "_slotRef": "phase[1].actions.tools.ioAccess.fb",
            "fb": "Mia has a patent 18-gauge peripheral IV already running, and her shock is compensated — she's perfusing well enough for fluids and medications to reach their target. Intraosseous access is for the child in arrest or profound shock when peripheral IV attempts have failed or no time exists to obtain one. This 8-year-old needs controlled fluid resuscitation over 30–60 minutes with careful potassium and osmolarity management; an IO needle sacrifices the precision of IV dosing and fluid rate control without adding clinical benefit when a working peripheral line is already established. Save IO for the DKA patient who arrives unresponsive or in shock with no vascular access — not this one, who is talking to you across the stretcher.",
            "pri": 5,
            "ok": false
          }
        },
        "meds": {
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer NS bolus 10 mL/kg (250 mL) IV over 30–60 min",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.nsBolus.fb",
            "fb": "In DKA, the first hour is always isotonic fluid alone — no insulin yet. A 250 mL bolus (10 mL/kg) over 30–60 minutes restores circulating volume, improves renal perfusion, and begins clearing ketoacids through urinary excretion, all before insulin shifts the osmotic gradient and risks cerebral edema. Mia's weak peripheral pulses, low-normal blood pressure (96/62, near the hypotensive threshold for an 8-year-old), and elevated creatinine signal volume depletion; fluids come first to restore perfusion and allow the kidneys to work.\n\n- **Osmolarity timing** prevents cerebral edema: insulin lowers serum osmolarity rapidly by driving glucose intracellularly; simultaneous fluids amplify that drop and pull free water into brain cells, triggering swelling. Delaying insulin by 1 hour gives fluids time to partially correct dehydration and osmolarity, so the osmotic gradient when insulin starts is gentler.\n- **Renal ketoacid clearance** requires adequate glomerular filtration: dehydration shuts down urine flow and traps ketoacids in the bloodstream, perpetuating acidosis. Fluids restore GFR so the kidneys can filter beta-hydroxybutyrate and acetoacetate, which is how DKA actually resolves—not by buffering with bicarbonate, but by clearing the ketoacid itself.\n\nStart insulin at the 1-hour mark only if potassium is ≥3.5 mEq/L and she has urinated.",
            "pri": 2,
            "ok": true
          },
          "regularInsulin": {
            "id": "regularInsulin",
            "label": "Start regular insulin infusion 0.1 units/kg/hr (2.5 units/hr) IV",
            "priority": "tied-correct",
            "_slotRef": "phase[1].actions.meds.regularInsulin.fb",
            "fb": "In DKA, insulin starts only after the first hour of isotonic fluid resuscitation — never as a bolus, always as a low-dose infusion. The infusion shuts down ketone production and allows the body to clear the acidosis while fluids restore renal perfusion; together they work. At 0.1 units/kg/hr, Mia receives 2.5 units/hr, a dose low enough to avoid the rapid serum osmolarity swings that trigger cerebral edema. **Timing is the safety issue:** starting insulin before fluids correct the intravascular volume risks precipitous drops in blood glucose and serum sodium as the osmotic gradient reverses, pulling water intracellularly. **Potassium gating is absolute:** Mia's K+ is elevated now at 5.8 mEq/L — actually reassuring because acidosis is pushing it out of cells — but insulin will reverse that within minutes, driving K+ back intracellularly and dropping the serum level sharply. Once insulin runs, expect her K+ to fall toward the 3.5–5 mEq/L safe range; do not delay the infusion for a K+ of 5.8, but do monitor serial levels closely and be ready to supplement if it drops below 3.5 mEq/L.",
            "pri": 2,
            "ok": true
          },
          "potassiumReplacement": {
            "id": "potassiumReplacement",
            "label": "Hold potassium replacement — recheck after insulin started",
            "priority": "correct",
            "_slotRef": "phase[1].actions.meds.potassiumReplacement.fb",
            "fb": "Holding potassium replacement in severe DKA despite elevated serum K+ is the bedside rule that saves lives — the number you see now will plummet once insulin shifts K+ intracellularly, and giving K+ on top of that drop triggers dangerous hypokalemia.\n\n- **Acidosis drives potassium out of cells** into the serum; Mia's K+ of 5.8 is a reflection of her pH 7.08 and total-body depletion, not adequate stores — she has lost liters of fluid and electrolytes through osmotic diuresis.\n- **Insulin reverses the shift** by activating Na-K-ATPase; within 1–2 hours of starting the infusion, serum K+ can drop 1–2 mEq/L or more, landing her in the dangerous zone if you've already given replacement.\n\nRecheck K+ 1–2 hours after insulin initiation, and only begin KCl when K+ falls below 5.5 mEq/L and she's urinating steadily — that's when the total-body deficit becomes the clinical problem.",
            "pri": 1,
            "ok": true
          },
          "ondansetron": {
            "id": "ondansetron",
            "label": "Administer ondansetron 0.15 mg/kg (4 mg) IV for emesis",
            "priority": "correct",
            "_slotRef": "phase[1].actions.meds.ondansetron.fb",
            "fb": "Ondansetron prevents the vomiting that would worsen dehydration and delay oral intake during DKA recovery — a practical win in a kid who's already volume-depleted and at risk for aspiration if her mental status dips further. Ondansetron is a 5-HT3 antagonist that blocks serotonin receptors in the chemoreceptor trigger zone and GI tract, cutting off the nausea-vomit reflex without sedating her or masking critical changes in her mental status (unlike antihistamines or anticholinergics). In Mia's case at 25 kg, 0.15 mg/kg gives 3.75 mg — rounding to 4 mg IV is standard practice. Nausea in DKA is driven by acidosis and ketone accumulation; it usually resolves within hours as insulin and fluids correct the pH and clear ketones, so a single dose or brief course is often enough.",
            "pri": 1,
            "ok": true
          },
          "sodiumBicarb": {
            "id": "sodiumBicarb",
            "label": "Administer sodium bicarbonate IV push",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.meds.sodiumBicarb.fb",
            "fb": "Bicarbonate is the right call when acidosis is causing cardiovascular collapse (hypotension, altered perfusion) and pH is below 6.9 despite resuscitation, or in tricyclic antidepressant overdose with QRS widening — not in straightforward DKA. Sodium bicarbonate works by buffering hydrogen ions, which sounds like exactly what a pH of 7.08 needs. But in DKA the acidosis is driven by ketoacid accumulation, and the body clears it as insulin shuts down ketone production and fluids restore renal perfusion. Bicarbonate in this setting generates CO2 that Mia's respiratory system must blow off; paradoxically, it can lower CSF pH transiently and raises theoretical concern for cerebral edema without proven benefit. Mia's blood pressure is low and her perfusion is weak, but the driver is hypovolemia and keto-acidosis, not cardiogenic shock — fluids and insulin, not bicarbonate, restore perfusion and clear the ketones.",
            "pri": 3,
            "ok": false
          },
          "dextroseBolus": {
            "id": "dextroseBolus",
            "label": "Administer dextrose bolus IV",
            "priority": "distractor-clinical",
            "_slotRef": "phase[1].actions.meds.dextroseBolus.fb",
            "fb": "Dextrose bolus is the right call when hypoglycemia is driving altered mental status or seizures — not in DKA with a glucose of 542. A dextrose bolus would spike glucose further, worsening the osmotic diuresis and delaying insulin efficacy. In DKA, hyperglycemia is the problem insulin solves; adding dextrose antagonizes that work. You'll add dextrose to maintenance fluids later (when glucose drops to 250–300 mg/dL), but only to prevent hypoglycemia during ongoing insulin infusion — never as a bolus at this glucose level.\n\n- **Osmotic diuresis** from extreme hyperglycemia is driving Mia's volume depletion and weak pulses; dextrose bolus worsens the osmotic load and delays resolution.\n- **Insulin timing** in DKA follows controlled rehydration first; adding dextrose now skips the physiology and invites hyperglycemic hyperosmolar crisis rather than treating it.\n\nSave dextrose bolus for the hypoglycemic child in shock or the one seizing from low glucose — not the one in ketoacidosis.",
            "pri": 3,
            "ok": false
          },
          "hypertonicSaline": {
            "id": "hypertonicSaline",
            "label": "Administer 3% hypertonic saline IV",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.hypertonicSaline.fb",
            "fb": "Within the IV fluid pack for DKA, the first-line resuscitation is isotonic crystalloid (normal saline or lactated Ringer's) given as a controlled bolus over 30–60 minutes, not hypertonic saline. Hypertonic saline is an osmotic agent that shrinks intracellular edema by drawing fluid across the blood-brain barrier — the mechanism is perfect for raised intracranial pressure or impending cerebral edema. Mia's mental status is altered from severe acidosis and dehydration, not from cerebral edema; her neurological decline would present as bradycardia, posturing, or seizure, not the lethargy of acute metabolic derangement. Isotonic fluids restore intravascular volume and improve perfusion without the osmotic stress that hypertonic saline carries in DKA. Reserve hypertonic saline for the moment her mentation worsens despite acidosis correction — that signals cerebral edema and demands immediate escalation, not routine resuscitation.",
            "pri": 4,
            "ok": false
          },
          "mannitol": {
            "id": "mannitol",
            "label": "Administer mannitol 0.5–1 g/kg IV",
            "priority": "distractor-pack",
            "_slotRef": "phase[1].actions.meds.mannitol.fb",
            "fb": "Within the intracranial pressure management pack for DKA, the correct first move is head-of-bed elevation, neck neutrality, and aggressive correction of the metabolic derangement itself — not hyperosmolar therapy. Mannitol creates an osmotic gradient that pulls fluid from the brain interstitium into the vasculature, which is the right mechanism for raised ICP from trauma or intracranial hemorrhage. Mia's concern is cerebral edema from DKA — a complication driven by osmolarity shifts during rehydration and insulin initiation, not by primary intracranial pathology. Mannitol in this setting may worsen outcomes by causing rebound edema as it crosses a disrupted blood-brain barrier and by raising serum osmolarity (already high from hyperglycemia), working against the goal of gradual osmolarity normalization. The actual protection here is controlled fluid rate (10–20 mL/kg over 30–60 min), deferring insulin until fluids are established, and close neuro checks — positioning and careful resuscitation sequencing, not medication.",
            "pri": 4,
            "ok": false
          }
        }
      }
    },
    {
      "phaseIndex": 2,
      "id": "assess2",
      "stageType": "assess",
      "round": 2,
      "title": "Neurological Deterioration",
      "narrative": "About 90 minutes into her DKA treatment, the nurse calls you back to the bedside. Mia was responding to the NS bolus and insulin drip — glucose had started trending down and she'd stopped vomiting — but now she's harder to rouse. She opened her eyes to her name a few minutes ago; now she only opens them to sternal rub. Her mom says Mia grabbed her head and said it hurt 'really bad' about 20 minutes ago, and since then she's gotten progressively less responsive. Heart rate has dropped from 128 to 58 over the last 15 minutes — a number that stops you cold in an 8-year-old who was tachycardic an hour ago. Blood pressure has crept up. The 18-gauge right antecubital IV remains patent. Breath sounds are still clear bilaterally; trachea is midline. There is no rash.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "58",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.hr.why",
          "why": "Mia's heart rate of 58 bpm is a red flag for intracranial hypertension in an 8-year-old whose normal range is 75–118 bpm — sudden bradycardia after initial appropriate tachycardic compensation signals a critically elevated ICP, not improvement. The Cushing triad (bradycardia, hypertension, irregular respirations) emerges when rising intracranial pressure compresses the brainstem and triggers a desperate baroreceptor reflex to maintain cerebral perfusion. Her progressive obtundation, severe headache 20 minutes ago, and now depressed respiratory drive (RR 10) complete the picture of herniation risk. The glucose is still 388 and ketones remain high — ongoing DKA-driven cerebral edema, likely worsened by overly rapid sodium correction or hypotonic fluids early in resuscitation. This bradycardia is not reassuring; it is the alarm bell. Head of bed 30°, emergent neurosurgery/PICU consult, osmotic therapy (3% hypertonic saline or mannitol), and preparation for intubation are now the priority."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "10",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.rr.why",
          "why": "A respiratory rate of 10 in an 8-year-old is critically low — normal is 18–25 — and signals severe central nervous system depression, not ongoing compensation for acidosis. Mia's Kussmaul breathing (the deep, effortful pattern she showed on arrival) was her body's attempt to blow off CO2 and correct pH; now that rate has collapsed, meaning her brainstem drive to breathe is failing.\n\n- **Cerebral edema from rapid serum osmolarity drop** suppresses the respiratory centers in the medulla; as brain swelling compresses vital structures, respiratory drive disappears before heart rate stabilizes, producing this paradoxical bradycardia-with-hypertension pattern.\n- **Loss of respiratory compensation** eliminates the mechanism keeping pH from plummeting further — as minute ventilation drops, pCO2 rises and acidosis worsens, deepening obtundation in a vicious cycle.\n\nThis is impending herniation. Call neurocritical care and neuroradiology stat; prepare for emergency intubation and osmotic therapy."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "138/74",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.bp.why",
          "why": "The BP of 138/74 is critically abnormal in an 8-year-old — it signals raised intracranial pressure, not compensatory hypertension. The age-appropriate target is roughly 100–110 systolic; this 138 paired with bradycardia and altered mental status is a textbook Cushing triad.\n\n- **Cerebral perfusion pressure depends on mean arterial pressure minus ICP.** When ICP rises acutely (cerebral edema from rapid osmolarity shift), the brain reflexively increases BP to maintain perfusion — this is a last-ditch autoregulatory response, not a reassuring finding.\n- **Bradycardia in shock signals decompensation; bradycardia with hypertension signals herniation.** Mia's HR drop from 128 to 58 with rising BP and declining consciousness reflects brainstem compression, not improved perfusion.\n\nStop the insulin drip immediately, place her head 30° up with neutral neck, get neurosurgery and anesthesia now, and prepare for emergent osmotic therapy — this is impending brain herniation from DKA-associated cerebral edema."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "94",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.spo2.why",
          "why": "SpO2 of 94% in an 8-year-old usually reads as reassuring, but here it signals something more sinister: Mia's respiratory drive is failing as her mental status collapses, and her oxygen saturation is drifting downward despite that weak respiratory effort.\n\n- **Cerebral edema from osmotic overshoot** is swelling the brain tissue, compressing the brainstem and silencing the respiratory centers that drive breathing; the slow, shallow respirations you're seeing are brainstem herniation physiology, not compensation.\n- **Hypoventilation in DKA with raised ICP** creates a deadly feedback loop — lower minute ventilation → CO2 retention → cerebral vasodilation → worsening edema → further respiratory depression.\n\nMia needs emergency head-of-bed elevation to 30°, neurosurgery notification, and consideration of intubation with controlled hyperventilation as a temporizing measure while preparing for definitive ICP management — her 94% will collapse to 80% within minutes if she continues decompensating."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.2",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.temp.why",
          "why": "Temperature at 37.2 °C looks reassuring on its face, but in Mia's context — acute mental status decline with bradycardia and rising ICP signs — it signals a critical problem: she may be developing cerebral edema with early brainstem herniation, and her temperature control is breaking down as a result. A normal or near-normal temp in a child whose intracranial pressure is rising fast is a red flag, not a comfort.\n\n- **Thermoregulation loss** occurs when increased ICP compresses the hypothalamus and midbrain; the inability to maintain temperature homeostasis indicates deep CNS compromise, not improvement.\n- **Bradycardia with rising ICP** (Cushing's triad: bradycardia, hypertension, irregular respirations) reflects herniation mechanics — the brainstem is being pushed downward, suppressing the vagus nerve's usual tachycardic response and triggering vagal dominance.\n\nThis is the moment to call for head CT, position her head of bed 30° with neck neutral, and prepare for emergency airway management and osmotic therapy."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[2].vitals.cap.why",
          "why": "Mia's capillary refill of 2 seconds is normal on the surface, but it's a deceptive reassurance in the context of her acute deterioration — she's in cerebral edema with raised intracranial pressure, not in shock, and peripheral perfusion can appear intact even as cerebral perfusion is failing.\n\n- **Capillary refill measures systemic perfusion pressure**, which depends on cardiac output and systemic vascular resistance; in DKA-related cerebral edema, both are intact or elevated (her BP is 138/74, her heart rate has paradoxically dropped to 58). The normal cap refill tells you she is not hypovolemic or cardiogenic shock, which is correct — her problem is intracranial, not systemic.\n\n- **Cerebral edema raises intracranial pressure** and compresses the brainstem, producing the triad you're seeing: altered mental status, bradycardia (vagal), and hypertension (Cushing reflex). Peripheral perfusion stays normal because the body is defending core pressure at the expense of cerebral circulation — a catastrophic trade.\n\nDo not reassure yourself with normal cap refill when the neurologic picture is screaming raised ICP; head of bed 30°, get neurology and ICU, and prepare for emergency osmotic therapy."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Opens eyes only to painful stimulus (sternal rub); no spontaneous speech; withdraws purposefully to pain but does not follow commands. GCS 7 (E2 V2 M5). Mom confirms this is a sharp decline from 30 minutes ago when Mia was still answering questions.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.mentalStatus.why",
          "why": "Mia's rapid decline from conversant to GCS 7 over 30 minutes signals **cerebral edema from osmotic shift** — the most immediately life-threatening complication of DKA treatment. Her glucose is still high at 388 mg/dL, but her corrected sodium is normal, meaning serum osmolarity has dropped faster than brain osmolarity can follow. Free water moved intracellularly; brain volume increased; intracranial pressure rose. The headache she reported 20 minutes ago was the sentinel — increased ICP announcing itself before altered mental status appeared.\n\n- **Rapid serum osmolarity drop during insulin therapy** occurs when insulin shutoff ketogenesis and fluids dilute plasma faster than brain interstitium equilibrates, creating an osmotic gradient that pulls water into brain cells.\n- **Bradycardia and rising BP despite improved shock markers** are late Cushing triad findings — the brainstem responding to increased ICP by raising perfusion pressure and dropping heart rate reflexively.\n\nThis is a **neurologic emergency.** Stop hypotonic fluids immediately, elevate head of bed 30°, prepare for mannitol or 3% hypertonic saline bolus, and call neurocritical care — cerebral edema in DKA carries mortality and permanent disability if not reversed within the hour."
        },
        {
          "id": "pupils",
          "label": "Pupils",
          "finding": "Right pupil 5 mm and sluggishly reactive to light; left pupil 3 mm and briskly reactive. Asymmetric and concerning.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.pupils.why",
          "why": "Asymmetric pupils in a child with acute altered mental status and raised intracranial pressure is a red flag for uncal herniation — the right pupil's dilation and sluggish reactivity mean the oculomotor nerve is being compressed by downward brain shift on that side. This is not a slowly-evolving finding; it represents active, life-threatening ICP elevation happening right now.\n\n- **Uncal herniation mechanism** compresses CN III as the medial temporal lobe herniates through the tentorial notch, paralyzing the pupillary sphincter muscle and rendering that eye fixed and dilated while the contralateral pupil stays small and reactive.\n- **Cerebral edema in DKA** develops over minutes to hours during treatment, driven by rapid osmolarity drop when glucose falls and insulin drives glucose intracellularly faster than serum osmolarity can normalize, drawing free water into brain parenchyma.\n\nThis is the moment to call for emergency interventions: head of bed 30°, neck neutral, prepare for possible intubation and osmotic therapy (3% hypertonic saline or mannitol) to buy time for neurosurgical consultation."
        },
        {
          "id": "breathing",
          "label": "Respiratory Pattern",
          "finding": "Respiratory rate has slowed markedly to 10 with shallow, irregular effort. The deep Kussmaul respirations seen earlier are gone. Breath sounds remain clear bilaterally; trachea midline.",
          "pos": "chest",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.breathing.why",
          "why": "Mia's shift from Kussmaul respirations to shallow, slow, irregular breathing is a red flag for cerebral edema — her brain swelling is impairing the respiratory centers that drive her breathing. Early in DKA, deep rapid breathing was her body's compensatory mechanism to blow off CO2 and buffer the metabolic acidosis; now that drive has vanished because intracranial pressure is compressing the brainstem. The loss of respiratory effort paired with her acute decline in mental status, severe headache, bradycardia, and hypertension creates a classic tetrad of herniation. Her respiratory depression is not improvement — it's a sign that her airway reflexes are deteriorating and respiratory arrest is imminent. This is a neurosurgical emergency requiring immediate hyperventilation to transiently lower ICP, head-of-bed elevation, osmotic therapy, and ICU-level airway management. Do not delay intubation if she continues to decline.\n\n- **Brainstem compression** from cerebral edema suppresses the respiratory centers and erases the drive to hyperventilate, even though her underlying acidosis remains uncorrected (pH still 7.18).\n- **Paradoxical worsening during treatment** is the hallmark of DKA cerebral edema; it occurs as insulin lowers serum osmolarity faster than the brain can equilibrate, drawing free water intracellularly."
        },
        {
          "id": "motorResponse",
          "label": "Motor Response",
          "finding": "Withdraws both upper extremities to noxious stimuli. No posturing observed at rest. Lower extremity tone slightly increased bilaterally.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.motorResponse.why",
          "why": "The withdrawal response with subtle lower-extremity hypertonicity in a child who was alert 20 minutes ago signals **cerebral edema from osmotic shifts** — not primary brain injury. Mia's glucose has been dropping, osmolarity falling sharply as fluids and insulin work. Water follows osmoles into the intracellular space, swelling neurons and raising intracranial pressure. The bradycardia (58 in an 8-year-old), hypertension, and decreased responsiveness form **Cushing's triad**, the bedside signature of raised ICP. Motor withdrawal is intact (not flaccid), which means brainstem reflexes are preserved — she's not herniated yet, but trajectory matters acutely.\n\n- **Osmotic crisis in DKA** occurs when serum osmolarity drops too fast relative to CSF osmolarity; the CSF lags behind and fluid shifts in, raising ICP.\n- **Raised ICP suppresses the reticular activating system**, lowering consciousness before it triggers seizures or brainstem dysfunction — catching it now at decreased responsiveness is the critical window.\n\nElevate head of bed 30°, ensure normocapnia (current RR 10 is **too slow** — she needs RR support to prevent CO2 retention, not restriction), and prepare 3% hypertonic saline 3–5 mL/kg IV push to arrest the osmotic gradient."
        },
        {
          "id": "hydration",
          "label": "Hydration Status",
          "finding": "Mucous membranes slightly moist compared to arrival — early improvement from fluids — but skin turgor still reduced. No peripheral edema.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.hydration.why",
          "why": "Hydration status is improving on fluids, but this is now a secondary concern — Mia's acute change in mental status and bradycardia at 58 bpm are signs of cerebral edema from DKA, not dehydration, and fluid resuscitation is the wrong next move.\n\n- **Cerebral edema in DKA** occurs when serum osmolarity drops too rapidly during treatment, pulling free water into brain cells along the osmotic gradient; the falling glucose (now 388 from an opening level likely >600) and rising corrected sodium (142 after initial hyponatremia from hyperglycemia) indicate osmolarity is collapsing faster than the brain can compensate.\n- **Bradycardia and hypertension with altered mental status** are the classic triad of raised intracranial pressure — the vagal response to herniation, not compensatory tachycardia — and demand immediate ICP management (head of bed 30°, neck neutral, osmotic therapy, consider intubation) rather than more fluid.\n\nStop the current IV rate, obtain urgent neuroimaging, and prepare for ICU-level interventions including mannitol or 3% hypertonic saline bolus."
        },
        {
          "id": "skin",
          "label": "Skin",
          "finding": "Warm and dry. No rash, petechiae, or urticaria. Perfusion appears improved at the periphery compared to arrival.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[2].signs.skin.why",
          "why": "Mia's warm, dry skin with improved peripheral perfusion signals recovery from hypovolemic shock — her volume depletion is being corrected. However, in the context of her acute deterioration over the last 20 minutes (bradycardia, altered mental status, headache), the reassuring skin exam can mask a life-threatening process unfolding in her head.\n\n- **Peripheral perfusion lags CNS perfusion changes.** Skin warmth and cap refill reflect systemic restoration of blood flow, but they do not tell you what is happening intracranially; cerebral edema can progress while the periphery looks pink.\n- **Absence of petechiae or rash excludes infection as the cause of her decline.** The combination of warm skin, normal temperature, and no signs of sepsis means her sudden bradycardia and mental status change are not from new infection — they fit cerebral edema from DKA treatment (osmotic shift as glucose and serum osmolarity drop rapidly), which requires immediate ICP management and possible osmotic therapy or intubation.\n\nReassuring skin findings do not rule out raised intracranial pressure; the real alarm is the triad of altered mental status + headache + bradycardia in a child mid-DKA resuscitation."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "388",
          "unit": "mg/dL",
          "ref": "70-140",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.glucose.why",
          "why": "Glucose at 388 mg/dL is paradoxically high during what should be the recovery phase — Mia is worsening neurologically while her glucose remains elevated, signaling that insulin resistance has spiked acutely rather than DKA improving as expected.\n\n- **Cerebral edema from DKA** causes sudden neurological deterioration, altered mental status, bradycardia, and hypertension; it occurs hours into treatment when osmotic shifts outpace the brain's ability to compensate, not during the acute ketotic phase.\n- **Persistently elevated glucose despite insulin infusion** combined with dropping potassium (now 3.4) and progressive unresponsiveness points to either inadequate insulin delivery or acute metabolic decompensation overlaying her DKA — both are red flags requiring immediate intervention assessment and likely ICU escalation.\n\nStop the insulin drip, secure the airway, check IV patency, and prepare for transfer to PICU; persistent hyperglycemia with altered mental status in DKA is a neurological emergency, not a metabolic management failure."
        },
        {
          "id": "pH",
          "name": "pH",
          "value": "7.18",
          "unit": "",
          "ref": "7.35-7.45",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[2].labs.pH.why",
          "why": "A pH of 7.18 signals severe acidemia that was manageable an hour ago but now coincides with acute neurologic deterioration — this is the lab signature of cerebral edema from DKA, not simple metabolic acidosis anymore. In DKA, the acidosis itself (from ketones) was already present and being corrected by fluids and insulin; the sudden drop in responsiveness with a persistently low pH, combined with bradycardia and hypertension, points to osmotic shift of fluid into the brain rather than worsening ketoacidosis. The corrected sodium is still normal and glucose is still elevated, meaning serum osmolarity has fallen too fast as fluids diluted out electrolytes and ketones — the osmotic gradient pulls water intracellularly, raising intracranial pressure. Stop hypotonic fluids immediately, switch to isotonic or hypertonic saline, elevate the head of bed 30°, and prepare for mannitol or 3% hypertonic saline bolus if herniation signs (blown pupil, posturing, apnea) emerge.\n\n- **Cerebral edema risk in DKA peaks during early treatment**, not at presentation — paradoxically, the corrected acidosis and falling glucose create the osmotic gradient that pulls fluid into cells faster than it leaves the cranium.\n- **Serum osmolarity drop outpaces brain osmolarity adjustment**, so the brain swells even as the serum becomes relatively hyperosmolar; a pH improving toward normal while mental status worsens is the clinical red flag, not the pH alone.\n\nReassess pupils and motor response every 5 minutes; any sign of uncal herniation (unilateral blown pupil, decorticate/decerebrate posturing, apnea) demands emergent osmotic therapy and airway preparation."
        },
        {
          "id": "pCO2",
          "name": "pCO2",
          "value": "24",
          "unit": "mmHg",
          "ref": "35-45",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.pCO2.why",
          "why": "Mia's pCO2 of 24 mmHg is abnormally low — but this value itself is not the problem; the *pattern* it reveals is the emergency. A pCO2 of 24 in DKA means her respiratory system is still compensating hard for acidosis (she's blowing off CO2 to raise pH), yet her mental status is crashing and her heart rate has plummeted. This mismatch — preserved respiratory drive paired with sudden neurologic deterioration — is the red flag for cerebral edema.\n\n- **Osmotic gradient shift during insulin therapy** drives free water intracellularly as glucose concentration and serum osmolarity fall faster than brain osmolarity can follow, expanding brain cells and raising intracranial pressure.\n- **Bradycardia with rising blood pressure and altered mental status** is Cushing's triad—the late sign of herniation—not improvement; a dropping pCO2 without mental status recovery should have prompted intervention already.\n\nHer head pain 20 minutes ago was the warning. Stop insulin temporarily, notify neurocritical care, and prepare for emergency ICP management (head of bed 30°, hypertonic saline, hyperventilation only if actively herniating)."
        },
        {
          "id": "hco3",
          "name": "HCO3",
          "value": "9",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[2].labs.hco3.why",
          "why": "The HCO3 of 9 mEq/L is profoundly low and signals severe metabolic acidosis — but the real story here is that Mia's acidosis is resolving faster than her osmolarity, and that mismatch is driving cerebral edema.\n\n- **Rapid serum osmolarity drop during DKA treatment** occurs because insulin and fluids clear glucose and ketones from serum faster than they clear from the intracellular space; free water shifts inward along the osmotic gradient, and Mia's corrected sodium (142, normal) masked the true osmotic burden until cerebral swelling raised her ICP.\n- **pH 7.18 with HCO3 9 and pCO2 24** shows that her respiratory compensation is intact — she's blowing off CO2 appropriately — but the acidosis is severe enough that she cannot fully correct it by breathing alone; the gap between where her pCO2 is and where it should be (roughly 1.5 × 9 + 8 ≈ 21.5) is narrow, meaning there is no additional respiratory or metabolic process layered on top.\n\nThe sudden bradycardia, headache, and altered mental status 90 minutes into treatment are the red flags: cerebral edema from overly rapid osmolar correction, not from uncorrected acidosis. This is why DKA resuscitation uses 10–20 mL/kg isotonic fluid over 30–60 minutes and insulin infusion (never bolus) — slow, steady osmolar correction prevents this complication."
        },
        {
          "id": "sodium",
          "name": "Sodium",
          "value": "136",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.sodium.why",
          "why": "The sodium of 136 mEq/L looks normal at face value, but in DKA this is actually a **corrected** sodium — the true serum osmolarity is suppressed by hyperglycemia, and the measured sodium is falsely low. Corrected sodium of 142 mEq/L reveals the real picture: Mia is **hypernatremic from dehydration**, not eunatremic. In the setting of acute mental status decline with falling heart rate and rising blood pressure during insulin infusion, this corrected hypernatremia is the red flag for cerebral edema — free water is shifting intracellularly down the osmotic gradient created by the rapid drop in serum glucose and ketones, while the intracellular space becomes hyperosmolar relative to plasma. The measured sodium stays deceptively normal because glucose correction masks the true solute burden.\n\n- **Corrected sodium in hyperglycemia** reflects true tonicity; a measured sodium of 136 with glucose of 388 means the patient is actually hypertonic, pulling fluid into cells.\n- **Rapid osmolarity decline during insulin therapy** drives cerebral edema when glucose falls faster than ketone clearance and brain adapts; slower glucose correction and hypotonic fluids post-resuscitation reduce this risk.\n\nStop and reassess: Mia's headache, declining consciousness, bradycardia, and hypertension are cerebral edema until proven otherwise — call neurology and ICU now."
        },
        {
          "id": "potassium",
          "name": "Potassium",
          "value": "3.4",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.potassium.why",
          "why": "Mia's potassium of 3.4 mEq/L is critically low in the context of her acute mental status change and bradycardia — this is a medical emergency masquerading as a lab value. Hypokalemia causes cardiac arrhythmias and altered cellular excitability, and her symptomatic bradycardia and neurologic deterioration suggest potassium is playing a direct role in her decompensation right now.\n\n- **Insulin drives potassium intracellularly** by activating Na-K-ATPase; as her insulin drip corrects ketoacidosis and glucose falls, serum K+ plummets despite total-body potassium depletion from DKA. She presented DKA-depleted and the insulin bolus you wisely gave has now exposed that deficit.\n- **Hypokalemia lowers resting membrane potential**, making cardiac myocytes and neurons hyperexcitable or paradoxically refractory; this produces both the bradycardia (ectopic suppression, conduction block) and the altered mental status (seizure threshold lowering, encephalopathy) she's showing now.\n\nStop the insulin infusion immediately and give IV potassium to restore serum K+ — do not resume insulin until K+ is above 3.5 mEq/L. Her altered mental status is not cerebral edema alone; hypokalemia is an active threat to her cardiac rhythm."
        },
        {
          "id": "glucose_repeat",
          "name": "Corrected Sodium",
          "value": "142",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.glucose_repeat.why",
          "why": "The corrected sodium of 142 mEq/L tells you Mia's hyponatremia is pseudohyponatremia — an artifact of her hyperglycemia, not true total-body sodium depletion. The measured sodium drops because glucose pulls free water into the intravascular space; correcting for the osmotic shift (adding ~2.4 mEq/L for every 100 mg/dL above 100) reveals her actual sodium is normal. This matters acutely: aggressive free-water infusion to correct pseudohyponatremia risks massive overcorrection and worsens cerebral edema—the very complication she's now showing signs of (acute mental status drop, bradycardia, hypertension, headache). The corrected value normalizes as her glucose falls with insulin; chasing the measured sodium downward would be treating the hyperglycemia's reflection, not the underlying problem.\n\n- **Osmotic gradient shifts water extracellularly** when glucose soars above renal threshold; serum sodium falls dilutionally without any sodium loss occurring.\n- **Overcorrection of pseudohyponatremia drives intracellular free-water accumulation** once insulin lowers glucose osmolarity, overwhelming the brain's ability to autoregulate and triggering edema.\n\nDo not add hypotonic fluids. Watch her mental status and neurologic signs closely — they're your leading indicator of edema progression."
        },
        {
          "id": "betahydroxybutyrate",
          "name": "Beta-Hydroxybutyrate",
          "value": "4.2",
          "unit": "mmol/L",
          "ref": "< 0.6",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.betahydroxybutyrate.why",
          "why": "Beta-hydroxybutyrate at 4.2 mmol/L (normal <0.6) confirms severe ketoacidosis is still the dominant pathology driving Mia's acidemia, even 90 minutes into treatment—and this matters because her acute neurologic decline is not from ketoacidosis itself, it's from cerebral edema triggered by the speed of osmolarity correction.\n\n- **Ketone production persists when insulin has not yet fully suppressed lipolysis** at the tissue level; although the glucose is trending down and vomiting has stopped, the ketone load takes longer to clear than glucose does, and a beta-hydroxybutyrate this high signals ongoing ketogenesis.\n- **Cerebral edema in DKA arises from free-water shifts into brain cells as serum osmolarity drops faster than intracellular osmolarity can equilibrate**, not from the ketoacidosis itself; Mia's declining mental status, headache, bradycardia, and rising BP are classic signs of increased intracranial pressure, which develops as a paradoxical consequence of successful fluid and insulin therapy if the correction rate is too aggressive.\n\nSlow the insulin infusion, reduce free-water intake, notify neurocritical care, and prepare for possible mannitol or hypertonic saline if herniation signs appear."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "13.1",
          "unit": "× 10³/µL",
          "ref": "5-15",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.wbc.why",
          "why": "The WBC of 13.1 is reassuringly normal — stress leukocytosis from DKA and acute illness, not infection, explains the mild elevation. This matters because it helps you avoid the distraction of treating presumed sepsis in a child whose real crisis is cerebral edema from DKA overcorrection, not infection.\n\n- **Stress leukocytosis** is the expected response to severe metabolic derangement, pain, and catecholamine surge; it does not indicate bacterial infection and does not warrant antibiotics in straightforward DKA.\n- **Bandemia and left shift** are the leukocyte markers that signal acute bacterial infection; this WBC count lacks those findings, and the clinical picture (no fever, no source) argues against infection as the driver.\n\nA normal WBC count in a critically ill child is a permission slip to focus on the actual pathology — in Mia's case, the rapid mental status decline and bradycardia after euglycemia is reached point to cerebral edema, not sepsis."
        },
        {
          "id": "creatinine",
          "name": "Creatinine",
          "value": "0.6",
          "unit": "mg/dL",
          "ref": "0.3-0.7",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[2].labs.creatinine.why",
          "why": "Mia's creatinine of 0.6 mg/dL is reassuringly normal, but in the context of her acute presentation it tells you something important: her kidneys are still filtering despite severe dehydration and acidosis. A normal creatinine in a volume-depleted child means she hasn't crossed into acute kidney injury—yet. In DKA, creatinine can rise acutely from dehydration alone (prerenal mechanism) or remain normal if she's caught early enough. Her normal value here is actually a favorable sign that aggressive fluid resuscitation and insulin therapy have a better chance of reversing the metabolic derangement without compounding renal injury. That said, keep trending it—creatinine lags behind true glomerular filtration rate in acute illness, so a \"normal\" value doesn't guarantee the kidneys are handling the current acid load well, especially if her mental status decline reflects cerebral edema from osmotic shifts during treatment.\n\n- **Prerenal azotemia** from hypovolemia would show creatinine rise before true renal damage; a normal value means perfusion reserve remains.\n- **Ketoacid clearance** depends on adequate renal perfusion and urine output; normal creatinine supports continued filtration of ketones and hydrogen ions rather than accumulation."
        }
      ],
      "actions": {
        "tools": {},
        "meds": {}
      }
    },
    {
      "phaseIndex": 3,
      "id": "intervene2",
      "stageType": "intervene",
      "round": 2,
      "title": "Cerebral Edema — Escalation",
      "narrative": "This is DKA-associated cerebral edema until proven otherwise. The clinical triad is right in front of you: deteriorating mental status despite improving glucose and metabolic parameters, a new severe headache, and now bradycardia with hypertension — Cushing's triad. The right pupil is dilating. Her respiratory drive is dropping and she's heading toward herniation if you don't act in the next few minutes. Do not wait for imaging before treating. The existing 18-gauge right antecubital IV is patent. Airway protection is imminent — she can't protect it much longer with a GCS of 7. Your two moves are hyperosmolar therapy right now and securing the airway before she loses it completely.",
      "vitals": [
        {
          "id": "hr",
          "label": "Heart Rate",
          "value": "58",
          "unit": "bpm",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.hr.why",
          "why": "Bradycardia of 58 bpm in an 8-year-old is a red flag for raised intracranial pressure — Cushing's triad (bradycardia, hypertension, altered respirations) signals impending herniation. Combined with her dilating right pupil and dropping respiratory drive, this is cerebral edema from DKA until proven otherwise, not improving shock.\n\n- **Cushing's triad emerges when ICP exceeds cerebral perfusion pressure**, forcing the brainstem to trigger vagal bradycardia and sympathetic hypertension as a last-ditch effort to restore cerebral blood flow; it marks the transition from compensated to decompensated brain herniation.\n- **Hyperosmolar therapy and airway protection are urgent** — 3% hypertonic saline 5 mL/kg IV now (125 mL for Mia) and prepare for intubation within minutes, because bradycardia with a dilating pupil means her brainstem is already being compressed.\n\nDo not delay imaging or osmolarity checks; clinical signs of herniation override any lab confirmation."
        },
        {
          "id": "rr",
          "label": "Resp Rate",
          "value": "10",
          "unit": "br/min",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.rr.why",
          "why": "Mia's respiratory rate of 10 is profoundly abnormal — a normal 8-year-old breathes 18–25 times per minute, and this rate signals her brainstem is failing. Early in DKA, deep rapid breathing (Kussmaul respirations) blows off CO2 to compensate for metabolic acidosis; that compensatory drive is now gone, replaced by respiratory depression from raised intracranial pressure compressing her medulla. The combination of bradycardia (58), hypertension (138/74), and now slowing respiration is Cushing's triad — herniation in real time.\n\n- **Brainstem compression from cerebral edema** silences the respiratory centers that normally drive minute ventilation, flipping the picture from compensatory hyperventilation to life-threatening hypoventilation.\n- **Rising pCO2 from apnea worsens acidosis and intracranial pressure in a vicious cycle**, accelerating herniation unless you secure the airway and mechanically ventilate now.\n\nIntubate immediately — do not delay for imaging or further assessment."
        },
        {
          "id": "bp",
          "label": "Blood Pressure",
          "value": "138/74",
          "unit": "mmHg",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.bp.why",
          "why": "Mia's blood pressure of 138/74 mmHg is elevated for an 8-year-old and part of Cushing's triad — the constellation of hypertension, bradycardia, and blown pupil that signals increased intracranial pressure and impending herniation. This is not sepsis or hypovolemia; her perfusion picture (warm skin, cap refill 2 sec, weak but present peripherals) is reassuring. The hypertension is a late-stage emergency sign, not compensation.\n\n- **Increased ICP** from cerebral edema compresses the brainstem, triggering sympathetic discharge that drives both the hypertension and the reflex bradycardia — the body's failed attempt to protect cerebral perfusion.\n- **Herniation cascade** produces this triad minutes before loss of brainstem reflexes; the combination of deteriorating GCS, headache, and now Cushing's triad means you are treating active cerebral edema, not preventing it.\n\nHyperosmolar therapy (3% hypertonic saline or mannitol) must go in now through the patent IV, followed immediately by airway protection before her respiratory drive disappears entirely."
        },
        {
          "id": "spo2",
          "label": "SpO2",
          "value": "94",
          "unit": "%",
          "bad": true,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.spo2.why",
          "why": "SpO2 of 94% looks deceptively reassuring in isolation, but in the context of dropping respiratory drive and impending herniation, it signals that hypoventilation is already limiting oxygen delivery — the next few breaths may drop it further and fast.\n\n- **Hypoventilation in raised ICP** depresses minute ventilation as brainstem pressure rises, reducing the amount of fresh gas reaching the alveoli each breath; SpO2 stays borderline only until CO2 retention worsens and triggers respiratory arrest.\n- **Cushing's triad with bradypnea** (RR 10, HR 58, BP 138/74) is active herniation — the respiratory depression is not compensation but brainstem failure, and oxygenation will decompensate within minutes if airway protection is not secured.\n\nDo not reassure yourself with the 94%; prepare for rapid desaturation during induction and have your backup plan ready."
        },
        {
          "id": "temp",
          "label": "Temperature",
          "value": "37.2",
          "unit": "°C",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.temp.why",
          "why": "Temperature of 37.2 °C is normal, and that's precisely the point — in a critically ill child with DKA and now cerebral edema, you want normothermia preserved. Fever would worsen cerebral edema by raising metabolic rate and increasing intracranial pressure; hypothermia would blunt her already-depressed respiratory drive. The normal temperature buys you time.\n\n- **Normothermia reduces ICP burden** because metabolic demand and cerebral blood flow track with temperature, and fever-driven hyperemia worsens edema in an already swollen brain.\n- **Temperature management is a first-line ICP control tool** alongside head-of-bed positioning and sedation — keep her normothermic during transport to the ICU and intubation.\n\nHer herniation risk is the bradycardia, hypertension, and dilating pupil; the normal temperature means one fewer pressure escalator in play."
        },
        {
          "id": "cap",
          "label": "Cap Refill",
          "value": "2 sec",
          "unit": "",
          "bad": false,
          "cat": "vital",
          "_slotRef": "phase[3].vitals.cap.why",
          "why": "Cap refill of 2 seconds reads as reassuring on the surface, but in the context of Cushing's triad and impending herniation, it's a red herring masking the real problem. Capillary refill reflects peripheral perfusion — and Mia's periphery is still perfusing because her blood pressure is critically elevated from increased intracranial pressure, not because her shock state has resolved. She's not in hypovolemic shock anymore; she's in ICP crisis.\n\n- **Cushing's triad** (bradycardia, hypertension, respiratory depression) indicates brainstem compression from herniation, not circulatory recovery — the hypertension is a compensatory response to raised ICP, not a sign of adequate perfusion.\n- **Normal cap refill with dilating pupil and GCS of 7** means do not fixate on perfusion metrics; airway protection and hyperosmolar therapy take priority over the reassurance the peripheral exam offers.\n\nThe cap refill will matter again after you've lowered ICP and secured her airway — but right now it's a distraction from the neurologic emergency."
        }
      ],
      "signs": [
        {
          "id": "mentalStatus",
          "label": "Mental Status",
          "finding": "Opens eyes only to painful stimulus (sternal rub); no spontaneous speech; withdraws purposefully to pain but does not follow commands. GCS 7 (E2 V2 M5). Mom confirms this is a sharp decline from 30 minutes ago when Mia was still answering questions.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.mentalStatus.why",
          "why": "Mia's GCS of 7 with acute decline over 30 minutes signals cerebral edema from osmotic stress, not from the DKA itself — her glucose and pH are improving on fluids and insulin, yet her brain is swelling. This is the classic DKA-CE presentation: metabolic parameters moving in the right direction while neurologic status crashes.\n\n- **Cerebral edema in DKA** occurs when rapid osmolarity correction (especially aggressive hypotonic fluid) lowers serum osmolarity faster than the blood-brain barrier can equilibrate, drawing free water into brain parenchyma and raising intracranial pressure toward herniation.\n- **Cushing's triad** — bradycardia (58 bpm in an 8-year-old is deeply abnormal), hypertension (138/74 is high for her age), and declining respiratory drive (10 breaths/min in an 8-year-old is severely depressed) — confirms raised ICP at the brainstem level and marks imminent herniation.\n\nAirway protection and 3% hypertonic saline (5 mL/kg = 125 mL bolus IV over 10–20 minutes) are the only interventions that reverse this trajectory; do not delay for imaging."
        },
        {
          "id": "pupils",
          "label": "Pupils",
          "finding": "Right pupil 5 mm and sluggishly reactive to light; left pupil 3 mm and briskly reactive. Asymmetric and concerning.",
          "pos": "bilateral",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.pupils.why",
          "why": "Asymmetric pupils with the right side dilated and sluggish are a red flag for uncal herniation — the right temporal lobe is herniating through the tentorial notch and compressing the ipsilateral oculomotor nerve. This is happening *right now* in the context of DKA-associated cerebral edema, and you have minutes, not hours, to reverse the intracranial pressure before brain stem compression becomes irreversible.\n\n- **Uncal herniation** compresses CN III as it passes through the tentorial opening, paralyzing the pupillary sphincter muscle and producing a dilated, fixed pupil on the side of the expanding mass or edema.\n- **Raised ICP from cerebral edema** in DKA shifts brain tissue downward; the uncus (medial temporal lobe) wedges into the tentorial notch, pulling CN III and causing ipsilateral pupil dilation before contralateral pupils follow.\n\nHyperosmolar therapy (3% hypertonic saline or mannitol) must go in immediately through that patent IV; airway protection must follow within minutes because her respiratory rate of 10 and GCS of 7 mean she's already failing to protect it."
        },
        {
          "id": "breathing",
          "label": "Respiratory Pattern",
          "finding": "Respiratory rate slowed to 10 with shallow, irregular effort. Deep Kussmaul respirations from earlier are absent. Breath sounds clear bilaterally; trachea midline.",
          "pos": "chest",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.breathing.why",
          "why": "Mia's respiratory drive is collapsing because rising intracranial pressure is suppressing her brainstem — this is herniation beginning, not metabolic compensation improving. Her Kussmaul respirations (the deep, effortful breathing that blew off CO2 to buffer her acidosis) have vanished and been replaced by slow, shallow, irregular effort. That's the opposite trajectory and the most ominous single finding on the bed.\n\n- **Brainstem compression** from uncal herniation silences the respiratory centers that drive minute ventilation; the switch from Kussmaul to apnea is the signature of herniation progression, not recovery.\n- **Loss of compensatory drive** combined with her Cushing's triad (bradycardia 58, hypertension 138/74, and the dilating right pupil) confirms her ICP is at critical threshold and her airway is seconds away from requiring intervention by you.\n\nSecure the airway now before she stops breathing altogether — do not wait for imaging or transfer."
        },
        {
          "id": "motorResponse",
          "label": "Motor Response",
          "finding": "Withdraws both upper extremities to noxious stimuli. No posturing observed at rest. Lower extremity tone slightly increased bilaterally.",
          "bad": true,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.motorResponse.why",
          "why": "Mia's withdrawal to pain without posturing signals brainstem compression from uncal herniation — her cerebral edema is mechanically pushing the temporal lobe down through the tentorial opening. Withdrawal (purposeful response to noxious input) sits partway down the scale of deterioration: better than decerebrate or decorticate posturing, but worse than following commands and a sign that intracranial pressure has breached the point where motor tracts are being compressed. The slightly increased bilateral lower-extremity tone reflects early rigid extension from midbrain involvement, the precursor to full decerebrate posturing.\n\n- **Herniation progression** moves from depressed consciousness → asymmetric pupils (right pupil dilating) → brainstem reflexes weakening → loss of spontaneous respirations → cardiac collapse within minutes of this sign appearing.\n- **Hyperosmolar therapy reverses edema** by osmotic gradient across the blood-brain barrier, shrinking brain volume and reducing pressure on the midbrain; 3% hypertonic saline or mannitol given emergently can halt this cascade if given before complete brainstem failure.\n\nAirway is now the immediate second priority — her respiratory drive is already failing and once posturing becomes bilateral or fixed, apnea follows within seconds."
        },
        {
          "id": "hydration",
          "label": "Hydration Status",
          "finding": "Mucous membranes slightly moist compared to arrival — early improvement from fluids — but skin turgor still reduced. No peripheral edema.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.hydration.why",
          "why": "Mia's hydration is beginning to respond to fluids, but she's nowhere near replete — and this is the moment that complicates DKA management most. She arrived profoundly volume-depleted from osmotic diuresis (glucose pulling water into the urine); fluids are correcting that. But aggressive or rapid fluid replacement in the setting of cerebral edema risk is exactly what worsens it. **Free water shift into the brain** occurs when serum osmolarity drops too fast, and her corrected sodium of 142 mEq/L (borderline high, reflecting the dehydration state) will drop further as you hydrate — the osmotic gradient reverses. The reduced skin turgor and still-dry mucous membranes mean she needs continued fluid, but the next boluses must be isotonic and slow. Do not chase normal hydration markers in the first 24 hours of DKA with cerebral edema; prioritize osmotic stability over volume repletion."
        },
        {
          "id": "skin",
          "label": "Skin",
          "finding": "Warm and dry. No rash, petechiae, or urticaria. Perfusion improved at periphery compared to arrival.",
          "bad": false,
          "cat": "clinical",
          "_slotRef": "phase[3].signs.skin.why",
          "why": "Warm, dry skin with improved peripheral perfusion signals that Mia's volume status has been restored by initial resuscitation — her shock state is no longer compensated by vasoconstriction. This is reassuring for perfusion but does not mean she is safe: cerebral edema operates on a different clock than hypovolemia, and improved skin findings can coexist with life-threatening raised intracranial pressure. The absence of petechiae or urticaria rules out meningococcemia and anaphylaxis, which would demand different emergent interventions than the cerebral edema now driving her deterioration. Watch the skin as a trailing indicator of overall perfusion during hyperosmolar therapy — it should stay warm — but anchor your immediate decision-making to her neurologic findings (dilating pupil, bradycardia, respiratory depression) and airway status, not to peripheral perfusion alone."
        }
      ],
      "labs": [
        {
          "id": "glucose",
          "name": "Glucose",
          "value": "388",
          "unit": "mg/dL",
          "ref": "70-140",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.glucose.why",
          "why": "A glucose of 388 mg/dL in DKA tells you insulin deficiency is driving ketone production, but it does NOT tell you her mental status is improving — and that's the trap right now. Glucose drops faster than ketones clear or acidosis resolves; a falling glucose alone can mislead you into thinking she's recovering when she's actually deteriorating from cerebral edema.\n\n- **Glucose lag in DKA** means serum glucose falls within hours of fluids and insulin, but beta-hydroxybutyrate (4.2 mmol/L here, still markedly elevated) and acidosis (pH 7.18, HCO3 9) take 12–24 hours to fully resolve — the ketoacid burden is still high.\n- **Hyperosmolar therapy targets osmolarity, not glucose** — her corrected sodium is normal, but the high glucose itself draws fluid intracellularly, worsening cerebral edema as glucose drops without matching osmolarity correction through hypertonic saline.\n\nThe bradycardia, dilating pupil, and dropping respiratory drive are signs of herniation now, not recovery. Do not be reassured by the glucose number."
        },
        {
          "id": "pH",
          "name": "pH",
          "value": "7.18",
          "unit": "",
          "ref": "7.35-7.45",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[3].labs.pH.why",
          "why": "A pH of 7.18 in DKA signals severe metabolic acidosis, but in this moment the acidosis is not your immediate threat — cerebral edema is. The pH tells you how deeply into ketoacidosis Mia has gone, and it validates that insulin and fluids have not yet reversed the ketone production driving her illness.\n\n- **Metabolic acidosis in DKA arises from ketoacid accumulation** when insulin deficiency blocks glucose uptake and triggers lipolysis; the beta-hydroxybutyrate of 4.2 mmol/L confirms ketones are still being produced at a dangerous rate.\n- **Cerebral edema risk peaks during the recovery phase**, not at presentation — as glucose falls and osmolarity shifts, free water moves intracellularly and brain volume expands; the bradycardia, hypertension, and unequal pupils signal this is happening now, regardless of how low the pH reads.\n\nHyperosmolar therapy (3% hypertonic saline or mannitol) buys time by shrinking brain edema; intubation protects the airway as her respiratory drive collapses from increased intracranial pressure."
        },
        {
          "id": "pCO2",
          "name": "pCO2",
          "value": "24",
          "unit": "mmHg",
          "ref": "35-45",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.pCO2.why",
          "why": "Mia's pCO2 of 24 mmHg is lower than it should be — a sign that her respiratory system is working hard to blow off CO2 and compensate for her metabolic acidosis. In DKA, this compensation is protective early on, but now it's become a warning that her respiratory drive is failing. Her RR of 10 is dangerously slow for a child in metabolic acidosis; normally her body would be breathing deeper and faster (Kussmaul respirations) to keep pCO2 low. The drop in respiratory effort signals rising ICP is suppressing her breathing center — the brain swelling is winning the race against compensation. A pCO2 that stops falling, or begins to rise, in the face of ongoing acidosis is a red flag for impending respiratory arrest and herniation. Her airway needs to be secured now, before CO2 traps and pH crashes further.\n\n- **Respiratory compensation** in DKA uses increased minute ventilation to eliminate CO2 and lower pCO2, offsetting the HCO3 deficit and keeping pH from falling more steeply than it would otherwise.\n- **Cushing's triad suppressing respiratory drive** — the dilating pupil and bradycardia tell you ICP is high enough to compress the brainstem, and that compression is now silencing the very hyperventilation that was keeping her alive."
        },
        {
          "id": "hco3",
          "name": "HCO3",
          "value": "9",
          "unit": "mEq/L",
          "ref": "20-26",
          "bad": true,
          "critical": true,
          "cat": "lab",
          "_slotRef": "phase[3].labs.hco3.why",
          "why": "Mia's bicarbonate of 9 mEq/L signals severe metabolic acidosis from ketoacid accumulation — this value alone doesn't tell you if she's compensating well or failing, but paired with her respiratory pattern and mental status, it tells you she's in trouble despite fluids and insulin having partially worked.\n\n- **Metabolic acidosis in DKA** stems from ketone production when insulin deficiency blocks glucose uptake; ketoacids (beta-hydroxybutyrate and acetoacetate) accumulate faster than the kidneys and lungs can clear them, driving pH down.\n- **Respiratory compensation** (Kussmaul breathing) should lower pCO2 to ~1.5 × HCO3 + 8, or roughly 22–24 mmHg for a bicarbonate of 9 — Mia's pCO2 of 24 is appropriate, but her respiratory rate of 10 is dangerously low, suggesting her CNS is failing to drive the compensatory drive needed to maintain pH.\n\nThe severely low bicarbonate plus falling respiratory effort is the red flag that cerebral edema is stealing her drive to breathe."
        },
        {
          "id": "sodium",
          "name": "Sodium",
          "value": "136",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.sodium.why",
          "why": "Mia's sodium of 136 mEq/L reads normal on its face, but it's actually deceptively low because her hyperglycemia is pulling water into the intravascular space — the corrected sodium (adjusted for her glucose of 388) is 142, signaling genuine hyponatremia. This matters because hyponatremia worsens cerebral edema by lowering serum osmolality and driving fluid into brain cells exactly when her ICP is already elevated from DKA-associated swelling.\n\n- **Hyperglycemia-induced pseudohyponatremia** occurs when glucose osmotically shifts water from cells into plasma, diluting measured sodium without changing total body sodium; correction reveals the true deficit.\n- **Hyposmolar shifts** in the setting of raised ICP amplify cerebral edema risk — the combination of metabolic acidosis triggering brain swelling plus a low osmotic gradient to hold fluid out of neurons is synergistic.\n\nHyperosmolar therapy (3% hypertonic saline) will raise serum osmolality and pull fluid back out of brain tissue; this is your first move while securing the airway."
        },
        {
          "id": "potassium",
          "name": "Potassium",
          "value": "3.4",
          "unit": "mEq/L",
          "ref": "3.5-5.0",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.potassium.why",
          "why": "Mia's potassium of 3.4 mEq/L is low-normal and deceptively dangerous in DKA — her total body potassium is profoundly depleted, but acidosis is masking it by pushing potassium out of cells. Once you give insulin and fluids, the acidosis corrects, potassium shifts back intracellularly, and her serum K+ can plummet into the dangerous range within hours if you don't replace it proactively.\n\n- **Total body potassium deficit in DKA** averages 3–10 mEq/kg despite a \"normal\" or low-normal serum value; acidosis artifactually elevates the serum reading while the cells are starved.\n- **Insulin and bicarb lower potassium acutely** by driving it back inside cells as pH normalizes, creating a critical window where replacement lags demand and dysrhythmias become possible.\n\nHold insulin infusion if K+ <3.5 mEq/L until potassium replacement is underway; do not let initial resuscitation fluids defer the need for careful potassium dosing once insulin begins."
        },
        {
          "id": "glucose_repeat",
          "name": "Corrected Sodium",
          "value": "142",
          "unit": "mEq/L",
          "ref": "135-145",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.glucose_repeat.why",
          "why": "The corrected sodium of 142 mEq/L tells you that Mia's total body sodium deficit is actually modest — her hyponatremia on the initial panel (136) was mostly pseudohyponatremia from the hyperglycemia pulling water into the extracellular space. This matters because it means you're not chasing a sodium problem; you're treating cerebral edema from osmotic shift and intracellular acidosis, not from osmolar imbalance.\n\n- **Osmotic pseudohyponatremia** occurs when a non-sodium solute (here, 388 mg/dL glucose) raises extracellular osmolality and draws intracellular water outward, diluting measured sodium without an actual sodium deficit—correcting for glucose restores the true picture.\n- **Hyperosmolar therapy works by increasing extracellular osmolality** to reverse that inward water shift and shrink the swollen brain; since her true sodium is normal-range, you're safe giving hypertonic saline without worry that you're correcting a real sodium loss and will overshoot.\n\nDo not delay hyperosmolar therapy waiting for corrected sodium — give 3% saline or mannitol now and recheck sodium after airway is secured."
        },
        {
          "id": "betahydroxybutyrate",
          "name": "Beta-Hydroxybutyrate",
          "value": "4.2",
          "unit": "mmol/L",
          "ref": "< 0.6",
          "bad": true,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.betahydroxybutyrate.why",
          "why": "Beta-hydroxybutyrate at 4.2 mmol/L confirms severe ketosis — Mia's liver is flooding her bloodstream with ketoacids faster than her body can clear them, which is why her pH is 7.18 despite aggressive respiratory compensation.\n\n- **Ketone production in DKA** occurs when insulin deficiency blocks glucose entry into cells; the body shunts to fat breakdown for energy, generating acetyl-CoA that the liver converts to beta-hydroxybutyrate and acetoacetate.\n- **Corrected sodium of 142** tells you the hyperglycemia-driven osmotic shift is real and severe; the ketosis is driving the acidosis, not just hyperglycemia alone, which matters because insulin + fluids will clear glucose quickly but ketones persist longer — acidosis will lag glucose correction by hours.\n\nThe triad of elevated ketones + low pH + low HCO3 is textbook DKA. Right now your focus is the cerebral edema signaled by her Cushing's triad and dilating pupil — hyperosmolar therapy and airway protection take precedence — but post-resuscitation, watch for rebound hypokalemia when insulin starts converting glucose back to glycogen; her K+ is already low at 3.4."
        },
        {
          "id": "wbc",
          "name": "WBC",
          "value": "13.1",
          "unit": "× 10³/µL",
          "ref": "5-15",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.wbc.why",
          "why": "WBC of 13.1 × 10³/µL is normal for an 8-year-old and reassuring in the context of DKA — it tells you this is metabolic derangement, not concurrent bacterial infection driving the picture. Stress leukocytosis from DKA itself (hyperglycemia, acidosis, catecholamine surge) can raise WBC into the high-normal to mildly elevated range without infection. A normal WBC with normal bands rules out the one thing that would change your immediate antibiotic approach: you are not covering for sepsis on top of DKA. Your focus stays on hyperosmolar therapy, airway protection, and insulin-fluids-potassium sequencing once she stabilizes from herniation risk.\n\n- **Stress leukocytosis** from DKA's metabolic stress and catecholamine surge is expected; a normal count does not mean there is no inflammatory state.\n- **Absence of bandemia** (immature neutrophil shift) further supports metabolic cause rather than acute bacterial infection requiring empiric coverage."
        },
        {
          "id": "creatinine",
          "name": "Creatinine",
          "value": "0.6",
          "unit": "mg/dL",
          "ref": "0.3-0.7",
          "bad": false,
          "critical": false,
          "cat": "lab",
          "_slotRef": "phase[3].labs.creatinine.why",
          "why": "Mia's creatinine of 0.6 mg/dL is normal for her age, but in the context of profound dehydration this is reassuring rather than definitive — it tells you her kidneys are still filtering despite volume depletion, not that she has no renal stress. In DKA, creatinine can lag behind the severity of dehydration because acidosis itself may suppress creatinine production slightly, masking the true degree of prerenal azotemia. A normal creatinine in a visibly dehydrated child means renal perfusion is still adequate, but it's a narrow window — if fluids are delayed much longer, creatinine will rise sharply once the kidney hits the wall. The reassuring finding here is that she's not yet in acute kidney injury; the urgent finding is that she's heading toward it if cerebral edema progresses unchecked. Secure the airway and give hyperosmolar therapy first, then aggressive fluid resuscitation will restore her glomerular filtration rate."
        }
      ],
      "actions": {
        "tools": {
          "vsMonitor": {
            "id": "vsMonitor",
            "label": "Connect to vital signs monitor",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.vsMonitor.fb",
            "fb": "Continuous cardiac monitoring is your window into herniation happening in real time — Cushing's triad can deteriorate to asystole or bradycardic arrest in minutes once ICP peaks. Mia's heart rate of 58 with blood pressure 138/74 and respiratory depression signals increased intracranial pressure compressing the brainstem; the monitor will show you whether she's maintaining perfusion or decompensating further as you give hyperosmolar therapy and prepare airway protection. **Bradycardia with hypertension** is the ominous sign that cerebral edema is mechanical and active, not metabolic — the monitor trending her heart rate beat-to-beat tells you if therapy is buying time or if you're moving to intubation emergently. **Real-time arrhythmia detection** matters because hyperkalemia (her K+ is 3.4 but total body potassium is severely depleted and will rebound once insulin starts) and severe acidosis can produce peaked T waves or widened QRS; the monitor catches electrical changes before they become arrest.",
            "pri": 1,
            "ok": true
          },
          "intubationKit": {
            "id": "intubationKit",
            "label": "Prepare and perform rapid sequence intubation",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.tools.intubationKit.fb",
            "fb": "Airway protection now is the difference between a salvageable herniation and a fatal one — Mia's GCS of 7 means she cannot protect her airway, and her bradycardia with dilating pupil signals that ICP is rising faster than hyperosmolar therapy alone can reverse it. RSI is the correct call because it secures the airway before she seizes, aspirates, or loses her brainstem reflexes entirely.\n\n- **Rapid sequence intubation** in raised ICP uses induction agents that blunt intracranial pressure spike: propofol or etomidate (not thiopental, which causes hypotension). Pretreatment with lidocaine 1.5 mg/kg IV blunts the cough reflex and ICP surge during laryngoscopy.\n- **Mechanical ventilation** allows controlled minute ventilation at normocapnia (target pCO2 35–45 mmHg) — her current Kussmaul breathing and hypoventilation mean CO2 is not being cleared effectively, worsening cerebral vasodilation and edema.\n\nAdminister 3% hypertonic saline (3–5 mL/kg = 75–125 mL bolus over 10 minutes) through the patent IV immediately before or concurrently with induction — osmotic therapy and airway protection work in parallel, not sequence.",
            "pri": 2,
            "ok": true
          },
          "headOfBedElevation": {
            "id": "headOfBedElevation",
            "label": "Elevate head of bed to 30 degrees",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.headOfBedElevation.fb",
            "fb": "Head-of-bed elevation to 30° is your first physical maneuver for raised intracranial pressure — it improves cerebral venous drainage and lowers ICP before any medication takes effect, and it costs nothing to do immediately.\n\n- **Cerebral venous return** depends on gravity and neck position; 30° elevation with the head midline (not rotated) optimizes jugular outflow and lowers ICP by roughly 3–5 mmHg within seconds.\n- **Cushing's triad — bradycardia, hypertension, respiratory depression — signals herniation risk**; positioning buys time while hyperosmolar therapy and airway preparation proceed in parallel, not sequentially.\n\nPosition her now, then push 3% hypertonic saline through the patent IV while anesthesia comes to the bedside for intubation.",
            "pri": 1,
            "ok": true
          },
          "pupilCheck": {
            "id": "pupilCheck",
            "label": "Perform serial pupil checks",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.pupilCheck.fb",
            "fb": "Serial pupil checks are your real-time window into rising intracranial pressure and impending herniation in cerebral edema — a dilating pupil on one side is the bedside red flag that intracranial pressure is compressing the oculomotor nerve before imaging confirms it. Mia's right pupil is already dilating, her respiratory drive is failing, and her heart rate is slowing; these are Cushing's triad signs that herniation is minutes away. **Pupillary asymmetry** signals uncal herniation, where swollen brain tissue pushes the medial temporal lobe through the tentorial notch and compresses CN III, causing ipsilateral pupil dilation and later contralateral weakness. **Serial checks every 2–5 minutes** catch the progression before her airway reflexes disappear — a fixed, dilated pupil means you're out of time for awake intubation. Check pupils now, recheck after hyperosmolar therapy infuses, and recheck again during airway prep; improvement suggests the osmotic therapy is working, worsening means she's herniating and you need the tube immediately.",
            "pri": 1,
            "ok": true
          },
          "gcsAssessment": {
            "id": "gcsAssessment",
            "label": "Perform formal GCS assessment",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.gcsAssessment.fb",
            "fb": "Formal GCS assessment in a deteriorating DKA patient quantifies neurologic decline and triggers airway decisions — a GCS of 7 means she cannot protect her airway and intubation is not optional, it's emergent. The Glasgow Coma Scale stratifies mental status into eye opening, verbal response, and motor response; a total ≤8 is the threshold for loss of protective airway reflexes and aspiration risk. Mia's dilating pupil, bradycardia, and hypertension (Cushing's triad) signal raised intracranial pressure from cerebral edema, and her dropping respiratory drive means the brainstem is being compressed — GCS tells you how much time you have left before herniation locks in the decision. Document the baseline score before hyperosmolar therapy so you can track whether the intervention is working or whether her mental status is still sliding downward, because that directs whether you intubate now or wait 10 minutes to see response.",
            "pri": 1,
            "ok": true
          },
          "headCt": {
            "id": "headCt",
            "label": "Order head CT scan",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.tools.headCt.fb",
            "fb": "Head CT is the right imaging study for stroke, tumor, or bleed — not for DKA-associated cerebral edema. In cerebral edema, the swelling is diffuse cytotoxic edema of gray and white matter; CT shows either normal findings or global cerebral swelling that doesn't change your management. The mechanism driving Mia's Cushing's triad (bradycardia, hypertension, dilating pupil) and dropping respiratory drive is increased intracranial pressure from fluid shift into brain cells — insulin and hyperosmolar therapy pull that fluid back out. Waiting for CT imaging costs you 20–30 minutes while her ICP climbs; in DKA cerebral edema, clinical recognition and immediate hyperosmolar therapy trump imaging. Start 3% hypertonic saline now, secure the airway now, and image only if her mental status doesn't improve within minutes of treatment or if the picture doesn't fit DKA (asymmetric findings, focal deficits, seizure activity unresponsive to metabolic correction).",
            "pri": 3,
            "ok": false
          },
          "lumbarPuncture": {
            "id": "lumbarPuncture",
            "label": "Perform lumbar puncture",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.tools.lumbarPuncture.fb",
            "fb": "Lumbar puncture is the right move when you're concerned about bacterial meningitis or encephalitis — not when you're facing herniation from raised ICP. The LP itself increases intracranial pressure transiently and risks tonsillar herniation in a patient with a dilating pupil and Cushing's triad already unfolding. Mia's presentation — bradycardia, hypertension, dropping respiratory rate, unilateral pupil dilation, deteriorating mental status in the context of known DKA — is cerebral edema from osmotic shifts, not infection. Her WBC is normal, she has no fever, and the corrected sodium is 142 (normal), ruling out hyponatremia as a driver. The diagnosis is clinical and the intervention is hyperosmolar therapy and airway protection right now, not lumbar puncture. Save LP for the febrile child with meningismus; this child needs mannitol or hypertonic saline and an airway team at the bedside.",
            "pri": 3,
            "ok": false
          },
          "etco2": {
            "id": "etco2",
            "label": "Attach end-tidal CO2 monitoring",
            "priority": "correct",
            "_slotRef": "phase[3].actions.tools.etco2.fb",
            "fb": "End-tidal CO2 monitoring is essential right now because Mia's respiratory drive is already depressed and you're about to secure her airway — you need real-time feedback on ventilation adequacy the moment you intubate. Her RR of 10 and dropping respiratory effort signal she's minutes away from apnea; once you're bagging or on the ventilator, ETCO2 waveform tells you if each breath is reaching the lungs or if the tube has slipped into the esophagus or right mainstem. In cerebral edema with herniation risk, hypocapnia worsens outcomes by triggering vasoconstriction and brain ischemia, so you'll need to target a specific pCO2 (typically 35–40 mmHg) rather than just \"ventilate.\" ETCO2 gives you that target breath-by-breath without waiting for an ABG. The capnograph also detects tube malposition instantly — critical when your window to act safely is closing fast.\n\n- **Real-time tube placement confirmation** prevents unrecognized esophageal intubation, which delays airway control and allows aspiration risk to climb.\n- **Breath-by-breath pCO2 trending** lets you avoid both hypocapnia (which worsens cerebral edema) and permissive hypercapnia (which raises ICP further in the setting of brain swelling).",
            "pri": 1,
            "ok": true
          }
        },
        "meds": {
          "hypertonicSaline": {
            "id": "hypertonicSaline",
            "label": "Administer 3% hypertonic saline 2.5 mL/kg (62.5 mL) IV over 15 min",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.meds.hypertonicSaline.fb",
            "fb": "Hypertonic saline is the first-line osmotic agent for suspected cerebral edema with active herniation signs — Cushing's triad (bradycardia, hypertension, and abnormal respiratory pattern), pupil dilation, and falling GCS are your green light to dose immediately without waiting for imaging. At 3–5 mL/kg IV over 10–20 minutes, 3% saline creates an osmotic gradient that pulls free water out of the brain parenchyma and reduces intracranial pressure within minutes.\n\n- **Osmotic gradient across the blood–brain barrier** draws interstitial fluid from the brain into the intravascular space, shrinking cerebral edema even while the underlying DKA (hyperglycemia, acidosis, ketones) is still being corrected by fluids and insulin.\n- **Onset is faster than mannitol** and hypertonic saline avoids the rebound edema risk if serum osmolality climbs above 320 mOsm/kg — monitor serum osmolality during resuscitation but do not withhold this dose for osmolality checks.\n\nPosition the head of bed 30° and keep her neck neutral to maximize cerebral venous drainage while you're buying time for intubation and ICU-level airway management.",
            "pri": 2,
            "ok": true
          },
          "mannitol": {
            "id": "mannitol",
            "label": "Administer mannitol 0.5–1 g/kg (12.5–25 g) IV over 20 min",
            "priority": "tied-correct",
            "_slotRef": "phase[3].actions.meds.mannitol.fb",
            "fb": "Mannitol is your immediate defense against herniation when raised intracranial pressure is producing Cushing's triad and anisocoria — the clinical signs Mia is showing right now. A 0.5–1 g/kg bolus (12.5–25 g in her 25 kg frame) draws fluid from the brain parenchyma into the intravascular space along an osmotic gradient, lowering ICP within minutes. The mechanism works only if the blood-brain barrier is intact — it's an osmotic pull, not a chemical fix. Her deteriorating mental status despite normalizing glucose, plus bradycardia with hypertension and dilating pupil, means the acidosis is no longer the problem; swelling inside the rigid skull is. Mannitol buys you time to secure the airway and prevent herniation, but it's a temporizing measure — imaging and ICU management follow. Monitor serum osmolality to stay under 320 mOsm/L; above that threshold, the osmotic gradient flattens and efficacy drops.",
            "pri": 2,
            "ok": true
          },
          "ketamine": {
            "id": "ketamine",
            "label": "Administer ketamine 1.5 mg/kg (37.5 mg) IV for RSI induction",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.ketamine.fb",
            "fb": "Ketamine at induction doses (1–2 mg/kg IV) preserves airway reflexes and maintains spontaneous ventilation better than propofol or thiopental — critical when you're intubating a child with raised ICP who can't afford a blood pressure crash. At 25 kg, 1.5 mg/kg = 37.5 mg, a standard RSI dose. Ketamine causes sympathomimetic release that sustains or slightly raises BP and HR, which this patient needs; propofol would drop her pressure into a brain already swelling from edema. The dissociative state also blunts the hypertensive response to laryngoscopy itself — less catecholamine surge, less ICP spike during the tube pass.\n\n- **Sympathomimetic preservation of perfusion** protects cerebral perfusion pressure when every mmHg of BP matters; her Cushing's triad (bradycardia, hypertension, respiratory depression) signals uncal herniation is imminent and hypotension now could be catastrophic.\n- **Maintenance of spontaneous ventilation** during induction allows you to preoxygenate and position without apnea-induced hypoxemia and CO2 retention, both of which worsen ICP in the seconds before you're ready to control the airway.\n\nProceed directly to intubation prep — she has minutes.",
            "pri": 1,
            "ok": true
          },
          "rocuronium": {
            "id": "rocuronium",
            "label": "Administer rocuronium 1.2 mg/kg (30 mg) IV for RSI paralysis",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.rocuronium.fb",
            "fb": "Rocuronium provides the neuromuscular blockade you need to secure the airway safely during rapid sequence intubation when Mia can no longer protect it — her GCS of 7 and dropping respiratory drive mean she's minutes from complete airway loss. At 25 kg, 1.2 mg/kg equals 30 mg IV, a standard RSI paralytic dose that produces complete skeletal muscle relaxation within 30–60 seconds, allowing smooth laryngoscopy without coughing or aspiration risk. **Neuromuscular blockade eliminates spontaneous respiratory effort**, which is essential here because Mia's Kussmaul breathing — though it was helping her blow off CO2 earlier — now becomes a liability during intubation; you need an apneic patient to visualize the vocal cords and pass the tube cleanly. **Rocuronium's rapid onset and intermediate duration** (30–40 minutes) make it the preferred paralytic in emergency airway management when time is critical, especially in a patient approaching herniation. Once you've secured the tube and confirmed placement, the paralysis buys you time to stabilize her and start hyperosmolar therapy without fighting her breathing. Do not give rocuronium until etomidate or ketamine has induced unconsciousness — paralysis without sedation leaves her aware and apneic, which is inhumane.",
            "pri": 1,
            "ok": true
          },
          "regularInsulin": {
            "id": "regularInsulin",
            "label": "Continue insulin infusion — do not stop",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.regularInsulin.fb",
            "fb": "Insulin must not be stopped despite cerebral edema because the underlying DKA is still driving acidosis and osmotic stress — stopping insulin allows ketone production and acidosis to rebound, worsening the very process that triggered the edema. At 8 years old and 25 kg, she's on 0.05–0.1 U/kg/hr, which is 1.25–2.5 U/hr — a low physiologic dose that shuts down lipolysis and ketone generation without rapid osmotic shifts. The cerebral edema here stems from DKA's metabolic cascade and the osmotic gradient created by hyperglycemia, not from insulin itself. Hyperosmolar therapy (3% hypertonic saline or mannitol) addresses the acutely raised ICP; insulin continuation addresses the root cause — you do both, not one or the other. Her potassium is low at 3.4 mEq/L, which is actually why insulin infusion stays safe to continue: the insulin will shift K+ intracellularly, but her profound total-body deficit means serum K+ will still trend down, and you're already planning aggressive replacement. Monitor K+ every 2–4 hours during this phase and add dextrose to the IV fluids once glucose falls below 250 mg/dL to prevent hypoglycemia while insulin continues working.",
            "pri": 1,
            "ok": true
          },
          "potassiumReplacement": {
            "id": "potassiumReplacement",
            "label": "Add potassium to IV fluids (K 3.4 — replace now)",
            "priority": "correct",
            "_slotRef": "phase[3].actions.meds.potassiumReplacement.fb",
            "fb": "Potassium replacement in DKA is a timing trap: serum K+ of 3.4 mEq/L looks \"low\" but is often deceptively normal or even high when you correct for acidosis — the low number masks a severe total-body deficit that will crash catastrophically once insulin and fluids start working. In Mia's case, the acidosis is driving potassium out of cells into the serum; when you correct the pH, K+ will plummet unless you're already replacing it. Starting KCl now, while she's still acidotic and still urinating, gives you a buffer before the osmotic shift flips the direction.\n\n- **Acidosis-driven hyperkalemia** means serum K+ underestimates the total-body deficit by 3–5 mEq/L; as pH normalizes, that K+ will drop 0.5–1 mEq/L per 0.1 unit rise in pH, potentially falling to life-threatening levels if you wait.\n- **Insulin and dextrose shift K+ intracellularly** within minutes of starting; delaying replacement until K+ looks low on repeat labs (waiting for confirmation) often means watching the patient arrest as you draw the replacement labs.\n\nStart KCl only after confirming urine output and K+ ≤5.5 mEq/L — Mia meets both. A typical starting concentration is 20 mEq/L in maintenance fluids; recheck K+ in 2–4 hours and adjust.",
            "pri": 1,
            "ok": true
          },
          "sodiumBicarb": {
            "id": "sodiumBicarb",
            "label": "Administer sodium bicarbonate IV push",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.meds.sodiumBicarb.fb",
            "fb": "Sodium bicarbonate is the right call when acidosis itself is driving cardiovascular collapse—profound bradycardia, shock, or QRS widening—or in specific toxidromes like tricyclic antidepressant overdose with QRS widening. Mia's bradycardia and hypertension are Cushing's triad from raised intracranial pressure, not from the pH of 7.18 itself; her perfusion is intact (cap refill 2 sec, warm skin, weak but present pulses). Bicarbonate corrects acidosis by buffering hydrogen ions, but in DKA the acidosis is a consequence of ketone accumulation, and the body clears ketones as insulin shuts down lipolysis and fluids restore renal perfusion—treating the acidosis biochemically doesn't treat the underlying cause. More critically, bicarbonate generates CO2, which diffuses into the CSF faster than it can be blown off by a child whose respiratory drive is already falling (RR 10, dropping mental status); rising CSF CO2 lowers CSF pH and worsens cerebral edema at the exact moment you're fighting to prevent herniation. Her immediate threat is swelling in the cranium, not the serum pH.\n\n- **Bicarbonate's CO₂-generating mechanism** raises pCO2, and CO2 crosses the blood-brain barrier rapidly, lowering CSF pH despite rising serum pH—the wrong direction in cerebral edema.\n- **Hyperosmolar therapy (3% hypertonic saline or mannitol)** shrinks swollen brain tissue by drawing water across the blood-brain barrier, directly addressing the herniation risk that her dilating pupil and bradycardia signal.\n\nPush 3–5 mL/kg 3% NaCl IV now, secure her airway, and manage the DKA's acidosis with fluids and insulin over the next 24 hours once the swelling is controlled.",
            "pri": 3,
            "ok": false
          },
          "dextroseBolus": {
            "id": "dextroseBolus",
            "label": "Administer dextrose bolus IV",
            "priority": "distractor-misc",
            "_slotRef": "phase[3].actions.meds.dextroseBolus.fb",
            "fb": "Mia needs airway protection and hyperosmolar therapy right now — not dextrose. Her glucose is 388 mg/dL, well above the threshold where adding sugar becomes dangerous. Dextrose bolus is the correct intervention when serum glucose has dropped below 60 mg/dL during insulin infusion, signaling hypoglycemia that threatens cerebral perfusion. In DKA, you add dextrose to *maintenance* fluids once glucose reaches 250–300 mg/dL to allow continued insulin infusion without hypoglycemia. Mia's immediate crisis is cerebral edema from osmotic shift — her brain is swelling because free water has moved intracellularly as glucose rose. Giving more glucose worsens that osmotic gradient. The intervention that matters now is 3% hypertonic saline or mannitol to reverse the gradient and buy time for the airway.",
            "pri": 5,
            "ok": false
          },
          "nsBolus": {
            "id": "nsBolus",
            "label": "Administer another NS bolus 20 mL/kg IV",
            "priority": "distractor-clinical",
            "_slotRef": "phase[3].actions.meds.nsBolus.fb",
            "fb": "Another 20 mL/kg NS bolus is the right move in early septic shock or hypovolemic shock, but Mia is now in cerebral edema with herniation signs — a completely different problem requiring the opposite approach. Crystalloid boluses expand intracellular fluid volume along the osmotic gradient when serum sodium is normal; in cerebral edema, additional free water (even isotonic saline is hypotonic relative to her swollen brain) worsens intracranial pressure. Her corrected sodium is 142 mEq/L (normal), her glucose is 388 (the osmotic driver of her edema), and her pupils are dilating — she needs hyperosmolar therapy (3% hypertonic saline or mannitol) to shrink the intracellular space, not more isotonic fluid. The NS bolus was correct in the first hour of DKA resuscitation; now it's contraindicated.",
            "pri": 3,
            "ok": false
          }
        }
      }
    }
  ],
  "visuals": [
    "diaphoretic"
  ],
  "patient": {
    "name": "Mia Okonkwo",
    "ageLabel": "8 years old",
    "weightKg": 25,
    "sex": "F",
    "cc": "severe diabetic ketoacidosis"
  },
  "emsReport": "This is Mia, 8 years old, 25 kilos, known type 1 diabetic. Mom says she ran out of insulin three days ago and couldn't get a refill. She's been vomiting for about 12 hours and got progressively more lethargic through the afternoon. On scene she was awake but slow — answering questions but taking her time. BGL on our glucometer was high, over 500, so we brought her straight in. We got a line en route but held fluids pending your orders. No allergies, no other meds, no other history.",
  "learnMore": "Insulin deficiency for 72 hours is long enough to fully exhaust hepatic glycogen stores and drive unrestrained ketogenesis. This child's 12 hours of vomiting layered volume depletion on top of the osmotic diuresis she'd already been running for days, compounding her acidosis and electrolyte losses. Her pH of 7.08 puts her in the severe DKA category — the kind where cerebral injury risk climbs with every hour of treatment.",
  "curveball": null,
  "source": "builtin",
  "reassessment": {
    "narrative": "Ten minutes after hypertonic saline and successful RSI with ketamine and rocuronium, Mia is intubated and connected to the ventilator. Tube position is confirmed with bilateral breath sounds and end-tidal CO2 waveform. Her heart rate has climbed back to 88 — that bradycardia is resolving as intracranial pressure comes down. Blood pressure is trending toward 118/68. The right pupil has come back to 4 mm and is reactive again — a reassuring sign that herniation has been halted. The insulin drip is running, potassium replacement has been added to the IV fluids, and the metabolic picture continues to improve in the background. PICU has been notified and is ready to accept.",
    "vitals": {
      "hr": "88",
      "rr": "22",
      "bp": "118/68",
      "spo2": "99",
      "temp": "37.2",
      "cap": "2 sec"
    },
    "outcome": "transferred-icu",
    "stabilizationSummary": "Mia is intubated and hemodynamically stable, with resolving Cushing's response and symmetric pupils following hyperosmolar therapy and airway control. The insulin drip continues, potassium replacement is running, and her DKA is on a correcting trajectory. PICU team is at the door for handoff, with neurology consulted for ongoing cerebral edema management."
  },
  "debrief": {
    "summary": "Mia presented in severe DKA and initially responded to fluids and insulin — then developed the most feared complication: cerebral edema. The warning signs were all there: new severe headache during treatment, a GCS that was falling despite improving glucose, and a heart rate that dropped from 128 to 58 in 15 minutes in the context of rising blood pressure. That Cushing's triad — bradycardia, hypertension, irregular respirations — in a child mid-DKA treatment is cerebral edema until proven otherwise. The key teaching moment is that treatment must not wait for imaging: hyperosmolar therapy and airway protection come first, CT comes after.",
    "keyTeaching": [
      "DKA-associated cerebral edema classically occurs 4–12 hours into treatment and is heralded by headache, declining mental status, and Cushing's triad — don't wait for CT to treat.",
      "Either 3% hypertonic saline (2.5 mL/kg) or mannitol (0.5–1 g/kg) are first-line hyperosmolar agents; both work by creating an osmotic gradient that draws water out of swollen brain tissue.",
      "A falling heart rate in a child who was tachycardic from DKA is never reassuring — bradycardia plus hypertension in this context is a neurological emergency, not a sign of improvement.",
      "Airway protection is urgent when GCS drops to 8 or below; RSI with ketamine is preferred in this setting because it maintains hemodynamic stability and does not lower ICP.",
      "Insulin must not be stopped when cerebral edema develops — the metabolic emergency is ongoing; treat the brain and keep closing the ketoacidosis simultaneously."
    ],
    "physiologyDeepDive": [
      {
        "id": "cerebral-edema-mechanism",
        "title": "Why Does Cerebral Edema Develop During DKA Treatment?",
        "_slotRef": "debrief.physiologyDeepDive.cerebral-edema-mechanism.content",
        "content": "Cerebral edema in DKA is a paradox: it often develops not during the buildup of acidosis, but during the treatment of it — and the faster you correct the osmotic gradient, the more likely the brain swells. The mechanism hinges on osmotic drag: when blood glucose and osmolality drop faster than the brain can equilibrate, water follows osmoles into the intracellular space, raising intracranial pressure. Mia's case is exactly the kind that teaches this — she arrived in severe acidosis and was alert enough to answer, but the real danger is in the first hours of insulin and fluids, when the osmotic landscape shifts fastest.\n\n- **The brain is an osmotically active organ.** During hyperglycemia and dehydration, intracellular osmoles (amino acids, taurine, myo-inositol, sorbitol from glucose metabolism) accumulate over hours to maintain osmotic balance with a hypertonic extracellular space. This protects the brain from shrinking as plasma osmolality climbs, but it also traps water inside once treatment begins.\n\n- **Osmotic gradient reversal is the driver.** As insulin works and glucose falls, the extracellular osmolality drops rapidly — but the intracellular osmoles take time to leave. The **transient osmotic gradient** now favors water moving inward, and the brain swells. This swelling is invisible on the first exam and shows up on repeat vitals: bradycardia, rising blood pressure, declining mental status, or headache are the classic late signs.\n\n- **Speed of glucose correction matters more than the absolute starting glucose.** A glucose drop of 100 mg/dL per hour is the accepted safe threshold in most pediatric DKA protocols. Mia at 542 mg/dL might tolerate faster decline than a patient at 1000 mg/dL, but the rate of change is what the osmotic gradient \"sees,\" not the starting number.\n\n- **Insulin dosing and fluid rate are the controllable variables.** The standard insulin infusion of 0.1 units/kg/hr (Mia's 2.5 units/hr) is titrated specifically to avoid overshooting glucose correction. Too-rapid fluid boluses — especially if given as bolus after bolus — also steepen the osmotic gradient. The Phase 2 narrative prescribed 10 mL/kg over 30–60 minutes; faster would raise risk.\n\n- **Sodium correction confounds the picture.** Mia's measured sodium is 132 (hyponatremic), but her **corrected sodium** is actually higher when you account for hyperglycemia: every 100 mg/dL of glucose above normal lowers measured sodium by ~2.4 mEq/L. As glucose falls, measured sodium will rise artifactually — this is expected and not a reason to restrict fluids. Confusing corrected vs. measured sodium has led clinicians to over-restrict volume, worsening acidosis and delaying recovery.\n\n- **Cerebral edema risk peaks in the second to fourth hour of treatment**, not at presentation. Mia looked relatively alert on arrival; that false reassurance is dangerous. The window when she's most vulnerable is when insulin and fluids are actively correcting the osmotic derangement. Any change in mental status — even subtle lethargy, restlessness, or a shift from answering questions to being non-verbal — is an early warning.\n\n- **Hypokalemia during treatment worsens neurological risk.** As insulin shifts potassium intracellularly, serum K drops. In Mia's case, starting K is 5.8 (high-normal due to acidosis and volume depletion). Once insulin runs, expect K to fall toward 4 or lower within 1–2 hours if potassium replacement is not started judiciously. Severe hypokalemia depolarizes neurons and can worsen cerebral edema risk. This is why the Phase 2 intervention said \"Hold potassium replacement — recheck after insulin started\" — the goal is to recheck K within 30–60 minutes, not to withhold K forever.\n\n- **Mannitol or 3% saline are second-line treatments if cerebral edema manifests clinically.** Mannitol (0.25–1 g/kg IV over 15–20 min) creates an osmotic diuretic effect that shrinks brain water acutely. Hypertonic saline (3%, 2–5 mL/kg bolus) raises serum osmolality and pulls water out of the intracellular space. Neither prevents edema; both are rescue tools for the child whose mental status is declining or whose pupils are dilating. Prevention through measured, titrated insulin and fluid dosing is the better strategy.\n\n- **The ISPAD 2022 DKA guideline emphasizes reassessment intervals over fixed protocols.** Check glucose, electrolytes, and acid-base status every 2–4 hours in the first 12 hours, not once at presentation and then assume the plan is working. This cadence lets you catch osmotic drift — a glucose drop that's too fast, a potassium fall that's outpacing replacement, or subtle neurological changes — before they become emergencies.\n\n**TL;DR:** Cerebral edema in DKA is an osmotic accident waiting to happen during treatment, not during the disease itself. Guard against it by keeping glucose correction to ~100 mg/dL/hour, titrating fluid boluses, monitoring K closely as it shifts intracellularly, and watching Mia's mental status and vital signs like a hawk for the first 4 hours — that's when the osmotic gradient is doing the most damage."
      },
      {
        "id": "cushings-triad",
        "title": "Cushing's Triad: Bradycardia, Hypertension, Irregular Respirations",
        "_slotRef": "debrief.physiologyDeepDive.cushings-triad.content",
        "content": "Cushing's triad is the cardinal sign of raised intracranial pressure — bradycardia, hypertension, and irregular (often slow) respirations arising from brainstem compression. In pediatric DKA, cerebral edema is the most feared complication, and recognizing Cushing's triad early is the difference between catching herniation in time and losing a patient. The triad is classically taught as a late sign, but in children it can appear before coma sets in, making vigilant reassessment essential.\n\n- **Cushing's triad arises from brainstem compression by herniation.** As intracranial pressure rises unchecked, the brain tissue herniates downward through the foramen magnum, pushing the medulla and pons against the brainstem. The medulla contains the cardiac and respiratory centers, so compression produces paradoxical bradycardia (despite hypoxia and acidosis that should drive tachycardia) and irregular breathing patterns (Cheyne-Stokes, agonal, or ataxic respirations).\n\n- **Bradycardia in Cushing's triad is the most reliable early sign.** A child in DKA should be tachycardic from metabolic acidosis, volume depletion, and catecholamine surge; a sudden drop in heart rate—especially when the mental status is declining—is an immediate red flag for increased ICP. In Mia's case, a shift from her presenting rate of 128 to, say, 85 bpm would be alarming and warrant emergency imaging and mannitol/hypertonic saline.\n\n- **Hypertension in Cushing's triad is a late compensatory response.** The medulla's vasomotor center is firing to maintain cerebral perfusion pressure as ICP rises; systolic pressure climbs while diastolic may widen less, creating a widened pulse pressure. In a child with baseline low-normal blood pressure from DKA dehydration (like Mia at 96/62), a sudden jump to 140/80 is abnormal and suspicious.\n\n- **Irregular respirations—not just tachypnea—are the third pillar.** Kussmaul respirations in DKA are regular and deep (the body's blow-off of acid). Cushing's triad respirations are arrhythmic: periods of apnea, then rapid shallow breathing, then deep gasping. This pattern reflects loss of brainstem regulatory control and is an ominous neurological sign.\n\n- **Cerebral edema in DKA develops from osmotic shift and cellular swelling.** Hyperglycemia creates an osmotic gradient pulling fluid into the intracellular space; once insulin is given, glucose drops rapidly, but ketones and other osmotically active particles remain briefly, creating a transient increase in intracellular osmolarity. Cells swell. In severe cases (pH < 7.1, glucose > 600, young age, rapid correction), subclinical edema can become symptomatic within hours.\n\n- **The classic teaching—\"Cushing's triad is a late sign\"—can be dangerous in pediatric DKA.** Changes in mental status, behavioral regression, or even subtle drowsiness often precede frank Cushing's triad. Mia arrived with blunted mentation (answering but not volunteering); progressive lethargy or irritability during resuscitation is an earlier warning than waiting for bradycardia.\n\n- **Mannitol (0.25–1 g/kg IV bolus) and 3% hypertonic saline (0.1–1 mL/kg/hr infusion, target Na 150–155 mEq/L) are the frontline agents for symptomatic cerebral edema.** Mannitol creates an osmotic gradient that pulls fluid out of the intracellular space; hypertonic saline does the same while expanding intracranial space. The choice between them is institutional, but rapid administration of either can reverse early edema before herniation.\n\n- **Fluid restriction (to 3 L/m²/day or about 50–75% of maintenance) during initial DKA resuscitation is standard practice to reduce the risk of overcorrection-induced edema.** You give the 10–20 mL/kg bolus to resuscitate shock, then switch to a conservative infusion rate to avoid excess free water. This is why Mia's Phase 2 instructions emphasize \"controlled volume resuscitation\"—not stingy, but measured.\n\n- **Slow glucose correction (target 50–100 mg/dL/hr) reduces the osmotic gradient shift that triggers edema.** Aggressive insulin dosing or boluses can drop glucose by 200+ mg/dL in an hour, creating a steep osmotic cliff. The standard infusion of 0.1 units/kg/hr is chosen partly for this reason—it's deliberate, not hurried.\n\n- **A lumbar puncture is NOT part of DKA workup and can be dangerous if raised ICP is suspected.** The classic teaching error is to assume headache or altered mental status in DKA means meningitis. It almost never does. If you LP a kid with cerebral edema, you lower CSF pressure in the spinal canal while the brain is already herniating—you can precipitate or worsen herniation.\n\n- **Head imaging (CT or MRI) is only indicated if Cushing's triad develops, mentation doesn't improve as expected with DKA treatment, or there's focal neurology.** Imaging is not routine in uncomplicated DKA. The bedside assessment—serial mental status checks, reassurance that Kussmaul respirations remain regular, confirmation that heart rate is not falling—is your safety net.\n\n**TL;DR:** Bradycardia (especially a sudden drop) in a child in DKA is an early red flag for cerebral edema until proven otherwise; don't wait for hypertension or irregular breathing to escalate to CT and consider mannitol. Slow glucose correction, fluid restraint, and vigilant neurological reassessment are your primary defenses."
      },
      {
        "id": "hyperosmolar-therapy",
        "title": "Hypertonic Saline vs. Mannitol in Pediatric Cerebral Edema",
        "_slotRef": "debrief.physiologyDeepDive.hyperosmolar-therapy.content",
        "content": "Cerebral edema in severe DKA is a feared complication that kills or brain-damages children — it happens in maybe 0.5–1% of cases, but when it occurs, the mortality and morbidity are catastrophic. The mechanism is osmotic: as hyperglycemia and ketoacidosis pull fluid into the intracellular space, the brain swells, intracranial pressure rises, and perfusion fails. When you suspect edema (altered mental status, headache, loss of pupillary response, bradycardia, seizure, or coma), you need to act fast with an osmotic agent. The two agents you'll see are hypertonic saline and mannitol, and they work differently enough that understanding each one changes how you use them.\n\n- **Mannitol works by osmotic diuresis: it stays in the extracellular space, draws fluid from brain parenchyma into plasma, and then gets excreted by the kidneys.** The onset is 15–30 minutes, peak effect at 30–60 minutes, and duration 4–6 hours. It's the agent many ICUs reach for first because it works fast and lowers ICP reliably. Dose is 0.25–1 g/kg IV push (typically 0.5–0.75 g/kg for acute edema); for Mia at 25 kg, that's 12.5–25 g as a single push.\n\n- **Hypertonic saline (3% or 23.4%) creates an osmotic gradient differently: sodium stays intracellular, draws water out of the brain cells into the plasma, and gets excreted renally.** Onset is faster than mannitol (5–10 minutes) and duration is shorter (2–4 hours), which means you may need to redose if cerebral edema is ongoing. 3% saline is given as 5 mL/kg bolus (125 mL for Mia); 23.4% is a smaller central-line push of 0.5–1 mL/kg (12–25 mL). Both raise serum osmolality acutely and pull the osmotic gradient inward.\n\n- **The real-world choice hinges on what you have on hand and your institutional protocol.** Neither agent is contraindicated in DKA; many pediatric ICUs use mannitol because the evidence base is longer and the pharmacology is simpler. Some centers prefer hypertonic saline because it's faster, doesn't cause diuresis (which risks losing more intravascular volume in an already-depleted kid), and can be given through a peripheral line if needed.\n\n- **Serum osmolality should not exceed 320 mOsm/L** when you're using osmotic therapy — above that, you risk rebound edema and acute kidney injury. If you've given mannitol and osmolality is already high, wait and recheck before redosing. Calculate osmolality as 2Na + (glucose/18) + (BUN/2.8); in Mia's Phase 1 labs, that's roughly 2(132) + (542/18) + (22/2.8) = 264 + 30 + 8 = ~302 mOsm/L, so there's room for osmotic therapy if needed.\n\n- **The mannitol-rebound phenomenon is real: after 2–4 hours, if the blood-brain barrier has become damaged (which happens in severe edema), mannitol can leak into the brain parenchyma and actually worsen swelling.** This is why hypertonic saline, with its shorter duration and lack of diuresis, may be preferable for prolonged or recurrent edema. Some ICUs use both: mannitol first for speed, hypertonic saline second if edema recurs or doesn't respond.\n\n- **Avoid hypotonic fluids entirely in DKA with suspected edema.** Dextrose-containing fluids can worsen hyperglycemia and pull more fluid into the brain. Maintain iso-osmolar or hyperosmolar IV therapy (normal saline, not half-normal; 0.9% dextrose once glucose is controlled, not D5W).\n\n- **Monitor for rebound edema and hyperchloremic acidosis after osmotic therapy.** Mannitol causes osmotic diuresis, which can deplete intravascular volume faster and shift the acid-base picture toward hyperchloremia (especially if you've already given lots of normal saline). Hypertonic saline causes a chloride load itself, which complicates the acid-base picture but avoids the volume loss.\n\n- **The earliest signs of cerebral edema are behavioral: irritability, decreased responsiveness, vomiting, or headache** — often subtle and easy to miss during the chaos of resuscitation. Mia is already altered (not volunteering words, but opening eyes and responding to voice), which means her mentation is abnormal but not profoundly decreased *yet*. If she becomes less arousable, loses the ability to follow commands, develops a fixed or blown pupil, or has a seizure, that's the moment you give osmotic therapy and call neurocritical care.\n\n- **Insulin itself reduces the risk of cerebral edema** by slowing the osmotic gradient — as insulin drives potassium and glucose intracellularly, you're actually reversing the osmotic force that pulled fluid into the brain in the first place. This is why the mantra in DKA is \"controlled, not delayed\" insulin. You start insulin after modest fluid resuscitation (10 mL/kg), not after 60 mL/kg, and you don't wait for potassium levels to normalize if they're already in a safe range (>3 mEq/L). Insulin is part of the edema prevention strategy.\n\n**TL;DR:** Mannitol (0.5–0.75 g/kg IV push) works fastest for acute cerebral edema in DKA; hypertonic saline (3% at 5 mL/kg) is faster-onset but shorter-lived and avoids diuresis. Either is acceptable; the key is recognizing early mentation changes and acting fast, while remembering that controlled insulin therapy is the best prevention in the first place."
      },
      {
        "id": "kussmaul-loss",
        "title": "Why the Loss of Kussmaul Breathing Is an Ominous Sign",
        "_slotRef": "debrief.physiologyDeepDive.kussmaul-loss.content",
        "content": "Kussmaul breathing — that deep, slow, effortful pattern you see in severe DKA — is the respiratory system's compensation for metabolic acidosis. It looks terrible, but it's actually a sign the body is still fighting. The ominous moment is when it stops: a sudden return to normal or shallow breathing in a DKA patient who's still acidotic is a red flag for either respiratory muscle fatigue or early cerebral edema, and either one is a crisis.\n\n- **Kussmaul breathing is a compensatory response to metabolic acidosis, not a primary respiratory problem.** The medullary chemoreceptors sense low pH (7.08 in Mia's case) and hypocapnia signals a need for more CO2 blowing off. The respiratory centers drive up tidal volume and slow the rate — you get deep, effortful breathing with a lower respiratory rate than you'd expect from the tachypnea alone. The pattern is unmistakable once you've seen it: slow, labored, purposeful.\n- **The deep breathing works because CO2 is an acid.** When you hyperventilate, you exhale CO2 faster than your body makes it, so the arterial pCO2 drops. Lower pCO2 shifts the carbonic acid-bicarbonate equilibrium and partially corrects pH. Mia's pCO2 of 18 (normal is 35–45) is the receipt for this compensation — her respiratory system has already done a lot of heavy lifting to get pH up from what it would be without hyperventilation.\n- **Kussmaul breathing is exhausting work, but it's not unsustainable indefinitely.** The intercostal and diaphragmatic muscles are working hard, consuming oxygen and glucose, and generating lactate from anaerobic metabolism in the muscle itself. In a 25-kg child, this is a real metabolic cost that adds to the overall acid-base burden. But children can sustain this for hours if needed.\n- **The loss of Kussmaul breathing while pH is still low is the danger signal.** If Mia suddenly starts breathing shallowly or at a normal rate while her pH is still 7.15 or lower, something critical has happened: either respiratory muscle fatigue has set in (the body gave up because it ran out of fuel), or the neurological status has changed and the respiratory drive is failing. The second scenario — failing respiratory drive in a still-acidotic child — is often the first bedside sign of cerebral edema.\n- **Cerebral edema in DKA presents subtly at first.** Headache and restlessness come first; then obtundation (loss of responsiveness), then loss of protective reflexes, then posturing. But a parent or clinician often notices the breathing change before they notice the mental status change, because respiratory pattern is easy to see and easy to miss at the same time. You're looking at the monitor, not directly at the patient's chest. Then the nurse says, \"Is her breathing supposed to be so slow now?\" and your spine goes cold.\n- **The risk window for cerebral edema peaks in the first 6–12 hours of treatment, not before insulin starts.** It used to be taught as a complication of overly aggressive fluid resuscitation, and fluid rate does matter, but modern pediatric DKA protocols use cautious, slow fluid repletion (10 mL/kg boluses over 30–60 minutes, then careful deficit replacement) and cerebral edema still happens. The mechanism is likely related to intracellular osmolyte accumulation and water shift into brain cells as glucose and ketones are cleared faster than osmolytes can equilibrate.\n- **Early warning signs besides respiratory change: bradycardia out of proportion to the clinical improvement, pupil dilation, posturing, or a sudden drop in responsiveness.** Bradycardia is particularly sinister — if Mia's heart rate was 128 and suddenly drops to 80 while she's still being resuscitated, that's not improvement, that's Cushing's triad emerging (hypertension, bradycardia, altered respiratory pattern) from raised intracranial pressure. Call neurocritical care immediately.\n- **If Kussmaul breathing disappears, do not assume the acidosis is correcting.** Check a blood gas. If pH is still less than 7.25 and pCO2 is rising (say, from 18 to 28), then the respiratory compensation has genuinely failed and you need to escalate: consider ICU transfer, assess for cerebral edema clinically (fundoscopy for papilledema if trained, check for posturing or pupil changes, reassess mental status), and be ready for intubation if airway protection becomes needed.\n- **Mia's current Kussmaul breathing is a good sign in this moment** — it means her respiratory system is still fighting the acidosis. Your job is to support her with fluids and insulin so the acidosis resolves before the respiratory muscles fatigue or cerebral edema develops. The goal is to make the Kussmaul breathing unnecessary again, not to see it disappear while she's still sick.\n\n**TL;DR:** Kussmaul breathing in DKA looks bad but is actually the body working hard to compensate; losing it while the pH is still low is a red flag for respiratory fatigue or cerebral edema and demands immediate reassessment and escalation."
      }
    ]
  },
  "stabilizationSummary": "Mia is intubated and hemodynamically stable, with resolving Cushing's response and symmetric pupils following hyperosmolar therapy and airway control. The insulin drip continues, potassium replacement is running, and her DKA is on a correcting trajectory. PICU team is at the door for handoff, with neurology consulted for ongoing cerebral edema management.",
  "tier": 3,
  "icon": "🩸",
  "tagline": "8-year-old · DKA with cerebral edema",
  "description": "An 8-year-old in severe DKA who develops cerebral edema during treatment — the classic deteriorating-while-the-numbers-improve trap."
};
