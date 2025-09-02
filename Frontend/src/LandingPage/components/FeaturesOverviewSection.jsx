import {
  FaApple,
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { SiTesla, SiNetflix, SiSpotify, SiUber } from "react-icons/si";
import React from "react";

const SectionTitle = ({ title, description, className = "" }) => (
  <div
    className={`flex flex-col max-w-content items-center gap-7 px-4 md:px-8 w-full ${className}`}
  >
    <h1 className="self-stretch mt-[-1.00px] font-manrope font-medium text-text-primary text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[56px]">
      {title}
    </h1>
    <p className="self-stretch font-poppins font-normal text-text-secondary text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-[28.8px]">
      {description}
    </p>
  </div>
);

export const FeaturesOverviewSection = () => {
  const logos = [
    <FaApple />,
    <FaGoogle />,
    <FaMicrosoft />,
    <FaAmazon />,
    <FaFacebook />,
    <FaTwitter />,
    <FaLinkedin />,
    <FaGithub />,
    <SiTesla />,
    <SiNetflix />,
    <SiSpotify />,
    <SiUber />,
  ];

  const LogoCard = ({ logo }) => (
    <div
      className="justify-center items-center flex p-6 bg-dark-bg rounded-lg transition-transform duration-300 ease-in-out hover:scale-110 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform"
      tabIndex={0}
    >
      {React.cloneElement(logo, {
        className:
          "w-16 h-16 text-text-primary transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-gray-200",
      })}
    </div>
  );

  return (
    <section className="flex flex-col items-center gap-16 md:gap-[124px] w-full py-16 md:py-24">
      <SectionTitle
        title="Trusted by the world's most innovative companies"
        description="We're proud to partner with these amazing companies."
      />

      <div className="w-full overflow-hidden">
        <div className="flex flex-col gap-7">
          <div className="flex gap-7 animate-marquee [--duration:20s] [--gap:1.75rem]">
            {logos.concat(logos).map((logo, index) => (
              <LogoCard key={`row1-${index}`} logo={logo} />
            ))}
          </div>

          <div className="flex gap-7 animate-marquee [--duration:25s] [--gap:1.75rem] [animation-direction:reverse]">
            {logos.concat(logos).map((logo, index) => (
              <LogoCard key={`row2-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
