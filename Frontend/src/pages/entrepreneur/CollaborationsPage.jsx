import React from "react";
import { FaUsers, FaHandshake, FaProjectDiagram, FaEnvelope, FaLinkedin } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const CollaborationsPage = () => {
  const collaborations = [
    {
      id: 1,
      title: "AI Healthcare Integration",
      partner: "Dr. Sarah Chen",
      expertise: "Machine Learning, Healthcare",
      status: "active",
      description: "Developing AI-powered diagnostic tools for rural healthcare"
    },
    {
      id: 2,
      title: "Sustainable Tech Alliance",
      partner: "EcoTech Solutions",
      expertise: "Green Technology, Manufacturing",
      status: "pending",
      description: "Creating biodegradable electronics components"
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
              <h1 className="text-3xl font-bold text-white mb-2">Collaborations</h1>
              <p className="text-white/60">Partner with other entrepreneurs and experts</p>
            </div>

            <div className="space-y-6">
              {collaborations.map((collab) => (
                <div key={collab.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FaHandshake className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{collab.title}</h3>
                        <p className="text-white/60">{collab.partner} • {collab.expertise}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      collab.status === "active" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {collab.status}
                    </span>
                  </div>
                  
                  <p className="text-white/70 mb-4">{collab.description}</p>
                  
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <FaEnvelope className="w-4 h-4" />
                      Message
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      View Project
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

export default CollaborationsPage;