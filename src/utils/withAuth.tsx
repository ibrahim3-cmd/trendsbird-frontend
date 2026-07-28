// withAuth.tsx
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const withAuth = (Component: ComponentType) => {
  return function AuthWrapper() {
    const { data, isLoading, isFetching, error } = useUserInfoQuery(null);
    const location = useLocation();

    if (isLoading || isFetching) return null;

    const user = data?.data;
    const features = user?.featureAccess || [];
    // console.log("features", features );
    localStorage.setItem("features", JSON.stringify(features));
    if (error || !user?._id) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // if (allowedRoles) {
    //   const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    //   const userRole = user?.role as TRole | undefined;
    //   if (!userRole || !allowed.includes(userRole)) {
    //     return <Navigate to="/unauthorized" replace />;
    //   }
    // }

    return <Component />;
  };
};
