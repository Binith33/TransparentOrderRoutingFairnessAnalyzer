const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { startMarketSimulator } = require("./utils/marketSimulator");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow frontend to connect
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Transparent Order Routing Fairness Analyzer API");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
  // Start the live market feed once DB is connected
  startMarketSimulator(io);
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/fairness", require("./routes/fairnessRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, "../client/build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server & WebSockets Running On Port ${PORT}`);
});