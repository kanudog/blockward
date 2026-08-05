// Explanation verbosity — how much teaching text the learner sees.
//
// Owner direction 2026-07-30: the generated teaching copy was too long and too
// jargon-heavy to read mid-case, which risks putting people off entirely. The
// depth is worth keeping for anyone who wants it, so it becomes a preference
// rather than the only option.
//
// Scope: this governs the auto-generated EDUCATIONAL text only — the "why"
// behind a vital/sign/lab, the feedback on a tool/med, debrief explainers,
// curveball teaching, deep dives, and Learn More. It deliberately does NOT
// touch the narrator, the phase narratives, the interlude updates, the EMS
// report, or the finding text: those are the story and the clinical state, and
// they read the same at every level.
//
// A global preference (not per case) so it can be changed at any time,
// including mid-case, and so one generated case serves every level.
import { create } from "zustand";

var STORAGE_KEY = "bw-verbosity";
export var LEVELS = ["low", "medium", "high"];
export var LEVEL_LABEL = { low: "Brief", medium: "Balanced", high: "In depth" };
export var LEVEL_BLURB = {
  low: "Plain language, a couple of sentences. What it means and what to do.",
  medium: "The clinical reasoning plus what to watch for. No deep mechanism.",
  high: "Everything — receptor-level mechanism and the full physiology."
};

function initialLevel() {
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (LEVELS.indexOf(saved) >= 0) return saved;
  } catch (e) { /* privacy mode — fall through */ }
  return "medium"; // owner decision: the middle is the default, not the deepest
}

export var useVerbosityStore = create(function (set) {
  return {
    level: initialLevel(),
    setLevel: function (level) {
      if (LEVELS.indexOf(level) < 0) return;
      try { window.localStorage.setItem(STORAGE_KEY, level); } catch (e) { /* non-blocking */ }
      set({ level: level });
    }
  };
});

export function useVerbosity() { return useVerbosityStore(function (s) { return s.level; }); }

// --- shaping -----------------------------------------------------------------
//
// Generated explanations arrive in one of two shapes:
//
//   NEW (structured, emitted by the current prompt):
//     { plain, detail, mechanism: [...], watchFor }
//
//   LEGACY (a prose blob — every case built before this change, including the
//   built-ins and anything already shared by link):
//     "lead paragraph\n\n- **Term** mechanism...\n- **Term** ...\n\nWatch for..."
//
// For legacy blobs we recover the same three registers structurally: the lead
// paragraph, the bulleted mechanism, and the closing practical line. That is
// not as good as prose actually written plainly — the lead still carries the
// original vocabulary — but it shortens the whole existing library at no cost
// and with no regeneration.

function splitBlocks(text) {
  return String(text || "").split(/\n\s*\n/).map(function (b) { return b.trim(); }).filter(Boolean);
}
function isBulletBlock(b) {
  return /^\s*[-*•]\s+/.test(b) || /^\s*\d+[.)]\s+/.test(b);
}
// First n sentences.
//
// Clinical prose is full of decimals ("lactate of 4.2", "pH 7.28", "0.05
// mcg/kg/min") and a naive [.!?] split cuts straight through them — the first
// draft of this turned "her lactate of 4.2, weak distal pulses" into a sentence
// starting "2, weak distal pulses". Decimals and the common abbreviations are
// shielded before splitting and restored after.
var SHIELD = "";
function firstSentences(text, n) {
  var s = String(text || "").trim();
  if (!s) return "";
  var shielded = s
    .replace(/(\d)\.(\d)/g, "$1" + SHIELD + "$2")
    .replace(/\b(?:e\.g|i\.e|vs|approx|etc|Dr|Mr|Mrs|Ms|No)\./gi, function (m) {
      return m.split(".").join(SHIELD);
    });
  var parts = shielded.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  if (!parts) return s;
  var out = parts.slice(0, n).join("").split(SHIELD).join(".").trim();
  // An odd number of ** would leave markdown open — fall back to the whole text.
  if ((out.match(/\*\*/g) || []).length % 2 !== 0) return s;
  return out;
}

