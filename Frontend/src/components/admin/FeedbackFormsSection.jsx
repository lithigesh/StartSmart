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
        ideaId: '',
        category: 'general',
        rating: 5,
        comments: '',
        suggestions: '',
        strengths: [],
        improvements: [],
        followUpRequired: false,
        followUpNotes: '',
        visibility: 'entrepreneur_only'
    });

    const categories = [
        'general', 'feasibility', 'innovation', 'market_potential', 'technical', 'presentation'
    ];

    const visibilityOptions = [
        { value: 'entrepreneur_only', label: 'Entrepreneur Only' },
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
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
            ideaId: feedback.idea?._id || '',
            category: feedback.category || 'general',
            rating: feedback.rating || 5,
            comments: feedback.comments || feedback.comment || '',
            suggestions: feedback.suggestions || '',
            strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
            improvements: Array.isArray(feedback.improvements) ? feedback.improvements : [],
            followUpRequired: feedback.followUpRequired || false,
            followUpNotes: feedback.followUpNotes || '',
            visibility: feedback.visibility || 'entrepreneur_only'
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
            ideaId: '',
            category: 'general',
            rating: 5,
            comments: '',
            suggestions: '',
            strengths: [],
            improvements: [],
            followUpRequired: false,
            followUpNotes: '',
            visibility: 'entrepreneur_only'
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
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <MessageSquare className="mr-3 text-blue-400" />
                            Ideas Feedback
                        </h2>
                        <p className="text-gray-300 mt-1">Provide comprehensive feedback for all submitted ideas</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingFeedback(null);
                            setShowForm(true);
                        }}
                        className="enhanced-button bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white px-6 py-3 rounded-lg hover:from-blue-500/95 hover:to-blue-600/95 transition-all duration-300 flex items-center shadow-lg backdrop-blur-sm border border-blue-500/30"
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
                            className="pl-10 w-full border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                        />
                    </div>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-white"
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
                        className="border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-white"
                    >
                        <option value="">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <option key={rating} value={rating}>
                                {rating} Star{rating !== 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>

                    <div className="text-sm text-gray-300 flex items-center">
                        <Filter size={16} className="mr-1" />
                        {filteredFeedbacks.length} of {feedbacks.length} feedback items
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg mb-4 flex items-center gap-3 backdrop-blur-sm">
                        <MessageSquare className="text-green-400" size={20} />
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Feedback Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-white">
                                {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Idea Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Idea *
                                    </label>
                                    <select
                                        value={formData.ideaId}
                                        onChange={(e) => setFormData({...formData, ideaId: e.target.value})}
                                        required
                                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Choose an idea...</option>
                                        {ideas.map(idea => (
                                            <option key={idea._id} value={idea._id}>
                                                {idea.title} - {idea.owner?.name || 'Unknown Owner'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category and Rating */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category.replace('_', ' ').toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Rating (1-5)
                                        </label>
                                        <select
                                            value={formData.rating}
                                            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                                            className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <option key={rating} value={rating}>
                                                    {rating} - {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>



                                {/* Comments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Comments *
                                    </label>
                                    <textarea
                                        value={formData.comments}
                                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                        required
                                        rows={4}
                                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                        placeholder="Detailed feedback comments..."
                                    />
                                </div>

                                {/* Suggestions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Suggestions
                                    </label>
                                    <textarea
                                        value={formData.suggestions}
                                        onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                                        rows={3}
                                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                        placeholder="Suggestions for improvement..."
                                    />
                                </div>

                                {/* Strengths and Improvements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Strengths (one per line)
                                        </label>
                                        <textarea
                                            value={formData.strengths.join('\n')}
                                            onChange={(e) => setFormData({...formData, strengths: e.target.value.split('\n').filter(s => s.trim())})}
                                            rows={3}
                                            className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                            placeholder="What works well...\nGood market research\nStrong team"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Areas for Improvement (one per line)
                                        </label>
                                        <textarea
                                            value={formData.improvements.join('\n')}
                                            onChange={(e) => setFormData({...formData, improvements: e.target.value.split('\n').filter(s => s.trim())})}
                                            rows={3}
                                            className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                            placeholder="Areas that need improvement...\nBetter financial projections\nMore detailed timeline"
                                        />
                                    </div>
                                </div>

                                {/* Follow-up */}
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="followUp"
                                            checked={formData.followUpRequired}
                                            onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="followUp" className="ml-2 text-sm font-medium text-gray-300">
                                            Follow-up required
                                        </label>
                                    </div>

                                    {formData.followUpRequired && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Follow-up Notes
                                            </label>
                                            <textarea
                                                value={formData.followUpNotes}
                                                onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})}
                                                rows={2}
                                                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                                placeholder="Notes for follow-up actions..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Visibility
                                    </label>
                                    <select
                                        value={formData.visibility}
                                        onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        className="enhanced-button px-6 py-2 border border-gray-600/70 rounded-lg text-gray-300 hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200"
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
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Recent Feedback</h3>
                    
                    {filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <MessageSquare size={48} className="mx-auto mb-4 text-gray-500" />
                            <p className="text-lg mb-2 text-gray-300">No feedback available yet</p>
                            <p className="text-sm text-gray-400">Click "Add Feedback" above to provide feedback for ideas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedbacks.map(feedback => (
                                <div key={feedback._id} className="border border-gray-700 bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-white">
                                                    Feedback for: {feedback.idea?.title || 'Unknown Idea'}
                                                </h4>
                                                <div className="flex items-center">
                                                    {renderStars(feedback.rating)}
                                                    <span className="ml-1 text-sm text-gray-300">
                                                        ({feedback.rating}/5)
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    feedback.visibility === 'public' ? 'bg-green-100 text-green-800' :
                                                    feedback.visibility === 'private' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-orange-100 text-orange-800'
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
                                            
                                            <div className="text-sm text-gray-400 mb-2">
                                                <strong>Idea:</strong> {feedback.idea?.title || 'Unknown Idea'} |
                                                <strong className="ml-2">Category:</strong> {feedback.category?.replace('_', ' ').toUpperCase()} |
                                                <strong className="ml-2">Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            <p className="text-gray-200 mb-2">{feedback.comments || feedback.comment}</p>
                                            
                                            {feedback.suggestions && (
                                                <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded mb-2">
                                                    <strong>Suggestions:</strong> {feedback.suggestions}
                                                </div>
                                            )}

                                            {feedback.strengths && Array.isArray(feedback.strengths) && feedback.strengths.length > 0 && (
                                                <div className="text-sm text-green-700 bg-green-50 p-2 rounded mb-2">
                                                    <strong>Strengths:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.strengths.map((strength, index) => (
                                                            <li key={index}>{strength}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedback.improvements && Array.isArray(feedback.improvements) && feedback.improvements.length > 0 && (
                                                <div className="text-sm text-orange-700 bg-orange-50 p-2 rounded mb-2">
                                                    <strong>Areas for Improvement:</strong>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {feedback.improvements.map((improvement, index) => (
                                                            <li key={index}>{improvement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {feedback.followUpRequired && (
                                                <div className="flex items-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                                    <ThumbsUp size={16} className="mr-2" />
                                                    Follow-up required
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