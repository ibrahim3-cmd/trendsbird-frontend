import { ISidebarItem } from "@/types";
import {
  ChartNoAxesCombined,
} from "lucide-react";
import DashboardPage from "@/pages/dashboard";


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
    ],
  },
];