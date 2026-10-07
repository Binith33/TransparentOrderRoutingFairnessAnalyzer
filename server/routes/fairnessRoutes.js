const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
const auth = require("../middleware/auth");
const { calculateFairnessReport } = require("../services/fairnessService");

router.get("/report", auth, async (req, res) => {
    try {
        const orders = await Order.find();
        
        // Delegate all heavy calculations to the Service Layer
        const report = calculateFairnessReport(orders);

        res.json(report);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
