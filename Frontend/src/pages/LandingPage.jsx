import React from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { HeroSection } from "../components/HeroSection.jsx";
import { MainContentSection } from "../components/MainContentSection.jsx";

const LandingPage = () => {
  return (
    <main className="flex flex-col w-full relative bg-black min-h-screen overflow-x-hidden">
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
        <Header />
        <HeroSection />
      </section>

      <div className="pt-4 md:pt-8 lg:pt-12">
        <MainContentSection />
      </div>

      <div className="pt-4 md:pt-8 lg:pt-12">
        <Footer />
      </div>
    </main>
  );
}

export default LandingPage;
