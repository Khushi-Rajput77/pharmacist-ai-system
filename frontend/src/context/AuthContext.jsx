/**
 * AuthContext.jsx
 * Global authentication state management
 * Handles login, logout, role management
 * 
 * Industry-standard pattern for auth handling
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedCustomerId = localStorage.getItem('customerId');
    const savedRole = localStorage.getItem('userRole');
    const savedUserData = localStorage.getItem('userData');

    if (savedToken && savedCustomerId && savedRole) {
      setToken(savedToken);
      setCustomerId(savedCustomerId);
      setUserRole(savedRole);
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  /**
   * Handle login
   * Stores token, customerId, role, and user data
   */
  const handleLogin = (loginData) => {
    const { token, customerId, data } = loginData;
    
    setToken(token);
    setCustomerId(customerId);
    setUserRole(data.role);
    setUserData(data);
    setIsLoggedIn(true);

    // Store in localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('customerId', customerId);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  /**
   * Handle logout
   * Clears all auth data
   */
  const handleLogout = () => {
    setToken(null);
    setCustomerId(null);
    setUserRole(null);
    setUserData(null);
    setIsLoggedIn(false);

    localStorage.removeItem('authToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  /**
   * Get Authorization Header for API calls
   */
  const getAuthHeader = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    isLoggedIn,
    customerId,
    userRole,
    userData,
    token,
    loading,
    handleLogin,
    handleLogout,
    hasRole,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Use this in any component to access auth context
 * Example: const { isLoggedIn, userRole, handleLogout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
