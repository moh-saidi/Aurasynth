import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

enum ViewType {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const ANIMATION_DURATION = 0.3;

const Form: React.FC<{
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  footerText: string;
  footerActionText: string;
  onFooterAction: (e: React.MouseEvent) => void;
}> = ({ title, onSubmit, children, footerText, footerActionText, onFooterAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: ANIMATION_DURATION }}
  >
    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
      {title}
    </h1>
    <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
      {children}
      <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
        {footerText}{" "}
        <a
          href="#"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          onClick={onFooterAction}
        >
          {footerActionText}
        </a>
      </p>
    </form>
  </motion.div>
);

const SignInSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.SIGN_IN);

  const handleViewChange = (view: ViewType, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView(view);
  };

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
      {/* Form Container */}
      <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(31,41,55,0.9)] bg-opacity-90 relative z-10">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* Sign-in Form */}
            {currentView === ViewType.SIGN_IN && (
              <Form
                title="Connexion à votre compte"
                onSubmit={(e) => e.preventDefault()}
                footerText="Pas encore de compte ?"
                footerActionText="S'inscrire"
                onFooterAction={(e) => handleViewChange(ViewType.REGISTER, e)}
              >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                    <label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-white hover:underline dark:text-primary-500"
                    onClick={(e) => handleViewChange(ViewType.FORGOT_PASSWORD, e)}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
                  >
                    Se connecter
                  </button>
                </div>
              </Form>
            )}

            {/* Register Form */}
            {currentView === ViewType.REGISTER && (
              <Form
                title="Créer un compte"
                onSubmit={(e) => e.preventDefault()}
                footerText="Déjà un compte ?"
                footerActionText="Se connecter"
                onFooterAction={(e) => handleViewChange(ViewType.SIGN_IN, e)}
              >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
                  >
                    S'inscrire
                  </button>
                </div>
              </Form>
            )}

            {/* Forgot Password Form */}
            {currentView === ViewType.FORGOT_PASSWORD && (
              <Form
                title="Réinitialiser votre mot de passe"
                onSubmit={(e) => e.preventDefault()}
                footerText="Vous vous souvenez de votre mot de passe ?"
                footerActionText="Se connecter"
                onFooterAction={(e) => handleViewChange(ViewType.SIGN_IN, e)}
              >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
                  >
                    Réinitialiser
                  </button>
                </div>
              </Form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SignInSection;