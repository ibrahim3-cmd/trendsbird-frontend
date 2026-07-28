import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentFailureSource, PaymentFailureReason } from "@/types/paymentFailedLog.type";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";

interface PaymentFailedLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedSource: PaymentFailureSource | "ALL";
  onSourceChange: (value: PaymentFailureSource | "ALL") => void;
  selectedReason: PaymentFailureReason | "ALL";
  onReasonChange: (value: PaymentFailureReason | "ALL") => void;
  selectedResolved: "ALL" | "true" | "false";
  onResolvedChange: (value: "ALL" | "true" | "false") => void;
  selectedOrgId: string;
  onOrgChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onResetFilters: () => void;
}

export const PaymentFailedLogsFilters: React.FC<PaymentFailedLogsFiltersProps> = ({
  search,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedReason,
  onReasonChange,
  selectedResolved,
  onResolvedChange,
  selectedOrgId,
  onOrgChange,
  dateRange,
  onDateRangeChange,
  onStartDateChange,
  onEndDateChange,
  onResetFilters,
}) => {
  const { data: userData } = useUserInfoQuery(undefined);
  const userRole = userData?.data?.role as string | undefined;
  const isSuperAdmin = userRole === role.superAdmin;

  const { data: orgsData } = useGetAllOrgQuery(
    undefined,
    { skip: !isSuperAdmin }
  );
  const organizations = orgsData?.data || [];

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from) {
      onStartDateChange(range.from.toISOString());
    }
    if (range?.to) {
      onEndDateChange(range.to.toISOString());
    }
  };

  const sourceOptions = [
    { value: "ALL", label: "All Sources" },
    { value: PaymentFailureSource.PLAN_PURCHASE, label: "Plan Purchase" },
    { value: PaymentFailureSource.PLAN_CHANGE, label: "Plan Change" },
    { value: PaymentFailureSource.SUBSCRIPTION_RENEWAL, label: "Subscription Renewal" },
    { value: PaymentFailureSource.CREDIT_PURCHASE, label: "Credit Purchase" },
    { value: PaymentFailureSource.JOB_PAYMENT, label: "Job Payment" },
    { value: PaymentFailureSource.INVOICE_PAYMENT, label: "Invoice Payment" },
    { value: PaymentFailureSource.OTHER, label: "Other" },
  ];

  const reasonOptions = [
    { value: "ALL", label: "All Reasons" },
    { value: PaymentFailureReason.CARD_DECLINED, label: "Card Declined" },
    { value: PaymentFailureReason.INSUFFICIENT_FUNDS, label: "Insufficient Funds" },
    { value: PaymentFailureReason.EXPIRED_CARD, label: "Expired Card" },
    { value: PaymentFailureReason.INVALID_CARD, label: "Invalid Card" },
    { value: PaymentFailureReason.AUTHENTICATION_FAILED, label: "Authentication Failed" },
    { value: PaymentFailureReason.PROCESSING_ERROR, label: "Processing Error" },
    { value: PaymentFailureReason.FRAUD_DETECTED, label: "Fraud Detected" },
    { value: PaymentFailureReason.NETWORK_ERROR, label: "Network Error" },
    { value: PaymentFailureReason.GATEWAY_ERROR, label: "Gateway Error" },
    { value: PaymentFailureReason.UNKNOWN, label: "Unknown" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by error, transaction ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSource} onValueChange={onSourceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {sourceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedReason} onValueChange={onReasonChange}>
          <SelectTrigger>
            <SelectValue placeholder="Failure Reason" />
          </SelectTrigger>
          <SelectContent>
            {reasonOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedResolved} onValueChange={onResolvedChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="false">Unresolved</SelectItem>
            <SelectItem value="true">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {isSuperAdmin && (
          <Select value={selectedOrgId} onValueChange={onOrgChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="All Organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Organizations</SelectItem>
              {organizations.map((org: any) => (
                <SelectItem key={org._id} value={org._id}>
                  {org.orgName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={onResetFilters}>
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
