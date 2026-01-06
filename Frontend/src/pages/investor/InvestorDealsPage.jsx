import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaEye,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaDollarSign,
} from "react-icons/fa";
import DealCard from "../../components/investor/DealCard";
import InvestorFundingRequestModal from "../../components/investor/InvestorFundingRequestModal";
import LoadingSpinner from "../../components/LoadingSpinner";

import { investorDealAPI } from "../../services/api";
import { useNotifications } from "../../hooks/useNotifications";

/**
 * InvestorDealsPage Component
 * Main deal management page for investors with pipeline view
 */
const InvestorDealsPage = () => {
  const [pipeline, setPipeline] = useState({
    new: [],
    viewed: [],
    negotiating: [],
    accepted: [],
    declined: [],
  });
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    viewed: 0,
    negotiating: 0,
    accepted: 0,
    declined: 0,
    totalInvested: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fundingStageFilter, setFundingStageFilter] = useState("all");
  const [investmentTypeFilter, setInvestmentTypeFilter] = useState("all");
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    setIsLoading(true);
    try {
      // Load both pipeline and all available requests in parallel
      const [pipelineResponse, allRequestsResponse] = await Promise.all([
        investorDealAPI.getInvestorPipeline().catch((err) => {
          console.error("Pipeline API error:", err);
          return { success: false, error: err.message };
        }),
        investorDealAPI
          .getAllFundingRequests({
            status: "pending",
            limit: 100,
          })
          .catch((err) => {
            console.error("All requests API error:", err);
            return { success: false, error: err.message };
          }),
      ]);

      // Check if both API calls failed
      if (!pipelineResponse.success && !allRequestsResponse.success) {
        throw new Error(
          "Failed to load deal data. Please check your connection and try again."
        );
      }

      let finalPipeline = {
        new: [],
        viewed: [],
        negotiating: [],
        accepted: [],
        declined: [],
      };

      let finalStats = {
        total: 0,
        new: 0,
        viewed: 0,
        negotiating: 0,
        accepted: 0,
        declined: 0,
        totalInvested: 0,
      };

      // If pipeline loaded successfully, use it as base
      if (pipelineResponse.success) {
        finalPipeline = pipelineResponse.data;
        finalStats = pipelineResponse.stats || {
          total: 0,
          new: 0,
          viewed: 0,
          negotiating: 0,
          accepted: 0,
          declined: 0,
          totalInvested: 0,
        };

        console.log("Pipeline Response:", {
          stats: pipelineResponse.stats,
          acceptedCount: finalPipeline.accepted?.length,
          acceptedDeals: finalPipeline.accepted?.map((d) => ({
            id: d._id,
            amount: d.amount,
            finalAmount: d.acceptanceTerms?.finalAmount,
          })),
        });

        // Calculate total invested from accepted deals if not provided or is 0
        if (!finalStats.totalInvested || finalStats.totalInvested === 0) {
          finalStats.totalInvested = (finalPipeline.accepted || []).reduce(
            (total, deal) => {
              const amount =
                deal.acceptanceTerms?.finalAmount || deal.amount || 0;
              return total + amount;
            },
            0
          );
          console.log("Recalculated totalInvested:", finalStats.totalInvested);
        }
      } else {
        console.warn("Pipeline API failed, showing available requests only");
        addNotification("Some deal data may be incomplete", "warning");
      }

      // Add unviewed pending requests to "new" column
      if (allRequestsResponse.success && allRequestsResponse.data) {
        const allRequests = allRequestsResponse.data;
        const viewedIds = new Set([
          ...(finalPipeline.new || []).map((r) => r._id),
          ...(finalPipeline.viewed || []).map((r) => r._id),
          ...(finalPipeline.negotiating || []).map((r) => r._id),
          ...(finalPipeline.accepted || []).map((r) => r._id),
          ...(finalPipeline.declined || []).map((r) => r._id),
        ]);

        // Add truly new requests (pending and not in any pipeline stage)
        const newRequests = allRequests.filter(
          (req) => req.status === "pending" && !viewedIds.has(req._id)
        );

        finalPipeline.new = [...newRequests, ...finalPipeline.new];
        finalStats.new = finalPipeline.new.length;
        finalStats.total =
          finalPipeline.new.length +
          finalPipeline.viewed.length +
          finalPipeline.negotiating.length +
          finalPipeline.accepted.length +
          finalPipeline.declined.length;
      } else if (!pipelineResponse.success) {
        // Both failed
        console.warn("All requests API also failed");
      }

      setPipeline(finalPipeline);
      setStats(finalStats);
    } catch (error) {
      console.error("Error loading pipeline:", error);
      addNotification(error.message || "Error loading deal pipeline", "error");

      // Set empty state so user knows something went wrong
      setPipeline({
        new: [],
        viewed: [],
        negotiating: [],
        accepted: [],
        declined: [],
      });
      setStats({
        total: 0,
        new: 0,
        viewed: 0,
        negotiating: 0,
        accepted: 0,
        declined: 0,
        totalInvested: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    loadPipeline(); // Refresh pipeline after modal close
  };

  const filterRequests = (requests) => {
    return requests.filter((req) => {
      const matchesSearch =
        req.idea?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.entrepreneur?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStage =
        fundingStageFilter === "all" || req.fundingStage === fundingStageFilter;

      const matchesType =
        investmentTypeFilter === "all" ||
        req.investmentType === investmentTypeFilter;

      return matchesSearch && matchesStage && matchesType;
    });
  };

  const columns = [
    {
      id: "new",
      title: "New Requests",
      icon: FaClock,
      color: "blue",
      count: stats.new,
    },
    {
      id: "viewed",
      title: "Under Review",
      icon: FaEye,
      color: "purple",
      count: stats.viewed,
    },
    {
      id: "negotiating",
      title: "In Negotiation",
      icon: FaComments,
      color: "yellow",
      count: stats.negotiating,
    },
    {
      id: "accepted",
      title: "Accepted",
      icon: FaCheckCircle,
      color: "green",
      count: stats.accepted,
    },
    {
      id: "declined",
      title: "Declined",
      icon: FaTimesCircle,
      color: "red",
      count: stats.declined,
    },
  ];

  const getColumnColor = (color) => {
    const colors = {
      blue: "border-white/10 bg-white/[0.03] backdrop-blur-xl",
      purple: "border-white/10 bg-white/[0.03] backdrop-blur-xl",
      yellow: "border-white/10 bg-white/[0.03] backdrop-blur-xl",
      green: "border-white/10 bg-white/[0.03] backdrop-blur-xl",
      red: "border-white/10 bg-white/[0.03] backdrop-blur-xl",
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Loading your deal pipeline..."
        containerClassName="min-h-screen bg-black flex items-center justify-center text-white"
      />
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaBriefcase className="text-white/90" />
              Deal Management
            </h1>
            <p className="text-white/60 mt-2">
              Manage your investment pipeline and opportunities
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            label="Total Deals"
            value={stats.total}
            icon={FaBriefcase}
            color="blue"
          />
          <StatsCard
            label="Active Negotiations"
            value={stats.negotiating}
            icon={FaComments}
            color="yellow"
          />
          <StatsCard
            label="Investments Made"
            value={stats.accepted}
            icon={FaCheckCircle}
            color="green"
          />
          <StatsCard
            label="Total Invested"
            value={
              stats.totalInvested >= 1000000
                ? `$${(stats.totalInvested / 1000000).toFixed(1)}M`
                : stats.totalInvested >= 1000
                ? `$${(stats.totalInvested / 1000).toFixed(0)}K`
                : `$${stats.totalInvested.toFixed(0)}`
            }
            icon={FaDollarSign}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search by idea or entrepreneur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/20"
              />
            </div>
          </div>

          <select
            value={fundingStageFilter}
            onChange={(e) => setFundingStageFilter(e.target.value)}
            className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/30 focus:border-white/20"
          >
            <option value="all">All Stages</option>
            <option value="seed">Seed</option>
            <option value="series_a">Series A</option>
            <option value="series_b">Series B</option>
            <option value="series_c">Series C</option>
            <option value="bridge">Bridge</option>
            <option value="other">Other</option>
          </select>

          <select
            value={investmentTypeFilter}
            onChange={(e) => setInvestmentTypeFilter(e.target.value)}
            className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/30 focus:border-white/20"
          >
            <option value="all">All Types</option>
            <option value="equity">Equity</option>
            <option value="convertible_note">Convertible Note</option>
            <option value="safe">SAFE</option>
            <option value="revenue_share">Revenue Share</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Pipeline Board - Vertical Layout */}
      <div className="space-y-4">
        {columns.map((column) => {
          const filteredRequests = filterRequests(pipeline[column.id] || []);

          return (
            <div key={column.id} className="w-full">
              {/* Column Header */}
              <div
                className={`border rounded-t-2xl p-4 ${getColumnColor(
                  column.color
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <column.icon className="w-5 h-5 text-white/80" />
                    <h3 className="font-semibold text-white">{column.title}</h3>
                  </div>
                  <span className="px-2 py-1 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-medium text-white">
                    {column.count}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="bg-white/[0.03] backdrop-blur-xl border-x border-b border-white/10 rounded-b-2xl p-3">
                {filteredRequests.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-white/50 text-sm">
                    No deals in this stage
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredRequests.map((request) => (
                      <DealCard
                        key={request._id}
                        request={request}
                        onClick={() => handleCardClick(request)}
                        stage={column.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Funding Request Modal */}
      {showModal && selectedRequest && (
        <InvestorFundingRequestModal
          isOpen={showModal}
          onClose={handleCloseModal}
          request={selectedRequest}
          onRequestUpdate={loadPipeline}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ label, value, icon: Icon, color }) => {
  const iconColorClasses = {
    blue: "text-white/90",
    yellow: "text-white/70",
    green: "text-white/90",
    purple: "text-white/90",
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/70">{label}</p>
        <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
      </div>
      <p className={`text-2xl font-bold ${iconColorClasses[color]}`}>{value}</p>
    </div>
  );
};

export default InvestorDealsPage;
