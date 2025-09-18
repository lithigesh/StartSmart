import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { entrepreneurAPI, fundingAPI, ideasAPI } from "../services/api";
import DashboardHeader from "../components/entrepreneur/DashboardHeader";
import SideBar from "../components/entrepreneur/SideBar";
import WelcomeSection from "../components/entrepreneur/WelcomeSection";
import MyIdeasSection from "../components/entrepreneur/MyIdeasSection";
import RecentActivitySection from "../components/entrepreneur/RecentActivitySection";
import NotificationsPopup from "../components/entrepreneur/NotificationsPopup";
import {
  FaLightbulb,
  FaDollarSign,
  FaBriefcase,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaBell,
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaPercentage,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
  FaEdit,
  FaTrash,
  FaTimesCircle,
  FaMinusCircle
} from "react-icons/fa";

const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const { unreadCount, addNotification } = useNotifications();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [dashboardData, setDashboardData] = useState({
    totalIdeas: 0,
    fundingReceived: 0,
    interestedInvestors: 0,
    ideas: []
  });
  const [userIdeas, setUserIdeas] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [selectedFundingRequest, setSelectedFundingRequest] = useState(null);
  const [fundingFormData, setFundingFormData] = useState({
    ideaId: '',
    amount: '',
    equity: '',
    message: '',
    businessPlan: '',
    financialProjections: '',
    useOfFunds: '',
    timeline: '',
    milestones: '',
    teamSize: '',
    currentRevenue: '',
    projectedRevenue: '',
    targetMarket: '',
    competitiveAdvantage: '',
    riskFactors: '',
    exitStrategy: '',
    previousFunding: '',
    revenueModel: '',
    customerTraction: '',
    intellectualProperty: '',
    keyTeamMembers: '',
    advisors: '',
    existingInvestors: '',
    contactPhone: '',
    contactEmail: '',
    companyWebsite: '',
    linkedinProfile: '',
    additionalDocuments: ''
  });
  const [submittingFunding, setSubmittingFunding] = useState(false);

  // Refs for scrolling to sections
  const myIdeasRef = useRef(null);
  const analyticsRef = useRef(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, ideasData, fundingData] = await Promise.all([
        entrepreneurAPI.getDashboardMetrics(),
        ideasAPI.getUserIdeas(),
        fundingAPI.getUserFundingRequests()
      ]);
      
      // Update dashboard metrics
      setDashboardData(metricsData);
      
      // Update ideas list
      if (ideasData.success) {
        setUserIdeas(ideasData.data);
      }
      
      // Update funding requests
      if (fundingData.success) {
        setFundingRequests(fundingData.data);
      }
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFundingRequest = () => {
    if (userIdeas.length === 0) {
      addNotification("You need to submit an idea before requesting funding", "error");
      return;
    }
    setShowFundingModal(true);
  };

  const handleFundingFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!fundingFormData.ideaId || !fundingFormData.amount || !fundingFormData.equity) {
      addNotification("Please fill in all required fields (Idea, Amount, and Equity)", "error");
      return;
    }

    try {
      setSubmittingFunding(true);
      
      const requestData = {
        ideaId: fundingFormData.ideaId,
        amount: fundingFormData.amount,
        message: fundingFormData.message,
        businessPlan: fundingFormData.businessPlan,
        financialProjections: fundingFormData.financialProjections,
        useOfFunds: fundingFormData.useOfFunds,
        timeline: fundingFormData.timeline,
        milestones: fundingFormData.milestones,
        teamSize: fundingFormData.teamSize,
        currentRevenue: fundingFormData.currentRevenue,
        projectedRevenue: fundingFormData.projectedRevenue,
        targetMarket: fundingFormData.targetMarket,
        competitiveAdvantage: fundingFormData.competitiveAdvantage,
        riskFactors: fundingFormData.riskFactors,
        exitStrategy: fundingFormData.exitStrategy,
        previousFunding: fundingFormData.previousFunding,
        revenueModel: fundingFormData.revenueModel,
        customerTraction: fundingFormData.customerTraction,
        intellectualProperty: fundingFormData.intellectualProperty,
        keyTeamMembers: fundingFormData.keyTeamMembers,
        advisors: fundingFormData.advisors,
        existingInvestors: fundingFormData.existingInvestors,
        contactPhone: fundingFormData.contactPhone,
        contactEmail: fundingFormData.contactEmail,
        companyWebsite: fundingFormData.companyWebsite,
        linkedinProfile: fundingFormData.linkedinProfile,
        additionalDocuments: fundingFormData.additionalDocuments
      };

      const result = await fundingAPI.createFundingRequest(requestData);
      
      if (result.success) {
        addNotification("Funding request submitted successfully!", "success");
        setShowFundingModal(false);
        resetFundingForm();
        // Reload funding requests
        await loadDashboardData();
      } else {
        throw new Error(result.message || "Failed to submit funding request");
      }
      
    } catch (err) {
      console.error('Error submitting funding request:', err);
      addNotification(err.message || "Failed to submit funding request", "error");
    } finally {
      setSubmittingFunding(false);
    }
  };

  const resetFundingForm = () => {
    setFundingFormData({
      ideaId: '',
      amount: '',
      message: '',
      businessPlan: '',
      financialProjections: '',
      useOfFunds: '',
      timeline: '',
      milestones: '',
      teamSize: '',
      currentRevenue: '',
      projectedRevenue: '',
      targetMarket: '',
      competitiveAdvantage: '',
      riskFactors: '',
      exitStrategy: '',
      previousFunding: '',
      revenueModel: '',
      customerTraction: '',
      intellectualProperty: '',
      keyTeamMembers: '',
      advisors: '',
      existingInvestors: '',
      contactPhone: '',
      contactEmail: '',
      companyWebsite: '',
      linkedinProfile: '',
      additionalDocuments: ''
    });
  };

  // Handle editing funding request
  const handleEditFundingRequest = (request) => {
    setSelectedFundingRequest(request);
    setFundingFormData({
      ideaId: request.ideaId._id,
      amount: request.amount.toString(),
      equity: request.equity ? request.equity.toString() : '',
      message: request.message || '',
      businessPlan: request.businessPlan || '',
      financialProjections: request.financialProjections || '',
      useOfFunds: request.useOfFunds || '',
      timeline: request.timeline || '',
      milestones: request.milestones || '',
      teamSize: request.teamSize ? request.teamSize.toString() : '',
      currentRevenue: request.currentRevenue ? request.currentRevenue.toString() : '',
      projectedRevenue: request.projectedRevenue ? request.projectedRevenue.toString() : '',
      targetMarket: request.targetMarket || '',
      competitiveAdvantage: request.competitiveAdvantage || '',
      riskFactors: request.riskFactors || '',
      exitStrategy: request.exitStrategy || '',
      previousFunding: request.previousFunding ? request.previousFunding.toString() : '',
      revenueModel: request.revenueModel || '',
      customerTraction: request.customerTraction || '',
      intellectualProperty: request.intellectualProperty || '',
      keyTeamMembers: request.keyTeamMembers || '',
      advisors: request.advisors || '',
      existingInvestors: request.existingInvestors || '',
      contactPhone: request.contactPhone || '',
      contactEmail: request.contactEmail || '',
      companyWebsite: request.companyWebsite || '',
      linkedinProfile: request.linkedinProfile || '',
      additionalDocuments: request.additionalDocuments || ''
    });
    setShowEditModal(true);
  };

  // Handle updating funding request
  const handleUpdateFundingRequest = async (e) => {
    e.preventDefault();
    
    if (!fundingFormData.ideaId || !fundingFormData.amount || !fundingFormData.equity) {
      addNotification("Please fill in all required fields (Idea, Amount, and Equity)", "error");
      return;
    }

    try {
      setSubmittingFunding(true);
      
      const requestData = {
        ideaId: fundingFormData.ideaId,
        amount: fundingFormData.amount,
        message: fundingFormData.message,
        businessPlan: fundingFormData.businessPlan,
        financialProjections: fundingFormData.financialProjections,
        useOfFunds: fundingFormData.useOfFunds,
        timeline: fundingFormData.timeline,
        milestones: fundingFormData.milestones,
        teamSize: fundingFormData.teamSize,
        currentRevenue: fundingFormData.currentRevenue,
        projectedRevenue: fundingFormData.projectedRevenue,
        targetMarket: fundingFormData.targetMarket,
        competitiveAdvantage: fundingFormData.competitiveAdvantage,
        riskFactors: fundingFormData.riskFactors,
        exitStrategy: fundingFormData.exitStrategy,
        previousFunding: fundingFormData.previousFunding,
        revenueModel: fundingFormData.revenueModel,
        customerTraction: fundingFormData.customerTraction,
        intellectualProperty: fundingFormData.intellectualProperty,
        keyTeamMembers: fundingFormData.keyTeamMembers,
        advisors: fundingFormData.advisors,
        existingInvestors: fundingFormData.existingInvestors,
        contactPhone: fundingFormData.contactPhone,
        contactEmail: fundingFormData.contactEmail,
        companyWebsite: fundingFormData.companyWebsite,
        linkedinProfile: fundingFormData.linkedinProfile,
        additionalDocuments: fundingFormData.additionalDocuments
      };

      const result = await fundingAPI.updateFundingRequestDetails(selectedFundingRequest._id, requestData);
      
      if (result.success) {
        addNotification("Funding request updated successfully!", "success");
        setShowEditModal(false);
        setSelectedFundingRequest(null);
        resetFundingForm();
        // Reload funding requests
        await loadDashboardData();
      } else {
        throw new Error(result.message || "Failed to update funding request");
      }
      
    } catch (err) {
      console.error('Error updating funding request:', err);
      addNotification(err.message || "Failed to update funding request", "error");
    } finally {
      setSubmittingFunding(false);
    }
  };

  // Handle withdrawing funding request
  const handleWithdrawFundingRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to withdraw this funding request? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const result = await fundingAPI.withdrawFundingRequest(requestId);
      
      if (result.success) {
        addNotification("Funding request withdrawn successfully!", "success");
        // Reload funding requests
        await loadDashboardData();
      } else {
        throw new Error(result.message || "Failed to withdraw funding request");
      }
      
    } catch (err) {
      console.error('Error withdrawing funding request:', err);
      addNotification(err.message || "Failed to withdraw funding request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFundingFormChange = (field, value) => {
    setFundingFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'negotiated': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Calculate dashboard metrics (will be loaded from API)
  const totalIdeas = dashboardData.totalIdeas;
  const fundingReceived = dashboardData.fundingReceived;
  const interestedInvestors = dashboardData.interestedInvestors;

  const dashboardCards = [
    {
      title: "My Ideas",
      description: "Startup ideas you've submitted",
      icon: <FaLightbulb className="w-6 h-6" />,
      count: totalIdeas.toString(),
      onClick: () => setActiveSection("my-ideas"),
    },
    {
      title: "Funding Received",
      description: "Total funding received from investors",
      icon: <FaDollarSign className="w-6 h-6" />,
      count: `$${(fundingReceived / 1000).toFixed(0)}K`,
      onClick: () => setActiveSection("funding"),
    },
    {
      title: "Interested Investors",
      description: "Investors showing interest in your ideas",
      icon: <FaBriefcase className="w-6 h-6" />,
      count: interestedInvestors.toString(),
      onClick: () => setActiveSection("investors"),
    },
    {
      title: "Notifications",
      description: "New notifications requiring your attention",
      icon: <FaBell className="w-6 h-6" />,
      count: unreadCount.toString(),
      onClick: () => setActiveSection("notifications"),
    },
  ];

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div>
              <WelcomeSection />
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  onClick={card.onClick}
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      {card.icon}
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {card.count}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Activity Section */}
            <div>
              <RecentActivitySection />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        );

      case "my-ideas":
        return (
          <div className="space-y-6" ref={myIdeasRef}>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  My Ideas
                </h2>
                <p className="text-white/60">
                  Manage and track your startup ideas
                </p>
              </div>
              <MyIdeasSection showTitle={false} />
            </div>
          </div>
        );

      case "funding":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Funding Overview
                </h2>
                <p className="text-white/60">
                  Track your funding progress and investor relationships
                </p>
              </div>

              {/* Funding Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">
                      <FaDollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                      {formatCurrency(fundingReceived)}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Total Funding
                  </h3>
                  <p className="text-white/60 text-sm">
                    Received from investors
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">
                      <FaFileAlt className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-blue-400">
                      {fundingRequests.length}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Funding Requests
                  </h3>
                  <p className="text-white/60 text-sm">
                    Total submitted requests
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">
                      <FaUsers className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-purple-400">
                      {interestedInvestors}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Interested Investors
                  </h3>
                  <p className="text-white/60 text-sm">
                    Showing interest in your ideas
                  </p>
                </div>
              </div>

              {/* Create Funding Request Button */}
              <div className="mb-6">
                <button
                  onClick={handleCreateFundingRequest}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                >
                  <FaPlus className="w-4 h-4" />
                  Request Funding
                </button>
              </div>

              {/* Funding Requests List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Funding Requests
                </h3>
                
                {fundingRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                    <FaDollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Funding Requests Yet
                    </h3>
                    <p className="text-white/60 mb-4">
                      Submit your first funding request to attract investors
                    </p>
                    <button
                      onClick={handleCreateFundingRequest}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <FaPlus className="w-4 h-4" />
                      Create First Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fundingRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg mb-2">
                              {request.ideaTitle}
                            </h4>
                            <p className="text-white/70 text-sm mb-3">
                              {request.description}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-white/60 text-xs mb-1">Amount Requested</p>
                            <p className="text-white font-semibold">{formatCurrency(request.amount)}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs mb-1">Team Size</p>
                            <p className="text-white font-semibold">{request.teamSize || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs mb-1">Submitted</p>
                            <p className="text-white font-semibold">{formatDate(request.createdAt)}</p>
                          </div>
                        </div>
                        
                        {request.message && (
                          <div className="mb-4">
                            <p className="text-white/60 text-xs mb-1">Message</p>
                            <p className="text-white/80 text-sm">{request.message}</p>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleEditFundingRequest(request)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                              >
                                <FaEdit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleWithdrawFundingRequest(request._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                              >
                                <FaTrash className="w-4 h-4" />
                                Withdraw
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                              <FaCheckCircle className="w-4 h-4" />
                              Approved
                            </span>
                          )}
                          {request.status === 'rejected' && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium">
                              <FaTimesCircle className="w-4 h-4" />
                              Rejected
                            </span>
                          )}
                          {request.status === 'withdrawn' && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg text-sm font-medium">
                              <FaMinusCircle className="w-4 h-4" />
                              Withdrawn
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "investors":
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
              <div className="text-center py-12">
                <FaBriefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Investor Dashboard Coming Soon
                </h3>
                <p className="text-white/60">
                  View and manage investor interest, communications, and partnerships
                </p>
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6" ref={analyticsRef}>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Analytics & Insights
                </h2>
                <p className="text-white/60">
                  Track performance and gain insights into your startup journey
                </p>
              </div>
              <div className="text-center py-12">
                <FaChartBar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analytics Dashboard Coming Soon
                </h3>
                <p className="text-white/60">
                  Detailed analytics on idea performance, investor engagement, and growth metrics
                </p>
              </div>
            </div>
          </div>
        );

      case "ideathons":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Ideathons & Competitions
                </h2>
                <p className="text-white/60">
                  Participate in startup competitions and showcase your ideas
                </p>
              </div>
              <div className="text-center py-12">
                <FaTrophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ideathons Coming Soon
                </h3>
                <p className="text-white/60">
                  Join competitions, win prizes, and gain recognition for your innovative ideas
                </p>
              </div>
            </div>
          </div>
        );

      case "collaborations":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Collaborations & Networking
                </h2>
                <p className="text-white/60">
                  Connect with other entrepreneurs and build your network
                </p>
              </div>
              <div className="text-center py-12">
                <FaUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Collaboration Hub Coming Soon
                </h3>
                <p className="text-white/60">
                  Network with fellow entrepreneurs, find co-founders, and build partnerships
                </p>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Notifications
                </h2>
                <p className="text-white/60">
                  Stay updated with the latest activities
                </p>
              </div>
              <NotificationsPopup
                showNotifications={true}
                setShowNotifications={() => {}}
                isFullPage={true}
              />
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Settings
                </h2>
                <p className="text-white/60">
                  Manage your account settings and preferences
                </p>
              </div>
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Settings Coming Soon
                </h3>
                <p className="text-white/60">
                  Customize your profile, notification preferences, and account settings
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Coming Soon
                </h2>
                <p className="text-white/60">This section is under development</p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <SideBar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <DashboardHeader onSectionChange={handleSectionChange} />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderSectionContent()}
        </div>
      </div>

      {/* Funding Request Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Request Funding</h2>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleFundingFormSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Select Idea *
                    </label>
                    <select
                      value={fundingFormData.ideaId}
                      onChange={(e) => handleFundingFormChange('ideaId', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                      required
                    >
                      <option value="">Choose an idea...</option>
                      {userIdeas.map((idea) => (
                        <option key={idea.id} value={idea.id}>
                          {idea.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Funding Amount Requested *
                    </label>
                    <input
                      type="number"
                      value={fundingFormData.amount}
                      onChange={(e) => handleFundingFormChange('amount', e.target.value)}
                      placeholder="Enter amount in USD"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={fundingFormData.teamSize}
                      onChange={(e) => handleFundingFormChange('teamSize', e.target.value)}
                      placeholder="e.g., 5"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      value={fundingFormData.teamSize}
                      onChange={(e) => handleFundingFormChange('teamSize', e.target.value)}
                      placeholder="Number of team members"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Business Details</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Business Plan Summary
                  </label>
                  <textarea
                    value={fundingFormData.businessPlan}
                    onChange={(e) => handleFundingFormChange('businessPlan', e.target.value)}
                    placeholder="Provide a comprehensive summary of your business plan..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Current Revenue (Annual)
                    </label>
                    <input
                      type="number"
                      value={fundingFormData.currentRevenue}
                      onChange={(e) => handleFundingFormChange('currentRevenue', e.target.value)}
                      placeholder="Enter annual revenue in USD"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Projected Revenue (Next Year)
                    </label>
                    <input
                      type="number"
                      value={fundingFormData.projectedRevenue}
                      onChange={(e) => handleFundingFormChange('projectedRevenue', e.target.value)}
                      placeholder="Enter projected revenue in USD"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Previous Funding Raised
                    </label>
                    <input
                      type="number"
                      value={fundingFormData.previousFunding}
                      onChange={(e) => handleFundingFormChange('previousFunding', e.target.value)}
                      placeholder="Total previous funding in USD"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Existing Investors
                  </label>
                  <textarea
                    value={fundingFormData.existingInvestors}
                    onChange={(e) => handleFundingFormChange('existingInvestors', e.target.value)}
                    placeholder="List any existing investors or partners..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Revenue Model
                  </label>
                  <textarea
                    value={fundingFormData.revenueModel}
                    onChange={(e) => handleFundingFormChange('revenueModel', e.target.value)}
                    placeholder="Describe how your business generates revenue..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Market & Strategy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Market & Strategy</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Target Market
                  </label>
                  <textarea
                    value={fundingFormData.targetMarket}
                    onChange={(e) => handleFundingFormChange('targetMarket', e.target.value)}
                    placeholder="Describe your target market and addressable market size..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Competitive Advantage
                  </label>
                  <textarea
                    value={fundingFormData.competitiveAdvantage}
                    onChange={(e) => handleFundingFormChange('competitiveAdvantage', e.target.value)}
                    placeholder="What makes your solution unique and better than competitors..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Customer Traction
                  </label>
                  <textarea
                    value={fundingFormData.customerTraction}
                    onChange={(e) => handleFundingFormChange('customerTraction', e.target.value)}
                    placeholder="Describe your current customer base, user metrics, partnerships..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Financial Projections & Use of Funds */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Financial Projections</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Financial Projections
                  </label>
                  <textarea
                    value={fundingFormData.financialProjections}
                    onChange={(e) => handleFundingFormChange('financialProjections', e.target.value)}
                    placeholder="Provide 3-5 year financial projections including revenue, expenses, and growth metrics..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Use of Funds
                  </label>
                  <textarea
                    value={fundingFormData.useOfFunds}
                    onChange={(e) => handleFundingFormChange('useOfFunds', e.target.value)}
                    placeholder="Detailed breakdown of how the funding will be used (e.g., product development 40%, marketing 30%, hiring 20%, operations 10%)..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Timeline & Milestones */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Timeline & Milestones</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Project Timeline
                  </label>
                  <textarea
                    value={fundingFormData.timeline}
                    onChange={(e) => handleFundingFormChange('timeline', e.target.value)}
                    placeholder="Outline your key timeline and expected completion dates..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Key Milestones
                  </label>
                  <textarea
                    value={fundingFormData.milestones}
                    onChange={(e) => handleFundingFormChange('milestones', e.target.value)}
                    placeholder="List key milestones and achievements planned with this funding..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Risk & Exit Strategy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Risk Assessment & Strategy</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Risk Factors
                  </label>
                  <textarea
                    value={fundingFormData.riskFactors}
                    onChange={(e) => handleFundingFormChange('riskFactors', e.target.value)}
                    placeholder="Identify potential risks and your mitigation strategies..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Exit Strategy
                  </label>
                  <textarea
                    value={fundingFormData.exitStrategy}
                    onChange={(e) => handleFundingFormChange('exitStrategy', e.target.value)}
                    placeholder="Describe potential exit strategies for investors (acquisition, IPO, etc.)..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Intellectual Property
                  </label>
                  <textarea
                    value={fundingFormData.intellectualProperty}
                    onChange={(e) => handleFundingFormChange('intellectualProperty', e.target.value)}
                    placeholder="Describe any patents, trademarks, or proprietary technology..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={fundingFormData.contactPhone}
                      onChange={(e) => handleFundingFormChange('contactPhone', e.target.value)}
                      placeholder="Your contact phone number"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={fundingFormData.contactEmail}
                      onChange={(e) => handleFundingFormChange('contactEmail', e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={fundingFormData.companyWebsite}
                      onChange={(e) => handleFundingFormChange('companyWebsite', e.target.value)}
                      placeholder="https://www.yourcompany.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={fundingFormData.linkedinProfile}
                      onChange={(e) => handleFundingFormChange('linkedinProfile', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Message to Investors
                  </label>
                  <textarea
                    value={fundingFormData.message}
                    onChange={(e) => handleFundingFormChange('message', e.target.value)}
                    placeholder="Additional message or pitch to potential investors..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Additional Documents
                  </label>
                  <textarea
                    value={fundingFormData.additionalDocuments}
                    onChange={(e) => handleFundingFormChange('additionalDocuments', e.target.value)}
                    placeholder="List any additional documents you can provide (pitch deck, financial statements, etc.)..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowFundingModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submittingFunding}
                  className="flex-1 px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {submittingFunding ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit Funding Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Funding Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Edit Funding Request</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFundingRequest(null);
                  resetFundingForm();
                }}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFundingRequest} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Select Idea *
                  </label>
                  <select
                    value={fundingFormData.ideaId}
                    onChange={(e) => handleFundingFormChange('ideaId', e.target.value)}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="">Select an idea...</option>
                    {userIdeas.map((idea) => (
                      <option key={idea._id} value={idea._id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Amount Requested ($) *
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.amount}
                    onChange={(e) => handleFundingFormChange('amount', e.target.value)}
                    placeholder="e.g., 100000"
                    min="1"
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.teamSize}
                    onChange={(e) => handleFundingFormChange('teamSize', e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Current Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.currentRevenue}
                    onChange={(e) => handleFundingFormChange('currentRevenue', e.target.value)}
                    placeholder="e.g., 50000"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Projected Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.projectedRevenue}
                    onChange={(e) => handleFundingFormChange('projectedRevenue', e.target.value)}
                    placeholder="e.g., 100000"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Previous Funding ($)
                  </label>
                  <input
                    type="number"
                    value={fundingFormData.previousFunding}
                    onChange={(e) => handleFundingFormChange('previousFunding', e.target.value)}
                    placeholder="e.g., 25000"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Funding Request Message
                  </label>
                  <textarea
                    value={fundingFormData.message}
                    onChange={(e) => handleFundingFormChange('message', e.target.value)}
                    placeholder="Briefly describe why you need funding and what you plan to achieve..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Business Plan & Strategy */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Business Plan & Strategy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Target Market
                    </label>
                    <textarea
                      value={fundingFormData.targetMarket}
                      onChange={(e) => handleFundingFormChange('targetMarket', e.target.value)}
                      placeholder="Describe your target market and customer segments..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Competitive Advantage
                    </label>
                    <textarea
                      value={fundingFormData.competitiveAdvantage}
                      onChange={(e) => handleFundingFormChange('competitiveAdvantage', e.target.value)}
                      placeholder="What makes your solution unique and better than competitors..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Revenue Model
                    </label>
                    <textarea
                      value={fundingFormData.revenueModel}
                      onChange={(e) => handleFundingFormChange('revenueModel', e.target.value)}
                      placeholder="How do you plan to generate revenue..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Customer Traction
                    </label>
                    <textarea
                      value={fundingFormData.customerTraction}
                      onChange={(e) => handleFundingFormChange('customerTraction', e.target.value)}
                      placeholder="Current customer base, pilot programs, letters of intent..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Business Plan Summary
                  </label>
                  <textarea
                    value={fundingFormData.businessPlan}
                    onChange={(e) => handleFundingFormChange('businessPlan', e.target.value)}
                    placeholder="Provide a comprehensive overview of your business plan..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Financial Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Financial Projections
                    </label>
                    <textarea
                      value={fundingFormData.financialProjections}
                      onChange={(e) => handleFundingFormChange('financialProjections', e.target.value)}
                      placeholder="Revenue projections for the next 3-5 years..."
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Use of Funds
                    </label>
                    <textarea
                      value={fundingFormData.useOfFunds}
                      onChange={(e) => handleFundingFormChange('useOfFunds', e.target.value)}
                      placeholder="How will you use the funding? (hiring, marketing, R&D, etc.)..."
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Timeline & Milestones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Timeline & Milestones
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Project Timeline
                    </label>
                    <textarea
                      value={fundingFormData.timeline}
                      onChange={(e) => handleFundingFormChange('timeline', e.target.value)}
                      placeholder="Key phases and timeline for your project..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Key Milestones
                    </label>
                    <textarea
                      value={fundingFormData.milestones}
                      onChange={(e) => handleFundingFormChange('milestones', e.target.value)}
                      placeholder="Major milestones and success metrics..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Team & Risk Assessment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Team & Risk Assessment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Key Team Members
                    </label>
                    <textarea
                      value={fundingFormData.keyTeamMembers}
                      onChange={(e) => handleFundingFormChange('keyTeamMembers', e.target.value)}
                      placeholder="Describe your key team members and their roles..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Advisors
                    </label>
                    <textarea
                      value={fundingFormData.advisors}
                      onChange={(e) => handleFundingFormChange('advisors', e.target.value)}
                      placeholder="Industry advisors, mentors, or board members..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Existing Investors
                    </label>
                    <textarea
                      value={fundingFormData.existingInvestors}
                      onChange={(e) => handleFundingFormChange('existingInvestors', e.target.value)}
                      placeholder="List any existing investors or partners..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Risk Factors
                    </label>
                    <textarea
                      value={fundingFormData.riskFactors}
                      onChange={(e) => handleFundingFormChange('riskFactors', e.target.value)}
                      placeholder="Potential risks and how you plan to mitigate them..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Exit Strategy
                    </label>
                    <textarea
                      value={fundingFormData.exitStrategy}
                      onChange={(e) => handleFundingFormChange('exitStrategy', e.target.value)}
                      placeholder="Long-term exit strategy for investors..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Intellectual Property
                  </label>
                  <textarea
                    value={fundingFormData.intellectualProperty}
                    onChange={(e) => handleFundingFormChange('intellectualProperty', e.target.value)}
                    placeholder="Patents, trademarks, copyrights, or trade secrets..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <FaPhone className="inline mr-2" />
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={fundingFormData.contactPhone}
                      onChange={(e) => handleFundingFormChange('contactPhone', e.target.value)}
                      placeholder="e.g., +1 (555) 123-4567"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={fundingFormData.contactEmail}
                      onChange={(e) => handleFundingFormChange('contactEmail', e.target.value)}
                      placeholder="e.g., contact@company.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <FaGlobe className="inline mr-2" />
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={fundingFormData.companyWebsite}
                      onChange={(e) => handleFundingFormChange('companyWebsite', e.target.value)}
                      placeholder="e.g., https://company.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <FaLinkedin className="inline mr-2" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={fundingFormData.linkedinProfile}
                      onChange={(e) => handleFundingFormChange('linkedinProfile', e.target.value)}
                      placeholder="e.g., https://linkedin.com/in/yourprofile"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Additional Documents
                  </label>
                  <textarea
                    value={fundingFormData.additionalDocuments}
                    onChange={(e) => handleFundingFormChange('additionalDocuments', e.target.value)}
                    placeholder="List any additional documents you can provide (pitch deck, financial statements, etc.)..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFundingRequest(null);
                    resetFundingForm();
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submittingFunding}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {submittingFunding ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Update Funding Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurDashboard;
