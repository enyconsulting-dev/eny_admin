# API Endpoints Reference

## 📚 Overview

This document provides a comprehensive reference for all API endpoints used by the Eny Consulting Admin Dashboard. All endpoints return JSON responses and require authentication unless otherwise stated.

## 🔐 Authentication

### Base URL

```
Production: [Configure in .env.production as VITE_API_URL]
Development: [Configure in .env.development as VITE_API_URL]
```

### Authentication Methods

#### 1. Admin Session (Cookie-based)

- Login creates session cookie
- Cookie sent automatically with requests
- Used for admin dashboard

#### 2. API Key (Header-based)

- For external API access
- Header: `X-API-Key: ency-{key}`
- Requires valid, active API key

### Standard Headers

```
Content-Type: application/json
X-API-Key: ency-{key}  // If using API key auth
```

---

## 📋 Response Format

### Success Response

```typescript
{
  code: number; // HTTP status code
  message: string; // Success message
  data: any; // Response data
}
```

### Error Response

```typescript
{
  code: number;        // HTTP status code
  message: string;     // Error message
  errors?: {          // Validation errors (optional)
    field: string;
    message: string;
  }[];
}
```

### Paginated Response

```typescript
{
  code: 200,
  message: "Resources retrieved successfully",
  data: {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }
}
```

---

## 🔑 Authentication Endpoints

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "session_token"
  }
}
```

### Logout

```http
POST /auth/logout
```

**Response:**

```json
{
  "code": 200,
  "message": "Logout successful"
}
```

### Set Password

```http
POST /auth/set-password
```

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "newPassword123"
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Password set successfully"
}
```

---

## 👥 Admin Users Endpoints

### List Admins

```http
GET /admins
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional)
- `role` (string, optional)
- `status` (string, optional)

**Response:** Paginated list of admins

### Get Admin Detail

```http
GET /admins/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "admin_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z"
  }
}
```

### Create Admin

```http
POST /admins
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin",
  "phone": "+1234567890",
  "department": "Operations"
}
```

### Update Admin

```http
PATCH /admins/:id
```

**Request Body:** Partial admin object

### Delete Admin

```http
DELETE /admins/:id
```

### Reset Password

```http
POST /admins/:id/reset-password
```

### Activate/Deactivate Admin

```http
PATCH /admins/:id/activate
PATCH /admins/:id/deactivate
```

### Admin Activity Log

```http
GET /admins/:id/activity
```

**Query Parameters:**

- `startDate` (ISO date string)
- `endDate` (ISO date string)
- `actionType` (string)

---

## 🔐 API Keys Endpoints

### List API Keys

```http
GET /api-keys
```

**Query Parameters:**

- `page` (number)
- `limit` (number)
- `search` (string)

**Response:** Paginated list with masked keys

### Get API Key Detail

```http
GET /api-keys/:id
```

**Note:** Full key is never returned after creation

### Create API Key

```http
POST /api-keys
```

**Request Body:**

```json
{
  "name": "Mobile App Key",
  "description": "API key for mobile application",
  "expiresAt": "2025-12-31T23:59:59Z",
  "rateLimit": 10000,
  "permissions": ["assessment:read", "question:read", "attempt:create"],
  "allowedOrigins": ["https://app.example.com"]
}
```

**Response:**

```json
{
  "code": 201,
  "message": "API key created successfully",
  "data": {
    "id": "key_id",
    "key": "ency-abc123def456...", // ONLY shown once
    "name": "Mobile App Key",
    "...": "..."
  }
}
```

### Update API Key

```http
PATCH /api-keys/:id
```

**Request Body:** Partial API key object (excluding `key` field)

### Delete API Key

```http
DELETE /api-keys/:id
```

### Activate/Deactivate API Key

```http
PATCH /api-keys/:id/activate
PATCH /api-keys/:id/deactivate
```

### Get API Key Statistics

```http
GET /api-keys/:id/stats
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "totalRequests": 15420,
    "lastUsedAt": "2024-01-15T14:30:00Z",
    "requestsToday": 342,
    "requestsThisWeek": 2150,
    "requestsThisMonth": 8930
  }
}
```

---

## 📝 Assessment Endpoints

### List Assessments

```http
GET /assessments
```

**Query Parameters:**

- `page`, `limit`
- `status` (draft, published, closed)
- `search`

### Get Assessment Detail

```http
GET /assessments/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "assessment_id",
    "title": "JavaScript Assessment",
    "description": "Test JavaScript fundamentals",
    "duration": 60,
    "passScore": 70,
    "status": "published",
    "questions": [...],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Create Assessment

