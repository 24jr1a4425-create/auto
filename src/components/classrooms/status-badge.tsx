import { cn } from '@/lib/utils';
import type { ClassroomStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: ClassroomStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        'transition-colors',
        status === 'Available'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
      )}
      variant="outline"
    >
      <div className={cn('h-2 w-2 rounded-full mr-2', status === 'Available' ? 'bg-green-500' : 'bg-red-500')} />
      {status}
    </Badge>
  );
}
