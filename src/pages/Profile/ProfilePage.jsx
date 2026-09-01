import { useState, useContext } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { userService } from '../../services/userService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { notify } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Form 1: Edit Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'CREATOR');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileApiError, setProfileApiError] = useState('');

  // Form 2: Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordApiError, setPasswordApiError] = useState('');

  // Profile validation
  const validateProfile = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileApiError('');
    if (!validateProfile()) return;

    setProfileLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ name, email, role });
      updateUser(updatedUser);
      notify({ message: 'Profile Updated', type: 'success' });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setProfileApiError(err.response.data.message || 'Failed to update profile.');
      } else {
        setProfileApiError('Network connection failed.');
      }
      notify({ message: 'Profile Update Failed', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Password validation
  const validatePassword = () => {
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password cannot be the same as your current password';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordApiError('');
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword, confirmPassword });
      notify({ message: 'Password Changed', type: 'success' });
      // Reset password inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setPasswordApiError(err.response.data.message || 'Failed to change password. Make sure current password is correct.');
      } else {
        setPasswordApiError('Network connection failed.');
      }
      notify({ message: 'Password Change Failed', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="stage" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'flex-start', padding: '40px 16px' }}>
      {/* Background Blobs */}
      <div className="bg-wrap">
        <div className="bg-blob bb1"></div>
        <div className="bg-blob bb2"></div>
        <div className="bg-blob bb3"></div>
      </div>

      <div className="card-wrap" style={{ zIndex: 1, width: 'min(640px, 94vw)' }}>
        {/* Navigation Tabs */}
        <div className="chips-container" style={{ marginBottom: '24px', justifyContent: 'center' }}>
          <button
            className={`niche-chip ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ padding: '8px 20px', border: 'none', background: 'transparent' }}
          >
            Edit Profile
          </button>
          <button
            className={`niche-chip ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
            style={{ padding: '8px 20px', border: 'none', background: 'transparent' }}
          >
            Change Password
          </button>
        </div>

        {/* Tab 1: Edit Profile */}
        {activeTab === 'profile' && (
          <div className="form-card" style={{ animation: 'cIn .4s var(--spring) both' }}>
            <h3 className="info-card-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
              Personal Details
            </h3>

            <form onSubmit={handleUpdateProfile}>
              {profileApiError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  color: 'var(--red)',
                  fontSize: '13.5px',
                  marginBottom: '20px'
                }}>
                  {profileApiError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  className={`f-input ${profileErrors.name ? 'err' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                />
                {profileErrors.name && <span className="err-msg">{profileErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  className={`f-input ${profileErrors.email ? 'err' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileLoading}
                />
                {profileErrors.email && <span className="err-msg">{profileErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-role">Account Role</label>
                <select
                  id="profile-role"
                  className="f-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={profileLoading}
                >
                  <option value="CREATOR">Content Creator</option>
                  <option value="BRAND">Brand Partner</option>
                </select>
              </div>

              <button type="submit" className="btn-send" disabled={profileLoading} style={{ marginTop: '10px' }}>
                {profileLoading ? <div className="spin"></div> : <span>Save Profile Details</span>}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <div className="form-card" style={{ animation: 'cIn .4s var(--spring) both' }}>
            <h3 className="info-card-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
              Security Settings
            </h3>

            <form onSubmit={handleUpdatePassword}>
              {passwordApiError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  color: 'var(--red)',
                  fontSize: '13.5px',
                  marginBottom: '20px'
                }}>
                  {passwordApiError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className={`f-input ${passwordErrors.currentPassword ? 'err' : ''}`}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                {passwordErrors.currentPassword && <span className="err-msg">{passwordErrors.currentPassword}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className={`f-input ${passwordErrors.newPassword ? 'err' : ''}`}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                {passwordErrors.newPassword && <span className="err-msg">{passwordErrors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`f-input ${passwordErrors.confirmPassword ? 'err' : ''}`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                {passwordErrors.confirmPassword && <span className="err-msg">{passwordErrors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn-send" disabled={passwordLoading} style={{ marginTop: '10px' }}>
                {passwordLoading ? <div className="spin"></div> : <span>Update Password</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
