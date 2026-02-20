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
                  <Link
                    to="/stall-map"
                    className="transition-colors hover:text-accent"
                  >
                    Exhibition Venue Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendor-terms"
                    className="transition-colors hover:text-accent"
                  >
                    Vendor Terms & Conditions
                  </Link>
                </li>
                <li>
                  {/* <Link
                    to="/login"
                    className="transition-colors hover:text-accent"
                  >
                    Employee Portal
                  </Link> */}
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
              <p className="text-sm text-white/80">BMICH, Colombo, Sri Lanka</p>
              <p className="text-sm text-white/80">Email: info@expohub.lk</p>
            </div>
          </div>

          <div className="pt-8 mt-12 text-xs text-center border-t text-white/60 border-white/10">
            © {new Date().getFullYear()} ExpoHub. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
