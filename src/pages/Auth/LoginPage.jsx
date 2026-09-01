import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import '../../styles/PublicTheme.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
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
      const data = await authService.login(email, password);
      // Expected backend response: { token, name, email, role, accountType }
      if (data && data.token) {
        const userObj = {
          fullName: data.name,
          email: data.email,
          role: data.role,
        };
        login(data.token, userObj, data.accountType);
        notify({ message: 'Login Successful', type: 'success' });

        navigate(data.accountType === 'CREATOR' ? ROUTES.CREATOR_HOME : ROUTES.BRAND_HOME);
      } else {
        throw new Error('Authentication response is missing the token');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Display backend validation or error messages
        setApiError(err.response.data.message || err.response.data.error || 'Invalid credentials. Please try again.');
      } else {
        setApiError('Network connection failed. Please check if the backend is running.');
      }
      notify({ message: 'Login Failed', type: 'error' });
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
        <div className="form-card" style={{ animation: 'cIn .5s var(--spring) both', paddingTop: '22px' }}>
          <div style={{ textAlign: 'center', marginBottom: 0 }}>
            <h2 style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-.03em', marginBottom: '8px' }}>
              Welcome back to Nex<em>Up</em>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Sign in to manage your creator matches and brand deals
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: '42px' }}
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', padding: 0, border: 0, background: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                  {showPassword ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c4.5 0 8.3 3 9.5 8a10.6 10.6 0 0 1-3.1 4.8M6.2 6.2A10.6 10.6 0 0 0 2.5 12C3.7 17 7.5 20 12 20c1 0 2-.2 2.9-.5" /></svg> : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C3.7 7 7.5 4 12 4s8.3 3 9.5 8c-1.2 5-5 8-9.5 8s-8.3-3-9.5-8Z" /><circle cx="12" cy="12" r="3" /></svg>}
                </button>
              </div>
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
              <Link to={ROUTES.FORGOT_PASSWORD} style={{ color: 'var(--lime-dark)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-send" disabled={loading}>
              {loading ? (
                <div className="spin"></div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--muted)' }}>
              New to NexUp?
            </span>
            <Link to={ROUTES.REGISTER} style={{
              color: 'var(--lime-dark)',
              fontWeight: 600,
              marginLeft: '5px',
              textDecoration: 'underline',
              fontSize: '13.5px'
            }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
