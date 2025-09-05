// Error handling utilities for the application

/**
 * Handle different types of errors and redirect to appropriate error pages
 * @param {Error} error - The error object
 * @param {Function} navigate - React Router navigate function
 */
export const handleError = (error, navigate) => {
  console.error('Application error:', error);

  // Network errors
  if (error.name === 'NetworkError' || error.message.includes('Failed to fetch') || !navigator.onLine) {
    navigate('/error/network');
    return;
  }

  // HTTP status errors
  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 401:
      case 403:
        navigate('/error/401');
        break;
      case 404:
        navigate('/error/404');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        navigate('/error/500');
        break;
      default:
        // For other HTTP errors, show server error page
        navigate('/error/500');
    }
    return;
  }

  // For unexpected errors, show server error page
  navigate('/error/500');
};

/**
 * Create an error handler function for API calls
 * @param {Function} navigate - React Router navigate function
 * @returns {Function} Error handler function
 */
export const createErrorHandler = (navigate) => {
  return (error) => {
    handleError(error, navigate);
  };
};

/**
 * Axios interceptor for handling global errors
 * @param {Object} axiosInstance - Axios instance
 * @param {Function} navigate - React Router navigate function
 */
export const setupAxiosInterceptors = (axiosInstance, navigate) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      handleError(error, navigate);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      handleError(error, navigate);
      return Promise.reject(error);
    }
  );
};

/**
 * Check if the application is online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Setup online/offline event listeners
 * @param {Function} onOnline - Callback when coming online
 * @param {Function} onOffline - Callback when going offline
 */
export const setupNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Retry a failed operation
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} Promise that resolves when operation succeeds or rejects after max retries
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
