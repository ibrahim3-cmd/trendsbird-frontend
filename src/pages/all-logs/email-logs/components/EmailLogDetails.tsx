import { IEmailLog } from "@/types/email.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  User,
  FileText,
  ExternalLink,
  Shield,
  Building,
  Code,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

interface EmailLogDetailsProps {
  log: IEmailLog;
  isOpen: boolean;
  onClose: () => void;
  organizations?: Array<{ _id: string; orgName: string }>;
}

export const EmailLogDetails: React.FC<EmailLogDetailsProps> = ({
  log,
  isOpen,
  onClose,
  organizations = []
}) => {
  const getStatusConfig = (status: string) => {
    const config = {
      sent: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle2,
      },
      delivered: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      },
      opened: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CheckCircle2,
      },
      clicked: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: CheckCircle2,
      },
      failed: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
      bounced: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: AlertCircle,
      },
      scheduled: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
    };
    return (
      config[status as keyof typeof config] || {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Clock,
      }
    );
  };

  const getOrganizationName = (orgId: string) => {
    if (orgId === "000000000000000000000000") {
      return "System";
    }
    const org = organizations.find(org => org._id === orgId);
    return org ? org.orgName : orgId.substring(0, 8) + "...";
  };

  const statusConfig = getStatusConfig(log.status);
  const StatusIcon = statusConfig.icon;
  const isSystemEmail = log.metadata?.type === "system_email";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-[55vw] !max-w-[1600px] h-[90vh] !p-0 mb-5 overflow-hidden flex flex-col rounded-2xl shadow-2xl border border-gray-200"
        )}
      >
        {/* ─── Header ─── */}
        <DialogHeader className="flex flex-row items-center justify-between px-8 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Email Details
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {formatDateTime(log.sentAt || log.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mr-8"> {/* Added margin-right to create space from close button */}
            {isSystemEmail && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200 h-7" // Fixed height
              >
                <Shield className="h-3 w-3" />
                System Email
              </Badge>
            )}
            <Badge
              className={cn(
                "flex items-center gap-1 border font-medium px-3 h-7", // Fixed height to match system email badge
                statusConfig.color
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {log.status?.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        {/* ─── Body ─── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-8 p-8 auto-rows-min">
            {/* ─── Top Row: Left (Info) ─── */}
            <div className="col-span-8 flex flex-col">
              <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Information
                  </h3>
                </div>
                <div className="p-6 space-y-5 flex-1">
                  {/* From */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg mt-1">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        From
                      </label>
                      <p className="text-gray-900 font-medium break-all">
                        {log.from}
                      </p>
                    </div>
                  </div>
                  {/* To */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg mt-1">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        To
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {log.to?.map((recipient, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <p className="text-gray-900 text-sm break-all">
                              {recipient}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs ml-2 flex-shrink-0"
                            >
                              Primary
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* CC */}
                  {log.cc && log.cc.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-50 rounded-lg mt-1">
                        <User className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-500 block mb-1">
                          CC
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {log.cc.map((recipient, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <p className="text-gray-900 text-sm break-all">
                                {recipient}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-xs ml-2 flex-shrink-0 bg-yellow-50 text-yellow-700"
                              >
                                CC
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* BCC */}
                  {log.bcc && log.bcc.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg mt-1">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-500 block mb-1">
                          BCC
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {log.bcc.map((recipient, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <p className="text-gray-900 text-sm break-all">
                                {recipient}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-xs ml-2 flex-shrink-0 bg-gray-100 text-gray-700"
                              >
                                BCC
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Subject */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg mt-1">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Subject
                      </label>
                      <p className="text-gray-900 font-medium break-words">
                        {log.subject}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {log.errorMessage && (
                <div className="mt-6 bg-white border border-red-200 rounded-xl shadow-sm p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 text-sm font-medium flex-1 break-words">
                    {log.errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* ─── Top Row: Right (Metadata) ─── */}
            <div className="col-span-4 flex flex-col">
              <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Email Metadata
                  </h3>
                </div>
                <div className="p-5 space-y-5 flex-1">
                  {/* Provider */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                      Provider
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Code className="h-3 w-3 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900 capitalize">
                        {log.provider?.toLowerCase() || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Template */}
                  {log.metadata?.templateName && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Template
                      </label>
                      <Badge variant="secondary" className="font-normal">
                        {log.metadata.templateName}
                      </Badge>
                    </div>
                  )}

                  {/* Organization */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                      Organization
                    </label>
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 text-gray-400" />
                      <span 
                        className="text-sm text-gray-700 break-all"
                        title={getOrganizationName(log.orgId)}
                      >
                        {getOrganizationName(log.orgId)}
                      </span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">
                      Timestamps
                    </label>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-900 font-medium">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                      {log.sentAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sent:</span>
                          <span className="text-gray-900 font-medium">
                            {formatDateTime(log.sentAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {log.attachments && log.attachments.length > 0 && (
                <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Attachments ({log.attachments.length})
                    </h3>
                  </div>
                  <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                    {log.attachments.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-gray-900 truncate"
                            title={a.filename}
                          >
                            {a.filename}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {a.contentType}
                            {a.size && ` • ${(a.size / 1024).toFixed(1)} KB`}
                          </p>
                        </div>
                        {a.path && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="flex-shrink-0 h-8 w-8 p-0"
                          >
                            <a
                              href={a.path}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── Bottom Row: Full Width ─── */}
            {log.body && (
              <div className="col-span-12 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Email Content
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {log.body.includes("</") ? "HTML" : "Plain Text"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {log.body.length.toLocaleString()} chars
                    </Badge>
                  </div>
                </div>
                <div className="p-6 max-h-[600px] overflow-y-auto bg-gray-25">
                  {log.body.includes("</") ? (
                    <div
                      className="prose prose-sm max-w-none bg-white p-5 rounded-lg border"
                      dangerouslySetInnerHTML={{ __html: log.body }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-5 rounded-lg border text-gray-800">
                      {log.body}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};