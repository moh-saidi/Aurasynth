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
      initial={{ opacity: 0, x: -100 }} // Slide in from the left
      animate={{ opacity: 1, x: 0 }} // Animate to the center
      exit={{ opacity: 0, x: 100 }} // Slide out to the right
      transition={{ duration: 0.5 }} // Animation duration
      className="relative min-h-screen"
    >
      {/* Background Video with Fade-In Animation */}
      <motion.div
        initial={{ opacity: 0 }} // Start fully transparent
        animate={{ opacity: 1 }} // Fade in to fully visible
        transition={{ duration: 2, delay: 0.5 }} // Slow fade-in with a slight delay
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

      <div className="relative z-10">
  <Navbar toggleSignIn={toggleSignIn} />
  
  {/* Main Content Area */}
  <div className="min-h-[calc(100vh-200px)] flex flex-col">
    {showSignIn || isAnimatingOut ? (
      <div className={`flex-1 flex items-center justify-center ${isAnimatingOut ? 'animate-slide-up' : 'animate-slide-down'}`}>
        <SignInSection />
      </div>
    ) : null}
    
    {showHero && (
      <div className={`flex-1 ${isHeroFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <Hero />
      </div>
    )}
  </div>

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