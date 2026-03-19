import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DashboardNav Component
 * Navigation bar with menu and logout
 * Features:
 * - Navigation menu
 * - Logout button
 * - Refresh button
 * - Mobile responsive menu
 */
function DashboardNav({ userName, onLogout, onRefresh }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Handle navigation
   */
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('customerId');
      navigate('/');
      onLogout();
    }
  };

  /**
   * Navigation items
   */
  const navItems = [
    { label: '📊 Dashboard', path: '/dashboard', icon: '📊' },
    { label: '💬 Chat & Order', path: '/chat', icon: '💬' },
    { label: '📄 Prescriptions', path: '/prescriptions', icon: '📄' },
    { label: '📋 Order History', path: '/orders', icon: '📋' },
    { label: '👤 Profile', path: '/profile', icon: '👤' },
    { label: '📊 Analytics', path: '/analytics', icon: '📊' }
  ];

  return (
    <nav className="dashboard-nav">
      {/* Logo/Brand */}
      <div className="nav-brand">
        <h1 onClick={() => handleNavigation('/dashboard')}>
          🏥 AI Pharmacy
        </h1>
      </div>

      {/* Desktop Menu */}
      <div className="nav-menu-desktop">
        {navItems.map((item) => (
          <button
            key={item.path}
            className="nav-item"
            onClick={() => handleNavigation(item.path)}
            title={item.label}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {/* Refresh Button */}
        <button
          className="nav-action-btn"
          onClick={onRefresh}
          title="Refresh dashboard"
        >
          🔄 Refresh
        </button>

        {/* User Name - Right Corner */}
        {userName && (
          <span className="user-greeting">
            👤 {userName}
          </span>
        )}

        {/* Logout Button */}
        <button
          className="nav-action-btn logout"
          onClick={handleLogout}
          title="Logout from your account"
        >
          🚪 Logout
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-menu-mobile">
          {navItems.map((item) => (
            <button
              key={item.path}
              className="mobile-nav-item"
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div className="mobile-nav-divider"></div>
          <button
            className="mobile-nav-item logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default DashboardNav;