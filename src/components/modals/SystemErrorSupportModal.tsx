
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { setErrorCallback } from "@/lib/errorHandler";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export function SystemErrorSupportModal() {
  const [open, setOpen] = useState(false);
  const { data: userInfo } = useUserInfoQuery(undefined);
  const userRole = userInfo?.data?.role;

  useEffect(() => {
    setErrorCallback(() => {
      const pathname = window.location.pathname;
      
      const isBlockedRoute = pathname === '/support-tickets' || 
        pathname === '/support-ticket/public';
      
      if (userRole !== "SUPER_ADMIN" && userRole !== "SUPPORT_AGENT" && !isBlockedRoute) {
        setOpen(true);
      }
    });
  }, [userRole]);

  const handleCreateTicket = () => {
    const isPublicRoute = ['/login', '/register', '/forgot-password',].some(
      route => window.location.pathname.includes(route)
    );
    const ticketUrl = isPublicRoute ? '/support-ticket/public' : '/support-tickets';
    window.location.href = ticketUrl;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm bg-popover border-border p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-popover-foreground">
            <AlertCircle className="h-6 w-6 text-system-primary" />
            System Error
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected system error.  
            Please submit a support ticket so our team can assist you.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button 
            onClick={handleCreateTicket}
            className="bg-system-primary hover:bg-system-primary/90 text-system-primary-text"
          >
            Create Support Ticket
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
