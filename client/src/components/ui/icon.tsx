'use client';

import { Suspense, useMemo } from 'react';

import { cn } from '@/lib/cn';
import type { IconName } from '@/shared/data/icons';
import { BRANDS_MONOCHROME } from '@/shared/data/icons/brands';
import { BRANDS } from '@/shared/data/icons/brands';
import type { BrandName } from '@/shared/data/icons/brands';
import { ICONS } from '@/shared/data/icons/icons';
import { lucideRegistry } from '@/shared/data/icons/lucide-registry';
import { ROLES } from '@/shared/data/icons/roles';
import type { TBrandProps, TIconProps } from '@/shared/types';

const customRegistry: Record<string, React.ComponentType<TIconProps>> = {
  ...ICONS,
  ...ROLES,
  ...BRANDS_MONOCHROME,
};

const SkeletonIcon = ({ size }: { size: number }) => (
  <div
    style={{ width: size, height: size }}
    className={'shrink-0 animate-pulse bg-muted/20 rounded'}
  />
);

export const Icon = ({
  name,
  size = 22,
  color = 'currentColor',
  className,
}: { name: IconName } & TIconProps) => {
  const IconComponent = useMemo(() => {
    if (name in customRegistry) return customRegistry[name];
    return lucideRegistry[name] ?? lucideRegistry['HelpCircle'];
  }, [name]);

  const isLazy = !(name in customRegistry);

  const icon = (
    <IconComponent
      size={size}
      color={color}
    />
  );

  return (
    <div
      style={{ width: size, height: size }}
      className={cn('flex items-center justify-center shrink-0', className)}
    >
      {isLazy ? (
        <Suspense fallback={<SkeletonIcon size={Number(size)} />}>{icon}</Suspense>
      ) : (
        icon
      )}
    </div>
  );
};

export const BrandIcon = ({
  name,
  size = 22,
  className,
}: { name: BrandName } & TBrandProps) => {
  const BrandComponent = BRANDS[name];

  if (!BrandComponent) return null;

  return (
    <div
      style={{ width: size, height: size }}
      className={cn('flex items-center justify-center shrink-0', className)}
    >
      <BrandComponent size={size} />
    </div>
  );
};
