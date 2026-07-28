

// pages/support/AdminSupportTicketDetailsPage.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSingleSupportTicketQuery,
  useUpdateSupportTicketStatusMutation,
  useUpdateSupportTicketCategoryMutation,
  useAssignSupportTicketMutation,
  useAddCommentToTicketMutation,
  useGetTicketCommentsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useDeleteSupportTicketAttachmentMutation,
  useGetSupportCategoriesQuery,
  useCreateSupportCategoryMutation,
  // useGetTicketActivitiesQuery,
} from "@/redux/features/support/supportApiSlice";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";
import { baseURL } from "@/config";
import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  MessageSquare,
  User,
  Clock,
  Send,
  Edit3,
  Trash2,
  Reply,
  EyeOff,
  Calendar,
  Headset,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  // Mail,
  PaperclipIcon,
  ChevronDown,
  Search,
  Plus,
  History,
  Eye,
  Tag,
  // ExternalLink,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
import { Button } from "@/components/ui/button";
import { Comment, SupportTicket, UserInfo } from "@/types/support.type";
import TicketActivityLogsModal from "./ActivityLogModal";
import ImageLightbox from "./ImageLightBox";
import TransferDetailsModal from "./TransferDetailsModal";
import TransferTicketModal from "./TransferTicketModal";


// Frontend URL for email compose
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL || "";

// Allowed roles for admin actions
const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "SUPPORT_AGENT"];

// Status configuration
const STATUS_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; emoji: string }
> = {
  Pending: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <Clock className="h-4 w-4" />,
    emoji: "🟡",
  },
  Open: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <AlertCircle className="h-4 w-4" />,
    emoji: "🔵",
  },
  "In Progress": {
    color: "bg-violet-100 text-violet-800 border-violet-200",
    icon: <Clock className="h-4 w-4" />,
    emoji: "🟣",
  },
  Resolved: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <CheckCircle className="h-4 w-4" />,
    emoji: "🟢",
  },
  Closed: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <XCircle className="h-4 w-4" />,
    emoji: "⚫",
  },
};

interface CategoryType {
  _id: string;
  name: string;
  color: string;
  description?: string;
}

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: string;
}

interface DropdownPosition {
  top: number;
  left: number;
}

// --------------------- Main Component ---------------------
const AdminSupportTicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // User data
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const user = userData?.data as UserInfo | undefined;

  // Support agents
  const { data: supportAgentsData, isLoading: isSupportAgentsLoading } =
    useGetAllSupportAgentsQuery({ page: 1, limit: 1000000 });

  // Categories
  const { data: categoriesData, refetch: refetchCategories } =
    useGetSupportCategoriesQuery();

  const allUsers: UserData[] = supportAgentsData?.data || [];
  const supportAgents = allUsers.filter((u) => u.role === "SUPPORT_AGENT");
  const categories: CategoryType[] = categoriesData?.data || [];

  // State
  const [newComment, setNewComment] = useState<string>("");
  const [isInternal, setIsInternal] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
  const [isDeletingAttachment, setIsDeletingAttachment] = useState<boolean>(false);

  // Category dropdown state
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState<boolean>(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Activity logs modal
  const [showActivityLogsModal, setShowActivityLogsModal] = useState<boolean>(false);

  // Transfer modals
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showTransferDetailsModal, setShowTransferDetailsModal] = useState<boolean>(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showAllAttachments, setShowAllAttachments] = useState<boolean>(false);

  // API hooks
  const {
    data: ticketData,
    isLoading: ticketLoading,
    refetch: refetchTicket,
    isFetching,
  } = useGetSingleSupportTicketQuery(id!, { skip: !id });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useGetTicketCommentsQuery(id!, { skip: !id });

  

// const { 
//   data: supportActivitiyLogsData, 
//   isLoading: isActivityLogsLoading 
// } = useGetTicketActivitiesQuery(
//   { 
//     ticketId: id ?? "", 
//     page: 1, 
//     limit: 20, 
//     search: "" 
//   },
//   { 
//     skip: !id  // This prevents the API call when id is falsy
//   }
// );

