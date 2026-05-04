const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Feedback = require('./models/Feedback');
require('dotenv').config();

// Students, Staff, and Admins from the mock data
const users = [
  // Students
  { name: 'Rahul Sharma', regNumber: 'REG2024001', email: 'rahul@university.edu', password: 'password123', hostelBlock: 'A', roomNumber: '101', role: 'student' },
  { name: 'Priya Patel', regNumber: 'REG2024002', email: 'priya@university.edu', password: 'password123', hostelBlock: 'B', roomNumber: '205', role: 'student' },
  { name: 'Amit Kumar', regNumber: 'REG2024003', email: 'amit@university.edu', password: 'password123', hostelBlock: 'A', roomNumber: '312', role: 'student' },
  { name: 'Vats Demo', regNumber: 'vats', email: 'vats', password: 'vats1234', hostelBlock: 'C', roomNumber: '404', role: 'student' },
  // Staff
  { name: 'Rajesh Verma', email: 'rajesh@university.edu', password: 'password123', role: 'staff', specialization: 'Electrical', phone: '9876543210' },
  { name: 'Suresh Yadav', email: 'suresh@university.edu', password: 'password123', role: 'staff', specialization: 'Plumbing', phone: '9876543211' },
  { name: 'Manoj Singh', email: 'manoj@university.edu', password: 'password123', role: 'staff', specialization: 'WiFi', phone: '9876543212' },
  { name: 'Deepak Gupta', email: 'deepak@university.edu', password: 'password123', role: 'staff', specialization: 'Furniture', phone: '9876543213' },
  { name: 'Vats Demo', email: 'vats@staff.edu', password: 'vats1234', role: 'staff', specialization: 'General', phone: '9876543214' },
  // Admins
  { name: 'Dr. Anand Mishra', email: 'admin@university.edu', password: 'admin123', role: 'admin', designation: 'Chief Warden' },
  { name: 'Prof. Sunita Joshi', email: 'warden@university.edu', password: 'admin123', role: 'admin', designation: 'Hostel Warden' },
  { name: 'Vats Demo', email: 'vats@admin.edu', password: 'vats1234', role: 'admin', designation: 'Demo Admin' },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_management';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Feedback.deleteMany();

    // Seed Users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created.`);
    
    // We could seed complaints here as well, but this is a good start so the user can login.
    console.log('Database seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
