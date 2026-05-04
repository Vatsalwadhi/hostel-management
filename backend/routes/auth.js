const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user (student)
router.post('/register', async (req, res) => {
  try {
    const { name, regNumber, email, password, hostelBlock, roomNumber } = req.body;
    
    let user = await User.findOne({ $or: [{ email }, { regNumber }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      regNumber,
      email,
      password, // In a real app, hash this with bcrypt!
      hostelBlock,
      roomNumber,
      role: 'student'
    });

    await user.save();
    
    // Convert to object and map _id to id for frontend compatibility
    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj.password;
    
    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // For students, the email field might be the regNumber
    const user = await User.findOne({ 
      $or: [{ email }, { regNumber: email }], 
      password, // In a real app, use bcrypt.compare
      role 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
