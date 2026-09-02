import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function Navbar() {
  const { isAuthenticated, creatorProfile, user, accountType } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const usesLandingHeader = isHome || location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.FORGOT_PASSWORD || location.pathname === ROUTES.REGISTER;

  return (
    <nav className={usesLandingHeader ? 'home-navbar' : undefined}>
      <Link to={ROUTES.HOME} className="nav-logo">
        Nex<em>Up</em>
      </Link>

      <div className="nav-links">
        {isHome ? (
          <>
            <a href="#problem">the problem</a>
            <a href="#solve">what we do</a>
            <a href="#how">how it works</a>
          </>
        ) : (
          <>
            <Link to="/#problem">the problem</Link>
            <Link to="/#solve">what we do</Link>
            <Link to="/#how">how it works</Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {isAuthenticated ? (
          <Link to={accountType === 'CREATOR' ? ROUTES.CREATOR_PROFILE : ROUTES.BRAND} style={{ display: 'block', textDecoration: 'none' }}>
            {creatorProfile?.profilePicUrl || creatorProfile?.profilePicture ? (
              <img
                src={creatorProfile.profilePicUrl || creatorProfile.profilePicture}
                alt="Profile Avatar"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2.5px solid var(--lime)',
                  display: 'block',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            ) : (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--lime-tint)',
                  border: '2.5px solid var(--lime)',
                  color: 'var(--lime-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {user ? (user.fullName || user.fullName || user.full_name || user.name || 'U').charAt(0) : 'U'}
              </div>
            )}
          </Link>
        ) : (
          <Link to={ROUTES.LOGIN} className="btn btn-lime btn-sm">
            login{usesLandingHeader && <span aria-hidden="true">&nbsp; →</span>}
          </Link>
        )}
      </div>
    </nav>
  );
}
