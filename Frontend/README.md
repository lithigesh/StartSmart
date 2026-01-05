# StartSmart Frontend

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.16-blue.svg)](https://tailwindcss.com/)

## Overview

The StartSmart frontend is a modern React application built with Vite, featuring a responsive design with glassmorphism effects and role-based interfaces for entrepreneurs, investors, and administrators.

## Architecture

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
│   │   │   ├── IdeathonRegistrationForm.jsx  # Registration modal with toast notifications
│   │   │   ├── RegistrationSuccessScreen.jsx # Success confirmation screen
│   │   │   ├── MyRegisteredIdeathons.jsx     # Registered competitions with withdraw option
│   │   │   ├── NotificationsPopup.jsx        # Real-time notification popup
│   │   │   └── index.js             # Component exports
│   │   ├── investor/                # Investor-specific components
│   │   │   ├── IdeasSection.jsx     # Ideas browsing interface
│   │   │   ├── ErrorMessage.jsx     # Error display component
│   │   │   └── index.js             # Component exports
│   │   ├── admin/                   # Admin-specific components
│   │   │   ├── IdeathonRegistrationMaster.jsx  # Ideathon management (title changed from registration master)
│   │   │   └── AdminIdeathonDetailsPage.jsx    # Detailed view with contact info
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
│   │   │   ├── EntrepreneurLayout.jsx         # Dashboard layout wrapper
│   │   │   ├── OverviewPage.jsx               # Main entrepreneur dashboard
│   │   │   ├── MyIdeasPage.jsx                # Ideas management
│   │   │   ├── FundingPage.jsx                # Funding requests
│   │   │   ├── InvestorsPage.jsx              # Investor discovery
│   │   │   ├── IdeathonsPage.jsx              # Competition listing
│   │   │   ├── IdeathonDetailsPage.jsx        # Detailed ideathon view (NEW)
│   │   │   ├── NotificationsPage.jsx          # Notification center
│   │   │   └── FeedbackPage.jsx               # Feedback interface
│   │   ├── investor/                # Investor dashboard pages
│   │   │   ├── InvestorDashboard.jsx          # Main investor dashboard
│   │   │   └── InvestorDealsPage.jsx          # Deal pipeline
│   │   ├── admin/                   # Admin dashboard pages
│   │   │   ├── AdminDashboardPage.jsx         # Admin overview dashboard
│   │   │   ├── AdminIdeasPage.jsx             # Idea management interface
│   │   │   ├── AdminIdeathonsPage.jsx         # Competition management
│   │   │   ├── AdminIdeathonDetailsPage.jsx   # Registration details view
│   │   │   ├── AdminUsersPage.jsx             # User account management
│   │   │   └── AdminFeedbackPage.jsx          # Feedback collection
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

## Pages & Workflows

### Public Pages

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

### Entrepreneur Pages

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

- Browse available competitions with search and filters
- View details button for comprehensive ideathon information
- Register for ideathons with validation
- View registered ideathons with withdrawal option
- Track competition progress and status
- Real-time toast notifications for actions
- Responsive card-based layout

**Recent Updates**:

- Added "View Details" button above "Register Now"
- Navigation to dedicated `/entrepreneur/ideathon/:id` details page
- Fixed API endpoint from `/api/ideathon-registrations/my-registrations` to `/api/ideathons/my-registrations`
- Added toast notifications for successful registration
- Improved error handling for duplicate registrations

#### `IdeathonDetailsPage.jsx` (New)

**Purpose**: Comprehensive ideathon information display
**Features**:

- Full ideathon description and overview
- Submission format requirements display (badges)
- Eligibility criteria section
- Judging criteria breakdown
- Contact information for organizers
- Prize pool and participant count
- Location and date information
- Registration button with modal integration
- Registration status indicator
- Back navigation to ideathons list

**Workflow**:

1. User clicks "View Details" on ideathon card
2. Navigates to `/entrepreneur/ideathon/:id`
3. Views complete ideathon information
4. Can register directly from details page
5. Registration modal opens on same page
6. Success notification and status update on registration

### Investor Pages

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

### Admin Pages

#### `AdminDashboard.jsx` & `AdminDashboardLayout.jsx`

**Purpose**: Administrative control center
**Features**:

- Platform overview and statistics
- User management interface
- Content moderation tools
- System health monitoring
- Revenue and performance metrics
- Security and compliance monitoring

**Navigation Items**:

- Dashboard - Overview and analytics
- Manage Users - User account management
- Manage Ideas - Idea content moderation
- Ideathons - Competition management
- Ideas Feedback - Feedback collection

**Recent Updates**:

- Removed "Registration Master" page from admin navigation
- Streamlined sidebar menu for better UX
- Enhanced glassmorphism design with improved contrast
- Added real-time activity monitoring

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
- Set competition parameters (description, eligibility, judging criteria)
- Manage registrations and submissions
- Configure submission formats (Pitch Deck, Prototype, Business Document, etc.)
- View team registration details with contact information
- Prize distribution management
- Performance analytics
- Direct access to registration details without separate master page

**Workflow**:

1. Create Competition → Set up ideathon with all details
2. Configure Requirements → Set eligibility, judging criteria, submission formats
3. Registration → View and manage participant enrollment with contact details
4. Monitoring → Track submissions and progress
5. Evaluation → Coordinate judging process
6. Results → Announce winners and distribute prizes
7. Analytics → Review competition performance

**Recent Updates**:

- Integrated registration management directly in ideathon details
- Removed separate "Registration Master" page
- Enhanced contact detail display for registered teams
- Improved navigation and workflow efficiency

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

### Analytics & Reporting

#### `AnalyticsPage.jsx`

**Purpose**: Comprehensive analytics dashboard
**Features**:

- Real-time platform metrics
- User engagement analytics
- Idea submission trends
- Funding success rates
- Revenue and growth tracking
- Custom report generation

### Notification System

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

### Error Handling

#### Error Pages (`errors/`)

- `404Page.jsx` - Page not found
- `500Page.jsx` - Server error
- `UnauthorizedPage.jsx` - Access denied
- `MaintenancePage.jsx` - System maintenance
