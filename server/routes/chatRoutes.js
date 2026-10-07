const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const { detectAnomalies } = require("../utils/aiAnalytics");

router.post("/", auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ reply: "Please enter a message." });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({
                reply: "AI assistant is in offline mode. Add GEMINI_API_KEY to server/.env to enable live responses."
            });
        }

        const orders = await Order.find({ userId: req.user.id });
        let context = "The user has no orders loaded yet.";

        if (orders.length > 0) {
            const nse = orders.filter((o) => o.exchange === "NSE").length;
            const bse = orders.filter((o) => o.exchange === "BSE").length;
            
            const formattedOrders = orders.map(o => ({
                exchange: o.exchange,
                latencyMs: Number(o.executionTime) - Number(o.routingTime)
            }));
            
            const avgLatency = formattedOrders.reduce((sum, o) => sum + o.latencyMs, 0) / orders.length;
            const aiInsights = detectAnomalies(formattedOrders);

            context = `
                User has processed ${orders.length} orders. 
                Exchange Distribution: NSE (${nse}), BSE (${bse}). 
                Average latency: ${avgLatency.toFixed(2)}ms.
                System AI Anomaly Status: ${aiInsights.summary}
                System Prediction: ${aiInsights.prediction}
                NSE Recent Anomalies: ${aiInsights.nseMetrics.recentAnomalies}
                BSE Recent Anomalies: ${aiInsights.bseMetrics.recentAnomalies}
            `;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are the TORFA (Transparent Order Routing Fairness Analyzer) AI Assistant.
You help financial analysts understand fairness scores, routing latency (NSE vs BSE), exchange distribution bias, and compliance reports.
Keep answers professional, practical, and highly formatted.
CRITICAL: You MUST use Markdown formatting in your responses! Use **bold text** for emphasis, use lists or bullet points for readability, and use Markdown Tables to present numerical data or comparisons whenever possible.
If the user asks about their data or anomalies, reference the context below. If there are anomalies, suggest investigating the specific exchange.
Current live data context for this user: ${context}

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
