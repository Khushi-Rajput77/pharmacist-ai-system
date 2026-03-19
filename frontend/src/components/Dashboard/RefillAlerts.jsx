import React, { useState, useEffect } from 'react';
import './RefillAlerts.css';

/**
 * RefillAlerts Component - Professional Medical-Grade
 * Displays pending medication refills with professional healthcare UI
 * Designed for doctors, pharmacists, and healthcare professionals
 * 
 * Features:
 * - Show pending refills with critical status indicators
 * - One-click reorder from alert
 * - Mark as completed functionality
 * - Notification badge with count
 * - Professional medical aesthetics
 * - Urgency indicators (Urgent, Warning, Normal)
 * - Comprehensive medicine information
 * - Progress tracking
 */
function RefillAlerts({ customerId = 'DEMO_CUSTOMER' }) {
  const [refills, setRefills] = useState([]);
  const [completedRefills, setCompletedRefills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('pending');

  // Initialize with mock refill data
  useEffect(() => {
    loadRefillAlerts();
  }, [customerId]);

  /**
   * Load refill alerts - currently using mock data, ready for API integration
   */
  const loadRefillAlerts = () => {
    try {
      // Mock refill data - ready to replace with real API call
      const mockRefills = [
        {
          id: 'REFILL001',
          medicineId: 'MED001',
          medicineName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          quantity: 30,
          refillDaysLeft: 2,
          status: 'urgent',
          lastRefillDate: 'Nov 15, 2024',
          nextRefillDue: 'Nov 25, 2024',
          prescriptionId: 'RX123456',
          prescribedBy: 'Dr. Sarah Johnson',
          remainingDays: 2,
          price: 15.99
        },
        {
          id: 'REFILL002',
          medicineId: 'MED002',
          medicineName: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          quantity: 60,
          refillDaysLeft: 5,
          status: 'warning',
          lastRefillDate: 'Nov 10, 2024',
          nextRefillDue: 'Nov 30, 2024',
          prescriptionId: 'RX123457',
          prescribedBy: 'Dr. Rajesh Kumar',
          remainingDays: 5,
          price: 12.50
        },
        {
          id: 'REFILL003',
          medicineId: 'MED003',
          medicineName: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily at night',
          quantity: 30,
          refillDaysLeft: 15,
          status: 'normal',
          lastRefillDate: 'Nov 1, 2024',
          nextRefillDue: 'Dec 10, 2024',
          prescriptionId: 'RX123458',
          prescribedBy: 'Dr. Sarah Johnson',
          remainingDays: 15,
          price: 18.75
        },
        {
          id: 'REFILL004',
          medicineId: 'MED004',
          medicineName: 'Aspirin',
          dosage: '75mg',
          frequency: 'Once daily',
          quantity: 30,
          refillDaysLeft: 20,
          status: 'normal',
          lastRefillDate: 'Oct 28, 2024',
          nextRefillDue: 'Dec 15, 2024',
          prescriptionId: 'RX123459',
          prescribedBy: 'Dr. Priya Patel',
          remainingDays: 20,
          price: 8.99
        },
        {
          id: 'REFILL005',
          medicineId: 'MED005',
          medicineName: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          quantity: 30,
          refillDaysLeft: 25,
          status: 'normal',
          lastRefillDate: 'Oct 22, 2024',
          nextRefillDue: 'Dec 20, 2024',
          prescriptionId: 'RX123460',
          prescribedBy: 'Dr. Amit Singh',
          remainingDays: 25,
          price: 14.25
        }
      ];

      setRefills(mockRefills);
      setCompletedRefills([]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading refill alerts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="refill-alerts-container">
        <div className="refill-loading">
          <div className="spinner"></div>
          <p>Loading refill alerts...</p>
        </div>
      </div>
    );
  }

  /**
   * Handle one-click refill order
   */
  const handleRefill = (refill) => {
    try {
      const cartItem = {
        medicineId: refill.medicineId,
        medicineName: refill.medicineName,
        dosage: refill.dosage,
        quantity: refill.quantity,
        price: refill.price,
        addedAt: new Date().toISOString()
      };

      const cartKey = `cart_${customerId}`;
      const existingCart = JSON.parse(sessionStorage.getItem(cartKey)) || { items: [] };
      existingCart.items.push(cartItem);
      sessionStorage.setItem(cartKey, JSON.stringify(existingCart));

      setSuccessMessage(`${refill.medicineName} added to cart!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error processing refill:', error);
    }
  };

  /**
   * Mark refill as completed
   */
  const handleMarkCompleted = (refill) => {
    try {
      setCompletedRefills([...completedRefills, refill]);
      setRefills(refills.filter(r => r.id !== refill.id));

      setSuccessMessage(`${refill.medicineName} marked as completed!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error marking refill as completed:', error);
    }
  };

  /**
   * Get status badge styling
   */
  const getStatusIcon = (status) => {
    const icons = {
      urgent: '🚨',
      warning: '⚠️',
      normal: '✓'
    };
    return icons[status] || '•';
  };

  const getStatusLabel = (status) => {
    const labels = {
      urgent: 'Urgent - Refill Now',
      warning: 'Warning - Due Soon',
      normal: 'Normal'
    };
    return labels[status] || 'Unknown';
  };

  /**
   * Filter refills based on selected filter
   */
  const getFilteredRefills = () => {
    if (filter === 'pending') {
      return refills.filter(r => r.status !== 'completed');
    } else if (filter === 'completed') {
      return completedRefills;
    }
    return refills;
  };

  const filteredRefills = getFilteredRefills();
  const pendingCount = refills.filter(r => r.status === 'urgent' || r.status === 'warning').length;

  return (
    <div className="refill-alerts-container">
      {/* Success Message */}
      {successMessage && (
        <div className="refill-success-message">
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="refill-alerts-header">
        <div className="header-content">
          <div className="header-title-section">
            <h3>💊 Medication Refills</h3>
            {pendingCount > 0 && (
              <span className="refill-badge">{pendingCount}</span>
            )}
          </div>
          <p className="header-subtitle">
            {refills.length} pending refills • {completedRefills.length} completed
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="refill-filter-tabs">
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          📋 Pending ({refills.length})
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          ✅ Completed ({completedRefills.length})
        </button>
      </div>

      {/* Refills List */}
      <div className="refills-list">
        {filteredRefills.length === 0 ? (
          <div className="refill-empty-state">
            <div className="empty-icon">
              {filter === 'pending' ? '📭' : '✨'}
            </div>
            <p className="empty-title">
              {filter === 'pending' ? 'No pending refills' : 'No completed refills'}
            </p>
            <p className="empty-description">
              {filter === 'pending' 
                ? 'All your medications are well-stocked!'
                : 'Completed refills will appear here'}
            </p>
          </div>
        ) : (
          filteredRefills.map(refill => (
            <div 
              key={refill.id} 
              className={`refill-card refill-status-${refill.status}`}
            >
              {/* Status Indicator */}
              <div className="refill-status-indicator">
                <span className="status-icon">{getStatusIcon(refill.status)}</span>
                <span className={`status-label status-${refill.status}`}>
                  {getStatusLabel(refill.status)}
                </span>
              </div>

              {/* Main Content */}
              <div className="refill-card-content">
                {/* Medicine Name & Dosage */}
                <div className="medicine-header">
                  <h4 className="medicine-name">{refill.medicineName}</h4>
                  <span className="medicine-dosage">{refill.dosage}</span>
                </div>

                {/* Medicine Details Grid */}
                <div className="medicine-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Frequency</span>
                    <span className="detail-value">{refill.frequency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{refill.quantity} units</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Days Remaining</span>
                    <span className={`detail-value ${refill.remainingDays <= 5 ? 'critical' : ''}`}>
                      {refill.remainingDays} days
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">₹{refill.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Prescription Info */}
                <div className="prescription-info">
                  <div className="info-row">
                    <span className="info-label">Prescription ID:</span>
                    <span className="info-value">{refill.prescriptionId}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Prescribed by:</span>
                    <span className="info-value">{refill.prescribedBy}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Refilled:</span>
                    <span className="info-value">{refill.lastRefillDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Due Date:</span>
                    <span className={`info-value ${refill.status === 'urgent' ? 'urgent' : ''}`}>
                      {refill.nextRefillDue}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="refill-progress-section">
                  <div className="progress-label">
                    <span>Days until refill needed</span>
                    <span className="progress-days">{refill.remainingDays} / 30 days</span>
                  </div>
                  <div className={`progress-bar progress-${refill.status}`}>
                    <div 
                      className="progress-fill"
                      style={{ width: `${(refill.remainingDays / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="refill-card-actions">
                {refill.status !== 'completed' && (
                  <>
                    <button
                      className="btn-refill-now"
                      onClick={() => handleRefill(refill)}
                      title="Add to cart and proceed to checkout"
                    >
                      <span className="btn-icon">🛒</span>
                      <span className="btn-text">Refill Now</span>
                    </button>
                    <button
                      className="btn-mark-completed"
                      onClick={() => handleMarkCompleted(refill)}
                      title="Mark this refill as completed"
                    >
                      <span className="btn-icon">✓</span>
                      <span className="btn-text">Mark Done</span>
                    </button>
                  </>
                )}
                {refill.status === 'completed' && (
                  <div className="refill-completed-badge">
                    ✅ Refill Completed
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Card */}
      {refills.length > 0 && (
        <div className="refill-summary-card">
          <div className="summary-item">
            <span className="summary-label">Urgent Refills</span>
            <span className="summary-value urgent">
              {refills.filter(r => r.status === 'urgent').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Warning Refills</span>
            <span className="summary-value warning">
              {refills.filter(r => r.status === 'warning').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Normal Refills</span>
            <span className="summary-value normal">
              {refills.filter(r => r.status === 'normal').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Refill Cost</span>
            <span className="summary-value total">
              ₹{refills.reduce((sum, r) => sum + r.price, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefillAlerts;