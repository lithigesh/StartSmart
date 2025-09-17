import React from "react";
import { FaBriefcase, FaUsers, FaHandshake, FaSearch, FaEnvelope, FaLinkedin } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const InvestorsPage = () => {
  const investors = [
    {
      id: "1",
      name: "TechVenture Capital",
      focus: "Technology, AI, SaaS",
      location: "San Francisco, CA",
      fundSize: "$50M - $500M",
      stage: "Series A, Series B",
      portfolio: 45,
      status: "Connected",
      avatar: "TC"
    },
    {
      id: "2", 
      name: "Green Impact Fund",
      focus: "Environmental, Sustainability",
      location: "New York, NY",
      fundSize: "$10M - $100M",
      stage: "Seed, Series A",
      portfolio: 23,
      status: "Interested",
      avatar: "GI"
    },
    {
      id: "3",
      name: "HealthTech Ventures",
      focus: "Healthcare, Biotech, Medical Devices",
      location: "Boston, MA", 
      fundSize: "$25M - $200M",
      stage: "Series A, Series B, Series C",
      portfolio: 67,
      status: "Not Connected",
      avatar: "HV"
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "Connected":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Interested":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Not Connected":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Investors</h1>
                  <p className="text-white/60">Connect with investors interested in your ideas</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  <FaSearch className="w-4 h-4" />
                  Find Investors
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FaHandshake className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Connected</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FaUsers className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Interested</p>
                      <p className="text-2xl font-bold text-white">8</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Total Reached</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investors.map((investor) => (
                <div key={investor.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{investor.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{investor.name}</h3>
                        <p className="text-white/60 text-sm">{investor.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusConfig(investor.status)}`}>
                      {investor.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Focus Areas</p>
                      <p className="text-white text-sm">{investor.focus}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Investment Stage</p>
                      <p className="text-white text-sm">{investor.stage}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Fund Size</p>
                        <p className="text-white text-sm">{investor.fundSize}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Portfolio</p>
                        <p className="text-white text-sm">{investor.portfolio} companies</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                      <FaEnvelope className="w-4 h-4" />
                      Contact
                    </button>
                    <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <FaLinkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPage;