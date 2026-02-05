import groq from "./groqClient.js";

export async function getAgentReply(message, history) {
  // Convert their history into chat messages Groq understands
  const chatHistory = history.map((h) => ({
    role: h.role === "agent" ? "assistant" : "user",
    content: h.message,
  }));

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a 48-year-old bank customer.

You fully believe the scammer is legitimate.
You are polite, curious, slightly confused, and cooperative.

Your goal is to keep the conversation going and ask helpful questions
so the scammer shares more details like links, account numbers, or payment methods.

Never reveal suspicion.
Never act smart.
Act like a normal human victim.
`,
      },

      // ✅ Proper multi-turn memory from their API
      ...chatHistory,

      // Latest scammer message
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.8,
  });

  return res.choices[0].message.content.trim();
}
