'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@/components/ui/shadcn/carousel';
import { BundleCard } from '@/components/ui/bundle-card';
import { IBundle } from '@/shared/types';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';
import { toast } from 'sonner';

interface CompanyBundlesProps {
  bundles: IBundle[];
  isLoading: boolean;
}

export function CompanyBundles({ bundles, isLoading }: CompanyBundlesProps) {
  const { isLoggedIn } = useAuthStatus();
  const addItem = useSpaceBundleStore(state => state.addItem);

  const handleAddBundle = (bundle: IBundle) => {
    if (addItem) {
      addItem({ nestedBundle: bundle, quantity: 1 });
      toast.success(`Bundle "${bundle.name}" added to your Space Bundle`);
    }
  };

  return (
    <div className={'flex flex-col gap-8 px-10 py-16'}>
      <h2 className={'text-3xl font-bold text-neutral-900'}>Company Bundles</h2>

      {isLoading ? (
        <div className={'flex gap-5'}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className={'flex-1 h-[300px] rounded-[32px]'} />
          ))}
        </div>
      ) : bundles.length > 0 ? (
        <Carousel
          opts={{ align: 'start', dragFree: true }}
          className={'w-full'}
        >
          <CarouselContent className={'-ml-5'}>
            {bundles.map(bundle => (
              <CarouselItem
                key={bundle.id}
                className={'pl-5 basis-full md:basis-1/2 lg:basis-[577px]'}
              >
                <BundleCard
                  isAuthorized={isLoggedIn}
                  bundle={bundle}
                  onAdd={() => handleAddBundle(bundle)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {bundles.length > 2 && (
            <CarouselNext
              className={
                'right-0 w-12 h-12 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-xl -mr-6'
              }
            />
          )}
        </Carousel>
      ) : (
        <div className={'py-20 text-center bg-neutral-50 rounded-[32px] border border-dashed border-neutral-200'}>
          <p className={'text-neutral-400 font-medium'}>This company hasn't published any bundles yet.</p>
        </div>
      )}
    </div>
  );
}
