import { PageHeader } from "@/components/ui/PageHeader";
import { ChartNoAxesCombined } from "lucide-react";

const DashboardPage = () => {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your admin workspace."
        icon={ChartNoAxesCombined}
      />
      <div className="rounded-b-lg border border-t-0 p-8 text-muted-foreground">
        Dashboard analytics coming soon. Use the sidebar to manage users, roles, and permissions.
      </div>
    </div>
  );
};

export default DashboardPage;
