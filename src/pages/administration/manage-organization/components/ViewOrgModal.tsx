import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Mail, Phone, MapPin,  User } from 'lucide-react';
import { useGetSingleOrgQuery } from '@/redux/features/org/orgApiSlice';
import { cn } from '@/lib/utils';

interface ViewOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string | null;
}

const statusColor = (s: string) =>
  s === "ACTIVE" || s === "active"
    ? "bg-green-100 text-green-700"
    : s === "PENDING" || s === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "BLOCKED" || s === "blocked" || s === "INACTIVE" || s === "inactive"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";

const StatusBadge = ({ value }: { value: string }) => (
  <Badge
    className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      statusColor(value)
    )}
  >
    {value}
  </Badge>
);

const ViewOrgModal: React.FC<ViewOrgModalProps> = ({
  isOpen,
  onClose,
  orgId
}) => {
  const { data: orgData, isLoading } = useGetSingleOrgQuery(orgId!, {
    skip: !orgId
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!orgData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
            <p className="text-muted-foreground">Failed to load organization data</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Organization Name</span>
                <span className="text-sm font-semibold text-right">{orgData.orgName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </span>
                <span className="text-sm font-medium text-right">{orgData.orgEmail || "—"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </span>
                <span className="text-sm font-medium text-right">{orgData.orgPhone || "—"}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <div>
                  <StatusBadge value={orgData.status || 'Unknown'} />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Address Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-sm font-medium text-right">{orgData.orgAddress?.address || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Street</span>
                <span className="text-sm font-medium text-right">{orgData.orgAddress?.street || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">City</span>
                <span className="text-sm font-medium text-right">{orgData.orgAddress?.city || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">State</span>
                <span className="text-sm font-medium text-right">{orgData.orgAddress?.state || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">ZIP Code</span>
                <span className="text-sm font-medium text-right">{orgData.orgAddress?.zip || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Plan Information</h3>
            </div>
            {orgData.plan ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Plan Name</span>
                  <span className="text-sm font-medium text-right">{orgData.plan.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Slug</span>
                  <span className="text-sm font-medium text-right">{orgData.plan.slug}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium text-right">{orgData.plan.durationValue} {orgData.plan.durationUnit}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium text-right">${orgData.plan.price}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No plan information available</p>
            )}
          </div>


        </div>

        {/* Actions */}
        <div className="flex justify-end pt-6 border-t border-border/50">
          <Button onClick={onClose} variant="outline" className="min-w-[100px]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrgModal;