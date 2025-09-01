import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { SectionTitle } from "../../../../components/common/SectionTitle.jsx";

export const FeaturesOverviewSection = () => {
  const promptCards = Array(8).fill({
    text: "Write a attractive hero title for the following website ",
    url: "https://zeltalabs.com/",
  });

  const PromptCard = ({ text, url }) => (
    <div className="justify-center gap-2.5 px-4 md:px-[26px] py-6 md:py-[27px] bg-[#0d0d0d] rounded overflow-hidden inline-flex flex-col items-center flex-[0_0_auto] min-w-[280px] md:min-w-[320px]">
      <div className="inline-flex items-start justify-end gap-2.5 flex-[0_0_auto]">
        <div className="w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-base md:text-xl tracking-[0] leading-[normal]">
          <span className="text-white">{text}</span>
          <span className="text-[#1d72f2]">{url}</span>
        </div>
        <ArrowRightIcon className="w-6 h-6 md:w-[31px] md:h-[31px] text-white flex-shrink-0" />
      </div>
    </div>
  );

  return (
    <section className="flex flex-col items-center gap-16 md:gap-[124px] w-full py-16 md:py-24">
        <SectionTitle
            title="Create more with StartSmart"
            description="Discover endless creativity with StartSmart. Generate diverse content effortlessly using prompts. Stay updated with real-time trends, automate tasks, and extract insights from any document or URL. All within a sleek, futuristic design. Create more, effortlessly."
        />

      <div className="w-full overflow-hidden">
        <div className="flex flex-col gap-7">
          <div
            className="flex gap-[30px] animate-marquee"
            style={{ "--duration": "20s", "--gap": "30px" }}
          >
            {promptCards.concat(promptCards).map((card, index) => (
              <PromptCard
                key={`row1-${index}`}
                text={card.text}
                url={card.url}
              />
            ))}
          </div>

          <div
            className="flex gap-[30px] animate-marquee"
            style={{
              "--duration": "25s",
              "--gap": "30px",
              animationDirection: "reverse",
            }}
          >
            {promptCards.concat(promptCards).map((card, index) => (
              <PromptCard
                key={`row2-${index}`}
                text={card.text}
                url={card.url}
              />
            ))}
          </div>

          <div
            className="flex gap-[30px] animate-marquee"
            style={{ "--duration": "22s", "--gap": "30px" }}
          >
            {promptCards.concat(promptCards).map((card, index) => (
              <PromptCard
                key={`row3-${index}`}
                text={card.text}
                url={card.url}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
