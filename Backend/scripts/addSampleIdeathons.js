const mongoose = require('mongoose');
const Ideathon = require('../models/Ideathon.model');
const User = require('../models/User.model');
const connectDB = require('../config/db');
require('dotenv').config();

const sampleIdeathons = [
    {
        title: "Global Innovation Challenge 2024",
        description: "A worldwide competition for groundbreaking innovations that solve real-world problems. We're looking for creative solutions that can make a positive impact on society, environment, and technology.",
        theme: "Innovation for Global Impact",
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-15'),
        location: "Virtual & San Francisco",
        organizers: "Innovation Hub, TechForGood Foundation",
        fundingPrizes: "1st Place: $100,000, 2nd Place: $50,000, 3rd Place: $25,000",
        submissionFormat: ["Business Plan", "Prototype Demo", "Pitch Deck", "Impact Report"],
        eligibilityCriteria: "Open to individuals and teams worldwide. Must have a working prototype or clear implementation plan.",
        judgingCriteria: "Innovation (30%), Market Potential (25%), Social Impact (25%), Technical Feasibility (20%)",
        contactInformation: "info@globalinnovation.org",
        status: "active",
        registrationDeadline: new Date('2024-02-15'),
        maxParticipants: 500,
        currentParticipants: 234
    },
    {
        title: "AI for Good Hackathon",
        description: "Develop AI solutions that create positive social impact and address humanitarian challenges. Focus on areas like healthcare, education, climate change, and social justice.",
        theme: "Artificial Intelligence for Social Good",
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-28'),
        location: "Boston, MA",
        organizers: "AI Foundation, MIT Innovation Lab",
        fundingPrizes: "Winner: $50,000, Runner-up: $25,000, People's Choice: $10,000",
        submissionFormat: ["AI/ML Model", "Demo Video", "Code Repository", "Social Impact Assessment"],
        eligibilityCriteria: "Teams of 2-4 members with AI/ML experience. Must focus on social impact applications.",
        judgingCriteria: "Social Impact (40%), Technical Innovation (30%), Feasibility (20%), Scalability (10%)",
        contactInformation: "hackathon@aiforgood.org",
        status: "active",
        registrationDeadline: new Date('2024-01-25'),
        maxParticipants: 200,
        currentParticipants: 156
    },
    {
        title: "Green Tech Innovation Awards",
        description: "Showcase sustainable technology solutions for environmental challenges. Focus on clean energy, waste reduction, carbon capture, and sustainable agriculture.",
        theme: "Sustainable Technology Solutions",
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-30'),
        location: "Austin, TX",
        organizers: "EcoTech Alliance, Green Innovation Network",
        fundingPrizes: "Grand Prize: $75,000, Category Winners: $30,000 each, Startup Award: $15,000",
        submissionFormat: ["Environmental Impact Report", "Technology Demo", "Business Model", "Scalability Plan"],
        eligibilityCriteria: "Environmental technology focus required. Both startups and established companies welcome.",
        judgingCriteria: "Environmental Impact (35%), Innovation (25%), Market Viability (25%), Scalability (15%)",
        contactInformation: "awards@greentech-innovation.com",
        status: "upcoming",
        registrationDeadline: new Date('2024-03-15'),
        maxParticipants: 300,
        currentParticipants: 89
    },
    {
        title: "FinTech Future Competition",
        description: "Revolutionary financial technology solutions for the next generation. Focus on digital payments, blockchain, financial inclusion, and regulatory technology.",
        theme: "Financial Technology Innovation",
        startDate: new Date('2023-12-01'),
        endDate: new Date('2024-01-31'),
        location: "New York, NY",
        organizers: "FinTech Ventures, Banking Innovation Institute",
        fundingPrizes: "Champion: $80,000, Innovation Award: $40,000, RegTech Award: $30,000",
        submissionFormat: ["Working Platform", "Security Audit", "Compliance Report", "Market Analysis"],
        eligibilityCriteria: "Financial services focus with proper security and compliance measures.",
        judgingCriteria: "Security (30%), Innovation (30%), Market Potential (25%), User Experience (15%)",
        contactInformation: "competition@fintech-future.com",
        status: "completed",
        registrationDeadline: new Date('2023-11-15'),
        maxParticipants: 250,
        currentParticipants: 241,
        winners: [
            { position: 1, team: "BlockPay Solutions", prize: "$80,000" },
            { position: 2, team: "RegTech Innovators", prize: "$40,000" },
            { position: 3, team: "CryptoSecure", prize: "$30,000" }
        ]
    },
    {
        title: "Healthcare Innovation Summit",
        description: "Transform healthcare through technology and innovation. Focus on telemedicine, medical devices, health analytics, and patient care improvement.",
        theme: "Digital Health Transformation",
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-07-15'),
        location: "Seattle, WA",
        organizers: "HealthTech Consortium, Medical Innovation Labs",
        fundingPrizes: "Best Innovation: $60,000, Patient Impact Award: $35,000, Digital Health Award: $25,000",
        submissionFormat: ["Clinical Evidence", "Technology Demo", "Regulatory Strategy", "Patient Outcomes"],
        eligibilityCriteria: "Healthcare technology solutions with demonstrated patient benefits.",
        judgingCriteria: "Patient Impact (40%), Clinical Evidence (30%), Innovation (20%), Scalability (10%)",
        contactInformation: "summit@healthtech-innovation.org",
        status: "upcoming",
        registrationDeadline: new Date('2024-04-15'),
        maxParticipants: 180,
        currentParticipants: 45
    }
];

const addSampleIdeathons = async () => {
    try {
        connectDB();
        
        // Find an admin user to assign as creator
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found. Creating default admin...');
            // You might want to create an admin user here if needed
        }
        
        // Clear existing ideathons (optional)
        await Ideathon.deleteMany({});
        console.log('Cleared existing ideathons');
        
        // Add createdBy field to each ideathon
        const ideathonsWithCreator = sampleIdeathons.map(ideathon => ({
            ...ideathon,
            createdBy: adminUser ? adminUser._id : null
        }));
        
        // Insert sample ideathons
        const createdIdeathons = await Ideathon.insertMany(ideathonsWithCreator);
        console.log(`✅ Successfully added ${createdIdeathons.length} sample ideathons:`);
        
        createdIdeathons.forEach((ideathon, index) => {
            console.log(`${index + 1}. ${ideathon.title} (${ideathon.status})`);
        });
        
        console.log('\n📊 Ideathon Statistics:');
        console.log(`- Active: ${createdIdeathons.filter(i => i.status === 'active').length}`);
        console.log(`- Upcoming: ${createdIdeathons.filter(i => i.status === 'upcoming').length}`);
        console.log(`- Completed: ${createdIdeathons.filter(i => i.status === 'completed').length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error adding sample ideathons:', error);
        process.exit(1);
    }
};

addSampleIdeathons();