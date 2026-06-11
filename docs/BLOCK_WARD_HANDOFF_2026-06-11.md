# Block Ward Handoff — 2026-06-11

Covers a large session: a Stage-0 cohesion audit, the Stage-1 built-in
conversion (SC1 + SC2), and the **Stage 2 two-round ("deteriorating patient")
generation feature — built and component-validated, live AI smoke pending.**
Read `docs/BLOCK_WARD_HANDOFF_2026-05-27.md` and `2026-05-29.md` first for
tech-stack and working-relationship context; this assumes them.

## Where the work lives (IMPORTANT)

- **Everything is on `main` and pushed** — Stage 1, Stage 2, and the new
  built-ins. Stage 2's live AI smoke passed 3/3 (independently clinical-
  reviewed, no dangerous errors), so the `stage-2-two-round` branch was merged
  to `main` and pushed (auto-deploys to Vercel). The branch still exists on
  origin for reference. A new session should just clone/pull `main`.

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

## Built-in scenarios (current roster — 5 total)

`src/lib/scenarios/builtIn.js` exports SC1-SC5; registry is `src/hooks/useScenarios.js`
(`BUILT_IN=[SC1,SC2,SC3,SC4,SC5]`). After Gate 2, the old SC3-SC6 were DELETED
and replaced with the 3 verified two-round test cases:
- **SC1** fussy-infant (sepsis) — Stage-1 converted, 2-phase quick case.
- **SC2** vomiting-toddler (hypovolemia) — Stage-1 converted, 2-phase quick case.
- **SC3** `croup-toddler` "Bark in the Night" — NEW, 4-phase two-round (tier 1).
- **SC4** `anaphylaxis-bee-sting` "Stung at the Picnic" — NEW, 4-phase (tier 2).
- **SC5** `dka-cerebral-edema` "No Insulin for Three Days" — NEW, 4-phase (tier 3).
SC3-SC5 are the live-generated, clinically-verified scenarios from the Gate-2
smoke, lifted into `builtIn.js` fully populated (every why/fb/deep-dive filled,
source:"builtin", 0 null slots, schema-valid, idempotent). They play with NO AI
generation (the dispatcher gates out on source!=="ai"). Verified playing as
built-ins end-to-end (DKA: source=builtin, content pre-filled, interlude
continue enabled immediately, no console errors).
- **Bundle note:** the rich built-in content pushed the bundle to ~1.0 MB (gzip
  ~308 KB). Fine for now; consider lazy-loading/code-splitting built-ins later.

## Stage 1 — built-in conversion (SC1 + SC2)

Sebastian decided to delete the old SC3-SC6 (done — see above) and keep SC1+SC2
as the Stage-1-converted reference 5.4.1 shape. Committed `69a9c97` on main.

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

**Gate 2 — PASSED (3/3 live AI smokes through the real app + `/api/generate`).**
- Test 1 (detailed DKA prompt with a Round-2 cerebral-edema instruction): R2
  produced a textbook Cushing's-triad deterioration (HR 128→58, BP→138/74,
  RR→10) while the metabolic numbers improved — the classic "deteriorating
  while the labs get better" trap; must-haves hypertonic saline + mannitol +
  RSI; **loyalty honored** (R2 used the cerebral-edema instruction, R1 deferred
  it). Test 2 (sparse "3 year old with croup"): realistic **racemic-epi
  rebound** (not invented drama). Test 3 (anaphylaxis, **curveball ON**):
  refractory anaphylaxis → IV-epi infusion; curveball-ON is a safe no-op
  (`_cbMode` stashed, `curveball` null, no crash).
- An independent pediatric-critical-care reviewer subagent confirmed all three
  clinically SOUND, **no dangerous doses/routes**. Two minor must-have-judgment
  notes (orchestrator-prompt polish, not blockers): in DKA cerebral edema it
  marked BOTH 3% saline AND mannitol `tied-correct` (either alone is standard —
  the priority taxonomy has no "either-or alternative" concept), and K⁺
  replacement during active insulin is arguably a must-have.
