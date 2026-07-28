import { PageHeader, TabItem } from "@/components/ui/PageHeader"
import { Building2, MonitorCog, Replace, Settings, CreditCard, Mail } from "lucide-react"
import OrgDetails from "./org-details"
import SystemSettings from "./system-settings"
import ChangePlan from "./change-plan"
import BillingInfo from "./billing-info"
import EmailServicesPage from "./email-services"

const SettingsPage = () => {

  const profileTabs: TabItem[] = [
    {
      name: "Org Details",
      icon: Building2,
      component: <OrgDetails />,
      key: "org-details"
    },
    {
      name: "System Settings",
      icon: MonitorCog,
      component: <SystemSettings />,
      key: "system-settings"
    },
    {
      name: "Change Plan",
      icon: Replace,
      component: <ChangePlan />,
      key: "change-plan"
    },
    {
      name: "Billing Info",
      icon: CreditCard,
      component: <BillingInfo />,
      key: "billing-info"
    },
    {
      name: "Email Services",
      icon: Mail,
      component: <EmailServicesPage />,
      key: "email-services"
    }
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your organization settings and preferences"
        icon={Settings}
        tabs={profileTabs}
      />
    </div>
  )
}

export default SettingsPage
