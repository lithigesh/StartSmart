import React, { useState, useEffect } from "react";
import { investorAPI, ideasAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import { 
  FaUser, 
  FaSearch, 
  FaFilter, 
  FaHeart,
  FaEnvelope,
  FaDollarSign,
  FaBuilding,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGlobe,
  FaStar,
  FaEye,
  FaHandshake
} from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const InvestorsPage = () => {
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [investmentRangeFilter, setInvestmentRangeFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  
  // Filter options
  const industries = [
    "Technology", "Healthcare", "Finance", "E-commerce", 
    "Education", "Real Estate", "Food & Beverage", "Manufacturing"
  ];
  
  const investmentRanges = [
    { value: "0-50k", label: "$0 - $50K" },
    { value: "50k-250k", label: "$50K - $250K" },
    { value: "250k-1m", label: "$250K - $1M" },
    { value: "1m+", label: "$1M+" }
  ];

  useEffect(() => {
    loadInvestorsData();
  }, []);

  const loadInvestorsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load investors and user connections
      const [investorsResponse, connectionsResponse] = await Promise.all([
        investorAPI.getAllInvestors(),
        investorAPI.getUserConnections().catch(() => ({ data: [] }))
      ]);
      
      setInvestors(investorsResponse.data || []);
      setConnections(connectionsResponse.data || []);
    } catch (err) {
      console.error("Error loading investors data:", err);
      setError(err.message);
      
      // If API fails, show demo data
      setInvestors(generateDemoInvestors());
      addNotification("Using demo data - API connection failed", "warning");
    } finally {
      setLoading(false);
    }
  };

  const generateDemoInvestors = () => [
    {
      _id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@techventures.com",
      company: "TechVentures Capital",
      title: "Senior Partner",
      location: "San Francisco, CA",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      bio: "Focused on early-stage tech startups with AI/ML focus. 15+ years experience in venture capital.",
      industries: ["Technology", "Healthcare"],
      investmentRange: "250k-1m",
      totalInvestments: 47,
      successfulExits: 12,
      averageTicketSize: 500000,
      linkedin: "https://linkedin.com/in/sarahchen",
      website: "https://techventures.com",
      rating: 4.8,
      isVerified: true
    },
    {
      _id: "2", 
      name: "Marcus Rodriguez",
      email: "marcus@futuretech.vc",
      company: "Future Tech VC",
      title: "Managing Director",
      location: "Austin, TX",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      bio: "Passionate about fintech and blockchain innovations. Former tech entrepreneur turned investor.",
      industries: ["Finance", "Technology"],
      investmentRange: "50k-250k",
      totalInvestments: 32,
      successfulExits: 8,
      averageTicketSize: 150000,
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      website: "https://futuretech.vc",
      rating: 4.6,
      isVerified: true
    },
    {
      _id: "3",
      name: "Emily Watson",
      email: "emily@healthinnovate.fund",
      company: "HealthInnovate Fund",
      title: "Investment Principal",
      location: "Boston, MA",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      bio: "Specializing in healthcare and biotech investments. Medical background with MBA from Harvard.",
      industries: ["Healthcare", "Technology"],
      investmentRange: "1m+",
      totalInvestments: 23,
      successfulExits: 15,
      averageTicketSize: 2000000,
      linkedin: "https://linkedin.com/in/emilywatson",
      website: "https://healthinnovate.fund",
      rating: 4.9,
      isVerified: true
    }
  ];

  const handleConnect = async (investorId) => {
    try {
      setActionLoading({ [investorId]: true });
      
      await investorAPI.sendConnectionRequest(investorId);
      
      addNotification("Connection request sent successfully!", "success");
    } catch (err) {
      console.error("Error sending connection request:", err);
      addNotification(err.message || "Failed to send connection request", "error");
    } finally {
      setActionLoading({ [investorId]: false });
    }
  };

  // Filter investors
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter === "all" || 
                           investor.industries?.includes(industryFilter);
    
    const matchesInvestmentRange = investmentRangeFilter === "all" ||
                                  investor.investmentRange === investmentRangeFilter;
    
    return matchesSearch && matchesIndustry && matchesInvestmentRange;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isConnected = (investorId) => {
    return connections.some(conn => conn.investor === investorId || conn.entrepreneur === investorId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading investors...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Find Investors
                </h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  Connect with investors who align with your vision and industry
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search investors, companies, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none min-h-[44px] touch-manipulation"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none min-h-[44px] touch-manipulation flex-1 sm:flex-initial"
                >
                  <option value="all">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                
                <select
                  value={investmentRangeFilter}
                  onChange={(e) => setInvestmentRangeFilter(e.target.value)}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none min-h-[44px] touch-manipulation flex-1 sm:flex-initial"
                >
                  <option value="all">All Investment Ranges</option>
                  {investmentRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Investors</p>
                  <p className="text-2xl font-bold text-white">{filteredInvestors.length}</p>
                </div>
                <FaUser className="text-blue-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your Connections</p>
                  <p className="text-2xl font-bold text-green-400">{connections.length}</p>
                </div>
                <FaHandshake className="text-green-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Investment</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {formatCurrency(
                      filteredInvestors.reduce((sum, inv) => sum + (inv.averageTicketSize || 0), 0) / 
                      (filteredInvestors.length || 1)
                    )}
                  </p>
                </div>
                <FaDollarSign className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Investors Grid */}
          {filteredInvestors.length === 0 ? (
            <EmptyState
              icon={FaUser}
              title="No Investors Found"
              description="Try adjusting your search criteria or explore all available investors"
              actionText="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setIndustryFilter("all");
                setInvestmentRangeFilter("all");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredInvestors.map((investor) => (
                <div 
                  key={investor._id} 
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-200 group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={investor.profileImage || `https://ui-avatars.com/api/?name=${investor.name}&background=1f2937&color=ffffff`}
                        alt={investor.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-700"
                      />
                      {investor.isVerified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaStar className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{investor.name}</h3>
                      <p className="text-blue-400 text-xs sm:text-sm mb-1 truncate">{investor.title}</p>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{investor.company}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                      <span className="text-gray-400 text-xs sm:text-sm">{investor.rating}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2 sm:line-clamp-3">{investor.bio}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 truncate">{investor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FaDollarSign className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 truncate">
                        Avg: {formatCurrency(investor.averageTicketSize)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FaEye className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 truncate">
                        {investor.totalInvestments} investments, {investor.successfulExits} exits
                      </span>
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {investor.industries?.slice(0, 3).map((industry, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      {investor.linkedin && (
                        <a
                          href={investor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                        >
                          <FaLinkedin className="text-sm" />
                        </a>
                      )}
                      {investor.website && (
                        <a
                          href={investor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors"
                        >
                          <FaGlobe className="text-sm" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex-1 flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <FaEnvelope className="text-xs" />
                        Message
                      </button>
                      
                      {isConnected(investor._id) ? (
                        <button
                          disabled
                          className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm flex items-center justify-center gap-2"
                        >
                          <FaCheck className="text-xs" />
                          Connected
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(investor._id)}
                          disabled={actionLoading[investor._id]}
                          className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <FaHandshake className="text-xs" />
                          {actionLoading[investor._id] ? "Connecting..." : "Connect"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InvestorsPage;