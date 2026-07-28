# 🏦 Transparent Order Routing Fairness Analyzer (TORFA)

<div align="center">

![TORFA Banner](https://img.shields.io/badge/TORFA-Phase%201-2563eb?style=for-the-badge&logo=chart.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Chatbot-4285F4?style=for-the-badge&logo=google&logoColor=white)

**A professional financial analytics platform that monitors order routing fairness between NSE and BSE exchanges, detects latency bias, and generates forensic compliance reports.**

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based Login & Register with auto-login |
| 📊 **Dashboard** | KPI cards, Fairness Chart, Latency Trend & Alert Banner |
| 📋 **Order Management** | Add orders manually or bulk import via CSV |
| 📈 **Analytics** | Exchange Pie Chart & AI-powered Smart Insights |
| 📄 **Forensic Reports** | Auto-generate professional PDF compliance reports |
| 🤖 **AI Chatbot** | Google Gemini-powered assistant for analyst queries |
| 🌙 **Dark Mode** | Full dark/light theme toggle |
| ⚠️ **Smart Alerts** | Auto warning banner when fairness score drops below 80% |

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Recharts, jsPDF, React Router
- **Backend:** Node.js, Express.js, JWT, Multer
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini 1.5 Flash API
- **Styling:** Custom CSS with Glassmorphism design

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)
- A free [Google Gemini API Key](https://aistudio.google.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Binith33/TransparentOrderRoutingFairnessAnalyzer.git
cd TransparentOrderRoutingFairnessAnalyzer
```

---

### 2️⃣ Setup the Backend (Server)

```bash
cd server
npm install
```

Create your `.env` file by copying the example:
```bash
cp .env.example .env
```

Now open `server/.env` and fill in your values:
```env
MONGO_URI=mongodb://127.0.0.1:27017/torfa
JWT_SECRET=your_long_random_secret_key
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Start the backend server:
```bash
npm run dev
```
> ✅ Server will run on **http://localhost:5000**

---

### 3️⃣ Setup the Frontend (Client)

Open a **new terminal** and run:
```bash
cd client
npm install
npm start
```
> ✅ App will open at **http://localhost:3000**

---

## 📁 Project Structure

```
TransparentOrderRoutingFairnessAnalyzer/
├── client/                    # React Frontend
│   └── src/
│       ├── components/        # Sidebar, Chatbot, Charts, OrderForm
│       ├── pages/             # Dashboard, Orders, Analytics, Profile
│       └── App.js             # Main router
│
├── server/                    # Node.js Backend
│   ├── models/                # MongoDB schemas (User, Order)
│   ├── routes/                # API routes (auth, orders, fairness, chat)
│   ├── middleware/            # JWT authentication middleware
│   ├── .env.example           # Environment variable template
│   └── server.js              # Entry point
│
└── competition_dataset.csv    # Sample data for demo
```

---

## 📊 How the Fairness Algorithm Works

```
Latency (ms)   = Execution Time - Routing Time

Fairness Score = Calculated based on latency distribution 
                 between NSE and BSE routes

Score > 90%   →  🟢 EXCELLENT
Score 80-90%  →  🔵 GOOD  
Score < 80%   →  🔴 ALERT (Warning banner appears)
```

---

## 🧪 Testing with Sample Data

A `competition_dataset.csv` file is included in the root folder.
1. Login to the application
2. Go to the **Orders** page
3. Click **"Bulk Import CSV"** and upload `competition_dataset.csv`
4. Navigate to the **Dashboard** and **Analytics** pages to see live results
5. Click **"Generate Forensic Report"** to download the PDF

---

## 🔑 Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **"Get API Key"**
3. Copy the key and paste it into your `server/.env` file as `GEMINI_API_KEY`
4. Restart the server — the AI Chatbot will now work fully!

---

## 👨‍💻 Author

**Binith N B** — [GitHub @Binith33](https://github.com/Binith33)

---

## 📜 License

This project is built for academic competition purposes — **Phase 1**.

---

<div align="center">
  Made with ❤️ for the TORFA Competition Project
</div>
