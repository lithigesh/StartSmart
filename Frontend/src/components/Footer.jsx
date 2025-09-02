import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRocket,
  FaLightbulb,
  FaDollarSign,
  FaUsers,
  FaArrowUp,
} from "react-icons/fa";

const FOOTER_LINKS = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "AI Analysis", href: "#ai-analysis" },
    { name: "Reports", href: "#reports" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Team", href: "#team" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "#blog" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Help Center", href: "#help" },
    { name: "Community", href: "#community" },
    { name: "API Reference", href: "#api" },
    { name: "Startup Guide", href: "#guide" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Data Protection", href: "#data" },
  ],
};

const SOCIAL_LINKS = [
  { icon: <FaTwitter />, href: "#twitter", label: "Twitter" },
  { icon: <FaLinkedin />, href: "#linkedin", label: "LinkedIn" },
  { icon: <FaGithub />, href: "#github", label: "GitHub" },
  { icon: <FaInstagram />, href: "#instagram", label: "Instagram" },
];

const CONTACT_INFO = [
  { icon: <FaEnvelope />, text: "hello@startsmart.com" },
  { icon: <FaPhone />, text: "+1 (555) 123-4567" },
  { icon: <FaMapMarkerAlt />, text: "San Francisco, CA" },
];

const APP_CONFIG = {
  name: "StartSmart",
  tagline: "Smarter Beginning for Smarter Startups",
  description:
    "AI-powered platform connecting entrepreneurs with investors. Transform your startup ideas into funded ventures with intelligent analysis, comprehensive reports, and seamless investor matching.",
  copyright: "© 2025 StartSmart. All rights reserved.",
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-black border-t border-border-primary">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <FaRocket className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white font-manrope">
                  {APP_CONFIG.name}
                </h3>
              </div>
              <p className="text-sm font-medium text-gray-300 font-poppins">
                {APP_CONFIG.tagline}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                {APP_CONFIG.description}
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  >
                    {React.cloneElement(social.icon, {
                      className: "w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300"
                    })}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 ease-in-out hover:translate-x-1 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 ease-in-out hover:translate-x-1 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 ease-in-out hover:translate-x-1 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-3">
                {CONTACT_INFO.map((contact, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {React.cloneElement(contact.icon, {
                        className: "w-4 h-4 text-gray-400"
                      })}
                    </div>
                    <span className="text-sm text-gray-400">{contact.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300 ease-in-out hover:translate-x-1 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-12 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white font-manrope">
                Stay in the loop
              </h3>
              <p className="text-gray-300 text-sm">
                Get the latest updates on new features, startup insights, and investor opportunities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:min-w-[400px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-white/10">
          <div className="text-sm text-gray-400">
            {APP_CONFIG.copyright}
          </div>
          
          {/* Key Features Quick Links */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <FaLightbulb className="w-3 h-3" />
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaUsers className="w-3 h-3" />
                <span>Investor Matching</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaDollarSign className="w-3 h-3" />
                <span>Funding Support</span>
              </div>
            </div>
            
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Scroll to top"
            >
              <FaArrowUp className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};
