import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const logout = () => {

        localStorage.removeItem("user");

        window.location.href = "/login";

    };

    return (

        <div className="navbar">

            <div className="logo">

                Fairness Analyzer

            </div>

            <div className="nav-links">

                <Link to="/">
                    Dashboard
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                <button
                    onClick={logout}
                    style={{
                        marginLeft: "20px",
                        padding: "8px 15px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

export default Navbar;
