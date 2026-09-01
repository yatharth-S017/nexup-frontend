import CreatorPage from './CreatorPage.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const { updateCreatorProfile } = useAuth();

  return (
    <CreatorPage
      onComplete={(saved) => {
        updateCreatorProfile(saved);
        navigate('/creator/profile');
      }}
    />
  );
}
