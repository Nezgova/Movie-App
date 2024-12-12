const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../server'); // Import the db object from server.js

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Insert new user
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({ message: 'User created successfully' });
      });
    });
  });
});

module.exports = router;
