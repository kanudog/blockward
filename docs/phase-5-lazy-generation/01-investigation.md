# Phase 5: Lazy Generation Refactor — Investigation

Read-only investigation. No code edits in this document. Recommendation
and phasing are at the bottom (§1.7, §1.9). Stop and review before
authorizing any commits.

## Critical findings up front

Two findings materially change the assumed architecture and should be
read before the rest of the report:

1. **`expandMarkedItems` already uses Sonnet 4.6, not Haiku.**
   `src/lib/ai/client.js:227` reuses the shared `MODEL_ID` constant
   from `src/lib/ai/prompt.js:1`, which is hardcoded
   `claude-sonnet-4-6`. The plan assumed Haiku. The existing
   infrastructure is reusable for lazy explanations, but the model
   swap is a real refactor — every cost/latency estimate that
   referenced "Haiku" is currently being paid at Sonnet rates.

2. **No scenario carries a "built-in vs AI-generated" flag.** Built-in
   scenarios are JS objects in `src/lib/scenarios/builtIn.js`
   (SC1–SC6), exported and concatenated with custom scenarios at
   `src/hooks/useScenarios.js:4`. Nothing on the scenario object
   distinguishes them at runtime. `ScenarioCard.jsx:4` keeps a
   hardcoded `BUILT_IN_IDS = ["fussy-infant","vomiting-toddler",
   "asthma-crisis"]` — a stale list (3 of the 6 built-ins; SC4–SC6
   never get the badge). For lazy generation we **must** introduce a
   source marker so the renderer knows whether to fetch explanations
   or trust the pre-populated text.

Two things that go in the opposite direction (good news):

- **The renderer is already `why` / `fb`-undefined tolerant.** Every
  consumer either uses optional chaining, conditional rendering, or a
  placeholder fallback string. The schema-shrink commit will not need
  blast-radius cleanup beyond the validator.
- **Each `/api/generate` call is a separate Vercel function
  invocation.** No queue, no single-flight, no shared connection.
  Parallel pre-fetching is supported by the infrastructure as it
  stands today.

---

## 1.1 Generation pipeline map

End-to-end path from "user submits AI scenario prompt" to "scenario
displays in app."

### 1.1.1 Entry: builder form

`src/components/builder/BuilderForm.jsx:7` is the entry point. The
`go` callback at line 16 wraps the call:

```js
var scenario=await generateScenario(txt,cbMode,controller.signal,function(p){
  var contentChars=p.accumulated?p.accumulated.length:p.bytes;
  setProgress(function(prev){
    return{bytes:Math.max(prev.bytes||0,contentChars),message:p.message||prev.message};
  });
});
```

`controller` is an `AbortController` with a 600s fuse driven by
`GENERATE_TIMEOUT_MS` from `src/lib/ai/prompt.js:13`. On success the
scenario object is held in component state (`built`) until the user
chooses Return/Play in the post-build modal (`BuilderForm.jsx:51-58`).

### 1.1.2 Client → API: streaming fetch

`src/lib/ai/client.js:72` `generateScenario(txt, cbMode, signal, onProgress)`:

```js
var r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:signal,
  body:JSON.stringify({model:MODEL_ID,max_tokens:MAX_TOKENS,
    tools:[{type:"web_search_20250305",name:"web_search"}],
    system:[{type:"text",text:buildSystemPrompt(cbMode),cache_control:{type:"ephemeral"}}],
    messages:[{role:"user",content:userContent}],
    stream:true})});
```

- `MODEL_ID = "claude-sonnet-4-6"` (`prompt.js:1`)
- `MAX_TOKENS = 64000` (`prompt.js:8`)
- System prompt has a single ephemeral cache breakpoint
- Web search tool is enabled with a 0–2 search budget enforced
  textually in the prompt (`prompt.js:32`)
- The user content is `"Create pediatric scenario:\n\n" + txt + randomNameHint()`
  (`client.js:73`); `randomNameHint` injects a random first-letter
  preference and bans Marcus/Sarah/John (`client.js:5-8`)

### 1.1.3 Server: the proxy

`api/generate.js:4` `handler(req, res)` is the Vercel serverless
function (`maxDuration: 300`, `api/generate.js:2`). Behavior:

- Reads `mode` from `req.body.mode` (`api/generate.js:19`); defaults
  to `'scenario'`. **`mode` is purely a logging tag today** — the
  request body still carries the full system prompt and messages, so
  the server has no per-mode routing.
- Branches on `req.body.stream`. Streaming path (`api/generate.js:53–135`)
  pipes Anthropic's SSE bytes straight to the client and sniffs
  `input_tokens`, `output_tokens`, `web_search_requests`,
  `cache_creation_input_tokens`, `cache_read_input_tokens`,
  `stop_reason`, and the first 200 chars of `text_delta` for
  observability. Non-streaming path (`api/generate.js:138–203`)
  returns the full JSON in one shot.
- Forwards `thinking` and `output_config` only if the client sent
  them (`api/generate.js:43–44`); the `|| undefined` pattern keeps
  Anthropic happy because it rejects `thinking: null`.
- Logs every call to a Google Form via `logToGoogleForm` (`api/generate.js:205`).
- Default upstream `max_tokens` is `24000` if the client doesn't
  override (`api/generate.js:35`) — but the client always overrides
  via `MAX_TOKENS = 64000`.

### 1.1.4 Client: SSE parser → scenario

Back in `generateScenario` (`client.js:92–130`), the response body is
read line-by-line. Anthropic SSE events of type
`content_block_delta` with `delta.type === "text_delta"` accumulate
into a `accumulated` string. As the buffer grows, `checkPhase()`
(`client.js:99`) sniffs for first occurrences of top-level JSON
keys against the `PHASE_KEYS` table (`client.js:16–30`):

