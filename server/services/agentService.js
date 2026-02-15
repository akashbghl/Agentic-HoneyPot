import groq from "./groqClient.js";

export async function getAgentReply(message, history) {
    // Converting history into chat messages, so Groq understands
    const chatHistory = history.map(h => ({
        role: h.sender === "user" ? "assistant" : "user",
        content: h.text || ""
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

Your goal is to continue the conversation naturally
and ask short clarification questions so the caller reveals
more details such as links, account numbers, UPI IDs, or instructions.

Respond briefly (1–2 sentences maximum).
Do not over-explain.
Do not write long paragraphs.
Do not repeat yourself.
Keep responses natural and realistic.

Never show suspicion.
Never act smart.
Never expose personal sensitive information.
Act like a normal human victim.
`,
            },
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
