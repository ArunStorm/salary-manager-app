import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Authentication Context
 * Manages authentication state with real backend integration
 * Tokens are stored in localStorage for persistence
 * Roles: "ADMIN" (full access) or "EMPLOYEE" (limited access)
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedAuth && storedToken) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to restore auth:', err);
        localStorage.removeItem('auth');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Real backend login - validates against Firestore
   */
  const login = useCallback(async (username, password) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Call backend API
      const response = await api.post('/auth/login', { username, password });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { user: userData, token } = response.data;

      // Store in localStorage
      localStorage.setItem('auth', JSON.stringify(userData));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout - clear session
   */
  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole: user?.role || null,

    // Methods
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
