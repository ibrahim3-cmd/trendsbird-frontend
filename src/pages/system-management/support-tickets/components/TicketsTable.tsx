
// components/TicketsTable.tsx
import React, { useState } from "react";
import {
  Eye,
  Trash2,
  ChevronDown,
  MessageSquare,
  User,
  Calendar,
  Users,
  Settings,
  Mail,
  BadgeCheck,
  Loader2,
  Tag,
  Plus,
  Search,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PermissionGate from "@/components/layout/PermissionGate";
import {
  AgentType,
  CategoryType,
  LoadingState,
  TicketType,
} from "@/types/support.type";
import {
  formatDate,
  formatTime,
  getAssignedUserName,
  getCreatorInfo,
  getInitials,
  getLoadingMessage,
  getStatusColor,
} from "@/utils/supportUtils";
import { TICKET_STATUSES } from "../constant";
import AdminTransferActionModal from "./AdminTransferActionModal";
import TransferDetailsModal from "./TransferDetailsModal";


// Transfer Request Type
interface TransferRequest {
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  requestedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  toAgent?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reason?: string;
  requestedAt?: string;
}

// Extended Ticket Type with Transfer
interface TicketWithTransfer extends TicketType {
  transferRequest?: TransferRequest;
}

interface TicketsTableProps {
  tickets: TicketType[];
  agents: AgentType[];
  categories: CategoryType[];
  isLoading: boolean;
  loadingStates: Record<string, LoadingState>;
  onStatusUpdate: (ticketId: string, status: string) => void;
  onCategoryUpdate: (ticketId: string, categoryId: string) => void;
  onAssignTicket: (ticketId: string, agentId: string) => void;
  onDeleteTicket: (ticketId: string) => void;
  onViewTicket: (ticketId: string) => void;
  onNavigateToUser: (email: string) => void;
  hasActiveFilters: boolean;
  userRole: string;
  categorySearchTerm: Record<string, string>;
  setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showCategoryDropdown: Record<string, boolean>;
  setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  showAssignDropdown: Record<string, boolean>;
  setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  assignSearchTerm: Record<string, string>;
  setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  getFilteredCategories: (ticketId: string) => CategoryType[];
  getFilteredAgents: (ticketId: string) => AgentType[];
  onCreateCategory: (ticketId: string, name: string) => void;
  creatingCategory: boolean;
  onRefetch?: () => void; // Add refetch callback
}

const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  isLoading,
  loadingStates,
  onStatusUpdate,
  onCategoryUpdate,
  onAssignTicket,
  onDeleteTicket,
  onViewTicket,
  onNavigateToUser,
  hasActiveFilters,
  userRole,
  categorySearchTerm,
  setCategorySearchTerm,
  showCategoryDropdown,
  setShowCategoryDropdown,
  showAssignDropdown,
  setShowAssignDropdown,
  assignSearchTerm,
  setAssignSearchTerm,
  getFilteredCategories,
  getFilteredAgents,
  onCreateCategory,
  creatingCategory,
  onRefetch,
}) => {
  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTicketForTransfer, setSelectedTicketForTransfer] = useState<TicketType | null>(null);
  const [showTransferDetailsModal, setShowTransferDetailsModal] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<TicketType | null>(null);

  // Handle opening transfer modal
  const handleOpenTransferModal = (ticket: TicketWithTransfer) => {
    setSelectedTicketForTransfer(ticket);
    setShowTransferModal(true);
  };

  // Handle closing transfer modal
  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
    setSelectedTicketForTransfer(null);
  };

  // Handle opening transfer details modal
  const handleOpenTransferDetailsModal = (ticket: TicketWithTransfer) => {
    setSelectedTicketForDetails(ticket);
    setShowTransferDetailsModal(true);
  };

  // Handle closing transfer details modal
  const handleCloseTransferDetailsModal = () => {
    setShowTransferDetailsModal(false);
    setSelectedTicketForDetails(null);
  };

  // Handle transfer success
  const handleTransferSuccess = () => {
    onRefetch?.();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className=" rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-400 font-medium">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (tickets.length === 0) {
    return (
      <div className=" rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold  mb-2">
            No tickets found
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            {hasActiveFilters
              ? "No tickets match your current filters. Try adjusting your search criteria."
              : "There are no support tickets at the moment."}
          </p>
        </div>
      </div>
    );
  }

  // Check if there are any pending transfers
  const pendingTransferCount = tickets.filter(
    (ticket) => (ticket as TicketWithTransfer).transferRequest?.status === "Pending"
  ).length;

  return (
    <>
      {/* Pending Transfers Summary Banner */}
      {pendingTransferCount > 0 && userRole !== "SUPPORT_AGENT" && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ArrowRightLeft className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800">
              {pendingTransferCount} Pending Transfer Request{pendingTransferCount > 1 ? 's' : ''}
            </h3>
            <p className="text-xs text-amber-600">
              Some tickets have pending transfer requests that require your attention.
            </p>
          </div>
        </div>
      )}

      <div className=" rounded-xl shadow-md border border-gray-200 overflow-visible">
        <div className="overflow-x-auto rounded-xl overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Ticket Details
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-primary" />
                    Status
                  </div>
                </th>
                {userRole !== "SUPPORT_AGENT" && (
                  <>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        Category
                      </div>
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Assigned To
                      </div>
                    </th>
                  </>
                )}
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Assigned By
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Created
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-50">
              {tickets.map((ticket, index) => (
                <TicketRow
                  key={ticket._id}
                  ticket={ticket as TicketWithTransfer}
                  rowIndex={index}
                  totalRows={tickets.length}
                  loadingState={loadingStates[ticket._id]}
                  onStatusUpdate={onStatusUpdate}
                  onCategoryUpdate={onCategoryUpdate}
                  onAssignTicket={onAssignTicket}
                  onDeleteTicket={onDeleteTicket}
                  onViewTicket={onViewTicket}
                  onNavigateToUser={onNavigateToUser}
                  categorySearchTerm={categorySearchTerm}
                  setCategorySearchTerm={setCategorySearchTerm}
                  showCategoryDropdown={showCategoryDropdown}
                  setShowCategoryDropdown={setShowCategoryDropdown}
                  showAssignDropdown={showAssignDropdown}
                  setShowAssignDropdown={setShowAssignDropdown}
                  assignSearchTerm={assignSearchTerm}
                  setAssignSearchTerm={setAssignSearchTerm}
                  getFilteredCategories={getFilteredCategories}
                  getFilteredAgents={getFilteredAgents}
                  onCreateCategory={onCreateCategory}
                  creatingCategory={creatingCategory}
                  userRole={userRole}
                  onOpenTransferModal={handleOpenTransferModal}
                  onOpenTransferDetailsModal={handleOpenTransferDetailsModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Action Modal */}
      <AdminTransferActionModal
        isOpen={showTransferModal}
        onClose={handleCloseTransferModal}
        ticket={selectedTicketForTransfer}
        onSuccess={handleTransferSuccess}
      />

      {/* Transfer Details Modal */}
      <TransferDetailsModal
        isOpen={showTransferDetailsModal}
        onClose={handleCloseTransferDetailsModal}
        ticket={selectedTicketForDetails}
        onSuccess={handleTransferSuccess}
      />
    </>
  );
};

// --------------------- Ticket Row Component ---------------------
interface TicketRowProps {
  ticket: TicketWithTransfer;
  rowIndex: number;
  totalRows: number;
  loadingState?: LoadingState;
  onStatusUpdate: (ticketId: string, status: string) => void;
  onCategoryUpdate: (ticketId: string, categoryId: string) => void;
  onAssignTicket: (ticketId: string, agentId: string) => void;
  onDeleteTicket: (ticketId: string) => void;
  onViewTicket: (ticketId: string) => void;
  onNavigateToUser: (email: string) => void;
  categorySearchTerm: Record<string, string>;
  setCategorySearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showCategoryDropdown: Record<string, boolean>;
  setShowCategoryDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  showAssignDropdown: Record<string, boolean>;
  setShowAssignDropdown: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  assignSearchTerm: Record<string, string>;
  setAssignSearchTerm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  getFilteredCategories: (ticketId: string) => CategoryType[];
  getFilteredAgents: (ticketId: string) => AgentType[];
  onCreateCategory: (ticketId: string, name: string) => void;
  creatingCategory: boolean;
  userRole: string;
  onOpenTransferModal: (ticket: TicketWithTransfer) => void;
  onOpenTransferDetailsModal: (ticket: TicketWithTransfer) => void;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  rowIndex,
  totalRows,
  loadingState,
  onStatusUpdate,
  onCategoryUpdate,
  onAssignTicket,
  onDeleteTicket,
  onViewTicket,
  onNavigateToUser,
  categorySearchTerm,
  setCategorySearchTerm,
  showCategoryDropdown,
  setShowCategoryDropdown,
  showAssignDropdown,
  setShowAssignDropdown,
  assignSearchTerm,
  setAssignSearchTerm,
  getFilteredCategories,
  getFilteredAgents,
  onCreateCategory,
  creatingCategory,
  userRole,
  onOpenTransferModal,
  onOpenTransferDetailsModal,
}) => {
  const isRowLoading = !!loadingState;
  const creatorInfo = getCreatorInfo(ticket);
  const assignedToName = ticket.assignedTo ? getAssignedUserName(ticket.assignedTo) : 'Unassigned';
  const assignedByName = ticket.assignedBy ? getAssignedUserName(ticket.assignedBy) : 'Unassigned';
  const showDropdownAbove = rowIndex >= totalRows - 2;

  // Check for pending transfer
  const hasPendingTransfer = ticket.transferRequest?.status === "Pending";
  const transferRequest = ticket.transferRequest;

  return (
    <>
      {/* Transfer Request Banner Row */}
      {hasPendingTransfer && userRole !== "SUPPORT_AGENT" && (
        <tr className="bg-amber-50/50 border-l-4 border-l-amber-400">
          <td colSpan={7} className="px-4 sm:px-6 py-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-md">
                  <ArrowRightLeft className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-amber-800">
                    Transfer Requested
                  </span>
                  <span className="text-amber-600 ml-2">
                    {transferRequest?.requestedBy?.firstName}{" "}
                    {transferRequest?.requestedBy?.lastName} →{" "}
                    <span className="font-medium">
                      {transferRequest?.toAgent?.firstName}{" "}
                      {transferRequest?.toAgent?.lastName}
                    </span>
                  </span>
                  {transferRequest?.reason && (
                    <span className="text-amber-500 ml-2 italic hidden md:inline">
                      "
                      {transferRequest.reason.length > 50
                        ? `${transferRequest.reason.substring(0, 50)}...`
                        : transferRequest.reason}
                      "
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenTransferModal(ticket)}
                className="text-xs h-7 px-3  border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
              >
                <Eye className="h-3 w-3 mr-1" />
                Review Request
              </Button>
            </div>
          </td>
        </tr>
      )}

      {/* Main Ticket Row */}
      <tr
        className={`hover:bg-blue-50/30 transition-colors duration-200 relative ${hasPendingTransfer && userRole !== "SUPPORT_AGENT" ? "" : ""
          }`}
      >
        {/* Loading Overlay */}
        {isRowLoading && (
          <td
            colSpan={7}
            className="absolute inset-0  backdrop-blur-sm z-10"
          >
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3  px-6 py-3 rounded-lg shadow-lg border border-gray-200">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium text-gray-700">
                  {getLoadingMessage(loadingState)}
                </span>
              </div>
            </div>
          </td>
        )}

        {/* Ticket Details */}
        <td className="px-4 sm:px-6 py-4">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                {ticket.subject}
              </div>
              {/* Transfer Badge - Inline */}
              {hasPendingTransfer && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 whitespace-nowrap">
                  <ArrowRightLeft className="h-2.5 w-2.5 mr-0.5" />
                  Transfer
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2 mb-2">
              {ticket.description}
            </div>
            <div className="space-y-1">
              {creatorInfo.name && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                  {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
                    <button
                      onClick={() => onNavigateToUser(creatorInfo.email)}
                      className="inline-flex items-center gap-1 text-gray-900 hover:underline font-medium truncate"
                    >
                      <span className="truncate">{creatorInfo.name}</span>
                      <BadgeCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium truncate">
                      {creatorInfo.name}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                {ticket.createdByModel && ticket.createdByModel !== "Public" ? (
                  <button
                    onClick={() => onNavigateToUser(creatorInfo.email)}
                    className="text-primary hover:underline font-medium truncate"
                  >
                    {creatorInfo.email}
                  </button>
                ) : (
                  <span className="text-gray-900 truncate">
                    {creatorInfo.email}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600/10 text-green-800">
                  {!ticket.isPublic ? "User" : "Public"}
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 sm:px-6 py-4">
          <select
            value={ticket.status}
            onChange={(e) => onStatusUpdate(ticket._id, e.target.value)}
            disabled={isRowLoading}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(
              ticket.status
            )} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "Pending" && "🟠 "}
                {status === "Open" && "🔵 "}
                {status === "In Progress" && "🟡 "}
                {status === "Resolved" && "🟢 "}
                {status === "Closed" && "⚫ "}
                {status}
              </option>
            ))}
          </select>
          <div>
            {hasPendingTransfer && userRole === "SUPPORT_AGENT" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenTransferDetailsModal(ticket)}
                className="mt-2 text-xs h-7 px-3 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
              >
                <ArrowRightLeft className="h-3 w-3 mr-1" />
                View Transfer Details
              </Button>
            )}
          </div>
        </td>

        {/* Category Column */}
        {userRole !== "SUPPORT_AGENT" && (
          <td className="px-4 sm:px-6 py-4">
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown((prev) => ({
                    ...prev,
                    [ticket._id]: !prev[ticket._id],
                  }));
                  setCategorySearchTerm((prev) => ({
                    ...prev,
                    [ticket._id]: "",
                  }));
                }}
                disabled={isRowLoading}
                style={{
                  backgroundColor: ticket?.category?.color
                    ? `${ticket.category.color}15`
                    : "transparent",
                  borderColor: ticket?.category?.color || "#e5e7eb",
                }}
                className="min-w-[120px] text-xs font-medium rounded-full py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:shadow-sm text-left flex items-center gap-2 disabled:opacity-50"
              >
                {ticket?.category && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ticket.category.color }}
                  />
                )}
                <span className="truncate">
                  {ticket?.category?.name || "No Category"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto flex-shrink-0" />
              </button>

              {showCategoryDropdown[ticket._id] && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setShowCategoryDropdown((prev) => ({
                        ...prev,
                        [ticket._id]: false,
                      }))
                    }
                  />
                  <div
                    className={`absolute z-50 ${showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
                      } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
                  >
                    <div
                      className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${showDropdownAbove
                          ? "-bottom-1.5 border-b border-r"
                          : "-top-1.5 border-t border-l"
                        }`}
                    />
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={categorySearchTerm[ticket._id] || ""}
                          onChange={(e) =>
                            setCategorySearchTerm((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value,
                            }))
                          }
                          placeholder="Search or create category..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {getFilteredCategories(ticket._id).length > 0 ? (
                        <>
                          <button
                            onClick={() => {
                              onCategoryUpdate(ticket._id, "");
                              setShowCategoryDropdown((prev) => ({
                                ...prev,
                                [ticket._id]: false,
                              }));
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500"
                          >
                            ⚪ No Category
                          </button>
                          {getFilteredCategories(ticket._id).map((category) => (
                            <button
                              key={category._id}
                              onClick={() => {
                                onCategoryUpdate(ticket._id, category._id);
                                setShowCategoryDropdown((prev) => ({
                                  ...prev,
                                  [ticket._id]: false,
                                }));
                              }}
                              className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                            >
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium truncate">
                                {category.name}
                              </span>
                            </button>
                          ))}
                        </>
                      ) : categorySearchTerm[ticket._id]?.trim() ? (
                        <button
                          onClick={() =>
                            onCreateCategory(
                              ticket._id,
                              categorySearchTerm[ticket._id]
                            )
                          }
                          disabled={creatingCategory}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 text-primary font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {creatingCategory
                            ? "Creating..."
                            : `Create "${categorySearchTerm[ticket._id]}"`}
                        </button>
                      ) : (
                        <div className="px-3 py-2 text-xs text-gray-400 text-center">
                          Type to search or create category
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </td>
        )}

        {/* Assigned To Column */}
        {userRole !== "SUPPORT_AGENT" && (
          <td className="px-4 sm:px-6 py-4">
            <div className="relative">
              <button
                onClick={() => {
                  setShowAssignDropdown((prev) => ({
                    ...prev,
                    [ticket._id]: !prev[ticket._id],
                  }));
                  setAssignSearchTerm((prev) => ({
                    ...prev,
                    [ticket._id]: "",
                  }));
                }}
                disabled={isRowLoading}
                className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 disabled:opacity-50"
              >
                {ticket.assignedTo ? (
                  <>
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {getInitials(assignedToName)}
                        </span>
                      </div>
                      {/* Transfer indicator on avatar */}
                      {hasPendingTransfer && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                          <ArrowRightLeft className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {assignedToName}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {hasPendingTransfer ? (
                          <span className="text-amber-600">
                            → {transferRequest?.toAgent?.firstName}{" "}
                            {transferRequest?.toAgent?.lastName}
                          </span>
                        ) : (
                          "Support Agent"
                        )}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-600">
                        Assign Agent
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto flex-shrink-0" />
                  </>
                )}
              </button>

              {showAssignDropdown[ticket._id] && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setShowAssignDropdown((prev) => ({
                        ...prev,
                        [ticket._id]: false,
                      }))
                    }
                  />
                  <div
                    className={`absolute z-50 ${showDropdownAbove ? "bottom-full mb-1" : "top-full mt-1"
                      } left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg`}
                  >
                    <div
                      className={`absolute left-6 w-3 h-3 bg-white border-gray-200 transform rotate-45 ${showDropdownAbove
                          ? "-bottom-1.5 border-b border-r"
                          : "-top-1.5 border-t border-l"
                        }`}
                    />
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={assignSearchTerm[ticket._id] || ""}
                          onChange={(e) =>
                            setAssignSearchTerm((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value,
                            }))
                          }
                          placeholder="Search agent..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          onAssignTicket(ticket._id, "");
                          setShowAssignDropdown((prev) => ({
                            ...prev,
                            [ticket._id]: false,
                          }));
                        }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-b border-gray-100 text-gray-500 flex items-center gap-2"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                        <span>Unassign</span>
                      </button>
                      {getFilteredAgents(ticket._id).map((agent) => (
                        <button
                          key={agent._id}
                          onClick={() => {
                            onAssignTicket(ticket._id, agent._id);
                            setShowAssignDropdown((prev) => ({
                              ...prev,
                              [ticket._id]: false,
                            }));
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
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
                            <div className="text-gray-500 text-[10px] truncate">
                              {agent.email}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </td>
        )}

        {/* Assigned By */}
        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
          {ticket.assignedBy ? (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-green-700 text-xs font-semibold">
                  {getInitials(assignedByName)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {assignedByName}
                </div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
          ) : ticket.assignedTo ? (
            <div className="text-sm text-gray-600 italic">Assigned by Admin</div>
          ) : (
            <div className="text-sm text-gray-400 italic">Not assigned yet</div>
          )}
        </td>

        {/* Created Date */}
        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            {formatDate(ticket.createdAt)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatTime(ticket.createdAt)}
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Transfer Review Button - Quick action */}
            {hasPendingTransfer && userRole !== "SUPPORT_AGENT" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenTransferModal(ticket)}
                disabled={isRowLoading}
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                title="Review Transfer Request"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewTicket(ticket._id)}
              disabled={isRowLoading}
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {userRole !== "SUPPORT_AGENT" && (
              <PermissionGate
                action="delete"
                feature="support-tickets-management"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTicket(ticket._id)}
                  disabled={isRowLoading}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete Ticket"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PermissionGate>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TicketsTable;