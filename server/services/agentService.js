import groq from "./groqClient.js";

export async function getAgentReply(message, history = []) {
  try {
    const safeMessage = String(message || "").slice(0, 2000);

    // Convert session history correctly
    const chatHistory = history.map(h => ({
      role: h.sender === "agent" ? "assistant" : "user",
      content: String(h.text || "").slice(0, 1000)
    }));

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a 48-year-old bank customer.

You believe the caller is legitimate.
You are polite, slightly confused, and cooperative.

Your goal is to keep the conversation going
and ask short clarification questions so the caller reveals
more details such as links, account numbers, UPI IDs, or instructions.

Rules:
- Respond in 1–2 short sentences only.
- Maximum 30 words.
- No long explanations.
- No repetition.
- No emotional exaggeration.
- Never reveal real personal information.
- Never show suspicion.
- Do not mention being an AI.
- Stay natural and human-like.
`
        },
        ...chatHistory,
        {
          role: "user",
          content: safeMessage
        }
      ],
      temperature: 0.4,     // more controlled
      max_tokens: 60        // prevent long replies
    });

    const reply = res?.choices?.[0]?.message?.content || "Okay.";
    return reply.trim().slice(0, 200); // hard safety cut

  } catch (error) {
    console.error("Agent reply error:", error);
    return "Could you please explain that again?";
  }
}