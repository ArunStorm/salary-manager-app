/**
 * useApi Hook
 * Custom hook for making API calls with loading/error states
 */

import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useFetch = (initialUrl = '', initialMethod = 'GET', options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API call
   */
  const execute = useCallback(async (url = initialUrl, method = initialMethod, payload = null) => {
    if (!url) {
      setError('URL is required');
      return { success: false, error: 'URL is required' };
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(url);
          break;
        case 'POST':
          response = await api.post(url, payload);
          break;
        case 'PUT':
          response = await api.put(url, payload);
          break;
        case 'DELETE':
          response = await api.delete(url);
          break;
        case 'PATCH':
          response = await api.patch(url, payload);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      console.error(`API Error [${method} ${url}]:`, err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [initialUrl, initialMethod]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useFetch;
