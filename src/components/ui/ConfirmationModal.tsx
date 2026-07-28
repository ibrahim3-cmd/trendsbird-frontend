import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export type ConfirmationVariant = "default" | "destructive" | "warning" | "success";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const variantStyles = {
  default: {
    icon: Info,
    iconColor: "text-blue-600",
    confirmButton: "default" as const,
  },
  destructive: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    confirmButton: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    confirmButton: "default" as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    confirmButton: "default" as const,
  },
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { icon: Icon, iconColor } = variantStyles[variant];

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </DialogDescription>

        <DialogFooter className="flex gap-2 mt-6">
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
