# Coverage audit — 2026-08-05

Both directions of every generator↔render dimension in `docs/AUDIT-BRIEF.md`, plus
the ones the brief listed as not-yet-covered (poses, faces, stations, lab tubes,
med routes, curveball pools, insight cards, stage transitions).

**Status: all nine findings fixed and verified.** The audit ran first and was
reported before anything was changed; the fixes were then authorised in a second
pass. Verification for each is listed with the finding.

## What runs

```bash
npm run audit             # full matrix, always exits 0 — the report
npm run check             # every gate in sequence
npm run check:contracts   # generator<->render contracts   415 pass / 0 accepted / 0 fail
npm run check:corpus      # 8 real cases through real code    8 pass / 0 fail
npm run check:systems     # 18 body-system routing cases      pass
npm run check:accessories # 25 accessory match/hedge/negation cases   pass
npm run check:verbosity   # 13 explanation-shaping cases      pass
```

`scripts/gen-contract-cases.mjs [count] [offset]` generates fresh scenarios with
the live prompt and grades them on these contracts. That is the only honest test
of a prompt edit — F1 below is a prompt rule that was stated plainly and ignored
completely, so a prompt diff proves nothing on its own.

Two guards against the false-positive class that made the first version of this
tooling report all 21 companions as broken:

- every source-scraping parser declares a minimum expected yield and reports
  `PARSER BROKE` rather than reporting the registry as a gap;
- `check-contracts.mjs` has an `ACCEPTED` map for consciously-tolerated gaps. It
  is currently **empty** — every contract is enforced with no exceptions.

---

## Findings and resolutions

### F1 — `sign.sys` required by the prompt, emitted by nothing · HIGH · **FIXED**

The prompt marked `sys` REQUIRED on every sign and spent a block on routing rules
encoding past play-test bugs. Measured across every case file in the repo:

| schema | signs with `sys` |
|---|---|
| legacy (`buildSystemPrompt`) | 44 / 44 |
| 5.4.1 (`buildOrchestratorPrompt`) | **0 / 91** |

Zero, across five independent generations including both shipped built-ins. Every
finding was routed by the fallback heuristic in `bodySystems.js`, whose header
comment claimed the opposite. It mis-routed: in shipped `ten-feet-down.json`,
"Pain Assessment — pain 8/10 at the left forearm… guarding the arm" was filed
under **GI/Hydration**, because `guard` was an abdominal keyword.

**Fixed four ways.** A dedicated verification step (5b) in the prompt that names
the failure and tells the model to count. `guard`/`rebound` narrowed to
`involuntary guarding`/`rebound tender` so limb findings stop landing in GI —
genuinely abdominal findings are already caught by `abdom`/`peritone`.
`vascular`, `endocrine`, `heme`, `psych`, `iv`, `line` added to `SYS_ALIAS`
(`vascular` appeared in four real cases and was silently discarded). The
misleading header comment corrected.

**Verified:** five freshly generated cases carry `sys` on **65/65** signs (100%,
from 0%). The forearm Pain Assessment now routes to Musculoskeletal. The two
shipped cases had the reviewed routing pinned into them, so the corpus is
120/120 and the gate enforces the ratio.

### F2 — two `visuals[]` keywords the prompt promised rendered nothing · HIGH · **FIXED**

`cast leg` (vocab had `leg cast`, not `cast leg` — and `cast leg` is the prompt's
own worked example) and `flushed` (no vocab entry at all; `breathing-harder.json`
shipped `visuals: ["flushed"]`).

**Fixed:** `cast leg` and `cast arm` added to the `shell-limb` phrases; a new
`tint-warm-cheeks` accessory (warm flush across both cheeks) added across
`sceneVocab` / `config` / `accessories` so `flushed` draws something real.
**Verified:** all 17 promised keywords render; `check:corpus` passes on the
shipped case that emits `flushed`.

### F3 — nine registry entries the generator could never reach · HIGH · **FIXED**

