# Block Ward — Structural Audit

_Generated 2026-04-22. Target: `/Users/openclaw/Documents/blockward`. Deploy: `blockward-lovat.vercel.app`._

This audit describes the codebase as it stands. It is deliberately blunt. The goal is a shared map before any restructuring begins.

---

## 1. Project Map

### File tree (app code only)

```
blockward/
├── api/
│   └── generate.js               # Vercel serverless proxy → Anthropic Messages API + Google Forms logger
├── src/
│   ├── main.jsx                  # 4-line React entry; mounts <App/> in <React.StrictMode>
│   └── App.jsx                   # THE ENTIRE APP. 1549 lines. All 22 components + 3 hardcoded scenarios.
├── index.html                    # Vite shell. Inline global CSS + viewport meta (see §7)
├── vite.config.js                # 4-line Vite + @vitejs/plugin-react config
├── package.json                  # see below
├── package-lock.json
├── .gitignore                    # node_modules, dist, .vercel
├── CHANGELOG-2026-03-24.md       # free-text change log; not loaded at runtime
├── Block_Ward_Nursing_Education_Proposal.md/.pdf   # pitch material (skipped per brief)
└── pitch-assets/                 # images/screenshots (skipped per brief)
```

There is no `tests/`, no `public/`, no `.eslintrc`, no `.prettierrc`, no `tsconfig.json`, no `CLAUDE.md`, no `README.md`. No CI config.

### npm dependencies

**Production:**
- `react` `^18.2.0` — UI runtime
- `react-dom` `^18.2.0` — DOM renderer
- `lucide-react` `^0.577.0` — icon set; imported directly in `App.jsx:2` (31 icons pulled in)

**Dev:**
- `vite` `^5.0.0` — build/dev server
- `@vitejs/plugin-react` `^4.0.3` — React Fast Refresh

That is the entire dependency footprint. There is no router, no state library, no forms library, no testing harness, no linter, no type system, no Supabase/PostgREST/auth SDK, no analytics SDK, no `@anthropic-ai/sdk` (the API is called with raw `fetch`).

---

## 2. Component Architecture

`main.jsx` renders one component: `<App/>`. Everything below is defined in `src/App.jsx`.

Tree:

```
App                                              (root, line 1337)
├── (view="dash") inline JSX — dashboard + sidebar + toasts + delete modal
├── (view="play") ScenarioPlayer                  (line 952)
│   ├── PatientView                               (line 889)
│   │   ├── SignCard × N                          (line 547)
│   │   └── PatientSVG                            (line 642)
│   ├── Monitor                                   (line 518; uses <canvas> via ecgPt/plPt at 516–517)
│   ├── BodySystemsView                           (line 556)
│   ├── LabPanel                                  (line 601)
│   ├── ActionPanel                               (line 907)
│   ├── TextBlock                                 (line 5)
│   └── ToolIcon / MedIcon                        (lines 19, 38)
└── (view="build") Builder                        (line 1264)
    └── TextBlock
```

For each:

| Component | Line | Props | Owned state (`useState`) | Side effects |
|---|---|---|---|---|
| `TextBlock` | 5 | `text`, `style` | — | pure render |
| `ToolIcon` | 19 | `name`, `size`, `color` | — | pure render (inline SVGs) |
| `MedIcon` | 38 | `type`, `size`, `color` | — | pure render |
| `Monitor` | 518 | `vitals`, `flash` | — | `useEffect` (530) drives canvas via `requestAnimationFrame`; cleanup on unmount. Dep array is `[vitals.hr]` only, so rr/spo2 changes don't redraw the trace. |
| `SignCard` | 547 | `s`, `delay` | — | pure render |
| `BodySystemsView` | 556 | `signs` | — | pure render; internally infers system from keyword match |
| `LabPanel` | 601 | `labs` | `openLab` | none |
| `PatientSVG` | 642 | `status`, `rr`, `ageGroup`, `sex`, `visuals`, `emotion` | — | SVG with SMIL `animateTransform`; age/sex/visual keyword matching all inline (lines 657–694) |
| `PatientView` | 889 | `status`, `rr`, `signs`, `ageGroup`, `sex`, `visuals`, `emotion` | — | pure render; splits signs into two columns |
| `ActionPanel` | 907 | `tools`, `meds`, `actions`, `onDone` | `sel`, `pop` | none directly; injects `<style>` inline |
| `ScenarioPlayer` | 952 | `sc`, `onExit`, `onDone` | 10 useStates (`stage`, `pi`, `flags`, `showFb`, `cbDone`, `score`, `expI`, `tldrOpen`, `shake`, `vit`, `recStep`) | one `useEffect` (980) for the recovery-screen reveal interval; uses `useCallback` (982) for `trigCb` |
| `Builder` | 1264 | `onDone`, `onBack` | `txt`, `busy`, `mi`, `err`, `cbMode` | `useEffect` (1272) rotates "Assembling blocks…" messages; `go` does the `fetch('/api/generate')` with `AbortController` |
| `App` | 1337 | — (default export) | `view`, `act`, `cust`, `prog`, `ok`, `shareMsg`, `sidebar`, `sideTab`, `delConfirm` | one big `useEffect` (1374) hydrates from localStorage and imports `?shared=…` scenarios from the URL |

### File overline flags

