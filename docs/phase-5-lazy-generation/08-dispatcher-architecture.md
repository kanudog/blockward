# Phase 5.4.3b — Wave-Based Dispatcher Architecture (Locked)

**Status:** LOCKED 2026-05-18
**Schema target:** 5.4.1
**Purpose:** Capture the locked design for the wave-based Haiku
dispatcher implemented in Commit 2 of Phase 5.4.3b. The dispatcher
consumes a Sonnet-generated scenario skeleton with null why/fb/
content slots and fires Haiku calls in priority waves to fill them,
persisting results back to localStorage as it goes.

## Phase 6.0 amendment (2026-05-26)

Implementation of this dispatcher shipped under a renamed phase
banner: **Phase 6.0 — Wave Dispatcher** (previously "Phase 5.4.3b
Commit 2"). The architecture below is implemented as designed except
for two amendments captured here:

1. **Wave 5 fires automatically after wave 4, not on debrief mount.**
   Original spec had wave 5 deferred until the user reached the
   debrief screen. Amended: wave 5 runs inside the same background
   `.then()` chain as waves 2-4. Rationale:
   - **Cache TTL exposure.** Ephemeral prompt caches live for ~5
     minutes after last use. A user who lingers mid-scenario for
     several minutes between wave 4 and debrief could miss the
     deep-dive cache window. Running all five waves in a tight
     cluster keeps every call inside one cache window.
   - **User intent.** The point of lazy generation is to fill the
     scenario in the background so the user never waits. Tying
     wave 5 to a screen navigation event re-introduces a "wait at
     this screen" moment that defeats the design goal.
2. **`startDeepDiveWave` action removed from the spec.** With wave 5
   in the main chain, the separate playerStore action and the
   Debrief mount-time `useEffect` from the original architecture are
   not needed. The single `startDispatcher` action fires on
   ScenarioPlayer mount and owns the whole pipeline.

The five-wave grouping, per-wave persistence debouncing, cache
warmup pattern, abort-on-scenario-change behavior, and built-in /
replay gates all match the original spec.

## Relationship to prior design docs

- Schema 5.4.1 (`04-skeleton-schema-v1.md`) defines the slot
  structure this dispatcher consumes and fills.
- Orchestrator prompt (`05-orchestrator-prompt-design.md`) is what
  Sonnet uses to produce the skeleton. The orchestrator is the
  upstream producer; the dispatcher is the downstream consumer.
- Haiku per-item prompt (`06-haiku-per-item-prompt-design.md`) is
  what waves 1-4 use.
- Haiku deep-dive prompt (`07-haiku-deep-dive-prompt-design.md`)
  is what wave 5 uses.

This doc is the bridge between the prompts and the player UI.
Without the dispatcher, the prompts have no orchestration; the
scenario JSON sits with null slots forever and the player has
nothing to display.

## Background: integration audit findings

An audit of the current codebase (2026-05-18) surfaced several
facts that shaped this design. Documented here so the design
decisions trace back to actual code, not assumed code.

- **Storage** is `scenariosStore.js` (Zustand) backed by
  `bw-custom` localStorage. Mutations are full-array serialization
  via `saveS(...)`. The relevant write API is `updateCustom(sc)`.
- **Runtime player state** is `playerStore.js` (Zustand). The
  current scenario lives in `playerStore.activeScenario`. React
  re-renders are triggered by `forceRefreshScenario()` which
  creates a new top-level object reference because slot writes
  mutate in place.
- **Slot writes** go through `writeExplanationToSlot(sc, slotRef,
  text)` in `slotResolve.js`. The function mutates `sc` in place
  and returns boolean success.
- **Slot discovery** does not have a complete walker. The closest
  is `collectMissingExplanationSlots(sc, phaseIdx)` in
  `explanationSlots.js` which is per-phase and covers vitals/
  signs/labs/tools/meds. The debrief deep-dive case is not
  covered. This dispatcher will need to extend this helper or add
  a new wave-aware variant.
- **Debrief.jsx** currently renders `sc.debrief.explainers[]`
  (legacy shape). It does NOT render `sc.debrief.physiologyDeepDive[]`
  (schema 5.4.1 shape). Commit 2 must add rendering for the new
  shape.
- **Generation handoff** goes BuilderForm → generateScenario →
  applyPostParseFixups → addCustom → playerStore.start. The
  dispatcher's entry point is after `playerStore.start(sc)` in
  the ScenarioPlayer lifecycle.
- **Built-in scenarios** (SC1-SC6) gate out via `sc.source !==
  "ai"`. They have populated why/fb/content fields. The
  dispatcher must preserve this gate.
- **Existing in-flight tracking** uses `lazyFetchedSlots` in
  playerStore, keyed by item id (e.g., "vital:hr"). This
  dispatcher replaces the item-id key with a slot-ref-path key
  for unique addressing of every slot type.

## Design forks locked

### Architecture forks

1. **One dispatcher with branching, not two.** Wave dispatch logic
   is shared; per-item vs deep-dive differs only in which prompt
   and user-message builder to use.

2. **New file `src/lib/ai/dispatcher.js`.** Keeps `client.js`
   focused on HTTP transport and individual call mechanics. The
   dispatcher is its own subsystem.

3. **Fire-and-forget at scenario load.** First-time-only gate
   ensures no API calls on replay (when slots are already
   populated). Phase 1 wave gates the "Assess" button — user
   waits on the EMS report screen until wave 1 completes. Later
   waves run in background while user plays.

4. **Failure handling: retry once, then slot stays null.** Match
   legacy `fetchExplanations` behavior. Slot stays null forever
   on failure; user gets blank where modal content would have
   appeared. Acceptable for first iteration; can revisit with
   synthesized fallbacks in a later phase.

5. **No internal concurrency limit.** Trust Anthropic rate limits
   at Vercel Pro tier. Per-wave debouncing of persistence writes
   reduces localStorage write amplification from ~30 writes per
   scenario to ~5 (one per wave).

### Behavioral forks (from F1-F10 of the audit)

- **F1 — Render both debrief shapes during transition.**
  `Debrief.jsx` renders `physiologyDeepDive[]` (new schema 5.4.1
  shape) when present, falls back to `explainers[]` (legacy
  shape) for scenarios that don't have the new field. Built-ins
  keep using the legacy shape until a future commit migrates
  them.

- **F2 — Option A for Phase 1 gating.** The "Assess" button on
  the EMS report screen is disabled until wave 1 completes. User
  sees a loading state during that wait (estimated 5-15 seconds).
  Once wave 1 completes, the user proceeds normally; subsequent
  waves run in the background. Replay of a scenario is a no-op
  for the dispatcher (first-time-only gate).

- **F3 — Two prompt caches.** Per-item and deep-dive use
  different system prompts, so they have separate Anthropic cache
  prefixes. Dispatcher tracks `perItemCacheWarmed` and
  `deepDiveCacheWarmed` flags at dispatcher scope.

- **F4 — Per-wave debouncing.** Each wave's slot completions
  accumulate in the scenario object; persistence to localStorage
  happens once after the wave completes (or aborts), not per
  slot. Reduces writes from ~30 to ~5 per scenario.

- **F5 — Slot-ref-path-keyed idempotency.** Replace
  `lazyFetchedSlots` keying from item id to slot ref path string.
  Cleaner; uniquely addresses every slot type including debrief.

- **F6 — Slot ref string is the canonical internal form.**
  Scenarios carry strings in `_slotRef` fields. Dispatcher reads
  those strings, parses to object form only when calling
  `writeExplanationToSlot`. Single direction of conversion.

- **F9 — Independent waves with shared cache state.** Wave N
  does not wait for wave N-1 except via the dispatcher's overall
  sequencing. Cache warmup is shared across waves of the same
  prompt kind via the F3 flags.

- **F10 — Scenario-level AbortController.** One controller per
  scenario lifetime. Aborted on scenario unmount or new scenario
  load. Replaces the existing per-phase abort pattern in
  ScenarioPlayer.

### Deferred to Phase 5.4.4 (logged to DESIGN_TODO)

- Per-chip loading shimmer for in-flight slots (currently only a
  global header pill exists)
- The UX details of the Phase 1 gating loading state (button
  label, spinner, progress indication)
- Whether to pre-warm the deep-dive cache during wave 4 idle
  time (currently wave 5's first call does the warmup at debrief
  entry)

## Wave structure

Five waves, each runs at most once per scenario lifetime.

| Wave | Trigger | Prompt | Contents | Approx call count | Blocks user |
|------|---------|--------|----------|-------------------|-------------|
| 1 | Scenario load | Per-item | Phase 1 vitals/signs/labs `why` slots | 12-18 | Yes (Assess gated) |
| 2 | After wave 1 completes | Per-item | Phase 1 actions `fb` slots | 6-9 | No (background) |
| 3 | After wave 2 completes | Per-item | Phase 2 vitals/signs/labs `why` slots | 8-12 | No (background) |
| 4 | After wave 3 completes | Per-item | Phase 2 actions `fb` slots | 6-9 | No (background) |
| 5 | Debrief screen entry | Deep-dive | `debrief.physiologyDeepDive[].content` slots | 3-5 | No (debrief is the end) |

Total expected calls per scenario: ~35-50 across all waves.

Why this order:
- Phase 1 is what the user sees first; its `why` content must be
  ready before "Assess" unlocks
- Phase 1 actions (`fb`) are needed before user enters intervene
  phase; queued immediately after Phase 1 findings
- Phase 2 content can fully overlap with Phase 1 play
- Deep dives only need to be ready when user reaches debrief

## Within-wave cache warmup pattern

Each wave runs this pattern. The pattern is identical across all
waves; differences are only in which prompt/builder pair is used.
async function runWave(slots, kind, scenario, signal):
if slots is empty:
return
  // Cache warmup gate
  warmupNeeded = (kind === "per-item" && !perItemCacheWarmed)
              || (kind === "deep-dive" && !deepDiveCacheWarmed)
  
  if warmupNeeded:
      // Fire the first call alone; await its response so the 
      // Anthropic backend registers the prompt as cached
      await fireSingleCall(slots[0], kind, scenario, signal)
      mark the appropriate cache flag as warmed
      remainingSlots = slots[1:]
  else:
      remainingSlots = slots
  
  // Fire remaining calls in parallel; cache reads are cheap
  await Promise.all(
      remainingSlots.map(slot => fireSingleCall(slot, kind, scenario, signal))
  )
  
  // Persist once after the entire wave completes
  updateCustom(scenario)
  forceRefreshScenario()

Two important details:

- **Await before parallel batch.** The first call's response must
  return before subsequent calls fire, because Anthropic's cache
  is registered when the call completes, not when it starts.
  Without the await, subsequent calls might also write the cache
  (you'd see two cache_creation entries in usage).

- **Cache flag persists across waves.** If wave 1 already warmed
  the per-item cache, waves 2/3/4 skip the warmup step and fire
  all calls in parallel immediately.

## fireSingleCall behavior

Per-call mechanics. Same shape as legacy `_explanationSingleCall`
in client.js but generalized for both prompt kinds.
async function fireSingleCall(slot, kind, scenario, signal):
systemPrompt = (kind === "per-item")
? buildPerItemExplanationPrompt()
: buildDeepDivePrompt()
  userMessage = (kind === "per-item")
      ? buildPerItemUserMessage(scenario, slot.slotRefString)
      : buildDeepDiveUserMessage(scenario, slot.slotRefString)
  
  try first attempt:
      fire POST /api/generate with
          model: HAIKU_MODEL_ID
          system: [{type:"text", text:systemPrompt, cache_control:{type:"ephemeral"}}]
          messages: [{role:"user", content:userMessage}]
          signal: signal
      parse response via parseDelimitedDeepDives
      if successful and body present:
          writeExplanationToSlot(scenario, parsedSlotRef, body)
          return
  
  on first failure (non-abort):
      wait 1 second
      retry once with same parameters
      on second failure (non-abort):
          log warning, slot stays null, return
  
  on abort error:
      throw (propagate to caller; aborts entire wave)

- The slot's `slotRefString` is the raw string from the scenario
  JSON (e.g., `"phase[0].vitals.hr.why"`). The dispatcher's
  `writeExplanationToSlot` call converts to object form internally.
- Cache control is on the system prompt block per existing
  pattern. The first call of each kind writes the cache;
  subsequent calls read it.
- Failure handling matches existing `fetchExplanations`: retry
  once, then leave the slot null forever. The replay flow doesn't
  notice null slots from a failed prior fetch — they just stay
  null and show empty in the UI.

## First-time-only gate

Before any waves fire, the dispatcher checks whether the scenario
has any null slots at all.
function dispatcherShouldRun(scenario):
if scenario.source !== "ai":
return false  // built-ins have populated slots
  nullSlots = collectAllNullSlots(scenario)
  if nullSlots is empty:
      return false  // replay; slots already filled
  
  return true

If false, the dispatcher returns immediately. No API calls, no
loading state on the EMS screen, no persistence write. Replay of
any scenario the dispatcher has previously filled is a no-op.

## collectAllNullSlots

New helper (likely in slotResolve.js or explanationSlots.js).
Walks the scenario and returns a flat array of `{ slotRefString,
wave, kind }` for every null slot.
function collectAllNullSlots(scenario):
results = []
  for each phase in scenario.phases:
      for each item in phase.vitals + phase.signs + phase.labs:
          if item.why is null:
              results.push({
                  slotRefString: item._slotRef,
                  wave: phase.phaseIndex === 0 ? 1 : 3,
                  kind: "per-item"
              })
      for each action in phase.actions.tools + phase.actions.meds:
          if action.fb is null:
              results.push({
                  slotRefString: action._slotRef,
                  wave: phase.phaseIndex === 0 ? 2 : 4,
                  kind: "per-item"
              })
  
  if scenario.debrief?.physiologyDeepDive:
      for each dive in scenario.debrief.physiologyDeepDive:
          if dive.content is null:
              results.push({
                  slotRefString: dive._slotRef,
                  wave: 5,
                  kind: "deep-dive"
              })
  
  return results

Then group by wave: `slotsByWave = groupBy(results, "wave")`.

## Dispatcher entry point and lifecycle

The dispatcher is invoked by `ScenarioPlayer.jsx` via a new action
on `playerStore`:
// In playerStore.js
startDispatcher: async () => {
const sc = get().activeScenario
if (!dispatcherShouldRun(sc)) return
  set({ dispatcherState: "warming-up", waveOneComplete: false })
  const abortController = new AbortController()
  set({ dispatcherAbortController: abortController })
  
  const slotsByWave = groupSlotsByWave(collectAllNullSlots(sc))
  
  // Wave 1 blocks; user is waiting on EMS report screen
  await runWave(slotsByWave[1] || [], "per-item", sc, abortController.signal)
  set({ waveOneComplete: true, dispatcherState: "background" })
  
  // Subsequent waves run in background, not awaited
  runWave(slotsByWave[2] || [], "per-item", sc, abortController.signal)
      .then(() => runWave(slotsByWave[3] || [], "per-item", sc, abortController.signal))
      .then(() => runWave(slotsByWave[4] || [], "per-item", sc, abortController.signal))
      // Wave 5 fires separately, on debrief entry

  // The async chain runs to completion or aborts on scenario unmount.
}

Wave 5 has a separate trigger (debrief entry) so it gets its own
action:
// In playerStore.js
startDeepDiveWave: async () => {
const sc = get().activeScenario
const slots = collectAllNullSlots(sc).filter(s => s.wave === 5)
if (slots.length === 0) return  // already filled or no deep dives
  const signal = get().dispatcherAbortController?.signal
  await runWave(slots, "deep-dive", sc, signal)
}

`ScenarioPlayer.jsx` calls `startDispatcher()` in a mount-time
useEffect, and `Debrief.jsx` calls `startDeepDiveWave()` in its
own mount useEffect.

## Persistence write strategy

Per-wave debouncing. After each wave completes, the dispatcher
calls `updateCustom(sc)` once and `forceRefreshScenario()` once.
Five total writes per scenario for a full populate.

Note: even though waves 2/3/4 run in background, each one still
triggers its own write at completion. Five writes total: wave 1,
wave 2, wave 3, wave 4, wave 5. Not 30.

## AbortController scope

One controller per dispatcher lifetime. Stored in
`playerStore.dispatcherAbortController`. Aborted in two scenarios:

- Scenario unmount: `playerStore.start(newSc)` aborts any
  in-flight dispatcher for the previous scenario before starting
  the new one.
- Explicit user navigation away from the scenario (back button,
  new scenario load): same abort path.

When aborted, all in-flight `fireSingleCall` invocations get the
abort signal and throw `AbortError`. These propagate up through
the wave's `Promise.all` and abort the wave. Subsequent waves
never start because the chain breaks at the aborted promise.

The slots that did complete before abort remain written (the
dispatcher already wrote to them in place). The wave's persistence
write may or may not have happened depending on timing; either way
the scenario can be resumed from whatever state it's in.

## Failure handling summary

| Failure type | Behavior |
|--------------|----------|
| Individual call network error | Retry once after 1s; on second failure, log warning and slot stays null |
| Individual call returns malformed output (no ###ITEM block) | Same as network error: retry once, then null |
| Entire wave times out | Anthropic API timeouts return as call errors; handled per-call |
| Abort (user navigated away) | Propagate AbortError up through wave; subsequent waves don't start |
| First call fails during cache warmup | Cache flag not set; second wave's first call will retry warmup |

## Code changes summary

Files touched by Commit 2:

**New files:**
- `src/lib/ai/dispatcher.js` — main dispatcher logic
- (none beyond that)

**Modified files:**
- `src/lib/scenarios/slotResolve.js` or `src/lib/scenarios/explanationSlots.js` — add `collectAllNullSlots` walker that includes debrief
- `src/stores/playerStore.js` — add `startDispatcher`, `startDeepDiveWave`, `waveOneComplete`, `dispatcherState`, `dispatcherAbortController` state; replace `lazyFetchedSlots` keying from item-id to slot-ref-path
- `src/components/player/ScenarioPlayer.jsx` — call `startDispatcher` on mount; gate "Assess" button on `waveOneComplete`; remove legacy lazy-fetch useEffect
- `src/components/player/Debrief.jsx` — render `sc.debrief.physiologyDeepDive[]` (parse three-part markdown, render collapsible TL;DR); call `startDeepDiveWave` on mount
- `src/lib/ai/client.js` — delete legacy `fetchExplanations`, `_buildExplanationUserMsg`, `_explanationSingleCall`, `_buildExplanationUserMsg`
- `src/lib/ai/prompt.js` — delete deprecated `buildExplanationPrompt`
- `DESIGN_TODO.md` — log per-chip shimmer and Phase 1 gating UX details for Phase 5.4.4

Approximately 200-300 lines of new code (dispatcher), 30-50 lines
modified (player, debrief), 30-50 lines deleted (legacy client.js
+ prompt.js). Net positive change of roughly 200-300 lines.

## Smoke test plan

A new script `scripts/dispatcher-smoke-test.mjs` exercises the
dispatcher end-to-end against a fresh AI-generated scenario.

Behaviors to verify:

1. **First-time gate behavior:** Run against a scenario with all
   null slots → dispatcher runs all five waves → all slots
   populated → second run against the same scenario object →
   dispatcher returns immediately (no API calls).

2. **Wave timing:** Wave 1 completes before wave 2 starts (because
   wave 2 is in the .then() chain). Verify timestamps in logs.

3. **Cache warmup:** First call of wave 1 shows
   cache_creation_input_tokens > 0; subsequent per-item calls
   show cache_read_input_tokens > 0 and cache_creation = 0. Same
   pattern for wave 5's first call vs subsequent deep-dive calls
   (different cache prefix).

4. **Slot completeness:** After all waves complete, scenario JSON
   has zero null why/fb/content slots.

5. **Persistence count:** updateCustom is called exactly 5 times
   (once per wave that runs), not 35-50 times.

6. **Abort behavior:** Abort the controller mid-wave-2 → wave 2's
   in-flight calls throw AbortError → waves 3, 4, 5 don't start →
   scenario object retains whatever slots were filled before the
   abort.

7. **Built-in gating:** Run dispatcher against SC1 → dispatcher
   returns immediately (sc.source !== "ai" gate).

## Open questions deferred to Phase 5.4.4

See DESIGN_TODO.md for UI work that builds on this dispatcher:
- Per-chip shimmer for in-flight slots (currently only the global
  header pill exists)
- Loading state design on EMS report screen during wave 1
- Whether to pre-warm deep-dive cache during wave 4 idle time

Implementation of these would happen alongside Phase 5.4.4
(wiring the orchestrator into live generation), where the
dispatcher would actually fire in production.
