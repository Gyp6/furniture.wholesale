import { ProductDetail } from '@/components/sections/core/product.detail/product-detail';
import { ProductRelated } from '@/components/sections/core/product.detail/product-relaited';

interface Props {
  params: Promise<{ id: string }>;
}

export async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className={'w-full max-w-[1400px] mx-auto flex flex-col gap-10'}>
      <ProductDetail id={id} />
      <ProductRelated />
    </div>
  );
}
