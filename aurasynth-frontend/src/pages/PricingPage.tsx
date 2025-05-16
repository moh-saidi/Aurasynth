import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignInSection from '../components/SignInSection';
import video1 from '../components/1.mp4';

const pricingPlans = [
  {
    name: 'Gratuit',
    price: '0€',
    description: 'Idéal pour découvrir AuraSynth et ses fonctionnalités de base.',
    features: [
      'Génération de musique limitée',
      'Accès à 1 modèle de base',
      'Support par email',
    ],
    ctaText: 'Commencer gratuitement',
    ctaLink: '/create',
    highlighted: false,
    requiresAuth: false,
  },
  {
    name: 'Premium',
    price: '9.99€/mois',
    description: 'Pour les créateurs sérieux qui veulent plus de puissance et de flexibilité.',
    features: [
      'Génération illimitée',
      'Accès à tous les modèles',
      'Support prioritaire',
      'Export en haute qualité',
    ],
    ctaText: 'S’abonner',
    ctaLink: '/create', // Could be updated to a subscription checkout route
    highlighted: true,
    requiresAuth: true,
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    description: 'Solutions personnalisées pour les équipes et les projets professionnels.',
    features: [
      'Fonctionnalités sur mesure',
      'Support dédié 24/7',
      'Intégration API',
      'Gestion multi-utilisateur',
    ],
    ctaText: 'Contactez-nous',
    ctaLink: '/contact',
    highlighted: false,
    requiresAuth: false,
  },
];

const PricingPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

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

  const handleCtaClick = (plan: typeof pricingPlans[0]) => {
    if (plan.requiresAuth && !isLoggedIn) {
      navigate('/connect', { state: { redirectTo: plan.ctaLink } });
    } else {
      navigate(plan.ctaLink);
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
          <div className="w-full max-w-5xl text-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Choisissez votre plan AuraSynth
            </h1>
            <p className="text-lg text-gray-300 mb-12">
              Trouvez le plan parfait pour libérer votre créativité musicale.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`p-6 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg ${
                    plan.highlighted ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                    {plan.price}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {plan.description}
                  </p>
                  <ul className="text-left text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCtaClick(plan)}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    }`}
                    aria-label={`Choisir le plan ${plan.name}`}
                  >
                    {plan.ctaText}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </motion.div>
  );
};

export default PricingPage;