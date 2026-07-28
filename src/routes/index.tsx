
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withAuth } from "@/utils/withAuth";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import Unauthorized from "@/pages/Unauthorized";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ForgotPasswordPage from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import UserFeaturesManagement from "@/pages/Admin/user/UserFeaturesManagement";
import ChangePassword from "@/pages/shared/ChangePassword";
import ProfileSettings from "@/pages/shared/ProfileSettings";
import { sidebarItems } from "./sidebarItems";
import ErrorPage from "@/pages/ErrorPage";
import NotFound from "@/pages/NotFound";
import GoogleOAuthCallback from "@/pages/GoogleOAuthCallback";
import OAuthCallback from "@/pages/OAuthCallback";
import App from "@/App";



// Dynamic index redirect component to send CLIENT users to their dashboard
function AdminIndexRedirect() {
  const { data, isLoading, isFetching } = useUserInfoQuery(null);
  if (isLoading || isFetching) return null;
  const user = data?.data;
  if (user?.role === "CLIENT") {
    return <Navigate to="/client-dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        Component: Home,
        path: "/",
      },
      {
        Component: Welcome,
        path: "/welcome",
      },
      {
        Component: TermsAndConditions,
        path: "/terms-conditions",
      },
      {
        Component: PrivacyPolicy,
        path: "/privacy-policy",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout),
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminIndexRedirect /> },
      ...generateRoutes(sidebarItems),
      {
        path: "change-password",
        Component: ChangePassword,
      },
      {
        path: "profile",
        Component: ProfileSettings,
      },
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: ForgotPasswordPage,
    path: "/forgot-password",
  },
  {
    Component: ResetPassword,
    path: "/reset-password",
  },
  {
    Component: GoogleOAuthCallback,
    path: "/auth/google/callback",
  },
  {
    Component: OAuthCallback,
    path: "/oauth/callback",
  },
  {
    Component: NotFound,
    path: "*",
  },
]);
