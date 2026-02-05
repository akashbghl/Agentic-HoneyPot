import express from "express";
const router = express.Router();

import { checkApiKey } from "../middleware/auth.js";
import { detectScam } from "../services/scamDetector.js";
import { getAgentReply } from "../services/agentService.js";
import { extractIntel } from "../services/intelligenceExtractor.js";

router.post("/message", checkApiKey, async (req, res) => {
    try {
        const {
            conversation_id,
            message,
            history = [] // Comes from mock scammer api
        } = req.body;

        // Detect scam
        const isScam = await detectScam(message, history);

        let agentReply = "Okay.";

        // If scam → activate honey agent
        if (isScam) {
            agentReply = await getAgentReply(message, history);
        }

        // Combine everything for intel extraction
        const combinedText = [
            ...history.map(h => h.message || ""),
            message,
            agentReply
        ].join("\n");


        const intel = extractIntel(combinedText);

        return res.json({
            is_scam: isScam,
            agent_reply: agentReply,
            extracted_intelligence: {
                upi_ids: intel.upi_ids || [],
                bank_accounts: intel.bank_accounts || [],
                phishing_urls: intel.phishing_urls || []
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
