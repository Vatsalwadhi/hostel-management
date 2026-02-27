import { useState, useEffect } from 'react';
import {
  getComplaints,
  getStaffMembers,
  getAnalytics,
  assignStaff,
  setPriority,
  updateComplaintStatus,
} from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Admin Dashboard – full complaint management, analytics charts.
 */
const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [compData, staffData, analyticsData] = await Promise.all([
        getComplaints(),
        getStaffMembers(),
        getAnalytics(),
      ]);
      setComplaints(compData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setStaff(staffData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStaff = async (complaintId, staffId) => {
    try {
      const updated = await assignStaff(complaintId, staffId);
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updated : c)));
      showToast(`Staff assigned to ${complaintId}`);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleSetPriority = async (complaintId, priority) => {
    try {
      const updated = await setPriority(complaintId, priority);
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updated : c)));
      showToast(`Priority set to ${priority} for ${complaintId}`);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    try {
      const updated = await updateComplaintStatus(complaintId, status);
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? updated : c)));
      showToast(`Status updated to ${status} for ${complaintId}`);
      // Refresh analytics
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  if (loading) return <Spinner size="lg" className="mt-20" />;

  // Chart data
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Complaints',
        data: [
          analytics?.pending || 0,
          analytics?.inProgress || 0,
          analytics?.resolved || 0,
        ],
        backgroundColor: ['#fbbf24', '#3b82f6', '#22c55e'],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Complaints by Status', font: { size: 14 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const categoryChartData = {
    labels: analytics?.byCategory?.map((c) => c.category) || [],
    datasets: [
      {
        label: 'Complaints',
        data: analytics?.byCategory?.map((c) => c.count) || [],
        backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Complaints by Category', font: { size: 14 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const statCards = [
    { label: 'Total Complaints', value: analytics?.total, icon: HiOutlineClipboardDocumentList, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Pending', value: analytics?.pending, icon: HiOutlineClock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
    { label: 'Resolved', value: analytics?.resolved, icon: HiOutlineCheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
    { label: 'High Priority', value: analytics?.highPriority, icon: HiOutlineExclamationTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        Admin Dashboard
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Overview of all hostel complaints and maintenance
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="h-64">
            <Bar data={statusChartData} options={chartOptions} />
          </div>
        </Card>
        <Card>
          <div className="h-64">
            <Bar data={categoryChartData} options={categoryChartOptions} />
          </div>
        </Card>
      </div>

      {/* Complaints table */}
      <Card title="All Complaints">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Assigned Staff</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 font-mono text-xs">{c.id}</td>
                  <td className="py-3">{c.studentName}</td>
                  <td className="py-3">{c.category}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Badge text={c.status} />
                  </td>
                  <td className="py-3">
                    <Badge text={c.priority} />
                  </td>
                  <td className="py-3 text-xs">
                    {c.assignedStaffName || '—'}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-1.5">
                      {/* Assign staff dropdown */}
                      <select
                        value={c.assignedStaff || ''}
                        onChange={(e) => handleAssignStaff(c.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        <option value="">Assign Staff</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {/* Priority dropdown */}
                      <select
                        value={c.priority}
                        onChange={(e) => handleSetPriority(c.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>

                      {/* Status actions */}
                      <div className="flex gap-1">
                        {c.status !== 'Resolved' && (
                          <>
                            {c.status === 'Pending' && (
                              <Button
                                variant="primary"
                                className="text-xs px-2 py-0.5"
                                onClick={() => handleStatusChange(c.id, 'In Progress')}
                              >
                                Start
                              </Button>
                            )}
                            <Button
                              variant="success"
                              className="text-xs px-2 py-0.5"
                              onClick={() => handleStatusChange(c.id, 'Resolved')}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {c.status !== 'Pending' && c.priority !== 'High' && (
                          <Button
                            variant="danger"
                            className="text-xs px-2 py-0.5"
                            onClick={() => handleSetPriority(c.id, 'High')}
                          >
                            Escalate
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
