const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    // Map _id to id
    const mapped = complaints.map(c => ({...c.toObject(), id: c._id}));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get complaints by student
router.get('/student/:id', async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.params.id }).sort({ createdAt: -1 });
    const mapped = complaints.map(c => ({...c.toObject(), id: c._id}));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get complaints by assigned staff
router.get('/staff/:id', async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedStaff: req.params.id }).sort({ createdAt: -1 });
    const mapped = complaints.map(c => ({...c.toObject(), id: c._id}));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new complaint
router.post('/', async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      // Handle the case where the frontend sends studentId instead of student
      student: req.body.studentId || req.body.student
    });
    await complaint.save();
    
    const complaintObj = complaint.toObject();
    complaintObj.id = complaintObj._id;
    res.status(201).json(complaintObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update complaint status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
    
    await complaint.save();
    
    const complaintObj = complaint.toObject();
    complaintObj.id = complaintObj._id;
    res.json(complaintObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign staff
router.patch('/:id/assign', async (req, res) => {
  try {
    const { staffId, staffName } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { assignedStaff: staffId, assignedStaffName: staffName },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    const complaintObj = complaint.toObject();
    complaintObj.id = complaintObj._id;
    res.json(complaintObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update priority
router.patch('/:id/priority', async (req, res) => {
  try {
    const { priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { priority },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    const complaintObj = complaint.toObject();
    complaintObj.id = complaintObj._id;
    res.json(complaintObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
