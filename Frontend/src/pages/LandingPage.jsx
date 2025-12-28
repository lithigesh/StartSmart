import React from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { HeroSection } from "../components/HeroSection.jsx";
import { MainContentSection } from "../components/MainContentSection.jsx";

const LandingPage = () => {
  return (
    <main className="flex flex-col w-full relative bg-black min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection />
      <MainContentSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
