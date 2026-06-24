import { Metadata } from 'next';
import { Suspense, use } from 'react';

import ProductEdit from './product-edit';

export const metadata: Metadata = {
  title: 'Edit Product',
};

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductEdit id={id} />
    </Suspense>
  );
}
