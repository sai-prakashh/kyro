const aiModels = [
  {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    model: 'gemini-2.5-flash',
    type: 'gemini',
    icon: '✦',
    color: '#4285F4',
    free: true,
    priority: 1
  },
  {
    id: 'groq',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    model: 'llama-3.3-70b-versatile',
    type: 'openai-compatible',
    baseURL: 'https://api.groq.com/openai/v1',
    envKey: 'GROQ_API_KEY',
    icon: '⚡',
    color: '#F55036',
    free: true,
    priority: 2
  },
  {
    id: 'cerebras',
    name: 'Llama 3.3 70B',
    provider: 'Cerebras',
    model: 'llama3.3-70b',
    type: 'openai-compatible',
    baseURL: 'https://api.cerebras.ai/v1',
    envKey: 'CEREBRAS_API_KEY',
    icon: '🧠',
    color: '#00C9A7',
    free: true,
    priority: 3
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    provider: 'Mistral',
    model: 'mistral-large-latest',
    type: 'openai-compatible',
    baseURL: 'https://api.mistral.ai/v1',
    envKey: 'MISTRAL_API_KEY',
    icon: '🌊',
    color: '#FF7000',
    free: true,
    priority: 4
  },
  {
    id: 'sambanova',
    name: 'Llama 4 Scout',
    provider: 'SambaNova',
    model: 'Meta-Llama-4-Scout-17B-16E-Instruct',
    type: 'openai-compatible',
    baseURL: 'https://api.sambanova.ai/v1',
    envKey: 'SAMBANOVA_API_KEY',
    icon: '🔮',
    color: '#7C3AED',
    free: true,
    priority: 5
  }
];

module.exports = aiModels;