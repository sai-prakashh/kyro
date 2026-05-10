const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const aiModels = require('../config/aiModels');

// Call a single model
const callModel = async (model, prompt) => {
  if (model.type === 'gemini') {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const gemini = genAI.getGenerativeModel({ model: model.model });
    const result = await gemini.generateContent(prompt);
    return result.response.text().trim();
  }

  if (model.type === 'openai-compatible') {
    const client = new OpenAI({
      apiKey: process.env[model.envKey],
      baseURL: model.baseURL
    });
    const res = await client.chat.completions.create({
      model: model.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.1
    });
    return res.choices[0].message.content.trim();
  }

  throw new Error(`Unknown model type: ${model.type}`);
};

// Auto-fallback chain — tries each model in priority order
const runWithFallback = async (prompt, preferredModelId = null) => {
  // Sort models — preferred first, then by priority
  const ordered = [...aiModels].sort((a, b) => {
    if (preferredModelId) {
      if (a.id === preferredModelId) return -1;
      if (b.id === preferredModelId) return 1;
    }
    return a.priority - b.priority;
  });

  let lastError = null;

  for (const model of ordered) {
    try {
      console.log(`[ModelEngine] Trying: ${model.provider} — ${model.name}`);
      const text = await callModel(model, prompt);
      console.log(`[ModelEngine] Success: ${model.provider}`);
      return {
        text,
        usedModel: model
      };
    } catch (err) {
      const isQuota = err.status === 429 ||
        err.message?.includes('quota') ||
        err.message?.includes('rate') ||
        err.message?.includes('limit') ||
        err.message?.includes('Too Many');

      console.warn(`[ModelEngine] ${model.provider} failed: ${err.message}`);

      if (isQuota || err.status === 503 || err.status === 500) {
        lastError = err;
        continue; // try next model
      }

      // Non-quota error (bad key, wrong model name etc) — still try next
      lastError = err;
      continue;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
};

// Get all models with their status (for frontend display)
const getModelStatus = () => {
  return aiModels.map(m => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    icon: m.icon,
    color: m.color,
    free: m.free,
    priority: m.priority
  }));
};

module.exports = { runWithFallback, getModelStatus, callModel };