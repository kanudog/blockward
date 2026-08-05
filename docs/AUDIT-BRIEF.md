# Coverage audit brief

Paste the prompt below into a fresh session. Everything it needs is in the repo.

---

## PROMPT

I want a **coverage audit** of Block Ward (`/Users/openclaw/Documents/blockward`, repo `kanudog/blockward`, branch `main`).

**The question:** for every piece of content the generator can emit, is there something real on the other end that renders it — and conversely, is there art/UI in the codebase that nothing can ever reach?

This app has two halves that drift apart silently. An AI generates cases (tool ids, med ids, findings, accessory keywords, scoring tools). The app renders them (3D accessories, icons, scoring breakdowns, body-system cards). When an id exists on one side but not the other, **nothing errors** — the feature just quietly does nothing. That silent-gap class is what I want found.

### Start here

```bash
npm run audit          # coverage matrix across every registry
npm run check:systems  # 18 body-system routing cases
npm run check:accessories  # 15 accessory hedge/match cases
npm run check:verbosity    # 13 explanation-shaping cases
npm run build
```

`scripts/audit-coverage.mjs` is the starting point, not the finish line. Extend it. It currently checks accessories, tools/meds/icons, figure look, scoring tools, and body systems — there are dimensions it does not cover yet (poses, faces, stations, lab-tube groupings, med route colours, curveball action pools, insight cards, stage transitions).

### Known gaps — do not spend time rediscovering these

1. **Central lines have no 3D model.** `port-chest` was tried and removed because `accessories.js` has no case for it. "Place central venous line" currently renders nothing. Decide: build the model, or map it to an existing one.
2. **`table-side`** is a renderable 3D model no vocab phrase can trigger — unreachable art.
3. **FAST and Aldrete** are named in `FocusedExam.jsx` but only `GCS_SCALE` exists. A case emitting either gets no scoring breakdown. Same for PEWS, Westley, Wong-Baker, FLACC, Apgar — none implemented.
4. **`epiPen` and `o2mask`** are icon cases matching no registry id (`o2mask` is a deliberate lowercase alias for `o2Mask`; `epiPen` may be dead).
5. **Link sharing is architecturally dead** — a real case encodes to ~105,000 URL chars against a 4,000 cap; even a stripped skeleton is ~27,000. Out of scope for this audit.

### What I want checked

Both directions, for each dimension:

| Dimension | Generator side | Render side |
|---|---|---|
| 3D accessories | `sceneVocab.js` phrases | `accessories.js` APPLY ids |
| Interventions | `lib/scenarios/packs/*.js` | `icons.jsx` ToolIcon/MedIcon, `visualMeta.js` |
| Findings | `sign.sys` from the prompt | `bodySystems.js` SYS_ICON + SYSTEM_ORDER |
| Scoring tools | whatever a case emits | `FocusedExam.jsx` scale tables |
| Figure | `config.js` hair/gown/companion/tone | `figure.js`, `companions.js` |
| Poses & faces | `POSE_RULES` / `FACE_RULES` in `resolver.js` | `figure.js` |
| Stations | age band → crib/bed | `kit.js` |
| Labs | lab `name` + specimen grouping | `LabPanel.jsx` tube colours |

For anything with a gap, say which side is missing and how expensive each fix is. **Do not fix things silently — report first.** I will decide what gets built.

### Method notes — learned the hard way on this codebase

- **A green `npm run build` proves nothing about correctness.** A helper accidentally nested inside another function passed both esbuild and vite and blanked the entire player at runtime. Load the app and click through.
- **Test with real generated labels, not invented ones.** "Prepare intubation kit at bedside" drew an endotracheal tube because the matcher saw the substring `intubat`; "Perform RSI and secure definitive airway" — how the generator actually phrases intubation — matched nothing at all. Both only surfaced when real labels were folded through the real resolver. Pull actual labels out of `src/lib/scenarios/generated/*.json` and the persisted custom cases in localStorage.
- **Check the reverse direction too.** Unreachable art is as real a defect as unrendered content, and only the reverse check finds it.
- **Prefer a script that fails loudly over a screenshot.** Anything you verify by eye, leave behind as a `scripts/check-*.mjs` with a non-zero exit.
- **Watch for my own false positives.** The first version of the audit script reported all 21 companions and one hairstyle as broken; both were regex bugs, not code bugs. Verify a "gap" is real before reporting it.

### Deliverable

1. An extended `scripts/audit-coverage.mjs` covering the dimensions it currently misses.
2. A findings report: what's genuinely broken, what's a gap by design, what's dead code — with a severity call and a rough cost on each.
3. **No behaviour changes without asking me first.** Adding checks and tests is fine and encouraged.

Ask me anything ambiguous before starting rather than guessing.
