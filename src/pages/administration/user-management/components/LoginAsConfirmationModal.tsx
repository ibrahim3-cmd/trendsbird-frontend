import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { IUser } from "@/types";

interface LoginAsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: IUser | null;
  isLoading?: boolean;
}

const LoginAsConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}: LoginAsConfirmationModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Confirm Login
            </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-6">
              <LogIn className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">
              Login as {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              You are about to login as{" "}
              <span className="font-semibold text-foreground">
                {user.name}
              </span>
              <br />
              <span className="text-xs">({user.email})</span>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              This will switch your current session to this user's account. You
              can switch back to your admin account later.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 flex items-center gap-2"
              disabled={isLoading}
            >
              <LogIn className="h-4 w-4" />
              {isLoading ? "Logging in..." : "Confirm Login"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginAsConfirmationModal;
