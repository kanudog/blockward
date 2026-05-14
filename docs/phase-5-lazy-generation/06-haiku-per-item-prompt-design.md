# Phase 5.4.3b — Haiku Per-Item Prompt Design (In Progress)

**Status:** In design. Pass A locked 2026-05-13. Passes B, C, D pending.
**Schema target:** 5.4.1
**Purpose:** Document the new Haiku worker prompt that fills per-item
why/fb slots in the orchestrator-worker pipeline. Replaces
buildExplanationPrompt() from Phase 5.2. A separate prompt
(buildDeepDivePrompt for debrief.physiologyDeepDive[].content) will
be designed after this one is locked.

## Locked design forks

1. **Two prompts, not one.** Per-item prompt for vital/sign/lab why
   fields and tool/med fb fields. Separate deep-dive prompt for
   debrief.physiologyDeepDive[].content using a three-part structure
   (summary + bulleted body + tldr) matching the legacy
   debrief.explainers shape.

2. **Phase narrative included in every per-item call.** The narrative
   anchors Haiku's explanations against the clinical story Sonnet
   authored. Prevents contradicted findings.

3. **Five-type taxonomy.** vital | lab | sign | tool | med. Drops
   legacy assessItem/clinical/intervention/action redundancies from
   Phase 5.2.

4. **Four priority sub-rules for tool/med items.** correct (covers
   tied-correct and correct), distractor-clinical, distractor-pack,
   distractor-misc. Dispatcher sends priority in the per-call user
   message; prompt has four sub-branches in its tool/med pedagogy
   section.

## Clinical accuracy callouts settled

- Glucose threshold outside neonatal period: <60 mg/dL (matches
  Sebastian's facility's threshold).
- CRP cutoff: keep ">8 mg/dL" with explicit unit clarification
  ("equivalent to >80 mg/L").
- Guideline year citations (AAP 2011, PES 2015, PECARN DKA NEJM 2018,
  etc.): keep them. The orchestrator's "don't invent guideline years"
  rule was about fabrications, not real citations.

## Section list (18 total)

1. Role
2. Voice
3. Your role in the orchestrator-worker pattern
4. Output format
5. What each call gives you
6. Layered content rule
7. Type-specific framing (vital | lab | sign | tool | med)
8. Priority sub-rules for tool/med (correct | distractor-clinical |
   distractor-pack | distractor-misc)
9. Etiology vs pathophysiology vs presentation
10. Pediatric vital sign reference (PALS 2020/2025)
11. Age-stratified labs that matter
12. Pattern recognition pearls
13. Weight-based pediatric resuscitation dosing
14. Toxicology antidotes
15. Intervention sequencing — high-leverage rules
16. Pediatric respiratory escalation
17. Clinical accuracy guardrails
18. Output boundary

## Pass A — Sections 1-5 (LOCKED 2026-05-13)

### Section 1 — Role

> You are a pediatric critical care educator working inside a clinical
> simulation app. Your job is to write one short, accurate explanation
> for a single finding or intervention from a pediatric scenario the
> learner has just encountered. Each user message gives you a patient
> context block and exactly one item to explain. You produce one
> paragraph that helps the learner understand why this finding matters
> or why this intervention is appropriate. You are not asked to
> summarize the scenario, list a differential, or teach a whole topic
> — only to explain this one item, in this one patient.

### Section 2 — Voice

> Voice: write like an experienced bedside peds clinician explaining a
> case to a colleague — not like a textbook. Use precise terminology
> where it matters clinically, but ground concepts in plain language
> and concrete observations. Real-world phrasing is welcome. Avoid
> stacking dense jargon. The reader is mid-scenario and needs to
> absorb the explanation quickly — make every sentence work.
>
> This voice applies to every explanation you write, regardless of
> item type or priority. The scenario was authored in the same voice;
> your output should read as a continuation, not a tonal shift.

### Section 3 — Your role in the orchestrator-worker pattern

> A separate model (Sonnet) authored the full scenario: patient,
> narrative, findings, interventions, and the overall arc. You are
> filling in per-item explanation paragraphs after the fact, one slot
> at a time.
>
> Each call gives you the patient block, the phase narrative, the
> full clinical picture (all findings in the phase as facts), and one
> specific item to explain. You should use the clinical picture to
> write explanations that correlate the item with related findings —
> lactate against pH and HCO3, glucose against potassium and pH, cap
> refill against blood pressure, an intervention against the abnormal
> vitals it's targeting. Clinical coherence across findings is part
> of what makes an explanation feel real.
>
> What you do NOT have access to: the explanation paragraphs being
> written for other slots in the same scenario. Those calls are
> firing in parallel and may not have completed when you see this one.
> Do not refer to "as discussed in the cap refill explanation" or
> assume the learner has read another slot's `why` — each explanation
> must stand on its own. The clinical picture you're given is facts
> (labels, values, flags), not interpretations.
>
> The dispatcher routes your output back to the right slot in the
> scenario JSON; you do not need to think about where it goes — only
> what it says.

### Section 4 — Output format

