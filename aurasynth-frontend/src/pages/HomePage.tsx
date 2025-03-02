import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CtaSection from '../components/CTA';
import StatsSection from '../components/stats';
import FAQSection from '../components/Faq';
import video1 from '../components/1.mp4';
import Footer from "../components/Footer";
import FeaturesSection from '../components/FeaturesSection';
import SignInSection from '../components/SignInSection';

const HomePage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [isHeroFadingOut, setIsHeroFadingOut] = useState(false);

  const toggleSignIn = () => {
    if (showSignIn) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowSignIn(false);
        setIsAnimatingOut(false);
        setShowHero(true);
      }, 500);
    } else {
      setIsHeroFadingOut(true);
      setTimeout(() => {
        setShowSignIn(true);
        setShowHero(false);
        setIsHeroFadingOut(false);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={video1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10">
        <Navbar toggleSignIn={toggleSignIn} />
        {showSignIn || isAnimatingOut ? (
          <div className={`animate-slide-down ${isAnimatingOut ? 'animate-slide-up' : ''}`}>
            <SignInSection />
          </div>
        ) : null}
        {showHero && (
          <div className={`${isHeroFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <Hero />
          </div>
        )}
        <CtaSection />
        <StatsSection />
        <FeaturesSection />
        <FAQSection />
        <Footer />
      </div>
    </motion.div>
  );
};

export default HomePage;