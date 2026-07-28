// payments/components/PaymentDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPayment } from "@/types/payment.type";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Building, FileText, CreditCard, DollarSign } from "lucide-react";

interface PaymentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  payment: IPayment | null;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  open,
  onClose,
  payment,
}) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Payment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="font-mono text-sm">{payment.transactionId}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Invoice ID</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="font-mono text-sm">{payment.invoiceId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <PaymentStatusBadge status={payment.status} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-lg font-semibold text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Organization
            </h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{payment.org.orgName}</p>
                  <p className="text-sm text-gray-600">{payment.org.orgEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Plan Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Plan Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900">{payment.plan.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Plan Price</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900 font-semibold">
                    ${payment.plan.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};