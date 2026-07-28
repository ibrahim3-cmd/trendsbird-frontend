import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, Eye, Edit, CreditCard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
//import { PageHeader } from "@/components/ui/PageHeader";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { Org } from "@/types/org.type";
import EditOrgModal from "./components/EditOrgModal";
import ViewOrgModal from "./components/ViewOrgModal";
import { BackButton } from "@/components/ui/BackButton";
import EditBillingModal from "./components/EditBillingModal";

const statusColor = (s: string) =>
  s === "ACTIVE" || s === "active"
    ? "bg-green-100 text-green-700"
    : s === "PENDING" || s === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "BLOCKED" || s === "blocked" || s === "INACTIVE" || s === "inactive"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";

const StatusBadge = ({ value }: { value: string }) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      statusColor(value)
    )}
  >
    {value}
  </span>
);

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const ManageOrgPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingOrgId, setViewingOrgId] = useState<string | null>(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [editingBillingOrg, setEditingBillingOrg] = useState<Org | null>(null);

  const debouncedSearch = useDebounced(search);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      searchTerm: debouncedSearch,
    }),
    [page, limit, debouncedSearch]
  );

  const { data, isLoading, isFetching, refetch } = useGetAllOrgQuery(queryArgs);

  const total = data?.meta?.total ?? 0;
  const totalPages =
    data?.meta?.totalPages ??
    Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onResetFilters = () => {
    setPage(1);
    setLimit(10);
    setSearch("");
  };

  const handleViewOrg = (orgId: string) => {
    setViewingOrgId(orgId);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingOrgId(null);
  };

  const handleEditOrg = (orgId: string) => {
    setEditingOrgId(orgId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingOrgId(null);
  };

  const handleEditSuccess = () => {
    refetch();
    handleCloseEditModal();
  };

  const handleEditBilling = (org: Org) => {
    setEditingBillingOrg(org);
    setIsBillingModalOpen(true);
  };

  const handleCloseBillingModal = () => {
    setIsBillingModalOpen(false);
    setEditingBillingOrg(null);
  };

  const handleBillingSuccess = () => {
    refetch();
    handleCloseBillingModal();
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Manage Organizations"
        icon={Building2}
        description="View and manage all organizations"
      /> */}

      <div className="flex justify-between items-center mb-4">
        <BackButton />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">All Organizations</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organization name, email, or phone..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <select
                className="w-full h-9 border rounded-md px-3 bg-background"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/page
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex">
              <Button
                variant="outline"
                className="w-full"
                onClick={onResetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2.5 px-3">Organization Name</th>
                  <th className="py-2.5 px-3">Contact Email</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? // skeleton rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`sk-${i}`} className="border-t">
                        {Array.from({ length: 7 }).map((__, j) => (
                          <td key={`sk-${i}-${j}`} className="py-3 px-3">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : data?.data?.map((org: Org) => (
                      <tr key={org._id} className="border-t">
                        <td className="py-3 px-3 font-medium">{org.orgName}</td>
                        <td className="py-3 px-3">{org.orgEmail || "—"}</td>
                        <td className="py-3 px-3">{org.orgPhone || "—"}</td>
                        <td className="py-3 px-3">{org.orgAddress?.address || "—"}</td>
                        <td className="py-3 px-3">
                          <StatusBadge value={org.status || 'Unknown'} />
                        </td>
                        <td className="py-3 px-3">
                          {org.plan?.name || "—"}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1 justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOrg(org._id)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditOrg(org._id)}
                                className="flex items-center gap-1 border-primary text-primary"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleEditBilling(org)}
                                className="flex items-center gap-1"
                              >
                                <CreditCard className="h-4 w-4" />
                                Billing
                              </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                {!isLoading && (data?.data?.length ?? 0) === 0 && (
                  <tr className="border-t">
                    <td
                      className="py-6 px-3 text-center text-muted-foreground"
                      colSpan={7}
                    >
                      No Organizations Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {Math.min((page - 1) * limit + 1, total)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Organization Modal */}
      <EditOrgModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        orgId={editingOrgId}
      />

      {/* View Organization Modal */}
      <ViewOrgModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        orgId={viewingOrgId}
      />

      <EditBillingModal
        isOpen={isBillingModalOpen}
        onClose={handleCloseBillingModal}
        onSuccess={handleBillingSuccess}
        orgId={editingBillingOrg?._id || null}
        currentPaymentMethodId={editingBillingOrg?.billingInfo?.paymentMethodId}
      />
    </div>
  );
};

export default ManageOrgPage;