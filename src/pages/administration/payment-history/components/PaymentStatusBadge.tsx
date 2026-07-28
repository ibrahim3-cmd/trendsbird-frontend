// payments/components/PaymentStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment.type";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return {
          label: "Success",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case PaymentStatus.PENDING:
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case PaymentStatus.FAILED:
        return {
          label: "Failed",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      case PaymentStatus.REFUNDED:
        return {
          label: "Refunded",
          className: "bg-purple-100 text-purple-800 border-purple-200",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium capitalize", config.className)}
    >
      {config.label}
    </Badge>
  );
};