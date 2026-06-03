# Block Ward Handoff — 2026-05-27

## Project context

Sebastian builds Block Ward, a pediatric emergency clinical simulator for RNs and medical students. He is a medical professional, not a developer. Tech stack: Vite + React (JavaScript, not TypeScript), Vercel serverless functions, Anthropic API via raw `fetch()`. Repo `kanudog/blockward` on GitHub, auto-deploys to Vercel on push to main. Local path `/Users/openclaw/Documents/blockward` on a Mac Mini (username `openclaw`). Sebastian develops in Cursor with Claude Code running `claude --dangerously-skip-permissions`. He runs `vercel dev` (not `npm run dev`) because the app needs serverless functions for `/api/generate`. Local dev URL is typically `http://localhost:3000` from Vercel.

## Working relationship

Claude Code does all implementation. The conversational Claude (in claude.ai) is architectural advisor and clinical reviewer. Sebastian pastes the conversational Claude's prompts verbatim into Claude Code — write prompts that way. Sebastian reviews diffs, runs manual smoke tests, then commits and pushes manually. Claude Code never pushes.

Sebastian explicitly wants:
- Explanations of *why*, not just *what*
- Push back when he's wrong
- He cannot reliably catch clinical accuracy errors — verify uncertain things via web search, don't rely on him to flag them
- He cannot reliably catch implementation bugs — be the verification layer
- Decisions are locked through design docs and dry-run scripts before implementation
- Smoke tests gate before commit
- For risky commits: review branch first, validate, then squash-merge to main with clean message
- For low-risk commits (single-file content edits, polish on working code): push direct to main is acceptable

Code style — strictly preserved:
- JavaScript, not TypeScript
- No template literals — use string concatenation with `+`
- No arrow functions in JSX attributes
- Inline styles over Tailwind
- `Object.assign` for style merging
- Plain `function` declarations, not arrow assignments

## What just shipped — Phase 6.2 chapter complete

The entire Phase 6.2 orchestrator wiring chapter landed in this session. Seven commits, all in production:

- **6.2b.1** — Orchestrator prompt body shipped (dormant). Reassessment section with always-stabilizes rule, `why: null` mandates, pediatric ref guidance, signs/labs split.
- **6.2b.2** — `migrateLegacyScenario.js` extended for orchestrator output. Top-level field translation (`patientCard` → `patient`, `presentation` unwrap to `emsReport`/`learnMore`, `reassessment.stabilizationSummary` lifted top-level, `visuals` defaulted to `[]`), `why: null` backfill on signs/labs, idempotency proven.
- **6.2b.3** — Live wiring. `buildOrchestratorPrompt()` swapped into `generateScenario` in client.js. Production gen time dropped from ~280s to ~95s. PatientSVG `visuals: {}` → `[]` self-healing migration fix included.
- **6.2b.4** — Content quality. BP shape consistency, lab variety enforcement (≥2 normal labs per phase), pediatric ref ranges, why-card markdown formatting tightened to ~120 words.
- **6.2b.4-fixup** — Player rendering catch-up for BP shape change (`_getBpDisplay()` helper reads unified `id: "bp"` first, falls back to legacy split `sbp`/`dbp` for built-ins). Cap refill moved to vitals (was sometimes a sign, sometimes a vital). Why-card hard cap 150 words.
- **6.2b.5** — Phase 0 strict separation (`stageType: "assess"` emits `actions: {tools: {}, meds: {}}`). "What Saved This Patient" stabilized screen now reads `phase[1].actions` filtered to `priority: "tied-correct"`, with subtle Check (selected, teal opacity 0.9) vs Circle (missed, gray opacity 0.5) markers. Priority taxonomy clarified in the prompt: `tied-correct` = must-have therapeutics, `correct` = supporting/preparatory.

Production was manually smoke-tested with three scenarios (septic shock from CAP, severe dehydration with AMS, anaphylaxis from peanut butter) and all gates pass. The orchestrator is genuinely done.

## Current production behavior

User generates an AI scenario → Sonnet orchestrator runs (~95s) → skeleton scenario with `why: null` placeholders → wave dispatcher fires Haiku in 5 waves in the background while user plays Phase 1:
- **Wave 1:** Phase 0 vitals/signs/labs `why` (awaited before Assess button enables, ~15-25s)
- **Wave 2:** Always empty (Phase 0 has no actions by 6.2b.5 rule)
- **Wave 3:** Phase 1 vitals/signs/labs `why`
- **Wave 4:** Phase 1 tool/med `fb` (must-haves + supporting + distractors)
- **Wave 5:** Debrief physiology deep dives (the big ones, ~1500 words each)

Cache warmup is await-first-call-then-fan-out. Per-wave persistence debouncing. AbortController is scenario-scoped. First-time-only gate via `dispatcherShouldRun`.

## Architecture references in the repo

