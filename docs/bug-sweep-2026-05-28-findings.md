# Bug Sweep — Root-Cause Findings (2026-05-28)

Investigation notes for the post-Phase-6.2 bug sweep. Each entry records
the **observed symptom**, the **confirmed root cause** (with file:line),
the **fix approach**, and **risk/blast radius**. Two of the five items
were re-scoped during investigation — see bugs 2 and 3.

Verification method: read every relevant source file end-to-end, cross-
checked the orchestrator prompt registry against the actual player
registry (`packs/*.js`), and inspected a real dry-run output
(`scripts/orchestrator-dry-run-output-6.2b5.json`). No code changed
during investigation.

---

## Bug 1 — Explored counter off-by-one (REAL)

**Symptom.** Phase 2 shows e.g. "17/18 explored" after the user has
clicked every visible tile; "Skip to Next" stays available when nothing
remains to skip. Originally hypothesized as a customMed issue; the
Phase 6.1 sepsis run ruled that out (clean 9-tool + 9-med scenario still
showed the off-by-one).

**Root cause.** In `src/components/player/ActionPanel.jsx`:
- `explored = Object.keys(sel).length` (line 156) — counts tiles the
  user actually clicked. `sel` is only written by `pick(id)` (line 172),
  which only runs on a rendered tile's click.
- `total = (tools?tools.length:0)+(meds?meds.length:0)` (line 157) —
  counts **every** entry in `actions.tools` / `actions.meds`.
- The grid skips rendering any id that doesn't resolve:
  `var t=lookupTool(id,...); if(!t) return null;` (lines 202, 207).
  `lookupTool/lookupMed` (lines 34-41) return a synthetic object for
  custom ids (`isCustomTool/isCustomMed` match `id.indexOf("customTool")===0`,
  so even suffixed `customTool_cooling` resolves) and `ALL_TOOLS[id]||null`
  otherwise.

So the counter goes short whenever an id is **non-custom AND absent from
the registry** — i.e. a Sonnet near-miss/hallucinated id. It is counted
in `total` but renders no clickable tile, so `explored` can never reach
`total`. I confirmed every id the orchestrator prompt *instructs* Sonnet
to use does exist in `ALL_TOOLS`/`ALL_MEDS`, so this only triggers when
Sonnet emits an off-registry id — consistent with "sporadic."

**Consequential side effect.** The "Continue" gate is
`allF = totalCorrect>0 && rT.concat(rM).every(id => sel[id])` (line 155),
where `rT`/`rM` are the `ok:true` ids from `actions` (lines 152-153),
**not** filtered to renderable ids. If the unrenderable id is a *correct*
action, `allF` can never become true → the phase **soft-locks** on "Skip
to Next." This is worse than a cosmetic counter bug.

**Fix approach (player-only, ActionPanel.jsx).** Precompute renderable
id arrays — `renderTools = tools.filter(id => !!lookupTool(id, entry))`,
likewise meds — render the grid from those, and base both `total` and the
`allF` correct-set on the renderable ids. `explored` is left as-is (clicks
only land on rendered tiles, so it's naturally bounded by the renderable
total).

**Not fixing (latent, out of scope).** `sel` is a flat map keyed by id
alone, shared across tools and meds. If Sonnet ever emitted the *same*
id as both a tool and a med, `total` would count 2 but `sel` 1. Fixing
this requires type-namespacing `sel`, which would ripple into the
recovery screen (`ScenarioPlayer.jsx:124,140` read `p1Sel[e[0]]` by raw
id) and the debrief (`Debrief.jsx:143,148` read `sel[id]`). High blast
radius for an essentially-never collision — documented, deferred.

**Risk: Low.** Single-file, player-only.

---

## Bug 2 — Visuals restoration (REAL, but a feature add, not a code bug)

**Symptom.** PatientSVG avatar never shows accessories (hives, casts,
oxygen mask, c-collar, etc.). Orchestrator emits `visuals: []` always.

