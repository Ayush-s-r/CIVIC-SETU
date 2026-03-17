# Complete API Endpoints Documentation

## Base URL
```
http://localhost:8080/api
```

---

## Authentication
Most endpoints require JWT token in the header:
```
Authorization: Bearer <token>
```

---

## 1. Analytics Endpoints (`/api/analytics`)

### 1.1 GET /analytics/dashboard
**Description:** Get comprehensive dashboard analytics
**Access:** Private (Admin only)
**Method:** GET

**Response:**
```json
{
  "overview": {
    "totalComplaints": 150,
    "resolvedComplaints": 120,
    "pendingComplaints": 20,
    "inProgressComplaints": 10,
    "rejectedComplaints": 0,
    "resolutionRate": 80
  },
  "categoryStats": [
    {
      "_id": "road",
      "count": 80,
      "resolved": 70
    },
    {
      "_id": "lighting",
      "count": 40,
      "resolved": 35
    }
  ],
  "priorityStats": [
    {
      "_id": "high",
      "count": 30
    },
    {
      "_id": "medium",
      "count": 90
    }
  ],
  "resolutionTimeStats": {
    "avgTime": 5.5,
    "maxTime": 25.3,
    "minTime": 0.2
  }
}
```

### 1.2 GET /analytics/trends
**Description:** Get complaint trends over time
**Access:** Private (Admin only)
**Method:** GET
**Query Parameters:**
- `months` (optional, default: 12) - Number of months to analyze

**Response:**
```json
{
  "trends": [
    {
      "_id": {
        "year": 2025,
        "month": 10,
        "day": 15
      },
      "total": 5,
      "resolved": 3,
      "pending": 2,
      "inProgress": 0
    }
  ]
}
```

### 1.3 GET /analytics/department-performance
**Description:** Get performance metrics by department
**Access:** Private (Admin only)
**Method:** GET

**Response:**
```json
{
  "departmentStats": [
    {
      "_id": "pwd",
      "total": 80,
      "resolved": 70,
      "pending": 5,
      "inProgress": 5,
      "rejected": 0,
      "resolutionRate": 87.5,
      "avgResolutionTime": 4.2
    },
    {
      "_id": "electricity",
      "total": 40,
      "resolved": 35,
      "pending": 3,
      "inProgress": 2,
      "rejected": 0,
      "resolutionRate": 87.5,
      "avgResolutionTime": 3.8
    }
  ]
}
```

---

## 2. Search Endpoints (`/api/search`)

### 2.1 GET /search/complaints
**Description:** Search complaints with advanced filters
**Access:** Private (Admin only)
**Method:** GET

**Query Parameters:**
- `query` (optional) - Search text (searches title, description, tracking number, citizen name, email, address)
- `status` (optional) - Filter by status (pending, in-progress, resolved, rejected)
- `priority` (optional) - Filter by priority (low, medium, high, critical)
- `category` (optional) - Filter by category (road, lighting, water, sanitation, traffic, other)
- `department` (optional) - Filter by department (pwd, electricity, water, sanitation, traffic, parks)
- `startDate` (optional) - Filter from date (ISO format)
- `endDate` (optional) - Filter to date (ISO format)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Records per page
- `sortBy` (optional, default: createdAt) - Field to sort by
- `sortOrder` (optional, default: desc) - Sort order (asc or desc)

**Example Request:**
```
GET /search/complaints?query=pothole&status=pending&priority=high&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "complaints": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "trackingNumber": "CIV-2025-0001",
      "title": "Large pothole on Main Street",
      "description": "...",
      "status": "pending",
      "priority": "high",
      "category": "road",
      "department": "pwd",
      "location": {
        "address": "Main Street",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "citizen": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "createdAt": "2025-11-15T10:30:00Z"
    }
  ],
  "pagination": {
    "totalRecords": 45,
    "totalPages": 5,
    "currentPage": 1,
    "recordsPerPage": 10
  }
}
```

### 2.2 GET /search/by-location
**Description:** Search complaints by location (with radius)
**Access:** Private (Admin only)
**Method:** GET

**Query Parameters:**
- `latitude` (required) - Latitude coordinate
- `longitude` (required) - Longitude coordinate
- `radius` (optional, default: 5) - Search radius in kilometers

**Example Request:**
```
GET /search/by-location?latitude=40.7128&longitude=-74.0060&radius=5
```

**Response:**
```json
{
  "complaints": [...],
  "count": 12
}
```

### 2.3 GET /search/by-tracking-number/:trackingNumber
**Description:** Get complaint by tracking number
**Access:** Public
**Method:** GET

**Example Request:**
```
GET /search/by-tracking-number/CIV-2025-0001
```

**Response:**
```json
{
  "complaint": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingNumber": "CIV-2025-0001",
    "title": "Large pothole on Main Street",
    "description": "...",
    "status": "pending",
    "priority": "high",
    "category": "road",
    "department": "pwd",
    "location": {
      "address": "Main Street",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "citizen": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "createdAt": "2025-11-15T10:30:00Z"
  }
}
```

