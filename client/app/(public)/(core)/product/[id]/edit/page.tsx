import { use } from 'react';

import { ProductEditPage } from '@/components/pages/core/product/product-edit';

export default function ProductEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ProductEditPage productId={id} />;
}
