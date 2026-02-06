import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-12 pb-8 border-t border-gray-200 bg-background">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 text-primary">

          {/* Column 1: Organizer Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Organized By</h3>
            <p className="text-sm leading-relaxed opacity-80">
              Sri Lanka Book Publishers’ Association. <br />
              Promoting the love for reading across the island.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent">Exhibition Venue Map</a></li>
              <li><a href="#" className="hover:text-accent">Vendor Terms & Conditions</a></li>
              <li><Link to="/login" className="hover:text-accent">Employee Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <p className="text-sm opacity-80">BMICH, Colombo, Sri Lanka</p>
            <p className="text-sm opacity-80">Email: info@bookfair.lk</p>
          </div>
        </div>

        <div className="pt-8 mt-12 text-xs text-center text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} Colombo International Bookfair. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;