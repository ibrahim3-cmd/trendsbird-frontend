// components/HeaderActions.tsx
import React from "react";
import { Filter, ChevronDown, ChevronUp, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  onManageCategories: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  showFilters,
  onToggleFilters,
  onRefresh,
  isFetching,
  onManageCategories,
}) => {
  return (
    <div className="flex items-center justify-end gap-3 mb-6 mt-8">
      <Button
        variant="default"
        onClick={onManageCategories}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Manage Categories</span>
      </Button>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isFetching}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline font-medium">Filters</span>
        {showFilters ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
};

export default HeaderActions;