import { useEffect, useState } from "react";
import API from "../api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (currentUser?.systemRole !== "admin") {
            setError("Access Denied: You do not have permission to view the Admin Panel.");
            return;
        }

        API.get("/admin/users").then(res => setUsers(res.data)).catch(err => console.error(err));
        API.get("/admin/logs").then(res => setLogs(res.data)).catch(err => console.error(err));
    }, [currentUser]);

    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="dashboard admin-dashboard">
            <div className="db-banner" style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}>
                <div>
                    <h1 className="db-banner-title">Security & Audit Center</h1>
                    <p className="db-banner-desc">Enterprise Administration and Activity Logs</p>
                </div>
            </div>

            <div className="db-two-col">
                {/* USERS PANEL */}
                <div className="db-panel">
                    <p className="db-panel-title">👥 Registered Users</p>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.systemRole}`}>
                                                {u.systemRole}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AUDIT LOGS PANEL */}
                <div className="db-panel">
                    <p className="db-panel-title">🛡️ System Audit Logs</p>
                    <div className="audit-logs-container">
                        {logs.map(log => (
                            <div key={log._id} className="audit-log-item">
                                <div className="audit-log-header">
                                    <span className="audit-action">{log.action}</span>
                                    <span className="audit-time">{new Date(log.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="audit-details">{log.details}</p>
                                <p className="audit-user">User: {log.user?.email || "Unknown"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
