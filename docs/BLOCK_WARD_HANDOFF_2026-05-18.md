# Block Ward — Session Handoff (2026-05-18)

This handoff doc supersedes `BLOCK_WARD_HANDOFF.md` (dated
2026-05-08). It reflects current state after Phase 5.4.3a (typed-
collection migration), Phase 5.4.3b Commit 1 (Haiku prompt
embedding), and the design lock for Phase 5.4.3b Commit 2
(wave-based dispatcher).

Use this doc as the starting point for any new conversation
resuming Block Ward work.

## Phase 6.0 (in progress, 2026-05-26)

Mid-project phase renumbering. What was previously called "Phase
5.4.3b Commit 2" through "Phase 5.4.6" has been rolled up under
a Phase 6.x banner to reflect the larger architectural step:

- **Phase 6.0 — Wave Dispatcher** (shipped 2026-05-26). Built
  `src/lib/ai/dispatcher.js`, wired it into
  `playerStore.startDispatcher`, gated Assess on wave 1, rendered
  the schema-5.4.1 `debrief.physiologyDeepDive[]` shape in
  `Debrief.jsx`, deleted the Phase 5.2 / 5.3 lazy-fetch path. Wave 5
  fires automatically after wave 4 in the same `.then()` chain (see
  `08-dispatcher-architecture.md` Phase 6.0 amendment).
- **Phase 6.1 — Player Shape Migration** (shipped 2026-05-26). The
  player now consumes orchestrator-shape scenarios natively: vitals
  as array, string priority enum on action entries, no top-level
  `phase.tools[]`/`meds[]`, `debrief.keyTeaching[]` synthesized from
  legacy `explainers[]`. `migrateLegacyScenario` remains the bridge
  for built-ins SC1-SC6 and any pre-migration localStorage
  scenarios. The orchestrator prompt itself is still dormant —
  `generateScenario` continues to call `buildSystemPrompt` — that
  wiring is now Phase 6.2.
- **Phase 6.2 — Orchestrator wiring + verification + UX polish**
  (was the original Phase 6.1 / Phase 5.4.4). Wires
  `buildOrchestratorPrompt()` into live generation, adds Level 1
  cross-model verification, per-chip shimmer, and the UX polish
  enumerated in `DESIGN_TODO.md`. Renamed up from 6.1 to make room
  for the shape-migration commit.
- **Phase 6.3 — Deep-dive migration to Haiku** (was Phase 5.4.5 /
  prior Phase 6.2). Mark-for-Review deep dives move from Sonnet
  to Haiku.
- **Phase 6.4 — Cleanup** (was Phase 5.4.6 / prior Phase 6.3).
  Delete remaining legacy code paths; migrate built-ins to the
  `debrief.physiologyDeepDive` shape; consider retiring
  `migrateLegacyScenario` once everything emits orchestrator shape
  natively.

Historical phase markers in existing code comments (`Phase-5.2.5`,
`Phase-5.3`, `Phase-5.4.3a`, etc.) are immutable history and remain
unchanged. New code authored under the new numbering uses
`Phase 6.x`.

## Project overview

Block Ward is a pediatric emergency medicine clinical simulator
for RNs and medical students. Built solo by Sebastian, a medical
professional (not a developer by trade). Users play pre-built or
AI-generated scenarios across assessment (flagging abnormal
vitals/findings/labs) and intervention (selecting correct tools
and medications) phases.

### Tech stack

- Vite + React (JavaScript, not TypeScript)
- Vercel serverless functions
- Anthropic API via raw fetch()
- Repo: `kanudog/blockward` (GitHub), auto-deploys to Vercel on
  push to main
- Local: `/Users/openclaw/Documents/blockward` on Mac Mini

### AI models

- Sonnet (`claude-sonnet-4-6`) — full scenario generation (legacy
  `buildSystemPrompt`); new orchestrator (`buildOrchestratorPrompt`)
  for skeleton generation; Mark-for-Review session-only deep dives
  (`buildMarkForReviewDeepDivePrompt`)
- Haiku (`claude-haiku-4-5-20251001`) — wave-1-through-4 per-item
  explanations (`buildPerItemExplanationPrompt`); wave-5 debrief
  deep dives (`buildDeepDivePrompt`)

