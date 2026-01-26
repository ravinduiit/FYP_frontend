import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <nav className="nav">
        <NavLink to="/" className="brand">
          <img src={logo} alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">TransQuizX</div>
            <div className="brand-subtitle"> An Explainable AI Based Adaptive Assessment</div>
          </div>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-btn">
            Register
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
