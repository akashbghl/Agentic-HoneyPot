import groq from "./groqClient.js";

export async function detectScam(message) {
  try {
    const safeMessage = String(message || "").slice(0, 2000); // safety limit

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a strict scam classification engine.

Respond with ONLY one word:
YES
or
NO

Return YES only if the message clearly contains:
- Impersonation (bank, government, customer support, etc.)
- Urgency or threat (e.g., "blocked", "suspended", "expires soon")
- Request for OTP, password, or sensitive information
- Request to transfer money
- Financial redirection or account manipulation

Return NO if:
- The message is neutral
- Contains only a UPI ID or payment reference
- General conversation
- No clear malicious intent

Do not explain.
Do not add punctuation.
Do not output anything except YES or NO.
`,
        },
        {
          role: "user",
          content: safeMessage,
        },
      ],
      temperature: 0,
      max_tokens: 3, // force short output
    });

    const raw = res?.choices?.[0]?.message?.content || "";
    const normalized = raw.toUpperCase().trim();

    if (normalized.startsWith("YES")) return true;
    if (normalized.startsWith("NO")) return false;

    // Fallback safety: conservative false
    return false;

  } catch (error) {
    console.error("Scam detection error:", error);

    // Fail-safe: do not falsely mark as scam on API failure
    return false;
  }
}