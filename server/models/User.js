const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: "Fairness Analyst"
    },

    systemRole: {
        type: String,
        enum: ['admin', 'analyst'],
        default: 'analyst'
    },

    accountStatus: {
        type: String,
        default: "Active"
    },

    profilePic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    }


},
{
    timestamps: true
});

module.exports = mongoose.model(
    "User",
    UserSchema
);