import React from 'react';
import { Badge } from './badge';

interface TaskStatusBadgeProps {
  status?: 'To Do' | 'Ongoing' | 'Completed' | 'Overdue';
  className?: string;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, className = '' }) => {
  if (!status) {
    return (
      <Badge variant="outline" className={className}>
        Not Set
      </Badge>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'To Do':
        return {
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'Ongoing':
        return {
          variant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
      case 'Completed':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'Overdue':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      default:
        return {
          variant: 'outline' as const,
          className: ''
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className}`}
    >
      {status}
    </Badge>
  );
};