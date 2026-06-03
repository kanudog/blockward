# Block Ward Handoff — 2026-05-29

Covers the 2026-05-29 session (post-Phase-6.2 **bug sweep** + a full
**patient-avatar redesign**). For deep tech-stack and working-relationship
context, read `docs/BLOCK_WARD_HANDOFF_2026-05-27.md` first — this doc
assumes it.

## Project context (short)

Pediatric emergency clinical simulator for RNs/med students. Vite + React
(JavaScript, not TypeScript), Vercel serverless `/api/generate` (Anthropic
via raw `fetch`). Repo `kanudog/blockward`, local
`/Users/openclaw/Documents/blockward`. Sebastian runs `vercel dev` on
**:3000** (needs the serverless fn for AI generation). Sebastian is a
medical professional, not a developer — explain *why*, push back when he's
wrong, and be the verification layer for both clinical accuracy and
implementation bugs.

## Code style — strictly preserved

JavaScript (not TS); no template literals (use `+` concatenation); no arrow
functions in JSX attributes; inline styles over Tailwind; `Object.assign`
for style merging; plain `function` declarations.

## What shipped this session

All on branch **`avatar-redesign-and-bug-sweep`** (pushed to origin, **not
yet merged to `main`**). Three commits:

1. **`ed9e974` — Bug sweep batch 1 (player):**
   - **Explored-counter soft-lock:** `ActionPanel` now derives renderable
     tool/med id lists; `total` + the completion gate count only tiles that
     actually render, so an off-registry id can't leave the counter short or
     block "Continue."
   - **BP assessment scoring (Bug 6, found mid-sweep):** the unified
     `id:"bp"` vital (Phase 6.2b.4) was scored under `vital:sbp` by the
     assess tile while the snapshot used `vital:bp` → BP always read
     "missed"/"wrong." Fixed: the BP tile keys on the vital's real id.
   - **Phase-scoped mark-for-review ids** (`@p<phaseIdx>`) so same-id items
     don't collide across phases.
   - **Deep-dive in-flight guard** (`playerStore.deepDiveInFlight` +
     begin/endDeepDive) so rapid mark→unmark→mark doesn't double-fire.
   - **guessAge day/week units** → infant (was mis-bucketing).
     `scripts/age-guess-check.mjs` asserts it.

2. **`a4d9bd2` — Bug sweep batch 2 (orchestrator + docs):**
   - Orchestrator `visuals` keyword vocabulary in `buildOrchestratorPrompt`
     (the avatar accessory contract).
   - Patient-name rebalance (was over-correcting to exclusively non-Western
     names; now a realistic US-clinic mix).
   - Dry-run env-loader fix (handled a set-but-empty `ANTHROPIC_API_KEY`);
     ignore `scripts/orchestrator-dry-run-*` outputs.
   - Logged the per-item why-text consistency gap in `CODE_TODO.md`.

