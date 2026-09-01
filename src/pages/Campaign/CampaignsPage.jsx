import { useNavigate } from 'react-router-dom';
import LegacyPage from '../../components/common/LegacyPage.jsx';
import PlaceholderPage from '../PlaceholderPage.jsx';
import formHtml from '../../../legacy/form.html?raw';

export default function CampaignsPage({ variant }) {
  const navigate = useNavigate();

  if (variant === 'legacy-form') {
    return <LegacyPage html={formHtml} onNavigate={navigate} />;
  }

  return <PlaceholderPage title="Campaigns" />;
}