```js
var PHASE_KEYS=[
  {key:"\"patient\":",message:"Building patient profile..."},
  {key:"\"emsReport\":",message:"Drafting EMS handoff..."},
  ...
  {key:"\"debrief\":",message:"Writing teaching takeaways..."}
];
```

This is what drives the progress messages in the builder spinner.
**Note for the refactor:** the order/presence of these keys is part
of the UX contract today. If the schema changes (e.g., `learnMore`,
`reassessment`, `stabilizationSummary` are reordered), the spinner
copy ordering breaks silently — the user just sees a stale message.
The list is otherwise robust because every key match is one-shot via
`keysSeen[]`.

### 1.1.5 Client: parse + validate

Once the stream ends:

- `parseAccumulated(accumulated)` (`client.js:49–67`) strips Markdown
  code fences, decodes HTML entities, finds the largest balanced
  `{...}` slice, deep-cleans HTML tags from string values, and
  attempts `JSON.parse` with a comma-and-control-character recovery
  fallback. Throws `"Generated scenario was malformed"` or
  `"Generated scenario was incomplete"` on failure.
- `applyPostParseFixups(scenario, cbMode)` (`client.js:32–47`) runs:
  - `validateSchema` (`validate.js:20`) — hard schema check, throws
    if required fields missing.
  - `validateConsistency` (`validate.js:94`) — detects "marked
    abnormal but value within stated normal range" contradictions.
  - `applyAutocorrections` (`validate.js:162`) — flips `bad:false` on
    items the consistency check classified as `autocorrect`.
  - `validateCounts` (`validate.js:186`) — warns when assessItem
    counts fall short of the prompt's per-category requirements.
  - Surviving warnings are stashed on `scenario._validatorWarnings`
    for the dashboard toast.

### 1.1.6 Persistence and rendering

The scenario flows back to `BuilderForm.go()` → `setBuilt(scenario)`
→ post-build modal → `props.onDone(scenario, opts)`.

`onDone` was wired in `App.jsx:41` `addC()`:

```js
var addC=function(s,opts){
  addCustom(s);
  if(opts&&opts.play){play(s);}else{setView("dash");}
  if(s&&s._validatorWarnings&&s._validatorWarnings.length>0){...toast...}
};
```

`addCustom` is the Zustand action at
`src/stores/scenariosStore.js:21`. It prepends the scenario to the
`custom` array and immediately writes through to localStorage:

```js
addCustom: function(sc) {
  var u = [sc].concat(get().custom);
  set({ custom: u });
  saveS("bw-custom", u);
},
```

`saveS` (`src/lib/storage.js:2`) is a one-line `localStorage.setItem`
wrapper with try/catch.

`useScenarios()` (`src/hooks/useScenarios.js:16`) merges built-ins
and custom into a single visible list:

```js
var BUILT_IN=[SC1,SC2,SC3,SC4,SC5,SC6];
...
return{
  built:BUILT_IN,
  custom:custom,
  allScenarios:BUILT_IN.concat(custom),
  ...
};
```

Built-ins are never persisted (they ship with the bundle). Custom
scenarios are rehydrated on app start via `hydrate()` (`scenariosStore.js:14`)
which reads `bw-custom` from localStorage.

### 1.1.7 Player entry

`App.jsx:49` `play()` calls `usePlayerStore.start(sc)`
(`playerStore.js:27`), which initializes the `activeScenario`,
`stage`, `phaseIndex`, and clears `flags`/`assessHistory`/
`actionHistory`/`markedForReview`. The `ScenarioPlayer` component
then iterates phases at `ScenarioPlayer.jsx:32` (`var ph=sc.phases[pi]`)
and advances at `:56`:

```js
var afterA=function(){
  setFlags({});setShowFb(false);
  if(pi<sc.phases.length-1){var n=pi+1;setPi(n);setVit(sc.phases[n].vitals);setStage("phase");}
  else setStage("debrief");
};
```

The phase loop is N-phase generic; it's the **system prompt** that
hardcodes exactly two phases (Triage + Escalation) and a separate
`curveball` object. Multi-round support is not blocked by the
renderer (see §1.7).

---

## 1.2 Where `why` and `fb` are consumed

Five sites read `why`/`fb` content. All fail-soft on undefined.

### 1.2.1 Phase 1 deep-dive: `AssessPanel` → `WhyModal`

`src/components/player/AssessPanel.jsx:93–96`:

```js
function openWhy(e){
  if(e&&e.stopPropagation)e.stopPropagation();
  var why = (match && match.why) || "No additional explanation available for this finding.";
  setWhyTarget({_kind:"vital",label:t.label+" "+t.value,why:why,_match:match,cid:cid,_abnormal:isAbnormal});
}
```

`AssessPanel` only opens the Why? button after submit
(`showWhyBtn = showFb && isAbnormal`, line 91) and only on items
deemed truly abnormal. The `match.why` lookup goes through
`buildBadMap()` (`src/lib/scenarios/canonicalize.js:79`) which keys
every assessItem by canonical ID. Empty/missing `why` → placeholder
string, no crash.

`src/components/player/LabPanel.jsx:91`:

```js
var why = (match && match.why) || lab.why || "No additional explanation available for this finding.";
```

Two-source fallback (assessItem.why → lab.why → placeholder). Same
pattern in `BodySystemsView.jsx:96` for signs.

`src/components/shared/WhyModal.jsx:9–27` is the modal component.
Renders `body` (the `why` text) via `TextBlock`, plus an optional
"Mark for Review" footer that toggles `playerStore.markedForReview`.
The mark-for-review wiring carries `originalWhy` (the text the user
just saw) downstream into `expandMarkedItems`. Source: every
`<WhyModal item={...}/>` callsite passes `originalWhy:` in the item
prop (`AssessPanel.jsx:123`, `LabPanel.jsx:115`,
`BodySystemsView.jsx:116`, `SignCard.jsx:15`, `ActionPanel.jsx:58`).

