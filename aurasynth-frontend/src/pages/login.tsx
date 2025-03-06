import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import video1 from '../components/1.mp4';
import SignInSection from '../components/SignInSection';

const SignInPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {/* Background Video with Fade-In Animation */}
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
          className="w-full h-full object-cover"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Dark Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-1"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <Navbar toggleSignIn={toggleSignIn} />

        {/* SignInSection */}
        {(showSignIn || isAnimatingOut) && (
          <div className={`${isAnimatingOut ? 'animate-slide-up' : 'animate-slide-down'}`}>
            <SignInSection />
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </motion.div>
  );
};

export default SignInPage;