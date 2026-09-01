import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationContext } from '../../../context/NotificationContext.jsx';
import { campaignService } from '../../../services/campaignService.js';
import CampaignForm from './CampaignForm.jsx';
import { getErrorMessage, normalizeCampaign } from './campaignUtils.js';
import './BrandCampaigns.css';

export default function BrandCampaignEditPage() {
  const { campaignId } = useParams();
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCampaign() {
      try {
        const data = await campaignService.getCampaignDetails(campaignId);
        setCampaign(normalizeCampaign(data));
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load campaign.'));
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [campaignId]);

  if (loading) return <div className="campaign-skeleton">Loading campaign...</div>;
  if (error) return <div className="campaign-error">{error}</div>;

  return (
    <div className="brand-campaign-page">
      <header className="campaign-page-header compact">
        <div>
          <h1>Edit Campaign</h1>
          <p>Update the campaign brief and delivery details.</p>
        </div>
      </header>
      <CampaignForm campaign={campaign} mode="edit" notify={notify} onSaved={() => navigate('/brand/campaigns')} />
    </div>
  );
}
