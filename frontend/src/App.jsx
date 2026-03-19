import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute, PublicRoute } from './components/RouteGuards';

// Pages
import LandingPage from './pages/LandingPage';

// Patient Components
import PatientDashboard from './components/Dashboard/PatientDashboard';
import ChatInterface from './components/Chat/ChatInterface';
import PrescriptionUpload from './components/Prescriptions/PrescriptionUpload';
import OrderHistory from './components/OrderHistory/OrderHistory';
import UserProfilePage from './pages/UserProfilePage';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';

// Styles
import './styles/global.css';

/**
 * App Component
 * Main routing component with role-based access control
 * 
 * Routes Structure:
 * 
 * PUBLIC ROUTES:
 * - / : Landing page (login/register)
 * 
 * PATIENT ROUTES:
 * - /dashboard : Patient dashboard
 * - /chat : Chat interface for ordering
 * - /prescriptions : Prescription upload
 * - /orders : Order history
 * - /profile : User profile management
 * 
 * ADMIN ROUTES:
 * - /admin/dashboard : Admin dashboard
 * - /admin/inventory : Inventory management
 * - /admin/users : User management
 * - /admin/orders : Order management
 * - /admin/refills : Refill alerts management
 * - /admin/analytics : Analytics & reports
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* ========== PATIENT ROUTES ========== */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles="patient">
                <PatientDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <RoleRoute allowedRoles="patient">
                <ChatInterface />
              </RoleRoute>
            }
          />

          <Route
            path="/prescriptions"
            element={
              <RoleRoute allowedRoles="patient">
                <PrescriptionUpload />
              </RoleRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <RoleRoute allowedRoles="patient">
                <OrderHistory />
              </RoleRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin', 'pharmacist']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* Additional Admin Routes (Placeholder) */}
          <Route
            path="/admin/inventory"
            element={
              <RoleRoute allowedRoles={['admin', 'pharmacist']}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'
                }}>
                  <h1>Inventory Management - Coming Soon</h1>
                </div>
              </RoleRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles="admin">
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'
                }}>
                  <h1>User Management - Coming Soon</h1>
                </div>
              </RoleRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <RoleRoute allowedRoles={['admin', 'pharmacist']}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'
                }}>
                  <h1>Order Management - Coming Soon</h1>
                </div>
              </RoleRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <RoleRoute allowedRoles={['admin', 'pharmacist']}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'
                }}>
                  <h1>Analytics & Reports - Coming Soon</h1>
                </div>
              </RoleRoute>
            }
          />

          {/* ========== 404 PAGE ========== */}
          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAlign: 'center'
  }}>
    <div style={{
      background: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <h1 style={{ margin: 0, color: '#1a1a2e', fontSize: '48px' }}>404</h1>
      <p style={{ color: '#666', margin: '16px 0', fontSize: '18px' }}>
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '24px',
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App;
