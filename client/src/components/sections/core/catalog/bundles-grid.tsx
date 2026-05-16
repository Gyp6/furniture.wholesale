'use client';

import { useRouter } from 'next/navigation';

import { BundleCard } from '@/components/ui/bundle-card';
import { ROUTES } from '@/constants';
import { BundleCardData } from '@/shared/data/core/catalog/catalog.data';

export function BundlesGrid() {
  const router = useRouter();

  return (
    <div className={'container mx-auto px-6 py-10'}>
      <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'}>
        {[...Array(15)].map((_, i) => (
          <BundleCard
            key={i}
            name={BundleCardData.name}
            vendor={BundleCardData.vendor}
            description={BundleCardData.description}
            price={BundleCardData.price}
            itemsCount={BundleCardData.itemsCount}
            images={BundleCardData.images}
            onAdd={() => router.push(ROUTES.CATALOG)}
          />
        ))}
      </div>
    </div>
  );
}
