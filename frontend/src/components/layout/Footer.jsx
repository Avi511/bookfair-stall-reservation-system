import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-accent">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <span className="text-sm font-semibold">Colombo Bookfair</span>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <Link to="/about" className="text-accent hover:text-primary">About</Link>
          <Link to="/contact" className="text-accent hover:text-primary">Contact</Link>
          <Link to="/login" className="text-accent hover:text-primary">Employee</Link>
        </div>

        <div className="text-xs text-accent/80">© {new Date().getFullYear()} Colombo Bookfair. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
