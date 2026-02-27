import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar navigation – shows links based on user role.
 */
const navItems = {
  student: [
    { to: '/student', icon: HiOutlineHome, label: 'Dashboard', end: true },
    { to: '/student/raise', icon: HiOutlinePlusCircle, label: 'Raise Complaint' },
    { to: '/student/track', icon: HiOutlineClipboardDocumentList, label: 'Track Complaints' },
    { to: '/student/history', icon: HiOutlineClock, label: 'History' },
    { to: '/student/feedback', icon: HiOutlineStar, label: 'Feedback' },
  ],
  staff: [
    { to: '/staff', icon: HiOutlineWrenchScrewdriver, label: 'Dashboard', end: true },
  ],
  admin: [
    { to: '/admin', icon: HiOutlineChartBar, label: 'Dashboard', end: true },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const links = navItems[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            HM
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-lg">
            HostelCare
          </span>
        </div>

        {/* Nav links */}
        <nav className="mt-6 px-3 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
