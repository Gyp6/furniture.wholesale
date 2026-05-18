'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

import { MenuItem } from '@/components/ui/menu-item';
import { NavConfig } from '@/config/nav.config';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export function HeaderNav({ className = '' }: Props) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center gap-10', className)}>
      {NavConfig.map(menuItem => (
        <MenuItem
          key={menuItem.label}
          menuItem={menuItem}
          isActive={!!match(menuItem.href)(pathname)}
        />
      ))}
    </nav>
  );
}
