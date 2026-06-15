import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ProductCreatePage } from '@/components/pages/core/product/product-create';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default function CreateProduct() {
  return (
    <Suspense fallback={<div className={"p-10 text-center text-muted-foreground"}>Loading...</div>}>
      <ProductCreatePage />
    </Suspense>
  );
}
