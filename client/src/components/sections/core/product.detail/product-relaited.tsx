'use client';

import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/sections/core/catalog/product-card';
import { ProductCardData } from '@/shared/data/core/catalog/catalog.data';
import { ROUTES } from '@/constants';

export function ProductRelated() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">
        {[...Array(6)].map((_, i) => (
          <ProductCard
            key={i}
            isLoggedIn={true}
            product={ProductCardData}
          />
        ))}
      </div>
    </div>
  );
}