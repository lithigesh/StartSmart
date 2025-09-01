import React from "react";

export const SectionTitle = ({ title, description, className = "" }) => (
  <div
    className={`flex flex-col max-w-[833px] items-center gap-7 px-4 md:px-8 w-full ${className}`}
  >
    <h1 className="self-stretch mt-[-1.00px] [font-family:'Manrope',Helvetica] font-medium text-white text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[56px]">
      {title}
    </h1>
    <p className="self-stretch [font-family:'Poppins',Helvetica] font-normal text-[#ffffff99] text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-[28.8px]">
      {description}
    </p>
  </div>
);
