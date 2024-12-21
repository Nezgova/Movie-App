import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/series">Series</Link>
          </li>
          <li>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
