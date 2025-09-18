const mongoose = require('mongoose');
require('dotenv').config();
const Ideathon = require('../models/Ideathon.model');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Sample ideathons data with all required fields
const sampleIdeathons = [
    {
        title: 'AI for Healthcare Innovation Challenge',
        theme: 'Artificial Intelligence in Medical Technology',
        description: 'Join us in revolutionizing healthcare through AI-powered solutions. This ideathon focuses on developing innovative AI applications that can improve patient care, streamline medical processes, and enhance diagnostic accuracy. Participants will work on real-world healthcare challenges with access to anonymized medical datasets and expert mentorship from leading healthcare professionals and AI researchers.',
        organizers: 'MIT Technology Lab & Google Health',
        submissionFormat: ['Pitch Deck', 'Prototype', 'Code Repository', 'Demo'],
        eligibilityCriteria: 'Open to students, professionals, and startups worldwide. Basic knowledge of AI/ML required. Teams of 2-5 members preferred. Must have at least one member with healthcare or medical background.',
        judgingCriteria: 'Innovation (30%), Technical feasibility (25%), Market impact (20%), Presentation quality (15%), Team collaboration (10%)',
        location: 'Hybrid',
        contactInformation: 'Contact: ai-healthcare@mit.edu | Phone: +1-555-AI-HEALTH | Website: ai-healthcare-challenge.mit.edu',
        fundingPrizes: '1st Place: $100,000, 2nd Place: $50,000, 3rd Place: $25,000, Special AI Innovation Award: $15,000',
        startDate: new Date('2025-12-15T09:00:00Z'),
        endDate: new Date('2025-12-17T18:00:00Z'),
        status: 'upcoming',
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: 'Sustainable Energy Solutions Hackathon',
        theme: 'Green Technology and Renewable Energy',
        description: 'Address the global energy crisis by developing innovative sustainable energy solutions. Focus areas include solar power optimization, wind energy efficiency, energy storage systems, and smart grid technologies. Create solutions that can be implemented in real-world scenarios to reduce carbon footprint and promote environmental sustainability.',
        organizers: 'Stanford Clean Energy Institute & Tesla',
        submissionFormat: ['Business Document', 'Prototype', 'Video Presentation', 'Research Paper'],
        eligibilityCriteria: 'Open to university students, recent graduates, and professionals in engineering, environmental science, or related fields. International participation welcome. Background in renewable energy preferred but not mandatory.',
        judgingCriteria: 'Environmental impact (35%), Technical innovation (25%), Scalability (20%), Economic viability (15%), Implementation feasibility (5%)',
        location: 'Offline',
        contactInformation: 'Email: green-energy@stanford.edu | Slack: #green-energy-hack | Phone: +1-650-ENERGY-1',
        fundingPrizes: '1st: $75,000 + Incubator Program, 2nd: $40,000, 3rd: $20,000, People\'s Choice: $10,000',
        startDate: new Date('2026-01-22T08:00:00Z'),
        endDate: new Date('2026-01-24T20:00:00Z'),
        status: 'upcoming',
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: 'FinTech Innovation Summit 2024',
        theme: 'Financial Technology and Digital Banking',
        description: 'Transform the future of finance with cutting-edge fintech solutions. Develop applications for digital payments, blockchain integration, personal finance management, investment platforms, and financial inclusion initiatives for underserved communities. Focus on creating secure, scalable, and user-friendly financial technologies.',
        organizers: 'JPMorgan Chase & Y Combinator',
        submissionFormat: ['Pitch Deck', 'Code Repository', 'Demo', 'Business Document'],
        eligibilityCriteria: 'Software developers, finance professionals, entrepreneurs, and students. Must have at least one team member with programming experience. Global participation encouraged. FinTech experience is a plus.',
        judgingCriteria: 'Innovation and creativity (30%), Technical excellence (25%), Market potential (20%), User experience (15%), Security implementation (10%)',
        location: 'Online',
        contactInformation: 'fintech-summit@jpmorgan.com | Discord: FinTech-Innovate-2024 | Support: +1-212-FINTECH',
        fundingPrizes: '1st Place: $150,000 + Mentorship, 2nd: $75,000, 3rd: $35,000, Best Security Solution: $25,000',
        startDate: new Date('2026-02-10T10:00:00Z'),
        endDate: new Date('2026-02-12T22:00:00Z'),
        status: 'upcoming',
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: 'EdTech Learning Revolution',
        theme: 'Educational Technology and E-Learning',
        description: 'Reimagine education for the digital age. Create innovative learning platforms, VR/AR educational experiences, AI-powered tutoring systems, and accessibility tools that make quality education available to everyone, everywhere. Focus on addressing learning gaps and improving educational outcomes through technology.',
        organizers: 'Harvard Graduate School of Education & Coursera',
        submissionFormat: ['Prototype', 'Video Presentation', 'Pitch Deck', 'Demo'],
        eligibilityCriteria: 'Educators, students, developers, and education enthusiasts. Cross-disciplinary teams encouraged. Must include at least one educator or education researcher. Experience in pedagogy or educational psychology preferred.',
        judgingCriteria: 'Educational impact (40%), Innovation (25%), User engagement (20%), Accessibility (10%), Sustainability (5%)',
        location: 'Hybrid',
        contactInformation: 'Contact: edtech-revolution@harvard.edu | Teams: EdTech-Challenge | Office: +1-617-EDU-TECH',
        fundingPrizes: '1st: $80,000 + Harvard Incubator, 2nd: $45,000, 3rd: $25,000, Best Accessibility Tool: $15,000',
        startDate: new Date('2026-03-01T09:00:00Z'),
        endDate: new Date('2026-03-03T17:00:00Z'),
        status: 'upcoming',
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: 'Smart Cities & IoT Challenge',
        theme: 'Internet of Things and Urban Technology',
        description: 'Build the cities of tomorrow with IoT and smart technology solutions. Focus on smart transportation, waste management, air quality monitoring, energy efficiency, and citizen engagement platforms that improve urban living. Develop solutions that can be deployed in real urban environments.',
        organizers: 'Microsoft & City of San Francisco',
        submissionFormat: ['Code Repository', 'Prototype', 'Pitch Deck', 'Business Document'],
        eligibilityCriteria: 'Software engineers, urban planners, IoT specialists, and civic tech enthusiasts. Teams must demonstrate understanding of both technical and urban planning aspects. Background in IoT or smart city technologies preferred.',
        judgingCriteria: 'Real-world applicability (35%), Technical sophistication (25%), Citizen impact (20%), Scalability (15%), Data privacy (5%)',
        location: 'Offline',
        contactInformation: 'smart-cities@microsoft.com | Telegram: @SmartCitiesChallenge | Phone: +1-415-SMART-SF',
        fundingPrizes: '1st Place: $120,000 + Pilot Program, 2nd: $60,000, 3rd: $30,000, Best Civic Impact: $20,000',
        startDate: new Date('2026-04-15T08:30:00Z'),
        endDate: new Date('2026-04-17T19:00:00Z'),
        status: 'upcoming',
        createdBy: new mongoose.Types.ObjectId()
    }
];

async function populateIdeathons() {
    try {
        await connectDB();
        
        // Clear existing ideathons
        console.log('Clearing existing ideathons...');
        await Ideathon.deleteMany({});
        
        // Insert sample ideathons
        console.log('Inserting sample ideathons...');
        const result = await Ideathon.insertMany(sampleIdeathons);
        
        console.log(`Successfully created ${result.length} sample ideathons:`);
        result.forEach((ideathon, index) => {
            console.log(`${index + 1}. ${ideathon.title} - ${ideathon.status}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample ideathons:', error);
        process.exit(1);
    }
}

// Run the population script
populateIdeathons();