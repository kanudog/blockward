// Scenarios store: custom scenarios + progress. Persisted to localStorage
// via existing bw-custom and bw-prog keys. No middleware — each mutating
// action writes through to localStorage directly, mirroring the prior
// saveS-after-setState pattern in App.jsx.

import { create } from "zustand";
import { loadS, saveS } from "../lib/storage.js";

export var useScenariosStore = create(function(set, get) {
  return {
    custom: [],
    progress: {},
    hydrated: false,
    hydrate: function() {
      // Phase-5.1: backfill source:"ai" on any pre-existing custom scenario
      // saved before the source marker was introduced. One-time migration —
      // write back to localStorage only when a backfill actually happened.
      var customRaw = loadS("bw-custom", []);
      var migrated = false;
      var custom = customRaw.map(function(sc) {
        if (sc && !sc.source) { migrated = true; return Object.assign({}, sc, { source: "ai" }); }
        return sc;
      });
      if (migrated) saveS("bw-custom", custom);
      set({
        custom: custom,
        progress: loadS("bw-prog", {}),
        hydrated: true
      });
    },
    addCustom: function(sc) {
      // Phase-2.6 group J3: prepend so the freshly-built scenario shows
      // at the top of the dashboard list instead of getting buried.
      // Phase-5.1: tripwire — every scenario reaching the store should
      // already carry a source marker. Warn (don't block) so we catch any
      // path that bypasses applyPostParseFixups or decodeScenario.
      if (!sc.source) console.warn("Scenario missing source field:", sc.id);
      var u = [sc].concat(get().custom);
      set({ custom: u });
      saveS("bw-custom", u);
    },
    // Phase-5.3: in-place update for lazy-fetch write-throughs. Replaces
    // the entry whose id matches; no-op if not found (e.g., built-ins).
    // Distinct from addCustom (which prepends — would duplicate) and
    // addCustomIfNew (skips when present — wouldn't re-persist).
    updateCustom: function(sc) {
      if (!sc || !sc.id) return;
      var u = get().custom.map(function(x) { return x && x.id === sc.id ? sc : x; });
      set({ custom: u });
      saveS("bw-custom", u);
    },
    addCustomIfNew: function(sc) {
      var existing = get().custom;
      var already = existing.some(function(c) { return c.id === sc.id; });
      if (already) return false;
      var u = [sc].concat(existing);
      set({ custom: u });
      saveS("bw-custom", u);
      return true;
    },
    deleteCustom: function(id) {
      var u = get().custom.filter(function(s) { return s.id !== id; });
      var p = Object.assign({}, get().progress);
      delete p[id];
      set({ custom: u, progress: p });
      saveS("bw-custom", u);
      saveS("bw-prog", p);
    },
    recordCompletion: function(id) {
      // Phase-4a: scoring removed. Track only completion + attempt count.
      // Existing entries may carry a stale `best` field — left in place,
      // no migration needed.
      var prev = get().progress[id];
      var p = Object.assign({}, get().progress);
      p[id] = {
        done: true,
        n: (prev ? prev.n || 0 : 0) + 1
      };
      set({ progress: p });
      saveS("bw-prog", p);
    },
    clearAll: function() {
      set({ custom: [], progress: {} });
      saveS("bw-custom", []);
      saveS("bw-prog", {});
    }
  };
});