- Persistence confirmed (built scenario survived reload, no regen); avatar
  visuals auto-placed (anaphylaxis → hives/lip swelling/oxygen mask); zero
  console errors throughout. Live timing ~102s R1 + ~97-115s background R2
  (streaming + web_search adds to the 78s dry-run floor; well under 300s).

**Also validated earlier:** prompt-layer anchors + core preservation + quick-
mode unchanged; R1+R2 dry-runs; build compiles; browser quick-case SC1
regression + synthetic interlude/Round-2 transition.

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

## Next steps (priority order — Sebastian's stated priorities for next session)

### 1. Fix / integrate the curveball (Stage 3) — make it work when toggled ON
Today the `cbMode` toggle only stashes `scenario._cbMode`; no curveball is
generated for AI scenarios (graceful no-op, verified). Build it as a real
post-Round-2 beat:
- When `_cbMode` is true, generate the curveball in the BACKGROUND batch
  alongside Round 2 (same `generateRound2` call or a sibling call), with the
  SAME loyalty (original brief threaded in) + persistence + dispatcher-fill
  safeguards. Keep the skeleton bounded (why/fb null → dispatcher waves).
- Orchestrator emits a `curveballTrigger`: `mode` ∈ reactive | disease | random,
  chosen per scenario so it's not formulaic (reactive = ties to the user's R1/R2
  choices/omissions; disease = pathophysiology complication; random = occasional
  related event). Curveball carries its own bounded skeleton (vitals/signs/labs/
  actions/teaches, why/fb null), always includes defib in tools.
- Player: the curveball fires after Round 2's intervene (`afterAct` already
  routes `round===2` → `if(sc.curveball)trigCb()`); the cb-alert/cb-act stages
  exist. Remove the "dormant" feel; ensure it flows cleanly to reassess.
- Smoke: toggle OFF (no curveball), and ON for one scenario of EACH mode.

### 2. Redesign the "flag abnormal findings" assessment → FOCUSED-EXAM interaction
Sebastian's biggest UX ask. The current "click the abnormal tile" interaction is
ambiguous: most tiles are either an obvious easy-win OR a mostly-normal tile with
one small abnormal detail (is the *tile* abnormal?). Replace it with an
avatar-centered focused-exam:
- The generated **avatar sits center-stage**; assessment-category **tiles are
  arranged around it**, each tile drawing a **thin connector line to the relevant
  body region** (pupils→face, breathing→chest/abdomen, perfusion→hand, etc.).
- Clicking a tile (e.g. **"Check Pupils"**) **zooms the camera to that body
  region** and plays a **scenario-specific animation of the actual finding**,
  then shows a small popup stating the professional finding.
  - Concussion example: zoom to the face, both eyes open with **anisocoria**
    (one pupil bigger), a **spotlight sweeps across both eyes** (pupil-reaction
    exam) — one pupil constricts briskly, the other is sluggish. Popup: "Left
    pupil 2 mm, brisk; right pupil 4 mm, sluggish" (professional phrasing).
  - **"Assess Breathing"**: zoom to chest/abdomen, animate respirations; the
    **animation RATE must match the phase's monitor RR**. Normal = smooth
    expansion/contraction; respiratory distress = fast, jerky movement with
    **retractions**.
  - Other tiles = focused assessments dependent on the scenario (pulses, cap
    refill, abdomen, skin/rash, mental status, etc.).
- The learner now PERFORMS focused assessments instead of guessing whether a
  mixed tile is "abnormal." This is a big PatientSVG/animation + schema/scoring
  change — likely needs: a per-finding "exam" descriptor the orchestrator emits
  (which body region + which animated finding + the popup text + the numeric
  values), the avatar zoom/animation system in PatientSVG, and a rethink of how
  "did the learner identify the abnormality" is scored. Couple it tightly with
  Stage 5 (avatar) since it's avatar-driven. Note: `DESIGN_TODO.md` already flags
  deprecating sign-card binary flagging (Phase 7) — this redesign supersedes it.

