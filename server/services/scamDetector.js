import groq from "./groqClient.js";

export async function detectScam(message) {
  const safeMessage = String(message || "");

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a strict scam classifier.

Reply only YES or NO.

Classify as YES only if the message clearly includes:
- Impersonation (bank, government, support, etc.)
- Urgency or threat
- Request to transfer money
- Request for OTP, password, or sensitive info
- Financial redirection or account manipulation

If the message only contains:
- A UPI ID
- General payment discussion
- Neutral financial information
- No urgency or impersonation

Then reply NO.

Do not guess. Be conservative.
`,
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
    .trim() === "YES";
}