- **`src/App.jsx` — 1549 lines.** This single file holds: two localStorage helpers, two icon components, two dictionary constants (TOOLS, MEDS), two helper functions (`guessAge`, `guessSex`), **three 120–130-line hardcoded scenario objects** (SC1 line 117, SC2 line 254, SC3 line 387), nine UI components, and the `App` root. It should be split aggressively — probably `src/scenarios/{fussy-infant,vomiting-toddler,asthma-crisis}.js`, `src/components/`, `src/lib/storage.js`, `src/lib/share.js`, `src/builder/{prompt.js,parser.js,Builder.jsx}`, `src/player/ScenarioPlayer.jsx`. Nothing about the domain requires this to be one file.
- **`ScenarioPlayer` (lines 952–1263, ~312 lines) and its `stage==="debrief"` branch (lines 993–1085, ~93 lines inline)** — the debrief renderer is really its own screen. Same with the `stage==="recovery"` and `stage==="assess"` branches.
- **The Builder `go` function (lines 1275–1311)** — 37 lines of fetch + parse/fallback logic embedded in a component. Belongs in its own module.
- **The system prompt** is a **single-line string expression ~6,500 chars long** at `src/App.jsx:1280`. See §5.

---

## 3. State Management

### Where state lives

There is no Context, no Redux/Zustand/Jotai, and no router. Every piece of shared state lives on `App` and is drilled down through props. Three screens (`dash`, `play`, `build`) are switched via `view` string on `App`. That is fine given the app's size; it is not a blocker.

Within `ScenarioPlayer`, there are 10 `useState` hooks tracking phase, stage, flags, scores, vitals, shake animation, expander indices, recovery-step index, etc. Several would be cleaner as a single reducer keyed by `stage`.

**Worth calling out:** `App` computes `correctActions`, `reviewSteps`, `allLabs`, etc. inside render for the debrief view (lines 969–979, 994–1008, 1039–1042). These are derived; they're recomputed every render. Not a perf issue at this scale, but it obscures what's state vs. derived.

### localStorage keys

Both keys are written only from `App.jsx` via the `saveS` helper (`App.jsx:4`) and read via `loadS` (line 3). `saveS` silently `console.error`s on quota exceeded — there is no user-visible failure mode if storage is full.

| Key | Shape | Written by | Read by |
|---|---|---|---|
| `bw-custom` | `Scenario[]` — full scenario objects (see §4). After `minifyScenario`, fields are trimmed, but when saved to localStorage they are **the scenario exactly as returned by the AI builder (not minified)**. Only the shared-URL path minifies. | `addC` (1400), `delC` (1401), `clearAll` (1402), share-import branch (1388) | `useEffect` on mount (1375) |
| `bw-prog` | `Record<scenarioId, {done: boolean, best: number /* 0..1 */, n: number /* attempts */}>` | `done` (1399), `delC` (1401), `clearAll` (1402) | `useEffect` on mount (1377) |

No schema versioning. If the scenario shape ever changes, every existing `bw-custom` entry will break silently — the code relies on `sc.id && sc.phases` as the only structural check (1383, 1308).

### Misplaced / duplicated state

- **Dashboard stats (`nd`, `totalAttempts`, `avgScore`) are recomputed inside `App`'s render body (lines 1405–1410) and again inside the sidebar "My Stats" tab.** They're identical computations; a tiny `useMemo` or a helper would stop the duplication.
- **`score` is tracked in `ScenarioPlayer` as `{c, t}` where `t` is supposed to be the total items but is only incremented from `ph.assessItems`** (line 984). In the current flow, **only Phase 1 ("triage") runs the `stage==="assess"` path** — phases with interventions go `phase → act`, skipping assess. So `score.t` only reflects triage findings. That's probably not intentional; either assess should run on every phase without interventions, or `t` should also count action choices.
- **`cbDone` gates the curveball trigger but is never reset** when a player exits and re-enters a scenario — not a bug because `ScenarioPlayer` unmounts/remounts on exit, but worth noting if that ever changes.
- **Dashboard has four overlapping "exit this modal" patterns** (`delConfirm`, `sidebar`, `shareMsg`, `pop` in `ActionPanel`) with four different implementations.

---

## 4. Data Model

### Full `Scenario` shape

Hardcoded examples: `SC1` (line 117), `SC2` (line 254), `SC3` (line 387). The AI prompt at `App.jsx:1280` defines the same shape. Fields:

