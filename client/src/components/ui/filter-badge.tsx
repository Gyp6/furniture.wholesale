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
        'px-5 py-4 text-base font-medium bg-blue-100 transition-colors duration-200 text-primary/70 hover:text-primary cursor-pointer',
        className,
      )}
      onClick={action}
    >
      <div className={'flex items-center gap-1'}>
        {title} <X className={'size-4'} />
      </div>
    </Badge>
  );
}
