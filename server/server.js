const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes =
require("./routes/authRoutes");

const profileRoutes =
require("./routes/profileRoutes");
require("dotenv").config();

const app = express();
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
})
.catch((err) => {
  console.log(err);
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/fairness", require("./routes/fairnessRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});