Present in the packs, absent from the prompt's "use only the IDs below" listing:
`cprCompressions`, `pulseCheck`, `callNeurosurgery`, `callCardiology`,
`callPICU`, `furosemide`, `milrinone`, `dobutamine`, `norepinephrine`. All nine
were added on 2026-07-29 as play-test fixes; the registry half landed, the prompt
half did not. Two were worse than absent — the prompt named `callNeurosurgery`
and `furosemide` *only* in "do NOT invent a plausible-looking id like…", telling
the model not to use the exact ids added because a herniating TBI needed
neurosurgery and a heart-failure case needed a diuretic.

**Fixed:** all nine added to their pack listings; the "do NOT invent" examples
changed to ids that genuinely do not exist (`callRadiology`, `dopamine`).
**Verified:** across five fresh generations the model reached for **all nine**.

### F4 — lab tube matcher dropped plurals and unicode · MEDIUM · **FIXED**

`matchKw` demanded a non-alphanumeric character on both sides, so `Platelets`
missed the lavender rule and fell to the gold catch-all — a CBC result rendered
under Chemistry, live in shipped content. Same for `Blood Cultures`, and
`HCO₃`/`HCO₃⁻`/`pCO₂`/`pO₂` split a single VBG across two panels.

**Fixed:** the trailing boundary accepts an optional `s`, and unicode subscripts
are normalised to ASCII before matching. `Bicarbonate` → Chemistry is preserved,
because a serum bicarbonate genuinely is a gold-tube chemistry.

### F5 — the only implemented scale never fired on real output · MEDIUM · **FIXED**

The known gap (FAST, Aldrete, PEWS, Westley, Wong-Baker, FLACC, Apgar have no
tables) is confirmed and mild: `scoreKind()` returns `null` for them and the
finding renders as ordinary prose. The sharper problem was the reverse —
GCS_SCALE fired on **0 of 5** GCS findings in shipped cases. Confirmed in the
browser: the flagship trauma case rendered a bare `GCS 14`, because the generator
writes "eyes open spontaneously (4), confused verbal response (4), obeys commands
(6)" with no E/V/M letters.

**Fixed:** `parseGCS` and `GCS_SCALE` moved out of `FocusedExam.jsx` into
`src/lib/scenarios/gcs.js` so the checks exercise the real parser instead of a
copy. Two new tiers: three bracketed digits are read as E, V, M *only* when each
is in range and they sum to the total the case states, and the two uniquely
decomposable totals (15 = E4 V5 M6, 3 = E1 V1 M1) resolve exactly. The prompt now
states the lettered form is required and says why.
**Verified:** 13/13 GCS findings across all seven corpus cases yield a breakdown;
confirmed live in the app rendering the full three-category table.

### F6 — `reassessment.outcome` reached no renderer · MEDIUM · **FIXED**

Five-value enum, required by the prompt, asserted in its own verification
checklist, read by nothing. A `transferred-or` case ended on "Steady again."

**Fixed:** `OUTCOME_BEAT` in `ScenarioPlayer` gives each of the five its own
headline and subtitle ("Stable enough for theatre. / Surgery is ready.").

### F7 — dead render paths · LOW · **partly removed, partly kept deliberately**

Removed: `TOOL_VISUAL_META` + `toolIconName()` (13 entries and a lookup nothing
called — `ActionPanel` passes raw ids to `ToolIcon`), and the `epiPen` icon case
(matched no registry id in either pack).

Made reachable rather than deleted: the `MedIcon` `"protocol"` case now has a
producer — `mtpActivation` gained a `MED_VISUAL_META` entry so that when a
generator files it under meds (which happens), it gets the protocol clipboard.

Kept as deliberate design headroom, with the reasoning recorded: `ConsequenceBeat.jsx`
and `ph.insight` are unreachable in production, but `ScenarioPlayer.jsx` documents
`ph.consequence` as a *"fable enhancement; real cases skip straight to afterAct"*.
`state.station` is likewise vestigial today but is the hook the catalog note for
`platform-transport` depends on. Deleting either would be removing planned
structure, not dead weight.

`table-side` is no longer unreachable art — see F10.

### F8 — poses undiscoverable to the generator · LOW · **FIXED**

Both directions were clean (all 7 poses reachable, all with `applyPose` branches,
no orphans), but folding all 51 real narrative blocks through the resolver showed
only 3 of 7 ever fired: `settled` (42), `lying-eyes-closed` (7),
`lying-eyes-open` (2). The prompt documented 17 accessory keywords and **zero**
pose phrases, so the generator never knew "sitting on the edge" (tripod
positioning) or "curled on her side" (meningitis) change the figure.

Separately, a `FACE_RULES` hit overrode the pose's own face: "unresponsive and
lethargic" set pose `lying-eyes-closed` but rendered *heavy* (half-open) lids.

**Fixed:** a posture-and-face paragraph added to the prompt naming every
recognised phrase, with a caution not to reach for one just for colour. The
resolver now keeps eyes closed when the pose already closed them.
**Verified:** `check:contracts` asserts all 12 posture phrases resolve to the
right pose *and* appear in the prompt, all 7 face phrases resolve, and the
pose-wins-over-face precedence holds.

### F9 — cap refill has no monitor tile · **not a gap, by owner direction**

Recorded so it is not re-reported. `VitalsDisplay` shows HR, SpO₂, RR, BP, Temp
per the owner correction of 2026-07-08; `vit.cap` drives the cap-refill
animation instead. Two consequences worth knowing: the generated `cap.bad` flag
is not learner-flaggable, and the comment in `canonicalize.js` describing the
monitor as the consumer is now out of date — the backfill is still load-bearing,
just for the animation.

### F10 — IV tubing ran to an empty pole · **FIXED** (owner-reported, 2026-08-05)

Not from the audit sweep — spotted by eye. `patch-limb-access` drew its own line
from the cannula up to a bare point on the pole, so a patient with an IV and
nothing running had tubing climbing to nothing.

**Fixed by moving ownership of the line.** The access patch now draws only the
cannula and its tape. The **bag** draws the line: the first `pouch-on-stand`
runs tubing from its drip chamber to the access site the case named — the right
limb, the left limb, or the scalp — resolved before the render loop so list order
cannot matter. No bag, no line. One line however many bags hang.

Selected interventions now also furnish the room: anything that cannot be drawn
on the patient stages its kit on the side table, except decisions and
bare-handed assessments (calls, protocol activations, GCS, imaging orders), which
are listed explicitly in `NO_BEDSIDE_OBJECT`. "Prepare Intubation Kit" now puts
the kit on the table instead of nothing at all — and `table-side` stops being
unreachable art.

**Verified live:** committing an NS bolus hangs a bag on the pole with tubing
running to the arm; before committing, the patient carries a cannula and the pole
is bare.

### F11 — "Place NG Tube" also drew a gastrostomy button · **FIXED**

Surfaced while testing F10. Vocab phrases were matched with bare `indexOf`, so
the `port-belly` phrase `g tube` matched inside `ng tube`. Every vocab phrase is
word-initial (including stems like `intubat` and `nebuliz`), so matches now
require a word boundary at the start.

### F12 — case-only id drift · **FIXED**

Real corpus emits both `o2Mask` and `o2mask`; the lowercase form resolved in
neither registry and lost its label, pack and icon. `ActionPanel` now falls back
to a case-insensitive registry lookup, and the prompt asks for exact casing.

---

## Owner-requested changes shipped alongside

- **Chief complaint capitalisation** — `sentenceCase()` in
  `lib/scenarios/labels.js`, applied at both render sites (the intro brief and
  `PatientHeader`). Only the first character is touched, so "pRBC" survives.
- **3D camera controls** — spin slider along the bottom edge, zoom slider
  vertical up the right side, sized for a portrait phone (18px thumbs, the two
  axes on two different edges so neither crosses the patient). Wheel and
  two-finger pinch also zoom; a reset returns to the auto-framed view and
  restarts the idle sway. Camera state lives in refs, so dragging never rebuilds
  the scene and the chosen angle survives a new accessory landing mid-run.
  Controls are off on the 190px examine crop. The vertical rail uses
  `writing-mode`, **not** `-webkit-appearance: slider-vertical`, which hands the
  control to the native widget and repaints it in system blue.

## Dimensions clean in both directions

3D accessory vocab ↔ renderer ↔ catalog; tool/med ids ↔ icons ↔ visual meta;
`SYSTEM_ORDER` ↔ `SYS_ICON` ↔ the prompt's nine `sys` values; hair, companions,
gowns and tones (including a 400-seed sweep confirming every seeded look is
buildable); pose and face state coverage; station selection per age band and
every `refs.*` an accessory consumes existing on both crib and bed; the 10 lab
tubes ↔ display order ↔ keyword rules; stage ids set ↔ stage branches rendered;
curveball action pools.

## Notes for next time

- A generator filing `nsBolus` under `tools` is **not** a failure: `ActionPanel`
  cross-looks-up the other registry on purpose and warns. `check:corpus` reports
  it as a note. What must never happen is an id resolving in neither registry.
- Verify in a real viewport. The browser pane is pinned to **402×874** (iPhone 17
  Pro logical size). Other phones differ — that size is for uniformity, not
  because layouts should be built to it exclusively.
- A green `npm run build` still proves nothing. While building the camera
  controls the build stayed green through a `ReferenceError` that would have
  blanked every 3D surface; only loading the app caught it.

---

# Addendum — live pressure test, 2026-08-05

A fresh case was generated through the **real app pipeline** (Sonnet orchestrator
skeleton → Haiku lazy `why`/`fb` fills), curveball off, Balanced verbosity, and
played end to end at 402×874. Brief: a 16-month-old girl in meningococcal septic
shock with an EMS left-tibial IO, written to stress dose arithmetic, loyalty, and
distractor honesty. Shipped as the core scenario **"The Rash That Won't Blanch"**
(`src/lib/scenarios/generated/rash-that-wont-blanch.json`).

Result: 4 phases, **127 explanation slots filled, 0 null**, 27/27 signs carrying
`sys`, outcome `transferred-icu`.

## Four more renderer bugs, found by real content and fixed

### F13 — a ruled-out finding was drawn · **FIXED**

The case wrote *"…coalescing into irregular purpuric patches at the flanks. **No
urticaria.**"* and the figure came up wearing **hives** — the app drew the one
differential the case had explicitly excluded. The resolver guarded hedges
("prepare", "consider") but had nothing for negation, and negation is how
clinicians write. `negated()` now suppresses a match sitting behind no / not /
without / denies / absent / negative for / free of. The window is tight and
backward-only so "No urticaria, but scattered petechiae" still draws the
petechiae, and `\bno\b` cannot fire inside "non-blanching".

### F14 — intraosseous access had no vocabulary at all · **FIXED**

The child's *only* vascular access was a left tibial IO. It was named five times
across the narrative and two findings, and the figure showed nothing — there was
no IO vocab. Worse, once the infusion-line work of F10 landed, a bag would have
run its line to the **default right arm** on a child with no arm access. IO
phrases now resolve to `patch-limb-access`, and `LIMBS` learned bone landmarks
(tibia, femur, humerus, antecubital, wrist, forearm, shin) so "left tibial IO"
lands on the left leg. Verified live: `Vascular access @left-leg`, with the
infusion line following it.

### F15 — one device named twice became two devices · **FIXED**

