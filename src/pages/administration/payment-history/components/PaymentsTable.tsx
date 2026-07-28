// payments/components/PaymentsTable.tsx
import { IPayment } from "@/types/payment.type";
import { Eye, Building, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentsTableProps {
  payments: IPayment[];
  loading: boolean;
  onViewDetails: (payment: IPayment) => void;
  onDeletePayment: (payment: IPayment) => void;
  onDownloadInvoice: (payment: IPayment) => void;
  showOrgColumn: boolean;
}

// Helper function to extract type from description
const getTypeFromDescription = (description?: string): string => {
  if (!description) return "Unknown";
  
  const firstWord = description.split(" ")[0];
  return firstWord || "Unknown";
};

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  loading,
  onViewDetails,
  onDownloadInvoice,
  showOrgColumn,
}) => {
  if (loading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="py-3 px-4 font-medium">Transaction ID</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Description</th>
                {showOrgColumn && <th className="py-3 px-4 font-medium">Organization</th>}
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t">
                  {Array.from({ length: showOrgColumn ? 7 : 6 }).map((__, j) => (
                    <td key={`sk-${i}-${j}`} className="py-3 px-4">
                      <Skeleton className="h-4 bg-muted rounded" />
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
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="py-3 px-4 font-medium">Transaction ID</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Description</th>
              {showOrgColumn && <th className="py-3 px-4 font-medium">Organization</th>}
              <th className="py-3 px-4 font-medium">Amount</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const paymentType = getTypeFromDescription(payment.description);
              
              return (
                <tr key={payment._id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono text-sm font-medium">
                      {payment?.transactionId?.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {paymentType}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {payment.description || "N/A"}
                    </div>
                  </td>
                  {showOrgColumn && (
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{payment?.org?.orgName}</p>
                          <p className="text-xs text-muted-foreground">{payment?.org?.orgEmail}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="text-sm font-semibold">
                      ${payment?.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <PaymentStatusBadge status={payment?.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(payment?.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadInvoice(payment)}
                        className="h-8 w-8 p-0"
                        title="Download Invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(payment)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};