# Block Ward — Design TODO

A running list of visual, CSS, and styling issues to be addressed by Claude Design.
**Functional bugs and logic issues belong in `CODE_TODO.md` or a Phase prompt for Claude Code, not here.**

---

## How to use this file

- Add new items as you find them, with the date and the screen/component they affect.
- When an item is fixed, move it to the "Resolved" section at the bottom with the date and commit hash.
- Group related items so they can be fixed in a single design pass.
- Include screenshots in `/design-notes/` if a visual reference helps.

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

---

## Open items

### Phase 2 (Intervention) screen

- **"Why?" popup background is transparent** — popup overlays directly on the page content, making the text nearly unreadable. Needs an opaque (or near-opaque) dark background with a defined edge/border. Phase 1 popup renders correctly; reference that styling.
  *Found: 2026-04-25, scenario: pediatric abdominal GSW.*

- **"Mark for Review" and "Close" buttons in popup are transparent** — same root cause as above; both buttons need a solid background to be visible against the popup content.
  *Found: 2026-04-25.*

- **Intervention tiles do not match Phase 1 grid layout** — Phase 1 abnormal-findings uses a clean uniform tile grid; Phase 2 tools/meds are laid out differently. Should be visually consistent across phases.
  *Found: 2026-04-25.*

### Vital signs monitor (all screens)

- **HR/SpO2/Temp values are colored (green/yellow/red) — should all be white.** Color-coding values reads as alarm states and adds visual noise. Real bedside monitors do use color but this UI's aesthetic calls for uniform white.
  *Found: 2026-04-25.*

- **VS monitor stretched/elongated on reassessment screen** — aspect ratio breaks on this screen specifically. Phase 1 and Phase 2 render correctly. Likely a flex/width container issue on the reassessment layout.
  *Found: 2026-04-25.*
  *Note: this may be a layout bug (Claude Code) rather than pure styling — flag for investigation.*

### Popup typography

- **Bolded key terms need a contrast color, not just bold weight.** Currently terms wrapped in `**asterisks**` render as bold but in the same color as body text, making them hard to distinguish at a glance. Suggest a warm accent color (amber? teal?) that works against the dark background.
  *Found: 2026-04-25.*

---

## Resolved

*(Move items here with date + commit hash when fixed.)*
