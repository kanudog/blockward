# Block Ward Handoff — 2026-06-12

Covers a long session: **Stage 3 (curveball) and Stage 3.5 (cross-check verifier)
shipped to `main`**, **Stage 4 (UI/design system) started** (design-token module +
dashboard restyle), and a **sanitized UI handoff bundle** produced for a separate
design-focused session. Read `docs/BLOCK_WARD_HANDOFF_2026-06-11.md` first (it points
to the 05-27 and 05-29 handoffs for tech-stack + working-relationship context); this
assumes them. The canonical `docs/BLOCK_WARD_HANDOFF.md` is deep background.

## Where the work lives

Everything is on `main` and pushed (auto-deploys to Vercel). Key commits:
- `1356b22` — Stage 3 curveball + Stage 3.5 cross-check verifier.
- the Stage 4 commit — "Midnight Neon" design tokens + dashboard restyle.
- the docs commit — this handoff + canonical pointer.

(Note: `1356b22`'s commit trailer was corrected this session from a wrong
"Claude Fable 5" co-author to "Claude Opus 4.8" — a one-commit message amend +
force-push. Nothing else in history changed.)

## Working relationship update

Sebastian **authorized direct pushes again this session** — Claude Code committed and
pushed the curveball/verifier commit and the Stage 4 commit directly. This continues the
06-11 shift away from the canonical doc's older "Claude Code never pushes" rule. Still:
he reviews, smoke-tests are the gate, clinical accuracy is paramount, code style is strict
(JS, no template literals, string `+` concat, no arrow fns in JSX attrs, inline styles,
`Object.assign`, plain `function` decls).

## Stage 3 — curveball (DONE, verified, shipped)

The builder's Curveball toggle now produces a real post-Round-2 beat for AI scenarios.
- **Generation:** `generateCurveball()` runs in the background *after* Round 2 merges,
  seeded with the evolved Round-2 state + the original brief (loyalty). `mergeCurveball()`
  installs `scenario.curveball`. New `buildCurveballPrompt()` derived from
  `buildOrchestratorBase()` via `_promptSwap` (clinical core verbatim). Deterministic
  `curveballTrigger` ∈ reactive|disease|random (reactive keys off *available* interventions,
  matching the locked Round-2 model — so it persists/replays).
