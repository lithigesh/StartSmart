import React from "react";

const HERO_CONTENT = {
  title: "Connect Ideas with Investment",
  subtitle: "StartSmart Platform",
  description:
    "The comprehensive ecosystem where entrepreneurs submit innovative ideas and investors discover the next big opportunity. Powered by AI analysis and intelligent matching.",
  primaryCta: "Submit Your Idea",
  secondaryCta: "Explore as Investor",
};

export const HeroSection = () => {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <div className="flex flex-col w-full max-w-[878px] items-center gap-8 md:gap-12 px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center gap-7 relative w-full">
          <div className="inline-flex flex-col items-center gap-2 relative">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-semibold text-white text-lg md:text-[22px] tracking-[-0.40px] leading-[normal]">
              {HERO_CONTENT.subtitle}
            </div>

            <h1 className="relative w-full max-w-[674.68px] [font-family:'Manrope',Helvetica] font-medium text-white text-3xl md:text-5xl lg:text-[64px] text-center tracking-[-0.64px] leading-tight md:leading-[74px]">
              {HERO_CONTENT.title}
            </h1>
          </div>

          <p className="relative w-full max-w-[735px] [font-family:'Manrope',Helvetica] font-normal text-[#ffffff99] text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-7">
            {HERO_CONTENT.description}
          </p>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
};
