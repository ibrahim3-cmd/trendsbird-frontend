// PaymentFailedLogsPage.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PaymentFailedLogsTab } from "./components/PaymentFailedLogsTab";

const PaymentFailedLogsPage = () => {
  return (
    <div className="space-y-2">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">Payment Failures</p>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentFailedLogsTab />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailedLogsPage;