```http
POST /assessments
```

**Request Body:**

```json
{
  "title": "New Assessment",
  "description": "Assessment description",
  "duration": 60,
  "passScore": 70,
  "questions": [
    {
      "text": "What is JavaScript?",
      "type": "multipleChoice",
      "points": 10,
      "options": [
        { "text": "A programming language", "isCorrect": true },
        { "text": "A coffee type", "isCorrect": false }
      ]
    }
  ]
}
```

### Update Assessment

```http
PATCH /assessments/:id
```

### Delete Assessment

```http
DELETE /assessments/:id
```

### Publish Assessment

```http
POST /assessments/:id/publish
```

### Get Assessment Statistics

```http
GET /assessments/:id/stats
```

---

## 👨‍🎓 Assessment Users Endpoints

### List Assessment Users

```http
GET /assessment-users
```

### Invite Users to Assessment

```http
POST /assessment-users/invite
```

**Request Body:**

```json
{
  "assessmentId": "assessment_id",
  "emails": ["user1@example.com", "user2@example.com"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

---

## 📊 Assessment Attempts Endpoints

### List Attempts

```http
GET /assessment-attempts
```

**Query Parameters:**

- `assessmentId` (filter by assessment)
- `userId` (filter by user)
- `status` (in_progress, completed, abandoned)
- `page`, `limit`

### Get Attempt Detail

```http
GET /assessment-attempts/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "attempt_id",
    "assessmentId": "assessment_id",
    "userId": "user_id",
    "status": "completed",
    "startedAt": "2024-01-15T10:00:00Z",
    "completedAt": "2024-01-15T11:30:00Z",
    "score": 85,
    "answers": [...],
    "flags": []
  }
}
```

### Create Attempt (Start Assessment)

```http
POST /assessment-attempts
```

**Request Body:**

```json
{
  "assessmentId": "assessment_id",
  "userId": "user_id"
}
```

### Submit Attempt

```http
PATCH /assessment-attempts/:id
```

**Request Body:**

```json
{
  "status": "completed",
  "answers": [
    {
      "questionId": "q1",
      "answer": "option1",
      "timeSpent": 45
    }
  ]
}
```

---

## 💼 Job Platform Endpoints

### Get Platform Statistics

```http
GET /job-platform/stats
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "totalUsers": 1250,
    "totalJobSeekers": 980,
    "totalEmployers": 270,
    "totalJobPostings": 450,
    "totalApplications": 3200
  }
}
```

### Get Job User Statistics

```http
GET /job-user-statistics
```

### Get Job Posting Statistics

```http
GET /job-posting-statistics
```

---

## 👤 Job Users Endpoints

### List Job Users

```http
GET /job-users
```

**Query Parameters:**

- `page`, `limit`
- `accountType` (jobseeker, employer)
- `status` (active, inactive, suspended)
- `search`

### Get Job User Detail

```http
GET /job-users/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "accountType": "jobseeker",
    "profile": {
      "fullName": "John Doe",
      "phone": "+1234567890",
      "location": "New York, USA",
      "...": "..."
    },
    "status": "active",
    "subscriptionId": "sub_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Job User

```http
PATCH /job-users/:id
```

### Send Push Notification to User

```http
POST /job-users/:id/notification
```

**Request Body:**

```json
{
  "title": "New Job Match",
  "message": "We found 3 new jobs matching your profile!",
  "type": "job_match"
}
```

### Get User Subscription History

```http
GET /job-users/:id/subscriptions
```

**Response:**

```json
{
  "code": 200,
  "data": [
    {
      "id": "sub_history_id",
      "planName": "Premium Plan",
      "status": "active",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "amount": 99.99
    }
  ]
}
```

---

## 💼 Job Postings Endpoints

### List Job Postings

```http
GET /job-postings
```

**Query Parameters:**

- `page`, `limit`
- `status` (draft, published, closed, expired)
- `jobType` (fulltime, parttime, contract, internship)
- `location`
- `search`

### Get Job Posting Detail

```http
GET /job-postings/:id
```

### Create Job Posting

```http
POST /job-postings
```

**Request Body:**

```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "location": "San Francisco, CA",
  "jobType": "fulltime",
  "salaryMin": 120000,
  "salaryMax": 180000,
  "requirements": ["5+ years experience", "..."],
  "deadline": "2024-03-31T23:59:59Z"
}
```

### Update Job Posting

```http
PATCH /job-postings/:id
```

### Delete Job Posting

```http
DELETE /job-postings/:id
```

