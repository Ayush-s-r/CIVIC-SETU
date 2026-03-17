import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-landmark text-yellow-400 text-2xl"></i>
              <div>
                <h3 className="text-xl font-bold text-white">CivicSetu</h3>
                <span className="text-sm text-gray-400">Government Portal</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Official digital platform for civic issue resolution and public
              service delivery.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-400"></i>
                <span>Secure Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-blue-400"></i>
                <span>Government Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-400 transition">
                  About Platform
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-400 transition">
                  Contact Authorities
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Service Status
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Road Issues
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Street Lights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Water Supply
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Sanitation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  GDPR Compliance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Security Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; 2025 CivicSetu - Government of India. All rights reserved.</p>
          <div className="flex justify-center items-center gap-2 mt-2 text-sm">
            <span>Official Portal of the Government</span>
            <span>|</span>
            <span>Digital India Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
