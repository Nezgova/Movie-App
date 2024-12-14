// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Optional: For styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
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
      </ul>
    </nav>
  );
};

export default Navbar;
