import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { creatorService } from '../services/creatorService.js';

export default function CreatorGuard() {
  const { creatorProfile, updateCreatorProfile } = useAuth();
  const [checking, setChecking] = useState(!creatorProfile);

  useEffect(() => {
    if (creatorProfile) {
      setChecking(false);
      return;
    }

    async function checkProfile() {
      try {
        const profile = await creatorService.getCreatorProfile();
        updateCreatorProfile(profile);
      } catch (err) {
        console.error('Creator profile check error:', err);
      } finally {
        setChecking(false);
      }
    }

    checkProfile();
  }, [creatorProfile, updateCreatorProfile]);

  if (checking) {
    return (
      <div className="stage" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spin" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return <Outlet />;
}
