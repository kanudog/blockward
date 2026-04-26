# Phase 2.6 — Complete

Autonomous execution of Sebastian's 19-fix testing list, batched into 10 groups. 11 commits on `main`, no pushes. All builds green.

## Commits

| Group | Commit  | Summary                                                    |
|-------|---------|------------------------------------------------------------|
| A     | 33cd99f | wording and label refinements                              |
| B     | f232533 | AI prompt refinements + `**bold**` parser in TextBlock     |
| C     | ef2a8be | validator auto-correction and improved logic               |
| D.1   | 7673e42 | markedForReview store + WhyModal Mark button               |
| D.2   | f826915 | deepDive expansion of marked items in debrief              |
| E     | b7517a0 | hide vital sign coloring until user assesses               |
| F     | fb9dbb8 | tile-grid assessment + selectable findings                 |
| G     | dfcb4e7 | remove confusing in-play correct/total counter             |
| H     | f7c1dfe | reassessment layout + recovered avatar                     |
| I     | 7bb234d | debrief sections collapse per-item by default              |
| J     | 2b1d5cb | builder progress + post-build modal + new-at-top           |

## Group outcomes

**Group A — Wording.** Pre-assess header "EMS Report" → "Report". Pre-submit progress strip "Tap items you think are abnormal" → "Tap abnormal findings". `ivKit` label "Establish IV/IO" → "Establish or Confirm IV/IO Placement". TOOLS dictionary split: `bvm` is now active "Begin Bag-Mask Ventilation"; new `bvmReady` is preparatory "Bring Bag-Mask to Bedside". SC1 seizure curveball and SC3 asthma escalation switched to `bvmReady` (their feedback already described preparatory behavior). SC3 tension pneumothorax curveball kept `bvm` because the ok:false teaching is specifically about the danger of active bagging there.

**Group B — Prompt refinements.** Five new sections in the system prompt: WHY-FIELD FORMATTING (overview + dash-bullets + `**bold**`), ETIOLOGY VS PRESENTATION (sepsis caused by infection, not by hypoglycemia/fever; same for hypovolemic shock and anaphylaxis), INTERVENTION VERB CHOICE (preparatory vs active verb examples), INTERVENTION VARIETY (8-10 scenario-specific options per action phase), TOKEN BUDGET (depth over breadth in curveball; no duplicated teaching content). TextBlock extended with a 6-line `renderInline` helper that splits on `**` and alternates `<strong>` / plain spans.

**Group C — Validator.** Decisions are now classified into three kinds:
- **autocorrect**: value verifiably within stated normal RANGE → `applyAutocorrections()` sets `bad: false` in-place before render.
- **warning**: single-sided threshold likely misparsed (parser found lo=N but value is ≥1.5× lo, or vice versa). Keeps the flag, logs warning.
- **ambiguous**: surfaced to UI via `scenario._validatorWarnings`, no mutation.

Threshold parser hardened to accept "normal range A-B", "normal: A-B", "between A and B", "exceeds N", ">=N", "less than N". New `validateCounts()` flags triage phases with fewer than 6 items or fewer than 3 per category. Renamed `scenario._warnings` → `_validatorWarnings`.

**Group D — Mark for Review (new feature).** End-to-end flow:

1. Player marks an item in any WhyModal popup (signs, labs, assess items). Toggle adds to `playerStore.markedForReview` with `{id, label, type, originalWhy}`.
2. When the user reaches the Debrief, a `useEffect` fires `expandMarkedItems(scenario, items)` against `/api/generate` with `mode: "expand_marked_items"`.
3. The API endpoint tags the Google Forms log with `[expand_marked_items]` and proxies the request to Anthropic with the `buildDeepDivePrompt()` system prompt.
4. The deep dive system prompt asks for 3-5 paragraph extensions per item — physiology depth, clinical pearls, common pitfalls, mnemonics, algorithm fit — formatted with the same micro-format the WhyModal/TextBlock parser expects.
5. The Debrief renders a top-most "Marked for Review" collapsible section (default expanded), with a loading state while the call is in flight, an error banner with Retry on failure, and a fallback to the original `why` text if the deep dive cannot be generated.

