const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const detectIntent = async (userMessage) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an intent router for an AI assistant called Kyro.
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
{"agents":["email"],"email":{"action":"send","to":"john@example.com","subject":"Project Update","body":"Hi John, I wanted to share a quick update on the project."}}

User: "research Razorpay, book a meeting tomorrow at 3pm and check my emails"
{"agents":["research","calendar","email"],"research":{"query":"Razorpay"},"calendar":{"action":"book","title":"Meeting","time":"tomorrow at 3pm","duration":60},"email":{"action":"fetch"}}

Now analyze this message and return ONLY the JSON:
"${userMessage}"
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  console.log('Gemini raw response:', text);

  const cleaned = text.replace(/```json|```/g, '').trim();
  const intent = JSON.parse(cleaned);

  console.log('Parsed intent:', JSON.stringify(intent, null, 2));
  return intent;
};

const route = async (userMessage, userId) => {
  console.log('=== MASTER ROUTER ===');
  console.log('Message:', userMessage);

  const intent = await detectIntent(userMessage);
  const results = {};

  const agentPromises = intent.agents.map(async (agent) => {
    console.log(`Running agent: ${agent}`);
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
    results
  };
};

module.exports = { route, detectIntent };