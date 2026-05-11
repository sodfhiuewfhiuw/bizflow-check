export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      mode: 'fallback',
      summary: '目前尚未設定 OPENAI_API_KEY，前端會使用規則式報告。',
      nextSteps: [],
      salesCopy: '',
      caution: 'API key must stay on the server side only.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { data = {}, score = {}, ruleReport = '' } = body;

    const prompt = buildPrompt(data, score, ruleReport);
    const ai = await callOpenAI(apiKey, prompt);
    return res.status(200).json({ mode: 'ai', ...ai });
  } catch (error) {
    console.error('[generate-report]', error);
    return res.status(200).json({
      mode: 'fallback',
      summary: 'AI 報告暫時無法產生，已保留規則式健檢結果。',
      nextSteps: [],
      salesCopy: '',
      caution: 'Fallback triggered; rule-based score remains the source of truth.'
    });
  }
}

function buildPrompt(data, score, ruleReport) {
  return `你是小公司 AI 業務與內部流程自動化顧問。請根據規則式分數產生繁體中文摘要。

重要限制：
1. 不可推翻規則式分數與部署等級。
2. 不可建議自動私訊、群發、自然人個資反查、人肉搜尋。
3. CDP/自動登入只能列高風險客製，不可當 SaaS 標準功能。
4. 請輸出 JSON，不要 markdown。

輸出 schema：
{
  "summary": "80-140字，給客戶看的顧問摘要",
  "nextSteps": ["三個具體下一步"],
  "salesCopy": "一句 CTA，導向預約30分鐘流程診斷或留下聯絡方式拿完整報告",
  "caution": "一句風險提醒"
}

輸入資料：
${JSON.stringify({ data, score }, null, 2)}

規則式報告：
${ruleReport}`;
}

async function callOpenAI(apiKey, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: '你只輸出有效 JSON。用繁體中文，口吻清楚、務實、偏顧問式。' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text.slice(0, 500)}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    summary: String(parsed.summary || '').slice(0, 500),
    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.slice(0, 3).map(String) : [],
    salesCopy: String(parsed.salesCopy || '').slice(0, 240),
    caution: String(parsed.caution || '').slice(0, 240)
  };
}
