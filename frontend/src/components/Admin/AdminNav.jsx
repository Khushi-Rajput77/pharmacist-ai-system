/**
 * AdminNav.jsx
 * Professional admin navigation sidebar
 * Industry-standard layout with collapsible menu
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavStyles.css';

function AdminNav({ userData, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/inventory', label: 'Inventory', icon: '📦' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/refills', label: 'Refill Alerts', icon: '⏰' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/reports', label: 'Reports', icon: '📄' },
  ];

  return (
    <nav className={`admin-nav ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Admin Logo/Brand */}
      <div className="admin-brand">
        <div className="admin-logo">
          💊
        </div>
        {!isCollapsed && <span className="brand-text">Pharmacy Admin</span>}
      </div>

      {/* Toggle Collapse Button */}
      <button
        className="toggle-sidebar"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Navigation Items */}
      <ul className="nav-items">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Profile Section */}
      <div className="admin-user-section">
        <div className="admin-user-info">
          <div className="admin-user-avatar">
            {userData?.firstName?.charAt(0) || 'A'}
          </div>
          {!isCollapsed && (
            <div className="admin-user-details">
              <p className="admin-user-name">{userData?.firstName} {userData?.lastName}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          className="btn-logout"
          onClick={onLogout}
          title="Logout"
        >
          {isCollapsed ? '🚪' : '🚪 Logout'}
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
