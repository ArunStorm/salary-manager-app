/**
 * Centralized API Service Layer
 * Handles all HTTP requests with automatic error handling, auth token injection,
 * and consistent response formatting.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Make API call with automatic error handling and auth token injection
 * 
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint (e.g., '/employees')
 * @param {object} data - Request payload (for POST/PUT)
 * @returns {Promise} - Resolved data or throws error
 */
export const apiCall = async (method = 'GET', endpoint = '', data = null) => {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Inject auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body for POST/PUT/PATCH requests
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    // Handle different response statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse and return response
    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    
    // Re-throw with consistent error format
    const apiError = new Error(error.message || 'Network error. Please check your connection.');
    apiError.status = error.status;
    apiError.isNetworkError = !error.message;
    throw apiError;
  }
};

/**
 * Convenience wrapper methods
 */
export const api = {
  get: (endpoint) => apiCall('GET', endpoint),
  post: (endpoint, data) => apiCall('POST', endpoint, data),
  put: (endpoint, data) => apiCall('PUT', endpoint, data),
  patch: (endpoint, data) => apiCall('PATCH', endpoint, data),
  delete: (endpoint) => apiCall('DELETE', endpoint),
};

export default api;
