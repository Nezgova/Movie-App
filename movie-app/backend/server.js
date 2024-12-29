const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (you can also configure this for specific origins)
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

// Authentication Middleware to validate JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

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

// POST route to add favorite
// POST route to add favorite with enhanced debugging
app.post('/favorites', authenticateToken, (req, res) => {
  console.log('Received request body:', req.body);
  console.log('User ID from token:', req.user.userId);

  const { content_id, media_type } = req.body;
  const userId = req.user.userId;

  // Debug logging
  console.log('Extracted data:', {
    content_id,
    media_type,
    userId
  });

  // Input validation with detailed logging
  if (!content_id) {
    console.log('Missing content_id');
    return res.status(400).json({ message: 'Missing content_id' });
  }

  if (!media_type) {
    console.log('Missing media_type');
    return res.status(400).json({ message: 'Missing media_type' });
  }

  // Validate media_type
  if (!['movie', 'tv'].includes(media_type)) {
    console.log('Invalid media_type:', media_type);
    return res.status(400).json({ message: `Invalid media type: ${media_type}. Must be "movie" or "tv"` });
  }

  const checkQuery = 'SELECT * FROM favorites WHERE user_id = ? AND content_id = ?';
  console.log('Check query:', checkQuery);
  console.log('Check query params:', [userId, content_id]);

  db.query(checkQuery, [userId, content_id], (err, results) => {
    if (err) {
      console.error('Database error during check:', err);
      return res.status(500).json({ message: 'Database error during check', error: err.message });
    }

    console.log('Check query results:', results);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const insertQuery = 'INSERT INTO favorites (user_id, content_id, media_type) VALUES (?, ?, ?)';
    const insertParams = [userId, content_id, media_type];
    
    console.log('Insert query:', insertQuery);
    console.log('Insert params:', insertParams);

    db.query(insertQuery, insertParams, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.status(500).json({ 
          message: 'Error adding to favorites', 
          error: err.message,
          sqlMessage: err.sqlMessage
        });
      }

      console.log('Insert result:', result);

      const newFavorite = {
        id: result.insertId,
        user_id: userId,
        content_id,
        media_type
      };

      console.log('Sending response:', newFavorite);
      res.status(201).json(newFavorite);
    });
  });
});

// GET route to fetch favorites
app.get('/favorites', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const query = 'SELECT * FROM favorites WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    // Transform the results to match frontend expectations
    const transformedResults = results.map(item => ({
      id: item.content_id,
      mediaType: item.media_type,
      // These fields will be populated from your frontend TMDB API calls
      title: '',  // This will be populated on the frontend
      image: '',  // This will be populated on the frontend
      user_id: item.user_id
    }));

    res.status(200).json(transformedResults);
  });
});
// Remove from favorites
app.delete('/favorites/:contentId', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const contentId = req.params.contentId;

  const query = 'DELETE FROM favorites WHERE user_id = ? AND content_id = ?';
  db.query(query, [userId, contentId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.status(200).json({ message: 'Removed from favorites successfully' });
  });
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
