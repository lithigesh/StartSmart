import React from "react";
import { FaTrophy, FaCalendarAlt, FaUsers, FaAward, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const IdeathonsPage = () => {
  const ideathons = [
    {
      id: 1,
      name: "Future Tech Challenge 2025",
      description: "Build the next generation of AI-powered solutions",
      startDate: "2025-09-15",
      endDate: "2025-09-17",
      location: "San Francisco, CA",
      prize: "$50,000",
      participants: 150,
      status: "registered"
    },
    {
      id: 2,
      name: "Green Innovation Summit",
      description: "Sustainable solutions for environmental challenges",
      startDate: "2025-10-01",
      endDate: "2025-10-03",
      location: "Austin, TX",
      prize: "$25,000",
      participants: 89,
      status: "available"
    }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      <SideBar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Ideathons</h1>
              <p className="text-white/60">Participate in innovation challenges and competitions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ideathons.map((ideathon) => (
                <div key={ideathon.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <FaTrophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{ideathon.name}</h3>
                        <p className="text-white/60 text-sm">{ideathon.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      ideathon.status === "registered" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {ideathon.status === "registered" ? "Registered" : "Available"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-white/70">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>{new Date(ideathon.startDate).toLocaleDateString()} - {new Date(ideathon.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>{ideathon.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaUsers className="w-4 h-4" />
                      <span>{ideathon.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <FaAward className="w-4 h-4" />
                      <span className="font-semibold">{ideathon.prize} prize pool</span>
                    </div>
                  </div>

                  <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    ideathon.status === "registered"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                    {ideathon.status === "registered" ? "View Details" : "Register Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeathonsPage;