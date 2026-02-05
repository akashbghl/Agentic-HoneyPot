import groq from "./groqClient.js";

export async function getAgentReply(message, history) {
  const historyText = history
    .map((h) => `Scammer: ${h.user}\nYou: ${h.agent}`)
    .join("\n");

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a 48-year-old bank customer.
You think the scammer is genuine.
Be polite, curious, slightly confused.

Goal: keep conversation going and ask questions to understand what to do.
Never reveal suspicion.
`,
      },
      {
        role: "user",
        content: `
Conversation so far:
${historyText}

Scammer: ${message}
You:`,
      },
    ],
    temperature: 0.8,
  });

  return res.choices[0].message.content.trim();
}

