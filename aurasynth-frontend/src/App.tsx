import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import SignInPage from './pages/login';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import UserProfile from './pages/UserProfile';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/connect" element={<SignInPage/>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reset-password" element={<SignInPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;