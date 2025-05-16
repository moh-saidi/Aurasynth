import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const SignInSection: React.FC = () => {
  const [view, setView] = useState<'signIn' | 'register' | 'forgotPassword'>('signIn');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';
  const API_URL = 'http://localhost:5000';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value });
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 1): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status === 0) {
        throw new Error('Network error or CORS issue');
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying request to ${url}, retries left: ${retries}`);
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('handleRegister called with:', formData);

    // Client-side validation
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }
    if (formData.email.includes('tempmail.com') || formData.email.includes('mailinator.com')) {
      setError('Disposable email addresses are not allowed');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    console.log('Password:', formData.password, 'Regex test:', passwordRegex.test(formData.password));
    if (!passwordRegex.test(formData.password)) {
      setError(
        'Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchWithRetry(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (response.ok) {
        setView('signIn');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setError(null);
      } else {
        const errorMessage = data.errors?.join(', ') || data.message || `Registration failed (Status: ${response.status})`;
        setError(errorMessage);
        console.error('Registration error:', {
          status: response.status,
          statusText: response.statusText,
          data,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Registration fetch error:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        url: `${API_URL}/api/register`,
      });
      setError(
        errorMessage.includes('CORS')
          ? 'CORS error: The backend may not allow requests from this origin. Check backend CORS settings.'
          : `Unable to connect to the server at ${API_URL}. Please ensure the backend is running and accessible from your browser.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log('Login attempt:', { email: formData.email, password: formData.password });

    try {
      const response = await fetchWithRetry(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        navigate(redirectTo);
        if (redirectTo === '/') {
          window.location.reload();
        }
      } else {
        setError(data.message || `Login failed (Status: ${response.status})`);
        console.error('Login error:', {
          status: response.status,
          statusText: response.statusText,
          data,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Login fetch error:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        url: `${API_URL}/api/login`,
      });
      setError(
        errorMessage.includes('CORS')
          ? 'CORS error: The backend may not allow requests from this origin. Check backend CORS settings.'
          : `Unable to connect to the server at ${API_URL}. Please ensure the backend is running and accessible from your browser.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetchWithRetry(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setError(null);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        alert('A password reset link has been sent to your email. Please check your inbox.');
        setView('signIn');
      } else {
        setError(data.message || 'Failed to send password reset email');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(
        errorMessage.includes('CORS')
          ? 'CORS error: The backend may not allow requests from this origin.'
          : 'Unable to connect to the server. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full mx-4"
    >
      {error && (
        <div
          className="mb-4 text-red-600 dark:text-red-400 text-center"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {view === 'signIn' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Connexion
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              aria-label="Se connecter"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setView('forgotPassword')}
              className="text-blue-600 hover:underline dark:text-blue-400"
              aria-label="Mot de passe oublié"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-gray-600 dark:text-gray-300">
              Pas de compte ?{' '}
            </span>
            <button
              onClick={() => setView('register')}
              className="text-blue-600 hover:underline dark:text-blue-400"
              aria-label="S’inscrire"
            >
              S’inscrire
            </button>
          </div>
        </div>
      )}

      {view === 'register' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Inscription
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum 8 characters, with uppercase, lowercase, number, and special character (e.g., @$!%*?&).
              </p>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              aria-label="S’inscrire"
            >
              {isLoading ? 'Inscription en cours...' : 'S’inscrire'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600 dark:text-gray-300">
              Déjà un compte ?{' '}
            </span>
            <button
              onClick={() => setView('signIn')}
              className="text-blue-600 hover:underline dark:text-blue-400"
              aria-label="Se connecter"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}

      {view === 'forgotPassword' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Récupérer le mot de passe
          </h2>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              aria-label="Envoyer le lien de réinitialisation"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setView('signIn')}
              className="text-blue-600 hover:underline dark:text-blue-400"
              aria-label="Retour à la connexion"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SignInSection;