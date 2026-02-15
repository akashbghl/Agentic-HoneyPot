import groq from "./groqClient.js";

export async function detectScam(message) {
  const safeMessage = String(message || "");

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [ 
      {
        role: "system",
        content: "Reply only YES or NO. Is this message a scam attempt?",
      },
      {
        role: "user",
        content: safeMessage, 
      },
    ],
    temperature: 0,
  });

  return res.choices[0].message.content
    .toUpperCase()
    .includes("YES");
}