3. **`3c092a9` — LEGO minifig patient avatar:**
   - Full `PatientSVG.jsx` rewrite: minifig figure, **gown by sex**
     (blue boys / pink girls), short sleeves, legs, expressive
     **sad → happy/jump** face, **name-hashed hairstyle + color** (9 styles
     + bald; **infants always bald**), bed/crib by age, front-view
     wheelchair, proper arm sling, and the full accessory set.
   - `pose="jump"` (recovery) raises the arms, bounces the figure, and
     **hides the IV** (it's outside the figure group, so it would float).
   - Threaded `seed` (patient name) + `pose` through `PatientView`,
     `ScenarioPlayer`, `Debrief`.
   - `scripts/render-avatar.mjs` (esbuild + react-dom/server harness) and
     design previews under `design-notes/`; `.claude/launch.json` dev-server
     config.

## Smoke results (done this session, live app on :3000)

- **Built-in (The Fussy Infant), full flow, zero console errors:** bald
  infant in a crib (teddy + IV), face sad → happy at reassessment, **IV
  correctly disappears on the recovery jump**; explored counter **12/12** +
  Continue appeared; HR/RR caught, BP flagged-but-normal, Temp missed — all
  correct.
- **AI scenario (anaphylaxis toddler "Silent Bells"), zero console
  errors:** generation + wave-1 Assess gate worked; AI emitted
  `visuals: ["hives","lip swelling","oxygen mask","diaphoretic"]` (incl. new
  keywords) — all rendered on a pink-gowned toddler in a crib; name "Isla
  Okonkwo" (rebalance working); **unified-BP flag scored as *caught*** —
  Bug 6 verified on the path built-ins can't reach.
- Two apparent failures during testing were harness artifacts (reading
  React state in the same tick as the click), not app bugs.

## Avatar system — how it works (read before editing the avatar)

- `src/components/player/PatientSVG.jsx` is the whole avatar (figure +
  bed/crib + blanket + teddy + IV + accessories), keyword-driven.
- **Accessories** come from the scenario's top-level `visuals` string array,
  which the orchestrator emits. Recognized keywords are listed in
  `prompt.js` (the `Patient avatar visuals` section) and mirrored in
  `docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md`. The
  renderer matches them case-insensitive substring; **novel phrasings render
  nothing** — the keyword list is the contract. Current set: cast left/right
  arm, cast leg, head bandage, c-collar, arm sling, eye patch, nasal
  cannula, oxygen mask, hives, wheelchair, flushed, diaphoretic, lip
  swelling, petechiae (takes precedence over hives), wound dressing,
  crutches.
- **Age** via `guessAge(sc)`, **sex** via `guessSex(sc)` (`lib/scenarios/age.js`).
- **Hair** is name-hashed from the `seed` prop (patient name) via
  `pickHair()`; girls/boys draw from sex-specific style sets; infants forced
  bald.
- **`pose="jump"`** only on the recovery screen; **`emotion`** ("sad" during
  the case, "happy" on reassess/recovery) drives the face.
- **Verify avatar changes with the harness:** `node scripts/render-avatar.mjs`
  server-renders the *real* component for ~25 variants to
  `design-notes/avatar-accessories-preview.html` and reports any
  `NaN`/`undefined` (it already caught a real crash this session — a signed
  bitshift in the hash). View galleries via `design-notes/avatar-gallery.html`
  (it iframes the rendered files over `http://localhost:3000/...`, so the dev
  server must be running).

## Next steps (in rough priority)

1. **Merge the branch.** PR for `avatar-redesign-and-bug-sweep` is open on
   GitHub; review the diff and merge to `main`.
2. **UI redesign (Sebastian's next focus) — via Claude Design.** The overall
   UI reads as generic/boring. The *avatar* is done; this is about the
   surrounding chrome: dashboard, scenario-player screens, debrief, buttons,
   typography, color system, spacing. Pair this with the open visual items
   already in `DESIGN_TODO.md` (transparent "Why?" popups on Phase 2, system
   labels → ALL CAPS bold, lab-tube icons, missing assessment instruction
   line, vitals-monitor color uniformity, popup bold-term contrast color).
   Keep the avatar's friendly LEGO aesthetic as an anchor for the new look.
3. **Leg-cast-in-bed (optional polish).** A leg cast currently only shows on
   the recovery jump (legs are under the blanket in bed). Add a cast bulge
   that pokes above the blanket if it should read in-bed too.
4. **Per-item why-text clinical consistency (Level 1 verification).** See
   `CODE_TODO.md` 2026-05-29: Haiku why-texts can contradict each other
   (e.g. hypotension-threshold formula drift, compensated vs decompensated).
   Either tighten the per-item prompt (state the 70 + 2×age rule; forbid
   contradicting the scenario-wide perfusion state) or build the deferred
   Sonnet cross-check verifier.
5. **Phase 6.3 — built-in scenario rewrites** (SC1–SC6 into orchestrator
   shape; removes per-load migration overhead). Carried from the 05-27
   handoff.
6. **Phase 6.4 — cleanup** (delete `buildSystemPrompt`, remove
   `scenario.curveball = null`, `why: null` backfill on reassuring legacy
   labs). Carried from the 05-27 handoff.
7. **Phase 7 (design)** — deprecate sign-card binary flagging, the
   "RR-normal-but-inadequate" UX problem, etc. (`DESIGN_TODO.md`).

## Dev environment notes

- `vercel dev` on **:3000**. `.claude/launch.json` defines `vercel-dev`,
  `vite-dev`, `vite-preview`. (`.claude/settings.local.json` and the lock
  file are machine-local and git-ignored.)
- Orchestrator dry-run harness: `node scripts/orchestrator-dry-run.mjs`
  (reads `ANTHROPIC_API_KEY` from `.env.local`; outputs are git-ignored).
- DevTools: `window.__bw_playerStore.getState()` for live player state.

---

## Prompt to give the next Claude Code session

```
I'm continuing work on Block Ward, a pediatric emergency clinical
simulator. Read docs/BLOCK_WARD_HANDOFF_2026-05-29.md first (it points
to the earlier 2026-05-27 handoff for tech-stack and working-relationship
context — read that too).

Recent work lives on the branch `avatar-redesign-and-bug-sweep` (3 commits,
pushed, not yet merged to main): a post-Phase-6.2 bug sweep (explored-
counter soft-lock, BP assessment scoring fix, phase-scoped mark ids,
deep-dive in-flight guard, guessAge day/week) and a full LEGO-minifig
patient-avatar redesign (gown by sex, legs, sad→happy/jump face,
name-hashed hair with infants bald, bed/crib, wheelchair, sling, full
keyword-driven accessory set). All of it was smoke-tested in the live app
(:3000) with zero console errors.

After reading the handoffs:

A. Summarize what you understand about the current state — what shipped
   on the branch, the avatar system (keyword-driven visuals, name-hashed
   hair, render-avatar.mjs harness, design-notes gallery), and the code
   style rules.

B. Wait for me to tell you which next step to work on. The most likely
   one is a UI redesign — I think the surrounding UI (dashboard, player
   chrome, debrief, buttons, typography, color) looks generic/boring and
   I'll be using Claude Design for it. Other open items: merge the branch,
   leg-cast-in-bed polish, the per-item why-text consistency / Level 1
   verifier, Phase 6.3 built-in rewrites, Phase 6.4 cleanup.

C. Do NOT start generating prompts or making changes until I confirm your
   context summary matches my expectations.

Notes:
- Repo is public at kanudog/blockward.
- Run `vercel dev` (port 3000) — the app needs the serverless /api/generate.
- window.__bw_playerStore is the DevTools debug hook.
- Verify avatar changes with `node scripts/render-avatar.mjs`.
- Never paste API keys/credentials into the conversation.
```
