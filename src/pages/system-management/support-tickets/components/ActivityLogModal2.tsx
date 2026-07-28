// components/modals/TicketActivityLogsModal.tsx
import React, { useState, useEffect } from "react";
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
// import { Button } from "@/components/ui/button";
import { useGetTicketActivitiesQuery } from "@/redux/features/support/supportApiSlice";

interface TicketActivityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
}

interface Activity {
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
  metadata?: Record<string, any>;
  changes?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
  };
  createdAt: string;
  updatedAt?: string;
}

// Activity type filters
const ACTIVITY_FILTERS = [
  { value: "all", label: "All Activities", icon: Activity },
  { value: "status", label: "Status Changes", icon: AlertCircle },
  { value: "assignment", label: "Assignments", icon: UserCheck },
  { value: "category", label: "Category Changes", icon: Tag },
  { value: "comment", label: "Comments", icon: MessageSquare },
  { value: "transfer", label: "Transfers", icon: ArrowRightLeft },
];

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case "CREATED":
      return <CheckCircle className="h-4 w-4" />;
    case "STATUS_CHANGED":
      return <AlertCircle className="h-4 w-4" />;
    case "ASSIGNED":
      return <UserCheck className="h-4 w-4" />;
    case "REASSIGNED":
      return <RefreshCw className="h-4 w-4" />;
    case "UNASSIGNED":
      return <UserMinus className="h-4 w-4" />;
    case "CATEGORY_CHANGED":
      return <Tag className="h-4 w-4" />;
    case "COMMENT_ADDED":
      return <MessageSquare className="h-4 w-4" />;
    case "UPDATED":
      return <FileEdit className="h-4 w-4" />;
    case "TRANSFER_REQUESTED":
      return <ArrowRightLeft className="h-4 w-4" />;
    case "TRANSFER_APPROVED":
      return <CheckCircle className="h-4 w-4" />;
    case "TRANSFER_REJECTED":
      return <XCircle className="h-4 w-4" />;
    case "TRANSFER_CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case "CREATED":
      return "bg-emerald-100 text-emerald-600";
    case "STATUS_CHANGED":
      return "bg-blue-100 text-blue-600";
    case "ASSIGNED":
      return "bg-purple-100 text-purple-600";
    case "REASSIGNED":
      return "bg-indigo-100 text-indigo-600";
    case "UNASSIGNED":
      return "bg-gray-100 text-gray-600";
    case "CATEGORY_CHANGED":
      return "bg-amber-100 text-amber-600";
    case "COMMENT_ADDED":
      return "bg-green-100 text-green-600";
    case "UPDATED":
      return "bg-cyan-100 text-cyan-600";
    case "TRANSFER_REQUESTED":
      return "bg-orange-100 text-orange-600";
    case "TRANSFER_APPROVED":
      return "bg-emerald-100 text-emerald-600";
    case "TRANSFER_REJECTED":
      return "bg-red-100 text-red-600";
    case "TRANSFER_CANCELLED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getUserName = (user: Activity["performedBy"]): string => {
  if (!user) return "System";
  
  // Try different name fields
  if (user.name) return user.name;
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  if (user.email) return user.email;
  
  return "Unknown User";
};

const formatActivityMessage = (activity: Activity): React.ReactNode => {
  const userName = getUserName(activity.performedBy);
  const userRole = activity.performedBy?.role;

  // Format username with role if it's an admin
  const displayName = userRole === "SUPER_ADMIN" 
    ? `${userName} (Super Admin)`
    : userName;

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
            <> to <strong>{activity.metadata.assignedToName}</strong></>
          )}
        </span>
      );

    case "REASSIGNED":
      return (
        <span>
          <strong>{displayName}</strong> reassigned ticket
          {activity.metadata?.previousAgentName && (
            <> from <strong>{activity.metadata.previousAgentName}</strong></>
          )}
          {activity.metadata?.assignedToName && (
            <> to <strong>{activity.metadata.assignedToName}</strong></>
          )}
        </span>
      );

    case "UNASSIGNED":
      return (
        <span>
          <strong>{displayName}</strong> unassigned the ticket
          {activity.metadata?.previousAgentName && (
            <> (was assigned to <strong>{activity.metadata.previousAgentName}</strong>)</>
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
              Reason: "{activity.metadata.reason}"
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
              Reason: "{activity.metadata.reason}"
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
};

export const TicketActivityLogsModal: React.FC<TicketActivityLogsModalProps> = ({
  isOpen,
  onClose,
  ticketId,
}) => {
  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filterType, setFilterType] = useState("all");

  // Query - No search parameter
  const {
    data: activitiesData,
    isLoading,
    isFetching,
    error,
  } = useGetTicketActivitiesQuery(
    { ticketId, page, limit, search: "" },
    {
      skip: !isOpen || !ticketId,
    }
  );

  const activities: Activity[] = activitiesData?.data?.activities || [];
  const pagination = activitiesData?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setFilterType("all");
    }
  }, [isOpen]);

  // Filter activities based on selected filter
  const filteredActivities = activities.filter((activity) => {
    if (filterType === "all") return true;
    
    switch (filterType) {
      case "status":
        return activity.activityType === "STATUS_CHANGED";
      case "assignment":
        return ["ASSIGNED", "REASSIGNED", "UNASSIGNED"].includes(activity.activityType);
      case "category":
        return activity.activityType === "CATEGORY_CHANGED";
      case "comment":
        return activity.activityType === "COMMENT_ADDED";
      case "transfer":
        return ["TRANSFER_REQUESTED", "TRANSFER_APPROVED", "TRANSFER_REJECTED", "TRANSFER_CANCELLED"].includes(activity.activityType);
      default:
        return true;
    }
  });

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilterType("all");
    setPage(1);
  };

  // Generate page numbers
  const getPageNumbers = () => {
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
  };

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
                    {pagination?.totalActivities || 0} activities tracked
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
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear filter
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setFilterType(filter.value);
                        setPage(1);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        filterType === filter.value
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {filter.label}
                      {filter.value === "all" && (
                        <span className="ml-1 text-xs opacity-80">
                          ({activities.length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content - Original Timeline Design */}
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
            ) : filteredActivities.length === 0 ? (
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
                  {filteredActivities.map((activity) => (
                    <div 
                      key={activity._id} 
                      className={cn(
                        "relative flex gap-4",
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
                          {formatActivityMessage(activity)}
                        </div>
                        {activity.metadata?.details && (
                          <p className="text-xs text-gray-500 mt-2">
                            {activity.metadata.details}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.createdAt).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(activity.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Pagination */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Results Info */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min((page - 1) * limit + 1, filteredActivities.length)}
                  </span>
                  {" - "}
                  <span className="font-medium">
                    {Math.min(page * limit, filteredActivities.length)}
                  </span>
                  {" of "}
                  <span className="font-medium">
                    {filteredActivities.length}
                  </span>
                  {filterType !== "all" && (
                    <span className="text-gray-500"> (filtered)</span>
                  )}
                </p>

                {/* Page Size Selector */}
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1 || isFetching}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    page === 1 || isFetching
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isFetching}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    page === 1 || isFetching
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                      disabled={isFetching || pageNum === "..."}
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
                  disabled={page === totalPages || isFetching}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    page === totalPages || isFetching
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages || isFetching}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    page === totalPages || isFetching
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
        </div>
      </div>
    </>
  );
};

export default TicketActivityLogsModal;