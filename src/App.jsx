import { useEffect, useMemo, useState } from 'react';
import LegacyPage from './components/common/LegacyPage.jsx';
import AppProviders from './context/AppProviders.jsx';
import AppRouter from './routes/AppRouter.jsx';
import brandHtml from '../legacy/brand.html?raw';
import formHtml from '../legacy/form.html?raw';
import homeHtml from '../legacy/home.html?raw';
import termsHtml from '../legacy/termsandconditions.html?raw';
import brandCss from './styles/legacy/brand.css?raw';
import mainCss from './styles/legacy/main.css?raw';

const pages = {
  '/': { html: homeHtml, css: mainCss },
  '/index.html': { html: homeHtml, css: mainCss },
  '/brand': { html: brandHtml, css: brandCss },
  '/brand.html': { html: brandHtml, css: brandCss },
  '/form': { html: formHtml, css: '' },
  '/form.html': { html: formHtml, css: '' },
  '/terms': { html: termsHtml, css: '' },
  '/termsandconditions.html': { html: termsHtml, css: '' },
};

function currentPath() {
  return window.location.pathname || '/';
}

function LegacyApp() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const page = useMemo(() => pages[path] || pages['/'], [path]);

  return (
    <LegacyPage
      key={path}
      html={page.html}
      css={page.css}
      onNavigate={(nextPath) => {
        window.history.pushState({}, '', nextPath);
        setPath(currentPath());
      }}
    />
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

