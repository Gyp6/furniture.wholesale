'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { ProductCard } from '@/components/ui';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetBundle } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

interface Props {
  params: Promise<{ id: string }>;
}

export default function BundleModalPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const { data: bundle, isLoading } = useGetBundle(id);
  const { isLoggedIn } = useAuthStatus();

  return (
    <div className={'fixed inset-0 z-50 flex items-start justify-center'}>
      {/* Overlay */}
      <div
        className={'absolute inset-0 bg-black/50 backdrop-blur-sm'}
        onClick={() => router.back()}
      />

      {/* Modal Content */}
      <div
        className={
          'relative w-full max-w-[1400px] max-h-[90vh] overflow-y-auto mt-[5vh] mx-4 bg-white rounded-[32px] shadow-2xl'
        }
      >
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className={
            'absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer'
          }
        >
          <X className={'w-5 h-5 text-neutral-600'} />
        </button>

        {/* Header */}
        <div className={'px-10 pt-10 pb-6'}>
          <h2 className={'text-3xl font-bold text-neutral-900'}>
            {bundle?.name || 'Bundle Detail'}
          </h2>
          {bundle && (
            <p className={'text-sm text-neutral-500 mt-1'}>
              {bundle.items.length} items included
            </p>
          )}
        </div>

        {/* Grid */}
        <div className={'px-10 pb-10'}>
          {isLoading ? (
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
          ) : bundle ? (
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
          ) : (
            <div className={'text-center py-10 text-muted-foreground'}>
              Bundle not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
