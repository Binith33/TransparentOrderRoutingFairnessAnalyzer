import {
    FaChartBar,
    FaClipboardList,
    FaUser,
    FaSignOutAlt,
    FaMoon
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { IMG_BASE } from "../config";
import "./Sidebar.css";

function Sidebar() {


    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "/login";


    };

    const toggleTheme = () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    };

    return (

        <div className="sidebar">

            <h2>TORFA</h2>

            <p>
                Transparent Order Routing
                <br />
                Fairness Analyzer
            </p>

            <div className="sidebar-user" style={{ textAlign: "center", marginBottom: "30px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "15px" }}>
                <img 
                    src={user?.profilePic?.startsWith("/uploads") ? `${IMG_BASE}${user.profilePic}` : (user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")} 
                    alt="avatar" 
                    style={{ width: "60px", height: "60px", borderRadius: "50%", marginBottom: "10px", border: "2px solid var(--primary)", objectFit: "cover" }}
                />
                <h3 style={{ fontSize: "16px", color: "white" }}>{user?.name}</h3>
            </div>



            <div className="sidebar-links">
                <NavLink to="/" end>
                    <FaChartBar />
                    Dashboard
                </NavLink>

                <NavLink to="/orders">
                    <FaClipboardList />
                    Orders
                </NavLink>

                <NavLink to="/analytics">
                    <FaChartBar />
                    Analytics
                </NavLink>

                <NavLink to="/profile">
                    <FaUser />
                    Profile
                </NavLink>
            </div>


            <button
                className="theme-btn"
                onClick={toggleTheme}
            >
                <FaMoon />
                Toggle Theme
            </button>

            <button
                className="logout-btn"
                onClick={logout}
            >
                <FaSignOutAlt />
                Logout
            </button>

        </div>

    );

}

export default Sidebar;