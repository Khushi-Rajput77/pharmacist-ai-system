import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

/**
 * UserProfilePage Component - Complete User Profile Management
 * 
 * Features:
 * - Edit profile information (name, email, phone, address)
 * - View prescription history
 * - Account settings
 * - Logout functionality
 * - Professional medical UI design
 */
function UserProfilePage({ onLogout, customerId }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    id: customerId || 'DEMO_USER',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: '123 Medical Street, Health City, HC 12345',
    memberSince: 'November 2024',
    membershipStatus: 'Active',
    totalOrders: 12,
    totalSpent: 2450.50,
    profileImage: null
  });

  const [editData, setEditData] = useState({ ...user });
  const [prescriptionHistory, setPrescriptionHistory] = useState([
    {
      id: 'RX001',
      medicine: 'Lisinopril',
      dosage: '10mg',
      prescribedBy: 'Dr. Sarah Johnson',
      date: 'Nov 15, 2024',
      status: 'Active'
    },
    {
      id: 'RX002',
      medicine: 'Metformin',
      dosage: '500mg',
      prescribedBy: 'Dr. Rajesh Kumar',
      date: 'Nov 10, 2024',
      status: 'Active'
    },
    {
      id: 'RX003',
      medicine: 'Atorvastatin',
      dosage: '20mg',
      prescribedBy: 'Dr. Sarah Johnson',
      date: 'Nov 1, 2024',
      status: 'Active'
    },
    {
      id: 'RX004',
      medicine: 'Aspirin',
      dosage: '75mg',
      prescribedBy: 'Dr. Priya Patel',
      date: 'Oct 28, 2024',
      status: 'Completed'
    }
  ]);

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Reset edit data when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setEditData({ ...user });
      setErrors({});
    }
  }, [isEditing, user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!editData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!editData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!editData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!editData.address.trim()) newErrors.address = 'Address is required';

    return newErrors;
  };

  // Save profile changes
  const handleSaveProfile = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUser(editData);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle logout
  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('customerId');
      localStorage.removeItem('authToken');
      onLogout?.();
      navigate('/');
    }
  };

  // Get initials
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="user-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>👤 User Profile</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="profile-success-message">
          ✓ {successMessage}
        </div>
      )}

      <div className="profile-container">
        {/* Sidebar - Profile Card */}
        <div className="profile-sidebar">
          <div className="profile-card">
            {/* Avatar */}
            <div className="profile-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <div className="avatar-initials">{initials}</div>
              )}
              <span className="status-badge">{user.membershipStatus}</span>
            </div>

            {/* Profile Info Summary */}
            <div className="profile-info-summary">
              <h2>{user.firstName} {user.lastName}</h2>
              <p className="member-since">Member since {user.memberSince}</p>
              
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{user.totalOrders}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat">
                  <span className="stat-number">₹{user.totalSpent.toFixed(2)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="profile-actions">
              <button 
                className="btn-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '✗ Cancel' : '✎ Edit Profile'}
              </button>
              <button 
                className="btn-logout"
                onClick={handleLogoutClick}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="settings-card">
            <h3>⚙️ Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <span className="setting-label">Notifications</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span className="setting-label">Email Reminders</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span className="setting-label">SMS Alerts</span>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span className="setting-label">Marketing Emails</span>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Tab Navigation */}
          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              📋 Profile Information
            </button>
            <button
              className={`tab-button ${activeTab === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              💊 Prescription History
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              {isEditing ? (
                // Edit Form
                <div className="edit-form">
                  <h3>Edit Profile Information</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      rows="3"
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveProfile}>
                      ✓ Save Changes
                    </button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Profile
                <div className="profile-view">
                  <h3>Profile Information</h3>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">First Name</span>
                      <span className="info-value">{user.firstName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Name</span>
                      <span className="info-value">{user.lastName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email Address</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone Number</span>
                      <span className="info-value">{user.phone}</span>
                    </div>
                    <div className="info-item full-width">
                      <span className="info-label">Address</span>
                      <span className="info-value">{user.address}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Member Since</span>
                      <span className="info-value">{user.memberSince}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Account Status</span>
                      <span className="info-value status-active">{user.membershipStatus}</span>
                    </div>
                  </div>

                  <div className="account-actions">
                    <h4>Account Actions</h4>
                    <button className="btn-secondary">🔒 Change Password</button>
                    <button className="btn-secondary">🗑️ Download My Data</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="tab-content">
              <h3>Prescription History</h3>
              
              {prescriptionHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No prescription history found</p>
                </div>
              ) : (
                <div className="prescriptions-list">
                  {prescriptionHistory.map(rx => (
                    <div key={rx.id} className={`prescription-item status-${rx.status.toLowerCase()}`}>
                      <div className="rx-header">
                        <div className="rx-info">
                          <h4>{rx.medicine}</h4>
                          <p className="rx-dosage">{rx.dosage}</p>
                        </div>
                        <span className={`rx-status status-${rx.status.toLowerCase()}`}>
                          {rx.status === 'Active' ? '✓ Active' : '◯ Completed'}
                        </span>
                      </div>
                      <div className="rx-details">
                        <span className="rx-doctor">👨‍⚕️ {rx.prescribedBy}</span>
                        <span className="rx-date">📅 {rx.date}</span>
                      </div>
                      <button className="rx-action-btn">📋 View Details</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
