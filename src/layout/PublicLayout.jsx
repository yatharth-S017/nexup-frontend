import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Toast from '../components/feedback/Toast.jsx';

/** Shell for pages available before authentication. */
export default function PublicLayout() {
  const { pathname } = useLocation();
  const usesDarkHeader = pathname === '/' || pathname === '/index.html' || pathname === '/login' || pathname === '/forgot-password';

  return (
    <>
      <Navbar />
      <main className={usesDarkHeader ? 'public-home-main' : undefined} style={{ paddingTop: '64px' }}><Outlet /></main>
      <Toast />
    </>
  );
}
