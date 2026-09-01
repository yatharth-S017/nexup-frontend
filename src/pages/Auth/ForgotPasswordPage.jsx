import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { ROUTES } from '../../constants/routes.js';
import '../../styles/PublicTheme.css';

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

function friendlyError(error, fallback) {
  const message = String(error?.response?.data?.message || error?.response?.data?.error || '').toLowerCase();
  if (message.includes('expired')) return message.includes('token') ? 'Your password reset session has expired. Please start again.' : 'This verification code has expired. Please request a new one.';
  if (message.includes('otp') || message.includes('code') || message.includes('invalid')) return 'The verification code is incorrect. Please try again.';
  if (message.includes('email')) return 'Please enter a valid email address.';
  return fallback;
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  return `${name?.slice(0, 1) || ''}***@${domain || ''}`;
}

const fieldError = (message) => message && <span className="err-msg">{message}</span>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const sendOtp = async (event) => {
    event.preventDefault();
    setError('');
    if (!isEmail(email)) return setError('Please enter a valid email address.');
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (err) {
      setError(friendlyError(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const updateOtp = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const pasteOtp = (event) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    event.preventDefault();
    const next = Array(6).fill('');
    digits.split('').forEach((digit, index) => { next[index] = digit; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) return setError('Enter the complete 6-digit verification code.');
    setLoading(true);
    try {
      const response = await authService.verifyOtp(email, code);
      if (!response?.resetToken) throw new Error('Missing reset token');
      setResetToken(response.resetToken);
      setStep('password');
      setOtp(Array(6).fill(''));
    } catch (err) {
      setError(friendlyError(err, 'The verification code is incorrect. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');
    if (!newPassword) return setError('New password is required.');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
    if (!confirmPassword) return setError('Please confirm your new password.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (!resetToken) return setError('Your password reset session has expired. Please start again.');
    setLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      setResetToken(null);
      setNewPassword('');
      setConfirmPassword('');
      setStep('success');
    } catch (err) {
      setError(friendlyError(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const backToEmail = () => {
    setError('');
    setOtp(Array(6).fill(''));
    setStep('email');
  };

  const title = step === 'email' ? 'Forgot your password?' : step === 'otp' ? 'Verify your email' : step === 'password' ? 'Create a new password' : 'Password reset successfully';
  const subtitle = step === 'email' ? "Enter your email and we'll send you a verification code." : step === 'otp' ? `We sent a verification code to ${maskEmail(email)}` : step === 'password' ? 'Choose a strong password for your account.' : 'Your password has been updated. You can now sign in with your new password.';

  return (
    <div className="stage public-auth">
      <div className="bg-wrap"><div className="bg-blob bb1" /><div className="bg-blob bb2" /><div className="bg-blob bb3" /></div>
      <div className="card-wrap">
        <div className="form-card" style={{ animation: 'cIn .35s var(--spring) both', paddingTop: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-.03em', marginBottom: '8px' }}>{title}</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>{subtitle}</p>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, .08)', border: '1px solid rgba(239, 68, 68, .2)', borderRadius: 'var(--r-md)', padding: '10px 12px', color: 'var(--red)', fontSize: '13px', marginBottom: '18px' }}>{error}</div>}

          {step === 'email' && <form onSubmit={sendOtp}>
            <div className="form-group"><label className="form-label" htmlFor="reset-email">Email Address</label><input id="reset-email" className="f-input" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} autoComplete="email" /></div>
            <button className="btn-send" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}><Link to={ROUTES.LOGIN} style={{ color: 'var(--lime-dark)', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link></div>
          </form>}

          {step === 'otp' && <form onSubmit={verifyOtp}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '24px' }} onPaste={pasteOtp}>
              {otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} value={digit} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus(); }} inputMode="numeric" autoComplete="one-time-code" aria-label={`Verification code digit ${index + 1}`} maxLength="1" disabled={loading} className="f-input" style={{ textAlign: 'center', padding: '12px 0', fontSize: '20px', fontWeight: 600, minWidth: 0 }} />)}
            </div>
            <button className="btn-send" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}><button type="button" onClick={backToEmail} style={{ background: 'none', border: 0, color: 'var(--lime-dark)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, padding: 0 }}>Back</button><button type="button" onClick={sendOtp} disabled={loading} style={{ background: 'none', border: 0, color: 'var(--lime-dark)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, padding: 0 }}>Try again</button></div>
          </form>}

          {step === 'password' && <form onSubmit={resetPassword}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '-4px 0 18px' }}>Password must be at least 8 characters.</p>
            <div className="form-group"><label className="form-label" htmlFor="new-password">New Password</label><input id="new-password" className="f-input" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={loading} autoComplete="new-password" /></div>
            <div className="form-group"><label className="form-label" htmlFor="confirm-new-password">Confirm Password</label><input id="confirm-new-password" className="f-input" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={loading} autoComplete="new-password" /></div>
            <div style={{ display: 'flex', gap: '18px', margin: '-5px 0 20px', fontSize: '12px', color: 'var(--muted)' }}><label><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Show passwords</label><label><input type="checkbox" checked={showConfirmPassword} onChange={(event) => setShowConfirmPassword(event.target.checked)} /> Show confirm</label></div>
            <button className="btn-send" type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={backToEmail} style={{ background: 'none', border: 0, color: 'var(--lime-dark)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600 }}>Start over</button></div>
          </form>}

          {step === 'success' && <button className="btn-send" type="button" onClick={() => navigate(ROUTES.LOGIN)}>Back to Login</button>}
        </div>
      </div>
    </div>
  );
}
