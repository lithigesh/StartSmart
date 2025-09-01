import { ArrowDownIcon, Wand2Icon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button.jsx";
import { HERO_CONTENT } from "../../../data/content.js";

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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-7 relative w-full">
          <Button
            variant="outline"
            className="gap-2 border-[1.4px] border-solid border-white bg-transparent hover:bg-white/10 px-6 md:px-[34px] py-3 md:py-3.5 h-auto rounded-[55px] w-full sm:w-auto overflow-hidden transition-all duration-200"
          >
            <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-base whitespace-nowrap">
              {HERO_CONTENT.primaryCta}
            </span>
            <Wand2Icon className="w-6 h-6 text-white flex-shrink-0" />
          </Button>

          <a href="#features">
            <Button className="bg-white hover:bg-white/90 text-black px-6 md:px-[34px] py-3 md:py-3.5 h-auto rounded-[55px] w-full sm:w-auto transition-all duration-200">
              <span className="relative w-fit mt-[-1.40px] [font-family:'Poppins',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal]">
                {HERO_CONTENT.secondaryCta}
              </span>
              <ArrowDownIcon className="w-6 h-6 text-black ml-2" />
            </Button>
          </a>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>
      
    </div>
  );
};
