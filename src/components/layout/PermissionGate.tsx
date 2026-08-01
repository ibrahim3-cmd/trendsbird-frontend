import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasAccess } = usePermission();

  if (!hasAccess(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;
