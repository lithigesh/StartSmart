// Script to check accepted funding requests data
const mongoose = require('mongoose');
const FundingRequest = require('../models/FundingRequest.model');
const User = require('../models/User.model');
require('dotenv').config();

const checkAcceptedFunding = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startsmart');
    console.log('Connected to MongoDB');

    // Find all accepted requests
    const acceptedRequests = await FundingRequest.find({ 
      status: 'accepted'
    })
    .populate('acceptedBy', 'name email')
    .populate('investorResponses.investor', 'name email')
    .populate('entrepreneur', 'name email');

    console.log(`\nFound ${acceptedRequests.length} accepted requests\n`);

    for (const request of acceptedRequests) {
      console.log(`Request ID: ${request._id}`);
      console.log(`Entrepreneur: ${request.entrepreneur?.name || 'Unknown'}`);
      console.log(`Amount: $${request.amount}`);
      console.log(`Status: ${request.status}`);
      console.log(`acceptedBy:`, request.acceptedBy ? {
        id: request.acceptedBy._id,
        name: request.acceptedBy.name,
        email: request.acceptedBy.email
      } : 'NULL');
      console.log(`acceptedAt:`, request.acceptedAt);
      console.log(`investorResponses:`, request.investorResponses?.map(r => ({
        investor: r.investor ? { id: r.investor._id, name: r.investor.name } : 'NULL',
        status: r.status,
        timestamp: r.timestamp
      })));
      console.log('---\n');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAcceptedFunding();
