// pages/support/TransferTicketModal.tsx
import React, { useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { useRequestTicketTransferMutation } from "@/redux/features/support/supportApiSlice";
import { useGetAllSupportAgentsQuery } from "@/redux/features/user/user.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransferTicketModalProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TransferTicketModal: React.FC<TransferTicketModalProps> = ({
  isOpen,
  ticketId,
  onClose,
  onSuccess,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const { data: userData } = useUserInfoQuery(undefined);
  const user = userData?.data;

  const [requestTransfer, { isLoading: isSubmitting }] =
    useRequestTicketTransferMutation();

  // Fetch support agents
  const { data: agentsData, isLoading: agentsLoading } =
    useGetAllSupportAgentsQuery({
      page: 1,
      limit: 1000,
    });

  const agents = agentsData?.data || [];

  // Filter out current user
  const availableAgents = agents.filter(
    (agent: any) => agent.email !== user?.email
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAgent || !reason.trim()) {
      toast.error("Please select an agent and provide a reason.");
      return;
    }

    try {
      await requestTransfer({
        id: ticketId,
        toAgent: selectedAgent,
        reason: reason.trim(),
      }).unwrap();

      toast.success("Transfer request sent successfully");
      setReason("");
      setSelectedAgent("");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to request transfer");
    }
  };

  const handleClose = () => {
    setReason("");
    setSelectedAgent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Transfer Ticket</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Request to transfer this ticket to another support agent
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="agent" className="text-sm font-medium">
              Transfer To <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger id="agent" disabled={agentsLoading}>
                <SelectValue
                  placeholder={
                    agentsLoading ? "Loading agents..." : "Select an agent"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent: any) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    {agent.name} ({agent.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Transfer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Please explain why this ticket needs to be transferred..."
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedAgent || !reason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Transfer Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferTicketModal;