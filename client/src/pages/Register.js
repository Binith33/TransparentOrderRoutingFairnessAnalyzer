import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import "./Login.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }

        try {
            const res = await API.post("/auth/register", { name, email, password });

            // Automatically log in the user after successful registration
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            window.location.href = "/";
        } catch (error) {
            alert(error.response?.data?.message || "Registration Failed. Please try again.");
        }
    };


    return (
        <div className="auth-page">
            
            <div className="auth-left">
                <h1>Join the TORFA Network</h1>
                <p>
                    Create an account to access deep analytical tools for 
                    transparent order routing and exchange fairness monitoring.
                </p>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <h2>Create Account</h2>
                    <p className="subtitle">Start your 10-day professional trial today</p>

                    <div className="auth-form">
                        <div className="auth-input-group">
                            <label>Full Name</label>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="auth-input-group">
                            <label>Email Address</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-input-group">
                            <label>Password</label>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="auth-btn" onClick={handleRegister}>
                            Create Account
                        </button>
                    </div>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;