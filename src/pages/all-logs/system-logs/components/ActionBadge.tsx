import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActionBadgeProps {
  action: string;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (actionLower.includes('login') || actionLower.includes('auth')) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("text-xs font-medium", getActionColor(action))}
    >
      {action}
    </Badge>
  );
};