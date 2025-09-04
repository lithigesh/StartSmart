import {
  FaArrowUp,
  FaLightbulb,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaBell,
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

const FEATURES_DATA = [
  {
    title: "Investor Dashboard & Matching",
    description:
      "Investors can browse curated startup ideas, view detailed analysis, and express interest.",
    icon: <FaUsers />,
  },
  {
    title: "AI-Powered Report and Analytics",
    description:
      "Generate detailed PDF reports with SWOT analysis, market insights, and recommendations. Track your progress and share professional documentation with stakeholders.",
    icon: <FaChartLine />,
  },
  {
    title: "Interest Status Tracking",
    description:
      "Real-time tracking of investor interests. Monitor which investors have expressed interest.",
    icon: <FaSearch />,
  },
  {
    title: "Smart Idea Validation",
    description:
      "A validation system that scores your startup idea based on market demand, competition analysis, and feasibility. Refine your concept before pitching to investors.",
    icon: <FaFileAlt />,
  },
  {
    title: "Interactive Idea Feed",
    description:
      "Investors browse through a curated feed of startup ideas with filtering. Discover promising opportunities efficiently.",
    icon: <FaLightbulb />,
  },
  {
    title: "Notification System",
    description:
      "Automated notifications keep both entrepreneurs and investors informed about status updates, new matches, interest expressions.",
    icon: <FaBell />,
  },
];

export const MainContentSection = () => {
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
    <section className="flex flex-col items-center gap-16 md:gap-20 lg:gap-28 w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-16 lg:py-20 relative">
      {/* Background continuity elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent pointer-events-none"></div>

      <div className="flex flex-col items-center gap-8 md:gap-12 w-full relative z-10">
        <SectionTitle
          title="How StartSmart Works"
          description="Our platform bridges the gap between innovative entrepreneurs and forward-thinking investors. Experience a seamless journey from idea submission to funding through our intelligent dual-sided ecosystem."
        />
      </div>

      {/* User Flow Section with smooth transitions */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full max-w-section mx-auto px-4 relative z-10">
        {/* Entrepreneur Flow */}
        <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 group focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-opacity-50 will-change-transform relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] rounded-2xl pointer-events-none"></div>
          {/* Enhanced animated background elements */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/8 rounded-full animate-bounce blur-md"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl animate-ping"></div>
          </div>{" "}
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
              {/* Enhanced icon glow effect with glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rotate-0 group-hover:rotate-180 transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-sm"></div>
              <FaLightbulb className="text-2xl text-text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10" />
            </div>
            <h3 className="font-manrope text-2xl font-semibold text-text-primary mb-2 transition-colors duration-300 ease-in-out group-hover:text-gray-100">
              For Entrepreneurs
            </h3>
            <p className="font-manrope text-gray-300 transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Turn your innovative ideas into funded startups
            </p>
          </div>
          <div className="space-y-4">
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                1
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Submit Your Idea
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Complete our comprehensive idea form with attachments
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                2
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Get AI Analysis
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Receive SWOT analysis, viability scores, and insights
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                3
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Connect with Investors
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Get notified when investors express interest in your idea
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                4
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Download Reports
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Get comprehensive PDF reports for stakeholders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Flow */}
        <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 group focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-opacity-50 will-change-transform relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.08] via-transparent to-white/[0.03] rounded-2xl pointer-events-none"></div>
          {/* Enhanced animated background elements */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/8 rounded-full animate-spin blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/12 rounded-full animate-pulse blur-lg"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-l from-white/6 to-transparent rounded-full blur-xl animate-bounce"></div>
          </div>{" "}
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
              {/* Enhanced icon shimmer effect with glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-sm"></div>
              <FaDollarSign className="text-2xl text-text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10" />
            </div>
            <h3 className="font-manrope text-2xl font-semibold text-text-primary mb-2 transition-colors duration-300 ease-in-out group-hover:text-gray-100">
              For Investors
            </h3>
            <p className="font-manrope text-gray-300 transition-colors duration-300 ease-in-out group-hover:text-gray-200">
              Discover and invest in promising startups
            </p>
          </div>
          <div className="space-y-4">
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                1
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Browse Idea Feed
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Explore curated startup ideas with AI analysis
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                2
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  View Detailed Analysis
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Access comprehensive reports and insights
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                3
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Express Interest
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Mark promising ideas and notify entrepreneurs
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300 ease-in-out focus-within:bg-white/10"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg">
                4
              </div>
              <div>
                <h4 className="font-manrope text-text-primary font-medium transition-colors duration-300 ease-in-out group-hover:text-gray-200">
                  Track Investments
                </h4>
                <p className="font-manrope text-gray-400 text-sm transition-colors duration-300 ease-in-out group-hover:text-gray-300">
                  Monitor your investment pipeline and opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with seamless integration */}
      <div className="flex flex-col items-center justify-center gap-7 w-full max-w-cta mx-auto px-4 mt-24 md:mt-28 lg:mt-32 relative">
        {/* Smooth transition overlay */}
        <div className="absolute -top-20 left-0 w-full h-40 bg-gradient-to-b from-transparent via-black/30 to-transparent pointer-events-none"></div>

        {/* Features Heading */}
        <div className="flex flex-col items-center gap-8 md:gap-12 w-full mb-12 md:mb-16 relative z-10">
          <h2 className="font-manrope font-medium text-text-primary text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[56px]">
            Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {FEATURES_DATA.map((feature, index) => (
            <div
              key={index}
              className="group cursor-pointer focus-within:ring-2 focus-within:ring-white focus-within:ring-opacity-50 rounded-lg will-change-transform h-full"
              style={{ animationDelay: `${index * 100}ms` }}
              tabIndex={0}
            >
              <div className="card bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 ease-in-out hover:scale-105 hover:-translate-y-2 hover:bg-white/[0.06] relative overflow-hidden will-change-transform h-full min-h-[280px] flex flex-col">
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

                <div className="card-body p-6 md:p-8 space-y-4 flex-grow flex flex-col relative z-10">
                  {/* Icon Section */}
                  <div className="flex items-center justify-start mb-4">
                    <div className="w-12 h-12 bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20 relative overflow-hidden">
                      {/* Icon background animation with glassmorphism */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 transform rotate-45 scale-0 group-hover:scale-150 group-hover:rotate-180 transition-all duration-700 ease-out"></div>
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
          ))}
        </div>
      </div>

      {/* Company Logos Section with seamless flow */}
      <div className="flex flex-col items-center gap-8 md:gap-12 w-full mt-24 md:mt-28 lg:mt-32 relative">
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
      <div className="relative flex items-center justify-center w-full max-w-cta min-h-[250px] md:min-h-[300px] lg:h-[350px] p-4 md:p-6 lg:p-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[19px] overflow-hidden mx-4 xl:mx-auto mt-16 md:mt-20 lg:mt-24 shadow-2xl shadow-black/20">
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

        <div className="flex flex-col items-center gap-6 md:gap-8 z-10 px-4 text-center">
          <h2 className="max-w-[984.72px] font-manrope font-semibold text-text-primary text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[74px]">
            Ready to Transform Your Future?
          </h2>

          <p className="max-w-[600px] font-manrope font-medium text-text-secondary text-base md:text-lg text-center leading-6 md:leading-7 mb-4">
            Join thousands of entrepreneurs and investors who are already
            building the future together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              <span className="font-poppins font-medium text-base">
                Submit Your Idea
              </span>
              <FaArrowUp className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110" />
            </button>

            <button className="btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              <span className="font-poppins font-medium text-base">
                Explore as Investor
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
