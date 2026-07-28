



// components/modals/TicketActivityLogsModal.tsx
import React from "react";
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
  UserX,
  Repeat,
  Send,
  ShieldCheck,
  ShieldX,
  XCircle,
  FileEdit,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  performedBy: {
    _id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    _id: string;
    name?: string;
    email: string;
  };
  oldStatus?: string;
  newStatus?: string;
  oldCategory?: {
    _id: string;
    name: string;
    color?: string;
  };
  newCategory?: {
    _id: string;
    name: string;
    color?: string;
  };
  metadata?: {
    message?: string;
    details?: string;
    assignedToName?: string;
    assignedToEmail?: string;
    previousAgent?: string;
    previousAgentName?: string;
    previousAgentEmail?: string;
    fromAgent?: string;
    toAgent?: string;
    requestedBy?: string;
    reason?: string;
    subject?: string;
    initialStatus?: string;
    createdByName?: string;
    [key: string]: any;
  };
  changes?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
  };
  createdAt: string;
  updatedAt?: string;
}

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case "CREATED":
      return <CheckCircle className="h-4 w-4" />;
    case "STATUS_CHANGED":
      return <AlertCircle className="h-4 w-4" />;
    case "ASSIGNED":
      return <UserCheck className="h-4 w-4" />;
    case "REASSIGNED":
      return <Repeat className="h-4 w-4" />;
    case "UNASSIGNED":
      return <UserX className="h-4 w-4" />;
    case "CATEGORY_CHANGED":
      return <Tag className="h-4 w-4" />;
    case "COMMENT_ADDED":
      return <MessageSquare className="h-4 w-4" />;
    case "UPDATED":
      return <FileEdit className="h-4 w-4" />;
    case "TRANSFER_REQUESTED":
      return <Send className="h-4 w-4" />;
    case "TRANSFER_APPROVED":
      return <ShieldCheck className="h-4 w-4" />;
    case "TRANSFER_REJECTED":
      return <ShieldX className="h-4 w-4" />;
    case "TRANSFER_CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case "CREATED":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "STATUS_CHANGED":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
    case "ASSIGNED":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
    case "REASSIGNED":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400";
    case "UNASSIGNED":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "CATEGORY_CHANGED":
      return "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
    case "COMMENT_ADDED":
      return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
    case "UPDATED":
      return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400";
    case "TRANSFER_REQUESTED":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
    case "TRANSFER_APPROVED":
      return "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400";
    case "TRANSFER_REJECTED":
      return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    case "TRANSFER_CANCELLED":
      return "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
};

const formatActivityMessage = (activity: Activity): React.ReactNode => {
  const userName = activity.performedBy?.name || activity.performedBy?.email || "System";

  switch (activity.activityType) {
    case "CREATED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> created this ticket
          </p>
          {activity.metadata?.subject && (
            <p className="text-xs text-gray-500 mt-1">
              Subject: <span className="font-medium">{activity.metadata.subject}</span>
            </p>
          )}
          {activity.metadata?.initialStatus && (
            <p className="text-xs text-gray-500">
              Initial Status:{" "}
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                {activity.metadata.initialStatus}
              </span>
            </p>
          )}
        </div>
      );

    case "STATUS_CHANGED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> changed status
          </p>
          {activity.oldStatus && activity.newStatus && (
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                {activity.oldStatus}
              </span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                {activity.newStatus}
              </span>
            </div>
          )}
          {activity.metadata?.details && (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          )}
        </div>
      );

    case "ASSIGNED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> assigned ticket
          </p>
          {activity.metadata?.assignedToName && (
            <p className="text-xs text-gray-600 mt-1">
              Assigned to:{" "}
              <strong className="text-primary">{activity.metadata.assignedToName}</strong>
              {activity.metadata?.assignedToEmail && (
                <span className="text-gray-500"> ({activity.metadata.assignedToEmail})</span>
              )}
            </p>
          )}
        </div>
      );

    case "REASSIGNED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> reassigned ticket
          </p>
          <div className="mt-2 space-y-1">
            {activity.metadata?.previousAgentName && (
              <p className="text-xs text-gray-500">
                From: <strong>{activity.metadata.previousAgentName}</strong>
              </p>
            )}
            {activity.metadata?.assignedToName && (
              <p className="text-xs text-gray-600">
                To: <strong className="text-primary">{activity.metadata.assignedToName}</strong>
              </p>
            )}
          </div>
          {activity.metadata?.message && (
            <p className="text-xs text-gray-500 mt-1 italic">{activity.metadata.message}</p>
          )}
        </div>
      );

    case "UNASSIGNED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> unassigned ticket
          </p>
          {activity.metadata?.previousAgentName && (
            <p className="text-xs text-gray-500 mt-1">
              Previously assigned to: <strong>{activity.metadata.previousAgentName}</strong>
            </p>
          )}
          {activity.metadata?.details && (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          )}
        </div>
      );

    case "CATEGORY_CHANGED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> changed category
          </p>
          {activity.oldCategory || activity.newCategory ? (
            <div className="flex items-center gap-2 mt-2">
              {activity.oldCategory ? (
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                  {activity.oldCategory.name}
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-400">
                  None
                </span>
              )}
              <ArrowRight className="h-3 w-3 text-gray-400" />
              {activity.newCategory ? (
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: activity.newCategory.color
                      ? `${activity.newCategory.color}20`
                      : undefined,
                    color: activity.newCategory.color || undefined,
                  }}
                >
                  {activity.newCategory.name}
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-400">
                  None
                </span>
              )}
            </div>
          ) : activity.metadata?.details ? (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          ) : null}
        </div>
      );

    case "COMMENT_ADDED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> added a comment
          </p>
          {activity.metadata?.comment && (
            <p className="text-xs text-gray-600 mt-1 italic border-l-2 border-gray-300 pl-2">
              "{activity.metadata.comment}"
            </p>
          )}
        </div>
      );

    case "UPDATED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> updated the ticket
          </p>
          {activity.changes?.field && (
            <p className="text-xs text-gray-500 mt-1">
              Changed {activity.changes.field}
              {activity.changes.oldValue && activity.changes.newValue && (
                <>
                  {" "}
                  from <strong>{activity.changes.oldValue}</strong> to{" "}
                  <strong className="text-primary">{activity.changes.newValue}</strong>
                </>
              )}
            </p>
          )}
          {activity.metadata?.details && (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          )}
        </div>
      );

    case "TRANSFER_REQUESTED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> requested ticket transfer
          </p>
          {activity.metadata?.reason && (
            <p className="text-xs text-gray-600 mt-1">
              Reason: <span className="italic">"{activity.metadata.reason}"</span>
            </p>
          )}
        </div>
      );

    case "TRANSFER_APPROVED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> approved ticket transfer
          </p>
          {activity.metadata?.details && (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          )}
        </div>
      );

    case "TRANSFER_REJECTED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> rejected ticket transfer
          </p>
          {activity.metadata?.reason && (
            <p className="text-xs text-gray-600 mt-1">
              Reason: <span className="italic">"{activity.metadata.reason}"</span>
            </p>
          )}
        </div>
      );

    case "TRANSFER_CANCELLED":
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> cancelled ticket transfer
          </p>
          {activity.metadata?.reason && (
            <p className="text-xs text-gray-600 mt-1">
              Reason: <span className="italic">"{activity.metadata.reason}"</span>
            </p>
          )}
        </div>
      );

    default:
      return (
        <div>
          <p>
            <strong className="text-gray-900">{userName}</strong> performed an action
          </p>
          {activity.metadata?.details && (
            <p className="text-xs text-gray-500 mt-1">{activity.metadata.details}</p>
          )}
        </div>
      );
  }
};

export const TicketActivityLogsModal: React.FC<TicketActivityLogsModalProps> = ({
  isOpen,
  onClose,
  ticketId,
}) => {
  const {
    data: activitiesData,
    isLoading,
    error,
  } = useGetTicketActivitiesQuery(
    { ticketId, page: 1, limit: 100000 },
    {
      skip: !isOpen || !ticketId,
    }
  );

  const activities: Activity[] = activitiesData?.data?.activities || [];
  const pagination = activitiesData?.data?.pagination;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Activity Timeline
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination?.totalActivities || 0} activities tracked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Loading activity logs...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Failed to load activities</p>
                <p className="text-sm text-gray-500 mt-2">Please try again later</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-16">
                <History className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  No activity logs found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Activities will appear here as actions are performed
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-gray-200 to-transparent dark:via-gray-700" />

                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity._id}
                      className="relative flex gap-4 group animate-in fade-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-900 transition-transform group-hover:scale-110",
                          getActivityColor(activity.activityType)
                        )}
                      >
                        {getActivityIcon(activity.activityType)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-w-0 hover:shadow-md transition-shadow">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {formatActivityMessage(activity)}
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(activity.createdAt).toLocaleTimeString("en-US", {
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

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {activities.length} of {pagination?.totalActivities || 0} activities
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketActivityLogsModal;


// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import {
//   Search,
//   Filter,
//   Eye,
//   UserCheck,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   ChevronLeft,
//   ChevronRight,
//   MessageSquare,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   User,
//   Calendar,
//   BarChart3,
//   Users,
//   Settings,
//   Mail,
//   BadgeCheck,
//   Loader2,
//   RefreshCw,
//   Tag,
//   Plus,
// } from "lucide-react";

// // UI Components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { DateRange } from "react-day-picker";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// // Redux Hooks
// import {
//   useGetAllSupportTicketsQuery,
//   useUpdateSupportTicketStatusMutation,
//   useAssignSupportTicketMutation,
//   useDeleteSupportTicketMutation,
//   useGetSupportCategoriesQuery,
//   useCreateSupportCategoryMutation,
//   useDeleteSupportCategoryMutation,
//   useUpdateSupportCategoryMutation,
//   useUpdateSupportTicketCategoryMutation,

// } from "@/redux/features/support/supportApiSlice";
// import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
// import PermissionGate from "@/components/layout/PermissionGate";
// import { ManageSupportCategoryModal } from "./components/ManageSupportCategoryModal";


// // --------------------- Types ---------------------
// interface CreatedByType {
//   _id: string;
//   name?: string;
//   firstName?: string;
//   lastName?: string;
//   email: string;
// }

// interface AssignedUserType {
//   _id: string;
//   name?: string;
//   firstName?: string;
//   lastName?: string;
//   email: string;
// }

// interface CategoryType {
//   _id: string;
//   name: string;
//   color: string;
//   description?: string;
// }

// interface CommentType {
//   _id: string;
//   content: string;
//   commentedBy: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
// }

// interface TicketType {
//   _id: string;
//   subject: string;
//   description: string;
//   status: TicketStatus;
//   isPublic: boolean;
//   category?: CategoryType;
//   createdBy?: CreatedByType;
//   createdByModel?: string;
//   publicUserInfo?: {
//     name?: string;
//     email?: string;
//   };
//   assignedTo?: AssignedUserType;
//   assignedBy?: AssignedUserType;
//   comments?: CommentType[];
//   createdAt: string;
//   updatedAt: string;
//   resolvedAt?: string;
// }

// type TicketStatus = "Pending" | "Open" | "In Progress" | "Resolved" | "Closed";

// interface FilterState {
//   page: number;
//   limit: number;
//   search: string;
//   status: string;
//   assignedTo: string;
//   category: string;
//   startDate: string;
//   endDate: string;
//   dateRange?: DateRange;
// }

// interface StatsType {
//   totalPending: number;
//   totalOpen: number;
//   totalInProgress: number;
//   totalResolved: number;
//   totalClosed: number;
// }

// interface StatusOption {
//   value: string;
//   label: string;
//   icon?: React.ComponentType<{ className?: string }>;
//   color?: string;
// }

// // interface SelectOption {
// //   value: string;
// //   label: string;
// //   color?: string;
// // }

// type LoadingState = "updating" | "assigning" | "deleting" | "updating-category";

// // --------------------- Constants ---------------------
// const TICKET_STATUSES: TicketStatus[] = [
//   "Pending",
//   "Open",
//   "In Progress",
//   "Resolved",
//   "Closed",
// ];

// const STATUS_OPTIONS: StatusOption[] = [
//   { value: "", label: "All Status" },
//   { value: "Pending", label: "Pending", icon: Clock, color: "text-orange-600" },
//   { value: "Open", label: "Open", icon: AlertCircle, color: "text-blue-600" },
//   {
//     value: "In Progress",
//     label: "In Progress",
//     icon: Clock,
//     color: "text-yellow-600",
//   },
//   {
//     value: "Resolved",
//     label: "Resolved",
//     icon: CheckCircle,
//     color: "text-green-600",
//   },
//   { value: "Closed", label: "Closed", icon: XCircle, color: "text-gray-600" },
// ];

// const INITIAL_FILTERS: FilterState = {
//   page: 1,
//   limit: 10,
//   search: "",
//   status: "",
//   assignedTo: "",
//   category: "",
//   startDate: "",
//   endDate: "",
// };

// // --------------------- Helper Functions ---------------------
// const getStatusColor = (status: string): string => {
//   const statusColors: Record<string, string> = {
//     Pending: "bg-orange-100 text-orange-800",
//     Open: "bg-blue-100 text-blue-800",
//     "In Progress": "bg-yellow-100 text-yellow-800",
//     Resolved: "bg-green-100 text-green-800",
//     Closed: "bg-gray-100 text-gray-800",
//   };
//   return statusColors[status] || "bg-gray-100 text-gray-800";
// };

// const getCreatorInfo = (
//   ticket: TicketType
// ): { name: string; email: string } => {
//   const creatorInfo = ticket?.createdBy || ticket?.publicUserInfo;

//   let name = "";
//   if (creatorInfo) {
//     if ("firstName" in creatorInfo && creatorInfo.firstName) {
//       name = `${creatorInfo.name || ""}`.trim();
//     } else if ("name" in creatorInfo) {
//       name = creatorInfo.name || "";
//     }
//   }

//   const email = creatorInfo?.email || "N/A";
//   return { name, email };
// };

// const getAssignedUserName = (user?: AssignedUserType): string => {
//   if (!user) return "";
//   if (user.firstName) {
//     return `${user.firstName} ${user.lastName || ""}`.trim();
//   }
//   return user.name || "";
// };

// const getInitials = (name?: string): string => {
//   if (!name) return "??";
//   const parts = name.split(" ");
//   if (parts.length >= 2) {
//     return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
//   }
//   return name.slice(0, 2).toUpperCase();
// };

// const formatDate = (dateString?: string): string => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString();
// };

// const formatTime = (dateString?: string): string => {
//   if (!dateString) return "";
//   return new Date(dateString).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// // --------------------- Main Component ---------------------
// const SupportTicketManagementPage: React.FC = () => {
//   const navigate = useNavigate();

//   // --------------------- User Data ---------------------
//   const { data: userData, isLoading: isUserLoading } =
//     useUserInfoQuery(undefined);
//   const user = userData?.data;
//   const userRole = user?.role;

//   // --------------------- State ---------------------
//   const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [loadingStates, setLoadingStates] = useState<
//     Record<string, LoadingState>
//   >({});
//   const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
//   const [showManageCategoryModal, setShowManageCategoryModal] = useState(false);

//   // Category & Assignment dropdown states
//   const [categorySearchTerm, setCategorySearchTerm] = useState<
//     Record<string, string>
//   >({});
//   // console.log("ss = ",categorySearchTerm)
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState<
//     Record<string, boolean>
//   >({});
//   const [showAssignDropdown, setShowAssignDropdown] = useState<
//     Record<string, boolean>
//   >({});
//   const [assignSearchTerm, setAssignSearchTerm] = useState<
//     Record<string, string>
//   >({});
//   const [creatingCategory, setCreatingCategory] = useState(false);
//   const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
//   console.log("ss = ", categoryFilterSearch)
//   const [showCategoryFilterDropdown, setShowCategoryFilterDropdown] =
//     useState(false);

//   // Filter dropdown states
//   const [statusFilterSearch, setStatusFilterSearch] = useState("");
//   const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
//   const [agentFilterSearch, setAgentFilterSearch] = useState("");
//   const [showAgentFilterDropdown, setShowAgentFilterDropdown] = useState(false);

//   const { data: supportAgentsData } = useGetAllSupportAgentsQuery({
//     page: 1,
//     limit: 1000000,
//   });

//   const {
//     data: supportCategoriesData,
//     isFetching: isSupportCategoryFetching,
//     refetch: refetchCategories,
//   } = useGetSupportCategoriesQuery();

//   // --------------------- Debounce Search ---------------------
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(filters.search);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [filters.search]);

//   // --------------------- API Hooks ---------------------
//   const queryParams = useMemo(() => {
//     const params: Record<string, unknown> = {
//       page: filters.page,
//       limit: filters.limit,
//       search: debouncedSearch,
//     };
//     if (filters.status) params.status = filters.status;
//     if (filters.assignedTo) params.assignedTo = filters.assignedTo;
//     if (filters.category) params.category = filters.category;
//     if (filters.startDate) params.startDate = filters.startDate;
//     if (filters.endDate) params.endDate = filters.endDate;
//     return params;
//   }, [filters, debouncedSearch]);

//   const {
//     data: ticketsData,
//     isLoading: isTicketsLoading,
//     isFetching,
//     refetch,
//   } = useGetAllSupportTicketsQuery(queryParams, {
//     refetchOnMountOrArgChange: true,
//     refetchOnFocus: false,
//   });

//   const [updateStatus] = useUpdateSupportTicketStatusMutation();
//   const [updateCategory] = useUpdateSupportTicketCategoryMutation();
//   const [assignTicket] = useAssignSupportTicketMutation();
//   const [deleteTicket] = useDeleteSupportTicketMutation();
//   const [createCategory] = useCreateSupportCategoryMutation();
//   const [deleteCategoryMutation] = useDeleteSupportCategoryMutation();

//   // --------------------- Refetch on Mount ---------------------
//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   // --------------------- Derived Data ---------------------
//   const tickets: TicketType[] = ticketsData?.data || [];
//   console.log(tickets)
//   const total = ticketsData?.meta?.total ?? 0;
//   const totalPages =
//     ticketsData?.meta?.totalPages ??
//     Math.max(1, Math.ceil(total / filters.limit));

//   const agents = useMemo(() => {
//     return (supportAgentsData?.data || []).filter(
//       (user: { role: string }) => user.role === "SUPPORT_AGENT"
//     );
//   }, [supportAgentsData?.data]);

//   const categories: CategoryType[] = useMemo(() => {
//     return supportCategoriesData?.data || [];
//   }, [supportCategoriesData?.data]);

//   // const agentOptions: SelectOption[] = useMemo(() => {
//   //   return [
//   //     { value: "", label: "All Agents" },
//   //     ...agents.map((agent: { _id: string; name: string }) => ({
//   //       value: agent._id,
//   //       label: agent.name,
//   //     })),
//   //   ];
//   // }, [agents]);

//   const stats: StatsType = ticketsData?.meta?.statusBreakdown || {
//     totalPending: tickets.filter((t) => t?.status === "Pending").length,
//     totalOpen: tickets.filter((t) => t?.status === "Open").length,
//     totalInProgress: tickets.filter((t) => t?.status === "In Progress").length,
//     totalResolved: tickets.filter((t) => t?.status === "Resolved").length,
//     totalClosed: tickets.filter((t) => t?.status === "Closed").length,
//   };

//   const totalTickets =
//     (stats.totalPending || 0) +
//     (stats.totalOpen || 0) +
//     (stats.totalInProgress || 0) +
//     (stats.totalResolved || 0) +
//     (stats.totalClosed || 0);

//   const hasActiveFilters =
//     filters.search ||
//     filters.status ||
//     filters.assignedTo ||
//     filters.category ||
//     filters.dateRange?.from ||
//     filters.dateRange?.to;

//   // --------------------- Handlers ---------------------
//   const handleFilterChange = useCallback(
//     (key: keyof FilterState, value: string | number | DateRange | undefined) => {
//       setFilters((prev) => ({
//         ...prev,
//         [key]: value,
//         ...(key !== "page" && { page: 1 }),
//       }));
//     },
//     []
//   );

//   const clearAllFilters = useCallback(() => {
//     setFilters(INITIAL_FILTERS);
//   }, []);

//   const handleStatusUpdate = useCallback(
//     async (ticketId: string, newStatus: string) => {
//       setLoadingStates((prev) => ({ ...prev, [ticketId]: "updating" }));
//       try {
//         await updateStatus({
//           id: ticketId,
//           status: newStatus,
//         }).unwrap();
//         toast.success("Ticket status updated successfully");
//         refetch();
//       } catch (error) {
//         const err = error as { data?: { message?: string } };
//         toast.error(err?.data?.message || "Failed to update ticket status");
//       } finally {
//         setLoadingStates((prev) => {
//           const newState = { ...prev };
//           delete newState[ticketId];
//           return newState;
//         });
//       }
//     },
//     [updateStatus, refetch]
//   );

//   const handleCategoryUpdate = useCallback(
//     async (ticketId: string, categoryId: string) => {
//       setLoadingStates((prev) => ({ ...prev, [ticketId]: "updating-category" }));
//       try {


//         await updateCategory({
//           id: ticketId,
//           category: categoryId || null,
//         }).unwrap();
//         toast.success("Ticket category updated successfully");
//         refetch();
//       } catch (error) {
//         console.log(error)
//         const err = error as { data?: { message?: string } };
//         toast.error(err?.data?.message || "Failed to update category");
//       } finally {
//         setLoadingStates((prev) => {
//           const newState = { ...prev };
//           delete newState[ticketId];
//           return newState;
//         });
//         setShowCategoryDropdown((prev) => ({ ...prev, [ticketId]: false }));
//       }
//     },
//     [updateCategory, refetch]
//   );

//   const handleCreateCategory = useCallback(
//     async (ticketId: string, categoryName: string) => {
//       if (!categoryName.trim()) return;
//       setCreatingCategory(true);
//       try {
//         const data = {
//           name: categoryName.trim(),
//           description: "",
//           color: "#3B82F6",
//         }
//         const result = await createCategory({ data: data }).unwrap();
//         toast.success("Category created successfully");
//         await refetchCategories();
//         // Assign to ticket - use result.data._id instead of result._id
//         await handleCategoryUpdate(ticketId, result.data._id);
//         // Close the dropdown to show the assigned category
//         setShowCategoryDropdown((prev) => ({ ...prev, [ticketId]: false }));
//         setCategorySearchTerm((prev) => ({ ...prev, [ticketId]: "" }));
//       } catch (error) {
//         // console.log(error)
//         const err = error as { data?: { message?: string } };
//         toast.error(err?.data?.message || "Failed to create category");
//       } finally {
//         setCreatingCategory(false);
//       }
//     },
//     [createCategory, handleCategoryUpdate, refetchCategories]
//   );

//   const handleDeleteCategory = useCallback(
//     async (categoryId: string) => {
//       try {
//         await deleteCategoryMutation(categoryId).unwrap();
//         toast.success("Category deleted successfully");
//         await refetchCategories();
//         if (filters.category === categoryId) {
//           handleFilterChange("category", "");
//         }
//         await refetch();
//       } catch (error) {
//         const err = error as { data?: { message?: string } };
//         toast.error(err?.data?.message || "Failed to delete category");
//       }
//     },
//     [deleteCategoryMutation, refetchCategories, refetch, filters.category, handleFilterChange]
//   );

//   const getFilteredCategories = useCallback(
//     (ticketId: string) => {
//       const searchTerm = categorySearchTerm[ticketId] || "";
//       if (!searchTerm.trim()) return categories;
//       return categories.filter((cat) =>
//         cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     },
//     [categories, categorySearchTerm]
//   );

//   const getFilteredAgents = useCallback(
//     (ticketId: string) => {
//       const searchTerm = assignSearchTerm[ticketId] || "";
//       if (!searchTerm.trim()) return agents;
//       return agents.filter((agent: { name: string }) =>
//         agent.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     },
//     [agents, assignSearchTerm]
//   );

//   const getFilteredCategoriesForFilter = useCallback(() => {
//     if (!categoryFilterSearch.trim()) return categories;
//     return categories.filter((category) =>
//       category.name.toLowerCase().includes(categoryFilterSearch.toLowerCase())
//     );
//   }, [categories, categoryFilterSearch]);

//   const getFilteredStatusOptions = useCallback(() => {
//     if (!statusFilterSearch.trim()) return STATUS_OPTIONS;
//     return STATUS_OPTIONS.filter((option) =>
//       option.label.toLowerCase().includes(statusFilterSearch.toLowerCase())
//     );
//   }, [statusFilterSearch]);

//   const getFilteredAgentsForFilter = useCallback(() => {
//     if (!agentFilterSearch.trim()) return agents;
//     return agents.filter((agent: { name: string }) =>
//       agent.name.toLowerCase().includes(agentFilterSearch.toLowerCase())
//     );
//   }, [agents, agentFilterSearch]);

//   const handleAssignTicket = useCallback(
//     async (ticketId: string, agentId: string) => {
//       setLoadingStates((prev) => ({ ...prev, [ticketId]: "assigning" }));
//       try {
//         await assignTicket({
//           id: ticketId,
//           assignedTo: agentId || null,
//         }).unwrap();
//         toast.success(agentId ? "Ticket assigned successfully" : "Ticket unassigned successfully");
//         refetch();
//       } catch (error) {
//         const err = error as { data?: { message?: string } };
//         toast.error(err?.data?.message || "Failed to assign ticket");
//       } finally {
//         setLoadingStates((prev) => {
//           const newState = { ...prev };
//           delete newState[ticketId];
//           return newState;
//         });
//         setShowAssignDropdown((prev) => ({ ...prev, [ticketId]: false }));
//       }
//     },
//     [assignTicket, refetch]
//   );

//   const handleConfirmDeleteTicket = async () => {
//     if (!deleteTicketId) return;

//     setLoadingStates((prev) => ({ ...prev, [deleteTicketId]: "deleting" }));

//     try {
//       await deleteTicket({ id: deleteTicketId }).unwrap();
//       toast.success("Ticket deleted successfully");
//       setDeleteTicketId(null);
//       refetch();
//     } catch (error) {
//       const err = error as { data?: { message?: string } };
//       toast.error(err?.data?.message || "Failed to delete ticket");
//     } finally {
//       setLoadingStates((prev) => {
//         const next = { ...prev };
//         delete next[deleteTicketId];
//         return next;
//       });
//     }
//   };

//   const handleViewTicket = useCallback(
//     (ticketId: string) => {
//       navigate(`/support-tickets-management/${ticketId}`);
//     },
//     [navigate]
//   );

//   const handleNavigateToUser = useCallback(
//     (email: string) => {
//       navigate(`/admin/manage-users?search=${encodeURIComponent(email)}`);
//     },
//     [navigate]
//   );

//   // --------------------- Loading State ---------------------
//   if (isUserLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//         <p className="text-gray-600 font-medium">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-8xl mx-auto p-2 sm:p-4">
//         {/* Header Actions */}
//         <HeaderActions
//           showFilters={showFilters}
//           onToggleFilters={() => setShowFilters(!showFilters)}
//           onRefresh={refetch}
//           isFetching={isFetching}
//           onManageCategories={() => setShowManageCategoryModal(true)}
//         />

//         {/* Filters */}
//         {showFilters && (
//           <TicketFilters
//             filters={filters}
//             onFilterChange={handleFilterChange}
//             onClearAll={clearAllFilters}
//             hasActiveFilters={!!hasActiveFilters}
//             statusOptions={STATUS_OPTIONS}
//             agents={agents}
//             categories={categories}
//             categoryFilterSearch={categoryFilterSearch}
//             setCategoryFilterSearch={setCategoryFilterSearch}
//             showCategoryFilterDropdown={showCategoryFilterDropdown}
//             setShowCategoryFilterDropdown={setShowCategoryFilterDropdown}
//             getFilteredCategoriesForFilter={getFilteredCategoriesForFilter}
//             statusFilterSearch={statusFilterSearch}
//             setStatusFilterSearch={setStatusFilterSearch}
//             showStatusFilterDropdown={showStatusFilterDropdown}
//             setShowStatusFilterDropdown={setShowStatusFilterDropdown}
//             getFilteredStatusOptions={getFilteredStatusOptions}
//             agentFilterSearch={agentFilterSearch}
//             setAgentFilterSearch={setAgentFilterSearch}
//             showAgentFilterDropdown={showAgentFilterDropdown}
//             setShowAgentFilterDropdown={setShowAgentFilterDropdown}
//             getFilteredAgentsForFilter={getFilteredAgentsForFilter}
//             onDeleteCategory={handleDeleteCategory}
//             userRole={user?.role}
//           />
//         )}

//         {/* Stats Cards */}
//         <StatsCards
//           stats={stats}
//           totalTickets={totalTickets}
//           currentFilter={filters.status}
//           onFilterChange={handleFilterChange}
//         />

//         {/* Tickets Table */}
//         <TicketsTable
//           tickets={tickets}
//           agents={agents}
//           categories={categories}
//           isLoading={isTicketsLoading || isFetching || isSupportCategoryFetching}
//           loadingStates={loadingStates}
//           onStatusUpdate={handleStatusUpdate}
//           onCategoryUpdate={handleCategoryUpdate}
//           onAssignTicket={handleAssignTicket}
//           onDeleteTicket={setDeleteTicketId}
//           onViewTicket={handleViewTicket}
//           onNavigateToUser={handleNavigateToUser}
//           hasActiveFilters={!!hasActiveFilters}
//           userRole={userRole}
//           categorySearchTerm={categorySearchTerm}
//           setCategorySearchTerm={setCategorySearchTerm}
//           showCategoryDropdown={showCategoryDropdown}
//           setShowCategoryDropdown={setShowCategoryDropdown}
//           showAssignDropdown={showAssignDropdown}
//           setShowAssignDropdown={setShowAssignDropdown}
//           assignSearchTerm={assignSearchTerm}
//           setAssignSearchTerm={setAssignSearchTerm}
//           getFilteredCategories={getFilteredCategories}
//           getFilteredAgents={getFilteredAgents}
//           onCreateCategory={handleCreateCategory}
//           creatingCategory={creatingCategory}
//         />

//         {/* Pagination */}
//         {total > 0 && (
//           <TicketsPagination
//             page={filters.page}
//             limit={filters.limit}
//             total={total}
//             totalPages={totalPages}
//             isFetching={isFetching}
//             onPageChange={(page) => handleFilterChange("page", page)}
//             onLimitChange={(limit) => handleFilterChange("limit", limit)}
//           />
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={!!deleteTicketId}
//         onClose={() => setDeleteTicketId(null)}
//         onConfirm={handleConfirmDeleteTicket}
//         title="Delete Ticket"
//         itemName="this support ticket"
//         description="This action cannot be undone."
//         isLoading={loadingStates[deleteTicketId!] === "deleting"}
//       />

//       {/* Manage Category Modal */}
//       <ManageSupportCategoryModal
//         isOpen={showManageCategoryModal}
//         onClose={() => setShowManageCategoryModal(false)}
//         categories={categories}
//         onRefetch={refetchCategories}
//         onDeleteCategory={handleDeleteCategory}
//       />
//     </div>
//   );
// };

// // --------------------- Header Actions Component ---------------------
// interface HeaderActionsProps {
//   showFilters: boolean;
//   onToggleFilters: () => void;
//   onRefresh: () => void;
//   isFetching: boolean;
//   onManageCategories: () => void;
// }

// const HeaderActions: React.FC<HeaderActionsProps> = ({
//   showFilters,
//   onToggleFilters,
//   onRefresh,
//   isFetching,
//   onManageCategories,
// }) => {
//   return (
//     <div className="flex items-center justify-end gap-3 mb-6 mt-8">
//       <Button
//         variant="default"
//         onClick={onManageCategories}
//         className="flex items-center gap-2"
//       >
//         <Settings className="h-4 w-4" />
//         <span className="hidden sm:inline">Manage Categories</span>
//       </Button>
//       <Button
//         variant="outline"
//         onClick={onRefresh}
//         disabled={isFetching}
//         className="flex items-center gap-2"
//       >
//         <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//         <span className="hidden sm:inline">Refresh</span>
//       </Button>
//       <Button
//         variant="outline"
//         onClick={onToggleFilters}
//         className="flex items-center gap-2"
//       >
//         <Filter className="h-4 w-4 text-primary" />
//         <span className="hidden sm:inline font-medium">Filters</span>
//         {showFilters ? (
//           <ChevronUp className="h-4 w-4 text-primary" />
//         ) : (
//           <ChevronDown className="h-4 w-4 text-primary" />
//         )}
//       </Button>
//     </div>
//   );
// };

// // --------------------- Ticket Filters Component ---------------------
// interface TicketFiltersProps {
//   filters: FilterState;
//   onFilterChange: (key: keyof FilterState, value: string | number | DateRange | undefined) => void;
//   onClearAll: () => void;
//   hasActiveFilters: boolean;
//   statusOptions: StatusOption[];
//   agents: Array<{ _id: string; name: string; email: string }>;
//   categories: CategoryType[];
//   categoryFilterSearch: string;
//   setCategoryFilterSearch: React.Dispatch<React.SetStateAction<string>>;
//   showCategoryFilterDropdown: boolean;
//   setShowCategoryFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
//   getFilteredCategoriesForFilter: () => CategoryType[];
//   statusFilterSearch: string;
//   setStatusFilterSearch: React.Dispatch<React.SetStateAction<string>>;
//   showStatusFilterDropdown: boolean;
//   setShowStatusFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
//   getFilteredStatusOptions: () => StatusOption[];
//   agentFilterSearch: string;
//   setAgentFilterSearch: React.Dispatch<React.SetStateAction<string>>;
//   showAgentFilterDropdown: boolean;
//   setShowAgentFilterDropdown: React.Dispatch<React.SetStateAction<boolean>>;
//   getFilteredAgentsForFilter: () => Array<{ _id: string; name: string; email: string }>;
//   onDeleteCategory: (categoryId: string) => void;
//   userRole: string;
// }

// const TicketFilters: React.FC<TicketFiltersProps> = ({
//   filters,
//   onFilterChange,
//   onClearAll,
//   hasActiveFilters,
//   statusOptions,
//   agents,
//   categories,
//   categoryFilterSearch,
//   setCategoryFilterSearch,
//   showCategoryFilterDropdown,
//   setShowCategoryFilterDropdown,
//   getFilteredCategoriesForFilter,
//   statusFilterSearch,
//   setStatusFilterSearch,
//   showStatusFilterDropdown,
//   setShowStatusFilterDropdown,
//   getFilteredStatusOptions,
//   agentFilterSearch,
//   setAgentFilterSearch,
//   showAgentFilterDropdown,
//   setShowAgentFilterDropdown,
//   getFilteredAgentsForFilter,
//   onDeleteCategory,
//   userRole,
// }) => {
//   const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

//   const getDateRangeDisplay = () => {
//     if (filters.dateRange?.from && filters.dateRange?.to) {
//       return `${format(filters.dateRange.from, "MMM dd, yyyy")} - ${format(
//         filters.dateRange.to,
//         "MMM dd, yyyy"
//       )}`;
//     } else if (filters.dateRange?.from) {
//       return `From ${format(filters.dateRange.from, "MMM dd, yyyy")}`;
//     } else if (filters.dateRange?.to) {
//       return `Until ${format(filters.dateRange.to, "MMM dd, yyyy")}`;
//     }
//     return "Pick a date range";
//   };

//   const handleDateRangeChange = (dateRange: DateRange | undefined) => {
//     onFilterChange("dateRange", dateRange);
//     if (dateRange?.from) {
//       const year = dateRange.from.getFullYear();
//       const month = String(dateRange.from.getMonth() + 1).padStart(2, "0");
//       const day = String(dateRange.from.getDate()).padStart(2, "0");
//       onFilterChange("startDate", `${year}-${month}-${day}`);
//     } else {
//       onFilterChange("startDate", "");
//     }
//     if (dateRange?.to) {
//       const year = dateRange.to.getFullYear();
//       const month = String(dateRange.to.getMonth() + 1).padStart(2, "0");
//       const day = String(dateRange.to.getDate()).padStart(2, "0");
//       onFilterChange("endDate", `${year}-${month}-${day}`);
//     } else {
//       onFilterChange("endDate", "");
//     }
//   };

//   const selectedStatus = statusOptions.find((opt) => opt.value === filters.status);
//   const selectedAgent = agents.find((agent) => agent._id === filters.assignedTo);

//   return (
//     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//         {/* Search Tickets */}
//         <div className="md:col-span-3">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="text"
//               placeholder="Search by subject or description..."
//               value={filters.search}
//               onChange={(e) => onFilterChange("search", e.target.value)}
//               className="pl-8 h-10"
//             />
//           </div>
//         </div>

//         {/* Status Filter */}
//         <div className="md:col-span-2 relative">
//           <button
//             type="button"
//             onClick={() => {
//               setShowStatusFilterDropdown(!showStatusFilterDropdown);
//               if (!showStatusFilterDropdown) {
//                 setStatusFilterSearch("");
//               }
//             }}
//             className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
//           >
//             <div className="flex items-center gap-2 min-w-0">
//               {filters.status && selectedStatus?.icon ? (
//                 <>
//                   <selectedStatus.icon
//                     className={`h-4 w-4 flex-shrink-0 ${selectedStatus.color || "text-gray-600"}`}
//                   />
//                   <span className="text-gray-900 text-sm truncate">
//                     {selectedStatus.label}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-gray-500 text-sm">All Status</span>
//               )}
//             </div>
//             <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
//           </button>

//           {showStatusFilterDropdown && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => {
//                   setShowStatusFilterDropdown(false);
//                   setStatusFilterSearch("");
//                 }}
//               />
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
//                 <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       value={statusFilterSearch}
//                       onChange={(e) => setStatusFilterSearch(e.target.value)}
//                       placeholder="Search status..."
//                       className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   </div>
//                 </div>
//                 <div className="overflow-y-auto max-h-60">
//                   {getFilteredStatusOptions().map((option) => {
//                     const Icon = option.icon;
//                     return (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           onFilterChange("status", option.value);
//                           setShowStatusFilterDropdown(false);
//                           setStatusFilterSearch("");
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
//                       >
//                         <div className="flex items-center gap-2">
//                           {Icon && (
//                             <Icon
//                               className={`h-4 w-4 ${option.color || "text-gray-600"}`}
//                             />
//                           )}
//                           <span>{option.label}</span>
//                         </div>
//                       </button>
//                     );
//                   })}
//                   {getFilteredStatusOptions().length === 0 && (
//                     <div className="px-4 py-3 text-sm text-gray-500 text-center">
//                       No status found
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Category Filter */}
//         <div className="md:col-span-2 relative">
//           <button
//             type="button"
//             onClick={() => {
//               setShowCategoryFilterDropdown(!showCategoryFilterDropdown);
//               if (!showCategoryFilterDropdown) {
//                 setCategoryFilterSearch("");
//               }
//             }}
//             className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
//           >
//             <div className="flex items-center gap-2 min-w-0">
//               {filters.category ? (
//                 <>
//                   <div
//                     className="w-3 h-3 rounded-full flex-shrink-0"
//                     style={{
//                       backgroundColor: categories.find(
//                         (c) => c._id === filters.category
//                       )?.color,
//                     }}
//                   />
//                   <span className="text-gray-900 text-sm truncate">
//                     {categories.find((c) => c._id === filters.category)?.name ||
//                       "Select Category"}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-gray-500 text-sm">All Categories</span>
//               )}
//             </div>
//             <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
//           </button>

//           {showCategoryFilterDropdown && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => {
//                   setShowCategoryFilterDropdown(false);
//                   setCategoryFilterSearch("");
//                 }}
//               />
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
//                 <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       value={categoryFilterSearch}
//                       onChange={(e) => setCategoryFilterSearch(e.target.value)}
//                       placeholder="Search  category..."
//                       className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   </div>
//                 </div>
//                 <div className="overflow-y-auto max-h-60">
//                   <button
//                     onClick={() => {
//                       onFilterChange("category", "");
//                       setShowCategoryFilterDropdown(false);
//                       setCategoryFilterSearch("");
//                     }}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
//                   >
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-gray-300" />
//                       <span>All Categories</span>
//                     </div>
//                   </button>
//                   {getFilteredCategoriesForFilter().map((category) => (
//                     <div
//                       key={category._id}
//                       className="flex items-center justify-between hover:bg-gray-50 group"
//                     >
//                       <button
//                         onClick={() => {
//                           onFilterChange("category", category._id);
//                           setShowCategoryFilterDropdown(false);
//                           setCategoryFilterSearch("");
//                         }}
//                         className="flex-1 text-left px-4 py-2 transition-colors text-sm"
//                       >
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-3 h-3 rounded-full"
//                             style={{
//                               backgroundColor: category.color,
//                             }}
//                           />
//                           <span className="text-gray-900">{category.name}</span>
//                         </div>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDeleteCategory(category._id);
//                         }}
//                         className="p-1.5 mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
//                         title="Delete category"
//                       >
//                         <XCircle className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                   {getFilteredCategoriesForFilter().length === 0 && (
//                     <div className="px-4 py-3 text-sm text-gray-500 text-center">
//                       No categories found
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Assigned To Filter */}
//         {userRole !== "SUPPORT_AGENT" && (
//           <div className="md:col-span-2 relative">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowAgentFilterDropdown(!showAgentFilterDropdown);
//                 if (!showAgentFilterDropdown) {
//                   setAgentFilterSearch("");
//                 }
//               }}
//               className="w-full h-10 px-3 text-left border border-gray-200 rounded-md hover:border-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between gap-2 bg-white"
//             >
//               <div className="flex items-center gap-2 min-w-0">
//                 {filters.assignedTo && selectedAgent ? (
//                   <>
//                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-white text-[10px] font-semibold">
//                         {getInitials(selectedAgent.name)}
//                       </span>
//                     </div>
//                     <span className="text-gray-900 text-sm truncate">
//                       {selectedAgent.name}
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                     <span className="text-gray-500 text-sm">All Agents</span>
//                   </>
//                 )}
//               </div>
//               <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
//             </button>

