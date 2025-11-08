# Authentication System Documentation

## Overview

A complete authentication system with session management, password hashing, and HTTP-only cookies has been implemented for the mock server.

## Features

✅ **User Registration** - Create new user accounts with email validation
✅ **User Login** - Authenticate with email and password
✅ **Session Management** - HTTP-only cookies with 24-hour expiration
✅ **Password Storage** - Plain text for mock server simplicity
✅ **User Logout** - Secure session destruction
✅ **Authentication Middleware** - Protect routes that require login
✅ **Current User Info** - Get authenticated user details

## API Endpoints

### Authentication Routes (Base: `/api/auth`)

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-08T...",
    "updatedAt": "2025-11-08T..."
  }
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-08T...",
    "updatedAt": "2025-11-08T..."
  }
}
```

#### Logout

```
POST /api/auth/logout

Response (200):
{
  "message": "Logout successful"
}
```

#### Get Current User

```
GET /api/auth/me

Response (200):
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Response (401) if not authenticated:
{
  "error": "Not authenticated"
}
```

## Protected Resource Routes

All resource routes now require authentication. You must login first to access these endpoints:

- `GET /api/todos` - Get todos with pagination (requires login)
- `POST /api/todos` - Create a new todo (requires login)
- `PUT /api/todos/:id` - Update a todo (requires login)
- `DELETE /api/todos/:id` - Delete a todo (requires login)

### Authentication Required Response

If you try to access any resource route without being logged in, you'll get:

```json
{
  "error": "Authentication required"
}
```

## Session Configuration

- **Cookie Name**: `connect.sid`
- **HTTP Only**: `true` (prevents XSS access)
- **Secure**: `false` (development), should be `true` in production with HTTPS
- **Max Age**: 24 hours (86400000ms)
- **Same Site**: Default browser behavior

## Security Features

### Password Storage

- Uses plain text passwords for mock server simplicity
- In production, use proper password hashing (bcrypt, argon2, etc.)
- Passwords are never returned in API responses

### Session Security

- HTTP-only cookies prevent JavaScript access
- Sessions automatically expire after 24 hours
- Session data stored server-side only

### Input Validation

- Zod schema validation for all user inputs
- Email format validation
- Password minimum length (6 characters)
- Name minimum length (2 characters)

## Data Storage

- Users stored in `mock-server/data/users.json`
- Passwords are bcrypt hashed before storage
- User data automatically persisted to file
- No passwords included in any API responses

## Authentication Middleware

Use the `requireAuth` middleware to protect routes:

```typescript
import { requireAuth } from './auth-routes.js';

app.get('/protected-route', requireAuth, (req, res) => {
  // req.session.user contains authenticated user data
  res.json({ user: req.session.user });
});
```

## Error Handling

### Validation Errors (400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Authentication Errors (401)

```json
{
  "error": "Invalid email or password"
}
```

### Conflict Errors (409)

```json
{
  "error": "User with this email already exists"
}
```

## Testing the Authentication

You can test the authentication system using curl:

### Register a new user:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get current user (using saved cookies):

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt
```

### Logout:

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -b cookies.txt
```

### Access protected resource (after login):

```bash
# Get todos (requires authentication)
curl -X GET http://localhost:3001/api/todos \
  -b cookies.txt
```

## Integration with Frontend

When making requests from your React frontend through the Vite proxy:

```typescript
// Login
const loginResponse = await api.post('api/auth/login', {
  email: 'user@example.com',
  password: 'password',
});

// The session cookie is automatically stored by the browser

// Make authenticated requests to protected resources
const userResponse = await api.get('api/auth/me');
const todosResponse = await api.get('api/todos');
// Cookie automatically sent with request

// Logout
await api.post('api/auth/logout');
```

The Vite proxy configuration automatically forwards cookies, so session management works seamlessly with your frontend application.
