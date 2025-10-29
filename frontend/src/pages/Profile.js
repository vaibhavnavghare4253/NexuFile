import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Key, 
  Bell, 
  Eye, 
  EyeOff,
  Save,
  Camera,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    role: 'user',
    notifications: true,
    twoFactor: false,
    privacy: 'public'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [accountStats, setAccountStats] = useState({
    totalFiles: 1247,
    storageUsed: '2.4 GB',
    lastLogin: '2024-01-15 10:30:00',
    accountAge: '2 years, 3 months'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        display_name: user.display_name || '',
        email: user.email || '',
        role: user.role || 'user',
        notifications: true,
        twoFactor: false,
        privacy: 'public'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // Simulate password update
    toast.success('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate avatar upload
      toast.success('Avatar updated successfully!');
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="avatar-section">
            <div className="avatar-container">
              <User size={48} />
              <button className="avatar-upload">
                <Camera size={16} />
              </button>
            </div>
            <div className="user-info">
              <h1 className="user-name">{user?.display_name || 'User'}</h1>
              <p className="user-email">{user?.email}</p>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="action-button">
              <Download size={20} />
              Export Data
            </button>
            <button className="action-button danger">
              <Trash2 size={20} />
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        className="account-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Upload size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{accountStats.totalFiles.toLocaleString()}</h3>
            <p className="stat-label">Total Files</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{accountStats.storageUsed}</h3>
            <p className="stat-label">Storage Used</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">Last Login</h3>
            <p className="stat-label">{accountStats.lastLogin}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">Account Age</h3>
            <p className="stat-label">{accountStats.accountAge}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Settings */}
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2 className="section-title">Profile Settings</h2>
            <p className="section-description">Manage your personal information and preferences</p>
          </div>

          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div className="input-group">
                <User size={20} />
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your display name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <Mail size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="input-group">
                <Shield size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Privacy Settings</label>
              <div className="input-group">
                <Eye size={20} />
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Enable email notifications</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="twoFactor"
                  checked={formData.twoFactor}
                  onChange={(e) => setFormData({...formData, twoFactor: e.target.checked})}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Enable two-factor authentication</span>
              </label>
            </div>

            <motion.button
              type="submit"
              className="save-button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </form>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          className="security-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Security Settings</h2>
            <p className="section-description">Manage your password and security preferences</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="security-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="input-group">
                <Key size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <Key size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-group">
                <Key size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="password-requirements">
              <h4 className="requirements-title">Password Requirements:</h4>
              <ul className="requirements-list">
                <li className={`requirement ${passwordData.newPassword.length >= 8 ? 'valid' : 'invalid'}`}>
                  <CheckCircle size={16} />
                  At least 8 characters long
                </li>
                <li className={`requirement ${/[A-Z]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}`}>
                  <CheckCircle size={16} />
                  Contains uppercase letter
                </li>
                <li className={`requirement ${/[0-9]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}`}>
                  <CheckCircle size={16} />
                  Contains number
                </li>
                <li className={`requirement ${/[!@#$%^&*]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}`}>
                  <CheckCircle size={16} />
                  Contains special character
                </li>
              </ul>
            </div>

            <motion.button
              type="submit"
              className="save-button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Key size={20} />
              {isLoading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar-container {
          position: relative;
        }

        .avatar-container svg {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          padding: 1rem;
          color: white;
        }

        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          background: #667eea;
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .user-email {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .user-role {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.75rem;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #e5e7eb;
        }

        .action-button.danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-button.danger:hover {
          background: #fecaca;
        }

        .account-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          margin: 0;
        }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .profile-section,
        .security-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-description {
          color: #6b7280;
        }

        .profile-form,
        .security-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group svg {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          accent-color: #667eea;
        }

        .checkbox-text {
          color: #374151;
          font-weight: 500;
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .save-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
        }

        .password-requirements {
          background: #f8fafc;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .requirements-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .requirement {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .requirement.valid {
          color: #059669;
        }

        .requirement.invalid {
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .profile-content {
            grid-template-columns: 1fr;
          }

          .account-stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
