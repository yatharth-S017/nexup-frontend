import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../../context/NotificationContext.jsx';
import CampaignForm from './CampaignForm.jsx';
import './BrandCampaigns.css';

export default function BrandCampaignCreatePage() {
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();

  return (
    <div className="brand-campaign-page">
      <header className="campaign-page-header compact">
        <div>
          <h1>Create Campaign</h1>
          <p>Define the brief, budget, platforms, timeline, and attachments.</p>
        </div>
      </header>
      <CampaignForm notify={notify} onSaved={() => navigate('/brand/campaigns')} />
    </div>
  );
}