"Left tibial IO in place" (a finding) and "The IO line is functioning" (the next
phase's narrative) are the same line. The first resolved to the left leg; the
second named no limb and so landed on the default right arm. The child wore two
cannulas. `dropUnplacedDuplicates()` now lets a *placed* entry beat the unplaced
entry for the same id, while keeping two entries when both name a limb — a
patient really can have access in both arms.

### F16 — an explicit right arm was indistinguishable from "unstated" · **FIXED**

Surfaced by F15. `entryFor()` folded `right-arm` into the bare id, so "the case
said right arm" and "the case said nothing" produced the same string, and the
de-duplication above wrongly dropped explicitly-right-arm access. A named limb
now always carries its suffix; bare means unstated.

Also corrected in passing: `LIMBS` mapped **"right foot" → left-leg**, a straight
typo that put every right-foot finding on the wrong side.

## Clinical review of the generated case

**What the pressure test got right.** Every weight-based dose recomputes
correctly for 11 kg — ceftriaxone 100 mg/kg = 1,100 mg, NS 20 mL/kg = 220 mL,
ketamine 1.5 mg/kg = 16.5 mg, rocuronium 1.2 mg/kg = 13 mg, vancomycin
15 mg/kg = 165 mg, dexamethasone 0.15 mg/kg = 1.65 mg, hydrocortisone
2 mg/kg = 22 mg, bicarbonate 1 mEq/kg = 11 mEq. Loyalty to the brief is exact:
the IO is in the left tibia, the fluid order is labelled "second bolus" because
EMS gave the first, and the child is fully vaccinated with no allergies. The
distractors are genuinely tempting and correctly reasoned — lumbar puncture in
coagulopathic shock (platelets 48), head CT *before* antibiotics, bicarbonate
for lactic acidosis, dexamethasone for meningococcal sepsis. The lab set is
clinically sophisticated: **leukopenia** (WBC 3.1) rather than the naive
leukocytosis, with thrombocytopenia, lactate 8.4, mild AKI and hyponatraemia —
a coherent early-DIC picture, with three normal results as honest distractors.
Ketamine is chosen for RSI induction over etomidate and propofol, which is the
right call in shock. The Round 2 narrative correctly hedges what the learner may
or may not have done rather than asserting it.

**What needs a clinician's eye.**

1. **A wrong and unsafe BP target.** The norepinephrine `fb` says *"targeting
   systolic >90 mmHg (age-appropriate goal is 90 + 2 × age in years = 122…)"*.
   For a 16-month-old that formula gives ~93, not 122 — **16 months was used as
   16 years**. And >90 systolic is far above this child's hypotension threshold
   (~72). Two other uses of the age formula elsewhere in the same case are
   correct, so this is an isolated slip, but it is the kind that matters.
2. **GCS prose disagrees with its own component.** "withdraws purposelessly to
   pain" is scored **M3**; withdrawal to pain is M4 (M3 is abnormal flexion).
   The total is self-consistent (2+1+3=6) so the app's existing mismatch warning
   does not fire — it only compares the stated total against the components.
3. **No reassuring vital.** All six Phase 1 vitals are flagged abnormal. The
   prompt asks for 1–2 in normal range as distractors. Clinically defensible in
   decompensated shock, but it removes the discrimination test for vitals.
4. **The chief complaint gives away the diagnosis** — "Meningococcal septic shock
   with purpuric rash" appears on the brief screen, before the learner has
   assessed anything. The prompt's own rule says etiology is "yours to know but
   not to spell out at the top".
5. **First-line vasoactive is arguable.** Narrow pulse pressure (62/38) with cool
   mottled peripheries is cold shock, where epinephrine is the more
   guideline-aligned first choice; norepinephrine suits warm/vasodilated shock.
   Not wrong, but worth a second opinion before this ships as teaching.

## Not verifiable this run

Deep-dive generation (Mark for Review) and the five `debrief.physiologyDeepDive`
essays could not be tested: the Anthropic API returned **"Your credit balance is
too low"** partway through. The wiring is confirmed working — marking an item
fires `expandSingleMarkedItem`, the failure is caught, a warning is logged and
the slot is left null with no crash — but no deep-dive text was produced. Re-run
the marks once credits are topped up.

---

# Addendum 2 — owner review of the pressure test

## The hives call, re-examined

Fair challenge: the brief says *"a rash spreading across her belly and chest that
won't go away when you press on it"* — so shouldn't hives count as that rash?

Clinically, no, and the distinction is the whole case. **Urticaria blanches;
petechiae and purpura do not.** "Won't go away when you press on it" is the lay
description of *non-blanching*, which is precisely what rules urticaria OUT — it
is why the case is titled "The Rash That Won't Blanch", and why the sign text
ends "No urticaria." The two ids also draw different things: `marks-scattered`
is eight small marks spread wide across trunk and arms; `marks-cluster` is six in
one tight patch. They are different lesion distributions, not two skins for the
same finding.

And the rash was never missing — `marks-scattered` was already rendering. Hives
was an *extra* cluster appearing on top, triggered by the words "No urticaria".
Letting that stand would mean the app draws findings out of negative statements
generally: "no petechiae", "no cast", "denies swelling" would all render.

**But the question was pointing at something real.** Testing the actual brief
prose through the resolver showed that a rash described in lay language rendered
**nothing at all**:

| phrasing | before | after |
|---|---|---|
| "won't go away when you press on it" | nothing | Petechiae / purpura / rash |
| "does not fade when you press on it" | nothing | Petechiae / purpura / rash |
| "the spots stay when you push on them" | nothing | Petechiae / purpura / rash |
| "raised itchy welts" | nothing | Hives (urticaria) |
| "purpuric patches" | **nothing** | Petechiae / purpura / rash |

The vocab only knew clinical terminology, while the EMS-report voice is written
deliberately in lay language. So the right fix was not to let hives stand in —
it was to make the lay phrasing resolve to the *correct* finding. Lay
non-blanching phrases added, `purpura` widened to the stem `purpur` (it did not
even match "purpuric"), and `wheal`/`welts`/`raised itchy` added to hives.

Both negation guards now also stop at a comma, so "No urticaria, scattered
petechiae present" suppresses only the hives.

## GCS prose-vs-component checking · **NEW**

`parseGCS` already caught a stated total disagreeing with its own E/V/M. It could
not catch components disagreeing with the **words beside them** — "withdraws
purposelessly to pain" scored M3 (abnormal flexion; withdrawal is M4). The
arithmetic was self-consistent, so nothing flagged it while the app highlighted
"Abnormal flexion" next to prose saying she withdrew.

`gcsProseConflicts()` now maps every level of all three categories to its
descriptors and reports disagreement. It is deliberately conservative: a category
whose prose implies two different values reports nothing, and a negated
descriptor ("no spontaneous movement") implies nothing — a false alarm on the one
scale the app renders would train people to ignore it. Three places consume it:

- **the app** shows an amber note naming both readings and telling the learner to
  go by the description;
- **the prompt** now lists all sixteen levels with their descriptors and forbids
  softening a withdrawal into a lower score with "purposeless";
- **`check:corpus`** fails on any shipped case whose GCS contradicts itself.

Across 8 cases and 17 GCS findings it flagged 4 real conflicts and no false
positives. The three in the new core scenario were corrected by fixing the
wording to match the scores (the author used "purposeless" to mean non-purposeful
throughout, which is what M3/M2 describe — so the verb was wrong, not the
number). Every total, and the flexion→extension deterioration across rounds, is
preserved. The fourth is in a pre-rule fixture and is reported rather than failed,
because fixtures exist as a record of generator behaviour.

## Accepted, no change

**All-abnormal vitals are realistic in a crashing child.** Agreed — this was a
weak finding. The prompt's hard "1-2 vitals must be normal" quota is now
conditional on the physiology allowing it, with the reasoning stated: inventing a
normal vital to satisfy a quota is worse than having none. The discrimination
test is anchored on labs and system findings instead, where a reassuring result
is plausible in almost any presentation.

**Deep dives failed on credit exhaustion, not a defect.** Noted.

## Assessment screen copy and state

"Read the findings — nothing here is graded." → **"Assess the patient."** The
same disclaimer appeared a second time inside the exam block and has been dropped
there too; the one affordance a learner cannot guess — that a finding can be
saved for the debrief — is kept. All three sections (Exam, Vitals, Labs) now
start **collapsed**; the post-submit reveal still opens all three at once.
