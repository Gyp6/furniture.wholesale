'use client';

import { use } from 'react';

import { ProductCard } from '@/components/ui';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetBundle } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

interface Props {
  params: Promise<{ id: string }>;
}

export function BundleDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: bundle, isLoading, isLoadingError } = useGetBundle(id);
  const { isLoggedIn } = useAuthStatus();

  if (isLoading) {
    return (
      <div className={'w-full'}>
        <div className={'flex flex-col gap-3 mb-6'}>
          <Skeleton className={'h-10 w-64'} />
          <Skeleton className={'h-5 w-96'} />
        </div>
        <div
          className={
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'
          }
        >
          {[...Array(12)].map((_, i) => (
            <Skeleton
              key={i}
              className={'aspect-square rounded-[20px]'}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!bundle || isLoadingError) {
    return (
      <div className={'p-10 text-center text-red-500 font-medium'}>
        Failed to load project details
      </div>
    );
  }

  return (
    <div className={'w-full flex flex-col gap-6'}>
      <div className={'flex flex-col gap-3 mb-4'}>
        <div className={'flex items-start justify-between gap-4'}>
          <div className={'flex flex-col gap-1'}>
            <h1 className={'text-4xl font-medium tracking-tight'}>{bundle.name}</h1>
            <p className={'text-muted-foreground'}>{bundle.description || 'Project'}</p>
          </div>
        </div>

        <div className={'flex items-center gap-4 text-sm text-muted-foreground'}>
          <span>{bundle.items.length} {bundle.items.length === 1 ? 'item' : 'items'}</span>
          {bundle.totalPrice > 0 && (
            <>
              <span>•</span>
              <span className={'font-medium'}>Total: ${bundle.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </>
          )}
          <span>•</span>
          <span>Status: {bundle.status}</span>
        </div>
      </div>

      {bundle.items.length === 0 ? (
        <div className={'p-10 text-center text-muted-foreground'}>
          This project has no items yet
        </div>
      ) : (
        <div
          className={
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'
          }
        >
          {bundle.items.map(item => {
            if (!item.product) return null;
            return (
              <ProductCard
                key={item.product.id}
                isAuthorized={isLoggedIn}
                product={item.product}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
