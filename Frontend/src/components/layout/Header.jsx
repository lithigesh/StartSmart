import React from "react";
import { ArrowUpIcon, PhoneIcon, MailIcon, FacebookIcon, TwitterIcon, InstagramIcon } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { APP_CONFIG } from "../../constants/app.js";

export const Header = () => {
  return (
    <nav className="relative z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg lg:text-xl [font-family:'Manrope',Helvetica] whitespace-nowrap">
              {APP_CONFIG.name}
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-white text-sm">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="w-4 h-4" />
                <span>support@startsmart.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
                <FacebookIcon className="w-5 h-5 text-white cursor-pointer" />
                <TwitterIcon className="w-5 h-5 text-white cursor-pointer" />
                <InstagramIcon className="w-5 h-5 text-white cursor-pointer" />
            </div>
            <Button className="bg-white hover:bg-white/90 text-black px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl">
              <span className="[font-family:'Poppins',Helvetica]">
                Sign Up
              </span>
              <ArrowUpIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="lg:hidden flex items-center">
            <Button className="bg-white hover:bg-white/90 text-black px-4 py-2 rounded-full font-medium text-sm transition-all duration-200">
              <span className="[font-family:'Poppins',Helvetica]">
                Sign Up
              </span>
              <ArrowUpIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
