import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute – guards a route so only authenticated users
 * with the correct role can access it.
 *
 * @param {string} allowedRole – 'student' | 'staff' | 'admin'
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
