const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password (empty by default for XAMPP)
  database: 'movieapp' // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Registration route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error registering user' });
      }

      // Success
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});


// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Check if the user exists
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });

      // Send the response with token and user info
      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user.id
      });
    });
  });
});


// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
