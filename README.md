# Civic Setu - Civic Complaint Management System

A comprehensive full-stack application for managing civic complaints with separate interfaces for citizens and administrators.

## 🚀 Quick Start

### Option 1: Using the Start Scripts (Recommended)

1. **Windows Batch File:**

   ```bash
   # Double-click start-servers.bat or run:
   start-servers.bat
   ```

2. **PowerShell Script:**
   ```powershell
   # Right-click and "Run with PowerShell" or run:
   .\start-servers.ps1
   ```

### Option 2: Manual Start

1. **Start Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080

## 📁 Project Structure

```
CIVIC-SETU/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── pages/          # React pages/components
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # API utilities
│   │   └── layouts/        # Layout components
│   └── package.json
└── start-servers.*         # Start scripts
```

## 🔧 Features

### For Citizens:

- **Dashboard:** Personal complaint statistics and recent complaints
- **Report Issues:** Comprehensive complaint submission form
- **Track Complaints:** View and track complaint status
- **Profile Management:** Update personal information

### For Administrators:

- **Admin Dashboard:** System-wide statistics and analytics
- **Complaint Management:** View, update, and manage all complaints
- **User Management:** Manage citizen accounts
- **Analytics:** Detailed reporting and performance metrics

## 🛠️ Technology Stack

### Backend:

- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend:

- React 18 with React Router
- Tailwind CSS for styling
- Axios for API calls
- React Icons

## 📋 API Endpoints

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Complaints

- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get all complaints (Admin)
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint (Admin)
- `DELETE /api/complaints/:id` - Delete complaint (Admin)

### Admin Routes

- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - User management
- `GET /api/admin/departments` - Department statistics

### Citizen Routes

- `GET /api/citizen/dashboard` - Citizen dashboard
- `GET /api/citizen/complaints` - Personal complaints
- `POST /api/citizen/complaints` - Create complaint
- `GET /api/citizen/profile` - Get profile
- `PUT /api/citizen/profile` - Update profile

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control:

- **Citizen:** Can view and manage their own complaints
- **Admin:** Full access to all system features
- **Worker:** Department-specific access (future feature)

## 📱 Navigation

### Connected "Report Issue" Buttons:

1. **Home Page:** Quick service cards → Report Issue
2. **Header Navigation:** Report Issue link
3. **Citizen Dashboard:** Report New Issue button
4. **Citizen Complaints:** Report New Issue button

All "Report Issue" buttons are connected to the `/complaint` route which renders the comprehensive complaint submission form.

## 🚀 Getting Started

1. **Prerequisites:**

   - Node.js (v14 or higher)
   - MongoDB (local or cloud)
   - npm or yarn

2. **Installation:**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the backend directory:

   ```env
   MONGO_ATLAS_URL=mongodb://localhost:27017/civicsetu
   JWT_SECRET_KEY=your_jwt_secret_key_here
   PORT=8080
   ```

4. **Start the Application:**
   Use the start scripts or manually start both servers as shown above.

## 📊 Database Schema

### Users Collection:

- User authentication and profile data
- Role-based access control
- Password hashing

### Complaints Collection:

- Complete complaint lifecycle management
- Citizen information
- Location data
- Status and priority tracking
- Department assignment
- Resolution tracking

## 🔧 Development

### Backend Development:

```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development:

```bash
cd frontend
npm run dev  # Starts Vite development server
```

## 📝 API Documentation

Complete API documentation is available at `http://localhost:8080` when the backend server is running.

## 🐛 Troubleshooting

### Common Issues:

1. **Port Already in Use:**

   - Backend: Change PORT in .env file
   - Frontend: Vite will automatically use next available port

2. **Database Connection Issues:**

   - Ensure MongoDB is running
   - Check MONGO_ATLAS_URL in .env file

3. **CORS Issues:**

   - Backend has CORS enabled for frontend communication

4. **Authentication Issues:**
   - Check JWT_SECRET_KEY in .env file
   - Ensure tokens are being sent in Authorization header

## 📞 Support

For issues or questions, please check the API documentation or review the code comments for detailed implementation details.

## 🎯 Next Steps

- File upload functionality for complaint attachments
- Real-time notifications with WebSocket
- Email notifications for status updates
- Mobile app development
- Advanced analytics and reporting
- Multi-language support

---

**Civic Setu** - Bridging the gap between citizens and government services! 🏛️