### 1.2.2 Action popup: `ActionPanel` shows `fb`

`src/components/player/ActionPanel.jsx:144–150` is the fb-rendering
site (the popup we hotfixed today):

```js
{pop.ty==="m"&&pop.id==="mtpActivate"?(<div>
  <TextBlock text={MTP_CANONICAL} style={{...}}/>
  {pop.info.fb&&<div style={{...}}>
    <p>Why for this patient</p>
    <TextBlock text={pop.info.fb} style={{...}}/>
  </div>}
</div>):(<TextBlock text={pop.info.fb} style={{...}}/>)}
```

The MTP branch overlays a hardcoded canonical teaching block above
the AI's per-scenario `fb`; everything else just renders `pop.info.fb`.
`pop.info` is always synthesized (`ActionPanel.jsx:77–80`) — if the AI
didn't include an entry for that ID, a placeholder
`{ok:false,pri:null,fb:"This action's feedback was not generated..."}`
is created so the popup never crashes. **Lazy-fb generation will need
to recognize this synthesized fallback as "still missing" rather than
treating it as content.**

The Mark-for-Review payload built by `popMarkItem()`
(`ActionPanel.jsx:48–59`) carries `originalWhy: pop.info.fb` (or the
MTP canonical concatenation), which is later sent to
`expandMarkedItems`.

### 1.2.3 Recovery / "What Saved This Patient" screen

`src/components/player/ScenarioPlayer.jsx:34–45` builds the
`correctActions` list at render time:

```js
correctActions.push({name:label,toolId:e[0],...,fb:e[1].fb?e[1].fb.split(".")[0]+".":"",pri:e[1].pri,type:"tool"});
```

It takes only the **first sentence** of each `fb` (everything up to
the first period) and renders it on the recovery screen at
`ScenarioPlayer.jsx:236`:

```js
{visible&&act.fb&&<p style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4}}>{act.fb}</p>}
```

The reveal is staggered (one per 1.2s, `:45`). If `fb` is missing or
empty string, the row simply omits the descriptor — no crash.

`stabilizationSummary` is read at `ScenarioPlayer.jsx:243-245`:

```js
{sc.stabilizationSummary?<div style={{...}}>
  <TextBlock text={replaceIdsWithLabels(sc.stabilizationSummary)} style={{...}}/>
</div>:<p>All interventions complete. Patient is resting comfortably.</p>}
```

Falls back to a generic line. `replaceIdsWithLabels` is in
`src/lib/scenarios/labels.js` (33 lines) and just rewrites `prbc` →
"pRBCs" etc.

### 1.2.4 Debrief explainers (`debrief.explainers[].content` / `.tldr`)

`src/components/player/Debrief.jsx:264–274`:

```js
{sc.debrief.explainers.map(function(e,i){return(...
  <span style={{fontWeight:700,fontSize:13}}>{e.title}</span>
  ...
  <TextBlock text={e.content} style={{...}}/>
  {e.tldr&&<div>...{e.tldr}</div>}
)}
```

Three-explainer array; collapsible accordion; renders `content`
(long form) and optional `tldr`. If a scenario has no `explainers`
this iterates an empty array — no crash. The same shape exists for
`sc.curveball.teaches` (`Debrief.jsx:275–286`).

### 1.2.5 Lab Review section in debrief

`Debrief.jsx:236–262` walks every phase's `labs`, filters by
`l.critical && l.why`, and renders the `why` body in a collapsible
list. **Labs without `why` are silently dropped from this section** —
that's the only place where missing `why` produces a missing UI
element rather than a fallback. Acceptable today because the prompt
asks for `why` on every critical lab; under lazy generation we'd want
this section to either lazily fetch missing entries or render a
"loading" indicator.

### 1.2.6 Marked-for-Review section in debrief

`Debrief.jsx:149–168` is the deep-dive consumer. Per item:

```js
{open&&<div style={{padding:"0 10px 10px"}}>
  {deep
    ?<TextBlock text={deep} style={{fontSize:12,color:"#ddd",lineHeight:1.6}}/>
    :<TextBlock text={item.originalWhy||"No additional content available."} style={{fontSize:12,color:"#aaa",lineHeight:1.5}}/>}
</div>}
```

`deep` is from `deepDives[item.id]`. While the call is in flight or
on error, the original Why? content is shown — graceful degradation.

---

## 1.3 The existing `expandMarkedItems` infrastructure

This is the centerpiece of the refactor's reuse story. It does most
of what we need; we extend rather than rebuild.

**Location:** `src/lib/ai/client.js:212–262`.

**Signature:**

```js
export async function expandMarkedItems(scenario, items, signal){
  if(!Array.isArray(items)||items.length===0)return {};
  ...
}
```

Returns `Promise<Record<itemId, deepDiveText>>`. Throws on hard
failure; returns `{}` on empty input.

**Call site:** `src/components/player/Debrief.jsx:32–51`:

```js
useEffect(function(){
  if(markedForReview.length===0)return;
  if(deepStatus!=="idle")return;
  setDeepStatus("loading");
  var controller=new AbortController();
  expandMarkedItems(sc,markedForReview,controller.signal).then(function(map){
    setDeepDives(map);setDeepStatus("done");
  }).catch(function(err){
    if (err && err.name === "AbortError") return;
    console.error("Deep-dive expansion failed:",err);
    setDeepError(err.message||"Could not load deep dive");
    setDeepStatus("error");
  });
  return function(){controller.abort();};
},[markedForReview.length]);
```

Single fire on Debrief mount when there are marked items. StrictMode
abort is filtered out.

