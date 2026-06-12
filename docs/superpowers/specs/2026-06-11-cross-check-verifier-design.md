# Sonnet Cross-Check Verifier — Design Spec

Date: 2026-06-11. Status: APPROVED by Sebastian (verbal), implementing.

## Problem

The per-item Haiku fill model writes `why`/`fb` micro-explanations in isolation,
and they can drift from the scenario's correct clinical picture. The Stage-3
curveball smoke surfaced an UNSAFE example (cb1): explanations diagnosing "right
mainstem intubation" (anatomically backwards) while the correct answer + teaches
say tension pneumothorax, plus a "tension pneumo causes bradycardia" recognition
error. This is the deferred "Level-1 verification" gap from the 05-27 / 05-29
handoffs — it exists for R1/R2 today and Stage 3's peri-arrest curveball
amplifies the stakes.

## Locked decisions

- **On detection: repair-if-confident-else-drop.** Sonnet rewrites a wrong/
  contradictory `why`/`fb` to match the scenario's clinical truth when it can do
  so confidently; otherwise it drops the slot (learner sees no explanation
  rather than a wrong one). Never shows known-wrong content.
- **Timing: background pass, gate the first wave.** Verify runs as a Sonnet pass
  right after each unit's fills. Phase 0 is verified before the "Assess" gate
  releases (the one gated pass, ~10-20s added there — it lands on the lowest-risk
  content). Phase 1, Round 2, and the curveball verify in the background with
  natural play-time lead before the learner clicks into them.
- **Architecture: holistic per-unit pass.** One Sonnet call reviews a whole unit
  (Phase 0, Phase 1, the two Round-2 phases, or the curveball) at once — needed
  to catch cross-item patterns like cb1's repeated "right mainstem".
- **Scope v1: `why`/`fb` only.** Debrief deep-dives deferred (lower risk,
  long-form; easy fast-follow). Built-ins skip (curated, non-AI source).

## Ground truth

The scenario never states etiology outright (by design). The verifier
establishes the intended clinical picture from: the unit's **narrative** + the
scenario's **teaches / debrief summary** + the **tied-correct actions** (the
correct treatment implies the diagnosis). For the curveball: its `name` +
`narrative` + `teaches` + tied-correct actions.

## Implementation

1. **`prompt.js` — `buildVerifierPrompt()`** (Sonnet). Role: a peds critical-care
   attending doing a final safety check on AI-written micro-explanations. Per
   item, return OK / REPAIR (with corrected text) / DROP. **Bias strongly toward
   OK** — flag only clear contradictions-with-the-scenario or clear clinical/
   factual errors; never flag style/length. Output the delimited
   `###ITEM:<slotRef>\nVERDICT: ok|repair|drop\n<corrected text if repair>\n###END`
   format (delimited, not JSON — corrected `why`/`fb` is multi-paragraph markdown
   and JSON escaping is fragile here, same reason the deep-dive path is delimited).

2. **`client.js` — `verifyExplanations(scenario, unitKey, items, signal)`**
   (Sonnet, non-streaming, `mode:"verify"`). Builds the ground-truth block for
   the unit + lists the filled items (`{slotRef, label, kind, text}`). Parses the
   delimited response → `{slotRef: {verdict, correctedText}}`.

3. **`verifier.js` (new) — `verifyUnit(scenario, unitKey, signal, persist, refresh)`**.
   `collectUnitFilledItems(scenario, unitKey)` walks the unit's vitals/signs/labs
   (`why`) + actions (`fb`), taking the **filled** ones. If none, no-op. Else
   `verifyExplanations` → apply: `repair` → `writeExplanationToSlot(ref, newText)`;
   `drop` → `writeExplanationToSlot(ref, "")` (empty = non-null so it won't
   re-collect / re-fill, and displays as the existing "no explanation" state);
   `ok` → leave. Persist + refresh. unitKey ∈ `phase0 | phase1 | round2 | curveball`.

4. **`dispatcher.js`** — two minimal, backward-compatible changes:
   - `await h.onWaveOneComplete()` (was a sync call) so Phase-0 verify can gate
     the assess button before the flag flips.
   - Add `await h.onBeforeDeepDives(scenario)` after wave 4, before wave 5, so
     intervene-phase content is verified before the slow deep-dive wave and
     before the learner reaches it.

5. **`playerStore.js`** — thread verify hooks into the three `runDispatcher`
   calls, each scoped to its unit:
   - R1 (`startDispatcher`): `onWaveOneComplete` → verify `phase0`, then flip the
     gate; `onBeforeDeepDives` → verify `phase1`.
   - R2 (`startRound2Generation`): `onBeforeDeepDives` → verify `round2`.
   - Curveball (`startCurveballGeneration`): `onBeforeDeepDives` → verify
     `curveball` (its wave 5 is empty; teaches are inline).
   Idempotency is handled by the existing `dispatcherShouldRun` gate (no null
   slots → no dispatcher run → no verify on replay); the drop-to-`""` keeps
   dropped slots out of `collectAllNullSlots` so there is no re-fill loop.

## Verification

- `vite build` compiles.
- **Targeted smoke**: re-run the asthma case that produced cb1; confirm the
  verifier catches + repairs the "right mainstem" contradiction and the
  "tension pneumo causes bradycardia" error (capture before/after text).
- **Over-aggression check**: run on cb2 (rated SOUND) and confirm it leaves that
  content essentially intact (few/no repairs, no incorrect drops).
- Independent pediatric-critical-care reviewer re-reviews the post-verifier
  output for cb1/cb3.
