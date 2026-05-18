import { ProductDetail } from '@/components/sections/core/product.detail/product-detail';
import { ProductRelated } from '@/components/sections/core/product.detail/product-relaited';

interface Props {
  params: Promise<{ id: string }>;
}

export async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className={'w-full mx-auto px-7 py-10 flex flex-col gap-5'}>
      <ProductDetail id={id} />
      <ProductRelated />
    </div>
  );
}
