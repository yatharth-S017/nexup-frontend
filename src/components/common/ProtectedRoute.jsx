import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function ProtectedRoute({ allowedAccountType, children }) {
  const { isAuthenticated, accountType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedAccountType && accountType !== allowedAccountType) {
    return <Navigate to={accountType === 'CREATOR' ? ROUTES.CREATOR_HOME : ROUTES.BRAND_HOME} replace />;
  }

  return children ? children : <Outlet />;
}
