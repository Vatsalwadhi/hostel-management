import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaintsByStudent } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

/**
 * Complaint History – all past complaints with filter & search.
 */
const ComplaintHistory = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getComplaintsByStudent(user.id);
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComplaints(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user.id]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let result = [...complaints];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      result = result.filter(
        (c) => new Date(c.createdAt).toISOString().slice(0, 10) === dateFilter
      );
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [statusFilter, dateFilter, search, complaints]);

  if (loading) return <Spinner size="lg" className="mt-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Complaint History
      </h1>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by ID, category, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Date filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          />

          {(statusFilter !== 'All' || dateFilter || search) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setDateFilter('');
                setSearch('');
              }}
              className="text-sm text-red-500 hover:underline whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-gray-400">
            No complaints match your filters.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {c.id}
                    </span>
                    <Badge text={c.status} />
                    <Badge text={c.priority} />
                  </div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {c.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {c.description}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-right whitespace-nowrap">
                  <p>{new Date(c.createdAt).toLocaleDateString()}</p>
                  <p className="mt-0.5">
                    Staff: {c.assignedStaffName || 'Not assigned'}
                  </p>
                </div>
              </div>
              {c.resolutionNotes && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300">
                  <span className="font-medium">Resolution:</span> {c.resolutionNotes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;
