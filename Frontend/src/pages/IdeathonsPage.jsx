import React, { useState, useEffect } from "react";
import { ideathonAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import { 
  FaTrophy, 
  FaCalendarAlt, 
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaAward,
  FaUserPlus,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaFilter,
  FaSearch,
  FaStar,
  FaCheckCircle,
  FaPlayCircle,
  FaTimes
} from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const IdeathonsPage = () => {
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideathons, setIdeathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // upcoming, ongoing, past
  const [actionLoading, setActionLoading] = useState({});
  const [selectedIdeathon, setSelectedIdeathon] = useState(null);

  useEffect(() => {
    loadIdeathonsData();
  }, []);

  const loadIdeathonsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load ideathons and user registrations
      const [ideathonsResponse, registrationsResponse] = await Promise.all([
        ideathonAPI.getAllIdeathons().catch(() => ({ data: [] })),
        ideathonAPI.getUserRegistrations().catch(() => ({ data: [] }))
      ]);
      
      const ideathonsData = ideathonsResponse.data || [];
      
      // If no real data, show demo ideathons
      if (ideathonsData.length === 0) {
        setIdeathons(generateDemoIdeathons());
      } else {
        setIdeathons(ideathonsData);
      }
      
      setRegistrations(registrationsResponse.data || []);
    } catch (err) {
      console.error("Error loading ideathons data:", err);
      setError(err.message);
      
      // Show demo data on error
      setIdeathons(generateDemoIdeathons());
      addNotification("Using demo data - API connection failed", "warning");
    } finally {
      setLoading(false);
    }
  };

  const generateDemoIdeathons = () => {
    const currentDate = new Date();
    const addDays = (days) => new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    const subtractDays = (days) => new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    return [
      {
        _id: "1",
        title: "AI for Good Challenge 2024",
        theme: "Artificial Intelligence for Social Impact",
        description: "Build AI solutions that address real-world social challenges and make a positive impact on communities.",
        startDate: addDays(15),
        endDate: addDays(17),
        location: "Virtual Event",
        fundingPrizes: "$50,000 total prizes",
        participants: 1247,
        maxParticipants: 2000,
        registrationDeadline: addDays(10),
        status: "upcoming",
        organizer: "TechForGood Foundation",
        requirements: ["Team of 2-5 members", "AI/ML experience preferred", "Social impact focus"],
        prizes: [
          { place: "1st", amount: 25000, description: "Grand Prize Winner" },
          { place: "2nd", amount: 15000, description: "Runner-up" },
          { place: "3rd", amount: 10000, description: "Third Place" }
        ],
        featured: true,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
      },
      {
        _id: "2",
        title: "FinTech Innovation Summit",
        theme: "Revolutionizing Financial Services",
        description: "Create innovative fintech solutions that democratize access to financial services and improve financial literacy.",
        startDate: addDays(5),
        endDate: addDays(7),
        location: "San Francisco, CA",
        fundingPrizes: "$30,000 total prizes",
        participants: 856,
        maxParticipants: 1000,
        registrationDeadline: addDays(2),
        status: "upcoming",
        organizer: "FinTech Alliance",
        requirements: ["Financial services background", "Working prototype required", "Pitch presentation"],
        prizes: [
          { place: "1st", amount: 20000, description: "Best Innovation" },
          { place: "2nd", amount: 10000, description: "Most Practical Solution" }
        ],
        featured: false,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"
      },
      {
        _id: "3",
        title: "HealthTech Hackathon",
        theme: "Digital Health Solutions",
        description: "Develop cutting-edge healthcare technology solutions to improve patient outcomes and healthcare delivery.",
        startDate: subtractDays(2),
        endDate: addDays(1),
        location: "Boston, MA",
        fundingPrizes: "$75,000 total prizes + Incubation",
        participants: 1893,
        maxParticipants: 2000,
        registrationDeadline: subtractDays(5),
        status: "ongoing",
        organizer: "HealthTech Hub",
        requirements: ["Healthcare industry knowledge", "Technical skills", "Live demo required"],
        prizes: [
          { place: "1st", amount: 40000, description: "Grand Prize + 6-month incubation" },
          { place: "2nd", amount: 20000, description: "Innovation Award" },
          { place: "3rd", amount: 15000, description: "People's Choice" }
        ],
        featured: true,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
      },
      {
        _id: "4",
        title: "Sustainable Tech Challenge",
        theme: "Climate Change Solutions",
        description: "Past event that focused on developing technology solutions to combat climate change and promote sustainability.",
        startDate: subtractDays(60),
        endDate: subtractDays(58),
        location: "Virtual Event",
        fundingPrizes: "$40,000 total prizes",
        participants: 1456,
        maxParticipants: 2000,
        registrationDeadline: subtractDays(65),
        status: "past",
        organizer: "GreenTech Initiative",
        winners: [
          { name: "EcoTrack Solutions", prize: "1st Place - $25,000" },
          { name: "Carbon Zero App", prize: "2nd Place - $15,000" }
        ],
        featured: false,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
      }
    ];
  };

  const handleRegister = async (ideathonId) => {
    try {
      setActionLoading({ [ideathonId]: true });
      
      await ideathonAPI.registerForIdeathon(ideathonId);
      
      setRegistrations(prev => [...prev, { ideathon: ideathonId }]);
      addNotification("Successfully registered for ideathon!", "success");
    } catch (err) {
      console.error("Error registering for ideathon:", err);
      addNotification(err.message || "Failed to register for ideathon", "error");
    } finally {
      setActionLoading({ [ideathonId]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'ongoing': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'past': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return FaClock;
      case 'ongoing': return FaPlayCircle;
      case 'past': return FaCheckCircle;
      default: return FaClock;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const isRegistered = (ideathonId) => {
    return registrations.some(reg => reg.ideathon === ideathonId);
  };

  const isRegistrationOpen = (ideathon) => {
    const now = new Date();
    const deadline = new Date(ideathon.registrationDeadline);
    return now < deadline && ideathon.participants < ideathon.maxParticipants;
  };

  // Filter ideathons
  const filteredIdeathons = ideathons.filter(ideathon => {
    const matchesSearch = ideathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ideathon.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ideathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ideathon.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ideathons...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ideathons & Competitions
                </h1>
                <p className="text-gray-400 mt-1">
                  Participate in exciting innovation challenges and win prizes
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ideathons, themes, or organizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Available Events</p>
                  <p className="text-2xl font-bold text-white">{filteredIdeathons.length}</p>
                </div>
                <FaTrophy className="text-yellow-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your Registrations</p>
                  <p className="text-2xl font-bold text-blue-400">{registrations.length}</p>
                </div>
                <FaUserPlus className="text-blue-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Participants</p>
                  <p className="text-2xl font-bold text-green-400">
                    {filteredIdeathons.reduce((sum, event) => sum + event.participants, 0).toLocaleString()}
                  </p>
                </div>
                <FaUsers className="text-green-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Prize Pool</p>
                  <p className="text-2xl font-bold text-purple-400">$195K+</p>
                </div>
                <FaAward className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Featured Events */}
          {filteredIdeathons.filter(event => event.featured).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                Featured Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIdeathons.filter(event => event.featured).map((ideathon) => (
                  <div 
                    key={ideathon._id} 
                    className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-blue-700/50 transition-all duration-200"
                  >
                    <div className="flex gap-4 mb-4">
                      <img
                        src={ideathon.image || `https://ui-avatars.com/api/?name=${ideathon.title}&background=1f2937&color=ffffff&size=80`}
                        alt={ideathon.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white">{ideathon.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(ideathon.status)}`}>
                            {ideathon.status}
                          </span>
                        </div>
                        <p className="text-blue-400 text-sm mb-1">{ideathon.theme}</p>
                        <p className="text-gray-400 text-sm">{ideathon.organizer}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{ideathon.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-300">{formatDate(ideathon.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-300">{ideathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span className="text-gray-300">{ideathon.participants}/{ideathon.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaAward className="text-gray-400" />
                        <span className="text-gray-300">{ideathon.fundingPrizes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <button
                        onClick={() => setSelectedIdeathon(ideathon)}
                        className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <FaInfoCircle className="text-xs" />
                        Details
                      </button>
                      
                      {isRegistered(ideathon._id) ? (
                        <button
                          disabled
                          className="px-6 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm flex items-center gap-2"
                        >
                          <FaCheckCircle className="text-xs" />
                          Registered
                        </button>
                      ) : isRegistrationOpen(ideathon) ? (
                        <button
                          onClick={() => handleRegister(ideathon._id)}
                          disabled={actionLoading[ideathon._id]}
                          className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          <FaUserPlus className="text-xs" />
                          {actionLoading[ideathon._id] ? "Registering..." : "Register"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-6 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg text-sm"
                        >
                          Registration Closed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">All Events</h2>
            {filteredIdeathons.length === 0 ? (
              <EmptyState
                icon={FaTrophy}
                title="No Ideathons Found"
                description="Try adjusting your search criteria or check back later for new events"
                actionText="Clear Filters"
                onAction={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeathons.map((ideathon) => {
                  const StatusIcon = getStatusIcon(ideathon.status);
                  return (
                    <div 
                      key={ideathon._id} 
                      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{ideathon.title}</h3>
                          <p className="text-blue-400 text-sm mb-1">{ideathon.theme}</p>
                          <p className="text-gray-400 text-sm">{ideathon.organizer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="text-sm text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(ideathon.status)}`}>
                            {ideathon.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{ideathon.description}</p>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-gray-300">{formatDate(ideathon.startDate)} - {formatDate(ideathon.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-gray-300">{ideathon.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaAward className="text-gray-400" />
                          <span className="text-gray-300">{ideathon.fundingPrizes}</span>
                        </div>
                      </div>
                      
                      {/* Progress bar for participants */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Participants</span>
                          <span className="text-gray-300">{ideathon.participants}/{ideathon.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(ideathon.participants / ideathon.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                        <button
                          onClick={() => setSelectedIdeathon(ideathon)}
                          className="flex-1 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <FaInfoCircle className="text-xs" />
                          Details
                        </button>
                        
                        {isRegistered(ideathon._id) ? (
                          <button
                            disabled
                            className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle className="text-xs" />
                            Registered
                          </button>
                        ) : isRegistrationOpen(ideathon) ? (
                          <button
                            onClick={() => handleRegister(ideathon._id)}
                            disabled={actionLoading[ideathon._id]}
                            className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <FaUserPlus className="text-xs" />
                            {actionLoading[ideathon._id] ? "..." : "Register"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 px-3 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg text-sm"
                          >
                            Closed
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {selectedIdeathon && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">{selectedIdeathon.title}</h2>
                <button
                  onClick={() => setSelectedIdeathon(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Theme</h3>
                  <p className="text-blue-400">{selectedIdeathon.theme}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedIdeathon.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-300">
                          {formatDate(selectedIdeathon.startDate)} - {formatDate(selectedIdeathon.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-300">{selectedIdeathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span className="text-gray-300">
                          {selectedIdeathon.participants}/{selectedIdeathon.maxParticipants} participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span className="text-gray-300">
                          Registration deadline: {formatDate(selectedIdeathon.registrationDeadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Prizes</h3>
                    <div className="space-y-2">
                      {selectedIdeathon.prizes?.map((prize, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">{prize.place} - {prize.description}</span>
                          <span className="text-green-400 font-medium">{formatCurrency(prize.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedIdeathon.requirements && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Requirements</h3>
                    <ul className="space-y-1 text-gray-300">
                      {selectedIdeathon.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-400 text-sm" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedIdeathon.winners && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Winners</h3>
                    <div className="space-y-2">
                      {selectedIdeathon.winners.map((winner, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">{winner.name}</span>
                          <span className="text-yellow-400">{winner.prize}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setSelectedIdeathon(null)}
                    className="flex-1 px-4 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  
                  {isRegistered(selectedIdeathon._id) ? (
                    <button
                      disabled
                      className="flex-1 px-4 py-3 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Already Registered
                    </button>
                  ) : isRegistrationOpen(selectedIdeathon) ? (
                    <button
                      onClick={() => handleRegister(selectedIdeathon._id)}
                      disabled={actionLoading[selectedIdeathon._id]}
                      className="flex-1 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FaUserPlus />
                      {actionLoading[selectedIdeathon._id] ? "Registering..." : "Register Now"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 px-4 py-3 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default IdeathonsPage;