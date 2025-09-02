import React from "react";

const LEGAL_LINKS = ["Copyright", "Privacy Policy", "Terms of Service"];

const APP_CONFIG = {
  name: "StartSmart",
  tagline: "Smarter Beginning for Smarter Startups",
  description:
    "StartSmart is a full-stack AI-powered platform designed to help entrepreneurs evaluate, refine, and fund their startup ideas, while also providing investors and mentors with a structured way to discover, assess, and support potential ventures.",
  copyright: "© 2025 — StartSmart",
};

export const Footer = () => {
  return (
    <footer className="flex flex-col w-full px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16 relative bg-black border-t border-border-primary max-w-screen-2xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        {/* Legal Links */}
        <div className="flex flex-col items-start relative w-full flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
            {LEGAL_LINKS.map((link, index) => (
              <div
                key={index}
                className={`${
                  index === 0
                    ? "leading-[15.6px] relative w-fit mt-[-1.00px]"
                    : "relative w-fit"
                } opacity-40 hover:opacity-80 cursor-pointer transition-all duration-300 ease-in-out hover:translate-x-1 font-poppins font-normal text-shades-0 text-xs tracking-[0] leading-[15.6px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded`}
                tabIndex={0}
                role="button"
              >
                {link}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex w-full items-center justify-center relative flex-[0_0_auto] pt-8 border-t border-border-primary/50">
          <div className="leading-[18px] relative w-fit mt-[-1.00px] opacity-40 font-poppins font-normal text-shades-0 text-xs tracking-[0]">
            {APP_CONFIG.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};
