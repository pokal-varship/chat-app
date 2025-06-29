# Token-Based Authentication Setup

This document explains how the token-based authentication is implemented between the frontend and backend.

## Backend Configuration

### 1. CORS Setup (`backend/src/server.js`)
The backend is configured to accept requests from the frontend domain and allow credentials:

```javascript
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://chat-app-79n0.onrender.com" 
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true, // allow frontend to send cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 2. Token Generation (`backend/src/controllers/auth.controller.js`)
JWT tokens are generated and included in the user object response:

```javascript
// In signup function
newUser.token = jwt.sign({ userId: newUser._id }, JWT_SECRET_KEY, {
  expiresIn: "7d",
});

// In login function
user.token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
  expiresIn: "7d",
});

res.status(200).json({ success: true, user });
```

### 3. Authentication Middleware (`backend/src/middleware/auth.middleware.js`)
The middleware extracts the JWT token from the Authorization header and verifies it:

```javascript
const token = req.headers.authorization?.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
```

## Frontend Configuration

### 1. Axios Setup (`frontend/src/lib/axios.js`)
The frontend is configured with interceptors to automatically include the Authorization header:

```javascript
// Request interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Token Management (`frontend/src/lib/utils.js`)
Utility functions for managing authentication tokens:

```javascript
export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

export const removeStoredToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};
```

### 3. Authentication Hooks
The frontend uses custom hooks for authentication operations:

- `useSignUp()` - Creates a new user account and stores the token
- `useLogin()` - Authenticates user and stores the token
- `useLogout()` - Clears the authentication token
- `useAuthUser()` - Gets current user info using stored token

## How It Works

1. **Signup/Login**: When a user signs up or logs in, the backend creates a JWT token and includes it in the user object response
2. **Token Storage**: The frontend stores the token in localStorage using the authentication hooks
3. **Automatic Authorization**: On subsequent requests, axios interceptors automatically include the token in the Authorization header
4. **Token Verification**: The backend middleware extracts the token from the Authorization header and verifies it
5. **User Context**: If valid, the user information is attached to the request object
6. **Token Expiration**: If a 401 response is received, the token is cleared and the user is redirected to login

## Security Features

- **JWT Tokens**: Secure, stateless authentication tokens
- **Authorization Header**: Tokens are sent via Authorization header (Bearer token)
- **Automatic Expiration**: Tokens expire after 7 days
- **Automatic Cleanup**: Expired tokens are automatically cleared
- **localStorage**: Tokens are stored securely in browser localStorage

## API Endpoints

### Public Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### Protected Endpoints (require Authorization header)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/onboarding` - Complete user onboarding
- `POST /api/auth/logout` - User logout
- All `/api/users/*` endpoints - User management
- All `/api/chat/*` endpoints - Chat functionality

## Testing

Use the `AuthTest` component to verify that authentication is working properly. The component will:
- Test if the user is authenticated
- Display user information if logged in
- Show authentication status

## Environment Variables

Make sure these environment variables are set in your backend:

```env
JWT_SECRET_KEY=your_secret_key_here
NODE_ENV=development # or production
```

## Troubleshooting

1. **Token not being sent**: Ensure the token is properly stored in localStorage
2. **CORS errors**: Check that the frontend domain is included in the CORS origin
3. **Authentication failing**: Verify JWT_SECRET_KEY is set correctly
4. **Token expiration**: Check if the token has expired (7 days by default)
5. **Authorization header missing**: Ensure axios interceptors are properly configured 