import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider – wraps the app to provide authentication state.
 * Persists user session to localStorage so it survives page reloads.
 * Persists dark mode preference to localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Restore dark mode from localStorage
    const stored = localStorage.getItem('hostel_darkMode');
    return stored === 'true';
  });

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('hostel_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setRole(parsed.role);
    }
  }, []);

  // Toggle dark mode class on <html> and persist preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hostel_darkMode', darkMode);
  }, [darkMode]);

  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('hostel_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('hostel_user');
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{ user, role, login, logout, darkMode, toggleDarkMode }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Custom hook – import this in any component that needs auth state */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