**Model and prompt:** uses the same `MODEL_ID` constant
(`claude-sonnet-4-6`) and the dedicated `buildDeepDivePrompt()`
(`prompt.js:25`), which emits a delimited plain-text format
(`###ITEM:<id>...###END` per `client.js:165–173`) with a JSON-fallback
parser (`client.js:175–209`) for older or drifting responses. Cache
breakpoint is set on the system prompt (`client.js:228`).

**`max_tokens`:** 8000 (`client.js:227`). No `thinking`, no
`output_config`. Non-streaming POST.

**Concurrency:** **Sequential, single-batch.** One fetch carries all
marked items in a single user message. Anthropic returns one response
containing every item's deep dive. There is no per-item parallelism
in the current implementation.

**Caching:** Deep dives are stored in component-local
`useState({})` at `Debrief.jsx:22`. They are **not** persisted to the
scenario object or to localStorage. Re-entering the debrief regenerates.
This is intentional for marked-for-review (per-playthrough state), but
it means `expandMarkedItems` is **not currently a source of saved
explanations** — we'd add that semantic in the refactor.

**Reusable pieces for lazy explanations:**
- The `/api/generate` proxy already accepts arbitrary `system` /
  `messages` / `mode` — no server-side change needed for a new
  `mode: "explanation"` variant.
- The delimited-text parser (`parseDelimitedDeepDives`) is robust to
  embedded asterisks, quotes, and em-dashes — the same problem class
  we'll hit with explanation prose.
- The id-normalization safety net (`client.js:250–259`) handles
  prefix mismatches like `lab:` vs raw IDs.
- The error path in `Debrief.jsx` (loading / success / error /
  retry) is a working pattern for any lazy-fetched content modal.

**What needs to change (preview, not prescription):**
- Switch this path to `claude-haiku-4-5-20251001` (or whichever Haiku
  is approved). This is a one-line change to a new constant; we
  should not silently flip the existing `MODEL_ID` because the main
  generator depends on it.
- Add per-item parallel fan-out for the lazy-explanation pre-fetch
  use case.
- Add a write-back path so generated explanations land on the
  scenario object and into `bw-custom`.

---

## 1.4 Parallel API call infrastructure

Short answer: **infrastructure supports parallel; the client does
not currently exercise it.**

### Server side

Each call to `fetch("/api/generate", {...})` is a new Vercel
serverless invocation. Vercel functions are isolated per-request —
no shared state, no shared connection. Concurrent invocations are
the default, not the exception. `api/generate.js` itself is
stateless: every call gets its own `apiKey` lookup, its own upstream
fetch, its own SSE pipe, its own logger call. There is no
in-process queue or rate limiter.

The single-instance assumption that *would* break is if we relied on
warm-connection reuse or response caching at the proxy layer — we
don't. The 5-minute Anthropic prompt-cache TTL applies per cache
breakpoint on the request body, not per-connection; concurrent
requests with the same `system[].cache_control` block hit the same
cache record on Anthropic's side.

### Client side

There is no request queue, single-flight pattern, or rate limiter
anywhere in the client. Every fetch in `client.js` is an unguarded
`fetch(...)` (lines 79 and 226). `BuilderForm` only ever has one
`generateScenario` call in flight (single textarea, single button),
so concurrency hasn't mattered.

### Browser limits

Browsers cap concurrent connections to a single origin at ~6. Lazy
pre-fetch will likely fan out to 6–12 concurrent Haiku calls per
phase entry. Two of those concurrent calls would saturate the
default per-host pool; the rest would queue at the browser's HTTP
layer. This isn't a blocker — the queue drains in seconds — but it
caps theoretical throughput.

### Anthropic-side rate limits

Workers and tier-2 Anthropic accounts are typically rate-limited by
RPM and TPM. A 12-call fan-out at ~2k input tokens each and ~600 out
each is well inside any reasonable tier ceiling, but worth verifying
once before shipping. (Open question: which API tier is the
production key on? Not visible from this repo.)

### `AbortController` is already plumbed

`generateScenario` and `expandMarkedItems` both accept a `signal`,
and the existing callers (`BuilderForm.jsx:17`, `Debrief.jsx:36`)
both wire one up. Multiple in-flight Haiku calls can share an
abort controller — useful for "user navigated away mid-fetch."

---

## 1.5 Built-in scenario compatibility

Where this section says "must" it means the refactor breaks
production if the constraint isn't honored.

### 1.5.1 No source flag exists today

There is no `source`, `origin`, `isBuiltIn`, `_meta`, `version`, or
similar field on any scenario. Built-ins are ordinary scenario
objects exported from `src/lib/scenarios/builtIn.js` and merged into
the visible list at `src/hooks/useScenarios.js:4`:

```js
var BUILT_IN=[SC1,SC2,SC3,SC4,SC5,SC6];
```

The `BUILT_IN` array reference is the only source of truth — and
it's only available to code that imports `useScenarios`. Anywhere
the renderer holds just a `scenario` object (e.g., `ScenarioPlayer`,
`AssessPanel`, `Debrief`), it cannot tell built-in from custom.

`src/components/scenarios/ScenarioCard.jsx:4` has an unrelated
hardcoded list:

```js
var BUILT_IN_IDS=["fussy-infant","vomiting-toddler","asthma-crisis"];
```

This is **stale** — only 3 of 6 built-ins. SC4 (`infant-septic-shock`),
SC5 (slug not yet read but visible at `builtIn.js:1040`), and SC6
(opioid OD, `builtIn.js:1612`) never get the "Clinically Reviewed"
badge in the dashboard. Pre-existing minor bug; flag and fix
opportunistically.

### 1.5.2 Behavior on undefined `why` / `fb`

