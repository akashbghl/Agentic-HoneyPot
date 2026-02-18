export async function getAgentReply(message = "") {
  const text = String(message || "").toLowerCase();

  //pick random reply
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const accountIssueReplies = [
    "What activity was detected on my account?",
    "Can you explain what the issue is with my account?",
    "When did this problem start?",
    "Is my account currently blocked?",
    "How can I verify this issue?",
    "What should I do to fix this?",
    "Has any money been deducted?",
    "Is this related to a recent transaction?",
    "Will I receive any confirmation message?",
    "Can you guide me through the process?"
  ];

  const otpReplies = [
    "Where should I send the OTP?",
    "Should I share the OTP with you now?",
    "Is it safe to share the OTP here?",
    "Do I need to generate a new OTP?",
    "How long is the OTP valid?",
    "Will this complete the verification?",
    "Is this required to unlock my account?",
    "Can you confirm why the OTP is needed?",
    "Should I wait for your instruction before sending it?",
    "Is this the final verification step?"
  ];

  const paymentReplies = [
    "Can you confirm the UPI ID again?",
    "What amount do I need to transfer?",
    "Is this a one-time payment?",
    "Will the money be refunded later?",
    "Should I transfer it immediately?",
    "Can you explain why this payment is required?",
    "Is this an official account?",
    "Will I receive a confirmation after payment?",
    "Is there any reference number for this?",
    "How soon will my issue be resolved after payment?"
  ];

  const rewardReplies = [
    "How do I claim this reward?",
    "Is this offer still valid?",
    "Do I need to verify anything first?",
    "Where can I see the official details?",
    "Is there any deadline for this?",
    "Will the reward be credited to my account?",
    "Do I need to pay any processing fee?",
    "Can you explain how this works?",
    "Is this linked to my existing account?",
    "Will I get confirmation after claiming?"
  ];

  const linkReplies = [
    "Should I open that link now?",
    "Is this the official website?",
    "What happens after I click the link?",
    "Do I need to log in there?",
    "Is the link safe to use?",
    "Will this resolve the issue?",
    "Do I need to fill any form?",
    "Is there any other way to verify?",
    "Can you confirm the purpose of the link?",
    "Should I access it from my phone?"
  ];

  const generalReplies = [
    "Could you please explain what I need to do?",
    "Can you clarify that for me?",
    "What is the next step?",
    "How should I proceed?",
    "Can you guide me step by step?",
    "Is there anything else required?",
    "Can you provide more details?",
    "Should I take any action now?",
    "What happens if I don't act immediately?",
    "Is this urgent?"
  ];

  if (text.includes("otp") || text.includes("password") || text.includes("pin")) {
    return pick(otpReplies);
  }

  if (
    text.includes("transfer") ||
    text.includes("upi") ||
    text.includes("payment") ||
    text.includes("amount")
  ) {
    return pick(paymentReplies);
  }

  if (
    text.includes("blocked") ||
    text.includes("suspend") ||
    text.includes("account") ||
    text.includes("verify") ||
    text.includes("kyc")
  ) {
    return pick(accountIssueReplies);
  }

  if (
    text.includes("reward") ||
    text.includes("cashback") ||
    text.includes("lottery") ||
    text.includes("prize")
  ) {
    return pick(rewardReplies);
  }

  if (text.includes("http") || text.includes("www") || text.includes("link")) {
    return pick(linkReplies);
  }

  return pick(generalReplies);
}














// This module defines the agent's behavior in responding to messages.


// import groq from "./groqClient.js";

// export async function getAgentReply(message, history = []) {
//   try {
//     const safeMessage = String(message || "").slice(0, 2000);

//     // Convert session history correctly
//     const chatHistory = history.map(h => ({
//       role: h.sender === "agent" ? "assistant" : "user",
//       content: String(h.text || "").slice(0, 1000)
//     }));

//     const res = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a 48-year-old bank customer.

// You believe the caller is legitimate.
// You are polite, slightly confused, and cooperative.

// Your goal is to keep the conversation going
// and ask short clarification questions so the caller reveals
// more details such as links, account numbers, UPI IDs, or instructions.

// Rules:
// - Respond in 1–2 short sentences only.
// - Maximum 30 words.
// - No long explanations.
// - No repetition.
// - No emotional exaggeration.
// - Never reveal real personal information.
// - Never show suspicion.
// - Do not mention being an AI.
// - Stay natural and human-like.
// `
//         },
//         ...chatHistory,
//         {
//           role: "user",
//           content: safeMessage
//         }
//       ],
//       temperature: 0.4,     // more controlled
//       max_tokens: 60        // prevent long replies
//     });

//     const reply = res?.choices?.[0]?.message?.content || "Okay.";
//     return reply.trim().slice(0, 200); // hard safety cut

//   } catch (error) {
//     console.error("Agent reply error:", error);
//     return "Could you please explain that again?";
//   }
// }