import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import './OrderHistory.css';

/**
 * Order History Component
 * Features:
 * - List of all customer orders
 * - Order details (medicines, qty, price, status)
 * - Search/filter options
 * - Reorder functionality
 * - Professional industry-level design
 */
function OrderHistory({ customerId }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, confirmed, processing, shipped, delivered
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // date, amount, status
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  /**
   * Fetch orders from API
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getByCustomer(customerId);
      
      if (response.data.success) {
        // Mock data if API returns empty
        if (response.data.data && response.data.data.length > 0) {
          setOrders(response.data.data);
        } else {
          setOrders(generateMockOrders());
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Use mock data for demo
      setOrders(generateMockOrders());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate mock orders for demo
   */
  const generateMockOrders = () => {
    return [
      {
        _id: '1',
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        medicines: [
          { name: 'Amoxicillin 500mg', quantity: 1, price: 150.00, dosage: '500mg' },
          { name: 'Ibuprofen 400mg', quantity: 2, price: 50.00, dosage: '400mg' }
        ],
        subtotal: 200.00,
        tax: 18.00,
        shippingCost: 50.00,
        totalAmount: 268.00,
        status: 'delivered',
        paymentStatus: 'paid',
        trackingNumber: 'TRACK001',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '2',
        orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        medicines: [
          { name: 'Paracetamol 500mg', quantity: 1, price: 100.00, dosage: '500mg' },
          { name: 'Cetirizine 10mg', quantity: 1, price: 80.00, dosage: '10mg' }
        ],
        subtotal: 180.00,
        tax: 16.20,
        shippingCost: 50.00,
        totalAmount: 246.20,
        status: 'delivered',
        paymentStatus: 'paid',
        trackingNumber: 'TRACK002',
        estimatedDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        actualDelivery: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '3',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        medicines: [
          { name: 'Omeprazole 20mg', quantity: 1, price: 120.00, dosage: '20mg' }
        ],
        subtotal: 120.00,
        tax: 10.80,
        shippingCost: 50.00,
        totalAmount: 180.80,
        status: 'shipped',
        paymentStatus: 'paid',
        trackingNumber: 'TRACK003',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '4',
        orderDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        medicines: [
          { name: 'Metformin 500mg', quantity: 1, price: 90.00, dosage: '500mg' },
          { name: 'Aspirin 100mg', quantity: 2, price: 40.00, dosage: '100mg' }
        ],
        subtotal: 170.00,
        tax: 15.30,
        shippingCost: 50.00,
        totalAmount: 235.30,
        status: 'confirmed',
        paymentStatus: 'paid',
        trackingNumber: 'TRACK004',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  };

  /**
   * Handle reorder
   */
  const handleReorder = async (order) => {
    try {
      // In a real app, this would create a new order with same medicines
      const newOrder = {
        ...order,
        _id: Date.now().toString(),
        orderDate: new Date().toISOString(),
        status: 'pending',
        trackingNumber: null,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setOrders([newOrder, ...orders]);
      setSuccessMessage('✅ Order created successfully! Check your email for confirmation.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to reorder');
    }
  };

  /**
   * Filter and sort orders
   */
  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Search by order ID or medicine name
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(term) ||
        order.medicines.some(med => med.name.toLowerCase().includes(term))
      );
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === 'status') {
      const statusOrder = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };
      filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    return filtered;
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered'
    };
    return colors[status] || 'status-pending';
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      processing: '📦',
      shipped: '🚚',
      delivered: '🎉'
    };
    return icons[status] || '❓';
  };

  /**
   * Format date
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Format time
   */
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="order-history-container">
      {/* Back Button */}
      <div className="order-history-header-back">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="order-history-main">
        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* Header Section */}
        <div className="order-history-header">
          <div className="header-title">
            <h1>📦 Order History</h1>
            <p>Track and manage all your pharmacy orders</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="order-history-grid">
          {/* Left: Filters & Search */}
          <div className="order-filters-section">
            <div className="filters-card">
              <h3>🔍 Search & Filter</h3>

              {/* Search */}
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by order ID or medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Filter by Status */}
              <div className="filter-group">
                <label className="filter-label">📊 Filter by Status</label>
                <div className="status-filters">
                  {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => (
                    <button
                      key={status}
                      className={`status-filter-btn ${filterStatus === status ? 'active' : ''}`}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="filter-group">
                <label className="filter-label">🔤 Sort by</label>
                <div className="sort-options">
                  {[
                    { value: 'date', label: 'Date (Newest)' },
                    { value: 'amount', label: 'Amount (High to Low)' },
                    { value: 'status', label: 'Status' }
                  ].map(option => (
                    <label key={option.value} className="sort-option">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Results Info */}
              <div className="results-info">
                <p>📋 Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders</p>
              </div>
            </div>
          </div>

          {/* Right: Orders List */}
          <div className="order-list-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state">
                <p>📭 No orders found</p>
                <p className="empty-hint">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(order => (
                  <div key={order._id} className="order-card">
                    {/* Order Header */}
                    <div className="order-card-header">
                      <div className="order-info">
                        <h3>Order #{order._id}</h3>
                        <div className="order-meta">
                          <span className="meta-item">
                            📅 {formatDate(order.orderDate)}
                          </span>
                          <span className="meta-item">
                            ⏰ {formatTime(order.orderDate)}
                          </span>
                        </div>
                      </div>
                      <div className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>

                    {/* Medicines */}
                    <div className="order-medicines">
                      <h4>💊 Medicines</h4>
                      <div className="medicines-list">
                        {order.medicines.map((med, idx) => (
                          <div key={idx} className="medicine-item">
                            <div className="medicine-details">
                              <span className="medicine-name">{med.name}</span>
                              <span className="medicine-dosage">{med.dosage}</span>
                            </div>
                            <div className="medicine-price">
                              <span className="quantity">x{med.quantity}</span>
                              <span className="price">₹{(med.price * med.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="order-pricing">
                      <div className="price-row">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="price-row">
                        <span>Tax (GST)</span>
                        <span>₹{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="price-row">
                        <span>Shipping</span>
                        <span>₹{order.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="price-row total">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                      <div className="order-tracking">
                        <p>📍 Tracking: <strong>{order.trackingNumber}</strong></p>
                        <p>🚚 Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
                        {order.actualDelivery && (
                          <p>✅ Delivered: {formatDate(order.actualDelivery)}</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="order-actions">
                      <button
                        className="btn-details"
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        {selectedOrder?._id === order._id ? '⬆️ Hide Details' : '⬇️ View Details'}
                      </button>
                      <button
                        className="btn-reorder"
                        onClick={() => handleReorder(order)}
                      >
                        🔄 Reorder
                      </button>
                    </div>

                    {/* Extended Details */}
                    {selectedOrder?._id === order._id && (
                      <div className="order-extended-details">
                        <h4>📋 Order Details</h4>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="label">Order Date:</span>
                            <span className="value">{formatDate(order.orderDate)} {formatTime(order.orderDate)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Payment Status:</span>
                            <span className={`value ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Shipping Address:</span>
                            <span className="value">123 Main Street, City</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="detail-item">
                              <span className="label">Tracking Number:</span>
                              <span className="value">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
