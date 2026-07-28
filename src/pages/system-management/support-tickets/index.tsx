// index.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";

// Redux Hooks
import {
  useGetAllSupportTicketsQuery,
  useUpdateSupportTicketStatusMutation,
  useAssignSupportTicketMutation,
  useDeleteSupportTicketMutation,
  useGetSupportCategoriesQuery,
  useCreateSupportCategoryMutation,
  useDeleteSupportCategoryMutation,
  useUpdateSupportTicketCategoryMutation,
} from "@/redux/features/support/supportApiSlice";
import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

// Components
import HeaderActions from "./components/HeaderActions";
import TicketFilters from "./components/TicketFilters";

import TicketsTable from "./components/TicketsTable";
import TicketsPagination from "./components/TicketsPagination";
import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
import { ManageSupportCategoryModal } from "./components/ManageSupportCategoryModal";
import {
  AgentType,
  CategoryType,
  FilterState,
  LoadingState,
  StatsType,
  StatusOption,
  TicketType,
} from "@/types/support.type";
import { INITIAL_FILTERS, STATUS_OPTIONS } from "./constant";
import StatsCards from "./components/StatusCard";

// Types, Constants, Utils

const SupportTicketManagementPage: React.FC = () => {
  const navigate = useNavigate();

  // --------------------- User Data ---------------------
  const { data: userData, isLoading: isUserLoading } =
    useUserInfoQuery(undefined);
  const user = userData?.data;
  const userRole = user?.role;

  // --------------------- State ---------------------
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  // console.log(filters)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingStates, setLoadingStates] = useState<
    Record<string, LoadingState>
  >({});
  const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
  const [showManageCategoryModal, setShowManageCategoryModal] = useState(false);

  // Category & Assignment dropdown states
  const [categorySearchTerm, setCategorySearchTerm] = useState<
    Record<string, string>
  >({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<
    Record<string, boolean>
  >({});
  const [showAssignDropdown, setShowAssignDropdown] = useState<
    Record<string, boolean>
  >({});
  const [assignSearchTerm, setAssignSearchTerm] = useState<
    Record<string, string>
  >({});
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
  const [showCategoryFilterDropdown, setShowCategoryFilterDropdown] =
    useState(false);

  // Filter dropdown states
  const [statusFilterSearch, setStatusFilterSearch] = useState("");
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] =
    useState(false);
  const [agentFilterSearch, setAgentFilterSearch] = useState("");
  const [showAgentFilterDropdown, setShowAgentFilterDropdown] = useState(false);

  const { data: supportAgentsData } = useGetAllSupportAgentsQuery({
    page: 1,
    limit: 1000000,
  });

  const {
    data: supportCategoriesData,
    isFetching: isSupportCategoryFetching,
    refetch: refetchCategories,
  } = useGetSupportCategoriesQuery();

  // --------------------- Debounce Search ---------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // --------------------- API Hooks ---------------------
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: filters.page,
      limit: filters.limit,
      search: debouncedSearch,
    };
    if (filters.status) params.status = filters.status;
    if (filters.assignedTo) params.assignedTo = filters.assignedTo;
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.transferRequest)
      params.transferRequest = filters.transferRequest;
    return params;
  }, [filters, debouncedSearch]);

  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isFetching,
    refetch,
  } = useGetAllSupportTicketsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
  });

  const [updateStatus] = useUpdateSupportTicketStatusMutation();
  const [updateCategory] = useUpdateSupportTicketCategoryMutation();
  const [assignTicket] = useAssignSupportTicketMutation();
  const [deleteTicket] = useDeleteSupportTicketMutation();
  const [createCategory] = useCreateSupportCategoryMutation();
  const [deleteCategoryMutation] = useDeleteSupportCategoryMutation();

  // --------------------- Refetch on Mount ---------------------
  useEffect(() => {
    refetch();
  }, [refetch]);

  // --------------------- Derived Data ---------------------
  const tickets: TicketType[] = ticketsData?.data || [];
  const total = ticketsData?.meta?.total ?? 0;
  const totalPages =
    ticketsData?.meta?.totalPages ??
    Math.max(1, Math.ceil(total / filters.limit));

  const agents: AgentType[] = useMemo(() => {
    return (supportAgentsData?.data || []).filter(
      (user: { role: string }) => user.role === "SUPPORT_AGENT"
    );
  }, [supportAgentsData?.data]);

  const categories: CategoryType[] = useMemo(() => {
    return supportCategoriesData?.data || [];
  }, [supportCategoriesData?.data]);

  const stats: StatsType = ticketsData?.meta?.statusBreakdown || {
    totalPending: tickets.filter((t) => t?.status === "Pending").length,
    totalOpen: tickets.filter((t) => t?.status === "Open").length,
    totalInProgress: tickets.filter((t) => t?.status === "In Progress").length,
    totalResolved: tickets.filter((t) => t?.status === "Resolved").length,
    totalClosed: tickets.filter((t) => t?.status === "Closed").length,
    totalTransferPending: tickets.filter(
      (t) => t?.transferRequest?.status === "Pending"
    ).length,
  };

  const totalTickets =
    (stats.totalPending || 0) +
    (stats.totalOpen || 0) +
    (stats.totalInProgress || 0) +
    (stats.totalResolved || 0) +
    (stats.totalClosed || 0);

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.assignedTo ||
    filters.category ||
    filters.dateRange?.from ||
    filters.dateRange?.to;
  filters.transferRequest;

  // --------------------- Handlers ---------------------
  // const handleFilterChange = useCallback(
  //   (key: keyof FilterState, value: string | number | DateRange | undefined) => {
  //     setFilters((prev) => ({
  //       ...prev,
  //       [key]: value,
  //       ...(key !== "page" && { page: 1 }),
  //     }));
  //   },
  //   []
  // );
  const handleFilterChange = useCallback(
    (
      key: keyof FilterState,
      value: string | number | DateRange | undefined
    ) => {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          [key]: value,
          ...(key !== "page" && { page: 1 }),
        };

        // Mutually exclusive: status and transferRequest
        if (key === "status") {
          newFilters.transferRequest = "";
        } else if (key === "transferRequest") {
          newFilters.status = "";
        }

        return newFilters;
      });
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const handleStatusUpdate = useCallback(
    async (ticketId: string, newStatus: string) => {
      setLoadingStates((prev) => ({ ...prev, [ticketId]: "updating" }));
      try {
        await updateStatus({
          id: ticketId,
          status: newStatus,
        }).unwrap();
        toast.success("Ticket status updated successfully");
        refetch();
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to update ticket status");
      } finally {
        setLoadingStates((prev) => {
          const newState = { ...prev };
          delete newState[ticketId];
          return newState;
        });
      }
    },
    [updateStatus, refetch]
  );

  const handleCategoryUpdate = useCallback(
    async (ticketId: string, categoryId: string) => {
      setLoadingStates((prev) => ({
        ...prev,
        [ticketId]: "updating-category",
      }));
      try {
        await updateCategory({
          id: ticketId,
          category: categoryId || null,
        }).unwrap();
        toast.success("Ticket category updated successfully");
        refetch();
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to update category");
      } finally {
        setLoadingStates((prev) => {
          const newState = { ...prev };
          delete newState[ticketId];
          return newState;
        });
        setShowCategoryDropdown((prev) => ({ ...prev, [ticketId]: false }));
      }
    },
    [updateCategory, refetch]
  );

  const handleCreateCategory = useCallback(
    async (ticketId: string, categoryName: string) => {
      if (!categoryName.trim()) return;
      setCreatingCategory(true);
      try {
        const data = {
          name: categoryName.trim(),
          description: "",
          color: "#3B82F6",
        };
        const result = await createCategory({ data: data }).unwrap();
        toast.success("Category created successfully");
        await refetchCategories();
        await handleCategoryUpdate(ticketId, result.data._id);
        setShowCategoryDropdown((prev) => ({ ...prev, [ticketId]: false }));
        setCategorySearchTerm((prev) => ({ ...prev, [ticketId]: "" }));
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to create category");
      } finally {
        setCreatingCategory(false);
      }
    },
    [createCategory, handleCategoryUpdate, refetchCategories]
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteCategoryMutation(categoryId).unwrap();
        toast.success("Category deleted successfully");
        await refetchCategories();
        if (filters.category === categoryId) {
          handleFilterChange("category", "");
        }
        await refetch();
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to delete category");
      }
    },
    [
      deleteCategoryMutation,
      refetchCategories,
      refetch,
      filters.category,
      handleFilterChange,
    ]
  );

  const getFilteredCategories = useCallback(
    (ticketId: string) => {
      const searchTerm = categorySearchTerm[ticketId] || "";
      if (!searchTerm.trim()) return categories;
      return categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [categories, categorySearchTerm]
  );

  const getFilteredAgents = useCallback(
    (ticketId: string) => {
      const searchTerm = assignSearchTerm[ticketId] || "";
      if (!searchTerm.trim()) return agents;
      return agents.filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [agents, assignSearchTerm]
  );

  const getFilteredCategoriesForFilter = useCallback(() => {
    if (!categoryFilterSearch.trim()) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categoryFilterSearch.toLowerCase())
    );
  }, [categories, categoryFilterSearch]);

  const getFilteredStatusOptions = useCallback((): StatusOption[] => {
    if (!statusFilterSearch.trim()) return STATUS_OPTIONS;
    return STATUS_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(statusFilterSearch.toLowerCase())
    );
  }, [statusFilterSearch]);

  const getFilteredAgentsForFilter = useCallback(() => {
    if (!agentFilterSearch.trim()) return agents;
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(agentFilterSearch.toLowerCase())
    );
  }, [agents, agentFilterSearch]);

  const handleAssignTicket = useCallback(
    async (ticketId: string, agentId: string) => {
      setLoadingStates((prev) => ({ ...prev, [ticketId]: "assigning" }));
      try {
        await assignTicket({
          id: ticketId,
          assignedTo: agentId || null,
        }).unwrap();
        toast.success(
          agentId
            ? "Ticket assigned successfully"
            : "Ticket unassigned successfully"
        );
        refetch();
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to assign ticket");
      } finally {
        setLoadingStates((prev) => {
          const newState = { ...prev };
          delete newState[ticketId];
          return newState;
        });
        setShowAssignDropdown((prev) => ({ ...prev, [ticketId]: false }));
      }
    },
    [assignTicket, refetch]
  );

  const handleConfirmDeleteTicket = async () => {
    if (!deleteTicketId) return;

    setLoadingStates((prev) => ({ ...prev, [deleteTicketId]: "deleting" }));

    try {
      await deleteTicket({ id: deleteTicketId }).unwrap();
      toast.success("Ticket deleted successfully");
      setDeleteTicketId(null);
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete ticket");
    } finally {
      setLoadingStates((prev) => {
        const next = { ...prev };
        delete next[deleteTicketId];
        return next;
      });
    }
  };

  const handleViewTicket = useCallback(
    (ticketId: string) => {
      navigate(`/system-management/${ticketId}`);
    },
    [navigate]
  );

  const handleNavigateToUser = useCallback(
    (email: string) => {
      navigate(`/admin/manage-users?search=${encodeURIComponent(email)}`);
    },
    [navigate]
  );

  // --------------------- Loading State ---------------------
  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto p-2 sm:p-4">
        {/* Header Actions */}
        <HeaderActions
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={refetch}
          isFetching={isFetching}
          onManageCategories={() => setShowManageCategoryModal(true)}
        />

        {/* Filters */}
        {showFilters && (
          <TicketFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            hasActiveFilters={!!hasActiveFilters}
            statusOptions={STATUS_OPTIONS}
            agents={agents}
            categories={categories}
            categoryFilterSearch={categoryFilterSearch}
            setCategoryFilterSearch={setCategoryFilterSearch}
            showCategoryFilterDropdown={showCategoryFilterDropdown}
            setShowCategoryFilterDropdown={setShowCategoryFilterDropdown}
            getFilteredCategoriesForFilter={getFilteredCategoriesForFilter}
            statusFilterSearch={statusFilterSearch}
            setStatusFilterSearch={setStatusFilterSearch}
            showStatusFilterDropdown={showStatusFilterDropdown}
            setShowStatusFilterDropdown={setShowStatusFilterDropdown}
            getFilteredStatusOptions={getFilteredStatusOptions}
            agentFilterSearch={agentFilterSearch}
            setAgentFilterSearch={setAgentFilterSearch}
            showAgentFilterDropdown={showAgentFilterDropdown}
            setShowAgentFilterDropdown={setShowAgentFilterDropdown}
            getFilteredAgentsForFilter={getFilteredAgentsForFilter}
            onDeleteCategory={handleDeleteCategory}
            userRole={user?.role || ""}
          />
        )}

        {/* Stats Cards */}
        <StatsCards
          stats={stats}
          totalTickets={totalTickets}
          currentFilter={filters.status}
          onFilterChange={handleFilterChange}
          currentTransferFilter={filters.transferRequest || ""}
        />

        {/* Tickets Table */}
        <TicketsTable
          tickets={tickets}
          agents={agents}
          categories={categories}
          isLoading={
            isTicketsLoading || isFetching || isSupportCategoryFetching
          }
          loadingStates={loadingStates}
          onStatusUpdate={handleStatusUpdate}
          onCategoryUpdate={handleCategoryUpdate}
          onAssignTicket={handleAssignTicket}
          onDeleteTicket={setDeleteTicketId}
          onViewTicket={handleViewTicket}
          onNavigateToUser={handleNavigateToUser}
          hasActiveFilters={!!hasActiveFilters}
          userRole={userRole || ""}
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
          onCreateCategory={handleCreateCategory}
          creatingCategory={creatingCategory}
        />

        {/* Pagination */}
        {total > 0 && (
          <TicketsPagination
            page={filters.page}
            limit={filters.limit}
            total={total}
            totalPages={totalPages}
            isFetching={isFetching}
            onPageChange={(page) => handleFilterChange("page", page)}
            onLimitChange={(limit) => handleFilterChange("limit", limit)}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTicketId}
        onClose={() => setDeleteTicketId(null)}
        onConfirm={handleConfirmDeleteTicket}
        title="Delete Ticket"
        itemName="this support ticket"
        description="This action cannot be undone."
        isLoading={loadingStates[deleteTicketId!] === "deleting"}
      />

      {/* Manage Category Modal */}
      <ManageSupportCategoryModal
        isOpen={showManageCategoryModal}
        onClose={() => setShowManageCategoryModal(false)}
        categories={categories}
        onRefetch={refetchCategories}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default SupportTicketManagementPage;
