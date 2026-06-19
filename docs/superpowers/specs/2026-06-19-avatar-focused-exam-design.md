# Block Ward — Avatar-Driven Focused-Exam Assessment + Professional UI Pass

**Design spec — 2026-06-19**
**Status:** approved in design (iterated through rendered prototypes this session); pending implementation plan.
**Supersedes:** the 06-11/06-12 "focused-exam redesign" next-step item AND the `DESIGN_TODO.md`
Phase-7 "non-clickable bulleted narration" entry (the binary sign-flagging fairness problem is
solved by this design, not by bullet lists).

---

## 1. Goals

Two intertwined goals, designed together because the avatar is the spine of both.

**A. Avatar-driven focused exam (the big overhaul).** Replace the binary "flag the abnormal
physical-exam tile" interaction. Today the learner taps sign tiles they think are abnormal; each
carries `bad: true|false`, and `bad` encodes *clinical context* (compensatory tachypnea is
`bad:false` because it is appropriate for the metabolic state). The UI asks the literal question
"click what looks wrong," so a context-correct `bad:false` reads as a trap, and findings are either
trivially-obvious or one abnormal detail buried in an otherwise-normal tile. It is not a fair task.

Instead: the generated avatar sits **center-stage** with exam options around it ("Check pupils",
"Assess breathing", "Check perfusion", "Inspect skin", "Responsiveness", …). Tapping one **zooms to
that body region**, plays a **scenario-specific animation of the actual finding**, and shows a
finding popup with a "Why does this matter?" teaching box. The learner *performs* the exam and sees
real findings — no right/wrong on the physical exam.

**B. Professional UI pass (prioritized alongside A).** The app reads generic/dated. Finish the
Stage-4 "Midnight Neon" token rollout (currently dashboard-only) across the player/debrief screens,
clear the open `DESIGN_TODO.md` items, and elevate to a professionally-made look. All of this
session's prototypes are already in Midnight Neon, so A and B ship as one visual language.

---

## 2. Decisions locked (forks resolved)

| Fork | Decision | Rationale |
|---|---|---|
| **2D-enhanced vs 3D** | **2D-enhanced** (keep inline-SVG) | The findings are localized and schematic (anisocoria, retractions, cap-refill, bruise) — all read better as enhanced 2D than a 3D rig. No 3D art pipeline for a solo dev, no ~150–250 KB lazy-loaded bundle, keeps the LEGO charm. Camera "zoom" = cross-fade to a dedicated high-detail region inset. Validated by prototype across pupils / respiration / cap-refill / scalp-pan / six trauma-derm findings. |
| **Animation system** | **Registry of ~20 parametric renderers + build-time custom-generation fallback** | Most findings hit the registry; novel findings are generated once at scenario-build time, validated, and cached. |
| **Avatar** | Reuse the real `PatientSVG` center-stage; skin/cyanosis becomes parametric off SpO₂ | Don't redraw the avatar; the prototype's hand-drawn stand-in was wrong — the real component with its `visuals[]` accessories is the center-stage figure. |
| **Scoring/flow** | 3-part assess phase: monitor (flag, graded) · focused exam (explore, ungraded) · labs (flag, graded) | Binary flagging stays where it is fair (numbers on the monitor and in labs); only the physical exam loses it. The intervene phase's tied-correct/distractor scoring is untouched. |
| **Lab layout** | **Option A — grouped by tube** | Each result sits under its color-coded collection tube; mirrors a real draw (one specimen → many results). Flag-abnormal kept. |
| **Clinical accuracy** | Stays on the existing orchestrator + Haiku why-fill + Sonnet verifier | The exam descriptor carries a `why: null` slot like vitals/signs/labs; the verifier extends to check exam findings/params. |

3D, a light-theme variant, and richer avatar-emotion work are **out of scope / future** (see §13).

---

## 3. The new assess phase (flow)

The assess phase (Phase 0 and the Round-2 assess phase) renders three stacked parts:

