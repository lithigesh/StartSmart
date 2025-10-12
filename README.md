# StartSmart - AI-Powered Startup Evaluation & Funding Ecosystem

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lithigesh/StartSmart)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)

## 🚀 Project Overview

StartSmart is a comprehensive full-stack web platform that revolutionizes the startup ecosystem by connecting entrepreneurs with investors through AI-powered idea evaluation and smart funding mechanisms. The platform leverages artificial intelligence to provide detailed analysis of business ideas, facilitate funding requests, and create a collaborative environment for innovation.

### ✨ Key Features

- **🤖 AI-Powered Idea Analysis**: Advanced AI evaluation of business concepts with detailed reports
- **💰 Smart Funding System**: Streamlined funding request and approval processes
- **🏆 Ideathon Management**: Comprehensive competition hosting and participation system
- **👥 Multi-Role Dashboard**: Separate interfaces for Entrepreneurs, Investors, and Administrators
- **📊 Analytics & Reporting**: Real-time insights and performance metrics
- **🌱 Sustainability Focus**: Environmental impact assessment and green innovation tracking
- **🔒 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Modern, mobile-first UI with glassmorphism design patterns

## 🏗️ Architecture

StartSmart follows a modern full-stack architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │   (Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.2.0 with modern hooks
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Chart.js & Recharts for data visualization
- React Icons for UI elements

**Backend:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Google Generative AI for analysis
- SendGrid for email services
- Multer for file uploads
- PDFKit for report generation

**Deployment:**
- Frontend: Vercel
- Backend: Node.js hosting platform
- Database: MongoDB Atlas

## 📁 Detailed Project Structure

### 🎯 Frontend Structure (`/Frontend`)

```
Frontend/
├── public/                           # Static assets served directly
│   ├── ico_icon.ico                 # Favicon for browser tabs
│   ├── svg_icon.svg                 # SVG logo for scalable graphics
│   └── w_startSmart_icon.png        # PNG logo for various uses
├── src/                             # Source code directory
│   ├── components/                  # Reusable React components
│   │   ├── ui/                      # Base UI components (buttons, inputs, cards)
│   │   ├── entrepreneur/            # Entrepreneur-specific components
│   │   │   ├── SideBar.jsx          # Navigation sidebar for entrepreneur dashboard
│   │   │   ├── DashboardCard.jsx    # Metric display cards
│   │   │   ├── IdeaCard.jsx         # Individual idea display component
│   │   │   ├── NotificationsPopup.jsx # Real-time notification popup
│   │   │   └── index.js             # Component exports
│   │   ├── investor/                # Investor-specific components
│   │   │   ├── IdeasSection.jsx     # Ideas browsing interface
│   │   │   ├── ErrorMessage.jsx     # Error display component
│   │   │   └── index.js             # Component exports
│   │   ├── EmptyState.jsx           # Empty data state component
│   │   ├── ErrorBoundary.jsx        # React error boundary wrapper
│   │   ├── Footer.jsx               # Site footer component
│   │   ├── Header.jsx               # Site header and navigation
│   │   ├── HeroSection.jsx          # Landing page hero section
│   │   ├── IdeaCard.jsx             # General idea display card
│   │   ├── MainContentSection.jsx   # Landing page main content
│   │   ├── ProtectedRoute.jsx       # Authentication route guard
│   │   └── RoleBasedRoute.jsx       # Role-specific route protection
│   ├── pages/                       # Page-level components
│   │   ├── entrepreneur/            # Entrepreneur dashboard pages
│   │   │   ├── EntrepreneurDashboard.jsx      # Main entrepreneur dashboard
│   │   │   ├── EntrepreneurDashboardPage.jsx  # Enhanced dashboard view
│   │   │   ├── CollaborationsPage.jsx         # Team collaboration interface
│   │   │   └── IdeathonsPage.jsx              # Competition participation
│   │   ├── investor/                # Investor dashboard pages
│   │   │   └── InvestorDashboard.jsx # Main investor dashboard
│   │   ├── admin/                   # Admin dashboard pages
│   │   │   ├── AdminDashboardPage.jsx        # Admin overview dashboard
│   │   │   ├── AdminIdeasPage.jsx            # Idea management interface
│   │   │   ├── AdminIdeathonsPage.jsx        # Competition management
│   │   │   ├── AdminUsersPage.jsx            # User account management
│   │   │   ├── AdminFeedbackPage.jsx         # Feedback collection
│   │   │   └── AdminSustainabilityPage.jsx   # Sustainability tracking
│   │   ├── IdeaSubmission/          # Multi-step idea submission
│   │   │   ├── IdeaSubmissionPage.jsx        # Main submission workflow
│   │   │   └── components/                   # Form components
│   │   │       ├── IdeaMasterForm.jsx        # Core idea details form
│   │   │       ├── TeamResourceForm.jsx     # Team and resource planning
│   │   │       └── BusinessAimForm.jsx      # Business strategy form
│   │   ├── errors/                  # Error page components
│   │   ├── LandingPage.jsx          # Public homepage
│   │   ├── LoginPage.jsx            # User authentication
│   │   ├── RegisterPage.jsx         # User registration
│   │   ├── IdeaDetailPage.jsx       # Individual idea view
│   │   ├── IdeasPage.jsx            # Ideas listing
│   │   ├── FundingPage.jsx          # Funding requests
│   │   ├── IdeathonsPage.jsx        # Competition listing
│   │   ├── NotificationsPage.jsx    # Notification center
│   │   └── SettingsPage.jsx         # User preferences
│   ├── context/                     # React Context providers
│   │   └── AuthContext.jsx          # Authentication state management
│   ├── hooks/                       # Custom React hooks
│   │   └── useNotifications.js      # Notification management hook
│   ├── services/                    # API integration layer
│   │   └── api.js                   # HTTP client and API endpoints
│   ├── utils/                       # Utility functions
│   │   └── errorHandler.js          # Error processing utilities
│   ├── App.jsx                      # Root application component
│   └── main.jsx                     # Application entry point
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tailwind.css                     # Global CSS styles
├── vite.config.js                   # Vite build configuration
└── vercel.json                      # Vercel deployment settings
```

### ⚙️ Backend Structure (`/Backend`)

```
Backend/
├── config/                          # Configuration files
│   └── db.js                        # MongoDB connection setup
├── controllers/                     # Request handlers and business logic
│   ├── admin.controller.js          # Admin dashboard operations
│   ├── auth.controller.js           # User authentication logic
│   ├── feedback.controller.js       # Feedback management
│   ├── funding.controller.js        # Funding request processing
│   ├── idea.controller.js           # Idea CRUD operations
│   ├── ideathon.controller.js       # Competition management
│   ├── investor.controller.js       # Investor-specific operations
│   ├── notification.controller.js   # Notification system
│   ├── report.controller.js         # Report generation
│   └── sustainability.controller.js # Environmental impact tracking
├── middlewares/                     # Express middleware functions
│   ├── auth.middleware.js           # JWT token validation
│   ├── errorHandler.js              # Global error handling
│   └── role.middleware.js           # Role-based access control
├── models/                          # MongoDB schema definitions
│   ├── AdminAction.model.js         # Admin activity logging
│   ├── Feedback.model.js            # User feedback schema
│   ├── FundingRequest.model.js      # Funding application schema
│   ├── Idea.model.js                # Business idea schema
│   ├── Ideathon.model.js            # Competition schema
│   ├── IdeathonRegistration.model.js # Competition registration
│   ├── InvestorInterest.model.js    # Investor engagement tracking
│   ├── Notification.model.js        # Notification schema
│   ├── Report.model.js              # Generated report schema
│   ├── Sustainability.model.js      # Environmental assessment
│   └── User.model.js                # User account schema
├── routes/                          # API endpoint definitions
│   ├── admin.routes.js              # Admin API endpoints
│   ├── auth.routes.js               # Authentication endpoints
│   ├── feedback.routes.js           # Feedback API routes
│   ├── funding.routes.js            # Funding management APIs
│   ├── idea.routes.js               # Idea CRUD endpoints
│   ├── ideathon.routes.js           # Competition APIs
│   ├── investor.routes.js           # Investor-specific endpoints
│   ├── notification.routes.js       # Notification APIs
│   ├── report.routes.js             # Report generation endpoints
│   └── sustainability.routes.js     # Sustainability APIs
├── services/                        # External service integrations
│   ├── aiAnalysis.service.js        # Google Generative AI integration
│   ├── email.services.js            # SendGrid email service
│   ├── notification.service.js      # Notification delivery
│   └── pdf.service.js               # PDF report generation
├── utils/                           # Utility functions
│   └── generateToken.js             # JWT token creation
├── validators/                      # Input validation rules
│   └── idea.validator.js            # Idea submission validation
├── server.js                        # Express server entry point
└── package.json                     # Dependencies and scripts
```

## � File Execution Procedures

### 📋 Key Files and Their Purposes

**Frontend Entry Points:**
- `main.jsx` - React application entry point, renders App component
- `App.jsx` - Root component with routing and authentication context
- `index.html` - HTML template that loads the React application

**Backend Entry Points:**
- `server.js` - Express server startup, middleware setup, and route mounting
- `config/db.js` - MongoDB connection establishment and configuration

**Critical Configuration Files:**
- `Frontend/vite.config.js` - Vite build tool configuration for development and production
- `Frontend/tailwind.config.js` - Tailwind CSS framework customization
- `Backend/.env` - Environment variables for API keys, database URLs, and secrets
- `Frontend/.env` - Frontend environment variables for API endpoints

### 🚀 Step-by-Step Execution Guide

#### 1. Initial Setup
```bash
# Clone the repository
git clone https://github.com/lithigesh/StartSmart.git
cd StartSmart
```

#### 2. Backend Setup & Execution
```bash
# Navigate to backend directory
cd Backend

# Install all dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit .env file with your configuration:
# - MongoDB connection string
# - JWT secret key
# - Google Generative AI API key
# - SendGrid API key for emails

# Initialize admin account and start development server
npm run setup    # Installs dependencies and creates admin user
npm run dev      # Starts server with nodemon for auto-restart

# Alternative commands:
npm start        # Production server
npm run init-admin  # Create admin account only
```

#### 3. Frontend Setup & Execution
```bash
# Open new terminal and navigate to frontend
cd Frontend

# Install all dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5001" > .env

# Start development server
npm run dev      # Starts Vite dev server on http://localhost:5173

# Alternative commands:
npm run build    # Build for production
npm run preview  # Preview production build
```

#### 4. Database Setup
```bash
# If using local MongoDB:
mongod --dbpath /path/to/your/db

# If using MongoDB Atlas:
# 1. Create cluster on MongoDB Atlas
# 2. Get connection string
# 3. Add to Backend/.env file
```

#### 5. Verification Steps
1. **Backend**: Visit `http://localhost:5001/api/health` (if health endpoint exists)
2. **Frontend**: Visit `http://localhost:5173` to see the landing page
3. **Database**: Check MongoDB connection in backend console logs
4. **Admin Access**: Login with admin credentials created during setup

### 📁 Important File Relationships

**Authentication Flow:**
- `AuthContext.jsx` ↔ `auth.controller.js` ↔ `User.model.js`
- JWT tokens managed by `generateToken.js` and validated by `auth.middleware.js`

**Idea Submission Flow:**
- `IdeaSubmissionPage.jsx` → `IdeaMasterForm.jsx` → `api.js` → `idea.routes.js` → `idea.controller.js` → `Idea.model.js`

**Admin Dashboard Flow:**
- `AdminDashboardPage.jsx` → `admin.routes.js` → `admin.controller.js` → Various models

**API Integration:**
- All frontend components use `services/api.js` for HTTP requests
- Backend routes are organized by feature in `routes/` directory
- Controllers handle business logic and interact with models

## �🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lithigesh/StartSmart.git
   cd StartSmart
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run setup
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5001
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/startsmart
GEMINI_API_KEY=your_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5001
```

## 👥 User Roles & Workflows

### 🚀 Entrepreneurs
1. **Register/Login** → Access entrepreneur dashboard
2. **Submit Ideas** → Upload business concepts with attachments
3. **AI Analysis** → Get detailed AI-powered evaluation reports
4. **Funding Requests** → Apply for funding with business plans
5. **Ideathon Participation** → Join competitions and showcase innovations
6. **Investor Interactions** → View interested investors and manage communications

### 💼 Investors
1. **Register/Login** → Access investor dashboard
2. **Browse Ideas** → Explore entrepreneur submissions with AI insights
3. **Mark Interest** → Express interest in promising ventures
4. **Funding Opportunities** → Review and approve funding requests
5. **Portfolio Management** → Track investments and performance
6. **Market Analysis** → Access industry trends and insights

### 🔧 Administrators
1. **Admin Login** → Access administrative dashboard
2. **User Management** → Oversee user accounts and activities
3. **Ideathon Management** → Create and manage competitions
4. **Content Moderation** → Review and approve submissions
5. **Analytics** → Monitor platform performance and usage
6. **System Configuration** → Manage platform settings and policies

## 🎯 Core Features

### AI-Powered Analysis
- **Business Model Evaluation**: Comprehensive analysis of business viability
- **Market Opportunity Assessment**: Market size and competition analysis
- **Risk Analysis**: Identification of potential challenges and mitigation strategies
- **Sustainability Score**: Environmental impact evaluation
- **Growth Potential**: Scalability and expansion opportunities

### Funding Ecosystem
- **Smart Matching**: AI-driven investor-entrepreneur matching
- **Funding Pipeline**: Streamlined application and approval process
- **Due Diligence Tools**: Comprehensive evaluation frameworks
- **Portfolio Tracking**: Real-time investment performance monitoring

### Competition Platform
- **Ideathon Creation**: Admin tools for competition management
- **Registration System**: Seamless participant enrollment
- **Submission Portal**: Multi-format idea submission support
- **Judging Framework**: Structured evaluation and scoring system
- **Prize Distribution**: Automated winner selection and rewards

## 📊 API Documentation

The backend provides RESTful APIs organized by functionality:

- **Authentication**: `/api/auth` - User registration, login, profile management
- **Ideas**: `/api/ideas` - Idea submission, analysis, investor interactions
- **Funding**: `/api/funding` - Funding requests and approval workflows
- **Ideathons**: `/api/ideathons` - Competition management and participation
- **Analytics**: `/api/analytics` - Platform insights and reporting
- **Admin**: `/api/admin` - Administrative functions and user management

For detailed API documentation, see [Backend README](./Backend/README.md).

## 🎨 UI/UX Design

StartSmart features a modern, professional design with:

- **Glassmorphism Effects**: Translucent elements with backdrop blur
- **Dark Theme**: Eye-friendly dark interface with accent colors
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Accessibility**: WCAG compliant with proper contrast and navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Comprehensive server-side validation
- **File Upload Security**: Secure file handling with type validation
- **Environment Configuration**: Secure environment variable management
- **CORS Protection**: Cross-origin request security

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Node.js Platform)
```bash
npm start
# Configure environment variables on hosting platform
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Configure connection string
- Set up database indexes for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lithigesh**
- GitHub: [@lithigesh](https://github.com/lithigesh)
- Project: [StartSmart](https://github.com/lithigesh/StartSmart)

## 🙏 Acknowledgments

- Google Generative AI for providing AI analysis capabilities
- SendGrid for reliable email services
- Vercel for seamless frontend deployment
- MongoDB for scalable database solutions
- The open-source community for amazing tools and libraries

---

**StartSmart** - Empowering Innovation, Connecting Opportunities 🚀