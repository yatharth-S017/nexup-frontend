import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { brandService } from '../services/brandService.js';
import { isProfileMissing } from '../utils/helpers.js';

export default function BrandGuard() {
  const { brandProfile, updateBrandProfile } = useAuth();
  const [checking, setChecking] = useState(!brandProfile);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (brandProfile) {
      setChecking(false);
      return;
    }

    async function checkProfile() {
      try {
        const profile = await brandService.getBrandProfile();
        updateBrandProfile(profile);
      } catch (err) {
        console.error('Brand profile check error:', err);
        if (isProfileMissing(err)) {
          setError(true);
        }
      } finally {
        setChecking(false);
      }
    }

    checkProfile();
  }, [brandProfile, updateBrandProfile]);

  if (checking) {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spin" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (error) {
    return <Navigate to="/brand/profile/create" replace />;
  }

  return <Outlet />;
}
