# Phase 2.5 Log

One entry per shipped issue. Running autonomously per the brief.

## Issue 8 — debrief review restructure — ✅

- **Files:** `src/stores/playerStore.js`, `src/components/player/ActionPanel.jsx`, `src/components/player/ScenarioPlayer.jsx`, `src/components/player/Debrief.jsx`
- **Data tracking additions:**
  - `playerStore.assessHistory[]`: snapshot of each phase's assess items + userFlagged state at submit time.
  - `playerStore.actionHistory[]`: snapshot of each phase's tools/meds/actions/sel at intervention completion (including skip).
  - `recordAssess` / `recordAction` mutators; both reset on `start()`.
- **ActionPanel:** `onDone` and `onSkip` now pass `sel` back as the last argument so ScenarioPlayer can record it. No regression — the existing caller-ignored-sel pattern still works because ActionPanel computes score before handing off.
- **Four collapsible debrief subsections (reuses existing collapsible pattern):**
  - **Findings You Caught** (green, Check icon) — items where `userFlagged === bad`. Shows label + phase + optional why.
  - **Findings You Missed** (red, Search icon) — items where correct answer was missed. Annotated with a specific note describing the miss direction ("did not flag" vs. "flagged within-normal").
  - **Interventions** (teal, Zap icon) — required interventions sorted by priority with chosen/not-chosen indicator. A secondary "Picks that were not indicated" list in orange for wrong selections.
  - **Outcome** (yellow, Trophy icon) — renders `sc.stabilizationSummary` (falls back to `sc.debrief.summary`).
- **Single-open behavior preserved:** all four sections share the existing `expI` state slot.
- **Build:** passes.
- **Notes:**
  - Dropped the unused `reviewSteps[]` flat-list variable.
  - Top-of-debrief summary paragraph kept because it functions as scenario intro/context. Outcome collapsible shows the more specific `stabilizationSummary`.
  - Legacy scenarios with no history (if someone loads a dashboard with stale state) will show empty subsections gracefully — each one has `length > 0` guards.

---

## Issue 7 — reassessment stage + stabilizationSummary — ✅

- **Files:** `src/lib/scenarios/schema.js`, `src/lib/scenarios/builtIn.js`, `src/lib/ai/prompt.js`, `src/components/player/ScenarioPlayer.jsx`
- **Schema:**
  - Added `Reassessment` typedef `{narrative, vitals, signs?}`.
  - Added optional `reassessment` and `stabilizationSummary` to `Scenario`.
- **Built-ins:** SC1/SC2/SC3 now carry clinically-trending reassessment vitals (HR down, cap refill back to normal, mental status improved per scenario) + stabilizationSummary paragraphs that name specific interventions.
- **New stage:** `reassess`, inserted between act/cb-act and recovery.
  - Left column: VitalsDisplay(reassessment.vitals) + BodySystemsView(reassessment.signs) when available.
  - Right column: narrative in a glass card + Continue button.
  - Back button disabled on reassess (going back to act after scoring would be weird).
- **Recovery screen:**
  - Post-intervention vital chips pull from `reassessment.vitals` first, falling back to norm midpoints. No more generic "99%" for everyone.
  - The old "All interventions complete. Patient is resting comfortably." is replaced by `sc.stabilizationSummary` (verbatim) in a bordered panel. Falls back to the old line if the field is missing.
- **Prompt:** REASSESSMENT AND STABILIZATION block mandates both fields; JSON skeleton includes placeholders.
- **Build:** passes (1779 modules, 811 ms). Initial commit had a prompt parse error from unescaped inner quotes; amended immediately.

---

## Issue 6 — Back + Skip-to-Next navigation — ✅

- **Files:** `src/stores/playerStore.js`, `src/components/player/ActionPanel.jsx`, `src/components/player/ScenarioPlayer.jsx`, `src/components/player/Debrief.jsx`
- **Back button:**
  - Compact "< Back" button in the top bar, next to Exit. Hidden on intro/debrief/recovery.
  - Hardcoded previous-stage map: `phase→intro`, `assess→intro` (post-Issue-2 skip), `act→phase`, `cb-alert→act`, `cb-act→cb-alert`.
  - Per the brief, Back is a visual rewind only — does not restore pi/flags/vitals/score. Going Back then forward again may surface odd state; acceptable for 2.5.
- **Skip to Next (ActionPanel):**
  - Button appears only while `!allF` (before user has selected all correct actions). Once all correct are picked, Continue takes its place.
  - On skip, `computeActionScore(tools, meds, actions, sel)` is called with the partial selection — `shouldPick === !!sel[id]` naturally counts missed correct actions as wrong.
  - Missed correct tool/med labels are pushed to `playerStore.skippedActions` with the phase name.
- **Debrief:** yellow "You skipped these interventions:" list shown just above the Back to Dashboard button when `skippedActions.length > 0`.
- **Player store:** `skippedActions: []` in initial state + reset via `start()`, `addSkipped(items)` mutator.
- **Build:** passes.

---

## Issue 5 — patient name diversity — ✅

- **Files:** `src/lib/ai/client.js`
- **Changes:**
  - The system prompt already got a PATIENT NAME DIVERSITY section in Issue 1's update (forbids Marcus/Sarah/John defaults, asks for culture/gender variation).
  - Added a per-request hint appended to the user message: "Name hint: choose a patient name starting with the letter X. Vary across cultures and genders. Do NOT use Marcus, Sarah, or John." X is drawn uniformly from 24 letters (skipping Q and X — rare initial sounds).
  - Keeping it as a hint (not a hard constraint) lets the model pick a culturally-appropriate name in that letter space rather than a forced one.
- **Build:** passes.
- **Notes:**
  - The prompt cache (if ever enabled) will cache the system prompt only — the user message with the hint varies per request so nothing blocks cache reuse.
  - Verification is manual (generate a few scenarios and observe names). A unit test would require a mock or live call.

---

## Issue 4 — AI response validation — ✅

- **Files:** created `src/lib/ai/validate.js`, modified `src/lib/ai/client.js`, `src/App.jsx`
- **Exports:**
  - `validateSchema(sc)` — returns array of error strings for missing required fields. Used as a hard gate in `generateScenario`.
  - `validateConsistency(sc)` — walks every `assessItem` with `bad:true` and a numeric label + a parseable threshold in `why`. Returns warning objects `{itemId, label, phase, message}` when value does not violate threshold.
- **Parsing heuristics:** regex-based. Label patterns handle "HR N", "SBP N", "BP N/N", "SpO2 N%", "Lactate N mmol/L", "Temp N C". Threshold patterns handle "normal A-B", "below/above N", "minimum/maximum threshold of N", "critical <N".
- **Integration:** `generateScenario` throws on schema errors with specific field names. Attaches consistency warnings to `scenario._warnings` and console.warn's each. App.jsx `addCustom` surfaces "N content warnings - see console" toast when warnings are attached.
- **Smoke test:** Sebastian's case ("SBP 82 falls below threshold of 80") flagged — warning surfaced. Counter-example (SBP 78 with same why) correctly not flagged.
- **Build:** passes.
- **Limitations / follow-ups:**
  - Threshold parser is regex-based and imperfect. It won't catch thresholds stated in free prose like "This infant has a heart rate that should not exceed 160" (no numeric extraction). It's aimed at catching the structured patterns the AI actually tends to produce.
  - Vitals in `phase.vitals` (not inside assessItems) are not validated against norms. Could extend by comparing `phase.vitals.sbp` to `norms.sbp` range and flagging mismatches between `bad:true` assessItem status and the underlying vitals.
  - Warnings surface as a vague toast ("see console") — adequate for a developer/review workflow but not for end users. Could swap for an inline warnings banner on the builder preview.

---

## Issue 3 — declutter post-Assess + mobile polish — ✅

- **Files:** `src/components/player/AssessPanel.jsx`, `src/components/player/LabPanel.jsx`
- **Changes:**
  - Flag section headers switched from h3 text ("Flag Abnormal Vital Signs:") to compact color-coded pill badges labeled "Vital Signs" / "Lab Values" / "Clinical Findings".
  - Pre-submit progress strip added ("Tap items you think are abnormal · N flagged"), gives user feedback on state before submitting.
  - LabPanel grid collapses from 2 columns to 1 column at widths below 400 px via a scoped inline media query. At 390 px the 2-col layout was too cramped for labs like "Lactate 5.8 mmol/L".
- **Mobile stacking:** bw-split flex-direction stays column at < 768 px. Monitor on top, findings below, flag sections below that. No flow change needed.
- **Build:** passes.

---

## Issue 2 — EMS report on pre-assess screen — ✅

