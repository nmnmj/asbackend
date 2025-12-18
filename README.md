Collaborative Task Manager – Backend

A production-ready backend for a collaborative task management application with authentication, role-aware task management, real-time collaboration, and persistent notifications.

1. Tech Stack
Runtime: Node.js
Framework: Express.js (TypeScript)
Database: MongoDB (MongoDB Atlas)
ODM: Mongoose
Authentication: JWT (HttpOnly cookies)
Real-Time: Socket.io
Validation: Zod
Testing: Jest

2. Setup Instructions (Run Backend Locally)
2.1 Prerequisites
Node.js ≥ 18
MongoDB Atlas account (or local MongoDB)
npm
2.2 Clone the Repository
git clone <repository-url>
cd backend
2.3 Install Dependencies
npm install
2.4 Environment Variables
Create a .env file in the project root:
PORT=4000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
NODE_ENV=development
2.5 Run the Server
npm run dev
The backend will start at:
http://localhost:4000
2.6 Run Unit Tests
npm test

3. API Contract Documentation
3.1 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user (sets JWT cookie)
POST	/api/auth/logout	Logout user
3.2 User Profile
Method	Endpoint	Description
GET	/api/users/me	Get current user profile
GET	/api/users/all	Get all  users partial details
PUT	/api/users/me	Update user profile
3.3 Tasks (CRUD)
Method	Endpoint	Description
POST	/api/tasks	Create a task
GET	/api/tasks	Get tasks created by or assigned to user
PUT	/api/tasks/:id	Update task (status, priority, assignee, etc.)
DELETE	/api/tasks/:id	Delete task (creator only)

Task Attributes
title: string (max 100 chars)
description?: string
dueDate: ISO string
priority: Low | Medium | High | Urgent
status: To Do | In Progress | Review | Completed
creatorId: User ID (derived from JWT)
assignedToId: User ID

3.4 Notifications
Method	Endpoint	Description
GET	/api/notifications	Fetch user notifications
PATCH	/api/notifications/:id/read	Mark notification as read

4. Architecture Overview & Design Decisions
4.1 Why MongoDB?
MongoDB was chosen because:
Flexible schema for evolving task & notification models
Native TTL indexes (used for auto-expiring notifications)
Excellent support with Mongoose + TypeScript
Well-suited for real-time, document-centric workloads

4.2 Backend Architecture
The backend follows a layered architecture:

Routes → Controllers → Services → Repositories → Database

Responsibilities
Routes: HTTP wiring & middleware
Controllers: Request/response handling
Services: Business logic & authorization
Repositories: Database access only
Models: Domain definitions (Mongoose schemas)

This separation improves:
Testability
Maintainability
Scalability

4.3 Authentication & Session Management
JWT is used for authentication
Token is stored in HttpOnly cookies
User identity is derived from JWT, never from client input
authMiddleware protects all secured routes

This prevents:
Token theft via XSS
User impersonation
Privilege escalation

5. Real-Time Collaboration with Socket.io
5.1 Socket Integration
Socket.io is initialized alongside the HTTP server
Each user joins a private room using their user ID:
5.2 Real-Time Events
Event	                   Description
task:created        Broadcast when task created
task:updated	    Broadcast when task status / priority / assignee changes
task:deleted        Broadcast when task deleted
notification:new	Sent to a specific user on task assignment
5.3 How Real-Time Works
Task update via REST API
Service layer updates database
Socket.io emits event
Connected clients receive updates instantly
This ensures eventual consistency between REST and real-time layers.

6. Persistent Notifications (with Auto-Expiry)
Notifications are stored in MongoDB
TTL index automatically deletes notifications after 24 hours
Users can fetch notifications even if they were offline
Socket.io delivers notifications instantly when online
No cron jobs or background workers are required.

7. Testing Strategy
Jest is used for unit testing
Focus on TaskService, the most critical business layer
Database and Socket.io are mocked
Tests cover:
Task creation
Real-time updates
Assignment notifications
