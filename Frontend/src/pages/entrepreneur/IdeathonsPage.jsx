import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import IdeathonRegistrationForm from "../../components/entrepreneur/IdeathonRegistrationForm";
import IdeathonRegistrationModal from "../../components/entrepreneur/IdeathonRegistrationModal";
import MyRegisteredIdeathons from "../../components/MyRegisteredIdeathons";
import {
  FaTrophy,
  FaSpinner,
  FaCalendarAlt,
  FaBuilding,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaUsers,
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle
} from "react-icons/fa";

const IdeathonsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [ideathons, setIdeathons] = useState([]);
  const [registeredIdeathons, setRegisteredIdeathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Registration modal
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedIdeathon, setSelectedIdeathon] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Fetch ideathons
  const fetchIdeathons = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (locationFilter && locationFilter !== 'all') queryParams.append('location', locationFilter);

      const res = await fetch(`${API_BASE}/api/ideathons?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch ideathons');

      const response = await res.json();
      
      if (response.success && response.data) {
        // Filter out ideathons that the user has already registered for
        const filteredIdeathons = Array.isArray(response.data) 
          ? response.data.filter(ideathon => 
              !registeredIdeathons.some(reg => reg.ideathon._id === ideathon._id)
            )
          : [];
        
        setIdeathons(filteredIdeathons);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
      }
    } catch (err) {
      console.error('Error fetching ideathons:', err);
      setError('Failed to load ideathons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's registered ideathons
  const fetchRegisteredIdeathons = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ideathon-registrations/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch registrations');

      const response = await res.json();
      
      if (response.success && response.data) {
        setRegisteredIdeathons(response.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  useEffect(() => {
    // First fetch registered ideathons, then fetch available ideathons
    const loadData = async () => {
      await fetchRegisteredIdeathons();
      await fetchIdeathons();
    };
    loadData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      // Ensure we have the latest registrations before filtering ideathons
      const updateData = async () => {
        await fetchRegisteredIdeathons();
        await fetchIdeathons();
      };
      updateData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, locationFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchIdeathons();
    }
  }, [currentPage]);

  // Check if user is already registered for an ideathon
  const isRegistered = (ideathonId) => {
    return registeredIdeathons.some(reg => reg.ideathonId === ideathonId);
  };

  // Get ideathon status
  const getIdeathonStatus = (ideathon) => {
    const now = new Date();
    const startDate = new Date(ideathon.startDate);
    const endDate = new Date(ideathon.endDate);
    
    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Active Now', color: 'green' };
    } else {
      return { status: 'expired', label: 'Ended', color: 'gray' };
    }
  };

  const getStatusColor = (statusInfo) => {
    switch (statusInfo.color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gray': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRegisterClick = (ideathon) => {
    console.log("Register button clicked for ideathon:", ideathon);
    
    // Check if already registered
    if (isRegistered(ideathon._id)) {
      addNotification("You are already registered for this ideathon", "info");
      return;
    }
    
    // Directly set the states
    setSelectedIdeathon(ideathon);
    setShowRegistrationModal(true);
    console.log('Opening registration modal for:', ideathon.title);
  };

  const handleRegistrationSuccess = (registrationData) => {
    setShowRegistrationModal(false);
    setSelectedIdeathon(null);
    fetchRegisteredIdeathons();
    
    // Show success notification with more details
    addNotification(
      `Successfully registered team "${registrationData.teamName}" for ${selectedIdeathon.title}! ` +
      "You'll receive a confirmation email shortly.",
      "success"
    );
    
    // Refetch ideathons list to update registration status
    fetchIdeathons();
  };

  if (loading && ideathons.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Registered Ideathons Section */}
      <MyRegisteredIdeathons />

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-white/70 text-sm font-medium mb-2">Search Ideathons</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by title or theme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all duration-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/[0.08] border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 transition-all duration-300 cursor-pointer"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="upcoming" className="bg-gray-800">Upcoming</option>
              <option value="active" className="bg-gray-800">Active Now</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
            >
              <FaTimes className="text-sm" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Ideathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideathons.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl">
            <FaTrophy className="text-6xl text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Ideathons Available</h3>
            <p className="text-white/60">Check back later for new competitions!</p>
          </div>
        ) : (
          ideathons.map((ideathon) => {
            const statusInfo = getIdeathonStatus(ideathon);
            const registered = isRegistered(ideathon._id);

            return (
              <div
                key={ideathon._id}
                className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(statusInfo)}`}>
                    {statusInfo.label}
                  </span>
                  {registered && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <FaCheckCircle className="text-xs" />
                      Registered
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {ideathon.title}
                </h3>

                {/* Theme */}
                {ideathon.theme && (
                  <p className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/10 mb-3">
                    {ideathon.theme}
                  </p>
                )}

                {/* Organizers */}
                {ideathon.organizers && (
                  <div className="flex items-center gap-2 mb-3">
                    <FaBuilding className="text-white/50 text-sm" />
                    <p className="text-white/80 text-sm truncate">{ideathon.organizers}</p>
                  </div>
                )}

                {/* Date Range */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FaCalendarAlt className="text-white/50" />
                    <span>{formatDate(ideathon.startDate)} - {formatDate(ideathon.endDate)}</span>
                  </div>
                  {ideathon.location && (
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <FaMapMarkerAlt className="text-white/50" />
                      <span>{ideathon.location}</span>
                    </div>
                  )}
                </div>

                {/* Prize Pool */}
                {ideathon.fundingPrizes && (
                  <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaTrophy className="text-yellow-400 text-sm" />
                      <span className="text-white/70 text-xs font-semibold uppercase">Prize Pool</span>
                    </div>
                    <p className="text-white font-medium text-sm">{ideathon.fundingPrizes}</p>
                  </div>
                )}

                {/* Description Preview */}
                {ideathon.description && (
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {ideathon.description}
                  </p>
                )}

                {/* Register Button */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Register button clicked');
                      setShowRegistrationModal(true);
                      setSelectedIdeathon(ideathon);
                    }}
                    disabled={registered || statusInfo.status === 'expired'}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      registered
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                        : statusInfo.status === 'expired'
                        ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white border border-blue-400/30 hover:from-blue-400/90 hover:to-blue-500/90'
                    }`}
                  >
                    {registered ? (
                      <>
                        <FaCheckCircle />
                        Already Registered
                      </>
                    ) : statusInfo.status === 'expired' ? (
                      <>
                        <FaClock />
                        Registration Closed
                      </>
                    ) : (
                      <>
                        <FaTrophy />
                        Register Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            Previous
          </button>

          <span className="text-white/70 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      )}

      {/* Registration Modal */}
      <IdeathonRegistrationModal 
        isOpen={showRegistrationModal} 
        onClose={() => {
          console.log('Closing modal');
          setShowRegistrationModal(false);
          setSelectedIdeathon(null);
        }}
      >
        {selectedIdeathon && (
          <IdeathonRegistrationForm
            isOpen={showRegistrationModal}
            onClose={() => {
              console.log('Closing registration form');
              setShowRegistrationModal(false);
              setSelectedIdeathon(null);
            }}
            ideathonId={selectedIdeathon._id}
            ideathonTitle={selectedIdeathon.title}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </IdeathonRegistrationModal>
    </div>
  );
};

export default IdeathonsPage;