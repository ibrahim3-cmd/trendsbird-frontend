import { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
//import { Activity } from "lucide-react";
import { useGetLogsQuery, useGetAllActionTypesQuery } from "@/redux/features/log/logApiSlice";
import { LogQuery } from "@/types/log.type";
//import { PageHeader } from "@/components/ui/PageHeader";
import { LogsFilters } from "./components/LogsFilters";
import { LogsTable } from "./components/LogsTable";
import { LogsPagination } from "./components/LogsPagination";
import { ResultsSummary } from "./components/ResultsSummary";

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const LogsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const debouncedSearch = useDebounced(search);
  const debouncedUserSearch = useDebounced(selectedUser);

  const queryArgs: LogQuery = useMemo(
    () => {
      const args: LogQuery = {
        page,
        limit,
        search: debouncedSearch,
        user: debouncedUserSearch || undefined,
        orgId: selectedOrgId !== "ALL" ? selectedOrgId : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      
      if (selectedAction !== "ALL") {
        args.action = selectedAction;
      }
      
      if (startDate) {
        args.startDate = startDate;
      }
      
      if (endDate) {
        args.endDate = endDate;
      }
      
      return args;
    },
    [page, limit, debouncedSearch, debouncedUserSearch, selectedAction, startDate, endDate, selectedOrgId]
  );

  const { data: logsResponse, isLoading, isFetching } = useGetLogsQuery(queryArgs);
  const { data: actionTypesResponse } = useGetAllActionTypesQuery();

  // Extract data from the new response structure with proper defensive checks
  const logs = Array.isArray(logsResponse?.data) ? logsResponse.data : [];
  const meta = logsResponse?.meta;
  const actionTypes = Array.isArray(actionTypesResponse?.data) ? actionTypesResponse.data : [];
  
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onResetFilters = () => {
    setPage(1);
    setLimit(20);
    setSearch("");
    setSelectedAction("ALL");
    setSelectedUser("");
    setDateRange(undefined);
    setStartDate("");
    setEndDate("");
    setSelectedOrgId("ALL");
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="System Logs"
        icon={Activity}
        description="Monitor user activities and system events"
      /> */}

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">Activity Logs</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogsFilters
            onOrgChange={(value) => {
              setPage(1);
              setSelectedOrgId(value);
            }}
            selectedOrgId={selectedOrgId}
            showFilters={true}
            logs={logs}
            search={search}
            onSearchChange={(value) => {
              setPage(1);
              setSearch(value);
            }}
            selectedAction={selectedAction}
            onActionChange={(value) => {
              setPage(1);
              setSelectedAction(value);
            }}
            selectedUser={selectedUser}
            onUserChange={(value) => {
              setPage(1);
              setSelectedUser(value);
            }}
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              setPage(1);
              setDateRange(range);
            }}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            actionTypes={actionTypes}
            onResetFilters={onResetFilters}
          />

          <ResultsSummary
            total={total}
            currentCount={logs.length}
            limit={limit}
            onLimitChange={(newLimit) => {
              setPage(1);
              setLimit(newLimit);
            }}
          />

          <LogsTable logs={logs} loading={loading} />

          {totalPages > 1 && (
            <LogsPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;