import { ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";

type CanAccessProps = {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function CanAccess({ permission, children, fallback = null }: CanAccessProps) {
  const { hasAccess } = usePermission();
  if (!hasAccess(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
