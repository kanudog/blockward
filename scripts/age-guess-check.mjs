// Pure-function assertion for guessAge age-bucketing (bug-sweep 3a).
// Run: node scripts/age-guess-check.mjs
// Verifies the month/year cases still bucket correctly (regression guard)
// AND that day/week units now resolve to "infant" rather than falling
// through to the bare-number branch.

import { guessAge, guessSex } from "../src/lib/scenarios/age.js";

var cases = [
  // [ageLabel, expected ageGroup, note]
  // Regressions — every built-in label format must keep working.
  ["6 months", "infant", "built-in SC1"],
  ["2 years", "toddler", "built-in SC2"],
  ["8 years", "child", "built-in SC3"],
  ["6-Month-Old", "infant", "built-in SC4 (hyphenated/caps)"],
  ["8-month-old", "infant", "built-in SC5"],
  ["14 years", "teen", "built-in SC6"],
  // AI scenario phrasing.
  ["6 years old", "child", "dry-run baseline"],
  ["18 months", "toddler", "upper-infant boundary"],
  ["12 months", "infant", "infant boundary"],
  ["newborn", "infant", "keyword, no number"],
  ["neonate", "infant", "keyword, no number"],
  // The fix: day/week units -> infant.
  ["3 weeks old", "infant", "weeks (was toddler)"],
  ["10 day old", "infant", "days (was child)"],
  ["2-week-old", "infant", "hyphenated weeks"],
  ["6 week old", "infant", "weeks"],
  ["1 day old", "infant", "days"],
];

var sexCases = [
  ["F", "female"],
  ["Female", "female"],
  ["girl", "female"],
  ["M", "male"],
  ["male", "male"],
  ["boy", "male"],
  ["", "neutral"],
  ["unknown", "neutral"],
];

var failures = 0;

cases.forEach(function (c) {
  var got = guessAge({ patient: { ageLabel: c[0] } });
  var ok = got === c[1];
  if (!ok) failures++;
  console.log((ok ? "PASS" : "FAIL") + "  guessAge(\"" + c[0] + "\") = " + got + (ok ? "" : "  (expected " + c[1] + ")") + "   [" + c[2] + "]");
});

sexCases.forEach(function (c) {
  var got = guessSex({ patient: { sex: c[0] } });
  var ok = got === c[1];
  if (!ok) failures++;
  console.log((ok ? "PASS" : "FAIL") + "  guessSex(\"" + c[0] + "\") = " + got + (ok ? "" : "  (expected " + c[1] + ")"));
});

console.log("");
if (failures > 0) {
  console.log(failures + " assertion(s) FAILED");
  process.exit(1);
}
console.log("All " + (cases.length + sexCases.length) + " assertions passed.");
