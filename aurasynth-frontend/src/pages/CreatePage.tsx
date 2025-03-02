import React, { useState } from "react";
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import video1 from "../components/1.mp4";

const CreatePage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaderBig, setIsLoaderBig] = useState(false);

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
    console.log("Sign-in toggled");
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

        <div className="flex items-center justify-center p-4 pt-20">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Enter your prompt..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 pl-4 pr-24 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            <button
              type="button"
              onClick={handleGenerateClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Generate
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
              className={`${
                isLoaderBig ? "w-32 h-32 border-8" : "w-16 h-16 border-8"
              } border-dashed rounded-full animate-spin border-blue-600 transition-all duration-500`}
            ></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreatePage;