require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Idea = require('./models/Idea.model');
const BusinessAim = require('./models/BusinessAim.model');
const TeamResource = require('./models/TeamResource.model');
const User = require('./models/User.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Get or create a test user
  let testUser = await User.findOne({ email: 'test@example.com' });
  if (!testUser) {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'entrepreneur'
    });
    console.log('✅ Created test user');
  }
  
  console.log(`📝 Using user ID: ${testUser._id}`);
  
  // Clear existing data (optional)
  console.log('🗑️ Clearing existing data...');
  await Idea.deleteMany({ owner: testUser._id });
  await BusinessAim.deleteMany({ owner: testUser._id });
  await TeamResource.deleteMany({ owner: testUser._id });
  
  // Sample Ideas Data
  const sampleIdeas = [
    {
      title: 'EcoTrack - Smart Waste Management',
      elevatorPitch: 'Revolutionary IoT-enabled waste segregation system that uses AI to automatically sort recyclables, reducing urban waste by 60% while providing real-time analytics to city planners.',
      description: 'EcoTrack is a comprehensive smart waste management solution that combines IoT sensors, computer vision, and machine learning to revolutionize how cities handle waste. Our smart bins automatically identify and segregate waste materials into biodegradable, recyclable, and landfill categories, while providing real-time data analytics to optimize collection routes and reduce operational costs.',
      category: 'Sustainability',
      targetAudience: 'Municipal governments, waste management companies, smart city initiatives, corporate campuses',
      problemStatement: 'Cities worldwide struggle with inefficient waste management, leading to overflowing landfills, poor recycling rates, and environmental degradation. Manual sorting is labor-intensive and error-prone, while traditional waste collection lacks data-driven optimization.',
      solution: 'Smart bins equipped with computer vision cameras and AI algorithms automatically identify and segregate waste into proper categories. IoT sensors monitor fill levels and contamination, while a cloud platform provides real-time analytics for route optimization and waste stream analysis.',
      competitors: 'BigBelly, Enevo, traditional waste management companies',
      revenueStreams: 'Hardware sales, software subscriptions, data analytics services, maintenance contracts',
      pricingStrategy: 'Freemium model for basic analytics, $50/month per smart bin for premium features',
      keyPartnerships: 'Municipal governments, waste management companies, recycling facilities',
      marketSize: 'Global smart waste management market valued at $1.6B in 2023, growing at 18.6% CAGR',
      goToMarketStrategy: 'Direct sales to municipalities through RFP process, pilot programs to demonstrate ROI',
      scalabilityPlan: 'Start with tier-2 cities, expand to major metropolitan areas, international expansion',
      technologyStack: 'IoT sensors, computer vision, cloud analytics, mobile apps, AI/ML platform',
      developmentRoadmap: '18 months to market-ready product, 24 months to first major deployment',
      challengesAnticipated: 'Regulatory compliance, municipal adoption cycles, hardware durability',
      ecoFriendlyPractices: 'Increase recycling rates by 60%, reduce landfill waste, optimize collection routes',
      socialImpact: 'Cleaner cities, job creation in green technology, environmental awareness',
      fundingRequirements: '$2,500,000 for development, manufacturing, and market entry',
      useOfFunds: '40% product development, 25% manufacturing, 20% sales and marketing, 15% operations',
      equityOffer: '20% equity for Series A funding round',
      owner: testUser._id
    },
    {
      title: 'MindBridge - Mental Health AI Assistant',
      elevatorPitch: 'AI-driven mental health companion providing 24/7 support, personalized coping strategies, and early intervention detection for anxiety and depression.',
      description: 'MindBridge is a comprehensive mental health platform that uses advanced AI to provide personalized therapeutic support, mood tracking, and crisis intervention. Our chatbot is trained on cognitive behavioral therapy techniques and provides evidence-based interventions while seamlessly connecting users to human therapists when needed.',
      category: 'Healthcare',
      targetAudience: 'Young adults aged 18-35, corporate wellness programs, healthcare providers, insurance companies',
      problemStatement: 'Mental health services are expensive, have long wait times, and stigma prevents many from seeking help. Traditional therapy is not accessible to everyone who needs it, particularly young adults and those in underserved communities.',
      solution: 'Mobile app with AI chatbot trained on CBT techniques, real-time mood tracking, personalized interventions, crisis detection, and seamless connection to human therapists. Includes corporate wellness dashboards and healthcare provider integration.',
      competitors: 'Headspace, Calm, BetterHelp, Woebot, Ginger',
      revenueStreams: 'Freemium subscriptions, corporate wellness contracts, healthcare partnerships',
      pricingStrategy: '$9.99/month premium, $50/employee/year corporate, revenue sharing with healthcare',
      keyPartnerships: 'Healthcare systems, insurance companies, employers, universities',
      marketSize: 'Global digital mental health market worth $5.6B in 2023, growing at 23.6% CAGR',
      goToMarketStrategy: 'App store optimization, corporate wellness sales, healthcare partnerships',
      scalabilityPlan: 'B2C growth through app stores, B2B expansion into corporate and healthcare markets',
      technologyStack: 'Natural language processing, machine learning, mobile apps, cloud infrastructure',
      developmentRoadmap: '12 months to clinical-grade AI, 18 months to FDA considerations',
      challengesAnticipated: 'Regulatory compliance, user safety, data privacy, clinical validation',
      ecoFriendlyPractices: 'Reduce healthcare system burden, promote mental wellness, prevent crises',
      socialImpact: 'Democratize mental health access, reduce stigma, improve quality of life',
      fundingRequirements: '$1,800,000 for AI development, clinical validation, and user acquisition',
      useOfFunds: '50% AI development, 25% user acquisition, 15% compliance, 10% team expansion',
      equityOffer: '18% equity for Series A funding round',
      owner: testUser._id
    },
    {
      title: 'FarmSense - Precision Agriculture Platform',
      elevatorPitch: 'Complete precision agriculture platform using IoT sensors, satellite imagery, and machine learning to optimize crop yields while reducing water usage by 40% and pesticide use by 30%.',
      description: 'FarmSense is an integrated precision agriculture platform that combines IoT soil sensors, weather monitoring, satellite imagery, and AI-powered analytics to help farmers optimize crop yields while reducing resource consumption. Our solution provides real-time recommendations for irrigation, fertilization, and pest management.',
      category: 'AgriTech',
      targetAudience: 'Small to medium farmers, agricultural cooperatives, agribusiness companies, emerging market farmers',
      problemStatement: 'Traditional farming methods are inefficient, leading to resource waste, lower yields, and environmental damage. Farmers lack real-time data to make informed decisions about irrigation, fertilization, and pest management.',
      solution: 'Integrated platform with IoT soil sensors, weather stations, drone surveys, satellite monitoring, and AI-powered recommendation engine. Provides real-time alerts, predictive analytics, and automated irrigation control.',
      competitors: 'John Deere, Climate Corp, CropX, Farmers Edge',
      revenueStreams: 'Hardware-as-a-Service subscriptions, satellite monitoring, advisory services',
      pricingStrategy: '$99/month per 10-acre package, $15/acre satellite monitoring, premium consulting',
      keyPartnerships: 'Equipment dealers, agricultural cooperatives, microfinance institutions',
      marketSize: 'Global precision agriculture market worth $12.8B in 2023, growing at 12.7% CAGR',
      goToMarketStrategy: 'Agricultural trade shows, demonstration farms, government extension programs',
      scalabilityPlan: 'Start with specialty crops, expand to commodity farming, international markets',
      technologyStack: 'IoT sensors, satellite APIs, machine learning, mobile apps, weather data',
      developmentRoadmap: '15 months to production sensors, 24 months to multi-region deployment',
      challengesAnticipated: 'Weather dependency, farmer adoption, supply chain, regulatory differences',
      ecoFriendlyPractices: 'Reduce water usage by 40%, decrease pesticide use by 30%, optimize fertilizer',
      socialImpact: 'Increase farmer income, improve food security, sustainable agriculture practices',
      fundingRequirements: '$3,200,000 for hardware development, manufacturing, and field operations',
      useOfFunds: '35% hardware development, 30% software platform, 20% field operations, 15% expansion',
      equityOffer: '25% equity for Series A funding round',
      owner: testUser._id
    },
    {
      title: 'EduVerse - Virtual Reality Learning',
      elevatorPitch: 'Revolutionary VR education platform that transforms abstract concepts into immersive experiences, improving learning retention by 75% across STEM subjects.',
      description: 'EduVerse is a comprehensive VR education platform that creates immersive learning experiences for STEM subjects. Students can manipulate molecular structures, walk through historical events, conduct virtual experiments, and explore complex concepts in interactive 3D environments.',
      category: 'EdTech',
      targetAudience: 'K-12 schools, universities, online education platforms, homeschooling families, corporate training',
      problemStatement: 'Traditional education struggles to engage students, especially in complex subjects like physics, chemistry, and biology. Abstract concepts are difficult to visualize and understand, leading to poor learning outcomes.',
      solution: 'VR platform with interactive 3D learning environments, curriculum-aligned content, teacher training programs, and learning assessment tools. Includes virtual laboratories, historical simulations, and collaborative learning spaces.',
      competitors: 'Google Expeditions, ClassVR, Immersive VR Education, Engage',
      revenueStreams: 'Software licensing, hardware bundles, content development, teacher training',
      pricingStrategy: '$25/student/year licensing, $500/month institutional access, custom content development',
      keyPartnerships: 'School districts, educational publishers, VR hardware manufacturers',
      marketSize: 'Global VR in education market worth $3.1B in 2023, growing at 32.5% CAGR',
      goToMarketStrategy: 'Educational conferences, pilot programs, teacher testimonials, academic research',
      scalabilityPlan: 'K-12 STEM focus, expand to higher education, international markets, corporate training',
      technologyStack: 'Unity 3D, VR development, cloud platform, learning management system integration',
      developmentRoadmap: '12 months to comprehensive STEM curriculum, 18 months to 100+ schools',
      challengesAnticipated: 'Education sector adoption, budget constraints, technology infrastructure',
      ecoFriendlyPractices: 'Reduce physical lab waste, virtual field trips, digital-first approach',
      socialImpact: 'Improve STEM education outcomes, democratize access to advanced learning tools',
      fundingRequirements: '$2,100,000 for content development, platform scaling, and market penetration',
      useOfFunds: '40% content development, 25% platform development, 20% sales and marketing, 15% training',
      equityOffer: '22% equity for Series A funding round',
      owner: testUser._id
    },
    {
      title: 'FinFlow - SME Financial Management',
      elevatorPitch: 'Comprehensive financial management platform for SMEs with AI-driven insights, automated bookkeeping, and predictive cash flow analysis to prevent 80% of small business failures.',
      description: 'FinFlow is an all-in-one financial management platform designed specifically for small and medium enterprises. Our AI-powered system automates bookkeeping, provides predictive cash flow analysis, and offers actionable financial insights to help businesses make informed decisions.',
      category: 'FinTech',
      targetAudience: 'Small and medium enterprises, freelancers, startups, local businesses, solopreneurs',
      problemStatement: 'Small businesses struggle with financial management, leading to cash flow problems and high failure rates. Complex accounting software is expensive and requires expertise that most small business owners lack.',
      solution: 'User-friendly platform integrating banking, invoicing, expense tracking, tax preparation, and AI-powered financial forecasting. Provides automated bookkeeping, cash flow predictions, and personalized financial recommendations.',
      competitors: 'QuickBooks, Xero, FreshBooks, Wave Accounting',
      revenueStreams: 'Freemium SaaS subscriptions, payment processing fees, lending partnerships',
      pricingStrategy: 'Free basic features, $29/month AI insights, $99/month advanced features',
      keyPartnerships: 'Banks, accountants, payment processors, lending institutions',
      marketSize: 'Global SME financial software market worth $8.2B in 2023, growing at 14.2% CAGR',
      goToMarketStrategy: 'Freemium acquisition, content marketing, accountant partnerships, SEO',
      scalabilityPlan: 'SME focus initially, expand to larger businesses, international markets',
      technologyStack: 'Cloud platform, AI/ML, banking APIs, mobile apps, data analytics',
      developmentRoadmap: '15 months to AI insights, 24 months to banking integrations',
      challengesAnticipated: 'Competition from established players, regulatory compliance, banking partnerships',
      ecoFriendlyPractices: 'Paperless operations, digital-first approach, remote work support',
      socialImpact: 'Reduce small business failure rates, support entrepreneurship, job creation',
      fundingRequirements: '$1,500,000 for AI development, user acquisition, and banking integrations',
      useOfFunds: '45% AI development, 25% user acquisition, 20% integrations, 10% support',
      equityOffer: '20% equity for Series A funding round',
      owner: testUser._id
    }
  ];

  console.log('💡 Creating sample ideas...');
  const createdIdeas = await Idea.insertMany(sampleIdeas);
  console.log(`✅ Created ${createdIdeas.length} ideas`);

  // Sample BusinessAims Data
  const sampleBusinessAims = [
    {
      ideaId: createdIdeas[0]._id,
      businessModel: 'B2B SaaS model with tiered pricing based on number of smart bins deployed. Revenue from hardware sales, software subscriptions, and data analytics services. Partnership with waste management companies for implementation.',
      revenueStreams: ['Subscription', 'Hardware Sales', 'Data Monetization', 'Consulting/Services'],
      targetMarket: 'Municipal governments in smart cities, private waste management companies, corporate campuses, and residential complexes. Primary focus on cities with populations over 100,000 residents.',
      marketSize: 'Global smart waste management market valued at $1.6B in 2023, growing at 18.6% CAGR. Target addressable market of $400M in North America and Europe.',
      competitionAnalysis: 'Competitors include BigBelly, Enevo, and traditional waste companies. Our AI-powered sorting differentiates us from basic smart bins. Strong patent portfolio provides competitive moat.',
      pricingStrategy: 'Freemium model for basic analytics, $50/month per smart bin for premium features, $100,000+ for enterprise deployments with custom integration and 24/7 support.',
      salesStrategy: 'Direct sales to municipalities through RFP process, channel partnerships with waste management companies, and pilot programs to demonstrate ROI before full deployment.',
      marketingStrategy: 'Content marketing focused on sustainability ROI, trade show presence at waste management conferences, case studies from pilot cities, and thought leadership in smart city publications.',
      fundingRequirement: '$2,500,000',
      useOfFunds: '40% product development and AI enhancement, 25% manufacturing and supply chain, 20% sales and marketing, 10% regulatory compliance, 5% working capital.',
      financialProjections: 'Year 1: $500K revenue, Year 2: $2.1M, Year 3: $5.8M. Break-even in Month 18. Gross margin of 65% by Year 3 with recurring revenue comprising 70% of total revenue.',
      keyMetrics: ['Monthly Recurring Revenue (MRR)', 'Customer Acquisition Cost (CAC)', 'Churn Rate', 'Gross Margin'],
      riskAssessment: 'Key risks include regulatory changes in waste management, slow municipal adoption cycles, competition from established players, and supply chain disruptions for hardware components.',
      mitigationStrategies: 'Diversify into private sector markets, build strong regulatory relationships, establish multiple supplier partnerships, and develop software-only solutions for existing infrastructure.',
      exitStrategy: 'Strategic acquisition by waste management giants like Waste Management Inc. or Veolia, or IPO after reaching $50M+ annual revenue with strong market position.',
      timeline: '18 months to market-ready product, 24 months to first major municipal deployment, 36 months to multi-city expansion',
      milestones: [
        { name: 'MVP Development', description: 'Complete smart bin prototype with basic AI sorting', targetDate: new Date('2024-06-01'), completed: true },
        { name: 'Pilot Program', description: 'Deploy 50 units in partner city for 6-month trial', targetDate: new Date('2024-12-01'), completed: false },
        { name: 'Series A Funding', description: 'Raise $2.5M Series A funding round', targetDate: new Date('2025-03-01'), completed: false }
      ],
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[1]._id,
      businessModel: 'Freemium B2C mobile app with premium subscriptions for advanced features. B2B2C partnerships with employers, insurance companies, and healthcare providers for white-label solutions.',
      revenueStreams: ['Freemium', 'Subscription', 'Licensing', 'Data Monetization'],
      targetMarket: 'Young adults aged 18-35 struggling with anxiety and depression, corporate wellness programs, and healthcare systems looking for scalable mental health solutions.',
      marketSize: 'Global digital mental health market worth $5.6B in 2023, growing at 23.6% CAGR. Target addressable market of $1.2B in North America for AI-powered solutions.',
      competitionAnalysis: 'Competitors include Headspace, Calm, BetterHelp, and Woebot. Our clinical-grade AI and personalized intervention approach differentiates from meditation-focused apps.',
      pricingStrategy: '$9.99/month for premium individual subscriptions, $50/employee/year for corporate programs, revenue sharing with healthcare providers based on patient outcomes.',
      salesStrategy: 'App store optimization for B2C growth, direct sales to HR departments for corporate wellness, and partnerships with healthcare systems for patient acquisition.',
      marketingStrategy: 'Influencer partnerships with mental health advocates, content marketing on mental health awareness, clinical study publications, and university campus partnerships.',
      fundingRequirement: '$1,800,000',
      useOfFunds: '50% AI development and clinical validation, 25% user acquisition and marketing, 15% regulatory compliance and data security, 10% team expansion.',
      financialProjections: 'Year 1: $300K revenue, Year 2: $1.8M, Year 3: $4.2M. Break-even in Month 20. Targeting 100K+ active users by Year 2 with 15% conversion to premium.',
      keyMetrics: ['Daily Active Users (DAU)', 'Monthly Active Users (MAU)', 'Conversion Rate', 'User Engagement', 'Customer Acquisition Cost (CAC)'],
      riskAssessment: 'Regulatory risks around healthcare AI, user safety concerns, data privacy requirements, and competitive pressure from established mental health platforms.',
      mitigationStrategies: 'Obtain clinical certifications, implement robust safety protocols, ensure HIPAA compliance, and build strong clinical advisory board for credibility.',
      exitStrategy: 'Strategic acquisition by healthcare companies like Teladoc or traditional mental health organizations, or merger with larger digital health platforms.',
      timeline: '12 months to clinical-grade AI, 18 months to FDA considerations, 24 months to enterprise partnerships',
      milestones: [
        { name: 'Beta Launch', description: 'Release beta version with 1000 test users', targetDate: new Date('2024-08-01'), completed: true },
        { name: 'Clinical Validation', description: 'Complete clinical trial with partner university', targetDate: new Date('2025-01-01'), completed: false },
        { name: 'Corporate Partnerships', description: 'Sign 5 corporate wellness contracts', targetDate: new Date('2025-06-01'), completed: false }
      ],
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[2]._id,
      businessModel: 'Hardware-as-a-Service (HaaS) model with monthly subscriptions including sensors, software, and analytics. Additional revenue from crop insurance partnerships and marketplace commissions.',
      revenueStreams: ['Subscription', 'Hardware Sales', 'Commission/Marketplace', 'Consulting/Services'],
      targetMarket: 'Small to medium farmers (10-500 acres), agricultural cooperatives, specialty crop growers, and emerging market farmers looking to increase yields and reduce costs.',
      marketSize: 'Global precision agriculture market worth $12.8B in 2023, growing at 12.7% CAGR. Target addressable market of $3.2B for IoT-based solutions.',
      competitionAnalysis: 'Competitors include John Deere, Climate Corp, and CropX. Our focus on affordable solutions for smaller farmers and emerging markets differentiates from enterprise-focused competitors.',
      pricingStrategy: '$99/month per 10-acre package including sensors and software, $15/acre for satellite monitoring, premium advisory services at $200/consultation.',
      salesStrategy: 'Direct sales through agricultural trade shows, partnerships with farm equipment dealers, government agricultural extension programs, and microfinance institutions.',
      marketingStrategy: 'Demonstration farms showcasing ROI, partnerships with agricultural universities, farmer testimonials, and presence at major agricultural conferences and cooperatives.',
      fundingRequirement: '$3,200,000',
      useOfFunds: '35% hardware development and manufacturing, 30% software platform development, 20% field operations and support, 15% market expansion and partnerships.',
      financialProjections: 'Year 1: $800K revenue, Year 2: $3.5M, Year 3: $8.9M. Break-even in Month 22. Targeting 2,000+ active farms by Year 3 with high retention rates.',
      keyMetrics: ['Monthly Recurring Revenue (MRR)', 'Customer Acquisition Cost (CAC)', 'Lifetime Value (LTV)', 'Churn Rate'],
      riskAssessment: 'Weather dependency, farmer adoption resistance, supply chain issues for hardware, and regulatory challenges in different agricultural markets.',
      mitigationStrategies: 'Develop weather-resilient sensors, provide extensive farmer training, establish local manufacturing partnerships, and work with agricultural authorities for regulatory compliance.',
      exitStrategy: 'Strategic acquisition by agricultural giants like Bayer, Cargill, or technology companies expanding into AgTech, or potential IPO after establishing market leadership.',
      timeline: '15 months to production-ready sensors, 24 months to multi-region deployment, 36 months to international expansion',
      milestones: [
        { name: 'Sensor Development', description: 'Complete weatherproof IoT sensor prototypes', targetDate: new Date('2024-09-01'), completed: false },
        { name: 'Pilot Deployment', description: 'Deploy on 100 farms across 3 states', targetDate: new Date('2025-02-01'), completed: false },
        { name: 'Series A Funding', description: 'Raise $3.2M Series A for scaling', targetDate: new Date('2025-07-01'), completed: false }
      ],
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[3]._id,
      businessModel: 'B2B2C software licensing to educational institutions with per-student pricing. Additional revenue from content creation, teacher training programs, and custom VR development.',
      revenueStreams: ['Licensing', 'Subscription', 'Consulting/Services', 'Hardware Sales'],
      targetMarket: 'K-12 schools, universities, online education platforms, corporate training departments, and homeschooling families seeking immersive educational experiences.',
      marketSize: 'Global VR in education market worth $3.1B in 2023, growing at 32.5% CAGR. Target addressable market of $800M for immersive STEM education solutions.',
      competitionAnalysis: 'Competitors include Google Expeditions, ClassVR, and Immersive VR Education. Our focus on curriculum-aligned STEM content and teacher training provides competitive advantage.',
      pricingStrategy: '$25/student/year for software licensing, $500/month for institution-wide access, VR headset bundles at $300/unit, custom content development at $50K+ per project.',
      salesStrategy: 'Direct sales to school districts, partnerships with educational technology distributors, pilot programs for demonstration, and teacher conference presentations.',
      marketingStrategy: 'Educational conference exhibitions, teacher testimonials and case studies, academic research partnerships, and content marketing focused on learning outcome improvements.',
      fundingRequirement: '$2,100,000',
      useOfFunds: '40% content development and curriculum alignment, 25% VR platform development, 20% sales and marketing, 10% teacher training programs, 5% regulatory compliance.',
      financialProjections: 'Year 1: $450K revenue, Year 2: $2.2M, Year 3: $5.1M. Break-even in Month 19. Targeting 500+ schools by Year 3 with strong renewal rates.',
      keyMetrics: ['Annual Recurring Revenue (ARR)', 'Customer Acquisition Cost (CAC)', 'User Engagement', 'Conversion Rate'],
      riskAssessment: 'Slow education sector adoption, budget constraints in schools, technology infrastructure requirements, and competition from established educational technology providers.',
      mitigationStrategies: 'Develop mobile-compatible solutions, offer flexible pricing for budget-constrained schools, provide comprehensive technical support, and build strong academic research partnerships.',
      exitStrategy: 'Strategic acquisition by educational technology companies like Pearson or McGraw-Hill, or merger with VR hardware companies expanding into education.',
      timeline: '12 months to comprehensive STEM curriculum, 18 months to 100+ school deployments, 30 months to international expansion',
      milestones: [
        { name: 'Curriculum Development', description: 'Complete VR modules for physics and chemistry', targetDate: new Date('2024-11-01'), completed: false },
        { name: 'School Pilots', description: 'Launch pilot programs in 20 schools', targetDate: new Date('2025-01-15'), completed: false },
        { name: 'Platform Scaling', description: 'Support 500+ concurrent VR sessions', targetDate: new Date('2025-08-01'), completed: false }
      ],
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[4]._id,
      businessModel: 'Freemium SaaS model with tiered pricing based on business size and features. Additional revenue from payment processing, lending partnerships, and premium financial advisory services.',
      revenueStreams: ['Freemium', 'Subscription', 'Transaction Fees', 'Affiliate Marketing'],
      targetMarket: 'Small and medium enterprises with 1-50 employees, freelancers, solopreneurs, and local businesses struggling with financial management and cash flow optimization.',
      marketSize: 'Global SME financial software market worth $8.2B in 2023, growing at 14.2% CAGR. Target addressable market of $2.1B for AI-powered financial management solutions.',
      competitionAnalysis: 'Competitors include QuickBooks, Xero, and FreshBooks. Our AI-powered insights and predictive analytics differentiate from traditional bookkeeping software.',
      pricingStrategy: 'Free for basic bookkeeping, $29/month for AI insights, $99/month for advanced forecasting, $299/month for enterprise features with dedicated support.',
      salesStrategy: 'Freemium acquisition through app stores and web, content marketing for SEO, accountant partnerships for referrals, and integration with banking APIs.',
      marketingStrategy: 'Small business financial education content, accountant and bookkeeper partnerships, search engine optimization, and success story case studies.',
      fundingRequirement: '$1,500,000',
      useOfFunds: '45% AI development and financial modeling, 25% user acquisition and marketing, 20% banking integrations and compliance, 10% customer support and success.',
      financialProjections: 'Year 1: $400K revenue, Year 2: $2.8M, Year 3: $6.2M. Break-even in Month 16. Targeting 10K+ paying customers by Year 3 with strong unit economics.',
      keyMetrics: ['Monthly Recurring Revenue (MRR)', 'Customer Acquisition Cost (CAC)', 'Lifetime Value (LTV)', 'Churn Rate', 'Net Revenue Retention'],
      riskAssessment: 'Intense competition from established players, regulatory compliance for financial data, banking partnership dependencies, and economic downturns affecting SME spending.',
      mitigationStrategies: 'Focus on underserved SME segments, ensure robust data security and compliance, develop multiple banking partnerships, and provide economic downturn-specific features.',
      exitStrategy: 'Strategic acquisition by accounting software companies, fintech giants like Intuit or Square, or banking institutions expanding digital services.',
      timeline: '15 months to AI-powered insights launch, 24 months to banking integrations, 36 months to advanced predictive features',
      milestones: [
        { name: 'MVP Launch', description: 'Launch basic financial dashboard with 1000 users', targetDate: new Date('2024-10-01'), completed: false },
        { name: 'AI Integration', description: 'Implement predictive cash flow analysis', targetDate: new Date('2025-03-01'), completed: false },
        { name: 'Banking Partnerships', description: 'Integrate with 5 major banks for data sync', targetDate: new Date('2025-09-01'), completed: false }
      ],
      owner: testUser._id
    }
  ];

  console.log('💼 Creating sample business aims...');
  const createdBusinessAims = await BusinessAim.insertMany(sampleBusinessAims);
  console.log(`✅ Created ${createdBusinessAims.length} business aims`);

  // Sample TeamResources Data
  const sampleTeamResources = [
    {
      ideaId: createdIdeas[0]._id,
      teamMembers: [
        {
          name: 'Sarah Chen',
          role: 'Co-founder & CEO',
          expertise: 'Sustainability consulting, business development, municipal partnerships',
          email: 'sarah.chen@ecotrack.com',
          linkedin: 'https://linkedin.com/in/sarahchen',
          commitment: 'Full-time',
          equity: '35'
        },
        {
          name: 'Marcus Rodriguez',
          role: 'Co-founder & CTO',
          expertise: 'IoT development, computer vision, machine learning, embedded systems',
          email: 'marcus.rodriguez@ecotrack.com',
          linkedin: 'https://linkedin.com/in/marcusrodriguez',
          commitment: 'Full-time',
          equity: '30'
        },
        {
          name: 'Dr. Emily Watson',
          role: 'Head of AI & Data Science',
          expertise: 'Computer vision, deep learning, waste classification algorithms',
          email: 'emily.watson@ecotrack.com',
          linkedin: 'https://linkedin.com/in/emilywatson',
          commitment: 'Full-time',
          equity: '8'
        }
      ],
      coreSkills: ['Technology', 'Product Development', 'Operations'],
      resourcesNeeded: ['Hardware', 'Equipment', 'Cloud Services'],
      skillsGap: 'Need experienced hardware manufacturing partner for scaling IoT sensor production. Require regulatory affairs specialist for municipal compliance. Looking for sales professionals with government sector experience.',
      resourceBudget: '$850,000',
      teamStructure: 'Flat organizational structure with cross-functional teams. Technical team focuses on AI and hardware development, business team handles partnerships and sales, operations team manages manufacturing and deployment.',
      collaborationPreferences: 'Agile development methodology, daily standups, weekly sprint planning, quarterly OKR reviews. Remote-first culture with quarterly in-person team meetings.',
      remoteWorkPolicy: 'Hybrid',
      timeline: '18 months to market-ready product with established manufacturing partnerships',
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[1]._id,
      teamMembers: [
        {
          name: 'Dr. James Park',
          role: 'Founder & CEO',
          expertise: 'Clinical psychology, digital therapeutics, healthcare technology',
          email: 'james.park@mindbridge.ai',
          linkedin: 'https://linkedin.com/in/jamespark',
          commitment: 'Full-time',
          equity: '40'
        },
        {
          name: 'Lisa Thompson',
          role: 'Co-founder & CPO',
          expertise: 'Product management, UX design, mobile app development, user research',
          email: 'lisa.thompson@mindbridge.ai',
          linkedin: 'https://linkedin.com/in/lisathompson',
          commitment: 'Full-time',
          equity: '25'
        },
        {
          name: 'Alex Kumar',
          role: 'Lead AI Engineer',
          expertise: 'Natural language processing, conversational AI, machine learning, Python',
          email: 'alex.kumar@mindbridge.ai',
          linkedin: 'https://linkedin.com/in/alexkumar',
          commitment: 'Full-time',
          equity: '12'
        }
      ],
      coreSkills: ['Technology', 'Design', 'Management'],
      resourcesNeeded: ['Software', 'Cloud Services', 'Certifications'],
      skillsGap: 'Need clinical affairs specialist for FDA navigation and digital therapeutics compliance. Require experienced mobile developers for iOS and Android optimization. Looking for clinical research coordinator for efficacy studies.',
      resourceBudget: '$420,000',
      teamStructure: 'Cross-functional product teams with clinical oversight board. AI team develops conversation models, product team focuses on user experience, clinical team ensures therapeutic efficacy.',
      collaborationPreferences: 'Scrum methodology with 2-week sprints, daily clinical review meetings, monthly clinical advisory board meetings. Strong emphasis on user feedback integration.',
      remoteWorkPolicy: 'Fully Remote',
      timeline: '12 months to clinical-grade AI with regulatory compliance framework',
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[2]._id,
      teamMembers: [
        {
          name: 'Michael Foster',
          role: 'Founder & CEO',
          expertise: 'Agricultural engineering, precision farming, startup scaling, sales',
          email: 'michael.foster@farmsense.io',
          linkedin: 'https://linkedin.com/in/michaelfoster',
          commitment: 'Full-time',
          equity: '32'
        },
        {
          name: 'Dr. Priya Patel',
          role: 'Co-founder & Head of Agronomy',
          expertise: 'Crop science, soil analysis, agricultural research, data analytics',
          email: 'priya.patel@farmsense.io',
          linkedin: 'https://linkedin.com/in/priyapatel',
          commitment: 'Full-time',
          equity: '28'
        },
        {
          name: 'David Kim',
          role: 'CTO',
          expertise: 'IoT development, satellite data processing, wireless networks, embedded systems',
          email: 'david.kim@farmsense.io',
          linkedin: 'https://linkedin.com/in/davidkim',
          commitment: 'Full-time',
          equity: '20'
        }
      ],
      coreSkills: ['Technology', 'Operations', 'Sales'],
      resourcesNeeded: ['Hardware', 'Equipment', 'Infrastructure'],
      skillsGap: 'Need agricultural extension specialist for farmer education and adoption. Require hardware manufacturing partner for weather-resistant sensor production. Looking for regional sales managers with agricultural sector experience.',
      resourceBudget: '$1,200,000',
      teamStructure: 'Technical team handles IoT and data platform development, agricultural team focuses on crop science and farmer relations, business team manages partnerships and scaling.',
      collaborationPreferences: 'Kanban workflow for development, weekly field testing reviews, monthly farmer feedback sessions. Seasonal planning aligned with agricultural cycles.',
      remoteWorkPolicy: 'Hybrid',
      timeline: '15 months to production-ready sensors with proven agricultural impact',
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[3]._id,
      teamMembers: [
        {
          name: 'Rachel Green',
          role: 'Founder & CEO',
          expertise: 'Educational technology, curriculum development, teacher training, business development',
          email: 'rachel.green@eduverse.vr',
          linkedin: 'https://linkedin.com/in/rachelgreen',
          commitment: 'Full-time',
          equity: '35'
        },
        {
          name: 'Tom Wilson',
          role: 'Co-founder & CTO',
          expertise: 'VR/AR development, Unity 3D, computer graphics, educational software',
          email: 'tom.wilson@eduverse.vr',
          linkedin: 'https://linkedin.com/in/tomwilson',
          commitment: 'Full-time',
          equity: '30'
        },
        {
          name: 'Dr. Maria Santos',
          role: 'Head of Curriculum',
          expertise: 'STEM education, instructional design, learning assessment, educational research',
          email: 'maria.santos@eduverse.vr',
          linkedin: 'https://linkedin.com/in/mariasantos',
          commitment: 'Part-time',
          equity: '8'
        }
      ],
      coreSkills: ['Technology', 'Design', 'Product Development'],
      resourcesNeeded: ['Software', 'Development Tools', 'Equipment'],
      skillsGap: 'Need 3D content artists for immersive educational environments. Require educational technology sales professionals with K-12 experience. Looking for learning assessment specialist for efficacy measurement.',
      resourceBudget: '$680,000',
      teamStructure: 'Development team creates VR experiences, content team develops curriculum-aligned modules, education team handles teacher training and school relationships.',
      collaborationPreferences: 'Agile development with monthly educator feedback cycles, quarterly curriculum review board meetings. Strong collaboration with pilot schools for user testing.',
      remoteWorkPolicy: 'Hybrid',
      timeline: '12 months to comprehensive STEM curriculum with proven learning outcomes',
      owner: testUser._id
    },
    {
      ideaId: createdIdeas[4]._id,
      teamMembers: [
        {
          name: 'Jennifer Lee',
          role: 'Founder & CEO',
          expertise: 'Financial technology, small business consulting, product strategy, fundraising',
          email: 'jennifer.lee@finflow.app',
          linkedin: 'https://linkedin.com/in/jenniferlee',
          commitment: 'Full-time',
          equity: '38'
        },
        {
          name: 'Robert Zhang',
          role: 'Co-founder & CTO',
          expertise: 'Full-stack development, financial systems, API integrations, data security',
          email: 'robert.zhang@finflow.app',
          linkedin: 'https://linkedin.com/in/robertzhang',
          commitment: 'Full-time',
          equity: '27'
        },
        {
          name: 'Sarah Johnson',
          role: 'Head of Data Science',
          expertise: 'Financial modeling, machine learning, predictive analytics, risk assessment',
          email: 'sarah.johnson@finflow.app',
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          commitment: 'Full-time',
          equity: '15'
        }
      ],
      coreSkills: ['Finance', 'Technology', 'Business Development'],
      resourcesNeeded: ['Software', 'Cloud Services', 'Legal Services'],
      skillsGap: 'Need compliance specialist for financial regulations and banking partnerships. Require customer success manager for SME onboarding and retention. Looking for growth marketing specialist with fintech experience.',
      resourceBudget: '$320,000',
      teamStructure: 'Product team handles platform development and user experience, data team focuses on AI insights and analytics, business team manages partnerships and customer acquisition.',
      collaborationPreferences: 'Continuous deployment with weekly feature releases, monthly customer feedback reviews, quarterly business metrics analysis. Strong focus on data-driven decision making.',
      remoteWorkPolicy: 'Fully Remote',
      timeline: '15 months to AI-powered insights with established banking integrations',
      owner: testUser._id
    }
  ];

  console.log('👥 Creating sample team resources...');
  const createdTeamResources = await TeamResource.insertMany(sampleTeamResources);
  console.log(`✅ Created ${createdTeamResources.length} team resources`);

  // Summary
  console.log('\n🎉 Sample data creation completed!');
  console.log('='.repeat(50));
  console.log(`✅ Ideas: ${createdIdeas.length} documents`);
  console.log(`✅ BusinessAims: ${createdBusinessAims.length} documents`);
  console.log(`✅ TeamResources: ${createdTeamResources.length} documents`);
  console.log(`👤 Test User ID: ${testUser._id}`);
  console.log('\n📊 You can now view this data at:');
  console.log('🌐 BusinessAims Viewer: http://localhost:5001/admin/businessaims');
  console.log('🗄️ Database: ideas, businessaims, teamresources collections');
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});