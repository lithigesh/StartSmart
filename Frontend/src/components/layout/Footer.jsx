import React from "react";
import {
  FOOTER_NAVIGATION,
  CONTACT_INFO,
  LEGAL_LINKS,
} from "../../constants/navigation.js";
import { APP_CONFIG } from "../../constants/app.js";

export const Footer = () => {
  return (
    <footer className="flex flex-col w-full px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16 relative bg-black border-t border-[#ffffff33] max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-16 w-full">
        {/* Left Column - Navigation */}
        <div className="flex flex-col w-full lg:w-[528px] min-h-[400px] lg:min-h-[582px] items-start lg:items-end justify-between relative">
          <div className="flex items-start gap-6 self-stretch w-full flex-[0_0_auto] flex-col relative">
            <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[18px]">
              {FOOTER_NAVIGATION.title}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-24 relative flex-[0_0_auto]">
              <div className="inline-flex flex-col items-start gap-1.5 relative flex-[0_0_auto]">
                {FOOTER_NAVIGATION.columns[0].map((link, index) => (
                  <div
                    key={index}
                    className={`relative w-fit ${
                      index === 0 ? "mt-[-1.00px]" : ""
                    } [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-sm tracking-[0] leading-[19.6px] hover:text-white/80 transition-colors cursor-pointer`}
                  >
                    {link}
                  </div>
                ))}
              </div>

              <div className="inline-flex flex-col items-start gap-1.5 relative flex-[0_0_auto]">
                {FOOTER_NAVIGATION.columns[1].map((link, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0 ? "mt-[-1.00px]" : ""
                    } leading-[19.6px] relative w-fit [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-sm tracking-[0] hover:text-white/80 transition-colors cursor-pointer`}
                  >
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] mt-8 lg:mt-0">
            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              {LEGAL_LINKS.map((link, index) => (
                <div
                  key={index}
                  className={`${
                    index === 0
                      ? "leading-[15.6px] relative w-fit mt-[-1.00px]"
                      : "relative w-fit"
                  } opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[15.6px]`}
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Social */}
        <div className="flex flex-col items-start gap-12 md:gap-16 lg:gap-48 relative flex-[0_0_auto] w-full lg:w-auto">
          <div className="flex flex-col items-start gap-8 md:gap-16 relative flex-[0_0_auto] w-full">
            {/* Contact Section */}
            <div className="flex w-full lg:w-[752px] items-start justify-start gap-8 lg:gap-[180px] relative flex-[0_0_auto]">
              <div className="flex min-h-[87px] items-start justify-between flex-1 grow flex-col relative">
                <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[18px]">
                  Contact us
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-24 relative flex-[0_0_auto] mt-4">
                  <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
                    {CONTACT_INFO.phones.map((phone, index) => (
                      <div
                        key={index}
                        className={`${
                          index === 0 ? "mt-[-1.00px]" : ""
                        } relative w-fit opacity-80 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-sm tracking-[0] leading-[19.6px] hover:opacity-100 transition-opacity cursor-pointer`}
                      >
                        {phone}
                      </div>
                    ))}
                  </div>

                  <div className="relative w-fit mt-[-1.00px] opacity-80 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-sm tracking-[0] leading-[19.6px] hover:opacity-100 transition-opacity cursor-pointer">
                    {CONTACT_INFO.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Chat Section */}
            <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16 lg:gap-24 relative flex-[0_0_auto]">
              <div className="inline-flex items-start gap-6 flex-[0_0_auto] flex-col relative">
                <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[18px]">
                  Follow us
                </div>

                <div className="flex gap-4">
                  {/* Social Media Icons */}
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-start gap-6 flex-[0_0_auto] flex-col relative">
                <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[18px]">
                  Let&apos;s chat
                </div>

                <div className="flex gap-4">
                  {/* Chat Icons */}
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="inline-flex items-start gap-6 flex-[0_0_auto] flex-col relative w-full sm:w-auto">
              <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Inter',Helvetica] font-normal text-shades-0 text-xs tracking-[0] leading-[18px]">
                Location
              </div>

              <div className="relative w-fit opacity-80 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-sm tracking-[0] leading-[19.6px] max-w-[280px] sm:max-w-none">
                {CONTACT_INFO.address}
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright & Languages */}
          <div className="flex w-full lg:w-[752px] items-center justify-between relative flex-[0_0_auto] flex-col sm:flex-row gap-4 sm:gap-0 pt-8 border-t border-[#ffffff1a]">
            <div className="leading-[18px] relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-normal text-shades-0 text-xs tracking-[0]">
              {APP_CONFIG.copyright}
            </div>

            <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-medium text-shades-0 text-xs tracking-[0] leading-[18px] hover:opacity-60 transition-opacity cursor-pointer">
                En
              </div>

              <div className="relative w-fit mt-[-1.00px] opacity-40 [font-family:'Poppins',Helvetica] font-medium text-shades-0 text-xs tracking-[0] leading-[18px] hover:opacity-60 transition-opacity cursor-pointer">
                Es
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
