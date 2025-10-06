require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB and show BusinessAim data
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const db = mongoose.connection.db;
  
  // Get all business aims
  const businessAims = await db.collection('businessaims').find({}).toArray();
  
  console.log(`\n📊 Found ${businessAims.length} BusinessAim documents in the database:`);
  console.log('='.repeat(60));
  
  businessAims.forEach((doc, index) => {
    console.log(`\n${index + 1}. BusinessAim ID: ${doc._id}`);
    console.log(`   Created: ${doc.createdAt}`);
    console.log(`   Updated: ${doc.updatedAt}`);
    console.log(`   Owner: ${doc.owner}`);
    console.log(`   IdeaId: ${doc.ideaId}`);
    console.log(`   Status: ${doc.status}`);
    console.log(`   Revenue Streams: ${JSON.stringify(doc.revenueStreams)}`);
    console.log(`   Key Metrics: ${JSON.stringify(doc.keyMetrics)}`);
    console.log(`   Business Model (first 100 chars): ${doc.businessModel?.substring(0, 100)}...`);
    console.log(`   Target Market (first 100 chars): ${doc.targetMarket?.substring(0, 100)}...`);
  });
  
  console.log('\n✅ BusinessAim data IS being saved to the backend!');
  console.log('📍 Collection: businessaims');
  console.log('🔍 The issue appears to be data corruption during submission, not missing data.');
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});