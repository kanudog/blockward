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
  deepDiveCacheWarmed: false
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
      set({
        activeScenario: sc,
        stage: "intro",
        phaseIndex: 0,
        flags: {},
        showFb: false,
        cbDone: false,
        vitals: sc && sc.phases && sc.phases[0] ? sc.phases[0].vitals : null,
        shake: false,
        skippedActions: [],
        assessHistory: [],
        actionHistory: [],
        markedForReview: [],
        // Phase-5.2.5: fresh per-scenario cache.
        deepDiveCache: {},
        // Phase 6.0: fresh per-scenario dispatcher state.
        dispatcherFiredSlots: {},
        dispatcherState: "idle",
        waveOneComplete: false,
        dispatcherAbortController: null,
        perItemCacheWarmed: false,
        deepDiveCacheWarmed: false
      });
    },
    reset: function() {
      var prev = get().dispatcherAbortController;
      if (prev) {
        try { prev.abort(); } catch (e) {}
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
    setVitals: function(v) { set({ vitals: v }); },
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
        onWaveOneComplete: function() {
          set({ waveOneComplete: true, dispatcherState: "background" });
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
    }
  });
});

// Debug hook: expose the store on window for DevTools inspection.
// Read with `window.__bw_playerStore.getState().activeScenario` or
// similar. Safe in production; the hook is read-only and adds no
// user-visible behavior. Remove when no longer needed.
if(typeof window!=="undefined")window.__bw_playerStore=usePlayerStore;
