// components/admin/FeedbackFormsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff, Search, Filter } from 'lucide-react';

const FeedbackFormsSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');



    const categories = [
        'general', 'feasibility', 'innovation', 'market_potential', 'technical', 'presentation'
    ];



    useEffect(() => {
        fetchFeedbacks();
        fetchIdeas();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/feedback`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch feedbacks');
            
            const data = await response.json();
            setFeedbacks(data.feedback || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchIdeas = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/ideas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch ideas');
            
            const data = await response.json();
            setIdeas(Array.isArray(data) ? data : data.ideas || []);
            console.log('Fetched ideas:', data);
        } catch (err) {
            console.error('Error fetching ideas:', err);
            setError('Failed to load ideas. Please try again.');
        }
    };









    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-white/70 fill-current' : 'text-gray-300'}
            />
        ));
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch = !searchTerm || 
            feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.suggestions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.idea?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !categoryFilter || feedback.category === categoryFilter;
        const matchesRating = !ratingFilter || feedback.rating === parseInt(ratingFilter);

        return matchesSearch && matchesCategory && matchesRating;
    });

    if (loading && feedbacks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <MessageSquare className="mr-3 text-white" />
                            Ideas Feedback
                        </h2>
                        <p className="text-white/70 mt-1">Provide comprehensive feedback for all submitted ideas</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white placeholder-white/50"
                        />
                    </div>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white"
                    >
                        <option value="" className="bg-gray-800 text-white">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category} className="bg-gray-800 text-white">
                                {category.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] bg-white/[0.05] backdrop-blur-sm transition-all duration-300 text-white"
                    >
                        <option value="" className="bg-gray-800 text-white">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <option key={rating} value={rating} className="bg-gray-800 text-white">
                                {rating} Star{rating !== 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>

                    <div className="text-sm text-white/70 flex items-center">
                        <Filter size={16} className="mr-1" />
                        {filteredFeedbacks.length} of {feedbacks.length} feedback items
                    </div>
                </div>

                {error && (
                    <div className="bg-gradient-to-r from-white/30 to-white/20 border border-white/30 rounded-lg backdrop-blur-sm px-4 py-3 mb-4">
                        <p className="text-white/80 text-sm font-manrope">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-gradient-to-r from-white/30 to-white/20 border border-white/30 rounded-lg backdrop-blur-sm px-4 py-3 mb-4 flex items-center gap-3">
                        <MessageSquare className="text-white/90" size={20} />
                        <p className="text-white/90 text-sm font-manrope">{successMessage}</p>
                    </div>
                )}
            </div>

            {/* Feedback List */}
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Recent Feedback</h3>
                    
                    {filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-12 text-white/50">
                            <MessageSquare size={48} className="mx-auto mb-4 text-white/30" />
                            <p className="text-lg mb-2 text-white/70">No feedback available yet</p>
                            <p className="text-sm text-white/50">Feedback will appear here when entrepreneurs submit ideas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedbacks.map(feedback => (
                                <div key={feedback._id} className="border border-white/10 bg-white/[0.05] rounded-lg p-4 hover:bg-white/[0.08] transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-white">
                                                    Feedback for: {feedback.idea?.title || 'Unknown Idea'}
                                                </h4>
                                                <div className="flex items-center">
                                                    {renderStars(feedback.rating)}
                                                    <span className="ml-1 text-sm text-white/70">
                                                        ({feedback.rating}/5)
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    feedback.visibility === 'public' ? 'bg-white/20 text-white border border-white/30' :
                                                    feedback.visibility === 'private' ? 'bg-white/15 text-white/80 border border-white/20' :
                                                    'bg-white/10 text-white/70 border border-white/20'
                                                }`}>
                                                    {feedback.visibility === 'private' ? (
                                                        <><EyeOff size={12} className="inline mr-1" />Private</>
                                                    ) : feedback.visibility === 'public' ? (
                                                        <><Eye size={12} className="inline mr-1" />Public</>
                                                    ) : (
                                                        <><Eye size={12} className="inline mr-1" />Entrepreneur Only</>
                                                    )}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-white/50 mb-2">
                                                <strong>Idea:</strong> {feedback.idea?.title || 'Unknown Idea'} |
                                                <strong className="ml-2">Category:</strong> {feedback.category?.replace('_', ' ').toUpperCase()} |
                                                <strong className="ml-2">Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            <p className="text-white/70 mb-2">{feedback.comments || feedback.comment}</p>
                                            
                                            {feedback.suggestions && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Suggestions:</strong> {feedback.suggestions}
                                                </div>
                                            )}

                                            {feedback.strengths && Array.isArray(feedback.strengths) && feedback.strengths.length > 0 && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Strengths:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.strengths.map((strength, index) => (
                                                            <li key={index}>{strength}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedback.improvements && Array.isArray(feedback.improvements) && feedback.improvements.length > 0 && (
                                                <div className="text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded mb-2">
                                                    <strong className="text-white">Areas for Improvement:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.improvements.map((improvement, index) => (
                                                            <li key={index}>{improvement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {feedback.followUpRequired && (
                                                <div className="flex items-center text-sm text-white/80 bg-white/[0.08] border border-white/10 p-2 rounded">
                                                    <ThumbsUp size={16} className="mr-2 text-white" />
                                                    <strong className="text-white">Follow-up required</strong>
                                                    {feedback.followUpNotes && (
                                                        <span className="ml-2">: {feedback.followUpNotes}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackFormsSection;