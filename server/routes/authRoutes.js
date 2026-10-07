const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { formatUserResponse } = require("../utils/userResponse");
const { logAction } = require("../utils/logger");

const createToken = (user) =>
    jwt.sign({ id: user._id, systemRole: user.systemRole }, process.env.JWT_SECRET, { expiresIn: "10d" });

// REGISTER

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser =
            await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({

            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone || "",
            role: "Fairness Analyst",
            systemRole: req.body.role === "admin" ? "admin" : "analyst",
            accountStatus: "Active",
            password: hashedPassword
        });

        await user.save();

        const token = createToken(user);
        await logAction(user._id, "REGISTER", "User registered a new account");

        res.status(201).json({
            message: "Registration Successful",
            token,
            user: formatUserResponse(user)

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// LOGIN

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {

            return res.status(400).json({

                message:
                    "User Not Found"

            });

        }

        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {

            return res.status(400).json({

                message:
                    "Wrong Password"

            });

        }

        const token = createToken(user);
        await logAction(user._id, "LOGIN", "User logged into the system");

        res.json({
            message: "Login Successful",
            token,
            user: formatUserResponse(user)

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;