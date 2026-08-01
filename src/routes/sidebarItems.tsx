import { ISidebarItem } from "@/types";
import {
  ChartNoAxesCombined,
  Users,
  Shield,
  KeyRound,
  Package,
  Tags,
  Award,
  Layers,
  Image,
} from "lucide-react";
import DashboardPage from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import RolesPage from "@/pages/roles";
import PermissionsPage from "@/pages/permissions";
import ProductsPage from "@/pages/products";
import CategoriesPage from "@/pages/categories";
import BrandsPage from "@/pages/brands";
import AttributesPage from "@/pages/attributes";
import MediaPage from "@/pages/media";

export const sidebarItems: ISidebarItem[] = [
  {
    title: "Admin",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        component: DashboardPage,
        key: "dashboard",
        permission: "dashboard:watch",
        icon: ChartNoAxesCombined,
      },
      {
        title: "Users",
        url: "/users",
        component: UsersPage,
        key: "users",
        permission: "user:watch",
        icon: Users,
      },
      {
        title: "Roles",
        url: "/roles",
        component: RolesPage,
        key: "roles",
        permission: "role:watch",
        icon: Shield,
      },
      {
        title: "Permissions",
        url: "/permissions",
        component: PermissionsPage,
        key: "permissions",
        permission: "permission:watch",
        icon: KeyRound,
      },
      {
        title: "Products",
        url: "/products",
        component: ProductsPage,
        key: "products",
        permission: "product:watch",
        icon: Package,
      },
      {
        title: "Categories",
        url: "/categories",
        component: CategoriesPage,
        key: "categories",
        permission: "category:watch",
        icon: Tags,
      },
      {
        title: "Brands",
        url: "/brands",
        component: BrandsPage,
        key: "brands",
        permission: "brand:watch",
        icon: Award,
      },
      {
        title: "Attributes",
        url: "/attributes",
        component: AttributesPage,
        key: "attributes",
        permission: "attribute:watch",
        icon: Layers,
      },
      {
        title: "Media",
        url: "/media",
        component: MediaPage,
        key: "media",
        permission: "media:watch",
        icon: Image,
      },
    ],
  },
];
