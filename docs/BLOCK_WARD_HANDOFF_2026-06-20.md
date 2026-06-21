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

## Update — same-day session 2: deep-dive RCA + tone + R2 continuation-of-care

**Deep-dive RCA (the "Mark for Review failed" mystery).** It was never broken on real
infra. The playtest ran on the UI-only Vite server (:5173), which has no `/api/generate`,
so the deep-dive call 404'd and `JSON.parse` of the 404 HTML threw. Verified on :3000:
marking an item generates a real ~5k-char Sonnet deep-dive, cached under the phase-scoped
id (`sign:skinRash@p0`), the id round-tripping cleanly through the model. The earlier
bug-sweep fix only made the OFFLINE failure graceful; on :3000/production it always worked.

**Shipped (on `main`, pushed):**
- `7f02be9` — **warmer why tone** + **R2 continuation-of-care**:
  - Tone (`buildPerItemExplanationPrompt`): reframed to a warm, supportive nursing/med-school
    EDUCATOR — define a complex term in plain words the first time it appears, short
    sentences, lead with the plain-language "why", write to be read not skimmed. Worked
    example rewritten; teaching voice decoupled from the narrative's terser bedside voice.
    Verified live on a fresh meningococcemia case — fills are markedly more readable.
    NOTE: the lead+2-bold-bullets+closing structure was ALREADY emitted; my prior note that
    AI `why` was un-bulleted was WRONG (TextBlock + this prompt already bullet it).
  - R2 interventions (`buildRound2Prompt`): R2 actions are the NEXT tier, not an R1 re-run
    (no re-offering setup; redose labelling; distractor→correct flips justified in `fb`).
  - R2 backstop (`mergeRound2`): deterministic demote of one-time SETUP tools (monitoring /
    vascular access / applied O2) that were correct in BOTH rounds → benign distractor with
    an "already in place" note. Verified on real data: `vsMonitor` demoted, `intubationKit`/
    `etco2`/`aLine` (real escalations) KEPT. Fixes "connect to monitor re-offered."
  - R2 assess "**What's changed since Round 1**" strip (`AssessPanel`, gated on `pi>=2`):
    diffs round-2 vs round-1 findings by id, shows movers with ↑/↓ (verified deltas: Lactate
    6.8→9.2, Plt 68→42, Cr 0.9→1.4, etc.). Data + render structure verified.
- `9202c62` — `chore(dev)`: pin vercel-dev preview to :3000 (`autoPort:false`).

**Still open / next:**
- **Live VISUAL of the R2 "what's changed" strip + the backstop demote** on an actual R2
  assess screen. Gotcha: a *replay* of a saved scenario loads the CACHED R2 (bypasses
  `mergeRound2`), so a BRAND-NEW generation played through to R2 is needed to see both live.
- Soften the **distractor worked-examples** in `buildPerItemExplanationPrompt` (~line 591) —
  still dense; the new voice section overrides them, but the examples could match.
- The deeper **R2 restructure** (split into smaller rounds) was DEFERRED — we kept the
  2-round generator and made R2 *feel* like continuation via the strip + next-tier actions.
- Optional: **diaphoresis** animation; live-smoke **penetrating-wound** + **pupils**.

## Dev env (reminder)

- `vercel dev` on **:3000** serves `/api/generate` (AI gen, deep-dive, fills) — **left
  running** this session; check `/tmp/vercel-dev.log` for `[generate diagnostic]` token logs.
- `vite`/`npm run dev` on **:5173** is UI-only (no `/api`; deep-dive/fills 404 gracefully).
- `window.__bw_playerStore.getState()` is the DevTools hook (activeScenario, markedForReview,
  deepDiveCache). Custom scenarios persist in `localStorage["bw-custom"]`; progress in
  `bw-prog`.
- Strict code style preserved: JS not TS, **no template literals** (string `+`), no arrow
  fns in JSX attrs, inline styles, `Object.assign` for merges, `function` declarations.
