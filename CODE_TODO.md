# Block Ward — Code TODO

Working notes on architectural decisions, in-flight phase work, and pending engineering follow-ups. Entries in reverse chronological order.

**Visual / CSS / styling issues belong in `DESIGN_TODO.md`, not here.**

---

## 2026-05-29 — Per-item why-text clinical inconsistency (found in bug-sweep smoke)

During the bug-sweep Batch 1 smoke (6yo septic shock from CAP,
"Nizhoni Runningwater"; scratch copy at `nizhoni-sepsis-smoke.json`),
the orchestrator's `bad` flags were all consistent, but the Haiku-
generated `why` paragraphs contradicted each other on the same patient:

- phase[0] **BP** why (correct): "76 mmHg is 6 points below the
  hypotension threshold of 70 + (2 × 6) = **82** … decompensated shock."
- phase[0] **Cap Refill** why (wrong formula): "hypotension in a 6yo is
  **<90 + 2×6 = <102** mmHg." Right conclusion, wrong threshold formula.
- phase[1] **Skin & Perfusion** why (contradiction): "her BP **still
  being above** the hypotension threshold (76 mmHg is above 70 + 2×6)" —
  76 < 82, so she is hypotensive; this says compensated, contradicting
  the BP card.

Correct, unambiguous: pediatric hypotension threshold (1–10y) =
70 + (2 × age); for a 6yo that's 82 mmHg; 76 < 82 → decompensated.
The "90 + 2×age" form is the ~50th-percentile/normal SBP, not the
hypotension threshold — the two got conflated.

This is the per-item (`why`/`fb`) generation consistency gap, not a
player or orchestrator-skeleton bug. It is the failure class already
logged for the deferred cross-model verification layer (see the
2026-05-13 "Clinical verification gap" entry, Level 1). Two mitigation
paths, in increasing cost:
- **Prompt-level (cheap):** add an explicit rule to the Haiku per-item
  prompt — "pediatric hypotension threshold = 70 + (2 × age in years);
  classify compensated vs decompensated consistently against it; do not
  use 90 + 2×age as a hypotension cutoff." Also instruct that per-item
  reasoning must not contradict the scenario-wide perfusion state.
- **Structural (Level 1 verifier):** the deferred Sonnet cross-check
  between Haiku emission and slot persistence would catch this class.

Deliberately kept OUT of the current bug sweep to avoid scope creep.
Track here; tackle alongside the Level 1 verification work.

---

## 2026-05-27 — Phase 6.2b.3 shipped

Orchestrator live in production. Generation time confirmed ~95s
(was ~280s). 6.2b.4 queued for content fixes: BP shape, lab
variety, pediatric refs, why-card formatting.

---

## 2026-05-26 — Phase 6.1 shipped (Player Shape Migration)

The player and supporting code now consume the orchestrator's
output shape (schema 5.4.1) natively. The orchestrator itself is
still dormant — Phase 6.2 wires it in — but the shape contract is
locked in code, validated by the dispatcher smoke test, and
exercised end-to-end via `migrateLegacyScenario` for every
built-in and every pre-migration localStorage scenario at load
time.

What changed:
- `migrateLegacyScenario.js` — now multi-pass: assessItems → typed
  collections (Phase 5.4.3a behavior, retained), vitals object →
  array, numeric `.pri` → string `.priority` enum on action entries
  (with `.pri` backfilled for legacy reads), drops top-level
  `phase.tools[]`/`phase.meds[]` id arrays, synthesizes
  `debrief.keyTeaching[]` from legacy `explainers[]`. Each step is
  idempotent so orchestrator-shape input passes through unchanged.
- `canonicalize.js` — added `vitalsLookup()` helper that normalizes
  array-or-object vitals to id-keyed lookup form. `buildBadMap`
  walks both shapes defensively.
- `playerStore.js` — `vit` state is stored in lookup form via
  `vitalsLookup()` at every entry point so VitalsDisplay /
  AssessPanel keep reading `vit.hr` style accessors unchanged.
- `ScenarioPlayer.jsx` — `findVital()` and `actionIds()` helpers;
  Submit snapshotting walks the array form; ActionPanel call sites
  (phase + curveball) derive id arrays from `actions.tools/meds`.
- `ActionPanel.jsx` — `PRIORITY_RANK` + `priorityRank()` helper;
  the popup priority badge prefers the string enum and falls back
  to legacy numeric `.pri`.
- `AssessPanel.jsx` — "Open Tool Belt" label now derives from
  `ph.actions.tools` presence instead of the deleted `ph.tools[]`.
- `Debrief.jsx` — new "Key Teaching" bullets block above the deep-
  dive cards, populated from `sc.debrief.keyTeaching[]`. Renders
  nothing when missing.
