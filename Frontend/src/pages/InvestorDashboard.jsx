import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { investorAPI, fundingAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import {
  InvestorDashboardHeader,
  InvestorSidebar,
  NotificationsPopup,
  InvestorWelcomeSection,
  InvestorDashboardCards,
  ErrorMessage,
  IdeasSection,
  LoadingSpinner,
  SettingsSection,
  ComparisonBar,
  ComparisonModal,
  SavedComparisonsSection,
  MarketResearchSection,
  PortfolioSection,
} from "../components/investor";
import InvestorDealsPage from "./investor/InvestorDealsPage";
import InvestorFeedbackPage from "./investor/InvestorFeedbackPage";
import { FaLightbulb, FaHeart, FaBell } from "react-icons/fa";

const InvestorDashboard = () => {
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [interestedIdeas, setInterestedIdeas] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'score'

  // Advanced filters state
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [fundingRange, setFundingRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  // Sidebar state
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle navigation from external pages (like Portfolio)
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Comparison state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refs for scrolling to sections
  const browseIdeasRef = useRef(null);
  const interestedIdeasRef = useRef(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const ideasData = await investorAPI.getAllIdeas();
      const interestedData = await investorAPI.getInterestedIdeas();
      const fundingData = await fundingAPI.getAllFundingRequests();

      // Ensure arrays
      const ideasArray = Array.isArray(ideasData) ? ideasData : [];
      const interestedArray = Array.isArray(interestedData) ? interestedData : [];
      const fundingArray = Array.isArray(fundingData) ? fundingData : [];

      setIdeas(ideasArray);
      setInterestedIdeas(interestedArray);
      setFundingRequests(fundingArray);
      
    } catch (err) {
      setError("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (ideaId, action) => {
    try {
      setActionLoading((prev) => ({ ...prev, [ideaId]: true }));
      setError(null);

      // Use only investorAPI for consistency
      if (action === "add") {
        await investorAPI.markInterest(ideaId);

        // Update local state instead of reloading all data
        const ideaToAdd = ideas.find((idea) => idea._id === ideaId);
        if (ideaToAdd) {
          setInterestedIdeas((prev) => [...prev, ideaToAdd]);
        }
      } else {
        await investorAPI.removeInterest(ideaId);

        // Update local state instead of reloading all data
        setInterestedIdeas((prev) =>
          prev.filter((idea) => idea._id !== ideaId)
        );
      }

      // Show success message briefly
      const successMessage =
        action === "add"
          ? "Interest marked successfully"
          : "Interest removed successfully";
      // You could add a toast notification here instead of using error state
    } catch (err) {
      // Provide more specific error messages
      let errorMessage = `Failed to ${action} interest`;
      if (err.message.includes("Already marked")) {
        errorMessage = "You have already marked interest in this idea";
      } else if (err.message.includes("not found")) {
        errorMessage = "Idea not found or no longer available";
      } else if (err.message.includes("analyzed")) {
        errorMessage = "Can only show interest in analyzed ideas";
      }

      setError(errorMessage);

      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading((prev) => ({ ...prev, [ideaId]: false }));
    }
  };

  // Comparison handlers
  const handleToggleComparison = (ideaId) => {
    const idea = ideas.find((i) => i._id === ideaId);
    if (!idea) return;

    setSelectedForComparison((prev) => {
      const isSelected = prev.some((selected) => selected._id === ideaId);
      if (isSelected) {
        // Remove from selection
        return prev.filter((selected) => selected._id !== ideaId);
      } else {
        // Add to selection (max 4)
        if (prev.length >= 4) {
          setError("You can compare up to 4 ideas at a time");
          setTimeout(() => setError(null), 3000);
          return prev;
        }
        return [...prev, idea];
      }
    });
  };

  const handleClearComparison = () => {
    setSelectedForComparison([]);
    setComparisonMode(false);
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      setError("Please select at least 2 ideas to compare");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setShowComparisonModal(true);
  };

  const handleSaveComparison = (savedComparison) => {
    // Add to saved comparisons list
    setSavedComparisons((prev) => [savedComparison, ...prev]);
    // Clear selection and exit comparison mode
    setSelectedForComparison([]);
    setComparisonMode(false);
    setShowComparisonModal(false);
  };

  // Scroll to section functions
  const scrollToBrowseIdeas = () => {
    browseIdeasRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToInterestedIdeas = () => {
    interestedIdeasRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Filter and sort ideas
  const getFilteredIdeas = (ideasList) => {
    // Ensure ideasList is an array
    if (!Array.isArray(ideasList) || ideasList.length === 0) {
      return [];
    }

    let filtered = [...ideasList];

    // Search filter - only if searchTerm exists
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((idea) => {
        const matchTitle = idea?.title?.toLowerCase().includes(term);
        const matchDesc = idea?.description?.toLowerCase().includes(term);
        const matchCategory = idea?.category?.toLowerCase().includes(term);
        const matchOwner = idea?.owner?.name?.toLowerCase().includes(term);
        return matchTitle || matchDesc || matchCategory || matchOwner;
      });
    }

    // Category filter - only if not 'all'
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((idea) => idea?.category === categoryFilter);
    }

    // Score filter - ONLY if user has changed from defaults
    const scoreFilterActive = minScore > 0 || maxScore < 100;
    if (scoreFilterActive) {
      filtered = filtered.filter((idea) => {
        const score = idea?.analysis?.score ?? 0;
        return score >= minScore && score <= maxScore;
      });
    }

    // Funding range filter - only if not 'all'
    if (fundingRange && fundingRange !== "all") {
      filtered = filtered.filter((idea) => {
        const fundingNeeded = idea?.fundingNeeded ?? 0;
        switch (fundingRange) {
          case "0-10k":
            return fundingNeeded <= 10000;
          case "10k-50k":
            return fundingNeeded > 10000 && fundingNeeded <= 50000;
          case "50k-100k":
            return fundingNeeded > 50000 && fundingNeeded <= 100000;
          case "100k+":
            return fundingNeeded > 100000;
          default:
            return true;
        }
      });
    }

    // Status filter - only if not 'all'
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((idea) => {
        switch (statusFilter) {
          case "new":
            return !idea?.analysis;
          case "analyzed":
            return !!idea?.analysis;
          case "funded":
            return idea?.fundingNeeded && idea.fundingNeeded > 0;
          default:
            return true;
        }
      });
    }

    // Tags filter - only if tags selected
    if (selectedTags && selectedTags.length > 0) {
      filtered = filtered.filter((idea) => {
        const hasTags = selectedTags.some((tag) => {
          const inTags = idea?.tags?.includes(tag);
          const inTitle = idea?.title?.toLowerCase().includes(tag.toLowerCase());
          const inDesc = idea?.description?.toLowerCase().includes(tag.toLowerCase());
          return inTags || inTitle || inDesc;
        });
        return hasTags;
      });
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
      });
    } else if (sortBy === "score") {
      filtered.sort((a, b) => {
        const scoreA = a?.analysis?.score ?? 0;
        const scoreB = b?.analysis?.score ?? 0;
        return scoreB - scoreA;
      });
    }
    
    return filtered;
  };

  // Get unique categories
  const getCategories = () => {
    if (!Array.isArray(ideas)) return [];
    const categories = [...new Set(ideas.filter(idea => idea?.category).map((idea) => idea.category))];
    return categories.sort();
  };

  // Calculate dashboard metrics
  const totalInvestments = interestedIdeas.length;
  const availableIdeas = ideas.length;

  const dashboardCards = [
    {
      title: "Total Interests",
      description: "Ideas you've shown interest in",
      icon: <FaHeart />,
      count: totalInvestments.toString(),
      color: "text-white",
      onClick: () => setActiveSection("my-interests"),
    },
    {
      title: "Available Ideas",
      description: "Browse innovative startup ideas seeking funding",
      icon: <FaLightbulb />,
      count: availableIdeas.toString(),
      color: "text-white",
      onClick: () => setActiveSection("browse-ideas"),
    },
    {
      title: "New This Week",
      description: "New notifications requiring your attention",
      icon: <FaBell />,
      count: unreadCount.toString(),
      color: "text-white",
      onClick: () => setActiveSection("notifications"),
    },
  ];

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Welcome Section */}
            <InvestorWelcomeSection
              availableIdeas={availableIdeas}
              totalInvestments={totalInvestments}
            />

            {/* Dashboard Cards Grid */}
            <InvestorDashboardCards dashboardCards={dashboardCards} />

            {/* Error Message */}
            <ErrorMessage
              error={error}
              onRetry={loadDashboardData}
              onDismiss={() => setError(null)}
            />
          </>
        );

      case "browse-ideas":
        const filteredIdeasList = getFilteredIdeas(ideas);
        
        return (
          <>
            <IdeasSection
              title="Browse Ideas"
              ideas={ideas}
              filteredIdeas={filteredIdeasList}
              interestedIdeas={interestedIdeas}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={getCategories()}
              onInterest={handleInterest}
              actionLoading={actionLoading}
              showFilters={true}
              showAdvancedFilters={true}
              // Advanced filter props
              minScore={minScore}
              setMinScore={setMinScore}
              maxScore={maxScore}
              setMaxScore={setMaxScore}
              fundingRange={fundingRange}
              setFundingRange={setFundingRange}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              // Comparison props
              comparisonMode={comparisonMode}
              setComparisonMode={setComparisonMode}
              selectedForComparison={selectedForComparison}
              onToggleComparison={handleToggleComparison}
              emptyStateType="search"
              emptyStateAction={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setMinScore(0);
                setMaxScore(100);
                setFundingRange("all");
                setStatusFilter("all");
                setSelectedTags([]);
              }}
              emptyStateActionText="Clear Filters"
              sectionRef={browseIdeasRef}
            />
          </>
        );

      case "my-interests":
        return (
          <IdeasSection
            title="My Interested Ideas"
            ideas={interestedIdeas}
            filteredIdeas={interestedIdeas}
            interestedIdeas={interestedIdeas}
            onInterest={handleInterest}
            actionLoading={actionLoading}
            showFilters={false}
            emptyStateType="interested"
            emptyStateAction={scrollToBrowseIdeas}
            emptyStateActionText="Browse Ideas"
            sectionRef={interestedIdeasRef}
          />
        );

      case "comparisons":
        return <SavedComparisonsSection />;

      case "market-research":
        return <MarketResearchSection />;

      case "deals":
        return <InvestorDealsPage />;

      case "portfolio":
        return <PortfolioSection />;

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
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
        );

      case "settings":
        return <SettingsSection />;

      case "feedback":
        return <InvestorFeedbackPage />;

      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Coming Soon
              </h2>
              <p className="text-white/60">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Sidebar */}
      <InvestorSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Header */}
        <InvestorDashboardHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
          {renderSectionContent()}
        </div>
      </div>

      {/* Comparison Bar */}
      {comparisonMode && (
        <ComparisonBar
          selectedIdeas={selectedForComparison}
          onRemove={handleToggleComparison}
          onCompare={handleCompare}
          onClearAll={handleClearComparison}
        />
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        ideas={selectedForComparison}
        onSave={handleSaveComparison}
      />
    </div>
  );
};

export default InvestorDashboard;
