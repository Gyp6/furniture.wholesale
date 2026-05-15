'use client';

import { ProductDetail } from '@/components/sections/core/product.detail/product-detail';
import { ProductRelated } from '@/components/sections/core/product.detail/product-relaited';

export function ProductPage() {
  return (
    <div className="w-full mx-auto px-7 py-10 flex flex-col gap-5">
      <ProductDetail />
      <ProductRelated />
    </div>
  );
}