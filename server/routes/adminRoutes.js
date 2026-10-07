const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// Middleware to check if user is admin
const adminCheck = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.systemRole !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admin role required." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error verifying admin role." });
    }
};

// Get all users (Admin only)
router.get("/users", auth, adminCheck, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all audit logs (Admin only)
router.get("/logs", auth, adminCheck, async (req, res) => {
    try {
        const logs = await AuditLog.find().populate("user", "name email").sort({ createdAt: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Make a user an admin (Super Admin only, but simplified for Phase 2 demo)
router.put("/make-admin/:id", auth, adminCheck, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { systemRole: "admin" }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
