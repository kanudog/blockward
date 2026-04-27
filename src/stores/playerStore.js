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
  markedForReview: []
};

export var usePlayerStore = create(function(set) {
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
        markedForReview: []
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
    toggleMarkForReview: function(item) {
      set(function(s) {
        var existing = s.markedForReview.findIndex(function(x) { return x.id === item.id; });
        if (existing >= 0) {
          var copy = s.markedForReview.slice();
          copy.splice(existing, 1);
          return { markedForReview: copy };
        }
        return { markedForReview: s.markedForReview.concat([item]) };
      });
    }
  });
});
