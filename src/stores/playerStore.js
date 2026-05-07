// Player store: transient in-game state. Not persisted — each scenario
// run starts fresh. View-local state for the debrief (expander indices,
// TLDR toggles, recovery-step counter) stays in the component.
//
// Created in isolation at Checkpoint 2; wired into ScenarioPlayer in
// Checkpoint 3.

import { create } from "zustand";

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
  // Phase-5.3: idempotency guard for lazy explanation fetch. Stores
  // canonical slot ids that have already been fetched (or are in flight)
  // to prevent re-firing on remount or back navigation. Cleared on
  // start() — fresh per-scenario.
  lazyFetchedSlots: {}
};

export var usePlayerStore = create(function(set, get) {
  return Object.assign({}, initialState, {
    start: function(sc) {
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
        // Phase-5.3: fresh per-scenario fetch guard.
        lazyFetchedSlots: {}
      });
    },
    reset: function() {
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
    // Phase-5.3: mark a slot id as fetched (or in-flight). Idempotent.
    markLazySlotFetched: function(slotId) {
      if (!slotId) return;
      if (get().lazyFetchedSlots[slotId]) return;
      var next = Object.assign({}, get().lazyFetchedSlots);
      next[slotId] = true;
      set({ lazyFetchedSlots: next });
    }
  });
});
