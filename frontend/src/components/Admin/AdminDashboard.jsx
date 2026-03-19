/**
 * AdminDashboard.jsx
 * Professional admin-only dashboard
 * 
 * Features:
 * - Business analytics
 * - Inventory management
 * - User management
 * - Refill monitoring
 * - System health
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { refillAPI, orderAPI, medicineAPI, customerAPI } from '../../services/api';
import AdminNav from './AdminNav';
import './AdminDashboardStyles.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole, userData, handleLogout, getAuthHeader } = useAuth();
  
  // Verify this is admin
  if (userRole !== 'admin' && userRole !== 'pharmacist') {
    navigate('/dashboard');
    return null;
  }

  // State Management
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingRefills: 0,
    lowStockItems: 0,
    dailyRevenue: 0
  });

  const [refillAlerts, setRefillAlerts] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      setLoading(true);

      const headers = getAuthHeader();

      // Fetch all data in parallel
      const [ordersRes, medicinesRes, customersRes, alertsRes] = await Promise.all([
        orderAPI.getAll(),
        medicineAPI.getAll(),
        customerAPI.getAll(),
        refillAPI.getAlerts()
      ]);

      // Process orders data
      const orders = ordersRes.data.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const todayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          const today = new Date();
          return orderDate.toDateString() === today.toDateString();
        })
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      // Process medicines data
      const medicines = medicinesRes.data.data || [];
      const lowStock = medicines.filter(m => m.currentStock < 100);

      // Process alerts
      const alerts = alertsRes.data.data || [];
      const pendingAlerts = alerts.filter(a => a.status === 'pending');

      // Update dashboard
      setDashboardData({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalCustomers: customersRes.data.data?.length || 0,
        pendingRefills: pendingAlerts.length,
        lowStockItems: lowStock.length,
        dailyRevenue: todayRevenue
      });

      setRefillAlerts(pendingAlerts.slice(0, 5));
      setLowStockMedicines(lowStock.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  if (loading && !dashboardData.totalOrders) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <AdminNav userData={userData} onLogout={handleLogoutClick} />

      <main className="admin-main-content">
        {/* Header */}
        <div className="admin-header-section">
          <div>
            <h1>📊 Admin Dashboard</h1>
            <p className="admin-subtitle">Welcome back, {userData?.firstName}!</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-primary">Generate Report</button>
            <button className="btn-secondary">System Settings</button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="admin-kpi-grid">
          <div className="kpi-card primary">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <h3>Total Revenue</h3>
              <p className="kpi-value">₹{dashboardData.totalRevenue.toLocaleString()}</p>
              <span className="kpi-label">All Time</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">📦</div>
            <div className="kpi-content">
              <h3>Total Orders</h3>
              <p className="kpi-value">{dashboardData.totalOrders}</p>
              <span className="kpi-label">Completed</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>Active Customers</h3>
              <p className="kpi-value">{dashboardData.totalCustomers}</p>
              <span className="kpi-label">Total registered</span>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-icon">⏰</div>
            <div className="kpi-content">
              <h3>Pending Refills</h3>
              <p className="kpi-value">{dashboardData.pendingRefills}</p>
              <span className="kpi-label">Needs attention</span>
            </div>
          </div>

          <div className="kpi-card danger">
            <div className="kpi-icon">📉</div>
            <div className="kpi-content">
              <h3>Low Stock Items</h3>
              <p className="kpi-value">{dashboardData.lowStockItems}</p>
              <span className="kpi-label">Restock needed</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">💵</div>
            <div className="kpi-content">
              <h3>Today's Revenue</h3>
              <p className="kpi-value">₹{dashboardData.dailyRevenue.toLocaleString()}</p>
              <span className="kpi-label">Current day</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="admin-tabs-section">
          <div className="admin-tabs">
            {['overview', 'refills', 'inventory', 'orders'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        <section className="admin-tab-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {/* Low Stock Medicines */}
              <div className="admin-card full-width">
                <h2>Low Stock Medicines</h2>
                {lowStockMedicines.length === 0 ? (
                  <p className="empty-state">✅ All medicines are well stocked</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Medicine Name</th>
                        <th>Current Stock</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockMedicines.map(med => (
                        <tr key={med._id}>
                          <td>{med.name}</td>
                          <td className="stock-warning">{med.currentStock} units</td>
                          <td>₹{med.price}</td>
                          <td>
                            <button className="btn-small btn-restock">Restock</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Recent Orders */}
              <div className="admin-card full-width">
                <h2>Recent Orders</h2>
                {recentOrders.length === 0 ? (
                  <p className="empty-state">No orders yet</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>{order._id?.substring(0, 8)}</td>
                          <td>{order.customerName || 'N/A'}</td>
                          <td>₹{order.totalPrice}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'refills' && (
            <div className="admin-card full-width">
              <h2>Refill Alerts Management</h2>
              {refillAlerts.length === 0 ? (
                <p className="empty-state">No pending refill alerts</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Medicine</th>
                      <th>Refill Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refillAlerts.map(alert => (
                      <tr key={alert._id}>
                        <td>{alert.patientName || 'N/A'}</td>
                        <td>{alert.medicineName}</td>
                        <td>{new Date(alert.refillDate).toLocaleDateString()}</td>
                        <td>
                          <span className="status-badge status-warning">{alert.status}</span>
                        </td>
                        <td>
                          <button className="btn-small btn-approve">Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="admin-card full-width">
              <h2>Inventory Management</h2>
              <p className="placeholder-text">Click "Inventory Manager" in sidebar to manage medicines</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-card full-width">
              <h2>Order Management</h2>
              <p className="placeholder-text">Click "Order Management" in sidebar to manage all orders</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
