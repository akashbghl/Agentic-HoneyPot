import express from "express";
const router = express.Router();

import { detectScam } from "../services/scamDetector.js";
import { getAgentReply } from "../services/agentService.js";
import { extractIntel } from "../services/intelligenceExtractor.js";
import { getHistory, saveMessage } from "../services/memoryStore.js";

router.post("/message", async (req, res) => {
  try {
    const { conversation_id, message } = req.body;

    const history = getHistory(conversation_id);

    const isScam = await detectScam(message, history);

    let reply = "Okay.";

    if (isScam) {
      reply = await getAgentReply(message, history);
    }

    saveMessage(conversation_id, message, reply);

    const intel = extractIntel(message);

    res.json({
      is_scam: isScam,
      agent_reply: reply,
      extracted_intelligence: intel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