### Publish Job Posting

```http
POST /job-postings/:id/publish
```

### Close Job Posting

```http
POST /job-postings/:id/close
```

---

## 📄 Job Applications Endpoints

### List Applications

```http
GET /job-applications
```

**Query Parameters:**

- `page`, `limit`
- `status` (pending, reviewed, shortlisted, rejected)
- `jobPostingId`
- `applicantId`

### Get Application Detail

```http
GET /job-applications/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "app_id",
    "jobPostingId": "job_id",
    "applicantId": "user_id",
    "status": "pending",
    "appliedAt": "2024-01-15T10:00:00Z",
    "resumeUrl": "https://...",
    "coverLetter": "Dear hiring manager..."
  }
}
```

### Submit Application

```http
POST /job-applications
```

**Request Body:**

```json
{
  "jobPostingId": "job_id",
  "applicantId": "user_id",
  "resumeUrl": "https://resume-url",
  "coverLetter": "Cover letter text"
}
```

### Update Application Status

```http
PATCH /job-applications/:id
```

**Request Body:**

```json
{
  "status": "shortlisted",
  "notes": "Great candidate"
}
```

---

## 💳 Subscription Plans Endpoints

### List Subscription Plans

```http
GET /subscriptions
```

**Query Parameters:**

- `page`, `limit`
- `accountType` (jobseeker, employer)
- `isActive` (true, false)

### Get Subscription Plan Detail

```http
GET /subscriptions/:id
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "id": "plan_id",
    "name": "Premium Plan",
    "description": "Full access to all features",
    "price": 99.99,
    "interval": "monthly",
    "accountType": "jobseeker",
    "features": ["feature1", "feature2"],
    "limits": {
      "jobApplications": 50,
      "savedJobs": 100
    },
    "isActive": true,
    "isCustom": false,
    "isFree": false
  }
}
```

### Create Subscription Plan

```http
POST /subscriptions
```

**Request Body:**

```json
{
  "name": "New Plan",
  "description": "Plan description",
  "price": 49.99,
  "interval": "monthly",
  "accountType": "jobseeker",
  "features": ["feature1"],
  "limits": {
    "jobApplications": 25
  },
  "isActive": true,
  "isCustom": false,
  "isFree": false
}
```

### Update Subscription Plan

```http
PATCH /subscriptions/:id
```

### Delete Subscription Plan

```http
DELETE /subscriptions/:id
```

---

## 📊 User Subscriptions Endpoints

### List User Subscriptions

```http
GET /user-subscriptions
```

**Query Parameters:**

- `page`, `limit`
- `status` (active, expired, cancelled)
- `accountType`
- `planId`

### Get User Subscription Detail

```http
GET /user-subscriptions/:id
```

### Create User Subscription

```http
POST /user-subscriptions
```

**Request Body:**

```json
{
  "userId": "user_id",
  "planId": "plan_id",
  "startDate": "2024-01-01",
  "autoRenew": true
}
```

### Update User Subscription

```http
PATCH /user-subscriptions/:id
```

### Cancel User Subscription

```http
POST /user-subscriptions/:id/cancel
```

**Request Body:**

```json
{
  "reason": "Switching to different plan",
  "immediate": false // If true, cancels immediately; if false, at period end
}
```

---

## 📅 Events Endpoints

### List Events

```http
GET /events
```

**Query Parameters:**

- `page`, `limit`
- `status` (draft, published, ongoing, completed, cancelled)
- `startDate`, `endDate`

### Get Event Detail

```http
GET /events/:id
```

### Create Event

```http
POST /events
```

**Request Body:**

```json
{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "startDate": "2024-06-15T09:00:00Z",
  "endDate": "2024-06-17T18:00:00Z",
  "type": "conference",
  "format": "hybrid",
  "locations": [
    {
      "name": "Main Venue",
      "address": "123 Conference St",
      "city": "San Francisco",
      "country": "USA",
      "capacity": 500
    }
  ],
  "virtualDetails": {
    "platform": "Zoom",
    "meetingLink": "https://zoom.us/j/..."
  }
}
```

### Update Event

```http
PATCH /events/:id
```

### Delete Event

```http
DELETE /events/:id
```

### Publish Event

```http
POST /events/:id/publish
```

### Cancel Event

```http
POST /events/:id/cancel
```

---

## 📍 Event Locations & Attendees

### Get Location Attendees

```http
GET /events/:eventId/locations/:locationId/users
```

### Register Attendee

```http
POST /events/:eventId/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "locationId": "location_id",
  "additionalInfo": {}
}
```

