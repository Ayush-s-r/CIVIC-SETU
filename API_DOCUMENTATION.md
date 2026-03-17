# Civic Setu API Documentation

## Overview
This document provides comprehensive documentation for the Civic Setu API endpoints. The API is built with Node.js, Express, and MongoDB.

**Base URL:** `http://localhost:8080/api`

## Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Authentication Routes (`/api/users`)

#### POST `/api/users/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  "token": "jwt_token"
}
```

#### POST `/api/users/login`
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  "token": "jwt_token"
}
```

#### GET `/api/users/profile`
Get current user profile (requires authentication).

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen"
}
```

### 2. Complaints Routes (`/api/complaints`)

#### POST `/api/complaints`
Create a new complaint.

**Request Body:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "road",
  "department": "pwd",
  "location": {
    "address": "Main Street, Sector 5",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "citizen": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210"
  }
}
```

**Response:**
```json
{
  "message": "Complaint submitted successfully",
  "complaint": {
    "id": "complaint_id",
    "trackingNumber": "CIV-2024-0001",
    "title": "Pothole on Main Street",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET `/api/complaints`
Get all complaints (Admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `department` (optional): Filter by department
- `search` (optional): Search in title, description, citizen name, or location

**Response:**
```json
{
  "complaints": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

#### GET `/api/complaints/:id`
Get specific complaint by ID.

**Response:**
```json
{
  "complaint": {
    "_id": "complaint_id",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "status": "pending",
    "priority": "medium",
    "trackingNumber": "CIV-2024-0001",
    "citizen": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210"
    },
    "location": {
      "address": "Main Street, Sector 5",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT `/api/complaints/:id`
Update complaint (Admin only).

**Request Body:**
```json
{
  "status": "in-progress",
  "priority": "high",
  "assignedTo": "user_id",
  "resolutionNotes": "Work started on this issue"
}
```

#### DELETE `/api/complaints/:id`
Delete complaint (Admin only).

#### GET `/api/complaints/stats/overview`
Get complaint statistics (Admin only).

**Response:**
```json
{
  "overview": {
    "totalComplaints": 1247,
    "resolvedComplaints": 892,
    "pendingComplaints": 156,
    "inProgressComplaints": 199,
    "resolutionRate": 71.5
  },
  "departmentStats": [...],
  "monthlyStats": [...]
}
```

### 3. Admin Routes (`/api/admin`)

#### GET `/api/admin/dashboard`
Get admin dashboard data.

**Response:**
```json
{
  "stats": {
    "totalComplaints": 1247,
    "resolvedComplaints": 892,
    "pendingComplaints": 156,
    "inProgressComplaints": 199,
    "totalUsers": 3421,
    "activeDepartments": 6,
    "resolutionRate": 71.5
  },
  "departmentStats": [...],
  "recentComplaints": [...],
  "priorityStats": [...]
}
```

#### GET `/api/admin/analytics`
Get detailed analytics data.

**Query Parameters:**
- `period` (optional): 1month, 3months, 6months, 1year (default: 6months)

**Response:**
```json
{
  "monthlyTrends": [...],
  "departmentPerformance": [...],
  "priorityDistribution": [...],
  "statusDistribution": [...],
  "period": "6months"
}
```

#### GET `/api/admin/users`
Get all users with pagination.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by role
- `search` (optional): Search in name or email

#### PUT `/api/admin/users/:id`
Update user role or status.

**Request Body:**
```json
{
  "role": "admin"
}
```

#### DELETE `/api/admin/users/:id`
Delete user.

#### GET `/api/admin/departments`
Get department statistics.

### 4. Citizen Routes (`/api/citizen`)

#### GET `/api/citizen/dashboard`
Get citizen dashboard data.

**Response:**
```json
{
  "stats": {
    "totalComplaints": 12,
    "resolvedComplaints": 8,
    "pendingComplaints": 2,
    "inProgressComplaints": 2
  },
  "recentComplaints": [...]
}
```

#### GET `/api/citizen/complaints`
Get citizen's complaints.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `search` (optional): Search in title, description, tracking number, or location

#### GET `/api/citizen/complaints/:id`
Get specific complaint by ID (citizen's own complaint).

#### POST `/api/citizen/complaints`
Create a new complaint (authenticated citizen).

#### GET `/api/citizen/profile`
Get citizen profile.

#### PUT `/api/citizen/profile`
Update citizen profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210"
}
```

#### GET `/api/citizen/stats`
Get citizen's complaint statistics.

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ["citizen", "worker", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (enum: ["road", "lighting", "water", "sanitation", "traffic", "other"]),
  department: String (enum: ["pwd", "electricity", "water", "sanitation", "traffic", "parks"]),
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  citizen: {
    name: String,
    email: String,
    phone: String
  },
  status: String (enum: ["pending", "in-progress", "resolved", "rejected"]),
  priority: String (enum: ["low", "medium", "high", "critical"]),
  attachments: [String],
  assignedTo: ObjectId (ref: User),
  trackingNumber: String (unique),
  resolutionNotes: String,
  resolutionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Frontend Integration

The frontend uses the API utility functions located in `frontend/src/utils/api.js`:

- `authAPI` - Authentication functions
- `complaintsAPI` - Complaint management
- `adminAPI` - Admin-specific functions
- `citizenAPI` - Citizen-specific functions

## Environment Variables

Required environment variables:

```env
MONGO_ATLAS_URL=mongodb://localhost:27017/civicsetu
JWT_SECRET_KEY=your_jwt_secret_key
PORT=8080
```

## Getting Started

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the server:
   ```bash
   npm run dev
   ```

4. The API will be available at `http://localhost:8080`

## Testing

You can test the API using tools like Postman or curl:

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test root endpoint
curl http://localhost:8080/
```
