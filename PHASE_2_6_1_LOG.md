# Phase 2.6.1 Log

## PART 1 — Diagnostic findings

### 1. api/generate.js — current API call shape

| Field         | Current value                                                |
|---------------|--------------------------------------------------------------|
| `model`       | client-supplied; defaults to `claude-sonnet-4-6` (line 42)   |
| `max_tokens`  | client-supplied; **defaults to 16000** (line 43)             |
| `system`      | client-supplied (full prompt, line 44)                       |
| `messages`    | client-supplied (line 45)                                    |
| `tools`       | client-supplied (web_search_20250305 from client.js:14)      |
| `stream`      | **not set — non-streamed.** Response is buffered then `await response.json()` on line 50. |
| `effort`      | **not set; not a real Anthropic API param** for Sonnet 4.6. The only related parameter is `thinking` (extended thinking mode), which is also not set. |

The endpoint blindly proxies whatever the client sends. There is no server-side cap on `max_tokens`, no model allowlist, no streaming.

### 2. lib/ai/prompt.js — token estimate

Measured by character count / 4 (rough rule-of-thumb for English):

| Prompt mode               | Chars  | ≈ tokens |
|---------------------------|--------|----------|
| `buildSystemPrompt(true)` | 13,530 | **3,383** |
| `buildSystemPrompt(false)`| 13,148 | **3,287** |
| `buildDeepDivePrompt()`   |  1,092 |    273   |

The system prompt has grown from ~1,600 tokens at end of phase-1 to ~3,300 tokens after the additions in phase-2.5 + 2.6 (etiology vs presentation, intervention variety, why-field formatting, token budget, reassessment, stabilization, learnMore, EMS report, intervention verb choice, BVM split rule, etc.). It is large but well under the model's 200k+ context limit.

**The system prompt does NOT eat into the output budget.** Anthropic's `max_tokens` parameter is the **output** maximum; input tokens (system + messages) are accounted separately. So a 3,300-token prompt + 16,000-token output budget = 16,000 tokens of output available.

### 3. client.js error routing — what actually fires "Scenario was too complex"

The "Scenario was too complex" message at **lib/ai/client.js:20** fires **only** when `d.stop_reason === "max_tokens"`. It is NOT a generic catch-all.

Full error routing trace from `generateScenario`:

| Line | Condition                                        | User-facing message                                                                                              |
|------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| 18   | `JSON.parse(raw)` throws                         | "Server returned invalid response (status N). The request may have timed out — try again."                        |
| 19   | `d.error` present                                | `d.error.message` verbatim (Anthropic API error)                                                                  |
| **20** | **`d.stop_reason === "max_tokens"`**           | **"Scenario was too complex and got cut off. Try a simpler description or turn off Curveball Mode."** ← Sebastian's message |
| 24   | empty text + `stop_reason === "tool_use"`        | "AI got stuck in a research loop. Try again with a more specific description."                                    |
| 25   | empty text + other stop_reason                   | "No text in AI response. Try again."                                                                              |
| 31   | no balanced `{...}` candidates in cleaned text   | "AI did not return valid JSON. Try rephrasing or simplifying your description."                                   |
| 40   | `JSON.parse(cl)` fails twice (incl. loose-fix)   | "AI response had invalid JSON. Try again — simpler prompts work more reliably."                                   |
| 42   | scenario lacks `id` or `phases`                  | "AI generated an incomplete scenario. Try being more specific about the patient age, condition, and setting."     |
| 46   | `validateSchema` finds errors                    | "AI generated scenario is missing required fields: …"                                                             |

**Sebastian's exact message at the line he reported (BuilderForm.jsx:19) only fires for `max_tokens` — not for parse failures, network errors, or schema misses.** Both of his GSW failures must therefore have actually returned `stop_reason: "max_tokens"`.

### 4. Why max_tokens=16000 is being hit

Plausible causes (cannot confirm without the diagnostic logs landing — see commit `123be85`):

a. **Tool-use consumption.** The client passes `tools: [{type: "web_search_20250305", ...}]`. Web-search tool turns count toward `max_tokens`. A trauma scenario like a 12-year-old GSW likely triggers multiple search rounds for hemorrhage-control protocols, MTP triggers, REBOA, TXA dosing, etc. Each round eats tokens.

b. **Verbose JSON output.** The phase 2.5 + 2.6 prompt additions multiplied required content per scenario:
   - reassessment block (vitals + signs + narrative)
   - stabilizationSummary (verbatim paragraph)
   - emsReport + learnMore (additional fields)
   - 8-10 interventions per phase (was 5-6)
   - 3+ items per assess category (was 6-8 total flexibly distributed)
   - All `why` content as overview + bullets + bold formatting
   - The new TOKEN BUDGET instruction asks for depth-over-breadth in curveball, but the AI may interpret this as "go deeper" not "be terser."

c. **Sonnet 4.6 verbosity.** Anecdotally, Sonnet 4.6 tends to produce longer responses than Sonnet 4 when given many constraints. With 8-12 assess items × ~150 tokens of `why` content each, plus 16-20 intervention `fb` strings × ~200 tokens, plus reassessment + stabilization + 2-3 explainers + (curveball: + 2-3 teaches), a complete curveball scenario can easily exceed 16k output tokens.

d. **No-curveball failure** — Sebastian saw this too. With curveball off, output is ~30-40% smaller, but the same web_search consumption applies. If the AI did 4-6 search turns for a complex trauma case + verbose JSON, even non-curveball can clear 16k.

### Recommendation summary (for PART 2)

A. **Keep `stop_reason==="max_tokens"` mapped to "Response was cut off — please try a simpler description"** (better wording per the brief) and add JSON parse / network / schema messages already present (most are already differentiated; just need slight phrasing improvement).

