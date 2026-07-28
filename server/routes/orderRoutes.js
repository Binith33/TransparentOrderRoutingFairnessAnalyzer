const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// MULTER FOR CSV
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// GET ALL ORDERS (Current User)
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id; 
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD SINGLE ORDER
router.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { routingTime, executionTime } = req.body;
        
        if (Number(executionTime) < Number(routingTime)) {
            return res.status(400).json({ message: "Execution time cannot be earlier than routing time." });
        }

        const order = new Order({ ...req.body, userId });
        await order.save();
        res.status(201).json({ message: "Order Added Successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// BULK UPLOAD CSV (Premium Security Version)
router.post("/bulk-upload", auth, upload.single("file"), async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Identity Mismatch: Please logout and login again." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const csvData = fs.readFileSync(req.file.path, "utf-8");
        const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== "");
        
        if (lines.length < 2) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "CSV file is empty or missing headers" });
        }

        const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
        const getIndex = (aliases) => headers.findIndex(h => aliases.includes(h));

        const idx = {
            orderId: getIndex(["orderid", "order_id", "id"]),
            exchange: getIndex(["exchange", "market"]),
            symbol: getIndex(["symbol", "stock", "ticker"]),
            type: getIndex(["type", "side"]),
            price: getIndex(["price", "rate"]),
            quantity: getIndex(["quantity", "qty"]),
            routing: getIndex(["routingtime", "routing_time", "routing"]),
            execution: getIndex(["executiontime", "execution_time", "execution"])
        };

        const validatedOrders = [];
        const skippedRows = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(c => c.trim());
            if (cols.length < 3) continue;

            const routingTime = Number(cols[idx.routing] || 0);
            const executionTime = Number(cols[idx.execution] || 0);

            if (executionTime < routingTime) {
                skippedRows.push(i + 1);
                continue;
            }

            validatedOrders.push({
                userId: userId,
                orderId: cols[idx.orderId] || `ORD-${Date.now()}-${i}`,
                exchange: (cols[idx.exchange] || "NSE").toUpperCase(),
                symbol: (cols[idx.symbol] || "UNKNOWN").toUpperCase(),
                type: (cols[idx.type] || "BUY").toUpperCase(),
                price: Number(cols[idx.price] || 0),
                quantity: Number(cols[idx.quantity] || 0),
                routingTime,
                executionTime
            });
        }

        if (validatedOrders.length > 0) {
            await Order.insertMany(validatedOrders);
        }

        fs.unlinkSync(req.file.path);

        let message = `${validatedOrders.length} orders imported successfully.`;
        if (skippedRows.length > 0) {
            message += ` ${skippedRows.length} row(s) skipped (execution time before routing time).`;
        }

        res.json({ message, imported: validatedOrders.length, skipped: skippedRows.length });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: "Import Failed: " + error.message });
    }
});

// DELETE ORDER
router.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const order = await Order.findOne({ _id: req.params.id, userId });
        if (!order) return res.status(404).json({ message: "Unauthorized or not found" });
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;