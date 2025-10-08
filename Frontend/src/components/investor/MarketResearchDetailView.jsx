import React from "react";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaBook,
  FaTag,
  FaChartLine,
  FaTrophy,
  FaExclamationTriangle,
  FaFileAlt,
  FaCalendar,
  FaLightbulb,
} from "react-icons/fa";

const MarketResearchDetailView = ({
  isOpen,
  onClose,
  research,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !research) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const Section = ({ title, icon, content, bgColor = "from-white/[0.06]" }) => {
    if (!content) return null;

    return (
      <div
        className={`bg-gradient-to-br ${bgColor} to-white/[0.02] border-2 border-white/20 rounded-2xl p-6 backdrop-blur-sm`}
      >
        <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="text-white/80 font-manrope whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-12 xl:inset-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-indigo-500/[0.08] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 lg:p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FaBook className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-manrope mb-2">
                {research.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <FaTag className="w-4 h-4 text-blue-400" />
                  <span className="font-manrope font-medium">
                    {research.sector}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <FaCalendar className="w-4 h-4" />
                  <span className="font-manrope">
                    Created: {formatDate(research.createdAt)}
                  </span>
                </div>
                {research.updatedAt &&
                  research.updatedAt !== research.createdAt && (
                    <div className="flex items-center gap-2 text-white/60">
                      <span className="font-manrope">
                        Updated: {formatDate(research.updatedAt)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onEdit}
              className="p-3 text-yellow-300 hover:text-yellow-100 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all duration-300 hover:scale-110 border border-yellow-400/30"
              title="Edit"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this research note?"
                  )
                ) {
                  onDelete();
                }
              }}
              className="p-3 text-red-300 hover:text-red-100 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-300 hover:scale-110 border border-red-400/30"
              title="Delete"
            >
              <FaTrash className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 border border-white/10"
              title="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar">
          {/* Tags */}
          {research.tags && research.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {research.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-400/30 flex items-center gap-2"
                >
                  <FaTag className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300 text-sm font-manrope font-medium">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Market Size */}
          <Section
            title="Market Size"
            icon={<FaChartLine className="w-5 h-5 text-blue-400" />}
            content={research.marketSize}
          />

          {/* Trends */}
          <Section
            title="Trends & Insights"
            icon={<FaChartLine className="w-5 h-5 text-purple-400" />}
            content={research.trends}
            bgColor="from-purple-500/[0.08]"
          />

          {/* Competitors */}
          <Section
            title="Competitors & Landscape"
            icon={<FaChartLine className="w-5 h-5 text-indigo-400" />}
            content={research.competitors}
            bgColor="from-indigo-500/[0.08]"
          />

          {/* Opportunities & Threats Grid */}
          {(research.opportunities || research.threats) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opportunities */}
              {research.opportunities && (
                <div className="bg-gradient-to-br from-green-500/[0.08] to-emerald-500/[0.04] border-2 border-green-400/20 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
                    <FaTrophy className="w-5 h-5 text-green-400" />
                    Opportunities
                  </h3>
                  <div className="text-white/80 font-manrope whitespace-pre-wrap leading-relaxed">
                    {research.opportunities}
                  </div>
                </div>
              )}

              {/* Threats */}
              {research.threats && (
                <div className="bg-gradient-to-br from-red-500/[0.08] to-orange-500/[0.04] border-2 border-red-400/20 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
                    <FaExclamationTriangle className="w-5 h-5 text-red-400" />
                    Threats & Risks
                  </h3>
                  <div className="text-white/80 font-manrope whitespace-pre-wrap leading-relaxed">
                    {research.threats}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sources */}
          <Section
            title="Sources & References"
            icon={<FaFileAlt className="w-5 h-5 text-yellow-400" />}
            content={research.sources}
            bgColor="from-yellow-500/[0.08]"
          />

          {/* General Notes */}
          <Section
            title="General Notes"
            icon={<FaFileAlt className="w-5 h-5 text-gray-400" />}
            content={research.notes}
          />

          {/* Related Ideas */}
          {research.relatedIdeas && research.relatedIdeas.length > 0 && (
            <div className="bg-gradient-to-br from-green-500/[0.06] to-emerald-500/[0.02] border-2 border-green-400/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 font-manrope flex items-center gap-2">
                <FaLightbulb className="w-5 h-5 text-green-400" />
                Related Ideas ({research.relatedIdeas.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {research.relatedIdeas.map((idea) => (
                  <div
                    key={idea._id}
                    className="bg-white/[0.05] border border-green-400/30 rounded-xl p-4 hover:bg-white/[0.08] hover:border-green-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500/20 p-2 rounded-lg border border-green-400/30">
                        <FaLightbulb className="w-3 h-3 text-green-400" />
                      </div>
                      <h4 className="text-white font-manrope font-bold text-sm flex-1 line-clamp-1">
                        {idea.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <FaTag className="w-3 h-3 text-green-400" />
                      <span className="font-manrope">{idea.category}</span>
                    </div>
                    {idea.owner && (
                      <div className="text-white/50 text-xs font-manrope mt-2">
                        by {idea.owner.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between p-6 border-t border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent backdrop-blur-sm">
          <p className="text-white/60 text-sm font-manrope">
            Viewing market research note
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-manrope font-semibold flex items-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 border border-yellow-400/30"
            >
              <FaEdit className="w-4 h-4" />
              Edit Note
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-xl transition-all duration-300 font-manrope font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearchDetailView;
