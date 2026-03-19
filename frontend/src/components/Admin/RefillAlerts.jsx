import React, { useState } from 'react';
import { refillAPI } from '../../services/api';

function RefillAlerts({ alerts, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const markAsSent = async (alertId) => {
    setLoading(true);
    try {
      await refillAPI.markSent(alertId);
      onUpdate();
    } catch (error) {
      alert('Error updating alert: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsOrdered = async (alertId) => {
    setLoading(true);
    try {
      await refillAPI.markOrdered(alertId);
      onUpdate();
    } catch (error) {
      alert('Error updating alert: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  return (
    <div className="refill-alerts-section">
      <h2>Refill Alerts ({pendingAlerts.length} Pending)</h2>
      
      {pendingAlerts.length === 0 ? (
        <p className="empty-msg">No pending refill alerts 🎉</p>
      ) : (
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Medicine</th>
              <th>Refill Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingAlerts.map(alert => (
              <tr key={alert._id}>
                <td>{alert.customerId?.firstName || 'N/A'}</td>
                <td>{alert.medicineId?.name || 'N/A'}</td>
                <td>{new Date(alert.predictedRefillDate).toLocaleDateString()}</td>
                <td>{alert.status}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => markAsSent(alert._id)}
                    className="btn-small btn-info"
                    disabled={loading}
                  >
                    Send Alert
                  </button>
                  <button
                    onClick={() => markAsOrdered(alert._id)}
                    className="btn-small btn-success"
                    disabled={loading}
                  >
                    Mark Ordered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RefillAlerts;