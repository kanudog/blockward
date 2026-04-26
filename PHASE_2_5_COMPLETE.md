# Phase 2.5 — Complete

Autonomous execution of Sebastian's 8-issue UX + pedagogy fix list. One commit per issue, 8 total, all on `main`. All builds green.

## Commits

| Issue | Commit  | Summary                                         |
|-------|---------|-------------------------------------------------|
| 1     | e8bd2db | split findings from pathophysiology             |
| 2     | c532346 | EMS report + Learn More on pre-assess screen    |
| 3     | 223f588 | declutter post-Assess layout + mobile polish    |
| 4     | 9731bfb | AI response validation                          |
| 5     | 3e4c2ea | patient name diversity                          |
| 6     | 48757c3 | Back and Skip-to-Next navigation                |
| 7     | fea2c2f | reassessment stage + stabilizationSummary       |
| 8     | 79d3071 | restructure debrief review                      |

## Schema changes

- **`sign.detail` → `sign.finding`** (objective content only).
- **`sign.why`** — new optional field for pathophysiology; surfaced via Why? button.
- **`lab.explain` → `lab.why`** — renamed for consistency across signs / labs / assess items.
- **`sc.emsReport`** (new, optional) — 2-4 sentence clinical handoff shown on the pre-assess screen.
- **`sc.learnMore`** (new, optional) — background/context paragraph shown behind a Learn More modal.
- **`sc.reassessment`** (new, optional) — `{narrative, vitals, signs?}` post-intervention snapshot shown on a new `reassess` stage.
- **`sc.stabilizationSummary`** (new, optional) — 2-3 sentence specific recap shown verbatim on the stabilization screen.

## Built-ins updated

All three built-in scenarios (`SC1`/`SC2`/`SC3`) got:
- `why` pathophysiology added to teaching-worthy signs (2-4 per scenario).
- `sign.detail` → `sign.finding` field rename.
- `lab.explain` → `lab.why` field rename.
- New `emsReport` block — clinical handoff prose.
- New `learnMore` block — guideline-level background.
- New `reassessment` block — clinically-accurate post-intervention trends (HR back down, cap refill normal, mental status restored per scenario).
- New `stabilizationSummary` paragraph naming which interventions addressed which problems.

Scenario-specific additions:
- **SC1 (fussy infant / sepsis):** why entries on mottling, pulses, cool extremities, flushed skin, flat fontanelle. Reassessment trends HR 192→150.
- **SC2 (vomiting toddler):** why entries on skin turgor, sunken fontanelle, mottling, anuria, mental status. Reassessment HR 172→130.
- **SC3 (asthma):** why entries on tripoding, audible wheeze, short speech, accessory muscles, quiet chest, CO2-narcosis softening, loss of tripoding. Reassessment HR 145→118.

## Behavioral changes users will notice

- **Pre-assess screen** is now a clinical handoff: patient identity + EMS Report + optional Learn More button. The walls of findings are gone — those now live on the Assess screen where the user interacts with them.
- **Assess button** is now labeled "Assess" (was "Assess Vitals"). Clicking it goes straight from intro → assess for typical scenarios.
- **Every clinical finding card** shows only the objective finding by default. A compact **"Why?"** pill appears next to items with pathophysiology, opening a themed modal.
- **Critical labs** no longer have their tap-entire-card expansion. Each critical lab shows a Why? button for on-demand rationale.
- **Assess feedback** no longer dumps rationale inline after submit. Correct/incorrect icon only; Why? button opens a rationale modal (green or red depending on correctness).
- **Action popup** (tapping a tool or med) is unchanged — it was already opt-in.
- **Back button** appears in the top-left on every screen except intro / recovery / debrief.
- **Skip to Next** button appears on every ActionPanel while the user has not selected all correct actions. Skipping records missed correct actions as wrong, saves a list of skipped interventions, and proceeds. Debrief shows a yellow "You skipped these:" list.
- **Post-intervention screen** is now two steps: a clinical reassessment (updated vitals + narrative + brief signs), then the celebration + stabilization summary. The old "All interventions complete. Patient is resting comfortably." filler is replaced by `sc.stabilizationSummary`.
- **Debrief review** is restructured into 4 collapsible subsections: Findings You Caught / Findings You Missed / Interventions / Outcome — driven by actual user history (what they flagged, what they selected) instead of the old flat content dump.
- **Scenario generation** includes a random letter hint to diversify patient names; the prompt explicitly forbids defaulting to Marcus/Sarah/John.
- **Scenario generation** also triggers a validator — if the AI produces a scenario where a flagged-abnormal value does not actually violate its stated threshold (the SBP 82 bug), a toast warns the user to check the console.

## Places where the AI prompt may need further tuning

- The **new `finding` vs. `why` split** is a significant prompt change. The AI might still occasionally mix mechanism into `finding` strings — monitor output over the next few generations and add harder examples if violations appear.
- **Reassessment content** is now required. If the AI partially generates it (e.g., narrative but no vitals), the reassess stage will fall back to the current vitals which may be stale. Consider adding validation for reassessment.vitals presence (similar to Issue 4's schema validator).
- **stabilizationSummary** must name specific interventions. If the AI produces generic stabilization text ("Patient improved") the verbatim-rendering will feel flat. Prompt example given; quality depends on model adherence.
- **`learnMore`** is optional. AI may over-use it for every scenario (bloating the generated JSON) or never use it. Monitor initial output.
- **Patient name** hint currently uses 24 letters uniformly. If you observe skewed output, weighting could be tuned by region or scenario type.
- **Threshold-consistency validator** parses a limited set of regex patterns. If the AI produces thresholds in forms the parser doesn't recognize (e.g., "exceeds the 90th percentile"), false-negative rate is high. A follow-up would be to let the validator query `sc.norms` directly when assessItem labels match known vital keys (HR/SBP/RR/SpO2/temp).
- **`visuals[]` keywords** are still undocumented in the prompt (pre-existing Phase-0 audit item). Unchanged in 2.5.

## Follow-ups surfaced during this work

- **ActionPanel did not migrate to the Why? pattern.** The action popup already opts into pedagogy via a click, but it mixes objective `desc` with teaching `fb` in one popup. Could split further in a future pass.
- **`lab.explain` → `lab.why` is a breaking rename** for any custom scenarios already in localStorage from before 2.5. Legacy lab entries will silently render without a Why? button (no crash, just missing content). If this affects existing users a migration pass in `useScenarios.hydrate` can rename legacy fields.
- **Back navigation does not restore `pi` / `flags` / `vitals` / `score` state.** Per the brief, Back is a visual rewind only. If the user Backs then forwards again, some assess flags may look stale. Sebastian specifically scoped this as acceptable.
- **Reassessment stage has no Back button.** Going back to act after scoring would produce confused state; kept explicitly null.
- **`sc.stabilizationSummary`** now duplicates **`sc.debrief.summary`** topically on the debrief screen. I kept both: top summary is scenario-objective context; Outcome collapsible is specific clinical recap. If Sebastian wants to pick one, drop either the top summary paragraph or the Outcome subsection.
- **Validator warnings UX is minimal** — a toast saying "N content warnings - see console." For an end-user UI, replace with an inline banner on the dashboard listing scenarios with warnings.
- **`Search` lucide icon** stays in Debrief imports even after the reviewSteps block removal (now used by Findings You Missed header).
- **Mobile stacking** has not been tested on actual 390px devices for the new reassess screen. The existing `.bw-split` column layout should work but worth a manual check.

## Files touched

- `src/lib/scenarios/schema.js`
- `src/lib/scenarios/builtIn.js`
- `src/lib/ai/prompt.js`
- `src/lib/ai/client.js`
- `src/lib/ai/validate.js` (new)
- `src/hooks/useScenarios.js`
- `src/stores/playerStore.js`
- `src/components/shared/Modal.jsx` (new)
- `src/components/shared/WhyModal.jsx` (new)
- `src/components/player/SignCard.jsx`
- `src/components/player/BodySystemsView.jsx`
- `src/components/player/LabPanel.jsx`
- `src/components/player/AssessPanel.jsx`
- `src/components/player/ActionPanel.jsx`
- `src/components/player/ScenarioPlayer.jsx`
- `src/components/player/Debrief.jsx`
- `src/App.jsx`

## Build

Final: **1779 modules** transformed, clean build.

Nothing pushed. Ready for Sebastian's review and manual push.
