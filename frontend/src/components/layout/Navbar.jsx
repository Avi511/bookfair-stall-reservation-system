import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-white/10 backdrop-blur-xl relative">
      <div className="absolute inset-0 -z-10 nav-animated-gradient opacity-90" />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-xl bg-gradient-to-tr from-accent to-secondary group-hover:rotate-6">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Colombo<span className="text-accent">Bookfair</span>
              </span>
              <span className="text-[0.65rem] font-medium text-gray-300 uppercase tracking-widest">
                Stall Reservation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${
                  isActive(link.path)
                    ? "text-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
                    isActive(link.path)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            {/* Action Button */}
            <Link
              to="/login"
              className="relative inline-flex items-center px-6 py-2.5 overflow-hidden font-semibold text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-secondary to-accent hover:shadow-[0_0_20px_rgba(0,183,181,0.5)] hover:scale-105"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative flex items-center gap-2">
                Reserve Stall{" "}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-200 transition-colors rounded-md hover:text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 border-t border-white/10 backdrop-blur-xl relative">
          <div className="absolute inset-0 -z-10 nav-animated-gradient opacity-95" />
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                isActive(link.path)
                  ? "bg-accent/20 text-accent"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-4 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-secondary to-accent active:scale-95"
          >
            Reserve Stall <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
