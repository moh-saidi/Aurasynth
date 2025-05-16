import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignInSection from "../components/SignInSection";
import MidiPlayer from "../components/MidiPlayer";
import video1 from "../components/11.mp4";

interface MIDIFile {
  _id: string;
  prompt: string;
  filePath: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreatePage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [midis, setMidis] = useState<MIDIFile[]>([]);
  const [isMidisLoading, setIsMidisLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      fetchMidis();
    }
  }, [isLoggedIn]);

  const fetchMidis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-music`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch MIDI files");
      }

      const data = await response.json();
      setMidis(data.map((midi: MIDIFile) => ({
        ...midi,
        filePath: `${API_URL}${midi.filePath}`
      })));
    } catch (error) {
      console.error("Error fetching MIDI files:", error);
      setError("Failed to load your music. Please refresh the page.");
    }
  };

  const handleGenerateClick = async () => {
    if (!isLoggedIn) {
      setShowSignIn(true);
      return;
    }

    if (!inputValue.trim()) {
      setError("Prompt is required");
      return;
    }

    setIsMidisLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/generate-music`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate MIDI");
      }

      // Wait for 10 seconds to show loading animation
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error generating MIDI:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsMidisLoading(false);
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

  const MidisLoader = () => (
    <div className="flex items-center justify-center py-6">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed top-0 left-0 w-full h-full z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={video1} type="video/mp4" />
        </video>
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar toggleSignIn={toggleSignIn} />

        {(showSignIn || isAnimatingOut) && (
          <div className={`fixed inset-0 flex items-center justify-center z-40 ${
            isAnimatingOut ? "animate-slide-up" : "animate-slide-down"
          }`}>
            <div className="fixed inset-0 bg-black/50" onClick={toggleSignIn}></div>
            <div className="relative z-50">
              <SignInSection />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Create Something Amazing</h1>
            <p className="text-lg text-gray-300 mb-8">
              Enter your prompt below and let the magic happen.
            </p>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter your prompt..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isMidisLoading) {
                    handleGenerateClick();
                  }
                }}
                className="w-full p-4 pl-6 pr-32 text-lg text-gray-900 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={isMidisLoading}
              />
              <button
                type="button"
                onClick={handleGenerateClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                disabled={isMidisLoading}
              >
                Generate
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-600 dark:text-red-400 text-center" role="alert">
                {error}
              </div>
            )}
          </div>

          {isLoggedIn && (
            <div className="w-full max-w-2xl mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Generated MIDI Files</h2>
              {isMidisLoading ? (
                <MidisLoader />
              ) : midis.length > 0 ? (
                <div className="space-y-6">
                  {midis.map((midi) => (
                    <div
                      key={midi._id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        <strong>Prompt:</strong> {midi.prompt}
                      </p>
                      <MidiPlayer url={midi.filePath} />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Created: {new Date(midi.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No MIDI files generated yet. Try creating some!</p>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <p className="mt-8 text-gray-300">
              <button
                onClick={toggleSignIn}
                className="text-blue-400 hover:underline"
              >
                Log in
              </button>{" "}
              to view your generated MIDI files.
            </p>
          )}
        </main>

        <Footer />
      </div>
    </motion.div>
  );
};

export default CreatePage;