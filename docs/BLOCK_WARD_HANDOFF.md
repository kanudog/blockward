# Block Ward — Project Handoff Document

**Last updated:** 2026-05-08
**Purpose:** Bring a new AI session fully up to speed on the Block Ward project — current state, architectural decisions, schema, infrastructure, history, and pending work. Read this end-to-end before suggesting any changes.

---

## 1. Project overview

**What it is:** Block Ward is a pediatric emergency medicine clinical simulator for RNs and medical students. Users play pre-built or AI-generated scenarios. Each scenario has phases of assessment (flagging abnormal vitals, findings, labs) and intervention (selecting correct tools and medications).

**Who runs it:** Sebastian — medical professional, not a developer by trade. He is the sole developer and clinical expert. He works in Cursor IDE with Claude Code running autonomously (`claude --dangerously-skip-permissions`). He pastes prompts from conversational Claude (architectural advisor + clinical accuracy reviewer) directly into Claude Code without modification.

**How to interact with him:**
- Explain the *why* behind recommendations, not just the *what*
- Push back when he's wrong
- Use plain language; he's clinically expert but not technically fluent
- He prefers tagged git anchors before big changes (e.g. `pre-phase-4b`)
- Claude Code never pushes to remote — Sebastian pushes manually after testing each phase
- Two-commit pattern: separate concerns into distinct commits
- Diagnose-before-fix discipline: draft diagnostic-only prompts before fixes

## 2. Tech stack and environment

- **Frontend:** Vite + React (JavaScript, not TypeScript)
- **Backend:** Vercel serverless functions (api/generate.js, maxDuration: 300)
- **AI:** Anthropic API via raw fetch() — no SDK
  - **Sonnet 4.6** (`claude-sonnet-4-6`) for scenario orchestration and current eager deep dives
  - **Haiku 4.5** (`claude-haiku-4-5-20251001`) for lazy explanation fills
  - Prompt caching active via `cache_control: ephemeral` on system blocks
  - Cache minimum ~4,096 tokens — prompts must exceed this to engage
- **Repo:** kanudog/blockward on GitHub, auto-deploys to Vercel on push to main
- **Local path:** /Users/openclaw/Documents/blockward (Mac Mini, username openclaw)
- **Hosting:** Vercel Pro (300-second function timeout — the hard architectural constraint)
- **Built-in scenarios:** SC1 (fussy infant, tier 1), SC2 (vomiting toddler, tier 2), SC3 (asthma crisis, tier 2), SC4 (infant septic shock with hypoglycemia, tier 2), SC5 (Mira — RSV bronchiolitis HFNC failure, tier 2), SC6 (Wren Okafor — opioid overdose, tier 2)

**Code style (strictly preserved):**
- No arrow functions in JSX attributes
- No template literals
- Inline styles over Tailwind
- `Object.assign` for style merging

## 3. Current state (as of 2026-05-08)

### Phase 5.4.2 just completed — smoke test green

The orchestrator prompt design is fully drafted and committed locally. End-to-end smoke test produced a clinically excellent scenario with zero schema violations.

**Smoke test results (test case: 6yo, 22kg, septic shock):**
- Generation time: **75 seconds** (down from 280s legacy baseline — 27% of prior)
- Output tokens: **6,043** (down from ~16,000 legacy baseline — 38% of prior)
- Schema conformance: 61 of 61 slot refs correct, 100% null compliance on why/fb/content
- Clinical accuracy: weight-based doses arithmetically correct, Henderson-Hasselbalch internally consistent, pack selection matches pathology
- Voice landed (bedside-clinician tone, not textbook)
- vsMonitor correctly adopted as default monitoring tool
- Distractor categorization populated correctly (tied-correct, correct, distractor-clinical, distractor-pack, distractor-misc)

### What's committed locally and ready to push

| Commit | Description |
|--------|-------------|
| (schema doc) | docs/phase-5-lazy-generation/04-skeleton-schema-v1.md |
| (design doc) | docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md |
| 53c406e | Add vsMonitor, woundPacking, extremityElevation to tool registry |
| (prompt impl) | Add buildOrchestratorPrompt() to prompt.js (dormant export, +275 lines) |
| (todo update) | Update DESIGN_TODO with Phase 5.4.2 completion |

Push command: `git push origin main` (Sebastian does this manually after verification)

### What's working in production today (not yet on new architecture)

