// Pure scoring helpers. Extracted from the inline tallies in ScenarioPlayer.submit
// and ActionPanel.finish. Same scale throughout: 1 point per item or per action.

import { canonicalizeAssessItem } from "./canonicalize.js";

/**
 * Assessment score: for each assessItem, correct when the user's selection
 * (keyed by canonical display ID) matches the item's bad-flag.
 *
 * Phase-3.0-hotfix: flags is now keyed by canonical IDs (lab:Foo, vital:hr,
 * sign:Bar) rather than raw assessItem.id. Orphan assessItems (no display
 * tile to click) still score — they always count as user-not-flagged.
 *
 * @param {{id: string, bad: boolean, label?: string, cat?: string}[]} assessItems
 * @param {Object<string, boolean>} flags
 * @param {Object} phase  Surrounding phase (labs, signs, vitals) for canonical mapping
 * @returns {{c: number, t: number}}
 */
export function computeAssessScore(assessItems, flags, phase) {
  var c = 0;
  assessItems.forEach(function(it) {
    var cid = canonicalizeAssessItem(it, phase);
    var userSelected = !!(cid && flags[cid]);
    if (userSelected === !!it.bad) c++;
  });
  return { c: c, t: assessItems.length };
}

/**
 * Action score: for each available tool/med, correct when user selection matches the action's ok-flag.
 * Matches ActionPanel.finish exactly.
 * @param {string[]|null|undefined} tools
 * @param {string[]|null|undefined} meds
 * @param {{tools?: Object<string, {ok: boolean}>, meds?: Object<string, {ok: boolean}>}|null|undefined} actions
 * @param {Object<string, any>} sel
 * @returns {{c: number, t: number}}
 */
export function computeActionScore(tools, meds, actions, sel) {
  var c = 0;
  var t = 0;
  if (tools) tools.forEach(function(id) {
    t++;
    var info = actions && actions.tools ? actions.tools[id] : null;
    var shouldPick = info ? !!info.ok : false;
    if (!!sel[id] === shouldPick) c++;
  });
  if (meds) meds.forEach(function(id) {
    t++;
    var info = actions && actions.meds ? actions.meds[id] : null;
    var shouldPick = info ? !!info.ok : false;
    if (!!sel[id] === shouldPick) c++;
  });
  return { c: c, t: t };
}
