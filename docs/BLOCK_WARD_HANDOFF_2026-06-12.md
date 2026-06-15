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

## Still-pending from the 06-11 handoff

- **Focused-exam assessment redesign** (06-11 "Next steps" #2 — Sebastian's biggest UX ask):
  replace the ambiguous "flag abnormal findings" tiles with an avatar-centered focused exam
  (tiles around the avatar with connector lines; clicking zooms the camera to a body region
  and animates the actual finding — pupils/anisocoria + light sweep, breathing at the phase's
  monitor RR with retractions — then a popup states the professional finding). Avatar-driven;
  lives with Stage 5. NOT started.

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

1. **Finish the Stage 4 rollout** — player screens + `DESIGN_TODO.md` items + the avatar-face
   card chips (face-only `PatientSVG` mode).
2. **Stage 5 — avatar expansion** (propose the menu first) + the **focused-exam redesign**.
3. **Verifier second pass / further tuning** (CODE_TODO.md) + a live end-to-end verify-hook smoke.
4. Optional: a **light-theme** variant of the token system.

## Prompt to give the next Claude Code session

```
I'm continuing Block Ward. Pull `main` and read
docs/BLOCK_WARD_HANDOFF_2026-06-12.md first (it points to the 06-11, 05-27, 05-29
handoffs for prior context — skim those too).

State (all on main, pushed, deployed): Stage 3 (curveball) and Stage 3.5 (the Sonnet
cross-check verifier) are DONE and verified. Stage 4 (UI/design system) is STARTED — a
shared design-token module (src/lib/design/tokens.js, "Midnight Neon" direction) is built
and wired into the dashboard; the player/debrief screens are still on the legacy palette.

Immediate priorities (detailed in the handoff "Next steps"):
(1) Finish the Stage 4 rollout — apply the tokens across the player + debrief screens,
clear the open DESIGN_TODO.md items, and build the circular avatar-FACE card chips (a
face-only PatientSVG render mode). (2) Stage 5 avatar expansion — propose a menu first —
plus the avatar-centered focused-exam assessment redesign. (3) The verifier second-pass
tuning tracked in CODE_TODO.md, and a live end-to-end smoke of the verify hooks.

Code style is strict (JS, no template literals, string + concat, no arrow fns in JSX
attrs, inline styles, Object.assign, plain function decls). Clinical accuracy is paramount;
preserve the tuned orchestrator + Haiku machinery + the new Sonnet verifier. Run `vercel dev`
on :3000 for AI generation, `npm run dev` (:5173) for UI-only. Sebastian authorized direct
pushes; smoke-test before commits. Never paste API keys.
```