Production traffic still uses the **legacy** generation path via `buildSystemPrompt()`:
- Single monolithic ~290s Sonnet call producing ~16K output tokens
- All explanations baked into one JSON object
- Phase 5.3 lazy fetch wiring exists but is dormant (Sonnet still fills everything)
- Mark for Review eager deep dives fire via Sonnet (~8-15s each)

`buildOrchestratorPrompt()` exists but is not wired into any code path. It can be called manually via the smoke test script for verification.

---

## 4. The Phase 5 architecture (lazy generation)

### Core problem being solved

The legacy single-call generation was at 292.9s of Vercel's 300s ceiling and producing 16,000+ output tokens. This blocked adding multi-round scenarios, curveball layers, or any additional content depth. Goal: cut generation time dramatically so the user-facing loading state drops from ~280s to ~30-60s.

### Orchestrator-worker pattern

**Sonnet (orchestrator):** Plans the scenario skeleton — IDs, labels, flags, narratives, action priority, distractor selection, and inline content that requires global scenario context (EMS report, learnMore, per-phase narratives, debrief summary, key teaching).

**Haiku (worker):** Fills in per-item explanation paragraphs (`why` fields on signs/vitals/labs, `fb` fields on tools/meds, `content` fields on debrief physiology deep dives). Parallel fan-out.

### Wave-based fan-out priority

Generation happens in priority waves so content the user reaches first is ready first:

```
Wave 1: phase[0].vitals.*.why, phase[0].signs.*.why, phase[0].labs.*.why
Wave 2: phase[0].actions.tools.*.fb, phase[0].actions.meds.*.fb
Wave 3: phase[1].vitals.*.why, phase[1].signs.*.why, phase[1].labs.*.why
Wave 4: phase[1].actions.tools.*.fb, phase[1].actions.meds.*.fb
Wave 5: debrief.physiologyDeepDive.*.content
```

Wave 1 starts immediately on skeleton return while the user is still reading the EMS-report screen. If the user outruns the queue, the slot renders with a loading shimmer until its specific Haiku call resolves.

### Persistence model

- **Scenario content** (vitals, labs, why text, fb text, narrative, distractors) — persisted permanently in `bw-custom` localStorage. Replays don't regenerate any of it.
- **Deep dives for Mark-for-Review items** — generated fresh on every play (session-only, in `playerStore.deepDiveCache`). Different items can be marked each time the scenario replays.

### Staggered cache warmup (mandatory for Phase 5.4.3)

Anthropic's prompt cache requires the first call to land before subsequent calls can hit the cache. If we fire 15 parallel Haiku calls simultaneously, all 15 are cache misses.

Required pattern: fire call #1 alone, wait for response (~2-4s), then fan out calls #2 through #N in parallel. This pattern cuts cost of subsequent calls by ~90% — validated empirically in `scripts/cache-test.mjs` (~62% cost reduction vs. cold parallel).

### Curveball deferred to post-v1

Schema 5.4.1 reserves `stageType: "curveball"` and `curveballPlanning: "static" | "dynamic"` namespace for future use. All curveball machinery has been deleted from the current generation path. Design rule when implemented: curveballs must be relevant to the disease process, a side effect of an administered medication/intervention, or a meaningful change in body system status — not random unrelated complications.

---

## 5. Schema 5.4.1 (locked)

Full spec lives at `docs/phase-5-lazy-generation/04-skeleton-schema-v1.md`. Summary:

### Top-level structure

```json
{
  "schemaVersion": "5.4.1",
  "id": "<kebab-case>",
  "source": "ai",
  "title": "<short evocative title>",
  "subtitle": "<one-line tagline>",
  "patientCard": { "name", "age", "weight", "sex" },
  "presentation": {
    "routeOfPresentation": "ems" | "walkIn" | "pcpReferral" | "transfer" | "ed_triage",
    "report": "<3-6 sentence intro narrative>",
    "learnMore": "<optional 2-4 sentence background>"
  },
  "phases": [ <phase objects> ],
  "debrief": { <debrief object> }
}
```

### Phase shape (v1 ships with exactly 2 phases)

```json
{
  "phaseIndex": 0,
  "stageType": "assess" | "intervene",
  "title": "<short phase title>",
  "narrative": "<4-6 sentence phase-entry narrative>",
  "vitals": [ <slot-shaped items> ],
  "signs": [ <slot-shaped items> ],
  "labs": [ <slot-shaped items> ],
  "actions": {
    "tools": { "<id>": <slot-shaped action>, ... },
    "meds": { "<id>": <slot-shaped action>, ... }
  }
}
```

