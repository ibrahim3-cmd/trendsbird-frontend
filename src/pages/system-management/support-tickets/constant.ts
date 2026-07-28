// constants.ts
import { FilterState, StatusOption, TicketStatus } from "@/types/support.type";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";


export const TICKET_STATUSES: TicketStatus[] = [
  "Pending",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

export const STATUS_OPTIONS: StatusOption[] = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending", icon: Clock, color: "text-orange-600" },
  { value: "Open", label: "Open", icon: AlertCircle, color: "text-blue-600" },
  {
    value: "In Progress",
    label: "In Progress",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    value: "Resolved",
    label: "Resolved",
    icon: CheckCircle,
    color: "text-green-600",
  },
  { value: "Closed", label: "Closed", icon: XCircle, color: "text-gray-600" },
];

export const INITIAL_FILTERS: FilterState = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  assignedTo: "",
  category: "",
  startDate: "",
  endDate: "",
  transferRequest: "",
};