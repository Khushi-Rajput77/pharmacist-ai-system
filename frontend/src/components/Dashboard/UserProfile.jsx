import React, { useState } from 'react';
import { customerAPI } from '../../services/api';
import './DashboardStyles.css';

/**
 * UserProfile Component
 * Displays patient profile information
 * Features:
 * - User avatar with initials
 * - Profile info (name, email, phone, address)
 * - Edit profile modal
 * - Member since date
 */
function UserProfile({ user, onRefresh }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  if (!user) return <div className="profile-skeleton">Loading profile...</div>;

  // Generate initials for avatar
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  
  // Get member since date
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    : 'Recently';

  /**
   * Handle edit form input change
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    try {
      setUpdateError('');
      setUpdating(true);

      const response = await customerAPI.update(user._id, editData);

      if (response.data.success) {
        setIsEditMode(false);
        onRefresh();
      } else {
        setUpdateError(response.data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Error updating profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Cancel edit mode
   */
  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || ''
    });
    setIsEditMode(false);
    setUpdateError('');
  };

  return (
    <div className="user-profile-card">
      {/* Profile Header */}
      <div className="profile-header">
        {/* Avatar */}
        <div className="profile-avatar">
          {initials || '👤'}
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <h2>{user.firstName} {user.lastName}</h2>
          <p className="email">{user.email}</p>
          <p className="member-since">Member since {memberSince}</p>
        </div>

        {/* Edit Button */}
        {!isEditMode && (
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditMode(true)}
            title="Edit profile"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {/* Profile Details */}
      {!isEditMode && (
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">📱 Phone:</span>
            <span className="value">{user.phoneNumber || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="label">📍 Address:</span>
            <span className="value">{user.address || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="label">👥 Account Type:</span>
            <span className="value">Patient</span>
          </div>
        </div>
      )}

      {/* Edit Mode Form */}
      {isEditMode && (
        <div className="profile-edit-form">
          <h3>Edit Profile</h3>

          {updateError && (
            <div className="edit-error-message">
              {updateError}
            </div>
          )}

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={editData.firstName}
              onChange={handleEditChange}
              placeholder="First name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={editData.lastName}
              onChange={handleEditChange}
              placeholder="Last name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleEditChange}
              placeholder="+91-9876543210"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              placeholder="Your address"
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button
              className="save-btn"
              onClick={handleSaveProfile}
              disabled={updating}
            >
              {updating ? '💾 Saving...' : '💾 Save Changes'}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={updating}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;