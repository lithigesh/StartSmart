// components/entrepreneur/InvestorSelector.jsx
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUsers,
  FaFilter,
} from "react-icons/fa";

const InvestorSelector = ({
  ideaId,
  interestedInvestors = [],
  selectedInvestors = [],
  onSelectionChange,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelected, setLocalSelected] = useState(
    new Set(selectedInvestors)
  );

  // Filter investors based on search
  const filteredInvestors = interestedInvestors.filter(
    (investor) =>
      investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (investorId) => {
    const newSelected = new Set(localSelected);
    if (newSelected.has(investorId)) {
      newSelected.delete(investorId);
    } else {
      newSelected.add(investorId);
    }
    setLocalSelected(newSelected);
  };

  const handleSelectAll = () => {
    if (localSelected.size === filteredInvestors.length) {
      setLocalSelected(new Set());
    } else {
      setLocalSelected(new Set(filteredInvestors.map((inv) => inv._id)));
    }
  };

  const handleConfirm = () => {
    onSelectionChange(Array.from(localSelected));
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUsers className="text-blue-400" />
                Select Investors to Target
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Choose which interested investors should receive your funding
                request
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search investors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" />
              {localSelected.size === filteredInvestors.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          {/* Selection Count */}
          <div className="mt-3 text-sm text-white/60">
            {localSelected.size} of {interestedInvestors.length} investors
            selected
          </div>
        </div>

        {/* Investor List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredInvestors.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {interestedInvestors.length === 0
                  ? "No Interested Investors Yet"
                  : "No Investors Found"}
              </h3>
              <p className="text-white/60">
                {interestedInvestors.length === 0
                  ? "Wait for investors to show interest in your idea"
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            filteredInvestors.map((investor) => {
              const isSelected = localSelected.has(investor._id);
              return (
                <div
                  key={investor._id}
                  onClick={() => handleToggle(investor._id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-800/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-white/80"
                          }`}
                        >
                          <FaUser className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            {investor.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <FaEnvelope className="w-3 h-3" />
                            <span>{investor.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/60 ml-13">
                        <FaCalendar className="w-3 h-3" />
                        <span>
                          Interested {formatDate(investor.interestedSince)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-600"
                      }`}
                    >
                      {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-white/60">
              {localSelected.size === 0 ? (
                <span className="flex items-center gap-2 text-yellow-400">
                  ⚠️ No investors selected. Request will be public to all.
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-400">
                  ✓ {localSelected.size} investor(s) will be notified
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <FaCheck className="w-4 h-4" />
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorSelector;
