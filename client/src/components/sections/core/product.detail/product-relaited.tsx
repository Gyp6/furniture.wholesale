'use client';

import { ProductRelatedCard } from '@/components/ui/product-card';
import { ProductCardData } from '@/shared/data/core/catalog/catalog.data';

export function ProductRelated() {
  return (
    <div className={'flex flex-col gap-5'}>
      <h2 className={'text-xl font-bold'}>Related Products</h2>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5'
        }
      >
        {[...Array(6)].map((_, i) => (
          <ProductRelatedCard
            key={i}
            name={ProductCardData.name}
            vendor={ProductCardData.vendor}
            category={ProductCardData.category}
            minPieces={ProductCardData.minPieces}
            price={ProductCardData.price}
            image={ProductCardData.image}
          />
        ))}
      </div>
    </div>
  );
}
