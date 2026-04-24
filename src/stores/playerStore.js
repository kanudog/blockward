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
  score: { c: 0, t: 0 },
  vitals: null,
  shake: false,
  skippedActions: [],
  assessHistory: [],
  actionHistory: []
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
        score: { c: 0, t: 0 },
        vitals: sc && sc.phases && sc.phases[0] ? sc.phases[0].vitals : null,
        shake: false,
        skippedActions: [],
        assessHistory: [],
        actionHistory: []
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
    addScore: function(delta) {
      set(function(s) {
        return { score: { c: s.score.c + delta.c, t: s.score.t + delta.t } };
      });
    },
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
    }
  });
});
