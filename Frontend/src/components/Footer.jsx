import React, { useState, useEffect } from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaRocket,
  FaArrowUp,
} from "react-icons/fa";
import StartSmartIcon from "/w_startSmart_icon.png";

const SOCIAL_LINKS = [
  { icon: <FaTwitter />, href: "#twitter", label: "Twitter" },
  { icon: <FaLinkedin />, href: "#linkedin", label: "LinkedIn" },
  { icon: <FaGithub />, href: "#github", label: "GitHub" },
  { icon: <FaInstagram />, href: "#instagram", label: "Instagram" },
];

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 200px
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-black text-gray-400 border-t border-white">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div
            className="flex items-center space-x-3 md:space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-1"
            tabIndex={0}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center shadow-lg">
              <img
                src={StartSmartIcon}
                alt="StartSmart Logo"
                className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
              />
            </div>
            <span className="text-text-primary font-semibold text-lg md:text-xl lg:text-2xl font-manrope whitespace-nowrap">
              StartSmart
            </span>
          </div>

          {/* Socials */}
          <div className="flex justify-center space-x-4">
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
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-center md:text-left">© 2025 StartSmart. All rights reserved.</p>

          {/* Desktop scroll to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <FaArrowUp className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Mobile scroll to top button - Fixed position */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="md:hidden fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/10 animate-fade-in"
          >
            <FaArrowUp className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </footer>
  );
};
