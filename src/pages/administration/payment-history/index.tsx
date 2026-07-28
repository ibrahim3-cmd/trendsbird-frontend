// payments/index.tsx
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
//import { CreditCard } from "lucide-react";
import { useGetPaymentsQuery, useGetPaymentStatsQuery } from "@/redux/features/payment/paymentApiSlice";
import { PaymentQuery, IPayment } from "@/types/payment.type";
//import { PageHeader } from "@/components/ui/PageHeader";
import { PaymentFilters } from "./components/PaymentFilters";
import { PaymentsTable } from "./components/PaymentsTable";
import { PaymentStats } from "./components/PaymentStats";
import { PaymentDetailsModal } from "./components/PaymentDetailsModal";
import { Button } from "@/components/ui/button";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { production } from "@/constants";
import { BackButton } from "@/components/ui/BackButton";

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const PaymentsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("ALL");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL"); // NEW: Type filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

  const debouncedSearch = useDebounced(search);

  // Get user info to check role
  const { data: userData } = useUserInfoQuery(undefined);
  const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";

  const queryArgs: PaymentQuery = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      ...(selectedStatus !== "ALL" && { status: selectedStatus as any }),
      ...(selectedOrgId !== "ALL" && { orgId: selectedOrgId }),
      ...(selectedPlanId !== "ALL" && { planId: selectedPlanId }),
      ...(selectedType !== "ALL" && { type: selectedType }), // NEW: Include type in query
      ...(dateRange?.from && { startDate: format(dateRange.from, "yyyy-MM-dd") }),
      ...(dateRange?.to && { endDate: format(dateRange.to, "yyyy-MM-dd") }),
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [
      page, limit, debouncedSearch, selectedStatus, selectedOrgId, selectedPlanId,
      selectedType, dateRange // NEW: Include selectedType in dependencies
    ]
  );

  const { data: paymentsResponse, isLoading, isFetching } = useGetPaymentsQuery(queryArgs);
  const { data: statsResponse, isLoading: statsLoading } = useGetPaymentStatsQuery();

  // Extract data from response
  const payments = Array.isArray(paymentsResponse?.data) ? paymentsResponse.data : [];
  const meta = paymentsResponse?.meta;
  const stats = statsResponse?.data;
  
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onResetFilters = () => {
    setPage(1);
    setLimit(20);
    setSearch("");
    setSelectedStatus("ALL");
    setSelectedOrgId("ALL");
    setSelectedPlanId("ALL");
    setSelectedType("ALL"); // NEW: Reset type filter
    setDateRange(undefined);
  };

  // FIX: Updated to include selectedType in hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      search !== "" ||
      selectedStatus !== "ALL" ||
      selectedOrgId !== "ALL" ||
      selectedPlanId !== "ALL" ||
      selectedType !== "ALL" || // NEW: Include type in active filters
      dateRange?.from !== undefined ||
      dateRange?.to !== undefined
    );
  }, [search, selectedStatus, selectedOrgId, selectedPlanId, selectedType, dateRange]);

  const handleViewDetails = (payment: IPayment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleDownloadInvoice = (payment: IPayment) => {
    // Construct download URL based on environment
    let base = '';
    if (production) {
      base = (import.meta.env.VITE_BASE_URL_PROD as string) || (import.meta.env.VITE_BASE_URL as string) || '';
    } else {
      base = (import.meta.env.VITE_BASE_URL as string) || (import.meta.env.VITE_BASE_URL_PROD as string) || '';
    }
    const downloadUrl = `${base}/payments/download/${payment._id}`;
    window.open(downloadUrl, '_blank');
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPayment(null);
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Payment History"
        icon={CreditCard}
        description="View and manage payment transactions and statistics"
      /> */}

      <div className="flex justify-between items-center mb-4">
        <BackButton />
      </div>

      {/* Payment Statistics */}
      <PaymentStats stats={stats} loading={statsLoading} />

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">Payment Transactions</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentFilters
            search={search}
            onSearchChange={(value) => {
              setPage(1);
              setSearch(value);
            }}
            selectedStatus={selectedStatus}
            onStatusChange={(value) => {
              setPage(1);
              setSelectedStatus(value);
            }}
            selectedOrgId={selectedOrgId}
            onOrgChange={(value) => {
              setPage(1);
              setSelectedOrgId(value);
            }}
            // selectedPlanId={selectedPlanId}
            // onPlanChange={(value) => {
            //   setPage(1);
            //   setSelectedPlanId(value);
            // }}
            selectedType={selectedType} 
            onTypeChange={(value) => {
              setPage(1);
              setSelectedType(value);
            }}
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              setPage(1);
              setDateRange(range);
            }}
            onResetFilters={onResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {total > 0 ? (
                <>
                  Showing <span className="font-medium">{payments.length}</span> of{" "}
                  <span className="font-medium">{total}</span> payments
                </>
              ) : (
                "No payments found"
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select 
                className="h-7 w-20 border rounded-md px-2 text-sm"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <PaymentsTable
            payments={payments}
            loading={loading}
            onViewDetails={handleViewDetails}
            onDownloadInvoice={handleDownloadInvoice}
            onDeletePayment={() => {}} 
            showOrgColumn={isSuperAdmin}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentDetailsModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsPage;