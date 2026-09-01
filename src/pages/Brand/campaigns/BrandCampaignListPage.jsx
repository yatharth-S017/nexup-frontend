import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/ui/Modal.jsx';
import { NotificationContext } from '../../../context/NotificationContext.jsx';
import { campaignService } from '../../../services/campaignService.js';
import {
  campaignStatusClass,
  campaignStatusLabel,
  formatCurrency,
  formatDate,
  getCampaignStats,
  getErrorMessage,
  normalizeCampaign,
} from './campaignUtils.js';
import './BrandCampaigns.css';

const CampaignIcon = () => <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.9v13.3a1.8 1.8 0 0 1-3.4.6l-2.2-6.1M18 13a3 3 0 1 0 0-6M5.4 13.7A4 4 0 0 1 7 6h1.8c4.1 0 7.6-1.2 9.2-3v14c-1.6-1.8-5.1-3-9.2-3H7a4 4 0 0 1-1.6-.3Z" /></svg>;
const SearchIcon = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;

function StatCard({ label, value }) {
  return (
    <article className="campaign-stat">
      <span><CampaignIcon /></span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>
  );
}

function CampaignCard({ campaign, onDelete }) {
  const normalized = normalizeCampaign(campaign);
  return (
    <article className="campaign-card">
      <div className="campaign-card-icon"><CampaignIcon /></div>
      <div className="campaign-card-main">
        <div className="campaign-card-title">
          <h2>{normalized.title}</h2>
          <span className={campaignStatusClass(normalized.status)}>{campaignStatusLabel(normalized.status)}</span>
        </div>
        <p>{normalized.description}</p>
        <div className="campaign-meta-grid">
          <span>Platforms: <strong>{normalized.platforms.join(', ') || '-'}</strong></span>
          <span>Budget: <strong>{formatCurrency(normalized.totalBudget)}</strong></span>
          <span>Payout: <strong>{formatCurrency(normalized.payoutPerCreator)}</strong></span>
          <span>Creators: <strong>{normalized.requiredCreators || '-'}</strong></span>
          <span>Apply by: <strong>{formatDate(normalized.applicationDeadline)}</strong></span>
          <span>Submit by: <strong>{formatDate(normalized.submissionDeadline)}</strong></span>
          <span>Created: <strong>{formatDate(normalized.createdAt)}</strong></span>
        </div>
      </div>
      <div className="campaign-actions">
        <Link className="campaign-action" to={`/brand/campaigns/${normalized.id}`}>View</Link>
        <Link className="campaign-action" to={`/brand/campaigns/${normalized.id}/edit`}>Edit</Link>
        <button className="campaign-action danger" type="button" onClick={() => onDelete(normalized)}>Delete</button>
      </div>
    </article>
  );
}

export default function BrandCampaignListPage() {
  const { notify } = useContext(NotificationContext);
  const [campaigns, setCampaigns] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const stats = useMemo(() => getCampaignStats(campaigns), [campaigns]);
  const filteredCampaigns = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return campaigns;
    return campaigns.filter((campaign) => campaign.title?.toLowerCase().includes(term));
  }, [campaigns, query]);

  const loadCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await campaignService.getMyCampaigns();
      setCampaigns(Array.isArray(data) ? data.map(normalizeCampaign) : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load campaigns.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const confirmDelete = async () => {
    if (!deletingCampaign) return;
    setDeleting(true);
    try {
      await campaignService.deleteCampaign(deletingCampaign.id);
      notify({ message: 'Campaign deleted.', type: 'success' });
      setDeletingCampaign(null);
      await loadCampaigns();
    } catch (err) {
      notify({ message: getErrorMessage(err, 'Unable to delete campaign.'), type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="brand-campaign-page">
      <header className="campaign-page-header">
        <div className="campaign-heading-icon"><CampaignIcon /></div>
        <div>
          <h1>Campaigns</h1>
          <p>Create and manage your creator campaigns.</p>
        </div>
        <Link className="campaign-create-btn" to="/brand/campaigns/new">+ Create Campaign</Link>
      </header>

      <section className="campaign-stats-grid">
        <StatCard label="Total Campaigns" value={stats.total} />
        <StatCard label="Published Campaigns" value={stats.published} />
        <StatCard label="Completed Campaigns" value={stats.completed} />
        <StatCard label="Closed Campaigns" value={stats.closed} />
      </section>

      <section className="campaign-toolbar">
        <div className="campaign-search"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns..." /></div>
      </section>

      {error ? <div className="campaign-error">{error}</div> : null}
      {loading ? <div className="campaign-skeleton">Loading campaigns...</div> : null}
      {!loading && !filteredCampaigns.length ? (
        <div className="campaign-empty">
          <CampaignIcon />
          <h2>No campaigns found</h2>
          <p>Create your first campaign to start managing creator collaborations.</p>
          <Link className="campaign-create-btn" to="/brand/campaigns/new">Create Campaign</Link>
        </div>
      ) : null}
      <div className="campaign-list">
        {filteredCampaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onDelete={setDeletingCampaign} />)}
      </div>

      <Modal open={Boolean(deletingCampaign)} className="campaign-modal">
        {deletingCampaign ? (
          <>
            <div className="campaign-modal-icon"><TrashIcon /></div>
            <h2>Delete campaign?</h2>
            <p>This will remove <strong>{deletingCampaign.title}</strong>. This action cannot be undone.</p>
            <div className="campaign-modal-actions">
              <button className="btn-back" type="button" onClick={() => setDeletingCampaign(null)}>Cancel</button>
              <button className="btn-send campaign-delete-btn" type="button" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
