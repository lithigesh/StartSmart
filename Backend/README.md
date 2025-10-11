# StartSmart Backend

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-5.1.0-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-8.18.0-green.svg)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/jwt-9.0.2-purple.svg)](https://jwt.io/)

## 🎯 Overview

The StartSmart backend is a robust Node.js API server built with Express.js and MongoDB, providing comprehensive endpoints for startup evaluation, funding management, and ideathon platforms. It features AI-powered analysis, secure authentication, and role-based access control.

## 🏗️ Architecture

```
Backend/
├── controllers/         # Request handlers and business logic
├── models/             # MongoDB schemas and data models
├── routes/             # API route definitions
├── middlewares/        # Custom middleware functions
├── services/           # External service integrations
├── validators/         # Input validation rules
├── utils/              # Utility functions and helpers
├── config/             # Configuration files
└── server.js          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)

### Installation
```bash
cd Backend
npm install
cp .env.example .env
# Configure your environment variables
npm run setup
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=5001
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/startsmart
GEMINI_API_KEY=your_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
ADMIN_EMAIL=admin@startsmart.com
ADMIN_PASSWORD=secure_admin_password
```

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run init-admin # Initialize admin account
npm run setup      # Install dependencies and initialize admin
```

## 📡 API Routes & Endpoints

### 🔐 Authentication Routes (`/api/auth`)

**Purpose**: User registration, authentication, and profile management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new user account |
| `POST` | `/login` | Public | User authentication and JWT generation |
| `GET` | `/me` | Protected | Get current user profile |
| `PUT` | `/profile` | Protected | Update user profile information |
| `DELETE` | `/profile` | Protected | Delete user account |
| `GET` | `/users/:id/history` | Protected | Get user activity history |

**Request Examples**:
```javascript
// Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "entrepreneur",
  "location": "San Francisco, CA",
  "industry": "Technology"
}

// User login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 💡 Ideas Routes (`/api/ideas`)

**Purpose**: Business idea submission, analysis, and investor interactions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Entrepreneur | Submit new business idea |
| `GET` | `/` | Investor | Browse all available ideas |
| `GET` | `/user/:userId` | Entrepreneur | Get user's submitted ideas |
| `GET` | `/interested/list` | Investor | Get investor's interested ideas |
| `GET` | `/:id` | Protected | Get specific idea details |
| `PUT` | `/:id` | Entrepreneur | Update idea information |
| `DELETE` | `/:id` | Entrepreneur | Delete idea |
| `POST` | `/:id/analysis` | Entrepreneur | Trigger AI analysis |
| `PUT` | `/:id/analysis` | Entrepreneur | Re-run AI analysis |
| `DELETE` | `/:id/analysis` | Entrepreneur | Delete analysis data |
| `POST` | `/:id/interest` | Investor | Mark interest in idea |
| `DELETE` | `/:id/interest` | Investor | Remove interest |
| `GET` | `/:id/investors` | Entrepreneur | Get interested investors |
| `GET` | `/:id/report` | Entrepreneur | Download PDF report |

**Key Features**:
- **File Upload Support**: Attach documents, images, prototypes
- **AI Analysis Integration**: Google Generative AI for idea evaluation
- **Interest Management**: Investor-entrepreneur connection system
- **PDF Report Generation**: Comprehensive analysis reports

### 💰 Funding Routes (`/api/funding`)

**Purpose**: Funding request management and investor-entrepreneur matching

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Entrepreneur | Create funding request |
| `GET` | `/` | Protected | Get all funding requests (filtered by role) |
| `GET` | `/user` | Entrepreneur | Get user's funding requests |
| `GET` | `/stats` | Protected | Get funding statistics |
| `GET` | `/idea/:ideaId/interested-investors` | Entrepreneur | Get interested investors for idea |
| `GET` | `/investor/pipeline` | Investor | Get investor's deal pipeline |
| `GET` | `/:id` | Protected | Get specific funding request |
| `PUT` | `/:id` | Protected | Update funding request status |
| `DELETE` | `/:id` | Entrepreneur | Withdraw funding request |
| `PUT` | `/:id/details` | Entrepreneur | Update request details |
| `PUT` | `/:id/view` | Investor | Mark request as viewed |
| `PUT` | `/:id/investor-response` | Investor | Accept/decline request |
| `POST` | `/:id/negotiate` | Investor | Send negotiation message |
| `POST` | `/:id/entrepreneur-negotiate` | Entrepreneur | Respond to negotiation |

**Workflow**:
1. **Request Creation**: Entrepreneur submits funding request
2. **Investor Discovery**: Investors browse and filter requests
3. **Interest Expression**: Investors mark interest and view details
4. **Negotiation**: Back-and-forth negotiation process
5. **Agreement**: Final terms and funding approval

### 🏆 Ideathon Routes (`/api/ideathons`)

**Purpose**: Competition management and participation system

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Admin | Create new ideathon |
| `GET` | `/` | Protected | Get all ideathons |
| `GET` | `/registrations` | Admin | Get all registrations |
| `GET` | `/:id` | Protected | Get specific ideathon |
| `PUT` | `/:id` | Admin | Update ideathon details |
| `DELETE` | `/:id` | Admin | Delete ideathon |
| `POST` | `/:id/register` | Protected | Register for ideathon |
| `GET` | `/:id/registrations` | Admin | Get ideathon registrations |
| `PUT` | `/:id/results` | Admin | Post competition results |

**Ideathon Features**:
- **Competition Management**: Create and manage competitions
- **Registration System**: Handle participant enrollment
- **Submission Tracking**: Monitor competition entries
- **Result Management**: Announce winners and distribute prizes

### 🔧 Admin Routes (`/api/admin`)

**Purpose**: Administrative functions and platform management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/login` | Public | Admin authentication |
| `POST` | `/verify` | Admin | Verify admin password (legacy) |
| `GET` | `/users` | Admin | Get all platform users |
| `GET` | `/ideas` | Admin | Get all submitted ideas |
| `GET` | `/ideas/:id` | Admin | Get specific idea details |
| `PUT` | `/users/:id/role` | Admin | Change user role |
| `DELETE` | `/users/:id` | Admin | Delete user account |
| `DELETE` | `/ideas/:id` | Admin | Delete idea |
| `GET` | `/activities` | Admin | Get admin activity log |

**Feedback Management**:
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/feedback` | Admin | Get all feedback |
| `POST` | `/feedback` | Admin | Create feedback entry |
| `PUT` | `/feedback/:id` | Admin | Update feedback |
| `DELETE` | `/feedback/:id` | Admin | Delete feedback |

**Sustainability Management**:
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/sustainability` | Admin | Get sustainability assessments |
| `POST` | `/sustainability` | Admin | Create assessment |
| `PUT` | `/sustainability/:id` | Admin | Update assessment |
| `DELETE` | `/sustainability/:id` | Admin | Delete assessment |
| `GET` | `/sustainability/stats` | Admin | Get sustainability statistics |

**Analytics & Reporting**:
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/analytics/dashboard` | Admin | Get dashboard analytics |
| `GET` | `/analytics/charts` | Admin | Get chart data |
| `GET` | `/reports/:type` | Admin | Generate specific report type |

### 📊 Investment Routes (`/api/investor`)

**Purpose**: Investor-specific functionality and portfolio management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/profile` | Investor | Get investor profile |
| `PUT` | `/profile` | Investor | Update investor profile |
| `GET` | `/portfolio` | Investor | Get investment portfolio |
| `GET` | `/interests` | Investor | Get interested ideas |
| `POST` | `/interests` | Investor | Add idea to interests |
| `DELETE` | `/interests/:ideaId` | Investor | Remove from interests |
| `GET` | `/analytics` | Investor | Get investment analytics |

### 🔔 Notification Routes (`/api/notifications`)

**Purpose**: Real-time notification system

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Protected | Get user notifications |
| `POST` | `/` | Protected | Create notification |
| `GET` | `/count` | Protected | Get unread count |
| `PUT` | `/mark-all-read` | Protected | Mark all as read |
| `DELETE` | `/clear-all` | Protected | Clear all notifications |
| `PUT` | `/:id/read` | Protected | Mark specific as read |
| `DELETE` | `/:id` | Protected | Delete notification |

### 📈 Analytics Routes (`/api/chart`, `/api/comparison`, `/api/marketResearch`)

**Chart Data API** (`/api/chart`):
- Performance metrics and visualization data
- User engagement analytics
- Revenue and growth charts
- Market trend analysis

**Comparison API** (`/api/comparison`):
- Idea comparison tools
- Competitive analysis
- Benchmark data
- Performance comparisons

**Market Research API** (`/api/marketResearch`):
- Industry analysis and insights
- Market opportunity assessment
- Trend identification
- Competitive landscape data

### 🌱 Sustainability Routes (`/api/sustainability`)

**Purpose**: Environmental impact tracking and green innovation

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/assessments` | Protected | Get sustainability assessments |
| `POST` | `/assessments` | Protected | Create new assessment |
| `GET` | `/assessments/:id` | Protected | Get specific assessment |
| `PUT` | `/assessments/:id` | Protected | Update assessment |
| `DELETE` | `/assessments/:id` | Protected | Delete assessment |
| `GET` | `/metrics` | Protected | Get sustainability metrics |
| `GET` | `/reports` | Protected | Generate sustainability reports |

### 📝 Feedback & Reporting Routes

**App Feedback** (`/api/appFeedback`):
- User feedback collection
- Bug reporting system
- Feature requests
- User satisfaction surveys

**Report Generation** (`/api/report`):
- PDF report generation
- Custom report templates
- Data export functionality
- Scheduled reporting

**Business Aim & Team Resources** (`/api/businessAim`, `/api/teamResource`):
- Business objective tracking
- Team collaboration tools
- Resource management
- Goal setting and monitoring

## 🔒 Security & Middleware

### Authentication Middleware (`auth.middleware.js`)
```javascript
const protect = async (req, res, next) => {
  // JWT token validation
  // User authentication
  // Token refresh handling
};
```

### Role-Based Access Control (`role.middleware.js`)
```javascript
const isAdmin = (req, res, next) => {
  // Admin role verification
};

const isEntrepreneur = (req, res, next) => {
  // Entrepreneur role verification
};

const isInvestor = (req, res, next) => {
  // Investor role verification
};
```

### Error Handling (`errorHandler.js`)
- Global error catching and processing
- User-friendly error messages
- Error logging and monitoring
- Development vs production error responses

### Input Validation (`validators/`)
- **Idea Validation**: Business idea submission rules
- **User Validation**: Registration and profile validation
- **File Validation**: Upload security and type checking
- **Request Validation**: API parameter and body validation

## 🗄️ Database Models

### User Model (`User.model.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['entrepreneur', 'investor', 'admin'],
  profile: {
    location: String,
    industry: String,
    experience: String,
    skills: [String],
    socialLinks: Object
  },
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Idea Model (`Idea.model.js`)
```javascript
{
  title: String,
  description: String,
  category: String,
  stage: Enum,
  fundingNeeded: Number,
  user: ObjectId (ref: User),
  attachments: [String],
  analysis: {
    aiScore: Number,
    marketPotential: Number,
    riskAssessment: Object,
    recommendations: [String],
    generatedAt: Date
  },
  interestedInvestors: [ObjectId],
  status: Enum,
  createdAt: Date,
  updatedAt: Date
}
```

### Funding Request Model (`FundingRequest.model.js`)
```javascript
{
  idea: ObjectId (ref: Idea),
  entrepreneur: ObjectId (ref: User),
  amount: Number,
  equity: Number,
  description: String,
  businessPlan: String,
  timeline: String,
  status: Enum,
  interestedInvestors: [{
    investor: ObjectId,
    response: String,
    message: String,
    terms: Object,
    respondedAt: Date
  }],
  negotiations: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

### Ideathon Model (`Ideathon.model.js`)
```javascript
{
  title: String,
  description: String,
  theme: String,
  startDate: Date,
  endDate: Date,
  organizers: String,
  location: Enum ['Online', 'Offline', 'Hybrid'],
  fundingPrizes: String,
  submissionFormat: [Enum],
  eligibilityCriteria: String,
  judgingCriteria: String,
  contactInformation: String,
  registrations: [{
    user: ObjectId,
    teamName: String,
    teamMembers: [String],
    idea: String,
    registeredAt: Date
  }],
  winners: [Object],
  status: Enum,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧠 AI Integration Services

### AI Analysis Service (`aiAnalysis.service.js`)
```javascript
const analyzeBusinessIdea = async (ideaData) => {
  // Google Generative AI integration
  // Comprehensive business analysis
  // Market opportunity assessment
  // Risk evaluation
  // Growth potential analysis
  // Sustainability scoring
};
```

**Analysis Components**:
- **Market Viability**: Target market size and competition
- **Business Model**: Revenue streams and scalability
- **Technical Feasibility**: Implementation complexity
- **Financial Projections**: Revenue and cost estimates
- **Risk Assessment**: Potential challenges and mitigation
- **Sustainability Score**: Environmental impact evaluation

### Email Service (`email.services.js`)
```javascript
const sendWelcomeEmail = async (user) => {
  // SendGrid integration
  // Template-based emails
  // Notification delivery
};
```

**Email Types**:
- Welcome and onboarding emails
- Idea analysis completion notifications
- Funding request updates
- Ideathon registration confirmations
- Investor interest notifications
- Admin activity alerts

### PDF Service (`pdf.service.js`)
```javascript
const generateIdeaReport = async (idea, analysis) => {
  // PDFKit integration
  // Professional report generation
  // Charts and visualizations
  // Branded templates
};
```

## 📊 Performance & Monitoring

### Database Optimization
- **Indexing Strategy**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Aggregation pipelines and efficient lookups
- **Caching**: Redis integration for frequently accessed data

### API Performance
- **Rate Limiting**: Protection against abuse and overuse
- **Response Compression**: Gzip compression for faster responses
- **Request Validation**: Early validation to prevent unnecessary processing
- **Error Handling**: Graceful error responses and logging

### Monitoring & Logging
- **Error Tracking**: Comprehensive error logging and reporting
- **Performance Metrics**: Response time and throughput monitoring
- **User Activity**: Audit trails and user behavior tracking
- **System Health**: Server performance and resource utilization

## 🚀 Deployment & DevOps

### Development Environment
```bash
npm run dev          # Start with nodemon for auto-restart
npm run init-admin   # Initialize admin account
npm run setup        # Full setup with dependencies and admin
```

### Production Deployment
```bash
npm start            # Production server
npm run migrate      # Database migrations
npm run seed         # Seed initial data
```

### Environment Configuration
```javascript
// config/db.js
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 🧪 Testing Strategy

### Unit Testing
- Controller function testing
- Model validation testing
- Service integration testing
- Utility function testing

### Integration Testing
- API endpoint testing
- Database operation testing
- External service integration testing
- Authentication flow testing

### Load Testing
- Concurrent user simulation
- Database performance under load
- API response time testing
- Memory and CPU usage monitoring

## 📈 Scalability & Future Enhancements

### Planned Features
- **Microservices Architecture**: Break down into smaller, manageable services  
- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning for better insights
- **API Rate Limiting**: Enhanced protection and fair usage
- **Caching Layer**: Redis for improved performance
- **Message Queues**: Asynchronous processing for heavy operations

### Performance Improvements
- **Database Sharding**: Horizontal scaling for large datasets
- **CDN Integration**: Global content delivery for faster responses
- **Load Balancing**: Distribute traffic across multiple servers
- **API Gateway**: Centralized API management and routing
- **Containerization**: Docker and Kubernetes for scalable deployment

---

**StartSmart Backend** - Powering Innovation Through Robust APIs 🚀