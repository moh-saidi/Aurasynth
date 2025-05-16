import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignInSection from '../components/SignInSection';
import video1 from '../components/1.mp4';

const ContactPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null); // Clear error on input change
    setFormSuccess(null); // Clear success on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setFormSuccess('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormError(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
              Vous avez une question ou besoin d'assistance ? Envoyez-nous un message !
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div
                  className="text-red-600 dark:text-red-400 text-center"
                  role="alert"
                  aria-live="assertive"
                >
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  className="text-green-600 dark:text-green-400 text-center"
                  role="alert"
                  aria-live="assertive"
                >
                  {formSuccess}
                </div>
              )}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Votre nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="John Doe"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Votre email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="name@company.com"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Votre message ici..."
                  rows={5}
                  required
                  aria-required="true"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                aria-label="Envoyer le message"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Ou contactez-nous directement :
              </p>
              <a
                href="mailto:support@aurasynth.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                support@aurasynth.com
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </motion.div>
  );
};

export default ContactPage;