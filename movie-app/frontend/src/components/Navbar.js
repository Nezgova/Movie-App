import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰ {/* Hamburger icon for mobile */}
        </button>
        <ul className={`nav-links ${isMenuOpen ? "show" : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/series">Series</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
