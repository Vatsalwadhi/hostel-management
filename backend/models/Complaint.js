const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  hostelBlock: { type: String, required: true },
  roomNumber: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedStaffName: { type: String, default: null },
  resolutionNotes: { type: String, default: '' },
  image: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
