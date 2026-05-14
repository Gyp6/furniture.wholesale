import { ProductCard } from '@/components/ui';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { getServerSession } from '@/services';
import { productCardData } from '@/shared/data/core/catalog';

export async function ProductGrid() {
  const { session } = (await getServerSession()) || {};
  const isAuthorized = !!session;

  return (
    <div
      className={
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5'
      }
    >
      {[...Array(20)].map((_, i) => (
        <ProductCard
          key={i}
          isLoggedIn={isAuthorized}
          product={{ ...productCardData, id: i.toString() }}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <>
      <Skeleton />
    </>
  );
}
