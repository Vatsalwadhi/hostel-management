import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../../services/api';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

/**
 * Register Page – Student registration only.
 */
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    regNumber: '',
    hostelBlock: '',
    roomNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.regNumber.trim()) errs.regNumber = 'Registration number is required.';
    if (!form.hostelBlock.trim()) errs.hostelBlock = 'Hostel block is required.';
    if (!form.roomNumber.trim()) errs.roomNumber = 'Room number is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await registerStudent(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-600 text-white font-bold text-xl mb-3">
            HM
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Student Registration
          </h1>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
              Registration Successful!
            </h2>
            <p className="text-green-600 dark:text-green-400 text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              error={errors.name}
            />
            <InputField
              label="Registration Number"
              name="regNumber"
              value={form.regNumber}
              onChange={handleChange}
              placeholder="REG2024XXX"
              required
              error={errors.regNumber}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Hostel Block"
                name="hostelBlock"
                value={form.hostelBlock}
                onChange={handleChange}
                placeholder="A"
                required
                error={errors.hostelBlock}
              />
              <InputField
                label="Room Number"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="101"
                required
                error={errors.roomNumber}
              />
            </div>

            <InputField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              required
              error={errors.email}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              error={errors.password}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Spinner size="sm" /> : 'Register'}
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
