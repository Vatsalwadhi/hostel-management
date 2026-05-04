const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all staff members
router.get('/', async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' });
    const mapped = staff.map(s => {
      const sObj = s.toObject();
      sObj.id = sObj._id;
      delete sObj.password;
      return sObj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
