# Block Ward — Code TODO

Working notes on architectural decisions, in-flight phase work, and pending engineering follow-ups. Entries in reverse chronological order.

**Visual / CSS / styling issues belong in `DESIGN_TODO.md`, not here.**

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
