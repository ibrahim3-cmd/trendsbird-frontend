interface ResultsSummaryProps {
  total: number;
  currentCount: number;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  total,
  currentCount,
  limit,
  onLimitChange,
}) => {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        {total > 0 ? (
          <>
            Showing <span className="font-medium">{currentCount}</span> of{" "}
            <span className="font-medium">{total}</span> logs
          </>
        ) : (
          "No logs found"
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Show:</span>
        <select
          className="h-7 border rounded px-2 bg-background text-sm"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};