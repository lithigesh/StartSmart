import React from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { HeroSection } from "../components/HeroSection.jsx";
import { MainContentSection } from "../components/MainContentSection.jsx";

const LandingPage = () => {
  return (
    <main className="flex flex-col w-full relative bg-black min-h-screen overflow-x-hidden">
      {/* Header with seamless integration */}
      <Header />
      
      {/* Hero Section with smooth transition */}
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
        <HeroSection />
        
        {/* Smooth transition gradient to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
      </section>

      {/* Main Content with seamless flow */}
      <section className="relative w-full bg-black">
        {/* Top blend area */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none z-10"></div>
        
        <div className="relative z-0 -mt-16 pt-20">
          <MainContentSection />
        </div>
        
        {/* Bottom blend area */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10"></div>
      </section>

      {/* Footer with seamless integration */}
      <section className="relative w-full bg-black">
        <div className="relative -mt-12 pt-16">
          <Footer />
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
