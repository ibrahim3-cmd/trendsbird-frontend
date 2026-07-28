// components/TicketFilters.tsx
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Search,
  ChevronDown,
  XCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AgentType, CategoryType, FilterState, StatusOption } from "@/types/support.type";
import { getInitials } from "@/utils/supportUtils";



interface TicketFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number | DateRange | undefined) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  statusOptions: StatusOption[];
  agents: AgentType[];
  categories: CategoryType[];
  categoryFilterSearch: string;
  setCategoryFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  showCategoryFilterDropdown: boolean;
  setShowCategoryFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredCategoriesForFilter: () => CategoryType[];
  statusFilterSearch: string;
  setStatusFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  showStatusFilterDropdown: boolean;
  setShowStatusFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredStatusOptions: () => StatusOption[];
  agentFilterSearch: string;
  setAgentFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  showAgentFilterDropdown: boolean;
  setShowAgentFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredAgentsForFilter: () => AgentType[];
  onDeleteCategory: (categoryId: string) => void;
  userRole: string;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
  statusOptions,
  agents,
  categories,
  categoryFilterSearch,
  setCategoryFilterSearch,
  showCategoryFilterDropdown,
  setShowCategoryFilterDropdown,
  getFilteredCategoriesForFilter,
  statusFilterSearch,
  setStatusFilterSearch,
  showStatusFilterDropdown,
  setShowStatusFilterDropdown,
  getFilteredStatusOptions,
  agentFilterSearch,
  setAgentFilterSearch,
  showAgentFilterDropdown,
  setShowAgentFilterDropdown,
  getFilteredAgentsForFilter,
  onDeleteCategory,
  userRole,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const getDateRangeDisplay = () => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      return `${format(filters.dateRange.from, "MMM dd, yyyy")} - ${format(
        filters.dateRange.to,
        "MMM dd, yyyy"
      )}`;
    } else if (filters.dateRange?.from) {
      return `From ${format(filters.dateRange.from, "MMM dd, yyyy")}`;
    } else if (filters.dateRange?.to) {
      return `Until ${format(filters.dateRange.to, "MMM dd, yyyy")}`;
    }
    return "Pick a date range";
  };

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    onFilterChange("dateRange", dateRange);
    if (dateRange?.from) {
      const year = dateRange.from.getFullYear();
      const month = String(dateRange.from.getMonth() + 1).padStart(2, "0");
      const day = String(dateRange.from.getDate()).padStart(2, "0");
      onFilterChange("startDate", `${year}-${month}-${day}`);
    } else {
      onFilterChange("startDate", "");
    }
    if (dateRange?.to) {
      const year = dateRange.to.getFullYear();
      const month = String(dateRange.to.getMonth() + 1).padStart(2, "0");
      const day = String(dateRange.to.getDate()).padStart(2, "0");
      onFilterChange("endDate", `${year}-${month}-${day}`);
    } else {
      onFilterChange("endDate", "");
    }
  };

  const selectedStatus = statusOptions.find((opt) => opt.value === filters.status);
  const selectedAgent = agents.find((agent) => agent._id === filters.assignedTo);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Tickets */}
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by subject or description..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-8 h-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2 relative">
          <button
            type="button"
            onClick={() => {
              setShowStatusFilterDropdown(!showStatusFilterDropdown);
              if (!showStatusFilterDropdown) {
                setStatusFilterSearch("");
              }
            }}
            className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
          >
            <div className="flex items-center gap-2 min-w-0">
              {filters.status && selectedStatus?.icon ? (
                <>
                  <selectedStatus.icon
                    className={`h-4 w-4 flex-shrink-0 ${selectedStatus.color || "text-gray-600"}`}
                  />
                  <span className="text-gray-900 text-sm truncate">
                    {selectedStatus.label}
                  </span>
                </>
              ) : (
                <span className="text-gray-500 text-sm">All Status</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </button>

          {showStatusFilterDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setShowStatusFilterDropdown(false);
                  setStatusFilterSearch("");
                }}
              />
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={statusFilterSearch}
                      onChange={(e) => setStatusFilterSearch(e.target.value)}
                      placeholder="Search status..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-60">
                  {getFilteredStatusOptions().map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFilterChange("status", option.value);
                          setShowStatusFilterDropdown(false);
                          setStatusFilterSearch("");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              className={`h-4 w-4 ${option.color || "text-gray-600"}`}
                            />
                          )}
                          <span>{option.label}</span>
                        </div>
                      </button>
                    );
                  })}
                  {getFilteredStatusOptions().length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No status found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2 relative">
          <button
            type="button"
            onClick={() => {
              setShowCategoryFilterDropdown(!showCategoryFilterDropdown);
              if (!showCategoryFilterDropdown) {
                setCategoryFilterSearch("");
              }
            }}
            className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
          >
            <div className="flex items-center gap-2 min-w-0">
              {filters.category ? (
                <>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: categories.find(
                        (c) => c._id === filters.category
                      )?.color,
                    }}
                  />
                  <span className="text-gray-900 text-sm truncate">
                    {categories.find((c) => c._id === filters.category)?.name ||
                      "Select Category"}
                  </span>
                </>
              ) : (
                <span className="text-gray-500 text-sm">All Categories</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </button>

          {showCategoryFilterDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setShowCategoryFilterDropdown(false);
                  setCategoryFilterSearch("");
                }}
              />
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={categoryFilterSearch}
                      onChange={(e) => setCategoryFilterSearch(e.target.value)}
                      placeholder="Search category..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-60">
                  <button
                    onClick={() => {
                      onFilterChange("category", "");
                      setShowCategoryFilterDropdown(false);
                      setCategoryFilterSearch("");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <span>All Categories</span>
                    </div>
                  </button>
                  {getFilteredCategoriesForFilter().map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between hover:bg-gray-50 group"
                    >
                      <button
                        onClick={() => {
                          onFilterChange("category", category._id);
                          setShowCategoryFilterDropdown(false);
                          setCategoryFilterSearch("");
                        }}
                        className="flex-1 text-left px-4 py-2 transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: category.color,
                            }}
                          />
                          <span className="text-gray-900">{category.name}</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCategory(category._id);
                        }}
                        className="p-1.5 mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Delete category"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {getFilteredCategoriesForFilter().length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Assigned To Filter */}
        {userRole !== "SUPPORT_AGENT" && (
          <div className="md:col-span-2 relative">
            <button
              type="button"
              onClick={() => {
                setShowAgentFilterDropdown(!showAgentFilterDropdown);
                if (!showAgentFilterDropdown) {
                  setAgentFilterSearch("");
                }
              }}
              className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
            >
              <div className="flex items-center gap-2 min-w-0">
                {filters.assignedTo && selectedAgent ? (
                  <>
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-semibold">
                        {getInitials(selectedAgent.name)}
                      </span>
                    </div>
                    <span className="text-gray-900 text-sm truncate">
                      {selectedAgent.name}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 text-sm">All Agents</span>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

            {showAgentFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => {
                    setShowAgentFilterDropdown(false);
                    setAgentFilterSearch("");
                  }}
                />
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={agentFilterSearch}
                        onChange={(e) => setAgentFilterSearch(e.target.value)}
                        placeholder="Search agents..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-60">
                    <button
                      onClick={() => {
                        onFilterChange("assignedTo", "");
                        setShowAgentFilterDropdown(false);
                        setAgentFilterSearch("");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>All Agents</span>
                      </div>
                    </button>
                    {getFilteredAgentsForFilter().map((agent) => (
                      <button
                        key={agent._id}
                        onClick={() => {
                          onFilterChange("assignedTo", agent._id);
                          setShowAgentFilterDropdown(false);
                          setAgentFilterSearch("");
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-semibold">
                            {getInitials(agent.name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {agent.name}
                          </div>
                        </div>
                      </button>
                    ))}
                    {getFilteredAgentsForFilter().length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No agents found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Date Range Picker */}
        <div className={userRole !== "SUPPORT_AGENT" ? "md:col-span-2" : "md:col-span-3"}>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !filters.dateRange?.from &&
                  !filters.dateRange?.to &&
                  "text-muted-foreground"
                )}
              >
                <span className="truncate flex-1">{getDateRangeDisplay()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                className="p-3"
              />
              <div className="flex items-center justify-between p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDateRangeChange(undefined);
                    setIsCalendarOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsCalendarOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-1">
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            className="w-full"
            onClick={onClearAll}
            disabled={!hasActiveFilters}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;