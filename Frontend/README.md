# StartSmart Frontend

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.16-blue.svg)](https://tailwindcss.com/)

## 🎯 Overview

The StartSmart frontend is a modern React application built with Vite, featuring a responsive design with glassmorphism effects and role-based interfaces for entrepreneurs, investors, and administrators.

## 🏗️ Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── entrepreneur/    # Entrepreneur-specific components
│   ├── investor/        # Investor-specific components
│   └── admin/           # Admin-specific components
├── pages/               # Page components and routing
│   ├── entrepreneur/    # Entrepreneur dashboard pages
│   ├── investor/        # Investor dashboard pages
│   ├── admin/           # Admin dashboard pages
│   └── errors/          # Error pages
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── services/            # API service functions
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5001
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

## 🎨 Design System

### Theme & Styling
- **Primary Colors**: Black backgrounds with white text
- **Accent Colors**: Blue gradients for interactive elements
- **Glassmorphism**: Translucent panels with backdrop blur
- **Typography**: Manrope font family for clean readability
- **Animations**: Smooth transitions and hover effects

### Component Architecture
```jsx
// Example component structure
const DashboardCard = ({ icon, title, value, trend, onClick }) => {
  return (
    <div className="glassmorphism-card hover-effect">
      <div className="card-header">
        <Icon className="accent-color" />
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        <span className="primary-metric">{value}</span>
        <TrendIndicator trend={trend} />
      </div>
    </div>
  );
};
```

### Responsive Design
- **Mobile First**: Starting with mobile layouts
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid and Flexbox for layouts
- **Touch Friendly**: Large touch targets for mobile devices

## 🔄 State Management

### Context Providers
- `AuthContext`: User authentication and role management
- `NotificationContext`: Real-time notification system
- `ThemeContext`: Theme and preference management

### Custom Hooks
- `useNotifications`: Notification handling
- `useAuth`: Authentication utilities
- `useLocalStorage`: Persistent storage management
- `useFetch`: API request handling with caching

## 🌐 API Integration

### Service Layer (`services/api.js`)
```javascript
// API service structure
export const ideaAPI = {
  submitIdea: (data) => post('/api/ideas', data),
  getUserIdeas: (userId) => get(`/api/ideas/user/${userId}`),
  analyzeIdea: (ideaId) => post(`/api/ideas/${ideaId}/analysis`),
  markInterest: (ideaId) => post(`/api/ideas/${ideaId}/interest`)
};

export const fundingAPI = {
  createRequest: (data) => post('/api/funding', data),
  getRequests: () => get('/api/funding'),
  updateStatus: (id, status) => put(`/api/funding/${id}`, { status })
};
```

### Error Handling
- Global error boundary for React errors
- API error interception and user-friendly messages
- Retry mechanisms for failed requests
- Loading states and skeleton screens

## 🔒 Security Features

### Authentication
- JWT token storage and validation
- Automatic token refresh
- Role-based route protection
- Session timeout management

### Data Protection
- Input sanitization and validation
- XSS protection
- CSRF token implementation
- Secure file upload handling

## 📱 Performance Optimization

### Code Splitting
```javascript
const LazyDashboard = lazy(() => import('./pages/EntrepreneurDashboard'));
const LazyIdeasPage = lazy(() => import('./pages/IdeasPage'));
```

### Caching Strategy
- API response caching
- Image optimization and lazy loading
- Bundle optimization with Vite
- Service worker for offline functionality

### Monitoring
- Performance metrics tracking
- Error logging and reporting
- User experience analytics
- Core Web Vitals monitoring

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production Deployment
```bash
npm run build        # Create production build
vercel --prod        # Deploy to Vercel
```

### Environment Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
});
```

## 🧪 Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom utilities
- Service layer testing with mocked APIs
- Utility function testing

### Integration Testing
- User workflow testing
- API integration testing
- Cross-component interaction testing
- Authentication flow testing

### E2E Testing
- Critical user journey testing
- Cross-browser compatibility
- Mobile device testing
- Performance testing

## 📈 Future Enhancements

### Planned Features
- **Progressive Web App (PWA)**: Offline functionality and app-like experience
- **Real-time Chat**: Direct communication between entrepreneurs and investors
- **Video Conferencing**: Integrated video calls for pitch presentations
- **AI Chatbot**: Intelligent assistant for user guidance
- **Advanced Analytics**: Machine learning-powered insights
- **Mobile App**: Native iOS and Android applications

### Technical Improvements
- **Micro-frontends**: Modular architecture for better scalability
- **GraphQL**: More efficient data fetching
- **WebSockets**: Real-time updates and notifications
- **Edge Computing**: Improved performance with CDN integration
- **Accessibility**: Enhanced WCAG compliance and screen reader support

---

**StartSmart Frontend** - Crafting Exceptional User Experiences 🎨