const mongoose = require('mongoose');
const Idea = require('./models/Idea.model');
const User = require('./models/User.model');
const sampleData = require('./sampleIdeas.json');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startsmart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to create analysis data with sample SWOT and trends
const createAnalysis = (ideaTitle) => {
  if (ideaTitle.includes('EcoTrack')) {
    return {
      score: 87,
      swot: {
        strengths: "Strong AI-powered route optimization reducing costs by 40%, comprehensive platform with hardware and software integration, proven environmental impact with CO2 reduction by 35%, excellent unit economics with fast ROI (8-12 months vs industry 18-24 months), citizen engagement through gamified mobile app increasing participation by 60%, real-time IoT sensor monitoring for dynamic routing, superior AI algorithms with 40% better optimization than competitors",
        weaknesses: "Dependency on reliable IoT sensors in harsh outdoor environments (mitigated with ruggedized hardware and 5-year warranty), requires municipalities to change traditional procurement processes and long sales cycles (12-18 months), relatively high upfront investment for smart bin infrastructure ($150-300 per unit), battery life limitations of IoT sensors requiring 3-year replacement cycle, competition from well-funded established players like Rubicon Global and Bigbelly with larger market share",
        opportunities: "Growing smart city market projected to reach $5.6B by 2027 at 15.3% CAGR, increasing regulatory pressure for sustainability and waste reduction mandates, value-based contracts align with demonstrated savings model and quick ROI, potential partnerships with major waste management companies (Waste Management Inc., Republic Services), international expansion opportunity in Europe and Asia where smart city investments exceed $1.2T through 2030, government grants and environmental funding programs totaling $500M+ annually, increasing urbanization with 68% of world population in cities by 2050 driving demand",
        threats: "Established competitors like Epic and Rubicon building similar IoT and route optimization features, municipalities may face budget constraints during economic downturns limiting technology adoption budgets, regulatory changes could shift priorities away from smart waste management toward other infrastructure needs, potential cybersecurity concerns with IoT devices creating hesitation in government procurement, supply chain disruptions affecting sensor availability and pricing volatility, competing smart city initiatives diverting municipal budgets to other priorities"
      },
      roadmap: [
        "Month 1-4: MVP with core sensor integration, basic route optimization algorithm, simple web dashboard for city administrators, mobile app with collection schedules, testing with 50 bins in one pilot city",
        "Month 5-8: Enhanced AI route optimization achieving 30% improvement, citizen app with recycling gamification and challenges, real-time alerts and notifications, integration with 3 city management systems, expand to 200 bins across 2 pilot cities",
        "Month 9-12: Production-ready platform with 99.9% uptime SLA, comprehensive analytics dashboard with ROI calculator, API for third-party integrations, automated billing and customer portal, support for 1,000 bins, launch with 5 paying cities generating $150K MRR",
        "Year 2: Advanced predictive analytics using LSTM networks, computer vision for contamination detection in recycling streams, waste composition analysis for policy insights, mobile app 2.0 with social features and community challenges, white-label capabilities for partners, support for 10,000 bins across 15-20 cities",
        "Year 3+: International expansion with multi-language support starting with Europe and Asia markets, blockchain integration for waste tracking and carbon credit verification, integration with electric vehicle fleets for route optimization, expansion into recycling centers and composting facilities, AI marketplace for third-party algorithms"
      ],
      trends: [
        { year: 2020, popularity: 45 },
        { year: 2021, popularity: 58 },
        { year: 2022, popularity: 71 },
        { year: 2023, popularity: 82 },
        { year: 2024, popularity: 89 }
      ]
    };
  } else {
    return {
      score: 92,
      swot: {
        strengths: "Addresses critical $25-45B annual care coordination problem with proven ROI, superior AI with 85% readmission prediction accuracy vs industry average 65-70%, fastest implementation at 30-45 days vs competitors requiring 6-12 months, exceptional patient engagement with 4.8 star mobile app and 73% daily active usage vs industry 25%, 40% lower total cost of ownership than major competitors, strong pilot partnerships with 3 health systems managing 12 hospitals and 180K patients, HIPAA-compliant infrastructure from day one with SOC 2 Type II certification path, comprehensive end-to-end solution covering data aggregation, AI insights, care coordination workflows, and patient engagement",
        weaknesses: "Healthcare sales cycles are long at 12-18 months from initial contact to contract signature, complex EHR integration across diverse systems with each health system having unique configurations, requires clinical expertise (RNs, clinical informaticists) for customer support increasing operational costs, patient adoption of health apps historically challenging with only 30% using apps after 90 days, competition from Epic and Cerner building native care coordination tools that could bundle with existing EHR contracts, dependency on continued value-based care adoption and reimbursement models, significant upfront investment needed in sales team and pilot programs before revenue generation",
        opportunities: "Value-based care adoption accelerating with 50% of payments shifting to value-based models by 2025 up from current 35%, $564M in annual Medicare readmission penalties driving hospital urgency to adopt solutions, aging population with 65+ demographic reaching 80M by 2040 creating massive care coordination needs, 60% of American adults living with one or more chronic conditions requiring multi-provider coordination, healthcare labor shortages driving 40% increase in automation and technology adoption, post-COVID digital health acceptance removing historical barriers to telemedicine and remote monitoring, potential payer partnerships to subsidize platform for their provider networks creating B2B2C channel, international expansion to Canada, UK, Australia markets with similar healthcare challenges, adjacent market opportunities in specialty care coordination (oncology, mental health), integration with emerging telemedicine and RPM platforms",
        threats: "Epic and Cerner could bundle care coordination into core EHR offerings and undercut on price leveraging existing customer relationships, healthcare policy changes could reduce value-based care incentives if political priorities shift toward other reforms, budget constraints in rural hospitals and safety-net providers limiting addressable market, HIPAA compliance risks and potential for data breaches creating reputational damage, potential FDA regulation of clinical decision support software requiring expensive regulatory pathway, competition from well-funded startups like Innovaccer (raised $275M) and startups with $100M+ funding, customer concentration risk with top 10 customers representing >50% revenue in early years creating churn risk, economic recession reducing healthcare IT spending budgets"
      },
      roadmap: [
        "Month 1-6: MVP with data aggregation from 10 major EHR systems via HL7 FHIR, basic care team messaging and task management, simple patient mobile app with medication reminders and appointment scheduling, initial predictive model for readmission risk achieving 75% accuracy, web dashboard for care coordinators with patient lists and alerts, basic analytics and reporting, HIPAA-compliant AWS infrastructure, deploy with 3 pilot health systems covering 5,000 patients",
        "Month 7-12: Expand EHR integration to 50+ systems via Redox API partnership, enhance AI models to improve prediction accuracy from 75% to 85% through expanded training data, advanced NLP for extracting insights from unstructured clinical notes using BERT models, medication reconciliation with automated drug interaction checking across 10,000+ drug combinations, video consultation capabilities for seamless provider-to-provider communication, improved mobile app with symptom tracking and appointment scheduling, integration with wearables (Apple Watch, Fitbit) and remote monitoring devices, scale to 15,000 patients across 8 health systems generating $1.5M ARR",
        "Month 13-18: Advanced workflow automation with AI-generated care plan recommendations based on evidence-based guidelines, population health management dashboard for tracking entire patient panels with risk stratification, sophisticated analytics platform with custom reporting capabilities and data visualization, white-labeling capabilities for enterprise customers wanting branded solution, comprehensive API platform for third-party integrations and app ecosystem, bidirectional EHR integration allowing platform to write data back to patient charts, expanded mobile app with personalized educational content library and video resources, social determinants of health screening and community resource connections, scale to 50,000 patients across 20 organizations reaching $3.5M ARR",
        "Month 19-24: Machine learning model marketplace allowing health systems to access specialized algorithms for specific conditions, predictive analytics for specific disease states (CHF, COPD, diabetes) with condition-specific interventions, AI-powered care plan optimization based on outcomes data from thousands of similar patients, blockchain integration for secure patient identity management and consent tracking, integration with major payer platforms for value-based contract management and claims data, telemedicine platform integrations (Zoom for Healthcare, Doxy.me) for unified communication, advanced security features including biometrics and zero-trust architecture, internationalization with support for 10+ languages and regulatory frameworks, scale to 150,000+ patients reaching $6M ARR",
        "Year 3+: Continued innovation in AI for clinical decision support and diagnostic assistance, expansion to specialty care coordination (oncology care pathways, mental health crisis management), ambient voice documentation for reducing clinical documentation burden, augmented reality for patient education and medication adherence, predictive models for preventive care opportunities and chronic disease progression, strategic partnerships or acquisition discussions with major healthcare IT companies"
      ],
      trends: [
        { year: 2020, popularity: 52 },
        { year: 2021, popularity: 64 },
        { year: 2022, popularity: 76 },
        { year: 2023, popularity: 85 },
        { year: 2024, popularity: 93 }
      ]
    };
  }
};

// Seed function
const seedIdeas = async () => {
  try {
    // Connect to database
    await connectDB();

    // Use the specific entrepreneur user ID provided
    const entrepreneurId = '68caa2122543c651d3aba0b3';
    
    let entrepreneur = await User.findById(entrepreneurId);
    
    if (!entrepreneur) {
      console.log('Entrepreneur user not found with ID:', entrepreneurId);
      console.log('Please ensure the user exists with email: entrepreneur@startsmart.com');
      process.exit(1);
    }

    console.log(`Using entrepreneur: ${entrepreneur.name} (${entrepreneur.email})`);

    // Delete ALL existing ideas for this entrepreneur to start fresh
    const deleteResult = await Idea.deleteMany({ owner: entrepreneur._id });
    console.log(`Deleted ${deleteResult.deletedCount} existing ideas for this entrepreneur`);

    // Prepare ideas with the entrepreneur as owner
    const ideasToInsert = sampleData.ideas.map(idea => ({
      ...idea,
      owner: entrepreneur._id,
      status: 'analyzed', // Set as analyzed so they show up nicely
      fundingStatus: 'seeking',
      analysis: createAnalysis(idea.title),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updatedAt: new Date()
    }));

    // Insert ideas
    const insertedIdeas = await Idea.insertMany(ideasToInsert);
    
    console.log('\n✅ Successfully seeded database with sample ideas!');
    console.log(`\nInserted ${insertedIdeas.length} ideas:`);
    insertedIdeas.forEach((idea, index) => {
      console.log(`  ${index + 1}. ${idea.title}`);
      console.log(`     - ID: ${idea._id}`);
      console.log(`     - Status: ${idea.status}`);
      console.log(`     - Analysis Score: ${idea.analysis.score}%`);
      console.log(`     - Owner: ${entrepreneur.name}\n`);
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('  1. Login as the entrepreneur to view these ideas');
    console.log('  2. Check the idea detail pages to see all fields');
    console.log('  3. Test the edit and delete functionality');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedIdeas();
