import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandProfile from './BrandProfile.jsx';
import BrandCampaignCreatePage from './campaigns/BrandCampaignCreatePage.jsx';
import BrandCampaignDetailsPage from './campaigns/BrandCampaignDetailsPage.jsx';
import BrandCampaignEditPage from './campaigns/BrandCampaignEditPage.jsx';
import BrandCampaignListPage from './campaigns/BrandCampaignListPage.jsx';
import BrandSecurityPage from './BrandSecurityPage.jsx';
import BrandHome from './BrandHome.jsx';
import DiscoverCreatorsPage from './DiscoverCreatorsPage.jsx';

const ProfileIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0" /></svg>;
const CampaignIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.9v13.3a1.8 1.8 0 0 1-3.4.6l-2.2-6.1M18 13a3 3 0 1 0 0-6M5.4 13.7A4 4 0 0 1 7 6h1.8c4.1 0 7.6-1.2 9.2-3v14c-1.6-1.8-5.1-3-9.2-3H7a4 4 0 0 1-1.6-.3Z" /></svg>;
const SecurityIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
const DiscoverIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /><path d="M11 8v6M8 11h6" /></svg>;

export default function BrandDashboard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const securityOpen = pathname === '/brand/security';
  const campaignsOpen = pathname.startsWith('/brand/campaigns');
  const discoveryOpen = pathname === '/brand/discover-creators';
  const openTab = (tab) => { setActiveTab(tab); navigate('/brand'); };

  const renderContent = () => {
    if (securityOpen) return <BrandSecurityPage />;
    if (discoveryOpen) return <DiscoverCreatorsPage />;
    if (campaignsOpen) {
      if (pathname.endsWith('/new') || pathname.endsWith('/create')) return <BrandCampaignCreatePage />;
      if (pathname.endsWith('/edit')) return <BrandCampaignEditPage />;
      if (pathname !== '/brand/campaigns') return <BrandCampaignDetailsPage />;
      return <BrandCampaignListPage />;
    }
    if (pathname === '/brand' || pathname === '/brand/home') return <BrandHome />;
    return (
      <>
        {activeTab === 'profile' && <BrandProfile />}
        {activeTab === 'campaigns' && <BrandCampaignListPage />}
      </>
    );
  };

  if (pathname === '/brand' || pathname === '/brand/home') return renderContent();
  return <div className="stage brand-dashboard-stage" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'flex-start', padding: '40px 16px' }}>
    <div className="bg-wrap"><div className="bg-blob bb1" /><div className="bg-blob bb2" /><div className="bg-blob bb3" /></div>
    <div className="dashboard-layout" style={{ zIndex: 1, width: '100%' }}>
      <div className="dashboard-sidebar">
        <button className={`sidebar-tab ${!securityOpen && !campaignsOpen && activeTab === 'profile' ? 'active' : ''}`} onClick={() => openTab('profile')}><ProfileIcon />Brand Profile</button>
        <button className={`sidebar-tab ${campaignsOpen || (!securityOpen && activeTab === 'campaigns') ? 'active' : ''}`} onClick={() => navigate('/brand/campaigns')}><CampaignIcon />Campaigns</button>
        <button className={`sidebar-tab ${discoveryOpen ? 'active' : ''}`} onClick={() => navigate('/brand/discover-creators')}><DiscoverIcon />Discover Creators</button>
        <button className={`sidebar-tab ${securityOpen ? 'active' : ''}`} onClick={() => navigate('/brand/security')}><SecurityIcon />Security</button>
      </div>
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  </div>;
}