//             {showAgentFilterDropdown && (
//               <>
//                 <div
//                   className="fixed inset-0 z-10"
//                   onClick={() => {
//                     setShowAgentFilterDropdown(false);
//                     setAgentFilterSearch("");
//                   }}
//                 />
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
//                   <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <input
//                         type="text"
//                         value={agentFilterSearch}
//                         onChange={(e) => setAgentFilterSearch(e.target.value)}
//                         placeholder="Search agents..."
//                         className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </div>
//                   <div className="overflow-y-auto max-h-60">
//                     <button
//                       onClick={() => {
//                         onFilterChange("assignedTo", "");
//                         setShowAgentFilterDropdown(false);
//                         setAgentFilterSearch("");
//                       }}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
//                     >
//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-gray-400" />
//                         <span>All Agents</span>
//                       </div>
//                     </button>
//                     {getFilteredAgentsForFilter().map((agent) => (
//                       <button
//                         key={agent._id}
//                         onClick={() => {
//                           onFilterChange("assignedTo", agent._id);
//                           setShowAgentFilterDropdown(false);
//                           setAgentFilterSearch("");
//                         }}
//                         className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-white text-[10px] font-semibold">
//                             {getInitials(agent.name)}
//                           </span>
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-medium text-gray-900 truncate">
//                             {agent.name}
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                     {getFilteredAgentsForFilter().length === 0 && (
//                       <div className="px-4 py-3 text-sm text-gray-500 text-center">
//                         No agents found
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Date Range Picker */}
//         <div className={userRole !== "SUPPORT_AGENT" ? "md:col-span-2" : "md:col-span-3"}>
//           <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className={cn(
//                   "w-full justify-start text-left font-normal h-10",
//                   !filters.dateRange?.from &&
//                   !filters.dateRange?.to &&
//                   "text-muted-foreground"
//                 )}
//               >
//                 <span className="truncate flex-1">{getDateRangeDisplay()}</span>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <CalendarComponent
//                 initialFocus
//                 mode="range"
//                 defaultMonth={filters.dateRange?.from}
//                 selected={filters.dateRange}
//                 onSelect={handleDateRangeChange}
//                 numberOfMonths={2}
//                 className="p-3"
//               />
//               <div className="flex items-center justify-between p-3 border-t">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     handleDateRangeChange(undefined);
//                     setIsCalendarOpen(false);
//                   }}
//                 >
//                   Clear
//                 </Button>
//                 <Button size="sm" onClick={() => setIsCalendarOpen(false)}>
//                   Apply
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Reset Button */}
//         <div className="md:col-span-1">
//           <Button
//             variant={hasActiveFilters ? "default" : "outline"}
//             className="w-full"
//             onClick={onClearAll}
//             disabled={!hasActiveFilters}
//           >
//             Reset
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --------------------- Stats Cards Component ---------------------
// interface StatsCardsProps {
//   stats: StatsType;
//   totalTickets: number;
//   currentFilter: string;
//   onFilterChange: (key: keyof FilterState, value: string) => void;
// }

// const StatsCards: React.FC<StatsCardsProps> = ({
//   stats,
//   totalTickets,
//   currentFilter,
//   onFilterChange,
// }) => {
//   const statsData = [
//     {
//       key: "",
//       label: "Total Tickets",
//       value: totalTickets,
//       icon: BarChart3,
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//       textColor: "text-gray-900",
//       activeClass: "",
//     },
//     {
//       key: "Pending",
//       label: "Pending",
//       value: stats.totalPending || 0,
//       icon: Clock,
//       bgColor: "bg-orange-100",
//       iconColor: "text-orange-600",
//       textColor: "text-orange-600",
//       activeClass: "bg-orange-50 border-orange-200 ring-2 ring-orange-200",
//     },
//     {
//       key: "Open",
//       label: "Open",
//       value: stats.totalOpen || 0,
//       icon: AlertCircle,
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//       textColor: "text-blue-600",
//       activeClass: "bg-blue-50 border-blue-200 ring-2 ring-blue-200",
//     },
//     {
//       key: "In Progress",
//       label: "In Progress",
//       value: stats.totalInProgress || 0,
//       icon: Clock,
//       bgColor: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//       textColor: "text-yellow-600",
//       activeClass: "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-200",
//     },
//     {
//       key: "Resolved",
//       label: "Resolved",
//       value: stats.totalResolved || 0,
//       icon: CheckCircle,
//       bgColor: "bg-green-100",
//       iconColor: "text-green-600",
//       textColor: "text-green-600",
//       activeClass: "bg-green-50 border-green-200 ring-2 ring-green-200",
//     },
//     {
//       key: "Closed",
//       label: "Closed",
//       value: stats.totalClosed || 0,
//       icon: XCircle,
//       bgColor: "bg-gray-100",
//       iconColor: "text-gray-600",
//       textColor: "text-gray-600",
//       activeClass: "bg-gray-50 border-gray-300 ring-2 ring-gray-300",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
//       {statsData.map((stat) => {
//         const isActive = currentFilter === stat.key;
//         const Icon = stat.icon;

//         return (
//           <button
//             key={stat.label}
//             onClick={() => onFilterChange("status", stat.key)}
//             className={`p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer text-left ${isActive
//               ? stat.activeClass
//               : "bg-white border-gray-100 hover:shadow-md"
//               }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm font-medium text-gray-600">
//                   {stat.label}
//                 </p>
//                 <p
//                   className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}
//                 >
//                   {stat.value}
//                 </p>
//               </div>
//               <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg`}>
//                 <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
//               </div>
//             </div>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// // --------------------- Tickets Table Component ---------------------
// interface TicketsTableProps {
//   tickets: TicketType[];
//   agents: Array<{ _id: string; name: string; email: string }>;
//   categories: CategoryType[];
//   isLoading: boolean;
//   loadingStates: Record<string, LoadingState>;
//   onStatusUpdate: (ticketId: string, status: string) => void;
//   onCategoryUpdate: (ticketId: string, categoryId: string) => void;
//   onAssignTicket: (ticketId: string, agentId: string) => void;
//   onDeleteTicket: (ticketId: string) => void;
//   onViewTicket: (ticketId: string) => void;
//   onNavigateToUser: (email: string) => void;
//   hasActiveFilters: boolean;
//   userRole: string;
//   categorySearchTerm: Record<string, string>;
//   setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   showCategoryDropdown: Record<string, boolean>;
//   setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   showAssignDropdown: Record<string, boolean>;
//   setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   assignSearchTerm: Record<string, string>;
//   setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   getFilteredCategories: (ticketId: string) => CategoryType[];
//   getFilteredAgents: (ticketId: string) => Array<{ _id: string; name: string; email: string }>;
//   onCreateCategory: (ticketId: string, name: string) => void;
//   creatingCategory: boolean;
// }

// const TicketsTable: React.FC<TicketsTableProps> = ({
//   tickets,
//   agents,
//   categories,
//   isLoading,
//   loadingStates,
//   onStatusUpdate,
//   onCategoryUpdate,
//   onAssignTicket,
//   onDeleteTicket,
//   onViewTicket,
//   onNavigateToUser,
//   hasActiveFilters,
//   userRole,
//   categorySearchTerm,
//   setCategorySearchTerm,
//   showCategoryDropdown,
//   setShowCategoryDropdown,
//   showAssignDropdown,
//   setShowAssignDropdown,
//   assignSearchTerm,
//   setAssignSearchTerm,
//   getFilteredCategories,
//   getFilteredAgents,
//   onCreateCategory,
//   creatingCategory,
// }) => {
//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="flex flex-col items-center justify-center py-16">
//           <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//           <p className="text-gray-600 font-medium">Loading tickets...</p>
//         </div>
//       </div>
//     );
//   }

//   // Empty State
//   if (tickets.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="flex flex-col items-center justify-center py-16">
//           <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             No tickets found
//           </h3>
//           <p className="text-gray-600 text-center max-w-md">
//             {hasActiveFilters
//               ? "No tickets match your current filters. Try adjusting your search criteria."
//               : "There are no support tickets at the moment."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible">
//       <div className="overflow-x-auto overflow-y-visible">
//         <table className="min-w-full divide-y divide-gray-100">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//             <tr>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <div className="flex items-center">
//                   <MessageSquare className="h-4 w-4 mr-2 text-primary" />
//                   Ticket Details
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <div className="flex items-center">
//                   <Settings className="h-4 w-4 mr-2 text-primary" />
//                   Status
//                 </div>
//               </th>
//               {userRole !== "SUPPORT_AGENT" && (
//                 <>
//                   <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     <div className="flex items-center">
//                       <Tag className="h-4 w-4 mr-2 text-primary" />
//                       Category
//                     </div>
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     <div className="flex items-center">
//                       <Users className="h-4 w-4 mr-2 text-primary" />
//                       Assigned To
//                     </div>
//                   </th>
//                 </>
//               )}
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
//                 <div className="flex items-center">
//                   <UserCheck className="h-4 w-4 mr-2 text-primary" />
//                   Assigned By
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-2 text-primary" />
//                   Created
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-50">
//             {tickets.map((ticket, index) => (
//               <TicketRow
//                 key={ticket._id}
//                 ticket={ticket}
//                 agents={agents}
//                 categories={categories}
//                 rowIndex={index}
//                 totalRows={tickets.length}
//                 loadingState={loadingStates[ticket._id]}
//                 onStatusUpdate={onStatusUpdate}
//                 onCategoryUpdate={onCategoryUpdate}
//                 onAssignTicket={onAssignTicket}
//                 onDeleteTicket={onDeleteTicket}
//                 onViewTicket={onViewTicket}
//                 onNavigateToUser={onNavigateToUser}
//                 categorySearchTerm={categorySearchTerm}
//                 setCategorySearchTerm={setCategorySearchTerm}
//                 showCategoryDropdown={showCategoryDropdown}
//                 setShowCategoryDropdown={setShowCategoryDropdown}
//                 showAssignDropdown={showAssignDropdown}
//                 setShowAssignDropdown={setShowAssignDropdown}
//                 assignSearchTerm={assignSearchTerm}
//                 setAssignSearchTerm={setAssignSearchTerm}
//                 getFilteredCategories={getFilteredCategories}
//                 getFilteredAgents={getFilteredAgents}
//                 onCreateCategory={onCreateCategory}
//                 creatingCategory={creatingCategory}
//                 userRole={userRole}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // --------------------- Ticket Row Component ---------------------
// interface TicketRowProps {
//   ticket: TicketType;
//   agents: Array<{ _id: string; name: string; email: string }>;
//   categories: CategoryType[];
//   rowIndex: number;
//   totalRows: number;
//   loadingState?: LoadingState;
//   onStatusUpdate: (ticketId: string, status: string) => void;
//   onCategoryUpdate: (ticketId: string, categoryId: string) => void;
//   onAssignTicket: (ticketId: string, agentId: string) => void;
//   onDeleteTicket: (ticketId: string) => void;
//   onViewTicket: (ticketId: string) => void;
//   onNavigateToUser: (email: string) => void;
//   categorySearchTerm: Record<string, string>;
//   setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   showCategoryDropdown: Record<string, boolean>;
//   setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   showAssignDropdown: Record<string, boolean>;
//   setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   assignSearchTerm: Record<string, string>;
//   setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   getFilteredCategories: (ticketId: string) => CategoryType[];
//   getFilteredAgents: (ticketId: string) => Array<{ _id: string; name: string; email: string }>;
//   onCreateCategory: (ticketId: string, name: string) => void;
//   creatingCategory: boolean;
//   userRole: string;
// }

