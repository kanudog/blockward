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

### ★ NEXT FOCUS (2026-06-12) — avatar-driven focused-exam redesign + professional UI pass

The agreed next-session overhaul. **Supersedes the "Phase 7+ — non-clickable bulleted
narration" item below** (the binary sign-flagging fairness problem is solved by this, not by
bullet lists). Full vision + the next-session prompt are in
`docs/BLOCK_WARD_HANDOFF_2026-06-12.md` ("NEXT SESSION FOCUS"). Summary:

- **Focused-exam interaction:** avatar CENTER-STAGE; exam options around it ("Check pupils",
  "Assess breathing/abdomen", "Inspect skin", "Check perfusion", …). Clicking one zooms the
  camera to that body region and plays a **scenario-specific animation of the actual finding**
  (anisocoria + a light-sweep pupillary exam; respiration at the monitor RR + retractions; etc.),
  then a popup states the professional finding. 4–5 zoomed/animated exams per scenario. No more
  right/wrong tile-flagging — it becomes an interactive exam.
- **Likely a 2D → 3D avatar.** No 3D lib installed; bundle ~313 KB gzip, no code-splitting →
  lazy-load three.js / react-three-fiber if we go 3D. Decide 2D-enhanced vs 3D first.
- **Animation system:** a library of pre-made exam animations loaded like the accessory keywords,
  PLUS a custom/generated fallback for novel findings.
- **Schema/orchestrator:** the AI emits a per-exam descriptor (region, animation + params, popup
  text, numeric values), clinically verified via the orchestrator + the Sonnet verifier.
- **Professional UI pass (prioritized):** the app reads generic/dated — finish the "Midnight Neon"
  token rollout (Stage 4) across the player/debrief screens, clear the items below, and elevate to
  a professional look (readable fonts, professional colors, polished components). A light-theme
  variant is possible. **Design first, then build.**

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

### EMS report screen — wave 1 loading state (Phase 5.4.4) (Phase 6.2)

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

### Player chips — per-slot loading shimmer (Phase 5.4.4) (Phase 6.2)

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

### Phase 1 / Phase 2 — assessment screen UX

- **Missing instructional message on assessment screen** — Phase 1
  and Phase 2 currently show vitals + systems assessment + labs with
  no header text explaining what the user is supposed to do. Add a
  one-line instruction at the top of the assessment section. Suggested
  wording: "Tap each value you believe is abnormal." Position above
  the vitals row.
  *Found: 2026-05-26, manual test of Phase 6.0.*

- **System category labels (gi, skin, neuro, etc.) should be ALL
  CAPS and bold** — currently lowercase, which reads inconsistent
  with the bedside-monitor aesthetic the rest of the UI targets.
  CSS-only change. Affects the small header above each finding card.
  *Found: 2026-05-26.*

- **Lab-draw tool icons render with a generic EKG-wave icon** —
  affects arterial blood gas, draw blood cultures, perform e-FAST
  (less critically; this is an imaging tool), perform FAST, order
  chest x-ray, order abdominal CT, call surgery. The arterial blood
  gas and draw blood cultures tools specifically should render with
  a lab-tube icon styled consistently with the rest of the
  intervention icon set. Imaging tools should get a distinct imaging
  icon. Update visualMeta.js with new icon assignments.
  *Found: 2026-05-26.*

### Phase 7+ design directions (deferred)

- **Systems assessment findings should become non-clickable
  bulleted narration, not clickable cards** — current design forces
  the user to judge "is this abnormal" against findings written as
  paragraphs where one sentence may be abnormal and four may be
  normal. The AI's bad:true|false flag on signs reflects clinical
  context (e.g., compensatory tachypnea marked bad:false because it's
  appropriate for the metabolic state), but the UI presents the same
  task as a raw "click what looks wrong" judgment. This is a fairness
  problem in the assessment task itself.

  Phase 7 redesign:
  - Render systems assessment as bullet points under the EMS
    narration (not clickable cards)
  - Keep only abnormal vitals + abnormal labs as user-judgment
    targets
  - On Phase 1 submit, synthesize a contextual "why" message that
    explains how the physical findings, vitals, and labs together
    paint the clinical picture
  - Schema impact: signs collection becomes a simpler narrative
    field with no bad/why per item; orchestrator emits a single
    `signsSummary` field per phase
  - Player UI: signs render as a styled bullet list with no click
    behavior; no Why button needed

  Trade-off: loses the "recognize abnormal physical exam" learning
  objective, but eliminates the ambiguity trap. Discussed in Phase
  6.0 test session 2026-05-26.

  *Found: 2026-05-26.*

---

## Resolved

*(Move items here with date + commit hash when fixed.)*