- **Fill-plumbing gap fixed:** `parseSlotRefString` + `collectAllNullSlots` now handle
  `phase[curveball].*` (they didn't before — this was the real gap, not just the collector).
- **Player:** `afterAct` fires the existing `cb-alert`/`cb-act` path when `sc.curveball`
  exists; a "monitor alarming" **bridge** (`cb-wait`) covers the rare not-ready case; the
  curveball's must-haves now appear in the "What Saved This Patient" recap (badged).
- **Verified:** build clean; 3/3 live AI smokes (slot fill 25/25, 30/30, 24/25; coherent
  with the Round-2 deterioration); player path confirmed live (SC1 recovery + badge);
  independent peds-critical-care review found the Sonnet content + all doses **sound**.
- Files: `src/lib/ai/prompt.js`, `client.js`, `playerStore.js`, `explanationSlots.js`,
  `slotResolve.js`, `userMessages.js`, `dispatcher.js`, `components/player/ScenarioPlayer.jsx`.
  Spec: `docs/superpowers/specs/2026-06-11-curveball-stage3-design.md`.

## Stage 3.5 — Sonnet cross-check verifier (DONE; risk-reducer, not a guarantee)

The gating concern for the curveball was per-item `why`/`fb` **clinical drift** (the known
2026-05-29 gap, amplified by peri-arrest content). Built the deferred verifier.
- **What it does:** after the Haiku dispatcher fills a unit, one Sonnet pass
  (`src/lib/ai/verifier.js`, `buildVerifierPrompt`, `client.verifyExplanations`) reads the
  scenario's ground truth (narrative + teaches + tied-correct actions) and returns
  ok/repair/drop per item. **repair** = rewrite to match the case; **drop** = set `""`
  (non-null so it isn't re-collected/re-filled). Runs per unit via two new dispatcher hooks:
  `onWaveOneComplete` is now **awaited** so Phase 0 gates the Assess button on verify, and a
  new `onBeforeDeepDives` verifies Phase 1 / Round 2 / curveball before the learner reaches
  them. Locked decisions: repair-if-confident-else-drop; background pass that gates the first
  wave.
- **Verified (live):** on the cb1 content a reviewer rated UNSAFE (it diagnosed "right
  mainstem intubation" vs the correct tension-pneumothorax answer), the verifier repaired
  21–22/25 with doses/correct-content preserved + fixed a K⁺/acidosis inversion; on SOUND
  content (cb2) it left 27/30 ok (3 trivial edits) — it discriminates.
- **HONEST LIMITATION → tracked follow-up:** a *single pass* is a strong risk-reducer, **not
  100%**. A re-review of the repaired cb1 found 1–2 residual contradictions surviving inside
  an "either X or Y" differential or a trailing action clause; a prompt-tightening caught the
  either/or case but a trailing-clause miss still slipped. **The second pass / further tuning
  is tracked in `CODE_TODO.md` (2026-06-11 entry).** Also: the dispatcher↔playerStore verify
  hook wiring is build- + logic-verified but **not yet live-exercised end-to-end** — confirm
  with a curveball-ON AI generation (watch the `[verify] <unit>: checked/repaired/dropped`
  console logs + the Assess gate).
- Spec: `docs/superpowers/specs/2026-06-11-cross-check-verifier-design.md`.

## Stage 4 — UI / design system (STARTED)

- **Direction LOCKED:** "**C · Midnight Neon**" (near-black `#06080f`/`#0c1230` base, cyan
  `#34d3ee` + indigo `#818cf8` accents, frosted glass with a soft edge glow). Chosen from 3
  mockups in `design-notes/stage4-directions.html` (Sebastian also floated possibly wanting a
  **light-theme variant** later).
- **DONE:** `src/lib/design/tokens.js` — the shared design-token module (palette, `BG_APP`
  aurora gradient, glass recipe + `GLASS_CSS`, type, spacing, radii, motion + `glass()` /
  `chip()` / `cta()` / `statTile()` builders). Wired into the **dashboard** (`src/App.jsx`,
  `src/components/scenarios/ScenarioCard.jsx`). Verified live (`design-notes/stage4-dashboard.png`).
- **REMAINING rollout** (all pulling from the token module):
  1. **Player screens** + clear the open `DESIGN_TODO.md` items: opaque "Why?" popups with
     bordered buttons, ALL-CAPS bold system labels, uniform-white vitals, accent-colored bold
     terms in popups, the "tap each abnormal value" instruction line, the stretched VS-monitor
     on reassess, and surfacing the reassuring-"Why?" content.
  2. **Debrief** + the TL;DR expandable; **builder, modals, sidebar**.
  3. **Icons** — lab-tube / imaging icons in `visualMeta.js`.
  4. **Circular avatar-FACE card chips** — a face-only `PatientSVG` render mode (the bridge
     into Stage 5) replacing the emoji icons on every card.

## Stage 5 — avatar expansion (NOT started)

Propose a **menu first**, then build: new accessory/equipment keywords + cues, finer age
silhouettes, richer expressions, smarter auto-placement, and the **face-only render mode**
(which the Stage-4 card chips need — the natural first piece). Couple tightly with the
focused-exam redesign below.

## NEXT SESSION FOCUS (set 2026-06-12) — avatar-driven focused-exam + professional UI

The agreed next-session priority. Supersedes the old 06-11 "focused-exam" item AND the
`DESIGN_TODO.md` Phase-7 sign-flagging note. Two intertwined goals; **design before building** —
propose a plan + an animation "menu" + a 2D-vs-3D recommendation and let Sebastian approve first.

**A) Avatar-driven focused exam (the big overhaul).** Replace the current "select the abnormal
tile + flag it" assessment — it's ambiguous: findings are either trivially/obviously abnormal,
or one small abnormal detail is buried in a tile of otherwise-normal findings, so the user can't
tell whether to flag the tile. Instead: the generated avatar sits CENTER-STAGE with exam options
around it ("Check pupils", "Assess breathing/abdomen", "Inspect skin", "Check perfusion", …).
Clicking one ZOOMS the camera to that body region and plays a **scenario-specific animation of
the ACTUAL finding**, then a popup states the professional finding. Examples: head injury →
"Check pupils" zooms to the eyes, shows anisocoria (one pupil larger) + a spotlight light-sweep
pupillary-reaction exam, popup "right pupil 4 mm nonreactive, left 2 mm brisk"; "Assess
breathing/abdomen" zooms to the chest/abdomen, animates respiration at the SAME rate shown on the
VS monitor (faster if tachypneic) with retractions if present. **4–5 zoomed/animated exams per
generated scenario.** The user no longer gets right/wrong in the systems assessment — it becomes
an interactive way to perform the exam and see real findings, so the avatar plays a much bigger
role.

Forks to decide with Sebastian first:
- **2D-enhanced vs 3D avatar.** Likely needs 3D (the current avatar is 2D inline-SVG). No 3D lib
  installed; bundle ~313 KB gzip with no code-splitting → lazy-load three.js / react-three-fiber
  if we go 3D. Weigh 2D-enhanced (cheaper, keeps the LEGO charm) vs 3D and recommend.
- **Animation system:** a LIBRARY of pre-made exam animations loaded like the current accessory
  keywords (anisocoria, retractions, breathing-rate, cap-refill, rashes…) PLUS a custom/generated
  fallback for findings we haven't pre-made.
- **Schema + orchestrator:** the AI emits a per-exam descriptor (body region, animation + params
  like rate/retractions/pupil sizes, the popup text, numeric values), kept clinically accurate via
  the orchestrator + the new Sonnet verifier.
- **Scoring/flow:** how the assessment phase works without binary flagging.

**B) Professional UI pass (prioritize alongside A).** The app reads generic/dated (built a few
months ago). Make it look professionally made — readable fonts, professional color system, great
aesthetics, polished components. Stage 4 ("Midnight Neon" tokens) is started but only on the
dashboard; finish a cohesive professional look across the player/debrief screens and clear the
`DESIGN_TODO.md` items. Sebastian is open to refining the direction (possibly a light-theme
variant) — show options if the current direction doesn't read professional enough.

## UI handoff bundle (for a separate design-focused session)

`blockward-ui-handoff/` (+ `blockward-ui-handoff.zip`) — **gitignored** (so the do-not-share
key never hits the public repo). A **sanitized copy** of the simulation-screen UI for
context-clean visual work (incl. scoping a possible 3D avatar): presentational components,
`STACK.md`, `INTERFACES.md` with **generic schemas** (telemetry = N channels `CH1…`; avatar =
`animationState` enum + numeric params), `MOCKDATA.js`, `DESIGN-CONTEXT.md`, and screenshots.
`MAPPING.md` inside is **DO NOT SHARE** (generic→clinical key). No API keys, prompt logic,
generation code, or medication/dosing content anywhere except `MAPPING.md`. **The originals in
`src/` are untouched and full** — the bundle is a separate copy.

## Housekeeping / loose ends

- **Abandoned "Fable 5 app-editing" prep:** the untracked `BlockWard/` and
  `"blockward-ui-handoff 2/"` directories were present at session start (not created by this
  session) and appear to be leftovers from that abandoned experiment — **safe to delete**.
- Throwaway diagnostic harnesses are gitignored (`scripts/_exp-*`); recreate if needed.
- `vercel dev` on :3000 for AI generation; `npm run dev` (Vite, :5173) for UI-only work;
  `window.__bw_playerStore` is the DevTools hook.

## Next steps (priority order)

1. **NEXT SESSION FOCUS (see the section above):** the avatar-driven focused-exam redesign
   (decide 2D-vs-3D + the animation library/custom-fallback + the schema/scoring change) **and**
   the professional UI pass. Design first, then build.
2. **Finish the Stage 4 rollout** — player/debrief screens + `DESIGN_TODO.md` items + the
   avatar-face card chips (face-only `PatientSVG` mode). Folds into #1's UI pass.
3. **Verifier second pass / further tuning** (CODE_TODO.md) + a live end-to-end verify-hook smoke.
4. Optional: a **light-theme** variant of the token system.

## Prompt to give the next Claude Code session

```
I'm continuing Block Ward (pediatric emergency clinical simulator). Pull `main`
and get fully caught up FIRST:

1. Read docs/BLOCK_WARD_HANDOFF_2026-06-12.md end-to-end (it chains back to the
   06-11, 05-29, 05-27 dated handoffs — skim those for tech-stack + working-
   relationship context). docs/BLOCK_WARD_HANDOFF.md is deep-background canonical.
2. Read these files before proposing anything:
   - The avatar: src/components/player/PatientSVG.jsx (2D inline-SVG "LEGO
     minifig", keyword-driven accessories from scenario.visuals[]),
     PatientView.jsx, and scripts/render-avatar.mjs (the render harness).
   - The current assessment: src/components/player/AssessPanel.jsx,
     BodySystemsView.jsx, SignCard.jsx + how signs are shaped/emitted (the
     orchestrator in src/lib/ai/prompt.js, the player schema).
   - The design system: src/lib/design/tokens.js ("Midnight Neon" Stage-4
     tokens, started) + DESIGN_TODO.md (its Phase-7 entry already flags the
     binary sign-flagging as a fairness problem — this redesign supersedes it).
   - The sanitized UI handoff bundle blockward-ui-handoff/ — a GENERIC,
     renderer-agnostic avatar schema (animationState enum + numeric params), a
     telemetry schema, MOCKDATA, design context, and 3D-headroom notes. Good
     reference for the design + 3D scoping. (Originals in src/ are full; the
     bundle is a sanitized copy.)

THIS SESSION'S FOCUS — two intertwined goals. Do NOT start coding; propose a
design + an animation "menu" + a 2D-vs-3D recommendation, and let me approve
first (my process: design docs before implementation; surface the big forks one
question at a time).

A) AVATAR-DRIVEN FOCUSED-EXAM ASSESSMENT (the big overhaul). Replace the current
"select the abnormal tile + flag it" interaction — it's ambiguous (findings are
either obviously abnormal and trivial, or one small abnormal detail is buried in
a tile of normal findings, so you can't tell whether to flag the tile). Instead:
the generated avatar sits CENTER-STAGE, with exam options around it ("Check
pupils", "Assess breathing/abdomen", "Inspect skin", "Check perfusion", etc.).
Clicking one ZOOMS the camera to that body region and plays a scenario-specific
animation of the ACTUAL finding, then a popup states the professional finding.
Examples: head injury -> "Check pupils" zooms to the eyes, anisocoria (one pupil
larger) + a spotlight sweeps across the eyes (pupillary-reaction exam), popup
"right pupil 4 mm nonreactive, left 2 mm briskly reactive"; "Assess breathing"
zooms to chest/abdomen, respiration animated at the SAME rate shown on the VS
monitor (faster if tachypneic), with retractions if present. 4-5 zoomed, animated
exams per generated scenario. The user no longer gets right/wrong in the systems
assessment — it becomes an interactive way to perform the exam and see real
findings, so the avatar plays a much bigger role.

  Forks to decide with me BEFORE building:
  - 2D-enhanced vs 3D avatar. Probably needs 3D (current is 2D inline-SVG). No
    3D lib installed; bundle ~313KB gzip, no code-splitting -> lazy-load three.js
    / react-three-fiber if we go 3D. Weigh 2D-enhanced (cheaper, keeps the LEGO
    charm) vs 3D and recommend.
  - Animation system: a LIBRARY of pre-made exam animations loaded like the
    current accessory keywords (anisocoria, retractions, breathing-rate,
    cap-refill, rashes...) PLUS a custom/generated fallback for findings we
    haven't pre-made.
  - Schema + orchestrator: the AI emits a per-exam descriptor (body region,
    animation + params like rate/retractions/pupil sizes, the popup text, the
    numeric values), kept clinically accurate via the orchestrator + the new
    Sonnet verifier.
  - Scoring/flow: how the assessment phase works without binary flagging.

B) PROFESSIONAL UI PASS (prioritize alongside A). The app looks generic/dated.
Make it look professionally made: readable fonts, professional color system,
great aesthetics, polished spacing/components. Stage 4 ("Midnight Neon" tokens)
is started and applied to the dashboard only — finish a cohesive professional
look across the player/debrief screens and clear the open DESIGN_TODO.md items.
I'm open to refining the direction (I may also want a light-theme variant) — show
me options if the current direction doesn't read professional enough.

Constraints: clinical accuracy is paramount (preserve the tuned orchestrator +
Haiku fill + the new Sonnet verifier in src/lib/ai/). Code style is strict (JS,
no template literals, string + concat, no arrow fns in JSX attrs, inline styles,
Object.assign, plain function decls). Run `vercel dev` on :3000 for AI generation,
`npm run dev` (:5173) for UI-only. window.__bw_playerStore is the DevTools hook.
I authorize direct commits/pushes; smoke-test before commits. Never paste API keys.

Start by confirming your understanding of the current avatar + assessment code,
then propose the 2D-vs-3D recommendation and a design for the focused-exam +
animation system for my approval before any implementation.
```
