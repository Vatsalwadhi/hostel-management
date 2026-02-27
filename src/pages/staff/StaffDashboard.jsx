import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaintsByStaff, updateComplaintStatus } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

/**
 * Staff Dashboard – view assigned complaints, update status, add resolution notes.
 */
const StaffDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal state for resolution notes
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resNotes, setResNotes] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [user.id]);

  const fetchComplaints = async () => {
    try {
      const data = await getComplaintsByStaff(user.id);
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...complaints];
    if (statusFilter !== 'All') result = result.filter((c) => c.status === statusFilter);
    if (categoryFilter !== 'All') result = result.filter((c) => c.category === categoryFilter);
    setFiltered(result);
  }, [statusFilter, categoryFilter, complaints]);

  const handleStatusUpdate = async (complaintId, newStatus, notes = '') => {
    setUpdating(complaintId);
    try {
      const updated = await updateComplaintStatus(complaintId, newStatus, notes);
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? updated : c))
      );
      setToast(`Complaint ${complaintId} marked as ${newStatus}`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast('Error: ' + err.message);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setUpdating(null);
    }
  };

  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setResNotes(complaint.resolutionNotes || '');
    setModalOpen(true);
  };

  const handleResolve = async () => {
    if (selectedComplaint) {
      await handleStatusUpdate(selectedComplaint.id, 'Resolved', resNotes);
      setModalOpen(false);
    }
  };

  if (loading) return <Spinner size="lg" className="mt-20" />;

  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const stats = [
    { label: 'Assigned', value: complaints.length, icon: HiOutlineClipboardDocumentList, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Pending', value: pending, icon: HiOutlineClock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
    { label: 'In Progress', value: inProgress, icon: HiOutlineWrenchScrewdriver, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Resolved', value: resolved, icon: HiOutlineCheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
  ];

  const uniqueCategories = ['All', ...new Set(complaints.map((c) => c.category))];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        Staff Dashboard
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Welcome, {user.name} – {user.specialization} Specialist
      </p>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            toast.startsWith('Error')
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Complaint cards */}
      {filtered.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-gray-400">No complaints match your filters.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <Card key={c.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {c.id}
                </span>
                <div className="flex gap-1.5">
                  <Badge text={c.status} />
                  <Badge text={c.priority} />
                </div>
              </div>

              <p className="font-semibold text-gray-800 dark:text-white">{c.category}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.description}</p>

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                <p>Student: {c.studentName}</p>
                <p>Block {c.hostelBlock}, Room {c.roomNumber}</p>
                <p>Date: {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Image preview placeholder */}
              {c.image && (
                <img
                  src={c.image}
                  alt="Complaint"
                  className="mt-3 h-32 rounded-lg object-cover border dark:border-gray-700"
                />
              )}

              {c.resolutionNotes && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Notes:</span> {c.resolutionNotes}
                </div>
              )}

              {/* Actions */}
              {c.status !== 'Resolved' && (
                <div className="mt-4 flex gap-2">
                  {c.status === 'Pending' && (
                    <Button
                      variant="primary"
                      className="text-xs px-3 py-1.5"
                      disabled={updating === c.id}
                      onClick={() => handleStatusUpdate(c.id, 'In Progress')}
                    >
                      {updating === c.id ? (
                        <Spinner size="sm" />
                      ) : (
                        'Mark In Progress'
                      )}
                    </Button>
                  )}
                  {(c.status === 'Pending' || c.status === 'In Progress') && (
                    <Button
                      variant="success"
                      className="text-xs px-3 py-1.5"
                      onClick={() => openResolveModal(c)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Resolution Notes Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Resolution Notes"
      >
        <textarea
          value={resNotes}
          onChange={(e) => setResNotes(e.target.value)}
          rows={4}
          placeholder="Describe what was done to resolve the issue..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleResolve}
            disabled={updating === selectedComplaint?.id}
          >
            {updating === selectedComplaint?.id ? (
              <Spinner size="sm" />
            ) : (
              'Confirm Resolved'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StaffDashboard;
