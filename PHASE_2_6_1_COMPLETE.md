# Phase 2.6.1 — Complete

Diagnose-then-fix run. **PART 1** identified the failure mode and added diagnostic logging without changing behavior. **PART 2** implemented six fixes in seven commits. Nothing pushed.

## What was actually going wrong

Both of Sebastian's GSW failures hit the user-visible message **"Scenario was too complex and got cut off…"** which fires from `lib/ai/client.js:20` **only when `d.stop_reason === "max_tokens"`**. It is not a generic catch — there are eight differentiated error branches in `generateScenario`. So both runs genuinely cleared the 16,000-token output cap.

### Why 16k wasn't enough

| Contributing factor | Impact |
|---|---|
| **Tool-use turns count toward `max_tokens`.** Web search rounds (TXA dose, MTP triggers, REBOA, etc.) eat output tokens. | Heavy cost for trauma scenarios; explains why the no-curveball GSW also failed. |
| **Phase 2.5+2.6 added required content.** reassessment, stabilizationSummary, emsReport, learnMore, 8-10 interventions/phase, 3+ items/category, all `why` content as overview+bullets+bold. | A complete curveball scenario can plausibly clear 16k output tokens. |
| **Sonnet 4.6 verbosity.** Anecdotally produces longer JSON when given many constraints. | Compounds the above. |

### What was NOT the problem

| Suspected | Actual |
|---|---|
| `effort` was set too high | **`effort` is not a real Anthropic parameter** for Sonnet 4.6. Only `thinking` exists, and that's also unset. |
| System prompt was eating output budget | **No.** Anthropic's `max_tokens` is the OUTPUT cap; system+messages count separately as input. The 3,300-token system prompt does not compete with output budget. |
| The error was a generic catch-all | **No.** Eight differentiated branches; the message Sebastian saw fires only on `max_tokens`. |

### Diagnostic data (committed `123be85`, still active)

`api/generate.js` now logs on every call:

```
[generate diagnostic] {"mode":"…","streaming":true|false,"http_status":N,
  "stop_reason":"…","input_tokens":N,"output_tokens":N,"duration_s":"…",
  "content_blocks":N,"content_block_types":[…],"first_200_chars":"…",
  "api_error":"…"}
```

Visible in Vercel function logs or local `vercel dev` terminal. Will be removed once Sebastian confirms the fixes hold across several test runs.

## What was fixed

### Commit table

| Part | Commit  | Summary                                                       |
|------|---------|---------------------------------------------------------------|
| 1    | 123be85 | diagnostic logging in api/generate.js                         |
| 2A   | 853971d | differentiated error messages per failure mode                |
| 2B   | ac0f40e | max_tokens default 16000 → 24000 (client + server)            |
| 2C   | (none)  | trim candidates listed in PHASE_2_6_1_LOG.md; nothing modified |
| 2D   | 8cc98d4 | streaming end-to-end (server pipes SSE; client parses)        |
| 2E   | 6965000 | phase-keyed loading messages with crossfade                   |
| 2F   | 71dca99 | hybrid byte+time progress bar, monotonic                      |

### A. Differentiated error messages

| Failure mode                                          | Old message (every case)               | New message |
|-------------------------------------------------------|----------------------------------------|-------------|
| `stop_reason: "max_tokens"`                           | "Scenario was too complex…"           | "Response was cut off — please try a simpler description." |
| Network / `AbortError` / non-JSON server response     | "Scenario was too complex…"           | "Connection issue — please check your network and retry." |
| Anthropic API `error` field                           | message verbatim (unchanged)          | message verbatim (unchanged) |
| `tool_use` stop_reason with empty text                | unchanged                              | unchanged ("AI got stuck in a research loop…") |
| Empty response text                                   | unchanged                              | unchanged ("No text in AI response.") |
| No JSON candidate / JSON parse failure                | "AI did not return valid JSON…"        | "Generated scenario was malformed — please try again." |
| Missing scenario.id or scenario.phases                | "AI generated an incomplete scenario…" | "Generated scenario was incomplete — please try again." |
| `validateSchema` errors                               | "AI generated scenario is missing…"    | "Generated scenario was incomplete — missing: <fields>" |

### B. `max_tokens` 16000 → 24000

Bumped both client default (`MAX_TOKENS` in `lib/ai/prompt.js`) and server-side fallback (`api/generate.js`). Sonnet 4.6 supports up to 64k output, so 24k is safely within range. Curveball scenarios with web_search use should now have ~7-8k of headroom over typical generation, which would have absorbed the GSW case.

### C. Prompt trim candidates (NOT trimmed; for Sebastian's review)

Listed in detail in `PHASE_2_6_1_LOG.md` PART 2C section:
- **Tier 1 (safe to remove/compress):** redundant overlap between MANDATORY CLINICAL ACCURACY RULES and CRITICAL STYLE RULES; PATIENT NAME DIVERSITY appears twice; some assess-rule restatements.
- **Tier 2 (could be compressed):** the verbose example inside style rule (3); duplicate per-scenario examples in INTERVENTION VARIETY.
- **Tier 3 (do not remove):** PEDAGOGY / ETIOLOGY / REASSESSMENT / EMS REPORT / TOOL DISTINCTIONS / TOKEN BUDGET / JSON skeleton.

