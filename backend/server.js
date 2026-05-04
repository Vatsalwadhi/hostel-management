const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const staffRoutes = require('./routes/staff');
const feedbackRoutes = require('./routes/feedbacks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/feedbacks', feedbackRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_management';

// Connect to MongoDB (Serverless-friendly)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  console.log("Attempting to connect. URI starts with:", MONGO_URI.substring(0, 15));
  const db = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
  });
  isConnected = db.connections[0].readyState;
  console.log('Connected to MongoDB');
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Failed:", err);
    res.status(500).json({ 
      message: "Database Connection Error", 
      error: err.message,
      uriPrefix: MONGO_URI.substring(0, 15)
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  connectDB().catch(console.error).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