### Slot-shaped item (vital, sign, lab)

```json
{
  "id": "<short-id>",
  "label": "<chip display text>",
  "value": "<displayed value>",
  "unit": "<optional unit>",
  "bad": true | false,
  "_slotRef": "phase[N].<vitals|signs|labs>.<id>.why",
  "why": null
}
```

### Slot-shaped action (tool, med)

```json
{
  "id": "<registry-id>",
  "label": "<display label>",
  "priority": "tied-correct" | "correct" | "distractor-clinical" | "distractor-pack" | "distractor-misc",
  "_slotRef": "phase[N].actions.<tools|meds>.<id>.fb",
  "fb": null
}
```

### Debrief shape

```json
{
  "summary": "<3-5 sentence wrap-up>",
  "keyTeaching": [ "<3-5 teaching points>" ],
  "physiologyDeepDive": [
    {
      "id": "<kebab-case>",
      "title": "<short title>",
      "_slotRef": "debrief.physiologyDeepDive.<id>.content",
      "content": null
    }
  ],
  "performance": null
}
```

### Key schema decisions worth knowing

- **`cat` field deliberately omitted.** The legacy schema had `cat: "vital" | "lab" | "clinical"` on every assess item because items lived in a flat `assessItems[]` array. Under 5.4.1, items live in typed collections (`vitals[]`, `signs[]`, `labs[]`) so `cat` is derivable from collection membership. Sonnet correctly omits the field — this is not a bug.
- **`_slotRef` is explicit in every slot.** Costs ~30-40 tokens per slot but provides self-documentation and lets Haiku know exactly where its output will land.
- **`why: null` instead of omitting the field.** Self-documenting, simpler null-check than `hasOwnProperty`.
- **Phases array, not fixed fields.** Supports n-phase architecture for future multi-round/curveball without refactoring.

### Open architectural decision (for next session)

The existing player/library code reads from a **flat `phase.assessItems[]` array with a `cat` discriminator**. Schema 5.4.1 outputs typed collections. These shapes are incompatible.

**14 read sites across 5 files** need to be addressed before 5.4.1 scenarios can render in the player:
- `src/components/player/ScenarioPlayer.jsx:103` (snapshot builder)
- `src/components/player/Debrief.jsx:106` (caught/missed list — dead read)
- `src/lib/scenarios/slotResolve.js` (6 occurrences)
- `src/lib/scenarios/canonicalize.js` (3 occurrences)
- `src/lib/scenarios/explanationSlots.js` (4 occurrences)
- `src/lib/ai/validate.js` (1 occurrence)

Plus **42 `cat` literals in `builtIn.js`** (SC1-SC6 are flat-array shape).

**Two paths:**
- **Path A (cleaner):** Migrate all read sites to iterate `phase.vitals[]` / `phase.signs[]` / `phase.labs[]` directly. Remove demultiplexer logic. Optionally rewrite built-ins to typed-collection shape. Bigger refactor — expands Phase 5.4.4 scope.
- **Path B (faster):** Add a `migrateLegacyAssessItems()` adapter that flattens 5.4.1 → legacy at load time. Permanent legacy-shape tech debt.

Conversational Claude leans Path A but decision was deferred to next session.

---

## 6. Tool and med registry (Phase 4b architecture, current)

### Pack structure

14 thematic packs in `src/lib/scenarios/packs/` — universal + 13 specialty. 73 tools and 56 meds total. Visual metadata extracted to `src/lib/scenarios/visualMeta.js` so registry holds only `{id, label, pack}`.

**Tool packs:** universal, respiratoryAirway, cardiac, neurological, trauma, vascularResus, giGu, samplingLabs, imagingDiagnostics, teamCommunication

**Med packs:** universal, respiratoryAirway, cardiac, neurological, trauma, sedationRsiPain, endocrineMetabolic, infectiousDisease, toxicologyAntidotes

### Recent registry additions (Phase 5.4.2 prerequisite, commit 53c406e)

