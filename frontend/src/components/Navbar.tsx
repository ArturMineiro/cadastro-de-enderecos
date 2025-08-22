import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-md transition-colors duration-200 ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg py-4 px-8 flex justify-center gap-4 border-b border-gray-200 dark:border-gray-700">
      <Link to="/" className={linkClasses("/")}>
        Home
      </Link>
      <Link to="/enderecos" className={linkClasses("/enderecos")}>
        Endereços
      </Link>
    </nav>
  );
};

export default Navbar;