- `validate.js` — schema check rewritten for array vitals + object
  actions with string priority. `_iterPhaseItems` walks the array
  shape. Debrief subfields validated (keyTeaching /
  physiologyDeepDive arrays).
- `slotResolve.js` — `_findVitalById()` resolves vital slot refs
  against either array or object shape.
- `explanationSlots.js` / `userMessages.js` — vital iteration paths
  now array-first with object fallback.
- `dispatcher-smoke-test.mjs` — hand-crafted fixture updated to new
  shape (vitals as arrays, action entries with explicit string
  priority + ok). Smoke test still passes 14 calls, 5 persists.

Verification:
- Dispatcher smoke test green (live Anthropic, 14 calls, 5
  persists, cache pattern holds).
- Manual walkthrough plan: built-ins SC1, SC4, SC5 (cover
  respiratory / sepsis / trauma packs) plus a fresh AI scenario
  via the legacy buildSystemPrompt path. The legacy Sonnet path
  emits legacy shape, the migration helper upgrades it, the player
  consumes the upgraded shape.
- Grep confirmed: no live `phase.tools[]`/`phase.meds[]` reads
  remain (only comments referencing them); no numeric priority
  comparisons outside the defensive fallback in `priorityRank()`;
  no `vit.<key>` style direct reads in player code outside the
  `vit` state (always lookup form from playerStore) and the
  reassessment snapshot.

What's deferred:
- Level 1 cross-model verification (formerly the Phase 5.4.4 /
  Phase 6.1 entry below) needs to sit between the orchestrator's
  per-item Haiku emission and slot persistence. With the
  orchestrator still dormant, there's no per-item emission to
  verify yet — so this is now correctly tagged Phase 6.2+.
- **Built-ins still in legacy shape (Phase 6.3 cleanup).** SC1–SC6
  are authored in the pre-Phase-6.1 shape (vitals object, numeric
  pri, explainers[] without keyTeaching, no _slotRef on every item).
  Phase 6.1's migration runs at playerStore.start() on every play,
  converting them in-memory to the new shape. This works but has
  three costs: (a) translation runs on every scenario load — small
  but non-zero CPU; (b) translation quality is bounded by what the
  helper can infer from legacy fields (e.g. lab-label matching for
  parenthesized names like "pH (VBG)" fails to match the assessItem
  with label "pH 7.24", losing why content for that play); (c) the
  migration helper carries permanent legacy-shape branches that
  exist solely for the built-ins after persisted custom scenarios
  get re-saved.

  Better timing: rewrite the built-ins after Phase 6.2 (orchestrator
  wiring) lands. By then there will be many real orchestrator-shaped
  AI scenarios in production to use as templates, and the new shape
  will be production-validated. After the rewrite, the legacy-shape
  branches of migrateLegacyScenario can be removed and the helper
  can shrink to handling only edge cases.

  Do this as six focused commits (one per built-in), each validated
  against the player before commit. SC1 first as the simplest;
  SC2-6 in order of complexity. The migration helper stays in place
  during the work — built-ins not yet rewritten still get translated;
  rewritten ones pass through unchanged via idempotency.
- **Reassuring distractor labs have undefined `why` field, not
  null (Phase 6.4 cleanup).** Legacy Sonnet's prompt only mandates
  `why` for critical/abnormal labs. Normal labs (e.g., sodium,
  potassium, blood culture pending) come back with no `why` field
  at all. The migration helper builds `_slotRef` strings for them
  but never sets `why: null`, so collectAllNullSlots (which checks
  `item.why === null`) skips these slots. Net effect: the player's
  "Why?" button on a reassuring lab shows nothing because the
  dispatcher never fills it.

  Fix: in migrateLegacyScenario, add `out.why = null` when the
  source lab has neither a why field nor an assessItem with why.
  Mirror for signs. One-line addition per collection. Defer to
  Phase 6.4 cleanup commit alongside built-in rewrites.

- **EXPLORED COUNTER OFF-BY-ONE confirmed in Phase 6.1
  (not customMed-related).** Recurred in the Phase 6.1 sepsis test
  scenario. The metronidazole-as-customMed issue is resolved this
  run (Sonnet emitted a clean entry — likely non-deterministic),
  but the counter still reads "17/18 explored" after every tool
  and med was selected. The 18-item count is confirmed against
  the scenario JSON (9 tools + 9 meds). This rules out the
  customMed hypothesis as the root cause.

  Suspect: ActionPanel `sel` state vs. the explored count
  derivation in the player. The counter likely uses a derived
  computation that doesn't track items consistently with the
  selection set. Investigate the explored-count derivation in
  ScenarioPlayer or wherever it's computed.

---

## 2026-05-26 — Phase 6.0 manual test session findings

Four observations from the first end-to-end manual test of the
dispatcher against a live AI-generated 8yo sepsis scenario. None
block Phase 6.0; all should be addressed during Phase 6.1 or as
small follow-ups.

### Metronidazole generated as customMed instead of native pack item

The 8yo sepsis test scenario generated metronidazole correctly
(present in meds[] and actions.meds.metronidazole with ok:true,
priority:2, full fb text), but with extra fields suggesting the AI
treated it as a customMed fallback:

  "metronidazole": {
    "ok": true, "priority": 2, "fb": "...",
    "id": "customMed",            // ← shouldn't be here
    "label": "Metronidazole (Flagyl)",
    "description": "Nitroimidazole antibiotic..."
  }

Compare to ceftriaxone (correctly emitted):

  "ceftriaxone": { "ok": true, "priority": 2, "fb": "..." }

The customMed schema is the fallback for medications not in the
registry. Metronidazole IS in the registry (under
abdominal/infection packs). The AI either (a) didn't find it in the
registry context block and synthesized a customMed entry, or (b) the
prompt's customMed fallback is too easy to invoke and shadows real
registry entries.

User-facing symptom: the player's "explored" counter at the bottom
of Phase 2 showed "16/17 explored" even after the user selected
every visible item. Metronidazole was selected by the user but
tracked under a different key than expected, leaving the counter
short and the "Skip to next" button stuck enabled when nothing
remained to skip.

Fix path: tighten the system prompt's customMed guidance to require
exhaustive registry search before falling back. Likely a Phase 6.1
prompt-design item alongside the orchestrator wiring.

### Explored counter off-by-one when custom med involved

Symptom above. The "Skip to next" button label should change when
all visible items have been explored, but it remained "Skip to next"
because the counter showed 16/17. The 17th item exists in the data
(metronidazole) but was indexed differently from how the explored
tracker counts.

Likely root cause: explored counter keys on registry item id
("metronidazole"), but the customMed-formatted entry was tracked
under "customMed" or its position-index. Investigation needed
during the explored-tracker code path.

Fix path: audit ActionPanel and the explored tracker logic to ensure
both registry-shaped and customMed-shaped action entries are counted
consistently. Smaller scope than the prompt-tightening above.

### _validatorWarnings — SBP threshold parse noise

The validator in src/lib/ai/validate.js emitted a warning on the
8yo sepsis scenario:

  { itemId: "sbp", label: "BP 88", phase: "Triage",
    kind: "warning",
    message: "Value 88 is well above 5; threshold wording likely
              misparsed but flag stands." }

The why text mentions "below the 5th percentile" and the validator's
regex grabbed the literal "5" as a comparison threshold. Cosmetic
issue; the clinical claim is correct. The warning is noisy in the
data but doesn't affect rendering.

Fix path: tighten the threshold-parsing regex in validate.js to
require numeric context (e.g., ignore matches where the number is
followed by "th percentile" or similar ordinal language). Low
priority; visible only in the JSON, not in the UI.

### One 404 observed during legacy Sonnet generation

Single transient 404 during a 270-second Sonnet scenario generation
(legacy path, pre-orchestrator). All 12 follow-up Haiku and Sonnet
calls succeeded with 200 OK. The 404 is almost certainly a streaming
artifact on the long-running Sonnet call. Phase 6.1 should eliminate
the 270s call entirely by replacing it with the orchestrator path,
so this likely resolves on its own without targeted fixes. Track but
do not act unless it recurs frequently after Phase 6.1 ships.

---

## 2026-05-13 — Clinical verification gap, scheduled for Phase 5.4.4+ (Phase 6.2+)

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

**Phase 5.4.4 (Phase 6.2) — Level 1 verification (cross-model check).**
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

**Phase 5.4.4 or 5.4.5 (Phase 6.1 or 6.2) — Level 2 tightening of accuracy
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

**Phase 5.4.4 or later (Phase 6.1 or later) — Deep-dive length validation across
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

Two pre-existing bugs surfaced during manual verification of the typed-collection migration. Both are not 5.4.3a regressions but should be addressed before Phase 5.4.4 (Phase 6.2) (or alongside it, before curveball is re-enabled).

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

- Path A: Migrate read sites to typed-collection iteration. Cleaner long-term, removes demultiplexer logic, but expands Phase 5.4.4 (Phase 6.2) scope significantly.
- Path B: Add a migrateLegacyAssessItems() adapter at load time. Faster to ship, but carries permanent legacy-shape tech debt.

Decision deferred to next session. Both paths are technically viable.

Next phases planned:

- 5.4.3: Haiku fan-out dispatcher with staggered cache warmup (call #1 alone to warm cache, then parallel fan-out at discounted rate)
- 5.4.3.x or 5.4.4: assessItems migration (Path A or B)
- 5.4.4: Wire buildOrchestratorPrompt() into live generation entry point
- 5.4.5: Migrate eager deep dives Sonnet → Haiku (cost reduction)
- 5.4.6: Cleanup, delete legacy code paths
