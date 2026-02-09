import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-accent">
      <div className="pt-12 pb-8 text-white border-t border-white/10 bg-primary">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Column 1: Organizer Info */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Organized By</h3>
              <p className="text-sm leading-relaxed text-white/80">
                Sri Lanka Book Publishers’ Association. <br />
                Promoting the love for reading across the island.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="transition-colors hover:text-accent">
                    Exhibition Venue Map
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-accent">
                    Vendor Terms & Conditions
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-accent"
                  >
                    Employee Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
              <p className="text-sm text-white/80">BMICH, Colombo, Sri Lanka</p>
              <p className="text-sm text-white/80">
                Email: info@bookfair.lk
              </p>
            </div>
          </div>

          <div className="pt-8 mt-12 text-xs text-center border-t text-white/60 border-white/10">
            © {new Date().getFullYear()} Colombo International Bookfair. All
            Rights Reserved.
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="text-sm font-semibold">Colombo Bookfair</span>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <Link to="/about" className="text-accent hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-accent hover:text-primary">
            Contact
          </Link>
          <Link to="/login" className="text-accent hover:text-primary">
            Employee
          </Link>
        </div>

        <div className="text-xs text-accent/80">
          © {new Date().getFullYear()} Colombo Bookfair. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