**Root cause re-scope.** The plumbing already works:
- Prop chain: `ScenarioPlayer.jsx:67` `scVisuals = sc.visuals||[]` →
  `PatientView` (`visuals` prop) → `PatientSVG`. Passed on intro/phase/
  cb-alert paths (not reassess/recovery, intentionally — recovered state).
- Migration: `migrateLegacyScenario.js:409` only coerces to `[]` when
  `sc.visuals` is *not* an array. A real array passes straight through.
- The actual gap: the orchestrator schema
  (`05-orchestrator-prompt-design.md` Section 4) has **no `visuals`
  field**, and the prompt never tells Sonnet to emit keywords.

**PatientSVG keyword vocabulary** (the exact strings the renderer matches,
from `PatientSVG.jsx:42-53` via `hasV(keyword)` substring tests):
- `cast left arm` / `left arm cast` / `broken left arm` / `fractured left arm`
- `cast right arm` / `right arm cast` / `broken right arm` / `fractured right arm`
- `cast leg` / `leg cast` / `broken leg` / `fractured leg`
- `head bandage` / `head wrap` / `head injury` / `head trauma`
- `wheelchair`
- `nasal cannula` / `oxygen cannula` / `o2 cannula`
- `oxygen mask` / `o2 mask` / `non-rebreather`
- `hives` / `urticaria` / `rash` / `allergic`
- `c-collar` / `neck brace` / `cervical collar`
- `sling` / `arm sling`
- `eye patch` / `eye bandage`

**Fix approach.** Add a top-level `visuals` (string array) to the
orchestrator schema + a new prompt section enumerating the vocabulary
above, instructing Sonnet to emit only clinically-appropriate keywords
(empty array when none apply, e.g. a metabolic case with no visible
equipment). Update `05-orchestrator-prompt-design.md` to keep the design
doc authoritative. Migration already passes it through.

**Risk: Medium.** Touches the orchestrator prompt → must run the dry-run
harness (`scripts/orchestrator-dry-run.mjs`) and a manual smoke before
commit.

---

## Bug 3 — Age/sex/bed-vs-crib avatar (MOSTLY A MISDIAGNOSIS)

**Handoff framing.** "PatientSVG reads `ageGroup`; orchestrator emits
`patient.ageLabel`; something has to translate; find the chain and fix
the derivation."

**What's actually true.** The translation already exists and is wired on
every render path: `guessAge(sc)` / `guessSex(sc)` in
`src/lib/scenarios/age.js`, called at `ScenarioPlayer.jsx:67` and passed
as `ageGroup`/`sex` into PatientView/PatientSVG everywhere (intro 222,
phase 254, cb-alert 302, reassess 344, recovery 366, Debrief 155). It
works correctly for **every current scenario**:
- Built-in `ageLabel`s are all month/year forms ("6 months", "2 years",
  "8 years", "6-Month-Old", "8-month-old", "14 years") — all bucket
  correctly. (Verified: no week/day labels exist anywhere in `src/`.)
- AI scenarios emit "X years old" (dry-run: "6 years old", sex "F") —
  bucket correctly.

So the avatar is **not** defaulting/sporadic for current content.

**Real residual defects:**
- **3a (latent, low value, trivial).** `guessAge` only handles
  "month"/"year"/"yo" units (`age.js:14-24`). A "3-week-old" or
  "10-day-old" falls through to the bare-number branch (lines 25-28) and
  mis-buckets (3-week-old → toddler; should be infant). Only bites a
  neonatal *AI* scenario. Fix: add week/day handling → infant. Verifiable
  with a pure-function assertion (no manual smoke needed).
- **3b (net-new SVG, design-flavored).** PatientSVG has **no crib** —
  the `!wheelchair` branch (lines 75-82) always draws the same bed, so
  infants don't get crib rails. Adding crib rendering for infant/toddler
  is new SVG work.
- **Sex: not a bug.** PatientSVG only distinguishes `female` (long hair,
  `#8B4513`); male and "neutral" render identically by design.
  `guessSex` maps male/female/m/f/boy/girl correctly.

**Risk: 3a Low (pure fn). 3b Low but visual — fold its smoke into bug 2's
avatar smoke.**

---

## Bug 4 — Mark-for-review keying missing phase context (REAL)

**Symptom.** Marking the same-id item in two phases (curveball + phase 1,
or phase 0 + phase 1) cross-contaminates: marking in one shows it marked
in the other; deep-dive cache collides.

**Root cause.** The marked-item `id` carries type but not phase:
- `ActionPanel.jsx:95` — `id: (pop.ty==="t"?"tool:":"med:")+pop.id`
  (e.g. `"tool:glucometer"`). Note the entry *does* carry `phaseIdx`
  (line 97) and a phase-scoped `_slotRef` (line 99) — only the `.id`
  used for dedup lacks phase.
- `AssessPanel.jsx:146-149` — vital path `id: cid` (`"vital:hr"`),
  assessItem path `id: "assess:"+aiId`. No phase.
- `playerStore.toggleMarkForReview` dedups on `item.id` (line 149);
  `setDeepDive` keys `deepDiveCache` by `item.id` (lines 179-183).

**Consistency check (so the fix is safe).** Debrief reads
`deepDiveCache[item.id]` straight off each marked item (`Debrief.jsx:205`),
and the eager fetch writes `setDeepDive(item.id, …)` from the same item
(`ActionPanel.jsx:273`, `WhyModal.jsx:36`). The id is carried *in* the
item end-to-end, so adding a phase suffix at the build sites is safe —
nothing parses the id string.

**Fix approach.** Include `phaseIdx` in the `id` at both build sites
(e.g. `"tool:"+pop.id+"@p"+phaseIdx`; curveball uses `phaseIdx="curveball"`).
Mirror in the AssessPanel vital/assessItem item builder.

**Risk: Low.** Two build sites; id is opaque downstream.

---

## Bug 5 — Eager deep-dive missing per-slot in-flight guard (REAL)

**Symptom.** Rapid mark → unmark → mark on the same item double-fires
`expandSingleMarkedItem`, wasting API calls (no crash).

**Root cause.** Both call sites fire unguarded:
- `WhyModal.jsx:35` `handleMark` → `expandSingleMarkedItem(sc,item)`.
- `ActionPanel.jsx:272` mark onClick → `expandSingleMarkedItem(sc,it)`.
Neither checks whether a fetch for that id is already in flight or whether
`deepDiveCache[id]` is already populated.

**Fix approach.** Add a per-id in-flight set to `playerStore`
(`deepDiveInFlight: {}`) with `begin/endDeepDive(id)` actions (or a single
guard helper). Guard both call sites: skip if in-flight or already cached;
clear the flag in a `.finally`.

**Risk: Low.** Additive; one new store field + two guards.

---

## Execution strategy — batched to minimize smoke tests

All five (incl. 3b) will be done, but grouped by risk so manual smoke
runs are minimized to **two**:

**Batch 1 — player-only logic (bugs 1, 4, 5, 3a). One smoke test.**
No orchestrator/API change. 3a verified by a pure-function assertion, so
the manual smoke is a single playthrough: explored counter hits N/N and
Continue unlocks (bug 1), mark-for-review works without cross-phase
contamination (bug 4), rapid mark doesn't double-fire (bug 5).

**Batch 2 — orchestrator + avatar (bugs 2, 3b). Dry-run + one smoke test.**
Add `visuals` to the orchestrator schema/prompt (bug 2) and crib
rendering to PatientSVG (bug 3b). Run `orchestrator-dry-run.mjs` to
validate schema + visuals emission, then one smoke: generate an
accessory-rich scenario (e.g. anaphylaxis → hives/stridor; trauma →
cast/c-collar) and an infant scenario; confirm accessories render and
infants show a crib.

This reorders strict 1→5 priority (1,4,5,3a then 2,3b) specifically to
honor the "minimize smoke tests" goal — a strict order would interleave
the orchestrator change (bug 2) between player fixes and force extra
smoke runs.

## Code-style reminders (apply to all edits)
JavaScript (not TS); no template literals (use `+`); no arrow functions
in JSX attributes; inline styles; `Object.assign` for style merging;
plain `function` declarations.
