import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withAuth } from "@/utils/withAuth";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import Unauthorized from "@/pages/Unauthorized";
import Home from "@/pages/Home";
import ChangePassword from "@/pages/shared/ChangePassword";
import ProfileSettings from "@/pages/shared/ProfileSettings";
import { sidebarItems } from "./sidebarItems.tsx";
import ErrorPage from "@/pages/ErrorPage";
import NotFound from "@/pages/NotFound";
import App from "@/App";
import ProductFormPage from "@/pages/products/ProductForm";

function AdminIndexRedirect() {
  const { data, isLoading, isFetching } = useUserInfoQuery(undefined);
  if (isLoading || isFetching) return null;
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
      {
        path: "products/create",
        Component: ProductFormPage,
      },
      {
        path: "products/edit/:id",
        Component: ProductFormPage,
      },
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: NotFound,
    path: "*",
  },
]);
