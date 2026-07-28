// components/modals/TicketActivityLogsModal.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  History,
  Tag,
  UserCheck,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  UserMinus,
  RefreshCw,
  ArrowRightLeft,
  XCircle,
  FileEdit,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useGetTicketActivitiesQuery } from "@/redux/features/support/supportApiSlice";

interface TicketActivityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
}

interface ActivityMetadata {
  assignedToName?: string;
  previousAgentName?: string;
  reason?: string;
  details?: string;
}

interface ActivityType {
  _id: string;
  ticketId: string;
  activityType: 
    | "CREATED"
    | "STATUS_CHANGED"
    | "ASSIGNED"
    | "REASSIGNED"
    | "UNASSIGNED"
    | "CATEGORY_CHANGED"
    | "COMMENT_ADDED"
    | "UPDATED"
    | "TRANSFER_REQUESTED"
    | "TRANSFER_APPROVED"
    | "TRANSFER_REJECTED"
    | "TRANSFER_CANCELLED";
  performedBy?: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  } | null;
  assignedTo?: {
    _id: string;
    name?: string;
    email?: string;
  } | null;
  oldStatus?: string;
  newStatus?: string;
  oldCategory?: {
    _id: string;
    name: string;
    color?: string;
  } | null;
  newCategory?: {
    _id: string;
    name: string;
    color?: string;
  } | null;
  // metadata?: Record<string, unknown>;
  metadata?: ActivityMetadata;
  changes?: {
    field?: string;
    oldValue?: unknown;
    newValue?: unknown;
  };
  createdAt: string;
  updatedAt?: string;
}

// Page size options
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

// Activity type filters - matches backend FILTER_TYPE_MAP keys
const ACTIVITY_FILTERS = [
  { value: "all", label: "All Activities", icon: Activity },
  { value: "status", label: "Status Changes", icon: AlertCircle },
  { value: "assignment", label: "Assignments", icon: UserCheck },
  { value: "category", label: "Category Changes", icon: Tag },
  { value: "transfer", label: "Transfers", icon: ArrowRightLeft },
] as const;

// Memoized icon getter - returns icon component
const ACTIVITY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  CREATED: CheckCircle,
  STATUS_CHANGED: AlertCircle,
  ASSIGNED: UserCheck,
  REASSIGNED: RefreshCw,
  UNASSIGNED: UserMinus,
  CATEGORY_CHANGED: Tag,
  COMMENT_ADDED: MessageSquare,
  UPDATED: FileEdit,
  TRANSFER_REQUESTED: ArrowRightLeft,
  TRANSFER_APPROVED: CheckCircle,
  TRANSFER_REJECTED: XCircle,
  TRANSFER_CANCELLED: XCircle,
};

// Memoized color getter
const ACTIVITY_COLORS: Record<string, string> = {
  CREATED: "bg-emerald-100 text-emerald-600",
  STATUS_CHANGED: "bg-blue-100 text-blue-600",
  ASSIGNED: "bg-purple-100 text-purple-600",
  REASSIGNED: "bg-indigo-100 text-indigo-600",
  UNASSIGNED: "bg-gray-100 text-gray-600",
  CATEGORY_CHANGED: "bg-amber-100 text-amber-600",
  COMMENT_ADDED: "bg-green-100 text-green-600",
  UPDATED: "bg-cyan-100 text-cyan-600",
  TRANSFER_REQUESTED: "bg-orange-100 text-orange-600",
  TRANSFER_APPROVED: "bg-emerald-100 text-emerald-600",
  TRANSFER_REJECTED: "bg-red-100 text-red-600",
  TRANSFER_CANCELLED: "bg-gray-100 text-gray-600",
};

const getActivityIcon = (activityType: string) => {
  const IconComponent = ACTIVITY_ICONS[activityType] || Clock;
  return <IconComponent className="h-4 w-4" />;
};

const getActivityColor = (activityType: string) => {
  return ACTIVITY_COLORS[activityType] || "bg-gray-100 text-gray-600";
};

const getUserName = (user: ActivityType["performedBy"]): string => {
  if (!user) return "System";
  if (user.name) return user.name;
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  if (user.email) return user.email;
  return "Unknown User";
};

