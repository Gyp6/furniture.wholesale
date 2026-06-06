'use client';

import { useRouter } from 'next/navigation';

import { BundleCard } from '@/components/ui/bundle-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@/components/ui/shadcn/carousel';
import { ROUTES } from '@/constants';
import { BundleCardData } from '@/shared/data/core/catalog/catalog.data';

export function SupplierBundles() {
  const router = useRouter();

  return (
    <div className={'flex flex-col gap-5 px-10 py-10 bg-secondary/10'}>
      <h2 className={'text-2xl font-bold'}>Company Bundles</h2>

      <Carousel
        opts={{ align: 'start', dragFree: true }}
        className={'w-full'}
      >
        <CarouselContent className={'-ml-5 border-0'}>
          {[...Array(6)].map((_, i) => (
            <CarouselItem
              key={i}
              className={'pl-5 basis-[577px] border-0'}
            >
              <div
                className={'shadow-[0_8px_40px_rgba(0,0,0,0.08)]'}
                style={{ height: '340px' }}
              >
                <BundleCard
                  isAuthorized={true}
                  bundle={BundleCardData}
                  hideButton={true}
                  onAdd={() => router.push(ROUTES.CATALOG)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext
          className={
            'right-0 w-10 h-10 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-sm'
          }
        />
      </Carousel>
    </div>
  );
}
