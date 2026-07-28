// utils.ts

import { AssignedUserType, LoadingState, TicketType } from "@/types/support.type";


export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-800",
    Open: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
    Closed: "bg-gray-100 text-gray-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const getCreatorInfo = (
  ticket: TicketType
): { name: string; email: string } => {
  const creatorInfo = ticket?.createdBy || ticket?.publicUserInfo;

  let name = "";
  if (creatorInfo) {
    if ("firstName" in creatorInfo && creatorInfo.firstName) {
      name = `${creatorInfo.name || ""}`.trim();
    } else if ("name" in creatorInfo) {
      name = creatorInfo.name || "";
    }
  }

  const email = creatorInfo?.email || "N/A";
  return { name, email };
};

export const getAssignedUserName = (user?: AssignedUserType): string => {
  if (!user) return "";
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  return user.name || "";
};

export const getInitials = (name?: string): string => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateString?: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLoadingMessage = (state?: LoadingState): string => {
  switch (state) {
    case "updating":
      return "🔄 Updating status...";
    case "updating-category":
      return "🏷️ Updating category...";
    case "assigning":
      return "👤 Assigning agent...";
    case "deleting":
      return "🗑️ Deleting ticket...";
    default:
      return "Loading...";
  }
};