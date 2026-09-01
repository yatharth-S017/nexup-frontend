import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/navigation/index.js';
import { ROUTES } from '../../constants/routes.js';
import { creatorAnalyticsService } from '../../services/creatorAnalyticsService.js';
import './CreatorHome.css';
import './CreatorHomeFixes.css';
import './CreatorHomeOverrides.css';

const Svg = ({ children, size = 23 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const Arrow = () => <Svg><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const metricIcons = ['◫', '✓', '☆', '➤'];
const guidance = [
  ['STRONG PROFILE', 'Show brands who you are, what you create and what makes your audience unique.', '♙'],
  ['RELEVANT CONTENT', 'Your niche and content style should clearly match the campaigns you apply for.', '▻'],
  ['AUTHENTIC AUDIENCE', 'Meaningful engagement and audience trust matter more than numbers alone.', '♧'],
  ['GREAT COLLABORATION', 'Clear communication, quality content and reliability help build lasting brand relationships.', '⌘'],
];
const metric = (data, keys) => keys.map((key) => data?.[key]).find((value) => value !== undefined && value !== null) ?? '—';

export default function CreatorHome() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => { creatorAnalyticsService.getCreatorAnalytics().then(setAnalytics).catch(() => setAnalytics({})); }, []);
  const metrics = [
    ['Active Applications', metric(analytics, ['activeApplications', 'applications']), 'Under review'],
    ['Selected Campaigns', metric(analytics, ['selectedCampaigns', 'activeCampaigns']), 'Currently active'],
    ['Completed Collaborations', metric(analytics, ['completedCollaborations', 'completedCampaigns']), 'Coming soon'],
    ['Opportunities Available', metric(analytics, ['opportunitiesAvailable', 'availableCampaigns']), 'New matches'],
  ];

  return <div className="creator-home-shell">
    <main className="creator-home-main">
      <section className="creator-welcome"><div className="creator-welcome-copy"><span className="creator-eyebrow">WELCOME BACK ✦</span><h1>Welcome back,<br /><em>Creator</em> <span>👋</span></h1><p>Discover campaigns that fit your content and turn your creativity into opportunities.</p><div className="creator-hero-actions"><Link className="creator-primary-action" to={ROUTES.CREATOR_CAMPAIGNS}>Explore Campaigns <Arrow /></Link><Link className="creator-secondary-action" to={ROUTES.CREATOR_APPLICATIONS}>View Applications</Link></div></div><div className="creator-visual" aria-hidden="true"><i className="creator-orbit orbit-a" /><i className="creator-orbit orbit-b" /><strong>P</strong><span className="f-one">✦</span><span className="f-two">♧</span><span className="f-three">⌁</span></div></section>
      <section className="creator-snapshot"><div className="creator-section-title"><div><h2>Creator Snapshot <em>✦</em></h2><p>Your activity overview at a glance.</p></div><Link to={ROUTES.CREATOR_ANALYTICS}>View detailed analytics <Arrow /></Link></div><div className="creator-metrics">{metrics.map(([label, value, status], index) => <article key={label}><b>{metricIcons[index]}</b><div><span>{label}</span><strong>{value}</strong><small>{status}</small></div></article>)}</div></section>
      <section className="creator-guidance"><span className="creator-eyebrow">✦ &nbsp; FOR CREATORS &nbsp; ✦</span><h2>What makes a creator <em>stand out?</em></h2><p>Follower count is only part of the story.<br />Brands look for creators who are relevant, authentic and reliable.</p><div className="creator-guidance-grid">{guidance.map(([title, copy, icon], index) => <article key={title}><span>0{index + 1}</span><b>{icon}</b><h3>{title}</h3><i /><p>{copy}</p></article>)}</div><div className="creator-profile-cta"><div><b>♙</b><h3>Make your profile <em>work for you.</em></h3><p>Keep your creator profile complete and up to date so brands can understand what makes you a great fit.</p></div><Link to={ROUTES.CREATOR_PROFILE}>View My Profile <Arrow /></Link></div></section>
    </main>
    <Footer><div className="creator-home-footer"><Link to={ROUTES.CREATOR_HOME}>Nex<em>Up</em></Link><span>Built for creators and the brands that believe in them.</span><Link to="/terms">Terms</Link></div></Footer>
  </div>;
  
}
