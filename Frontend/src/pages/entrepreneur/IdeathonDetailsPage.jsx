import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import IdeathonRegistrationForm from "../../components/entrepreneur/IdeathonRegistrationForm";
import {
  FaTrophy,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaClock,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaInfoCircle,
  FaTimes
} from "react-icons/fa";

const IdeathonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ideathon, setIdeathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    fetchIdeathonDetails();
    checkRegistrationStatus();
  }, [id]);

  const fetchIdeathonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ideathons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ideathon details");
      }

      const data = await response.json();
      setIdeathon(data.data || data);
    } catch (err) {
      console.error("Error fetching ideathon:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ideathons/my-registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const registrations = data.data || data;
        const registered = registrations.some(
          (reg) => reg.ideathonId?._id === id || reg.ideathonId === id
        );
        setIsRegistered(registered);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIdeathonStatus = (ideathon) => {
    if (!ideathon) return { status: 'unknown', label: 'Unknown', color: 'gray' };
    
    const now = new Date();
    const startDate = new Date(ideathon.startDate);
    const endDate = new Date(ideathon.endDate);

    if (now < startDate) {
      return {
        status: 'upcoming',
        label: 'Upcoming',
        color: 'blue'
      };
    } else if (now >= startDate && now <= endDate) {
      return {
        status: 'active',
        label: 'Active Now',
        color: 'green'
      };
    } else {
      return {
        status: 'expired',
        label: 'Ended',
        color: 'red'
      };
    }
  };

  const getStatusColor = (statusInfo) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[statusInfo.color] || colors.gray;
  };

  const handleRegisterClick = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowRegistrationModal(false);
    fetchIdeathonDetails();
    checkRegistrationStatus();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-white/50" />
        </div>
      </div>
    );
  }

  if (error || !ideathon) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-6 text-center">
            <FaTimes className="text-5xl text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Ideathon</h2>
            <p className="text-red-400 mb-4">{error || "Ideathon not found"}</p>
            <button
              onClick={() => navigate("/entrepreneur/ideathons")}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              Back to Ideathons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getIdeathonStatus(ideathon);

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/entrepreneur/ideathons")}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300"
        >
          <FaArrowLeft />
          Back to Ideathons
        </button>

        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{ideathon.title}</h1>
              
              {/* Status and Registration Badges */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(statusInfo)}`}>
                  {statusInfo.label}
                </span>
                {isRegistered && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2">
                    <FaCheckCircle />
                    Registered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Theme */}
          {ideathon.theme && (
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h2 className="text-white/70 text-sm font-semibold uppercase mb-1">Theme</h2>
              <p className="text-white text-lg">{ideathon.theme}</p>
            </div>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Organizer */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="text-white/50" />
                <h3 className="text-white/70 text-sm font-semibold uppercase">Organizer</h3>
              </div>
              <p className="text-white text-lg">{ideathon.organizer}</p>
            </div>

            {/* Dates */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-white/50" />
                <h3 className="text-white/70 text-sm font-semibold uppercase">Duration</h3>
              </div>
              <p className="text-white text-lg">
                {formatDate(ideathon.startDate)} - {formatDate(ideathon.endDate)}
              </p>
            </div>

            {/* Location */}
            {ideathon.location && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-white/50" />
                  <h3 className="text-white/70 text-sm font-semibold uppercase">Location</h3>
                </div>
                <p className="text-white text-lg">{ideathon.location}</p>
              </div>
            )}

            {/* Prize Pool */}
            {ideathon.fundingPrizes && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaTrophy className="text-yellow-400" />
                  <h3 className="text-white/70 text-sm font-semibold uppercase">Prize Pool</h3>
                </div>
                <p className="text-white text-lg font-semibold">{ideathon.fundingPrizes}</p>
              </div>
            )}

            {/* Participants */}
            {ideathon.participantsCount !== undefined && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-white/50" />
                  <h3 className="text-white/70 text-sm font-semibold uppercase">Participants</h3>
                </div>
                <p className="text-white text-lg">{ideathon.participantsCount} Teams</p>
              </div>
            )}
          </div>

          {/* Description */}
          {ideathon.description && (
            <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-white/50" />
                <h2 className="text-white/90 text-xl font-semibold">Description</h2>
              </div>
              <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
                {ideathon.description}
              </p>
            </div>
          )}

          {/* Submission Format */}
          {ideathon.submissionFormat && ideathon.submissionFormat.length > 0 && (
            <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-white/50" />
                <h2 className="text-white/90 text-xl font-semibold">Submission Format</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {ideathon.submissionFormat.map((format, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Criteria */}
          {ideathon.eligibilityCriteria && (
            <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaUsers className="text-white/50" />
                <h2 className="text-white/90 text-xl font-semibold">Eligibility Criteria</h2>
              </div>
              <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
                {ideathon.eligibilityCriteria}
              </p>
            </div>
          )}

          {/* Judging Criteria */}
          {ideathon.judgingCriteria && (
            <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaTrophy className="text-yellow-400" />
                <h2 className="text-white/90 text-xl font-semibold">Judging Criteria</h2>
              </div>
              <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
                {ideathon.judgingCriteria}
              </p>
            </div>
          )}

          {/* Contact Information */}
          {ideathon.contactInformation && (
            <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-white/50" />
                <h2 className="text-white/90 text-xl font-semibold">Contact Information</h2>
              </div>
              <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
                {ideathon.contactInformation}
              </p>
            </div>
          )}

          {/* Registration Button */}
          {!isRegistered && statusInfo.status !== 'expired' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRegisterClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-3 border border-blue-400/30 shadow-lg"
              >
                <FaTrophy />
                Register for This Ideathon
              </button>
            </div>
          )}

          {statusInfo.status === 'expired' && !isRegistered && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">
                <FaClock />
                <span className="font-medium">Registration has ended for this ideathon</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <IdeathonRegistrationForm
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          ideathonId={id}
          ideathonTitle={ideathon?.title}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default IdeathonDetailsPage;
