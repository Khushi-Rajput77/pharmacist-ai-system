import React, { useState, useEffect } from 'react';
import DashboardNav from './DashboardNav';
import UserProfile from './UserProfile';
import QuickOrderButton from './QuickOrderButton';
import RecentOrders from './RecentOrders';
import RefillAlerts from './RefillAlerts';
import './DashboardStyles.css';
import { customerAPI, orderAPI, refillAPI } from '../../services/api';

/**
 * PatientDashboard Component
 * Main dashboard for patients after login
 * 
 * Features:
 * - User profile display
 * - Quick order button
 * - Recent orders list
 * - Refill alerts display
 * - Navigation menu
 */
function PatientDashboard() {
  // State Management
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, alerts

  // Get customerId from localStorage
  const customerId = localStorage.getItem('customerId');

  /**
   * Fetch all dashboard data on component mount
   */
  useEffect(() => {
    if (!customerId) {
      setError('No customer ID found. Please login again.');
      setLoading(false);
      return;
    }

    fetchDashboardData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [customerId]);

  /**
   * Fetch user profile, orders, and refill alerts
   */
  const fetchDashboardData = async () => {
    try {
      setError('');
      setLoading(true);

      // Parallel API calls for better performance
      const [userRes, ordersRes, alertsRes] = await Promise.all([
        fetchUserProfile(),
        fetchRecentOrders(),
        fetchRefillAlerts()
      ]);

      // Update state only if all calls succeed
      if (userRes) setUser(userRes);
      if (ordersRes) setOrders(ordersRes);
      if (alertsRes) setRefillAlerts(alertsRes);

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user profile from API
   */
  const fetchUserProfile = async () => {
    try {
      const response = await customerAPI.getById(customerId);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  /**
   * Fetch recent orders from API
   */
  const fetchRecentOrders = async () => {
    try {
      const response = await orderAPI.getByCustomer(customerId);
      if (response.data.success) {
        // Sort by date (newest first) and limit to 5
        return response.data.data
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5);
      }
      return [];
    } catch (err) {
      console.error('Error fetching orders:', err);
      return [];
    }
  };

  /**
   * Fetch refill alerts from API
   */
  const fetchRefillAlerts = async () => {
    try {
      const response = await refillAPI.getCustomerAlerts(customerId);
      if (response.data.success) {
        // Filter only pending alerts
        return response.data.data.filter(alert => alert.status === 'pending');
      }
      return [];
    } catch (err) {
      console.error('Error fetching refill alerts:', err);
      return [];
    }
  };

  /**
   * Handle refetch data (on button click)
   */
  const handleRefresh = async () => {
    await fetchDashboardData();
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('customerId');
    window.location.href = '/';
  };

  /**
   * Render loading state
   */
  if (loading && !user) {
    return (
      <div className="dashboard-container">
        <DashboardNav onLogout={handleLogout} />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error && !user) {
    return (
      <div className="dashboard-container">
        <DashboardNav onLogout={handleLogout} />
        <div className="error-state">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render main dashboard
   */
  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <DashboardNav 
        userName={user?.firstName} 
        onLogout={handleLogout}
        onRefresh={handleRefresh}
      />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Error Message (if any) */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Header with title */}
        <div className="dashboard-header">
          <h1>Welcome back, {user?.firstName}! 👋</h1>
        </div>

        {/* Top Section: Profile + Quick Order */}
        <div className="dashboard-top-section">
          <UserProfile 
            user={user}
            onRefresh={handleRefresh}
          />
          <QuickOrderButton customerId={customerId} />
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Recent Orders ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            🔔 Refill Alerts ({refillAlerts.length})
          </button>
        </div>

        {/* Content Areas */}
        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Orders</h3>
                  <p className="stat-number">{orders.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Refills</h3>
                  <p className="stat-number">{refillAlerts.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Last Order</h3>
                  <p className="stat-text">
                    {orders.length > 0 
                      ? new Date(orders[0].orderDate).toLocaleDateString()
                      : 'No orders yet'
                    }
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Status</h3>
                  <p className="stat-text">🟢 Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Tab */}
          {activeTab === 'orders' && (
            <RecentOrders 
              orders={orders}
              loading={loading}
              onRefresh={handleRefresh}
              customerId={customerId}
            />
          )}

          {/* Refill Alerts Tab */}
          {activeTab === 'alerts' && (
            <RefillAlerts 
              alerts={refillAlerts}
              loading={loading}
              onRefresh={handleRefresh}
              customerId={customerId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;