Across every render path in §1.2, missing `why` or `fb` resolves to
either:
- A placeholder string (`"No additional explanation available..."`)
- A conditional render that hides the affected element (`{e.tldr && ...}`)
- A truthiness guard that excludes the row entirely (lab review)

There is no crash path. The validator (`validate.js:98`) explicitly
short-circuits on items missing `why`:

```js
if(!it||!it.label||!it.why)return;
```

So a scenario with empty `why` fields passes schema validation and
renders correctly — it just shows fallback strings. **This is the
foundation that makes a phased refactor safe**: we can ship the
"explanations are optional" change without touching consumers.

### 1.5.3 What the refactor must guarantee

- Built-in scenarios render exactly as they do today, with no
  network call attempted on entry. The lazy-fetch logic must
  branch on the source marker before issuing any request.
- The persistence layer must not write through to localStorage on
  built-in scenarios (built-ins are bundled as code, not stored).
- The prompt-version invalidation logic (§1.6.5) must skip
  built-ins entirely.

The simplest implementation: add `source: "builtin" | "ai"` to
every scenario at construction (built-ins set it at export time;
AI generation sets it at `applyPostParseFixups` time), and gate every
new lazy-fetch site on `sc.source === "ai"`.

---

## 1.6 Persistence model and explanation lifecycle

### 1.6.1 Where AI scenarios live today

`src/stores/scenariosStore.js:21` `addCustom`:

```js
addCustom: function(sc) {
  var u = [sc].concat(get().custom);
  set({ custom: u });
  saveS("bw-custom", u);
},
```

Direct prepend + `saveS("bw-custom", u)`. `saveS`/`loadS`
(`src/lib/storage.js:1-2`) are one-line `localStorage` wrappers.
Hydration on app start (`scenariosStore.js:14`) is `loadS("bw-custom", [])`.

The full scenario JSON is persisted, including the entire `actions`
block with every `fb` field, every `why` on signs/labs/assessItems,
and every `explainers[].content`. **The current storage shape can
hold lazy-generated explanations as-is** — no schema migration
needed for the persistence layer itself.

### 1.6.2 Sharing path

`useScenarios.js:6–14` defines `minifyScenario` + `encodeScenario`.
The minifier truncates `narrative` to 300 chars, `fb` to 120 chars,
and explainer `content` to 200 chars. If the URL exceeds 4000 chars
the share fails with a "too large" toast (`useScenarios.js:25-28`).

Implication: shared scenarios already drop most `fb` body and most
explainer bodies. The receiving user gets a "skeleton" link today.
The lazy refactor naturally aligns with this — a shared scenario
would simply need to lazy-fetch its own explanations on first play
in the new browser. (Note: this assumes the imported scenario's
`source` is correctly set to `"ai"` in the receiving session; the
encoded payload doesn't currently carry source metadata.)

### 1.6.3 Marked-for-review (`expandMarkedItems`) lifecycle

Per §1.3: lives in `Debrief` component-local state. Discarded on
unmount. Regenerated on every Debrief mount when `markedForReview`
is non-empty. **This matches the user's stated requirement** —
mark-for-review is per-playthrough session state, not content.

### 1.6.4 What happens on regeneration with the same prompt

The user's prompt is hashed only by the model itself (no client-side
dedupe). Same prompt twice produces two distinct scenarios with
different IDs (the AI generates a slug from its title, and titles
vary). Both end up in `bw-custom` with the user able to delete
either. There's no caching on prompt text.

### 1.6.5 Proposed lifecycle for lazy explanations

Where to write generated explanations:

**Recommend writing to the scenario object itself**, in-place,
matching the existing schema. Concretely: a Haiku call for the
"Phase 1 lab WBC explanation" should set
`scenario.phases[0].labs[<wbc-index>].why = <text>`, then
`saveS("bw-custom", currentList)` (the standard write-through).
This keeps the consumer code paths unchanged — `LabPanel.jsx` etc.
already read `lab.why`. No schema fork; no parallel store keyed by
ID; no migration concern for non-lazy code.

The alternative (parallel store keyed by `<scenarioId, itemId>`) has
zero advantages over in-place mutation given that the consumer code
is already shape-tolerant and storage is per-scenario JSON anyway.
The only argument for a parallel store would be "we want to update
the prompt version and refresh explanations independently," but
that's better handled by a top-level `explanationVersion` field
(see invalidation below) than by structural separation.

When to write:

- **Each parallel pre-fetch resolves → write its slot, save.**
  Mid-flight tab close = partial save with whatever resolved before
  unload. Next session resumes lazy fetch for the slots that are
  still empty. This is correct: every consumer already treats
  missing `why` as "render the placeholder."
- **No "write on completion" gate.** Don't hold all 12 explanations
  until they all finish; an early bail loses everything.

Size impact:

- SC6 (opioid OD) is ~50KB serialized including all `why` and `fb`.
- 50 saved AI scenarios at full content = ~2.5MB of localStorage.
  Most browsers offer 5–10MB per origin; this is comfortable.
- localStorage has no streaming write; very large arrays serialize
  fully on every `saveS`. With 50 scenarios at 50KB each, every
  `addCustom`/explanation-write does a 2.5MB `JSON.stringify` +
  `setItem`. That's still <100ms on any laptop, but flag for later
  if the average user accumulates >100 scenarios.

Failure modes:

- Network error mid-pre-fetch → that one slot stays empty; user
  sees placeholder when they click. Acceptable.
- Vercel / Anthropic 5xx → same.
- User closes tab during pre-fetch → resolved-so-far slots are
  saved; the rest are picked up on next play.
- AI returns malformed deep-dive → today the parser falls back to
  delimited→legacy JSON. For lazy explanations we'd prefer
  delimited only (no JSON fallback ambiguity); on parse failure we
  log + skip that slot, leaving placeholder.

Invalidation:

