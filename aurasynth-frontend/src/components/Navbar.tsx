import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import aibrain from "./aibrain.svg";

interface NavbarProps {
  toggleSignIn?: () => void; // Make toggleSignIn optional since it's no longer needed
}

const Navbar: React.FC<NavbarProps> = ({ toggleSignIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", href: "/" },
    { name: "Create", href: "/create" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={aibrain} className="h-8" alt="AuraSynth Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            AuraSynth
          </span>
        </Link>
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-gray-400 dark:focus:ring-gray-500"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="w-5 h-5" />
          </button>
          <div
            className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`block py-2 px-3 rounded-sm md:p-0 transition duration-300 ease-in-out transform hover:scale-105 ${
                      location.pathname === link.href
                        ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500"
                        : "text-gray-900 md:hover:text-blue-600 dark:text-white md:dark:hover:text-blue-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex space-x-4 ml-auto">
          <Link
            to="/connect"
            className="px-4 py-2 text-blue-700 border border-blue-700 rounded-lg transition duration-300 hover:bg-blue-700 hover:text-white"
          >
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;