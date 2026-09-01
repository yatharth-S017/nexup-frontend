import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { userService } from '../../services/userService.js';
import { creatorService } from '../../services/creatorService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import CreatorPage from '../Creator/CreatorPage.jsx';

const NICHES = [
  'lifestyle', 'tech', 'gaming', 'beauty', 'fashion', 'fitness', 'food & cooking',
  'travel', 'finance', 'education', 'music', 'comedy', 'vlogging', 'photography',
  'art & design', 'sports', 'coding', 'study with me', 'motivation', 'anime',
  'skincare', 'DIY & craft', 'dance', 'business', 'books', 'movies & series',
  'mental health', 'news & current affairs', 'sustainable living', 'pets', 'college', 'iit', 'jee', 'competetive exams'
];

export default function DashboardPage() {
  const { user, creatorProfile, logout, updateUser, updateCreatorProfile } = useAuth();
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onboardingCompleted = creatorProfile && (creatorProfile.onboardingCompleted === true || creatorProfile.onboardingCompleted === 'true');
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'creator' | 'security'
  const [profileLoading, setProfileLoading] = useState(false);

  // Creator Profile Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editInstagramProfileUrl, setEditInstagramProfileUrl] = useState('');
  const [editYoutubeChannelUrl, setEditYoutubeChannelUrl] = useState('');
  const [editNiches, setEditNiches] = useState([]);
  const [editState, setEditState] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCurrentChallenge, setEditCurrentChallenge] = useState('');
  const [editExpectedSupport, setEditExpectedSupport] = useState('');
  const [nicheQuery, setNicheQuery] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Query parameter listener to set tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['account', 'creator', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Fetch creator profile when Creator tab is active
  useEffect(() => {
    if (activeTab === 'creator') {
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          const profile = await creatorService.getCreatorProfile();
          console.log('GET /api/creator/profile response:', profile);
          updateCreatorProfile(profile);
        } catch (err) {
          console.warn('Failed to fetch creator profile on tab load:', err);
          updateCreatorProfile(null);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [activeTab]);

  // Tab 1: Account state
  const [accountName, setAccountName] = useState(user?.fullName || user?.fullName || user?.full_name || user?.name || '');
  const [accountEmail, setAccountEmail] = useState(user?.email || '');
  const [accountRole, setAccountRole] = useState(user?.role || 'CREATOR');
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountErrors, setAccountErrors] = useState({});
  const [accountApiError, setAccountApiError] = useState('');

  // Tab 3: Security / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityErrors, setSecurityErrors] = useState({});
  const [securityApiError, setSecurityApiError] = useState('');

  // Prefill account info when user is loaded/changed
  useEffect(() => {
    if (user) {
      setAccountName(user.fullName || user.fullName || user.full_name || user.name || '');
      setAccountEmail(user.email || '');
      setAccountRole(user.role || 'CREATOR');
    }
  }, [user]);

  // Handle Account update
  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setAccountApiError('');
    const errors = {};
    if (!accountName.trim()) errors.name = 'Username is required';
    setAccountErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAccountLoading(true);
    try {
      const updated = await userService.updateProfile({
        name: accountName,
        fullName: accountName,
        fullName: accountName,
        full_name: accountName,
        email: accountEmail,
        role: accountRole
      });
      updateUser(updated);
      notify({ message: 'Username updated successfully', type: 'success' });
    } catch (err) {
      console.error(err);
      setAccountApiError(err.response?.data?.message || 'Failed to update username details.');
      notify({ message: 'Update failed', type: 'error' });
    } finally {
      setAccountLoading(false);
    }
  };

  // Handle Security / Password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityApiError('');
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setSecurityErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSecurityLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword, confirmPassword });
      notify({ message: 'Password updated successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setSecurityApiError(err.response?.data?.message || 'Password update failed. Verify current password.');
      notify({ message: 'Password change failed', type: 'error' });
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    notify({ message: 'Logged out successfully', type: 'success' });
    navigate(ROUTES.HOME);
  };

  const handleStartEdit = () => {
    if (!creatorProfile) return;
    setEditDisplayName(creatorProfile.displayName || '');
    setEditPhoneNumber(creatorProfile.phoneNumber || '');
    setEditInstagramProfileUrl(creatorProfile.instagramProfileUrl || creatorProfile.instagramUrl || '');
    setEditYoutubeChannelUrl(creatorProfile.youtubeChannelUrl || creatorProfile.youtubeUrl || '');
    setEditNiches(creatorProfile.niches || []);
    setEditState(creatorProfile.state || '');
    setEditCity(creatorProfile.city || '');
    setEditCurrentChallenge(creatorProfile.currentChallenge || '');
    setEditExpectedSupport(creatorProfile.expectedSupport || '');
    setNicheQuery('');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editDisplayName.trim()) {
      notify({ message: 'Display Name is required', type: 'error' });
      return;
    }
    if (!editPhoneNumber.trim()) {
      notify({ message: 'Phone Number is required', type: 'error' });
      return;
    }
    const cleanPhone = editPhoneNumber.replace(/[\s\-+()]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      notify({ message: 'Enter a valid 10-digit Indian phone number', type: 'error' });
      return;
    }
    if (editNiches.length === 0) {
      notify({ message: 'Select at least 1 niche', type: 'error' });
      return;
    }
    if (!editState.trim()) {
      notify({ message: 'State is required', type: 'error' });
      return;
    }
    if (!editCity.trim()) {
      notify({ message: 'City is required', type: 'error' });
      return;
    }

    const payload = {
      displayName: editDisplayName.trim(),
      phoneNumber: editPhoneNumber.trim(),
      youtubeChannelUrl: editYoutubeChannelUrl.trim(),
      instagramProfileUrl: editInstagramProfileUrl.trim(),
      niches: editNiches,
      state: editState.trim(),
      city: editCity.trim(),
      currentChallenge: editCurrentChallenge.trim(),
      expectedSupport: editExpectedSupport.trim(),
      startingPrice: creatorProfile?.startingPrice || creatorProfile?.pitchAmount || 0
    };

    setEditLoading(true);
    try {
      const saved = await creatorService.updateCreatorProfile(payload);
      updateCreatorProfile(saved);
      setIsEditing(false);
      notify({ message: 'Changes saved successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      notify({ message: err.response?.data?.message || 'Failed to update profile changes.', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const renderLocation = () => {
    const city = creatorProfile?.city?.trim();
    const state = creatorProfile?.state?.trim();
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Not Provided';
  };

  const getCleanUrl = (url, type) => {
    if (!url) return null;
    let val = url.trim();
    if (/^https?:\/\//i.test(val)) {
      return val;
    }
    if (val.toLowerCase().startsWith('instagram.com/') || val.toLowerCase().startsWith('youtube.com/') || val.toLowerCase().startsWith('youtu.be/')) {
      return `https://${val}`;
    }
    const cleanHandle = val.replace('@', '').trim();
    if (!cleanHandle) return null;
    if (type === 'instagram') {
      return `https://instagram.com/${cleanHandle}`;
    }
    if (type === 'youtube') {
      return `https://youtube.com/@${cleanHandle}`;
    }
    return `https://${val}`;
  };

  const cleanInstagramUrl = getCleanUrl(creatorProfile?.instagramProfileUrl || creatorProfile?.instagramUrl, 'instagram');
  const cleanYoutubeUrl = getCleanUrl(creatorProfile?.youtubeChannelUrl || creatorProfile?.youtubeUrl, 'youtube');

  if (!user) return null;

  return (
    <div className="stage" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'flex-start', padding: '40px 16px' }}>
      {/* Background Blobs */}
      <div className="bg-wrap">
        <div className="bg-blob bb1"></div>
        <div className="bg-blob bb2"></div>
        <div className="bg-blob bb3"></div>
      </div>

      <div className="dashboard-layout" style={{ zIndex: 1 }}>
        {/* Sidebar / Left Navigation */}
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Settings
          </button>
          
          <button
            className={`sidebar-tab ${activeTab === 'creator' ? 'active' : ''}`}
            onClick={() => setActiveTab('creator')}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Creator Profile
          </button>

          <button
            className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security & 2FA
          </button>

          <button
            className="sidebar-tab"
            onClick={handleLogoutClick}
            style={{ color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout Account
          </button>
        </div>

        {/* Content Area / Selected Tab */}
        <div className="dashboard-content">
          {/* TAB 1: Account Info */}
          {activeTab === 'account' && (
            <div className="form-card" style={{ animation: 'cIn .35s var(--spring) both' }}>
              <h3 className="info-card-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
                Account Settings
              </h3>

              <form onSubmit={handleAccountUpdate}>
                {accountApiError && <div className="err-msg" style={{ marginBottom: '16px' }}>{accountApiError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="acc-username">Change Username</label>
                  <input
                    id="acc-username"
                    type="text"
                    className={`f-input ${accountErrors.name ? 'err' : ''}`}
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    disabled={accountLoading}
                  />
                  {accountErrors.name && <span className="err-msg">{accountErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="acc-email">Email Address</label>
                  <input
                    id="acc-email"
                    type="email"
                    className="f-input"
                    value={accountEmail}
                    disabled={true}
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px', display: 'block' }}>
                    * Changing registered email address support coming in a future update.
                  </span>
                </div>

                <button type="submit" className="btn-send" disabled={accountLoading} style={{ marginTop: '10px' }}>
                  {accountLoading ? <div className="spin"></div> : <span>Update Account</span>}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Creator Profile Info */}
          {activeTab === 'creator' && (
            profileLoading ? (
              <div className="form-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
                <div className="spin"></div>
              </div>
            ) : onboardingCompleted ? (
              isEditing ? (
                <div className="form-card" style={{ animation: 'cIn .35s var(--spring) both' }}>
                  {/* Edit Mode Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '24px' }}>
                    <h3 className="info-card-title" style={{ margin: 0 }}>
                      Edit Creator Profile
                    </h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ margin: 0 }}
                        onClick={() => setIsEditing(false)}
                        disabled={editLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-lime btn-sm"
                        style={{ margin: 0 }}
                        onClick={handleSaveEdit}
                        disabled={editLoading}
                      >
                        {editLoading ? <div className="spin" style={{ width: '14px', height: '14px' }}></div> : <span>Save Changes</span>}
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Basic Information */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Basic Information
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Display Name</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Phone Number</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editPhoneNumber}
                          onChange={(e) => setEditPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Email Address (Read-Only)</label>
                        <input
                          type="text"
                          className="f-input"
                          value={user?.email || ''}
                          disabled
                          style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>State</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>City</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 2: Social Links */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Social Links
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Instagram URL</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editInstagramProfileUrl}
                          onChange={(e) => setEditInstagramProfileUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>YouTube URL</label>
                        <input
                          type="text"
                          className="f-input"
                          value={editYoutubeChannelUrl}
                          onChange={(e) => setEditYoutubeChannelUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 3: Content Niches */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Content
                    </h4>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px', fontWeight: 500 }}>Content Niches</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {editNiches.map((n) => (
                          <span
                            key={n}
                            className="tag-pill"
                            style={{ margin: 0, background: 'var(--lime-tint)', borderColor: 'var(--lime)', color: 'var(--lime-dark)', cursor: 'pointer' }}
                            onClick={() => setEditNiches(editNiches.filter((item) => item !== n))}
                          >
                            {n} &times;
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="f-input"
                        placeholder="Type to search and add niche..."
                        value={nicheQuery}
                        onChange={(e) => setNicheQuery(e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      {nicheQuery && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '100px', overflowY: 'auto', padding: '4px', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                          {NICHES.filter(n => n.toLowerCase().includes(nicheQuery.toLowerCase()) && !editNiches.includes(n)).slice(0, 10).map((n) => (
                            <span
                              key={n}
                              className="niche-chip"
                              style={{ margin: 0, cursor: 'pointer' }}
                              onClick={() => {
                                if (editNiches.length >= 5) {
                                  notify({ message: 'Maximum 5 niches allowed', type: 'error' });
                                  return;
                                }
                                setEditNiches([...editNiches, n]);
                                setNicheQuery('');
                              }}
                            >
                              + {n}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 4: Creator Journey */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Creator Journey
                    </h4>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Current Challenge</label>
                      <textarea
                        className="f-textarea"
                        value={editCurrentChallenge}
                        onChange={(e) => setEditCurrentChallenge(e.target.value)}
                        style={{ minHeight: '100px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Expected Support</label>
                      <textarea
                        className="f-textarea"
                        value={editExpectedSupport}
                        onChange={(e) => setEditExpectedSupport(e.target.value)}
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-card" style={{ animation: 'cIn .35s var(--spring) both' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 className="info-card-title" style={{ margin: 0 }}>
                        Creator Profile
                      </h3>
                      <span className="cta-badge" style={{ margin: 0, background: 'var(--lime-tint)', color: 'var(--lime-dark)', borderColor: 'var(--lime)' }}>
                        Creator Onboarding Completed
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-lime btn-sm"
                      style={{ margin: 0 }}
                      onClick={handleStartEdit}
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Section 1: Basic Information */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Basic Information
                    </h4>
                    
                    {/* Avatar & Info Row */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'var(--lime-tint)',
                        border: '2px solid var(--lime)',
                        color: 'var(--lime-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '24px',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        {creatorProfile.displayName ? creatorProfile.displayName.charAt(0) : (user?.fullName || user?.full_name || user?.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, marginBottom: '2px' }}>Display Name</div>
                        <h5 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                          {creatorProfile.displayName || 'Not Provided'}
                        </h5>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Email Address</label>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{user?.email || 'Not Provided'}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Phone Number</label>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{creatorProfile.phoneNumber || 'Not Provided'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Location</label>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{renderLocation()}</div>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 2: Social Links */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Social Links
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Instagram</label>
                        {cleanInstagramUrl ? (
                          <a href={cleanInstagramUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--lime-dark)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                            {cleanInstagramUrl}
                          </a>
                        ) : (
                          <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--muted)' }}>Not Provided</span>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>YouTube</label>
                        {cleanYoutubeUrl ? (
                          <a href={cleanYoutubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--lime-dark)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                            {cleanYoutubeUrl}
                          </a>
                        ) : (
                          <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--muted)' }}>Not Provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 3: Content */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Content
                    </h4>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px', fontWeight: 500 }}>Content Niches</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {Array.isArray(creatorProfile.niches) && creatorProfile.niches.length > 0 ? (
                          creatorProfile.niches.map((n) => (
                            <span key={n} className="tag-pill" style={{ margin: 0, background: 'var(--white)', border: '1.5px solid var(--border)', color: 'var(--ink)' }}>
                              {n}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--muted)' }}>Not Provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '24px 0' }} />

                  {/* Section 4: Creator Journey */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Creator Journey
                    </h4>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Current Challenge</label>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.02)',
                        padding: '14px 16px',
                        borderRadius: 'var(--r-md)',
                        border: '1.5px solid var(--border)',
                        color: 'var(--ink)',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {creatorProfile.currentChallenge || 'Not Provided'}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Expected Support</label>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.02)',
                        padding: '14px 16px',
                        borderRadius: 'var(--r-md)',
                        border: '1.5px solid var(--border)',
                        color: 'var(--ink)',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {creatorProfile.expectedSupport || 'Not Provided'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <CreatorPage onComplete={(saved) => updateCreatorProfile(saved)} />
            )
          )}

          {/* TAB 3: Security details */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-card" style={{ animation: 'cIn .35s var(--spring) both' }}>
                <h3 className="info-card-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
                  Change Password
                </h3>

                <form onSubmit={handlePasswordUpdate}>
                  {securityApiError && <div className="err-msg" style={{ marginBottom: '16px' }}>{securityApiError}</div>}

                  <div className="form-group">
                    <label className="form-label" htmlFor="sec-current">Current Password</label>
                    <input
                      id="sec-current"
                      type="password"
                      className={`f-input ${securityErrors.currentPassword ? 'err' : ''}`}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={securityLoading}
                    />
                    {securityErrors.currentPassword && <span className="err-msg">{securityErrors.currentPassword}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sec-new">New Password</label>
                    <input
                      id="sec-new"
                      type="password"
                      className={`f-input ${securityErrors.newPassword ? 'err' : ''}`}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={securityLoading}
                    />
                    {securityErrors.newPassword && <span className="err-msg">{securityErrors.newPassword}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sec-confirm">Confirm Password</label>
                    <input
                      id="sec-confirm"
                      type="password"
                      className={`f-input ${securityErrors.confirmPassword ? 'err' : ''}`}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={securityLoading}
                    />
                    {securityErrors.confirmPassword && <span className="err-msg">{securityErrors.confirmPassword}</span>}
                  </div>

                  <button type="submit" className="btn-send" disabled={securityLoading} style={{ marginTop: '10px' }}>
                    {securityLoading ? <div className="spin"></div> : <span>Save Password</span>}
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication Placeholder */}
              <div className="info-card" style={{ animation: 'cIn .45s var(--spring) both' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Two-Factor Authentication (2FA)
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Enhance your Account security by adding code confirmation requirements alongside passwords. Two-Factor Authentication via authenticator apps is currently under development.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
