import { useGetPaymentFailedLogStatsQuery } from "@/redux/features/paymentFailedLog/paymentFailedLogApiSlice";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, DollarSign, TrendingDown } from "lucide-react";

export const PaymentFailedLogsStats = () => {
  const { data: statsResponse, isLoading } = useGetPaymentFailedLogStatsQuery();
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Failures</p>
            <h3 className="text-2xl font-bold mt-1">{stats.totalFailures}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Unresolved</p>
            <h3 className="text-2xl font-bold mt-1 text-red-600">{stats.unresolvedFailures}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resolved</p>
            <h3 className="text-2xl font-bold mt-1 text-green-600">{stats.resolvedFailures}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Failed Amount</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalFailedAmount)}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};
