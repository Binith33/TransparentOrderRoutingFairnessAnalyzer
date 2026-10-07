# Transparent Order Routing Fairness Analyzer (TORFA) 🚀

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version: 2.0](https://img.shields.io/badge/Version-2.0-blue)
![Status: Complete](https://img.shields.io/badge/Status-Complete-success)

A highly advanced, enterprise-grade **MERN-stack application** built to detect, analyze, and report on latency biases and unfairness in stock market order routing (NSE vs BSE).

## 🌟 Overview
In modern financial markets, microseconds matter. This platform simulates a live trading environment and uses **Machine Learning Analytics** to monitor whether retail orders are being unfairly routed to slower exchanges by brokers. It features a complete Role-Based Access Control (RBAC) architecture, real-time WebSockets, and a live AI assistant.

---

## 🏆 Project Milestones Completed

### Phase 1: Foundation (MERN Stack)
*   **Authentication Engine:** Secure JWT-based login and registration system.
*   **Interactive Analytics Dashboard:** Real-time visualization using Recharts (Dark/Light mode supported).
*   **Automated PDF Reporting:** Users can instantly generate and download compliance reports for their routing fairness scores.
*   **Generative AI Assistant:** Integrated Google Gemini API to act as a 24/7 financial compliance chatbot.

### Phase 2: Enterprise Upgrade (Real-Time & AI)
*   **Live Market WebSockets (`socket.io`):** A custom-built backend market simulator that pushes live, highly realistic latency data to the frontend in milliseconds.
*   **Statistical Machine Learning Engine:** Computes Z-Scores and moving averages on the backend to dynamically predict and flag routing anomalies or sudden latency spikes.
*   **Enterprise RBAC:** Multi-tiered user roles (Admin vs. Analyst). Admins get access to an exclusive security portal.
*   **Invisible Audit Logging:** Every major action (Logins, Registers) is cryptographically timestamped and stored for admin auditing.

### Phase 3: Bonus Features
*   **Multi-Broker Leaderboard:** Compares simulated execution times from top brokers (Zerodha, Groww, Upstox) and ranks them by fairness in real-time.
*   **Data Explorer Grid:** A powerful historical data table with multi-variable filtering and one-click **CSV Exports**.
*   **Database-Aware AI:** The Gemini Chatbot now securely queries your live database to give you contextual answers about your personal fairness score and recent anomalies.
*   **Automated Security Emails:** The backend dispatches critical email alerts to administrators if severe routing biases are detected.

---

## 🛠️ Technology Stack
*   **Frontend:** React.js, React Router, Recharts, CSS3
*   **Backend:** Node.js, Express.js (v5), Socket.io
*   **Database:** MongoDB, Mongoose ORM
*   **AI Integration:** Google Generative AI (Gemini 1.5 Flash)
*   **Security:** JWT, bcryptjs

---

## 💻 How to Run Locally (Production Monolith)
This project is configured as a production-ready monolith. You do NOT need to run the frontend and backend separately.

1. Clone the repository:
   ```bash
   git clone https://github.com/Binith33/TransparentOrderRoutingFairnessAnalyzer.git
   ```
2. Navigate into the server directory:
   ```bash
   cd TransparentOrderRoutingFairnessAnalyzer/server
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Configure `.env`:
   Add your `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` in the `server/.env` file.
5. Start the server:
   ```bash
   npm start
   ```
6. Visit `http://localhost:5000` in your browser. The Express server will automatically serve the React frontend!

---
*Built as a Major University Project in Financial Technology.*