// parseExplanation(raw) -> { plain, detail, mechanism[], watchFor }
export function parseExplanation(raw) {
  if (!raw) return { plain: "", detail: "", mechanism: [], watchFor: "" };
  // Already structured.
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return {
      plain: raw.plain || raw.tldr || "",
      detail: raw.detail || raw.content || "",
      mechanism: Array.isArray(raw.mechanism) ? raw.mechanism : (raw.mechanism ? [raw.mechanism] : []),
      watchFor: raw.watchFor || ""
    };
  }
  var blocks = splitBlocks(raw);
  var mech = blocks.filter(isBulletBlock);
  var prose = blocks.filter(function (b) { return !isBulletBlock(b); });

  if (mech.length > 0) {
    // LEGACY shape: lead paragraph(s), then bulleted mechanism, then a closing
    // line. Prose before the bullets is the lead; prose after is the watch-for.
    var lead = [], tail = [], seen = false;
    blocks.forEach(function (b) {
      if (isBulletBlock(b)) { seen = true; return; }
      (seen ? tail : lead).push(b);
    });
    var leadText = lead.join("\n\n");
    return {
      // No purpose-written plain form exists in legacy content; the opening
      // claim is the closest stand-in.
      plain: firstSentences(leadText, 2),
      detail: leadText,
      mechanism: mech,
      watchFor: tail.join("\n\n")
    };
  }

  // CURRENT shape: three prose blocks — plain, detail, watch-for — with the
  // mechanism deliberately absent (it is fetched on demand). Splitting only on
  // bullets used to lump all three into one tier here, which made Balanced and
  // In depth render identically. Separate them positionally instead.
  if (prose.length === 0) return { plain: "", detail: "", mechanism: [], watchFor: "" };
  if (prose.length === 1) {
    return { plain: firstSentences(prose[0], 2), detail: prose[0], mechanism: [], watchFor: "" };
  }
  // NOTE the contract: `detail` is the whole Balanced-level body and INCLUDES
  // the plain opening, because explainAt renders detail + watchFor for Balanced.
  // Returning only the middle block here silently dropped the opening sentence
  // from Balanced — caught by the level-composition check.
  if (prose.length === 2) {
    // Ambiguous: is the second block the reasoning, or the closing advice?
    var closing = /^(watch|recheck|reassess|re-check|check|monitor|look for|expect|if\b|repeat|escalate|call\b)/i.test(prose[1]);
    return {
      plain: prose[0],
      detail: closing ? prose[0] : prose.join("\n\n"),
      mechanism: [],
      watchFor: closing ? prose[1] : ""
    };
  }
  return {
    plain: prose[0],
    detail: prose.slice(0, prose.length - 1).join("\n\n"),
    mechanism: [],
    watchFor: prose[prose.length - 1]
  };
}

// explainAt(raw, level) -> the markdown string to render.
//   low    — plain only
//   medium — full lead + the practical closing line, mechanism hidden
//   high   — everything
// Brief has to be genuinely brief, and the generator cannot be trusted to count.
// Measured over 30 freshly generated explanations after three rounds of prompt
// tightening: the plain part averaged 50 words against a stated 45-word limit,
// with a worst case of 110 — half of them over. A language model is not a word
// counter, so the budget is enforced here instead, by whole sentences so the
// text never stops mid-thought. The prompt still asks for short; this guarantees
// it.
var LOW_WORD_BUDGET = 45;
function capWords(text, budget) {
  var s = String(text || "").trim();
  if (!s) return s;
  if ((s.match(/\S+/g) || []).length <= budget) return s;
  // Add sentences until the next one would blow the budget; always keep one.
  var out = "";
  for (var n = 1; n <= 6; n++) {
    var cand = firstSentences(s, n);
    if (n > 1 && (cand.match(/\S+/g) || []).length > budget) break;
    out = cand;
    if (cand === s) break;
  }
  return out || firstSentences(s, 1);
}

export function explainAt(raw, level) {
  var p = parseExplanation(raw);
  var low = capWords(p.plain || p.detail, LOW_WORD_BUDGET);
  if (level === "low") return low;
  if (level === "high") {
    return [p.detail, p.mechanism.join("\n\n"), p.watchFor].filter(Boolean).join("\n\n");
  }
  // Guard: a generator that writes a `plain` longer than its `detail` would
  // otherwise make Balanced read shorter than Brief. Keep the levels monotonic.
  var body = (p.detail && p.detail.length >= low.length) ? p.detail : low;
  return [body, p.watchFor].filter(Boolean).join("\n\n");
}

// True when raising the level would actually reveal more text — drives the
// per-card "Explain more" affordance so it never appears as a dead control.
export function hasMoreAt(raw, level) {
  var p = parseExplanation(raw);
  if (level === "high") return false;
  if (level === "low") return !!(p.detail || p.mechanism.length || p.watchFor);
  return p.mechanism.length > 0;
}
