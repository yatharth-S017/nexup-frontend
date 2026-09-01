import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { campaignService } from '../../services/campaignService.js';
import Modal from '../../components/ui/Modal.jsx';
import './CreatorCampaigns.css';
import './CreatorMarketplace.css';
import './CreatorCampaignDetail.css';
import './CreatorApplications.css';

const Icon = ({ children, size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const SearchIcon = () => <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>;
const CampaignIcon = () => <Icon><path d="M4 10v4" /><path d="M8 6v12" /><path d="M8 8c5 0 8-2 11-4v16c-3-2-6-4-11-4" /><path d="M4 14h4" /></Icon>;

const asArray = (value) => Array.isArray(value) ? value : [];
const money = (value) => value === null || value === undefined || value === '' ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
const date = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : 'Not specified';
const errorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.error || fallback;
const applicationSubmissionUrl = (application) => {
  const submission = application?.submission;
  return application?.submissionUrl || application?.submissionURL || application?.submission_url || application?.submissionLink || application?.submissionVideoUrl || application?.videoUrl || application?.videoURL || application?.contentUrl || application?.contentURL || application?.contentLink || application?.submittedUrl || application?.submittedContentUrl || application?.contentSubmissionUrl || application?.url || (typeof submission === 'string' ? submission : submission?.submissionUrl || submission?.videoUrl || submission?.contentUrl || submission?.url) || '';
};
const applicationSubmittedAt = (application) => application?.submittedAt || application?.submission?.submittedAt;

const statusLabel = (status) => status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Applied';

export function ApplicationStatusBadge({ status }) {
  return <span className={`creator-application-status ${String(status || 'PENDING').toLowerCase()}`}>{statusLabel(status || 'PENDING')}</span>;
}

function CampaignCard({ campaign, application, onApply }) {
  return <article className="creator-campaign-card">
    <div className="creator-campaign-card-top"><span className="creator-campaign-status">Open opportunity</span><span className="creator-campaign-id">#{campaign.id}</span></div>
    <h2>{campaign.title || 'Untitled campaign'}</h2>
    <p className="creator-campaign-brand">{campaign.brandName || 'Brand partner'}</p>
    {campaign.description ? <p className="creator-campaign-description">{campaign.description}</p> : <p className="creator-campaign-description muted">View the brief for campaign requirements and delivery details.</p>}
    <div className="creator-campaign-stats"><div><strong>{money(campaign.payoutPerCreator)}</strong><span>Payout per creator</span></div><div><strong>{campaign.requiredCreators ?? '—'}</strong><span>Openings</span></div></div>
    <div className="creator-platforms">{asArray(campaign.platforms).map((platform) => <span key={platform}>{platform}</span>)}</div>
    <div className="creator-campaign-actions">
      <Link className="creator-campaign-cta" to={`/creator/campaigns/${campaign.id}`}>View details <span>→</span></Link>
      {application ? <ApplicationStatusBadge status={application.status} /> : <button className="creator-campaign-apply" onClick={() => onApply(campaign)}>Apply now</button>}
    </div>
  </article>;
}

export function CreatorCampaignList() {
  const { notify } = useContext(NotificationContext);
  const [campaigns, setCampaigns] = useState([]); const [applications, setApplications] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [platform, setPlatform] = useState(''); const [selectedCampaign, setSelectedCampaign] = useState(null); const [applying, setApplying] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [campaignData, applicationData] = await Promise.all([campaignService.getPublishedCampaigns(), campaignService.getCreatorApplications()]); setCampaigns(asArray(campaignData)); setApplications(asArray(applicationData)); } catch (err) { setError(errorMessage(err, 'Unable to load campaigns right now.')); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const platforms = useMemo(() => [...new Set(campaigns.flatMap((campaign) => asArray(campaign.platforms)))], [campaigns]);
  const visible = useMemo(() => campaigns.filter((campaign) => { const term = query.trim().toLowerCase(); const matchesTerm = !term || [campaign.title, campaign.brandName, campaign.description].filter(Boolean).some((item) => item.toLowerCase().includes(term)); return matchesTerm && (!platform || asArray(campaign.platforms).includes(platform)); }), [campaigns, query, platform]);
  const submitApplication = async () => { if (!selectedCampaign || applying) return; setApplying(true); try { const result = await campaignService.applyToCampaign(selectedCampaign.id, {}); setApplications((current) => [...current, { campaignId: selectedCampaign.id, status: result?.status || 'PENDING' }]); setSelectedCampaign(null); notify({ message: 'Application submitted successfully.', type: 'success' }); } catch (err) { notify({ message: errorMessage(err, 'Unable to submit your application. Please try again.'), type: 'error' }); } finally { setApplying(false); } };
  const applicationByCampaign = new Map(applications.map((application) => [String(application.campaignId), application]));
  return <div className="creator-marketplace">
    <header className="creator-marketplace-heading"><span className="creator-eyebrow">✦ Find. Apply. Grow.</span><h1>Explore brand deals<br />made for <em>creators</em> like you.</h1><p>Discover published campaigns, find the right fit, and apply with confidence.</p></header>
    <section className="creator-campaign-toolbar" aria-label="Campaign filters"><label className="creator-search"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns or brands..." /></label><label className="creator-filter"><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="">All platforms</option>{platforms.map((item) => <option value={item} key={item}>{item}</option>)}</select></label></section>
    {loading && <div className="creator-campaign-grid">{Array.from({ length: 6 }, (_, i) => <div className="creator-campaign-card creator-campaign-skeleton" key={i}><i /><i /><i /><i /></div>)}</div>}
    {!loading && error && <div className="creator-campaign-state"><CampaignIcon /><h2>Campaigns couldn’t load</h2><p>{error}</p><button className="btn-send creator-retry" onClick={load}>Try again</button></div>}
    {!loading && !error && !visible.length && <div className="creator-campaign-state"><CampaignIcon /><h2>{campaigns.length ? 'No matching campaigns' : 'No campaigns available yet'}</h2><p>{campaigns.length ? 'Try changing your search or platform filter.' : 'New brand opportunities will appear here when they are published.'}</p></div>}
    {!loading && !error && visible.length > 0 && <div className="creator-campaign-grid">{visible.map((campaign) => <CampaignCard campaign={campaign} application={applicationByCampaign.get(String(campaign.id))} onApply={setSelectedCampaign} key={campaign.id} />)}</div>}
    <Modal open={Boolean(selectedCampaign)} className="creator-application-modal"><h2>Apply to {selectedCampaign?.title}</h2><p>Your application will be sent to {selectedCampaign?.brandName || 'this brand'} for review.</p><div className="creator-application-modal-actions"><button className="btn-back" onClick={() => setSelectedCampaign(null)} disabled={applying}>Cancel</button><button className="btn-send" onClick={submitApplication} disabled={applying}>{applying ? 'Applying…' : 'Confirm application'}</button></div></Modal>
  </div>;
}

function BrandBadge({ name }) {
  if (!name) return null;
  const isLinkedIn = name.toLowerCase().includes('linkedin');
  const isYoutube = name.toLowerCase().includes('youtube') || name.toLowerCase().includes('google');
  
  // Icon styling and SVG
  let icon = (
    <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#a8e63d', display: 'grid', placeItems: 'center', color: '#07070c', fontSize: '11px', fontWeight: 'bold' }}>
      ★
    </div>
  );
  
  if (isLinkedIn) {
    icon = (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  } else if (isYoutube) {
    icon = (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0000">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.021 0 12 0 12s0 3.979.502 5.837a3.002 3.002 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.979 24 12 24 12s0-3.979-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  
  return (
    <div className="brand-verified-badge" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(168, 230, 61, 0.12)',
      color: '#d9f99d',
      padding: '6px 12px',
      borderRadius: '8px',
      boxShadow: 'none',
      fontWeight: '600',
      fontSize: '14px',
      marginTop: '10px',
      border: '1px solid rgba(168, 230, 61, 0.28)'
    }}>
      {icon}
      <span>{name}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

export function CreatorCampaignDetails() {
  const { campaignId } = useParams(); const { notify } = useContext(NotificationContext); const [campaign, setCampaign] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [applying, setApplying] = useState(false); const [application, setApplication] = useState(null); const [submissionUrl, setSubmissionUrl] = useState(''); const [submissionError, setSubmissionError] = useState(''); const [submittingContent, setSubmittingContent] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [campaignData, applicationData] = await Promise.all([campaignService.getPublishedCampaignDetails(campaignId), campaignService.getCreatorApplications()]); setCampaign(campaignData); setApplication(asArray(applicationData).find((item) => String(item.campaignId) === String(campaignId)) || null); } catch (err) { setError(errorMessage(err, 'Unable to load this campaign.')); } finally { setLoading(false); } }, [campaignId]);
  useEffect(() => { load(); }, [load]);
  const apply = async () => { if (applying || application) return; setApplying(true); try { const result = await campaignService.applyToCampaign(campaignId, {}); setApplication({ campaignId, status: result?.status || 'PENDING' }); notify({ message: 'Application submitted successfully.', type: 'success' }); } catch (err) { const message = errorMessage(err, 'Unable to submit your application. Please try again.'); notify({ message, type: 'error' }); setError(message); } finally { setApplying(false); } };
  const submitContent = async () => { const value = submissionUrl.trim(); try { const parsed = new URL(value); if (!/^https?:$/.test(parsed.protocol)) throw new Error(); } catch { setSubmissionError('Enter a valid HTTP or HTTPS video URL.'); return; } if (!application?.applicationId || submittingContent) return; setSubmittingContent(true); setSubmissionError(''); try { const result = await campaignService.submitApplicationContent(application.applicationId, value); const returned = result?.application || result?.data || result || {}; setApplication(current => ({ ...current, ...returned, submissionUrl: applicationSubmissionUrl(returned) || value, submittedAt: applicationSubmittedAt(returned) || current?.submittedAt })); notify({ message: applicationSubmissionUrl(application) ? 'Submission link updated.' : 'Content submitted successfully.', type: 'success' }); } catch (err) { setSubmissionError(errorMessage(err, 'Unable to save your submission. Please try again.')); } finally { setSubmittingContent(false); } };
  
  if (loading) return <div className="creator-detail-loading"><span className="spin" /> Loading campaign details…</div>;
  if (error && !campaign) return <div className="creator-campaign-state"><CampaignIcon /><h2>Campaign unavailable</h2><p>{error}</p><button className="btn-send creator-retry" onClick={load}>Try again</button><Link to="/creator/campaigns">Back to campaigns</Link></div>;

  return <div className="creator-campaign-detail">
    <Link className="creator-back-link" to="/creator/campaigns">← Back to campaigns</Link>
    <header style={{ marginBottom: '32px' }}>
      <span className="creator-eyebrow">Open opportunity</span>
      <h1 style={{ marginBottom: '8px' }}>{campaign?.title || 'Untitled campaign'}</h1>
      <BrandBadge name={campaign?.brandName || 'Brand partner'} />
    </header>
    
    <div className="creator-detail-layout">
      <main>
        <section className="creator-detail-card" style={{ marginBottom: '0' }}>
          <h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom', color: '#a8e63d' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Campaign brief
          </h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{campaign?.description || 'No campaign description was provided.'}</p>
        </section>
        
        {asArray(campaign?.attachmentUrls).length > 0 && (
          <section className="creator-detail-card" style={{ marginTop: '16px' }}>
            <h2>Attachments</h2>
            <ul>{campaign.attachmentUrls.map((url) => <li key={url}><a href={url} target="_blank" rel="noreferrer">Open attachment</a></li>)}</ul>
          </section>
        )}
      </main>
      
      <aside className="creator-apply-aside" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="creator-apply-card" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="creator-detail-stats">
            <div><span>Payout per creator</span><strong style={{ color: '#a8e63d' }}>{money(campaign?.payoutPerCreator)}</strong></div>
            <div><span>Total budget</span><strong style={{ color: '#a8e63d' }}>{money(campaign?.totalBudget)}</strong></div>
            <div><span>Openings</span><strong>{campaign?.requiredCreators ?? '—'}</strong></div>
            <div><span>Apply by</span><strong>{date(campaign?.applicationDeadline)}</strong></div>
            <div><span>Submit by</span><strong>{date(campaign?.submissionDeadline)}</strong></div>
          </div>
          <div className="creator-platforms">{asArray(campaign?.platforms).map((item) => <span key={item}>{item}</span>)}</div>
          {application ? <><div className="creator-apply-success">Application <ApplicationStatusBadge status={application.status} /></div>{(['ACCEPTED', 'SUBMITTED'].includes(String(application.status || '').toUpperCase())) && <div className="creator-detail-submission">{(() => { const currentUrl = applicationSubmissionUrl(application); const hasSubmitted = Boolean(currentUrl) || String(application.status || '').toUpperCase() === 'SUBMITTED'; return <><strong>{hasSubmitted ? 'Content Submitted' : 'Submit Your Content'}</strong><p>{hasSubmitted ? 'Update the video URL if you need to replace your submission.' : 'Paste the link to your campaign video.'}</p>{currentUrl && <div className="creator-current-submission"><span>Current video URL</span><a href={currentUrl} target="_blank" rel="noopener noreferrer">{currentUrl}</a></div>}{hasSubmitted && !currentUrl && <small className="creator-submission-unavailable">Your saved link is unavailable in this response. Paste it below to replace it.</small>}<label htmlFor="campaign-submission-url">Video URL</label><input id="campaign-submission-url" className="creator-submission-input" type="url" value={submissionUrl} onChange={event => { setSubmissionUrl(event.target.value); setSubmissionError(''); }} placeholder={currentUrl || 'https://youtube.com/...'} disabled={submittingContent} />{submissionError && <small className="err-msg">{submissionError}</small>}<button className="creator-submit-content" onClick={submitContent} disabled={submittingContent}>{submittingContent ? 'Saving...' : hasSubmitted ? 'Update Submission' : 'Submit Content'}</button></>; })()}</div>}</> : (
            <button className="btn-send creator-apply-button" onClick={apply} disabled={applying}>
              {applying ? <><span className="spin" /> Applying…</> : 'Apply to Campaign ↗'}
            </button>
          )}
        </div>
        
        <section className="creator-detail-card" style={{ width: '100%', boxSizing: 'border-box', margin: 0 }}>
          <h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom', color: '#a8e63d' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Requirements
          </h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{campaign?.requirements || 'No additional requirements were provided.'}</p>
        </section>
      </aside>
    </div>
    
    <footer className="creator-detail-footer" style={{ marginTop: '50px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(168, 230, 61, 0.1)', color: '#a8e63d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>₹</div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Fair payouts</h4>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Transparent & on time</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(168, 230, 61, 0.1)', color: '#a8e63d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Creator first</h4>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Built for real creators</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(168, 230, 61, 0.1)', color: '#a8e63d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡️</div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Trusted brands</h4>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Work with verified partners</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(168, 230, 61, 0.1)', color: '#a8e63d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎧</div>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Support</h4>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>We're here to help</p>
        </div>
      </div>
    </footer>
  </div>;
}

export function CreatorMyApplications() {
  const [applications, setApplications] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(null); const [videoUrl, setVideoUrl] = useState(''); const [submissionError, setSubmissionError] = useState('');
  const submitContent = (item) => { try { const parsed = new URL(videoUrl); if (!/^https?:$/.test(parsed.protocol)) throw new Error(); const submission = { url: videoUrl, submittedAt: new Date().toISOString() }; localStorage.setItem(`pipeup.submission.${item.applicationId || item.id}`, JSON.stringify(submission)); setApplications(current => current.map(entry => entry === item ? { ...entry, localSubmission: submission } : entry)); setSubmitting(null); setVideoUrl(''); setSubmissionError(''); } catch { setSubmissionError('Enter a valid video URL.'); } };
  const load = useCallback(async () => { setLoading(true); setError(''); try { setApplications(asArray(await campaignService.getCreatorApplications())); } catch (err) { setError(errorMessage(err, 'Unable to load your applications.')); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <div className="creator-detail-loading"><span className="spin" /> Loading applications…</div>;
  if (error) return <div className="creator-campaign-state"><CampaignIcon /><h2>Applications couldn’t load</h2><p>{error}</p><button className="btn-send creator-retry" onClick={load}>Try again</button></div>;
  if (!applications.length) return <div className="creator-campaign-state creator-my-campaigns"><CampaignIcon /><h1>My Applications</h1><p>You haven't applied to any campaigns yet.</p><Link className="creator-empty-action" to="/creator/campaigns">Explore Campaigns</Link></div>;
  return <section className="creator-applications"><header className="creator-marketplace-heading"><span className="creator-eyebrow">Your opportunities</span><h1>My applications</h1><p>Track every campaign you’ve applied to and its current review status.</p></header><div className="creator-applications-grid">{applications.map((item) => <article className="creator-application-card" key={item.applicationId || item.campaignId}><div><ApplicationStatusBadge status={item.status} /><h2>{item.campaignTitle || 'Campaign'}</h2><p>{item.brandName || 'Brand partner'}</p></div><div className="creator-application-footer"><span>Applied {item.appliedAt ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.appliedAt)) : 'recently'}</span><Link to={`/creator/campaigns/${item.campaignId}`}>View campaign →</Link></div></article>)}</div></section>;
}