B. **Raise `max_tokens` from 16,000 to 24,000** (server-side default, not just client-side). Sonnet 4.6 supports up to 64k output; 24k is well within range and accommodates a verbose curveball scenario plus several rounds of web_search.

C. **Do not trim the prompt yourself.** Candidate trim sections will be listed for Sebastian's review (in the C report below) — none will be trimmed unless he says so.

D. **Convert to streaming.** Both for real progress UX and so a truncation event is visible incrementally rather than as a final `stop_reason` after a 60+ second wait.

E. **Phase-keyed loading messages.** Parse the streaming response in real time, fire messages as new top-level keys appear in the JSON.

F. **Hybrid progress bar.** Bytes-received as primary signal, time-based fallback for the first second.

### PART 2C — Prompt trim candidates (FOR SEBASTIAN'S REVIEW; NOT TRIMMED)

The system prompt is currently ~3,300 tokens. Below are sections that could be trimmed without sacrificing the core pedagogy or behavior. **None of these were trimmed.** Sebastian decides.

#### Tier 1 — Safe to remove or compress (clear redundancy)

1. **MANDATORY CLINICAL ACCURACY RULES (10 numbered items).** Several restate the same idea: rule 4 ("disease progressions must follow real pathophysiology") and rule 7 ("never invent drug names, lab tests, or clinical signs that do not exist") are essentially the same constraint. Rule 5 ("every explanation must cite the actual biochemical/physiologic mechanism") is restated by the WHY-FIELD FORMATTING rules later. Could collapse 10 → 5–6 items.

2. **CRITICAL STYLE RULES (10 numbered items) overlaps with WHY-FIELD FORMATTING.** Style rule (3) says "TOOL/MED FEEDBACK must use bullet points. Format as: first sentence states whether appropriate or not and why, then \\n- for each key point" — and then WHY-FIELD FORMATTING repeats the same overview-plus-bullets pattern. Style rule (7) "EVERY teaches and explainers MUST include tldr AND use bullet points" is redundant with rule (3) plus the WHY-FIELD FORMATTING contract. Could remove (3) and (7) once WHY-FIELD FORMATTING is the single source of truth for body formatting.

3. **PATIENT NAME DIVERSITY** appears twice (in CRITICAL PEDAGOGY RULE area AND in CRITICAL STYLE RULES item 5). The user-message hint already enforces letter-rotation per request. Could remove one of the two occurrences.

4. **CRITICAL ASSESSMENT RULES** restates "include vitals/labs/clinical findings" — already covered by the JSON skeleton requirement that each phase has assessItems with `cat` field, plus the new 3+ per category rule from F3.

#### Tier 2 — Could be compressed (verbose examples)

5. **The full bullet-point example inside style rule (3)** ("Appropriate. Epinephrine provides systemic bronchodilation when inhaled meds cannot penetrate.\\n- Dose: 0.01 mg/kg IM to lateral thigh\\n- ...") is ~80 tokens. The WHY-FIELD FORMATTING block already gives a similar example. Pick one example and remove the other.

6. **INTERVENTION VARIETY** has two long per-scenario examples (GSW, febrile infant). One example would convey the rule. ~60-80 tokens trim.

7. **THRESHOLD CONSISTENCY** ("Do NOT write 'SBP 82 is below threshold of 80' - 82 > 80. Verify arithmetic before returning JSON.") — short and load-bearing per the SBP 82 incident. Keep.

#### Tier 3 — Should NOT be removed

8. **CRITICAL PEDAGOGY RULE — DO NOT TEACH BEFORE ASKING** — load-bearing for the entire 2.5+ data model. Keep.
9. **ETIOLOGY VS PRESENTATION** — added to fix the "sepsis caused by hypoglycemia" hallucination. Keep.
10. **REASSESSMENT AND STABILIZATION** — required fields the UI renders verbatim. Keep.
11. **EMS REPORT FIELD** — defines the screen content. Keep.
12. **CRITICAL TOOL DISTINCTIONS (bvm vs bvmReady)** — small, load-bearing. Keep.
13. **TOKEN BUDGET** — meta-rule about not bloating curveball. Keep.
14. **The JSON skeleton itself** — large but defines the contract. Keep.

#### Estimated savings if all Tier 1 + Tier 2 items were trimmed

~600–900 tokens from a 3,300-token base, taking the system prompt to roughly 2,400–2,700 tokens. Not enormous, but combined with the max_tokens raise to 24,000, that frees ~700 tokens of headroom on the input side and ensures the model has even more room on the output side.

**Recommendation:** Sebastian reviews this list and decides which Tier 1 / Tier 2 items to drop. Then a separate commit can trim them. Until then, the prompt is unchanged.

### PART 2 commits

| Part | Commit  | Summary                                                       |
|------|---------|---------------------------------------------------------------|
| 1    | 123be85 | diagnostic logging in api/generate.js                         |
| 2A   | 853971d | differentiated error messages per failure mode                |
| 2B   | ac0f40e | max_tokens default 16000 → 24000 (client + server)            |
| 2C   | (none)  | trim candidates listed for Sebastian; nothing modified        |
| 2D   | 8cc98d4 | streaming end-to-end (server pipes SSE; client parses)        |
| 2E   | 6965000 | phase-keyed loading messages with crossfade                   |
| 2F   | 71dca99 | hybrid byte+time progress bar, monotonic                      |

### Diagnostic logging (committed `123be85`)

Now logs on every API call:
- `mode`
- `http_status`
- `stop_reason`
- `input_tokens` / `output_tokens`
- `duration_s`
- `content_blocks` count + types
- `first_200_chars` of response text
- `api_error` if any

Visible in Vercel function logs or local `vercel dev` terminal. To be removed once root cause is fixed.

---
