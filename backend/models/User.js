const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'staff', 'admin'], required: true },
  
  // Student specific fields
  regNumber: { type: String },
  hostelBlock: { type: String },
  roomNumber: { type: String },
  
  // Staff specific fields
  specialization: { type: String },
  phone: { type: String },
  
  // Admin specific fields
  designation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
