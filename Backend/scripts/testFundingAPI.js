// Test script to verify the funding request API returns proper data
const mongoose = require('mongoose');
const FundingRequest = require('../models/FundingRequest.model');
const User = require('../models/User.model');
const Idea = require('../models/Idea.model');
require('dotenv').config();

const testFundingAPI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startsmart');
    console.log('Connected to MongoDB\n');

    // Simulate what the API endpoint does
    const entrepreneurId = '68caa2122543c651d3aba0b3'; // John Entrepreneur

    console.log('Testing getUserFundingRequests for entrepreneur:', entrepreneurId);
    console.log('---\n');

    const requests = await FundingRequest.find({ entrepreneur: entrepreneurId })
      .populate('idea', 'title description category stage')
      .populate('acceptedBy', 'name email role')
      .populate('investorResponses.investor', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${requests.length} funding requests\n`);

    for (const request of requests) {
      console.log('Request ID:', request._id);
      console.log('Idea:', request.idea?.title || 'Unknown');
      console.log('Amount:', request.amount);
      console.log('Equity:', request.equity);
      console.log('Status:', request.status);
      console.log('\nacceptedBy field:');
      if (request.acceptedBy) {
        console.log('  ID:', request.acceptedBy._id);
        console.log('  Name:', request.acceptedBy.name);
        console.log('  Email:', request.acceptedBy.email);
        console.log('  Role:', request.acceptedBy.role);
      } else {
        console.log('  NULL or undefined');
      }
      
      console.log('\ninvestorResponses:');
      if (request.investorResponses && request.investorResponses.length > 0) {
        request.investorResponses.forEach((resp, idx) => {
          console.log(`  [${idx}] Status: ${resp.status}`);
          if (resp.investor) {
            console.log(`      Investor: ${resp.investor.name} (${resp.investor.email})`);
          }
        });
      } else {
        console.log('  None');
      }
      
      console.log('\nacceptedAt:', request.acceptedAt);
      console.log('\n' + '='.repeat(60) + '\n');
    }

    // Test JSON serialization (what gets sent to frontend)
    console.log('\nJSON Response (as frontend receives it):');
    const response = {
      success: true,
      data: requests,
      count: requests.length
    };
    
    const jsonString = JSON.stringify(response, null, 2);
    console.log(jsonString.substring(0, 2000) + '\n...(truncated)');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testFundingAPI();