```js
{
  id: string,                    // slug, e.g. "fussy-infant"
  title: string,
  tier: 1 | 2 | 3,               // difficulty; used only for the badge on the dashboard
  icon: string,                  // emoji, used as the card icon
  tagline: string,
  description: string,
  visuals: string[],             // keyword array read by PatientSVG: "wheelchair", "hives",
                                 //   "cast left arm", "head bandage", "nasal cannula", etc.
                                 //   Not in SC1/SC2/SC3 — only emitted by the AI builder.
  patient: {
    ageLabel: string,            // e.g. "6 months", "8 years"
    weightKg: number,
    sex: "Male" | "Female",
    cc: string,                  // chief complaint
    history: string              // multi-sentence HPI
  },
  norms: {                       // age-appropriate vital ranges for the Monitor's color coding
    hr: [min, max],
    rr: [min, max],
    sbp: [min, max],
    dbp: [min, max],
    spo2: [min, max],
    temp: [min, max]             // Celsius
  },
  phases: Phase[],               // always 2 in SC1–SC3: "triage" + "escalation"
  curveball: Curveball | null,   // single optional mid-game twist
  debrief: {
    summary: string,
    explainers: Explainer[]      // 2–3 items
  }
}

Phase = {
  id: "triage" | "escalation" | string,
  name: string,
  narrative: string,             // 4–6 sentences
  vitals: Vitals,
  signs: Sign[],                 // 4–6 items
  assessItems: AssessItem[] | null,  // required on triage, null on escalation in SC1–SC3
  labs: Lab[],
  tools: ToolId[] | null,        // null on assessment-only phases
  meds: MedId[] | null,
  actions: {
    tools: Record<ToolId, ActionFeedback>,
    meds:  Record<MedId,  ActionFeedback>
  } | null
}

Curveball = Phase-ish & {
  name: string,                  // "Seizure During Resuscitation", etc.
  narrative: string,
  vitals, signs, labs, tools, meds, actions,  // same shapes as Phase
  teaches: Teach[]               // 2–3 deep-dive cards, shown in debrief
}

Vitals = { hr, rr, sbp, dbp, spo2, temp, cap }  // cap = capillary refill in seconds

Sign = {
  label: string,                 // "Mottling"
  detail: string,                // "Reticular purplish pattern, bilateral lower extremities"
  pos: "head" | "face" | "body", // currently unused by layout, kept on each sign
  sys?: string                   // "Cardiovascular", "Neuro", etc. BodySystemsView falls back to keyword match if absent
}

AssessItem = {
  id: string,                    // unique within phase
  label: string,                 // "HR 178"
  cat: "vital" | "lab" | "clinical",
  bad: boolean,                  // true = should flag; false = red herring
  why: string                    // explanation revealed after submit
}

Lab = {
  name: string,                  // "WBC"
  value: string,                 // "18.2"  — always a string
  unit: string,
  ref: string,                   // reference range, e.g. "6.0-17.5"
  critical: boolean,
  explain?: string               // required when critical:true, shown on tap
}

ActionFeedback = {
  ok: boolean,                   // was this action correct for this phase?
  pri: number | null,            // priority (1, 2, 3…) for correct actions — null means OK but not required
  fb: string                     // teaching feedback, shown in popup
}

Teach    = { title: string, content: string, tldr: string }
Explainer = { title: string, content: string, tldr: string }

ToolId = keyof typeof TOOLS  // fixed set of 13 IDs defined at App.jsx:47
  = "glucometer" | "stethoscope" | "bvm" | "suction" | "o2mask" | "ivKit" | "defib"
  | "thermometer" | "capRefill" | "needleDecomp" | "pupilCheck" | "epiPen" | "peakFlow"

MedId = keyof typeof MEDS  // fixed set of 17 IDs defined at App.jsx:62
  = "lorazepam" | "phenytoin" | "epinephrine" | "dextrose" | "nsBolus" | "ceftriaxone"
  | "acetaminophen" | "albuterol" | "atropine" | "adenosine" | "hypertonic"
  | "mannitolMed" | "levetiracetam" | "diphenhydramine" | "methylpred"
  | "famotidine" | "racemicEpi"
```

### Create / Store / Load / Edit / Delete

- **Create (built-in):** there is no authoring UI — the three scenarios are checked in as JS literals in `App.jsx`. Editing them requires editing the source file.
- **Create (AI):** `Builder.go` (line 1275) sends the prompt, parses, validates minimally, passes the scenario up via `onDone`. `App.addC` (1400) appends to `cust` state and persists to `localStorage["bw-custom"]`.
- **Create (import from share link):** on mount (1378–1394), if `?shared=<base64>` is present, `decodeScenario` is called, dedupe-checked by `id`, appended to `cust`, persisted. The URL is then cleaned via `history.replaceState`.
- **Store:** localStorage only. No server. Custom scenarios live in `bw-custom`.
- **Load:** `useEffect` on `App` mount (1374). There is no rehydration elsewhere; refresh mid-play just restarts.
- **Edit:** **there is no edit path.** Once an AI scenario is generated, you can play it, share it, or delete it. No inline edit, no re-roll-this-part, no "fix the vitals" button.
- **Delete:** built-ins cannot be deleted (not in `cust`). Custom: `delC` (1401) via the X button, gated by the `delConfirm` modal.

### Other data shapes

- **`TOOLS` dictionary (`App.jsx:47–61`):** 13 entries, each `{id, label, icon, desc}`. `icon` is a string key into the `ToolIcon` switch. These are the entire tool vocabulary — the AI is told to only use these IDs (prompt at line 1280: "Available tool IDs: ...").
- **`MEDS` dictionary (`App.jsx:62–80`):** 17 entries, each `{id, label, color, medType, desc}`. `medType` is one of "neb" | "oral" | "push" | "iv". Same constraint — the AI must use these IDs.
- **Visual keyword vocabulary:** informal — defined implicitly by the keyword checks in `PatientSVG` (lines 684–694). "wheelchair", "hives", "nasal cannula", "cast left arm", "head bandage", etc. **The AI prompt does not list these keywords**, so any `visuals` array the AI returns is a guess that may or may not match.

---

## 5. AI Scenario Builder

### Where the prompt lives

`src/App.jsx:1280`, inside `Builder.go`. The system prompt is built as a single JS string expression with two conditionally-interpolated pieces: `cbInstructions` (1274) and `cbPromptSection` (1273).

### Full prompt text (quoted verbatim, as sent to Anthropic)

Reconstructed with `cbMode = true` (the default). When `cbMode = false`, the two bracketed inline pieces are replaced with the `cbMode=false` variants shown below after the main prompt.

```
You are a pediatric critical care educator for Block Ward. Create a COMPLETE
medically accurate CREATIVE scenario for any pediatric emergency, trauma, or
critical care case. Use web search for clinical details. Include a curveball
section: an unexpected clinical event mid-scenario that tests a different
critical thinking axis (e.g. new diagnosis, arrhythmia, equipment failure).
The curveball must include its own vitals, signs, labs, tools, meds, actions,
and teaches with tldr fields. MANDATORY CLINICAL ACCURACY RULES: 1. All vital
signs must fall within physiologically possible ranges for the stated
age/weight. 2. All medication doses must use weight-based pediatric dosing
from current PALS/NRP guidelines. 3. Lab values must be internally consistent
(e.g., if pH is low, bicarb must also be low). 4. Disease progressions must
follow real pathophysiology - no invented mechanisms. 5. Every explanation
must cite the actual biochemical/physiologic mechanism. 6. Drug mechanisms
must reference real receptor pharmacology. 7. Never invent drug names, lab
tests, or clinical signs that do not exist. 8. Vital sign trends must be
physiologically consistent across phases. 9. Normal ranges must be
age-appropriate (infant vs child vs teen norms differ). 10. If unsure about a
clinical detail, use conservative/standard textbook values. CRITICAL STYLE
RULES: (1) NARRATIVES must be written in complete, informative sentences as
in a clinical textbook. Use proper medical terminology. Keep to 4-6 sentences
per narrative. (2) CLINICAL SIGNS must contain ONLY objective findings.
Include a sys field. (3) TOOL/MED FEEDBACK must use bullet points. Format as:
first sentence states whether appropriate or not and why, then \n- for each
key point. Example: 'Appropriate. Epinephrine provides systemic bronchodilation
when inhaled meds cannot penetrate.\n- Dose: 0.01 mg/kg IM to lateral thigh\n-
Beta-2 relaxes bronchial smooth muscle\n- Alpha-1 reduces mucosal edema\n-
Reaches airways past severe bronchospasm'. (4) VITAL SIGNS must be consistent
with clinical signs. (5) Give patients NAMES and backstories. (6) ALWAYS
include defib in tools. For wrong choices use funny callouts. (7) EVERY
teaches and explainers MUST include tldr AND use bullet points in content:
opening sentence then \n- for each mechanism. (8) Content should have 6-10
bullet points. (9) assessItem why fields: summary sentence then \n- for key
details. (10) Every assessItem MUST include cat field: vital, lab, or
clinical. Available tool IDs:
glucometer,stethoscope,bvm,suction,o2mask,ivKit,defib,thermometer,capRefill,
needleDecomp,pupilCheck,epiPen,peakFlow. Available med IDs:
lorazepam,phenytoin,epinephrine,dextrose,nsBolus,ceftriaxone,acetaminophen,
albuterol,atropine,hypertonic,mannitolMed,levetiracetam,diphenhydramine,
methylpred,famotidine,racemicEpi,adenosine. Return ONLY valid JSON. Structure:
{"id":"slug","title":"","tier":1,"icon":"emoji","tagline":"","description":"",
"visuals":[],"patient":{"ageLabel":"","weightKg":0,"sex":"Male or Female",
"cc":"","history":""},"norms":{"hr":[min,max],"rr":[min,max],"sbp":[min,max],
"dbp":[min,max],"spo2":[95,100],"temp":[36.5,37.5]},"phases":[{"id":"triage",
"name":"Triage","narrative":"","vitals":{"hr":0,"rr":0,"sbp":0,"dbp":0,
"spo2":0,"temp":0,"cap":0},"signs":[{"label":"","detail":"","pos":"",
"sys":""}],"assessItems":[{"id":"","label":"","bad":true,"why":"summary\n-
detail\n- detail","cat":"vital|lab|clinical"}],"labs":[{"name":"","value":"",
"unit":"","ref":"","critical":true,"explain":""}],"tools":null,"meds":null,
"actions":null},{"id":"escalation","name":"Escalation","narrative":"",
"vitals":{},"signs":[],"assessItems":[],"labs":[],"tools":["defib"],
"meds":[],"actions":{"tools":{},"meds":{}}}],"curveball":{"name":"",
"narrative":"","vitals":{},"signs":[],"labs":[],"tools":["must include defib"],
"meds":[],"actions":{"tools":{},"meds":{}},"teaches":[{"title":"",
"content":"6-10 sentences detailed physiology","tldr":"1-2 sentence plain
summary"}]},"debrief":{"summary":"","explainers":[{"title":"","content":
"summary\n- point\n- point","tldr":""}]}}. Phase 1: assessment only
(tools/meds/actions null). Phase 2: tools/meds/actions. CRITICAL ASSESSMENT
RULES: Phase 1 assessItems must include 6-8 items with a MIX of abnormal
(bad:true) and normal (bad:false). Include at least 3 normal and 3 abnormal.
Include vitals (cat:vital), labs (cat:lab), and clinical findings (cat:
clinical). CRITICAL INTERVENTION RULES: Phase 2 and curveball MUST have 3-4
tools ok:true with priority numbers and 2-3 meds ok:true with priority
numbers. Remaining should be ok:false. There MUST always be correct actions.
Include 5-6 tools and 5-6 meds total. Defib always included. 4-6 signs per
phase with sys. 2-3 teaches with tldr. 2-3 explainers with tldr. LABS: Every
phase MUST include 4-8 labs. critical:true for abnormal. Every critical lab
needs explain field (2-3 sentences). ALL text fields (fb, why, content,
explain, summary) should use \n- bullet formatting for readability.
```

When **cbMode = false**, the "Include a curveball section…" sentence is replaced with:

```
Do NOT include a curveball. Set curveball to null in the JSON. The scenario
should flow: Triage (assessment) -> Escalation (intervention) -> Debrief.
```

…and the `,"curveball":{…}` block is dropped from the JSON-skeleton paragraph.

The user message is literally `"Create pediatric scenario:\n\n" + txt` (line 1281).

### How user input flows into the prompt

The textarea's `txt` is passed raw into the user message, no sanitization. The API route proxy (`api/generate.js:19`) strips the `"Create pediatric scenario:\n\n"` prefix only so the Google Forms log contains the raw user-facing input — the full text still goes to Anthropic unchanged. Prompt injection is not filtered; a user can submit arbitrary text (including "ignore prior instructions…"), but since the system has only one tool call and the output is consumed as JSON, the worst-case is a weird scenario, not data leakage.

### Serverless API route

`api/generate.js` — CommonJS-style but in ESM (`"type": "module"` in package.json):

