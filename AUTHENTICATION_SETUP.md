# Cookie-Based Authentication Setup

This document explains how the cookie-based authentication is implemented between the frontend and backend.

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

### 2. Cookie Settings (`backend/src/controllers/auth.controller.js`)
Cookies are set with the following configuration for cross-domain compatibility:

```javascript
res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true, // prevent XSS attacks
  sameSite: "none", // allow cross-site cookies
  secure: true, // required for sameSite: "none"
  domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
});
```

### 3. Authentication Middleware (`backend/src/middleware/auth.middleware.js`)
The middleware extracts the JWT token from cookies and verifies it:

```javascript
const token = req.cookies.jwt;
const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
```

## Frontend Configuration

### 1. Axios Setup (`frontend/src/lib/axios.js`)
The frontend is configured to send cookies with requests:

```javascript
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
```

### 2. API Functions (`frontend/src/lib/api.js`)
The frontend uses the following API functions for authentication:

- `signup()` - Creates a new user account
- `login()` - Authenticates user and receives cookie
- `logout()` - Clears the authentication cookie
- `getAuthUser()` - Gets current user info using cookie

## How It Works

1. **Signup/Login**: When a user signs up or logs in, the backend creates a JWT token and sets it as an HTTP-only cookie
2. **Automatic Authentication**: On subsequent requests, the browser automatically sends the cookie to the backend
3. **Token Verification**: The backend middleware extracts the token from cookies and verifies it
4. **User Context**: If valid, the user information is attached to the request object

## Security Features

- **httpOnly**: Prevents JavaScript access to cookies (XSS protection)
- **sameSite: "none"**: Allows cross-site cookies (required for separate frontend/backend domains)
- **secure: true**: Ensures cookies are only sent over HTTPS
- **Domain restriction**: In production, cookies are restricted to the `.onrender.com` domain

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

1. **Cookies not being sent**: Ensure `withCredentials: true` is set in axios
2. **CORS errors**: Check that the frontend domain is included in the CORS origin
3. **Authentication failing**: Verify JWT_SECRET_KEY is set correctly
4. **Production issues**: Ensure HTTPS is used and domain settings are correct 