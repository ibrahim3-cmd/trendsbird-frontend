import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
    feature: string;
    action: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
    feature,
    action,
    children,
    fallback = null,
}) => {
    const { can } = usePermission();

    if (!can(feature, action)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default PermissionGate;