### Code style (preserved strictly)

- No arrow functions in JSX attributes
- No template literals (use string concatenation)
- Inline styles over Tailwind
- `Object.assign` for style merging
- JS not TS

## Working relationship

Claude Code in Cursor handles all implementation; Claude (in
conversation, currently Opus 4.7) serves as architectural advisor
and clinical accuracy reviewer. Sebastian pastes Claude's prompts
directly to Claude Code without modification. He explicitly wants
explanations of *why*, not just *what*, and wants Claude to push
back when he's wrong.

Sebastian is not a developer or formally a nurse educator — he
cannot reliably catch clinical accuracy errors or implementation
bugs. Claude must be the verification layer for both.

## Current state (post-Commit 1 of Phase 5.4.3b)

### Phases shipped (in order)

- **Phase 5.4.1** — Schema 5.4.1 lock (`04-skeleton-schema-v1.md`).
  Typed collections for phase.vitals/signs/labs as arrays with
  rich objects, slot references via `_slotRef` strings.

- **Phase 5.4.2** — Sonnet orchestrator prompt design and
  implementation (`05-orchestrator-prompt-design.md`).
  `buildOrchestratorPrompt()` exists in `prompt.js` as dormant
  export. Smoke test green at 75s / 6K tokens (down from 280s /
  16K tokens of legacy `buildSystemPrompt`). Not yet wired into
  live generation.

- **Phase 5.4.3a** — Typed-collection migration. Player and
  library code migrated from flat `assessItems[]` to typed
  collections. `migrateLegacyScenario.js` runtime shim converts
  legacy-shape output to typed-collection shape. Six built-in
  scenarios (SC1-SC6) migrated in place.

- **Phase 5.4.3b Commit 1** (2026-05-13 to 2026-05-18) — Haiku
  prompt embedding. Two new functions:
  `buildPerItemExplanationPrompt()` (per-item why/fb slots) and
  `buildDeepDivePrompt()` (debrief physiologyDeepDive content
  slots). Legacy `buildDeepDivePrompt()` renamed to
  `buildMarkForReviewDeepDivePrompt()`. New
  `src/lib/ai/userMessages.js` with helpers
  `buildPerItemUserMessage()` and `buildDeepDiveUserMessage()`.
  Smoke tests added: `scripts/per-item-smoke-test.mjs`,
  `scripts/deep-dive-smoke-test.mjs`. Prompt soft-limit framing,
  two worked examples in deep-dive prompt for cache eligibility,
  deep-dive length targets revised to 250-600 word soft target /
  800 soft ceiling based on smoke-test reality. Documentation
  only impact on production behavior — neither prompt is wired in
  yet.

### Phase 5.4.3b Commit 2 (in design, not yet implemented)

Architecture locked in `docs/phase-5-lazy-generation/08-dispatcher-architecture.md`.
Implementation pending.

Scope:
- New file `src/lib/ai/dispatcher.js` with wave-based orchestration
- Modify `playerStore.js` to add dispatcher actions and state
- Modify `ScenarioPlayer.jsx` to call dispatcher on mount, gate
  Assess on wave 1
- Modify `Debrief.jsx` to render `physiologyDeepDive[]` shape
  and call deep-dive wave
- Modify `explanationSlots.js` (or `slotResolve.js`) to add
  `collectAllNullSlots()` walker
- Delete legacy `fetchExplanations()`, `_buildExplanationUserMsg()`,
  `_explanationSingleCall()` from `client.js`
- Delete deprecated `buildExplanationPrompt()` from `prompt.js`
- New smoke test: `scripts/dispatcher-smoke-test.mjs`

After Commit 2 lands, the lazy-fetch pipeline is fully built but
still not wired in production. Phase 5.4.4 wires the orchestrator
into the live generation path, at which point Commit 1+2's
pipeline becomes load-bearing.

## Built-in scenarios

- SC1 — Fussy infant (tier 1)
- SC2 — Vomiting toddler (tier 2)
- SC3 — Asthma crisis (tier 2)
- SC4 — Infant septic shock with hypoglycemia (tier 2)
- SC5 — Mira / RSV bronchiolitis HFNC failure (tier 2)
- SC6 — Wren Okafor / opioid overdose (tier 2)

