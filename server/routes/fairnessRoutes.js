const express = require("express");

const Order = require("../models/Order");

const router = express.Router();
const auth = require("../middleware/auth");

router.get("/report", auth, async (req, res) => {

    try {

        const orders = await Order.find({ userId: req.user.id });

        if (orders.length === 0) {

            return res.json({
                message: "No Orders Found",
                totalOrders: 0,
                averageLatency: 0,
                fairnessScore: 0,
                exchangeFairness: 0,
                latencyFairness: 0,
                nseOrders: 0,
                bseOrders: 0,
                nseShare: 0,
                bseShare: 0,
                rating: "No Data",
                statusColor: "#64748b"
            });

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
        const fairnessScore =
            exchangeFairness * 0.6 + latencyFairness * 0.4;

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

        res.json({
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
            statusColor: color
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;
