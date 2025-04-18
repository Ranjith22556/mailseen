/**
 * Token helper utilities for handling OAuth refresh tokens
 * Based on Google OAuth 2.0 guidelines at https://developers.google.com/identity/protocols/oauth2
 */

/**
 * Checks if a token is about to expire
 * @param {number} expiresAt - Timestamp when token expires
 * @param {number} thresholdMinutes - Minutes before expiry to consider the token as "about to expire"
 * @returns {boolean} True if token is about to expire
 */
export const isTokenExpiringSoon = (expiresAt, thresholdMinutes = 5) => {
  if (!expiresAt) return false;
  
  const expiryTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();
  const thresholdMs = thresholdMinutes * 60 * 1000;
  
  return expiryTime - currentTime < thresholdMs && expiryTime > currentTime;
};

/**
 * Get the session from localStorage
 * @returns {Object|null} The session object or null
 */
export const getStoredSession = () => {
  try {
    const sessionJson = localStorage.getItem('nhost.auth.session');
    return sessionJson ? JSON.parse(sessionJson) : null;
  } catch (e) {
    console.error('Error parsing stored session:', e);
    return null;
  }
};

/**
 * Clear all auth-related storage
 */
export const clearAuthStorage = () => {
  // Clear Nhost specific storage
  localStorage.removeItem('nhost.auth.session');
  localStorage.removeItem('nhostRefreshToken');
  
  // Clear any item that might contain auth data
  Object.keys(localStorage).forEach(key => {
    if (
      key.startsWith('nhost.') || 
      key.includes('token') || 
      key.includes('Token') ||
      key.includes('auth') ||
      key.includes('Auth')
    ) {
      localStorage.removeItem(key);
    }
  });
  
  // Also clear session storage
  sessionStorage.clear();
};

/**
 * Handle common OAuth token errors
 * @param {Object} error - Error object from OAuth/authentication
 * @returns {Object} Processed error with user-friendly message and action
 */
export const processAuthError = (error) => {
  if (!error) return null;
  
  // Define common OAuth errors based on Google's documentation
  const errorMap = {
    'invalid_grant': {
      message: 'Your session has expired. Please sign in again.',
      action: 'SIGN_IN_AGAIN'
    },
    'invalid_client': {
      message: 'Authentication problem. Please try again later.',
      action: 'RETRY'
    },
    'invalid_request': {
      message: 'Invalid request. Please try again.',
      action: 'RETRY'
    },
    'unauthorized_client': {
      message: 'This application is not authorized to access your account.',
      action: 'CONTACT_SUPPORT'
    },
    'access_denied': {
      message: 'Access denied. Please check your permissions.',
      action: 'CHECK_PERMISSIONS'
    },
    'admin_policy_enforced': {
      message: 'Access restricted by your organization\'s policies.',
      action: 'CONTACT_ADMIN'
    },
    'TOKEN_REFRESH_FAILED': {
      message: 'Your session expired. Please sign in again.',
      action: 'SIGN_IN_AGAIN'
    },
    'unsupported_grant_type': {
      message: 'Authentication method not supported.',
      action: 'CONTACT_SUPPORT'
    }
  };
  
  // Extract error code
  const errorCode = error.error || error.code || error.message || 'unknown_error';
  
  // Return mapped error or generic error
  return errorMap[errorCode] || {
    message: 'An authentication error occurred. Please try again.',
    action: 'RETRY',
    originalError: errorCode
  };
};

/**
 * Check if there are any signs of token issues
 * @returns {boolean} True if there are token issues detected
 */
export const detectTokenIssues = () => {
  const session = getStoredSession();
  
  if (!session) {
    return true;
  }
  
  // Check if token is expired
  if (session.accessTokenExpiresAt) {
    const expiryTime = new Date(session.accessTokenExpiresAt).getTime();
    const currentTime = new Date().getTime();
    if (expiryTime <= currentTime) {
      return true;
    }
  }
  
  return false;
}; 