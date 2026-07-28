import { PageHeader, TabItem } from "@/components/ui/PageHeader"
import { MonitorCog, Ticket, WalletCards } from "lucide-react"

import PlanPage from "./plans";
import SupportTicketManagementPage from "./support-tickets";


const SystemManagementPage = () => {

  const allTabs: TabItem[] = [
    {
      name: "Plan",
      icon: WalletCards,
      component: <PlanPage />,
      key: "plan"
    },
    {
      name: "Support Tickets",
      icon: Ticket,
      component: <SupportTicketManagementPage />,
      key: "support-tickets-management"
    },
  ];

  return (
    <div>
      <PageHeader
        title="System Management"
        description="Configure and maintain system settings, roles, and integrations"
        icon={MonitorCog}
        tabs={allTabs}
      />
    </div>
  )
}

export default SystemManagementPage;