//   console.log(supportActivitiyLogsData?.data)

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportTicketStatusMutation();
  const [updateCategory] = useUpdateSupportTicketCategoryMutation();
  const [createCategory] = useCreateSupportCategoryMutation();
  const [assignTicket, { isLoading: isAssigning }] = useAssignSupportTicketMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentToTicketMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deleteAttachment] = useDeleteSupportTicketAttachmentMutation();

  const ticket = ticketData?.data?.ticket as SupportTicket | undefined;
  const comments: Comment[] = commentsData?.data || [];

  // Determine creator info
  const creatorInfo = ticket?.createdBy || ticket?.publicUserInfo;
  const creatorName = creatorInfo?.name || "";
  const creatorEmail = creatorInfo?.email || "N/A";

  // Check permissions
  const canSeeInternalComments = ADMIN_ROLES.includes(user?.role || "");
  const canManageTicket = ADMIN_ROLES.includes(user?.role || "");

  // console.log(ticket)

  // Check if user can transfer (only assigned support agent)
  const canTransferTicket =
    user?.role === "SUPPORT_AGENT" 
    // ticket?.assignedTo?._id === user?._id &&
    // ticket?.createdBy?._id !== user?._id;
  
  // console.log("can = ", ticket?.createdBy?._id !== user?._id)

  // Filter comments
  const visibleComments = comments.filter(
    (comment) => !comment.isInternal || canSeeInternalComments
  );

  // Get image attachments for lightbox
  const imageAttachments =
    ticket?.attachments?.filter((att) => {
      const ext = att.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
    }) || [];

  // Calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      const dropdownHeight = 320;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top: number;
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        top = rect.bottom + 8;
      } else {
        top = rect.top - dropdownHeight - 8;
      }

      setDropdownPosition({
        top: Math.max(8, top),
        left: rect.left,
      });
    }
  }, []);

  // Handle category dropdown toggle
  const handleCategoryDropdownToggle = () => {
    if (isUpdatingCategory) return;
    
    if (!showCategoryDropdown) {
      calculateDropdownPosition();
    }
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Focus search input after dropdown opens (without scrolling)
  useEffect(() => {
    if (showCategoryDropdown && searchInputRef.current) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      });
    }
  }, [showCategoryDropdown]);

  // Update position on scroll/resize
  useEffect(() => {
    if (showCategoryDropdown) {
      const handlePositionUpdate = () => {
        calculateDropdownPosition();
      };

      window.addEventListener("scroll", handlePositionUpdate, true);
      window.addEventListener("resize", handlePositionUpdate);

      return () => {
        window.removeEventListener("scroll", handlePositionUpdate, true);
        window.removeEventListener("resize", handlePositionUpdate);
      };
    }
  }, [showCategoryDropdown, calculateDropdownPosition]);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
        setCategorySearchTerm("");
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCategoryDropdown]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showCategoryDropdown) {
        setShowCategoryDropdown(false);
        setCategorySearchTerm("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showCategoryDropdown]);

  // Get filtered categories
  const getFilteredCategories = () => {
    if (!categorySearchTerm.trim()) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string): Promise<void> => {
    if (!ticket || !user) return;

    try {
      await updateStatus({
        id: ticket._id,
        status: newStatus,
        updatedBy: user._id,
        updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
      }).unwrap();
      toast.success("Ticket status updated successfully");
      refetchTicket();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ticket status");
    }
  };

  // Handle category update
  const handleCategoryUpdate = async (categoryId: string): Promise<void> => {
    if (!ticket || !user) return;

    setIsUpdatingCategory(true);
    try {
      await updateCategory({
        id: ticket._id,
        category: categoryId || null,
      }).unwrap();
      toast.success("Category updated successfully");
      refetchTicket();
      setShowCategoryDropdown(false);
      setCategorySearchTerm("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  // Handle create category
  const handleCreateCategory = async (name: string): Promise<void> => {
    if (!name.trim()) return;

    setIsCreatingCategory(true);
    try {
      const result = await createCategory({
        data: {
          name: name.trim(),
          color: "#3B82F6",
        },
      }).unwrap();
      toast.success("Category created!");
      await refetchCategories();
      await handleCategoryUpdate(result.data._id);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Handle ticket assignment
  const handleAssignTicket = async (agentId: string): Promise<void> => {
    if (!ticket || !user) return;

    try {
      await assignTicket({
        id: ticket._id,
        assignedTo: agentId || null,
        updatedBy: user._id,
        updatedByModel: user.role === "Dependent" ? "Dependent" : "User",
      }).unwrap();
      toast.success(agentId ? "Ticket assigned successfully" : "Ticket unassigned");
      refetchTicket();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign ticket");
    }
  };

  // Handle add comment
  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim() || !ticket || !user) return;

    try {
      await addComment({
        ticketId: ticket._id,
        comment: newComment,
        parentCommentId: replyingTo,
        isInternal,
        commentedBy: user._id,
        commentedByModel: user.role === "Dependent" ? "Dependent" : "User",
      }).unwrap();
      toast.success("Comment added successfully");
      setNewComment("");
      setReplyingTo(null);
      setIsInternal(false);
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add comment");
    }
  };

  // Handle edit comment
  const handleEditComment = async (commentId: string): Promise<void> => {
    if (!editCommentText.trim()) return;

    try {
      await updateComment({
        commentId,
        comment: editCommentText,
      }).unwrap();
      toast.success("Comment updated successfully");
      setEditingComment(null);
      setEditCommentText("");
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment");
    }
  };

  // Handle delete comment
  const handleConfirmDeleteComment = async (): Promise<void> => {
    if (!deleteCommentId) return;

    try {
      setIsDeletingComment(true);
      await deleteComment(deleteCommentId).unwrap();
      toast.success("Comment deleted successfully");
      setDeleteCommentId(null);
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete comment");
    } finally {
      setIsDeletingComment(false);
    }
  };

  // Handle delete attachment
  const handleDeleteAttachment = async (fileName: string) => {
    if (!ticket?._id) {
      toast.error("Ticket ID is required");
      return;
    }

    try {
      setIsDeletingAttachment(true);
      await deleteAttachment({
        ticketId: ticket._id,
        fileName: fileName,
      }).unwrap();
      toast.success("Attachment deleted successfully");
      refetchTicket();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete attachment");
    } finally {
      setIsDeletingAttachment(false);
    }
  };

  // Handle send email
  // const handleSendEmail = (): void => {
  //   if (creatorEmail && creatorEmail !== "N/A") {
  //     window.open(
  //       `${frontEndURL}/admin/emails/compose?email=${creatorEmail}`,
  //       "_blank"
  //     );
  //   }
  // };

  // Get display name for agent
  const getAgentDisplayName = (agent: UserData): string => {
    if (agent.firstName && agent.lastName) {
      return `${agent.firstName} ${agent.lastName}`;
    }
    if (agent.firstName) {
      return agent.firstName;
    }
    if (agent.name) {
      return agent.name;
    }
    return agent.email;
  };

  // Get full attachment URL
  const getFullAttachmentUrl = (attachment: string) => {
    if (attachment.startsWith("http://") || attachment.startsWith("https://")) {
      return attachment;
    }
    return `${baseURL}/uploads/support-ticket-attachments/${attachment}`;
  };

  // Open lightbox
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Loading state
  if (isUserLoading || ticketLoading || isFetching || isSupportAgentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  // Ticket not found
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Headset className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">
            The support ticket you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/support-tickets-management")}>
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG["Pending"];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto p-6 my-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/system-management?tab=support-tickets-management")}
            variant="outline"
            className="flex items-center gap-2 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>

          {/* Ticket Details Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Transfer Request Banner */}
            {ticket?.transferRequest?.status === "Pending" && (
              <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                  <ArrowRightLeft className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Transfer Request Pending Approval
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Requested transfer to{" "}
                    <span className="font-medium text-amber-700">
                      {ticket.transferRequest.toAgent?.firstName} {ticket.transferRequest.toAgent?.lastName}
                    </span>
                    . Waiting for admin approval.
                  </p>
                  {ticket.transferRequest.reason && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Reason: {ticket.transferRequest.reason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {ticket?.transferRequest?.status === "Rejected" && (
              <div className="p-4 bg-red-50 border-b border-red-200 flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <ArrowRightLeft className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    Transfer Request Rejected
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your transfer request to{" "}
                    <span className="font-medium text-red-700">
                      {ticket.transferRequest.toAgent?.firstName} {ticket.transferRequest.toAgent?.lastName}
                    </span>{" "}
                    was rejected.
                  </p>
                  {ticket.transferRequest.actionReason && (
                    <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded border border-red-200 italic">
                      Reason: "{ticket.transferRequest.actionReason}"
                    </p>
                  )}
                  <button
                    onClick={() => setShowTransferDetailsModal(true)}
                    className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words mb-3">
                      {ticket.subject}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status Badge */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
                          statusConfig.color
                        )}
                      >
                        {statusConfig.icon}
                        {ticket.status}
                      </span>

                      {/* Category Badge */}
                      {ticket.category && (
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border"
                          style={{
                            backgroundColor: `${ticket.category.color}15`,
                            borderColor: `${ticket.category.color}30`,
                            color: ticket.category.color,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ticket.category.color }}
                          />
                          {ticket.category.name}
                        </span>
                      )}

                      {/* Date */}
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Logs Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowActivityLogsModal(true)}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  Activity Logs
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Attachments Section */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-sm font-semibold text-gray-700">
                    <PaperclipIcon className="h-4 w-4 mr-2 text-gray-400" />
                    Attachments ({ticket.attachments.length})
                  </h3>
                  {ticket.attachments.length > 4 && (
                    <button
                      onClick={() => setShowAllAttachments(!showAllAttachments)}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      {showAllAttachments
                        ? "Show Less"
                        : `Show All (${ticket.attachments.length})`}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {(showAllAttachments
                    ? ticket.attachments
                    : ticket.attachments.slice(0, 4)
                  ).map((attachment, index) => {
                    const fileName = attachment.split("/").pop() || attachment;
                    const fileExtension = fileName.split(".").pop()?.toLowerCase();
                    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                      fileExtension || ""
                    );
                    const isPdf = fileExtension === "pdf";
                    const fullUrl = getFullAttachmentUrl(attachment);
                    const imageIndex = imageAttachments.indexOf(attachment);

                    return (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                      >
                        {isImage ? (
                          <>
                            <img
                              src={fullUrl}
                              alt={fileName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <div
                              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => openLightbox(imageIndex)}
                            >
                              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                          </>
                        ) : (
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center p-4"
                          >
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
                                isPdf ? "bg-red-100" : "bg-gray-100"
                              )}
                            >
                              <PaperclipIcon
                                className={cn(
                                  "h-6 w-6",
                                  isPdf ? "text-red-500" : "text-gray-500"
                                )}
                              />
                            </div>
                            <span className="text-xs text-gray-600 text-center truncate w-full">
                              {fileName.length > 15
                                ? `${fileName.substring(0, 12)}...`
                                : fileName}
                            </span>
                          </a>
                        )}

                        {/* Delete Button */}
                        {canManageTicket && (
                          <button
                            onClick={() => handleDeleteAttachment(fileName)}
                            disabled={isDeletingAttachment}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                            title="Delete attachment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Creator Info */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <span className="text-gray-500">Created by</span>
                    <p className="font-medium text-gray-900">
                      {creatorName ? `${creatorName} (${creatorEmail})` : creatorEmail}
                    </p>
                  </div>
                </div>

                {ticket.assignedTo && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-gray-500">Assigned to</span>
                      <p className="font-medium text-gray-900">
                        {ticket.assignedTo.name || ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {canManageTicket && (
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Status:
                    </label>
                    <div className="relative">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={isUpdatingStatus}
                        className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50 appearance-none bg-white cursor-pointer"
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Open">🔵 Open</option>
                        <option value="In Progress">🟣 In Progress</option>
                        <option value="Resolved">🟢 Resolved</option>
                        <option value="Closed">⚫ Closed</option>
                      </select>
                      {isUpdatingStatus ? (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  {user?.role !== "SUPPORT_AGENT" && <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Category:
                    </label>
                    <div className="relative">
                      <button
                        ref={categoryButtonRef}
                        type="button"
                        onClick={handleCategoryDropdownToggle}
                        disabled={isUpdatingCategory}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200",
                          "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
                          isUpdatingCategory && "opacity-50 cursor-not-allowed",
                          ticket.category ? "bg-white" : "bg-gray-50 border-dashed",
                          showCategoryDropdown && "ring-2 ring-primary/20 border-primary"
                        )}
                        style={
                          ticket.category?.color
                            ? {
                                backgroundColor: `${ticket.category.color}10`,
                                borderColor: `${ticket.category.color}40`,
                              }
                            : undefined
                        }
                      >
                        {ticket.category ? (
                          <>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: ticket.category.color }}
                            />
                            <span className="text-sm font-medium">
                              {ticket.category.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">No Category</span>
                          </>
                        )}
                        {isUpdatingCategory ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />
                        ) : (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-gray-400 ml-2 transition-transform duration-200",
                              showCategoryDropdown && "rotate-180"
                            )}
                          />
                        )}
                      </button>
                    </div>
                  </div>}
                  

                  {/* Assign Dropdown */}
                  {user?.role !== "SUPPORT_AGENT" && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">
                        Assign to:
                      </label>
                      <div className="relative">
                        <select
                          value={ticket.assignedTo?._id || ""}
                          onChange={(e) => handleAssignTicket(e.target.value)}
                          disabled={isAssigning}
                          className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50 appearance-none bg-white cursor-pointer min-w-[180px]"
                        >
                          <option value="">👤 Unassigned</option>
                          {supportAgents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {getAgentDisplayName(agent)}
                            </option>
                          ))}
                        </select>
                        {isAssigning ? (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Transfer Ticket Button - Only for Support Agents */}
                  {canTransferTicket && (
                    <Button
                      onClick={() => {
                        if (ticket.transferRequest?.status === "Pending") {
                          setShowTransferDetailsModal(true);
                        } else {
                          setShowTransferModal(true);
                        }
                      }}
                      variant={
                        ticket.transferRequest?.status === "Pending"
                          ? "outline"
                          : "outline"
                      }
                      className={cn(
                        "flex items-center gap-2",
                        ticket.transferRequest?.status === "Pending" &&
                          "border-amber-300 bg-amber-50 hover:bg-amber-100"
                      )}
                    >
                      <div className="relative">
                        <ArrowRightLeft className="h-4 w-4" />
                        {ticket.transferRequest?.status === "Pending" && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                          </span>
                        )}
                      </div>
                      <span>
                        {ticket.transferRequest?.status === "Pending"
                          ? "Transfer Pending"
                          : "Transfer Ticket"}
                      </span>
                    </Button>
                  )}

                  {/* Send Email Button */}
                  {/* <Button
                    onClick={handleSendEmail}
                    disabled={creatorEmail === "N/A"}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </Button> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Comments ({visibleComments.length})
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Comments List */}
            {commentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : visibleComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No comments yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start the conversation by adding a comment below
                </p>
              </div>
            ) : (
              visibleComments.map((comment) => (
                <div
                  key={comment._id}
                  className={cn(
                    "rounded-xl border p-5 transition-all duration-200",
                    comment.isInternal
                      ? "bg-purple-50/50 border-purple-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-sm font-bold">
                        {comment.commentedBy?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="font-semibold text-gray-900">
                          {comment.commentedBy?.name}
                        </span>
                        {comment.isInternal && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            <EyeOff className="h-3 w-3" />
                            Internal
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {editingComment === comment._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditComment(comment._id)}
                              disabled={isUpdatingComment}
                            >
                              {isUpdatingComment ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingComment(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                            {comment.comment}
                          </p>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setReplyingTo(comment._id)}
                              className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                            >
                              <Reply className="h-4 w-4" />
                              Reply
                            </button>

                            {(comment.commentedBy?._id === user?._id ||
                              canManageTicket) && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingComment(comment._id);
                                    setEditCommentText(comment.comment);
                                  }}
                                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteCommentId(comment._id)}
                                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Add Comment Form */}
            <div className="border-t border-gray-100 pt-6">
              {replyingTo && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">
                      Replying to comment
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Add Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your comment here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Internal Note Checkbox */}
                  {canSeeInternalComments && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        <EyeOff className="h-4 w-4 mr-1" />
                        Internal note (visible to support staff only)
                      </span>
                    </label>
                  )}

                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isAddingComment}
                    className="flex items-center gap-2"
                  >
                    {isAddingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {replyingTo ? "Reply" : "Add Comment"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Category Dropdown Portal */}
      {showCategoryDropdown && (
        <div
          ref={categoryDropdownRef}
          className="fixed z-[9999] w-72 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
        >
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
                placeholder="Search or create category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            <button
              onClick={() => handleCategoryUpdate("")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <XCircle className="h-3 w-3 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">No Category</span>
            </button>

            {getFilteredCategories().length > 0 ? (
              getFilteredCategories().map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryUpdate(category._id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                    ticket?.category?._id === category._id
                      ? "bg-primary/5 ring-1 ring-primary/20"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {category.name}
                  </span>
                  {ticket?.category?._id === category._id && (
                    <CheckCircle className="h-4 w-4 text-primary ml-auto flex-shrink-0" />
                  )}
                </button>
              ))
            ) : categorySearchTerm.trim() ? (
              <button
                onClick={() => handleCreateCategory(categorySearchTerm)}
                disabled={isCreatingCategory}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left disabled:opacity-50"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">
                  {isCreatingCategory ? "Creating..." : `Create "${categorySearchTerm}"`}
                </span>
              </button>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-400">
                Type to search or create
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for dropdown */}
      {showCategoryDropdown && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            setShowCategoryDropdown(false);
            setCategorySearchTerm("");
          }}
        />
      )}

      {/* Delete Comment Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteCommentId}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={handleConfirmDeleteComment}
        title="Delete Comment"
        itemName="this comment"
        description="This action cannot be undone."
        isLoading={isDeletingComment}
      />

      {/* Activity Logs Modal */}
      <TicketActivityLogsModal
        isOpen={showActivityLogsModal}
        onClose={() => setShowActivityLogsModal(false)}
        ticketId={id!}
      />

      {/* Transfer Modals */}
      <TransferTicketModal
        isOpen={showTransferModal}
        ticketId={ticket._id}
        onClose={() => setShowTransferModal(false)}
        onSuccess={() => {
          refetchTicket();
          setShowTransferModal(false);
        }}
      />

      <TransferDetailsModal
        isOpen={showTransferDetailsModal}
        onClose={() => setShowTransferDetailsModal(false)}
        ticket={ticket}
        onSuccess={() => {
          refetchTicket();
          setShowTransferDetailsModal(false);
        }}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        images={imageAttachments.map(getFullAttachmentUrl)}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default AdminSupportTicketDetailsPage;