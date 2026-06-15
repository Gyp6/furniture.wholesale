'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ui';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Button } from '@/components/ui/shadcn/button';
import { useGetSharedBundle } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import { useForkBundle } from '@/hooks/queries/bundle.query';
import { toast } from 'sonner';
import { GitFork, Users } from 'lucide-react';

interface Props {
  params: Promise<{ token: string }>;
}

export function SharedBundleDetailPage({ params }: Props) {
  const { token } = use(params);
  const router = useRouter();
  const { data: bundle, isLoading, isLoadingError } = useGetSharedBundle(token);
  const { isLoggedIn } = useAuthStatus();
  const forkMutation = useForkBundle();
  const [isForking, setIsForking] = useState(false);

  const handleFork = async () => {
    if (!bundle) return;

    setIsForking(true);
    try {
      const forkedBundle = await forkMutation.mutateAsync(bundle.id);
      toast.success('Project successfully forked to your drafts');
      router.push(`/bundle/${forkedBundle.id}`);
    } catch (error) {
      toast.error('Failed to fork project');
      console.error('Fork error:', error);
    } finally {
      setIsForking(false);
    }
  };

  if (isLoading) {
    return (
      <div className={'w-full'}>
        <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'}>
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className={'aspect-square rounded-[20px]'} />
          ))}
        </div>
      </div>
    );
  }

  if (!bundle || isLoadingError) {
    return (
      <div className={'p-10 text-center text-red-500 font-medium'}>
        Failed to load shared project details. The link may be invalid.
      </div>
    );
  }

  return (
    <div className={'w-full flex flex-col gap-6'}>
      <div className={'flex flex-col gap-3 mb-4'}>
        <div className={'flex items-start justify-between gap-4'}>
          <div className={'flex flex-col gap-1'}>
            <h1 className={'text-4xl font-medium tracking-tight'}>{bundle.name}</h1>
            <p className={'text-muted-foreground'}>{bundle.description || 'Shared project'}</p>
          </div>
          {isLoggedIn && (
            <Button
              onClick={handleFork}
              disabled={isForking}
              size={"lg"}
              variant={"outline"}
              className={'flex items-center gap-2'}
            >
              <GitFork className={'w-4 h-4'} />
              {isForking ? 'Forking...' : 'Fork Project'}
            </Button>
          )}
        </div>

        <div className={'flex items-center gap-4 text-sm text-muted-foreground'}>
          <div className={'flex items-center gap-1'}>
            <Users className={'w-4 h-4'} />
            <span>Public Access</span>
          </div>
          <span>•</span>
          <span>{bundle.items.length} {bundle.items.length === 1 ? 'item' : 'items'}</span>
          {bundle.totalPrice > 0 && (
            <>
              <span>•</span>
              <span className={'font-medium'}>Total: ${bundle.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </>
          )}
        </div>
      </div>

      {bundle.items.length === 0 ? (
        <div className={'p-10 text-center text-muted-foreground'}>
          This project has no items yet
        </div>
      ) : (
        <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'}>
          {bundle.items.map(item => {
            if (!item.product && !item.nestedBundle) return null;

            // If it's a product, show the product card
            if (item.product) {
              return (
                <ProductCard
                  key={item.product.id}
                  isAuthorized={isLoggedIn}
                  product={item.product}
                />
              );
            }

            // If it's a nested bundle, show its products
            if (item.nestedBundle) {
              return item.nestedBundle.items.map(nestedItem => {
                if (!nestedItem.product) return null;
                return (
                  <ProductCard
                    key={nestedItem.product.id}
                    isAuthorized={isLoggedIn}
                    product={nestedItem.product}
                  />
                );
              });
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