// const TicketRow: React.FC<TicketRowProps> = ({
//   ticket,
//   rowIndex,
//   totalRows,
//   loadingState,
//   onStatusUpdate,
//   onCategoryUpdate,
//   onAssignTicket,
//   onDeleteTicket,
//   onViewTicket,
//   onNavigateToUser,
//   categorySearchTerm,
//   setCategorySearchTerm,
//   showCategoryDropdown,
//   setShowCategoryDropdown,
//   showAssignDropdown,
//   setShowAssignDropdown,
//   assignSearchTerm,
//   setAssignSearchTerm,
//   getFilteredCategories,
//   getFilteredAgents,
//   onCreateCategory,
//   creatingCategory,
//   userRole,
// }) => {
//   const isRowLoading = !!loadingState;
//   const creatorInfo = getCreatorInfo(ticket);
//   const assignedToName = getAssignedUserName(ticket.assignedTo);
//   const assignedByName = getAssignedUserName(ticket.assignedBy);
//   const showDropdownAbove = rowIndex >= totalRows - 2;

//   const getLoadingMessage = (state?: LoadingState): string => {
//     switch (state) {
//       case "updating":
//         return "🔄 Updating status...";
//       case "updating-category":
//         return "🏷️ Updating category...";
//       case "assigning":
//         return "👤 Assigning agent...";
//       case "deleting":
//         return "🗑️ Deleting ticket...";
//       default:
//         return "Loading...";
//     }
//   };

//   return (
//     <tr className="hover:bg-blue-50/30 transition-colors duration-200 relative">
//       {/* Loading Overlay */}
//       {isRowLoading && (
//         <td
//           colSpan={7}
//           className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10"
//         >
//           <div className="flex items-center justify-center h-full">
//             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
//               <Loader2 className="h-5 w-5 animate-spin text-primary" />
//               <span className="text-sm font-medium text-gray-700">
//                 {getLoadingMessage(loadingState)}
//               </span>
//             </div>
//           </div>
//         </td>
//       )}

//       {/* Ticket Details */}
//       <td className="px-4 sm:px-6 py-4">
//         <div className="max-w-xs">
//           <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
//             {ticket.subject}
//           </div>
//           <div className="text-sm text-gray-600 line-clamp-2 mb-2">
//             {ticket.description}
//           </div>
//           <div className="space-y-1">
//             {/* Name */}
//             {creatorInfo.name && (
//               <div className="flex items-center text-sm">
//                 <User className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
//                 {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
//                   <button
//                     onClick={() => onNavigateToUser(creatorInfo.email)}
//                     className="inline-flex items-center gap-1 text-gray-900 hover:underline font-medium truncate"
//                   >
//                     <span className="truncate">{creatorInfo.name}</span>
//                     <BadgeCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
//                   </button>
//                 ) : (
//                   <span className="text-gray-900 font-medium truncate">
//                     {creatorInfo.name}
//                   </span>
//                 )}
//               </div>
//             )}
//             {/* Email */}
//             <div className="flex items-center text-sm">
//               <Mail className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
//               {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
//                 <button
//                   onClick={() => onNavigateToUser(creatorInfo.email)}
//                   className="text-primary hover:underline font-medium truncate"
//                 >
//                   {creatorInfo.email}
//                 </button>
//               ) : (
//                 <span className="text-gray-900 truncate">
//                   {creatorInfo.email}
//                 </span>
//               )}
//             </div>
//             {/* Role Badge */}
//             <div className="flex items-center text-sm">
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600/10 text-green-800">
//                 {!ticket.isPublic ? "User" : "Public"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </td>

//       {/* Status */}
//       <td className="px-4 sm:px-6 py-4">
//         <select
//           value={ticket.status}
//           onChange={(e) => onStatusUpdate(ticket._id, e.target.value)}
//           disabled={isRowLoading}
//           className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(
//             ticket.status
//           )} disabled:opacity-50 disabled:cursor-not-allowed`}
//         >
//           {TICKET_STATUSES.map((status) => (
//             <option key={status} value={status}>
//               {status === "Pending" && "🟠 "}
//               {status === "Open" && "🔵 "}
//               {status === "In Progress" && "🟡 "}
//               {status === "Resolved" && "🟢 "}
//               {status === "Closed" && "⚫ "}
//               {status}
//             </option>
//           ))}
//         </select>
//       </td>

//       {userRole !== "SUPPORT_AGENT" && (
//         <td className="px-4 sm:px-6 py-4">
//         <div className="relative">
//           <button
//             onClick={() => {
//               setShowCategoryDropdown((prev) => ({
//                 ...prev,
//                 [ticket._id]: !prev[ticket._id],
//               }));
//               setCategorySearchTerm((prev) => ({
//                 ...prev,
//                 [ticket._id]: "",
//               }));
//             }}
//             disabled={isRowLoading}
//             style={{
//               backgroundColor: ticket?.category?.color
//                 ? `${ticket.category.color}15`
//                 : "transparent",
//               borderColor: ticket?.category?.color || "#e5e7eb",
//             }}
//             className="min-w-[120px] text-xs font-medium rounded-full py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:shadow-sm text-left flex items-center gap-2 disabled:opacity-50"
//           >
//             {ticket?.category && (
//               <div
//                 className="w-2 h-2 rounded-full flex-shrink-0"
//                 style={{ backgroundColor: ticket.category.color }}
//               />
//             )}
//             <span className="truncate">
//               {ticket?.category?.name || "No Category"}
//             </span>
//             <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto flex-shrink-0" />
//           </button>

//           {showCategoryDropdown[ticket._id] && (
//             <>
//               <div
//                 className="fixed inset-0 z-40"
//                 onClick={() =>
//                   setShowCategoryDropdown((prev) => ({
//                     ...prev,
//                     [ticket._id]: false,
//                   }))
//                 }
//               />
//               <div
//                 className={`absolute z-50 ${showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
//                   } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
//               >
//                 {/* Arrow indicator */}
//                 <div
//                   className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${showDropdownAbove
//                     ? "-bottom-1.5 border-b border-r"
//                     : "-top-1.5 border-t border-l"
//                     }`}
//                 />
//                 <div className="p-2 border-b border-gray-100">
//                   <div className="relative">
//                     <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//                     <input
//                       type="text"
//                       // value={categorySearchTerm[ticket._id] || ""}
//                       value={categorySearchTerm[ticket._id] || ""}
//                       onChange={(e) =>
//                         setCategorySearchTerm((prev) => ({
//                           ...prev,
//                           [ticket._id]: e.target.value,
//                         }))
//                       }
//                       placeholder="Search or create category..."
//                       className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
//                       autoFocus
//                     />
//                   </div>
//                 </div>
//                 <div className="max-h-60 overflow-y-auto">
//                   {getFilteredCategories(ticket._id).length > 0 ? (
//                     <>
//                       <button
//                         onClick={() => {
//                           onCategoryUpdate(ticket._id, "");
//                           setShowCategoryDropdown((prev) => ({
//                             ...prev,
//                             [ticket._id]: false,
//                           }));
//                         }}
//                         className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500"
//                       >
//                         ⚪ No Category
//                       </button>
//                       {getFilteredCategories(ticket._id).map((category) => (
//                         <button
//                           key={category._id}
//                           onClick={() => {
//                             onCategoryUpdate(ticket._id, category._id);
//                             setShowCategoryDropdown((prev) => ({
//                               ...prev,
//                               [ticket._id]: false,
//                             }));
//                           }}
//                           className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
//                         >
//                           <div
//                             className="w-2 h-2 rounded-full flex-shrink-0"
//                             style={{ backgroundColor: category.color }}
//                           />
//                           <span className="font-medium truncate">
//                             {category.name}
//                           </span>
//                         </button>
//                       ))}
//                     </>
//                   ) : categorySearchTerm[ticket._id]?.trim() ? (
//                     <button
//                       onClick={() =>
//                         onCreateCategory(ticket._id, categorySearchTerm[ticket._id])
//                       }
//                       disabled={creatingCategory}
//                       className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 text-primary font-medium flex items-center gap-2 disabled:opacity-50"
//                     >
//                       <Plus className="h-3.5 w-3.5" />
//                       {creatingCategory
//                         ? "Creating..."
//                         : `Create "${categorySearchTerm[ticket._id]}"`}
//                     </button>
//                   ) : (
//                     <div className="px-3 py-2 text-xs text-gray-400 text-center">
//                       Type to search or create category
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         </td>
//       )}