- **`vsMonitor`** (universal pack) — "Connect to Vital Signs Monitor". Single bundled action for continuous ECG + SpO2 + BP. Replaces the previous pattern of separately surfacing pulseOx, bpCuff, cardiacMonitor when granularity doesn't matter clinically. The granular IDs remain in the registry for scenarios that specifically require distinguishing modalities.
- **`woundPacking`** (trauma pack) — "Pack Wound". Direct hemorrhage control for deep or junctional wounds where pressure alone is insufficient.
- **`extremityElevation`** (trauma pack) — "Elevate Extremity". Bleeding/swelling control.

None of the three have `visualMeta.js` entries — they fall through to the default Activity icon, consistent with how tourniquet/pelvicBinder/pressureDressing already render.

### customTool / customMed escape hatch

When a clinically required intervention isn't in the registry, Sonnet emits `id: "customTool"` (literal string, not invented) with `label` and `customDescription` inline. Used sparingly.

---

## 7. The new orchestrator prompt (Phase 5.4.2)

Lives in `src/lib/ai/prompt.js` as exported function `buildOrchestratorPrompt()`. Takes no arguments. Returns a single string of approximately 27,534 characters / ~6,800 tokens.

### Size context

Down from the legacy `buildSystemPrompt()` which is 53,607 characters / ~13,000 tokens. Initial estimate during design was 12,700 chars; actual ended up ~2.2× that because individual sections grew during authoring. **The cost of larger input is negligible** (pennies per call, milliseconds of processing) and the cache makes it cheaper still after warmup. Output token reduction is the real win.

### 26 sections, in order

1. Role
2. Voice (new — bedside-clinician tone, real-world phrasing, formatting variety encouraged)
3. Your role in the orchestrator-worker pattern (new — explains skeleton vs fill-in)
4. Schema specification (JSON shape with inline examples)
5. Mandatory clinical accuracy rules (5 rules — kept verbatim from legacy)
6. Loyalty to user input (promoted from buried verification check)
7. Age-appropriate physiology (promoted)
8. Internal consistency (Henderson-Hasselbalch, lactate-perfusion match, pre-arrival residuals)
9. Patient name diversity
10. Etiology vs presentation
11. Brief completeness (Sonnet must bake assumed findings into narratives so Haiku has context)
12. Pack selection (31 pathology→pack examples)
13. Tool registry
14. Med registry
15. customTool / customMed escape hatch
16. MTP consolidation
17. Critical tool distinctions (bvm vs bvmReady, ivKit, vsMonitor vs individual monitors)
18. Intervention-narrative continuity
19. Distractor design (three categories: distractor-clinical, distractor-pack, distractor-misc)
20. Style (3 rules — length, objective-only findings, vitals match narrative)
21. Pedagogy: do not teach before asking (sacred rule)
22. Threshold and flag consistency
23. Intervention verb choice
24. Web search policy (0-2 searches per scenario)
25. Pre-output verification (5-item checklist, down from legacy 9)
26. Output (return only valid JSON)

### Key design decisions

- **Foundational principles first, content rules second, verification last.** Order matters because the top of the prompt colors how the model interprets everything below.
- **Voice rule applies to Sonnet's authored output**, not the prompt itself. The prompt is imperative and instructional (correct for model-facing text). The output should be bedside-clinician tone.
- **Haiku gets a separate voice rule** when its prompt is written in Phase 5.4.3. Same spirit ("bedside clinician, not textbook"), tuned to short paragraph explanations.
- **Verification checklist trimmed to 5 items** by merging items that share principles. Five items Sonnet will actually self-check beats nine it skims.
- **Curveball deletion is complete and intentional.** No "do not include curveball" instruction (affirmative-not anti-pattern) — just no instruction to generate one. Schema namespace reserved for future.

---

## 8. Phase 5 history — what's shipped

### Phase 5.1 (commit 3cfb49e) — Source marker
Added `sc.source = "builtin" | "ai"` field to every scenario. `hydrate()` backfills missing field with `"ai"` for pre-existing localStorage data.

### Phase 5.2 (commit 2083f2b) — Haiku capability
Added `HAIKU_MODEL_ID` constant, `buildExplanationPrompt()` function (padded above 4,096 tokens for cache eligibility), and `fetchExplanations()` async function with warmup pattern (first call alone, then parallel fan-out). Not wired into any code path yet.

