import { PageHeader, TabItem } from "@/components/ui/PageHeader"
import { Users, Building2, UserStar, History } from "lucide-react"

import ManageUserPage from "./user-management";
import ManageOrgPage from "./manage-organization";

import PaymentsPage from "./payment-history";


const AdministrationPage = () => {

  const allTabs: TabItem[] = [
    {
      name: "User Management",
      icon: Users,
      component: <ManageUserPage />,
      key: "manage-user"
    },
    {
      name: "Manage Organization",
      icon: Building2,
      component: <ManageOrgPage />,
      key: "manage-organization"
    },
    {
      name: "Payment History",
      icon: History,
      component: <PaymentsPage />,
      key: "payment-history"
    },
  ];

  return (
    <div>
      <PageHeader
        title="Administration"
        description="Manage your organization settings and preferences"
        icon={UserStar}
        tabs={allTabs}
      />
    </div>
  )
}

export default AdministrationPage;