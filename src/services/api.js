import axios from 'axios';

// Use relative path for Vercel production, and localhost for local development
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Authentication ────────────────────────────────────────── */

export const loginUser = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerStudent = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/* ── Complaints ────────────────────────────────────────────── */

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const getComplaintsByStudent = async (studentId) => {
  const response = await api.get(`/complaints/student/${studentId}`);
  return response.data;
};

export const getComplaintsByStaff = async (staffId) => {
  const response = await api.get(`/complaints/staff/${staffId}`);
  return response.data;
};

export const createComplaint = async (complaint) => {
  const response = await api.post('/complaints', complaint);
  return response.data;
};

export const updateComplaintStatus = async (complaintId, status, resolutionNotes = '') => {
  const response = await api.patch(`/complaints/${complaintId}/status`, { status, resolutionNotes });
  return response.data;
};

export const assignStaff = async (complaintId, staffId) => {
  // Fetch staff name locally if needed, or pass it. 
  // Let's assume the frontend passes what we need, but here we just pass staffId.
  // Actually, wait, let's fetch staff to get the name
  const staffMembers = await getStaffMembers();
  const staff = staffMembers.find((s) => s.id === staffId);
  const staffName = staff ? staff.name : null;

  const response = await api.patch(`/complaints/${complaintId}/assign`, { staffId, staffName });
  return response.data;
};

export const setPriority = async (complaintId, priority) => {
  const response = await api.patch(`/complaints/${complaintId}/priority`, { priority });
  return response.data;
};

/* ── Feedback ──────────────────────────────────────────────── */

export const getFeedbacks = async () => {
  const response = await api.get('/feedbacks');
  return response.data;
};

export const submitFeedback = async (feedback) => {
  const response = await api.post('/feedbacks', feedback);
  return response.data;
};

/* ── Staff & Reference Data ───────────────────────────────── */

export const getStaffMembers = async () => {
  const response = await api.get('/staff');
  return response.data;
};

// Hardcoded reference data that rarely changes
export const getCategories = async () => {
  return ['Electrical', 'Plumbing', 'WiFi', 'Furniture', 'Sanitation', 'Other'];
};

export const getPriorities = async () => {
  return ['Low', 'Medium', 'High'];
};

export const getStatuses = async () => {
  return ['Pending', 'In Progress', 'Resolved'];
};

/* ── Analytics (Admin) ─────────────────────────────────────── */

export const getAnalytics = async () => {
  const all = await getComplaints();
  const categories = await getCategories();
  
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