### Phase 5.2.5 + 5.3 (commit 4c98520) — Mark for Review slot references + lazy fetch wiring
- Mark for Review now stores `{phaseIdx, kind, id}` slot references in `playerStore.markedForReview`, not snapshotted text. Resolves correctly even if user marks items before lazy fetch completes.
- Eager deep-dive generation via `expandSingleMarkedItem()` fires immediately when user clicks Mark for Review (background Sonnet call, ready by debrief).
- Phase 2 entry triggers `useEffect` calling `collectMissingExplanationSlots(sc, pi)` → `fetchExplanations()` for any missing slots. Currently dormant in production because the legacy main generator still produces full why/fb text.
- Added 5 new playerStore actions (`addMarkedItem`, `removeMarkedItem`, `setDeepDive`, `forceRefreshScenario`, `markLazySlotFetched`).

### Phase 5.2.5 hotfix (commit 447d536) — Zustand factory signature
Fixed `get is not defined` ReferenceError at `playerStore.js:101`. Factory signature was `create((set) => ...)` — needed `(set, get) => ...` because Phase 5.2.5 added six new actions using `get()` directly.

### Phase 5.4.1 (committed) — Schema lock
`docs/phase-5-lazy-generation/04-skeleton-schema-v1.md` — locked the skeleton schema as the contract between Sonnet (orchestrator) and Haiku (worker).

### Phase 5.4.2 (committed locally, not pushed) — Orchestrator prompt
Three commits:
- 53c406e — Registry additions (vsMonitor, woundPacking, extremityElevation)
- (prompt impl) — `buildOrchestratorPrompt()` added to prompt.js as dormant export
- (design + todo) — `docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md` + DESIGN_TODO update

---

## 9. What's NOT done yet — pending work in priority order

### Phase 5.4.3 — Haiku fan-out dispatcher (next planned session)

The wave-based parallel fan-out logic that consumes a Sonnet-generated skeleton, identifies all null why/fb/content slots, and fires Haiku calls in waves with staggered cache warmup.