//       {userRole !== "SUPPORT_AGENT" && (
//         <td className="px-4 sm:px-6 py-4">
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setShowAssignDropdown((prev) => ({
//                   ...prev,
//                   [ticket._id]: !prev[ticket._id],
//                 }));
//                 setAssignSearchTerm((prev) => ({
//                   ...prev,
//                   [ticket._id]: "",
//                 }));
//               }}
//               disabled={isRowLoading}
//               className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 disabled:opacity-50"
//             >
//               {ticket.assignedTo ? (
//                 <>
//                   <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xs font-semibold">
//                       {getInitials(assignedToName)}
//                     </span>
//                   </div>
//                   <div className="text-left min-w-0">
//                     <div className="text-xs font-medium text-gray-900 truncate">
//                       {assignedToName}
//                     </div>
//                     <div className="text-[10px] text-gray-500">Support Agent</div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
//                 </>
//               ) : (
//                 <>
//                   <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
//                     <User className="h-4 w-4 text-gray-500" />
//                   </div>
//                   <div className="text-left">
//                     <div className="text-sm font-medium text-gray-600">
//                       Assign Agent
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
//                 </>
//               )}
//             </button>

//             {showAssignDropdown[ticket._id] && (
//               <>
//                 <div
//                   className="fixed inset-0 z-40"
//                   onClick={() =>
//                     setShowAssignDropdown((prev) => ({
//                       ...prev,
//                       [ticket._id]: false,
//                     }))
//                   }
//                 />
//                 <div
//                   className={`absolute z-50 ${showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
//                     } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
//                 >
//                   {/* Arrow indicator */}
//                   <div
//                     className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${showDropdownAbove
//                       ? "-bottom-1.5 border-b border-r"
//                       : "-top-1.5 border-t border-l"
//                       }`}
//                   />
//                   <div className="p-2 border-b border-gray-100">
//                     <div className="relative">
//                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={assignSearchTerm[ticket._id] || ""}
//                         onChange={(e) =>
//                           setAssignSearchTerm((prev) => ({
//                             ...prev,
//                             [ticket._id]: e.target.value,
//                           }))
//                         }
//                         placeholder="Search agent..."
//                         className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
//                         autoFocus
//                       />
//                     </div>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     <button
//                       onClick={() => {
//                         onAssignTicket(ticket._id, "");
//                         setShowAssignDropdown((prev) => ({
//                           ...prev,
//                           [ticket._id]: false,
//                         }));
//                       }}
//                       className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500 flex items-center gap-2"
//                     >
//                       <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
//                         <User className="h-3 w-3 text-gray-500" />
//                       </div>
//                       <span>Unassign</span>
//                     </button>
//                     {getFilteredAgents(ticket._id).map((agent) => (
//                       <button
//                         key={agent._id}
//                         onClick={() => {
//                           onAssignTicket(ticket._id, agent._id);
//                           setShowAssignDropdown((prev) => ({
//                             ...prev,
//                             [ticket._id]: false,
//                           }));
//                         }}
//                         className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-white text-[10px] font-semibold">
//                             {getInitials(agent.name)}
//                           </span>
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-medium text-gray-900 truncate">
//                             {agent.name}
//                           </div>
//                           <div className="text-gray-500 text-[10px] truncate">
//                             {agent.email}
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </td>
//       )}

//       {/* Assigned By */}
//       <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
//         {ticket.assignedBy ? (
//           <div className="flex items-center">
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//               <span className="text-green-700 text-xs font-semibold">
//                 {getInitials(assignedByName)}
//               </span>
//             </div>
//             <div className="min-w-0">
//               <div className="text-sm font-medium text-gray-900 truncate">
//                 {assignedByName}
//               </div>
//               <div className="text-xs text-gray-500">Admin</div>
//             </div>
//           </div>
//         ) : ticket.assignedTo ? (
//           <div className="text-sm text-gray-600 italic">Assigned by Admin</div>
//         ) : (
//           <div className="text-sm text-gray-400 italic">Not assigned yet</div>
//         )}
//       </td>

//       {/* Created Date */}
//       <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
//         <div className="flex items-center">
//           <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
//           {formatDate(ticket.createdAt)}
//         </div>
//         <div className="text-xs text-gray-400 mt-1">
//           {formatTime(ticket.createdAt)}
//         </div>
//       </td>

//       {/* Actions */}
//       <td className="px-4 sm:px-6 py-4">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => onViewTicket(ticket._id)}
//             disabled={isRowLoading}
//             className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//             title="View Details"
//           >
//             <Eye className="h-4 w-4" />
//           </Button>

//           {userRole !== "SUPPORT_AGENT" && (
//             <PermissionGate action="delete" feature="support-tickets-management">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => onDeleteTicket(ticket._id)}
//                 disabled={isRowLoading}
//                 className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                 title="Delete Ticket"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </PermissionGate>
//           )}
//         </div>
//       </td>
//     </tr>
//   );
// };

// // --------------------- Pagination Component ---------------------
// interface TicketsPaginationProps {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   isFetching: boolean;
//   onPageChange: (page: number) => void;
//   onLimitChange: (limit: number) => void;
// }

// const TicketsPagination: React.FC<TicketsPaginationProps> = ({
//   page,
//   limit,
//   total,
//   totalPages,
//   isFetching,
//   onPageChange,
// }) => {
//   const startItem = Math.min((page - 1) * limit + 1, total);
//   const endItem = Math.min(page * limit, total);

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
//       <div className="flex items-center gap-4">
//         <div className="text-sm text-muted-foreground">
//           Showing <span className="font-medium">{startItem}</span> to{" "}
//           <span className="font-medium">{endItem}</span> of{" "}
//           <span className="font-medium">{total}</span> tickets
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(Math.max(1, page - 1))}
//           disabled={page <= 1 || isFetching}
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" />
//           <span className="hidden sm:inline">Prev</span>
//         </Button>

//         {/* Page Indicator */}
//         <div className="flex items-center px-3 text-sm text-muted-foreground">
//           Page {page} of {totalPages}
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//           disabled={page >= totalPages || isFetching}
//         >
//           <span className="hidden sm:inline">Next</span>
//           <ChevronRight className="h-4 w-4 ml-1" />
//         </Button>
//       </div>
//     </div>
//   );
// };



// export default SupportTicketManagementPage;









// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useGetSingleSupportTicketQuery,
//   useUpdateSupportTicketStatusMutation,
//   useAssignSupportTicketMutation,
//   useAddCommentToTicketMutation,
//   useGetTicketCommentsQuery,
//   useUpdateCommentMutation,
//   useDeleteCommentMutation,
//   useDeleteSupportTicketAttachmentMutation,
// } from "@/redux/features/support/supportApiSlice";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import { baseURL } from "@/config";

// import {
//   ArrowLeft,
//   MessageSquare,
//   User,
//   Clock,
//   Send,
//   Edit3,
//   Trash2,
//   Reply,
//   EyeOff,
//   Calendar,
//   Headset,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Settings,
//   Loader2,
//   Users,
//   Mail,
//   PaperclipIcon
// } from "lucide-react";
// import { toast } from "sonner";
// import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
// import { Button } from "@/components/ui/button";
// import { Comment, SupportTicket, UserInfo } from "@/types/support.type";
// import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";

// // Frontend URL for email compose
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL || "";

// // Allowed roles for admin actions
// const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "SUPPORT_AGENT"];

// // --------------------- Helper Functions ---------------------
// const getStatusColor = (status: string): string => {
//   switch (status) {
//     case "Pending":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "Open":
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     case "In Progress":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "Resolved":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "Closed":
//       return "bg-gray-100 text-gray-800 border-gray-200";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200";
//   }
// };

// const getStatusIcon = (status: string): React.ReactNode => {
//   switch (status) {
//     case "Pending":
//       return <AlertCircle className="h-4 w-4" />;
//     case "Open":
//       return <AlertCircle className="h-4 w-4" />;
//     case "In Progress":
//       return <Clock className="h-4 w-4" />;
//     case "Resolved":
//       return <CheckCircle className="h-4 w-4" />;
//     case "Closed":
//       return <XCircle className="h-4 w-4" />;
//     default:
//       return <Settings className="h-4 w-4" />;
//   }
// };

// const getStatusEmoji = (status: string): string => {
//   switch (status) {
//     case "Pending":
//       return "🟡";
//     case "Open":
//       return "🔵";
//     case "In Progress":
//       return "🟡";
//     case "Resolved":
//       return "🟢";
//     case "Closed":
//       return "⚫";
//     default:
//       return "⚪";
//   }
// };

// // --------------------- Types ---------------------
// interface UserData {
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   name?: string;
//   email: string;
//   role: string;
// }

// // --------------------- Main Component ---------------------
// const AdminSupportTicketDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // User data
//   const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
//   const user = userData?.data as UserInfo | undefined;


//   const { data: supportAgentsData, isLoading: isSupportAgentsLoading } = useGetAllSupportAgentsQuery({
//       page: 1,
//       limit:1000000
//     })

//   // Get all users and filter for support agents
//   // const { data: usersData } = useGetUsersQuery({ page: 1, limit: 100000 });
//   const allUsers: UserData[] = supportAgentsData?.data || [];
//   // const allUsers: UserData[] = usersData?.data || [];
//   const supportAgents = allUsers.filter((u) => u.role === "SUPPORT_AGENT");

//   // State
//   const [newComment, setNewComment] = useState<string>("");
//   const [isInternal, setIsInternal] = useState<boolean>(false);
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [editingComment, setEditingComment] = useState<string | null>(null);
//   const [editCommentText, setEditCommentText] = useState<string>("");
//   const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
//   const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
//   const [deleteAttachmentId, setDeleteAttachmentId] = useState<string | null>(null);
//   const [isDeletingAttachment, setIsDeletingAttachment] = useState<boolean>(false);

//   // API hooks
//   const {
//     data: ticketData,
//     isLoading: ticketLoading,
//     refetch: refetchTicket,
//     isFetching,
//   } = useGetSingleSupportTicketQuery(id!, { skip: !id });

//   const {
//     data: commentsData,
//     isLoading: commentsLoading,
//     refetch: refetchComments,
//   } = useGetTicketCommentsQuery(id!, { skip: !id });

//   const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportTicketStatusMutation();
//   const [assignTicket, { isLoading: isAssigning }] = useAssignSupportTicketMutation();
//   const [addComment, { isLoading: isAddingComment }] = useAddCommentToTicketMutation();
//   const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
//   const [deleteComment] = useDeleteCommentMutation();
//   const [deleteAttachment] = useDeleteSupportTicketAttachmentMutation();

//   const ticket = ticketData?.data?.ticket as SupportTicket | undefined;
//   const comments: Comment[] = commentsData?.data || [];

//   // Determine creator info from either createdBy or publicUserInfo
//   const creatorInfo = ticket?.createdBy || ticket?.publicUserInfo;
//   const name = creatorInfo?.name || "";
//   const email = creatorInfo?.email || "N/A";

//   // Check if user can see internal comments
//   const canSeeInternalComments = ADMIN_ROLES.includes(user?.role || "");

//   // Check if user can manage ticket (admin actions)
//   const canManageTicket = ADMIN_ROLES.includes(user?.role || "");

//   // Filter comments based on user permissions
//   const visibleComments = comments.filter(
//     (comment) => !comment.isInternal || canSeeInternalComments
//   );

//   // Handle status update
//   const handleStatusUpdate = async (newStatus: string): Promise<void> => {
//     if (!ticket || !user) return;

//     try {
//       await updateStatus({
//         id: ticket._id,
//         status: newStatus,
//         updatedBy: user._id,
//         updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success("Ticket status updated successfully");
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update ticket status");
//     }
//   };

//   // Handle ticket assignment
//   const handleAssignTicket = async (agentId: string): Promise<void> => {
//     if (!ticket || !user) return;

//     try {
//       await assignTicket({
//         id: ticket._id,
//         assignedTo: agentId || null,
//         updatedBy: user._id,
//         updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success(agentId ? "Ticket assigned successfully" : "Ticket unassigned");
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to assign ticket");
//     }
//   };

//   // Handle add comment
//   const handleAddComment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!newComment.trim() || !ticket || !user) return;

//     try {
//       await addComment({
//         ticketId: ticket._id,
//         comment: newComment,
//         parentCommentId: replyingTo,
//         isInternal,
//         commentedBy: user._id,
//         commentedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success("Comment added successfully");
//       setNewComment("");
//       setReplyingTo(null);
//       setIsInternal(false);
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to add comment");
//     }
//   };

//   // Handle edit comment
//   const handleEditComment = async (commentId: string): Promise<void> => {
//     if (!editCommentText.trim()) return;

//     try {
//       await updateComment({
//         commentId,
//         comment: editCommentText,
//       }).unwrap();
//       toast.success("Comment updated successfully");
//       setEditingComment(null);
//       setEditCommentText("");
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update comment");
//     }
//   };

//   // Handle delete comment
//   const handleConfirmDeleteComment = async (): Promise<void> => {
//     if (!deleteCommentId) return;

//     try {
//       setIsDeletingComment(true);
//       await deleteComment(deleteCommentId).unwrap();
//       toast.success("Comment deleted successfully");
//       setDeleteCommentId(null);
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete comment");
//     } finally {
//       setIsDeletingComment(false);
//     }
//   };

//   const handleDeleteAttachment = async (fileName: string) => {
//     if (!ticket?._id) {
//       toast.error('Ticket ID is required');
//       return;
//     }

//     try {
//       setIsDeletingAttachment(true);
//       await deleteAttachment({
//         ticketId: ticket._id,
//         fileName: fileName
//       }).unwrap();

//       toast.success('Attachment deleted successfully');
//       // Refresh the ticket data to update attachments list
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Failed to delete attachment');
//     } finally {
//       setIsDeletingAttachment(false);
//     }
//   };

//   // Handle send email
//   const handleSendEmail = (): void => {
//     if (email && email !== "N/A") {
//       window.open(`${frontEndURL}/admin/emails/compose?email=${email}`, "_blank");
//     }
//   };

//   // Get display name for agent
//   const getAgentDisplayName = (agent: UserData): string => {
//     if (agent.firstName && agent.lastName) {
//       return `${agent.firstName} ${agent.lastName}`;
//     }
//     if (agent.firstName) {
//       return agent.firstName;
//     }
//     if (agent.name) {
//       return agent.name;
//     }
//     return agent.email;
//   };

//   // Loading state
//   if (isUserLoading || ticketLoading || isFetching || isSupportAgentsLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Loader2 className="h-12 w-12 animate-spin text-primary" />
//       </div>
//     );
//   }

//   // Ticket not found
//   if (!ticket) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Headset className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
//           <p className="text-gray-600 mb-4">
//             The support ticket you're looking for doesn't exist.
//           </p>
//           <Button
//             onClick={() => navigate("/support-tickets-management")}
//             className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
//           >
//             Back to Tickets
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   console.log(ticket)

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-6xl mx-auto p-6 my-6">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             onClick={() => navigate("/system-management?tab=support-tickets-management")}
//             className="flex items-center space-x-0 text-primary hover:text-primary/80 mb-4 transition-colors duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 text-white" />
//             <span className="text-white">Back</span>
//           </Button>

//           {/* Ticket Details Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//               <div className="flex items-start gap-3">
//                 {/* Icon */}
//                 <div className="p-2.5 bg-primary/10 rounded-xl">
//                   <MessageSquare className="h-6 w-6 text-primary" />
//                 </div>

//                 {/* Title + Meta */}
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 break-words">
//                     {ticket.subject}
//                   </h1>

//                   <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
//                     {/* Status */}
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(
//                         ticket.status
//                       )}`}
//                     >
//                       {getStatusIcon(ticket.status)}
//                       {ticket.status}
//                     </span>

//                     {/* Date */}
//                     <span className="flex items-center text-xs sm:text-sm text-gray-500">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {new Date(ticket.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
//               {ticket.description}
//             </p>

//             {/* Divider */}
//             <div className="my-4 border-t border-gray-100" />

//             {/* Footer Info */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
//               {/* Created By */}
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <User className="h-4 w-4 text-gray-400" />
//                 <span>
//                   Created by{" "}
//                   <span className="font-medium text-gray-800">
//                     {name ? `${name} (${email})` : email}
//                   </span>
//                 </span>
//               </div>

//               {/* Assigned To */}
//               {ticket.assignedTo && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Users className="h-4 w-4 text-gray-400" />
//                   <span>
//                     Assigned to{" "}
//                     <span className="font-medium text-gray-800">
//                       {ticket.assignedTo.name || ""}
//                     </span>
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Attachments Section */}
//             {ticket.attachments && ticket.attachments.length > 0 && (
//               <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-bold text-gray-900 flex items-center">
//                     <PaperclipIcon className="h-5 w-5 mr-2 text-primary" />
//                     Attachments ({ticket.attachments.length})
//                   </h2>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {ticket.attachments.map((attachment, index) => {
//                       const fileName = attachment.split('/').pop() || attachment;
//                       const fileExtension = fileName.split('.').pop()?.toLowerCase();
//                       const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');
//                       const isPdf = fileExtension === 'pdf';

//                       const getFullAttachmentUrl = (attachment: string) => {
//                         if (attachment.startsWith('http://') || attachment.startsWith('https://')) {
//                           return attachment;
//                         }
//                         return `${baseURL}/uploads/support-ticket-attachments/${attachment}`;
//                       };

//                       const fullUrl = getFullAttachmentUrl(attachment);

//                       return (
//                         <div key={index} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
//                           <div className="flex-shrink-0 mb-2">
//                             {isImage ? (
//                               <img
//                                 src={fullUrl}
//                                 alt={fileName}
//                                 className="w-16 h-16 object-cover rounded border"
//                                 onError={(e) => {
//                                   e.currentTarget.style.display = 'none';
//                                 }}
//                               />
//                             ) : (
//                               <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
//                                 <PaperclipIcon className={`w-8 h-8 ${isPdf ? 'text-red-500' : 'text-gray-500'}`} />
//                               </div>
//                             )}
//                           </div>

//                           <div className="flex-1 min-w-0 w-full">
//                             <a
//                               href={fullUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline block break-words"
//                               title={fileName}
//                             >
//                               {fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName}
//                             </a>
//                           </div>
 
//                           {/* Delete Button */}
//                           <div className="flex-shrink-0 mt-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleDeleteAttachment(fileName)}
//                               className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
//                               title="Delete attachment"
//                               disabled={isDeletingAttachment}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Admin Action Buttons */}
//             {canManageTicket && (
//               <>
//                 <div className="my-4 border-t border-gray-100" />
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   {/* Status Dropdown */}
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-700">Status:</label>
//                     <select
//                       value={ticket.status}
//                       onChange={(e) => handleStatusUpdate(e.target.value)}
//                       disabled={isUpdatingStatus}
//                       className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
//                     >
//                       <option value="Pending">{getStatusEmoji("Pending")} Pending</option>
//                       <option value="Open">{getStatusEmoji("Open")} Open</option>
//                       <option value="In Progress">{getStatusEmoji("In Progress")} In Progress</option>
//                       <option value="Resolved">{getStatusEmoji("Resolved")} Resolved</option>
//                       <option value="Closed">{getStatusEmoji("Closed")} Closed</option>
//                     </select>
//                   </div>

//                   {/* Assign Dropdown */}
//                  {user?.role !== 'SUPPORT_AGENT' && <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-700">Assign to:</label>
//                     <select
//                       value={ticket.assignedTo?._id || ""}
//                       onChange={(e) => handleAssignTicket(e.target.value)}
//                       disabled={isAssigning}
//                       className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
//                     >
//                       <option value="">👤 Unassigned</option>
//                       {supportAgents.map((agent) => (
//                         <option key={agent._id} value={agent._id}>
//                           {getAgentDisplayName(agent)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>}

//                   {/* Send Email Button */}
//                   {/* <Button
//                     onClick={handleSendEmail}
//                     disabled={email === "N/A"}
//                     className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
//                   >
//                     <Mail className="h-4 w-4" />
//                     <span>Send Email</span>
//                   </Button> */}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Comments Section */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <MessageSquare className="h-5 w-5 mr-2 text-primary" />
//               Comments ({visibleComments.length})
//             </h2>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Existing Comments */}
//             {commentsLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//               </div>
//             ) : visibleComments.length === 0 ? (
//               <div className="text-center py-8">
//                 <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-600">No comments yet. Start the conversation!</p>
//               </div>
//             ) : (
//               visibleComments.map((comment) => (
//                 <div
//                   key={comment._id}
//                   className={`border rounded-lg p-4 ${
//                     comment.isInternal
//                       ? "border-purple-200 bg-purple-50/50"
//                       : "border-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-white text-sm font-semibold">
//                           {comment.commentedBy?.name?.[0]?.toUpperCase() || "U"}
//                       </span>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex flex-wrap items-center gap-2 mb-2">
//                         <span className="font-semibold text-gray-900">
//                           { comment.commentedBy?.name}{" "}
//                         </span>
//                         {comment.isInternal && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                             <EyeOff className="h-3 w-3 mr-1" />
//                             Internal
//                           </span>
//                         )}
//                         <span className="text-sm text-gray-500">
//                           {new Date(comment.createdAt).toLocaleDateString()} at{" "}
//                           {new Date(comment.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>

//                       {editingComment === comment._id ? (
//                         <div className="space-y-3">
//                           <textarea
//                             value={editCommentText}
//                             onChange={(e) => setEditCommentText(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                             rows={3}
//                           />
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEditComment(comment._id)}
//                               disabled={isUpdatingComment}
//                               className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm disabled:opacity-50"
//                             >
//                               {isUpdatingComment ? "Saving..." : "Save"}
//                             </button>
//                             <button
//                               onClick={() => setEditingComment(null)}
//                               className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <p className="text-gray-700 mb-3">{comment.comment}</p>
//                           <div className="flex items-center space-x-2 sm:space-x-4">
//                             {/* Reply Button */}
//                             <button
//                               onClick={() => setReplyingTo(comment._id)}
//                               className="flex items-center justify-center sm:justify-start text-primary hover:text-primary/80 text-sm cursor-pointer"
//                             >
//                               <div className="p-2 sm:p-0 bg-primary/10 sm:bg-transparent rounded-full sm:rounded-none flex items-center justify-center">
//                                 <Reply className="h-4 w-4 sm:mr-1 text-primary sm:text-current" />
//                               </div>
//                               <span className="hidden sm:inline">Reply</span>
//                             </button>

//                             {/* Edit & Delete - Admin can edit/delete any comment */}
//                             {(comment.commentedBy?._id === user?._id || canManageTicket) && (
//                               <>
//                                 <button
//                                   onClick={() => {
//                                     setEditingComment(comment._id);
//                                     setEditCommentText(comment.comment);
//                                   }}
//                                   className="flex items-center justify-center sm:justify-start text-gray-600 hover:text-gray-800 text-sm cursor-pointer"
//                                 >
//                                   <div className="p-2 sm:p-0 bg-primary/10 sm:bg-transparent rounded-full sm:rounded-none flex items-center justify-center">
//                                     <Edit3 className="h-4 w-4 sm:mr-1 text-primary sm:text-current" />
//                                   </div>
//                                   <span className="hidden sm:inline">Edit</span>
//                                 </button>

//                                 <button
//                                   onClick={() => setDeleteCommentId(comment._id)}
//                                   className="flex items-center justify-center sm:justify-start text-red-600 hover:text-red-800 text-sm cursor-pointer"
//                                 >
//                                   <div className="p-2 sm:p-0 bg-red-100 sm:bg-transparent rounded-full sm:rounded-none flex items-center justify-center">
//                                     <Trash2 className="h-4 w-4 sm:mr-1 text-red-600 sm:text-current" />
//                                   </div>
//                                   <span className="hidden sm:inline">Delete</span>
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}

//             {/* Add Comment Form */}
//             <div className="border-t border-gray-100 pt-6">
//               {replyingTo && (
//                 <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-blue-800">Replying to comment</span>
//                     <button
//                       onClick={() => setReplyingTo(null)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <XCircle className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleAddComment} className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="flex items-center text-sm font-semibold text-gray-700">
//                     <MessageSquare className="h-4 w-4 mr-2 text-primary" />
//                     Add Comment
//                   </label>
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Type your comment here..."
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   {/* Internal Note Checkbox - Only for admins */}
//                   <div className="flex items-center space-x-4">
//                     {canSeeInternalComments && (
//                       <label className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={isInternal}
//                           onChange={(e) => setIsInternal(e.target.checked)}
//                           className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
//                         />
//                         <span className="text-sm text-gray-700 flex items-center">
//                           <EyeOff className="h-4 w-4 mr-1" />
//                           Internal note (visible to support staff only)
//                         </span>
//                       </label>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={!newComment.trim() || isAddingComment}
//                     className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200"
//                   >
//                     {isAddingComment ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Adding...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-4 w-4 mr-2" />
//                         {replyingTo ? "Reply" : "Add Comment"}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={!!deleteCommentId}
//         onClose={() => setDeleteCommentId(null)}
//         onConfirm={handleConfirmDeleteComment}
//         title="Delete Comment"
//         itemName="this comment"
//         description="This action cannot be undone."
//         isLoading={isDeletingComment}
//       />
//     </div>
//   );
// };

