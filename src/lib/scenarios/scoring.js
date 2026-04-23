// Pure scoring helpers. Extracted from the inline tallies in ScenarioPlayer.submit
// and ActionPanel.finish. Same scale throughout: 1 point per item or per action.

/**
 * Assessment score: for each assessItem, correct when the user's flag matches the item's bad-flag.
 * @param {{id: string, bad: boolean}[]} assessItems
 * @param {Object<string, boolean>} flags
 * @returns {{c: number, t: number}}
 */
export function computeAssessScore(assessItems, flags) {
  var c = 0;
  assessItems.forEach(function(it) {
    if (!!flags[it.id] === it.bad) c++;
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
