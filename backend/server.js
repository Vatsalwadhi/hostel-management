const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const staffRoutes = require('./routes/staff');
const feedbackRoutes = require('./routes/feedbacks');

const app = express();

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://alwadhiv:vats@hostel.fypaus0.mongodb.net/hostel_management?appName=hostel';

// Connect to MongoDB (Serverless-friendly)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const db = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });
  isConnected = db.connections[0].readyState;
  console.log('Connected to MongoDB');
};

// Middleware (order matters!)
app.use(cors());
app.use(express.json());

// DB connection middleware MUST come BEFORE routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Failed:", err);
    res.status(500).json({ message: "Database Connection Error", error: err.message });
  }
});

// Routes (AFTER DB middleware)
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/feedbacks', feedbackRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  connectDB().catch(console.error).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
