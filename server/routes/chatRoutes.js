const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

router.post("/", auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ reply: "Please enter a message." });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({
                reply: "AI assistant is in offline mode. Add GEMINI_API_KEY to server/.env to enable live responses. You can still ask about fairness scores, latency, NSE/BSE distribution, and PDF reports from the Analytics page."
            });
        }

        const orders = await Order.find({ userId: req.user.id });
        let context = "The user has no orders loaded yet.";

        if (orders.length > 0) {
            const nse = orders.filter((o) => o.exchange === "NSE").length;
            const bse = orders.filter((o) => o.exchange === "BSE").length;
            const avgLatency =
                orders.reduce(
                    (sum, o) => sum + (Number(o.executionTime) - Number(o.routingTime)),
                    0
                ) / orders.length;

            context = `User has ${orders.length} orders. NSE: ${nse}, BSE: ${bse}. Average latency: ${avgLatency.toFixed(2)}ms.`;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are the TORFA (Transparent Order Routing Fairness Analyzer) AI Assistant.
You help financial analysts understand fairness scores, routing latency (NSE vs BSE), exchange distribution bias, and compliance reports.
Keep answers concise, professional, and practical.
Current user context: ${context}
User question: ${message.trim()}`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            reply: "Sorry, I could not reach the AI service right now. Try again later or use the Dashboard and Analytics pages."
        });
    }
});

module.exports = router;
