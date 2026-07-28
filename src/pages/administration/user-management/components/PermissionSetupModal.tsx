import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';
import { IUser } from '@/types';

interface PermissionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: IUser | null;
}

const PermissionSetupModal: React.FC<PermissionSetupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Setup User Permissions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              User Created Successfully!
            </h3>
            <p className="text-muted-foreground text-sm">
              Would you like to set up permissions and feature access for{' '}
              <span className="font-medium text-foreground">{user?.name}</span>?
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              You can configure which features and actions this user can access,
              including specific permissions for different parts of the application.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Skip for Now
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Setup Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionSetupModal;