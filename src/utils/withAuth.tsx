// withAuth.tsx
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const withAuth = (Component: ComponentType) => {
  return function AuthWrapper() {
    const { data, isLoading, isFetching, error } = useUserInfoQuery(undefined);
    const location = useLocation();

    if (isLoading || isFetching) return null;

    const user = data?.data;
    if (user?.permissions) {
      localStorage.setItem("permissions", JSON.stringify(user.permissions));
    }
    if (user?.role) {
      localStorage.setItem("role", user.role);
    }

    if (error || !user?.id) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Component />;
  };
};