- `docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md` — locked prompt design
- `docs/phase-5-lazy-generation/08-dispatcher-architecture.md` — wave dispatcher spec
- `src/lib/ai/prompt.js` — `buildOrchestratorPrompt()`, `buildPerItemExplanationPrompt()`, `MODEL_ID`, `HAIKU_MODEL_ID`, `MAX_TOKENS`
- `src/lib/ai/client.js` — `generateScenario` (line ~92 calls `buildOrchestratorPrompt`), `applyPostParseFixups`, deep-dive expansion logic
- `src/lib/ai/dispatcher.js` — 5-wave fan-out, cache warmup, persistence debounce
- `src/lib/scenarios/migrateLegacyScenario.js` — `migrateLegacyScenario`, `_migrateTopLevel`, `migratePhase`. Idempotent.
- `src/lib/scenarios/canonicalize.js` — `vitalsLookup(vitals, signs)` synthesizes cap from signs when missing (backward compat for stale localStorage scenarios)
- `src/stores/playerStore.js` — game state, `window.__bw_playerStore` debug hook exposed
- `src/components/player/VitalsDisplay.jsx`, `AssessPanel.jsx`, `ScenarioPlayer.jsx` — BP rendering, must-haves list
- `scripts/orchestrator-dry-run.mjs` — gitignored diagnostic script; runs orchestrator against live API, validates schema/idempotency/lab variety/cap placement/Phase 0 separation/per-item prompt phrasing. Sections A-L in the auto-generated report. **This is the verification harness — run it before any orchestrator-touching commit.**

## Known unfinished items (in rough priority order)

**Bug sweep — small wins, low risk, do these first:**
- **Explored counter off-by-one.** Phase 2 tile exploration shows `total-1/total` instead of `total/total`. State key may not be `exploredItems` (recent dump showed it absent). Needs source trace.
- **Visuals feature restoration.** PatientSVG renders avatar accessories from a `visuals: []` keyword array (hives, casts, oxygen mask, wheelchair, c-collar, etc. — ~13 categories). Orchestrator currently emits `visuals: []` always. Needs prompt section instructing Sonnet to emit appropriate keywords. Inventory the existing PatientSVG keyword list first so the prompt mentions exactly what the renderer knows.
- **Age/sex/bed-vs-crib sporadic avatar logic.** PatientSVG reads `ageGroup` prop (`"infant" | "toddler" | "child" | "teen"`). Orchestrator emits `patient.ageLabel` as a string ("6 years old"). Something has to translate. Find the prop-passing chain ScenarioPlayer → PatientView → PatientSVG and fix the derivation.
- **Mark-for-review keying missing phase context.** If user marks same-ID items across phases, the keying collides. Add phase prefix.
- **Eager deep-dive missing per-slot in-flight guard.** Race condition possible if user clicks fast.

**Phase 6.3 — built-in scenario rewrites (medium-sized project):**
SC1 (fussy infant), SC2 (vomiting toddler), SC3 (asthma crisis), SC4 (infant septic shock with hypoglycemia), SC5 (Mira RSV bronchiolitis HFNC failure), SC6 (Wren Okafor opioid overdose) are still in legacy shape. Migration runs at every `playerStore.start()` to convert. Rewriting in orchestrator shape removes that overhead and brings them to current quality standards. Six focused commits, SC1 first. Use a fresh orchestrator-shaped scenario as the structural template. Pull a clean output from `scripts/orchestrator-dry-run-output-6_2b5.json` as reference.

