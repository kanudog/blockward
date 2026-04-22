# Block Ward — Pediatric Clinical Simulation for Nursing Education

**A free, interactive web app for training nurses and medical students in pediatric emergency recognition and critical care decision-making.**

**Created by:** Sebastian J. Heredia, BSN-c, RN — Pediatric Rapid Response Nurse, UNC Children's Hospital

**Live Demo:** [blockward-lovat.vercel.app](https://blockward-lovat.vercel.app)

---

## The Problem

Pediatric emergencies are high-stakes, low-frequency events. Nurses may go months or years between encountering a child in septic shock, status epilepticus, or respiratory failure. When these situations do arise, hesitation costs lives.

Traditional simulation labs are expensive ($50,000–200,000+ for high-fidelity mannequins), require scheduling, need dedicated space, and can only run a handful of students at a time. Students get limited repetitions on the scenarios that matter most.

**The result:** New nurses entering pediatric units often lack the pattern recognition skills to catch early deterioration — the subtle vital sign changes, the lab values that should trigger alarm, the clinical signs that distinguish compensated from decompensated shock.

---

## The Solution: Block Ward

Block Ward is a **web-based pediatric clinical simulator** that runs on any phone, tablet, or computer — no downloads, no special equipment, no scheduling. Students work through realistic clinical scenarios at their own pace, making the same decisions they'd face at the bedside.

### What Makes It Different

**It teaches the "why," not just the "what."** Every vital sign, lab value, medication, and intervention comes with a detailed physiological explanation. When a student chooses the wrong medication, they don't just see "incorrect" — they learn exactly why that drug is contraindicated in this specific clinical context, down to the receptor pharmacology.

**It builds pattern recognition through repetition.** Students can replay scenarios, try different approaches, and build the instinctive recognition that only comes from repeated exposure. A student can run through a septic shock scenario 10 times in an evening — something impossible in a physical sim lab.

**It adapts.** The AI-powered Scenario Builder lets instructors or students create custom scenarios for any pediatric emergency by simply describing it in plain language. The system researches current clinical guidelines and generates a complete, playable scenario with accurate vitals, labs, interventions, and physiology explanations.

---

## How It Works

### Phase 1: Patient Presentation & Assessment

Students receive a patient — a 6-month-old with fever and fussiness, a 2-year-old who won't stop vomiting, an 8-year-old in respiratory distress. They see:

- **Animated vital signs monitor** with real-time ECG and SpO2 waveforms
- **Clinical findings** organized by body system (Neuro, Cardiovascular, Respiratory, GI, Integumentary, Renal)
- **Lab panels** with reference ranges and critical value highlighting
- **Patient narrative** written in clinical language

Students must **flag which values are abnormal** — identifying tachycardia as compensatory rather than fever-driven, recognizing that a "normal" blood pressure in a child doesn't rule out shock, understanding what a rising lactate means for tissue perfusion.

After submitting, every value is explained with the underlying physiology. Students learn not just that HR 178 is abnormal, but *why* — infants are rate-dependent for cardiac output, and HR-temperature dissociation indicates compensatory shock, not simple febrile tachycardia.

### Phase 2: Intervention

The clinical picture deteriorates. Students choose from:

- **Tool Belt** — 13 medical instruments (stethoscope, BVM, IV/IO kit, defibrillator, needle decompression, glucometer, etc.)
- **Medication Cart** — 17 medications with weight-based dosing (NS bolus, epinephrine, ceftriaxone, lorazepam, dextrose, etc.)

Each choice triggers detailed feedback explaining why it's appropriate or not. Correct choices include priority rankings. Incorrect choices explain the specific harm — with occasional humor to make the lesson stick. (Attempting to defibrillate a child in sinus tachycardia from dehydration gets a memorable response.)

### Curveball Events

Mid-scenario, an unexpected complication strikes — a seizure during sepsis resuscitation, a wide-complex tachycardia from hypokalemia, a tension pneumothorax during an asthma exacerbation. Students must rapidly reassess and pivot their management plan. This mirrors the real-world unpredictability of pediatric emergencies.

### Debrief

After the scenario, students review:

- **Score** — percentage of correctly identified abnormals and appropriate interventions
- **Clinical flowchart** — visual summary of findings → interventions → outcome
- **Lab review** — every critical value explained with pathophysiology
- **Physiology deep dives** — expandable sections covering topics like HR-temperature dissociation, the pediatric shock cliff, infant glucose vulnerability, and electrolyte-driven arrhythmias
- **TLDR summaries** — one-sentence takeaways for quick review

---

## Built-In Scenarios (Clinically Reviewed)

| Scenario | Patient | Core Teaching | Curveball |
|----------|---------|---------------|-----------|
| **The Fussy Infant** | 6-month-old male | Septic shock recognition, HR-temp dissociation, fluid resuscitation | Seizure from hypoglycemia during resuscitation |
| **Won't Stop Vomiting** | 2-year-old male | Hypovolemic shock, vomiting-induced electrolyte cascade | Wide-complex tachycardia from hypokalemia |
| **Can't Catch My Breath** | 8-year-old female | Status asthmaticus, respiratory failure recognition | Tension pneumothorax |

Each scenario covers 2 phases of escalating severity, 8–16 assessment items, 6–12 intervention choices, 4–8 lab panels, and 2–3 physiology deep dives with TLDR summaries.

---

## AI Scenario Builder

Instructors can generate custom scenarios by typing a brief description:

> *"4-year-old near drowning"*
> *"Newborn with cyanotic heart disease"*
> *"12-year-old bike crash with head injury"*
> *"Toddler who drank grandma's metformin"*

The AI researches current clinical guidelines, then generates a complete scenario with:
- Age-appropriate vital sign ranges
- Weight-based medication dosing from PALS/NRP guidelines
- Internally consistent lab progressions
- Real pathophysiology and receptor pharmacology
- Curveball events (optional)
- Full debrief with physiology explanations

Custom scenarios can be shared with students via link.

**Clinical Disclaimer:** AI-generated scenarios are flagged as such and include a disclaimer that they should be verified against current guidelines before use in formal instruction. Built-in scenarios are marked "Clinically Reviewed."

---

## Technical Details

- **Platform:** Web app (React) — works on any device with a browser
- **Hosting:** Vercel (cloud-hosted, no maintenance required)
- **Cost to students:** Free. No account required. No downloads.
- **Cost to institution:** None for built-in scenarios. Custom scenario generation costs ~$0.05–0.10 per scenario via API.
- **Data privacy:** No student data is collected or stored server-side. Progress is stored locally on each student's device only.
- **Accessibility:** Mobile-first responsive design, works on phones and tablets

---

## Potential Use Cases

1. **Pre-clinical preparation** — Students practice pattern recognition before entering clinical rotations
2. **Supplemental sim lab training** — Unlimited repetitions between scheduled sim lab sessions
3. **NCLEX preparation** — Pediatric emergency content aligned with exam competencies
4. **Orientation for new hires** — Pediatric units can assign scenarios as onboarding material
5. **Continuing education** — Low-cost, self-paced refresher for experienced nurses
6. **Instructor-led sessions** — Project on a screen, work through scenarios as a group discussion
7. **Custom curriculum alignment** — Build scenarios that match specific course objectives

---

## Collaboration Opportunities

I built Block Ward because I saw the gap between what nurses need to know and how they currently learn it. As a pediatric rapid response nurse, I respond to the emergencies this app simulates. The scenarios are drawn from real clinical patterns.

I'm looking for partners who can help:

- **Validate and expand** the built-in scenario library with subject matter expertise
- **Pilot the app** in nursing education programs and measure learning outcomes
- **Integrate Block Ward** into existing curricula as a supplemental training tool
- **Provide feedback** on clinical accuracy, educational value, and usability
- **Co-develop** new features (progress tracking, cohort management, additional specialties)

Block Ward is currently a solo project. With the right partners, it could become a standard training tool for pediatric nursing education — accessible to every student, not just those at institutions that can afford high-fidelity simulation.

---

## About the Creator

**Sebastian J. Heredia, BSN-c, RN**
Pediatric Rapid Response Nurse, UNC Children's Hospital
Co-founder, Selah Innovations LLC

Sebastian combines frontline pediatric critical care experience with technical skills in software development and medical device design. He holds a BA in Biology from UNC Chapel Hill and is completing his BSN at UNC Wilmington. He has completed NSF I-Corps, the Andrews Launch Accelerator at NC State, and is an NC IDEA MICRO grant recipient.

---

## Try It Now

**[blockward-lovat.vercel.app](https://blockward-lovat.vercel.app)**

No account needed. Open on any device. Start with "The Fussy Infant" — it takes about 15 minutes.

---

*For questions, collaboration inquiries, or feedback:*
*Sebastian J. Heredia — [contact information]*