All six are migrated to schema 5.4.1 with populated why/fb/content
fields. They gate out of the dispatcher via `sc.source !== "ai"`.

## Pending work and decision log

### Phase 5.4.3b Commit 2 — Wave dispatcher (current)

Per `08-dispatcher-architecture.md`. Five waves, fire-and-forget
on scenario load, first-time-only gate so replays are no-ops,
per-wave persistence debouncing.

### Phase 5.4.4 — Orchestrator wiring + UI work

- Wire `buildOrchestratorPrompt()` into live generation path
  (replace `buildSystemPrompt()` in `BuilderForm.go`)
- Add Level 1 cross-model verification (Sonnet verifier on
  Haiku output) per CODE_TODO entry from 2026-05-13
- Per-chip loading shimmer (currently only global header pill
  exists) per DESIGN_TODO entry
- Phase 1 gating UX details (button label, spinner, progress
  indication)
- TL;DR collapsible UI in new debrief layout per DESIGN_TODO
  entry
- Deep-dive length validation across diverse topics per
  CODE_TODO entry from 2026-05-18

### Phase 5.4.5 — Deep-dive migration

Migrate Mark-for-Review session deep dives from Sonnet to Haiku
(cost reduction). `buildMarkForReviewDeepDivePrompt()` rewritten
for Haiku, `expandMarkedItems()` updated.

### Phase 5.4.6 — Cleanup

Delete remaining legacy code paths. Migrate built-in scenarios
to use `debrief.physiologyDeepDive` shape.

### Phase 5.5+ — Level 3 deterministic validators

Per CODE_TODO entry from 2026-05-13. Regex-based domain
validators for dosing patterns, guideline citations, threshold
claims.

### Beyond — Directorial mode, multi-round scenarios, etc.

Original handoff doc roadmap items, deferred until lazy
generation infrastructure is solid in production.

## Key principles established

- **Design before implementation.** Every major work unit is
  locked via a design doc in `docs/phase-5-lazy-generation/`
  before any code is written. Smoke tests gate before commit.
  Diagnose-before-fix discipline. Two-commit pattern for
  separable concerns.

- **Clinical accuracy verification beyond the prompt.** AI
  output is not trusted blindly. Reference tables in the
  per-item Haiku prompt anchor common values; cross-model
  verification and deterministic validators are scheduled for
  Phase 5.4.4 and 5.5 respectively. Periodic clinical audit by
  a real pediatric critical care colleague is the ongoing
  practice.

- **Loyalty to user-stated facts.** AI scenarios honor every
  user-stated demographic, allergy, comorbidity, pre-arrival
  intervention. Never invent contradicting facts.

- **Soft-limit framing on length.** Hard limits cause
  truncation; soft limits with explicit upper bounds and
  "never truncate mid-sentence" rules produce better output.

- **Prompt caching is mandatory for cost.** Both Haiku prompts
  are sized ≥4,096 tokens for cache eligibility. Worked
  examples earn their token cost as calibration data AND
  cache padding.

- **No pushing during sessions.** Sebastian commits manually
  after reviewing diffs and smoke test outputs. Claude Code
  never pushes. Push happens at clean stopping points only.

- **Vercel Pro 300-second function timeout** is the hard
  architectural constraint driving generation design.

## Resume prompts for new sessions

If starting a new conversation to continue Commit 2 design or
implementation:

> Phase 5.4.3b Commit 1 has shipped (per-item + deep-dive Haiku
> prompts embedded, user-message helpers added, smoke tests in
> place). Read `docs/BLOCK_WARD_HANDOFF_2026-05-18.md` end-to-end.
> Then read `docs/phase-5-lazy-generation/08-dispatcher-architecture.md`
> end-to-end. Commit 2 is the wave-based dispatcher implementation
> per that architecture doc. We are currently at: [whatever state
> you're at].

If starting a new conversation to continue Phase 5.4.4 work:

> Phase 5.4.3b is complete (both commits shipped). Read
> `docs/BLOCK_WARD_HANDOFF_2026-05-18.md` end-to-end. Then read
> `docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md`
> and `docs/phase-5-lazy-generation/08-dispatcher-architecture.md`.
> Phase 5.4.4 wires the orchestrator into live generation.
