import { Badge } from '@shadcn/badge';
import { X } from 'lucide-react';

import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  title: string;
  action: () => void;
}

export function FilterBadge({ className = '', title, action }: Props) {
  return (
    <Badge
      className={cn(
        'rounded-full px-4 h-[40px] text-sm flex items-center gap-2 cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 shadow-none font-medium',
        className,
      )}
      onClick={action}
    >
      <span className={'flex items-center gap-1.5'}>
        {title} <X className={'size-3.5'} />
      </span>
    </Badge>
  );
}
