import express from "express";
const router = express.Router();

import { checkApiKey } from "../middleware/auth.js";
import { detectScam } from "../services/scamDetector.js";
import { getAgentReply } from "../services/agentService.js";
import { extractIntel } from "../services/intelligenceExtractor.js";
import { getSession, addMessage } from "../services/sessionStore.js";
import { sendFinalResult } from "../services/guviCallback.js";

router.post("/message", checkApiKey, async (req, res) => {
  try {
    const { message, conversationHistory = [], sessionId } = req.body;

    const text = String(message?.text || "");
    const session = getSession(sessionId);

    // Track scammer message
    addMessage(sessionId, "scammer", text);

    const isScam = await detectScam(text);
    if (isScam) session.scamDetected = true;

    let reply = "Okay.";

    if (isScam) {
      reply = await getAgentReply(text, conversationHistory);
    }

    // Track agent reply
    addMessage(sessionId, "agent", reply);

    // ✅ Trigger GUVI callback after enough engagement
    if (
      session.scamDetected &&
      session.messages.length >= 8 &&
      !session.callbackSent
    ) {
      const fullText = session.messages.map(m => m.text).join("\n");
      const intel = extractIntel(fullText);

      await sendFinalResult({
        sessionId,
        scamDetected: true,
        totalMessagesExchanged: session.messages.length,
        extractedIntelligence: {
          bankAccounts: intel.bank_accounts,
          upiIds: intel.upi_ids,
          phishingLinks: intel.phishing_urls,
          phoneNumbers: intel.phone_numbers,
          suspiciousKeywords: intel.suspicious_keywords,
        },
        agentNotes:
          "Scammer used urgency, fear tactics, and payment redirection.",
      });

      session.callbackSent = true;
      console.log("✅ GUVI callback sent for session:", sessionId);
    }

    // ✅ Required tester response
    return res.json({
      status: "success",
      reply: reply,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal error",
    });
  }
});

export default router;
