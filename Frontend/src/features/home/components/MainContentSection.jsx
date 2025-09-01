import { ArrowUpIcon, Wand2Icon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { SectionTitle } from "../../../components/common/SectionTitle.jsx";
import { FEATURES_DATA } from "../../../data/content.js";

export const MainContentSection = () => {
  return (
    <section className="flex flex-col items-center gap-16 md:gap-24 lg:gap-32 xl:gap-[244px] w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-16 md:py-20 lg:py-24">
      <div className="flex flex-col items-center gap-16 md:gap-[124px] w-full">
        <SectionTitle
          title="How StartSmart Works"
          description="Our platform is designed to be simple and intuitive. Here's a quick overview of how you can get started and make the most of our features."
        />

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1309px] h-[300px] md:h-[400px] bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-white/60 text-sm">Watch the Demo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-16 md:gap-[124px] w-full">
        <SectionTitle
          title="The Complete Startup Ecosystem"
          description="From idea to investment, StartSmart provides everything you need to build and grow your startup. Explore our key modules and see how they can help you succeed."
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-7 w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] max-w-[1309px] mx-auto px-4">
        <div className="w-full border-t border-white/20 pt-8 md:pt-12 lg:pt-[61px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 w-full">
            {FEATURES_DATA.slice(3).map((feature, index) => (
              <Card key={index} className="bg-transparent border-none">
                <CardContent className="p-0 space-y-3 md:space-y-[15px]">
                  <h3 className="[font-family:'Manrope',Helvetica] font-semibold text-white text-lg md:text-xl tracking-[-0.80px] leading-7 md:leading-8">
                    {feature.title}
                  </h3>
                  <p className="[font-family:'Manrope',Helvetica] font-medium text-[#828282] text-sm md:text-base tracking-[-0.80px] leading-6 md:leading-[28.8px]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[1308px] min-h-[300px] md:min-h-[400px] lg:h-[474px] p-4 md:p-6 lg:p-2.5 bg-[#0d0d0d] rounded-[19px] overflow-hidden mx-4 xl:mx-auto">
        <div className="absolute w-[140px] h-[140px] top-0 right-[140px] bg-[#d9d9d9] rounded-[70px] blur-[202px]" />

        {/* CSS Decorative Elements */}
        <div className="absolute w-[60px] h-[60px] top-[-30px] left-[-30px] bg-white/5 rounded-full hidden md:block"></div>
        <div className="absolute w-[40px] h-[40px] bottom-[100px] right-[250px] bg-white/10 rounded-full hidden lg:block"></div>
        <div className="absolute w-[50px] h-[50px] top-[30px] right-[100px] bg-white/5 rounded-full hidden lg:block"></div>
        <div className="absolute w-[35px] h-[35px] top-[40px] left-52 bg-white/10 rounded-full hidden md:block"></div>

        <div className="flex flex-col items-center gap-8 md:gap-[58px] z-10 px-4 text-center">
          <h2 className="max-w-[984.72px] [font-family:'Manrope',Helvetica] font-semibold text-white text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[74px]">
            Ready to Get Started?
          </h2>

          <Button className="h-auto bg-white text-black hover:bg-gray-100 px-6 md:px-[34px] py-3 md:py-3.5 rounded-[55px] gap-2 w-full sm:w-auto max-w-xs transition-all duration-200">
            <span className="[font-family:'Poppins',Helvetica] font-medium text-base">
              Create an Account
            </span>
            <ArrowUpIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};
