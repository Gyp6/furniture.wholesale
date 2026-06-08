'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

import { MenuItem } from '@/components/ui/menu-item';
import { NavConfig, NavSupplierConfig } from '@/config/nav.config';
import { cn } from '@/lib/cn';
import { IFullBaUser } from '@/shared/types';

interface Props {
  className?: string;
  user: IFullBaUser | null;
}

export function HeaderNav({ className = '', user }: Props) {
  const pathname = usePathname();
  const navConfig = user?.role === 'SUPPLIER' ? NavSupplierConfig : NavConfig;

  return (
    <nav className={cn('flex items-center gap-10', className)}>
      {navConfig.map(menuItem => (
        <MenuItem
          key={menuItem.label}
          menuItem={menuItem}
          isActive={!!match(menuItem.href)(pathname)}
        />
      ))}
    </nav>
  );
}
