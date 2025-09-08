import React, { useState, useEffect, useRef } from "react";
import { investorAPI, fundingAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import {
  InvestorDashboardHeader,
  NotificationsPopup,
  InvestorWelcomeSection,
  InvestorDashboardCards,
  ErrorMessage,
  IdeasSection,
  LoadingSpinner
} from "../components/investor";
import {
  FaChartLine,
  FaLightbulb,
  FaHeart,
  FaBell,
} from "react-icons/fa";

const InvestorDashboard = () => {
  const { unreadCount } = useNotifications();

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
  const [showNotifications, setShowNotifications] = useState(false);

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

      // Load data in parallel - Using only investorAPI for consistency
      const [ideasData, interestedData, fundingData] = await Promise.all([
        investorAPI.getAllIdeas().catch((err) => {
          console.error("Error loading ideas:", err);
          return [];
        }),
        investorAPI.getInterestedIdeas().catch((err) => {
          console.error("Error loading interested ideas:", err);
          return [];
        }),
        fundingAPI.getAllFundingRequests().catch((err) => {
          console.error("Error loading funding requests:", err);
          return [];
        }),
      ]);

      setIdeas(ideasData);
      setInterestedIdeas(interestedData);
      setFundingRequests(fundingData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
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
      } else {
        await investorAPI.removeInterest(ideaId);
      }

      // Reload data to reflect changes
      await loadDashboardData();

      // Show success message briefly
      const successMessage =
        action === "add"
          ? "Interest marked successfully"
          : "Interest removed successfully";
      // You could add a toast notification here instead of using error state
    } catch (err) {
      console.error(`Error ${action}ing interest:`, err);

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
    let filtered = ideasList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (idea.owner?.name &&
            idea.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((idea) => idea.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "score":
        filtered.sort(
          (a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get unique categories
  const getCategories = () => {
    const categories = [...new Set(ideas.map((idea) => idea.category))];
    return categories.sort();
  };

  // Calculate dashboard metrics
  const totalInvestments = interestedIdeas.length;
  const availableIdeas = ideas.length;
  const avgScore =
    ideas.length > 0
      ? (
          ideas.reduce((sum, idea) => sum + (idea.analysis?.score || 0), 0) /
          ideas.length
        ).toFixed(1)
      : "0";

  const dashboardCards = [
    {
      title: "Total Interests",
      description: "Ideas you've shown interest in",
      icon: <FaHeart />,
      count: totalInvestments.toString(),
      color: "text-white",
    },
    {
      title: "Available Ideas",
      description: "Browse innovative startup ideas seeking funding",
      icon: <FaLightbulb />,
      count: availableIdeas.toString(),
      color: "text-white",
    },
    {
      title: "Average Score",
      description: "AI analysis score of available ideas",
      icon: <FaChartLine />,
      count: `${avgScore}%`,
      color: "text-white",
    },
    {
      title: "New This Week",
      description: "New notifications requiring your attention",
      icon: <FaBell />,
      count: unreadCount.toString(),
      color: "text-white",
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <InvestorDashboardHeader 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      {/* Notifications Popup */}
      <NotificationsPopup 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <InvestorWelcomeSection
          availableIdeas={availableIdeas}
          totalInvestments={totalInvestments}
          scrollToBrowseIdeas={scrollToBrowseIdeas}
          scrollToInterestedIdeas={scrollToInterestedIdeas}
        />

        {/* Dashboard Cards Grid */}
        <InvestorDashboardCards dashboardCards={dashboardCards} />

        {/* Error Message */}
        <ErrorMessage
          error={error}
          onRetry={loadDashboardData}
          onDismiss={() => setError(null)}
        />

        {/* Available Ideas Section */}
        <IdeasSection
          title="Available Ideas"
          ideas={ideas}
          filteredIdeas={getFilteredIdeas(ideas)}
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
          emptyStateType="search"
          emptyStateAction={() => {
            setSearchTerm("");
            setCategoryFilter("all");
          }}
          emptyStateActionText="Clear Filters"
          sectionRef={browseIdeasRef}
        />

        {/* My Interested Ideas Section */}
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
      </div>
    </div>
  );
};

export default InvestorDashboard;
