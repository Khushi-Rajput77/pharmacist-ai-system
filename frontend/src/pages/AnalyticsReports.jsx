import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyticsReports.css';

/**
 * AnalyticsReports Component - Admin Dashboard
 * 
 * Features:
 * - Total orders count and metrics
 * - Revenue tracking and charts
 * - Active customers statistics
 * - Popular medicines list
 * - Professional data visualization
 * - Responsive dashboard design
 */
function AnalyticsReports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    totalOrders: 156,
    totalRevenue: 38450.75,
    activeCustomers: 342,
    popularMedicines: [
      {
        id: 'MED001',
        name: 'Lisinopril',
        orders: 89,
        revenue: 1421.11,
        trend: 'up'
      },
      {
        id: 'MED002',
        name: 'Metformin',
        orders: 76,
        revenue: 950.00,
        trend: 'up'
      },
      {
        id: 'MED003',
        name: 'Atorvastatin',
        orders: 65,
        revenue: 1218.75,
        trend: 'stable'
      },
      {
        id: 'MED004',
        name: 'Aspirin',
        orders: 58,
        revenue: 521.42,
        trend: 'down'
      },
      {
        id: 'MED005',
        name: 'Amlodipine',
        orders: 52,
        revenue: 741.75,
        trend: 'up'
      }
    ],
    revenueByDay: [
      { day: 'Mon', revenue: 4200 },
      { day: 'Tue', revenue: 5100 },
      { day: 'Wed', revenue: 3800 },
      { day: 'Thu', revenue: 6200 },
      { day: 'Fri', revenue: 7100 },
      { day: 'Sat', revenue: 5800 },
      { day: 'Sun', revenue: 4250 }
    ],
    orderStatus: {
      completed: 128,
      pending: 18,
      cancelled: 10
    }
  });

  const maxRevenue = Math.max(...analyticsData.revenueByDay.map(d => d.revenue));

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>📊 Analytics & Reports</h1>
        
        {/* Period Selector */}
        <div className="period-selector">
          <button
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="analytics-container">
        {/* Key Metrics */}
        <div className="metrics-grid">
          {/* Total Orders */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>📦 Total Orders</h3>
              <span className="metric-trend up">↑ +12%</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{analyticsData.totalOrders}</div>
              <p className="metric-label">orders this month</p>
              <div className="metric-breakdown">
                <span className="breakdown-item">
                  <span className="status-dot completed"></span>
                  Completed: {analyticsData.orderStatus.completed}
                </span>
                <span className="breakdown-item">
                  <span className="status-dot pending"></span>
                  Pending: {analyticsData.orderStatus.pending}
                </span>
                <span className="breakdown-item">
                  <span className="status-dot cancelled"></span>
                  Cancelled: {analyticsData.orderStatus.cancelled}
                </span>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="metric-card featured">
            <div className="metric-header">
              <h3>💰 Total Revenue</h3>
              <span className="metric-trend up">↑ +18%</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">₹{analyticsData.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              <p className="metric-label">revenue this month</p>
              <div className="metric-chart">
                <div className="chart-bar"></div>
                <p className="chart-note">Average: ₹{(analyticsData.totalRevenue / 30).toFixed(2)}/day</p>
              </div>
            </div>
          </div>

          {/* Active Customers */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>👥 Active Customers</h3>
              <span className="metric-trend up">↑ +8%</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{analyticsData.activeCustomers}</div>
              <p className="metric-label">active users</p>
              <div className="customer-breakdown">
                <div className="customer-item">
                  <span className="customer-icon">🆕</span>
                  <span>42 New this month</span>
                </div>
                <div className="customer-item">
                  <span className="customer-icon">🔄</span>
                  <span>156 Returning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-section">
          <h2>📈 Daily Revenue - This Week</h2>
          <div className="revenue-chart">
            <div className="chart-container">
              {analyticsData.revenueByDay.map((item, idx) => (
                <div key={idx} className="chart-item">
                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(item.revenue / maxRevenue) * 200}px`,
                        background: `linear-gradient(135deg, hsl(${200 - (idx * 15)}, 70%, 50%) 0%, hsl(${200 - (idx * 15)}, 70%, 30%) 100%)`
                      }}
                    >
                      <span className="bar-value">₹{(item.revenue / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                  <span className="chart-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Medicines */}
        <div className="popular-section">
          <h2>💊 Popular Medicines</h2>
          <div className="medicines-grid">
            {analyticsData.popularMedicines.map(medicine => (
              <div key={medicine.id} className="medicine-card">
                <div className="medicine-header">
                  <h4>{medicine.name}</h4>
                  <span className={`trend-indicator ${medicine.trend}`}>
                    {medicine.trend === 'up' && '📈 Up'}
                    {medicine.trend === 'down' && '📉 Down'}
                    {medicine.trend === 'stable' && '➡️ Stable'}
                  </span>
                </div>

                <div className="medicine-stats">
                  <div className="stat-row">
                    <span className="stat-label">Orders</span>
                    <span className="stat-value">{medicine.orders}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">₹{medicine.revenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="medicine-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(medicine.orders / 100) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{Math.round((medicine.orders / 100) * 100)}% of max</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="status-section">
          <h2>📋 Order Status Distribution</h2>
          <div className="status-cards">
            <div className="status-card completed">
              <div className="status-icon">✓</div>
              <div className="status-info">
                <h4>Completed Orders</h4>
                <p className="status-count">{analyticsData.orderStatus.completed}</p>
                <p className="status-percent">
                  {(analyticsData.orderStatus.completed / analyticsData.totalOrders * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="status-card pending">
              <div className="status-icon">⏳</div>
              <div className="status-info">
                <h4>Pending Orders</h4>
                <p className="status-count">{analyticsData.orderStatus.pending}</p>
                <p className="status-percent">
                  {(analyticsData.orderStatus.pending / analyticsData.totalOrders * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="status-card cancelled">
              <div className="status-icon">✕</div>
              <div className="status-info">
                <h4>Cancelled Orders</h4>
                <p className="status-count">{analyticsData.orderStatus.cancelled}</p>
                <p className="status-percent">
                  {(analyticsData.orderStatus.cancelled / analyticsData.totalOrders * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-section">
          <h2>📊 Summary Statistics</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Average Order Value</span>
              <span className="summary-value">₹{(analyticsData.totalRevenue / analyticsData.totalOrders).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Orders Per Customer</span>
              <span className="summary-value">{(analyticsData.totalOrders / analyticsData.activeCustomers).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Revenue Per Customer</span>
              <span className="summary-value">₹{(analyticsData.totalRevenue / analyticsData.activeCustomers).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Success Rate</span>
              <span className="summary-value">{(analyticsData.orderStatus.completed / analyticsData.totalOrders * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="export-section">
          <h2>📥 Export Reports</h2>
          <div className="export-buttons">
            <button className="export-btn">📄 Export as PDF</button>
            <button className="export-btn">📊 Export as Excel</button>
            <button className="export-btn">📧 Email Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsReports;
