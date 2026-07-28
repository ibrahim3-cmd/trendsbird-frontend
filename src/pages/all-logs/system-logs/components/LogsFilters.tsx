import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { ILog } from "@/types/log.type";

interface LogsFiltersProps {
  showFilters: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  selectedAction: string;
  onActionChange: (value: string) => void;
  selectedUser: string;
  onUserChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  actionTypes: string[];
  onResetFilters: () => void;
  onOrgChange: (value: string) => void;
  selectedOrgId?: string;
  logs: ILog[];
}

export const LogsFilters: React.FC<LogsFiltersProps> = ({
  showFilters,
  search,
  onSearchChange,
  selectedAction,
  onActionChange,
  dateRange,
  onDateRangeChange,
  onStartDateChange,
  onEndDateChange,
  actionTypes,
  onResetFilters,
  onOrgChange,
  selectedOrgId = "ALL",
}) => {
  const [isActionOpen, setIsActionOpen] = useState(false);

  const { data: userData } = useUserInfoQuery(undefined);
  const { data: allOrgs } = useGetAllOrgQuery({
    page: 1,
    limit: 99999999,
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    
    if (range?.from) {
      const year = range.from.getFullYear();
      const month = String(range.from.getMonth() + 1).padStart(2, "0");
      const day = String(range.from.getDate()).padStart(2, "0");
      onStartDateChange?.(`${year}-${month}-${day}`);
    } else {
      onStartDateChange?.("");
    }
    
    if (range?.to) {
      const year = range.to.getFullYear();
      const month = String(range.to.getMonth() + 1).padStart(2, "0");
      const day = String(range.to.getDate()).padStart(2, "0");
      onEndDateChange?.(`${year}-${month}-${day}`);
    } else {
      onEndDateChange?.("");
    }
  };

  const organizations = Array.isArray(allOrgs?.data) ? allOrgs.data : [];
  const orgOptions = [
    { value: "ALL", label: "All Organizations" },
    ...organizations.map((org: { _id: string; orgName: string }) => ({
      value: org._id,
      label: org.orgName,
    })),
  ];

  // Check if any filters are active
  const hasActiveFilters = 
    search !== "" ||
    selectedAction !== "ALL" ||
    selectedOrgId !== "ALL" ||
    dateRange?.from ||
    dateRange?.to;

  return (
    <div
      className={cn(
        "space-y-4 transition-all duration-300",
        showFilters ? "block" : "hidden"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Details */}
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search log details..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Organization filter */}
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

        {/* Action filter */}
        <div className="md:col-span-2">
          <Popover open={isActionOpen} onOpenChange={setIsActionOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-9"
              >
                <span className="truncate">
                  {selectedAction === "ALL" ? "All Actions" : selectedAction}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search actions..." />
                <CommandList>
                  <CommandEmpty>No actions found</CommandEmpty>
                  <CommandItem
                    value="ALL"
                    onSelect={() => {
                      onActionChange("ALL");
                      setIsActionOpen(false);
                    }}
                  >
                    All Actions
                  </CommandItem>
                  {Array.isArray(actionTypes) && actionTypes?.map((action) => (
                    <CommandItem
                      key={action}
                      value={action}
                      onSelect={() => {
                        onActionChange(action);
                        setIsActionOpen(false);
                      }}
                    >
                      {action}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Picker */}
        <div className="md:col-span-2">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
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