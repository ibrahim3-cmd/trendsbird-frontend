
// components/StatsCards.tsx
import React from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  ArrowRightLeft,
} from "lucide-react";
import { FilterState, StatsType } from "@/types/support.type";

interface StatsCardsProps {
  stats: StatsType;
  totalTickets: number;
  currentFilter: string;
  currentTransferFilter: string;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  totalTickets,
  currentFilter,
  currentTransferFilter,
  onFilterChange,
}) => {
  const handleTransferClick = () => {
    if (currentTransferFilter === "Pending") {
      // If already filtered by transfer, clear it
      onFilterChange("transferRequest", "");
    } else {
      // Set transfer filter and clear status filter
      onFilterChange("transferRequest", "Pending");
    }
  };

  const statsData = [
    {
      key: "",
      label: "Total Tickets",
      value: totalTickets,
      icon: BarChart3,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-600",
      activeClass: "bg-blue-50 border-blue-200 ring-2 ring-blue-200",
      onClick: () => onFilterChange("status", ""),
    },
    {
      key: "transferRequest",
      label: "Transfer Req.",
      value: stats.totalTransferPending || 0,
      icon: ArrowRightLeft,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-600",
      activeClass: "bg-red-50 border-red-200 ring-2 ring-red-200",
      onClick: handleTransferClick,
    },
    {
      key: "Pending",
      label: "Pending",
      value: stats.totalPending || 0,
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-600",
      activeClass: "bg-orange-50 border-orange-200 ring-2 ring-orange-200",
      onClick: () => onFilterChange("status", "Pending"),
    },
    {
      key: "Open",
      label: "Open",
      value: stats.totalOpen || 0,
      icon: AlertCircle,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
      activeClass: "bg-blue-50 border-blue-200 ring-2 ring-blue-200",
      onClick: () => onFilterChange("status", "Open"),
    },
    {
      key: "In Progress",
      label: "In Progress",
      value: stats.totalInProgress || 0,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600",
      activeClass: "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-200",
      onClick: () => onFilterChange("status", "In Progress"),
    },
    {
      key: "Resolved",
      label: "Resolved",
      value: stats.totalResolved || 0,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      activeClass: "bg-green-50 border-green-200 ring-2 ring-green-200",
      onClick: () => onFilterChange("status", "Resolved"),
    },
    {
      key: "Closed",
      label: "Closed",
      value: stats.totalClosed || 0,
      icon: XCircle,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      textColor: "text-gray-600",
      activeClass: "bg-gray-50 border-gray-300 ring-2 ring-gray-300",
      onClick: () => onFilterChange("status", "Closed"),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statsData.map((stat) => {
        const isActive =
          stat.key === "transferRequest"
            ? currentTransferFilter === "Pending"
            : currentFilter === stat.key;
        const Icon = stat.icon;

        return (
          <button
            key={stat.label}
            onClick={stat.onClick}
            className={`p-3 sm:p-4 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer text-left hover:shadow-md ${
              isActive
                ? stat.activeClass
                : " border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-600 truncate">
                  {stat.label}
                </p>
                <div className={`p-1.5 sm:p-2 ${stat.bgColor} rounded-lg flex-shrink-0`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;