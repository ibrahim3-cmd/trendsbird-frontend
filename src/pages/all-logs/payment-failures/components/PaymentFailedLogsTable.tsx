import { IPaymentFailedLog } from "@/types/paymentFailedLog.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { PaymentFailedLogDetails } from "./PaymentFailedLogDetails";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";

interface PaymentFailedLogsTableProps {
  logs: IPaymentFailedLog[];
  loading: boolean;
}

export const PaymentFailedLogsTable: React.FC<PaymentFailedLogsTableProps> = ({
  logs,
  loading,
}) => {
  const [selectedLog, setSelectedLog] = useState<IPaymentFailedLog | null>(null);
  const { data: userData } = useUserInfoQuery(undefined);
  const userRole = userData?.data?.role as string | undefined;
  const isSuperAdmin = userRole === role.superAdmin;

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      PLAN_PURCHASE: "bg-blue-100 text-blue-800",
      PLAN_CHANGE: "bg-purple-100 text-purple-800",
      SUBSCRIPTION_RENEWAL: "bg-green-100 text-green-800",
      CREDIT_PURCHASE: "bg-yellow-100 text-yellow-800",
      JOB_PAYMENT: "bg-orange-100 text-orange-800",
      INVOICE_PAYMENT: "bg-pink-100 text-pink-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[source] || "bg-gray-100 text-gray-800";
  };

  const getReasonBadgeColor = (reason: string) => {
    const colors: Record<string, string> = {
      CARD_DECLINED: "bg-red-100 text-red-800",
      INSUFFICIENT_FUNDS: "bg-red-100 text-red-800",
      EXPIRED_CARD: "bg-orange-100 text-orange-800",
      INVALID_CARD: "bg-orange-100 text-orange-800",
      AUTHENTICATION_FAILED: "bg-yellow-100 text-yellow-800",
      PROCESSING_ERROR: "bg-purple-100 text-purple-800",
      FRAUD_DETECTED: "bg-red-100 text-red-800",
      NETWORK_ERROR: "bg-blue-100 text-blue-800",
      GATEWAY_ERROR: "bg-purple-100 text-purple-800",
      UNKNOWN: "bg-gray-100 text-gray-800",
    };
    return colors[reason] || "bg-gray-100 text-gray-800";
  };

  const formatSource = (source: string) => {
    return source.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
  };

  const formatReason = (reason: string) => {
    return reason.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                {isSuperAdmin && <th className="py-3 px-4 font-medium">Organization</th>}
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Reason</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Error</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t">
                  {Array.from({ length: isSuperAdmin ? 8 : 7 }).map((__, j) => (
                    <td key={`sk-${i}-${j}`} className="py-3 px-4">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                {isSuperAdmin && <th className="py-3 px-4 font-medium">Organization</th>}
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Reason</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Error</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-muted/30 transition-colors">
                  {isSuperAdmin && (
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium">{log.org?.orgName || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{log.org?.orgEmail}</div>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <Badge className={getSourceBadgeColor(log.source)}>
                      {formatSource(log.source)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getReasonBadgeColor(log.failureReason)}>
                      {formatReason(log.failureReason)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {log.isResolved ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unresolved
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-medium">
                      {formatCurrency(log.amount, log.currency)}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-sm truncate" title={log.errorDetails}>
                      {log.stripeErrorMessage || log.errorDetails}
                    </div>
                    {log.stripeErrorCode && (
                      <div className="text-xs text-muted-foreground">Code: {log.stripeErrorCode}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      title="View details"
                      className="h-8 px-2"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr className="border-t">
                  <td
                    className="py-8 px-4 text-center text-muted-foreground"
                    colSpan={isSuperAdmin ? 8 : 7}
                  >
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No payment failures found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <PaymentFailedLogDetails
          log={selectedLog}
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  );
};
