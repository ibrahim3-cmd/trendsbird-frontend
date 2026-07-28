// components/email-logs/components/ResultsSummary.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResultsSummaryProps {
  total: number;
  currentCount: number;
  limit: number;
  onLimitChange: (limit: number) => void;
  onExport?: () => void;
  exportLoading?: boolean;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  total,
  currentCount,
  limit,
  onLimitChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{currentCount}</span> of{" "}
          <span className="font-medium">{total}</span> email logs
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </div>

      {/* {onExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={exportLoading || total === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      )} */}
    </div>
  );
};