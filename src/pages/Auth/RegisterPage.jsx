import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import '../../styles/PublicTheme.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);

  const [accountType, setAccountType] = useState(''); // Initialize empty to require explicit selection
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!accountType) {
      newErrors.accountType = 'Account type is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        fullName,
        email,
        password,
        accountType,
      };
      await authService.register(payload);
      notify({ message: 'Account registered! Please log in.', type: 'success' });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setApiError(err.response.data.message || err.response.data.error || 'Registration failed. Email might be in use.');
      } else {
        setApiError('Network connection failed. Please check if the backend is running.');
      }
      notify({ message: 'Registration Failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stage public-auth">
      {/* Background Blobs */}
      <div className="bg-wrap">
        <div className="bg-blob bb1"></div>
        <div className="bg-blob bb2"></div>
        <div className="bg-blob bb3"></div>
      </div>

      <div className="card-wrap">
        <div className="form-card" style={{ animation: 'cIn .5s var(--spring) both' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-.03em', marginBottom: '8px' }}>
              Create your account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Join the NexUp community and connect today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {apiError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--r-md)',
                padding: '12px 14px',
                color: 'var(--red)',
                fontSize: '13.5px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                {apiError}
              </div>
            )}

            {/* Account Type Selector at the top of the form */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Account Type</label>
              <div className="chips-container" style={{ display: 'flex', gap: '16px' }}>
                {/* Creator Card */}
                <div
                  onClick={() => setAccountType('CREATOR')}
                  style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: 'var(--r-md)',
                    border: accountType === 'CREATOR' ? '1.5px solid var(--lime)' : '1.5px solid var(--border)',
                    background: accountType === 'CREATOR' ? 'var(--lime-tint)' : 'var(--white)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (accountType !== 'CREATOR') {
                      e.currentTarget.style.borderColor = 'var(--lime)';
                      e.currentTarget.style.background = 'var(--lime-tint)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (accountType !== 'CREATOR') {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--white)';
                    }
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: accountType === 'CREATOR' ? '#ecfccb' : '#f3f4f6',
                    color: accountType === 'CREATOR' ? 'var(--lime-dark)' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--ink)' }}>Creator</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Join as a creator</div>
                  </div>
                  {accountType === 'CREATOR' && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#84cc16" />
                        <path d="M8 12.5l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Brand Card */}
                <div
                  onClick={() => setAccountType('BRAND')}
                  style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: 'var(--r-md)',
                    border: accountType === 'BRAND' ? '1.5px solid var(--lime)' : '1.5px solid var(--border)',
                    background: accountType === 'BRAND' ? 'var(--lime-tint)' : 'var(--white)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (accountType !== 'BRAND') {
                      e.currentTarget.style.borderColor = 'var(--lime)';
                      e.currentTarget.style.background = 'var(--lime-tint)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (accountType !== 'BRAND') {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--white)';
                    }
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: accountType === 'BRAND' ? '#ecfccb' : '#f3f4f6',
                    color: accountType === 'BRAND' ? 'var(--lime-dark)' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="9" y1="22" x2="9" y2="16" />
                      <line x1="15" y1="22" x2="15" y2="16" />
                      <line x1="9" y1="16" x2="15" y2="16" />
                      <path d="M8 6h2v2H8zm6 0h2v2h-2zm-6 5h2v2H8zm6 0h2v2h-2z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--ink)' }}>Brand</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Join as a brand</div>
                  </div>
                  {accountType === 'BRAND' && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#84cc16" />
                        <path d="M8 12.5l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {errors.accountType && <span className="err-msg" style={{ display: 'block', marginTop: '6px' }}>{errors.accountType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className={`f-input ${errors.fullName ? 'err' : ''}`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
              {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`f-input ${errors.email ? 'err' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`f-input ${errors.password ? 'err' : ''}`}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`f-input ${errors.confirmPassword ? 'err' : ''}`}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className="err-msg">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn-send" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? (
                <div className="spin"></div>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--muted)' }}>
              Already have an account?
            </span>
            <Link to={ROUTES.LOGIN} style={{
              color: 'var(--lime-dark)',
              fontWeight: 600,
              marginLeft: '5px',
              textDecoration: 'underline',
              fontSize: '13.5px'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
