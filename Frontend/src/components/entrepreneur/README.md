# Entrepreneur Dashboard Components

This directory contains all the components for the Entrepreneur Dashboard, split into smaller, reusable components for better maintainability and code organization.

## Component Structure

### Main Components

1. **DashboardHeader** (`DashboardHeader.jsx`)
   - User welcome message and navigation
   - Logout functionality
   - Settings button

2. **WelcomeSection** (`WelcomeSection.jsx`)
   - Welcome message and call-to-action buttons
   - Submit New Idea and View Analytics buttons

3. **DashboardCardsGrid** (`DashboardCardsGrid.jsx`)
   - Grid layout for dashboard statistics cards
   - Uses DashboardCard component for individual cards

4. **MyIdeasSection** (`MyIdeasSection.jsx`)
   - Lists all user's submitted ideas
   - Uses IdeaCard component for individual idea display

5. **RecentActivitySection** (`RecentActivitySection.jsx`)
   - Shows recent activities and notifications
   - Uses ActivityItem component for individual activities

### Sub-components

6. **DashboardCard** (`DashboardCard.jsx`)
   - Individual card component for statistics
   - Reusable for different metrics (ideas, funding, etc.)

7. **IdeaCard** (`IdeaCard.jsx`)
   - Individual idea display component
   - Shows idea status, funding, and investor count

8. **ActivityItem** (`ActivityItem.jsx`)
   - Individual activity/notification item
   - Displays message, time, and icon

## Usage

Import and use in the main EntrepreneurDashboard:

```jsx
import {
  DashboardHeader,
  WelcomeSection,
  DashboardCardsGrid,
  MyIdeasSection,
  RecentActivitySection
} from '../components/entrepreneur';
```

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused across different pages
3. **Testing**: Easier to unit test individual components
4. **Performance**: Better code splitting and loading optimization
5. **Development**: Multiple developers can work on different components simultaneously
6. **Readability**: Main dashboard file is much cleaner and easier to understand

## Future Enhancements

- Add PropTypes for type checking
- Implement React.memo for performance optimization
- Add custom hooks for data fetching
- Create shared utility functions for common operations
- Add loading and error states for individual components
