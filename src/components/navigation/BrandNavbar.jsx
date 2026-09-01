import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import './BrandNavbar.css';

export default function BrandNavbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const initial = (user?.fullName || user?.name || 'Brand').charAt(0);
  return <header className="brand-nav-wrap"><nav className="brand-nav"><Link className="brand-nav-logo" to="/brand">NexUp</Link><div className="brand-nav-links"><Link className={pathname.startsWith('/brand/campaigns') ? 'active' : ''} to="/brand/campaigns">Campaigns</Link><Link className={pathname.startsWith('/brand/discover-creators') ? 'active' : ''} to="/brand/discover-creators">Discover Creators</Link></div><div className="brand-nav-actions"><Link className="brand-avatar" to="/brand/profile" aria-label="Open brand profile" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>{initial}</Link></div></nav></header>;
}
