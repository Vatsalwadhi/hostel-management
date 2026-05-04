import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { getComplaintsByStudent, getComplaintsByStaff, getComplaints } from '../../services/api';

/**
 * Top Navbar – displays user info, dark mode toggle, notification bell, logout.
 */
const Navbar = ({ onMenuToggle }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Fetch real notifications based on role
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let complaints = [];
        if (user?.role === 'student') {
          complaints = await getComplaintsByStudent(user.id);
        } else if (user?.role === 'staff') {
          complaints = await getComplaintsByStaff(user.id);
        } else if (user?.role === 'admin') {
          complaints = await getComplaints();
        }

        const notifs = [];
        // Recent pending complaints
        const pending = complaints.filter(c => c.status === 'Pending').slice(0, 2);
        pending.forEach(c => {
          notifs.push({ id: c.id || c._id, text: `⏳ ${c.category} complaint is still pending`, type: 'warning' });
        });
        // Recent in-progress
        const inProgress = complaints.filter(c => c.status === 'In Progress').slice(0, 2);
        inProgress.forEach(c => {
          notifs.push({ id: c.id || c._id, text: `🔧 ${c.category} complaint is being worked on`, type: 'info' });
        });
        // Recent resolved
        const resolved = complaints.filter(c => c.status === 'Resolved').slice(0, 1);
        resolved.forEach(c => {
          notifs.push({ id: c.id || c._id, text: `✅ ${c.category} complaint has been resolved`, type: 'success' });
        });

        setNotifications(notifs.slice(0, 5));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const typeStyles = {
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      {/* Left – hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
      >
        <HiOutlineBars3 className="h-6 w-6" />
      </button>

      {/* Page title placeholder */}
      <div className="hidden lg:block" />

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? (
            <HiOutlineSun className="h-5 w-5" />
          ) : (
            <HiOutlineMoon className="h-5 w-5" />
          )}
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <HiOutlineBell className="h-5 w-5" />
            {/* Red dot – only show if there are notifications */}
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-50">
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                Notifications
              </p>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {notifications.map((n) => (
                    <p
                      key={n.id}
                      className={`p-2.5 rounded-lg ${typeStyles[n.type] || typeStyles.info}`}
                    >
                      {n.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User info */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800 dark:text-white leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