- Add `scenario.explanationVersion: number` (or per-field versions
  if we want finer-grained control). When the explanation prompt is
  bumped, increment a code-side `CURRENT_EXPLANATION_VERSION`. On
  scenario play, if `sc.explanationVersion < CURRENT_EXPLANATION_VERSION`,
  treat existing explanations as stale and re-fetch (or at least
  mark them re-fetchable).
- Alternative: per-explanation hash of the explanation prompt. More
  precise, more complex. Default to integer versioning unless we
  have a specific reason to be granular.
- Built-ins: opt out entirely (their `why`/`fb` text is hand-edited
  and shouldn't be invalidated by AI prompt changes).

Default behavior: **save once, render forever.** Regeneration is
explicit (prompt-version bump on the engineer's side, or an
explicit "refresh explanations" button somewhere — not in scope for
this refactor).

---

## 1.7 Lazy rounds: structural design

### 1.7.1 Where the renderer already supports N phases

`ScenarioPlayer.jsx:32` reads `var ph=sc.phases[pi];`. The phase
advance at `:56` uses `pi<sc.phases.length-1` — generic. The
"Phase X/Y" badge at `:73` uses `sc.phases.length`. Curveball is a
sibling object, not a phase, and lives at `sc.curveball` (treated
specially throughout: `:40`, `:47`, `:135`, `:155`).

**The renderer does not assume two phases.** A 3- or 4-phase
scenario would render correctly today, modulo the curveball-as-
sibling structure.

### 1.7.2 Where the system prompt assumes two phases

`prompt.js:32` (system prompt) hardcodes:

> Structure: "phases":[{"id":"triage","name":"Triage",...},{"id":"escalation","name":"Escalation",...}]

and the curveball is a separate top-level object. To support
multi-round we'd need to:

- Restructure the `phases` description to allow N phases with
  shared schema.
- Decide whether "curveball" stays as a sibling or becomes "phase
  N+1 if curveball mode." The latter is cleaner schema; the former
  matches existing player code paths (`isCb=stage.startsWith("cb")`,
  `ScenarioPlayer.jsx:61`).

### 1.7.3 Other coupling points

- `PHASE_KEYS` table (`client.js:16–30`) — if the schema gains
  `phases[2]`, `phases[3]`, the per-key progress sniffing won't
  emit a new message per round. We'd want a regex that matches
  `"phaseId":"reassess1"` etc., or accept that phase 2+ shows
  the same message as phase 1.
- Lab-review section in Debrief (`Debrief.jsx:236–262`) iterates
  `sc.phases.forEach`, so it already covers N phases.
- `correctActions` builder in `ScenarioPlayer.jsx:34–43` iterates
  `sc.phases.forEach`, also generic.
- `validateCounts` in `validate.js:189–199` only checks the **first**
  phase (`if(idx===0)`). For multi-round we'd extend to per-round
  expectations.

### 1.7.4 Recommendation: ship lazy explanations first (Option B)

Reasons:
1. **Lazy explanations alone solves the immediate timeout.** 290s
   today → ~120–150s with skeleton-only. That's the production fire.
2. **Multi-round and lazy explanations are orthogonal.** The
   "fewer tokens per round" change is independent of "how many
   rounds." Bundling them couples two risks unnecessarily.
3. **The renderer is N-phase-ready already** — we don't need to
   ship multi-round to "unlock" anything; the work for multi-round
   is on the prompt side (and on the lazy-rounds background-fetch
   scheduler), neither of which depends on the explanation refactor.
4. **Validating lazy explanations on a known-good single-round
   scenario is much simpler than validating it inside a brand-new
   multi-round scenario.** If lazy explanations break, we want to
   debug "is the why missing?" not "is round 2 missing because we
   didn't kick off the fetch, or because the explanation fetch
   failed?"

So: lazy explanations is a standalone refactor that lands in 4–5
incremental commits. Multi-round is a **separate later project**
that builds on the lazy foundation and adds a per-round skeleton
generator + background scheduler.

The user's plan deck stacks the two correctly ("both stack" /
"without both, multi-round is infeasible"); the recommendation is
about sequencing, not coupling.

---

## 1.8 Risk surface (full blast radius)

Every site that reads `why` or `fb` is undefined-tolerant today.
Listing for completeness; none of these require pre-emptive fixing.

| File:line | Field | Behavior on missing |
|---|---|---|
| `validate.js:98` | `assessItem.why` | `if(!it||!it.label||!it.why)return;` (skips consistency check) |
| `validate.js:101` | `assessItem.why` | Threshold parsing — early return if no why |
| `AssessPanel.jsx:95` | `match.why` | Falls back to placeholder string |
| `LabPanel.jsx:91` | `match.why \|\| lab.why` | Two-source fallback → placeholder |
| `BodySystemsView.jsx:96` | `match.why \|\| s.why` | Two-source fallback → placeholder |
| `BodySystemsView.jsx:64` | `s.why` | `isAbnormal = !!s.why` in read-only mode (used for legacy callers; affects abnormality color, not crash) |
| `BodySystemsView.jsx:92` | `s.why` | Conditional Why? button render |
| `SignCard.jsx:11` | `s.why` | Conditional Why? button render |
| `Debrief.jsx:165` | `item.originalWhy` | Falls back to `"No additional content available."` |
| `Debrief.jsx:181` | `it.why` | Conditional accordion expander |
| `Debrief.jsx:183` | `it.why` | Conditional render |
| `Debrief.jsx:200` | `it.why` | Conditional render |
| `Debrief.jsx:238` | `l.critical && l.why` | **Filter — labs without why are excluded from Lab Review section** |
| `Debrief.jsx:255` | `entry.lab.why` | Always present here because of the filter above |
| `ActionPanel.jsx:56` | `pop.info.fb` | `originalWhy = pop.info.fb || ""` — empty string passed to deep-dive |
| `ActionPanel.jsx:79–80` | synthesized `fb` | When AI omits `actions.<id>` entirely, ActionPanel synthesizes `fb:"This action's feedback was not generated for this scenario..."`. **Lazy generation needs to recognize this synthesized string and trigger a fetch** rather than treating it as content. |
| `ActionPanel.jsx:146` | `pop.info.fb` | Conditional MTP-context render |
| `ActionPanel.jsx:148` | `pop.info.fb` | Inside conditional → safe |
| `ActionPanel.jsx:150` | `pop.info.fb` | TextBlock can render empty string |
| `ScenarioPlayer.jsx:37` | `e[1].fb` | `e[1].fb?e[1].fb.split(".")[0]+".":""` — guarded |
| `ScenarioPlayer.jsx:38` | `e[1].fb` | same |
| `ScenarioPlayer.jsx:41-42` | `e[1].fb` (curveball) | same |
| `ScenarioPlayer.jsx:53` | `it.why` | `why:it.why\|\|""` — empty string |
| `ScenarioPlayer.jsx:236` | `act.fb` | `{visible&&act.fb&&...}` — conditional render |
| `useScenarios.js:7` | `obj[k].fb` | minifier — used only on share path |
| `Debrief.jsx:264` (and similar) | `e.content`, `e.tldr` | TextBlock + conditional |

