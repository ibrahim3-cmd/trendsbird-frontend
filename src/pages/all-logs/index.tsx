import { PageHeader, TabItem } from "@/components/ui/PageHeader"
import {  Activity, ActivitySquare, DollarSign, MailSearch } from "lucide-react"

import LogsPage from "./system-logs";
import EmailLogsPage from "./email-logs";
import PaymentFailedLogsPage from "./payment-failures";


const AllLogsPage = () => {

  const profileTabs: TabItem[] = [
    {
      name: "System Logs",
      icon: ActivitySquare,
      component: < LogsPage/>,
      key: "logs"
    },
    {
      name: "Email Logs",
      icon: MailSearch,
      component: <EmailLogsPage />,
      key: "email-logs"
    },
    {
      name: "Payment Failures",
      icon: DollarSign,
      component: <PaymentFailedLogsPage />,
      key: "payment-failures"
    },
  ];

  return (
    <div>
      <PageHeader
        title="Logs"
        description="View and monitor system activities, user actions, and audit logs"
        icon={Activity}
        tabs={profileTabs}
      />

      {/* Example usage of usePermission hook */}
      {/*
      <div className="p-4 bg-gray-100 rounded-lg mt-4">
        <h3 className="font-semibold mb-2">Permission Example:</h3>
        <div className="flex gap-2">
          {can("manage-user", "create") && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Add User
            </button>
          )}
          {can("manage-user", "update") && (
            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Edit User
            </button>
          )}
          {can("manage-user", "delete") && (
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Delete User
            </button>
          )}
        </div>
      </div>
      */}
    </div>
  )
}

export default AllLogsPage;