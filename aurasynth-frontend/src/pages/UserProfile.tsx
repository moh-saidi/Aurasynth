import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignInSection from '../components/SignInSection';
import video1 from '../components/1.mp4';

const API_URL = 'http://localhost:5000';

const UserProfile: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connect', { state: { redirectTo: '/profile' } });
    } else {
      // Fetch current user data
      fetchUserData();
    }
  }, [isLoggedIn, navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      } else {
        setError('Failed to fetch user data');
      }
    } catch {
      setError('An error occurred while fetching user data');
    }
  };

  const toggleSignIn = () => {
    if (showSignIn) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowSignIn(false);
        setIsAnimatingOut(false);
      }, 500);
    } else {
      setShowSignIn(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userName', formData.name);
        setSuccess('Username updated successfully');
      } else {
        setError(data.message || 'Failed to update username');
      }
    } catch {
      setError('An error occurred while updating username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Email updated successfully');
      } else {
        setError(data.message || 'Failed to update email');
      }
    } catch {
      setError('An error occurred while updating email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Password updated successfully');
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch {
      setError('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/');
        window.location.reload(); // Refresh to reset state
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete account');
      }
    } catch {
      setError('An error occurred while deleting account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col"
    >
      {/* Background Video */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="fixed top-0 left-0 w-full h-full z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-label="Background video"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
      {/* Dark Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-1"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar toggleSignIn={toggleSignIn} />

        {/* SignInSection Popup */}
        {(showSignIn || isAnimatingOut) && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-40 ${
              isAnimatingOut ? 'animate-slide-up' : 'animate-slide-down'
            }`}
          >
            <div className="fixed inset-0 bg-black/50" onClick={toggleSignIn}></div>
            <div className="relative z-50">
              <SignInSection />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Profile Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
              Manage your account details below.
            </p>

            {error && (
              <div
                className="text-red-600 dark:text-red-400 text-center mb-6"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="text-green-600 dark:text-green-400 text-center mb-6"
                role="alert"
                aria-live="assertive"
              >
                {success}
              </div>
            )}

            {/* Update Username */}
            <form onSubmit={handleUpdateUsername} className="space-y-6 mb-8">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your username"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                aria-label="Update username"
              >
                {isLoading ? 'Updating...' : 'Update Username'}
              </button>
            </form>

            {/* Update Email */}
            <form onSubmit={handleUpdateEmail} className="space-y-6 mb-8">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="name@company.com"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                aria-label="Update email"
              >
                {isLoading ? 'Updating...' : 'Update Email'}
              </button>
            </form>

            {/* Update Password */}
            <form onSubmit={handleUpdatePassword} className="space-y-6 mb-8">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="New password"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Confirm new password"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                aria-label="Update password"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            {/* Delete Account */}
            <div className="text-center">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50"
                aria-label="Delete account"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </motion.div>
  );
};

export default UserProfile;