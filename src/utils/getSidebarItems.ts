import { sidebarItems } from "@/routes/sidebarItems.tsx";

const SUPERADMIN_ROLE = "superadmin";

export const getSidebarItems = (permissions: string[] = [], role?: string | null) => {
  const isSuperAdmin = role?.toLowerCase() === SUPERADMIN_ROLE;

  return sidebarItems.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (isSuperAdmin) return true;
      if (!item.permission) return true;
      return permissions.includes(item.permission);
    }),
  }));
};
