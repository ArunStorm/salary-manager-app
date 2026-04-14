import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * Authentication Context
 * Manages mock authentication state, user role, and session persistence.
 * 
 * For MVP: Accepts any username/password without validation.
 * Token is stored in localStorage for persistence.
 * Roles: "admin" (full access) or "employee" (limited access)
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
   * Mock login - accepts any credentials
   * In production: Validate against backend and get JWT token
   */
  const login = useCallback(async (username, password) => {
    try {
      setError(null);
      setIsLoading(true);

      // Mock validation: username and password must not be empty
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Determine role based on username (for demo purposes)
      // In production: Get from backend
      const role = username.toLowerCase() === 'admin' ? 'admin' : 'employee';

      const authData = {
        id: `user_${Date.now()}`,
        username,
        role,
        loginTime: new Date().toISOString(),
      };

      // Create mock token (in production: JWT from backend)
      const token = `mock_token_${Date.now()}`;

      // Store in localStorage
      localStorage.setItem('auth', JSON.stringify(authData));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(authData);
      setIsAuthenticated(true);

      return { success: true, user: authData };
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
