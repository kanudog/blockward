# Block Ward Handoff — 2026-06-11

Covers a large session: a Stage-0 cohesion audit, the Stage-1 built-in
conversion (SC1 + SC2), and the **Stage 2 two-round ("deteriorating patient")
generation feature — built and component-validated, live AI smoke pending.**
Read `docs/BLOCK_WARD_HANDOFF_2026-05-27.md` and `2026-05-29.md` first for
tech-stack and working-relationship context; this assumes them.

## Where the work lives (IMPORTANT)

- `main` has the Stage-1 commit only (`69a9c97` — SC1+SC2 conversion).
- **Stage 2 lives on branch `stage-2-two-round`** (this handoff is on it too).
  It was pushed to save the work WITHOUT auto-deploying the not-yet-live-smoked
  full-case path to production. Merge to `main` after the live AI smoke passes.

## The overall job (one coordinated overhaul, staged with review gates)

Turn Block Ward into a cohesive, polished app where a scenario plays as the
SAME patient deteriorating across TWO assess→intervene rounds, then an optional
(toggle-gated, hybrid) curveball, then stabilization + debrief; richer avatar;
real design system; one honest scenario shape. Stages: 0 audit → 1 cohesion →
2 two-round → 3 curveball → 4 UI → 5 avatar → final verification. Hard
constraints: JavaScript (no TS), no template literals, string `+` concat, no
arrow fns in JSX attrs, inline styles, `Object.assign`, plain `function`
decls. Clinical accuracy is paramount; preserve the tuned orchestrator + Haiku
accuracy machinery. Smoke-test before commits. Sebastian commits/pushes.

## Generation time budget (CORRECTS the master prompt's "100s")

- **Hard ceiling: 300s** — the Vercel function timeout (`api/generate.js`
  `maxDuration: 300`). Over it = the scenario fails to build entirely.
- **Soft target ~95-100s** — keep generation as low as possible.
- Measured (fresh, production prompts, no web_search): current single-round
  output **99.7s**; a monolithic 4-phase call **165s**; the chosen split is
  **R1 ~78s foreground + R2 ~97s background** = ~78-100s perceived.

## Stage 0 — audit (done)

- **Branch/merge:** the old `avatar-redesign-and-bug-sweep` branch WAS
  squash-merged to main (PR #2 = commit `37bf2f1`); the branch still exists on
  origin; `git diff main origin/avatar-redesign-and-bug-sweep` is empty —
  nothing lost.
- **Cohesion problems found:** dead `buildSystemPrompt`; `scenario.curveball=null`
  + `explainers`-shape stubs in `applyPostParseFixups`; stale `PHASE_KEYS`
  streaming labels; the curveball machinery (player cb-alert/cb-act, Debrief
  "Curveball Deep Dive") live for built-ins SC1-3 but dead for AI (orchestrator
  emits no curveball); two scenario shapes (legacy built-ins vs orchestrator)
  bridged by per-load `migrateLegacyScenario`.

## Stage 1 — built-in conversion (SC1 + SC2 done; SC3-6 deferred)

Sebastian decided to **DELETE SC3-SC6 and replace them with new built-in
cases**, so only SC1 + SC2 were converted (they stand as the reference 5.4.1
shape). Committed `69a9c97` on main.

- Converted via `scripts/convert-builtin-to-541.mjs` (records the clinical
  decisions per scenario); validated via `scripts/_check-builtin.mjs`.
- Shape: vitals object→array with a single merged `bp`; `assess`/`intervene`
  ids + stageType + phaseIndex; string `priority`; `explainers`→`physiologyDeepDive`
  (+ `keyTeaching`); all prose preserved verbatim.
- **Clinical bug-fixes made (policy = "fix now + document each", live-verified):**
  - SC2's four cardinal dehydration signs were `bad:false` (app scored a learner
    WRONG for catching them) → corrected to `bad:true` (now CAUGHT).
  - SC2 `dextroseBolus` was a distractor despite escalation glucose 54 (<60) →
    reclassified correct, feedback re-authored.
  - The migrator's `pri→priority` heuristic is INVERTED (`pri:1/2`→`correct`,
    only `pri≥3`→`tied-correct`), which left the "What Saved This Patient"
    recovery list EMPTY for built-ins. Fixed by assigning priority per clinical
    must-have judgment.
  - Lab `bad`/`critical` coherence normalized; authored missing reassuring `why`.
