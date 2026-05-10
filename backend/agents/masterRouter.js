const { runWithFallback } = require('./modelEngine');

const buildPrompt = (userMessage) => `
You are an intent router for an AI assistant called KYRO.
Analyze the user message and return ONLY a valid JSON object, no extra text, no markdown, no backticks.

Rules:
- "agents" is an array of which agents are needed: "email", "calendar", "research"
- Include only the agents actually needed
- For research: extract the company or person name as the query
- For calendar book: extract title, time, duration (default 60 mins)
- For calendar list: action is "list"
- For email fetch: action is "fetch"
- For email send: extract to, subject, body

Examples:

User: "research Razorpay"
{"agents":["research"],"research":{"query":"Razorpay"}}

User: "book a meeting tomorrow at 3pm"
{"agents":["calendar"],"calendar":{"action":"book","title":"Meeting","time":"tomorrow at 3pm","duration":60}}

User: "what meetings do i have today"
{"agents":["calendar"],"calendar":{"action":"list","time":"today"}}

User: "check my emails"
{"agents":["email"],"email":{"action":"fetch"}}

User: "send an email to john@example.com about the project update"
{"agents":["email"],"email":{"action":"send","to":"john@example.com","subject":"Project Update","body":"Hi John, here is a quick update on the project."}}

User: "research Razorpay, book a meeting tomorrow at 3pm and check my emails"
{"agents":["research","calendar","email"],"research":{"query":"Razorpay"},"calendar":{"action":"book","title":"Meeting","time":"tomorrow at 3pm","duration":60},"email":{"action":"fetch"}}

Now analyze this message and return ONLY the JSON:
"${userMessage}"
`;

const detectIntent = async (userMessage, preferredModelId = null) => {
  const prompt = buildPrompt(userMessage);
  const { text, usedModel } = await runWithFallback(prompt, preferredModelId);

  console.log(`Intent detected using: ${usedModel.provider}`);
  console.log('Raw response:', text);

  const cleaned = text.replace(/```json|```/g, '').trim();
  const intent = JSON.parse(cleaned);

  return { intent, usedModel };
};

const route = async (userMessage, userId, preferredModelId = null) => {
  console.log('=== KYRO MASTER ROUTER ===');
  console.log('Message:', userMessage);

  try {
    const { intent, usedModel } = await detectIntent(userMessage, preferredModelId);
    const results = {};

    const agentPromises = intent.agents.map(async (agent) => {
      if (agent === 'research') {
        results.research = {
          status: 'coming_in_phase_5',
          query: intent.research?.query,
          message: `Research agent for "${intent.research?.query}" will be built in Phase 5`
        };
      }
      if (agent === 'calendar') {
        results.calendar = {
          status: 'coming_in_phase_4',
          action: intent.calendar?.action,
          message: `Calendar agent will be built in Phase 4`
        };
      }
      if (agent === 'email') {
        results.email = {
          status: 'coming_in_phase_3',
          action: intent.email?.action,
          message: `Email agent will be built in Phase 3`
        };
      }
    });

    await Promise.all(agentPromises);

    return {
      message: userMessage,
      intent,
      results,
      usedModel: {
        id: usedModel.id,
        name: usedModel.name,
        provider: usedModel.provider,
        icon: usedModel.icon,
        color: usedModel.color
      }
    };

  } catch (err) {
    if (err.message?.includes('All models failed')) {
      throw new Error('ALL_MODELS_FAILED');
    }
    throw err;
  }
};

module.exports = { route, detectIntent };