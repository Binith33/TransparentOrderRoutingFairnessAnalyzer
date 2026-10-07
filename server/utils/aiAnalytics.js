// Advanced AI & Predictive Analytics Module
// Calculates moving averages, standard deviations, and detects routing anomalies.

const calculateZScore = (value, mean, stdDev) => {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
};

const detectAnomalies = (orders) => {
    if (!orders || orders.length < 10) return { anomalies: [], summary: "Insufficient data for AI detection." };

    // Separate by exchange
    const nseOrders = orders.filter(o => o.exchange === "NSE");
    const bseOrders = orders.filter(o => o.exchange === "BSE");

    const analyzeExchange = (exchangeOrders) => {
        if (exchangeOrders.length === 0) return { mean: 0, stdDev: 0, recentAnomalies: 0 };
        
        const latencies = exchangeOrders.map(o => o.latencyMs || 0);
        const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        
        const variance = latencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / latencies.length;
        const stdDev = Math.sqrt(variance);

        // Check the last 5 orders for anomalies (Z-score > 2, meaning it's 2 standard deviations away)
        const recentOrders = exchangeOrders.slice(-5);
        let recentAnomalies = 0;
        recentOrders.forEach(o => {
            const zScore = calculateZScore(o.latencyMs, mean, stdDev);
            if (zScore > 2) {
                recentAnomalies++;
            }
        });

        return { mean, stdDev, recentAnomalies };
    };

    const nseAnalysis = analyzeExchange(nseOrders);
    const bseAnalysis = analyzeExchange(bseOrders);

    let summary = "AI Analysis Normal: Routing latencies are within expected statistical bounds.";
    let anomalyLevel = "LOW";

    if (nseAnalysis.recentAnomalies > 1 || bseAnalysis.recentAnomalies > 1) {
        summary = "AI Alert: Detected statistically significant latency spikes in recent routing.";
        anomalyLevel = "HIGH";
    }

    // Predictive Insight: if mean latency of one is >20% higher than the other
    let prediction = "Routing is balanced.";
    if (nseAnalysis.mean > bseAnalysis.mean * 1.2) {
        prediction = "Prediction: The system is heavily favoring BSE due to prolonged NSE congestion.";
    } else if (bseAnalysis.mean > nseAnalysis.mean * 1.2) {
        prediction = "Prediction: The system is heavily favoring NSE due to prolonged BSE congestion.";
    }

    return {
        nseMetrics: nseAnalysis,
        bseMetrics: bseAnalysis,
        summary,
        anomalyLevel,
        prediction
    };
};

module.exports = { detectAnomalies };