Estimated savings if all Tier 1 + 2 were trimmed: ~600–900 tokens (3,300 → 2,400–2,700). Combined with the max_tokens raise this would give the model ~8–9k of comfortable output headroom on top of any web_search consumption.

**Sebastian decides which to drop. Until then, the prompt is unchanged.**

### D. Streaming end-to-end

Server (`api/generate.js`):
- New streaming branch when `body.stream === true`. Adds `stream: true` to upstream Anthropic call, then pipes the SSE response chunk-by-chunk to the client with `text/event-stream` headers and `flushHeaders()`.
- Best-effort sniffs `stop_reason` and `usage` from chunk text for the diagnostic log.
- Non-streaming branch unchanged for `expand_marked_items` and any legacy callers.
- Both paths emit the `[generate diagnostic]` log.

Client (`lib/ai/client.js`):
- `generateScenario` now sends `stream: true` and parses SSE events. `content_block_delta.delta.text_delta` accumulates into a string; `message_delta.delta.stop_reason` surfaces the stop reason; SSE `error` event throws.
- New optional `onProgress({bytes, accumulated, message?})` callback fires on every chunk. `message` is set only when a new top-level JSON key is detected for the first time.
- Existing post-parse pipeline (validateSchema → applyAutocorrections → validateConsistency → validateCounts → surfaceable warnings) extracted into `applyPostParseFixups()` for reuse.
- `expandMarkedItems` stays non-streaming (small response, has its own loading UI).

### E. Phase-keyed loading messages

PHASE_KEYS map in `lib/ai/client.js`. Each top-level JSON key is detected on first occurrence in the accumulated text:

| Key | Message |
|---|---|
| `"patient":` | Building patient profile... |
| `"emsReport":` | Drafting EMS handoff... |
| `"learnMore":` | Pulling background context... |
| `"norms":` | Setting age-appropriate norms... |
| `"vitals":` | Calibrating vital signs to age... |
| `"signs":` | Documenting bedside findings... |
| `"assessItems":` | Selecting normal-vs-abnormal options... |
| `"labs":` | Generating consistent lab values... |
| `"escalation"` | Building intervention pool... |
| `"curveball":` | Plotting a curveball... |
| `"reassessment":` | Modeling post-intervention recovery... |
| `"stabilizationSummary":` | Finalizing clinical recap... |
| `"debrief":` | Writing teaching takeaways... |

Initial state (before any chunks): `"Researching clinical guidelines..."`.

BuilderPreview crossfades between messages with a 250ms `msgIn` keyframe so the user notices the change without flashing.

### F. Hybrid byte+time progress bar

- **Primary signal:** accumulated content chars (`p.accumulated.length`), not raw SSE chunk bytes (which include 5-10× framing overhead).
- **Time-based fallback:** sweeps 0 → 30% over the estimate window during the pre-stream warm-up (server cold start + first-token latency).
- **Monotonic:** progress = `Math.max(byteFrac, timeFrac)`, capped at 0.97. Bar never moves backward when streaming starts late.
- Estimates: ~24 KB content for non-curveball, ~38 KB for curveball — calibrated against built-in scenario sizes.
- Status line combines KB-received + elapsed-seconds: `"12 KB · 7s"` or `"4s elapsed · waiting for first chunk"`.

## What to verify after this lands

1. **Test with the same GSW prompt** that failed before (curveball on AND off). The streaming should expose:
   - whether `stop_reason: max_tokens` actually fires now (look in Vercel logs for `[generate diagnostic]`)
   - or whether the request now completes within the new 24k budget
2. **Watch the diagnostic logs** for typical `output_tokens` values across a few scenarios. If complex trauma routinely lands at 18-22k, then 24k is comfortable. If it occasionally hits 23k+, consider the Tier 1+2 prompt trims.
3. **Confirm streaming UX** feels more responsive than the previous static spinner. The progress should start moving within 1-3 seconds (time-based fallback covers cold start) and crossfade through the phase messages as Anthropic emits each section.

## Followups (NOT implemented)

- **Diagnostic logging** in api/generate.js is marked temporary — once Sebastian has confirmation across a few scenarios, the `console.log('[generate diagnostic]', …)` block can be removed. Easy revert.
- **Tier 1 + Tier 2 prompt trims** (PART 2C) — Sebastian reviews and chooses.
- **`expandMarkedItems`** still non-streaming. The deep-dive call usually returns 2-5 KB and finishes in ~5 seconds, so streaming isn't urgent. If the marked-list grows large, consider streaming it too.
- **`stop_reason` mid-stream surface** — if a stream is cut short by `max_tokens`, the user currently sees the bar at whatever fraction it reached, then a "Response was cut off" error after the SSE ends. We could add an inline banner ("approaching limit") if `output_tokens` in `message_delta.usage` crosses 90% of `max_tokens`. Skipped for now to avoid scope creep.
- **Server-side `max_tokens` cap.** Currently the client picks `MAX_TOKENS` and the server only provides a fallback default. A malicious caller could request 64k. Not urgent, but a server allowlist would be tighter.
