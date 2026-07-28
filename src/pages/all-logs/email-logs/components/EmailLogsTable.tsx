// components/email-logs/components/EmailLogsTable.tsx
import { IEmailLog } from "@/types/email.type";
import { Mail, User, Eye, RotateCcw, Building } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmailLogDetails } from "./EmailLogDetails";

interface EmailLogsTableProps {
  logs: IEmailLog[];
  loading: boolean;
  onRetry: (logId: string) => void;
  onView?: (log: IEmailLog) => void;
  isSuperAdmin?: boolean;
  organizations?: Array<{ _id: string; orgName: string }>;
}

export const EmailLogsTable: React.FC<EmailLogsTableProps> = ({
  logs,
  loading,
  onRetry,
  onView,
  isSuperAdmin = false,
  organizations = [],
}) => {
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());
  const [selectedLog, setSelectedLog] = useState<IEmailLog | null>(null);

  const handleRetry = async (logId: string) => {
    setRetryingIds((prev) => new Set(prev).add(logId));
    try {
      await onRetry(logId);
    } finally {
      setRetryingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(logId);
        return newSet;
      });
    }
  };

  const handleView = (log: IEmailLog) => {
    if (onView) {
      onView(log);
    } else {
      setSelectedLog(log);
    }
  };

  const getOrganizationName = (orgId: string) => {
    if (orgId === "000000000000000000000000") {
      return "System";
    }
    const org = organizations.find((org) => org._id === orgId);
    return org ? org.orgName : orgId.substring(0, 8) + "...";
  };

  if (loading) {
    return <EmailLogsTableSkeleton isSuperAdmin={isSuperAdmin} />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Recipient</th>
                <th className="py-3 px-4 font-medium">Subject</th>
                {isSuperAdmin && (
                  <th className="py-3 px-4 font-medium">Organization</th>
                )}
                <th className="py-3 px-4 font-medium">Provider</th>
                <th className="py-3 px-4 font-medium text-right">Sent</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <EmailLogTableRow
                  key={log._id}
                  log={log}
                  onRetry={handleRetry}
                  onView={handleView}
                  isRetrying={retryingIds.has(log._id)}
                  isSuperAdmin={isSuperAdmin}
                  getOrganizationName={getOrganizationName}
                />
              ))}

              {logs.length === 0 && (
                <tr className="border-t">
                  <td
                    className="py-8 px-4 text-center text-muted-foreground"
                    colSpan={isSuperAdmin ? 7 : 6}
                  >
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <EmailLogDetails
          log={selectedLog}
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          organizations={organizations}
        />
      )}
    </>
  );
};

const EmailLogTableRow: React.FC<{
  log: IEmailLog;
  onRetry: (logId: string) => void;
  onView: (log: IEmailLog) => void;
  isRetrying: boolean;
  isSuperAdmin: boolean;
  getOrganizationName: (orgId: string) => string;
}> = ({
  log,
  onRetry,
  onView,
  isRetrying,
  isSuperAdmin,
  getOrganizationName,
}) => {
  // Format recipient with truncation
  const formatRecipient = (recipients: string[]) => {
    if (!recipients || recipients.length === 0) return "Unknown";

    const primaryRecipient = recipients[0];
    // Truncate long email addresses
    const truncatedRecipient =
      primaryRecipient.length > 25
        ? primaryRecipient.substring(0, 22) + "..."
        : primaryRecipient;

    return (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0">
          <div
            className="font-medium text-foreground truncate"
            title={primaryRecipient}
          >
            {truncatedRecipient}
          </div>
          {recipients.length > 1 && (
            <div className="text-xs text-muted-foreground">
              +{recipients.length - 1} more
            </div>
          )}
        </div>
      </div>
    );
  };

  // Format subject with more aggressive truncation
  const formatSubject = (subject: string) => {
    if (!subject) return "No subject";
    
    // More aggressive truncation - show only first 40 characters
    const truncatedSubject = subject.length > 40 
      ? subject.substring(0, 37) + "..." 
      : subject;

    return (
      <div className="min-w-0">
        <p
          className="text-sm text-foreground font-medium break-words truncate"
          title={subject} // Show full subject on hover
        >
          {truncatedSubject}
        </p>
        {log.metadata?.templateName && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            Template: {log.metadata.templateName}
          </p>
        )}
      </div>
    );
  };

  return (
    <tr className="border-t hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4">
        <StatusBadge status={log.status} />
      </td>
      <td className="py-3 px-4 max-w-[180px]">{formatRecipient(log.to)}</td>
      <td className="py-3 px-4 max-w-[220px]"> {/* Reduced max width for subject */}
        {formatSubject(log.subject)}
      </td>
      {/* Organization Cell - Only for SuperAdmin */}
      {isSuperAdmin && (
        <td className="py-3 px-4 max-w-[120px]"> {/* Reduced org column width */}
          <div className="flex items-center gap-2">
            <Building className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span
              className="text-sm text-muted-foreground truncate"
              title={getOrganizationName(log.orgId)}
            >
              {getOrganizationName(log.orgId)}
            </span>
          </div>
        </td>
      )}
      <td className="py-3 px-4 max-w-[100px]"> {/* Added max width for provider */}
        <div className="text-sm capitalize text-muted-foreground truncate">
          {log.provider?.toLowerCase()}
        </div>
      </td>
      <td className="py-3 px-4 text-right max-w-[140px]"> {/* Added max width for date */}
        <div className="text-xs text-muted-foreground">
          {formatDateTime(log.sentAt || log.createdAt)}
        </div>
        {log.openedAt && (
          <div className="text-xs text-muted-foreground">
            Opened: {formatDateTime(log.openedAt)}
          </div>
        )}
      </td>
      <td className="py-3 px-4 max-w-[120px]"> {/* Added max width for actions */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(log)}
            title="View email details and content"
            className="h-8 px-2" // Smaller button
          >
            <Eye className="h-3 w-3" />
          </Button>
          {log.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(log._id)}
              disabled={isRetrying}
              title="Retry sending this email"
              className="h-8 px-2" // Smaller button
            >
              <RotateCcw
                className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

const EmailLogsTableSkeleton: React.FC<{ isSuperAdmin: boolean }> = ({
  isSuperAdmin,
}) => {
  const colCount = isSuperAdmin ? 7 : 6;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Recipient</th>
              <th className="py-3 px-4 font-medium">Subject</th>
              {isSuperAdmin && (
                <th className="py-3 px-4 font-medium">Organization</th>
              )}
              <th className="py-3 px-4 font-medium">Provider</th>
              <th className="py-3 px-4 font-medium text-right">Sent</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`} className="border-t">
                {Array.from({ length: colCount }).map((__, j) => (
                  <td key={`sk-${i}-${j}`} className="py-3 px-4">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center gap-2">
    <Mail className="h-8 w-8 opacity-50" />
    <p>No email logs found matching your criteria</p>
  </div>
);