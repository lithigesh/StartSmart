import React, { useState, useEffect } from "react";
import { ideathonsAPI } from "../services/api";
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const [ideathonsResponse, registrationsResponse] = await Promise.all([
        fetch(`${API_URL}/api/ideathons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json()),
        fetch(`${API_URL}/api/ideathons/registrations/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json())
      ]);
      
      const ideathonsData = ideathonsResponse.data || [];
      const registrationsData = registrationsResponse.data || [];
      
      console.log('Loaded ideathons:', ideathonsData.length);
      console.log('Loaded registrations:', registrationsData);
      
      // If no real data, show demo ideathons
      if (ideathonsData.length === 0) {
        const demoData = generateDemoIdeathons();
        setIdeathons(demoData);
        // Add some demo registrations for testing
        setRegistrations([
          { 
            ideathonId: "1", 
            status: "registered",
            ideathon: demoData[0],
            createdAt: new Date().toISOString()
          },
          { 
            ideathonId: "3", 
            status: "registered",
            ideathon: demoData[2],
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        setIdeathons(ideathonsData);
        setRegistrations(registrationsData);
      }
      
      console.log('Data loaded successfully');
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
      
  await ideathonsAPI.registerForIdeathon(ideathonId);
      
      setRegistrations(prev => [...prev, { ideathon: ideathonId }]);
      addNotification("Successfully registered for ideathon!", "success");
    } catch (err) {
      console.error("Error registering for ideathon:", err);
      addNotification(err.message || "Failed to register for ideathon", "error");
    } finally {
      setActionLoading({ [ideathonId]: false });
    }
  };

  const getStatusColor = (status, isRegistered = false) => {
    if (isRegistered) {
      return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
    }
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'ongoing': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'past': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'registered': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
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
    const isRegistered = registrations.some(reg => 
      reg.ideathonId === ideathonId || reg.ideathon === ideathonId
    );
    console.log('Checking registration for:', ideathonId, 'Result:', isRegistered);
    return isRegistered;
  };

  const isRegistrationOpen = (ideathon) => {
    const now = new Date();
    const deadline = new Date(ideathon.registrationDeadline);
    return now < deadline && ideathon.participants < ideathon.maxParticipants;
  };

  // Filter ideathons
  const filteredIdeathons = ideathons.filter(ideathon => {
    // Text search matching
    const matchesSearch = searchTerm.trim() === '' || 
                         ideathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ideathon.theme || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ideathon.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Registration check
    const isIdeathonRegistered = registrations.some(reg => 
      reg.ideathonId === ideathon._id || 
      reg.ideathon === ideathon._id ||
      reg.ideathon?._id === ideathon._id
    );

    // Status matching
    let matchesStatus = false;
    if (statusFilter === "registered") {
      matchesStatus = isIdeathonRegistered;
    } else if (statusFilter === "all") {
      matchesStatus = true;
    } else {
      matchesStatus = ideathon.status === statusFilter;
    }
    
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
      <div className="min-h-screen bg-black text-white relative">
        {/* Animated background - matching landing page style */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/[0.03] rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/[0.02] rounded-full animate-spin blur-2xl"></div>
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/[0.04] rounded-full animate-ping blur-lg"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/[0.02] rounded-full animate-bounce blur-xl"></div>
          <div className="absolute top-1/6 right-1/6 w-12 h-12 bg-white/[0.025] rounded-full animate-pulse blur-lg"></div>
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-white/[0.015] rounded-full animate-spin blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <h1 className="text-3xl font-bold text-white">
                  Ideathons & Competitions
                </h1>
                <p className="text-white/70 mt-1">
                  Participate in exciting innovation challenges and win prizes
                </p>
                {/* Floating particles */}
                <div className="absolute top-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search ideathons, themes, or organizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:bg-white/[0.08] transition-all duration-300"
                />
                {/* Debug info */}
                <div className="absolute top-full mt-1 text-xs text-white/50">
                  {`${filteredIdeathons.length} ideathons shown | ${registrations.length} registrations | Filter: ${statusFilter}`}
                </div>
              </div>
              
              <div className="flex gap-4">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/[0.05] border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none focus:bg-white/[0.08] transition-all duration-300"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Active Now</option>
                  <option value="past">Past Events</option>
                </select>

                {/* Registration Filter Button */}
                <button
                  onClick={() => setStatusFilter(statusFilter === 'registered' ? 'all' : 'registered')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    statusFilter === 'registered'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/[0.05] text-white/70 border border-white/20 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <FaFilter className="w-4 h-4" />
                  My Registrations
                  {registrations.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                      {registrations.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-manrope">Available Events</p>
                  <p className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{filteredIdeathons.length}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <FaTrophy className="text-white text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-manrope">Your Registrations</p>
                  <p className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{registrations.length}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <FaUserPlus className="text-white text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-manrope">Total Participants</p>
                  <p className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {filteredIdeathons.reduce((sum, event) => sum + event.participants, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <FaUsers className="text-white text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 group shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-manrope">Prize Pool</p>
                  <p className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">$195K+</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <FaAward className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Featured Events */}
          {filteredIdeathons.filter(event => event.featured).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaStar className="text-white" />
                Featured Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIdeathons.filter(event => event.featured).map((ideathon) => (
                  <div 
                    key={ideathon._id} 
                    className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:from-white/[0.12] hover:to-white/[0.08] transition-all duration-300 shadow-xl hover:scale-105 hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="flex gap-4 mb-4 flex-shrink-0">
                      <img
                        src={ideathon.image || `https://ui-avatars.com/api/?name=${ideathon.title}&background=1f2937&color=ffffff&size=80`}
                        alt={ideathon.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white line-clamp-2 pr-2 leading-tight">{ideathon.title}</h3>
                          <div className="flex gap-2">
                            {isRegistered(ideathon._id) && (
                              <span className="px-3 py-1 rounded-full text-sm border whitespace-nowrap text-purple-400 bg-purple-400/20 border-purple-400/30">
                                Registered
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm border whitespace-nowrap ${getStatusColor(ideathon.status)}`}>
                              {ideathon.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm mb-1 truncate">{ideathon.theme}</p>
                        <p className="text-white/60 text-sm truncate">{ideathon.organizer}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 flex-shrink-0 leading-relaxed">{ideathon.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm flex-shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <FaCalendarAlt className="text-white/60 flex-shrink-0" />
                        <span className="text-white/80 truncate">{formatDate(ideathon.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <FaMapMarkerAlt className="text-white/60 flex-shrink-0" />
                        <span className="text-white/80 truncate">{ideathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <FaUsers className="text-white/60 flex-shrink-0" />
                        <span className="text-white/80 truncate">{ideathon.participants}/{ideathon.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <FaAward className="text-white/60 flex-shrink-0" />
                        <span className="text-white/80 truncate">{ideathon.fundingPrizes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-auto">
                      <button
                        onClick={() => setSelectedIdeathon(ideathon)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
                      >
                        <FaInfoCircle className="text-xs" />
                        Details
                      </button>
                      
                      {isRegistered(ideathon._id) ? (
                        <button
                          disabled
                          className="px-6 py-2 bg-white/20 text-white border border-white/30 rounded-lg text-sm flex items-center gap-2"
                        >
                          <FaCheckCircle className="text-xs" />
                          Registered
                        </button>
                      ) : isRegistrationOpen(ideathon) ? (
                        <button
                          onClick={() => handleRegister(ideathon._id)}
                          disabled={actionLoading[ideathon._id]}
                          className="px-6 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors text-sm flex items-center gap-2 disabled:opacity-50 font-medium"
                        >
                          <FaUserPlus className="text-xs" />
                          {actionLoading[ideathon._id] ? "Registering..." : "Register"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-6 py-2 bg-white/10 text-white/60 border border-white/20 rounded-lg text-sm"
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
                      className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-6 hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 flex flex-col h-full"
                    >
                      <div className="flex items-start justify-between mb-4 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight">{ideathon.title}</h3>
                          <p className="text-white/70 text-sm mb-1 truncate">{ideathon.theme}</p>
                          <p className="text-white/60 text-sm truncate">{ideathon.organizer}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <StatusIcon className={`text-sm ${
                            ideathon.status === 'upcoming' ? 'text-blue-400' : 
                            ideathon.status === 'ongoing' ? 'text-green-400' : 
                            'text-red-400'
                          }`} />
                          <span className={`px-2 py-1 rounded-full text-xs border whitespace-nowrap ${getStatusColor(ideathon.status)}`}>
                            {ideathon.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-4 line-clamp-3 flex-shrink-0 leading-relaxed">{ideathon.description}</p>
                      
                      <div className="space-y-2 mb-4 text-sm flex-shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <FaCalendarAlt className="text-white/60 flex-shrink-0" />
                          <span className="text-white/80 truncate">{formatDate(ideathon.startDate)} - {formatDate(ideathon.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <FaMapMarkerAlt className="text-white/60 flex-shrink-0" />
                          <span className="text-white/80 truncate">{ideathon.location}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <FaAward className="text-white/60 flex-shrink-0" />
                          <span className="text-white/80 truncate">{ideathon.fundingPrizes}</span>
                        </div>
                      </div>
                      
                      {/* Progress bar for participants */}
                      <div className="mb-4 flex-shrink-0">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Participants</span>
                          <span className="text-white/80">{ideathon.participants}/{ideathon.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              ideathon.status === 'upcoming' ? 'bg-blue-400' : 
                              ideathon.status === 'ongoing' ? 'bg-green-400' : 
                              'bg-red-400'
                            }`}
                            style={{ width: `${(ideathon.participants / ideathon.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-white/20 mt-auto">
                        <button
                          onClick={() => setSelectedIdeathon(ideathon)}
                          className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        >
                          <FaInfoCircle className="text-xs" />
                          Details
                        </button>
                        
                        {isRegistered(ideathon._id) ? (
                          <button
                            disabled
                            className="flex-1 px-3 py-2 bg-white/20 text-white border border-white/30 rounded-lg text-sm flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle className="text-xs" />
                            Registered
                          </button>
                        ) : isRegistrationOpen(ideathon) ? (
                          <button
                            onClick={() => handleRegister(ideathon._id)}
                            disabled={actionLoading[ideathon._id]}
                            className="flex-1 px-3 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                          >
                            <FaUserPlus className="text-xs" />
                            {actionLoading[ideathon._id] ? "..." : "Register"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 px-3 py-2 bg-white/10 text-white/60 border border-white/20 rounded-lg text-sm"
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">{selectedIdeathon.title}</h2>
                <button
                  onClick={() => setSelectedIdeathon(null)}
                  className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Theme</h3>
                  <p className="text-white/70">{selectedIdeathon.theme}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-white/80">{selectedIdeathon.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-white/60" />
                        <span className="text-white/80">
                          {formatDate(selectedIdeathon.startDate)} - {formatDate(selectedIdeathon.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-white/60" />
                        <span className="text-white/80">{selectedIdeathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-white/60" />
                        <span className="text-white/80">
                          {selectedIdeathon.participants}/{selectedIdeathon.maxParticipants} participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-white/60" />
                        <span className="text-white/80">
                          Registration deadline: {formatDate(selectedIdeathon.registrationDeadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Prizes</h3>
                    <div className="space-y-2">
                      {selectedIdeathon.prizes?.map((prize, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/[0.05] rounded-lg border border-white/10">
                          <span className="text-white/80">{prize.place} - {prize.description}</span>
                          <span className="text-white font-medium">{formatCurrency(prize.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedIdeathon.requirements && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Requirements</h3>
                    <ul className="space-y-1 text-white/80">
                      {selectedIdeathon.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaCheckCircle className="text-white text-sm" />
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
                        <div key={index} className="flex items-center justify-between p-2 bg-white/[0.05] rounded-lg border border-white/10">
                          <span className="text-white/80">{winner.name}</span>
                          <span className="text-white">{winner.prize}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t border-white/20">
                  <button
                    onClick={() => setSelectedIdeathon(null)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                  
                  {isRegistered(selectedIdeathon._id) ? (
                    <button
                      disabled
                      className="flex-1 px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Already Registered
                    </button>
                  ) : isRegistrationOpen(selectedIdeathon) ? (
                    <button
                      onClick={() => handleRegister(selectedIdeathon._id)}
                      disabled={actionLoading[selectedIdeathon._id]}
                      className="flex-1 px-4 py-3 bg-white text-black hover:bg-white/90 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                    >
                      <FaUserPlus />
                      {actionLoading[selectedIdeathon._id] ? "Registering..." : "Register Now"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 px-4 py-3 bg-white/10 text-white/60 border border-white/20 rounded-lg"
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