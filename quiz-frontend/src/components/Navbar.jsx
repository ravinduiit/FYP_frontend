import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { getUser, isAuthenticated, logout } from "../utils/auth";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <NavLink to="/" className="brand">
          <img src={logo} alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">TransQuizX</div>
            <div className="brand-subtitle">
              An Explainable AI Based Adaptive Assessment
            </div>
          </div>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <NavLink to="/about" className="nav-link">
            About
          </NavLink>

          {loggedIn && (
            <NavLink to="/create" className="nav-link">
              Create Quiz
            </NavLink>
          )}

          {!loggedIn ? (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="nav-btn">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <div className="nav-user">
                {user?.username}
              </div>

              <button type="button" className="nav-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}