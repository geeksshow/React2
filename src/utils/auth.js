// Authentication utility functions

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get current user data
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  }
  return null;
};

// Get user ID from stored user data or JWT token
export const getUserId = () => {
  const user = getCurrentUser();
  if (user && user.userId) {
    return user.userId;
  }
  
  // Fallback: try to get from JWT token
  const token = getAuthToken();
  if (token) {
    try {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeUser('user');
  // Trigger storage event for other components
  window.dispatchEvent(new Event('storage'));
  window.location.href = '/';
};

// Set auth headers for API calls
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Auto-login after registration
export const autoLoginAfterRegistration = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3001/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Auto-login error:', error);
    return { success: false, message: 'Network error during auto-login' };
  }
};

// Redirect to home page
export const redirectToHome = () => {
  window.location.href = '/';
};

// Redirect to login page
export const redirectToLogin = () => {
  window.location.href = '/login';
};

// Check if token is expired
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Validate authentication and refresh if needed
export const validateAuth = async () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  if (!token || !user) {
    return false;
  }
  
  if (isTokenExpired()) {
    logout();
    return false;
  }
  
  return true;
};