Files touched: `src/stores/playerStore.js`, `src/components/shared/WhyModal.jsx`, `src/components/player/{SignCard,BodySystemsView,LabPanel,AssessPanel,Debrief}.jsx`, `src/lib/ai/{prompt,client}.js`, `api/generate.js`.

**Group E — Vital color reveal.** VitalsDisplay accepts a new optional `reveal` prop (undefined/true → all colored, false → all white, object → per-key reveal). AssessPanel computes per-key reveal from `flags` + `showFb`: pre-submit, only vitals whose assess item the user has flagged are colored. Other call sites (intro, phase, act, cb-*, recovery, reassess) omit the prop and stay all-revealed.

**Group F — Tile grid + selectable findings.** AssessPanel renderItem rewritten as a compact tile (~78 px tall, corner indicators for Flag pre-submit, Check/X post-submit, small Why? pill bottom-right). Section grids responsive: 2 cols at <768 px, 3 at 768 px+, 4 at 1024 px+. Clinical findings use the same renderer (selectable; the new tile pattern makes it obvious). Mini-SVG illustrations dropped (won't fit cleanly; visual polish reserved for Claude Design). Prompt now requires AT LEAST 3 items per category (vital/lab/clinical) — minimum 9 total in Phase 1.

**Group G — Counter removed.** The in-play `score.c/score.t` running tally was deleted: it leaked partial-correct feedback as the user tapped through (24/32 → 23/32 after a wrong pick) and had no label. The final score is shown in debrief. A code comment in ScenarioPlayer suggests a stage indicator ("Triage 2 of 3") for future replacement — never a score number mid-play.

**Group H — Reassessment layout.** Stage stacks vertically now: Reassessment pill → recovered avatar (PatientSVG with `status="stable"` + `emotion="happy"`) → narrative glass card → vitals monitor → systems list → Continue. Same template renders for built-in and AI scenarios.

**Group I — Debrief per-item collapse.** Findings You Caught, Findings You Missed, and Lab Review are now per-item collapsible (label + phase visible by default; tap to expand the why text). Marked for Review (Group D) keeps default-expanded since the user explicitly asked to revisit those.

**Group J — Builder UX.** BuilderPreview shows an estimated-time progress bar (30s default, 60s for cbMode) capped at 95%. After scenario builds, a Modal pops with title + tagline and "Return to Dashboard" / "Play Now". App.jsx's `addC(s, opts)` accepts `{play: bool}` to route accordingly. `scenariosStore.addCustom` and `addCustomIfNew` now PREPEND so newly-built and imported scenarios land at the top of the list.

## Mark for Review — end-to-end

```
WhyModal opens
  ↓
user clicks "Mark for Review"
  ↓
playerStore.toggleMarkForReview({id, label, type, originalWhy})
  ↓
…(scenario continues)…
  ↓
Debrief mounts
  ↓
useEffect: if markedForReview.length > 0:
  expandMarkedItems(scenario, markedForReview, signal)
    → POST /api/generate with mode: "expand_marked_items"
    → server logs [expand_marked_items] PROMPT_PREFIX
    → server proxies to Anthropic with buildDeepDivePrompt() as system
    → response: {items: [{id, deepDive}]}
  ↓
Debrief renders top "Marked for Review" section:
  - loading spinner while in flight
  - parsed deepDive (with bullets + bold) when done
  - error banner + Retry button on failure
  - fallback to originalWhy if deepDive unavailable
```

Files: `src/stores/playerStore.js`, `src/components/shared/WhyModal.jsx`, `src/components/player/{SignCard,BodySystemsView,LabPanel,AssessPanel,Debrief}.jsx`, `src/lib/ai/{prompt,client}.js`, `api/generate.js`.

## Validator behavior summary

| Scenario / case                                                        | Phase 2.5 behavior          | Phase 2.6 behavior                                       |
|------------------------------------------------------------------------|-----------------------------|----------------------------------------------------------|
| `bad:true`, value within parsed normal RANGE (e.g., SBP 82 in [80-110])| Warn, do nothing            | **Auto-correct** (bad → false), info log                 |
| `bad:true`, single-sided lo, value ≥ 1.5× lo                           | Warn (false positive)       | Warn but classify as misparsed-threshold; flag stands    |
| `bad:true`, single-sided lo, value within ~lo                          | Warn                        | **Ambiguous** — surfaced via `_validatorWarnings`        |
| `bad:true`, value violates parsed range/threshold                      | No warning                  | No warning (correct)                                     |
| Phase has < 6 items or < 3 per category                                | No warning                  | New count warning per missing category                   |

## Prompt changes worth testing across multiple scenarios

The prompt grew significantly across A, B, F, G this phase. These additions should produce visible behavior changes — worth generating a handful of varied scenarios to verify:

1. **WHY-FIELD FORMATTING** (B1) — every `why` field should now have an overview paragraph + blank line + dash bullets + `**bold**` terms. The bold parser ships in TextBlock; if the AI ignores the format, content still renders, just without bold.
2. **Etiology vs presentation** (B2) — verify generated scenarios no longer say things like "sepsis caused by hypoglycemia." The constraint is asserted but model adherence is not enforceable from outside.
3. **Intervention verb choice** (B3) — verify the AI uses "Bring X to Bedside" / "Begin X" when contextually appropriate, including correct use of `bvmReady` vs `bvm`.
4. **Intervention variety** (B4) — verify scenario-specific intervention pools (GSW, sepsis, asthma, anaphylaxis, etc.) instead of the recurring 5-7 set.
5. **Per-category 3+** (F3) — verify Phase 1 has 3+ vital/lab/clinical items each. validateCounts will warn if not.
6. **Reassessment** + **stabilizationSummary** (carryover from 2.5) — still required; check that generated content fits the verbatim-display contract.
7. **Patient name diversity** (carryover from 2.5) — already had a name hint; reinforced. Test by generating 5 scenarios in a row and confirming names vary.
8. **Token budget** (B5) — verify curveball mode scenarios complete without `stop_reason: "max_tokens"`.

## Followups discovered during this work (not implemented)

- **`bvmReady` icon distinction is minimal** — added a small ready-marker dot on the standard BVM glyph. A real visual differentiation should come from Claude Design's avatar/icon pass.
- **Validator warning UI is still a vague toast** ("N content warnings — see console"). With `_validatorWarnings` now structured per-decision (autocorrect / warning / ambiguous), an inline banner at scenario start could show actual contradictions.
- **Counter removal left a 1-px spacer** in the header. If a stage indicator ("Triage 2 of 3") is added later, replace the spacer.
- **Per-item collapse state** (Group I `itemExp`) does not persist if the user reopens a different section and comes back. Acceptable for short debrief sessions.
- **Mini-SVG illustrations** were removed from the assess tiles. If Sebastian wants those visual cues back, they need a smaller layout (e.g., 24×24 in the tile corner) — that's a Claude Design decision.
- **Modal-formatting parser is line-based**, so `**bold**` markers that span multiple lines (rare but possible from the AI) won't render. If observed in real generations, switch to a token-stream parser.
- **Bag-mask split (A4) only updated 2 of 3 built-in BVM occurrences.** SC3 tension-pneumo curveball intentionally kept `bvm` because the teaching is specifically about the danger of *active* bagging. Verify in playthrough this still reads correctly.
- **`expandMarkedItems` does not cache.** If the user re-enters the debrief (e.g., backs out and replays), it re-fires the expensive deep-dive API call. Consider caching by scenario ID + marked-item-set hash.
- **Group H reassessment** layout changed from horizontal split to vertical stack. On wide desktop screens this may feel under-utilized; the brief explicitly asked for narrative-on-top so the stack is correct, but a max-width on the inner content might tighten it visually.
- **WhyModal's Mark for Review button** doesn't disappear when `item` is null (it's gated, so it doesn't render). But if a popup happens without an item — currently no caller does this — the Mark button is silently absent. That's intentional but not documented in the WhyModal API.
- **Counter removal** means there is no in-play feedback at all about progress through the scenario. A simple stage progress bar in the header (e.g., 4 dots: Intro · Assess · Intervene · Recover) might be a better replacement than the score number, without leaking answers.

## Build

Final: clean build, 1780 modules, ~378 KB / 116 KB gzipped. Bundle grew from 365 KB at the start of 2.6 to 378 KB — 13 KB for Mark for Review, the validator improvements, and the new tile/progress UIs.

Nothing pushed. Ready for Sebastian's review.
