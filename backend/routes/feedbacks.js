const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Get all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    const mapped = feedbacks.map(f => ({...f.toObject(), id: f._id}));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      complaint: req.body.complaintId,
      student: req.body.studentId
    });
    await feedback.save();
    
    const feedbackObj = feedback.toObject();
    feedbackObj.id = feedbackObj._id;
    res.status(201).json(feedbackObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
