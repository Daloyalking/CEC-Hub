import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-500/50 text-gray-800 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold text-purple-900 mb-3">
            Computer Engineering Department
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Moshood Abiola Polytechnic — Inspiring Innovation, Excellence,
            and Professionalism in the field of Computer Engineering.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-purple-900 mb-3">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-purple-700 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-purple-700 transition">
                About
              </a>
            </li>
            <li>
              <a href="/past_projects" className="hover:text-purple-700 transition">
                Past Projects
              </a>
            </li>
            <li>
              <a href="/gallery" className="hover:text-purple-700 transition">
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/material/lecture_material"
                className="hover:text-purple-700 transition"
              >
                Lecture Materials
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-lg font-semibold text-purple-900 mb-3">
            Connect With Us
          </h2>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-purple-700 transition text-xl"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-purple-700 transition text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-purple-700 transition text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-purple-700 transition text-xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-300 mt-8 pt-4 text-center text-sm text-gray-700">
        <p>
          © {new Date().getFullYear()} Computer Engineering Dept, MAPOLY. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
