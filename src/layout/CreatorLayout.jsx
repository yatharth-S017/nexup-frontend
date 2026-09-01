import { Outlet } from 'react-router-dom';
import CreatorHeader from '../components/navigation/CreatorHeader.jsx';
import Toast from '../components/feedback/Toast.jsx';

/** Persistent shell for the creator application. */
export default function CreatorLayout() {
  return (
    <>
      <div className="creator-header-frame"><CreatorHeader /></div>
      <main><Outlet /></main>
      <Toast />
    </>
  );
}
