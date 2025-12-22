// Script to fix accepted funding requests that don't have acceptedBy field
const mongoose = require('mongoose');
const FundingRequest = require('../models/FundingRequest.model');
require('dotenv').config();

const fixAcceptedFunding = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startsmart');
    console.log('Connected to MongoDB');

    // Find all accepted requests without acceptedBy
    const acceptedRequests = await FundingRequest.find({ 
      status: 'accepted',
      acceptedBy: { $exists: false }
    }).populate('investorResponses.investor', 'name email');

    console.log(`Found ${acceptedRequests.length} accepted requests without acceptedBy field`);

    for (const request of acceptedRequests) {
      // Find the investor who accepted from investorResponses
      const acceptedResponse = request.investorResponses?.find(r => r.status === 'accepted');
      
      if (acceptedResponse && acceptedResponse.investor) {
        console.log(`Fixing request ${request._id}: Setting acceptedBy to ${acceptedResponse.investor._id}`);
        
        request.acceptedBy = acceptedResponse.investor._id;
        if (!request.acceptedAt) {
          request.acceptedAt = acceptedResponse.timestamp || new Date();
        }
        await request.save();
        
        console.log(`✅ Fixed request ${request._id}`);
      } else {
        console.log(`⚠️  Request ${request._id} has no accepted investor in responses`);
      }
    }

    console.log('\n✅ Migration completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAcceptedFunding();
