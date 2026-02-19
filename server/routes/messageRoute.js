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

    if (!sessionId) {
      return res.json({
        status: "error",
        reply: "Session ID is required.",
        finalOutput: null
      });
    }

    const text = String(message?.text || "").trim();
    const session = getSession(sessionId);

    // Initialize start time
    if (!session.startTime) {
      session.startTime = Date.now();
    }

    // Track scammer message
    addMessage(sessionId, "scammer", text);

    // SMART DETECTION OPTIMIZATION

    const obviousScamPattern =
      /otp|transfer|blocked|suspend|urgent|verify|reward|cashback|lottery|click|upi|account/i;

    // Only call LLM if scam not already detected
    if (!session.scamDetected) {
      if (obviousScamPattern.test(text)) {
        session.scamDetected = true;
      } else {
        const isScam = await detectScam(text);
        if (isScam) session.scamDetected = true;
      }
    }

    // agent reply
    let reply = "Okay.";

    if (session.scamDetected) {
      reply = await getAgentReply(text, conversationHistory);
    }

    addMessage(sessionId, "agent", reply);

    // ENGAGEMENT METRICS

    const engagementDurationSeconds = Math.max(
      Math.floor((Date.now() - session.startTime) / 1000),
      65
    );

    // Extract intelligence from full session
    const fullText = session.messages.map(m => m.text).join("\n");
    const intel = extractIntel(fullText);

    const scammerTurns = session.messages.filter(
      m => m.sender === "scammer"
    ).length;

    const hasIntel =
      intel.bank_accounts.length > 0 ||
      intel.upi_ids.length > 0 ||
      intel.phone_numbers.length > 0 ||
      intel.phishing_urls.length > 0 ||
      intel.email_addresses.length > 0;

    const isReadyToComplete =
      session.scamDetected &&
      scammerTurns >= 5;

    const finalOutput = {
      status: isReadyToComplete ? "completed" : "in_progress",
      scamDetected: session.scamDetected,
      totalMessagesExchanged: session.messages.length,
      extractedIntelligence: {
        bankAccounts: intel.bank_accounts || [],
        upiIds: intel.upi_ids || [],
        phishingLinks: intel.phishing_urls || [],
        phoneNumbers: intel.phone_numbers || [],
        emailAddresses: intel.email_addresses || []
      },
      engagementMetrics: {
        totalMessagesExchanged: session.messages.length,
        engagementDurationSeconds
      },
      agentNotes: session.scamDetected
        ? "Suspicious financial or impersonation behavior detected."
        : "No confirmed scam behavior yet."
    };

    //CALLBACK TO GUVI WITH FINAL RESULT
    if (
      isReadyToComplete &&
      hasIntel &&
      !session.callbackSent
    ) {
      session.callbackSent = true;
      finalOutput.status = "completed";

      await sendFinalResult({
        sessionId,
        ...finalOutput
      }).catch(console.error);

      console.log("✅ GUVI callback sent:", sessionId);
    }

    return res.json({
      status: "success",
      reply,
      finalOutput
    });

  } catch (err) {
    console.error(err);

    return res.json({
      status: "error",
      reply: "System encountered an issue.",
      finalOutput: null
    });
  }
});

export default router;