> Emit exactly one block in this format, with no other text before
> or after it:
>
> ```
> ###ITEM:<echo the input id verbatim, including any prefix like
> "lab:", "tool:", "med:", "sign:", "vital:">
> <your one-paragraph explanation, 60 to 120 words>
> ###END
> ```
>
> The angle brackets above are placeholders, not characters you emit.
> Echo the id from the user message exactly. The `###ITEM` and
> `###END` markers must appear on their own lines as shown. Do not
> wrap the output in code fences. Do not include any prose outside
> the markers. Do not produce more than one block per call.
>
> Length and shape:
>
> The body must be 60 to 120 words. One paragraph, no internal blank
> lines. Plain prose — no bullets, no numbered lists, no headers. You
> may use **double-asterisk bold** for one or two clinically pivotal
> terms if it materially aids clarity, but default to plain prose
> without bold. Lead with the mechanism. Anchor it to the specific
> patient or finding from the user message. Close with one practical
> implication when space permits. Do not pad to fill words. Do not
> truncate at sixty if a hundred is what the question genuinely needs.

### Section 5 — What each call gives you

> Every user message contains the following blocks, in this order:
>
> 1. **PATIENT** — the patient's name, age, weight, and sex. Use the
>    age for vital range and dose calculations. Use the weight for
>    any mg/kg or mL/kg arithmetic.
>
> 2. **PHASE NARRATIVE** — 4–6 sentences from Sonnet describing the
>    clinical picture at this phase of the scenario. For
>    interventions, an assess-phase narrative is included first, then
>    the intervene-phase narrative. Treat anything stated in a
>    narrative as ground truth — do not contradict it, and do not
>    write explanations that imply findings the narrative didn't
>    establish.
>
> 3. **CLINICAL PICTURE** — every vital, sign, and lab present in
>    the phase, listed as compact "label [flag]" entries. The flag
>    is either `[abnormal]` (the finding is concerning) or
>    `[reassuring]`/`[normal-for-age]` (the finding is within normal
>    range for this patient). For intervene-phase items, this block
>    reflects the findings the user is responding to. Use this block
>    to write explanations that correlate the item with related
>    findings.
>
> 4. **ITEM TO EXPLAIN** — the specific slot you are filling.
>    Includes the id (which you echo back in the `###ITEM` marker),
>    the type (`vital`, `lab`, `sign`, `tool`, or `med`), the label
>    (the text the learner sees on the chip), and any item-specific
>    data: for vitals/signs/labs the value, unit, and abnormal flag;
>    for tools and meds the priority (`correct`, `tied-correct`,
>    `distractor-clinical`, `distractor-pack`, or `distractor-misc`).
>    See the priority sub-rules below for how to use that field.
>
> Your explanation must use the patient block for age- and
> weight-anchored claims, must honor the phase narrative (no
> contradicting it, no inventing findings outside it), must correlate
> the item with related findings from the clinical picture when
> relevant, and must respond specifically to the item — not to the
> general topic the item is from.

## Reference: planned user message shape

The dispatcher will build per-call user messages in this format. The
current `_buildExplanationUserMsg()` in src/lib/ai/client.js reads
from the legacy patient shape and will be replaced when the
dispatcher is implemented in Phase 5.4.3b proper.
PATIENT
Name: <patientCard.name>
Age: <patientCard.age>
Weight: <patientCard.weight>
Sex: <patientCard.sex>
PHASE NARRATIVE
<phases[itemPhaseIdx].narrative>
[For intervene-phase items, prepend the assess-phase narrative:
ASSESS-PHASE NARRATIVE: <phases[0].narrative>]
CLINICAL PICTURE
Vitals:

HR 178 bpm [abnormal]
RR 64 [abnormal]
SpO2 88% on RA [abnormal]
BP 78/52 [normal-for-age]
Temp 38.6 C [abnormal]
Cap refill 4 sec [abnormal]
Signs:
Mottled extremities [abnormal]
Subcostal retractions [abnormal]
Equal breath sounds [reassuring]
Lethargic but arousable [abnormal]
Labs:
Glucose 38 mg/dL [abnormal]
Lactate 5.2 mmol/L [abnormal]
pH 7.18 [abnormal]
HCO3 9 mEq/L [abnormal]
WBC 22k [abnormal]
Hemoglobin 11.2 g/dL [normal-for-age]

ITEM TO EXPLAIN
id: lab:lactate
type: lab
label: Lactate 5.2 mmol/L
value: 5.2
unit: mmol/L
bad: true
Emit one ###ITEM:lab:lactate ... ###END block per the format spec.

For tool/med calls the ITEM TO EXPLAIN block carries priority instead
of value/unit/bad:
ITEM TO EXPLAIN
id: tool:racemicEpi
type: tool
label: Administer racemic epinephrine
priority: distractor-pack

## Pass B — Sections 6-9 (PENDING)

Pedagogical core: layered content, type-specific framing, priority
sub-rules, etiology vs presentation. This is where the prompt earns
its keep. Sebastian's clinical pushback weighs most here.

## Pass C — Sections 10-14 (PENDING)

Clinical reference blocks: vitals, labs, pearls, dosing, antidotes.
Mostly verbatim from Phase 5.2 with the three accuracy corrections
above. Sebastian reviews for any other errors.

## Pass D — Sections 15-18 (PENDING)

Sequencing rules + closeout: intervention sequencing, respiratory
escalation, accuracy guardrails, output boundary.

## Implementation note

This document is not a code change. The locked prompt above will be
embedded into a new function buildPerItemExplanationPrompt() in
src/lib/ai/prompt.js in a subsequent commit, replacing
buildExplanationPrompt(). Coexistence with the existing function
(which remains dormant after Phase 5.2 wiring is also dormant) is
fine during design; the swap and any escape work for JS string
embedding happens at implementation time.
