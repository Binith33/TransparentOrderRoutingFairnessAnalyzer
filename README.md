# Transparent Order Routing Fairness Analyzer (TORFA) 🚀

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version: 2.0](https://img.shields.io/badge/Version-2.0-blue)
![Status: Complete](https://img.shields.io/badge/Status-Complete-success)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

An enterprise-grade **MERN-stack application** built to detect, analyze, and report on latency biases and unfairness in stock market order routing (NSE vs BSE). In modern financial markets, microseconds matter. This platform simulates a live trading environment and uses **Statistical AI Analytics** to monitor whether retail orders are being unfairly routed to slower exchanges by brokers. 

---

## 🌟 Key Features

*   **Live Market WebSockets (`socket.io`):** A custom-built backend market simulator that pushes live, highly realistic latency data to the frontend in milliseconds.
*   **Statistical Analytics Engine:** Computes dynamic execution times on the backend to predict and flag routing anomalies or sudden latency spikes.
*   **Interactive Analytics Dashboard:** Real-time visualization using Recharts (Dark/Light mode supported).
*   **Generative AI Assistant:** Integrated Google Gemini API to act as a 24/7 financial compliance chatbot. Formats outputs using Markdown.
*   **Corporate PDF Audit Reports:** Users can instantly generate and download highly stylized compliance reports (with branding) for their routing fairness scores.
*   **Multi-Broker Leaderboard:** Compares simulated execution times from top brokers and ranks them by fairness in real-time.
*   **Data Explorer Grid:** A powerful historical data table with multi-variable filtering, click-to-sort columns, and one-click **CSV Exports**.
*   **Enterprise RBAC:** Multi-tiered user roles (Admin vs. Analyst). Admins get access to an exclusive security portal.
*   **Invisible Audit Logging:** Every major action (Logins, Registers) is cryptographically timestamped and stored for admin auditing.

---

## 🏛️ System Architecture

TORFA operates on a powerful monolithic architecture for maximum efficiency and ease of deployment.

1. **Frontend Layer (React.js):** 
   - Handles state management via Context/Hooks.
   - Communicates with the backend using REST APIs for authentication/data.
   - Uses `socket.io-client` for sub-second live order streaming.
2. **Business Logic Layer (Express.js / Node.js):**
   - Implements MVC (Model-View-Controller/Services).
   - Offloads complex math to the `fairnessService.js`.
   - Protects routes using `jwt` authentication middleware.
3. **Data Layer (MongoDB):**
   - Utilizes Compound Indexing to sort and query millions of records instantaneously without crashing the server.

---

## 💻 Installation & Setup

This project is configured as a production-ready monolith. You do NOT need to run the frontend and backend separately. The Express server serves the optimized React build.

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Google Gemini API Key

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Binith33/TransparentOrderRoutingFairnessAnalyzer.git
   ```

2. **Navigate to the server directory**
   ```bash
   cd TransparentOrderRoutingFairnessAnalyzer/server
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `server` directory and add the following:
   ```ini
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

5. **Start the Application**
   ```bash
   npm start
   ```

6. **Access the Application**
   Open your browser and navigate to `http://localhost:5000`.

---

## 🤝 Contributing

We welcome contributions to the TORFA platform. Please review the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to open issues and submit pull requests. Ensure you also review our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
*Built as a Major University Project in Financial Technology.*
