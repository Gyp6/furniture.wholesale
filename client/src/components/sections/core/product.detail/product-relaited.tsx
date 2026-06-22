'use client';

import { ProductCard } from '@/components/ui';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetProducts } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

export function ProductRelated() {
  const { data: response, isLoading } = useGetProducts({ limit: 6 });
  const { isLoggedIn } = useAuthStatus();

  return (
    <div className={'flex flex-col gap-6 mt-4'}>
      <h2 className={'text-xl font-bold text-neutral-900'}>Related Products</h2>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5'
        }
      >
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className={'aspect-square rounded-[20px]'}
              />
            ))
          : (response?.items || []).slice(0, 6).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isAuthorized={isLoggedIn}
              />
            ))}
      </div>
    </div>
  );
}
