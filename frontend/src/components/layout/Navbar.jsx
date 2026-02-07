import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full shadow-sm navbar">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center font-bold rounded-lg w-9 h-9 bg-primary text-accent">
              CB
            </div>
            <span className="text-sm font-bold text-accent">
              Colombo Bookfair
            </span>
          </Link>

          <div className="items-center hidden space-x-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="transition text-accent hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="px-4 py-2 ml-4 font-semibold rounded-lg bg-primary text-accent"
            >
              Reserve Stall
            </Link>
          </div>

          {/* simple mobile button */}
          <div className="md:hidden">
            <Link
              to="/login"
              className="px-3 py-2 font-semibold rounded-md bg-primary text-accent"
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
