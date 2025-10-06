// pages/entrepreneur/CollaborationsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { entrepreneurAPI, ideasAPI } from "../../services/api";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaMapMarkerAlt,
  FaBriefcase,
  FaHandshake,
  FaSearch,
  FaFilter,
  FaPlus,
  FaSpinner,
  FaHeart,
  FaComment,
  FaShare,
  FaCheck,
  FaTimes,
  FaStar,
  FaUserPlus,
  FaNetworkWired,
} from "react-icons/fa";

const CollaborationsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [loading, setLoading] = useState(true);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkills, setFilterSkills] = useState('');
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    loadCollaborationsData();
  }, []);

  const loadCollaborationsData = async () => {
    try {
      setLoading(true);
      const [entrepreneursData, connectionsData, requestsData] = await Promise.all([
        entrepreneurAPI.getAllEntrepreneurs(),
        entrepreneurAPI.getConnections(),
        entrepreneurAPI.getConnectionRequests()
      ]);
      
      if (entrepreneursData.success) {
        // Filter out current user
        const filteredEntrepreneurs = entrepreneursData.data.filter(
          entrepreneur => entrepreneur._id !== user._id
        );
        setEntrepreneurs(filteredEntrepreneurs);
      }
      
      if (connectionsData.success) {
        setConnections(connectionsData.data);
      }
      
      if (requestsData.success) {
        setConnectionRequests(requestsData.data);
      }
    } catch (err) {
      console.error('Error loading collaborations data:', err);
      addNotification("Failed to load collaborations data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendConnectionRequest = async (entrepreneurId) => {
    try {
      const result = await entrepreneurAPI.sendConnectionRequest(entrepreneurId);
      if (result.success) {
        addNotification("Connection request sent!", "success");
        await loadCollaborationsData();
      }
    } catch (err) {
      addNotification("Failed to send connection request", "error");
    }
  };

  const handleAcceptConnectionRequest = async (requestId) => {
    try {
      const result = await entrepreneurAPI.acceptConnectionRequest(requestId);
      if (result.success) {
        addNotification("Connection request accepted!", "success");
        await loadCollaborationsData();
      }
    } catch (err) {
      addNotification("Failed to accept connection request", "error");
    }
  };

  const handleDeclineConnectionRequest = async (requestId) => {
    try {
      const result = await entrepreneurAPI.declineConnectionRequest(requestId);
      if (result.success) {
        addNotification("Connection request declined", "info");
        await loadCollaborationsData();
      }
    } catch (err) {
      addNotification("Failed to decline connection request", "error");
    }
  };

  const handleViewProfile = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setShowDetails(true);
  };

  const isConnected = (entrepreneurId) => {
    return connections.some(conn => 
      conn.userId === entrepreneurId || conn.connectedUserId === entrepreneurId
    );
  };

  const hasPendingRequest = (entrepreneurId) => {
    return connectionRequests.some(req => 
      (req.fromUserId === user._id && req.toUserId === entrepreneurId) ||
      (req.toUserId === user._id && req.fromUserId === entrepreneurId)
    );
  };

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkills = !filterSkills || 
                         entrepreneur.skills?.some(skill => skill.toLowerCase().includes(filterSkills.toLowerCase()));
    
    return matchesSearch && matchesSkills;
  });

  const pendingRequests = connectionRequests.filter(req => req.toUserId === user._id);

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
            Collaborations & Networking
          </h2>
          <p className="text-white/60">
            Connect with other entrepreneurs and build your network
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'discover', label: 'Discover', icon: FaSearch },
              { value: 'requests', label: `Requests (${pendingRequests.length})`, icon: FaUserPlus },
              { value: 'connections', label: `My Network (${connections.length})`, icon: FaNetworkWired }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white/70 hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <>
            {/* Search and Filter */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entrepreneurs by name, bio, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by skills..."
                    value={filterSkills}
                    onChange={(e) => setFilterSkills(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Entrepreneurs Grid */}
            {filteredEntrepreneurs.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <FaUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {entrepreneurs.length === 0 ? "No Entrepreneurs Found" : "No Results Found"}
                </h3>
                <p className="text-white/60">
                  {entrepreneurs.length === 0 
                    ? "Be the first to build your network on StartSmart" 
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map((entrepreneur) => (
                  <div 
                    key={entrepreneur._id} 
                    className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{entrepreneur.name}</h3>
                        <p className="text-white/60 text-sm">{entrepreneur.role || 'Entrepreneur'}</p>
                      </div>
                    </div>

                    {entrepreneur.bio && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-3">
                        {entrepreneur.bio}
                      </p>
                    )}

                    {entrepreneur.location && (
                      <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-gray-400 w-4 h-4" />
                        <span className="text-white/60 text-sm">{entrepreneur.location}</span>
                      </div>
                    )}

                    {entrepreneur.skills && entrepreneur.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {entrepreneur.skills.slice(0, 3).map((skill, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {entrepreneur.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                              +{entrepreneur.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <button
                        onClick={() => handleViewProfile(entrepreneur)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <FaUser className="w-4 h-4" />
                        View Profile
                      </button>
                      
                      {isConnected(entrepreneur._id) ? (
                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                          <FaCheck className="w-4 h-4" />
                          Connected
                        </span>
                      ) : hasPendingRequest(entrepreneur._id) ? (
                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg text-sm font-medium">
                          <FaSpinner className="w-4 h-4" />
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendConnectionRequest(entrepreneur._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <FaUserPlus className="w-4 h-4" />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Connection Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUserPlus className="text-blue-400" />
              Connection Requests
            </h3>
            
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <FaUserPlus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-white/60">No pending connection requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{request.fromUserName}</h4>
                        <p className="text-white/60 text-sm">Wants to connect with you</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptConnectionRequest(request._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <FaCheck className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineConnectionRequest(request._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <FaTimes className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Network Tab */}
        {activeTab === 'connections' && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaNetworkWired className="text-green-400" />
              My Network
            </h3>
            
            {connections.length === 0 ? (
              <div className="text-center py-8">
                <FaNetworkWired className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-white/60">Start building your network by connecting with other entrepreneurs</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection) => (
                  <div key={connection._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{connection.connectedUserName}</h4>
                        <p className="text-white/60 text-sm">Connected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
                        <FaComment className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Details Modal */}
      {showDetails && selectedEntrepreneur && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Entrepreneur Profile</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl">{selectedEntrepreneur.name}</h3>
                  <p className="text-white/70">{selectedEntrepreneur.role || 'Entrepreneur'}</p>
                  {selectedEntrepreneur.location && (
                    <p className="text-white/60 text-sm flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {selectedEntrepreneur.location}
                    </p>
                  )}
                </div>
              </div>
              
              {selectedEntrepreneur.bio && (
                <div>
                  <h4 className="text-white font-medium mb-2">About</h4>
                  <p className="text-white/80">{selectedEntrepreneur.bio}</p>
                </div>
              )}
              
              {selectedEntrepreneur.skills && selectedEntrepreneur.skills.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntrepreneur.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
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
                {!isConnected(selectedEntrepreneur._id) && !hasPendingRequest(selectedEntrepreneur._id) && (
                  <button
                    onClick={() => {
                      handleSendConnectionRequest(selectedEntrepreneur._id);
                      setShowDetails(false);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Send Connection Request
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

export default CollaborationsPage;