import React, { useState, useEffect } from 'react';
import { refillAPI, orderAPI, medicineAPI } from '../../services/api';
import InventoryManager from './InventoryManager';
import RefillAlerts from './RefillAlerts';
import './AdminStyles.css';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [alertsRes, ordersRes, medicinesRes] = await Promise.all([
        refillAPI.getAlerts(),
        orderAPI.getAll(),
        medicineAPI.getAll()
      ]);

      setRefillAlerts(alertsRes.data.data);
      
      const lowStockMeds = medicinesRes.data.data.filter(m => m.currentStock < 100);
      setLowStock(lowStockMeds);

      const totalRevenue = ordersRes.data.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setStats({
        totalOrders: ordersRes.data.data.length,
        totalRevenue: totalRevenue,
        pendingRefills: alertsRes.data.data.filter(a => a.status === 'pending').length,
        lowStockMedicines: lowStockMeds.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue || 0}</p>
        </div>
        <div className="stat-card warning">
          <h3>Pending Refills</h3>
          <p className="stat-value">{stats.pendingRefills || 0}</p>
        </div>
        <div className="stat-card danger">
          <h3>Low Stock Items</h3>
          <p className="stat-value">{stats.lowStockMedicines || 0}</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'refills' ? 'active' : ''}`}
          onClick={() => setActiveTab('refills')}
        >
          Refill Alerts ({stats.pendingRefills || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Low Stock Medicines</h2>
            {lowStock.length === 0 ? (
              <p className="empty-msg">All medicines well stocked ✅</p>
            ) : (
              <table className="medicines-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map(med => (
                    <tr key={med._id}>
                      <td>{med.name}</td>
                      <td className="low-stock">{med.currentStock}</td>
                      <td>₹{med.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'refills' && (
          <RefillAlerts alerts={refillAlerts} onUpdate={fetchDashboardData} />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager medicines={lowStock} onUpdate={fetchDashboardData} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;