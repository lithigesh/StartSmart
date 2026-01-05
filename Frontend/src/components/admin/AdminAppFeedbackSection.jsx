// components/admin/AdminAppFeedbackSection.jsx
import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    Star, 
    ThumbsUp, 
    Clock, 
    User, 
    Filter, 
    Search,
    RefreshCw,
    BarChart3,
    TrendingUp,
    Users,
    MessageCircle,
    CheckCircle,
    AlertCircle,
    Eye
} from 'lucide-react';

const AdminAppFeedbackSection = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        userRole: 'all',
        category: 'all',
        status: 'all',
        page: 1,
        limit: 10
    });
    const [stats, setStats] = useState({
        total: 0,
        totalPages: 0,
        roleStats: []
    });
    const [searchTerm, setSearchTerm] = useState('');

    const userRoleOptions = [
        { value: 'all', label: 'All Users' },
        { value: 'entrepreneur', label: 'Entrepreneurs' },
        { value: 'investor', label: 'Investors' },
        { value: 'admin', label: 'Admins' }
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'general', label: 'General' },
        { value: 'bug_report', label: 'Bug Reports' },
        { value: 'feature_request', label: 'Feature Requests' },
        { value: 'ui_ux', label: 'UI/UX' },
        { value: 'performance', label: 'Performance' },
        { value: 'security', label: 'Security' },
        { value: 'analytics', label: 'Analytics' },
        { value: 'other', label: 'Other' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'in_review', label: 'In Review' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    useEffect(() => {
        fetchFeedback();
    }, [filters]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== 'all') {
                    queryParams.append(key, value);
                } else if (key === 'page' || key === 'limit') {
                    queryParams.append(key, value);
                }
            });

            const response = await fetch(`${API_BASE}/api/app-feedback/admin/all?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFeedback(data.feedback || []);
                setStats({
                    total: data.total,
                    totalPages: data.totalPages,
                    roleStats: data.roleStats || []
                });
                setError(null);
            } else {
                throw new Error('Failed to fetch feedback');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: value,
            page: 1 // Reset to first page when changing filters
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'text-blue-600 bg-blue-100',
            in_review: 'text-yellow-600 bg-yellow-100',
            in_progress: 'text-purple-600 bg-purple-100',
            resolved: 'text-green-600 bg-green-100',
            closed: 'text-gray-600 bg-gray-100'
        };
        return colors[status] || colors.open;
    };

    const getRoleColor = (role) => {
        const colors = {
            entrepreneur: 'text-green-600 bg-green-100',
            investor: 'text-blue-600 bg-blue-100',
            admin: 'text-purple-600 bg-purple-100'
        };
        return colors[role] || 'text-gray-600 bg-gray-100';
    };

    const getRoleStats = () => {
        const totalFeedback = stats.roleStats.reduce((sum, stat) => sum + stat.count, 0);
        return stats.roleStats.map(stat => ({
            ...stat,
            percentage: totalFeedback > 0 ? ((stat.count / totalFeedback) * 100).toFixed(1) : 0
        }));
    };

    const filteredFeedback = feedback.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Platform Feedback Management
                    </h2>
                    <p className="text-white/60">
                        Monitor and manage feedback from entrepreneurs and investors
                    </p>
                </div>
                <button
                    onClick={fetchFeedback}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/60">Total Feedback</p>
                            <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-white/90" />
                    </div>
                </div>

                {getRoleStats().map((roleStat) => (
                    <div key={roleStat._id} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/60 capitalize">
                                    {roleStat._id || 'Unknown'} Feedback
                                </p>
                                <p className="text-2xl font-bold text-white">{roleStat.count}</p>
                                <p className="text-xs text-white/60">{roleStat.percentage}% of total</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Users className="h-6 w-6 text-white/90 mb-1" />
                                <div className="text-xs text-white/60 text-center">
                                    <div>Avg: {roleStat.avgRating?.toFixed(1) || '0.0'}/5</div>
                                    <div>NPS: {roleStat.avgRecommendation?.toFixed(1) || '0.0'}/10</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search feedback..."
                                className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40"
                            />
                        </div>
                    </div>

                    {/* User Role Filter */}
                    <select
                        value={filters.userRole}
                        onChange={(e) => handleFilterChange('userRole', e.target.value)}
                        className="px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    >
                        {userRoleOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 bg-white/[0.05] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl">
                <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">
                        Feedback ({filteredFeedback.length} items)
                    </h3>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                            <p className="mt-4 text-white/60">Loading feedback...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">
                                Error Loading Feedback
                            </h3>
                            <p className="text-white/60 mb-4">{error}</p>
                            <button
                                onClick={fetchFeedback}
                                className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredFeedback.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">
                                No feedback found
                            </h3>
                            <p className="text-white/60">
                                No feedback matches your current filters
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedback.map((item) => (
                                <div
                                    key={item._id}
                                    className="border border-white/10 rounded-lg p-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-white">{item.title}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status?.replace('_', ' ')}
                                                </span>
                                                {item.userRole && (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(item.userRole)}`}>
                                                        {item.userRole}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center space-x-4 text-sm text-white/60 mb-2">
                                                <div className="flex items-center space-x-1">
                                                    <User size={14} />
                                                    <span>{item.user?.name || 'Unknown'}</span>
                                                    <span>({item.user?.email})</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle size={14} />
                                                    <span className="capitalize">{item.category?.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={14} />
                                                    <span>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-white/80 text-sm mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center space-x-6 text-xs text-white/60">
                                                <div className="flex items-center space-x-1">
                                                    <Star size={14} />
                                                    <span>Rating: {item.overallRating}/5</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <ThumbsUp size={14} />
                                                    <span>NPS: {item.recommendationScore}/10</span>
                                                </div>
                                                {item.mostUsedFeatures && item.mostUsedFeatures.length > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <BarChart3 size={14} />
                                                        <span>Features: {item.mostUsedFeatures.length}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {item.adminResponse && item.adminResponse.response && (
                                                <div className="mt-3 p-3 bg-white/10 rounded-lg border-l-4 border-white">
                                                    <p className="text-sm font-medium text-white/90">
                                                        Admin Response:
                                                    </p>
                                                    <p className="text-sm text-white/90 mt-1">
                                                        {item.adminResponse.response}
                                                    </p>
                                                    <p className="text-xs text-white/60 mt-2">
                                                        Responded on{' '}
                                                        {new Date(item.adminResponse.respondedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {stats.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                            <div className="text-sm text-white/60">
                                Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
                                {Math.min(filters.page * filters.limit, stats.total)} of {stats.total} results
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    disabled={filters.page <= 1}
                                    className="px-3 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                
                                <span className="px-3 py-2 text-white">
                                    Page {filters.page} of {stats.totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    disabled={filters.page >= stats.totalPages}
                                    className="px-3 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAppFeedbackSection;