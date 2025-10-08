import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSave,
  FaBook,
  FaTag,
  FaChartLine,
  FaTrophy,
  FaExclamationTriangle,
  FaFileAlt,
  FaLightbulb,
  FaSpinner,
} from "react-icons/fa";

const MarketResearchModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    sector: "",
    marketSize: "",
    trends: "",
    competitors: "",
    opportunities: "",
    threats: "",
    sources: "",
    notes: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        sector: initialData.sector || "",
        marketSize: initialData.marketSize || "",
        trends: initialData.trends || "",
        competitors: initialData.competitors || "",
        opportunities: initialData.opportunities || "",
        threats: initialData.threats || "",
        sources: initialData.sources || "",
        notes: initialData.notes || "",
        tags: initialData.tags || [],
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.sector.trim()) {
      setError("Title and sector are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Error saving research note:", err);
      setError(err.message || "Failed to save research note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-indigo-500/[0.08] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 lg:p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FaBook className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-manrope bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {isEditing ? "Edit" : "New"} Market Research Note
              </h2>
              <p className="text-white/60 text-sm font-manrope mt-1">
                Document your market analysis and insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-white/70 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-110 border border-white/10 hover:border-red-500/30"
            title="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/40 rounded-xl p-4 text-red-300 font-manrope animate-shake backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                {error}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></div>
              Basic Information
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., FinTech Market Analysis Q4 2025"
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope"
                />
              </div>

              {/* Sector */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Sector / Industry <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  placeholder="e.g., FinTech, Healthcare, E-commerce"
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tags (press Enter)"
                    className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300 font-manrope font-medium text-sm border border-blue-400/30"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-400/30 flex items-center gap-2"
                      >
                        <FaTag className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-300 text-sm font-manrope">
                          {tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400/60 hover:text-red-400 transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
              <FaChartLine className="w-5 h-5 text-blue-400" />
              Market Analysis
            </h3>

            <div className="space-y-4">
              {/* Market Size */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Market Size
                </label>
                <textarea
                  name="marketSize"
                  value={formData.marketSize}
                  onChange={handleChange}
                  placeholder="Total addressable market, growth rate, projections..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope resize-none"
                ></textarea>
              </div>

              {/* Trends */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Trends & Insights
                </label>
                <textarea
                  name="trends"
                  value={formData.trends}
                  onChange={handleChange}
                  placeholder="Emerging trends, market dynamics, consumer behavior..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope resize-none"
                ></textarea>
              </div>

              {/* Competitors */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Competitors & Landscape
                </label>
                <textarea
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleChange}
                  placeholder="Key players, market share, competitive positioning..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* SWOT-like Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Opportunities */}
            <div className="bg-gradient-to-br from-green-500/[0.08] to-emerald-500/[0.04] border-2 border-green-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 font-manrope flex items-center gap-2">
                <FaTrophy className="w-5 h-5 text-green-400" />
                Opportunities
              </h3>
              <textarea
                name="opportunities"
                value={formData.opportunities}
                onChange={handleChange}
                placeholder="Growth areas, untapped markets, investment opportunities..."
                rows={5}
                className="w-full px-4 py-3 bg-white/[0.03] border border-green-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 font-manrope resize-none"
              ></textarea>
            </div>

            {/* Threats */}
            <div className="bg-gradient-to-br from-red-500/[0.08] to-orange-500/[0.04] border-2 border-red-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 font-manrope flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5 text-red-400" />
                Threats & Risks
              </h3>
              <textarea
                name="threats"
                value={formData.threats}
                onChange={handleChange}
                placeholder="Market risks, regulatory challenges, potential obstacles..."
                rows={5}
                className="w-full px-4 py-3 bg-white/[0.03] border border-red-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 font-manrope resize-none"
              ></textarea>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-2 border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
              <FaFileAlt className="w-5 h-5 text-blue-400" />
              Additional Information
            </h3>

            <div className="space-y-4">
              {/* Sources */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  Sources & References
                </label>
                <textarea
                  name="sources"
                  value={formData.sources}
                  onChange={handleChange}
                  placeholder="Research papers, articles, reports, URLs..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope resize-none"
                ></textarea>
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-white/80 font-manrope font-semibold mb-2">
                  General Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional observations, key takeaways, action items..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-manrope resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between p-6 border-t border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent backdrop-blur-sm">
          <p className="text-white/60 text-sm font-manrope">
            <span className="text-red-400">*</span> Required fields
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-xl transition-all duration-300 font-manrope font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-manrope font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 border border-green-400/30"
            >
              {saving ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {isEditing ? "Update" : "Create"} Research Note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearchModal;
