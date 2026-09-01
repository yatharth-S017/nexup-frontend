import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService.js';
import { ApplicationStatusBadge } from './CreatorCampaigns.jsx';
import './CreatorApplications.css';

const items = (value) => Array.isArray(value) ? value : [];
const keyOf = (app) => app.applicationId || app.id || app.campaignId;
const statusOf = (app) => String(app?.status || app?.applicationStatus || 'PENDING').toUpperCase();
const submissionUrlOf = (app) => app?.submissionUrl || app?.videoUrl || app?.contentUrl || app?.submittedUrl || app?.contentSubmissionUrl || app?.submission?.submissionUrl || app?.submission?.videoUrl || app?.submission?.url || '';
const submittedAtOf = (app) => app?.submittedAt || app?.submission?.submittedAt;
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Recently';
const errorMessage = (error) => error?.response?.data?.message || error?.response?.data?.error || 'Unable to submit your content. Please try again.';

export default function CreatorApplicationsWorkflow() {
  const [apps, setApps] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); try { setApps(items(await campaignService.getCreatorApplications())); setError(''); } catch { setError('Unable to load your applications.'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <div className="creator-detail-loading">Loading applications…</div>;
  if (error) return <div className="creator-campaign-state"><p>{error}</p><button className="btn-send" onClick={load}>Try again</button></div>;
  return <section className="creator-applications"><header className="creator-marketplace-heading"><span className="creator-eyebrow">Your opportunities</span><h1>My applications</h1><p>Track every campaign you’ve applied to and its current review status.</p></header><div className="creator-applications-grid">{apps.map(app => { const id = keyOf(app); const submissionUrl = submissionUrlOf(app); const submittedAt = submittedAtOf(app); const status = statusOf(app); const accepted = status === 'ACCEPTED' || status === 'SUBMITTED'; const submitted = Boolean(submissionUrl) || status === 'SUBMITTED'; return <article className="creator-application-card" key={id}><div><ApplicationStatusBadge status={accepted ? 'ACCEPTED' : status} /><h2>{app.campaignTitle || app.campaign?.title || 'Campaign'}</h2><p>{app.brandName || app.campaign?.brandName || 'Brand partner'}</p>{accepted && <div className="creator-submission-complete"><strong>{submitted ? 'Content Submitted' : 'You’re selected for this campaign.'}</strong>{submittedAt && <span>Submitted on: {formatDate(submittedAt)}</span>}<Link className="creator-submission-link" to={`/creator/campaigns/${app.campaignId}`}>{submitted ? 'View or update submission →' : 'Submit your content →'}</Link></div>}</div><div className="creator-application-footer"><span>{status === 'REJECTED' ? 'This application was not selected.' : `Applied ${formatDate(app.appliedAt || app.createdAt)}`}</span><Link to={`/creator/campaigns/${app.campaignId}`}>View campaign →</Link></div></article>; })}</div></section>;
}
