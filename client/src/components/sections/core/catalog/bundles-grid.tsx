'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BundleCard } from '@/components/ui/bundle-card';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetSupplierBundles } from '@/hooks/queries';
import { IBundle } from '@/shared/types';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

interface Props {
  isAuthorized: boolean;
}

export function BundlesGrid({ isAuthorized }: Props) {
  const { data: bundles, isLoading } = useGetSupplierBundles();
  const router = useRouter();
  const addItem = useSpaceBundleStore(state => state.addItem);

  const handleAddBundle = (bundle: IBundle) => {
    if (addItem) {
      addItem({ nestedBundle: bundle, quantity: 1 });
      toast.success(`Bundle "${bundle.name}" added to your Space Bundle`);
    }
  };

  if (isLoading) {
    return (
      <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'}>
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-[220px] rounded-3xl'}
          />
        ))}
      </div>
    );
  }

  if (!bundles || bundles.length === 0) {
    return (
      <div className={'text-center py-20 text-muted-foreground'}>
        No bundles available at the moment.
      </div>
    );
  }

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'}>
      {bundles.map(bundle => (
        <BundleCard
          key={bundle.id}
          isAuthorized={isAuthorized}
          bundle={bundle}
          onAdd={() => handleAddBundle(bundle)}
          onClick={() => router.push(`/bundle/${bundle.id}`, { scroll: false })}
        />
      ))}
    </div>
  );
}
