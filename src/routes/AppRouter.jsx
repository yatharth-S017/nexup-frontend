import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import PublicLayout from '../layout/PublicLayout.jsx';
import CreatorLayout from '../layout/CreatorLayout.jsx';
import BrandLayout from '../layout/BrandLayout.jsx';
import LoginPage from '../pages/Auth/LoginPage.jsx';
import RegisterPage from '../pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage.jsx';
import CampaignsPage from '../pages/Campaign/CampaignsPage.jsx';
import LandingPage from '../pages/Landing/LandingPage.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import PublicRoute from '../components/common/PublicRoute.jsx';
import CreatorGuard from './CreatorGuard.jsx';
import BrandGuard from './BrandGuard.jsx';
import CreatorDashboard from '../pages/Creator/CreatorDashboard.jsx';
import BrandDashboard from '../pages/Brand/BrandDashboard.jsx';
import BrandOnboarding from '../pages/Brand/BrandOnboarding.jsx';
import BrandCampaignApplicantsPage from '../pages/Brand/campaigns/BrandCampaignApplicantsPage.jsx';
import BrandCreatorAnalyticsPage from '../pages/Brand/campaigns/BrandCreatorAnalyticsPage.jsx';
import useAuth from '../hooks/useAuth.js';

function RoleHomeRedirect() {
  const { isAuthenticated, accountType } = useAuth();
  if (!isAuthenticated) return <LandingPage />;
  return <Navigate to={accountType === 'CREATOR' ? ROUTES.CREATOR_HOME : ROUTES.BRAND_HOME} replace />;
}

function DashboardRedirect() {
  const { isAuthenticated, accountType } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Navigate to={accountType === 'CREATOR' ? ROUTES.CREATOR_HOME : ROUTES.BRAND_HOME} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<RoleHomeRedirect />} />
          <Route path="/index.html" element={<RoleHomeRedirect />} />
          <Route path={ROUTES.CAMPAIGNS} element={<CampaignsPage />} />
          <Route path="/terms" element={<LandingPage variant="terms" />} />
          <Route path="/termsandconditions.html" element={<LandingPage variant="terms" />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedAccountType="CREATOR" />}>
          <Route element={<CreatorLayout />}>
            <Route element={<CreatorGuard />}>
              <Route path={ROUTES.CREATOR} element={<CreatorDashboard />} />
              <Route path={ROUTES.CREATOR_HOME} element={<CreatorDashboard />} />
              <Route path="/creator/profile" element={<CreatorDashboard />} />
              <Route path="/creator/campaigns" element={<CreatorDashboard />} />
              <Route path="/creator/campaigns/:campaignId" element={<CreatorDashboard />} />
              <Route path="/creator/my-campaigns" element={<CreatorDashboard />} />
              <Route path="/creator/applications" element={<CreatorDashboard />} />
              <Route path="/creator/analytics" element={<CreatorDashboard />} />
              <Route path="/creator/security" element={<CreatorDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedAccountType="BRAND" />}>
          <Route element={<BrandLayout />}>
            <Route path="/brand/profile/create" element={<BrandOnboarding />} />
            <Route path={ROUTES.BRAND} element={<BrandDashboard />} />
            <Route path={ROUTES.BRAND_HOME} element={<BrandDashboard />} />
            <Route element={<BrandGuard />}>
              <Route path="/brand/profile" element={<BrandDashboard />} />
            </Route>
            <Route path="/brand/security" element={<BrandDashboard />} />
            <Route path="/brand/discover-creators" element={<BrandDashboard />} />
            <Route path="/brand/campaigns" element={<BrandDashboard />} />
            <Route path="/brand/campaigns/create" element={<BrandDashboard />} />
            <Route path="/brand/campaigns/new" element={<BrandDashboard />} />
            <Route path="/brand/campaigns/:campaignId/applications" element={<BrandCampaignApplicantsPage />} />
            <Route path="/brand/creators/:creatorId/analytics" element={<BrandCreatorAnalyticsPage />} />
            <Route path="/brand/campaigns/:campaignId" element={<BrandDashboard />} />
            <Route path="/brand/campaigns/:campaignId/edit" element={<BrandDashboard />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/profile" element={<DashboardRedirect />} />
        <Route path="/settings" element={<DashboardRedirect />} />
        <Route path="/form" element={<ProtectedRoute><Navigate to="/creator/profile" replace /></ProtectedRoute>} />
        <Route path="/form.html" element={<ProtectedRoute><Navigate to="/creator/profile" replace /></ProtectedRoute>} />
        <Route path="*" element={<RoleHomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