- **Open Stage-1 finding:** reassuring-`why` is authored but the player only
  shows "Why?" on ABNORMAL items (`LabPanel.jsx:91`), so reassuring whys are
  currently invisible (true for AI too). Surface them with a ~1-line UI change
  in Stage 4, or decide otherwise.
- **NOT done (deferred):** deleting `migrateLegacyScenario` legacy branches +
  `applyPostParseFixups` cruft — wait until SC3-6 are gone.

## Stage 2 — two-round model (BUILT + component-validated; live smoke PENDING)

**Architecture (validated with dry-runs):** SPLIT generation. Round 1 (2 phases)
generates in the foreground (~78s, user starts playing); Round 2 (2 phases +
reassessment + debrief) generates in a BACKGROUND Sonnet call during Round 1
play (~97s), then merges. Perceived wait stays ~78-100s; each call far under
300s, leaving headroom for the curveball + web_search.

**Schema:** `phases = [assess1, intervene1, assess2, intervene2]`, each with
`round` (1|2) + `stageType` + `phaseIndex`. Quick-case = just the first two.
Round 2 is the SAME patient evolved — a plausible trajectory from Round 1 given
the pathology + the interventions that were AVAILABLE (not the specific clicks;
see "design decisions").

**Files changed (all on `stage-2-two-round`):**
- `src/lib/ai/prompt.js`: base prompt renamed `buildOrchestratorBase()` (the
  single source of truth for clinical machinery — UNCHANGED, quick-mode
  byte-identical at 48,384 chars). `buildOrchestratorPrompt(mode)` dispatches;
  `buildRound1Prompt()` (round 1 of two, no reassess/debrief, defers later-round
  facts) and `buildRound2Prompt()` (validated continuation + loyalty) are
  derived by surgical `_promptSwap()`s that assert their anchors — the clinical
  core is preserved verbatim.
- `src/lib/ai/client.js`: `generateScenario(txt, {mode,cbMode}, signal, onProgress)`
  (R1 for full); `generateRound2(scenario, signal)` (background; threads the
  ORIGINAL brief into the user message = loyalty safeguard); `mergeRound2()`;
  `_stampRounds()`; R1 keeps `_pendingRound2` + `_sourcePrompt` + `_cbMode`.
- `src/stores/playerStore.js`: `round2State` ("idle|generating|ready|error") +
  `startRound2Generation()` (gen → merge → **persist via `updateCustom`** →
  fill R2 why/fb/deep-dive slots via the dispatcher). start() aborts both
  controllers + sets round2State.
- `src/components/player/ScenarioPlayer.jsx`: flow
  `intro→assess(r1)→act(r1)→INTERLUDE→assess(r2)→act(r2)→[curveball]→reassess→
  recovery→debrief`. New interlude screen (evolved-state narrative + the user's
  actual R1 choices client-side; "Continue to Round 2" gated on round2State).
  Recovery must-haves now span BOTH intervene rounds. Forward-only across the
  boundary. Fires `startRound2Generation()` on mount.
- `src/components/builder/BuilderForm.jsx`: quick/full toggle (default full).