- **Path:** `POST /api/generate` (line 4).
- **Config:** `export const config = { maxDuration: 300 };` (line 2) — requires Vercel Pro. 405 returned for non-POST (line 5).
- **Auth:** reads `ANTHROPIC_API_KEY` from env (line 9); 500 if missing.
- **Proxy:** posts the client-supplied `model`, `max_tokens`, `system`, `messages`, and `tools` to `https://api.anthropic.com/v1/messages` with `anthropic-version: 2023-06-01` (lines 27–41). **Note: the client picks the model and max_tokens; the server only supplies defaults.** A malicious caller could request a more expensive model — no allowlist, no rate limiting.
- **Pass-through:** returns Anthropic's JSON body with Anthropic's status code (line 52).
- **Logging:** fires `logToGoogleForm` (line 50, 55) before returning in both success and error paths. See §6.

### Response parsing

All parsing is client-side in `Builder.go` (lines 1283–1310). In order:

1. `await r.text()` → `JSON.parse(raw)` (1283–1284). If that throws, raise `"Server returned invalid response (status <n>)…"` — this catches the 504 HTML page case that motivated the Vercel Pro upgrade per CHANGELOG.
2. `if (d.error) throw d.error.message` (1285).
3. `if (d.stop_reason === "max_tokens")` → friendly "too complex, try simpler" error (1286).
4. Concatenate every `{type:"text"}` block from `d.content` (1287–1288). Per CHANGELOG, this was changed from `.filter().map().join()` to handle web-search-interleaved responses.
5. If concatenated text is empty **and** `d.stop_reason === "tool_use"` → "AI got stuck in a research loop" error. Else → "No text in AI response" (1289–1292).
6. Strip markdown fences, DOCTYPE, html tags (1293).
7. HTML-entity decode (`&amp;` etc.) — 1294.
8. **Brace-matching extractor** (1295–1299): walks the string tracking `{`/`}` depth, collects all balanced top-level objects, sorts by length, picks the largest. This is the fix for the AI occasionally prefacing the scenario JSON with a small `{thought}` metadata object.
9. `deepClean` recursively strips any lingering HTML tags from every string (1300–1301).
10. `JSON.parse`; on failure, attempt `JSON.parse` again after a "loose JSON" fix (remove trailing commas, escape control chars) — line 1303–1307.
11. Minimal schema validation: `if (!scenario.id || !scenario.phases)` → "incomplete scenario" error (1308). **No other structural validation.**
12. If `cbMode` off but a curveball came back, set to null (1309).
13. If no debrief, inject `{summary:"Complete.", explainers:[]}` (1310).

### Known failure modes

What happens today when the AI returns something unexpected:

| Failure | What the user sees | Why |
|---|---|---|
| Network timeout (>300s) | `"Request timed out. Try a simpler description…"` | `AbortController` signal at line 1276 |
| 504 HTML page from Vercel edge | `"Server returned invalid response (status 504)…"` | raw-text parse catches non-JSON (1283) |
| `stop_reason: max_tokens` | `"Scenario was too complex and got cut off…"` | explicit check (1286) |
| `stop_reason: tool_use` with empty text | `"AI got stuck in a research loop…"` | empty-text + tool_use check (1290) |
| Any other empty content | `"No text in AI response."` | 1291 |
| Extracts JSON but parser rejects | `"AI response had invalid JSON…"` after the loose-fix fallback fails | 1306 |
| Returns text with no `{…}` block at all | `"AI did not return valid JSON…"` | 1297 |
| Returns JSON but missing `id` or `phases` | `"AI generated an incomplete scenario…"` | 1308 |
| **Returns JSON missing fields the game renders** (e.g. no `assessItems`, no `norms`, no `labs`, or phases with `actions.tools = []`) | **Crashes at render time** — `ph.assessItems.forEach`, `sc.norms.hr[0]`, etc. all dereference without checks | no schema validation beyond (id, phases) |
| **Uses tool/med IDs that aren't in the `TOOLS`/`MEDS` dicts** | Action cards silently render as `null` (`if(!t)return null;` at line 925, 930) — the button disappears entirely, and "Find all correct actions" blocks progression if the missing action was marked `pri` | no mapping fallback |
| **Returns a `visuals` array with keywords `PatientSVG` doesn't know** | Silently ignored; no visual renders | keyword matching is hardcoded |
| **Returns vitals outside the game's rendered ranges** (e.g. HR of 500) | Monitor renders it anyway; the color thresholds don't clamp or warn | no assertion against `norms` |
| **Returns phases with `assessItems: []` on triage** | Assess screen renders empty columns; "Submit Assessment" still works but contributes 0 to score | no minimum-items guard |
| **Returns `phases.length === 1` or `> 2`** | Works on 1+ (player advances through whatever exists); `pSt` status logic (`pi>=1?"declining":"stable"`) assumes exactly 2, so a third phase would show the patient as "declining" not "critical" until the curveball fires | no phase-count validation |
| **Returns an empty curveball block `{}`** in cbMode=true | Crashes at `trigCb` (`setVit(sc.curveball.vitals)` → `sc.curveball.vitals` undefined → Monitor tries to read `vitals.hr` on undefined) | no curveball shape check |
| AI returns string `"true"` / `"false"` for `bad:` or `critical:` | Assessment grading silently breaks because `!!flags[id] === it.bad` compares boolean to string (`true === "true"` is `false`) | no type coercion |
| Prompt-injection in the user textarea that tells the model to return `{"id":"x","phases":[]}` | Passes the `id && phases` check, then crashes or renders an empty phase | minimal validation |

