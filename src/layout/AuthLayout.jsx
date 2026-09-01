import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Toast from '../components/feedback/Toast.jsx';

export default function AuthLayout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        <Outlet />
      </main>
      <Toast />
    </>
  );
}
