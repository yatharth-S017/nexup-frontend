import { useNavigate } from 'react-router-dom';
import LegacyPage from '../../components/common/LegacyPage.jsx';
import brandHtml from '../../../legacy/brand.html?raw';
import brandCss from '../../styles/legacy/brand.css?raw';

export default function BrandPage() {
  const navigate = useNavigate();

  return <LegacyPage html={brandHtml} css={brandCss} onNavigate={navigate} />;
}
