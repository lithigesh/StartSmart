import React, { useState, useEffect } from "react";
import { FaDollarSign, FaPlus, FaSearch, FaFilter, FaEye, FaDownload, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import SideBar from "../../components/entrepreneur/SideBar";
import DashboardHeader from "../../components/entrepreneur/DashboardHeader";

const FundingPage = () => {
  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dummy funding data
  const dummyFunding = [
    {
      _id: "1",
      ideaTitle: "AI-Powered Smart Home Assistant",
      amount: 250000,
      status: "approved",
      submittedAt: "2025-09-01T10:00:00Z",
      updatedAt: "2025-09-05T15:30:00Z",
      investor: "TechVenture Capital",
      notes: "Approved for Series A funding. Please proceed with legal documentation.",
      progress: 100
    },
    {
      _id: "2",
      ideaTitle: "Sustainable Packaging Solutions", 
      amount: 500000,
      status: "pending",
      submittedAt: "2025-09-08T09:00:00Z",
      updatedAt: "2025-09-08T09:00:00Z",
      investor: "Green Impact Fund",
      notes: "Under review by our investment committee.",
      progress: 60
    },
    {
      _id: "3",
      ideaTitle: "Digital Health Platform",
      amount: 100000,
      status: "rejected",
      submittedAt: "2025-08-25T14:20:00Z",
      updatedAt: "2025-08-30T11:45:00Z",
      investor: "HealthTech Ventures",
      notes: "Market size concerns. Consider pivoting to specific medical conditions.",
      progress: 0
    },
    {
      _id: "4",
      ideaTitle: "EdTech Learning Platform",
      amount: 350000,
      status: "negotiation",
      submittedAt: "2025-09-10T16:00:00Z",
      updatedAt: "2025-09-12T10:30:00Z",
      investor: "EduGrow Partners",
      notes: "Interested but requesting 25% equity instead of 20%. Awaiting your response.",
      progress: 80
    }
  ];

  useEffect(() => {
    loadFundingRequests();
  }, []);

  const loadFundingRequests = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFundingRequests(dummyFunding);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading funding requests:", error);
      setFundingRequests(dummyFunding);
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <FaClock className="w-4 h-4" />,
          label: "Pending Review"
        };
      case "approved":
        return {
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <FaCheckCircle className="w-4 h-4" />,
          label: "Approved"
        };
      case "rejected":
        return {
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
          label: "Rejected"
        };
      case "negotiation":
        return {
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <FaClock className="w-4 h-4" />,
          label: "In Negotiation"
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <FaClock className="w-4 h-4" />,
          label: "Unknown"
        };
    }
  };

  const filteredRequests = fundingRequests.filter(request => {
    const matchesSearch = request.ideaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.investor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalFunding = fundingRequests
    .filter(r => r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);

  const statuses = ["all", "pending", "approved", "rejected", "negotiation"];

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
                  <h1 className="text-3xl font-bold text-white mb-2">Funding</h1>
                  <p className="text-white/60">Track your funding requests and investments</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                  <FaPlus className="w-4 h-4" />
                  Request Funding
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FaDollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Total Funding</p>
                      <p className="text-2xl font-bold text-white">${totalFunding.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <FaClock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Pending</p>
                      <p className="text-2xl font-bold text-white">
                        {fundingRequests.filter(r => r.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FaCheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Approved</p>
                      <p className="text-2xl font-bold text-white">
                        {fundingRequests.filter(r => r.status === "approved").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FaClock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">In Negotiation</p>
                      <p className="text-2xl font-bold text-white">
                        {fundingRequests.filter(r => r.status === "negotiation").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search funding requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status} className="bg-gray-800">
                        {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Funding Requests */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <div key={request._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">{request.ideaTitle}</h3>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-white/60">Amount Requested</p>
                              <p className="text-white font-semibold">${request.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-white/60">Investor</p>
                              <p className="text-white font-semibold">{request.investor}</p>
                            </div>
                            <div>
                              <p className="text-white/60">Submitted</p>
                              <p className="text-white font-semibold">
                                {new Date(request.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {request.status !== "rejected" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/70 text-sm">Progress</span>
                            <span className="text-white text-sm">{request.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${request.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {request.notes && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-white/60 text-sm mb-1">Latest Update</p>
                          <p className="text-white text-sm">{request.notes}</p>
                          <p className="text-white/40 text-xs mt-2">
                            Updated {new Date(request.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {filteredRequests.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaDollarSign className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No funding requests found</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start by requesting funding for your ideas"}
                </p>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                  Request Your First Funding
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingPage;