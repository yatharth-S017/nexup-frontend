import { useParams } from 'react-router-dom';
import CreatorAnalyticsPage from '../../Creator/CreatorAnalyticsPage.jsx';

export default function BrandCreatorAnalyticsPage() {
  const { creatorId } = useParams();
  return <div className="creator-dark-theme" style={{ minHeight: '100vh', padding: '32px' }}><CreatorAnalyticsPage creatorId={creatorId} /></div>;
}
