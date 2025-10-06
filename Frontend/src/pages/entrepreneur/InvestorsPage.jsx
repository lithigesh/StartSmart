// pages/entrepreneur/InvestorsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { investorInterestAPI, ideasAPI } from "../../services/api";
import {
  FaBriefcase,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaLinkedin,
  FaDollarSign,
  FaCalendar,
  FaEye,
  FaHeart,
  FaHandshake,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const InvestorsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [loading, setLoading] = useState(true);
  const [interestedInvestors, setInterestedInvestors] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvestorsData();
  }, []);

  const loadInvestorsData = async () => {
    try {
      setLoading(true);
      const [investorsData, ideasData] = await Promise.all([
        investorAPI.getInterestedInvestors(),
        ideasAPI.getUserIdeas()
      ]);
      
      if (investorsData.success) {
        setInterestedInvestors(investorsData.data);
      }
      
      if (ideasData.success) {
        setUserIdeas(ideasData.data);
      }
    } catch (err) {
      console.error('Error loading investors data:', err);
      addNotification("Failed to load investors data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvestorDetails = (investor) => {
    setSelectedInvestor(investor);
    setShowDetails(true);
  };

  const handleAcceptInterest = async (investorId) => {
    try {
      const result = await investorAPI.acceptInvestorInterest(investorId);
      if (result.success) {
        addNotification("Investor interest accepted!", "success");
        await loadInvestorsData();
      }
    } catch (err) {
      addNotification("Failed to accept investor interest", "error");
    }
  };

  const handleDeclineInterest = async (investorId) => {
    try {
      const result = await investorAPI.declineInvestorInterest(investorId);
      if (result.success) {
        addNotification("Investor interest declined", "info");
        await loadInvestorsData();
      }
    } catch (err) {
      addNotification("Failed to decline investor interest", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'interested': return 'text-blue-400 bg-blue-400/10';
      case 'accepted': return 'text-green-400 bg-green-400/10';
      case 'declined': return 'text-red-400 bg-red-400/10';
      case 'negotiating': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredInvestors = interestedInvestors.filter(investor => {
    const matchesSearch = investor.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.ideaTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || investor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Interested Investors
          </h2>
          <p className="text-white/60">
            Connect with investors who are interested in your ideas
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search investors or ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-white/40 focus:outline-none appearance-none"
              >
                <option value="all">All Status</option>
                <option value="interested">Interested</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="negotiating">Negotiating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investors List */}
        {filteredInvestors.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <FaBriefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {interestedInvestors.length === 0 ? "No Investor Interest Yet" : "No Results Found"}
            </h3>
            <p className="text-white/60">
              {interestedInvestors.length === 0 
                ? "Keep sharing your ideas to attract investor attention" 
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestors.map((investor) => (
              <div 
                key={investor._id} 
                className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-blue-400" />
                      <h4 className="text-white font-semibold text-lg">
                        {investor.investorName}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(investor.status)}`}>
                        {investor.status}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">
                      Interested in: <span className="text-white font-medium">{investor.ideaTitle}</span>
                    </p>
                    {investor.investmentRange && (
                      <p className="text-green-400 text-sm font-medium">
                        Investment Range: {formatCurrency(investor.investmentRange.min)} - {formatCurrency(investor.investmentRange.max)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">Interested On</p>
                    <p className="text-white text-sm">{formatDate(investor.createdAt)}</p>
                  </div>
                </div>

                {investor.message && (
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <p className="text-white/80 text-sm">{investor.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4">
                    {investor.contactInfo?.email && (
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <FaEnvelope />
                        <span>{investor.contactInfo.email}</span>
                      </div>
                    )}
                    {investor.contactInfo?.phone && (
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <FaPhone />
                        <span>{investor.contactInfo.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewInvestorDetails(investor)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {investor.status === 'interested' && (
                      <>
                        <button
                          onClick={() => handleAcceptInterest(investor._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaCheck className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInterest(investor._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaTimes className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    )}
                    
                    {investor.status === 'accepted' && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                        <FaHandshake className="w-4 h-4" />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investor Details Modal */}
      {showDetails && selectedInvestor && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Investor Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{selectedInvestor.investorName}</h3>
                <p className="text-white/70">Interested in: {selectedInvestor.ideaTitle}</p>
              </div>
              
              {selectedInvestor.message && (
                <div>
                  <h4 className="text-white font-medium mb-2">Message:</h4>
                  <p className="text-white/80 bg-gray-800/50 rounded-lg p-4">{selectedInvestor.message}</p>
                </div>
              )}
              
              {selectedInvestor.investmentRange && (
                <div>
                  <h4 className="text-white font-medium mb-2">Investment Range:</h4>
                  <p className="text-green-400 font-semibold">
                    {formatCurrency(selectedInvestor.investmentRange.min)} - {formatCurrency(selectedInvestor.investmentRange.max)}
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-white font-medium mb-2">Contact Information:</h4>
                <div className="space-y-2">
                  {selectedInvestor.contactInfo?.email && (
                    <div className="flex items-center gap-2 text-white/70">
                      <FaEnvelope />
                      <span>{selectedInvestor.contactInfo.email}</span>
                    </div>
                  )}
                  {selectedInvestor.contactInfo?.phone && (
                    <div className="flex items-center gap-2 text-white/70">
                      <FaPhone />
                      <span>{selectedInvestor.contactInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedInvestor.status === 'interested' && (
                  <>
                    <button
                      onClick={() => {
                        handleAcceptInterest(selectedInvestor._id);
                        setShowDetails(false);
                      }}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Accept Interest
                    </button>
                    <button
                      onClick={() => {
                        handleDeclineInterest(selectedInvestor._id);
                        setShowDetails(false);
                      }}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorsPage;