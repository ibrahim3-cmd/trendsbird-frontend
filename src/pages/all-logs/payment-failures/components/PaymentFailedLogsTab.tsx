import { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useGetPaymentFailedLogsQuery } from "@/redux/features/paymentFailedLog/paymentFailedLogApiSlice";
import { PaymentFailedLogQuery, PaymentFailureSource, PaymentFailureReason } from "@/types/paymentFailedLog.type";
import { PaymentFailedLogsFilters } from "./PaymentFailedLogsFilters";
import { PaymentFailedLogsTable } from "./PaymentFailedLogsTable";
import { PaymentFailedLogsPagination } from "./PaymentFailedLogsPagination";
import { PaymentFailedLogsStats } from "./PaymentFailedLogsStats";

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export const PaymentFailedLogsTab = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<PaymentFailureSource | "ALL">("ALL");
  const [selectedReason, setSelectedReason] = useState<PaymentFailureReason | "ALL">("ALL");
  const [selectedResolved, setSelectedResolved] = useState<"ALL" | "true" | "false">("ALL");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const debouncedSearch = useDebounced(search);

  const queryArgs: PaymentFailedLogQuery = useMemo(
    () => {
      const args: PaymentFailedLogQuery = {
        page,
        limit,
        search: debouncedSearch || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (selectedSource !== "ALL") {
        args.source = selectedSource;
      }

      if (selectedReason !== "ALL") {
        args.failureReason = selectedReason;
      }

      if (selectedResolved !== "ALL") {
        args.isResolved = selectedResolved === "true";
      }

      if (selectedOrgId !== "ALL") {
        args.orgId = selectedOrgId;
      }

      if (startDate) {
        args.startDate = startDate;
      }

      if (endDate) {
        args.endDate = endDate;
      }

      return args;
    },
    [page, limit, debouncedSearch, selectedSource, selectedReason, selectedResolved, selectedOrgId, startDate, endDate]
  );

  const { data: logsResponse, isLoading, isFetching } = useGetPaymentFailedLogsQuery(queryArgs);

  const logs = Array.isArray(logsResponse?.data) ? logsResponse.data : [];
  const meta = logsResponse?.meta;

  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onResetFilters = () => {
    setPage(1);
    setLimit(20);
    setSearch("");
    setSelectedSource("ALL");
    setSelectedReason("ALL");
    setSelectedResolved("ALL");
    setSelectedOrgId("ALL");
    setDateRange(undefined);
    setStartDate("");
    setEndDate("");
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-4">
      <PaymentFailedLogsStats />

      <PaymentFailedLogsFilters
        search={search}
        onSearchChange={(value: string) => {
          setPage(1);
          setSearch(value);
        }}
        selectedSource={selectedSource}
        onSourceChange={(value: PaymentFailureSource | "ALL") => {
          setPage(1);
          setSelectedSource(value);
        }}
        selectedReason={selectedReason}
        onReasonChange={(value: PaymentFailureReason | "ALL") => {
          setPage(1);
          setSelectedReason(value);
        }}
        selectedResolved={selectedResolved}
        onResolvedChange={(value: "ALL" | "true" | "false") => {
          setPage(1);
          setSelectedResolved(value);
        }}
        selectedOrgId={selectedOrgId}
        onOrgChange={(value: string) => {
          setPage(1);
          setSelectedOrgId(value);
        }}
        dateRange={dateRange}
        onDateRangeChange={(range: DateRange | undefined) => {
          setPage(1);
          setDateRange(range);
        }}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onResetFilters={onResetFilters}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {total > 0 ? (
            <>
              Showing <span className="font-medium">{logs.length}</span> of{" "}
              <span className="font-medium">{total}</span> payment failures
            </>
          ) : (
            "No payment failures found"
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            className="h-7 border rounded px-2 bg-background text-sm"
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

      <PaymentFailedLogsTable logs={logs} loading={loading} />

      {totalPages > 1 && (
        <PaymentFailedLogsPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />
      )}
    </div>
  );
};
