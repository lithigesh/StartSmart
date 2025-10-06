require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Get the database
  const db = mongoose.connection.db;
  
  // List all collections
  const collections = await db.listCollections().toArray();
  console.log('Available collections:');
  collections.forEach(collection => {
    console.log(`- ${collection.name}`);
  });
  
  // Check if businessAims collection exists and count documents
  try {
    const businessAimsCount = await db.collection('businessaims').countDocuments();
    console.log(`\nBusinessAims collection documents: ${businessAimsCount}`);
    
    // Also check the actual collection name (in case it's different)
    const businessAimsExplicitCount = await db.collection('businessAims').countDocuments();
    console.log(`BusinessAims (explicit) collection documents: ${businessAimsExplicitCount}`);
    
    // Get a sample document if any exist
    const sampleDoc = await db.collection('businessaims').findOne();
    if (sampleDoc) {
      console.log('Sample document:', JSON.stringify(sampleDoc, null, 2));
    } else {
      console.log('No documents found in businessaims collection');
    }
    
  } catch (error) {
    console.log('Error checking businessAims collection:', error.message);
  }
  
  // Also check ideas collection to make sure we have ideas
  try {
    const ideasCount = await db.collection('ideas').countDocuments();
    console.log(`\nIdeas collection documents: ${ideasCount}`);
    
    const sampleIdea = await db.collection('ideas').findOne();
    if (sampleIdea) {
      console.log('Sample idea:', {
        _id: sampleIdea._id,
        title: sampleIdea.title,
        problemTitle: sampleIdea.problemTitle,
        owner: sampleIdea.owner
      });
    }
  } catch (error) {
    console.log('Error checking ideas collection:', error.message);
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});