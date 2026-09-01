import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

export default function DashboardHome() {
  const { user, accountType } = useAuth();
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (accountType === 'CREATOR') {
      navigate('/creator/profile');
    } else {
      navigate('/brand');
    }
  };

  return (
    <div style={{ animation: 'cIn .35s var(--spring) both', maxWidth: '800px', margin: '0 auto' }}>
      <div className="profile-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
        <span className="cta-badge" style={{ marginBottom: '12px' }}>dashboard home</span>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px', marginTop: 0 }}>
          Welcome back, {user?.fullName || 'User'}!
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 28px' }}>
          Manage your matches, review campaigns, and update your configuration settings directly from your dashboard.
        </p>

        <button
          type="button"
          className="btn btn-lime"
          style={{ margin: 0, padding: '12px 28px', fontSize: '15px' }}
          onClick={handleActionClick}
        >
          {accountType === 'CREATOR' ? 'Go to Creator Profile' : 'Go to Brand Profile'}
        </button>
      </div>

      {accountType === 'CREATOR' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="profile-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => navigate('/creator/analytics')}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
              View Analytics
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
              Check your platform matches, stats, and campaigns metrics.
            </p>
          </div>

          <div className="profile-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => navigate('/security')}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Settings
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
              Update your account password and configurations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
