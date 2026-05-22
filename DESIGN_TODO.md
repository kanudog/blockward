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

## Open items

### Debrief screen — physiology deep-dives (Phase 5.4.3b)

- **TL;DR rendering as expandable button** — In the new debrief
  physiology deep-dive layout (three-part content: summary +
  bulleted body + TL;DR), the TL;DR should render as a collapsed
  expandable element that the user taps/clicks to reveal, not as
  always-visible prose. Default state: collapsed, showing only the
  button label "TL;DR". Expanded state: the 1-2 sentence takeaway
  text appears in the same row, expanding inline (NOT as a modal
  popup overlay).
  *Found: 2026-05-13, deep-dive prompt design phase.*
  *Implementation note: prompt is designed to produce the TL;DR
  paragraph with a parseable `**TL;DR:**` markdown prefix; player-
  side rendering decision is independent of prompt content.*

### EMS report screen — wave 1 loading state (Phase 5.4.4)

- **"Assess" button gated on wave 1 completion** — When a
  fresh AI-generated scenario loads, the dispatcher fires wave
  1 (Phase 1 vitals/signs/labs why slots) on mount. The
  "Assess" button on the EMS report screen should be disabled
  until wave 1 completes. Estimated wait: 5-15 seconds
  depending on Haiku response time and number of slots.
  UX details to design:
  - Button label during wait (e.g., "Loading details..." or
    spinner-only)
  - Whether to show progress indication (X of Y items
    loaded) or just a generic spinner
  - Whether to render a separate "ready to begin" indicator
    when wave 1 completes
  - How to handle the rare failure case where wave 1 cannot
    complete (button stays disabled forever vs. fallback)
  *Found: 2026-05-18, Commit 2 dispatcher design.*
  *Note: replay of a scenario that's already been populated is
  a no-op for the dispatcher; this loading state only appears
  on first play.*

### Player chips — per-slot loading shimmer (Phase 5.4.4)

- **Per-chip shimmer for in-flight slots** — When the user
  advances to Phase 1 assess before wave 1 fully completes,
  or when the user enters Phase 2 before waves 3/4 complete,
  some chips will have null why/fb content. Currently there's
  only a global header pill ("Loading details") in Phase 2+.
  Per-chip shimmer should:
  - Apply to individual vital/sign/lab chips whose why slot
    is still null
  - Apply to individual tool/med action chips whose fb slot
    is still null
  - Disappear when the slot is populated (re-render triggered
    by `forceRefreshScenario`)
  - Render in modals when the user clicks "Why?" on a chip
    whose content hasn't loaded yet
  *Found: 2026-05-18, Commit 2 dispatcher design.*
  *Note: this is UI scope that complements the dispatcher;
  the dispatcher itself works without per-chip shimmer
  (chips just show empty until populated).*

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
