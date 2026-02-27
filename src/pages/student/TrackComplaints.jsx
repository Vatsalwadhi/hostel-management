import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaintsByStudent } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

/**
 * Track Complaints – table (desktop) / cards (mobile) with status badges.
 */
const TrackComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getComplaintsByStudent(user.id);
        setComplaints(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user.id]);

  if (loading) return <Spinner size="lg" className="mt-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Track Complaints
      </h1>

      {complaints.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-gray-400">No complaints to track.</p>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Assigned Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 font-mono text-xs">{c.id}</td>
                        <td className="py-3">{c.category}</td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <Badge text={c.status} />
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-300">
                          {c.assignedStaffName || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {complaints.map((c) => (
              <Card key={c.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {c.id}
                  </span>
                  <Badge text={c.status} />
                </div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {c.category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleDateString()} • Staff:{' '}
                  {c.assignedStaffName || 'Not assigned'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {c.description}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrackComplaints;
