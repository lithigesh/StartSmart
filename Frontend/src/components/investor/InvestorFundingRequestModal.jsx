import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSpinner,
  FaDollarSign,
  FaPercentage,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaHandshake,
  FaFileAlt,
  FaChartLine,
  FaUsers,
  FaComments,
  FaEye,
} from "react-icons/fa";
import NegotiationChat from "./NegotiationChat";
import DealAcceptanceModal from "./DealAcceptanceModal";
import { investorDealAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";

/**
 * InvestorFundingRequestModal Component
 * Comprehensive funding request details for investors
 */
const InvestorFundingRequestModal = ({
  isOpen,
  onClose,
  request: initialRequest,
  onRequestUpdate,
}) => {
  const [request, setRequest] = useState(initialRequest);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isOpen && initialRequest) {
      setRequest(initialRequest);
      markAsViewed();
    }
  }, [isOpen, initialRequest]);

  const markAsViewed = async () => {
    try {
      await investorDealAPI.markAsViewed(initialRequest._id);
    } catch (error) {
      console.error("Error marking as viewed:", error);
    }
  };

  const handleNegotiate = async (negotiationData) => {
    try {
      const response = await investorDealAPI.negotiateFundingRequest(
        request._id,
        negotiationData
      );

      if (response.success) {
        setRequest(response.data);
        addNotification("Negotiation message sent successfully", "success");
        if (onRequestUpdate) onRequestUpdate();
      } else {
        addNotification(response.message || "Failed to send message", "error");
      }
    } catch (error) {
      addNotification("Error sending negotiation message", "error");
    }
  };

  const handleAccept = async (acceptanceTerms) => {
    setIsResponding(true);
    try {
      const response = await investorDealAPI.respondToFundingRequest(
        request._id,
        {
          responseStatus: "accepted",
          acceptanceTerms,
        }
      );

      if (response.success) {
        addNotification("🎉 Investment deal accepted successfully!", "success");
        setRequest(response.data);
        if (onRequestUpdate) onRequestUpdate();
        setTimeout(() => onClose(), 1500);
      } else {
        addNotification(response.message || "Failed to accept deal", "error");
      }
    } catch (error) {
      addNotification("Error accepting deal", "error");
    } finally {
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    const reason = prompt("Please provide a reason for declining (optional):");

    setIsResponding(true);
    try {
      const response = await investorDealAPI.respondToFundingRequest(
        request._id,
        {
          responseStatus: "declined",
          reason: reason || "",
        }
      );

      if (response.success) {
        addNotification("Funding request declined", "success");
        setRequest(response.data);
        if (onRequestUpdate) onRequestUpdate();
        setTimeout(() => onClose(), 1500);
      } else {
        addNotification(
          response.message || "Failed to decline request",
          "error"
        );
      }
    } catch (error) {
      addNotification("Error declining request", "error");
    } finally {
      setIsResponding(false);
    }
  };

  if (!isOpen || !request) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: FaEye },
    { id: "business", label: "Business Plan", icon: FaFileAlt },
    { id: "financials", label: "Financials", icon: FaChartLine },
    { id: "team", label: "Team", icon: FaUsers },
    { id: "negotiation", label: "Negotiation", icon: FaComments },
  ];

  const calculatedValuation =
    request.valuation ||
    (request.amount && request.equity
      ? Math.round((request.amount / request.equity) * 100)
      : 0);

  const canRespond = ["pending", "negotiated"].includes(request.status);

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {request.idea?.title || "Funding Request Details"}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                By {request.entrepreneur?.name || "Unknown"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700 bg-gray-900/50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-blue-600/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview" && (
              <OverviewTab
                request={request}
                calculatedValuation={calculatedValuation}
              />
            )}
            {activeTab === "business" && <BusinessTab request={request} />}
            {activeTab === "financials" && <FinancialsTab request={request} />}
            {activeTab === "team" && <TeamTab request={request} />}
            {activeTab === "negotiation" && (
              <NegotiationTab
                request={request}
                currentUserId={user?.id}
                onSendMessage={handleNegotiate}
              />
            )}
          </div>

          {/* Footer Actions */}
          {canRespond && (
            <div className="border-t border-gray-700 p-6 bg-gray-900/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAcceptanceModal(true)}
                  disabled={isResponding}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaCheckCircle className="w-5 h-5" />
                  Accept Deal
                </button>
                <button
                  onClick={() => setActiveTab("negotiation")}
                  className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaHandshake className="w-5 h-5" />
                  Negotiate
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isResponding}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaTimesCircle className="w-5 h-5" />
                  Decline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deal Acceptance Modal */}
      {showAcceptanceModal && (
        <DealAcceptanceModal
          isOpen={showAcceptanceModal}
          onClose={() => setShowAcceptanceModal(false)}
          fundingRequest={request}
          onAccept={handleAccept}
        />
      )}
    </>
  );
};

