import { createContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken, clearAuthToken } from '../utils/token.js';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pipeup.authToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('pipeup.user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [accountType, setAccountType] = useState(() => localStorage.getItem('pipeup.accountType') || null);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync token helper with axios interceptor token state
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      clearAuthToken();
    }
  }, [token]);

  // Listen for global logout events (dispatched by axios interceptor on 401/403)
  useEffect(() => {
    const handleLogoutEvent = () => {
      handleLogout();
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const handleLogin = (tokenVal, userData, accountTypeVal) => {
    localStorage.setItem('pipeup.authToken', tokenVal);
    localStorage.setItem('pipeup.user', JSON.stringify(userData));
    localStorage.setItem('pipeup.accountType', accountTypeVal);
    setToken(tokenVal);
    setUser(userData);
    setAccountType(accountTypeVal);
    setCreatorProfile(null);
    setBrandProfile(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('pipeup.authToken');
    localStorage.removeItem('pipeup.user');
    localStorage.removeItem('pipeup.accountType');
    setToken(null);
    setUser(null);
    setAccountType(null);
    setCreatorProfile(null);
    setBrandProfile(null);
    clearAuthToken();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      accountType,
      creatorProfile,
      brandProfile,
      loading,
      isAuthenticated: Boolean(token),
      login: handleLogin,
      logout: handleLogout,
      updateUser: (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('pipeup.user', JSON.stringify(updatedUser));
      },
      updateCreatorProfile: (profile) => setCreatorProfile(profile),
      updateBrandProfile: (profile) => setBrandProfile(profile),
    }),
    [token, user, accountType, creatorProfile, brandProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
