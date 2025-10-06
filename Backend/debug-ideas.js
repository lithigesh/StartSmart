// Quick script to check ideas in database
require('dotenv').config();
const mongoose = require('mongoose');
const Idea = require('./models/Idea.model');
const User = require('./models/User.model'); // Need this for the ref

async function checkIdeas() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const ideas = await Idea.find({}).sort({ createdAt: -1 });
        console.log(`Found ${ideas.length} ideas in database:`);
        
        if (ideas.length === 0) {
            console.log('No ideas found. Submit an idea through the frontend to see data here.');
        }
        
        ideas.forEach((idea, index) => {
            console.log(`\n--- Idea ${index + 1} ---`);
            console.log(`ID: ${idea._id}`);
            console.log(`Title: ${idea.title}`);
            console.log(`Category: ${idea.category}`);
            console.log(`Owner ID: ${idea.owner}`);
            console.log(`Status: ${idea.status}`);
            console.log(`Created: ${idea.createdAt}`);
            console.log(`Description: ${idea.description?.substring(0, 100)}...`);
        });
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkIdeas();