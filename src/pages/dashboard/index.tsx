import { PageHeader } from "@/components/ui/PageHeader"
import { ChartNoAxesCombined } from "lucide-react"

const DashboardPage = () => {
  return (
    <div className="">
        <PageHeader
          title="Admin Dashboard"
          description="System revenue summary and user/transaction analytics."
          icon={ChartNoAxesCombined}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="font-bold mb-4">Dashboard Analytics is coming soon...</p>
          </div>
        </div>
      </div>
  )
}

export default DashboardPage