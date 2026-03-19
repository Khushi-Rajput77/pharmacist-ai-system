/**
 * RouteGuards.jsx
 * Professional route protection components
 * 
 * Components:
 * - ProtectedRoute: Requires authentication
 * - RoleRoute: Requires specific role(s)
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Requires user to be logged in
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * RoleRoute
 * Requires user to have specific role(s)
 * Redirects to appropriate page if unauthorized
 */
export const RoleRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  const hasAccess = Array.isArray(allowedRoles) 
    ? allowedRoles.includes(userRole)
    : userRole === allowedRoles;

  if (!hasAccess) {
    // Redirect based on user's actual role
    if (userRole === 'admin' || userRole === 'pharmacist') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * PublicRoute
 * For pages that shouldn't be accessible when logged in
 * Redirects to dashboard if already logged in
 */
export const PublicRoute = ({ children }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isLoggedIn) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin' || userRole === 'pharmacist') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * Loading Screen Component
 */
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{
      textAlign: 'center',
      background: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p style={{
        color: '#666',
        margin: 0,
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Loading...
      </p>
    </div>
  </div>
);

export default {
  ProtectedRoute,
  RoleRoute,
  PublicRoute
};
