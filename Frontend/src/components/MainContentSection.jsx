import {
  FaArrowUp,
  FaLightbulb,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa";
import {
  SiCashapp,
  SiUber,
  SiAirbnb,
  SiStripe,
  SiDoordash,
  SiCoinbase,
  SiRoblox,
  SiVisa,
  SiDiscord,
  SiAsana,
  SiNextdoor,
  SiYcombinator,
  SiSnowflake,
  SiTwilio,
} from "react-icons/si";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTilt } from "../hooks/useTilt";

const SectionTitle = ({ title, description, className = "" }) => (
  <div
    className={`flex flex-col max-w-content items-center gap-4 sm:gap-5 md:gap-7 px-4 sm:px-6 md:px-8 w-full ${className}`}
  >
    <h1 className="self-stretch mt-[-1.00px] font-manrope font-medium text-text-primary text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight sm:leading-tight md:leading-[56px]">
      {title}
    </h1>
    <p className="self-stretch font-poppins font-normal text-text-secondary text-xs sm:text-sm md:text-base text-center tracking-[-0.29px] leading-5 sm:leading-6 md:leading-[28.8px]">
      {description}
    </p>
  </div>
);

// Hook for scroll-triggered animations
const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

const EntrepreneurFlowCard = () => {
  const tiltRef = useTilt({ maxTilt: 8, scale: 1.02 });
  return (
    <div
      ref={tiltRef}
      className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-500 ease-in-out hover:bg-white/[0.05] hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 group focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-opacity-50 will-change-transform relative overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] rounded-2xl pointer-events-none"></div>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse blur-lg"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/8 rounded-full animate-bounce blur-md"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl animate-ping"></div>
      </div>
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rotate-0 group-hover:rotate-180 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-white/5 rounded-full blur-sm"></div>
          <FaLightbulb className="text-xl sm:text-2xl text-text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10" />
        </div>
        <h3 className="font-manrope text-lg sm:text-xl md:text-2xl font-semibold text-text-primary mb-1 sm:mb-2 transition-colors duration-300 ease-in-out group-hover:text-gray-100">
          For Entrepreneurs
        </h3>
        <p className="font-manrope text-sm sm:text-base text-gray-300 transition-colors duration-300 ease-in-out group-hover:text-gray-200">
          Turn your innovative ideas into funded startups
        </p>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Submit Your Startup Idea
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Complete our detailed submission form with business plans, market
              research, and financial projections
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Get AI-Powered Analysis
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Receive comprehensive SWOT analysis, viability scores, market
              insights, and product roadmaps instantly
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            3
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Connect & Request Funding
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Browse investors, submit funding requests, and negotiate terms
              through our messaging platform
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            4
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Download Professional Reports
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Generate PDF reports with complete analysis and insights to share
              with stakeholders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvestorFlowCard = () => {
  const tiltRef = useTilt({ maxTilt: 8, scale: 1.02 });
  return (
    <div
      ref={tiltRef}
      className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-500 ease-in-out hover:bg-white/[0.05] hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 group focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-opacity-50 will-change-transform relative overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.08] via-transparent to-white/[0.03] rounded-2xl pointer-events-none"></div>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/8 rounded-full animate-spin blur-xl"></div>
        <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/12 rounded-full animate-pulse blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-l from-white/6 to-transparent rounded-full blur-xl animate-bounce"></div>
      </div>
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-white/5 rounded-full blur-sm"></div>
          <FaDollarSign className="text-xl sm:text-2xl text-text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10" />
        </div>
        <h3 className="font-manrope text-lg sm:text-xl md:text-2xl font-semibold text-text-primary mb-1 sm:mb-2 transition-colors duration-300 ease-in-out group-hover:text-gray-100">
          For Investors
        </h3>
        <p className="font-manrope text-sm sm:text-base text-gray-300 transition-colors duration-300 ease-in-out group-hover:text-gray-200">
          Discover and invest in promising startups
        </p>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Browse Startup Ideas
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Explore curated startup ideas with complete details, business
              plans, and AI-powered analysis
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Review AI Analysis & Reports
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Access comprehensive SWOT analysis, viability scores, market
              insights, and PDF reports
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            3
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Express Interest & Negotiate
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Show interest in promising ideas and negotiate funding terms
              through secure messaging
            </p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
          tabIndex={0}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg flex-shrink-0">
            4
          </div>
          <div>
            <h4 className="font-manrope text-text-primary font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Participate in Ideathons
            </h4>
            <p className="font-manrope text-gray-400 text-xs sm:text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
              Join startup competitions and discover innovative teams and
              breakthrough ideas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, index, isVisible }) => {
  const tiltRef = useTilt({ maxTilt: 10, scale: 1.03 });
  return (
    <div
      ref={tiltRef}
      className={`group cursor-pointer focus-within:ring-2 focus-within:ring-white focus-within:ring-opacity-50 rounded-lg will-change-transform h-full transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
        transformStyle: "preserve-3d",
      }}
      tabIndex={0}
    >
      <div className="card bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 ease-in-out relative overflow-hidden will-change-transform h-full min-h-[280px] flex flex-col">
        {/* Glassmorphism gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-white/[0.02] to-white/[0.05] opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>

        {/* Enhanced card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Floating particles inside card */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute top-8 left-6 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/35 rounded-full animate-bounce delay-200"></div>
        </div>

        <div className="card-body p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 flex-grow flex flex-col relative z-10">
          {/* Icon Section */}
          <div className="flex items-center justify-start mb-4">
            <div className="w-12 h-12 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm"></div>
              {React.cloneElement(feature.icon, {
                className:
                  "w-6 h-6 text-text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10",
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-3 flex-grow">
            <h3 className="card-title font-manrope font-semibold text-text-primary text-lg md:text-xl tracking-[-0.80px] leading-7 md:leading-8 transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              {feature.title}
            </h3>
            <p className="font-manrope font-medium text-text-muted text-sm md:text-base tracking-[-0.80px] leading-6 md:leading-[28.8px] transition-colors duration-300 ease-in-out group-hover:text-text-muted-hover">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white to-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></div>
      </div>
    </div>
  );
};

const FEATURES_DATA = [
  {
    title: "AI-Powered SWOT Analysis",
    description:
      "Get instant, comprehensive SWOT analysis powered by advanced AI. Identify strengths, weaknesses, opportunities, and threats for your startup idea with detailed insights.",
    icon: <FaChartLine />,
  },
  {
    title: "Market Research & Comparison",
    description:
      "Conduct thorough market research and competitor analysis. Compare your idea with existing solutions and identify unique value propositions in the market.",
    icon: <FaSearch />,
  },
  {
    title: "Ideathon Participation",
    description:
      "Participate in startup competitions and ideathons to showcase your ideas. Win prizes, gain recognition, and accelerate your startup's growth through competitive events.",
    icon: <FaFileAlt />,
  },
  {
    title: "Investor Matching Platform",
    description:
      "Connect with investors through our intelligent matching system. Investors can browse ideas, express interest, and initiate funding negotiations directly.",
    icon: <FaUsers />,
  },
  {
    title: "Comprehensive Idea Submission",
    description:
      "Submit detailed startup ideas with business plans, market research, financial projections, and supporting documents. Track your ideas through every stage.",
    icon: <FaLightbulb />,
  },
  {
    title: "Funding Request & Negotiation",
    description:
      "Request funding with detailed proposals, negotiate terms with investors through our messaging system, and track funding status in real-time.",
    icon: <FaDollarSign />,
  },
];

export const MainContentSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, getRoleDashboardUrl } = useAuth();

  // Refs for scroll animations
  const [flowRef, flowVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [logosRef, logosVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const handleNavigation = (role) => {
    if (isAuthenticated) {
      const dashboardUrl = getRoleDashboardUrl(user);
      navigate(dashboardUrl);
    } else {
      navigate("/register", { state: { role } });
    }
  };
  const startupLogos = [
    // 14 Startup Company Icons as per the list
    { icon: <SiCashapp />, name: "Cash App" }, // Cash App (Square) - Fintech
    { icon: <SiUber />, name: "Uber" }, // Ride-sharing startup
    { icon: <SiAirbnb />, name: "Airbnb" }, // Hospitality startup
    { icon: <SiStripe />, name: "Stripe" }, // Payment processing startup
    { icon: <SiDoordash />, name: "DoorDash" }, // Food delivery startup
    { icon: <SiCoinbase />, name: "Coinbase" }, // Cryptocurrency startup
    { icon: <SiRoblox />, name: "Roblox" }, // Gaming platform startup
    { icon: <SiVisa />, name: "Visa" }, // Digital payment startup
    { icon: <SiDiscord />, name: "Discord" }, // Communication platform
    { icon: <SiAsana />, name: "Asana" }, // Project management startup
    { icon: <SiNextdoor />, name: "Nextdoor" }, // Community platform
    { icon: <SiYcombinator />, name: "Y Combinator" }, // Startup accelerator
    { icon: <SiSnowflake />, name: "Snowflake" }, // Data warehousing startup
    { icon: <SiTwilio />, name: "Twilio" }, // Communications API startup
  ];

  const LogoCard = ({ logo }) => (
    <div
      className="flex flex-col items-center justify-center px-4 py-3 min-w-[120px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg will-change-transform"
      tabIndex={0}
    >
      {React.cloneElement(logo.icon, {
        className:
          "w-8 h-8 md:w-10 md:h-10 text-text-primary transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-200 mb-3",
      })}
      <span className="text-sm font-medium text-text-secondary transition-colors duration-300 ease-in-out hover:text-gray-300 text-center tracking-wide">
        {logo.name}
      </span>
    </div>
  );

  return (
    <section className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 lg:gap-28 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 relative">
      {/* Background continuity elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent pointer-events-none"></div>

      <div className="flex flex-col items-center gap-8 md:gap-12 w-full relative z-10">
        <SectionTitle
          title="How StartSmart Works"
          description="Our platform connects innovative entrepreneurs with forward-thinking investors through AI-powered analysis and comprehensive ideathon management. Experience a seamless journey from idea submission to funding."
        />
      </div>

      {/* User Flow Section with smooth transitions */}
      <div
        ref={flowRef}
        className={`flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-24 w-full max-w-section mx-auto px-4 sm:px-6 relative z-10 transition-all duration-1000 ${
          flowVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        {/* Entrepreneur Flow */}
        <EntrepreneurFlowCard />

        {/* Investor Flow */}
        <InvestorFlowCard />
      </div>

      {/* Features Section with seamless integration */}
      <div
        ref={featuresRef}
        className={`flex flex-col items-center justify-center gap-5 sm:gap-7 w-full max-w-cta mx-auto px-4 sm:px-6 mt-16 sm:mt-24 md:mt-28 lg:mt-32 relative transition-all duration-1000 delay-200 ${
          featuresVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        {/* Smooth transition overlay */}
        <div className="absolute -top-20 left-0 w-full h-40 bg-gradient-to-b from-transparent via-black/30 to-transparent pointer-events-none"></div>

        {/* Features Heading */}
        <div className="flex flex-col items-center gap-8 md:gap-12 w-full mb-12 md:mb-16 relative z-10">
          <h2 className="font-manrope font-medium text-text-primary text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[56px]">
            Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
          {FEATURES_DATA.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={featuresVisible}
            />
          ))}
        </div>
      </div>

      {/* Company Logos Section with seamless flow */}
      <div
        ref={logosRef}
        className={`flex flex-col items-center gap-8 md:gap-12 w-full mt-24 md:mt-28 lg:mt-32 relative transition-all duration-1000 delay-300 ${
          logosVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        {/* Smooth transition overlay */}
        <div className="absolute -top-20 left-0 w-full h-40 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <SectionTitle title="Trusted by Industry Leaders" />
        </div>

        <div className="w-full overflow-hidden relative z-10 group">
          <div className="flex animate-marquee-fast md:animate-marquee-fast animate-marquee-mobile group-hover:pause-marquee">
            <div className="flex gap-8 pr-8">
              {[...startupLogos, ...startupLogos].map((logo, index) => (
                <LogoCard key={`logo-${index}`} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section with seamless integration */}
      <div
        ref={ctaRef}
        className={`relative flex items-center justify-center w-full max-w-cta min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:h-[350px] p-4 sm:p-6 md:p-8 lg:p-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[19px] overflow-hidden mx-4 xl:mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-24 shadow-2xl shadow-black/20 transition-all duration-1000 delay-400 ${
          ctaVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-20 scale-95"
        }`}
      >
        {/* Enhanced glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] rounded-[19px] pointer-events-none"></div>

        {/* Smooth transition overlay */}
        <div className="absolute -top-16 left-0 w-full h-32 bg-gradient-to-b from-transparent via-black/40 to-transparent pointer-events-none"></div>

        <div className="absolute w-[140px] h-[140px] top-0 right-[140px] bg-[#d9d9d9] rounded-[70px] blur-[202px]" />

        {/* CSS Decorative Elements */}
        <div className="absolute w-[60px] h-[60px] top-[-30px] left-[-30px] bg-white/5 rounded-full hidden md:block"></div>
        <div className="absolute w-[40px] h-[40px] bottom-[100px] right-[250px] bg-white/10 rounded-full hidden lg:block"></div>
        <div className="absolute w-[50px] h-[50px] top-[30px] right-[100px] bg-white/5 rounded-full hidden lg:block"></div>
        <div className="absolute w-[35px] h-[35px] top-[40px] left-52 bg-white/10 rounded-full hidden md:block"></div>

        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 z-10 px-4 text-center">
          <h2 className="max-w-[984.72px] font-manrope font-semibold text-text-primary text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[-0.48px] leading-tight sm:leading-tight md:leading-[74px]">
            Ready to Transform Your Future?
          </h2>

          <p className="max-w-[600px] font-manrope font-medium text-text-secondary text-sm sm:text-base md:text-lg text-center leading-5 sm:leading-6 md:leading-7 mb-2 sm:mb-4">
            Join thousands of entrepreneurs and investors who are already
            building the future together
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getRoleDashboardUrl(user))}
                className="btn btn-md sm:btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 px-6 sm:px-8"
              >
                <span className="font-poppins font-medium text-sm sm:text-base">
                  My Dashboard
                </span>
                <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation("entrepreneur")}
                  className="btn btn-md sm:btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 px-6 sm:px-8"
                >
                  <span className="font-poppins font-medium text-sm sm:text-base">
                    Submit Your Idea
                  </span>
                  <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
                </button>

                <button
                  onClick={() => handleNavigation("investor")}
                  className="btn btn-outline btn-md sm:btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 px-6 sm:px-8"
                >
                  <span className="font-poppins font-medium text-sm sm:text-base">
                    Explore as Investor
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
