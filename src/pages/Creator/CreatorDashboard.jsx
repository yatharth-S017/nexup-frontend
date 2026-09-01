import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import CreatorProfile from './CreatorProfile.jsx';
import CreatorAnalyticsPage from './CreatorAnalyticsPage.jsx';
import SecurityPage from '../Security/SecurityPage.jsx';
import CreatorOnboarding from './CreatorOnboarding.jsx';
import { CreatorCampaignDetails, CreatorCampaignList } from './CreatorCampaigns.jsx';
import CreatorApplicationsWorkflow from './CreatorApplicationsWorkflow.jsx';
import CreatorHome from './CreatorHome.jsx';

const PersonIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0" /></svg>;
const AnalyticsIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10m5 10V4m5 16v-7m5 7V7" /></svg>;
const LockIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
const CampaignIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4M8 6v12M8 8c5 0 8-2 11-4v16c-3-2-6-4-11-4M4 14h4" /></svg>;
const FolderIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></svg>;

export default function CreatorDashboard() {
  const { creatorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const page = path === '/creator' || path === '/creator/home' ? 'home' : path.startsWith('/creator/campaigns') ? 'campaigns' : path === '/creator/my-campaigns' || path === '/creator/applications' ? 'my-campaigns' : path === '/creator/analytics' ? 'analytics' : path === '/creator/security' ? 'security' : activeTab;
  const open = (tab, route) => { setActiveTab(tab); navigate(route); };
  if (page === 'home') {
    return <CreatorHome />;
  }
  return <div className="stage creator-dark-theme creator-dashboard-shell" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'flex-start', padding: '40px 16px' }}>
    <div className="bg-wrap"><div className="bg-blob bb1" /><div className="bg-blob bb2" /><div className="bg-blob bb3" /></div>
    <div className="dashboard-layout" style={{ zIndex: 1, width: '100%' }}>
      <div className="dashboard-sidebar">
        <button className={`sidebar-tab ${page === 'profile' ? 'active' : ''}`} onClick={() => open('profile', '/creator/profile')}><PersonIcon />Creator Profile</button>
        <button className={`sidebar-tab ${page === 'campaigns' ? 'active' : ''}`} onClick={() => open('campaigns', '/creator/campaigns')}><CampaignIcon />Explore Campaigns</button>
        <button className={`sidebar-tab ${page === 'my-campaigns' ? 'active' : ''}`} onClick={() => open('my-campaigns', '/creator/my-campaigns')}><FolderIcon />My Campaigns</button>
        <button className={`sidebar-tab ${page === 'analytics' ? 'active' : ''}`} onClick={() => open('analytics', '/creator/analytics')}><AnalyticsIcon />Creator Analytics</button>
        <button className={`sidebar-tab ${page === 'security' ? 'active' : ''}`} onClick={() => open('security', '/creator/security')}><LockIcon />Security</button>
      </div>
      <div className="dashboard-content">
        {page === 'profile' && (creatorProfile ? <CreatorProfile /> : <CreatorOnboarding />)}
        {page === 'campaigns' && (path === '/creator/campaigns' ? <CreatorCampaignList /> : <CreatorCampaignDetails />)}
        {page === 'my-campaigns' && <CreatorApplicationsWorkflow />}
        {page === 'analytics' && <CreatorAnalyticsPage />}
        {page === 'security' && <SecurityPage />}
      </div>
    </div>
  </div>;
}
