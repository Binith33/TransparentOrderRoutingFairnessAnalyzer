const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { formatUserResponse } = require("../utils/userResponse");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    }
});

const assertOwnProfile = (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

router.post("/upload", auth, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ filePath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", auth, assertOwnProfile, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(formatUserResponse(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", auth, assertOwnProfile, async (req, res) => {
    try {
        const { name, email, profilePic } = req.body;
        const updates = {};

        if (name?.trim()) updates.name = name.trim();
        if (email?.trim()) updates.email = email.toLowerCase().trim();
        if (profilePic) updates.profilePic = profilePic;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile Updated Successfully",
            user: formatUserResponse(user)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
