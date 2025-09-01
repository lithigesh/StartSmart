import {
  FaArrowUp,
  FaApple,
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaLightbulb,
  FaDollarSign,
  FaPaypal,
  FaDropbox,
  FaSlack,
  FaReddit,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import {
  SiTesla,
  SiNetflix,
  SiSpotify,
  SiUber,
  SiAirbnb,
  SiStripe,
  SiZoom,
  SiDiscord,
  SiTiktok,
  SiSnapchat,
  SiPinterest,
  SiShopify,
  SiSquare,
  SiAdobe,
  SiSalesforce,
  SiZendesk,
  SiHubspot,
  SiTrello,
  SiNotion,
  SiFigma,
} from "react-icons/si";
import React from "react";

const SectionTitle = ({ title, description, className = "" }) => (
  <div
    className={`flex flex-col max-w-[833px] items-center gap-7 px-4 md:px-8 w-full ${className}`}
  >
    <h1 className="self-stretch mt-[-1.00px] [font-family:'Manrope',Helvetica] font-medium text-white text-2xl md:text-4xl lg:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[56px]">
      {title}
    </h1>
    <p className="self-stretch [font-family:'Poppins',Helvetica] font-normal text-[#ffffff99] text-sm md:text-base text-center tracking-[-0.29px] leading-6 md:leading-[28.8px]">
      {description}
    </p>
  </div>
);

const FEATURES_DATA = [
  {
    title: "Investor Dashboard & Matching",
    description:
      "Investors can browse curated startup ideas, view detailed analysis, and express interest. Our intelligent matching system connects the right investors with promising entrepreneurs.",
  },
  {
    title: "AI-Powered Report and Analytics",
    description:
      "Generate detailed PDF reports with SWOT analysis, market insights, and recommendations. Track your progress and share professional documentation with stakeholders.",
  },
  {
    title: "Interest Status Tracking",
    description:
      "Real-time tracking of investor interest levels and funding status. Monitor which investors have viewed your idea, expressed interest, or are actively considering investment.",
  },
  {
    title: "Document & Attachment Management",
    description:
      "Secure upload and management of business plans, financial projections, and supporting documents. Investors can access comprehensive materials for thorough evaluation.",
  },
  {
    title: "Interactive Idea Feed",
    description:
      "Investors browse through a curated feed of startup ideas with filtering options by industry, funding stage, and investment size. Discover promising opportunities efficiently.",
  },
  {
    title: "Notification System",
    description:
      "Automated notifications keep both entrepreneurs and investors informed about status updates, new matches, interest expressions, and important platform activities.",
  },
];

export const MainContentSection = () => {
  const logos = [
    <FaApple />,
    <FaGoogle />,
    <FaMicrosoft />,
    <FaAmazon />,
    <FaFacebook />,
    <FaTwitter />,
    <FaLinkedin />,
    <FaGithub />,
    <FaPaypal />,
    <FaDropbox />,
    <FaSlack />,
    <FaReddit />,
    <FaYoutube />,
    <FaInstagram />,
    <FaWhatsapp />,
    <FaTelegram />,
    <SiTesla />,
    <SiNetflix />,
    <SiSpotify />,
    <SiUber />,
    <SiAirbnb />,
    <SiStripe />,
    <SiZoom />,
    <SiDiscord />,
    <SiTiktok />,
    <SiSnapchat />,
    <SiPinterest />,
    <SiShopify />,
    <SiSquare />,
    <SiAdobe />,
    <SiSalesforce />,
    <SiZendesk />,
    <SiHubspot />,
    <SiTrello />,
    <SiNotion />,
    <SiFigma />,
  ];

  const LogoCard = ({ logo }) => (
    <div className="justify-center items-center flex p-6 bg-[#0d0d0d] rounded-lg">
      {React.cloneElement(logo, { className: "w-16 h-16 text-white" })}
    </div>
  );

  return (
    <section className="flex flex-col items-center gap-8 md:gap-12 lg:gap-16 w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-12 lg:py-16">
      <div className="flex flex-col items-center gap-8 md:gap-12 w-full">
        <SectionTitle
          title="How StartSmart Works"
          description="Our platform bridges the gap between innovative entrepreneurs and forward-thinking investors. Experience a seamless journey from idea submission to funding through our intelligent dual-sided ecosystem."
        />
      </div>

      {/* User Flow Section */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full max-w-[1200px] mx-auto px-4">
        {/* Entrepreneur Flow */}
        <div className="flex-1 bg-[#0d0d0d] rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <FaLightbulb className="text-2xl text-white" />
            </div>
            <h3 className="[font-family:'Manrope',Helvetica] text-2xl font-semibold text-white mb-2">
              For Entrepreneurs
            </h3>
            <p className="[font-family:'Manrope',Helvetica] text-gray-300">
              Turn your innovative ideas into funded startups
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                1
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Submit Your Idea
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Complete our comprehensive idea form with attachments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                2
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Get AI Analysis
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Receive SWOT analysis, viability scores, and insights
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                3
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Connect with Investors
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Get notified when investors express interest in your idea
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                4
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Download Reports
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Get comprehensive PDF reports for stakeholders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Flow */}
        <div className="flex-1 bg-[#0d0d0d] rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <FaDollarSign className="text-2xl text-white" />
            </div>
            <h3 className="[font-family:'Manrope',Helvetica] text-2xl font-semibold text-white mb-2">
              For Investors
            </h3>
            <p className="[font-family:'Manrope',Helvetica] text-gray-300">
              Discover and invest in promising startups
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                1
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Browse Idea Feed
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Explore curated startup ideas with AI analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                2
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  View Detailed Analysis
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Access comprehensive reports and insights
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                3
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Express Interest
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Mark promising ideas and notify entrepreneurs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold mt-1">
                4
              </div>
              <div>
                <h4 className="[font-family:'Manrope',Helvetica] text-white font-medium">
                  Track Investments
                </h4>
                <p className="[font-family:'Manrope',Helvetica] text-gray-400 text-sm">
                  Monitor your investment pipeline and opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-7 w-full max-w-[1309px] mx-auto px-4">
        <div className="w-full border-t border-white/20 pt-6 md:pt-8 lg:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 w-full">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="card bg-transparent border-none">
                <div className="card-body p-0 space-y-3 md:space-y-[15px]">
                  <h3 className="card-title [font-family:'Manrope',Helvetica] font-semibold text-white text-lg md:text-xl tracking-[-0.80px] leading-7 md:leading-8">
                    {feature.title}
                  </h3>
                  <p className="[font-family:'Manrope',Helvetica] font-medium text-[#828282] text-sm md:text-base tracking-[-0.80px] leading-6 md:leading-[28.8px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Logos Section */}
      <div className="flex flex-col items-center gap-8 md:gap-12 w-full">
        <SectionTitle title="Trusted by Industry Leaders" />

        <div className="w-full overflow-hidden">
          <div className="flex flex-col gap-7">
            <div
              className="flex gap-[30px] animate-marquee"
              style={{ "--duration": "20s", "--gap": "30px" }}
            >
              {logos.concat(logos).map((logo, index) => (
                <LogoCard key={`row1-${index}`} logo={logo} />
              ))}
            </div>

            <div
              className="flex gap-[30px] animate-marquee"
              style={{
                "--duration": "25s",
                "--gap": "30px",
                animationDirection: "reverse",
              }}
            >
              {logos.concat(logos).map((logo, index) => (
                <LogoCard key={`row2-${index}`} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[1308px] min-h-[250px] md:min-h-[300px] lg:h-[350px] p-4 md:p-6 lg:p-2.5 bg-[#0d0d0d] rounded-[19px] overflow-hidden mx-4 xl:mx-auto">
        <div className="absolute w-[140px] h-[140px] top-0 right-[140px] bg-[#d9d9d9] rounded-[70px] blur-[202px]" />

        {/* CSS Decorative Elements */}
        <div className="absolute w-[60px] h-[60px] top-[-30px] left-[-30px] bg-white/5 rounded-full hidden md:block"></div>
        <div className="absolute w-[40px] h-[40px] bottom-[100px] right-[250px] bg-white/10 rounded-full hidden lg:block"></div>
        <div className="absolute w-[50px] h-[50px] top-[30px] right-[100px] bg-white/5 rounded-full hidden lg:block"></div>
        <div className="absolute w-[35px] h-[35px] top-[40px] left-52 bg-white/10 rounded-full hidden md:block"></div>

        <div className="flex flex-col items-center gap-6 md:gap-8 z-10 px-4 text-center">
          <h2 className="max-w-[984.72px] [font-family:'Manrope',Helvetica] font-semibold text-white text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[-0.48px] leading-tight md:leading-[74px]">
            Ready to Transform Your Future?
          </h2>

          <p className="max-w-[600px] [font-family:'Manrope',Helvetica] font-medium text-[#ffffff99] text-base md:text-lg text-center leading-6 md:leading-7 mb-4">
            Join thousands of entrepreneurs and investors who are already
            building the future together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="btn btn-lg rounded-[55px] gap-2 w-full sm:w-auto shadow-lg bg-white text-black hover:bg-gray-100 border-white">
              <span className="[font-family:'Poppins',Helvetica] font-medium text-base">
                Submit Your Idea
              </span>
              <FaArrowUp className="w-6 h-6" />
            </button>

            <button className="btn btn-outline btn-lg rounded-[55px] gap-2 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
              <span className="[font-family:'Poppins',Helvetica] font-medium text-base">
                Explore as Investor
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
