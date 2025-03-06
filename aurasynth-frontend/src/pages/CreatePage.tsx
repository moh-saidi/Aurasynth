import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignInSection from "../components/SignInSection";
import video1 from "../components/11.mp4";

const CreatePage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaderBig, setIsLoaderBig] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleGenerateClick = () => {
    setIsLoading(true);
    setIsLoaderBig(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsLoaderBig(false);
      console.log("Generate button clicked! Input value:", inputValue);
    }, 3000);
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

  const Loader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className={`${
          isLoaderBig ? "w-32 h-32 border-8" : "w-16 h-16 border-8"
        } border-dashed rounded-full animate-spin border-blue-600 transition-all duration-500`}
      ></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }} // Slide in from the right
      animate={{ opacity: 1, x: 0 }} // Animate to the center
      exit={{ opacity: 0, x: -100 }} // Slide out to the left
      transition={{ duration: 0.5 }} // Animation duration
      className="relative min-h-screen flex flex-col"
    >
      {/* Background Video with Fade-In and Fade-Out Animation */}
      <motion.div
        initial={{ opacity: 0 }} // Start fully transparent
        animate={{ opacity: 1 }} // Fade in to fully visible
        exit={{ opacity: 0 }} // Fade out to fully transparent
        transition={{ duration: 1, delay: 0.2 }} // Slow fade-in and fade-out
        className="fixed top-0 left-0 w-full h-full z-0"
      >
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          aria-label="Background video"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar toggleSignIn={toggleSignIn} />

        {/* SignInSection Popup */}
        {(showSignIn || isAnimatingOut) && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-40 ${
              isAnimatingOut ? "animate-slide-up" : "animate-slide-down"
            }`}
          >
            <div
              className="fixed inset-0 bg-black/50"
              onClick={toggleSignIn} // Close popup when clicking outside
            ></div>
            <div className="relative z-50">
              <SignInSection />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Create Something Amazing
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Enter your prompt below and let the magic happen.
            </p>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter your prompt..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-4 pl-6 pr-32 text-lg text-gray-900 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                aria-label="Input prompt"
              />
              <button
                type="button"
                onClick={handleGenerateClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Generate"
                disabled={isLoading}
              >
                Generate
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Loader */}
      {isLoading && <Loader />}
    </motion.div>
  );
};

export default CreatePage;