# JWT Authentication Guide

## Overview
This API uses JWT (JSON Web Tokens) for authentication. All routes except `/api/auth/*` require a valid JWT token.

## Environment Variables
Make sure you have these environment variables set in your `.env` file:
```
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
```

## Authentication Flow

### 1. Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "message": "Utilisateur enregistré avec succès.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Connexion réussie.",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Using protected routes
Include the JWT token in the Authorization header:
```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Protected Routes
All these routes require authentication:
- `/api/users/*` - User management
- `/api/vehicles/*` - Vehicle management  
- `/api/reservations/*` - Reservation management

## Public Routes
These routes don't require authentication:
- `/api/auth/register` - User registration
- `/api/auth/login` - User login

## Error Responses

### No token provided
```json
{
  "message": "Token d'accès requis",
  "error": "NO_TOKEN_PROVIDED"
}
```

### Invalid token
```json
{
  "message": "Token invalide",
  "error": "INVALID_TOKEN"
}
```

### Expired token
```json
{
  "message": "Token expiré",
  "error": "TOKEN_EXPIRED"
}
```

## Client Implementation Example

### JavaScript/Fetch
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Make authenticated request
const getUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### Axios
```javascript
// Set up axios with auth interceptor
axios.defaults.baseURL = '/api';

// Add token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

