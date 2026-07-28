// components/email-logs/EmailLogsPage.tsx
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  useGetEmailLogsQuery,
  useRetryFailedEmailMutation,
} from "@/redux/features/emailLog/emailLogApiSlice";
//import { PageHeader } from "@/components/ui/PageHeader";
import { EmailLogsFilters } from "./components/EmailLogsFilters";
import { EmailLogsTable } from "./components/EmailLogsTable";
import { EmailLogsPagination } from "./components/EmailLogsPagination";
import { ResultsSummary } from "./components/ResultsSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice"; // Add this import

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// Add email type enum
type EmailType = "ALL" | "system" | "regular";

const EmailLogsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [emailType, setEmailType] = useState<EmailType>("ALL");

  const debouncedSearch = useDebounced(search);

  const { data: userData } = useUserInfoQuery(undefined);
  
  // Fetch organizations data for SuperAdmin
  const { data: allOrgs } = useGetAllOrgQuery(
    {
      page: 1,
      limit: 99999999,
    },
    {
      skip: userData?.data?.role !== "SUPER_ADMIN", // Only fetch if user is SuperAdmin
    }
  );

  // Check if user is super admin
  const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";

  // Proper query structure with "ALL" handling
  const queryArgs = useMemo(() => {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    // Add search if it's not empty
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    // Only add status if it's not "ALL"
    if (selectedStatus !== "ALL") {
      params.status = selectedStatus;
    }

    // Only add provider if it's not "ALL"
    if (selectedProvider !== "ALL") {
      params.provider = selectedProvider;
    }

    // Only add orgId if it's not "ALL"
    if (selectedOrgId !== "ALL") {
      params.orgId = selectedOrgId;
    }

    // Only add emailType if it's not "ALL" and user is super admin
    if (emailType !== "ALL" && isSuperAdmin) {
      params.emailType = emailType;
    }

    // Add date range if selected
    if (dateRange?.from) {
      params.startDate = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      params.endDate = format(dateRange.to, "yyyy-MM-dd");
    }

    return params;
  }, [
    page,
    limit,
    debouncedSearch,
    selectedStatus,
    selectedProvider,
    selectedOrgId,
    dateRange,
    emailType,
    isSuperAdmin,
  ]);

  const {
    data: emailLogsResponse,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetEmailLogsQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const [retryFailedEmail] = useRetryFailedEmailMutation();

  // Debug logging
  useEffect(() => {
    console.log("Query Args:", queryArgs);
    console.log("API Response:", emailLogsResponse);
    if (error) {
      console.log("API Error:", error);
    }
  }, [queryArgs, emailLogsResponse, error]);

  // Extract data from response
  const emailLogs =
    emailLogsResponse?.data?.data || emailLogsResponse?.data || [];
  const meta = emailLogsResponse?.data?.meta || emailLogsResponse?.meta;

  const total = meta?.total ?? 0;
  const totalPages =
    meta?.totalPage ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onResetFilters = () => {
    setPage(1);
    setLimit(20);
    setSearch("");
    setSelectedStatus("ALL");
    setSelectedProvider("ALL");
    setSelectedOrgId("ALL");
    setDateRange(undefined);
    setEmailType("ALL");
  };

  const handleRetryFailed = async (logId: string) => {
    try {
      await retryFailedEmail(logId).unwrap();
      toast.success("Email has been queued for retry");
    } catch (error) {
      toast.error("Failed to retry email");
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing email logs...");
  };

  const handleEmailTypeChange = (value: string) => {
    setPage(1);
    setEmailType(value as EmailType);
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Email Logs"
        icon={Mail}
        description="Monitor email delivery, opens, clicks, and bounces"
      /> */}

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">Email Activity</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Email Type Tabs - Only show for Super Admin */}
            {isSuperAdmin && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Email Type:
                </span>
                <Tabs
                  value={emailType}
                  onValueChange={handleEmailTypeChange}
                  className="w-auto"
                >
                  <TabsList className="grid w-auto grid-cols-3">
                    <TabsTrigger value="ALL">All Emails</TabsTrigger>
                    <TabsTrigger value="system">System Emails</TabsTrigger>
                    <TabsTrigger value="regular">Regular Emails</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <EmailLogsFilters
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
            selectedProvider={selectedProvider}
            onProviderChange={(value) => {
              setPage(1);
              setSelectedProvider(value);
            }}
            selectedOrgId={selectedOrgId}
            onOrgChange={(value) => {
              setPage(1);
              setSelectedOrgId(value);
            }}
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              setPage(1);
              setDateRange(range);
            }}
            onResetFilters={onResetFilters}
            showOrgFilter={isSuperAdmin}
          />

          <ResultsSummary
            total={total}
            currentCount={emailLogs.length}
            limit={limit}
            onLimitChange={(newLimit) => {
              setPage(1);
              setLimit(newLimit);
            }}
          />

          <EmailLogsTable
            logs={emailLogs}
            loading={loading}
            onRetry={handleRetryFailed}
            isSuperAdmin={isSuperAdmin} // Use isSuperAdmin variable instead of userRole
            organizations={allOrgs?.data || []} // Use the fetched organizations data
          />

          {totalPages > 1 && (
            <EmailLogsPagination
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

export default EmailLogsPage;