---

## 3. Report Endpoints (`/api/reports`)

### 3.1 GET /reports/summary
**Description:** Get summary report of all complaints
**Access:** Private (Admin only)
**Method:** GET

**Response:**
```json
{
  "summary": {
    "totalComplaints": 150,
    "statusBreakdown": [
      {
        "_id": "resolved",
        "count": 120,
        "percentage": 0.8
      },
      {
        "_id": "pending",
        "count": 20,
        "percentage": 0.133
      }
    ],
    "categoryBreakdown": [
      {
        "_id": "road",
        "count": 80
      },
      {
        "_id": "lighting",
        "count": 40
      }
    ],
    "generatedAt": "2025-11-20T10:30:00Z"
  }
}
```

### 3.2 GET /reports/detailed
**Description:** Get detailed report with all complaint details
**Access:** Private (Admin only)
**Method:** GET

**Query Parameters:**
- `format` (optional, default: json) - Response format (json or csv)
- `startDate` (optional) - Filter from date (ISO format)
- `endDate` (optional) - Filter to date (ISO format)

**Example Requests:**
```
GET /reports/detailed?format=json&startDate=2025-01-01&endDate=2025-11-30
GET /reports/detailed?format=csv
```

**Response (JSON):**
```json
{
  "reportType": "Detailed Complaints Report",
  "generatedAt": "2025-11-20T10:30:00Z",
  "totalRecords": 150,
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-11-30"
  },
  "complaints": [
    {
      "trackingNumber": "CIV-2025-0001",
      "title": "Large pothole on Main Street",
      "description": "...",
      "category": "road",
      "department": "pwd",
      "status": "resolved",
      "priority": "high",
      "location": {...},
      "citizen": {...},
      "assignedTo": {...},
      "createdAt": "2025-11-15T10:30:00Z",
      "resolutionDate": "2025-11-20T10:30:00Z",
      "resolutionNotes": "..."
    }
  ]
}
```

**Response (CSV):**
```
Tracking Number,Title,Category,Department,Status,Priority,Citizen Name,Citizen Email,Created Date,Resolution Date
CIV-2025-0001,Large pothole on Main Street,road,pwd,resolved,high,John Doe,john@example.com,11/15/2025,11/20/2025
...
```

### 3.3 GET /reports/citizen/:email
**Description:** Get report for a specific citizen
**Access:** Private (Citizen or Admin)
**Method:** GET

**Example Request:**
```
GET /reports/citizen/john@example.com
```

**Response:**
```json
{
  "email": "john@example.com",
  "stats": {
    "total": 5,
    "resolved": 4,
    "pending": 1,
    "inProgress": 0,
    "rejected": 0
  },
  "complaints": [...]
}
```

---

## Existing Endpoints (Already Available)

### User Routes (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get logged-in user profile

### Complaint Routes (`/api/complaints`)
- `POST /` - Create new complaint
- `GET /` - Get all complaints (with filtering)
- `GET /:id` - Get specific complaint
- `PUT /:id` - Update complaint
- `DELETE /:id` - Delete complaint
- `GET /citizen/:userId` - Get citizen complaints
- `GET /stats/overview` - Get complaint statistics

### Admin Routes (`/api/admin`)
- [Admin specific endpoints]

### Citizen Routes (`/api/citizen`)
- [Citizen specific endpoints]

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Description of the error"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error while processing request"
}
```

---

## Usage Examples

### Frontend Example (React)

```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage (after login)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Search complaints
export const searchComplaints = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `${API_BASE_URL}/search/complaints?${params}`,
    { headers: getHeaders() }
  );
  return response.json();
};

// Get analytics dashboard
export const getDashboardAnalytics = async () => {
  const response = await fetch(
    `${API_BASE_URL}/analytics/dashboard`,
    { headers: getHeaders() }
  );
  return response.json();
};

// Get detailed report
export const getDetailedReport = async (startDate, endDate, format = 'json') => {
  const response = await fetch(
    `${API_BASE_URL}/reports/detailed?startDate=${startDate}&endDate=${endDate}&format=${format}`,
    { headers: getHeaders() }
  );
  return response.json();
};

// Get complaint by tracking number
export const getComplaintByTracking = async (trackingNumber) => {
  const response = await fetch(
    `${API_BASE_URL}/search/by-tracking-number/${trackingNumber}`
  );
  return response.json();
};
```

### React Component Example

```jsx
// components/AdminAnalytics.jsx
import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../utils/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="analytics">
      <h1>Dashboard</h1>
      <div className="overview">
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <p>{analytics.overview.totalComplaints}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p>{analytics.overview.resolvedComplaints}</p>
        </div>
        <div className="stat-card">
          <h3>Resolution Rate</h3>
          <p>{analytics.overview.resolutionRate}%</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Pagination starts from page 1
- Date formats should be ISO 8601 (YYYY-MM-DD)
- Most admin endpoints require authentication and admin role
- Public endpoints can be accessed without authentication
