import Link from 'next/link';

import { cn } from '@/lib/cn';
import type { TMenuItem } from '@/shared/types';

interface Props {
  menuItem: TMenuItem;
  isActive: boolean;
  className?: string;
}

export function MenuItem({ menuItem, isActive, className = '' }: Props) {
  return (
    <Link
      href={menuItem.href}
      className={cn(
        'text-base text-neutral-300 hover:text-white transition-colors',
        !!isActive ? 'text-white hover:text-white/80' : '',
        className,
      )}
    >
      {menuItem.label}
    </Link>
  );
}
