const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Import routes for auth

const app = express();

// Middleware
app.use(cors());  // To allow cross-origin requests (e.g., from your frontend)
app.use(bodyParser.json());  // To parse incoming JSON request bodies

// Routes
app.use('/api/auth', authRoutes);  // Mount auth routes at /api/auth

// Define a port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
