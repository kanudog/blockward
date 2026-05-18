# Block Ward — Code TODO

Working notes on architectural decisions, in-flight phase work, and pending engineering follow-ups. Entries in reverse chronological order.

**Visual / CSS / styling issues belong in `DESIGN_TODO.md`, not here.**

---

## 2026-05-13 — Clinical verification gap, scheduled for Phase 5.4.4+

Sebastian raised a real concern during Phase 5.4.3b prompt design
work: AI-generated clinical content has no verification layer
beyond the prompt's own accuracy guardrails (Section 17 of the
per-item prompt, Section 8 of the deep-dive prompt). The prompts
instruct Haiku not to fabricate numbers, but rely on Haiku's
compliance rather than enforcing it structurally.

Risk profile: scenarios are played by RNs and medical students who
trust the content. A wrong dose, threshold, or mechanism doesn't
just confuse — it could shape bedside response. At scale (e.g.,
100 users × 10 scenarios × ~25 explanations + ~3-5 deep dives per
scenario), a 1% AI error rate produces ~300 wrong claims in the
wild.

This is a known limitation acknowledged at commit time of Phase
5.4.3b. Mitigation is scheduled as follows, in priority order:

**Phase 5.4.4 — Level 1 verification (cross-model check).**
- Add a verification pass after Haiku emits an explanation or
  deep-dive containing numerical claims.
- Use Sonnet as the verifier with a prompt like: "Identify any
  specific number, dose, threshold, or mechanism claim in the
  following pediatric clinical explanation that cannot be verified
  against current PALS/AAP/ISPAD guidance. Flag uncertain
  claims."
- Reject and regenerate on flagged outputs (max 1 regenerate per
  slot to avoid infinite loops).
- Cost impact: roughly 30% more API spend per scenario; 1-2
  additional seconds of latency per flagged slot.
- Implementation should hook into the dispatcher between Haiku
  emission and slot persistence.

**Phase 5.4.4 or 5.4.5 — Level 2 tightening of accuracy
guardrails (prompt-level).**
- Tighten Section 17 (per-item) and Section 8 (deep-dive) from
  guidance ("don't invent specific numerical claims") to a
  structural rule: every numerical claim must be either (a) a
  value from the prompt's reference tables (Sections 10-14 of
  per-item), or (b) explicitly cited to a current guideline by
  name and year, or (c) replaced with directional language
  ("markedly elevated," "above the age-appropriate range").
  Halfway measure relative to Level 1; cheaper but partial.

**Phase 5.5+ — Level 3 deterministic domain validators (dispatcher
layer).**
- In the dispatcher, after Haiku emits an explanation, run
  deterministic checks on content before persisting.
- Regex for mg/kg dosing patterns → parse and cross-check against
  a canonical doses lookup table (the same table embedded in
  Section 13 of the per-item prompt; reuse rather than duplicate).
- Regex for guideline citations → reject if year doesn't match
  authorized list (PALS 2020/2025, AAP 2014/2017, PECARN 2018,
  ISPAD 2022, ABEM 2024, etc.).
- Regex for specific threshold claims (cap refill, glucose,
  lactate, vital ranges) → cross-check against canonical
  thresholds.
- Catches deterministic errors automatically; does not catch
  mechanism errors (Level 1 needed for those).

**Ongoing — Level 4 periodic clinical audit (lightest weight,
biggest assurance).**
- Sebastian is the sole developer and self-identifies as not a
  clinical educator. He is not the right clinical reviewer for
  AI-generated output.
- Cultivate one or two pediatric critical care colleagues
  (attending or clinical pharmacist) willing to review 20-30
  sampled outputs per quarter.
- Document errors found, update the prompt's reference blocks to
  address recurring patterns.
- Cadence: quarterly when stable, monthly while iterating.

**Phase 5.4.4 or later — Deep-dive length validation across
diverse topics.**

Smoke testing during Phase 5.4.3b Commit 1 used one topic
(compensated vs decompensated shock on SC1) across four prompt
iterations and produced body lengths of 807 → 667 → 787 → 907
words. Each explicit ceiling raise produced a proportional
output expansion, suggesting Haiku treats stated upper bounds
as targets-to-approach rather than avoid-thresholds.
Single-topic testing cannot distinguish topic-driven length
from prompt-driven length.

Action when 5–10 diverse topics have produced real outputs in
production:
- Sample deep-dive outputs across topic categories (metabolic,
  hemodynamic, respiratory, neurologic, toxicologic)
- Measure the median and spread of body length per category
- Compare against learner-experience feedback on debrief
  reading depth
