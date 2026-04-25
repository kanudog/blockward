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

  let userPrompt = '';
  try {
    const msgs = req.body.messages || [];
    if (msgs.length > 0) {
      userPrompt = msgs[msgs.length - 1].content || '';
      userPrompt = userPrompt.replace('Create pediatric scenario:\n\n', '').trim();
    }
  } catch (e) {}

  const startTime = Date.now();

  try {
    const body = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-6",
        max_tokens: body.max_tokens || 16000,
        system: body.system || "",
        messages: body.messages || [],
        tools: body.tools || undefined,
      }),
    });

    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    const inputTokens = data.usage ? data.usage.input_tokens : 0;
    const outputTokens = data.usage ? data.usage.output_tokens : 0;
    // PHASE 2.6.1 PART 1 DIAGNOSTIC — temporary; remove once root cause is fixed.
    // Surfaces stop_reason and token usage in Vercel function logs so Sebastian
    // can see exactly what the API is doing on a failure.
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
      http_status: response.status,
      stop_reason: data.stop_reason || null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      duration_s: duration,
      content_blocks: (data.content || []).length,
      content_block_types: (data.content || []).map(function (b) { return b && b.type; }),
      first_200_chars: firstContent,
      api_error: data.error ? data.error.message : null
    }));
    // Sonnet 4.6 pricing as of April 2026: $3/M input, $15/M output
    const estCost = '$' + ((inputTokens * 3 / 1000000) + (outputTokens * 15 / 1000000)).toFixed(4);
    const status = response.ok ? 'success' : 'error: ' + (data.error ? data.error.message : response.status);

    logToGoogleForm('[' + mode + '] ' + userPrompt, status, duration, inputTokens, outputTokens, estCost).catch(function() {});

    return res.status(response.status).json(data);
  } catch (err) {
    const errDuration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    logToGoogleForm('[' + mode + '] ' + userPrompt, 'error: ' + err.message, errDuration, 0, 0, '$0').catch(function() {});
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
