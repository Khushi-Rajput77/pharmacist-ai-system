import React, { useState } from 'react';
import { orderAPI } from '../../services/api';

/**
 * RecentOrders Component
 * Displays customer's recent orders in a table
 * Features:
 * - Order list with details
 * - Status badges
 * - Reorder functionality
 * - Order details modal
 */
function RecentOrders({ orders, loading, onRefresh, customerId }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reordering, setReordering] = useState(false);

  /**
   * Format date to readable format
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: '#ff9800', icon: '⏳', label: 'Pending' },
      confirmed: { color: '#2196f3', icon: '✓', label: 'Confirmed' },
      shipped: { color: '#9c27b0', icon: '📦', label: 'Shipped' },
      delivered: { color: '#4caf50', icon: '✓✓', label: 'Delivered' },
      cancelled: { color: '#f44336', icon: '✕', label: 'Cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  };

  /**
   * Handle reorder
   */
  const handleReorder = async (order) => {
    try {
      setReordering(true);
      
      // Create new order with same medicines
      const newOrder = {
        customerId: customerId,
        medicines: order.medicines,
        totalPrice: order.totalPrice
      };

      const response = await orderAPI.create(newOrder);
      
      if (response.data.success) {
        alert('✅ Order placed successfully!');
        onRefresh();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Reorder error:', err);
      alert('❌ Failed to place order');
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-icon">📦</div>
        <h3>No Orders Yet</h3>
        <p>Start by placing your first order through the chat interface</p>
      </div>
    );
  }

  return (
    <div className="recent-orders-section">
      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Medicines</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const medicineCount = order.medicines?.length || 0;
              
              return (
                <tr key={order._id} className="order-row">
                  <td className="order-id">
                    <code>{order.orderId}</code>
                  </td>
                  <td className="order-date">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="medicine-count">
                    {medicineCount} medicine{medicineCount !== 1 ? 's' : ''}
                  </td>
                  <td className="order-price">
                    ₹{order.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="order-status">
                    <span 
                      className="status-badge"
                      style={{ borderLeftColor: statusBadge.color }}
                    >
                      {statusBadge.icon} {statusBadge.label}
                    </span>
                  </td>
                  <td className="order-actions">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(order)}
                      title="View order details"
                    >
                      👁️ View
                    </button>
                    <button
                      className="reorder-btn"
                      onClick={() => handleReorder(order)}
                      disabled={reordering || order.status === 'cancelled'}
                      title="Reorder same medicines"
                    >
                      🔄 Reorder
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Order Info */}
              <div className="order-info-group">
                <div className="info-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedOrder.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(selectedOrder.orderDate)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">
                    {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              {/* Medicines List */}
              <div className="medicines-list">
                <h4>Medicines:</h4>
                {selectedOrder.medicines && selectedOrder.medicines.length > 0 ? (
                  <ul>
                    {selectedOrder.medicines.map((med, idx) => (
                      <li key={idx}>
                        <span className="med-name">{med.medicineId?.name || 'Medicine'}</span>
                        <span className="med-qty">Qty: {med.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No medicine details available</p>
                )}
              </div>

              {/* Price */}
              <div className="order-price-section">
                <span className="label">Total:</span>
                <span className="price">₹{selectedOrder.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              <button 
                className="modal-btn primary"
                onClick={() => {
                  handleReorder(selectedOrder);
                  setSelectedOrder(null);
                }}
                disabled={reordering}
              >
                🔄 Reorder Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;