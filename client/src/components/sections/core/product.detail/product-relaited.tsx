import { ProductCard } from '@/components/ui';
import { productCardData } from '@/shared/data/core/catalog';

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
          <ProductCard
            key={i}
            product={{ ...productCardData, id: i.toString() }}
            isAuthorized
          />
        ))}
      </div>
    </div>
  );
}