**Safeguards (per Sebastian's questions, all implemented):**
- **Loyalty:** original brief threaded into R2 (and the curveball, when built);
  loyalty checklist preserved verbatim via the shared core. **Proven live** —
  R2 honored a Round-2-specific fact ("in round 2 he develops a petechial rash,
  temp 40.5"), R1 deferred it (charted "no petechiae at this time").
- **Persistence:** background R2 persists via `updateCustom`; replay = no-op.
- **Mark-for-review stays transient** (`playerStore.deepDiveCache`, reset each
  run) while `physiologyDeepDive` persists — already the design.

**Validated so far:** prompt layer (anchors, core preservation, quick-mode
unchanged); R1+R2 dry-runs (timing + continuity + loyalty); production build
compiles (1803 modules); browser (no-API) — quick-case SC1 regression clean,
synthetic 4-phase interlude renders + gates + transitions to Round 2, zero
console errors.

**PENDING (Gate 2):** full LIVE AI smoke (build a real full-case via `vercel dev`
→ play both rounds through the actual background R2 gen), a clinical-continuity
verification subagent, and measured end-to-end timing.

## Curveball = Stage 3 (NOT built)

The `cbMode` toggle exists and stashes `scenario._cbMode`, but no curveball is
generated for AI scenarios yet. Stage 3 = toggle-gated, hybrid-character
(`curveballTrigger`: reactive | disease | random) curveball as a real
post-Round-2 beat, generated in the background batch with R2, same loyalty +
persistence. The old built-in curveballs (SC1-3) still use the legacy player
path (cb-alert/cb-act) — to be reconciled in Stage 3.

## Decisions locked with Sebastian this session

- Round 2 ALWAYS present, PLUS a quick/full builder toggle (full default).
- Design vibe (Stage 4): modern/sleek/futuristic, "liquid glass," soft moody
  cool colors, legible fonts. NEW: the avatar's FACE as a circular icon on the
  scenario-select screen + a small circular patient-face chip on every case
  card (built-in + AI). That's a face-only `PatientSVG` render mode (Stage 5)
  wired into the card UI (Stage 4).
- R2 keys off AVAILABLE interventions, not the user's actual clicks (timing +
  persistence require a deterministic R2). The interlude surfaces actual choices
  client-side for the FEEL of reactivity without a branching engine.

## Throwaway validation scripts (deleted before commit; recreate if needed)

`scripts/_exp-4phase-timing.mjs`, `_exp-round2-continuation.mjs`,
`_exp-loyalty-regression.mjs`, `_check-prompts.mjs` — diagnostic harnesses that
hit `api.anthropic.com` directly (read the key from `.env.local`). They proved
the budget/continuity/loyalty results above.

## Next steps (priority order)

1. **Finish Gate 2:** live AI smoke (detailed prompt + sparse prompt; verify
   clinical soundness), continuity subagent, timing. Then merge to main.
2. **Stage 3 — curveball** (toggle-gated, hybrid, background-generated).
3. **Stage 4 — UI/design system** + the circular avatar-face chips + the open
   `DESIGN_TODO.md` items + reassuring-"Why?" surfacing.
4. **Stage 5 — avatar expansion** (propose menu first).
5. Replace built-ins (delete SC3-6, author new cases in 5.4.1 shape), then
   delete the legacy `migrateLegacyScenario` branches + `applyPostParseFixups`
   cruft.

## Prompt to give the next Claude Code session

```
I'm continuing Block Ward. Check out branch `stage-2-two-round` and read
docs/BLOCK_WARD_HANDOFF_2026-06-11.md first (it points to the 05-27 and 05-29
handoffs for tech-stack/working-relationship context — read those too).

State: Stage 0 (audit) and Stage 1 (SC1+SC2 conversion, on main as 69a9c97)
are done. Stage 2 (two-round split-generation deterioration model) is BUILT and
component-validated on this branch but the full LIVE AI smoke is still pending —
that's the immediate task: run `vercel dev` (:3000), build a full-case AI
scenario, and play both rounds end-to-end through the real background Round 2
generation; verify clinical soundness + R1→R2 continuity (use a subagent);
measure timing. Then we move to Stage 3 (curveball), Stage 4 (UI), Stage 5
(avatar). Don't push to main until the live smoke passes.

Code style is strict (JS, no template literals, string + concat, no arrow fns
in JSX attrs, inline styles, Object.assign, plain function decls). Clinical
accuracy is paramount — preserve the tuned orchestrator + Haiku machinery; the
Stage 2 prompts derive from buildOrchestratorBase() and keep the clinical core
verbatim. window.__bw_playerStore is the DevTools hook. Never paste API keys.
```
