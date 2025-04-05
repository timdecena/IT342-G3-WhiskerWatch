import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "../assets/header.css";

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <Link to="/homepage" className="logo">
          Whisker<span style={{ color: "#1c1e21" }}>Watch</span>
        </Link>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/homepage" onClick={closeMenu}>Home</Link>
          <Link to="/post-pets" onClick={closeMenu}>Post a Pet</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>

          {isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/" className="login-btn" onClick={closeMenu}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
