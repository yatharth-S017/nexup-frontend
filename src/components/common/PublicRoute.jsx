import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function PublicRoute({ children }) {
  const { isAuthenticated, accountType } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={accountType === 'CREATOR' ? ROUTES.CREATOR_HOME : ROUTES.BRAND_HOME} replace />;
  }

  return children ? children : <Outlet />;
}
