import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * Custom hook for managing negotiation chat with polling
 * 
 * Features:
 * - Automatic polling for new messages (configurable interval)
 * - Optimistic updates for sent messages
 * - Retry failed messages
 * - Mark messages as delivered
 * - Auto-stop polling when inactive
 * 
 * @param {string} fundingRequestId - ID of the funding request
 * @param {Object} options - Configuration options
 * @param {number} options.pollInterval - Polling interval in milliseconds (default: 5000)
 * @param {boolean} options.enabled - Whether polling is enabled (default: true)
 * @returns {Object} Chat state and actions
 */
export const useChat = (fundingRequestId, options = {}) => {
  const {
    pollInterval = 5000, // Poll every 5 seconds
    enabled = true, // Enable polling by default
  } = options;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const pollTimeoutRef = useRef(null);
  const isPollingRef = useRef(false);
  const lastFetchTimeRef = useRef(null);

  /**
   * Fetch messages from the server
   */
  const fetchMessages = useCallback(async (silent = false) => {
    if (!fundingRequestId) return;

    try {
      if (!silent) {
        setLoading(true);
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/messages/funding/${fundingRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages(response.data.data.messages);
        lastFetchTimeRef.current = Date.now();
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (!silent) {
        setError(err.response?.data?.message || "Failed to load messages");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [fundingRequestId]);

  /**
   * Fetch unread message count
   */
  const fetchUnreadCount = useCallback(async () => {
    if (!fundingRequestId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/messages/funding/${fundingRequestId}/unread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [fundingRequestId]);

  /**
   * Send a new message
   */
  const sendMessage = useCallback(
    async (messageData) => {
      if (!fundingRequestId) return;

      const { content, proposalData } = messageData;

      try {
        setSending(true);
        setError(null);

        // Optimistic update - add message immediately
        const optimisticMessage = {
          _id: `temp-${Date.now()}`,
          content,
          proposalData,
          messageType: proposalData ? "proposal" : "text",
          status: "pending",
          createdAt: new Date().toISOString(),
          sender: { name: "You" }, // Will be replaced with actual data
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/messages/funding/${fundingRequestId}`,
          {
            content,
            messageType: proposalData ? "proposal" : "text",
            proposalData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Replace optimistic message with actual message
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === optimisticMessage._id ? response.data.data : msg
            )
          );
        }

        return response.data;
      } catch (err) {
        console.error("Error sending message:", err);
        
        // Mark optimistic message as failed
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === optimisticMessage._id
              ? { ...msg, status: "failed", errorMessage: err.message }
              : msg
          )
        );

        setError(err.response?.data?.message || "Failed to send message");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [fundingRequestId]
  );

  /**
   * Retry a failed message
   */
  const retryMessage = useCallback(async (messageId) => {
    try {
      setError(null);

      // Update message status to pending
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "pending" } : msg
        )
      );

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/messages/${messageId}/retry`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update message with server response
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? response.data.data : msg
          )
        );
      }

      return response.data;
    } catch (err) {
      console.error("Error retrying message:", err);
      
      // Mark message as failed again
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, status: "failed", errorMessage: err.message }
            : msg
        )
      );

      setError(err.response?.data?.message || "Failed to retry message");
      throw err;
    }
  }, []);

  /**
   * Mark messages as delivered
   */
  const markAsDelivered = useCallback(
    async (messageIds) => {
      if (!fundingRequestId || !messageIds.length) return;

      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/messages/funding/${fundingRequestId}/delivered`,
          { messageIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, status: "delivered" } : msg
          )
        );
      } catch (err) {
        console.error("Error marking messages as delivered:", err);
      }
    },
    [fundingRequestId]
  );

  /**
   * Setup polling
   */
  useEffect(() => {
    if (!enabled || !fundingRequestId) return;

    // Initial fetch
    fetchMessages();
    fetchUnreadCount();

    // Setup polling
    const poll = () => {
      if (isPollingRef.current) return;

      isPollingRef.current = true;
      pollTimeoutRef.current = setTimeout(async () => {
        await fetchMessages(true); // Silent fetch
        await fetchUnreadCount();
        isPollingRef.current = false;
        poll(); // Schedule next poll
      }, pollInterval);
    };

    poll();

    // Cleanup
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
      isPollingRef.current = false;
    };
  }, [fundingRequestId, enabled, pollInterval, fetchMessages, fetchUnreadCount]);

  /**
   * Mark visible messages as delivered when component is active
   */
  useEffect(() => {
    if (!messages.length) return;

    const undeliveredMessages = messages
      .filter((msg) => msg.status === "sent" && msg.sender?._id !== localStorage.getItem("userId"))
      .map((msg) => msg._id);

    if (undeliveredMessages.length > 0) {
      markAsDelivered(undeliveredMessages);
    }
  }, [messages, markAsDelivered]);

  return {
    messages,
    loading,
    error,
    sending,
    unreadCount,
    sendMessage,
    retryMessage,
    fetchMessages,
    markAsDelivered,
  };
};
