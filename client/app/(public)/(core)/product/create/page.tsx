import type { Metadata } from 'next';
import { Suspense } from 'react';

import CreateProduct from './product-create';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default function CreateProductPage() {
  return (
    <Suspense
      fallback={
        <div className={'p-10 text-center text-muted-foreground'}>
          Loading...
        </div>
      }
    >
      <CreateProduct />
    </Suspense>
  );
}
