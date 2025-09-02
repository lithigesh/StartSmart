import { FaArrowUp } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <div className="flex flex-col w-full max-w-[878px] items-center gap-8 md:gap-12 px-4 md:px-8 py-20 md:py-32 pt-24 md:pt-32">
        <div className="flex flex-col items-center gap-7 relative w-full">
          <div className="inline-flex flex-col items-center gap-2 relative">

            <h1 className="relative w-full max-w-[674.68px] font-manrope font-medium text-text-primary text-3xl md:text-5xl lg:text-[64px] text-center tracking-[-0.64px] leading-tight md:leading-[74px] animate-fade-up">
              <span className="inline-block animate-text-reveal">Connect Ideas with Investment</span>
              {/* Floating particles around text */}
              <div className="absolute -top-4 -left-4 w-2 h-2 bg-white/30 rounded-full animate-float delay-100"></div>
              <div className="absolute -top-2 right-8 w-1 h-1 bg-white/40 rounded-full animate-float delay-300"></div>
              <div className="absolute -bottom-3 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-float delay-500"></div>
              <div className="absolute -bottom-1 -right-2 w-1 h-1 bg-white/35 rounded-full animate-float delay-700"></div>
            </h1>
          </div>

          <p className="relative w-full max-w-[735px] font-manrope font-normal text-text-secondary text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-7 animate-fade-up delay-200">
            The comprehensive ecosystem where entrepreneurs submit innovative
            ideas and investors discover the next big opportunity. Powered by AI
            analysis and intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <button className="relative overflow-hidden btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              
              {/* Glitter particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping delay-200"></div>
                <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
              </div>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-[55px] bg-white/10 scale-0 group-hover:scale-100 group-hover:opacity-0 opacity-50 transition-all duration-500 ease-out"></div>
              
              <span className="relative z-10 font-poppins font-medium text-base">
                Submit Your Idea
              </span>
              <FaArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
            </button>

            <button className="relative overflow-hidden btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change-transform">
              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-[55px] border-2 border-white/50 scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
              
              {/* Sliding border animation */}
              <div className="absolute inset-0 rounded-[55px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-0 group-hover:rotate-180 transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100"></div>
              
              {/* Sparkle effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="absolute top-5 right-8 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-150"></div>
                <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
                <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-white rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-200"></div>
              </div>
              
              {/* Gradient sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-800 ease-in-out"></div>
              
              {/* Pulsing background */}
              <div className="absolute inset-0 rounded-[55px] bg-white/5 scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out"></div>
              
              <span className="relative z-10 font-poppins font-medium text-base">
                Explore as Investor
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-float-slow blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/3 rounded-full animate-float-reverse blur-2xl"></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/4 rounded-full animate-pulse-slow blur-lg"></div>
        
        {/* Moving particles */}
        <div className="absolute top-16 left-16 w-1 h-1 bg-white/60 rounded-full animate-particle-1"></div>
        <div className="absolute top-32 right-24 w-0.5 h-0.5 bg-white/40 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-white/50 rounded-full animate-particle-4"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent animate-grid-move"></div>
      </div>
    </div>
  );
};
