import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaUser,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaCheck,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";

/**
 * Unified ChatInterface Component
 * Used by both investors and entrepreneurs for negotiation chat
 */
const ChatInterface = ({
  messages = [],
  currentUserId,
  currentUserRole = "investor", // 'investor' or 'entrepreneur'
  onSendMessage,
  disabled = false,
  canPropose = true,
  onRetryMessage,
  height = "500px",
}) => {
  const [message, setMessage] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [proposedEquity, setProposedEquity] = useState("");
  const [showProposalFields, setShowProposalFields] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus textarea on mount
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

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
      const messageData = {
        message: message.trim(),
      };

      if (proposedAmount) {
        messageData.proposedAmount = parseFloat(proposedAmount);
      }

      if (proposedEquity) {
        messageData.proposedEquity = parseFloat(proposedEquity);
      }

      await onSendMessage(messageData);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSystemMessage = (msg) => {
    return (
      msg.messageType === "system" ||
      msg.message?.startsWith("✅") ||
      msg.message?.startsWith("❌")
    );
  };

  const isOwnMessage = (msg) => {
    // Check by sender ID and role
    if (msg.sender && msg.sender._id) {
      return msg.sender._id.toString() === currentUserId;
    }
    if (msg.sender && typeof msg.sender === "string") {
      return msg.sender.toString() === currentUserId;
    }
    // Legacy check for investor field
    if (currentUserRole === "investor" && msg.investor) {
      return msg.investor.toString() === currentUserId;
    }
    // Legacy check for entrepreneur (investor === null)
    if (currentUserRole === "entrepreneur" && !msg.investor && !msg.sender) {
      return true;
    }
    return false;
  };

  const getMessageStatus = (msg) => {
    if (msg.status === "failed") {
      return { icon: FaExclamationTriangle, color: "text-red-400", text: "Failed" };
    }
    if (msg.status === "sending" || msg.status === "pending") {
      return { icon: FaClock, color: "text-gray-400", text: "Sending..." };
    }
    if (msg.status === "sent" || msg.status === "delivered") {
      return { icon: FaCheck, color: "text-green-400", text: "Sent" };
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full" style={{ height }}>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-900/50 rounded-lg">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaInfoCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-center">No messages yet.</p>
            <p className="text-sm text-center mt-2">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwn = isOwnMessage(msg);
              const isSystem = isSystemMessage(msg);
              const status = isOwn ? getMessageStatus(msg) : null;

              if (isSystem) {
                return (
                  <div key={msg._id || index} className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                      {msg.message?.startsWith("✅") ? (
                        <FaCheckCircle className="w-4 h-4" />
                      ) : (
                        <FaTimesCircle className="w-4 h-4" />
                      )}
                      <span>{msg.content || msg.message}</span>
                    </div>
                  </div>
                );
              }

              const senderName = msg.sender?.name || msg.senderName || "Unknown";
              const senderRole = msg.senderRole || (msg.investor ? "investor" : "entrepreneur");

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[70%] ${
                      isOwn ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        senderRole === "investor" ? "bg-blue-600" : "bg-purple-600"
                      }`}
                    >
                      {senderRole === "investor" ? (
                        <FaUserTie className="w-5 h-5 text-white" />
                      ) : (
                        <FaUser className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1 px-2">
                          {senderName}
                        </p>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl break-words ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-gray-800 border border-gray-700 text-white rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.content || msg.message}
                        </p>
                      </div>
                      
                      {/* Message Footer */}
                      <div
                        className={`flex items-center gap-2 text-xs text-gray-500 mt-1 px-2 ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{formatTimestamp(msg.timestamp || msg.createdAt)}</span>
                        
                        {/* Message Status for own messages */}
                        {isOwn && status && (
                          <>
                            <span>•</span>
                            <status.icon className={`w-3 h-3 ${status.color}`} />
                          </>
                        )}
                        
                        {/* Retry button for failed messages */}
                        {isOwn && msg.status === "failed" && onRetryMessage && (
                          <button
                            onClick={() => onRetryMessage(msg)}
                            className="ml-2 text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <FaRedo className="w-3 h-3" />
                            Retry
                          </button>
                        )}
                      </div>
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
          {showProposalFields && canPropose && (
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
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Message Input Box */}
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message... (Shift+Enter for new line)"
              rows={3}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSending}
            />
            <div className="flex flex-col gap-2">
              {canPropose && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowProposalFields(!showProposalFields);
                  }}
                  type="button"
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    showProposalFields
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
                  title="Add proposed terms"
                  disabled={isSending}
                >
                  💰
                </button>
              )}
              <button
                onClick={handleSendMessage}
                type="button"
                disabled={
                  isSending ||
                  (!message.trim() && !proposedAmount && !proposedEquity)
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
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

      {disabled && (
        <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center text-gray-400">
          <FaInfoCircle className="w-5 h-5 inline mr-2" />
          This conversation is closed. You can no longer send messages.
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
