// Temp Stage-1 validation: load a converted built-in through the player's
// pipeline and report shape health + any empty Why slots in assess phases.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));
var ROOT = resolve(__dirname, "..");
var TARGET = process.argv[2] || "SC1";

var b = await import(resolve(ROOT, "src/lib/scenarios/builtIn.js"));
var mig = await import(resolve(ROOT, "src/lib/scenarios/migrateLegacyScenario.js"));
var val = await import(resolve(ROOT, "src/lib/ai/validate.js"));
var SC = b[TARGET];

var m = mig.migrateLegacyScenario(SC);
var errs = val.validateSchema(m);
console.log("=== " + TARGET + " (" + SC.id + ") ===");
console.log("source: " + m.source + "  schemaVersion: " + m.schemaVersion);
console.log("validateSchema errors: " + (errs.length ? errs.join("; ") : "(none)"));

// Idempotency: migrating again should be byte-identical.
var m2 = mig.migrateLegacyScenario(m);
console.log("migration idempotent: " + (JSON.stringify(m) === JSON.stringify(m2) ? "PASS" : "FAIL"));

// Vitals shape per phase.
(m.phases || []).forEach(function (p, i) {
  var ids = (p.vitals || []).map(function (v) { return v.id; });
  var hasSplit = ids.indexOf("sbp") >= 0 || ids.indexOf("dbp") >= 0;
  var hasBp = ids.indexOf("bp") >= 0;
  console.log("phase[" + i + "] " + p.stageType + " vitals: [" + ids.join(",") + "]  bp=" + hasBp + " split=" + hasSplit);
});

// Empty Why in ASSESS phases (built-ins skip dispatcher => these render blank).
var emptyAssessWhy = [];
(m.phases || []).forEach(function (p, i) {
  if (p.stageType !== "assess") return;
  function scan(arr, kind) {
    (arr || []).forEach(function (it) {
      if (it && it.why == null) emptyAssessWhy.push("phase[" + i + "]." + kind + "." + (it.id || it.name) + " (bad=" + !!it.bad + ", critical=" + !!it.critical + ")");
    });
  }
  scan(p.vitals, "vitals"); scan(p.signs, "signs"); scan(p.labs, "labs");
});
console.log("empty Why in ASSESS phases: " + (emptyAssessWhy.length ? "\n  - " + emptyAssessWhy.join("\n  - ") : "(none) OK"));

// Lab bad/ref coherence.
function refRange(r){ if(typeof r!=="string")return null; var m=r.match(/^\s*(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/); if(m)return{lo:+m[1],hi:+m[2]}; var g=r.match(/^\s*>=?\s*(-?\d+(?:\.\d+)?)/); if(g)return{lo:+g[1]}; var l=r.match(/^\s*<=?\s*(-?\d+(?:\.\d+)?)/); if(l)return{hi:+l[1]}; return null; }
function numv(v){ if(v==null)return null; var m=String(v).match(/-?\d+(?:\.\d+)?/); return m?+m[0]:null; }
var incoherent=[];
(m.phases||[]).forEach(function(p,i){ (p.labs||[]).forEach(function(l){ var r=refRange(l.ref),n=numv(l.value); if(r==null||n==null)return; var inside=true; if(r.lo!==undefined&&n<r.lo)inside=false; if(r.hi!==undefined&&n>r.hi)inside=false; if(!!l.bad!==!inside)incoherent.push("phase["+i+"].labs."+l.id+" value="+l.value+" ref="+l.ref+" bad="+!!l.bad); }); });
console.log("lab bad/ref coherence: " + (incoherent.length ? "FAIL\n  - " + incoherent.join("\n  - ") : "PASS"));

// Debrief shape.
var d = m.debrief || {};
console.log("debrief: keyTeaching=" + (Array.isArray(d.keyTeaching) ? d.keyTeaching.length : "MISSING") + ", physiologyDeepDive=" + (Array.isArray(d.physiologyDeepDive) ? d.physiologyDeepDive.length : "MISSING") + ", explainers=" + (Array.isArray(d.explainers) ? d.explainers.length : "none"));
(d.physiologyDeepDive || []).forEach(function (dd) { console.log("  dd " + dd.id + ": content=" + (dd.content ? dd.content.length + " chars" : "NULL") + (dd.content && dd.content.indexOf("**TL;DR:**") >= 0 ? " (has TL;DR)" : "")); });

// Phase 1 tied-correct (recovery screen must-haves).
var p1 = (m.phases || [])[1];
if (p1 && p1.actions) {
  var mh = [];
  ["tools", "meds"].forEach(function (k) { Object.keys(p1.actions[k] || {}).forEach(function (id) { if (p1.actions[k][id].priority === "tied-correct") mh.push(k + ":" + id); }); });
  console.log("phase[1] tied-correct (recovery must-haves): " + (mh.length ? mh.join(", ") : "(NONE — recovery screen would be empty)"));
}