- Revise the prompt's length numbers if the empirical
  distribution diverges meaningfully from the current 250–600
  target band

Two specific things to watch for in production:
- Whether 800+ word deep-dives feel onerous in the actual
  debrief UI (where TL;DR will be collapsible per the
  DESIGN_TODO entry)
- Whether Haiku's "write toward the ceiling" behavior persists
  across topics or was an artifact of the test topic

Specific error class observed during Phase 5.4.3b design that
motivated this entry: Claude Opus 4.7 (assistant in design
session) conflated the BHB:acetoacetate ratio in normal/mild
ketosis (3:1) with the DKA-specific ratio (6:1-12:1) when drafting
a worked example for the deep-dive prompt. Plausible-sounding
number, directionally right, specifically wrong for clinical
context. Caught only because Sebastian pushed back and asked for
verification. If Opus 4.7 makes this class of error during design
review, Haiku will make versions of it during production. The
verification layer is what catches this class of error.

---

## 2026-05-13 — Phase 5.4.3a observations for future cleanup

Two pre-existing bugs surfaced during manual verification of the typed-collection migration. Both are not 5.4.3a regressions but should be addressed before Phase 5.4.4 (or alongside it, before curveball is re-enabled).

Bug 1 — Mark-for-Review keying lacks phase context. The marked-entry id is type-prefixed but not phase-scoped (e.g., "tool:glucometer" rather than "tool:glucometer@phase[1]"). When the same tool or med id appears in two phases (notably curveball + regular), marking it in the first phase causes the same item to display as already-marked in the second. Proposed fix: include phaseIdx in the marked-entry id. Origin: Phase 2.6.3.

Bug 2 — Eager deep-dive call has no per-slot in-flight guard. Rapid mark/unmark/mark click sequences fire expandSingleMarkedItem twice for the same slot. No crash, just wasted API calls. Proposed fix: track pending promises per slot id in playerStore; skip new fires when one is in flight. Origin: pre-existing.

Both bugs traced to ActionPanel.jsx mark handling logic and playerStore.toggleMarkForReview — both files untouched by Phase 5.4.3a.

---

## 2026-05-08 — Phase 5.4.2 complete, smoke test green

Phase 5.4.2 (orchestrator prompt design and implementation) is complete and committed locally:

- Schema 5.4.1 locked: docs/phase-5-lazy-generation/04-skeleton-schema-v1.md
- Orchestrator prompt design locked: docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md
- Registry additions: commit 53c406e (vsMonitor universal, woundPacking + extremityElevation trauma)
- buildOrchestratorPrompt() added to src/lib/ai/prompt.js as dormant export (27,534-char prompt, +275 lines, no wiring)

Smoke test results (test scenario: 6yo septic shock):

- Generation time: 75 seconds (down from 280s legacy baseline, 27% of prior)
- Output tokens: 6,043 (down from ~16,000 legacy baseline, 38% of prior)
- Schema conformance: 61 of 61 slot refs correct, 100% null compliance on why/fb/content
- Clinical accuracy: weight-based doses arithmetically correct, Henderson-Hasselbalch internally consistent, pack selection matches pathology
- Voice landed (bedside-clinician tone, not textbook)
- vsMonitor correctly adopted as default monitoring tool

Open architectural decision for Phase 5.4.3+:

The existing player/library code reads from flat phase.assessItems[] with a cat discriminator. Schema 5.4.1 outputs typed collections (phase.vitals[], phase.signs[], phase.labs[]). These shapes are incompatible. 14 read sites across 5 files (slotResolve.js, canonicalize.js, explanationSlots.js, validate.js, ScenarioPlayer.jsx, Debrief.jsx) plus 42 cat literals in builtIn.js will need to be addressed before 5.4.1 scenarios can render in the player.

Two options:

- Path A: Migrate read sites to typed-collection iteration. Cleaner long-term, removes demultiplexer logic, but expands Phase 5.4.4 scope significantly.
- Path B: Add a migrateLegacyAssessItems() adapter at load time. Faster to ship, but carries permanent legacy-shape tech debt.

Decision deferred to next session. Both paths are technically viable.

Next phases planned:

- 5.4.3: Haiku fan-out dispatcher with staggered cache warmup (call #1 alone to warm cache, then parallel fan-out at discounted rate)
- 5.4.3.x or 5.4.4: assessItems migration (Path A or B)
- 5.4.4: Wire buildOrchestratorPrompt() into live generation entry point
- 5.4.5: Migrate eager deep dives Sonnet → Haiku (cost reduction)
- 5.4.6: Cleanup, delete legacy code paths
