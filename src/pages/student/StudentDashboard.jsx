import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaintsByStudent } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

/**
 * Student Dashboard – overview cards + recent complaints.
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getComplaintsByStudent(user.id);
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <Spinner size="lg" className="mt-20" />;

  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total', value: complaints.length, icon: HiOutlineClipboardDocumentList, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Pending', value: pending, icon: HiOutlineClock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
    { label: 'In Progress', value: inProgress, icon: HiOutlineExclamationTriangle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Resolved', value: resolved, icon: HiOutlineCheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
  ];

  const recent = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        Welcome, {user.name} 👋
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Block {user.hostelBlock} – Room {user.roomNumber}
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
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

      {/* Recent complaints */}
      <Card title="Recent Complaints">
        {recent.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No complaints yet. Raise one from the menu!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {recent.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 font-mono text-xs">{c.id}</td>
                    <td className="py-3">{c.category}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge text={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
