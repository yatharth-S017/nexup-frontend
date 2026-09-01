import { useNavigate } from 'react-router-dom';
import LegacyPage from '../../components/common/LegacyPage.jsx';
import homeHtml from '../../../legacy/home.html?raw';
import termsHtml from '../../../legacy/termsandconditions.html?raw';
import mainCss from '../../styles/legacy/main.css?raw';
import publicThemeCss from '../../styles/PublicTheme.css?raw';

export default function LandingPage({ variant = 'home' }) {
  const navigate = useNavigate();
  const isTermsPage = variant === 'terms';

  let htmlToRender = isTermsPage ? termsHtml : homeHtml;

  return (
    <LegacyPage
      html={htmlToRender}
      css={`${isTermsPage ? '' : mainCss}\n${publicThemeCss}`}
      onNavigate={navigate}
    />
  );
}
