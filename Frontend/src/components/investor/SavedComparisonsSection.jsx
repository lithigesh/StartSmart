import React, { useState, useEffect } from "react";
import {
  FaBalanceScale,
  FaCalendar,
  FaEye,
  FaTrash,
  FaTrophy,
  FaSpinner,
  FaLightbulb,
  FaStickyNote,
  FaEdit,
} from "react-icons/fa";
import { investorAPI } from "../../services/api";
import EmptyState from "../EmptyState";
import LoadingSpinner from "./LoadingSpinner";
import ComparisonModal from "./ComparisonModal";

const SavedComparisonsSection = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await investorAPI.comparisons.getAll();
      setComparisons(result.comparisons || []);
    } catch (err) {
      console.error("Error loading comparisons:", err);
      setError("Failed to load comparisons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (comparisonId) => {
    if (!window.confirm("Are you sure you want to delete this comparison?")) {
      return;
    }

    try {
      setDeletingId(comparisonId);
      await investorAPI.comparisons.delete(comparisonId);
      setComparisons((prev) =>
        prev.filter((comp) => comp._id !== comparisonId)
      );
    } catch (err) {
      console.error("Error deleting comparison:", err);
      setError("Failed to delete comparison");
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (comparisonId) => {
    try {
      const result = await investorAPI.comparisons.getById(comparisonId);
      setSelectedComparison(result);
      setIsEditMode(false);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error loading comparison details:", err);
      setError("Failed to load comparison details");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = async (comparisonId) => {
    try {
      const result = await investorAPI.comparisons.getById(comparisonId);
      setSelectedComparison(result);
      setIsEditMode(true);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error loading comparison details:", err);
      setError("Failed to load comparison details");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSaveEdit = async (updatedComparison) => {
    // Reload comparisons to get updated data
    await loadComparisons();
    setShowViewModal(false);
    setSelectedComparison(null);
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (comparisons.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBalanceScale className="w-8 h-8 text-white/90" />
          <div>
            <h2 className="text-2xl font-bold text-white font-manrope">
              Saved Comparisons
            </h2>
            <p className="text-white/60 font-manrope">
              View and manage your saved idea comparisons
            </p>
          </div>
        </div>

        <EmptyState
          type="comparisons"
          title="No Saved Comparisons"
          description="You haven't saved any idea comparisons yet. Start comparing ideas to make informed investment decisions."
          actionText="Browse Ideas"
          icon={<FaBalanceScale className="w-16 h-16 text-white/20" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaBalanceScale className="w-8 h-8 text-white/90" />
          <div>
            <h2 className="text-2xl font-bold text-white font-manrope">
              Saved Comparisons
            </h2>
            <p className="text-white/60 font-manrope">
              {comparisons.length} comparison
              {comparisons.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-white/20 border border-white/30 rounded-lg p-4 text-white/80 font-manrope">
          {error}
        </div>
      )}

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {comparisons.map((comparison, index) => (
          <div
            key={comparison._id}
            className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.06] hover:border-white/40 transition-all duration-300 group relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-white/10 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="bg-gradient-to-br from-white/20 to-white/20 p-2 rounded-lg border border-white/30">
                    <FaCalendar className="w-4 h-4 text-white/90" />
                  </div>
                  <span className="text-sm font-manrope font-medium">
                    {formatDate(comparison.createdAt)}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-white/20 to-white/20 text-white/90 px-3 py-1.5 rounded-xl text-xs font-bold font-manrope border border-white/30 shadow-lg shadow-white/10">
                  {comparison.ideas?.length || 0} Ideas
                </div>
              </div>

              {/* Ideas List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/80 text-sm font-manrope font-bold">
                  <FaLightbulb className="w-4 h-4 text-white/70" />
                  Compared Ideas:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {comparison.ideas?.slice(0, 4).map((idea, ideaIndex) => (
                    <div
                      key={idea._id || ideaIndex}
                      className="bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3 hover:from-white/[0.12] hover:to-white/[0.08] hover:border-white/30 transition-all duration-300 group/idea"
                    >
                      <div className="w-2 h-2 bg-white rounded-full group-hover/idea:animate-pulse flex-shrink-0"></div>
                      <span className="text-white/90 font-manrope text-sm font-medium line-clamp-1 flex-1">
                        {idea.title}
                      </span>
                      {comparison.chosenLeader?._id === idea._id && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/30 blur-lg rounded-full"></div>
                          <FaTrophy
                            className="relative w-4 h-4 text-white/80 animate-bounce-subtle"
                            title="Chosen Leader"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chosen Leader */}
              {comparison.chosenLeader && (
                <div className="bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div className="relative flex items-start gap-3">
                    <div className="bg-white/30 p-2 rounded-lg border border-white/40 shadow-lg">
                      <FaTrophy className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white/80 font-manrope font-bold text-sm mb-1">
                        Chosen Leader
                      </div>
                      <p className="text-white font-manrope font-semibold">
                        {comparison.chosenLeader.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Preview */}
              {(comparison.notes || comparison.rationale) && (
                <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white/80 font-manrope font-semibold text-sm mb-2">
                    <FaStickyNote className="w-4 h-4 text-white/90" />
                    Notes
                  </div>
                  <p className="text-white/70 text-sm font-manrope line-clamp-2 italic">
                    "{comparison.rationale || comparison.notes}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleView(comparison._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-white/20 to-white/20 text-white/90 hover:from-white/30 hover:to-white/30 rounded-xl transition-all duration-300 font-manrope font-bold min-h-[48px] touch-manipulation border-2 border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  <FaEye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEdit(comparison._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-white/20 to-white/20 text-white/70 hover:from-white/30 hover:to-white/30 rounded-xl transition-all duration-300 font-manrope font-bold min-h-[48px] touch-manipulation border-2 border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(comparison._id)}
                  disabled={deletingId === comparison._id}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-white/20 to-white/20 text-white/80 hover:from-white/30 hover:to-white/30 rounded-xl transition-all duration-300 font-manrope font-bold disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation border-2 border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                  title="Delete comparison"
                >
                  {deletingId === comparison._id ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrash className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Comparison Modal */}
      {showViewModal && selectedComparison && (
        <ComparisonModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedComparison(null);
            setIsEditMode(false);
          }}
          ideas={selectedComparison.ideas || []}
          readOnly={!isEditMode}
          editMode={isEditMode}
          comparisonId={selectedComparison._id}
          onSave={handleSaveEdit}
          initialData={{
            notes: selectedComparison.notes,
            rationale: selectedComparison.rationale,
            chosenLeader: selectedComparison.chosenLeader?._id,
          }}
        />
      )}
    </div>
  );
};

export default SavedComparisonsSection;