### Update Attendee

```http
PATCH /attendees/:id
```

### Check In Attendee

```http
POST /attendees/:id/checkin
```

**Response:**

```json
{
  "code": 200,
  "message": "Attendee checked in successfully",
  "data": {
    "id": "attendee_id",
    "status": "checked-in",
    "checkInTime": "2024-01-15T09:30:00Z"
  }
}
```

### Bulk Check In

```http
POST /attendees/bulk-checkin
```

**Request Body:**

```json
{
  "attendeeIds": ["id1", "id2", "id3"]
}
```

---

## ⚙️ Settings Endpoints

### Get Settings

```http
GET /settings
```

### Update Settings

```http
PATCH /settings
```

**Request Body:**

```json
{
  "siteName": "Eny Consulting",
  "supportEmail": "support@example.com",
  "emailNotifications": true,
  "...": "..."
}
```

---

## 📊 Analytics Endpoints

### Get Dashboard Analytics

```http
GET /analytics/dashboard
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "assessments": {
      "total": 50,
      "published": 35,
      "draft": 15
    },
    "attempts": {
      "total": 1250,
      "completed": 980,
      "inProgress": 270
    },
    "users": {
      "total": 2500,
      "active": 1800
    }
  }
}
```

---

## 🚨 Error Codes

### HTTP Status Codes

| Code | Meaning               | Description                         |
| ---- | --------------------- | ----------------------------------- |
| 200  | OK                    | Request successful                  |
| 201  | Created               | Resource created successfully       |
| 204  | No Content            | Success with no response body       |
| 400  | Bad Request           | Invalid request data                |
| 401  | Unauthorized          | Authentication required             |
| 403  | Forbidden             | Insufficient permissions            |
| 404  | Not Found             | Resource not found                  |
| 409  | Conflict              | Resource conflict (e.g., duplicate) |
| 422  | Unprocessable Entity  | Validation errors                   |
| 429  | Too Many Requests     | Rate limit exceeded                 |
| 500  | Internal Server Error | Server error                        |
| 503  | Service Unavailable   | Service temporarily unavailable     |

### Error Response Examples

**Validation Error (422):**

```json
{
  "code": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Authentication Error (401):**

```json
{
  "code": 401,
  "message": "Authentication required. Please log in."
}
```

**Rate Limit Error (429):**

```json
{
  "code": 429,
  "message": "Rate limit exceeded. Try again in 3600 seconds.",
  "retryAfter": 3600
}
```

---

## 🔧 Rate Limiting

### Default Limits

- **Anonymous**: 100 requests per hour
- **Authenticated**: 1000 requests per hour
- **API Key**: Configurable per key (default: 5000/hour)

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1610000000
```

---

## 📚 Pagination

### Query Parameters

- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

### Response

```json
{
  "results": [...],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 47
}
```

---

## 🔍 Filtering & Sorting

### Common Query Parameters

**Filtering:**

- `search` - Search across multiple fields
- `status` - Filter by status
- `type` - Filter by type
- `startDate`, `endDate` - Date range filter

**Sorting:**

- `sortBy` - Field to sort by
- `sortOrder` - `asc` or `desc`

**Example:**

```
GET /assessments?status=published&sortBy=createdAt&sortOrder=desc&page=1&limit=20
```

---

## 📝 Best Practices

### API Usage

1. **Use Pagination**: Always paginate large result sets
2. **Handle Errors**: Implement proper error handling
3. **Rate Limiting**: Respect rate limits
4. **Caching**: Cache responses when appropriate
5. **Idempotency**: Use idempotency keys for critical operations
6. **versioning**: Follow API versioning if implemented

### Security

1. **HTTPS Only**: Never use HTTP in production
2. **Validate Input**: Always validate user input
3. **Sanitize Output**: Prevent XSS attacks
4. **API Keys**: Keep API keys secure
5. **CORS**: Configure CORS properly
6. **Authentication**: Always authenticate sensitive endpoints

---

## 🛠️ Testing

### Tools

- **Postman**: API testing and documentation
- **curl**: Command-line testing
- **HTTPie**: User-friendly curl alternative

### Example curl Request

```bash
curl -X GET \
  'https://api.example.com/assessments?page=1&limit=10' \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: ency-your-api-key'
```

---

## 📚 Related Documentation

- [Authentication Guide](./AUTHENTICATION.md)
- [API Keys Management](./API_KEYS.md)
- [Error Handling](./ERROR_HANDLING.md)
- [Security Best Practices](./SECURITY.md)
