# Curveball (Stage 3) — Design Spec

Date: 2026-06-11. Status: APPROVED by Sebastian (verbal), implementing.

## Goal

Make the curveball work for AI scenarios when the builder's Curveball toggle is
ON: a single unexpected acute complication that strikes the SAME patient just
after the Round 2 interventions, generated in the background with the same
loyalty + persistence + dispatcher-fill safeguards as Round 2. Toggle-gated.
Hybrid character via `curveballTrigger` ∈ `reactive | disease | random`, chosen
by the model per scenario so it is not formulaic.

## Locked decisions

- **Reactive is deterministic.** The "reactive" trigger keys off the
  interventions that were *available* in Rounds 1–2 (not the learner's literal
  clicks), so the curveball pre-generates, persists, and replays consistently —
  same model the Round 2 deterioration already uses. (`disease`/`random` are
  naturally deterministic.)
- **Generation architecture: sequential background after Round 2.** Round 2
  generates in the background as today; the moment it merges, a second
  background call generates the curveball, seeded with the *evolved Round 2
  state* + the original brief. Each call stays small (no token-ceiling risk),
  the curveball is clinically coherent because it builds on the Round-2
  deterioration, and the interlude wait still only gates on Round 2.
- **Not-ready fallback: a brief "monitor alarming" bridge beat.** If a learner
  finishes the Round 2 intervene before the curveball has generated, a short
  alarm/hold screen (shake + spinner) advances to the curveball the instant it
  is ready, skips to reassess if generation errored, and has a safety timeout so
  the learner is never stranded.
- **Recovery recap includes the curveball.** The curveball's `tied-correct`
  actions appear in the "What Saved This Patient" list, tagged as the curveball
  beat (they are graded must-haves).

## What already exists (do not rebuild)

- Player stages `cb-alert` → `cb-act` → `reassess` are fully built and render
  `sc.curveball`. `afterAct` already calls `trigCb()` after the final intervene
  when `sc.curveball` exists. Populating `sc.curveball` lights the path up.
- Debrief renders `sc.curveball.teaches` as the "Curveball Deep Dive".
- The slot *resolver* understands `phase[curveball].*` refs; `migratePhase(sc.curveball,
  "curveball")` stamps those refs and preserves the curveball-only fields
  (`name`, `narrative`, `teaches`) via its pass-through `else out[k]=phase[k]`.
- SC1 (fussy-infant) and SC2 (vomiting-toddler) built-ins already carry
  curveballs and exercise this path (as 2-phase cases). Regression surface.
- `_cbMode` is stashed on the Round 1 scenario; the builder toggle sets it
  (default ON); toggle OFF nulls the curveball in `applyPostParseFixups`.

## Curveball object shape (matches built-ins)

```
"curveball": {
  "name": "<short event title>",
  "narrative": "<bedside narrative of the acute event>",
  "curveballTrigger": "reactive" | "disease" | "random",
  "vitals": [ slot-shaped vital, why:null, _slotRef phase[curveball].vitals.<id>.why ],
  "signs":  [ slot-shaped sign,  why:null, _slotRef phase[curveball].signs.<id>.why ],
  "labs":   [ slot-shaped lab,   why:null, _slotRef phase[curveball].labs.<id>.why ],
  "actions": { "tools": {<id>: slot-shaped action, fb:null, ...}, "meds": {...} },
  "teaches": [ {title, content, tldr} ]   // authored INLINE (content filled), no slot
}
```

vitals/signs/labs `why` and action `fb` are null slots filled by the dispatcher.
`teaches` content is authored inline in the generation call (the built-in pattern;
the dispatcher does not fill curveball teaches). Defib is always in tools.

## Implementation

1. **`prompt.js` — `buildCurveballPrompt()`** derived from `buildOrchestratorBase()`
   via `_promptSwap` (assert anchors). Three swaps: role → "adding one curveball
   beat to an existing two-round case, same patient"; phase-count → "emit a
   single curveball object, not phases"; output → "emit ONLY a curveball object"
   with the shape above. Specify `curveballTrigger` selection and the
   reactive=available-interventions rule. Clinical core preserved verbatim.

2. **`client.js` — `generateCurveball(scenario, signal)`** non-streaming, mirrors
   `generateRound2`. User message threads the original brief (loyalty) + a
   compact evolved context (patientCard, norms, the Round 2 assess + intervene
   phases). **`mergeCurveball(scenario, cb)`** attaches `scenario.curveball`,
   runs `migrateLegacyScenario` (stamps `phase[curveball].*` refs + backfills
   nulls), keeps source/`_cbMode`, returns merged.

3. **`explanationSlots.js` — `collectAllNullSlots`** also walks `scenario.curveball`:
   vitals/signs/labs `why` → wave 3, action `fb` → wave 4. Resolver already
   handles `phase[curveball].*`.

4. **`playerStore.js`** — add `curveballState` (`idle|generating|ready|error`) +
   `curveballAbortController`, init in `start()` (`idle` only for a full `_cbMode`
   case with no curveball yet, else `ready`), teardown in `start()`/`reset()`.
   **`startCurveballGeneration()`**: guards (no `_cbMode`→ready; curveball
   present→ready; needs Round 2 / phases≥4 else defer; generating→bail);
   generate→merge→persist(`updateCustom`)→`runDispatcher` fill. Chained from
   `startRound2Generation`'s success path; also called re-entrantly on mount so a
   reload after R2 but before the curveball resumes it.

5. **`ScenarioPlayer.jsx`** — mount effect also calls `startCurveballGeneration`.
   `afterAct` on the final intervene: fire `trigCb()` if the curveball is present;
   else if `_cbMode` and curveball still generating → `cb-wait` bridge; else
   `reassess`. Add the `cb-wait` stage (alarm + spinner) and an effect that
   advances it (trigCb on ready / reassess on error / safety timeout). Extend the
   `correctActions` builder to include the curveball's `tied-correct` actions
   (round-tagged last, `isCurveball` badge in the recovery list).

## Verification (project method: live AI smoke + clinical review)

- `vite build` compiles.
- Live AI smoke through the real app + `/api/generate`: toggle OFF (no curveball,
  R2→reassess); toggle ON for one scenario of each trigger mode. Verify the
  curveball fires after the Round 2 intervene, is coherent with the Round-2
  deterioration, `why`/`fb` filled before the beat, persists across reload,
  debrief deep-dive present, zero console errors.
- Independent pediatric-critical-care reviewer subagent confirms each generated
  curveball is clinically sound (no dangerous doses/routes).
- Confirm SC1/SC2 built-in curveballs still fire (regression).
```