**Requirements:**
- Wave priority order per the schema (phase[0] vitals/signs/labs → phase[0] actions → phase[1] vitals/signs/labs → phase[1] actions → debrief.physiologyDeepDive)
- Each wave fires after previous wave resolves
- Within each wave, fire call #1 alone, wait for response, then fire #2-N in parallel (cache warmup pattern)
- Haiku prompt itself must be ≥4,096 tokens to engage prompt cache
- New Haiku voice rule (similar spirit to Sonnet's, tuned to 60-120 word paragraph explanations)
- Slot resolver writes Haiku output back to the scenario object via `_slotRef` paths
- Persistence: completed explanations saved to `bw-custom` on each resolution

### Assess items migration (Path A or Path B)

The 14 read sites and 42 cat literals issue described in section 5. **Must be resolved before Phase 5.4.4** because the new generation path produces typed collections the existing player code can't read.

### Phase 5.4.4 — Wire orchestrator into live generation

Replace the current `buildSystemPrompt()` call path with `buildOrchestratorPrompt()` + fan-out dispatcher. Make the user-facing generation flow use the new architecture end-to-end.

### Phase 5.4.5 — Migrate eager deep dives Sonnet → Haiku

Mark-for-Review deep dives currently fire Sonnet calls (~8-15s each, expensive). Cost-reduction opportunity. Side-by-side quality test first to confirm Haiku produces acceptable depth before flipping.

### Phase 5.4.6 — Cleanup

Delete legacy `buildSystemPrompt()`, `collectMissingExplanationSlots` (redundant after fan-out replaces lazy), and other vestigial code. Update DESIGN_TODO.

### Phase 5.4a deferred items (separate from 5.4.x numbering — content fixes)

- **Subheading cliché fix:** scenario subtitles sometimes use cheesy time-pressure language ("Every second counts," "Time is brain")
- **EMS-framing-always fix:** scenarios always framed as EMS reports even when clinically implausible (walk-in ED presentations, PCP referrals, transfers). Schema 5.4.1's `routeOfPresentation` field with allowed enum values addresses this — but the new orchestrator prompt may need explicit guidance to actually vary route choice across scenarios.

### Phase 5.4b — Director mode

Pre-generation customization of demographics, findings, interventions, phase structure. Includes lethal dose consequence simulation. Deferred — needs Phase 5 architecture solid first.

### Future — Multi-round scenarios

Two sequential assess-and-intervene rounds plus optional curveball third round. The whole reason for the n-phase array schema design. Deferred until lazy generation infrastructure proven.

### Future — Haiku routing layer for user-generated scenarios

Cost reduction by routing simpler scenarios through Haiku end-to-end.

### Future — System prompt tightening

Current orchestrator prompt is ~27,500 chars. If post-deployment metrics show this is a real cost or latency issue, consider trimming sections. Current consensus: not worth optimizing prematurely.

---

## 10. Full changelog (reverse chronological)

### Phase 5 lazy generation work (in progress)

- **2026-05-08:** Phase 5.4.2 complete and committed locally
  - Schema 5.4.1 locked
  - 31 pack-selection examples (up from legacy's 8)
  - Voice rule added to prompt (bedside clinician, not textbook)
  - Distractor categorization formalized (3 categories: clinical, pack, misc)
  - 5-item verification checklist (down from legacy 9)
  - Curveball machinery deleted entirely
  - Smoke test passed: 75s generation, 6K output tokens, schema-conformant
- **2026-05-07:** Registry prerequisites committed (commit 53c406e) — vsMonitor + woundPacking + extremityElevation
- **2026-05-07:** Phase 5.2.5 hotfix (commit 447d536) — fix `get is not defined` in playerStore Zustand factory signature
- **2026-05-07:** Phase 5.2.5 + 5.3 (commit 4c98520) — Mark for Review slot references, eager deep-dive generation, lazy fetch wiring (currently dormant)
- **2026-05-06:** Phase 5.2 (commit 2083f2b) — Haiku 4.5 explanation fetch capability (buildExplanationPrompt, fetchExplanations function, not wired)
- **2026-05-06:** Phase 5.1 (commit 3cfb49e) — Source marker added to every scenario

### Phase 4b — thematic tool/med packs (April 2026)

- 14 thematic packs (universal + 13 specialty), 73 tools and 56 meds
- packs/index.js merges to ALL_TOOLS / ALL_MEDS with collision detection
- Visual metadata extracted to visualMeta.js
- customTool / customMed schema for novel interventions
- Forced variety rules: ≥60% indicated tools, ≥25% distractors, ≥33% normal labs, ≥1-2 normal vital chips, ≥1 reassuring system finding
- Pack-aware distractor rule (from adjacent packs, not random)
- Distractor fb depth requirement (explain why-not-here AND when-it-would-fit)
- SC1-SC5 ID renames: phenytoin→fosphenytoin, txa→tranexamicAcid, epiPen→epiIM, hypertonic→hypertonicSaline, mannitolMed→mannitol, methylpred→methylprednisolone, prbcWarmed→prbc, mtpActivate→mtpActivation, dextrose→dextroseBolus, o2mask→o2Mask
- 7 bare `epinephrine` → epiIV, 1 → epiIM disambiguation
- SC6 (Wren Okafor, opioid OD) added as sixth built-in scenario
- Tagged `pre-phase-4b` and `phase-4b-validated` for revert anchors

### Phase 4a — drop scoring (April 2026)

- Scoring system removed entirely. Scenarios are now learning experiences, not graded performance assessments.

### Phase 3.x / Phase 2.6.x — pre-Phase-4 stabilization

- Adaptive thinking added then later removed (caused timeouts by consuming all available time before producing output; removed from client.js)
- Prompt caching enabled
- Self-review checklist (9 items, later trimmed for orchestrator prompt)
- RULE 8 (loyalty to user input)
- `GENERATE_TIMEOUT_MS` raised 300000 → 600000 to handle slow generations
- BuilderPreview no-progress detection fades in "Researching clinical evidence..." after 8s silence
- Web search throttle: 0-2 searches per scenario

### Clinical accuracy corrections accumulated over time

- Naloxone partial vs full reversal dosing
- Post-PECARN DKA fluid management
- Levetiracetam preference over fosphenytoin
- Three-zone capillary refill framing (≤2s normal, 2-3s borderline, ≥3s abnormal)
- All prompts validated against PALS 2020/2025, AAP, PES, PECARN DKA FLUID Trial, AES status epilepticus guidelines

---

## 11. Key learnings and principles

### Architectural

- **Lazy generation is validated:** Explanation fields comprise ~69-79% of scenario content. Skeleton alone is ~6,000-7,500 tokens vs ~8,500-10,000 for explanations out of ~16,000 total. Splitting them works.
- **Warmup cache pattern is real:** One Haiku call first, then parallel fan-out — ~62% cost reduction vs cold parallel (empirically validated in scripts/cache-test.mjs).
- **Persistence requirement:** Generated explanations must be persisted with the scenario after first generation; replays must never regenerate them. Mark-for-review deep dives are the only session-specific exception.
- **Format is not the bottleneck:** Switching from JSON to other formats yields negligible gains — bottleneck is token count.
- **Adaptive thinking removed:** Caused timeouts by consuming all available time before producing output.
- **Vercel Pro 300s ceiling is the architectural constraint** driving all generation design decisions.
- **vsMonitor bundling pattern:** Granular IDs (pulseOx, bpCuff, cardiacMonitor) replaced by single bundled action for routine monitoring. Reduces UX friction and matches how clinicians actually think.

### Clinical / design

- **"Loyalty to prompt"** means user-stated facts (demographics, pre-arrival interventions, allergies, comorbidities) appear verbatim and aren't contradicted — AI is otherwise free to generate pathology, history, and clinical context.
- **Ratio enforcement rules** (tool/med indicated % targets) are not important to Sebastian — the real concern is preventing scenarios where everything looks abnormal, addressed by lab/vital variety rules.
- **Voice matters:** Sebastian explicitly wanted "less textbook, more readable" — bedside-clinician tone, real-world phrasing, formatting variety. Captured as the Voice section in the orchestrator prompt and will be replicated in the Haiku prompt in 5.4.3.
- **Do not teach before asking** is the sacred pedagogical rule. Findings present objectively; the user interprets first; then teaching happens. Violating this short-circuits the entire learning loop.
- **Pediatric-only scope:** No adult cardiology, code stroke, afib, MI scenarios. Block Ward is peds-focused.

### Workflow

- **Two-commit pattern:** Separate concerns into distinct commits.
- **Tag git state before major changes** for revert anchors (e.g. `pre-phase-4b`, `phase-4b-validated`).
- **Smoke test artifacts** saved to `/Users/openclaw/Documents/blockward/smoke-test-*` (gitignored); never commit before local verification.
- **Claude Code never pushes** — Sebastian pushes manually after testing each phase.
- **Diagnostic-before-fix discipline:** Draft diagnostic-only prompts for Claude Code before applying fixes; explicitly instruct Claude Code not to modify files during diagnosis.
- **Fresh session handoffs:** When context windows grow large, transition to a new conversation with a structured catch-up prompt.

---

## 12. How to resume work in a new session

### Starting prompt for next conversational Claude session

> I'm working on Block Ward, a pediatric clinical simulation app. I'm starting a new chat to continue Phase 5 of the lazy generation architecture refactor. Read the BLOCK_WARD_HANDOFF.md document I'm attaching for full context. We just completed Phase 5.4.2 (orchestrator prompt design and implementation), smoke test passed cleanly. The next planned phase is 5.4.3 (Haiku fan-out dispatcher with staggered cache warmup) — but there's an architectural decision to resolve first about the assessItems flat-array vs typed-collections migration (Path A vs Path B in section 5 of the handoff). Where do you want to start?

### First decisions for next session

1. **Path A vs Path B for the assess-items migration.** Read section 5 of this document, understand the 14 read sites and 42 cat literals, then decide. Conversational Claude leans Path A.
2. **Sequence of remaining 5.4.x phases.** Whether 5.4.3 (Haiku dispatcher) comes before or after the assess-items migration. The dispatcher technically doesn't need the migration to be designed — it operates on the scenario JSON object directly — but it can't be tested end-to-end against the live player until the migration is done.
3. **Haiku prompt design session.** When 5.4.3 begins, the actual Haiku prompt needs to be authored. Will need to mirror the orchestrator prompt's design discipline: audit-style first if there's an existing prompt to learn from, then section-by-section drafting with Sebastian's clinical pushback.

### Files to reference

- `docs/phase-5-lazy-generation/04-skeleton-schema-v1.md` — locked schema
- `docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md` — full prompt draft
- `src/lib/ai/prompt.js` — both buildSystemPrompt() (legacy, in use) and buildOrchestratorPrompt() (new, dormant)
- `src/lib/ai/client.js` — fetchExplanations function exists from Phase 5.2
- `src/stores/playerStore.js` — Mark for Review and lazy fetch wiring
- `src/lib/scenarios/explanationSlots.js` — collectMissingExplanationSlots (Phase 5.3)
- `src/lib/scenarios/slotResolve.js` — slot reference parser
- `DESIGN_TODO.md` — running notes

---

*End of handoff document.*
