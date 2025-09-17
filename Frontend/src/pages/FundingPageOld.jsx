import React, { useState, useEffect } from "react";
import { fundingAPI, ideasAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import SideBar from "../components/entrepreneur/SideBar";
import Header from "../components/Header";
import { 
  FaDollarSign, 
  FaPlus, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaEdit,
  FaEye,
  FaChartLine,
  FaHandshake,
  FaFileContract,
  FaUsers,
  FaCalendarAlt
} from "react-icons/fa";

const FundingPage = () => {
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  
  // Form state
  const [newRequest, setNewRequest] = useState({
    ideaId: '',
    amount: '',
    equity: '',
    valuation: '',
    description: ''
  });

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load funding requests and user ideas in parallel
      const [fundingResponse, ideasResponse] = await Promise.all([
        fundingAPI.getUserFundingRequests(),
        ideasAPI.getUserIdeas()
      ]);
      
      setFundingRequests(fundingResponse.data || []);
      setUserIdeas(ideasResponse.data || []);
    } catch (err) {
      console.error("Error loading funding data:", err);
      setError(err.message);
      addNotification("Failed to load funding data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!newRequest.ideaId || !newRequest.amount || !newRequest.equity) {
      addNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      setActionLoading({ create: true });
      
      const response = await fundingAPI.createFundingRequest({
        idea: newRequest.ideaId,
        amount: parseFloat(newRequest.amount),
        equity: parseFloat(newRequest.equity),
        valuation: newRequest.valuation ? parseFloat(newRequest.valuation) : undefined,
        description: newRequest.description
      });
      
      setFundingRequests(prev => [response.data, ...prev]);
      setNewRequest({
        ideaId: '',
        amount: '',
        equity: '',
        valuation: '',
        description: ''
      });
      setShowCreateForm(false);
      addNotification("Funding request created successfully!", "success");
    } catch (err) {
      console.error("Error creating funding request:", err);
      addNotification(err.message || "Failed to create funding request", "error");
    } finally {
      setActionLoading({ create: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'under_review': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'funded': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateStats = () => {
    const totalRequests = fundingRequests.length;
    const totalAmount = fundingRequests.reduce((sum, req) => sum + (req.amount || 0), 0);
    const approvedRequests = fundingRequests.filter(req => req.status === 'approved' || req.status === 'funded').length;
    const pendingRequests = fundingRequests.filter(req => req.status === 'pending').length;
    
    return { totalRequests, totalAmount, approvedRequests, pendingRequests };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex">
          <SideBar />
          <main className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white/60 font-manrope">Loading funding requests...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex">
          <SideBar />
          <main className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <FaTimes className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white font-manrope">Error Loading Data</h3>
              <p className="text-white/60 mb-4 font-manrope">{error}</p>
              <button
                onClick={loadFundingData}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300 text-white font-manrope"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex">
        <SideBar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white font-manrope mb-2 flex items-center gap-3">
                  <FaDollarSign className="text-green-400" />
                  Funding Requests
                </h1>
                <p className="text-white/60 font-manrope">
                  Manage your funding requests and secure investment for your ideas
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 text-white font-manrope"
              >
                <FaPlus className="text-sm" />
                New Request
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <FaFileContract className="text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-blue-400 font-manrope">
                      {stats.totalRequests}
                    </span>
                  </div>
                  <h3 className="text-white font-manrope font-semibold text-lg mb-2">Total Requests</h3>
                  <p className="text-white/60 text-sm font-manrope">All funding requests created</p>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
                      <FaDollarSign className="text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-green-400 font-manrope">
                      {formatCurrency(stats.totalAmount)}
                    </span>
                  </div>
                  <h3 className="text-white font-manrope font-semibold text-lg mb-2">Total Amount</h3>
                  <p className="text-white/60 text-sm font-manrope">Sum of all requests</p>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <FaCheck className="text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-purple-400 font-manrope">
                      {stats.approvedRequests}
                    </span>
                  </div>
                  <h3 className="text-white font-manrope font-semibold text-lg mb-2">Approved</h3>
                  <p className="text-white/60 text-sm font-manrope">Successfully approved requests</p>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                      <FaClock className="text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-yellow-400 font-manrope">
                      {stats.pendingRequests}
                    </span>
                  </div>
                  <h3 className="text-white font-manrope font-semibold text-lg mb-2">Pending</h3>
                  <p className="text-white/60 text-sm font-manrope">Awaiting review</p>
                </div>
              </div>
            {/* Funding Requests List */}
            {fundingRequests.length === 0 ? (
              <div className="text-center py-12">
                <FaDollarSign className="mx-auto text-6xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-manrope">No Funding Requests Yet</h3>
                <p className="text-white/60 mb-6 font-manrope">Create your first funding request to start securing investment for your ideas</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-300 text-white font-manrope"
                >
                  Create Request
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {fundingRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/[0.02] rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 font-manrope">
                            {request.idea?.title || 'AI-Powered Personal Assistant'}
                          </h3>
                          <p className="text-white/60 mb-3 font-manrope">
                            {request.description || 'Seeking funding for innovative technology development'}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm border font-manrope ${getStatusColor(request.status)}`}>
                              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                            </span>
                            <span className="text-white/60 text-sm font-manrope">
                              Created {new Date(request.requestedAt || request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400 mb-1 font-manrope">
                            {formatCurrency(request.amount)}
                          </p>
                          <p className="text-white/60 text-sm font-manrope">
                            Funding Request
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <FaEye className="text-white/60" />
                          <span className="text-white/60 text-sm font-manrope">
                            View Details
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all duration-300 flex items-center gap-2 font-manrope">
                            <FaEdit className="text-sm" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white font-manrope">Create Funding Request</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2 font-manrope">Select Idea *</label>
                <select
                  value={newRequest.ideaId}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, ideaId: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none font-manrope"
                  required
                >
                  <option value="">Choose an idea...</option>
                  {userIdeas.map(idea => (
                    <option key={idea.id} value={idea.id} className="bg-gray-900">
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-manrope">Funding Amount ($) *</label>
                <input
                  type="number"
                  value={newRequest.amount}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none font-manrope"
                  placeholder="50000"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-manrope">Equity Offered (%) *</label>
                <input
                  type="number"
                  value={newRequest.equity}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, equity: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none font-manrope"
                  placeholder="10"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-manrope">Company Valuation ($)</label>
                <input
                  type="number"
                  value={newRequest.valuation}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, valuation: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none font-manrope"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-manrope">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none font-manrope"
                  placeholder="Describe how you plan to use the funding..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300 text-white font-manrope"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.create}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 text-white font-manrope disabled:opacity-50"
                >
                  {actionLoading.create ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Funding Amount ($) *</label>
                  <input
                    type="number"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="100000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Equity Percentage (%) *</label>
                  <input
                    type="number"
                    value={newRequest.equity}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, equity: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="10"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Company Valuation ($)</label>
                  <input
                    type="number"
                    value={newRequest.valuation}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, valuation: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="1000000"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading.create}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {actionLoading.create ? "Creating..." : "Create Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FundingPage;