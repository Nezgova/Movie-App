const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Add multer for file uploads
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movieapp',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Authentication Middleware to validate JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
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

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile_pictures'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Create the folder for storing images if it doesn't exist
const fs = require('fs');
const uploadsPath = './uploads/profile_pictures';
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// POST route to upload profile picture
app.post('/user/upload-profile-picture', authenticateToken, upload.single('profile_picture'), (req, res) => {
  console.log('Upload route hit');
  console.log('User:', req.user);
  console.log('File received:', req.file);
  
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `/uploads/profile_pictures/${req.file.filename}`;
  console.log('File path:', filePath);

  // Assuming DB update logic here
  const userId = req.user.userId;
  console.log(`Updating user ${userId} with profile picture`);

  db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [filePath, userId], (err, result) => {
    if (err) {
      console.log('DB Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Profile picture updated in DB');
    res.json({ message: 'Profile picture uploaded successfully', filePath });
  });
});


// Serve static files (images)
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path, stat) => {
    console.log(`Serving file: ${path}`);
  }
}));


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
app.post('/favorites', authenticateToken, (req, res) => {
  const { content_id, media_type } = req.body;
  const userId = req.user.userId;

  if (!content_id || !media_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const checkQuery = 'SELECT * FROM favorites WHERE user_id = ? AND content_id = ?';
  db.query(checkQuery, [userId, content_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const insertQuery = 'INSERT INTO favorites (user_id, content_id, media_type) VALUES (?, ?, ?)';
    db.query(insertQuery, [userId, content_id, media_type], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding to favorites' });
      }

      const newFavorite = {
        id: result.insertId,
        user_id: userId,
        content_id,
        media_type
      };

      res.status(201).json(newFavorite);
    });
  });
});

// GET route to fetch favorites
app.get('/favorites', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = 'SELECT * FROM favorites WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    const transformedResults = results.map(item => ({
      id: item.content_id,
      mediaType: item.media_type,
      title: '',
      image: '',
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
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Removed from favorites successfully' });
  });
});

// GET route to fetch user data
app.get('/api/user', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = 'SELECT id, username, email, phone_number, birthday, profile_picture, created_at FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Edit User Profile Route
app.put('/user/edit', authenticateToken, (req, res) => {
  const { username, phone_number, birthday, profile_picture } = req.body;
  const userId = req.user.userId;

  if (!username && !phone_number && !birthday && !profile_picture) {
    return res.status(400).json({ message: 'No valid fields provided for update.' });
  }

  let updateQuery = 'UPDATE users SET ';
  let updateValues = [];

  if (username) {
    updateQuery += 'username = ?, ';
    updateValues.push(username);
  }
  if (phone_number) {
    updateQuery += 'phone_number = ?, ';
    updateValues.push(phone_number);
  }
  if (birthday) {
    updateQuery += 'birthday = ?, ';
    updateValues.push(birthday);
  }
  if (profile_picture) {
    updateQuery += 'profile_picture = ?, ';
    updateValues.push(profile_picture);
  }

  // Remove the trailing comma and space
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += ' WHERE id = ?';
  updateValues.push(userId);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating user profile', error: err.message });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
