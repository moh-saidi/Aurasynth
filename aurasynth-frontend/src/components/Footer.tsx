import aibrain from "./aibrain.svg";

const Footer = () => {
  return (
    <footer className="p-4 bg-gradient-to-b from-transparent to-white md:p-8 lg:p-10 dark:bg-gradient-to-b dark:from-transparent dark:to-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            src={aibrain}
            className="h-8 mr-2" // Added mr-2 for spacing
            alt="AuraSynth Logo"
          />
          AuraSynth
        </a>
        <p className="my-6 text-gray-500 dark:text-gray-400">
          AI Music Composer To Help You Grow Your Future.
        </p>

        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024-2025{" "}
          <a href="#" className="hover:underline">
            AuraSynth™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;