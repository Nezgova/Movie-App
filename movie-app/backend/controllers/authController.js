const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import the database connection

// Register controller
const register = (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Hash password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Save the user in the database
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error registering user", error: err });
      }
      return res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    });
  });
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user in the database by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user", error: err });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password with the hashed password in the database
    bcrypt.compare(password, result[0].password, (err, match) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords", error: err });
      }

      if (!match) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: result[0].id }, 'your-secret-key', { expiresIn: '1h' });

      return res.status(200).json({ message: "Login successful", token });
    });
  });
};

module.exports = { register, login };
