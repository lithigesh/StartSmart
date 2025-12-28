// components/entrepreneur/FeedbackCard.jsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, Plus, TrendingUp } from 'lucide-react';

const FeedbackCard = () => {
    const [stats, setStats] = useState(null);
    const [showQuickFeedback, setShowQuickFeedback] = useState(false);
    const [quickFeedback, setQuickFeedback] = useState({
        rating: 5,
        comment: '',
        category: 'general'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/app-feedback/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching feedback stats:', error);
        }
    };

    const submitQuickFeedback = async () => {
        const trimmedComment = quickFeedback.comment.trim();
        
        if (!trimmedComment) {
            alert('Please enter your feedback');
            return;
        }
        
        if (trimmedComment.length < 10) {
            alert('Feedback must be at least 10 characters long');
            return;
        }
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            
            const feedbackData = {
                title: 'Quick Feedback',
                description: quickFeedback.comment,
                category: quickFeedback.category,
                overallRating: quickFeedback.rating,
                ratings: {
                    usability: quickFeedback.rating,
                    performance: quickFeedback.rating,
                    features: quickFeedback.rating,
                    design: quickFeedback.rating
                },
                recommendationScore: Math.round(quickFeedback.rating * 2), // Convert 5-star to 10-point scale
                contactForFollowUp: false
            };

            const response = await fetch(`${API_BASE}/api/app-feedback`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                setQuickFeedback({ rating: 5, comment: '', category: 'general' });
                setShowQuickFeedback(false);
                fetchStats();
                alert('Thank you for your feedback!');
            } else {
                alert('Error submitting feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, setRating = null) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${
                            star <= rating
                                ? 'text-white/70 fill-current'
                                : 'text-gray-300'
                        } ${setRating ? 'cursor-pointer hover:text-white/70' : ''}`}
                        onClick={() => setRating && setRating(star)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20/20 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-white/90" />
                    </div>
                    <div>
                        <h3 className="font-medium">App Feedback</h3>
                        <p className="text-sm text-gray-300">Help us improve StartSmart</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowQuickFeedback(!showQuickFeedback)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Quick Feedback"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white/90">
                            {stats.totalFeedback || 0}
                        </div>
                        <div className="text-xs text-gray-300">Total Feedback</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white/70">
                            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                        </div>
                        <div className="text-xs text-gray-300">Avg Rating</div>
                    </div>
                </div>
            )}

            {/* Quick Feedback Form */}
            {showQuickFeedback && (
                <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/10">
                    <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        {renderStars(quickFeedback.rating, (rating) => 
                            setQuickFeedback(prev => ({ ...prev, rating }))
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={quickFeedback.category}
                            onChange={(e) => setQuickFeedback(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="general">General</option>
                            <option value="bug_report">Bug Report</option>
                            <option value="feature_request">Feature Request</option>
                            <option value="ui_ux">UI/UX</option>
                            <option value="performance">Performance</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Comment (min 10 characters)
                        </label>
                        <textarea
                            value={quickFeedback.comment}
                            onChange={(e) => setQuickFeedback(prev => ({ ...prev, comment: e.target.value }))}
                            rows={3}
                            className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white ${
                                quickFeedback.comment.trim().length > 0 && quickFeedback.comment.trim().length < 10 
                                    ? 'border-white' 
                                    : 'border-white/20'
                            }`}
                            placeholder="Share your thoughts... (minimum 10 characters)"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <div className={`text-xs ${
                                quickFeedback.comment.trim().length < 10 
                                    ? 'text-white/80' 
                                    : 'text-gray-400'
                            }`}>
                                {quickFeedback.comment.trim().length}/10 minimum
                            </div>
                            <div className="text-xs text-gray-400">
                                {quickFeedback.comment.length}/500 characters
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={submitQuickFeedback}
                            disabled={submitting || !quickFeedback.comment.trim() || quickFeedback.comment.trim().length < 10}
                            className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send size={14} />
                                    <span>Submit</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowQuickFeedback(false)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* View All Link */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-gray-300">
                    {stats?.totalFeedback > 0 ? `${stats.totalFeedback} feedback submitted` : 'No feedback yet'}
                </span>
                <button
                    onClick={() => window.location.href = '/entrepreneur/feedback'}
                    className="text-sm text-white/90 hover:text-white/90 flex items-center space-x-1"
                >
                    <span>View All</span>
                    <TrendingUp size={14} />
                </button>
            </div>
        </div>
    );
};

export default FeedbackCard;