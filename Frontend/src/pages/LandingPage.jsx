import React from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { HeroSection } from "../components/HeroSection.jsx";
import { MainContentSection } from "../components/MainContentSection.jsx";
import SEO from "../components/SEO.jsx";

const LandingPage = () => {
  return (
    <main className="flex flex-col w-full relative bg-black min-h-screen overflow-x-hidden">
      <SEO
        title="AI-Powered Startup Evaluation & Funding"
        description="StartSmart helps entrepreneurs validate startup ideas with AI, participate in ideathons, and connect with investors through structured funding workflows."
        pathname="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "StartSmart",
          url: (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_URL) ?? undefined,
        }}
      />
      <Header />
      <HeroSection />
      <MainContentSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
