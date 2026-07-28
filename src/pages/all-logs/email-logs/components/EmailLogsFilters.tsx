// components/email-logs/components/EmailLogsFilters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search} from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

interface EmailLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedProvider: string;
  onProviderChange: (value: string) => void;
  selectedOrgId?: string;
  onOrgChange?: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onResetFilters: () => void;
  showOrgFilter?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "SENT", label: "Sent" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED", label: "Failed" },
];

const PROVIDER_OPTIONS = [
  { value: "ALL", label: "All Providers" },
  { value: "SENDGRID", label: "SendGrid" },
  { value: "MAILGUN", label: "Mailgun" },
  { value: "SMTP", label: "SMTP" },
];

export const EmailLogsFilters: React.FC<EmailLogsFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedProvider,
  onProviderChange,
  dateRange,
  onDateRangeChange,
  onResetFilters,
  showOrgFilter = false,
  selectedOrgId = "ALL",
  onOrgChange,
}) => {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: allOrgs } = useGetAllOrgQuery({
    page: 1,
    limit: 99999999,
  });

  const organizations = Array.isArray(allOrgs?.data) ? allOrgs.data : [];
  const orgOptions = [
    { value: "ALL", label: "All Organizations" },
    ...organizations.map((org: { _id: string; orgName: string }) => ({
      value: org._id,
      label: org.orgName,
    })),
  ];

  const hasActiveFilters = 
    search !== "" ||
    selectedStatus !== "ALL" ||
    selectedProvider !== "ALL" ||
    dateRange?.from ||
    dateRange?.to ||
    (showOrgFilter && selectedOrgId !== "ALL");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search - Only this keeps the icon */}
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects or recipients..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter - No icon */}
        <div className="md:col-span-2">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider Filter - No icon */}
        <div className="md:col-span-2">
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDER_OPTIONS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organization Filter (for super admin) - No icon */}
        {userData?.data?.role === "SUPER_ADMIN" && (
          <div className="md:col-span-2">
            <SearchSelect
              options={orgOptions}
              value={selectedOrgId}
              onChange={onOrgChange}
              placeholder="All Organizations"
              searchPlaceholder="Search organizations..."
            />
          </div>
        )}

        {/* Date Range Picker */}
        <div className="md:col-span-2">
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Pick a date range"
            className="w-full"
          />
        </div>

        {/* Reset Button */}
        <div className="md:col-span-1">
          <Button 
            variant={hasActiveFilters ? "default" : "outline"}
            className="w-full" 
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};