// components/email-logs/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    const config = {
      sent: { label: "Sent", variant: "default" as const },
      delivered: { label: "Delivered", variant: "secondary" as const },
      opened: { label: "Opened", variant: "outline" as const },
      clicked: { label: "Clicked", variant: "default" as const },
      bounced: { label: "Bounced", variant: "destructive" as const },
      failed: { label: "Failed", variant: "destructive" as const },
    };

    return config[status as keyof typeof config] || { label: status, variant: "outline" as const };
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge variant={variant} className={cn("capitalize")}>
      {label}
    </Badge>
  );
};