The only behavioral consequence of stripping explanation text from
generation is the **Lab Review section in `Debrief.jsx:238`** —
labs would silently drop out of that section until lazy fetch fills
their `why`. Acceptable because the user reaches the debrief screen
with all explanations already populated (background pre-fetch ran
during gameplay), but worth a "show loading rows for missing labs"
treatment if we want to be defensive.

The only **code risk** (not field risk) is the `ActionPanel.jsx:79`
synthesized fallback. Lazy-fb logic must be aware that `pop.info.fb
=== "This action's feedback was not generated for this scenario..."`
means "synthesized placeholder, fetch real content," not "real
content present."

---

## 1.9 Proposed phasing

Five commits. Each independently shippable, reversible, and
verifiable on built-in SC6 (opioid OD) before next one starts.

### Phase 5.1 — Source marker (purely additive)

Add `source: "builtin" | "ai"` to every scenario.

- `builtIn.js`: append `source:"builtin"` to SC1–SC6.
- `client.js applyPostParseFixups`: set `scenario.source = "ai"`
  before returning.
- `addCustom` in `scenariosStore.js`: defensive check that
  `sc.source` is set; log a warning if not (catches share-link
  imports that pre-date this change).
- `decodeScenario` in `useScenarios.js`: default to `"ai"` if
  decoded scenario has no `source` (back-compat for shared links
  generated before this commit).

**Doesn't change:** any behavior. The field is unused by every
consumer. This commit is the load-bearing prerequisite for
everything else but produces no user-visible change.

**Verification:** SC6 still plays end-to-end. `bw-custom` round-trips
through localStorage. Shared link generated post-deploy is decoded
correctly. `console.log(sc.source)` shows the right value at every
play entry.

**Reversibility:** trivial revert. No data loss.

### Phase 5.2 — Lazy-explanation endpoint (additive Haiku path)

Introduce a new client function (`fetchExplanations` or similar)
that:
- Hits `/api/generate` with `mode: "explanation"` and `model:
  HAIKU_MODEL_ID` (new constant; do not flip `MODEL_ID`).
- Takes a list of `{id, label, type, context}` and returns
  `Record<id, whyText>`.
- Uses delimited-text format (reuse `parseDelimitedDeepDives`).
- Uses prompt caching on the system prompt.

Define `HAIKU_MODEL_ID = "claude-haiku-4-5-20251001"` (or current
Haiku 4.5 ID — verify before commit). Add an `explanationPrompt`
builder in `prompt.js` parallel to `buildDeepDivePrompt`.

**Doesn't change:** scenario generation, marked-for-review,
rendering. `expandMarkedItems` stays on Sonnet. This commit
introduces capability that nothing in the app calls yet.

**Verification:** unit-call the new function from a smoke-test
harness (`smoke-test.mjs` style) with hand-built input. Confirm
parallel calls succeed, response format parses, error paths return
sensible objects.

**Reversibility:** revert just removes dead code. No data on disk.

### Phase 5.3 — Pre-fetch on phase entry (still no schema change)

Wire the new endpoint into `ScenarioPlayer` such that on
`stage === "assess"` (or "act"), if `sc.source === "ai"`, fan out
pre-fetch calls for every assessItem/lab/sign/action that has
**either** missing `why`/`fb` **or** the synthesized fallback string.

- Resolve in parallel with `Promise.allSettled`.
- On each resolution, mutate `sc.<path>.why = text` (in place) and
  `addCustom(sc)` again to write through (or call a new
  `updateScenario(scId, mutator)` action).
- Guard against double-fetch if user navigates back/forward.
- If `sc.source !== "ai"`, this entire path is a no-op (built-ins
  unaffected).

This is the riskiest commit because it mutates persisted scenarios
mid-play. Mitigations:
- The mutation only writes new `why`/`fb` text; it never overwrites
  existing content.
- The write-through is per-resolved-slot, not per-batch.
- A failed fetch leaves the slot empty; the consumer falls back to
  the placeholder string, which is the existing behavior.

**Doesn't change:** what the scenario generator outputs. AI
scenarios still come back with full `why`/`fb` in this commit —
the pre-fetch finds nothing to do because everything is populated.
The pre-fetch is a no-op until phase 5.4 ships, but **that's
deliberate**: we want the wiring to bake in production traffic
before we start relying on it.

