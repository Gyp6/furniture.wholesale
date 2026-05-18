import { ProductPage } from '@/components/pages/core/product.detail/product-detail';

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Product",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Product({ params }: Props) {
  return (
    <Suspense>
      <ProductPage params={params} />
    </Suspense>
  );
}
