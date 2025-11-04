# StartSmart Frontend

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.16-blue.svg)](https://tailwindcss.com/)

## 🎯 Overview

The StartSmart frontend is a modern React application built with Vite, featuring a responsive design with glassmorphism effects and role-based interfaces for entrepreneurs, investors, and administrators.

## 🏗️ Architecture

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

## 📱 Pages & Workflows

### 🏠 Public Pages

#### `LandingPage.jsx`
**Purpose**: Main landing page for new visitors
**Features**:
- Hero section with value proposition
- Feature highlights and benefits
- Call-to-action buttons for registration
- Responsive design with animations

**Workflow**:
1. User visits the homepage
2. Views platform benefits and features
3. Chooses to register as Entrepreneur or Investor
4. Redirected to appropriate registration flow

#### `LoginPage.jsx`
**Purpose**: User authentication portal
**Features**:
- Email/password login form
- Role-based redirection after login
- "Remember me" functionality
- Password reset options
- Social authentication (future)

**Workflow**:
1. User enters credentials
2. System validates and authenticates
3. JWT token stored in localStorage
4. Redirected to role-specific dashboard

#### `RegisterPage.jsx`
**Purpose**: New user account creation
**Features**:
- Multi-step registration form
- Role selection (Entrepreneur/Investor)
- Form validation and error handling
- Terms and conditions acceptance
- Email verification process

**Workflow**:
1. User selects role (Entrepreneur/Investor)
2. Fills personal information
3. Provides professional details
4. Account creation and email verification
5. Redirected to appropriate dashboard

### 🚀 Entrepreneur Pages

#### `EntrepreneurDashboard.jsx`
**Purpose**: Main dashboard for entrepreneurs
**Features**:
- Welcome section with user stats
- Recent activity feed
- Quick action buttons
- Idea submission metrics
- Notification panel
- Performance charts

**Workflow**:
1. Login → Dashboard overview
2. View submitted ideas and their status
3. Check AI analysis results
4. Monitor investor interest
5. Access funding opportunities

#### `EntrepreneurDashboardPage.jsx`
**Purpose**: Enhanced dashboard with detailed analytics
**Components Used**:
- `DashboardHeader` - User greeting and stats
- `DashboardCardsGrid` - Key metrics cards
- `RecentActivitySection` - Activity timeline
- `MyIdeasSection` - Ideas management
- `NotificationsPopup` - Real-time notifications

#### `IdeasPage.jsx` & `IdeasPageSimple.jsx`
**Purpose**: Idea management interface
**Features**:
- Submit new business ideas
- Upload supporting documents
- View AI analysis reports
- Track idea performance
- Manage idea visibility
- Export analysis reports

**Workflow**:
1. Submit Idea → Fill form with business details
2. Upload Documents → Add pitch decks, prototypes
3. AI Analysis → Wait for automated evaluation
4. Review Results → View comprehensive analysis
5. Investor Interest → Monitor investor engagement
6. Funding Requests → Apply for funding based on analysis

#### `IdeaDetailPage.jsx`
**Purpose**: Detailed view of individual ideas
**Features**:
- Complete idea information display
- AI analysis visualization
- Interested investors list
- Comments and feedback section
- Edit and delete options
- Social sharing capabilities

#### `FundingPage.jsx` & `FundingDashboardPage.jsx`
**Purpose**: Funding request management
**Features**:
- Create funding requests
- Track application status
- View investor proposals
- Document management
- Payment integration
- Legal document generation

**Workflow**:
1. Create Request → Submit funding application
2. Documentation → Upload required documents
3. Review Process → Track application progress
4. Investor Matching → Connect with interested investors
5. Negotiation → Discuss terms and conditions
6. Agreement → Finalize funding terms

#### `IdeathonsPage.jsx`
**Purpose**: Competition participation platform
**Features**:
- Browse available competitions
- Register for ideathons
- Submit competition entries
- Track competition progress
- View results and rankings
- Prize distribution

### 💼 Investor Pages

#### `InvestorDashboard.jsx`
**Purpose**: Main dashboard for investors
**Features**:
- Investment portfolio overview
- Market opportunity insights
- Trending ideas and sectors
- Investment performance metrics
- Recommendation engine
- Due diligence tools

**Workflow**:
1. Login → Portfolio overview
2. Browse Ideas → Explore entrepreneur submissions
3. AI Insights → Review automated analysis
4. Mark Interest → Express investment interest
5. Due Diligence → Detailed evaluation process
6. Investment → Funding approval and transfer

#### `IdeasSection.jsx` (Investor View)
**Purpose**: Idea browsing interface for investors
**Features**:
- Advanced filtering and search
- AI-powered recommendations
- Idea comparison tools
- Interest marking system
- Bookmarking functionality
- Export capabilities

#### `InvestorsPage.jsx`
**Purpose**: Investor community and networking
**Features**:
- Investor directory
- Networking opportunities
- Investment clubs and groups
- Market analysis sharing
- Collaboration tools
- Event listings

### 🔧 Admin Pages

#### `AdminDashboard.jsx` & `AdminDashboardLayout.jsx`
**Purpose**: Administrative control center
**Features**:
- Platform overview and statistics
- User management interface
- Content moderation tools
- System health monitoring
- Revenue and performance metrics
- Security and compliance monitoring

#### `AdminUsersPage.jsx`
**Purpose**: User account management
**Features**:
- User account listing and search
- Account verification and approval
- Role management and permissions
- User activity monitoring
- Account suspension and activation
- Bulk operations and exports

#### `AdminIdeasPage.jsx`
**Purpose**: Idea content moderation
**Features**:
- Review submitted ideas
- Approve or reject submissions
- Content quality assessment
- Spam and inappropriate content filtering
- AI analysis validation
- Batch processing tools

#### `AdminIdeathonsPage.jsx`
**Purpose**: Competition management system
**Features**:
- Create and manage ideathons
- Set competition parameters
- Manage registrations and submissions
- Configure judging criteria
- Prize distribution management
- Performance analytics

**Workflow**:
1. Create Competition → Set up ideathon parameters
2. Registration → Manage participant enrollment
3. Submissions → Monitor and moderate entries
4. Judging → Coordinate evaluation process
5. Results → Announce winners and distribute prizes
6. Analytics → Review competition performance

#### `AdminSustainabilityPage.jsx`
**Purpose**: Environmental impact monitoring
**Features**:
- Sustainability metrics dashboard
- Green innovation tracking
- Environmental impact assessment
- Carbon footprint analysis
- Sustainable development goals monitoring
- Reporting and compliance tools

#### `AdminFeedbackPage.jsx`
**Purpose**: Platform feedback management
**Features**:
- User feedback collection
- Bug reports and feature requests
- Satisfaction surveys and ratings
- Feedback categorization and prioritization
- Response and resolution tracking
- Trend analysis and insights

### 📊 Analytics & Reporting

#### `AnalyticsPage.jsx`
**Purpose**: Comprehensive analytics dashboard
**Features**:
- Real-time platform metrics
- User engagement analytics
- Idea submission trends
- Funding success rates
- Revenue and growth tracking
- Custom report generation

### 🔔 Notification System

#### `NotificationsPage.jsx`
**Purpose**: Centralized notification management
**Features**:
- Real-time notifications
- Notification categories and filtering
- Read/unread status management
- Notification preferences
- Push notification support
- Email notification integration

### ⚙️ Settings & Configuration

#### `SettingsPage.jsx`
**Purpose**: User preferences and account settings
**Features**:
- Profile information management
- Privacy and security settings
- Notification preferences
- API key management
- Account deletion and data export
- Two-factor authentication

### 🚫 Error Handling

#### Error Pages (`errors/`)
- `404Page.jsx` - Page not found
- `500Page.jsx` - Server error
- `UnauthorizedPage.jsx` - Access denied
- `MaintenancePage.jsx` - System maintenance
