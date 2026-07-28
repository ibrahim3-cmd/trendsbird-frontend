// components/modals/AdminTransferActionModal.tsx
import React, { useState } from 'react';
import {
  User,
  Calendar,
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRightLeft,
  MessageSquare,
  X,
} from 'lucide-react';
import { useManageTicketTransferMutation } from '@/redux/features/support/supportApiSlice';
import { toast } from 'sonner';


// Types
import { TicketType } from "@/types/support.type";

interface AdminTransferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketType | null;
  onSuccess?: () => void;
}

const AdminTransferActionModal: React.FC<AdminTransferActionModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) => {
  const [note, setNote] = useState('');
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null);
  const [manageTransfer, { isLoading }] = useManageTicketTransferMutation();

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!ticket) return;

    try {
      setProcessingAction(action);
      await manageTransfer({
        id: ticket._id,
        action,
        reason: note,
      }).unwrap();

      toast.success(
        `Transfer request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
      );
      setNote('');
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as Error & { data?: { message?: string } };
      toast.error(
        `Failed to ${action} transfer request: ${err?.data?.message || 'Unknown error'}`
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNote('');
      setProcessingAction(null);
      onClose();
    }
  };

  if (!isOpen || !ticket || !ticket.transferRequest) return null;

  const { transferRequest } = ticket;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ArrowRightLeft className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transfer Request Action</h2>
              <p className="text-sm text-gray-600">Review and manage the transfer request</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Warning Badge */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This ticket has a pending transfer request. As an admin, you can
                  approve or reject this request.
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Ticket Information
            </h4>
            <div className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</div>
            <p className="text-xs text-gray-600 line-clamp-2">{ticket.description}</p>
          </div>

          {/* Transfer Details Grid */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" /> Request Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center mb-1.5">
                  <User className="w-3 h-3 mr-1.5" /> From Agent (Current)
                </label>
                <div className="text-sm font-medium text-gray-900 bg-white p-2 rounded border border-gray-200">
                  {ticket.assignedTo?.firstName} {ticket.assignedTo?.lastName}
                  <div className="text-xs text-gray-500 font-normal">
                    Requested by: {transferRequest.requestedBy?.email}{' '}
                    {/* {transferRequest.requestedBy?.lastName} */}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center mb-1.5">
                  <User className="w-3 h-3 mr-1.5" /> To Agent (Target)
                </label>
                <div className="text-sm font-medium text-gray-900 bg-white p-2 rounded border border-amber-200 bg-amber-50">
                  {transferRequest.toAgent?.firstName} {transferRequest.toAgent?.lastName}
                  <div className="text-xs text-gray-500 font-normal">
                    {transferRequest.toAgent?.email}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center mb-1.5">
                  <Calendar className="w-3 h-3 mr-1.5" /> Requested Date
                </label>
                <div className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                  {transferRequest.requestedAt
                    ? new Date(transferRequest.requestedAt).toLocaleString()
                    : 'N/A'}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center mb-1.5">
                  <ClipboardList className="w-3 h-3 mr-1.5" /> Transfer Reason
                </label>
                <div className="text-sm text-gray-700 leading-relaxed italic bg-white p-3 rounded border border-gray-200 min-h-[60px]">
                  "{transferRequest.reason || 'No reason provided.'}"
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Note{' '}
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              rows={3}
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-2 border-gray-300 rounded-md p-3"
              placeholder="Add a note for your action (visible to agent)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleAction('reject')}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading && processingAction === 'reject' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Reject Transfer
          </button>
          <button
            type="button"
            onClick={() => handleAction('approve')}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200 shadow-sm"
          >
            {isLoading && processingAction === 'approve' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Approve Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransferActionModal;