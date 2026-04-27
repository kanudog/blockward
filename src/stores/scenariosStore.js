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
      set({
        custom: loadS("bw-custom", []),
        progress: loadS("bw-prog", {}),
        hydrated: true
      });
    },
    addCustom: function(sc) {
      // Phase-2.6 group J3: prepend so the freshly-built scenario shows
      // at the top of the dashboard list instead of getting buried.
      var u = [sc].concat(get().custom);
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