The parser itself is reasonably robust (the CHANGELOG shows it's been hardened multiple times). The gap is **structural validation after parsing** — nothing enforces that the scenario is actually playable.

---

## 6. Google Sheets Logger

**Location:** `api/generate.js:61–76` — function `logToGoogleForm`.

**What it logs:** six fields, posted to a Google Forms formResponse endpoint hardcoded at line 62 (form ID `1FAIpQLSdCjJFXhha6jRE60QtNTmy1Hsi5bWi7FGS_64QVvaAAMl-cWw`):

1. `entry.592172391` — the user's raw scenario prompt (with the "Create pediatric scenario:\n\n" prefix stripped; line 19).
2. `entry.1540943797` — status: `success` or `error: <message or HTTP code>`.
3. `entry.984582196` — duration in seconds, formatted `1.5s`.
4. `entry.1917930391` — input tokens (from `data.usage.input_tokens`, or 0).
5. `entry.373590223` — output tokens (from `data.usage.output_tokens`, or 0).
6. `entry.1180823311` — estimated cost, formatted `$0.1234`, computed at line 47 using the **Sonnet 4 pricing** ($3/1M input, $15/1M output) — hardcoded; would under/over-report if the model changes.

**When it fires:** on every `/api/generate` request, regardless of outcome. Success path at line 50, error path in the `catch` at line 55. Both are `.catch(function(){})`'d so a Google Forms failure never propagates.

**Replaceability with Supabase analytics:** straightforward. The function is self-contained, fire-and-forget, and called from exactly two places. Swap the `fetch` body in `logToGoogleForm` for a Supabase insert (or a `rpc` call) and the rest of the code is untouched. Two caveats:

- The form ID and entry field IDs are **unauthenticated** — anyone who sees the network request can write to the form. Supabase with RLS would be tighter; the server-side usage here is fine because the API route is the only caller.
- Google Forms writes are eventually consistent, best-effort, no schema enforcement. A Supabase `usage_events` table gives you schema, indexes, queryability. No blocker.

The user's prompt is being logged to a third-party Google Form today. If any of those prompts contain identifying patient context (they shouldn't, but users paste things), that's worth noting before/during the Supabase migration. This also means **prompts entered during development or CI testing have been logged** — check the form for scrubbing needs.

---

## 7. UI and Styling

### Approach

**Inline styles everywhere.** Every component uses `style={{…}}` prop with JS objects. There is zero CSS-in-JS, no CSS modules, no Tailwind, no utility classes beyond a handful of hand-named classNames used for animations (`.bw-glass`, `.bw-tap`, `.bw-shake`, `.bw-container`, `.bw-split`, `.bw-bounce`, `.bw-confetti`, `.bw-vn`, `.alp`, `.bbx`, `.fi`, `.flt`, `.si`, `.slu`).

Animations and the few class rules are injected at runtime as inline `<style>` tags inside specific components:
- `App` (line 1424) — global keyframes + `.bw-glass`/`.bw-tap`
- `ScenarioPlayer` (line 1087) — shake/slideUp/alertPulse/fadeCard **plus the only desktop breakpoint** (see below)
- `ActionPanel` (line 923) — popIn
- `Builder` (line 1313) — bouncing blocks
- `PatientSVG` (line 700) — fadeCard (redundantly defined there too)
- `ScenarioPlayer` recovery (line 1224) — bounce/confetti/vitalsNorm

The only static global CSS lives in `index.html` as a string in a `<style>` tag — box-sizing reset, black background, scrollbar theming, `-webkit-tap-highlight-color`. There is no `src/styles.css` or `src/index.css`.

### Mobile responsiveness

- **Viewport meta** (`index.html`): `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`. The `maximum-scale` and `user-scalable=no` are an **accessibility problem** — they break pinch-to-zoom, which is a WCAG violation and a known accessibility blocker. Remove before any mobile-first redesign.
- **Breakpoints:** exactly one, inside the injected style block at `App.jsx:1087`:
  ```
  @media (min-width: 768px) {
    .bw-container { max-width: 900px !important; }
    .bw-split { flex-direction: row; gap: 20px; align-items: flex-start; }
    .bw-split-left { width: 42%; position: sticky; top: 16px; max-height: calc(100dvh - 80px); overflow-y: auto; }
    .bw-split-right { width: 58%; min-height: 0; }
  }
  ```
  That's it. No tablet breakpoint, no large-desktop breakpoint, no print styles, no reduced-motion handling.
- **Touch targets:** `button { min-height: 44px; min-width: 44px }` is enforced globally (line 1424). Individual override-styled buttons sometimes violate this (e.g. the sidebar close `X` at 1445, the toolkit buttons).
- **Units:** mix of `100vh` (line 993, 1420) and `100dvh` (line 1086, 1317) — the latter handles iOS dynamic viewport; the former doesn't. Pick one.
- **Fixed widths:** the Monitor canvas is `width={400} height={180}` baked in (1536). `PatientSVG` has `maxWidth: 200` hardcoded (line 699). The `PatientView` uses a fixed 180px center column (line 900). None of this flexes gracefully at <360px-wide phones.

### Screens / views

Ordered roughly by complexity:

| Screen | Lines | Complexity | Notes |
|---|---|---|---|
| **Dashboard** (`view==="dash"`) | 1423–1548 | Medium | Header, three stat cards, Core Scenarios list, Custom Scenarios list, Build button, sidebar (three tabs), delete-confirm modal, toast. |
| **ScenarioPlayer intro** (`stage==="intro"`) | 1093–1103 | Low | PatientView + info card + Begin button. |
| **ScenarioPlayer phase** (`stage==="phase"`) | 1104–1121 | Low | Narrative + patient view + monitor + systems + labs. |
| **ScenarioPlayer assess** (`stage==="assess"`) | 1123–1175 | High | Three columns of assessments, per-item mini-SVGs generated from keywords (~7 custom SVG cases inline at 1132–1138), pre/post-submit rendering, split-layout responsive columns. |
| **ScenarioPlayer act** (`stage==="act"`) | 1176–1190 | Medium | Tool belt + med cart + pop-out feedback modal. |
| **ScenarioPlayer curveball alert** (`stage==="cb-alert"`) | 1191–1204 | Low | Flashing banner + narrative. |
| **ScenarioPlayer curveball act** (`stage==="cb-act"`) | 1205–1220 | Medium | Like `act` but with red chrome. |
| **ScenarioPlayer recovery** (`stage==="recovery"`) | 1221–1261 | High | Animated reveal of correct actions, bouncing patient SVG, confetti, normalized vitals. |
| **ScenarioPlayer debrief** (`stage==="debrief"`) | 993–1085 | **Very high** | Happy patient, score badge, expandable Review flowchart, Lab Review (recomputed inline at 1038–1060), Physiology Deep Dive, Curveball Deep Dive, TLDR toggles. 93 lines, all inline. |
| **Builder (form)** | 1317–1335 | Low | Textarea + toggle + disclaimer + button. |
| **Builder (busy)** | 1312–1316 | Low | Animated bouncing blocks + rotating message. |

The dashboard and the debrief screen are the two most complex UI surfaces; both are strong candidates for extraction.

---

## 8. Blockers and Opportunities

For each of your four upcoming initiatives, here's what helps and what fights back.

### (a) Mobile-first UI redesign

**Fights back:**
- **Inline styles are the biggest single obstacle.** Every layout tweak touches dozens of literal `style={{…}}` objects. Mobile-first CSS needs composition (tokens, utility classes, or components); inline objects force you to duplicate every rule.
- **No design tokens.** Colors (`#4ECDC4`, `#FF6B81`, `#FECA57`, `#a55eea`, `rgba(255,255,255,0.04)`) and spacing (`12`, `16`, `20`) are scattered as literals hundreds of times. Hard to theme, hard to tune for small screens.
- **`index.html` viewport blocks pinch-zoom** (`maximum-scale=1.0, user-scalable=no`). Fix first thing.
- **`PatientSVG` and `Monitor` use fixed canvas / viewBox dimensions.** Works on desktop, cramped on 360-wide phones. The Monitor canvas is drawn at 400×180 and CSS-scaled, which blurs the waveform on small screens.
- **The only breakpoint is 768px, one-shot, inside a component.** There is no clean place to say "on <480px collapse monitor and body systems into a tab strip." You'd need to re-architect the `.bw-split` pattern.
- **ScenarioPlayer's stage-based layout mixes portrait (intro, phase) and split (assess, act) without a coherent primitive.** A mobile redesign probably wants a single `<StageShell>` with slots.

**Can stay:**
- The information architecture (stages, split-left = monitor/patient, split-right = actions) is sound. Keep the model; reskin the pixels.
- The Lucide icons, SVG patient, and monitor canvas math (`ecgPt`, `plPt`) are self-contained and portable.

**Refactor first:** extract components out of `App.jsx`; move colors and spacings to a tokens module; add Tailwind or a tiny CSS-in-JS if you want utility-first; kill the viewport zoom-block.

### (b) Harden the AI builder against unexpected input

**Fights back:**
- The prompt is a **single-expression ~6.5KB string**. Editing individual rules is error-prone — a stray quote breaks the whole build.
- **The only post-parse validation is `id && phases`** (line 1308). As enumerated in §5, many bad-but-parseable scenarios crash at render time.
- **There's no "lint the scenario" step.** No check that tool/med IDs are in `TOOLS`/`MEDS`. No check that `actions.tools[id].ok === true` entries appear in `phase.tools`. No check that every `assessItem` has a unique `id`. No check that `norms` ranges are sane.
- **No retry loop.** A single malformed response terminates the build with an error. Even a simple "if `deepClean` fails, ask Claude to fix the JSON" would sidestep most parse failures.
- **Client owns the model selection and max_tokens.** Anyone who calls `/api/generate` can request Opus or 64k tokens. Move those decisions server-side.
- **Prompt injection isn't filtered.** Low risk (output is consumed as JSON) but worth a basic sanitizer.
- **The hardcoded prompt model ID `claude-sonnet-4-20250514`** (line 1278, and default in `api/generate.js:35`) is **outdated** as of 2026-04 — Sonnet 4.6 exists and you'd likely get better adherence and lower failure rates on the current model.

**Refactor first:** pull the prompt into `src/builder/prompt.js` as a function `buildSystemPrompt({ curveball })` with the JSON skeleton as an object literal (stringified). Add a Zod (or tiny hand-written) schema validator that runs after `deepClean` and fails loud with a specific "missing field X in phase Y" message. Add one retry where on schema failure you send the scenario back to Claude with "fix these problems: …" as a new user turn.

### (c) Supabase auth + database for shareable scenarios with short IDs + creator-revoke

**Fights back:**
- The app has **no concept of a user today.** Every piece of state is local; `shareScenario` packs the whole scenario into a base64 URL. Introducing auth adds a new top-level state axis (logged-in vs. anon) that has to coexist with all the localStorage paths.
- **`bw-custom` in localStorage is the source of truth for custom scenarios.** After Supabase, you need a migration story (upload local scenarios on first login? ask the user?) and a decision about what "anon-created" means.
- **No routing.** `?shared=<base64>` handling is DIY in a `useEffect` (line 1374). Adding short IDs means adding real routes (`/s/:shortId`) which means either react-router or a homegrown router. The current no-router approach is shippable but constrains URL shapes.
- **Creator-revoke needs a stable creator identity on every scenario.** The AI builder doesn't attach one; imported scenarios don't have one. You'd need a schema migration to add `createdBy` (and possibly `createdAt`), and a decision about back-filling existing localStorage scenarios.
- **Clinically-reviewed built-ins (SC1/SC2/SC3) should probably live in the DB too** once you have one, so the dashboard queries one source — but they're currently hardcoded literals. Migrating them is a one-time move.
- **`minifyScenario`** (line 1347) exists because scenarios are too big for the URL. With server-side storage, you keep the full unminified scenario; the minifier stops being load-bearing and can go.