- **Files:** `src/lib/scenarios/schema.js`, `src/lib/scenarios/builtIn.js`, `src/lib/ai/prompt.js`, `src/hooks/useScenarios.js`, `src/components/player/ScenarioPlayer.jsx`
- **Schema:** added optional `emsReport` and `learnMore` at scenario root (not per-phase — this is scenario-level).
- **Built-ins:** each of SC1/SC2/SC3 now has an emsReport describing arrival mode and prior interventions, plus a learnMore paragraph with guideline-level context.
- **UI changes:**
  - Intro screen labels the handoff prose as "EMS Report" and renders `sc.emsReport` (falls back to `patient.history` for legacy scenarios).
  - Learn More button appears only when `sc.learnMore` exists. Opens a themed Modal.
  - Phase screen stripped: PatientView renders with `signs={[]}`, no BodySystemsView, no LabPanel. Still shows the phase narrative (for between-phase transitions) + VitalsDisplay.
  - "Assess Vitals" button renamed to "Assess" (both on phase screen and intro).
  - Intro button now skips phase screen when phase 0 has assessItems — transitions intro → assess directly (common case). Falls back to phase → act for intervention-only first phases.
- **Prompt:** added EMS REPORT + LEARN MORE sections. Explicitly forbids pathophysiology or assessment findings in emsReport.
- **Build:** passes (1779 modules, 641 ms).
- **Notes:**
  - The phase screen still exists because intermediate phase transitions (after assess → next phase) need a brief "something changed" narrative + updated vitals. Users won't see it for phase 1 (direct skip); they'll see it entering phase 2.
  - Legacy `sc.patient.history` is still shown on the intro via fallback when emsReport is missing — keeps old AI-generated scenarios working.

---

## Issue 1 — split findings from pathophysiology — ✅

- **Files:**
  - created: `src/components/shared/Modal.jsx`, `src/components/shared/WhyModal.jsx`
  - modified: `src/lib/scenarios/schema.js` (JSDoc), `src/lib/scenarios/builtIn.js` (field rename + new why entries), `src/lib/ai/prompt.js` (new instructions), `src/hooks/useScenarios.js` (minifier field list), `src/components/player/{SignCard,BodySystemsView,LabPanel,AssessPanel,Debrief}.jsx`
- **Schema changes:**
  - `sign.detail` → `sign.finding` (objective content only). Sign also gets optional `sign.why`.
  - `lab.explain` → `lab.why` (rename for consistency; labs already had the field semantically, just under a different key).
  - `assessItem.why` unchanged structurally, but UI no longer dumps it inline after submit — it lives behind a Why? button now.
- **Built-ins updated:**
  - SC1 (fussy-infant): triage — flushed skin, flat fontanelle; escalation — mottling, pulses, cool extremities.
  - SC2 (vomiting-toddler): triage — skin turgor, fontanelle; escalation — mottling, urine output, mental status.
  - SC3 (asthma-crisis): triage — tripoding, audible wheeze, short speech; escalation — accessory muscle use, quiet chest, CO2-narcosis mental softening, loss of tripoding.
  - All retained existing `assessItem.why` rationales, which are still only revealed after submit (now behind a Why? button on each item instead of inline).
- **UI behavior:**
  - Sign cards (left/right of patient) show label + finding; if `why` exists, a compact Why? pill appears on the same row and opens WhyModal on tap.
  - BodySystemsView adds the same Why? pill next to each finding.
  - LabPanel dropped the tap-entire-card pattern for a Why? pill on each critical lab with a `why` field. Non-critical labs with `why` also get the pill, tinted teal.
  - AssessPanel: post-submit no longer renders the full rationale inline — correct/incorrect icon + Why? pill. Clicking Why opens a themed modal (green for correct, red for incorrect).
  - Debrief: Lab Review block reads `lab.why` (renamed).
- **Build:** passes (1779 modules, 607 ms).
- **Notes / follow-ups for Sebastian:**
  - `lab.explain` → `lab.why` is a breaking rename for any custom scenarios stored in localStorage from before Phase 2.5. A users' existing AI-built scenarios that use `explain` will silently render the lab card without a Why? button (no crash, just missing content). A `bw-custom` storage migration could be written if needed.
  - The AssessPanel button interaction was split into two regions (flag + Why?) to avoid a click-in-button-in-button DOM problem; visually the row looks the same but the inner label is now a button while the outer tile is a div.
  - Action feedback (`ActionPanel`) was intentionally not migrated to the Why? pattern. The current popup is already opt-in (user has to click the tool) and mixes objective description (`TOOLS[id].desc`) with pedagogy (`fb`). Moving `fb` behind a nested Why? would add friction inside an already-opt-in modal. If Sebastian wants this changed, small follow-up.