// Overview Tab Component
const OverviewTab = ({ request, calculatedValuation }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        icon={FaDollarSign}
        label="Amount Requested"
        value={`$${request.amount?.toLocaleString() || 0}`}
        color="green"
      />
      <MetricCard
        icon={FaPercentage}
        label="Equity Offered"
        value={`${request.equity || 0}%`}
        color="blue"
      />
      <MetricCard
        icon={FaBuilding}
        label="Valuation"
        value={`$${calculatedValuation?.toLocaleString() || 0}`}
        color="purple"
      />
    </div>

    {/* Idea Details */}
    <Section title="Idea Information">
      <InfoRow label="Title" value={request.idea?.title || "N/A"} />
      <InfoRow label="Category" value={request.idea?.category || "N/A"} />
      <InfoRow label="Stage" value={request.idea?.stage || "N/A"} />
      <InfoRow
        label="Description"
        value={request.idea?.description || "N/A"}
        fullWidth
      />
    </Section>

    {/* Funding Details */}
    <Section title="Funding Details">
      <InfoRow
        label="Funding Stage"
        value={request.fundingStage?.replace("_", " ").toUpperCase() || "SEED"}
      />
      <InfoRow
        label="Investment Type"
        value={
          request.investmentType?.replace("_", " ").toUpperCase() || "EQUITY"
        }
      />
      <InfoRow
        label="Status"
        value={request.status?.toUpperCase() || "PENDING"}
      />
      <InfoRow
        label="Message"
        value={request.message || "No message provided"}
        fullWidth
      />
    </Section>

    {/* Contact Information */}
    <Section title="Entrepreneur Contact">
      <InfoRow label="Name" value={request.entrepreneur?.name || "N/A"} />
      <InfoRow
        label="Email"
        value={request.contactEmail || request.entrepreneur?.email || "N/A"}
      />
      <InfoRow label="Phone" value={request.contactPhone || "N/A"} />
      {request.companyWebsite && (
        <InfoRow label="Website" value={request.companyWebsite} />
      )}
    </Section>
  </div>
);

// Business Tab Component
const BusinessTab = ({ request }) => (
  <div className="space-y-6">
    <Section title="Business Plan">
      <InfoRow
        label="Business Plan"
        value={request.businessPlan || "Not provided"}
        fullWidth
      />
    </Section>

    <Section title="Market & Strategy">
      <InfoRow
        label="Target Market"
        value={request.targetMarket || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Revenue Model"
        value={request.revenueModel || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Competitive Advantage"
        value={request.competitiveAdvantage || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Customer Traction"
        value={request.customerTraction || "Not provided"}
        fullWidth
      />
    </Section>

    <Section title="Intellectual Property">
      <InfoRow
        label="IP Details"
        value={request.intellectualProperty || "Not provided"}
        fullWidth
      />
    </Section>
  </div>
);

// Financials Tab Component
const FinancialsTab = ({ request }) => (
  <div className="space-y-6">
    <Section title="Financial Overview">
      <InfoRow
        label="Current Revenue"
        value={
          request.currentRevenue
            ? `$${request.currentRevenue.toLocaleString()}`
            : "Not disclosed"
        }
      />
      <InfoRow
        label="Previous Funding"
        value={
          request.previousFunding
            ? `$${request.previousFunding.toLocaleString()}`
            : "None"
        }
      />
    </Section>

    <Section title="Projections & Planning">
      <InfoRow
        label="Financial Projections"
        value={request.financialProjections || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Use of Funds"
        value={request.useOfFunds || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Timeline"
        value={request.timeline || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Milestones"
        value={request.milestones || "Not provided"}
        fullWidth
      />
    </Section>

    <Section title="Risk Assessment">
      <InfoRow
        label="Risk Factors"
        value={request.riskFactors || "Not provided"}
        fullWidth
      />
      <InfoRow
        label="Exit Strategy"
        value={request.exitStrategy || "Not provided"}
        fullWidth
      />
    </Section>
  </div>
);

// Team Tab Component
const TeamTab = ({ request }) => (
  <div className="space-y-6">
    <Section title="Team Information">
      <InfoRow
        label="Team Size"
        value={
          request.teamSize ? `${request.teamSize} members` : "Not specified"
        }
      />
      <InfoRow label="Founder" value={request.entrepreneur?.name || "N/A"} />
      <InfoRow label="Email" value={request.contactEmail || "N/A"} />
      <InfoRow label="Phone" value={request.contactPhone || "N/A"} />
      {request.linkedinProfile && (
        <InfoRow label="LinkedIn" value={request.linkedinProfile} />
      )}
    </Section>

    {request.additionalDocuments && (
      <Section title="Additional Documents">
        <InfoRow
          label="Documents"
          value={request.additionalDocuments}
          fullWidth
        />
      </Section>
    )}
  </div>
);

// Negotiation Tab Component
const NegotiationTab = ({ request, currentUserId, onSendMessage }) => (
  <div className="h-[500px]">
    <NegotiationChat
      negotiationHistory={request.negotiationHistory || []}
      onSendMessage={onSendMessage}
      currentUserId={currentUserId}
      isInvestor={true}
      disabled={!["pending", "negotiated"].includes(request.status)}
    />
  </div>
);

// Helper Components
const MetricCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    green:
      "from-green-600/20 to-green-600/5 border-green-500/30 text-green-400",
    blue: "from-blue-600/20 to-blue-600/5 border-blue-500/30 text-blue-400",
    purple:
      "from-purple-600/20 to-purple-600/5 border-purple-500/30 text-purple-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5" />
        <p className="text-sm opacity-80">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className="text-white whitespace-pre-wrap">{value}</p>
  </div>
);

export default InvestorFundingRequestModal;
