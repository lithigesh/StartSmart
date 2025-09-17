import React, { useState, useEffect } from "react";
import { collaborationAPI } from "../services/api";
import { useNotifications } from "../hooks/useNotifications";
import { 
  FaHandshake, 
  FaUsers,
  FaBriefcase,
  FaGraduationCap,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaPlus,
  FaCheck,
  FaTimes,
  FaEye,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaCrown
} from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";

const CollaborationsPage = () => {
  const { addNotification } = useNotifications();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaborations, setCollaborations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // mentorship, partnership, sponsor
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [selectedTab, setSelectedTab] = useState("mentors");

  useEffect(() => {
    loadCollaborationsData();
  }, []);

  const loadCollaborationsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load real data, fallback to demo data
      const [collaborationsResponse, mentorsResponse, partnershipsResponse] = await Promise.all([
        collaborationAPI?.getUserCollaborations().catch(() => ({ data: [] })),
        collaborationAPI?.getMentors().catch(() => ({ data: [] })),
        collaborationAPI?.getPartnerships().catch(() => ({ data: [] }))
      ].map(p => p || Promise.resolve({ data: [] })));
      
      const collaborationsData = collaborationsResponse?.data || [];
      const mentorsData = mentorsResponse?.data || [];
      const partnershipsData = partnershipsResponse?.data || [];
      
      // If no real data, show demo data
      if (collaborationsData.length === 0 && mentorsData.length === 0) {
        const demoData = generateDemoCollaborations();
        setCollaborations(demoData.collaborations);
        setMentors(demoData.mentors);
        setPartnerships(demoData.partnerships);
        addNotification("Using demo data - API connection unavailable", "warning");
      } else {
        setCollaborations(collaborationsData);
        setMentors(mentorsData);
        setPartnerships(partnershipsData);
      }
    } catch (err) {
      console.error("Error loading collaborations data:", err);
      setError(err.message);
      
      // Show demo data on error
      const demoData = generateDemoCollaborations();
      setCollaborations(demoData.collaborations);
      setMentors(demoData.mentors);
      setPartnerships(demoData.partnerships);
      addNotification("Using demo data - API connection failed", "warning");
    } finally {
      setLoading(false);
    }
  };

  const generateDemoCollaborations = () => ({
    mentors: [
      {
        _id: "1",
        name: "Dr. Sarah Johnson",
        title: "AI Research Director",
        company: "TechCorp Inc.",
        expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
        experience: "15+ years",
        location: "San Francisco, CA",
        bio: "Former Google AI researcher with expertise in deep learning and neural networks. Passionate about helping entrepreneurs build AI-powered solutions.",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        rating: 4.9,
        sessionsCompleted: 127,
        availability: "Available",
        hourlyRate: 200,
        linkedin: "https://linkedin.com/in/sarahjohnson",
        website: "https://sarahjohnson.ai",
        isVerified: true,
        responseTime: "2 hours",
        languages: ["English", "Spanish"]
      },
      {
        _id: "2",
        name: "Marcus Chen",
        title: "Startup Founder & CEO",
        company: "InnovateLab",
        expertise: ["Product Management", "Business Strategy", "Fundraising"],
        experience: "12+ years",
        location: "Austin, TX",
        bio: "Serial entrepreneur with 3 successful exits. Specializes in B2B SaaS and marketplace business models.",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4.7,
        sessionsCompleted: 89,
        availability: "Busy",
        hourlyRate: 150,
        linkedin: "https://linkedin.com/in/marcuschen",
        website: "https://innovatelab.com",
        isVerified: true,
        responseTime: "4 hours",
        languages: ["English", "Mandarin"]
      },
      {
        _id: "3",
        name: "Emily Rodriguez",
        title: "VC Partner",
        company: "Future Fund",
        expertise: ["Venture Capital", "Financial Modeling", "Due Diligence"],
        experience: "10+ years",
        location: "New York, NY",
        bio: "Investment professional focused on early-stage tech startups. Former founder with deep understanding of the entrepreneur journey.",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4.8,
        sessionsCompleted: 156,
        availability: "Available",
        hourlyRate: 250,
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        isVerified: true,
        responseTime: "1 hour",
        languages: ["English"]
      }
    ],
    partnerships: [
      {
        _id: "1",
        name: "Microsoft for Startups",
        type: "Technology Partner",
        description: "Access to Azure credits, technical support, and co-marketing opportunities for eligible startups.",
        logo: "https://img.icons8.com/color/96/microsoft.png",
        benefits: [
          "$150,000 in Azure credits",
          "Technical mentorship",
          "Go-to-market support",
          "Access to Microsoft customers"
        ],
        requirements: [
          "Early-stage startup",
          "Less than $10M in funding",
          "Technology-focused business"
        ],
        status: "Available",
        applicationDeadline: "Ongoing",
        website: "https://startups.microsoft.com",
        contactEmail: "startups@microsoft.com",
        industry: ["Technology", "SaaS", "AI/ML"]
      },
      {
        _id: "2",
        name: "AWS Activate",
        type: "Cloud Partner",
        description: "Comprehensive startup program with cloud credits, technical training, and business support.",
        logo: "https://img.icons8.com/color/96/amazon-web-services.png",
        benefits: [
          "Up to $100,000 in AWS credits",
          "Technical training and certification",
          "Architecture reviews",
          "Startup community access"
        ],
        requirements: [
          "Funded startup or accelerator participation",
          "Less than 5 years old",
          "Building on AWS"
        ],
        status: "Available",
        applicationDeadline: "Ongoing",
        website: "https://aws.amazon.com/activate",
        contactEmail: "activate@amazon.com",
        industry: ["Technology", "SaaS", "Mobile"]
      },
      {
        _id: "3",
        name: "Y Combinator Startup School",
        type: "Accelerator",
        description: "Free online program for early-stage startups with mentorship and resources.",
        logo: "https://img.icons8.com/color/96/y-combinator.png",
        benefits: [
          "Free startup education",
          "Mentor matching",
          "Peer network access",
          "Demo day opportunity"
        ],
        requirements: [
          "Early-stage startup",
          "Founding team commitment",
          "Weekly progress updates"
        ],
        status: "Applications Open",
        applicationDeadline: "March 15, 2024",
        website: "https://startupschool.org",
        contactEmail: "startupschool@ycombinator.com",
        industry: ["All Industries"]
      }
    ],
    collaborations: [
      {
        _id: "1",
        type: "mentorship",
        mentor: "Dr. Sarah Johnson",
        status: "active",
        startDate: "2024-01-15",
        sessionsCompleted: 8,
        nextSession: "2024-02-20",
        focus: "AI Product Development"
      },
      {
        _id: "2",
        type: "partnership",
        partner: "Microsoft for Startups",
        status: "pending",
        appliedDate: "2024-02-01",
        focus: "Cloud Infrastructure"
      }
    ]
  });

  const handleConnectMentor = async (mentorId) => {
    try {
      setActionLoading({ [mentorId]: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification("Mentorship request sent successfully!", "success");
    } catch (err) {
      console.error("Error connecting to mentor:", err);
      addNotification(err.message || "Failed to send mentorship request", "error");
    } finally {
      setActionLoading({ [mentorId]: false });
    }
  };

  const handleApplyPartnership = async (partnershipId) => {
    try {
      setActionLoading({ [partnershipId]: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification("Partnership application submitted!", "success");
    } catch (err) {
      console.error("Error applying for partnership:", err);
      addNotification(err.message || "Failed to submit partnership application", "error");
    } finally {
      setActionLoading({ [partnershipId]: false });
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Busy': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Unavailable': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Applications Open': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Closed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter data based on selected tab
  const getFilteredData = () => {
    switch (selectedTab) {
      case 'mentors':
        return mentors.filter(mentor => 
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
          mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'partnerships':
        return partnerships.filter(partnership =>
          partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partnership.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partnership.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'active':
        return collaborations;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading collaborations...</p>
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
                  Collaborations & Mentorship
                </h1>
                <p className="text-gray-400 mt-1">
                  Connect with mentors, partners, and build valuable relationships
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-6">
              <button
                onClick={() => setSelectedTab("mentors")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "mentors"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <FaGraduationCap className="inline mr-2" />
                Find Mentors
              </button>
              <button
                onClick={() => setSelectedTab("partnerships")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "partnerships"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <FaBuilding className="inline mr-2" />
                Partnerships
              </button>
              <button
                onClick={() => setSelectedTab("active")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "active"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <FaHandshake className="inline mr-2" />
                Active Collaborations
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${selectedTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Available Mentors</p>
                  <p className="text-2xl font-bold text-white">{mentors.length}</p>
                </div>
                <FaGraduationCap className="text-blue-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Partnerships</p>
                  <p className="text-2xl font-bold text-green-400">{partnerships.length}</p>
                </div>
                <FaBuilding className="text-green-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Collaborations</p>
                  <p className="text-2xl font-bold text-purple-400">{collaborations.length}</p>
                </div>
                <FaHandshake className="text-purple-400 text-2xl" />
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sessions Completed</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {collaborations.filter(c => c.type === 'mentorship').reduce((sum, c) => sum + (c.sessionsCompleted || 0), 0)}
                  </p>
                </div>
                <FaCalendarAlt className="text-yellow-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Content based on selected tab */}
          {selectedTab === "mentors" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredData().map((mentor) => (
                <div 
                  key={mentor._id} 
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={mentor.profileImage || `https://ui-avatars.com/api/?name=${mentor.name}&background=1f2937&color=ffffff`}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                      />
                      {mentor.isVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaStar className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{mentor.name}</h3>
                      <p className="text-blue-400 text-sm mb-1">{mentor.title}</p>
                      <p className="text-gray-400 text-sm">{mentor.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-gray-400 text-sm">{mentor.rating}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getAvailabilityColor(mentor.availability)}`}>
                        {mentor.availability}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{mentor.bio}</p>

                  {/* Expertise */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-gray-300">{mentor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-gray-400" />
                      <span className="text-gray-300">{mentor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-gray-300">{mentor.sessionsCompleted} sessions completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCrown className="text-gray-400" />
                      <span className="text-gray-300">{formatCurrency(mentor.hourlyRate)}/hour</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      {mentor.linkedin && (
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                        >
                          <FaLinkedin className="text-sm" />
                        </a>
                      )}
                      {mentor.website && (
                        <a
                          href={mentor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors"
                        >
                          <FaGlobe className="text-sm" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex-1 flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <FaEnvelope className="text-xs" />
                        Message
                      </button>
                      
                      <button
                        onClick={() => handleConnectMentor(mentor._id)}
                        disabled={actionLoading[mentor._id] || mentor.availability === 'Unavailable'}
                        className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FaHandshake className="text-xs" />
                        {actionLoading[mentor._id] ? "Connecting..." : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "partnerships" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredData().map((partnership) => (
                <div 
                  key={partnership._id} 
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={partnership.logo}
                      alt={partnership.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{partnership.name}</h3>
                      <p className="text-blue-400 text-sm mb-1">{partnership.type}</p>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(partnership.status)}`}>
                        {partnership.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4">{partnership.description}</p>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {partnership.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <FaCheck className="text-green-400 text-xs" />
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                      {partnership.benefits.length > 3 && (
                        <li className="text-gray-400 text-sm">
                          +{partnership.benefits.length - 3} more benefits
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {partnership.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <FaEye className="text-blue-400 text-xs" />
                          <span className="text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Industries */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {partnership.industry.map((industry, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <a
                      href={partnership.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <FaGlobe className="text-xs" />
                      Visit Website
                    </a>
                    
                    <button
                      onClick={() => handleApplyPartnership(partnership._id)}
                      disabled={actionLoading[partnership._id] || partnership.status === 'Closed'}
                      className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaPlus className="text-xs" />
                      {actionLoading[partnership._id] ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "active" && (
            <div className="space-y-6">
              {getFilteredData().length === 0 ? (
                <EmptyState
                  icon={FaHandshake}
                  title="No Active Collaborations"
                  description="Start building relationships by connecting with mentors or applying for partnerships"
                  actionText="Find Mentors"
                  onAction={() => setSelectedTab("mentors")}
                />
              ) : (
                getFilteredData().map((collaboration) => (
                  <div 
                    key={collaboration._id} 
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {collaboration.type === 'mentorship' ? 'Mentorship with ' : 'Partnership with '}
                          {collaboration.mentor || collaboration.partner}
                        </h3>
                        <p className="text-blue-400 text-sm">{collaboration.focus}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm border ${
                        collaboration.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                        collaboration.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                        'text-gray-400 bg-gray-400/10 border-gray-400/20'
                      }`}>
                        {collaboration.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-300">
                          Started: {new Date(collaboration.startDate || collaboration.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                      {collaboration.sessionsCompleted && (
                        <div className="flex items-center gap-2">
                          <FaUsers className="text-gray-400" />
                          <span className="text-gray-300">{collaboration.sessionsCompleted} sessions completed</span>
                        </div>
                      )}
                      {collaboration.nextSession && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span className="text-gray-300">
                            Next: {new Date(collaboration.nextSession).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CollaborationsPage;