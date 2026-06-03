# Phase 5 Session Handoff                                                                                             
   
  Written 2026-05-07 at the close of a session that completed Phases                                                    
  5.1, 5.2, 5.2.5+5.3 and surfaced two bugs. The next session will not
  have my prior conversation context, so this doc captures what's                                                       
  non-obvious from reading the code alone.                                                                              
                                                                                                                        
  ---                                                                                                                   
                                                                                                                        
  ## Where we are in the phase plan                                                                                     
   
  | Phase | Status | Commit |                                                                                           
  |---|---|---|                                                   
  | 5.1 — Source marker on every scenario | Merged | `3cfb49e` |
  | 5.2 — Haiku explanation fetch capability | Merged | `2083f2b` |                                                     
  | 5.2.5 — Mark for Review slot reference | Merged (in 5.3 commit) | `4c98520` |                                       
  | 5.3 — Wire fetchExplanations into ScenarioPlayer | Merged | `4c98520` |                                             
  | 5.4a — Trim main prompt's Phase 2 explanation generation | **NEXT** | — |                                           
  | 5.4b — Trim main prompt's Phase 1 explanation generation | Open question (hybrid choice) | — |                      
  | 5.5 — Cleanup, telemetry, stale `BUILT_IN_IDS` fix | Open | — |                                                     
                                                                                                                        
  The original phasing plan lives in                                                                                    
  `docs/phase-5-lazy-generation/01-investigation.md` §1.9.                                                              
                                                                                                                        
  ---                                                             
                                                                                                                        
  ## Critical decisions made (not in the code as comments)                                                              
   
  ### Hybrid Phase 1 / Phase 2 split                                                                                    
                                                                  
  Sebastian explicitly chose: **Phase 1 explanations stay in main                                                       
  scenario generation** (Sonnet, generated upfront so Phase 1 feels
  instant). **Phase 2 (and any future phases) use the lazy Haiku                                                        
  fetch** (loading window is forgivable inside gameplay).                                                               
                                                                                                                        
  Implication for Phase 5.4a: trim ONLY Phase 2's `why`/`fb` from the                                                   
  main prompt. Leave Phase 1 explanations intact in the prompt.                                                         
  `collectMissingExplanationSlots(sc, phaseIdx)` is already                                                             
  phase-scoped — it only needs to be called for `phaseIdx >= 1`.                                                        
                                                                                                                        
  ### Warmup pattern over pure parallel                                                                                 
                                                                                                                        
  `scripts/cache-test.mjs` empirically showed three patterns for 12                                                     
  identical-prompt Haiku calls:
                                                                                                                        
  | Pattern | Wall-clock | Cost vs serial |                                                                             
  |---|---|---|                                                                                                         
  | All parallel cold (Promise.all of 12) | ~3s | **3.4× more expensive** (12 cache writes) |                           
  | Warmup + parallel (1 awaited, then 11 parallel) | ~6s | 1.3× (~3 cache writes) |                                    
  | Pure serial (12 awaited) | ~25s | baseline (~2 writes) |                                                            
                                                                                                                        
  We chose **warmup + parallel** for `fetchExplanations` —                                                              
  3-second wall-clock cost over pure parallel for ~62% cost reduction.                                                  
  Even with full serialization Anthropic's cache propagation has                                                        
  ~30-100ms latency between workers, so 2-3 race writes per phase                                                       
  entry is the realistic floor, not 1.                                                                                  
                                                                                                                        
  ### "Save once, render forever"                                                                                       
                                                                                                                        
  Lazy-fetched explanations are written in place into the scenario                                                      
  object and persisted via `scenariosStore.updateCustom(sc)`.
  Subsequent reads from any session, any user (shared link), use the                                                    
  saved text — no regeneration. Invalidation is gated by an explicit                                                    
  `explanationVersion` field (not yet wired). See investigation                                                         
  §1.6.5.                                                                                                               
                                                                                                                        
  ### Slot-ref instead of frozen text in `markedForReview`                                                              
                                                                  
  Phase 5.2.5 changed `playerStore.markedForReview` from storing                                                        
  rendered text (`originalWhy`) to storing slot references. Debrief
  resolves text fresh from the live scenario at render time via                                                         
  `resolveSlotText(sc, slotRef)`. This means: a user who marks an item                                                  
  during Phase 2 BEFORE the lazy fetch lands will still see the                                                         
  populated content at debrief time, because the slot ref points to a                                                   
  location that now contains real text.                                                                                 
                                                                                                                        
  The `_slotRef` shape:                                                                                                 
  { kind: "vital"|"lab"|"sign"|"assessItem"|"tool"|"med",         
    phaseIdx: number | "curveball",                                                                                     
    indexOrId: string }                                           
                                                                                                                        
  For vital, indexOrId is the vital key (`hr`, `spo2`, ...). For lab,                                                   
  the lab name. For sign, the sign label. For tool/med, the action key.                                                 
                                                                                                                        
                                                                                                                        
  ## Open bugs                                                                                                          
                                                                  
  ### Bug 1 (CONFIRMED, fix one-line, NOT YET APPLIED)
                                                                                                                        
  `Uncaught ReferenceError: get is not defined at playerStore.js:101:22`
  in `toggleMarkForReview`.                                                                                             
                                                                  
  Root cause: I added six new/refactored actions in Phase 5.2.5 that                                                    
  use `get()` directly:                                                                                                 
  - `toggleMarkForReview`                                                                                               
  - `addMarkedItem`                                                                                                     
  - `removeMarkedItem`                                            
  - `setDeepDive`                                                                                                       
  - `forceRefreshScenario`                                        
  - `markLazySlotFetched`                                                                                               
                                                                  
  But the Zustand factory was declared as `create(function(set) {`                                                      
  — `get` was never extracted. Fix:                                                                                     
                                                                                                                        
  ```diff                                                                                                               
  - export var usePlayerStore = create(function(set) {                                                                  
  + export var usePlayerStore = create(function(set, get) {
                                                                                                                        
  That single line unblocks every action. No other changes needed.
  scenariosStore.js does not have this bug because it was already                                                       
  declared create(function(set, get) {.                                                                                 
                                                                                                                        
  After applying, verify by clicking Mark for Review on a Phase 1                                                       
  finding; the error should not fire.                             
                                                                                                                        
  Bug 2 (NOT A BUG — working as designed, until Phase 5.4a)                                                             
   
  User reported "Lazy fetch useEffect not firing on Phase 2 entry."                                                     
                                                                  
  The effect IS firing (deps [sc && sc.id, stage, pi] change on                                                         
  phase transition). But collectMissingExplanationSlots(sc, pi)   
  returns [] because the main scenario generator currently produces                                                     
  full why/fb content for every Phase 2 slot. With nothing missing,                                                     
  the effect early-returns silently — no Haiku calls in the Network                                                     
  tab.                                                                                                                  
                                                                                                                        
  This is the dormant-but-baked-in state Phase 5.3 was designed for.                                                    
  The effect will start doing real work the moment Phase 5.4a trims
  the main prompt's Phase 2 explanations.                                                                               
                                                                  
  How to confirm in DevTools:                                                                                           
                                                                  
  const sc = JSON.parse(localStorage.getItem("bw-custom"))[0];                                                          
  console.log(sc.source);                                   // "ai"
  console.log(sc.phases[1].labs[0].why);                    // long text — populated                                    
  console.log(Object.values(sc.phases[1].actions.tools)[0].fb);  // long text — populated                               
                                                                                                                        
  If those are populated, the effect correctly has nothing to do.                                                       
                                                                  
  For active diagnosis (post-5.4a) add at the top of the effect in                                                      
  ScenarioPlayer.jsx:                                             
                                                                                                                        
  console.log("[lazyFetch] effect ran, pi=" + pi +                
              ", source=" + (sc && sc.source) + ", stage=" + stage);                                                    
                                                                                                                        
  Remove before any commit.                                                                                             
                                                                                                                        
  ---                                                                                                                   
  Calibration constants worth knowing                             
                                     
  These let you reason about prompt token budgets without re-running
  the empirical tests.                                                                                                  
   
  - @anthropic-ai/tokenizer (Claude 2-era BPE) → real Claude 4.5                                                        
  API tokens calibration ratio: ~1.124 (measured against          
  cache-test.mjs's BASE_SYSTEM: 4009 BPE → ~4506 real). New prompts                                                     
  may drift ±5-10%; verify with a real /api/generate call.                                                              
  - Haiku 4.5 prompt cache minimum: 4096 real API tokens. Below                                                         
  this, cache_control is silently ignored (no error, just no                                                            
  caching). Sonnet 4.5/4.6 minimum is 1024.                                                                             
  - buildExplanationPrompt current size: 4056 BPE tokens, ~4609                                                         
  real API tokens. Comfortably above the 4096 floor.                                                                    
  - Sonnet 4.6 pricing (per million tokens): $3 input / $15 output                                                      
  / $3.75 cache write 5min / $0.30 cache read.                                                                          
  - Haiku 4.5 pricing: $1 / $5 / $1.25 / $0.10.                                                                         
                                                                                                                        
  Tokenizer install for re-measuring: /tmp/sc6-token/ has                                                               
  @anthropic-ai/tokenizer v0.0.4 from Phase 5.2 work. If that dir is                                                    
  gone, npm install --prefix /tmp/sc6-token @anthropic-ai/tokenizer                                                     
  recreates it.                                                                                                         
                                                                                                                        
  ---                                                                                                                   
  What's in git vs untracked                                      
                                                                                                                        
  Committed and durable:
  - All Phase 5.1 / 5.2 / 5.2.5+5.3 source changes                                                                      
  - scripts/explanation-smoke-test.mjs (Phase 5.2 commit)                                                               
   
  Untracked but useful, on disk:                                                                                        
  - docs/phase-5-lazy-generation/01-investigation.md              
  - docs/phase-5-lazy-generation/02-session-handoff.md (this file)                                                      
  - scripts/cache-test.mjs                                        
  - scripts/lazy-flow-smoke-test.mjs                                                                                    
                                                                  
  The fixture JSON files (mira-*.json, saoirse-*.json,                                                                  
  wren-*.json) are pre-existing and unrelated to Phase 5.                                                               
                                                                                                                        
  ---                                                                                                                   
  What the next session should read first                                                                               
                                                                  
  1. This file (the load-bearing decisions and unfixed bugs)
  2. docs/phase-5-lazy-generation/01-investigation.md (full                                                             
  architecture, file-by-file map of what's involved)                                                                    
  3. The three Phase 5 commit messages (git log --oneline -5 then                                                       
  git show <hash>) — each commit message documents what changed                                                         
  and why                                                                                                               
  4. scripts/cache-test.mjs and scripts/explanation-smoke-test.mjs                                                      
  for the empirical patterns the implementation builds on                                                               
                                                                                                                        
  Then: apply the Bug 1 fix as a tiny commit before doing anything                                                      
  else, OR fold it into the Phase 5.4a commit if it'll ship same day.  