// Memoized Activity Item Component
const ActivityItem = React.memo(({ 
  activity, 
  isFetching 
}: { 
  activity: ActivityType; 
  isFetching: boolean;
}) => {
  const userName = getUserName(activity.performedBy);
  const userRole = activity.performedBy?.role;
  const displayName = userRole === "SUPER_ADMIN" 
    ? `${userName} (Super Admin)`
    : userName;

  const formattedMessage = useMemo(() => {
    switch (activity.activityType) {
      case "CREATED":
        return (
          <span>
            <strong>{displayName}</strong> created this ticket
          </span>
        );
      case "STATUS_CHANGED":
        return (
          <span>
            <strong>{displayName}</strong> changed status
            {activity.oldStatus && activity.newStatus && (
              <>
                {" from "}
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                  {activity.oldStatus}
                </span>
                <ArrowRight className="h-3 w-3 inline mx-1" />
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                  {activity.newStatus}
                </span>
              </>
            )}
          </span>
        );
      case "ASSIGNED":
        return (
          <span>
            <strong>{displayName}</strong> assigned ticket
            {activity.metadata?.assignedToName && (
              <> to <strong>{activity.metadata.assignedToName as string}</strong></>
            )}
          </span>
        );
      case "REASSIGNED":
        return (
          <span>
            <strong>{displayName}</strong> reassigned ticket
            {activity.metadata?.previousAgentName && (
              <> from <strong>{activity.metadata.previousAgentName as string}</strong></>
            )}
            {activity.metadata?.assignedToName && (
              <> to <strong>{activity.metadata.assignedToName as string}</strong></>
            )}
          </span>
        );
      case "UNASSIGNED":
        return (
          <span>
            <strong>{displayName}</strong> unassigned the ticket
            {activity.metadata?.previousAgentName && (
              <> (was assigned to <strong>{activity.metadata.previousAgentName as string}</strong>)</>
            )}
          </span>
        );
      case "CATEGORY_CHANGED":
        return (
          <span>
            <strong>{displayName}</strong> changed category
            {(activity.oldCategory || activity.newCategory) && (
              <>
                {" from "}
                <span className="font-medium text-gray-700">
                  {activity.oldCategory?.name || "None"}
                </span>
                {" to "}
                <span className="font-medium text-primary">
                  {activity.newCategory?.name || "None"}
                </span>
              </>
            )}
          </span>
        );
      case "COMMENT_ADDED":
        return (
          <span>
            <strong>{displayName}</strong> added a comment
          </span>
        );
      case "TRANSFER_REQUESTED":
        return (
          <span>
            <strong>{displayName}</strong> requested ticket transfer
            {activity.metadata?.reason && (
              <span className="block text-xs text-gray-500 mt-1 italic">
                Reason: &quot;{activity.metadata.reason as string}&quot;
              </span>
            )}
          </span>
        );
      case "TRANSFER_APPROVED":
        return (
          <span>
            <strong>{displayName}</strong> approved transfer request
          </span>
        );
      case "TRANSFER_REJECTED":
        return (
          <span>
            <strong>{displayName}</strong> rejected transfer request
            {activity.metadata?.reason && (
              <span className="block text-xs text-gray-500 mt-1 italic">
                Reason: &quot;{activity.metadata.reason as string}&quot;
              </span>
            )}
          </span>
        );
      case "TRANSFER_CANCELLED":
        return (
          <span>
            <strong>{displayName}</strong> cancelled transfer request
          </span>
        );
      default:
        return (
          <span>
            <strong>{displayName}</strong> performed {activity.activityType.toLowerCase().replace(/_/g, " ")}
          </span>
        );
    }
  }, [activity, displayName]);

  const formattedDate = useMemo(() => {
    const date = new Date(activity.createdAt);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }, [activity.createdAt]);

  return (
    <div 
      className={cn(
        "relative flex gap-4 transition-opacity",
        isFetching && "opacity-60"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
          getActivityColor(activity.activityType)
        )}
      >
        {getActivityIcon(activity.activityType)}
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 rounded-xl p-4 min-w-0">
        <div className="text-sm text-gray-700 mb-1">
          {formattedMessage}
        </div>
        {activity.metadata?.details && (
          <p className="text-xs text-gray-500 mt-2">
            {activity.metadata.details as string}
          </p>
        )}
        <div className="text-xs text-gray-500 flex items-center gap-2 mt-2">
          <Clock className="h-3 w-3" />
          {formattedDate.date} at {formattedDate.time}
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

// Memoized Filter Button Component
const FilterButton = React.memo(({ 
  filter, 
  isActive, 
  isFetching, 
  totalActivities,
  onClick 
}: { 
  filter: typeof ACTIVITY_FILTERS[number];
  isActive: boolean;
  isFetching: boolean;
  totalActivities: number;
  onClick: () => void;
}) => {
  const Icon = filter.icon;
  
  return (
    <button
      onClick={onClick}
      disabled={isFetching}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50",
        isActive
          ? "bg-primary text-white shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {filter.label}
      {isActive && (
        <span className="ml-1 text-xs opacity-80">
          ({totalActivities})
        </span>
      )}
    </button>
  );
});

FilterButton.displayName = "FilterButton";

export const TicketActivityLogsModal: React.FC<TicketActivityLogsModalProps> = ({
  isOpen,
  onClose,
  ticketId,
}) => {
  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterType, setFilterType] = useState("all");

  // Query - Now includes filterType for backend filtering
  const {
    data: activitiesData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetTicketActivitiesQuery(
    { ticketId, page, limit, filterType },
    {
      skip: !isOpen || !ticketId,
    }
  );

  // Memoized data extraction
  const { activities, pagination, totalPages, totalActivities } = useMemo(() => {
    const acts: ActivityType[] = activitiesData?.data?.activities || [];
    const pag = activitiesData?.data?.pagination;
    return {
      activities: acts,
      pagination: pag,
      totalPages: pag?.totalPages || 1,
      totalActivities: pag?.totalActivities || 0,
    };
  }, [activitiesData]);

  console.log(pagination)

  // Memoized pagination info
  const paginationInfo = useMemo(() => {
    const start = Math.min((page - 1) * limit + 1, totalActivities);
    const end = Math.min(page * limit, totalActivities);
    return { start, end };
  }, [page, limit, totalActivities]);

  // Memoized page numbers generation
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setFilterType("all");
      refetch();
    }
  }, [isOpen, refetch]);

  // Memoized handlers
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilterType(newFilter);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterType("all");
    setPage(1);
  }, []);

  // Memoized pagination button states
  const paginationState = useMemo(() => ({
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
    canNavigate: !isFetching,
  }), [page, totalPages, isFetching]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Activity Log</h2>
                  <p className="text-sm text-gray-500">
                    {totalActivities} {filterType !== "all" ? "matching " : ""}activities
                    {isFetching && !isLoading && (
                      <Loader2 className="inline h-3 w-3 ml-2 animate-spin" />
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by activity
                </span>
                {filterType !== "all" && (
                  <button
                    onClick={handleClearFilters}
                    disabled={isFetching}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear filter
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_FILTERS.map((filter) => (
                  <FilterButton
                    key={filter.value}
                    filter={filter}
                    isActive={filterType === filter.value}
                    isFetching={isFetching}
                    totalActivities={totalActivities}
                    onClick={() => handleFilterChange(filter.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content - Timeline Design */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading activities...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Failed to load activity logs</p>
                <p className="text-sm text-gray-500 mt-1">Please try again later</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {filterType !== "all" 
                    ? "No activities match this filter"
                    : "No activity logs found"}
                </p>
                {filterType !== "all" && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View all activities
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {activities.map((activity) => (
                    <ActivityItem
                      key={activity._id}
                      activity={activity}
                      isFetching={isFetching}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Pagination */}
          {activities.length > 0 && (
            <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Results Info */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">{paginationInfo.start}</span>
                    {" - "}
                    <span className="font-medium">{paginationInfo.end}</span>
                    {" of "}
                    <span className="font-medium">{totalActivities}</span>
                    {filterType !== "all" && (
                      <span className="text-gray-500"> (filtered)</span>
                    )}
                  </p>

                  {/* Page Size Selector */}
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    disabled={isFetching}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={paginationState.isFirstPage || !paginationState.canNavigate}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      paginationState.isFirstPage || !paginationState.canNavigate
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={paginationState.isFirstPage || !paginationState.canNavigate}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      paginationState.isFirstPage || !paginationState.canNavigate
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-1 mx-1">
                    {pageNumbers.map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                        disabled={!paginationState.canNavigate || pageNum === "..."}
                        className={cn(
                          "min-w-[28px] h-[28px] text-sm rounded-lg font-medium transition-all",
                          pageNum === page
                            ? "bg-primary text-white"
                            : pageNum === "..."
                            ? "cursor-default"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={paginationState.isLastPage || !paginationState.canNavigate}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      paginationState.isLastPage || !paginationState.canNavigate
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={paginationState.isLastPage || !paginationState.canNavigate}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      paginationState.isLastPage || !paginationState.canNavigate
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title="Last page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketActivityLogsModal;