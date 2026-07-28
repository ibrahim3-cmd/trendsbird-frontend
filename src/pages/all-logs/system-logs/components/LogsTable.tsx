import { ILog } from "@/types/log.type";
import { Activity, User, Building } from "lucide-react";
//import { Button } from "@/components/ui/button";
import { ActionBadge } from "./ActionBadge";
import { formatDateTime } from "@/lib/utils";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";

interface LogsTableProps {
  logs: ILog[];
  loading: boolean;
}

export const LogsTable: React.FC<LogsTableProps> = ({ logs, loading }) => {
  const { data: userData } = useUserInfoQuery(undefined);
  const userRole = userData?.data?.role as string | undefined;
  const showOrg = userRole === role.superAdmin;
  if (loading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium">User</th>
                {showOrg && (
                  <th className="py-3 px-4 font-medium">Organization</th>
                )}
                <th className="py-3 px-4 font-medium">Details</th>
                <th className="py-3 px-4 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t">
                  {Array.from({ length: showOrg ? 5 : 4 }).map((__, j) => (
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
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="py-3 px-4 font-medium">Action</th>
              <th className="py-3 px-4 font-medium">User</th>
              {showOrg && (
                <th className="py-3 px-4 font-medium">Organization</th>
              )}
              <th className="py-3 px-4 font-medium">Details</th>
              <th className="py-3 px-4 font-medium text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(logs) && logs.map((log) => (
              <LogTableRow key={log._id} log={log} showOrg={showOrg} />
            ))}

            {(!Array.isArray(logs) || logs.length === 0) && (
              <tr className="border-t">
                <td
                  className="py-8 px-4 text-center text-muted-foreground"
                  colSpan={showOrg ? 5 : 4}
                >
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LogTableRow: React.FC<{ log: ILog; showOrg: boolean }> = ({
  log,
  showOrg,
}) => (
  <tr className="border-t hover:bg-muted/30 transition-colors">
    <td className="py-3 px-4">
      <ActionBadge action={log.action} />
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-muted-foreground" />
        <div>
          <div className="font-medium text-foreground">
            {log.user?.name || "Unknown User"}
          </div>
          <div className="text-xs text-muted-foreground">
            {log.user?.email || "No email"}
          </div>
        </div>
      </div>
    </td>
    {showOrg && (
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Building className="h-3 w-3 text-muted-foreground" />
          <div className="text-sm">{log.org?.orgName || "System"}</div>
        </div>
      </td>
    )}
    <td className="py-3 px-4">
      <div className="max-w-md">
        <p className="text-sm text-foreground line-clamp-2">{log.details}</p>
      </div>
    </td>
    <td className="py-3 px-4 text-right">
      <div className="text-xs text-muted-foreground">
        {formatDateTime(log.createdAt)}
      </div>
    </td>
  </tr>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center gap-2">
    <Activity className="h-8 w-8 opacity-50" />
    <p>No logs found matching your criteria</p>
  </div>
);
