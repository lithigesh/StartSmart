// pages/entrepreneur/IdeathonsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { ideathonsAPI } from "../../services/api";
import IdeathonRegistrationForm from "../../components/entrepreneur/IdeathonRegistrationForm";
import {
  FaTrophy,
  FaCalendar,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaFlag,
  FaMedal,
  FaCheck,
  FaSpinner,
  FaPlus,
  FaEye,
  FaTimes,
  FaAward,
  FaFireAlt,
  FaRegClock,
} from "react-icons/fa";

const IdeathonsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [loading, setLoading] = useState(true);
  const [ideathons, setIdeathons] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedIdeathon, setSelectedIdeathon] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadIdeathonsData();
  }, []);

  const loadIdeathonsData = async () => {
    try {
      setLoading(true);
      const [ideathonsData, registrationsData] = await Promise.all([
        ideathonsAPI.getAllIdeathons(),
        ideathonsAPI.getUserRegistrations()
      ]);
      
      if (ideathonsData.success) {
        setIdeathons(ideathonsData.data);
      }
      
      if (registrationsData.success) {
        setUserRegistrations(registrationsData.data);
      }
    } catch (err) {
      console.error('Error loading ideathons data:', err);
      addNotification("Failed to load ideathons data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForIdeathon = (ideathon) => {
    setSelectedIdeathon(ideathon);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    setSelectedIdeathon(null);
    loadIdeathonsData();
    addNotification("Successfully registered for ideathon!", "success");
  };

  const handleViewDetails = (ideathon) => {
    setSelectedIdeathon(ideathon);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status, endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (status === 'completed' || end < now) {
      return 'text-gray-400 bg-gray-400/10';
    }
    if (status === 'active') {
      return 'text-green-400 bg-green-400/10';
    }
    if (status === 'upcoming') {
      return 'text-blue-400 bg-blue-400/10';
    }
    return 'text-yellow-400 bg-yellow-400/10';
  };

  const getIdeathonStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const isRegistered = (ideathonId) => {
    return userRegistrations.some(reg => reg.ideathonId === ideathonId);
  };

  const filteredIdeathons = ideathons.filter(ideathon => {
    const status = getIdeathonStatus(ideathon.startDate, ideathon.endDate);
    return filterStatus === 'all' || status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ideathons & Competitions
          </h2>
          <p className="text-white/60">
            Participate in startup competitions and showcase your ideas
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Events', icon: FaTrophy },
              { value: 'upcoming', label: 'Upcoming', icon: FaClock },
              { value: 'active', label: 'Active', icon: FaFireAlt },
              { value: 'completed', label: 'Completed', icon: FaFlag }
            ].map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white/70 hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ideathons List */}
        {filteredIdeathons.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <FaTrophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {ideathons.length === 0 ? "No Ideathons Available" : "No Results Found"}
            </h3>
            <p className="text-white/60">
              {ideathons.length === 0 
                ? "Check back later for exciting competitions and events" 
                : "Try adjusting your filter criteria"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIdeathons.map((ideathon) => {
              const status = getIdeathonStatus(ideathon.startDate, ideathon.endDate);
              const registered = isRegistered(ideathon._id);
              
              return (
                <div 
                  key={ideathon._id} 
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FaTrophy className="text-yellow-400" />
                        <h3 className="text-white font-semibold text-lg">{ideathon.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status, ideathon.endDate)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {ideathon.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Start Date</p>
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-blue-400 w-3 h-3" />
                        <p className="text-white text-sm">{formatDate(ideathon.startDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Prize Pool</p>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-green-400 w-3 h-3" />
                        <p className="text-green-400 font-semibold text-sm">
                          {formatCurrency(ideathon.prizePool)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Duration</p>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-yellow-400 w-3 h-3" />
                        <p className="text-white text-sm">{ideathon.duration}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Participants</p>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-purple-400 w-3 h-3" />
                        <p className="text-white text-sm">
                          {ideathon.maxParticipants ? `${ideathon.registeredCount || 0}/${ideathon.maxParticipants}` : `${ideathon.registeredCount || 0}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {ideathon.themes && ideathon.themes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-white/60 text-xs mb-2">Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {ideathon.themes.map((theme, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleViewDetails(ideathon)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {registered ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                        <FaCheck className="w-4 h-4" />
                        Registered
                      </span>
                    ) : status === 'upcoming' ? (
                      <button
                        onClick={() => handleRegisterForIdeathon(ideathon)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <FaPlus className="w-4 h-4" />
                        Register
                      </button>
                    ) : status === 'active' ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg text-sm font-medium">
                        <FaFireAlt className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg text-sm font-medium">
                        <FaFlag className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Your Registrations */}
        {userRegistrations.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaMedal className="text-yellow-400" />
              Your Registrations
            </h3>
            <div className="space-y-3">
              {userRegistrations.map((registration) => (
                <div key={registration._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{registration.ideathonTitle}</h4>
                    <p className="text-white/60 text-sm">Registered on {formatDate(registration.registrationDate)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                    {registration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedIdeathon && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Register for Ideathon</h2>
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <IdeathonRegistrationForm
              ideathon={selectedIdeathon}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistrationForm(false)}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedIdeathon && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">{selectedIdeathon.title}</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Description</h3>
                <p className="text-white/80">{selectedIdeathon.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Event Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-blue-400 w-4 h-4" />
                      <span className="text-white/70">Start: {formatDate(selectedIdeathon.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFlag className="text-red-400 w-4 h-4" />
                      <span className="text-white/70">End: {formatDate(selectedIdeathon.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-yellow-400 w-4 h-4" />
                      <span className="text-white/70">Duration: {selectedIdeathon.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Prizes & Participation</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-400 w-4 h-4" />
                      <span className="text-green-400 font-semibold">{formatCurrency(selectedIdeathon.prizePool)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-purple-400 w-4 h-4" />
                      <span className="text-white/70">
                        {selectedIdeathon.maxParticipants ? `${selectedIdeathon.registeredCount || 0}/${selectedIdeathon.maxParticipants} registered` : `${selectedIdeathon.registeredCount || 0} registered`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedIdeathon.themes && selectedIdeathon.themes.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdeathon.themes.map((theme, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedIdeathon.rules && (
                <div>
                  <h4 className="text-white font-medium mb-2">Rules & Guidelines</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-white/80 whitespace-pre-line">{selectedIdeathon.rules}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                {!isRegistered(selectedIdeathon._id) && getIdeathonStatus(selectedIdeathon.startDate, selectedIdeathon.endDate) === 'upcoming' && (
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleRegisterForIdeathon(selectedIdeathon);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeathonsPage;