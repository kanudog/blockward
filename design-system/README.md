# Block Ward — Design System bundle

Self-contained component previews for the avatar-driven focused-exam + "Midnight Neon" UI work,
ready to push to a claude.ai/design project for visual editing.

**Spec:** `docs/superpowers/specs/2026-06-19-avatar-focused-exam-design.md`

Each `.html` is a standalone preview with a first-line `<!-- @dsCard group="…" -->` marker that the
Design System pane reads to build its card index.

| File | Group | What it is |
|---|---|---|
| `foundations.html` | Foundations | Midnight Neon palette, glass, buttons, chips, type |
| `avatar.html` | Avatar | the real `PatientSVG` with keyword-driven accessories |
| `focused-exam-screen.html` | Focused exam | the center-stage exam-screen layout (3-part assess phase) |
| `exam-animations.html` | Exam animations | starter set: pupils · breathing · cap-refill · GCS · skin |
| `finding-library.html` | Finding library | starter set: deformity · open fracture · GSW · angioedema · diaphoresis · petechiae |
| `lab-section.html` | Labs | Option-A grouped-by-tube labs (BD Vacutainer colours) |

The two animation sets are **seeds of a growing registry** (~20 keyed renderers plus build-time
custom generation for findings outside the library), not the finished database — see spec §6–§7.

## Syncing to Claude Design

The CLI session's env-supplied token can't carry design scopes, so:

1. Run `/login` in the session to grant claude.ai design access.
2. Then either run `/design-sync`, or have Claude push these via the `DesignSync` tool
   (list/create a design-system project → `finalize_plan` over `design-system/**` → `write_files`).
