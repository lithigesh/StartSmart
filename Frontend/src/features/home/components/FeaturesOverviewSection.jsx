import React from "react";
import { SectionTitle } from "../../../components/common/SectionTitle.jsx";
import { FEATURES_DATA } from "../../../data/content.js";
import { Card, CardContent } from "../../../components/ui/card.jsx";

export const FeaturesOverviewSection = () => {
  return (
    <section id="features" className="flex flex-col items-center gap-12 md:gap-16 lg:gap-[124px] w-full py-16 md:py-20 lg:py-24 px-4 md:px-8">
      <SectionTitle
        title="Core Features of StartSmart"
        description="Discover how StartSmart can help you turn your idea into a reality. Our platform provides the tools and resources you need to succeed."
      />

      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.slice(0, 3).map((feature, index) => (
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
    </section>
  );
};
