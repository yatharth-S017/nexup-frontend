import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import './CreatorHeader.css';

export default function CreatorHeader() {
  const { pathname } = useLocation();
  const campaignsActive = pathname.startsWith('/creator/campaigns');
  const applicationsActive = pathname === ROUTES.CREATOR_APPLICATIONS || pathname === ROUTES.CREATOR_MY_CAMPAIGNS;

  return <header className="creator-header">
    <Link to={ROUTES.CREATOR_HOME} className="creator-header-logo">NexUp</Link>
    <nav className="creator-header-nav" aria-label="Creator navigation">
      <Link className={campaignsActive ? 'active' : ''} to={ROUTES.CREATOR_CAMPAIGNS}>Explore Campaigns</Link>
      <Link className={applicationsActive ? 'active' : ''} to={ROUTES.CREATOR_APPLICATIONS}>My Applications</Link>
    </nav>
    <div className="creator-header-actions"><Link className="creator-header-avatar" to={ROUTES.CREATOR_PROFILE}>C</Link></div>
  </header>;
}
