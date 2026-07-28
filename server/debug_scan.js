const mongoose = require("mongoose");
require("dotenv").config();

async function scan() {
    await mongoose.connect(process.env.MONGO_URI);
    const orders = await mongoose.connection.collection("orders").find({}).toArray();
    const users = await mongoose.connection.collection("users").find({}).toArray();

    console.log("--- DATABASE SCAN ---");
    console.log("Total Orders Found:", orders.length);
    if (orders.length > 0) {
        console.log("First Order UserId:", orders[0].userId);
    }
    console.log("Total Users Found:", users.length);
    if (users.length > 0) {
        users.forEach(u => console.log(`User: ${u.email} | ID: ${u._id}`));
    }
    process.exit(0);
}

scan();
