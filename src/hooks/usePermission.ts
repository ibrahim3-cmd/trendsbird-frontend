const SUPERADMIN_ROLE = "superadmin";

const getPermissions = (): string[] => {
  try {
    const raw = localStorage.getItem("permissions");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getRole = (): string | null => localStorage.getItem("role");

export const usePermission = () => {
  const permissions = getPermissions();
  const role = getRole();
  const isSuperAdmin = role?.toLowerCase() === SUPERADMIN_ROLE;

  const hasAccess = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const hasAnyAccess = (required: string[]): boolean => {
    if (isSuperAdmin) return true;
    return required.some((permission) => permissions.includes(permission));
  };

  return {
    hasAccess,
    hasAnyAccess,
    permissions,
    role,
    isSuperAdmin,
  };
};
