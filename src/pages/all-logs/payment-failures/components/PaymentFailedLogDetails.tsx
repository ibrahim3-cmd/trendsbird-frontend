import { IPaymentFailedLog } from "@/types/paymentFailedLog.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { useUpdatePaymentFailedLogMutation } from "@/redux/features/paymentFailedLog/paymentFailedLogApiSlice";
import { toast } from "sonner";
import { 
  AlertCircle, 
  CheckCircle,
  User, 
  Building, 
  CreditCard,
  FileText,
  Calendar,
} from "lucide-react";

interface PaymentFailedLogDetailsProps {
  log: IPaymentFailedLog;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentFailedLogDetails: React.FC<PaymentFailedLogDetailsProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState(log.resolutionNotes || "");
  const [isResolving, setIsResolving] = useState(false);
  const [updatePaymentFailedLog] = useUpdatePaymentFailedLogMutation();

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatSource = (source: string) => {
    return source.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
  };

  const formatReason = (reason: string) => {
    return reason.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
  };

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      await updatePaymentFailedLog({
        id: log._id,
        data: {
          isResolved: true,
          resolutionNotes: resolutionNotes || undefined,
        },
      }).unwrap();
      toast.success("Payment failure marked as resolved");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resolve payment failure");
    } finally {
      setIsResolving(false);
    }
  };

  const handleUnresolve = async () => {
    setIsResolving(true);
    try {
      await updatePaymentFailedLog({
        id: log._id,
        data: {
          isResolved: false,
        },
      }).unwrap();
      toast.success("Payment failure marked as unresolved");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment failure");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payment Failure Details</span>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {log.isResolved ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-600">Resolved</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-600">Unresolved</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-lg font-bold">
              {formatCurrency(log.amount, log.currency)}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              icon={<FileText className="h-4 w-4" />}
              label="Source"
              value={<Badge>{formatSource(log.source)}</Badge>}
            />
            <InfoCard
              icon={<AlertCircle className="h-4 w-4" />}
              label="Failure Reason"
              value={<Badge variant="destructive">{formatReason(log.failureReason)}</Badge>}
            />
            <InfoCard
              icon={<Building className="h-4 w-4" />}
              label="Organization"
              value={
                <div>
                  <div className="font-medium">{log.org?.orgName || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{log.org?.orgEmail}</div>
                </div>
              }
            />
            {log.user && (
              <InfoCard
                icon={<User className="h-4 w-4" />}
                label="User"
                value={
                  <div>
                    <div className="font-medium">{log.user.name}</div>
                    <div className="text-xs text-muted-foreground">{log.user.email}</div>
                  </div>
                }
              />
            )}
            {log.paymentMethodId && (
              <InfoCard
                icon={<CreditCard className="h-4 w-4" />}
                label="Payment Method"
                value={<span className="font-mono text-xs">{log.paymentMethodId}</span>}
              />
            )}
            {log.transactionId && (
              <InfoCard
                icon={<FileText className="h-4 w-4" />}
                label="Transaction ID"
                value={<span className="font-mono text-xs">{log.transactionId}</span>}
              />
            )}
            <InfoCard
              icon={<Calendar className="h-4 w-4" />}
              label="Failed At"
              value={formatDateTime(log.createdAt)}
            />
            {log.attemptCount && (
              <InfoCard
                icon={<AlertCircle className="h-4 w-4" />}
                label="Attempt Count"
                value={log.attemptCount}
              />
            )}
          </div>

          {/* Error Details */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Error Details
            </h4>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-900">{log.errorDetails}</p>
              {log.stripeErrorCode && (
                <p className="text-xs text-red-700 mt-2">
                  <strong>Stripe Error Code:</strong> {log.stripeErrorCode}
                </p>
              )}
              {log.stripeErrorMessage && (
                <p className="text-xs text-red-700 mt-1">
                  <strong>Stripe Message:</strong> {log.stripeErrorMessage}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Additional Information</h4>
              <div className="p-4 bg-muted/50 rounded-md space-y-1">
                {Object.entries(log.metadata).map(([key, value]) => (
                  <div key={key} className="text-sm flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Section */}
          {log.isResolved && log.resolvedBy && (
            <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-semibold text-green-900">Resolution Details</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Resolved by:</strong> {log.resolvedBy.name} ({log.resolvedBy.email})
                </p>
                <p>
                  <strong>Resolved at:</strong> {log.resolvedAt && formatDateTime(log.resolvedAt)}
                </p>
                {log.resolutionNotes && (
                  <p>
                    <strong>Notes:</strong> {log.resolutionNotes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Resolution Actions */}
          {!log.isResolved && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add notes about how this was resolved..."
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {log.isResolved ? (
              <Button
                variant="outline"
                onClick={handleUnresolve}
                disabled={isResolving}
              >
                {isResolving ? "Updating..." : "Mark as Unresolved"}
              </Button>
            ) : (
              <Button onClick={handleResolve} disabled={isResolving}>
                {isResolving ? "Resolving..." : "Mark as Resolved"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="p-3 bg-muted/50 rounded-md">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
      {icon}
      {label}
    </div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);
