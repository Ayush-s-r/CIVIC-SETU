# Frontend Routes Documentation

## Public Routes

These routes are accessible to all users without authentication:

- `/` - Home page with quick services and login options
- `/about` - About page with platform information
- `/contact` - Contact page with contact form
- `/complaint` - Complaint submission form
- `/login` - User login page
- `/signup` - User registration page

## Admin Routes

These routes are for government officials and administrators:

- `/admin` - Admin dashboard with overview statistics
- `/admin/complaints` - Complaints management interface
- `/admin/analytics` - Analytics and reporting dashboard
- `/admin/users` - User management (placeholder)
- `/admin/departments` - Department management (placeholder)

## Citizen Routes

These routes are for registered citizens:

- `/citizen` - Citizen dashboard with personal statistics
- `/citizen/complaints` - Personal complaints tracking
- `/citizen/report` - Report new issues (same as `/complaint`)
- `/citizen/profile` - Profile management (placeholder)

## Layout Structure

### Public Layout

- Header
- Main content
- Footer

### Admin Layout

- Sidebar navigation
- Main content area

### Citizen Layout

- Sidebar navigation
- Main content area

## Navigation Features

### Sidebar Navigation

- Dynamic sidebar that changes based on user type (admin/citizen)
- Quick access to all relevant pages
- Back to home link

### Home Page Integration

- Direct links to citizen and admin dashboards
- Quick service cards for common issues
- Statistics and performance metrics

## Future Enhancements

1. **Authentication Guards**: Add route protection based on user authentication status
2. **Role-based Access**: Implement role-based access control for different admin levels
3. **Dynamic Routing**: Add dynamic routes for individual complaint details
4. **Search and Filtering**: Enhanced search and filtering capabilities
5. **Real-time Updates**: WebSocket integration for real-time status updates

## File Structure

```
src/
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Complaint.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── NotFound.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminComplaints.jsx
│   ├── AdminAnalytics.jsx
│   ├── CitizenDashboard.jsx
│   └── CitizenComplaints.jsx
├── components/
│   └── Common/
│       └── Sidebar.jsx
├── layouts/
│   ├── AdminLayouts.jsx
│   └── UserLayout.jsx
└── App.jsx
```