1. **VS monitor** — vitals shown on the bedside monitor. Tap a vital to **flag** it abnormal.
   *Graded* (caught / missed / wrong), exactly as today. Values render uniform white (per
   `DESIGN_TODO.md`); the monitor frame alarms, not the digits.
2. **Focused physical exam** — the **center-stage avatar** with 4–5 exam buttons around it. Tap →
   zoom to region → animated real finding → finding popup + "Why does this matter?".
   **Ungraded** — exploration. A "performed" check and an "N of M examined" counter track coverage;
   the learner may proceed once a minimum (configurable; default: all) are performed.
3. **Labs** — Option-A grouped-by-tube layout. Tap a result to **flag** it abnormal. *Graded.*

The intervene phases, interlude, curveball, reassessment, recovery, and debrief are unchanged in
flow (only restyled in the UI pass).

---

## 4. Focused-exam interaction (UX)

- **Center-stage:** the real `PatientSVG` (figure + bed/crib + `visuals[]` accessories), breathing
  at the phase RR (the existing `dur=(60/rr)s` animation), with the parametric skin/cyanosis rule
  (§9). A "tap a region to examine" instruction chip sits over it.
- **Exam buttons:** glass pills with a Tabler icon, label, and a short subtitle (e.g. "Check pupils
  / cranial nerve · ICP"). One per exam descriptor the orchestrator emitted (§5). Buttons gain a
  "performed" check after first open.
- **On tap:** an overlay sheet slides up. The figure cross-fades to a **dedicated high-detail region
  inset** (the camera-zoom effect — see prototype: the eyes get a proper iris/pupil drawing, the
  abdomen a side-on supine view, etc.). The inset plays the parametric animation.
- **Finding popup:** the professional finding prose, value chips (e.g. "R 4 mm fixed", "GCS 8"), and
  a **"Why does this matter?"** button that expands the teaching content inline. The Why box is the
  existing `why` slot (Haiku-filled, Sonnet-verified) — every exam has one.
- **Verified animation corrections from this session** (baked into the registry renderers):
  - **Pupils:** swinging-penlight light reflex — the light lands on the reactive pupil and it
    **constricts**, returns to baseline when the light leaves; the fixed pupil never reacts. Eyes
    are rounded/cartoony (not realistic almonds) to match the LEGO avatar. Labels edge-anchored.
  - **Breathing:** side-on supine abdomen cropped to the midsection (no face/legs), rising/falling
    at the monitor RR; retractions shown only when present; normal skin tone (not blue) unless
    cyanotic (§9).
  - **Cap refill:** examiner thumb + finger (a distinct skin shade) **pinch** the fingertip; on
    release the nailbed **blanches** then refills over `seconds`; labels at the sides, off the finger.
  - **GCS:** the full E/V/M scale table with the patient's rows highlighted and the total shown.
  - **Skin:** a **pan** across the skin that stops on the lesion (e.g. an irregular two-tone
    temporal haematoma); lacerations show a cut, rashes show the rash, etc.

---

## 5. Exam descriptor schema (orchestrator output)

The orchestrator emits an `exams[]` array on each **assess** phase (4–5 per scenario). This
**supersedes the interactive role of `signs[]`** — the physical-exam findings now live in `exams[]`
and are shown via animation rather than guessed. (`vitals[]` and `labs[]` are unchanged.)

```jsonc
// one focused exam — assess phase .exams[]
{
  "id": "pupils",
  "label": "Check pupils",            // the button text
  "region": "eyes",                   // camera target on the avatar
  "animation": "pupil-reaction",      // a registry key — or "custom"
  "params": { "leftMm": 2, "leftReact": "brisk",
              "rightMm": 4, "rightReact": "fixed" },
  "finding": "Right pupil 4 mm fixed; left 2 mm brisk — anisocoria.", // prose, like signs.finding
  "_slotRef": "phase[N].exams.pupils.why",
  "why": null                          // ← Haiku-fills, Sonnet-verifies (existing pipeline)
}
```

- `region` drives which part of the avatar the camera zooms toward; `animation` selects the inset
  renderer; `params` are the numeric/enum knobs that renderer consumes.
- `finding` is the same prose contract as `signs[].finding` today.
- `_slotRef` + `why:null` reuse the exact slot-fill machinery (Haiku dispatcher fills `why`; the
  verifier walks it). No new pipeline.
- **Back-compat:** built-ins (SC1–SC5) and any scenario still emitting `signs[]` are migrated by
  mapping each sign → an `exams[]` entry, choosing a registry `animation` from the sign's system
  (the existing `guessSys()` keyword map → `skin-inspect` / `breathing` / `pupil-reaction` / …) and
  falling back to the generic `inspect` view when nothing matches. Existing scenarios keep working.

---

## 6. The animation library (registry)

Each key is a small parametric SVG/CSS renderer taking `params`. Target set (~20) covering trauma /
critical care / acute care:

| Key | Region | Key params |
|---|---|---|
| `pupil-reaction` | eyes | leftMm, leftReact, rightMm, rightReact |
| `breathing` | chest/abdomen | rate, pattern (regular\|irregular\|labored), retractions (none\|subcostal\|intercostal\|severe) |
| `cap-refill` | hand/nailbed | seconds, site |
| `gcs` | overlay | eye, verbal, motor |
| `skin-inspect` | pannable body | findings:[{type: bruise\|laceration\|rash\|petechiae\|burn\|cyanosis\|pallor\|jaundice, location, severity}] |
| `limb-deformity` | limb | limb, angulation, open(bool), bleed |
| `penetrating-wound` | torso/limb | site, entry, exit(bool), bleed |
| `face-angioedema` | face | lips(severity), tongue(bool), hives(bool) |
| `diaphoresis` | face | severity, flushed(bool) |
| `abdomen` | abdomen | distension, guarding, rigidity, tenderness(location) |
| `fontanelle` | head (infant) | state (sunken\|flat\|bulging) |
| `hydration` | face/skin | mucousMembranes, skinTurgor, sunkenEyes, tears |
| `work-of-breathing` | torso | tripod, nasalFlaring, grunting, headBob |
| `peripheral-perfusion` | extremities | mottling, temperature, color |
| `posturing` | body | type (decorticate\|decerebrate\|flaccid) |
| `seizure-activity` | body | type (focal\|generalized\|absence), active(bool) |
| `edema` | limb/face | location, severity, pitting(bool) |
| `color-general` | face/body | state (pallor\|cyanosis\|jaundice\|flushed\|normal), severity |
| `wound-bleeding` | site | site, severity, controlled(bool) |
| `inspect` (fallback) | any | freeText — generic zoom + finding card, no bespoke animation |

The registry lives alongside the avatar (e.g. `src/components/player/exams/`), keyed like the
current `visuals[]` accessory keywords — a renderer-not-found resolves to `inspect`, never a crash.
A dev render harness (extend `scripts/render-avatar.mjs`) server-renders every registry key across
sample params to a static gallery for review and to catch NaN/undefined.

---

## 7. The custom-generation fallback

When a scenario needs a finding the registry doesn't cover, the orchestrator sets
`animation: "custom"` with a rich `finding` + `params`. Then:

1. **Generate (build-time, once per scenario):** one bounded **Sonnet** API call is prompted with a
   strict *exam-animation spec* — fixed viewBox, an allowed SVG/CSS subset, named `params` hooks,
   **no `<script>`, no `<foreignObject>`, no external refs**, a size cap — and the `finding`. It
   returns a self-contained animated SVG component (the same kind made by hand this session).
2. **Sanitize + validate:** whitelist-parse (allowed tags/attrs only; strip anything else),
   render smoke-test (the `render-avatar.mjs` harness already catches NaN/undefined), enforce the
   size cap. The markup is rendered as **inert SVG, never executed** — no injection surface.
3. **Cache:** store the validated SVG in the scenario JSON. Generated once; free on replay. It rides
   the existing dispatcher wave model (background, gated before the learner reaches that exam).
4. **Degrade gracefully:** if generation or validation fails, fall back to the `inspect` view
   (zoom + finding card). Nothing ever breaks the run.

Because the ~20-key registry covers most findings, custom-gen fires rarely → small added paid-API
cost, comfortably under the 300 s Vercel ceiling.

---

## 8. Clinical-accuracy integration

- **Orchestrator** emits the `exams[]` descriptors (region/animation/params/finding) under the same
  "MANDATORY CLINICAL ACCURACY" rules and `visuals[]`-style keyword contract. The orchestrator
  prompt gains an "exam descriptors" section listing the registry keys + their params (the contract).
- **Haiku** fills each exam's `why` via the existing dispatcher waves (`_slotRef` + `why:null`).
- **Sonnet verifier** extends `collectUnitFilledItems` / `buildGroundTruth` to walk `exams[]` —
  checking each `finding`, `params`, and `why` against the case ground truth (narrative + teaches +
  tied-correct actions), with the same repair/drop verdicts. Custom-generated SVGs are validated
  structurally (§7); their *clinical* content is governed by the `finding`/`params` the verifier
  already checks.
- **Cyanosis/skin tone** is parametric off SpO₂ (§9), so nothing is hardcoded blue.

---

## 9. The avatar (center-stage) + parametric skin/cyanosis

- Center-stage = the real `src/components/player/PatientSVG.jsx` (figure + bed/crib + blanket +
  teddy + IV + `visuals[]` accessories), already name-seeded, sexed, aged, and breathing at RR.
- **New rule — skin tone is parametric off oxygenation/perfusion** (using the bundle's `skinTone`
  0..1 concept): normal SpO₂ → normal skin; low SpO₂ → cyanosis, **lips-first**, deepening with
  severity. This governs both the avatar and the exam insets (the breathing inset is no longer
  blue at SpO₂ 96).
- A **face-only render mode** of `PatientSVG` (the Stage-4 card chips + a likely zoom target) is the
  natural first avatar-expansion piece and is reused by the exam camera for face-region exams.

---

## 10. Lab section redesign

**Option A — grouped by tube.** Each panel is headed by its color-coded BD Vacutainer collection
tube; results list beneath it; tap a result to **flag** it (graded, like today). A `test → tube`
lookup drives the tube color from the lab `name`/`id`. Mapping taken directly from the
BD Vacutainer Venous Blood Collection Tube Guide:

| Tube | Additive | Used for |
|---|---|---|
| Lavender | K₂/K₃ EDTA | CBC, H&H, platelets, ESR, HbA1c |
| Gold (SST) / Red | clot activator + gel / serum | chemistry, electrolytes, LFTs, CRP, troponin |
| Light blue | sodium citrate (3.2%) | PT/INR, aPTT, fibrinogen, D-dimer |
| Green | lithium/sodium heparin | plasma chemistry, ammonia, fast STAT lytes |
| Gray | sodium fluoride / oxalate | glucose, lactate |
| Pink | K₂EDTA | type & screen / blood-bank cross-match (AABB) |
| Royal blue | clot activator / K₂EDTA | trace elements, toxicology |
| Tan | K₂EDTA | lead |
| Yellow | SPS / ACD | blood cultures (SPS) · HLA/DNA (ACD) |

Unknown/novel labs default to gold (serum) or the `inspect` neutral tube; the lookup is data, easy
to extend.

---

## 11. Professional UI pass (goal B)

Roll the `src/lib/design/tokens.js` "Midnight Neon" module (palette, `glass()`/`chip()`/`cta()`,
Fredoka/Nunito) across every player + debrief surface, sourcing all inline styles from the module.
Clear the open `DESIGN_TODO.md` items in the process:

- Opaque "Why?" popups with bordered buttons; accent-colored **bold** terms inside popups.
- ALL-CAPS bold system/section labels.
- Uniform-white vitals on the monitor; frame-level alarm, not per-digit color.
- The "tap each value you believe is abnormal" instruction line on the monitor + labs.
- Fix the stretched VS-monitor aspect on the reassess screen.
- Surface the reassuring-`why` content (today `LabPanel` only shows "Why?" on abnormal items).
- Lab-tube / imaging icons via `visualMeta.js`.
- Circular avatar-**face** card chips (face-only `PatientSVG` mode) replacing emoji icons.
- Debrief TL;DR as an inline expandable.

Code style stays strict: JS, no template literals (string `+` concat), no arrow fns in JSX attrs,
inline styles, `Object.assign`, plain `function` decls.

---

## 12. Component / file inventory (anticipated)

**New**
- `src/components/player/exams/registry.js` — `animation` key → renderer map (+ `inspect` fallback).
- `src/components/player/exams/*.jsx` — the ~20 parametric renderers.
- `src/components/player/FocusedExam.jsx` — center-stage avatar + exam buttons + the zoom/inset
  overlay + finding popup + Why box.
- `src/lib/ai/examGen.js` — build-time custom-animation generation + sanitize/validate + cache.
- `src/lib/scenarios/labTubes.js` — the `test → tube` lookup.

**Changed**
- `src/lib/ai/prompt.js` — orchestrator emits `exams[]`; add the exam-descriptor contract section.
- `src/lib/ai/verifier.js` — walk `exams[]` in collect/ground-truth.
- `src/lib/ai/dispatcher.js` — exam `why` slots in the fill waves; the custom-gen wave.
- `src/components/player/AssessPanel.jsx` — 3-part layout (monitor + FocusedExam + labs).
- `src/components/player/LabPanel.jsx` — Option-A grouped-by-tube + tubes.
- `src/components/player/PatientSVG.jsx` — parametric skin/cyanosis; face-only render mode.
- `src/components/player/ScenarioPlayer.jsx` / `Debrief.jsx` — Midnight Neon rollout; remove the
  binary sign-flagging path.
- `scripts/render-avatar.mjs` — extend to render the exam registry gallery.
- `DESIGN_TODO.md` — move cleared items to Resolved.

---

## 13. Phasing

- **Phase 1 — core (ship first):** `exams[]` schema + orchestrator + verifier; the FocusedExam UI +
  the 3-part assess phase; the first ~8 registry renderers (pupils, breathing, cap-refill, gcs,
  skin-inspect, limb-deformity, penetrating-wound, face-angioedema); Option-A labs; the
  Midnight-Neon player/debrief rollout + `DESIGN_TODO` clears. (Custom-gen falls back to `inspect`.)
- **Phase 2 — custom-generation:** `examGen.js` build-time Sonnet generation + sanitize/validate +
  cache; dispatcher wave; verifier hook.
- **Phase 3 — breadth + polish:** fill the registry to ~20; debrief deep-dive polish; face-only
  avatar chips; optional light-theme variant.

Each phase: dry-run the orchestrator (`scripts/orchestrator-dry-run.mjs`) before prompt-touching
commits; smoke-test live (`vercel dev` :3000) before commit; clinical review of generated content.

---

## 14. Risks & open questions

- **Generation budget:** exam `why` slots + any custom-gen add dispatcher work; keep within the
  ~95–100 s perceived / 300 s hard budget. Mitigation: registry-first, custom-gen rare + cached.
- **Custom-gen safety:** the sanitizer whitelist must be tight (no scripts/foreignObject/external
  refs) and render-tested; treat generated markup as inert data.
- **Migration:** `signs[] → exams[]` mapping for built-ins must preserve current findings; verify
  SC1–SC5 still render sensible exams.
- **Open:** minimum-exams-to-proceed (default all, or N?); whether the debrief surfaces an
  "exams performed" recap; exact `region → camera target` table for the avatar.

---

## 15. Out of scope / future

- 3D avatar (the descriptor is renderer-agnostic, so it remains possible later).
- Light-theme token variant.
- Richer avatar emotions / Stage-5 accessory expansion beyond what the exams need.

---

## Appendix — prototypes

This design was iterated through interactive prototypes rendered in-session (2026-06-19): the
focused-exam screen, the five exam animations (with the corrections in §4), the three lab layouts
(Option A chosen), and a six-tile finding-library preview at the agreed gore level (a little blood
OK; open fracture shows a small bone; nothing graphic). The component bundle pushed to Claude Design
via `/design-sync` captures these as editable previews.
