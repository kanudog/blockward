// Vercel Serverless Function — proxies scenario generation to Anthropic API
export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY not configured" } });
  }

  // Phase-2.6 group D: clients may pass a mode parameter to tag the call.
  // Today this is used purely for logging/observability — the request
  // body still carries the full system prompt and messages. Known modes:
  //   "scenario" (default) — full scenario generation
  //   "expand_marked_items" — deep-dive expansion of items the user marked
  const mode = (req.body && req.body.mode) || 'scenario';
  const isStreaming = !!(req.body && req.body.stream);

  let userPrompt = '';
  try {
    const msgs = req.body.messages || [];
    if (msgs.length > 0) {
      userPrompt = msgs[msgs.length - 1].content || '';
      userPrompt = userPrompt.replace('Create pediatric scenario:\n\n', '').trim();
    }
  } catch (e) {}

  const startTime = Date.now();
  const body = req.body;
  const upstreamBody = {
    model: body.model || "claude-sonnet-4-6",
    max_tokens: body.max_tokens || 24000,
    system: body.system || "",
    messages: body.messages || [],
    tools: body.tools || undefined,
    // Phase-4-prep: forward thinking + output_config when the client opts in.
    // Both use the `|| undefined` pattern so JSON.stringify drops the key
    // when the client did not send it (e.g., the marked-for-review path).
    // Anthropic rejects `thinking: null` so the dropped-key behavior matters.
    thinking: body.thinking || undefined,
    output_config: body.output_config || undefined,
  };
  if (isStreaming) upstreamBody.stream = true;

  // -----------------------------------------------------------------
  // Streaming path — phase-2.6.1 part 2D. Anthropic returns SSE events
  // when stream=true. We pipe them straight through to the client and
  // best-effort sniff stop_reason / usage for the diagnostic log.
  // -----------------------------------------------------------------
  if (isStreaming) {
    try {
      const apiResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(upstreamBody),
      });

      if (!apiResp.ok) {
        const errBody = await apiResp.text();
        const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
        console.log('[generate diagnostic]', JSON.stringify({
          mode: mode, streaming: true, http_status: apiResp.status,
          duration_s: duration, error_body_preview: errBody.slice(0, 200)
        }));
        logToGoogleForm('[' + mode + ' stream] ' + userPrompt, 'error: http ' + apiResp.status, duration, 0, 0, '$0').catch(function () {});
        res.status(apiResp.status).setHeader('Content-Type', 'application/json').end(errBody);
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof res.flushHeaders === 'function') res.flushHeaders();

      const reader = apiResp.body.getReader();
      const decoder = new TextDecoder();
      let totalIn = 0, totalOut = 0, totalSearches = 0, totalCacheCreate = 0, totalCacheRead = 0, finalStopReason = null, snippet = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(value);
        const chunkText = decoder.decode(value, { stream: true });
        const usageMatch = chunkText.match(/"input_tokens":(\d+)/);
        if (usageMatch) totalIn = Math.max(totalIn, Number(usageMatch[1]));
        const outMatch = chunkText.match(/"output_tokens":(\d+)/);
        if (outMatch) totalOut = Math.max(totalOut, Number(outMatch[1]));
        // Phase-2.6.3 change 1: capture web_search_requests from server_tool_use.
        // Anthropic returns it under usage.server_tool_use.web_search_requests
        // — appears in the message_delta usage update once the message ends.
        const searchMatch = chunkText.match(/"web_search_requests":(\d+)/);
        if (searchMatch) totalSearches = Math.max(totalSearches, Number(searchMatch[1]));
        // Phase-4-prep: prompt-cache metrics. cache_creation_input_tokens
        // appears on the first call after a cache_control breakpoint
        // changes; cache_read_input_tokens > 0 confirms a cache hit on
        // subsequent calls within the 5-minute TTL.
        const cacheCreateMatch = chunkText.match(/"cache_creation_input_tokens":(\d+)/);
        if (cacheCreateMatch) totalCacheCreate = Math.max(totalCacheCreate, Number(cacheCreateMatch[1]));
        const cacheReadMatch = chunkText.match(/"cache_read_input_tokens":(\d+)/);
        if (cacheReadMatch) totalCacheRead = Math.max(totalCacheRead, Number(cacheReadMatch[1]));
        const stopMatch = chunkText.match(/"stop_reason":"([a-z_]+)"/);
        if (stopMatch && stopMatch[1] !== 'null') finalStopReason = stopMatch[1];
        if (snippet.length < 200) {
          const m = chunkText.match(/"text_delta","text":"([^"\\]{1,200})/);
          if (m) snippet = (snippet + m[1]).slice(0, 200);
        }
      }
      res.end();

      const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      const estCost = '$' + ((totalIn * 3 / 1000000) + (totalOut * 15 / 1000000)).toFixed(4);
      console.log('[generate diagnostic]', JSON.stringify({
        mode: mode, streaming: true, http_status: apiResp.status,
        stop_reason: finalStopReason, input_tokens: totalIn, output_tokens: totalOut,
        web_search_requests: totalSearches,
        cache_creation_input_tokens: totalCacheCreate,
        cache_read_input_tokens: totalCacheRead,
        duration_s: duration, first_200_chars: snippet
      }));
      logToGoogleForm('[' + mode + ' stream] ' + userPrompt, finalStopReason || 'success', duration, totalIn, totalOut, estCost).catch(function () {});
    } catch (err) {
      const errDuration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      console.error("Generate streaming error:", err);
      logToGoogleForm('[' + mode + ' stream] ' + userPrompt, 'error: ' + err.message, errDuration, 0, 0, '$0').catch(function () {});
      try { res.status(500).end(JSON.stringify({ error: { message: "Server error: " + err.message } })); } catch (e) {}
    }
    return;
  }

  // -----------------------------------------------------------------
  // Non-streaming path (deepDive expansion + legacy callers).
  // -----------------------------------------------------------------
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(upstreamBody),
    });

    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    const inputTokens = data.usage ? data.usage.input_tokens : 0;
    const outputTokens = data.usage ? data.usage.output_tokens : 0;
    // Phase-2.6.3 change 1: capture web_search_requests count from
    // usage.server_tool_use.web_search_requests. Default to 0 (not null)
    // for runs where no search happened so the field is graphable.
    const searchRequests = (data.usage && data.usage.server_tool_use && typeof data.usage.server_tool_use.web_search_requests === 'number') ? data.usage.server_tool_use.web_search_requests : 0;
    // Phase-4-prep: prompt-cache metrics. Same fields as the streaming path
    // — surfaces whether the cache_control breakpoint on the system prompt
    // is being filled (creation > 0) and reused (read > 0).
    const cacheCreate = (data.usage && typeof data.usage.cache_creation_input_tokens === 'number') ? data.usage.cache_creation_input_tokens : 0;
    const cacheRead = (data.usage && typeof data.usage.cache_read_input_tokens === 'number') ? data.usage.cache_read_input_tokens : 0;
    // PHASE 2.6.1 PART 1 DIAGNOSTIC — temporary; remove once root cause is fixed.
    let firstContent = '';
    try {
      const blocks = data.content || [];
      for (let i = 0; i < blocks.length && firstContent.length < 200; i++) {
        if (blocks[i] && blocks[i].type === 'text' && blocks[i].text) firstContent += blocks[i].text;
      }
      firstContent = firstContent.slice(0, 200);
    } catch (e) {}
    console.log('[generate diagnostic]', JSON.stringify({
      mode: mode,
      streaming: false,
      http_status: response.status,
      stop_reason: data.stop_reason || null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      web_search_requests: searchRequests,
      cache_creation_input_tokens: cacheCreate,
      cache_read_input_tokens: cacheRead,
      duration_s: duration,
      content_blocks: (data.content || []).length,
      content_block_types: (data.content || []).map(function (b) { return b && b.type; }),
      first_200_chars: firstContent,
      api_error: data.error ? data.error.message : null
    }));
    // Sonnet 4.6 pricing as of April 2026: $3/M input, $15/M output
    const estCost = '$' + ((inputTokens * 3 / 1000000) + (outputTokens * 15 / 1000000)).toFixed(4);
    const status = response.ok ? 'success' : 'error: ' + (data.error ? data.error.message : response.status);

    logToGoogleForm('[' + mode + '] ' + userPrompt, status, duration, inputTokens, outputTokens, estCost).catch(function () {});

    return res.status(response.status).json(data);
  } catch (err) {
    const errDuration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    logToGoogleForm('[' + mode + '] ' + userPrompt, 'error: ' + err.message, errDuration, 0, 0, '$0').catch(function () {});
    console.error("Generate error:", err);
    return res.status(500).json({ error: { message: "Server error: " + err.message } });
  }
}

async function logToGoogleForm(prompt, status, duration, inputTokens, outputTokens, estCost) {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdCjJFXhha6jRE60QtNTmy1Hsi5bWi7FGS_64QVvaAAMl-cWw/formResponse';
  const params = new URLSearchParams();
  params.append('entry.592172391', prompt);
  params.append('entry.1540943797', status);
  params.append('entry.984582196', duration);
  params.append('entry.1917930391', String(inputTokens));
  params.append('entry.373590223', String(outputTokens));
  params.append('entry.1180823311', estCost);

  await fetch(formUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
}