**Verification:** play SC6 (built-in) — no network calls. Generate a
new AI scenario, then synthetically delete a lab's `why` in the
React devtools and start playing — confirm pre-fetch fires on phase
entry and the deleted `why` reappears in localStorage. Inspect
network panel for parallel Haiku calls.

**Reversibility:** revert removes the pre-fetch code path. Already-
saved scenarios still have full content (we wrote, we didn't
delete).

### Phase 5.4 — Trim the main prompt's explanation requirements

Now the load-bearing change. Edit `prompt.js buildSystemPrompt()` to:
- Make `why` optional everywhere (signs, labs, assessItems).
- Make `fb` optional on action entries (or shrink to a one-sentence
  rationale only).
- Make `explainers[].content` optional or shrink.
- Keep `stabilizationSummary`, `narrative`, `finding`, `label`,
  `cc`, `description`, `emsReport`, `learnMore`, vital numbers, lab
  values, `bad`/`ok`/`pri` flags, and the schema skeleton.

Do **not** touch the existing pre-output verification block — leave
clinical-accuracy guardrails in place. The change is "don't write
the long-form `why` text now; we'll fetch it lazily."

Drop `MAX_TOKENS` to a calibrated lower value (somewhere around 32k,
with margin) once token usage is verified.

After ship, the smoke test should show:
- Output tokens: ~6–8k (down from 16k).
- Wall-clock: ~120–150s (down from 290s).
- Stop reason: `end_turn`, never `max_tokens`.
- Pre-fetch on phase entry now does real work — Haiku calls return
  the `why` content the main prompt no longer produces.

**Doesn't change:** built-in rendering (no AI calls), persistence
shape, marked-for-review.

**Verification:** smoke-test SC1-style scenario end-to-end. Time the
generation. Time the phase 1 entry (with its parallel Haiku
pre-fetch). Click into the labs that landed without `why` and
confirm content appears within 1–3s. Re-enter the scenario; confirm
the saved `why` text loads from localStorage with no network call.

**Reversibility:** revert restores the original prompt. Existing
saved AI scenarios continue to render their pre-trim content (we
never removed anything; we only stopped writing as much going
forward). Generation reverts to ~290s — the old failure mode, not a
new one.

### Phase 5.5 — Cleanup, telemetry, edge cases

- Add `explanationVersion: 1` to AI scenarios at generation time
  (for §1.6.5 invalidation later — present but unused initially).
- Add per-call telemetry: number of pre-fetch slots, hit/miss
  ratios, fetch latency p50/p95.
- Fix the stale `BUILT_IN_IDS = ["fussy-infant",...]` in
  `ScenarioCard.jsx:4` — use `sc.source === "builtin"` instead.
- Decide on UX for the lab-review section when explanations are
  still missing post-debrief (loading rows? skip?). Default:
  pre-fetch on debrief mount as a backstop.
- Document the new pipeline in CHANGELOG.

**Verification:** SC1–SC6 all play correctly with the
"Clinically Reviewed" badge now appearing on all six. AI scenarios
generated post-deploy never re-fetch existing content. Telemetry
shows pre-fetch p95 < 8s.

**Reversibility:** trivial.

---

## Summary of recommendations

1. **Ship lazy explanations as a standalone refactor.** Multi-round
   is a separate later project. (§1.7)
2. **Reuse the `expandMarkedItems` infrastructure** (delimited
   parser, Vercel proxy, error handling) — but introduce a Haiku
   path under a new `HAIKU_MODEL_ID` constant rather than flipping
   the existing `MODEL_ID`. (§1.3, §1.9)
3. **Add `source: "builtin" | "ai"`** as the first commit. Every
   subsequent change branches on it. (§1.5, §1.9.1)
4. **Write explanations in place** on the scenario object and
   write-through to `bw-custom` per resolved slot. No parallel
   store. No "save on completion" gate. (§1.6.5)
5. **Default to "save once, render forever."** Treat explanation
   regeneration as the exception, gated by `explanationVersion`. (§1.6.5)
6. **Phase the prompt-trim commit (5.4) last.** Until then, lazy
   pre-fetch is dead code paying observability tax — but it's *baked
   in production* by the time we rely on it. (§1.9)

---

## Open questions

These need answers before phase 5.2 ships. Not blockers for the
investigation, but needed for the implementation plan.

1. **Anthropic API tier.** Is the production key on a tier whose
   RPM/TPM ceilings comfortably absorb 6–12 parallel Haiku calls
   per phase entry? (Not visible from this repo.)
2. **Haiku 4.5 model ID.** `claude-haiku-4-5-20251001` is the
   currently-known stable ID. Confirm against the deployed
   environment / approved-model list before pinning the constant.
3. **Prompt cache strategy on parallel calls.** A 12-call fan-out
   with the same `system[].cache_control` block: do we get 12
   `cache_creation` events or 1 + 11 `cache_read`? Empirically
   verify before relying on cache savings in cost projections.
4. **"Lab review section in debrief" UX when explanations are
   still loading.** Pre-fetch on debrief mount as backstop, or
   render a loading state per row, or both?
5. **Mark-for-review interaction with lazy explanations.** Today
   `expandMarkedItems` is sent the user's `originalWhy` (the
   already-rendered text). If the originally-rendered text was a
   placeholder ("No additional explanation available..."), the
   deep-dive prompt has no anchor. Should the deep-dive path wait
   for the lazy explanation to land before being callable, or fall
   back to a different prompt that doesn't require `originalWhy`?
6. **Token analysis claim.** The 8.5–10K-of-16K explanation share
   was provided as background. We should validate that breakdown
   on SC6 specifically (it's hand-authored, so a token count of
   the `why` + `fb` + `content` substrings against the whole would
   take ~10 minutes). Useful for grounding the post-trim target.

End of report. Stop and review.
