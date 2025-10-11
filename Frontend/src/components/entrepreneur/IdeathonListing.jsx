import React, { useState, useEffect } from 'react';
import { FaFilter, FaSpinner, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import { ideathonRegistrationAPI } from '../../services/ideathonRegistration';
import IdeathonRegistrationDetails from './IdeathonRegistrationDetails';

const IdeathonListing = () => {
  // State management
  const [ideathons, setIdeathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistered, setShowRegistered] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Fetch user's registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ideathonRegistrationAPI.getUserRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View registration details
  const handleViewDetails = async (registrationId) => {
    try {
      const details = await ideathonRegistrationAPI.getRegistrationDetails(registrationId);
      setSelectedRegistration(details);
    } catch (err) {
      console.error('Error fetching details:', err);
      // You might want to show an error toast here
    }
  };

  // Filter ideathons based on search and registration status
  const filteredIdeathons = ideathons.filter(ideathon => {
    const matchesSearch = ideathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ideathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showRegistered) {
      return matchesSearch && registrations.some(reg => reg.ideathonId === ideathon._id);
    }
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Ideathons</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search ideathons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-white/30"
          />
          
          {/* Registration Filter */}
          <button
            onClick={() => setShowRegistered(!showRegistered)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showRegistered 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-900 text-white/60 hover:text-white border border-gray-700'
            }`}
          >
            <FaFilter className="w-4 h-4" />
            {showRegistered ? 'Registered Only' : 'All Ideathons'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="w-8 h-8 text-white animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeathons.map(ideathon => {
            const isRegistered = registrations.some(reg => reg.ideathonId === ideathon._id);
            const registration = registrations.find(reg => reg.ideathonId === ideathon._id);

            return (
              <div 
                key={ideathon._id}
                className="p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                {/* Status Badge */}
                {isRegistered && (
                  <div className="mb-4 inline-block px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full">
                    <span className="text-blue-400 text-sm">Registered</span>
                  </div>
                )}

                {/* Ideathon Info */}
                <h3 className="text-xl font-bold text-white mb-2">{ideathon.title}</h3>
                <p className="text-white/60 mb-4">{ideathon.description}</p>

                {/* Registration Details Button */}
                {isRegistered && (
                  <button
                    onClick={() => handleViewDetails(registration._id)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Registration Details
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <IdeathonRegistrationDetails
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}
    </div>
  );
};

export default IdeathonListing;