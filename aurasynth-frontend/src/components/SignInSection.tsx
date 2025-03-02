import React, { useState, useEffect } from "react";

const SignInSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<"sign-in" | "register" | "forgot-password">("sign-in");
  const [nextView, setNextView] = useState<"sign-in" | "register" | "forgot-password">("sign-in");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleViewChange = (view: "sign-in" | "register" | "forgot-password", e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAnimating && view !== currentView) {
      setIsAnimating(true);
      setNextView(view);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setCurrentView(nextView);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, nextView]);

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-[rgba(55,65,81,0.75)] dark:bg-[rgba(31,41,55,0.75)] bg-opacity-75 relative z-10">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          {/* Sign-in Form */}
          {currentView === "sign-in" && (
            <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
                Connexion à votre compte
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
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
                    <div className="ml-3 text-sm text-gray-900 dark:text-white">
                      <label htmlFor="remember" className="text-sm font-medium text-gray-900 dark:text-white">
                        Se souvenir de moi
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-white hover:underline dark:text-primary-500"
                    onClick={(e) => handleViewChange("forgot-password", e)}
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
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Pas encore de compte ?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    onClick={(e) => handleViewChange("register", e)}
                  >
                    S'inscrire
                  </a>
                </p>
              </form>
            </div>
          )}

          {/* Register Form */}
          {currentView === "register" && (
            <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
                Créer un compte
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
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
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Déjà un compte ?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    onClick={(e) => handleViewChange("sign-in", e)}
                  >
                    Se connecter
                  </a>
                </p>
              </form>
            </div>
          )}

          {/* Forgot Password Form */}
          {currentView === "forgot-password" && (
            <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
                Réinitialiser votre mot de passe
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
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
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Vous vous souvenez de votre mot de passe ?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    onClick={(e) => handleViewChange("sign-in", e)}
                  >
                    Se connecter
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignInSection;