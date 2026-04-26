# Phase 2 Resume — picked up mid-Checkpoint 4

Interrupted to restart Claude Code with `--dangerously-skip-permissions`. This document captures exact state so the next session can resume without re-reading everything.

## Repo state at save

- **Last committed (clean):** `dd74909` — end of Checkpoint 3
- **Branch:** `main`, 8 commits ahead of origin (don't push — user reviews manually)
- **Untracked files on disk:**
  - `AUDIT.md` — from Phase 0 (leave alone)
  - `PHASE2_LOG.md` — running log, contains entries for CP 1, 2, 3. Append to it, don't rewrite.
  - `src/components/shared/TextBlock.jsx` — extraction of App.jsx lines 7-20 (pre-CP4). Already has `export` prefix. No imports needed.
  - `src/components/player/icons.jsx` — extraction of App.jsx lines 21-48 (ToolIcon + MedIcon), with lucide imports prepended.
  - `src/components/player/VitalsDisplay.jsx` — extraction of App.jsx lines 85-115 (ecgPt + plPt + Monitor, renamed Monitor → VitalsDisplay). Has `useRef`/`useEffect` React import.
  - `src/components/player/SignCard.jsx` — extraction of App.jsx lines 116-124.
  - `src/lib/scenarios/age.js` — extraction of App.jsx lines 49-84 (guessAge + guessSex), exported.

**App.jsx has NOT been edited at CP4 yet — the originals are still there. The 5 new files are duplicates until App.jsx is trimmed and wired to import them.** No verification has run. No CP4 commit exists.

`npx vite build` currently passes because App.jsx is unchanged and the new files are not yet imported anywhere.

## What Checkpoint 4 still needs to do

Still to create (in order):
1. `src/components/player/LabPanel.jsx` — extract App.jsx lines 170–210. Has one `useState`. Inline SVG, no lucide.
2. `src/components/player/BodySystemsView.jsx` — extract App.jsx lines 125–169. Lucide imports: Brain, Heart, Wind, Droplets, Shield, Gauge, Eye, Search.
3. `src/components/player/PatientSVG.jsx` — extract App.jsx lines 211–457 (247 lines of SVG, no hooks, no lucide). Use sed to preserve string content verbatim.
4. `src/components/player/PatientView.jsx` — extract App.jsx lines 458–475. Imports PatientSVG and SignCard.
5. `src/components/player/ActionPanel.jsx` — extract App.jsx lines 476–521. Imports: TOOLS, MEDS from `../../lib/scenarios/builtIn.js`; `computeActionScore` from `../../lib/scenarios/scoring.js`; `ToolIcon`, `MedIcon` from `./icons.jsx`; `TextBlock` from `../shared/TextBlock.jsx`; lucide `Check, X, Minus`. Has two `useState`.
6. `src/components/player/AssessPanel.jsx` — NEW, not a direct copy. Carve out the `stage==="assess"` branch from `ScenarioPlayer` (currently around line 568 in App.jsx; search for `stage==="assess"&&(function()`). Pass the renderItem body and the mini-SVG switch through as internal code. Props it needs: `ph`, `vit`, `curSigns`, `curLabs`, `flags`, `showFb`, `submit`, `afterA`, `flag`.
7. `src/components/player/Debrief.jsx` — NEW. Carve out the `stage==="debrief"` branch (lines around 590-680 in App.jsx; big block starting `if(stage==="debrief"){`). Props: `sc`, `score`, `ageG`, `sexG`, `onDone`, `onExit`.
8. `src/components/player/ScenarioPlayer.jsx` — move the ScenarioPlayer function into its own file. Import everything above. Keep the shell + intro/phase/act/cb-alert/cb-act/recovery stages inline in this file. The whole ScenarioPlayer file may be 300–400 lines.

Then in App.jsx:
- Remove lines 7-521 (all the components being extracted) and 522-827 (ScenarioPlayer).
- Add imports for ScenarioPlayer and anything else App still references.
- App.jsx should shrink dramatically (target ~400-500 lines after CP4, down from 1126).

## Verification gate for Checkpoint 4

Per the Phase 2 brief (rules 2a-e):
- (a) `npx vite build` must exit 0
- (b) All files listed in target structure for CP4 must exist
- (c) Grep App.jsx for the moved function names (`^function Monitor|SignCard|BodySystemsView|LabPanel|PatientSVG|PatientView|ActionPanel|ScenarioPlayer|TextBlock|ToolIcon|MedIcon|guessAge|guessSex|ecgPt|plPt`) — should be empty
- (d) All new import paths resolve
- (e) App.jsx line count must decrease (currently 1126)

If any gate fails, follow rule 3: write `PHASE2_STOPPED.md` with details, revert uncommitted changes, stop.

## Nine checkpoints total

1. ✅ foundation pure extractions — commit `0d45db2`
2. ✅ Zustand stores + initial wiring — commit `3a7beca`
3. ✅ migrate remaining App state to stores — commit `dd74909`
4. 🔄 **IN PROGRESS** — extract player components (5 files on disk uncommitted; ~7 more to create; App.jsx trim not done)
5. extract scenario list (`ScenarioCard.jsx`, `ScenarioList.jsx`, `BuiltInBadge.jsx`)
6. extract builder (`BuilderForm.jsx`, `BuilderPreview.jsx`, + `lib/ai/prompt.js`, `lib/ai/client.js`)
7. extract shared + dedupe modals (`ConfirmModal.jsx` replaces the delConfirm + clearConfirm markup duplication; `Toast.jsx`)
8. extract hooks (`hooks/useScenarios.js`, `useProgress.js`, `useScoring.js`)
9. final trim — App.jsx < 300 lines, last cleanup

## Known-to-watch issues noted during CP1-3

- Setter refs pulled from `usePlayerStore.getState()` at render time; zustand v5 action identities are stable so this is safe. Don't change without a reason.
- Duplicate `?shared=` toast preserved exactly — fires on both first-add and repeat-add (original buggy-but-intended behavior).
- Small, code-style preference from Sebastian: no arrow functions in JSX attributes, no template literals, inline styles. Follow throughout.
- The "scoping message" referenced in the Phase 2 brief does not exist in the message history. Each checkpoint name + target structure is the plan. See `PHASE2_LOG.md` pre-start notes.

## If in doubt

Look at `PHASE2_LOG.md` first — chronological record of what's been done and why. Then the last commit (`dd74909`) shows the full state of App.jsx as of end-of-CP3.
