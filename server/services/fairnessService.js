const { detectAnomalies } = require("../utils/aiAnalytics");
const { sendAlertEmail } = require("../utils/emailService");

let lastEmailSent = 0;

/**
 * Calculates the Fairness Report and generates AI Insights based on a list of orders.
 * Follows the MVC Service Layer pattern to isolate business logic from HTTP routing.
 * @param {Array} orders - List of Order documents from the database.
 * @returns {Object} report - The calculated fairness report object.
 */
const calculateFairnessReport = (orders) => {
    if (!orders || orders.length === 0) {
        return {
            message: "No Orders Found",
            totalOrders: 0,
            averageLatency: 0,
            latencyFairness: 0,
            nseOrders: 0,
            bseOrders: 0,
            nseShare: 0,
            bseShare: 0,
            rating: "No Data",
            statusColor: "#64748b",
            aiInsights: { summary: "No data available." }
        };
    }

    let totalLatency = 0;

    orders.forEach((order) => {
        totalLatency += Number(order.executionTime) - Number(order.routingTime);
    });

    const averageLatency = totalLatency / orders.length;

    const nseOrders = orders.filter((o) => o.exchange === "NSE").length;
    const bseOrders = orders.filter((o) => o.exchange === "BSE").length;
    const nseShare = (nseOrders / orders.length) * 100;
    const bseShare = (bseOrders / orders.length) * 100;

    const exchangeBias = Math.abs(nseShare - 50);
    const exchangeFairness = Math.max(0, 100 - exchangeBias * 2);
    const latencyFairness = Math.max(0, 100 - averageLatency);
    const fairnessScore = exchangeFairness * 0.6 + latencyFairness * 0.4;

    let rating = "Highly Fair";
    let color = "#059669";

    if (fairnessScore < 75) {
        rating = "Fair (Minor Bias)";
        color = "#f59e0b";
    }

    if (fairnessScore < 50) {
        rating = "Review Required";
        color = "#ef4444";
    }

    // Pass orders through the AI anomaly detection algorithm
    const formattedOrders = orders.map(o => ({
        exchange: o.exchange,
        latencyMs: Number(o.executionTime) - Number(o.routingTime)
    }));
    const aiInsights = detectAnomalies(formattedOrders);

    // Send Email Alert if anomalies are severe (Debounced to once per minute)
    if (aiInsights.anomalyLevel === "HIGH") {
        const now = Date.now();
        if (now - lastEmailSent > 60000) { // 60 seconds
            sendAlertEmail("admin@torfa.com", aiInsights);
            lastEmailSent = now;
        }
    }

    return {
        totalOrders: orders.length,
        averageLatency,
        fairnessScore,
        exchangeFairness,
        latencyFairness,
        nseOrders,
        bseOrders,
        nseShare,
        bseShare,
        rating,
        statusColor: color,
        aiInsights
    };
};

module.exports = { calculateFairnessReport };
