// components/admin/FeedbackFormsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const FeedbackFormsSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        idea: '',
        category: 'general',
        rating: 5,
        title: '',
        comments: '',
        suggestions: '',
        strengths: '',
        improvements: '',
        isFollowUpNeeded: false,
        followUpNotes: '',
        visibility: 'admin_only'
    });

    const categories = [
        'general', 'market_viability', 'technical_feasibility', 'innovation', 
        'sustainability', 'team_capability', 'financial_projection', 'scalability'
    ];

    const visibilityOptions = [
        { value: 'admin_only', label: 'Admin Only' },
        { value: 'public', label: 'Public' },
        { value: 'entrepreneur_only', label: 'Entrepreneur Only' }
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
            setIdeas(data.ideas || []);
        } catch (err) {
            console.error('Error fetching ideas:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const url = editingFeedback 
                ? `${API_BASE}/api/admin/feedback/${editingFeedback._id}`
                : `${API_BASE}/api/admin/feedback`;
            
            const method = editingFeedback ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save feedback');

            await fetchFeedbacks();
            resetForm();
            setShowForm(false);
            setEditingFeedback(null);
            
            // Show success message
            setSuccessMessage(editingFeedback ? 'Feedback updated successfully!' : 'Feedback created successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error saving feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            idea: feedback.idea?._id || '',
            category: feedback.category || 'general',
            rating: feedback.rating || 5,
            title: feedback.title || '',
            comments: feedback.comments || '',
            suggestions: feedback.suggestions || '',
            strengths: feedback.strengths || '',
            improvements: feedback.improvements || '',
            isFollowUpNeeded: feedback.isFollowUpNeeded || false,
            followUpNotes: feedback.followUpNotes || '',
            visibility: feedback.visibility || 'admin_only'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const response = await fetch(`${API_BASE}/api/admin/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete feedback');
            
            await fetchFeedbacks();
            
            // Show success message
            setSuccessMessage('Feedback deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error deleting feedback:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            idea: '',
            category: 'general',
            rating: 5,
            title: '',
            comments: '',
            suggestions: '',
            strengths: '',
            improvements: '',
            isFollowUpNeeded: false,
            followUpNotes: '',
            visibility: 'admin_only'
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
        ));
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch = !searchTerm || 
            feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <div className="bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100/50 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <MessageSquare className="mr-3 text-blue-600" />
                            Feedback Management
                        </h2>
                        <p className="text-gray-600 mt-1">Collect and manage feedback for ideas</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingFeedback(null);
                            setShowForm(true);
                        }}
                        className="enhanced-button bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white px-6 py-3 rounded-lg hover:from-blue-400/95 hover:to-blue-500/95 transition-all duration-300 flex items-center shadow-lg backdrop-blur-sm border border-blue-400/30"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Feedback
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        />
                    </div>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    >
                        <option value="">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <option key={rating} value={rating}>
                                {rating} Star{rating !== 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>

                    <div className="text-sm text-gray-600 flex items-center">
                        <Filter size={16} className="mr-1" />
                        {filteredFeedbacks.length} of {feedbacks.length} feedback items
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
                        <MessageSquare className="text-green-600" size={20} />
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Feedback Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-md rounded-xl shadow-2xl border border-blue-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Idea Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Idea *
                                    </label>
                                    <select
                                        value={formData.idea}
                                        onChange={(e) => setFormData({...formData, idea: e.target.value})}
                                        required
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Choose an idea...</option>
                                        {ideas.map(idea => (
                                            <option key={idea._id} value={idea._id}>
                                                {idea.title} - {idea.owner?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category and Rating */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category.replace('_', ' ').toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating (1-5)
                                        </label>
                                        <select
                                            value={formData.rating}
                                            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <option key={rating} value={rating}>
                                                    {rating} - {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Feedback Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Brief title for this feedback..."
                                    />
                                </div>

                                {/* Comments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comments *
                                    </label>
                                    <textarea
                                        value={formData.comments}
                                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                        required
                                        rows={4}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Detailed feedback comments..."
                                    />
                                </div>

                                {/* Suggestions and Strengths */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Suggestions
                                        </label>
                                        <textarea
                                            value={formData.suggestions}
                                            onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                                            rows={3}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Suggestions for improvement..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Strengths
                                        </label>
                                        <textarea
                                            value={formData.strengths}
                                            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                                            rows={3}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="What works well..."
                                        />
                                    </div>
                                </div>

                                {/* Improvements */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Areas for Improvement
                                    </label>
                                    <textarea
                                        value={formData.improvements}
                                        onChange={(e) => setFormData({...formData, improvements: e.target.value})}
                                        rows={3}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Areas that need improvement..."
                                    />
                                </div>

                                {/* Follow-up */}
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="followUp"
                                            checked={formData.isFollowUpNeeded}
                                            onChange={(e) => setFormData({...formData, isFollowUpNeeded: e.target.checked})}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="followUp" className="ml-2 text-sm font-medium text-gray-700">
                                            Follow-up needed
                                        </label>
                                    </div>

                                    {formData.isFollowUpNeeded && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Follow-up Notes
                                            </label>
                                            <textarea
                                                value={formData.followUpNotes}
                                                onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})}
                                                rows={2}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Notes for follow-up actions..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Visibility
                                    </label>
                                    <select
                                        value={formData.visibility}
                                        onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {visibilityOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingFeedback(null);
                                            resetForm();
                                        }}
                                        className="enhanced-button px-6 py-2 border border-gray-300/70 rounded-lg text-gray-700 hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="enhanced-button px-6 py-2 bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white rounded-lg hover:from-blue-400/95 hover:to-blue-500/95 transition-all duration-300 disabled:opacity-50 shadow-lg backdrop-blur-sm border border-blue-400/30"
                                    >
                                        {loading ? 'Saving...' : (editingFeedback ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback List */}
            <div className="bg-gradient-to-br from-white/95 to-blue-50/30 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100/50">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
                    
                    {filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No feedback found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedbacks.map(feedback => (
                                <div key={feedback._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {feedback.title || 'Untitled Feedback'}
                                                </h4>
                                                <div className="flex items-center">
                                                    {renderStars(feedback.rating)}
                                                    <span className="ml-1 text-sm text-gray-600">
                                                        ({feedback.rating}/5)
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    feedback.visibility === 'public' ? 'bg-green-100 text-green-800' :
                                                    feedback.visibility === 'admin_only' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {feedback.visibility === 'admin_only' ? (
                                                        <><EyeOff size={12} className="inline mr-1" />Admin Only</>
                                                    ) : (
                                                        <><Eye size={12} className="inline mr-1" />{feedback.visibility.replace('_', ' ')}</>
                                                    )}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Idea:</strong> {feedback.idea?.title || 'Unknown Idea'} |
                                                <strong className="ml-2">Category:</strong> {feedback.category?.replace('_', ' ').toUpperCase()} |
                                                <strong className="ml-2">Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            <p className="text-gray-700 mb-2">{feedback.comments}</p>
                                            
                                            {feedback.suggestions && (
                                                <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded mb-2">
                                                    <strong>Suggestions:</strong> {feedback.suggestions}
                                                </div>
                                            )}
                                            
                                            {feedback.isFollowUpNeeded && (
                                                <div className="flex items-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                                    <ThumbsUp size={16} className="mr-2" />
                                                    Follow-up needed
                                                    {feedback.followUpNotes && (
                                                        <span className="ml-2">: {feedback.followUpNotes}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(feedback)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(feedback._id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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