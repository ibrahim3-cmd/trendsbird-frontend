// components/email-logs/components/EmailAnalytics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, Eye, MousePointer, AlertCircle } from "lucide-react";

interface EmailAnalyticsProps {
  data: {
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
}

export const EmailAnalytics: React.FC<EmailAnalyticsProps> = ({ data }) => {
  const stats = [
    {
      label: "Total Sent",
      value: data.totalSent,
      icon: Mail,
      color: "text-blue-600",
    },
    {
      label: "Delivered",
      value: data.delivered,
      icon: CheckCircle,
      color: "text-green-600",
      rate: data.deliveryRate,
    },
    {
      label: "Opened",
      value: data.opened,
      icon: Eye,
      color: "text-purple-600",
      rate: data.openRate,
    },
    {
      label: "Clicked",
      value: data.clicked,
      icon: MousePointer,
      color: "text-orange-600",
      rate: data.clickRate,
    },
    {
      label: "Bounced",
      value: data.bounced,
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      label: "Failed",
      value: data.failed,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.rate && (
              <p className="text-xs text-muted-foreground">
                {stat.rate}% rate
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};