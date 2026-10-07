import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";
import FairnessChart from "../components/FairnessChart";
import LatencyTrendChart from "../components/LatencyTrendChart";
import BrokerLeaderboard from "../components/BrokerLeaderboard";
import { IMG_BASE } from "../config";
import "./Dashboard.css";

function Dashboard() {
    const [report, setReport] = useState({});
    const [orders, setOrders] = useState([]);
    const [alertDismissed, setAlertDismissed] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Initial Fetch
        const fetchDashboardData = () => {
            API.get("/fairness/report").then((res) => setReport(res.data)).catch(console.log);
            API.get("/orders").then((res) => setOrders(res.data)).catch(console.log);
        };
        fetchDashboardData();

        // WebSocket Connection
        const socket = io(IMG_BASE); // connects to http://localhost:5000
        
        socket.on("new-live-order", (newOrder) => {
            // Instantly add to activity feed & charts
            setOrders((prevOrders) => [newOrder, ...prevOrders]);
            
            // Re-fetch report to update KPIs dynamically
            API.get("/fairness/report").then((res) => setReport(res.data)).catch(console.log);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="dashboard">

            {/* TOP BANNER */}
            <div className="db-banner">
                <div>
                    <p className="db-banner-sub">Welcome back,</p>
                    <h1 className="db-banner-title">{user?.name || "Analyst"}</h1>
                    <p className="db-banner-desc">Monitor routing fairness, latency performance and exchange activity in real time.</p>
                </div>
                <img
                    src={user?.profilePic?.startsWith("/uploads") ? `${IMG_BASE}${user.profilePic}` : (user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")}
                    alt="user"
                    className="db-avatar"
                />
            </div>

            {/* FAIRNESS ALERT BANNER */}
            {!alertDismissed && report.fairnessScore > 0 && report.fairnessScore < 80 && (
                <div className="db-alert-banner">
                    <div className="db-alert-left">
                        <span className="db-alert-icon">⚠️</span>
                        <div>
                            <strong>Fairness Alert Detected</strong>
                            <p>Your current fairness score is <strong>{(report.fairnessScore || 0).toFixed(2)}%</strong> — below the 80% safe threshold. Potential routing bias detected. Review your exchange distribution immediately.</p>
                        </div>
                    </div>
                    <button className="db-alert-close" onClick={() => setAlertDismissed(true)}>✕</button>
                </div>
            )}

            {/* KPI METRIC CARDS */}

            <div className="db-kpi-row">
                <div className="db-kpi-card" style={{ borderTop: `4px solid ${report.statusColor || '#2563eb'}` }}>
                    <span className="db-kpi-icon">🏆</span>
                    <div>
                        <p className="db-kpi-label">System Rating</p>
                        <p className="db-kpi-value" style={{ color: report.statusColor || '#2563eb' }}>{report.rating || "—"}</p>
                    </div>
                </div>
                <div className="db-kpi-card" style={{ borderTop: '4px solid #2563eb' }}>
                    <span className="db-kpi-icon">⚖️</span>
                    <div>
                        <p className="db-kpi-label">Fairness Score</p>
                        <p className="db-kpi-value">{(report.fairnessScore || 0).toFixed(2)}%</p>
                    </div>
                </div>
                <div className="db-kpi-card" style={{ borderTop: '4px solid #7c3aed' }}>
                    <span className="db-kpi-icon">⚡</span>
                    <div>
                        <p className="db-kpi-label">Avg Latency</p>
                        <p className="db-kpi-value">{(report.averageLatency || 0).toFixed(2)}ms</p>
                    </div>
                </div>
                <div className="db-kpi-card" style={{ borderTop: '4px solid #059669' }}>
                    <span className="db-kpi-icon">📦</span>
                    <div>
                        <p className="db-kpi-label">Total Orders</p>
                        <p className="db-kpi-value">{report.totalOrders || 0}</p>
                    </div>
                </div>
            </div>

            {/* CHART: Full Width */}
            <div className="db-panel" style={{ marginBottom: '25px' }}>
                <p className="db-panel-title">📈 Fairness Distribution</p>
                <FairnessChart
                    totalOrders={report.totalOrders}
                    averageLatency={report.averageLatency}
                    fairnessScore={report.fairnessScore}
                />
            </div>

            {/* BROKER LEADERBOARD */}
            <div className="db-panel" style={{ marginBottom: '25px' }}>
                <p className="db-panel-title">🏆 Broker Routing Leaderboard</p>
                <BrokerLeaderboard orders={orders} />
            </div>

            {/* INTELLIGENCE + SUMMARY: Side by Side below chart */}
            <div className="db-two-col" style={{ marginBottom: '25px' }}>

                <div className="db-panel">
                    <p className="db-panel-title">🧠 Advanced AI Intelligence</p>
                    <div className="db-info-list">
                        <div className="db-info-row">
                            <span>🛡️ Status Summary</span>
                            <strong style={{ color: report.aiInsights?.anomalyLevel === 'HIGH' ? '#ef4444' : '#059669' }}>
                                {report.aiInsights?.summary || "Analyzing..."}
                            </strong>
                        </div>
                        <div className="db-info-row">
                            <span>🔮 Predictive Insight</span>
                            <strong>{report.aiInsights?.prediction || "Data collecting..."}</strong>
                        </div>
                        <div className="db-info-row">
                            <span>📉 NSE Anomaly Spikes</span>
                            <strong style={{ color: report.aiInsights?.nseMetrics?.recentAnomalies > 1 ? '#ef4444' : '#0f172a' }}>
                                {report.aiInsights?.nseMetrics?.recentAnomalies || 0} events
                            </strong>
                        </div>
                        <div className="db-info-row">
                            <span>📉 BSE Anomaly Spikes</span>
                            <strong style={{ color: report.aiInsights?.bseMetrics?.recentAnomalies > 1 ? '#ef4444' : '#0f172a' }}>
                                {report.aiInsights?.bseMetrics?.recentAnomalies || 0} events
                            </strong>
                        </div>
                        <div className="db-info-row">
                            <span>🔍 Fairness Level</span>
                            <strong style={{ color: report.statusColor }}>{report.rating || "—"}</strong>
                        </div>
                    </div>
                </div>

                <div className="db-panel">
                    <p className="db-panel-title">📊 System Summary</p>
                    <div className="db-info-list">
                        <div className="db-info-row">
                            <span>Total Orders Processed</span>
                            <strong>{report.totalOrders || 0}</strong>
                        </div>
                        <div className="db-info-row">
                            <span>Average Latency</span>
                            <strong>{(report.averageLatency || 0).toFixed(2)}ms</strong>
                        </div>
                        <div className="db-info-row">
                            <span>Live Fairness Score</span>
                            <strong>{(report.fairnessScore || 0).toFixed(2)}</strong>
                        </div>
                        <div className="db-info-row">
                            <span>Network Status</span>
                            <strong style={{ color: '#059669' }}>● Connected via WebSocket</strong>
                        </div>
                    </div>
                </div>

            </div>

            {/* LATENCY TREND CHART */}
            <div className="db-panel" style={{ marginTop: '25px' }}>
                <p className="db-panel-title">📉 Latency Trend — Last 20 Orders</p>
                <LatencyTrendChart orders={orders} />
            </div>

            {/* BOTTOM: Recent Activity */}

            <div className="db-panel" style={{ marginTop: '30px' }}>
                <p className="db-panel-title">🕒 Recent Activity</p>
                <div className="db-activity-list">
                    {orders.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#64748b', padding: '30px 0' }}>No recent activity found.</p>
                    )}
                    {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="db-activity-row">
                            <div className="db-activity-left">
                                <span className="db-order-id">{order.orderId}</span>
                                <span className={`badge ${order.exchange}`}>{order.exchange}</span>
                                <span className="db-order-type" style={{ color: order.type === 'BUY' ? '#059669' : '#ef4444' }}>
                                    {order.type}
                                </span>
                                <span className="db-order-symbol">{order.symbol}</span>
                            </div>
                            <div className="db-activity-right">
                                <span className="db-order-latency">{order.routingTime}ms routing</span>
                                <span className="db-order-price">₹{Number(order.price).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Dashboard;