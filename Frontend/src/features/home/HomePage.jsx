import React from "react";
import { Header } from "../../components/layout/Header.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { HeroSection } from "../home/components/HeroSection.jsx";
import { FeaturesOverviewSection } from "./components/Design/FeaturesOverviewSection.jsx";
import { MainContentSection } from "../home/components/MainContentSection.jsx";

export const HomePage = () => {
  return (
    <main className="flex flex-col w-full relative bg-black min-h-screen overflow-x-hidden">
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
        <Header />
        <HeroSection />
      </section>

      <div className="pt-8 md:pt-20 lg:pt-24">
        <FeaturesOverviewSection />
      </div>

      <div className="pt-8 md:pt-20 lg:pt-24">
        <MainContentSection />
      </div>

      <div className="pt-8 md:pt-20 lg:pt-24">
        <Footer />
      </div>
    </main>
  );
};
