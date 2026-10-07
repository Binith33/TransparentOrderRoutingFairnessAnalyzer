const Order = require("../models/Order");
const User = require("../models/User");

// Generates a random realistic order
const generateRandomOrder = async () => {
    // Get the first user to attach simulated orders to, so they show up on the dashboard
    const user = await User.findOne().sort({ _id: -1 });
    if (!user) return null;

    const exchanges = ["NSE", "BSE"];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    
    const brokers = ["Zerodha", "Groww", "Upstox"];
    const brokerId = brokers[Math.floor(Math.random() * brokers.length)];

    const rTime = Date.now() - Math.floor(Math.random() * 5000);
    
    let executionDelay;
    if (brokerId === "Zerodha") {
        executionDelay = exchange === "NSE" ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 25) + 10;
    } else if (brokerId === "Groww") {
        executionDelay = exchange === "NSE" ? Math.floor(Math.random() * 40) + 15 : Math.floor(Math.random() * 55) + 20;
    } else {
        // Upstox (simulated slow/biased)
        executionDelay = exchange === "NSE" ? Math.floor(Math.random() * 80) + 30 : Math.floor(Math.random() * 40) + 20;
    }
    
    const eTime = rTime + executionDelay;
    
    const symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    return {
        userId: user._id,
        orderId: `LIVE-${Math.floor(Math.random() * 1000000)}`,
        symbol: symbol,
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        price: Math.floor(Math.random() * 2000) + 100,
        exchange: exchange,
        brokerId: brokerId,
        routingTime: rTime,
        executionTime: eTime
    };
};

// Starts the simulator and emits events to the socket
const startMarketSimulator = (io) => {
    console.log("🚀 Live Market Feed Simulator Started");
    
    // Emit a new order every 3-8 seconds
    setInterval(async () => {
        const orderData = await generateRandomOrder();
        if (!orderData) return;
        
        try {
            // Save to DB so it persists
            const newOrder = new Order(orderData);
            await newOrder.save();
            
            // Broadcast to all connected clients
            io.emit("new-live-order", newOrder);
        } catch (error) {
            console.error("Error saving simulated order:", error);
        }
    }, Math.floor(Math.random() * 5000) + 3000);
};

module.exports = { startMarketSimulator };
