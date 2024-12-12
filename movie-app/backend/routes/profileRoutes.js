const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// View profile
router.get('/profile', authMiddleware.verifyToken, profileController.viewProfile);

// Update profile
router.put('/profile', authMiddleware.verifyToken, profileController.updateProfile);

module.exports = router;
