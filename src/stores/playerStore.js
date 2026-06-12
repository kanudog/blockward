// Player store: transient in-game state. Not persisted — each scenario
// run starts fresh. View-local state for the debrief (expander indices,
// TLDR toggles, recovery-step counter) stays in the component.
//
// Created in isolation at Checkpoint 2; wired into ScenarioPlayer in
// Checkpoint 3.
//
// Phase 6.0: wave dispatcher state lives here. start(sc) aborts any
// in-flight dispatcher before installing the new scenario; startDispatcher
// builds the controller, persistence callback, and refresh callback then
// hands off to src/lib/ai/dispatcher.js.

import { create } from "zustand";
import { useScenariosStore } from "./scenariosStore.js";
import { startDispatcher as runDispatcher, dispatcherShouldRun } from "../lib/ai/dispatcher.js";
import { verifyUnit } from "../lib/ai/verifier.js";
import { generateRound2, mergeRound2, generateCurveball, mergeCurveball } from "../lib/ai/client.js";
import { vitalsLookup } from "../lib/scenarios/canonicalize.js";
import { migrateLegacyScenario } from "../lib/scenarios/migrateLegacyScenario.js";

var initialState = {
  activeScenario: null,
  stage: "intro",
  phaseIndex: 0,
  flags: {},
  showFb: false,
  cbDone: false,
  vitals: null,
  shake: false,
  skippedActions: [],
  assessHistory: [],
  actionHistory: [],
  // Phase-5.2.5: items now store slot references, not rendered text.
  // Shape: {id, kind, phaseIdx, label, _slotRef: {kind, phaseIdx, indexOrId}}
  // Debrief resolves the current why/fb text via slotResolve.resolveSlotText
  // at render time, so marks made before lazy fetch completes still pick
  // up the populated content once it lands.
  markedForReview: [],
  // Phase-5.2.5: deep-dive content cache. Eager fetch fires on mark;
  // entries arrive over time. Debrief reads from this map first and
  // falls back to the existing batch fetch only for items not yet here.
  // Cleared on start() (per-scenario lifetime).
  deepDiveCache: {},
  // Bug-sweep: per-id in-flight guard for the eager deep-dive fetch.
  // Without it, rapid mark→unmark→mark on the same item double-fires
  // expandSingleMarkedItem. beginDeepDive(id) claims the slot; endDeepDive(id)
  // releases it. Keyed by the (now phase-scoped) marked-item id.
  deepDiveInFlight: {},
  // Phase 6.0: wave dispatcher state.
  //
  // dispatcherFiredSlots — slot-ref-string-keyed map of slots that have
  // been handed to the dispatcher in this scenario lifetime. Replaces the
  // prior item-id-keyed lazyFetchedSlots from Phase 5.3.
  // dispatcherState — "idle" → "warming-up" → "background" → "complete"
  // (or "aborted" on cancellation).
  // waveOneComplete — gates the Assess button until wave 1's Phase 1
  // why slots have been filled.
  // dispatcherAbortController — controller for the in-flight dispatcher.
  // Aborted by start(newSc) and by explicit teardown.
  // perItemCacheWarmed / deepDiveCacheWarmed — tracked here for
  // observability (the dispatcher itself owns its cache state internally).
  dispatcherFiredSlots: {},
  dispatcherState: "idle",
  waveOneComplete: false,
  dispatcherAbortController: null,
  perItemCacheWarmed: false,
  deepDiveCacheWarmed: false,
  // Phase 6.3 (Stage 2): background Round-2 generation state.
  // "idle" (full case awaiting gen) | "generating" | "ready" | "error".
  // The interlude screen gates the Round-2 entry on "ready".
  round2State: "ready",
  round2AbortController: null,
  // Phase 6.3 (Stage 3): background curveball generation state.
  // "idle" (full _cbMode case awaiting its curveball) | "generating" |
  // "ready" | "error". The player's afterAct uses this to decide between
  // firing the curveball, holding on the "monitor alarming" bridge, or
  // skipping to reassess. Default "ready" — only a full curveball-mode case
  // without a curveball yet flips to "idle".
  curveballState: "ready",
  curveballAbortController: null
};

export var usePlayerStore = create(function(set, get) {
  return Object.assign({}, initialState, {
    start: function(sc) {
      // Phase 6.0: abort any in-flight dispatcher from the previous
      // scenario before installing the new one. The dispatcher's
      // per-call fetches receive the abort signal and propagate
      // AbortError through their Promise chain.
      var prev = get().dispatcherAbortController;
      if (prev) {
        try { prev.abort(); } catch (e) { /* best-effort */ }
      }
      // Phase 6.3: same for any in-flight Round-2 generation.
      var prevR2 = get().round2AbortController;
      if (prevR2) {
        try { prevR2.abort(); } catch (e) { /* best-effort */ }
      }
      // Phase 6.3 (Stage 3): and any in-flight curveball generation.
      var prevCb = get().curveballAbortController;
      if (prevCb) {
        try { prevCb.abort(); } catch (e) { /* best-effort */ }
      }
      // Phase 6.1: normalize to schema 5.4.1 shape. Built-ins reach
      // the player without going through scenariosStore.hydrate, so
      // this is the canonical chokepoint where every scenario (built-
      // in, persisted custom, or freshly generated) is guaranteed to
      // be on the array-vitals + string-priority shape the player
      // consumes. migrateLegacyScenario is idempotent — already-
      // migrated scenarios pass through untouched.
      sc = sc ? migrateLegacyScenario(sc) : sc;
      set({
        activeScenario: sc,
        stage: "intro",
        phaseIndex: 0,
        flags: {},
        showFb: false,
        cbDone: false,
        vitals: sc && sc.phases && sc.phases[0] ? vitalsLookup(sc.phases[0].vitals, sc.phases[0].signs) : null,
        shake: false,
        skippedActions: [],
        assessHistory: [],
        actionHistory: [],
        markedForReview: [],
        // Phase-5.2.5: fresh per-scenario cache.
        deepDiveCache: {},
        deepDiveInFlight: {},
        // Phase 6.0: fresh per-scenario dispatcher state.
        dispatcherFiredSlots: {},
        dispatcherState: "idle",
        waveOneComplete: false,
        dispatcherAbortController: null,
        perItemCacheWarmed: false,
        deepDiveCacheWarmed: false,
        // Phase 6.3: a full case still needing Round 2 starts "idle" (the
        // player fires startRound2Generation on mount); everything else is
        // already complete ("ready").
        round2State: (sc && sc._pendingRound2 && (!sc.phases || sc.phases.length < 4)) ? "idle" : "ready",
        round2AbortController: null,
        // Phase 6.3 (Stage 3): a full curveball-mode case that doesn't yet
        // carry a curveball starts "idle" (the player fires
        // startCurveballGeneration after Round 2 lands); everything else
        // (toggle off, quick case, already-built curveball, built-in) is
        // already "ready".
        curveballState: (sc && sc._cbMode && !sc.curveball) ? "idle" : "ready",
        curveballAbortController: null
      });
    },
    reset: function() {
      var prev = get().dispatcherAbortController;
      if (prev) {
        try { prev.abort(); } catch (e) {}
      }
      // Phase 6.3 (Stage 3): abort any in-flight curveball generation so its
      // completion can't resurrect activeScenario after reset.
      var prevCb = get().curveballAbortController;
      if (prevCb) {
        try { prevCb.abort(); } catch (e) {}
      }
      set(initialState);
    },
    setStage: function(s) { set({ stage: s }); },
    setPhaseIndex: function(i) { set({ phaseIndex: i }); },
    setFlags: function(f) { set({ flags: f }); },
    toggleFlag: function(id) {
      set(function(s) {
        var n = Object.assign({}, s.flags);
        n[id] = !n[id];
        return { flags: n };
      });
    },
    setShowFb: function(b) { set({ showFb: b }); },
    setCbDone: function(b) { set({ cbDone: b }); },
    setVitals: function(v, signs) { set({ vitals: vitalsLookup(v, signs) }); },
    setShake: function(b) { set({ shake: b }); },
    addSkipped: function(items) {
      set(function(s) {
        return { skippedActions: s.skippedActions.concat(items) };
      });
    },
    recordAssess: function(snapshot) {
      set(function(s) {
        return { assessHistory: s.assessHistory.concat([snapshot]) };
      });
    },
    recordAction: function(snapshot) {
      set(function(s) {
        return { actionHistory: s.actionHistory.concat([snapshot]) };
      });
    },
    // Phase-5.2.5: accepts slot-ref-shape items
    // ({id, kind, phaseIdx, label, _slotRef}). Toggle preserved for the
    // existing UI affordance (mark/unmark same button). Returns "added",
    // "removed", or null so callers can branch on the transition (e.g.
    // fire eager deep-dive only when adding).
    toggleMarkForReview: function(item) {
      if (!item || !item.id) return null;
      var existing = get().markedForReview.findIndex(function(x) { return x.id === item.id; });
      if (existing >= 0) {
        var copy = get().markedForReview.slice();
        copy.splice(existing, 1);
        set({ markedForReview: copy });
        return "removed";
      }
      if (!item._slotRef) {
        console.warn("toggleMarkForReview: item lacks _slotRef, refusing add", item.id);
        return null;
      }
      set({ markedForReview: get().markedForReview.concat([item]) });
      return "added";
    },
    // Phase-5.2.5: idempotent add (no-op if already marked). Validates
    // that the payload carries a _slotRef so debrief can resolve text
    // freshly at render time.
    addMarkedItem: function(item) {
      if (!item || !item.id || !item._slotRef) {
        console.warn("addMarkedItem: invalid item shape (need id and _slotRef)", item);
        return false;
      }
      if (get().markedForReview.some(function(x) { return x.id === item.id; })) return false;
      set({ markedForReview: get().markedForReview.concat([item]) });
      return true;
    },
    removeMarkedItem: function(id) {
      set({ markedForReview: get().markedForReview.filter(function(x) { return x.id !== id; }) });
    },
    // Phase-5.2.5: store eager deep-dive result. Keyed by item.id.
    setDeepDive: function(itemId, text) {
      if (!itemId || !text) return;
      var next = Object.assign({}, get().deepDiveCache);
      next[itemId] = text;
      set({ deepDiveCache: next });
    },
    // Bug-sweep: claim the in-flight slot for an eager deep-dive fetch.
    // Returns false if a fetch for this id is already running (caller
    // should skip), true if the slot was free (caller proceeds).
    beginDeepDive: function(itemId) {
      if (!itemId) return false;
      if (get().deepDiveInFlight[itemId]) return false;
      var next = Object.assign({}, get().deepDiveInFlight);
      next[itemId] = true;
      set({ deepDiveInFlight: next });
      return true;
    },
    // Release the in-flight slot once the eager fetch settles (success or
    // failure), so a later mark of a still-unfilled item can retry.
    endDeepDive: function(itemId) {
      if (!itemId) return;
      if (!get().deepDiveInFlight[itemId]) return;
      var next = Object.assign({}, get().deepDiveInFlight);
      delete next[itemId];
      set({ deepDiveInFlight: next });
    },
    // Phase-5.3: bump activeScenario's top-level reference to force a
    // React re-render after in-place mutation (lazy explanation fetch
    // mutates phase fields without creating new array/object refs).
    forceRefreshScenario: function() {
      var sc = get().activeScenario;
      if (!sc) return;
      set({ activeScenario: Object.assign({}, sc) });
    },
    // Phase 6.0: dispatcher actions.
    //
    // markDispatcherSlot — record that a slot has been handed to the
    // dispatcher in this scenario lifetime. Idempotent. Useful for
    // dedup if startDispatcher is called more than once (mount cycling).
    markDispatcherSlot: function(slotRefString) {
      if (!slotRefString) return;
      if (get().dispatcherFiredSlots[slotRefString]) return;
      var next = Object.assign({}, get().dispatcherFiredSlots);
      next[slotRefString] = true;
      set({ dispatcherFiredSlots: next });
    },
    setWaveOneComplete: function(b) { set({ waveOneComplete: !!b }); },
    setDispatcherState: function(s) { set({ dispatcherState: s }); },
    // Mount-time entry point called by ScenarioPlayer once per scenario.
    // Sets up the controller and persistence callbacks, then hands off
    // to the dispatcher module. Idempotent — replays of an already-
    // populated scenario short-circuit via dispatcherShouldRun.
    startDispatcher: async function() {
      var sc = get().activeScenario;
      if (!sc) return;
      if (!dispatcherShouldRun(sc)) {
        set({ dispatcherState: "complete", waveOneComplete: true });
        return;
      }
      // Tear down any prior controller (defensive — start(sc) usually
      // handles this, but a remount cycle could land us here twice).
      var prev = get().dispatcherAbortController;
      if (prev) {
        try { prev.abort(); } catch (e) {}
      }
      var controller = new AbortController();
      set({
        dispatcherAbortController: controller,
        dispatcherState: "warming-up",
        waveOneComplete: false
      });
      var updateCustom = useScenariosStore.getState().updateCustom;
      var forceRefreshScenario = get().forceRefreshScenario;
      var hooks = {
        onWaveOneComplete: async function(filledSc) {
          // Phase 6.3 (Stage 3.5): verify Phase 0's fills BEFORE opening the
          // Assess gate, so a learner never opens an unverified explanation.
          try { await verifyUnit(filledSc || get().activeScenario, "phase0", controller.signal, updateCustom, forceRefreshScenario); }
          catch (e) { if (e && e.name === "AbortError") return; }
          set({ waveOneComplete: true, dispatcherState: "background" });
        },
        onBeforeDeepDives: async function(filledSc) {
          // Verify Phase 1's fills in the background, after their fb lands and
          // before the slow deep-dive wave / before the learner reaches them.
          try { await verifyUnit(filledSc || get().activeScenario, "phase1", controller.signal, updateCustom, forceRefreshScenario); } catch (e) {}
        },
        onAllWavesComplete: function() {
          set({ dispatcherState: "complete" });
        },
        onAbort: function() {
          set({ dispatcherState: "aborted" });
        }
      };
      try {
        await runDispatcher(sc, controller, updateCustom, forceRefreshScenario, hooks);
      } catch (err) {
        if (err && err.name === "AbortError") {
          set({ dispatcherState: "aborted" });
          return;
        }
        console.warn("[playerStore.startDispatcher] wave 1 failed: " + (err && err.message || err));
        set({ dispatcherState: "aborted" });
      }
    },
    // Phase 6.3 (Stage 2): generate Round 2 in the background during Round 1
    // play, then merge + persist + fill its why/fb/deep-dive slots. Fired once
    // on mount for a full case. Replay (already 4 phases) or a quick case is a
    // no-op. The interlude screen gates the Round-2 entry on round2State.
    startRound2Generation: async function() {
      var sc = get().activeScenario;
      if (!sc) return;
      if (Array.isArray(sc.phases) && sc.phases.length >= 4) { set({ round2State: "ready" }); return; }
      if (!sc._pendingRound2) { set({ round2State: "ready" }); return; }
      if (get().round2State === "generating") return;
      var prev = get().round2AbortController;
      if (prev) { try { prev.abort(); } catch (e) {} }
      var controller = new AbortController();
      set({ round2AbortController: controller, round2State: "generating" });
      var updateCustom = useScenariosStore.getState().updateCustom;
      try {
        var r2 = await generateRound2(sc, controller.signal);
        var merged = mergeRound2(sc, r2);
        set({ activeScenario: merged, round2State: "ready" });
        try { updateCustom(merged); } catch (e) { /* built-ins / best-effort */ }
        // Fill the new Round 2 why/fb + debrief deep-dive slots in the
        // background. Reuses the Round-2 controller so a scenario change
        // aborts both the gen and the fill. Round 1 slots are already
        // populated, so collectAllNullSlots only walks the Round 2 ones.
        // Phase 6.3 (Stage 3.5): verify the Round-2 fills (after their fb, before
        // the deep-dive wave) so they're checked before the learner reaches them.
        try {
          await runDispatcher(merged, controller, updateCustom, get().forceRefreshScenario, {
            onBeforeDeepDives: async function(filledSc) { try { await verifyUnit(filledSc || get().activeScenario, "round2", controller.signal, updateCustom, get().forceRefreshScenario); } catch (e) {} }
          });
        } catch (e) { /* abort or best-effort */ }
        // Phase 6.3 (Stage 3): now that Round 2 has merged, chain the curveball
        // generation off the evolved Round 2 state. No-op when curveball mode is
        // off or a curveball already exists. Fire-and-forget — it runs in the
        // background while the user plays Round 2.
        get().startCurveballGeneration();
      } catch (err) {
        if (err && err.name === "AbortError") { set({ round2State: "idle" }); return; }
        console.warn("[playerStore.startRound2Generation] " + (err && err.message || err));
        set({ round2State: "error" });
      }
    },
    // Phase 6.3 (Stage 3): generate the curveball in the background AFTER Round 2
    // has merged, seeded with the evolved Round 2 state. Chained from
    // startRound2Generation's success path, and also called re-entrantly from
    // the player mount so a reload after R2 merged but before the curveball
    // landed resumes it. No-op for toggle-off / quick / built-in / already-built
    // cases. Merges + persists + fills the curveball's why/fb slots.
    startCurveballGeneration: async function() {
      var sc = get().activeScenario;
      if (!sc) return;
      if (sc.curveball) { set({ curveballState: "ready" }); return; }
      if (!sc._cbMode) { set({ curveballState: "ready" }); return; }
      // The curveball builds on the evolved Round 2 state — defer until Round 2
      // has merged (4 phases). startRound2Generation chains us once it lands.
      if (!(Array.isArray(sc.phases) && sc.phases.length >= 4)) return;
      if (get().curveballState === "generating") return;
      var prev = get().curveballAbortController;
      if (prev) { try { prev.abort(); } catch (e) {} }
      var controller = new AbortController();
      set({ curveballAbortController: controller, curveballState: "generating" });
      var updateCustom = useScenariosStore.getState().updateCustom;
      try {
        var cb = await generateCurveball(sc, controller.signal);
        var merged = mergeCurveball(sc, cb);
        set({ activeScenario: merged, curveballState: "ready" });
        try { updateCustom(merged); } catch (e) { /* built-ins / best-effort */ }
        // Fill the curveball why/fb slots in the background. Reuses the curveball
        // controller so a scenario change aborts both the gen and the fill. Only
        // the curveball's null slots are walked (Round 1/2 are already filled).
        // Phase 6.3 (Stage 3.5): verify the curveball fills (the highest-stakes,
        // peri-arrest content) before the learner hits the post-Round-2 beat.
        try {
          await runDispatcher(merged, controller, updateCustom, get().forceRefreshScenario, {
            onBeforeDeepDives: async function(filledSc) { try { await verifyUnit(filledSc || get().activeScenario, "curveball", controller.signal, updateCustom, get().forceRefreshScenario); } catch (e) {} }
          });
        } catch (e) { /* abort or best-effort */ }
      } catch (err) {
        if (err && err.name === "AbortError") { set({ curveballState: "idle" }); return; }
        console.warn("[playerStore.startCurveballGeneration] " + (err && err.message || err));
        set({ curveballState: "error" });
      }
    }
  });
});

// Debug hook: expose the store on window for DevTools inspection.
// Read with `window.__bw_playerStore.getState().activeScenario` or
// similar. Safe in production; the hook is read-only and adds no
// user-visible behavior. Remove when no longer needed.
if(typeof window!=="undefined")window.__bw_playerStore=usePlayerStore;
