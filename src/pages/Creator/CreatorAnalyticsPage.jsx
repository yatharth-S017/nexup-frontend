import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { creatorAnalyticsService } from '../../services/creatorAnalyticsService.js';
import { campaignService } from '../../services/campaignService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import './CreatorAnalyticsPage.css';

const field = (data, ...keys) => keys.reduce((value, key) => value ?? data?.[key], undefined);
const number = (value) => value === undefined || value === null || value === '' ? '—' : new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1, notation: Math.abs(Number(value)) >= 100000 ? 'compact' : 'standard' }).format(Number(value));
const plainNumber = (value) => value === undefined || value === null || value === '' ? '—' : new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(Number(value));
const percent = (value) => value === undefined || value === null || value === '' ? '—' : `${Number(value).toFixed(2).replace(/\.00$/, '')}%`;
const date = (value) => { if (!value) return 'Not synced yet'; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); };
const Icon = ({ children }) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;

function metricData(data) {
  const metrics = data?.analytics ?? data;
  return {
    channelName: field(metrics, 'channelName', 'channelTitle', 'youtubeChannelName'),
    channelId: field(metrics, 'channelId', 'youtubeChannelId'),
    subscribers: field(metrics, 'subscriberCount', 'subscribers'), totalViews: field(metrics, 'totalViews', 'viewCount'), totalVideos: field(metrics, 'totalVideos', 'videoCount'),
    averageViews: field(metrics, 'averageViews', 'avgViews'), averageLikes: field(metrics, 'averageLikes', 'avgLikes'), averageComments: field(metrics, 'averageComments', 'avgComments'),
    averageViewDuration: field(metrics, 'averageViewDuration', 'avgViewDuration'), engagementRate: field(metrics, 'engagementRate'), lastSynced: field(metrics, 'lastSynced', 'lastSyncedAt', 'updatedAt')
  };
}

function hasAnalyticsData(data) {
  const metrics = metricData(data);
  return Object.values(metrics).some((value) => value !== undefined && value !== null && value !== '');
}

export function AnalyticsHeader({ lastSynced, refreshing, onRefresh }) { return <header className="creator-analytics-header"><div><h1>Creator Analytics</h1><p>Track your YouTube channel performance.</p></div><div className="creator-analytics-refresh"><span>Last synced: {date(lastSynced)}</span><button type="button" className="creator-analytics-primary" onClick={onRefresh} disabled={refreshing}>{refreshing ? <span className="spin" /> : <><Icon><path d="M20 11a8 8 0 1 0 2 5.3"/><path d="M20 4v7h-7"/></Icon>Refresh Analytics</>}</button></div></header>; }