**Can stay:**
- The scenario shape is JSON and doesn't depend on React — fits cleanly into a Postgres `jsonb` column.
- The existing `shareScenario` flow already uses `navigator.share` when available (line 1367) and falls back to clipboard — same UI can shell short URLs instead of long base64 ones.

**Refactor first:** introduce real routes, a single `useScenarios()` hook that abstracts over localStorage + Supabase, and a scenario schema (Zod or similar) that both the builder and the DB share. Get the data layer clean *before* adding auth — otherwise the auth branching will spread everywhere.

### (d) Web Share API support

**Mostly already done.** `shareScenario` (line 1356) uses `navigator.share` when available (line 1367), falls back to `navigator.clipboard`, and falls back again to `window.prompt` (line 1371 — this is rough; modern browsers block `prompt()` in some contexts and it's a clunky fallback).

**Minor work:**
- Swap the `prompt()` fallback for the toast pattern already in use (`setShareMsg("Link copied!")` at line 1369) — put the URL in clipboard regardless and just tell the user.
- Add `files` and `text` to `navigator.share` — today only `title` and `url` go through.
- With Supabase-backed short URLs, the share payload becomes small enough that you can also share it via `text` for SMS/Slack etc.

Nothing structural is blocking (d).

### Recommended refactor order

1. **Split `App.jsx`** into modules. No behavior change. Makes everything else below feasible.
2. **Lift the system prompt and scenario schema** into dedicated files with a Zod-style validator. Add retry on schema failure. This is independent of UI work and immediately reduces AI-failure-mode surface area.
3. **Replace inline styles and viewport tag** — migrate to tokens + utility classes (Tailwind probably, or vanilla extract). This is the gating change for a real mobile-first redesign.
4. **Introduce a data layer abstraction (`useScenarios`, `useProgress`)** still backed by localStorage. This decouples components from storage.
5. **Add Supabase** against that abstraction, then auth, then short URLs, then creator-revoke, in that order.

---

## 9. Quick Wins

Small things worth fixing on a quiet afternoon. No structural commitments required.

- **`isBuiltIn` check is wrong** — `App.jsx:1532` compares against `["fussy-infant","asthma-attack","seizure"]`, but the actual built-in IDs are `fussy-infant` (SC1), `vomiting-toddler` (SC2), `asthma-crisis` (SC3). **Two of three built-in scenarios never get the "Clinically Reviewed" badge.** One-line fix.
- **Model ID is outdated** — `claude-sonnet-4-20250514` is hardcoded in both `App.jsx:1278` and `api/generate.js:35`. Latest is Sonnet 4.6 (`claude-sonnet-4-6`). Also: cost calculation at `api/generate.js:47` uses Sonnet-4 prices ($3/$15 per million); would be wrong for any other model.
- **Viewport meta blocks pinch-zoom** — `index.html`: remove `maximum-scale=1.0, user-scalable=no`. Accessibility win, zero behavior cost.
- **`window.confirm` for destructive action** — `App.jsx:1505` ("Clear all progress?") uses the native confirm dialog. Everywhere else in the app has a theme'd modal (`delConfirm` at 1427–1438). Use the existing pattern for consistency.
- **`window.prompt` as share fallback** — `App.jsx:1371`. Modern browsers suppress `prompt()` in some contexts. Fall back to clipboard with a toast instead (toast pattern already exists, 1426).
- **Score totals only count phase-1 assessments** — `ScenarioPlayer.submit` at line 984 increments `score.t` from `ph.assessItems.length` but this branch runs only for triage (phase with no interventions). The score shown in the debrief is `(correctAssessments)/(triageAssessCount)`, not an overall score. Either make it clear or include action-phase correctness.
- **`correctActions` and debrief-review arrays are recomputed on every render** (lines 969–979, 994–1008) — `useMemo` keyed on `sc` would reduce work and make the intent obvious.
- **Inline `<style>` keyframes duplicated** — `fadeCard` is declared in `PatientSVG` (line 700) and again in `ScenarioPlayer` (line 1087). Lift them to a single place.
- **`@import url(fonts.googleapis.com/…)` inside a runtime `<style>` tag** — `App.jsx:1424`. This causes a visible flash and blocks paint. Move the font import to `index.html` with `<link rel="preconnect">`.
- **Deprecated `escape`/`unescape`** — `App.jsx:1354, 1355` uses `btoa(unescape(encodeURIComponent(…)))` for UTF-8-safe base64. It works but is deprecated. Swap for `TextEncoder` + `Uint8Array → base64` when you're near that code anyway.
- **`sc.visuals` keyword vocabulary is undocumented** — the AI is told "visuals:[]" but not which keywords render. Either enumerate them in the prompt or drop the field.
- **Dead-ish keyword fallbacks in `BodySystemsView`** — `guessSys` (lines 559–571) is needed because the AI sometimes omits `sys`. The prompt already mandates `sys`. Tighten the prompt or lean on the fallback — don't maintain both.
- **`Monitor` canvas animation deps on `[vitals.hr]` only** — when `vitals.spo2` or `vitals.rr` change during a phase, the waveform doesn't retrigger. Harmless today (vitals change at phase boundaries, which also remount the component), but surprising.
- **Nothing in `.gitignore` for env files** — if a local `.env.local` gets created, it would be committed by default. Add `.env*` to `.gitignore`.
- **No `README.md`, no `CLAUDE.md`** — the only onboarding doc is `CHANGELOG-2026-03-24.md`. A 40-line README explaining the deploy model, env vars, and file map would save a lot of rediscovery.
- **"Block Ward v1.6" shown at line 1507 and 1547** — `package.json` is on `2.0.0`. Pick one.

---

_End of audit._
