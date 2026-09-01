import { Outlet } from 'react-router-dom';
import BrandNavbar from '../components/navigation/BrandNavbar.jsx';
import Toast from '../components/feedback/Toast.jsx';
import './BrandWorkspace.css';

/** Persistent shell for the brand application. */
export default function BrandLayout() {
  return (
    <div className="brand-workspace">
      <BrandNavbar />
      <main><Outlet /></main>
      <Toast />
    </div>
  );
}
