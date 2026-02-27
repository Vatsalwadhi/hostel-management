/*
 * Mock API Service Layer
 * Simulates async API calls using Promise + setTimeout
 * All data operations go through this service
 */

import {
  students,
  staffMembers,
  admins,
  complaints as initialComplaints,
  feedbacks as initialFeedbacks,
  categories,
  priorities,
  statuses,
} from './mockData';

// In-memory data store (simulates database)
let complaintsStore = [...initialComplaints];
let feedbacksStore = [...initialFeedbacks];
let studentsStore = [...students];

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/* ── Authentication ────────────────────────────────────────── */

export const loginUser = async (email, password, role) => {
  await delay(800);
  let userPool = [];
  if (role === 'student') userPool = studentsStore;
  else if (role === 'staff') userPool = staffMembers;
  else if (role === 'admin') userPool = admins;

  const user = userPool.find(
    (u) =>
      (u.email === email || u.regNumber === email) && u.password === password
  );

  if (!user) throw new Error('Invalid credentials. Please try again.');
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const registerStudent = async (data) => {
  await delay(800);
  const exists = studentsStore.find(
    (s) => s.email === data.email || s.regNumber === data.regNumber
  );
  if (exists) throw new Error('Student with this email or registration number already exists.');

  const newStudent = {
    id: `STU${String(studentsStore.length + 1).padStart(3, '0')}`,
    ...data,
    role: 'student',
  };
  studentsStore.push(newStudent);
  return newStudent;
};

/* ── Complaints ────────────────────────────────────────────── */

export const getComplaints = async () => {
  await delay(400);
  return [...complaintsStore];
};

export const getComplaintsByStudent = async (studentId) => {
  await delay(400);
  return complaintsStore.filter((c) => c.studentId === studentId);
};

export const getComplaintsByStaff = async (staffId) => {
  await delay(400);
  return complaintsStore.filter((c) => c.assignedStaff === staffId);
};

export const createComplaint = async (complaint) => {
  await delay(600);
  const newComplaint = {
    id: `CMP${String(complaintsStore.length + 1).padStart(3, '0')}`,
    ...complaint,
    status: 'Pending',
    priority: 'Medium',
    assignedStaff: null,
    assignedStaffName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolutionNotes: '',
  };
  complaintsStore.push(newComplaint);
  return newComplaint;
};

export const updateComplaintStatus = async (complaintId, status, resolutionNotes = '') => {
  await delay(500);
  const idx = complaintsStore.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found.');
  complaintsStore[idx] = {
    ...complaintsStore[idx],
    status,
    resolutionNotes: resolutionNotes || complaintsStore[idx].resolutionNotes,
    updatedAt: new Date().toISOString(),
  };
  return complaintsStore[idx];
};

export const assignStaff = async (complaintId, staffId) => {
  await delay(500);
  const idx = complaintsStore.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found.');
  const staff = staffMembers.find((s) => s.id === staffId);
  if (!staff) throw new Error('Staff member not found.');
  complaintsStore[idx] = {
    ...complaintsStore[idx],
    assignedStaff: staffId,
    assignedStaffName: staff.name,
    updatedAt: new Date().toISOString(),
  };
  return complaintsStore[idx];
};

export const setPriority = async (complaintId, priority) => {
  await delay(300);
  const idx = complaintsStore.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found.');
  complaintsStore[idx] = {
    ...complaintsStore[idx],
    priority,
    updatedAt: new Date().toISOString(),
  };
  return complaintsStore[idx];
};

/* ── Feedback ──────────────────────────────────────────────── */

export const getFeedbacks = async () => {
  await delay(400);
  return [...feedbacksStore];
};

export const submitFeedback = async (feedback) => {
  await delay(500);
  const newFeedback = {
    id: `FDB${String(feedbacksStore.length + 1).padStart(3, '0')}`,
    ...feedback,
    createdAt: new Date().toISOString(),
  };
  feedbacksStore.push(newFeedback);
  return newFeedback;
};

/* ── Staff & Reference Data ───────────────────────────────── */

export const getStaffMembers = async () => {
  await delay(300);
  return staffMembers.map(({ password, ...s }) => s);
};

export const getCategories = async () => {
  await delay(100);
  return categories;
};

export const getPriorities = async () => {
  await delay(100);
  return priorities;
};

export const getStatuses = async () => {
  await delay(100);
  return statuses;
};

/* ── Analytics (Admin) ─────────────────────────────────────── */

export const getAnalytics = async () => {
  await delay(500);
  const all = complaintsStore;
  return {
    total: all.length,
    pending: all.filter((c) => c.status === 'Pending').length,
    inProgress: all.filter((c) => c.status === 'In Progress').length,
    resolved: all.filter((c) => c.status === 'Resolved').length,
    highPriority: all.filter((c) => c.priority === 'High').length,
    byCategory: categories.map((cat) => ({
      category: cat,
      count: all.filter((c) => c.category === cat).length,
    })),
  };
};
