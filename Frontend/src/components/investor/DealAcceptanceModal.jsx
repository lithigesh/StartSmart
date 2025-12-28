import React, { useState } from "react";
import {
  FaTimes,
  FaDollarSign,
  FaPercentage,
  FaBuilding,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

/**
 * DealAcceptanceModal Component
 * Modal for final deal acceptance with terms confirmation
 */
const DealAcceptanceModal = ({ isOpen, onClose, fundingRequest, onAccept }) => {
  const [acceptanceTerms, setAcceptanceTerms] = useState({
    finalAmount: fundingRequest?.amount || 0,
    finalEquity: fundingRequest?.equity || 0,
    conditions: "",
    digitalSignature: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !fundingRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    if (!acceptanceTerms.digitalSignature.trim()) {
      setError("Digital signature is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onAccept(acceptanceTerms);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to accept deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedValuation =
    acceptanceTerms.finalAmount && acceptanceTerms.finalEquity
      ? Math.round(
          (acceptanceTerms.finalAmount / acceptanceTerms.finalEquity) * 100
        )
      : 0;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Accept Investment Deal
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Review and confirm final terms
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Idea Information */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Investment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Idea:</span>
                <span className="text-white font-medium">
                  {fundingRequest.idea?.title || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entrepreneur:</span>
                <span className="text-white">
                  {fundingRequest.entrepreneur?.name || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Funding Stage:</span>
                <span className="text-white capitalize">
                  {fundingRequest.fundingStage?.replace("_", " ") || "Seed"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Investment Type:</span>
                <span className="text-white capitalize">
                  {fundingRequest.investmentType?.replace("_", " ") || "Equity"}
                </span>
              </div>
            </div>
          </div>

          {/* Final Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Final Terms</h3>

            {/* Amount */}
            <div>
              <label className="block text-white font-medium mb-2">
                Investment Amount ($) *
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={acceptanceTerms.finalAmount}
                  onChange={(e) =>
                    setAcceptanceTerms({
                      ...acceptanceTerms,
                      finalAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Equity */}
            <div>
              <label className="block text-white font-medium mb-2">
                Equity Percentage (%) *
              </label>
              <div className="relative">
                <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={acceptanceTerms.finalEquity}
                  onChange={(e) =>
                    setAcceptanceTerms({
                      ...acceptanceTerms,
                      finalEquity: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Calculated Valuation */}
            <div className="bg-white/20/10 border border-white/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/90">
                  <FaBuilding className="w-5 h-5" />
                  <span className="font-medium">Implied Valuation:</span>
                </div>
                <span className="text-2xl font-bold text-white/90">
                  ${calculatedValuation.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-white font-medium mb-2">
                Additional Conditions (Optional)
              </label>
              <textarea
                value={acceptanceTerms.conditions}
                onChange={(e) =>
                  setAcceptanceTerms({
                    ...acceptanceTerms,
                    conditions: e.target.value,
                  })
                }
                placeholder="Any additional terms or conditions..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent resize-none"
              />
            </div>

            {/* Digital Signature */}
            <div>
              <label className="block text-white font-medium mb-2">
                Digital Signature (Type your full name) *
              </label>
              <input
                type="text"
                value={acceptanceTerms.digitalSignature}
                onChange={(e) =>
                  setAcceptanceTerms({
                    ...acceptanceTerms,
                    digitalSignature: e.target.value,
                  })
                }
                placeholder="Type your full name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="bg-white/10 border border-white/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-white/70 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-white/70 font-semibold mb-2">
                  Important Notice
                </h4>
                <p className="text-white/70 text-sm mb-3">
                  By accepting this investment deal, you agree to:
                </p>
                <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                  <li>Commit the specified investment amount</li>
                  <li>Acquire the stated equity percentage</li>
                  <li>Abide by all terms and conditions</li>
                  <li>Complete all required legal documentation</li>
                </ul>
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-white bg-gray-800 text-white/70 focus:ring-2 focus:ring-white"
                  />
                  <span className="text-white/70 font-medium">
                    I understand and agree to these terms
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-white/10 border border-white/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/80">
                <FaExclamationTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !agreedToTerms ||
                !acceptanceTerms.digitalSignature.trim()
              }
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/30 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-5 h-5" />
                  <span>Accept & Invest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealAcceptanceModal;
