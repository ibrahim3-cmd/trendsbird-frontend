import { ISidebarItem } from "@/types";
import Contacts from "@/pages/contacts/page";
import AdministrationPage from "@/pages/administration";
import AllLogsPage from "@/pages/all-logs";

import {
  Users,
  ChartNoAxesCombined,
  UserStar,
  Activity,
  Settings,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import SettingsPage from "@/pages/settings";
import DashboardPage from "@/pages/dashboard";
import EmailManagementPage from "@/pages/emails";
import SystemManagementPage from "@/pages/system-management";


export const sidebarItems: ISidebarItem[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        component: DashboardPage,
        key: "dashboard",
        icon: ChartNoAxesCombined,
      },
      {
        title: "Administration",
        url: "/administration",
        component: AdministrationPage,
        key: "administration",
        icon: UserStar,
      },
      {
        title: "Settings",
        url: "/settings",
        component: SettingsPage,
        key: "settings",
        icon: Settings,
      },

      {
        title: "Contacts",
        url: "/contacts",
        component: Contacts,
        key: "contacts",
        icon: Users,
      },

      {
        title: "Emails",
        url: "/emails",
        component: EmailManagementPage,
        key: "emails",
        icon: Mail
      },
      {
        title: "Logs",
        url: '/logs',
        component: AllLogsPage,
        key: "all-logs",
        icon: Activity,
      },
      {
        title: "System Management",
        url: "/system-management",
        component: SystemManagementPage,
        key: "system-management",
        icon: SlidersHorizontal,
      },
    ],
  },
];