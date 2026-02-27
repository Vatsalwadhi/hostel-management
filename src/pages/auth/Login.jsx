import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

/**
 * Login Page – supports Student / Staff / Admin login.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser(form.email, form.password, form.role);
      login(user);
      // Redirect based on role
      const routes = { student: '/student', staff: '/staff', admin: '/admin' };
      navigate(routes[user.role] || '/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-600 text-white font-bold text-xl mb-3">
            HM
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome to HostelCare
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Smart Hostel Maintenance & Complaint System
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <InputField
            label="Email or Registration Number"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email or reg number"
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          {/* Role select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
            >
              <option value="student">Student</option>
              <option value="staff">Maintenance Staff</option>
              <option value="admin">Admin / Warden</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Student?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Student: rahul@university.edu / password123</p>
          <p>Staff: rajesh@university.edu / password123</p>
          <p>Admin: admin@university.edu / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
