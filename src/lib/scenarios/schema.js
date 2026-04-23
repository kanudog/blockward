// Scenario shape typedefs. Documentation only — no runtime validation yet.
// See lib/scenarios/builtIn.js for SC1/SC2/SC3 as shape-of-record examples.

/**
 * @typedef {Object} Vitals
 * @property {number} hr
 * @property {number} rr
 * @property {number} sbp
 * @property {number} dbp
 * @property {number} spo2
 * @property {number} temp
 * @property {number} cap
 */

/**
 * @typedef {Object} Sign
 * @property {string} label
 * @property {string} detail
 * @property {"head"|"face"|"body"} pos
 * @property {string} [sys]
 */

/**
 * @typedef {Object} AssessItem
 * @property {string} id
 * @property {string} label
 * @property {"vital"|"lab"|"clinical"} cat
 * @property {boolean} bad
 * @property {string} why
 */

/**
 * @typedef {Object} Lab
 * @property {string} name
 * @property {string} value
 * @property {string} unit
 * @property {string} ref
 * @property {boolean} critical
 * @property {string} [explain]
 */

/**
 * @typedef {Object} ActionFeedback
 * @property {boolean} ok
 * @property {number|null} pri
 * @property {string} fb
 */

/**
 * @typedef {Object} Teach
 * @property {string} title
 * @property {string} content
 * @property {string} tldr
 */

/**
 * @typedef {Object} Explainer
 * @property {string} title
 * @property {string} content
 * @property {string} tldr
 */

/**
 * @typedef {Object} Phase
 * @property {string} id
 * @property {string} name
 * @property {string} narrative
 * @property {Vitals} vitals
 * @property {Sign[]} signs
 * @property {AssessItem[]|null} assessItems
 * @property {Lab[]} labs
 * @property {string[]|null} tools
 * @property {string[]|null} meds
 * @property {{tools: Object<string, ActionFeedback>, meds: Object<string, ActionFeedback>}|null} actions
 */

/**
 * @typedef {Object} Curveball
 * @property {string} name
 * @property {string} narrative
 * @property {Vitals} vitals
 * @property {Sign[]} signs
 * @property {Lab[]} labs
 * @property {string[]} tools
 * @property {string[]} meds
 * @property {{tools: Object<string, ActionFeedback>, meds: Object<string, ActionFeedback>}} actions
 * @property {Teach[]} teaches
 */

/**
 * @typedef {Object} PatientInfo
 * @property {string} ageLabel
 * @property {number} weightKg
 * @property {string} sex
 * @property {string} cc
 * @property {string} history
 */

/**
 * @typedef {Object} Norms
 * @property {[number, number]} hr
 * @property {[number, number]} rr
 * @property {[number, number]} sbp
 * @property {[number, number]} dbp
 * @property {[number, number]} spo2
 * @property {[number, number]} temp
 */

/**
 * @typedef {Object} Debrief
 * @property {string} summary
 * @property {Explainer[]} explainers
 */

/**
 * @typedef {Object} Scenario
 * @property {string} id
 * @property {string} title
 * @property {1|2|3} tier
 * @property {string} icon
 * @property {string} tagline
 * @property {string} description
 * @property {string[]} [visuals]
 * @property {PatientInfo} patient
 * @property {Norms} norms
 * @property {Phase[]} phases
 * @property {Curveball|null} curveball
 * @property {Debrief} debrief
 */

export {};
