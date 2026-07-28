import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.location.href = "/";
        } catch (error) {
            alert(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="auth-page">

            {/* LEFT: Branding Panel */}
            <div className="auth-left">
                <div className="auth-left-logo">
                    <div className="auth-left-logo-icon">⚖️</div>
                    <span className="auth-left-logo-text">TORFA Platform</span>
                </div>

                <h1>Transparent Order<br />Routing Fairness<br />Analyzer</h1>

                <p>
                    Monitor institutional routing fairness, detect latency bias,
                    and ensure execution transparency across global exchanges.
                </p>

                <div className="auth-left-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot"></span>
                        Real-time NSE & BSE Fairness Monitoring
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot"></span>
                        AI-Powered Routing Bias Detection
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot"></span>
                        Forensic PDF Compliance Reports
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot"></span>
                        Multi-Tenant Secure Data Architecture
                    </div>
                </div>
            </div>

            {/* RIGHT: Login Form */}
            <div className="auth-right">
                <div className="auth-box">
                    <div className="auth-box-header">
                        <div className="auth-box-icon">🔐</div>
                        <h2>Welcome back</h2>
                        <p className="subtitle">Sign in to access the analyzer dashboard</p>
                    </div>

                    <div className="auth-form">
                        <div className="auth-input-group">
                            <label>Email Address</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="auth-input-group">
                            <label>Password</label>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </div>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create account</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;