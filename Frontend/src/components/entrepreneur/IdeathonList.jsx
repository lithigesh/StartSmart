import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendar, FaClock, FaMapMarkerAlt, FaTrophy, FaUsers } from 'react-icons/fa';
import { API_URL } from '../../config/config';

const IdeathonList = () => {
  const [ideathons, setIdeathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load ideathons and registrations
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Fetch both ideathons and registrations in parallel
      const [ideathonsRes, registrationsRes] = await Promise.all([
        fetch(`${API_URL}/api/ideathons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/ideathons/user/registrations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (!ideathonsRes.ok || !registrationsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const ideathonsData = await ideathonsRes.json();
      const registrationsData = await registrationsRes.json();

      console.log('Fetched ideathons:', ideathonsData);
      console.log('Fetched registrations:', registrationsData);

      setIdeathons(ideathonsData.data || []);
      setRegistrations(registrationsData.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter ideathons based on search and filter type
  const filteredIdeathons = ideathons.filter(ideathon => {
    const matchesSearch = !searchTerm || 
      ideathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ideathon.description.toLowerCase().includes(searchTerm.toLowerCase());

    const isRegistered = registrations.some(reg => 
      reg.ideathon === ideathon._id || 
      reg.ideathonId === ideathon._id
    );

    switch (filterType) {
      case 'registered':
        return matchesSearch && isRegistered;
      case 'upcoming':
        return matchesSearch && ideathon.status === 'upcoming';
      case 'active':
        return matchesSearch && ideathon.status === 'active';
      case 'past':
        return matchesSearch && ideathon.status === 'past';
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-white text-lg mb-2">Search Ideathons</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <h2 className="text-white text-lg mb-2">Status</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-64 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
          >
            <option value="all">All Status</option>
            <option value="registered">My Registrations</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active Now</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Ideathons Grid */}
      {error ? (
        <div className="text-red-500 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      ) : filteredIdeathons.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400">No ideathons found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeathons.map(ideathon => {
            const isRegistered = registrations.some(reg => 
              reg.ideathon === ideathon._id || 
              reg.ideathonId === ideathon._id
            );

            return (
              <div key={ideathon._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-2">
                    {isRegistered && (
                      <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                        Registered
                      </span>
                    )}
                    <span className={
                      ideathon.status === 'upcoming' ? 'px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      ideathon.status === 'active' ? 'px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-300 border border-green-500/30' :
                      'px-3 py-1 text-sm rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }>
                      {ideathon.status.charAt(0).toUpperCase() + ideathon.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-white mb-2">{ideathon.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{ideathon.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400">
                    <FaCalendar className="w-4 h-4 mr-2" />
                    <span>{new Date(ideathon.startDate).toLocaleDateString()} - {new Date(ideathon.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    <span>{ideathon.location}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaUsers className="w-4 h-4 mr-2" />
                    <span>{ideathon.participants}/{ideathon.maxParticipants} Participants</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaTrophy className="w-4 h-4 mr-2" />
                    <span>{ideathon.prizePool}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={isRegistered}
                  className={
                    isRegistered
                      ? 'w-full py-2 px-4 rounded-lg transition-colors bg-purple-500/20 text-purple-300 cursor-not-allowed'
                      : 'w-full py-2 px-4 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white'
                  }
                >
                  {isRegistered ? 'Already Registered' : 'Register Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IdeathonList;