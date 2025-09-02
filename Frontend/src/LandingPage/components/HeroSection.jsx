import { FaArrowUp } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <div className="flex flex-col w-full max-w-[878px] items-center gap-8 md:gap-12 px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center gap-7 relative w-full">
          <div className="inline-flex flex-col items-center gap-2 relative">

            <h1 className="relative w-full max-w-[674.68px] font-manrope font-medium text-text-primary text-3xl md:text-5xl lg:text-[64px] text-center tracking-[-0.64px] leading-tight md:leading-[74px]">
              Connect Ideas with Investment
            </h1>
          </div>

          <p className="relative w-full max-w-[735px] font-manrope font-normal text-text-secondary text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-7">
            The comprehensive ecosystem where entrepreneurs submit innovative
            ideas and investors discover the next big opportunity. Powered by AI
            analysis and intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <button className="btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform">
              <span className="font-poppins font-medium text-base">
                Submit Your Idea
              </span>
              <FaArrowUp className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
            </button>

            <button className="btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform">
              <span className="font-poppins font-medium text-base">
                Explore as Investor
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
};
