# Phase 2.6 Log

One block per group as completed. Running autonomously per the brief.

## Group J — builder progress + post-build modal + new-at-top — ✅

- **Commit:** `2b1d5cb`
- J1: BuilderPreview now shows an estimated-time progress bar (0 → 95% over the estimate window — 30 s default, 60 s when cbMode on; capped at 95% so it never lies). Elapsed seconds + "~30s estimate" label below the bar.
- J2: BuilderForm holds the just-built scenario in local state. When generation resolves, a Modal pops with title + tagline and two buttons: "Return to Dashboard" and "Play Now". Click-overlay treats as Return. App.jsx addC accepts an opts arg `{play: bool}` to route to player or dash.
- J3: scenariosStore.addCustom and addCustomIfNew now prepend (`[sc].concat(existing)`) instead of append. Newly-built and imported (?shared=) scenarios appear at the top of the dashboard list.

## Group I — debrief sections collapse per-item by default — ✅

- **Commit:** `7bb234d`
- New `itemExp` state + `toggleItem(key)` helper.
- Findings You Caught — each item is its own collapsible row (label + phase + +/- icon). Items without `why` render non-clickable.
- Findings You Missed — same pattern; the "did not flag" / "flagged within normal limits" note lives behind the expansion.
- Lab Review - Critical Values Explained — each lab is a collapsible header (name + value + ref + +/-); expansion reveals the why and phase tag.
- Marked for Review (Group D) keeps default-expanded behavior since the user explicitly asked to revisit those items.

## Group H — reassessment layout + recovered avatar — ✅

- **Commit:** `f7c1dfe`
- Reassess stage now stacks vertically: pill → recovered avatar → narrative glass card → vitals monitor → systems list → Continue.
- Avatar uses PatientSVG with `status="stable"` and `emotion="happy"` so the patient looks recovered (not the distressed default that bled through into the previous layout).
- Same template renders for built-in and AI-generated scenarios — avatar is computed from sc.patient via guessAge / guessSex.

## Group G — remove in-play correct/total counter — ✅

- **Commit:** `dfcb4e7`
- Investigated: the number was `score.c/score.t` running tally — accurate but confusing. Two problems: (1) it leaked partial-correct feedback as the user tapped (24/32 → 23/32 after a wrong pick), violating the no-teaching-before-asking principle from 2.5; (2) it had no label.
- Decision: remove from in-play UI. Final score is shown in debrief. Header keeps Exit/Back on the left and the phase pill in the middle; the right slot is now an empty 1px spacer. Comment in code suggests a per-stage indicator (e.g. "Triage 2 of 3") for future work — never a score mid-play.

## Group F — tile-grid assessment + selectable findings — ✅

- **Commit:** `fb9dbb8`
- AssessPanel renderItem rewritten as a compact tile (~78 px tall) with corner indicators (Flag pre-submit, Check/X post-submit, small Why? pill bottom-right).
- Section grids: 2 columns at <768 px, 3 columns at 768 px+, 4 columns at 1024 px+, via scoped `.bw-assess-grid` media query.
- All three categories (vitals / labs / findings) use the same tile renderer — clinical findings were technically selectable before, but the new visual treatment makes that obvious.
- Removed inline mini-SVG illustrations (mottling/eye/cyan/etc.) since they didn't fit cleanly in the smaller tile. Per the brief, visual polish is reserved for Claude Design.
- Prompt: F3 changed Phase 1 assessItem rule from "6-8 items, at least 3 normal and 3 abnormal" to "AT LEAST 3 items in EACH of the three categories — minimum 9 items total." Each category mixes bad:true and bad:false.

## Group E — vital color reveal gated on assess interaction — ✅

- **Commit:** `b7517a0`
- VitalsDisplay accepts a new `reveal` prop: undefined/true (all colored), false (all white), or per-key object.
- AssessPanel computes the per-key reveal map: post-submit reveals everything; pre-submit reveals only the keys whose assess item the user has flagged. Label→key heuristic covers HR / SpO2 / RR / BP|SBP (also reveals dbp) / Temp / Cap Refill.
- Other call sites (intro, phase, act, cb-*, recovery, reassess) omit the prop and stay all-revealed — coloring on those screens is just status, not the answer.

## Group D — Mark for Review feature — ✅

- **Commits:** `7673e42` (store + button), `f826915` (deep dive)
- **Store:** `markedForReview: []` slot, `toggleMarkForReview(item)` action that adds-or-removes by id.
- **WhyModal:** new optional `item` prop. When set, the modal renders a yellow "Mark for Review" toggle below the body. Threaded through every WhyModal call site (SignCard / BodySystemsView / LabPanel / AssessPanel) with appropriate id prefixes (`sign:`, `lab:`, `assess:`) and types (vital / lab / finding).
- **Prompt:** new `buildDeepDivePrompt()` generates a system prompt for 3-5 paragraph deep dives beyond the original why, formatted with the same micro-format the WhyModal/TextBlock parser expects.
- **Client:** new `expandMarkedItems(scenario, items, signal)` posts to `/api/generate` with `mode: "expand_marked_items"` and returns `{itemId → deepDive}`. Throws on any error.
- **API endpoint:** reads `body.mode` and tags the Google Forms usage log with `[mode]` prefix.
- **Debrief:** new top-most "Marked for Review" collapsible section (default expanded). useEffect triggers `expandMarkedItems()` on mount; loading state, error state with Retry button, and fallback to original `why` content when expansion fails.
- Build: passes (1779 → 1780 modules; bundle +6 KB gzipped from D entry points).

## Group C — validator auto-correction + improved logic — ✅

- **Commit:** `ef2a8be`
- C1: New `applyAutocorrections()`. When a `bad:true` item's value lies between both bounds of a parsed normal RANGE, the validator returns kind:autocorrect and the helper sets bad:false in-place before render. SBP 82 with "normal 80-110" silently corrects.
- C2: New `validateCounts()` flags triage phases under 6 assess items or under 3 per category (vital/lab/clinical).
- C3: `validateConsistency()` returns typed decisions instead of flat warnings:
  - `autocorrect` — confident fix, applied automatically
  - `warning` — single-sided threshold likely misparsed (parser found lo=N but value is ≥1.5× lo, or vice versa)
  - `ambiguous` — surfaced to UI via `scenario._validatorWarnings`, no mutation
- Threshold parser hardened: now accepts "normal range A-B", "normal: A-B", "between A and B", "exceeds N", ">=N", "less than N".
- Renamed scenario._warnings → `_validatorWarnings` per the brief.
- Smoke-tested against all of Sebastian's cases (SBP 82, Hgb 7.2, Lactate 6.1) — each classifies as expected.

## Group B — AI prompt refinements + bold parser — ✅

- **Commit:** `f232533`
- B1: Added WHY-FIELD FORMATTING block in prompt; specifies overview paragraph + blank line + dash-bullets + `**bold**`. Forbids markdown headers / numbered lists / blockquotes. TextBlock.jsx extended with a 6-line `renderInline` helper that splits on `**` and alternates `<strong>` / plain spans.
- B2: ETIOLOGY VS PRESENTATION block. Sepsis caused by infection, not by hypoglycemia/fever/meningitis. Hypovolemic shock caused by volume loss. Anaphylaxis caused by IgE-mediated mast-cell degranulation. Distinguishes etiology / pathophysiology / presentation.
- B3: INTERVENTION VERB CHOICE block — preparatory verbs vs active verbs with explicit examples.
- B4: INTERVENTION VARIETY block — 8-10 options per action phase, scenario-specific, mix indicated and not-indicated-but-plausible. GSW and febrile-infant intervention pool examples included.
- B5: TOKEN BUDGET block — depth over breadth in curveball, no duplicated teaching content between curveball.teaches and debrief.explainers.
- Build: passes.

## Group A — wording and label refinements — ✅

- **Commit:** `33cd99f`
- A1: ScenarioPlayer intro section header "EMS Report" → "Report".
- A2: AssessPanel pre-submit progress strip "Tap items you think are abnormal" → "Tap abnormal findings".
- A3: TOOLS.ivKit label "Establish IV/IO" → "Establish or Confirm IV/IO Placement". Description clarified.
- A4: TOOLS dictionary split — `bvm` is now active "Begin Bag-Mask Ventilation"; new `bvmReady` is preparatory "Bring Bag-Mask to Bedside". SC1 seizure curveball and SC3 asthma escalation switched to `bvmReady` (their feedback already described preparatory behavior). SC3 tension pneumothorax curveball kept `bvm` because the ok:false teaching is specifically about the danger of active bagging there. icons.jsx adds a `bvmReady` case (BVM SVG + small ready-marker dot).
- AI prompt updated with the new tool ID list and explicit distinction rule.
- Build: passes.
