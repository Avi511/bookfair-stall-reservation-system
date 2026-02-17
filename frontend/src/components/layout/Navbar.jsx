import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const role = String(user?.role || "").toUpperCase();
  const isEmployee = role === "EMPLOYEE" || role === "ROLE_EMPLOYEE";
  const actionPath = !isAuthenticated
    ? "/login"
    : isEmployee
      ? "/employee/stalls"
      : "/reserve-stalls";
  const actionLabel = !isAuthenticated
    ? "Login"
    : isEmployee
      ? "Edit Stall Map"
      : "Reserve Stall";

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <nav className="relative sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 nav-animated-gradient opacity-90" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-xl bg-gradient-to-tr from-accent to-secondary group-hover:rotate-6">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Colombo<span className="text-accent">Bookfair</span>
              </span>
              <span className="text-[0.65rem] font-medium text-gray-300 uppercase tracking-widest">
                Stall Reservation
              </span>
            </div>
          </Link>

          <div className="items-center hidden space-x-6 md:flex">
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

            <Link
              to={actionPath}
              className="relative inline-flex items-center px-6 py-2.5 overflow-hidden font-semibold text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-secondary to-accent hover:scale-105"
            >
              <span className="relative flex items-center gap-2">
                {actionLabel}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 font-semibold text-white/90 border border-white/30 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="p-2 text-gray-200 transition-colors rounded-md hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
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

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative px-4 pt-2 pb-6 space-y-2 border-t border-white/10 backdrop-blur-xl">
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
            to={actionPath}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-4 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-secondary to-accent active:scale-95"
          >
            {actionLabel} <ChevronRight className="w-4 h-4" />
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 text-base font-semibold text-white border rounded-lg border-white/30 hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
