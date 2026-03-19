import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickOrderButton Component
 * Prominent button to start new order via chat
 * Features:
 * - Animated button
 * - Click to navigate to chat
 * - Info cards about the ordering process
 */
function QuickOrderButton({ customerId }) {
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate('/chat', { state: { customerId } });
  };

  return (
    <div className="quick-order-container">
      {/* Main CTA Button */}
      <div className="cta-section">
        <button 
          className="quick-order-btn"
          onClick={handleNewOrder}
          title="Start a new order"
        >
          <span className="icon">🛒</span>
          <span className="text">New Order</span>
          <span className="arrow">→</span>
        </button>
        <p className="cta-subtitle">Chat with AI Pharmacist</p>
      </div>

      {/* Info Cards */}
      <div className="order-info-cards">
        <div className="info-card">
          <span className="info-icon">💬</span>
          <h4>Chat</h4>
          <p>Describe your needs naturally</p>
        </div>
        <div className="info-card">
          <span className="info-icon">🔍</span>
          <h4>Verify</h4>
          <p>AI validates your prescription</p>
        </div>
        <div className="info-card">
          <span className="info-icon">✅</span>
          <h4>Confirm</h4>
          <p>Approve & place order</p>
        </div>
      </div>
    </div>
  );
}

export default QuickOrderButton;