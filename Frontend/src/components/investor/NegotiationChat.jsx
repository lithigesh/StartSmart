import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaUser,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

/**
 * NegotiationChat Component
 * Displays negotiation history and allows investors to send messages
 */
const NegotiationChat = ({
  negotiationHistory = [],
  onSendMessage,
  currentUserId,
  isInvestor = true,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [proposedEquity, setProposedEquity] = useState("");
  const [showProposalFields, setShowProposalFields] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [negotiationHistory]);

  const handleSendMessage = async (e) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!message.trim() && !proposedAmount && !proposedEquity) {
      return;
    }

    setIsSending(true);

    try {
      const negotiationData = {
        message: message.trim(),
      };

      if (proposedAmount) {
        negotiationData.proposedAmount = parseFloat(proposedAmount);
      }

      if (proposedEquity) {
        negotiationData.proposedEquity = parseFloat(proposedEquity);
      }

      await onSendMessage(negotiationData);

      // Reset form
      setMessage("");
      setProposedAmount("");
      setProposedEquity("");
      setShowProposalFields(false);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const isSystemMessage = (msg) => {
    return (
      msg.message?.startsWith("ACCEPTED:") ||
      msg.message?.startsWith("REJECTED:")
    );
  };

  const isInvestorMessage = (msg) => {
    return msg.investor && msg.investor.toString() === currentUserId;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-900/50 rounded-lg">
        {negotiationHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaInfoCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-center">No negotiation messages yet.</p>
            <p className="text-sm text-center mt-2">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          <>
            {negotiationHistory.map((msg, index) => {
              const isOwnMessage = isInvestorMessage(msg);
              const isSystem = isSystemMessage(msg);

              if (isSystem) {
                return (
                  <div key={index} className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20/20 border border-white/30 rounded-full text-white/90 text-sm">
                      {msg.message?.startsWith("✅") ? (
                        <FaCheckCircle className="w-4 h-4" />
                      ) : (
                        <FaTimesCircle className="w-4 h-4" />
                      )}
                      <span>{msg.message}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[70%] ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isOwnMessage ? "bg-white/20" : "bg-white"
                      }`}
                    >
                      {isOwnMessage ? (
                        <FaUserTie className="w-5 h-5 text-white" />
                      ) : (
                        <FaUser className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isOwnMessage
                            ? "bg-white/20 text-white rounded-tr-none"
                            : "bg-gray-800 border border-gray-700 text-white rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 px-2 ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      {!disabled && (
        <div className="mt-4 space-y-3">
          {/* Proposal Fields (Optional) */}
          {showProposalFields && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Proposed Amount ($)
                </label>
                <input
                  type="number"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  placeholder="e.g., 250000"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Proposed Equity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={proposedEquity}
                  onChange={(e) => setProposedEquity(e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Message Input Box */}
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your negotiation message... (Shift+Enter for new line)"
              rows={3}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowProposalFields(!showProposalFields);
                }}
                type="button"
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showProposalFields
                    ? "bg-white/20 border-white text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
                title="Add proposed terms"
              >
                💰
              </button>
              <button
                onClick={handleSendMessage}
                type="button"
                disabled={
                  isSending ||
                  (!message.trim() && !proposedAmount && !proposedEquity)
                }
                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
};

export default NegotiationChat;
