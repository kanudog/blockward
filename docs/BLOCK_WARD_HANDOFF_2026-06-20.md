# Block Ward Handoff — 2026-06-20

A **playtest bug-fix + live end-to-end validation** session, continuing the focused-exam
/ lab-panel redesign that shipped 2026-06-19. Read `docs/BLOCK_WARD_HANDOFF_2026-06-19.md`
first for the redesign context (it chains back to 06-12 / 06-11 / 05-29 for tech-stack +
working-relationship). Canonical `docs/BLOCK_WARD_HANDOFF.md` is deep background.

## Where the work lives

Everything is on `main` and pushed (auto-deploys to Vercel). Commits this session:
- `f5554ba` — **fix(assess): art fixes** — abdomen clean T-pose torso, bee-sting wheal+stinger
  (not a laceration), radial-pulse animation for pulse-quality (split from cap-refill).
- `be63965` — **fix(player): playtest bug-sweep** — the 6 issues below.
- `58343ae` — **fix(assess): open-fracture findings → limb-deformity, not perfusion**
  (found live-testing the fresh polytrauma scenario).

## Playtest bug-sweep (`be63965`)

Sebastian played the "Stung at the Picnic" built-in and reported ~18 issues. Root-caused
(a background agent did the investigation) and fixed:

1. **"Findings you missed" counted explored exam signs.** Signs are explore-only now (never
   flagged), so they no longer enter the assess snapshot — only vitals + labs are scored
   caught/missed. (`ScenarioPlayer.jsx` submit — deleted the `ph.signs` snapshot block.)
2. **Deep-dive "couldn't generate — Retry" banner** fired on any batch failure. A failed
   batch now falls back to each item's original `why` instead of the red error banner.
   (`Debrief.jsx` deep-dive `.catch` → `setDeepDives({}); setDeepStatus("done")`.) Note: the
   batch 404s on `:5173` (no `/api`); works on `:3000` (vercel dev).
3. **Mark-for-review ids now phase-scoped** (`+"@p"+phaseIdx`) so the same finding in R1/R2
   doesn't collide. (`FocusedExam.jsx`, `LabPanel.jsx`.)
4. **Reassessment BP cell blank.** `VitalsDisplay._getBpDisplay` now accepts the combined
   **string** form ("84/52") the reassess screen passes raw (recovery already handled it).
5. **Intervention recap listed every option and graded picks.** Now a **de-duplicated set
   (R1+R2+curveball) of the must-have (`priority==="tied-correct"`) actions** that stabilized
   the patient, read from the scenario, rendered as **tiles** — no caught/missed grading
   (learning as we go). (`Debrief.jsx` build + render; `ScenarioPlayer.jsx` recovery recap
   `_seenMustHave` de-dup.)
6. **Popups were a wall of text.** `TextBlock.jsx` (used app-wide) now renders **accent-teal
   bold key terms**, bullets, and preserved paragraph spacing.
7. **Mark-for-review on every vital + lab** (not just abnormal): `showWhyBtn = showFb`.
   Plus a **direct "Mark for Review" button in the focused-exam overlay** (`FocusedExam.jsx`
   `markCurrent()` mirrors `WhyModal.handleMark` — toggles + eager deep-dive).
8. **Focused-exam wording**: "Tap a region to examine" → "Tap an exam below"; dropped
   "exploring, not graded".

All verified live on the anaphylaxis built-in (`:5173`): exam overlay + mark toggle
(store shows `sign:skinRash@p0`), Why popup now bulleted with teal key terms, labs grouped
by tube.

## Fresh AI scenario generated + validated end-to-end

Generated a real Sonnet/Haiku scenario via `vercel dev :3000` and saved it to Sebastian's
custom list (`localStorage["bw-custom"]`) so he can play it:

- **"Hit and Run"** (`id: ped-trauma-mvp-tbi-open-fx`) — Nadia Osei, 8F, pedestrian struck
  by a car. Polytrauma: closed head injury with **anisocoria** (R 6 mm sluggish / L 3 mm
  brisk), **GCS 10 (E3V2M5)**, **open radius/ulna fracture**, **seatbelt sign** + abdominal
  tenderness. Full case + curveball, 4 phases after R2.
- Focused exam surfaced 7 region exams; **Pupils → pupil-reaction**, **Mental Status →
  responsiveness**, **Left Forearm → limb-deformity** (after the `58343ae` fix), **Abdomen,
  Breath Sounds, Pulse Quality, Skin**. Labs grouped by tube, clinically coherent (Hgb 9.4,
  AST 186). Mark-for-Review + bulleted Why popups all work on AI data.

### Generation metrics (cache IS working)

R1 `[generate diagnostic]` (Sonnet, streaming, from `api/generate.js` console log):
`input 1117 · output 7079 · cache-write 15724 · cache-read 30348 · 1 web search · 112.6s`
→ ≈ **$0.19 for R1** (output $0.106 + cache-write $0.059 + cache-read $0.009 + input $0.003
+ search $0.01). The **30,348 cache-read tokens** confirm the prompt-cache warmup pays off.
The lazy why/fb fills are `mode:"explanation"` calls, ~3–9 s each, **cache-read 10,845**
every call (cache hit), all HTTP 200, no errors. Full 2-round end-to-end lands ~$0.40–0.50.

NB: the first **Assess** button shows "Loading details…" until the phase-0 `why` fills land
(several explanation calls). Expected, not a bug — but a candidate to make non-blocking.

## Animation registry (now 11 renderers)

`examAnimations.jsx`: pupil-reaction, breathing, cap-refill, **pulse-check** (radial pulse),
skin-inspect (incl. bee-sting wheal), **responsiveness** (AVPU), **abdomen** (T-pose torso),
**face-angioedema**, **limb-deformity**, **penetrating-wound**, inspect (fallback). Mapper
`examMap.js` `_select` order now: pupil → breathing → **penetrating-wound → limb-deformity**
→ pulse-check → cap-refill → responsiveness → abdomen → face → skin → eye/inspect. Injury
patterns deliberately beat perfusion (open fractures report distal pulses).

## Pending / next (Sebastian OK'd prompt changes for these)

The remaining playtest items are **R2-content** problems needing orchestrator/prompt work
(`buildRound2Prompt` / `mergeRound2` in `src/lib/ai/`), deferred this session:
- **R2 exam too repetitive** → R2 assess should surface **changed / newly-crucial findings
  only**, not re-list the whole R1 exam.
- **R2 interventions repeat R1** (e.g. "connect to monitor" re-offered; redose too soon).
  Decide: split into smaller rounds vs. a **continuation-of-care** framing where R2 actions
  are genuinely new (escalation, not repeats).
- **Why popups for AI scenarios are still prose, not bulleted.** `TextBlock` *renders*
  bullets/bold when present (built-ins have them), but the per-item explanation prompt emits
  paragraphs. Update it to emit a 1-line overview + 2–3 short `- ` bullets with `**bold**`
  key terms so AI `why` text matches the built-in formatting.
- Optional: a **diaphoresis** animation; live-smoke **penetrating-wound** + **pupils** on a
  stab-wound / isolated-head-injury brief.

## Dev env (reminder)

- `vercel dev` on **:3000** serves `/api/generate` (AI gen, deep-dive, fills) — **left
  running** this session; check `/tmp/vercel-dev.log` for `[generate diagnostic]` token logs.
- `vite`/`npm run dev` on **:5173** is UI-only (no `/api`; deep-dive/fills 404 gracefully).
- `window.__bw_playerStore.getState()` is the DevTools hook (activeScenario, markedForReview,
  deepDiveCache). Custom scenarios persist in `localStorage["bw-custom"]`; progress in
  `bw-prog`.
- Strict code style preserved: JS not TS, **no template literals** (string `+`), no arrow
  fns in JSX attrs, inline styles, `Object.assign` for merges, `function` declarations.
