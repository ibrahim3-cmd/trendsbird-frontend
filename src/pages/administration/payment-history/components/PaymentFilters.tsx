// payments/components/PaymentFilters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
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
import { PaymentStatus } from "@/types/payment.type";

interface PaymentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedOrgId: string;
  onOrgChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedOrgId,
  onOrgChange,
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: allOrgs } = useGetAllOrgQuery({
    page: 1,
    limit: 99999999,
  });

  // Payment types for the filter
  const PAYMENT_TYPES = [
    { value: "ALL", label: "All Types" },
    { value: "Plan", label: "Plan" },
    { value: "Credit", label: "Credit" },
  ];

  // Display text for selected range
  // const getDateRangeDisplay = () => {
  //   if (dateRange?.from && dateRange?.to) {
  //     return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
  //       dateRange.to,
  //       "MMM dd, yyyy"
  //     )}`;
  //   } else if (dateRange?.from) {
  //     return `From ${format(dateRange.from, "MMM dd, yyyy")}`;
  //   } else if (dateRange?.to) {
  //     return `Until ${format(dateRange.to, "MMM dd, yyyy")}`;
  //   }
  //   return "Pick a date range";
  // };

  const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";
  const organizations = Array.isArray(allOrgs?.data) ? allOrgs.data : [];
  const orgOptions = [
    { value: "ALL", label: "All Organizations" },
    ...organizations.map((org: { _id: string; orgName: string }) => ({
      value: org._id,
      label: org.orgName,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {Object.values(PaymentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="md:col-span-2">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organization filter - Only for SUPER_ADMIN */}
        {isSuperAdmin && (
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
            {hasActiveFilters ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Reset
              </>
            ) : (
              "Reset"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};