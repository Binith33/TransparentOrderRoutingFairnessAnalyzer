const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: String,
    exchange: String,
    symbol: String,
    type: String,
    price: Number,
    quantity: Number,
    brokerId: {
        type: String,
        default: "Zerodha"
    },
    routingTime: Number,
    executionTime: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);