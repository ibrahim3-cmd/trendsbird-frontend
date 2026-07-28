// pages/support/TransferDetailsModal.tsx
import React from "react";
import {
  ArrowRightLeft,
  User,
  Calendar,
  FileText,
  Loader2,
  // X,
} from "lucide-react";
import { useCancelTicketTransferMutation } from "@/redux/features/support/supportApiSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TransferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onSuccess: () => void;
}

const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) => {
  const [cancelTransfer, { isLoading }] = useCancelTicketTransferMutation();

  // console.log(ticket)

  if (!ticket || !ticket.transferRequest) return null;

  const { transferRequest } = ticket;
  const { requestedBy, toAgent, reason, requestedAt, status, actionReason } =
    transferRequest;

  const getStatusBadgeStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelTransfer({ id: ticket._id }).unwrap();
      toast.success("Transfer request cancelled successfully");
      onSuccess();
      onClose(); // Close the modal after successful cancellation
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to cancel transfer request"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Transfer Request Details
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {status === "Rejected"
                  ? "This transfer request was rejected by an admin"
                  : status === "Cancelled"
                  ? "This transfer request was cancelled"
                  : "Review the details of this transfer request"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border",
                getStatusBadgeStyle()
              )}
            >
              Status: {status || "Pending"}
            </span>
          </div>

          {/* Transfer Details */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
            {/* Requested By */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Requested By
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {requestedBy?.name}
                </p>
                <p className="text-xs text-gray-500">{requestedBy?.email}</p>
              </div>
            </div>

            {/* Transfer To */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Transfer To
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {toAgent?.name}
                </p>
                <p className="text-xs text-gray-500">{toAgent?.email}</p>
              </div>
            </div>

            {/* Requested Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Requested Date
                </p>
                <p className="text-sm text-gray-900">
                  {requestedAt
                    ? new Date(requestedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Reason for Transfer
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600 italic">
              "{reason || "No reason provided"}"
            </div>
          </div>

          {/* Rejection Reason */}
          {status === "Rejected" && actionReason && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-red-700">
                  Rejection Reason
                </span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 italic">
                "{actionReason}"
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {status === "Pending" && (
              <Button
                variant="destructive"
                onClick={handleCancelRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Request"
                )}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDetailsModal;