'use client';

import { BundleCard } from '@/components/ui/bundle-card';
import { bundleCardData } from '@/shared/data/core/catalog';

interface Props {
  isAuthorized: boolean;
}

export function BundlesGrid({ isAuthorized }: Props) {
  return (
    <div
      className={
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5'
      }
    >
      {[...Array(15)].map((_, i) => (
        <BundleCard
          key={i}
          isAuthorized={isAuthorized}
          bundle={{ ...bundleCardData, id: i.toString() }}
        />
      ))}
    </div>
  );
}
