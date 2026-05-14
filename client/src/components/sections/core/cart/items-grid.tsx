'use client';

import { OrderCard } from '@/components/ui/order-card';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { BundlesTitleSection } from '@/components/ui/title';

export function OrderGrid() {
  return (
    <div className="flex flex-col gap-3">
      <BundlesTitleSection title="Items" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {[...Array(5)].map((_, i) => (
          <OrderCard
            key={i}
            name={OrderCardData.name}
            vendor={OrderCardData.vendor}
            category={OrderCardData.category}
            minPieces={OrderCardData.minPieces}
            pricePerUnit={OrderCardData.pricePerUnit}
            quantity={OrderCardData.quantity}
            image={OrderCardData.image}
            onDelete={() => console.log('delete', i)}
          />
        ))}
      </div>
    </div>
  );
}