**Phase 6.4 — cleanup:**
- Delete `buildSystemPrompt` (legacy single-pass prompt — no longer wired)
- Remove `scenario.curveball = null` in `applyPostParseFixups`
- Possibly delete `patientCard`/`presentation`/`schemaVersion`/`subtitle` from migrated output if localStorage size matters (they're harmless passthrough currently)

**Phase 7 (per `DESIGN_TODO.md`):**
- Remove sign-card flagging entirely (deprecate the binary "is this finding abnormal?" interaction — sign cards mix normal/abnormal content and the binary judgment doesn't fit)
- System label typography refinement
- Lab tube icons
- The "RR-normal-but-inadequate" UX problem — binary `bad: true/false` flag can't represent "normal in absolute terms but inadequate for clinical context"

## Things to know about Sonnet's orchestrator behavior

- **`tied-correct` vs `correct` is counterintuitive but consistent.** `tied-correct` = must-have therapeutic for THIS pathology. `correct` = supporting/preparatory (monitor, IV, stethoscope, blood cultures, CXR). Verified consistent across septic shock, dehydration, and anaphylaxis runs in this session.
- **Patient name diversity works.** Sonnet draws from non-Western names without explicit prompting. Mateo Reyes, Amara Osei, Dilan Öztürk, Farrukh Nazari, Tariq Osei across recent runs.
- **Reassessment narratives land clinically.** "She's crying louder now — which, after what you just saw, is genuinely reassuring." Bedside voice landing.
- **One creatinine edge case to expect occasionally.** When Sonnet flags a lab as "approaching the upper limit" (e.g., creatinine 0.7 with ref 0.3-0.7), the dry-run script's strict numeric-inside-range check fires as a coherence violation. Clinically defensible, not a regression. Don't tighten the prompt for this.
- **Lab variety holds at 3-4 normal of 8-10 total per phase.** The ≥2 normal rule from 6.2b.4 is being met comfortably.
- **Why-cards cluster at 150-180 words despite 120-word target and 150-word hard cap.** Haiku trends a touch above target. Sebastian called the length good in the manual smoke; don't tighten further without his explicit ask.
- **Deep dives are ~1500 words each.** Long by general standards but appropriate for mark-for-review depth. Sebastian explicitly likes them.

## How to talk with Sebastian

- One question at a time when asking him to make decisions
- Plain language, not technical jargon when he's the audience
- When he's confused, that's a signal to reframe — he's not slow, he's just not in the implementation weeds
- He'll ask "should I commit/push now?" — answer with the actual sequence (smoke test → review branch or direct-to-main → push → preview validate → squash-merge if applicable)
- When clinical content needs review, ask explicitly and tell him exactly what to look at (e.g., "read the reassessment narrative for an 8yo asthma case — does the timing on the steroid hit sound right to you?")

## Test scenarios that exercise the system hard

For smoke tests after any orchestrator change, these prompts exercise different fixes:

- **Septic shock from CAP** — the canonical dry-run baseline. `"6 year old, suspected septic shock from community-acquired pneumonia. Capillary refill 5 seconds, mottled extremities, lethargic but rousable. No known PMH, no allergies."`
- **Severe dehydration with AMS** — exercises electrolyte labs, normal/abnormal mix, BP rendering through reassessment. `"5 year old with severe dehydration and altered mental status, brought in by parents after 3 days of vomiting and diarrhea. Last urinated yesterday morning. Lethargic, sunken eyes, dry mucous membranes."`
- **Anaphylaxis from peanut butter** — exercises airway content, BP across multiple render paths, distinct outcome (`admitted-floor` with observation). `"2 year old with anaphylaxis after eating peanut butter for the first time at daycare. Diffuse hives, lip swelling, drooling, audible stridor at rest. Cap refill 4 seconds. BP 72/40."`
- **Status asthmaticus (refractory)** — exercises respiratory pack distractors, intubation prep, ICU outcome. `"8 year old with status asthmaticus, failed albuterol at home"` — or with more detail for testing.

---

## Prompt to give the next Claude Code session

Paste this into the new Claude Code session to catch it up:

```
I'm continuing work on Block Ward, a pediatric emergency clinical
simulator. The full project context is in docs/BLOCK_WARD_HANDOFF_2026-05-27.md
in this repo. Read that file first — it covers the tech stack,
working preferences, recent commits, what's in production, known
unfinished items, and how Sebastian and I work together.

After reading the handoff, also pull these for the current state:

1. docs/phase-5-lazy-generation/05-orchestrator-prompt-design.md —
   the locked orchestrator prompt design
2. docs/phase-5-lazy-generation/08-dispatcher-architecture.md —
   the dispatcher spec
3. CODE_TODO.md — engineering follow-ups
4. DESIGN_TODO.md — UX work
5. The most recent orchestrator dry-run report at
   scripts/orchestrator-dry-run-report-6.2b5.md (if present —
   it's gitignored, so it may not be in the repo; the report
   structure and recent results are summarized in the handoff
   doc instead)

Phase 6.2 is fully complete and in production. Generation time
dropped from ~280s to ~95s. The orchestrator is wired, content
quality is dialed in, Phase 0 is strictly assess-only, and the
"What Saved This Patient" screen shows must-haves with subtle
selection markers.

After reading the handoff:

A. Summarize what you understand about the current state:
   - What shipped through Phase 6.2b.5
   - What known unfinished items exist
   - What working preferences and code style rules apply

B. Wait for me to tell you which item to work on next. I have not
   decided yet between (1) the bug sweep (explored counter,
   visuals restoration, age/sex avatar logic), (2) Phase 6.3
   built-in rewrites, or (3) Phase 6.4 cleanup. We'll decide
   together once you've confirmed your context.

C. Do NOT begin generating Claude Code prompts or design work
   until I've begun confirmed your context summary matches my
   expectations.

Notes:
- The repo is public at kanudog/blockward; use bash + curl
  against raw.githubusercontent.com URLs if web_fetch needs URL
  provenance.
- The window.__bw_playerStore DevTools debug hook is in
  playerStore.js — useful for inspecting scenario state during
  smoke tests.
- Never paste API keys or credentials into the conversation.
```
