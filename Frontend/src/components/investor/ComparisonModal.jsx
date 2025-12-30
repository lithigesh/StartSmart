import React, { useState } from "react";
import {
  FaTimes,
  FaSave,
  FaDownload,
  FaStar,
  FaUser,
  FaTag,
  FaCalendar,
  FaDollarSign,
  FaEye,
  FaHeart,
  FaTrophy,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import { investorAPI } from "../../services/api";
import IdeaComparisonCharts from "../charts/IdeaComparisonCharts";

const ComparisonModal = ({
  isOpen,
  onClose,
  ideas = [],
  onSave,
  readOnly = false,
  editMode = false,
  comparisonId = null,
  initialData = {},
}) => {
  const [notes, setNotes] = useState(initialData.notes || "");
  const [rationale, setRationale] = useState(initialData.rationale || "");
  const [chosenLeader, setChosenLeader] = useState(
    initialData.chosenLeader || ""
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isEditing, setIsEditing] = useState(editMode);

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData.notes !== undefined) setNotes(initialData.notes);
    if (initialData.rationale !== undefined)
      setRationale(initialData.rationale);
    if (initialData.chosenLeader !== undefined)
      setChosenLeader(initialData.chosenLeader);
  }, [initialData]);

  if (!isOpen || ideas.length < 2) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);

      if ((editMode || isEditing) && comparisonId) {
        // Update existing comparison (only notes, rationale, chosenLeader)
        const updates = {
          notes: notes,
          rationale: rationale,
          chosenLeader: chosenLeader || null,
        };

        const result = await investorAPI.comparisons.update(
          comparisonId,
          updates
        );

        if (onSave) {
          onSave(result.comparison);
        }

        onClose();
      } else {
        // Create new comparison
        const comparisonData = {
          ideas: ideas.map((idea) => idea._id),
          chosenLeader: chosenLeader || null,
          notes: notes,
          rationale: rationale,
        };

        const result = await investorAPI.comparisons.create(comparisonData);

        if (onSave) {
          onSave(result.comparison);
        }

        // Reset form
        setNotes("");
        setRationale("");
        setChosenLeader("");
        onClose();
      }
    } catch (error) {
      console.error("Error saving comparison:", error);
      setSaveError(error.message || "Failed to save comparison");
    } finally {
      setSaving(false);
    }
  };

  const comparisonMetrics = [
    { key: "title", label: "Title", icon: <FaTag /> },
    { key: "category", label: "Category", icon: <FaTag /> },
    {
      key: "owner",
      label: "Owner",
      icon: <FaUser />,
      transform: (idea) => idea.owner?.name || "Anonymous",
    },
    {
      key: "analysis",
      label: "AI Score",
      icon: <FaStar />,
      transform: (idea) =>
        idea.analysis?.score ? `${idea.analysis.score}%` : "N/A",
    },
    {
      key: "fundingRequirements",
      label: "Funding Required",
      icon: <FaDollarSign />,
      transform: (idea) => idea.fundingRequirements || "Not specified",
    },
    {
      key: "targetAudience",
      label: "Target Audience",
      icon: <FaUser />,
      transform: (idea) => idea.targetAudience || "N/A",
    },
    {
      key: "createdAt",
      label: "Created",
      icon: <FaCalendar />,
      transform: (idea) => formatDate(idea.createdAt),
    },
    {
      key: "marketSize",
      label: "Market Size",
      icon: <FaChartLine />,
      transform: (idea) => idea.marketSize || "Not specified",
    },
  ];

  const detailedMetrics = [
    { key: "elevatorPitch", label: "Elevator Pitch" },
    { key: "problemStatement", label: "Problem Statement" },
    { key: "solution", label: "Solution" },
    { key: "revenueStreams", label: "Revenue Streams" },
    { key: "competitors", label: "Competitors" },
    { key: "scalabilityPlan", label: "Scalability Plan" },
    { key: "pricingStrategy", label: "Pricing Strategy" },
    { key: "goToMarketStrategy", label: "Go-to-Market Strategy" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-12 xl:inset-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.08] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(52,211,153,0.1),transparent_50%)] pointer-events-none"></div>

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-3xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-white/20 to-white/20 blur-xl animate-border-glow"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 lg:p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10/30 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-white to-white p-3 rounded-xl shadow-lg">
                <FaChartLine className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-manrope bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                {editMode ? "View & Edit Comparison" : "Compare Ideas"}
              </h2>
              <p className="text-white/60 text-sm font-manrope mt-1">
                {editMode
                  ? "View details and update notes, rationale, or chosen leader"
                  : `Analyzing ${ideas.length} startup ideas side-by-side`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-3 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 border border-white/10 hover:border-white/30"
              title="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar">
          {/* Error Message */}
          {saveError && (
            <div className="bg-gradient-to-r from-white/20 to-white/20 border-2 border-white/40 rounded-xl p-4 text-white/80 font-manrope animate-shake backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {saveError}
              </div>
            </div>
          )}

          {/* Ideas Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ideas.map((idea, index) => (
              <div
                key={idea._id}
                className="group bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/20 rounded-xl p-5 hover:from-white/[0.12] hover:to-white/[0.06] hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-white/10/20 p-2 rounded-lg border border-white/30">
                      <FaTag className="w-4 h-4 text-white/90" />
                    </div>
                    {idea.analysis?.score && (
                      <div className="bg-gradient-to-r from-white/20 to-white/20 px-2 py-1 rounded-lg border border-white/30">
                        <span className="text-white/70 text-xs font-bold font-manrope">
                          {idea.analysis.score}%
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-manrope font-bold text-base mb-2 line-clamp-2 group-hover:text-white/90 transition-colors">
                    {idea.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <FaTag className="w-3 h-3 text-white/90" />
                      <span className="font-manrope">{idea.category}</span>
                    </div>
                    {idea.analysis?.score && (
                      <div className="flex items-center gap-2">
                        <FaStar className="w-3 h-3 text-white/70" />
                        <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-white to-white h-full rounded-full transition-all duration-500"
                            style={{ width: `${idea.analysis.score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="bg-gradient-to-r from-white/10 to-white/10 px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-white to-white rounded-full"></div>
                Key Metrics Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white/20 bg-gradient-to-r from-white/[0.08] to-white/[0.04]">
                    <th className="text-left p-5 text-white/90 font-manrope font-bold sticky left-0 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-xl z-10 border-r border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Metric
                      </div>
                    </th>
                    {ideas.map((idea, index) => (
                      <th
                        key={idea._id}
                        className="text-left p-5 text-white font-manrope font-bold min-w-[220px] border-r border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-br from-white/20 to-white/20 px-2 py-1 rounded text-xs font-mono border border-white/30">
                            #{index + 1}
                          </span>
                          <div className="line-clamp-1">{idea.title}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric, metricIndex) => (
                    <tr
                      key={metric.key}
                      className="border-b border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent transition-all duration-300 group"
                    >
                      <td className="p-5 text-white/80 font-manrope font-semibold sticky left-0 bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-xl z-10 border-r border-white/10 group-hover:from-black/95 group-hover:to-black/80">
                        <div className="flex items-center gap-3">
                          <div className="text-white/90 bg-white/10/10 p-2 rounded-lg border border-white/20">
                            {metric.icon}
                          </div>
                          <span>{metric.label}</span>
                        </div>
                      </td>
                      {ideas.map((idea) => (
                        <td
                          key={idea._id}
                          className="p-5 text-white/90 font-manrope font-medium border-r border-white/5"
                        >
                          <div className="flex items-center gap-2">
                            {metric.transform
                              ? metric.transform(idea)
                              : idea[metric.key] || "N/A"}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="bg-gradient-to-r from-white/10 to-white/10 px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-white to-white rounded-full"></div>
                Detailed Information
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white/20 bg-gradient-to-r from-white/[0.08] to-white/[0.04]">
                    <th className="text-left p-5 text-white/90 font-manrope font-bold sticky left-0 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-xl z-10 border-r border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Detail
                      </div>
                    </th>
                    {ideas.map((idea, index) => (
                      <th
                        key={idea._id}
                        className="text-left p-5 text-white font-manrope font-bold min-w-[280px] border-r border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-br from-white/20 to-white/20 px-2 py-1 rounded text-xs font-mono border border-white/30">
                            #{index + 1}
                          </span>
                          <div className="line-clamp-1">{idea.title}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailedMetrics.map((metric, metricIndex) => (
                    <tr
                      key={metric.key}
                      className="border-b border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent transition-all duration-300 group"
                    >
                      <td className="p-5 text-white/80 font-manrope font-semibold sticky left-0 bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-xl z-10 border-r border-white/10 group-hover:from-black/95 group-hover:to-black/80 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white/60 rounded-full flex-shrink-0"></div>
                          <span>{metric.label}</span>
                        </div>
                      </td>
                      {ideas.map((idea) => (
                        <td
                          key={idea._id}
                          className="p-5 text-white/90 font-manrope border-r border-white/5 align-top"
                        >
                          <div className="text-sm leading-relaxed">
                            {metric.transform
                              ? metric.transform(idea)
                              : idea[metric.key] || "N/A"}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Comparison Charts */}
          <IdeaComparisonCharts
            ideas={ideas}
            loading={false}
            comparisonData={{
              notes,
              rationale,
              chosenLeader,
            }}
          />

          {/* Notes Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Choose Leader */}
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaTrophy className="w-5 h-5 text-white/80" />
                <h3 className="text-xl font-semibold text-white font-manrope">
                  Choose Leader
                </h3>
              </div>
              <select
                value={chosenLeader}
                onChange={(e) => setChosenLeader(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope"
              >
                <option value="" className="bg-gray-800">
                  Select the best idea...
                </option>
                {ideas.map((idea) => (
                  <option
                    key={idea._id}
                    value={idea._id}
                    className="bg-gray-800"
                  >
                    {idea.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Rationale */}
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 font-manrope">
                Rationale
              </h3>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Why did you choose this idea as the leader?"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope resize-none"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* General Notes */}
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 font-manrope">
              Comparison Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your general notes about this comparison..."
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-manrope resize-none"
              rows={4}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between p-6 border-t border-white/10">
          <p className="text-white/60 text-sm font-manrope">
            {editMode
              ? "View and edit comparison details"
              : `Comparing ${ideas.length} ideas • Scroll for more details`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-lg transition-all duration-300 font-manrope font-medium"
            >
              {editMode ? "Close" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-all duration-300 font-manrope font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {editMode ? "Update" : "Save"} Comparison
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