export function AnalyticsCard({ icon, title, value, description }) { return <article className="analytics-stat-card"><div className="analytics-stat-icon">{icon}</div><div><p>{title}</p><strong>{value}</strong><span>{description}</span></div></article>; }
export function OverviewCards({ metrics }) { const cards = [
  ['Subscribers', number(metrics.subscribers), 'Current channel audience', <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></Icon>],
  ['Total Views', number(metrics.totalViews), 'All-time channel views', <Icon><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></Icon>],
  ['Total Videos', number(metrics.totalVideos), 'Published channel videos', <Icon><path d="M3 5h18v14H3z"/><path d="m10 9 5 3-5 3z"/></Icon>],
  ['Average Views', number(metrics.averageViews), 'Average views per video', <Icon><path d="M4 19V5m5 14v-7m5 7V8m5 11V3"/></Icon>],
  ['Average Likes', number(metrics.averageLikes), 'Average likes per video', <Icon><path d="M7 10v10H4V10h3Zm3 10V10l3-6c.6-1.2 2.4-.7 2.2.7L15 10h4.3a1.7 1.7 0 0 1 1.6 2.2l-1.3 6A2 2 0 0 1 17.7 20H10Z"/></Icon>],
  ['Average Comments', number(metrics.averageComments), 'Average comments per video', <Icon><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-4-.9L3 21l1.6-4A8.4 8.4 0 1 1 21 11.5Z"/></Icon>],
  ['Engagement Rate', percent(metrics.engagementRate), 'Likes and comments combined', <Icon><path d="m12 21-1.5-1.4C5.2 14.8 2 12 2 8.5A3.5 3.5 0 0 1 5.5 5c2 0 3.2 1.1 4 2.2C10.3 6.1 11.5 5 13.5 5A3.5 3.5 0 0 1 17 8.5c0 3.5-3.2 6.3-8.5 11.1L7 21Z"/></Icon>],
  ['Average View Duration', metrics.averageViewDuration ?? '—', 'Average watch time per view', <Icon><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>]
]; return <section className="analytics-overview-grid">{cards.map(([title, value, description, icon]) => <AnalyticsCard key={title} title={title} value={value} description={description} icon={icon} />)}</section>; }

export function ChannelInformation({ metrics }) { return <section className="analytics-panel"><div className="analytics-panel-heading"><div><h2>Channel Information</h2><p>Read-only details from your connected channel.</p></div><Icon><path d="M3 5h18v14H3z"/><path d="m10 9 5 3-5 3z"/></Icon></div><dl className="analytics-channel-info"><div><dt>Channel Name</dt><dd>{metrics.channelName || '—'}</dd></div><div><dt>Channel ID</dt><dd>{metrics.channelId || '—'}</dd></div><div><dt>Last Synced</dt><dd>{date(metrics.lastSynced)}</dd></div></dl></section>; }
export function AnalyticsDetails({ metrics }) { const items = [['Average Views', number(metrics.averageViews)], ['Average Likes', number(metrics.averageLikes)], ['Average Comments', number(metrics.averageComments)], ['Average View Duration', metrics.averageViewDuration ?? '—'], ['Engagement Rate', percent(metrics.engagementRate)]]; return <section className="analytics-panel"><div className="analytics-panel-heading"><div><h2>Analytics Details</h2><p>Average performance across your available channel data.</p></div><Icon><path d="M4 19V5m5 14v-7m5 7V8m5 11V3"/></Icon></div><div className="analytics-details-grid">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>; }
export function TrendPlaceholders() { return <section className="analytics-trends"><article><h2>Views Trend</h2><p>Historical analytics will be available after OAuth integration.</p><span>Coming Soon</span></article><article><h2>Engagement Trend</h2><p>See how your channel engagement changes over time.</p><span>Coming Soon</span></article></section>; }
export function AdvancedAnalytics() { const features = ['Audience Demographics', 'Traffic Sources', 'Returning Viewers', 'Watch Time Trends', 'CTR', 'Impressions']; return <section className="analytics-advanced"><div><h2>Advanced Analytics</h2><p>More YouTube insights will become available once OAuth is connected.</p></div><div className="analytics-advanced-grid">{features.map((feature) => <article key={feature}><span>Coming Soon</span><h3>{feature}</h3><p>Available with YouTube account connection.</p></article>)}</div></section>; }
export function OAuthCard() { return <section className="analytics-oauth"><div className="analytics-oauth-icon"><Icon><path d="M3 5h18v14H3z"/><path d="m10 9 5 3-5 3z"/></Icon></div><div><h2>Connect your YouTube Account</h2><p>Connect your YouTube account to unlock advanced analytics and historical trends.</p></div><button type="button" className="creator-analytics-primary" disabled>Coming Soon</button></section>; }
export function EmptyState({ onRefresh, refreshing, error }) { return <div className="analytics-empty"><div className="analytics-empty-icon"><Icon><path d="M4 19V5m5 14v-7m5 7V8m5 11V3"/></Icon></div><h2>We couldn't load your analytics.</h2><p>{error || 'Please refresh or verify your YouTube channel.'}</p><button type="button" className="creator-analytics-primary" onClick={onRefresh} disabled={refreshing}>{refreshing ? <span className="spin" /> : 'Refresh Analytics'}</button></div>; }
export function SkeletonLoader() { return <div className="analytics-skeleton" aria-label="Loading analytics"><div className="analytics-skeleton-header skeleton" /><div className="analytics-skeleton-cards">{Array.from({ length: 8 }, (_, index) => <div className="skeleton" key={index} />)}</div><div className="analytics-skeleton-panels"><div className="skeleton" /><div className="skeleton" /></div></div>; }

export default function CreatorAnalyticsPage({ creatorId = null }) {
  const { notify } = useContext(NotificationContext); const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData(creatorId ? await campaignService.getCreatorAnalytics(creatorId) : await creatorAnalyticsService.getCreatorAnalytics()); } catch (err) { setError(err.response?.data?.message || 'Please refresh or verify your YouTube channel.'); } finally { setLoading(false); } }, [creatorId]);
  useEffect(() => { load(); }, [load]);
  const refresh = async () => { if (creatorId) return load(); setRefreshing(true); setError(''); try { const refreshed = await creatorAnalyticsService.refreshCreatorAnalytics(); const nextData = refreshed?.analytics ?? refreshed; setData(hasAnalyticsData(nextData) ? nextData : await creatorAnalyticsService.getCreatorAnalytics()); notify({ message: 'Analytics refreshed successfully', type: 'success' }); } catch (err) { const message = err.response?.data?.message || 'Unable to refresh analytics. Please try again.'; setError(message); notify({ message, type: 'error' }); } finally { setRefreshing(false); } };
  const metrics = useMemo(() => metricData(data), [data]); if (loading) return <SkeletonLoader />;
  return <div className="creator-analytics-page"><AnalyticsHeader lastSynced={metrics.lastSynced} refreshing={refreshing} onRefresh={refresh} /><section className="analytics-welcome"><div className="analytics-welcome-icon"><Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/></Icon></div><div><h2>Your analytics, your growth.</h2><p>Your analytics help brands better understand your channel and increase collaboration opportunities.</p></div></section>{!hasAnalyticsData(data) ? <EmptyState onRefresh={refresh} refreshing={refreshing} error={error} /> : <><section className="analytics-section-title"><h2>Overview</h2><p>Current channel performance from your latest sync.</p></section><OverviewCards metrics={metrics} /><div className="analytics-content-grid"><AnalyticsDetails metrics={metrics} /><ChannelInformation metrics={metrics} /></div><TrendPlaceholders /><AdvancedAnalytics /><OAuthCard /></>}</div>;
}
