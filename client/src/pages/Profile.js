import { useState, useEffect } from "react";
import API from "../api";
import { IMG_BASE } from "../config";
import "./Profile.css";

function formatMemberSince(dateValue) {
    if (!dateValue) return "—";
    return new Date(dateValue).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });
}

function Profile() {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [memberSince, setMemberSince] = useState("");
    const [report, setReport] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            setUserId(user._id);
            try {
                const res = await API.get(`/profile/${user._id}`);
                setName(res.data.name);
                setEmail(res.data.email);
                setProfilePic(res.data.profilePic);
                setMemberSince(res.data.createdAt);
                const reportRes = await API.get("/fairness/report");
                setReport(reportRes.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };
        fetchProfile();
    }, []);

    const updateProfile = async () => {
        try {
            const res = await API.put(`/profile/${userId}`, { name, email, profilePic });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setMemberSince(res.data.user.createdAt);
            alert("✅ Profile Updated Successfully");
            window.location.reload(); // Force reload to update Sidebar and Navbar
        } catch (error) {
            alert("❌ Update Failed");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("profilePic", file);
        try {
            const res = await API.post("/profile/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setProfilePic(res.data.filePath);
            alert("📸 Photo Uploaded! Click Update to confirm.");
        } catch (error) {
            alert("Upload Failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="pf-page">

            {/* HERO BANNER */}
            <div className="pf-banner">
                <div className="pf-banner-content">
                    <img
                        src={profilePic?.startsWith("/uploads") ? `${IMG_BASE}${profilePic}` : (profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")}
                        alt="avatar"
                        className="pf-avatar"
                    />
                    <div>
                        <p className="pf-banner-sub">Logged in as</p>
                        <h1 className="pf-banner-name">{name || "Analyst"}</h1>
                        <p className="pf-banner-email">{email}</p>
                        <span className="pf-status-badge">● Active Account</span>
                    </div>
                </div>
            </div>

            {/* KPI ROW */}
            <div className="pf-kpi-row">
                <div className="pf-kpi-card" style={{ borderTop: '4px solid #2563eb' }}>
                    <p className="pf-kpi-label">Recent History</p>
                    <p className="pf-kpi-value">{report.totalOrders || 0} Orders</p>
                </div>
                <div className="pf-kpi-card" style={{ borderTop: '4px solid #7c3aed' }}>
                    <p className="pf-kpi-label">Avg Fairness Score</p>
                    <p className="pf-kpi-value">{(report.fairnessScore || 0).toFixed(2)}</p>
                </div>
                <div className="pf-kpi-card" style={{ borderTop: `4px solid ${report.statusColor || '#059669'}` }}>
                    <p className="pf-kpi-label">System Rating</p>
                    <p className="pf-kpi-value" style={{ color: report.statusColor }}>{report.rating || "N/A"}</p>
                </div>
                <div className="pf-kpi-card" style={{ borderTop: '4px solid #059669' }}>
                    <p className="pf-kpi-label">Avg Latency</p>
                    <p className="pf-kpi-value">{(report.averageLatency || 0).toFixed(2)}ms</p>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="pf-main-grid">

                {/* LEFT: Edit Form */}
                <div className="pf-panel">
                    <h2 className="pf-panel-title">⚙️ Account Settings</h2>

                    <div className="pf-field">
                        <label>Full Name</label>
                        <input className="pf-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="pf-field">
                        <label>Email Address</label>
                        <input className="pf-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="pf-field">
                        <label>Profile Photo</label>
                        <input className="pf-input" type="file" accept="image/*" onChange={handleFileChange} />
                        {profilePic && (
                            <p className="pf-file-label">📎 {profilePic}</p>
                        )}
                    </div>

                    <button className="pf-save-btn" onClick={updateProfile}>
                        Save Changes
                    </button>
                </div>

                {/* RIGHT: Account Info */}
                <div className="pf-panel">
                    <h2 className="pf-panel-title">👤 Account Overview</h2>

                    <div className="pf-info-list">
                        <div className="pf-info-row">
                            <span>Role</span>
                            <strong>Fairness Analyst</strong>
                        </div>
                        <div className="pf-info-row">
                            <span>Account Status</span>
                            <strong style={{ color: '#059669' }}>● Active</strong>
                        </div>
                        <div className="pf-info-row">
                            <span>Member Since</span>
                            <strong>{formatMemberSince(memberSince)}</strong>
                        </div>
                        <div className="pf-info-row">
                            <span>System</span>
                            <strong>TORFA Analyzer v1.0</strong>
                        </div>
                        <div className="pf-info-row">
                            <span>Bias Detection</span>
                            <strong style={{ color: report.fairnessScore > 80 ? '#059669' : '#ef4444' }}>
                                {report.fairnessScore > 80 ? "✓ No Bias" : "⚠ Detected"}
                            </strong>
                        </div>
                        <div className="pf-info-row">
                            <span>Network</span>
                            <strong style={{ color: '#059669' }}>● Connected</strong>
                        </div>
                    </div>

                    <button className="pf-logout-btn" onClick={logout}>
                        🚪 Logout from System
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Profile;