// export default AdminSupportTicketDetailsPage;


// // pages/support/AdminSupportTicketDetailsPage.tsx
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useGetSingleSupportTicketQuery,
//   useUpdateSupportTicketStatusMutation,
//   useUpdateSupportTicketCategoryMutation,
//   useAssignSupportTicketMutation,
//   useAddCommentToTicketMutation,
//   useGetTicketCommentsQuery,
//   useUpdateCommentMutation,
//   useDeleteCommentMutation,
//   useDeleteSupportTicketAttachmentMutation,
//   useGetSupportCategoriesQuery,
//   useCreateSupportCategoryMutation,
// } from "@/redux/features/support/supportApiSlice";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";
// import { baseURL } from "@/config";
// import { cn } from "@/lib/utils";

// import {
//   ArrowLeft,
//   MessageSquare,
//   User,
//   Clock,
//   Send,
//   Edit3,
//   Trash2,
//   Reply,
//   EyeOff,
//   Calendar,
//   Headset,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Loader2,
//   Users,
//   Mail,
//   PaperclipIcon,
//   ChevronDown,
//   Search,
//   Plus,
//   History,
//   Eye,
//   Tag,
//   ExternalLink,
// } from "lucide-react";
// import { toast } from "sonner";
// import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
// import { Button } from "@/components/ui/button";
// import { Comment, SupportTicket, UserInfo } from "@/types/support.type";
// import TicketActivityLogsModal from "./ActivityLogModal";
// import ImageLightbox from "./ImageLightBox";

// // Frontend URL for email compose
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL || "";

// // Allowed roles for admin actions
// const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "SUPPORT_AGENT"];

// // Status configuration
// const STATUS_CONFIG: Record<
//   string,
//   { color: string; icon: React.ReactNode; emoji: string }
// > = {
//   Pending: {
//     color: "bg-amber-100 text-amber-800 border-amber-200",
//     icon: <Clock className="h-4 w-4" />,
//     emoji: "🟡",
//   },
//   Open: {
//     color: "bg-blue-100 text-blue-800 border-blue-200",
//     icon: <AlertCircle className="h-4 w-4" />,
//     emoji: "🔵",
//   },
//   "In Progress": {
//     color: "bg-violet-100 text-violet-800 border-violet-200",
//     icon: <Clock className="h-4 w-4" />,
//     emoji: "🟣",
//   },
//   Resolved: {
//     color: "bg-emerald-100 text-emerald-800 border-emerald-200",
//     icon: <CheckCircle className="h-4 w-4" />,
//     emoji: "🟢",
//   },
//   Closed: {
//     color: "bg-gray-100 text-gray-800 border-gray-200",
//     icon: <XCircle className="h-4 w-4" />,
//     emoji: "⚫",
//   },
// };

// interface CategoryType {
//   _id: string;
//   name: string;
//   color: string;
//   description?: string;
// }

// interface UserData {
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   name?: string;
//   email: string;
//   role: string;
// }

// interface DropdownPosition {
//   top: number;
//   left: number;
// }

// // --------------------- Main Component ---------------------
// const AdminSupportTicketDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // User data
//   const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
//   const user = userData?.data as UserInfo | undefined;

//   // Support agents
//   const { data: supportAgentsData, isLoading: isSupportAgentsLoading } =
//     useGetAllSupportAgentsQuery({ page: 1, limit: 1000000 });

//   // Categories
//   const { data: categoriesData, refetch: refetchCategories } =
//     useGetSupportCategoriesQuery();

//   const allUsers: UserData[] = supportAgentsData?.data || [];
//   const supportAgents = allUsers.filter((u) => u.role === "SUPPORT_AGENT");
//   const categories: CategoryType[] = categoriesData?.data || [];

//   // State
//   const [newComment, setNewComment] = useState<string>("");
//   const [isInternal, setIsInternal] = useState<boolean>(false);
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [editingComment, setEditingComment] = useState<string | null>(null);
//   const [editCommentText, setEditCommentText] = useState<string>("");
//   const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
//   const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
//   const [isDeletingAttachment, setIsDeletingAttachment] = useState<boolean>(false);

//   // Category dropdown state
//   const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
//   const [isUpdatingCategory, setIsUpdatingCategory] = useState<boolean>(false);
//   const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
//   const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  
//   const categoryButtonRef = useRef<HTMLButtonElement>(null);
//   const categoryDropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Activity logs modal
//   const [showActivityLogsModal, setShowActivityLogsModal] = useState<boolean>(false);

//   // Lightbox state
//   const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
//   const [showAllAttachments, setShowAllAttachments] = useState<boolean>(false);

//   // API hooks
//   const {
//     data: ticketData,
//     isLoading: ticketLoading,
//     refetch: refetchTicket,
//     isFetching,
//   } = useGetSingleSupportTicketQuery(id!, { skip: !id });

//   const {
//     data: commentsData,
//     isLoading: commentsLoading,
//     refetch: refetchComments,
//   } = useGetTicketCommentsQuery(id!, { skip: !id });

//   const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportTicketStatusMutation();
//   const [updateCategory] = useUpdateSupportTicketCategoryMutation();
//   const [createCategory] = useCreateSupportCategoryMutation();
//   const [assignTicket, { isLoading: isAssigning }] = useAssignSupportTicketMutation();
//   const [addComment, { isLoading: isAddingComment }] = useAddCommentToTicketMutation();
//   const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
//   const [deleteComment] = useDeleteCommentMutation();
//   const [deleteAttachment] = useDeleteSupportTicketAttachmentMutation();

//   const ticket = ticketData?.data?.ticket as SupportTicket | undefined;
//   const comments: Comment[] = commentsData?.data || [];

//   // Determine creator info
//   const creatorInfo = ticket?.createdBy || ticket?.publicUserInfo;
//   const creatorName = creatorInfo?.name || "";
//   const creatorEmail = creatorInfo?.email || "N/A";

//   // Check permissions
//   const canSeeInternalComments = ADMIN_ROLES.includes(user?.role || "");
//   const canManageTicket = ADMIN_ROLES.includes(user?.role || "");

//   // Filter comments
//   const visibleComments = comments.filter(
//     (comment) => !comment.isInternal || canSeeInternalComments
//   );

//   // Get image attachments for lightbox
//   const imageAttachments =
//     ticket?.attachments?.filter((att) => {
//       const ext = att.split(".").pop()?.toLowerCase();
//       return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
//     }) || [];

//   // Calculate dropdown position
//   const calculateDropdownPosition = useCallback(() => {
//     if (categoryButtonRef.current) {
//       const rect = categoryButtonRef.current.getBoundingClientRect();
//       const dropdownHeight = 320; // Approximate max height of dropdown
//       const viewportHeight = window.innerHeight;
//       const spaceBelow = viewportHeight - rect.bottom;
//       const spaceAbove = rect.top;

//       let top: number;
//       if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
//         // Open below
//         top = rect.bottom + 8;
//       } else {
//         // Open above
//         top = rect.top - dropdownHeight - 8;
//       }

//       setDropdownPosition({
//         top: Math.max(8, top),
//         left: rect.left,
//       });
//     }
//   }, []);

//   // Handle category dropdown toggle
//   const handleCategoryDropdownToggle = () => {
//     if (isUpdatingCategory) return;
    
//     if (!showCategoryDropdown) {
//       calculateDropdownPosition();
//     }
//     setShowCategoryDropdown(!showCategoryDropdown);
//   };

//   // Focus search input after dropdown opens (without scrolling)
//   useEffect(() => {
//     if (showCategoryDropdown && searchInputRef.current) {
//       // Use requestAnimationFrame to ensure DOM is ready
//       requestAnimationFrame(() => {
//         searchInputRef.current?.focus({ preventScroll: true });
//       });
//     }
//   }, [showCategoryDropdown]);

//   // Update position on scroll/resize
//   useEffect(() => {
//     if (showCategoryDropdown) {
//       const handlePositionUpdate = () => {
//         calculateDropdownPosition();
//       };

//       window.addEventListener("scroll", handlePositionUpdate, true);
//       window.addEventListener("resize", handlePositionUpdate);

//       return () => {
//         window.removeEventListener("scroll", handlePositionUpdate, true);
//         window.removeEventListener("resize", handlePositionUpdate);
//       };
//     }
//   }, [showCategoryDropdown, calculateDropdownPosition]);

//   // Close category dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         categoryDropdownRef.current &&
//         !categoryDropdownRef.current.contains(event.target as Node) &&
//         categoryButtonRef.current &&
//         !categoryButtonRef.current.contains(event.target as Node)
//       ) {
//         setShowCategoryDropdown(false);
//         setCategorySearchTerm("");
//       }
//     };

//     if (showCategoryDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [showCategoryDropdown]);

//   // Close dropdown on escape key
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && showCategoryDropdown) {
//         setShowCategoryDropdown(false);
//         setCategorySearchTerm("");
//       }
//     };

//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showCategoryDropdown]);

//   // Get filtered categories
//   const getFilteredCategories = () => {
//     if (!categorySearchTerm.trim()) return categories;
//     return categories.filter((cat) =>
//       cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
//     );
//   };

//   // Handle status update
//   const handleStatusUpdate = async (newStatus: string): Promise<void> => {
//     if (!ticket || !user) return;

//     try {
//       await updateStatus({
//         id: ticket._id,
//         status: newStatus,
//         updatedBy: user._id,
//         updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success("Ticket status updated successfully");
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update ticket status");
//     }
//   };

//   // Handle category update
//   const handleCategoryUpdate = async (categoryId: string): Promise<void> => {
//     if (!ticket || !user) return;

//     setIsUpdatingCategory(true);
//     try {
//       await updateCategory({
//         id: ticket._id,
//         category: categoryId || null,
//       }).unwrap();
//       toast.success("Category updated successfully");
//       refetchTicket();
//       setShowCategoryDropdown(false);
//       setCategorySearchTerm("");
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update category");
//     } finally {
//       setIsUpdatingCategory(false);
//     }
//   };

//   // Handle create category
//   const handleCreateCategory = async (name: string): Promise<void> => {
//     if (!name.trim()) return;

//     setIsCreatingCategory(true);
//     try {
//       const result = await createCategory({
//         data: {
//           name: name.trim(),
//           color: "#3B82F6",
//         },
//       }).unwrap();
//       toast.success("Category created!");
//       await refetchCategories();
//       await handleCategoryUpdate(result.data._id);
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to create category");
//     } finally {
//       setIsCreatingCategory(false);
//     }
//   };

//   // Handle ticket assignment
//   const handleAssignTicket = async (agentId: string): Promise<void> => {
//     if (!ticket || !user) return;

//     try {
//       await assignTicket({
//         id: ticket._id,
//         assignedTo: agentId || null,
//         updatedBy: user._id,
//         updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success(agentId ? "Ticket assigned successfully" : "Ticket unassigned");
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to assign ticket");
//     }
//   };

//   // Handle add comment
//   const handleAddComment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!newComment.trim() || !ticket || !user) return;

//     try {
//       await addComment({
//         ticketId: ticket._id,
//         comment: newComment,
//         parentCommentId: replyingTo,
//         isInternal,
//         commentedBy: user._id,
//         commentedByModel: user.role === "Dependent" ? "Dependent" : "User",
//       }).unwrap();
//       toast.success("Comment added successfully");
//       setNewComment("");
//       setReplyingTo(null);
//       setIsInternal(false);
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to add comment");
//     }
//   };

//   // Handle edit comment
//   const handleEditComment = async (commentId: string): Promise<void> => {
//     if (!editCommentText.trim()) return;

//     try {
//       await updateComment({
//         commentId,
//         comment: editCommentText,
//       }).unwrap();
//       toast.success("Comment updated successfully");
//       setEditingComment(null);
//       setEditCommentText("");
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update comment");
//     }
//   };

//   // Handle delete comment
//   const handleConfirmDeleteComment = async (): Promise<void> => {
//     if (!deleteCommentId) return;

//     try {
//       setIsDeletingComment(true);
//       await deleteComment(deleteCommentId).unwrap();
//       toast.success("Comment deleted successfully");
//       setDeleteCommentId(null);
//       refetchComments();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete comment");
//     } finally {
//       setIsDeletingComment(false);
//     }
//   };

//   // Handle delete attachment
//   const handleDeleteAttachment = async (fileName: string) => {
//     if (!ticket?._id) {
//       toast.error("Ticket ID is required");
//       return;
//     }

//     try {
//       setIsDeletingAttachment(true);
//       await deleteAttachment({
//         ticketId: ticket._id,
//         fileName: fileName,
//       }).unwrap();
//       toast.success("Attachment deleted successfully");
//       refetchTicket();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete attachment");
//     } finally {
//       setIsDeletingAttachment(false);
//     }
//   };

//   // Handle send email
//   const handleSendEmail = (): void => {
//     if (creatorEmail && creatorEmail !== "N/A") {
//       window.open(
//         `${frontEndURL}/admin/emails/compose?email=${creatorEmail}`,
//         "_blank"
//       );
//     }
//   };

//   // Get display name for agent
//   const getAgentDisplayName = (agent: UserData): string => {
//     if (agent.firstName && agent.lastName) {
//       return `${agent.firstName} ${agent.lastName}`;
//     }
//     if (agent.firstName) {
//       return agent.firstName;
//     }
//     if (agent.name) {
//       return agent.name;
//     }
//     return agent.email;
//   };

//   // Get full attachment URL
//   const getFullAttachmentUrl = (attachment: string) => {
//     if (attachment.startsWith("http://") || attachment.startsWith("https://")) {
//       return attachment;
//     }
//     return `${baseURL}/uploads/support-ticket-attachments/${attachment}`;
//   };

//   // Open lightbox
//   const openLightbox = (index: number) => {
//     setCurrentImageIndex(index);
//     setLightboxOpen(true);
//   };

//   // Loading state
//   if (isUserLoading || ticketLoading || isFetching || isSupportAgentsLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-gray-600">Loading ticket details...</p>
//         </div>
//       </div>
//     );
//   }

//   // Ticket not found
//   if (!ticket) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Headset className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
//           <p className="text-gray-600 mb-4">
//             The support ticket you're looking for doesn't exist.
//           </p>
//           <Button onClick={() => navigate("/support-tickets-management")}>
//             Back to Tickets
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG["Pending"];

//   return (
//     <div className="min-h-screen bg-gray-50/50">
//       <div className="max-w-6xl mx-auto p-6 my-6">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             onClick={() => navigate("/system-management?tab=support-tickets-management")}
//             variant="outline"
//             className="flex items-center gap-2  mb-3"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Go Back</span>
//           </Button>

//           {/* Ticket Details Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//             {/* Header Section */}
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
//                     <MessageSquare className="h-6 w-6 text-primary" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words mb-3">
//                       {ticket.subject}
//                     </h1>

//                     <div className="flex flex-wrap items-center gap-3">
//                       {/* Status Badge */}
//                       <span
//                         className={cn(
//                           "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
//                           statusConfig.color
//                         )}
//                       >
//                         {statusConfig.icon}
//                         {ticket.status}
//                       </span>

//                       {/* Category Badge */}
//                       {ticket.category && (
//                         <span
//                           className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border"
//                           style={{
//                             backgroundColor: `${ticket.category.color}15`,
//                             borderColor: `${ticket.category.color}30`,
//                             color: ticket.category.color,
//                           }}
//                         >
//                           <div
//                             className="w-2 h-2 rounded-full"
//                             style={{ backgroundColor: ticket.category.color }}
//                           />
//                           {ticket.category.name}
//                         </span>
//                       )}

//                       {/* Date */}
//                       <span className="flex items-center text-sm text-gray-500">
//                         <Calendar className="h-4 w-4 mr-1.5" />
//                         {new Date(ticket.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Activity Logs Button */}
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowActivityLogsModal(true)}
//                   className="flex items-center gap-2"
//                 >
//                   <History className="h-4 w-4" />
//                   Activity Logs
//                 </Button>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="p-6 border-b border-gray-100">
//               <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                 {ticket.description}
//               </p>
//             </div>

//             {/* Attachments Section */}
//             {ticket.attachments && ticket.attachments.length > 0 && (
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="flex items-center text-sm font-semibold text-gray-700">
//                     <PaperclipIcon className="h-4 w-4 mr-2 text-gray-400" />
//                     Attachments ({ticket.attachments.length})
//                   </h3>
//                   {ticket.attachments.length > 4 && (
//                     <button
//                       onClick={() => setShowAllAttachments(!showAllAttachments)}
//                       className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
//                     >
//                       {showAllAttachments
//                         ? "Show Less"
//                         : `Show All (${ticket.attachments.length})`}
//                     </button>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                   {(showAllAttachments
//                     ? ticket.attachments
//                     : ticket.attachments.slice(0, 4)
//                   ).map((attachment, index) => {
//                     const fileName = attachment.split("/").pop() || attachment;
//                     const fileExtension = fileName.split(".").pop()?.toLowerCase();
//                     const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
//                       fileExtension || ""
//                     );
//                     const isPdf = fileExtension === "pdf";
//                     const fullUrl = getFullAttachmentUrl(attachment);
//                     const imageIndex = imageAttachments.indexOf(attachment);

