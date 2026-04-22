# Block Ward — Edits Log, March 24, 2026

## Starting Point
- Sebastian sent v1.5 zip (`blockward-vercel-deploy.zip`)
- Reviewed, saved to workspace, deployed to Vercel

## v1.5 Fixes Applied (in order)

### 1. Syntax Error Fix
- **File:** `src/App.jsx` line 1354
- **Issue:** Extra closing brace `}}` on useEffect dependency array
- **Fix:** Changed `}},[]);` → `},[]);`

### 2. JSON Parser Hardening (multiple iterations)
- **File:** `src/App.jsx` (Builder component, `go` function)
- **Problem:** AI-generated scenarios failing to parse, especially with web_search tool
- **Fixes applied:**
  - Text block collection: `forEach` over `d.content` filtering `b.type==="text"` instead of `.filter().map().join()`
  - HTML entity cleanup BEFORE JSON extraction (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`)
  - **Brace-matching JSON extractor:** finds all balanced `{}` objects, picks the largest one (the scenario), ignoring small metadata fragments
  - **Fallback JSON repair:** strips trailing commas, unescaped control characters
  - **Truncation detection:** checks `d.stop_reason === "max_tokens"` with clear error message
  - **Tool-use loop detection:** checks `d.stop_reason === "tool_use"`
  - **Raw response parsing:** `await r.text()` then `JSON.parse(raw)` to catch non-JSON server errors (504 timeout HTML pages)
  - **AbortController timeout:** client-side 300s abort with clear error message

### 3. max_tokens Increase
- **File:** `src/App.jsx` (Builder fetch body)
- **Change:** `max_tokens: 8000` → `max_tokens: 16000`
- **Reason:** Complex scenarios with curveball + debrief + physiology were exceeding 8K

### 4. System Prompt Enhancement
- Added instruction: "After researching, return ONLY the JSON scenario object — no commentary, no markdown fences, no explanation before or after the JSON."

### 5. Vercel Function Timeout (the main fix)
- **File:** `api/generate.js`
- **Problem:** Vercel Hobby plan = 10s function timeout. Claude with web_search + 16K tokens takes 30-60+ seconds.
- **Attempted fixes:**
  - Edge Function (`export const config = { runtime: 'edge' }`) — 30s limit on Hobby, but Vercel wasn't detecting the Edge config properly
  - Added `"type": "module"` to package.json — helped Edge detection but 30s still not enough
  - **Final fix:** Sebastian upgraded to Vercel Pro ($20/mo) → `maxDuration: 300` (5 minutes)
- **File:** `api/generate.js` — `export const config = { maxDuration: 300 };`

### 6. generate.js Rewrite (Node.js serverless, not Edge)
- Switched back from Edge to standard Node.js serverless function
- Added `maxDuration: 300` config export
- Preserved Google Forms usage logging
- Default `max_tokens: 16000` on server side as fallback

## v2.0 Deployment
- Sebastian sent v2.0 files (tar.gz + handoff doc + individual files)
- Key v2 changes: Lucide React icons, ToolIcon/MedIcon SVG components, glassmorphism, recovery screen, clinical accuracy guardrails (10 rules in prompt), educational disclaimer
- **All v1.5 fixes carried forward into v2.0:**
  - ✅ maxDuration: 300 on generate.js
  - ✅ max_tokens: 16000
  - ✅ Brace-matching JSON parser with largest-object selection
  - ✅ Fallback JSON repair (trailing commas, control chars)
  - ✅ Truncation detection (stop_reason checks)
  - ✅ Raw response text parsing (catches 504 HTML)
  - ✅ AbortController client timeout (300s)
  - ✅ Google Forms logging
  - ✅ "type": "module" in package.json
  - ✅ Web search tool included

## Backup Locations
- **v1.5 (with fixes):** `/Users/openclaw/.openclaw/workspace/blockward-v1/`
- **v2.0 (deployed):** `/Users/openclaw/.openclaw/workspace/blockward/`
- **Original v1.5 zip:** `/Users/openclaw/.openclaw/media/inbound/blockward-vercel-deploy-*.zip`
- **v2.0 tar.gz:** `/Users/openclaw/.openclaw/media/inbound/BlockWard_v2_Project.tar-*.gz`

## Vercel Project Info
- **Project:** `blockward` (sebastianheredia1993-2614s-projects)
- **Production URL:** https://blockward-lovat.vercel.app
- **Plan:** Vercel Pro (upgraded 2026-03-24)
- **Env var:** `ANTHROPIC_API_KEY` (set in Vercel dashboard)
