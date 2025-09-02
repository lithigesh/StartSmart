import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaRocket,
  FaArrowUp,
} from "react-icons/fa";

const SOCIAL_LINKS = [
  { icon: <FaTwitter />, href: "#twitter", label: "Twitter" },
  { icon: <FaLinkedin />, href: "#linkedin", label: "LinkedIn" },
  { icon: <FaGithub />, href: "#github", label: "GitHub" },
  { icon: <FaInstagram />, href: "#instagram", label: "Instagram" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-black text-gray-400 border-t border-white">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <FaRocket className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white">StartSmart</h3>
          </div>

          {/* Socials */}
          <div className="flex space-x-4">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={i}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {React.cloneElement(social.icon, {
                  className: "w-4 h-4 text-gray-300 hover:text-white",
                })}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm">© 2025 StartSmart. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <FaArrowUp className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};