//                     return (
//                       <div
//                         key={index}
//                         className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
//                       >
//                         {isImage ? (
//                           <>
//                             <img
//                               src={fullUrl}
//                               alt={fileName}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                               }}
//                             />
//                             <div
//                               className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors cursor-pointer flex items-center justify-center"
//                               onClick={() => openLightbox(imageIndex)}
//                             >
//                               <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
//                             </div>
//                           </>
//                         ) : (
//                           <a
//                             href={fullUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full h-full flex flex-col items-center justify-center p-4"
//                           >
//                             <div
//                               className={cn(
//                                 "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
//                                 isPdf ? "bg-red-100" : "bg-gray-100"
//                               )}
//                             >
//                               <PaperclipIcon
//                                 className={cn(
//                                   "h-6 w-6",
//                                   isPdf ? "text-red-500" : "text-gray-500"
//                                 )}
//                               />
//                             </div>
//                             <span className="text-xs text-gray-600 text-center truncate w-full">
//                               {fileName.length > 15
//                                 ? `${fileName.substring(0, 12)}...`
//                                 : fileName}
//                             </span>
//                           </a>
//                         )}

//                         {/* Delete Button */}
//                         {canManageTicket && (
//                           <button
//                             onClick={() => handleDeleteAttachment(fileName)}
//                             disabled={isDeletingAttachment}
//                             className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
//                             title="Delete attachment"
//                           >
//                             <Trash2 className="h-3.5 w-3.5" />
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Creator Info */}
//             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
//               <div className="flex flex-wrap items-center gap-6">
//                 <div className="flex items-center gap-2 text-sm">
//                   <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                     <User className="h-4 w-4 text-gray-500" />
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Created by</span>
//                     <p className="font-medium text-gray-900">
//                       {creatorName ? `${creatorName} (${creatorEmail})` : creatorEmail}
//                     </p>
//                   </div>
//                 </div>

//                 {ticket.assignedTo && (
//                   <div className="flex items-center gap-2 text-sm">
//                     <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                       <Users className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Assigned to</span>
//                       <p className="font-medium text-gray-900">
//                         {ticket.assignedTo.name || ""}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Admin Actions */}
//             {canManageTicket && (
//               <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex flex-wrap items-center gap-4">
//                   {/* Status Dropdown */}
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-600">
//                       Status:
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={ticket.status}
//                         onChange={(e) => handleStatusUpdate(e.target.value)}
//                         disabled={isUpdatingStatus}
//                         className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50 appearance-none bg-white cursor-pointer"
//                       >
//                         <option value="Pending">🟡 Pending</option>
//                         <option value="Open">🔵 Open</option>
//                         <option value="In Progress">🟣 In Progress</option>
//                         <option value="Resolved">🟢 Resolved</option>
//                         <option value="Closed">⚫ Closed</option>
//                       </select>
//                       {isUpdatingStatus ? (
//                         <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
//                       ) : (
//                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                       )}
//                     </div>
//                   </div>

//                   {/* Category Dropdown */}
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium text-gray-600">
//                       Category:
//                     </label>
//                     <div className="relative">
//                       <button
//                         ref={categoryButtonRef}
//                         type="button"
//                         onClick={handleCategoryDropdownToggle}
//                         disabled={isUpdatingCategory}
//                         className={cn(
//                           "flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200",
//                           "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
//                           isUpdatingCategory && "opacity-50 cursor-not-allowed",
//                           ticket.category ? "bg-white" : "bg-gray-50 border-dashed",
//                           showCategoryDropdown && "ring-2 ring-primary/20 border-primary"
//                         )}
//                         style={
//                           ticket.category?.color
//                             ? {
//                                 backgroundColor: `${ticket.category.color}10`,
//                                 borderColor: `${ticket.category.color}40`,
//                               }
//                             : undefined
//                         }
//                       >
//                         {ticket.category ? (
//                           <>
//                             <div
//                               className="w-3 h-3 rounded-full"
//                               style={{ backgroundColor: ticket.category.color }}
//                             />
//                             <span className="text-sm font-medium">
//                               {ticket.category.name}
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <Tag className="h-4 w-4 text-gray-400" />
//                             <span className="text-sm text-gray-500">No Category</span>
//                           </>
//                         )}
//                         {isUpdatingCategory ? (
//                           <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />
//                         ) : (
//                           <ChevronDown
//                             className={cn(
//                               "h-4 w-4 text-gray-400 ml-2 transition-transform duration-200",
//                               showCategoryDropdown && "rotate-180"
//                             )}
//                           />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Assign Dropdown */}
//                   {user?.role !== "SUPPORT_AGENT" && (
//                     <div className="flex items-center gap-2">
//                       <label className="text-sm font-medium text-gray-600">
//                         Assign to:
//                       </label>
//                       <div className="relative">
//                         <select
//                           value={ticket.assignedTo?._id || ""}
//                           onChange={(e) => handleAssignTicket(e.target.value)}
//                           disabled={isAssigning}
//                           className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50 appearance-none bg-white cursor-pointer min-w-[180px]"
//                         >
//                           <option value="">👤 Unassigned</option>
//                           {supportAgents.map((agent) => (
//                             <option key={agent._id} value={agent._id}>
//                               {getAgentDisplayName(agent)}
//                             </option>
//                           ))}
//                         </select>
//                         {isAssigning ? (
//                           <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
//                         ) : (
//                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Send Email Button */}
//                   <Button
//                     onClick={handleSendEmail}
//                     disabled={creatorEmail === "N/A"}
//                     variant="outline"
//                     className="flex items-center gap-2"
//                   >
//                     <Mail className="h-4 w-4" />
//                     <span>Send Email</span>
//                     <ExternalLink className="h-3 w-3 text-gray-400" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Comments Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center">
//               <MessageSquare className="h-5 w-5 mr-2 text-primary" />
//               Comments ({visibleComments.length})
//             </h2>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Comments List */}
//             {commentsLoading ? (
//               <div className="flex items-center justify-center py-12">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//               </div>
//             ) : visibleComments.length === 0 ? (
//               <div className="text-center py-12">
//                 <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-600 font-medium">No comments yet</p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Start the conversation by adding a comment below
//                 </p>
//               </div>
//             ) : (
//               visibleComments.map((comment) => (
//                 <div
//                   key={comment._id}
//                   className={cn(
//                     "rounded-xl border p-5 transition-all duration-200",
//                     comment.isInternal
//                       ? "bg-purple-50/50 border-purple-200"
//                       : "bg-white border-gray-200 hover:border-gray-300"
//                   )}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
//                       <span className="text-white text-sm font-bold">
//                         {comment.commentedBy?.name?.[0]?.toUpperCase() || "U"}
//                       </span>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex flex-wrap items-center gap-2 mb-3">
//                         <span className="font-semibold text-gray-900">
//                           {comment.commentedBy?.name}
//                         </span>
//                         {comment.isInternal && (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//                             <EyeOff className="h-3 w-3" />
//                             Internal
//                           </span>
//                         )}
//                         <span className="text-sm text-gray-500">
//                           {new Date(comment.createdAt).toLocaleDateString()} at{" "}
//                           {new Date(comment.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>

//                       {editingComment === comment._id ? (
//                         <div className="space-y-3">
//                           <textarea
//                             value={editCommentText}
//                             onChange={(e) => setEditCommentText(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//                             rows={3}
//                           />
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               onClick={() => handleEditComment(comment._id)}
//                               disabled={isUpdatingComment}
//                             >
//                               {isUpdatingComment ? (
//                                 <>
//                                   <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                                   Saving...
//                                 </>
//                               ) : (
//                                 "Save Changes"
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => setEditingComment(null)}
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <p className="text-gray-700 mb-4 whitespace-pre-wrap">
//                             {comment.comment}
//                           </p>

//                           <div className="flex items-center gap-4">
//                             <button
//                               onClick={() => setReplyingTo(comment._id)}
//                               className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
//                             >
//                               <Reply className="h-4 w-4" />
//                               Reply
//                             </button>

//                             {(comment.commentedBy?._id === user?._id ||
//                               canManageTicket) && (
//                               <>
//                                 <button
//                                   onClick={() => {
//                                     setEditingComment(comment._id);
//                                     setEditCommentText(comment.comment);
//                                   }}
//                                   className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
//                                 >
//                                   <Edit3 className="h-4 w-4" />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => setDeleteCommentId(comment._id)}
//                                   className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                   Delete
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}

//             {/* Add Comment Form */}
//             <div className="border-t border-gray-100 pt-6">
//               {replyingTo && (
//                 <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Reply className="h-4 w-4 text-blue-600" />
//                     <span className="text-sm text-blue-800 font-medium">
//                       Replying to comment
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setReplyingTo(null)}
//                     className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-100 transition-colors"
//                   >
//                     <XCircle className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}

//               <form onSubmit={handleAddComment} className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="flex items-center text-sm font-semibold text-gray-700">
//                     <MessageSquare className="h-4 w-4 mr-2 text-primary" />
//                     Add Comment
//                   </label>
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Type your comment here..."
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   {/* Internal Note Checkbox */}
//                   {canSeeInternalComments && (
//                     <label className="flex items-center space-x-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={isInternal}
//                         onChange={(e) => setIsInternal(e.target.checked)}
//                         className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
//                       />
//                       <span className="text-sm text-gray-700 flex items-center">
//                         <EyeOff className="h-4 w-4 mr-1" />
//                         Internal note (visible to support staff only)
//                       </span>
//                     </label>
//                   )}

//                   <Button
//                     type="submit"
//                     disabled={!newComment.trim() || isAddingComment}
//                     className="flex items-center gap-2"
//                   >
//                     {isAddingComment ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Adding...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-4 w-4" />
//                         {replyingTo ? "Reply" : "Add Comment"}
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Category Dropdown Portal - Rendered at body level to avoid layout issues */}
//       {showCategoryDropdown && (
//         <div
//           ref={categoryDropdownRef}
//           className="fixed z-[9999] w-72 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
//           style={{
//             top: dropdownPosition.top,
//             left: dropdownPosition.left,
//           }}
//         >
//           {/* Search Input */}
//           <div className="p-3 border-b border-gray-100 bg-gray-50/50">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={categorySearchTerm}
//                 onChange={(e) => setCategorySearchTerm(e.target.value)}
//                 placeholder="Search or create category..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//               />
//             </div>
//           </div>

//           {/* Category List */}
//           <div className="max-h-64 overflow-y-auto p-2">
//             {/* No Category Option */}
//             <button
//               onClick={() => handleCategoryUpdate("")}
//               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
//                 <XCircle className="h-3 w-3 text-gray-400" />
//               </div>
//               <span className="text-sm text-gray-500">No Category</span>
//             </button>

//             {getFilteredCategories().length > 0 ? (
//               getFilteredCategories().map((category) => (
//                 <button
//                   key={category._id}
//                   onClick={() => handleCategoryUpdate(category._id)}
//                   className={cn(
//                     "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
//                     ticket?.category?._id === category._id
//                       ? "bg-primary/5 ring-1 ring-primary/20"
//                       : "hover:bg-gray-50"
//                   )}
//                 >
//                   <div
//                     className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
//                     style={{ backgroundColor: category.color }}
//                   />
//                   <span className="text-sm font-medium text-gray-700 truncate">
//                     {category.name}
//                   </span>
//                   {ticket?.category?._id === category._id && (
//                     <CheckCircle className="h-4 w-4 text-primary ml-auto flex-shrink-0" />
//                   )}
//                 </button>
//               ))
//             ) : categorySearchTerm.trim() ? (
//               <button
//                 onClick={() => handleCreateCategory(categorySearchTerm)}
//                 disabled={isCreatingCategory}
//                 className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left disabled:opacity-50"
//               >
//                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
//                   <Plus className="h-4 w-4 text-primary" />
//                 </div>
//                 <span className="text-sm font-medium text-primary">
//                   {isCreatingCategory ? "Creating..." : `Create "${categorySearchTerm}"`}
//                 </span>
//               </button>
//             ) : (
//               <div className="px-3 py-6 text-center text-sm text-gray-400">
//                 Type to search or create
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Backdrop for dropdown */}
//       {showCategoryDropdown && (
//         <div
//           className="fixed inset-0 z-[9998]"
//           onClick={() => {
//             setShowCategoryDropdown(false);
//             setCategorySearchTerm("");
//           }}
//         />
//       )}

//       {/* Delete Comment Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={!!deleteCommentId}
//         onClose={() => setDeleteCommentId(null)}
//         onConfirm={handleConfirmDeleteComment}
//         title="Delete Comment"
//         itemName="this comment"
//         description="This action cannot be undone."
//         isLoading={isDeletingComment}
//       />

//       {/* Activity Logs Modal */}
//       <TicketActivityLogsModal
//         isOpen={showActivityLogsModal}
//         onClose={() => setShowActivityLogsModal(false)}
//         ticketId={id!}
//       />

//       {/* Image Lightbox */}
//       <ImageLightbox
//         images={imageAttachments.map(getFullAttachmentUrl)}
//         currentIndex={currentImageIndex}
//         isOpen={lightboxOpen}
//         onClose={() => setLightboxOpen(false)}
//         onIndexChange={setCurrentImageIndex}
//       />
//     </div>
//   );
// };

// export default AdminSupportTicketDetailsPage;

// // components/TicketsTable.tsx
// import React from "react";
// import {
//   Eye,
//   Trash2,
//   ChevronDown,
//   MessageSquare,
//   User,
//   Calendar,
//   Users,
//   Settings,
//   Mail,
//   BadgeCheck,
//   Loader2,
//   Tag,
//   Plus,
//   Search,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import PermissionGate from "@/components/layout/PermissionGate";
// import { AgentType, CategoryType, LoadingState, TicketType } from "@/types/support.type";
// import { formatDate, formatTime, getAssignedUserName, getCreatorInfo, getInitials, getLoadingMessage, getStatusColor } from "@/utils/supportUtils";
// import { TICKET_STATUSES } from "../constant";



// interface TicketsTableProps {
//   tickets: TicketType[];
//   agents: AgentType[];
//   categories: CategoryType[];
//   isLoading: boolean;
//   loadingStates: Record<string, LoadingState>;
//   onStatusUpdate: (ticketId: string, status: string) => void;
//   onCategoryUpdate: (ticketId: string, categoryId: string) => void;
//   onAssignTicket: (ticketId: string, agentId: string) => void;
//   onDeleteTicket: (ticketId: string) => void;
//   onViewTicket: (ticketId: string) => void;
//   onNavigateToUser: (email: string) => void;
//   hasActiveFilters: boolean;
//   userRole: string;
//   categorySearchTerm: Record<string, string>;
//   setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   showCategoryDropdown: Record<string, boolean>;
//   setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   showAssignDropdown: Record<string, boolean>;
//   setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   assignSearchTerm: Record<string, string>;
//   setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   getFilteredCategories: (ticketId: string) => CategoryType[];
//   getFilteredAgents: (ticketId: string) => AgentType[];
//   onCreateCategory: (ticketId: string, name: string) => void;
//   creatingCategory: boolean;
// }

// const TicketsTable: React.FC<TicketsTableProps> = ({
//   tickets,
//   isLoading,
//   loadingStates,
//   onStatusUpdate,
//   onCategoryUpdate,
//   onAssignTicket,
//   onDeleteTicket,
//   onViewTicket,
//   onNavigateToUser,
//   hasActiveFilters,
//   userRole,
//   categorySearchTerm,
//   setCategorySearchTerm,
//   showCategoryDropdown,
//   setShowCategoryDropdown,
//   showAssignDropdown,
//   setShowAssignDropdown,
//   assignSearchTerm,
//   setAssignSearchTerm,
//   getFilteredCategories,
//   getFilteredAgents,
//   onCreateCategory,
//   creatingCategory,
// }) => {
//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="flex flex-col items-center justify-center py-16">
//           <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//           <p className="text-gray-600 font-medium">Loading tickets...</p>
//         </div>
//       </div>
//     );
//   }

