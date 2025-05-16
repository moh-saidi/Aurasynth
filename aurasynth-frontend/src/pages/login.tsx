import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import video1 from '../components/1.mp4';
import SignInSection from '../components/SignInSection';

const SignInPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';

  const toggleSignIn = () => {
    if (showSignIn) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowSignIn(false);
        setIsAnimatingOut(false);
        navigate(redirectTo);
      }, 500);
    } else {
      setShowSignIn(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
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

      <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-1"></div>

      <div className="relative z-10">
        <Navbar toggleSignIn={toggleSignIn} />

        {showSignIn || isAnimatingOut ? (
          <div className={`flex flex-col items-center justify-center py-12 ${isAnimatingOut ? 'animate-slide-up' : 'animate-slide-down'}`}>
            <SignInSection />
          </div>
        ) : null}

        <Footer />
      </div>
    </motion.div>
  );
};

export default SignInPage;