### 3. Stage 4 — UI / design system
Real token system (still inline-style sourced from a shared module): colors,
typography scale, spacing, elevation, motion. Vibe: modern/sleek/futuristic,
"liquid glass," soft moody cool colors, legible fonts; keep the LEGO avatar as
the anchor. NEW: the avatar's FACE as a circular icon on the scenario-select
screen + a small circular patient-face chip on every case card (built-in + AI) —
a face-only PatientSVG render mode wired into the card UI. Clear the open
`DESIGN_TODO.md` items (transparent Phase-2 "Why?" popups, ALL-CAPS bold system
labels, lab-tube icons, "tap each abnormal value" line, uniform white vitals
text, popup bold-term contrast, VS-monitor aspect on reassess). Also surface the
reassuring-"Why?" content (currently `LabPanel.jsx:91` only shows Why on abnormal
items, so authored reassuring whys are invisible).

### 4. Stage 5 — avatar expansion (propose a menu first, then build)
New accessory/equipment keywords + cues, graphic-quality upgrades, finer age
silhouettes, more hair, richer clinical-state expressions, smarter auto-
placement. Update renderer + orchestrator keyword contract TOGETHER; extend
`scripts/render-avatar.mjs`. (The focused-exam animations in #2 likely live
here too.)

### 5. Cleanup
Now that the old SC3-SC6 are gone, the legacy-only branches of
`migrateLegacyScenario` + the `applyPostParseFixups` cruft can be trimmed (SC1/SC2
and the new SC3-SC5 are already 5.4.1 shape; the migrator stays only as an
idempotent normalizer + the localStorage upgrade path). Also fold the two minor
DKA must-have findings (either-or hyperosmolar; K replacement) into the
orchestrator prompt.

## Prompt to give the next Claude Code session

```
I'm continuing Block Ward. Pull `main` and read
docs/BLOCK_WARD_HANDOFF_2026-06-11.md first (it points to the 05-27 and 05-29
handoffs for tech-stack/working-relationship context — read those too).

State (all on main, pushed, deployed): Stage 0 (audit), Stage 1 (SC1+SC2
conversion), and Stage 2 (the two-round split-generation deterioration model)
are DONE and verified — Stage 2 passed a 3/3 live AI smoke, independently
clinical-reviewed. The 5 built-ins are SC1, SC2 (2-phase) + SC3 croup, SC4
anaphylaxis, SC5 DKA→cerebral-edema (4-phase two-round, the verified smoke
scenarios, fully populated, play with no AI generation).

Immediate tasks (Sebastian's priorities, detailed in the handoff "Next steps"):
(1) Fix/integrate the CURVEBALL (Stage 3) so it works when the builder toggle is
ON — background-generated with the same loyalty/persistence safeguards,
toggle-gated, hybrid character (reactive | disease | random). (2) Redesign the
"flag abnormal findings" assessment into an avatar-centered FOCUSED-EXAM
interaction (avatar center-stage, category tiles around it with connector lines
to body regions; clicking a tile zooms the camera to that region and animates
the actual finding — e.g. pupils with anisocoria + a light-reaction sweep,
breathing animated at the phase's monitor RR with retractions — then a popup
states the professional finding). Then Stage 4 (UI/design system + circular
avatar-face card chips) and Stage 5 (avatar expansion — propose a menu first).

Code style is strict (JS, no template literals, string + concat, no arrow fns
in JSX attrs, inline styles, Object.assign, plain function decls). Clinical
accuracy is paramount — preserve the tuned orchestrator + Haiku machinery; the
Stage 2 prompts derive from buildOrchestratorBase() and keep the clinical core
verbatim. Run `vercel dev` on :3000 for AI generation; window.__bw_playerStore
is the DevTools hook. Sebastian commits/pushes (he authorized direct pushes this
session). Never paste API keys.
```