//   // Empty State
//   if (tickets.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="flex flex-col items-center justify-center py-16">
//           <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             No tickets found
//           </h3>
//           <p className="text-gray-600 text-center max-w-md">
//             {hasActiveFilters
//               ? "No tickets match your current filters. Try adjusting your search criteria."
//               : "There are no support tickets at the moment."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // console.log(tickets)

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-visible">
//       <div className="overflow-x-auto rounded-xl overflow-y-visible">
//         <table className="min-w-full divide-y divide-gray-100">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//             <tr>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <div className="flex items-center">
//                   <MessageSquare className="h-4 w-4 mr-2 text-primary" />
//                   Ticket Details
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <div className="flex items-center">
//                   <Settings className="h-4 w-4 mr-2 text-primary" />
//                   Status
//                 </div>
//               </th>
//               {userRole !== "SUPPORT_AGENT" && (
//                 <>
//                   <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     <div className="flex items-center">
//                       <Tag className="h-4 w-4 mr-2 text-primary" />
//                       Category
//                     </div>
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     <div className="flex items-center">
//                       <Users className="h-4 w-4 mr-2 text-primary" />
//                       Assigned To
//                     </div>
//                   </th>
//                 </>
//               )}
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
//                 <div className="flex items-center">
//                   <User className="h-4 w-4 mr-2 text-primary" />
//                   Assigned By
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-2 text-primary" />
//                   Created
//                 </div>
//               </th>
//               <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-50">
//             {tickets.map((ticket, index) => (
//               <TicketRow
//                 key={ticket._id}
//                 ticket={ticket}
//                 rowIndex={index}
//                 totalRows={tickets.length}
//                 loadingState={loadingStates[ticket._id]}
//                 onStatusUpdate={onStatusUpdate}
//                 onCategoryUpdate={onCategoryUpdate}
//                 onAssignTicket={onAssignTicket}
//                 onDeleteTicket={onDeleteTicket}
//                 onViewTicket={onViewTicket}
//                 onNavigateToUser={onNavigateToUser}
//                 categorySearchTerm={categorySearchTerm}
//                 setCategorySearchTerm={setCategorySearchTerm}
//                 showCategoryDropdown={showCategoryDropdown}
//                 setShowCategoryDropdown={setShowCategoryDropdown}
//                 showAssignDropdown={showAssignDropdown}
//                 setShowAssignDropdown={setShowAssignDropdown}
//                 assignSearchTerm={assignSearchTerm}
//                 setAssignSearchTerm={setAssignSearchTerm}
//                 getFilteredCategories={getFilteredCategories}
//                 getFilteredAgents={getFilteredAgents}
//                 onCreateCategory={onCreateCategory}
//                 creatingCategory={creatingCategory}
//                 userRole={userRole}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // --------------------- Ticket Row Component ---------------------
// interface TicketRowProps {
//   ticket: TicketType;
//   rowIndex: number;
//   totalRows: number;
//   loadingState?: LoadingState;
//   onStatusUpdate: (ticketId: string, status: string) => void;
//   onCategoryUpdate: (ticketId: string, categoryId: string) => void;
//   onAssignTicket: (ticketId: string, agentId: string) => void;
//   onDeleteTicket: (ticketId: string) => void;
//   onViewTicket: (ticketId: string) => void;
//   onNavigateToUser: (email: string) => void;
//   categorySearchTerm: Record<string, string>;
//   setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   showCategoryDropdown: Record<string, boolean>;
//   setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   showAssignDropdown: Record<string, boolean>;
//   setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   assignSearchTerm: Record<string, string>;
//   setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   getFilteredCategories: (ticketId: string) => CategoryType[];
//   getFilteredAgents: (ticketId: string) => AgentType[];
//   onCreateCategory: (ticketId: string, name: string) => void;
//   creatingCategory: boolean;
//   userRole: string;
// }

// const TicketRow: React.FC<TicketRowProps> = ({
//   ticket,
//   rowIndex,
//   totalRows,
//   loadingState,
//   onStatusUpdate,
//   onCategoryUpdate,
//   onAssignTicket,
//   onDeleteTicket,
//   onViewTicket,
//   onNavigateToUser,
//   categorySearchTerm,
//   setCategorySearchTerm,
//   showCategoryDropdown,
//   setShowCategoryDropdown,
//   showAssignDropdown,
//   setShowAssignDropdown,
//   assignSearchTerm,
//   setAssignSearchTerm,
//   getFilteredCategories,
//   getFilteredAgents,
//   onCreateCategory,
//   creatingCategory,
//   userRole,
// }) => {
//   const isRowLoading = !!loadingState;
//   const creatorInfo = getCreatorInfo(ticket);
//   const assignedToName = getAssignedUserName(ticket.assignedTo);
//   const assignedByName = getAssignedUserName(ticket.assignedBy);
//   const showDropdownAbove = rowIndex >= totalRows - 2;

//   return (
//     <tr className="hover:bg-blue-50/30 transition-colors duration-200 relative">
//       {/* Loading Overlay */}
//       {isRowLoading && (
//         <td
//           colSpan={7}
//           className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10"
//         >
//           <div className="flex items-center justify-center h-full">
//             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
//               <Loader2 className="h-5 w-5 animate-spin text-primary" />
//               <span className="text-sm font-medium text-gray-700">
//                 {getLoadingMessage(loadingState)}
//               </span>
//             </div>
//           </div>
//         </td>
//       )}

//       {/* Ticket Details */}
//       <td className="px-4 sm:px-6 py-4">
//         <div className="max-w-xs">
//           <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
//             {ticket.subject}
//           </div>
//           <div className="text-sm text-gray-600 line-clamp-2 mb-2">
//             {ticket.description}
//           </div>
//           <div className="space-y-1">
//             {creatorInfo.name && (
//               <div className="flex items-center text-sm">
//                 <User className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
//                 {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
//                   <button
//                     onClick={() => onNavigateToUser(creatorInfo.email)}
//                     className="inline-flex items-center gap-1 text-gray-900 hover:underline font-medium truncate"
//                   >
//                     <span className="truncate">{creatorInfo.name}</span>
//                     <BadgeCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
//                   </button>
//                 ) : (
//                   <span className="text-gray-900 font-medium truncate">
//                     {creatorInfo.name}
//                   </span>
//                 )}
//               </div>
//             )}
//             <div className="flex items-center text-sm">
//               <Mail className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
//               {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
//                 <button
//                   onClick={() => onNavigateToUser(creatorInfo.email)}
//                   className="text-primary hover:underline font-medium truncate"
//                 >
//                   {creatorInfo.email}
//                 </button>
//               ) : (
//                 <span className="text-gray-900 truncate">
//                   {creatorInfo.email}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center text-sm">
//               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600/10 text-green-800">
//                 {!ticket.isPublic ? "User" : "Public"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </td>

//       {/* Status */}
//       <td className="px-4 sm:px-6 py-4">
//         <select
//           value={ticket.status}
//           onChange={(e) => onStatusUpdate(ticket._id, e.target.value)}
//           disabled={isRowLoading}
//           className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(
//             ticket.status
//           )} disabled:opacity-50 disabled:cursor-not-allowed`}
//         >
//           {TICKET_STATUSES.map((status) => (
//             <option key={status} value={status}>
//               {status === "Pending" && "🟠 "}
//               {status === "Open" && "🔵 "}
//               {status === "In Progress" && "🟡 "}
//               {status === "Resolved" && "🟢 "}
//               {status === "Closed" && "⚫ "}
//               {status}
//             </option>
//           ))}
//         </select>
//       </td>

//       {/* Category Column */}
//       {userRole !== "SUPPORT_AGENT" && (
//         <td className="px-4 sm:px-6 py-4">
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setShowCategoryDropdown((prev) => ({
//                   ...prev,
//                   [ticket._id]: !prev[ticket._id],
//                 }));
//                 setCategorySearchTerm((prev) => ({
//                   ...prev,
//                   [ticket._id]: "",
//                 }));
//               }}
//               disabled={isRowLoading}
//               style={{
//                 backgroundColor: ticket?.category?.color
//                   ? `${ticket.category.color}15`
//                   : "transparent",
//                 borderColor: ticket?.category?.color || "#e5e7eb",
//               }}
//               className="min-w-[120px] text-xs font-medium rounded-full py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:shadow-sm text-left flex items-center gap-2 disabled:opacity-50"
//             >
//               {ticket?.category && (
//                 <div
//                   className="w-2 h-2 rounded-full flex-shrink-0"
//                   style={{ backgroundColor: ticket.category.color }}
//                 />
//               )}
//               <span className="truncate">
//                 {ticket?.category?.name || "No Category"}
//               </span>
//               <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto flex-shrink-0" />
//             </button>

//             {showCategoryDropdown[ticket._id] && (
//               <>
//                 <div
//                   className="fixed inset-0 z-40"
//                   onClick={() =>
//                     setShowCategoryDropdown((prev) => ({
//                       ...prev,
//                       [ticket._id]: false,
//                     }))
//                   }
//                 />
//                 <div
//                   className={`absolute z-50 ${
//                     showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
//                   } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
//                 >
//                   <div
//                     className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${
//                       showDropdownAbove
//                         ? "-bottom-1.5 border-b border-r"
//                         : "-top-1.5 border-t border-l"
//                     }`}
//                   />
//                   <div className="p-2 border-b border-gray-100">
//                     <div className="relative">
//                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={categorySearchTerm[ticket._id] || ""}
//                         onChange={(e) =>
//                           setCategorySearchTerm((prev) => ({
//                             ...prev,
//                             [ticket._id]: e.target.value,
//                           }))
//                         }
//                         placeholder="Search or create category..."
//                         className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
//                         autoFocus
//                       />
//                     </div>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     {getFilteredCategories(ticket._id).length > 0 ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             onCategoryUpdate(ticket._id, "");
//                             setShowCategoryDropdown((prev) => ({
//                               ...prev,
//                               [ticket._id]: false,
//                             }));
//                           }}
//                           className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500"
//                         >
//                           ⚪ No Category
//                         </button>
//                         {getFilteredCategories(ticket._id).map((category) => (
//                           <button
//                             key={category._id}
//                             onClick={() => {
//                               onCategoryUpdate(ticket._id, category._id);
//                               setShowCategoryDropdown((prev) => ({
//                                 ...prev,
//                                 [ticket._id]: false,
//                               }));
//                             }}
//                             className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
//                           >
//                             <div
//                               className="w-2 h-2 rounded-full flex-shrink-0"
//                               style={{ backgroundColor: category.color }}
//                             />
//                             <span className="font-medium truncate">
//                               {category.name}
//                             </span>
//                           </button>
//                         ))}
//                       </>
//                     ) : categorySearchTerm[ticket._id]?.trim() ? (
//                       <button
//                         onClick={() =>
//                           onCreateCategory(ticket._id, categorySearchTerm[ticket._id])
//                         }
//                         disabled={creatingCategory}
//                         className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 text-primary font-medium flex items-center gap-2 disabled:opacity-50"
//                       >
//                         <Plus className="h-3.5 w-3.5" />
//                         {creatingCategory
//                           ? "Creating..."
//                           : `Create "${categorySearchTerm[ticket._id]}"`}
//                       </button>
//                     ) : (
//                       <div className="px-3 py-2 text-xs text-gray-400 text-center">
//                         Type to search or create category
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </td>
//       )}

//       {/* Assigned To Column */}
//       {userRole !== "SUPPORT_AGENT" && (
//         <td className="px-4 sm:px-6 py-4">
//           <div className="relative">
//             <button
//               onClick={() => {
//                 setShowAssignDropdown((prev) => ({
//                   ...prev,
//                   [ticket._id]: !prev[ticket._id],
//                 }));
//                 setAssignSearchTerm((prev) => ({
//                   ...prev,
//                   [ticket._id]: "",
//                 }));
//               }}
//               disabled={isRowLoading}
//               className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 disabled:opacity-50"
//             >
//               {ticket.assignedTo ? (
//                 <>
//                   <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xs font-semibold">
//                       {getInitials(assignedToName)}
//                     </span>
//                   </div>
//                   <div className="text-left min-w-0">
//                     <div className="text-xs font-medium text-gray-900 truncate">
//                       {assignedToName}
//                     </div>
//                     <div className="text-[10px] text-gray-500">Support Agent</div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
//                 </>
//               ) : (
//                 <>
//                   <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
//                     <User className="h-4 w-4 text-gray-500" />
//                   </div>
//                   <div className="text-left">
//                     <div className="text-sm font-medium text-gray-600">
//                       Assign Agent
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
//                 </>
//               )}
//             </button>

//             {showAssignDropdown[ticket._id] && (
//               <>
//                 <div
//                   className="fixed inset-0 z-40"
//                   onClick={() =>
//                     setShowAssignDropdown((prev) => ({
//                       ...prev,
//                       [ticket._id]: false,
//                     }))
//                   }
//                 />
//                 <div
//                   className={`absolute z-50 ${
//                     showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
//                   } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
//                 >
//                   <div
//                     className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${
//                       showDropdownAbove
//                         ? "-bottom-1.5 border-b border-r"
//                         : "-top-1.5 border-t border-l"
//                     }`}
//                   />
//                   <div className="p-2 border-b border-gray-100">
//                     <div className="relative">
//                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={assignSearchTerm[ticket._id] || ""}
//                         onChange={(e) =>
//                           setAssignSearchTerm((prev) => ({
//                             ...prev,
//                             [ticket._id]: e.target.value,
//                           }))
//                         }
//                         placeholder="Search agent..."
//                         className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
//                         autoFocus
//                       />
//                     </div>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     <button
//                       onClick={() => {
//                         onAssignTicket(ticket._id, "");
//                         setShowAssignDropdown((prev) => ({
//                           ...prev,
//                           [ticket._id]: false,
//                         }));
//                       }}
//                       className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500 flex items-center gap-2"
//                     >
//                       <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
//                         <User className="h-3 w-3 text-gray-500" />
//                       </div>
//                       <span>Unassign</span>
//                     </button>
//                     {getFilteredAgents(ticket._id).map((agent) => (
//                       <button
//                         key={agent._id}
//                         onClick={() => {
//                           onAssignTicket(ticket._id, agent._id);
//                           setShowAssignDropdown((prev) => ({
//                             ...prev,
//                             [ticket._id]: false,
//                           }));
//                         }}
//                         className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-white text-[10px] font-semibold">
//                             {getInitials(agent.name)}
//                           </span>
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-medium text-gray-900 truncate">
//                             {agent.name}
//                           </div>
//                           <div className="text-gray-500 text-[10px] truncate">
//                             {agent.email}
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </td>
//       )}

//       {/* Assigned By */}
//       <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
//         {ticket.assignedBy ? (
//           <div className="flex items-center">
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//               <span className="text-green-700 text-xs font-semibold">
//                 {getInitials(assignedByName)}
//               </span>
//             </div>
//             <div className="min-w-0">
//               <div className="text-sm font-medium text-gray-900 truncate">
//                 {assignedByName}
//               </div>
//               <div className="text-xs text-gray-500">Admin</div>
//             </div>
//           </div>
//         ) : ticket.assignedTo ? (
//           <div className="text-sm text-gray-600 italic">Assigned by Admin</div>
//         ) : (
//           <div className="text-sm text-gray-400 italic">Not assigned yet</div>
//         )}
//       </td>

//       {/* Created Date */}
//       <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
//         <div className="flex items-center">
//           <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
//           {formatDate(ticket.createdAt)}
//         </div>
//         <div className="text-xs text-gray-400 mt-1">
//           {formatTime(ticket.createdAt)}
//         </div>
//       </td>

//       {/* Actions */}
//       <td className="px-4 sm:px-6 py-4">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => onViewTicket(ticket._id)}
//             disabled={isRowLoading}
//             className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//             title="View Details"
//           >
//             <Eye className="h-4 w-4" />
//           </Button>

//           {userRole !== "SUPPORT_AGENT" && (
//             <PermissionGate action="delete" feature="support-tickets-management">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => onDeleteTicket(ticket._id)}
//                 disabled={isRowLoading}
//                 className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                 title="Delete Ticket"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </PermissionGate>
//           )}
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default TicketsTable;

// // components/StatsCards.tsx
// import React from "react";
// import {
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   BarChart3,
// } from "lucide-react";
// import { FilterState, StatsType } from "@/types/support.type";


// interface StatsCardsProps {
//   stats: StatsType;
//   totalTickets: number;
//   currentFilter: string;
//   onFilterChange: (key: keyof FilterState, value: string) => void;
// }

// const StatsCards: React.FC<StatsCardsProps> = ({
//   stats,
//   totalTickets,
//   currentFilter,
//   onFilterChange,
// }) => {
//   const statsData = [
//     {
//       key: "",
//       label: "Total Tickets",
//       value: totalTickets,
//       icon: BarChart3,
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//       textColor: "text-gray-900",
//       activeClass: "",
//     },
//     {
//       key: "Pending",
//       label: "Pending",
//       value: stats.totalPending || 0,
//       icon: Clock,
//       bgColor: "bg-orange-100",
//       iconColor: "text-orange-600",
//       textColor: "text-orange-600",
//       activeClass: "bg-orange-50 border-orange-200 ring-2 ring-orange-200",
//     },
//     {
//       key: "Open",
//       label: "Open",
//       value: stats.totalOpen || 0,
//       icon: AlertCircle,
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//       textColor: "text-blue-600",
//       activeClass: "bg-blue-50 border-blue-200 ring-2 ring-blue-200",
//     },
//     {
//       key: "In Progress",
//       label: "In Progress",
//       value: stats.totalInProgress || 0,
//       icon: Clock,
//       bgColor: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//       textColor: "text-yellow-600",
//       activeClass: "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-200",
//     },
//     {
//       key: "Resolved",
//       label: "Resolved",
//       value: stats.totalResolved || 0,
//       icon: CheckCircle,
//       bgColor: "bg-green-100",
//       iconColor: "text-green-600",
//       textColor: "text-green-600",
//       activeClass: "bg-green-50 border-green-200 ring-2 ring-green-200",
//     },
//     {
//       key: "Closed",
//       label: "Closed",
//       value: stats.totalClosed || 0,
//       icon: XCircle,
//       bgColor: "bg-gray-100",
//       iconColor: "text-gray-600",
//       textColor: "text-gray-600",
//       activeClass: "bg-gray-50 border-gray-300 ring-2 ring-gray-300",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
//       {statsData.map((stat) => {
//         const isActive = currentFilter === stat.key;
//         const Icon = stat.icon;

//         return (
//           <button
//             key={stat.label}
//             onClick={() => onFilterChange("status", stat.key)}
//             className={`p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer text-left ${
//               isActive
//                 ? stat.activeClass
//                 : "bg-white border-gray-100 hover:shadow-md"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm font-medium text-gray-600">
//                   {stat.label}
//                 </p>
//                 <p
//                   className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}
//                 >
//                   {stat.value}
//                 </p>
//               </div>
//               <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg`}>
//                 <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
//               </div>
//             </div>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default StatsCards;