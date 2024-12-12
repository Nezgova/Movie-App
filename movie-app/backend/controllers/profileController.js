const db = require('../config/db');

// View profile
const viewProfile = (req, res) => {
  const userId = req.userId; // Extracted from the JWT token

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      username: results[0].username,
      email: results[0].email,
      // Add other profile fields as necessary
    });
  });
};

// Update profile
const updateProfile = (req, res) => {
  const userId = req.userId;
  const { email, username, bio } = req.body;

  db.query('UPDATE users SET email = ?, username = ?, bio = ? WHERE id = ?', 
    [email, username, bio, userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      return res.status(200).json({ message: 'Profile updated successfully' });
    });
};

module.exports = { viewProfile, updateProfile };
